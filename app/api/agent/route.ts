import { NextRequest, NextResponse } from "next/server";
import { hasGeminiKey, runGeminiTurn } from "@/lib/agent/gemini";
import { buildHeuristicTurn } from "@/lib/agent/heuristicTurn";
import type { AgentTurn } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = typeof body?.input === "string" ? body.input.trim() : "";
    const realAnswer = Boolean(body?.noSugarcoating);

    if (!input) {
      return NextResponse.json({ error: "Tell LIFE.EXE what's going on first." }, { status: 400 });
    }
    if (input.length > 4000) {
      return NextResponse.json({ error: "That's a lot — try trimming it to the essentials (under 4000 characters)." }, { status: 400 });
    }

    let turn: AgentTurn;
    if (hasGeminiKey()) {
      try {
        turn = await runGeminiTurn(input, { realAnswer });
      } catch (err) {
        console.error("Gemini call failed, falling back to the heuristic engine:", err);
        turn = await buildHeuristicTurn(input);
      }
    } else {
      turn = await buildHeuristicTurn(input);
    }

    return NextResponse.json({ turn });
  } catch {
    return NextResponse.json(
      { error: "LIFE.EXE hit a temporary snag. Try again." },
      { status: 500 }
    );
  }
}
