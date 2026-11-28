import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Mic2, Clapperboard, Sparkles } from 'lucide-react';
import { TAMIL_DUB_MEMORIES } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

export default function TamilDubNostalgia() {
  const [activeId, setActiveId] = useState(TAMIL_DUB_MEMORIES[0].id);
  const railRef = useRef(null);

  const selected = TAMIL_DUB_MEMORIES.find((m) => m.id === activeId) || TAMIL_DUB_MEMORIES[0];

  const scrollRail = (dir) => {
    try { clockAudio.tick(0); } catch { }
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div id="fanverse-dubs" className="mb-10 sm:mb-16 scroll-mt-24">
      {/* Studio Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <span className="text-[11px] font-hud font-bold tracking-[0.26em] text-[#E62429] uppercase block mb-1">
            NAMMA TAMIL DUB MEMORIES
          </span>
          <h3 className="text-2xl sm:text-4xl font-hud font-extrabold text-white uppercase tracking-wide leading-none">
            TAMIL DUB NOSTALGIA
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollRail(-1)}
            aria-label="Scroll Tamil Dub Memories left"
            className="w-9 h-9 border border-white/15 hover:border-white bg-[#121318] text-white inline-flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollRail(1)}
            aria-label="Scroll Tamil Dub Memories right"
            className="w-9 h-9 border border-white/15 hover:border-white bg-[#121318] text-white inline-flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Authentic Marvel.com Vertical Movie Poster Shelf */}
      <div
        ref={railRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        {TAMIL_DUB_MEMORIES.map((movie) => {
          const isSelected = movie.id === selected.id;
          return (
            <button
              key={movie.id}
              type="button"
              onClick={() => {
                try { clockAudio.tick(0); } catch { }
                setActiveId(movie.id);
              }}
              className="snap-start shrink-0 w-[165px] sm:w-[185px] text-left group cursor-pointer focus:outline-none"
            >
              <div className="relative aspect-[2/3] w-full bg-black overflow-hidden mb-2.5 shadow-xl">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  loading="lazy"
                  className={`w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105 ${isSelected ? 'brightness-100' : 'brightness-90 group-hover:brightness-100'
                    }`}
                />
                <div
                  className={`absolute bottom-0 inset-x-0 transition-all ${isSelected ? 'h-1 bg-[#E62429]' : 'h-[2px] bg-white/0 group-hover:bg-[#E62429]'
                    }`}
                />
              </div>

              <h4
                className={`text-sm font-hud font-bold uppercase tracking-wide leading-tight transition-colors ${isSelected ? 'text-[#E62429]' : 'text-white group-hover:text-[#E62429]'
                  }`}
              >
                {movie.title}
              </h4>
              <span className="text-[10px] font-mono text-[#777A80] uppercase block mt-0.5">
                {movie.year} • TAMIL DUB
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Editorial Film Notes Bar */}
      <div className="mt-3 marvel-chamfer bg-[#121318] border border-white/[0.08] p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative">
        <div className="md:col-span-3 flex items-center gap-4">
          <img
            src={selected.poster}
            alt={selected.title}
            className="w-16 h-24 sm:w-20 sm:h-28 object-cover object-top shrink-0 border border-white/10"
          />
          <div>
            <span className="text-[10px] font-hud font-bold tracking-[0.2em] text-[#E62429] uppercase block mb-0.5">
              {selected.highlightTag}
            </span>
            <h4 className="text-lg font-hud font-bold text-white uppercase leading-tight mb-1">
              {selected.title}
            </h4>
            <span className="text-[10px] font-mono text-[#9CA3AF] block">
              {selected.availability}
            </span>
          </div>
        </div>

        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-5 border-t md:border-t-0 md:border-l border-white/[0.08] pt-4 md:pt-0 md:pl-6">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-hud font-bold tracking-[0.18em] text-[#9CA3AF] uppercase mb-1.5">
              <Mic2 className="w-3.5 h-3.5 text-[#E62429]" />
              <span>VERIFIED DUBBING FACT</span>
            </div>
            <p className="text-xs font-body text-[#D1D5DB] leading-relaxed">
              {selected.dubFact}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-hud font-bold tracking-[0.18em] text-[#9CA3AF] uppercase mb-1.5">
              <Clapperboard className="w-3.5 h-3.5 text-[#E62429]" />
              <span>THEATRE MEMORY</span>
            </div>
            <p className="text-xs font-body text-[#D1D5DB] leading-relaxed">
              {selected.sceneMemory}
            </p>
          </div>

          <div className="border-l-2 border-[#E62429] pl-3.5 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-[10px] font-hud font-bold tracking-[0.18em] text-[#E62429] uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FAN NOSTALGIA</span>
            </div>
            <p className="text-xs sm:text-sm font-display font-semibold text-white leading-snug">
              &ldquo;{selected.tanglishNostalgia}&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
