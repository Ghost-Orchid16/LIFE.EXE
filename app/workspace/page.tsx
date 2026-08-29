"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldAlert, MessagesSquare, Sparkles, GitBranch } from "lucide-react";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher";
import SituationInput, { PENDING_KEY } from "@/components/workspace/SituationInput";
import LifeEngineProgress from "@/components/workspace/LifeEngineProgress";
import ContextPanel from "@/components/workspace/ContextPanel";
import ResponseCard from "@/components/workspace/ResponseCard";
import FollowUpBar from "@/components/workspace/FollowUpBar";
import Modal from "@/components/ui/Modal";
import DecisionSimulatorPanel from "@/components/workspace/DecisionSimulatorPanel";
import RoleplayPanel from "@/components/workspace/RoleplayPanel";
import ScamSensePanel from "@/components/workspace/ScamSensePanel";
import ReadBetweenLinesPanel from "@/components/workspace/ReadBetweenLinesPanel";
import OutcomePicker from "@/components/workspace/OutcomePicker";
import { ENGINE_STAGES } from "@/lib/agent/stages";
import { useLifeStore } from "@/lib/store/useLifeStore";
import type { AgentTurn, DecisionFrame, OutcomeGoal, Strategy } from "@/lib/types";

const OUTCOME_LABEL: Record<OutcomeGoal, string> = {
  understand: "understand the situation",
  decide: "make a decision",
  fix: "fix the problem",
  converse: "have a conversation",
  boundary: "set a boundary",
  reduce_uncertainty: "reduce uncertainty",
  prepare: "prepare for something",
  explore: "explore my options",
  vent: "just vent first",
};

type ModalKind = "decision" | "roleplay" | "scamsense" | "rbtl" | null;

export default function WorkspacePage() {
  const [turns, setTurns] = useState<AgentTurn[]>([]);
  const [processing, setProcessing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pendingRetry, setPendingRetry] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalKind>(null);
  const [roleplayContext, setRoleplayContext] = useState<string | undefined>(undefined);
  const [decisionSeed, setDecisionSeed] = useState<{ input?: string; frame?: DecisionFrame } | undefined>(undefined);
  const [outcomeGoal, setOutcomeGoal] = useState<OutcomeGoal | null>(null);

  const noSugarcoating = useLifeStore((s) => s.noSugarcoating);
  const toggleNoSugarcoating = useLifeStore((s) => s.toggleNoSugarcoating);
  const addHistoryEntry = useLifeStore((s) => s.addHistoryEntry);
  const bumpCounter = useLifeStore((s) => s.bumpCounter);
  const hasOnboarded = useLifeStore((s) => s.hasOnboarded);
  const completeOnboarding = useLifeStore((s) => s.completeOnboarding);

  const stageTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedFromPending = useRef(false);

  const runSituation = useCallback(async (text: string) => {
    setError(null);
    setProcessing(true);
    setStageIndex(0);
    stageTimer.current = setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, ENGINE_STAGES.length - 1));
    }, 320);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "The LIFE ENGINE lost connection. Try again.");
      const turn: AgentTurn = data.turn;
      setTurns((t) => [...t, turn]);
      addHistoryEntry({ title: text.slice(0, 80), category: turn.classification.primaryCategory, type: "situation" });
      bumpCounter("situationsExplored");
      completeOnboarding();
      setPendingRetry(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The LIFE ENGINE lost connection. Try again.");
      setPendingRetry(text);
    } finally {
      if (stageTimer.current) clearInterval(stageTimer.current);
      setProcessing(false);
    }
  }, [addHistoryEntry, bumpCounter, completeOnboarding]);

  useEffect(() => {
    if (startedFromPending.current) return;
    startedFromPending.current = true;
    try {
      const pending = sessionStorage.getItem(PENDING_KEY);
      if (pending) {
        sessionStorage.removeItem(PENDING_KEY);
        queueMicrotask(() => runSituation(pending));
      }
    } catch {}

    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("panel") === "scamsense") queueMicrotask(() => setModal("scamsense"));
    } catch {}
  }, [runSituation]);

  useEffect(() => () => {
    if (stageTimer.current) clearInterval(stageTimer.current);
  }, []);

  const latestTurn = turns[turns.length - 1] ?? null;

  function handlePracticeStrategy(strategy: Strategy) {
    setRoleplayContext(strategy.exampleAction);
    setModal("roleplay");
  }

  function handleOpenDecisionSimulator() {
    if (latestTurn?.decisionFrame) {
      setDecisionSeed({ frame: latestTurn.decisionFrame });
    } else {
      setDecisionSeed(undefined);
    }
    setModal("decision");
  }

  function handleFollowUp(text: string) {
    if (/practice/i.test(text)) {
      setRoleplayContext(latestTurn?.userInput);
      setModal("roleplay");
      return;
    }
    if (/research/i.test(text)) {
      runSituation(`${latestTurn?.userInput ?? ""} — please check current information on this: ${text}`);
      return;
    }
    if (/other option|option b|option a/i.test(text) && latestTurn?.decisionFrame) {
      handleOpenDecisionSimulator();
      return;
    }
    runSituation(text);
  }

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 pb-32 pt-6 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 text-sm text-[var(--fg-muted)] transition hover:text-[var(--fg)]">
          <ArrowLeft size={16} /> LIFE<span className="text-gradient">.EXE</span>
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <ToolButton icon={<ShieldAlert size={14} />} label="ScamSense" onClick={() => setModal("scamsense")} />
          <ToolButton icon={<MessagesSquare size={14} />} label="Read Between the Lines" onClick={() => setModal("rbtl")} />
          <ToolButton icon={<GitBranch size={14} />} label="Decision Simulator" onClick={handleOpenDecisionSimulator} />
          <ToolButton
            icon={<Sparkles size={14} />}
            label={noSugarcoating ? "Real answer: ON" : "Give me the real answer"}
            onClick={toggleNoSugarcoating}
            active={noSugarcoating}
          />
          <ThemeSwitcher />
        </div>
      </div>

      {turns.length === 0 && !processing && (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center">
          {!hasOnboarded && (
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--fg-muted)]">Welcome to LIFE.EXE</p>
              <p className="mt-2 text-2xl font-semibold">There are no wrong questions.</p>
            </div>
          )}
          <div className="w-full max-w-2xl">
            <SituationInput autoFocus onSubmit={runSituation} />
          </div>
        </div>
      )}

      {(turns.length > 0 || processing) && (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-5">
            {turns.map((turn) => (
              <ResponseCard
                key={turn.id}
                turn={turn}
                noSugarcoating={noSugarcoating}
                onPracticeStrategy={handlePracticeStrategy}
                onOpenDecisionSimulator={handleOpenDecisionSimulator}
              />
            ))}

            {!processing &&
              latestTurn &&
              latestTurn.classification.primaryCategory === "other" &&
              !outcomeGoal && (
                <div className="panel p-5">
                  <OutcomePicker
                    onSelect={(goal) => {
                      setOutcomeGoal(goal);
                      runSituation(`${latestTurn.userInput} — I want to ${OUTCOME_LABEL[goal]}.`);
                    }}
                  />
                </div>
              )}

            {processing && <LifeEngineProgress activeIndex={stageIndex} />}

            {error && (
              <div className="panel flex flex-col gap-3 border border-red-400/30 p-5 text-sm">
                <p>{error}</p>
                <button
                  onClick={() => pendingRetry && runSituation(pendingRetry)}
                  className="self-start rounded-full bg-[var(--fg)] px-4 py-2 text-xs font-medium text-[var(--bg)]"
                >
                  Retry
                </button>
              </div>
            )}

            <FollowUpBar onSend={handleFollowUp} disabled={processing} />
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-6">
              <ContextPanel turn={latestTurn} />
            </div>
          </aside>
        </div>
      )}

      <Modal open={modal === "decision"} onClose={() => setModal(null)} title="Decision Simulator">
        <DecisionSimulatorPanel initialInput={decisionSeed?.input} initialFrame={decisionSeed?.frame} />
      </Modal>
      <Modal open={modal === "roleplay"} onClose={() => setModal(null)} title="Practice It">
        <RoleplayPanel context={roleplayContext} onDone={() => setModal(null)} />
      </Modal>
      <Modal open={modal === "scamsense"} onClose={() => setModal(null)} title="ScamSense">
        <ScamSensePanel />
      </Modal>
      <Modal open={modal === "rbtl"} onClose={() => setModal(null)} title="Read Between the Lines">
        <ReadBetweenLinesPanel />
      </Modal>
    </div>
  );
}

function ToolButton({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-[var(--accent)] text-[var(--accent)] bg-[rgba(var(--accent-rgb),0.1)]"
          : "border-[var(--border)] text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[rgba(var(--accent-rgb),0.5)]"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
