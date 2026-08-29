"use client";

import { motion } from "framer-motion";
import type { DecisionOption } from "@/lib/types";

export default function DecisionTree({
  options,
  activeId,
  onSelect,
}: {
  options: DecisionOption[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-col items-center py-4">
      <div className="rounded-full border border-[var(--border)] bg-[rgba(var(--surface-rgb),0.08)] px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--fg-muted)]">
        You are here
      </div>
      <div className="h-8 w-px bg-[var(--border)]" aria-hidden="true" />
      <div className="grid w-full gap-6 sm:grid-cols-2">
        {options.map((opt) => {
          const active = activeId === opt.id;
          return (
            <div key={opt.id} className="flex flex-col items-center">
              <div className="h-6 w-px bg-[var(--border)]" aria-hidden="true" />
              <button
                onClick={() => onSelect(opt.id)}
                className={`w-full rounded-2xl border px-4 py-3 text-center transition-all ${
                  active
                    ? "border-[var(--accent)] bg-[rgba(var(--accent-rgb),0.12)] shadow-[0_0_30px_rgba(var(--accent-rgb),0.25)]"
                    : "border-[var(--border)] hover:border-[rgba(var(--accent-rgb),0.5)]"
                }`}
              >
                <span className="block text-sm font-semibold">{opt.label}</span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: active ? 24 : 12, opacity: active ? 1 : 0.4 }}
                className="w-px bg-[var(--border)]"
                aria-hidden="true"
              />
              <motion.div
                initial={false}
                animate={{ opacity: active ? 1 : 0.5, scale: active ? 1 : 0.97 }}
                className="w-full rounded-xl border border-dashed border-[var(--border)] px-3 py-2.5 text-center text-xs text-[var(--fg-muted)]"
              >
                trade-offs: {opt.tradeoffs[0]}
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
