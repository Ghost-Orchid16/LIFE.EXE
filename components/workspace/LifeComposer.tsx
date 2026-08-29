"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Lightbulb } from "lucide-react";

const QUICK_REPLIES = [
  "That's not really my situation.",
  "I've already tried that.",
  "What if I choose the other option?",
  "Help me say this.",
  "Let's practice this.",
  "Research this for me.",
];

const MAX_HEIGHT = 160;

// The persistent LIFE.EXE composer. Lives docked to the bottom of the
// viewport once a conversation exists, so the user is never forced to
// scroll back up just to keep talking to it. See app/workspace/page.tsx for
// the matching bottom padding that keeps it from covering the last card.
export default function LifeComposer({ onSend, disabled }: { onSend: (text: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  function submit(text?: string) {
    const t = (text ?? value).trim();
    if (!t) return;
    onSend(t);
    setValue("");
    setShowQuickReplies(false);
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-6"
      style={{ pointerEvents: "none" }}
    >
      <div className="pointer-events-auto w-full max-w-2xl">
        {showQuickReplies && (
          <div className="mb-2 flex flex-wrap gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/95 p-3 shadow-lg backdrop-blur-xl">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                disabled={disabled}
                onClick={() => submit(q)}
                className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--fg-muted)] transition hover:border-[rgba(var(--accent-rgb),0.6)] hover:text-[var(--fg)] disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2 rounded-3xl border border-[var(--border)] bg-[var(--bg)]/95 p-2 shadow-2xl backdrop-blur-xl glow-ring">
          <button
            type="button"
            onClick={() => setShowQuickReplies((v) => !v)}
            aria-label="Quick replies"
            aria-expanded={showQuickReplies}
            disabled={disabled}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition disabled:opacity-40 ${
              showQuickReplies ? "bg-[rgba(var(--accent-rgb),0.16)] text-[var(--accent)]" : "text-[var(--fg-muted)] hover:bg-[rgba(var(--surface-rgb),0.1)] hover:text-[var(--fg)]"
            }`}
          >
            <Lightbulb size={17} />
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            disabled={disabled}
            placeholder="Tell LIFE.EXE what's next…"
            className="max-h-40 flex-1 resize-none bg-transparent py-2.5 text-sm leading-snug text-[var(--fg)] placeholder:text-[var(--fg-muted)] focus:outline-none disabled:opacity-50"
            aria-label="Continue the conversation"
          />
          <button
            onClick={() => submit()}
            disabled={disabled || !value.trim()}
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition enabled:hover:scale-105 disabled:opacity-30"
          >
            <ArrowUp size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
