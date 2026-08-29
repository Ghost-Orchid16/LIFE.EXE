"use client";

import { Section, Reveal } from "@/components/ui/Section";

const STEPS = [
  { title: "Understand", body: "Describe what's going on, in your own words. No forms, no categories." },
  { title: "Explore", body: "LIFE.EXE identifies what matters, what's missing, and lays out real options." },
  { title: "Simulate", body: "See how different paths could play out — and practice the hard conversation before it happens." },
  { title: "Act", body: "Leave with a concrete next step, not just more to think about." },
];

export default function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      kicker="How it works"
      title="Understand → Explore → Simulate → Act"
      subtitle="Underneath, LIFE.EXE runs a staged reasoning process — visible as it happens, never as a black box."
    >
      <div className="relative grid gap-4 sm:grid-cols-4">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-[var(--border)] sm:block" aria-hidden="true" />
        {STEPS.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.1}>
            <div className="relative flex flex-col gap-4">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg)] font-mono text-sm text-[var(--accent)]">
                0{i + 1}
              </div>
              <h3 className="text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
