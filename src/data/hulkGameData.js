/**
 * Data and Configurations for HULK SMASH MAYHEM Mini-Game
 * All dialogues are strictly English per creative instructions.
 */

export const SMASH_TARGETS = [
  {
    id: 'giant-robot-toy',
    name: 'Runaway Robot Toy',
    description: 'Malfunctioning windup battle droid stomping through traffic!',
    type: 'smash',
    points: 100,
    accent: '#22C55E',
    badge: 'TARGET',
    icon: '🤖',
  },
  {
    id: 'alien-drone',
    name: 'Mischievous Drone',
    description: 'Rogue Chitauri scout drone buzzing low over the avenue!',
    type: 'smash',
    points: 100,
    accent: '#A855F7',
    badge: 'TARGET',
    icon: '🛸',
  },
  {
    id: 'falling-boxes',
    name: 'Wobbly Cargo Stack',
    description: 'Unstable stack of oversized crates teetering toward a taxi!',
    type: 'smash',
    points: 100,
    accent: '#EAB308',
    badge: 'TARGET',
    icon: '📦',
  },
  {
    id: 'runaway-cart',
    name: 'Rocketing Shopping Cart',
    description: 'Supersonic grocery cart careening wildly down 5th Avenue!',
    type: 'smash',
    points: 100,
    accent: '#3B82F6',
    badge: 'TARGET',
    icon: '🛒',
  },
  {
    id: 'training-dummy',
    name: 'Stark Practice Dummy',
    description: 'Armored combat simulation robot on a rampage!',
    type: 'smash',
    points: 110,
    accent: '#F97316',
    badge: 'TARGET',
    icon: '🎯',
  },
  {
    id: 'rogue-doombot',
    name: 'Latverian Micro-Scout',
    description: 'Doctor Doom stealth surveillance unit analyzing the perimeter!',
    type: 'smash',
    points: 120,
    accent: '#10B981',
    badge: 'ROGUE',
    icon: '⚡',
  },
  {
    id: 'gamma-core',
    name: 'Gamma Energy Cell',
    description: 'Rare glowing gamma power cell ready for explosive overload!',
    type: 'smash',
    isBonus: true,
    points: 250,
    accent: '#00FF88',
    badge: 'BONUS',
    icon: '☢️',
  },
];

export const DECOYS = [
  {
    id: 'friendly-civilian',
    name: 'Friendly Civilian',
    description: 'Innocent coffee drinker waving and cheering for Hulk!',
    type: 'decoy',
    penalty: -50,
    accent: '#EF4444',
    badge: 'DO NOT SMASH',
    icon: '☕',
  },
  {
    id: 'rescue-worker',
    name: 'First Responder',
    description: 'City emergency worker assisting pedestrians!',
    type: 'decoy',
    penalty: -50,
    accent: '#EF4444',
    badge: 'PROTECT',
    icon: '🚑',
  },
  {
    id: 'harmless-puppy',
    name: 'Innocent Golden Pup',
    description: 'Adorable stray puppy wagging its tail on the sidewalk!',
    type: 'decoy',
    penalty: -75,
    accent: '#EF4444',
    badge: 'PROTECT',
    icon: '🐶',
  },
  {
    id: 'do-not-smash-crate',
    name: 'Fragile Glass Display',
    description: 'Marked clearly with hazardous caution tape: DO NOT SMASH!',
    type: 'decoy',
    penalty: -50,
    accent: '#EF4444',
    badge: 'FRAGILE',
    icon: '⚠️',
  },
];

export const HULK_DIALOGUES = {
  intro: [
    'HULK IS READY!',
    "LET'S SMASH!",
    'SHOW HULK WHAT TO SMASH!',
  ],
  correct: [
    'SMASH!',
    'HULK APPROVES!',
    'THAT WAS GOOD!',
    'PUNY TARGET CRUSHED!',
    'MORE SMASH!',
  ],
  wrong: [
    'WRONG TARGET!',
    'HULK IS CONFUSED!',
    'DO NOT SMASH FRIENDS!',
    'HULK WATCH OUT!',
  ],
  combo: [
    'HULK POWER!',
    'UNSTOPPABLE SMASH!',
    'GAMMA OVERDRIVE!',
    'HULK IS THE STRONGEST!',
  ],
  lowTime: [
    'HURRY UP!',
    'TIME IS RUNNING OUT!',
    'FINAL SECONDS!',
  ],
  gameOver: [
    'HULK NEEDS A BREAK!',
    'NOT BAD, HUMAN!',
    'THAT WAS A GOOD WORKOUT!',
    'HULK HAD FUN!',
  ],
};

export const RANKS = [
  { minScore: 4500, title: 'LEGENDARY SMASHER', subtitle: 'Apex Avenger tier. The city bows to your gamma fury!', color: '#00FF88' },
  { minScore: 2800, title: 'HULK CHAMPION', subtitle: 'Sensational reflexes! You smashed with true Hulk precision.', color: '#22C55E' },
  { minScore: 1200, title: 'CITY DEFENDER', subtitle: 'Solid effort! You cleared the streets and kept civilians safe.', color: '#EAB308' },
  { minScore: 0, title: 'SMASH ROOKIE', subtitle: 'Warm up completed. Get angry and try again!', color: '#9CA3AF' },
];

export const COMIC_WORDS = ['SMASH!', 'BAM!', 'CRUNCH!', 'POW!', 'KAPOW!', 'WHAM!'];
