import type { ChatMessage, ErrorCode, LifeResponse, Mode, Stage } from "../../shared/contract.ts";

export interface RespondOptions {
  /** Aborted when the person disconnects or the response deadline passes. */
  signal: AbortSignal;
  /** Called as the answer moves through understanding → context → options → next move. */
  onStage: (stage: Stage) => void;
}

/**
 * Anything that can turn a conversation into a structured LIFE.EXE response.
 * To add another AI provider, implement this interface and select it in `createProvider`.
 */
export interface LifeProvider {
  readonly mode: Mode;
  respond(messages: ChatMessage[], options: RespondOptions): Promise<LifeResponse>;
}

/** An expected failure with a code the browser knows how to explain. */
export class LifeError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, options?: { cause?: unknown }) {
    super(code, options);
    this.name = "LifeError";
    this.code = code;
  }
}
