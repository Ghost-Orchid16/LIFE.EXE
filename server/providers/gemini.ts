import {
  ApiError,
  BlockedReason,
  FinishReason,
  GoogleGenAI,
  ThinkingLevel,
  type Content,
  type HttpRetryOptions,
} from "@google/genai";
import type { ChatMessage, LifeResponse } from "../../shared/contract.ts";
import type { ServerConfig } from "../config.ts";
import { SYSTEM_PROMPT } from "../prompt.ts";
import { RESPONSE_SCHEMA, hasContent, parseLifeResponse } from "../schema.ts";
import { createStageTracker } from "../stages.ts";
import { LifeError, type LifeProvider } from "./types.ts";

// One quick retry for transient failures such as rate limits or overload. Without retry options the SDK
// makes a single attempt; its built-in retry defaults (five attempts, up to a minute) would outlast the
// hosting time limit.
const RETRY: HttpRetryOptions = { attempts: 2, initialDelay: 1 };

// Thinking levels exist on Gemini 3 and later. Low keeps answers well inside the hosting time limit.
const supportsThinkingLevel = (model: string) => /^gemini-[3-9]/.test(model);

// Gemini ends a response early with one of these when its safety filters step in.
const REFUSAL_REASONS: ReadonlySet<string> = new Set([
  FinishReason.SAFETY,
  FinishReason.BLOCKLIST,
  FinishReason.PROHIBITED_CONTENT,
  FinishReason.SPII,
  FinishReason.IMAGE_SAFETY,
  FinishReason.IMAGE_PROHIBITED_CONTENT,
]);

/** Adds Gemini's `propertyOrdering` to every object, so fields are written in the order the stage tracker expects. */
function withPropertyOrdering(schema: unknown): unknown {
  if (Array.isArray(schema)) return schema.map(withPropertyOrdering);
  if (!schema || typeof schema !== "object") return schema;
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(schema)) result[key] = withPropertyOrdering(value);
  if (result.type === "object" && result.properties && typeof result.properties === "object") {
    result.propertyOrdering = Object.keys(result.properties);
  }
  return result;
}

const GEMINI_RESPONSE_SCHEMA = withPropertyOrdering(RESPONSE_SCHEMA);

function toContents(messages: ChatMessage[]): Content[] {
  return messages.map((message) =>
    message.role === "user"
      ? { role: "user", parts: [{ text: message.content }] }
      : { role: "model", parts: [{ text: JSON.stringify(message.content) }] },
  );
}

function readResponse(text: string, finishReason: string | undefined): LifeResponse {
  if (finishReason && REFUSAL_REASONS.has(finishReason)) throw new LifeError("refused");
  // Anything other than a normal stop (for example MAX_TOKENS) means the answer may be incomplete.
  if (finishReason && finishReason !== FinishReason.STOP) throw new LifeError("invalid_response");

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch (cause) {
    throw new LifeError("invalid_response", { cause });
  }
  const response = parseLifeResponse(json);
  if (!response || !hasContent(response)) throw new LifeError("invalid_response");
  return response;
}

function toLifeError(error: unknown, signal: AbortSignal): LifeError {
  if (error instanceof LifeError) return error;
  if (signal.aborted) return new LifeError("timeout", { cause: error });
  if (error instanceof ApiError) {
    if (error.status === 429) return new LifeError("rate_limited", { cause: error });
    if (error.status === 503) return new LifeError("overloaded", { cause: error });
    if (error.status === 504 || error.status === 408) return new LifeError("timeout", { cause: error });
    // An invalid key comes back as 400 INVALID_ARGUMENT with reason API_KEY_INVALID.
    const badKey = error.status === 400 && /API[_ ]key/i.test(error.message);
    if (badKey || error.status === 401 || error.status === 403 || error.status === 404) {
      return new LifeError("unavailable", { cause: error });
    }
    return new LifeError("server_error", { cause: error });
  }
  // `fetch` rejects with a TypeError when Google's servers can't be reached at all.
  if (error instanceof TypeError) return new LifeError("unavailable", { cause: error });
  return new LifeError("server_error", { cause: error });
}

export interface GeminiProviderOptions {
  /** Replaces the network layer; used by tests. */
  fetch?: typeof fetch;
  /** Replaces the retry timing; used by tests. */
  retry?: HttpRetryOptions;
}

export function createGeminiProvider(
  config: ServerConfig & { apiKey: string },
  options: GeminiProviderOptions = {},
): LifeProvider {
  const client = new GoogleGenAI({
    apiKey: config.apiKey,
    // Pinned so an ambient GOOGLE_GENAI_USE_VERTEXAI can't switch the client to a different Google service.
    vertexai: false,
    httpOptions: { retryOptions: options.retry ?? RETRY, fetch: options.fetch },
  });

  const thinkingConfig = supportsThinkingLevel(config.model) ? { thinkingLevel: ThinkingLevel.LOW } : undefined;

  return {
    mode: "live",
    async respond(messages, { signal, onStage }) {
      const tracker = createStageTracker(onStage);
      try {
        const stream = await client.models.generateContentStream({
          model: config.model,
          contents: toContents(messages),
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: "application/json",
            responseJsonSchema: GEMINI_RESPONSE_SCHEMA,
            ...(thinkingConfig && { thinkingConfig }),
            abortSignal: signal,
          },
        });

        let text = "";
        let finishReason: string | undefined;
        for await (const chunk of stream) {
          if (chunk.promptFeedback?.blockReason && chunk.promptFeedback.blockReason !== BlockedReason.BLOCKED_REASON_UNSPECIFIED) {
            throw new LifeError("refused");
          }
          // `text` only includes the answer itself; the model's thinking is never part of it.
          const delta = chunk.text ?? "";
          text += delta;
          tracker.push(delta);
          finishReason = chunk.candidates?.[0]?.finishReason ?? finishReason;
        }
        return readResponse(text, finishReason);
      } catch (error) {
        throw toLifeError(error, signal);
      }
    },
  };
}
