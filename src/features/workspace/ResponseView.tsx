import type { LifeResponse, Mode } from "../../../shared/contract.ts";
import { smarten } from "../../lib/typography.ts";

interface ResponseViewProps {
  response: LifeResponse;
  mode: Mode;
  /** 1-based position among LIFE.EXE's answers, for screen reader headings. */
  number: number;
  /** Only the latest answer offers quick follow-ups. */
  isLatest: boolean;
  busy: boolean;
  onFollowUp: (text: string) => void;
}

/** Longer answers come as paragraphs separated by a blank line. */
const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

/** One answer: what to do, the next move, the words to use when that helps, and what to ask next. */
export function ResponseView({ response: r, mode, number, isLatest, busy, onFollowUp }: ResponseViewProps) {
  return (
    <article className="response">
      <h2 className="visually-hidden">LIFE.EXE response {number}</h2>
      <p className="response__byline" aria-hidden="true">
        <span>LIFE.EXE</span>
        {mode === "demo" && <span className="demo-tag">Demo response</span>}
      </p>
      {mode === "demo" && <p className="visually-hidden">This is a pre-written demo response.</p>}

      {r.care && (
        <section className="response__care">
          <h3 className="kicker">First things first</h3>
          <p>{smarten(r.care)}</p>
        </section>
      )}

      {r.answer && (
        <div className="response__answer">
          {paragraphs(r.answer).map((paragraph) => (
            <p key={paragraph}>{smarten(paragraph)}</p>
          ))}
        </div>
      )}

      {r.points.length > 0 && (
        <ul className="response__points">
          {r.points.map((point) => (
            <li key={point}>{smarten(point)}</li>
          ))}
        </ul>
      )}

      {r.question && <p className="response__question">{smarten(r.question)}</p>}

      {(r.nextMove || r.scripts.length > 0) && (
        <section className="next-move">
          <h3 className="kicker">{r.nextMove ? "Next move" : "Try saying"}</h3>
          {r.nextMove && <p className="next-move__text">{smarten(r.nextMove)}</p>}
          {r.scripts.length > 0 && (
            <div className="scripts">
              {r.nextMove && <p className="scripts__label">{r.scripts.length > 1 ? "Try one of these:" : "Try:"}</p>}
              <ul>
                {r.scripts.map((line) => (
                  <li key={line}>
                    <q>{smarten(line)}</q>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {r.alternative && (
        <p className="response__alternative">
          <span className="response__alternative-label">Alternative:</span> {smarten(r.alternative)}
        </p>
      )}

      {isLatest && r.followUps.length > 0 && (
        <div className="followups" role="group" aria-label="Suggested follow-ups">
          {r.followUps.map((followUp) => (
            <button key={followUp} type="button" className="followup" disabled={busy} onClick={() => onFollowUp(followUp)}>
              {smarten(followUp)}
            </button>
          ))}
        </div>
      )}
    </article>
  );
}
