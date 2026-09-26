export type Env = Record<string, string | undefined>;

export interface ServerConfig {
  /** `null` means no key is configured, and LIFE.EXE runs in demo mode. */
  apiKey: string | null;
  model: string;
}

export const DEFAULT_MODEL = "gemini-3.8-flash";

export function readConfig(env: Env): ServerConfig {
  const apiKey = env.GEMINI_API_KEY?.trim() || null;
  const model = env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  return { apiKey, model };
}
