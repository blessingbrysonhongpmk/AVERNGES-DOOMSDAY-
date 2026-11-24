import React, { useState } from 'react';
import { CHARACTERS_DATA } from '../data/characters.js';
import CharacterModal from './CharacterModal';

export default function CharacterDatabase() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const categories = ['ALL', 'FANTASTIC FOUR', 'ANTAGONIST', 'AVENGERS', 'MULTIVERSE'];

  const filteredCharacters = CHARACTERS_DATA.filter((char) => {
    if (filter === 'ALL') return true;
    if (filter === 'FANTASTIC FOUR') return char.affiliation.includes('Fantastic Four');
    if (filter === 'ANTAGONIST') return char.roleTag.includes('ANTAGONIST');
    if (filter === 'AVENGERS') return char.affiliation.includes('Avengers') || char.affiliation.includes('Thunderbolts');
    if (filter === 'MULTIVERSE') return char.roleTag.includes('MULTIVERSAL');
    return true;
  });

  return (
    <section
      id="characters"
      aria-label="Avengers Doomsday Character Database"
      className="relative py-16 sm:py-24 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#0A0B0E]"
    >
      {/* Bootstrap container boundary */}
      <div className="container max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="mb-8 sm:mb-12 text-center max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 border border-[#1E2024] bg-[#111216]/80 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#22C55E] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
            CHARACTER ROSTER // VERIFIED DOSSIERS
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-cinematic font-black tracking-tight text-white uppercase mb-3">
            CHARACTER DATABASE
          </h2>
          <p className="text-xs sm:text-sm font-body text-[#777A80] leading-relaxed">
            Officially confirmed heroes, sovereigns, and multiversal travelers converging in Avengers: Doomsday.
          </p>
        </div>

        {/* Filter Bar (Responsive wrapping pills with clean tap targets) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-10 select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-2.5 xs:px-3 sm:px-4 py-1.5 text-[9px] xs:text-[10px] font-mono tracking-wider sm:tracking-widest uppercase transition-colors cursor-pointer border ${
                filter === cat
                  ? 'border-[#E62429] bg-[#E62429]/15 text-white'
                  : 'border-[#1E2024] bg-[#111216]/60 text-[#777A80] hover:text-[#D8D9DC] hover:border-[#2D3036]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Character Cards Grid (Bootstrap 12-column responsive layout: 2 cols on mobile, 3 on tablet, 4 on desktop) */}
        <div className="row g-2.5 sm:g-4">
          {filteredCharacters.map((char) => (
            <div key={char.id} className="col-6 col-md-4 col-lg-3 flex">
              <button
                type="button"
                onClick={() => setSelectedCharacter(char)}
                className="w-full group text-left border border-[#1E2024] bg-[#111216] p-2 xs:p-2.5 sm:p-3 flex flex-col justify-between hover:border-[#3A3D45] transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#E62429]"
              >
                {/* Image Frame */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-black mb-2 sm:mb-3">
                  <img
                    src={char.poster}
                    alt={char.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent opacity-60" />
                  <span className="absolute top-1.5 left-1.5 text-[7px] xs:text-[8px] font-mono tracking-wider px-1.5 py-0.5 bg-black/80 backdrop-blur-sm border border-white/10 text-white uppercase">
                    {char.roleTag}
                  </span>
                </div>

                {/* Text Info */}
                <div className="w-full">
                  <p className="text-[9px] xs:text-[10px] font-mono text-[#E62429] font-bold tracking-wider uppercase mb-0.5 truncate">
                    {char.actor}
                  </p>
                  <h3 className="text-xs xs:text-sm sm:text-base font-cinematic font-bold text-white group-hover:text-white transition-colors truncate">
                    {char.name}
                  </h3>
                  <p className="text-[9px] xs:text-[10px] font-body text-[#777A80] truncate mb-2 sm:mb-3">
                    {char.associatedMovie}
                  </p>
                  <div className="pt-1.5 border-t border-[#1E2024] flex items-center justify-between text-[8px] xs:text-[9px] font-mono text-[#55585E]">
                    <span className="truncate pr-1">{char.status}</span>
                    <span className="group-hover:translate-x-1 transition-transform shrink-0">→</span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

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
