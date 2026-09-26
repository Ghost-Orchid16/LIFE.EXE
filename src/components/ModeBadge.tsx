import { useEffect, useRef, useState } from "react";

/** Shown whenever LIFE.EXE is answering with pre-written demo responses instead of the live AI. */
export function ModeBadge() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="mode-badge" ref={root}>
      <button
        type="button"
        className="mode-badge__button"
        aria-expanded={open}
        aria-controls="demo-mode-info"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="mode-badge__dot" aria-hidden="true" />
        <span>
          Demo<span className="hide-narrow"> mode</span>
        </span>
      </button>
      <div id="demo-mode-info" className="mode-badge__panel" hidden={!open}>
        <p className="mode-badge__title">You're seeing demo responses</p>
        <p>
          No AI key is configured, so LIFE.EXE answers with pre-written examples matched to what you describe. They show
          how LIFE.EXE works, but they aren't written for your exact situation.
        </p>
        <p>
          To switch on the live AI, set <code>AI_API_KEY</code> on the server.
        </p>
      </div>
    </div>
  );
}
