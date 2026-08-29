"use client";

import { useRouter } from "next/navigation";
import { Section, Reveal } from "@/components/ui/Section";
import { PENDING_KEY } from "@/components/workspace/SituationInput";

const EXAMPLES = [
  { stage: "Teenager", text: "Should I tell my crush I like them?" },
  { stage: "College", text: "Should I switch my major?" },
  { stage: "Professional", text: "Should I accept this job offer?" },
  { stage: "Adult", text: "Should I move cities?" },
  { stage: "Everyday", text: "How do I handle this conversation?" },
  { stage: "Parent", text: "How do I set a boundary with my in-laws?" },
];

export default function Examples() {
  const router = useRouter();

  function tryExample(text: string) {
    try {
      sessionStorage.setItem(PENDING_KEY, text);
    } catch {}
    router.push("/workspace");
  }

  return (
    <Section
      kicker="Examples"
      title="Every life stage runs into this."
      subtitle="LIFE.EXE isn't built for one kind of person or one kind of problem — it adapts to whatever you bring it."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((ex, i) => (
          <Reveal key={ex.text} delay={i * 0.05}>
            <button
              onClick={() => tryExample(ex.text)}
              data-cursor="TRY →"
              className="panel group flex h-full w-full flex-col justify-between gap-6 p-6 text-left transition-transform hover:-translate-y-1"
            >
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--fg-muted)]">{ex.stage}</span>
              <span className="text-lg font-medium leading-snug">&ldquo;{ex.text}&rdquo;</span>
              <span className="text-sm text-[var(--accent)] opacity-0 transition-opacity group-hover:opacity-100">
                Explore this →
              </span>
            </button>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
