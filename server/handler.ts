import {
  LIMITS,
  type ChatMessage,
  type ErrorBody,
  type ErrorCode,
  type StatusBody,
  type StreamEvent,
} from "../shared/contract.ts";
import { readConfig, type Env } from "./config.ts";
import { createDemoProvider } from "./providers/demo.ts";
import { withFallback } from "./providers/fallback.ts";
import { createGeminiProvider } from "./providers/gemini.ts";
import { LifeError, type LifeProvider } from "./providers/types.ts";
import { validateLifeRequest } from "./validation.ts";

// Netlify stops synchronous functions after 30 seconds. Finishing a little earlier lets the
// browser show a clear "that took too long" message instead of a dropped connection.
const RESPONSE_DEADLINE_MS = 27_000;
// If Gemini is still working by then, the demo engine answers instead: it takes about two seconds.
const LIVE_DEADLINE_MS = 24_000;

/**
 * Live AI when a key is configured, otherwise the clearly labelled demo. In live mode the demo engine
 * also answers any single request that Gemini can't (rate limited, overloaded, too slow or unreachable).
 */
export function createProvider(env: Env): LifeProvider {
  const config = readConfig(env);
  if (!config.apiKey) return createDemoProvider();
  const gemini = createGeminiProvider({ ...config, apiKey: config.apiKey });
  return withFallback(gemini, createDemoProvider(), { liveTimeoutMs: LIVE_DEADLINE_MS });
}

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const STREAM_HEADERS = {
  "content-type": "text/event-stream; charset=utf-8",
  "cache-control": "no-cache, no-store, no-transform",
  "x-accel-buffering": "no",
};

function json(body: StatusBody | ErrorBody, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

const errorResponse = (code: ErrorCode, status: number) => json({ error: { code } }, status);

const TOO_LARGE = Symbol("too large");
const INVALID = Symbol("invalid");

async function readJsonBody(request: Request): Promise<unknown> {
  const declared = Number(request.headers.get("content-length"));
  if (declared > LIMITS.requestBytes) return TOO_LARGE;
  const text = await request.text();
  if (text.length > LIMITS.requestBytes) return TOO_LARGE;
  try {
    return JSON.parse(text);
  } catch {
    return INVALID;
  }
}

export interface HandlerOptions {
  /** Overrides the provider chosen from the environment; used by tests. */
  provider?: LifeProvider;
}

/**
 * `GET  /api/life` → `{ mode }`, so the interface can label demo mode up front.
 * `POST /api/life` → a server-sent event stream: `meta`, then `stage` updates, then `result` or `error`.
 */
export async function handleLifeRequest(request: Request, env: Env, options: HandlerOptions = {}): Promise<Response> {
  if (request.method === "GET" || request.method === "HEAD") {
    const mode = options.provider?.mode ?? (readConfig(env).apiKey ? "live" : "demo");
    return json({ mode });
  }
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { allow: "GET, POST" } });
  }

  // Requiring JSON means another site can't post here without a CORS preflight, which this API never grants.
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return errorResponse("invalid_request", 415);
  }

  const body = await readJsonBody(request);
  if (body === TOO_LARGE) return errorResponse("too_long", 413);
  if (body === INVALID) return errorResponse("invalid_request", 400);

  const validation = validateLifeRequest(body);
  if (!validation.ok) return errorResponse(validation.code, 400);

  const provider = options.provider ?? createProvider(env);
  return streamResponse(provider, validation.messages, request.signal);
}

function streamResponse(provider: LifeProvider, messages: ChatMessage[], clientSignal: AbortSignal): Response {
  const encoder = new TextEncoder();
  const abort = new AbortController();
  const stopWork = () => abort.abort();
  clientSignal.addEventListener("abort", stopWork, { once: true });
  let open = true;

  const body = new ReadableStream<Uint8Array>({
    async start(sink) {
      const send = (event: StreamEvent) => {
        if (!open) return;
        try {
          sink.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          open = false;
        }
      };
      const deadline = setTimeout(stopWork, RESPONSE_DEADLINE_MS);

      send({ type: "meta", mode: provider.mode });
      try {
        const response = await provider.respond(messages, {
          signal: abort.signal,
          onStage: (stage) => send({ type: "stage", stage }),
          onFallback: (error) => {
            // The details stay in the server log; the browser only learns that this answer is a demo one.
            const cause = error.cause instanceof Error ? error.cause.message : error.cause;
            console.warn(`[life.exe] live response failed (${error.code}); answering from the demo instead:`, cause);
            send({ type: "fallback" });
          },
        });
        send({ type: "result", response });
      } catch (error) {
        const code: ErrorCode = error instanceof LifeError ? error.code : "server_error";
        if (!clientSignal.aborted && code !== "refused") {
          const cause = error instanceof LifeError ? error.cause : error;
          console.error(`[life.exe] ${provider.mode} response failed (${code}):`, cause instanceof Error ? cause.message : cause);
        }
        send({ type: "error", code });
      } finally {
        clearTimeout(deadline);
        clientSignal.removeEventListener("abort", stopWork);
        if (open) {
          open = false;
          sink.close();
        }
      }
    },
    cancel() {
      // The browser went away: stop generating an answer nobody will read.
      open = false;
      stopWork();
    },
  });

  return new Response(body, { headers: STREAM_HEADERS });
}
