import { Retry } from "../../components/icons.tsx";
import type { TurnErrorCode } from "../../hooks/useConversation.ts";
import { errorCopy } from "../../lib/errors.ts";

export function TurnError({ code, onRetry }: { code: TurnErrorCode; onRetry: () => void }) {
  const copy = errorCopy(code);
  return (
    <div className="turn-error" role="alert">
      <p className="turn-error__title">{copy.title}</p>
      <p className="turn-error__detail">{copy.detail}</p>
      {copy.retry && (
        <button type="button" className="btn btn--secondary turn-error__retry" onClick={onRetry}>
          <Retry size={15} />
          Try again
        </button>
      )}
    </div>
  );
}
