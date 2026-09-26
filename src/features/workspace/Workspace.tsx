import { useEffect, useRef } from "react";
import type { Turn } from "../../hooks/useConversation.ts";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery.ts";
import { Composer } from "./Composer.tsx";
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
  const reducedMotion = usePrefersReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);

  const latest = turns.findLast((turn) => turn.role === "assistant" && turn.status === "done");
  const awaitingAnswer = Boolean(latest?.role === "assistant" && latest.status === "done" && turns.at(-1) === latest && latest.response.question);

  // Arriving from the home page: start at the top and move focus into the workspace.
  useEffect(() => {
    window.scrollTo({ top: 0 });
    heading.current?.focus({ preventScroll: true });
  }, []);

  // A follow-up: bring the person's message to the top so the answer unfolds beneath it, wherever they
  // sent it from. When the answer arrives the page has grown, so align again, unless they've scrolled
  // up to reread something in the meantime.
  const lastUserId = turns.findLast((turn) => turn.role === "user")?.id;
  const firstUserId = turns[0]?.id;
  const latestAnswerId = latest?.id;
  const seen = useRef({ message: lastUserId, answer: latestAnswerId });
  useEffect(() => {
    const previous = seen.current;
    seen.current = { message: lastUserId, answer: latestAnswerId };
    if (!lastUserId || lastUserId === firstUserId) return;
    const sent = lastUserId !== previous.message;
    if (!sent && latestAnswerId === previous.answer) return;
    const message = document.getElementById(`turn-${lastUserId}`);
    if (!message || (!sent && message.getBoundingClientRect().top > window.innerHeight)) return;
    message.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [lastUserId, latestAnswerId, firstUserId, reducedMotion]);

  return (
    <main id="main" className="workspace container">
      <h1 className="visually-hidden" tabIndex={-1} ref={heading}>
        Working through your situation
      </h1>
      <div className="workspace__main">
        <Thread turns={turns} busy={busy} onRetry={onRetry} onFollowUp={onSend} />
        <Composer busy={busy} awaitingAnswer={awaitingAnswer} onSend={onSend} />
      </div>
    </main>
  );
}
