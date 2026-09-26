import { LIMITS, type ChatMessage, type LifeResponse, type Mode, type Stage } from "../../shared/contract.ts";
import type { ClientErrorCode } from "./api.ts";

export type TurnErrorCode = ClientErrorCode | "interrupted";

export type UserTurn = { id: string; role: "user"; text: string; at: number };
export type AnswerTurn = { id: string; role: "assistant"; status: "done"; response: LifeResponse; mode: Mode; at: number };
export type AssistantTurn =
  | { id: string; role: "assistant"; status: "pending"; stage: Stage }
  | AnswerTurn
  | { id: string; role: "assistant"; status: "error"; code: TurnErrorCode };
export type Turn = UserTurn | AssistantTurn;
/** The turns worth keeping: what the person said, and LIFE.EXE's finished answers. */
export type SavedTurn = UserTurn | AnswerTurn;

export interface ConversationState {
  /** Identifies the situation in local memory. `null` until the first message of a new situation. */
  id: string | null;
  turns: Turn[];
}

export const EMPTY_CONVERSATION: ConversationState = { id: null, turns: [] };

export type Action =
  | { type: "send"; conversationId: string; user: UserTurn; pending: AssistantTurn }
  | { type: "retry"; pending: AssistantTurn }
  | { type: "stage"; id: string; stage: Stage }
  | { type: "resolve"; id: string; response: LifeResponse; mode: Mode; at: number }
  | { type: "fail"; id: string; code: TurnErrorCode }
  | { type: "open"; conversationId: string; turns: Turn[] }
  | { type: "reset" };

export const newId = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const pendingTurn = (): AssistantTurn => ({ id: newId(), role: "assistant", status: "pending", stage: "understanding" });

export function withoutTrailingError(turns: Turn[]): Turn[] {
  const last = turns.at(-1);
  return last?.role === "assistant" && last.status === "error" ? turns.slice(0, -1) : turns;
}

export const isBusy = (turns: Turn[]) => turns.some((t) => t.role === "assistant" && t.status === "pending");

export const savedTurns = (turns: Turn[]): SavedTurn[] =>
  turns.filter((turn): turn is SavedTurn => turn.role === "user" || turn.status === "done");

/** Changes whenever a message or a finished answer is added, and only then. */
export const savedSignature = (turns: Turn[]) =>
  savedTurns(turns)
    .map((turn) => turn.id)
    .join(" ");

export function reducer(state: ConversationState, action: Action): ConversationState {
  switch (action.type) {
    case "send":
      return { id: action.conversationId, turns: [...withoutTrailingError(state.turns), action.user, action.pending] };
    case "retry":
      return { ...state, turns: [...withoutTrailingError(state.turns), action.pending] };
    case "stage":
      return {
        ...state,
        turns: state.turns.map((t) =>
          t.id === action.id && t.role === "assistant" && t.status === "pending" ? { ...t, stage: action.stage } : t,
        ),
      };
    case "resolve":
      return {
        ...state,
        turns: state.turns.map((t) =>
          t.id === action.id
            ? { id: t.id, role: "assistant", status: "done", response: action.response, mode: action.mode, at: action.at }
            : t,
        ),
      };
    case "fail":
      return {
        ...state,
        turns: state.turns.map((t) => (t.id === action.id ? { id: t.id, role: "assistant", status: "error", code: action.code } : t)),
      };
    case "open":
      return { id: action.conversationId, turns: action.turns };
    case "reset":
      return EMPTY_CONVERSATION;
  }
}

/** A saved conversation, ready to continue. Nothing is sent: an unanswered last message waits for "Try again". */
export function resumeTurns(saved: SavedTurn[]): Turn[] {
  const turns: Turn[] = [...saved];
  if (turns.at(-1)?.role === "user") turns.push({ id: newId(), role: "assistant", status: "error", code: "interrupted" });
  return turns;
}

/** The conversation as the API expects it: what the person said and LIFE.EXE's finished answers. */
export function toMessages(turns: Turn[]): ChatMessage[] {
  return savedTurns(turns).map((turn): ChatMessage =>
    turn.role === "user" ? { role: "user", content: turn.text } : { role: "assistant", content: turn.response },
  );
}

/**
 * What to send when the person continues a conversation: that conversation and nothing else.
 * A thread longer than the API accepts keeps its opening exchange (the situation as first described)
 * and its most recent messages. Every answer carries LIFE.EXE's updated summary of the whole situation,
 * so the latest answers still cover what the middle of a long thread said.
 */
export function contextFor(turns: Turn[], limit: number = LIMITS.maxMessages): ChatMessage[] {
  const messages = toMessages(turns);
  if (messages.length <= limit) return messages;
  const opening = messages[1]?.role === "assistant" ? messages.slice(0, 2) : messages.slice(0, 1);
  let recent = messages.slice(Math.max(opening.length, messages.length - (limit - opening.length)));
  // Pick up from one of the person's messages, so turns keep alternating.
  while (recent[0]?.role === "assistant") recent = recent.slice(1);
  return [...opening, ...recent];
}
