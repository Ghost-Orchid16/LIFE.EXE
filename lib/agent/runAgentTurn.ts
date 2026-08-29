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

// ---------------------------------------------------------------------------
// Client-side agent pipeline runner.
//
// LIFE.EXE ships as a static export (no Node server — see next.config.ts and
// the gh-pages workflow), so the reasoning pipeline that used to live behind
// POST /api/agent runs directly in the browser instead. Nothing here reads a
// secret: the heuristic engine needs none, and lib/research/service.ts's
// live-provider branch (gated on SEARCH_API_KEY) is simply unreachable from a
// static bundle, so research always resolves through its labeled demo path.
// If this app is later deployed on a real Node server, this same function can
// be moved back behind an API route without any change to its callers.
// ---------------------------------------------------------------------------

export class AgentTurnError extends Error {}

export async function runAgentTurn(rawInput: string): Promise<AgentTurn> {
  const input = rawInput.trim();

  if (!input) {
    throw new AgentTurnError("Tell LIFE.EXE what's going on first.");
  }
  if (input.length > 4000) {
    throw new AgentTurnError("That's a lot — try trimming it to the essentials (under 4000 characters).");
  }

  try {
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
  } catch (e) {
    if (e instanceof AgentTurnError) throw e;
    throw new AgentTurnError("The LIFE ENGINE lost connection. Try again.");
  }
}
