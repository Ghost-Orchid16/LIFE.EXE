"use client";

import { Section } from "@/components/ui/Section";
import SituationInput from "@/components/workspace/SituationInput";

export default function FinalCTA() {
  return (
    <Section className="text-center">
      <h2 className="mx-auto max-w-2xl text-balance font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
        Something&apos;s going on.
        <br />
        <span className="text-gradient">Tell LIFE.EXE.</span>
      </h2>
      <p className="mx-auto mt-5 max-w-md text-[var(--fg-muted)]">
        No perfect answers. Better decisions.
      </p>
      <div className="mx-auto mt-10 max-w-xl">
        <SituationInput />
      </div>
    </Section>
  );
}
