"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { Strategy } from "@/lib/types";

export default function StrategyCards({
  strategies,
  onPractice,
}: {
  strategies: Strategy[];
  onPractice?: (strategy: Strategy) => void;
}) {
  const [openId, setOpenId] = useState<string | null>(strategies[0]?.id ?? null);

  return (
    <div className="flex flex-col gap-3">
      {strategies.map((s) => {
        const open = openId === s.id;
        return (
          <div key={s.id} className="overflow-hidden rounded-2xl border border-[var(--border)]">
            <button
              onClick={() => setOpenId(open ? null : s.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={open}
            >
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">{s.tag}</span>
                <span className="block text-base font-semibold">{s.title}</span>
              </span>
              <ChevronDown size={18} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="space-y-4 px-5 pb-5 text-sm">
                    <p className="text-[var(--fg-muted)]">{s.approach}</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="mb-1.5 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Advantages</p>
                        <ul className="space-y-1">
                          {s.advantages.map((a) => (
                            <li key={a} className="flex gap-2">
                              <span className="text-[var(--accent-2)]">+</span> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1.5 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Risks</p>
                        <ul className="space-y-1">
                          {s.risks.map((r) => (
                            <li key={r} className="flex gap-2">
                              <span className="text-[var(--accent)]">−</span> {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="text-[var(--fg-muted)]">
                      <span className="font-medium text-[var(--fg)]">When it makes sense: </span>
                      {s.whenItMakesSense}
                    </p>
                    <p className="rounded-xl bg-[rgba(var(--surface-rgb),0.08)] p-3 text-[var(--fg)]">
                      <span className="font-medium">Try: </span>
                      {s.exampleAction}
                    </p>
                    {onPractice && (
                      <button
                        onClick={() => onPractice(s)}
                        className="text-sm font-medium text-[var(--accent)] hover:underline"
                      >
                        Practice this conversation →
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
