import React, { useEffect, useState, useRef } from 'react';
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

export default function McuQuizThumbnail({
  onOpenQuiz,
  onOpenVault,
  isQuizOpen,
  isSpotlight = false,
}) {
  const [progress, setProgress] = useState(() => loadQuizProgress());

  useEffect(() => {
    setProgress(loadQuizProgress());
  }, [isQuizOpen]);

  const thumbRef = useRef(null);
  const rafRef = useRef(null);

  const handleThumbMouseMove = (e) => {
    const el = thumbRef.current;
    if (!el || window.matchMedia?.('(hover: none), (pointer: coarse)').matches) return;
    const rect = el.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const nx = (xPct - 50) / 50;
    const ny = (yPct - 50) / 50;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${xPct.toFixed(2)}%`);
      el.style.setProperty('--my', `${yPct.toFixed(2)}%`);
      el.style.setProperty('--px', nx.toFixed(3));
      el.style.setProperty('--py', ny.toFixed(3));
    });
  };

  const handleThumbMouseLeave = () => {
    const el = thumbRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
    el.style.setProperty('--px', '0');
    el.style.setProperty('--py', '0');
  };

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
      className={`${
        isSpotlight ? 'lg:col-span-8 lg:col-start-3' : 'lg:col-span-6'
      } group relative p-[1px] marvel-chamfer bg-gradient-to-b from-white/[0.18] via-white/[0.08] to-white/[0.06] hover:from-[#F87171]/85 hover:via-[#E62429]/45 hover:to-[#E62429]/25 transition-all duration-300 cursor-pointer hover:-translate-y-1 select-none min-w-0`}
    >
      <div className="relative h-full w-full marvel-chamfer bg-[#0B0C10] overflow-hidden flex flex-col justify-between">
        {/* Precision Marvel Scarlet Top Specular Conduit */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#E62429] via-[#F87171]/80 to-transparent opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none z-30"
          aria-hidden="true"
        />

        {/* CINEMATIC BOX-ART THUMBNAIL STAGE (3-Layer Parallax + Multi-Stone Beam) */}
        <div
          ref={thumbRef}
          onMouseMove={handleThumbMouseMove}
          onMouseLeave={handleThumbMouseLeave}
          className="game-thumb-stage relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#060609]"
        >
          {/* Layer 1: Cosmic Multiverse Silhouettes & Volumetric Background */}
          <img
            src="/thumbnails/quiz-bg.webp"
            alt="Hero and villain silhouettes in deep multiverse void"
            loading="lazy"
            className="game-thumb-layer game-thumb-bg object-center"
          />

          {/* Layer 2: Six-Stone Infinity Vortex Subject */}
          <img
            src="/thumbnails/quiz-subject.webp"
            alt="MCU Ultimate Quiz — Cosmic Multiverse Portal & Infinity Stones"
            loading="lazy"
            className="game-thumb-layer game-thumb-subject object-center"
          />

          {/* Hidden Detail Reveal: Glowing Infinity Stone Runes Inside Beam */}
          <img
            src="/thumbnails/quiz-runes.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="game-thumb-layer game-thumb-reveal game-thumb-reveal--quiz object-center"
          />

          {/* Layer 3: Cosmic Particles & Volumetric Light Motes */}
          <img
            src="/thumbnails/quiz-fx.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="game-thumb-layer game-thumb-fx object-center"
          />

          {/* Peripheral Dimming Veil Outside Cursor Beam */}
          <div className="game-thumb-dim" aria-hidden="true" />

          {/* Cursor-Driven Multi-Color Volumetric Light Cone Shifting Through 6 Stone Colors */}
          <div className="game-thumb-beam" aria-hidden="true">
            <div className="game-thumb-beam--quiz-base" />
            <div className="game-thumb-beam--quiz-shift" />
          </div>

          {/* Seamless Theatrical Ink Vignette Melting Into Card Canvas */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(8,10,14,0.72) 0%, rgba(8,10,14,0.06) 36%, rgba(11,12,16,0.52) 68%, #0B0C10 100%)',
            }}
            aria-hidden="true"
          />

          {/* Top Box-Art Genre & Best Score Rail (Single Line on All Phones) */}
          <div className="absolute top-3 inset-x-3 sm:top-3.5 sm:inset-x-5 flex items-center justify-between gap-2 z-10">
            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#080B0F]/85 backdrop-blur-md border-l-2 border-[#E62429] text-[9px] sm:text-[10px] game-card-label text-[#FECACA] whitespace-nowrap">
              1000-Q<span className="hidden xs:inline"> &bull; EN / TANGLISH</span>
            </span>

            {progress.bestScore > 0 ? (
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#080B0F]/85 backdrop-blur-md border border-white/[0.12] text-[9px] sm:text-[10px] game-card-label text-[#FACC15] inline-flex items-center gap-1 tabular-nums whitespace-nowrap">
                <Trophy className="w-3 h-3 text-[#EAB308] shrink-0" />
                <span>BEST {progress.bestScore}/10</span>
              </span>
            ) : (
              <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#080B0F]/85 backdrop-blur-md border border-white/[0.1] text-[9px] sm:text-[10px] game-card-label text-white/75 whitespace-nowrap">
                STARK ARCHIVE
              </span>
            )}
          </div>

          {/* Game Wordmark Title Lockup */}
          <div className="absolute bottom-2.5 sm:bottom-3 inset-x-3.5 sm:inset-x-5 z-10">
            <div className="flex items-stretch gap-2.5 sm:gap-3 min-w-0">
              <span className="w-[3px] bg-[#E62429] shrink-0" aria-hidden="true" />
              <div className="min-w-0">
                <span className="text-[9.5px] sm:text-[10px] game-card-label text-[#FCA5A5] block mb-0.5">
                  10 QUESTIONS. ONE TRUE FAN.
                </span>
                <div className="relative overflow-hidden inline-block max-w-full">
                  <h3 className="text-[30px] xs:text-[34px] sm:text-[44px] game-card-title game-card-title-fill--quiz uppercase leading-[0.9] drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]">
                    MCU ULTIMATE QUIZ
                  </h3>
                  <span className="game-title-sweep" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Machined Gauntlet Loadout & Action Dock */}
        <div className="px-3.5 pb-4 pt-1.5 sm:px-5 sm:pb-5 sm:pt-2 flex flex-col justify-between flex-1 gap-3 sm:gap-3.5 bg-[#0B0C10]">
          <p className="text-[12.5px] sm:text-[13px] game-card-desc text-[#A1A8B4] leading-[1.52]">
            Challenge 1,000 canonical MCU questions—unlock all 6 Infinity Stones and face Iron Man&apos;s evaluation.
          </p>

          {/* Machined Infinity Gauntlet Socket Bay (Zero Overflow at 360px+) */}
          <div className="px-2.5 py-2 sm:px-3 sm:py-2.5 bg-[#11131A] border border-white/[0.08] rounded-[2px] flex items-center justify-between gap-2 sm:gap-3 min-h-[56px] sm:min-h-[64px]">
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {STONE_MILESTONES.map((m) => {
                const earned = progress.unlockedStones.includes(m.id);
                const c = STONE_COLORS[m.id];
                return (
                  <div
                    key={m.id}
                    title={`${m.id.toUpperCase()} STONE (${m.minScore}/10) — ${earned ? 'UNLOCKED' : 'LOCKED'}`}
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-[2px] border flex items-center justify-center transition-all duration-300 ${
                      earned
                        ? 'border-white/50 bg-[#181B24]'
                        : 'border-white/[0.1] bg-[#0B0C10] opacity-45 group-hover:opacity-75'
                    }`}
                    style={{
                      boxShadow: earned ? `0 0 12px ${c}55, inset 0 0 6px ${c}28` : 'none',
                    }}
                  >
                    <InfinityGemSvg color={c} size={15} />
                  </div>
                );
              })}
            </div>

            <div className="pl-2 sm:pl-3 border-l border-white/[0.08] text-right min-w-0 flex-1">
              <span className="text-[8.5px] sm:text-[9.5px] font-gameTech font-bold text-[#7D8594] uppercase tracking-[0.12em] sm:tracking-[0.18em] block truncate">
                GAUNTLET VAULT
              </span>
              <span className="text-[10.5px] sm:text-[12px] font-gameTech font-bold text-white uppercase tracking-[0.06em] sm:tracking-[0.1em] tabular-nums block truncate">
                {progress.unlockedStones.length}/6 STONES
              </span>
            </div>
          </div>

          {/* Sculpted AAA Action Dock */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-2.5 pt-0.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEnterChallenge();
              }}
              className="marvel-btn-cut relative flex-1 h-[44px] sm:h-[48px] px-5 sm:px-6 bg-gradient-to-b from-[#EF3237] to-[#C8181D] hover:from-[#F63E43] hover:to-[#DC1B21] active:scale-[0.99] text-white font-hud font-bold text-[12.5px] sm:text-[13.5px] tracking-[0.18em] sm:tracking-[0.2em] uppercase cursor-pointer inline-flex items-center justify-center gap-2 sm:gap-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-2px_0_rgba(0,0,0,0.3)] transition-all duration-200 group/btn"
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
              className="group/sec marvel-btn-cut p-[1px] h-[44px] sm:h-[48px] bg-white/[0.16] hover:bg-[#EAB308]/80 transition-colors duration-200 cursor-pointer shrink-0"
              title="Inspect Stark Nano-Gauntlet Reward Vault"
            >
              <span className="marvel-btn-cut h-full w-full px-4 sm:px-5 bg-[#13161E] group-hover/sec:bg-[#1A1F28] text-[#D1D5DB] group-hover/sec:text-[#FDE047] font-hud font-bold text-[11.5px] sm:text-[12px] tracking-[0.14em] sm:tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2 transition-colors duration-200">
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
