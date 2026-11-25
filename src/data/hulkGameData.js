/**
 * Data, Marvel Character Roster Imports & Hulk Lore for HULK SMASH MAYHEM
 * Directly imports characters from CHARACTERS_DATA so portraits, aliases, and factions stay unified.
 * All dialogues are strictly English.
 */

import { CHARACTERS_DATA } from './characters.js';

const CHAR_MAP = Object.fromEntries(CHARACTERS_DATA.map((c) => [c.id, c]));

const fallbackChar = (id, name, poster) =>
  CHAR_MAP[id] || { id, name, alias: name, poster, affiliation: 'Marvel Multiverse', roleTag: 'COMBATANT' };

export const HULK_PROFILE = fallbackChar('hulk', 'Smart Hulk', '/characters/hulk.jpg');

/**
 * SMASH TARGETS (7 Marvel Threats & Incursion Hostiles)
 * Highlighted with Toxic Gamma Target Reticles — Smash rapidly for combo multipliers!
 */
export const SMASH_TARGETS = [
  {
    id: 'rogue-doombot',
    characterId: 'doctor-doom',
    name: 'Doombot Sentry',
    subtitle: 'Latverian Scout',
    poster: fallbackChar('doctor-doom', 'Doctor Doom', '/characters/doctor-doom.jpg').poster,
    description: 'Doctor Doom robotic decoy scanning Earth-616 defenses!',
    type: 'smash',
    points: 120,
    accent: '#22C55E',
    badge: 'SMASH',
    soundKey: 'doomLatveria',
    smashLine: 'PUNY DOOMBOT CRUSHED!',
  },
  {
    id: 'thanos-echo',
    characterId: 'thanos',
    name: 'Thanos Echo',
    subtitle: 'Titanian Simulation',
    poster: fallbackChar('thanos', 'Thanos', '/characters/thanos.jpg').poster,
    description: 'Hard-light Mad Titan construct storming 5th Avenue!',
    type: 'smash',
    points: 150,
    accent: '#A855F7',
    badge: 'HEAVY',
    soundKey: 'doomLatveria',
    smashLine: 'HULK WANTS REMATCH — SMASH!',
  },
  {
    id: 'loki-illusion',
    characterId: 'loki',
    name: 'Loki Illusion',
    subtitle: 'Trickster Holo',
    poster: fallbackChar('loki', 'God of Stories', '/characters/loki.jpg').poster,
    description: 'Mischievous frost-giant hologram taunting Hulk mid-battle!',
    type: 'smash',
    points: 110,
    accent: '#10B981',
    badge: 'SMASH',
    soundKey: 'hulkSmash',
    smashLine: 'PUNY GOD!',
  },
  {
    id: 'galactus-probe',
    characterId: 'galactus',
    name: 'Galactus Probe',
    subtitle: 'Cosmic Siphon',
    poster: fallbackChar('galactus', 'Galactus', '/characters/galactus.jpg').poster,
    description: 'Cosmic herald automaton draining Midtown power grids!',
    type: 'smash',
    points: 160,
    accent: '#F59E0B',
    badge: 'COSMIC',
    soundKey: 'doomLatveria',
    smashLine: 'TOO BIG FOR STREET — SMASH ANYWAY!',
  },
  {
    id: 'taskmaster-mimic',
    characterId: 'taskmaster',
    name: 'Taskmaster Bot',
    subtitle: 'Combat Mimic',
    poster: fallbackChar('taskmaster', 'Taskmaster', '/characters/taskmaster.jpg').poster,
    description: 'Red Room armored synth copying Avengers fight stances!',
    type: 'smash',
    points: 100,
    accent: '#3B82F6',
    badge: 'TARGET',
    soundKey: 'capShield',
    smashLine: 'COPY THIS SMASH, METAL FACE!',
  },
  {
    id: 'ghost-disruptor',
    characterId: 'ghost',
    name: 'Ghost Disruptor',
    subtitle: 'Phase Anomaly',
    poster: fallbackChar('ghost', 'Ghost', '/characters/ghost.jpg').poster,
    description: 'Unstable quantum projection phasing across sector pads!',
    type: 'smash',
    points: 100,
    accent: '#22C55E',
    badge: 'TARGET',
    soundKey: 'hulkSmash',
    smashLine: 'NO PHASING PAST HULK!',
  },
  {
    id: 'void-gamma-core',
    characterId: 'sentry',
    name: 'The Void Surge',
    subtitle: 'Gamma Overdrive',
    poster: fallbackChar('sentry', 'The Sentry', '/characters/sentry.jpg').poster,
    description: 'Volatile Void anomaly erupting with raw gamma energy!',
    type: 'smash',
    isBonus: true,
    points: 250,
    accent: '#00FF88',
    badge: 'BONUS x2.5',
    soundKey: 'gammaCharge',
    smashLine: 'HULK STRONGER THAN ONE MILLION SUNS!',
  },
];

/**
 * DECOYS — MARVEL HERO ALLIES (PROTECT / DO NOT SMASH!)
 * Highlighted with Crimson Hazard Frame & Shield Badge — Clicking resets combo & deducts points.
 */
export const DECOYS = [
  {
    id: 'ally-spider-man',
    characterId: 'spider-man',
    name: 'Spider-Man',
    subtitle: 'Ally • Peter Parker',
    poster: fallbackChar('spider-man', 'Spider-Man', '/characters/spider-man.jpg').poster,
    description: 'Swinging innocent citizens clear of debris!',
    type: 'decoy',
    penalty: -50,
    accent: '#EF4444',
    badge: 'ALLY • PROTECT',
    soundKey: 'spideyThwip',
    warningLine: 'WATCH OUT! DO NOT SMASH SPIDER-KID!',
  },
  {
    id: 'ally-iron-man',
    characterId: 'iron-man',
    name: 'Iron Man',
    subtitle: 'Ally • Tony Stark',
    poster: fallbackChar('iron-man', 'Iron Man', '/characters/iron-man.jpg').poster,
    description: 'Scanning airspace and calibrating Veronica orbital shield!',
    type: 'decoy',
    penalty: -60,
    accent: '#EF4444',
    badge: 'ALLY • PROTECT',
    soundKey: 'ironmanRepulsor',
    warningLine: 'SORRY TIN MAN! VERONICA STAND DOWN!',
  },
  {
    id: 'ally-captain-america',
    characterId: 'steve-rogers',
    name: 'Captain America',
    subtitle: 'Ally • Steve Rogers',
    poster: fallbackChar('steve-rogers', 'Captain America', '/characters/steve-rogers.jpg').poster,
    description: 'Holding the Vibranium shield defensive perimeter!',
    type: 'decoy',
    penalty: -60,
    accent: '#EF4444',
    badge: 'ALLY • PROTECT',
    soundKey: 'capShield',
    warningLine: 'NEVER SMASH CAPTAIN AMERICA!',
  },
  {
    id: 'ally-black-widow',
    characterId: 'black-widow',
    name: 'Black Widow',
    subtitle: 'Ally • Natasha Romanoff',
    poster: fallbackChar('black-widow', 'Black Widow', '/characters/black-widow.jpg').poster,
    description: "Broadcasting Hulk's Lullaby calming frequency!",
    type: 'decoy',
    penalty: -75,
    accent: '#EF4444',
    badge: 'LULLABY • PROTECT',
    soundKey: 'hulkThunderclap',
    warningLine: "SUN'S GETTING REAL LOW... PROTECT NATASHA!",
  },
  {
    id: 'ally-thor',
    characterId: 'thor',
    name: 'Thor Odinson',
    subtitle: 'Ally • Point Break',
    poster: fallbackChar('thor', 'Thor Odinson', '/characters/thor.jpg').poster,
    description: 'Clearing Doombots overhead with Stormbreaker!',
    type: 'decoy',
    penalty: -60,
    accent: '#EF4444',
    badge: 'ALLY • PROTECT',
    soundKey: 'thorThunder',
    warningLine: 'CAREFUL WITH POINT BREAK! FRIEND FROM WORK!',
  },
  {
    id: 'ally-she-hulk',
    characterId: 'she-hulk',
    name: 'She-Hulk',
    subtitle: 'Ally • Jennifer Walters',
    poster: fallbackChar('she-hulk', 'She-Hulk', '/characters/she-hulk.jpg').poster,
    description: 'Defending Midtown civilians alongside Bruce!',
    type: 'decoy',
    penalty: -50,
    accent: '#EF4444',
    badge: 'GAMMA • PROTECT',
    soundKey: 'hulkSmash',
    warningLine: 'COUSIN JENNIFER IS ON HULK TEAM!',
  },
];

/**
 * HERO TEAM-UP ASSISTS (Charge Gamma Surge to Unleash!)
 */
export const HERO_ASSISTS = [
  {
    id: 'thor-bifrost',
    hotkey: '1',
    heroName: 'THOR',
    abilityName: 'BIFROST THUNDER',
    shortDesc: 'Clears all Threats +2x Combo',
    poster: fallbackChar('thor', 'Thor Odinson', '/characters/thor.jpg').poster,
    soundKey: 'thorThunder',
    accent: '#38BDF8',
    dialogue: 'POINT BREAK BROUGHT THE LIGHTNING! BOOM!',
  },
  {
    id: 'ironman-overcharge',
    hotkey: '2',
    heroName: 'IRON MAN',
    abilityName: '2X OVERCHARGE',
    shortDesc: 'Double Points for 5 Seconds',
    poster: fallbackChar('iron-man', 'Iron Man', '/characters/iron-man.jpg').poster,
    soundKey: 'ironmanRepulsor',
    accent: '#F59E0B',
    dialogue: 'STARK REACTOR LINKED — SMASH FOR DOUBLE GAMMA!',
  },
  {
    id: 'strange-timestasis',
    hotkey: '3',
    heroName: 'DR. STRANGE',
    abilityName: 'TIME FREEZE',
    shortDesc: 'Pauses Clock & Targets 4s',
    poster: fallbackChar('doctor-strange', 'Doctor Strange', '/characters/doctor-strange.jpg').poster,
    soundKey: 'strangeMystic',
    accent: '#00FF88',
    dialogue: 'WIZARD STOPPED TIME — SMASH EVERYTHING!',
  },
];

/**
 * Dynamic Hulk Rage Tiers reacting to current combo multiplier
 */
export const HULK_RAGE_TIERS = [
  { minCombo: 8, title: 'WORLDBREAKER HULK', color: '#00FF88', status: 'APEX GAMMA FURY' },
  { minCombo: 5, title: 'GAMMA OVERDRIVE', color: '#22C55E', status: 'SAKAAR ARENA PEAK' },
  { minCombo: 3, title: 'AVENGING HULK', color: '#10B981', status: 'SMASH MOMENTUM' },
  { minCombo: 1, title: 'BANNER FOCUS', color: '#9CA3AF', status: 'TARGET LOCK READY' },
];

export const HULK_DIALOGUES = {
  intro: [
    'HULK IS ALWAYS ANGRY. LET US SMASH!',
    'SAKAAR TRAINING ONLINE — SHOW ME THREATS!',
    "DON'T MAKE HULK WAIT! SMASH TIME!",
  ],
  correct: [
    'HULK SMASH!',
    'PUNY TARGET CRUSHED!',
    'HULK IS THE STRONGEST ONE THERE IS!',
    'MORE DOOMBOTS FOR HULK!',
    'GAMMA FISTS CONNECTED!',
  ],
  wrong: [
    "SUN'S GETTING REAL LOW... WATCH OUT FOR ALLIES!",
    'HULK DOES NOT SMASH AVENGERS!',
    'WRONG TARGET — PROTECT OUR HEROES!',
    'FRIEND FROM WORK! STOP SMASHING HERO!',
  ],
  combo: [
    'YOU WOULD NOT LIKE HULK WHEN HE IS ANGRY!',
    'WORLDBREAKER GAMMA OVERDRIVE!',
    'HULK SMASH EVERYTHING ON SCREEN!',
    'UNSTOPPABLE GAMMA FURY!',
  ],
  lowTime: [
    'FINAL SECONDS — SMASH FASTER!',
    'CLOCK TICKING — FULL GAMMA RAGE!',
    'NO MERCY FOR DOOMBOTS!',
  ],
  gameOver: [
    "SUN'S GETTING LOW... TIME FOR TACO BREAK!",
    'NOT BAD! HULK APPRECIATES THE WORKOUT!',
    'TELL TONY AND THOR WHO IS STRONGEST!',
    'ARENA CLEARED — AVENGERS STAND STRONG!',
  ],
};

export const RANKS = [
  {
    minScore: 5000,
    title: 'WORLDBREAKER HULK',
    subtitle: 'Strongest Avenger confirmed. Even Thanos and Doombots fear your gamma fury!',
    color: '#00FF88',
  },
  {
    minScore: 3000,
    title: 'SAKAAR GRAND CHAMPION',
    subtitle: 'Incomparable reflexes! You protected every Avenger while demolishing the threat wave.',
    color: '#22C55E',
  },
  {
    minScore: 1400,
    title: 'AVENGERS VANGUARD',
    subtitle: 'Strong tactical smash control. Trigger Hero Team-Ups early to push higher!',
    color: '#EAB308',
  },
  {
    minScore: 0,
    title: 'GAMMA LAB RECRUIT',
    subtitle: 'Warmup complete! Keep your eyes sharp for Green Targets and Red Hero Allies.',
    color: '#9CA3AF',
  },
];

export const COMIC_WORDS = ['SMASH!', 'PUNY BOT!', 'KRAKOOM!', 'THUNDER!', 'CRUSH!', 'GAMMA HIT!'];

/**
 * Curated Marvel Cast Strip used in Banner & Soundboard
 */
export const FEATURED_GAME_CAST = [
  fallbackChar('hulk', 'Smart Hulk', '/characters/hulk.jpg'),
  fallbackChar('iron-man', 'Iron Man', '/characters/iron-man.jpg'),
  fallbackChar('thor', 'Thor Odinson', '/characters/thor.jpg'),
  fallbackChar('spider-man', 'Spider-Man', '/characters/spider-man.jpg'),
  fallbackChar('doctor-strange', 'Doctor Strange', '/characters/doctor-strange.jpg'),
  fallbackChar('doctor-doom', 'Doctor Doom', '/characters/doctor-doom.jpg'),
  fallbackChar('thanos', 'Thanos', '/characters/thanos.jpg'),
];
