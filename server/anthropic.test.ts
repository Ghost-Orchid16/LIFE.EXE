import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Stage } from "../shared/contract.ts";
import { readConfig } from "./config.ts";
import { createAnthropicProvider } from "./providers/anthropic.ts";
import { sampleResponse } from "./test-helpers.ts";

interface CapturedRequest {
  url: string;
  headers: Headers;
  body: Record<string, unknown>;
}

/** Builds a Messages API event stream that writes `text` in small chunks. */
function messageStream(text: string, stopReason = "end_turn"): string {
  const event = (type: string, data: unknown) => `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  const chunks = text.match(/[\s\S]{1,24}/g) ?? [];
  return [
    event("message_start", {
      type: "message_start",
      message: {
        id: "msg_test",
        type: "message",
        role: "assistant",
        model: "claude-opus-5",
        content: [],
        stop_reason: null,
        stop_sequence: null,
        usage: { input_tokens: 10, output_tokens: 1 },
      },
    }),
    event("content_block_start", { type: "content_block_start", index: 0, content_block: { type: "text", text: "" } }),
    ...chunks.map((chunk) =>
      event("content_block_delta", { type: "content_block_delta", index: 0, delta: { type: "text_delta", text: chunk } }),
    ),
    event("content_block_stop", { type: "content_block_stop", index: 0 }),
    event("message_delta", { type: "message_delta", delta: { stop_reason: stopReason, stop_sequence: null }, usage: { output_tokens: 42 } }),
    event("message_stop", { type: "message_stop" }),
  ].join("");
}

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

const streamResponse = (text: string, stopReason?: string) => () =>
  new Response(messageStream(text, stopReason), { status: 200, headers: { "content-type": "text/event-stream" } });

const config = { ...readConfig({ AI_API_KEY: "sk-test" }), apiKey: "sk-test" };
const conversation = [{ role: "user" as const, content: "I have two job offers." }];

async function run(respond: () => Response, model = config.model) {
  const api = fakeApi(respond);
  const provider = createAnthropicProvider({ ...config, model }, { fetch: api.fetch });
  const stages: Stage[] = [];
  const result = provider.respond(conversation, { signal: new AbortController().signal, onStage: (s) => stages.push(s) });
  return { result, stages, requests: api.requests };
}

describe("Anthropic provider", () => {
  it("streams a structured answer and reports progress from it", async () => {
    const expected = sampleResponse();
    const { result, stages, requests } = await run(streamResponse(JSON.stringify(expected)));
    assert.deepEqual(await result, expected);
    assert.deepEqual(stages, ["understanding", "context", "options", "next"]);

    const [request] = requests;
    assert.match(request.url, /^https:\/\/api\.anthropic\.com\/v1\/messages/);
    assert.equal(request.headers.get("x-api-key"), "sk-test");
    assert.match(request.headers.get("anthropic-beta") ?? "", /server-side-fallback-2026-07-01/);
    assert.equal(request.body.model, "claude-opus-5");
    assert.equal(request.body.stream, true);
    assert.equal(request.body.fallbacks, "default");
    assert.deepEqual(request.body.thinking, { type: "adaptive" });
    assert.deepEqual(request.body.cache_control, { type: "ephemeral" });
    const outputConfig = request.body.output_config as { effort: string; format: { type: string; schema: { additionalProperties: boolean } } };
    assert.equal(outputConfig.effort, "low");
    assert.equal(outputConfig.format.type, "json_schema");
    assert.equal(outputConfig.format.schema.additionalProperties, false);
    assert.deepEqual(request.body.messages, conversation);
  });

  it("sends earlier answers back as the assistant's turns", async () => {
    const api = fakeApi(streamResponse(JSON.stringify(sampleResponse())));
    const provider = createAnthropicProvider(config, { fetch: api.fetch });
    const previous = sampleResponse({ lead: "Earlier answer." });
    await provider.respond(
      [...conversation, { role: "assistant", content: previous }, { role: "user", content: "Be more direct." }],
      { signal: new AbortController().signal, onStage: () => {} },
    );
    const messages = api.requests[0].body.messages as Array<{ role: string; content: string }>;
    assert.deepEqual(messages.map((m) => m.role), ["user", "assistant", "user"]);
    assert.deepEqual(JSON.parse(messages[1].content), previous);
  });

  it("leaves out newer-model options for older models", async () => {
    const { result, requests } = await run(streamResponse(JSON.stringify(sampleResponse())), "claude-haiku-4-5");
    await result;
    const body = requests[0].body;
    assert.equal(body.thinking, undefined);
    assert.equal(body.fallbacks, undefined);
    assert.equal((body.output_config as { effort?: string }).effort, undefined);
  });

  it("treats a refusal as a refusal", async () => {
    const { result } = await run(streamResponse("", "refusal"));
    await assert.rejects(result, { code: "refused" });
  });

  it("rejects answers that don't match the schema", async () => {
    await assert.rejects((await run(streamResponse('{"lead": "only this"}'))).result, { code: "invalid_response" });
    await assert.rejects((await run(streamResponse('{"lead": "cut off'))).result, { code: "invalid_response" });
    await assert.rejects((await run(streamResponse(JSON.stringify(sampleResponse()), "max_tokens"))).result, {
      code: "invalid_response",
    });
  });

  it("explains authentication problems as the AI being unavailable", async () => {
    const unauthorized = () =>
      new Response(JSON.stringify({ type: "error", error: { type: "authentication_error", message: "invalid x-api-key" } }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    await assert.rejects((await run(unauthorized)).result, { code: "unavailable" });
  });

  it("reports an overloaded API", async () => {
    const overloaded = () =>
      new Response(JSON.stringify({ type: "error", error: { type: "overloaded_error", message: "Overloaded" } }), {
        status: 529,
        headers: { "content-type": "application/json", "retry-after-ms": "0" },
      });
    await assert.rejects((await run(overloaded)).result, { code: "overloaded" });
  });
});
