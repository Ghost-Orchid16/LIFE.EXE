"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { classifySituation, buildDecisionFrame, whatIfScenario } from "@/lib/agent/engine";
import Button from "@/components/ui/Button";

const DEMO_INPUT = "I'm torn between staying at my stable job and taking a risky startup offer.";

export default function DecisionSimDemo() {
  const [selected, setSelected] = useState<string | null>(null);
  const frame = useMemo(() => {
    const classification = classifySituation(DEMO_INPUT);
    return buildDecisionFrame(DEMO_INPUT, classification);
  }, []);

  return (
    <Section
      id="decision-simulator"
      kicker="Decision Simulator"
      title="See both paths before you choose one."
      subtitle={`Example: "${DEMO_INPUT}"`}
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {frame.options.map((opt) => (
          <div key={opt.id} className="panel p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">{opt.label}</h3>
              <span className="font-mono text-xs text-[var(--fg-muted)]">OPTION {opt.id.toUpperCase()}</span>
            </div>
            <div className="mb-4">
              <p className="mb-1 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Benefits</p>
              <ul className="space-y-1 text-sm text-[var(--fg)]">
                {opt.benefits.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-[var(--accent-2)]">+</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-6">
              <p className="mb-1 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Risks</p>
              <ul className="space-y-1 text-sm text-[var(--fg)]">
                {opt.risks.map((r) => (
                  <li key={r} className="flex gap-2">
                    <span className="text-[var(--accent)]">−</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelected(selected === opt.id ? null : opt.id)}
              data-cursor="EXPLORE →"
            >
              What if I choose this?
            </Button>
            <AnimatePresence>
              {selected === opt.id && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 rounded-xl border border-[var(--border)] bg-[rgba(var(--surface-rgb),0.06)] p-4 text-sm leading-relaxed text-[var(--fg-muted)]"
                >
                  <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">
                    Hypothetical scenario — not a prediction
                  </span>
                  {whatIfScenario(opt)}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link href="/workspace">
          <Button variant="primary">Try it with your own decision</Button>
        </Link>
      </div>
    </Section>
  );
}
