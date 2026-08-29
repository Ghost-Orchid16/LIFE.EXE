import type { RoleplayRole, RoleplayScores } from "@/lib/types";

export const ROLEPLAY_ROLES: RoleplayRole[] = [
  { id: "friend", label: "Friend", description: "A close friend reacting the way a friend might." },
  { id: "partner", label: "Partner", description: "A romantic partner in the conversation." },
  { id: "parent", label: "Parent", description: "A parent with their own expectations and worries." },
  { id: "teammate", label: "Teammate", description: "A peer you work or collaborate with." },
  { id: "manager", label: "Manager", description: "Your manager, focused on outcomes and clarity." },
  { id: "coworker", label: "Coworker", description: "A colleague who may be defensive or receptive." },
  { id: "interviewer", label: "Interviewer", description: "An interviewer assessing your responses." },
  { id: "teacher", label: "Teacher", description: "A teacher or professor you need to approach." },
];

const OPENING_LINES: Record<string, string[]> = {
  friend: ["Hey, what's up? You said you wanted to talk about something.", "I'm listening — what's going on?"],
  partner: ["Okay... you sound serious. What is it?", "Hey, is everything alright? You wanted to talk."],
  parent: ["What's on your mind?", "You said this was important, so I'm here."],
  teammate: ["Sure, what did you want to discuss?", "Go ahead, I've got a few minutes."],
  manager: ["Thanks for setting this up — what's on your mind?", "I've got 15 minutes, what would you like to cover?"],
  coworker: ["Hey, you wanted to chat?", "What's up?"],
  interviewer: ["Thanks for coming in. Tell me a bit about yourself.", "Let's get started — walk me through your background."],
  teacher: ["Come in, what did you want to discuss?", "Yes, how can I help?"],
};

const REACTIVE_PATTERNS: { test: RegExp; responses: string[] }[] = [
  { test: /sorry|apologi/i, responses: ["I appreciate you saying that. What happens next, though?", "Okay — I hear the apology. What are you going to do differently?"] },
  { test: /need|want|would like/i, responses: ["Okay, that's fair. Why does that matter to you?", "I can understand that. What would that look like in practice?"] },
  { test: /feel|felt/i, responses: ["I didn't realize it came across that way. Can you say more?", "That's helpful to know — I wasn't seeing it from that angle."] },
  { test: /boundary|can't keep|won't be able/i, responses: ["Okay. I might need a moment to process that, but I hear you.", "That's a clear line — I respect that, even if it's not what I hoped."] },
  { test: /\?$/, responses: ["That's a fair question. Honestly, I hadn't thought about it that directly.", "Let me think about that for a second... I'd say it depends."] },
];

const DEFAULT_RESPONSES = [
  "Okay, I'm following. Go on.",
  "Hm. I wasn't expecting that, but okay.",
  "That's a lot to take in — give me a second.",
  "I see what you mean, actually.",
];

export function roleplayOpening(roleId: string): string {
  const lines = OPENING_LINES[roleId] ?? ["Okay, I'm listening."];
  return lines[Math.floor(Math.random() * lines.length)];
}

export function roleplayReply(roleId: string, userMessage: string, turnIndex: number): string {
  for (const pattern of REACTIVE_PATTERNS) {
    if (pattern.test.test(userMessage)) {
      return pattern.responses[turnIndex % pattern.responses.length];
    }
  }
  return DEFAULT_RESPONSES[turnIndex % DEFAULT_RESPONSES.length];
}

export function scoreConversation(userMessages: string[]): RoleplayScores {
  const joined = userMessages.join(" ").toLowerCase();
  const words = joined.split(/\s+/).filter(Boolean);
  const avgLen = userMessages.length ? words.length / userMessages.length : 0;

  const clarity = clamp(0.4 + Math.min(0.5, avgLen / 40) - (joined.match(/kind of|sort of|maybe|i guess/g)?.length ?? 0) * 0.05);
  const assertiveness = clamp(0.3 + (joined.match(/i need|i want|i've decided|i won't|i can't/g)?.length ?? 0) * 0.15);
  const empathy = clamp(0.3 + (joined.match(/i understand|i hear you|i know this is|appreciate/g)?.length ?? 0) * 0.15);
  const escalation = clamp(1 - (joined.match(/always|never|you always|you never|unbelievable|ridiculous/g)?.length ?? 0) * 0.25);
  const goalAlignment = clamp((clarity + assertiveness) / 2);

  return {
    clarity: round(clarity),
    assertiveness: round(assertiveness),
    empathy: round(empathy),
    escalation: round(escalation),
    goalAlignment: round(goalAlignment),
  };
}

function clamp(n: number): number {
  return Math.max(0.05, Math.min(1, n));
}
function round(n: number): number {
  return Math.round(n * 100);
}

export function feedbackFor(scores: RoleplayScores): string[] {
  const notes: string[] = [];
  if (scores.clarity < 60) notes.push("Try stating your main point in one direct sentence before explaining.");
  if (scores.assertiveness < 60) notes.push("You can be clearer about what you actually need, not just how you feel.");
  if (scores.empathy < 60) notes.push("Acknowledging their side briefly can lower defensiveness.");
  if (scores.escalation < 60) notes.push("Watch for absolute language ('always', 'never') — it tends to escalate conversations.");
  if (notes.length === 0) notes.push("Solid, balanced conversation — clear, respectful, and goal-oriented.");
  return notes;
}
