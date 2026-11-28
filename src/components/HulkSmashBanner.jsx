import React, { useState, useEffect } from 'react';
import { Play, Trophy, ChevronRight, Users, Gamepad2, Sparkles } from 'lucide-react';
import { FEATURED_GAME_CAST, ALL_AVATARS, HULK_PROFILE } from '../data/hulkGameData.js';
import { hulkAudio } from '../utils/hulkAudio.js';
import McuQuizThumbnail from './quiz/McuQuizThumbnail';

const GAME_NAV_TABS = [
  { id: 'all', label: 'ALL GAMES' },
  { id: 'smash', label: 'SMASH ARENA' },
  { id: 'quiz', label: 'MCU QUIZ' },
];

/**
 * Interactive Games Hub directly below Hero Countdown:
 * Includes crisp Studio TitleNav Header ("GAMES") + Dual AAA Activity Cards:
 * 1) Hulk Smash Mayhem
 * 2) MCU Ultimate Quiz
 */
export default function HulkSmashBanner({ onPlay, isGameOpen, onOpenQuiz, onOpenQuizVault, isQuizOpen }) {
  const [highScore, setHighScore] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState(HULK_PROFILE);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'smash' | 'quiz'

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
  const showSmash = activeFilter === 'all' || activeFilter === 'smash';
  const showQuiz = activeFilter === 'all' || activeFilter === 'quiz';

  return (
    <section
      id="game-mayhem"
      aria-label="Games — Hulk Smash Mayhem & MCU Ultimate Quiz"
      className="relative z-20 border-t border-b border-white/[0.08] bg-[#08090C] overflow-hidden scroll-mt-16"
    >
      {/* Anchor alias for #games deep-links */}
      <span id="games" className="sr-only" aria-hidden="true" />

      {/* Subtle Dual-Arena Horizon Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background:
            'radial-gradient(circle at 22% 52%, rgba(34,197,94,0.16) 0%, transparent 48%), radial-gradient(circle at 78% 52%, rgba(230,36,41,0.15) 0%, transparent 48%)',
        }}
        aria-hidden="true"
      />

      <div className="container-fluid container-xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-11 relative z-10">
        {/* ═════════════════════════════════════════════════════════════════
            TITLENAV HEADER BAR: GAMES + MODE FILTER & VAULT SHORTCUT
           ═════════════════════════════════════════════════════════════════ */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 mb-6 sm:mb-7 border-b border-white/[0.1]">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="h-[3px] w-7 bg-[#E62429]" aria-hidden="true" />
              <span className="text-[10.5px] font-hud font-bold tracking-[0.26em] text-[#9CA3AF] uppercase">
                AVENGERS: DOOMSDAY // INTERACTIVE HUB
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3.5">
              <h2 className="text-3xl xs:text-4xl sm:text-[42px] font-editorial font-bold tracking-[0.03em] text-white uppercase leading-none inline-flex items-center gap-3">
                <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8 text-[#22C55E] shrink-0" />
                <span>GAMES</span>
              </h2>
              <span className="hidden sm:inline-block h-5 w-[1px] bg-white/[0.16]" aria-hidden="true" />
              <span className="text-[11px] font-hud font-semibold tracking-[0.2em] text-[#8E95A2] uppercase">
                02 PLAYABLE EXPERIENCES
              </span>
            </div>
          </div>

          {/* Right TitleNav Mode Switcher & Vault Shortcut */}
          <nav aria-label="Games section navigation" className="flex flex-wrap items-center gap-5 sm:gap-7">
            <div className="flex items-center gap-5 sm:gap-6">
              {GAME_NAV_TABS.map((tab) => {
                const isActive = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id)}
                    aria-pressed={isActive}
                    className={`relative pb-2 text-xs sm:text-[13px] font-hud font-bold tracking-[0.18em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-white'
                        : 'text-[#7C838F] hover:text-[#E5E7EB]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span
                        className={`absolute bottom-0 inset-x-0 h-[2.5px] ${
                          tab.id === 'smash'
                            ? 'bg-[#22C55E]'
                            : 'bg-[#E62429]'
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {onOpenQuizVault && (
              <button
                type="button"
                onClick={onOpenQuizVault}
                className="pb-2 pl-4 border-l border-white/[0.12] text-xs font-hud font-bold tracking-[0.18em] uppercase text-[#FACC15] hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                title="Open Stark Gauntlet Reward Vault"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#EAB308]" />
                <span>REWARD VAULT</span>
              </button>
            )}
          </nav>
        </header>

        {/* ═════════════════════════════════════════════════════════════════
            DUAL AAA GAME THUMBNAILS GRID
           ═════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-stretch">
          {/* LEFT CARD: HULK SMASH MAYHEM */}
          {showSmash && (
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
              className={`${
                activeFilter === 'smash' ? 'lg:col-span-8 lg:col-start-3' : 'lg:col-span-6'
              } group relative p-[1px] marvel-chamfer bg-gradient-to-b from-white/[0.18] via-white/[0.08] to-white/[0.06] hover:from-[#4ADE80]/85 hover:via-[#22C55E]/45 hover:to-[#22C55E]/25 transition-all duration-300 cursor-pointer hover:-translate-y-1 select-none`}
            >
              <div className="relative h-full w-full marvel-chamfer bg-[#0B0C10] overflow-hidden flex flex-col justify-between">
                {/* Precision Top Gamma Accent Conduit */}
                <div
                  className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#22C55E] via-[#86EFAC]/75 to-transparent opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none z-30"
                  aria-hidden="true"
                />

                {/* CINEMATIC BOX-ART THUMBNAIL STAGE */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-[#06080A]">
                  <img
                    src="/hulk-doomsday-keyart.jpg"
                    alt="Hulk and Doctor Doom — Avengers Doomsday Simulation Key Art"
                    loading="lazy"
                    className="w-full h-full object-cover object-top brightness-[0.98] contrast-[1.08] group-hover:scale-[1.045] transition-transform duration-700 ease-out"
                  />

                  {/* Subtle Gamma Hover Lighting */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at 46% 38%, rgba(34,197,94,0.22) 0%, transparent 56%)',
                    }}
                    aria-hidden="true"
                  />

                  {/* Seamless Theatrical Ink Vignette Melting Into Card Canvas */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(8,10,14,0.72) 0%, rgba(8,10,14,0.06) 36%, rgba(11,12,16,0.52) 68%, #0B0C10 100%)',
                    }}
                    aria-hidden="true"
                  />

                  {/* Top Box-Art Genre & High Score Rail */}
                  <div className="absolute top-3.5 inset-x-4 sm:inset-x-5 flex items-center justify-between gap-2 z-10">
                    <span className="px-2.5 py-1 bg-[#080B0F]/85 backdrop-blur-md border-l-2 border-[#22C55E] text-[10px] font-hud font-bold uppercase tracking-[0.2em] text-[#D1FAE5]">
                      ACTION ARENA &bull; 30S BLITZ
                    </span>

                    {highScore > 0 ? (
                      <span className="px-2.5 py-1 bg-[#080B0F]/85 backdrop-blur-md border border-white/[0.12] text-[10px] font-hud font-bold uppercase tracking-[0.16em] text-[#FACC15] inline-flex items-center gap-1.5 tabular-nums">
                        <Trophy className="w-3 h-3 text-[#EAB308]" />
                        <span>RECORD {highScore.toLocaleString()}</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-[#080B0F]/85 backdrop-blur-md border border-white/[0.1] text-[10px] font-hud font-semibold uppercase tracking-[0.18em] text-white/75">
                        SECTOR 616 // LIVE
                      </span>
                    )}
                  </div>

                  {/* Game Wordmark Title Lockup */}
                  <div className="absolute bottom-3 inset-x-4 sm:inset-x-5 z-10">
                    <div className="flex items-end justify-between gap-3">
                      <div className="flex items-stretch gap-3 min-w-0">
                        <span className="w-[3px] bg-[#22C55E] shrink-0" aria-hidden="true" />
                        <div className="min-w-0">
                          <span className="text-[10px] font-hud tracking-[0.26em] text-[#86EFAC] uppercase block mb-0.5 font-bold">
                            NEURAL AI VOICES &bull; {heroCount} HEROES
                          </span>
                          <h3 className="text-[36px] xs:text-[42px] sm:text-[46px] font-trailer font-normal tracking-[0.04em] text-white uppercase leading-[0.88] drop-shadow-[0_4px_18px_rgba(0,0,0,0.95)]">
                            HULK SMASH MAYHEM
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Machined Hardware Loadout & Action Dock */}
                <div className="px-4 pb-4 pt-2 sm:px-5 sm:pb-5 flex flex-col justify-between flex-1 gap-3.5 bg-[#0B0C10]">
                  <p className="text-[13px] font-body text-[#A1A8B4] leading-[1.52] line-clamp-2 min-h-[40px]">
                    Unleash Hulk&apos;s seismic smash against Doctor Doom&apos;s forces, Thanos echoes, and Void anomalies—with {heroCount} playable Marvel Heroes &amp; English MCU AI voice lines.
                  </p>

                  {/* Collector Roster Loadout Bay */}
                  <div className="px-3 py-2.5 bg-[#11131A] border border-white/[0.08] rounded-[2px] flex items-center justify-between gap-3 min-h-[64px]">
                    <div className="flex items-center gap-1.5">
                      {FEATURED_GAME_CAST.slice(0, 6).map((char, idx) => (
                        <div
                          key={char.id}
                          title={char.name}
                          className={`relative w-7 h-9 sm:w-8 sm:h-10 overflow-hidden bg-[#08090C] rounded-[2px] border transition-all duration-300 hover:-translate-y-0.5 ${
                            idx === 0
                              ? 'border-[#22C55E]/75'
                              : 'border-white/[0.14] group-hover:border-[#22C55E]/45'
                          }`}
                        >
                          <img
                            src={char.poster}
                            alt={char.name}
                            loading="lazy"
                            className="w-full h-full object-cover object-[50%_18%]"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                        </div>
                      ))}
                    </div>

                    <div className="pl-3 border-l border-white/[0.08] text-right shrink-0">
                      <span className="text-[9.5px] font-hud font-semibold text-[#7D8594] uppercase tracking-[0.18em] block">
                        ACTIVE FIGHTER
                      </span>
                      <span className="text-[12px] font-hud font-bold text-white uppercase tracking-[0.1em] inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[#22C55E] inline-block" />
                        <span>{selectedAvatar.name}</span>
                      </span>
                    </div>
                  </div>

                  {/* Sculpted AAA Action Dock */}
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5 pt-0.5">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunch();
                      }}
                      className="marvel-btn-cut relative flex-1 h-[48px] px-6 bg-gradient-to-b from-[#1CA34E] to-[#147938] hover:from-[#22B95A] hover:to-[#168A41] active:scale-[0.99] text-white font-hud font-bold text-[13.5px] tracking-[0.2em] uppercase cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-2px_0_rgba(0,0,0,0.3)] transition-all duration-200 group/btn"
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
                      className="group/sec marvel-btn-cut p-[1px] h-[48px] bg-white/[0.16] hover:bg-[#22C55E]/75 transition-colors duration-200 cursor-pointer shrink-0"
                      title={`Play with ${heroCount} Confirmed Marvel Heroes & AI Voice Lines`}
                    >
                      <span className="marvel-btn-cut h-full w-full px-5 bg-[#13161E] group-hover/sec:bg-[#1A1F2A] text-[#D1D5DB] group-hover/sec:text-white font-hud font-bold text-[12px] tracking-[0.16em] uppercase inline-flex items-center justify-center gap-2 transition-colors duration-200">
                        <Users className="w-3.5 h-3.5 text-[#22C55E]" />
                        <span>{heroCount} HEROES</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT CARD: MCU ULTIMATE QUIZ */}
          {showQuiz && (
            <McuQuizThumbnail
              onOpenQuiz={onOpenQuiz}
              onOpenVault={onOpenQuizVault}
              isQuizOpen={isQuizOpen}
              isSpotlight={activeFilter === 'quiz'}
            />
          )}
        </div>
      </div>
    </section>
  );
}
