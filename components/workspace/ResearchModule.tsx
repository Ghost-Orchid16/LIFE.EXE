"use client";

import { Globe } from "lucide-react";
import type { ResearchResult } from "@/lib/types";

export default function ResearchModule({ research }: { research: ResearchResult }) {
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5">
      <div className="mb-3 flex items-center gap-2">
        <Globe size={16} className="text-[var(--accent)]" />
        <span className="text-sm font-semibold">Web research</span>
        <span
          className={`ml-auto rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
            research.mode === "demo" ? "bg-[rgba(var(--accent-2-rgb),0.18)] text-[var(--accent-2)]" : "bg-[rgba(var(--accent-rgb),0.18)] text-[var(--accent)]"
          }`}
        >
          {research.mode === "demo" ? "Demo mode" : "Live"}
        </span>
      </div>
      {research.answer && <p className="mb-3 text-sm text-[var(--fg-muted)]">{research.answer}</p>}
      {research.sources.length > 0 && (
        <ul className="space-y-2">
          {research.sources.map((s) => (
            <li key={s.url} className="rounded-xl bg-[rgba(var(--surface-rgb),0.06)] p-3 text-sm">
              <p className="font-medium text-[var(--fg)]">{s.title}</p>
              <p className="text-xs text-[var(--fg-muted)]">{s.domain}</p>
              <p className="mt-1 text-[var(--fg-muted)]">{s.snippet}</p>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs italic text-[var(--fg-muted)]">{research.disclaimer}</p>
    </div>
  );
}
