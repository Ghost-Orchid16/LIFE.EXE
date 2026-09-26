// The contract between the LIFE.EXE frontend and its API layer.
// Pure types and constants only: this file is bundled into both the browser app and the server.

export const API_PATH = "/api/life";

export const LIMITS = {
  /** Longest single message a person can send. */
  messageChars: 4000,
  /** Longest conversation (user + LIFE.EXE turns) the API accepts. */
  maxMessages: 40,
  /** Largest request body the API will read. */
  requestBytes: 400_000,
} as const;

export const FOCUS_KINDS = [
  "decision",
  "conversation",
  "relationship",
  "problem",
  "uncertainty",
  "setback",
  "pressure",
  "support",
] as const;
export type Focus = (typeof FOCUS_KINDS)[number];

export interface LifeOption {
  title: string;
  detail: string;
  upside: string;
  tradeoff: string;
}

/** The running summary shown beside the conversation. Updated on every turn. */
export interface SituationSnapshot {
  title: string;
  summary: string;
  focus: Focus;
  matters: string[];
  nextMove: string;
}

/** One structured LIFE.EXE response. Empty strings and arrays mean "nothing to show for this section". */
export interface LifeResponse {
  care: string;
  whatsGoingOn: string;
  whatMatters: string[];
  whatsUnclear: string[];
  lead: string;
  questions: string[];
  options: LifeOption[];
  sayItLikeThis: string[];
  nextMove: string;
  followUps: string[];
  situation: SituationSnapshot;
}

export type ChatMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: LifeResponse };

export interface LifeRequest {
  messages: ChatMessage[];
}

export const STAGES = ["understanding", "context", "options", "next"] as const;
export type Stage = (typeof STAGES)[number];

export type Mode = "live" | "demo";

export const ERROR_CODES = [
  "empty",
  "too_long",
  "too_many_messages",
  "invalid_request",
  "rate_limited",
  "overloaded",
  "timeout",
  "refused",
  "invalid_response",
  "unavailable",
  "server_error",
] as const;
export type ErrorCode = (typeof ERROR_CODES)[number];

/** Events streamed back from `POST /api/life`, one per server-sent event. */
export type StreamEvent =
  | { type: "meta"; mode: Mode }
  | { type: "stage"; stage: Stage }
  | { type: "result"; response: LifeResponse }
  | { type: "error"; code: ErrorCode };

/** Body of `GET /api/life`. */
export interface StatusBody {
  mode: Mode;
}

/** Body of a non-streamed error response. */
export interface ErrorBody {
  error: { code: ErrorCode };
}
