"use client";

import { Sparkles } from "lucide-react";
import type { Strategy } from "@/lib/types";

// The "we actually think you should do this" surface — LIFE.EXE picks one of
// the three strategies as its real recommendation instead of only ever
// laying out equal options, per the "Give me the real answer" philosophy.
export default function RecommendedMoveCard({
  strategy,
  onPractice,
}: {
  strategy: Strategy;
  onPractice?: (strategy: Strategy) => void;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(var(--accent-rgb),0.45)] bg-[rgba(var(--accent-rgb),0.07)] p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={15} className="text-[var(--accent)]" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">Recommended move</span>
      </div>
      <h3 className="mb-2 text-lg font-semibold">{strategy.title}</h3>
      <p className="mb-4 text-sm text-[var(--fg-muted)]">{strategy.approach}</p>
      <div className="rounded-xl bg-[rgba(var(--surface-rgb),0.1)] p-4 text-sm">
        <span className="font-medium text-[var(--fg)]">What to say or do: </span>
        <span className="text-[var(--fg-muted)]">{strategy.exampleAction}</span>
      </div>
      {onPractice && (
        <button
          onClick={() => onPractice(strategy)}
          className="mt-4 text-sm font-medium text-[var(--accent)] hover:underline"
        >
          Practice this conversation →
        </button>
      )}
    </div>
  );
}
