import React, { useState, useEffect } from 'react';
import { Shield, ChevronRight, X, Zap, Film, Link2, Sparkles } from 'lucide-react';
import { CHARACTER_FILES } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

export default function CharacterFilesGrid() {
  const [selectedChar, setSelectedChar] = useState(null);

  useEffect(() => {
    if (!selectedChar) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedChar(null);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [selectedChar]);

  return (
    <div id="fanverse-characters" className="mb-12 sm:mb-16 scroll-mt-24">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <Shield className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#7DD3FC] uppercase">
              03 // CLASSIFIED CHARACTER FILES
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase tracking-tight">
            CHARACTER FILES
          </h3>
          <p className="text-xs sm:text-sm font-body text-[#9CA3AF] mt-0.5">
            8 legends who built or threaten the Multiverse — card click panni full Tanglish dossier open pannunga!
          </p>
        </div>

        <span className="text-[10px] font-mono tracking-[0.18em] text-[#777A80] uppercase">
          08 ARCHIVE PROFILES // INTERACTIVE DOSSIERS
        </span>
      </div>

      {/* 8-Card Metallic Character Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CHARACTER_FILES.map((char, idx) => (
          <button
            key={char.id}
            type="button"
            onClick={() => {
              try { clockAudio.tick(0); } catch {}
              setSelectedChar(char);
            }}
            className="text-left border border-white/[0.09] hover:border-white/30 bg-[#0A0C11] hover:bg-[#0E1118] rounded-[3px] overflow-hidden transition-all duration-300 group flex flex-col justify-between cursor-pointer shadow-xl"
          >
            {/* Top accent hairline */}
            <div className="h-[2px] w-full" style={{ backgroundColor: char.accent }} />

            {/* Portrait Artwork */}
            <div className="relative aspect-[4/3] w-full bg-black overflow-hidden">
              <img
                src={char.image}
                alt={char.name}
                loading="lazy"
                className="w-full h-full object-cover object-[50%_18%] transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C11] via-[#0A0C11]/25 to-transparent" />

              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 bg-black/80 border border-white/15 text-[#D8D9DC] text-[8.5px] font-mono font-bold rounded-[2px]">
                  FILE 0{idx + 1}
                </span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: char.accent, boxShadow: `0 0 8px ${char.accent}` }}
                />
              </div>

              <div className="absolute bottom-2.5 left-3 right-3">
                <span className="text-[8.5px] font-mono tracking-[0.16em] text-[#9CA3AF] uppercase block truncate">
                  {char.realName}
                </span>
                <h4 className="text-base sm:text-lg font-cinematic font-black text-white uppercase leading-tight group-hover:text-[#4ADE80] transition-colors">
                  {char.name}
                </h4>
              </div>
            </div>

            {/* Body */}
            <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
              <div>
                <p className="text-[11px] font-display font-semibold text-[#D8D9DC] mb-2 leading-snug">
                  {char.tagline}
                </p>
                <p className="text-[11px] font-body text-[#8F96A3] leading-relaxed line-clamp-3">
                  {char.introTanglish}
                </p>
              </div>

              <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[9.5px] font-mono font-bold uppercase tracking-wider text-[#9CA3AF] group-hover:text-white">
                <span className="truncate">{char.powers[0].split('&')[0]}</span>
                <span className="inline-flex items-center gap-1 text-[#22C55E] shrink-0">
                  <span>OPEN FILE</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Character Profile Dossier Modal */}
      {selectedChar && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedChar.name} Profile Dossier`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/88 backdrop-blur-lg"
          onClick={() => setSelectedChar(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#080A0F] border border-white/[0.14] rounded-[4px] shadow-[0_28px_90px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-[3px] w-full" style={{ backgroundColor: selectedChar.accent }} />

            <button
              type="button"
              onClick={() => setSelectedChar(null)}
              aria-label="Close character file"
              className="absolute top-4 right-4 z-20 w-8 h-8 border border-white/15 hover:border-[#E62429] bg-black/75 hover:bg-[#E62429] text-[#D8D9DC] hover:text-white rounded-[2px] inline-flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Image Slab */}
              <div className="md:col-span-5 relative min-h-[260px] bg-black">
                <img
                  src={selectedChar.image}
                  alt={selectedChar.name}
                  className="w-full h-full object-cover object-[50%_18%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080A0F] via-transparent to-black/35 md:bg-gradient-to-r md:from-transparent md:to-[#080A0F]" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[9px] font-mono tracking-[0.2em] text-[#4ADE80] uppercase block mb-0.5">
                    {selectedChar.actor}
                  </span>
                  <h4 className="text-2xl font-cinematic font-black text-white uppercase">
                    {selectedChar.name}
                  </h4>
                  <p className="text-[10px] font-mono text-[#9CA3AF] uppercase">{selectedChar.roleLabel}</p>
                </div>
              </div>

              {/* Right Deep Dossier */}
              <div className="md:col-span-7 p-5 sm:p-6 space-y-4">
                <div>
                  <p className="text-xs font-display font-bold text-[#4ADE80] mb-1.5">
                    {selectedChar.tagline}
                  </p>
                  <p className="text-xs sm:text-sm font-body text-[#D1D5DB] leading-relaxed">
                    {selectedChar.introTanglish}
                  </p>
                </div>

                {/* Powers */}
                <div>
                  <h5 className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#38BDF8] uppercase mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    <span>POWERS &amp; ABILITIES</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {selectedChar.powers.map((pow, i) => (
                      <li key={i} className="text-xs font-body text-[#B8BEC8] flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: selectedChar.accent }} />
                        <span>{pow}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Appearances */}
                <div>
                  <h5 className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#E62429] uppercase mb-2 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5" />
                    <span>KEY MCU APPEARANCES</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedChar.appearances.map((app, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white/[0.04] border border-white/[0.09] text-[10px] font-mono text-[#E5E7EB] rounded-[2px]"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Connections & Fact */}
                <div className="p-3.5 bg-[#0D1017] border border-white/[0.08] rounded-[3px] space-y-2">
                  <div className="flex items-start gap-2 text-xs font-body text-[#C8CDD6]">
                    <Link2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[9.5px] uppercase text-[#4ADE80] block">STORY CONNECTION</span>
                      {selectedChar.connections}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/[0.06] flex items-start gap-2 text-xs font-body text-[#C8CDD6]">
                    <Sparkles className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[9.5px] uppercase text-[#FDE047] block">FANVERSE FACT</span>
                      {selectedChar.fact}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
