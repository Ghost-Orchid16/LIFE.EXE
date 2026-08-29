"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { DecisionFrame } from "@/lib/types";
import { classifySituation, buildDecisionFrame, whatIfScenario } from "@/lib/agent/engine";
import DecisionTree from "@/components/workspace/DecisionTree";
import Button from "@/components/ui/Button";
import { useLifeStore } from "@/lib/store/useLifeStore";

export default function DecisionSimulatorPanel({
  initialInput,
  initialFrame,
}: {
  initialInput?: string;
  initialFrame?: DecisionFrame;
}) {
  const [input, setInput] = useState(initialInput ?? "");
  const [frame, setFrame] = useState<DecisionFrame | null>(initialFrame ?? null);
  const [activeId, setActiveId] = useState<string | null>(initialFrame?.options[0]?.id ?? null);
  const bumpCounter = useLifeStore((s) => s.bumpCounter);

  const activeOption = useMemo(() => frame?.options.find((o) => o.id === activeId) ?? null, [frame, activeId]);

  useEffect(() => {
    if (initialFrame) bumpCounter("decisionsSimulated");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function run() {
    if (!input.trim()) return;
    const classification = classifySituation(input);
    const f = buildDecisionFrame(input, classification);
    setFrame(f);
    setActiveId(f.options[0].id);
    bumpCounter("decisionsSimulated");
  }

  if (!frame) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[var(--fg-muted)]">
          Describe the decision you&apos;re weighing — LIFE.EXE will lay out both sides so you can compare them.
        </p>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          placeholder="e.g. Should I take the startup offer or stay at my current job?"
          className="panel resize-none p-4 text-sm focus:outline-none"
        />
        <Button onClick={run} disabled={!input.trim()}>
          Build decision frame
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="mb-1 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Goals</p>
        <div className="flex flex-wrap gap-2">
          {frame.goals.map((g) => (
            <span key={g} className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--fg-muted)]">
              {g}
            </span>
          ))}
        </div>
      </div>

      <DecisionTree options={frame.options} activeId={activeId} onSelect={setActiveId} />

      {activeOption && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Benefits</p>
            <ul className="space-y-1 text-sm">
              {activeOption.benefits.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-[var(--accent-2)]">+</span> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border)] p-4">
            <p className="mb-2 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Risks</p>
            <ul className="space-y-1 text-sm">
              {activeOption.risks.map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-[var(--accent)]">−</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeOption && (
          <motion.div
            key={activeOption.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl bg-[rgba(var(--surface-rgb),0.07)] p-4 text-sm leading-relaxed text-[var(--fg-muted)]"
          >
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
              What if? — hypothetical, not a prediction
            </span>
            {whatIfScenario(activeOption)}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setFrame(null);
          setInput("");
        }}
        className="self-start text-xs text-[var(--fg-muted)] underline decoration-dotted underline-offset-4 hover:text-[var(--fg)]"
      >
        Start a different decision
      </button>
    </div>
  );
}
