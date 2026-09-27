// Demo mode: school and study.

import { initial, type DemoReply, type DemoScenario } from "../scenario.ts";

const presentationOpening: DemoReply = {
  answer: "Keep your opening simple: greet them, say what you'll cover, and go straight into your first point.",
  scripts: [
    "Hi everyone. Today I'm talking about [topic], and I'll cover three things: [one], [two] and [three].",
    "Good morning. I want to start with a quick question: [question]?",
  ],
  nextMove: "Say your opening out loud a few times tonight, until it comes without thinking.",
  followUps: ["What if my mind goes blank?", "How many times should I practise?"],
};

const extensionEmail: DemoReply = {
  answer: "Keep it short and specific: the reason, what's done, and a date you can meet.",
  scripts: [
    "Hi [teacher], I'm behind on the assignment and won't finish it well by the deadline. I've done [part]. Could I hand it in on [date]?",
    "Hi [teacher], I'm struggling to finish on time because [reason]. Could I have a short extension, until [date]?",
  ],
  nextMove: "Fill in the brackets and send it today, then keep working while you wait.",
  followUps: ["What if they say no?", "My reason isn't very good."],
};

export const SCHOOL_SCENARIOS: DemoScenario[] = [
  {
    id: "presentation-nerves",
    example:
      "I have an important presentation tomorrow and I'm nervous that I'll forget what I want to say. How should I prepare tonight without staying up too late?",
    keywords: [
      /\bpresentation/i,
      /\bpresent(ing)?\b[^.?!]*\b(tomorrow|class|in front of)\b/i,
      /\b(speech|public speaking|slides)\b/i,
    ],
    related: [/\b(forget|blank)\b[^.?!]*\b(say|lines|words|talk)\b/i, /\bprepar(e|ing)\b|\bnervous\b|\bscared\b/i],
    initial: initial({
      answer:
        "Don't memorise it word for word tonight. Know your three to five main points and their order, so if a sentence slips you can jump to the next point and keep going.",
      points: [
        "Put a few keywords for each point on a card or in your slide notes.",
        "Run through it out loud two or three times, then stop.",
        "Know your opening lines well; a smooth start makes the rest easier.",
        "If you lose your place tomorrow, a short pause to check your notes is normal.",
      ],
      nextMove:
        "Tonight, do one timed run-through out loud using only your keyword notes, then pack everything and stop at a set time.",
      scripts: ["Let me just check my notes for a second."],
      followUps: ["What if my mind goes blank?", "How many times should I practise?", "Help me with my opening line."],
      title: "Preparing for a presentation",
    }),
    direct: {
      answer: "Prepare the structure, not a script: know your points in order, practise out loud a couple of times, and go to bed.",
      nextMove: "Write your main points on one card now, and do one run-through before bed.",
      followUps: ["What if my mind goes blank?", "How many times should I practise?"],
    },
    firstStep: {
      answer: "Start by writing your main points in order, as short keywords. Everything else hangs on that.",
      nextMove: "Take five minutes now to list your main points on one card or in your slide notes.",
      followUps: ["Help me with my opening line.", "How many times should I practise?"],
    },
    words: presentationOpening,
    extras: [
      {
        match: /\bblank\b|\bforget\b|\blose my place\b|\bfreez/i,
        reply: {
          answer:
            "Pause, look at your notes, and pick up at the next point. A short pause is normal in a presentation, and you don't need to explain it.",
          scripts: ["Let me just check my notes for a second."],
          nextMove: "Mark each main point clearly in your notes tonight, so one glance tells you where you are.",
          followUps: ["How many times should I practise?", "Help me with my opening line."],
        },
      },
      {
        match: /\bhow (many|much|long)\b|\bpractis|\bpractic|\brehears/i,
        reply: {
          answer:
            "Two or three full run-throughs out loud is usually enough the night before. After that, more practice mostly costs you sleep.",
          nextMove: "Do one run-through with a timer, fix the part that felt clumsy, do one more, then stop for the night.",
          followUps: ["What if my mind goes blank?", "Help me with my opening line."],
        },
      },
      { match: /\bopening\b|\bfirst (line|sentence|words)\b|\bintro(duction)?\b|\bhow (do|should) i (start|begin)\b/i, reply: presentationOpening },
    ],
  },
  {
    id: "exam-cram",
    example: "My exam is in two days and I've barely started revising. Where do I even begin?",
    keywords: [
      /\b(exams?|tests?|finals|quiz)\b/i,
      /\b(barely|haven'?t|not|never|didn'?t) (even )?(started|begun|revised|studied|opened|prepared|revising|studying)\b/i,
      /\b(exams?|tests?|finals|quiz)\b[^.?!]*\b(tomorrow|tonight|in (one|two|three|four|a few|a couple of|\d+) days?|on (monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/i,
      /\bcram(ming)?\b|\brevis(e|ing|ion)\b/i,
    ],
    related: [/\bstud(y|ying|ied)\b/i],
    initial: initial({
      answer:
        "Don't try to cover everything evenly. Put your time into the topics you're shakiest on, and practise with questions rather than rereading notes.",
      points: [
        "List the topics and mark each one: know it, shaky, or lost.",
        "Start with the shaky ones; they improve fastest with practice.",
        "Use past papers or practice questions, and check your answers.",
        "Stop at a sensible time both nights, so you're awake for the exam.",
      ],
      nextMove: "Right now, list every topic and mark it know, shaky or lost. Then start on the first shaky one.",
      followUps: ["How do I split the two days?", "What if I don't understand a topic?", "I can't focus when I revise."],
      title: "Revising with little time left",
    }),
    direct: {
      answer: "Stop rereading and start testing yourself on your weakest topics, today. That's the best use of the time you have.",
      nextMove: "Pick your shakiest topic and do practice questions on it for the next hour.",
      followUps: ["How do I split the two days?", "I can't focus when I revise."],
    },
    firstStep: {
      answer: "Start by finding out exactly what's on the exam, so you're not revising blind.",
      nextMove: "Get the topic list from your syllabus, teacher or class notes, and mark the ones you're least sure about.",
      followUps: ["How do I split the two days?", "What if I don't understand a topic?"],
    },
    words: {
      answer: "If you need help, ask for something small and specific. It's much easier for people to say yes to.",
      scripts: [
        "Hi, I'm stuck on [topic] before the exam. Could you explain one example to me?",
        "Do you have any past questions we could practise with together?",
      ],
      nextMove: "Send one message to a classmate or teacher today.",
      followUps: ["What if I don't understand a topic?", "How do I split the two days?"],
    },
    extras: [
      {
        match: /\bsplit\b|\bschedule\b|\btimetable\b|\bplan (the|my) (days|time)\b|\bhow (should|do) i (divide|organi[sz]e)\b/i,
        reply: {
          answer:
            "Give most of day one to your shaky topics. Use day two for practice questions and a light review of what you already know.",
          points: [
            "Work in focused blocks with short breaks between them.",
            "End each block by testing yourself, not rereading.",
            "Keep the evening before the exam lighter.",
          ],
          nextMove: "Write tomorrow's plan now: which topics, in what order, and when you'll stop.",
          followUps: ["What if I don't understand a topic?", "I can't focus when I revise."],
        },
      },
      {
        match: /\b(don'?t|do not|can'?t) (understand|get)\b|\bconfus/i,
        reply: {
          answer:
            "Don't sink hours into a topic you're lost on. Get a quick explanation, learn the basics of it, and move on.",
          points: [
            "Ask a classmate or teacher for a five-minute explanation.",
            "Watch one short video on just that topic.",
            "Learn one worked example, then try a similar question.",
          ],
          nextMove: "Message someone today who understands it, and ask them to walk you through one example.",
          followUps: ["How do I split the two days?", "I can't focus when I revise."],
        },
      },
      {
        match: /\bfocus\b|\bconcentrat|\bdistract|\bphone\b/i,
        reply: {
          answer:
            "Make focusing easier instead of relying on willpower: phone in another room, one topic at a time, and short timed blocks.",
          nextMove: "Set a timer for about half an hour, put your phone out of reach, and do one set of practice questions.",
          followUps: ["How do I split the two days?", "What if I don't understand a topic?"],
        },
      },
    ],
  },
  {
    id: "exam-week",
    example: "I have four exams in the same week and I don't know how to split my revision.",
    keywords: [
      /\b(two|three|four|five|six|seven|eight|several|multiple|many|lots of|\d+) (exams|tests|finals)\b/i,
      /\bexams?\b[^.?!]*\b(same|next|this) week\b|\bexam (week|season|period)\b/i,
      /\b(revision|exam) (plan|timetable|schedule)\b|\bplan (my |out my |the )?(revision|exams?)\b/i,
      /\bsplit\b[^.?!]*\b(revision|revising|studying|study time|time|subjects)\b/i,
      /\ball (of )?my (subjects|exams)\b/i,
    ],
    related: [/\bexams\b|\btests\b/i, /\brevis(e|ing|ion)\b/i],
    initial: initial({
      answer:
        "Plan backwards from the exam dates. Give more time to the subjects that come first, feel weakest or count for more, and keep a little time for every subject each week.",
      points: [
        "Write every exam date on one page, in order.",
        "Rate each subject: confident, okay, or weak.",
        "Rotate subjects day by day rather than finishing one before starting another.",
        "Where you can, keep the evening before each exam for that subject.",
      ],
      nextMove:
        "Tonight, draw a simple table of the days until your exams and fill in which subject goes where, weakest and earliest first.",
      followUps: ["Two exams are on the same day.", "Which subject should I start with?", "How do I stick to the plan?"],
      title: "Planning revision for exam week",
    }),
    direct: {
      answer: "Start with your earliest and weakest subjects, and stop trying to give every subject equal time.",
      nextMove: "Put your first two exams at the top of tomorrow's plan.",
      followUps: ["Which subject should I start with?", "How do I stick to the plan?"],
    },
    firstStep: {
      answer: "First, get all the dates and topics in one place, so you can see the whole stretch at once.",
      nextMove: "Write every exam date and its main topics on one page tonight.",
      followUps: ["Which subject should I start with?", "Two exams are on the same day."],
    },
    words: {
      answer: "If you're unsure what to focus on, it's worth asking your teachers directly.",
      scripts: ["If you only had a few days to revise for this exam, which topics would you focus on?"],
      nextMove: "Ask in your next lesson or by email, one subject at a time.",
      followUps: ["Which subject should I start with?", "How do I stick to the plan?"],
    },
    extras: [
      {
        match: /\bsame day\b|\bback[- ]to[- ]back\b|\bone after (another|the other)\b/i,
        reply: {
          answer:
            "Then treat those two as one block: revise both in the days before, and on the day itself only skim key notes for the second one.",
          nextMove: "Move both of those subjects earlier in your plan, so neither gets squeezed at the end.",
          followUps: ["Which subject should I start with?", "How do I stick to the plan?"],
        },
      },
      {
        match: /\bstart with\b|\bwhich (subject|one) (first|should i start)\b/i,
        reply: {
          answer: "Start with the exam that comes first, unless another subject is much weaker. In that case, split today between the two.",
          nextMove: "Do one focused block on your earliest exam today, and one on your weakest subject.",
          followUps: ["Two exams are on the same day.", "How do I stick to the plan?"],
        },
      },
      {
        match: /\bstick\b|\bfollow (it|the plan|through)\b|\bkeep (to|up)\b/i,
        reply: {
          answer: "Make the plan smaller than feels impressive. A plan with breaks and a finish time is one you'll actually follow.",
          points: [
            "Plan tasks, like \"ten algebra questions\", not just \"maths\".",
            "Keep one free slot a day to catch up.",
            "Tick things off as you go.",
          ],
          nextMove: "Cut tomorrow's plan down to what you could finish even on an average day.",
          followUps: ["Which subject should I start with?", "Two exams are on the same day."],
        },
      },
    ],
  },
  {
    id: "mind-blank",
    example: "I study a lot, but in the actual exam my mind just goes blank.",
    keywords: [
      /\b(mind|head|brain)\b[^.?!]*\bblank\b|\bgo(es)? blank\b|\bblank(ed)? (out|on)\b/i,
      /\b(freeze|froze|frozen|panic|panicked|panicking)\b[^.?!]*\b(exams?|tests?)\b|\b(exams?|tests?)\b[^.?!]*\b(freeze|froze|panic)/i,
      /\bforg(et|ot) everything\b/i,
      /\b(in|during) (the |an |my )?(actual |real )?(exams?|tests?)\b/i,
    ],
    related: [/\b(exams?|tests?)\b/i, /\bstud(y|ied|ying)\b|\brevis/i],
    initial: initial({
      answer:
        "If you know it at home but lose it in the exam, change how you practise: rehearse remembering under exam-like conditions, and have a plan for the moment it happens.",
      points: [
        "Test yourself from memory: blank page first, then check your notes.",
        "Do timed practice questions, so the real thing feels familiar.",
        "In the exam, skip what's blank and come back to it later.",
        "Start with a question you're sure of, to get going.",
      ],
      nextMove:
        "Next time you revise, close your notes and write down everything you remember about one topic, then check what you missed.",
      alternative: "If it keeps happening even when you know the material well, tell a teacher; they may have ideas that suit you.",
      followUps: ["What do I do when it happens?", "How do I practise remembering?", "It happens even when I'm prepared."],
      title: "Going blank in exams",
    }),
    direct: {
      answer: "Stop rereading your notes. Test yourself from memory, under time pressure, until recalling things feels normal.",
      nextMove: "Do one timed set of practice questions this week without your notes.",
      followUps: ["What do I do when it happens?", "How do I practise remembering?"],
    },
    firstStep: {
      answer: "Start by practising the exam situation itself: timed, no notes, then mark it.",
      nextMove: "Find one past paper or question set, and do part of it under a timer.",
      followUps: ["How do I practise remembering?", "What do I do when it happens?"],
    },
    words: {
      answer: "If you talk to a teacher, describe exactly what happens; that helps them give useful advice.",
      scripts: [
        "I know the material when I revise, but in exams my mind goes blank. Do you have any advice?",
        "Could I try some practice questions under timed conditions before the exam?",
      ],
      nextMove: "Ask after class or send it as an email this week.",
      followUps: ["What do I do when it happens?", "How do I practise remembering?"],
    },
    extras: [
      {
        match: /\bwhen it happens\b|\bin the moment\b|\bduring the exam\b|\bwhat do i do\b/i,
        reply: {
          answer:
            "Put your pen down, take a couple of slow breaths, and move to a question you can do. Jot anything related on scrap paper; one detail can bring back the rest.",
          nextMove: "Before your next exam, decide your plan in advance: pause, breathe, move on, come back.",
          followUps: ["How do I practise remembering?", "It happens even when I'm prepared."],
        },
      },
      {
        match: /\bpractis|\bpractic|\brecall|\bremember/i,
        reply: {
          answer:
            "Practise getting things out of your head, not putting them in. It feels harder than rereading, and that's what makes it good exam practice.",
          points: [
            "Cover your notes and explain a topic out loud.",
            "Do questions without looking, then mark them.",
            "Make flashcards with questions on them, not just facts.",
          ],
          nextMove: "Pick one topic tonight and write everything you remember before opening your notes.",
          followUps: ["What do I do when it happens?", "It happens even when I'm prepared."],
        },
      },
      {
        match: /\beven when\b|\bevery (time|exam)\b|\bprepared\b/i,
        reply: {
          answer:
            "Then it's worth getting help with the exam itself, not just the content. Tell a teacher what happens; they may suggest strategies or arrangements that suit you.",
          scripts: ["I know the material when I revise, but in exams my mind goes blank. Do you have any advice?"],
          nextMove: "Talk to a teacher this week, with an example of when it happened.",
          followUps: ["What do I do when it happens?", "How do I practise remembering?"],
        },
      },
    ],
  },
  {
    id: "bad-grade",
    example: "I got a much worse grade than I expected on a test I actually studied for.",
    keywords: [
      /\b(bad|worse|low|lower|poor|terrible|awful|disappointing|horrible|rubbish) (grade|mark|score|result)s?\b/i,
      /\bfailed (my|the|a|an|this) (\w+ )?(test|exam|quiz|essay|assignment|paper|module)\b/i,
      /\bbetter (grades|marks|results)\b/i,
    ],
    related: [
      /\b(grade|mark|score|result)s?\b/i,
      /\b(tests?|exams?|quiz|essay|assignment)\b/i,
      /\bstudied\b|\brevised\b|\bexpect|\bwhat went wrong\b/i,
    ],
    initial: initial({
      answer:
        "Find out where the marks were lost before deciding what it means. The fix is different depending on whether it was the content, the questions, or the timing.",
      points: [
        "Content: you didn't know or remember it.",
        "Questions: you knew it, but answered something slightly different.",
        "Timing: you ran out of time or rushed.",
      ],
      nextMove: "Go through the marked test this week and sort each lost mark into one of those three.",
      scripts: ["Could you go through my test with me? I want to understand where I lost marks."],
      followUps: ["I don't have the marked test.", "How should I study differently?", "Should I tell my parents?"],
      title: "Handling a disappointing grade",
    }),
    direct: {
      answer: "Treat it as information: find out where the marks went, and change one specific thing before the next test.",
      nextMove: "Ask to see the marked test this week.",
      followUps: ["How should I study differently?", "Should I tell my parents?"],
    },
    firstStep: {
      answer: "First, look closely at the marked test before deciding anything about yourself or your studying.",
      nextMove: "Go through it question by question and note why each mark was lost.",
      followUps: ["I don't have the marked test.", "How should I study differently?"],
    },
    words: {
      answer: "Asking your teacher to go through it is a normal request, and it shows you want to improve.",
      scripts: [
        "Could you go through my test with me? I want to understand where I lost marks.",
        "If you had to pick one thing for me to work on before the next test, what would it be?",
      ],
      nextMove: "Ask after class or by email this week.",
      followUps: ["How should I study differently?", "Should I tell my parents?"],
    },
    extras: [
      {
        match: /\b(don'?t|do not|didn'?t|never) (have|get|got|see)\b[^.?!]*\b(test|paper|marks?|feedback)\b|\bno feedback\b/i,
        reply: {
          answer: "Then ask to see it. Saying you want to improve makes it an easy request to agree to.",
          scripts: ["Could I look at my marked test? I'd like to see where I went wrong so I can improve."],
          nextMove: "Ask your teacher after the next lesson or by email.",
          followUps: ["How should I study differently?", "Should I tell my parents?"],
        },
      },
      {
        match: /\bdifferently\b|\bstudy (better|smarter)\b|\b(change|improve) (how|the way) i (study|revise)\b/i,
        reply: {
          answer:
            "Match the change to the problem. If it was content, test yourself more. If it was the questions, practise past papers. If it was timing, practise under a timer.",
          nextMove: "Pick the change that fits, and use it on the next topic you study.",
          followUps: ["I don't have the marked test.", "Should I tell my parents?"],
        },
      },
      {
        match: /\bparents?\b|\bmum\b|\bmom\b|\bdad\b|\bfamily\b/i,
        reply: {
          answer:
            "If they'll find out anyway, it's easier coming from you, with a plan. Lead with what happened and what you're going to change.",
          scripts: ["I got my test back and it went worse than I hoped. I've looked at why, and here's what I'm going to do differently."],
          nextMove: "Tell them soon, at a calm moment, once you know where the marks went.",
          followUps: ["How should I study differently?", "I don't have the marked test."],
        },
      },
    ],
  },
  {
    id: "tell-parents-grade",
    example: "I failed a test and I don't know how to tell my parents.",
    keywords: [
      /\btell (my )?(parents?|mum|mom|dad|family)\b/i,
      /\b(parents?|mum|mom|dad)\b[^.?!]*\b(find out|react|angry|disappointed|kill me|be mad|freak out|shout)\b/i,
      /\b(failed|flunked|bad (grade|mark|result|report))\b[^.?!]*\b(parents?|mum|mom|dad)\b|\b(parents?|mum|mom|dad)\b[^.?!]*\b(failed|flunked|bad (grade|mark|result|report))/i,
      /\breport card\b|\bschool report\b/i,
    ],
    related: [/\bfail(ed|ing)?\b|\bflunk/i, /\b(tests?|exams?|grades?|marks?|results?|class)\b/i],
    initial: initial({
      answer:
        "Tell them yourself, soon, before they hear it another way. Keep it short: what happened, what you think went wrong, and what you'll do next.",
      points: [
        "Pick a calm moment, not when everyone's rushing.",
        "Say the result plainly, without piling on excuses.",
        "Bring a plan, even a small one.",
      ],
      nextMove: "Decide when you'll tell them, today or tomorrow, and write your first sentence down.",
      scripts: ["I need to tell you something. I failed my [subject] test. I've looked at what went wrong, and here's my plan."],
      followUps: ["What if they get really angry?", "What should my plan be?", "Should I tell just one parent first?"],
      title: "Telling parents about a bad result",
    }),
    direct: {
      answer: "Tell them today or tomorrow, yourself. It's better coming from you than from a report or a teacher.",
      nextMove: "Choose the moment now, and say the first sentence without building up to it.",
      followUps: ["What if they get really angry?", "What should my plan be?"],
    },
    firstStep: {
      answer: "Start by getting your facts straight: the result, what went wrong, and one thing you'll change.",
      nextMove: "Write those three things down before you talk to them.",
      followUps: ["What should my plan be?", "Should I tell just one parent first?"],
    },
    words: {
      answer: "Say it near the start, then explain; building up to it makes it harder.",
      scripts: [
        "I need to tell you something: I failed my test, and I want to explain what happened.",
        "I didn't do well on my test. I'm not happy about it, and I have a plan.",
        "Can we talk? I got a result I'm not proud of, and I wanted you to hear it from me.",
      ],
      nextMove: "Pick the one that sounds like you and open with it.",
      followUps: ["What if they get really angry?", "Should I tell just one parent first?"],
    },
    extras: [
      {
        match: /\bangry\b|\bmad\b|\bupset\b|\bshout|\byell|\bpunish|\bgrounded\b/i,
        reply: {
          answer:
            "That's hard, and you can't control how they react. Stay calm, listen, and don't argue in the moment. You can come back to it once things settle.",
          scripts: ["I'm not happy about it either, and I want to fix it."],
          nextMove: "If it gets heated, ask to talk again later that day, and follow through.",
          followUps: ["What should my plan be?", "Should I tell just one parent first?"],
        },
      },
      {
        match: /\bplan\b|\bwhat (should|can) i do (next|now)\b|\bfix (it|this)\b/i,
        reply: {
          answer: "Keep it concrete and small: something they can see you actually doing.",
          points: [
            "Ask the teacher what to focus on.",
            "Set a regular weekly time for that subject.",
            "Ask about a retake or extra work, if that's possible.",
          ],
          nextMove: "Start one of these before you talk to them, so you can say you already have.",
          followUps: ["What if they get really angry?", "Should I tell just one parent first?"],
        },
      },
      {
        match: /\bone (parent|of them)\b|\b(just|only) (my )?(mum|mom|dad)\b|\b(mum|mom|dad) first\b/i,
        reply: {
          answer:
            "That can help if one of them is easier to talk to. Just don't ask them to keep it a secret from the other.",
          nextMove: "Tell the one you find easier today, and agree together how and when to tell the other.",
          followUps: ["What if they get really angry?", "What should my plan be?"],
        },
      },
    ],
  },
  {
    id: "essay-avoidance",
    example: "I have an essay due on Friday and I can't make myself start it.",
    keywords: [
      /\bcan'?t (make myself |get myself to |bring myself to |seem to |motivate myself to )?(start|begin|get started on|write)\b/i,
      /\b(putting|put) (this |my \w+ )?off\b|\bavoid(ing)? (my |the |writing |doing )?(essay|assignment|coursework|project|report|homework|revision)\b/i,
      /\bstart(ing)? (it|writing|my (essay|assignment|coursework|project|report))\b/i,
      /\bblank page\b/i,
    ],
    related: [/\b(essay|assignment|report|coursework|project|homework|paper)\b/i, /\bdue\b/i],
    initial: initial({
      answer:
        "Don't wait until you feel ready to write. Make the first step so small it's hard to avoid, like a rough outline or one messy paragraph you'll fix later.",
      points: [
        "Write the question at the top of a blank page.",
        "List three points you could make, in any order.",
        "Write badly on purpose; editing is a separate job.",
      ],
      nextMove: "Set a timer for 10 to 15 minutes now and write a rough outline. If you want to stop after that, you can.",
      alternative:
        "If you're stuck because the question doesn't make sense to you, ask your teacher or a classmate what it's really asking before you start.",
      followUps: ["I don't understand the question.", "I start but then get distracted.", "How do I plan the week?"],
      title: "Starting an essay you're avoiding",
    }),
    direct: {
      answer: "Start today with a rough outline, even a bad one. Fixing a draft is much easier than starting from nothing.",
      nextMove: "Open the document now and write the question plus three bullet points.",
      followUps: ["I start but then get distracted.", "How do I plan the week?"],
    },
    firstStep: {
      answer: "The first step is just opening the document and writing the question at the top.",
      nextMove: "Do that now, then add any three ideas that come to mind.",
      followUps: ["I don't understand the question.", "How do I plan the week?"],
    },
    words: {
      answer: "If you're stuck, a short question to your teacher or a classmate can save hours.",
      scripts: [
        "Could you tell me what you're looking for in this essay? I want to make sure I'm answering the right question.",
        "Are you free to talk through our essay ideas for ten minutes?",
      ],
      nextMove: "Send one of those today.",
      followUps: ["I don't understand the question.", "I start but then get distracted."],
    },
    extras: [
      {
        match: /\b(don'?t|do not) (understand|get)\b|\bconfus|\bwhat (it'?s|the question is) asking\b/i,
        reply: {
          answer: "Then that's the real first step: work out what it's asking before you write anything.",
          points: [
            "Underline the command words, like \"compare\" or \"explain\".",
            "Rewrite the question in your own words.",
            "Check the marking criteria, if you have them.",
          ],
          scripts: ["I'm not sure what the essay question is asking. Could you explain what you're looking for?"],
          nextMove: "Rewrite the question as one sentence of your own, and ask your teacher if you're still unsure.",
          followUps: ["I start but then get distracted.", "How do I plan the week?"],
        },
      },
      {
        match: /\bdistract|\bphone\b|\bfocus\b|\bconcentrat/i,
        reply: {
          answer:
            "Then make your surroundings do the work: phone in another room, one tab open, and short timed blocks with a real break after each.",
          nextMove: "Try one 20 to 30 minute block tonight with your phone out of the room, then take a proper break.",
          followUps: ["How do I plan the week?", "I don't understand the question."],
        },
      },
      {
        match: /\bplan\b|\bweek\b|\bschedule\b|\bbreak it (up|down)\b|\bsplit\b/i,
        reply: {
          answer: "Split it into small jobs with their own days, so the deadline isn't one big push.",
          points: [
            "First: outline and notes.",
            "Then: a rough draft, start to finish.",
            "Then: edit for sense and flow.",
            "Last: check references and formatting.",
          ],
          nextMove: "Put each job on a specific day before the deadline, with the outline first.",
          followUps: ["I start but then get distracted.", "I don't understand the question."],
        },
      },
    ],
  },
  {
    id: "extension",
    example: "I'm not going to finish my assignment on time. Should I ask my teacher for an extension?",
    keywords: [
      /\bextension\b/i,
      /\b(not|won'?t) (going to |gonna )?(finish|be done|make it|get it done)\b[^.?!]*\b(on time|in time|by)\b/i,
      /\b(miss|missing|going to miss) (the |my |a )?deadline\b/i,
      /\b(more|extra) time (for|on|to finish) (my|the|this|an?)\b/i,
    ],
    related: [
      /\b(assignment|essay|project|coursework|homework)\b/i,
      /\b(teacher|lecturer|professor|tutor)\b/i,
      /\bdeadline\b/i,
    ],
    initial: initial({
      answer:
        "Ask now, before the deadline rather than after it. Be honest about why, say how much you've done, and suggest a realistic new date.",
      points: [
        "Ask as early as you can, not on the day it's due.",
        "Show what's done and what's left.",
        "Suggest a specific date you can actually meet.",
      ],
      nextMove: "Send the request today, and keep working on it while you wait for an answer.",
      scripts: ["Hi [teacher], I'm behind on the assignment because [reason]. I've done [part] so far. Could I hand it in on [date]?"],
      followUps: ["What if they say no?", "My reason isn't very good.", "Help me write the email."],
      title: "Asking for an extension",
    }),
    asked: {
      match: /\bshould i (ask|email|tell|message)\b|\bcan i ask\b/i,
      answer:
        "Yes, ask, and do it before the deadline rather than after. Be honest about why, say how much you've done, and suggest a realistic new date.",
    },
    direct: {
      answer: "Yes: ask today, before the deadline. Asking late leaves fewer options.",
      nextMove: "Send the request today, then keep working as if the answer might be no.",
      followUps: ["What if they say no?", "Help me write the email."],
    },
    firstStep: {
      answer: "First, work out how much is left and how long it will really take, so you ask for a date you'll actually meet.",
      nextMove: "List the remaining parts, estimate each one, and add a little margin.",
      followUps: ["Help me write the email.", "What if they say no?"],
    },
    words: extensionEmail,
    extras: [
      {
        match: /\bsay(s)? no\b|\brefuse|\bnot allowed\b|\bwon'?t (give|let|allow)\b/i,
        reply: {
          answer:
            "Then ask whether you can hand in what you have on time and add to it later, and put your effort into finishing the most important parts.",
          nextMove: "List what's left, and do the parts that carry the most marks first.",
          followUps: ["My reason isn't very good.", "Help me write the email."],
        },
      },
      {
        match: /\breason\b|\bexcuse\b|\bmy (own )?fault\b|\bprocrastinat|\bleft it (too )?late\b/i,
        reply: {
          answer:
            "Then be honest rather than inventing one. \"I managed my time badly\" is fine, as long as you show what you're doing about it.",
          scripts: ["I managed my time badly on this one, and I'm behind. I've done [part]. Could I have until [date] to finish it properly?"],
          nextMove: "Send the honest version today, with a date you can actually meet.",
          followUps: ["What if they say no?", "Help me write the email."],
        },
      },
      { match: /\bemail\b|\bwrite\b/i, reply: extensionEmail },
    ],
  },
  {
    id: "deadline-tonight",
    example: "My assignment is due at midnight and I'm only halfway done.",
    keywords: [
      /\bdue (at |by |in )?(midnight|tonight|(a few|two|three|four|five|\d+|an|one) hours?)\b/i,
      /\b(a few|two|three|four|five|\d+|only|couple of|an) hours? (left|to go)\b/i,
      /\b(halfway|half) (done|through|finished)\b|\bonly (half|halfway)\b/i,
      /\brunning out of time\b/i,
    ],
    related: [
      /\b(assignment|essay|project|report|homework|coursework)\b/i,
      /\btonight\b/i,
      /\b(isn'?t|not|haven'?t) (finished|done)\b/i,
    ],
    initial: initial({
      answer:
        "Aim for complete, not perfect. Get every required part down in rough form first, then use whatever time is left to improve the parts worth the most.",
      points: [
        "Check the requirements and list what's still missing.",
        "Write short versions of each missing part.",
        "Leave the polishing for the end.",
        "Submit a little before the deadline, in case something goes wrong.",
      ],
      nextMove: "Spend five minutes listing every missing part, then start with the one worth the most marks.",
      alternative: "If there's truly no way to finish, email your teacher before midnight and submit what you have.",
      followUps: ["I won't finish even a rough version.", "How do I stay focused tonight?", "Should I stay up late to finish?"],
      title: "Finishing an assignment tonight",
    }),
    direct: {
      answer: "Stop editing what's done and fill in what's missing. A complete rough version usually earns more than a polished half.",
      nextMove: "Write the next missing section now, roughly.",
      followUps: ["How do I stay focused tonight?", "I won't finish even a rough version."],
    },
    firstStep: {
      answer: "First, reread the task and list exactly what's still missing.",
      nextMove: "Make that list now; it's your plan for tonight.",
      followUps: ["How do I stay focused tonight?", "Should I stay up late to finish?"],
    },
    words: {
      answer: "If you need to tell your teacher, keep it brief and honest, and send it before the deadline.",
      scripts: ["Hi [teacher], I've run out of time and haven't finished [part]. I'm submitting what I have now. Could I send the rest by [date]?"],
      nextMove: "Send it before midnight, together with your partial work.",
      followUps: ["I won't finish even a rough version.", "How do I stay focused tonight?"],
    },
    extras: [
      {
        match: /\b(won'?t|can'?t|not going to) finish\b|\bno way\b|\bnot enough time\b|\bimpossible\b/i,
        reply: {
          answer:
            "Then submit the best partial version you can on time, and email your teacher before the deadline saying what's missing.",
          scripts: ["Hi [teacher], I've run out of time and haven't finished [part]. I'm submitting what I have now. Could I send the rest by [date]?"],
          nextMove: "Finish whatever is closest to done, then send the email before midnight.",
          followUps: ["How do I stay focused tonight?", "Should I stay up late to finish?"],
        },
      },
      {
        match: /\bfocus|\bdistract|\bconcentrat|\bphone\b/i,
        reply: {
          answer: "Work in short sprints, each with a clear target: this paragraph, this section. Phone away, notifications off, one tab open.",
          nextMove: "Pick the next section, set a timer for about half an hour, and keep going until it rings.",
          followUps: ["I won't finish even a rough version.", "Should I stay up late to finish?"],
        },
      },
      {
        match: /\bstay up\b|\blate\b|\ball[- ]?nighter\b|\bsleep\b/i,
        reply: {
          answer:
            "With a midnight deadline, the deadline decides for you. Work until it's submitted, then stop, rather than polishing into the early hours.",
          nextMove: "Set yourself a submission time a little before the deadline, and stick to it.",
          followUps: ["How do I stay focused tonight?", "I won't finish even a rough version."],
        },
      },
    ],
  },
  {
    id: "forgot-homework",
    example: "I forgot to do my homework and my class starts in an hour.",
    keywords: [
      /\bforgot (to do )?(my |the |our )?homework\b/i,
      /\b(didn'?t|haven'?t|did not|have not|never) (do|done|did|finish(ed)?) (my |the |our )?homework\b/i,
      /\bclass (starts|is) in\b|\bbefore (class|school|the lesson|first period)\b|\b(have|got) class (soon|in)\b/i,
    ],
    related: [/\bhomework\b/i, /\bforgot\b/i, /\bteacher\b/i],
    initial: initial({
      answer:
        "Do what you can in the time you have, then tell your teacher before the lesson starts, rather than hoping nobody notices.",
      nextMove: "Spend most of the time on the parts you can finish, and save a minute to tell your teacher before class.",
      scripts: ["I forgot to do the homework. I've done what I could this morning, and I can finish the rest tonight if that's okay."],
      followUps: ["What if I can't do any of it?", "Will I get in trouble?", "How do I stop forgetting?"],
      title: "Forgetting your homework",
    }),
    direct: {
      answer: "Tell your teacher before class, and do as much as you can until then.",
      nextMove: "Start with the quickest part now, and speak to them before the lesson.",
      followUps: ["Will I get in trouble?", "What if I can't do any of it?"],
    },
    firstStep: {
      answer: "First, check what the homework actually was and how long it would take.",
      nextMove: "Find the task now, and do the quickest part first.",
      followUps: ["What if I can't do any of it?", "Will I get in trouble?"],
    },
    words: {
      answer: "Keep it short and honest, and say when you'll hand it in.",
      scripts: [
        "I forgot to do the homework. I've done what I could; can I hand in the rest tomorrow?",
        "I'm sorry, I didn't do the homework. Can I bring it in tomorrow?",
      ],
      nextMove: "Say it before class starts, not at the end.",
      followUps: ["Will I get in trouble?", "How do I stop forgetting?"],
    },
    extras: [
      {
        match: /\bcan'?t do (any|it)\b|\bnone of it\b|\bno time\b|\b(don'?t|do not) understand\b/i,
        reply: {
          answer: "Then just be honest and offer a time you'll hand it in. Telling them first is better than waiting to be asked.",
          scripts: ["I forgot to do the homework, and I'm sorry. Can I hand it in tomorrow?"],
          nextMove: "Tell them before the lesson starts, then do it tonight.",
          followUps: ["Will I get in trouble?", "How do I stop forgetting?"],
        },
      },
      {
        match: /\btrouble\b|\bdetention\b|\bpunish|\bconsequence/i,
        reply: {
          answer:
            "That depends on your school and your teacher, so I can't say. Telling them yourself and offering a time to hand it in is the best way to keep it small.",
          nextMove: "Speak to your teacher before class, and hand it in when you said you would.",
          followUps: ["What if I can't do any of it?", "How do I stop forgetting?"],
        },
      },
      {
        match: /\bstop forgetting\b|\bkeep forgetting\b|\bremember\b|\bnext time\b/i,
        reply: {
          answer: "Write homework down the moment it's set, in one place you check every day, and give it a regular time.",
          points: [
            "Use one list or planner, not scraps of paper.",
            "Set a reminder for the same time each day.",
            "Check the list before bed.",
          ],
          nextMove: "Choose your one place for homework today, and add everything that's currently due.",
          followUps: ["What if I can't do any of it?", "Will I get in trouble?"],
        },
      },
    ],
  },
  {
    id: "lost-in-class",
    example: "I don't understand what we're doing in maths anymore, and I'm too embarrassed to ask for help.",
    keywords: [
      /\b(don'?t|do not|can'?t) (really )?(understand|get)\b[^.?!]*\b(class|lessons?|maths?|math|science|physics|chemistry|biology|subject|topic|teacher|algebra|equations)\b/i,
      /\bfalling behind\b[^.?!]*\b(class|maths?|math|science|physics|chemistry|biology|subject|lessons)\b|\blost in (class|maths?|math|lessons)\b|\bbehind in (class|maths?|math|science|physics|chemistry|biology)\b/i,
      /\b(embarrassed|shy|scared|afraid|nervous) to ask\b/i,
      /\bask (the |my )?teacher\b/i,
      /\b(extra|more) help\b|\bhelp with (maths?|math|science|physics|chemistry|biology|this subject)\b/i,
    ],
    related: [/\b(maths?|math|physics|chemistry|biology|science|class|lessons?)\b/i, /\bhelp\b/i],
    initial: initial({
      answer:
        "Ask for help soon. In subjects like maths, each topic builds on the last, so gaps get bigger the longer you wait. And you don't have to ask in front of the class.",
      points: [
        "Ask your teacher after the lesson, or by email.",
        "Ask a classmate who seems to get it.",
        "Find where it stopped making sense, and start there.",
      ],
      nextMove: "Before the next lesson, write down the last topic you understood, and ask your teacher about the one after it.",
      scripts: ["I've got a bit lost with [topic]. Could you explain it again, or point me to something that would help?"],
      followUps: ["What if the teacher makes me feel stupid?", "I don't know where I got lost.", "Can I catch up on my own?"],
      title: "Falling behind in a subject",
    }),
    direct: {
      answer: "Ask your teacher this week, privately if that's easier. Waiting only makes the gap bigger.",
      nextMove: "Email them or talk to them before the next lesson.",
      followUps: ["What if the teacher makes me feel stupid?", "I don't know where I got lost."],
    },
    firstStep: {
      answer: "First, find the last topic that made sense; that tells you what to ask about.",
      nextMove: "Look back through your notes tonight and mark it.",
      followUps: ["I don't know where I got lost.", "Can I catch up on my own?"],
    },
    words: {
      answer: "You don't need to explain everything; naming the topic is enough.",
      scripts: [
        "I've got a bit lost with [topic]. Could you go over it with me sometime?",
        "I'm finding [topic] hard. Is there anything you'd recommend to catch up?",
        "Could we go through one example together? I don't think I've understood it.",
      ],
      nextMove: "Pick one and send it or say it this week.",
      followUps: ["What if the teacher makes me feel stupid?", "Can I catch up on my own?"],
    },
    extras: [
      {
        match: /\bstupid\b|\bjudge|\blaugh|\bembarrass/i,
        reply: {
          answer:
            "Asking for help is part of learning, and helping is part of a teacher's job. If one teacher doesn't feel approachable, ask another teacher or a classmate instead.",
          nextMove: "Start with the most private option: an email, or a quick word after class.",
          followUps: ["I don't know where I got lost.", "Can I catch up on my own?"],
        },
      },
      {
        match: /\bwhere (i|it) (got|went) lost\b|\b(don'?t|do not) know where\b|\blost track\b/i,
        reply: {
          answer:
            "Then go backwards through your notes or textbook until you reach something that makes sense. The topic just after it is where to start.",
          nextMove: "Tonight, skim the last few weeks of notes and mark the first thing you couldn't explain to someone else.",
          followUps: ["What if the teacher makes me feel stupid?", "Can I catch up on my own?"],
        },
      },
      {
        match: /\bon my own\b|\bby myself\b|\bonline\b|\bvideos?\b|\bself[- ]study\b/i,
        reply: {
          answer:
            "Partly. Videos and practice questions can fill a lot of gaps, but a quick check with a teacher tells you whether you've really got it.",
          points: [
            "Find a short video on the exact topic.",
            "Do a few practice questions and check the answers.",
            "Ask about anything you still got wrong.",
          ],
          nextMove: "Pick the first confusing topic and do one video plus a few questions this week.",
          followUps: ["I don't know where I got lost.", "What if the teacher makes me feel stupid?"],
        },
      },
    ],
  },
  {
    id: "group-slacker",
    example: "Someone in my group project isn't doing their part, and it's due next week.",
    keywords: [
      /\b(group|partner|teammate|project)\b[^.?!]*\b(isn'?t|is not|aren'?t|are not|doesn'?t|don'?t|never|won'?t) (do|doing|pull|pulling|help|helping|contribute|contributing)\b/i,
      /\b(isn'?t|is not|aren'?t|are not|doesn'?t|don'?t|never|won'?t) (do(ing)?|pull(ing)?) (their|his|her|any|its) (part|share|weight|work|bit)\b/i,
      /\bdoing (all|most) (of )?the work\b|\b(group|project|partner|team)\b[^.?!]*\b(nobody|no one) (else )?(has done|is doing|does|helps|is helping|did|has helped)\b/i,
      /\b(slack(er|ing)?|free[- ]?rid(er|ing))\b/i,
      /\bsomeone in my group\b|\b(group member|project partner|lab partner)s?\b/i,
    ],
    related: [
      /\bgroup\b|\bpartner\b|\bteam(mate)?\b/i,
      /\b(project|assignment|presentation)\b/i,
      /\b(does|do|doing) nothing\b/i,
    ],
    initial: initial({
      answer:
        "Talk to them directly first, and make it about the task rather than about them. Something may be going on that you don't know about, so ask before assuming.",
      points: [
        "Agree exactly what they'll do, and by when.",
        "Put tasks and deadlines in the group chat, so everyone can see them.",
        "If nothing changes, tell your teacher early, not after the deadline.",
      ],
      nextMove: "Message them today with one specific task and a date, and ask whether that works for them.",
      scripts: ["Hey, we need [part] done by Thursday for the project. Can you take that on, or is something making it hard right now?"],
      followUps: ["They still aren't doing anything.", "Should I just do it myself?", "When should I tell the teacher?"],
      title: "A group member not contributing",
    }),
    direct: {
      answer: "Ask them directly today, with a specific task and a deadline. If that doesn't work, tell the teacher.",
      nextMove: "Send the message now.",
      followUps: ["They still aren't doing anything.", "When should I tell the teacher?"],
    },
    firstStep: {
      answer: "First, make sure the tasks are clearly split and written down, so nobody can be confused about who does what.",
      nextMove: "Post a list of tasks, names and dates in the group chat today.",
      followUps: ["They still aren't doing anything.", "Should I just do it myself?"],
    },
    words: {
      answer: "Be friendly and specific, and leave room for a reason you don't know about.",
      scripts: [
        "Hey, we need [part] done by Thursday for the project. Can you take that on?",
        "Is everything okay? We haven't seen your part yet, and we're running short on time.",
        "Can we agree who's doing what this week? I've put a list in the chat.",
      ],
      nextMove: "Pick one and send it today.",
      followUps: ["They still aren't doing anything.", "When should I tell the teacher?"],
    },
    extras: [
      {
        match: /\bstill\b|\bnothing (has )?changed\b|\bno (reply|answer|response)\b/i,
        reply: {
          answer: "Then it's time to involve your teacher. Keep it factual: what was agreed, what's been done, and what's missing.",
          scripts: ["Our group agreed [task] would be done by [date], and it hasn't been yet. We wanted to tell you early. What would you suggest?"],
          nextMove: "Tell the teacher this week, while there's still time to adjust.",
          followUps: ["Should I just do it myself?", "When should I tell the teacher?"],
        },
      },
      {
        match: /\bmyself\b|\bcover for\b|\bdo (their|his|her) (part|work|share)\b/i,
        reply: {
          answer:
            "Only as a last resort, and if you do, tell your teacher who did what. Quietly covering for them gets the work done, but it isn't fair on you.",
          nextMove: "Before taking it on, ask them once more with a clear deadline.",
          followUps: ["They still aren't doing anything.", "When should I tell the teacher?"],
        },
      },
      {
        match: /\bteacher\b|\btell (someone|a teacher)\b/i,
        reply: {
          answer:
            "As soon as you've asked them directly and nothing has changed, not the day before the deadline. Early is when a teacher can still help.",
          nextMove: "Set a date: if their part isn't started by then, you'll tell the teacher.",
          followUps: ["They still aren't doing anything.", "Should I just do it myself?"],
        },
      },
    ],
  },
  {
    id: "group-disagree",
    example: "My group can't agree on an idea for our project, and we're running out of time.",
    keywords: [
      /\b(can'?t|cannot|don'?t|won'?t|couldn'?t) agree\b/i,
      /\b(arguing|argue|disagree(ing|ment)?|fighting|fight)\b[^.?!]*\b(idea|topic|project|plan)\b|\b(group|team)\b[^.?!]*\b(arguing|argue|disagree|fight)/i,
    ],
    related: [/\b(my|our) group\b|\bteam\b/i, /\b(project|presentation|assignment)\b/i, /\b(ideas?|topic)\b/i],
    initial: initial({
      answer:
        "Agree on how you'll decide before arguing about what. Set a short time limit, compare the ideas against the brief, then vote or pick the one that's easiest to do well.",
      points: [
        "List every idea in one place.",
        "Score each against the brief and the time you have.",
        "Combine ideas where you can.",
        "Decide by a set time, even if it isn't perfect.",
      ],
      nextMove: "Suggest a short call or meeting today with one goal: leave with a decision.",
      scripts: ["Can we give ourselves until the end of today to decide? Let's list the ideas, check them against the brief, and vote."],
      followUps: ["Someone won't accept the vote.", "What if two ideas tie?", "I think my idea is best."],
      title: "A group that can't agree",
    }),
    direct: {
      answer: "Stop debating and decide today, by vote if you have to. Any reasonable idea done well beats a perfect one started too late.",
      nextMove: "Propose a deadline for the decision in the group chat now.",
      followUps: ["Someone won't accept the vote.", "What if two ideas tie?"],
    },
    firstStep: {
      answer: "First, reread the brief together. Checking what's actually required often settles part of it.",
      nextMove: "Share the brief in the group chat and ask everyone to check their idea against it.",
      followUps: ["What if two ideas tie?", "I think my idea is best."],
    },
    words: {
      answer: "Suggest a way to decide, not a winner.",
      scripts: [
        "We're running out of time. Can we each pitch our idea in two minutes and then vote?",
        "Can we check the ideas against the brief and pick the one we can do best?",
      ],
      nextMove: "Send one of these in the group chat today.",
      followUps: ["Someone won't accept the vote.", "What if two ideas tie?"],
    },
    extras: [
      {
        match: /\bwon'?t accept\b|\bkeeps? arguing\b|\brefuses?\b|\bnot happy\b/i,
        reply: {
          answer:
            "Ask what they'd need to go along with it; sometimes part of their idea can be folded in. If it stays stuck, ask your teacher to settle it.",
          scripts: ["What would make this work for you? Could we use part of your idea in it?"],
          nextMove: "Talk to them one-on-one before the group argues about it again.",
          followUps: ["What if two ideas tie?", "I think my idea is best."],
        },
      },
      {
        match: /\btie\b|\bequal\b|\b50[ -]50\b|\bsplit (vote|down the middle)\b/i,
        reply: {
          answer: "Pick the one you can finish well in the time you have, or ask your teacher which fits the brief better.",
          nextMove: "Compare the two on one question only: which could you do really well by the deadline?",
          followUps: ["Someone won't accept the vote.", "I think my idea is best."],
        },
      },
      {
        match: /\bmy idea\b|\bmine is\b|\bi'?m right\b/i,
        reply: {
          answer:
            "Then make the case once, clearly, against the brief, and accept the decision if it goes the other way. Being easy to work with counts too.",
          nextMove: "Write two sentences on why your idea fits the brief, and share them before the vote.",
          followUps: ["Someone won't accept the vote.", "What if two ideas tie?"],
        },
      },
    ],
  },
  {
    id: "study-focus",
    example: "I can't concentrate when I study. My mind keeps wandering after a few minutes.",
    keywords: [
      /\b(can'?t|cannot|struggle to|hard to|trouble|unable to|how (do i|to|can i)) (focus|concentrat|stay focused)/i,
      /\b(focus|concentrat)\w*\b[^.?!]*\b(study|studying|revise|revising|revision|homework|work|class|lessons)\b|\b(study|studying|revise|revising|homework)\b[^.?!]*\b(focus|concentrat)/i,
      /\bmind (keeps )?wander|\bzon(e|ing) out\b|\battention span\b|\bget(ting)? distracted\b/i,
      /\b(study|revise) (better|more effectively|smarter|properly)\b|\b(better|best|good|effective) ways? to (study|revise)\b|\bhow (do i|to|should i) (study|revise)\b/i,
    ],
    related: [/\bstud(y|ying)\b|\brevis/i, /\bfocus|\bconcentrat|\bdistract/i],
    initial: initial({
      answer:
        "Don't try to force long sessions. Study in short blocks with one clear target each, and take a break before your focus runs out, not after.",
      points: [
        "Decide what \"done\" means for each block, like ten questions or one page.",
        "Keep paper nearby to park stray thoughts, then carry on.",
        "Test yourself rather than rereading; it's harder to drift when you have to answer.",
        "Put your phone out of reach, or at least out of sight.",
      ],
      nextMove: "Try one block of 20 to 30 minutes now with one specific target, then take a short break.",
      alternative: "If you're exhausted, a proper break or an earlier night may help more than pushing on.",
      followUps: ["How long should each block be?", "My mind still keeps wandering.", "What if the subject is boring?"],
      title: "Staying focused while studying",
    }),
    direct: {
      answer: "Short, specific blocks beat long, vague sessions. Pick one small target and start a timer now.",
      nextMove: "Set a timer for 20 to 30 minutes and work on one thing until it goes off.",
      followUps: ["My mind still keeps wandering.", "What if the subject is boring?"],
    },
    firstStep: {
      answer: "Start by choosing one small, concrete target for your next session, so you know when each block is finished.",
      nextMove: "Write it at the top of the page, like \"answer five questions on this topic\", and begin.",
      followUps: ["How long should each block be?", "My mind still keeps wandering."],
    },
    words: {
      answer: "If people around you make it hard to focus, it's fine to ask for some quiet.",
      scripts: [
        "I'm trying to get some studying done. Could you keep it down for the next half hour?",
        "Can we talk after I finish this bit? I'm in the middle of revising.",
      ],
      nextMove: "Tell them when you'll be free, so it doesn't feel like shutting them out.",
      followUps: ["How long should each block be?", "What if the subject is boring?"],
    },
    extras: [
      {
        match: /\bhow long\b|\bblocks?\b|\bbreaks?\b|\bpomodoro\b/i,
        reply: {
          answer:
            "Start with something manageable, like 20 to 30 minutes and a short break, then make the blocks longer as it gets easier.",
          nextMove: "Try two blocks today and notice which length works for you.",
          followUps: ["My mind still keeps wandering.", "What if the subject is boring?"],
        },
      },
      {
        match: /\bwander|\bdaydream|\bdrift|\bstill (can'?t|keep)\b/i,
        reply: {
          answer:
            "That happens to everyone. When you notice it, jot the stray thought down and go back to the last thing you were doing, without telling yourself off.",
          nextMove: "Keep a notepad beside you next session for parked thoughts.",
          followUps: ["How long should each block be?", "What if the subject is boring?"],
        },
      },
      {
        match: /\bbor(ed|ing)\b|\bhate (the |this )?subject\b/i,
        reply: {
          answer: "Make it more active: quiz yourself, explain it out loud as if teaching someone, or turn your notes into questions.",
          nextMove: "For your next block, write five questions on the topic and answer them without looking.",
          followUps: ["How long should each block be?", "My mind still keeps wandering."],
        },
      },
    ],
  },
  {
    id: "phone-distraction",
    example: "I keep getting distracted by my phone whenever I try to study.",
    keywords: [
      /\b(phone|tiktok|instagram|snapchat|social media|youtube|scrolling|notifications?)\b[^.?!]*\b(study|studying|revise|revising|revision|homework|focus)\b|\b(study|studying|revise|revising|revision|homework|focus)\b[^.?!]*\b(phone|tiktok|instagram|snapchat|social media|youtube|scrolling|notifications?)\b/i,
      /\bdistract(ed|ion|ions|ing)?\b/i,
      /\b(keep|keeps|always|constantly) checking (my )?phone\b|\bcheck(ing)? my phone\b/i,
    ],
    related: [
      /\bphone\b|\bscrolling\b|\btiktok\b|\bsocial media\b|\binstagram\b|\byoutube\b/i,
      /\b(study|studying|revise|revising|homework)\b/i,
      /\bfocus|\bconcentrat/i,
    ],
    initial: initial({
      answer:
        "Make the phone hard to reach instead of relying on willpower. Out of the room works best; out of sight is the minimum.",
      points: [
        "Put it in another room, or give it to someone.",
        "Turn off notifications during study time.",
        "Study in short blocks, and check the phone only in the breaks.",
      ],
      nextMove: "Next time you study, put your phone in another room for one block of about half an hour, then check it in the break.",
      alternative: "If you need the phone for studying, use a focus mode or app blocker so only what you need works.",
      followUps: ["I need my phone to study.", "I get bored without it.", "How long should each block be?"],
      title: "Studying without phone distractions",
    }),
    direct: {
      answer: "Put the phone in another room while you study, starting today. It's simpler than trying to resist it.",
      nextMove: "Do it for your next study session, and see what changes.",
      followUps: ["I need my phone to study.", "How long should each block be?"],
    },
    firstStep: {
      answer: "Start by turning off notifications for the apps that pull you in most.",
      nextMove: "Do it now, before your next study session.",
      followUps: ["How long should each block be?", "I get bored without it."],
    },
    words: {
      answer: "If it helps, ask someone at home to hold onto it while you study.",
      scripts: ["Could you keep my phone for the next hour? I'm trying to study without it.", "I'm going offline for an hour to study. I'll reply after."],
      nextMove: "Try it for one study session this week.",
      followUps: ["I need my phone to study.", "How long should each block be?"],
    },
    extras: [
      {
        match: /\bneed (my|the|a) phone\b|\bfor (school|studying|study|homework)\b|\bapps?\b/i,
        reply: {
          answer:
            "Then limit what the phone can do: turn on a focus mode, block your most distracting apps during study time, and keep only what you need on screen.",
          nextMove: "Set up a focus mode now that blocks your two most distracting apps.",
          followUps: ["I get bored without it.", "How long should each block be?"],
        },
      },
      {
        match: /\bbored\b|\bboring\b|\bcan'?t (stay|sit) still\b/i,
        reply: {
          answer: "Then make studying more active: test yourself, explain things out loud, or set a small target for each block.",
          nextMove: "Pick a concrete target for your next block, like ten questions or one page of notes from memory.",
          followUps: ["I need my phone to study.", "How long should each block be?"],
        },
      },
      {
        match: /\bhow long\b|\bblocks?\b|\bbreaks?\b|\bpomodoro\b/i,
        reply: {
          answer:
            "Start with something you can manage, like 20 to 30 minutes followed by a short break, and make the blocks longer as it gets easier.",
          nextMove: "Try two blocks tonight and see which length suits you.",
          followUps: ["I need my phone to study.", "I get bored without it."],
        },
      },
    ],
  },
  {
    id: "choosing-subjects",
    example: "I have to choose my subjects for next year and I'm not sure which ones to take.",
    keywords: [
      /\b(subjects|electives|a[- ]?levels|gcses?|modules)\b[^.?!]*\b(choose|pick|take|drop|choosing|picking)\b|\b(choose|pick|picking|choosing|select(ing)?|take|drop)\b[^.?!]*\b(subjects|electives|courses|classes|modules|a[- ]?levels|gcses?)\b/i,
      /\b(which|what) (subjects|classes|courses|electives|modules|a[- ]?levels|gcses)\b/i,
      /\b(subjects|electives|a[- ]?levels|gcses?)\b/i,
    ],
    related: [/\bnext (year|term|semester)\b/i, /\bstud(y|ying)\b|\bcareer\b|\buni(versity)?\b|\bcollege\b/i],
    initial: initial({
      answer:
        "Pick subjects you can stay interested in and do reasonably well at, and check whether any later plans need specific ones. You don't need your whole future decided to choose well.",
      points: [
        "Check whether a course or job you're considering needs certain subjects.",
        "Notice which subjects you enjoy and do well in.",
        "Ask current students what each subject is really like.",
      ],
      question: "Do you already have a course or career in mind, or are you keeping your options open?",
      nextMove: "This week, make a quick table: each subject, how much you enjoy it, how well you do, and whether any plan needs it.",
      followUps: ["I have a career in mind.", "My friends are choosing differently.", "My parents want different subjects."],
      title: "Choosing subjects for next year",
    }),
    direct: {
      answer: "Pick the subjects you're good at and interested in, unless a specific plan needs others.",
      nextMove: "Check any requirements this week, then choose.",
      followUps: ["I have a career in mind.", "My parents want different subjects."],
    },
    firstStep: {
      answer: "First, find out the deadline and any rules about which subjects can go together, so you know your real choices.",
      nextMove: "Check the options list and the deadline this week.",
      followUps: ["I have a career in mind.", "My friends are choosing differently."],
    },
    words: {
      answer: "Asking people already taking a subject is one of the best ways to choose.",
      scripts: [
        "What's the workload like in [subject], and what kind of person enjoys it?",
        "What would you recommend for someone who's good at [subject] but unsure about the future?",
      ],
      nextMove: "Ask one current student and one teacher this week.",
      followUps: ["I have a career in mind.", "My parents want different subjects."],
    },
    extras: [
      {
        match: /\bcareer\b|\bjob\b|\bcourse\b|\buniversity\b|\bin mind\b|\bwant to (be|become|study)\b/i,
        reply: {
          answer:
            "Then check its entry requirements first, and make sure your choices keep that door open. Fill the remaining places with subjects you enjoy.",
          nextMove: "Look up the requirements for that path this week, or ask a teacher who knows.",
          followUps: ["My friends are choosing differently.", "My parents want different subjects."],
        },
      },
      {
        match: /\bfriends?\b/i,
        reply: {
          answer: "Being with friends is nice, but you'll spend the whole year on the subject itself, so let the subject decide.",
          nextMove: "For each subject, ask yourself whether you'd still pick it if your friends weren't taking it.",
          followUps: ["I have a career in mind.", "My parents want different subjects."],
        },
      },
      {
        match: /\bparents?\b|\bmum\b|\bmom\b|\bdad\b|\bfamily\b/i,
        reply: {
          answer:
            "Find out what they're worried about, and share your reasons. There's often a middle ground, like a subject that keeps their preferred option open.",
          scripts: ["Can I show you why I'm leaning towards these subjects? I'd also like to hear what worries you about them."],
          nextMove: "Show them your table, and ask what they'd change and why.",
          followUps: ["I have a career in mind.", "My friends are choosing differently."],
        },
      },
    ],
  },
  {
    id: "unfair-mark",
    example: "I think my teacher marked my essay unfairly. Should I say something?",
    keywords: [
      /\b(marked|graded|marking|grading)\b[^.?!]*\bunfair(ly)?\b|\bunfair(ly)?\b[^.?!]*\b(marked|graded|mark|grade|score|result)\b/i,
      /\b(challenge|appeal|question|dispute|argue about)\b[^.?!]*\b(grade|mark|score|result)\b/i,
      /\bmarked (it |me )?(wrong|down|harshly)\b|\bdeserved (a )?(better|higher)\b/i,
    ],
    related: [
      /\b(teacher|lecturer|professor|tutor)\b/i,
      /\b(essay|test|exam|assignment|coursework|project)\b/i,
      /\bunfair/i,
    ],
    initial: initial({
      answer:
        "It's fine to ask, if you can point to something specific. Go in to understand the mark rather than to argue it; you'll learn something either way, and a mistake is easier to spot together.",
      points: [
        "Reread the feedback and the marking criteria first.",
        "Note the specific parts you don't understand.",
        "Ask calmly, in private, and listen to the answer.",
      ],
      nextMove: "Before talking to them, write down two or three specific questions about the mark.",
      scripts: ["Could you help me understand my mark on this essay? I thought this section met the criteria, and I'd like to see what I missed."],
      followUps: ["What if they won't change it?", "What if I'm right?", "Should I tell my parents?"],
      title: "Questioning a mark",
    }),
    asked: {
      match: /\bshould i (say|ask|talk|tell|complain|do|question)\b/i,
      answer:
        "Yes, if you can point to something specific. Ask to understand the mark rather than to change it; you'll learn something either way, and a mistake is easier to spot together.",
    },
    direct: {
      answer: "Ask, but ask to understand, not to win. Go with specific questions.",
      nextMove: "Ask your teacher for a few minutes this week.",
      followUps: ["What if they won't change it?", "What if I'm right?"],
    },
    firstStep: {
      answer: "First, compare your work with the marking criteria, so you know exactly what you're asking about.",
      nextMove: "Mark the parts where you think you met a criterion.",
      followUps: ["What if I'm right?", "What if they won't change it?"],
    },
    words: {
      answer: "Keep it curious rather than accusing.",
      scripts: [
        "Could you help me understand my mark? I'd like to know what I could have done better.",
        "I thought this part met the criteria. Could you show me what was missing?",
      ],
      nextMove: "Ask after class or by email, not in front of everyone.",
      followUps: ["What if they won't change it?", "What if I'm right?"],
    },
    extras: [
      {
        match: /\bwon'?t change\b|\bdoesn'?t change\b|\bsay(s)? no\b|\bstays? the same\b/i,
        reply: {
          answer:
            "Then use the feedback for your next piece of work. If you still think there's a real error, ask whether there's a formal way to have it reviewed; that varies between schools.",
          nextMove: "Write down one thing to do differently next time, based on what they said.",
          followUps: ["What if I'm right?", "Should I tell my parents?"],
        },
      },
      {
        match: /\bi'?m right\b|\b(they|teacher)('re| is| are) wrong\b|\bmistake\b|\berror\b/i,
        reply: {
          answer:
            "Then showing them the exact part of the criteria, calmly, is the strongest case you can make. Teachers do sometimes miss things, and a clear example is easy to check.",
          nextMove: "Mark the exact sentences and the criteria they meet, and bring both.",
          followUps: ["What if they won't change it?", "Should I tell my parents?"],
        },
      },
      {
        match: /\bparents?\b|\bmum\b|\bmom\b|\bdad\b/i,
        reply: {
          answer: "Talk to the teacher yourself first. If it's a real problem and it isn't resolved, that's the time to involve your parents.",
          nextMove: "Have the conversation with your teacher this week, then decide.",
          followUps: ["What if they won't change it?", "What if I'm right?"],
        },
      },
    ],
  },
  {
    id: "copy-homework",
    example: "A friend keeps asking to copy my homework and I don't want to let them anymore.",
    keywords: [
      /\bcopy(ing)? (my|your|the|our) (homework|work|answers|assignment|essay|notes)\b/i,
      /\b(copy|copying|copied)\b/i,
      /\bstop (letting (them|him|her)|sharing (my )?(homework|answers|work))\b/i,
    ],
    related: [/\b(homework|assignment|answers|notes)\b/i, /\bfriend|\bclassmate/i],
    initial: initial({
      answer:
        "You can say no without ending the friendship. Keep it short, make it about you, and offer a kind of help you're happy to give instead.",
      points: [
        "Don't over-explain; one reason is enough.",
        "Offer to study together or explain a tricky question.",
        "Keep things normal between you afterwards.",
      ],
      nextMove: "Next time they ask, say no in one sentence and offer that help instead.",
      scripts: ["I'd rather not share my answers anymore; I don't want us both getting in trouble. But I can help you work through it if you like."],
      followUps: ["What if they get annoyed?", "What if they keep asking?", "Help me say it differently."],
      title: "Saying no to copying homework",
    }),
    direct: {
      answer: "Say no, kindly and clearly, the next time they ask.",
      nextMove: "Decide your sentence now, so you don't hesitate.",
      followUps: ["What if they get annoyed?", "What if they keep asking?"],
    },
    firstStep: {
      answer: "First, decide what help you are happy to give, so your no comes with an offer.",
      nextMove: "Pick one: explaining a question, studying together, or going through it after they've tried it themselves.",
      followUps: ["Help me say it differently.", "What if they keep asking?"],
    },
    words: {
      answer: "Pick the version that sounds most like you.",
      scripts: [
        "I'd rather not share my answers anymore, but I can help you work through it.",
        "I'm not comfortable sharing my homework. Want to do the next one together?",
        "I don't want us both getting in trouble. I can explain the tricky ones, though.",
      ],
      nextMove: "Use it the next time they ask.",
      followUps: ["What if they get annoyed?", "What if they keep asking?"],
    },
    extras: [
      {
        match: /\bannoyed\b|\bupset\b|\bangry\b|\bmad\b|\bhate me\b|\blose (the |my |a )?friend/i,
        reply: {
          answer:
            "They might be, for a moment, and that's okay. Stay friendly and don't reopen the debate; how you treat them afterwards matters more than the no.",
          nextMove: "Keep things normal between you, and don't bring it up again unless they do.",
          followUps: ["What if they keep asking?", "Help me say it differently."],
        },
      },
      {
        match: /\bkeeps? asking\b|\bagain\b|\bpush(es|ing|y)?\b|\bpressur/i,
        reply: {
          answer: "Repeat the same short answer, calmly. You don't owe a new reason each time.",
          scripts: ["Like I said, I'm not sharing answers anymore. Happy to help you with it, though."],
          nextMove: "Use the same sentence every time they ask.",
          followUps: ["What if they get annoyed?", "Help me say it differently."],
        },
      },
    ],
  },
  {
    id: "new-school",
    example: "I'm starting at a new school next week and I don't know anyone there.",
    keywords: [
      /\bnew (school|college|class|uni|university|sixth form)\b/i,
      /\b(don'?t|do not) know anyone\b|\bnot knowing anyone\b|\bi'?m new here\b/i,
      /\bfirst day\b/i,
      /\b(starting|start|moving to|changing|switching) (at )?(a )?(new )?(school|college|schools)\b/i,
    ],
    related: [/\bnervous\b|\bscared\b|\bworried\b/i, /\bfriend/i],
    initial: initial({
      answer:
        "Aim for a few small conversations in your first week rather than a best friend on day one. Simple questions about classes are the easiest way in.",
      points: [
        "Ask the person next to you a simple question about the class.",
        "Try at least one club, team or activity in the first few weeks.",
        "Sit near the same people a few days in a row.",
      ],
      nextMove: "Before you start, look up the clubs or activities and pick one to try.",
      scripts: ["Hi, I'm new. Do you know where [room] is?"],
      followUps: ["What if nobody talks to me?", "What do I do at lunch?", "How do I keep a conversation going?"],
      title: "Starting at a new school",
    }),
    direct: {
      answer: "Talk first. Waiting for others to come to you is the slow way.",
      nextMove: "Plan one question to ask someone on your first morning.",
      followUps: ["What if nobody talks to me?", "What do I do at lunch?"],
    },
    firstStep: {
      answer: "First, find out what clubs or activities are on, so you have somewhere to go besides class.",
      nextMove: "Check the school's website, or ask on your first day.",
      followUps: ["What do I do at lunch?", "How do I keep a conversation going?"],
    },
    words: {
      answer: "Simple is best; nobody needs a clever opener.",
      scripts: ["Hi, I'm new. Do you know where [room] is?", "Mind if I sit here? I'm new.", "What's this teacher like?"],
      nextMove: "Pick one to use on your first day.",
      followUps: ["What if nobody talks to me?", "How do I keep a conversation going?"],
    },
    extras: [
      {
        match: /\bnobody\b|\bno one\b|\balone\b|\bignored?\b/i,
        reply: {
          answer: "Then start the conversations yourself; that's normal, not desperate. And judge it after a few weeks, not a few days.",
          nextMove: "Set a small goal: one short conversation a day in your first week.",
          followUps: ["What do I do at lunch?", "How do I keep a conversation going?"],
        },
      },
      {
        match: /\blunch\b|\bbreak ?time\b|\bsit (with|alone)\b/i,
        reply: {
          answer:
            "Ask someone from one of your classes if you can sit with them, or go to a club that meets at lunch. Both are completely normal.",
          scripts: ["Mind if I sit here? I'm new."],
          nextMove: "In your first lessons, notice one or two friendly people you could ask.",
          followUps: ["What if nobody talks to me?", "How do I keep a conversation going?"],
        },
      },
      {
        match: /\bconversation\b|\bkeep (it|things) going\b|\bwhat (do|should) i (say|talk about)\b/i,
        reply: {
          answer: "Ask open questions, then follow up on whatever they say.",
          points: [
            "\"What did you think of that lesson?\"",
            "\"How long have you been at this school?\"",
            "\"What do you do outside school?\"",
          ],
          nextMove: "Try one of these tomorrow, and ask one follow-up question about whatever they say.",
          followUps: ["What if nobody talks to me?", "What do I do at lunch?"],
        },
      },
    ],
  },
  {
    id: "speak-up-class",
    example: "I'm scared to speak up in class, even when I know the answer.",
    keywords: [
      /\bspeak(ing)? up\b(?! for)/i,
      /\b(scared|afraid|nervous|shy|anxious)\b[^.?!]*\b(answer|speak|talk|say anything|participate|contribute)\b[^.?!]*\b(class|lessons?|seminars?)\b/i,
      /\b(raise|put up) my hand\b|\banswer(ing)? questions in class\b|\bparticipat(e|ion|ing)\b/i,
      /\bknow the answer\b/i,
    ],
    related: [/\b(in|during) (class|lessons?|seminars?)\b|\bin front of (the |my |the whole )?class\b/i, /\bconfiden/i],
    initial: initial({
      answer:
        "Start small and predictable: one short contribution a lesson, on something you're sure of. It tends to get easier with practice, not by waiting until you feel ready.",
      points: [
        "Answer early in the lesson, before you overthink it.",
        "Write your answer down first, then read it out.",
        "Ask a question instead, if that feels easier.",
      ],
      nextMove: "In your next lesson, aim to say one thing: an answer, a question, or building on what someone else said.",
      alternative:
        "If speaking in front of everyone feels impossible right now, talk to your teacher privately; they may be able to help you ease in.",
      followUps: ["What if I get it wrong?", "My voice shakes when I talk.", "Can I start without raising my hand?"],
      title: "Speaking up in class",
    }),
    direct: {
      answer: "Say one thing in your next lesson. Just one, and just short.",
      nextMove: "Decide now which lesson you'll do it in.",
      followUps: ["What if I get it wrong?", "My voice shakes when I talk."],
    },
    firstStep: {
      answer: "Start where it's easiest: small group work, or the lesson you feel most comfortable in.",
      nextMove: "Pick that lesson and plan one thing to say.",
      followUps: ["Can I start without raising my hand?", "What if I get it wrong?"],
    },
    words: {
      answer: "If you'd like your teacher's help, a quick private word is enough.",
      scripts: ["I find it hard to speak up in class, even when I know the answer. Could you help me ease into it?"],
      nextMove: "Say it after class, or send it by email.",
      followUps: ["What if I get it wrong?", "Can I start without raising my hand?"],
    },
    extras: [
      {
        match: /\bwrong\b|\bmistake\b|\blaugh/i,
        reply: {
          answer: "Then you'll learn the right answer, which is what class is for. A wrong answer said calmly is a normal part of any lesson.",
          nextMove: "Start with answers you're fairly sure of, until speaking feels more normal.",
          followUps: ["My voice shakes when I talk.", "Can I start without raising my hand?"],
        },
      },
      {
        match: /\bvoice\b|\bshak|\bblush|\bgo red\b/i,
        reply: {
          answer: "That's common, and it tends to ease with practice. Slow down a little, and take a breath before you start.",
          nextMove: "Practise saying your answer quietly to yourself before you raise your hand.",
          followUps: ["What if I get it wrong?", "Can I start without raising my hand?"],
        },
      },
      {
        match: /\bwithout raising\b|\braising my hand\b|\bhand\b|\bsmall groups?\b|\bpairs?\b/i,
        reply: {
          answer:
            "Yes. Use lower-pressure moments first: talk in pair or group work, or ask the teacher something at the end of the lesson. Both are good practice.",
          nextMove: "In your next group or pair task, say at least one idea out loud.",
          followUps: ["What if I get it wrong?", "My voice shakes when I talk."],
        },
      },
    ],
  },
  {
    id: "missed-school",
    example: "I missed a week of school and I'm worried about catching up on everything.",
    keywords: [
      /\bmiss(ed|ing) (a |one |two |three |several |some |a lot of |lots of |a few |\d+ |so much |so many )?(week|weeks|days|lessons|classes|school)\b/i,
      /\bcatch(ing)? up\b/i,
      /\b(was|been|were|am|i'?m) (away|absent|off school|off sick|ill)\b/i,
      /\bbehind on everything\b/i,
    ],
    related: [/\b(school|class|classes|lessons|work|homework|notes)\b/i],
    initial: initial({
      answer:
        "Find out exactly what you missed before trying to do all of it. Some of it will matter a lot and some won't, and your teachers can tell you which is which.",
      points: [
        "Ask each teacher what's essential to catch up on.",
        "Borrow notes from a classmate for each subject.",
        "Make one list, sorted by deadline.",
      ],
      nextMove: "On your first day back, ask each teacher what the most important thing you missed was.",
      scripts: ["I was away last week. What's the most important thing I missed, and is there anything I need to hand in?"],
      followUps: ["There's too much to catch up on.", "Who should I ask for notes?", "I missed a topic for a test."],
      title: "Catching up after missing school",
    }),
    direct: {
      answer: "Ask your teachers what matters most, and catch up on that first.",
      nextMove: "Talk to each teacher in your first lesson back.",
      followUps: ["There's too much to catch up on.", "Who should I ask for notes?"],
    },
    firstStep: {
      answer: "First, get a full list of what you missed, subject by subject.",
      nextMove: "Check your class pages or ask a classmate today.",
      followUps: ["Who should I ask for notes?", "There's too much to catch up on."],
    },
    words: {
      answer: "A short, specific question gets you the most useful answer.",
      scripts: [
        "I was away last week. What's the most important thing I missed?",
        "Is there any work I need to hand in, and when by?",
        "Could I borrow your notes from last week?",
      ],
      nextMove: "Use the first two with teachers, and the last one with a classmate.",
      followUps: ["There's too much to catch up on.", "I missed a topic for a test."],
    },
    extras: [
      {
        match: /\btoo much\b|\bso much\b|\beverything\b|\bcan'?t do (it )?all\b/i,
        reply: {
          answer:
            "Then prioritise: anything due soon or on an upcoming test comes first, then the core topics. Some things can be skimmed, and teachers may let some work go; ask rather than assume.",
          nextMove: "Sort your list into \"this week\", \"soon\" and \"skim\", and start with \"this week\".",
          followUps: ["Who should I ask for notes?", "I missed a topic for a test."],
        },
      },
      {
        match: /\bnotes\b|\bwho (should|do) i ask\b|\bclassmates?\b|\bborrow/i,
        reply: {
          answer: "Ask someone who takes good notes, not just your closest friend, and offer something back, like your notes next time.",
          scripts: ["Could I borrow your notes from last week? I was away and want to catch up."],
          nextMove: "Ask one person per subject today.",
          followUps: ["There's too much to catch up on.", "I missed a topic for a test."],
        },
      },
      {
        match: /\btest\b|\bexam\b|\bquiz\b/i,
        reply: {
          answer:
            "Tell the teacher you missed that topic and ask what to focus on. Learn the core ideas first, with practice questions, before the details.",
          nextMove: "Ask about it at your next lesson, and do a few practice questions this week.",
          followUps: ["There's too much to catch up on.", "Who should I ask for notes?"],
        },
      },
    ],
  },
  {
    id: "study-plan-fail",
    example: "I keep making study plans, but I never actually stick to them.",
    keywords: [
      /\b(study|revision|revising|homework|school) (plan|plans|schedule|schedules|timetable|timetables|routine)\b/i,
      /\b(never|don'?t|can'?t|always fail to|struggle to|how (do i|to|can i)) (actually )?stick to\b/i,
      /\bplans?\b[^.?!]*\b(fall apart|falls apart|never work|don'?t work)\b/i,
    ],
    related: [/\bstud(y|ying)\b|\brevis/i, /\b(plan|plans|timetable|schedule)\b/i],
    initial: initial({
      answer:
        "If your plans keep falling apart, they may be too big for an ordinary day. Plan less than you think you can do, with specific tasks at set times, then build up.",
      points: [
        "Write tasks, not subjects: \"ten biology questions\", not \"biology\".",
        "Tie studying to a fixed point in your day, like after dinner.",
        "Keep one catch-up slot a week for things that slip.",
      ],
      question: "When a plan falls apart, what usually gets in the way: tiredness, distractions, or tasks that feel too big?",
      nextMove: "Plan only tomorrow, with two small tasks at set times, and see if you can do just that.",
      followUps: ["I get distracted.", "I'm too tired after school.", "The tasks feel too big."],
      title: "Sticking to a study plan",
    }),
    direct: {
      answer: "Make tomorrow's plan half the size, and do all of it.",
      nextMove: "Rewrite tomorrow's plan now with just two small tasks.",
      followUps: ["I get distracted.", "The tasks feel too big."],
    },
    firstStep: {
      answer: "Start by planning one day, not a whole week.",
      nextMove: "Write two specific tasks for tomorrow, and when you'll do them.",
      followUps: ["The tasks feel too big.", "I'm too tired after school."],
    },
    words: {
      answer: "Telling someone your plan can help you follow through.",
      scripts: ["I'm trying to study after dinner every day this week. Can you check in with me?", "Want to study together on Tuesday after school?"],
      nextMove: "Ask one friend or family member today.",
      followUps: ["I get distracted.", "The tasks feel too big."],
    },
    extras: [
      {
        match: /\bdistract|\bphone\b|\bfocus/i,
        reply: {
          answer: "Then change where and how you study, not how hard you try: phone in another room, one task open, short timed blocks.",
          nextMove: "For your next session, put your phone in another room and set a timer.",
          followUps: ["I'm too tired after school.", "The tasks feel too big."],
        },
      },
      {
        match: /\btired\b|\bexhausted\b|\bno energy\b|\bafter school\b/i,
        reply: {
          answer:
            "Then move studying to a time when you have more energy, even if it's shorter. A short session at a good time can get more done than a long one when you're drained.",
          nextMove: "Try one short session at a different time this week, and compare how it goes.",
          followUps: ["I get distracted.", "The tasks feel too big."],
        },
      },
      {
        match: /\btoo big\b|\btoo much\b|\bwhere to start\b|\btoo hard\b/i,
        reply: {
          answer: "Then break each task down until the first step takes five minutes: open the book, find the page, do question one.",
          nextMove: "Take tomorrow's biggest task and split it into three smaller ones.",
          followUps: ["I get distracted.", "I'm too tired after school."],
        },
      },
    ],
  },
  {
    id: "motivation",
    example: "I have no motivation to do my schoolwork lately, even though I know I should.",
    keywords: [
      /\b(no|lost( my| all)?|zero|lack of|lacking|little) motivation\b|\b(don'?t have|can'?t find) (any |the )?motivation\b|\bunmotivated\b|\bnot motivated\b|\bdemotivated\b/i,
      /\b(get|stay|feel|keep) (myself )?motivated\b|\bmotivat(e|ing) myself\b|\bfind (the )?motivation\b/i,
      /\bcan'?t be bothered\b|\b(i'?m|i am|being|feel) (so |really |too )?lazy\b/i,
    ],
    related: [/\bstud(y|ying)\b|\bschool(work)?\b|\bhomework\b|\brevis/i],
    initial: initial({
      answer:
        "Don't wait to feel motivated before you start. Motivation often turns up after you begin, so make the first step small enough that you don't need it.",
      points: [
        "Pick one task you could finish in about ten minutes.",
        "Work at the same time each day, so it's routine rather than a daily decision.",
        "Link it to something you care about, like a grade you want or where it leads.",
      ],
      nextMove: "Choose one ten-minute task now and do just that. You're allowed to stop afterwards.",
      alternative:
        "If you've felt flat about most things for a while, not just schoolwork, talk to someone you trust about how you've been.",
      followUps: ["I don't care about the subject.", "I start but give up quickly.", "How do I make it a habit?"],
      title: "Finding motivation for schoolwork",
    }),
    direct: {
      answer: "Start before you feel ready. Ten minutes on one small task today is worth more than waiting for motivation to arrive.",
      nextMove: "Set a timer for ten minutes and begin the easiest part.",
      followUps: ["I start but give up quickly.", "How do I make it a habit?"],
    },
    firstStep: {
      answer: "First, pick the smallest useful task, so small it feels almost too easy.",
      nextMove: "Write it down, like \"read one page\" or \"do two questions\", and do it now.",
      followUps: ["I start but give up quickly.", "I don't care about the subject."],
    },
    words: {
      answer: "Telling someone your plan can make it feel more real, and easier to follow through.",
      scripts: [
        "I'm going to do half an hour of revision after dinner. Can you check I've done it?",
        "Want to study together for an hour this week? I work better with someone else there.",
      ],
      nextMove: "Send one of these to a friend or someone at home today.",
      followUps: ["I start but give up quickly.", "How do I make it a habit?"],
    },
    extras: [
      {
        match: /\bdon'?t care\b|\bboring\b|\bhate (the |this )?subject\b|\bwhy (it|this) matters\b/i,
        reply: {
          answer:
            "Then connect it to something you do care about: the grade, what it lets you do next, or simply getting it done so it stops hanging over you.",
          nextMove: "Write one line on why this subject matters to you right now, and keep it where you study.",
          followUps: ["I start but give up quickly.", "How do I make it a habit?"],
        },
      },
      {
        match: /\bgive up\b|\bgiving up\b|\bquickly\b|\bdon'?t finish\b|\bkeep stopping\b/i,
        reply: {
          answer:
            "Then aim smaller and finish more often. A short session you complete builds more momentum than a long one you abandon.",
          nextMove: "Next time, choose a stopping point in advance, like the end of one section, and stop there.",
          followUps: ["I don't care about the subject.", "How do I make it a habit?"],
        },
      },
      {
        match: /\bhabit\b|\broutine\b|\bevery day\b|\bconsistent/i,
        reply: {
          answer:
            "Tie it to something you already do every day, like straight after dinner, and keep the first sessions short so they're easy to repeat.",
          nextMove: "Pick your cue, like \"after dinner\", and do ten minutes straight after it for the next few days.",
          followUps: ["I start but give up quickly.", "I don't care about the subject."],
        },
      },
    ],
  },
  {
    id: "application-essay",
    example: "I have to write a personal statement about myself and I have no idea what to say.",
    keywords: [
      /\bpersonal statement\b/i,
      /\b(application|college|uni|university|scholarship|admissions?) (essay|letter|form|statement)s?\b|\bcover letter\b|\bmotivation letter\b/i,
      /\b(college|uni|university|job|scholarship) applications?\b/i,
      /\b(write|writing|say) about myself\b|\bno idea what to (say|write)\b|\bdon'?t know what to write\b/i,
    ],
    related: [/\b(college|university|uni|application|applying|scholarship|job)\b/i, /\bessay\b/i],
    initial: initial({
      answer:
        "Don't start by writing; start by collecting. List things you've done, enjoyed or learned from, then pick the two or three that best show what they're looking for.",
      points: [
        "Look at what the application asks for, and underline the key qualities.",
        "For each point, give a real example, not just a claim.",
        "Write a rough version first; a messy first draft is normal.",
      ],
      nextMove:
        "Today, spend a short time listing everything you've done at school, in activities, at work or at home, without judging any of it.",
      alternative: "If you're stuck, ask a friend or family member what they'd say you're good at; they may think of things you wouldn't.",
      followUps: ["I haven't done anything impressive.", "How do I start the first sentence?", "How do I avoid sounding like I'm bragging?"],
      title: "Writing about yourself",
    }),
    direct: {
      answer: "Pick three specific things you've done, and build the statement around them.",
      nextMove: "Choose your three examples today.",
      followUps: ["I haven't done anything impressive.", "How do I start the first sentence?"],
    },
    firstStep: {
      answer: "First, read exactly what the application asks for, so you know what to show.",
      nextMove: "Underline the qualities or questions it mentions.",
      followUps: ["I haven't done anything impressive.", "How do I avoid sounding like I'm bragging?"],
    },
    words: {
      answer: "Asking someone who knows you well can turn up good examples.",
      scripts: [
        "I'm writing a personal statement. What would you say I'm good at, and can you think of an example?",
        "Could you read my draft and tell me which part sounds most like me?",
      ],
      nextMove: "Ask one person this week.",
      followUps: ["I haven't done anything impressive.", "How do I start the first sentence?"],
    },
    extras: [
      {
        match: /\bimpressive\b|\bnothing special\b|\bhaven'?t done (anything|much)\b|\bboring\b|\bordinary\b/i,
        reply: {
          answer:
            "It doesn't need to be impressive; it needs to be specific. A part-time job, looking after siblings or a project you finished can show a lot, if you say what you did and learned.",
          nextMove: "Pick one ordinary thing you've done, and write what you did and what it taught you.",
          followUps: ["How do I start the first sentence?", "How do I avoid sounding like I'm bragging?"],
        },
      },
      {
        match: /\bfirst (sentence|line)\b|\bopening\b|\bintro/i,
        reply: {
          answer:
            "Don't write the opening first. Write the middle, then come back and open with something specific about you, not a general quote.",
          nextMove: "Write your strongest example first; the opening will be easier after that.",
          followUps: ["I haven't done anything impressive.", "How do I avoid sounding like I'm bragging?"],
        },
      },
      {
        match: /\bbrag|\bshow(ing)? off\b|\barrogant\b|\bbig-headed\b/i,
        reply: {
          answer:
            "Describe what you did and what happened, and let that speak for itself. Facts and examples don't sound like bragging; adjectives about yourself do.",
          nextMove: "Replace any sentence like \"I am hardworking\" with an example that shows it.",
          followUps: ["I haven't done anything impressive.", "How do I start the first sentence?"],
        },
      },
    ],
  },
  {
    id: "advanced-class",
    example: "I got moved into an advanced class and I feel like I don't belong there.",
    keywords: [
      /\b(advanced|top|higher|honou?rs|gifted|accelerated|harder|ap|ib) (class|classes|set|group|level|stream|course)\b/i,
      /\b(don'?t|do not) belong\b|\bout of place\b|\bout of my depth\b/i,
      /\beveryone (else )?(here |there )?(is|seems|looks) (so |much )?(smarter|better|cleverer|ahead)\b/i,
      /\b(moved|put) (up|into) (a |an |the )?(higher|top|advanced|harder)\b/i,
    ],
    related: [/\bclass(es)?\b|\bset\b/i, /\bstupid\b|\bdumb\b|\bsmart/i],
    initial: initial({
      answer:
        "Someone decided you could manage this class, so give it a fair chance. A harder class usually feels hard at first; what matters is how you deal with the gaps.",
      points: [
        "Keep a list of what you don't understand, and ask about it each week.",
        "Compare yourself with where you were a month ago, not with others.",
        "After a few weeks, ask the teacher how you're doing.",
      ],
      nextMove: "After your next lesson, write down one thing you found hard and ask the teacher about it.",
      alternative: "If it's still not working after a fair try, it's okay to ask whether a different class would suit you better.",
      followUps: ["Everyone else seems so much smarter.", "What if I fail in this class?", "Should I ask to move back?"],
      title: "Keeping up in a harder class",
    }),
    direct: {
      answer: "Stay, ask questions, and judge it after a few weeks, not a few lessons.",
      nextMove: "Ask your first question in the next lesson.",
      followUps: ["Should I ask to move back?", "What if I fail in this class?"],
    },
    firstStep: {
      answer: "First, pin down the specific things that feel hard, rather than the general feeling of not belonging.",
      nextMove: "List the two topics from this week that you found hardest.",
      followUps: ["Everyone else seems so much smarter.", "What if I fail in this class?"],
    },
    words: {
      answer: "Talking to the teacher early shows you're serious about it.",
      scripts: ["I'm finding the pace hard in this class. What would you suggest I focus on?", "How do you think I'm doing so far?"],
      nextMove: "Ask after class this week.",
      followUps: ["Should I ask to move back?", "Everyone else seems so much smarter."],
    },
    extras: [
      {
        match: /\bsmarter\b|\bbetter than me\b|\beveryone else\b|\bcompar/i,
        reply: {
          answer: "You only see what others show in class, not what they find hard. Measure yourself against last month, not against them.",
          nextMove: "Write down one thing you understand now that you didn't a month ago.",
          followUps: ["What if I fail in this class?", "Should I ask to move back?"],
        },
      },
      {
        match: /\bfail\b|\bfall(ing)? behind\b|\bbad grades?\b/i,
        reply: {
          answer:
            "Then you'll know it needs a different plan, but you're a long way from that now. Ask for help early instead of waiting for a bad result.",
          nextMove: "Ask the teacher this week how you're doing so far.",
          followUps: ["Everyone else seems so much smarter.", "Should I ask to move back?"],
        },
      },
      {
        match: /\bmove back\b|\bswitch\b|\bdrop (down|out)\b|\bleave (the|this) class\b/i,
        reply: {
          answer:
            "Not yet. Give it a fair try, a few weeks at least, and ask for help while you do. If it still isn't working, then have that conversation.",
          nextMove: "Set a date a few weeks from now to decide, and ask for help until then.",
          followUps: ["Everyone else seems so much smarter.", "What if I fail in this class?"],
        },
      },
    ],
  },
  {
    id: "same-day-deadlines",
    example: "I have three assignments due on the same day and I don't know which one to do first.",
    keywords: [
      /\b(two|three|four|five|several|multiple|many|lots of|\d+) (assignments|essays|projects|deadlines|pieces of (work|homework))\b/i,
      /\b(due )?(on )?the same (day|date)\b|\bsame deadline\b|\ball due\b/i,
      /\bdeadlines\b/i,
      /\bwhich (one )?(to do|should i do|should i start|to start) first\b/i,
    ],
    related: [/\b(assignments?|essays?|projects?|homework|coursework)\b/i, /\bwhich one\b/i],
    initial: initial({
      answer:
        "Rank them by size and how much they count, start the biggest or least clear one first, and get a rough version of each done before polishing any.",
      points: [
        "Estimate how long each will really take.",
        "Start with the biggest or most confusing one.",
        "Get a rough version of all three before polishing.",
        "If one is impossible in time, ask about an extension now.",
      ],
      nextMove: "Today, write down each assignment with a time estimate, and block out when you'll work on each.",
      followUps: ["They're all the same size.", "One is worth more marks.", "I don't have time for all three."],
      title: "Juggling deadlines on the same day",
    }),
    direct: {
      answer: "Start the biggest one today, and don't leave any of them untouched until the last day.",
      nextMove: "Do a first session on the biggest assignment today.",
      followUps: ["They're all the same size.", "I don't have time for all three."],
    },
    firstStep: {
      answer: "First, estimate how long each one will really take; that shows whether the plan can work at all.",
      nextMove: "Write each assignment and your time estimate down now.",
      followUps: ["One is worth more marks.", "I don't have time for all three."],
    },
    words: {
      answer: "If you need more time on one, ask early and be specific.",
      scripts: [
        "I have three assignments due on the same day. Would it be possible to hand this one in a day or two later?",
        "I've planned my time for all three, but this one needs more. Could I have until [date]?",
      ],
      nextMove: "Ask about the one you're least likely to finish well, today.",
      followUps: ["They're all the same size.", "One is worth more marks."],
    },
    extras: [
      {
        match: /\bsame size\b|\ball (the )?same\b|\ball equal\b/i,
        reply: {
          answer: "Then start with the one you understand least. Finding problems early leaves time to ask questions.",
          nextMove: "Open the least clear one today, and write down what you still need to find out.",
          followUps: ["One is worth more marks.", "I don't have time for all three."],
        },
      },
      {
        match: /\bworth more\b|\bmore marks\b|\bweight(ed|ing)?\b|\bcounts? (for )?more\b/i,
        reply: {
          answer:
            "Then give it the most time and your best hours, but don't drop the others; a rough version of each can still earn marks.",
          nextMove: "Schedule the heavier one first, with shorter sessions for the others in between.",
          followUps: ["They're all the same size.", "I don't have time for all three."],
        },
      },
      {
        match: /\bdon'?t have (enough )?time\b|\bnot enough time\b|\bcan'?t (do|finish) (them )?all\b|\bno time\b/i,
        reply: {
          answer:
            "Then ask for an extension on one now, before the deadline, and focus on doing the other two properly. Asking early is usually easier than explaining late.",
          scripts: ["I have three assignments due on the same day, and I can't do them all well. Would a short extension on this one be possible?"],
          nextMove: "Decide which one to ask about, and send the request today.",
          followUps: ["They're all the same size.", "One is worth more marks."],
        },
      },
    ],
  },
];
