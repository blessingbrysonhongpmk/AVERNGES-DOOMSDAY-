import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Mic2, Clapperboard } from 'lucide-react';
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
    <div id="fanverse-dubs" className="mb-12 sm:mb-16 scroll-mt-24">
      {/* Zine Shelf Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <span className="text-[10.5px] fan-font-mono font-bold text-[var(--gold-foil)] block mb-1">
            NAMMA TAMIL DUB MEMORIES // VHS ARCHIVE SHELF
          </span>
          <h3 className="text-3xl sm:text-5xl fan-font-flex text-[var(--ink)] uppercase leading-none">
            TAMIL DUB NOSTALGIA
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => scrollRail(-1)}
            aria-label="Scroll Tamil Dub Memories left"
            className="fan-btn-tactile w-9 h-9 border border-white/25 bg-[#121318] text-white inline-flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollRail(1)}
            aria-label="Scroll Tamil Dub Memories right"
            className="fan-btn-tactile w-9 h-9 border border-white/25 bg-[#121318] text-white inline-flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Overlapping VHS / DVD Video-Store Sleeve Wall */}
      <div
        ref={railRef}
        className="fan-reel-scrollbar flex items-end gap-2 sm:gap-3 overflow-x-auto pt-5 pb-5 px-2 snap-x snap-mandatory scroll-smooth"
      >
        {TAMIL_DUB_MEMORIES.map((movie, idx) => {
          const isSelected = movie.id === selected.id;
          const tiltDeg = isSelected ? '0deg' : idx % 2 === 0 ? '-1.8deg' : '1.4deg';
          return (
            <button
              key={movie.id}
              type="button"
              onClick={() => {
                try { clockAudio.tick(0); } catch { }
                setActiveId(movie.id);
              }}
              style={{
                transform: isSelected
                  ? 'translateY(-10px) scale(1.04) rotate(0deg)'
                  : `translateY(4px) rotate(${tiltDeg})`,
              }}
              className={`fan-vhs-sleeve relative snap-start shrink-0 text-left group cursor-pointer focus:outline-none -mr-1.5 sm:mr-0 ${
                isSelected ? 'w-[172px] sm:w-[198px] z-20' : 'w-[152px] sm:w-[172px] z-10 opacity-85 hover:opacity-100'
              }`}
            >
              {/* Physical VHS Sleeve Box: Spine + Poster + Worn Film Overlay */}
              <div
                className={`relative aspect-[2/3] w-full bg-[#090A0D] overflow-hidden flex border-2 ${
                  isSelected
                    ? 'border-[var(--gold-foil)] shadow-[6px_6px_0_#000]'
                    : 'border-white/20 shadow-[3px_4px_0_#000]'
                }`}
              >
                {/* Left VHS Spine Rib */}
                <div
                  className="w-3 sm:w-3.5 shrink-0 flex flex-col items-center justify-between py-2 border-r border-black/80"
                  style={{ backgroundColor: movie.accent || '#E4262C' }}
                  aria-hidden="true"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-black/50" />
                  <span className="text-[7px] font-mono font-black text-black -rotate-90 tracking-widest uppercase whitespace-nowrap">
                    {movie.year}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-black/50" />
                </div>

                {/* Sleeve Front Cover */}
                <div className="relative flex-1 h-full overflow-hidden">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    width={300}
                    height={450}
                    loading="lazy"
                    className={`w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105 ${
                      isSelected ? 'brightness-105' : 'brightness-85 saturate-90 group-hover:brightness-100'
                    }`}
                  />
                  {/* Worn paper print texture overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
                    style={{ backgroundImage: 'var(--noise-tex)', backgroundSize: '128px 128px' }}
                    aria-hidden="true"
                  />

                  {/* Corner "TAMIL DUB" Sticker */}
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[var(--paper)] text-[#141210] text-[8px] fan-font-mono font-bold shadow-[2px_2px_0_#000] rotate-2">
                    TAMIL DUB
                  </span>

                  {/* Hidden Handwritten Scribble inside Projector Cone */}
                  <span className="fanverse-projector-secret absolute bottom-2 left-2 right-2 fan-font-note text-sm text-[var(--gold-foil)] drop-shadow">
                    *First TV Watch Memory!*
                  </span>
                </div>
              </div>

              <h4
                className={`mt-2 text-base fan-font-flex uppercase leading-tight transition-colors ${
                  isSelected ? 'text-[var(--gold-foil)]' : 'text-[var(--ink)] group-hover:text-[var(--marvel-red)]'
                }`}
              >
                {movie.title}
              </h4>
              <span className="text-[9.5px] fan-font-mono text-[#9CA3AF] block">
                {movie.year} &bull; TAPE #{String(idx + 1).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ticket + Cassette-Label Hybrid Detail Panel */}
      <div className="mt-4 fan-paper-surface border-2 border-[#151412] p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center relative">
        {/* Left Cassette Spine Title Block */}
        <div className="md:col-span-3 flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src={selected.poster}
              alt={selected.title}
              width={160}
              height={240}
              loading="lazy"
              className="w-16 h-24 sm:w-20 sm:h-28 object-cover object-top border-2 border-[#151412] shadow-[3px_3px_0_#000]"
            />
          </div>
          <div className="min-w-0">
            {/* Gold Foil Highlight Badge */}
            <span
              className="inline-block px-2 py-0.5 mb-1.5 text-[9px] fan-font-mono font-bold text-[#141210] border border-[#785C1C] shadow-[2px_2px_0_#151412]"
              style={{
                background: 'linear-gradient(125deg, #F5E09A 0%, #D9B45B 52%, #B88D30 100%)',
              }}
            >
              {selected.highlightTag}
            </span>
            <h4 className="text-2xl fan-font-flex text-[#11100E] uppercase leading-[0.95] mb-1">
              {selected.title}
            </h4>
            <span className="text-[9.5px] fan-font-mono text-[#443F37] font-bold block leading-snug">
              {selected.availability}
            </span>
          </div>
        </div>

        {/* Right 3 Columns: Sealed Fact + Ticket Memory + Editorial Italic Pull Quote */}
        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-5 border-t-2 md:border-t-0 md:border-l-2 border-dashed border-[#151412]/35 pt-4 md:pt-0 md:pl-6">
          {/* Verified Dubbing Fact with Stamped Seal */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-[9.5px] fan-font-mono font-bold text-[#151412]">
                <Mic2 className="w-3.5 h-3.5 text-[#991B1B]" />
                <span>VERIFIED DUBBING FACT</span>
              </div>
              <span className="fan-rubber-stamp text-[7.5px] px-1.5 py-0 text-[#065F46] -rotate-3">
                SEALED
              </span>
            </div>
            <p className="text-xs fan-font-body text-[#26231F]">
              {selected.dubFact}
            </p>
          </div>

          {/* Theatre Memory Styled as a Mini Ticket Stub */}
          <div className="relative bg-[#DDD4BE] border border-dashed border-[#151412]/55 p-3">
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-[#151412]/20">
              <div className="flex items-center gap-1 text-[9.5px] fan-font-mono font-bold text-[#991B1B]">
                <Clapperboard className="w-3.5 h-3.5" />
                <span>THEATRE MEMORY</span>
              </div>
              <span className="text-[8px] fan-font-mono text-[#4B463D] font-bold">
                ROW F &bull; SEAT 12
              </span>
            </div>
            <p className="text-xs fan-font-body text-[#1B1916]">
              {selected.sceneMemory}
            </p>
          </div>

          {/* Fan Nostalgia Oversized Editorial Italic Quote */}
          <div className="relative pl-4 border-l-4 border-[#B91C1C] flex flex-col justify-center">
            <span
              aria-hidden="true"
              className="fan-font-editorial text-5xl text-[#B91C1C]/35 leading-none select-none -mb-3"
            >
              &ldquo;
            </span>
            <span className="text-[9.5px] fan-font-mono font-bold text-[#991B1B] block mb-1">
              FAN NOSTALGIA
            </span>
            <p className="text-sm sm:text-base fan-font-editorial font-bold text-[#11100E] leading-snug">
              {selected.tanglishNostalgia}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
