import { useEffect, useRef } from "react";
import type { Turn } from "../../hooks/useConversation.ts";
import { useMediaQuery, usePrefersReducedMotion } from "../../hooks/useMediaQuery.ts";
import { Composer } from "./Composer.tsx";
import { SituationPanel } from "./SituationPanel.tsx";
import { Thread } from "./Thread.tsx";
import "./response.css";
import "./workspace.css";

interface WorkspaceProps {
  turns: Turn[];
  busy: boolean;
  onSend: (text: string) => void;
  onRetry: () => void;
}

export function Workspace({ turns, busy, onSend, onRetry }: WorkspaceProps) {
  const wide = useMediaQuery("(min-width: 1024px)");
  const reducedMotion = usePrefersReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);

  const answers = turns.flatMap((turn) => (turn.role === "assistant" && turn.status === "done" ? [turn] : []));
  const latest = answers.at(-1);
  const situation = latest?.response.situation ?? null;
  const previous = answers.at(-2)?.response.situation ?? null;
  const awaitingAnswer = Boolean(latest && turns.at(-1) === latest && latest.response.questions.length > 0);

  // Arriving from the home page: start at the top and move focus into the workspace.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, []);

  // A follow-up: bring the person's message to the top so the answer unfolds beneath it. When the answer
  // arrives the page has grown, so align again, unless they've scrolled up to reread something.
  const lastUserId = turns.findLast((turn) => turn.role === "user")?.id;
  const firstUserId = turns[0]?.id;
  const latestAnswerId = latest?.id;
  useEffect(() => {
    if (!lastUserId || lastUserId === firstUserId) return;
    const message = document.getElementById(`turn-${lastUserId}`);
    if (!message || message.getBoundingClientRect().top > window.innerHeight) return;
    message.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [lastUserId, latestAnswerId, firstUserId, reducedMotion]);

  const panel = (compact: boolean) => (
    <SituationPanel
      situation={situation}
      previous={previous}
      version={latest?.id ?? "none"}
      busy={busy}
      compact={compact}
    />
  );

  return (
    <main id="main" className="workspace container">
      <h1 className="visually-hidden" tabIndex={-1} ref={heading}>
        Working through your situation
      </h1>
      <div className="workspace__grid">
        <div className="workspace__main">
          {!wide && panel(true)}
          <Thread turns={turns} busy={busy} onRetry={onRetry} onFollowUp={onSend} />
          <Composer busy={busy} awaitingAnswer={awaitingAnswer} onSend={onSend} />
        </div>
        {wide && <aside className="workspace__aside">{panel(false)}</aside>}
      </div>
    </main>
  );
}
