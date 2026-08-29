# LIFE.EXE

> Life didn't come with a manual. Figure it out.

LIFE.EXE is an adaptive AI decision-support and life-navigation agent. Instead of picking a category and getting a canned answer, you describe a real situation in your own words — a decision, a hard conversation, a relationship problem, a suspicious message — and LIFE.EXE understands it, figures out what kind of reasoning it needs, and walks through a staged process to help you move forward.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API keys or setup are required — the app runs fully in **demo mode** out of the box (see below).

## Deployment

LIFE.EXE ships as a static export (`output: "export"` in `next.config.ts`) — no Node server required. `.github/workflows/deploy-pages.yml` builds it and publishes to a `gh-pages` branch on every push to `main`; point the repo's **Settings → Pages → Build and deployment → Branch** at `gh-pages` and it's live at `https://<owner>.github.io/<repo>/`.

To build the same static export locally: `GITHUB_PAGES=true npm run build` (the `out/` folder is what gets deployed). Running `npm run build` without that env var builds the same static export without the `/LIFE.EXE` path prefix, for hosting at a domain root instead.

## What's implemented

- **The Life Engine** — a staged reasoning pipeline (Understand → Context → Clarify → Research → Explore → Simulate → Decide → Act), visualized live while the agent processes a situation.
- **Dynamic situation understanding** — no forced category picker. A heuristic classifier (`lib/agent/engine.ts`) routes free text across overlapping internal categories (relationships, career, money, conflict, scam, etc.), detects emotional tone/stakes, and decides whether clarification or web research is needed.
- **Agent workspace** (`/workspace`) — situation input, live engine progress, structured response modules (summary, what we know/don't know, clarifying questions, strategies, decision frame, research, next step), a persistent context panel, and a follow-up loop that keeps the conversation going instead of restarting from zero.
- **Decision Simulator** — Option A/B framing with benefits, risks, trade-offs, a branching visualization, and "What if?" hypothetical exploration (clearly labeled as hypothetical, not predictive).
- **Practice It (Roleplay)** — practice a hard conversation against a simulated counterpart (friend, manager, parent, etc.), then get AI-generated conversation-review scores (clarity, assertiveness, empathy, escalation, goal alignment) — explicitly framed as practice feedback, not a scientific assessment.
- **ScamSense** — paste a suspicious message and get a signal-by-signal risk breakdown (urgency, OTP requests, payment pressure, impersonation, etc.), a LOW/MEDIUM/HIGH/CRITICAL risk meter, and safe next steps. Never encourages engaging with the suspicious source.
- **Read Between the Lines** — paste a conversation and get pattern-level observations (reciprocity, clarity, tone) with interpretations explicitly labeled by certainty — it never claims to know what someone else is thinking.
- **Recovery Mode ("I messed up")** — automatically detected; produces a damage-control plan (what matters now, what to say, what not to do, next steps).
- **No Sugarcoating mode** — a toggle for more direct framing, without becoming harsh.
- **Six full visual themes** (Cosmos, Futuristic, Ambient, Mono, Organic, Glass) — a real visual-language change (color, motion, texture, corner radius, type), not just a palette swap. Persisted, animated transitions.
- **Local history** — situations explored / conversations practiced / decisions simulated, stored only in `localStorage`, with a clear "clear history" control.
- **Agent Test Lab** (`/test-lab`) — 10 scripted scenarios run against the live classification engine with pass/fail and a success-rate readout. Rerunnable. Framed honestly as a prototype self-check, not a certified benchmark.
- **Cinematic landing page** — scroll-driven hero with a Three.js "Life Core" (degrades gracefully on low-power devices and `prefers-reduced-motion`), plus sections for the problem, how-it-works, cross-generational examples, engine visualization, and live mini-demos of the Decision Simulator, Roleplay, and ScamSense.

## Architecture

```
app/
  page.tsx            cinematic landing page
  workspace/          the agent workspace (client)
  history/            local history view
  test-lab/           agent test lab
lib/
  agent/              engine.ts (classification/strategy/decision/scam/recovery),
                      runAgentTurn.ts (client-side pipeline runner),
                      roleplay.ts, readBetweenTheLines.ts, testcases.ts, stages.ts
  research/service.ts research abstraction (demo fallback + live-provider seam)
  store/              zustand store (theme, history, settings — persisted)
  types.ts, themes.ts
components/
  landing/  workspace/  three/  theme/  ui/
```

- **Agent logic is isolated from UI.** Every screen calls into `lib/agent/*`, never re-implements reasoning inline.
- **Research is a clean seam.** `lib/research/service.ts` is the only place that would ever call an external search API. As shipped (a static export with no server), `runAgentTurn` calls it directly client-side, so a real `SEARCH_API_KEY` is never reachable there — that's intentional, since a static site has nowhere to keep a secret. Deploying on a real Node server (Vercel, etc.) instead is a small change: add back a thin `app/api/research/route.ts` that imports `runResearch`, and call it via `fetch` from the client so the key stays server-side.
- **No fake features.** In demo mode, research results are explicitly labeled `DEMO MODE` and use illustrative placeholder sources — the product never claims to have searched the web when it hasn't.

## Connecting real services (optional)

Copy `.env.example` to `.env.local`:

- `SEARCH_API_KEY` / `SEARCH_API_URL` — only meaningful if you also move research behind a server route (see above); a static export has no server to read this from. Without it, research falls back to the labeled demo layer automatically.
- `AI_API_KEY` — reserved for swapping the heuristic classifier in `lib/agent/engine.ts` for a real model call. The heuristic engine works fully without it.

## Notes on scope

LIFE.EXE is a decision-support prototype, not a replacement for professional advice. It avoids claiming certainty about other people's feelings or the future, avoids medical/legal/financial diagnosis, and points toward professional or official help for high-stakes situations.
