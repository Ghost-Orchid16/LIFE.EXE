"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ENGINE_STAGES } from "@/lib/agent/stages";

export default function LifeEngineProgress({ activeIndex }: { activeIndex: number }) {
  const stage = ENGINE_STAGES[Math.min(activeIndex, ENGINE_STAGES.length - 1)];

  return (
    <div className="panel flex flex-col gap-4 p-5" role="status" aria-live="polite">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {ENGINE_STAGES.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1.5">
            <div
              className={`h-1.5 w-6 rounded-full transition-colors duration-500 sm:w-8 ${
                i < activeIndex
                  ? "bg-[var(--accent)]"
                  : i === activeIndex
                  ? "bg-[var(--accent)] animate-pulse"
                  : "bg-[rgba(var(--surface-rgb),0.16)]"
              }`}
            />
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <span className="font-mono text-xs text-[var(--accent)]">0{stage.index}</span>
          <span className="text-sm text-[var(--fg-muted)]">{stage.message}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
