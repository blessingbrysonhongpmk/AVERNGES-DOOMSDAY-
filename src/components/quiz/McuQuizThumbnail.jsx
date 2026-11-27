import React, { useEffect, useState } from 'react';
import { Trophy, ChevronRight, Zap } from 'lucide-react';
import { loadQuizProgress, STONE_MILESTONES } from '../../utils/quizStorage.js';
import { quizAudio } from '../../utils/quizAudio.js';
import { InfinityGemSvg } from './StoneVaultAnimation';

const STONE_COLORS = {
  space: '#3B82F6',
  mind: '#EAB308',
  reality: '#EF4444',
  power: '#A855F7',
  time: '#22C55E',
  soul: '#F97316',
};

export default function McuQuizThumbnail({ onOpenQuiz, onOpenVault, isQuizOpen }) {
  const [progress, setProgress] = useState(() => loadQuizProgress());

  useEffect(() => {
    setProgress(loadQuizProgress());
  }, [isQuizOpen]);

  const handleEnterChallenge = () => {
    try { quizAudio.tick(); } catch { }
    onOpenQuiz();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleEnterChallenge}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleEnterChallenge();
        }
      }}
      aria-label="Enter MCU Ultimate Quiz — 10 Questions. One True Fan."
      className="lg:col-span-6 group relative p-[1px] marvel-chamfer bg-gradient-to-b from-white/[0.16] via-white/[0.08] to-white/[0.06] hover:from-[#F87171]/80 hover:via-[#E62429]/45 hover:to-[#E62429]/20 transition-all duration-300 cursor-pointer hover:-translate-y-1 select-none"
    >
      <div className="relative h-full w-full marvel-chamfer bg-[#0B0C0F] overflow-hidden flex flex-col justify-between">
        {/* Precision Marvel Scarlet Top Specular Rule */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#E62429] via-[#F87171]/75 to-transparent opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none z-30" aria-hidden="true" />

        {/* COSMIC MULTIVERSE PORTAL KEY-ART STAGE (Seamless Edge-to-Edge Melt) */}
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#060609]">
          <img
            src="/mcu-quiz-keyart.jpg"
            alt="MCU Ultimate Quiz — Cosmic Multiverse Portal & Infinity Stones"
            loading="lazy"
            className="w-full h-full object-cover object-center brightness-[0.98] contrast-[1.08] group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          />

          {/* Subtle Hover Multiverse Vortex Glow */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 50% 48%, rgba(230,36,41,0.18) 0%, transparent 62%)',
            }}
            aria-hidden="true"
          />

          {/* Seamless Theatrical Ink Vignette Melting Into Obsidian Canvas */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(11,12,15,0.68) 0%, rgba(11,12,15,0.06) 34%, rgba(11,12,15,0.48) 70%, #0B0C0F 100%)',
            }}
            aria-hidden="true"
          />

          {/* Editorial Top Meta Strip (Clean Typography, Zero Pill Clutter) */}
          <div className="absolute top-4 inset-x-5 sm:inset-x-6 flex items-center justify-between gap-3 z-10">
            <div className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-[#E62429] rotate-45 inline-block shrink-0" aria-hidden="true" />
              <span className="text-[10.5px] font-hud font-bold uppercase tracking-[0.22em] text-[#FECACA] drop-shadow">
                1000-Q PROTOCOL &bull; EN &bull; TANGLISH
              </span>
            </div>

            {progress.bestScore > 0 ? (
              <span className="text-[10.5px] font-hud font-bold uppercase tracking-[0.18em] text-[#FACC15] inline-flex items-center gap-1.5 tabular-nums drop-shadow">
                <Trophy className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>BEST {progress.bestScore}/10</span>
              </span>
            ) : (
              <span className="text-[10px] font-hud font-semibold uppercase tracking-[0.2em] text-white/65">
                STARK ARCHIVE // LIVE
              </span>
            )}
          </div>

          {/* Theatrical Title Lockup Seated Inside Seamless Ink Fade */}
          <div className="absolute bottom-3.5 inset-x-5 sm:inset-x-6 z-10">
            <div className="flex items-start gap-3">
              <span className="w-[3px] self-stretch bg-[#E62429] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-hud tracking-[0.26em] text-[#FCA5A5] uppercase block mb-1 font-bold">
                  10 QUESTIONS. ONE TRUE FAN.
                </span>
                <h3 className="text-2xl xs:text-3xl sm:text-[32px] font-cinematic font-black tracking-[0.02em] text-white uppercase leading-[1.02]">
                  MCU ULTIMATE QUIZ
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Obsidian Studio Canvas & Collectible Gauntlet Dock */}
        <div className="px-5 pb-5 pt-2.5 sm:px-6 sm:pb-6 flex flex-col justify-between flex-1 gap-5 bg-[#0B0C0F]">
          <div>
            {/* Fine Architectural Rule */}
            <div className="h-[1px] w-full bg-white/[0.08] mb-3.5 relative overflow-hidden">
              <div className="h-full w-16 bg-[#E62429] group-hover:w-28 transition-all duration-500" />
            </div>

            <p className="text-[13px] font-body text-[#9CA3AF] leading-[1.6] mb-4">
              Enter a secret Avengers intelligence exam spanning 1,000 canonical MCU questions—unlock all 6 Infinity Stones and survive Iron Man&apos;s personal evaluation.
            </p>

            {/* Minimalist Studio Socket Tray */}
            <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-white/[0.07]">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {STONE_MILESTONES.map((m) => {
                  const earned = progress.unlockedStones.includes(m.id);
                  const c = STONE_COLORS[m.id];
                  return (
                    <div
                      key={m.id}
                      title={`${m.id.toUpperCase()} STONE (${m.minScore}/10) — ${earned ? 'UNLOCKED' : 'LOCKED'}`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[2px] border flex items-center justify-center transition-all duration-300 ${
                        earned
                          ? 'border-white/45 bg-[#161821]'
                          : 'border-white/[0.09] bg-[#111318] opacity-40 group-hover:opacity-70'
                      }`}
                      style={{
                        boxShadow: earned ? `0 0 12px ${c}55, inset 0 0 6px ${c}28` : 'none',
                      }}
                    >
                      <InfinityGemSvg color={c} size={17} />
                    </div>
                  );
                })}
              </div>

              <div className="text-right shrink-0">
                <span className="text-[9.5px] font-hud font-semibold text-[#7C8594] uppercase tracking-[0.18em] block">
                  GAUNTLET VAULT
                </span>
                <span className="text-[11.5px] font-hud font-bold text-[#E5E7EB] uppercase tracking-[0.12em] tabular-nums">
                  {progress.unlockedStones.length}/6 STONES
                </span>
              </div>
            </div>
          </div>

          {/* Sculpted Marvel Chamfered Action Dock */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEnterChallenge();
              }}
              className="marvel-btn-cut relative flex-1 h-[46px] px-6 bg-[#E62429] hover:bg-[#D1191E] active:scale-[0.99] text-white font-hud font-bold text-[13px] tracking-[0.2em] uppercase cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-all duration-200 group/btn"
            >
              <Zap className="w-3.5 h-3.5 fill-white text-white shrink-0" />
              <span>ENTER THE CHALLENGE</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenVault) onOpenVault();
              }}
              className="group/sec marvel-btn-cut p-[1px] h-[46px] bg-white/[0.15] hover:bg-[#EAB308]/80 transition-colors duration-200 cursor-pointer shrink-0"
              title="Inspect Stark Nano-Gauntlet Reward Vault"
            >
              <span className="marvel-btn-cut h-full w-full px-5 bg-[#12141B] group-hover/sec:bg-[#191D24] text-[#D1D5DB] group-hover/sec:text-[#FDE047] font-hud font-bold text-[12px] tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2 transition-colors duration-200">
                <Trophy className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>VAULT</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
