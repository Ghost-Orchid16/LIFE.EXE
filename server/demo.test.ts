import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ChatMessage, LifeResponse } from "../shared/contract.ts";
import {
  CLARIFY_RESPONSE,
  CRISIS_RESPONSE,
  FALLBACK_REPLY,
  GENERAL_SCENARIO,
  GENERIC_REPLIES,
  SCENARIOS,
  composeReply,
  type DemoScenario,
} from "./demo/content.ts";
import { buildDemoResponse, matchScenario } from "./demo/engine.ts";
import { createDemoProvider } from "./providers/demo.ts";
import { hasContent, parseLifeResponse } from "./schema.ts";

const EXAMPLES: Record<string, string> = {
  career: "I don't know which career path I should choose.",
  friend: "My friend hasn't talked to me for a few days.",
  conversation: "I need to have a difficult conversation.",
  "two-options": "I have two opportunities and don't know which one to choose.",
  "bad-decision": "I think I made a bad decision.",
  expectations: "I'm stuck between what I want and what other people expect from me.",
};

function conversation(...turns: string[]): ChatMessage[] {
  const messages: ChatMessage[] = [];
  for (const text of turns) {
    if (messages.length) messages.push({ role: "assistant", content: buildDemoResponse(messages) });
    messages.push({ role: "user", content: text });
  }
  return messages;
}

/** Every answer a scenario can give, labelled. */
function repliesOf(scenario: DemoScenario): Array<[string, LifeResponse]> {
  const { title } = scenario.initial;
  return [
    [`${scenario.id} initial`, scenario.initial],
    ...(scenario.asked ? [[`${scenario.id} asked`, { ...scenario.initial, answer: scenario.asked.answer }] as [string, LifeResponse]] : []),
    [`${scenario.id} direct`, composeReply(scenario.direct, title)],
    [`${scenario.id} first step`, composeReply(scenario.firstStep, title)],
    [`${scenario.id} words`, composeReply(scenario.words, title)],
    ...scenario.extras.map((extra, i): [string, LifeResponse] => [`${scenario.id} extra ${i}`, composeReply(extra.reply, title)]),
  ];
}

const everyScenario = [...SCENARIOS, GENERAL_SCENARIO];
const genericReplies = Object.entries(GENERIC_REPLIES).map(([name, reply]): [string, LifeResponse] => [
  `generic ${name}`,
  composeReply(reply, GENERAL_SCENARIO.initial.title),
]);
const everyReply: Array<[string, LifeResponse]> = [
  ...everyScenario.flatMap(repliesOf),
  ...genericReplies,
  ["fallback", composeReply(FALLBACK_REPLY, GENERAL_SCENARIO.initial.title)],
];

const wordsIn = (...texts: string[]) => texts.join(" ").split(/\s+/).filter(Boolean).length;

describe("demo content", () => {
  it("matches every example situation to its scenario", () => {
    for (const [id, text] of Object.entries(EXAMPLES)) {
      assert.equal(matchScenario(text)?.id, id, text);
    }
  });

  it("only contains responses that pass the response schema", () => {
    for (const [label, response] of [...everyReply, ["crisis", CRISIS_RESPONSE], ["clarify", CLARIFY_RESPONSE]] as const) {
      const parsed = parseLifeResponse(response);
      assert.ok(parsed, `${label} should match the response schema`);
      assert.deepEqual(parsed, response, `${label} should already be tidy and within the limits`);
      assert.ok(hasContent(parsed), `${label} should say something`);
      assert.ok(response.title, `${label} should name the situation for the saved list`);
    }
  });

  it("keeps every answer short: an answer, a next move, and two or three follow-ups", () => {
    for (const [label, r] of everyReply) {
      assert.ok(wordsIn(r.answer) <= 35, `${label}: the answer is ${wordsIn(r.answer)} words`);
      const total = wordsIn(r.answer, ...r.points, r.question, r.nextMove, ...r.scripts, r.alternative);
      assert.ok(total <= 80, `${label}: ${total} words in all`);
      assert.ok(r.followUps.length >= 2 && r.followUps.length <= 3, `${label}: ${r.followUps.length} follow-ups`);
      assert.ok(r.points.length <= 4 && r.scripts.length <= 3, label);
      assert.equal(r.care, "", `${label}: only safety answers use the care note`);
    }
  });

  it("answers every follow-up it offers with something other than the generic fallback", () => {
    for (const scenario of everyScenario) {
      const example = EXAMPLES[scenario.id] ?? "Something odd happened at the bakery today and I'm not sure what to do.";
      assert.equal(matchScenario(example)?.id ?? "general", scenario.id);
      for (const [label, reply] of repliesOf(scenario)) {
        for (const followUp of reply.followUps) {
          const next = buildDemoResponse(conversation(example, followUp));
          assert.notEqual(next.answer, FALLBACK_REPLY.answer, `${label}: "${followUp}"`);
        }
      }
    }
  });
});

describe("buildDemoResponse", () => {
  it("responds to a situation with its scenario", () => {
    assert.equal(buildDemoResponse(conversation(EXAMPLES.friend)).title, "Checking in with a quiet friend");
  });

  it("answers the friend question directly, without describing the situation back", () => {
    const response = buildDemoResponse(conversation("my friend hasn't talked to me in a few days should i msg him again?"));
    assert.equal(response.answer, "Yes — send one casual check-in, then give them some space.");
    assert.equal(response.nextMove, "Send one short message today, then wait a day or two before reading anything into the silence.");
    assert.deepEqual(response.scripts, ["Hey, haven't heard from you in a bit. Everything okay?"]);
    assert.deepEqual(response.followUps, ["What if they don't reply?", "I think I upset them.", "Help me word the message."]);
    assert.equal(response.points.length + response.question.length + response.alternative.length, 0);
    // Not asked as a question, the same advice without the "yes".
    assert.equal(buildDemoResponse(conversation(EXAMPLES.friend)).answer, "Send one casual check-in, then give them some space.");
  });

  it("gives the actual words when asked for help with wording", () => {
    const response = buildDemoResponse(conversation(EXAMPLES.friend, "Help me word the message."));
    assert.equal(response.scripts.length, 3);
    assert.equal(response.title, "Checking in with a quiet friend");
  });

  it("puts safety first when someone may be in danger", () => {
    const response = buildDemoResponse(conversation("I don't want to live anymore"));
    assert.equal(response.title, CRISIS_RESPONSE.title);
    assert.match(response.care, /988/);
    assert.match(response.care, /116 123/);
    const followUp = buildDemoResponse(conversation("I want to die", "I don't know"));
    assert.match(followUp.care, /crisis line/);
    // Once support is the focus, it stays the focus, whatever comes next.
    const later = buildDemoResponse(conversation("I want to die", "I don't know", "What should I do first?"));
    assert.match(later.care, /crisis line/);
  });

  it("asks for more when the message is too short to work with", () => {
    assert.deepEqual(buildDemoResponse(conversation("help")), CLARIFY_RESPONSE);
    assert.ok(CLARIFY_RESPONSE.question);
    const next = buildDemoResponse(conversation("help", "My friend hasn't talked to me all week"));
    assert.equal(next.title, "Checking in with a quiet friend");
  });

  it("uses the general scenario for situations it doesn't recognise", () => {
    assert.equal(buildDemoResponse(conversation("Something weird happened at the bakery today and I'm unsure.")).title, "Finding a way forward");
  });

  it("adapts follow-ups to what was asked", () => {
    const career = EXAMPLES.career;
    assert.match(buildDemoResponse(conversation(career, "Can you be more direct?")).answer, /keep coming back to/);
    assert.match(buildDemoResponse(conversation(career, "What should I do first?")).answer, /Start by getting real information/);
    assert.match(buildDemoResponse(conversation(career, "But my parents won't agree.")).answer, /disagreement is information/);
    assert.match(buildDemoResponse(conversation(career, "That's not really what I meant.")).answer, /read that the wrong way/);
    assert.match(buildDemoResponse(conversation(career, "I've already tried that.")).answer, /told you something useful/);
    const unmatched = buildDemoResponse(conversation(career, "The weather was nice."));
    assert.match(unmatched.answer, /Demo mode can't adapt/);
    assert.equal(unmatched.nextMove, SCENARIOS[0].initial.nextMove);
  });
});

describe("createDemoProvider", () => {
  it("walks through every stage before answering", async () => {
    const stages: string[] = [];
    const provider = createDemoProvider({ stageMs: 0 });
    const response = await provider.respond(conversation(EXAMPLES.conversation), {
      signal: new AbortController().signal,
      onStage: (stage) => stages.push(stage),
    });
    assert.deepEqual(stages, ["understanding", "thinking", "answering"]);
    assert.equal(response.title, "Having a hard conversation");
  });

  it("stops when aborted", async () => {
    const controller = new AbortController();
    const provider = createDemoProvider({ stageMs: 50 });
    const pending = provider.respond(conversation(EXAMPLES.career), { signal: controller.signal, onStage: () => {} });
    controller.abort();
    await assert.rejects(pending, { code: "timeout" });
  });
});
