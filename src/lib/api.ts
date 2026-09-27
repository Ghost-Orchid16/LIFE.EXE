import {
  API_PATH,
  ERROR_CODES,
  type ChatMessage,
  type ErrorCode,
  type LifeResponse,
  type Mode,
  type Stage,
  type StreamEvent,
} from "../../shared/contract.ts";

/** Everything the interface knows how to explain: server codes plus a lost connection. */
export type ClientErrorCode = ErrorCode | "network";

export class ApiError extends Error {
  readonly code: ClientErrorCode;

  constructor(code: ClientErrorCode) {
    super(code);
    this.name = "ApiError";
    this.code = code;
  }
}

const isErrorCode = (value: unknown): value is ErrorCode =>
  typeof value === "string" && (ERROR_CODES as readonly string[]).includes(value);

/** Asks the server whether it's running with the live AI or in demo mode. `null` if it can't be reached. */
export async function fetchMode(signal?: AbortSignal): Promise<Mode | null> {
  try {
    const response = await fetch(API_PATH, { headers: { accept: "application/json" }, signal });
    if (!response.ok) return null;
    const body: unknown = await response.json();
    const mode = (body as { mode?: unknown } | null)?.mode;
    return mode === "live" || mode === "demo" ? mode : null;
  } catch {
    return null;
  }
}

async function errorFromResponse(response: Response): Promise<ApiError> {
  try {
    const body: unknown = await response.json();
    const code = (body as { error?: { code?: unknown } } | null)?.error?.code;
    if (isErrorCode(code)) return new ApiError(code);
  } catch {
    // Not a LIFE.EXE error body (for example a hosting error page); fall back to the status.
  }
  if (response.status === 413) return new ApiError("too_long");
  if (response.status === 429) return new ApiError("rate_limited");
  if (response.status === 404 || response.status === 405) return new ApiError("unavailable");
  if (response.status === 504) return new ApiError("timeout");
  return new ApiError("server_error");
}

function parseEvent(chunk: string): StreamEvent | null {
  const data = chunk
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trimStart())
    .join("\n");
  if (!data) return null;
  try {
    return JSON.parse(data) as StreamEvent;
  } catch {
    return null;
  }
}

export interface SendOptions {
  signal: AbortSignal;
  onStage: (stage: Stage) => void;
  onMode: (mode: Mode) => void;
  /** The live AI couldn't answer this time, so this answer comes from the demo engine. */
  onFallback: () => void;
}

/**
 * Sends the conversation to the API and follows the streamed progress.
 * Resolves with LIFE.EXE's structured response, or rejects with an `ApiError`.
 * If the signal aborts, the fetch's AbortError is rethrown so the caller can tell why it stopped.
 */
export async function sendConversation(messages: ChatMessage[], options: SendOptions): Promise<LifeResponse> {
  let response: Response;
  try {
    response = await fetch(API_PATH, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "text/event-stream" },
      body: JSON.stringify({ messages }),
      signal: options.signal,
    });
  } catch (error) {
    if (options.signal.aborted) throw error;
    throw new ApiError("network");
  }

  if (!response.ok) throw await errorFromResponse(response);
  if (!response.body) throw new ApiError("network");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

      let boundary = buffer.indexOf("\n\n");
      while (boundary !== -1) {
        const event = parseEvent(buffer.slice(0, boundary));
        buffer = buffer.slice(boundary + 2);
        boundary = buffer.indexOf("\n\n");
        if (!event) continue;

        if (event.type === "meta") options.onMode(event.mode);
        else if (event.type === "fallback") options.onFallback();
        else if (event.type === "stage") options.onStage(event.stage);
        else if (event.type === "result") return event.response;
        else if (event.type === "error") throw new ApiError(isErrorCode(event.code) ? event.code : "server_error");
      }
    }
  } catch (error) {
    if (error instanceof ApiError || options.signal.aborted) throw error;
    throw new ApiError("network");
  } finally {
    reader.cancel().catch(() => {});
  }

  // The stream closed without an answer: the connection dropped somewhere along the way.
  throw new ApiError("network");
}
