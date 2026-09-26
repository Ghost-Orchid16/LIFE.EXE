import { useCallback, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import type { ChatMessage, LifeResponse, Mode, Stage } from "../../shared/contract.ts";
import { ApiError, sendConversation, type ClientErrorCode } from "../lib/api.ts";

export type TurnErrorCode = ClientErrorCode | "interrupted";

export type UserTurn = { id: string; role: "user"; text: string };
export type AssistantTurn =
  | { id: string; role: "assistant"; status: "pending"; stage: Stage }
  | { id: string; role: "assistant"; status: "done"; response: LifeResponse; mode: Mode }
  | { id: string; role: "assistant"; status: "error"; code: TurnErrorCode };
export type Turn = UserTurn | AssistantTurn;

type Action =
  | { type: "send"; user: UserTurn; pending: AssistantTurn }
  | { type: "retry"; pending: AssistantTurn }
  | { type: "stage"; id: string; stage: Stage }
  | { type: "resolve"; id: string; response: LifeResponse; mode: Mode }
  | { type: "fail"; id: string; code: TurnErrorCode }
  | { type: "reset" };

// Stop waiting if nothing has come back in this long; the server gives up well before this.
const CLIENT_TIMEOUT_MS = 60_000;
const SESSION_KEY = "lifeexe-session";

const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const pendingTurn = (): AssistantTurn => ({ id: newId(), role: "assistant", status: "pending", stage: "understanding" });

function withoutTrailingError(turns: Turn[]): Turn[] {
  const last = turns.at(-1);
  return last?.role === "assistant" && last.status === "error" ? turns.slice(0, -1) : turns;
}

export const isBusy = (turns: Turn[]) => turns.some((t) => t.role === "assistant" && t.status === "pending");

function reducer(turns: Turn[], action: Action): Turn[] {
  switch (action.type) {
    case "send":
      return [...withoutTrailingError(turns), action.user, action.pending];
    case "retry":
      return [...withoutTrailingError(turns), action.pending];
    case "stage":
      return turns.map((t) =>
        t.id === action.id && t.role === "assistant" && t.status === "pending" ? { ...t, stage: action.stage } : t,
      );
    case "resolve":
      return turns.map((t) =>
        t.id === action.id ? { id: t.id, role: "assistant", status: "done", response: action.response, mode: action.mode } : t,
      );
    case "fail":
      return turns.map((t) => (t.id === action.id ? { id: t.id, role: "assistant", status: "error", code: action.code } : t));
    case "reset":
      return [];
  }
}

/** The conversation as the API expects it: finished turns only. */
function toMessages(turns: Turn[]): ChatMessage[] {
  return turns.flatMap((turn): ChatMessage[] => {
    if (turn.role === "user") return [{ role: "user", content: turn.text }];
    return turn.status === "done" ? [{ role: "assistant", content: turn.response }] : [];
  });
}

function isTurn(value: unknown): value is Turn {
  const turn = value as Partial<Record<string, unknown>> | null;
  if (!turn || typeof turn.id !== "string") return false;
  if (turn.role === "user") return typeof turn.text === "string";
  if (turn.role !== "assistant") return false;
  if (turn.status === "error") return typeof turn.code === "string";
  const response = turn.response as Partial<LifeResponse> | undefined;
  return turn.status === "done" && Array.isArray(response?.options) && typeof response?.situation?.title === "string";
}

// The conversation survives a reload of this tab, and nothing more: sessionStorage is cleared when the tab closes.
function restoreSession(): Turn[] {
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "[]");
    if (!Array.isArray(saved) || !saved.every(isTurn)) return [];
    const turns: Turn[] = saved;
    if (turns.at(-1)?.role === "user") turns.push({ id: newId(), role: "assistant", status: "error", code: "interrupted" });
    return turns;
  } catch {
    return [];
  }
}

function saveSession(turns: Turn[]) {
  try {
    const settled = turns.filter((t) => t.role === "user" || t.status !== "pending");
    if (settled.length) sessionStorage.setItem(SESSION_KEY, JSON.stringify(settled));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage can be unavailable (private mode, quotas). The conversation still works in memory.
  }
}

interface ActiveRequest {
  controller: AbortController;
  stopReason: "reset" | "timeout" | null;
}

export function useConversation(onMode: (mode: Mode) => void) {
  const [turns, dispatch] = useReducer(reducer, undefined, restoreSession);
  const turnsRef = useRef(turns);
  const active = useRef<ActiveRequest | null>(null);

  useLayoutEffect(() => {
    turnsRef.current = turns;
  }, [turns]);

  useEffect(() => saveSession(turns), [turns]);

  useEffect(() => () => active.current?.controller.abort(), []);

  const run = useCallback(
    async (history: Turn[], pendingId: string) => {
      const request: ActiveRequest = { controller: new AbortController(), stopReason: null };
      active.current = request;
      const timer = window.setTimeout(() => {
        request.stopReason = "timeout";
        request.controller.abort();
      }, CLIENT_TIMEOUT_MS);

      let mode: Mode = "live";
      try {
        const response = await sendConversation(toMessages(history), {
          signal: request.controller.signal,
          onStage: (stage) => dispatch({ type: "stage", id: pendingId, stage }),
          onMode: (next) => {
            mode = next;
            onMode(next);
          },
        });
        dispatch({ type: "resolve", id: pendingId, response, mode });
      } catch (error) {
        if (request.stopReason === "reset") return;
        const code: TurnErrorCode =
          request.stopReason === "timeout" ? "timeout" : error instanceof ApiError ? error.code : "network";
        dispatch({ type: "fail", id: pendingId, code });
      } finally {
        window.clearTimeout(timer);
        if (active.current === request) active.current = null;
      }
    },
    [onMode],
  );

  const send = useCallback(
    (text: string) => {
      const current = turnsRef.current;
      if (isBusy(current)) return;
      const user: UserTurn = { id: newId(), role: "user", text };
      const pending = pendingTurn();
      turnsRef.current = [...withoutTrailingError(current), user, pending];
      dispatch({ type: "send", user, pending });
      void run([...withoutTrailingError(current), user], pending.id);
    },
    [run],
  );

  const retry = useCallback(() => {
    const current = turnsRef.current;
    const last = current.at(-1);
    if (last?.role !== "assistant" || last.status !== "error") return;
    const pending = pendingTurn();
    turnsRef.current = [...withoutTrailingError(current), pending];
    dispatch({ type: "retry", pending });
    void run(withoutTrailingError(current), pending.id);
  }, [run]);

  const reset = useCallback(() => {
    if (active.current) {
      active.current.stopReason = "reset";
      active.current.controller.abort();
      active.current = null;
    }
    turnsRef.current = [];
    dispatch({ type: "reset" });
  }, []);

  return { turns, busy: isBusy(turns), send, retry, reset };
}
