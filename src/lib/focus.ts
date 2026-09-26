import type { Focus } from "../../shared/contract.ts";

export type Tone = "blue" | "cyan" | "coral" | "lime" | "violet";

export const FOCUS_META: Record<Focus, { label: string; description: string; tone: Tone }> = {
  decision: { label: "Decision", description: "Choosing between paths", tone: "blue" },
  conversation: { label: "Conversation", description: "Something needs to be said", tone: "cyan" },
  relationship: { label: "Relationship", description: "Where things stand with someone", tone: "violet" },
  problem: { label: "Problem", description: "Something needs fixing", tone: "coral" },
  uncertainty: { label: "Uncertainty", description: "Working with what isn't known yet", tone: "violet" },
  setback: { label: "Setback", description: "Moving forward after something went wrong", tone: "coral" },
  pressure: { label: "Pressure", description: "What you want vs. what's expected", tone: "cyan" },
  support: { label: "Support", description: "Safety and support come first", tone: "coral" },
};
