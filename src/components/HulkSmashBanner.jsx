import React, { useState, useEffect } from 'react';
import { Play, Trophy, ChevronRight, Users, Zap } from 'lucide-react';
import { FEATURED_GAME_CAST, ALL_AVATARS, HULK_PROFILE } from '../data/hulkGameData.js';
import { hulkAudio } from '../utils/hulkAudio.js';
import McuQuizThumbnail from './quiz/McuQuizThumbnail';

/**
 * Split 2-Column Interactive Sector directly below the protected Hero Countdown:
 * Left Card: Hulk Smash Mayhem — Mass AAA Gamma/Doomsday Gateway.
 * Right Card: MCU Ultimate Quiz — Mass Cosmic Multiverse Gateway.
 */
export default function HulkSmashBanner({ onPlay, isGameOpen, onOpenQuiz, onOpenQuizVault, isQuizOpen }) {
  const [highScore, setHighScore] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(HULK_PROFILE);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hulk_smash_high_score_v1');
      if (saved) setHighScore(parseInt(saved, 10) || 0);
      const savedAvatarId = localStorage.getItem('hulk_smash_avatar_v1');
      if (savedAvatarId) {
        const match = ALL_AVATARS.find((a) => a.id === savedAvatarId);
        if (match) setSelectedAvatar(match);
      }
    } catch { }
  }, [isGameOpen]);

  const handleLaunch = () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      hulkAudio.init();
      hulkAudio.preloadAll(undefined, [selectedAvatar?.id]);
    } catch { }
    setTimeout(() => {
      onPlay();
      setIsLoading(false);
    }, 220);
  };

  const heroCount = ALL_AVATARS.length;

  return (
    <section
      id="game-mayhem"
      aria-label="Hulk Smash Mayhem & MCU Ultimate Quiz Arenas"
      className="relative z-20 border-t border-b border-[#1A221E] bg-[#070908] overflow-hidden"
    >
      {/* Subtle Dual-Arena Ambient Horizon Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background:
            'radial-gradient(circle at 22% 45%, rgba(34,197,94,0.18) 0%, transparent 52%), radial-gradient(circle at 78% 45%, rgba(230,36,41,0.16) 0%, transparent 52%)',
        }}
        aria-hidden="true"
      />

      <div className="container-fluid container-xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch">

          {/* ═════════════════════════════════════════════════════════════════
              LEFT DIV (6 COLS): HULK SMASH MAYHEM — MASS AAA ENTRY CARD
             ═════════════════════════════════════════════════════════════════ */}
          <div
            onClick={handleLaunch}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLaunch();
              }
            }}
            aria-label="Launch Hulk Smash Mayhem"
            className="lg:col-span-6 group relative border border-[#203D2D] hover:border-[#22C55E] bg-gradient-to-b from-[#0C1410] via-[#080D0A] to-[#050706] rounded-[8px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_26px_70px_rgba(0,0,0,0.95)] hover:shadow-[inset_0_1px_0_rgba(134,239,172,0.22),0_28px_85px_rgba(0,0,0,0.98),0_0_52px_rgba(34,197,94,0.26)] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-1 select-none"
          >
            {/* Top Glowing Gamma Laser Conduit */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#22C55E] to-transparent opacity-85 group-hover:opacity-100 transition-opacity pointer-events-none z-30" />

            {/* Tactical Corner HUD Brackets */}
            <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#34D399]/80 group-hover:border-[#86EFAC] transition-colors pointer-events-none z-20" aria-hidden="true" />
            <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#34D399]/80 group-hover:border-[#86EFAC] transition-colors pointer-events-none z-20" aria-hidden="true" />
            <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#34D399]/35 group-hover:border-[#4ADE80]/80 transition-colors pointer-events-none z-20" aria-hidden="true" />
            <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#34D399]/35 group-hover:border-[#4ADE80]/80 transition-colors pointer-events-none z-20" aria-hidden="true" />

            {/* MASSIVE CINEMATIC HULK + DOCTOR DOOM KEY-ART STAGE */}
            <div className="relative w-full aspect-[16/9] overflow-hidden border-b border-[#1A2F23] bg-[#050706]">
              <img
                src="/hulk-doomsday-keyart.jpg"
                alt="Hulk and Doctor Doom — Avengers Doomsday Simulation Key Art"
                loading="lazy"
                className="w-full h-full object-cover object-top brightness-105 contrast-[1.1] group-hover:scale-[1.05] transition-transform duration-700"
              />

              {/* Central Vertical Gamma Rift Pulse along Lightning Crack */}
              <div
                className="hidden sm:block absolute top-0 bottom-0 left-[46%] w-20 -translate-x-1/2 pointer-events-none opacity-45 group-hover:opacity-90 transition-opacity duration-500 mix-blend-screen blur-xl"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(74,222,128,0.65) 0%, rgba(34,197,94,0.35) 55%, transparent 100%)',
                }}
                aria-hidden="true"
              />

              {/* Subtle Hover Gamma Energy Wash */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle at 32% 40%, rgba(34,197,94,0.22) 0%, transparent 58%)',
                }}
                aria-hidden="true"
              />

              {/* Floating Ambient Gamma Embers */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <span className="absolute bottom-14 left-[22%] w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_10px_#4ADE80] animate-gamma-spark" />
                <span className="absolute bottom-20 left-[49%] w-1 h-1 rounded-full bg-[#86EFAC] shadow-[0_0_8px_#86EFAC] animate-gamma-spark" style={{ animationDelay: '0.9s' }} />
                <span className="absolute bottom-12 right-[24%] w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_10px_#22C55E] animate-gamma-spark" style={{ animationDelay: '1.7s' }} />
              </div>

              {/* High-Contrast Theatrical Bottom Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(5,9,7,0.35) 0%, rgba(5,9,7,0.04) 44%, rgba(6,11,8,0.98) 100%)',
                }}
                aria-hidden="true"
              />

              {/* Top Overlay Telemetry Chips */}
              <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10">
                <span className="px-3 py-1 bg-[#050907]/90 backdrop-blur-md border border-[#22C55E]/60 text-[#4ADE80] text-[9.5px] font-mono font-bold uppercase tracking-[0.18em] rounded-full inline-flex items-center gap-1.5 shadow-[0_0_16px_rgba(34,197,94,0.28)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping" />
                  <Zap className="w-3 h-3 text-[#4ADE80]" />
                  <span>HULK // DOOMSDAY ARENA</span>
                </span>

                {highScore > 0 ? (
                  <span className="px-3 py-1 bg-[#0A0905]/90 backdrop-blur-md border border-[#EAB308]/65 text-[#FDE047] text-[9.5px] font-mono font-bold uppercase tracking-[0.15em] rounded-full inline-flex items-center gap-1.5 tabular-nums shadow-[0_0_16px_rgba(234,179,8,0.25)]">
                    <Trophy className="w-3.5 h-3.5 text-[#FACC15]" />
                    <span>RECORD {highScore.toLocaleString()}</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-[#080C0A]/90 backdrop-blur-md border border-[#273B30] text-[#D1FAE5] text-[9.5px] font-mono font-semibold uppercase tracking-[0.15em] rounded-full">
                    30S COMBAT BLITZ
                  </span>
                )}
              </div>

              {/* Theatrical Title & Accent Underline */}
              <div className="absolute bottom-3.5 inset-x-4 sm:inset-x-6 z-10">
                <span className="text-[9.5px] font-mono tracking-[0.24em] text-[#4ADE80] uppercase block mb-1 font-bold drop-shadow">
                  SECTOR 616 • NEURAL AI VOICES + SFX
                </span>
                <h3 className="text-2xl xs:text-3xl sm:text-[34px] font-cinematic font-black tracking-tight text-metallic uppercase leading-none drop-shadow-[0_4px_16px_rgba(34,197,94,0.3)]">
                  HULK SMASH MAYHEM
                </h3>
                <div className="w-24 h-[2px] bg-gradient-to-r from-[#22C55E] via-[#86EFAC] to-transparent mt-2 opacity-80 group-hover:w-36 transition-all duration-500" />
              </div>
            </div>

            {/* Tactical Body & AAA Action Controls */}
            <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-[18px] bg-gradient-to-b from-[#0A110D] to-[#060807]">
              <div>
                <p className="text-xs sm:text-sm font-body text-[#A1A8B3] leading-relaxed mb-4">
                  Unleash Hulk&apos;s seismic smash against Doctor Doom&apos;s forces, Thanos echoes, and Void anomalies—with {heroCount} playable Marvel Heroes &amp; English MCU AI voice lines.
                </p>

                {/* Hero Collector Portrait Row */}
                <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-[#192820]">
                  <div className="flex items-center gap-1.5">
                    {FEATURED_GAME_CAST.slice(0, 6).map((char) => (
                      <div
                        key={char.id}
                        title={char.name}
                        className="relative w-7 h-9 sm:w-8 sm:h-10 overflow-hidden border border-[#294334] group-hover:border-[#22C55E]/70 bg-[#070A08] rounded-[3px] shadow-md transition-transform duration-300 hover:scale-110"
                      >
                        <img
                          src={char.poster}
                          alt={char.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-[50%_18%] brightness-105 contrast-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
                      </div>
                    ))}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[9.5px] font-mono text-[#8A9792] uppercase tracking-[0.12em] block">
                      {heroCount} AVATARS READY
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#86EFAC] uppercase tracking-[0.14em] inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <strong className="text-white">{selectedAvatar.name}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Mass AAA Action Dock */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunch();
                  }}
                  style={{
                    background:
                      'linear-gradient(135deg, #16A34A 0%, #15803D 55%, #0D4B28 100%)',
                  }}
                  className="mass-cta-btn flex-1 h-[52px] px-6 border border-[#4ADE80]/80 hover:border-white hover:brightness-110 text-white font-display font-black text-xs sm:text-sm tracking-[0.2em] uppercase rounded-[4px] cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(22,163,74,0.38)] hover:shadow-[0_12px_36px_rgba(34,197,94,0.52)] hover:scale-[1.015] transition-all"
                >
                  <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#BBF7D0] shadow-[0_0_12px_#4ADE80]" aria-hidden="true" />
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>DEPLOYING ARENA...</span>
                    </span>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white text-white" />
                      <span>PLAY HULK SMASH</span>
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunch();
                  }}
                  className="h-[52px] px-5 bg-[#0C1410] hover:bg-[#13221A] border border-[#243B2E] hover:border-[#4ADE80] text-[#D1FAE5] hover:text-white font-mono font-bold text-xs tracking-[0.14em] uppercase transition-all rounded-[4px] cursor-pointer inline-flex items-center justify-center gap-2 shrink-0 shadow-md"
                  title={`Play with ${heroCount} Confirmed Marvel Heroes & AI Voice Lines`}
                >
                  <Users className="w-4 h-4 text-[#22C55E]" />
                  <span>{heroCount} HEROES</span>
                </button>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              RIGHT DIV (6 COLS): MCU ULTIMATE QUIZ ENTRY THUMBNAIL
             ═════════════════════════════════════════════════════════════════ */}
          <McuQuizThumbnail
            onOpenQuiz={onOpenQuiz}
            onOpenVault={onOpenQuizVault}
            isQuizOpen={isQuizOpen}
          />

        </div>
      </div>
    </section>
  );
}
