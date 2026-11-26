/**
 * Data, 51 Imported Marvel Character Avatars & Hulk Lore for HULK SMASH MAYHEM
 * Directly imports characters from CHARACTERS_DATA so portraits, aliases, and factions stay unified.
 * All dialogues are strictly English.
 */

import { CHARACTERS_DATA } from './characters.js';

const CHAR_MAP = Object.fromEntries(CHARACTERS_DATA.map((c) => [c.id, c]));

const fallbackChar = (id, name, poster) =>
  CHAR_MAP[id] || { id, name, alias: name, poster, affiliation: 'Marvel Multiverse', roleTag: 'COMBATANT' };

export const HULK_PROFILE = fallbackChar('hulk', 'Smart Hulk', '/characters/hulk.jpg');

/**
 * Maps any Marvel character ID/category to the best matching imported WAV SFX in SOUND_CATALOG.
 */
export function getAvatarSoundKey(character) {
  if (!character) return 'hulkRoar';
  const id = character.id;
  if (id === 'hulk' || id === 'she-hulk' || id === 'ben-grimm' || id === 'red-guardian') return 'hulkRoar';
  if (id === 'iron-man' || id === 'war-machine' || id === 'captain-marvel' || id === 'monica-rambeau') return 'ironmanRepulsor';
  if (id === 'thor' || id === 'valkyrie') return 'thorThunder';
  if (id === 'steve-rogers' || id === 'sam-wilson' || id === 'bucky-barnes' || id === 'us-agent' || id === 'taskmaster') return 'capShield';
  if (id === 'spider-man' || id === 'ms-marvel' || id === 'daredevil') return 'spideyThwip';
  if (id === 'doctor-strange' || id === 'scarlet-witch' || id === 'america-chavez' || id === 'loki' || id === 'moon-knight') return 'strangeMystic';
  if (id === 'doctor-doom' || id === 'thanos' || id === 'galactus' || id === 'magneto' || id === 'sentry') return 'doomLatveria';
  return character.category === 'ANTAGONIST' ? 'doomLatveria' : 'hulkSmash';
}

/**
 * All 51 Marvel Characters exported as selectable player Combat Avatars with unique Voice + SFX tracks
 */
export const CHARACTER_QUOTES = {
  'doctor-doom': 'All kneel before Doom!',
  galactus: 'I hunger for your world!',
  thanos: 'I am inevitable.',
  'reed-richards': 'Incursion vector locked!',
  'sue-storm': 'Forcefields holding strong!',
  'johnny-storm': 'Flame on!',
  'ben-grimm': "It's clobbering time!",
  'iron-man': 'I am Iron Man.',
  'steve-rogers': 'Avengers, assemble!',
  thor: 'Bring me Thanos!',
  hulk: 'Hulk smash!',
  'black-widow': "Sun's getting real low.",
  hawkeye: 'Never miss a shot.',
  'sam-wilson': 'On your left!',
  'war-machine': 'Boom! Looking for this?',
  'captain-marvel': 'Higher, further, faster!',
  'spider-man': 'Friendly Spider-Man here!',
  'doctor-strange': 'We are in the endgame now.',
  'ant-man': 'Going subatomic now!',
  'shang-chi': 'Unleash the Ten Rings!',
  shuri: 'Wakanda forever!',
  'she-hulk': 'Objection! Gamma smash!',
  valkyrie: 'For New Asgard!',
  'ms-marvel': 'Cosmic light power, embiggen!',
  'kate-bishop': 'Trick arrow locked in!',
  loki: 'Burdened with glorious purpose!',
  'scarlet-witch': 'Chaos magic unleashed.',
  wolverine: "Let's go, bub.",
  deadpool: 'Maximum effort!',
  'professor-x': 'To me, my X-Men.',
  magneto: 'Master of magnetism.',
  'america-chavez': 'Star portal opening!',
  'monica-rambeau': 'Absorbing spectral energy!',
  namor: 'Beware the serpent god!',
  'bucky-barnes': 'Winter Soldier ready.',
  'yelena-belova': 'That was a cool pose.',
  sentry: 'The Void consumes the light!',
  'red-guardian': 'Red Guardian hits harder!',
  'us-agent': 'Standing down is not an option.',
  ghost: 'Phasing through your defenses.',
  taskmaster: 'Combat pattern copied.',
  'star-lord': 'Star-Lord, legendary outlaw!',
  'rocket-raccoon': 'Oh yeah, giant boom time!',
  groot: 'I am Groot!',
  gamora: 'Deadliest in the galaxy.',
  drax: 'Nothing goes over my head!',
  nebula: 'Cybernetics locked on target.',
  mantis: 'Sleep now, warrior.',
  daredevil: 'Radar locked. Justice strikes.',
  punisher: 'One batch, two batch, smash.',
  'moon-knight': 'Khonshu demands vengeance!',
};

export const ALL_AVATARS = CHARACTERS_DATA.map((char) => ({
  ...char,
  soundKey: getAvatarSoundKey(char),
  voicePath: `/sounds/chars/${char.id}.wav`,
  voiceLine: CHARACTER_QUOTES[char.id] || `${char.name} ready for combat!`,
}));

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
 * DECOYS — 12 MARVEL HERO ALLIES (PROTECT / DO NOT SMASH!)
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
  {
    id: 'ally-doctor-strange',
    characterId: 'doctor-strange',
    name: 'Doctor Strange',
    subtitle: 'Ally • Sorcerer Supreme',
    poster: fallbackChar('doctor-strange', 'Doctor Strange', '/characters/doctor-strange.jpg').poster,
    description: 'Opening Kamar-Taj evacuation portals!',
    type: 'decoy',
    penalty: -60,
    accent: '#EF4444',
    badge: 'MYSTIC • PROTECT',
    soundKey: 'strangeMystic',
    warningLine: 'WATCH THE CAPE, WIZARD!',
  },
  {
    id: 'ally-wolverine',
    characterId: 'wolverine',
    name: 'Wolverine',
    subtitle: 'Ally • Logan',
    poster: fallbackChar('wolverine', 'Wolverine', '/characters/wolverine.jpg').poster,
    description: 'Slicing incoming Doombots with Adamantium claws!',
    type: 'decoy',
    penalty: -60,
    accent: '#EF4444',
    badge: 'MUTANT • PROTECT',
    soundKey: 'capShield',
    warningLine: 'WATCH THOSE CLAWS — LOGAN IS FRIEND!',
  },
  {
    id: 'ally-deadpool',
    characterId: 'deadpool',
    name: 'Deadpool',
    subtitle: 'Ally • Wade Wilson',
    poster: fallbackChar('deadpool', 'Deadpool', '/characters/deadpool.jpg').poster,
    description: 'Breaking the fourth wall mid-evacuation!',
    type: 'decoy',
    penalty: -50,
    accent: '#EF4444',
    badge: 'ALLY • PROTECT',
    soundKey: 'spideyThwip',
    warningLine: 'WAIT — THAT IS NOT SPIDER-MAN! DO NOT SMASH WADE!',
  },
  {
    id: 'ally-scarlet-witch',
    characterId: 'scarlet-witch',
    name: 'Scarlet Witch',
    subtitle: 'Ally • Wanda Maximoff',
    poster: fallbackChar('scarlet-witch', 'Scarlet Witch', '/characters/scarlet-witch.jpg').poster,
    description: 'Containing Chaos Magic rifts across Midtown!',
    type: 'decoy',
    penalty: -60,
    accent: '#EF4444',
    badge: 'NEXUS • PROTECT',
    soundKey: 'strangeMystic',
    warningLine: 'STAY CLEAR OF WANDA CHAOS SHIELDS!',
  },
  {
    id: 'ally-captain-marvel',
    characterId: 'captain-marvel',
    name: 'Captain Marvel',
    subtitle: 'Ally • Carol Danvers',
    poster: fallbackChar('captain-marvel', 'Captain Marvel', '/characters/captain-marvel.jpg').poster,
    description: 'Intercepting orbital Chitauri carriers!',
    type: 'decoy',
    penalty: -60,
    accent: '#EF4444',
    badge: 'COSMIC • PROTECT',
    soundKey: 'ironmanRepulsor',
    warningLine: 'CAROL HAS BINARY SHIELDS UP — DO NOT SMASH!',
  },
  {
    id: 'ally-groot',
    characterId: 'groot',
    name: 'King Groot',
    subtitle: 'Ally • Guardians',
    poster: fallbackChar('groot', 'King Groot', '/characters/groot.jpg').poster,
    description: 'Forming a living bark barrier around civilians!',
    type: 'decoy',
    penalty: -50,
    accent: '#EF4444',
    badge: 'ALLY • PROTECT',
    soundKey: 'hulkSmash',
    warningLine: 'I AM GROOT! PROTECT THE TREE FRIEND!',
  },
];

/**
 * HERO TEAM-UP ASSISTS (Charge Gamma Surge to Unleash!)
 */
export const HERO_ASSISTS = [
  {
    id: 'thor-bifrost',
    characterId: 'thor',
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
    characterId: 'iron-man',
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
    characterId: 'doctor-strange',
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
 * Curated Marvel Cast Strip used in Banner & Loading Screen
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
