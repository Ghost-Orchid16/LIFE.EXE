"use client";

import { useState } from "react";
import { analyzeScam } from "@/lib/agent/engine";
import type { ScamAnalysis } from "@/lib/types";
import ScamSenseCard from "@/components/workspace/ScamSenseCard";
import Button from "@/components/ui/Button";

export default function ScamSensePanel({ initialText }: { initialText?: string }) {
  const [text, setText] = useState(initialText ?? "");
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);

  function run() {
    if (!text.trim()) return;
    setAnalysis(analyzeScam(text));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--fg-muted)]">
        Paste a suspicious message, email, offer, or payment request. LIFE.EXE checks it for common manipulation patterns.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Paste the message here…"
        className="panel resize-none p-4 text-sm focus:outline-none"
      />
      <Button onClick={run} disabled={!text.trim()}>
        Analyze
      </Button>
      {analysis && <ScamSenseCard analysis={analysis} />}
    </div>
  );
}
