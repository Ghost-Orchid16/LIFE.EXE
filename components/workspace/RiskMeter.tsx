"use client";

import { motion } from "framer-motion";
import type { RiskLevel } from "@/lib/types";

const LEVELS: { id: RiskLevel; color: string }[] = [
  { id: "LOW", color: "#7dd88f" },
  { id: "MEDIUM", color: "#f4c452" },
  { id: "HIGH", color: "#f2934d" },
  { id: "CRITICAL", color: "#ff5c5c" },
];

export default function RiskMeter({ level, score }: { level: RiskLevel; score: number }) {
  const idx = LEVELS.findIndex((l) => l.id === level);
  const pct = Math.min(100, (score / 12) * 100);
  const color = LEVELS[idx]?.color ?? LEVELS[0].color;

  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--fg-muted)]">Risk level</span>
        <span className="text-2xl font-bold" style={{ color }}>
          {level}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-[rgba(var(--surface-rgb),0.12)]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, #7dd88f, ${color})` }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
        {LEVELS.map((l) => (
          <span key={l.id} className={l.id === level ? "text-[var(--fg)]" : ""}>
            {l.id}
          </span>
        ))}
      </div>
    </div>
  );
}
