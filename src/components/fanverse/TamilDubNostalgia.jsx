import React, { useState, useRef } from 'react';
import { Film, ChevronLeft, ChevronRight, Mic2, Sparkles, Clapperboard } from 'lucide-react';
import { TAMIL_DUB_MEMORIES } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

export default function TamilDubNostalgia() {
  const [activeId, setActiveId] = useState(TAMIL_DUB_MEMORIES[0].id);
  const railRef = useRef(null);

  const selected = TAMIL_DUB_MEMORIES.find((m) => m.id === activeId) || TAMIL_DUB_MEMORIES[0];

  const scrollRail = (dir) => {
    try { clockAudio.tick(0); } catch {}
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  return (
    <div id="fanverse-dubs" className="mb-12 sm:mb-16 scroll-mt-24">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <Film className="w-3.5 h-3.5 text-[#22C55E]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#4ADE80] uppercase">
              02 // NAMMA TAMIL DUB MEMORIES
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase tracking-tight">
            TAMIL DUB NOSTALGIA
          </h3>
          <p className="text-xs sm:text-sm font-body text-[#9CA3AF] mt-0.5">
            Theatre whistle moment-la irundhu Saturday night TV binge varai — verified Tamil dubbed MCU classics!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollRail(-1)}
            aria-label="Scroll Tamil Dub Memories left"
            className="w-9 h-9 border border-white/[0.12] hover:border-[#22C55E] bg-[#0B0D12] hover:bg-[#111D15] text-[#D8D9DC] hover:text-white rounded-[2px] inline-flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollRail(1)}
            aria-label="Scroll Tamil Dub Memories right"
            className="w-9 h-9 border border-white/[0.12] hover:border-[#22C55E] bg-[#0B0D12] hover:bg-[#111D15] text-[#D8D9DC] hover:text-white rounded-[2px] inline-flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Movie Collection Strip */}
      <div
        ref={railRef}
        className="flex gap-3.5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {TAMIL_DUB_MEMORIES.map((movie) => {
          const isSelected = movie.id === selected.id;
          return (
            <button
              key={movie.id}
              type="button"
              onClick={() => {
                try { clockAudio.tick(0); } catch {}
                setActiveId(movie.id);
              }}
              className={`snap-start shrink-0 w-[195px] sm:w-[215px] text-left rounded-[3px] border overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col ${
                isSelected
                  ? 'border-[#22C55E] bg-[#0B1610] shadow-[0_14px_34px_rgba(34,197,94,0.18)] -translate-y-0.5'
                  : 'border-white/[0.08] bg-[#0A0C11] hover:border-white/25'
              }`}
            >
              <div className="relative aspect-[3/4] w-full bg-black overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C11] via-black/20 to-transparent" />

                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
                  <span className="px-2 py-0.5 bg-black/80 border border-white/15 text-white text-[9px] font-mono font-bold rounded-[2px]">
                    {movie.year}
                  </span>
                  <span className="px-1.5 py-0.5 bg-[#091810]/90 border border-[#22C55E]/50 text-[#4ADE80] text-[8px] font-mono font-bold uppercase rounded-[2px]">
                    TAMIL DUB
                  </span>
                </div>

                <div className="absolute bottom-2.5 left-3 right-3">
                  <span className="text-[8.5px] font-mono tracking-wider text-[#FCD34D] uppercase block mb-0.5 truncate">
                    {movie.highlightTag}
                  </span>
                  <h4 className="text-sm font-cinematic font-bold text-white leading-tight line-clamp-2">
                    {movie.title}
                  </h4>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Tamil Dub Dossier Showcase Bar */}
      <div className="mt-2 border border-white/[0.1] bg-[#090B10] rounded-[3px] p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: selected.accent }}
        />

        {/* Compact Thumbnail */}
        <div className="md:col-span-3 flex items-center gap-4">
          <img
            src={selected.poster}
            alt={selected.title}
            className="w-20 h-28 sm:w-24 sm:h-32 object-cover object-top rounded-[2px] border border-white/15 shrink-0 shadow-lg"
          />
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#4ADE80] block mb-1">
              {selected.year} // SELECTED MEMORY
            </span>
            <h4 className="text-base sm:text-lg font-cinematic font-bold text-white leading-snug mb-1.5">
              {selected.title}
            </h4>
            <span className="inline-block px-2 py-0.5 text-[9px] font-mono bg-white/[0.05] border border-white/10 text-[#D8D9DC] rounded-[2px]">
              {selected.availability}
            </span>
          </div>
        </div>

        {/* 3 Narrative Columns: Dubbing Fact / Theatre Moment / Tanglish Vibe */}
        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-6">
          <div>
            <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-[0.16em] text-[#38BDF8] uppercase mb-1.5">
              <Mic2 className="w-3.5 h-3.5" />
              <span>VERIFIED DUB FACT</span>
            </div>
            <p className="text-xs font-body text-[#C8CDD6] leading-relaxed">
              {selected.dubFact}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-[0.16em] text-[#E62429] uppercase mb-1.5">
              <Clapperboard className="w-3.5 h-3.5" />
              <span>MEMORABLE SCENE</span>
            </div>
            <p className="text-xs font-body text-[#C8CDD6] leading-relaxed">
              {selected.sceneMemory}
            </p>
          </div>

          <div className="p-3 rounded-[2px] bg-white/[0.03] border border-white/[0.07]">
            <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-[0.16em] text-[#4ADE80] uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FAN NOSTALGIA</span>
            </div>
            <p className="text-xs font-display font-medium text-white leading-relaxed">
              &ldquo;{selected.tanglishNostalgia}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
