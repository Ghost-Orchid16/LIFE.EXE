import type { Mode } from "../../../shared/contract.ts";
import { SituationForm } from "./SituationForm.tsx";
import "./home.css";

const PHILOSOPHY = [
  { from: "Confusion", to: "Clarity", tone: "blue" },
  { from: "Uncertainty", to: "Options", tone: "coral" },
  { from: "Options", to: "Next step", tone: "lime" },
] as const;

const STEPS = [
  { title: "Tell us", text: "Describe what's happening in your own words. No forms, no categories.", tone: "blue" },
  {
    title: "Understand it",
    text: "LIFE.EXE separates what you know from what you're assuming, and finds what actually matters.",
    tone: "cyan",
  },
  { title: "Explore options", text: "Two or three realistic ways forward, each with its upside and its trade-off.", tone: "coral" },
  { title: "Take the next step", text: "One practical move you can make now. Then keep talking it through.", tone: "lime" },
] as const;

export function Home({ mode, onStart }: { mode: Mode | null; onStart: (text: string) => void }) {
  return (
    <main id="main" className="home">
      <section className="hero container" aria-labelledby="hero-title">
        <p className="hero__eyebrow">
          <span className="hero__eyebrow-dot" aria-hidden="true" />
          For when you don't know what to do next
        </p>
        <h1 id="hero-title" className="hero__title">
          Life didn't come with a manual. <span className="hero__highlight">Figure it out.</span>
        </h1>
        <p className="hero__lede">
          Describe what's going on in your own words. LIFE.EXE helps you see the situation clearly, weigh your options,
          and find a practical next move.
        </p>

        <div className="hero__workbench">
          <div className="hero__input">
            <SituationForm onSubmit={onStart} />
            <p className="hero__notes">
              <span>No account. No history. Close the tab and it's gone.</span>
              {mode === "demo" && (
                <span className="hero__demo-note">Demo mode: responses are pre-written examples, not live AI.</span>
              )}
            </p>
          </div>
          <ul className="readout" aria-label="What LIFE.EXE does">
            {PHILOSOPHY.map(({ from, to, tone }) => (
              <li key={from} className="readout__row" data-tone={tone}>
                <span className="readout__from">{from}</span>
                <span className="readout__arrow" aria-hidden="true">
                  →
                </span>
                <span className="visually-hidden"> becomes </span>
                <span className="readout__to">{to}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="how container" aria-labelledby="how-title">
        <h2 id="how-title" className="kicker">
          How it works
        </h2>
        <ol className="how__steps">
          {STEPS.map(({ title, text, tone }, index) => (
            <li key={title} className="how__step" data-tone={tone}>
              <span className="how__num" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="how__title">{title}</h3>
              <p className="how__text">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="about container" aria-labelledby="about-title">
        <h2 id="about-title" className="kicker">
          About LIFE.EXE
        </h2>
        <div className="about__grid">
          <p className="about__statement">Life rarely gives you clear instructions.</p>
          <div className="about__body">
            <p>
              LIFE.EXE is a decision-support tool built to help you make sense of situations when you don't know what
              to do next.
            </p>
            <p>
              Tell it what's happening. It helps you understand the situation, explore your options, and figure out a
              practical next move. It won't make the decision for you; it helps you make it well.
            </p>
            <p className="about__closer">No perfect answers. Just better ways forward.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
