// Pre-written responses used in DEMO MODE, when no AI key is configured.
// The interface labels every one of them as a demo response; none of this is presented as live AI.
// They follow the same short format as live answers: the answer, the next move, words to use when
// that helps, and two or three follow-ups. Every follow-up offered here has a reply of its own.

import type { LifeResponse } from "../../shared/contract.ts";

/** A follow-up answer. Anything left out is empty; the title stays the scenario's. */
export type DemoReply = Pick<LifeResponse, "answer"> & Partial<Omit<LifeResponse, "answer" | "title">>;

export interface DemoScenario {
  id: string;
  /** Each pattern that matches the person's first message adds to the scenario's score. */
  keywords: RegExp[];
  initial: LifeResponse;
  /** A more fitting first answer when the person asks the question this scenario answers. */
  asked?: { match: RegExp; answer: string };
  direct: DemoReply;
  firstStep: DemoReply;
  words: DemoReply;
  /** Scenario-specific follow-ups, checked before the generic ones. */
  extras: Array<{ match: RegExp; reply: DemoReply }>;
}

const EMPTY: LifeResponse = {
  care: "",
  answer: "",
  points: [],
  question: "",
  nextMove: "",
  scripts: [],
  alternative: "",
  followUps: [],
  title: "",
};

const initial = (fields: Pick<LifeResponse, "answer" | "title"> & Partial<LifeResponse>): LifeResponse => ({ ...EMPTY, ...fields });

export function composeReply(reply: DemoReply, title: string): LifeResponse {
  return { ...EMPTY, ...reply, title };
}

export const SCENARIOS: DemoScenario[] = [
  {
    id: "career",
    keywords: [/\bcareer/i, /\bpath\b/i, /\bmajor\b/i, /\bdegree\b/i, /\bstudy(ing)?\b/i, /\b(university|college)\b/i, /\bprofession/i, /\bwith my life\b/i],
    initial: initial({
      answer:
        "You don't need to find the one right career yet, just a good next step you can learn from. Test your strongest option before you commit to anything.",
      nextMove: "Pick the direction you think about most, and ask one person who does that work what a normal week is like.",
      followUps: ["Help me word the message.", "What if I choose wrong?", "My parents want something else."],
      title: "Choosing a career direction",
    }),
    direct: {
      answer: "Go with the option you keep coming back to, and test it properly. Waiting for certainty usually just means waiting.",
      nextMove: "This week, do one real thing in that field: a short course, a small project, or a conversation with someone in it.",
      followUps: ["What should I do first?", "What if I choose wrong?"],
    },
    firstStep: {
      answer: "Start by getting real information about one path, instead of trying to decide between all of them.",
      nextMove: "Today, message one person who works in the field you're most curious about and ask for fifteen minutes.",
      followUps: ["Help me word the message.", "Can you be more direct?"],
    },
    words: {
      answer: "Keep it short and specific. Most people are happy to help with a small ask.",
      scripts: [
        "Hi! I'm figuring out my next step and I'm curious about your work. Could I ask you a few quick questions sometime this week?",
      ],
      nextMove: "Send it to one person whose work interests you.",
      followUps: ["What should I ask them?", "What if they don't reply?"],
    },
    extras: [
      {
        match: /\b(choose|chose|pick|picked) (the )?wrong\b|\bwrong (one|choice|decision)\b/i,
        reply: {
          answer:
            "Then you'll have learned what you don't want, which is useful. Very few career choices are permanent; most people change direction more than once.",
          nextMove: "If you're torn, choose the option that's easiest to change later.",
          followUps: ["Can you be more direct?", "What should I do first?"],
        },
      },
      {
        match: /\bwhat (should|do|can) i ask\b/i,
        reply: {
          answer: "Ask about the real work, not the job title.",
          points: ["What does a normal week look like?", "What surprised you when you started?", "What kind of person does well in this?"],
          nextMove: "Pick two of these and keep it to fifteen minutes.",
          followUps: ["Help me word the message.", "What if they don't reply?"],
        },
      },
    ],
  },
  {
    id: "friend",
    keywords: [
      /\bfriend/i,
      /\b(hasn'?t|haven'?t|hasnt|havent) (talked|spoken|texted|replied|messaged|heard)/i,
      /\bignor(e|es|ed|ing)\b/i,
      /\bghost(ed|ing)?\b/i,
      /\b(silent|silence|quiet)\b/i,
      /\bleft (me )?on read\b/i,
      /\bnot (talking|replying|responding)\b/i,
    ],
    initial: initial({
      answer: "Send one casual check-in, then give them some space.",
      nextMove: "Send one short message today, then wait a day or two before reading anything into the silence.",
      scripts: ["Hey, haven't heard from you in a bit. Everything okay?"],
      followUps: ["What if they don't reply?", "I think I upset them.", "Help me word the message."],
      title: "Checking in with a quiet friend",
    }),
    asked: {
      match: /\bshould i\b[^.?!]*\b(message|msg|text|dm|reach out|contact|call|write)\b|\b(message|msg|text|contact|call) (him|her|them) again\b/i,
      answer: "Yes — send one casual check-in, then give them some space.",
    },
    direct: {
      answer: "Message them today. One friendly check-in is normal between friends; it isn't needy.",
      nextMove: "Send one short message, then leave it for a day or two.",
      followUps: ["What if they don't reply?", "Help me word the message."],
    },
    firstStep: {
      answer: "Start with one light message: nothing heavy, and nothing they have to explain.",
      nextMove: "Send a short, friendly check-in today.",
      scripts: ["Hey! Been a minute. How are you doing?"],
      followUps: ["What if they don't reply?", "I think I upset them."],
    },
    words: {
      answer: "Keep it light, and don't ask them to explain the silence.",
      scripts: [
        "Hey, haven't heard from you in a bit. Everything okay?",
        "Hey! Thinking of you. How's your week going?",
        "No pressure to reply, just wanted to check in. Hope you're doing okay.",
      ],
      nextMove: "Pick the one that sounds most like you, and send just that one.",
      followUps: ["What if they don't reply?", "I think I upset them."],
    },
    extras: [
      {
        match: /\b(upset|hurt|offend(ed)?|annoyed|said something|fight|fought|argu(e|ed|ment))\b/i,
        reply: {
          answer: "Then name it simply. A short, sincere message works better than a long explanation.",
          nextMove: "Send one message that acknowledges it without over-apologising, then give them room to respond.",
          scripts: ["Hey, I've been thinking about the other day. If I upset you, I'm sorry. I'd like to talk when you're ready."],
          followUps: ["What if they don't reply?", "Help me word it differently."],
        },
      },
      {
        match: /\b(don'?t|doesn'?t|won'?t|never|no) (reply|replies|respond|answer)/i,
        reply: {
          answer: "Then give it a few days, and don't send more messages. One unanswered text is fine; several can feel like pressure.",
          nextMove: "If there's still nothing after a few days, send one more low-key message or ask a mutual friend if they're okay.",
          alternative: "If going quiet is normal for them when life gets busy, just wait until they resurface.",
          followUps: ["I think I upset them.", "Should I call them instead?"],
        },
      },
      {
        match: /\bcall\b/i,
        reply: {
          answer: "Only if calling is normal between you two. Otherwise a text is easier for them to answer when they're ready.",
          nextMove: "Stick to one text for now, and save a call for when you know they're up for talking.",
          followUps: ["What if they don't reply?", "Help me word the message."],
        },
      },
    ],
  },
  {
    id: "conversation",
    keywords: [
      /\b(difficult|hard|tough|awkward|serious) (conversation|talk)\b/i,
      /\bconversation\b/i,
      /\bconfront/i,
      /\bbring (it|this|that) up\b/i,
      /\btalk to (my|him|her|them)\b/i,
      /\b(need|have) to tell\b/i,
      /\bhow (do i|to|should i) tell\b/i,
    ],
    initial: initial({
      answer:
        "Have it soon, and in private. Open with what you'd like to happen, not with everything that went wrong.",
      nextMove: "Pick a calm moment this week and ask for ten minutes to talk.",
      scripts: ["There's something I've been wanting to talk to you about. Do you have ten minutes later?"],
      followUps: ["Help me start the conversation.", "What if they get defensive?", "What if it turns into an argument?"],
      title: "Having a hard conversation",
    }),
    direct: {
      answer: "Have the conversation this week. Putting it off usually makes it bigger, not easier.",
      nextMove: "Choose a day and time now, and ask them for ten minutes.",
      followUps: ["Help me start the conversation.", "What if they get defensive?"],
    },
    firstStep: {
      answer: "Start by getting clear on the one thing you want them to understand.",
      nextMove: "Write it down in one sentence before you talk.",
      followUps: ["Help me start the conversation.", "Can you be more direct?"],
    },
    words: {
      answer: "Start with how it affected you and what you'd like, not with blame.",
      scripts: [
        "I want to talk about something that's been on my mind, because this matters to me.",
        "When that happened, I felt hurt. What I'd really like is for us to sort it out.",
      ],
      nextMove: "Say the first line, then pause and let them respond.",
      followUps: ["What if they get defensive?", "What if it turns into an argument?"],
    },
    extras: [
      {
        match: /\bstart (the|this|a) (conversation|talk)\b|\bhow (do i|should i|to) (start|begin|open)\b/i,
        reply: {
          answer: "Start with how it affected you and what you'd like, not with blame.",
          scripts: [
            "I want to talk about something that's been on my mind, because this matters to me.",
            "When that happened, I felt hurt. What I'd really like is for us to sort it out.",
          ],
          nextMove: "Say the first line, then pause and let them respond.",
          followUps: ["What if they get defensive?", "What if it turns into an argument?"],
        },
      },
      {
        match: /\bdefensive\b|\bden(y|ies)\b|\bblam(e|es|ing)\b/i,
        reply: {
          answer: "Don't argue about the facts. Keep coming back to how it affected you and what you'd like now.",
          nextMove: "If they get defensive, slow down and say you're not trying to blame them.",
          scripts: ["I'm not trying to blame you. I just want us to sort this out."],
          followUps: ["What if it turns into an argument?", "Help me start the conversation."],
        },
      },
      {
        match: /\b(argument|argue|fight|angry|yell|shout)/i,
        reply: {
          answer: "Then pause it. Stopping and coming back later isn't failing; it usually goes better the second time.",
          nextMove: "Agree on a time to pick it up again once you've both calmed down.",
          scripts: ["I don't want this to turn into a fight. Can we take a break and come back to it tonight?"],
          followUps: ["What if they get defensive?", "Help me start the conversation."],
        },
      },
      {
        match: /\b(parents?|mom|mum|dad|mother|father|family)\b/i,
        reply: {
          answer: "With family, pick a relaxed moment and lead with the relationship: that you care about them and want them to understand.",
          nextMove: "Choose a quiet time at home, not in the middle of something else.",
          scripts: ["Can we talk about something? It matters to me, and I want you to understand where I'm coming from."],
          followUps: ["Help me start the conversation.", "What if it turns into an argument?"],
        },
      },
    ],
  },
  {
    id: "two-options",
    keywords: [
      /\btwo (opportunit|offers|options|jobs|choices|schools|universities|colleges|internships|paths)/i,
      /\boffers?\b/i,
      /\b(choose|decide|pick) between\b/i,
      /\bwhich (one|to choose|to pick|should i (take|pick|choose))\b/i,
      /\bopportunit/i,
    ],
    initial: initial({
      answer:
        "Choose the one that fits what you want for the next year or two, not forever. If they feel equal, take the one that would be harder to get again.",
      points: [
        "Which one would you regret turning down?",
        "Which one would teach you more?",
        "Which one is easier to change later?",
      ],
      nextMove: "Answer those three for each option tonight, and see which one comes out ahead.",
      followUps: ["I care most about stability.", "I want to grow the most.", "What if I choose wrong?"],
      title: "Choosing between two options",
    }),
    direct: {
      answer: "If one option scares you a little but excites you more, that's usually the one worth taking, as long as you can afford the downside.",
      nextMove: "Check the real worst case of the bolder option. If you could live with it, choose that one.",
      followUps: ["What should I do first?", "What if I choose wrong?"],
    },
    firstStep: {
      answer: "Start with the deadline, then your deal-breakers.",
      nextMove: "Find out when you have to decide, and cross off anything that fails a must-have.",
      followUps: ["Help me ask for more time.", "Can you be more direct?"],
    },
    words: {
      answer: "It's completely normal to ask for a few days to decide.",
      scripts: ["Thank you so much for the offer. Could I have until Friday to give you my answer?"],
      nextMove: "Ask for a specific date rather than \"a bit more time\".",
      followUps: ["What if they say no?", "Can you be more direct?"],
    },
    extras: [
      {
        match: /\b(stabil|secur|safe|steady|reliable)/i,
        reply: {
          answer: "Then take the steadier option, and look for growth in other ways, like a course or a side project.",
          nextMove: "Check which option is more secure over the next year, not just the next month.",
          followUps: ["What if I choose wrong?", "Can you be more direct?"],
        },
      },
      {
        match: /\b(grow|growth|learn|challeng|excit|stretch)/i,
        reply: {
          answer: "Then take the one that stretches you, as long as the practical side works: money, time and where you'd live.",
          nextMove: "Check the practical downside of the growth option. If it's manageable, go for it.",
          followUps: ["What if I choose wrong?", "Can you be more direct?"],
        },
      },
      {
        match: /\b(choose|chose|pick|picked) (the )?wrong\b|\bwrong (one|choice|decision)\b/i,
        reply: {
          answer: "Then you'll adjust. Most choices like this can be changed, and even the wrong one shows you what you actually want.",
          nextMove: "Decide now what you'd do if it doesn't work out. Having a plan B makes the choice lighter.",
          followUps: ["What should I do first?", "Can you be more direct?"],
        },
      },
    ],
  },
  {
    id: "bad-decision",
    keywords: [
      /\b(bad|wrong|terrible|poor|stupid) (decision|choice|call)\b/i,
      /\bmistake/i,
      /\bregret/i,
      /\b(messed|screwed) (it |things )?up\b/i,
      /\bblew it\b/i,
      /\bshouldn'?t have\b/i,
    ],
    initial: initial({
      answer:
        "First, check whether it can still be changed. A lot of decisions can be softened or reversed more than it feels right now.",
      nextMove: "Write down what you'd change if you could, then check whether any of it is still possible this week.",
      followUps: ["It can't be undone.", "It affected someone else.", "How do I stop overthinking it?"],
      title: "Dealing with a decision you regret",
    }),
    direct: {
      answer: "Stop replaying it. Decide what you'd do differently, then do one thing today that moves you forward.",
      nextMove: "Write one sentence starting with \"Next time I'll…\", then act on the part you can still change.",
      followUps: ["It can't be undone.", "What should I do first?"],
    },
    firstStep: {
      answer: "Start with what's still in your control, not with what already happened.",
      nextMove: "List anything you could still change, fix or apologise for, and pick the easiest one.",
      followUps: ["It affected someone else.", "Can you be more direct?"],
    },
    words: {
      answer: "Keep it short, specific and without excuses.",
      scripts: ["I've been thinking about what happened, and I'm sorry. I'd like to make it right if I can."],
      nextMove: "Say it soon, and let them respond without defending yourself.",
      followUps: ["What if they're still upset?", "Can you be more direct?"],
    },
    extras: [
      {
        match: /\b(can'?t|cannot|can not) (be )?(undo|undone|reverse|reversed|take it back)|\birreversible\b|\btoo late\b|\bpermanent\b/i,
        reply: {
          answer: "Then focus on what you can still influence: how you respond now, and what you'd do differently next time.",
          nextMove: "Name one thing you can still do to make the outcome a little better, and do that.",
          followUps: ["How do I stop overthinking it?", "Can you be more direct?"],
        },
      },
      {
        match: /\bsomeone else\b|\baffected\b|\blet (them|him|her|people) down\b|\bhurt (someone|them|him|her|my)\b/i,
        reply: {
          answer: "Then tell them you're sorry, simply and directly. A clear apology matters more than a perfect one.",
          nextMove: "Apologise for the specific thing, without over-explaining.",
          scripts: ["I've been thinking about what happened, and I'm sorry. I'd like to make it right if I can."],
          followUps: ["Help me word the apology.", "What if they're still upset?"],
        },
      },
      {
        match: /\boverthink|\bcan'?t stop thinking\b|\bkeep thinking\b/i,
        reply: {
          answer: "Give the thinking a job: decide what you'd do differently, write it down, and let that be the lesson.",
          nextMove: "Write one sentence starting with \"Next time I'll…\", then do something that takes your mind off it.",
          followUps: ["It can't be undone.", "What should I do first?"],
        },
      },
    ],
  },
  {
    id: "expectations",
    keywords: [
      /\bexpect/i,
      /\b(parents?|family|mom|mum|dad) (want|wants|expects?)\b/i,
      /\bthey want me to\b/i,
      /\bpressure/i,
      /\bwhat i (actually |really )?want\b/i,
      /\bdisappoint/i,
      /\bapprov/i,
    ],
    initial: initial({
      answer:
        "Get clear on what you want and why first. Then talk to them early, before the decision gets made for you.",
      nextMove: "Write two sentences: what you want, and why it matters to you. Use them to start the conversation.",
      followUps: ["Help me explain it to them.", "Am I being selfish?", "What if they're disappointed?"],
      title: "What I want vs. what they expect",
    }),
    direct: {
      answer: "It's your life, so your view should count the most. Tell them soon, and show them you've thought it through.",
      nextMove: "Choose a calm time this week to tell them what you've decided, and why.",
      followUps: ["Help me explain it to them.", "What if they're disappointed?"],
    },
    firstStep: {
      answer: "Start with yourself: be clear on what you want before you try to explain it.",
      nextMove: "Write down what you want, why, and what you'd do if it doesn't work out.",
      followUps: ["Help me explain it to them.", "Am I being selfish?"],
    },
    words: {
      answer: "Lead with the fact that you care what they think, then say what you want.",
      scripts: [
        "I know you want the best for me, and I've thought about this a lot. I want to tell you what I'd like to do, and why.",
      ],
      nextMove: "Say it when there's time to talk, not in passing.",
      followUps: ["What if they're disappointed?", "Am I being selfish?"],
    },
    extras: [
      {
        match: /\bexplain\b/i,
        reply: {
          answer: "Lead with the fact that you care what they think, then say what you want.",
          scripts: [
            "I know you want the best for me, and I've thought about this a lot. I want to tell you what I'd like to do, and why.",
          ],
          nextMove: "Say it when there's time to talk, not in passing.",
          followUps: ["What if they're disappointed?", "Am I being selfish?"],
        },
      },
      {
        match: /\bselfish\b/i,
        reply: {
          answer: "No. Wanting a say in your own life isn't selfish. How you handle it matters more than the choice itself.",
          nextMove: "Show them you've thought it through, and that you care how they feel about it.",
          followUps: ["Help me explain it to them.", "What if they're disappointed?"],
        },
      },
      {
        match: /\bdisappoint/i,
        reply: {
          answer: "They might be, at first. Disappointment usually fades when people see you've thought it through and you're okay.",
          nextMove: "Tell them your plan, including what you'll do if it doesn't work out.",
          followUps: ["Help me explain it to them.", "Am I being selfish?"],
        },
      },
    ],
  },
];

/** For anything the scenarios above don't recognise. */
export const GENERAL_SCENARIO: DemoScenario = {
  id: "general",
  keywords: [],
  initial: initial({
    answer:
      "Start by separating what you know for sure from what you're worried might be true. That usually makes the next step clearer.",
    nextMove: "Write down what happened, what you want, and what's worrying you, as three short lists.",
    followUps: ["What should I do first?", "Can you be more direct?", "Help me talk to someone about it."],
    title: "Finding a way forward",
  }),
  direct: {
    answer: "Focus on the one part you can act on this week, and let the rest wait.",
    nextMove: "Pick the smallest step that would make things a little better, and do it today.",
    followUps: ["What should I do first?", "Help me talk to someone about it."],
  },
  firstStep: {
    answer: "Start with what's most urgent, not what's loudest.",
    nextMove: "Decide which part has a real deadline, and deal with that first.",
    followUps: ["Can you be more direct?", "Help me talk to someone about it."],
  },
  words: {
    answer: "Talking it through with someone you trust often makes it clearer.",
    scripts: ["Can I talk something through with you? I'm trying to figure out what to do."],
    nextMove: "Ask one person today.",
    followUps: ["What should I do first?", "Can you be more direct?"],
  },
  extras: [],
};

/** Follow-ups that work for any scenario. The engine decides which one a message is asking for. */
export const GENERIC_REPLIES = {
  notWhatIMeant: {
    answer: "Got it, I may have read that the wrong way.",
    question: "What's the part that matters most that I missed?",
    followUps: ["Can you be more direct?", "What should I do first?"],
  },
  alreadyTried: {
    answer: "Then that told you something useful: that approach alone isn't enough. Try a different angle, or a better moment.",
    nextMove: "Think about how it went when you tried. More direct or gentler, sooner or later: change one thing.",
    followUps: ["What should I do first?", "Can you be more direct?"],
  },
  othersDisagree: {
    answer: "Their disagreement is information, not a final verdict. Find out what they're actually worried about.",
    nextMove: "Ask what worries them most, and just listen the first time.",
    scripts: ["I know you're worried about this. Can you tell me what concerns you most? I want to understand."],
    followUps: ["What if they still say no?", "Help me word the message."],
  },
  otherOption: {
    answer: "Then you'd be choosing different trade-offs, not necessarily worse ones.",
    nextMove: "Picture yourself a year into the other option, and notice whether you feel relief or regret.",
    followUps: ["Can you be more direct?", "What should I do first?"],
  },
  whatIf: {
    answer: "Then you'll know more than you do now, and you can adjust. Very few outcomes here are final.",
    nextMove: "Decide now what you'd do if it happens. Having a plan B makes the worry smaller.",
    followUps: ["What should I do first?", "Can you be more direct?"],
  },
  after: {
    answer: "Once that's done, take stock: does it change which way you're leaning?",
    nextMove: "Take the first step, then come back and say what happened.",
    followUps: ["Can you be more direct?", "What should I do first?"],
  },
} satisfies Record<string, DemoReply>;

/** When nothing else matches, stay honest about what demo mode can do. */
export const FALLBACK_REPLY: DemoReply = {
  answer: "Demo mode can't adapt to new details the way the live AI does, so here's the most useful general step.",
  followUps: ["What should I do first?", "Can you be more direct?"],
};

// Patterns that suggest someone may be in danger. In demo mode these always get the support response.
export const CRISIS_PATTERNS: RegExp[] = [
  /\bsuicid/i,
  /\bkill(ing)? myself\b/i,
  /\bend (my life|it all)\b/i,
  /\b(want|wanting) to die\b/i,
  /\bdon'?t want to (live|be alive|be here anymore)\b/i,
  /\b(hurt|hurting|harm|harming|cut|cutting) myself\b/i,
  /\bself[- ]?harm/i,
  /\boverdos/i,
  /\bno reason to live\b/i,
  /\b(abus(es|ed|ing)|hits|beats|threatens) me\b/i,
  /\b(not|don'?t feel) safe at home\b/i,
  /\bscared for my (life|safety)\b/i,
];

const CRISIS_CARE =
  "If you're thinking about hurting yourself or you're in danger, please reach out right now: call your local emergency number, or a crisis line (988 in the US, or Samaritans on 116 123 in the UK and Ireland). You don't have to handle this alone.";

export const CRISIS_RESPONSE: LifeResponse = initial({
  care: CRISIS_CARE,
  answer: "I'm really glad you told me. Right now, the most important thing is that you're safe and not alone with this.",
  nextMove: "Contact someone right now: a crisis line, emergency services, or a person you trust. You can use the words below if it's hard to start.",
  scripts: ["I'm not doing okay and I need someone to talk to. Can you stay with me for a bit?"],
  title: "Getting support right now",
});

export const CRISIS_FOLLOW_UP: DemoReply = {
  care: CRISIS_CARE,
  answer: "I'm still here. The most important thing right now is talking to someone who can be with you in this.",
  nextMove: "Please reach out now to a crisis line, emergency services, or someone you trust, and tell them what you told me.",
};

/** For messages too short to work with, like "hi" or "help". */
export const CLARIFY_RESPONSE: LifeResponse = initial({
  answer: "Tell me a bit more, and I can actually help.",
  question: "What's happening, and what are you trying to decide, fix or figure out?",
  title: "Getting started",
});
