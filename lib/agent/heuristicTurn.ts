import {
  classifySituation,
  generateStrategies,
  buildDecisionFrame,
  analyzeScam,
  buildRecoveryPlan,
  nextStepFor,
} from "@/lib/agent/engine";
import { runResearch } from "@/lib/research/service";
import type { AgentTurn } from "@/lib/types";

// The deterministic, keyword-based reasoning path (lib/agent/engine.ts).
// Used directly when no GEMINI_API_KEY is configured, and as a safety net if
// a live Gemini call fails — see lib/agent/gemini.ts and
// app/api/agent/route.ts. ScamSense's signal detection always runs through
// this deterministic path even in Gemini mode (see gemini.ts) since a fixed
// rule set is more auditable/trustworthy for that specific check than an
// LLM's own judgment.
export async function buildHeuristicTurn(input: string): Promise<AgentTurn> {
  const classification = classifySituation(input);

  const turn: AgentTurn = {
    id: `turn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    userInput: input,
    classification,
    nextStep: nextStepFor(classification),
  };

  if (classification.isScamLike) {
    turn.scam = analyzeScam(input);
  } else if (classification.isRecoveryMode) {
    turn.recovery = buildRecoveryPlan(input, classification);
  } else {
    turn.strategies = generateStrategies(input, classification);
    if (classification.primaryCategory === "decision") {
      turn.decisionFrame = buildDecisionFrame(input, classification);
    }
  }

  if (classification.needsResearch) {
    turn.research = await runResearch(input);
  }

  return turn;
}
