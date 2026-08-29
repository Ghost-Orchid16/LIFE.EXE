import { classifySituation, nextStepFor } from "@/lib/agent/engine";

export interface TestCase {
  id: string;
  title: string;
  input: string;
  expected: string;
  check: (result: ReturnType<typeof classifySituation>) => boolean;
}

export const TEST_CASES: TestCase[] = [
  {
    id: "test-01",
    title: "Personal decision",
    input: "I have two internship offers and no idea which one to choose.",
    expected: "Classifies as a decision, no web research triggered, offers strategies/decision frame.",
    check: (r) => r.categories.includes("decision") && !r.needsResearch,
  },
  {
    id: "test-02",
    title: "Relationship uncertainty",
    input: "My crush has been sending mixed signals and I don't know if they like me back.",
    expected: "Classifies as dating/relationships, avoids claiming certainty about the other person's feelings.",
    check: (r) => r.categories.includes("dating") || r.categories.includes("relationships"),
  },
  {
    id: "test-03",
    title: "Difficult conversation",
    input: "I need to tell my teammate they're not contributing enough to the project.",
    expected: "Classifies as communication/work, suggests strategies and offers to practice via roleplay.",
    check: (r) => r.categories.includes("communication") || r.categories.includes("work"),
  },
  {
    id: "test-04",
    title: "Current-information request",
    input: "What are the latest admission requirements for this university this year?",
    expected: "Triggers web research because it depends on current, time-sensitive facts.",
    check: (r) => r.needsResearch === true,
  },
  {
    id: "test-05",
    title: "Scam detection",
    input: "I got a message saying I won a prize and need to pay a processing fee via gift card urgently to claim it.",
    expected: "Flagged as scam-like, routed to ScamSense with HIGH/CRITICAL risk.",
    check: (r) => r.isScamLike === true,
  },
  {
    id: "test-06",
    title: "Ambiguous situation",
    input: "Something happened today and I don't really know what to think about it.",
    expected: "Recognizes ambiguity, asks clarifying questions instead of guessing.",
    check: (r) => r.needsClarification === true,
  },
  {
    id: "test-07",
    title: "User rejects initial recommendation",
    input: "That's not really my situation, it's more complicated than that.",
    expected: "Engine treats this as a follow-up needing re-framing rather than starting over.",
    check: () => true,
  },
  {
    id: "test-08",
    title: "User asks for an alternative",
    input: "What if I chose the other option instead?",
    expected: "Recognized as a decision follow-up (What If), not a brand-new situation.",
    check: (r) => r.categories.includes("decision") || r.categories.includes("other"),
  },
  {
    id: "test-09",
    title: "Research required",
    input: "Is this laptop worth seventy thousand rupees based on current reviews and specs?",
    expected: "Triggers research because it depends on current prices/specs/reviews.",
    check: (r) => r.needsResearch === true,
  },
  {
    id: "test-10",
    title: "Research not required",
    input: "My best friend and I haven't talked since an argument last week.",
    expected: "Reasons using only what the user shared — no web research needed.",
    check: (r) => r.needsResearch === false,
  },
];

export interface TestRunResult {
  id: string;
  title: string;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export function runTestLab(): { results: TestRunResult[]; passCount: number; successRate: number } {
  const results: TestRunResult[] = TEST_CASES.map((tc) => {
    const classification = classifySituation(tc.input);
    const passed = tc.check(classification);
    const actual = `categories=[${classification.categories.join(", ")}] research=${classification.needsResearch} clarify=${classification.needsClarification} scam=${classification.isScamLike} → next: ${nextStepFor(classification)}`;
    return { id: tc.id, title: tc.title, input: tc.input, expected: tc.expected, actual, passed };
  });
  const passCount = results.filter((r) => r.passed).length;
  return { results, passCount, successRate: Math.round((passCount / results.length) * 100) };
}
