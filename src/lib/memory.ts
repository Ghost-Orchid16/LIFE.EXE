// Local memory: situations are saved in this browser (localStorage) so a person can come back to them.
// Nothing here is sent anywhere. A saved conversation only leaves the browser when the person continues it,
// as the context of that one request, exactly like a conversation that never left the tab.

import type { LifeResponse } from "../../shared/contract.ts";
import {
  EMPTY_CONVERSATION,
  newId,
  resumeTurns,
  savedTurns,
  type AnswerTurn,
  type ConversationState,
  type SavedTurn,
  type Turn,
} from "./conversation.ts";

/** The part of the Web Storage API that memory uses, so tests can run it on a stand-in. */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/** Saved situations (localStorage): they stay in this browser until local memory is cleared. */
export const MEMORY_KEY = "lifeexe-memory";
/** The situation open when LIFE.EXE was last used (localStorage), so coming back reopens it. Empty: the home page. */
export const LAST_OPEN_KEY = "lifeexe-last-open";
/** The situation open in this tab (sessionStorage), so a reload keeps each tab where it was. Empty: the home page. */
export const OPEN_KEY = "lifeexe-open";
/** Where earlier versions kept the tab's conversation (sessionStorage). */
export const LEGACY_SESSION_KEY = "lifeexe-session";

// Version 1 saved answers in the earlier, longer format; they are read into the current one.
const VERSION = 2;
/** How many situations memory keeps. Beyond this, the one untouched the longest makes room. */
export const MAX_SAVED = 50;
const TITLE_CHARS = 80;

export interface SavedConversation {
  id: string;
  /** A short summary of the situation: LIFE.EXE's latest title for it, or the start of the first message. */
  title: string;
  createdAt: number;
  updatedAt: number;
  turns: SavedTurn[];
}

// ---------- Reading what's stored ----------
// Stored data outlives the version of LIFE.EXE that wrote it, so it is checked field by field on the way in
// and on the way out. Only these fields are ever written: nothing else about the app or its configuration.

type Json = Record<string, unknown>;

const isRecord = (value: unknown): value is Json => typeof value === "object" && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === "string";
const isTime = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);
const texts = (value: unknown): string[] | null => (Array.isArray(value) && value.every(isText) ? [...value] : null);

/** An answer in the current format. */
function readCurrentResponse(value: Json): LifeResponse | null {
  const { care, answer, question, nextMove, alternative, title } = value;
  const points = texts(value.points);
  const scripts = texts(value.scripts);
  const followUps = texts(value.followUps);
  if (!isText(care) || !isText(answer) || !isText(question) || !isText(nextMove) || !isText(alternative) || !isText(title)) {
    return null;
  }
  if (!points || !scripts || !followUps) return null;
  return { care, answer, points, question, nextMove, scripts, alternative, followUps, title };
}

/**
 * An answer saved in the earlier, longer format, reduced to what the current format shows: its lead becomes
 * the answer, and its next move, wording and follow-ups carry over. The old analysis sections are dropped.
 */
function readEarlierResponse(value: Json): LifeResponse | null {
  const { care, whatsGoingOn, lead, nextMove, situation } = value;
  const questions = texts(value.questions);
  const scripts = texts(value.sayItLikeThis);
  const followUps = texts(value.followUps);
  if (!isText(care) || !isText(whatsGoingOn) || !isText(lead) || !isText(nextMove)) return null;
  if (!questions || !scripts || !followUps || !isRecord(situation) || !isText(situation.title)) return null;
  return {
    care,
    answer: lead || whatsGoingOn,
    points: [],
    question: questions[0] ?? "",
    nextMove,
    scripts,
    alternative: "",
    followUps,
    title: situation.title,
  };
}

/** A clean copy of one of LIFE.EXE's answers, or `null` if the value isn't one. */
export function readResponse(value: unknown): LifeResponse | null {
  if (!isRecord(value)) return null;
  return "answer" in value ? readCurrentResponse(value) : readEarlierResponse(value);
}

function readTurn(value: unknown, fallbackTime: number): SavedTurn | null {
  if (!isRecord(value) || !isText(value.id) || !value.id) return null;
  const at = isTime(value.at) ? value.at : fallbackTime;
  if (value.role === "user") return isText(value.text) ? { id: value.id, role: "user", text: value.text, at } : null;
  if (value.role !== "assistant" || value.status !== "done") return null;
  const response = readResponse(value.response);
  const mode = value.mode === "live" || value.mode === "demo" ? value.mode : null;
  return response && mode ? { id: value.id, role: "assistant", status: "done", response, mode, at } : null;
}

/** Starts with the person's message, and every answer follows one of theirs: a conversation the API accepts. */
const isWellFormed = (turns: SavedTurn[]) =>
  turns.length > 0 && turns.every((turn, index) => turn.role === "user" || turns[index - 1]?.role === "user");

/** Clean copies of the turns worth keeping. Unfinished and failed answers are left out. `null` if malformed. */
function readTurns(values: unknown, fallbackTime: number): SavedTurn[] | null {
  if (!Array.isArray(values)) return null;
  const turns: SavedTurn[] = [];
  for (const value of values) {
    if (isRecord(value) && value.role === "assistant" && value.status !== "done") continue;
    const turn = readTurn(value, fallbackTime);
    if (!turn) return null;
    turns.push(turn);
  }
  return isWellFormed(turns) ? turns : null;
}

function clip(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  if (flat.length <= TITLE_CHARS) return flat;
  const cut = flat.slice(0, TITLE_CHARS - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > TITLE_CHARS / 2 ? cut.slice(0, space) : cut).replace(/[\s,;:.!?-]+$/, "")}…`;
}

/** The short summary shown in the list of saved situations. */
function summarize(turns: SavedTurn[]): string {
  const answer = turns.findLast((turn): turn is AnswerTurn => turn.role === "assistant");
  const first = turns.find((turn) => turn.role === "user");
  return clip(answer?.response.title ?? "") || clip(first?.text ?? "") || "Untitled situation";
}

function readConversation(value: unknown): SavedConversation | null {
  if (!isRecord(value) || !isText(value.id) || !value.id || !isTime(value.createdAt) || !isTime(value.updatedAt)) {
    return null;
  }
  const turns = readTurns(value.turns, value.updatedAt);
  if (!turns) return null;
  return {
    id: value.id,
    title: isText(value.title) && value.title.trim() ? clip(value.title) : summarize(turns),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    turns,
  };
}

interface Loaded {
  conversations: SavedConversation[];
  /** False when storage is unavailable, or holds memory from a newer version of LIFE.EXE that must not be overwritten. */
  writable: boolean;
}

function load(store: KeyValueStore | null): Loaded {
  let raw: string | null;
  try {
    if (!store) return { conversations: [], writable: false };
    raw = store.getItem(MEMORY_KEY);
  } catch {
    return { conversations: [], writable: false };
  }
  if (!raw) return { conversations: [], writable: true };

  let file: unknown;
  try {
    file = JSON.parse(raw);
  } catch {
    return { conversations: [], writable: true };
  }
  if (!isRecord(file)) return { conversations: [], writable: true };
  if (isTime(file.version) && file.version > VERSION) return { conversations: [], writable: false };
  const readable = file.version === VERSION || file.version === 1;
  if (!readable || !Array.isArray(file.conversations)) return { conversations: [], writable: true };

  const byId = new Map<string, SavedConversation>();
  for (const value of file.conversations) {
    const conversation = readConversation(value);
    if (conversation && !byId.has(conversation.id)) byId.set(conversation.id, conversation);
  }
  const conversations = [...byId.values()].sort((a, b) => b.updatedAt - a.updatedAt);
  return { conversations, writable: true };
}

function attempt(action: () => void): boolean {
  try {
    action();
    return true;
  } catch {
    return false;
  }
}

function read(store: KeyValueStore | null, key: string): string | null {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

// ---------- The memory ----------

/**
 * Local memory on top of the browser's storage: `local` keeps saved situations and the one last open,
 * `session` remembers which one this tab has open. Either can be `null` (storage blocked); memory then
 * quietly keeps nothing and LIFE.EXE works as before, for as long as the tab is open.
 */
export function createMemory(local: KeyValueStore | null, session: KeyValueStore | null = null) {
  const list = (): SavedConversation[] => load(local).conversations;

  const get = (id: string): SavedConversation | null => list().find((conversation) => conversation.id === id) ?? null;

  /** Saves one situation, leaving every other one as it is. Returns whether it was saved. */
  function save(id: string, turns: Turn[], now = Date.now()): boolean {
    const kept = readTurns(savedTurns(turns), now);
    const { conversations, writable } = load(local);
    if (!local || !writable || !id || !kept) return false;

    const conversation: SavedConversation = {
      id,
      title: summarize(kept),
      createdAt: conversations.find((existing) => existing.id === id)?.createdAt ?? now,
      updatedAt: now,
      turns: kept,
    };
    const others = conversations.filter((existing) => existing.id !== id).slice(0, MAX_SAVED - 1);
    // If storage is full, let the situations untouched the longest go, one at a time. Never this one.
    for (let count = others.length; count >= 0; count--) {
      const file = { version: VERSION, conversations: [conversation, ...others.slice(0, count)] };
      if (attempt(() => local.setItem(MEMORY_KEY, JSON.stringify(file)))) return true;
    }
    return false;
  }

  /** Deletes every saved situation from this browser. The theme and everything else stay as they are. */
  function clear() {
    attempt(() => local?.removeItem(MEMORY_KEY));
    attempt(() => local?.removeItem(LAST_OPEN_KEY));
    attempt(() => session?.removeItem(OPEN_KEY));
    attempt(() => session?.removeItem(LEGACY_SESSION_KEY));
  }

  /** The situation to show: this tab's after a reload, otherwise the one open when LIFE.EXE was last used. */
  function openId(): string | null {
    return (read(session, OPEN_KEY) ?? read(local, LAST_OPEN_KEY)) || null;
  }

  function setOpenId(id: string | null) {
    attempt(() => session?.setItem(OPEN_KEY, id ?? ""));
    attempt(() => (id ? local?.setItem(LAST_OPEN_KEY, id) : local?.removeItem(LAST_OPEN_KEY)));
  }

  /** What LIFE.EXE shows when it opens: the situation the person was in, exactly as they left it. Nothing is sent. */
  function reopen(): ConversationState {
    const id = openId();
    const saved = id ? get(id) : null;
    return saved ? { id: saved.id, turns: resumeTurns(saved.turns) } : EMPTY_CONVERSATION;
  }

  /** Earlier versions kept the tab's conversation in sessionStorage. Moves it into memory and reopens it. */
  function adoptLegacySession(now = Date.now()) {
    let turns: SavedTurn[] | null;
    try {
      const raw = session?.getItem(LEGACY_SESSION_KEY);
      if (!raw) return;
      session?.removeItem(LEGACY_SESSION_KEY);
      turns = readTurns(JSON.parse(raw), now);
    } catch {
      return;
    }
    const id = newId();
    if (turns && save(id, turns, now)) setOpenId(id);
  }

  return { list, get, save, clear, openId, setOpenId, reopen, adoptLegacySession };
}

export type Memory = ReturnType<typeof createMemory>;
