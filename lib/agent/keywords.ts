import type { Category } from "@/lib/types";

// Keyword weighting tables used for internal routing classification.
// This is a transparent, deterministic heuristic engine (no external LLM key
// is configured in this environment) — see lib/agent/engine.ts for how a real
// model call would slot in behind the same interface.

export const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  dating: [
    "crush", "date", "dating", "flirt", "asked me out", "ask her out", "ask him out",
    "romantic", "confess my feelings", "tinder", "hinge", "bumble", "swipe",
    "interested in me", "into me", "likes me", "like me back", "leads me on",
    "leading me on", "mixed signals", "feelings for me", "into her", "into him",
    "she likes", "he likes", "does she like", "does he like", "not interested in me",
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
    "social anxiety", "didn't invite me", "left out", "nobody invited me", "no one invited me",
    "everyone hates me", "feel like everyone",
  ],
  communication: [
    "how do i tell", "how do i say", "conversation", "need to talk to", "confront",
    "bring this up", "difficult conversation", "tell my", "say to my",
    "what should i say", "what should i text", "how should i respond", "how should i reply",
    "how do i respond", "how do i reply", "what do i say", "what do i text",
    "how do i say something", "should i say something",
  ],
  conflict: [
    "argument", "fight", "conflict", "disagreement", "we argued", "mad at me",
    "angry at me", "falling out", "roommate", "housemate", "flatmate",
    "boundary", "boundaries", "keeps doing this", "personal space", "keeps eating",
    "keeps taking", "keeps using my", "shared fridge", "shared space",
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
    "payment link", "pay within", "minutes to pay", "verify immediately",
    "account will be suspended", "confirm your details", "share your otp",
    "share the otp", "click here to", "confirm your identity",
  ],
  other: [],
};

// Some keywords are too generic to be a strong signal on their own — "should i"
// fires on almost every question this app is designed for, so it shouldn't be
// able to outrank a keyword that's actually specific to the situation (e.g.
// "roommate", "payment link"). Anything not listed here uses the normal
// word-count-based weight in scoreCategories().
export const WEAK_SIGNAL_WEIGHTS: Record<string, number> = {
  "should i": 0.4,
  "should i buy": 1.2,
  "buy a": 0.5,
  "which one": 0.4,
  "decide": 0.4,
  "decision": 0.4,
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
  sad: ["sad", "hurt", "heartbroken", "upset", "depressed", "down", "lonely", "hate me", "hates me"],
  conflicted: ["torn", "confused", "conflicted", "don't know what to do", "mixed feelings", "no idea"],
  urgent: URGENCY_WORDS,
  hopeful: ["excited", "hopeful", "optimistic", "looking forward"],
  calm: [],
};
