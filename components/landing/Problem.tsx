"use client";

import { Section, Reveal } from "@/components/ui/Section";

export default function Problem() {
  return (
    <Section
      kicker="The Problem"
      title={
        <>
          Life gives you <span className="text-gradient">situations</span>,<br /> not instructions.
        </>
      }
      subtitle="No one hands you a manual before the hard conversation, the job offer, the argument, or the moment you're not sure who to trust. Most tools want you to pick a category first. Real problems don't come pre-sorted."
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          {
            title: "Search engines answer questions",
            body: "They're built for facts, not for the tangle of a real situation with feelings, people, and consequences attached.",
          },
          {
            title: "Chatbots wait for you to lead",
            body: "They respond to prompts. They don't ask what you actually need, or notice when a situation has three problems tangled into one.",
          },
          {
            title: "Advice generators guess once",
            body: "One answer, no follow-through — no way to explore what happens next, practice it, or adjust after you push back.",
          },
        ].map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08}>
            <div className="panel h-full p-6">
              <div className="mb-4 font-mono text-xs text-[var(--fg-muted)]">0{i + 1}</div>
              <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--fg-muted)]">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
