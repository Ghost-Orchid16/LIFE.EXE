import { Plus } from "./icons.tsx";

/** Starts a new situation. The one that was open stays saved in this browser, so nothing needs confirming. */
export function NewSituationButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="btn btn--ghost new-situation" aria-label="New situation" onClick={onClick}>
      <Plus size={15} />
      <span>
        New<span className="hide-narrow"> situation</span>
      </span>
    </button>
  );
}
