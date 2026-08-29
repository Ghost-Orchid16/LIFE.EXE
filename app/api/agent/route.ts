import { NextRequest, NextResponse } from "next/server";
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = typeof body?.input === "string" ? body.input.trim() : "";

    if (!input) {
      return NextResponse.json({ error: "Tell LIFE.EXE what's going on first." }, { status: 400 });
    }
    if (input.length > 4000) {
      return NextResponse.json({ error: "That's a lot — try trimming it to the essentials (under 4000 characters)." }, { status: 400 });
    }

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

    return NextResponse.json({ turn });
  } catch {
    return NextResponse.json(
      { error: "The LIFE ENGINE lost connection. Try again." },
      { status: 500 }
    );
  }
}
