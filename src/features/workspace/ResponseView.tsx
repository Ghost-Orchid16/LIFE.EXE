import type { ReactNode } from "react";
import type { LifeResponse, Mode } from "../../../shared/contract.ts";
import { ArrowRight } from "../../components/icons.tsx";
import type { Tone } from "../../lib/focus.ts";
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

function Section({ title, tone, className = "", children }: { title: string; tone: Tone; className?: string; children: ReactNode }) {
  return (
    <section className={`response__section ${className}`} data-tone={tone}>
      <h3 className="kicker">{title}</h3>
      {children}
    </section>
  );
}

const LETTERS = ["A", "B", "C"];

export function ResponseView({ response, mode, number, isLatest, busy, onFollowUp }: ResponseViewProps) {
  const r = response;

  return (
    <article className="response">
      <h2 className="visually-hidden">LIFE.EXE response {number}</h2>
      <p className="response__byline" aria-hidden="true">
        <span>LIFE.EXE</span>
        {mode === "demo" && <span className="demo-tag">Demo response</span>}
      </p>
      {mode === "demo" && <p className="visually-hidden">This is a pre-written demo response.</p>}

      {r.care && (
        <Section title="First things first" tone="coral" className="response__care">
          <p>{smarten(r.care)}</p>
        </Section>
      )}

      {r.lead && (
        <p className="response__lead">
          {smarten(r.lead)}
        </p>
      )}

      {r.whatsGoingOn && (
        <Section title="What's going on" tone="blue">
          <p className="response__text">{smarten(r.whatsGoingOn)}</p>
        </Section>
      )}

      {(r.whatMatters.length > 0 || r.whatsUnclear.length > 0) && (
        <div className="response__pair">
          {r.whatMatters.length > 0 && (
            <Section title="What matters" tone="cyan">
              <ul className="response__list">
                {r.whatMatters.map((item) => (
                  <li key={item}>{smarten(item)}</li>
                ))}
              </ul>
            </Section>
          )}
          {r.whatsUnclear.length > 0 && (
            <Section title="What's unclear" tone="violet">
              <ul className="response__list response__list--unclear">
                {r.whatsUnclear.map((item) => (
                  <li key={item}>{smarten(item)}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}

      {r.questions.length > 0 && (
        <Section title={r.questions.length === 1 ? "One thing first" : "A few things first"} tone="violet" className="response__questions">
          <ul>
            {r.questions.map((question) => (
              <li key={question}>{smarten(question)}</li>
            ))}
          </ul>
        </Section>
      )}

      {r.options.length > 0 && (
        <Section title="Your options" tone="coral">
          <ol className="options">
            {r.options.map((option, i) => (
              <li key={option.title} className="option">
                <div className="option__head">
                  <span className="option__letter" aria-hidden="true">
                    {LETTERS[i]}
                  </span>
                  <h4 className="option__title">
                    <span className="visually-hidden">Option {LETTERS[i]}: </span>
                    {smarten(option.title)}
                  </h4>
                </div>
                <p className="option__detail">{smarten(option.detail)}</p>
                <dl className="option__meta">
                  {option.upside && (
                    <div className="option__upside">
                      <dt>Upside</dt>
                      <dd>{smarten(option.upside)}</dd>
                    </div>
                  )}
                  {option.tradeoff && (
                    <div className="option__tradeoff">
                      <dt>Trade-off</dt>
                      <dd>{smarten(option.tradeoff)}</dd>
                    </div>
                  )}
                </dl>
              </li>
            ))}
          </ol>
        </Section>
      )}

      {r.sayItLikeThis.length > 0 && (
        <Section title="How you might say it" tone="cyan">
          <ul className="phrases">
            {r.sayItLikeThis.map((line) => (
              <li key={line}>
                <q>{smarten(line)}</q>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {r.nextMove && (
        <Section title="Next move" tone="lime" className="next-move">
          <p className="next-move__text">
            <ArrowRight size={18} className="next-move__arrow" />
            <span>{smarten(r.nextMove)}</span>
          </p>
        </Section>
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
