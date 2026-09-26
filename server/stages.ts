import { STAGES, type Stage } from "../shared/contract.ts";

// Each stage starts when the model begins writing the matching field of its JSON answer.
// Only a key followed by a colon counts, so the same word inside a quoted value never matches.
const STAGE_MARKERS: ReadonlyArray<readonly [Stage, RegExp]> = [
  ["context", /"whatMatters"\s*:/],
  ["options", /"options"\s*:/],
  ["next", /"nextMove"\s*:/],
];

export interface StageTracker {
  /** Feed the next chunk of streamed answer text. */
  push(text: string): void;
  /** A new text block started (for example after a fallback), so start matching afresh. */
  resetBlock(): void;
}

/**
 * Turns streamed answer text into coarse progress stages. Stages only move forward, and every
 * stage is reported in order even if one chunk skips past several markers at once.
 */
export function createStageTracker(onStage: (stage: Stage) => void): StageTracker {
  let reached = 0;
  let buffer = "";
  onStage(STAGES[0]);

  return {
    push(text) {
      buffer += text;
      let target = reached;
      for (const [stage, marker] of STAGE_MARKERS) {
        const index = STAGES.indexOf(stage);
        if (index > target && marker.test(buffer)) target = index;
      }
      while (reached < target) {
        reached += 1;
        onStage(STAGES[reached]);
      }
    },
    resetBlock() {
      buffer = "";
    },
  };
}
