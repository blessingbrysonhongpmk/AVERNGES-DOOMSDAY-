import React, { useState, useEffect, useMemo } from 'react';
import { CHARACTERS_DATA } from '../data/characters.js';
import { clockAudio } from '../utils/audio.js';
import { Sparkles, Layers, RotateCcw, Eye, X } from 'lucide-react';

export default function CharacterShuffler({ onSelectCharacter }) {
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [dealMode, setDealMode] = useState('fan'); // 'fan' | 'all'
  const [dealKey, setDealKey] = useState(0); // changes to trigger re-burst animation
  const [activeHandIndices, setActiveHandIndices] = useState([0, 1, 2, 5, 6, 8, 9, 12, 13]); // initial 9-hero deal
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [spotlightChar, setSpotlightChar] = useState(null);

  // Pick 9 random characters from the 20-character roster
  const shuffleNewHand = () => {
    try { clockAudio.tick(0); } catch (e) {}
    const indices = [];
    const available = Array.from({ length: CHARACTERS_DATA.length }, (_, i) => i);
    while (indices.length < 9 && available.length > 0) {
      const randomIdx = Math.floor(Math.random() * available.length);
      indices.push(available.splice(randomIdx, 1)[0]);
    }
    setActiveHandIndices(indices);
    setDealKey((prev) => prev + 1);
    setSpotlightChar(CHARACTERS_DATA[indices[Math.floor(indices.length / 2)]]);
  };

  // Touch / Click the Box to Trigger Mass Entry Split & Arrange
  const handleTouchBox = () => {
    try { clockAudio.tick(0); } catch (e) {}
    setIsBoxOpen(true);
    setDealKey((prev) => prev + 1);
    // Default spotlight to Doctor Doom or middle hero
    setSpotlightChar(CHARACTERS_DATA[activeHandIndices[Math.floor(activeHandIndices.length / 2)]]);
  };

  // Close / Pack cards back into box
  const handlePackBox = () => {
    try { clockAudio.tick(0); } catch (e) {}
    setIsBoxOpen(false);
    setHoveredIndex(null);
    setSpotlightChar(null);
  };

  const displayedCharacters = useMemo(() => {
    if (dealMode === 'all') {
      return CHARACTERS_DATA;
    }
    return activeHandIndices.map((idx) => CHARACTERS_DATA[idx]).filter(Boolean);
  }, [dealMode, activeHandIndices]);

  return (
    <div className="mb-10 sm:mb-16 select-none">
      
      {/* ── 1. THE CLOSED DECK BOX (Card Game Box Waiting to be Touched) ── */}
      {!isBoxOpen ? (
        <div className="relative max-w-3xl mx-auto">
          {/* Ambient floor glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#E62429]/20 via-[#22C55E]/10 to-[#E62429]/20 rounded-2xl blur-xl opacity-60 pointer-events-none" />

          <button
            type="button"
            onClick={handleTouchBox}
            className="w-full relative overflow-hidden group p-6 sm:p-9 border-2 border-[#3A3D45] hover:border-[#E62429] bg-[#101115] transition-all duration-500 cursor-pointer text-left shadow-[0_20px_50px_rgba(0,0,0,0.85)] deck-box-glow"
          >
            {/* Shimmer sweep effect across the box */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Left: Box Details */}
              <div className="flex items-center gap-5">
                {/* 3D Booster Deck Vault Icon */}
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 bg-gradient-to-br from-[#1A1C23] via-[#0E0F13] to-[#050507] border-2 border-[#E62429] rounded-lg shadow-2xl flex flex-col items-center justify-between p-2 shrink-0 group-hover:scale-108 group-hover:rotate-2 transition-transform duration-300">
                  <div className="w-full text-center border-b border-[#E62429]/40 pb-1">
                    <span className="text-[7px] font-mono tracking-widest text-[#E62429] font-bold uppercase">AVENGERS</span>
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#E62429]/20 border border-[#E62429] flex items-center justify-center text-sm shadow-[0_0_15px_rgba(230,36,41,0.8)]">
                    ⚡
                  </div>
                  <span className="text-[7px] font-mono text-white/80 font-bold uppercase">20 CARDS</span>
                </div>

                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 border border-[#E62429]/50 bg-[#E62429]/15 text-[9px] sm:text-[10px] font-mono tracking-widest text-[#E62429] uppercase font-bold mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E62429] animate-ping shrink-0" />
                    CARD GAME DECK // TOUCH TO UNLEASH
                  </div>
                  <h3 className="text-lg sm:text-2xl font-cinematic font-black text-white uppercase tracking-tight group-hover:text-white transition-colors">
                    AVENGERS: DOOMSDAY // HERO VAULT
                  </h3>
                  <p className="text-xs sm:text-sm font-body text-[#8C9098] mt-1 max-w-md">
                    Touch this box to trigger the mass entry. The cards will split, pop up, and arrange in a 3D battle fan before your eyes.
                  </p>
                </div>
              </div>

              {/* Right: Tactile Touch Callout */}
              <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                <div className="px-5 py-3 bg-[#E62429] group-hover:bg-[#F0383D] text-white text-xs sm:text-sm font-cinematic font-black tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(230,36,41,0.6)] flex items-center gap-2 group-hover:scale-105">
                  <span>⚡ TOUCH TO SPLIT & DEAL</span>
                  <span className="text-base">→</span>
                </div>
                <span className="text-[9px] font-mono tracking-wider text-[#777A80] uppercase">
                  TAP TO ACTIVATE MASS ENTRY POP-UP
                </span>
              </div>

            </div>
          </button>
        </div>
      ) : (
        /* ── 2. OPENED STATE: MASS ENTRY 3D POP-UP & FAN-OUT ARENA ── */
        <div className="relative border-2 border-[#E62429] bg-[#0A0B0E] p-4 sm:p-8 shadow-[0_0_80px_rgba(230,36,41,0.25)] incursion-pulse overflow-hidden">
          
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[#1E2024]">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
              <div>
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#E62429] uppercase font-bold">
                  MASS ENTRY ACTIVE // {dealMode === 'fan' ? '9-HERO TACTICAL FAN' : 'FULL 20-HERO BATTLE ROSTER'}
                </span>
                <p className="text-[10px] font-mono text-[#777A80] hidden xs:block">
                  HOVER ANY CARD TO ELEVATE • CLICK CARD TO OPEN FULL DOSSIER
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={shuffleNewHand}
                className="px-3 py-1.5 border border-[#E62429]/60 hover:border-[#E62429] bg-[#E62429]/20 hover:bg-[#E62429] text-white text-[10px] font-mono tracking-wider uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5"
                title="Shuffle and burst a new hand"
              >
                <RotateCcw className="w-3 h-3" />
                <span>RE-SHUFFLE & SPLIT</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch (e) {}
                  setDealMode(dealMode === 'fan' ? 'all' : 'fan');
                  setDealKey((k) => k + 1);
                }}
                className="px-3 py-1.5 border border-[#2D3036] hover:border-white/40 bg-[#15161C] text-[#D8D9DC] text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Layers className="w-3 h-3" />
                <span>{dealMode === 'fan' ? 'DEAL ALL 20' : '9-CARD FAN'}</span>
              </button>

              <button
                type="button"
                onClick={handlePackBox}
                className="px-3 py-1.5 border border-[#1E2024] hover:border-white/40 bg-black/60 text-[#777A80] hover:text-white text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1"
                title="Pack cards back into the box"
              >
                <X className="w-3 h-3" />
                <span>PACK BOX</span>
              </button>
            </div>
          </div>

          {/* ── 3D CARD ARENA: POP-UP & ARRANGE IN MASS ENTRY ARC ── */}
          {dealMode === 'fan' ? (
            <div className="relative py-12 sm:py-20 min-h-[360px] sm:min-h-[440px] flex items-center justify-center overflow-x-auto overflow-y-visible perspective-1200">
              
              {/* Origin Deck Box Centerpiece (Where cards burst out from) */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-12 rounded border border-[#E62429]/40 bg-black/90 flex items-center justify-center shadow-[0_0_25px_rgba(230,36,41,0.5)] z-0 pointer-events-none">
                <span className="text-[8px] font-mono text-[#E62429] uppercase tracking-widest font-bold">
                  ⚡ VAULT DISPENSER
                </span>
              </div>

              {/* The Fan Container */}
              <div
                key={dealKey}
                className="relative w-full max-w-4xl h-[260px] sm:h-[320px] flex items-center justify-center"
              >
                {displayedCharacters.map((char, i) => {
                  const count = displayedCharacters.length;
                  const center = (count - 1) / 2;
                  const offset = i - center;

                  // Mathematical Arc Spread
                  // tx: Horizontal displacement spread
                  // ty: Vertical curve (creating an authentic card fan arc)
                  // rot: Tilt angle fanning out symmetrically
                  const tx = offset * (window.innerWidth < 640 ? 34 : 68);
                  const ty = Math.abs(offset) * (window.innerWidth < 640 ? 6 : 14);
                  const rot = offset * (window.innerWidth < 640 ? 4 : 7);
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
                      className="absolute w-28 xs:w-32 sm:w-44 aspect-[2/3] cursor-pointer card-pop-fan card-fan-item rounded border border-[#2D3036] bg-black overflow-hidden shadow-2xl"
                      style={{
                        '--tx': `${tx}px`,
                        '--ty': `${ty}px`,
                        '--rot': `${rot}deg`,
                        zIndex: hoveredIndex === i ? 60 : zIndex,
                        animationDelay: `${i * 0.045}s`,
                      }}
                      title={`Click to view ${char.name} full intelligence dossier`}
                    >
                      {/* Character Portrait */}
                      <img
                        src={char.poster}
                        alt={char.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-108"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                      {/* Role Pill */}
                      <span className="absolute top-1.5 left-1.5 text-[6px] sm:text-[7px] font-mono tracking-wider px-1 sm:px-1.5 py-0.5 bg-black/90 text-[#22C55E] border border-[#22C55E]/40 uppercase font-bold truncate max-w-[90%]">
                        {char.roleTag}
                      </span>

                      {/* Card Bottom Meta */}
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 sm:p-2.5 text-left">
                        <p className="text-[7px] sm:text-[9px] font-mono text-[#E62429] font-bold uppercase truncate">
                          {char.actor}
                        </p>
                        <h4 className="text-[10px] sm:text-xs font-cinematic font-bold text-white uppercase truncate leading-tight">
                          {char.name}
                        </h4>
                      </div>

                      {/* Card Shimmer */}
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* ── ALL 20 HEROES BATTLE ROSTER (Matrix Deal) ── */
            <div
              key={dealKey}
              className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 py-4"
            >
              {CHARACTERS_DATA.map((char, i) => (
                <div
                  key={char.id}
                  onClick={() => onSelectCharacter(char)}
                  onMouseEnter={() => {
                    setSpotlightChar(char);
                    try { clockAudio.tick(0); } catch (e) {}
                  }}
                  className="relative aspect-[2/3] rounded border border-[#2D3036] hover:border-[#E62429] bg-black overflow-hidden shadow-lg cursor-pointer group card-pop-fan transition-all duration-300 hover:scale-105"
                  style={{
                    '--tx': '0px',
                    '--ty': '0px',
                    '--rot': '0deg',
                    animationDelay: `${i * 0.03}s`,
                  }}
                >
                  <img
                    src={char.poster}
                    alt={char.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                  
                  <span className="absolute top-1 left-1 text-[6px] font-mono tracking-wider px-1 py-0.5 bg-black/90 text-[#22C55E] border border-[#22C55E]/40 uppercase font-bold">
                    {char.roleTag}
                  </span>

                  <div className="absolute bottom-0 left-0 right-0 p-1.5">
                    <p className="text-[7px] font-mono text-[#E62429] font-bold uppercase truncate">
                      {char.actor}
                    </p>
                    <h5 className="text-[10px] font-cinematic font-bold text-white uppercase truncate">
                      {char.name}
                    </h5>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Spotlight Dossier Preview Bar of Currently Hovered / Selected Card ── */}
          {spotlightChar && (
            <div className="mt-4 pt-4 border-t border-[#1E2024] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111216]/80 p-3 sm:p-4 border border-[#2D3036]">
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={spotlightChar.poster}
                  alt={spotlightChar.name}
                  className="w-10 sm:w-12 aspect-[2/3] object-cover border border-[#E62429] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 text-[9px] font-mono text-[#E62429] uppercase font-bold">
                    <span>{spotlightChar.roleTag}</span>
                    <span className="text-[#44474E]">•</span>
                    <span className="text-[#22C55E]">{spotlightChar.status}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-cinematic font-black text-white uppercase">
                    {spotlightChar.name} — <span className="text-[#D8D9DC] font-normal text-xs">{spotlightChar.actor}</span>
                  </h4>
                  <p className="text-[10px] sm:text-xs font-body text-[#8C9098] line-clamp-1">
                    {spotlightChar.summary}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectCharacter(spotlightChar)}
                className="px-4 py-2 bg-[#E62429] hover:bg-[#F0383D] text-white text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
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
