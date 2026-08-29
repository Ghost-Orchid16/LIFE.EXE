"use client";

import { useState } from "react";
import { Send } from "lucide-react";

const QUICK_REPLIES = [
  "That's not really my situation.",
  "I've already tried that.",
  "What if I choose the other option?",
  "Help me say this.",
  "Let's practice this.",
  "Research this for me.",
];

export default function FollowUpBar({ onSend, disabled }: { onSend: (text: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState("");

  function submit(text?: string) {
    const t = (text ?? value).trim();
    if (!t) return;
    onSend(t);
    setValue("");
  }

  return (
    <div className="panel flex flex-col gap-3 p-4">
      <div className="flex flex-wrap gap-2">
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
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          disabled={disabled}
          placeholder="Continue the conversation…"
          className="flex-1 rounded-full border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-[rgba(var(--accent-rgb),0.6)] disabled:opacity-50"
          aria-label="Follow-up message"
        />
        <button
          onClick={() => submit()}
          disabled={disabled || !value.trim()}
          aria-label="Send follow-up"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] disabled:opacity-30"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
