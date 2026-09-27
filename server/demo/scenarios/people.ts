// Demo mode: friends, family and other people.

import { initial, type DemoReply, type DemoScenario } from "../scenario.ts";

const kindWords: DemoReply = {
  answer: "A few simple, friendly words can mean a lot to someone who's being teased.",
  scripts: [
    "Hey, want to sit with us at lunch?",
    "That wasn't okay earlier. You alright?",
    "I thought that was out of order. Want to walk to class together?",
  ],
  nextMove: "Say one of these the next time you see them on their own.",
  followUps: ["What if they turn on me?", "Should I tell a teacher?"],
};

export const PEOPLE_SCENARIOS: DemoScenario[] = [
  {
    id: "friend-mad",
    example: "My friend has been distant lately. Are they angry with me?",
    keywords: [
      /\b(angry|mad|upset|annoyed|cross|pissed off) (with|at) me\b/i,
      /\b(is|are) (my )?(\w+ )?(friends?|they|he|she|mate)\b[^.?!]*\b(angry|mad|upset|annoyed|cross)\b|\b(friend|they|he|she)('s| is| are|'re) (so |really |still )?(angry|mad|annoyed|cross)\b|\bdid i do something\b/i,
      /\bdistant\b|\bacting (weird|different|off|cold|strange|distant)\b|\b(cold|off|weird) (with|towards) me\b/i,
    ],
    related: [/\bfriend/i],
    initial: initial({
      answer:
        "You can't tell from distance alone. They might be busy, dealing with something of their own, or upset about something; the only way to know is to ask, gently.",
      points: [
        "Think back: did anything happen, like a disagreement or a cancelled plan?",
        "Notice whether it's just you or everyone they've gone quiet with.",
        "Ask in a way that's easy to answer honestly.",
      ],
      nextMove: "Send one low-pressure message asking if everything's okay between you, and give them time to reply.",
      scripts: ["Hey, I feel like we haven't talked much lately. Is everything okay with you? And between us?"],
      followUps: ["What if they say everything's fine?", "What if I did upset them?", "Should I ask in person?"],
      title: "Wondering if a friend is upset",
    }),
    direct: {
      answer: "Ask them. It's the only way to know, and one friendly question isn't a big deal.",
      nextMove: "Message them today and ask if everything's okay.",
      followUps: ["What if they say everything's fine?", "What if I did upset them?"],
    },
    firstStep: {
      answer: "Start by thinking back over the last few weeks: did anything happen between you that they might have minded?",
      nextMove: "Note anything that comes to mind, then ask them directly.",
      followUps: ["What if I did upset them?", "Should I ask in person?"],
    },
    words: {
      answer: "Keep it light, and make it easy for them to answer either way.",
      scripts: [
        "Hey, I feel like we haven't talked much lately. Is everything okay?",
        "Have I done something to upset you? If I have, I'd rather know.",
        "Just checking in. Are we good?",
      ],
      nextMove: "Pick the one that sounds like you, and send it today.",
      followUps: ["What if they say everything's fine?", "Should I ask in person?"],
    },
    extras: [
      {
        match: /\bfine\b|\bnothing'?s wrong\b|\beverything'?s (okay|ok)\b/i,
        reply: {
          answer:
            "Then take it at face value for now, and keep being friendly as normal. If things still feel off in a few weeks, you can ask again.",
          nextMove: "Suggest something easy to do together soon, and see how it goes.",
          followUps: ["What if I did upset them?", "Should I ask in person?"],
        },
      },
      {
        match: /\bdid upset\b|\bupset them\b|\bmy fault\b|\bi did something\b/i,
        reply: {
          answer: "Then apologise for the specific thing, briefly, without over-explaining, and let them respond in their own time.",
          scripts: ["I've been thinking about [what happened], and I'm sorry. I didn't mean to upset you."],
          nextMove: "Say it soon, in whatever way you usually talk, then give them room.",
          followUps: ["What if they say everything's fine?", "Should I ask in person?"],
        },
      },
      {
        match: /\bin person\b|\bface to face\b|\bshould i (call|text)\b/i,
        reply: {
          answer:
            "If you see them often, in person is best: low-key, one-on-one, not in front of others. If you mostly text, a message is fine.",
          nextMove: "Pick a relaxed moment when it's just the two of you.",
          followUps: ["What if they say everything's fine?", "What if I did upset them?"],
        },
      },
    ],
  },
  {
    id: "left-out",
    example: "My friends made plans without me and I only found out from their posts.",
    keywords: [
      /\bwithout me\b/i,
      /\bleft out\b|\bnot invited\b|\b(didn'?t|don'?t|never) (get )?invite(d)? me\b|\b(wasn'?t|weren'?t|was not|haven'?t been) invited\b|\bexclud(e|ed|ing) me\b/i,
      /\b(saw|found out|seen)\b[^.?!]*\b(posts?|stories|story|photos?|pictures?|instagram|snapchat|social media|online)\b/i,
      /\beveryone else (was|went|got)\b/i,
    ],
    related: [/\bfriend/i, /\b(party|plans|hang(ing)? out|hung out|went out|trip|cinema)\b/i],
    initial: initial({
      answer:
        "That stings, but one missed invite doesn't tell you why it happened. It might have been last-minute, or an oversight. Ask one friend casually before deciding what it means.",
      points: [
        "Ask the friend you're closest to, not the whole group.",
        "Keep it light, without accusing anyone.",
        "Suggest the next plan yourself.",
      ],
      nextMove: "Message one friend from the group today, ask casually, and suggest something for next time.",
      scripts: ["Saw you all went out on Saturday, looked fun! Let me know next time, I'd love to come."],
      followUps: ["It keeps happening.", "Should I say it hurt?", "What if they left me out on purpose?"],
      title: "Being left out of plans",
    }),
    direct: {
      answer: "Ask one friend casually, and suggest the next plan yourself.",
      nextMove: "Send the message today.",
      followUps: ["It keeps happening.", "Should I say it hurt?"],
    },
    firstStep: {
      answer: "First, decide which friend you feel most comfortable asking.",
      nextMove: "Message them today, lightly and without accusing anyone.",
      followUps: ["What if they left me out on purpose?", "Should I say it hurt?"],
    },
    words: {
      answer: "Keep it light and friendly; you want an honest answer, not a defensive one.",
      scripts: [
        "Saw you all went out on Saturday, looked fun! Let me know next time, I'd love to come.",
        "Hey, I noticed I wasn't in on the plans at the weekend. Everything okay?",
        "Want to do something this week? I've missed hanging out.",
      ],
      nextMove: "Pick one and send it to one friend.",
      followUps: ["It keeps happening.", "What if they left me out on purpose?"],
    },
    extras: [
      {
        match: /\bkeeps? happening\b|\bagain\b|\balways\b|\ball the time\b|\bevery time\b/i,
        reply: {
          answer:
            "Then it's worth a real conversation with the friend you trust most. Say what you've noticed and ask what's going on, without accusing anyone.",
          scripts: ["I've noticed I've been left out of a few plans lately. Is something going on? I'd rather know."],
          nextMove: "Ask for a one-on-one chat this week, not in the group.",
          followUps: ["Should I say it hurt?", "What if they left me out on purpose?"],
        },
      },
      {
        match: /\bhurt\b|\bupset\b|\bhow i feel\b|\btell them\b/i,
        reply: {
          answer: "You can, calmly and once. Say how it felt, rather than what they did wrong.",
          scripts: ["I felt a bit left out when I saw the photos. I'd really like to be included next time."],
          nextMove: "Say it to one friend privately, not in the group chat.",
          followUps: ["It keeps happening.", "What if they left me out on purpose?"],
        },
      },
      {
        match: /\bon purpose\b|\bdeliberately\b|\bintentionally\b|\bdon'?t want me\b/i,
        reply: {
          answer:
            "You can't know that from one plan. If it turns out to be true, that tells you something useful about where to put your time. Asking is the only way to find out.",
          nextMove: "Ask one friend directly, and put some energy into other friendships this week too.",
          followUps: ["It keeps happening.", "Should I say it hurt?"],
        },
      },
    ],
  },
  {
    id: "make-friends",
    example: "I want to make new friends, but I don't know how to start.",
    keywords: [
      /\bmake (new |more |some |any )?friends\b/i,
      /\bnew friends\b/i,
      /\b(no|don'?t have (any|many)|few|zero|not many) friends\b|\bno one to (talk to|hang out with|sit with)\b/i,
      /\bmeet (new )?people\b/i,
      /\blonely\b/i,
    ],
    related: [/\bfriend/i, /\bshy\b|\bawkward\b/i],
    initial: initial({
      answer:
        "Friendships usually grow from seeing the same people regularly, not from one great conversation. Put yourself somewhere you'll see the same faces each week, then build from small talk.",
      points: [
        "Join one club, team, class or volunteer group that meets regularly.",
        "Talk to the same person a few times before suggesting plans.",
        "Suggest something small and specific, like getting food after.",
      ],
      nextMove: "This week, find one regular activity you'd enjoy anyway, and go at least twice.",
      followUps: ["I don't know what to say.", "What if they don't want to hang out?", "I'm too shy to start."],
      title: "Making new friends",
    }),
    direct: {
      answer: "Pick one regular activity and keep showing up. That's where most friendships start.",
      nextMove: "Sign up for something this week.",
      followUps: ["I'm too shy to start.", "I don't know what to say."],
    },
    firstStep: {
      answer: "First, find one place where you'd see the same people every week.",
      nextMove: "Look up clubs, teams or groups near you today.",
      followUps: ["I'm too shy to start.", "What if they don't want to hang out?"],
    },
    words: {
      answer: "Invitations work best when they're small and specific.",
      scripts: ["Want to grab food after this?", "I'm going to [event] on Saturday. Want to come along?", "Do you want to hang out this weekend?"],
      nextMove: "Use one with someone you've talked to a few times.",
      followUps: ["What if they don't want to hang out?", "I don't know what to say."],
    },
    extras: [
      {
        match: /\bwhat to say\b|\bwhat (do|should) i say\b|\bconversation\b|\btalk about\b/i,
        reply: {
          answer: "Start with what's around you: the activity, the class, the place. Then ask about them, and follow up on what they say.",
          points: ["\"How long have you been coming here?\"", "\"What got you into this?\"", "\"Are you doing anything fun this weekend?\""],
          nextMove: "Pick one of these to try at your next activity.",
          followUps: ["What if they don't want to hang out?", "I'm too shy to start."],
        },
      },
      {
        match: /\b(don'?t|doesn'?t|won'?t) want to\b|\bsay(s)? no\b|\breject/i,
        reply: {
          answer:
            "Some people will be busy or not interested, and that's normal; it isn't a verdict on you. Keep offering small invitations to different people.",
          nextMove: "If one person says no, try again with someone else within the week.",
          followUps: ["I don't know what to say.", "I'm too shy to start."],
        },
      },
      {
        match: /\bshy\b|\bnervous\b|\bawkward\b|\bscared\b/i,
        reply: {
          answer:
            "Then start with settings that do some of the talking for you, like a club or team with a shared task. Small, regular contact adds up without big conversations.",
          nextMove: "Choose an activity with a shared task, and aim to say hello to one person each time.",
          followUps: ["I don't know what to say.", "What if they don't want to hang out?"],
        },
      },
    ],
  },
  {
    id: "caught-between",
    example: "Two of my friends are fighting and both want me to take their side.",
    keywords: [
      /\btake (their|his|her|a|my|one|someone'?s) side\b|\btake sides\b|\b(pick|choose) (a )?side\b/i,
      /\b(caught|stuck) in the middle\b/i,
      /\bfriends\b[^.?!]*\b(fighting|arguing|fell out|falling out|had a fight|had an argument|not talking to each other)\b|\b(fighting|arguing|fell out|falling out)\b[^.?!]*\bfriends\b/i,
      /\b(two|both) (of )?(my )?(best )?friends\b/i,
    ],
    related: [/\bfriend/i, /\b(fight|fighting|arguing|argument|fell out|falling out)\b/i],
    initial: initial({
      answer:
        "You don't have to pick a side to be a good friend to both. Tell each of them you care about them, and that you're staying out of the argument itself.",
      points: [
        "Don't pass messages between them.",
        "Don't agree with criticism of the other one, even to keep the peace.",
        "Spend time with each of them separately.",
      ],
      nextMove: "Next time one of them brings it up, say you'd rather stay out of it, and change the subject kindly.",
      scripts: ["I care about you both, so I'm going to stay out of this one. I hope you two can sort it out."],
      followUps: ["What if one gets angry with me?", "What if one of them is actually wrong?", "Can I help them make up?"],
      title: "Caught between two friends",
    }),
    direct: {
      answer: "Don't take sides. Stay friends with both, and stay out of the argument.",
      nextMove: "Tell each of them that, kindly, the next time it comes up.",
      followUps: ["What if one gets angry with me?", "Can I help them make up?"],
    },
    firstStep: {
      answer: "First, decide what you will and won't do: no passing messages, no picking sides.",
      nextMove: "Keep that in mind the next time either of them brings it up.",
      followUps: ["What if one of them is actually wrong?", "What if one gets angry with me?"],
    },
    words: {
      answer: "Keep it warm and short, and say the same thing to both.",
      scripts: [
        "I care about you both, so I'm staying out of this one.",
        "I don't want to get in the middle, but I'm still here for you.",
        "Can we talk about something else? I don't want to take sides.",
      ],
      nextMove: "Use the same line with both of them.",
      followUps: ["What if one gets angry with me?", "Can I help them make up?"],
    },
    extras: [
      {
        match: /\bangry\b|\bmad\b|\bupset\b|\bannoyed\b|\bstop(s)? talking to me\b/i,
        reply: {
          answer:
            "Then stay calm and repeat that you care about them but aren't taking sides. If being friends depends on you agreeing, that's a lot to ask of you.",
          nextMove: "Keep being friendly and consistent; don't change your position just to smooth things over.",
          followUps: ["What if one of them is actually wrong?", "Can I help them make up?"],
        },
      },
      {
        match: /\bwrong\b|\bin the wrong\b|\bone of them is\b|\bfault\b/i,
        reply: {
          answer:
            "If one of them did something clearly unkind, you can say so to them privately and honestly. That's different from joining the argument.",
          nextMove: "Talk to that friend on their own, and keep it about what happened, not about the other person.",
          followUps: ["What if one gets angry with me?", "Can I help them make up?"],
        },
      },
      {
        match: /\bmake up\b|\bmake peace\b|\bhelp them\b|\bsort it out\b|\breconcile\b/i,
        reply: {
          answer:
            "Only if they both seem open to it. You could suggest they talk directly, but don't set up a surprise meeting or carry messages.",
          scripts: ["Have you thought about just talking to them directly? It might help."],
          nextMove: "Suggest it once to each of them, then leave it to them.",
          followUps: ["What if one gets angry with me?", "What if one of them is actually wrong?"],
        },
      },
    ],
  },
  {
    id: "money-back",
    example: "My friend borrowed money a few weeks ago and hasn't paid me back.",
    keywords: [
      /\b(borrowed|lent|loaned|owes?)\b[^.?!]*\b(money|cash|\d+|pounds|dollars|euros|quid)\b|\bowes? me\b/i,
      /\b(hasn'?t|haven'?t|never|not|didn'?t) (paid|given) (me )?(it |the money )?back\b|\bpay (me )?back\b|\bpaid (me )?back\b/i,
    ],
    related: [/\bfriend/i, /\bmoney\b|\bcash\b/i],
    initial: initial({
      answer:
        "Ask directly and kindly. People do simply forget, so a friendly, specific reminder is normal, not rude. Name the amount and suggest a way to pay.",
      points: [
        "Mention the amount and what it was for.",
        "Suggest an easy way to pay, like a bank transfer.",
        "Offer to split it into smaller payments if it's a lot.",
      ],
      nextMove: "Send a short, friendly message today with the amount and how they can pay you.",
      scripts: ["Hey, just a reminder about the [amount] from [when]. Could you send it back when you get a chance this week?"],
      followUps: ["What if they keep delaying?", "What if they say they can't pay?", "I feel awkward asking."],
      title: "Asking for money back",
    }),
    direct: {
      answer: "Ask for it back today, clearly and kindly, with the amount.",
      nextMove: "Send the message now.",
      followUps: ["What if they keep delaying?", "I feel awkward asking."],
    },
    firstStep: {
      answer: "First, get clear on the exact amount and when you lent it.",
      nextMove: "Then send a short message that mentions both.",
      followUps: ["I feel awkward asking.", "What if they say they can't pay?"],
    },
    words: {
      answer: "Friendly and specific works best.",
      scripts: [
        "Hey, just a reminder about the [amount] from [when]. Could you send it back this week?",
        "Hi! Could you pay me back the [amount] when you get a chance? A bank transfer is easiest.",
        "No rush today, but could we sort out the [amount] by Friday?",
      ],
      nextMove: "Pick one and send it today.",
      followUps: ["What if they keep delaying?", "What if they say they can't pay?"],
    },
    extras: [
      {
        match: /\bdelay|\bkeep(s)? (putting|saying)\b|\bstill (hasn'?t|haven'?t|not)\b|\bignor|\bexcuses?\b/i,
        reply: {
          answer: "Then ask for a specific date, and follow up on that day. Calm and consistent is better than hinting or getting angry.",
          scripts: ["Could you let me know when you'll be able to pay it back? A date would really help."],
          nextMove: "Agree a date, and send one reminder on the day if it hasn't arrived.",
          followUps: ["What if they say they can't pay?", "I feel awkward asking."],
        },
      },
      {
        match: /\bcan'?t (pay|afford)\b|\bno money\b|\bbroke\b/i,
        reply: {
          answer:
            "Then agree a small, regular amount instead of all at once. It's also worth deciding how much you're willing to lend in future.",
          scripts: ["No worries. Could you pay a bit each week until it's sorted?"],
          nextMove: "Suggest an amount and a day each week that works for both of you.",
          followUps: ["What if they keep delaying?", "I feel awkward asking."],
        },
      },
      {
        match: /\bawkward\b|\bembarrass|\brude\b|\buncomfortable\b|\bweird\b/i,
        reply: {
          answer:
            "That's understandable, but it's your money, and asking for it back is fair. A short, friendly message is far less awkward than resentment building up.",
          nextMove: "Send the reminder today, and keep it light.",
          followUps: ["What if they keep delaying?", "What if they say they can't pay?"],
        },
      },
    ],
  },
  {
    id: "hard-to-say-no",
    example: "My friend always asks me for favours and I find it really hard to say no.",
    keywords: [
      /\b(can'?t|never|hard to|find it hard to|struggle to|how (do i|to|can i)|learn to) say no\b/i,
      /\bfavou?rs?\b/i,
      /\b(always|keeps?|constantly) ask(s|ing)? (me )?(for|to)\b/i,
      /\bpeople[- ]pleas|\btake(s|ing)? advantage of me\b|\bpushover\b|\bwalk(s|ing)? all over me\b/i,
    ],
    related: [/\bfriend/i, /\bsay(ing)? no\b/i],
    initial: initial({
      answer:
        "You're allowed to say no without a big reason. Give yourself time before answering, and use a short, friendly no; you don't have to justify it.",
      points: [
        "Buy time: \"Let me check and get back to you.\"",
        "Say no to the request, not to the friendship.",
        "Offer a smaller yes only if you actually want to.",
      ],
      nextMove: "Next time they ask, don't answer straight away. Take a moment, decide what you actually want, then reply.",
      scripts: ["I can't this time, but I hope it goes well."],
      followUps: ["What if they get upset?", "I feel guilty saying no.", "Help me say no nicely."],
      title: "Saying no to a friend",
    }),
    direct: {
      answer: "Say no to the next favour you don't want to do. Keep it short and friendly.",
      nextMove: "Decide your sentence now, before they ask.",
      followUps: ["What if they get upset?", "I feel guilty saying no."],
    },
    firstStep: {
      answer: "First, notice which favours you actually mind doing, and which you don't.",
      nextMove: "Pick one kind of favour you'll say no to from now on.",
      followUps: ["Help me say no nicely.", "I feel guilty saying no."],
    },
    words: {
      answer: "Short and kind is enough; no long excuse needed.",
      scripts: ["I can't this time, but I hope it goes well.", "I'm going to say no to this one, but thanks for asking.", "Let me check and get back to you."],
      nextMove: "Use the last one to buy time when you're not sure.",
      followUps: ["What if they get upset?", "I feel guilty saying no."],
    },
    extras: [
      {
        match: /\bupset\b|\bangry\b|\bannoyed\b|\bmad\b|\bhate me\b/i,
        reply: {
          answer:
            "They might be disappointed for a moment. A good friend can handle an occasional no; if every no causes trouble, that's worth noticing.",
          nextMove: "Keep your no short and kind, and don't take it back just to smooth things over.",
          followUps: ["I feel guilty saying no.", "Help me say no nicely."],
        },
      },
      {
        match: /\bguilt|\bselfish\b|\bmean\b|\bfeel bad\b/i,
        reply: {
          answer:
            "Feeling guilty doesn't mean you're doing something wrong. Saying no to one favour isn't the same as not caring about them.",
          nextMove: "Start with a small no this week, and see how it actually goes.",
          followUps: ["What if they get upset?", "Help me say no nicely."],
        },
      },
    ],
  },
  {
    id: "joke-misread",
    example: "I made a joke in the group chat and I think someone took it the wrong way.",
    keywords: [
      /\bjok(e|es|ed|ing)\b|\bbanter\b/i,
      /\b(took|taken|take|taking) it the wrong way\b|\bmisunderst(ood|and|anding)\b|\bmisread\b|\boffended\b/i,
    ],
    related: [/\bfriend/i, /\bgroup chat\b|\bchat\b/i],
    initial: initial({
      answer:
        "If you think it landed badly, a quick, simple message clears it up better than silence. You don't need to know exactly how they felt to say you didn't mean it that way.",
      points: [
        "Message them privately, not in the group.",
        "Say what you meant, without explaining the joke at length.",
        "Apologise for how it came across.",
      ],
      nextMove: "Send a short private message today.",
      scripts: ["Hey, I think my joke earlier came out wrong. I didn't mean it that way, and I'm sorry if it upset you."],
      followUps: ["What if they don't reply?", "Should I apologise in the group too?", "What if they say it's fine?"],
      title: "A joke taken the wrong way",
    }),
    direct: {
      answer: "Send a short private apology today, and then let it go.",
      nextMove: "Send it now.",
      followUps: ["What if they don't reply?", "What if they say it's fine?"],
    },
    firstStep: {
      answer: "First, reread what you wrote as if you were them, so your apology matches what actually came across.",
      nextMove: "Then send a short private message.",
      followUps: ["Should I apologise in the group too?", "What if they don't reply?"],
    },
    words: {
      answer: "Short and sincere works better than a long explanation.",
      scripts: [
        "Hey, I think my joke earlier came out wrong. Sorry if it upset you.",
        "That came out badly earlier. It wasn't meant at you, and I'm sorry.",
        "Hope I didn't upset you with that message. It wasn't how I meant it.",
      ],
      nextMove: "Pick one and send it privately.",
      followUps: ["What if they don't reply?", "What if they say it's fine?"],
    },
    extras: [
      {
        match: /\b(don'?t|doesn'?t|won'?t) (reply|respond|answer)\b|\bno reply\b|\bignor|\bleft on read\b/i,
        reply: {
          answer: "Then give it a day or two. You've said what you needed to; one message is enough, and more can feel like pressure.",
          nextMove: "Be friendly the next time you see them, and don't bring it up again unless they do.",
          followUps: ["Should I apologise in the group too?", "What if they say it's fine?"],
        },
      },
      {
        match: /\bin the group\b|\bpublicly\b|\bin front of\b|\beveryone\b/i,
        reply: {
          answer:
            "Only if the joke was about them in front of everyone, or others seemed bothered too. Otherwise a private message is enough, and a public apology can make it bigger.",
          scripts: ["Sorry, that joke earlier didn't come out how I meant it."],
          nextMove: "Start with the private message, and see if a group one is still needed.",
          followUps: ["What if they don't reply?", "What if they say it's fine?"],
        },
      },
      {
        match: /\bfine\b|\bno big deal\b|\bdon'?t worry\b|\bit'?s okay\b/i,
        reply: {
          answer: "Then take them at their word and move on. Checking in was the right thing to do, and there's no need to keep bringing it up.",
          nextMove: "Carry on as normal, and keep the jokes kind for a while.",
          followUps: ["What if they don't reply?", "Should I apologise in the group too?"],
        },
      },
    ],
  },
  {
    id: "cancels-plans",
    example: "My friend keeps cancelling our plans at the last minute.",
    keywords: [
      /\b(keeps?|always|again|constantly)\b[^.?!]*\bcancel/i,
      /\bcancel(l?ing|l?ed|s)? (on me|on us|our plans|plans|the plans|last minute)\b/i,
      /\bflak(e|es|y|ing)\b|\bbail(s|ed|ing)? on (me|us|our plans|plans)\b/i,
    ],
    related: [/\bfriend/i, /\blast[- ]minute\b/i, /\bplans\b/i],
    initial: initial({
      answer:
        "Say something before it turns into resentment. You don't know the reasons, so ask rather than accuse, and say plainly that the last-minute changes are hard for you.",
      points: [
        "Mention the pattern, not just the latest time.",
        "Ask if something's making plans hard right now.",
        "Suggest plans that are easier to keep, like shorter or closer ones.",
      ],
      nextMove: "Next time you talk, bring it up calmly and ask if something's going on.",
      scripts: ["I've noticed our plans keep falling through last minute, and it's a bit hard on my end. Is something making it tricky right now?"],
      followUps: ["What if they keep doing it?", "Am I overreacting?", "Should I stop making plans?"],
      title: "A friend who keeps cancelling",
    }),
    direct: {
      answer: "Tell them it's bothering you, and ask what's going on.",
      nextMove: "Bring it up the next time you talk.",
      followUps: ["What if they keep doing it?", "Should I stop making plans?"],
    },
    firstStep: {
      answer: "First, decide what you'd like: fewer cancellations, earlier notice, or different kinds of plans.",
      nextMove: "Then say that clearly when you talk to them.",
      followUps: ["Am I overreacting?", "What if they keep doing it?"],
    },
    words: {
      answer: "Keep it about how it affects you, not about what kind of friend they are.",
      scripts: [
        "I've noticed our plans keep falling through last minute. Is everything okay?",
        "It's a bit disappointing when plans get cancelled late. Could you let me know earlier next time?",
        "Want to pick a plan that's easier to keep, like a quick coffee?",
      ],
      nextMove: "Pick one and use it next time you talk.",
      followUps: ["What if they keep doing it?", "Am I overreacting?"],
    },
    extras: [
      {
        match: /\bkeeps? doing it\b|\bkeeps? cancel|\bstill\b|\bagain\b|\bnothing changes\b/i,
        reply: {
          answer:
            "Then protect your time: make plans you'd enjoy anyway, or leave the next one to them. How they respond will tell you a lot.",
          nextMove: "Next time, let them suggest the plan and the time.",
          followUps: ["Am I overreacting?", "Should I stop making plans?"],
        },
      },
      {
        match: /\boverreact|\btoo sensitive\b|\bbig deal\b|\bpetty\b/i,
        reply: {
          answer: "No. Wanting plans to actually happen is reasonable, and saying so once, calmly, isn't overreacting.",
          nextMove: "Keep your message short and about how it affects you.",
          followUps: ["What if they keep doing it?", "Should I stop making plans?"],
        },
      },
      {
        match: /\bstop (making|inviting|asking)\b|\bgive up\b|\bnot bother\b/i,
        reply: {
          answer: "Not necessarily, but you can stop being the one who always organises. Leaving the next invitation to them is a fair test.",
          nextMove: "Tell them you'd love to hang out, and let them pick a time.",
          followUps: ["What if they keep doing it?", "Am I overreacting?"],
        },
      },
    ],
  },
  {
    id: "support-friend",
    example: "My friend is going through a hard time and I don't know what to say to them.",
    keywords: [
      /\b(going through|dealing with|having) (a |an )?(really )?(hard|tough|difficult|rough|bad|awful) (time|patch|week|few weeks)\b|\bgoing through (a |an )?(breakup|break-up|divorce|lot)\b/i,
      /\b(support|comfort|cheer up|be there for|help) (my |a )?(friend|them|him|her|someone)\b/i,
      /\bwhat to say to (them|him|her|my friend)\b/i,
      /\b(friend|he|she|they)\b[^.?!]*\b(is|are|seems?|has been|have been) (really |so |very )?(sad|down|upset|stressed|struggling)\b|\bfriend'?s? \w+ (died|passed away)\b/i,
    ],
    related: [/\bfriend/i, /\bdivorc|\bbreak ?up\b|\bbroke up\b|\bgrieving\b|\bpassed away\b|\bdied\b/i],
    initial: initial({
      answer:
        "You don't need the perfect words. Let them know you've noticed and you're there, then mostly listen. Asking what would help is better than guessing.",
      points: [
        "Ask open questions, and let them lead.",
        "Don't rush to fix it or compare it with your own experience.",
        "Offer something specific, like a walk or food together.",
        "If they mention not being safe, tell a trusted adult straight away.",
      ],
      nextMove: "Send a short message today letting them know you're thinking of them, with no pressure to reply.",
      scripts: ["I know things are hard right now. I'm here if you want to talk, or if you'd rather just do something normal."],
      followUps: ["What if they don't want to talk?", "What if I say the wrong thing?", "How can I help practically?"],
      title: "Supporting a friend",
    }),
    direct: {
      answer: "Reach out today with a short message, then listen more than you talk.",
      nextMove: "Send it now, with no pressure to reply.",
      followUps: ["What if they don't want to talk?", "How can I help practically?"],
    },
    firstStep: {
      answer: "First, just let them know you've noticed and you care.",
      nextMove: "Send a short message today.",
      followUps: ["What if I say the wrong thing?", "How can I help practically?"],
    },
    words: {
      answer: "Simple and warm is better than clever.",
      scripts: ["I know things are hard right now. I'm here if you want to talk.", "Thinking of you. No need to reply.", "Want to do something normal this week? My treat."],
      nextMove: "Pick one and send it today.",
      followUps: ["What if they don't want to talk?", "What if I say the wrong thing?"],
    },
    extras: [
      {
        match: /\b(don'?t|doesn'?t|won'?t) want to talk\b|\bshut(s)? me out\b|\bpush(es)? me away\b/i,
        reply: {
          answer:
            "That's okay. Being there doesn't always mean talking; you can still do normal things together and let them know the offer stands.",
          scripts: ["No need to talk about it. Want to just hang out?"],
          nextMove: "Suggest something low-key this week, and don't push for details.",
          followUps: ["What if I say the wrong thing?", "How can I help practically?"],
        },
      },
      {
        match: /\bwrong thing\b|\bmake it worse\b|\bsay something (wrong|bad|stupid)\b/i,
        reply: {
          answer: "Then say sorry and keep listening. Showing up imperfectly is better than staying away because you're worried about the words.",
          nextMove: "Start with a simple \"How are you doing today?\" and follow their lead.",
          followUps: ["What if they don't want to talk?", "How can I help practically?"],
        },
      },
      {
        match: /\bpractical(ly)?\b|\bhow (can|do) i help\b|\bdo something\b/i,
        reply: {
          answer: "Small, specific offers are the easiest to accept: bringing food, helping with notes or chores, or keeping them company.",
          points: ["\"Can I bring you lunch tomorrow?\"", "\"Want me to share my notes from class?\"", "\"Want company while you do that?\""],
          nextMove: "Pick one offer and make it today.",
          followUps: ["What if they don't want to talk?", "What if I say the wrong thing?"],
        },
      },
    ],
  },
  {
    id: "invite-hangout",
    example: "I want to invite someone from class to hang out, but I'm worried they'll say no.",
    keywords: [
      /\b(invite|ask)\b[^.?!]*\b(hang out|hangout|to (the )?(cinema|movies|lunch|coffee|my house|my party|come over))\b/i,
      /\bhang(ing)? out\b/i,
      /\b(worried|scared|afraid|nervous)\b[^.?!]*\b(say no|reject|turn me down)\b/i,
      /\binvite (someone|somebody|a classmate|them|him|her|a friend|people)\b/i,
    ],
    related: [/\bfriend/i, /\binvit(e|ing)\b/i, /\bclassmate|\bfrom class\b/i],
    initial: initial({
      answer:
        "Make the invitation small, specific and easy to say yes or no to. A no to one plan isn't a no to you; people are often just busy.",
      points: [
        "Suggest something specific: a time, a place, an activity.",
        "Keep it low-key, like food after class or a shared interest.",
        "Give them an easy way out, so it's not awkward either way.",
      ],
      nextMove: "Pick one simple plan, and ask them in person or by message this week.",
      scripts: ["A few of us are getting food after class on Friday. Want to come?", "Do you want to go to [place] on Saturday? No worries if you're busy."],
      followUps: ["What if they say no?", "What if it's awkward?", "Should I ask by text?"],
      title: "Inviting someone to hang out",
    }),
    direct: {
      answer: "Ask them this week, with a specific plan. The worst case is a polite no.",
      nextMove: "Send the invitation today.",
      followUps: ["What if they say no?", "Should I ask by text?"],
    },
    firstStep: {
      answer: "First, pick a simple plan with a time and place, so the invite is easy to answer.",
      nextMove: "Decide the plan now, then ask.",
      followUps: ["What if they say no?", "What if it's awkward?"],
    },
    words: {
      answer: "Short, specific and relaxed works best.",
      scripts: ["Want to get food after class on Friday?", "I'm going to [place] on Saturday. Want to come?", "Do you want to hang out this weekend? No worries if you're busy."],
      nextMove: "Pick one and send it.",
      followUps: ["What if they say no?", "What if it's awkward?"],
    },
    extras: [
      {
        match: /\bsay(s)? no\b|\breject|\bbusy\b|\bturn(s)? (me )?down\b/i,
        reply: {
          answer: "Then say \"no worries\" and move on. If they suggest another time, great; if not, try again later or with someone else.",
          nextMove: "Keep it light, and don't read too much into one no.",
          followUps: ["What if it's awkward?", "Should I ask by text?"],
        },
      },
      {
        match: /\bawkward\b|\bweird\b|\bnothing to (say|talk about)\b/i,
        reply: {
          answer: "Choose something with an activity built in, like a game, a film or food. It takes the pressure off the conversation.",
          nextMove: "Pick a plan where you'll be doing something, not just sitting and talking.",
          followUps: ["What if they say no?", "Should I ask by text?"],
        },
      },
      {
        match: /\bby text\b|\btext(ing)? (them|him|her)\b|\bin person\b|\bdm\b|\bmessage (them|him|her)\b/i,
        reply: {
          answer:
            "Either is fine. A text gives them time to answer; in person feels more natural if you already chat. Pick whichever you'd find easier.",
          scripts: ["Hey! Want to get food after class on Friday?"],
          nextMove: "Send or say it today.",
          followUps: ["What if they say no?", "What if it's awkward?"],
        },
      },
    ],
  },
  {
    id: "party-decline",
    example: "I got invited to a party but I don't really want to go. How do I say no without being rude?",
    keywords: [
      /\binvit(ed|ation)\b/i,
      /\b(don'?t|do not) (really )?(want|feel like) (to )?go(ing)?\b[^.?!]*\b(party|wedding|gathering|sleepover|event|dinner|birthday|prom|dance)\b|\b(party|wedding|gathering|sleepover|event|dinner|birthday|prom|dance)\b[^.?!]*\b(don'?t|do not) (really )?(want|feel like) (to )?go/i,
      /\bwithout being rude\b|\bpolitely\b|\bdecline\b|\bturn (it|them|the invitation) down\b|\bget out of going\b/i,
    ],
    related: [/\bfriend/i, /\bparty\b|\bwedding\b|\bgathering\b|\bsleepover\b/i, /\bsay no\b/i],
    initial: initial({
      answer:
        "A warm, short no is enough; you don't need an elaborate excuse. Thank them, say you can't make it, and show you're glad they asked.",
      points: [
        "Reply soon, so they can plan.",
        "Skip the made-up excuse; simple is easier to keep straight.",
        "Suggest another time if you'd like to see them.",
      ],
      nextMove: "Reply today with one of the messages below.",
      scripts: [
        "Thanks so much for inviting me! I can't make it this time, but I hope it's a great night.",
        "I'm going to sit this one out, but thanks for thinking of me. Let's catch up soon.",
      ],
      followUps: ["What if they ask why?", "What if they're offended?", "Should I just go anyway?"],
      title: "Turning down an invitation",
    }),
    direct: {
      answer: "Say no kindly and soon. That's more respectful than a vague maybe.",
      nextMove: "Reply today.",
      followUps: ["What if they ask why?", "What if they're offended?"],
    },
    firstStep: {
      answer: "First, decide whether it's a firm no, or a no to this but a yes to something else.",
      nextMove: "Then reply, and suggest another plan if you'd like one.",
      followUps: ["What if they're offended?", "Should I just go anyway?"],
    },
    words: {
      answer: "Pick the version that sounds most like you.",
      scripts: [
        "Thanks so much for inviting me! I can't make it this time, but have a great night.",
        "I'm going to sit this one out, but thanks for thinking of me.",
        "I can't come, but I'd love to catch up soon. Are you free next week?",
      ],
      nextMove: "Send it today.",
      followUps: ["What if they ask why?", "What if they're offended?"],
    },
    extras: [
      {
        match: /\bask(s)? why\b|\bwhy (not|can'?t)\b|\breason\b|\bexcuse\b/i,
        reply: {
          answer:
            "You can keep it simple and true: \"I'm not really up for a party that night\" is a real reason. You don't owe more detail than that.",
          nextMove: "If they ask, give that short answer and change the subject.",
          followUps: ["What if they're offended?", "Should I just go anyway?"],
        },
      },
      {
        match: /\boffended\b|\bupset\b|\bangry\b|\bhurt\b|\brude\b/i,
        reply: {
          answer:
            "Some people might be a little disappointed, but a friendly no rarely damages a friendship. Suggesting another time shows it's not about them.",
          scripts: ["I can't make it, but I'd love to see you soon. Are you free next week?"],
          nextMove: "Follow up with a plan to see them another time.",
          followUps: ["What if they ask why?", "Should I just go anyway?"],
        },
      },
      {
        match: /\bgo anyway\b|\bjust go\b|\bshould i go\b|\bshow up\b/i,
        reply: {
          answer:
            "Only if there's a reason that matters to you, like it's someone important or you'd regret missing it. Going just to avoid saying no usually isn't worth it.",
          nextMove: "Ask yourself: if saying no were easy, would you go? Let that decide.",
          followUps: ["What if they ask why?", "What if they're offended?"],
        },
      },
    ],
  },
  {
    id: "embarrassed-class",
    example: "I said something embarrassing in front of the whole class and I can't stop thinking about it.",
    keywords: [
      /\bembarrass(ed|ing|ment)?\b/i,
      /\bcringe\b|\bhumiliat/i,
      /\b(said|did) something (so )?(stupid|dumb|embarrassing|weird|cringe)\b/i,
      /\bcan'?t stop thinking about (it|what i said)\b|\bkeep (replaying|thinking about) it\b/i,
    ],
    related: [/\bin front of (the (whole )?class|everyone|people|my friends|the school)\b/i, /\b(class|school)\b/i],
    initial: initial({
      answer:
        "You can't take it back, but how you handle it next matters more than the moment itself. If it comes up, a light response like a shrug or a laugh helps it pass quickly.",
      points: [
        "Don't over-apologise or keep explaining it.",
        "If it hurt someone, apologise to them simply.",
        "When it replays, name one lesson, then turn your attention to something else.",
      ],
      nextMove: "Tomorrow, act as normal. If anyone mentions it, say something light like \"Yeah, that came out wrong\" and change the subject.",
      followUps: ["People keep bringing it up.", "I can't stop replaying it.", "Should I say something about it?"],
      title: "Getting past an embarrassing moment",
    }),
    direct: {
      answer: "Let it go by acting normal. The less you treat it as a big deal, the smaller it gets.",
      nextMove: "Go in tomorrow as if nothing happened.",
      followUps: ["People keep bringing it up.", "I can't stop replaying it."],
    },
    firstStep: {
      answer: "First, check whether it affected anyone else, because that's the only part that might need action.",
      nextMove: "If it did, apologise to them briefly; if not, move on.",
      followUps: ["Should I say something about it?", "I can't stop replaying it."],
    },
    words: {
      answer: "A light, short line is all you need if it comes up.",
      scripts: ["Yeah, that came out wrong. Anyway...", "Not my finest moment! Moving on.", "Sorry if that was weird earlier, it came out wrong."],
      nextMove: "Use the first two with anyone, and the last one if it involved someone directly.",
      followUps: ["People keep bringing it up.", "I can't stop replaying it."],
    },
    extras: [
      {
        match: /\bbring(ing)? it up\b|\bteas|\bjokes? about\b|\bwon'?t let it go\b|\bkeep mentioning\b/i,
        reply: {
          answer:
            "Keep your response short and relaxed; there's less to joke about when it doesn't get a big reaction. If it turns mean or goes on and on, tell a teacher.",
          scripts: ["Yeah, that wasn't my finest moment. Anyway..."],
          nextMove: "Pick one light line to use each time, then change the subject.",
          followUps: ["I can't stop replaying it.", "Should I say something about it?"],
        },
      },
      {
        match: /\breplay|\bcan'?t stop thinking\b|\bkeep thinking\b|\boverthink/i,
        reply: {
          answer:
            "Replaying it doesn't change it. Give the thought a job: name one thing you'd do differently, then deliberately switch to something that needs your attention.",
          nextMove: "Next time it replays, write down the one lesson, then do something active for a few minutes.",
          followUps: ["People keep bringing it up.", "Should I say something about it?"],
        },
      },
      {
        match: /\bsay something\b|\baddress it\b|\bexplain\b|\bapologi/i,
        reply: {
          answer:
            "Only if it affected someone else; then a short apology to them is enough. Otherwise, making an announcement about it tends to keep it alive longer.",
          nextMove: "If it involved someone, apologise to them privately; if not, let it be.",
          followUps: ["People keep bringing it up.", "I can't stop replaying it."],
        },
      },
    ],
  },
  {
    id: "sibling-things",
    example: "My younger brother keeps taking my things without asking.",
    keywords: [
      /\b(taking|takes|took|borrowing|borrows|borrowed|uses|using|used|wearing|wears|wore) my (things|stuff|clothes|charger|headphones|room|makeup|games|laptop)\b/i,
      /\bwithout asking\b/i,
      /\bgo(es|ing)? (through|into) my (room|things|stuff)\b/i,
    ],
    related: [/\b(brother|sister|sibling|siblings)\b/i],
    initial: initial({
      answer:
        "Set a clear, calm rule and make it easy to follow: what's off-limits, and how to ask first. If that doesn't work, ask a parent to back it up.",
      points: [
        "Pick a calm time to talk, not the moment you find something missing.",
        "Be specific: which things, and what they should do instead.",
        "Keep the really important things somewhere they can't reach.",
      ],
      nextMove: "Today, tell them calmly which things are off-limits and that they need to ask first.",
      scripts: ["I don't mind lending you stuff sometimes, but you need to ask me first. My [thing] is off-limits."],
      followUps: ["They don't listen.", "What if my parents take their side?", "They're much younger than me."],
      title: "A sibling taking your things",
    }),
    direct: {
      answer: "Tell them clearly what's off-limits, and ask a parent to back you up if it continues.",
      nextMove: "Have that talk today.",
      followUps: ["They don't listen.", "What if my parents take their side?"],
    },
    firstStep: {
      answer: "First, decide which things really matter to you, so your rule is clear and short.",
      nextMove: "Pick your two or three off-limits things.",
      followUps: ["They don't listen.", "They're much younger than me."],
    },
    words: {
      answer: "Calm and specific is more likely to work than shouting.",
      scripts: [
        "I don't mind lending you stuff, but you need to ask me first.",
        "My [thing] is off-limits. Please don't take it.",
        "If you ask, I'll usually say yes. Just don't take it without asking.",
      ],
      nextMove: "Pick one and say it today.",
      followUps: ["They don't listen.", "What if my parents take their side?"],
    },
    extras: [
      {
        match: /\b(don'?t|doesn'?t|won'?t) listen\b|\bkeeps? doing it\b|\bstill\b|\bignor/i,
        reply: {
          answer: "Then involve a parent, calmly, with specific examples. Ask them to back up one clear rule, rather than complaining about everything.",
          scripts: ["Can you help me with something? [Name] keeps taking my things without asking. Could you back me up on a rule?"],
          nextMove: "Talk to a parent at a calm moment this week.",
          followUps: ["What if my parents take their side?", "They're much younger than me."],
        },
      },
      {
        match: /\btheir side\b|\b(parents?|mum|mom|dad)\b[^.?!]*\b(side|don'?t care|won'?t help)\b/i,
        reply: {
          answer:
            "Then ask for a middle ground: a few things that are always off-limits, and the rest shared if they ask first. That's an easier yes for parents.",
          nextMove: "Suggest that compromise, with your two or three most important things on the list.",
          followUps: ["They don't listen.", "They're much younger than me."],
        },
      },
      {
        match: /\byounger\b|\blittle\b|\bkid\b|\bdoesn'?t understand\b/i,
        reply: {
          answer: "Then keep it very simple and visual, like a box or shelf of things they're allowed to use, and praise them when they ask first.",
          nextMove: "Set up a small spot with things they can borrow, and show them.",
          followUps: ["They don't listen.", "What if my parents take their side?"],
        },
      },
    ],
  },
  {
    id: "stay-out-later",
    example: "I want to ask my parents if I can stay out later on weekends.",
    keywords: [
      /\bstay out (later|late|longer|past)\b|\bcurfew\b/i,
      /\b(more )?freedom\b|\bmore independence\b|\boverprotective\b|\b(parents?|mum|mom|dad)\b[^.?!]*\b(too|so|really|very) strict\b/i,
      /\b(parents?|mum|mom|dad)\b[^.?!]*\b(won'?t|don'?t|never) (let|allow) me\b/i,
      /\bconvince (my )?(parents|mum|mom|dad)\b/i,
    ],
    related: [/\b(parents?|mum|mom|dad)\b/i, /\bweekends?\b|\b(friday|saturday) nights?\b/i],
    initial: initial({
      answer:
        "Treat it like a proposal, not a demand. Come with a specific time, a plan for staying in touch, and an offer to start with a trial, so saying yes feels safe for them.",
      points: [
        "Ask at a calm moment, not right before you go out.",
        "Be specific: where, who with, and what time.",
        "Offer check-ins, like a message when you arrive.",
      ],
      nextMove: "Choose a calm moment this week and ask for a specific, slightly later time on one weekend night as a trial.",
      scripts: ["I'd like to stay out until [time] on Saturdays. I'll tell you where I am and message when I'm heading home. Could we try it once?"],
      followUps: ["What if they say no?", "They don't trust me.", "My friends can all stay later."],
      title: "Asking parents for more freedom",
    }),
    direct: {
      answer: "Ask this week, with a specific time and a check-in plan, and offer a trial.",
      nextMove: "Pick the moment and ask.",
      followUps: ["What if they say no?", "They don't trust me."],
    },
    firstStep: {
      answer: "First, decide exactly what you're asking for: which nights, what time, and how you'll stay in touch.",
      nextMove: "Write that down before you talk to them.",
      followUps: ["What if they say no?", "My friends can all stay later."],
    },
    words: {
      answer: "Calm, specific and open to their worries.",
      scripts: [
        "I'd like to stay out until [time] on Saturdays. Could we try it once and see how it goes?",
        "What would you need from me to feel okay with a later time?",
        "I'll message you when I get there and when I'm leaving.",
      ],
      nextMove: "Use the first line to open, and the others as their worries come up.",
      followUps: ["What if they say no?", "They don't trust me."],
    },
    extras: [
      {
        match: /\bsay(s)? no\b|\brefuse|\bwon'?t let\b/i,
        reply: {
          answer:
            "Ask what would need to change for them to say yes, and listen. Then show them you can manage the current rules well, and ask again in a few weeks.",
          scripts: ["Okay. What would make you more comfortable saying yes in future?"],
          nextMove: "Keep to the current time for the next few weeks, then ask again.",
          followUps: ["They don't trust me.", "My friends can all stay later."],
        },
      },
      {
        match: /\btrust\b|\bworr(y|ied|ies)\b|\bsafe(ty)?\b/i,
        reply: {
          answer:
            "Then build trust in small, visible ways: be home when you say, reply to messages, and tell them where you are. Trust usually grows from a track record.",
          nextMove: "For the next few weeks, be on time every time, and mention that when you ask again.",
          followUps: ["What if they say no?", "My friends can all stay later."],
        },
      },
      {
        match: /\bfriends\b|\beveryone else\b|\bother (people|parents)\b/i,
        reply: {
          answer:
            "It's worth mentioning once, but it probably won't be your strongest point. Your own plan and track record will count for more with them.",
          nextMove: "Focus your case on your plan: where, who with, what time, and how you'll check in.",
          followUps: ["What if they say no?", "They don't trust me."],
        },
      },
    ],
  },
  {
    id: "chores-unfair",
    example: "I feel like I do way more chores at home than everyone else.",
    keywords: [
      /\bchores?\b|\bhousework\b/i,
      /\b(do|doing|does) (the )?(washing up|dishes|laundry|cleaning|hoovering|vacuuming|cooking)\b|\btake out the (bins|trash|rubbish)\b/i,
      /\bmore\b[^.?!]*\bthan (my (brother|sister|siblings)|anyone|everyone)( else)?\b|\b(brother|sister|siblings?) (never|doesn'?t|don'?t) (do|does|help)\b/i,
    ],
    related: [/\bat home\b|\bnot fair\b|\bunfair\b/i, /\b(brother|sister|sibling|siblings|parents?|mum|mom|dad)\b/i],
    initial: initial({
      answer:
        "Bring facts, not just frustration. Write down what you actually do in a normal week, then suggest a fairer split at a calm family moment.",
      points: [
        "List who does what for one week.",
        "Suggest a specific rota or swap, not just \"it's unfair\".",
        "Pick a calm time, not right after an argument.",
      ],
      nextMove: "This week, jot down the chores you do each day, so you have something concrete to show.",
      scripts: ["Can we talk about chores? I've written down what everyone does, and I'd like to find a fairer way to split them."],
      followUps: ["What if they say I'm exaggerating?", "My siblings won't help.", "Should I just stop doing them?"],
      title: "Sharing chores fairly",
    }),
    direct: {
      answer: "Raise it this week, with a list of what you do and a suggested split.",
      nextMove: "Start your list today.",
      followUps: ["What if they say I'm exaggerating?", "My siblings won't help."],
    },
    firstStep: {
      answer: "First, get the facts: what you do, and roughly how long it takes.",
      nextMove: "Track your chores for a week.",
      followUps: ["Should I just stop doing them?", "My siblings won't help."],
    },
    words: {
      answer: "Lead with wanting to fix it, not with blame.",
      scripts: [
        "Can we talk about chores? I'd like to find a fairer way to split them.",
        "I've written down what I do each week. Could we look at it together?",
        "Could we make a rota so everyone knows their jobs?",
      ],
      nextMove: "Pick one to open the conversation this week.",
      followUps: ["What if they say I'm exaggerating?", "My siblings won't help."],
    },
    extras: [
      {
        match: /\bexaggerat|\bnot true\b|\bdon'?t believe\b/i,
        reply: {
          answer: "That's why the written list helps: it turns it from feelings into facts. Show it, and ask them to look at it with you.",
          nextMove: "Keep your list going for a second week if you need more to show.",
          followUps: ["My siblings won't help.", "Should I just stop doing them?"],
        },
      },
      {
        match: /\bsiblings?\b|\bbrothers?\b|\bsisters?\b|\bwon'?t help\b/i,
        reply: {
          answer:
            "Then ask a parent to set up a rota for everyone, so it isn't you against them. A shared chart is harder to ignore than reminders from you.",
          nextMove: "Suggest a simple weekly rota, with each person's jobs written down.",
          followUps: ["What if they say I'm exaggerating?", "Should I just stop doing them?"],
        },
      },
      {
        match: /\bstop doing\b|\bjust stop\b|\bstrike\b|\brefuse\b/i,
        reply: {
          answer:
            "That usually turns into an argument rather than a fairer split. Ask for the change first; if nothing shifts, then talk about what you'll stop doing.",
          nextMove: "Have the conversation first, with your list.",
          followUps: ["What if they say I'm exaggerating?", "My siblings won't help."],
        },
      },
    ],
  },
  {
    id: "compared-sibling",
    example: "My parents keep comparing me to my older sister.",
    keywords: [
      /\bcompar(e|es|ing|ed) me\b|\bcompar(e|es|ing|ed) us\b/i,
      /\bwhy (can'?t|don'?t) (you|i) be (more )?like\b|\bmore like (my )?(sister|brother|cousin|sibling)\b|\bbe (more )?like (my|her|him) (sister|brother|cousin)\b/i,
    ],
    related: [/\b(parents?|mum|mom|dad|family)\b/i, /\b(sister|brother|sibling|cousin)\b/i],
    initial: initial({
      answer:
        "Tell them how it lands, calmly and once, and ask for something specific instead. They may not realise how often they do it, or how it feels to you.",
      points: [
        "Pick a calm moment, one-on-one if possible.",
        "Use an example, not \"you always\".",
        "Say what you'd like instead, like being judged on your own progress.",
      ],
      nextMove: "Choose a calm time this week to tell one parent how the comparisons feel.",
      scripts: ["When you compare me to [name], it makes me feel like I'm never enough. I'd really like you to look at how I'm doing on my own terms."],
      followUps: ["What if they say they're just joking?", "What if they don't change?", "Should I talk to my sibling about it?"],
      title: "Being compared to a sibling",
    }),
    direct: {
      answer: "Tell them it bothers you, once and calmly, and ask them to stop.",
      nextMove: "Pick your moment this week.",
      followUps: ["What if they say they're just joking?", "What if they don't change?"],
    },
    firstStep: {
      answer: "First, think of one or two specific examples, so it's concrete when you bring it up.",
      nextMove: "Write them down, then choose when to talk.",
      followUps: ["What if they don't change?", "Should I talk to my sibling about it?"],
    },
    words: {
      answer: "Say how it affects you, and what you'd like instead.",
      scripts: [
        "When you compare me to [name], it makes me feel like I'm never enough.",
        "I'd like you to look at how I'm doing on my own terms.",
        "Could you stop comparing us? It really gets to me.",
      ],
      nextMove: "Use one of these at a calm moment.",
      followUps: ["What if they say they're just joking?", "What if they don't change?"],
    },
    extras: [
      {
        match: /\bjoking\b|\bjust a joke\b|\bdon'?t mean it\b|\bsensitive\b/i,
        reply: {
          answer: "Then say that even as a joke it bothers you, and you'd like them to stop. You don't need to prove it was serious for it to matter.",
          scripts: ["I know it's meant as a joke, but it still gets to me. Could you stop?"],
          nextMove: "Say it calmly the next time it happens, right then.",
          followUps: ["What if they don't change?", "Should I talk to my sibling about it?"],
        },
      },
      {
        match: /\b(don'?t|doesn'?t|won'?t) change\b|\bkeep(s)? doing it\b|\bstill\b/i,
        reply: {
          answer:
            "Then focus on what you can control: your own goals, and people who see you for you. You can also ask another adult you trust to help you raise it again.",
          nextMove: "Write down one thing you're proud of this month, just for you.",
          followUps: ["What if they say they're just joking?", "Should I talk to my sibling about it?"],
        },
      },
      {
        match: /\bsibling\b|\bsister\b|\bbrother\b/i,
        reply: {
          answer:
            "It can help, as long as it doesn't sound like blame; the comparisons aren't their doing. They might even feel the pressure from the other side.",
          scripts: ["Do you ever notice Mum and Dad comparing us? It's been getting to me."],
          nextMove: "Mention it casually when it's just the two of you.",
          followUps: ["What if they say they're just joking?", "What if they don't change?"],
        },
      },
    ],
  },
  {
    id: "honest-feedback",
    example: "My friend asked what I think of their song, and honestly I don't like it much.",
    keywords: [
      /\b(asked|asks|wants|want) (me )?(for )?(what i think|my (honest )?(opinion|feedback|thoughts|view))\b|\bwhat i think of\b/i,
      /\bhonest (opinion|feedback|answer)\b|\bbe honest (with|about)\b/i,
    ],
    related: [
      /\bfriend/i,
      /\bhonest(ly)?\b/i,
      /\b(don'?t|do not) (really )?(like|love) it\b|\bnot (very )?good\b/i,
      /\b(song|drawing|art|story|writing|video|outfit|business idea|cooking|poem|painting)\b/i,
    ],
    initial: initial({
      answer:
        "Be honest, but make it useful: say what genuinely works, then one or two specific things that could be better. \"I don't like it\" helps no one; a specific suggestion does.",
      points: [
        "Ask what kind of feedback they want first.",
        "Start with something you honestly like.",
        "Frame changes as suggestions: \"What if you tried...?\"",
      ],
      nextMove: "Before you reply, find one thing you genuinely like and one specific suggestion.",
      scripts: ["I really like [part]. The part I'd look at again is [part]; what if you tried [idea]?"],
      followUps: ["What if there's nothing I like?", "What if they get hurt?", "Should I just say it's great?"],
      title: "Giving honest feedback kindly",
    }),
    direct: {
      answer: "Tell them what works and one thing to improve. That's honest and kind at the same time.",
      nextMove: "Reply today with one positive and one suggestion.",
      followUps: ["What if they get hurt?", "Should I just say it's great?"],
    },
    firstStep: {
      answer: "First, ask what kind of feedback they're after: encouragement, or ideas to improve it.",
      nextMove: "Ask that before giving your opinion.",
      followUps: ["What if there's nothing I like?", "What if they get hurt?"],
    },
    words: {
      answer: "Pair something real you like with a specific suggestion.",
      scripts: [
        "I really like [part]. One thing I'd try is [idea].",
        "The idea is great. I think [part] could be even stronger if you [idea].",
        "Do you want honest feedback, or are you mainly sharing it? Happy to do either.",
      ],
      nextMove: "Pick the one that fits, and send it.",
      followUps: ["What if they get hurt?", "Should I just say it's great?"],
    },
    extras: [
      {
        match: /\bnothing (i|to) like\b|\bdon'?t like any\b|\ball of it\b|\bterrible\b/i,
        reply: {
          answer:
            "There's usually something: the effort, the idea, one moment. Focus your honesty on the one or two changes that would make the biggest difference, not a full list.",
          nextMove: "Pick the single most useful suggestion, and lead with the effort they put in.",
          followUps: ["What if they get hurt?", "Should I just say it's great?"],
        },
      },
      {
        match: /\bhurt\b|\bupset\b|\boffend|\bsad\b/i,
        reply: {
          answer:
            "They might be a bit disappointed, and that's okay. Kind, specific feedback shows you took their work seriously.",
          nextMove: "Ask how it felt to hear, and listen.",
          followUps: ["What if there's nothing I like?", "Should I just say it's great?"],
        },
      },
      {
        match: /\bsay it'?s (great|good|amazing)\b|\blie\b|\bjust be nice\b/i,
        reply: {
          answer:
            "Not if they asked for your opinion to improve it; empty praise won't help them. If they just wanted support, though, encouragement is the right answer.",
          question: "Did they ask for feedback to improve it, or were they sharing something they're proud of?",
          nextMove: "If you're not sure, ask what kind of feedback they'd like.",
          followUps: ["What if there's nothing I like?", "What if they get hurt?"],
        },
      },
    ],
  },
  {
    id: "mean-comment",
    example: "Someone left a mean comment on my post and it's bothering me.",
    keywords: [
      /\b(mean|nasty|rude|horrible|hurtful|hate|hateful|negative) comments?\b/i,
      /\b(left|posted|wrote|put) (a |some )?(\w+ )?comments? (on|under)\b|\bcommented (on|under)\b/i,
      /\btroll(s|ed|ing)?\b/i,
    ],
    related: [/\b(post|photo|video|reel|tiktok|picture|pic)\b/i, /\bonline\b|\bsocial media\b|\binstagram\b/i],
    initial: initial({
      answer:
        "Don't reply while you're upset; a reply usually feeds it. You can delete the comment, block or restrict the person, or report it, and none of those needs an explanation.",
      points: [
        "Screenshot it first if it's threatening or keeps happening.",
        "Delete, block, restrict or report: whatever feels right.",
        "Talk to someone you trust if it's getting to you.",
      ],
      nextMove: "Decide now: delete, block or report, then put your phone down for a while.",
      followUps: ["Should I reply to them?", "I know who wrote it.", "It keeps happening."],
      title: "A mean comment online",
    }),
    direct: {
      answer: "Don't reply. Delete, block or report it, then step away from your phone for a bit.",
      nextMove: "Do that now.",
      followUps: ["I know who wrote it.", "It keeps happening."],
    },
    firstStep: {
      answer: "First, screenshot it in case you need it later, then decide whether to delete, block or report.",
      nextMove: "Take the screenshot now.",
      followUps: ["Should I reply to them?", "It keeps happening."],
    },
    words: {
      answer: "If you do say something, keep it short and calm; it's not a debate.",
      scripts: ["That comment wasn't okay. Please don't do that again.", "Not interested in arguing. Take care."],
      nextMove: "Send it privately, or not at all; blocking is also an answer.",
      followUps: ["I know who wrote it.", "It keeps happening."],
    },
    extras: [
      {
        match: /\breply\b|\brespond\b|\bclap back\b|\banswer (them|it)\b/i,
        reply: {
          answer:
            "Usually not. A reply rarely changes anything, and it gives the comment more attention. If it's a misunderstanding with someone you know, a private message is better than a public reply.",
          nextMove: "Leave it for a day; if you still want to respond, message them privately.",
          followUps: ["I know who wrote it.", "It keeps happening."],
        },
      },
      {
        match: /\bknow who\b|\bsomeone (i know|from (school|class))\b|\bclassmate\b/i,
        reply: {
          answer:
            "Then decide whether to talk to them directly, or just block them. If it's someone from school and it's part of a pattern, tell a teacher or another adult you trust.",
          scripts: ["That comment on my post wasn't okay. Please don't do that again."],
          nextMove: "Choose one: a short direct message, blocking them, or telling an adult.",
          followUps: ["Should I reply to them?", "It keeps happening."],
        },
      },
      {
        match: /\bkeeps? happening\b|\bagain\b|\bevery (time|post)\b|\ball the time\b|\bmore comments\b/i,
        reply: {
          answer:
            "Then treat it as more than a one-off. Screenshot everything, report and block the account, and tell an adult you trust.",
          nextMove: "Screenshot the comments today, then report and block.",
          followUps: ["Should I reply to them?", "I know who wrote it."],
        },
      },
    ],
  },
  {
    id: "talking-behind",
    example: "I heard some people have been talking about me behind my back.",
    keywords: [
      /\bbehind my back\b/i,
      /\btalking about me\b|\bgossip(ing|ed|s)? about me\b|\bgossip/i,
      /\brumou?rs?\b/i,
      /\bsaying (things|stuff|bad things|mean things|lies) about me\b|\bspreading (lies|stuff|things)\b/i,
    ],
    related: [/\bfriend/i, /\b(heard|found out|told me)\b/i],
    initial: initial({
      answer:
        "Remember that you heard it second-hand, so you don't know exactly what was said or why. Before reacting, decide whether it's worth addressing at all.",
      points: [
        "If it's minor, ignoring it often lets it fade.",
        "If it matters, ask the person directly and calmly.",
        "Be careful who you vent to, so it doesn't spread further.",
      ],
      nextMove: "Take a day before doing anything, then decide: let it go, or ask the person directly.",
      scripts: ["I heard you might have said something about me. I'd rather hear it from you. Is there something going on?"],
      followUps: ["Should I confront them?", "What if it's a lie about me?", "Should I trust the person who told me?"],
      title: "Hearing people talk about you",
    }),
    direct: {
      answer: "Don't react straight away. If it really matters, ask the person directly and calmly; if it doesn't, let it go.",
      nextMove: "Wait a day, then decide.",
      followUps: ["Should I confront them?", "What if it's a lie about me?"],
    },
    firstStep: {
      answer: "First, find out what was actually said, as exactly as you can.",
      nextMove: "Ask the person who told you for the exact words.",
      followUps: ["Should I trust the person who told me?", "Should I confront them?"],
    },
    words: {
      answer: "Keep it curious, not accusing.",
      scripts: [
        "I heard you might have said something about me. I'd rather hear it from you.",
        "Is there something going on between us? I'd like to sort it out.",
        "I heard a rumour about me. Just so you know, it isn't true.",
      ],
      nextMove: "Pick the one that fits and say it privately.",
      followUps: ["Should I confront them?", "What if it's a lie about me?"],
    },
    extras: [
      {
        match: /\bconfront\b|\bsay something\b|\btalk to them\b|\bask them\b/i,
        reply: {
          answer: "Only if it matters enough, and only calmly and privately. Ask what they said rather than accusing them of what you heard.",
          scripts: ["I heard you might have said something about me. Can we talk about it?"],
          nextMove: "If you do it, pick a private moment, not in front of others.",
          followUps: ["What if it's a lie about me?", "Should I trust the person who told me?"],
        },
      },
      {
        match: /\blie\b|\bnot true\b|\buntrue\b|\bfalse\b|\bmade up\b/i,
        reply: {
          answer:
            "Then correct it calmly with the people who matter, and don't chase every version of it. If it's spreading or doing real damage, tell a teacher or an adult you trust.",
          nextMove: "Tell your close friends the truth in one sentence, and leave it there.",
          followUps: ["Should I confront them?", "Should I trust the person who told me?"],
        },
      },
      {
        match: /\btrust\b|\bwho told me\b|\bthe person who told\b/i,
        reply: {
          answer: "Worth asking yourself. Second-hand stories can change as they're passed on, so don't treat it as certain until you've heard more.",
          nextMove: "Ask the person who told you exactly what they heard, word for word.",
          followUps: ["Should I confront them?", "What if it's a lie about me?"],
        },
      },
    ],
  },
  {
    id: "double-booked",
    example: "I accidentally made plans with two different friends for the same evening.",
    keywords: [
      /\bdouble[- ]?book(ed|ing)?\b/i,
      /\bplans with (two|both)\b|\b(two|both) (different )?(friends|people|groups)\b[^.?!]*\bsame (day|evening|night|time|weekend)\b/i,
      /\b(accidentally|by accident)\b[^.?!]*\bplans\b|\bplans\b[^.?!]*\bby accident\b/i,
    ],
    related: [/\bfriend/i, /\bsame (day|evening|night|time|weekend)\b/i, /\bplans?\b/i],
    initial: initial({
      answer:
        "Tell the one you'll be letting down as soon as possible, and offer a specific new time. The sooner they know, the easier it is for them to make other plans.",
      points: [
        "Keep the plan that was made first, or the one that's harder to move.",
        "Apologise simply; no need for a long excuse.",
        "Offer a specific new date, not just \"another time\".",
      ],
      nextMove: "Message the friend you're rescheduling today, with an apology and two possible new dates.",
      scripts: ["I'm really sorry, I double-booked myself for Friday. Could we do Saturday or next Tuesday instead?"],
      alternative: "If both plans are casual and the people get along, you could ask if they'd be happy to join up.",
      followUps: ["Which plan should I keep?", "What if they get annoyed?", "Can I just invite both?"],
      title: "Double-booked with two friends",
    }),
    direct: {
      answer: "Keep the first plan and reschedule the other today, with an apology and a new date.",
      nextMove: "Send the message now.",
      followUps: ["What if they get annoyed?", "Can I just invite both?"],
    },
    firstStep: {
      answer: "First, work out which plan came first and which is easier to move.",
      nextMove: "Then message the other friend straight away.",
      followUps: ["Which plan should I keep?", "What if they get annoyed?"],
    },
    words: {
      answer: "Own it, apologise, and offer a specific alternative.",
      scripts: [
        "I'm really sorry, I double-booked myself. Could we do Saturday instead?",
        "My mistake, I've got two things on tonight. Can I make it up to you next week?",
        "Sorry, I mixed up my dates. Are you free Tuesday or Thursday instead?",
      ],
      nextMove: "Pick one and send it today.",
      followUps: ["What if they get annoyed?", "Which plan should I keep?"],
    },
    extras: [
      {
        match: /\bwhich (plan|one)\b|\bkeep\b|\bchoose\b/i,
        reply: {
          answer:
            "Usually the one made first, unless one is harder to rearrange, like a birthday or tickets. Don't decide by which friend you'd rather see; that's harder to explain later.",
          nextMove: "Check which was agreed first and which is easier to move, then decide.",
          followUps: ["What if they get annoyed?", "Can I just invite both?"],
        },
      },
      {
        match: /\bannoyed\b|\bupset\b|\bangry\b|\bmad\b/i,
        reply: {
          answer: "They might be, briefly. Owning it quickly and offering a real alternative is the best you can do; following through matters most.",
          nextMove: "Make sure the new plan actually happens, and be on time for it.",
          followUps: ["Which plan should I keep?", "Can I just invite both?"],
        },
      },
      {
        match: /\binvite both\b|\bboth of them\b|\bcombine\b|\bjoin\b|\btogether\b/i,
        reply: {
          answer: "Only if both plans are casual and they'd get on. Ask each of them first, rather than surprising anyone.",
          scripts: ["I've double-booked myself tonight. Would you be up for joining [name] and me?"],
          nextMove: "Ask both, and keep the separate plans if either hesitates.",
          followUps: ["Which plan should I keep?", "What if they get annoyed?"],
        },
      },
    ],
  },
  {
    id: "forgot-birthday",
    example: "I completely forgot my best friend's birthday yesterday.",
    keywords: [
      /\bforg(o|e)t\b[^.?!]*\b(birthday|anniversary)\b|\b(birthday|anniversary)\b[^.?!]*\bforgot\b/i,
      /\bmissed (my |their |his |her |a )?([\w']+ )?(birthday|anniversary)\b/i,
    ],
    related: [/\bfriend/i, /\bforgot\b/i, /\bbirthday\b|\banniversary\b/i],
    initial: initial({
      answer:
        "Say so today, honestly and warmly, without a long excuse. Then make up for it with something thoughtful; a late celebration can still mean a lot.",
      points: [
        "Message or call today; don't wait until you have the perfect gift.",
        "Own it: \"I completely forgot\" is better than a made-up reason.",
        "Suggest a belated plan, like lunch or a small treat.",
      ],
      nextMove: "Send a message today admitting you forgot, and suggest a belated plan this week.",
      scripts: ["Happy belated birthday! I'm so sorry I missed it yesterday. Can I take you out for [food] this week to celebrate?"],
      followUps: ["What if they're upset with me?", "Should I get them a gift?", "Help me word the message."],
      title: "Forgetting a friend's birthday",
    }),
    direct: {
      answer: "Message them today, apologise simply, and plan a belated celebration.",
      nextMove: "Send the message now.",
      followUps: ["What if they're upset with me?", "Should I get them a gift?"],
    },
    firstStep: {
      answer: "First, message them today; the sooner you say it, the better.",
      nextMove: "Send a short, honest apology now.",
      followUps: ["Help me word the message.", "Should I get them a gift?"],
    },
    words: {
      answer: "Honest and warm beats a perfect excuse.",
      scripts: [
        "Happy belated birthday! I'm so sorry I missed it. Can I take you out this week?",
        "I completely forgot your birthday, and I feel awful. Let me make it up to you.",
        "Happy belated birthday! You deserve better than a late message, so lunch is on me.",
      ],
      nextMove: "Pick the one that sounds like you and send it today.",
      followUps: ["What if they're upset with me?", "Should I get them a gift?"],
    },
    extras: [
      {
        match: /\bupset\b|\bangry\b|\bmad\b|\bhurt\b|\bannoyed\b/i,
        reply: {
          answer:
            "Then acknowledge it without getting defensive, and let your actions do the rest. A sincere apology and a real plan usually go a long way.",
          scripts: ["I'm really sorry I forgot. I'd like to make it up to you."],
          nextMove: "Follow through on the belated plan, and make it about them.",
          followUps: ["Should I get them a gift?", "Help me word the message."],
        },
      },
      {
        match: /\bgift\b|\bpresent\b|\bbuy\b/i,
        reply: {
          answer: "A small, thoughtful one helps more than an expensive one. Something that shows you know them, or time together, matters more than the price.",
          nextMove: "Pick something small that fits them, or plan a treat together.",
          followUps: ["What if they're upset with me?", "Help me word the message."],
        },
      },
    ],
  },
  {
    id: "late-reply",
    example: "I didn't reply to a friend's message for weeks, and now it feels too awkward to answer.",
    keywords: [
      /\bi('ve)? (still )?(didn'?t|haven'?t|have not|never|forgot to|not) (reply|replied|respond|responded|answer|answered|text(ed)? back|get back|got back)\b/i,
      /\b(too )?awkward to (reply|answer|respond|text|message)\b|\btoo late to reply\b|\bnow it'?s (really )?awkward\b/i,
      /\bleft (my friend|them|him|her|someone|people) on read\b/i,
    ],
    related: [
      /\bfriend/i,
      /\bmessage\b|\btexts?\b|\bdms?\b/i,
      /\bawkward\b/i,
      /\b(for|in) (weeks|months|ages|so long|a long time)\b/i,
    ],
    initial: initial({
      answer:
        "Reply anyway: a late reply is usually welcome, and it only gets harder the longer you wait. Acknowledge the delay in one line, then just answer normally.",
      points: [
        "Skip the long explanation; one line is enough.",
        "Answer what they actually said.",
        "Add a question, so the conversation keeps going.",
      ],
      nextMove: "Send a reply today, using one line to acknowledge the delay.",
      scripts: ["Sorry for the super late reply, life got busy! [Answer to their message]. How are you doing?"],
      followUps: ["What if they're annoyed?", "Should I explain why?", "What if they don't reply now?"],
      title: "Replying after a long silence",
    }),
    direct: {
      answer: "Reply today. One line of sorry, then a normal answer.",
      nextMove: "Send it now.",
      followUps: ["What if they're annoyed?", "Should I explain why?"],
    },
    firstStep: {
      answer: "First, reread their message, so your reply actually answers it.",
      nextMove: "Then write one line of apology and your answer.",
      followUps: ["Should I explain why?", "What if they don't reply now?"],
    },
    words: {
      answer: "Short, warm and a little light-hearted works well.",
      scripts: [
        "Sorry for the super late reply! [Answer]. How are you doing?",
        "I'm so bad at replying, sorry! I'd love to catch up. Are you free this week?",
        "Just saw I never answered this, sorry! [Answer].",
      ],
      nextMove: "Pick one and send it today.",
      followUps: ["What if they're annoyed?", "What if they don't reply now?"],
    },
    extras: [
      {
        match: /\bannoyed\b|\bupset\b|\bangry\b|\bmad\b/i,
        reply: {
          answer: "A simple sorry covers it, and a warm reply shows you care about the friendship. Don't let worrying about it delay things further.",
          nextMove: "Send it today.",
          followUps: ["Should I explain why?", "What if they don't reply now?"],
        },
      },
      {
        match: /\bexplain\b|\bwhy\b|\breason\b|\bexcuse\b/i,
        reply: {
          answer:
            "Only briefly, if there's a real reason you want to share. Otherwise \"sorry for the slow reply\" is enough; long excuses can make it more awkward.",
          nextMove: "Keep the apology to one line, and put your energy into the actual reply.",
          followUps: ["What if they're annoyed?", "What if they don't reply now?"],
        },
      },
      {
        match: /\b(don'?t|doesn'?t|won'?t) reply\b|\bno reply\b|\bignor/i,
        reply: {
          answer:
            "Then you've done your part. Give it some time, and if you'd like to stay close, try again with a different message in a week or two.",
          nextMove: "Leave it for now, and reach out again later with something new.",
          followUps: ["What if they're annoyed?", "Should I explain why?"],
        },
      },
    ],
  },
  {
    id: "reconnect",
    example: "I want to reconnect with an old friend, but it's been years since we talked.",
    keywords: [
      /\breconnect\b|\bget back in touch\b|\bback in touch\b|\bcatch up with (an? )?(old )?friend\b/i,
      /\bold friend\b|\bchildhood friend\b|\bfriend from (school|primary|years ago|when i was)\b/i,
      /\blost touch\b|\bdrifted apart\b/i,
      /\b(talk|speak) to\b[^.?!]*\bagain\b/i,
    ],
    related: [/\bfriend/i, /\b(years|a long time|ages) since\b|\bin (years|ages|a long time)\b/i],
    initial: initial({
      answer:
        "A short, warm message is all it takes, and you don't need a reason beyond thinking of them. Keep it light, so it's easy for them to reply.",
      points: [
        "Mention a shared memory or what made you think of them.",
        "Ask one easy question.",
        "Don't apologise at length for the gap.",
      ],
      nextMove: "Send a short message today, and suggest a call or coffee only if they reply warmly.",
      scripts: ["Hey! I was just thinking about [memory] and it made me smile. How have you been?"],
      followUps: ["What if they don't reply?", "Isn't it weird after so long?", "What should I say next?"],
      title: "Reconnecting with an old friend",
    }),
    direct: {
      answer: "Send them a message today. The worst case is no reply, which costs you nothing.",
      nextMove: "Write it now; two sentences are enough.",
      followUps: ["What if they don't reply?", "Isn't it weird after so long?"],
    },
    firstStep: {
      answer: "First, think of one memory or reason you thought of them; it makes the message feel natural.",
      nextMove: "Then write two sentences and send them.",
      followUps: ["What should I say next?", "What if they don't reply?"],
    },
    words: {
      answer: "Short and warm, with an easy question.",
      scripts: [
        "Hey! I was just thinking about [memory]. How have you been?",
        "It's been way too long! What are you up to these days?",
        "Saw something that reminded me of you and had to say hi. How's life?",
      ],
      nextMove: "Pick one and send it today.",
      followUps: ["What if they don't reply?", "What should I say next?"],
    },
    extras: [
      {
        match: /\b(don'?t|doesn'?t|won'?t) (reply|respond|answer)\b|\bno reply\b|\bignor/i,
        reply: {
          answer:
            "Then you've lost nothing, and they may just be busy or slow to reply. You can try once more in a few weeks, or simply leave the door open.",
          nextMove: "Leave it at one message for now.",
          followUps: ["Isn't it weird after so long?", "What should I say next?"],
        },
      },
      {
        match: /\bweird\b|\bawkward\b|\bso long\b|\btoo late\b/i,
        reply: {
          answer:
            "Not really. A friendly message from someone from your past is usually a nice surprise. The first message is the awkward part, and it's short.",
          nextMove: "Send it before you talk yourself out of it.",
          followUps: ["What if they don't reply?", "What should I say next?"],
        },
      },
      {
        match: /\bsay next\b|\bif they reply\b|\bafter they reply\b|\bkeep (it|the conversation) going\b/i,
        reply: {
          answer: "Ask about their life now, share a bit of yours, and if it's going well, suggest a call or meeting up.",
          scripts: ["It's so good to hear from you! Would you be up for a call sometime this week?"],
          nextMove: "Wait for their reply, then follow their lead on how much to catch up.",
          followUps: ["What if they don't reply?", "Isn't it weird after so long?"],
        },
      },
    ],
  },
  {
    id: "crush",
    example: "I like someone in my class and I don't know if I should tell them.",
    keywords: [
      /\bcrush\b/i,
      /\bi (really )?like (someone|somebody|this (guy|girl|person|boy)|a (guy|girl|boy))\b|\bfeelings for\b/i,
      /\b(tell|ask) (them|him|her|someone) (how i feel|out)\b|\bhow i feel about (them|him|her)\b|\bask(ing)? (them|him|her|someone) out\b/i,
      /\b(do|does) (they|he|she) like me\b|\blikes? me back\b|\bthe (person|guy|girl|boy) i like\b/i,
    ],
    related: [/\bfriend/i, /\bshould i tell\b|\btell (them|him|her)\b/i],
    initial: initial({
      answer:
        "There's no way to know how they feel without some risk, but you can keep it small. Get to know them better first, then tell them in a low-pressure way that's easy to answer.",
      points: [
        "Spend more time together first, in groups or one-on-one.",
        "Tell them privately, not in front of others.",
        "Make it easy for them to say no without awkwardness.",
      ],
      nextMove: "This week, focus on getting to know them better: talk more, and suggest something small together.",
      scripts: ["I've really enjoyed getting to know you. Would you want to hang out sometime, just us?"],
      followUps: ["What if they don't feel the same?", "How do I know if they like me?", "What if it ruins our friendship?"],
      title: "Telling someone you like them",
    }),
    direct: {
      answer: "If you want to know, you'll have to ask. Do it privately, simply, and in a way that's easy to answer.",
      nextMove: "Get to know them a bit more this week, then ask.",
      followUps: ["What if they don't feel the same?", "What if it ruins our friendship?"],
    },
    firstStep: {
      answer: "First, spend a bit more time with them, so asking feels natural rather than out of nowhere.",
      nextMove: "Suggest something small to do together.",
      followUps: ["How do I know if they like me?", "What if they don't feel the same?"],
    },
    words: {
      answer: "Simple and honest is best; you don't need a speech.",
      scripts: [
        "I've really enjoyed getting to know you. Want to hang out sometime, just us?",
        "I like spending time with you. Would you want to do something this weekend?",
        "I think I've got a bit of a crush on you. No pressure at all, I just wanted to say it.",
      ],
      nextMove: "Pick the one that feels right, and say it privately.",
      followUps: ["What if they don't feel the same?", "What if it ruins our friendship?"],
    },
    extras: [
      {
        match: /\b(don'?t|doesn'?t) feel the same\b|\bsay(s)? no\b|\breject/i,
        reply: {
          answer:
            "Then you'll have your answer, and you can both move on kindly. Taking it calmly, with something like \"no worries\", makes it easy to stay friendly.",
          scripts: ["No worries at all, thanks for being honest."],
          nextMove: "Decide now that you'll respond kindly either way; it makes asking less scary.",
          followUps: ["How do I know if they like me?", "What if it ruins our friendship?"],
        },
      },
      {
        match: /\bhow (do|can) i (know|tell)\b|\bif they like me\b|\bsigns\b/i,
        reply: {
          answer:
            "You can't know for sure from signals; people are friendly for all sorts of reasons. The only reliable way to find out is to ask, in a low-pressure way.",
          nextMove: "Instead of decoding signs, suggest something small together and see how they respond.",
          followUps: ["What if they don't feel the same?", "What if it ruins our friendship?"],
        },
      },
      {
        match: /\bruin\b|\bfriendship\b|\bweird between us\b|\blose them\b/i,
        reply: {
          answer:
            "That's the real trade-off. If the friendship matters a lot to you, taking it slowly and keeping the question casual lowers the risk.",
          nextMove: "Decide which matters more to you right now: finding out, or keeping things as they are.",
          followUps: ["What if they don't feel the same?", "How do I know if they like me?"],
        },
      },
    ],
  },
  {
    id: "interrupted",
    example: "Someone in my group always talks over me when I try to say something.",
    keywords: [
      /\btalk(s|ing)? over me\b|\binterrupt(s|ing|ed)?\b|\bcut(s|ting)? me off\b/i,
      /\b(never|don'?t|can'?t) (get to|let me) (speak|talk|finish)\b|\bcan'?t get a word in\b|\bnever let me finish\b/i,
      /\bwhen i try to (say|speak|talk)\b|\bwhen i'?m (talking|speaking)\b/i,
    ],
    related: [/\b(my|our) group\b|\bmeetings?\b|\bclass(mate)?\b/i],
    initial: initial({
      answer:
        "Hold your ground in the moment with a calm line, and if it keeps happening, mention it to them privately. You don't need to guess why they do it to ask them to stop.",
      points: [
        "Keep talking, a little louder and slower.",
        "Use a short line to finish your point.",
        "Afterwards, raise the pattern privately if it continues.",
      ],
      nextMove: "Next time it happens, use one calm line to finish your point, then carry on.",
      scripts: ["Sorry, I wasn't quite finished. Let me just finish this point."],
      followUps: ["What if they keep doing it?", "What if the whole group does it?", "Should I tell the teacher?"],
      title: "Being talked over",
    }),
    direct: {
      answer: "Finish your point when it happens, and have a private word if it keeps going.",
      nextMove: "Use the calm line next time.",
      followUps: ["What if they keep doing it?", "Should I tell the teacher?"],
    },
    firstStep: {
      answer: "First, have one calm sentence ready, so you're not caught off guard.",
      nextMove: "Practise it once out loud before your next group session.",
      followUps: ["What if they keep doing it?", "What if the whole group does it?"],
    },
    words: {
      answer: "Calm and short works better than matching their volume.",
      scripts: ["Sorry, I wasn't quite finished.", "Can I just finish my point?", "Hang on, I'd like to finish this, then I'd love to hear yours."],
      nextMove: "Pick one to use next time.",
      followUps: ["What if they keep doing it?", "What if the whole group does it?"],
    },
    extras: [
      {
        match: /\bkeep(s)? doing it\b|\bstill\b|\bagain\b|\ball the time\b/i,
        reply: {
          answer: "Then talk to them one-on-one, calmly. Describe what happens and what you'd like instead.",
          scripts: ["I've noticed I often get cut off when I'm talking in the group. Could you let me finish? I'd really appreciate it."],
          nextMove: "Have a quick private word before your next group session.",
          followUps: ["What if the whole group does it?", "Should I tell the teacher?"],
        },
      },
      {
        match: /\bwhole group\b|\beveryone\b|\ball of them\b/i,
        reply: {
          answer:
            "Then suggest a simple way of taking turns, like going round the table, or ask whoever leads to make sure everyone gets a say.",
          scripts: ["Could we go round so everyone gets a turn to share their ideas?"],
          nextMove: "Suggest it at the start of your next meeting.",
          followUps: ["What if they keep doing it?", "Should I tell the teacher?"],
        },
      },
      {
        match: /\bteacher\b|\bboss\b|\bmanager\b|\bleader\b|\btell someone\b/i,
        reply: {
          answer:
            "If you've tried speaking up and it hasn't changed, yes. Keep it about the group working well, not about getting someone in trouble.",
          nextMove: "Mention it to them with one or two specific examples.",
          followUps: ["What if they keep doing it?", "What if the whole group does it?"],
        },
      },
    ],
  },
  {
    id: "teasing-bystander",
    example: "Someone in my class keeps getting teased, and I don't know if I should say something.",
    keywords: [
      /\b(someone|somebody|a kid|kids|a (boy|girl|student|classmate)|this (kid|boy|girl)|they|he|she|my friend|people)\b[^.?!]*\b(teased|picked on|made fun of|mocked|bullied|laughed at|excluded)\b(?! me\b)/i,
      /\b(teasing|bullying|picking on|making fun of|laughing at) (someone|somebody|him|her|them|a kid|this kid|my friend|a classmate|a boy|a girl|a student)\b/i,
      /\bstand up for\b|\bspeak up for\b|\bstick up for\b|\bshould (i )?(say|do) something\b/i,
    ],
    related: [
      /\bbull(y|ies|ying|ied)\b/i,
      /\bsomeone in my (class|year|school)\b|\b(a )?(kid|boy|girl|student|classmate) in my (class|year|school)\b/i,
    ],
    initial: initial({
      answer:
        "You don't have to make a big stand to help. Small things matter: not joining in, being friendly to them afterwards, and telling a teacher if it keeps happening.",
      points: [
        "Don't laugh along, even quietly.",
        "Check in with them privately afterwards.",
        "If it's regular or getting worse, tell a teacher or another adult you trust.",
      ],
      nextMove: "Next time, don't join in, and afterwards say something kind to them.",
      scripts: ["Hey, that wasn't cool earlier. Are you okay?"],
      alternative: "If you feel safe doing it, a simple \"that's enough\" in the moment can stop it.",
      followUps: ["What if they turn on me?", "Should I tell a teacher?", "What do I say to them?"],
      title: "Speaking up for someone",
    }),
    direct: {
      answer: "Don't join in, be kind to them, and tell a teacher if it keeps happening.",
      nextMove: "Do the first two this week.",
      followUps: ["Should I tell a teacher?", "What if they turn on me?"],
    },
    firstStep: {
      answer: "Start with the easiest thing: being friendly to them when it's just you.",
      nextMove: "Say hi or sit with them this week.",
      followUps: ["What do I say to them?", "Should I tell a teacher?"],
    },
    words: kindWords,
    extras: [
      {
        match: /\bturn on me\b|\bpick on me\b|\btarget me\b|\bme next\b/i,
        reply: {
          answer: "That's a real worry, and you don't have to confront anyone. Supporting them privately and telling an adult are safer ways to help.",
          nextMove: "Choose the safest way to help this week: a kind word to them, or a quiet word with a teacher.",
          followUps: ["Should I tell a teacher?", "What do I say to them?"],
        },
      },
      {
        match: /\bteacher\b|\btell (an adult|someone|a grown-?up)\b|\breport\b/i,
        reply: {
          answer:
            "Yes, if it's regular or getting worse. You can do it privately, and it's about keeping someone safe, not getting anyone in trouble.",
          scripts: ["I'm worried about how [name] is being treated in class. Can I talk to you about it privately?"],
          nextMove: "Talk to a teacher you trust this week.",
          followUps: ["What if they turn on me?", "What do I say to them?"],
        },
      },
      { match: /\bsay to (them|him|her)\b|\bwhat do i say\b|\btalk to (them|him|her)\b/i, reply: kindWords },
    ],
  },
  {
    id: "being-bullied",
    example: "Some people at school keep picking on me and I don't know what to do.",
    keywords: [
      /\b(i'?m|i am|i'?ve been|i have been|i get|i got|i keep getting|i'?m getting|i was) (being |getting |always )?(bullied|picked on|teased|made fun of|excluded|laughed at|called names)\b/i,
      /\b(bully|bullies|bullying|bullied|pick on|picking on|picks on|picked on|make fun of|making fun of|makes fun of|made fun of|tease|teasing|teases|teased|laugh at|laughing at|laughs at|laughed at) me\b|\brevenge on\b/i,
    ],
    related: [/\bbull(y|ies|ying|ied)\b/i, /\bat school\b|\bin (my )?class\b|\bonline\b/i],
    initial: initial({
      answer:
        "Being picked on isn't okay, and you don't have to handle it on your own. Tell an adult you trust what's been happening, like a parent, a teacher or a school counsellor.",
      points: [
        "Keep a note of what happened, when, and who saw it.",
        "Stay near friends or people you trust when you can.",
        "If it happens online, save screenshots, then block and report.",
      ],
      nextMove: "Pick one adult to tell this week, and tell them what's been happening, even if it feels small.",
      scripts: ["Something's been happening at school that I need help with. Can we talk somewhere private?"],
      followUps: ["What if telling makes it worse?", "Should I stand up to them?", "Who should I tell?"],
      title: "Dealing with being picked on",
    }),
    asked: {
      match: /\bget (back at|them back)\b|\brevenge\b|\bfight back\b/i,
      answer:
        "Getting back at them usually makes things worse, and can get you into trouble too. The safer way to make it stop is to get an adult you trust involved.",
    },
    direct: {
      answer: "Tell an adult you trust, soon. You shouldn't have to deal with this by yourself.",
      nextMove: "Decide today who you'll tell and when.",
      followUps: ["Who should I tell?", "What if telling makes it worse?"],
    },
    firstStep: {
      answer: "Start by writing down what's happened so far: what was said or done, when, and who saw it.",
      nextMove: "Make that list today, then show it to an adult you trust.",
      followUps: ["Who should I tell?", "What if telling makes it worse?"],
    },
    words: {
      answer: "You can keep it short. Saying what's been happening is enough to start.",
      scripts: [
        "Some people at school keep picking on me, and I need help making it stop.",
        "It's been going on for a while and it's getting to me. Can you help?",
      ],
      nextMove: "Choose one adult and say one of these to them this week.",
      followUps: ["Who should I tell?", "Should I stand up to them?"],
    },
    extras: [
      {
        match: /\bworse\b|\bsnitch|\b(scared|afraid|worried) to tell\b|\bfind out i told\b/i,
        reply: {
          answer:
            "That worry is common. You can tell the adult you're worried about that too, and ask them to handle it in a way that doesn't make it obvious you spoke up.",
          scripts: ["I'm worried it'll get worse if they find out I told. Can we handle it carefully?"],
          nextMove: "When you tell someone, mention this worry at the start, so they can plan around it.",
          followUps: ["Who should I tell?", "Should I stand up to them?"],
        },
      },
      {
        match: /\bstand up to\b|\bfight back\b|\bconfront|\bget back at\b/i,
        reply: {
          answer:
            "A calm \"stop\" and walking away can help, but getting back at them usually makes things worse. You don't have to face them alone; getting an adult involved is the safer step.",
          nextMove:
            "If it happens again, say one short sentence, like \"Leave me alone\", move towards other people, and tell an adult afterwards.",
          followUps: ["Who should I tell?", "What if telling makes it worse?"],
        },
      },
      {
        match: /\bwho (should|do|can) i (tell|talk to)\b|\bwho to tell\b|\bno one to tell\b/i,
        reply: {
          answer:
            "Anyone you trust who can do something about it: a parent or carer, a teacher you get on with, or a school counsellor. If the first person doesn't help, tell someone else.",
          nextMove: "Write down two names, and talk to the first one this week.",
          followUps: ["What if telling makes it worse?", "Should I stand up to them?"],
        },
      },
    ],
  },
  {
    id: "wrong-person-message",
    example: "I accidentally sent a message complaining about someone to that exact person.",
    keywords: [
      /\b(sent|texted|messaged)\b[^.?!]*\b(wrong (person|chat|group|number)|to (the|that) (exact |same )?person)\b/i,
      /\baccidentally (sent|texted|messaged|forwarded)\b|\bsent (it )?by (accident|mistake)\b/i,
      /\bwrong (person|chat|group chat|group|number)\b/i,
    ],
    related: [
      /\bcomplain(ing|ed)? about\b|\b(talking|moaning) about\b/i,
      /\bmistake\b|\baccident/i,
      /\bmessage|\btext|\bchat\b/i,
    ],
    initial: initial({
      answer:
        "Own it quickly, before they have time to wonder. Apologise for how it was said, and if there's a real issue behind it, offer to talk about it properly.",
      points: [
        "Don't pretend it was about someone else.",
        "Apologise for the way you said it, not just for being caught.",
        "If there's a genuine problem, raise it calmly.",
      ],
      nextMove: "Message or talk to them today, before anything else is said.",
      scripts: ["I'm really sorry about that message. It wasn't a fair way to put it, and you shouldn't have read it like that. Can we talk?"],
      followUps: ["What if they're really hurt?", "What if I meant what I said?", "Should I tell them in person?"],
      title: "Messaging the wrong person",
    }),
    direct: {
      answer: "Apologise today, clearly and without excuses. Waiting makes it worse.",
      nextMove: "Send the apology now.",
      followUps: ["What if they're really hurt?", "What if I meant what I said?"],
    },
    firstStep: {
      answer: "First, reread what you sent, so your apology matches exactly what they read.",
      nextMove: "Then apologise for that, specifically.",
      followUps: ["Should I tell them in person?", "What if they're really hurt?"],
    },
    words: {
      answer: "Own it, don't minimise it, and leave room for them to respond.",
      scripts: [
        "I'm really sorry about that message. It wasn't fair, and you shouldn't have had to read it.",
        "That message was out of order, and I'm sorry. Can we talk?",
        "I messed up. I'm sorry for what I said and how I said it.",
      ],
      nextMove: "Pick one and send it today.",
      followUps: ["What if they're really hurt?", "What if I meant what I said?"],
    },
    extras: [
      {
        match: /\bhurt\b|\bupset\b|\bangry\b|\bmad\b|\bwon'?t talk\b/i,
        reply: {
          answer:
            "Then give them space after your apology, and don't push for instant forgiveness. How you treat them over the next few weeks will matter more than the words.",
          nextMove: "Apologise once, sincerely, then let them respond in their own time.",
          followUps: ["What if I meant what I said?", "Should I tell them in person?"],
        },
      },
      {
        match: /\bmeant (it|what i said)\b|\bit'?s true\b|\breal (issue|problem)\b/i,
        reply: {
          answer: "Then separate the two: apologise for how you said it and where, and raise the actual issue with them directly and fairly.",
          scripts: ["I'm sorry for how I said it; that wasn't fair. But there is something I'd like to talk about with you properly."],
          nextMove: "Apologise first, then suggest a time to talk about the real issue.",
          followUps: ["What if they're really hurt?", "Should I tell them in person?"],
        },
      },
      {
        match: /\bin person\b|\bface to face\b|\bcall\b/i,
        reply: {
          answer:
            "If you see them regularly, in person or a call is better; it shows you're taking it seriously. A message is fine to start, if that's how you usually talk.",
          nextMove: "Send a short message now, and offer to talk in person.",
          followUps: ["What if they're really hurt?", "What if I meant what I said?"],
        },
      },
    ],
  },
  {
    id: "forgot-name",
    example: "Someone told me their name and I forgot it straight away. Now it's awkward.",
    keywords: [
      /\bforgot (their|his|her|someone'?s|the|a) name\b|\bforget (people'?s |their |his |her )?names?\b|\bforgot the name of\b/i,
      /\b(their|his|her|someone'?s|your) name\b[^.?!]*\b(forgot|again|straight away)\b|\bname again\b/i,
    ],
    related: [/\bforgot\b/i, /\bawkward\b/i, /\bnames?\b/i],
    initial: initial({
      answer: "Just ask again, lightly; it's far less awkward now than in a month. Then use their name once soon, so it sticks.",
      nextMove: "Ask the next time you see them, and use their name in your reply.",
      scripts: ["Sorry, I'm terrible with names. Can you tell me yours again?"],
      followUps: ["What if it's been ages?", "How do I remember names?"],
      title: "Forgetting someone's name",
    }),
    direct: {
      answer: "Ask them again. It takes five seconds and solves it.",
      nextMove: "Ask the next time you see them.",
      followUps: ["What if it's been ages?", "How do I remember names?"],
    },
    firstStep: {
      answer: "First, check whether a friend knows it; that saves asking.",
      nextMove: "If not, just ask them directly and lightly.",
      followUps: ["What if it's been ages?", "What if I forget again?"],
    },
    words: {
      answer: "Light and honest is best.",
      scripts: [
        "Sorry, I'm terrible with names. Can you tell me yours again?",
        "I've completely blanked on your name, sorry! What was it?",
        "Remind me of your name? I don't want to get it wrong.",
      ],
      nextMove: "Pick one and use it next time.",
      followUps: ["What if it's been ages?", "How do I remember names?"],
    },
    extras: [
      {
        match: /\bages\b|\bmonths?\b|\bweeks?\b|\btoo late\b|\blong time\b/i,
        reply: {
          answer: "Still ask; people forget names all the time. Or get it indirectly: ask a friend, or introduce them to someone and let them say it.",
          scripts: ["This is embarrassing, but I've forgotten your name. Can you remind me?"],
          nextMove: "Try the indirect way first; if it doesn't work, just ask.",
          followUps: ["How do I remember names?", "What if I forget again?"],
        },
      },
      {
        match: /\bremember\b|\bbetter with names\b/i,
        reply: {
          answer: "Say the name back straight away, use it once in the conversation, and link it to something about them.",
          nextMove: "Try it with the next new person you meet.",
          followUps: ["What if it's been ages?", "What if I forget again?"],
        },
      },
      {
        match: /\bforget (it )?again\b|\bagain\b/i,
        reply: {
          answer: "Then ask again, with a smile. Asking twice is still better than avoiding them or guessing.",
          nextMove: "Save their name in your phone as soon as you hear it.",
          followUps: ["What if it's been ages?", "How do I remember names?"],
        },
      },
    ],
  },
  {
    id: "roommate-mess",
    example: "My roommate never cleans up after themselves and it's starting to really annoy me.",
    keywords: [
      /\b(roommate|room-mate|flatmate|housemate|roomie)s?\b/i,
      /\bclean(s|ing)? up after\b|\bafter (themselves|himself|herself)\b|\bdirty dishes\b|\bleaves? (a mess|dirty|their stuff|stuff) (everywhere|around|in)\b/i,
    ],
    related: [/\bclean|\bmess|\btidy|\bdishes/i, /\bannoy/i],
    initial: initial({
      answer:
        "Raise it early and calmly, before it builds into resentment. Be specific about what bothers you, and suggest a simple system rather than a general complaint.",
      points: [
        "Pick a relaxed moment, not right after finding a mess.",
        "Name one or two specific things, like dishes or bins.",
        "Suggest a rota or a rule you both agree on.",
      ],
      nextMove: "This week, ask for a quick chat and suggest one specific fix, like doing dishes the same day.",
      scripts: ["Hey, can we sort out a system for the kitchen? The dishes piling up is getting to me. Could we both do ours the same day?"],
      followUps: ["What if they get defensive?", "What if nothing changes?", "I don't want to seem annoying."],
      title: "A messy roommate",
    }),
    direct: {
      answer: "Talk to them this week, with one specific request and a simple fix.",
      nextMove: "Ask for a quick chat today.",
      followUps: ["What if they get defensive?", "What if nothing changes?"],
    },
    firstStep: {
      answer: "First, pick the one thing that bothers you most, so the conversation stays focused.",
      nextMove: "Then suggest a fix for just that.",
      followUps: ["I don't want to seem annoying.", "What if they get defensive?"],
    },
    words: {
      answer: "Friendly, specific, and focused on a fix.",
      scripts: [
        "Can we sort out a system for the kitchen? The dishes are getting to me.",
        "Could we agree to do our own dishes the same day?",
        "Want to make a quick rota for cleaning? I think it'd help us both.",
      ],
      nextMove: "Pick one and bring it up this week.",
      followUps: ["What if they get defensive?", "What if nothing changes?"],
    },
    extras: [
      {
        match: /\bdefensive\b|\bangry\b|\bargue\b|\bdeny\b/i,
        reply: {
          answer:
            "Stay calm and come back to the specific thing and the fix, rather than arguing about who's messier. Ask what system would work for them.",
          scripts: ["I'm not trying to have a go at you. I just want us to find something that works for both of us."],
          nextMove: "Ask them to suggest a system, and agree to try it for a couple of weeks.",
          followUps: ["What if nothing changes?", "I don't want to seem annoying."],
        },
      },
      {
        match: /\bnothing changes\b|\bstill\b|\bagain\b|\bkeep(s)? (doing|leaving)\b/i,
        reply: {
          answer:
            "Then write the agreement down, like a simple rota, and check in after a week. If you rent, involving whoever manages the place is a last step, not a first.",
          nextMove: "Put a rota on the fridge and review it together after a week.",
          followUps: ["What if they get defensive?", "I don't want to seem annoying."],
        },
      },
      {
        match: /\bannoying\b|\bnag\b|\bpetty\b|\bdramatic\b/i,
        reply: {
          answer: "Asking once, clearly and calmly, isn't annoying; silently getting more frustrated is worse for both of you.",
          nextMove: "Have one clear conversation instead of lots of small hints.",
          followUps: ["What if they get defensive?", "What if nothing changes?"],
        },
      },
    ],
  },
  {
    id: "homesick",
    example: "I moved away for university and I feel really homesick.",
    keywords: [
      /\bhomesick/i,
      /\bmiss (home|my (family|parents|friends|mum|mom|dad|home|dog|cat|room|siblings))\b/i,
      /\bmoved (away|out)\b|\baway from home\b|\bleft home\b/i,
    ],
    related: [/\b(uni|university|college|dorm|halls)\b/i],
    initial: initial({
      answer:
        "Homesickness is common in the first weeks, and it often eases as the new place becomes familiar. Keep regular contact with home, but put most of your energy into building routines where you are.",
      points: [
        "Schedule calls home, rather than being on the phone all day.",
        "Join one club or society, and go more than once.",
        "Build small routines: a regular café, a walk, a class.",
      ],
      nextMove: "This week, sign up for one activity and set a regular time to call home.",
      alternative: "If it doesn't ease after a few weeks, or it's affecting your studies, talk to your university's support services.",
      followUps: ["Should I go home for a weekend?", "I haven't made any friends yet.", "Calling home makes it worse."],
      title: "Coping with feeling homesick",
    }),
    direct: {
      answer: "Build routines where you are, and keep contact with home regular but limited.",
      nextMove: "Join one activity this week.",
      followUps: ["Should I go home for a weekend?", "I haven't made any friends yet."],
    },
    firstStep: {
      answer: "Start with one small routine that makes the new place feel like yours.",
      nextMove: "Pick a regular walk, café or class for this week.",
      followUps: ["I haven't made any friends yet.", "Calling home makes it worse."],
    },
    words: {
      answer: "Small invitations are the quickest way to make a new place feel less lonely.",
      scripts: ["Want to grab food after this?", "A few of us are going to [event]. Want to come?", "Is anyone up for a walk later?"],
      nextMove: "Use one with someone from your course or building this week.",
      followUps: ["Should I go home for a weekend?", "I haven't made any friends yet."],
    },
    extras: [
      {
        match: /\bgo home\b|\bvisit home\b|\bweekend\b/i,
        reply: {
          answer:
            "A visit can help, but going home every weekend can make it harder to settle. If you can, have a few full weekends where you are first.",
          nextMove: "Plan something for this weekend where you are, and book a visit home for later.",
          followUps: ["I haven't made any friends yet.", "Calling home makes it worse."],
        },
      },
      {
        match: /\bfriends?\b|\balone\b|\blonely\b|\bdon'?t know anyone\b/i,
        reply: {
          answer:
            "That's normal early on; friendships usually take a few weeks of seeing the same people. Say yes to invitations, and keep going to the same activities.",
          nextMove: "Go to one social thing this week, even if you only stay for a bit.",
          followUps: ["Should I go home for a weekend?", "Calling home makes it worse."],
        },
      },
      {
        match: /\bcall(ing)?\b|\bphone\b|\bfacetime\b|\bworse\b/i,
        reply: {
          answer: "Then keep calls shorter and at set times, and talk about what you're doing there, not just what you miss.",
          nextMove: "Try a shorter call this week, and plan something to do straight after.",
          followUps: ["Should I go home for a weekend?", "I haven't made any friends yet."],
        },
      },
    ],
  },
  {
    id: "moving-away",
    example: "My family is moving to a new city and I'm worried about leaving my friends.",
    keywords: [
      /\b(moving|relocating|move) (to (a |another |a new )?(city|country|town|place|area|school)|away|house|abroad|cities|countries)\b|\bwe'?re moving\b|\bwe are moving\b/i,
      /\bnew (city|town|country|area)\b/i,
      /\bleav(e|ing) (all )?(my|our) friends\b|\bleave everyone\b/i,
    ],
    related: [/\bfriend/i, /\bmiss\b/i],
    initial: initial({
      answer:
        "Friendships that matter can survive a move, but they need a plan. Before you leave, agree how you'll stay in touch, and think about how you'll meet people in the new place.",
      points: [
        "Set up a group chat or regular call with close friends.",
        "Plan a visit, even if it's months away.",
        "Look up clubs or activities in the new place now.",
      ],
      nextMove: "This week, tell your closest friends and plan one proper goodbye together.",
      followUps: ["What if we drift apart?", "How do I make friends there?", "I don't want to move at all."],
      title: "Moving away from friends",
    }),
    direct: {
      answer: "Make a plan with your close friends to stay in touch, and join something in the new place quickly.",
      nextMove: "Set up the group chat this week.",
      followUps: ["What if we drift apart?", "How do I make friends there?"],
    },
    firstStep: {
      answer: "First, decide which friendships you most want to keep strong.",
      nextMove: "Tell those friends, and agree how you'll stay in touch.",
      followUps: ["What if we drift apart?", "I don't want to move at all."],
    },
    words: {
      answer: "Say it simply, and suggest a plan.",
      scripts: [
        "I'm moving in [month], and I really want to stay in touch. Can we set up a regular call?",
        "Before I go, can we do something together, just us?",
        "Will you come and visit me once I'm settled?",
      ],
      nextMove: "Send or say one of these to your closest friends this week.",
      followUps: ["What if we drift apart?", "How do I make friends there?"],
    },
    extras: [
      {
        match: /\bdrift\b|\blose touch\b|\bforget (about )?me\b|\bgrow apart\b/i,
        reply: {
          answer:
            "Some friendships will change, and that's normal; the closest ones usually last with a little effort. Regular, small contact matters more than long calls.",
          nextMove: "Agree on a regular way to keep in touch before you go.",
          followUps: ["How do I make friends there?", "I don't want to move at all."],
        },
      },
      {
        match: /\bmake (new )?friends\b|\bmeet people\b|\bnew people\b/i,
        reply: {
          answer:
            "Join something regular as soon as you arrive: a club, a team or a class. Seeing the same people each week is how new friendships start.",
          nextMove: "Pick one activity in the new place to try in your first month.",
          followUps: ["What if we drift apart?", "I don't want to move at all."],
        },
      },
      {
        match: /\b(don'?t|do not) want to (move|go|leave)\b|\bnot fair\b|\bhate\b/i,
        reply: {
          answer:
            "That's completely understandable. Tell your family how you feel, and ask what's decided and what isn't; you may have more say in some parts than you think.",
          scripts: ["I'm really struggling with the move. Can we talk about it, and about what I can have a say in?"],
          nextMove: "Talk to them this week, calmly, about what worries you most.",
          followUps: ["What if we drift apart?", "How do I make friends there?"],
        },
      },
    ],
  },
];
