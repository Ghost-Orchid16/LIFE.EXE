import { NextRequest, NextResponse } from "next/server";
import { runResearch } from "@/lib/research/service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = typeof body?.query === "string" ? body.query.trim() : "";
    if (!query) {
      return NextResponse.json({ error: "Missing query." }, { status: 400 });
    }
    if (query.length > 2000) {
      return NextResponse.json({ error: "Query too long." }, { status: 400 });
    }
    const result = await runResearch(query);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "The LIFE ENGINE lost connection to research. Try again." },
      { status: 500 }
    );
  }
}
