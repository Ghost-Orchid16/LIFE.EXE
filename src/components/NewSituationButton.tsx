import { useEffect, useState } from "react";
import { Plus } from "./icons.tsx";

/** Starts over. The first press asks for confirmation, so a conversation is never cleared by accident. */
export function NewSituationButton({ onConfirm }: { onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed) return;
    const timer = window.setTimeout(() => setArmed(false), 4000);
    return () => window.clearTimeout(timer);
  }, [armed]);

  return (
    <>
      <button
        type="button"
        className={`btn btn--ghost new-situation${armed ? " is-armed" : ""}`}
        onClick={() => (armed ? onConfirm() : setArmed(true))}
        onBlur={() => setArmed(false)}
      >
        {armed ? (
          <span>
            Clear<span className="hide-narrow"> and start over</span>?
          </span>
        ) : (
          <>
            <Plus size={15} />
            <span>
              New<span className="hide-narrow"> situation</span>
            </span>
          </>
        )}
      </button>
      <span className="visually-hidden" aria-live="polite">
        {armed ? "Press again to clear this conversation and start a new situation." : ""}
      </span>
    </>
  );
}
