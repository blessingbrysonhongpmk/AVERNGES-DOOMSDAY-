import React, { useState, useEffect, lazy, Suspense } from 'react';
import Navigation from './components/Navigation';
import Countdown from './components/Countdown';
import HulkSmashBanner from './components/HulkSmashBanner';
import HulkSmashGame from './components/HulkSmashGame';
import Watchlist from './components/Watchlist';
import CharacterDatabase from './components/CharacterDatabase';
import Intelligence from './components/Intelligence';
import { loadAmbientMode, saveAmbientMode } from './utils/storage';
import { avengersBgm } from './utils/bgm.js';
import { clockAudio } from './utils/audio.js';

const McuQuizExperience = lazy(() => import('./components/quiz/McuQuizExperience'));

export default function App() {
  const [ambientMode, setAmbientMode] = useState(() => loadAmbientMode());
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [quizModalMode, setQuizModalMode] = useState(null); // null | 'intro' | 'vault'

  useEffect(() => {
    saveAmbientMode(ambientMode);
  }, [ambientMode]);

  useEffect(() => {
    const isAnyGameOpen = isGameOpen || quizModalMode !== null;
    avengersBgm.setPausedForGame(isAnyGameOpen);
    clockAudio.setPausedForGame(isAnyGameOpen);
  }, [isGameOpen, quizModalMode]);

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

        {/* 2. Hulk Smash Mayhem + MCU Ultimate Quiz (Immediately Below Hero) */}
        <HulkSmashBanner
          onPlay={() => setIsGameOpen(true)}
          isGameOpen={isGameOpen}
          onOpenQuiz={() => setQuizModalMode('intro')}
          onOpenQuizVault={() => setQuizModalMode('vault')}
          isQuizOpen={quizModalMode !== null}
        />

        {/* 3. Road to Doomsday — Theatrical Watchlist */}
        <Watchlist />

        {/* 4. Confirmed Character Database */}
        <CharacterDatabase />

        {/* 5. Doomsday Intelligence & The Final Countdown (Matching Image 4) */}
        <Intelligence />
      </main>

      {/* ── OFFICIAL STUDIO ARCHITECTURE FOOTER ── */}
      <footer className="border-t border-white/[0.08] bg-[#151515] text-[#9CA3AF]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/[0.08]">
            {/* Left Studio Brand Block */}
            <div className="md:col-span-4 flex items-start gap-4">
              <div className="w-12 h-14 bg-[#E62429] text-white flex items-center justify-center font-cinematic font-black text-3xl shrink-0 marvel-btn-cut select-none">
                A
              </div>
              <div>
                <span className="text-sm font-hud font-extrabold tracking-[0.22em] text-white uppercase block">
                  AVENGERS: DOOMSDAY
                </span>
                <span className="text-[11px] font-mono text-[#9CA3AF] uppercase block mt-0.5">
                  DECEMBER 18, 2026 • IN CINEMAS
                </span>
                <p className="text-xs font-body text-[#8C9098] leading-relaxed mt-2.5 max-w-xs">
                  Unofficial Tamil Fanverse &amp; Countdown experience inspired by Marvel Studios theatrical broadcasts.
                </p>
              </div>
            </div>

            {/* Directory Column 1: Explore */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-hud font-bold tracking-[0.2em] text-white uppercase mb-3">
                THE SAGA
              </h4>
              <ul className="space-y-2 text-xs font-hud tracking-wider uppercase">
                <li><a href="#overview" className="hover:text-white transition-colors">Countdown Overview</a></li>
                <li><a href="#game-mayhem" className="hover:text-white transition-colors">Games &amp; MCU Quiz</a></li>
                <li><a href="#watchlist" className="hover:text-white transition-colors">Road to Doomsday</a></li>
                <li><a href="#characters" className="hover:text-white transition-colors">Cast Database (31)</a></li>
              </ul>
            </div>

            {/* Directory Column 2: Tamil Fanverse */}
            <div className="md:col-span-3">
              <h4 className="text-xs font-hud font-bold tracking-[0.2em] text-white uppercase mb-3">
                TAMIL FANVERSE
              </h4>
              <ul className="space-y-2 text-xs font-hud tracking-wider uppercase">
                <li><a href="#fanverse-alert" className="hover:text-white transition-colors">Doomsday Alert Trailers</a></li>
                <li><a href="#fanverse-dubs" className="hover:text-white transition-colors">Tamil Dub Nostalgia</a></li>
                <li><a href="#fanverse-characters" className="hover:text-white transition-colors">Character Files</a></li>
                <li><a href="#fanverse-hub" className="hover:text-white transition-colors">Timeline • Theory • Polls</a></li>
              </ul>
            </div>

            {/* Directory Column 3: Controls & Build */}
            <div className="md:col-span-2 flex flex-col justify-between gap-4">
              <div>
                <h4 className="text-xs font-hud font-bold tracking-[0.2em] text-white uppercase mb-3">
                  THEATER LIGHTING
                </h4>
                <button
                  type="button"
                  onClick={toggleAmbientMode}
                  className="px-3.5 py-2 border border-white/15 hover:border-[#E62429] bg-black/40 text-white text-[10px] font-mono font-bold tracking-wider uppercase cursor-pointer transition-colors w-full text-left"
                  title="Toggle cinematic ambient lighting mode"
                >
                  {ambientMode === 'cinematic' ? 'CINEMATIC DARK' : 'STANDARD MODE'}
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Legal & Creator Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#777A80]">DEVELOPED BY</span>
              <a
                href="https://blessingbrysonhong.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#E62429] font-bold border-b border-white/25 hover:border-[#E62429] transition-colors pb-0.5 inline-flex items-center gap-1"
              >
                <span>BLESSINGBRYSONHONG</span>
                <span className="text-[10px] text-[#E62429]">↗</span>
              </a>
            </div>

            <p className="text-[10.5px] font-body text-[#777A80] text-center sm:text-right">
              &copy; 2026 Fan Project • All Marvel trademarks, films, and characters are property of Marvel Studios &amp; Disney.
            </p>
          </div>
        </div>
      </footer>

      {/* ── HULK SMASH MAYHEM FULL INTERACTIVE MINI-GAME EXPERIENCE ── */}
      {isGameOpen && (
        <HulkSmashGame onClose={() => setIsGameOpen(false)} />
      )}

      {/* ── MCU ULTIMATE QUIZ EXPERIENCE (ISOLATED LAZY MODULE) ── */}
      {quizModalMode && (
        <Suspense fallback={<div className="fixed inset-0 z-50 bg-[#06070A]" />}>
          <McuQuizExperience
            initialView={quizModalMode}
            onClose={() => setQuizModalMode(null)}
          />
        </Suspense>
      )}
    </div>
  );
}
