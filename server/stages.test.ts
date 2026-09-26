import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Stage } from "../shared/contract.ts";
import { createStageTracker } from "./stages.ts";

function track(chunks: string[]): Stage[] {
  const seen: Stage[] = [];
  const tracker = createStageTracker((stage) => seen.push(stage));
  for (const chunk of chunks) tracker.push(chunk);
  return seen;
}

describe("createStageTracker", () => {
  it("starts at understanding and follows the answer's fields", () => {
    assert.deepEqual(track(['{"care":"","whatsGoingOn":"x",', '"whatMatters":["a"],', '"options":[],', '"nextMove":"go"}']), [
      "understanding",
      "context",
      "options",
      "next",
    ]);
  });

  it("reports every stage in order when one chunk skips ahead", () => {
    assert.deepEqual(track(['{"whatMatters":[],"options":[],"nextMove":""']), ["understanding", "context", "options", "next"]);
  });

  it("notices markers split across chunks", () => {
    assert.deepEqual(track(['{"whatMat', 'ters": ["a"]']), ["understanding", "context"]);
  });

  it("ignores field names quoted inside values", () => {
    assert.deepEqual(track(['{"whatsGoingOn":"You said \\"options\\": none"']), ["understanding"]);
  });

  it("never moves backwards after a new text block", () => {
    const seen: Stage[] = [];
    const tracker = createStageTracker((stage) => seen.push(stage));
    tracker.push('{"whatMatters":[],"options":[');
    tracker.resetBlock();
    tracker.push('{"care":"","whatMatters":[');
    tracker.push('],"options":[],"nextMove":"x"');
    assert.deepEqual(seen, ["understanding", "context", "options", "next"]);
  });
});
