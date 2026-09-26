import { STAGES, type Stage } from "../../../shared/contract.ts";
import { Check } from "../../components/icons.tsx";

const STAGE_INFO: Record<Stage, { label: string; status: string; tone: "blue" | "cyan" | "lime" }> = {
  understanding: { label: "Understanding", status: "Reading what's going on…", tone: "blue" },
  thinking: { label: "Thinking", status: "Working out what to do…", tone: "cyan" },
  answering: { label: "Preparing answer", status: "Putting your answer together…", tone: "lime" },
};

/**
 * Shows where LIFE.EXE is in its work. Stages follow the answer as it is actually written,
 * so this reports real progress; it never shows the model's reasoning itself.
 */
export function ProcessingSequence({ stage }: { stage: Stage }) {
  const current = STAGES.indexOf(stage);

  return (
    <div className="processing">
      <ol className="processing__stages" aria-hidden="true">
        {STAGES.map((name, index) => {
          const state = index < current ? "done" : index === current ? "active" : "waiting";
          return (
            <li key={name} className={`processing__stage is-${state}`} data-tone={STAGE_INFO[name].tone}>
              <span className="processing__dot">{state === "done" && <Check size={10} strokeWidth={2.5} />}</span>
              <span className="processing__label">{STAGE_INFO[name].label}</span>
            </li>
          );
        })}
      </ol>
      <p className="processing__status" role="status">
        <span key={stage} className="processing__status-text">
          {STAGE_INFO[stage].status}
        </span>
      </p>
    </div>
  );
}
