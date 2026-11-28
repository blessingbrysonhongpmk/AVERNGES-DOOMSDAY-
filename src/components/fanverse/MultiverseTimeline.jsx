import React, { useState } from 'react';
import { Eye, Link2, ChevronLeft, ChevronRight } from 'lucide-react';
import { MULTIVERSE_CONNECTIONS_TIMELINE } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

export default function MultiverseTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = MULTIVERSE_CONNECTIONS_TIMELINE[activeIndex];

  const stepNode = (delta) => {
    try { clockAudio.tick(0); } catch { }
    setActiveIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return MULTIVERSE_CONNECTIONS_TIMELINE.length - 1;
      if (next >= MULTIVERSE_CONNECTIONS_TIMELINE.length) return 0;
      return next;
    });
  };

  return (
    <div id="fanverse-timeline" className="scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
        <div>
          <span className="text-[10.5px] fan-font-mono font-bold text-[var(--marvel-red)] block mb-0.5">
            35MM REEL STRIP // SACRED TIMELINE TO DOOMSDAY COLLISION
          </span>
          <h4 className="text-2xl sm:text-3xl fan-font-flex text-[var(--ink)] uppercase leading-none">
            MULTIVERSE CONNECTIONS
          </h4>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => stepNode(-1)}
            aria-label="Previous Timeline Node"
            className="fan-btn-tactile w-8 h-8 border border-white/25 bg-[#151515] text-white inline-flex items-center justify-center cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] fan-font-mono text-[#D5D1C8] px-2">
            FRAME 0{activeIndex + 1} / 0{MULTIVERSE_CONNECTIONS_TIMELINE.length}
          </span>
          <button
            type="button"
            onClick={() => stepNode(1)}
            aria-label="Next Timeline Node"
            className="fan-btn-tactile w-8 h-8 border border-white/25 bg-[#151515] text-white inline-flex items-center justify-center cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 35mm Film Strip with Top/Bottom Sprocket Holes & Active Red Playhead */}
      <div className="relative mb-6 bg-[#0B0C10] border-2 border-white/15 shadow-[5px_5px_0_#000]">
        <div className="fan-sprocket-rail border-b border-white/10 bg-[#14161D]" aria-hidden="true" />

        <div className="fan-reel-scrollbar flex md:grid md:grid-cols-6 overflow-x-auto divide-x divide-white/15 snap-x snap-mandatory scroll-smooth">
          {MULTIVERSE_CONNECTIONS_TIMELINE.map((node, i) => {
            const isSelected = i === activeIndex;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch { }
                  setActiveIndex(i);
                }}
                className={`relative min-w-[165px] md:min-w-0 snap-start p-3.5 text-left overflow-hidden cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#1D1012] text-white'
                    : 'bg-[#0C0D12] hover:bg-[#14161F] text-[#9CA3AF]'
                }`}
              >
                {/* Red Playhead Needle Over Active Film Frame */}
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-[3px] bg-[var(--marvel-red)] z-20"
                  />
                )}

                {/* Outlined Year Numeral Behind Frame Title */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none select-none block text-4xl sm:text-5xl fan-font-flex leading-none -mb-4"
                  style={{
                    color: 'transparent',
                    WebkitTextStroke: isSelected ? '1px rgba(228,38,44,0.65)' : '1px rgba(242,239,232,0.16)',
                  }}
                >
                  {node.era}
                </span>

                <div className="relative z-10">
                  <span className="text-[8.5px] fan-font-mono font-bold text-[var(--gold-foil)] block mb-0.5">
                    {node.era} &bull; #{String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm sm:text-base fan-font-flex text-[var(--ink)] uppercase block leading-tight line-clamp-2">
                    {node.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="fan-sprocket-rail border-t border-white/10 bg-[#14161D]" aria-hidden="true" />
      </div>

      {/* Theatre Projector Screen Panel with 250ms Light Flicker on Frame Switch */}
      <div
        key={current.id}
        className="fan-projector-flicker relative bg-[#101218] border-2 border-white/15 shadow-[6px_6px_0_#000] overflow-hidden grid grid-cols-1 lg:grid-cols-12"
      >
        <div className="lg:col-span-4 relative min-h-[220px] bg-black">
          <img
            src={current.image}
            alt={current.title}
            width={480}
            height={360}
            loading="lazy"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101218] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#101218]" />
          <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-[var(--paper)] text-[#141210] text-[9.5px] fan-font-mono font-bold shadow-[2px_2px_0_#000]">
            {current.earth}
          </span>
        </div>

        <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] fan-font-mono font-bold text-[var(--doom-green)]">
                {current.era} &bull; {current.saga}
              </span>
              <span className="text-[10px] fan-font-mono text-[#9CA3AF]">{current.movieRef}</span>
            </div>
            <h5 className="text-2xl sm:text-3xl fan-font-flex text-[var(--ink)] uppercase mb-2 leading-none">
              {current.title}
            </h5>
            <p className="text-xs sm:text-sm fan-font-body text-[#D5D1C8]">
              {current.tanglishSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/15">
            <div className="border-l-2 border-[var(--marvel-red)] pl-3">
              <div className="flex items-center gap-1.5 text-[9.5px] fan-font-mono font-bold text-[var(--ink)] mb-1">
                <Link2 className="w-3.5 h-3.5 text-[var(--marvel-red)]" />
                <span>DOOMSDAY BRIDGE</span>
              </div>
              <p className="text-xs fan-font-body text-[#B8B4AC]">
                {current.connectionPoint}
              </p>
            </div>

            <div className="border-l-2 border-[var(--gold-foil)] pl-3">
              <div className="flex items-center gap-1.5 text-[9.5px] fan-font-mono font-bold text-[var(--gold-foil)] mb-1">
                <Eye className="w-3.5 h-3.5" />
                <span>HIDDEN EASTER EGG</span>
              </div>
              <p className="text-xs fan-font-body text-[#B8B4AC]">
                {current.easterEgg}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
