"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { ROLEPLAY_ROLES, roleplayOpening, roleplayReply, scoreConversation, feedbackFor } from "@/lib/agent/roleplay";
import type { RoleplayMessage, RoleplayScores } from "@/lib/types";
import Button from "@/components/ui/Button";
import { useLifeStore } from "@/lib/store/useLifeStore";

function uid() {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function RoleplayPanel({ context, onDone }: { context?: string; onDone?: () => void }) {
  const [roleId, setRoleId] = useState<string | null>(null);
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [scores, setScores] = useState<RoleplayScores | null>(null);
  const bumpCounter = useLifeStore((s) => s.bumpCounter);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function pickRole(id: string) {
    setRoleId(id);
    // eslint-disable-next-line react-hooks/purity -- only ever invoked from a click handler, never during render
    setMessages([{ id: uid(), sender: "ai", text: roleplayOpening(id), timestamp: Date.now() }]);
    bumpCounter("conversationsPracticed");
  }

  function send() {
    if (!draft.trim() || !roleId) return;
    const userMsg: RoleplayMessage = { id: uid(), sender: "user", text: draft.trim(), timestamp: Date.now() };
    const turnIndex = messages.filter((m) => m.sender === "user").length;
    const reply = roleplayReply(roleId, draft.trim(), turnIndex);
    setMessages((m) => [...m, userMsg, { id: uid(), sender: "ai", text: reply, timestamp: Date.now() + 1 }]);
    setDraft("");
  }

  function finish() {
    const userMessages = messages.filter((m) => m.sender === "user").map((m) => m.text);
    setScores(scoreConversation(userMessages));
    setReviewing(true);
  }

  if (reviewing && scores) {
    const notes = feedbackFor(scores);
    const rows: { label: string; value: number }[] = [
      { label: "Clarity", value: scores.clarity },
      { label: "Assertiveness", value: scores.assertiveness },
      { label: "Empathy", value: scores.empathy },
      { label: "Escalation control", value: scores.escalation },
      { label: "Goal alignment", value: scores.goalAlignment },
    ];
    return (
      <div className="flex flex-col gap-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent)]">Conversation review</p>
        <div className="space-y-3">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span>{r.label}</span>
                <span className="text-[var(--fg-muted)]">{r.value}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[rgba(var(--surface-rgb),0.12)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.value}%` }}
                  transition={{ duration: 0.6 }}
                  className="h-full rounded-full bg-[var(--accent)]"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-[rgba(var(--surface-rgb),0.07)] p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-[var(--fg-muted)]">Suggestions</p>
          <ul className="space-y-1.5 text-sm">
            {notes.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="text-[var(--accent)]">→</span> {n}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs italic text-[var(--fg-muted)]">
          AI-generated practice feedback, not a scientifically validated assessment.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              setReviewing(false);
              setScores(null);
              setMessages(roleId ? [{ id: uid(), sender: "ai", text: roleplayOpening(roleId), timestamp: Date.now() }] : []);
            }}
          >
            Practice again
          </Button>
          {onDone && (
            <Button variant="ghost" onClick={onDone}>
              Done
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!roleId) {
    return (
      <div className="flex flex-col gap-4">
        {context && (
          <p className="rounded-xl bg-[rgba(var(--surface-rgb),0.07)] p-3 text-sm text-[var(--fg-muted)]">
            Practicing around: <span className="text-[var(--fg)]">{context}</span>
          </p>
        )}
        <p className="text-sm text-[var(--fg-muted)]">Who do you want to practice this with?</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ROLEPLAY_ROLES.map((r) => (
            <button
              key={r.id}
              onClick={() => pickRole(r.id)}
              className="rounded-xl border border-[var(--border)] p-3 text-left text-sm transition hover:border-[rgba(var(--accent-rgb),0.6)]"
            >
              <span className="block font-medium">{r.label}</span>
              <span className="block text-xs text-[var(--fg-muted)]">{r.description}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[60vh] flex-col">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                m.sender === "user" ? "bg-[var(--fg)] text-[var(--bg)]" : "bg-[rgba(var(--surface-rgb),0.09)]"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-[var(--border)] pt-4">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Say your part of the conversation…"
          className="flex-1 rounded-full border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:border-[rgba(var(--accent-rgb),0.6)]"
        />
        <button
          onClick={send}
          disabled={!draft.trim()}
          aria-label="Send"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] disabled:opacity-30"
        >
          <Send size={16} />
        </button>
      </div>
      <button
        onClick={finish}
        disabled={messages.filter((m) => m.sender === "user").length < 2}
        className="mt-3 self-center text-xs text-[var(--fg-muted)] underline decoration-dotted underline-offset-4 disabled:opacity-40"
      >
        End practice & review
      </button>
    </div>
  );
}
