"use client";

import { ShieldAlert } from "lucide-react";
import RiskMeter from "@/components/workspace/RiskMeter";
import type { ScamAnalysis } from "@/lib/types";

export default function ScamSenseCard({ analysis }: { analysis: ScamAnalysis }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <ShieldAlert size={18} className="text-[var(--accent)]" />
        <span className="text-sm font-semibold uppercase tracking-wide">ScamSense</span>
      </div>
      <RiskMeter level={analysis.riskLevel} score={analysis.score} />
      <p className="mt-4 text-sm text-[var(--fg-muted)]">{analysis.explanation}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {analysis.signals
          .filter((s) => s.detected)
          .map((s) => (
            <div key={s.id} className="rounded-xl bg-[rgba(var(--surface-rgb),0.07)] p-3 text-sm">
              <p className="font-medium">{s.label}</p>
              <p className="text-xs text-[var(--fg-muted)]">{s.explanation}</p>
            </div>
          ))}
        {analysis.signals.every((s) => !s.detected) && (
          <p className="text-sm text-[var(--fg-muted)]">No specific known signals matched.</p>
        )}
      </div>
      <div className="mt-5 rounded-xl border border-[var(--border)] p-4">
        <p className="mb-2 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Safe next steps</p>
        <ul className="space-y-1.5 text-sm">
          {analysis.nextSteps.map((step) => (
            <li key={step} className="flex gap-2">
              <span className="text-[var(--accent)]">→</span> {step}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-xs italic text-[var(--fg-muted)]">
        This is an automated pattern check, not a guarantee. When in doubt, verify independently or contact your bank/provider directly.
      </p>
    </div>
  );
}
