import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, ChevronRight, Zap } from 'lucide-react';
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
      className="lg:col-span-6 group relative border border-[#3B1E2A] hover:border-[#EF4444] bg-gradient-to-b from-[#130C14] via-[#0B080D] to-[#060508] rounded-[8px] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_26px_70px_rgba(0,0,0,0.95)] hover:shadow-[inset_0_1px_0_rgba(252,165,165,0.2),0_28px_85px_rgba(0,0,0,0.98),0_0_52px_rgba(230,36,41,0.26),0_0_32px_rgba(34,197,94,0.18)] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between hover:-translate-y-1 select-none"
    >
      {/* Top Dual-Spectrum Multiverse Conduit */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#EF4444] to-[#22C55E] opacity-85 group-hover:opacity-100 transition-opacity pointer-events-none z-30" />

      {/* Matching Asymmetric Crimson + Emerald Corner Brackets */}
      <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#EF4444]/85 group-hover:border-[#FCA5A5] transition-colors pointer-events-none z-20" aria-hidden="true" />
      <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#22C55E]/85 group-hover:border-[#86EFAC] transition-colors pointer-events-none z-20" aria-hidden="true" />
      <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#EF4444]/35 group-hover:border-[#EF4444]/80 transition-colors pointer-events-none z-20" aria-hidden="true" />
      <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#22C55E]/35 group-hover:border-[#22C55E]/80 transition-colors pointer-events-none z-20" aria-hidden="true" />

      {/* COSMIC MULTIVERSE PORTAL KEY-ART STAGE */}
      <div className="relative w-full aspect-[16/9] overflow-hidden border-b border-[#291A25] bg-[#050608]">
        <img
          src="/mcu-quiz-keyart.jpg"
          alt="MCU Ultimate Quiz — Cosmic Multiverse Portal & Infinity Stones"
          loading="lazy"
          className="w-full h-full object-cover object-center brightness-105 contrast-[1.12] group-hover:scale-[1.05] transition-transform duration-700"
        />

        {/* Animated Multiverse Portal Reticle Rings Aligned with Center Vortex */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-dashed border-[#FCA5A5]/25 group-hover:border-[#FCA5A5]/55 animate-cosmic-orbit transition-colors duration-500" />
          <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#4ADE80]/20 group-hover:border-[#4ADE80]/55 animate-cosmic-orbit-reverse transition-colors duration-500" />
        </div>

        {/* Dynamic Cosmic Energy Flare on Hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 48%, rgba(239,68,68,0.22) 0%, rgba(34,197,94,0.16) 40%, transparent 72%)',
          }}
          aria-hidden="true"
        />

        {/* High-Contrast Theatrical Bottom Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgba(8,6,11,0.36) 0%, rgba(8,6,11,0.04) 44%, rgba(10,7,12,0.98) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Top Telemetry Chips */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between gap-2 z-10">
          <span className="px-3 py-1 bg-[#09060D]/90 backdrop-blur-md border border-[#EF4444]/60 text-[#FCA5A5] text-[9.5px] font-mono font-bold uppercase tracking-[0.18em] rounded-full inline-flex items-center gap-1.5 shadow-[0_0_16px_rgba(239,68,68,0.28)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] animate-ping" />
            <Sparkles className="w-3 h-3 text-[#4ADE80]" />
            <span>AVENGERS PROTOCOL // 1000 Q BANK</span>
          </span>

          {progress.bestScore > 0 ? (
            <span className="px-3 py-1 bg-[#0A0905]/90 backdrop-blur-md border border-[#EAB308]/65 text-[#FDE047] text-[9.5px] font-mono font-bold uppercase tracking-[0.15em] rounded-full inline-flex items-center gap-1.5 tabular-nums shadow-[0_0_16px_rgba(234,179,8,0.25)]">
              <Trophy className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>BEST {progress.bestScore}/10</span>
            </span>
          ) : (
            <span className="px-3 py-1 bg-[#070B09]/90 backdrop-blur-md border border-[#22C55E]/55 text-[#86EFAC] text-[9.5px] font-mono font-semibold uppercase tracking-[0.15em] rounded-full">
              EN • TANGLISH READY
            </span>
          )}
        </div>

        {/* Theatrical Title & Accent Underline */}
        <div className="absolute bottom-3.5 inset-x-4 sm:inset-x-6 z-10">
          <span className="text-[9.5px] font-mono tracking-[0.24em] text-[#FCA5A5] uppercase block mb-1 font-bold drop-shadow">
            10 QUESTIONS. ONE TRUE FAN.
          </span>
          <h3 className="text-2xl xs:text-3xl sm:text-[34px] font-cinematic font-black tracking-tight text-metallic uppercase leading-none drop-shadow-[0_4px_16px_rgba(230,36,41,0.32)]">
            MCU ULTIMATE QUIZ
          </h3>
          <div className="w-24 h-[2px] bg-gradient-to-r from-[#EF4444] via-[#EAB308] to-[#22C55E] mt-2 opacity-85 group-hover:w-36 transition-all duration-500" />
        </div>
      </div>

      {/* Collectible Gauntlet Dock Body + Mass CTAs */}
      <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-[18px] bg-gradient-to-b from-[#110B13] to-[#060508]">
        <div>
          <p className="text-xs sm:text-sm font-body text-[#A1A8B3] leading-relaxed mb-4">
            Enter a secret Avengers intelligence exam spanning 1,000 canonical MCU questions—unlock all 6 Infinity Stones and survive Iron Man&apos;s personal evaluation.
          </p>

          {/* 6 Faceted Infinity Stone Sockets */}
          <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-[#251A24]">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {STONE_MILESTONES.map((m) => {
                const earned = progress.unlockedStones.includes(m.id);
                const c = STONE_COLORS[m.id];
                return (
                  <div
                    key={m.id}
                    title={`${m.id.toUpperCase()} STONE (${m.minScore}/10) — ${earned ? 'UNLOCKED' : 'LOCKED'}`}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-[4px] border flex items-center justify-center transition-all duration-300 ${earned
                        ? 'border-white/50 bg-[#14101A] scale-105'
                        : 'border-[#271C29] bg-[#0B080F] opacity-40 group-hover:opacity-65'
                      }`}
                    style={{
                      boxShadow: earned ? `0 0 14px ${c}66, inset 0 0 8px ${c}33` : 'none',
                    }}
                  >
                    <InfinityGemSvg color={c} size={18} />
                  </div>
                );
              })}
            </div>

            <div className="text-right shrink-0">
              <span className="text-[9.5px] font-mono text-[#94A3B8] uppercase tracking-[0.12em] block">
                GAUNTLET VAULT
              </span>
              <span className="text-[10px] font-mono font-bold text-[#FCA5A5] uppercase tracking-[0.14em]">
                STONES: <strong className="text-white">{progress.unlockedStones.length}/6 DOCKED</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Mass AAA Action Dock */}
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEnterChallenge();
            }}
            style={{
              background:
                'linear-gradient(135deg, #DC2626 0%, #991B1B 48%, #15803D 100%)',
            }}
            className="mass-cta-btn flex-1 h-[52px] px-6 border border-[#F87171]/80 group-hover:border-[#4ADE80] hover:brightness-110 text-white font-display font-black text-xs sm:text-sm tracking-[0.2em] uppercase rounded-[4px] cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(220,38,38,0.36)] hover:shadow-[0_12px_36px_rgba(230,36,41,0.5)] hover:scale-[1.015] transition-all"
          >
            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FECACA] shadow-[0_0_12px_#EF4444]" aria-hidden="true" />
            <Zap className="w-4 h-4 fill-white text-white" />
            <span>ENTER THE CHALLENGE</span>
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenVault) onOpenVault();
            }}
            className="h-[52px] px-5 bg-[#130E07] hover:bg-[#1E160A] border border-[#EAB308]/55 hover:border-[#FACC15] text-[#FDE047] hover:text-white font-mono font-bold text-xs tracking-[0.14em] uppercase transition-all rounded-[4px] cursor-pointer inline-flex items-center justify-center gap-2 shrink-0 shadow-[0_0_18px_rgba(234,179,8,0.14)]"
            title="Inspect Stark Nano-Gauntlet Reward Vault"
          >
            <Trophy className="w-4 h-4 text-[#FACC15]" />
            <span>VAULT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
