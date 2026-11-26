import React, { useState } from 'react';
import { GitBranch, Eye, Link2, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div id="fanverse-timeline" className="mb-12 sm:mb-16 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <GitBranch className="w-3.5 h-3.5 text-[#22C55E]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#4ADE80] uppercase">
              04 // INTERACTIVE SACRED &amp; MULTIVERSE CONNECTIONS
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase tracking-tight">
            MULTIVERSE CONNECTIONS
          </h3>
          <p className="text-xs sm:text-sm font-body text-[#9CA3AF] mt-0.5">
            &ldquo;Indha connection-a first time paakumbodhu miss panniruppinga!&rdquo; — Step-by-step visual timeline from 2000 X-Men to Doomsday!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => stepNode(-1)}
            aria-label="Previous Timeline Node"
            className="w-9 h-9 border border-white/[0.12] hover:border-[#22C55E] bg-[#0B0D12] text-[#D8D9DC] hover:text-white rounded-[2px] inline-flex items-center justify-center cursor-pointer transition-colors"
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
            className="w-9 h-9 border border-white/[0.12] hover:border-[#22C55E] bg-[#0B0D12] text-[#D8D9DC] hover:text-white rounded-[2px] inline-flex items-center justify-center cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Branching Node Track */}
      <div className="relative mb-5 pt-2">
        <div className="hidden md:block absolute top-[26px] left-6 right-6 h-[2px] bg-white/[0.08]">
          <div
            className="h-full bg-gradient-to-r from-[#E62429] via-[#22C55E] to-[#38BDF8] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 relative z-10">
          {MULTIVERSE_CONNECTIONS_TIMELINE.map((node, i) => {
            const isSelected = i === activeIndex;
            const isPast = i < activeIndex;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch {}
                  setActiveIndex(i);
                }}
                className={`p-3 text-left rounded-[3px] border transition-all cursor-pointer flex flex-col gap-1 ${
                  isSelected
                    ? 'border-[#22C55E] bg-[#0B1710] shadow-[0_0_24px_rgba(34,197,94,0.16)]'
                    : isPast
                      ? 'border-[#22C55E]/30 bg-[#0A0E12] text-[#D8D9DC]'
                      : 'border-white/[0.08] bg-[#0A0C10] hover:border-white/25 text-[#9CA3AF]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full border ${
                      isSelected
                        ? 'bg-[#22C55E] border-[#86EFAC] shadow-[0_0_8px_#22C55E]'
                        : isPast
                          ? 'bg-[#22C55E]/60 border-[#22C55E]'
                          : 'bg-[#11141B] border-white/25'
                    }`}
                  />
                  <span className="text-[9px] font-mono text-[#8C9098]">{node.era}</span>
                </div>
                <span className="text-[8.5px] font-mono tracking-wider text-[#4ADE80] uppercase mt-1 truncate">
                  {node.saga}
                </span>
                <span className="text-[11px] font-cinematic font-bold text-white leading-tight line-clamp-2">
                  {node.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Connection Breakdown Panel */}
      <div className="border border-white/[0.1] bg-[#090B10] rounded-[3px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl">
        {/* Visual Frame */}
        <div className="lg:col-span-4 relative min-h-[220px] bg-black overflow-hidden">
          <img
            key={current.id}
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090B10] via-[#090B10]/25 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#090B10]" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 bg-black/80 border border-[#22C55E]/50 text-[#4ADE80] text-[9px] font-mono font-bold uppercase rounded-[2px]">
              {current.earth}
            </span>
          </div>
        </div>

        {/* Tanglish Connection & Easter Egg Readout */}
        <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[9.5px] font-mono font-bold tracking-[0.2em] text-[#E62429] uppercase">
                {current.era} // {current.saga}
              </span>
              <span className="text-[9.5px] font-mono text-[#777A80]">• {current.movieRef}</span>
            </div>
            <h4 className="text-lg sm:text-2xl font-cinematic font-black text-white uppercase mb-2.5">
              {current.title}
            </h4>
            <p className="text-xs sm:text-sm font-body text-[#D1D5DB] leading-relaxed">
              {current.tanglishSummary}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-white/[0.08]">
            <div className="p-3.5 bg-[#0D1117] border border-[#22C55E]/25 rounded-[2px]">
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider text-[#4ADE80] uppercase mb-1">
                <Link2 className="w-3.5 h-3.5" />
                <span>DOOMSDAY BRIDGE</span>
              </div>
              <p className="text-xs font-body text-[#C8CDD6] leading-relaxed">
                {current.connectionPoint}
              </p>
            </div>

            <div className="p-3.5 bg-[#0D1117] border border-[#F59E0B]/25 rounded-[2px]">
              <div className="flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-wider text-[#FCD34D] uppercase mb-1">
                <Eye className="w-3.5 h-3.5" />
                <span>HIDDEN EASTER EGG</span>
              </div>
              <p className="text-xs font-body text-[#C8CDD6] leading-relaxed">
                {current.easterEgg}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
