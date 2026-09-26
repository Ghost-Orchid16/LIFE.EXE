export type Env = Record<string, string | undefined>;

export const EFFORT_LEVELS = ["low", "medium", "high", "xhigh", "max"] as const;
export type Effort = (typeof EFFORT_LEVELS)[number];

export interface ServerConfig {
  /** `null` means no key is configured, and LIFE.EXE runs in demo mode. */
  apiKey: string | null;
  model: string;
  effort: Effort;
}

export const DEFAULT_MODEL = "claude-opus-5";
export const DEFAULT_EFFORT: Effort = "low";

export function readConfig(env: Env): ServerConfig {
  const apiKey = env.AI_API_KEY?.trim() || null;
  const model = env.AI_MODEL?.trim() || DEFAULT_MODEL;
  const effort = EFFORT_LEVELS.find((level) => level === env.AI_EFFORT?.trim().toLowerCase()) ?? DEFAULT_EFFORT;
  return { apiKey, model, effort };
}
