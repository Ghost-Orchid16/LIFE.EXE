import Anthropic from "@anthropic-ai/sdk";
import type { ChatMessage, LifeResponse } from "../../shared/contract.ts";
import type { ServerConfig } from "../config.ts";
import { SYSTEM_PROMPT } from "../prompt.ts";
import { RESPONSE_FORMAT, hasContent, parseLifeResponse } from "../schema.ts";
import { createStageTracker } from "../stages.ts";
import { LifeError, type LifeProvider } from "./types.ts";

const MAX_TOKENS = 16_000;

// If the model's safety classifiers decline a request, "default" fallbacks re-run it on the
// model Anthropic recommends for that case instead of returning a refusal.
const FALLBACK_BETA = "server-side-fallback-2026-07-01";
const supportsServerFallbacks = (model: string) => /^claude-(opus-5|fable-5|mythos-5)/.test(model);

// Adaptive thinking and the effort control only exist on current-generation models.
const supportsEffort = (model: string) =>
  /^claude-(opus-(4-[6-9]|5)|sonnet-(4-6|5)|fable|mythos)/.test(model);

function toApiMessages(messages: ChatMessage[]): Anthropic.Beta.BetaMessageParam[] {
  return messages.map((message) =>
    message.role === "user"
      ? { role: "user", content: message.content }
      : { role: "assistant", content: JSON.stringify(message.content) },
  );
}

function readResponse(message: Anthropic.Beta.BetaMessage): LifeResponse {
  if (message.stop_reason === "refusal") throw new LifeError("refused");
  if (message.stop_reason === "max_tokens") throw new LifeError("invalid_response");

  // After a fallback the final model's answer is the last text block.
  const block = message.content.findLast((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text");
  if (!block) throw new LifeError("invalid_response");

  let json: unknown;
  try {
    json = JSON.parse(block.text);
  } catch (cause) {
    throw new LifeError("invalid_response", { cause });
  }
  const response = parseLifeResponse(json);
  if (!response || !hasContent(response)) throw new LifeError("invalid_response");
  return response;
}

function toLifeError(error: unknown, signal: AbortSignal): LifeError {
  if (error instanceof LifeError) return error;
  if (signal.aborted || error instanceof Anthropic.APIUserAbortError) return new LifeError("timeout", { cause: error });
  if (error instanceof Anthropic.APIConnectionTimeoutError) return new LifeError("timeout", { cause: error });
  if (error instanceof Anthropic.RateLimitError) return new LifeError("rate_limited", { cause: error });
  if (
    error instanceof Anthropic.AuthenticationError ||
    error instanceof Anthropic.PermissionDeniedError ||
    error instanceof Anthropic.NotFoundError ||
    error instanceof Anthropic.APIConnectionError
  ) {
    return new LifeError("unavailable", { cause: error });
  }
  if (error instanceof Anthropic.APIError && (error.type === "overloaded_error" || error.status === 529)) {
    return new LifeError("overloaded", { cause: error });
  }
  return new LifeError("server_error", { cause: error });
}

export interface AnthropicProviderOptions {
  /** Replaces the network layer; used by tests. */
  fetch?: typeof fetch;
}

export function createAnthropicProvider(
  config: ServerConfig & { apiKey: string },
  options: AnthropicProviderOptions = {},
): LifeProvider {
  const client = new Anthropic({
    apiKey: config.apiKey,
    // Pinned so ambient ANTHROPIC_* variables (e.g. injected by a hosting platform) can't redirect requests.
    authToken: null,
    baseURL: "https://api.anthropic.com",
    maxRetries: 1,
    timeout: 25_000,
    fetch: options.fetch,
  });

  const modern = supportsEffort(config.model);
  const fallbacks = supportsServerFallbacks(config.model);

  return {
    mode: "live",
    async respond(messages, { signal, onStage }) {
      const tracker = createStageTracker(onStage);
      try {
        const stream = client.beta.messages.stream(
          {
            model: config.model,
            max_tokens: MAX_TOKENS,
            system: SYSTEM_PROMPT,
            messages: toApiMessages(messages),
            cache_control: { type: "ephemeral" },
            ...(modern && { thinking: { type: "adaptive" } }),
            output_config: { format: RESPONSE_FORMAT, ...(modern && { effort: config.effort }) },
            ...(fallbacks && { betas: [FALLBACK_BETA], fallbacks: "default" }),
          },
          { signal },
        );

        for await (const event of stream) {
          if (event.type === "content_block_start" && event.content_block.type === "text") {
            tracker.resetBlock();
          } else if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            tracker.push(event.delta.text);
          }
        }
        return readResponse(await stream.finalMessage());
      } catch (error) {
        throw toLifeError(error, signal);
      }
    },
  };
}
