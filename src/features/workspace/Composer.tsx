import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { LIMITS } from "../../../shared/contract.ts";
import { ArrowUp } from "../../components/icons.tsx";
import { useAutoGrow } from "../../hooks/useAutoGrow.ts";
import { useMediaQuery } from "../../hooks/useMediaQuery.ts";
import { formatCount } from "../../lib/typography.ts";

interface ComposerProps {
  busy: boolean;
  /** LIFE.EXE's latest answer asked the person a question. */
  awaitingAnswer: boolean;
  onSend: (text: string) => void;
}

/** Continue the same situation: add detail, push back, or ask for help with the next step. */
export function Composer({ busy, awaitingAnswer, onSend }: ComposerProps) {
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");
  const input = useRef<HTMLTextAreaElement>(null);
  const touch = useMediaQuery("(hover: none), (pointer: coarse)");
  const narrow = useMediaQuery("(max-width: 599px)");
  useAutoGrow(input, text, 200);

  const submit = () => {
    if (busy) return;
    const trimmed = text.trim();
    if (!trimmed) {
      setNotice("Write something first, even a few words.");
      input.current?.focus();
      return;
    }
    if (trimmed.length > LIMITS.messageChars) {
      setNotice(`That's a lot at once. Try trimming it to under ${formatCount(LIMITS.messageChars)} characters.`);
      return;
    }
    onSend(trimmed);
    setText("");
    setNotice("");
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  // Enter sends on a keyboard; on touch screens Enter adds a line and the button sends.
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    if (event.metaKey || event.ctrlKey || (!event.shiftKey && !touch)) {
      event.preventDefault();
      submit();
    }
  };

  const hint = busy ? "LIFE.EXE is working on it…" : touch ? "" : "Enter to send · Shift + Enter for a new line";

  return (
    <form className="composer" onSubmit={onFormSubmit} noValidate>
      <div className={`composer__box${busy ? " is-busy" : ""}`}>
        <label htmlFor="composer-input" className="visually-hidden">
          Continue the conversation
        </label>
        <textarea
          id="composer-input"
          ref={input}
          rows={1}
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            if (notice) setNotice("");
          }}
          onKeyDown={onKeyDown}
          placeholder={
            awaitingAnswer
              ? narrow
                ? "Answer here, or add more…"
                : "Answer the question above, or add anything else…"
              : narrow
                ? "Add details or push back…"
                : "Add details, push back, or ask what to do first…"
          }
          aria-describedby="composer-notice"
        />
        <button
          type="submit"
          className="composer__send"
          disabled={busy}
          data-empty={text.trim() === "" || undefined}
          aria-label={busy ? "Send (LIFE.EXE is still working)" : "Send"}
        >
          <ArrowUp size={18} strokeWidth={2} />
        </button>
      </div>
      <p className="composer__hint">
        <span id="composer-notice" className="composer__notice" aria-live="polite">
          {notice}
        </span>
        {!notice && hint}
      </p>
    </form>
  );
}
