import type { ResearchResult, ResearchSource } from "@/lib/types";

// ---------------------------------------------------------------------------
// Research service abstraction.
//
// This module is the single seam between LIFE.EXE and any external search/web
// API — everything that would call a live provider lives behind
// `liveResearch` below. LIFE.EXE currently ships as a static export (see
// next.config.ts) with no server, so this runs client-side and
// `hasLiveSearchProvider()` is always false there (no server means no place
// to keep SEARCH_API_KEY secret, so a static deployment intentionally never
// attempts a live call). If this app is instead deployed on a Node server
// (e.g. Vercel), reintroduce a thin API route that imports `runResearch` and
// call it via fetch from the client instead of importing this module
// directly — that keeps a real SEARCH_API_KEY server-side only.
// Until a key is present, `runResearch` transparently falls back to a
// realistic mock so the UI and workflow are fully exercised in demo mode.
// The caller always receives an honest `mode: "demo" | "live"` flag — the
// product must never claim research happened when it didn't.
// ---------------------------------------------------------------------------

function hasLiveSearchProvider(): boolean {
  return Boolean(process.env.SEARCH_API_KEY);
}

async function liveResearch(query: string): Promise<ResearchResult> {
  // Placeholder for a real provider integration (e.g. Brave Search, Tavily,
  // Bing, SerpAPI). Kept isolated so swapping providers never touches the
  // rest of the app — only relevant once this runs behind a server route.
  const apiKey = process.env.SEARCH_API_KEY as string;
  const apiUrl = process.env.SEARCH_API_URL ?? "https://api.example-search-provider.com/v1/search";

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query }),
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) {
    throw new Error(`Search provider responded with ${res.status}`);
  }

  const data = await res.json();
  const sources: ResearchSource[] = (data.results ?? []).slice(0, 4).map((r: { title: string; url: string; snippet?: string; description?: string }) => ({
    title: r.title,
    domain: safeDomain(r.url),
    snippet: r.snippet ?? r.description ?? "",
    url: r.url,
  }));

  return {
    used: true,
    mode: "live",
    query,
    answer: data.answer,
    sources,
    disclaimer: "Results retrieved from a live web search API.",
  };
}

function safeDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// A small, honest mock corpus keyed by loose topic matching, so demo mode
// still feels grounded rather than fabricated. It's always clearly labeled.
const MOCK_TOPICS: { match: RegExp; sources: ResearchSource[]; answer: string }[] = [
  {
    match: /laptop|phone|gadget|buy|purchase|price|spec/i,
    answer: "In demo mode, LIFE.EXE can't fetch live prices or specs — but this is exactly the kind of question it would research: current pricing, recent reviews, and comparable alternatives.",
    sources: [
      { title: "How to evaluate a tech purchase", domain: "example-reviews.test", snippet: "A framework for comparing specs, price-to-performance, and real-world reviews before buying.", url: "https://example-reviews.test/how-to-evaluate" },
      { title: "Price tracking and comparison guide", domain: "example-pricecheck.test", snippet: "General guidance on comparing prices across retailers and spotting inflated 'deals'.", url: "https://example-pricecheck.test/guide" },
    ],
  },
  {
    match: /university|college|admission|requirement|scholarship/i,
    answer: "In demo mode, LIFE.EXE can't fetch live admissions data — but it would normally pull current requirements directly from the institution's official page.",
    sources: [
      { title: "Reading official admissions pages correctly", domain: "example-edu.test", snippet: "Why requirements change yearly and how to confirm you're viewing the current cycle.", url: "https://example-edu.test/admissions-guide" },
    ],
  },
  {
    match: /policy|regulation|rule|law|visa/i,
    answer: "In demo mode, LIFE.EXE can't fetch live regulatory data — this is a case where it would normally check an official government or institutional source directly.",
    sources: [
      { title: "Finding authoritative regulatory sources", domain: "example-gov.test", snippet: "General guidance on identifying official sources for policy and regulation questions.", url: "https://example-gov.test/sources" },
    ],
  },
];

function mockResearch(query: string): ResearchResult {
  const topic = MOCK_TOPICS.find((t) => t.match.test(query));
  if (topic) {
    return { used: true, mode: "demo", query, answer: topic.answer, sources: topic.sources, disclaimer: "DEMO MODE — no live web search is connected. These are illustrative placeholder sources, not real citations." };
  }
  return {
    used: true,
    mode: "demo",
    query,
    answer: "In demo mode, LIFE.EXE recognizes this needs current information, but no live search API is connected right now. Connect SEARCH_API_KEY to enable real research.",
    sources: [],
    disclaimer: "DEMO MODE — no live web search is connected.",
  };
}

export async function runResearch(query: string): Promise<ResearchResult> {
  if (hasLiveSearchProvider()) {
    try {
      return await liveResearch(query);
    } catch {
      return {
        ...mockResearch(query),
        disclaimer: "Live search failed, so LIFE.EXE fell back to DEMO MODE. These are illustrative placeholder sources, not real citations.",
      };
    }
  }
  return mockResearch(query);
}
