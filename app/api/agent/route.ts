import { NextRequest, NextResponse } from "next/server";
import { hasGeminiKey, runGeminiTurn } from "@/lib/agent/gemini";
import { buildHeuristicTurn } from "@/lib/agent/heuristicTurn";
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

    let turn: AgentTurn;
    if (hasGeminiKey()) {
      try {
        turn = await runGeminiTurn(input);
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
      { error: "The LIFE ENGINE lost connection. Try again." },
      { status: 500 }
    );
  }
}
