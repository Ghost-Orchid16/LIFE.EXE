import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Stage } from "../shared/contract.ts";
import { readConfig } from "./config.ts";
import { SYSTEM_PROMPT } from "./prompt.ts";
import { createGeminiProvider } from "./providers/gemini.ts";
import { sampleResponse } from "./test-helpers.ts";

interface CapturedRequest {
  url: string;
  headers: Headers;
  body: Record<string, unknown>;
}

interface JsonSchemaObject {
  additionalProperties: boolean;
  propertyOrdering: string[];
  properties: Record<string, unknown>;
}

/** A Gemini streaming response (server-sent events), one event per payload. */
const events =
  (...payloads: unknown[]) =>
  () =>
    new Response(payloads.map((payload) => `data: ${JSON.stringify(payload)}\n\n`).join(""), {
      status: 200,
      headers: { "content-type": "text/event-stream" },
    });

/** Streams `text` in small chunks, ending with `finishReason`, the way generateContentStream delivers it. */
function streamResponse(text: string, finishReason = "STOP", firstParts: unknown[] = []) {
  const chunks = text.match(/[\s\S]{1,24}/g) ?? [""];
  return events(
    ...chunks.map((chunk, index) => ({
      candidates: [
        {
          content: { role: "model", parts: [...(index === 0 ? firstParts : []), { text: chunk }] },
          index: 0,
          ...(index === chunks.length - 1 && { finishReason }),
        },
      ],
      modelVersion: "gemini-3.8-flash",
    })),
  );
}

const apiError = (status: number, error: Record<string, unknown>) => () =>
  new Response(JSON.stringify({ error: { code: status, ...error } }), {
    status,
    headers: { "content-type": "application/json" },
  });

function fakeApi(respond: () => Response) {
  const requests: CapturedRequest[] = [];
  const fetch = async (input: string | URL | Request, init?: RequestInit) => {
    requests.push({
      url: String(input instanceof Request ? input.url : input),
      headers: new Headers(init?.headers),
      body: JSON.parse(String(init?.body)),
    });
    return respond();
  };
  return { fetch: fetch as typeof globalThis.fetch, requests };
}

const config = { ...readConfig({ GEMINI_API_KEY: "test-key" }), apiKey: "test-key" };
const conversation = [{ role: "user" as const, content: "I have two job offers." }];
// Retry immediately so the retry path is exercised without slowing the tests down.
const retry = { attempts: 2, initialDelay: 0 };

async function run(respond: () => Response, model = config.model) {
  const api = fakeApi(respond);
  const provider = createGeminiProvider({ ...config, model }, { fetch: api.fetch, retry });
  const stages: Stage[] = [];
  const result = provider.respond(conversation, { signal: new AbortController().signal, onStage: (s) => stages.push(s) });
  return { result, stages, requests: api.requests };
}

describe("Gemini provider", () => {
  it("streams a structured answer and reports progress from it", async () => {
    const expected = sampleResponse();
    const { result, stages, requests } = await run(streamResponse(JSON.stringify(expected)));
    assert.deepEqual(await result, expected);
    assert.deepEqual(stages, ["understanding", "thinking", "answering"]);

    const [request] = requests;
    assert.equal(
      request.url,
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:streamGenerateContent?alt=sse",
    );
    assert.equal(request.headers.get("x-goog-api-key"), "test-key");
    assert.deepEqual(request.body.contents, [{ role: "user", parts: [{ text: "I have two job offers." }] }]);
    const systemInstruction = request.body.systemInstruction as { parts: unknown };
    assert.deepEqual(systemInstruction.parts, [{ text: SYSTEM_PROMPT }]);
    const generationConfig = request.body.generationConfig as {
      responseMimeType: string;
      responseJsonSchema: JsonSchemaObject;
      thinkingConfig: unknown;
    };
    assert.equal(generationConfig.responseMimeType, "application/json");
    assert.deepEqual(generationConfig.thinkingConfig, { thinkingLevel: "LOW" });
    const schema = generationConfig.responseJsonSchema;
    assert.equal(schema.additionalProperties, false);
    // Fields must come back in schema order: the progress stages follow them.
    assert.deepEqual(schema.propertyOrdering, Object.keys(schema.properties));
    assert.deepEqual(schema.propertyOrdering.slice(0, 3), ["care", "answer", "points"]);
    assert.ok(schema.propertyOrdering.indexOf("answer") < schema.propertyOrdering.indexOf("nextMove"));
  });

  it("sends earlier answers back as the assistant's turns", async () => {
    const api = fakeApi(streamResponse(JSON.stringify(sampleResponse())));
    const provider = createGeminiProvider(config, { fetch: api.fetch, retry });
    const previous = sampleResponse({ answer: "Earlier answer." });
    await provider.respond(
      [...conversation, { role: "assistant", content: previous }, { role: "user", content: "Be more direct." }],
      { signal: new AbortController().signal, onStage: () => {} },
    );
    const contents = api.requests[0].body.contents as Array<{ role: string; parts: Array<{ text: string }> }>;
    assert.deepEqual(contents.map((c) => c.role), ["user", "model", "user"]);
    assert.deepEqual(JSON.parse(contents[1].parts[0].text), previous);
    assert.equal(contents[2].parts[0].text, "Be more direct.");
  });

  it("leaves out newer-model options for older models", async () => {
    const { result, requests } = await run(streamResponse(JSON.stringify(sampleResponse())), "gemini-2.5-flash");
    await result;
    assert.match(requests[0].url, /\/models\/gemini-2\.5-flash:streamGenerateContent/);
    const generationConfig = requests[0].body.generationConfig as Record<string, unknown>;
    assert.equal(generationConfig.thinkingConfig, undefined);
  });

  it("treats a refusal as a refusal", async () => {
    const blockedPrompt = events({ promptFeedback: { blockReason: "SAFETY" } });
    await assert.rejects((await run(blockedPrompt)).result, { code: "refused" });
    const stoppedForSafety = events({ candidates: [{ finishReason: "SAFETY", index: 0 }] });
    await assert.rejects((await run(stoppedForSafety)).result, { code: "refused" });
  });

  it("rejects answers that don't match the schema", async () => {
    await assert.rejects((await run(streamResponse('{"answer": "only this"}'))).result, { code: "invalid_response" });
    await assert.rejects((await run(streamResponse('{"answer": "cut off'))).result, { code: "invalid_response" });
    await assert.rejects((await run(streamResponse(JSON.stringify(sampleResponse()), "MAX_TOKENS"))).result, {
      code: "invalid_response",
    });
  });

  it("explains authentication problems as the AI being unavailable", async () => {
    // The Gemini API's actual reply to an invalid key.
    const invalidKey = apiError(400, {
      message: "API key not valid. Please pass a valid API key.",
      status: "INVALID_ARGUMENT",
      details: [{ "@type": "type.googleapis.com/google.rpc.ErrorInfo", reason: "API_KEY_INVALID" }],
    });
    const { result, requests } = await run(invalidKey);
    await assert.rejects(result, { code: "unavailable" });
    assert.equal(requests.length, 1, "a bad key is not retried");
  });

  it("reports an overloaded API", async () => {
    const overloaded = apiError(503, { message: "The model is overloaded. Please try again later.", status: "UNAVAILABLE" });
    const { result, requests } = await run(overloaded);
    await assert.rejects(result, { code: "overloaded" });
    assert.equal(requests.length, 2, "retried once before giving up");
  });

  it("reports free-tier rate limits", async () => {
    const quota = apiError(429, { message: "You exceeded your current quota.", status: "RESOURCE_EXHAUSTED" });
    await assert.rejects((await run(quota)).result, { code: "rate_limited" });
  });

  it("never passes the model's thinking through", async () => {
    const expected = sampleResponse();
    const thought = { text: "Private reasoning about the options.", thought: true };
    const { result } = await run(streamResponse(JSON.stringify(expected), "STOP", [thought]));
    assert.deepEqual(await result, expected);
  });
});
