// The vocabulary behind reference matching (match.ts): which words to ignore, shorthand to expand, the
// concepts that different wordings share, and the words that describe each category as a whole.
//
// To help a new phrasing reach the right situation, add it to the concept that already describes that idea.
// Patterns run on normalized text: lowercase, contractions expanded ("doesn't" is "does not"), no punctuation.

// Words that carry no meaning for matching.
export const STOPWORDS = new Set(
  (
    "a an the and or but if so of to in on at by for from with about into onto over under than then as " +
    "i me my mine myself we us our ours ourselves you your yours yourself he him his she her hers they them their theirs themselves it its itself " +
    "this that these those there here what which who whom whose when where why how whether " +
    "am is are was were be been being do does did doing done have has had having " +
    "will would shall should can could may might must cannot not no nor yes " +
    "all any both each every few more most other some such only own same very too just also even still really actually " +
    "again ever never always often sometimes usually repeatedly constantly whenever anymore lately already yet " +
    "up down out off away back because while until till since though although unless " +
    "get gets got getting gotten go goes going went gone make makes made making " +
    "want wants wanted wanting need needs needed needing feel feels felt feeling know knows knew knowing known " +
    "think thinks thought thinking seem seems seemed seeming try tries tried trying keep keeps kept keeping " +
    "like likes liked lot lots bit thing things something anything everything nothing stuff " +
    "someone anyone everyone somebody anybody everybody one ones way ways much many " +
    "dealing deal situation please okay ok yeah hey hi hello thanks thank right now today tonight " +
    "almost frequent frequently genuinely particular particularly completely extremely super pretty quite maybe probably " +
    "basically literally honestly seriously totally directly potentially mainly " +
    // Common adjectives that happen to be rare in the dataset but say little alone; concepts still use them.
    "new old good bad big small little huge large great best better worse worst last next important different whole real"
  ).split(" "),
);

// Shorthand and contractions typed without apostrophes, expanded so they read like everything else.
export const SHORTHAND: Record<string, string> = {
  dont: "do not", doesnt: "does not", didnt: "did not", cant: "cannot", couldnt: "could not", wont: "will not",
  wouldnt: "would not", shouldnt: "should not", isnt: "is not", arent: "are not", wasnt: "was not",
  werent: "were not", hasnt: "has not", havent: "have not", hadnt: "had not", aint: "is not", im: "i am",
  ive: "i have", youre: "you are", theyre: "they are", thats: "that is", whats: "what is",
  u: "you", ur: "your", bc: "because", cuz: "because", coz: "because", msg: "message", msgs: "messages",
  txt: "text", txts: "texts", idk: "i do not know", rn: "right now", bf: "boyfriend", gf: "girlfriend",
  ppl: "people", tmrw: "tomorrow", tmr: "tomorrow", hw: "homework", convo: "conversation",
  convos: "conversations", info: "information", insta: "instagram", ig: "instagram", yt: "youtube",
  pls: "please", plz: "please", bday: "birthday", uni: "university",
};

// Concepts that only say who or what a situation involves (a friend, school, money) rather than what is
// going on. A match always needs at least one idea beyond these: "my parents are going on vacation" shares
// topics with "family plans conflicting with something important to me", but not the problem.
export const TOPICS: ReadonlySet<string> = new Set([
  "friend", "parent", "sibling", "family", "teacher", "teammate", "team", "classmate", "peers", "new_people", "message", "phone",
  "social_media", "plans", "school", "exam", "study", "marks", "jee", "coaching", "notes", "science", "chapter", "career", "field",
  "future", "college", "workplace", "responsibility", "money", "code", "deploy", "event", "files", "creative", "hobby", "decide",
  "opportunity", "goal", "weekend", "morning", "evening", "attend", "new_role", "soon", "study_plan", "school_supplies",
]);

// Concepts: different ways of saying the same thing. Each pattern runs on normalized text (see `normalize`),
// so contractions are already expanded ("doesn't" is "does not") and there is no punctuation.

export const CONCEPT_SOURCES: Record<string, string[]> = {
  // People
  friend: ["friends?", "friendships?", "bff", "besties?", "best mates?", "mates", "buddy", "buddies", "pals?"],
  parent: ["parents?", "moms?", "mums?", "mother", "mummy", "mommy", "dads?", "daddy", "father", "mama", "papa"],
  sibling: ["siblings?", "brothers?", "sisters?"],
  family: [
    "family", "families", "relatives", "household", "parents?", "moms?", "mums?", "mother", "dads?", "father",
    "siblings?", "brothers?", "sisters?", "grandparents?", "grandma", "grandpa", "grandmother", "grandfather",
    "aunts?", "uncles?", "cousins?",
  ],
  teacher: ["teachers?", "professors?", "profs?", "tutors?", "instructors?", "lecturers?", "sir", "maam", "principal", "headteacher"],
  teammate: [
    "teammates?", "coworkers?", "co workers?", "colleagues?", "team mates?", "team members?", "group members?", "groupmates?", "group mates?", "project partners?",
    "lab partners?", "(one|someone|somebody|one person|a person|people|a guy|a girl|nobody|no one|everyone) in (my|our|the) (group|team)",
  ],
  team: ["groups?", "teams?", "squad"],
  classmate: ["classmates?", "batchmates?", "(someone|somebody|people|kids|a guy|a girl|everyone|anyone) in (my|the) class"],
  peers: [
    "peers?", "everyone else", "everybody else", "other (students|kids|people)", "people my age", "(all )?my friends (all|have|are|already)",
    "all my friends", "everyone (else )?(my age|i know)",
  ],
  new_people: [
    "new people", "meet(ing)? (new )?people", "unfamiliar (people|groups?|adults?)", "people i do not know",
    "(do not|did not) know (anyone|anybody)", "know nobody", "strangers?",
  ],
  crush: [
    "crush(es)?", "someone i (like|fancy|have a crush on)", "(girl|guy|boy|person) i (like|fancy)", "lik(e|es|ing) someone",
    "(have|having|got) feelings for", "my feelings for", "feelings for (him|her|them|someone)", "fancy (him|her|them|someone)",
    "attracted to", "in love", "romantic\\w*", "dating", "go on a date", "ask(ing)? (him|her|them|someone) out",
    "girlfriend", "boyfriend", "in a relationship", "something more", "more than (just )?friends?", "likes me",
    "like me back", "(may|might) like me",
  ],

  // Friendships
  distant: [
    "distant", "ignor(e|es|ed|ing) (me|my (messages?|texts?|calls?|dms?))", "avoid(s|ed|ing)? me",
    "barely (talk|speak|repl|text|messag|respond)\\w*", "(stopped|stop|not|never|hardly|rarely) (talk|speak|repl|text|messag|respond)\\w*( back)?( to| with)? me",
    "(has|have|had) not (talked|spoken|texted|replied|messaged|responded)", "not heard (from|back)",
    "(acting|been|so|is|being) cold", "cold (to|towards?) me", "pull(s|ed|ing)? away", "drift(s|ed|ing)? (apart|away)",
    "(grew|grow|growing) apart", "left (me )?on (read|seen|delivered)", "leaves? me on (read|seen)", "ghost(s|ed|ing)?",
    "dry (texts?|repl\\w*)", "short replies", "one word (answers|replies|texts)", "acting (weird|strange|different\\w*|off|distant)",
    "(seems?|seemed|feels?) (off|different|distant)", "not (as )?close anymore",
  ],
  left_out: [
    "left out", "leav(e|es|ing) (me|him|her|them|someone|a friend|my friend) out", "left (him|her|them|someone|a friend|my friend) out",
    "exclud(e|es|ed|ing)", "exclusion", "without me", "not invited", "(did|do|does) not invite me", "never invite me", "uninvited",
    "forgot to invite",
    "without (inviting|including|asking) me",
  ],
  belong: ["fit in", "fitting in", "(no longer|do not|never|cannot|not) fit", "belong\\w*", "outsider", "out of place"],
  lonely: [
    "lonely", "loneliness", "isolated", "disconnected", "no friends", "(no one|nobody) to talk to",
    "(rarely|never|do not|barely) (talk|speak)\\w* to (anyone|anybody|people)",
  ],
  cancel: ["cancel\\w*", "bail(s|ed|ing)? on", "flak(e|es|ed|ing)", "stood me up", "stand me up"],
  initiate: [
    "start\\w* (the )?conversations?", "(text|message|reach out|call)(s|ing)? first", "initiat\\w*", "one sided",
    "(always|only) (the one|the person|me) (who|that|to) (has to |have to |needs to )?(start|text|message|reach|call|make|plan)\\w*",
  ],
  secret: ["secrets?", "confided", "confide", "in confidence", "something (private|personal)"],
  sides: [
    "tak(e|es|ing) sides?", "pick(ing)? (a )?sides?", "on (their|his|her|my) side", "choose between (them|my friends)",
    "(caught|stuck) (in )?(the middle|between)", "in the middle of", "keep(ing)? (the )?peace",
    "peacemaker", "peace ?keeper", "mediat\\w*", "middle ?man",
  ],
  hurt_feelings: [
    "hurt\\w* (his|her|their|someone|my friend|people)? ?feelings", "(upset\\w*|offend\\w*|hurt\\w*) (him|her|them|a friend|my friend|someone|somebody|people)",
    "took it the wrong way", "(friend|he|she|they) (got|was|is|seemed?|became) (really |so |very )?(upset|offended|hurt)",
    "said something (hurtful|mean|wrong)",
  ],
  tease: [
    "teas(e|es|ed|ing)", "mak(e|es|ing) fun of", "made fun of", "mock(s|ed|ing)?", "roast(s|ed|ing)?",
    "laugh(s|ed|ing)? at me", "pick(s|ed|ing)? on me", "bully\\w*", "bullied", "call(s|ed|ing)? me names",
  ],
  joke: ["jok(e|es|ed|ing)", "kidding", "banter"],
  favor: [
    "favou?rs?", "(uses|using|used) me", "tak(e|es|ing) advantage", "(never|does not|do not) help(s)? me( back)?",
    "help(ing)? (me )?back",
  ],
  compete_friend: ["competitions?", "one up\\w*", "outdo\\w*", "brag\\w*", "show(s|ing)? off", "compet(es|ing) with me"],
  argue: [
    "argu(e|es|ed|ing)", "arguments?", "fight(s|ing)?", "fought", "quarrel\\w*", "fall(ing)? out", "fell out", "falling out",
    "conflicts?", "tension",
  ],
  disagree: ["disagre\\w*", "(do not|does not|cannot) agree", "different (opinions?|views?)", "not on the same page"],
  listen: [
    "(just|only) (want|wanted|need|needed)(ed)? (them|him|her|someone|people)? ?to listen", "(does|do|did) not listen",
    "never listen\\w*", "(not|stop) listening", "(listen|hear) (to )?my side", "(gives?|giving) (me )?(unwanted |unsolicited )?advice",
  ],
  vent: ["vent(s|ed|ing)?", "unload\\w*", "dump(s|ed|ing)? (all )?(their|his|her) (problems|feelings)"],
  new_friend: ["(make|making|made) (new )?friends?", "becom\\w* friends?", "be friends? with", "befriend\\w*", "get to know"],
  new_group: ["new (group|friends|friend group|crowd)", "other friends now", "replaced me"],
  peer_pressure: [
    "pressur\\w* me", "pressured (by|into)", "peer pressure", "push(es|ed|ing)? me (to|into)", "(make|makes|making) me do",
    "dar(e|es|ed|ing) me", "(do|doing) something i am (not comfortable|uncomfortable) with",
    "(want|wants|wanted) me to( \\w+){1,6} (and|but) i (do not|really do not) want",
  ],
  reluctant: ["uncomfortable", "hate (asking|having to|depending)", "(do not|never) like (asking|having to|depending)", "awkward (asking|to ask)"],
  pressure: ["pressur\\w*", "expect\\w*", "(high|big) hopes", "stress\\w*", "(everyone|people|they) (wants?|expects?) me to"],
  badmouth: [
    "behind my back", "(complain\\w*|gossip\\w*|talk\\w*|lie\\w*|lying|trash talk\\w*) about me", "bad ?mouth\\w*",
  ],
  rumour: [
    "rumou?rs?", "(spread\\w*|telling|told) (lies|stories|a story|an untrue story|untrue|false)", "lies about me",
    "(untrue|false|fake) (story|stories|things|rumou?rs?)", "lying about me",
  ],

  // Communication
  communicate: [
    "communicat\\w*", "(talk|talks|talking|talked|speak|speaks|speaking|spoke) (to|with)", "get(ting)? along", "open(ing)? up (to|with)",
  ],
  tell_someone: ["(tell|telling|talk to|open up to) (my )?(family|parents|mom|mum|dad|teacher|friends?)"],
  request: ["request\\w*", "ask(s|ed)? me to", "wants me to", "(told|tells) me to"],
  told: ["(told|tells|said|says) (me|that|i)", "being told"],
  say_no: [
    "say(ing)? no", "said no", "turn(ing|ed|s)? (it |them |him |her |people )?down", "declin\\w*", "refus\\w*",
    "people pleas\\w*", "(always|automatically|usually|keep) say(s|ing)? yes", "say(ing)? yes when",
    "say(ing)? yes to (everything|everyone|anything|people)", "say(ing)? yes (even )?when i (do not|really do not) want",
  ],
  apologize: ["apolog\\w*", "sorry", "make (it )?up (to|with)", "make amends"],
  message: [
    "messag\\w*", "texts?", "texting", "texted", "dms?", "chats?", "chatting", "whatsapp", "snapchat", "snaps?",
    "emails?", "repl(y|ies|ied|ying)",
  ],
  tone: [
    "(sounded|sounds|sound|came across|come across|comes across|coming across|seemed|seems|read) (as )?(too |so |way |really |a bit |kind of )?(harsh\\w*|rude\\w*|mean\\w*|cold\\w*|blunt\\w*|angry|aggressive|wrong)",
    "(harsher|ruder|meaner|colder|blunter) than", "passive aggressive",
  ],
  misunderstand: [
    "misunderst\\w*", "misread\\w*", "misinterpret\\w*", "took (it|that) (the )?wrong way", "take (it|that) the wrong way",
    "got (it|me) wrong", "sarcas\\w*",
  ],
  overreact: [
    "overreact\\w*", "(reacting|reacted|react) (too )?(quickly|fast|badly|angrily)", "snapped at", "lash(ed)? out",
    "(lost|lose|losing) my (temper|cool)",
  ],
  interrupt: [
    "interrupt\\w*", "talk(s|ed|ing)? over (me|people|everyone|others)", "cut(s|ting)? me off",
    "(do not|does not|never) let me (talk|speak|finish)",
  ],
  extension: ["extension", "extend\\w* (the |my )?(deadline|due date)", "more time (for|on|to finish)"],
  hard_talk: [
    "(difficult|hard|awkward|tough|serious|uncomfortable) (conversation|talk|chat|discussion)s?", "confront\\w*",
    "bring(ing)? (it|this|that) up", "raise (it|this|that|the issue)", "talk to (them|him|her) about (it|this|that)",
  ],
  bother: [
    "bother\\w*", "annoyed by", "annoys me", "annoying me", "get(s|ting)? on my nerves", "(is not|not) okay", "unacceptable",
    "cross(es|ed|ing)? (a |the |my )?(line|boundary)",
  ],
  repeated_behavior: [
    "repeated (behaviou?r|actions?|comments?)", "(keeps|kept|keep) doing (it|this|that|the same)", "what (he|she|they) (keeps|keep) doing",
  ],
  behavior: ["behaviou?r\\w*", "attitude", "the way (he|she|they) (act|acts|treat|treats|talk|talks)"],
  clarify: [
    "clarif\\w*", "unclear", "vague", "confus\\w* (instructions|task|brief)",
    "(do not|did not|cannot) understand (what|the) (they|he|she|instructions|task|assignment)",
  ],
  judged: [
    "judg\\w*", "look(ing)? (stupid|dumb|incompetent|incapable|weak|bad|silly|clueless|lazy)", "seem (stupid|dumb|incompetent|incapable)",
    "what (people|others|everyone) (will )?think",
  ],
  plans_for_me: [
    "(make|makes|made|making) plans for me", "(decide|decides|decided|deciding) (things )?for me",
    "(without|not) (even )?ask(ing)? me",
  ],
  unrealistic: ["unrealistic", "(will not|would not|is not going to|not going to) work", "too ambitious", "not feasible"],
  correct_someone: ["correct\\w* (someone|them|him|her|people|what)", "set(ting)? the record straight", "clear up (a |the )?misunderstanding"],
  not_understand_me: ["(do not|does not|did not|never) (understand|get|see) (why|what|how|my|me)", "(does not|do not) understand"],
  something_wrong: [
    "(something|anything) (is )?wrong between us", "(are we|we are) (okay|ok|good|fine)",
    "(is|are) (we|they|he|she) (mad|angry|upset) (at|with) me", "(mad|angry|upset) (at|with) me",
  ],
  stop_favor: ["(stop|end|ending|quit) (doing )?(a |the |this )?favou?r", "(cannot|no longer) keep (doing|helping)"],
  overthink: [
    "overthink\\w*", "overthought", "over think\\w*", "overanaly\\w*", "(cannot|can not) stop thinking", "replay\\w*",
    "obsess\\w*", "ruminat\\w*", "second guess\\w*", "(think|thinking) too much", "(keep|kept|keeps|always) thinking about", "dwell\\w*",
    "(go|going|went) over (it|them|everything|the questions)",
  ],

  // Confidence
  unsure: [
    "unsure", "not sure", "uncertain\\w*", "no idea", "(do not|did not|not) know (what|which|if|whether|how|where|why)", "not knowing",
    "without knowing", "(cannot|can not|could not) tell (if|whether|what|why)", "wonder\\w* (whether|if)",
    "how (do|can|will|would) i (know|tell) (if|whether|when)",
  ],
  is_working: ["(is|are|it is) (actually )?working", "(works|working) or not", "effective"],
  know_what_to_do: ["know(ing)? (exactly )?what (i need to|i have to|i should|to) do"],
  know_what_i_want: ["know(ing)? (exactly )?what i (want|really want)"],
  change_answers: ["chang\\w* (my |the |correct |right )?(answers?|ones)", "second guess\\w* (my )?answers"],
  know_i_can: ["know(ing)? i can (do|handle|manage)( it| this| something)?"],
  correct: ["correct\\w*", "(was|is|were) right", "right answers?"],
  doubt: [
    "doubt\\w*", "insecur\\w*", "imposter", "impostor", "(do not|not) believe in myself", "unsure of myself", "not confident",
    "(not|never|is not|am not|not be|will not be|would not be) (good|smart|talented|capable) enough",
    "(lack|lacking|low|no|lost|lose|losing) (of )?(all )?(my )?(confidence|self esteem|self belief)",
    "(stop|not|do not|cannot) trust\\w* myself", "second guess\\w*",
  ],
  confidence: ["confiden\\w*", "self esteem", "self belief"],
  compare: [
    "compar\\w*", "better than me", "(everyone|everybody|others|they|people) (is|are|seem|seems) (better|smarter|ahead|faster)",
    "(ahead of|further than) (me|everyone|everybody|others)", "(slower|worse) than (everyone|everybody|others|my friends|the rest)",
    "jealous of (their|his|her|other)", "(faster|smarter|better|quicker|further|ahead) than me",
    "(everyone|everybody|others|they|people)( \\w+){0,4} (better|smarter|faster|quicker|further|ahead)",
    "(slowest|worst|dumbest|last) (person |one |student )?(in|of) (my |the )?(class|group|year|batch)",
  ],
  behind: [
    "(fall|falling|fell|fallen|am|feel|feeling|getting|get|so|way|far) behind", "catch(ing)? up", "lagging", "backlog",
    "(started|start|begun|began)( \\w+){0,4} (earlier|before me|ahead of me)", "years (ahead|before me)", "head start",
    "(everyone|others|other students|they)( else)? (started|began)",
  ],
  mistake: ["mistak\\w*", "errors?", "mess(ed|ing)? up", "screw(ed|ing)? up", "blunder\\w*", "slip(ped)? up"],
  careless: [
    "careless\\w*", "silly (mistakes?|errors?)", "sloppy", "(not|do not|did not) (read|check)\\w* (the )?(question|questions|carefully|properly)",
    "misread\\w*",
  ],
  speaking: [
    "presentations?", "presenting", "present (in front|to (the|my) (class|group|team)|my|our|a project)", "speech(es)?",
    "public speaking", "speak(ing)? (up )?(in front of|to) (the |a )?(class|group|people|everyone|audience|crowd)",
    "talk(ing)? in front of", "in front of (the |a |my )?(everyone|people|class|group|audience|crowd)", "viva", "oral exam",
    "debate", "meetings?",
  ],
  shy: [
    "shy\\w*", "socially anxious", "social anxiety", "introvert\\w*", "(freeze|froze|freezing|frozen) up",
    "(freeze|freezing) (in|around)", "small talk",
  ],
  fear: [
    "afraid", "scared", "scary", "fear\\w*", "frighten\\w*", "terrif\\w*", "nervous\\w*", "anxi\\w*", "worr\\w*", "panic\\w*",
    "dread\\w*", "intimidat\\w*", "freak(ing|ed)? out",
  ],
  panic: ["panic\\w*", "freak(ing|ed)? out", "meltdown"],
  blank: [
    "go(ing|es)? blank", "went blank", "blank(ed)? out", "(mind|brain|head) (goes|went|going|is going) (completely )?(blank|empty)",
    "forget (everything|what i (know|learned|studied|want to say|wanted to say|was going to say|am going to say))",
    "(forget|forgot) (my )?(words|lines|speech)",
  ],
  embarrass: ["embarrass\\w*", "cringe\\w*", "humiliat\\w*", "ashamed", "(made|make|making) a fool of myself"],
  reassurance: [
    "reassur\\w*", "(need|want|ask\\w*|seek\\w*) (for )?(approval|permission|confirmation)",
    "tell me (i am|it is|my decision is) (right|okay|ok|fine)",
  ],
  hold_back: [
    "(did not|do not|never|will not) (apply|try|go for|sign up|put myself forward)", "avoid\\w* (opportunit\\w*|applying|trying)", "hold\\w* (myself )?back",
  ],
  qualified: ["(more|less|better|not) qualified", "(more|less) (experienced|talented|skilled|deserving)"],
  milestone: ["milestones?", "before me", "(reached|reach) (it|that|a milestone) first", "(already|all) (have|has|got)( \\w+){0,2} and i (do not|have not)"],
  beginner: [
    "beginners?", "newbie", "noob",
    "(people|others|everyone) (to )?(see|seeing|watch\\w*) me (fail|struggle|be bad|being bad|learn)\\w*",
  ],
  dislike_me: [
    "(dislike|hate) me", "(people|they|everyone|he|she|them) (will|would|might|may) (dislike|hate|not like|be mad at|be annoyed with) me",
  ],
  wrong_choice: [
    "(wrong|bad) (choice|decision|option|path|career|major|college|move)",
    "(choose|chose|choosing|pick|picked|picking|make|making|made) (the )?wrong",
  ],
  regret: ["regret\\w*", "wish i (had|had not|did not|would have)", "should have (stayed|gone|said|done)"],

  // Motivation and procrastination
  perform_badly: [
    "(do|did|doing|does|go|went|going|perform\\w*) (really |so |very )?(badly|poorly|bad|terribly|worse)", "struggl\\w* (in|with|on) (timed |the )?(tests?|exams?)",
  ],
  timed: ["timed (tests?|exams?|papers?|conditions)", "time limits?", "against the clock", "(test|exam|it) is timed"],
  difficult: ["difficult\\w*", "hard", "harder", "tough\\w*", "trouble", "struggl\\w*", "(am|get|getting|feel|felt|completely|totally) lost (in|by|during|after|in the)"],
  several: ["several", "multiple", "three", "four", "five", "six", "seven", "(a )?(bunch|couple) of", "(a lot|lots|loads) of"],
  too_many: ["(too|so|way too) many", "too much", "tons of"],
  procrastinate: [
    "procrastinat\\w*", "put(s|ting)? (it |this |that |things |everything |them |my \\w+ )?off", "postpon\\w*", "delay\\w*",
    "(leave|leaving|left|wait|waiting|waited) (it |things |everything )?(until|till|to) the (last minute|night before|last day|deadline)",
    "last minute (studying|cramming|work)",
    "avoid\\w* (the |my |a |an |this |that |doing |stressful |important |boring |hard |difficult )*(tasks?|work|essays?|assignments?|homework|projects?|studying|study|responsibilit\\w*)",
    "(only|just) (becom\\w* productive|get\\w* productive|work|start|focus|study)\\w* (when|once|if) (the |a )?deadline", "deadline is (super |really |very |extremely )?close",
    "(have not|has not|did not|not even|have not even) (started|begun|touched)", "barely start\\w*",
    "(done|did|studied|prepared) (almost |basically |pretty much )?nothing", "(have not|has not) (done|studied|prepared) (anything|much)"],
  waiting_to_start: ["wait\\w* (for|until)( \\w+){0,4} (to start|before (i )?start\\w*|to begin)", "wait\\w* to feel"],
  motivation: [
    "motiv\\w*", "unmotivated", "lazy", "laziness", "(cannot|can not) be bothered", "(do not|never) feel like (doing|studying|working)",
  ],
  lose_interest: [
    "(lost|lose|losing|loses) (all )?(my )?(interest|passion|excitement|the spark)", "(no longer|not) (interested|excited) in",
    "(do not|never) (care|enjoy) (about )?(it|this|my|the|anything) ?(anymore)?", "(bored|tired) of (it|this|my|the)",
    "fell out of love", "used to (love|like|enjoy|care)",
  ],
  bored: ["bor(ed|ing|edom)", "dull", "tedious", "monoton\\w*"],
  perfect: [
    "perfect\\w*", "flawless", "(good|ready|polished) enough", "(never|not) (feels? )?(finished|done|ready)",
    "(right|perfect|ideal) (time|moment)",
  ],
  switching: [
    "switch\\w*", "jump(ing)? between", "chang\\w* (my )?(career|goals?|mind|plans?|timetable|direction)( \\w+)? (whenever|every|all the time|constantly|again)", "(keep|kept|constantly|always) chang(e|ing) (my )?(goals?|mind|plans?|timetable|schedule|tutorials?|frameworks?|career)",
  ],
  phone: ["phones?", "screen time", "screens?", "mobile"],
  social_media: [
    "social media", "instagram", "tiktok", "snapchat", "facebook", "twitter", "reddit", "youtube", "reels", "shorts",
    "posts?", "posting", "posted", "followers?", "likes", "reactions?", "online", "short videos?", "influencers?",
  ],
  scroll: [
    "scroll\\w*", "doomscroll\\w*", "(watch|watching|watched) (one more|another|more|endless|short|youtube|tiktok) (video|videos|reel|reels|episodes?|shorts)",
    "(mindless|endless)\\w* (scroll\\w*|watch\\w*|brows\\w*)", "(watch|watching|watched) (reels|shorts|tiktoks?|youtube|videos)", "(open|opening|opened) (social media|instagram|tiktok|my phone|youtube)",
    "one more (video|episode|reel|game)",
  ],
  overwhelmed: [
    "overwhelm\\w*", "(too much|so much) (to do|work|going on|on my plate)", "swamped", "drowning", "(cannot|can not) cope",
    "overload\\w*", "buried (in|under)",
  ],
  todo: ["to do lists?", "todo lists?", "to dos", "todos", "task lists?", "checklists?", "lists?"],
  guilt: ["guilt\\w*", "feel(ing)? bad (about|for|when) (relaxing|resting|taking|spending|having fun)"],
  relax: [
    "relax\\w*", "rest(ing)?", "(take|taking|took) (a )?breaks?", "chill\\w*", "downtime", "(day|days|time) off", "day away",
    "leisure", "unwind\\w*",
  ],
  productive: ["productiv\\w*", "get (things|anything|nothing) done", "got nothing done", "accomplish\\w*", "efficient", "achiev\\w*"],
  first_step: [
    "first (practical )?step", "(where|how) to (start|begin)", "what to (change|do|fix|work on) first", "get(ting)? started", "unable to start", "(cannot|can not) (get )?start\\w*",
  ],
  habit: ["habits?", "consisten\\w*", "(stick|sticking) to (it|a|my|the|them)", "streaks?", "(break|breaking|broke) (my |the )?promises"],
  restart: ["restart\\w*", "start(ing)? over", "(start|starting|started) again", "from scratch", "fresh start", "every monday", "start (fresh|afresh|over|again)"],
  goal: ["goals?", "ambitions?", "targets?", "dreams?", "aspirations?"],
  night: [
    "late at night", "(late|every|at|last|all) nights?", "nighttime", "night owl", "midnight", "[0-9]+ ?am", "all nighters?",
    "(stay|staying|stayed|up) (up )?late", "up until",
  ],
  sleep: [
    "sleep\\w*", "slept", "insomnia", "bed ?time", "(go|going|get|getting|went) to bed", "in bed", "(stay|staying|stayed) (up|awake)",
    "awake", "nap\\w*", "all nighters?",
  ],
  tired: [
    "tired\\w*", "tiring", "exhaust\\w*", "sleepy", "fatigu\\w*", "(no|low|zero|more|out of|run out of|running out of|ran out of) energy",
    "energy", "drain\\w*", "worn out", "burn(ed|t)? out", "burnout", "drowsy",
  ],
  stress: ["stress\\w*", "tense", "tension", "frazzled", "on edge"],
  focus: [
    "focus\\w*", "concentrat\\w*", "distract\\w*", "attention", "zon(e|ing) out", "(mind|brain) (wanders|wandering|keeps wandering)",
  ],
  busy: [
    "busy", "hectic", "packed (schedule|day|week)", "(no|not enough|little|less|very little) (free )?time",
    "(do not|never) have time", "overbooked",
  ],
  deadline: ["deadlines?", "due(?! to)", "submission", "submit\\w*"],
  late: [
    "(running|run|always|be|being|am|was|arrive\\w*|get|getting|got|show\\w* up) late", "leav(e|ing|es) (home |the house )?(late|later)",
    "left (home |the house )?(late|later)", "late (for|to) (school|class|work|everything|meetings?|appointments?)", "(not|never) on time",
    "punctual\\w*",
  ],
  travel: ["travel\\w*", "commut\\w*", "the bus", "traffic", "journey"],
  morning: ["mornings?", "(wake|waking|woke) up"],
  evening: ["evenings?", "after (school|work|dinner|class)"],
  weekend: ["weekends?", "saturdays?", "sundays?"],
  prioritize: ["prioriti\\w*", "priorit\\w*", "(most|more|less) important", "urgent"],
  overplan: [
    "plan\\w*( \\w+){0,3} more( \\w+){0,3} than i (can|could)", "(too many|more) (tasks|things) than i (can|could)", "over ?plan\\w*", "over ?schedul\\w*",
  ],
  estimate: [
    "underestimat\\w*", "overestimat\\w*", "(takes?|took|taking) (much |way |so )?longer than",
    "(how long|time) (it|things|tasks?) (will )?take", "how long( \\w+){0,3} (will )?take",
    "(takes?|took|taking) me (much |way |so )?longer than",
  ],
  free_time: ["free time", "spare time", "downtime"],
  waste_time: [
    "wast\\w* (time|my time|hours|the day|it|so much time|most of it)", "waste\\w*",
    "(spend|spends|spending|spent) (too |so |way too )?(much |long |more )?(time|hours)", "(spend|spends|spending|spent) (too|so) long",
  ],
  unexpected: [
    "unexpected\\w*", "(something|things) (came|comes|come) up", "surprise\\w*", "disrupt\\w*", "(falls?|fell|falling) apart",
    "collaps\\w*",
  ],
  plans: [
    "plans?", "planning", "planned", "trips?", "outings?", "vacations?", "holidays?", "(day|night) out", "get togethers?",
  ],

  // School and exams
  study_plan: ["(study |revision )?(plans?|timetables?|schedules?)"],
  growing_backlog: ["(large|huge|big|massive|growing) backlog", "backlog (is |keeps )?(getting bigger|growing|piling up)"],
  check_solution: [
    "(look at|check|see|peek at|read) (the )?(solution|solutions|answer key)", "(give up|stop struggling|stop trying)( on (a|the|this) (problem|question))?",
  ],
  soon: ["soon", "(next|this) (week|month)", "tomorrow", "in (a few|two|three|[0-9]+) days", "(coming|upcoming)"],
  school_supplies: [
    "books?", "materials?", "calculators?", "notebooks?", "pens?", "pencils?", "stationery", "(school )?bags?", "uniform", "(gym|sports|pe) kit",
  ],
  forget: [
    "forget\\w*", "forgot\\w*", "slip(s|ped)? my mind", "(do not|cannot|can not|never) remember",
    "(keep )?(losing|lose|lost|misplac\\w*) (my )?(keys|wallet|phone|glasses|things|stuff)",
  ],
  low_score: [
    "(low|lower|bad|poor|terrible|awful) (score|scores|marks|grades?|result|results)", "got an? [cdef]", "(failed|fail) (the |my )?(test|exam|paper)",
  ],
  effort: [
    "(studied|study|studying|work|worked|working|tried|try|trying) (so |really |very |super )?hard", "put in (so much|a lot of) (effort|work|time)",
    "did my best",
  ],
  high_score: [
    "(very )?high (score|scores|marks|grades|percentage|rank)", "top (marks|grades|score|rank)", "[0-9]+ ?(%|percent)", "full marks",
    "straight as", "perfect score",
    "top (the |my )?(class|exam|year|batch|school)", "come first", "be the best",
  ],
  got_wrong: [
    "(got|get|getting) (it |them |those |the questions? |answers? )?wrong", "(questions?|answers?) i (may have |might have )?(missed|got wrong|messed up)",
    "missed (questions|marks)",
  ],
  collecting: [
    "collect\\w*", "hoard\\w*", "(too many|so many|lots of|tons of|loads of)( \\w+)? (books|resources|courses|materials|tutorials|channels|certificates|ideas)",
  ],
  school: [
    "school\\w*", "class", "classes", "lessons?", "homework", "schoolwork", "coursework", "assignments?", "academic\\w*",
    "subjects?", "grades?", "studies",
  ],
  exam: [
    "exams?", "examinations?", "tests?", "quiz(zes)?", "finals", "midterms?", "mocks?", "mock tests?", "papers?",
    "boards", "board exams?", "entrance exams?", "olympiads?",
  ],
  study: ["stud(y|ies|ied|ying)", "revis\\w*", "revision", "prep", "preparation", "preparing", "cram\\w*"],
  marks: [
    "marks?", "grades?", "scor(e|es|ed|ing)", "results?", "percentage", "percentile", "ranks?", "ranking", "gpa", "cgpa",
    "[0-9]+ ?(%|percent)",
  ],
  jee: ["jee", "neet", "iit", "competitive exams?", "entrance exams?", "coaching", "olympiads?", "cuet"],
  coaching: ["coaching", "coaching (class|classes|institute|centre|center)", "tuitions?", "institutes?"],
  notes: ["notes?", "notebooks?", "note taking"],
  memorize: ["memori[sz]\\w*", "memoris\\w*", "by heart", "rote", "mug up"],
  speed: [
    "slow(er|est)? than (everyone|others|expected|the rest|my friends|i should be)", "(i am|i m|am|me|myself) (so |too |very |really )?slow",
    "(working|work|works|reading|writing|typing|solving) (too |so |very |really )?slow(ly)?", "(too|so|very|really) slow(ly)? (in|at|on|when|during)",
    "(not|never) fast enough", "speed", "run(ning)? out of time", "ran out of time", "out of time",
  ],
  slow_app: [
    "(app|apps|site|website|code|program|project|game|page|it|laptop|computer|phone|wifi|internet)( \\w+){0,3} (is|feels?|runs?|so|too|really|very) slow",
    "performance", "lag\\w*", "takes (forever|ages) to load",
  ],
  first_questions: [
    "(spend\\w*|spent|waste\\w*) (too )?(much |long |ages |forever |so long )?(time )?(on|with) (the )?(first|early|earlier|opening|initial|one|a|hard|difficult|few) (few )?questions?",
  ],
  science: ["physics", "chemistry", "maths?", "mathematics", "biology", "calculations?"],
  chapter: ["textbooks?", "chapters?", "syllabus", "portions?", "topics?"],
  too_fast: [
    "(explains?|explaining|teach\\w*|goes|going|moves?|moving|speaks?|talks?) (way |much |so |really )?(too )?(quickly|fast)",
    "(cannot|can not) keep up", "faster than i can", "(moves?|moving|goes|going|explains?|teach\\w*) (way |much |so |really )?faster",
    "too (quick|fast) for me",
    "rush(es|ed|ing)? through",
  ],
  copying: ["cop(y|ying|ied) (my )?(homework|answers|work)", "cheat\\w*", "(ask|asking|asks) (for|to copy) my (homework|answers)"],
  unfair: ["unfair\\w*", "unjust", "(not|is not) fair", "biased"],

  // Career
  which_career: [
    "(what|which) (career|path|job|field|direction|course|major|stream)( \\w+){0,3} (i want|to (choose|pick|do|take|go into)|fits me|suits me|is right for me|for me)",
  ],
  bad_at: [
    "(i am|am|being|be|i will be|will be) (just |so |really |always )?(bad|terrible|awful|hopeless|useless) at", "not good at", "(belief|believe|think) (that )?i am bad",
  ],
  strengths_weaknesses: ["strong (in|at)", "good at", "weak\\w*", "strong ones?", "worst (subject|at)", "best at"],
  many_interests: [
    "(like|liking|love|loving|interested in|enjoy\\w*) (several|many|so many|lots of|too many|multiple|different)( \\w+){0,3} (things|fields|subjects|careers|areas|paths)",
    "interested in( \\w+){1,3} and \\w+",
  ],
  hobby_career: [
    "(turn|turning|make|making|become|becoming)( \\w+){0,4} (into )?(a )?(career|profession|full time job)", "(do|doing) (it|this|what i love) (for a living|professionally)",
  ],
  life_planned: [
    "(know|have|figure out|figured out|plan|planned)( \\w+){0,2} (my )?(whole|entire) (future|life)", "(whole|entire) (future|life) (planned|figured out|sorted)",
  ],
  fit_match: ["(does not|do not|not|never) (directly )?(fit|match|align with|suit|line up with)", "(fits?|matches|suits) me"],
  career: [
    "careers?", "professions?", "occupations?", "line of work", "(do|doing) with my life", "(want|wants|wanted) to (be|become) an? \\w+",
    "(future|dream) (job|career|path)", "jobs?", "engineer\\w*", "doctors?", "medicine", "medical", "law", "lawyers?", "architect\\w*",
    "accountan\\w*", "(computer|data) scien\\w*", "nurs(e|es|ing)", "pilots?", "designers?",
  ],
  field: ["fields?", "(area|areas) of (study|work|interest)", "domains?", "industr(y|ies)", "paths?", "directions?"],
  future: ["future", "long term", "years from now", "later in life", "after (school|college|graduation)"],
  subject_choice: [
    "(subject|stream|course|major|elective|degree)s? (choice|choices|selection|options?)",
    "(choose|choosing|chose|pick\\w*) (my )?(subjects?|stream|major|course|electives?|degree)", "(science|commerce|arts|humanities) stream",
  ],
  college: ["colleges?", "universit(y|ies)", "campus", "admissions?"],
  salary: [
    "salar(y|ies)", "well paid", "(high|better|good) pay(ing)?", "income",
    "(money|salary|pay) (or|vs|versus|over|and|instead of) (passion|interest|what i love)",
    "(passion|interest|what i love) (or|vs|versus|over|and|instead of) (money|salary|pay)",
  ],
  passion: ["passion\\w*", "(what i|things i) (love|enjoy)", "personal interests?", "dream job"],
  prestige: ["prestig\\w*", "status", "impressive", "respected", "(sounds?|looks?) (good|impressive)"],
  ai_jobs: [
    "(ai|artificial intelligence|automation|robots?|chatgpt) (will )?(take|taking|replace|replacing|change|changing|kill|killing|affect\\w*|ruin\\w*)",
    "(take|taking|replace|replacing) (my |the |our )?jobs?", "automation",
  ],
  ai_tools: ["ai tools?", "ai coding tools?", "chatgpt", "chat gpt", "copilot", "claude", "gemini", "(use|using|used) ai", "ai (to|for)"],
  competitive: ["competitive", "cut ?throat", "(tough|hard) to get into"],
  portfolio: ["portfolios?", "resumes?", "cvs?", "(show|showcase|demonstrate) my (work|skills|projects)", "github profile"],
  too_late: ["too late", "(started|starting|start) (too )?late", "late start\\w*", "too old (to|for)"],
  experience: ["experience\\w*", "internships?", "shadow\\w*"],
  advice_conflict: [
    "(conflicting|contradicting|contradictory|different|mixed|opposite) (advice|opinions|suggestions|views|methods|answers)",
    "different (\\w+ )?(methods|approaches|ways)", "(everyone|everybody|people) (says?|tells? me|gives? me) (something )?(different|opposite)",
  ],
  research_loop: [
    "research\\w* (\\w+ )?(endlessly|forever|for hours|for months|all the time|instead of)", "(never|cannot|can not) (decide|choose|commit)",
  ],
  lose_options: [
    "(los\\w*|clos\\w*|giv\\w* up|miss\\w* out on) (\\w+ )?(other|every other|all other|future) (options?|paths?|doors?|possibilities|opportunities)",
    "(limit|limits|limiting|close|closes|closing) (my )?(future )?(options|doors|choices)", "fomo", "fear of missing out",
    "miss(ing)? (out|things)",
  ],
  dislike_part: ["(hat|dislik|do not lik|do not enjoy|cannot stand)\\w* (a |the )?(big |major |main |large )?(part|parts|aspect|side)"],

  // Teamwork
  slacker: [
    "(not|never|is not|are not|does not|do not|did not|will not) (do|doing|does|did|done|pull\\w*|contribut\\w*|finish\\w*|complet\\w*) (their|his|her|any|anything|much|a thing|the)? ?(part|share|work|weight|bit|tasks?|job)",
    "slack\\w*", "freeload\\w*", "free ?rid\\w*", "miss(es|ed|ing)? (their|his|her) (part|deadlines?|tasks?)", "(does|did|do) nothing",
    "(is not|are not|does not|do not|did not|never) (doing|do|does|did) (anything|nothing|any work|a thing)",
  ],
  all_work: [
    "(doing|do|does|did) (almost |nearly )?(all|everything|most)( of)?( the)? (work|tasks)", "carry\\w* (the )?(team|group|project)",
    "(only one|the only person|only person) (doing|working)",
    "(doing|do|did) (the )?(whole|entire)( \\w+){0,2} (project|thing|assignment|work)", "(doing|do) (it|everything) (alone|by myself|on my own)",
  ],
  change_mind: [
    "chang\\w* (the |their |his |her |our )?(decisions?|plans?|minds?|rules|things|everything) (after|again|last minute|every time|all the time)",
    "(go|goes|went|going) back on", "(revers|undo)\\w* (the |our )?decision",
    "chang\\w* (the |their |his |her |our )?(decisions?|plans?|rules|things)( \\w+){0,3} (agreed|decided)",
  ],
  late_start: [
    "(start|started|starting|began|begin) (the |our |my |a )?(project|work|it|studying|preparation|prep|revision)? ?(way |much )?(too |very |so )?late",
  ],
  lost_messages: [
    "(messages?|information|updates?|things|decisions?) (get|gets|getting|got) (lost|buried|missed)", "(lost|buried) in (the )?(group )?chat",
  ],
  credit: [
    "(take|takes|took|taking|steal\\w*|stole) (the )?credit", "(claim\\w*|stole|steal\\w*) my (work|idea|ideas)",
  ],
  assigned: [
    "(assigned|given|got|gave me) (a |the )?(task|part|role|job|section)", "(do not|did not) know how to do (my |the |this )?(part|task|it)",
  ],
  absent: [
    "absent", "disappear\\w*", "vanish\\w*", "went missing", "(not|never|stopped) (show\\w*|turn\\w*) up",
  ],
  ideas_ignored: [
    "(my )?ideas? (are|is|get|gets|being|keep getting) (ignored|dismissed|shot down|overlooked)", "(ignore|ignores|ignoring|dismiss\\w*) my ideas?",
    "(nobody|no one) (listens|listen) to (me|my ideas)",
    "(listen|listens|listening) to my ideas", "my ideas",
  ],
  plan_no_build: [
    "(plan|planning|planned|talk|talking|discuss\\w*)( \\w+){0,3} (but |and )?(never|not|without) (actually )?(build|start|do|mak|execut)\\w*",
  ],
  features: ["(too many|so many|lots of|tons of|adding|add|keep adding) (new )?features?", "feature creep", "scope creep", "over ?ambitious"],
  sloppy_submit: [
    "(submit|hand in|send|turn in)\\w* (it |work |the work |our work |the project |the assignment )?(with|despite) (obvious |lots of |many )?(errors|mistakes|bugs|problems)",
  ],
  disorganized: ["disorgani[sz]ed", "(a |is a |still a |total |complete )mess", "chaos", "chaotic", "all over the place"],
  done_definition: [
    "(definition|definitions|idea|ideas) of (done|finished|complete)", "(what|when) (counts as|is) (done|finished|complete)",
    "(disagree|argue)\\w* (about|on|over) (when|whether|what) (it|the project) is (done|finished|complete)",
  ],
  lead: ["lead\\w*", "in charge", "captain", "coordinat\\w*"],
  bossy: ["bossy", "bossing", "boss (people|them|everyone|others) around", "controlling", "pushy", "domineering", "micromanag\\w*"],

  // Digital life
  reactions: [
    "(likes|reactions|views|comments|followers) (on|to)? ?(my )?(post|posts|photo|video|story)?",
    "(check\\w*|refresh\\w*) (how many )?(likes|views|reactions|comments|followers)",
    "(check\\w*|refresh\\w*)( \\w+){0,4} (likes|views|reactions|comments|followers)",
  ],
  instant_reply: [
    "(reply|respond|answer|text back)\\w* (instantly|immediately|right away|straight away|asap)", "(instant|immediate|quick) (replies|reply|response|responses)",
    "available (constantly|all the time|always|24 ?7)", "(always|constantly) (available|on call|there for (them|him|her))",
    "(expects?|expecting|wants?|demands?) me to (always |instantly |immediately )?(reply|respond|answer|be there|be available|text back)",
    "clingy", "needy",
  ],
  unwanted_contact: [
    "unwanted (messages?|texts?|attention|contact|advances|dms?|calls?|photos?|romantic)", "(keep|keeps|kept) (messaging|texting|calling|dming|contacting) me",
    "messages? (that )?i (do not|did not) (want|ask for)", "creep\\w*", "harass\\w*", "stalk\\w*",
  ],
  wrong_chat: [
    "wrong (chat|group|group chat|person|thread|channel|number)", "(sent|send|sending|shared|posted) (it |something |a message |that )?(to|in) the wrong",
  ],
  notification: ["notifications?", "pings?", "alerts?", "(check|checking|checked) (my )?(phone|messages|notifications|instagram|whatsapp|texts)"],
  social_break: [
    "(break|detox|time off|step back|stepping back|pause|quit|quitting|delete|deleting|deactivat\\w*) (from )?(social media|instagram|tiktok|snapchat|my phone|online|apps?)",
    "(social media|instagram|tiktok|phone|screen) (break|detox|fast)",
  ],
  tagging: ["tag(s|ged|ging)? me"],
  angry_post: ["angry (post|comment|message|tweet|reply)"],
  repost: ["re ?post\\w*", "(delet\\w*|remov\\w*|tak\\w* down) (and )?(re ?post\\w*|post\\w* again|upload\\w* again)"],
  trustworthy: [
    "legit\\w*", "scam\\w*", "fraud\\w*", "fake (account|profile|seller|website|site|person|page)", "phishing", "catfish\\w*",
    "trustworth\\w*", "(real|safe) or (fake|a scam)", "(is|are) (it|this|they|he|she|this person) (real|safe|legit|trustworthy|genuine)",
    "(interaction|account|person|profile|seller|message|offer|website|site) (is |was )?(genuine|real|legit|legitimate|trustworthy)",
  ],
  cyberbully: [
    "(bully\\w*|bullied|harass\\w*|target\\w*|troll\\w*|attack\\w*|picked on|ganged up on|mock\\w*) (online|on (social media|instagram|tiktok|snapchat|discord|the internet)|in (the )?comments)",
    "cyber ?bull\\w*",
  ],
  online_argument: [
    "(argu\\w*|fight\\w*|debat\\w*) (with )?(strangers|people|randoms|trolls)? ?(online|on (the internet|reddit|twitter|social media|instagram|youtube|tiktok)|in (the )?comments)",
    "comment sections?", "flame wars?",
  ],
  create_online: [
    "(build|start|starting|make|making|create|creating|grow|growing|launch\\w*) (a |an |my |something )?(youtube channel|channel|blog|podcast|following|audience|brand|online presence|something online|content)",
  ],
  presence: [
    "(online|digital|internet) (presence|footprint|image|reputation)",
    "(clean|cleaning|tidy|tidying) up (my )?(social media|online|profile|instagram|accounts?|posts)",
  ],
  offline_boring: ["(real life|offline|outside|everything else)( \\w+)? (feels?|is|are|seems?) (boring|dull)"],

  // Money
  spending_habit: [
    "(keep|keeps|kept|repeatedly|always|constantly) (spend|spending|spent)", "spend\\w* (the |my |all my )?(money|savings|pocket money|allowance)",
    "(saving|save|saved)( \\w+){0,3} but( \\w+){0,3} spend\\w*",
  ],
  money_where: ["where (my|the|all my|all the)( pocket)? money (goes|went|is going)", "(losing|lose|lost) track of (my )?(money|spending|where)"],
  money: [
    "money", "cash", "afford\\w*", "expensive", "cheap\\w*", "pric(e|es|ey|y)", "budget\\w*", "savings", "pocket money", "allowance",
    "purchas\\w*", "buy\\w*", "bought", "debt\\w*", "financ\\w*", "wallet", "bucks", "dollars?", "rupees?",
    "(spend|spending|spent) (money|cash|[0-9]+)", "(save|saving|saved) (money|up|cash|for)", "pay(ing)? (for|back|off)", "paid (for|back)",
  ],
  afford: [
    "(cannot|can not|could not|not) afford", "too expensive", "(out of|over) (my )?budget", "(do not|did not) have (the |enough )?money",
    "broke", "(tight|limited|small) budget", "(do not|did not) have (much|enough|a lot of)( money)?",
  ],
  impulse: ["impuls\\w*", "spur of the moment", "(bought|buy|buying) (\\w+ )?without thinking"],
  borrow: ["borrow\\w*", "lend\\w*", "lent", "loans?", "owe\\w*", "(pay|paid|paying) (me |it |them |him |her )?back"],
  bills: ["bills?", "payments?", "(financial|money) (commitments?|obligations?)", "subscriptions?", "fees?", "rent"],
  subscription: ["subscri\\w*", "memberships?", "netflix", "spotify", "(monthly|annual|yearly) (plan|fee|charge|payment)"],
  earn: [
    "earn\\w*", "part ?time (job|work|gig|income|responsibilit\\w*)", "side (job|hustle|income|gig)", "freelanc\\w*",
    "(make|making|made) (some |extra |my own )?money",
  ],
  saving_goals: ["(saving|save|saved) (up )?for (several|multiple|many|a few|different|two|too many) (things|goals)"],
  fun_spend: ["(spend\\w*|spent|buy\\w*) (money )?(on )?(fun|treats?|myself|things i (enjoy|like|want))"],
  discount: ["sales?", "discount\\w*", "coupons?", "bargains?", "black friday", "clearance", "[0-9]+ (%|percent) off"],
  peer_buy: [
    "(because|since) (my )?(friends|everyone|others|they|people) (have|has|own|bought|got)", "(keep up with|match) (my )?(friends|everyone|others)",
  ],
  ask_money: ["ask\\w* (my )?(parents|mom|mum|dad|family|them) (for|to (buy|pay|get))"],
  seller: [
    "sellers?", "online (stores?|shops?|websites?|sites?|marketplaces?|order|purchase)", "vendors?", "(buy|buying|order\\w*) (from|online)",
    "amazon", "ebay", "etsy",
  ],
  help_financially: ["(help|support|lend|give)\\w*( \\w+){0,2} (financially|with money)"],
  now_later: [
    "(long|short) ?term", "(now|today) (or|vs|versus) (later|the future)", "(later|the future) (or|vs|versus) (now|today)",
    "(useful|better|good) (now|later)", "(something|option) (now|later)",
  ],

  // Work and responsibilities
  responsibility: ["responsib\\w*", "duties", "obligations?", "commitments?"],
  workplace: [
    "at work", "my job", "the job", "new job", "first job", "part ?time job", "internships?", "interning", "intern", "office", "workplace",
    "shifts?", "boss", "bosses", "manager", "supervisor", "employer", "coworkers?", "co workers?", "colleagues?", "clients?",
  ],
  new_role: [
    "new (to (a |the |this )?(role|job|team|position|company)|role|job|position|intern|at (work|the job|my job))",
    "(just|recently) (started|joined|began)", "first (day|week|month|job)", "onboarding",
  ],
  extra_work: [
    "(extra|more|additional) (work|tasks|responsibilit\\w*)", "(dump\\w*|pil\\w*|load\\w*) (work|tasks|everything) on me",
  ],
  ask_questions: ["ask\\w* (a |any |more |too many |stupid |dumb )?questions?", "raise my hand", "answer\\w* (a |the )?questions? in class"],
  waiting_on: [
    "(wait|waiting|waited) (on|for) (a |my |the )?(teammate|coworker|colleague|someone|them|him|her|others|people)",
    "(blocked|stuck) (by|on|until) (someone|them|a teammate|their (part|work))",
  ],
  balance: ["balanc\\w*", "juggl\\w*", "fit\\w* (\\w+ )?(in|around|into) with", "fit (\\w+ )?in"],
  feedback: [
    "feedback", "(comments|notes|review|critique) on my (work|project|essay|art|drawing|code|writing|song|design)",
    "(reviewed|critiqued|graded|marked) (my )?(work|essay|project|assignment)",
  ],
  criticism: [
    "critic\\w*", "(harsh|negative|bad|mean|brutal|hurtful) (feedback|comments?|reviews?|remarks?)",
    "(marked|graded|judged|reviewed|criticized) ( ?\\w+){0,3} harsh\\w*",
    "(insult\\w*|trash\\w*|tore apart|torn apart|roasted) my (work|art|project|essay|writing|drawing|music|song|code|design)",
  ],
  workload_unclear: [
    "(unclear|unknown|not sure|uncertain|unsure) (\\w+ )?(workload|how much work|time commitment)", "how much (work|time) it (is|will be|would be|takes|will take)",
    "workload",
  ],
  not_learning: [
    "(not|never|am not|without) (feel\\w* (like|that) i am )?learn\\w*( anything| much| enough)?", "(nothing|not much) (new )?to learn",
  ],
  miss_deadline: [
    "(cannot|can not|will not|not going to|going to|might|may|could) (not )?(make|meet|hit) (the |my |this |a )?deadline",
    "miss(ed|ing)? (the |my |a |this |small )?deadlines?", "(late|behind) on (the |my )?(deadline|submission|assignment|task)",
  ],
  disagree_task: ["(disagree\\w*|do not agree) (with )?(how|the way)( \\w+){0,4} (done|handled|run|managed)"],
  more_responsibility: ["(more|bigger|extra|greater) (responsibilit\\w*|ownership|challenges?)", "(step|stepping) up", "promotion"],
  boundary: [
    "boundar\\w*", "cross(es|ed|ing)? (a |the |my )?(line|boundary|boundaries)", "(not|is not) okay with (me|it|that)",
    "(uncomfortable|not comfortable) with",
  ],
  ask_help: [
    "(ask|asking|asked|get|getting|seek\\w*|need|needing|reach\\w* out) (for |to )?(help|support|assistance)",
    "ask\\w* (\\w+ ){0,2}for help", "(hate|scared of|afraid of|bad at|not good at) asking",
  ],
  incapable: [
    "(look|looks|seem|seems|appear|appearing|looking) (\\w+ )?(incapable|incompetent|weak|stupid|dumb|useless|clueless)",
  ],
  two_options: [
    "two (good |different |reasonable |great |job |college |university |career )?(options|opportunities|offers|choices|paths|universities|colleges|jobs|schools|courses)",
    "(choose|choosing|pick|picking|torn|decide|deciding) between", "back and forth", "torn", "now or (wait|later)",
  ],
  either_or: [
    "(should i|whether to|choose|choosing|choice between|decide between|deciding between)( \\w+){1,6} (or|vs|versus)",
    "(choose|choosing|choice|decide|deciding) between( \\w+){1,6} and",
  ],
  skip_or_try: [
    "skip\\w* (a |the |this |that )?(hard |difficult |tough )?questions?", "attempt\\w*", "move on", "keep trying", "give up on (it|the question)",
  ],
  pros_cons: ["pros and cons", "(different )?(benefits|advantages|trade ?offs?|upsides|downsides|drawbacks)"],
  opportunity: ["opportunit(y|ies)", "offers?", "positions?", "chances?"],

  // Conflict and boundaries
  take_things: [
    "(take|takes|took|taking|use|uses|used|using|borrow\\w*|steal\\w*|stole|touch\\w*) (my )?(things|stuff|belongings|clothes|stationery|pens?|books|charger|food)",
    "without (asking|permission)",
  ],
  after_no: [
    "(after|even after|even though|although) (i )?(already )?(said|say|told (them|him|her)) no",
    "(will not|does not|do not|did not|refuse to|cannot) (take|accept|respect|hear) no", "(keep|keeps|kept) (pushing|pressuring|asking|insisting)",
  ],
  angry_disagree: [
    "(gets?|getting|becom\\w*|became) (angry|mad|upset|annoyed|defensive|aggressive)( \\w+){0,3} (disagree|say no)",
  ],
  blame: [
    "blam\\w*", "accus\\w*", "(my|their|his|her) fault", "scapegoat\\w*",
    "(something|things) (i|that i) (did not|never) (do|did|cause)", "(i|that i) did not (do|cause)",
  ],
  personal_info: [
    "(personal|private) (information|details|questions|life|data)", "nosy", "pry\\w*",
    "(ask|asks|asking|asked) (me )?(too many |so many |a lot of )?(personal|private|invasive) questions",
  ],
  go_along: ["(go|going|went) along with", "pressur\\w* (me )?(to|into) (agree|go along|side|join)"],
  after_fight: [
    "(reach\\w*|text\\w*|messag\\w*|talk\\w*|apologi\\w*|make up)( out)?( to (them|him|her))? (after|since) (the |our |a |an |that )?(argument|fight|falling out|disagreement)",
  ],
  rules_changed: [
    "(chang\\w*|break\\w*|broke|bend\\w*) (the )?(rules|deal|agreement|terms)", "(go|goes|went|going) back on (the |our |their |his |her )?(deal|agreement|word)",
  ],
  overcommit: [
    "(agree\\w*|said yes|say yes|committed|signed up|promised)( \\w+){0,4} (and|but)( \\w+){0,3} (realiz\\w*|realis\\w*|cannot|can not|could not|regret\\w*|wish\\w*|overloaded|overwhelmed)",
    "(said|told \\w+) (that )?i would (help|do|come|go)", "overcommit\\w*", "over commit\\w*", "(took|taken|take) on too much", "back(ed|ing)? out",
  ],
  rude_boundary: [
    "(rude|mean|selfish|harsh|cold) (to set|for setting|if i set|to say no|for saying no)", "(seem|seems|seeming|look|looks|come across as) (rude|mean|selfish)",
  ],
  drag_argument: [
    "(drag\\w*|pull\\w*|draw\\w*|bait\\w*|provok\\w*) (me )?(into|in to) (an |the |their |a )?(argument|fight|drama|conflict)",
    "(pick\\w*|start\\w*) (a fight|fights|arguments|drama) with me",
  ],
  someone_excluded: [
    "(someone|a classmate|a kid|a student|someone else|people|a friend|he|she|they)( \\w+){0,3} (is|are|being|get|gets|getting)( being)? (left out|excluded|bullied|picked on|targeted)",
    "stand up for (them|him|her|someone)",
  ],
  repeat_conflict: [
    "(the )?same (fight|argument|conflict|issue)", "(keep|keeps|kept) (having|fighting|arguing) (about )?the same", "repeated (arguments|fights|conflicts)",
    "after every apology",
  ],

  // Wellbeing
  disrupt_routine: [
    "(disrupt\\w*|ruin\\w*|mess\\w* up|throw\\w* off|wreck\\w*) (my )?(routine|schedule|sleep schedule|sleep|day|plans?)",
    "(making|makes|made) my routine (difficult|hard|impossible)",
  ],
  night_owl: ["(work|study|focus|productive)\\w* (best |better )?(late at night|at night)", "night owl"],
  phone_night: [
    "(phone|scroll\\w*|screens?|instagram|youtube|tiktok|reels)( \\w+){0,4} (in bed|at night|late at night|before (bed|sleep)|when i should be (sleeping|asleep))",
  ],
  sitting: ["(sit|sitting|sat|seated) (for )?(hours|too long|long periods|all day)", "sedentary", "posture"],
  meals: [
    "meals?", "skip\\w* (meals?|lunch|breakfast|dinner|food)", "(forget|forgot|forgetting|no time|too busy) to eat",
    "(do not|never|barely|hardly) eat (properly|enough|regularly|lunch|breakfast|dinner|anything)", "(eat|eating|ate) (properly|enough|regularly)",
  ],
  exercise: [
    "exercis\\w*", "work(ing)? ?outs?", "gym", "(go|going|went) (for a )?(run|running|jog\\w*|walk\\w*|swim\\w*)", "sports?",
    "physically active", "(more )?active", "fitness", "yoga", "stretch\\w*",
  ],
  unclear_reason: [
    "(for no|without (a|any)) (clear |obvious |good |real )?reason", "(do not|cannot) (know|tell|figure out) why",
  ],
  cant_relax: [
    "(cannot|can not|hard to|unable to|never|struggle to|difficult to) (fully )?(relax|rest|switch off|unwind|chill)",
    "(feel|feeling|felt) (like i should|i should) (be )?(productive|working|studying|doing something)",
  ],
  mental_load: ["(mentally|emotionally) (overload\\w*|exhaust\\w*|drain\\w*|tired|fried)", "brain (fog|feels? (fried|full|foggy|overloaded))", "overloaded"],
  healthy: ["health(y|ier|ily)?", "wellbeing", "well being", "self care"],
  abandon: [
    "abandon\\w*", "(give|gave|giving) up", "(drop|dropped|dropping|quit|quitting) (it|them|the habit|my habit|the routine|my routine)",
    "(fall|fell|falling) off", "(do not|cannot|never) stick (to|with)",
  ],
  avoid_stress: [
    "(use|using|used|play\\w*|watch\\w*) (\\w+ ){0,3}to (avoid|escape|forget|distract myself from)", "escapism",
    "(avoid\\w*|escap\\w*) (from )?(stress\\w*|responsibilit\\w*|reality|problems)",
  ],
  no_time_enjoy: [
    "(no|not enough|little|zero) time (left )?(for|to do) (things i (enjoy|like|love)|fun|hobbies|myself)",
    "(never|do not) (have time to|get to) (have fun|relax|enjoy)", "things i enjoy",
  ],
  old_habit: ["(old|bad) habits?", "(slip\\w*|slid|fall\\w*|fell|go\\w*|went) back (in)?to", "relaps\\w*"],
  seek_help: [
    "therap\\w*", "counsel\\w*", "psycholog\\w*", "psychiatr\\w*", "professional help", "mental health", "trusted adult",
    "(when|should) (i )?(get|ask for|seek|need) (professional )?help", "(enough|time) to (get|ask for|seek) help", "ask for help with",
    "(enough|time) to (talk to|see|speak to) (someone|a professional|a counsellor|a counselor|a therapist|an adult)", "talk to someone about",
  ],
  weeks: ["(for|over|past|last|several|many|a few|couple of) (\\w+ )?(weeks|months)", "(for )?(weeks|months) now"],

  // Coding
  code: [
    "cod(e|es|ing|ed|er|ers)", "programm\\w*", "scripts?", "software", "apps?", "web ?apps?", "websites?", "(front|back) ?ends?", "functions?",
    "python", "javascript", "typescript", "java", "react", "node", "html", "css", "repos?", "repositor\\w*", "github", "git",
    "compil\\w*", "deploy\\w*", "apis?", "sdk", "databases?", "sql", "frameworks?", "librar(y|ies)", "packages?", "npm",
    "dependenc(y|ies)", "developers?", "programmers?", "hackathons?", "ui", "ux", "frontend", "backend", "bugs?", "debug\\w*",
  ],
  bug: ["bugs?", "buggy", "debug\\w*", "errors?", "crash\\w*", "exceptions?", "glitch\\w*", "broken"],
  inputs: ["inputs?", "edge cases?", "test cases?"],
  deploy: [
    "deploy\\w*", "hosting", "production", "netlify", "vercel", "heroku", "(go|goes|going|went) live", "servers?",
    "(put|putting|get|getting) (it|my (app|site|project|website)) (online|live|up)",
  ],
  config: ["config\\w*", "environment variables?", "env (vars?|file)", "build (errors?|fails?|failing|failed)", "settings"],
  local: ["locally", "localhost", "(on|in) (my )?(computer|laptop|machine|local machine|dev server)", "in development"],
  secret_key: [
    "api keys?", "secret keys?", "(secrets|tokens?|credentials|passwords?) (in|exposed|leaked|visible|public)", "expos\\w*", "leak\\w*",
    "env file",
  ],
  copy_code: [
    "(copy|copied|copying|paste|pasted|pasting)( \\w+){0,3} (code|solution|answer|from (stack ?overflow|chatgpt|github|online|the internet|ai))",
    "stack ?overflow", "without (fully )?understanding",
  ],
  same_fix: [
    "(tried|try|trying) (the same|the same thing|everything|the same fix)", "(going|go|went) in circles",
    "(stuck|been stuck) (on|with) (this|a|the same) (bug|error|problem)",
  ],
  new_language: [
    "(learn|learning|switch\\w*|pick up|try) (a )?(new )?(programming )?(languages?|rust|golang|kotlin|swift|ruby|python|javascript|typescript|java)",
  ],
  preserve: [
    "(without|not|never|do not want to|afraid of|scared of) (wanting to )?(breaking|break|breaks|ruining|messing up) (anything|everything|what (already )?works|the (app|code|project|existing|rest)|existing (code|features|behaviou?r)|it)",
    "existing (behaviou?r|features|code)",
    "(will|might|could|would) (break|ruin|mess up) (my |the )?(app|code|project|site|website|game|program|everything|it)",
  ],
  add_feature: ["add\\w* (a |this |the |new |another )?(new )?features?"],
  polish_ui: [
    "polish\\w*", "(the |my )?(ui|ux|design|styling|css|looks|visuals|animations?|colou?rs|fonts?) (\\w+ )?instead of",
  ],
  external_service: [
    "(external|third party) (service|api|server|library|package)", "(my code|me) or (the |their )?(api|server|service|library|backend)",
  ],
  professional_look: ["(look|looks|looking|seem) (more |really |very )?(professional|polished|impressive)"],
  demo: ["demo\\w*", "demonstrat\\w*", "showcase\\w*", "exhibition\\w*", "(science |project )?fairs?", "expo", "judges"],
  complicated: [
    "complicat\\w*", "complex\\w*", "messy (code|project|codebase)", "spaghetti",
    "(afraid|scared|terrified|nervous) (to|of) (change|touch\\w*|refactor\\w*|edit\\w*)",
  ],
  framework_switch: ["(switch\\w*|chang\\w*|mov\\w*|migrat\\w*) (\\w+ )?(frameworks?|stacks?|librar(y|ies)|engines?)"],
  publish: [
    "publish\\w*", "(make|making|put|putting) (it|my (project|code|repo|app|game|work)) (public|online|live|out there)",
    "(release|releasing|launch\\w*|upload\\w*) (it|my)",
  ],
  explain: ["explain\\w*", "(describe|describing)( my| the| our)? (project|idea|work|problem|code)", "put (it|things) into words"],

  // Everyday decisions and small problems
  cannot_attend: ["(cannot|can not|could not|will not|not able to|unable to|not|never) (attend|come|make it|go)"],
  attend: [
    "attend\\w*", "(go|going|come|coming|show up) to (the |a |her |his |their |your )?(party|event|wedding|birthday|function|celebration|dinner|gathering)",
  ],
  errands: ["errands?", "chores?", "groceries", "grocery", "shopping", "post office", "pharmacy"],
  left_behind: [
    // Things left behind, not tasks forgotten: "forgetting my chores at home" is about chores.
    "(forgot|forget|forgetting|left|leave|leaving)(?!( \\w+){0,3} (chores|tasks|homework|work))( \\w+){0,3} (at home|behind|on the bus)( after leaving)?",
  ],
  double_booked: [
    "double ?book\\w*", "two (plans|things|events|commitments|activities)( \\w+){0,3} (at|on) the same (time|day)", "(clash|clashes|clashing|overlap\\w*)",
  ],
  same_time: [
    "(at|on|in) the same (time|day|week|weekend|evening|night|date)", "(all )?due (on )?the same day", "double ?book\\w*", "clash\\w*",
    "overlap\\w*", "conflict\\w* with", "during (my |the )?(exams?|tests?|finals|exam week)",
    "(the )?(day|week) (before|of) (my |the )?(exams?|tests?|finals)",
  ],
  ask_opinions: [
    "(ask|asking|asked) (everyone|everybody|people|others|my friends|all my friends|my parents|someone)( for)?( their)? (opinions?|advice|thoughts)",
    "(ask|asking|asked) (everyone|everybody|people|others) (opinion|opinions)", "opinions? before",
    "(cannot|can not|never) decide (anything )?(on my own|by myself|alone)",
  ],
  replace_item: [
    "(replace|replacing|replaced|upgrade|upgrading|buy\\w* a new|get\\w* a new)( \\w+){0,3} (even though|when|while|though) (it|they|mine) (still )?(work|works|is fine|are fine)",
    "repair\\w*", "(fix|fixing|mend\\w*) (it|my \\w+) or (replace|buy|get)", "still works", "(buy|get)\\w* (a )?new (one|\\w+)",
  ],
  lose_items: [
    "(lose|losing|lost|misplac\\w*|keep losing) (my |all my |the )?(keys|wallet|phone|charger|chargers|cables?|earphones|headphones|glasses|id card|cards?|books?|bag|items|important things|small (things|items|accessories)|links)",
    "misplac\\w*", "(cannot|can not|could not|never) find (my|the|it|them)", "where i (put|left|keep|saved)( \\w+){0,2} (it|them|things|stuff)",
  ],
  lose_track: ["(lose|losing|lost|keep losing) track", "(cannot|can not|hard to) keep track"],
  now_or_wait: [
    "(now|today|right away|immediately) or (wait|later|tomorrow)", "(should i|whether to) (wait|hold off)", "(do it|act|start|go) now or",
    "now or wait\\w*",
  ],
  event: [
    "events?", "part(y|ies)", "gatherings?", "birthday (party|parties|celebration)", "weddings?", "celebrations?", "reunions?", "concerts?",
  ],
  stay_home: ["(stay|stayed|staying) (at )?home", "(rather|prefer to) (stay in|be home|stay home)", "wish i (had )?(not gone|stayed|did not go)"],
  gift: [
    "gifts?", "(birthday|christmas|anniversary|graduation|a|the perfect) presents?", "presents? for",
    "(what to|what should i) (get|buy) (for )?(him|her|them|my \\w+)",
  ],
  directions: [
    "directions?", "lost (in|at) (a |the )?(new |unfamiliar |strange )?(city|place|area|town|station|airport|mall|building|campus)",
    "(unfamiliar|strange|unknown) (place|city|area|town)", "maps?", "navigat\\w*", "find(ing)? my way",
  ],
  in_public: ["in public", "public", "in front of (everyone|people|strangers)", "everyone saw", "people saw"],
  small_tasks: [
    "(tiny|small|little|quick|simple|easy|minor|annoying) (tasks?|things|jobs|chores|errands)", "(two|five|2|5) minute (task|job|thing)s?",
  ],
  join_activity: [
    "(join|joining|joined|sign\\w* up for|try\\w* out for) (a |an |the )?(new )?(club|team|class|activity|group|society|sport|band|choir|course|gym)\\w*",
    "where i (do not|dont) know (anyone|anybody|a single person)", "know nobody", "optional",
  ],
  unfinished: [
    "unfinish\\w*", "incomplete", "(not|never|rarely|seldom|have not|did not|has not) (finish\\w*|complet\\w*)", "finish\\w* (none|nothing)", "half (done|finished|way)", "halfway", "loose ends", "(pil\\w*|piling) up",
  ],
  easy_option: ["(easiest|easy|easier|simplest|lazy|comfortable) (option|choice|way|path|route|thing)", "(take|took|taking) the easy (way|route|path)"],

  // Organization
  scattered: [
    "scatter\\w*", "(spread|split) (out )?(across|between|over) (different|many|multiple|several|lots of)", "everywhere", "all over the place",
  ],
  files: ["files?", "folders?", "documents?", "docs", "drives?", "google drive", "downloads", "desktop", "pdfs?", "screenshots?"],
  messy: ["(desk|room|bedroom|workspace|work space|table)( \\w+){0,3} (messy|mess|cluttered|untidy|chaos|disaster)", "messy", "clutter\\w*", "untidy", "declutter\\w*", "tidy\\w*"],
  duplicate: ["duplicat\\w*", "copies", "(two|multiple|several) (versions|copies)"],
  versions: ["versions?", "version control", "(which|what) (file|copy|draft|version) is (the )?(latest|newest|final|current)", "drafts?"],
  tabs: ["(browser )?tabs?", "browser", "chrome"],
  hoard: [
    "(save|saving|keep|keeping|hoard\\w*) (everything|all of it|it all)", "(just )?in case (i|it) (need|might need|ever need)", "someday",
    "(keep|keeping|save|saving) (every|all) (file|thing|email|photo)s?", "just in case",
  ],
  inconsistent_system: [
    "(organi[sz]e|organi[sz]ing|sort|structure)\\w* (each|every|all) (subject|class|project|thing|folder)s? (in )?(a )?(different|differently)",
    "(each|every) (subject|class|project) (differently|in a different way)",
  ],
  file_backlog: ["(thousands|hundreds|tons|loads|lots) of (files|photos|emails|downloads|screenshots|documents)", "(huge|big|massive) (backlog|pile) of (digital )?(files|photos|emails|downloads|documents)"],
  links: ["links?", "bookmarks?", "urls?", "saved (posts|videos|articles|links)"],
  recurring: ["recurring", "(every|each) (week|month|year)", "(weekly|monthly|yearly|annual) (tasks?|chores?|bills?|payments?|things)", "routine tasks"],
  instead_of_work: [
    "instead of (doing )?(the )?(actual )?(work|working|studying|it|my task)", "(than|rather than) (actually )?(working|studying|doing (the )?work)",
  ],
  productivity_system: [
    "(productivity|organi[sz]ation|planning|note taking|study|self improvement|habit|routine) (systems?|apps?|setups?|tools?|templates?|methods?)",
    "(set|setting|setup|building|build\\w*|tweak\\w*|redesign\\w*|perfect\\w*) (up )?(my )?(system|systems|notion|planner|templates?|setup|workflow|dashboard)",
    "notion",
  ],
  review_notes: ["(review|reviewing|go through|going through) (my )?(notes|material)", "(hard|difficult|impossible) to (review|revise|go through)"],
  worth_saving: ["worth (saving|keeping)", "(what|which) (to|i should) (save|keep|delete|throw away|archive)"],
  too_many_apps: ["(too many|so many|several|multiple|lots of) (apps|tools|platforms|accounts|services)( for| that do)?( the same| one)? ?(thing|purpose|job)?"],
  spam: [
    "(too many|so many|lots of|tons of|unnecessary|pointless|useless|irrelevant|junk) (messages|emails|notifications|newsletters|mails|texts|group chats|pings)",
    "spam\\w*", "newsletters?", "inbox",
  ],
  never_finish_org: [
    "(start|started|starting|begin)( \\w+)? (organi[sz]\\w*|cleaning|sorting|decluttering)( \\w+){0,3} (never|but not|and not|without) (finish\\w*|complet\\w*|done)",
  ],
  calm_workspace: ["(calm|calmer|cleaner|minimal|simpler|tidier|quieter|less cluttered) (digital )?(workspace|work space|desktop|setup|space|screen|home screen)"],

  // Learning
  resources: ["resources?", "materials?", "(which|what) (course|book|channel|tutorial|source|website)", "sources?"],
  tutorial: ["tutorials?", "(youtube|online|video) (courses?|lessons?|guides?)", "walkthroughs?", "follow(ing)? along", "step by step"],
  theory_practice: [
    "(theory|theoretical|concepts?|reading|watching|lectures?|notes)( \\w+){0,3} (but|without|instead of|and not|never|not)( \\w+){0,3} (apply\\w*|practi[cs]\\w*|using it|doing|building|solving|use it)",
    "(apply|applying|use|using|put) (it|what i (learn|learned|know)|knowledge|theory) (in|into)? ?(practice|real (life|projects|problems))?",
    "theory", "lectures?",
  ],
  on_my_own: ["on my own", "by myself", "alone", "independently", "without (help|a tutorial|tutorials|the tutorial|examples|guidance|them)"],
  slow_progress: [
    "(progress|improvement|improving|getting better)( \\w+){0,3} (slow|slowly|too slow|stalled|stuck|plateau\\w*)", "plateau\\w*",
    "(not|never) (improving|getting better|making progress)", "(takes|taking) (so |too |forever |ages )?long to (get good|improve|master|learn)",
    "how long (it )?(takes|will take|is taking) to (get good|improve|master|learn|get better)", "mastery", "master(ing)? (it|a skill)",
  ],
  learn_many: ["learn\\w*( \\w+){1,5} (at the same time|at once|together)"],
  too_many_at_once: [
    "(too many|so many|several|multiple|lots of) (skills|things|hobbies|languages|instruments|subjects|goals|interests)",
    "(at once|at the same time|all at once)",
  ],
  limited_time: [
    "(limited|little|not much|barely any|very little) (free )?time", "(barely|hardly) have (any )?time", "(do not|never) have (enough |much )?time", "(only|just) (have )?([0-9]+|ten|twenty|thirty|fifteen|a few) (minutes|mins|hours) (a|per|each) (day|week)",
  ],
  forget_learned: [
    "(forget|forgot|forgetting|forgotten)( \\w+){0,3} (learn\\w*|studi\\w*|stud(y|ied)|lesson\\w*|material|formulas?|everything|what i (learned|studied|know|read))",
    "(gone|disappear\\w*|vanish\\w*) from my (head|brain|memory)", "(cannot|can not|do not) remember (anything|what i (learned|studied))",
  ],
  frustrated: ["frustrat\\w*", "(does not|did not|not) click\\w*", "fed up"],
  ready_harder: [
    "ready (for|to move on to|to try) (harder|more (difficult|advanced)|the next level|advanced|intermediate)", "(move|moving|step|level) up to",
    "harder (material|stuff|problems|questions|levels?|topics)",
  ],
  easy_practice: [
    "(only|just|always|mostly) (practi[cs]e|do|doing|solve|solving|stick to|play)( \\w+)? (what i am (already )?good at|the easy (ones|stuff|questions|problems|parts)|easy (questions|problems|stuff|songs|pieces))",
    "comfort zone", "(avoid|avoiding|skip|skipping) (the )?(hard|difficult|tough|harder) (ones|questions|problems|stuff|topics|parts)",
    "(find|already find) easy", "already good at",
  ],
  repeat_mistakes: [
    "(the )?same (kind of |type of |types of )?(mistakes?|errors?)", "(keep|kept|keeps) (making|repeating) (the )?(same )?(mistakes?|errors?)",
    "repeat\\w*( \\w+)? (mistakes?|errors?)",
  ],
  certificates: ["certificat\\w*", "certifications?", "badges?"],

  // Decisions
  decide: [
    "decid\\w*", "decision\\w*", "choos\\w*", "chose", "chosen", "choices?", "pick(ing)?", "options?", "alternatives?", "dilemma",
    "(cannot|can not) make up my mind", "undecided", "indecisive", "torn",
  ],
  back_forth: [
    "back and forth", "(keep|kept) (changing|switching|flip\\w*) (my )?mind", "flip flop\\w*", "waver\\w*", "second guess\\w*",
    "reconsider\\w*", "rethink\\w*",
  ],
  indecisive: ["(cannot|can not|could not) (decide|choose|pick|make up my mind)", "indecisive", "undecided", "torn( between)?", "stuck between"],
  incomplete_info: [
    "(incomplete|missing|limited|not enough|partial|without (all|enough|the full|full)) (\\w+ )?(information|facts|details|data|knowledge|picture)",
    "(do not|dont) (have|know) (all |enough of )?the (facts|details|information|full picture)", "more information",
  ],
  consequences: ["consequences?", "(what|whatever) (will|might|could) happen", "fallout", "repercussions?", "backlash"],
  disappoint: [
    "disappoint\\w*", "(let|letting) (them|him|her|people|my parents|everyone|my family) down",
  ],
  worst_case: ["(what|everything|all the things|things) (that )?(could|might|can|will) go wrong", "worst case\\w*", "catastroph\\w*"],
  affects_others: [
    "(affects?|affecting|impacts?|impacting)( \\w+){0,3} (other (people|person)|someone else|my (family|friend|friends|partner|best friend|parents|sister|brother)|another person|others)",
    "(affects?|affecting|impacts?|impacting) (them|him|her|us) too",
  ],
  safe_risky: [
    "(safe|safer|stable|secure) (option|choice|path|bet|route|job)", "(risky|uncertain|bold) (option|opportunity|choice|path|one)",
    "risk\\w*", "(take|taking) (a|the) (risk|leap|chance|gamble)", "play(ing)? it safe", "uncertain",
  ],
  hasty: [
    "(decid\\w*|chose|choose|said yes|agreed|bought|replied|acted) (too )?(quickly|fast|hastily|impulsively|without thinking|on impulse|on a whim|in a rush|rashly)",
    "(rushed|hasty|snap|quick|impulsive|careless) (decision|choice|reply)", "careless",
  ],
  no_perfect: [
    "(no|not a|there is no) (perfect|right|correct|clear|obvious|best) (answer|option|choice|solution|time|moment)",
    "(every|each|all|both) (option|choice)s? (has|have|comes with) (a )?(downside|drawback|cost|catch|problem)s?",
  ],
  all_important: [
    "(everything|all of it|all of them|it all) (feels?|seems?|is) (important|urgent|equally important|a priority)",
    "(cannot|can not|do not know how to) (prioriti[sz]e|decide what (matters|is important|comes first))",
  ],
  action_or_time: [
    "(need|needs|requires?) (action|me to act|doing something|time|patience) or (just )?(time|patience|to wait|action)",
    "(act|do something|intervene) or (wait|let it be|leave it|give it time)", "action or time",
  ],
  same_bad_decision: [
    "(the )?same (kind of |type of )?(bad |poor |wrong )?(decisions?|choices?)", "(keep|kept) (making|choosing) (the )?(same |bad |poor |wrong )+(decisions?|choices?)",
  ],
  big_change: ["(big|major|huge|drastic|radical) (change|changes|decision|move|leap|switch)", "(quit|quitting|drop\\w*) (school|college|my course|my job|everything)"],
  test_first: [
    "(test|testing|trial|try|trying|pilot|experiment\\w*) (it |the idea |this |things )?(first|out|before (committing|deciding)|without committing)",
    "(without|before) (testing|trying)",
  ],

  // Romance and social feelings
  tell_feelings: [
    "(tell|telling|confess\\w*|admit\\w*)( \\w+){0,3} (i like (them|him|her)|my feelings|how i feel|i have a crush|i love)", "confess\\w*",
    "(should i|whether to|if i should|if i) tell (them|him|her)", "(tell|telling) (a |my )?friend (about|that) (my feelings|i like)",
    "(tell|telling) (my |a )?friend i like",
  ],
  friend_or_more: ["friend(s|ship)? or (something )?more", "more than (just )?friends?", "mixed signals", "flirt\\w*"],
  energy_mismatch: [
    "(not as|less|not) (interested|into it|into me|invested|keen|excited)( as me| as i am)?", "(same|equal) (energy|effort|interest)",
    "(does not|do not|never) (seem|seems) (as )?(interested|into me|to care)", "(put|puts|putting) in (less|no) effort",
  ],
  jealous: ["jealous\\w*", "envy", "envious"],
  hang_out: ["hang(ing|s)? out", "hangout", "meet up", "meetup", "one on one", "(just )?the two of us", "invit\\w* (\\w+ )?to (hang|chill|go|come|meet)",
    "ask\\w* (him|her|them|someone) to (hang|chill|go out|meet)",
  ],
  rejection: [
    "reject\\w*", "(not|no longer) interested", "turn(ed|s)? me down", "unrequited", "(does not|do not|did not) (like|feel the same about) me( back)?",
    "(move|moving) (on|forward)", "(get|getting) over (him|her|them|it|someone)",
  ],
  not_mutual: ["(do not|does not|did not) feel the same( way)?", "not (interested|feelings) (in|for) (them|him|her)"],
  seen: [
    "(seen|viewed|read) (my )?(message|messages|text|story|dm|snap)", "read receipts?", "last seen", "(online|active) status",
    "(check\\w*) (if|whether) (he|she|they|someone) (has |is |have )?(seen|viewed|read|replied|online)",
    "left (me )?on (read|seen)",
  ],
  relationship_pressure: [
    "(pressur\\w*|push\\w*|teas\\w*)( me)?( \\w+){0,3} (to (date|get a (girlfriend|boyfriend|partner)|be in a relationship|ask (someone|her|him) out)|about (being )?single)",
    "still single", "why am i single",
  ],
  met_online: [
    "(met|meet|meeting|talking to|talk to|chatting with)( \\w+){0,2} (online|on (an app|instagram|discord|snapchat|tinder|a game))",
    "online (interaction|friend|relationship|person)", "(is|are) (he|she|they|this person) (real|genuine)",
  ],
  fantasize: [
    "(imagin\\w*|fantasi[sz]\\w*|daydream\\w*|picturing)( \\w+){0,3} (future|life|relationship|together|dating|marrying)",
    "(barely|hardly|do not really) know (them|him|her)", "barely know",
  ],
  things_changed: [
    "(friendship|crush|relationship|things)( \\w+)? (changed|change|changes|ended|ending|fell apart|faded)", "not (as )?close anymore",
    "(drift\\w*|grew|grow\\w*) apart",
  ],

  // Creative projects and hobbies
  creative: [
    "creative\\w*", "creativity", "creations?", "art", "arts", "artwork\\w*", "artist\\w*", "draw(ing|ings)?", "sketch\\w*", "paint\\w*",
    "music\\w*", "songs?", "songwrit\\w*", "guitar\\w*", "piano", "instruments?", "novels?", "poems?", "poetry", "comics?", "animat\\w*",
    "photograph\\w*", "film\\w*", "crafts?", "crafting", "danc\\w*", "sculpt\\w*", "stories", "story",
  ],
  hobby: ["hobb(y|ies)", "pastimes?", "for fun", "in my free time"],
  good_enough: [
    "(not|never|is not|will not be|would not be|might not be) (good|great) enough",
    "(afraid|scared|worried|fear\\w*) (that )?(it|my \\w+|i) (will|might|is going to|would) (be bad|suck|be terrible|not be good|be bad at)",
    "(doing|do) (it|things|something) (badly|wrong|poorly)", "(will|would|might|going to) be bad at (it|this)",
  ],
  share_work: [
    "(share|sharing|shared|show|showing|post|posting|upload\\w*)( \\w+){0,3} (i (made|created|wrote|drew|painted|composed|recorded|built)|my (art|music|song|songs|writing|story|poem|poems|drawing|drawings|work|videos?|game|creation|creations))",
    "something i (created|made|wrote|drew)",
  ],
  finish_vs_improve: [
    "(keep|kept|keeps|constantly|continuously|always) (improving|tweaking|editing|polishing|perfecting|redoing|changing)( \\w+){0,3} (instead of|rather than|and never|but never) (finish\\w*|releas\\w*|publish\\w*|shipping|submit\\w*|complet\\w*)",
    "instead of finishing",
  ],
  intimidated: ["intimidat\\w*", "(much|way|so much|far) (better|more talented|more skilled|more experienced)( at \\w+)?( than me)?", "out of my league"],
  ready_publish: [
    "(is it|is this|if it is|whether it is|not sure it is|when it is|if it|know if it) (is )?ready",
    "(publish|release|launch|ship)\\w* (\\w+ )?(yet|too early|too soon|before it is ready)",
  ],
  many_ideas: [
    "(collect\\w*|hoard\\w*) ideas", "(so many|too many|lots of|a notebook of|a list of|endless|hundreds of) ideas",
    "(cannot|can not|never) (pick|choose|commit to|decide on|settle on) (one|an idea)",
  ],
  collaborate: ["collaborat\\w*", "(work|working|team\\w*|partner\\w*) (up )?(together|with (someone|others|other people|a friend|another (artist|person|writer|musician)))"],
  control: ["(lose|losing|lost|loss of|giv\\w* up|keep|keeping) (creative |full )?control", "control freak"],
  creative_block: [
    "(creative|writer|writers|art|artist|artistic|creativity) block", "stuck creatively", "creatively stuck", "uninspired", "out of ideas",
    "no (ideas|inspiration)", "(cannot|can not) (think of|come up with) (anything|ideas|an idea)",
  ],
  technical: [
    "(how|whether|if|not sure how)( \\w+)? (technically|technical) (hard|difficult|complex|possible|feasible|doable)",
    "(technically|technical) (hard|difficult|complex|possible|feasible|doable)", "feasib\\w*", "doable",
    "(how )?(hard|difficult|complex) (\\w+ ){0,3}(technically|to build|to make|to code)",
  ],
  give_up_hard: [
    "(give up|gave up|giving up|quit\\w*|abandon\\w*|drop\\w*|stop\\w*)( \\w+){0,3} (when|whenever|once|as soon as|every time) (it|things|they|something|a part|a difficult part) (gets?|becomes?|is|appears)",
    "(whenever|when) (a )?(difficult|hard|tough|challenging) (part|bit|step|section) (appears|comes)",
  ],
  equipment: [
    "equipment", "gear",
    "(buy|buying|get|getting|upgrade\\w*) (a |an |new |better |expensive )?(camera|guitar|keyboard|piano|tablet|ipad|microphone|mic|drawing tablet|lens|kit|tools|setup)",
  ],

  // Personal growth and life direction
  meaningful: ["meaning\\w*", "purpose\\w*", "pointless", "(going|moving|heading) (nowhere|somewhere|toward\\w*)", "what is the point"],
  discipline: ["disciplin\\w*", "self control", "will ?power"],
  stuck_routine: [
    "(stuck|trapped) in (a |the |my )?(same )?(routine|rut|loop|cycle)", "rut", "(every|each) day (is|feels) the same", "same (old )?routine",
  ],
  others_expect: [
    "(what|things) (other people|others|everyone|my parents|people|society|my family) (expect\\w*|want\\w*)", "(others|other people|everyone) expectations",
  ],
  values: ["values?", "(what|things that) (really |actually )?matters? (most )?to me", "principles?", "(what i|things i) (really )?care about"],
  reliable: ["reliab\\w*", "dependab\\w*", "(keep|keeping|kept) (my )?(word|promises?|commitments?)", "(follow|following) through"],
  all_at_once: [
    "(improve|fix|change|work on|better) (everything|all of it|myself|my life|every part of (my life|myself))( \\w+){0,3} (at once|all at once|at the same time)",
    "(everything|all) at once", "(without )?chang\\w* everything",
  ],
  independence: ["independen\\w*", "freedom", "autonomy", "(treat|treats|treated) (me )?like a (child|kid|baby)", "(over|too) ?protective", "(too )?strict", "(let|allow) me (go out|do anything)", "go out more"],
  self_improvement: ["self ?(improvement|help|development|growth)", "(better|improve|improving|work on|working on) (myself|my life)"],
  teen_years: [
    "(teen|teenage|youth|young|school) (years|days|life)", "(wasting|missing out on|wasted) my (youth|teenage|teen|young|school|best) (years|days|life)",
  ],
  identity: ["identit\\w*", "who i (am|want to (be|become)|really am)", "my true self"],
  emotional: [
    "(react\\w*|respond\\w*|decid\\w*|act\\w*)( \\w+)? (emotionally|on emotion|in the moment)", "(lose|lost|losing) my (temper|cool)",
    "(temper|emotions) (get|gets|got) the better of me",
  ],
  act_accordingly: [
    "(act|acting|live|living|behave|behaving) (like|as|according to|accordingly|in line with)( \\w+){0,4} (who i want to (be|become)|my (values|goals)|it)",
    "act accordingly", "(know|knowing) (who i want to be|what i want) but",
  ],
  approval: ["approv\\w*", "validat\\w*", "what (other )?people think", "what others think", "people pleas\\w*", "please everyone"],
  life_progress: ["(making|make|made) progress( in life)?", "(going|getting) anywhere( in life)?", "in life", "where i am in life", "on track"],
  failure: ["failure\\w*", "setbacks?", "(deal|dealing|handle|handling|cope|coping) with (failing|losing|rejection|failure|setbacks)"],
  changing_interests: [
    "(interests?|passions?|hobbies|goals|what i (want|like)) (keep|keeps|kept|are always|always) (chang\\w*|shift\\w*|switch\\w*)",
    "(lost|losing|lose) (my )?(direction|sense of direction|way)", "changing interests",
  ],
  promises_self: [
    "promises? (to|i make to) myself", "(break|breaking|broke|keep|keeping|kept) (my )?promises?", "(let|letting) myself down",
  ],
  simplify: ["simplif\\w*", "(take|taking) on (more|less|fewer)", "(do|doing) (less|fewer things)", "say(ing)? yes to (more|everything)"],
  grow_year: ["(look|looking) back (in|after) a year", "(a )?year from now", "(grow|grew|growth|grown)( as a person)?", "in a year"],

  // Practical life skills
  cooking: [
    "(learn|learning|teach me|how) (to )?cook\\w*", "cook(ing)? (for myself|my own|basic|simple)", "(learn|learning|make|making)( \\w+){0,3} meals?",
    "basic meals?", "(make|making|prepare|preparing) my own (food|meals?|dinner|lunch|breakfast)", "meal prep",
  ],
  documents: [
    "(important )?documents?", "paperwork", "passports?", "(id|identity) (cards?|documents?|papers?)", "birth certificates?", "papers",
  ],
  talk_adults: [
    "(talk\\w*|speak\\w*|communicat\\w*) (to|with) (an? |the )?(unfamiliar |older )?(adults?|grown ups?|older people|officials|staff|principal|authority figures)",
    "(unfamiliar|older) (adults?|people)", "adults?",
  ],
  household: [
    "household( tasks| chores| jobs)?", "chores?", "(house|home) ?(work|tasks|jobs|duties)", "laundry", "dishes", "(clean|cleaning|tidy|tidying) (my |the |up )?(room|house|kitchen|bathroom)",
    "(take|taking) out the (trash|bins|rubbish|garbage)", "(make|making) my bed",
  ],
  trip: [
    "plan\\w*( \\w+){0,3} (trips?|vacations?|holidays?|journeys?|getaways?)", "(trip|vacation|holiday) (planning|plans?)",
    "(book|booking) (tickets|flights|hotels?|a hostel)", "travel(l?ing)? (plans?|abroad|alone|with friends)",
  ],
  appointment: [
    "appointments?", "phone calls?", "(make|making|book|booking) (a |an )?(call|booking|reservation)", "service calls?", "call (the|a) (doctor|dentist|clinic|shop|company|office)",
    "calling (the|a)? ?(doctor|dentist|clinic|shop|company|office)", "calling to",
  ],
  whom_to_ask: ["(who|whom) to ask", "(who|whom) (should|can|could) i ask", "who (can|could|would) help"],
  computer: [
    "(clean|cleaning|speed|speeding|fix|fixing|maintain\\w*|look after|update\\w*) (up )?(my |the )?(computer|laptop|pc)",
    "(computer|laptop|pc) (maintenance|is slow|running slow|keeps crashing|is full)", "maintenance", "viruses?", "malware",
  ],
  accessories: [
    "(lose|losing|lost|misplac\\w*|keep losing|cannot find|can not find|forget|forgetting)( \\w+){0,2} (chargers?|cables?|earphones|headphones|earbuds|accessories|adapters?)",
    "small accessories",
  ],
  night_before: ["(the )?night before", "(pack|packing) (my )?bag", "ready for (school|tomorrow|the next day)", "get(ting)? ready"],
  compare_products: [
    "compar\\w* (\\w+ )?(products|options|phones|laptops|brands|models|prices)", "reviews", "which (one|phone|laptop|brand|model) to buy",
    "before (buying|i buy|purchasing)",
  ],
  backup: ["back(ing|ed)? ?up", "backups?", "cloud (storage|backup)", "lost (all )?my (files|work|data|photos)"],
  emergency: ["emergenc\\w*", "(be|being|get|getting) (better )?prepared", "first aid", "(plan|ready) for (the )?unexpected", "unexpected problems?"],
  refund: ["refund\\w*", "(return|returning|exchange|exchanging) (it|an item|a product|something)", "overcharg\\w*", "wrong order", "correction", "customer service", "complain\\w* to (the )?(shop|store|company)"],
  explain_problem: ["(explain|explaining|describe|describing) (a |my |the )?(practical )?(problem|issue)( clearly)?"],
  passwords: ["passwords?", "log ?in", "logins?", "locked out", "account recovery", "(forgot|forget|forgotten) my password", "two factor"],
  week_plan: ["(plan|planning|schedule|scheduling) (my |the |a |our )?week", "weekly (plan|schedule)", "realistic\\w*", "unrealistic"],
  small_problems: ["(small|little|minor|tiny) (problems|issues|things)", "(panic|panicking|freak out|stress) (over|about) (small|little|minor|tiny)"],
};

// Category themes: the words that describe each category as a whole.

export const THEMES: Record<string, string> = {
  school: "school class classes lesson subject teacher homework assignment classmate student coursework studies",
  exams: "exam exams test tests mock paper quiz marks score result revision revise study preparation",
  jee: "jee neet iit coaching competitive entrance mock rank percentile physics chemistry maths chapter syllabus backlog",
  friends: "friend friends friendship mates hang out social",
  family: "family parents mom mum dad mother father sibling brother sister home house",
  communication: "say tell talk conversation message ask explain words",
  confidence: "confidence confident doubt insecure nervous embarrassed judged",
  motivation: "motivation motivated procrastinate lazy start productive focus",
  time: "time schedule routine timetable plan busy deadline late",
  career: "career job future college university degree field profession stream major",
  teamwork: "group team teammate project partner member",
  digital: "online social media phone app post chat instagram internet screen",
  money: "money spend buy save budget afford price pay expensive",
  work: "work job internship intern boss manager colleague shift responsibility office",
  boundaries: "boundary conflict respect pressure argue fight",
  wellbeing: "health healthy sleep tired stress energy exercise eat rest wellbeing",
  coding: "code coding program programming app website project software developer bug deploy",
  everyday: "errand plan event choose everyday",
  organization: "organize organized mess messy files notes folder system clutter tidy",
  learning: "learn learning skill practice tutorial course improve",
  decisions: "decide decision choice choose option uncertain unsure",
  romance: "crush date relationship romantic feelings love",
  creative: "creative art draw music write design hobby project",
  growth: "goal grow growth life direction discipline improve habit",
  "life-skills": "practical skill household chore adult life",
};
