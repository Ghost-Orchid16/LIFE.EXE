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

  it("keeps what's known, possible and unknown apart when other people are involved", () => {
    assert.match(SYSTEM_PROMPT, /^# Other people: known, possible, unknown$/m);
    const rule = (name: string) => SYSTEM_PROMPT.match(new RegExp(`^- ${name}: .*$`, "m"))?.[0] ?? "";
    const [known, possible, unknown] = [rule("Known"), rule("Possible"), rule("Unknown")];

    // What the person says, including what someone else told them, is known and used as is.
    assert.match(known, /what the person told you directly, including what someone else said or did/);
    assert.match(known, /"They told me they're angry and need some space"/);
    assert.match(known, /"They said they're upset because I cancelled their birthday plans"/);
    assert.match(known, /use it without hedging/);

    // Explanations for someone's behaviour are possibilities, never facts.
    assert.match(possible, /Present them as possibilities/);
    assert.match(possible, /never as facts/);

    // Another person's inner life stays unknown unless the person was told.
    for (const inner of ["feelings", "thoughts", "intentions", "motives", "reasons", "future behaviour"]) {
      assert.ok(unknown.includes(inner), `treats their ${inner} as unknown`);
    }
    assert.match(unknown, /unless the person told you/);
    // Three days of silence, or someone looking away, prove nothing on their own.
    assert.match(unknown, /Silence, looking away, a short reply or a delay can mean many things/);

    // "Did I do something wrong?" gets neither a yes nor a no without evidence, and a way to find out.
    assert.match(SYSTEM_PROMPT, /did something wrong and nothing they've said shows it, don't say they did or didn't/);
    assert.match(SYSTEM_PROMPT, /how they could find out/);
  });

  it("changes the wording, not the advice, when something is uncertain", () => {
    assert.match(SYSTEM_PROMPT, /Uncertainty changes the wording, not the advice/);
    assert.match(SYSTEM_PROMPT, /Still give a clear, practical recommendation/);
    assert.match(SYSTEM_PROMPT, /Don't add disclaimers or turn vague/);

    // The overconfident phrasings seen in testing appear only once each, as counter-examples with a rewrite.
    const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (const guess of [
      "Silence is their way of asking for space",
      "They are not ready to engage deeply",
      "Take it as clear information that they want distance right now",
      "They're ignoring you because they want space",
    ]) {
      assert.equal(SYSTEM_PROMPT.split(guess).length - 1, 1, `"${guess}" appears once`);
      assert.match(SYSTEM_PROMPT, new RegExp(`Not "${escape(guess)}", but "[^"]+"`), `"${guess}" comes with a rewrite`);
    }

    // Being direct is about the recommendation, not about certainty over someone else's feelings.
    assert.match(SYSTEM_PROMPT, /Direct means clear about what to do, not certain about what someone else feels/);
    // Suggested wording doesn't tell the other person what they feel either.
    assert.match(SYSTEM_PROMPT, /they shouldn't tell the other person what they feel/);
  });

  it("gives flexible timing instead of invented deadlines", () => {
    assert.match(SYSTEM_PROMPT, /Don't invent precise, universal timelines like "wait exactly two weeks"/);
    assert.match(SYSTEM_PROMPT, /give a flexible range and what it depends on/);
    const withoutCounterExample = SYSTEM_PROMPT.replace(`"wait exactly two weeks"`, "");
    assert.doesNotMatch(withoutCounterExample, /\bexactly (a|one|two|three|\d+) (day|week|month)s?\b/i);
  });

  it("stays the same for every request, so it can be cached", () => {
    assert.doesNotMatch(SYSTEM_PROMPT, /\$\{|\b20\d\d-\d\d-\d\d\b/);
  });
});
