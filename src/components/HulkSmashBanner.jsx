import React, { useState, useEffect } from 'react';
import { Play, Trophy, ChevronRight } from 'lucide-react';
import { clockAudio } from '../utils/audio.js';
import { FEATURED_GAME_CAST, ALL_AVATARS, HULK_PROFILE } from '../data/hulkGameData.js';
import { hulkAudio } from '../utils/hulkAudio.js';

/**
 * Art-Directed Theatrical Featurette Banner immediately below the protected Hero Section.
 * Uses matte obsidian surfaces, platinum display typography, hairline rules, and key-art masking.
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
    }, 240);
  };

  return (
    <section
      id="game-mayhem"
      aria-label="Hulk Smash Mayhem Mini-Game Entry"
      className="relative z-20 border-t border-b border-[#1A1D24] bg-[#08090B] overflow-hidden"
    >
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
          className="group relative border border-[#222731] hover:border-[#3A4352] bg-[#0B0D11] rounded-[2px] p-6 sm:p-9 md:p-11 shadow-[0_24px_60px_rgba(0,0,0,0.92)] transition-colors duration-300 cursor-pointer overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          {/* Subtle Masked Key-Art Atmosphere (No Neon Blobs) */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
            <img
              src={selectedAvatar.poster}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover object-top opacity-[0.14] group-hover:opacity-[0.2] transition-opacity duration-700 filter grayscale-[30%] contrast-125 scale-105"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(95deg, #0B0D11 22%, rgba(11,13,17,0.88) 58%, #0B0D11 100%)',
              }}
            />
          </div>

          {/* Restraint Corner Registration Marks */}
          <span className="absolute top-2.5 left-2.5 w-2.5 h-2.5 border-t border-l border-[#363E4B] pointer-events-none" aria-hidden="true" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 border-t border-r border-[#363E4B] pointer-events-none" aria-hidden="true" />
          <span className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 border-b border-l border-[#363E4B] pointer-events-none" aria-hidden="true" />
          <span className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 border-b border-r border-[#363E4B] pointer-events-none" aria-hidden="true" />

          {/* Left: Key Portrait Still + Editorial Typography */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start lg:items-center gap-6 sm:gap-8 text-center sm:text-left">
            {/* Editorial Still Frame */}
            <div className="relative w-28 h-36 xs:w-32 xs:h-44 sm:w-36 sm:h-48 shrink-0 overflow-hidden border border-[#2C333F] group-hover:border-[#4B5565] bg-[#060709] rounded-[2px] transition-colors duration-300">
              <img
                src={selectedAvatar.poster}
                alt={selectedAvatar.name}
                loading="lazy"
                className="w-full h-full object-cover object-top filter contrast-110 brightness-95 group-hover:brightness-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 inset-x-0 px-2 py-1.5 border-t border-white/10 bg-black/75">
                <span className="block font-mono text-[8.5px] font-semibold text-[#D1D5DB] uppercase tracking-[0.18em] truncate text-center">
                  {selectedAvatar.name}
                </span>
              </div>
            </div>

            <div className="max-w-xl">
              {/* Editorial Metadata Row (Replaces AI Pill Soup) */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mb-2.5 text-[10px] font-mono tracking-[0.2em] uppercase text-[#8C929D]">
                <span className="text-[#34D399] font-semibold">FEATURED SIMULATION</span>
                <span className="text-[#303641]">/</span>
                <span>51 MARVEL AVATARS</span>
                <span className="text-[#303641] hidden sm:inline">/</span>
                <span className="hidden sm:inline">CUSTOM VOICE &amp; SFX</span>
                {highScore > 0 && (
                  <>
                    <span className="text-[#303641]">/</span>
                    <span className="inline-flex items-center gap-1 text-[#D4AF37] font-semibold">
                      <Trophy className="w-3 h-3" />
                      <span>BEST {highScore.toLocaleString()}</span>
                    </span>
                  </>
                )}
              </div>

              {/* Sculpted Metallic Cinema Title */}
              <h3 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-cinematic font-black tracking-tight text-metallic uppercase leading-none mb-2">
                HULK SMASH MAYHEM
              </h3>

              <p className="text-xs sm:text-[13px] font-mono tracking-[0.22em] text-[#D1D5DB] uppercase mb-3">
                READY TO UNLEASH THE SMASH?
              </p>

              <p className="text-xs sm:text-sm font-body text-[#949AA4] max-w-xl leading-relaxed hidden sm:block mb-4">
                Enter Sector 616. Crush Latverian Doombots, Thanos constructs, and Void anomalies with Hulk&apos;s bio-acoustic fury while protecting Spider-Man, Iron Man, and the Avengers.
              </p>

              {/* Editorial Cast Contact-Sheet Thumbnails */}
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <div className="flex items-center gap-1.5">
                  {FEATURED_GAME_CAST.slice(1).map((char) => (
                    <div
                      key={char.id}
                      title={char.name}
                      className="w-6 h-8 overflow-hidden border border-[#242A34] bg-[#08090B] rounded-[1px]"
                    >
                      <img
                        src={char.poster}
                        alt={char.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-top filter saturate-[0.85]"
                      />
                    </div>
                  ))}
                </div>
                <span className="text-[9.5px] font-mono text-[#7C828D] uppercase tracking-[0.16em]">
                  +44 MORE HEROES &amp; VILLAINS
                </span>
              </div>
            </div>
          </div>

          {/* Right: Cinema-Grade Architectural CTA Deck */}
          <div className="relative z-10 shrink-0 w-full lg:w-auto flex flex-col items-stretch sm:items-center lg:items-end gap-2.5 border-t lg:border-t-0 border-[#1C2027] pt-5 lg:pt-0">
            <button
              type="button"
              disabled={isLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleLaunch();
              }}
              className="relative px-7 sm:px-9 py-3.5 sm:py-4 bg-[#ECEEF2] hover:bg-white text-[#08090B] font-mono font-bold text-xs tracking-[0.22em] uppercase transition-all duration-200 rounded-[2px] cursor-pointer inline-flex items-center justify-center gap-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.65)]"
            >
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#16A34A]" aria-hidden="true" />
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#08090B] border-t-transparent rounded-full animate-spin" />
                  <span>INITIALIZING...</span>
                </span>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-[#08090B]" />
                  <span>PLAY NOW</span>
                  <ChevronRight className="w-4 h-4 stroke-[2.2]" />
                </>
              )}
            </button>

            <span className="text-[9.5px] font-mono text-[#7C828D] tracking-[0.2em] uppercase text-center lg:text-right">
              30S TACTICAL REFLEX • TEAM-UP STRIKES
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
