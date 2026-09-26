import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Check } from "../../components/icons.tsx";
import type { SavedConversation } from "../../lib/memory.ts";
import { formatWhen, smarten } from "../../lib/typography.ts";

const SHOWN = 3;

function replies(conversation: SavedConversation): string {
  const count = conversation.turns.filter((turn) => turn.role === "assistant").length;
  return count === 0 ? "No answer yet" : count === 1 ? "1 reply" : `${count} replies`;
}

interface SavedSituationsProps {
  conversations: SavedConversation[];
  onOpen: (id: string) => void;
  onClear: () => void;
}

/** Situations saved in this browser, to pick up again. Nothing shows until something has been saved. */
export function SavedSituations({ conversations, onOpen, onClear }: SavedSituationsProps) {
  const [showAll, setShowAll] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);
  const clearButton = useRef<HTMLButtonElement>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  const status = useRef<HTMLParagraphElement>(null);
  const returnFocus = useRef(false);
  const headingId = useId();
  const questionId = useId();

  useEffect(() => {
    if (confirming) cancelButton.current?.focus();
    else if (returnFocus.current) clearButton.current?.focus();
    returnFocus.current = false;
  }, [confirming]);

  useEffect(() => {
    if (cleared) status.current?.focus();
  }, [cleared]);

  if (conversations.length === 0) {
    if (!cleared) return null;
    return (
      <p className="memory__cleared" tabIndex={-1} ref={status}>
        <Check size={15} />
        Local memory cleared. No situations are saved in this browser.
      </p>
    );
  }

  const cancel = () => {
    returnFocus.current = true;
    setConfirming(false);
  };
  const clear = () => {
    setConfirming(false);
    setCleared(true);
    onClear();
  };
  const shown = showAll ? conversations : conversations.slice(0, SHOWN);
  const hidden = conversations.length - shown.length;
  const count = conversations.length === 1 ? "the saved situation" : `all ${conversations.length} saved situations`;

  return (
    <section className="memory" aria-labelledby={headingId}>
      <h2 id={headingId} className="kicker">
        Pick up where you left off
      </h2>
      <ul className="memory__list">
        {shown.map((conversation) => (
          <li key={conversation.id}>
            <button type="button" className="memory__item" onClick={() => onOpen(conversation.id)}>
              <span className="memory__title">{smarten(conversation.title)}</span>
              <span className="memory__meta">
                <span>{replies(conversation)}</span>
                <time dateTime={new Date(conversation.updatedAt).toISOString()}>{formatWhen(conversation.updatedAt)}</time>
              </span>
              <ArrowRight size={16} className="memory__arrow" />
            </button>
          </li>
        ))}
      </ul>
      <div className="memory__footer">
        {hidden > 0 && (
          <button type="button" className="memory__link" onClick={() => setShowAll(true)}>
            Show {hidden} more
          </button>
        )}
        {confirming ? (
          <div
            className="memory__confirm"
            role="group"
            aria-labelledby={questionId}
            onKeyDown={(event) => event.key === "Escape" && cancel()}
          >
            <p id={questionId} className="memory__question">
              Delete {count} from this browser? This can't be undone.
            </p>
            <div className="memory__actions">
              <button type="button" className="btn memory__delete" onClick={clear}>
                Delete
              </button>
              <button type="button" className="btn btn--ghost memory__cancel" ref={cancelButton} onClick={cancel}>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="memory__link memory__clear" ref={clearButton} onClick={() => setConfirming(true)}>
            Clear local memory
          </button>
        )}
      </div>
    </section>
  );
}
