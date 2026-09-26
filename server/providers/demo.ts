import { STAGES } from "../../shared/contract.ts";
import { buildDemoResponse } from "../demo/engine.ts";
import { LifeError, type LifeProvider } from "./types.ts";

function pause(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new LifeError("timeout"));
    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new LifeError("timeout"));
    };
    signal.addEventListener("abort", onAbort, { once: true });
  });
}

export interface DemoProviderOptions {
  /** How long each processing stage is shown. */
  stageMs?: number;
}

/**
 * Serves pre-written responses when no AI key is configured. It walks through the same
 * processing stages as the live provider, so the interface behaves identically; the
 * interface labels every demo response as such.
 */
export function createDemoProvider(options: DemoProviderOptions = {}): LifeProvider {
  const stageMs = options.stageMs ?? 700;
  return {
    mode: "demo",
    async respond(messages, { signal, onStage }) {
      const response = buildDemoResponse(messages);
      const isFollowUp = messages.length > 1;
      for (const stage of STAGES) {
        onStage(stage);
        await pause(isFollowUp ? stageMs * 0.6 : stageMs, signal);
      }
      return response;
    },
  };
}
