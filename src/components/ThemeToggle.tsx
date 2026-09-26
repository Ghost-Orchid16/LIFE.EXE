import { useRef, type KeyboardEvent } from "react";
import type { Theme } from "../hooks/useTheme.ts";
import { HalfCircle, Sun } from "./icons.tsx";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: HalfCircle },
] as const;

/** ☀ Light / ◐ Dark, as a two-option radio group (arrow keys switch between them). */
export function ThemeToggle({ theme, onChange }: { theme: Theme; onChange: (theme: Theme) => void }) {
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const next: Theme = theme === "light" ? "dark" : "light";
    onChange(next);
    buttons.current[next === "light" ? 0 : 1]?.focus();
  };

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Color theme" data-value={theme} onKeyDown={onKeyDown}>
      <span className="theme-toggle__thumb" aria-hidden="true" />
      {OPTIONS.map(({ value, label, Icon }, index) => (
        <button
          key={value}
          ref={(element) => {
            buttons.current[index] = element;
          }}
          type="button"
          role="radio"
          aria-checked={theme === value}
          tabIndex={theme === value ? 0 : -1}
          className="theme-toggle__option"
          onClick={() => onChange(value)}
        >
          <Icon size={15} />
          <span className="theme-toggle__label">{label}</span>
        </button>
      ))}
    </div>
  );
}
