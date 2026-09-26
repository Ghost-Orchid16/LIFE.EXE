import { z } from "zod";
import { FOCUS_KINDS, type LifeResponse } from "../shared/contract.ts";

// Property order matters: the model writes fields in this order, and the stage tracker
// (see stages.ts) uses it to report real progress while the answer streams in.
export const lifeResponseSchema = z.object({
  care: z.string(),
  whatsGoingOn: z.string(),
  whatMatters: z.array(z.string()),
  whatsUnclear: z.array(z.string()),
  lead: z.string(),
  questions: z.array(z.string()),
  options: z.array(
    z.object({
      title: z.string(),
      detail: z.string(),
      upside: z.string(),
      tradeoff: z.string(),
    }),
  ),
  sayItLikeThis: z.array(z.string()),
  nextMove: z.string(),
  followUps: z.array(z.string()),
  situation: z.object({
    title: z.string(),
    summary: z.string(),
    focus: z.enum(FOCUS_KINDS),
    matters: z.array(z.string()),
    nextMove: z.string(),
  }),
});

// Keeps the zod schema and the shared TypeScript contract in lockstep.
type Parsed = z.infer<typeof lifeResponseSchema>;
const assertSameShape = (value: Parsed): LifeResponse => value;
void assertSameShape;

// The same schema as plain JSON Schema, sent to the model as its output format.
const { $schema: _dialect, ...schema } = z.toJSONSchema(lifeResponseSchema);
export const RESPONSE_SCHEMA = schema;

const CAPS = {
  whatMatters: 4,
  whatsUnclear: 3,
  questions: 3,
  options: 3,
  sayItLikeThis: 3,
  followUps: 3,
  situationMatters: 4,
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
    whatsGoingOn: r.whatsGoingOn.trim(),
    whatMatters: cleanList(r.whatMatters, CAPS.whatMatters),
    whatsUnclear: cleanList(r.whatsUnclear, CAPS.whatsUnclear),
    lead: r.lead.trim(),
    questions: cleanList(r.questions, CAPS.questions),
    options: r.options
      .map((option) => ({
        title: option.title.trim(),
        detail: option.detail.trim(),
        upside: option.upside.trim(),
        tradeoff: option.tradeoff.trim(),
      }))
      .filter((option) => option.title && option.detail)
      .slice(0, CAPS.options),
    sayItLikeThis: cleanList(r.sayItLikeThis, CAPS.sayItLikeThis),
    nextMove: r.nextMove.trim(),
    followUps: cleanList(r.followUps, CAPS.followUps).filter((f) => f.length <= MAX_FOLLOW_UP_CHARS),
    situation: {
      title: r.situation.title.trim(),
      summary: r.situation.summary.trim(),
      focus: r.situation.focus,
      matters: cleanList(r.situation.matters, CAPS.situationMatters),
      nextMove: r.situation.nextMove.trim(),
    },
  };
}

/** A response is only worth showing if it says something to the person. */
export function hasContent(response: LifeResponse): boolean {
  return Boolean(
    response.lead ||
      response.whatsGoingOn ||
      response.nextMove ||
      response.questions.length ||
      response.options.length ||
      response.care,
  );
}
