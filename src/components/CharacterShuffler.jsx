import React, { useState, useMemo } from 'react';
import { CHARACTERS_DATA } from '../data/characters.js';
import { clockAudio } from '../utils/audio.js';
import { Layers, RotateCcw, Search, X, ChevronRight } from 'lucide-react';

/**
 * Clean, Precision-Engineered Avengers 'A' Monogram
 * Pure editorial metallic finish, no artificial sci-fi neon.
 */
function EditorialAvengersLogo({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="silverMetallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#D4D7DE" />
          <stop offset="70%" stopColor="#8C919C" />
          <stop offset="100%" stopColor="#4A4F59" />
        </linearGradient>
      </defs>

      {/* Outer Tactical Ring with Arrow Break */}
      <circle cx="50" cy="50" r="44" stroke="#26282E" strokeWidth="1.5" />
      <path
        d="M 50 12 A 38 38 0 1 1 16 62"
        stroke="url(#silverMetallicGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Thrust Arrow Head */}
      <path
        d="M 66 36 L 82 36 L 82 20 L 75 20 L 75 27 L 64 16 L 59 21 L 70 32 Z"
        fill="url(#silverMetallicGrad)"
      />

      {/* Stylized Avengers 'A' Monogram */}
      <path
        d="M 53 24 L 38 76 L 47 76 L 51 63 L 67 63 L 71 76 L 81 76 L 62 24 Z M 54 53 L 58 38 L 64 53 Z"
        fill="url(#silverMetallicGrad)"
      />

      {/* Crossbar */}
      <path
        d="M 22 55 L 72 55 L 72 61 L 22 61 Z"
        fill="#A1A6B2"
      />
    </svg>
  );
}

export default function CharacterShuffler({ onSelectCharacter }) {
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [dealMode, setDealMode] = useState('fan'); // 'fan' | 'grid'
  const [dealKey, setDealKey] = useState(0);
  const [activeHandIndices, setActiveHandIndices] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [spotlightChar, setSpotlightChar] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'ALL',
    'AVENGERS',
    'FANTASTIC FOUR',
    'THUNDERBOLTS',
    'GUARDIANS',
    'STREET & MYSTIC',
    'MULTIVERSE',
    'ANTAGONIST'
  ];

  // Filter characters based on category and search query
  const filteredCharacters = useMemo(() => {
    return CHARACTERS_DATA.filter((char) => {
      let matchesCategory = true;
      if (categoryFilter === 'FANTASTIC FOUR') matchesCategory = char.category === 'FANTASTIC FOUR' || char.affiliation.includes('Fantastic Four');
      else if (categoryFilter === 'ANTAGONIST') matchesCategory = char.category === 'ANTAGONIST' || char.roleTag.includes('ANTAGONIST') || char.roleTag.includes('WARLORD') || char.roleTag.includes('DEVOURER');
      else if (categoryFilter === 'AVENGERS') matchesCategory = char.category === 'AVENGERS' || char.affiliation.includes('Avengers');
      else if (categoryFilter === 'THUNDERBOLTS') matchesCategory = char.category === 'THUNDERBOLTS' || char.affiliation.includes('Thunderbolts');
      else if (categoryFilter === 'GUARDIANS') matchesCategory = char.category === 'GUARDIANS' || char.affiliation.includes('Guardians');
      else if (categoryFilter === 'STREET & MYSTIC') matchesCategory = char.category === 'STREET & MYSTIC' || char.affiliation.includes('Defenders');
      else if (categoryFilter === 'MULTIVERSE') matchesCategory = char.category === 'MULTIVERSE' || char.roleTag.includes('MULTIVERSAL') || char.affiliation.includes('X-Men');

      if (!matchesCategory) return false;

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
  }, [categoryFilter, searchQuery]);

  const handleOpenVault = () => {
    try { clockAudio.tick(0); } catch (e) { }
    setIsVaultOpen(true);
    setDealKey((prev) => prev + 1);
    setSpotlightChar(CHARACTERS_DATA[0]);
  };

  const handlePackVault = () => {
    try { clockAudio.tick(0); } catch (e) { }
    setIsVaultOpen(false);
    setHoveredIndex(null);
    setSpotlightChar(null);
  };

  const handleShuffleNewHand = () => {
    try { clockAudio.tick(0); } catch (e) { }
    const indices = [];
    const pool = Array.from({ length: filteredCharacters.length }, (_, i) => i);
    const handSize = Math.min(11, pool.length);
    while (indices.length < handSize && pool.length > 0) {
      const r = Math.floor(Math.random() * pool.length);
      indices.push(pool.splice(r, 1)[0]);
    }
    setActiveHandIndices(indices);
    setDealKey((k) => k + 1);
    if (indices.length > 0) {
      setSpotlightChar(filteredCharacters[indices[Math.floor(indices.length / 2)]]);
    }
  };

  const displayedFanCharacters = useMemo(() => {
    if (filteredCharacters.length === 0) return [];
    if (filteredCharacters.length <= 11) return filteredCharacters;
    return activeHandIndices.map((idx) => filteredCharacters[idx]).filter(Boolean);
  }, [filteredCharacters, activeHandIndices]);

  return (
    <div className="select-none mb-8">

      {/* ═════════════════════════════════════════════════════════════════════
          1. CLOSED STATE: LUXURY CINEMATIC TUCK BOX & CARD DECK
          - Real physical presence with overlapping card previews
          - Matte obsidian paper texture & chiseled metallic typography
          - Zero artificial neon bloom; authentic luxury movie merchandise feel
         ═════════════════════════════════════════════════════════════════════ */}
      {!isVaultOpen ? (
        <div className="max-w-4xl mx-auto px-2">
          <button
            type="button"
            onClick={handleOpenVault}
            className="w-full group p-5 sm:p-7 border border-[#1E2024] hover:border-[#383C46] bg-[#0C0D10] transition-all duration-300 cursor-pointer text-left shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col md:flex-row items-center justify-between gap-6"
          >
            {/* Left: 3D Physical Card Deck Stack Preview */}
            <div className="flex items-center gap-5 sm:gap-7 w-full md:w-auto">

              {/* Overlapping Realistic Card Fan Preview */}
              <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center">
                {/* Back Card 3 (Doctor Strange) */}
                <div className="absolute w-14 h-20 sm:w-16 sm:h-24 bg-[#14161C] border border-[#2A2D35] rounded-xs shadow-lg -rotate-12 -translate-x-3 -translate-y-1 overflow-hidden opacity-70 group-hover:-rotate-16 group-hover:-translate-x-4 transition-transform duration-300">
                  <img src="/characters/doctor-strange.jpg" alt="" className="w-full h-full object-cover filter brightness-75" />
                </div>
                {/* Back Card 2 (Thor) */}
                <div className="absolute w-14 h-20 sm:w-16 sm:h-24 bg-[#14161C] border border-[#2A2D35] rounded-xs shadow-xl rotate-10 translate-x-3 -translate-y-1 overflow-hidden opacity-85 group-hover:rotate-14 group-hover:translate-x-4 transition-transform duration-300">
                  <img src="/characters/thor.jpg" alt="" className="w-full h-full object-cover filter brightness-85" />
                </div>
                {/* Front Card 1 (Doctor Doom) */}
                <div className="absolute w-14 h-20 sm:w-16 sm:h-24 bg-[#0A0B0E] border border-[#484D58] rounded-xs shadow-2xl z-10 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img src="/characters/doctor-doom.jpg" alt="Doctor Doom" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  <span className="absolute bottom-1 left-1 right-1 text-[6.5px] font-mono text-center text-white/90 font-bold uppercase truncate">
                    DOOM
                  </span>
                </div>
              </div>

              {/* Deck Info & Editorial Heading */}
              <div>
                <div className="inline-flex items-center gap-2 mb-1 text-[9px] sm:text-[10px] font-mono tracking-[0.2em] text-[#8C9099] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  <span>COLLECTIBLE MULTIVERSE DECK // 51 HEROES</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-cinematic font-black text-white uppercase tracking-tight group-hover:text-white transition-colors flex items-center gap-2">
                  <span>AVENGERS: DOOMSDAY</span>
                  <span className="text-[#6B7280] font-normal text-xs sm:text-sm font-mono tracking-widest">// HERO VAULT</span>
                </h3>

                <p className="text-xs sm:text-sm font-body text-[#8C9098] mt-1 max-w-md leading-relaxed">
                  Interactive 3D battle cards across the entire Marvel Multiverse roster. Click to deal and fan out the full 51-character formation.
                </p>
              </div>

            </div>

            {/* Right: Tactile Editorial Action Button */}
            <div className="shrink-0 w-full md:w-auto flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 border-[#1E2024] pt-3 md:pt-0">
              <div className="px-5 py-2.5 bg-white text-black group-hover:bg-[#E5E7EB] text-xs font-mono font-bold tracking-widest uppercase transition-all flex items-center gap-2 shadow-sm rounded-xs">
                <span>DEAL CARDS</span>
                <span className="text-xs font-mono opacity-60">[51]</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
              <span className="text-[8.5px] font-mono tracking-wider text-[#6B7280] uppercase">
                TOUCH TO UNLEASH BATTLE FAN
              </span>
            </div>

          </button>
        </div>
      ) : (

        /* ═════════════════════════════════════════════════════════════════════
            2. OPENED STATE: CINEMATIC MULTIVERSE CARD ARENA
            - Dark editorial theatre with hairline dividers
            - Clean 3D Fan Arc or Compact 6-Column Gallery
            - Integrated Search & Minimalist Category Pills
            - Pack Vault button to collapse and save vertical space
           ═════════════════════════════════════════════════════════════════════ */
        <div className="border border-[#1E2024] bg-[#090A0D] p-3 sm:p-6 shadow-[0_16px_50px_rgba(0,0,0,0.95)] rounded-xs">

          {/* Top Control Header */}
          <div className="flex flex-col gap-3 pb-3 mb-4 border-b border-[#1A1C22]">

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left Identity */}
              <div className="flex items-center gap-3">
                <EditorialAvengersLogo className="w-7 h-7 sm:w-8 sm:h-8" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-mono tracking-widest text-white uppercase font-bold">
                      MULTIVERSE ROSTER // {filteredCharacters.length} HEROES
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-mono text-[#6B7280] hidden xs:block">
                    CLICK TO INSPECT DOSSIER • HOVER TO ELEVATE CARD
                  </p>
                </div>
              </div>

              {/* Right View & Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleShuffleNewHand}
                  className="px-2.5 sm:px-3 py-1.5 border border-[#2A2D35] hover:border-white/50 bg-[#121318] hover:bg-[#1A1C22] text-[#D1D5DB] text-[9px] sm:text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1"
                  title="Deal a fresh random hand"
                >
                  <RotateCcw className="w-3 h-3 text-[#9CA3AF]" />
                  <span>SHUFFLE</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch (e) { }
                    setDealMode(dealMode === 'fan' ? 'grid' : 'fan');
                    setDealKey((k) => k + 1);
                  }}
                  className="px-2.5 sm:px-3 py-1.5 border border-[#2A2D35] hover:border-white/50 bg-[#121318] hover:bg-[#1A1C22] text-[#D1D5DB] text-[9px] sm:text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Layers className="w-3 h-3 text-[#9CA3AF]" />
                  <span>{dealMode === 'fan' ? 'GRID VIEW' : '3D FAN'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePackVault}
                  className="px-2.5 sm:px-3 py-1.5 border border-[#1E2024] hover:border-[#E62429] bg-black/60 text-[#8C9099] hover:text-white text-[9px] sm:text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1"
                  title="Close cards to save space"
                >
                  <X className="w-3 h-3 text-[#E62429]" />
                  <span>PACK DECK</span>
                </button>
              </div>
            </div>

            {/* Integrated Search & Faction Pills */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 pt-2 border-t border-[#16171D]">

              {/* Quick Search */}
              <div className="relative w-full md:w-64 shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter heroes, actors, aliases..."
                  className="w-full pl-8 pr-7 py-1.5 bg-[#0F1014] border border-[#1E2026] focus:border-[#4B5563] text-[11px] font-mono text-white placeholder-[#4B5563] outline-none transition-colors rounded-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#6B7280] hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Minimalist Faction Pills */}
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-1 select-none w-full">
                {categories.map((cat) => {
                  const isActive = categoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        try { clockAudio.tick(0); } catch (e) { }
                        setCategoryFilter(cat);
                        setDealKey((k) => k + 1);
                      }}
                      className={`px-2 py-0.5 text-[8.5px] xs:text-[9px] font-mono tracking-wider uppercase transition-colors cursor-pointer border rounded-xs ${isActive
                          ? 'border-white/40 bg-white/10 text-white font-bold'
                          : 'border-[#1A1C22] bg-[#0E0F13] text-[#717682] hover:text-white hover:border-[#2D3038]'
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

            </div>

          </div>

          {/* ═════════════════════════════════════════════════════════════════
              VIEW 1: 3D TACTICAL CARD FAN ARC
             ═════════════════════════════════════════════════════════════════ */}
          {dealMode === 'fan' ? (
            <div className="relative py-8 sm:py-14 min-h-[350px] sm:min-h-[400px] flex items-center justify-center overflow-x-auto overflow-y-visible perspective-1200">

              {/* Origin Pedestal Marker */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-4 py-1 border border-[#1E2024] bg-[#0C0D11] text-[8px] font-mono text-[#6B7280] uppercase tracking-widest pointer-events-none">
                AVENGERS TACTICAL FAN // 11 HERO DECK
              </div>

              {/* The Fan Container */}
              <div
                key={dealKey}
                className="relative w-full max-w-4xl h-[250px] sm:h-[300px] flex items-center justify-center"
              >
                {displayedFanCharacters.map((char, i) => {
                  const count = displayedFanCharacters.length;
                  const center = (count - 1) / 2;
                  const offset = i - center;

                  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                  const tx = offset * (isMobile ? 26 : 56);
                  const ty = Math.abs(offset) * (isMobile ? 5 : 12);
                  const rot = offset * (isMobile ? 3.5 : 6);
                  const zIndex = 20 + i;

                  return (
                    <div
                      key={char.id}
                      onMouseEnter={() => {
                        setHoveredIndex(i);
                        setSpotlightChar(char);
                        try { clockAudio.tick(0); } catch (e) { }
                      }}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => onSelectCharacter(char)}
                      className="absolute w-26 xs:w-30 sm:w-40 aspect-[2/3] cursor-pointer card-pop-fan hero-card-fan-item rounded-xs border border-[#262830] bg-[#0E0F13] overflow-hidden shadow-2xl"
                      style={{
                        '--tx': `${tx}px`,
                        '--ty': `${ty}px`,
                        '--rot': `${rot}deg`,
                        zIndex: hoveredIndex === i ? 80 : zIndex,
                        animationDelay: `${i * 0.04}s`,
                      }}
                      title={`Click to open ${char.name} full intelligence dossier`}
                    >
                      {/* Character Avatar Portrait */}
                      <img
                        src={char.poster}
                        alt={char.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                      {/* Role Pill */}
                      <span className="absolute top-1 left-1 text-[6px] sm:text-[7px] font-mono tracking-wider px-1 sm:px-1.5 py-0.5 bg-black/85 text-white/90 border border-white/10 uppercase font-semibold truncate max-w-[90%]">
                        {char.roleTag}
                      </span>

                      {/* Card Meta */}
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 text-left">
                        <p className="text-[7px] sm:text-[8px] font-mono text-[#E62429] font-bold uppercase truncate">
                          {char.actor}
                        </p>
                        <h4 className="text-[9.5px] sm:text-[11px] font-cinematic font-bold text-white uppercase truncate leading-tight">
                          {char.name}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (

            /* ═════════════════════════════════════════════════════════════════
                VIEW 2: HIGH-DENSITY 6-COLUMN EDITORIAL GALLERY
               ═════════════════════════════════════════════════════════════════ */
            <div
              key={dealKey}
              className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5 py-2 max-h-[600px] overflow-y-auto pr-1"
            >
              {filteredCharacters.map((char, i) => (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacter(char)}
                  onMouseEnter={() => {
                    setSpotlightChar(char);
                    try { clockAudio.tick(0); } catch (e) { }
                  }}
                  className="relative aspect-[2/3] rounded-xs border border-[#1E2024] hover:border-white/50 bg-[#0E0F13] overflow-hidden shadow-lg cursor-pointer group card-pop-fan transition-all duration-200 hover:scale-103"
                  style={{
                    '--tx': '0px',
                    '--ty': '0px',
                    '--rot': '0deg',
                    animationDelay: `${Math.min(i * 0.02, 0.35)}s`,
                  }}
                >
                  <img
                    src={char.poster}
                    alt={char.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                  <span className="absolute top-1 left-1 text-[6.5px] font-mono tracking-wider px-1 py-0.5 bg-black/85 text-white/90 border border-white/10 uppercase font-semibold max-w-[85%] truncate">
                    {char.roleTag}
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 p-1.5 text-left">
                    <p className="text-[7px] font-mono text-[#E62429] font-bold uppercase truncate">
                      {char.actor}
                    </p>
                    <h5 className="text-[10px] font-cinematic font-bold text-white uppercase truncate">
                      {char.name}
                    </h5>
                    <p className="text-[6.5px] font-mono text-[#6B7280] truncate">
                      {char.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty Notice */}
          {filteredCharacters.length === 0 && (
            <div className="py-12 text-center text-xs font-mono text-[#6B7280]">
              NO HEROES OR ANTAGONISTS MATCHING "{searchQuery}".
            </div>
          )}

          {/* ── SPOTLIGHT HERO DRAWER ── */}
          {spotlightChar && (
            <div className="mt-3 pt-3 border-t border-[#1A1C22] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D0E12] p-2.5 sm:p-3 border border-[#1E2026] rounded-xs">
              <div className="flex items-center gap-3">
                <img
                  src={spotlightChar.poster}
                  alt={spotlightChar.name}
                  className="w-9 sm:w-11 aspect-[2/3] object-cover border border-[#2E313B] shrink-0 rounded-xs"
                />
                <div>
                  <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-mono text-[#9CA3AF] uppercase font-bold">
                    <span>{spotlightChar.roleTag}</span>
                    <span className="text-[#3A3D46]">•</span>
                    <span className="text-[#22C55E]">{spotlightChar.status}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-cinematic font-black text-white uppercase leading-tight">
                    {spotlightChar.name} — <span className="text-[#9CA3AF] font-normal text-[11px]">{spotlightChar.actor}</span>
                  </h4>
                  <p className="text-[9.5px] sm:text-[11px] font-body text-[#717682] line-clamp-1">
                    {spotlightChar.summary}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectCharacter(spotlightChar)}
                className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-[#E5E7EB] text-black text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-1.5 rounded-xs"
              >
                <span>OPEN FULL DOSSIER</span>
                <span>↗</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
