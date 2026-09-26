import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ChatMessage, LifeResponse } from "../shared/contract.ts";
import {
  CLARIFY_RESPONSE,
  CRISIS_RESPONSE,
  GENERAL_SCENARIO,
  GENERIC_REPLIES,
  SCENARIOS,
  composeReply,
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

function assertValid(response: LifeResponse, label: string) {
  const parsed = parseLifeResponse(response);
  assert.ok(parsed, `${label} should match the response schema`);
  assert.ok(hasContent(parsed), `${label} should say something`);
  assert.ok(response.situation.nextMove, `${label} should keep a next move in the panel`);
}

describe("demo content", () => {
  it("matches every example situation to its scenario", () => {
    for (const [id, text] of Object.entries(EXAMPLES)) {
      assert.equal(matchScenario(text)?.id, id, text);
    }
  });

  it("only contains responses that pass the response schema", () => {
    for (const scenario of [...SCENARIOS, GENERAL_SCENARIO]) {
      assertValid(scenario.initial, `${scenario.id} initial`);
      for (const [name, reply] of [
        ["direct", scenario.direct],
        ["first step", scenario.firstStep],
        ["words", scenario.words],
        ...scenario.extras.map((extra, i) => [`extra ${i}`, extra.reply] as const),
      ] as const) {
        assertValid(composeReply(reply, scenario.initial.situation), `${scenario.id} ${name}`);
      }
    }
    for (const [name, reply] of Object.entries(GENERIC_REPLIES)) {
      assertValid(composeReply(reply, GENERAL_SCENARIO.initial.situation), `generic ${name}`);
    }
    assertValid(CRISIS_RESPONSE, "crisis");
    assertValid(CLARIFY_RESPONSE, "clarify");
  });

  it("answers every suggested follow-up with something other than the generic fallback", () => {
    for (const [id, text] of Object.entries(EXAMPLES)) {
      const first = buildDemoResponse(conversation(text));
      for (const followUp of first.followUps) {
        const reply = buildDemoResponse(conversation(text, followUp));
        assert.doesNotMatch(reply.lead, /^That's useful context/, `${id}: "${followUp}"`);
      }
    }
  });
});

describe("buildDemoResponse", () => {
  it("responds to a situation with its scenario", () => {
    assert.equal(buildDemoResponse(conversation(EXAMPLES.friend)).situation.title, "A friend has gone quiet");
  });

  it("puts safety first when someone may be in danger", () => {
    const response = buildDemoResponse(conversation("I don't want to live anymore"));
    assert.equal(response.situation.focus, "support");
    assert.match(response.care, /988/);
    const followUp = buildDemoResponse(conversation("I want to die", "I don't know"));
    assert.match(followUp.care, /crisis line/);
  });

  it("asks for more when the message is too short to work with", () => {
    assert.deepEqual(buildDemoResponse(conversation("help")), CLARIFY_RESPONSE);
    const next = buildDemoResponse(conversation("help", "My friend hasn't talked to me all week"));
    assert.equal(next.situation.title, "A friend has gone quiet");
  });

  it("uses the general scenario for situations it doesn't recognise", () => {
    assert.equal(buildDemoResponse(conversation("Something weird happened at the bakery today and I'm unsure.")).situation.title, "Finding a way forward");
  });

  it("adapts follow-ups to what was asked", () => {
    const career = EXAMPLES.career;
    assert.match(buildDemoResponse(conversation(career, "Can you be more direct?")).lead, /take it seriously/);
    assert.match(buildDemoResponse(conversation(career, "What should I do first?")).lead, /Start small/);
    assert.match(buildDemoResponse(conversation(career, "But my parents won't agree.")).lead, /disagreement is information/);
    assert.match(buildDemoResponse(conversation(career, "That's not really what I meant.")).lead, /read that the wrong way/);
    assert.match(buildDemoResponse(conversation(career, "I've already tried that.")).lead, /already told you/);
    const unmatched = buildDemoResponse(conversation(career, "The weather was nice."));
    assert.match(unmatched.lead, /Demo mode can't adapt/);
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
    assert.deepEqual(stages, ["understanding", "context", "options", "next"]);
    assert.equal(response.situation.focus, "conversation");
  });

  it("stops when aborted", async () => {
    const controller = new AbortController();
    const provider = createDemoProvider({ stageMs: 50 });
    const pending = provider.respond(conversation(EXAMPLES.career), { signal: controller.signal, onStage: () => {} });
    controller.abort();
    await assert.rejects(pending, { code: "timeout" });
  });
});
