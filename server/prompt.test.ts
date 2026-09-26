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

  it("says what the timing depends on instead of inventing rigid rules", () => {
    assert.match(
      SYSTEM_PROMPT,
      /Don't invent rigid rules or exact numbers, like "wait exactly two weeks", "do exactly 20 minutes", "stop it completely" or "always do this first"/,
    );
    assert.match(SYSTEM_PROMPT, /say what it depends on, or give a flexible range with the reason/);
    // Outside those counter-examples, the prompt never prescribes an exact amount of time itself.
    const withoutCounterExamples = SYSTEM_PROMPT.replace(`"wait exactly two weeks"`, "").replace(`"do exactly 20 minutes"`, "");
    assert.doesNotMatch(withoutCounterExamples, /\bexactly (a|one|two|three|\d+) (minute|hour|day|week|month)s?\b/i);
  });

  it("sorts out what it knows before answering, without asking questions all the time", () => {
    assert.match(SYSTEM_PROMPT, /^# Answer from what you know$/m);
    assert.match(SYSTEM_PROMPT, /Things they told you: reason from them directly/);
    assert.match(SYSTEM_PROMPT, /Something unknown that matters, because the right advice changes with it: ask one useful clarifying question/);
    assert.match(SYSTEM_PROMPT, /Something unknown that doesn't change the core advice: give conditional advice/);
    assert.match(SYSTEM_PROMPT, /Something that's only a possibility: call it a possibility/);
    assert.match(SYSTEM_PROMPT, /More than one valid option: explain the trade-offs that decide it instead of choosing for them/);
    assert.match(SYSTEM_PROMPT, /This isn't a reason to ask questions all the time: whenever you have enough to go on, give practical advice/);
    // The old rule that made it too eager to answer is gone.
    assert.doesNotMatch(SYSTEM_PROMPT, /Prefer a reasonable assumption/);
    // Facts it must not fill in by itself.
    for (const fact of ["graded or weighted", "rules or policies", "deadlines", "consequences", "what someone else feels", "what they should give up"]) {
      assert.ok(SYSTEM_PROMPT.includes(fact), `doesn't assume ${fact}`);
    }
  });

  it("A: doesn't state a friend's feelings or motives as facts after an argument", () => {
    // What the friend visibly did is known; why isn't.
    assert.match(SYSTEM_PROMPT, /What someone visibly did \(stopped replying, looked away\) is known; why they did it isn't/);
    assert.match(
      SYSTEM_PROMPT,
      /Not "They're still angry about the argument", but "You haven't heard from them since the argument\. They may still be upset, or just need time; you can't tell from the silence\."/,
    );
    assert.match(SYSTEM_PROMPT, /"silence means…"/);
  });

  it("B: doesn't pick the risky option when it doesn't know what the options are", () => {
    assert.match(SYSTEM_PROMPT, /^# Decisions$/m);
    assert.match(SYSTEM_PROMPT, /If they haven't said what the options actually are, don't recommend one\. Ask what they are/);
    assert.match(SYSTEM_PROMPT, /what each gives them, what it costs, the downside if it goes wrong, and how easily it can be undone/);
    assert.match(SYSTEM_PROMPT, /Never decide on a general rule like "fear means growth", "safe choices lead to regret" or "the risky option is braver"/);
    assert.match(SYSTEM_PROMPT, /leave the choice with them/);
    assert.match(SYSTEM_PROMPT, /When a choice between good options is genuinely theirs, help them make it rather than making it for them/);
    assert.doesNotMatch(SYSTEM_PROMPT, /tell them what you would do/);
  });

  it("C: asks a useful question about a vague situation instead of diagnosing it", () => {
    assert.match(SYSTEM_PROMPT, /^# Vague situations$/m);
    assert.match(SYSTEM_PROMPT, /"I don't know what I'm doing anymore\. Everything feels stuck and I don't know where to start"/);
    assert.match(SYSTEM_PROMPT, /don't invent an explanation, and don't turn it into a psychological or therapeutic framework/);
    assert.match(SYSTEM_PROMPT, /What's feeling most stuck right now: school or work, relationships, motivation, or something else\?/);
    assert.match(SYSTEM_PROMPT, /Never present a label like burnout, anxiety or an overwhelmed nervous system as fact/);
    for (const claim of ["most of the time…", "fear means…", "people do this because…", "your brain is…"]) {
      assert.ok(SYSTEM_PROMPT.includes(`"${claim}"`), `treats "${claim}" as a claim to avoid`);
    }
  });

  it("D: works from the actual options once it's told them", () => {
    assert.match(SYSTEM_PROMPT, /New information: use it\. Build on what they just told you instead of repeating or restarting your earlier advice/);
    assert.match(SYSTEM_PROMPT, /If they've now said what their options are, compare those specific options/);
    assert.match(SYSTEM_PROMPT, /Once they tell you the options, compare those specific options, not general decision advice/);
  });

  it("E: helps with the apology instead of reopening what happened", () => {
    assert.match(SYSTEM_PROMPT, /If they ask how to do something \("How do I apologize\?", "How do I say no\?"\), help them do it: the steps and the words to use/);
    assert.match(SYSTEM_PROMPT, /Don't reopen whether they should, or how serious it was, unless that would change what to do/);
  });

  it("stays the same for every request, so it can be cached", () => {
    assert.doesNotMatch(SYSTEM_PROMPT, /\$\{|\b20\d\d-\d\d-\d\d\b/);
  });
});
