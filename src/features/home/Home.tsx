import type { Mode } from "../../../shared/contract.ts";
import type { SavedConversation } from "../../lib/memory.ts";
import { SavedSituations } from "./SavedSituations.tsx";
import { SituationForm } from "./SituationForm.tsx";
import "./home.css";

const PHILOSOPHY = [
  { from: "Confusion", to: "Clarity", tone: "blue" },
  { from: "Uncertainty", to: "An answer", tone: "coral" },
  { from: "Stuck", to: "Next move", tone: "lime" },
] as const;

const STEPS = [
  { title: "Tell us", text: "Describe what's happening in your own words. No forms, no categories.", tone: "blue" },
  { title: "Get an answer", text: "LIFE.EXE thinks it through and tells you what it would do. No lecture, no report.", tone: "cyan" },
  { title: "Know your next move", text: "One practical thing to do now, with the words to use when that helps.", tone: "lime" },
  { title: "Keep talking", text: "Ask a follow-up, push back, or add details. It picks up where you left off.", tone: "coral" },
] as const;

interface HomeProps {
  mode: Mode | null;
  /** Situations saved in this browser, most recent first. */
  saved: SavedConversation[];
  onStart: (text: string) => void;
  onOpen: (id: string) => void;
  onClearMemory: () => void;
}

export function Home({ mode, saved, onStart, onOpen, onClearMemory }: HomeProps) {
  return (
    <main id="main" className="home">
      <section className="hero container" aria-labelledby="hero-title">
        <p className="hero__eyebrow rise">
          <span className="hero__eyebrow-dot" aria-hidden="true" />
          For when you don't know what to do next
        </p>
        <h1 id="hero-title" className="hero__title rise">
          Life didn't come with a manual.<br className="hero__break" /> <span className="hero__highlight">Figure it out.</span>
        </h1>
        <p className="hero__lede rise">
          Describe what's going on in your own words.<br className="hero__break" /> LIFE.EXE thinks it through and tells
          you what to do next.
        </p>

        <div className="hero__input">
          <SituationForm onSubmit={onStart} />
          <p className="hero__notes rise">
            <span>No account. Conversations are saved in this browser.</span>
            {mode === "demo" && (
              <span className="hero__demo-note">Demo mode: responses are pre-written examples, not live AI.</span>
            )}
          </p>
        </div>

        <SavedSituations conversations={saved} onOpen={onOpen} onClear={onClearMemory} />
      </section>

      <section className="how container" aria-labelledby="how-title">
        <h2 id="how-title" className="kicker">
          How it works
        </h2>
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
              Tell it what's happening, and it tells you what it would do and what to do next, without a lecture. The
              decision is still yours; it just helps you make it well.
            </p>
            <p>
              Your conversations are saved in this browser, so you can come back to them. There's no account, and
              LIFE.EXE's server doesn't keep them. To write an answer, the conversation you're working on is sent to
              LIFE.EXE's server and, when the live AI is on, to Google's Gemini API, so it isn't completely private.
              Anyone using this browser can see what's saved here, and clearing local memory deletes it.
            </p>
            <p className="about__closer">No perfect answers. Just better ways forward.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
