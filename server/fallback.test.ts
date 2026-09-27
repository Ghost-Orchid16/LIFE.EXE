import type { HttpRetryOptions } from "@google/genai";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ChatMessage, LifeResponse, StreamEvent } from "../shared/contract.ts";
import { readConfig } from "./config.ts";
import { buildDemoResponse } from "./demo/engine.ts";
import { createProvider, handleLifeRequest } from "./handler.ts";
import { createDemoProvider } from "./providers/demo.ts";
import { withFallback } from "./providers/fallback.ts";
import { createGeminiProvider } from "./providers/gemini.ts";
import type { LifeProvider } from "./providers/types.ts";
import { readEvents, sampleResponse } from "./test-helpers.ts";

const URL = "http://localhost/api/life";
const config = { ...readConfig({ GEMINI_API_KEY: "test-key" }), apiKey: "test-key" };
const conversation: ChatMessage[] = [{ role: "user", content: "I got two job offers and I can't pick one." }];
const GEMINI_ANSWER = sampleResponse({ answer: "Gemini's own answer." });
// What demo mode says to the same message: the fallback must be exactly the existing demo engine.
const DEMO_ANSWER = buildDemoResponse(conversation);

/** How Gemini behaves for one request. */
type Behaviour = "answer" | 429 | 500 | 503 | "slow" | "unreachable" | "refuse" | "bad key" | "cut off";

const sse = (...payloads: unknown[]) =>
  new Response(payloads.map((payload) => `data: ${JSON.stringify(payload)}\n\n`).join(""), {
    status: 200,
    headers: { "content-type": "text/event-stream" },
  });

const answer = (response: LifeResponse, finishReason = "STOP") =>
  sse({ candidates: [{ content: { role: "model", parts: [{ text: JSON.stringify(response) }] }, index: 0, finishReason }] });

const apiError = (code: number, status: string, message: string) =>
  new Response(JSON.stringify({ error: { code, status, message } }), { status: code, headers: { "content-type": "application/json" } });

/** Stands in for Google's Gemini API: request n behaves as `plan[n]` (the last one repeats). */
function fakeGemini(...plan: Behaviour[]) {
  let calls = 0;
  const fetch = async (_input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const behaviour = plan[Math.min(calls, plan.length - 1)];
    calls += 1;
    switch (behaviour) {
      case "answer":
        return answer(GEMINI_ANSWER);
      case 429:
        return apiError(429, "RESOURCE_EXHAUSTED", "You exceeded your current quota.");
      case 500:
        return apiError(500, "INTERNAL", "An internal error has occurred.");
      case 503:
        return apiError(503, "UNAVAILABLE", "The model is overloaded. Please try again later.");
      case "slow":
        // Never answers; gives up only when the request is aborted (at once if it already was, like fetch).
        return new Promise((_resolve, reject) => {
          const aborted = () => reject(new DOMException("The operation was aborted.", "AbortError"));
          if (init?.signal?.aborted) aborted();
          else init?.signal?.addEventListener("abort", aborted);
        });
      case "unreachable":
        throw new TypeError("fetch failed");
      case "refuse":
        return sse({ promptFeedback: { blockReason: "SAFETY" } });
      case "bad key":
        return apiError(400, "INVALID_ARGUMENT", "API key not valid. Please pass a valid API key.");
      case "cut off":
        return answer(GEMINI_ANSWER, "MAX_TOKENS");
    }
  };
  return { fetch: fetch as typeof globalThis.fetch, calls: () => calls };
}

interface LiveModeOptions {
  liveTimeoutMs?: number;
  retry?: HttpRetryOptions;
}

/** Live mode as `createProvider` sets it up, with a fake Gemini, no retries and a demo engine that doesn't pause. */
function liveMode(gemini: ReturnType<typeof fakeGemini>, { liveTimeoutMs = 2000, retry = { attempts: 1 } }: LiveModeOptions = {}): LifeProvider {
  const live = createGeminiProvider(config, { fetch: gemini.fetch, retry });
  return withFallback(live, createDemoProvider({ stageMs: 0 }), { liveTimeoutMs });
}

const post = (messages: ChatMessage[]) =>
  new Request(URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages }) });

/** Sends `messages` to the API and returns what the browser receives, with the server's warnings kept aside. */
async function ask(provider: LifeProvider | undefined, messages = conversation, env: Record<string, string> = {}) {
  const warnings: string[] = [];
  const { warn, error } = console;
  console.warn = console.error = (...args: unknown[]) => warnings.push(args.map(String).join(" "));
  try {
    const events = await readEvents(await handleLifeRequest(post(messages), env, provider ? { provider } : {}));
    const result = events.find((event): event is Extract<StreamEvent, { type: "result" }> => event.type === "result");
    return { events, warnings, result: result?.response };
  } finally {
    Object.assign(console, { warn, error });
  }
}

const kinds = (events: StreamEvent[]) => events.map((event) => (event.type === "stage" ? `stage:${event.stage}` : event.type));

const FELL_BACK = ["meta", "stage:understanding", "fallback", "stage:thinking", "stage:answering", "result"];

describe("Live mode, when Gemini answers", () => {
  it("shows Gemini's answer, exactly as before", async () => {
    const gemini = fakeGemini("answer");
    const { events, result, warnings } = await ask(liveMode(gemini));
    assert.deepEqual(kinds(events), ["meta", "stage:understanding", "stage:thinking", "stage:answering", "result"]);
    assert.deepEqual(events[0], { type: "meta", mode: "live" });
    assert.deepEqual(result, GEMINI_ANSWER);
    assert.equal(gemini.calls(), 1);
    assert.deepEqual(warnings, []);
  });
});

describe("Live mode, when Gemini fails for a passing reason", () => {
  for (const [name, behaviour, code] of [
    ["is rate limited (429)", 429, "rate_limited"],
    ["is overloaded (503)", 503, "overloaded"],
    ["has an internal error (500)", 500, "server_error"],
    ["can't be reached", "unreachable", "unavailable"],
  ] as const) {
    it(`answers from the demo engine when Gemini ${name}`, async () => {
      const { events, result, warnings } = await ask(liveMode(fakeGemini(behaviour)));
      assert.deepEqual(kinds(events), FELL_BACK);
      assert.deepEqual(result, DEMO_ANSWER);
      // The browser is told only that this answer came from the demo; the details stay in the server log.
      assert.deepEqual(events.find((event) => event.type === "fallback"), { type: "fallback" });
      assert.doesNotMatch(JSON.stringify(events), /quota|overloaded|internal error|fetch failed|RESOURCE_EXHAUSTED|UNAVAILABLE|INTERNAL/);
      assert.equal(warnings.length, 1);
      assert.match(warnings[0], new RegExp(`\\(${code}\\); answering from the demo instead`));
    });
  }

  it("answers from the demo engine when Gemini is too slow, in time to finish before the hosting limit", { timeout: 5000 }, async () => {
    const gemini = fakeGemini("slow");
    const started = Date.now();
    const { events, result } = await ask(liveMode(gemini, { liveTimeoutMs: 60 }));
    assert.deepEqual(kinds(events), FELL_BACK);
    assert.deepEqual(result, DEMO_ANSWER);
    assert.ok(Date.now() - started < 1500, "the slow request was given up on");
  });

  it("retries Gemini once first, as before, when retries are on", async () => {
    const gemini = fakeGemini(503);
    const { events, result } = await ask(liveMode(gemini, { retry: { attempts: 2, initialDelay: 0 } }));
    assert.equal(gemini.calls(), 2);
    assert.deepEqual(kinds(events), FELL_BACK);
    assert.deepEqual(result, DEMO_ANSWER);
  });

  it("tries Gemini again on the next message: one fallback doesn't switch LIFE.EXE to demo mode", async () => {
    const gemini = fakeGemini(429, "answer");
    const provider = liveMode(gemini);

    const first = await ask(provider);
    assert.deepEqual(first.result, DEMO_ANSWER);

    // The follow-up carries the demo answer in its history, and still goes to Gemini.
    const followUp: ChatMessage[] = [...conversation, { role: "assistant", content: DEMO_ANSWER }, { role: "user", content: "What if I choose wrong?" }];
    const second = await ask(provider, followUp);
    assert.equal(gemini.calls(), 2);
    assert.deepEqual(kinds(second.events), ["meta", "stage:understanding", "stage:thinking", "stage:answering", "result"]);
    assert.deepEqual(second.events[0], { type: "meta", mode: "live" });
    assert.deepEqual(second.result, GEMINI_ANSWER);

    const status = await handleLifeRequest(new Request(URL), { GEMINI_API_KEY: "test-key" }, { provider });
    assert.deepEqual(await status.json(), { mode: "live" });
  });

  it("doesn't answer at all once the person has gone", { timeout: 5000 }, async () => {
    const provider = liveMode(fakeGemini("slow"), { liveTimeoutMs: 5000 });
    const leaving = new AbortController();
    let fellBack = false;
    const pending = provider.respond(conversation, {
      signal: leaving.signal,
      onStage: () => {},
      onFallback: () => {
        fellBack = true;
      },
    });
    setTimeout(() => leaving.abort(), 20);
    await assert.rejects(pending, { code: "timeout" });
    assert.equal(fellBack, false);
  });

  it("doesn't keep Gemini working for someone who has already gone", { timeout: 2000 }, async () => {
    const provider = liveMode(fakeGemini("slow"), { liveTimeoutMs: 5000 });
    const gone = new AbortController();
    gone.abort();
    let fellBack = false;
    const options = { signal: gone.signal, onStage: () => {}, onFallback: () => (fellBack = true) };
    await assert.rejects(provider.respond(conversation, options), { code: "timeout" });
    assert.equal(fellBack, false);
  });
});

describe("Live mode, when Gemini fails for other reasons", () => {
  for (const [name, behaviour, code] of [
    ["keeps Gemini's safety refusals", "refuse", "refused"],
    ["keeps setup problems (a bad API key) visible", "bad key", "unavailable"],
    ["keeps an incomplete answer an error, as before", "cut off", "invalid_response"],
  ] as const) {
    it(name, async () => {
      const { events, result } = await ask(liveMode(fakeGemini(behaviour)));
      assert.equal(kinds(events).includes("fallback"), false);
      assert.equal(result, undefined);
      assert.deepEqual(events.at(-1), { type: "error", code });
    });
  }
});

describe("How LIFE.EXE is set up", () => {
  it("uses the demo engine, unchanged, when no key is configured", async () => {
    const { events, result } = await ask(undefined, conversation, {});
    assert.deepEqual(kinds(events), ["meta", "stage:understanding", "stage:thinking", "stage:answering", "result"]);
    assert.deepEqual(events[0], { type: "meta", mode: "demo" });
    assert.deepEqual(result, DEMO_ANSWER);
  });

  it("puts the demo engine behind Gemini when a key is configured", async () => {
    const realFetch = globalThis.fetch;
    let geminiCalls = 0;
    globalThis.fetch = (async (input: string | URL | Request) => {
      assert.match(String(input instanceof Request ? input.url : input), /generativelanguage\.googleapis\.com/);
      geminiCalls += 1;
      throw new TypeError("fetch failed");
    }) as typeof fetch;
    try {
      const provider = createProvider({ GEMINI_API_KEY: "test-key" });
      assert.equal(provider.mode, "live");
      const { events, result } = await ask(provider);
      assert.ok(geminiCalls >= 1);
      assert.deepEqual(kinds(events), FELL_BACK);
      assert.deepEqual(result, DEMO_ANSWER);
    } finally {
      globalThis.fetch = realFetch;
    }
  });
});
