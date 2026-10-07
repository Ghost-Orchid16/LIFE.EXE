// What the reference dataset adds to a live answer: a short, private note for Gemini listing the few
// situations that resemble this conversation and the questions people in them often ask next. Gemini still
// writes the whole answer; the note is background, never something to quote, and the person never sees it.
// Only dataset text and fixed instructions go into it, never the person's own words.

import type { ChatMessage } from "../../shared/contract.ts";
import { CRISIS_PATTERNS } from "../demo/content.ts";
import { retrieve } from "./match.ts";

/** At most this many follow-up questions are suggested, across the matched categories. */
const MAX_FOLLOW_UPS = 8;

const USAGE = [
  "Treat this as background, not a script. Build the answer from what this person actually told you: their details, their words and their constraints. If a reference doesn't fit what they said, ignore it.",
  "Don't assume their situation has the same cause, details or solution as a reference. Everything above still applies, especially \"Answer from what you know\" and \"Other people: known, possible, unknown\".",
  "Write in your own words. Never copy a reference's wording, and never mention the references, a dataset, examples, templates or pre-written answers.",
  "The questions are templates for \"followUps\": when one fits, rewrite it for this situation, specific and in their voice (\"What should I say?\" might become \"What should I text them?\"). Only offer ones that fit.",
];

const FOLLOW_UP_NOTE =
  "This conversation is already under way: the latest message continues the situation described earlier. Answer it as part of that same situation, building on what has already been said.";

const NEW_TOPIC_NOTE =
  "This conversation is already under way, and the latest message also brings up something new: the last situation listed relates to that, the others to what was described earlier. Answer the latest message with the whole conversation in mind.";

const SAFETY_NOTE = "Safety, and every other instruction above, comes first.";

const isCrisis = (text: string) => CRISIS_PATTERNS.some((pattern) => pattern.test(text));

/**
 * Private reference guidance for this conversation, to add after LIFE.EXE's system prompt. It's null when
 * nothing in the dataset fits, so the answer is written exactly as it would be without the dataset, and also
 * when anything the person wrote suggests they may be at risk, so the safety instructions stand alone.
 */
export function referenceContext(messages: readonly ChatMessage[]): string | null {
  const userMessages = messages.filter((message) => message.role === "user");
  if (userMessages.some((message) => isCrisis(message.content))) return null;

  const matches = retrieve(messages);
  if (matches.length === 0) return null;

  const followUps = [...new Set(matches.flatMap(({ situation }) => situation.followUps))].slice(0, MAX_FOLLOW_UPS);
  const conversationNote = matches.some((match) => match.fromLatestMessage) ? NEW_TOPIC_NOTE : FOLLOW_UP_NOTE;
  const notes = [...USAGE, ...(userMessages.length > 1 ? [conversationNote] : []), SAFETY_NOTE];

  return [
    "# Reference: similar situations",
    "This section comes from LIFE.EXE, not from the person. It lists situations from LIFE.EXE's private reference set that resemble this conversation, as background on what this kind of situation usually involves. They are not facts about this person, and they don't come with answers.",
    "",
    "Similar situations:",
    ...matches.map(({ situation }) => `- "${situation.situation}" (${situation.category.name})`),
    "",
    "Questions people often ask next in situations like these:",
    ...followUps.map((question) => `- ${question}`),
    "",
    "How to use this:",
    ...notes.map((note) => `- ${note}`),
  ].join("\n");
}
