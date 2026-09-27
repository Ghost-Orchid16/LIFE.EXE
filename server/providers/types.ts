import type { ChatMessage, ErrorCode, LifeResponse, Mode, Stage } from "../../shared/contract.ts";

export interface RespondOptions {
  /** Aborted when the person disconnects or the response deadline passes. */
  signal: AbortSignal;
  /** Called as the answer moves through understanding → thinking → answering. */
  onStage: (stage: Stage) => void;
  /** Called when the live AI couldn't answer this time and the demo engine answers instead (see `withFallback`). */
  onFallback?: (error: LifeError) => void;
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
  /**
   * The AI service was busy, slow or unreachable this time (rather than refusing, being set up wrongly or
   * giving an unusable answer), so another attempt could work.
   */
  readonly temporary: boolean;

  constructor(code: ErrorCode, options?: { cause?: unknown; temporary?: boolean }) {
    super(code, options);
    this.name = "LifeError";
    this.code = code;
    this.temporary = options?.temporary ?? false;
  }
}
