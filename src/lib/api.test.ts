import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { sampleResponse } from "../../server/test-helpers.ts";
import type { Mode, Stage, StreamEvent } from "../../shared/contract.ts";
import { sendConversation } from "./api.ts";

const realFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = realFetch;
});

/** The API answers every request with these server-sent events. */
function serve(...events: StreamEvent[]) {
  const body = events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join("");
  globalThis.fetch = (async () => new Response(body, { headers: { "content-type": "text/event-stream" } })) as typeof fetch;
}

async function send() {
  const modes: Mode[] = [];
  const stages: Stage[] = [];
  let fallbacks = 0;
  const response = await sendConversation([{ role: "user", content: "I got two job offers and I can't pick one." }], {
    signal: new AbortController().signal,
    onMode: (mode) => modes.push(mode),
    onStage: (stage) => stages.push(stage),
    onFallback: () => {
      fallbacks += 1;
    },
  });
  return { response, modes, stages, fallbacks };
}

const STAGES: StreamEvent[] = [
  { type: "stage", stage: "thinking" },
  { type: "stage", stage: "answering" },
];

describe("Receiving an answer", () => {
  it("passes a live answer through as before", async () => {
    const live = sampleResponse();
    serve({ type: "meta", mode: "live" }, { type: "stage", stage: "understanding" }, ...STAGES, { type: "result", response: live });
    const received = await send();
    assert.deepEqual(received.response, live);
    assert.deepEqual(received.modes, ["live"]);
    assert.deepEqual(received.stages, ["understanding", "thinking", "answering"]);
    assert.equal(received.fallbacks, 0);
  });

  it("marks an answer from the demo fallback, without switching LIFE.EXE to demo mode", async () => {
    const demo = sampleResponse({ answer: "A pre-written answer." });
    serve(
      { type: "meta", mode: "live" },
      { type: "stage", stage: "understanding" },
      { type: "fallback" },
      ...STAGES,
      { type: "result", response: demo },
    );
    const received = await send();
    assert.deepEqual(received.response, demo);
    assert.equal(received.fallbacks, 1);
    // LIFE.EXE's mode (the header's demo badge) comes only from the server's meta event, which still says live.
    assert.deepEqual(received.modes, ["live"]);
    assert.deepEqual(received.stages, ["understanding", "thinking", "answering"]);
  });
});
