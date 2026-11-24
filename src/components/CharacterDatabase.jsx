import React, { useState, useMemo } from 'react';
import { CHARACTERS_DATA } from '../data/characters.js';
import CharacterModal from './CharacterModal';
import CharacterShuffler from './CharacterShuffler';
import { Search } from 'lucide-react';

export default function CharacterDatabase() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'ALL',
    'AVENGERS',
    'FANTASTIC FOUR',
    'MULTIVERSE',
    'THUNDERBOLTS',
    'GUARDIANS',
    'STREET & MYSTIC',
    'ANTAGONIST'
  ];

  const filteredCharacters = useMemo(() => {
    return CHARACTERS_DATA.filter((char) => {
      // Category filter
      let matchesCategory = true;
      if (filter === 'FANTASTIC FOUR') matchesCategory = char.category === 'FANTASTIC FOUR' || char.affiliation.includes('Fantastic Four');
      else if (filter === 'ANTAGONIST') matchesCategory = char.category === 'ANTAGONIST' || char.roleTag.includes('ANTAGONIST') || char.roleTag.includes('WARLORD') || char.roleTag.includes('DEVOURER');
      else if (filter === 'AVENGERS') matchesCategory = char.category === 'AVENGERS' || char.affiliation.includes('Avengers');
      else if (filter === 'THUNDERBOLTS') matchesCategory = char.category === 'THUNDERBOLTS' || char.affiliation.includes('Thunderbolts');
      else if (filter === 'GUARDIANS') matchesCategory = char.category === 'GUARDIANS' || char.affiliation.includes('Guardians');
      else if (filter === 'STREET & MYSTIC') matchesCategory = char.category === 'STREET & MYSTIC' || char.affiliation.includes('Defenders');
      else if (filter === 'MULTIVERSE') matchesCategory = char.category === 'MULTIVERSE' || char.roleTag.includes('MULTIVERSAL') || char.affiliation.includes('X-Men');

      if (!matchesCategory) return false;

      // Text search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          char.name.toLowerCase().includes(q) ||
          char.alias.toLowerCase().includes(q) ||
          char.actor.toLowerCase().includes(q) ||
          char.affiliation.toLowerCase().includes(q) ||
          char.roleTag.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [filter, searchQuery]);

  return (
    <section
      id="characters"
      aria-label="Avengers Doomsday Character Database"
      className="relative py-14 sm:py-20 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#0A0B0E]"
    >
      <div className="container-fluid container-xl mx-auto px-0">

        {/* Section Header */}
        <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto px-2">
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

        {/* ── CARD SHUFFLING VAULT BOX (Touch to Split & Deal) ── */}
        <CharacterShuffler onSelectCharacter={setSelectedCharacter} />

        {/* Search & Filter Bar */}
        <div className="max-w-4xl mx-auto mb-6 space-y-3">
          {/* Quick Search Input */}
          <div className="relative w-full max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#777A80]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hero, actor, or alias (e.g. Iron Man, Thor, Doom)..."
              className="w-full pl-9 pr-8 py-2 bg-[#111216] border border-[#1E2024] focus:border-[#E62429] text-xs font-mono text-white placeholder-[#55585E] outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#777A80] hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 select-none">
            {categories.map((cat) => {
              const count = cat === 'ALL'
                ? CHARACTERS_DATA.length
                : CHARACTERS_DATA.filter((c) => {
                  if (cat === 'FANTASTIC FOUR') return c.category === 'FANTASTIC FOUR' || c.affiliation.includes('Fantastic Four');
                  if (cat === 'ANTAGONIST') return c.category === 'ANTAGONIST' || c.roleTag.includes('ANTAGONIST') || c.roleTag.includes('WARLORD') || c.roleTag.includes('DEVOURER');
                  if (cat === 'AVENGERS') return c.category === 'AVENGERS' || c.affiliation.includes('Avengers');
                  if (cat === 'THUNDERBOLTS') return c.category === 'THUNDERBOLTS' || c.affiliation.includes('Thunderbolts');
                  if (cat === 'GUARDIANS') return c.category === 'GUARDIANS' || c.affiliation.includes('Guardians');
                  if (cat === 'STREET & MYSTIC') return c.category === 'STREET & MYSTIC' || c.affiliation.includes('Defenders');
                  if (cat === 'MULTIVERSE') return c.category === 'MULTIVERSE' || c.roleTag.includes('MULTIVERSAL') || c.affiliation.includes('X-Men');
                  return true;
                }).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={`px-2.5 xs:px-3 py-1 text-[9px] xs:text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer border ${filter === cat
                    ? 'border-[#E62429] bg-[#E62429]/20 text-white shadow-[0_0_12px_rgba(230,36,41,0.3)] font-bold'
                    : 'border-[#1E2024] bg-[#111216]/60 text-[#777A80] hover:text-[#D8D9DC] hover:border-[#2D3036]'
                    }`}
                >
                  {cat} <span className="opacity-60 text-[8px]">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── HIGH-DENSITY COMPACT CHARACTER GRID (6 cols on lg/xl, 4 on md, 3 on sm, 2 on xs) ── */}
        <div className="row g-2 sm:g-2.5">
          {filteredCharacters.map((char) => (
            <div key={char.id} className="col-6 col-sm-4 col-md-3 col-lg-2 flex">
              <button
                type="button"
                onClick={() => setSelectedCharacter(char)}
                className="w-full group text-left border border-[#1E2024] hover:border-[#E62429]/80 bg-[#111216] p-1.5 xs:p-2 flex flex-col justify-between hover:shadow-[0_8px_25px_rgba(0,0,0,0.85)] transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-1 focus:ring-[#E62429] shimmer-card"
              >
                {/* Image Frame */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-black mb-1.5">
                  <img
                    src={char.poster}
                    alt={char.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111216] via-transparent to-transparent opacity-50" />
                  <span className="absolute top-1 left-1 text-[6.5px] font-mono tracking-wider px-1 py-0.5 bg-black/85 backdrop-blur-xs border border-white/10 text-white uppercase max-w-[85%] truncate font-semibold">
                    {char.roleTag}
                  </span>
                </div>

                {/* Text Info */}
                <div className="w-full">
                  <p className="text-[8px] xs:text-[8.5px] font-mono text-[#E62429] font-bold tracking-wider uppercase mb-0.5 truncate">
                    {char.actor}
                  </p>
                  <h3 className="text-xs sm:text-[13px] font-cinematic font-bold text-white group-hover:text-white transition-colors truncate leading-tight">
                    {char.name}
                  </h3>
                  <p className="text-[7.5px] xs:text-[8px] font-body text-[#777A80] truncate mb-1.5">
                    {char.associatedMovie}
                  </p>
                  <div className="pt-1 border-t border-[#1E2024] flex items-center justify-between text-[7px] xs:text-[7.5px] font-mono text-[#55585E]">
                    <span className="truncate pr-1">{char.category}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform text-[#E62429] shrink-0 font-bold">↗</span>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {filteredCharacters.length === 0 && (
          <div className="py-12 text-center text-xs font-mono text-[#777A80]">
            NO HEROES FOUND MATCHING "{searchQuery}". TRY SEARCHING ANOTHER NAME.
          </div>
        )}

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
