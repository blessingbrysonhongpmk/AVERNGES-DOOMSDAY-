import { PACK_01 } from './quiz/pack01.js';
import { PACK_02 } from './quiz/pack02.js';
import { PACK_03 } from './quiz/pack03.js';
import { PACK_04 } from './quiz/pack04.js';
import { PACK_05 } from './quiz/pack05.js';
import { PACK_06 } from './quiz/pack06.js';
import { PACK_07 } from './quiz/pack07.js';
import { PACK_08 } from './quiz/pack08.js';
import { PACK_09 } from './quiz/pack09.js';
import { PACK_10 } from './quiz/pack10.js';

const RAW_ALL_QUESTIONS = [
  ...PACK_01,
  ...PACK_02,
  ...PACK_03,
  ...PACK_04,
  ...PACK_05,
  ...PACK_06,
  ...PACK_07,
  ...PACK_08,
  ...PACK_09,
  ...PACK_10,
];

function isValidQuestion(item) {
  if (!item || typeof item !== 'object') return false;
  if (!item.id || typeof item.correctIndex !== 'number') return false;
  if (item.correctIndex < 0 || item.correctIndex > 3) return false;
  for (const lang of ['en', 'ta']) {
    const block = item[lang];
    if (!block || !block.question || !Array.isArray(block.options) || block.options.length !== 4) {
      return false;
    }
  }
  return true;
}

export const MCU_QUIZ_QUESTIONS = RAW_ALL_QUESTIONS.filter(isValidQuestion);

export const INFINITY_STONES = [
  {
    id: 'space',
    minScore: 2,
    color: '#3B82F6',
    en: {
      name: 'Space Stone',
      title: 'SPACE STONE UNLOCKED',
      shortUnlock: 'Unlocked at 2 correct answers',
      message: 'The Tesseract resonates across dimensional coordinates. Warp pathways secured in your Avengers Vault.',
    },
    ta: {
      name: 'Space Stone',
      title: 'SPACE STONE UNLOCK AAYIDUCHU',
      shortUnlock: '2 correct answers-ku unlock aagum',
      message: 'Tesseract un Vault-la lock aayiduchu! Space energy kooda nalla kickstart pannitta Avenger.',
    },
  },
  {
    id: 'mind',
    minScore: 4,
    color: '#EAB308',
    en: {
      name: 'Mind Stone',
      title: 'MIND STONE UNLOCKED',
      shortUnlock: 'Unlocked at 4 correct answers',
      message: 'Sharp recall detected. You cleared recruit calibration and awakened cosmic intellect.',
    },
    ta: {
      name: 'Mind Stone',
      title: 'MIND STONE UNLOCK AAYIDUCHU',
      shortUnlock: '4 correct answers-ku unlock aagum',
      message: 'Semma brain power! Recruit level thaandi super MCU memory-oda Mind Stone thookitta.',
    },
  },
  {
    id: 'reality',
    minScore: 6,
    color: '#EF4444',
    en: {
      name: 'Reality Stone',
      title: 'REALITY STONE UNLOCKED',
      shortUnlock: 'Unlocked at 6 correct answers',
      message: 'The Aether bends to your lore mastery. Casual viewers rarely cross this clearance tier.',
    },
    ta: {
      name: 'Reality Stone',
      title: 'REALITY STONE UNLOCK AAYIDUCHU',
      shortUnlock: '6 correct answers-ku unlock aagum',
      message: 'Aether energy un kaila! Suthama casual fan illa nee — proper MCU expert range vandhutta.',
    },
  },
  {
    id: 'power',
    minScore: 8,
    color: '#A855F7',
    en: {
      name: 'Power Stone',
      title: 'POWER STONE UNLOCKED',
      shortUnlock: 'Unlocked at 8 correct answers',
      message: 'Raw celestial surge verified. Eight confirmed answers place you among Earth’s mightiest experts.',
    },
    ta: {
      name: 'Power Stone',
      title: 'POWER STONE UNLOCK AAYIDUCHU',
      shortUnlock: '8 correct answers-ku unlock aagum',
      message: 'Mass performance! 8 correct pottu Orb power full-ah control pannitta. Vera level!',
    },
  },
  {
    id: 'time',
    minScore: 9,
    color: '#22C55E',
    en: {
      name: 'Time Stone',
      title: 'TIME STONE UNLOCKED',
      shortUnlock: 'Unlocked at 9 correct answers',
      message: 'The Eye of Agamotto opens. One final answer separates you from total Multiverse perfection.',
    },
    ta: {
      name: 'Time Stone',
      title: 'TIME STONE UNLOCK AAYIDUCHU',
      shortUnlock: '9 correct answers-ku unlock aagum',
      message: 'Doctor Strange-e impress aagara alavukku timeline ellam correct-ah vechrukka. Innum ore oru step!',
    },
  },
  {
    id: 'soul',
    minScore: 10,
    color: '#F97316',
    en: {
      name: 'Soul Stone + Infinity Gauntlet',
      title: 'SOUL STONE + INFINITY GAUNTLET ACHIEVED',
      shortUnlock: 'Unlocked for a 10/10 perfect run',
      message: 'All six Infinity Stones forged into the Nano Gauntlet. Ultimate Multiverse Legend status confirmed.',
    },
    ta: {
      name: 'Soul Stone + Infinity Gauntlet',
      title: 'SOUL STONE + INFINITY GAUNTLET ACHIEVED',
      shortUnlock: '10/10 perfect score eduthaa unlock aagum',
      message: '6 Stones-um Gauntlet-la lock aagi snap ready! Thalaiva, nee dhaan true Multiverse Legend!',
    },
  },
];

export const QUIZ_ACHIEVEMENTS = [
  {
    id: 'spider-sense',
    en: {
      title: 'Spider-Sense',
      desc: 'Achieve a 5-answer correct streak inside a single session.',
    },
    ta: {
      title: 'Spider-Sense',
      desc: 'Ore round-la continuously 5 questions correct pottu tingle trigger pannu.',
    },
  },
  {
    id: 'super-soldier',
    en: {
      title: 'Super Soldier',
      desc: 'Score 7 or higher (70%+ accuracy) with steady tactical precision.',
    },
    ta: {
      title: 'Super Soldier',
      desc: '70% mela (7+ correct) score eduthu Steve Rogers level accuracy kaattu.',
    },
  },
  {
    id: 'thunder-power',
    en: {
      title: 'Thunder Power',
      desc: 'Achieve 8 or more correct answers in a single mission.',
    },
    ta: {
      title: 'Thunder Power',
      desc: 'Ore test-la 8 illana adhukku mela correct pottu Stormbreaker power unlock pannu.',
    },
  },
  {
    id: 'nano-armor',
    en: {
      title: 'Nano Armor',
      desc: 'Complete a flawless 10/10 round without missing a single question.',
    },
    ta: {
      title: 'Nano Armor',
      desc: 'Oru mistake kooda illama full 10/10 perfect round adichu Mark 85 badge vaangu.',
    },
  },
];

export const FAN_RANKS = [
  {
    id: 'tourist',
    min: 0,
    max: 1,
    en: { label: 'Multiverse Tourist', subtitle: 'Just passing through Earth-616 on sightseeing duty.' },
    ta: { label: 'Multiverse Tourist', subtitle: 'Just tourist visa-la Earth-616 suthi paakka vandha maari irukku!' },
  },
  {
    id: 'trainee',
    min: 2,
    max: 3,
    en: { label: 'SHIELD Trainee', subtitle: 'Basic clearance noted, but heavy archive study required.' },
    ta: { label: 'SHIELD Trainee', subtitle: 'Konjam basics therinjirukku, aana innum neraya MCU homework balance!' },
  },
  {
    id: 'recruit',
    min: 4,
    max: 5,
    en: { label: 'Avengers Recruit', subtitle: 'Solid foundation across major sagas and teams.' },
    ta: { label: 'Avengers Recruit', subtitle: 'Paravaala pa, core story ellam nalla memory-la vechrukka!' },
  },
  {
    id: 'elite',
    min: 6,
    max: 7,
    en: { label: 'Elite Avenger', subtitle: 'Sharp command of timelines, scenes, and character motives.' },
    ta: { label: 'Elite Avenger', subtitle: 'Semma mass! Timeline connections ellam sharp-ah catch pannitta.' },
  },
  {
    id: 'mightiest',
    min: 8,
    max: 9,
    en: { label: "Earth's Mightiest Fan", subtitle: 'Near-encyclopedic mastery of the Marvel Cinematic Universe.' },
    ta: { label: "Earth's Mightiest Fan", subtitle: 'Verithanamana fan da nee! Un knowledge paathu Avengers-e shock!' },
  },
  {
    id: 'legend',
    min: 10,
    max: 10,
    en: { label: 'Multiverse Legend', subtitle: 'Flawless 10/10 grandmaster of every MCU chapter.' },
    ta: { label: 'Multiverse Legend', subtitle: 'Thalaiva 10/10! Neenga dhaan MCU-oda true Multiverse Legend!' },
  },
];

export function getFanRank(score) {
  return (
    FAN_RANKS.find((r) => score >= r.min && score <= r.max) ||
    FAN_RANKS[0]
  );
}

export const IRON_MAN_COMMENTS = {
  below4: {
    en: [
      "Seriously? That's your MCU knowledge? Even the Infinity Stones have more information than you right now. Go rewatch those movies. Your Avengers membership is under review!",
      "I ran a diagnostic on your score and JARVIS asked if you accidentally watched a different studio's movies. Grab some shawarma, rewatch Phase 1 through 5, and try again.",
      "Look, I admire the confidence, really. Walking into a 10-question Avengers intel check and scoring under 4 takes special talent. Report back after a weekend marathon.",
      "Good news: you didn't break the Multiverse. Bad news: you definitely didn't pay attention to half the scenes. Hit play on that Watchlist, rookie.",
    ],
    ta: [
      "Seriously? Idhu dhaan un MCU knowledge-aa? Thanos kooda un score paathu confuse aayiruppaan! First MCU movies ellathayum nalla rewatch pannu, appuram vaa Avenger!",
      "Yov enna score idhu? Theatre-la popcorn saapda poyittu screen paakkama vandha maari irukke! Weekend full-ah Avengers watchlist binge pannitu return vaa.",
      "Un confidence nalla irukku boss, aana 4 kooda thaandala na FRIDAY-e un Avengers ID card block pannidum. Poi Phase 1-la irundhu restart pannu!",
      "Nalla velai Kang illa Thanos idhai paakkala... illana avangale unga kitta quiz guide koduthuruppanga! Namma Roadmap section open panni rewatch mudichittu vaa.",
    ],
  },
  tier4to5: {
    en: [
      "Okay... at least you know which universe you're living in. But don't celebrate yet. You've got homework, recruit.",
      "Not terrible—you survived the opening wave without embarrassing the lab. Tighten up your Phase 4 and Time Heist trivia and maybe I'll upgrade your suit.",
      "Respectable rookie numbers. You caught the headline moments, now start noticing the details between the scenes.",
      "Halfway to greatness, halfway to needing a refresher course. Keep grinding before Doom shows up at the front door.",
    ],
    ta: [
      "Okay... at least nee endha universe-la irukkeennu unakku theriyudhu! Aana ippo celebrate pannaadha recruit, innum konjam homework balance irukku.",
      "Paravaala boss, minimum pass border thaanditta. Aana time heist details and series connections innum konjam sharp aaganum.",
      "Suit fit aagudhu, aana armor polish panna vendiyadhu irukku! Innum oru round try panni 6+ thodu paappom.",
      "Main scenes ellam correct-ah solra, small twists-la mattum konjam slip aagudhu. Next attempt-la Reality Stone mela eye vai!",
    ],
  },
  tier6to7: {
    en: [
      "Not bad. You've got some serious MCU knowledge. Still, don't let that ego get bigger than my suit.",
      "Impressive precision. You actually tracked the post-credits setups and villain motives instead of just watching the explosions.",
      "Now we're seeing Avenger-grade recall. A couple more clean reads and even Doctor Strange will ask you for timeline notes.",
      "Solid clearing score. Stark R&D approves your dossier—now push for 8+ if you think you're ready for the big leagues.",
    ],
    ta: [
      "Paravaala pa, sema sharp MCU knowledge vechrukka! Aana ippo over-confidence aagi en suit vida periya ego valathukkaadha.",
      "Super score machi! Fight scene mattum illama post-credits, weapons, timeline ellam notice panni paathrukka polaye.",
      "Elite range reach aayitta! Innum rendu-moonu questions correct pannirundha Stark Tower-la unakkum oru lab key koduthirukkalam.",
      "Serious Marvel fan vibe adikkudhu! Reality Stone unlock aayiduchu, next target Power Stone 8+ thaan.",
    ],
  },
  tier8to9: {
    en: [
      "Now we're talking! You've clearly done your homework. Welcome to the elite fan club.",
      "Whoa—someone actually read the Sokovia Accords fine print and memorized Pym Particle physics. Consider me mildly intimidated.",
      "You crushed 8+ out of 10 without breaking a sweat. One hairline slip kept you from perfection, and honestly? Still phenomenal.",
      "That's peak Avengers Compound clearance right there. One more clean shot and that golden Gauntlet sits in your vault forever.",
    ],
    ta: [
      "Idhu dhaan da score! Proper-ah homework ellam mudichittu vandhurukka. Elite MCU fan club-kku welcome!",
      "Mersal score thala! Sokovia Accords-la irundhu TVA Temporal Loom varaikkum ellaam viral nuni-la vechrukka polaye.",
      "8+ score pottu Power Stone thookitta! Innum oru small twist miss aagala na full Gauntlet inniku un kaila irundhurukkum.",
      "FRIDAY un report paathu whistle adikkudhu! Earth's Mightiest Fan title-kku 100% worthy performance.",
    ],
  },
  perfect10: {
    en: [
      "FRIDAY, scan this player again. Perfect 10/10 score? Either this person is a genius or they've been secretly working at the Avengers Compound. Respect.",
      "Ten out of ten. No hints wasted, all six Stones locked. Honestly, you might know my suit specs better than I do.",
      "Hold everything—somebody just speed-ran every phase of the MCU without blinking. Pull up a chair next to Bruce and Reed, legend.",
      "Flawless execution across all 10 scenarios. Consider the Infinity Gauntlet officially yours—and please don't snap away half my coffee budget.",
    ],
    ta: [
      "FRIDAY, indha player-ai again scan pannu! Full 10/10 perfect score-aa? Ivanga genius-ah irukkanum illana secret-ah Avengers Compound-la work pannanum. Respect!",
      "Vera maari thalaiva! Oru question kooda miss pannama 6 Infinity Stones-um Gauntlet-la lock pannitta. En Mark 85 specs kooda unakku enna vida nalla theriyum pola!",
      "10/10 perfect run!! Kevin Feige kitta secret script vaangi padicha maari ellaam correct-ah adichutta. Pure Multiverse Legend!",
      "Full Nano Armor status unlocked! Indha speed and memory paatha Doctor Doom kooda quiz poduradhukku munnaadi yosippaan!",
    ],
  },
};

export function pickIronManComment(score, language = 'en') {
  let tier = 'below4';
  if (score >= 10) tier = 'perfect10';
  else if (score >= 8) tier = 'tier8to9';
  else if (score >= 6) tier = 'tier6to7';
  else if (score >= 4) tier = 'tier4to5';

  const pool = IRON_MAN_COMMENTS[tier]?.[language] || IRON_MAN_COMMENTS[tier].en;
  return pool[Math.floor(Math.random() * pool.length)];
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareShuffledQuestion(candidate) {
  const perm = shuffleArray([0, 1, 2, 3]);
  const newCorrectIndex = perm.indexOf(candidate.correctIndex);

  return {
    ...candidate,
    correctIndex: newCorrectIndex,
    en: {
      ...candidate.en,
      options: perm.map((idx) => candidate.en.options[idx]),
    },
    ta: {
      ...candidate.ta,
      options: perm.map((idx) => candidate.ta.options[idx]),
    },
  };
}

/**
 * Splits a pool by readability so short, punchy, iconic Easy & Medium questions
 * naturally lead the opening questions without sacrificing randomization variety.
 */
function pickByProgressiveCurve(sourcePool, targetCount, mode) {
  if (mode === 'pro') {
    return shuffleArray(sourcePool).slice(0, targetCount);
  }

  const crispEasy = shuffleArray(
    sourcePool.filter((q) => q.difficulty === 'Easy' && q.en.question.length <= 98)
  );
  const otherEasy = shuffleArray(
    sourcePool.filter((q) => q.difficulty === 'Easy' && q.en.question.length > 98)
  );
  const crispMed = shuffleArray(
    sourcePool.filter((q) => q.difficulty === 'Medium' && q.en.question.length <= 122)
  );
  const otherMed = shuffleArray(
    sourcePool.filter((q) => q.difficulty === 'Medium' && q.en.question.length > 122)
  );
  const hardPool = shuffleArray(sourcePool.filter((q) => q.difficulty === 'Hard'));

  const picked = [];
  const usedIds = new Set();
  const pushFrom = (arr, limit) => {
    for (const q of arr) {
      if (picked.length >= targetCount || limit <= 0) break;
      if (usedIds.has(q.id)) continue;
      usedIds.add(q.id);
      picked.push(q);
      limit--;
    }
  };

  if (mode === 'rush') {
    // Ultra-snappy rapid fire: easiest & shortest prompts dominate
    pushFrom(crispEasy, Math.ceil(targetCount * 0.65));
    pushFrom(otherEasy, Math.ceil(targetCount * 0.2));
    pushFrom(crispMed, targetCount - picked.length);
  } else {
    // 'fun' (Default): 14 Easy warm-ups -> 8 crisp Medium -> 3 Boss finishers
    const easyTarget = Math.round(targetCount * 0.56);
    const medTarget = Math.round(targetCount * 0.32);
    pushFrom([...crispEasy, ...otherEasy], easyTarget);
    pushFrom([...crispMed, ...otherMed], medTarget);
    pushFrom(hardPool, targetCount - picked.length);
  }

  // Fallback fill strictly inside sourcePool so count is always reached cleanly
  if (picked.length < targetCount) {
    pushFrom([...crispEasy, ...otherEasy, ...crispMed, ...otherMed, ...hardPool], targetCount - picked.length);
  }

  return picked;
}

/**
 * Selects exactly `count` (10) unique questions from the 1000-question MCU bank,
 * prioritizing unseen questions outside `recentIds`, using an accessible progressive curve
 * by default (`fun` | `rush` | `pro`), and shuffles each question's 4 options identically across EN & TA.
 */
export function selectQuizSessionQuestions(recentIds = [], count = 10, mode = 'fun') {
  const pool = MCU_QUIZ_QUESTIONS;
  if (pool.length === 0) return [];

  const recentSet = new Set(recentIds);
  const unseenPool = pool.filter((q) => !recentSet.has(q.id));
  const seenPool = pool.filter((q) => recentSet.has(q.id));

  const picked = pickByProgressiveCurve(unseenPool, count, mode);

  if (picked.length < count) {
    const usedIds = new Set(picked.map((q) => q.id));
    const extra = pickByProgressiveCurve(
      seenPool.filter((q) => !usedIds.has(q.id)),
      count - picked.length,
      mode
    );
    picked.push(...extra);
  }

  return picked.slice(0, count).map(prepareShuffledQuestion);
}

/**
 * Picks a fresh, crisp Easy replacement question for the Time Swap lifeline.
 */
export function pickBonusSwapQuestion(excludeIds = []) {
  const blocked = new Set(excludeIds);
  const candidates = shuffleArray(
    MCU_QUIZ_QUESTIONS.filter(
      (q) => !blocked.has(q.id) && q.difficulty === 'Easy' && q.en.question.length <= 105
    )
  );
  const fallback =
    candidates[0] ||
    shuffleArray(MCU_QUIZ_QUESTIONS.filter((q) => !blocked.has(q.id) && q.difficulty === 'Easy'))[0] ||
    MCU_QUIZ_QUESTIONS[0];

  return prepareShuffledQuestion(fallback);
}
