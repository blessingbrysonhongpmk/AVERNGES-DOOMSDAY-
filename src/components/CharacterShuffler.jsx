import React, { useState, useEffect } from 'react';
import { CHARACTERS_DATA } from '../data/characters.js';
import { clockAudio } from '../utils/audio.js';

export default function CharacterShuffler({ onSelectCharacter }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [rotationDegrees, setRotationDegrees] = useState(0);

  const activeChar = CHARACTERS_DATA[currentIndex];

  const handleShuffle = () => {
    setIsShuffling(true);
    setRotationDegrees((prev) => prev + 360);
    try {
      clockAudio.tick(0);
    } catch (e) {}

    // Random new card that is different from current
    let nextIdx;
    do {
      nextIdx = Math.floor(Math.random() * CHARACTERS_DATA.length);
    } while (nextIdx === currentIndex && CHARACTERS_DATA.length > 1);

    setTimeout(() => {
      setCurrentIndex(nextIdx);
      setIsShuffling(false);
    }, 450);
  };

  const handleNext = () => {
    try {
      clockAudio.tick(0);
    } catch (e) {}
    setCurrentIndex((prev) => (prev + 1) % CHARACTERS_DATA.length);
  };

  const handlePrev = () => {
    try {
      clockAudio.tick(0);
    } catch (e) {}
    setCurrentIndex((prev) => (prev - 1 + CHARACTERS_DATA.length) % CHARACTERS_DATA.length);
  };

  return (
    <div className="mb-10 sm:mb-14">
      {/* ── INTERACTIVE SHUFFLER TRIGGER BOX ── */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            try { clockAudio.tick(0); } catch (e) {}
          }}
          className="w-full relative overflow-hidden group p-4 sm:p-6 border border-[#2D3036] hover:border-[#E62429] bg-[#111216]/90 transition-all duration-500 cursor-pointer text-left incursion-pulse shadow-2xl"
        >
          {/* Subtle background red glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#E62429]/10 via-transparent to-[#22C55E]/5 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            {/* Left Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-black/80 border border-[#E62429]/60 flex items-center justify-center text-xl sm:text-2xl shrink-0 group-hover:scale-110 group-hover:border-[#E62429] transition-transform">
                🔀
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2 py-0.5 border border-[#E62429]/40 bg-[#E62429]/10 text-[9px] font-mono tracking-widest text-[#E62429] uppercase mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E62429] animate-ping shrink-0" />
                  AVENGERS PROTOCOL // CASTING VAULT
                </div>
                <h3 className="text-base sm:text-xl font-cinematic font-black text-white uppercase group-hover:text-white transition-colors">
                  ENTER THE CASTING DECK // 3D CARD SHUFFLER
                </h3>
                <p className="text-xs font-body text-[#777A80] mt-0.5 max-w-xl">
                  Click to open the interactive multiversal deck. Shuffle and deal all 20 officially announced heroes, sovereigns, and villains.
                </p>
              </div>
            </div>

            {/* Right: Stacked Cards Miniature Preview */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative w-24 h-16 sm:w-28 sm:h-20 perspective-1000 hidden xs:block">
                <div className="absolute top-2 left-0 w-12 h-16 rounded border border-white/20 bg-cover bg-center shadow-lg -rotate-12 group-hover:-rotate-16 transition-transform"
                     style={{ backgroundImage: 'url(/characters/doctor-doom.jpg)' }} />
                <div className="absolute top-1 left-5 w-12 h-16 rounded border border-white/30 bg-cover bg-center shadow-lg rotate-2 group-hover:scale-105 transition-transform"
                     style={{ backgroundImage: 'url(/characters/thor.jpg)' }} />
                <div className="absolute top-0 left-10 w-12 h-16 rounded border border-[#E62429] bg-cover bg-center shadow-2xl rotate-12 group-hover:rotate-16 transition-transform"
                     style={{ backgroundImage: 'url(/characters/sam-wilson.jpg)' }} />
              </div>

              <div className="px-3.5 py-2 bg-[#E62429] hover:bg-[#F0383D] text-white text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase transition-colors shrink-0">
                SHUFFLE CAST →
              </div>
            </div>
          </div>
        </button>
      ) : (
        /* ── EXPANDED 3D CARD SHUFFLER DECK THEATER ── */
        <div className="relative border border-[#E62429]/50 bg-[#0C0D11] p-4 sm:p-8 shadow-[0_0_50px_rgba(230,36,41,0.2)] animate-fade-in">
          {/* Top Bar with Close */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1E2024]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E62429] animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-[#E62429] uppercase font-bold">
                MULTIVERSE DOSSIER SHUFFLE // {String(currentIndex + 1).padStart(2, '0')} OF {CHARACTERS_DATA.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-mono text-[#777A80] hover:text-white px-2 py-1 border border-[#1E2024] hover:border-white/20 transition-colors uppercase cursor-pointer"
            >
              ✕ MINIMIZE DECK
            </button>
          </div>

          {/* Centerpiece 3D Card Display */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 py-4">
            
            {/* The 3D Card Stack Container */}
            <div className="relative w-52 sm:w-64 aspect-[2/3] perspective-1200 shrink-0">
              {/* Ghost background cards to simulate physical deck depth */}
              <div
                className="absolute inset-0 rounded border border-[#1E2024] bg-[#111216] opacity-40 translate-x-3 translate-y-3 rotate-6 transition-transform duration-300 pointer-events-none"
              />
              <div
                className="absolute inset-0 rounded border border-[#2D3036] bg-[#15161C] opacity-70 translate-x-1.5 translate-y-1.5 rotate-3 transition-transform duration-300 pointer-events-none"
              />

              {/* Foreground Dealt Active Card */}
              <div
                onClick={() => onSelectCharacter(activeChar)}
                className={`relative w-full h-full rounded border-2 border-[#E62429] bg-black overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.8)] cursor-pointer group transition-all duration-500 transform-style-3d ${
                  isShuffling ? 'scale-90 rotate-y-180 opacity-60' : 'scale-100 rotate-0 opacity-100'
                }`}
                style={{ transform: `rotateY(${rotationDegrees}deg)` }}
                title="Click to view full dossier"
              >
                <img
                  src={activeChar.poster}
                  alt={activeChar.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                {/* Role Tag */}
                <span className="absolute top-2 left-2 text-[8px] font-mono tracking-wider px-2 py-0.5 bg-black/90 text-[#22C55E] border border-[#22C55E]/40 uppercase font-semibold">
                  {activeChar.roleTag}
                </span>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-left">
                  <p className="text-[10px] font-mono text-[#E62429] font-bold uppercase tracking-wider mb-0.5">
                    {activeChar.actor}
                  </p>
                  <h4 className="text-base sm:text-lg font-cinematic font-black text-white uppercase leading-tight">
                    {activeChar.name}
                  </h4>
                  <p className="text-[9px] font-body text-[#A0A4AB] truncate mt-0.5">
                    {activeChar.associatedMovie}
                  </p>
                </div>

                {/* Shimmer sweep effect */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Right: Dealt Character Intelligence Brief */}
            <div className="max-w-md w-full flex flex-col justify-between">
              <div>
                <div className="inline-block px-2.5 py-0.5 border border-[#22C55E]/30 text-[#22C55E] text-[9px] font-mono uppercase font-bold tracking-wider mb-2">
                  {activeChar.status}
                </div>
                <h3 className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase tracking-tight mb-1">
                  {activeChar.name}
                </h3>
                <p className="text-xs font-mono text-[#D8D9DC] mb-3">
                  {activeChar.alias} • <span className="text-white font-bold">{activeChar.actor}</span>
                </p>

                <p className="text-xs sm:text-sm font-body text-[#A0A4AB] leading-relaxed mb-4">
                  {activeChar.summary}
                </p>

                {/* Key Capabilities Pills */}
                <div className="space-y-1.5 mb-6">
                  <p className="text-[9px] font-mono text-[#777A80] uppercase tracking-widest font-bold">
                    COMBAT & MULTIVERSE CAPABILITIES:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeChar.capabilities.slice(0, 2).map((cap, i) => (
                      <span key={i} className="text-[9px] font-mono px-2 py-0.5 bg-[#15161C] border border-[#2D3036] text-[#D8D9DC]">
                        ⚡ {cap}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shuffler Controls */}
              <div className="pt-4 border-t border-[#1E2024] flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-3 py-2 border border-[#2D3036] hover:border-white/40 text-[10px] font-mono text-white tracking-wider uppercase transition-colors cursor-pointer"
                  title="Previous Hero"
                >
                  ← PREV
                </button>

                <button
                  type="button"
                  onClick={handleShuffle}
                  disabled={isShuffling}
                  className="grow px-4 py-2 bg-[#E62429] hover:bg-[#F0383D] text-white text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>🔀</span>
                  <span>{isShuffling ? 'SHUFFLING...' : 'SHUFFLE CAST'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-3 py-2 border border-[#2D3036] hover:border-white/40 text-[10px] font-mono text-white tracking-wider uppercase transition-colors cursor-pointer"
                  title="Next Hero"
                >
                  NEXT →
                </button>

                <button
                  type="button"
                  onClick={() => onSelectCharacter(activeChar)}
                  className="w-full mt-2 px-3 py-1.5 border border-[#E62429]/40 hover:border-[#E62429] bg-[#E62429]/10 text-[#E62429] hover:text-white text-[10px] font-mono font-bold tracking-widest uppercase transition-colors cursor-pointer text-center"
                >
                  VIEW FULL INTELLIGENCE DOSSIER ↗
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
