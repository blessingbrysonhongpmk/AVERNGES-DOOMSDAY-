import React, { useState } from 'react';
import { CHARACTERS_DATA } from '../data/characters.js';
import CharacterModal from './CharacterModal';
import CharacterShuffler from './CharacterShuffler';

export default function CharacterDatabase() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  return (
    <section
      id="characters"
      aria-label="Avengers Doomsday Character Database"
      className="relative py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#0A0B0E]"
    >
      <div className="container-fluid container-xl mx-auto px-0">

        {/* Section Header */}
        <div className="mb-6 sm:mb-8 text-center max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 border border-[#1E2024] bg-[#111216]/80 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#22C55E] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
            CHARACTER ROSTER // {CHARACTERS_DATA.length} MARVEL HEROES & SOVEREIGNS
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-cinematic font-black tracking-tight text-white uppercase mb-2">
            CHARACTER DATABASE
          </h2>
          <p className="text-xs sm:text-sm font-body text-[#777A80] leading-relaxed">
            The definitive Multiverse Saga dossier: Avengers, Fantastic Four, Thunderbolts*, Guardians, X-Men, Street Knights, and Cosmic Sovereigns.
          </p>
        </div>

        {/* ── UNIFIED AVENGERS THEMED HERO VAULT & 3D CARD ARENA (Saves space by integrating cards inside) ── */}
        <CharacterShuffler onSelectCharacter={setSelectedCharacter} />

      </div>

      {/* Detail Modal */}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </section>
  );
}
