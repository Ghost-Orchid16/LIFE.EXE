import { useId, useState, type ReactNode } from "react";
import type { SituationSnapshot } from "../../../shared/contract.ts";
import { ChevronDown } from "../../components/icons.tsx";
import { FOCUS_META, type Tone } from "../../lib/focus.ts";
import { smarten } from "../../lib/typography.ts";

type Field = "title" | "matters" | "focus" | "nextMove";

interface SituationPanelProps {
  situation: SituationSnapshot | null;
  /** The snapshot before the latest answer, to mark what changed. */
  previous: SituationSnapshot | null;
  /** Identifies the latest answer, so change highlights replay each time. */
  version: string;
  /** LIFE.EXE is working on an answer right now. */
  busy: boolean;
  compact?: boolean;
}

function changedFields(previous: SituationSnapshot | null, current: SituationSnapshot | null): Set<Field> {
  const changed = new Set<Field>();
  if (!previous || !current) return changed;
  if (previous.title !== current.title || previous.summary !== current.summary) changed.add("title");
  if (previous.matters.join("|") !== current.matters.join("|")) changed.add("matters");
  if (previous.focus !== current.focus) changed.add("focus");
  if (previous.nextMove !== current.nextMove) changed.add("nextMove");
  return changed;
}

function FocusChip({ situation }: { situation: SituationSnapshot }) {
  const meta = FOCUS_META[situation.focus];
  return (
    <span className="focus-chip" data-tone={meta.tone}>
      <span className="focus-chip__dot" aria-hidden="true" />
      {meta.label}
    </span>
  );
}

function PanelSection({ title, tone, updated, children }: { title: string; tone: Tone; updated: boolean; children: ReactNode }) {
  return (
    <div className={`panel__section${updated ? " is-updated" : ""}`} data-tone={tone}>
      <h3 className="kicker">
        {title}
        {updated && <span className="panel__updated">Updated</span>}
      </h3>
      {children}
    </div>
  );
}

function PanelBody({
  situation,
  changed,
  version,
  busy,
  compact,
}: {
  situation: SituationSnapshot | null;
  changed: Set<Field>;
  version: string;
  busy: boolean;
  compact: boolean;
}) {
  if (!situation) {
    if (!busy) return <p className="panel__waiting-text">A summary of your situation appears here once LIFE.EXE answers.</p>;
    return (
      <div className="panel__waiting">
        <p className="panel__waiting-text">LIFE.EXE is reading your situation…</p>
        <span className="skeleton" />
        <span className="skeleton skeleton--short" />
        <span className="skeleton" />
      </div>
    );
  }

  const focus = FOCUS_META[situation.focus];
  return (
    <div key={version} className="panel__body">
      {compact ? (
        <p className="panel__summary panel__summary--lead">{smarten(situation.summary)}</p>
      ) : (
        <PanelSection title="Your situation" tone="blue" updated={changed.has("title")}>
          <p className="panel__title">{smarten(situation.title)}</p>
          <p className="panel__summary">{smarten(situation.summary)}</p>
        </PanelSection>
      )}
      {situation.matters.length > 0 && (
        <PanelSection title="What matters" tone="cyan" updated={changed.has("matters")}>
          <ul className="panel__matters">
            {situation.matters.map((item) => (
              <li key={item}>{smarten(item)}</li>
            ))}
          </ul>
        </PanelSection>
      )}
      <PanelSection title="Current focus" tone={focus.tone} updated={changed.has("focus")}>
        <p className="panel__focus">
          <FocusChip situation={situation} />
          <span className="panel__focus-text">{focus.description}</span>
        </p>
      </PanelSection>
      {situation.nextMove && (
        <PanelSection title="Next move" tone="lime" updated={changed.has("nextMove")}>
          <p className="panel__next">{smarten(situation.nextMove)}</p>
        </PanelSection>
      )}
    </div>
  );
}

/** LIFE.EXE's running picture of the situation. A sidebar on wide screens, a collapsible card on small ones. */
export function SituationPanel({ situation, previous, version, busy, compact = false }: SituationPanelProps) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const headingId = useId();
  const changed = changedFields(previous, situation);

  if (!compact) {
    return (
      <section className="panel" aria-labelledby={headingId}>
        <h2 id={headingId} className="visually-hidden">
          Situation summary
        </h2>
        <PanelBody situation={situation} changed={changed} version={version} busy={busy} compact={false} />
        <p className="panel__foot">Updates as the conversation moves.</p>
      </section>
    );
  }

  return (
    <section className={`panel panel--compact${open ? " is-open" : ""}`} aria-labelledby={headingId}>
      <h2 id={headingId} className="visually-hidden">
        Situation summary
      </h2>
      <button type="button" className="panel__toggle" aria-expanded={open} aria-controls={detailsId} onClick={() => setOpen((value) => !value)}>
        <span className="panel__toggle-text">
          <span className="kicker" data-tone="blue">
            Your situation
            {changed.size > 0 && <span className="panel__updated">Updated</span>}
          </span>
          <span className="panel__toggle-title">
            {situation ? smarten(situation.title) : busy ? "Reading your situation…" : "Waiting for an answer"}
          </span>
        </span>
        {situation && <FocusChip situation={situation} />}
        <ChevronDown size={18} className="panel__chevron" />
      </button>
      <div id={detailsId} className="panel__details" hidden={!open}>
        <PanelBody situation={situation} changed={changed} version={version} busy={busy} compact />
      </div>
    </section>
  );
}
