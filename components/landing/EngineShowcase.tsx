"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { ENGINE_STAGES } from "@/lib/agent/stages";

export default function EngineShowcase() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % ENGINE_STAGES.length), 1600);
    return () => clearInterval(id);
  }, []);

  return (
    <Section
      kicker="The Life Engine"
      title="Not a black box. A visible process."
      subtitle="LIFE.EXE never shows its raw internal reasoning — but it does show you the stages it's moving through, so the process feels legible instead of magical."
    >
      <div className="panel overflow-hidden p-6 sm:p-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {ENGINE_STAGES.map((stage, i) => {
            const isActive = i === active;
            const isDone = i < active;
            return (
              <div key={stage.id} className="flex flex-col items-center gap-3 text-center">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-full border font-mono text-xs transition-all duration-500 ${
                    isActive
                      ? "border-[var(--accent)] text-[var(--accent)] shadow-[0_0_24px_rgba(var(--accent-rgb),0.5)] scale-110"
                      : isDone
                      ? "border-[var(--border)] text-[var(--fg-muted)] opacity-60"
                      : "border-[var(--border)] text-[var(--fg-muted)] opacity-30"
                  }`}
                >
                  0{stage.index}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-[var(--fg)]" : "text-[var(--fg-muted)]"}`}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10 text-center font-mono text-sm text-[var(--fg-muted)]"
        >
          {ENGINE_STAGES[active].message}
        </motion.div>
      </div>
    </Section>
  );
}
