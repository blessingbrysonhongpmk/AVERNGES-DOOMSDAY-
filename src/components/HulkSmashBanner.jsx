import React, { useState, useEffect } from 'react';
import { Play, Trophy, ChevronRight, Users, Zap } from 'lucide-react';
import { clockAudio } from '../utils/audio.js';
import { FEATURED_GAME_CAST, ALL_AVATARS, HULK_PROFILE } from '../data/hulkGameData.js';
import { hulkAudio } from '../utils/hulkAudio.js';

/**
 * Split 2-Column Interactive Sector directly below the protected Hero Countdown:
 * Left Card: Hulk Smash Mayhem with massive Hulk + Doctor Doom key-art thumbnail and Doomsday-Green Pro CTAs.
 * Right Card: Clean intentionally blank reserved slot for upcoming second module.
 */
export default function HulkSmashBanner({ onPlay, isGameOpen }) {
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
      clockAudio.tick(0);
      hulkAudio.init();
      hulkAudio.preloadAll(undefined, [selectedAvatar?.id]);
    } catch { }
    setTimeout(() => {
      onPlay();
      setIsLoading(false);
    }, 220);
  };

  return (
    <section
      id="game-mayhem"
      aria-label="Hulk Smash Mayhem & Secondary Slot"
      className="relative z-20 border-t border-b border-[#1A1D24] bg-[#08090B] overflow-hidden"
    >
      <div className="container-fluid container-xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">

          {/* ═════════════════════════════════════════════════════════════════
              LEFT DIV (6 COLS): HULK SMASH MAYHEM — HULK + DOOMSDAY COMBINATION
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
            className="lg:col-span-6 group relative border border-[#1E3328] hover:border-[#22C55E]/75 bg-[#090C0B] rounded-[3px] shadow-[0_24px_60px_rgba(0,0,0,0.92)] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
          >
            {/* Restraint Corner Registration Marks */}
            <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-[#34D399]/60 pointer-events-none z-20" aria-hidden="true" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-[#34D399]/60 pointer-events-none z-20" aria-hidden="true" />

            {/* MASSIVE CREATIVE HULK + DOOMSDAY KEY-ART THUMBNAIL STAGE */}
            <div className="relative w-full aspect-[16/9] overflow-hidden border-b border-[#1A2D23] bg-[#050706]">
              <img
                src="/hulk-doomsday-keyart.jpg"
                alt="Hulk and Doctor Doom — Avengers Doomsday Simulation Key Art"
                loading="lazy"
                className="w-full h-full object-cover object-top brightness-105 contrast-[1.06] group-hover:scale-[1.03] transition-transform duration-700"
              />
              {/* Bottom-edge contrast scrim only so both Hulk & Doom stay sharp */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(6,9,8,0.18) 0%, rgba(6,9,8,0.02) 48%, rgba(9,12,11,0.95) 100%)',
                }}
              />

              {/* Top Overlay Telemetry Chips */}
              <div className="absolute top-3 inset-x-3.5 flex items-center justify-between gap-2 z-10">
                <span className="px-2.5 py-1 bg-[#080C0A]/90 border border-[#22C55E]/55 text-[#34D399] text-[9.5px] font-mono font-bold uppercase tracking-[0.18em] rounded-[2px] inline-flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#22C55E]" />
                  <span>HULK // DOOMSDAY ARENA</span>
                </span>

                {highScore > 0 ? (
                  <span className="px-2.5 py-1 bg-[#0A0C0B]/90 border border-[#D4AF37]/60 text-[#D4AF37] text-[9.5px] font-mono font-bold uppercase tracking-[0.14em] rounded-[2px] inline-flex items-center gap-1.5 tabular-nums">
                    <Trophy className="w-3 h-3" />
                    <span>BEST {highScore.toLocaleString()}</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-[#0A0C0B]/90 border border-[#2B333E] text-[#D1D5DB] text-[9.5px] font-mono font-semibold uppercase tracking-[0.14em] rounded-[2px]">
                    30S SIMULATION
                  </span>
                )}
              </div>

              {/* Bottom Title Anchored Cleanly Over Vignette */}
              <div className="absolute bottom-3 inset-x-4 sm:inset-x-5 z-10 flex items-end justify-between gap-3">
                <div>
                  <span className="text-[9.5px] font-mono tracking-[0.22em] text-[#4ADE80] uppercase block mb-0.5">
                    SECTOR 616 • NEURAL AI VOICES + SFX
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-cinematic font-black tracking-tight text-metallic uppercase leading-none">
                    HULK SMASH MAYHEM
                  </h3>
                </div>
              </div>
            </div>

            {/* Card Content + Pro Green & Doomsday Action Controls */}
            <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4 bg-gradient-to-b from-[#0A0E0C] to-[#08090B]">
              <div>
                <p className="text-xs sm:text-sm font-body text-[#A1A8B0] leading-relaxed mb-3.5">
                  Unleash Hulk&apos;s seismic smash against Doctor Doom&apos;s forces, Thanos echoes, and Void anomalies—with 51 playable Marvel Heroes &amp; English MCU AI voice lines.
                </p>

                {/* Cast Preview Row */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#18221D]">
                  <div className="flex items-center gap-1.5">
                    {FEATURED_GAME_CAST.slice(0, 6).map((char) => (
                      <div
                        key={char.id}
                        title={char.name}
                        className="w-6 h-8 overflow-hidden border border-[#24362C] bg-[#08090B] rounded-[2px]"
                      >
                        <img
                          src={char.poster}
                          alt={char.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-[50%_18%] brightness-105"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="text-[9.5px] font-mono text-[#8A949E] uppercase tracking-[0.14em] shrink-0">
                    {ALL_AVATARS.length} AVATARS • ACTIVE: <strong className="text-[#E5E7EB]">{selectedAvatar.name}</strong>
                  </span>
                </div>
              </div>

              {/* PRO BUTTONS: GREEN & DOOMSDAY COMBINATION */}
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunch();
                  }}
                  style={{
                    background:
                      'linear-gradient(135deg, #16A34A 0%, #0E6B38 55%, #093520 100%)',
                  }}
                  className="relative flex-1 h-12 sm:h-13 px-6 border border-[#22C55E] hover:border-[#4ADE80] hover:brightness-110 text-white font-display font-bold text-xs sm:text-sm tracking-[0.16em] uppercase transition-all duration-200 rounded-[3px] cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-[0_10px_28px_rgba(22,163,74,0.28)] overflow-hidden"
                >
                  <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#86EFAC]" aria-hidden="true" />
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>DEPLOYING ARENA...</span>
                    </span>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white text-white" />
                      <span>PLAY HULK SMASH</span>
                      <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunch();
                  }}
                  className="h-12 sm:h-13 px-4 bg-[#0D1210] hover:bg-[#131E18] border border-[#273D31] hover:border-[#34D399]/75 text-[#D1FAE5] hover:text-white font-mono font-bold text-[10.5px] tracking-[0.14em] uppercase transition-colors rounded-[3px] cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
                  title="Play with any of 51 Marvel Heroes & Neural English AI Voices"
                >
                  <Users className="w-4 h-4 text-[#22C55E]" />
                  <span>51 HEROES</span>
                </button>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              RIGHT DIV (6 COLS): CLEAN INTENTIONALLY BLANK RESERVED SLOT
             ═════════════════════════════════════════════════════════════════ */}
          <div
            aria-label="Reserved Empty Module Slot"
            className="lg:col-span-6 relative min-h-[320px] sm:min-h-[420px] rounded-[3px] border border-dashed border-[#1E242D] bg-[#07080B]/60 flex flex-col items-center justify-center p-8 text-center"
          >
            {/* Restraint Corner Brackets */}
            <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#232A35] pointer-events-none" aria-hidden="true" />
            <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#232A35] pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#232A35] pointer-events-none" aria-hidden="true" />
            <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#232A35] pointer-events-none" aria-hidden="true" />

            <div className="w-8 h-8 border border-[#1E242D] flex items-center justify-center mb-3 opacity-50" aria-hidden="true">
              <div className="w-2 h-2 bg-[#232A35]" />
            </div>

            <span className="text-[10px] font-mono tracking-[0.26em] text-[#454D59] uppercase">
              SLOT 02 // OPEN SPACE
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
