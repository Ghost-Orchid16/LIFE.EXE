"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLifeStore } from "@/lib/store/useLifeStore";
import { THEMES } from "@/lib/themes";

export default function ThemeSwitcher() {
  const theme = useLifeStore((s) => s.theme);
  const setTheme = useLifeStore((s) => s.setTheme);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

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
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="panel absolute right-0 z-50 mt-2 w-72 overflow-hidden p-1.5"
          >
            {THEMES.map((t) => (
              <button
                key={t.id}
                role="option"
                aria-selected={t.id === theme}
                onClick={() => {
                  setTheme(t.id);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  t.id === theme ? "bg-[rgba(var(--accent-rgb),0.14)]" : "hover:bg-[rgba(var(--surface-rgb),0.08)]"
                }`}
              >
                <span className="mt-0.5 text-lg" aria-hidden="true">{t.icon}</span>
                <span>
                  <span className="block text-sm font-medium text-[var(--fg)]">{t.name}</span>
                  <span className="block text-xs text-[var(--fg-muted)]">{t.description}</span>
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
