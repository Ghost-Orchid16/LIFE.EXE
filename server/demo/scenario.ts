// The shape of demo mode's pre-written content, shared by content.ts and the scenario files in scenarios/.

import type { LifeResponse } from "../../shared/contract.ts";

/** A follow-up answer. Anything left out is empty; the title stays the scenario's. */
export type DemoReply = Pick<LifeResponse, "answer"> & Partial<Omit<LifeResponse, "answer" | "title">>;

export interface DemoScenario {
  id: string;
  /** A realistic first message this scenario answers, in the words someone might use. */
  example: string;
  /** Each pattern that matches the person's first message adds to the scenario's score. */
  keywords: RegExp[];
  /**
   * Broader words that add to the score only once a keyword has matched, so a word like "friend" or "exam"
   * helps a closely matching scenario win without being able to pick one on its own.
   */
  related?: RegExp[];
  initial: LifeResponse;
  /** A more fitting first answer when the person asks the question this scenario answers. */
  asked?: { match: RegExp; answer: string };
  direct: DemoReply;
  firstStep: DemoReply;
  words: DemoReply;
  /** Scenario-specific follow-ups, checked before the generic ones. */
  extras: Array<{ match: RegExp; reply: DemoReply }>;
}

const EMPTY: LifeResponse = {
  care: "",
  answer: "",
  points: [],
  question: "",
  nextMove: "",
  scripts: [],
  alternative: "",
  followUps: [],
  title: "",
};

export const initial = (fields: Pick<LifeResponse, "answer" | "title"> & Partial<LifeResponse>): LifeResponse => ({ ...EMPTY, ...fields });

export function composeReply(reply: DemoReply, title: string): LifeResponse {
  return { ...EMPTY, ...reply, title };
}
