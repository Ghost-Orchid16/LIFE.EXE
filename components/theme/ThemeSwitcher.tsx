"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useLifeStore } from "@/lib/store/useLifeStore";
import { THEMES, THEME_PREVIEW } from "@/lib/themes";

export default function ThemeSwitcher() {
  const theme = useLifeStore((s) => s.theme);
  const setTheme = useLifeStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];
  const activeIndex = Math.max(0, THEMES.findIndex((t) => t.id === theme));

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => optionRefs.current[activeIndex]?.focus());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onListKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      const current = optionRefs.current.findIndex((el) => el === document.activeElement);
      const from = current >= 0 ? current : activeIndex;
      const next = (from + dir + THEMES.length) % THEMES.length;
      optionRefs.current[next]?.focus();
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Theme: ${current.name}. Change theme`}
        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[rgba(var(--surface-rgb),0.08)] px-3 py-1.5 text-sm text-[var(--fg)] transition hover:border-[rgba(var(--accent-rgb),0.5)]"
      >
        <span aria-hidden="true">{current.icon}</span>
        <span className="hidden sm:inline">{current.name}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label="Choose a theme"
            onKeyDown={onListKeyDown}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-[var(--border)] p-1.5 shadow-2xl"
            style={{ backgroundColor: "var(--bg-elevated)" }}
          >
            {THEMES.map((t, i) => {
              const preview = THEME_PREVIEW[t.id];
              const selected = t.id === theme;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    optionRefs.current[i] = el;
                  }}
                  role="option"
                  aria-selected={selected}
                  tabIndex={activeIndex === i ? 0 : -1}
                  onClick={() => {
                    setTheme(t.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                    selected ? "bg-white/10" : "hover:bg-white/5"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="h-9 w-9 shrink-0 rounded-full border border-white/15"
                    style={{
                      background: `radial-gradient(circle at 35% 30%, ${preview.accent}, ${preview.accent2} 55%, ${preview.bg} 100%)`,
                    }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--fg)]">
                      <span aria-hidden="true">{t.icon}</span>
                      {t.name}
                    </span>
                    <span className="block truncate text-xs text-[var(--fg-muted)]">{t.description}</span>
                  </span>
                  {selected && <Check size={16} className="shrink-0 text-[var(--accent)]" aria-hidden="true" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
