import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ChatMessage, LifeResponse } from "../shared/contract.ts";
import { CRISIS_RESPONSE, GENERAL_SCENARIO, SCENARIOS, composeReply, type DemoScenario } from "./demo/content.ts";
import { buildDemoResponse, matchScenario } from "./demo/engine.ts";

// The situations demo mode started with, in their original order. Everything after them was added later.
const ORIGINAL_IDS = ["career", "friend", "conversation", "two-options", "bad-decision", "expectations", "apology", "stuck"];
const added = SCENARIOS.filter((scenario) => !ORIGINAL_IDS.includes(scenario.id));

function byId(id: string): DemoScenario {
  const scenario = SCENARIOS.find((candidate) => candidate.id === id);
  assert.ok(scenario, id);
  return scenario;
}

function conversation(...turns: string[]): ChatMessage[] {
  const messages: ChatMessage[] = [];
  for (const text of turns) {
    if (messages.length) messages.push({ role: "assistant", content: buildDemoResponse(messages) });
    messages.push({ role: "user", content: text });
  }
  return messages;
}

/** Every answer a scenario can give, labelled. */
function repliesOf(scenario: DemoScenario): Array<[string, LifeResponse]> {
  const { title } = scenario.initial;
  return [
    [`${scenario.id} initial`, scenario.initial],
    ...(scenario.asked ? [[`${scenario.id} asked`, { ...scenario.initial, answer: scenario.asked.answer }] as [string, LifeResponse]] : []),
    [`${scenario.id} direct`, composeReply(scenario.direct, title)],
    [`${scenario.id} first step`, composeReply(scenario.firstStep, title)],
    [`${scenario.id} words`, composeReply(scenario.words, title)],
    ...scenario.extras.map((extra, i): [string, LifeResponse] => [`${scenario.id} extra ${i}`, composeReply(extra.reply, title)]),
  ];
}

const wordsIn = (...texts: string[]) => texts.join(" ").split(/\s+/).filter(Boolean).length;
const duplicatesIn = (values: string[]) => values.filter((value, i) => values.indexOf(value) !== i);

// Other ways people might describe each situation, from full sentences to short, casual ones.
const REPHRASINGS: Record<string, string[]> = {
  career: ["What should I study at university?", "I have no idea what to do with my life career-wise.", "what should I do with my life"],
  friend: ["my friend is ignoring me", "My best friend left me on read for two days."],
  conversation: [
    "How do I bring this up with my roommate?",
    "I need to have a serious talk with my dad.",
    "I need to have a hard conversation with my dad",
  ],
  "two-options": [
    "I got two job offers and I can't pick one.",
    "Should I choose between the two universities I got into?",
    "I have two job offers",
  ],
  "bad-decision": ["I think I made a big mistake.", "I regret a choice I made last week.", "I regret my decision"],
  expectations: [
    "My parents want me to be a doctor but I want to do art.",
    "I feel so much pressure to meet everyone's expectations.",
    "my parents expect too much from me",
  ],
  apology: ["How do I say sorry to my friend?", "I want to apologise to my sister for what I said.", "how do I apologise"],
  stuck: ["I feel stuck and don't know where to begin.", "Everything feels overwhelming and I don't know where to start.", "I feel stuck"],
  "presentation-nerves": [
    "I have to give a speech tomorrow and I'm scared I'll forget my lines.",
    "how do i prepare for my class presentation tonight",
  ],
  "exam-cram": [
    "my test is tomorrow and I haven't studied at all",
    "Exam in 2 days and I barely started revising, help.",
    "I have an exam tomorrow",
    "exam tomorrow and I haven't studied",
  ],
  "exam-week": [
    "I have three exams next week. How should I plan my revision?",
    "How do I make a revision timetable for all my exams?",
    "how do I revise for all my exams",
    "I have 5 exams next week",
  ],
  "mind-blank": [
    "Whenever I sit an exam my mind goes blank, even though I know the stuff.",
    "I freeze in tests and forget everything I studied.",
    "my mind goes blank in exams",
    "I panic during tests",
  ],
  "bad-grade": [
    "I studied really hard but still got a bad mark on my maths test.",
    "I got a low score on my exam and I don't know what went wrong.",
    "I got a bad grade",
    "I got a bad mark on my test",
    "I failed my test",
  ],
  "tell-parents-grade": [
    "I failed my exam. How do I tell my mum?",
    "How do I tell my parents I failed maths?",
    "how do I tell my parents I failed",
  ],
  "essay-avoidance": [
    "I keep putting off my essay and it's due soon.",
    "I can't get myself to start my assignment.",
    "I can't start my essay",
    "I keep avoiding my coursework",
  ],
  extension: [
    "Can I ask for an extension on my essay?",
    "I'm going to miss the deadline for my project.",
    "can I get an extension?",
    "I need more time for my assignment",
  ],
  "deadline-tonight": [
    "My essay is due tonight and I'm only half done.",
    "I have a few hours left and my assignment isn't finished.",
    "my essay is due in 3 hours",
  ],
  "forgot-homework": ["I didn't do my homework and I have class soon.", "forgot my homework, what do I do", "I forgot my homework"],
  "lost-in-class": [
    "I'm falling behind in physics and I'm too shy to ask the teacher.",
    "I don't understand anything in chemistry class anymore.",
    "I don't understand maths",
    "I'm falling behind in class",
  ],
  "group-slacker": [
    "One person in my group project isn't doing any work.",
    "I'm doing all the work in our group assignment.",
    "my group isn't helping with the project",
    "my project partner does nothing",
  ],
  "group-disagree": [
    "Our group keeps arguing about which topic to pick for the project.",
    "We can't agree on an idea for our group presentation.",
    "my group keeps arguing",
  ],
  "study-focus": [
    "I can't focus when I'm revising, my mind keeps drifting.",
    "How do I concentrate better when I study?",
    "I can't focus when I study",
    "how do I study better",
    "I can't concentrate",
    "I get distracted so easily",
  ],
  "phone-distraction": [
    "I can't focus on homework because I keep checking my phone.",
    "How do I stop scrolling TikTok when I'm supposed to be revising?",
    "I can't stop checking my phone while studying",
  ],
  "choosing-subjects": [
    "Which subjects should I pick for next year?",
    "I don't know which electives to choose.",
    "what subjects should I take",
  ],
  "unfair-mark": [
    "My teacher gave me an unfair grade on my project.",
    "I think my test was graded unfairly.",
    "my teacher marked me unfairly",
  ],
  "copy-homework": [
    "My friend always wants to copy my answers.",
    "How do I tell my classmate to stop copying my homework?",
    "someone wants to copy my homework",
  ],
  "new-school": [
    "I'm moving to a new school and I'm nervous about not knowing anyone.",
    "How do I make friends at a new school on the first day?",
    "first day at a new school tomorrow",
  ],
  "speak-up-class": [
    "I'm too shy to answer questions in class.",
    "How do I get more confident speaking up in lessons?",
    "I'm too shy to talk in class",
  ],
  "missed-school": [
    "I was absent for two weeks and I'm behind on everything.",
    "How do I catch up after missing a lot of classes?",
    "I missed a lot of school",
  ],
  "study-plan-fail": [
    "I make a study timetable every week but never stick to it.",
    "How do I actually stick to my revision plan?",
    "I can't stick to my study plan",
  ],
  motivation: [
    "I've lost all motivation for school this term.",
    "How do I get motivated to do my homework?",
    "I have no motivation",
    "How do I get motivated to study?",
  ],
  "application-essay": [
    "I don't know what to write in my college application essay.",
    "How do I write a personal statement?",
    "how do I write a personal statement",
  ],
  "advanced-class": [
    "I got put in the top set and everyone seems smarter than me.",
    "I feel like I don't belong in my honours class.",
    "I feel stupid in my advanced class",
  ],
  "same-day-deadlines": [
    "I have two essays and a project all due on the same day.",
    "I have multiple deadlines on the same day. What should I do first?",
    "I have 3 deadlines on the same day",
  ],
  "friend-mad": [
    "Is my best friend mad at me? She's been acting weird.",
    "I think my friend is annoyed with me but I don't know why.",
    "is my friend mad at me",
    "my friend is acting distant",
  ],
  "left-out": [
    "My friends went to the cinema without me.",
    "I wasn't invited to my friend's party and everyone else was.",
    "I got left out",
    "my friends didn't invite me",
  ],
  "make-friends": [
    "I don't have many friends. How do I meet new people?",
    "How do I make friends when I'm shy?",
    "how do I make friends",
    "I have no friends",
  ],
  "caught-between": [
    "My two best friends had a fight and I'm caught in the middle.",
    "Both of my friends want me to pick a side.",
    "my friends are fighting",
  ],
  "money-back": ["How do I ask my friend to pay me back?", "My friend owes me money and keeps forgetting.", "my friend owes me money"],
  "hard-to-say-no": [
    "I can never say no when people ask me for things.",
    "How do I stop being a people pleaser?",
    "I can't say no to people",
  ],
  "joke-misread": ["I think my joke offended my friend.", "Someone misunderstood my joke in the group chat.", "my joke offended someone"],
  "cancels-plans": [
    "My friend always cancels on me last minute.",
    "My friend is so flaky and keeps bailing on our plans.",
    "my friend always cancels plans",
  ],
  "support-friend": [
    "How do I support my friend whose parents are getting divorced?",
    "My friend is having a tough time and I want to help.",
    "my friend is going through a breakup",
    "how do I help a friend who is sad",
  ],
  "invite-hangout": [
    "How do I ask someone to hang out without it being weird?",
    "I want to invite a classmate to the movies but I'm nervous.",
    "how do I ask someone to hang out",
  ],
  "party-decline": [
    "How do I politely decline an invitation?",
    "I don't want to go to my friend's party. How do I say no?",
    "I don't want to go to the party",
  ],
  "embarrassed-class": [
    "I embarrassed myself in front of everyone at school.",
    "I did something so cringe in class today.",
    "I embarrassed myself",
  ],
  "sibling-things": [
    "My sister keeps taking my clothes.",
    "My little brother always uses my stuff without asking.",
    "my brother keeps taking my stuff",
  ],
  "stay-out-later": [
    "How do I convince my parents to extend my curfew?",
    "I want to ask my mum if I can stay out later.",
    "my parents won't let me stay out late",
    "my parents are too strict",
  ],
  "chores-unfair": [
    "I always have to do the dishes and my brother never does.",
    "Why do I have to do all the chores at home?",
    "I do all the chores",
  ],
  "compared-sibling": [
    "My mum always compares me to my brother.",
    "My parents keep asking why I can't be more like my sister.",
    "my parents compare me to my sister",
  ],
  "honest-feedback": [
    "My friend wants my opinion on her drawing but I don't like it.",
    "How do I give honest feedback without hurting someone?",
    "my friend asked for my honest opinion",
  ],
  "mean-comment": [
    "Someone posted a rude comment on my photo.",
    "I got hate comments on my video.",
    "someone left a mean comment on my post",
  ],
  "talking-behind": [
    "I found out my friends are gossiping about me.",
    "There's a rumour going around about me at school.",
    "people are talking behind my back",
  ],
  "double-booked": [
    "I double booked myself this weekend.",
    "I made plans with two friends for the same night by accident.",
    "I double booked",
  ],
  "forgot-birthday": [
    "I forgot my mum's birthday.",
    "My best friend's birthday was yesterday and I forgot.",
    "I forgot my friend's birthday",
  ],
  "late-reply": [
    "I haven't replied to my friend's text in weeks and now it's awkward.",
    "I left my friend on read for ages. What do I say now?",
    "I forgot to reply to my friend",
  ],
  reconnect: [
    "How do I get back in touch with a friend I lost touch with?",
    "I haven't spoken to my childhood friend in years.",
    "I want to talk to an old friend again",
  ],
  crush: ["I have a crush on someone. Should I tell them?", "How do I know if the person I like likes me back?", "I have a crush"],
  interrupted: [
    "People keep interrupting me in meetings.",
    "My classmate always cuts me off when I'm talking.",
    "people keep interrupting me",
  ],
  "teasing-bystander": [
    "A kid in my class is being bullied. Should I do something?",
    "How do I stand up for someone who's being picked on?",
    "someone in my class is getting bullied",
  ],
  "being-bullied": [
    "I'm being bullied at school and I don't know what to do.",
    "People in my class keep making fun of me.",
    "I'm being bullied",
    "they keep making fun of me at school",
  ],
  "wrong-person-message": [
    "I sent a text to the wrong person by mistake.",
    "I accidentally sent something embarrassing to the wrong group chat.",
    "I texted the wrong person",
  ],
  "forgot-name": [
    "I forgot the name of someone I met last week.",
    "How do I ask someone their name again without it being awkward?",
    "I forgot someone's name",
  ],
  "roommate-mess": ["My flatmate leaves dirty dishes everywhere.", "How do I ask my housemate to clean up?", "my roommate is messy"],
  homesick: ["I miss my family so much since I moved away for college.", "How do I stop feeling homesick at uni?", "I'm homesick"],
  "moving-away": [
    "We're moving to another country and I'll have to leave all my friends.",
    "I'm moving house next month and I'm sad about leaving my friends.",
    "we're moving and I'll miss my friends",
  ],
  "job-interview": [
    "I have my first interview tomorrow and I'm nervous.",
    "What should I prepare for a job interview?",
    "I have a job interview tomorrow",
  ],
  "part-time-balance": [
    "My weekend job is making my grades drop.",
    "I work too many shifts and can't keep up with school.",
    "my job is hurting my grades",
  ],
  "day-off": ["How do I ask my boss for time off?", "I need to request a day off work next week.", "how do I ask for a day off"],
  "work-mistake": [
    "I messed up at work and I'm scared to tell my boss.",
    "Should I tell my manager I made an error at work?",
    "I made a mistake at work",
  ],
  "too-much-work": [
    "My boss keeps piling more tasks on me.",
    "My workload is too much and I can't keep up.",
    "my boss gives me too much work",
  ],
  "idea-credit": [
    "My colleague took credit for my work.",
    "Someone stole my idea and presented it as theirs.",
    "my coworker took credit for my idea",
  ],
  "quit-job": ["Should I quit my job?", "I'm thinking about handing in my notice.", "should I quit my job"],
  "harsh-feedback": [
    "My manager criticised my work in front of everyone.",
    "I got really negative feedback and I feel awful.",
    "I got harsh feedback",
  ],
  "email-no-reply": [
    "My teacher hasn't replied to my email.",
    "How do I follow up on an email with no response?",
    "no one replied to my email",
  ],
  overcommitted: [
    "I signed up for too many clubs and I'm exhausted.",
    "I've taken on too much and can't keep up.",
    "I'm doing too many things",
  ],
  "late-important": [
    "I missed my bus and I'm going to be late for my appointment.",
    "Running late for a meeting. What do I say?",
    "I'm going to be late",
  ],
  "gap-year": ["Is taking a year off before college a good idea?", "Should I do a gap year?", "should I take a gap year"],
  "quit-hobby": [
    "I've done dance for eight years but I don't love it anymore.",
    "Should I quit football? I've lost interest.",
    "should I quit piano",
  ],
  "big-purchase": [
    "Is it worth spending all my savings on a gaming console?",
    "Should I buy an expensive laptop with my savings?",
    "should I buy a new phone",
  ],
  "summer-plans": [
    "What should I do over the summer holidays?",
    "I'm bored and have nothing planned for my summer vacation.",
    "I'm bored this summer",
  ],
  "even-list": [
    "My pros and cons list is a tie.",
    "I did a pros and cons list and both options came out equal.",
    "my pros and cons are even",
  ],
  "back-out": [
    "I promised to help my friend move but I want to back out.",
    "How do I get out of something I already agreed to?",
    "I want to back out of something",
  ],
  "surprise-party": [
    "I'm planning a surprise party and it's getting stressful.",
    "How do I organise a surprise birthday for my best friend?",
    "I'm planning a surprise party",
  ],
  "money-runs-out": [
    "I'm always broke by the end of the month.",
    "How do I make a budget so I don't run out of money?",
    "I'm always out of money",
  ],
  "exercise-habit": [
    "How do I stick to going to the gym?",
    "I keep quitting my workout routine after a few days.",
    "I can't stick to exercising",
  ],
  "screen-time": ["How do I reduce my screen time?", "I'm spending too much time on my phone scrolling.", "I'm on my phone too much"],
  "always-late": ["I'm late to school every morning.", "How do I stop oversleeping and being late?", "I'm always late"],
  "messy-room": ["How do I clean my super messy bedroom?", "My desk is a mess and I can't find anything.", "my room is a mess"],
  "learn-to-code": [
    "What's the best way to start learning programming?",
    "I want to learn Python but I don't know where to begin.",
    "I want to learn coding",
  ],
  "waiting-news": [
    "I'm waiting for my exam results and I can't stop worrying.",
    "Still waiting to hear back from the college I applied to.",
    "I'm waiting for results",
  ],
  "didnt-make-team": [
    "I didn't get picked for the football team.",
    "I auditioned for the school play and didn't get a part.",
    "I didn't make the team",
  ],
  "plans-cancelled": [
    "The concert I was excited about got cancelled.",
    "Our holiday fell through and I'm really disappointed.",
    "my trip got cancelled",
  ],
  comparing: ["Everyone else seems so far ahead of me.", "I keep comparing myself to other people my age.", "everyone is ahead of me"],
  confidence: ["How do I become more confident?", "I have really low self-esteem and want to change that.", "I'm so shy"],
  "ask-for-help": [
    "How do I ask for help without feeling like a burden?",
    "I find it hard to ask people for help.",
    "I hate asking for help",
  ],
  procrastination: ["How do I stop procrastinating?", "I leave everything until the last minute.", "I procrastinate a lot"],
  "todo-list": [
    "I have so much to do and don't know where to start.",
    "How do I prioritise my tasks?",
    "I have too much to do",
    "I have too much homework",
  ],
  "lost-wallet": ["I lost my purse on the bus.", "I can't find my wallet anywhere. I think it's gone.", "I lost my wallet"],
  "decide-by-tomorrow": [
    "I need to make an important decision today and I'm panicking.",
    "I have a big choice to make by tomorrow.",
    "I have a big decision to make",
  ],
  "something-happened": [
    "Something happened between me and my friend and I don't know how to fix it.",
    "Something happened at school today and I don't know what to do.",
    "something happened",
  ],
  "should-i-tell": ["Should I tell my friend the truth?", "Should I tell her or keep it a secret?", "should I tell her"],
  perfectionism: [
    "I'm a perfectionist and it takes me forever to finish anything.",
    "I keep rewriting my essay because it's never good enough.",
    "I keep redoing my work",
  ],
  "siblings-duty": [
    "I have to babysit my little brother every day and have no time to study.",
    "Looking after my sisters means I can't do my homework.",
    "I have to look after my siblings",
  ],
};

describe("demo situations", () => {
  it("has about a hundred situations, with the original ones first", () => {
    assert.ok(SCENARIOS.length >= 95 && SCENARIOS.length <= 110, `${SCENARIOS.length} situations`);
    assert.deepEqual(
      SCENARIOS.slice(0, ORIGINAL_IDS.length).map((scenario) => scenario.id),
      ORIGINAL_IDS,
    );
  });

  it("gives every situation an id, an example message, keywords, a title and a way forward", () => {
    for (const scenario of [...SCENARIOS, GENERAL_SCENARIO]) {
      const { id, example, initial } = scenario;
      assert.match(id, /^[a-z]+(-[a-z]+)*$/, id);
      assert.ok(example === example.trim() && wordsIn(example) >= 4, `${id}: example "${example}"`);
      assert.ok(scenario.keywords.length > 0 || scenario === GENERAL_SCENARIO, `${id}: keywords`);
      assert.ok(initial.title, `${id}: title`);
      for (const [label, reply] of repliesOf(scenario)) {
        assert.ok(reply.answer, `${label}: an answer`);
        assert.ok(reply.nextMove || reply.question, `${label}: a next move, or a question when the advice depends on it`);
      }
    }
    for (const scenario of added) {
      const titleWords = wordsIn(scenario.initial.title);
      assert.ok(titleWords >= 3 && titleWords <= 6, `${scenario.id}: title "${scenario.initial.title}"`);
      for (const [label, reply] of repliesOf(scenario)) {
        for (const followUp of reply.followUps) assert.ok(wordsIn(followUp) <= 8, `${label}: "${followUp}"`);
        for (const point of reply.points) assert.ok(wordsIn(point) <= 16, `${label}: "${point}"`);
      }
    }
  });

  it("keeps ids, titles, example messages and rephrasings unique", () => {
    const every = [...SCENARIOS, GENERAL_SCENARIO];
    const normalised = (text: string) => text.toLowerCase().replace(/\s+/g, " ");
    assert.deepEqual(duplicatesIn(every.map((scenario) => scenario.id)), []);
    // A follow-up finds its situation by the title of the answer before it, so titles must be unique too.
    assert.deepEqual(duplicatesIn(every.map((scenario) => scenario.initial.title)), []);
    assert.deepEqual(duplicatesIn(every.map((scenario) => normalised(scenario.example))), []);
    assert.deepEqual(duplicatesIn([...every.map((scenario) => scenario.example), ...Object.values(REPHRASINGS).flat()].map(normalised)), []);
  });

  it("reaches every situation from its example message, with that situation's first answer", () => {
    for (const scenario of SCENARIOS) {
      assert.equal(matchScenario(scenario.example)?.id, scenario.id, scenario.example);
      const response = buildDemoResponse(conversation(scenario.example));
      assert.equal(response.title, scenario.initial.title, scenario.example);
      assert.ok([scenario.initial.answer, scenario.asked?.answer].includes(response.answer), scenario.example);
      assert.equal(response.nextMove, scenario.initial.nextMove, scenario.example);
    }
  });

  it("reaches every situation from other ways of describing it", () => {
    assert.deepEqual(
      SCENARIOS.filter((scenario) => !REPHRASINGS[scenario.id]?.length).map((scenario) => scenario.id),
      [],
      "every situation has rephrasings",
    );
    for (const [id, texts] of Object.entries(REPHRASINGS)) {
      for (const text of texts) assert.equal(matchScenario(text)?.id, id, text);
    }
  });

  it("answers the follow-ups each added situation suggests with its own replies, without leaving it", () => {
    for (const scenario of added) {
      const own = repliesOf(scenario).map(([, reply]) => reply.answer);
      const offered = new Set<number>();
      for (const [label, reply] of repliesOf(scenario)) {
        for (const followUp of reply.followUps) {
          const next = buildDemoResponse(conversation(scenario.example, followUp));
          assert.equal(next.title, scenario.initial.title, `${label}: "${followUp}" left the situation`);
          assert.ok(own.includes(next.answer), `${label}: "${followUp}" got a generic reply`);
          assert.notEqual(next.answer, reply.answer, `${label}: "${followUp}" repeats the reply that offered it`);
          const extra = scenario.extras.findIndex((candidate) => candidate.reply.answer === next.answer);
          if (extra >= 0) offered.add(extra);
        }
      }
      assert.equal(offered.size, scenario.extras.length, `${scenario.id}: every situation-specific reply is offered as a follow-up`);
    }
  });

  it("stays with the situation being answered, even when a follow-up sounds like another one", () => {
    const presentation = byId("presentation-nerves");
    const followUp = "What if my mind goes blank?";
    assert.ok(presentation.initial.followUps.includes(followUp));
    assert.equal(matchScenario(followUp)?.id, "mind-blank", "on its own, it describes a different situation");
    assert.equal(buildDemoResponse(conversation(presentation.example, followUp)).title, presentation.initial.title);
  });

  it("moves from the general answer to a situation once the person says what it's about", () => {
    const vague = GENERAL_SCENARIO.example;
    assert.equal(buildDemoResponse(conversation(vague)).title, GENERAL_SCENARIO.initial.title);
    const specific = "It's really that I have an exam tomorrow and I haven't revised.";
    assert.deepEqual(buildDemoResponse(conversation(vague, specific)), byId("exam-cram").initial);
    // The general answer's own suggestions still get general help.
    for (const followUp of GENERAL_SCENARIO.initial.followUps) {
      assert.equal(buildDemoResponse(conversation(vague, followUp)).title, GENERAL_SCENARIO.initial.title, followUp);
    }
  });

  it("lets broad words like friend, parents or birthday strengthen a closer match, but never pick a situation alone", () => {
    for (const text of ["My parents are coming to visit this weekend.", "I spent all my birthday money already.", "I don't want to go to school."]) {
      assert.equal(matchScenario(text), null, text);
    }
    assert.equal(matchScenario("My friend is ignoring me.")?.id, "friend");
    assert.equal(matchScenario("Is my friend mad at me?")?.id, "friend-mad");
    assert.equal(matchScenario("I forgot my friend's birthday.")?.id, "forgot-birthday");
  });

  it("puts safety first, whatever everyday situation the message also mentions", () => {
    for (const text of ["I failed my exam and I want to die.", "People at school keep picking on me and I want to kill myself."]) {
      const response = buildDemoResponse(conversation(text));
      assert.equal(response.title, CRISIS_RESPONSE.title, text);
      assert.match(response.care, /988/);
    }
    for (const scenario of added) {
      const later = buildDemoResponse(conversation(scenario.example, "I don't want to live anymore."));
      assert.equal(later.title, CRISIS_RESPONSE.title, scenario.id);
    }
  });

  it("doesn't turn a harmful or unrelated message into an everyday situation", () => {
    for (const text of ["I want to hurt someone.", "I hurt my back at work.", "Something weird happened at the bakery today and I'm unsure."]) {
      assert.equal(matchScenario(text), null, text);
    }
    // Asked how to get back at someone, it points to safer help instead.
    assert.match(buildDemoResponse(conversation("How do I get back at someone who bullied me?")).answer, /usually makes things worse/);
  });

  it("still gives the answer the Gemini fallback serves", () => {
    // server/fallback.test.ts serves the demo answer to this message when Gemini is unavailable.
    assert.deepEqual(buildDemoResponse(conversation("I got two job offers and I can't pick one.")), byId("two-options").initial);
  });
});
