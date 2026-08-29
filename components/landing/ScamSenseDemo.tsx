"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import RiskMeter from "@/components/workspace/RiskMeter";
import { analyzeScam } from "@/lib/agent/engine";

const DEMO_MESSAGE =
  "URGENT: Your account will be suspended today. Verify your identity now by sending the OTP you just received, or pay a $50 processing fee via gift card to keep it active.";

export default function ScamSenseDemo() {
  const [shown, setShown] = useState(false);
  const analysis = useMemo(() => analyzeScam(DEMO_MESSAGE), []);

  return (
    <Section
      id="scamsense"
      kicker="ScamSense"
      title="Suspicious message? Check it before you act."
      subtitle="Paste anything that feels off — a message, an email, a payment request — and see the risk signals broken down."
    >
      <div className="panel mx-auto max-w-2xl p-6 sm:p-8">
        <p className="mb-6 rounded-xl border border-[var(--border)] bg-[rgba(var(--surface-rgb),0.06)] p-4 font-mono text-sm text-[var(--fg-muted)]">
          &ldquo;{DEMO_MESSAGE}&rdquo;
        </p>
        {!shown ? (
          <Button variant="secondary" onClick={() => setShown(true)} className="w-full">
            Analyze this message
          </Button>
        ) : (
          <div>
            <RiskMeter level={analysis.riskLevel} score={analysis.score} />
            <ul className="mt-6 space-y-2">
              {analysis.signals
                .filter((s) => s.detected)
                .map((s) => (
                  <li key={s.id} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>
                      <strong className="font-medium">{s.label}.</strong>{" "}
                      <span className="text-[var(--fg-muted)]">{s.explanation}</span>
                    </span>
                  </li>
                ))}
            </ul>
            <Link href="/workspace?panel=scamsense" className="mt-6 block">
              <Button variant="primary" className="w-full" size="sm">
                Check your own message
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Section>
  );
}
