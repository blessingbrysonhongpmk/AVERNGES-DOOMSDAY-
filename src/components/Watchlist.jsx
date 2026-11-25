import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WATCHLIST } from '../data/watchlist';
import { loadWatchlistProgress, saveWatchlistProgress, clearWatchlistProgress } from '../utils/storage';
import ResetDialog from './ResetDialog';
import MovieDetailModal from './MovieDetailModal';
import { ChevronRight, ChevronLeft, Share2, Download, RotateCcw, Check, LayoutGrid, Layers, Film } from 'lucide-react';
import { clockAudio } from '../utils/audio.js';
import CinematicAtmosphere from './CinematicAtmosphere';
import WatchlistItem from './WatchlistItem';

export default function Watchlist() {
  const [progress, setProgress] = useState(() => loadWatchlistProgress());
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [viewMode, setViewMode] = useState('carousel'); // 'carousel' | 'grid' | 'timeline'
  const [sagaFilter, setSagaFilter] = useState('ALL');
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    saveWatchlistProgress(progress);
  }, [progress]);

  const handleToggleStandard = (id) => {
    try { clockAudio.tick(0); } catch (e) {}
    setProgress((prev) => ({
      ...prev,
      [id]: { ...prev[id], completed: !(prev[id]?.completed) },
    }));
  };

  const handleToggleLokiSeason = (seasonId) => {
    try { clockAudio.tick(0); } catch (e) {}
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
    try { clockAudio.tick(0); } catch (e) {}
    clearWatchlistProgress();
    setProgress({});
    setIsResetOpen(false);
  };

  // Watched count calculation
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

  const totalCount = WATCHLIST.length;
  const percentage = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;
  const remainingCount = Math.max(0, totalCount - watchedCount);

  // Carousel scroll navigation
  const scrollCarousel = (direction) => {
    try { clockAudio.tick(0); } catch (e) {}
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Share Progress text
  const shareText = `AVENGERS: DOOMSDAY COUNTDOWN\n\nMy Road to Doomsday:\n${watchedCount} / ${totalCount} Chapters Completed.\n\n${percentage}% Ready.\n\nTHE COUNTDOWN HAS BEGUN.`;

  const handleShare = async () => {
    try { clockAudio.tick(0); } catch (e) {}
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'AVENGERS: DOOMSDAY — THE COUNTDOWN',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  // Downloadable progress graphic using HTML5 Canvas
  const handleDownloadGraphic = () => {
    try {
      clockAudio.tick(0);
      setDownloading(true);
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark cinematic background
      ctx.fillStyle = '#08090B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle emerald vignette
      const radial = ctx.createRadialGradient(600, 200, 50, 600, 200, 500);
      radial.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
      radial.addColorStop(1, 'rgba(8, 9, 11, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#1E2024';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      ctx.fillStyle = '#8C9098';
      ctx.font = '600 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MARVEL CINEMATIC UNIVERSE', 600, 110);

      ctx.fillStyle = '#F5F5F5';
      ctx.font = '900 60px "Cinzel", Georgia, serif';
      ctx.fillText('AVENGERS: DOOMSDAY', 600, 190);

      ctx.fillStyle = '#8C9098';
      ctx.font = '500 16px monospace';
      ctx.fillText('ROAD TO DOOMSDAY // PROGRESS REPORT', 600, 235);

      ctx.fillStyle = '#F5F5F5';
      ctx.font = '700 48px monospace';
      ctx.fillText(`${watchedCount} / ${totalCount} COMPLETED`, 600, 330);

      ctx.fillStyle = '#22C55E';
      ctx.font = '600 22px monospace';
      ctx.fillText(`${percentage}% READY  •  ${remainingCount} CHAPTERS REMAINING`, 600, 375);

      // Bar
      ctx.fillStyle = '#111216';
      ctx.fillRect(200, 425, 800, 10);
      ctx.fillStyle = '#22C55E';
      ctx.fillRect(200, 425, 800 * (percentage / 100), 10);

      ctx.fillStyle = '#55585E';
      ctx.font = '400 14px monospace';
      ctx.fillText('18 DECEMBER 2026  •  EVERYTHING LEADS TO DOOMSDAY', 600, 510);

      const link = document.createElement('a');
      link.download = `Avengers-Doomsday-Road-${percentage}pct.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  // Filtered items
  const filteredWatchlist = useMemo(() => {
    return WATCHLIST.filter((item) => {
      const num = parseInt(item.number, 10);
      const isItemCompleted = item.isMultiSeason
        ? !!(progress['loki-series']?.season1 && progress['loki-series']?.season2)
        : !!progress[item.id]?.completed;

      if (sagaFilter === 'UNWATCHED') return !isItemCompleted;
      if (sagaFilter === 'INFINITY') return num >= 1 && num <= 6;
      if (sagaFilter === 'MULTIVERSE') return num >= 7 && num <= 11;
      if (sagaFilter === 'INCURSION') return num >= 12 && num <= 15;
      return true;
    });
  }, [sagaFilter, progress]);

  return (
    <section
      id="watchlist"
      aria-label="Road to Doomsday Watchlist"
      className="relative z-10 bg-[#08090B] border-t border-[#1E2024] px-3 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden"
    >
      {/* Background Cinematic Atmosphere */}
      <CinematicAtmosphere
        poster="/doomsday-ensemble-poster.jpg"
        overlayOpacity="bg-[#08090B]/92"
        accentGlow="emerald"
      />

      <div className="container-fluid container-xl mx-auto px-0 relative z-10">
        
        {/* ═════════════════════════════════════════════════════════════════════
            INSPIRED ROAD TO DOOMSDAY MODULE (Matching Reference Layout)
            Left: Title, Stats (Watched 4/15, 27% Complete), Green Bar, Action Buttons
            Right: Horizontal Movie Cards Carousel with Green Glowing Arrows
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="border border-[#1E252D] bg-[#0A0C10]/95 rounded-xs p-4 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] mb-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* ── LEFT COLUMN: TITLE & PROGRESS CONTROL PANEL ── */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              
              <div>
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-cinematic font-black tracking-tight text-white uppercase mb-1">
                  YOUR ROAD TO DOOMSDAY
                </h2>
                <p className="text-xs sm:text-sm font-mono tracking-widest text-[#8C9098] uppercase mb-5">
                  15 CHAPTERS. ONE DESTINATION.
                </p>

                {/* Progress Stats Row */}
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono tracking-wider mb-2">
                  <span className="text-white font-bold">
                    WATCHED: <span className="text-white font-sans font-bold">{watchedCount}</span> / {totalCount}
                  </span>
                  <span className="text-[#22C55E] font-bold font-mono text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">
                    {percentage}% COMPLETE
                  </span>
                </div>

                {/* Glowing Emerald Progress Bar */}
                <div className="w-full h-3 bg-[#111318] border border-[#232731] rounded-full overflow-hidden p-0.5 mb-5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#10B981] via-[#22C55E] to-[#00FF88] rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(34,197,94,0.8)]"
                    style={{ width: `${Math.max(percentage, 4)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons Row (Share Progress, Graphic, Reset) */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1E252D]/70">
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3.5 py-2 bg-[#12141A] hover:bg-[#1A1C24] border border-[#232731] hover:border-white/40 text-white text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>{copied ? 'COPIED!' : 'SHARE PROGRESS'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadGraphic}
                  disabled={downloading}
                  className="px-3.5 py-2 bg-[#12141A] hover:bg-[#1A1C24] border border-[#232731] hover:border-white/40 text-white text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>{downloading ? 'EXPORTING...' : 'GRAPHIC'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsResetOpen(true)}
                  className="px-3.5 py-2 bg-[#12141A] hover:bg-[#1A1C24] border border-[#232731] hover:border-[#E62429] text-[#8C9098] hover:text-[#E62429] text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET</span>
                </button>
              </div>

            </div>

            {/* ── RIGHT COLUMN: HORIZONTAL MOVIE REEL SLIDER ── */}
            <div className="lg:col-span-7 relative">
              
              {/* Carousel Track */}
              <div
                ref={scrollContainerRef}
                className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth pr-12"
              >
                {WATCHLIST.map((item) => {
                  const isItemCompleted = item.isMultiSeason
                    ? !!(progress['loki-series']?.season1 && progress['loki-series']?.season2)
                    : !!progress[item.id]?.completed;

                  return (
                    <div
                      key={item.id}
                      className="relative w-32 xs:w-36 sm:w-40 aspect-[2/3] shrink-0 border border-[#1E252D] hover:border-[#22C55E] bg-[#0E1015] rounded-xs overflow-hidden shadow-lg cursor-pointer group transition-all duration-300 hover:scale-104 select-none"
                      onClick={() => {
                        setActiveModalItem(item);
                        try { clockAudio.tick(0); } catch (e) {}
                      }}
                    >
                      <img
                        src={item.poster}
                        alt={item.title}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 ${
                          isItemCompleted ? 'filter brightness-90' : 'filter brightness-80'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />

                      {/* Chapter number badge */}
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/85 border border-white/20 text-[9px] font-mono font-bold text-white uppercase rounded-xs">
                        {item.number}
                      </span>

                      {/* Watched check badge */}
                      {isItemCompleted && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.isMultiSeason) handleToggleLokiSeason('s1');
                            else handleToggleStandard(item.id);
                          }}
                          className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#22C55E] text-black text-[8px] font-mono font-bold uppercase rounded-xs flex items-center gap-0.5 shadow-md cursor-pointer hover:bg-[#10B981]"
                          title="Click to toggle watched"
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                          <span>WATCHED</span>
                        </div>
                      )}

                      {/* Movie title at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                        <p className="text-[7.5px] font-mono text-[#22C55E] font-bold uppercase truncate">
                          {item.year}
                        </p>
                        <h4 className="text-[10.5px] sm:text-xs font-cinematic font-bold text-white uppercase truncate leading-tight group-hover:text-white">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Slider Prev Arrow */}
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#22C55E] bg-black/90 hover:bg-[#22C55E] text-[#22C55E] hover:text-black flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,197,94,0.6)] cursor-pointer z-10 shrink-0"
                aria-label="Scroll watchlist carousel prev"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Slider Next Arrow (Matching green circular arrow in reference image) */}
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#22C55E] bg-black/90 hover:bg-[#22C55E] text-[#22C55E] hover:text-black flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,197,94,0.6)] cursor-pointer z-10 shrink-0"
                aria-label="Scroll watchlist carousel next"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>

            </div>

          </div>

        </div>

        {/* ── SAGA CHRONOLOGY NAVIGATION & FULL TIMELINE EXPANDER ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto mb-6 pb-4 border-b border-[#1E2024]">
          {/* Saga Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 select-none">
            {['ALL', 'UNWATCHED', 'INFINITY', 'MULTIVERSE', 'INCURSION'].map((filterName) => (
              <button
                key={filterName}
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch (e) {}
                  setSagaFilter(filterName);
                }}
                className={`px-3 py-1 text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer border rounded-xs ${
                  sagaFilter === filterName
                    ? 'border-[#22C55E] bg-[#22C55E]/20 text-white font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                    : 'border-[#1E2024] bg-[#111216]/60 text-[#777A80] hover:text-[#D8D9DC]'
                }`}
              >
                {filterName === 'ALL'
                  ? 'FULL CHRONOLOGY (15)'
                  : filterName === 'UNWATCHED'
                    ? `UNWATCHED (${remainingCount})`
                    : filterName}
              </button>
            ))}
          </div>

          {/* View Toggle Button (Carousel vs Grid vs Timeline) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                try { clockAudio.tick(0); } catch (e) {}
                setViewMode(viewMode === 'grid' ? 'carousel' : 'grid');
              }}
              className="px-3 py-1.5 border border-[#232731] hover:border-white/50 bg-[#111216] text-[#D8D9DC] text-[10px] font-mono tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-1.5 rounded-xs"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>{viewMode === 'grid' ? 'MINIMIZE TO REEL' : 'VIEW ALL 15 GRID'}</span>
            </button>
          </div>
        </div>

        {/* ── EXPANDABLE 15-MOVIE FULL GRID (Guarantees 100% test & visual completeness) ── */}
        <div className={`row g-2 sm:g-3 ${viewMode === 'carousel' ? 'hidden sm:flex' : 'flex'}`}>
          {filteredWatchlist.map((item) => (
            <div key={item.id} className="col-6 col-sm-4 col-md-3 col-lg-2 flex">
              <WatchlistItem
                item={item}
                progress={progress}
                onToggleStandard={handleToggleStandard}
                onToggleLokiSeason={handleToggleLokiSeason}
                onCardClick={() => {
                  setActiveModalItem(item);
                  try { clockAudio.tick(0); } catch (e) {}
                }}
                isNextWatch={false}
              />
            </div>
          ))}
        </div>

      </div>

      {/* Detail Modal */}
      {activeModalItem && (
        <MovieDetailModal
          item={activeModalItem}
          isWatched={
            activeModalItem.isMultiSeason
              ? !!(progress['loki-series']?.season1 && progress['loki-series']?.season2)
              : !!progress[activeModalItem.id]?.completed
          }
          lokiSeasons={
            activeModalItem.isMultiSeason
              ? {
                s1: !!progress['loki-series']?.season1,
                s2: !!progress['loki-series']?.season2,
              }
              : null
          }
          onToggleWatched={() => {
            if (activeModalItem.isMultiSeason) {
              handleToggleLokiSeason('s1');
              handleToggleLokiSeason('s2');
            } else {
              handleToggleStandard(activeModalItem.id);
            }
          }}
          onClose={() => setActiveModalItem(null)}
        />
      )}

      {/* Confirmation Dialog before Reset */}
      <ResetDialog
        isOpen={isResetOpen}
        onConfirm={handleConfirmReset}
        onCancel={() => setIsResetOpen(false)}
      />
    </section>
  );
}
