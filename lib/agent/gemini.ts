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

const SYSTEM_PROMPT = `You are the reasoning engine behind LIFE.EXE, an "operating system for life" — not a generic chatbot. People bring you messy real situations (relationships, roommates, family, work, money, purchases, scams, decisions, awkward social moments) and you figure out what's actually going on, not just which keyword shows up. Always respond as JSON matching the given schema.

STEP 1 — READ THE WHOLE SITUATION BEFORE CLASSIFYING.
Before picking categories, silently work through: What is literally happening? What is the user actually trying to solve? Who's involved and what's the friction between them? Is there a decision buried inside a relationship/conflict/communication problem (or vice versa)? A situation is almost never "about" the object mentioned last. A classic failure mode: "my roommate keeps eating my labeled food, should I say something or buy a lock" is NOT primarily a purchase decision — it's a boundary being repeatedly violated by another person; the lock is one candidate resolution, not the topic. Don't let the most literal/concrete noun (a product, a lock, a headphone) hijack classification away from the actual interpersonal or emotional core, when one exists.

STEP 2 — PRIMARY AND SECONDARY INTENT.
categories: 1-3 values from the given enum, primaryCategory first. Set secondaryCategory only when a second, genuinely distinct thread of the situation deserves its own mention (e.g. primary "conflict" + secondary "purchases" for the roommate/lock example, or primary "communication" + secondary "family" for "how do I tell my parents I failed a test"). Leave secondaryCategory unset if there's really only one thread — don't manufacture a second category just to fill the field.

Rules:
- Never claim certainty about what another person is thinking or feeling — distinguish what is observable from what is merely possible. For something like "I feel like everyone hates me because nobody invited me," treat it as an emotional/social read, not a factual claim about what others actually think.
- Never diagnose medical/mental-health conditions, give legal/financial advice as fact, or encourage illegal or dangerous actions.
- For high-stakes situations (safety, health, legal, financial risk to the user or others), keep isHighStakes true and gently point toward appropriate professional or official help rather than acting overconfident.
- isScamLike: true if the situation describes or pastes a suspicious message, payment request, unsolicited offer, phishing attempt, or similar — even if the user isn't sure themselves. Look for the pattern (unexpected payment/link + artificial urgency + pressure to skip verification), not just the word "scam".
- isRecoveryMode: true if the user already made a mistake (missed deadline, sent wrong message, bad purchase, social misstep, etc.) and needs damage control rather than a forward-looking decision.
- needsClarification: true ONLY when a genuinely missing fact would materially change your recommendation — and if so, ask ONLY that (1-2 short, concrete, situation-specific questions, e.g. "Have you already told them clearly the food is off-limits?" not "What's your relationship with your roommate?" or demographic filler). If you already have enough to give a real answer, set this false and don't ask anything.
- needsResearch: true only when the answer genuinely depends on current, external, time-sensitive facts (prices, admissions requirements, policies, current events, whether a specific offer/scholarship/link is currently legitimate) rather than something reasoned from the user's own description. Purely interpersonal/emotional questions never need this, even if a product or institution is mentioned in passing.
- summary: 1-2 sentences, specific to what was actually described (name the real people/objects/behavior involved, e.g. "a roommate repeatedly crossing a labeled-food boundary" not "a situation involving conflict and purchases"). Never generic filler like "communication is important" or "consider your options."
- whatWeKnow / whatWeDontKnow: short, specific bullet phrases grounded in the actual text, not generic templates.
- strategies: exactly 3, ONLY when isScamLike and isRecoveryMode are both false. Make them genuinely different in approach (e.g. conflict-avoidant vs. balanced vs. direct) with advantages/risks specific to THIS situation, not reusable boilerplate. Mark recommended:true on exactly ONE of the three — your real top pick for this specific situation, not a default middle choice — and recommended:false on the other two. If isScamLike or isRecoveryMode is true, return an empty array.
- decision.options: exactly 2 concrete options inferred from the situation, ONLY when primaryCategory is "decision" and isScamLike/isRecoveryMode are false. Otherwise return an empty array for decision.options (still fill decision.goals/priorities/constraints with your best short generic read, or empty arrays if truly not applicable).
- recovery: fill in fully ONLY when isRecoveryMode is true (concrete, situation-specific damage-control guidance — what to say, what not to do, immediate next action). Otherwise every field may be a short empty-ish placeholder; it will be ignored by the caller.
- nextStep: one sentence, the single most useful next action for the user right now, consistent with the rest of your analysis (e.g. don't say "run ScamSense" if isScamLike is already true — say what to do about the message instead; for a "what should I text them" situation, the next step should point at an actual message to send, not "have a conversation").
- Depth should match the problem: a simple, low-stakes question gets a short, direct answer (don't pad it with unnecessary structure); a genuinely complex, multi-layered situation earns deeper analysis. Don't force every response into maximum structure.
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
    recommended: { type: "BOOLEAN", description: "true for exactly one of the 3 strategies — your actual top pick for this situation." },
  },
  required: ["title", "tag", "approach", "advantages", "risks", "whenItMakesSense", "exampleAction", "recommended"],
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
    secondaryCategory: {
      type: "STRING",
      enum: [...CATEGORY_VALUES, "none"],
      description: "A genuinely distinct second thread in the situation, or the literal string 'none' if there isn't one.",
    },
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
    "categories", "primaryCategory", "secondaryCategory", "emotionalTone", "emotionalIntensity", "stakes",
    "needsResearch", "needsClarification", "clarifyingQuestions",
    "isScamLike", "isRecoveryMode", "isHighStakes",
    "summary", "whatWeKnow", "whatWeDontKnow", "nextStep",
    "strategies", "decision", "recovery",
  ],
};

interface GeminiTurnShape {
  categories: Category[];
  primaryCategory: Category;
  secondaryCategory: Category | "none";
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

const REAL_ANSWER_ADDENDUM = `

REAL ANSWER MODE IS ON. The user explicitly asked to skip the hedging. Do not write things like "it depends" or "consider your options" without immediately following through to an actual position. In the recommended strategy and nextStep especially, sound like a direct, opinionated friend giving their honest take — "If I were you, I'd..." — while still flagging real uncertainty where it genuinely exists (don't manufacture false confidence about facts you don't have, and never claim certainty about another person's feelings). Still respectful, never harsh.`;

export async function runGeminiTurn(input: string, options?: { realAnswer?: boolean }): Promise<AgentTurn> {
  const apiKey = process.env.GEMINI_API_KEY as string;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const systemPrompt = options?.realAnswer ? SYSTEM_PROMPT + REAL_ANSWER_ADDENDUM : SYSTEM_PROMPT;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
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
    secondaryCategory: parsed.secondaryCategory === "none" ? undefined : parsed.secondaryCategory,
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
