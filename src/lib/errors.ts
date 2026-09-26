import type { TurnErrorCode } from "../hooks/useConversation.ts";

export interface ErrorCopy {
  title: string;
  detail: string;
  /** Whether sending the same thing again could help. */
  retry: boolean;
}

const COPY: Record<TurnErrorCode, ErrorCopy> = {
  interrupted: {
    title: "That answer was interrupted.",
    detail: "Try again to pick up where you left off.",
    retry: true,
  },
  network: {
    title: "LIFE.EXE lost the connection.",
    detail: "Check your connection, then try again.",
    retry: true,
  },
  timeout: {
    title: "That took longer than it should have.",
    detail: "Try again. It usually goes through on a second attempt.",
    retry: true,
  },
  rate_limited: {
    title: "LIFE.EXE is handling a lot right now.",
    detail: "Give it a moment, then try again.",
    retry: true,
  },
  overloaded: {
    title: "LIFE.EXE's AI is busy right now.",
    detail: "Give it a moment, then try again.",
    retry: true,
  },
  unavailable: {
    title: "LIFE.EXE can't reach its AI right now.",
    detail: "Try again in a little while.",
    retry: true,
  },
  invalid_response: {
    title: "LIFE.EXE's answer came back garbled.",
    detail: "That's on our side, not yours. Try again.",
    retry: true,
  },
  server_error: {
    title: "Something went wrong on LIFE.EXE's side.",
    detail: "Try again in a moment.",
    retry: true,
  },
  refused: {
    title: "LIFE.EXE can't help with this one.",
    detail: "If you're dealing with something serious, please reach out to someone you trust or a professional who can help.",
    retry: false,
  },
  empty: {
    title: "There's nothing to work with yet.",
    detail: "Tell LIFE.EXE a little about what's going on.",
    retry: false,
  },
  too_long: {
    title: "That's a lot to take in at once.",
    detail: "Try trimming your message a little and send it again.",
    retry: false,
  },
  too_many_messages: {
    title: "This conversation has gotten long.",
    detail: "Start a new situation to keep things clear and focused.",
    retry: false,
  },
  invalid_request: {
    title: "LIFE.EXE couldn't read that.",
    detail: "Start a new situation and try again.",
    retry: false,
  },
};

export const errorCopy = (code: TurnErrorCode): ErrorCopy => COPY[code] ?? COPY.server_error;
