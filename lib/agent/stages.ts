import type { EngineStage } from "@/lib/types";

export const ENGINE_STAGES: EngineStage[] = [
  { id: "understand", index: 1, label: "Understand", message: "Understanding your situation…" },
  { id: "context", index: 2, label: "Context", message: "Identifying what matters…" },
  { id: "clarify", index: 3, label: "Clarify", message: "Checking what's still unclear…" },
  { id: "research", index: 4, label: "Research", message: "Checking whether current information is needed…" },
  { id: "explore", index: 5, label: "Explore", message: "Exploring your options…" },
  { id: "simulate", index: 6, label: "Simulate", message: "Simulating how this could unfold…" },
  { id: "decide", index: 7, label: "Decide", message: "Weighing what fits your situation…" },
  { id: "act", index: 8, label: "Act", message: "Building your next steps…" },
];
