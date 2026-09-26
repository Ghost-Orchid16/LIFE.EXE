import { LIMITS, type ChatMessage, type ErrorCode } from "../shared/contract.ts";
import { parseLifeResponse } from "./schema.ts";

export type ValidationResult = { ok: true; messages: ChatMessage[] } | { ok: false; code: ErrorCode };

const fail = (code: ErrorCode): ValidationResult => ({ ok: false, code });

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function normalizeText(text: string): string {
  return text.replace(/\r\n?/g, "\n").trim();
}

/**
 * Checks a request body from the browser. The conversation must start and end with the
 * person's message. Two person messages in a row (a failed turn followed by a new message)
 * are merged into one so the model always sees alternating turns.
 */
export function validateLifeRequest(body: unknown): ValidationResult {
  if (!isRecord(body) || !Array.isArray(body.messages)) return fail("invalid_request");

  const raw: unknown[] = body.messages;
  if (raw.length === 0) return fail("empty");
  if (raw.length > LIMITS.maxMessages) return fail("too_many_messages");

  const messages: ChatMessage[] = [];
  for (const item of raw) {
    if (!isRecord(item)) return fail("invalid_request");
    const previous = messages.at(-1);

    if (item.role === "user") {
      if (typeof item.content !== "string") return fail("invalid_request");
      const text = normalizeText(item.content);
      if (!text) return fail("empty");
      if (text.length > LIMITS.messageChars) return fail("too_long");
      if (previous?.role === "user") previous.content = `${previous.content}\n\n${text}`;
      else messages.push({ role: "user", content: text });
    } else if (item.role === "assistant") {
      if (previous?.role !== "user") return fail("invalid_request");
      const response = parseLifeResponse(item.content);
      if (!response) return fail("invalid_request");
      messages.push({ role: "assistant", content: response });
    } else {
      return fail("invalid_request");
    }
  }

  if (messages.at(-1)?.role !== "user") return fail("invalid_request");
  return { ok: true, messages };
}
