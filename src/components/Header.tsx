import type { Mode } from "../../shared/contract.ts";
import type { Theme } from "../hooks/useTheme.ts";
import { Brand } from "./Brand.tsx";
import { ModeBadge } from "./ModeBadge.tsx";
import { NewSituationButton } from "./NewSituationButton.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";
import "./chrome.css";

interface HeaderProps {
  mode: Mode | null;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  /** Present while a conversation is open. */
  onNewSituation?: () => void;
}

export function Header({ mode, theme, onThemeChange, onNewSituation }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="container site-header__inner rise">
        <Brand />
        <div className="site-header__actions">
          {mode === "demo" && <ModeBadge />}
          {onNewSituation && <NewSituationButton onClick={onNewSituation} />}
          <ThemeToggle theme={theme} onChange={onThemeChange} />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__brand">
          <span className="site-footer__name">LIFE.EXE</span> Life didn't come with a manual.
        </p>
        <p className="site-footer__note">
          LIFE.EXE helps you think things through. It isn't a substitute for professional advice, and if you're in danger,
          contact your local emergency services.
        </p>
      </div>
    </footer>
  );
}
