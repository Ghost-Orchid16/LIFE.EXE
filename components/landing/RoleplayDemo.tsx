"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { roleplayReply } from "@/lib/agent/roleplay";

const SCRIPT = [
  { sender: "ai" as const, text: "Sure, what did you want to discuss?" },
  { sender: "user" as const, text: "I don't think I can keep taking on your tasks when I'm behind on my own." },
];

export default function RoleplayDemo() {
  const [revealed, setRevealed] = useState(1);

  const reply = roleplayReply("teammate", SCRIPT[1].text, 0);

  return (
    <Section
      id="roleplay"
      kicker="Practice It"
      title="Rehearse the hard conversation first."
      subtitle="LIFE.EXE can play the other side of a conversation — a friend, a manager, a parent — so you can practice before it matters."
    >
      <div className="panel mx-auto max-w-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-[var(--fg-muted)]">
            Roleplay · Teammate
          </span>
          <span className="rounded-full bg-[rgba(var(--accent-rgb),0.14)] px-2.5 py-1 text-[10px] font-medium text-[var(--accent)]">
            SIMULATION
          </span>
        </div>
        <div className="flex flex-col gap-3">
          {SCRIPT.slice(0, revealed).map((m, i) => (
            <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.sender === "user" ? "bg-[var(--fg)] text-[var(--bg)]" : "bg-[rgba(var(--surface-rgb),0.09)] text-[var(--fg)]"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {revealed > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] rounded-2xl bg-[rgba(var(--surface-rgb),0.09)] px-4 py-2.5 text-sm">
                {reply}
              </div>
            </motion.div>
          )}
        </div>
        {revealed <= 1 ? (
          <Button className="mt-5 w-full" variant="secondary" size="sm" onClick={() => setRevealed(2)}>
            See how they respond
          </Button>
        ) : (
          <Link href="/workspace" className="mt-5 block">
            <Button className="w-full" variant="primary" size="sm">
              Practice your own conversation
            </Button>
          </Link>
        )}
      </div>
    </Section>
  );
}
