import type {
  AgentTurn,
  Category,
  ClassificationResult,
  DecisionFrame,
  DecisionOption,
  EmotionalContext,
  RecoveryPlan,
  Strategy,
} from "@/lib/types";
import { CATEGORY_KEYWORDS } from "@/lib/agent/keywords";
import { analyzeScam } from "@/lib/agent/engine";
import { runResearch } from "@/lib/research/service";

// ---------------------------------------------------------------------------
// Optional real-model reasoning path, powered by a Google AI Studio (Gemini)
// API key. This is the only file that ever talks to Gemini — it's imported
// exclusively by the server-side app/api/agent/route.ts, so GEMINI_API_KEY
// never reaches the browser. When no key is configured, hasGeminiKey() is
// false and the route falls back to the deterministic engine in
// lib/agent/heuristicTurn.ts (which is also the safety net if a live Gemini
// call throws for any reason — a bad key, a timeout, malformed JSON, etc).
//
// ScamSense is deliberately NOT handed to Gemini: analyzeScam()'s fixed,
// auditable signal list runs unconditionally whenever isScamLike is true,
// regardless of which path produced that classification. A security check
// stays on fixed rules rather than a model's own judgment call.
// ---------------------------------------------------------------------------

const CATEGORY_VALUES = Object.keys(CATEGORY_KEYWORDS) as Category[];
const TONE_VALUES: EmotionalContext["tone"][] = ["calm", "anxious", "frustrated", "sad", "conflicted", "urgent", "hopeful"];
const STAKES_VALUES: EmotionalContext["stakes"][] = ["low", "medium", "high"];

export function hasGeminiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY);
}

const SYSTEM_PROMPT = `You are the reasoning engine behind LIFE.EXE, an app that helps people navigate real-life situations — decisions, hard conversations, relationships, career choices, suspicious messages, and everyday dilemmas. You are not a generic chatbot: you route a situation into a structured analysis, always as JSON matching the given schema.

Rules:
- Never claim certainty about what another person is thinking or feeling — distinguish what is observable from what is merely possible.
- Never diagnose medical/mental-health conditions, give legal/financial advice as fact, or encourage illegal or dangerous actions.
- For high-stakes situations (safety, health, legal, financial risk to the user or others), keep isHighStakes true and gently point toward appropriate professional or official help rather than acting overconfident.
- categories/primaryCategory: pick from the given enum only, most relevant first. Real situations often span 2-3 categories.
- isScamLike: true if the situation describes or pastes a suspicious message, payment request, unsolicited offer, phishing attempt, or similar — even if the user isn't sure themselves.
- isRecoveryMode: true if the user already made a mistake (missed deadline, sent wrong message, bad purchase, social misstep, etc.) and needs damage control rather than a forward-looking decision.
- needsClarification: true when the situation is too thin to give specific guidance; clarifyingQuestions should be 1-3 short, concrete questions.
- needsResearch: true only when the answer genuinely depends on current, external, time-sensitive facts (prices, admissions requirements, policies, current events) rather than something reasoned from the user's own description.
- summary: one or two sentences, written to the user ("This reads as...").
- whatWeKnow / whatWeDontKnow: short bullet phrases, not full sentences.
- strategies: exactly 3, ONLY when isScamLike and isRecoveryMode are both false. Make them genuinely different in approach (e.g. conflict-avoidant vs. balanced vs. direct), each with real, non-generic advantages/risks specific to this situation. If isScamLike or isRecoveryMode is true, return an empty array.
- decision.options: exactly 2 concrete options inferred from the situation, ONLY when primaryCategory is "decision" and isScamLike/isRecoveryMode are false. Otherwise return an empty array for decision.options (still fill decision.goals/priorities/constraints with your best short generic read, or empty arrays if truly not applicable).
- recovery: fill in fully ONLY when isRecoveryMode is true (concrete, situation-specific damage-control guidance — what to say, what not to do, immediate next action). Otherwise every field may be a short empty-ish placeholder; it will be ignored by the caller.
- nextStep: one sentence, the single most useful next action for the user right now, consistent with the rest of your analysis (e.g. don't say "run ScamSense" if isScamLike is already true — say what to do about the message instead).
- Tone: direct, warm, non-judgmental, no filler, no therapy-speak, no "As an AI...".`;

const STRATEGY_ITEM_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    tag: { type: "STRING", description: "Short label like '01 — LOW CONFLICT'" },
    approach: { type: "STRING" },
    advantages: { type: "ARRAY", items: { type: "STRING" } },
    risks: { type: "ARRAY", items: { type: "STRING" } },
    whenItMakesSense: { type: "STRING" },
    exampleAction: { type: "STRING" },
  },
  required: ["title", "tag", "approach", "advantages", "risks", "whenItMakesSense", "exampleAction"],
};

const DECISION_OPTION_SCHEMA = {
  type: "OBJECT",
  properties: {
    label: { type: "STRING" },
    benefits: { type: "ARRAY", items: { type: "STRING" } },
    risks: { type: "ARRAY", items: { type: "STRING" } },
    tradeoffs: { type: "ARRAY", items: { type: "STRING" } },
    shortTerm: { type: "STRING" },
    longTerm: { type: "STRING" },
  },
  required: ["label", "benefits", "risks", "tradeoffs", "shortTerm", "longTerm"],
};

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    categories: { type: "ARRAY", items: { type: "STRING", enum: CATEGORY_VALUES }, minItems: 1, maxItems: 3 },
    primaryCategory: { type: "STRING", enum: CATEGORY_VALUES },
    emotionalTone: { type: "STRING", enum: TONE_VALUES },
    emotionalIntensity: { type: "NUMBER" },
    stakes: { type: "STRING", enum: STAKES_VALUES },
    needsResearch: { type: "BOOLEAN" },
    researchReason: { type: "STRING" },
    needsClarification: { type: "BOOLEAN" },
    clarifyingQuestions: { type: "ARRAY", items: { type: "STRING" } },
    isScamLike: { type: "BOOLEAN" },
    isRecoveryMode: { type: "BOOLEAN" },
    isHighStakes: { type: "BOOLEAN" },
    summary: { type: "STRING" },
    whatWeKnow: { type: "ARRAY", items: { type: "STRING" } },
    whatWeDontKnow: { type: "ARRAY", items: { type: "STRING" } },
    nextStep: { type: "STRING" },
    strategies: { type: "ARRAY", items: STRATEGY_ITEM_SCHEMA },
    decision: {
      type: "OBJECT",
      properties: {
        goals: { type: "ARRAY", items: { type: "STRING" } },
        priorities: { type: "ARRAY", items: { type: "STRING" } },
        constraints: { type: "ARRAY", items: { type: "STRING" } },
        options: { type: "ARRAY", items: DECISION_OPTION_SCHEMA },
      },
      required: ["goals", "priorities", "constraints", "options"],
    },
    recovery: {
      type: "OBJECT",
      properties: {
        whatHappened: { type: "STRING" },
        whatMattersNow: { type: "ARRAY", items: { type: "STRING" } },
        whatCanStillBeFixed: { type: "ARRAY", items: { type: "STRING" } },
        immediateActions: { type: "ARRAY", items: { type: "STRING" } },
        whatToSay: { type: "ARRAY", items: { type: "STRING" } },
        whatNotToDo: { type: "ARRAY", items: { type: "STRING" } },
        nextSteps: { type: "ARRAY", items: { type: "STRING" } },
      },
      required: ["whatHappened", "whatMattersNow", "whatCanStillBeFixed", "immediateActions", "whatToSay", "whatNotToDo", "nextSteps"],
    },
  },
  required: [
    "categories", "primaryCategory", "emotionalTone", "emotionalIntensity", "stakes",
    "needsResearch", "needsClarification", "clarifyingQuestions",
    "isScamLike", "isRecoveryMode", "isHighStakes",
    "summary", "whatWeKnow", "whatWeDontKnow", "nextStep",
    "strategies", "decision", "recovery",
  ],
};

interface GeminiTurnShape {
  categories: Category[];
  primaryCategory: Category;
  emotionalTone: EmotionalContext["tone"];
  emotionalIntensity: number;
  stakes: EmotionalContext["stakes"];
  needsResearch: boolean;
  researchReason?: string;
  needsClarification: boolean;
  clarifyingQuestions: string[];
  isScamLike: boolean;
  isRecoveryMode: boolean;
  isHighStakes: boolean;
  summary: string;
  whatWeKnow: string[];
  whatWeDontKnow: string[];
  nextStep: string;
  strategies: Omit<Strategy, "id">[];
  decision: {
    goals: string[];
    priorities: string[];
    constraints: string[];
    options: Omit<DecisionOption, "id">[];
  };
  recovery: RecoveryPlan;
}

export async function runGeminiTurn(input: string): Promise<AgentTurn> {
  const apiKey = process.env.GEMINI_API_KEY as string;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: input }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.6,
      },
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status}: ${errText.slice(0, 400)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Gemini returned no usable content.");
  }

  const parsed = JSON.parse(text) as GeminiTurnShape;

  const classification: ClassificationResult = {
    categories: parsed.categories,
    primaryCategory: parsed.primaryCategory,
    emotional: { tone: parsed.emotionalTone, intensity: parsed.emotionalIntensity, stakes: parsed.stakes },
    needsResearch: parsed.needsResearch,
    researchReason: parsed.researchReason || undefined,
    needsClarification: parsed.needsClarification,
    clarifyingQuestions: parsed.clarifyingQuestions,
    isScamLike: parsed.isScamLike,
    isRecoveryMode: parsed.isRecoveryMode,
    isHighStakes: parsed.isHighStakes,
    summary: parsed.summary,
    whatWeKnow: parsed.whatWeKnow,
    whatWeDontKnow: parsed.whatWeDontKnow,
  };

  const turn: AgentTurn = {
    id: `turn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    userInput: input,
    classification,
    nextStep: parsed.nextStep,
  };

  if (classification.isScamLike) {
    turn.scam = analyzeScam(input);
  } else if (classification.isRecoveryMode) {
    turn.recovery = parsed.recovery;
  } else {
    turn.strategies = parsed.strategies.map((s, i) => ({ ...s, id: `strategy-${i}` }));
    if (classification.primaryCategory === "decision" && parsed.decision.options.length > 0) {
      const frame: DecisionFrame = {
        goals: parsed.decision.goals,
        priorities: parsed.decision.priorities,
        constraints: parsed.decision.constraints,
        options: parsed.decision.options.map((o, i) => ({ ...o, id: String.fromCharCode(97 + i) })),
      };
      turn.decisionFrame = frame;
    }
  }

  if (classification.needsResearch) {
    turn.research = await runResearch(input);
  }

  return turn;
}
