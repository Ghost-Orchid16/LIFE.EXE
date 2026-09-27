// Demo mode: work and responsibilities.

import { initial, type DemoScenario } from "../scenario.ts";

export const WORK_SCENARIOS: DemoScenario[] = [
  {
    id: "job-interview",
    example: "I have a job interview on Thursday and I don't know how to prepare.",
    keywords: [
      /\binterview(s|ing|er|ers)?\b/i,
      /\b(hiring|recruiter|apply(ing)? for (a |the |this )?(job|role|position))\b/i,
    ],
    related: [/\bprepar(e|ing|ation)\b/i, /\bjob\b|\brole\b|\bposition\b/i, /\bnervous\b/i],
    initial: initial({
      answer:
        "Prepare for the questions you're very likely to get, and have two or three real examples ready. That covers most interviews better than memorising answers.",
      points: [
        "Research what they do, and why you want this role.",
        "Prepare \"Tell me about yourself\" in about a minute.",
        "Have examples of teamwork, a challenge and something you're proud of.",
        "Prepare one or two questions to ask them.",
      ],
      nextMove: "Tonight, write short notes for \"Tell me about yourself\" and three examples, then say them out loud once.",
      followUps: ["What if they ask something I can't answer?", "How do I answer \"your weaknesses\"?", "What questions should I ask them?"],
      title: "Preparing for an interview",
    }),
    direct: {
      answer: "Prepare three strong examples and a one-minute introduction. That's most of the work.",
      nextMove: "Write them down tonight.",
      followUps: ["How do I answer \"your weaknesses\"?", "What questions should I ask them?"],
    },
    firstStep: {
      answer: "First, reread the job description and underline what they're looking for.",
      nextMove: "Then match one example from your own experience to each thing you underlined.",
      followUps: ["What if they ask something I can't answer?", "How do I answer \"your weaknesses\"?"],
    },
    words: {
      answer: "A short, clear introduction sets the tone.",
      scripts: [
        "I'm [name], I'm [what you do now], and I'm interested in this role because [reason].",
        "Thank you for your time today. I really enjoyed hearing about [something they said].",
      ],
      nextMove: "Practise the first out loud; send the second as a thank-you afterwards.",
      followUps: ["What if they ask something I can't answer?", "What questions should I ask them?"],
    },
    extras: [
      {
        match: /\bcan'?t answer\b|\bdon'?t know (the answer|what to say)\b|\bblank\b|\bstuck\b/i,
        reply: {
          answer:
            "Pause and take a moment to think; that's allowed. If you really don't know, say so honestly and explain how you'd find out or approach it.",
          scripts: ["That's a good question. Let me think for a moment."],
          nextMove: "Practise saying that line out loud, so it's ready if you need it.",
          followUps: ["How do I answer \"your weaknesses\"?", "What questions should I ask them?"],
        },
      },
      {
        match: /\bweakness/i,
        reply: {
          answer: "Pick a real but manageable weakness, and say what you're doing about it. Avoid fake ones like \"I work too hard\".",
          scripts: ["I sometimes take on too much at once. I've started planning my week in advance, and it's helped."],
          nextMove: "Choose one real weakness tonight, and write one sentence on how you're improving it.",
          followUps: ["What if they ask something I can't answer?", "What questions should I ask them?"],
        },
      },
      {
        match: /\bquestions? (should i|to) ask\b|\bask them\b|\bmy questions\b/i,
        reply: {
          answer: "Ask about the work itself and what success looks like; it shows real interest.",
          points: [
            "\"What does a typical day look like?\"",
            "\"What would success look like in the first few months?\"",
            "\"What do you enjoy about working here?\"",
          ],
          nextMove: "Pick two to bring with you.",
          followUps: ["What if they ask something I can't answer?", "How do I answer \"your weaknesses\"?"],
        },
      },
    ],
  },
  {
    id: "part-time-balance",
    example: "I have a part-time job and I'm starting to fall behind at school.",
    keywords: [
      /\bpart[- ]time (job|work)\b|\bweekend job\b|\bsaturday job\b|\bafter[- ]school job\b/i,
      /\b(job|shifts?)\b[^.?!]*\b(school|studies|study|homework|grades|marks|uni|college|revision)\b|\b(school|studies|homework|grades)\b[^.?!]*\b(job|shifts?)\b/i,
      /\b(too many|more|extra|long) shifts\b/i,
    ],
    related: [
      /\bfall(ing)? behind\b|\bcan'?t keep up\b|\b(grades|marks) (are )?(drop|dropping|slipping|going down)/i,
      /\bstud(y|ying)\b/i,
    ],
    initial: initial({
      answer:
        "Something has to give, so decide what on purpose rather than letting your grades slip by default. Usually that means fewer or better-timed shifts during busy school periods.",
      points: [
        "Write down your weekly hours: school, work, homework, sleep.",
        "Ask for fewer or different shifts during exams or deadlines.",
        "Protect a few fixed study blocks each week.",
      ],
      nextMove: "This week, look at your next month of shifts and ask your manager to move or cut the ones that clash with big deadlines.",
      scripts: ["I have exams coming up. Could I have fewer shifts over the next few weeks, or move some to weekends?"],
      followUps: ["What if my manager says no?", "I need the money.", "Should I quit the job?"],
      title: "Balancing a job and school",
    }),
    direct: {
      answer: "Cut or move the shifts that clash with your biggest school deadlines.",
      nextMove: "Ask your manager this week.",
      followUps: ["What if my manager says no?", "I need the money."],
    },
    firstStep: {
      answer: "First, write down where your hours actually go each week.",
      nextMove: "Track one normal week, then decide what to change.",
      followUps: ["I need the money.", "Should I quit the job?"],
    },
    words: {
      answer: "Managers can often work with you if you ask early and specifically.",
      scripts: [
        "I have exams coming up. Could I have fewer shifts over the next few weeks?",
        "Could I move my weekday evening shifts to the weekend during exam season?",
      ],
      nextMove: "Ask this week, before the next rota is made.",
      followUps: ["What if my manager says no?", "Should I quit the job?"],
    },
    extras: [
      {
        match: /\bsay(s)? no\b|\bwon'?t (let|allow|change)\b|\brefuse/i,
        reply: {
          answer:
            "Then ask what is possible: swapping shifts with a colleague, a shorter shift, or a lighter stretch later. If nothing is flexible, you'll have a clearer decision to make.",
          nextMove: "Ask a colleague about swapping one clashing shift this week.",
          followUps: ["I need the money.", "Should I quit the job?"],
        },
      },
      {
        match: /\bmoney\b|\bafford\b|\bneed (the|this) (job|income)\b|\bpay\b/i,
        reply: {
          answer:
            "Then keep the job, but guard your study time: fewer, better-placed shifts, and fixed study blocks that don't move. The money matters, and so do your results.",
          nextMove: "Work out the minimum hours you need, and aim for that during busy school weeks.",
          followUps: ["What if my manager says no?", "Should I quit the job?"],
        },
      },
      {
        match: /\bquit\b|\bleave (the|my) job\b|\bstop working\b/i,
        reply: {
          answer: "Only if cutting hours isn't possible and your studies keep slipping. Try adjusting shifts first; you can revisit it after exams.",
          nextMove: "Give an adjusted schedule a month, then decide.",
          followUps: ["What if my manager says no?", "I need the money."],
        },
      },
    ],
  },
  {
    id: "day-off",
    example: "I need to ask my manager for a day off, but I'm nervous about asking.",
    keywords: [
      /\b(day|days|time|week|afternoon|morning|evening) off\b/i,
      /\b(holiday|vacation|annual) leave\b|\brequest (a |some )?(holiday|leave|time off)\b|\bbook (a |some )?(holiday|leave)\b/i,
      /\b(holiday|vacation)\b[^.?!]*\b(manager|boss|supervisor)\b|\b(manager|boss|supervisor)\b[^.?!]*\b(holiday|vacation)\b/i,
    ],
    related: [/\b(manager|boss|supervisor)\b/i, /\bask(ing)?\b|\brequest\b/i],
    initial: initial({
      answer:
        "Asking for time off is a normal part of any job. Ask as early as you can, say which day, and make it easy to say yes by offering to sort out cover or swap.",
      points: [
        "Check if there's a usual way to request it, like a form or app.",
        "You don't have to give a detailed reason.",
        "Offer a solution: swapping a shift, or finishing tasks first.",
      ],
      nextMove: "Send the request today, with the date and your offer to help cover it.",
      scripts: ["Hi [manager], could I take [date] off? I've asked [name] about swapping, and I'll make sure [task] is done before then."],
      followUps: ["What reason should I give?", "What if they say no?", "It's very short notice."],
      title: "Asking for time off",
    }),
    direct: {
      answer: "Ask today, clearly, with the date and a plan for cover.",
      nextMove: "Send it now.",
      followUps: ["What reason should I give?", "What if they say no?"],
    },
    firstStep: {
      answer: "First, check how time off is usually requested where you work.",
      nextMove: "Then ask that way, as early as possible.",
      followUps: ["What reason should I give?", "It's very short notice."],
    },
    words: {
      answer: "Short, polite and specific.",
      scripts: [
        "Could I take [date] off? I'll make sure my work is covered.",
        "I'd like to request [date] off. Is that okay?",
        "Would it be possible to swap my [day] shift? I have a commitment that day.",
      ],
      nextMove: "Pick one and send it today.",
      followUps: ["What if they say no?", "What reason should I give?"],
    },
    extras: [
      {
        match: /\breason\b|\bwhy\b|\bexplain\b|\bexcuse\b/i,
        reply: {
          answer:
            "Often you don't need one; \"a personal commitment\" is enough. If there's a simple, honest reason you're comfortable sharing, that's fine too.",
          nextMove: "Keep the reason to one short phrase, if you give one at all.",
          followUps: ["What if they say no?", "It's very short notice."],
        },
      },
      {
        match: /\bsay(s)? no\b|\brefuse|\bwon'?t (let|allow|give)\b/i,
        reply: {
          answer: "Ask what would make it possible, like a different day or finding cover yourself. If it's important, say so clearly and calmly.",
          scripts: ["I understand. Would it work if I found someone to cover, or took [other date] instead?"],
          nextMove: "Offer one concrete alternative straight away.",
          followUps: ["What reason should I give?", "It's very short notice."],
        },
      },
      {
        match: /\bshort notice\b|\btomorrow\b|\blast[- ]minute\b|\btoday\b/i,
        reply: {
          answer:
            "Then ask today, apologise for the short notice, and do what you can to make it easy, like arranging cover yourself.",
          scripts: ["Sorry for the short notice, but could I take tomorrow off? I've checked, and [name] can cover my shift."],
          nextMove: "Find possible cover first, then ask straight away.",
          followUps: ["What reason should I give?", "What if they say no?"],
        },
      },
    ],
  },
  {
    id: "work-mistake",
    example: "I made a mistake at work. Should I tell my manager or try to fix it quietly?",
    keywords: [
      /\b(mistake|error|messed up|screwed up|slip-up|slipped up) (at|in) (work|my job)\b/i,
      /\b(tell|told|inform) (my |the )?(manager|boss|supervisor)\b/i,
      /\bfix it (quietly|myself|before anyone)\b|\bcover (it )?up\b|\bhide it from\b/i,
    ],
    related: [/\bmistake\b|\berror\b|\bmessed up\b|\bscrewed up\b/i, /\b(manager|boss|supervisor|work)\b/i],
    initial: initial({
      answer:
        "In most cases, tell your manager soon, especially if it affects anyone else. Come with what happened, what you've already done to fix it, and how you'll prevent it next time.",
      points: [
        "Fix what you can straight away.",
        "Be factual; don't minimise it or over-apologise.",
        "If it's truly tiny and already fixed, a quick mention is enough.",
      ],
      nextMove: "Today, write down what happened and what you've done about it, then tell your manager.",
      scripts: ["I wanted to let you know I made a mistake with [task]. I've already [fix], and I'll [prevention] from now on."],
      followUps: ["What if I get in trouble?", "It's already fixed. Should I still tell?", "How do I stop worrying about it?"],
      title: "Owning a mistake at work",
    }),
    asked: {
      match: /\bshould i (tell|say|report|mention|admit)\b/i,
      answer:
        "Tell them, and soon, especially if it affects anyone else. Come with what happened, what you've already done to fix it, and how you'll prevent it next time.",
    },
    direct: {
      answer: "Tell your manager today, with the fix. It's almost always better than them finding out later.",
      nextMove: "Do it before the end of the day.",
      followUps: ["What if I get in trouble?", "It's already fixed. Should I still tell?"],
    },
    firstStep: {
      answer: "First, fix or contain whatever you can, right now.",
      nextMove: "Then write down what happened in two or three sentences, ready to tell your manager.",
      followUps: ["What if I get in trouble?", "How do I stop worrying about it?"],
    },
    words: {
      answer: "Factual, calm and with a plan.",
      scripts: [
        "I wanted to let you know I made a mistake with [task]. Here's what I've done to fix it.",
        "I got [task] wrong earlier. It's sorted now, and I'll [prevention] from now on.",
        "Can I have two minutes? I need to flag a mistake I made.",
      ],
      nextMove: "Pick one and use it today.",
      followUps: ["What if I get in trouble?", "It's already fixed. Should I still tell?"],
    },
    extras: [
      {
        match: /\btrouble\b|\bfired\b|\bsacked\b|\bconsequence|\bpunish/i,
        reply: {
          answer:
            "That depends on the mistake and your workplace, so I can't promise. Owning it early, with a fix, is usually the best way to limit the damage.",
          nextMove: "Tell them today, before they hear it another way.",
          followUps: ["It's already fixed. Should I still tell?", "How do I stop worrying about it?"],
        },
      },
      {
        match: /\balready fixed\b|\bfixed it\b|\b(no one|nobody) noticed\b|\bstill tell\b/i,
        reply: {
          answer:
            "If it's small, fixed and affected nobody, a quick mention is still a good habit; it builds trust. If it affected others or could come back, definitely tell them.",
          scripts: ["Quick heads-up: I made a small mistake with [task] earlier, but it's fixed now."],
          nextMove: "Send a short heads-up today.",
          followUps: ["What if I get in trouble?", "How do I stop worrying about it?"],
        },
      },
      {
        match: /\bworr(y|ying|ied)\b|\bcan'?t stop thinking\b|\boverthink/i,
        reply: {
          answer:
            "Once you've told them and fixed what you can, the useful part is done. Note what you'll do differently, and let that be the lesson.",
          nextMove: "Write one line on how you'll prevent it next time, then move on to your next task.",
          followUps: ["What if I get in trouble?", "It's already fixed. Should I still tell?"],
        },
      },
    ],
  },
  {
    id: "too-much-work",
    example: "My manager keeps giving me more work than I can finish.",
    keywords: [
      /\bworkload\b|\bmore work than i can\b/i,
      /\b(manager|boss|supervisor)\b[^.?!]*\b(too much|more work|more tasks|keeps? (giving|adding|piling|dumping)|pil(es|ing) (on|more))\b/i,
      /\bkeeps? (giving|adding|piling|dumping) (me )?(more )?(work|tasks|jobs)\b/i,
    ],
    related: [
      /\b(manager|boss|supervisor)\b/i,
      /\b(can'?t|cannot) (finish|keep up|get (it )?all done)\b/i,
      /\btoo much work\b/i,
    ],
    initial: initial({
      answer:
        "Don't quietly try to do it all. Show your manager what's on your plate and ask them to choose the priorities; that turns a vague problem into a decision they can make.",
      points: [
        "List your current tasks with rough time estimates.",
        "When something new arrives, ask what it should replace.",
        "Flag problems before deadlines, not after.",
      ],
      nextMove: "This week, write your task list with estimates, and ask your manager for ten minutes to go through priorities.",
      scripts: ["I want to do all of this well, but I can't fit it all in by Friday. Which of these should come first?"],
      followUps: ["What if they say it's all urgent?", "I'm worried I'll look lazy.", "Should I just work longer hours?"],
      title: "Too much work to finish",
    }),
    direct: {
      answer: "Tell your manager you can't do it all, and ask them to choose what comes first.",
      nextMove: "Book ten minutes with them this week.",
      followUps: ["What if they say it's all urgent?", "I'm worried I'll look lazy."],
    },
    firstStep: {
      answer: "First, list everything you're working on, with rough time estimates.",
      nextMove: "Do that today; it's the basis for the conversation.",
      followUps: ["What if they say it's all urgent?", "Should I just work longer hours?"],
    },
    words: {
      answer: "Keep it about the work and the priorities.",
      scripts: [
        "I can't fit all of this in by Friday. Which should come first?",
        "If I take this on, what should I put on hold?",
        "Could we go through my workload together? I want to get the important things right.",
      ],
      nextMove: "Use one in your next conversation with your manager.",
      followUps: ["What if they say it's all urgent?", "I'm worried I'll look lazy."],
    },
    extras: [
      {
        match: /\ball (of it )?(is )?urgent\b|\beverything'?s (a )?priority\b|\ball important\b/i,
        reply: {
          answer:
            "Then ask them to rank it, or say which deadline could move. If everything really is urgent, choosing what comes first is their call, not something you can solve alone.",
          scripts: ["If I can only finish two of these by Friday, which two matter most?"],
          nextMove: "Ask that question in your next conversation with them.",
          followUps: ["I'm worried I'll look lazy.", "Should I just work longer hours?"],
        },
      },
      {
        match: /\blazy\b|\bweak\b|\bincapable\b|\bbad at my job\b|\bcomplain/i,
        reply: {
          answer: "Showing your task list and asking for priorities looks organised, not lazy. Quietly missing deadlines is what would look worse.",
          nextMove: "Bring the list, so the conversation is about the work, not about you.",
          followUps: ["What if they say it's all urgent?", "Should I just work longer hours?"],
        },
      },
      {
        match: /\blonger hours\b|\bwork late\b|\bovertime\b|\bweekends?\b/i,
        reply: {
          answer:
            "Occasionally, for a real crunch, maybe. As a regular fix it isn't sustainable, and it hides the problem from the people who could solve it.",
          nextMove: "If you do stay late this week, still have the priorities conversation.",
          followUps: ["What if they say it's all urgent?", "I'm worried I'll look lazy."],
        },
      },
    ],
  },
  {
    id: "idea-credit",
    example: "A coworker presented my idea in a meeting as if it was theirs.",
    keywords: [
      /\b(took|takes|taking|stole|steals|stealing|claimed|claiming) (the )?(credit|my idea|my work)\b|\bcredit for my\b/i,
      /\bas if (it was|it were) (theirs|his|hers)\b|\bas (their|his|her) own\b|\bas theirs\b/i,
      /\bmy idea\b/i,
    ],
    related: [/\b(coworker|co-worker|colleague|teammate|classmate|group)\b/i, /\bmeeting\b|\bpresented\b/i],
    initial: initial({
      answer:
        "Don't assume it was deliberate yet; they may have forgotten where it came from. But do make your part visible, calmly, and talk to them privately.",
      points: [
        "In the moment, add to the idea with detail only you'd know.",
        "Talk to them privately, without accusing.",
        "Share future ideas in writing first, like an email.",
      ],
      nextMove: "Talk to them one-on-one this week and mention, calmly, that the idea came from you.",
      scripts: ["I noticed the idea you shared in the meeting was the one I'd suggested. I'd like us to make sure credit is clear going forward."],
      followUps: ["What if they deny it?", "Should I tell my manager?", "How do I stop it happening again?"],
      title: "When someone takes credit",
    }),
    direct: {
      answer: "Talk to them privately, calmly, and make your part clear. Then put future ideas in writing first.",
      nextMove: "Have the conversation this week.",
      followUps: ["What if they deny it?", "Should I tell my manager?"],
    },
    firstStep: {
      answer: "First, find any evidence of when you shared the idea: messages, emails or notes.",
      nextMove: "Gather it today, before talking to anyone.",
      followUps: ["What if they deny it?", "How do I stop it happening again?"],
    },
    words: {
      answer: "Calm, factual and not accusing.",
      scripts: [
        "The idea you shared in the meeting was one I'd suggested earlier. Can we make sure credit is clear?",
        "Happy to build on that idea; I first raised it in my email last week.",
        "Can we present this one together, since it started with my suggestion?",
      ],
      nextMove: "Use one privately, or the second one in the moment.",
      followUps: ["What if they deny it?", "Should I tell my manager?"],
    },
    extras: [
      {
        match: /\bden(y|ies|ied)\b|\bsay(s)? it was (theirs|his|hers)\b|\blie\b/i,
        reply: {
          answer: "Then don't argue it out with them. Keep your evidence, like messages or notes, and make your work visible from now on.",
          nextMove: "Save anything that shows when you shared the idea.",
          followUps: ["Should I tell my manager?", "How do I stop it happening again?"],
        },
      },
      {
        match: /\bmanager\b|\bboss\b|\bteacher\b|\bsupervisor\b/i,
        reply: {
          answer: "If it happens again, or it matters for your role, yes, calmly and with evidence. Keep it about the work, not about the person.",
          scripts: ["I wanted to mention that the idea for [project] started with me. Here's my email from [date]."],
          nextMove: "Gather your evidence first, then decide.",
          followUps: ["What if they deny it?", "How do I stop it happening again?"],
        },
      },
      {
        match: /\bhappening again\b|\bprevent\b|\bnext time\b|\bstop it\b/i,
        reply: {
          answer: "Put your ideas in writing before meetings, and say them yourself in the meeting. That makes credit clear without any confrontation.",
          nextMove: "Next time you have an idea, send a short email about it before the meeting.",
          followUps: ["What if they deny it?", "Should I tell my manager?"],
        },
      },
    ],
  },
  {
    id: "quit-job",
    example: "I'm thinking about quitting my part-time job, but I'm not sure it's the right call.",
    keywords: [
      /\bquit(ting)? (my |the |this )?([\w-]+ )?job\b|\b(leave|leaving) my job\b/i,
      /\bresign(ing|ation)?\b|\bhand(ing)? in my notice\b|\bgive (my )?notice\b/i,
    ],
    related: [/\bjob\b|\bwork\b/i, /\bright (call|decision|choice)\b/i, /\bquit/i],
    initial: initial({
      answer:
        "Separate what's fixable from what isn't. If the problem is a specific thing, like hours or a person, try changing that first; if it's the job itself, plan your exit.",
      points: [
        "Name exactly what you want to get away from.",
        "Check whether you need the income, and for how long.",
        "If you leave, give proper notice and leave on good terms.",
      ],
      question: "What's the main reason you want to leave: the hours, the people, the work itself, or something else?",
      nextMove: "Write down the one or two main reasons, and whether a conversation with your manager could fix either.",
      followUps: ["It's the hours.", "It's the people I work with.", "I just don't enjoy it anymore."],
      title: "Deciding whether to quit a job",
    }),
    direct: {
      answer: "If you can't name anything that would make you stay, plan to leave. Just line up the next step first if you need the money.",
      nextMove: "Set a date by which you'll decide.",
      followUps: ["It's the hours.", "I just don't enjoy it anymore."],
    },
    firstStep: {
      answer: "First, name the main reason you want to leave, in one sentence.",
      nextMove: "Write it down, then check whether anything could fix it.",
      followUps: ["It's the hours.", "It's the people I work with."],
    },
    words: {
      answer: "If you decide to leave, keep it short, grateful and professional.",
      scripts: [
        "I've decided to leave, and I'd like to give my notice. My last day will be [date]. Thank you for the experience.",
        "Before I decide anything, could we talk about my hours?",
      ],
      nextMove: "Check your notice period before you say anything.",
      followUps: ["It's the hours.", "It's the people I work with."],
    },
    extras: [
      {
        match: /\bhours\b|\bshifts?\b|\bschedule\b/i,
        reply: {
          answer:
            "Then ask for different or fewer hours before quitting. If they can't change them and it's hurting your studies or life outside work, that's a solid reason to go.",
          scripts: ["Could I work fewer hours, or move my shifts to [days]? It would really help."],
          nextMove: "Ask your manager this week, and decide based on the answer.",
          followUps: ["It's the people I work with.", "I just don't enjoy it anymore."],
        },
      },
      {
        match: /\bpeople\b|\bcoworkers?\b|\bcolleagues?\b|\bmanager\b|\bboss\b/i,
        reply: {
          answer:
            "It depends on whether it's one person or the whole place. If you're being treated badly, speak to someone senior; if it's the general atmosphere, leaving can be the right call.",
          nextMove: "Decide whether it's one person or the whole team, and whether anyone senior could help.",
          followUps: ["It's the hours.", "I just don't enjoy it anymore."],
        },
      },
      {
        match: /\benjoy\b|\bboring\b|\bbored\b|\bhate\b|\bpointless\b/i,
        reply: {
          answer: "Then it may be time, but line up the next thing first if you need the income. Leaving with a plan is easier than leaving in frustration.",
          nextMove: "Start looking at other options this week, and set a date to decide.",
          followUps: ["It's the hours.", "It's the people I work with."],
        },
      },
    ],
  },
  {
    id: "harsh-feedback",
    example: "I got some harsh feedback on my work and it's really bothering me.",
    keywords: [
      /\b(harsh|negative|bad|critical|brutal|tough) (feedback|comments|review|criticism)\b/i,
      /\bcriticis(ed|ing|m)\b|\bcriticiz(ed|ing)\b|\bcriticism\b/i,
      /\btore (it|my work) apart\b/i,
    ],
    related: [/\bfeedback\b/i, /\bbother(s|ing)? me\b|\bupset me\b|\bgetting to me\b/i, /\bmy work\b/i],
    initial: initial({
      answer:
        "Give it a day before reacting, then read it again looking for the one or two points that would actually improve your work. You can take what's useful without agreeing with all of it.",
      points: [
        "Separate the tone from the content.",
        "Pick the most useful point and act on it.",
        "Ask for an example if something's unclear.",
      ],
      nextMove: "Tomorrow, reread it and write down the one change you'll make first.",
      scripts: ["Thanks for the feedback. Could you show me an example of what you'd like to see instead?"],
      followUps: ["I think the feedback is unfair.", "How do I stop taking it personally?", "Should I reply to it?"],
      title: "Handling harsh feedback",
    }),
    direct: {
      answer: "Take the most useful point and act on it. Let the rest go for now.",
      nextMove: "Pick that point today.",
      followUps: ["I think the feedback is unfair.", "Should I reply to it?"],
    },
    firstStep: {
      answer: "First, let it sit for a day before responding to anyone.",
      nextMove: "Then reread it and underline what's genuinely useful.",
      followUps: ["How do I stop taking it personally?", "I think the feedback is unfair."],
    },
    words: {
      answer: "Thank them, and ask about what's unclear.",
      scripts: [
        "Thanks for the feedback. Could you show me an example of what you'd like to see?",
        "I'll work on [point]. Is there anything you'd prioritise?",
        "Could we talk through this part? I want to make sure I understand it.",
      ],
      nextMove: "Send one when you're calm, not straight away.",
      followUps: ["I think the feedback is unfair.", "How do I stop taking it personally?"],
    },
    extras: [
      {
        match: /\bunfair\b|\bwrong\b|\bdisagree\b|\bnot true\b/i,
        reply: {
          answer:
            "Then ask about it, calmly and specifically, once you've cooled down. Asking what they'd like instead often shows whether it's a real gap or a difference in taste.",
          scripts: ["Could you help me understand this point? I'd like to know what you'd expect to see."],
          nextMove: "List the points you disagree with, and ask about the most important one.",
          followUps: ["How do I stop taking it personally?", "Should I reply to it?"],
        },
      },
      {
        match: /\bpersonal(ly)?\b|\bhurt\b|\bupset\b|\bfeel (bad|awful|terrible)\b/i,
        reply: {
          answer:
            "Remind yourself the feedback is about this piece of work, not about you as a person. Focusing on one concrete fix helps turn the sting into something useful.",
          nextMove: "Make the first fix today; doing something about it usually takes the edge off.",
          followUps: ["I think the feedback is unfair.", "Should I reply to it?"],
        },
      },
      {
        match: /\breply\b|\brespond\b|\banswer\b/i,
        reply: {
          answer: "Yes, briefly and calmly: thank them and ask about anything unclear. Wait until you're not upset, so it doesn't sound defensive.",
          scripts: ["Thanks for taking the time to give feedback. I'll work on [point]. Could I check one thing with you?"],
          nextMove: "Send it tomorrow, not tonight.",
          followUps: ["I think the feedback is unfair.", "How do I stop taking it personally?"],
        },
      },
    ],
  },
  {
    id: "email-no-reply",
    example: "I emailed someone important a week ago and they still haven't replied.",
    keywords: [
      /\bemail(ed|s)?\b/i,
      /\b(haven'?t|hasn'?t|didn'?t|still not|no one|nobody|never) (replied|responded|reply|response|heard back|gotten back|got back|answered)\b|\bno (reply|response|answer)\b/i,
      /\bfollow(ing)?[- ]up\b|\bchase (it|them|this) up\b/i,
    ],
    related: [
      /\b(a|one|two|several) (week|weeks|days) ago\b/i,
      /\b(teacher|manager|boss|company|school|office|someone important)\b/i,
    ],
    initial: initial({
      answer:
        "A polite follow-up after a week is completely normal; emails get buried. Keep it short, restate what you need, and make it easy to answer.",
      points: [
        "Reply to your original email, so the context is there.",
        "Put the key question in the first line.",
        "Give a reason for the timing if there is one, like a deadline.",
      ],
      nextMove: "Send a short, friendly follow-up today.",
      scripts: ["Hi [name], just following up on my email below. Would you be able to let me know about [question] by [date]? Thanks!"],
      followUps: ["What if they still don't reply?", "Is it rude to follow up?", "Should I call instead?"],
      title: "Following up on an email",
    }),
    direct: {
      answer: "Send a short follow-up today. A week is plenty of time to wait.",
      nextMove: "Send it now.",
      followUps: ["What if they still don't reply?", "Should I call instead?"],
    },
    firstStep: {
      answer: "First, reread your original email: was the question clear and easy to answer?",
      nextMove: "Then follow up with the question in the first line.",
      followUps: ["Is it rude to follow up?", "What if they still don't reply?"],
    },
    words: {
      answer: "Short and polite, with the question up front.",
      scripts: [
        "Hi [name], just following up on my email below. Could you let me know about [question]?",
        "Hi [name], I wanted to check whether you'd had a chance to look at this.",
        "Hi [name], quick follow-up: I need to decide by [date], so any update would really help.",
      ],
      nextMove: "Pick one and send it today.",
      followUps: ["What if they still don't reply?", "Should I call instead?"],
    },
    extras: [
      {
        match: /\bstill (don'?t|doesn'?t|no|not)\b|\bno reply\b|\bnothing\b/i,
        reply: {
          answer:
            "Then try once more in a week, or reach them another way, like a colleague, an office number or in person. After that, look for another route to what you need.",
          nextMove: "Set a reminder to follow up once more next week.",
          followUps: ["Is it rude to follow up?", "Should I call instead?"],
        },
      },
      {
        match: /\brude\b|\bannoying\b|\bpushy\b|\bdesperate\b/i,
        reply: {
          answer: "No. A short, polite reminder after a week is a normal part of how work happens, and many people are glad of it.",
          nextMove: "Send it today, and keep it to two or three lines.",
          followUps: ["What if they still don't reply?", "Should I call instead?"],
        },
      },
      {
        match: /\bcall\b|\bphone\b|\bin person\b/i,
        reply: {
          answer: "If it's urgent or email clearly isn't working, a quick call is fine. Say you're following up on your email, and keep it brief.",
          scripts: ["Hi, I'm just following up on an email I sent last week about [topic]. Is now a good time?"],
          nextMove: "Try email once more first, unless there's a deadline.",
          followUps: ["What if they still don't reply?", "Is it rude to follow up?"],
        },
      },
    ],
  },
  {
    id: "overcommitted",
    example: "I said yes to too many things and now I can't keep up with all of them.",
    keywords: [
      /\btoo many (things|commitments|activities|clubs|projects|responsibilities)\b|\bsaid yes to (everything|too much|too many)\b|\bsigned up for too (many|much)\b/i,
      /\bovercommit/i,
      /\b(taken|taking|take) on too much\b|\bspread (myself )?(too )?thin\b/i,
      /\bdoing too (much|many things)\b/i,
    ],
    related: [
      /\bsaid yes\b|\bsigned up\b/i,
      /\bcan'?t keep up\b/i,
      /\b(clubs|activities|commitments|responsibilities)\b/i,
    ],
    initial: initial({
      answer:
        "You can't do everything well, so choose what to drop or scale back, and tell people early. A clear no now is kinder than a let-down later.",
      points: [
        "List every commitment and the time it takes each week.",
        "Mark each one: must keep, could shrink, could drop.",
        "Tell the people affected as soon as you decide.",
      ],
      nextMove: "Tonight, make the list and pick one commitment to drop or scale back this week.",
      scripts: ["I've taken on more than I can do well, so I need to step back from [commitment]. I'm sorry for the short notice, and I can help hand it over."],
      followUps: ["What if I let people down?", "Everything feels important.", "How do I stop saying yes?"],
      title: "Too many commitments",
    }),
    direct: {
      answer: "Drop or scale back one commitment this week, and tell the people involved now.",
      nextMove: "Pick which one tonight.",
      followUps: ["What if I let people down?", "Everything feels important."],
    },
    firstStep: {
      answer: "First, list everything you've said yes to, with how much time each takes.",
      nextMove: "Do it tonight; seeing it all at once makes the choice clearer.",
      followUps: ["Everything feels important.", "How do I stop saying yes?"],
    },
    words: {
      answer: "Early, honest and helpful with the handover.",
      scripts: [
        "I've taken on too much and need to step back from [commitment]. I'm sorry, and I can help hand it over.",
        "Could I do a smaller part of this instead of the whole thing?",
        "I can't commit to this right now, but I'd love to help another time.",
      ],
      nextMove: "Pick the one that fits, and send it this week.",
      followUps: ["What if I let people down?", "How do I stop saying yes?"],
    },
    extras: [
      {
        match: /\blet (people|them|anyone) down\b|\bdisappoint|\bguilt/i,
        reply: {
          answer:
            "You might, a little, but less than if you stay and do it badly or drop out at the last minute. Early and honest is the respectful option.",
          nextMove: "Tell the first person this week, and offer to help with the handover.",
          followUps: ["Everything feels important.", "How do I stop saying yes?"],
        },
      },
      {
        match: /\beverything (feels |is )?important\b|\ball important\b|\bcan'?t drop\b|\bcan'?t choose\b/i,
        reply: {
          answer:
            "Then ask which ones only you can do, and which have deadlines. Anything someone else could do, or that could pause for a few weeks, is a candidate to scale back.",
          nextMove: "For each commitment, ask: would it fall apart without me this month?",
          followUps: ["What if I let people down?", "How do I stop saying yes?"],
        },
      },
      {
        match: /\bstop saying yes\b|\bsay no\b|\bnext time\b|\bin future\b/i,
        reply: {
          answer: "Build in a pause, and don't answer on the spot. \"Let me check and get back to you\" gives you time to see if it really fits.",
          scripts: ["That sounds great. Let me check my week and get back to you tomorrow."],
          nextMove: "Use that line for the next request you get, whatever it is.",
          followUps: ["What if I let people down?", "Everything feels important."],
        },
      },
    ],
  },
];
