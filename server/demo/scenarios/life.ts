// Demo mode: everyday life. Decisions, plans, habits, setbacks and everyday problems, plus a few
// situations too open to answer without one clarifying question first.

import { initial, type DemoScenario } from "../scenario.ts";

export const LIFE_SCENARIOS: DemoScenario[] = [
  {
    id: "late-important",
    example: "I'm stuck in traffic and I'm going to be late for something important.",
    keywords: [
      /\b(going to|gonna|will) be late\b|\brunning late\b/i,
      /\btraffic\b|\b(bus|train) (is )?(late|delayed|cancell?ed)\b|\bmissed (my|the) (bus|train)\b/i,
      /\blate (for|to) (something|an?|my|the)\b/i,
    ],
    related: [/\bstuck\b/i, /\b(important|interview|appointment|meeting|exam)\b/i],
    initial: initial({
      answer: "Let them know now, before the start time, with a realistic arrival time. A quick heads-up matters more than the reason.",
      nextMove: "Send the message now, then focus on getting there safely rather than rushing.",
      scripts: ["I'm so sorry, I'm stuck in traffic and running about [X] minutes late. I'll be there as soon as I can."],
      followUps: ["What if it's a job interview?", "What if I miss it completely?"],
      title: "Running late for something important",
    }),
    direct: {
      answer: "Message them now with an arrival time. Don't wait until you're already late.",
      nextMove: "Send it now.",
      followUps: ["What if it's a job interview?", "What if I miss it completely?"],
    },
    firstStep: {
      answer: "First, check how late you'll really be, so the time you give is accurate.",
      nextMove: "Then message them straight away.",
      followUps: ["What if it's a job interview?", "How do I apologise when I arrive?"],
    },
    words: {
      answer: "Short and specific: sorry, why in a few words, and when you'll arrive.",
      scripts: [
        "So sorry, I'm running about [X] minutes late. I'll be there as soon as I can.",
        "Apologies, my bus is delayed. I should arrive at [time].",
        "I'm running late, sorry! Please start without me and I'll catch up.",
      ],
      nextMove: "Send one now.",
      followUps: ["What if it's a job interview?", "What if I miss it completely?"],
    },
    extras: [
      {
        match: /\binterview\b|\bexam\b|\btest\b|\bappointment\b/i,
        reply: {
          answer: "Then call rather than text if you can, and apologise briefly. Arriving calm with a clear apology is better than rushing in flustered.",
          scripts: ["Hello, this is [name]. I have an interview at [time], and I'm running about [X] minutes late because of traffic. I'm very sorry."],
          nextMove: "Call them now, and ask whether they'd still like you to come.",
          followUps: ["What if I miss it completely?", "How do I apologise when I arrive?"],
        },
      },
      {
        match: /\bmiss(ing)? it\b|\bwon'?t make it\b|\btoo late\b/i,
        reply: {
          answer: "Then tell them as soon as you know, apologise, and ask about rearranging. Many things can be rescheduled if you're upfront quickly.",
          scripts: ["I'm really sorry, I won't make it in time. Could we find another time?"],
          nextMove: "Send that now, and suggest two alternative times.",
          followUps: ["What if it's a job interview?", "How do I apologise when I arrive?"],
        },
      },
      {
        match: /\bapologi[sz]e\b|\bwhen i (arrive|get there)\b/i,
        reply: {
          answer: "Keep it short and move on: one sentence of apology, then get into what you're there for. Long explanations make it bigger.",
          scripts: ["Sorry I'm late, thanks for waiting."],
          nextMove: "Take a breath before you walk in, then say it once.",
          followUps: ["What if it's a job interview?", "What if I miss it completely?"],
        },
      },
    ],
  },
  {
    id: "gap-year",
    example: "Should I take a gap year before university?",
    keywords: [
      /\bgap year\b/i,
      /\b(take|taking) a (gap|year off|year out|break)\b/i,
      /\byear (off|out)\b/i,
      /\bbefore (uni|university|college)\b/i,
    ],
    related: [/\b(uni|university|college)\b/i],
    initial: initial({
      answer:
        "It depends on what you'd do with the year. A gap year with a plan, like work, saving, travel or a project, can be great; a year with no plan often drifts.",
      points: [
        "Check whether you can defer your place, or would need to reapply.",
        "Write down what you'd actually do each month.",
        "Think about how you'd pay for it.",
      ],
      question: "What would you want to do with the year?",
      nextMove: "Find out your university's deferral rules this week, and sketch a rough plan for the year.",
      followUps: ["I want a break from studying.", "I'd like to work and save.", "What will people think?"],
      title: "Thinking about a gap year",
    }),
    direct: {
      answer: "Take it only if you can name what you'd do with it. If you can't yet, that's your answer for now.",
      nextMove: "Try writing the plan this week.",
      followUps: ["I want a break from studying.", "I'd like to work and save."],
    },
    firstStep: {
      answer: "First, check whether you can defer your university place.",
      nextMove: "Look up the rules or ask admissions this week.",
      followUps: ["I'd like to work and save.", "What will people think?"],
    },
    words: {
      answer: "Asking about deferral is a routine question for admissions teams.",
      scripts: ["I've been offered a place for [course] and I'm considering a gap year. Is it possible to defer, and how?"],
      nextMove: "Send it to admissions this week.",
      followUps: ["I want a break from studying.", "What will people think?"],
    },
    extras: [
      {
        match: /\bbreak\b|\btired of (studying|school)\b|\brest\b/i,
        reply: {
          answer: "That's a real reason, but plan some structure anyway, like a job or a project, so you come back refreshed rather than out of routine.",
          nextMove: "List two or three things you'd like to do with the time, and check you can defer.",
          followUps: ["I'd like to work and save.", "What will people think?"],
        },
      },
      {
        match: /\bwork\b|\bsave\b|\bsaving\b|\bmoney\b|\bjob\b/i,
        reply: {
          answer: "That's one of the most practical reasons. Set a savings goal and start looking for work early, so the year has a clear purpose.",
          nextMove: "Look at a few job options now, and set a savings target.",
          followUps: ["I want a break from studying.", "What will people think?"],
        },
      },
      {
        match: /\bpeople think\b|\bwhat will\b|\bjudge\b|\bparents\b|\bfriends\b/i,
        reply: {
          answer: "Some may ask questions, but a clear plan answers most of them. It's your decision; what matters is that the year is worth it to you.",
          scripts: ["I'm taking a year to [plan] before uni. I've deferred my place, so it's all sorted."],
          nextMove: "Write your plan in two sentences, so you can explain it easily.",
          followUps: ["I want a break from studying.", "I'd like to work and save."],
        },
      },
    ],
  },
  {
    id: "quit-hobby",
    example: "I've played piano for years but I don't enjoy it anymore. Should I quit?",
    keywords: [
      /\b(don'?t|do not) (enjoy|love|like) it anymore\b|\blost interest\b|\bnot fun anymore\b|\bstopped enjoying\b/i,
      /\b(quit|give up|stop)\b[^.?!]*\b(piano|guitar|violin|drums|instrument|lessons|dance|dancing|ballet|football|soccer|basketball|swimming|sport|training|club|band|choir|hobby)\b|\b(piano|guitar|violin|drums|instrument|lessons|dance|dancing|ballet|football|soccer|basketball|swimming|sport|training|club|band|choir|hobby)\b[^.?!]*\b(quit|give (it )?up|stop)\b/i,
    ],
    related: [
      /\bfor (\w+ )?years\b/i,
      /\b(piano|guitar|violin|drums|instrument|lessons|dance|dancing|ballet|football|soccer|basketball|swimming|sport|training|hobby)\b/i,
      /\bquit\b/i,
    ],
    initial: initial({
      answer:
        "Years of practice aren't a reason to keep going if it no longer gives you anything. First check whether you've lost interest in the activity itself, or just in how you're doing it.",
      points: [
        "A different teacher, style or goal can bring it back.",
        "A break of a few weeks can show you what you miss.",
        "It's okay to stop; the skill doesn't disappear.",
      ],
      question: "Is it the activity itself you're tired of, or the lessons, practice routine or pressure around it?",
      nextMove: "Try a short break or a change, like playing only what you enjoy for a few weeks, then decide.",
      followUps: ["It's the lessons I don't like.", "My parents want me to continue.", "I feel like I'd waste all those years."],
      title: "Quitting something you've done for years",
    }),
    direct: {
      answer: "If a break and a change don't bring the enjoyment back, it's okay to stop.",
      nextMove: "Try a break of a few weeks first.",
      followUps: ["My parents want me to continue.", "I feel like I'd waste all those years."],
    },
    firstStep: {
      answer: "First, work out what exactly you don't enjoy: the activity, the lessons, or the pressure.",
      nextMove: "Write down the parts you still like and the parts you don't.",
      followUps: ["It's the lessons I don't like.", "My parents want me to continue."],
    },
    words: {
      answer: "Honest and calm, with a suggestion.",
      scripts: [
        "I'm not enjoying [activity] anymore. Could I take a break for a few weeks?",
        "I'd like to try [activity] a different way, maybe without exams.",
        "I've thought about it a lot, and I'd like to stop. Can we talk about it?",
      ],
      nextMove: "Pick the one that matches what you want.",
      followUps: ["My parents want me to continue.", "It's the lessons I don't like."],
    },
    extras: [
      {
        match: /\blessons?\b|\bteacher\b|\bpractice\b|\bpractising\b|\bexams?\b|\bpressure\b/i,
        reply: {
          answer: "Then change the setup before quitting the activity: a different teacher, fewer lessons, or playing just for fun for a while.",
          nextMove: "Ask whether you could pause lessons or try a less formal approach for a term.",
          followUps: ["My parents want me to continue.", "I feel like I'd waste all those years."],
        },
      },
      {
        match: /\bparents?\b|\bmum\b|\bmom\b|\bdad\b|\bfamily\b/i,
        reply: {
          answer:
            "Tell them honestly how you feel, and suggest a middle step, like a break or a change, rather than quitting outright. That's easier for them to agree to.",
          scripts: ["I'm not enjoying [activity] anymore. Could I take a break for a few weeks, or try it a different way?"],
          nextMove: "Talk to them this week, with your middle-step idea ready.",
          followUps: ["It's the lessons I don't like.", "I feel like I'd waste all those years."],
        },
      },
      {
        match: /\bwaste\b|\ball those years\b|\bthrow (it )?away\b/i,
        reply: {
          answer: "They wouldn't be wasted. You'd keep the skill, the discipline and the memories, and you can always come back to it later.",
          nextMove: "Decide based on what you want now, not on how long you've done it.",
          followUps: ["It's the lessons I don't like.", "My parents want me to continue."],
        },
      },
    ],
  },
  {
    id: "big-purchase",
    example: "Should I spend most of my savings on a new phone?",
    keywords: [
      /\bsavings\b/i,
      /\b(should i|worth) (buy|buying|spend|spending)\b/i,
      /\b(buy|buying|spend|spending)\b[^.?!]*\b(phone|laptop|console|bike|computer|trainers|headphones|tablet|car|shoes|clothes|game|gaming)\b/i,
    ],
    related: [/\bmoney\b|\bprice\b|\bcost|\bafford\b|\bexpensive\b|\bworth (it|the money)\b/i],
    initial: initial({
      answer:
        "It depends on what the savings are for and how much you need the phone. Spending most of your savings leaves little cushion, so check the alternatives first.",
      points: [
        "Is your current phone broken, or just older?",
        "Would a cheaper or refurbished model do the job?",
        "Could you wait a month and see if you still want it?",
        "How long would it take to save the money again?",
      ],
      nextMove: "Before buying, wait a week and compare at least two cheaper options.",
      followUps: ["My phone is actually broken.", "I really want the latest one.", "What if the price goes up?"],
      title: "Deciding on a big purchase",
    }),
    direct: {
      answer: "Don't spend most of your savings on it unless your phone is broken. Look for a cheaper option, or wait and save more.",
      nextMove: "Compare two cheaper options this week.",
      followUps: ["My phone is actually broken.", "I really want the latest one."],
    },
    firstStep: {
      answer: "First, decide how much of your savings you want to keep, no matter what.",
      nextMove: "Write that number down, then see what you can afford.",
      followUps: ["I really want the latest one.", "What if the price goes up?"],
    },
    words: {
      answer: "If you're unsure, it helps to talk it through with someone who knows your situation.",
      scripts: ["I'm thinking about spending [amount] of my savings on a new phone. Could you help me think it through?"],
      nextMove: "Ask someone you trust before buying.",
      followUps: ["My phone is actually broken.", "I really want the latest one."],
    },
    extras: [
      {
        match: /\bbroken\b|\bdoesn'?t work\b|\bstopped working\b|\bcracked\b/i,
        reply: {
          answer:
            "Then it's a need, not a want, but you still don't have to buy the most expensive option. Check repair costs and cheaper models first.",
          nextMove: "Get a repair quote and compare two cheaper phones today.",
          followUps: ["I really want the latest one.", "What if the price goes up?"],
        },
      },
      {
        match: /\blatest\b|\bnewest\b|\breally want\b|\beveryone has\b/i,
        reply: {
          answer:
            "That's allowed, as long as you choose it with your eyes open. Decide how much savings you want to keep, and only buy if you'd still have that left.",
          nextMove: "Set a minimum amount to keep in savings, then see if the phone still fits.",
          followUps: ["My phone is actually broken.", "What if the price goes up?"],
        },
      },
      {
        match: /\bprice\b|\bsale\b|\bdeal\b|\bgoes up\b|\bsell out\b/i,
        reply: {
          answer:
            "A deal is only a deal if you'd have bought it anyway. A small price rise usually costs less than regretting a rushed purchase.",
          nextMove: "Give yourself a set waiting period, like a week, before deciding.",
          followUps: ["My phone is actually broken.", "I really want the latest one."],
        },
      },
    ],
  },
  {
    id: "summer-plans",
    example: "My summer holidays start soon and I have no plan for them.",
    keywords: [
      /\bsummer\b/i,
      /\b(holidays|vacation|half[- ]term|the break)\b[^.?!]*\b(no plans?|nothing planned|nothing to do|bored|what to do)\b|\b(no plans?|nothing planned|nothing to do|bored|what to do)\b[^.?!]*\b(holidays|vacation|half[- ]term|the break)\b/i,
    ],
    related: [
      /\bno plans?\b|\bnothing planned\b|\bwhat to do (with|over|during)\b/i,
      /\bbored\b/i,
      /\b(holidays?|vacation|break)\b/i,
    ],
    initial: initial({
      answer:
        "You don't need a packed schedule, just a few things that make the time feel worthwhile. Pick one thing to work towards, one thing for fun, and a loose weekly rhythm.",
      points: [
        "One goal: a skill, a project, some savings or work.",
        "One fun thing: a trip, an event, time with friends.",
        "A simple routine, so the days don't blur together.",
      ],
      nextMove: "This week, write down one goal and one fun thing, and put a first step for each in your calendar.",
      followUps: ["I have no money to do anything.", "I want to get a summer job.", "How do I not waste it?"],
      title: "Planning the summer",
    }),
    direct: {
      answer: "Pick one goal and one fun plan this week. That's enough structure.",
      nextMove: "Write them down today.",
      followUps: ["I want to get a summer job.", "How do I not waste it?"],
    },
    firstStep: {
      answer: "First, list what you'd like to have done by the end of the summer.",
      nextMove: "Pick the one that matters most, and plan its first step.",
      followUps: ["I have no money to do anything.", "How do I not waste it?"],
    },
    words: {
      answer: "A few simple messages can fill your summer with plans.",
      scripts: ["Want to do something every Friday this summer?", "Hi, I'm looking for summer work from [date]. Do you have any openings?"],
      nextMove: "Send one to a friend and one to a possible job this week.",
      followUps: ["I want to get a summer job.", "How do I not waste it?"],
    },
    extras: [
      {
        match: /\bno money\b|\bcan'?t afford\b|\bbroke\b|\bfree\b|\bcheap\b/i,
        reply: {
          answer:
            "Plenty is free: volunteering, learning something online, sport, projects, or regular days out with friends. The routine matters more than the budget.",
          nextMove: "List three free things you'd enjoy, and pick one to start.",
          followUps: ["I want to get a summer job.", "How do I not waste it?"],
        },
      },
      {
        match: /\bjob\b|\bwork\b|\bearn\b|\bmoney\b/i,
        reply: {
          answer: "Start looking now; summer jobs often fill early. Try local shops, cafés, events and people you know.",
          scripts: ["Hi, I'm looking for summer work from [date]. Do you have any openings?"],
          nextMove: "Ask in person or online at three places this week.",
          followUps: ["I have no money to do anything.", "How do I not waste it?"],
        },
      },
      {
        match: /\bwaste\b|\bbored\b|\bproductive\b|\bdo nothing\b/i,
        reply: {
          answer:
            "Some rest is fine. To stop it disappearing, give each week one small target and keep a rough daily rhythm, like getting up at a similar time.",
          nextMove: "Set one small target for your first week of the holidays.",
          followUps: ["I have no money to do anything.", "I want to get a summer job."],
        },
      },
    ],
  },
  {
    id: "even-list",
    example: "I made a pros and cons list for a decision and it came out exactly even.",
    keywords: [
      /\bpros and cons\b/i,
      /\b(came out|comes out|came to|ended up) (exactly |completely |pretty much |totally )?(even|equal|a tie|tied|50[ /-]50)\b|\b(it'?s|is|are|was|were) (exactly |completely |pretty much |totally )?(a tie|tied|50[ /-]50|equal)\b|\b50[ /-]50\b|\bexactly even\b/i,
    ],
    related: [/\bdecision\b|\bdecide\b|\bchoice\b|\boptions\b/i, /\blist\b/i],
    initial: initial({
      answer:
        "An even list usually means the points aren't equally important. Weigh them instead of counting them: which one or two points actually matter most to you?",
      points: [
        "Give each point a weight from 1 to 5.",
        "Cross out anything you wouldn't care about in a year.",
        "Notice which result you're secretly hoping for.",
      ],
      nextMove: "Go through your list tonight and mark the single most important point on each side.",
      alternative: "If it's still a genuine tie, pick the option that's easier to undo, and set a date to review it.",
      followUps: ["They all feel important.", "I'm hoping for one option.", "What if I regret it?"],
      title: "When pros and cons are even",
    }),
    direct: {
      answer: "Weigh the points, then choose. If it's still even, go with the option that's easier to undo.",
      nextMove: "Decide by the end of the week.",
      followUps: ["What if I regret it?", "I'm hoping for one option."],
    },
    firstStep: {
      answer: "First, find the one point on each side that matters most.",
      nextMove: "Circle them now.",
      followUps: ["They all feel important.", "What if I regret it?"],
    },
    words: {
      answer: "Talking it through with someone can show which points really matter to you.",
      scripts: ["I'm stuck between two options and my list is even. Can I talk it through with you for ten minutes?"],
      nextMove: "Ask someone who knows you well.",
      followUps: ["They all feel important.", "I'm hoping for one option."],
    },
    extras: [
      {
        match: /\ball (feel )?important\b|\ball matter\b|\bcan'?t rank\b/i,
        reply: {
          answer:
            "Then imagine you could keep only one point from each side. Which would you keep? That's usually what the decision really rests on.",
          nextMove: "Do that exercise now, with one point per side.",
          followUps: ["I'm hoping for one option.", "What if I regret it?"],
        },
      },
      {
        match: /\bhoping\b|\bsecretly\b|\bgut\b|\bleaning\b/i,
        reply: {
          answer:
            "That's useful information. It doesn't have to decide it, but if nothing on the list rules it out, it's a reasonable tie-breaker.",
          nextMove: "Check whether anything on the list makes that option a bad idea; if not, go with it.",
          followUps: ["They all feel important.", "What if I regret it?"],
        },
      },
      {
        match: /\bregret\b|\bwrong (choice|one|decision)\b|\bmistake\b/i,
        reply: {
          answer:
            "With an even list, both options are reasonable, so there's less to regret than it feels. Choose, then decide in advance what you'd do if it doesn't work out.",
          nextMove: "Write a one-line plan B for whichever option you choose.",
          followUps: ["They all feel important.", "I'm hoping for one option."],
        },
      },
    ],
  },
  {
    id: "back-out",
    example: "I agreed to help with something, and now I really want to back out.",
    keywords: [
      /\bback out\b|\bpull out\b|\bget out of (it|this|something|doing|helping)\b|\bcancel on (them|him|her)\b/i,
      /\b(agreed|said yes|promised|signed up|committed) to\b/i,
      /\bchanged? my mind\b/i,
    ],
    related: [/\bfriend/i, /\balready\b/i],
    initial: initial({
      answer: "It's okay to back out if you do it early and honestly. Tell them as soon as possible, apologise briefly, and help with the gap if you can.",
      points: [
        "The sooner you say it, the easier it is for them.",
        "Give a short, true reason; no need for a long story.",
        "Offer something: finding a replacement or doing a smaller part.",
      ],
      question: "How close is it, and would pulling out leave them stuck?",
      nextMove: "Decide today, and if you're backing out, tell them today.",
      scripts: ["I'm really sorry, but I can't help with [thing] after all. I wanted to tell you as early as possible. Can I help find someone else?"],
      followUps: ["It's happening very soon.", "What if they're really counting on me?", "Should I just do it anyway?"],
      title: "Backing out of a commitment",
    }),
    direct: {
      answer: "If you're going to back out, do it today, honestly, and offer help with the gap.",
      nextMove: "Send the message now.",
      followUps: ["It's happening very soon.", "What if they're really counting on me?"],
    },
    firstStep: {
      answer: "First, decide whether you're really backing out or just reluctant.",
      nextMove: "Name your real reason in one sentence.",
      followUps: ["Should I just do it anyway?", "It's happening very soon."],
    },
    words: {
      answer: "Early, honest and helpful.",
      scripts: [
        "I'm really sorry, but I can't help with [thing] after all. Can I help find someone else?",
        "I need to step back from [thing]. I'm sorry for the change of plan.",
        "I can't do the whole thing, but I could still do [smaller part].",
      ],
      nextMove: "Pick the one that fits and send it today.",
      followUps: ["What if they're really counting on me?", "It's happening very soon."],
    },
    extras: [
      {
        match: /\bvery soon\b|\btomorrow\b|\bthis week\b|\blast[- ]minute\b|\btoday\b/i,
        reply: {
          answer:
            "Then think twice: if you could manage it this once, that may be kinder. If you really can't, tell them right away and help find cover.",
          nextMove: "Decide within the hour, and act on it straight away.",
          followUps: ["What if they're really counting on me?", "Should I just do it anyway?"],
        },
      },
      {
        match: /\bcounting on me\b|\blet (them|him|her) down\b|\brely on me\b|\bneed me\b/i,
        reply: {
          answer:
            "Then help them fill the gap: find a replacement, or offer a smaller part you can still do. That keeps your word in spirit even if you step back.",
          scripts: ["I can't do all of it, but could I still help with [smaller part]?"],
          nextMove: "Think of one way to reduce the impact before you talk to them.",
          followUps: ["It's happening very soon.", "Should I just do it anyway?"],
        },
      },
      {
        match: /\bdo it anyway\b|\bjust do it\b|\bgo anyway\b/i,
        reply: {
          answer:
            "If it's a small thing and your reason is mostly reluctance, doing it can be the right call. If it's costing you something real, backing out honestly is fine.",
          nextMove: "Ask yourself which it is: reluctance, or a real cost.",
          followUps: ["It's happening very soon.", "What if they're really counting on me?"],
        },
      },
    ],
  },
  {
    id: "surprise-party",
    example: "I'm organising a surprise party for my friend and it's getting complicated.",
    keywords: [/\bsurprise (party|birthday|trip|dinner|gift|present)\b|\bsurprise for\b/i],
    related: [
      /\borgani[sz](e|ing)\b|\bplanning a\b/i,
      /\bfriend/i,
      /\bparty\b|\bbirthday\b/i,
      /\bcomplicated\b|\bgetting (out of hand|messy|stressful)\b|\bstressful\b/i,
    ],
    initial: initial({
      answer:
        "Simplify it and share the load. Fix the three things that matter most, which are the date, the place and how you'll get them there, and let everything else be simple.",
      points: [
        "Give one trusted person the job of getting them there.",
        "Use one group chat without them in it.",
        "Keep the guest list small enough to manage.",
      ],
      nextMove: "Today, confirm the date and place, and pick one person to handle getting your friend there.",
      followUps: ["What if they find out?", "People aren't replying.", "What if nobody comes?"],
      title: "Organising a surprise party",
    }),
    direct: {
      answer: "Lock in the date, the place and the plan for getting them there, and drop anything extra.",
      nextMove: "Confirm those three today.",
      followUps: ["What if they find out?", "People aren't replying."],
    },
    firstStep: {
      answer: "First, confirm the date and place, since everything else depends on them.",
      nextMove: "Do that today, then tell the guests.",
      followUps: ["People aren't replying.", "What if nobody comes?"],
    },
    words: {
      answer: "Clear, specific messages get replies.",
      scripts: [
        "Surprise party for [friend] on [date] at [place]! Please don't mention it to them. Can you come?",
        "Could you make sure [friend] gets to [place] at [time]? Keep it a secret!",
        "Reminder: please reply by [day] so I can plan numbers.",
      ],
      nextMove: "Send the first to guests and the second to your helper.",
      followUps: ["What if they find out?", "People aren't replying."],
    },
    extras: [
      {
        match: /\bfind out\b|\bfound out\b|\bspoil|\bsecret\b|\bguess(es|ed)?\b/i,
        reply: {
          answer:
            "Then it's still a party, and plenty of people enjoy one they know about. If it's nearly out, you can switch to \"we're planning something, don't ask\".",
          nextMove: "Limit who knows the details to the people who need them.",
          followUps: ["People aren't replying.", "What if nobody comes?"],
        },
      },
      {
        match: /\b(aren'?t|not|isn'?t|nobody'?s|no one'?s) replying\b|\bdon'?t reply\b|\brsvp\b/i,
        reply: {
          answer: "Set a clear reply-by date and message people individually; group chats are easy to ignore.",
          scripts: ["Hi! Are you coming to [friend]'s surprise on [date]? Could you let me know by [day] so I can plan?"],
          nextMove: "Message each person directly with the reply-by date.",
          followUps: ["What if they find out?", "What if nobody comes?"],
        },
      },
      {
        match: /\bnobody comes\b|\bno one comes\b|\bempty\b|\bfew people\b/i,
        reply: {
          answer: "Even a small group can make it special. Confirm a core of a few people first, and plan something that works at that size.",
          nextMove: "Get three definite yeses before planning anything bigger.",
          followUps: ["What if they find out?", "People aren't replying."],
        },
      },
    ],
  },
  {
    id: "money-runs-out",
    example: "My money always runs out before the end of the month.",
    keywords: [
      /\b(run|runs|running|ran) out\b[^.?!]*\bmoney\b|\bmoney\b[^.?!]*\b(run|runs|running|ran) out\b|\bout of money\b|\b(always|so|completely|totally|i'?m) broke\b/i,
      /\bend of the month\b|\bpay ?day\b|\ballowance\b|\bpocket money\b/i,
      /\bbudget(ing)?\b|\bsave (money|more)\b|\bsaving money\b/i,
    ],
    related: [/\bmoney\b/i, /\bspend(ing)?\b/i],
    initial: initial({
      answer:
        "First find out where the money actually goes, then plan the month before it starts. Small, regular spends often add up to more than you'd expect.",
      points: [
        "Track everything you spend for two weeks.",
        "Set aside savings and must-pays first, when the money arrives.",
        "Give yourself a weekly amount for everything else.",
      ],
      nextMove: "Starting today, note every purchase for two weeks, then look for the biggest leak.",
      followUps: ["I don't earn much to begin with.", "I always overspend on food.", "What's an easy budget to try?"],
      title: "Making money last the month",
    }),
    direct: {
      answer: "Track your spending for two weeks, then set a weekly limit.",
      nextMove: "Start tracking today.",
      followUps: ["I always overspend on food.", "What's an easy budget to try?"],
    },
    firstStep: {
      answer: "First, see where the money goes; you can't fix what you can't see.",
      nextMove: "Check last month's spending, or start noting it today.",
      followUps: ["What's an easy budget to try?", "I don't earn much to begin with."],
    },
    words: {
      answer: "If friends' plans cost too much, it's fine to suggest cheaper ones.",
      scripts: ["I'm saving this month. Could we do something cheaper, like [idea]?", "I'll skip this one, but I'm up for something free next week."],
      nextMove: "Use one next time a plan is over your budget.",
      followUps: ["I always overspend on food.", "What's an easy budget to try?"],
    },
    extras: [
      {
        match: /\bdon'?t earn\b|\bnot much\b|\blittle money\b|\bsmall (income|allowance)\b/i,
        reply: {
          answer:
            "Then small changes matter even more, and it's okay if saving is tiny at first. Cover the essentials, and look for one way to cut or earn a bit more.",
          nextMove: "List your essential costs, and see what's left for everything else.",
          followUps: ["I always overspend on food.", "What's an easy budget to try?"],
        },
      },
      {
        match: /\bfood\b|\btakeaway\b|\bsnacks?\b|\beating out\b|\bcoffee\b/i,
        reply: {
          answer: "That's a common one. Plan a few cheap meals, bring snacks from home, and set a weekly food amount you can watch going down.",
          nextMove: "Set a weekly food budget and keep it separate, like on a card or in cash.",
          followUps: ["I don't earn much to begin with.", "What's an easy budget to try?"],
        },
      },
      {
        match: /\bbudget\b|\bsimple\b/i,
        reply: {
          answer:
            "Try a simple split: essentials first, a small amount to savings, then a fixed weekly amount for everything else. When the weekly amount is gone, it's gone.",
          nextMove: "Work out your weekly amount tonight, and try it for one month.",
          followUps: ["I don't earn much to begin with.", "I always overspend on food."],
        },
      },
    ],
  },
  {
    id: "exercise-habit",
    example: "I want to start exercising, but I always give up after about a week.",
    keywords: [
      /\bexercis(e|ed|es|ing)\b|\bworkouts?\b|\bgym\b|\bget(ting)? fit\b|\bgo(ing)? (running|for runs|jogging)\b|\bwork(ing)? out (more|regularly|every day)\b/i,
    ],
    related: [
      /\bgive up\b|\bgiving up\b|\bquit(ting)?\b|\bcan'?t stick\b|\bnever stick\b|\bstick (to|with)\b/i,
      /\bafter (about )?(a|one) week\b|\bafter a few (days|weeks)\b/i,
      /\bhabit\b|\broutine\b/i,
    ],
    initial: initial({
      answer:
        "Start smaller than feels worthwhile, and tie it to something you already do. A habit that's easy to keep beats an ambitious plan that lasts a week.",
      points: [
        "Pick something you actually enjoy, like walking, dancing or a sport.",
        "Start with 10 to 15 minutes, a few times a week.",
        "Attach it to a fixed moment, like after school or before breakfast.",
        "If you miss a day, just do the next one; don't restart from zero.",
      ],
      nextMove: "Choose one activity and two fixed times this week, and keep each session short.",
      followUps: ["I get bored quickly.", "I don't have time.", "What if I miss a day?"],
      title: "Building an exercise habit",
    }),
    direct: {
      answer: "Pick something you enjoy and do a short version twice this week. Small and regular beats big and brief.",
      nextMove: "Put both sessions in your calendar now.",
      followUps: ["I get bored quickly.", "What if I miss a day?"],
    },
    firstStep: {
      answer: "First, pick an activity you'd actually enjoy, not the one you think you should do.",
      nextMove: "Choose it today and schedule the first short session.",
      followUps: ["I get bored quickly.", "I don't have time."],
    },
    words: {
      answer: "Asking a friend to join makes it easier to keep going.",
      scripts: ["Want to go for a walk every Tuesday after school?", "I'm trying to exercise more. Want to be my gym buddy this month?"],
      nextMove: "Ask one friend this week.",
      followUps: ["I don't have time.", "What if I miss a day?"],
    },
    extras: [
      {
        match: /\bbored\b|\bboring\b|\bhate (running|the gym|it)\b/i,
        reply: {
          answer: "Then change the activity, not your effort. Try something social or playful, like a class, a sport or exercising with a friend.",
          nextMove: "Try one new activity this week, and notice which one you look forward to.",
          followUps: ["I don't have time.", "What if I miss a day?"],
        },
      },
      {
        match: /\bno time\b|\bdon'?t have time\b|\bbusy\b/i,
        reply: {
          answer: "Then go shorter, not never: ten minutes counts. Walking or cycling somewhere you already need to go counts too.",
          nextMove: "Find one ten-minute slot in tomorrow's day.",
          followUps: ["I get bored quickly.", "What if I miss a day?"],
        },
      },
      {
        match: /\bmiss (a|one) day\b|\bmissed\b|\bskip\b|\bfall off\b/i,
        reply: {
          answer: "Then do the next session as planned. Missing once doesn't break a habit; giving up after missing once does.",
          nextMove: "Decide now: after a missed day, the next session is shorter, but it happens.",
          followUps: ["I get bored quickly.", "I don't have time."],
        },
      },
    ],
  },
  {
    id: "screen-time",
    example: "I spend way too much time on my phone and I want to cut back.",
    keywords: [
      /\b(too much|so much|way too much|hours) (of )?(time )?on (my )?(phone|screens?|social media|tiktok|instagram|games|youtube|laptop)\b|\bon my phone (too much|all the time|all day|constantly|so much)\b/i,
      /\bscreen ?time\b/i,
      /\baddicted to (my )?(phone|tiktok|social media|games|gaming|screens)\b|\bdoomscroll/i,
    ],
    related: [
      /\bphone\b|\bscrolling\b|\bsocial media\b|\btiktok\b/i,
      /\bcut (back|down)\b|\bspend less time\b|\breduce\b/i,
    ],
    initial: initial({
      answer:
        "Don't rely on willpower alone; change the setup. Make the phone a bit harder to use, and decide what you'll do instead in the moments you usually reach for it.",
      points: [
        "Check your screen-time stats to see which apps take the most.",
        "Move those apps off your home screen, or set daily limits.",
        "Keep the phone out of your bedroom at night.",
      ],
      nextMove: "Today, look at your screen-time stats and set a daily limit on your top app.",
      followUps: ["I just end up unlocking it again.", "I use it when I'm bored.", "What should I do instead?"],
      title: "Cutting down screen time",
    }),
    direct: {
      answer: "Set a daily limit on your top app today, and keep your phone out of your bedroom at night.",
      nextMove: "Do both tonight.",
      followUps: ["I just end up unlocking it again.", "What should I do instead?"],
    },
    firstStep: {
      answer: "First, find out where your time actually goes.",
      nextMove: "Check your screen-time stats now.",
      followUps: ["I use it when I'm bored.", "What should I do instead?"],
    },
    words: {
      answer: "Telling friends makes it easier to stick to.",
      scripts: ["I'm cutting down on my phone, so I might reply slower. Call me if it's urgent.", "Want to do a no-phones evening this week?"],
      nextMove: "Send the first to your group chat.",
      followUps: ["I just end up unlocking it again.", "I use it when I'm bored."],
    },
    extras: [
      {
        match: /\bunlock\b|\bignore the limit\b|\bbypass\b|\bagain\b/i,
        reply: {
          answer: "Then add more friction: log out of the app, delete it for a week, or hand your phone to someone at set times.",
          nextMove: "Delete or log out of your top app for one week, and see how it goes.",
          followUps: ["I use it when I'm bored.", "What should I do instead?"],
        },
      },
      {
        match: /\bbored\b|\bboredom\b|\bnothing to do\b/i,
        reply: {
          answer: "Then plan a few easy alternatives for those moments, like a book, music, a walk, or messaging someone to meet up.",
          nextMove: "Pick two things to reach for instead, and keep them within reach.",
          followUps: ["I just end up unlocking it again.", "What should I do instead?"],
        },
      },
      {
        match: /\binstead\b|\balternatives?\b/i,
        reply: {
          answer: "Choose things that are easy to start and give you something back: reading, a hobby, exercise, seeing friends, or learning something.",
          nextMove: "Swap one regular scrolling time, like before bed, for one of these this week.",
          followUps: ["I just end up unlocking it again.", "I use it when I'm bored."],
        },
      },
    ],
  },
  {
    id: "always-late",
    example: "I'm always running late in the mornings, even when I set an alarm.",
    keywords: [
      /\b(always|keep|constantly) (running |being )?late\b|\blate (to|for) (school|class|work|lessons) (every|all the time)\b|\blate every (day|morning)\b|\bbeing late\b/i,
      /\balarm\b|\bsnooze\b|\boversleep/i,
      /\b(get|getting|wake|waking) up (on time|earlier|early|in the morning)\b|\bmorning routine\b/i,
    ],
    related: [/\bmornings?\b/i, /\bon time\b/i, /\blate\b/i],
    initial: initial({
      answer:
        "Most of the fix happens the night before. Move decisions and prep to the evening, and work out how long mornings really take, not how long you hope they take.",
      points: [
        "Lay out clothes and pack your bag the night before.",
        "Time your morning once, then set your alarm to match.",
        "Put the alarm across the room, so snoozing takes effort.",
      ],
      nextMove: "Tonight, pack your bag and lay out your clothes, and set your alarm a little earlier.",
      followUps: ["I keep hitting snooze.", "I can't fall asleep early.", "I'm late because of other people."],
      title: "Getting out the door on time",
    }),
    direct: {
      answer: "Prep everything the night before, and set your alarm a little earlier. Those two changes do most of the work.",
      nextMove: "Do both tonight.",
      followUps: ["I keep hitting snooze.", "I can't fall asleep early."],
    },
    firstStep: {
      answer: "First, time how long your morning actually takes, from alarm to door.",
      nextMove: "Time it tomorrow, then adjust your alarm.",
      followUps: ["I keep hitting snooze.", "I'm late because of other people."],
    },
    words: {
      answer: "If lateness has become a problem somewhere, it helps to say you're fixing it.",
      scripts: ["I know I've been late a few times. I'm changing my morning routine, and it should be sorted from next week."],
      nextMove: "Say it once, then let your timing do the talking.",
      followUps: ["I keep hitting snooze.", "I can't fall asleep early."],
    },
    extras: [
      {
        match: /\bsnooze\b|\bcan'?t get up\b|\bstay in bed\b/i,
        reply: {
          answer: "Put the alarm out of reach, so you have to stand up to turn it off, and have one small thing to look forward to first thing.",
          nextMove: "Move your alarm across the room tonight.",
          followUps: ["I can't fall asleep early.", "I'm late because of other people."],
        },
      },
      {
        match: /\bfall asleep\b|\bsleep\b|\bbed ?time\b|\bstay up\b/i,
        reply: {
          answer:
            "Then start with the evening: a regular bedtime, screens away a bit before, and the same wake-up time most days. It can take a week or two to shift.",
          nextMove: "Pick a bedtime and try it for a week.",
          followUps: ["I keep hitting snooze.", "I'm late because of other people."],
        },
      },
      {
        match: /\bother people\b|\bfamily\b|\bsiblings?\b|\bbathroom\b|\blift\b|\bride\b/i,
        reply: {
          answer: "Then agree a morning plan with them, like who uses the bathroom when, or a leaving time everyone sticks to.",
          scripts: ["Could we agree a morning routine? I keep ending up late, and a set time would really help."],
          nextMove: "Suggest one change at a calm moment tonight.",
          followUps: ["I keep hitting snooze.", "I can't fall asleep early."],
        },
      },
    ],
  },
  {
    id: "messy-room",
    example: "My room is so messy that I don't even know where to start.",
    keywords: [
      /\b(room|bedroom|desk|wardrobe|house|flat)\b[^.?!]*\bmess(y)?\b|\bmess(y)?\b[^.?!]*\b(room|bedroom|desk|wardrobe)\b/i,
      /\b(clean|tidy|declutter|sort out)(ing)? (up )?(my |the )?(room|bedroom|desk|wardrobe|stuff)\b/i,
    ],
    related: [/\bmess(y)?\b|\bclutter/i, /\bclean(ing)?\b|\btidy(ing)?\b/i],
    initial: initial({
      answer: "Don't try to clean the whole room. Pick one small area, finish it completely, and let that momentum carry you to the next.",
      points: [
        "Start with the easy wins: rubbish and dishes.",
        "Then clothes: wash, hang or put away.",
        "Then one surface at a time, like the desk or bed.",
        "Keep a box for anything you're unsure about.",
      ],
      nextMove: "Set a short timer and clear just the rubbish and dishes.",
      followUps: ["I have too much stuff.", "It gets messy again straight away.", "I can't find the motivation."],
      title: "Tackling a messy room",
    }),
    direct: {
      answer: "Start with the rubbish and dishes, right now, for a few minutes.",
      nextMove: "Set a timer and go.",
      followUps: ["It gets messy again straight away.", "I can't find the motivation."],
    },
    firstStep: {
      answer: "Start with rubbish and dishes; they're quick and make the biggest visible difference.",
      nextMove: "Grab a bin bag and clear them now.",
      followUps: ["I have too much stuff.", "I can't find the motivation."],
    },
    words: {
      answer: "If it's a big job, asking for help is completely fair.",
      scripts: ["Could you help me sort my room for half an hour on Saturday?", "Can I borrow some boxes? I'm finally clearing out my room."],
      nextMove: "Ask someone at home this week.",
      followUps: ["I have too much stuff.", "It gets messy again straight away."],
    },
    extras: [
      {
        match: /\btoo much stuff\b|\btoo many things\b|\bclutter\b|\bnowhere to put\b/i,
        reply: {
          answer: "Then sort as you go: keep, donate, bin. If you haven't used something in a year and it isn't special, it can probably go.",
          nextMove: "Fill one bag for donating or throwing away today.",
          followUps: ["It gets messy again straight away.", "I can't find the motivation."],
        },
      },
      {
        match: /\bagain\b|\bstraight away\b|\bdoesn'?t last\b|\bkeep it (clean|tidy)\b/i,
        reply: {
          answer: "Then build a small daily reset: five minutes before bed putting things back. Give everything a home, so putting it away is easy.",
          nextMove: "Try a five-minute reset every night this week.",
          followUps: ["I have too much stuff.", "I can't find the motivation."],
        },
      },
      {
        match: /\bmotivat|\bcan'?t be bothered\b|\blazy\b|\bdon'?t feel like\b/i,
        reply: {
          answer:
            "Don't wait to feel like it. Put music on, set a short timer, and agree with yourself that you can stop when it rings; starting is the hard part.",
          nextMove: "Start a short timer right now, and stop when it rings if you want to.",
          followUps: ["I have too much stuff.", "It gets messy again straight away."],
        },
      },
    ],
  },
  {
    id: "learn-to-code",
    example: "I want to learn to code, but there's so much out there that I don't know where to start.",
    keywords: [
      /\b(learn|learning|start|starting|get into|getting into) (to )?(code|coding|program|programming|python|javascript|java|html|web development|app development)\b/i,
      /\b(coding|programming|python|javascript|html|web development)\b/i,
    ],
    related: [
      /\bso much (out there|to learn|information)\b|\btoo many (options|resources|courses)\b/i,
      /\bwhere to (start|begin)\b/i,
    ],
    initial: initial({
      answer:
        "Pick one beginner course and one small project, and ignore everything else for a month. Too many options can slow you down more than a lack of talent.",
      points: [
        "Choose one beginner-friendly language, like Python or JavaScript.",
        "Follow one free course from start to finish.",
        "Build something tiny and real, like a to-do list or a quiz.",
      ],
      question: "What would you like to make: websites, games, apps, or something else?",
      nextMove: "This week, choose one course and do the first lesson.",
      followUps: ["I want to make websites.", "I want to make games.", "I keep starting and stopping."],
      title: "Starting to learn to code",
    }),
    direct: {
      answer: "Pick Python or JavaScript, one free course, and one tiny project. Start today.",
      nextMove: "Do the first lesson today.",
      followUps: ["I want to make websites.", "I keep starting and stopping."],
    },
    firstStep: {
      answer: "First, decide what you want to build; that tells you what to learn.",
      nextMove: "Write down one small thing you'd love to make.",
      followUps: ["I want to make websites.", "I want to make games."],
    },
    words: {
      answer: "People who code are often happy to point beginners in the right direction.",
      scripts: ["I'm starting to learn to code. If you were a beginner again, where would you start?"],
      nextMove: "Ask one person who codes, or post it in a beginners' forum.",
      followUps: ["I want to make websites.", "I keep starting and stopping."],
    },
    extras: [
      {
        match: /\bwebsites?\b|\bweb\b|\bhtml\b|\bfront[- ]?end\b/i,
        reply: {
          answer:
            "Then start with HTML and CSS, then JavaScript. You'll see results in your browser straight away, which makes it easier to keep going.",
          nextMove: "Build a one-page site about something you like this month.",
          followUps: ["I want to make games.", "I keep starting and stopping."],
        },
      },
      {
        match: /\bgames?\b|\bunity\b|\bgodot\b|\broblox\b|\bscratch\b/i,
        reply: {
          answer:
            "Then pick a beginner-friendly game engine or a simple language like Python, and recreate a tiny classic game, like Pong, before anything bigger.",
          nextMove: "Follow one beginner game tutorial this week, start to finish.",
          followUps: ["I want to make websites.", "I keep starting and stopping."],
        },
      },
      {
        match: /\bstarting and stopping\b|\bgive up\b|\bconsistent\b|\bkeep stopping\b|\bmotivat/i,
        reply: {
          answer: "Then make it smaller and more regular: a short session a few times a week, at a fixed time, on one project you care about.",
          nextMove: "Pick two fixed times a week and put them in your calendar.",
          followUps: ["I want to make websites.", "I want to make games."],
        },
      },
    ],
  },
  {
    id: "waiting-news",
    example: "I applied for something important and I'm waiting to hear back. I can't stop checking my email.",
    keywords: [
      /\bwaiting to hear\b|\bwaiting (for|on) (a |the |my )?(\w+ )?(reply|response|results?|decision|news|answer|offer)\b|\bhear back\b/i,
      /\bcan'?t stop checking\b|\bkeep checking\b/i,
      /\bresults? day\b/i,
    ],
    related: [/\bapplied\b|\bapplication\b/i, /\bresults?\b/i, /\bemail\b|\bcollege\b|\buni(versity)?\b|\bexams?\b/i],
    initial: initial({
      answer:
        "The result is out of your hands now, so limit how much of your day the waiting takes. Check at set times, and plan what you'd do with either answer.",
      points: [
        "Check email twice a day, at set times.",
        "Turn off notifications you don't need meanwhile.",
        "Write a short plan for a yes and for a no.",
      ],
      nextMove: "Pick your two checking times today, and fill the gaps with something absorbing.",
      followUps: ["When should I follow up?", "What if the answer is no?", "I can't focus on anything else."],
      title: "Waiting to hear back",
    }),
    direct: {
      answer: "Check at set times only, and keep busy in between.",
      nextMove: "Set your checking times today.",
      followUps: ["When should I follow up?", "What if the answer is no?"],
    },
    firstStep: {
      answer: "First, find out if they gave a date for decisions.",
      nextMove: "Check the application details or your confirmation email.",
      followUps: ["When should I follow up?", "I can't focus on anything else."],
    },
    words: {
      answer: "A short, polite check-in is fine once any expected date has passed.",
      scripts: [
        "Hi, I applied for [position] on [date] and wanted to check on the timeline. Thank you!",
        "Hello, I'm following up on my application from [date]. Is there any update?",
      ],
      nextMove: "Send one only after any date they gave has passed.",
      followUps: ["What if the answer is no?", "I can't focus on anything else."],
    },
    extras: [
      {
        match: /\bfollow up\b|\bchase\b|\bcontact them\b|\bhow long\b/i,
        reply: {
          answer: "If they gave a date, wait until it's passed. If not, a polite check after two or three weeks is usually reasonable.",
          scripts: ["Hi, I applied for [position] on [date] and wanted to check on the timeline for a decision. Thank you!"],
          nextMove: "Note any date they gave, and set a reminder for just after it.",
          followUps: ["What if the answer is no?", "I can't focus on anything else."],
        },
      },
      {
        match: /\banswer is no\b|\breject|\bdon'?t get (it|in)\b|\bsay(s)? no\b/i,
        reply: {
          answer: "Then you'll be disappointed, and that's okay. Having a plan B ready means you'll know your next step, instead of starting from zero.",
          nextMove: "Write down your plan B in two lines today.",
          followUps: ["When should I follow up?", "I can't focus on anything else."],
        },
      },
      {
        match: /\bfocus\b|\bdistract|\bconcentrat|\bthink about anything else\b/i,
        reply: {
          answer:
            "Then choose things that need your full attention, like sport, a game, cooking or time with friends. Scrolling tends to leave room for the waiting to creep back in.",
          nextMove: "Plan one absorbing activity for each day this week.",
          followUps: ["When should I follow up?", "What if the answer is no?"],
        },
      },
    ],
  },
  {
    id: "didnt-make-team",
    example: "I tried out for the team and didn't get in. I really wanted it.",
    keywords: [
      /\b(didn'?t|did not) make (the |it onto the |it into the )?(team|squad|cut|choir|band|cast|play|list)\b|\b(didn'?t|did not|wasn'?t|was not) (get )?(in|into|picked|selected|chosen)\b|\b(didn'?t|did not) get (a|the) (part|role|place|spot)\b/i,
      /\btried out\b|\btryouts?\b|\baudition(ed|s)?\b/i,
    ],
    related: [
      /\bteam\b|\bsquad\b|\bchoir\b|\bband\b|\bplay\b|\bmusical\b|\bcast\b/i,
      /\breally wanted (it|to)\b/i,
      /\bdisappoint/i,
    ],
    initial: initial({
      answer:
        "That's a real disappointment, and it's okay to feel it. Once it's sunk in, ask for specific feedback; it turns a no into a plan for next time.",
      points: [
        "Ask the coach what would make the difference next time.",
        "Keep training in the meantime, even informally.",
        "Look for other ways to play, like a club or another team.",
      ],
      nextMove: "In the next week or so, ask the coach for two things to work on.",
      scripts: ["I was disappointed not to make the team, but I'd love to improve. What should I work on for next time?"],
      followUps: ["I'm too embarrassed to ask for feedback.", "My friends all made it.", "Should I try again next time?"],
      title: "Not making the team",
    }),
    direct: {
      answer: "Ask for feedback, keep playing, and try again if you still want it.",
      nextMove: "Ask the coach this week.",
      followUps: ["Should I try again next time?", "My friends all made it."],
    },
    firstStep: {
      answer: "First, give yourself a day or two to be disappointed.",
      nextMove: "Then ask the coach for feedback.",
      followUps: ["I'm too embarrassed to ask for feedback.", "Should I try again next time?"],
    },
    words: {
      answer: "Short, positive and focused on improving.",
      scripts: [
        "I was disappointed, but I'd love to improve. What should I work on?",
        "Could you tell me two things that would make a difference next time?",
        "Are there other teams or clubs you'd recommend in the meantime?",
      ],
      nextMove: "Pick one and ask the coach this week.",
      followUps: ["My friends all made it.", "Should I try again next time?"],
    },
    extras: [
      {
        match: /\bembarrass|\bawkward\b|\bscared to ask\b|\bshy\b/i,
        reply: {
          answer:
            "Asking for feedback takes maturity, and coaches often respect it. A short email works if talking face to face feels like too much.",
          scripts: ["Hi coach, I'd really like to improve for next time. Could you tell me two things to work on?"],
          nextMove: "Send the email this week.",
          followUps: ["My friends all made it.", "Should I try again next time?"],
        },
      },
      {
        match: /\bfriends\b|\beveryone else\b|\bleft out\b/i,
        reply: {
          answer:
            "That makes it harder. Be honest with them that you're gutted, and stay involved where you can, like watching games or training together.",
          nextMove: "Arrange one thing with those friends this week that isn't about the team.",
          followUps: ["I'm too embarrassed to ask for feedback.", "Should I try again next time?"],
        },
      },
      {
        match: /\btry again\b|\bnext (time|year|season)\b|\bgive up\b/i,
        reply: {
          answer: "If you still want it, yes. Use the feedback to set a clear goal, and keep playing in the meantime so you're ready.",
          nextMove: "Write down the goal and the date of the next tryout.",
          followUps: ["I'm too embarrassed to ask for feedback.", "My friends all made it."],
        },
      },
    ],
  },
  {
    id: "plans-cancelled",
    example: "The trip I've been looking forward to for months just got cancelled.",
    keywords: [
      /\b(got|been|was|is|were) cancell?ed\b|\bcalled off\b|\bfell through\b/i,
      /\b(trip|holiday|concert|festival|event|party|match|game|show|plans)\b[^.?!]*\b(cancell?ed|called off|fell through|postponed)\b/i,
    ],
    related: [
      /\blooking forward to\b|\bexcited (about|for)\b/i,
      /\bfor (months|weeks|ages)\b/i,
      /\bdisappoint/i,
      /\b(trip|holiday|concert|festival|event)\b/i,
    ],
    initial: initial({
      answer:
        "It's fine to be disappointed; you were looking forward to it. Once the first sting passes, check what can be rescued: a refund, a new date, or a smaller version of the same thing.",
      points: [
        "Check refund or rebooking options before any deadlines pass.",
        "Ask the people you were going with about a new date.",
        "Plan something small for the original dates, so they're not empty.",
      ],
      nextMove: "Today, check the refund or rebooking options, and message whoever you were going with.",
      followUps: ["It can't be rescheduled.", "I lost money on it.", "Everyone else is moving on."],
      title: "When plans fall through",
    }),
    direct: {
      answer: "Check what can be rescued today, then plan something else to look forward to.",
      nextMove: "Start with the refund or rebooking options.",
      followUps: ["It can't be rescheduled.", "I lost money on it."],
    },
    firstStep: {
      answer: "First, check your booking details and any deadlines for refunds or changes.",
      nextMove: "Find the confirmation email today.",
      followUps: ["I lost money on it.", "It can't be rescheduled."],
    },
    words: {
      answer: "A quick message keeps the plan alive in a new form.",
      scripts: [
        "Gutted about the trip. Want to find a new date, or do something smaller instead?",
        "Hi, my booking [reference] was cancelled. What are my options for a refund or rebooking?",
      ],
      nextMove: "Send the first to your friends and the second to the company.",
      followUps: ["It can't be rescheduled.", "I lost money on it."],
    },
    extras: [
      {
        match: /\bcan'?t be (rescheduled|rebooked|moved)\b|\bno new date\b|\bnever\b/i,
        reply: {
          answer: "Then plan something else to look forward to, even if it's smaller. A new date on the calendar gives the disappointment somewhere to go.",
          nextMove: "Pick a replacement plan this week, however small.",
          followUps: ["I lost money on it.", "Everyone else is moving on."],
        },
      },
      {
        match: /\bmoney\b|\brefund\b|\bpaid\b|\bdeposit\b|\bcost\b/i,
        reply: {
          answer:
            "Check the refund terms, your booking confirmation and any insurance before assuming the money's gone. If the organiser cancelled, you may be entitled to something back.",
          nextMove: "Find your booking confirmation today and look up the cancellation policy.",
          followUps: ["It can't be rescheduled.", "Everyone else is moving on."],
        },
      },
      {
        match: /\beveryone else\b|\bmoving on\b|\bover it\b|\bnobody cares\b/i,
        reply: {
          answer:
            "People get over disappointments at different speeds; it's fine if yours takes longer. Tell a friend it's still on your mind; you don't have to act fine.",
          nextMove: "Talk to one person about it this week, then plan something to look forward to.",
          followUps: ["It can't be rescheduled.", "I lost money on it."],
        },
      },
    ],
  },
  {
    id: "comparing",
    example: "Everyone around me seems to have their life figured out except me.",
    keywords: [
      /\beveryone (else )?(around me |i know |my age )?(seems|has|is|looks)\b[^.?!]*\b(figured out|ahead|better|together|sorted|succeeding|further)\b/i,
      /\b(life|lives|things|it all) figured out\b|\bfigured (it|their li(fe|ves)) out\b/i,
      /\bexcept me\b|\bbehind everyone\b|\b(so )?(far )?ahead of me\b/i,
      /\bcompar(e|ing) myself\b/i,
    ],
    related: [/\beveryone\b|\bother people\b|\bpeople my age\b/i],
    initial: initial({
      answer:
        "You're comparing everything you know about your own doubts with the little you see of other people's. The more useful question is what you'd like to move forward on next.",
      points: [
        "Notice where the comparing happens most, like on social media.",
        "Pick one area you'd like to make progress in.",
        "Measure yourself against where you were, not against others.",
      ],
      question: "Is there one area where it bothers you most, like school, work, friends or plans for the future?",
      nextMove: "Write down one small step you could take this week in the area that matters most to you.",
      followUps: ["It's mostly about my future plans.", "Social media makes it worse.", "I feel behind my friends."],
      title: "Comparing yourself to others",
    }),
    direct: {
      answer: "Stop measuring against others, and pick one thing to improve for yourself this month.",
      nextMove: "Choose it today.",
      followUps: ["It's mostly about my future plans.", "Social media makes it worse."],
    },
    firstStep: {
      answer: "First, notice when the comparing happens most.",
      nextMove: "For the next few days, jot down when it comes up.",
      followUps: ["Social media makes it worse.", "I feel behind my friends."],
    },
    words: {
      answer: "Saying it out loud to someone you trust can make it feel smaller.",
      scripts: ["Do you ever feel like everyone else has it figured out? I've been feeling that a lot lately."],
      nextMove: "Share it with one friend this week.",
      followUps: ["It's mostly about my future plans.", "I feel behind my friends."],
    },
    extras: [
      {
        match: /\bfuture\b|\bcareer\b|\bplans\b|\bwhat to do with my life\b/i,
        reply: {
          answer:
            "Then you don't need the whole plan, just a next step you can learn from, like trying something, talking to someone, or taking a short course.",
          nextMove: "Choose one small experiment to try this month.",
          followUps: ["Social media makes it worse.", "I feel behind my friends."],
        },
      },
      {
        match: /\bsocial media\b|\binstagram\b|\btiktok\b|\bonline\b|\bposts?\b/i,
        reply: {
          answer:
            "Then limit it for a while; it mostly shows highlights. Mute or unfollow accounts that leave you feeling worse, and notice the difference after a week.",
          nextMove: "Mute three accounts today, or set a daily limit.",
          followUps: ["It's mostly about my future plans.", "I feel behind my friends."],
        },
      },
      {
        match: /\bbehind\b|\bfriends\b|\beveryone else\b/i,
        reply: {
          answer: "People move at different speeds, and it isn't a race. Pick one thing that matters to you, and make progress on that.",
          nextMove: "Write down one goal for the next month that's about you, not them.",
          followUps: ["It's mostly about my future plans.", "Social media makes it worse."],
        },
      },
    ],
  },
  {
    id: "confidence",
    example: "I want to be more confident, but I don't know how.",
    keywords: [/\bconfiden(t|ce)\b/i, /\bself[- ]?esteem\b|\bbelieve in myself\b|\b(too|so|really|very) shy\b/i],
    initial: initial({
      answer:
        "Confidence usually comes after you do things, not before. It grows each time you try something a little uncomfortable and find you can handle it.",
      question: "Where would you most like more confidence: speaking up, meeting people, or trying new things?",
      nextMove: "Pick one small, slightly uncomfortable thing to try this week, like asking one question or saying hi first.",
      followUps: ["Speaking up.", "Meeting people.", "Trying new things."],
      title: "Building your confidence",
    }),
    direct: {
      answer: "Act before you feel ready. Confidence tends to follow what you do, so start with small things you can manage.",
      nextMove: "Do one slightly uncomfortable thing today, then notice how it actually went.",
      followUps: ["Speaking up.", "Meeting people."],
    },
    firstStep: {
      answer: "First, notice where you hold back most, and pick the smallest version of it to practise.",
      nextMove: "Write down one situation where you'd like to feel braver, and one tiny step towards it.",
      followUps: ["Speaking up.", "Trying new things."],
    },
    words: {
      answer: "It can help to tell someone you trust what you're working on, so they can back you up.",
      scripts: [
        "I'm trying to speak up more. Can you back me up if I share an idea?",
        "I'd like to try [activity], but I'm nervous. Want to come with me the first time?",
      ],
      nextMove: "Pick one person to tell this week.",
      followUps: ["Meeting people.", "Trying new things."],
    },
    extras: [
      {
        match: /\bspeak(ing)? up\b|\bin class\b|\bin groups?\b|\bmy opinion\b/i,
        reply: {
          answer:
            "Start with low-stakes chances to speak: one question in class, or one comment in a small group. Each time makes the next a little easier.",
          points: [
            "Prepare one thing to say in advance.",
            "Say it early, before the nerves build.",
            "Afterwards, notice that it went fine, or at least okay.",
          ],
          nextMove: "Plan one question or comment for your next lesson or group conversation.",
          followUps: ["Meeting people.", "Trying new things."],
        },
      },
      {
        match: /\bmeet(ing)? (new )?people\b|\bnew people\b|\bmake friends\b|\bsocial/i,
        reply: {
          answer:
            "You don't need a clever opener. Plenty of people are glad when someone else starts, so a simple hello and a question about them is enough.",
          scripts: ["Hi, I'm [name]. How do you know everyone here?", "What did you think of [the lesson, event or game]?"],
          nextMove: "This week, start one short conversation with someone you don't know well.",
          followUps: ["Speaking up.", "Trying new things."],
        },
      },
      {
        match: /\btry(ing)? new things\b|\bnew things\b|\bsomething new\b|\bnew (club|hobby|activity)\b/i,
        reply: {
          answer:
            "Lower the stakes: try it once, as an experiment, rather than committing. You're allowed to be a beginner, and to decide it isn't for you.",
          nextMove: "Pick one new thing and a date to try it, and tell someone so you follow through.",
          followUps: ["Speaking up.", "Meeting people."],
        },
      },
    ],
  },
  {
    id: "ask-for-help",
    example: "I need help with something, but I really hate asking people for help.",
    keywords: [
      /\b(hate|hard|awkward|embarrassing|find it hard|struggle|scared|afraid) (asking|to ask)\b/i,
      /\bask(ing)? (people |anyone |someone |others )?for help\b/i,
      /\b(be|being|feel like|feeling like) a burden\b|\bbother(ing)? (people|anyone|others)\b/i,
    ],
    related: [/\bhelp\b/i],
    initial: initial({
      answer:
        "Needing help isn't a weakness, and a specific request is easy for people to say yes to. Say what you need, roughly how long it'll take, and when.",
      points: [
        "Ask one person, not a whole group.",
        "Give them an easy way to say no.",
        "Offer something back, if it fits.",
      ],
      nextMove: "Today, pick one person and send them one specific request.",
      scripts: ["Could you help me with [task] for about half an hour this week? Totally fine if you can't."],
      followUps: ["What if they say no?", "I don't want to be a burden.", "Who should I ask?"],
      title: "Asking for help",
    }),
    direct: {
      answer: "Ask one person today, for one specific thing.",
      nextMove: "Send the message now.",
      followUps: ["What if they say no?", "Who should I ask?"],
    },
    firstStep: {
      answer: "First, write down exactly what you need help with, in one sentence.",
      nextMove: "Then pick the person best placed to help.",
      followUps: ["Who should I ask?", "I don't want to be a burden."],
    },
    words: {
      answer: "Specific, small and easy to decline.",
      scripts: [
        "Could you help me with [task] for half an hour this week? Totally fine if not.",
        "I'm stuck on [thing]. Could I ask you a quick question?",
        "Would you be up for looking over [thing]? I'd really value your opinion.",
      ],
      nextMove: "Pick one and send it today.",
      followUps: ["What if they say no?", "I don't want to be a burden."],
    },
    extras: [
      {
        match: /\bsay(s)? no\b|\bcan'?t help\b|\bbusy\b|\breject/i,
        reply: {
          answer: "Then thank them and ask someone else. A no is usually about their time, not about you.",
          nextMove: "Have a second person in mind before you ask the first.",
          followUps: ["I don't want to be a burden.", "Who should I ask?"],
        },
      },
      {
        match: /\bburden\b|\bbother\b|\bannoying\b|\bweak\b/i,
        reply: {
          answer: "A clear, occasional request isn't a burden. Relationships run on give and take, and you can return the favour another time.",
          nextMove: "Make your request, and note one way you could help them back.",
          followUps: ["What if they say no?", "Who should I ask?"],
        },
      },
      {
        match: /\bwho (should|do|can) i ask\b|\bnobody to ask\b|\bno one to ask\b/i,
        reply: {
          answer:
            "Choose someone who knows about the thing and has a bit of time, not necessarily your closest person. Teachers, colleagues, family friends and classmates all count.",
          nextMove: "List three people who could help, and ask the most likely one.",
          followUps: ["What if they say no?", "I don't want to be a burden."],
        },
      },
    ],
  },
  {
    id: "procrastination",
    example: "I always put things off until the last minute, even things I care about.",
    keywords: [
      /\bput(ting)? (things|it|stuff|everything) off\b/i,
      /\bprocrastinat/i,
      /\b(until|till|til|to) the last minute\b|\bleave (things|it|everything|stuff) (to|until|till) the last\b/i,
    ],
    related: [/\blast[- ]minute\b/i],
    initial: initial({
      answer:
        "If last-minute pressure is what gets you going, create earlier, smaller deadlines on purpose. Starting is usually the hard part, so make it tiny and specific.",
      points: [
        "Break the task into steps, each with its own date.",
        "Tell someone your first deadline, so it feels real.",
        "Start with a five-minute version of the first step.",
      ],
      nextMove: "Pick one thing you're putting off, and do five minutes of it today.",
      followUps: ["I work better under pressure.", "I start but don't finish.", "I get distracted easily."],
      title: "Leaving things to the last minute",
    }),
    direct: {
      answer: "Do five minutes of the thing you're avoiding, today. Starting is most of the battle.",
      nextMove: "Do it now.",
      followUps: ["I work better under pressure.", "I start but don't finish."],
    },
    firstStep: {
      answer: "First, pick the one task that's hanging over you the most.",
      nextMove: "Write its first tiny step, and do it today.",
      followUps: ["I start but don't finish.", "I get distracted easily."],
    },
    words: {
      answer: "Telling someone your deadline makes it more real.",
      scripts: ["I'm going to finish [task] by Thursday. Can you check in with me then?", "Want to work side by side this afternoon? It helps me get started."],
      nextMove: "Send one to a friend today.",
      followUps: ["I work better under pressure.", "I get distracted easily."],
    },
    extras: [
      {
        match: /\bunder pressure\b|\bwork better\b|\bthrive\b/i,
        reply: {
          answer: "Maybe, but the cost is stress and rushed work. Mini-deadlines give you the same push earlier, with time left to fix mistakes.",
          nextMove: "Set one pretend deadline a couple of days before the real one.",
          followUps: ["I start but don't finish.", "I get distracted easily."],
        },
      },
      {
        match: /\b(don'?t|never) finish\b|\bhalfway\b/i,
        reply: {
          answer: "Then plan the finish, not just the start: decide what \"done\" looks like, and book time specifically for the last step.",
          nextMove: "For your current task, write down what \"done\" means in one sentence.",
          followUps: ["I work better under pressure.", "I get distracted easily."],
        },
      },
      {
        match: /\bdistract|\bphone\b|\bfocus/i,
        reply: {
          answer: "Then protect short blocks of time: phone in another room, one task open, a timer running. Short and focused beats long and scattered.",
          nextMove: "Try one focused block of about half an hour today.",
          followUps: ["I work better under pressure.", "I start but don't finish."],
        },
      },
    ],
  },
  {
    id: "todo-list",
    example: "My to-do list is so long that I don't know what to do first.",
    keywords: [
      /\bto-?do list\b/i,
      /\bwhat to do first\b|\bprioriti[sz](e|ing)\b|\bpriorities\b/i,
      /\b(so much|too much|too many things|a lot|loads|tons) to do\b|\b(too much|so much|loads of|a lot of|tons of) (home)?work\b/i,
    ],
    related: [/\blist\b|\btasks?\b/i, /\bwhere to (start|begin)\b/i],
    initial: initial({
      answer:
        "Sort it before you start: pick what's urgent or important, and let the rest wait. Then do one thing at a time, starting with the task that unblocks others or has the nearest deadline.",
      points: [
        "Circle the three things that matter most this week.",
        "Do tasks that take under five minutes straight away.",
        "Move anything that can wait to a \"later\" list.",
      ],
      nextMove: "Take five minutes now to circle your top three, and start the first one.",
      followUps: ["Everything seems urgent.", "I get stuck on the first task.", "The list keeps growing."],
      title: "Prioritising a long to-do list",
    }),
    direct: {
      answer: "Circle three things, do the most urgent one now, and ignore the rest until it's done.",
      nextMove: "Start the first one right away.",
      followUps: ["Everything seems urgent.", "I get stuck on the first task."],
    },
    firstStep: {
      answer: "First, cross off or move anything that doesn't need doing this week.",
      nextMove: "Shorten the list now, then pick your top three.",
      followUps: ["Everything seems urgent.", "The list keeps growing."],
    },
    words: {
      answer: "If some items depend on other people, a quick message can take them off your plate.",
      scripts: ["Could we push [task] to next week? I want to do it properly.", "Could you take [task] this time? I'm snowed under this week."],
      nextMove: "Send one today if it applies.",
      followUps: ["Everything seems urgent.", "The list keeps growing."],
    },
    extras: [
      {
        match: /\b(all|everything) (seems |feels |is )?urgent\b|\ball important\b/i,
        reply: {
          answer: "Then use consequences: what happens if each one slips a day? The ones with a real cost go first.",
          nextMove: "Next to each item, write what happens if it waits until next week.",
          followUps: ["I get stuck on the first task.", "The list keeps growing."],
        },
      },
      {
        match: /\bstuck\b|\bcan'?t start\b|\bfirst task\b|\bprocrastinat/i,
        reply: {
          answer: "Then make its first step tiny: open the file, write the heading, send one email. Momentum usually follows a small start.",
          nextMove: "Write down the tiniest first step, and do it now.",
          followUps: ["Everything seems urgent.", "The list keeps growing."],
        },
      },
      {
        match: /\bkeeps? growing\b|\bnever ends\b|\bmore (things|tasks)\b|\bendless\b/i,
        reply: {
          answer:
            "That's normal for any list. Keep it as a place to store tasks, and make a separate short list for today with only two or three items.",
          nextMove: "Write tomorrow's list tonight, with three items at most.",
          followUps: ["Everything seems urgent.", "I get stuck on the first task."],
        },
      },
    ],
  },
  {
    id: "lost-wallet",
    example: "I think I lost my wallet on the way home. What should I do?",
    keywords: [
      /\blost my (wallet|purse|bank card|debit card|credit card|card)\b|\b(wallet|purse) (is )?(missing|gone|stolen)\b|\bcan'?t find my (wallet|purse|bank card)\b/i,
      /\b(wallet|purse|bank card|debit card|credit card)\b/i,
    ],
    related: [/\bon the way (home|to|back)\b|\bleft it (on|at|in)\b|\bon the (bus|train)\b/i],
    initial: initial({
      answer: "Act quickly, in this order: block your cards, then retrace your steps and check where it might have been handed in.",
      points: [
        "Freeze or block your cards in your banking app, or call your bank.",
        "Call or check the places you went, and the transport company.",
        "Report it to the police if it might have been stolen or had ID in it.",
      ],
      nextMove: "Freeze your cards now; you can unfreeze them if the wallet turns up.",
      followUps: ["What if it had my ID in it?", "Where should I look first?", "Should I tell my parents?"],
      title: "Losing your wallet",
    }),
    direct: {
      answer: "Freeze your cards right now, then retrace your steps.",
      nextMove: "Open your banking app or call your bank now.",
      followUps: ["Where should I look first?", "What if it had my ID in it?"],
    },
    firstStep: {
      answer: "First, freeze or block your cards; that protects your money while you search.",
      nextMove: "Do it now in your banking app, or call your bank.",
      followUps: ["Where should I look first?", "Should I tell my parents?"],
    },
    words: {
      answer: "A short, specific call or message is all you need.",
      scripts: ["Hi, I think I left a wallet there earlier today. Has anyone handed one in?", "Hello, I've lost my card and need to block it, please."],
      nextMove: "Use the first with places you visited and the second with your bank.",
      followUps: ["Where should I look first?", "What if it had my ID in it?"],
    },
    extras: [
      {
        match: /\bID\b|\bid card\b|\bpassport\b|\blicen[cs]e\b|\bstudent card\b/i,
        reply: {
          answer:
            "Then report it lost and follow the official process for replacing it; that varies by document and country. Keep an eye out for anything unusual in your accounts.",
          nextMove: "Look up how to report and replace that specific document today.",
          followUps: ["Where should I look first?", "Should I tell my parents?"],
        },
      },
      {
        match: /\bwhere (should|do) i look\b|\blook first\b|\bretrace\b|\bsearch\b/i,
        reply: {
          answer: "Start with the last place you remember having it, then every stop since: shops, the bus or train, and your route home.",
          scripts: ["Hi, I think I left a wallet there earlier today. Has anyone handed one in?"],
          nextMove: "Call or visit the last two places you went, and the transport company's lost property.",
          followUps: ["What if it had my ID in it?", "Should I tell my parents?"],
        },
      },
      {
        match: /\bparents?\b|\bmum\b|\bmom\b|\bdad\b|\bfamily\b/i,
        reply: {
          answer: "Yes. Telling them quickly means they can help, especially if any cards are linked to them.",
          nextMove: "Tell them now, so you can sort out the cards together.",
          followUps: ["What if it had my ID in it?", "Where should I look first?"],
        },
      },
    ],
  },
  {
    id: "decide-by-tomorrow",
    example: "I have to make a big decision by tomorrow and I don't know what to do.",
    keywords: [
      /\b(big|important|huge|major|difficult|hard|tough) (decision|choice)\b/i,
      /\b(decide|decision|choice|choose)\b[^.?!]*\bby tomorrow\b|\bby tomorrow\b[^.?!]*\b(decide|decision|choice|choose)\b|\bdecide by\b|\b(decision|choice)\b[^.?!]*\b(today|tonight|this week)\b/i,
      /\b(make an?|have to|need to) ((important|big|huge|hard|difficult|tough) )?(decision|decide|choice)\b/i,
    ],
    related: [/\bdecision\b|\bdecide\b|\bchoice\b/i, /\bpanic/i],
    initial: initial({
      answer:
        "I can help properly once I know what the decision is. Meanwhile, one thing works whatever it is: write down the options and what each would really lead to.",
      points: [
        "What does each option give you, and what does it cost?",
        "Which is easier to undo if it goes wrong?",
        "What would you tell a friend in your position?",
      ],
      question: "What's the decision, and what are the options you're choosing between?",
      nextMove: "Tonight, write each option down with its best and worst realistic outcome.",
      followUps: ["It's between two options.", "It's about school or work.", "It's about a relationship."],
      title: "A decision due tomorrow",
    }),
    direct: {
      answer:
        "Pick the option whose worst case you can live with and whose best case you want. If both pass, choose the one that's easier to undo.",
      nextMove: "Decide tonight, then stop reconsidering.",
      followUps: ["It's between two options.", "It's about school or work."],
    },
    firstStep: {
      answer: "First, write the options down, so they're concrete rather than swirling around.",
      nextMove: "Do it now, with one line on each option's likely outcome.",
      followUps: ["It's between two options.", "It's about a relationship."],
    },
    words: {
      answer: "Talking it through with one trusted person tonight can make it clearer.",
      scripts: ["I have to decide something by tomorrow. Can I talk it through with you for ten minutes?"],
      nextMove: "Message one person now.",
      followUps: ["It's between two options.", "It's about school or work."],
    },
    extras: [
      {
        match: /\btwo options\b|\bbetween two\b|\beither\b|\bor the other\b/i,
        reply: {
          answer:
            "Then compare them on what matters to you, not on general rules. Which worst case could you live with, and which best case do you actually want?",
          nextMove: "Cross out any option whose worst case you couldn't live with.",
          followUps: ["It's about school or work.", "It's about a relationship."],
        },
      },
      {
        match: /\bschool\b|\bwork\b|\bjob\b|\bcourse\b|\buni(versity)?\b|\bcollege\b/i,
        reply: {
          answer:
            "Then check the practical side first: deadlines, costs, and whether you can change your mind later. If you can, ask someone who knows the system, like a teacher or manager, tonight.",
          nextMove: "Find out whether the decision can be changed later; if it can, the stakes are lower.",
          followUps: ["It's between two options.", "It's about a relationship."],
        },
      },
      {
        match: /\brelationship\b|\bfriend\b|\bpartner\b|\bfamily\b|\bsomeone\b/i,
        reply: {
          answer:
            "Then think about what you want the relationship to look like in six months, and which choice gets you closer. Being honest with them usually matters more than a perfect decision.",
          nextMove: "Write one sentence on what you want, and check each option against it.",
          followUps: ["It's between two options.", "It's about school or work."],
        },
      },
    ],
  },
  {
    id: "something-happened",
    example: "Something happened with my friend and I don't know what to do.",
    keywords: [
      /\bsomething happened (with|between|at)\b/i,
      /\bsomething happened\b/i,
      /\bhappened with (my|a) (friend|mate|classmate|family|sister|brother|partner)\b/i,
    ],
    related: [/\bfriend/i],
    initial: initial({
      answer:
        "I'd like to help with the actual situation, so tell me a bit about what happened. Whatever it was, give it a little time before reacting, and avoid sending anything while emotions are high.",
      question: "What happened, and what would you like to happen next?",
      nextMove: "Write down what happened in a few sentences, just the facts, before deciding what to do.",
      followUps: ["We had an argument.", "They said something that hurt.", "I think I did something wrong."],
      title: "Something happened with a friend",
    }),
    direct: {
      answer: "Don't react in the heat of the moment. Once you're calm, talk to them directly about what happened.",
      nextMove: "Give it a day, then reach out.",
      followUps: ["We had an argument.", "I think I did something wrong."],
    },
    firstStep: {
      answer: "First, get clear on what actually happened, separate from how it felt.",
      nextMove: "Write down the facts in a few sentences.",
      followUps: ["They said something that hurt.", "We had an argument."],
    },
    words: {
      answer: "When you're ready, a calm opener makes the conversation easier.",
      scripts: ["Can we talk about the other day? I want to sort it out.", "I don't want this to sit between us. Are you free to talk?"],
      nextMove: "Send one when you're calm.",
      followUps: ["We had an argument.", "I think I did something wrong."],
    },
    extras: [
      {
        match: /\bargument\b|\bargued\b|\bfight\b|\bfell out\b/i,
        reply: {
          answer:
            "Then give it a day or two to cool down, and think about what you'd like to happen: an apology, a conversation, or just moving past it.",
          scripts: ["I didn't like how things went the other day. Can we talk when you're ready?"],
          nextMove: "Wait until you're calm, then send one short message.",
          followUps: ["They said something that hurt.", "I think I did something wrong."],
        },
      },
      {
        match: /\b(they|he|she) said something\b|\bthat hurt\b|\bhurt me\b|\bupset me\b/i,
        reply: {
          answer: "Then tell them how it landed, calmly and specifically, rather than letting it build up. They may not realise how it came across.",
          scripts: ["When you said [thing], it really hurt. I wanted to tell you rather than let it sit."],
          nextMove: "Pick a private moment this week to say it.",
          followUps: ["We had an argument.", "I think I did something wrong."],
        },
      },
      {
        match: /\bdid something wrong\b|\bmy fault\b|\bi messed up\b|\bi said something\b/i,
        reply: {
          answer: "Then a short, sincere apology is the best next step: say what you did, say sorry, and skip the excuses.",
          scripts: ["I've been thinking about what I did, and I'm sorry. It wasn't fair to you."],
          nextMove: "Apologise soon, in whatever way you usually talk.",
          followUps: ["We had an argument.", "They said something that hurt."],
        },
      },
    ],
  },
  {
    id: "should-i-tell",
    example: "Should I tell them or not?",
    keywords: [
      /\bshould i tell\b/i,
      /\bthe truth\b|\bcome clean\b/i,
      /\bkeep (it )?(a )?secret\b|\bkeep quiet\b/i,
      /\bi lied\b|\blied to (my|them|him|her)\b/i,
    ],
    related: [/\bfriend/i, /\bor not\b/i],
    initial: initial({
      answer:
        "It depends on who it is and what you'd be telling them. A useful test: would staying quiet hurt them or you later, and would telling them help, or just ease your mind?",
      question: "Who is it, and what are you thinking of telling them?",
      nextMove: "Write down what you'd say and what you think would happen next, both if you tell them and if you don't.",
      followUps: ["It's about my feelings for someone.", "It's something I did wrong.", "It's a friend's secret."],
      title: "Deciding whether to tell someone",
    }),
    direct: {
      answer: "If staying quiet would hurt them later, tell them. If telling would only ease your conscience at their expense, think twice.",
      nextMove: "Apply that test to your situation today.",
      followUps: ["It's something I did wrong.", "It's a friend's secret."],
    },
    firstStep: {
      answer: "First, write down exactly what you'd say, in one or two sentences.",
      nextMove: "Then imagine their reaction, and decide.",
      followUps: ["It's about my feelings for someone.", "It's something I did wrong."],
    },
    words: {
      answer: "If you decide to tell them, a simple opener helps.",
      scripts: ["There's something I want to tell you, and I'd rather be honest.", "Can we talk? There's something on my mind I don't want to keep from you."],
      nextMove: "Choose a private moment to say it.",
      followUps: ["It's something I did wrong.", "It's about my feelings for someone."],
    },
    extras: [
      {
        match: /\bfeelings\b|\blike (them|him|her)\b|\bcrush\b/i,
        reply: {
          answer: "Then it's your call, and there's no wrong answer. If you tell them, do it privately and in a way that's easy for them to answer honestly.",
          nextMove: "Spend a bit more time with them first, then decide.",
          followUps: ["It's something I did wrong.", "It's a friend's secret."],
        },
      },
      {
        match: /\bdid (something )?wrong\b|\bmy fault\b|\bi messed up\b|\bi lied\b|\bmistake\b/i,
        reply: {
          answer:
            "Usually, yes. Owning it yourself, soon, is almost always better than them finding out another way. Say what you did, say sorry, and skip the excuses.",
          scripts: ["There's something I need to tell you. I [what you did], and I'm sorry."],
          nextMove: "Tell them soon, in person if you can.",
          followUps: ["It's about my feelings for someone.", "It's a friend's secret."],
        },
      },
      {
        match: /\bsecret\b|\bin confidence\b|\bpromised not to\b/i,
        reply: {
          answer:
            "Keep it, unless someone's safety is at risk. If it involves someone being hurt or in danger, telling a trusted adult is the right thing, even if you promised.",
          nextMove: "Ask yourself: is anyone in danger? If not, keep the confidence.",
          followUps: ["It's about my feelings for someone.", "It's something I did wrong."],
        },
      },
    ],
  },
  {
    id: "perfectionism",
    example: "I keep redoing my work because it never feels good enough.",
    keywords: [
      /\bredo(ing)?\b|\bstart(ing)? over\b|\brewrit(e|ing)\b/i,
      /\bnever (feels |seems |is )?good enough\b/i,
      /\bperfectionis(t|m)\b|\b(be|being|is|was) perfect\b/i,
      /\bkeep (changing|editing|rewriting|fixing|redoing|tweaking)\b/i,
    ],
    related: [
      /\bmy work\b|\bessay\b|\bproject\b|\bdrawing\b/i,
      /\bforever\b|\btakes? (me )?(so long|ages|forever)\b|\bnot good enough\b/i,
    ],
    initial: initial({
      answer:
        "Decide what \"good enough\" means before you start, then stop when you reach it. Extra rounds of redoing often cost more time than they add in quality.",
      points: [
        "Write down the requirements, and check against those, not against a feeling.",
        "Set a time limit for each piece of work.",
        "Ask someone else whether it's ready.",
      ],
      nextMove: "For your current task, write down what \"done\" means and a deadline, and stop when you hit either.",
      followUps: ["What if it's not good enough?", "I can't stop myself editing.", "How do I know when it's done?"],
      title: "When nothing feels good enough",
    }),
    direct: {
      answer: "Set a deadline and a \"done\" standard, and stop when you hit either.",
      nextMove: "Do it for your current task today.",
      followUps: ["What if it's not good enough?", "I can't stop myself editing."],
    },
    firstStep: {
      answer: "First, write down what the task actually requires.",
      nextMove: "Then check your work against that list, not against a feeling.",
      followUps: ["How do I know when it's done?", "What if it's not good enough?"],
    },
    words: {
      answer: "Asking someone else is a quick reality check.",
      scripts: ["Could you have a quick look at this and tell me if it's ready to hand in?", "Is this good enough for what we need, or is there one thing you'd change?"],
      nextMove: "Ask one person before your next round of edits.",
      followUps: ["What if it's not good enough?", "How do I know when it's done?"],
    },
    extras: [
      {
        match: /\bnot good enough\b|\bjudge|\bcriticis/i,
        reply: {
          answer:
            "Then you'll get feedback and improve it, which is how work gets better anyway. A finished, decent piece is usually worth more than a perfect one that's late.",
          nextMove: "Hand in or share the next piece at your \"done\" point, and see what feedback you get.",
          followUps: ["I can't stop myself editing.", "How do I know when it's done?"],
        },
      },
      {
        match: /\bcan'?t stop\b|\bediting\b|\bone more\b/i,
        reply: {
          answer: "Then make stopping a rule, not a feeling: a fixed number of review rounds, or a time limit, after which it goes out.",
          nextMove: "Allow yourself one final review, then submit it or save it as finished.",
          followUps: ["What if it's not good enough?", "How do I know when it's done?"],
        },
      },
      {
        match: /\bwhen it'?s done\b|\bhow do i know\b|\bfinished\b|\bready\b/i,
        reply: {
          answer: "It's done when it meets the requirements and does its job, not when it feels perfect. A short checklist makes that clear.",
          nextMove: "Write a three-point checklist for your current task.",
          followUps: ["What if it's not good enough?", "I can't stop myself editing."],
        },
      },
    ],
  },
  {
    id: "siblings-duty",
    example: "I have to look after my younger siblings after school, and I can't get my own homework done.",
    keywords: [/\blook(ing)? after (my )?(younger |little |baby )?(siblings|brothers?|sisters?|cousins)\b|\bbabysit/i],
    related: [
      /\bafter school\b/i,
      /\b(siblings|brothers?|sisters?)\b/i,
      /\bhomework\b|\bstud(y|ying)\b/i,
      /\bcan'?t (get )?(my own |my )?(homework|work|studying) done\b|\bno time (to|for) (study|studying|homework)\b|\bcan'?t do my homework\b/i,
    ],
    initial: initial({
      answer:
        "This is a real constraint, not a willpower problem, so plan around it. Find the pockets of time you do have, and talk to your family about a bit more study time.",
      points: [
        "Do homework alongside them, if they're doing theirs too.",
        "Use short gaps, like when they're eating or playing.",
        "Ask for one or two evenings a week that are just for you.",
      ],
      nextMove: "This week, ask your parents calmly whether one evening could be covered so you can study.",
      scripts: ["I'm happy to help with [siblings], but I'm struggling to get my homework done. Could I have one or two evenings a week to study?"],
      followUps: ["My parents can't help with it.", "They won't let me concentrate.", "Should I tell my teacher?"],
      title: "Balancing family duties and homework",
    }),
    direct: {
      answer: "Ask for one or two evenings a week to study, and tell a teacher about your situation.",
      nextMove: "Start with the conversation at home this week.",
      followUps: ["My parents can't help with it.", "Should I tell my teacher?"],
    },
    firstStep: {
      answer: "First, map out a normal week: when you're looking after them, and when you're free.",
      nextMove: "Write it down and find two pockets of study time.",
      followUps: ["They won't let me concentrate.", "My parents can't help with it."],
    },
    words: {
      answer: "Calm and appreciative, with a specific ask.",
      scripts: [
        "I'm happy to help with them, but I need a bit more time for homework. Could we sort out one evening a week?",
        "Could you help me find a quiet hour most days to study?",
      ],
      nextMove: "Say it at a calm moment this week.",
      followUps: ["My parents can't help with it.", "Should I tell my teacher?"],
    },
    extras: [
      {
        match: /\bcan'?t help\b|\bno one else\b|\bno choice\b|\bwork late\b|\bparents\b/i,
        reply: {
          answer:
            "Then it's worth telling a teacher, so they understand and may be able to help, like with a quiet space or some flexibility on deadlines. That's not making excuses; it's your situation.",
          nextMove: "Mention it to one teacher you trust this week.",
          followUps: ["They won't let me concentrate.", "Should I tell my teacher?"],
        },
      },
      {
        match: /\bconcentrat|\bnoisy\b|\bdistract|\bwon'?t let me\b/i,
        reply: {
          answer: "Then save work that needs focus for when they're asleep or busy, and use the noisy time for easier jobs, like reading or tidying notes.",
          nextMove: "Sort tonight's homework into \"needs focus\" and \"can do anywhere\".",
          followUps: ["My parents can't help with it.", "Should I tell my teacher?"],
        },
      },
      {
        match: /\bteacher\b|\bschool\b/i,
        reply: {
          answer:
            "Yes, it can help. Teachers can only take your situation into account if they know about it, and they may have ideas, like a place to study before school.",
          scripts: ["I look after my younger siblings after school, so I sometimes struggle to get homework done. Is there anything that could help?"],
          nextMove: "Talk to one teacher, or your form tutor, this week.",
          followUps: ["My parents can't help with it.", "They won't let me concentrate."],
        },
      },
    ],
  },
];
