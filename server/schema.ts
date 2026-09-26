import { z } from "zod";
import type { LifeResponse } from "../shared/contract.ts";

// Property order matters: the model writes fields in this order, and the stage tracker
// (see stages.ts) uses it to report real progress while the answer streams in.
export const lifeResponseSchema = z.object({
  care: z.string(),
  answer: z.string(),
  points: z.array(z.string()),
  question: z.string(),
  nextMove: z.string(),
  scripts: z.array(z.string()),
  alternative: z.string(),
  followUps: z.array(z.string()),
  title: z.string(),
});

// Keeps the zod schema and the shared TypeScript contract in lockstep.
type Parsed = z.infer<typeof lifeResponseSchema>;
const assertSameShape = (value: Parsed): LifeResponse => value;
void assertSameShape;

// The same schema as plain JSON Schema, sent to the model as its output format.
const { $schema: _dialect, ...schema } = z.toJSONSchema(lifeResponseSchema);
export const RESPONSE_SCHEMA = schema;

// Upper limits, whatever the model sends: answers stay short even when it gets carried away.
const CAPS = {
  points: 4,
  scripts: 3,
  followUps: 3,
} as const;

const MAX_FOLLOW_UP_CHARS = 80;

function cleanList(items: string[], max: number): string[] {
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, max);
}

/** Validates an unknown value against the response schema and tidies it for display. */
export function parseLifeResponse(value: unknown): LifeResponse | null {
  const result = lifeResponseSchema.safeParse(value);
  if (!result.success) return null;
  const r = result.data;
  return {
    care: r.care.trim(),
    answer: r.answer.trim(),
    points: cleanList(r.points, CAPS.points),
    question: r.question.trim(),
    nextMove: r.nextMove.trim(),
    scripts: cleanList(r.scripts, CAPS.scripts),
    alternative: r.alternative.trim(),
    followUps: cleanList(r.followUps, CAPS.followUps).filter((f) => f.length <= MAX_FOLLOW_UP_CHARS),
    title: r.title.trim(),
  };
}

/** A response is only worth showing if it says something to the person. */
export function hasContent(response: LifeResponse): boolean {
  return Boolean(response.answer || response.care || response.question || response.nextMove);
}
