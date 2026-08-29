import type {
  Category,
  ClassificationResult,
  DecisionFrame,
  DecisionOption,
  EmotionalContext,
  RecoveryPlan,
  ScamAnalysis,
  RiskSignal,
  Strategy,
  RiskLevel,
} from "@/lib/types";
import {
  CATEGORY_KEYWORDS,
  RESEARCH_TRIGGER_KEYWORDS,
  RECOVERY_KEYWORDS,
  EMOTION_WORDS,
} from "@/lib/agent/keywords";

// ---------------------------------------------------------------------------
// LIFE.EXE reasoning engine.
//
// No external model key is configured in this environment, so this module
// implements a transparent, deterministic heuristic pipeline that mirrors the
// staged agent workflow (understand -> context -> clarify -> research ->
// explore -> simulate -> decide -> act). It is intentionally isolated behind
// plain functions so a real model call (e.g. the Anthropic Messages API,
// server-side only, reading process.env.AI_API_KEY) can replace the body of
// `classifySituation` / `generateStrategies` without touching call sites.
// ---------------------------------------------------------------------------

function norm(text: string): string {
  return text.toLowerCase();
}

function scoreCategories(input: string): Record<Category, number> {
  const n = norm(input);
  const scores = {} as Record<Category, number>;
  (Object.keys(CATEGORY_KEYWORDS) as Category[]).forEach((cat) => {
    let score = 0;
    for (const kw of CATEGORY_KEYWORDS[cat]) {
      if (n.includes(kw)) score += kw.split(" ").length >= 2 ? 2 : 1;
    }
    scores[cat] = score;
  });
  return scores;
}

function detectEmotion(input: string): EmotionalContext {
  const n = norm(input);
  let best: EmotionalContext["tone"] = "calm";
  let bestScore = 0;
  (Object.keys(EMOTION_WORDS) as EmotionalContext["tone"][]).forEach((tone) => {
    const words = EMOTION_WORDS[tone];
    const score = words.filter((w) => n.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = tone;
    }
  });
  const exclam = (input.match(/!/g) || []).length;
  const intensity = Math.min(1, bestScore * 0.25 + exclam * 0.1 + (input.length > 400 ? 0.2 : 0));
  const highStakesWords = ["fired", "expelled", "breakup", "divorce", "diagnosed", "arrested", "eviction", "suicidal", "hospital"];
  const stakes: EmotionalContext["stakes"] = highStakesWords.some((w) => n.includes(w))
    ? "high"
    : bestScore >= 2
    ? "medium"
    : "low";
  return { tone: best, intensity: Math.max(0.15, intensity), stakes };
}

function detectResearchNeed(input: string, categories: Category[]): { needs: boolean; reason?: string } {
  const n = norm(input);
  const hasTrigger = RESEARCH_TRIGGER_KEYWORDS.some((kw) => n.includes(kw));
  const isFactualCategory = categories.some((c) =>
    ["purchases", "current_events", "technology", "education", "travel", "money"].includes(c)
  );
  if (hasTrigger && isFactualCategory) {
    return { needs: true, reason: "This involves current prices, specs, requirements, or external facts that can change over time." };
  }
  if (hasTrigger) {
    return { needs: true, reason: "This references current or time-sensitive information rather than something purely personal." };
  }
  return { needs: false };
}

function detectHighStakesSafety(input: string): boolean {
  const n = norm(input);
  const flags = [
    "suicidal", "want to die", "self harm", "hospital", "diagnosed", "legal action",
    "lawsuit", "arrested", "medical emergency", "abuse", "domestic violence",
  ];
  return flags.some((f) => n.includes(f));
}

function buildClarifyingQuestions(primary: Category, input: string): string[] {
  const n = norm(input);
  const base: Record<Category, string[]> = {
    dating: ["What have they actually said or done, versus what you're inferring?", "What outcome would feel good here, regardless of how they respond?"],
    relationships: ["How long has this been building, and has it come up before?", "What do you want to be true a month from now?"],
    friendship: ["Has anything changed recently on either side?", "Do you want to repair this, get clarity, or just process it?"],
    family: ["Whose expectations are you weighing most heavily — theirs or your own?", "What's the actual worst-case if you go against what they want?"],
    social: ["Is this about how you felt, or about what actually happened?", "Who else was involved, and does it need to be resolved with them directly?"],
    communication: ["What's the one thing you need them to understand?", "Is this a one-time conversation or an ongoing pattern?"],
    conflict: ["What triggered this most recently?", "Do you want to de-escalate, resolve it, or set a boundary?"],
    career: ["What matters more right now: stability, growth, or meaning?", "What's the real deadline you're working with?"],
    education: ["Is this reversible later, or a one-shot decision?", "What's driving this more — interest or expectations from others?"],
    money: ["What's the actual number you're working with?", "What happens if you wait instead of deciding now?"],
    purchases: ["What's your budget ceiling?", "What will you mainly use it for?"],
    work: ["Has this been raised before, informally or formally?", "What's your relationship with this person otherwise?"],
    decision: ["What are the options, concretely?", "What matters most to you in this choice — and what matters least?"],
    productivity: ["Is this about motivation, time, or unclear priorities?", "What does 'done' actually look like?"],
    transition: ["What's pulling you toward this change?", "What would you be walking away from?"],
    travel: ["What's fixed (dates, budget) and what's flexible?", "Solo or with others?"],
    technology: ["What's the primary use case?", "Is budget or capability the bigger constraint?"],
    current_events: ["What decision does this information actually feed into?", "How current does this need to be?"],
    scam: [],
    other: ["What outcome are you hoping for here?", "What's the piece you're most unsure about?"],
  };
  const qs = base[primary] ?? base.other;
  if (n.split(" ").length < 12) {
    return ["Can you tell me a bit more about the situation?", ...qs.slice(0, 1)];
  }
  return qs;
}

export function classifySituation(input: string): ClassificationResult {
  const scores = scoreCategories(input);
  const ranked = (Object.entries(scores) as [Category, number][])
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);

  const categories = ranked.length > 0 ? ranked.slice(0, 3).map(([c]) => c) : (["other"] as Category[]);
  const primaryCategory = categories[0];
  const isScamLike = categories.includes("scam") || (scores.scam ?? 0) >= 2;
  const isRecoveryMode = RECOVERY_KEYWORDS.some((k) => norm(input).includes(k));
  const emotional = detectEmotion(input);
  const research = detectResearchNeed(input, categories);
  const isHighStakes = detectHighStakesSafety(input) || emotional.stakes === "high";

  const needsClarification = input.trim().split(/\s+/).length < 25 && !isScamLike;

  const whatWeKnow: string[] = [];
  const whatWeDontKnow: string[] = [];
  whatWeKnow.push(`You're dealing with something involving ${categories.map((c) => c.replace("_", " ")).join(" + ")}.`);
  if (emotional.tone !== "calm") {
    whatWeKnow.push(`There's a ${emotional.tone} undertone to how you described it.`);
  }
  whatWeDontKnow.push("The full context of the other people involved, beyond what you've shared.");
  if (research.needs) whatWeDontKnow.push("Any current, real-world facts that haven't been checked yet.");

  const summary = summarize(input, primaryCategory);

  return {
    categories,
    primaryCategory,
    emotional,
    needsResearch: research.needs,
    researchReason: research.reason,
    needsClarification,
    clarifyingQuestions: buildClarifyingQuestions(primaryCategory, input),
    isScamLike,
    isRecoveryMode,
    isHighStakes,
    summary,
    whatWeKnow,
    whatWeDontKnow,
  };
}

function summarize(input: string, category: Category): string {
  const trimmed = input.trim();
  const short = trimmed.length > 140 ? trimmed.slice(0, 137) + "…" : trimmed;
  const labels: Record<Category, string> = {
    dating: "a dating / romantic-interest situation",
    relationships: "a relationship situation",
    friendship: "a friendship situation",
    family: "a family situation",
    social: "a social situation",
    communication: "a conversation you need to have",
    conflict: "a conflict",
    career: "a career decision",
    education: "an education-related decision",
    money: "a money question",
    purchases: "a purchase decision",
    work: "a workplace situation",
    decision: "a decision between options",
    productivity: "a productivity / focus challenge",
    transition: "a life transition",
    travel: "a travel question",
    technology: "a technology question",
    current_events: "something tied to current information",
    scam: "a potentially suspicious message",
    other: "a situation that doesn't fit a neat category",
  };
  return `This reads as ${labels[category]}: "${short}"`;
}

// ---------------------------------------------------------------------------
// Strategy generation
// ---------------------------------------------------------------------------

const STRATEGY_TEMPLATES: Record<string, (input: string, category: Category) => Strategy[]> = {
  default: (_input, category) => [
    {
      id: "keep-the-peace",
      title: "Keep the Peace",
      tag: "01 — LOW CONFLICT",
      approach: "Prioritize the relationship and avoid unnecessary friction while still moving forward.",
      advantages: ["Preserves the relationship", "Lower emotional risk", "Buys you time to think"],
      risks: ["The underlying issue may resurface", "Can read as avoidance if overused"],
      whenItMakesSense: "When the relationship matters more than winning this particular moment.",
      exampleAction: "Acknowledge their perspective first, then gently name what you need.",
    },
    {
      id: "set-a-boundary",
      title: "Set a Boundary",
      tag: "02 — BALANCED",
      approach: "Be clear about your limits while staying respectful and open to their side.",
      advantages: ["Protects your interests", "Still leaves room for dialogue", "Sustainable long-term"],
      risks: ["Might cause short-term discomfort", "Requires follow-through to be credible"],
      whenItMakesSense: "When you need this to change, not just feel better once.",
      exampleAction: "State the boundary plainly, explain the reason briefly, and stop justifying it.",
    },
    {
      id: "be-direct",
      title: "Be Direct",
      tag: "03 — CLEAR & FIRM",
      approach: "Say exactly what's true for you without softening it, and let the chips fall.",
      advantages: ["No ambiguity", "Respects everyone's time", "Fastest path to resolution"],
      risks: ["Can feel abrupt if trust is low", "Less room to gauge reaction first"],
      whenItMakesSense: `When ${category === "work" ? "professional stakes" : "the situation"} require clarity more than comfort.`,
      exampleAction: "Lead with the core message in the first sentence, then explain.",
    },
  ],
};

export function generateStrategies(input: string, classification: ClassificationResult): Strategy[] {
  const gen = STRATEGY_TEMPLATES[classification.primaryCategory] ?? STRATEGY_TEMPLATES.default;
  return gen(input, classification.primaryCategory);
}

// ---------------------------------------------------------------------------
// Decision framing
// ---------------------------------------------------------------------------

function extractOptions(input: string): string[] {
  const n = input;
  const patterns = [
    /between (.+?) and (.+?)(\.|$)/i,
    /(option a|first one)[:,]?\s*(.+?)(?:\.|$)/i,
  ];
  for (const p of patterns) {
    const m = n.match(p);
    if (m && m[1] && m[2]) return [m[1].trim(), m[2].trim()];
  }
  const orSplit = n.split(/\bor\b/i);
  if (orSplit.length >= 2) {
    return [orSplit[0].slice(-60).trim(), orSplit[1].slice(0, 60).trim()];
  }
  return ["Option A", "Option B"];
}

export function buildDecisionFrame(input: string, classification: ClassificationResult): DecisionFrame {
  const [a, b] = extractOptions(input);
  const options: DecisionOption[] = [
    {
      id: "a",
      label: a.length > 3 ? capitalize(a) : "Option A",
      benefits: ["Aligns with what you described wanting first", "Often the more familiar / lower-risk path"],
      risks: ["May close off the other path", "Could involve a near-term trade-off"],
      tradeoffs: ["Short-term comfort vs. long-term upside is the core tension"],
      shortTerm: "Likely feels more settled immediately.",
      longTerm: "Depends heavily on how your priorities evolve.",
    },
    {
      id: "b",
      label: b.length > 3 ? capitalize(b) : "Option B",
      benefits: ["Opens a path you're clearly still drawn to", "Could pay off more if it works out"],
      risks: ["More uncertainty in the near term", "Requires more active effort to pursue"],
      tradeoffs: ["Higher potential upside for higher short-term uncertainty"],
      shortTerm: "Likely feels less settled at first.",
      longTerm: "Could be the better fit if it aligns with your longer-term goals.",
    },
  ];
  return {
    goals: ["Make a decision you won't regret in 6 months", "Reduce uncertainty enough to act"],
    priorities: classification.emotional.stakes === "high" ? ["Stability", "Long-term fit"] : ["Growth", "Personal fit"],
    constraints: ["Limited information about how things will actually unfold", "Time pressure to decide"],
    options,
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function whatIfScenario(option: DecisionOption): string {
  return `Hypothetically, if you chose "${option.label}": in the short term, ${option.shortTerm.toLowerCase()} Over time, ${option.longTerm.toLowerCase()} Key risks to watch for: ${option.risks.join("; ")}.`;
}

// ---------------------------------------------------------------------------
// ScamSense
// ---------------------------------------------------------------------------

const SCAM_SIGNAL_DEFS: { id: string; label: string; weight: number; test: (n: string) => boolean; explanation: string }[] = [
  { id: "urgency", label: "Artificial urgency", weight: 2, test: (n) => /urgent|immediately|right now|expires today|act now|final notice/.test(n), explanation: "Pressure to act fast is a classic manipulation tactic that prevents careful thinking." },
  { id: "otp", label: "Requests OTP / verification code", weight: 4, test: (n) => /otp|one[- ]time password|verification code|security code/.test(n), explanation: "No legitimate service ever needs you to share a one-time code with someone else." },
  { id: "payment", label: "Unusual payment request", weight: 3, test: (n) => /gift card|wire transfer|crypto|bitcoin|western union|advance fee|processing fee|send money/.test(n), explanation: "Requests for gift cards, crypto, or wire transfers are hard to trace and reverse — a scammer favorite." },
  { id: "impersonation", label: "Possible impersonation", weight: 3, test: (n) => /bank|irs|tax|government|amazon|microsoft|support team|official/.test(n), explanation: "Messages claiming to be from an authority or company can be spoofed convincingly." },
  { id: "credentials", label: "Requests credentials", weight: 3, test: (n) => /password|login|verify your account|confirm your identity|social security/.test(n), explanation: "Real organizations don't ask you to confirm passwords or full ID numbers via message." },
  { id: "link", label: "Suspicious link", weight: 2, test: (n) => /https?:\/\/|bit\.ly|click here|click this link/.test(n), explanation: "Shortened or unfamiliar links can hide malicious destinations." },
  { id: "too_good", label: "Unrealistic promise", weight: 3, test: (n) => /won|winner|lottery|prize|guaranteed return|free money|easy money/.test(n), explanation: "Offers that sound too good to be true almost always are." },
  { id: "job_offer", label: "Unsolicited job/income offer", weight: 2, test: (n) => /work from home|earn \$|no experience needed|hiring immediately|be your own boss/.test(n), explanation: "Vague, high-pay, low-effort job offers are a common scam pattern." },
];

export function analyzeScam(input: string): ScamAnalysis {
  const n = norm(input);
  const signals: RiskSignal[] = SCAM_SIGNAL_DEFS.map((def) => ({
    id: def.id,
    label: def.label,
    detected: def.test(n),
    weight: def.weight,
    explanation: def.explanation,
  }));
  const score = signals.filter((s) => s.detected).reduce((acc, s) => acc + s.weight, 0);
  let riskLevel: RiskLevel = "LOW";
  if (score >= 9) riskLevel = "CRITICAL";
  else if (score >= 6) riskLevel = "HIGH";
  else if (score >= 3) riskLevel = "MEDIUM";

  const detectedCount = signals.filter((s) => s.detected).length;
  const explanation =
    detectedCount === 0
      ? "No strong scam signals were detected in what you pasted, but that doesn't guarantee it's safe — stay cautious with anything requesting money, codes, or personal info."
      : `${detectedCount} known scam signal${detectedCount > 1 ? "s" : ""} detected. These patterns are commonly used to create pressure and bypass careful thinking.`;

  const nextSteps =
    riskLevel === "LOW"
      ? ["Verify the sender through an official, separate channel before acting.", "Don't click links or share info until you're sure."]
      : riskLevel === "MEDIUM"
      ? ["Do not click any links or reply with personal information.", "Verify independently using an official website or phone number.", "When in doubt, don't engage."]
      : [
          "Do not click links, reply, share codes, or send any payment.",
          "Block and report the sender through the platform you received this on.",
          "If money or credentials were already shared, contact your bank / the official provider immediately.",
          "Consider reporting to your local cybercrime authority.",
        ];

  return { riskLevel, score, signals, explanation, nextSteps };
}

// ---------------------------------------------------------------------------
// Recovery / damage control mode
// ---------------------------------------------------------------------------

export function buildRecoveryPlan(input: string, classification: ClassificationResult): RecoveryPlan {
  return {
    whatHappened: `From what you shared: ${input.trim().slice(0, 200)}${input.length > 200 ? "…" : ""}`,
    whatMattersNow: [
      "Limiting any further damage before fixing the original issue",
      "Being honest and clear with anyone affected",
    ],
    whatCanStillBeFixed: [
      "Most of this is likely recoverable with a prompt, direct response",
      classification.primaryCategory === "work" ? "Your reputation is shaped more by how you handle this than the mistake itself" : "How you respond now matters more than the original mistake",
    ],
    immediateActions: [
      "Take one clear action in the next hour rather than waiting for the perfect fix",
      "If someone needs to be told, tell them directly rather than letting it surface on its own",
    ],
    whatToSay: [
      "Acknowledge what happened plainly, without over-explaining or over-apologizing.",
      "State what you're doing about it, concretely.",
    ],
    whatNotToDo: [
      "Don't over-apologize to the point it becomes about managing your own guilt",
      "Don't go silent — silence usually makes it worse",
      "Don't make a bigger promise than you can keep to compensate",
    ],
    nextSteps: [
      "Follow up once you've taken the immediate action",
      "Note what you'd do differently next time, briefly — then let it go",
    ],
  };
}

export function nextStepFor(classification: ClassificationResult): string {
  if (classification.isScamLike) return "Follow the safe next steps above before doing anything else with this message.";
  if (classification.isRecoveryMode) return "Take the immediate action above, then follow up once it's done.";
  if (classification.needsClarification) return "Answer a couple of clarifying questions so the guidance fits your actual situation.";
  if (classification.needsResearch) return "Let LIFE.EXE check current information relevant to this.";
  if (classification.primaryCategory === "decision") return "Open the Decision Simulator to compare your options.";
  return "Review 3 possible strategies and pick a direction.";
}
