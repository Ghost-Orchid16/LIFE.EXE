import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SYSTEM_PROMPT } from "./prompt.ts";
import { RESPONSE_SCHEMA } from "./schema.ts";

describe("SYSTEM_PROMPT", () => {
  it("describes every field of the response format, and nothing from the earlier format", () => {
    for (const field of Object.keys((RESPONSE_SCHEMA as { properties: object }).properties)) {
      assert.match(SYSTEM_PROMPT, new RegExp(`^- ${field}: `, "m"), `explains "${field}"`);
    }
    for (const removed of ["whatsGoingOn", "whatMatters", "whatsUnclear", "sayItLikeThis", "situation:", "options:"]) {
      assert.ok(!SYSTEM_PROMPT.includes(removed), `no longer mentions "${removed}"`);
    }
  });

  it("asks for the conclusion, not a summary of the situation or the reasoning behind it", () => {
    assert.match(SYSTEM_PROMPT, /don't explain the situation back to them/i);
    assert.match(SYSTEM_PROMPT, /Don't restate or summarise their situation/);
    assert.match(SYSTEM_PROMPT, /Never describe your process or reasoning/);
    assert.match(SYSTEM_PROMPT, /Match the length to the situation/);
    assert.match(SYSTEM_PROMPT, /never invent options/);
  });

  it("keeps the safety rules", () => {
    assert.match(SYSTEM_PROMPT, /Short never means careless/);
    assert.match(SYSTEM_PROMPT, /988/);
    assert.match(SYSTEM_PROMPT, /116 123/);
    assert.match(SYSTEM_PROMPT, /Don't diagnose/);
    assert.match(SYSTEM_PROMPT, /never give dangerous, illegal or harmful instructions/);
  });

  it("stays the same for every request, so it can be cached", () => {
    assert.doesNotMatch(SYSTEM_PROMPT, /\$\{|\b20\d\d-\d\d-\d\d\b/);
  });
});
