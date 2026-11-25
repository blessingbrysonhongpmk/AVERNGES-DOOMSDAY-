import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Countdown from './components/Countdown';
import HulkSmashBanner from './components/HulkSmashBanner';
import HulkSmashGame from './components/HulkSmashGame';
import Watchlist from './components/Watchlist';
import CharacterDatabase from './components/CharacterDatabase';
import Intelligence from './components/Intelligence';
import { loadAmbientMode, saveAmbientMode } from './utils/storage';

export default function App() {
  const [ambientMode, setAmbientMode] = useState(() => loadAmbientMode());
  const [isGameOpen, setIsGameOpen] = useState(false);

  useEffect(() => {
    saveAmbientMode(ambientMode);
  }, [ambientMode]);

  const toggleAmbientMode = () => {
    setAmbientMode((prev) => (prev === 'normal' ? 'cinematic' : 'normal'));
  };

  return (
    <div
      className={`relative min-h-screen bg-[#08090B] text-[#F5F5F5] overflow-x-hidden ${ambientMode === 'cinematic' ? 'ambient-cinematic' : ''
        }`}
    >
      {/* Atmospheric restrained film grain */}
      <div className="film-grain" aria-hidden="true" />

      {/* ── CINEMATIC NAVIGATION ── */}
      <Navigation />

      {/* ── SECTIONS ── */}
      <main>
        {/* 1. Hero & Live Broadcast Countdown (PROTECTED) */}
        <Countdown />

        {/* 2. Hulk Smash Mayhem — Premium Mini Arcade Game Entry (Immediately Below Hero) */}
        <HulkSmashBanner onPlay={() => setIsGameOpen(true)} isGameOpen={isGameOpen} />

        {/* 3. Road to Doomsday — Theatrical Watchlist */}
        <Watchlist />

        {/* 4. Confirmed Character Database */}
        <CharacterDatabase />

        {/* 5. Doomsday Intelligence & The Final Countdown (Matching Image 4) */}
        <Intelligence />
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1E2024] py-12 px-5 sm:px-8 bg-[#060608]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <span className="text-[10px] font-cinematic tracking-[0.2em] text-[#777A80] uppercase">
              AVENGERS: DOOMSDAY
            </span>
            <span className="hidden sm:inline text-[#2D3036] text-xs">•</span>
            {/* Ambient mode lighting switch */}
            <button
              type="button"
              onClick={toggleAmbientMode}
              className="text-[10px] font-mono tracking-wider text-[#777A80] hover:text-[#D8D9DC] transition-colors uppercase cursor-pointer"
              title="Toggle cinematic ambient mode"
            >
              ✦ LIGHTING: {ambientMode === 'cinematic' ? 'CINEMATIC' : 'STANDARD'}
            </button>
          </div>

          {/* Developer Credit & Portfolio Link per user specification */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-center">
            <span className="text-[#8C9098]">DEVELOPED BY</span>
            <a
              href="https://blessingbrysonhong.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#22C55E] font-bold border-b border-[#3A3D45] hover:border-[#22C55E] transition-all pb-0.5 inline-flex items-center gap-1"
            >
              <span>BLESSINGBRYSONHONG</span>
              <span className="text-[10px] text-[#22C55E]">↗</span>
            </a>
          </div>

          <p className="text-[10px] font-mono text-[#55585E] leading-relaxed text-center md:text-right max-w-sm">
            Fan-made cinematic countdown experience. All Marvel trademarks and characters are property of Marvel Studios and Disney.
          </p>
        </div>
      </footer>

      {/* ── HULK SMASH MAYHEM FULL INTERACTIVE MINI-GAME EXPERIENCE ── */}
      {isGameOpen && (
        <HulkSmashGame onClose={() => setIsGameOpen(false)} />
      )}
    </div>
  );
}
