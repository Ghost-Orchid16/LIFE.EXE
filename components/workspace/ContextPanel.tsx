"use client";

import type { AgentTurn } from "@/lib/types";

const MODE_LABEL: Record<string, string> = {
  scam: "Safety / ScamSense",
  recovery: "Damage Control",
  decision: "Decision",
  communication: "Communication",
  conflict: "Conflict",
  career: "Career",
  family: "Family",
  dating: "Dating",
  relationships: "Relationships",
  friendship: "Friendship",
};

export default function ContextPanel({ turn }: { turn: AgentTurn | null }) {
  if (!turn) {
    return (
      <div className="panel p-6 text-sm text-[var(--fg-muted)]">
        Once you describe a situation, LIFE.EXE will keep an overview here — what matters, what mode it&apos;s in, and your next step.
      </div>
    );
  }

  const mode = turn.classification.isScamLike
    ? MODE_LABEL.scam
    : turn.classification.isRecoveryMode
    ? MODE_LABEL.recovery
    : MODE_LABEL[turn.classification.primaryCategory] ?? "General";

  return (
    <div className="flex flex-col gap-4">
      <Block label="Your situation">
        <p className="text-sm leading-relaxed text-[var(--fg)]">{turn.classification.summary}</p>
      </Block>
      <Block label="What matters">
        <ul className="space-y-1.5 text-sm text-[var(--fg-muted)]">
          {turn.classification.whatWeKnow.map((k) => (
            <li key={k} className="flex gap-2">
              <span className="text-[var(--accent)]">•</span>
              {k}
            </li>
          ))}
        </ul>
      </Block>
      <Block label="Current mode">
        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--fg)]">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: turn.classification.isScamLike ? "#ff5c5c" : "var(--accent)" }}
          />
          {mode}
        </span>
        {turn.classification.emotional.stakes === "high" && (
          <p className="mt-2 text-xs text-[var(--fg-muted)]">
            This reads as higher-stakes — LIFE.EXE will avoid overconfidence here.
          </p>
        )}
      </Block>
      <Block label="Next step">
        <p className="text-sm font-medium text-[var(--fg)]">{turn.nextStep}</p>
      </Block>
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="panel p-5">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-muted)]">{label}</p>
      {children}
    </div>
  );
}
