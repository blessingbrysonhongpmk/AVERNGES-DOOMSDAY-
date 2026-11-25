/**
 * AVENGERS: DOOMSDAY — CANONICAL GAME ZONE DATA
 * Multiverse Trivia & Guess the Hero Dossiers.
 */

export const TRIVIA_QUESTIONS = [
  {
    id: 1,
    question: "Who officially unveiled Robert Downey Jr.'s return as Victor von Doom at San Diego Comic-Con 2024?",
    options: [
      "The Russo Brothers & Kevin Feige",
      "Jon Favreau",
      "James Gunn",
      "Sam Raimi"
    ],
    answer: 0,
    explanation: "At SDCC Hall H 2024, Kevin Feige and directors Anthony & Joe Russo introduced Robert Downey Jr. stepping onto the stage in Victor von Doom's iconic green tunic."
  },
  {
    id: 2,
    question: "Which landmark comic book saga serves as the foundational narrative for Avengers: Doomsday & Secret Wars?",
    options: [
      "Jonathan Hickman's 2015 Secret Wars & Incursions",
      "The Infinity Gauntlet (1991)",
      "Age of Apocalypse (1995)",
      "House of M (2005)"
    ],
    answer: 0,
    explanation: "Jonathan Hickman's epic New Avengers/Secret Wars run established the multiversal incursions and Battleworld ruled by God Emperor Doom."
  },
  {
    id: 3,
    question: "In MCU Phase 4 & 5 lore, what constitutes an 'Incursion'?",
    options: [
      "A collision between two parallel universes annihilating both realities",
      "A rogue branch pruned by the Time Variance Authority",
      "A celestial emergence cracking a planet's mantle",
      "A localized fracture caused by the Darkhold"
    ],
    answer: 0,
    explanation: "As explained by Reed Richards of Earth-838, an Incursion occurs when boundaries between universes erode, causing them to collide and destroy each other."
  },
  {
    id: 4,
    question: "What is the name of Doctor Doom's European sovereign realm granting him absolute diplomatic immunity?",
    options: [
      "Latveria",
      "Sokovia",
      "Madripoor",
      "Genosha"
    ],
    answer: 0,
    explanation: "Doctor Doom is the supreme monarch of Latveria, governing with unrivaled scientific technological prowess and arcane sorcery."
  },
  {
    id: 5,
    question: "Which team of anti-heroes and reformed operatives takes center stage in Marvel Studios' Thunderbolts* (2025)?",
    options: [
      "Bucky Barnes, Yelena Belova, Sentry, Red Guardian, Ghost & U.S. Agent",
      "Deadpool, Wolverine, Gambit & X-23",
      "The Defenders of Hell's Kitchen",
      "The Guardians of the Galaxy"
    ],
    answer: 0,
    explanation: "Thunderbolts* features Sebastian Stan, Florence Pugh, Lewis Pullman, David Harbour, Hannah John-Kamen, and Wyatt Russell assembled by Contessa Valentina."
  },
  {
    id: 6,
    question: "What setting defines the Fantastic Four's debut in The Fantastic Four: First Steps (2025)?",
    options: [
      "A vibrant retro-futuristic 1960s alternate Earth",
      "Earth-616 modern-day Manhattan",
      "The Quantum Realm under Kang's rule",
      "The Void at the end of time"
    ],
    answer: 0,
    explanation: "Director Matt Shakman has confirmed First Steps takes place in a distinct retro-futuristic 1960s universe featuring Pedro Pascal, Vanessa Kirby, Joseph Quinn, and Ebon Moss-Bachrach."
  }
];

export const GUESS_HEROES = [
  {
    id: 1,
    name: "Doctor Doom",
    alias: "Victor von Doom",
    actor: "Robert Downey Jr.",
    clues: [
      "Sovereign Monarch of Latveria with diplomatic immunity",
      "Unrivaled intellect combining titanium cybernetics with arcane sorcery",
      "Portrayed by Robert Downey Jr. in the Multiverse Saga climax"
    ],
    poster: "/characters/doctor-doom.jpg",
    options: ["Doctor Doom", "Doctor Strange", "Magneto", "Kang the Conqueror"]
  },
  {
    id: 2,
    name: "Thor Odinson",
    alias: "God of Thunder",
    actor: "Chris Hemsworth",
    clues: [
      "Asgardian God of Thunder and founding Avenger",
      "Wielder of Stormbreaker and the enchanted hammer Mjolnir",
      "Survived the destruction of Asgard and the Battle of Earth"
    ],
    poster: "/characters/thor.jpg",
    options: ["Thor Odinson", "Captain America", "The Sentry", "Star-Lord"]
  },
  {
    id: 3,
    name: "Mister Fantastic",
    alias: "Reed Richards",
    actor: "Pedro Pascal",
    clues: [
      "Patriarch of the Fantastic Four from an alternate 1960s reality",
      "Possesses malleable molecular elasticity and supreme multiversal intellect",
      "First Steps debut portrayed by Pedro Pascal"
    ],
    poster: "/characters/reed-richards.jpg",
    options: ["Mister Fantastic", "Hank Pym", "Bruce Banner", "Professor X"]
  },
  {
    id: 4,
    name: "The Winter Soldier",
    alias: "Bucky Barnes",
    actor: "Sebastian Stan",
    clues: [
      "Former HYDRA super-soldier assassin who reclaimed his humanity",
      "Equipped with a custom Wakandan Vibranium cybernetic arm",
      "Now a Congressman and field leader in Thunderbolts*"
    ],
    poster: "/characters/bucky-barnes.jpg",
    options: ["The Winter Soldier", "U.S. Agent", "Red Guardian", "Daredevil"]
  },
  {
    id: 5,
    name: "Wolverine",
    alias: "Logan",
    actor: "Hugh Jackman",
    clues: [
      "Mutant warrior with Adamantium claws and hyper-accelerated healing",
      "The pivotal Anchor Being of Earth-10005",
      "Returned alongside Wade Wilson in the highest-grossing R-rated film in history"
    ],
    poster: "/characters/wolverine.jpg",
    options: ["Wolverine", "Deadpool", "The Punisher", "Namor"]
  },
  {
    id: 6,
    name: "Loki — God of Stories",
    alias: "Loki Odinson",
    actor: "Tom Hiddleston",
    clues: [
      "Transcended mortal godhood to control the infinite branches of time",
      "Sacrificed personal freedom to sit alone at the End of Time",
      "Physically holds the dying Multiverse together with green temporal magic"
    ],
    poster: "/characters/loki.jpg",
    options: ["Loki — God of Stories", "Doctor Strange", "The Watcher", "Agatha Harkness"]
  }
];
