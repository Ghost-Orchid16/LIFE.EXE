import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { LIMITS } from "../../../shared/contract.ts";
import { ArrowRight } from "../../components/icons.tsx";
import { useAutoGrow } from "../../hooks/useAutoGrow.ts";
import { usePrefersReducedMotion } from "../../hooks/useMediaQuery.ts";
import { formatCount } from "../../lib/typography.ts";

const EXAMPLES = [
  "I don't know which career path I should choose.",
  "My friend hasn't talked to me for a few days.",
  "I need to have a difficult conversation.",
  "I have two opportunities and don't know which one to choose.",
  "I think I made a bad decision.",
  "I'm stuck between what I want and what other people expect from me.",
];

const EXAMPLE_INTERVAL_MS = 3800;
const isApple = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

function useRotatingExample(active: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!active) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % EXAMPLES.length), EXAMPLE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [active]);
  return EXAMPLES[index];
}

export function SituationForm({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  const [notice, setNotice] = useState("");
  const input = useRef<HTMLTextAreaElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const example = useRotatingExample(!reducedMotion && text === "");
  useAutoGrow(input, text, 360);

  // Put the cursor in the box on desktop so people can start typing straight away.
  // (Not on touch screens, where it would pop the keyboard over the page.)
  useEffect(() => {
    if (matchMedia("(pointer: fine)").matches) input.current?.focus({ preventScroll: true });
  }, []);

  const length = text.trim().length;
  const overLimit = length > LIMITS.messageChars;
  const nearLimit = length > LIMITS.messageChars * 0.8;

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setNotice("Tell LIFE.EXE a little about what's going on first.");
      input.current?.focus();
      return;
    }
    if (trimmed.length > LIMITS.messageChars) {
      setNotice(`That's a lot to take in at once. Try trimming it to under ${formatCount(LIMITS.messageChars)} characters.`);
      input.current?.focus();
      return;
    }
    onSubmit(trimmed);
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <form className="situation rise" onSubmit={onFormSubmit} noValidate>
      <div className="situation__head">
        <label htmlFor="situation-input" className="situation__label">
          What's going on?
        </label>
        <p id="situation-help" className="visually-hidden">
          Tell LIFE.EXE what's happening. No category required. Just explain it naturally.
        </p>
      </div>

      <div className="situation__field">
        <textarea
          id="situation-input"
          ref={input}
          value={text}
          rows={4}
          onChange={(event) => {
            setText(event.target.value);
            if (notice) setNotice("");
          }}
          onKeyDown={onKeyDown}
          aria-describedby="situation-help situation-notice"
          aria-invalid={overLimit || undefined}
          autoComplete="off"
        />
        {text === "" && (
          <p key={example} className="situation__example" aria-hidden="true">
            {example}
          </p>
        )}
      </div>

      <div className="situation__footer">
        <div className="situation__meta">
          <p id="situation-notice" className="situation__notice" aria-live="polite">
            {notice}
          </p>
          {!notice &&
            (nearLimit ? (
              <p className={`situation__count${overLimit ? " is-over" : ""}`}>
                {formatCount(length)} / {formatCount(LIMITS.messageChars)}
              </p>
            ) : (
              <p className="situation__shortcut">
                <kbd>{isApple ? "⌘" : "Ctrl"}</kbd> + <kbd>Enter</kbd> to submit
              </p>
            ))}
        </div>
        <button type="submit" className="btn-primary">
          Figure it out
          <span className="btn-primary__arrow">
            <ArrowRight size={18} />
          </span>
        </button>
      </div>
    </form>
  );
}
