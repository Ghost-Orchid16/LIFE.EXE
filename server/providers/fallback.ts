import { STAGES, type Stage } from "../../shared/contract.ts";
import { LifeError, type LifeProvider } from "./types.ts";

export interface FallbackOptions {
  /** How long the live AI gets before `fallback` answers instead; it has to leave `fallback` time to answer. */
  liveTimeoutMs: number;
}

/** Passes stages on only when they move forward, so progress never jumps back when the fallback starts over. */
function forwardOnly(onStage: (stage: Stage) => void): (stage: Stage) => void {
  let reached = -1;
  return (stage) => {
    const index = STAGES.indexOf(stage);
    if (index <= reached) return;
    reached = index;
    onStage(stage);
  };
}

/**
 * The live AI, with `fallback` (the demo engine) standing by. When the live AI fails for a passing reason
 * (rate limited, overloaded, too slow or unreachable), that one request is answered by `fallback` instead,
 * and `onFallback` says so. Nothing carries over: every request tries the live AI first.
 */
export function withFallback(live: LifeProvider, fallback: LifeProvider, { liveTimeoutMs }: FallbackOptions): LifeProvider {
  return {
    mode: live.mode,
    async respond(messages, options) {
      const { signal } = options;
      const onStage = forwardOnly(options.onStage);

      // The live AI stops when the person leaves, or once it has had its time.
      const liveAttempt = new AbortController();
      const stopLive = () => liveAttempt.abort();
      const timer = setTimeout(stopLive, liveTimeoutMs);
      if (signal.aborted) stopLive();
      else signal.addEventListener("abort", stopLive, { once: true });
      let failure: unknown;
      try {
        return await live.respond(messages, { ...options, signal: liveAttempt.signal, onStage });
      } catch (error) {
        failure = error;
      } finally {
        clearTimeout(timer);
        signal.removeEventListener("abort", stopLive);
      }

      // Refusals and setup problems stand as they are. And once the person has gone, or time is up, nobody is waiting.
      if (!(failure instanceof LifeError) || !failure.temporary || signal.aborted) throw failure;
      options.onFallback?.(failure);
      return fallback.respond(messages, { ...options, onStage });
    },
  };
}
