import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ChatMessage, LifeResponse, StreamEvent } from "../shared/contract.ts";
import { readConfig } from "./config.ts";
import { buildDemoResponse } from "./demo/engine.ts";
import { createProvider, handleLifeRequest } from "./handler.ts";
import { SYSTEM_PROMPT } from "./prompt.ts";
import { createDemoProvider } from "./providers/demo.ts";
import { withFallback } from "./providers/fallback.ts";
import { createGeminiProvider, type GeminiProviderOptions } from "./providers/gemini.ts";
import type { LifeProvider } from "./providers/types.ts";
import { referenceContext } from "./reference/context.ts";
import { CONCEPT_SOURCES, TOPICS } from "./reference/lexicon.ts";
import { MAX_MATCHES, normalize, retrieve } from "./reference/match.ts";
import { REFERENCE_CATEGORIES, REFERENCE_SITUATIONS } from "./reference/situations.ts";
import { readEvents, sampleResponse } from "./test-helpers.ts";

/** The situation with this number in the Word document. */
const numbered = (number: number) => {
  const situation = REFERENCE_SITUATIONS[number - 1];
  assert.equal(situation.number, number);
  return situation;
};

const asked = (content: string): ChatMessage => ({ role: "user", content });
const answered = (title: string): ChatMessage => ({ role: "assistant", content: sampleResponse({ title }) });

/** A conversation: the person's messages, each answered (but the last). */
function conversation(...turns: string[]): ChatMessage[] {
  return turns.flatMap((text, i) => (i === 0 ? [asked(text)] : [answered("Earlier answer"), asked(text)]));
}

const matchedNumbers = (messages: ChatMessage[]) => retrieve(messages).map((match) => match.situation.number);

// ---------------------------------------------------------------------------------------------------------

describe("The reference dataset", () => {
  it("has all 500 situations, in 25 categories of 20, numbered as in the document", () => {
    assert.equal(REFERENCE_SITUATIONS.length, 500);
    assert.equal(REFERENCE_CATEGORIES.length, 25);
    assert.deepEqual(
      REFERENCE_SITUATIONS.map((situation) => situation.number),
      Array.from({ length: 500 }, (_, i) => i + 1),
    );
    for (const category of REFERENCE_CATEGORIES) {
      const inCategory = REFERENCE_SITUATIONS.filter((situation) => situation.category === category);
      assert.equal(inCategory.length, 20, category.name);
    }
  });

  it("keeps the document's categories, in order", () => {
    assert.deepEqual(
      REFERENCE_CATEGORIES.map((category) => category.name),
      [
        "School & Classes", "Exams & Test Pressure", "JEE & Competitive Preparation", "Friends & Social Situations",
        "Family & Home", "Communication & Awkward Conversations", "Confidence & Self-Doubt", "Motivation & Procrastination",
        "Time Management & Routines", "Career & Future Decisions", "Group Projects & Teamwork", "Digital Life & Social Media",
        "Money & Spending", "Work, Internships & Responsibilities", "Conflict & Boundaries", "Wellbeing & Healthy Routines",
        "Technology & Coding Projects", "Everyday Decisions & Small Problems", "Organization & Personal Systems",
        "Learning & Skill Building", "Decision Making & Uncertainty", "Romance, Crushes & Social Feelings",
        "Creative Projects & Hobbies", "Personal Growth & Life Direction", "Practical Life Skills",
      ],
    );
  });

  it("gives every situation a stable, unique ID made of its category and place in it", () => {
    assert.equal(new Set(REFERENCE_SITUATIONS.map((situation) => situation.id)).size, 500);
    for (const situation of REFERENCE_SITUATIONS) {
      const place = String(((situation.number - 1) % 20) + 1).padStart(2, "0");
      assert.equal(situation.id, `${situation.category.id}-${place}`);
    }
    assert.equal(numbered(1).id, "school-01");
    assert.equal(numbered(61).id, "friends-01");
    assert.equal(numbered(201).id, "teamwork-01");
    assert.equal(numbered(500).id, "life-skills-20");
  });

  it("stores each situation's four follow-up questions with it", () => {
    for (const situation of REFERENCE_SITUATIONS) {
      assert.equal(situation.followUps.length, 4, situation.id);
      assert.equal(new Set(situation.followUps).size, 4, situation.id);
      assert.deepEqual(situation.followUps, situation.category.followUps, situation.id);
      for (const question of situation.followUps) assert.match(question, /^[A-Z].*\?$/, situation.id);
    }
    assert.deepEqual(numbered(61).followUps, [
      "Should I talk to them about it?",
      "What should I say?",
      "What if they react badly or do not reply?",
      "How do I know when to step back?",
    ]);
    assert.deepEqual(numbered(201).followUps, [
      "What should I say to the group?",
      "How should we divide the work?",
      "What if someone still does not cooperate?",
      "When should a teacher or coordinator be involved?",
    ]);
  });

  it("keeps the document's wording of each situation, without the question around it", () => {
    assert.equal(numbered(1).situation, "falling behind in one subject even though I attend every class");
    assert.equal(numbered(61).situation, "a friend acting distant and I cannot tell why");
    assert.equal(numbered(201).situation, "one teammate repeatedly missing their part of our project");
    assert.equal(numbered(500).situation, "wanting to solve small problems without immediately panicking");
    for (const { situation, id } of REFERENCE_SITUATIONS) {
      assert.doesNotMatch(situation, /dealing with|what should i do|[.?]$/i, id);
    }
  });
});

describe("Reference vocabulary", () => {
  it("has no empty or catch-all patterns", () => {
    for (const [name, sources] of Object.entries(CONCEPT_SOURCES)) {
      assert.ok(sources.length > 0, name);
      for (const source of Array.from(sources)) assert.ok(source, `${name} has an empty pattern`);
      const pattern = new RegExp(`(?<= )(?:${sources.join("|")})(?= )`);
      assert.equal(pattern.test(normalize("")), false, `${name} matches empty text`);
      assert.equal(pattern.test("  "), false, `${name} matches nothing at all`);
    }
  });

  it("only lists real concepts as topics", () => {
    for (const topic of TOPICS) assert.ok(topic in CONCEPT_SOURCES, topic);
  });

  it("reads contractions, shorthand and British spellings like everything else", () => {
    assert.equal(normalize("My friend doesn't reply"), normalize("my friend doesnt reply"));
    assert.equal(normalize("I can't practise"), " i cannot practice ");
    assert.equal(normalize("idk what 2 do rn"), " i do not know what 2 do right now ");
  });
});

// ---------------------------------------------------------------------------------------------------------

describe("Matching situations", () => {
  it("finds every situation when it's described the way the document puts it", () => {
    let first = 0;
    for (const situation of REFERENCE_SITUATIONS) {
      const found = matchedNumbers([asked(`I'm dealing with ${situation.situation}. What should I do?`)]);
      assert.ok(found.includes(situation.number), `${situation.id}: found ${found.join(", ") || "nothing"}`);
      if (found[0] === situation.number) first += 1;
    }
    // A handful of near-identical pairs (two "small task" situations, for example) can swap places.
    assert.ok(first >= 495, `${first} of 500 came first`);
  });

  it("returns a few matches at most, best first", () => {
    for (const text of ["my friend barely talks to me anymore", "I have two good options and keep going back and forth"]) {
      const matches = retrieve([asked(text)]);
      assert.ok(matches.length >= 1 && matches.length <= MAX_MATCHES, text);
      const scores = matches.map((match) => match.score);
      assert.deepEqual(scores, [...scores].sort((a, b) => b - a), text);
    }
  });

  it("copes with casual typing: lowercase, no punctuation, no apostrophes", () => {
    assert.ok(matchedNumbers([asked("my friend doesnt talk to me anymore idk why")]).includes(61));
    assert.ok(matchedNumbers([asked("MY TEAMMATE KEEPS MISSING THEIR PART OF OUR PROJECT!!!")]).includes(201));
  });
});

describe("Matching paraphrases and related intent", () => {
  it("understands different ways of saying a friend has gone distant", () => {
    for (const text of ["my friend has been acting distant", "my friend barely talks to me anymore", "I think my friend is avoiding me"]) {
      assert.ok(matchedNumbers([asked(text)]).includes(61), text);
    }
  });

  // [what someone might write, the situations that fit (by document number)]
  const PARAPHRASES: Array<[string, number[]]> = [
    ["our maths sir teaches so fast nobody can follow", [3, 43]],
    ["I keep forgetting my books at home", [12, 342]],
    ["in the exam hall my mind goes completely blank", [25]],
    ["my parents expect me to top the class and it's too much pressure", [37]],
    ["my coaching classes go way faster than I can keep up with", [43, 3]],
    ["my percentile dropped in the latest mock", [50]],
    ["my friend keeps bailing on our plans at the last minute", [62]],
    ["my parents keep comparing me to my cousin", [84]],
    ["my little sister keeps taking my clothes without asking", [86]],
    ["my text came across way harsher than I meant", [103]],
    ["I want to say sorry but I don't know how", [110]],
    ["public speaking terrifies me", [124]],
    ["I'm scared people will dislike me if I say no", [139]],
    ["I know exactly what to do but I keep procrastinating", [141]],
    ["I keep telling myself one more video and then I'll start", [155]],
    ["tasks always take me way longer than I expect", [162]],
    ["anything unexpected and my whole routine collapses", [179]],
    ["should I pick the high paying job or the one I'm passionate about", [187]],
    ["is AI going to make the job I want disappear", [190]],
    ["my teammate took credit for the work I did", [209]],
    ["I spend hours watching youtube shorts", [227]],
    ["how do I know if this instagram account is legit", [233, 255]],
    ["a friend keeps asking to borrow money from me", [247]],
    ["I spend money whenever I'm bored", [259]],
    ["my manager keeps giving me extra work because I never say no", [264, 105]],
    ["I have two internship offers with different benefits", [280]],
    ["someone keeps making fun of me and says it's only a joke", [281]],
    ["someone is spreading lies about me", [295]],
    ["I stay on my phone in bed until really late", [308]],
    ["I've been feeling stressed for weeks now", [316]],
    ["my website works on localhost but not after deploying", [332]],
    ["I'm worried my API key is exposed in my frontend", [328]],
    ["I double booked myself for saturday", [343, 18]],
    ["I don't know what gift to get my dad", [351]],
    ["I have 50 tabs open", [366]],
    ["I keep every file just in case", [367]],
    ["I can follow tutorials but can't code on my own", [382, 387]],
    ["I keep jumping between tutorials", [386]],
    ["I keep going back and forth between two choices", [401, 360]],
    ["should I play it safe or take the risk", [412]],
    ["I have a crush on my best friend", [422]],
    ["I keep checking whether he's seen my message", [434]],
    ["I start art projects and never finish them", [442, 154]],
    ["someone left a harsh comment on my artwork", [452, 127]],
    ["every day feels the same and I feel stuck", [463]],
    ["I want to handle failure better", [476]],
    ["I want to learn to cook simple meals", [481]],
    ["I always forget my passwords", [498]],
  ];

  for (const [text, fits] of PARAPHRASES) {
    it(`"${text}" → ${numbered(fits[0]).id}`, () => {
      const found = matchedNumbers([asked(text)]);
      assert.ok(
        found.some((number) => fits.includes(number)),
        `expected one of ${fits.map((number) => numbered(number).id).join(", ")}, found ${found.map((number) => numbered(number).id).join(", ") || "nothing"}`,
      );
    });
  }
});

describe("Not forcing a match", () => {
  const UNRELATED = [
    "hi",
    "thanks!",
    "What's the capital of France?",
    "Tell me a joke",
    "How does photosynthesis work?",
    "Write me a poem about the ocean",
    "Translate good morning into Spanish",
    "Who painted the Mona Lisa?",
    "what is machine learning",
    "how do I convert pdf to word",
  ];
  // Real situations, or plain statements, that the dataset doesn't cover.
  const NOT_COVERED = [
    "My grandmother passed away last week",
    "My dog is sick and the vet is closed today",
    "My car is making a weird noise",
    "I'm moving to a new country next month",
    "My brother just got into college!",
    "my parents are going on vacation",
    "my dad bought a new car",
    "I passed my driving test today!",
    "The wifi at my school is so slow",
  ];
  // One vague word or topic isn't a situation.
  const TOO_VAGUE = ["I'm bored", "I'm tired", "my friend", "school", "I made a mistake", "I have a test tomorrow"];

  for (const [label, texts] of [
    ["unrelated questions and requests", UNRELATED],
    ["situations the dataset doesn't cover", NOT_COVERED],
    ["a single vague topic", TOO_VAGUE],
  ] as const) {
    it(`matches nothing for ${label}`, () => {
      for (const text of texts) {
        const found = retrieve([asked(text)]).map((match) => match.situation.id);
        assert.deepEqual(found, [], text);
        assert.equal(referenceContext([asked(text)]), null, text);
      }
    });
  }

  it("matches nothing for an empty conversation", () => {
    assert.deepEqual(retrieve([]), []);
    assert.equal(referenceContext([]), null);
  });
});

// ---------------------------------------------------------------------------------------------------------

describe("Follow-ups", () => {
  it("keeps a follow-up connected to the situation it follows", () => {
    const followUp = "What should I say to the group?";
    // On its own the question could be about anything…
    assert.ok(!matchedNumbers([asked(followUp)]).includes(201));
    // …but after the situation it belongs to, it's about that situation.
    const found = matchedNumbers(conversation("My teammate keeps missing their part of our project", followUp));
    assert.equal(found[0], 201);
  });

  it("treats a worried follow-up as part of the same situation", () => {
    const found = matchedNumbers(conversation("I'm nervous about a presentation tomorrow", "What if I forget what I want to say?"));
    assert.ok([275, 124].includes(found[0]), `found ${found.join(", ")}`);
  });

  it("stays with the original situation through several follow-ups", () => {
    const found = matchedNumbers(
      conversation(
        "I think my friend is avoiding me",
        "Should I talk to them about it?",
        "What should I say?",
        "Can you be more direct?",
        "What if they don't reply?",
      ),
    );
    assert.ok([61, 79].includes(found[0]), `found ${found.join(", ")}`);
  });

  it("brings in a new situation when the conversation moves on to one", () => {
    const found = matchedNumbers(
      conversation("My exam is in 5 days and I've barely started studying", "Also my friend keeps cancelling our plans last minute"),
    );
    assert.ok(found.includes(21), `found ${found.join(", ")}`);
    assert.ok(found.includes(62), `found ${found.join(", ")}`);

    const guidance = referenceContext(
      conversation("My exam is in 5 days and I've barely started studying", "Also my friend keeps cancelling our plans last minute"),
    );
    assert.ok(guidance);
    assert.match(guidance, /latest message also brings up something new: the last situation listed relates to that/);
    const listed = guidance.split("\n").filter((line) => line.startsWith('- "'));
    assert.equal(listed.at(-1), `- "${numbered(62).situation}" (Friends & Social Situations)`);
  });

  it("tells Gemini the latest message continues the same situation, and which questions usually come next", () => {
    const guidance = referenceContext(conversation("My teammate keeps missing their part of our project", "What should I say to the group?"));
    assert.ok(guidance);
    assert.match(guidance, /latest message continues the situation described earlier/);
    assert.match(guidance, /one teammate repeatedly missing their part of our project/);
    for (const question of numbered(201).followUps) assert.ok(guidance.includes(`- ${question}`), question);

    const firstMessage = referenceContext([asked("My teammate keeps missing their part of our project")]);
    assert.ok(firstMessage);
    assert.doesNotMatch(firstMessage, /latest message continues/);
  });
});

// ---------------------------------------------------------------------------------------------------------

const CONFIG = { ...readConfig({ GEMINI_API_KEY: "test-key" }), apiKey: "test-key" };
const GEMINI_ANSWER = sampleResponse({ answer: "Gemini's own answer." });

interface GeminiRequestBody {
  contents: Array<{ role: string; parts: Array<{ text: string }> }>;
  systemInstruction: { parts: Array<{ text: string }> };
}

const streamed = (response: LifeResponse) =>
  new Response(`data: ${JSON.stringify({ candidates: [{ content: { role: "model", parts: [{ text: JSON.stringify(response) }] }, index: 0, finishReason: "STOP" }] })}\n\n`, {
    status: 200,
    headers: { "content-type": "text/event-stream" },
  });

/** A stand-in for the Gemini API that answers every request and keeps what it was sent. */
function fakeGemini(respond: () => Response = () => streamed(GEMINI_ANSWER)) {
  const requests: GeminiRequestBody[] = [];
  const fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
    requests.push(JSON.parse(String(init?.body)));
    return respond();
  }) as typeof globalThis.fetch;
  return { fetch, requests };
}

async function askGemini(messages: ChatMessage[], options: Partial<GeminiProviderOptions> = {}) {
  const gemini = fakeGemini();
  const provider = createGeminiProvider(CONFIG, { fetch: gemini.fetch, retry: { attempts: 1 }, reference: referenceContext, ...options });
  const response = await provider.respond(messages, { signal: new AbortController().signal, onStage: () => {} });
  return { response, request: gemini.requests[0] };
}

const instructionsOf = (request: GeminiRequestBody) => request.systemInstruction.parts.map((part) => part.text);

describe("What Gemini receives", () => {
  it("gets LIFE.EXE's system prompt unchanged, then only the few situations that fit", async () => {
    const { response, request } = await askGemini([asked("my friend barely talks to me anymore")]);
    assert.deepEqual(response, GEMINI_ANSWER);

    const [systemPrompt, guidance, ...rest] = instructionsOf(request);
    assert.equal(systemPrompt, SYSTEM_PROMPT);
    assert.deepEqual(rest, []);
    const listed = guidance.split("\n").filter((line) => line.startsWith('- "'));
    assert.ok(listed.length >= 1 && listed.length <= MAX_MATCHES);
    assert.ok(guidance.includes(`"${numbered(61).situation}"`));
    // Only what's relevant: nothing like the rest of the dataset, which would be tens of thousands of characters.
    assert.ok(!guidance.includes(numbered(1).situation));
    assert.ok(guidance.length < 3000, `${guidance.length} characters`);
  });

  it("gets exactly the request it got before the dataset when nothing fits", async () => {
    const { request } = await askGemini([asked("What's the capital of France?")]);
    assert.deepEqual(instructionsOf(request), [SYSTEM_PROMPT]);
    assert.deepEqual(request.contents, [{ role: "user", parts: [{ text: "What's the capital of France?" }] }]);
  });

  it("is told to use the references as background only, in its own words, and never to mention them", () => {
    const guidance = referenceContext([asked("my friend barely talks to me anymore")]);
    assert.ok(guidance);
    assert.match(guidance, /not from the person/);
    assert.match(guidance, /background, not a script/);
    assert.match(guidance, /If a reference doesn't fit what they said, ignore it/);
    assert.match(guidance, /Don't assume their situation has the same cause, details or solution/);
    assert.match(guidance, /"Other people: known, possible, unknown"/);
    assert.match(guidance, /never copy a reference's wording, and never mention the references, a dataset, examples, templates or pre-written answers/i);
    assert.match(guidance, /Safety, and every other instruction above, comes first/);
  });

  it("never sees the person's words in the guidance: those stay in the conversation", () => {
    const text = "My friend Priya has been ignoring my messages since Tuesday's argument";
    const guidance = referenceContext([asked(text)]);
    assert.ok(guidance);
    assert.ok(!guidance.includes("Priya") && !guidance.includes("Tuesday"));
  });

  it("is set up this way by createProvider when a key is configured", async () => {
    const gemini = fakeGemini();
    const realFetch = globalThis.fetch;
    globalThis.fetch = gemini.fetch;
    try {
      const provider = createProvider({ GEMINI_API_KEY: "test-key" });
      const options = { signal: new AbortController().signal, onStage: () => {} };
      assert.deepEqual(await provider.respond([asked("my friend barely talks to me anymore")], options), GEMINI_ANSWER);
      assert.deepEqual(await provider.respond([asked("Tell me a joke")], options), GEMINI_ANSWER);
    } finally {
      globalThis.fetch = realFetch;
    }
    assert.equal(gemini.requests.length, 2);
    assert.equal(instructionsOf(gemini.requests[0]).length, 2);
    assert.match(instructionsOf(gemini.requests[0])[1], /a friend acting distant and I cannot tell why/);
    assert.deepEqual(instructionsOf(gemini.requests[1]), [SYSTEM_PROMPT]);
  });

  it("still answers, without references, if matching ever fails", async () => {
    const warnings: string[] = [];
    const { warn } = console;
    console.warn = (...args: unknown[]) => warnings.push(args.map(String).join(" "));
    try {
      const { response, request } = await askGemini([asked("my friend barely talks to me anymore")], {
        reference: () => {
          throw new Error("broken index");
        },
      });
      assert.deepEqual(response, GEMINI_ANSWER);
      assert.deepEqual(instructionsOf(request), [SYSTEM_PROMPT]);
    } finally {
      console.warn = warn;
    }
    assert.ok(warnings.some((warning) => warning.includes("broken index")));
  });
});

describe("The original conversation", () => {
  it("still goes to Gemini whole and unchanged on a follow-up", async () => {
    const earlier = sampleResponse({ answer: "Talk to them first.", title: "Teammate missing their part" });
    const messages: ChatMessage[] = [
      asked("My teammate keeps missing their part of our project"),
      { role: "assistant", content: earlier },
      asked("What should I say to the group?"),
    ];
    const { request } = await askGemini(messages);
    assert.deepEqual(
      request.contents.map((content) => content.role),
      ["user", "model", "user"],
    );
    assert.equal(request.contents[0].parts[0].text, "My teammate keeps missing their part of our project");
    assert.deepEqual(JSON.parse(request.contents[1].parts[0].text), earlier);
    assert.equal(request.contents[2].parts[0].text, "What should I say to the group?");
    // The reference for the follow-up is the original situation's.
    assert.match(instructionsOf(request)[1], /one teammate repeatedly missing their part of our project/);
  });
});

// ---------------------------------------------------------------------------------------------------------

const post = (messages: ChatMessage[]) =>
  new Request("http://localhost/api/life", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages }) });

async function ask(messages: ChatMessage[], env: Record<string, string>, provider?: LifeProvider) {
  const { warn } = console;
  console.warn = () => {};
  try {
    const events = await readEvents(await handleLifeRequest(post(messages), env, provider ? { provider } : {}));
    const result = events.find((event): event is Extract<StreamEvent, { type: "result" }> => event.type === "result");
    return { kinds: events.map((event) => event.type), result: result?.response };
  } finally {
    console.warn = warn;
  }
}

describe("Safety and the fallback, unchanged", () => {
  it("adds no references when someone may be at risk, so the safety instructions stand alone", async () => {
    for (const messages of [
      [asked("my friend is ignoring me and I want to kill myself")],
      conversation("I don't want to be alive anymore", "my friend barely talks to me anymore"),
    ]) {
      assert.equal(referenceContext(messages), null);
      const { request } = await askGemini(messages);
      assert.deepEqual(instructionsOf(request), [SYSTEM_PROMPT]);
    }
  });

  it("answers from the demo engine, exactly as before, when Gemini can't answer a matched message", async () => {
    const messages = [asked("My teammate keeps missing their part of our project")];
    const failing = fakeGemini(
      () => new Response(JSON.stringify({ error: { code: 503, status: "UNAVAILABLE", message: "overloaded" } }), { status: 503 }),
    );
    const live = createGeminiProvider(CONFIG, { fetch: failing.fetch, retry: { attempts: 1 }, reference: referenceContext });
    const { kinds, result } = await ask(messages, {}, withFallback(live, createDemoProvider({ stageMs: 0 }), { liveTimeoutMs: 2000 }));
    assert.equal(failing.requests.length, 1);
    assert.ok(kinds.includes("fallback"));
    assert.deepEqual(result, buildDemoResponse(messages));
  });

  it("leaves demo mode exactly as it was", async () => {
    for (const messages of [
      [asked("my friend barely talks to me anymore")],
      conversation("My teammate keeps missing their part of our project", "What should I say to the group?"),
      [asked("I want to hurt myself")],
    ]) {
      const { kinds, result } = await ask(messages, {});
      assert.deepEqual(result, buildDemoResponse(messages));
      assert.ok(!kinds.includes("fallback"));
    }
  });
});
