"use client";

import type { OutcomeGoal } from "@/lib/types";

const OPTIONS: { id: OutcomeGoal; label: string }[] = [
  { id: "understand", label: "Understand the situation" },
  { id: "decide", label: "Make a decision" },
  { id: "fix", label: "Fix the problem" },
  { id: "converse", label: "Have a conversation" },
  { id: "boundary", label: "Set a boundary" },
  { id: "reduce_uncertainty", label: "Reduce uncertainty" },
  { id: "prepare", label: "Prepare for something" },
  { id: "explore", label: "Explore my options" },
  { id: "vent", label: "Just vent first" },
];

export default function OutcomePicker({ onSelect }: { onSelect: (goal: OutcomeGoal) => void }) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-[var(--fg)]">What do you actually want out of this?</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className="rounded-full border border-[var(--border)] px-3.5 py-1.5 text-sm text-[var(--fg-muted)] transition hover:border-[rgba(var(--accent-rgb),0.6)] hover:text-[var(--fg)]"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
