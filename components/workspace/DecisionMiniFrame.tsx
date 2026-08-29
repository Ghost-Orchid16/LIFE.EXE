"use client";

import type { DecisionFrame } from "@/lib/types";

export default function DecisionMiniFrame({ frame, onOpenFull }: { frame: DecisionFrame; onOpenFull: () => void }) {
  return (
    <div>
      <p className="mb-3 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Your options, side by side</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {frame.options.map((opt) => (
          <div key={opt.id} className="rounded-xl border border-[var(--border)] p-4">
            <p className="mb-2 text-sm font-semibold">{opt.label}</p>
            <p className="text-xs text-[var(--fg-muted)]">
              <span className="text-[var(--accent-2)]">+</span> {opt.benefits[0]}
            </p>
            <p className="mt-1 text-xs text-[var(--fg-muted)]">
              <span className="text-[var(--accent)]">−</span> {opt.risks[0]}
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={onOpenFull}
        className="mt-3 text-sm font-medium text-[var(--accent)] hover:underline"
      >
        Open full Decision Simulator →
      </button>
    </div>
  );
}
