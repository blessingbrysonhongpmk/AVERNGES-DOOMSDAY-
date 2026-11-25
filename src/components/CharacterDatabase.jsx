import React, { useState, useMemo, useRef } from 'react';
import { CHARACTERS_DATA } from '../data/characters.js';
import CharacterModal from './CharacterModal';
import CinematicAtmosphere from './CinematicAtmosphere';
import { clockAudio } from '../utils/audio.js';
import {
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Layers,
  LayoutGrid,
  Search,
  X,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export default function CharacterDatabase() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [spotlightChar, setSpotlightChar] = useState(CHARACTERS_DATA[0]);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'fan' | 'grid'
  const [dealKey, setDealKey] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeHandIndices, setActiveHandIndices] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const scrollContainerRef = useRef(null);

  const categories = [
    'ALL',
    'AVENGERS',
    'FANTASTIC FOUR',
    'THUNDERBOLTS',
    'GUARDIANS',
    'MULTIVERSE',
    'ANTAGONIST',
  ];

  // Filter characters based on category and search query
  const filteredCharacters = useMemo(() => {
    return CHARACTERS_DATA.filter((char) => {
      let matchesCategory = true;
      if (categoryFilter === 'FANTASTIC FOUR') {
        matchesCategory = char.category === 'FANTASTIC FOUR' || char.affiliation.includes('Fantastic Four');
      } else if (categoryFilter === 'ANTAGONIST') {
        matchesCategory =
          char.category === 'ANTAGONIST' ||
          char.roleTag.includes('ANTAGONIST') ||
          char.roleTag.includes('WARLORD') ||
          char.roleTag.includes('DEVOURER');
      } else if (categoryFilter === 'AVENGERS') {
        matchesCategory = char.category === 'AVENGERS' || char.affiliation.includes('Avengers');
      } else if (categoryFilter === 'THUNDERBOLTS') {
        matchesCategory = char.category === 'THUNDERBOLTS' || char.affiliation.includes('Thunderbolts');
      } else if (categoryFilter === 'GUARDIANS') {
        matchesCategory = char.category === 'GUARDIANS' || char.affiliation.includes('Guardians');
      } else if (categoryFilter === 'MULTIVERSE') {
        matchesCategory =
          char.category === 'MULTIVERSE' ||
          char.roleTag.includes('MULTIVERSAL') ||
          char.affiliation.includes('X-Men');
      }

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

  // Carousel navigation
  const scrollCarousel = (direction) => {
    try { clockAudio.tick(0); } catch (e) {}
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Shuffle fresh hand
  const handleShuffleNewHand = () => {
    try { clockAudio.tick(0); } catch (e) {}
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
    <section
      id="characters"
      aria-label="Avengers Doomsday Character Database"
      className="relative z-10 py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#0A0B0E] overflow-hidden"
    >
      {/* Background Cinematic Atmosphere */}
      <CinematicAtmosphere
        poster="/doctor-doom-portrait.jpg"
        overlayOpacity="bg-[#0A0B0E]/94"
        accentGlow="emerald"
      />

      <div className="container-fluid container-xl mx-auto px-0 relative z-10">

        {/* ═════════════════════════════════════════════════════════════════════
            CINEMATIC CHARACTER DATABASE MODULE (Matching Image 4 Architecture)
            Left: Title, Dossier Spotlight, Category Pills, Real-Time Search, Mode Controls
            Right: Horizontal Theatrical Character Reel with Circular Green Navigation Arrow
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="border border-[#1E252D] bg-[#0A0C10]/95 rounded-xs p-4 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] mb-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* ── LEFT COLUMN: TITLES, SPOTLIGHT & INTERACTIVE CONTROLS ── */}
            <div className="lg:col-span-5 flex flex-col justify-between">

              <div>
                <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 border border-[#1E2024] bg-[#111216]/80 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#8C9098] uppercase rounded-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
                  <span>MULTIVERSE ARCHIVE // {CHARACTERS_DATA.length} MARVEL FIGURES</span>
                </div>

                <h2 className="text-xl xs:text-2xl sm:text-3xl font-cinematic font-black tracking-tight text-white uppercase mb-1">
                  CHARACTER DATABASE
                </h2>
                <p className="text-xs sm:text-sm font-mono tracking-widest text-[#8C9098] uppercase mb-4">
                  51 MULTIVERSE DOSSIERS. ONE INEVITABLE WAR.
                </p>

                {/* ── ACTIVE SPOTLIGHT HERO CARD ── */}
                {spotlightChar && (
                  <div className="mb-4 p-3 border border-[#1E252D] bg-[#0E1015] rounded-xs flex items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={spotlightChar.poster}
                        alt={spotlightChar.name}
                        className="w-10 h-14 object-cover border border-[#232731] shrink-0 rounded-xs"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-mono uppercase font-bold">
                          <span className="text-[#E62429] truncate">{spotlightChar.roleTag}</span>
                          <span className="text-[#4B5563]">•</span>
                          <span className="text-[#22C55E] truncate">{spotlightChar.status}</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-cinematic font-black text-white uppercase truncate">
                          {spotlightChar.name}
                        </h4>
                        <p className="text-[10px] font-mono text-[#9CA3AF] truncate">
                          {spotlightChar.actor}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCharacter(spotlightChar);
                        try { clockAudio.tick(0); } catch (e) {}
                      }}
                      className="px-3 py-1.5 bg-[#14171F] hover:bg-white text-white hover:text-black text-[9px] font-mono font-bold tracking-wider uppercase border border-[#232731] transition-all cursor-pointer shrink-0 rounded-xs flex items-center gap-1 shadow-sm"
                    >
                      <Eye className="w-3 h-3" />
                      <span>DOSSIER</span>
                    </button>
                  </div>
                )}

                {/* Search & Category Pills */}
                <div className="space-y-2.5 mb-4">
                  {/* Search Input */}
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search heroes, actors, aliases..."
                      className="w-full pl-8 pr-7 py-1.5 bg-[#0D0F14] border border-[#1E252D] focus:border-[#22C55E] text-xs font-mono text-white placeholder-[#555862] outline-none transition-colors rounded-xs"
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

                  {/* Faction Pills */}
                  <div className="flex flex-wrap items-center gap-1 select-none">
                    {categories.map((cat) => {
                      const isActive = categoryFilter === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            try { clockAudio.tick(0); } catch (e) {}
                            setCategoryFilter(cat);
                            setDealKey((k) => k + 1);
                          }}
                          className={`px-2 py-0.5 text-[8.5px] xs:text-[9px] font-mono tracking-wider uppercase transition-colors cursor-pointer border rounded-xs ${
                            isActive
                              ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E] font-bold'
                              : 'border-[#1E252D] bg-[#0E1015] text-[#8C9098] hover:text-white hover:border-[#383C46]'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1E252D]/70">
                <button
                  type="button"
                  onClick={handleShuffleNewHand}
                  className="px-3.5 py-2 bg-[#12141A] hover:bg-[#1A1C24] border border-[#232731] hover:border-[#22C55E] text-white text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs"
                  title="Shuffle character roster"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>SHUFFLE</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch (e) {}
                    setViewMode(viewMode === 'fan' ? 'carousel' : 'fan');
                    setDealKey((k) => k + 1);
                  }}
                  className={`px-3.5 py-2 border text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs ${
                    viewMode === 'fan'
                      ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E]'
                      : 'bg-[#12141A] hover:bg-[#1A1C24] border-[#232731] hover:border-white/40 text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>{viewMode === 'fan' ? 'REEL VIEW' : '3D BATTLE FAN'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch (e) {}
                    setViewMode(viewMode === 'grid' ? 'carousel' : 'grid');
                    setDealKey((k) => k + 1);
                  }}
                  className={`px-3.5 py-2 border text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs ${
                    viewMode === 'grid'
                      ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E]'
                      : 'bg-[#12141A] hover:bg-[#1A1C24] border-[#232731] hover:border-white/40 text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>{viewMode === 'grid' ? 'REEL VIEW' : 'ALL 51 GRID'}</span>
                </button>
              </div>

            </div>

            {/* ── RIGHT COLUMN: ACTIVE THEATRICAL CHARACTER CAROUSEL OR 3D FAN ── */}
            <div className="lg:col-span-7 relative">

              {/* ── VIEW 1: HORIZONTAL REEL CAROUSEL (Default, matching Image 4) ── */}
              {viewMode === 'carousel' && (
                <div className="relative">
                  <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth pr-12"
                  >
                    {filteredCharacters.map((char, index) => {
                      const numStr = String(index + 1).padStart(2, '0');
                      return (
                        <div
                          key={char.id}
                          className="relative w-32 xs:w-36 sm:w-40 aspect-[2/3] shrink-0 border border-[#1E252D] hover:border-[#22C55E] bg-[#0E1015] rounded-xs overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:scale-104 select-none"
                          onMouseEnter={() => {
                            setSpotlightChar(char);
                            try { clockAudio.tick(0); } catch (e) {}
                          }}
                          onClick={() => {
                            setSelectedCharacter(char);
                            try { clockAudio.tick(0); } catch (e) {}
                          }}
                        >
                          <img
                            src={char.poster}
                            alt={char.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 filter brightness-85 group-hover:brightness-95"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />

                          {/* Hero number badge matching Image 4 */}
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/85 border border-white/20 text-[9px] font-mono font-bold text-white uppercase rounded-xs">
                            {numStr}
                          </span>

                          {/* Role tag */}
                          <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/85 border border-[#22C55E]/40 text-[7px] font-mono font-bold text-[#22C55E] uppercase rounded-xs truncate max-w-[55%]">
                            {char.roleTag}
                          </span>

                          {/* Character name and actor at bottom */}
                          <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                            <p className="text-[7.5px] font-mono text-[#E62429] font-bold uppercase truncate">
                              {char.actor}
                            </p>
                            <h4 className="text-[10.5px] sm:text-xs font-cinematic font-bold text-white uppercase truncate leading-tight group-hover:text-white">
                              {char.name}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Circular Green Navigation Arrows matching Image 4 */}
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#22C55E] bg-black/90 hover:bg-[#22C55E] text-[#22C55E] hover:text-black flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,197,94,0.6)] cursor-pointer z-10 shrink-0"
                    aria-label="Scroll character reel prev"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#22C55E] bg-black/90 hover:bg-[#22C55E] text-[#22C55E] hover:text-black flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,197,94,0.6)] cursor-pointer z-10 shrink-0"
                    aria-label="Scroll character reel next"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              )}

              {/* ── VIEW 2: 3D TACTICAL BATTLE FAN ARC ── */}
              {viewMode === 'fan' && (
                <div className="relative py-6 min-h-[320px] flex items-center justify-center overflow-x-auto overflow-y-visible perspective-1200">
                  <div
                    key={dealKey}
                    className="relative w-full max-w-2xl h-[240px] sm:h-[280px] flex items-center justify-center"
                  >
                    {displayedFanCharacters.map((char, i) => {
                      const count = displayedFanCharacters.length;
                      const center = (count - 1) / 2;
                      const offset = i - center;
                      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                      const tx = offset * (isMobile ? 24 : 46);
                      const ty = Math.abs(offset) * (isMobile ? 5 : 10);
                      const rot = offset * (isMobile ? 3 : 5.5);
                      const zIndex = 20 + i;

                      return (
                        <div
                          key={char.id}
                          onMouseEnter={() => {
                            setHoveredIndex(i);
                            setSpotlightChar(char);
                            try { clockAudio.tick(0); } catch (e) {}
                          }}
                          onMouseLeave={() => setHoveredIndex(null)}
                          onClick={() => {
                            setSelectedCharacter(char);
                            try { clockAudio.tick(0); } catch (e) {}
                          }}
                          className="absolute w-24 xs:w-28 sm:w-36 aspect-[2/3] cursor-pointer card-pop-fan rounded-xs border border-[#262830] hover:border-[#22C55E] bg-[#0E0F13] overflow-hidden shadow-2xl transition-all"
                          style={{
                            '--tx': `${tx}px`,
                            '--ty': `${ty}px`,
                            '--rot': `${rot}deg`,
                            zIndex: hoveredIndex === i ? 80 : zIndex,
                            animationDelay: `${i * 0.04}s`,
                          }}
                        >
                          <img
                            src={char.poster}
                            alt={char.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-108"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                          <span className="absolute top-1 left-1 text-[6.5px] font-mono tracking-wider px-1 py-0.5 bg-black/85 text-white/90 border border-white/10 uppercase font-semibold truncate max-w-[90%]">
                            {char.roleTag}
                          </span>
                          <div className="absolute bottom-0 left-0 right-0 p-1.5 text-left">
                            <p className="text-[7px] font-mono text-[#E62429] font-bold uppercase truncate">
                              {char.actor}
                            </p>
                            <h4 className="text-[10px] font-cinematic font-bold text-white uppercase truncate leading-tight">
                              {char.name}
                            </h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── VIEW 3: COMPACT GRID VIEW (When toggled) ── */}
              {viewMode === 'grid' && (
                <div
                  key={dealKey}
                  className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-[460px] overflow-y-auto pr-1"
                >
                  {filteredCharacters.map((char) => (
                    <div
                      key={char.id}
                      onClick={() => {
                        setSelectedCharacter(char);
                        try { clockAudio.tick(0); } catch (e) {}
                      }}
                      onMouseEnter={() => {
                        setSpotlightChar(char);
                        try { clockAudio.tick(0); } catch (e) {}
                      }}
                      className="relative aspect-[2/3] rounded-xs border border-[#1E252D] hover:border-[#22C55E] bg-[#0E1015] overflow-hidden shadow-md cursor-pointer group transition-all hover:scale-103"
                    >
                      <img
                        src={char.poster}
                        alt={char.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-108 filter brightness-85 group-hover:brightness-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      <span className="absolute top-1 left-1 text-[6px] font-mono tracking-wider px-1 py-0.5 bg-black/85 text-[#22C55E] border border-[#22C55E]/30 uppercase font-bold max-w-[85%] truncate">
                        {char.roleTag}
                      </span>
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 text-left">
                        <p className="text-[6.5px] font-mono text-[#E62429] font-bold uppercase truncate">
                          {char.actor}
                        </p>
                        <h5 className="text-[9.5px] font-cinematic font-bold text-white uppercase truncate">
                          {char.name}
                        </h5>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {filteredCharacters.length === 0 && (
                <div className="py-12 text-center text-xs font-mono text-[#6B7280]">
                  NO HEROES OR ANTAGONISTS MATCHING "{searchQuery}".
                </div>
              )}

            </div>

          </div>

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
