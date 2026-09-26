import type { ChatMessage, LifeResponse } from "../../shared/contract.ts";
import {
  CLARIFY_RESPONSE,
  CRISIS_FOLLOW_UP,
  CRISIS_PATTERNS,
  CRISIS_RESPONSE,
  FALLBACK_REPLY,
  GENERAL_SCENARIO,
  GENERIC_REPLIES,
  SCENARIOS,
  composeReply,
  type DemoReply,
  type DemoScenario,
} from "./content.ts";

// Checked in order, after the scenario's own follow-ups. Order resolves overlaps such as
// "What should I say first?" (wording, not first step) and "What if it doesn't work out?" (a what-if).
const INTENTS: ReadonlyArray<{ match: RegExp; reply: (scenario: DemoScenario) => DemoReply }> = [
  {
    match: /\bnot (really |quite |exactly )?what i (meant|mean)\b|\bmisunderst|\bgot it wrong\b|\bthat'?s not it\b/i,
    reply: () => GENERIC_REPLIES.notWhatIMeant,
  },
  {
    match: /\balready tried\b|\btried (that|this|it)\b|\b(didn'?t|did not) work\b|\bit'?s not working\b/i,
    reply: () => GENERIC_REPLIES.alreadyTried,
  },
  {
    match: /\bwon'?t (agree|accept|approve|like|let)\b|\bwont agree\b|\bdisagree\b|\bdon'?t approve\b|\bagainst it\b|\b(parents?|family|mom|mum|dad)\b/i,
    reply: () => GENERIC_REPLIES.othersDisagree,
  },
  {
    match: /\b(the )?other (option|one|choice|path)\b|\bwhat if i (choose|pick|go with|take)\b/i,
    reply: () => GENERIC_REPLIES.otherOption,
  },
  {
    match: /\bdirect\b|\bblunt\b|\bhonest(ly)?\b|\bjust tell me\b|\bstraight\b|\bwhat would you do\b/i,
    reply: (scenario) => scenario.direct,
  },
  { match: /\bwhat if\b|\bwhat happens if\b|\bgoes badly\b/i, reply: () => GENERIC_REPLIES.whatIf },
  { match: /\b(say|word|wording|phrase|talk to|message|text|ask)\b/i, reply: (scenario) => scenario.words },
  { match: /\b(first|start|begin)\b/i, reply: (scenario) => scenario.firstStep },
  { match: /\bafter (that|this)\b|\bthen what\b|\bwhat('s| is| comes)? next\b/i, reply: () => GENERIC_REPLIES.after },
];

const isCrisis = (text: string) => CRISIS_PATTERNS.some((pattern) => pattern.test(text));

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;

function scoreScenario(scenario: DemoScenario, text: string): number {
  return scenario.keywords.reduce((score, pattern) => score + (pattern.test(text) ? 1 : 0), 0);
}

/** The scenario whose keywords best match the text, or `null` if none match at all. */
export function matchScenario(text: string): DemoScenario | null {
  let best: DemoScenario | null = null;
  let bestScore = 0;
  for (const scenario of SCENARIOS) {
    const score = scoreScenario(scenario, text);
    if (score > bestScore) {
      best = scenario;
      bestScore = score;
    }
  }
  return best;
}

function pickReply(scenario: DemoScenario, text: string): DemoReply {
  const extra = scenario.extras.find(({ match }) => match.test(text));
  if (extra) return extra.reply;
  const intent = INTENTS.find(({ match }) => match.test(text));
  if (intent) return intent.reply(scenario);
  return { ...FALLBACK_REPLY, nextMove: scenario.initial.nextMove };
}

/** The scenario's first answer, opening with a direct reply when the person asked the question it answers. */
function firstAnswer(scenario: DemoScenario, text: string): LifeResponse {
  const { asked, initial } = scenario;
  return asked?.match.test(text) ? { ...initial, answer: asked.answer } : initial;
}

/** Picks the pre-written response that best fits the conversation so far. */
export function buildDemoResponse(messages: ChatMessage[]): LifeResponse {
  const userTexts = messages.flatMap((message) => (message.role === "user" ? [message.content] : []));
  const previousResponses = messages.flatMap((message) => (message.role === "assistant" ? [message.content] : []));
  const latest = userTexts.at(-1) ?? "";
  const previous = previousResponses.at(-1);

  // Safety first, at any point in the conversation.
  const supporting = previous?.title === CRISIS_RESPONSE.title;
  if (isCrisis(latest) || supporting) {
    return previous ? composeReply(CRISIS_FOLLOW_UP, CRISIS_RESPONSE.title) : CRISIS_RESPONSE;
  }

  // First real description of the situation (including right after asking for more detail).
  if (!previous || previous.title === CLARIFY_RESPONSE.title) {
    const scenario = matchScenario(latest);
    if (!scenario && wordCount(latest) < 4) return CLARIFY_RESPONSE;
    return firstAnswer(scenario ?? GENERAL_SCENARIO, latest);
  }

  const scenario = matchScenario(userTexts.join("\n")) ?? GENERAL_SCENARIO;
  return composeReply(pickReply(scenario, latest), scenario.initial.title);
}
