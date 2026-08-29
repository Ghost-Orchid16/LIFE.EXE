"use client";

import { useState } from "react";
import { analyzeConversation, type ConversationAnalysis } from "@/lib/agent/readBetweenTheLines";
import Button from "@/components/ui/Button";

const CERTAINTY_LABEL: Record<string, string> = {
  likely: "Likely observation",
  possible: "Possible interpretation",
  uncertain: "Genuinely uncertain",
};

export default function ReadBetweenLinesPanel() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ConversationAnalysis | null>(null);

  function run() {
    if (!text.trim()) return;
    setResult(analyzeConversation(text));
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-[var(--fg-muted)]">
        Paste a conversation (prefix lines with &ldquo;Me:&rdquo; / &ldquo;Them:&rdquo; if you can, for the clearest read).
        LIFE.EXE will break down patterns — not guess what they&apos;re thinking.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder={"Me: hey, are we still on for saturday?\nThem: maybe, not sure yet\nMe: ok let me know!"}
        className="panel resize-none p-4 font-mono text-sm focus:outline-none"
      />
      <Button onClick={run} disabled={!text.trim()}>
        Analyze conversation
      </Button>

      {result && (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-[rgba(var(--surface-rgb),0.06)] p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Observations</p>
              <ul className="space-y-1.5 text-sm">
                {result.observations.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-[rgba(var(--surface-rgb),0.06)] p-4">
              <p className="mb-2 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Reciprocity &amp; tone</p>
              <p className="text-sm">{result.reciprocity.note}</p>
              <p className="mt-2 text-sm">
                Clarity: <span className="font-medium capitalize">{result.clarity}</span>
              </p>
              <p className="text-sm">Tone: {result.tone}</p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Possible interpretations</p>
            <div className="space-y-2">
              {result.interpretations.map((i) => (
                <div key={i.text} className="rounded-xl border border-[var(--border)] p-3">
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
                    {CERTAINTY_LABEL[i.certainty]}
                  </span>
                  <p className="text-sm">{i.text}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs italic text-[var(--fg-muted)]">{result.uncertaintyNote}</p>
        </div>
      )}
    </div>
  );
}
