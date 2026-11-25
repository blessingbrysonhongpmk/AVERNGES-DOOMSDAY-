import React, { useState, useEffect } from 'react';
import { Play, Trophy, Zap, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { clockAudio } from '../utils/audio.js';

/**
 * Premium Game Promotion Banner immediately below Hero Section
 * Large cinematic Hulk superhero visual with green gamma lighting and tactile PLAY NOW trigger.
 */
export default function HulkSmashBanner({ onPlay }) {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('hulk_smash_high_score_v1');
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch (e) {}
  }, []);

  const handleLaunch = () => {
    try { clockAudio.tick(0); } catch (e) {}
    onPlay();
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

      {/* Main Container */}
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
          className="group relative border border-[#10B981]/40 hover:border-[#00FF88] bg-gradient-to-r from-[#0C120E] via-[#090C0F] to-[#06080A] rounded-xs p-5 sm:p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] transition-all duration-300 hover:shadow-[0_25px_70px_rgba(16,185,129,0.25)] cursor-pointer overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
        >
          {/* Subtle Gamma Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#00FF88_1px,transparent_1px)] [background-size:16px_16px]"
            aria-hidden="true"
          />

          {/* Left: Hulk Superhero Visual & Composition */}
          <div className="flex items-center gap-6 sm:gap-8 w-full md:w-auto">
            {/* Cinematic Hulk Avatar Container */}
            <div className="relative w-28 xs:w-32 sm:w-40 aspect-[3/4] shrink-0 rounded-xs overflow-hidden border-2 border-[#10B981]/60 group-hover:border-[#00FF88] shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all duration-500 group-hover:scale-104">
              <img
                src="/characters/hulk.jpg"
                alt="The Incredible Hulk"
                className="w-full h-full object-cover filter brightness-95 contrast-110 group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              {/* Gamma Badge */}
              <div className="absolute bottom-2 left-2 right-2 bg-black/90 border border-[#22C55E]/50 px-1.5 py-0.5 rounded-xs text-center shadow-lg">
                <span className="text-[8.5px] font-mono font-bold text-[#00FF88] tracking-widest uppercase">
                  AVENGER // TIER 1
                </span>
              </div>
            </div>

            {/* Typography & Game Overview */}
            <div className="flex-1 text-left">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#10B981]/20 border border-[#10B981]/60 text-[#34D399] text-[9px] sm:text-[10px] font-mono tracking-widest uppercase font-bold rounded-xs">
                  <Zap className="w-3 h-3 text-[#00FF88]" />
                  <span>MINI ARCADE MINI-GAME</span>
                </span>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/80 border border-[#1E252D] text-[#8C9098] text-[9px] font-mono tracking-wider uppercase rounded-xs">
                  <ShieldAlert className="w-3 h-3 text-[#EAB308]" />
                  <span>FAST REFLEX CHALLENGE</span>
                </span>

                {highScore > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#22C55E]/10 border border-[#22C55E]/40 text-[#22C55E] text-[9px] font-mono tracking-wider uppercase rounded-xs">
                    <Trophy className="w-3 h-3" />
                    <span>RECORD: {highScore.toLocaleString()} PTS</span>
                  </span>
                )}
              </div>

              {/* Game Title */}
              <h3 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-cinematic font-black tracking-tight text-white uppercase group-hover:text-[#00FF88] transition-colors leading-none mb-1">
                HULK SMASH MAYHEM
              </h3>

              {/* Subtitle */}
              <p className="text-xs sm:text-sm font-mono tracking-[0.2em] text-[#00FF88] uppercase font-bold mb-3 drop-shadow-[0_0_10px_rgba(0,255,136,0.5)]">
                READY TO UNLEASH THE SMASH?
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm font-body text-[#9CA3AF] max-w-xl leading-relaxed hidden sm:block">
                City alert! Rogue robots, runaway cargo, and alien drones are wreaking havoc. Step into the arena, unleash Hulk’s raw reflexes, build insane combos, and protect innocent citizens!
              </p>
            </div>
          </div>

          {/* Right: Tactile PLAY NOW Trigger Deck */}
          <div className="shrink-0 w-full md:w-auto flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 border-t md:border-t-0 border-[#1E252D] pt-4 md:pt-0">
            {/* Play Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLaunch();
              }}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-[#10B981] via-[#22C55E] to-[#00FF88] text-black font-mono font-black text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(34,197,94,0.7)] group-hover:shadow-[0_0_40px_rgba(0,255,136,0.9)] group-hover:scale-105 inline-flex items-center gap-2.5 rounded-xs cursor-pointer select-none"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>PLAY NOW</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>

            <span className="text-[9.5px] font-mono text-[#8C9098] tracking-widest uppercase text-center md:text-right">
              30 SECONDS • ARCADE REFLEX MINI-GAME
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
