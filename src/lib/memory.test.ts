import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ChatMessage, LifeResponse, Mode } from "../../shared/contract.ts";
import { readConfig } from "../../server/config.ts";
import { handleLifeRequest } from "../../server/handler.ts";
import { createDemoProvider } from "../../server/providers/demo.ts";
import { createGeminiProvider } from "../../server/providers/gemini.ts";
import { readEvents, sampleResponse } from "../../server/test-helpers.ts";
import { validateLifeRequest } from "../../server/validation.ts";
import {
  EMPTY_CONVERSATION,
  contextFor,
  isBusy,
  newId,
  pendingTurn,
  reducer,
  resumeTurns,
  withoutTrailingError,
  type ConversationState,
  type Turn,
  type UserTurn,
} from "./conversation.ts";
import {
  LAST_OPEN_KEY,
  LEGACY_SESSION_KEY,
  MAX_SAVED,
  MEMORY_KEY,
  OPEN_KEY,
  createMemory,
  type KeyValueStore,
  type SavedConversation,
} from "./memory.ts";

/** Stands in for localStorage or sessionStorage. `quota` limits the characters it holds, like a full browser store. */
class FakeStorage implements KeyValueStore {
  readonly data = new Map<string, string>();
  quota = Infinity;

  getItem(key: string) {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    let size = key.length + value.length;
    for (const [other, stored] of this.data) if (other !== key) size += other.length + stored.length;
    if (size > this.quota) throw new DOMException("The quota has been exceeded.", "QuotaExceededError");
    this.data.set(key, value);
  }

  removeItem(key: string) {
    this.data.delete(key);
  }
}

interface Browser {
  local: FakeStorage;
  session: FakeStorage;
}

const newBrowser = (): Browser => ({ local: new FakeStorage(), session: new FakeStorage() });
/** The same browser after its tabs were closed: localStorage stays, sessionStorage is gone. */
const nextVisit = (browser: Browser): Browser => ({ local: browser.local, session: new FakeStorage() });

const FRIEND = "I've been struggling to decide whether I should talk to my friend about something that happened.";
const FOLLOW_UP = "It was something they said at a party, and it hurt.";
const CONTINUE = "I talked to them today and things changed.";
const JOBS = "I have two job offers and I can't choose between them.";

const friendAnswer = (answer: string) => sampleResponse({ answer, title: "Talking to a friend about what happened" });
const jobsAnswer = (answer: string) => sampleResponse({ answer });

/** An answer as the earlier, longer format saved it. */
const EARLIER_ANSWER = {
  care: "",
  whatsGoingOn: "A friend has gone quiet and you're not sure why.",
  whatMatters: ["The friendship"],
  whatsUnclear: ["Why they went quiet."],
  lead: "Send one low-pressure check-in.",
  questions: [],
  options: [{ title: "Wait", detail: "Give it a few days.", upside: "No pressure.", tradeoff: "Slower." }],
  sayItLikeThis: ["Hey, everything okay?"],
  nextMove: "Message them today.",
  followUps: ["What if they don't reply?"],
  situation: { title: "A friend has gone quiet", summary: "Unsure why.", focus: "relationship", matters: [], nextMove: "Message them." },
};

/**
 * One browser tab, driven the way useConversation drives it: the same reducer and the same memory calls.
 * `answer` stands in for the API's reply; `sent` records every conversation the tab sent to the API.
 */
function openTab(browser: Browser) {
  const memory = createMemory(browser.local, browser.session);
  memory.adoptLegacySession();
  let state: ConversationState = memory.reopen();
  let pendingId = "";
  const sent: ChatMessage[][] = [];

  const commit = (next: ConversationState) => {
    state = next;
    if (state.id) memory.save(state.id, state.turns);
    memory.setOpenId(state.id);
  };

  return {
    memory,
    sent,
    get state() {
      return state;
    },
    send(text: string): ChatMessage[] {
      const user: UserTurn = { id: newId(), role: "user", text, at: Date.now() };
      const pending = pendingTurn();
      const context = contextFor([...withoutTrailingError(state.turns), user]);
      sent.push(context);
      pendingId = pending.id;
      commit(reducer(state, { type: "send", conversationId: state.id ?? newId(), user, pending }));
      return context;
    },
    answer(response: LifeResponse, mode: Mode = "live") {
      commit(reducer(state, { type: "resolve", id: pendingId, response, mode, at: Date.now() }));
    },
    startNew() {
      commit(reducer(state, { type: "reset" }));
    },
    open(id: string) {
      const saved = memory.get(id);
      assert.ok(saved, `situation ${id} is saved`);
      state = reducer(state, { type: "open", conversationId: id, turns: resumeTurns(saved.turns) });
      memory.setOpenId(id);
    },
  };
}

type Tab = ReturnType<typeof openTab>;

/** The friend situation, two exchanges in. */
function talkAboutFriend(tab: Tab) {
  tab.send(FRIEND);
  tab.answer(friendAnswer("Start by deciding what you want."));
  tab.send(FOLLOW_UP);
  tab.answer(friendAnswer("That hurt is worth naming."));
  return tab.state.id!;
}

const saidIn = (conversation: SavedConversation | null) =>
  conversation?.turns.flatMap((turn) => (turn.role === "user" ? [turn.text] : [])) ?? [];

const post = (messages: ChatMessage[]) =>
  new Request("http://localhost/api/life", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ messages }),
  });

describe("Local memory", () => {
  it("saves a situation when the first message is sent, and again with each answer", () => {
    const browser = newBrowser();
    const tab = openTab(browser);

    tab.send(FRIEND);
    let [saved] = tab.memory.list();
    assert.equal(saved.id, tab.state.id);
    assert.ok(saved.title.startsWith("I've been struggling to decide whether"), saved.title);
    assert.ok(saved.title.length <= 80 && saved.title.endsWith("…"), saved.title);
    assert.deepEqual(saidIn(saved), [FRIEND]);
    assert.ok(saved.createdAt > 0 && saved.updatedAt >= saved.createdAt);
    const { createdAt } = saved;

    tab.answer(friendAnswer("Start by deciding what you want."));
    tab.send(FOLLOW_UP);
    tab.answer(friendAnswer("That hurt is worth naming."));
    [saved] = tab.memory.list();
    assert.equal(tab.memory.list().length, 1);
    assert.equal(saved.title, "Talking to a friend about what happened");
    assert.equal(saved.createdAt, createdAt);
    // Messages, answers, how each answer was made (live or demo) and when: all of it, as it was.
    assert.deepEqual(saved.turns, tab.state.turns);
    assert.equal(browser.session.getItem(OPEN_KEY), saved.id);
  });

  it("restores the open situation after a reload, without sending anything", () => {
    const browser = newBrowser();
    const tab = openTab(browser);
    talkAboutFriend(tab);

    const reloaded = openTab(browser);
    assert.deepEqual(reloaded.state, tab.state);
    assert.ok(!isBusy(reloaded.state.turns), "nothing is waiting on the API");

    // A message that was still waiting for its answer comes back as interrupted, to retry when the person chooses.
    reloaded.send(CONTINUE);
    const interrupted = openTab(browser).state.turns;
    const last = interrupted.at(-1);
    assert.ok(last?.role === "assistant" && last.status === "error" && last.code === "interrupted");
    assert.ok(!isBusy(interrupted));
    assert.deepEqual(interrupted.slice(0, -1), reloaded.state.turns.slice(0, -1));
  });

  it("reopens the situation the person was in when they come back, ready to continue", () => {
    const browser = newBrowser();
    const tab = openTab(browser);
    talkAboutFriend(tab);

    // The site was closed, and opened again later.
    const later = openTab(nextVisit(browser));
    assert.deepEqual(later.state, tab.state);
    assert.ok(!isBusy(later.state.turns));
    const context = later.send(CONTINUE);
    assert.deepEqual(
      context.map((message) => (message.role === "user" ? message.content : "(answer)")),
      [FRIEND, "(answer)", FOLLOW_UP, "(answer)", CONTINUE],
    );
  });

  it("comes back to the home page after New situation, with saved situations listed", () => {
    const browser = newBrowser();
    const tab = openTab(browser);
    const friendId = talkAboutFriend(tab);
    tab.startNew();

    const later = openTab(nextVisit(browser));
    assert.deepEqual(later.state, EMPTY_CONVERSATION);
    assert.deepEqual(
      later.memory.list().map(({ id, title }) => ({ id, title })),
      [{ id: friendId, title: "Talking to a friend about what happened" }],
    );
    later.open(friendId);
    assert.deepEqual(later.state.turns, tab.memory.get(friendId)?.turns);
  });

  it("keeps each tab in its own situation across a reload", () => {
    const said = (state: ConversationState) => state.turns.flatMap((turn) => (turn.role === "user" ? [turn.text] : []));
    const firstTab = newBrowser();
    const first = openTab(firstTab);
    const friendId = talkAboutFriend(first);
    first.startNew();
    first.send(JOBS);

    const secondTab = nextVisit(firstTab);
    const second = openTab(secondTab);
    assert.deepEqual(said(second.state), [JOBS], "a new tab opens where LIFE.EXE was last used");
    second.open(friendId);

    assert.deepEqual(said(openTab(firstTab).state), [JOBS]);
    assert.deepEqual(said(openTab(secondTab).state), [FRIEND, FOLLOW_UP]);
  });

  it("keeps separate situations separate", () => {
    const browser = newBrowser();
    const tab = openTab(browser);
    const friendId = talkAboutFriend(tab);
    tab.startNew();
    tab.send(JOBS);
    tab.answer(jobsAnswer("Compare them on what matters to you."));
    const jobsId = tab.state.id!;

    assert.notEqual(jobsId, friendId);
    assert.deepEqual(
      tab.memory.list().map((conversation) => conversation.id),
      [jobsId, friendId],
      "most recent first",
    );
    assert.deepEqual(saidIn(tab.memory.get(friendId)), [FRIEND, FOLLOW_UP]);
    assert.deepEqual(saidIn(tab.memory.get(jobsId)), [JOBS]);

    // Two tabs continuing different situations at the same time don't overwrite each other.
    const otherTab = openTab(nextVisit(browser));
    otherTab.open(friendId);
    otherTab.send(CONTINUE);
    tab.send("The first offer pays more.");
    otherTab.answer(friendAnswer("Good. What changed?"));
    tab.answer(jobsAnswer("Pay is one part of it."));
    assert.deepEqual(saidIn(tab.memory.get(friendId)), [FRIEND, FOLLOW_UP, CONTINUE]);
    assert.deepEqual(saidIn(tab.memory.get(jobsId)), [JOBS, "The first offer pays more."]);
  });

  it("starts a new situation as a new conversation, and keeps the old one", () => {
    const browser = newBrowser();
    const tab = openTab(browser);
    const friendId = talkAboutFriend(tab);
    const before = tab.memory.get(friendId);

    tab.startNew();
    assert.deepEqual(tab.state, EMPTY_CONVERSATION);
    assert.equal(tab.memory.openId(), null, "a reload stays on the home page");
    assert.deepEqual(tab.memory.get(friendId), before, "the old situation is kept, unchanged");

    const context = tab.send(JOBS);
    assert.deepEqual(context, [{ role: "user", content: JOBS }], "nothing from the old situation is sent");
    assert.notEqual(tab.state.id, friendId);
    assert.equal(tab.memory.list().length, 2);
    assert.deepEqual(tab.memory.get(friendId), before);
  });

  it("continues a saved situation with that situation's history and nothing else", () => {
    const browser = newBrowser();
    const tab = openTab(browser);
    const friendId = talkAboutFriend(tab);
    const friend = tab.state.turns;
    tab.startNew();
    tab.send(JOBS);
    tab.answer(jobsAnswer("Compare them on what matters to you."));
    const jobsBefore = tab.memory.get(tab.state.id!);

    const later = openTab(nextVisit(browser));
    later.open(friendId);
    const context = later.send(CONTINUE);

    const answers = friend.flatMap((turn) => (turn.role === "assistant" && turn.status === "done" ? [turn.response] : []));
    assert.deepEqual(context, [
      { role: "user", content: FRIEND },
      { role: "assistant", content: answers[0] },
      { role: "user", content: FOLLOW_UP },
      { role: "assistant", content: answers[1] },
      { role: "user", content: CONTINUE },
    ]);
    assert.ok(!JSON.stringify(context).includes(JOBS), "the other situation stays out of it");
    // Only what was said is sent: no ids, timestamps or titles from memory.
    assert.ok(!JSON.stringify(context).includes(friendId));
    assert.ok(!JSON.stringify(context).includes('"at"'));

    later.answer(friendAnswer("Good. What changed?"));
    assert.deepEqual(saidIn(later.memory.get(friendId)), [FRIEND, FOLLOW_UP, CONTINUE]);
    assert.deepEqual(later.memory.get(jobsBefore!.id), jobsBefore, "the other situation is untouched");
  });

  it("sends a continued situation to Gemini as that one conversation", async () => {
    const browser = newBrowser();
    const tab = openTab(browser);
    const friendId = talkAboutFriend(tab);
    tab.startNew();
    tab.send(JOBS);
    tab.answer(jobsAnswer("Compare them on what matters to you."));

    const later = openTab(nextVisit(browser));
    later.open(friendId);
    const context = later.send(CONTINUE);

    // A stand-in for Google's API: no request leaves this machine.
    const reply = friendAnswer("Good. What changed?");
    const bodies: Array<{ contents: Array<{ role: string; parts: Array<{ text: string }> }> }> = [];
    const fetch = async (_input: string | URL | Request, init?: RequestInit) => {
      bodies.push(JSON.parse(String(init?.body)));
      const chunk = { candidates: [{ content: { role: "model", parts: [{ text: JSON.stringify(reply) }] }, finishReason: "STOP", index: 0 }] };
      return new Response(`data: ${JSON.stringify(chunk)}\n\n`, { headers: { "content-type": "text/event-stream" } });
    };
    const config = { ...readConfig({ GEMINI_API_KEY: "test-key" }), apiKey: "test-key" };
    const gemini = createGeminiProvider(config, { fetch: fetch as typeof globalThis.fetch, retry: { attempts: 1 } });
    const answer = await gemini.respond(context, { signal: new AbortController().signal, onStage: () => {} });
    assert.deepEqual(answer, reply);

    assert.equal(bodies.length, 1);
    const { contents } = bodies[0];
    assert.deepEqual(contents.map((content) => content.role), ["user", "model", "user", "model", "user"]);
    assert.equal(contents[0].parts[0].text, FRIEND);
    assert.deepEqual(JSON.parse(contents[1].parts[0].text), friendAnswer("Start by deciding what you want."));
    assert.equal(contents[2].parts[0].text, FOLLOW_UP);
    assert.equal(contents[4].parts[0].text, CONTINUE);
    assert.ok(!JSON.stringify(bodies[0]).includes(JOBS));
  });

  it("clears local memory completely, and nothing else", () => {
    const browser = newBrowser();
    browser.local.setItem("lifeexe-theme", "dark");
    const tab = openTab(browser);
    talkAboutFriend(tab);
    tab.startNew();
    tab.send(JOBS);
    assert.equal(tab.memory.list().length, 2);

    tab.memory.clear();
    assert.deepEqual(tab.memory.list(), []);
    assert.equal(browser.local.getItem(MEMORY_KEY), null);
    assert.equal(browser.local.getItem(LAST_OPEN_KEY), null);
    assert.equal(browser.session.getItem(OPEN_KEY), null);
    assert.deepEqual([...browser.local.data.keys()], ["lifeexe-theme"], "preferences are not conversations");

    for (const reopened of [openTab(browser), openTab(nextVisit(browser))]) {
      assert.deepEqual(reopened.state, EMPTY_CONVERSATION);
      assert.deepEqual(reopened.memory.list(), []);
    }
  });

  it("never stores API keys, or anything beyond the conversation", async () => {
    const SECRET = "AIzaSy-test-key-that-must-never-be-stored";
    const env = { GEMINI_API_KEY: SECRET };

    // The browser never receives the key: not from the status check...
    const status = await handleLifeRequest(new Request("http://localhost/api/life"), env);
    assert.deepEqual(await status.json(), { mode: "live" });
    // ...and not with an answer (the demo provider stands in for Gemini, so nothing leaves this machine).
    const stream = await handleLifeRequest(post([{ role: "user", content: FRIEND }]), env, {
      provider: createDemoProvider({ stageMs: 0 }),
    });
    const streamed = await stream.text();
    assert.ok(!streamed.includes(SECRET));

    // Memory writes the conversation field by field, whatever else a turn might carry.
    const browser = newBrowser();
    const tab = openTab(browser);
    tab.send(FRIEND);
    tab.answer(friendAnswer("Start by deciding what you want."));
    const polluted = tab.state.turns.map((turn) => ({
      ...turn,
      apiKey: SECRET,
      env,
      ...(turn.role === "assistant" && turn.status === "done" && { response: { ...turn.response, debug: SECRET } }),
    })) as Turn[];
    assert.ok(tab.memory.save(tab.state.id!, polluted));

    for (const store of [browser.local, browser.session]) {
      for (const [key, value] of store.data) {
        assert.ok(!key.includes(SECRET) && !value.includes(SECRET), `${key} holds no key`);
        assert.ok(!/GEMINI|api[_-]?key/i.test(value), `${key} holds no configuration`);
      }
    }
    assert.deepEqual([...browser.local.data.keys()].sort(), [LAST_OPEN_KEY, MEMORY_KEY]);
    assert.deepEqual([...browser.session.data.keys()], [OPEN_KEY]);
    assert.equal(browser.local.getItem(LAST_OPEN_KEY), tab.state.id);

    const file = JSON.parse(browser.local.getItem(MEMORY_KEY)!);
    assert.deepEqual(Object.keys(file), ["version", "conversations"]);
    const [conversation] = file.conversations;
    assert.deepEqual(Object.keys(conversation).sort(), ["createdAt", "id", "title", "turns", "updatedAt"]);
    assert.deepEqual(Object.keys(conversation.turns[0]).sort(), ["at", "id", "role", "text"]);
    assert.deepEqual(Object.keys(conversation.turns[1]).sort(), ["at", "id", "mode", "response", "role", "status"]);
    assert.deepEqual(Object.keys(conversation.turns[1].response).sort(), Object.keys(sampleResponse()).sort());
  });

  it("works the same in demo mode", async () => {
    const demo = createDemoProvider({ stageMs: 0 });
    const ask = async (messages: ChatMessage[]) => {
      const events = await readEvents(await handleLifeRequest(post(messages), {}, { provider: demo }));
      const meta = events.find((event) => event.type === "meta");
      const result = events.find((event) => event.type === "result");
      assert.ok(meta?.type === "meta" && result?.type === "result", "a demo answer came back");
      return { mode: meta.mode, response: result.response };
    };

    const browser = newBrowser();
    const tab = openTab(browser);
    let reply = await ask(tab.send(FRIEND));
    assert.equal(reply.mode, "demo");
    tab.answer(reply.response, reply.mode);
    reply = await ask(tab.send(FOLLOW_UP));
    tab.answer(reply.response, reply.mode);

    const reloaded = openTab(browser);
    assert.deepEqual(reloaded.state, tab.state);
    reply = await ask(reloaded.send(CONTINUE));
    reloaded.answer(reply.response, reply.mode);

    const [saved] = reloaded.memory.list();
    assert.deepEqual(saidIn(saved), [FRIEND, FOLLOW_UP, CONTINUE]);
    // Each answer remembers it came from demo mode, so it's still labelled "Demo response" when reopened.
    assert.deepEqual(
      saved.turns.flatMap((turn) => (turn.role === "assistant" ? [turn.mode] : [])),
      ["demo", "demo", "demo"],
    );
    assert.equal(saved.title, reply.response.title);
  });

  it("reads only what it can trust from storage", () => {
    const browser = newBrowser();
    browser.local.setItem(MEMORY_KEY, "{not json");
    assert.deepEqual(createMemory(browser.local).list(), []);

    // A damaged situation is skipped; the others still load.
    const tab = openTab(browser);
    const friendId = talkAboutFriend(tab);
    const file = JSON.parse(browser.local.getItem(MEMORY_KEY)!);
    const [good] = file.conversations;
    file.conversations.push(
      { ...good, id: "answer-first", turns: good.turns.slice(1) },
      { ...good, id: "missing-fields", turns: [good.turns[0], { ...good.turns[1], response: { lead: "only this" } }] },
      { ...good, id: "", turns: good.turns },
      "not a conversation",
    );
    browser.local.setItem(MEMORY_KEY, JSON.stringify(file));
    assert.deepEqual(
      createMemory(browser.local).list().map((conversation) => conversation.id),
      [friendId],
    );

    // Memory written by a newer version of LIFE.EXE is left alone rather than overwritten.
    const newer = JSON.stringify({ version: 3, conversations: [] });
    browser.local.setItem(MEMORY_KEY, newer);
    const memory = createMemory(browser.local);
    assert.deepEqual(memory.list(), []);
    assert.equal(memory.save("new", tab.state.turns), false);
    assert.equal(browser.local.getItem(MEMORY_KEY), newer);
  });

  it("makes room when storage is full, but never drops the situation being saved", () => {
    const browser = newBrowser();
    const memory = createMemory(browser.local, browser.session);
    const situation = (text: string): Turn[] => [{ id: `${text}-1`, role: "user", text, at: 0 }];
    memory.save("s1", situation("Situation 1"), 1000);
    memory.save("s2", situation("Situation 2"), 2000);
    memory.save("s3", situation("Situation 3"), 3000);

    // Full: a fourth situation fits only if the one untouched the longest goes.
    browser.local.quota = MEMORY_KEY.length + browser.local.getItem(MEMORY_KEY)!.length;
    assert.ok(memory.save("s4", situation("Situation 4"), 4000));
    assert.deepEqual(memory.list().map((conversation) => conversation.id), ["s4", "s3", "s2"]);

    // Too big to fit at all: nothing is saved, and nothing already saved is lost.
    const before = browser.local.getItem(MEMORY_KEY);
    assert.equal(memory.save("s5", situation("x".repeat(5000)), 5000), false);
    assert.equal(browser.local.getItem(MEMORY_KEY), before);
  });

  it(`keeps the ${MAX_SAVED} most recent situations`, () => {
    const memory = createMemory(new FakeStorage());
    for (let index = 1; index <= MAX_SAVED + 1; index++) {
      memory.save(`s${index}`, [{ id: `u${index}`, role: "user", text: `Situation ${index}`, at: index }], index);
    }
    const ids = memory.list().map((conversation) => conversation.id);
    assert.equal(ids.length, MAX_SAVED);
    assert.equal(ids[0], `s${MAX_SAVED + 1}`);
    assert.ok(!ids.includes("s1"));
  });

  it("keeps LIFE.EXE working when the browser blocks storage", () => {
    const turns: Turn[] = [{ id: "u1", role: "user", text: FRIEND, at: 0 }];
    const unavailable = createMemory(null, null);
    assert.equal(unavailable.save("a", turns), false);
    assert.deepEqual(unavailable.list(), []);
    assert.deepEqual(unavailable.reopen(), EMPTY_CONVERSATION);

    const denied = () => {
      throw new DOMException("The operation is insecure.", "SecurityError");
    };
    const blocked: KeyValueStore = { getItem: denied, setItem: denied, removeItem: denied };
    const memory = createMemory(blocked, blocked);
    assert.doesNotThrow(() => {
      memory.adoptLegacySession();
      assert.equal(memory.save("a", turns), false);
      assert.deepEqual(memory.list(), []);
      memory.setOpenId("a");
      assert.equal(memory.openId(), null);
      assert.deepEqual(memory.reopen(), EMPTY_CONVERSATION);
      memory.clear();
    });
  });

  it("keeps situations saved in the earlier answer format, and lets them continue", () => {
    const browser = newBrowser();
    browser.local.setItem(
      MEMORY_KEY,
      JSON.stringify({
        version: 1,
        conversations: [
          {
            id: "earlier",
            title: "A friend has gone quiet",
            focus: "relationship",
            createdAt: 1,
            updatedAt: 2,
            turns: [
              { id: "u1", role: "user", text: FRIEND, at: 1 },
              { id: "a1", role: "assistant", status: "done", response: EARLIER_ANSWER, mode: "demo", at: 2 },
            ],
          },
        ],
      }),
    );

    const tab = openTab(nextVisit(browser));
    const [saved] = tab.memory.list();
    assert.equal(saved.title, "A friend has gone quiet");
    // Shown in the current format: its lead is the answer, and the next move, wording and follow-ups carry over.
    assert.deepEqual(saved.turns[1], {
      id: "a1",
      role: "assistant",
      status: "done",
      mode: "demo",
      at: 2,
      response: {
        care: "",
        answer: "Send one low-pressure check-in.",
        points: [],
        question: "",
        nextMove: "Message them today.",
        scripts: ["Hey, everything okay?"],
        alternative: "",
        followUps: ["What if they don't reply?"],
        title: "A friend has gone quiet",
      },
    });

    // Continuing it works: the API accepts the history, and it's saved again in the current format.
    tab.open("earlier");
    const context = tab.send(CONTINUE);
    assert.ok(validateLifeRequest({ messages: context }).ok);
    tab.answer(friendAnswer("Good. What changed?"));
    const file = JSON.parse(browser.local.getItem(MEMORY_KEY)!);
    assert.equal(file.version, 2);
    assert.ok(!JSON.stringify(file).includes("whatsGoingOn"));
    assert.deepEqual(saidIn(tab.memory.get("earlier")), [FRIEND, CONTINUE]);
  });

  it("brings along a conversation kept by the previous version, in this tab", () => {
    const browser = newBrowser();
    browser.session.setItem(
      LEGACY_SESSION_KEY,
      JSON.stringify([
        { id: "u1", role: "user", text: FRIEND },
        { id: "a1", role: "assistant", status: "done", response: EARLIER_ANSWER, mode: "live" },
        { id: "u2", role: "user", text: FOLLOW_UP },
        { id: "e2", role: "assistant", status: "error", code: "network" },
      ]),
    );

    const tab = openTab(browser);
    assert.equal(browser.session.getItem(LEGACY_SESSION_KEY), null);
    assert.deepEqual(
      tab.state.turns.map((turn) => (turn.role === "user" ? turn.text : turn.status)),
      [FRIEND, "done", FOLLOW_UP, "error"],
    );
    assert.deepEqual(saidIn(tab.memory.get(tab.state.id!)), [FRIEND, FOLLOW_UP]);
  });
});
