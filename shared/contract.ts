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

/**
 * One LIFE.EXE answer: what to do, the next move, and the words to use when that helps.
 * Empty strings and arrays mean "nothing to show", and most answers leave several fields empty.
 */
export interface LifeResponse {
  /** Safety first: a short message pointing to real help when someone may be at risk. Usually empty. */
  care: string;
  /** The direct answer, in a few sentences. */
  answer: string;
  /** A few short points, only when they genuinely help. */
  points: string[];
  /** One clarifying question, only when the advice depends on it. */
  question: string;
  /** The most practical thing to do now. */
  nextMove: string;
  /** Words they could actually use, only when wording helps. */
  scripts: string[];
  /** Another approach, only when a real trade-off makes it worth mentioning. */
  alternative: string;
  /** Two or three things the person might want to ask next, in their own voice. */
  followUps: string[];
  /** A short name for the situation, used to list saved situations. Never shown with the answer. */
  title: string;
}

export type ChatMessage =
  | { role: "user"; content: string }
  | { role: "assistant"; content: LifeResponse };

export interface LifeRequest {
  messages: ChatMessage[];
}

export const STAGES = ["understanding", "thinking", "answering"] as const;
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
  /** The live AI couldn't answer this time, so this answer comes from the demo engine. The next message tries the live AI again. */
  | { type: "fallback" }
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
