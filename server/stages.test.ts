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
    assert.deepEqual(track(['{"care":"",', '"answer":"Yes.",', '"points":[],"question":"",', '"nextMove":"go"}']), [
      "understanding",
      "thinking",
      "answering",
    ]);
  });

  it("reports every stage in order when one chunk skips ahead", () => {
    assert.deepEqual(track(['{"care":"","answer":"x","points":[],"question":"","nextMove":""']), [
      "understanding",
      "thinking",
      "answering",
    ]);
  });

  it("notices markers split across chunks", () => {
    assert.deepEqual(track(['{"care":"","ans', 'wer": "a"']), ["understanding", "thinking"]);
  });

  it("ignores field names quoted inside values", () => {
    assert.deepEqual(track(['{"care":"You said \\"answer\\": none, and \\"nextMove\\": none"']), ["understanding"]);
  });

  it("never moves backwards after a new text block", () => {
    const seen: Stage[] = [];
    const tracker = createStageTracker((stage) => seen.push(stage));
    tracker.push('{"care":"","answer":"x",');
    tracker.resetBlock();
    tracker.push('{"care":"","answer":');
    tracker.push('"y","points":[],"question":"","nextMove":"z"');
    assert.deepEqual(seen, ["understanding", "thinking", "answering"]);
  });
});
