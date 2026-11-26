import React, { useState } from 'react';
import { Eye, Link2, ChevronLeft, ChevronRight } from 'lucide-react';
import { MULTIVERSE_CONNECTIONS_TIMELINE } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

export default function MultiverseTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = MULTIVERSE_CONNECTIONS_TIMELINE[activeIndex];
  const progressPct = ((activeIndex + 1) / MULTIVERSE_CONNECTIONS_TIMELINE.length) * 100;

  const stepNode = (delta) => {
    try { clockAudio.tick(0); } catch {}
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
          <span className="text-[10.5px] font-hud font-bold tracking-[0.24em] text-[#E62429] uppercase block mb-0.5">
            SACRED TIMELINE TO DOOMSDAY COLLISION
          </span>
          <h4 className="text-xl sm:text-2xl font-hud font-extrabold text-white uppercase tracking-wide">
            MULTIVERSE CONNECTIONS
          </h4>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => stepNode(-1)}
            aria-label="Previous Timeline Node"
            className="w-8 h-8 border border-white/15 hover:border-white bg-[#151515] text-white inline-flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono text-[#9CA3AF] px-2 tabular-nums">
            0{activeIndex + 1} / 0{MULTIVERSE_CONNECTIONS_TIMELINE.length}
          </span>
          <button
            type="button"
            onClick={() => stepNode(1)}
            aria-label="Next Timeline Node"
            className="w-8 h-8 border border-white/15 hover:border-white bg-[#151515] text-white inline-flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Branch Rail */}
      <div className="relative mb-5">
        <div className="hidden md:block h-[2px] w-full bg-white/10 mb-3">
          <div
            className="h-full bg-[#E62429] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {MULTIVERSE_CONNECTIONS_TIMELINE.map((node, i) => {
            const isSelected = i === activeIndex;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch {}
                  setActiveIndex(i);
                }}
                className={`p-3 text-left border-t-2 transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#E62429] bg-[#16171E] text-white'
                    : 'border-white/15 bg-[#101116] hover:border-white/40 text-[#9CA3AF]'
                }`}
              >
                <span className="text-[9px] font-mono text-[#E62429] block mb-0.5">{node.era}</span>
                <span className="text-xs font-hud font-bold text-white uppercase tracking-wide block leading-tight line-clamp-2">
                  {node.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Split Story Breakdown */}
      <div className="marvel-chamfer bg-[#121318] border border-white/[0.08] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 relative min-h-[220px] bg-black">
          <img
            key={current.id}
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#121318]" />
          <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/80 border-l-2 border-[#E62429] text-white text-[9.5px] font-mono uppercase">
            {current.earth}
          </span>
        </div>

        <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-hud font-bold tracking-[0.2em] text-[#E62429] uppercase">
                {current.era} • {current.saga}
              </span>
              <span className="text-[10px] font-mono text-[#777A80]">{current.movieRef}</span>
            </div>
            <h5 className="text-lg sm:text-2xl font-hud font-extrabold text-white uppercase tracking-wide mb-2">
              {current.title}
            </h5>
            <p className="text-xs sm:text-sm font-body text-[#D1D5DB] leading-relaxed">
              {current.tanglishSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.08]">
            <div className="border-l-2 border-[#E62429] pl-3">
              <div className="flex items-center gap-1.5 text-[10px] font-hud font-bold tracking-wider text-white uppercase mb-1">
                <Link2 className="w-3.5 h-3.5 text-[#E62429]" />
                <span>DOOMSDAY BRIDGE</span>
              </div>
              <p className="text-xs font-body text-[#B4B9C2] leading-relaxed">
                {current.connectionPoint}
              </p>
            </div>

            <div className="border-l-2 border-white/25 pl-3">
              <div className="flex items-center gap-1.5 text-[10px] font-hud font-bold tracking-wider text-white uppercase mb-1">
                <Eye className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>HIDDEN EASTER EGG</span>
              </div>
              <p className="text-xs font-body text-[#B4B9C2] leading-relaxed">
                {current.easterEgg}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
