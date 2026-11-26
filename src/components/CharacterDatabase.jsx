import React, { useState, useMemo, useRef, useEffect } from 'react';
import { CHARACTERS_DATA, CHARACTER_CATEGORIES } from '../data/characters.js';
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
  Eye,
  ShieldCheck,
  X,
} from 'lucide-react';

// Compact faction label for card chrome without cluttering portrait framing
const SHORT_FACTION_LABEL = {
  'Avengers / New Avengers': 'AVENGERS / NEW AVENGERS',
  'Fantastic Four': 'FANTASTIC FOUR',
  'X-Men': 'X-MEN',
  'Wakanda / Talokan': 'WAKANDA / TALOKAN',
  'Other Confirmed Characters': 'CONFIRMED CAST',
};

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

  const totalCastCount = CHARACTERS_DATA.length;

  // Compute accurate per-category counts dynamically from CHARACTERS_DATA
  const categoryCounts = useMemo(() => {
    const counts = { ALL: CHARACTERS_DATA.length };
    for (const cat of CHARACTER_CATEGORIES) {
      if (cat !== 'ALL') {
        counts[cat] = CHARACTERS_DATA.filter((char) => char.category === cat).length;
      }
    }
    return counts;
  }, []);

  // Filter characters by group category and search term (actor, character name, hero identity, team affiliation)
  const filteredCharacters = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CHARACTERS_DATA.filter((char) => {
      if (categoryFilter !== 'ALL' && char.category !== categoryFilter) {
        return false;
      }

      if (!q) return true;

      return (
        char.actor.toLowerCase().includes(q) ||
        char.name.toLowerCase().includes(q) ||
        (char.characterName && char.characterName.toLowerCase().includes(q)) ||
        (char.identity && char.identity.toLowerCase().includes(q)) ||
        char.alias.toLowerCase().includes(q) ||
        char.affiliation.toLowerCase().includes(q) ||
        char.category.toLowerCase().includes(q) ||
        char.roleTag.toLowerCase().includes(q)
      );
    });
  }, [categoryFilter, searchQuery]);

  // Keep spotlight aligned with active filter/search results when needed
  useEffect(() => {
    if (filteredCharacters.length === 0) return;
    const stillVisible = spotlightChar && filteredCharacters.some((c) => c.id === spotlightChar.id);
    if (!stillVisible) {
      setSpotlightChar(filteredCharacters[0]);
    }
  }, [filteredCharacters, spotlightChar]);

  // Carousel navigation
  const scrollCarousel = (direction) => {
    try { clockAudio.tick(0); } catch (e) { }
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Shuffle fresh battle hand & pick spotlight
  const handleShuffleNewHand = () => {
    try { clockAudio.tick(0); } catch (e) { }
    const pool = Array.from({ length: filteredCharacters.length }, (_, i) => i);
    const indices = [];
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

  const openCharacterDossier = (char) => {
    setSelectedCharacter(char);
    try { clockAudio.tick(0); } catch (e) { }
  };

  const hoverCharacterCard = (char) => {
    setSpotlightChar(char);
    try { clockAudio.tick(0); } catch (e) { }
  };

  // Show hero/identity subtitle clearly alongside civil name when distinct
  const getSecondaryCharacterLabel = (char) => {
    if (!char.characterName) return null;
    if (char.characterName.toLowerCase() === char.name.toLowerCase()) return null;
    if (char.name.toLowerCase().includes(char.characterName.toLowerCase())) return null;
    return char.characterName;
  };

  const spotlightCivilName = spotlightChar ? getSecondaryCharacterLabel(spotlightChar) : null;

  return (
    <section
      id="characters"
      aria-label="Avengers Doomsday Character Database"
      className="relative z-10 py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#0A0B0E] overflow-hidden"
    >
      {/* Background Cinematic Atmosphere */}
      <CinematicAtmosphere
        poster="/doctor-doom-portrait.jpg"
        overlayOpacity="bg-[#0A0B0E]/[0.94]"
        accentGlow="emerald"
      />

      <div className="container-fluid container-xl mx-auto px-0 relative z-10">

        {/* ═════════════════════════════════════════════════════════════════════
            OFFICIAL AVENGERS: DOOMSDAY CAST INTELLIGENCE ARCHIVE
            Left: Archive Header, Active Character Spotlight, Search, Group Filters, View Controls
            Right: Cinematic Theatrical Reel, 3D Tactical Fan, or Complete Cast Grid
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="relative border border-[#1E252D] bg-[#090B0F]/95 rounded-xs p-4 sm:p-7 shadow-[0_24px_70px_rgba(0,0,0,0.92)] mb-8">
          {/* Subtle Top Classified Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E62429]/70 via-[#22C55E]/70 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start lg:items-center">

            {/* ── LEFT COLUMN: TITLES, SPOTLIGHT & INTERACTIVE CONTROLS ── */}
            <div className="lg:col-span-5 flex flex-col justify-between">

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#1E252D] bg-[#101319] text-[9px] xs:text-[10px] font-mono tracking-[0.22em] text-[#9CA3AF] uppercase rounded-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E] shrink-0" />
                    <span>OFFICIAL CAST ARCHIVE // {totalCastCount} CONFIRMED</span>
                  </div>
                  {(categoryFilter !== 'ALL' || searchQuery.trim()) && (
                    <span className="px-2 py-1 border border-[#22C55E]/30 bg-[#22C55E]/10 text-[9px] font-mono tracking-widest text-[#22C55E] uppercase rounded-xs">
                      {filteredCharacters.length} OF {totalCastCount} SHOWN
                    </span>
                  )}
                </div>

                <h2 className="text-xl xs:text-2xl sm:text-3xl font-cinematic font-black tracking-tight text-white uppercase mb-1">
                  CHARACTER DATABASE
                </h2>
                <p className="text-[11px] sm:text-xs font-mono tracking-[0.18em] text-[#8C9098] uppercase mb-4">
                  {totalCastCount} CONFIRMED DOSSIERS. ONE INEVITABLE COLLISION.
                </p>

                {/* ── ACTIVE SPOTLIGHT HERO CARD ── */}
                {spotlightChar && (
                  <div className="mb-4 p-3.5 border border-[#232A35] bg-gradient-to-br from-[#0F1218] to-[#0B0D12] rounded-xs shadow-inner">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-12 h-16 shrink-0 overflow-hidden border border-[#2A313D] bg-black rounded-xs">
                          <img
                            src={spotlightChar.poster}
                            alt={`${spotlightChar.name} — ${spotlightChar.actor}`}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5 text-[8px] sm:text-[9px] font-mono uppercase font-bold mb-0.5">
                            <span className="text-[#E62429] truncate">{spotlightChar.category}</span>
                            <span className="text-[#4B5563]">•</span>
                            <span className="inline-flex items-center gap-1 text-[#22C55E]">
                              <ShieldCheck className="w-2.5 h-2.5 shrink-0" />
                              CONFIRMED
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-cinematic font-black text-white uppercase truncate leading-tight">
                            {spotlightChar.name}
                          </h4>
                          <p className="text-[10.5px] font-mono text-[#D1D5DB] truncate">
                            {spotlightCivilName ? `${spotlightCivilName} • ` : ''}
                            <span className="text-[#9CA3AF]">{spotlightChar.actor}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => openCharacterDossier(spotlightChar)}
                        className="px-3 py-2 bg-[#141821] hover:bg-white text-white hover:text-black text-[9.5px] font-mono font-bold tracking-wider uppercase border border-[#2B3340] hover:border-white transition-all cursor-pointer shrink-0 rounded-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>DOSSIER</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Search & Group Filters */}
                <div className="space-y-3 mb-4">
                  {/* Search Input */}
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6B7280]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search actor, character, hero identity, or team..."
                      aria-label="Search characters by actor, character name, hero identity, or team affiliation"
                      className="w-full pl-9 pr-8 py-2 bg-[#0D0F14] border border-[#1E252D] focus:border-[#22C55E] text-xs font-mono text-white placeholder-[#5C616B] outline-none transition-colors rounded-xs"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear character search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Faction Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 select-none">
                    {CHARACTER_CATEGORIES.map((cat) => {
                      const isActive = categoryFilter === cat;
                      const count = categoryCounts[cat] ?? 0;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            try { clockAudio.tick(0); } catch (e) { }
                            setCategoryFilter(cat);
                            setDealKey((k) => k + 1);
                          }}
                          className={`px-2.5 py-1 text-[8.5px] xs:text-[9px] font-mono tracking-wider uppercase transition-colors cursor-pointer border rounded-xs inline-flex items-center gap-1.5 ${isActive
                              ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E] font-bold shadow-[0_0_12px_rgba(34,197,94,0.12)]'
                              : 'border-[#1E252D] bg-[#0E1015] text-[#9CA3AF] hover:text-white hover:border-[#383C46]'
                            }`}
                        >
                          <span>{cat}</span>
                          <span
                            className={`text-[8px] px-1 py-0.2 rounded-xs ${isActive ? 'bg-[#22C55E]/20 text-[#34D399]' : 'bg-[#161922] text-[#6B7280]'
                              }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#1E252D]/70">
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
                    try { clockAudio.tick(0); } catch (e) { }
                    setViewMode(viewMode === 'fan' ? 'carousel' : 'fan');
                    setDealKey((k) => k + 1);
                  }}
                  className={`px-3.5 py-2 border text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs ${viewMode === 'fan'
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
                    try { clockAudio.tick(0); } catch (e) { }
                    setViewMode(viewMode === 'grid' ? 'carousel' : 'grid');
                    setDealKey((k) => k + 1);
                  }}
                  className={`px-3.5 py-2 border text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs ${viewMode === 'grid'
                      ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E]'
                      : 'bg-[#12141A] hover:bg-[#1A1C24] border-[#232731] hover:border-white/40 text-white'
                    }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>{viewMode === 'grid' ? 'REEL VIEW' : `ALL ${totalCastCount} GRID`}</span>
                </button>
              </div>

            </div>

            {/* ── RIGHT COLUMN: ACTIVE THEATRICAL REEL, 3D FAN, OR FULL GRID ── */}
            <div className="lg:col-span-7 relative">

              {/* ── VIEW 1: HORIZONTAL REEL CAROUSEL ── */}
              {viewMode === 'carousel' && filteredCharacters.length > 0 && (
                <div className="relative">
                  <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth pr-12"
                  >
                    {filteredCharacters.map((char) => {
                      const numStr = String(char.castNumber).padStart(2, '0');
                      const civilName = getSecondaryCharacterLabel(char);
                      const isSpotlight = spotlightChar?.id === char.id;
                      return (
                        <div
                          key={char.id}
                          className={`relative w-36 xs:w-40 sm:w-44 aspect-[2/3] shrink-0 border ${isSpotlight ? 'border-[#22C55E]' : 'border-[#1E252D] hover:border-[#22C55E]'
                            } bg-[#0E1015] rounded-xs overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.8)] cursor-pointer group transition-all duration-300 hover:scale-[1.03] select-none`}
                          onMouseEnter={() => hoverCharacterCard(char)}
                          onClick={() => openCharacterDossier(char)}
                        >
                          <img
                            src={char.poster}
                            alt={`${char.name} (${char.actor})`}
                            loading="lazy"
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/25 to-black/25 opacity-95" />

                          {/* Top Row: Cast Number + Confirmed Cast Indicator */}
                          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/85 border border-white/15 text-[9px] font-mono font-bold text-white uppercase rounded-xs">
                            {numStr}
                          </span>

                          <span
                            className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-black/85 border border-[#22C55E]/40 text-[7px] font-mono font-bold text-[#22C55E] uppercase rounded-xs inline-flex items-center gap-1"
                            title={char.castConfirmation}
                          >
                            <span className="w-1 h-1 rounded-full bg-[#22C55E]" />
                            CONFIRMED
                          </span>

                          {/* Bottom Intelligence Strip: Faction, Character Identity, Original Actor */}
                          <div className="absolute bottom-0 left-0 right-0 p-2.5 text-left border-t border-white/10 bg-gradient-to-t from-black/95 to-black/60 backdrop-blur-[2px]">
                            <p className="text-[7px] font-mono tracking-wider text-[#E62429] font-bold uppercase truncate mb-0.5">
                              {SHORT_FACTION_LABEL[char.category] || char.category}
                            </p>
                            <h4 className="text-[11px] sm:text-xs font-cinematic font-black text-white uppercase truncate leading-tight">
                              {char.name}
                            </h4>
                            <p className="text-[8.5px] font-mono text-[#D1D5DB] truncate mt-0.5">
                              {civilName ? `${civilName} • ` : ''}
                              <span className="text-[#9CA3AF] font-semibold">{char.actor}</span>
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Architectural Navigation Arrows */}
                  <button
                    type="button"
                    onClick={() => scrollCarousel('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#2C333F] bg-[#0B0D11]/95 hover:border-[#34D399] text-white hover:text-[#34D399] flex items-center justify-center transition-colors shadow-xl cursor-pointer z-10 shrink-0"
                    aria-label="Scroll character reel prev"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollCarousel('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#2C333F] bg-[#0B0D11]/95 hover:border-[#34D399] text-white hover:text-[#34D399] flex items-center justify-center transition-colors shadow-xl cursor-pointer z-10 shrink-0"
                    aria-label="Scroll character reel next"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2]" />
                  </button>
                </div>
              )}

              {/* ── VIEW 2: 3D TACTICAL BATTLE FAN ARC ── */}
              {viewMode === 'fan' && filteredCharacters.length > 0 && (
                <div className="relative py-6 min-h-[320px] flex items-center justify-center overflow-x-auto overflow-y-visible perspective-1200">
                  <div
                    key={dealKey}
                    className="relative w-full max-w-2xl h-[250px] sm:h-[290px] flex items-center justify-center"
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
                            hoverCharacterCard(char);
                          }}
                          onMouseLeave={() => setHoveredIndex(null)}
                          onClick={() => openCharacterDossier(char)}
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
                            alt={`${char.name} (${char.actor})`}
                            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
                          <span className="absolute top-1 left-1 text-[6.5px] font-mono tracking-wider px-1 py-0.5 bg-black/85 text-[#22C55E] border border-[#22C55E]/30 uppercase font-semibold truncate max-w-[90%]">
                            {SHORT_FACTION_LABEL[char.category] || char.roleTag}
                          </span>
                          <div className="absolute bottom-0 left-0 right-0 p-1.5 text-left bg-black/75">
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

              {/* ── VIEW 3: ARCHIVE GRID VIEW ── */}
              {viewMode === 'grid' && filteredCharacters.length > 0 && (
                <div
                  key={dealKey}
                  className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-[480px] overflow-y-auto pr-1"
                >
                  {filteredCharacters.map((char) => {
                    const numStr = String(char.castNumber).padStart(2, '0');
                    const isSpotlight = spotlightChar?.id === char.id;
                    return (
                      <div
                        key={char.id}
                        onClick={() => openCharacterDossier(char)}
                        onMouseEnter={() => hoverCharacterCard(char)}
                        className={`relative aspect-[2/3] rounded-xs border ${isSpotlight ? 'border-[#22C55E]' : 'border-[#1E252D] hover:border-[#22C55E]'
                          } bg-[#0E1015] overflow-hidden shadow-md cursor-pointer group transition-all hover:scale-[1.03]`}
                      >
                        <img
                          src={char.poster}
                          alt={`${char.name} (${char.actor})`}
                          loading="lazy"
                          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/25 opacity-95" />
                        <span className="absolute top-1 left-1 text-[7px] font-mono px-1 py-0.5 bg-black/85 text-white border border-white/15 uppercase font-bold">
                          {numStr}
                        </span>
                        <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#22C55E] ring-2 ring-black/80" title="Confirmed Cast" />
                        <div className="absolute bottom-0 left-0 right-0 p-1.5 text-left bg-gradient-to-t from-black via-black/80 to-transparent">
                          <p className="text-[6.5px] font-mono text-[#E62429] font-bold uppercase truncate">
                            {SHORT_FACTION_LABEL[char.category] || char.category}
                          </p>
                          <h5 className="text-[9.5px] font-cinematic font-bold text-white uppercase truncate leading-tight">
                            {char.name}
                          </h5>
                          <p className="text-[7px] font-mono text-[#9CA3AF] truncate">
                            {char.actor}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty state */}
              {filteredCharacters.length === 0 && (
                <div className="py-16 px-4 text-center border border-[#1E252D] bg-[#0B0D12] rounded-xs">
                  <p className="text-xs font-mono text-[#9CA3AF] mb-3">
                    NO CONFIRMED CHARACTERS MATCHING "{searchQuery}"
                    {categoryFilter !== 'ALL' ? ` IN ${categoryFilter.toUpperCase()}` : ''}.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setCategoryFilter('ALL');
                    }}
                    className="px-3 py-1.5 border border-[#22C55E]/40 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[10px] font-mono text-[#22C55E] uppercase tracking-wider cursor-pointer rounded-xs"
                  >
                    RESET FILTERS
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* Detail Dossier Modal */}
      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </section>
  );
}
