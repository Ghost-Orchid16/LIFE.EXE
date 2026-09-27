import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { sampleResponse } from "../../server/test-helpers.ts";
import type { Turn } from "../lib/conversation.ts";
import {
  LAST_OPEN_KEY,
  LEGACY_SESSION_KEY,
  MEMORY_KEY,
  OPEN_KEY,
  createMemory,
  type KeyValueStore,
  type SavedConversation,
} from "../lib/memory.ts";

/** What LIFE.EXE opens with: useConversation's first render. The app shows the home page while there are no turns. */
interface Opened {
  conversationId: string | null;
  turns: Turn[];
  saved: SavedConversation[];
}

// The hook reads the browser's storage through `window`, so it's type-checked with the app, which has the DOM types
// these Node tests don't. Importing it by a non-literal path keeps it out of this project's type check.
const HOOK = "./useConversation.ts";
const { useConversation }: { useConversation: (onMode: () => void) => Opened } = await import(HOOK);

/** Stands in for localStorage or sessionStorage. */
class FakeStorage implements KeyValueStore {
  readonly data = new Map<string, string>();

  getItem(key: string) {
    return this.data.get(key) ?? null;
  }

  setItem(key: string, value: string) {
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

/** Opens LIFE.EXE in a tab of `browser`, the way a visit or a reload does, and returns what it starts with. */
function openApp(browser: Browser): Opened {
  const global = globalThis as { window?: unknown };
  global.window = { localStorage: browser.local, sessionStorage: browser.session };
  try {
    const renders: Opened[] = [];
    const App = () => {
      renders.push(useConversation(() => {}));
      return null;
    };
    renderToString(createElement(App));
    assert.equal(renders.length, 1);
    return renders[0];
  } finally {
    delete global.window;
  }
}

const FRIEND = "My friend has gone quiet and I don't know why.";
const JOBS = "I have two job offers and I can't choose between them.";

/** A situation with one exchange, as the app saves it. */
const situation = (id: string, text: string, title: string): Turn[] => [
  { id: `${id}-message`, role: "user", text, at: 1 },
  { id: `${id}-answer`, role: "assistant", status: "done", response: sampleResponse({ title }), mode: "live", at: 2 },
];

describe("Opening LIFE.EXE", () => {
  it("starts on the home page on a fresh visit, with saved situations listed and kept as they were", () => {
    const browser = newBrowser();
    const memory = createMemory(browser.local);
    memory.save("friend", situation("friend", FRIEND, "A friend has gone quiet"), 1000);
    memory.save("jobs", situation("jobs", JOBS, "Choosing between two offers"), 2000);
    // An earlier version reopened the situation that was open when LIFE.EXE was last used.
    browser.local.setItem(LAST_OPEN_KEY, "jobs");
    const stored = browser.local.getItem(MEMORY_KEY);

    const opened = openApp(browser);
    assert.equal(opened.conversationId, null);
    assert.deepEqual(opened.turns, [], "the home page, not the situation that was open");
    assert.deepEqual(
      opened.saved.map(({ id, title }) => ({ id, title })),
      [
        { id: "jobs", title: "Choosing between two offers" },
        { id: "friend", title: "A friend has gone quiet" },
      ],
      "saved situations are listed to continue, most recent first",
    );
    assert.equal(browser.local.getItem(MEMORY_KEY), stored, "and kept exactly as they were");
  });

  it("starts on the home page after a reload, even in a tab that had a situation open", () => {
    const browser = newBrowser();
    createMemory(browser.local).save("friend", situation("friend", FRIEND, "A friend has gone quiet"), 1000);
    // What an earlier version left in a tab with the situation open, so that a reload reopened it.
    browser.session.setItem(OPEN_KEY, "friend");
    browser.local.setItem(LAST_OPEN_KEY, "friend");

    for (const reload of ["first reload", "second reload"]) {
      const opened = openApp(browser);
      assert.equal(opened.conversationId, null, reload);
      assert.deepEqual(opened.turns, [], reload);
      assert.deepEqual(opened.saved.map(({ id }) => id), ["friend"], reload);
    }
  });

  it("lists a conversation an earlier version kept in the tab, without opening it", () => {
    const browser = newBrowser();
    browser.session.setItem(LEGACY_SESSION_KEY, JSON.stringify([{ id: "u1", role: "user", text: FRIEND }]));

    const opened = openApp(browser);
    assert.equal(opened.conversationId, null);
    assert.deepEqual(opened.turns, []);
    assert.deepEqual(opened.saved.map(({ title }) => title), [FRIEND]);
  });
});
