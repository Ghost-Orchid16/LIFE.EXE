// Pre-written responses used in DEMO MODE, when no AI key is configured.
// The interface labels every one of them as a demo response; none of this is presented as live AI.

import type { LifeOption, LifeResponse, SituationSnapshot } from "../../shared/contract.ts";

/** A follow-up answer. Anything left out is empty; the situation panel keeps the scenario's summary. */
export interface DemoReply {
  lead: string;
  nextMove: string;
  /** Short version of the next move for the situation panel. */
  nextMoveShort: string;
  whatsGoingOn?: string;
  whatMatters?: string[];
  whatsUnclear?: string[];
  questions?: string[];
  options?: LifeOption[];
  sayItLikeThis?: string[];
  followUps?: string[];
  care?: string;
}

export interface DemoScenario {
  id: string;
  /** Each pattern that matches the person's first message adds to the scenario's score. */
  keywords: RegExp[];
  initial: LifeResponse;
  direct: DemoReply;
  firstStep: DemoReply;
  words: DemoReply;
  /** Scenario-specific follow-ups, checked before the generic ones. */
  extras: Array<{ match: RegExp; reply: DemoReply }>;
}

const empty = {
  care: "",
  whatsGoingOn: "",
  whatMatters: [],
  whatsUnclear: [],
  lead: "",
  questions: [],
  options: [],
  sayItLikeThis: [],
  nextMove: "",
  followUps: [],
} satisfies Omit<LifeResponse, "situation">;

export function composeReply(reply: DemoReply, situation: SituationSnapshot): LifeResponse {
  const { nextMoveShort, ...fields } = reply;
  return { ...empty, ...fields, situation: { ...situation, nextMove: nextMoveShort } };
}

export const SCENARIOS: DemoScenario[] = [
  {
    id: "career",
    keywords: [/\bcareer/i, /\bpath\b/i, /\bmajor\b/i, /\bdegree\b/i, /\bstudy(ing)?\b/i, /\b(university|college)\b/i, /\bprofession/i, /\bwith my life\b/i],
    initial: {
      ...empty,
      whatsGoingOn:
        "You're trying to choose a career direction, and none of the options feels clearly right yet. That's common. Career choices feel huge because they look permanent, even though most paths change a lot along the way.",
      whatMatters: [
        "What kind of work actually holds your attention, not just what sounds impressive.",
        "How much security you need right now, and how much room you have to experiment.",
        "Which options keep other doors open if your interests shift.",
      ],
      whatsUnclear: [
        "Which paths you're weighing, and what draws you to each one.",
        "Whether the pressure is coming from a deadline, from other people, or from you.",
      ],
      lead: "You probably don't need to find the one right career. You need a good next step you can learn from.",
      options: [
        {
          title: "Test before you commit",
          detail: "Pick your top two directions and get a small, real taste of each: a short course, a project, or a conversation with someone who does the job.",
          upside: "You decide from experience instead of guesswork.",
          tradeoff: "It takes a few weeks, and some uncertainty stays while you test.",
        },
        {
          title: "Choose the flexible path",
          detail: "Go with the option that builds broadly useful skills and keeps the most doors open, then specialise later.",
          upside: "Much less pressure to get it perfect right now.",
          tradeoff: "It can feel less exciting, and you may face a similar choice later.",
        },
        {
          title: "Follow the strongest pull",
          detail: "If one direction keeps coming back to you, commit to it for a set period, like a year, and then reassess.",
          upside: "Real interest is a big advantage when things get hard.",
          tradeoff: "More risk if the practical side, like pay or job openings, doesn't work out.",
        },
      ],
      nextMove:
        "Write down your top two or three options. Next to each, note one thing that excites you and one thing that worries you. Then find one person who does that work and ask what a normal week is like.",
      followUps: ["What should I do first?", "Can you be more direct?", "My parents want something else."],
      situation: {
        title: "Choosing a career direction",
        summary: "You're weighing possible career paths, and none feels clearly right yet.",
        focus: "decision",
        matters: ["Genuine interest", "Security vs. room to explore", "Keeping doors open"],
        nextMove: "List your top options with one hope and one worry each.",
      },
    },
    direct: {
      lead: "If one direction keeps pulling at you, take it seriously and test it properly. Waiting for certainty usually just means waiting.",
      nextMove: "Pick the option you think about most and spend the next two weeks testing it: one short course, one real conversation, one small project.",
      nextMoveShort: "Test your strongest option for two weeks.",
      followUps: ["What should I do first?", "What if it doesn't work out?"],
    },
    firstStep: {
      lead: "Start small and concrete: get real information about one path before trying to decide between all of them.",
      nextMove: "Today, find one person who works in the field you're most curious about and ask for fifteen minutes to hear what their normal week looks like.",
      nextMoveShort: "Ask one person in the field about their normal week.",
      followUps: ["Help me word the message.", "Can you be more direct?"],
    },
    words: {
      lead: "Here's how you could ask someone for a quick conversation about their work. Most people are happy to help when the ask is small and specific.",
      sayItLikeThis: [
        "Hi, I'm trying to figure out my next step and I'm curious about your field. Could I ask you a few questions about what your work is actually like?",
        "What surprised you most when you started, and what do you wish you'd known?",
      ],
      nextMove: "Send one message like this to someone whose work interests you.",
      nextMoveShort: "Message one person whose work interests you.",
      followUps: ["What if they don't reply?", "What should I do first?"],
    },
    extras: [],
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
    initial: {
      ...empty,
      whatsGoingOn:
        "A friend has gone quiet for a few days and you're not sure why. Silence is uncomfortable, and it's easy to fill the gap with the worst explanation. Right now, all you actually know is that they haven't been in touch.",
      whatMatters: [
        "What you know: they haven't talked to you for a few days. What you might be assuming: that it's about you.",
        "Whether this is unusual for them, or how they normally get when life is busy or hard.",
        "Whether anything happened between you recently that might have landed badly.",
      ],
      whatsUnclear: [
        "Why they've gone quiet. It could be stress, something in their own life, or something between you.",
        "Whether they've been quiet with everyone or just with you.",
      ],
      lead: "There are several possible explanations, and many of them have nothing to do with you. The simplest way to find out is a low-pressure check-in.",
      options: [
        {
          title: "Send a light check-in",
          detail: "Message them something easy that doesn't demand an explanation, like asking how they're doing.",
          upside: "It opens the door without pressure or blame.",
          tradeoff: "If something is wrong between you, it may take more than one message to surface.",
        },
        {
          title: "Ask directly",
          detail: "If something did happen between you, name it gently and ask whether you're okay.",
          upside: "You get clarity faster.",
          tradeoff: "It can feel intense if the silence turns out to be about something else entirely.",
        },
        {
          title: "Give it a little more time",
          detail: "If going quiet is normal for them during busy stretches, wait a few more days before reaching out.",
          upside: "It respects their space.",
          tradeoff: "The worry may keep building while you wait.",
        },
      ],
      sayItLikeThis: ["Hey, haven't heard from you in a bit. Everything okay?"],
      nextMove: "Send one short, friendly check-in today, with no pressure attached. Then give them a day or two to reply before reading anything into it.",
      followUps: ["What if they don't reply?", "I think I upset them.", "Help me word the message."],
      situation: {
        title: "A friend has gone quiet",
        summary: "A friend hasn't been in touch for a few days, and the reason isn't clear.",
        focus: "relationship",
        matters: ["Facts vs. assumptions", "What's normal for them", "Any recent friction"],
        nextMove: "Send one low-pressure check-in message today.",
      },
    },
    direct: {
      lead: "Don't sit and guess. A short, friendly check-in is the clearest way to find out what's going on.",
      nextMove: "Send the check-in today. If there's no reply in two or three days, it's okay to ask once more, directly and kindly.",
      nextMoveShort: "Send a friendly check-in today.",
      followUps: ["Help me word the message.", "What if they don't reply?"],
    },
    firstStep: {
      lead: "First, check your own read of it: is this unusual for them, or just a busy week?",
      nextMove: "Look back at your last conversation. If nothing stands out, send a light check-in. If something does, acknowledge it in your message.",
      nextMoveShort: "Review your last conversation, then check in.",
      followUps: ["I think I upset them.", "Help me word the message."],
    },
    words: {
      lead: "Keep it short and easy to reply to. The goal is to open a door, not to demand an explanation.",
      sayItLikeThis: [
        "Hey, haven't heard from you in a few days. Everything okay?",
        "No pressure to reply quickly, I just wanted to check in on you.",
        "If I said something that bothered you, I'd rather hear it than guess.",
      ],
      nextMove: "Pick the version that sounds most like you and send it today.",
      nextMoveShort: "Send a short check-in message.",
      followUps: ["What if they don't reply?", "I think I upset them."],
    },
    extras: [
      {
        match: /\b(upset|hurt|offend(ed)?|annoyed|said something|fight|fought|argu(e|ed|ment))\b/i,
        reply: {
          lead: "If you think you upset them, that's worth naming. People usually respond better to a simple acknowledgement than to silence on both sides.",
          whatMatters: [
            "Acknowledging it without over-explaining or defending yourself.",
            "Giving them room to respond in their own time.",
          ],
          sayItLikeThis: [
            "I've been thinking about what I said, and I think it might have hurt you. I'm sorry. I'd like to talk if you're up for it.",
          ],
          nextMove: "Send a short, sincere acknowledgement. Don't argue your side yet; just open the door.",
          nextMoveShort: "Send a short, sincere acknowledgement.",
          followUps: ["What if they don't reply?", "What should I do first?"],
        },
      },
      {
        match: /\b(don'?t|doesn'?t|won'?t|never|no) (reply|replies|respond|answer)/i,
        reply: {
          lead: "Then you've done your part. No reply tells you they're not ready to talk yet; it doesn't tell you why.",
          whatsUnclear: ["Whether they've seen your message, or just aren't ready to answer."],
          nextMove: "Give it two or three days. Then try once more, or ask a mutual friend whether they're okay, without asking them to pass on messages.",
          nextMoveShort: "Wait two or three days, then try once more.",
          followUps: ["Can you be more direct?", "I think I upset them."],
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
    initial: {
      ...empty,
      whatsGoingOn:
        "There's a conversation you know you need to have, and it's been hard to start. That usually means something important is at stake: the relationship, your feelings, or an outcome you need.",
      whatMatters: [
        "What you actually want to come out of the conversation.",
        "Timing and setting: private, unhurried, and not in the middle of an argument.",
        "Leading with your own experience rather than accusations.",
      ],
      whatsUnclear: [
        "Who the conversation is with, and what it's about.",
        "How the other person usually reacts to hard topics.",
      ],
      lead: "Difficult conversations go better when you know the one thing you need the other person to understand. Start there, not with everything at once.",
      questions: ["Who is the conversation with, and what's the main thing you need them to hear?"],
      options: [
        {
          title: "Plan it, then have it soon",
          detail: "Write down your main point and one example, pick a calm moment, and have the conversation this week.",
          upside: "Preparation keeps you clear and steady.",
          tradeoff: "Over-planning can make it sound scripted, so keep your notes short.",
        },
        {
          title: "Open the door first",
          detail: "Tell them there's something you'd like to talk about, and agree on a time.",
          upside: "No ambush: they get a moment to prepare too.",
          tradeoff: "They might worry in the meantime, so keep the gap short.",
        },
        {
          title: "Start in writing",
          detail: "If talking face to face feels impossible, start with a message or letter, then follow up in person.",
          upside: "You can say exactly what you mean.",
          tradeoff: "Tone is easy to misread in writing.",
        },
      ],
      sayItLikeThis: [
        "There's something I've been wanting to talk about. It matters to me, so can we find a time this week?",
        "I'm not trying to blame you. I just want you to understand how this has felt for me.",
      ],
      nextMove: "Write one sentence that captures what you need them to understand. If you can say it in one sentence, you're ready to start.",
      followUps: ["It's with my parents.", "What if it turns into an argument?", "What should I say first?"],
      situation: {
        title: "A conversation that needs to happen",
        summary: "You need to have a difficult conversation, and it's been hard to start.",
        focus: "conversation",
        matters: ["Your main point", "Timing and setting", "Staying non-accusatory"],
        nextMove: "Write the one sentence you need them to understand.",
      },
    },
    direct: {
      lead: "Have the conversation this week. Waiting for the perfect moment usually makes it harder, not easier.",
      nextMove: "Choose a day and a private, unhurried setting, and tell them in advance that you'd like to talk.",
      nextMoveShort: "Pick a day this week and ask for time to talk.",
      followUps: ["What should I say first?", "What if it turns into an argument?"],
    },
    firstStep: {
      lead: "Before planning what to say, get clear on the one thing you need them to understand.",
      nextMove: "Write that one sentence down. Then add one specific example that shows what you mean.",
      nextMoveShort: "Write your main point in one sentence.",
      followUps: ["What should I say first?", "Can you be more direct?"],
    },
    words: {
      lead: "Start calm and specific. Lead with how it affects you, not with what they did wrong.",
      sayItLikeThis: [
        "There's something I've been wanting to talk about. Is now an okay time?",
        "When [this happens], I feel [this]. I'd like us to find a way to handle it differently.",
        "I'm not trying to blame you. I just want you to understand where I'm coming from.",
      ],
      nextMove: "Fill in the brackets with your situation, and read it aloud once before the conversation.",
      nextMoveShort: "Adapt the opening lines to your situation.",
      followUps: ["What if it turns into an argument?", "It's with my parents."],
    },
    extras: [
      {
        match: /\b(parents?|mom|mum|dad|mother|father|family)\b/i,
        reply: {
          lead: "Conversations with parents often go better when they feel respected and informed, not surprised or challenged.",
          whatMatters: [
            "Choosing a calm moment, not during an argument or when they're rushed.",
            "Showing you've thought it through, especially if it's about a decision they care about.",
          ],
          sayItLikeThis: ["I want to talk to you about something that's important to me. I'd really like you to hear me out before you respond."],
          nextMove: "Ask them for a specific time to talk, and go in with your main point and one example.",
          nextMoveShort: "Ask your parents for a set time to talk.",
          followUps: ["What if it turns into an argument?", "What should I say first?"],
        },
      },
      {
        match: /\b(argument|argue|fight|angry|yell|shout)/i,
        reply: {
          lead: "Then pause it. A conversation that stops and resumes calmly is better than one that escalates.",
          sayItLikeThis: ["I don't want this to turn into a fight. Can we take a break and come back to it tomorrow?"],
          nextMove: "Decide in advance that if voices rise, you'll pause and suggest a time to continue.",
          nextMoveShort: "Plan to pause if it gets heated.",
          followUps: ["What should I say first?", "Can you be more direct?"],
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
    initial: {
      ...empty,
      whatsGoingOn:
        "You have two real options in front of you and you're stuck between them. That usually means both have something genuinely good about them, or both come with a cost you're not sure you want to pay.",
      whatMatters: [
        "Which one fits what you want over the next year or two, not forever.",
        "What each one costs you: time, money, relationships, or other options.",
        "Whether either choice could be changed or undone later.",
      ],
      whatsUnclear: [
        "What the two opportunities are, and what pulls you toward each.",
        "How much time you have to decide.",
      ],
      lead: "Both could be good choices. Which one is right for you depends mostly on one thing, so start there before comparing details.",
      questions: ["Which matters more to you right now: stability or growth?"],
      options: [
        {
          title: "Compare what matters most",
          detail: "List your top three priorities, then rate each opportunity against them honestly.",
          upside: "Turns a vague feeling into something you can see.",
          tradeoff: "Scores can hide gut feelings, so notice how you react to the result.",
        },
        {
          title: "Imagine a year in each",
          detail: "Picture an ordinary Tuesday a year from now in each option. Notice which day you'd rather be living.",
          upside: "Brings out what you actually want, not just what sounds impressive.",
          tradeoff: "Imagination tends to be optimistic about the unfamiliar option.",
        },
        {
          title: "Get the missing facts",
          detail: "If one option has a big unknown, like pay, workload or location, ask about it before deciding.",
          upside: "Better information often makes the choice obvious.",
          tradeoff: "It can slow things down if there's a deadline.",
        },
      ],
      nextMove: "Write both options side by side, and for each one answer three questions: what do I gain, what do I give up, and can I undo it later?",
      followUps: ["Stability matters more.", "Growth matters more.", "What if I choose wrong?"],
      situation: {
        title: "Choosing between two opportunities",
        summary: "You're deciding between two options and feel stuck between them.",
        focus: "decision",
        matters: ["Stability vs. growth", "What each one costs", "Reversibility"],
        nextMove: "Compare gains, costs and reversibility side by side.",
      },
    },
    direct: {
      lead: "Choose the option you'd regret not taking. If they're genuinely close, the one that teaches you more is usually the better bet at this stage.",
      nextMove: "Write down which option you'd regret passing on a year from now. If the answer comes quickly, that's your choice.",
      nextMoveShort: "Name the option you'd regret passing on.",
      followUps: ["What if I choose wrong?", "What should I do first?"],
    },
    firstStep: {
      lead: "First, find out whether you're missing any key facts. Unknowns often make a choice feel harder than it is.",
      nextMove: "List anything you don't know yet about either option (pay, hours, location, people) and ask about the most important one this week.",
      nextMoveShort: "Ask about the biggest unknown this week.",
      followUps: ["Help me ask for more time.", "Can you be more direct?"],
    },
    words: {
      lead: "If you need more information or more time, it's completely normal to ask for it.",
      sayItLikeThis: [
        "I'm really interested in this. Could you tell me more about what a typical week would look like?",
        "I'd like to give you a considered answer. Would it be possible to have until [date] to decide?",
      ],
      nextMove: "Send one message asking for the missing information or a short extension.",
      nextMoveShort: "Ask for missing details or more time.",
      followUps: ["What if I choose wrong?", "Can you be more direct?"],
    },
    extras: [
      {
        match: /\b(stabil|secur|safe|steady|reliable)/i,
        reply: {
          lead: "Then lean toward the option that gives you a steadier base: reliable income, clear expectations and less risk. You can still grow from a stable position.",
          whatMatters: [
            "Which option is more predictable over the next year.",
            "Whether the steadier option still leaves some room to learn.",
          ],
          nextMove: "Check which option is more secure on paper, then ask yourself whether you could see yourself there for at least a year.",
          nextMoveShort: "Confirm which option is more secure.",
          followUps: ["What if I choose wrong?", "What should I do first?"],
        },
      },
      {
        match: /\b(grow|growth|learn|challeng|excit|stretch)/i,
        reply: {
          lead: "Then lean toward the option that will stretch you most, as long as you can handle the risk if it doesn't work out.",
          whatMatters: [
            "Which option teaches you more, faster.",
            "Whether you have a safety net if the riskier choice doesn't work out.",
          ],
          nextMove: "Pick the option that will teach you the most, and write down your plan B in case it doesn't go as hoped.",
          nextMoveShort: "Choose the stretch option and note a plan B.",
          followUps: ["What if I choose wrong?", "What should I do first?"],
        },
      },
      {
        match: /\b(choose|chose|pick|picked) (the )?wrong\b|\bwrong (one|choice|decision)\b/i,
        reply: {
          lead: "Most choices like this are less permanent than they feel. A \"wrong\" choice usually teaches you exactly what to look for next time.",
          whatMatters: [
            "Whether either option can be changed or undone later.",
            "What you would do if the choice didn't work out.",
          ],
          nextMove: "For each option, write down what you'd do if it didn't work out. If both have a plan B, the stakes are lower than they feel.",
          nextMoveShort: "Write a plan B for each option.",
          followUps: ["Can you be more direct?", "What should I do first?"],
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
    initial: {
      ...empty,
      whatsGoingOn:
        "You made a decision that's now sitting badly with you. Regret tends to make a decision look worse than it was, and the outcome feel more final than it usually is.",
      whatMatters: [
        "Whether it can still be changed, softened or undone.",
        "Separating what actually went wrong from how bad it feels right now.",
        "What you knew when you made the decision, not what you know now.",
      ],
      whatsUnclear: [
        "What the decision was, and what has happened since.",
        "Whether other people are affected by it.",
      ],
      lead: "A decision that feels bad isn't always a bad decision. And even when it is, there's usually more you can do than it feels like right now.",
      options: [
        {
          title: "Check whether it's reversible",
          detail: "Find out whether you can undo, pause or adjust it, and by when.",
          upside: "You might have more options than you think.",
          tradeoff: "Reversing it can have its own costs, so weigh them first.",
        },
        {
          title: "Repair what you can",
          detail: "If it affected someone else, acknowledge it directly and offer a fix where possible.",
          upside: "Taking ownership often rebuilds trust quickly.",
          tradeoff: "It means facing an uncomfortable conversation.",
        },
        {
          title: "Make it work from here",
          detail: "If it can't be undone, focus on the best version of the path you're now on.",
          upside: "Moves your energy from regret to action.",
          tradeoff: "It may mean accepting a loss before you feel ready to.",
        },
      ],
      nextMove: "Write down what happened, what you knew at the time, and what can still be changed. Keep it factual, not a verdict on yourself.",
      followUps: ["It can't be undone.", "Someone else was affected.", "What should I do first?"],
      situation: {
        title: "Dealing with a decision you regret",
        summary: "You made a decision that now feels wrong, and you're unsure what to do about it.",
        focus: "setback",
        matters: ["What can still change", "Facts vs. feelings", "Who is affected"],
        nextMove: "Write down what happened and what can still change.",
      },
    },
    direct: {
      lead: "Stop replaying it and act on what's still in your control. Regret is useful for about a day; after that it mostly gets in the way.",
      nextMove: "Pick one thing you can still change or repair, and do it this week.",
      nextMoveShort: "Do one repair or fix this week.",
      followUps: ["It can't be undone.", "Someone else was affected."],
    },
    firstStep: {
      lead: "Start with facts, not judgment. You can't decide what to do until you're clear on what actually happened.",
      nextMove: "Write three lines: what you decided, what happened because of it, and what is still changeable.",
      nextMoveShort: "Write down what happened and what's changeable.",
      followUps: ["It can't be undone.", "Can you be more direct?"],
    },
    words: {
      lead: "If this affected someone else, a clear and simple acknowledgement goes a long way.",
      sayItLikeThis: [
        "I made a call that didn't work out, and I know it affected you. I'm sorry. Here's what I'm doing to fix it.",
        "I got this wrong, and I'd like to make it right. What would help?",
      ],
      nextMove: "Say it soon, keep it short, and follow it with something concrete.",
      nextMoveShort: "Acknowledge it and offer a concrete fix.",
      followUps: ["What should I do first?", "Can you be more direct?"],
    },
    extras: [
      {
        match: /\b(can'?t|cannot|can not) (be )?(undo|undone|reverse|take it back)|\birreversible\b|\btoo late\b|\bpermanent\b/i,
        reply: {
          lead: "Then the question shifts from \"how do I undo it?\" to \"what's the best I can make of where I am now?\" That's often the more useful question anyway.",
          whatMatters: ["What you can still influence from here.", "What this taught you for next time."],
          options: [
            {
              title: "Make the most of it",
              detail: "Look for the best outcome still available on the path you're on now.",
              upside: "Turns regret into direction.",
              tradeoff: "It means accepting the loss before you fully feel ready to.",
            },
            {
              title: "Limit the damage",
              detail: "Identify the biggest knock-on effect and deal with that first.",
              upside: "Stops a bad situation from growing.",
              tradeoff: "It won't feel like progress, even though it is.",
            },
          ],
          nextMove: "Write down the best realistic outcome from where you are now, and one step toward it.",
          nextMoveShort: "Name the best outcome still available.",
          followUps: ["What should I do first?", "Someone else was affected."],
        },
      },
      {
        match: /\bsomeone else\b|\baffected\b|\blet (them|him|her|people) down\b|\bhurt (someone|them|him|her|my)\b/i,
        reply: {
          lead: "Then repairing things with them matters more than judging the decision in hindsight.",
          whatMatters: [
            "Acknowledging the impact on them, not just your intentions.",
            "Offering something concrete, not only an apology.",
          ],
          sayItLikeThis: ["I know my decision affected you, and I'm sorry. What can I do to make it better?"],
          nextMove: "Talk to them this week. Acknowledge the impact, apologise once, and offer a concrete fix.",
          nextMoveShort: "Acknowledge the impact and offer a fix.",
          followUps: ["What if they're still angry?", "What should I do first?"],
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
    initial: {
      ...empty,
      whatsGoingOn:
        "You're caught between what you want and what the people around you expect. That's hard, especially when those people matter to you and their expectations come from care.",
      whatMatters: [
        "How clearly you know what you want, and why.",
        "What's actually at stake with the people involved: disappointment, conflict, or real consequences.",
        "Whether there's a middle path that respects both.",
      ],
      whatsUnclear: [
        "Who holds these expectations, and how firmly.",
        "Whether they fully know what you want, or are guessing.",
      ],
      lead: "This is less about choosing between you and them, and more about how much of your own direction you're ready to own, and how to explain it.",
      options: [
        {
          title: "Make your case",
          detail: "Explain what you want and why, with specifics that show you've thought it through.",
          upside: "People often soften when they see real thought behind a choice.",
          tradeoff: "They may still disagree, at least at first.",
        },
        {
          title: "Find a middle path",
          detail: "Look for an option that meets their core concern, usually security or reputation, while keeping what matters most to you.",
          upside: "Reduces conflict and keeps relationships steady.",
          tradeoff: "A compromise can leave you only half-committed.",
        },
        {
          title: "Try it on a timeline",
          detail: "Propose trying your path for a set period, with an agreed check-in point.",
          upside: "Makes your choice feel less like a risky leap to them.",
          tradeoff: "You'll need to be honest at the check-in, even if it isn't going well.",
        },
      ],
      sayItLikeThis: [
        "I know you want what's best for me, and I've thought about this seriously. Can I walk you through why it matters to me?",
      ],
      nextMove: "Write down, in two or three sentences, what you want and why. If you can't explain it to yourself yet, start there before talking to anyone else.",
      followUps: ["My parents won't agree.", "Help me talk to them.", "Am I being selfish?"],
      situation: {
        title: "Your wants vs. others' expectations",
        summary: "You feel pulled between what you want and what people close to you expect.",
        focus: "pressure",
        matters: ["Clarity on what you want", "What's really at stake", "A possible middle path"],
        nextMove: "Write down what you want and why, in a few sentences.",
      },
    },
    direct: {
      lead: "If you're clear on what you want and why, it's worth owning it. Other people's expectations matter, but they can't live your life for you.",
      nextMove: "Decide what you want, then tell the people involved, calmly and with your reasons.",
      nextMoveShort: "Decide, then explain your reasons calmly.",
      followUps: ["Help me talk to them.", "Am I being selfish?"],
    },
    firstStep: {
      lead: "Get clear on your own position before you try to explain it to anyone else.",
      nextMove: "Write down what you want, why it matters to you, and what worries you about it. Be honest about the worries too.",
      nextMoveShort: "Write down what you want and why.",
      followUps: ["Help me talk to them.", "Can you be more direct?"],
    },
    words: {
      lead: "Start by showing you understand their side. People listen better once they feel heard.",
      sayItLikeThis: [
        "I know you want what's best for me, and I appreciate that.",
        "I've thought about this seriously, and this is what I want to do, and why.",
        "Can we talk about what worries you about it?",
      ],
      nextMove: "Use these as a starting point, and pick a calm moment rather than the middle of a disagreement.",
      nextMoveShort: "Plan a calm conversation using these lines.",
      followUps: ["My parents won't agree.", "What if it turns into an argument?"],
    },
    extras: [
      {
        match: /\bselfish\b/i,
        reply: {
          lead: "Wanting a say in your own life isn't selfish. It can feel that way when you care about the people you might disappoint.",
          whatMatters: [
            "Considering other people's feelings is different from being ruled by them.",
            "You can make your own choice and still be kind in how you share it.",
          ],
          nextMove: "Write down what you'd choose if no one would be disappointed. That answer tells you what you actually want.",
          nextMoveShort: "Name what you'd choose without the pressure.",
          followUps: ["Help me talk to them.", "My parents won't agree."],
        },
      },
    ],
  },
];

/** Used when a situation doesn't match any scenario. */
export const GENERAL_SCENARIO: DemoScenario = {
  id: "general",
  keywords: [],
  initial: {
    ...empty,
    whatsGoingOn:
      "You're dealing with something that's weighing on you, and the way forward isn't clear yet. When a situation feels tangled, it helps to separate the facts from the worries around them.",
    whatMatters: [
      "What you actually want to happen, even if it feels out of reach.",
      "What's in your control, and what isn't.",
      "How soon something needs to happen.",
    ],
    whatsUnclear: ["The specifics. The more detail you share, the more specific the help can be."],
    lead: "Let's untangle it. Start by separating what you know for sure from what you're worried might be true.",
    options: [
      {
        title: "Get it out of your head",
        detail: "Write down what happened, what you want, and what's worrying you, as three separate lists.",
        upside: "Things usually look more manageable on paper.",
        tradeoff: "It doesn't solve anything on its own; it's a starting point.",
      },
      {
        title: "Talk it through with someone",
        detail: "Pick one person you trust and explain the situation out loud.",
        upside: "Saying it out loud often shows you what really matters.",
        tradeoff: "Choose someone who listens, not someone who takes over.",
      },
      {
        title: "Take one small action",
        detail: "Choose the smallest step that would move things forward, and do it today.",
        upside: "Momentum makes anxiety smaller.",
        tradeoff: "A small step won't fix everything, but it breaks the stuck feeling.",
      },
    ],
    nextMove: "Write three lines: what happened, what you want, and what worries you most. Then share a little more here so the advice can get more specific.",
    followUps: ["What should I do first?", "Can you be more direct?"],
    situation: {
      title: "Finding a way forward",
      summary: "Something is weighing on you, and the way forward isn't clear yet.",
      focus: "uncertainty",
      matters: ["What you want", "What you control", "Timing"],
      nextMove: "Write down what happened, what you want, and what worries you.",
    },
  },
  direct: {
    lead: "Pick the smallest action that moves things forward and do it today. Clarity usually comes from movement, not from more thinking.",
    nextMove: "Choose one small, concrete step you can take today, and take it before you overthink it.",
    nextMoveShort: "Take one small concrete step today.",
    followUps: ["What should I do first?", "Help me with what to say."],
  },
  firstStep: {
    lead: "First, get it out of your head and onto paper. It's much easier to see a way forward once the situation is in front of you.",
    nextMove: "Write three lines: what happened, what you want, and what worries you most.",
    nextMoveShort: "Write down what happened, what you want, what worries you.",
    followUps: ["Can you be more direct?", "Help me with what to say."],
  },
  words: {
    lead: "If this involves someone else, opening simply and honestly is usually the best start.",
    sayItLikeThis: [
      "There's something on my mind that I'd like to talk through with you. Do you have a few minutes?",
      "I'm not sure how to say this perfectly, but it matters to me, so I'm going to try.",
    ],
    nextMove: "Pick the line that fits and use it to start the conversation this week.",
    nextMoveShort: "Start the conversation this week.",
    followUps: ["What if it goes badly?", "What should I do first?"],
  },
  extras: [],
};

/** Follow-ups that work for any scenario. The engine decides which one a message is asking for. */
export const GENERIC_REPLIES = {
  notWhatIMeant: {
    lead: "Got it. I may have read that the wrong way.",
    questions: ["What's the part that matters most that I missed?"],
    nextMove: "Tell me what I got wrong in a sentence or two, and I'll adjust.",
    nextMoveShort: "Clarify what was missed.",
    followUps: ["Can you be more direct?", "What should I do first?"],
  },
  alreadyTried: {
    lead: "Then that attempt has already told you something useful: on its own, that approach isn't enough.",
    whatMatters: [
      "What happened when you tried it, and how others reacted.",
      "Whether it failed because of the approach itself, or because of the timing.",
    ],
    options: [
      {
        title: "Change the approach",
        detail: "Try a different angle: more direct if you were subtle, gentler if you were direct.",
        upside: "A new approach can get a different result.",
        tradeoff: "It can feel like starting over.",
      },
      {
        title: "Change the timing",
        detail: "Wait for a calmer moment or a natural opening before trying again.",
        upside: "The same message can land very differently at a better time.",
        tradeoff: "Waiting can be frustrating.",
      },
    ],
    nextMove: "Think about what happened when you tried it. How it went changes what makes sense next.",
    nextMoveShort: "Look at why the first attempt didn't work.",
    followUps: ["What should I do first?", "Help me with what to say."],
  },
  othersDisagree: {
    lead: "Their disagreement is information, not a final verdict. It helps to understand what they're actually worried about.",
    whatMatters: [
      "What their concern really is: security, reputation, or fear of you getting hurt.",
      "Whether you need their approval, or mainly their understanding.",
    ],
    whatsUnclear: ["Whether they've heard your full reasoning yet."],
    options: [
      {
        title: "Understand their worry first",
        detail: "Ask what concerns them most, and listen without arguing the first time.",
        upside: "People soften when they feel heard.",
        tradeoff: "It may take more than one conversation.",
      },
      {
        title: "Show them a plan",
        detail: "Answer their main worry directly with a concrete plan, including a fallback.",
        upside: "A plan reduces fear better than reassurance does.",
        tradeoff: "It takes some preparation.",
      },
    ],
    sayItLikeThis: ["I know you're worried about this. Can you tell me what concerns you most? I want to understand."],
    nextMove: "Ask them what worries them most, and just listen the first time.",
    nextMoveShort: "Ask what worries them most, and listen.",
    followUps: ["Help me talk to them.", "What if they still say no?"],
  },
  otherOption: {
    lead: "Then you'd be choosing a different set of trade-offs, not necessarily a worse one.",
    whatMatters: [
      "What you'd gain that the first option doesn't give you.",
      "What you'd give up, and whether you could get it back later.",
    ],
    nextMove: "Picture yourself a year into the other option. Notice whether you feel relief or regret; that reaction is useful information.",
    nextMoveShort: "Imagine a year into the other option.",
    followUps: ["Can you be more direct?", "What should I do first?"],
  },
  whatIf: {
    lead: "Then you'll know more than you do now, and you can adjust. Very few outcomes here are final.",
    whatsUnclear: ["How likely that outcome really is. Worry tends to make it feel more certain than it is."],
    nextMove: "Decide now what you'd do if it happens. Having a plan B makes the worry smaller.",
    nextMoveShort: "Plan what you'd do if it happens.",
    followUps: ["What should I do first?", "Can you be more direct?"],
  },
  after: {
    lead: "Once that's done, take stock: what did you learn, and does it change which way you're leaning?",
    nextMove: "After the first step, come back and say what happened. The next move depends on it.",
    nextMoveShort: "Take the first step, then take stock.",
    followUps: ["Can you be more direct?", "Help me with what to say."],
  },
} satisfies Record<string, DemoReply>;

/** When nothing else matches, stay honest about what demo mode can do. */
export const FALLBACK_REPLY: DemoReply = {
  lead: "That's useful context. Demo mode can't adapt its advice to new details the way the live AI does, so here's the most useful general step for this situation.",
  nextMove: "",
  nextMoveShort: "",
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

export const CRISIS_RESPONSE: LifeResponse = {
  ...empty,
  care: "If you're thinking about hurting yourself or you're in danger, please reach out right now: call your local emergency number, or a crisis line (988 in the US, or Samaritans on 116 123 in the UK and Ireland). You don't have to handle this alone.",
  whatsGoingOn: "It sounds like you're going through something really heavy right now.",
  whatMatters: [
    "Your safety comes first, before any decision or plan.",
    "Talking to a real person today, even briefly.",
  ],
  lead: "I'm really glad you said something. Right now, the most important thing is that you're safe and not alone with this.",
  sayItLikeThis: ["I'm not doing okay and I need someone to talk to. Can you stay with me for a bit?"],
  nextMove: "Contact someone right now: a crisis line, emergency services, or a person you trust. You can use the words above if it's hard to start.",
  situation: {
    title: "Getting support right now",
    summary: "You're going through something heavy. Safety and support come first.",
    focus: "support",
    matters: ["Your safety", "Reaching a real person"],
    nextMove: "Reach out to a crisis line or someone you trust now.",
  },
};

export const CRISIS_FOLLOW_UP: DemoReply = {
  care: CRISIS_RESPONSE.care,
  lead: "I'm still here. The most important thing right now is talking to someone who can be there with you in this.",
  nextMove: "Please reach out now to a crisis line, emergency services, or someone you trust, and tell them what you told me.",
  nextMoveShort: "Reach out to a crisis line or someone you trust now.",
};

/** For messages too short to work with, like "hi" or "help". */
export const CLARIFY_RESPONSE: LifeResponse = {
  ...empty,
  lead: "Tell me a bit more, and I can actually help.",
  questions: ["What's happening, and what are you trying to decide, fix or figure out?"],
  nextMove: "Describe the situation in a few sentences: who's involved, what happened, and what you're hoping for.",
  followUps: [],
  situation: {
    title: "Getting started",
    summary: "Not enough detail yet to help properly.",
    focus: "uncertainty",
    matters: ["What happened", "What you want"],
    nextMove: "Share a few sentences about the situation.",
  },
};
