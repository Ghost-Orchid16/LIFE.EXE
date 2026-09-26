import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import type { Mode } from "../../shared/contract.ts";
import { ApiError, sendConversation } from "../lib/api.ts";
import {
  EMPTY_CONVERSATION,
  contextFor,
  isBusy,
  newId,
  pendingTurn,
  reducer,
  resumeTurns,
  savedSignature,
  withoutTrailingError,
  type ConversationState,
  type Turn,
  type TurnErrorCode,
  type UserTurn,
} from "../lib/conversation.ts";
import { MEMORY_KEY, createMemory, type KeyValueStore, type Memory } from "../lib/memory.ts";

export type { AssistantTurn, Turn, TurnErrorCode, UserTurn } from "../lib/conversation.ts";

// Stop waiting if nothing has come back in this long; the server gives up well before this.
const CLIENT_TIMEOUT_MS = 60_000;

/** The browser's storage, or `null` where it's blocked (some privacy settings throw on access). */
function browserStorage(name: "localStorage" | "sessionStorage"): KeyValueStore | null {
  try {
    return window[name];
  } catch {
    return null;
  }
}

function openMemory(): Memory {
  const memory = createMemory(browserStorage("localStorage"), browserStorage("sessionStorage"));
  memory.adoptLegacySession();
  return memory;
}

interface ActiveRequest {
  controller: AbortController;
  stopReason: "reset" | "timeout" | null;
}

export function useConversation(onMode: (mode: Mode) => void) {
  const [memory] = useState(openMemory);
  // Reopens the situation the person was in when they left. Nothing is sent until they send something.
  const [state, dispatch] = useReducer(reducer, memory, (opened) => opened.reopen());
  const [saved, setSaved] = useState(memory.list);
  const stateRef = useRef(state);
  // The open situation as last written to local memory, so it's written only when something new was said.
  const persisted = useRef({ id: state.id, signature: savedSignature(state.turns), stored: state.id !== null });
  const active = useRef<ActiveRequest | null>(null);

  useLayoutEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const { id, turns } = state;
    if (!id) return;
    const signature = savedSignature(turns);
    if (persisted.current.id === id && persisted.current.signature === signature) return;
    persisted.current = { id, signature, stored: memory.save(id, turns) };
    if (persisted.current.stored) setSaved(memory.list());
  }, [memory, state]);

  useEffect(() => memory.setOpenId(state.id), [memory, state.id]);

  useEffect(() => () => active.current?.controller.abort(), []);

  const stop = useCallback(() => {
    if (!active.current) return;
    active.current.stopReason = "reset";
    active.current.controller.abort();
    active.current = null;
  }, []);

  /** Shows `next` without saving it again: it came from local memory, or it's empty. */
  const show = useCallback((next: ConversationState) => {
    persisted.current = { id: next.id, signature: savedSignature(next.turns), stored: next.id !== null };
    stateRef.current = next;
    dispatch(next.id ? { type: "open", conversationId: next.id, turns: next.turns } : { type: "reset" });
  }, []);

  // Another tab changed local memory: refresh the list, and follow along if it touched this tab's situation.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== MEMORY_KEY) return;
      setSaved(memory.list());
      const { id, turns } = stateRef.current;
      if (!id || persisted.current.id !== id || !persisted.current.stored) return;
      const stored = memory.get(id);
      if (!stored) {
        // Deleted elsewhere (local memory was cleared): don't keep it here, or save it again.
        stop();
        show(EMPTY_CONVERSATION);
      } else if (!isBusy(turns) && savedSignature(stored.turns) !== savedSignature(turns)) {
        show({ id, turns: resumeTurns(stored.turns) });
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [memory, show, stop]);

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
        const response = await sendConversation(contextFor(history), {
          signal: request.controller.signal,
          onStage: (stage) => dispatch({ type: "stage", id: pendingId, stage }),
          onMode: (next) => {
            mode = next;
            onMode(next);
          },
        });
        dispatch({ type: "resolve", id: pendingId, response, mode, at: Date.now() });
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

  /** Sends a message in the open situation, or starts a new one. */
  const send = useCallback(
    (text: string) => {
      const current = stateRef.current;
      if (isBusy(current.turns)) return;
      const conversationId = current.id ?? newId();
      const user: UserTurn = { id: newId(), role: "user", text, at: Date.now() };
      const pending = pendingTurn();
      const history = [...withoutTrailingError(current.turns), user];
      stateRef.current = { id: conversationId, turns: [...history, pending] };
      dispatch({ type: "send", conversationId, user, pending });
      void run(history, pending.id);
    },
    [run],
  );

  const retry = useCallback(() => {
    const current = stateRef.current;
    const last = current.turns.at(-1);
    if (last?.role !== "assistant" || last.status !== "error") return;
    const pending = pendingTurn();
    const history = withoutTrailingError(current.turns);
    stateRef.current = { ...current, turns: [...history, pending] };
    dispatch({ type: "retry", pending });
    void run(history, pending.id);
  }, [run]);

  /** Back to a blank page. The situation that was open stays saved. */
  const startNew = useCallback(() => {
    stop();
    show(EMPTY_CONVERSATION);
    setSaved(memory.list());
  }, [memory, show, stop]);

  /** Opens a saved situation to continue it. */
  const open = useCallback(
    (id: string) => {
      const stored = memory.get(id);
      if (!stored) {
        setSaved(memory.list());
        return;
      }
      stop();
      show({ id, turns: resumeTurns(stored.turns) });
    },
    [memory, show, stop],
  );

  /** Deletes every saved situation from this browser, including the one open here. */
  const clearMemory = useCallback(() => {
    stop();
    memory.clear();
    show(EMPTY_CONVERSATION);
    setSaved([]);
  }, [memory, show, stop]);

  return {
    conversationId: state.id,
    turns: state.turns,
    busy: isBusy(state.turns),
    saved,
    send,
    retry,
    startNew,
    open,
    clearMemory,
  };
}
