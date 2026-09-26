import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LIMITS } from "../shared/contract.ts";
import { sampleResponse } from "./test-helpers.ts";
import { validateLifeRequest } from "./validation.ts";

describe("validateLifeRequest", () => {
  it("accepts a first message and trims it", () => {
    const result = validateLifeRequest({ messages: [{ role: "user", content: "  My friend went quiet.\r\n " }] });
    assert.deepEqual(result, { ok: true, messages: [{ role: "user", content: "My friend went quiet." }] });
  });

  it("rejects bodies that aren't a conversation", () => {
    assert.deepEqual(validateLifeRequest(null), { ok: false, code: "invalid_request" });
    assert.deepEqual(validateLifeRequest({ messages: "hi" }), { ok: false, code: "invalid_request" });
    assert.deepEqual(validateLifeRequest({ messages: [{ role: "system", content: "x" }] }), { ok: false, code: "invalid_request" });
  });

  it("rejects empty input", () => {
    assert.deepEqual(validateLifeRequest({ messages: [] }), { ok: false, code: "empty" });
    assert.deepEqual(validateLifeRequest({ messages: [{ role: "user", content: "   \n " }] }), { ok: false, code: "empty" });
  });

  it("rejects messages over the length limit", () => {
    const content = "a".repeat(LIMITS.messageChars + 1);
    assert.deepEqual(validateLifeRequest({ messages: [{ role: "user", content }] }), { ok: false, code: "too_long" });
  });

  it("rejects conversations that are too long", () => {
    const messages = Array.from({ length: LIMITS.maxMessages + 1 }, (_, i) =>
      i % 2 === 0 ? { role: "user", content: "more" } : { role: "assistant", content: sampleResponse() },
    );
    assert.deepEqual(validateLifeRequest({ messages }), { ok: false, code: "too_many_messages" });
  });

  it("requires the conversation to end with the person's message", () => {
    const result = validateLifeRequest({
      messages: [
        { role: "user", content: "Two offers." },
        { role: "assistant", content: sampleResponse() },
      ],
    });
    assert.deepEqual(result, { ok: false, code: "invalid_request" });
  });

  it("rejects malformed LIFE.EXE turns in the history", () => {
    const result = validateLifeRequest({
      messages: [
        { role: "user", content: "Two offers." },
        { role: "assistant", content: { lead: "missing everything else" } },
        { role: "user", content: "And?" },
      ],
    });
    assert.deepEqual(result, { ok: false, code: "invalid_request" });
  });

  it("merges consecutive messages from the person", () => {
    const result = validateLifeRequest({
      messages: [
        { role: "user", content: "Two offers." },
        { role: "assistant", content: sampleResponse() },
        { role: "user", content: "One is abroad." },
        { role: "user", content: "The other pays more." },
      ],
    });
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.messages.length, 3);
      assert.deepEqual(result.messages[2], { role: "user", content: "One is abroad.\n\nThe other pays more." });
    }
  });
});
