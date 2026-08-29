import type { Category } from "@/lib/types";

// Keyword weighting tables used for internal routing classification.
// This is a transparent, deterministic heuristic engine (no external LLM key
// is configured in this environment) — see lib/agent/engine.ts for how a real
// model call would slot in behind the same interface.

export const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  dating: [
    "crush", "date", "dating", "flirt", "asked me out", "ask her out", "ask him out",
    "romantic", "confess my feelings", "tinder", "hinge", "bumble", "swipe",
  ],
  relationships: [
    "boyfriend", "girlfriend", "partner", "relationship", "breakup", "break up",
    "ex ", "my ex", "marriage", "husband", "wife", "engaged", "cheating", "jealous",
  ],
  friendship: [
    "friend", "best friend", "bestie", "friendship", "hasn't replied", "stopped talking",
    "left me on read", "ghosted me", "group chat",
  ],
  family: [
    "parents", "mom", "dad", "mother", "father", "sibling", "brother", "sister",
    "family", "in-laws", "grandparent", "disappoint them", "disappoint my parents",
  ],
  social: [
    "awkward", "social", "party", "group of friends", "everyone thinks", "embarrassed",
    "social anxiety", "didn't invite me", "left out",
  ],
  communication: [
    "how do i tell", "how do i say", "conversation", "need to talk to", "confront",
    "bring this up", "difficult conversation", "tell my", "say to my",
  ],
  conflict: [
    "argument", "fight", "conflict", "disagreement", "we argued", "mad at me",
    "angry at me", "falling out",
  ],
  career: [
    "career", "job offer", "promotion", "resign", "resignation", "quit my job",
    "switch careers", "job interview", "internship", "profession", "major",
  ],
  education: [
    "college", "university", "school", "exam", "degree", "study", "studies",
    "admission", "scholarship", "gpa", "thesis", "professor",
  ],
  money: [
    "money", "salary", "budget", "loan", "debt", "afford", "savings", "rent",
    "expensive", "investment", "financial",
  ],
  purchases: [
    "should i buy", "worth buying", "worth it", "laptop", "phone", "car ",
    "review", "price", "specs", "purchase", "buy a",
  ],
  work: [
    "coworker", "colleague", "manager", "boss", "teammate", "workplace",
    "meeting", "deadline", "performance review", "office",
  ],
  decision: [
    "should i", "which one", "option a", "option b", "decide", "decision",
    "torn between", "can't choose", "no idea which", "two offers", "either",
  ],
  productivity: [
    "procrastinat", "motivation", "habit", "focus", "time management", "burnout",
    "overwhelmed with tasks", "productivity",
  ],
  transition: [
    "moving to", "move to another city", "relocat", "new city", "new chapter",
    "life change", "starting over", "graduating",
  ],
  travel: [
    "trip", "travel", "flight", "visa", "itinerary", "vacation", "abroad",
  ],
  technology: [
    "app", "software", "device", "gadget", "ai tool", "website", "platform",
  ],
  current_events: [
    "latest", "current", "this year", "recent news", "policy", "regulation",
    "requirements for", "deadline for applications", "changed the rules",
  ],
  scam: [
    "suspicious", "scam", "phishing", "otp", "one time password", "urgent payment",
    "wire transfer", "gift card", "verify your account", "won a prize", "lottery",
    "click this link", "suspicious link", "fake job offer", "advance fee",
  ],
  other: [],
};

export const RESEARCH_TRIGGER_KEYWORDS = [
  "latest", "current", "this year", "recent", "requirements for", "price of",
  "cost of", "reviews", "worth buying", "specs", "compare", "policy", "regulation",
  "rules for", "deadline for", "news about", "how much does", "exchange rate",
  "stock price", "release date", "version of",
];

export const RECOVERY_KEYWORDS = [
  "i messed up", "i made a mistake", "accidentally sent", "forgot to", "missed the deadline",
  "missed a deadline", "sent the wrong", "i screwed up", "damage control", "too late now",
  "already happened", "i already did it", "regret", "bad purchase", "wasted money",
];

export const URGENCY_WORDS = ["now", "today", "immediately", "urgent", "asap", "right away", "tonight", "tomorrow morning"];

export const EMOTION_WORDS: Record<string, string[]> = {
  anxious: ["anxious", "scared", "nervous", "worried", "afraid", "panicking", "overthinking"],
  frustrated: ["frustrated", "annoyed", "angry", "furious", "irritated", "fed up"],
  sad: ["sad", "hurt", "heartbroken", "upset", "depressed", "down", "lonely"],
  conflicted: ["torn", "confused", "conflicted", "don't know what to do", "mixed feelings", "no idea"],
  urgent: URGENCY_WORDS,
  hopeful: ["excited", "hopeful", "optimistic", "looking forward"],
  calm: [],
};
