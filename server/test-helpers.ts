import type { LifeResponse, StreamEvent } from "../shared/contract.ts";

export const sampleResponse = (overrides: Partial<LifeResponse> = {}): LifeResponse => ({
  care: "",
  answer: "Take the one that fits the next year or two, not forever.",
  points: [],
  question: "",
  nextMove: "Write down what you'd regret missing in each offer.",
  scripts: [],
  alternative: "",
  followUps: ["What if I choose wrong?"],
  title: "Choosing between two offers",
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
