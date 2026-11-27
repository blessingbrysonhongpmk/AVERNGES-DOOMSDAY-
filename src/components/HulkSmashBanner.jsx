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
            className="lg:col-span-6 group relative p-[1px] marvel-chamfer bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-white/[0.06] hover:from-[#4ADE80]/80 hover:via-[#22C55E]/40 hover:to-[#22C55E]/20 transition-all duration-300 cursor-pointer hover:-translate-y-1 select-none"
          >
            <div className="relative h-full w-full marvel-chamfer bg-[#0B0C0F] overflow-hidden flex flex-col justify-between">
              {/* Precision Top Specular Accent Rule */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#16A34A] via-[#4ADE80]/75 to-transparent opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none z-30" aria-hidden="true" />

              {/* MASSIVE CINEMATIC HULK + DOCTOR DOOM KEY-ART STAGE (Seamless Edge-to-Edge Melt) */}
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#06080A]">
                <img
                  src="/hulk-doomsday-keyart.jpg"
                  alt="Hulk and Doctor Doom — Avengers Doomsday Simulation Key Art"
                  loading="lazy"
                  className="w-full h-full object-cover object-top brightness-[0.98] contrast-[1.08] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                />

                {/* Subtle Hover Gamma Energy Wash along Doom/Hulk Rift */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 46% 38%, rgba(34,197,94,0.18) 0%, transparent 56%)',
                  }}
                  aria-hidden="true"
                />

                {/* Seamless Theatrical Ink Vignette Melting Into Obsidian Canvas */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(11,12,15,0.68) 0%, rgba(11,12,15,0.06) 34%, rgba(11,12,15,0.46) 70%, #0B0C0F 100%)',
                  }}
                  aria-hidden="true"
                />

                {/* Editorial Top Meta Strip (Clean Typography, Zero Pill Clutter) */}
                <div className="absolute top-4 inset-x-5 sm:inset-x-6 flex items-center justify-between gap-3 z-10">
                  <div className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#22C55E] rotate-45 inline-block shrink-0" aria-hidden="true" />
                    <span className="text-[10.5px] font-hud font-bold uppercase tracking-[0.22em] text-[#D1FAE5] drop-shadow">
                      DOOMSDAY ARENA &bull; 30S BLITZ
                    </span>
                  </div>

                  {highScore > 0 ? (
                    <span className="text-[10.5px] font-hud font-bold uppercase tracking-[0.18em] text-[#FACC15] inline-flex items-center gap-1.5 tabular-nums drop-shadow">
                      <Trophy className="w-3.5 h-3.5 text-[#EAB308]" />
                      <span>RECORD {highScore.toLocaleString()}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-hud font-semibold uppercase tracking-[0.2em] text-white/65">
                      SECTOR 616 // LIVE
                    </span>
                  )}
                </div>

                {/* Theatrical Title Lockup Seated Inside Seamless Ink Fade */}
                <div className="absolute bottom-3.5 inset-x-5 sm:inset-x-6 z-10">
                  <div className="flex items-start gap-3">
                    <span className="w-[3px] self-stretch bg-[#16A34A] shrink-0 mt-0.5" aria-hidden="true" />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-hud tracking-[0.26em] text-[#86EFAC] uppercase block mb-1 font-bold">
                        NEURAL AI VOICES &bull; {heroCount} HEROES
                      </span>
                      <h3 className="text-2xl xs:text-3xl sm:text-[32px] font-cinematic font-black tracking-[0.02em] text-white uppercase leading-[1.02]">
                        HULK SMASH MAYHEM
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Obsidian Studio Canvas & Tactile CTA Dock */}
              <div className="px-5 pb-5 pt-2.5 sm:px-6 sm:pb-6 flex flex-col justify-between flex-1 gap-5 bg-[#0B0C0F]">
                <div>
                  {/* Fine Architectural Rule */}
                  <div className="h-[1px] w-full bg-white/[0.08] mb-3.5 relative overflow-hidden">
                    <div className="h-full w-16 bg-[#22C55E] group-hover:w-28 transition-all duration-500" />
                  </div>

                  <p className="text-[13px] font-body text-[#9CA3AF] leading-[1.6] mb-4">
                    Unleash Hulk&apos;s seismic smash against Doctor Doom&apos;s forces, Thanos echoes, and Void anomalies—with {heroCount} playable Marvel Heroes &amp; English MCU AI voice lines.
                  </p>

                  {/* Collector Hero Roster Preview Strip */}
                  <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-white/[0.07]">
                    <div className="flex items-center gap-1.5">
                      {FEATURED_GAME_CAST.slice(0, 6).map((char) => (
                        <div
                          key={char.id}
                          title={char.name}
                          className="relative w-7 h-9 sm:w-8 sm:h-10 overflow-hidden border border-white/[0.12] group-hover:border-[#22C55E]/55 bg-[#111318] rounded-[2px] transition-all duration-300 hover:-translate-y-0.5"
                        >
                          <img
                            src={char.poster}
                            alt={char.name}
                            loading="lazy"
                            className="w-full h-full object-cover object-[50%_18%]"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
                        </div>
                      ))}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[9.5px] font-hud font-semibold text-[#7C8594] uppercase tracking-[0.18em] block">
                        ACTIVE UNIT
                      </span>
                      <span className="text-[11.5px] font-hud font-bold text-[#E5E7EB] uppercase tracking-[0.12em] inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#22C55E] inline-block" />
                        <span>{selectedAvatar.name}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sculpted Marvel Chamfered Action Dock */}
                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunch();
                    }}
                    className="marvel-btn-cut relative flex-1 h-[46px] px-6 bg-[#15803D] hover:bg-[#16A34A] active:scale-[0.99] text-white font-hud font-bold text-[13px] tracking-[0.2em] uppercase cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-all duration-200 group/btn"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>DEPLOYING ARENA...</span>
                      </span>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white text-white shrink-0" />
                        <span>PLAY HULK SMASH</span>
                        <ChevronRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunch();
                    }}
                    className="group/sec marvel-btn-cut p-[1px] h-[46px] bg-white/[0.15] hover:bg-[#22C55E]/75 transition-colors duration-200 cursor-pointer shrink-0"
                    title={`Play with ${heroCount} Confirmed Marvel Heroes & AI Voice Lines`}
                  >
                    <span className="marvel-btn-cut h-full w-full px-5 bg-[#12141B] group-hover/sec:bg-[#181C24] text-[#D1D5DB] group-hover/sec:text-white font-hud font-bold text-[12px] tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2 transition-colors duration-200">
                      <Users className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span>{heroCount} HEROES</span>
                    </span>
                  </button>
                </div>
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
