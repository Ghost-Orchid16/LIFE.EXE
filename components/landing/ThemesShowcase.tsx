"use client";

import { Section } from "@/components/ui/Section";
import { THEMES } from "@/lib/themes";
import { useLifeStore } from "@/lib/store/useLifeStore";

export default function ThemesShowcase() {
  const theme = useLifeStore((s) => s.theme);
  const setTheme = useLifeStore((s) => s.setTheme);

  return (
    <Section
      id="themes"
      kicker="Themes"
      title="One product, six visual worlds."
      subtitle="Pick the atmosphere that fits how you think. It changes more than color — motion, texture, and type all shift with it."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            data-cursor="APPLY →"
            className={`panel flex flex-col items-start gap-3 p-6 text-left transition-transform hover:-translate-y-1 ${
              theme === t.id ? "ring-2 ring-[var(--accent)]" : ""
            }`}
          >
            <span className="text-2xl">{t.icon}</span>
            <span className="text-lg font-semibold">{t.name}</span>
            <span className="text-sm text-[var(--fg-muted)]">{t.description}</span>
            {theme === t.id && <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">Active</span>}
          </button>
        ))}
      </div>
    </Section>
  );
}
