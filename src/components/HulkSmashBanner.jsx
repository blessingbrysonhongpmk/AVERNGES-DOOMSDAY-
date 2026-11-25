import React, { useState, useEffect } from 'react';
import { Play, Trophy, ShieldAlert, ChevronRight, Volume2 } from 'lucide-react';
import { clockAudio } from '../utils/audio.js';
import { FEATURED_GAME_CAST, ALL_AVATARS, HULK_PROFILE } from '../data/hulkGameData.js';
import { hulkAudio } from '../utils/hulkAudio.js';

/**
 * Premium Game Promotion Banner immediately below Hero Section
 * Showcases active Marvel Character Avatar alongside Hulk, Hero Team-Ups, and custom SFX audio.
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
      hulkAudio.preloadAll();
    } catch { }
    setTimeout(() => {
      onPlay();
      setIsLoading(false);
    }, 240);
  };

  return (
    <section
      id="game-mayhem"
      aria-label="Hulk Smash Mayhem Mini-Game Entry"
      className="relative z-20 border-t border-b border-[#1E252D] bg-[#07090C] overflow-hidden"
    >
      {/* Background Gamma Lighting Vignette */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[350px] bg-[#10B981]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[300px] bg-[#00FF88]/6 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-fluid container-xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
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
          className="group relative border border-[#10B981]/40 hover:border-[#00FF88] bg-gradient-to-r from-[#0C120E] via-[#090C0F] to-[#06080A] rounded-sm p-5 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] transition-all duration-300 hover:shadow-[0_25px_70px_rgba(16,185,129,0.25)] cursor-pointer overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Subtle Gamma Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#00FF88_1px,transparent_1px)] [background-size:16px_16px]"
            aria-hidden="true"
          />

          {/* Left: Hulk Portrait & Theatrical Narrative */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-6 sm:gap-8 text-center sm:text-left z-10">
            <div className="relative w-28 h-36 xs:w-32 xs:h-44 sm:w-36 sm:h-48 shrink-0 rounded-sm overflow-hidden border-2 border-[#10B981]/70 group-hover:border-[#00FF88] shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all duration-500 group-hover:scale-[1.04]">
              <img
                src={selectedAvatar.poster}
                alt={selectedAvatar.name}
                loading="lazy"
                className="w-full h-full object-cover object-top filter brightness-90 group-hover:brightness-100 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              <span className="absolute bottom-1.5 left-1.5 right-1.5 text-center bg-black/85 border border-[#10B981]/40 text-[#00FF88] font-mono text-[8px] xs:text-[9px] font-bold py-0.5 uppercase tracking-wider rounded-sm truncate px-1">
                AVATAR: {selectedAvatar.name}
              </span>
            </div>

            <div className="max-w-xl">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#10B981]/15 border border-[#10B981]/50 text-[#00FF88] text-[9px] font-mono tracking-widest uppercase font-bold rounded-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping" />
                  <span>MARVEL ARCADE MINI-GAME</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/80 border border-[#1E252D] text-[#8C9098] text-[9px] font-mono tracking-wider uppercase rounded-sm">
                  <Volume2 className="w-3 h-3 text-[#00FF88]" />
                  <span>10 HULK &amp; HERO SFX</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/80 border border-[#1E252D] text-[#8C9098] text-[9px] font-mono tracking-wider uppercase rounded-sm hidden sm:inline-flex">
                  <ShieldAlert className="w-3 h-3 text-[#EAB308]" />
                  <span>AVENGERS TEAM-UPS</span>
                </span>

                {highScore > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#22C55E]/10 border border-[#22C55E]/40 text-[#22C55E] text-[9px] font-mono tracking-wider uppercase rounded-sm">
                    <Trophy className="w-3 h-3" />
                    <span>RECORD: {highScore.toLocaleString()} PTS</span>
                  </span>
                )}
              </div>

              <h3 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-cinematic font-black tracking-tight text-white uppercase group-hover:text-[#00FF88] transition-colors leading-none mb-1">
                HULK SMASH MAYHEM
              </h3>

              <p className="text-xs sm:text-sm font-mono tracking-[0.2em] text-[#00FF88] uppercase font-bold mb-3 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
                &ldquo;HULK IS ALWAYS ANGRY.&rdquo; READY TO SMASH?
              </p>

              <p className="text-xs sm:text-sm font-body text-[#9CA3AF] max-w-xl leading-relaxed hidden sm:block mb-3">
                Crush Doombots, Thanos constructs &amp; Loki illusions with authentic Hulk roars and thunderclaps. Protect Spider-Man, Iron Man &amp; Captain America — and call Avengers Team-Ups into battle!
              </p>

              {/* Assembled Marvel Cast Portrait Strip */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <div className="flex -space-x-2">
                  {FEATURED_GAME_CAST.slice(1).map((char) => (
                    <img
                      key={char.id}
                      src={char.poster}
                      alt={char.name}
                      title={char.name}
                      className="w-7 h-7 rounded-full object-cover object-top border-2 border-[#090C0F] ring-1 ring-[#10B981]/50"
                    />
                  ))}
                </div>
                <span className="text-[9.5px] font-mono text-[#8C9098] uppercase tracking-wider">
                  51 MARVEL AVATARS &amp; HEROES READY
                </span>
              </div>
            </div>
          </div>

          {/* Right: Tactile PLAY NOW Trigger Deck */}
          <div className="shrink-0 w-full md:w-auto flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-[#1E252D] pt-4 md:pt-0 z-10">
            <button
              type="button"
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleLaunch();
              }}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#10B981] via-[#22C55E] to-[#00FF88] text-black font-mono font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(34,197,94,0.7)] group-hover:shadow-[0_0_40px_rgba(0,255,136,0.9)] group-hover:scale-105 inline-flex items-center gap-2.5 rounded-sm cursor-pointer select-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>LOADING ARENA...</span>
                </span>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  <span>PLAY NOW</span>
                  <ChevronRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>

            <span className="text-[9.5px] font-mono text-[#8C9098] tracking-widest uppercase text-center md:text-right">
              30 SECONDS • CUSTOM HERO SFX &amp; TEAM-UPS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
