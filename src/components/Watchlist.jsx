import React, { useState, useEffect, useMemo } from 'react';
import { WATCHLIST } from '../data/watchlist';
import { loadWatchlistProgress, saveWatchlistProgress, clearWatchlistProgress } from '../utils/storage';
import ProgressBar from './ProgressBar';
import WatchlistItem from './WatchlistItem';
import ResetDialog from './ResetDialog';
import MovieDetailModal from './MovieDetailModal';
import { ChevronRight } from 'lucide-react';

export default function Watchlist() {
  const [progress, setProgress] = useState(() => loadWatchlistProgress());
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);

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
        <div className="text-center mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 border border-[#1E2024] bg-[#111216]/80 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#E62429] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E62429]" />
            ESSENTIAL SAGA CHRONOLOGY
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-cinematic font-bold tracking-wider text-metallic uppercase mb-2">
            YOUR ROAD TO DOOMSDAY
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-[#777A80] uppercase">
            15 CHAPTERS. ONE DESTINATION.
          </p>
        </div>

        {/* Feature 1: Next Watch Highlight Card */}
        <div className="max-w-4xl mx-auto mb-6">
          {nextWatchItem ? (
            <div
              onClick={() => setActiveModalItem(nextWatchItem)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveModalItem(nextWatchItem);
                }
              }}
              className="flex items-center justify-between p-3 xs:p-3.5 sm:p-4 bg-[#111216] border border-[#1E2024] hover:border-[#2D3036] transition-colors duration-200 cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
                {/* Thumbnail */}
                <div className="w-9 xs:w-10 sm:w-12 aspect-[2/3] shrink-0 border border-[#1E2024] overflow-hidden bg-[#08090B]">
                  <img
                    src={nextWatchItem.isMultiSeason ? nextWatchItem.posterSeason1 : nextWatchItem.poster}
                    alt={nextWatchItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Text Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E62429] shrink-0" />
                    <span className="text-[8px] xs:text-[9px] sm:text-[10px] font-mono tracking-[0.18em] text-[#E62429] uppercase font-bold truncate">
                      YOUR NEXT CHAPTER
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
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#777A80] group-hover:text-[#F5F5F5] transition-colors shrink-0 pl-2">
                <span className="hidden sm:inline text-[10px] tracking-widest uppercase">VIEW DETAILS</span>
                <ChevronRight className="w-4 h-4 text-[#777A80] group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ) : (
            /* All 15 Completed state */
            <div className="p-4 sm:p-6 bg-[#111216] border border-[#1E2024] text-center">
              <h3 className="text-sm xs:text-base sm:text-lg font-cinematic font-bold tracking-widest text-[#F5F5F5] uppercase mb-1">
                YOU ARE READY FOR DOOMSDAY.
              </h3>
              <p className="text-[10px] sm:text-[11px] font-mono text-[#777A80] tracking-wider uppercase">
                All 15 cinematic chapters completed. The Multiverse war awaits.
              </p>
            </div>
          )}
        </div>

        {/* Feature 2 & 6: Enhanced Progress Bar + Share Action */}
        <div className="max-w-4xl mx-auto">
          <ProgressBar
            watchedCount={watchedCount}
            totalCount={WATCHLIST.length}
            onResetClick={() => setIsResetOpen(true)}
          />
        </div>

        {/* ── Movie Poster Watchlist Grid (Optimized for all viewports from 320px mobile to 4K desktop) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 xs:gap-3.5 sm:gap-4 lg:gap-5 max-w-7xl mx-auto mt-6 sm:mt-8">
          {WATCHLIST.map((item) => {
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
