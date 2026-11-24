import React, { useState, useMemo } from 'react';
import { CHARACTERS_DATA } from '../data/characters.js';
import { clockAudio } from '../utils/audio.js';
import { Sparkles, Layers, RotateCcw, Search, X, Shield, Eye, Flame } from 'lucide-react';

/**
 * Iconic Stylized Avengers Emblem with Metallic Finish and Orbital Targeting Reticles
 */
function AvengersEmblem({ className = "w-14 h-14" }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="avengersRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF3338" />
          <stop offset="50%" stopColor="#E62429" />
          <stop offset="100%" stopColor="#8A0F12" />
        </linearGradient>
        <linearGradient id="avengersCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#007799" />
        </linearGradient>
        <linearGradient id="avengersSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#D8D9DC" />
          <stop offset="100%" stopColor="#7E8492" />
        </linearGradient>
        <filter id="avengersGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Orbital Tech Dashed Ring */}
      <circle cx="50" cy="50" r="46" stroke="url(#avengersRedGrad)" strokeWidth="2.5" strokeDasharray="10 4" opacity="0.8" />
      <circle cx="50" cy="50" r="41" stroke="url(#avengersCyanGrad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

      {/* Outer Tactical Arc with Top-Right Thrust Arrow */}
      <path
        d="M 50 10 A 40 40 0 1 1 14 62"
        stroke="url(#avengersRedGrad)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      
      {/* Arrow Head */}
      <path
        d="M 68 38 L 86 38 L 86 20 L 78 20 L 78 28 L 65 15 L 59 21 L 71 33 Z"
        fill="url(#avengersSilverGrad)"
        filter="url(#avengersGlow)"
      />

      {/* Main Stylized Avengers 'A' Stem */}
      <path
        d="M 54 22 L 37 78 L 47 78 L 51 64 L 68 64 L 72 78 L 83 78 L 63 22 Z M 54 53 L 58 37 L 65 53 Z"
        fill="url(#avengersRedGrad)"
      />

      {/* Horizontal Crossbar Arrow Thrusting Left */}
      <path
        d="M 20 54 L 73 54 L 73 61 L 20 61 Z"
        fill="url(#avengersSilverGrad)"
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
    try { clockAudio.tick(0); } catch (e) {}
    setIsVaultOpen(true);
    setDealKey((prev) => prev + 1);
    setSpotlightChar(CHARACTERS_DATA[0]);
  };

  // Close / Pack cards back into box (Saves Space per user instruction)
  const handlePackVault = () => {
    try { clockAudio.tick(0); } catch (e) {}
    setIsVaultOpen(false);
    setHoveredIndex(null);
    setSpotlightChar(null);
  };

  // Re-deal and shuffle random heroes
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

  // Determine which characters to display in Fan Mode
  const displayedFanCharacters = useMemo(() => {
    if (filteredCharacters.length === 0) return [];
    if (filteredCharacters.length <= 11) return filteredCharacters;
    return activeHandIndices.map((idx) => filteredCharacters[idx]).filter(Boolean);
  }, [filteredCharacters, activeHandIndices]);

  return (
    <div className="select-none mb-8">
      
      {/* ═════════════════════════════════════════════════════════════════════
          1. CLOSED STATE: AVENGERS THEME QUANTUM HERO VAULT
          - High-tech Avengers 'A' rotating arc reactor emblem
          - Quantum cyan & crimson energy pulses
          - Stark Tech HUD corner brackets
          - Minimal vertical space footprint
         ═════════════════════════════════════════════════════════════════════ */}
      {!isVaultOpen ? (
        <div className="relative max-w-4xl mx-auto px-2">
          {/* Ambient Multi-Hue Floor Energy Aura */}
          <div className="absolute -inset-3 bg-gradient-to-r from-[#E62429]/25 via-[#00E5FF]/15 to-[#22C55E]/20 rounded-2xl blur-xl opacity-70 pointer-events-none" />

          <button
            type="button"
            onClick={handleOpenVault}
            className="w-full relative overflow-hidden group p-5 sm:p-7 border-2 border-[#E62429]/60 hover:border-[#00E5FF] bg-gradient-to-br from-[#12141A] via-[#0D0E13] to-[#08090C] transition-all duration-500 cursor-pointer text-left shadow-[0_20px_60px_rgba(0,0,0,0.9)] avengers-vault-glow rounded-lg"
          >
            {/* Tech HUD Corner Brackets */}
            <div className="absolute top-2 left-2 text-[8px] font-mono text-[#00E5FF]/70 select-none">[ + ]</div>
            <div className="absolute top-2 right-2 text-[8px] font-mono text-[#E62429]/70 select-none">[ + ]</div>
            <div className="absolute bottom-2 left-2 text-[8px] font-mono text-[#22C55E]/70 select-none">[ + ]</div>
            <div className="absolute bottom-2 right-2 text-[8px] font-mono text-[#00E5FF]/70 select-none">[ + ]</div>

            {/* Sweep Holographic Light Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
              
              {/* Left: Avengers 'A' Crest + Card Deck Preview */}
              <div className="flex items-center gap-4 sm:gap-6">
                
                {/* Rotating Avengers Arc Reactor Icon Frame */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center">
                  {/* Outer Counter-Spinning Quantum Ring */}
                  <div className="absolute inset-0 border border-dashed border-[#00E5FF]/40 rounded-full avengers-ring-counter-spin pointer-events-none" />
                  
                  {/* Inner Spinning Avengers Ring */}
                  <div className="absolute inset-1.5 border border-[#E62429]/60 rounded-full avengers-ring-spin pointer-events-none" />
                  
                  {/* Pulsing Arc Center */}
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-black/90 border border-[#E62429] flex items-center justify-center shadow-[0_0_25px_rgba(230,36,41,0.7)] group-hover:scale-108 transition-transform duration-300">
                    <AvengersEmblem className="w-9 h-9 sm:w-11 sm:h-11 avengers-arc-pulse" />
                  </div>

                  {/* Tiny 51 Badge */}
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#E62429] text-[7.5px] font-mono font-bold text-white border border-white/20 shadow-md">
                    51
                  </span>
                </div>

                {/* Vault Title & Brief */}
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[8.5px] sm:text-[9.5px] font-mono tracking-widest text-[#00E5FF] uppercase font-bold mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping shrink-0" />
                    AVENGERS ASSEMBLE // 51 HERO CARDS
                  </div>
                  <h3 className="text-base sm:text-2xl font-cinematic font-black text-white uppercase tracking-tight group-hover:text-white transition-colors flex items-center gap-2">
                    AVENGERS: DOOMSDAY // HERO VAULT
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-[#8C9098] mt-0.5 max-w-lg leading-relaxed">
                    Touch this vault to unleash all 51 Marvel heroes. Cards will pop up and deal out into an interactive 3D battle fan.
                  </p>
                </div>
              </div>

              {/* Right: Tactile Touch Callout Button */}
              <div className="flex flex-col items-center sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
                <div className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-[#E62429] via-[#F0383D] to-[#E62429] group-hover:from-[#00E5FF] group-hover:to-[#00B4D8] text-white group-hover:text-black text-xs sm:text-sm font-cinematic font-black tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(230,36,41,0.7)] flex items-center justify-center gap-2 group-hover:scale-105 rounded-sm">
                  <span>✦ ASSEMBLE & DEAL CARDS</span>
                  <span className="text-base">→</span>
                </div>
                <span className="text-[8.5px] font-mono tracking-wider text-[#777A80] uppercase">
                  TAP TO UNLEASH MULTIVERSE ROSTER
                </span>
              </div>

            </div>
          </button>
        </div>
      ) : (

        /* ═════════════════════════════════════════════════════════════════════
            2. OPENED STATE: UNIFIED AVENGERS ASSEMBLE CARD ARENA
            - Card deals with 3D Pop & Fan-Out Animation
            - Integrated Faction Filters & Search (Saves Space Below)
            - Toggle 3D Fan Arc vs Full Multiverse 51-Card Matrix
            - Pack Vault button to minimize and save space
           ═════════════════════════════════════════════════════════════════════ */
        <div className="relative border-2 border-[#00E5FF]/60 bg-gradient-to-b from-[#0C0D11] via-[#08090C] to-[#050608] p-3 sm:p-6 shadow-[0_0_80px_rgba(0,229,255,0.25)] rounded-lg overflow-hidden">
          
          {/* Top Holographic Scanline */}
          <div className="absolute inset-0 pointer-events-none avengers-holo-scan opacity-20" />

          {/* ── ARENA TOP BAR: CONTROLS & METRICS ── */}
          <div className="relative z-10 flex flex-col gap-3 pb-3 mb-4 border-b border-[#1E2024]">
            
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Left Indicator */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#E62429]/20 border border-[#E62429] flex items-center justify-center shrink-0">
                  <AvengersEmblem className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#00E5FF] uppercase font-bold">
                      AVENGERS ASSEMBLED // {filteredCharacters.length} HEROES READY
                    </span>
                    <span className="px-1.5 py-0.2 bg-[#22C55E]/20 text-[#22C55E] text-[8px] font-mono font-bold border border-[#22C55E]/40 uppercase">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] font-mono text-[#777A80] hidden xs:block">
                    CLICK ANY CARD TO OPEN DOSSIER • HOVER TO INSPECT CAPABILITIES
                  </p>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Re-Shuffle */}
                <button
                  type="button"
                  onClick={handleShuffleNewHand}
                  className="px-2.5 sm:px-3 py-1.5 border border-[#E62429]/60 hover:border-[#E62429] bg-[#E62429]/20 hover:bg-[#E62429] text-white text-[9px] sm:text-[10px] font-mono tracking-wider uppercase font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                  title="Shuffle cards with deal animation"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>RE-SHUFFLE</span>
                </button>

                {/* View Switcher: Fan vs Full Matrix */}
                <button
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch (e) {}
                    setDealMode(dealMode === 'fan' ? 'all' : 'fan');
                    setDealKey((k) => k + 1);
                  }}
                  className="px-2.5 sm:px-3 py-1.5 border border-[#00E5FF]/50 hover:border-[#00E5FF] bg-[#00E5FF]/15 hover:bg-[#00E5FF]/30 text-[#00E5FF] text-[9px] sm:text-[10px] font-mono tracking-wider uppercase font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Layers className="w-3 h-3" />
                  <span>{dealMode === 'fan' ? 'DECK GRID (51)' : '3D FAN ARC'}</span>
                </button>

                {/* Pack Box / Minimize (Saves Space) */}
                <button
                  type="button"
                  onClick={handlePackVault}
                  className="px-2.5 sm:px-3 py-1.5 border border-[#1E2024] hover:border-white/50 bg-black/70 text-[#777A80] hover:text-white text-[9px] sm:text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1"
                  title="Pack cards back into the vault to save space"
                >
                  <X className="w-3 h-3 text-[#E62429]" />
                  <span>PACK VAULT</span>
                </button>
              </div>
            </div>

            {/* ── INTEGRATED SEARCH & FACTION TABS (Unified to save space) ── */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 pt-2 border-t border-[#1E2024]/60">
              
              {/* Quick Search Input */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#00E5FF]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Quick search hero or actor..."
                  className="w-full pl-8 pr-7 py-1.5 bg-[#101217] border border-[#232730] focus:border-[#00E5FF] text-[11px] font-mono text-white placeholder-[#55585E] outline-none transition-colors rounded-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#777A80] hover:text-white"
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
                        try { clockAudio.tick(0); } catch (e) {}
                        setCategoryFilter(cat);
                        setDealKey((k) => k + 1);
                      }}
                      className={`px-2 py-0.5 text-[8.5px] xs:text-[9px] font-mono tracking-wider uppercase transition-all cursor-pointer border rounded-xs ${
                        isActive
                          ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-white font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                          : 'border-[#1E2024] bg-[#101115]/80 text-[#777A80] hover:text-white hover:border-[#2D3036]'
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
              VIEW 1: 3D TACTICAL CARD FAN ARC (Cards Deal & Fan Symmetrically)
             ═════════════════════════════════════════════════════════════════ */}
          {dealMode === 'fan' ? (
            <div className="relative py-10 sm:py-16 min-h-[360px] sm:min-h-[420px] flex items-center justify-center overflow-x-auto overflow-y-visible perspective-1200">
              
              {/* Origin Avengers Arc Reactor Emitter (Where cards deal from) */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-10 rounded border border-[#00E5FF]/40 bg-black/95 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.4)] z-0 pointer-events-none">
                <span className="text-[8px] font-mono text-[#00E5FF] uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
                  AVENGERS DISPENSER
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
                        try { clockAudio.tick(0); } catch (e) {}
                      }}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => onSelectCharacter(char)}
                      className="absolute w-26 xs:w-30 sm:w-40 aspect-[2/3] cursor-pointer card-pop-fan card-fan-item rounded border-2 border-[#232730] hover:border-[#00E5FF] bg-black overflow-hidden shadow-2xl transition-all"
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                      {/* Role Pill Badge */}
                      <span className="absolute top-1 left-1 text-[6px] sm:text-[7px] font-mono tracking-wider px-1 sm:px-1.5 py-0.5 bg-black/90 text-[#22C55E] border border-[#22C55E]/40 uppercase font-bold truncate max-w-[90%]">
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

                      {/* Holographic Sheen */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/15 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (

            /* ═════════════════════════════════════════════════════════════════
                VIEW 2: MULTIVERSE BATTLE DECK (Responsive All-Card Matrix)
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
                    try { clockAudio.tick(0); } catch (e) {}
                  }}
                  className="relative aspect-[2/3] rounded border border-[#232730] hover:border-[#00E5FF] bg-black overflow-hidden shadow-lg cursor-pointer group card-pop-fan transition-all duration-300 hover:scale-104 hover:shadow-[0_8px_25px_rgba(0,229,255,0.4)]"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  
                  {/* Role Tag */}
                  <span className="absolute top-1 left-1 text-[6.5px] font-mono tracking-wider px-1 py-0.5 bg-black/90 text-[#22C55E] border border-[#22C55E]/40 uppercase font-bold max-w-[85%] truncate">
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
                    <p className="text-[6.5px] font-mono text-[#777A80] truncate">
                      {char.category}
                    </p>
                  </div>

                  {/* Shimmer sweep on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                </div>
              ))}
            </div>
          )}

          {/* Empty search notice */}
          {filteredCharacters.length === 0 && (
            <div className="py-12 text-center text-xs font-mono text-[#777A80]">
              NO HEROES MATCHING "{searchQuery}". TRY SEARCHING ANOTHER NAME.
            </div>
          )}

          {/* ── SPOTLIGHT DOSSIER PREVIEW BAR (Hovered / Selected Hero) ── */}
          {spotlightChar && (
            <div className="mt-3 pt-3 border-t border-[#1E2024] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0F1116] p-2.5 sm:p-3.5 border border-[#232730] rounded-sm">
              <div className="flex items-center gap-3">
                <img
                  src={spotlightChar.poster}
                  alt={spotlightChar.name}
                  className="w-9 sm:w-11 aspect-[2/3] object-cover border border-[#00E5FF] shrink-0 rounded-xs"
                />
                <div>
                  <div className="flex items-center gap-2 text-[8px] sm:text-[9px] font-mono text-[#00E5FF] uppercase font-bold">
                    <span>{spotlightChar.roleTag}</span>
                    <span className="text-[#44474E]">•</span>
                    <span className="text-[#22C55E]">{spotlightChar.status}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-cinematic font-black text-white uppercase leading-tight">
                    {spotlightChar.name} — <span className="text-[#D8D9DC] font-normal text-[11px]">{spotlightChar.actor}</span>
                  </h4>
                  <p className="text-[9.5px] sm:text-[11px] font-body text-[#8C9098] line-clamp-1">
                    {spotlightChar.summary}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectCharacter(spotlightChar)}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#E62429] to-[#F0383D] hover:from-[#00E5FF] hover:to-[#00B4D8] text-white hover:text-black text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase transition-all shadow-md shrink-0 cursor-pointer flex items-center justify-center gap-1.5 rounded-xs"
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
