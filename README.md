# LIFE.EXE

**Life didn't come with a manual. Figure it out.**

LIFE.EXE is a small decision-support tool for real-life situations. You describe what's going on in your own words, and it helps you understand the situation, explore realistic options, and pick a practical next step. Then you keep talking it through: push back, add details, or ask for help with what to say.

![LIFE.EXE home page in light mode](docs/home-light.png)

![A LIFE.EXE conversation in dark mode](docs/workspace-dark.png)

## How it works

1. **You explain the situation.** No categories or forms, just plain language.
2. **LIFE.EXE works through it.** It separates facts from assumptions, figures out what matters and what's still unclear, and weighs a few realistic approaches. While it works you see its progress (Understanding → Context → Options → Next move), never its private reasoning.
3. **You get a structured answer:** what's going on, what matters, what's unclear, two or three options with their upside and trade-off, and one concrete next move. If something important is missing, it asks one short question instead of guessing.
4. **You continue the conversation.** Follow-ups stay part of the same situation, and the panel beside the conversation keeps a running summary of the situation, the current focus, and the next move.

LIFE.EXE doesn't diagnose, doesn't claim to know what other people think, and points to real-world help when a situation is serious. If someone may be in danger, safety comes first.

## Run it locally

You need [Node.js](https://nodejs.org/) 22.18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173. Without an API key, LIFE.EXE runs in **demo mode** (see below), so it works straight away.

## Connect the AI

LIFE.EXE uses Claude, Anthropic's AI model, through the official Anthropic SDK.

1. Create an API key in the [Anthropic Console](https://console.anthropic.com/).
2. Copy the example environment file and add your key:

   ```bash
   cp .env.example .env
   ```

   ```bash
   # .env
   AI_API_KEY=sk-ant-...
   ```

3. Restart `npm run dev`. The "Demo mode" badge disappears once the live AI is connected.

| Variable     | Required | Default         | What it does                                                                                     |
| ------------ | -------- | --------------- | ------------------------------------------------------------------------------------------------ |
| `AI_API_KEY` | For live AI | (none)       | Your Anthropic API key. Leave it empty to run in demo mode.                                      |
| `AI_MODEL`   | No       | `claude-opus-5` | Which Claude model to use.                                                                       |
| `AI_EFFORT`  | No       | `low`           | How much the model thinks before answering: `low`, `medium` or `high`. Higher is slower but more thorough. |

The key is only ever read on the server (the Netlify Function, or the local dev server). It is never sent to the browser or included in the built site. `.env` is git-ignored; never commit a real key.

## Demo mode

When no `AI_API_KEY` is set, LIFE.EXE answers with pre-written responses instead of calling an AI. This keeps the app usable for demonstrations without a key or an internet connection to the AI.

- Demo responses cover six common situations (a career choice, a friend who's gone quiet, a difficult conversation, two opportunities, a decision you regret, and your wants versus other people's expectations), a general fallback, and follow-ups like "Can you be more direct?" or "What should I do first?".
- If a message suggests someone may be in danger, demo mode always responds with a support message pointing to emergency services and crisis lines.
- Demo mode is always labelled: a **Demo mode** badge in the header, a note under the input, and a **Demo response** tag on every answer. Demo answers are never presented as live AI.

## Deploy to Netlify

The project is set up for Netlify: `netlify.toml` defines the build, and `netlify/functions/life.ts` serves the API at `/api/life`.

1. Push this repository to GitHub.
2. In Netlify, create a new project and import the repository from GitHub. The build settings are read from `netlify.toml` (build command `npm run build`, publish directory `dist`, Node 22), so there is nothing to change.
3. To use the live AI, add `AI_API_KEY` in the project's **Environment variables** settings (make sure its scopes include Functions), then trigger a new deploy. Optionally add `AI_MODEL` and `AI_EFFORT`.

Without `AI_API_KEY`, the deployed site runs in demo mode.

A few things to know before sharing a live deployment:

- **Anyone with the link can use your key.** Keep an eye on usage and set a spending limit in the Anthropic Console.
- **Response time.** Netlify stops functions after a time limit (about 30 seconds by default). LIFE.EXE streams its progress and keeps answers short, so a normal answer finishes well within that. If you see "That took longer than it should have", lower `AI_EFFORT` or choose a faster `AI_MODEL`.

## Project structure

```
index.html                  Page shell (sets the saved theme before first paint)
netlify.toml                Netlify build, functions and headers
netlify/functions/life.ts   Netlify Function: serves /api/life
server/                     API layer and AI service (no browser code)
  handler.ts                HTTP handling: validation, streaming, errors
  validation.ts             Checks incoming conversations
  providers/                One file per AI provider, behind one interface
    anthropic.ts            Claude via the Anthropic SDK (streamed structured output)
    demo.ts                 Demo mode
  demo/                     Demo mode's pre-written responses and matching logic
  prompt.ts                 LIFE.EXE's instructions to the model
  schema.ts                 The structured response format, and its validation
  stages.ts                 Turns the streamed answer into progress stages
  node-adapter.ts           Lets the Vite dev server run the same handler locally
shared/contract.ts          Types and limits shared by the browser and the server
src/                        The React app
  features/home/            Home page: the situation input, how it works, about
  features/workspace/       Conversation, processing sequence, situation panel, composer
  hooks/                    Conversation state, theme, media queries
  lib/                      API client, error messages, typography helpers
  styles/                   Design tokens (light and dark) and base styles
```

### How a request flows

```
Browser ──POST /api/life──▶ handler ──▶ provider (Claude or demo) ──▶ structured answer
   ▲                          │
   └──── server-sent events ──┘   meta → stage (×4) → result | error
```

The browser sends the whole conversation with each message; nothing is stored on the server. The conversation is kept in the browser tab (session storage), so it survives a reload and disappears when the tab is closed.

### Switching AI providers

Providers implement the `LifeProvider` interface in `server/providers/types.ts`: take the conversation, report progress stages, and return a `LifeResponse`. To use another provider, add a file next to `anthropic.ts` and select it in `createProvider` in `server/handler.ts`. Nothing in the browser needs to change.

## Scripts

| Command             | What it does                                                    |
| ------------------- | --------------------------------------------------------------- |
| `npm run dev`       | Start the app and API locally with hot reload                   |
| `npm run build`     | Type-check and build the production site into `dist/`          |
| `npm run preview`   | Serve the production build locally, API included                |
| `npm test`          | Run the server tests (Node's built-in test runner)              |
| `npm run typecheck` | Type-check everything                                           |
| `npm run lint`      | Lint with oxlint                                                |

## Tech

React 19, TypeScript, Vite, plain CSS with custom properties, the Anthropic TypeScript SDK, zod for response validation, and Netlify Functions. Fonts are self-hosted: Bricolage Grotesque, Instrument Sans and JetBrains Mono.
