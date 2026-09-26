import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { RESPONSE_SCHEMA, hasContent, parseLifeResponse } from "./schema.ts";
import { sampleResponse } from "./test-helpers.ts";

describe("the response format", () => {
  it("is an answer, a next move, words to use and follow-ups, with no analysis sections", () => {
    const properties = Object.keys((RESPONSE_SCHEMA as { properties: object }).properties);
    assert.deepEqual(properties, ["care", "answer", "points", "question", "nextMove", "scripts", "alternative", "followUps", "title"]);
    for (const removed of ["whatsGoingOn", "whatMatters", "whatsUnclear", "options", "situation", "lead"]) {
      assert.ok(!properties.includes(removed), `${removed} is gone`);
    }
  });

  it("keeps answers within limits, whatever the model sends", () => {
    const parsed = parseLifeResponse(
      sampleResponse({
        answer: "  Yes — send one check-in.  ",
        points: ["one", " ", "two", "three", "four", "five"],
        scripts: ["a", "b", "c", "d"],
        followUps: ["What if they don't reply?", "", "I think I upset them.", "Help me word the message.", "And another?", "x".repeat(81)],
      }),
    );
    assert.ok(parsed);
    assert.equal(parsed.answer, "Yes — send one check-in.");
    assert.deepEqual(parsed.points, ["one", "two", "three", "four"]);
    assert.deepEqual(parsed.scripts, ["a", "b", "c"]);
    assert.deepEqual(parsed.followUps, ["What if they don't reply?", "I think I upset them.", "Help me word the message."]);
  });

  it("rejects anything that isn't a complete answer, including the earlier long format", () => {
    assert.equal(parseLifeResponse(null), null);
    assert.equal(parseLifeResponse({ answer: "only this" }), null);
    const { answer: _answer, ...missingAnswer } = sampleResponse();
    assert.equal(parseLifeResponse(missingAnswer), null);
    const earlierFormat = { care: "", whatsGoingOn: "A summary.", whatMatters: [], whatsUnclear: [], lead: "Lead.", questions: [], options: [], sayItLikeThis: [], nextMove: "Go.", followUps: [], situation: { title: "t", summary: "s", focus: "decision", matters: [], nextMove: "n" } };
    assert.equal(parseLifeResponse(earlierFormat), null);
  });

  it("only counts a response that says something", () => {
    const blank = sampleResponse({ answer: "", nextMove: "", followUps: [] });
    assert.equal(hasContent(blank), false);
    assert.equal(hasContent({ ...blank, answer: "Yes." }), true);
    assert.equal(hasContent({ ...blank, question: "Did something happen between you?" }), true);
    assert.equal(hasContent({ ...blank, care: "Please call 988 now." }), true);
  });
});
