// Finds the reference situations that resemble a conversation. It runs on the server, takes about a
// millisecond, and calls no API.
//
// Matching works on meaning more than exact wording. Words are reduced to a simple stem ("missing" and
// "missed" both become "miss"), and common ways of saying the same thing map to one shared concept (see
// lexicon.ts): "acting distant", "barely talks to me", "avoiding me" and "left me on read" all count as the
// same idea. Each situation is scored by how much of it the conversation covers, with rare, specific words
// counting for more than common ones (inverse document frequency, as a search engine weighs words). Only
// situations that clear a threshold count, so a message the dataset doesn't cover matches nothing.

import type { ChatMessage } from "../../shared/contract.ts";
import { CONCEPT_SOURCES, SHORTHAND, STOPWORDS, THEMES, TOPICS } from "./lexicon.ts";
import { REFERENCE_SITUATIONS, type ReferenceSituation } from "./situations.ts";

export interface ReferenceMatch {
  situation: ReferenceSituation;
  /** How strongly the conversation matches it; only meaningful compared with other matches. */
  score: number;
  /** How much of the situation the conversation covers, from 0 to 1. */
  coverage: number;
  /** True when it matches something new that the latest message brought up, rather than the conversation so far. */
  fromLatestMessage: boolean;
}

/** At most this many situations go to the AI for one message. */
export const MAX_MATCHES = 3;

// A situation is a match when the conversation covers enough of it, and of what makes it specific…
const MIN_SPECIFIC = 5;
const MIN_COVERAGE = 0.4;
// …but one idea alone ("bored", "a mistake") is only enough when the situation is mostly about it, and the
// broader the idea, the more completely it has to cover the situation: its coverage times the idea's rarity
// (idf) must reach this. A rare idea like reposting needs about half; a broad one like money never suffices.
const SINGLE_IDEA_STRENGTH = 3.2;
// A word the conversation shares with a situation only counts as an idea of its own when it's this rare (in
// roughly 2% of situations or fewer): "input" or "percentile" does, "work" or "time" doesn't.
const SPECIFIC_WORD_IDF = 4;
// After the best match, others only count if they're nearly as good: weaker ones would add noise.
const RELATIVE_CUTOFF = 0.6;

// Words describing a whole category (code, app, deploy… for coding) help choose between similar situations
// but are never enough to make a match.
const THEME_WEIGHT = 0.35;
// In a conversation, the situation is usually described in the first message, and the latest message is
// what needs answering now. Recent messages in between add detail; older ones and very long messages are
// trimmed, so a long conversation stays quick to match.
const FIRST_MESSAGE_WEIGHT = 1;
const LATEST_MESSAGE_WEIGHT = 0.8;
const OTHER_MESSAGE_WEIGHT = 0.5;
const RECENT_MESSAGES = 3;
const MESSAGE_CHARS = 2000;

// ---------------------------------------------------------------------------------------------------------
// Words

/** Lowercase words with contractions expanded and punctuation removed, padded with spaces. */
export function normalize(text: string): string {
  const words = text
    .toLowerCase()
    .replace(/[\u2018\u2019\u02bc`\u00b4]/g, "'")
    .replace(/\bcan't\b/g, "cannot")
    .replace(/\bwon't\b/g, "will not")
    .replace(/\bshan't\b/g, "shall not")
    .replace(/n't\b/g, " not")
    .replace(/'m\b/g, " am")
    .replace(/'re\b/g, " are")
    .replace(/'ve\b/g, " have")
    .replace(/'ll\b/g, " will")
    .replace(/'d\b/g, " would")
    .replace(/\b(it|that|what|there|here|he|she|who|where|how)'s\b/g, "$1 is")
    .replace(/'s\b/g, "")
    // British spellings read like American ones, so "practise" and "practice" are the same word.
    .replace(/\bpractis(e|es|ed|ing)\b/g, "practic$1")
    .replace(/\b(organi|memori|reali|apologi|prioriti|recogni|critici|summari|minimi|categori)s(e|es|ed|ing|ation|ations)\b/g, "$1z$2")
    .replace(/\b(behavi|fav|col|hon|neighb)our/g, "$1or")
    .replace(/[^a-z0-9]+/g, " ")
    // Greetings say nothing about a situation: "good morning" isn't about mornings.
    .replace(/\bgood (morning|afternoon|evening|night)\b|\bhow are you\b/g, " ")
    .trim()
    .split(" ")
    .map((word) => SHORTHAND[word] ?? word);
  return ` ${words.join(" ")} `;
}

/** A light stemmer: enough to treat "friends", "missing", "studied" and "replies" like their base words. */
export function stem(word: string): string {
  let w = word;
  if (w.length > 4 && w.endsWith("ies")) w = `${w.slice(0, -3)}y`;
  else if (w.length > 4 && /(ss|sh|ch|x|z)es$/.test(w)) w = w.slice(0, -2);
  else if (w.length > 3 && w.endsWith("s") && !/(ss|us|is)$/.test(w)) w = w.slice(0, -1);

  if (w.length > 5 && w.endsWith("ing")) w = w.slice(0, -3);
  else if (w.length > 4 && w.endsWith("ied")) w = `${w.slice(0, -3)}y`;
  else if (w.length > 4 && w.endsWith("ed")) w = w.slice(0, -2);
  else if (w.length > 7 && w.endsWith("ation")) w = w.slice(0, -5);
  else if (w.length > 7 && w.endsWith("ment")) w = w.slice(0, -4);
  else if (w.length > 5 && w.endsWith("ly") && !/[ie]ly$/.test(w)) w = w.slice(0, -2);

  if (w.length > 3 && /(bb|dd|ff|gg|ll|mm|nn|pp|rr|tt)$/.test(w)) w = w.slice(0, -1);
  if (w.length > 3 && w.endsWith("e")) w = w.slice(0, -1);
  if (w.length > 6 && w.endsWith("at")) w = w.slice(0, -2);
  return w;
}

// Concept names start with "~" so they never collide with a word.
const CONCEPTS = Object.entries(CONCEPT_SOURCES).map(([name, sources]) => {
  // An empty alternative would match everywhere, so a mistake in the lexicon fails loudly instead.
  if (Array.from(sources).some((source) => !source)) throw new Error(`Concept "${name}" has an empty pattern.`);
  return { name: `~${name}`, pattern: new RegExp(`(?<= )(?:${sources.join("|")})(?= )`, "g") };
});

// ---------------------------------------------------------------------------------------------------------
// Features: the concepts and word stems in a piece of text

interface Feature {
  weight: number;
  /** For a word: the concepts whose wording includes it, so a paraphrase with the same concept covers it too. */
  via: Set<string>;
  /** Where it appears in the normalized text, as [start, end) positions. */
  spans: Array<[number, number]>;
}

type Features = Map<string, Feature>;

function addFeature(
  features: Features,
  name: string,
  weight: number,
  via: Iterable<string> = [],
  spans: Array<[number, number]> = [],
) {
  const existing = features.get(name);
  if (!existing) {
    features.set(name, { weight, via: new Set(via), spans: [...spans] });
    return;
  }
  existing.weight = Math.max(existing.weight, weight);
  for (const concept of via) existing.via.add(concept);
  existing.spans.push(...spans);
}

/** The concepts and word stems in `text`, each with `weight`. */
export function features(text: string, weight = 1): Features {
  const normalized = normalize(text);
  const result: Features = new Map();
  const spans: Array<{ start: number; end: number; concept: string }> = [];

  for (const { name, pattern } of CONCEPTS) {
    // `exec` reuses the compiled pattern; `matchAll` would copy it for every call.
    pattern.lastIndex = 0;
    for (let match = pattern.exec(normalized); match; match = pattern.exec(normalized)) {
      const end = match.index + match[0].length;
      if (end === match.index) {
        pattern.lastIndex += 1;
        continue;
      }
      addFeature(result, name, weight, [], [[match.index, end]]);
      spans.push({ start: match.index, end, concept: name });
    }
  }

  let position = 0;
  for (const word of normalized.split(" ")) {
    const start = position;
    position += word.length + 1;
    if (word.length < 2 || STOPWORDS.has(word)) continue;
    const via = spans.filter((span) => span.start <= start && start < span.end).map((span) => span.concept);
    addFeature(result, stem(word), weight, via, [[start, start + word.length]]);
  }
  return result;
}

// ---------------------------------------------------------------------------------------------------------
// The index: built once, on the first message that needs it (about a third of a second), then reused

interface IndexedSituation {
  situation: ReferenceSituation;
  /** The features of the situation's own words. */
  own: Features;
  /** The features of its category's theme, at a lower weight. */
  theme: Features;
  /** The total weight of its own features: what a perfect match covers. */
  mass: number;
}

function inverseDocumentFrequency(documents: Features[]): Map<string, number> {
  const frequency = new Map<string, number>();
  for (const document of documents) {
    for (const name of document.keys()) frequency.set(name, (frequency.get(name) ?? 0) + 1);
  }
  const idf = new Map<string, number>();
  for (const [name, count] of frequency) idf.set(name, Math.log(1 + (documents.length - count + 0.5) / (count + 0.5)));
  return idf;
}

function buildIndex() {
  const entries = REFERENCE_SITUATIONS.map((situation) => ({
    situation,
    own: features(situation.situation),
    theme: features(THEMES[situation.category.id] ?? "", THEME_WEIGHT),
  }));

  // How rare each word or concept is among the situations' own words, and among the category themes.
  const idf = inverseDocumentFrequency(entries.map((entry) => entry.own));
  const themeIdf = inverseDocumentFrequency(Object.values(THEMES).map((theme) => features(theme)));

  const situations: IndexedSituation[] = entries.map((entry) => {
    let mass = 0;
    for (const [name, { weight }] of entry.own) mass += weight * (idf.get(name) ?? 0);
    return { ...entry, mass };
  });
  return { situations, idf, themeIdf };
}

type Index = ReturnType<typeof buildIndex>;
let index: Index | undefined;
const getIndex = (): Index => (index ??= buildIndex());

// ---------------------------------------------------------------------------------------------------------
// Retrieval

/** What the conversation is about: the person's messages, weighted so the situation they described stays central. */
export function conversationFeatures(messages: readonly ChatMessage[]): Features {
  const userMessages = messages.flatMap((message) => (message.role === "user" ? [message.content] : []));
  const last = userMessages.length - 1;
  const result: Features = new Map();
  userMessages.forEach((content, index) => {
    if (index !== 0 && index < last - RECENT_MESSAGES + 1) return;
    const weight = index === 0 ? FIRST_MESSAGE_WEIGHT : index === last ? LATEST_MESSAGE_WEIGHT : OTHER_MESSAGE_WEIGHT;
    for (const [name, feature] of features(content.slice(0, MESSAGE_CHARS), weight)) {
      addFeature(result, name, feature.weight, feature.via);
    }
  });
  return result;
}

interface Candidate extends Omit<ReferenceMatch, "fromLatestMessage"> {
  /** The idf-weighted amount of the situation that matched. */
  specific: number;
  /**
   * How many separate ideas matched: separate parts of the situation's wording that the conversation shares
   * (through a concept, or a rare word), plus the category's theme when that fits too.
   */
  ideas: number;
  /** The idf of the rarest idea that matched. */
  rarest: number;
  /** Whether any matched idea is about what's going on, not only who or what is involved (see `TOPICS`). */
  aboutProblem: boolean;
}

const spanKey = (spans: Array<[number, number]>) => spans.map(([start, end]) => `${start}-${end}`).sort().join(" ");
const inside = ([start, end]: [number, number], outer: Array<[number, number]>) =>
  outer.some(([outerStart, outerEnd]) => outerStart <= start && end <= outerEnd);

function scoreSituation(
  entry: IndexedSituation,
  query: Features,
  queryMass: number,
  { idf, themeIdf }: Index,
): Candidate | null {
  const rarity = (name: string) => idf.get(name) ?? 0;
  const asked = (name: string) => query.get(name)?.weight ?? 0;

  let specific = 0;
  let rarest = 0;
  let aboutProblem = false;
  // Concepts found on exactly the same words ("sibling" is also "family") are one idea.
  const conceptIdeas = new Set<string>();
  const conceptSpans: Array<[number, number]> = [];
  const rareWordSpans: Array<[number, number]> = [];
  for (const [name, { weight, via, spans }] of entry.own) {
    // The same word counts fully; a word reached through a shared concept counts only as much as that concept
    // is specific, so a broad idea ("school") doesn't stand in for a precise word ("schoolwork").
    let evidence = asked(name) * rarity(name);
    for (const concept of via) {
      if (asked(concept) > 0) evidence = Math.max(evidence, asked(concept) * Math.min(rarity(name), rarity(concept)));
    }
    if (evidence === 0) continue;
    specific += weight * evidence;
    if (name.startsWith("~")) {
      conceptIdeas.add(spanKey(spans));
      conceptSpans.push(...spans);
      rarest = Math.max(rarest, rarity(name));
      if (!TOPICS.has(name.slice(1))) aboutProblem = true;
    } else if (rarity(name) >= SPECIFIC_WORD_IDF && asked(name) > 0) {
      rareWordSpans.push(...spans);
      rarest = Math.max(rarest, rarity(name));
      aboutProblem = true;
    }
  }
  if (specific === 0) return null;
  // A rare word only adds an idea when it's outside the concepts that matched.
  const rareWords = new Set(rareWordSpans.filter((span) => !inside(span, conceptSpans)).map((span) => spanKey([span])));

  let themed = 0;
  for (const [name, { weight }] of entry.theme) {
    if (asked(name) > 0 && !entry.own.has(name)) themed += weight * asked(name) * (themeIdf.get(name) ?? 0);
  }

  // How much of what the person said this situation accounts for: between two situations that both fit,
  // the one that explains more of the message ranks first.
  let explained = 0;
  for (const [name, { weight, via }] of query) {
    if (entry.own.has(name)) {
      explained += weight * rarity(name);
      continue;
    }
    const shared = [...via].filter((concept) => entry.own.has(concept));
    if (shared.length > 0) explained += weight * Math.min(rarity(name), Math.max(...shared.map(rarity)));
  }

  const coverage = entry.mass > 0 ? specific / entry.mass : 0;
  const queryCoverage = queryMass > 0 ? Math.min(1, explained / queryMass) : 0;
  return {
    situation: entry.situation,
    score: (specific + themed) * (0.5 + coverage) * (0.5 + queryCoverage),
    coverage,
    specific,
    ideas: conceptIdeas.size + rareWords.size + (themed > 0 ? 1 : 0),
    rarest,
    aboutProblem,
  };
}

/** Every situation that shares something with the conversation, best first, before any threshold. */
export function rankSituations(query: Features): Candidate[] {
  const index = getIndex();
  // Words no situation uses (names, places, details) don't count against any situation.
  let queryMass = 0;
  for (const [name, { weight }] of query) queryMass += weight * (index.idf.get(name) ?? 0);
  return index.situations
    .map((entry) => scoreSituation(entry, query, queryMass, index))
    .filter((candidate): candidate is Candidate => candidate !== null)
    .sort((a, b) => b.score - a.score || a.situation.number - b.situation.number);
}

const qualifies = (candidate: Candidate) =>
  candidate.specific >= MIN_SPECIFIC &&
  candidate.aboutProblem &&
  (candidate.ideas >= 2
    ? candidate.coverage >= MIN_COVERAGE
    : candidate.coverage * candidate.rarest >= SINGLE_IDEA_STRENGTH);

/** The situations that qualify for this query, best first, leaving out any much weaker than the best. */
function matchesFor(query: Features, fromLatestMessage: boolean): ReferenceMatch[] {
  if (query.size === 0) return [];
  const candidates = rankSituations(query).filter(qualifies);
  const best = candidates[0]?.score ?? 0;
  return candidates
    .filter((candidate) => candidate.score >= best * RELATIVE_CUTOFF)
    .map(({ situation, score, coverage }) => ({ situation, score, coverage, fromLatestMessage }));
}

/**
 * The reference situations that resemble this conversation, best first: at most `limit`, and none when nothing
 * in the dataset fits. On a follow-up, the situation described at the start still counts most, so a question
 * like "What should I say to them?" keeps the original situation's matches. If the latest message brings up
 * something new as well, its best match takes the last place.
 */
export function retrieve(messages: readonly ChatMessage[], limit = MAX_MATCHES): ReferenceMatch[] {
  const matches = matchesFor(conversationFeatures(messages), false);
  const userMessages = messages.filter((message) => message.role === "user");
  if (userMessages.length < 2) return matches.slice(0, limit);

  const latest = features(userMessages[userMessages.length - 1].content.slice(0, MESSAGE_CHARS));
  const somethingNew = matchesFor(latest, true).find(({ situation }) => !matches.some((match) => match.situation === situation));
  return somethingNew ? [...matches.slice(0, limit - 1), somethingNew] : matches.slice(0, limit);
}
