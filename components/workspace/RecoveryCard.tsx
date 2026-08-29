"use client";

import type { RecoveryPlan } from "@/lib/types";

export default function RecoveryCard({ plan }: { plan: RecoveryPlan }) {
  const groups: { label: string; items: string[] }[] = [
    { label: "What matters most now", items: plan.whatMattersNow },
    { label: "What can still be fixed", items: plan.whatCanStillBeFixed },
    { label: "Do this immediately", items: plan.immediateActions },
    { label: "What to say", items: plan.whatToSay },
    { label: "What NOT to do", items: plan.whatNotToDo },
    { label: "Next steps", items: plan.nextSteps },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border)] p-5 sm:p-6">
      <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">Damage Control</p>
      <p className="mb-5 text-sm text-[var(--fg-muted)]">{plan.whatHappened}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((g) => (
          <div key={g.label} className="rounded-xl bg-[rgba(var(--surface-rgb),0.06)] p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--fg-muted)]">{g.label}</p>
            <ul className="space-y-1.5 text-sm">
              {g.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-[var(--accent)]">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
