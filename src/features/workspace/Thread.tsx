import { LogoMark } from "../../components/Brand.tsx";
import type { Turn } from "../../hooks/useConversation.ts";
import { ProcessingSequence } from "./ProcessingSequence.tsx";
import { ResponseView } from "./ResponseView.tsx";
import { TurnError } from "./TurnError.tsx";

interface ThreadProps {
  turns: Turn[];
  busy: boolean;
  onRetry: () => void;
  onFollowUp: (text: string) => void;
}

/** The conversation as a path: your turns and LIFE.EXE's, one after another along a single line. */
export function Thread({ turns, busy, onRetry, onFollowUp }: ThreadProps) {
  const answerNumbers = new Map(
    turns
      .filter((turn) => turn.role === "assistant" && turn.status === "done")
      .map((turn, index) => [turn.id, index + 1] as const),
  );

  return (
    <ol className="thread">
      {turns.map((turn, index) => {
        const isLatest = index === turns.length - 1;

        if (turn.role === "user") {
          return (
            <li key={turn.id} id={`turn-${turn.id}`} className="turn turn--user">
              <span className="turn__marker" aria-hidden="true" />
              <div className="turn__body">
                <p className="turn__label">You</p>
                <p className="turn__text">{turn.text}</p>
              </div>
            </li>
          );
        }

        return (
          <li key={turn.id} id={`turn-${turn.id}`} className={`turn turn--assistant is-${turn.status}`}>
            <span className="turn__marker" aria-hidden="true">
              <LogoMark size={24} />
            </span>
            <div className="turn__body">
              {turn.status === "pending" && <ProcessingSequence stage={turn.stage} />}
              {turn.status === "error" && <TurnError code={turn.code} onRetry={onRetry} />}
              {turn.status === "done" && (
                <ResponseView
                  response={turn.response}
                  mode={turn.mode}
                  number={answerNumbers.get(turn.id) ?? 1}
                  isLatest={isLatest}
                  busy={busy}
                  onFollowUp={onFollowUp}
                />
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
