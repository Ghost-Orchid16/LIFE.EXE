import { useEffect, useState } from "react";
import type { Mode } from "../shared/contract.ts";
import { Footer, Header } from "./components/Header.tsx";
import { Home } from "./features/home/Home.tsx";
import { Workspace } from "./features/workspace/Workspace.tsx";
import { useConversation } from "./hooks/useConversation.ts";
import { useTheme } from "./hooks/useTheme.ts";
import { fetchMode } from "./lib/api.ts";

export default function App() {
  const { theme, setTheme } = useTheme();
  const [mode, setMode] = useState<Mode | null>(null);
  const { turns, busy, send, retry, reset } = useConversation(setMode);
  const view = turns.length > 0 ? "workspace" : "home";

  // Learn up front whether the live AI is connected, so demo mode is labelled before anyone types.
  useEffect(() => {
    const controller = new AbortController();
    fetchMode(controller.signal).then((next) => {
      if (next) setMode(next);
    });
    return () => controller.abort();
  }, []);

  // Coming back from a conversation: return to the top of the home page.
  useEffect(() => {
    if (view === "home") window.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div className="app" data-view={view}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header mode={mode} theme={theme} onThemeChange={setTheme} onNewSituation={view === "workspace" ? reset : undefined} />
      {view === "home" ? (
        <Home mode={mode} onStart={send} />
      ) : (
        <Workspace turns={turns} busy={busy} onSend={send} onRetry={retry} />
      )}
      <Footer />
    </div>
  );
}
