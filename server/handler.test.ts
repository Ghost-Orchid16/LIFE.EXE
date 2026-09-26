import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { handleLifeRequest } from "./handler.ts";
import { createDemoProvider } from "./providers/demo.ts";
import { LifeError, type LifeProvider } from "./providers/types.ts";
import { readEvents } from "./test-helpers.ts";

const URL = "http://localhost/api/life";

const post = (body: unknown, headers: Record<string, string> = { "content-type": "application/json" }) =>
  new Request(URL, { method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body) });

const failingProvider = (code: LifeError["code"]): LifeProvider => ({
  mode: "live",
  respond: async (_messages, { onStage }) => {
    onStage("understanding");
    throw new LifeError(code);
  },
});

describe("GET /api/life", () => {
  it("reports demo mode when no key is configured", async () => {
    const response = await handleLifeRequest(new Request(URL), { AI_API_KEY: "  " });
    assert.deepEqual(await response.json(), { mode: "demo" });
  });

  it("reports live mode when a key is configured", async () => {
    const response = await handleLifeRequest(new Request(URL), { AI_API_KEY: "sk-test" });
    assert.deepEqual(await response.json(), { mode: "live" });
  });
});

describe("POST /api/life", () => {
  it("streams stages and then the result", async () => {
    const response = await handleLifeRequest(
      post({ messages: [{ role: "user", content: "My friend hasn't talked to me for a few days." }] }),
      {},
      { provider: createDemoProvider({ stageMs: 0 }) },
    );
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /text\/event-stream/);
    const events = await readEvents(response);
    assert.deepEqual(
      events.map((event) => event.type === "stage" ? `stage:${event.stage}` : event.type),
      ["meta", "stage:understanding", "stage:context", "stage:options", "stage:next", "result"],
    );
    assert.deepEqual(events[0], { type: "meta", mode: "demo" });
  });

  it("turns provider failures into error events", async () => {
    const response = await handleLifeRequest(post({ messages: [{ role: "user", content: "Help me decide." }] }), {}, {
      provider: failingProvider("rate_limited"),
    });
    const events = await readEvents(response);
    assert.deepEqual(events.at(-1), { type: "error", code: "rate_limited" });
  });

  it("hides unexpected failures behind a generic error", async () => {
    const provider: LifeProvider = { mode: "live", respond: async () => Promise.reject(new Error("boom")) };
    const originalError = console.error;
    console.error = () => {};
    try {
      const events = await readEvents(await handleLifeRequest(post({ messages: [{ role: "user", content: "Hi there, help" }] }), {}, { provider }));
      assert.deepEqual(events.at(-1), { type: "error", code: "server_error" });
    } finally {
      console.error = originalError;
    }
  });

  it("rejects invalid requests before doing any work", async () => {
    const empty = await handleLifeRequest(post({ messages: [{ role: "user", content: " " }] }), {});
    assert.equal(empty.status, 400);
    assert.deepEqual(await empty.json(), { error: { code: "empty" } });

    const notJson = await handleLifeRequest(post("{nope"), {});
    assert.deepEqual(await notJson.json(), { error: { code: "invalid_request" } });

    const wrongType = await handleLifeRequest(post({ messages: [] }, { "content-type": "text/plain" }), {});
    assert.equal(wrongType.status, 415);

    const tooBig = await handleLifeRequest(post({ messages: [{ role: "user", content: "x".repeat(500_000) }] }), {});
    assert.equal(tooBig.status, 413);
  });

  it("only allows GET and POST", async () => {
    const response = await handleLifeRequest(new Request(URL, { method: "DELETE" }), {});
    assert.equal(response.status, 405);
  });
});
