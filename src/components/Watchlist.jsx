import React, { useState, useEffect, useMemo } from 'react';
import { WATCHLIST } from '../data/watchlist';
import { loadWatchlistProgress, saveWatchlistProgress, clearWatchlistProgress } from '../utils/storage';
import ProgressBar from './ProgressBar';
import WatchlistItem from './WatchlistItem';
import ResetDialog from './ResetDialog';
import MovieDetailModal from './MovieDetailModal';
import { ChevronRight, Sparkles, LayoutGrid, GitCommit } from 'lucide-react';
import { clockAudio } from '../utils/audio.js';

export default function Watchlist() {
  const [progress, setProgress] = useState(() => loadWatchlistProgress());
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [sagaFilter, setSagaFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'timeline'

  useEffect(() => {
    saveWatchlistProgress(progress);
  }, [progress]);

  const handleToggleStandard = (id) => {
    setProgress((prev) => ({
      ...prev,
      [id]: { ...prev[id], completed: !(prev[id]?.completed) },
    }));
  };

  const handleToggleLokiSeason = (seasonId) => {
    setProgress((prev) => {
      const loki = prev['loki-series'] || {};
      const updatedS1 = seasonId === 's1' ? !loki.season1 : !!loki.season1;
      const updatedS2 = seasonId === 's2' ? !loki.season2 : !!loki.season2;
      return {
        ...prev,
        'loki-series': {
          season1: updatedS1,
          season2: updatedS2,
          completed: updatedS1 && updatedS2,
        },
      };
    });
  };

  const handleConfirmReset = () => {
    clearWatchlistProgress();
    setProgress({});
    setIsResetOpen(false);
  };

  // Watched count calculation (Loki only completed if both S1 and S2 checked)
  const watchedCount = useMemo(() => {
    let count = 0;
    for (const item of WATCHLIST) {
      if (item.isMultiSeason) {
        const loki = progress['loki-series'];
        if (loki?.season1 && loki?.season2) count++;
      } else {
        if (progress[item.id]?.completed) count++;
      }
    }
    return count;
  }, [progress]);

  // Feature 1: Intelligent Next Watch
  const nextWatchItem = useMemo(() => {
    for (const item of WATCHLIST) {
      if (item.isMultiSeason) {
        const loki = progress['loki-series'];
        if (!(loki?.season1 && loki?.season2)) {
          return item;
        }
      } else {
        if (!progress[item.id]?.completed) {
          return item;
        }
      }
    }
    return null;
  }, [progress]);

  // Filtered chapters for Road to Doomsday
  const filteredChapters = useMemo(() => {
    return WATCHLIST.filter((item, idx) => {
      const num = parseInt(item.number, 10);
      const isLoki = item.isMultiSeason;
      const lokiData = progress['loki-series'];
      const isItemCompleted = isLoki
        ? !!(lokiData?.season1 && lokiData?.season2)
        : !!progress[item.id]?.completed;

      if (sagaFilter === 'UNWATCHED') return !isItemCompleted;
      if (sagaFilter === 'INFINITY') return num >= 1 && num <= 6;
      if (sagaFilter === 'MULTIVERSE') return num >= 7 && num <= 11;
      if (sagaFilter === 'INCURSION') return num >= 12 && num <= 15;
      return true;
    });
  }, [sagaFilter, progress]);

  // Active item completion state for the modal
  const isModalItemCompleted = activeModalItem
    ? activeModalItem.isMultiSeason
      ? !!(progress['loki-series']?.season1 && progress['loki-series']?.season2)
      : !!progress[activeModalItem.id]?.completed
    : false;

  const modalLokiSeasons = activeModalItem?.isMultiSeason
    ? {
      s1: !!progress['loki-series']?.season1,
      s2: !!progress['loki-series']?.season2,
    }
    : null;

  return (
    <section
      id="watchlist"
      aria-label="Road to Doomsday Watchlist"
      className="relative z-10 bg-[#08090B] border-t border-[#1E2024] px-3 sm:px-6 lg:px-10 xl:px-16 py-14 sm:py-20"
    >
      <div className="container-fluid container-xl mx-auto px-0">
        
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 border border-[#1E2024] bg-[#111216]/80 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#E62429] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E62429]" />
            THE MULTIVERSE ROADMAP // 15 CHRONICLES
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-cinematic font-black tracking-wider text-metallic uppercase mb-2">
            YOUR ROAD TO DOOMSDAY
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-[#777A80] uppercase">
            15 CHAPTERS. AN EXPANDING TIMELINE. ONE INEVITABLE APEX.
          </p>
        </div>

        {/* Feature 1: Next Watch Highlight Card with Incursion Pulse */}
        <div className="max-w-4xl mx-auto mb-6">
          {nextWatchItem ? (
            <div
              onClick={() => {
                setActiveModalItem(nextWatchItem);
                try { clockAudio.tick(0); } catch (e) {}
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveModalItem(nextWatchItem);
                }
              }}
              className="flex items-center justify-between p-3 xs:p-3.5 sm:p-4 bg-[#111216] border border-[#E62429]/60 hover:border-[#E62429] transition-all duration-300 cursor-pointer group shadow-[0_0_25px_rgba(230,36,41,0.2)] incursion-pulse"
            >
              <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                {/* Thumbnail */}
                <div className="w-9 xs:w-10 sm:w-12 aspect-[2/3] shrink-0 border border-[#E62429]/50 overflow-hidden bg-[#08090B] shadow">
                  <img
                    src={nextWatchItem.isMultiSeason ? nextWatchItem.posterSeason1 : nextWatchItem.poster}
                    alt={nextWatchItem.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                </div>

                {/* Text Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E62429] shrink-0 animate-ping" />
                    <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-mono tracking-[0.18em] text-[#E62429] uppercase font-bold truncate">
                      ACTIVE MISSION // NEXT CHAPTER
                    </span>
                    <span className="text-[10px] font-mono text-[#44474E] hidden sm:inline">•</span>
                    <span className="text-[10px] font-mono text-[#777A80] hidden sm:inline">
                      CHAPTER {nextWatchItem.number}
                    </span>
                  </div>
                  <h3 className="text-xs xs:text-sm sm:text-base font-cinematic font-bold text-[#F5F5F5] group-hover:text-white transition-colors truncate">
                    {nextWatchItem.title}
                  </h3>
                </div>
              </div>

              {/* Right arrow callout */}
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#777A80] group-hover:text-white transition-colors shrink-0 pl-2">
                <span className="hidden sm:inline text-[10px] tracking-widest uppercase font-bold text-[#E62429]">INITIALIZE BRIEFING</span>
                <ChevronRight className="w-4 h-4 text-[#E62429] group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ) : (
            /* All 15 Completed state */
            <div className="p-4 sm:p-6 bg-[#0E1310] border border-[#22C55E]/60 text-center shadow-[0_0_30px_rgba(34,197,94,0.25)]">
              <h3 className="text-sm xs:text-base sm:text-lg font-cinematic font-bold tracking-widest text-[#22C55E] uppercase mb-1">
                ✓ MISSION READY: YOU HAVE ASSEMBLED ALL 15 CHAPTERS
              </h3>
              <p className="text-[10px] sm:text-[11px] font-mono text-[#777A80] tracking-wider uppercase">
                All 15 cinematic milestones completed. The Multiverse war for Doomsday awaits.
              </p>
            </div>
          )}
        </div>

        {/* Feature 2 & 6: Enhanced Progress Bar + Share Action */}
        <div className="max-w-4xl mx-auto mb-8">
          <ProgressBar
            watchedCount={watchedCount}
            totalCount={WATCHLIST.length}
            onResetClick={() => setIsResetOpen(true)}
          />
        </div>

        {/* ── SAGA CHRONOLOGY NAVIGATION & VIEW TOGGLE ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto mb-6 pb-4 border-b border-[#1E2024]">
          {/* Phase Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {[
              { id: 'ALL', label: 'ALL 15', count: 15 },
              { id: 'INFINITY', label: 'INFINITY SAGA (01-06)', count: 6 },
              { id: 'MULTIVERSE', label: 'MULTIVERSE DAWN (07-11)', count: 5 },
              { id: 'INCURSION', label: 'INCURSION CORE (12-15)', count: 4 },
              { id: 'UNWATCHED', label: 'UNWATCHED', count: 15 - watchedCount },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSagaFilter(p.id);
                  try { clockAudio.tick(0); } catch (e) {}
                }}
                className={`px-2.5 xs:px-3 py-1 text-[9px] xs:text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
                  sagaFilter === p.id
                    ? 'border-[#E62429] bg-[#E62429]/20 text-white shadow-[0_0_10px_rgba(230,36,41,0.3)] font-bold'
                    : 'border-[#1E2024] bg-[#111216]/60 text-[#777A80] hover:text-[#D8D9DC] hover:border-[#2D3036]'
                }`}
              >
                {p.label} <span className="opacity-60 text-[8px]">({p.count})</span>
              </button>
            ))}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 border border-[#1E2024] bg-[#111216] p-0.5 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-1 text-[9px] font-mono tracking-wider flex items-center gap-1 uppercase transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#E62429] text-white font-bold' : 'text-[#777A80] hover:text-white'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3 h-3" />
              <span>GRID</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`px-2.5 py-1 text-[9px] font-mono tracking-wider flex items-center gap-1 uppercase transition-colors cursor-pointer ${
                viewMode === 'timeline' ? 'bg-[#E62429] text-white font-bold' : 'text-[#777A80] hover:text-white'
              }`}
              title="Timeline Runway View"
            >
              <GitCommit className="w-3 h-3" />
              <span>TIMELINE RUNWAY</span>
            </button>
          </div>
        </div>

        {/* ── VIEW 1: CREATIVE GRID DISPLAY (5 cols on xl, 4 on lg, 3 on sm, 2 on xs) ── */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 xs:gap-3.5 sm:gap-4 lg:gap-5 max-w-7xl mx-auto">
            {filteredChapters.map((item) => {
              const isLoki = item.isMultiSeason;
              const lokiData = progress['loki-series'];
              const isItemCompleted = isLoki
                ? !!(lokiData?.season1 && lokiData?.season2)
                : !!progress[item.id]?.completed;

              return (
                <WatchlistItem
                  key={item.id}
                  item={item}
                  isCompleted={isItemCompleted}
                  lokiSeasons={isLoki ? { s1: !!lokiData?.season1, s2: !!lokiData?.season2 } : null}
                  isNextWatch={item.id === nextWatchItem?.id}
                  onToggleStandard={handleToggleStandard}
                  onToggleLokiSeason={handleToggleLokiSeason}
                  onOpenDetails={setActiveModalItem}
                />
              );
            })}
          </div>
        ) : (
          /* ── VIEW 2: VISUAL TIMELINE RUNWAY ── */
          <div className="max-w-5xl mx-auto py-4">
            <div className="relative pl-6 sm:pl-10 space-y-6 sm:space-y-8">
              {/* Glowing Timeline Central Spine */}
              <div className="absolute top-2 bottom-2 left-2.5 sm:left-4 w-1 timeline-track-glow rounded-full" />

              {filteredChapters.map((item, index) => {
                const isLoki = item.isMultiSeason;
                const lokiData = progress['loki-series'];
                const isItemCompleted = isLoki
                  ? !!(lokiData?.season1 && lokiData?.season2)
                  : !!progress[item.id]?.completed;
                const isNext = item.id === nextWatchItem?.id;

                return (
                  <div key={item.id} className="relative flex items-center gap-4 group">
                    {/* Glowing Node on Spine */}
                    <div
                      className={`absolute -left-6 sm:-left-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-mono font-bold transition-all duration-300 z-10 ${
                        isItemCompleted
                          ? 'border-[#22C55E] bg-[#0E1310] text-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.6)]'
                          : isNext
                          ? 'border-[#E62429] bg-[#E62429] text-white shadow-[0_0_15px_rgba(230,36,41,0.8)] incursion-pulse'
                          : 'border-[#3A3D45] bg-[#111216] text-[#777A80]'
                      }`}
                    >
                      {isItemCompleted ? '✓' : item.number}
                    </div>

                    {/* Timeline Runway Card */}
                    <div
                      onClick={() => {
                        setActiveModalItem(item);
                        try { clockAudio.tick(0); } catch (e) {}
                      }}
                      className={`grow flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-[#111216] border cursor-pointer transition-all duration-300 shimmer-card ${
                        isItemCompleted
                          ? 'border-[#22C55E]/40 hover:border-[#22C55E]'
                          : isNext
                          ? 'border-[#E62429] bg-[#161214] shadow-[0_0_20px_rgba(230,36,41,0.25)]'
                          : 'border-[#1E2024] hover:border-[#3A3D45]'
                      }`}
                    >
                      {/* Left: Thumbnail & Title */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img
                          src={isLoki ? item.posterSeason1 : item.poster}
                          alt={item.title}
                          className="w-10 sm:w-14 aspect-[2/3] object-cover border border-[#1E2024] shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 text-[9px] font-mono text-[#777A80] uppercase mb-0.5">
                            <span>CH. {item.number}</span>
                            <span>•</span>
                            <span>{item.year}</span>
                            <span>•</span>
                            <span className="text-[#E62429] font-bold">{item.type}</span>
                          </div>
                          <h4 className="text-xs sm:text-base font-cinematic font-bold text-white group-hover:text-white transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-[10px] sm:text-xs font-body text-[#777A80] line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Status Stamp */}
                      <div className="mt-2 sm:mt-0 flex items-center gap-3 shrink-0 self-end sm:self-center">
                        <span className={`text-[9px] font-mono tracking-wider px-2 py-0.5 uppercase font-bold border ${
                          isItemCompleted
                            ? 'text-[#22C55E] border-[#22C55E]/40 bg-[#22C55E]/10'
                            : isNext
                            ? 'text-[#E62429] border-[#E62429]/40 bg-[#E62429]/10'
                            : 'text-[#777A80] border-[#1E2024]'
                        }`}>
                          {isItemCompleted ? '✓ COMPLETED' : isNext ? 'NEXT UP' : 'PENDING'}
                        </span>
                        <ChevronRight className="w-4 h-4 text-[#777A80] group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Destination Point: DOOMSDAY */}
              <div className="relative flex items-center gap-4 pt-4">
                <div className="absolute -left-6 sm:-left-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-[#E62429] bg-[#E62429] text-white flex items-center justify-center text-xs font-bold shadow-[0_0_20px_rgba(230,36,41,0.9)] animate-pulse z-10">
                  Ω
                </div>
                <div className="grow p-4 bg-gradient-to-r from-[#181113] to-[#111216] border border-[#E62429]/80 shadow-2xl">
                  <div className="text-[10px] font-mono tracking-widest text-[#E62429] uppercase font-bold">
                    DESTINATION // THE APEX OF REALITIES
                  </div>
                  <h3 className="text-sm sm:text-lg font-cinematic font-black text-white uppercase">
                    AVENGERS: DOOMSDAY — 18 DECEMBER 2026
                  </h3>
                  <p className="text-xs text-[#777A80] mt-0.5">
                    The Multiverse collapses. The Fantastic Four, Avengers, and Thunderbolts confront Victor von Doom.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Feature 3: Interactive Movie Detail Modal */}
      <MovieDetailModal
        item={activeModalItem}
        isOpen={!!activeModalItem}
        onClose={() => setActiveModalItem(null)}
        isCompleted={isModalItemCompleted}
        lokiSeasons={modalLokiSeasons}
        onToggleStandard={handleToggleStandard}
        onToggleLokiSeason={handleToggleLokiSeason}
      />

      {/* Reset Confirmation Dialog */}
      <ResetDialog
        isOpen={isResetOpen}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetOpen(false)}
      />
    </section>
  );
}
