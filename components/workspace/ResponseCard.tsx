"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { AgentTurn, Strategy } from "@/lib/types";
import StrategyCards from "@/components/workspace/StrategyCards";
import ResearchModule from "@/components/workspace/ResearchModule";
import ScamSenseCard from "@/components/workspace/ScamSenseCard";
import RecoveryCard from "@/components/workspace/RecoveryCard";
import DecisionMiniFrame from "@/components/workspace/DecisionMiniFrame";

export default function ResponseCard({
  turn,
  noSugarcoating,
  onPracticeStrategy,
  onOpenDecisionSimulator,
}: {
  turn: AgentTurn;
  noSugarcoating: boolean;
  onPracticeStrategy: (strategy: Strategy) => void;
  onOpenDecisionSimulator: () => void;
}) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="panel flex flex-col gap-5 p-5 sm:p-7"
    >
      <div className="rounded-2xl bg-[rgba(var(--surface-rgb),0.09)] px-4 py-3 text-sm text-[var(--fg)]">
        “{turn.userInput}”
      </div>

      <p className="text-base leading-relaxed">{turn.classification.summary}</p>

      {noSugarcoating && (
        <p className="rounded-xl border border-[rgba(var(--accent-rgb),0.4)] bg-[rgba(var(--accent-rgb),0.08)] px-4 py-3 text-sm text-[var(--fg)]">
          <span className="font-semibold text-[var(--accent)]">Real answer mode: </span>
          Here&apos;s what&apos;s observable versus assumed, without extra cushioning — see &ldquo;What we know / don&apos;t know&rdquo; below.
        </p>
      )}

      <button
        onClick={() => setShowDetail((v) => !v)}
        className="self-start text-xs font-medium uppercase tracking-wide text-[var(--fg-muted)] underline decoration-dotted underline-offset-4 hover:text-[var(--fg)]"
      >
        {showDetail ? "Hide" : "Show"} what we know / don&apos;t know
      </button>
      {showDetail && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-[rgba(var(--surface-rgb),0.06)] p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-[var(--fg-muted)]">What we know</p>
            <ul className="space-y-1.5 text-sm">
              {turn.classification.whatWeKnow.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-[rgba(var(--surface-rgb),0.06)] p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-[var(--fg-muted)]">What we don&apos;t know</p>
            <ul className="space-y-1.5 text-sm">
              {turn.classification.whatWeDontKnow.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {turn.classification.needsClarification && turn.classification.clarifyingQuestions.length > 0 && (
        <div className="rounded-xl border border-[var(--border)] p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-[var(--fg-muted)]">A couple of things that would help</p>
          <ul className="space-y-1.5 text-sm">
            {turn.classification.clarifyingQuestions.map((q) => (
              <li key={q} className="flex gap-2">
                <span className="text-[var(--accent)]">?</span> {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {turn.scam && <ScamSenseCard analysis={turn.scam} />}
      {turn.recovery && <RecoveryCard plan={turn.recovery} />}

      {turn.strategies && (
        <div>
          <p className="mb-3 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Possible approaches</p>
          <StrategyCards strategies={turn.strategies} onPractice={onPracticeStrategy} />
        </div>
      )}

      {turn.decisionFrame && (
        <DecisionMiniFrame frame={turn.decisionFrame} onOpenFull={onOpenDecisionSimulator} />
      )}

      {turn.research && <ResearchModule research={turn.research} />}

      <div className="flex items-center gap-2 rounded-xl bg-[rgba(var(--accent-rgb),0.1)] px-4 py-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">Next step</span>
        <span className="text-sm text-[var(--fg)]">{turn.nextStep}</span>
      </div>
    </motion.div>
  );
}
