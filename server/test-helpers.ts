import type { LifeResponse, StreamEvent } from "../shared/contract.ts";

export const sampleResponse = (overrides: Partial<LifeResponse> = {}): LifeResponse => ({
  care: "",
  whatsGoingOn: "You have two offers and feel stuck.",
  whatMatters: ["Growth", "Stability"],
  whatsUnclear: ["The deadline."],
  lead: "Start with what matters most right now.",
  questions: [],
  options: [
    { title: "Compare", detail: "List priorities.", upside: "Clarity.", tradeoff: "Takes time." },
    { title: "Imagine", detail: "Picture a year in each.", upside: "Honest.", tradeoff: "Optimistic." },
  ],
  sayItLikeThis: [],
  nextMove: "Write both options side by side.",
  followUps: ["What should I do first?"],
  situation: {
    title: "Choosing between two offers",
    summary: "Two offers, one decision.",
    focus: "decision",
    matters: ["Growth", "Stability"],
    nextMove: "Compare the offers side by side.",
  },
  ...overrides,
});

/** Reads a server-sent event stream produced by the handler into a list of events. */
export async function readEvents(response: Response): Promise<StreamEvent[]> {
  const text = await response.text();
  return text
    .split("\n\n")
    .filter((chunk) => chunk.startsWith("data: "))
    .map((chunk) => JSON.parse(chunk.slice("data: ".length)) as StreamEvent);
}
