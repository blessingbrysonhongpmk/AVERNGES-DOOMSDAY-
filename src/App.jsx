import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Countdown from './components/Countdown';
import CharacterDatabase from './components/CharacterDatabase';
import Watchlist from './components/Watchlist';
import TrailerArchive from './components/TrailerArchive';
import FinalCountdown from './components/FinalCountdown';
import { loadAmbientMode, saveAmbientMode } from './utils/storage';

export default function App() {
  const [ambientMode, setAmbientMode] = useState(() => loadAmbientMode());

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
        {/* 1. Hero & Live Broadcast Countdown */}
        <Countdown />

        {/* 2. Confirmed Character Database */}
        <CharacterDatabase />

        {/* 4. Road to Doomsday — Theatrical Watchlist */}
        <Watchlist />

        {/* 5. Official Trailer & Footage Archive */}
        <TrailerArchive />

        {/* 6. Closing Final Countdown Monolith */}
        <FinalCountdown />
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1E2024] py-12 px-5 sm:px-8 bg-[#060608]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-cinematic tracking-[0.2em] text-[#777A80] uppercase">
              AVENGERS: DOOMSDAY
            </span>
            <span className="text-[#2D3036] text-xs">•</span>
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
          <p className="text-[10px] font-mono text-[#55585E] leading-relaxed text-center sm:text-right max-w-md">
            Fan-made cinematic countdown experience. All Marvel trademarks and characters are property of Marvel Studios and Disney.
          </p>
        </div>
      </footer>
    </div>
  );
}
