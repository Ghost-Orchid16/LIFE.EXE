"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useLifeStore } from "@/lib/store/useLifeStore";
import Button from "@/components/ui/Button";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";

export default function HistoryPage() {
  const history = useLifeStore((s) => s.history);
  const clearHistory = useLifeStore((s) => s.clearHistory);
  const situationsExplored = useLifeStore((s) => s.situationsExplored);
  const conversationsPracticed = useLifeStore((s) => s.conversationsPracticed);
  const decisionsSimulated = useLifeStore((s) => s.decisionsSimulated);
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-6 pb-24 pt-6">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm text-[var(--fg-muted)] hover:text-[var(--fg)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <ThemeSwitcher />
      </div>

      <h1 className="mb-2 font-[family-name:var(--font-display)] text-3xl font-semibold">History</h1>
      <p className="mb-8 text-sm text-[var(--fg-muted)]">
        Your situations are yours. This is stored only in your browser — nothing here is sent anywhere except when you actively
        ask LIFE.EXE to reason about it.
      </p>

      <div className="mb-8 grid grid-cols-3 gap-3">
        <Stat label="Situations explored" value={situationsExplored} />
        <Stat label="Conversations practiced" value={conversationsPracticed} />
        <Stat label="Decisions simulated" value={decisionsSimulated} />
      </div>

      {history.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--fg-muted)]">
          Nothing here yet. Once you explore a situation, it&apos;ll show up in this list.
        </p>
      ) : (
        <ul className="mb-8 flex flex-col gap-3">
          {history.map((h) => (
            <li key={h.id} className="panel flex items-center justify-between gap-4 p-4">
              <div>
                <p className="text-sm font-medium">{h.title}</p>
                <p className="text-xs text-[var(--fg-muted)]">
                  {h.category.replace("_", " ")} · {new Date(h.createdAt).toLocaleString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {history.length > 0 && (
        <div>
          {!confirming ? (
            <Button variant="secondary" onClick={() => setConfirming(true)}>
              <Trash2 size={14} /> Clear history
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--fg-muted)]">Clear all local history? This can&apos;t be undone.</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  clearHistory();
                  setConfirming(false);
                }}
              >
                Confirm
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel p-4 text-center">
      <p className="font-[family-name:var(--font-display)] text-2xl font-semibold">{String(value).padStart(2, "0")}</p>
      <p className="mt-1 text-xs text-[var(--fg-muted)]">{label}</p>
    </div>
  );
}
