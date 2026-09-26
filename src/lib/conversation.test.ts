import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LIMITS } from "../../shared/contract.ts";
import { sampleResponse } from "../../server/test-helpers.ts";
import { validateLifeRequest } from "../../server/validation.ts";
import {
  contextFor,
  reducer,
  resumeTurns,
  type AnswerTurn,
  type AssistantTurn,
  type SavedTurn,
  type Turn,
  type UserTurn,
} from "./conversation.ts";

/** A conversation of `exchanges` messages from the person, each answered. */
function thread(exchanges: number): SavedTurn[] {
  return Array.from({ length: exchanges }, (_, index): SavedTurn[] => [
    { id: `u${index + 1}`, role: "user", text: `Message ${index + 1}`, at: index },
    {
      id: `a${index + 1}`,
      role: "assistant",
      status: "done",
      response: sampleResponse({ lead: `Answer ${index + 1}` }),
      mode: "live",
      at: index,
    },
  ]).flat();
}

const ask = (text: string): UserTurn => ({ id: "next", role: "user", text, at: 0 });
const pending = (id: string): AssistantTurn => ({ id, role: "assistant", status: "pending", stage: "understanding" });

describe("Conversation context", () => {
  it("sends a conversation within the API's limit as it is", () => {
    const turns = [...thread(3), ask("What should I do first?")];
    const messages = contextFor(turns);
    assert.equal(messages.length, 7);
    assert.deepEqual(
      messages.map((message) => (message.role === "user" ? message.content : message.content.lead)),
      ["Message 1", "Answer 1", "Message 2", "Answer 2", "Message 3", "Answer 3", "What should I do first?"],
    );
  });

  it("leaves out unfinished and failed answers", () => {
    const turns: Turn[] = [
      ...thread(1),
      { id: "u2", role: "user", text: "Message 2", at: 1 },
      { id: "e2", role: "assistant", status: "error", code: "network" },
      ask("Message 3"),
      { id: "p3", role: "assistant", status: "pending", stage: "context" },
    ];
    assert.deepEqual(
      contextFor(turns).map((message) => message.role),
      ["user", "assistant", "user", "user"],
    );
  });

  it("trims a long thread to its opening exchange and its latest messages", () => {
    const turns = [...thread(30), ask("I talked to them today and things changed.")];
    const messages = contextFor(turns);

    assert.ok(messages.length <= LIMITS.maxMessages, `${messages.length} messages`);
    assert.deepEqual(messages[0], { role: "user", content: "Message 1" });
    assert.equal(messages[1].role === "assistant" && messages[1].content.lead, "Answer 1");
    assert.deepEqual(messages[2], { role: "user", content: "Message 13" });
    assert.deepEqual(messages.at(-1), { role: "user", content: "I talked to them today and things changed." });
    // The latest answer, with LIFE.EXE's running summary of the situation, is always included.
    assert.deepEqual(messages.at(-2), { role: "assistant", content: (turns.at(-2) as AnswerTurn).response });
    // And the API accepts it.
    const validation = validateLifeRequest({ messages });
    assert.ok(validation.ok);
    assert.equal(validation.messages.length, messages.length);
  });

  it("never sends more than the API allows, however long the thread gets", () => {
    for (const exchanges of [19, 20, 21, 50, 200]) {
      const messages = contextFor([...thread(exchanges), ask("And now?")]);
      assert.ok(messages.length <= LIMITS.maxMessages);
      assert.ok(validateLifeRequest({ messages }).ok, `${exchanges} exchanges`);
    }
  });
});

describe("Conversation state", () => {
  it("starts a new situation with a new id, and continues an open one under its own", () => {
    let state = reducer({ id: null, turns: [] }, { type: "send", conversationId: "first", user: ask("One"), pending: pending("p1") });
    assert.equal(state.id, "first");
    state = reducer(state, { type: "resolve", id: "p1", response: sampleResponse(), mode: "demo", at: 5 });
    assert.deepEqual(state.turns.at(-1), { id: "p1", role: "assistant", status: "done", response: sampleResponse(), mode: "demo", at: 5 });

    state = reducer(state, { type: "reset" });
    assert.deepEqual(state, { id: null, turns: [] });

    state = reducer(state, { type: "open", conversationId: "first", turns: thread(1) });
    assert.equal(state.id, "first");
    assert.equal(state.turns.length, 2);
  });

  it("marks an unanswered last message as interrupted instead of sending it again", () => {
    const unanswered = [...thread(1), { id: "u2", role: "user" as const, text: "Message 2", at: 2 }];
    const turns = resumeTurns(unanswered);
    assert.deepEqual(turns.slice(0, 3), unanswered);
    assert.deepEqual({ ...turns[3], id: "" }, { id: "", role: "assistant", status: "error", code: "interrupted" });
    // Nothing is waiting on an answer: no request goes out until the person chooses to try again.
    assert.ok(!turns.some((turn) => turn.role === "assistant" && turn.status === "pending"));
    assert.deepEqual(resumeTurns(thread(1)), thread(1));
  });
});
