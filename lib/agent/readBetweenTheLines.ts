export interface ConversationAnalysis {
  observations: string[];
  reciprocity: { you: number; them: number; note: string };
  clarity: "high" | "mixed" | "low";
  tone: string;
  interpretations: { text: string; certainty: "likely" | "possible" | "uncertain" }[];
  uncertaintyNote: string;
}

const WARM_WORDS = ["haha", "lol", "miss you", "can't wait", "love", "excited", "!"];
const COLD_WORDS = ["k", "fine", "whatever", "sure.", "ok."];
const VAGUE_WORDS = ["maybe", "idk", "not sure", "we'll see", "kind of", "sort of"];

function splitBySpeaker(text: string): { you: string[]; them: string[] } {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const you: string[] = [];
  const them: string[] = [];
  let lastSpeaker: "you" | "them" | null = null;

  for (const line of lines) {
    const meMatch = /^(me|you|i)\s*:/i.test(line);
    const themMatch = /^(them|her|him|they|he|she)\s*:/i.test(line);
    if (meMatch) {
      you.push(line.replace(/^[^:]*:/, "").trim());
      lastSpeaker = "you";
    } else if (themMatch) {
      them.push(line.replace(/^[^:]*:/, "").trim());
      lastSpeaker = "them";
    } else if (lastSpeaker) {
      (lastSpeaker === "you" ? you : them).push(line);
    } else {
      you.push(line);
    }
  }
  return { you, them };
}

export function analyzeConversation(text: string): ConversationAnalysis {
  const { you, them } = splitBySpeaker(text);
  const n = text.toLowerCase();

  const youWords = you.join(" ").split(/\s+/).filter(Boolean).length;
  const themWords = them.join(" ").split(/\s+/).filter(Boolean).length;

  const observations: string[] = [];
  observations.push(`You sent roughly ${you.length} message${you.length === 1 ? "" : "s"}; the other person sent roughly ${them.length}.`);
  if (youWords > 0 && themWords > 0) {
    const ratio = youWords / themWords;
    observations.push(
      ratio > 1.6
        ? "Your messages are noticeably longer/more frequent than theirs."
        : ratio < 0.6
        ? "Their messages are noticeably longer/more frequent than yours."
        : "Message length and frequency look fairly balanced between you two."
    );
  }
  const questionCount = (text.match(/\?/g) || []).length;
  observations.push(`${questionCount} question${questionCount === 1 ? "" : "s"} appear in the conversation.`);

  const warmScore = WARM_WORDS.filter((w) => n.includes(w)).length;
  const coldScore = COLD_WORDS.filter((w) => n.includes(w)).length;
  const vagueScore = VAGUE_WORDS.filter((w) => n.includes(w)).length;

  const tone = warmScore > coldScore ? "Generally warm / engaged" : coldScore > warmScore ? "Generally short / low-energy" : "Neutral / hard to read from tone alone";
  const clarity: ConversationAnalysis["clarity"] = vagueScore >= 2 ? "low" : vagueScore === 1 ? "mixed" : "high";

  const reciprocityNote =
    them.length === 0
      ? "Only one side of the conversation was included — reciprocity can't be judged from this alone."
      : you.length > them.length * 1.8
      ? "You're initiating noticeably more than they are, based on what's here."
      : them.length > you.length * 1.8
      ? "They're initiating noticeably more than you are, based on what's here."
      : "Initiation looks roughly reciprocal.";

  const interpretations: ConversationAnalysis["interpretations"] = [
    {
      text: "The shorter or delayed responses could reflect being busy, disinterest, or just a different texting style — this pattern alone doesn't confirm any of them.",
      certainty: "uncertain",
    },
    {
      text: clarity === "low" ? "Vague language ('maybe', 'idk') shows up — that often reflects genuine uncertainty on their end, not necessarily about you specifically." : "Language here is fairly direct, which usually makes intent easier to read at face value.",
      certainty: "possible",
    },
    {
      text: questionCount > 0 ? "Questions being asked is generally a sign of some active engagement in the conversation." : "There aren't many questions here, which can mean lower engagement, or simply a different conversational style.",
      certainty: "likely",
    },
  ];

  return {
    observations,
    reciprocity: { you: you.length, them: them.length, note: reciprocityNote },
    clarity,
    tone,
    interpretations,
    uncertaintyNote:
      "This breaks down observable patterns only. It can't know their actual thoughts or intentions — treat the interpretations as possibilities to consider, not conclusions.",
  };
}
