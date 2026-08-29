"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const PLACEHOLDERS = [
  "I have two opportunities and no idea which one to choose.",
  "My best friend and I haven't talked since an argument.",
  "I think I made a terrible decision at work.",
  "Someone sent me a suspicious payment request.",
  "My parents want one career for me and I want another.",
  "I don't know how to have this conversation.",
  "I'm considering moving to another city.",
  "I think I'm overthinking a situation.",
  "I need to make a decision but every option has a downside.",
];

export const PENDING_KEY = "life-exe-pending-situation";

export default function SituationInput({
  autoFocus = false,
  compact = false,
  onSubmit,
}: {
  autoFocus?: boolean;
  compact?: boolean;
  onSubmit?: (text: string) => void;
}) {
  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputId = useId();
  const hintId = useId();

  useEffect(() => {
    if (focused || value) return;
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3200);
    return () => clearInterval(id);
  }, [focused, value]);

  function submit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (onSubmit) {
      setValue("");
      onSubmit(trimmed);
      return;
    }
    try {
      sessionStorage.setItem(PENDING_KEY, trimmed);
    } catch {}
    router.push("/workspace");
  }

  return (
    <div className="w-full">
      <div
        className={`panel relative flex flex-col gap-3 p-5 transition-shadow sm:p-6 ${
          focused ? "glow-ring" : ""
        }`}
      >
        <label htmlFor={inputId} className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--fg-muted)]">
          What&apos;s happening?
        </label>
        <div className="relative">
          <textarea
            id={inputId}
            ref={textareaRef}
            autoFocus={autoFocus}
            rows={compact ? 2 : 3}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            maxLength={4000}
            className="w-full resize-none bg-transparent font-[family-name:var(--font-display)] text-xl leading-snug text-[var(--fg)] placeholder:text-[var(--fg-muted)]/60 focus:outline-none sm:text-2xl"
            aria-describedby={hintId}
          />
          {!value && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden font-[family-name:var(--font-display)] text-xl leading-snug text-[var(--fg-muted)]/60 sm:text-2xl">
              <AnimatePresence mode="wait">
                <motion.span
                  key={placeholderIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="block"
                >
                  {PLACEHOLDERS[placeholderIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span id={hintId} className="text-xs text-[var(--fg-muted)]">
            No category to pick. No wrong way to start.
          </span>
          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            aria-label="Tell LIFE.EXE"
            data-cursor="EXPLORE →"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition-transform disabled:opacity-30 enabled:hover:scale-105"
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
