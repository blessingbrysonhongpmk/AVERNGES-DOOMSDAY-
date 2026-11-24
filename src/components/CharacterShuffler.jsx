import React, { useState, useMemo } from 'react';
import { CHARACTERS_DATA } from '../data/characters.js';
import { clockAudio } from '../utils/audio.js';
import { Sparkles, Layers, RotateCcw, Search, X, Shield, Eye, Flame } from 'lucide-react';

/**
 * Iconic Avengers: Doomsday Corrupted Crest
 * Forged Damascus titanium Avengers 'A' infused with Latverian emerald sorcery flame,
 * gothic rose window lattice, and orbiting multiversal incursion runes.
 */
function DoomsdayAvengersEmblem({ className = "w-16 h-16" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="doomCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00FF88" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#10B981" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#064E3B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="doomEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="35%" stopColor="#34D399" />
          <stop offset="70%" stopColor="#059669" />
          <stop offset="100%" stopColor="#022C22" />
        </linearGradient>
        <linearGradient id="doomSteelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E2E8F0" />
          <stop offset="65%" stopColor="#64748B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <filter id="doomEldritchGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Sorcery Core */}
      <circle cx="50" cy="50" r="42" fill="url(#doomCoreGlow)" />

      {/* Latverian Stained-Glass Rose Lattice Lines */}
      <circle cx="50" cy="50" r="46" stroke="#10B981" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="5 3" />
      <circle cx="50" cy="50" r="39" stroke="#34D399" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* Gothic Hexagonal Lattice Ring */}
      <polygon
        points="50,14 81,32 81,68 50,86 19,68 19,32"
        stroke="#10B981"
        strokeWidth="1.2"
        strokeOpacity="0.4"
        fill="none"
      />

      {/* Outer Avengers Arc with Thrust Arrow (Forged Steel & Emerald Edge) */}
      <path
        d="M 50 12 A 38 38 0 1 1 15 62"
        stroke="url(#doomEmeraldGrad)"
        strokeWidth="5"
        strokeLinecap="round"
        filter="url(#doomEldritchGlow)"
      />
      <path
        d="M 50 12 A 38 38 0 1 1 15 62"
        stroke="url(#doomSteelGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Arrow Head (Forged Chiseled Silver with Emerald Aura) */}
      <path
        d="M 68 38 L 86 38 L 86 20 L 78 20 L 78 28 L 65 15 L 59 21 L 71 33 Z"
        fill="url(#doomSteelGrad)"
        stroke="#10B981"
        strokeWidth="1"
      />

      {/* Main Stylized Avengers 'A' Stem (Titanium & Emerald Core) */}
      <path
        d="M 54 22 L 37 78 L 47 78 L 51 64 L 68 64 L 72 78 L 83 78 L 63 22 Z M 54 53 L 58 37 L 65 53 Z"
        fill="url(#doomSteelGrad)"
        stroke="#059669"
        strokeWidth="1"
      />

      {/* Horizontal Crossbar Arrow Thrusting Left */}
      <path
        d="M 20 54 L 73 54 L 73 61 L 20 61 Z"
        fill="url(#doomEmeraldGrad)"
      />
    </svg>
  );
}

export default function CharacterShuffler({ onSelectCharacter }) {
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [dealMode, setDealMode] = useState('fan'); // 'fan' | 'all'
  const [dealKey, setDealKey] = useState(0);
  const [activeHandIndices, setActiveHandIndices] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]); // 11-hero deal
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
      // Category filter
      let matchesCategory = true;
      if (categoryFilter === 'FANTASTIC FOUR') matchesCategory = char.category === 'FANTASTIC FOUR' || char.affiliation.includes('Fantastic Four');
      else if (categoryFilter === 'ANTAGONIST') matchesCategory = char.category === 'ANTAGONIST' || char.roleTag.includes('ANTAGONIST') || char.roleTag.includes('WARLORD') || char.roleTag.includes('DEVOURER');
      else if (categoryFilter === 'AVENGERS') matchesCategory = char.category === 'AVENGERS' || char.affiliation.includes('Avengers');
      else if (categoryFilter === 'THUNDERBOLTS') matchesCategory = char.category === 'THUNDERBOLTS' || char.affiliation.includes('Thunderbolts');
      else if (categoryFilter === 'GUARDIANS') matchesCategory = char.category === 'GUARDIANS' || char.affiliation.includes('Guardians');
      else if (categoryFilter === 'STREET & MYSTIC') matchesCategory = char.category === 'STREET & MYSTIC' || char.affiliation.includes('Defenders');
      else if (categoryFilter === 'MULTIVERSE') matchesCategory = char.category === 'MULTIVERSE' || char.roleTag.includes('MULTIVERSAL') || char.affiliation.includes('X-Men');

      if (!matchesCategory) return false;

      // Text search
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

  // Touch / Click the Avengers Box to Trigger Mass Entry Split & Arrange
  const handleOpenVault = () => {
    try { clockAudio.tick(0); } catch (e) { }
    setIsVaultOpen(true);
    setDealKey((prev) => prev + 1);
    setSpotlightChar(CHARACTERS_DATA[0]);
  };

  // Close / Pack cards back into box (Saves Space per user instruction)
  const handlePackVault = () => {
    try { clockAudio.tick(0); } catch (e) { }
    setIsVaultOpen(false);
    setHoveredIndex(null);
    setSpotlightChar(null);
  };

  // Re-deal and shuffle random heroes
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

  // Determine which characters to display in Fan Mode
  const displayedFanCharacters = useMemo(() => {
    if (filteredCharacters.length === 0) return [];
    if (filteredCharacters.length <= 11) return filteredCharacters;
    return activeHandIndices.map((idx) => filteredCharacters[idx]).filter(Boolean);
  }, [filteredCharacters, activeHandIndices]);

  return (
    <div className="select-none mb-8">

      {/* ═════════════════════════════════════════════════════════════════════
          1. CLOSED STATE: AVENGERS: DOOMSDAY DARK & CREATIVE HERO VAULT
          - Deep obsidian forged steel chassis with gothic stained-glass lattice
          - Doctor Doom Latverian emerald sorcery flame & corrupted Avengers crest
          - Breathing emerald-green incursion aura
          - Forged runic coordinates & gold-leaf trim
         ═════════════════════════════════════════════════════════════════════ */}
      {!isVaultOpen ? (
        <div className="relative max-w-4xl mx-auto px-2">
          {/* Ambient Incursion Aura */}
          <div className="absolute -inset-3 bg-gradient-to-r from-[#10B981]/30 via-[#00FF88]/15 to-[#E62429]/25 rounded-2xl blur-xl opacity-75 pointer-events-none" />

          <button
            type="button"
            onClick={handleOpenVault}
            className="w-full relative overflow-hidden group p-6 sm:p-8 border-2 border-[#10B981]/50 hover:border-[#00FF88] bg-gradient-to-br from-[#0B0D11] via-[#06080A] to-[#030406] transition-all duration-500 cursor-pointer text-left shadow-[0_20px_70px_rgba(0,0,0,0.95)] doomsday-vault-glow doomsday-stained-glass-bg rounded-lg"
          >
            {/* Gothic Forged Corner Embellishments */}
            <div className="absolute top-2.5 left-3 text-[8px] font-mono tracking-widest text-[#10B981]/80 select-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#10B981] rotate-45 inline-block" />
              <span>LATVERIA // 45.1667° N</span>
            </div>
            <div className="absolute top-2.5 right-3 text-[8px] font-mono tracking-widest text-[#E62429]/80 select-none flex items-center gap-1">
              <span>INCURSION // 616x838</span>
              <span className="w-1.5 h-1.5 bg-[#E62429] rotate-45 inline-block" />
            </div>
            <div className="absolute bottom-2.5 left-3 text-[8px] font-mono tracking-widest text-[#10B981]/60 select-none">
              [ ᚛ DOOMSDAY NEXUS ᚜ ]
            </div>
            <div className="absolute bottom-2.5 right-3 text-[8px] font-mono tracking-widest text-[#00FF88]/60 select-none">
              [ 51 SOVEREIGN HEROES ]
            </div>

            {/* Sweep Emerald Sorcery Energy Line Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#10B981]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none doomsday-emerald-sweep" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 pt-2 pb-1">

              {/* Left: Doomsday Crest + Vault Identity */}
              <div className="flex items-center gap-5 sm:gap-7">

                {/* Latverian Relic Casing with Orbiting Runic Rings */}
                <div className="relative w-18 h-18 sm:w-22 sm:h-22 shrink-0 flex items-center justify-center">
                  {/* Outer Orbiting Runic Circle */}
                  <div className="absolute inset-0 border border-dashed border-[#10B981]/40 rounded-full doomsday-rune-counter pointer-events-none" />

                  {/* Middle Stained-Glass Emerald Ring */}
                  <div className="absolute inset-2 border border-[#34D399]/60 rounded-full doomsday-rune-spin pointer-events-none" />

                  {/* Pulsing Doom Arc Center */}
                  <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-black/95 border-2 border-[#10B981] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.7)] group-hover:scale-108 transition-transform duration-300">
                    <DoomsdayAvengersEmblem className="w-11 h-11 sm:w-14 sm:h-14 doomsday-sorcery-pulse" />
                  </div>

                  {/* 51 Hero Badge in Latverian Emerald */}
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#059669] to-[#10B981] text-[8px] font-mono font-bold text-white border border-[#34D399] shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                    51
                  </span>
                </div>

                {/* Vault Title & Brief */}
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-[#10B981]/50 bg-[#10B981]/15 text-[8.5px] sm:text-[9.5px] font-mono tracking-widest text-[#34D399] uppercase font-bold mb-1.5 rounded-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping shrink-0" />
                    DOOMSDAY VAULT // 51 CLASSIFIED DOSSIERS
                  </div>
                  <h3 className="text-lg sm:text-2xl font-cinematic font-black text-white uppercase tracking-tight group-hover:text-white transition-colors flex items-center gap-2">
                    <span>AVENGERS: DOOMSDAY</span>
                    <span className="text-[#10B981] text-sm sm:text-lg font-mono font-normal tracking-wider">// HERO VAULT</span>
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-[#9CA3AF] mt-1 max-w-lg leading-relaxed">
                    Forged in the Latverian sanctum at the nexus of Multiverse incursions. Touch this vault to release all 51 heroes and villains into an interactive 3D battle fan.
                  </p>
                </div>
              </div>

              {/* Right: Tactile Forged Obsidian & Emerald CTA Button */}
              <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
                <div className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#064E3B] via-[#059669] to-[#10B981] hover:from-[#10B981] hover:to-[#00FF88] text-white hover:text-black text-xs sm:text-sm font-cinematic font-black tracking-widest uppercase transition-all shadow-[0_0_35px_rgba(16,185,129,0.7)] flex items-center justify-center gap-2.5 group-hover:scale-105 border border-[#34D399]/60 rounded-xs">
                  <span className="text-base text-[#A7F3D0] group-hover:text-black">✦</span>
                  <span>UNLEASH MULTIVERSE DECK</span>
                  <span className="text-base">→</span>
                </div>
                <span className="text-[8.5px] font-mono tracking-wider text-[#6B7280] uppercase">
                  TAP TO ACTIVATE 3D BATTLE ARENA
                </span>
              </div>

            </div>
          </button>
        </div>
      ) : (

        /* ═════════════════════════════════════════════════════════════════════
            2. OPENED STATE: UNIFIED DOOMSDAY MULTIVERSE CARD ARENA
            - Dark obsidian gothic architecture with Latverian stained glass
            - 3D Pop & Fan-Out Deal + Full Multiverse Matrix View
            - Integrated Faction Filters & Search (Saves Space Below)
            - Pack Vault button to minimize and save space
           ═════════════════════════════════════════════════════════════════════ */
        <div className="relative border-2 border-[#10B981]/70 bg-gradient-to-b from-[#0B0D11] via-[#06080B] to-[#030406] p-3 sm:p-6 shadow-[0_0_90px_rgba(16,185,129,0.3)] rounded-lg overflow-hidden doomsday-stained-glass-bg">

          {/* Ambient Emerald Sorcery Light Sweep */}
          <div className="absolute inset-0 pointer-events-none avengers-holo-scan opacity-25" />

          {/* ── ARENA TOP BAR: CONTROLS & METRICS ── */}
          <div className="relative z-10 flex flex-col gap-3 pb-3 mb-4 border-b border-[#1E252B]">

            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left Indicator */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  <DoomsdayAvengersEmblem className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#34D399] uppercase font-bold">
                      DOOMSDAY INVASION // {filteredCharacters.length} HEROES IN PLAY
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#10B981]/20 text-[#00FF88] text-[8px] font-mono font-bold border border-[#10B981]/60 uppercase">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-mono text-[#6B7280] hidden xs:block">
                    CLICK ANY CARD TO INSPECT DOSSIER • HOVER TO REVEAL POWERS
                  </p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Re-Shuffle */}
                <button
                  type="button"
                  onClick={handleShuffleNewHand}
                  className="px-2.5 sm:px-3 py-1.5 border border-[#10B981]/60 hover:border-[#00FF88] bg-[#10B981]/20 hover:bg-[#10B981] text-white text-[9px] sm:text-[10px] font-mono tracking-wider uppercase font-bold transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                  title="Shuffle cards with deal animation"
                >
                  <RotateCcw className="w-3 h-3 text-[#A7F3D0]" />
                  <span>RE-SHUFFLE</span>
                </button>

                {/* View Switcher: Fan vs Full Matrix */}
                <button
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch (e) { }
                    setDealMode(dealMode === 'fan' ? 'all' : 'fan');
                    setDealKey((k) => k + 1);
                  }}
                  className="px-2.5 sm:px-3 py-1.5 border border-[#34D399]/50 hover:border-[#00FF88] bg-[#059669]/20 hover:bg-[#059669]/40 text-[#A7F3D0] text-[9px] sm:text-[10px] font-mono tracking-wider uppercase font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Layers className="w-3 h-3 text-[#34D399]" />
                  <span>{dealMode === 'fan' ? 'DECK MATRIX (51)' : '3D FAN ARC'}</span>
                </button>

                {/* Pack Box / Minimize (Saves Space) */}
                <button
                  type="button"
                  onClick={handlePackVault}
                  className="px-2.5 sm:px-3 py-1.5 border border-[#1F2937] hover:border-white/50 bg-black/80 text-[#9CA3AF] hover:text-white text-[9px] sm:text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1"
                  title="Pack cards back into the vault to save space"
                >
                  <X className="w-3 h-3 text-[#E62429]" />
                  <span>PACK VAULT</span>
                </button>
              </div>
            </div>

            {/* ── INTEGRATED SEARCH & FACTION TABS (Unified to save space) ── */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 pt-2 border-t border-[#1F2937]/80">

              {/* Quick Search Input */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#10B981]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hero, villain, actor..."
                  className="w-full pl-8 pr-7 py-1.5 bg-[#0A0C10] border border-[#1E252F] focus:border-[#10B981] text-[11px] font-mono text-white placeholder-[#4B5563] outline-none transition-colors rounded-xs shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF] hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Faction Tabs */}
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
                      className={`px-2 py-0.5 text-[8.5px] xs:text-[9px] font-mono tracking-wider uppercase transition-all cursor-pointer border rounded-xs ${isActive
                          ? 'border-[#10B981] bg-[#10B981]/25 text-[#A7F3D0] font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                          : 'border-[#1E252F] bg-[#0A0C10]/90 text-[#6B7280] hover:text-white hover:border-[#374151]'
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
              VIEW 1: 3D TACTICAL CARD FAN ARC (Cards Deal & Fan in 3D Arc)
             ═════════════════════════════════════════════════════════════════ */}
          {dealMode === 'fan' ? (
            <div className="relative py-10 sm:py-16 min-h-[360px] sm:min-h-[420px] flex items-center justify-center overflow-x-auto overflow-y-visible perspective-1200">

              {/* Origin Latverian Arc Dispenser */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-36 h-10 rounded border border-[#10B981]/50 bg-black/95 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5)] z-0 pointer-events-none">
                <span className="text-[8px] font-mono text-[#34D399] uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping" />
                  DOOMSDAY NEXUS
                </span>
              </div>

              {/* The Fan Container */}
              <div
                key={dealKey}
                className="relative w-full max-w-4xl h-[260px] sm:h-[310px] flex items-center justify-center"
              >
                {displayedFanCharacters.map((char, i) => {
                  const count = displayedFanCharacters.length;
                  const center = (count - 1) / 2;
                  const offset = i - center;

                  // Dynamic Math Calculations for Authentic Card Fan Spread
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
                      className="absolute w-26 xs:w-30 sm:w-40 aspect-[2/3] cursor-pointer card-pop-fan card-fan-item rounded border-2 border-[#1E252F] hover:border-[#10B981] bg-black overflow-hidden shadow-2xl transition-all"
                      style={{
                        '--tx': `${tx}px`,
                        '--ty': `${ty}px`,
                        '--rot': `${rot}deg`,
                        zIndex: hoveredIndex === i ? 70 : zIndex,
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                      {/* Role Pill Badge */}
                      <span className="absolute top-1 left-1 text-[6px] sm:text-[7px] font-mono tracking-wider px-1 sm:px-1.5 py-0.5 bg-black/90 text-[#34D399] border border-[#10B981]/40 uppercase font-bold truncate max-w-[90%]">
                        {char.roleTag}
                      </span>

                      {/* Card Bottom Meta */}
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2 text-left">
                        <p className="text-[7px] sm:text-[8px] font-mono text-[#E62429] font-bold uppercase truncate">
                          {char.actor}
                        </p>
                        <h4 className="text-[9.5px] sm:text-[11px] font-cinematic font-bold text-white uppercase truncate leading-tight">
                          {char.name}
                        </h4>
                      </div>

                      {/* Emerald Incursion Holographic Sheen */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-[#10B981]/15 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (

            /* ═════════════════════════════════════════════════════════════════
                VIEW 2: MULTIVERSE MATRIX (Responsive All 51 Heroes)
               ═════════════════════════════════════════════════════════════════ */
            <div
              key={dealKey}
              className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-2.5 py-2 max-h-[620px] overflow-y-auto pr-1"
            >
              {filteredCharacters.map((char, i) => (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacter(char)}
                  onMouseEnter={() => {
                    setSpotlightChar(char);
                    try { clockAudio.tick(0); } catch (e) { }
                  }}
                  className="relative aspect-[2/3] rounded border border-[#1E252F] hover:border-[#10B981] bg-black overflow-hidden shadow-lg cursor-pointer group card-pop-fan transition-all duration-300 hover:scale-104 hover:shadow-[0_8px_30px_rgba(16,185,129,0.45)]"
                  style={{
                    '--tx': '0px',
                    '--ty': '0px',
                    '--rot': '0deg',
                    animationDelay: `${Math.min(i * 0.02, 0.4)}s`,
                  }}
                >
                  {/* Character Avatar */}
                  <img
                    src={char.poster}
                    alt={char.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />

                  {/* Role Tag */}
                  <span className="absolute top-1 left-1 text-[6.5px] font-mono tracking-wider px-1 py-0.5 bg-black/90 text-[#34D399] border border-[#10B981]/40 uppercase font-bold max-w-[85%] truncate">
                    {char.roleTag}
                  </span>

                  {/* Character Meta */}
                  <div className="absolute bottom-0 left-0 right-0 p-1.5 text-left">
                    <p className="text-[7px] font-mono text-[#E62429] font-bold uppercase truncate">
                      {char.actor}
                    </p>
                    <h5 className="text-[10px] font-cinematic font-bold text-white uppercase truncate">
                      {char.name}
                    </h5>
                    <p className="text-[6.5px] font-mono text-[#9CA3AF] truncate">
                      {char.category}
                    </p>
                  </div>

                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#10B981]/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                </div>
              ))}
            </div>
          )}

          {/* Empty search notice */}
          {filteredCharacters.length === 0 && (
            <div className="py-12 text-center text-xs font-mono text-[#9CA3AF]">
              NO HEROES OR ANTAGONISTS MATCHING "{searchQuery}". TRY SEARCHING ANOTHER NAME.
            </div>
          )}

          {/* ── SPOTLIGHT DOSSIER PREVIEW BAR (Hovered / Selected Hero) ── */}
          {spotlightChar && (
            <div className="mt-3 pt-3 border-t border-[#1F2937] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0A0D12] p-2.5 sm:p-3.5 border border-[#1E252F] rounded-xs shadow-inner">
              <div className="flex items-center gap-3">
                <img
                  src={spotlightChar.poster}
                  alt={spotlightChar.name}
                  className="w-9 sm:w-11 aspect-[2/3] object-cover border border-[#10B981] shrink-0 rounded-xs"
                />
                <div>
                  <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-mono text-[#34D399] uppercase font-bold">
                    <span>{spotlightChar.roleTag}</span>
                    <span className="text-[#4B5563]">•</span>
                    <span className="text-[#00FF88]">{spotlightChar.status}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-cinematic font-black text-white uppercase leading-tight">
                    {spotlightChar.name} — <span className="text-[#D1D5DB] font-normal text-[11px]">{spotlightChar.actor}</span>
                  </h4>
                  <p className="text-[9.5px] sm:text-[11px] font-body text-[#9CA3AF] line-clamp-1">
                    {spotlightChar.summary}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectCharacter(spotlightChar)}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#064E3B] to-[#10B981] hover:from-[#10B981] hover:to-[#00FF88] text-white hover:text-black text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase transition-all shadow-md shrink-0 cursor-pointer flex items-center justify-center gap-1.5 rounded-xs border border-[#34D399]/50"
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
