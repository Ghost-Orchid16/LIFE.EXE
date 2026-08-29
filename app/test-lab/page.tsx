"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, RotateCw, CheckCircle2, XCircle } from "lucide-react";
import { runTestLab, type TestRunResult } from "@/lib/agent/testcases";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import Button from "@/components/ui/Button";

export default function TestLabPage() {
  const [run, setRun] = useState(() => runTestLab());
  const [expanded, setExpanded] = useState<string | null>(null);

  function rerun() {
    setRun(runTestLab());
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-6 pb-24 pt-6">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <ThemeSwitcher />
      </div>

      <h1 className="mb-2 font-[family-name:var(--font-display)] text-3xl font-semibold">Agent Test Lab</h1>
      <p className="mb-8 max-w-xl text-sm text-[var(--fg-muted)]">
        A transparent evaluation of the routing/classification engine against 10 scripted scenarios. This is a prototype
        self-check, not a certified accuracy benchmark.
      </p>

      <div className="panel mb-8 flex flex-col items-center gap-3 p-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-[family-name:var(--font-display)] text-4xl font-bold">
            {run.passCount} / {run.results.length} TESTS PASSED
          </p>
          <p className="mt-1 text-sm text-[var(--fg-muted)]">{run.successRate}% agent success rate</p>
        </div>
        <Button variant="secondary" onClick={rerun}>
          <RotateCw size={14} /> Rerun tests
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {run.results.map((r: TestRunResult, i: number) => {
          const open = expanded === r.id;
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="panel overflow-hidden"
            >
              <button
                onClick={() => setExpanded(open ? null : r.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  {r.passed ? (
                    <CheckCircle2 size={18} className="shrink-0 text-[#7dd88f]" />
                  ) : (
                    <XCircle size={18} className="shrink-0 text-[#ff5c5c]" />
                  )}
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--fg-muted)]">
                      {r.id.replace("test-", "TEST ")}
                    </p>
                    <p className="text-sm font-medium">{r.title}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase ${
                    r.passed ? "bg-[rgba(125,216,143,0.15)] text-[#7dd88f]" : "bg-[rgba(255,92,92,0.15)] text-[#ff5c5c]"
                  }`}
                >
                  {r.passed ? "Pass" : "Fail"}
                </span>
              </button>
              {open && (
                <div className="space-y-3 border-t border-[var(--border)] px-5 py-4 text-sm">
                  <p>
                    <span className="text-[var(--fg-muted)]">Input: </span>
                    <span className="font-mono">&ldquo;{r.input}&rdquo;</span>
                  </p>
                  <p>
                    <span className="text-[var(--fg-muted)]">Expected behavior: </span>
                    {r.expected}
                  </p>
                  <p>
                    <span className="text-[var(--fg-muted)]">Actual behavior: </span>
                    <span className="font-mono text-xs">{r.actual}</span>
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
