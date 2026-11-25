import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WATCHLIST } from '../data/watchlist';
import { loadWatchlistProgress, saveWatchlistProgress, clearWatchlistProgress } from '../utils/storage';
import ResetDialog from './ResetDialog';
import MovieDetailModal from './MovieDetailModal';
import CinematicAtmosphere from './CinematicAtmosphere';
import { clockAudio } from '../utils/audio.js';
import {
  ChevronRight,
  ChevronLeft,
  Share2,
  Download,
  RotateCcw,
  Check,
  Eye,
  Layers,
  LayoutGrid,
} from 'lucide-react';

export default function Watchlist() {
  const [progress, setProgress] = useState(() => loadWatchlistProgress());
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [viewMode, setViewMode] = useState('reel'); // 'reel' (Image 4 default) | 'timeline' | 'grid'
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    saveWatchlistProgress(progress);
  }, [progress]);

  const handleToggleStandard = (id) => {
    try { clockAudio.tick(0); } catch (e) { }
    setProgress((prev) => ({
      ...prev,
      [id]: { ...prev[id], completed: !(prev[id]?.completed) },
    }));
  };

  const handleToggleLokiSeason = (action) => {
    try { clockAudio.tick(0); } catch (e) { }
    setProgress((prev) => {
      const loki = prev['loki-series'] || {};
      const bothDone = loki.season1 && loki.season2;

      let s1 = true;
      let s2 = true;

      if (action === 'clear' || (action === 'toggle' && bothDone)) {
        s1 = false;
        s2 = false;
      }

      return {
        ...prev,
        'loki-series': {
          season1: s1,
          season2: s2,
          completed: s1 && s2,
        },
      };
    });
  };

  const handleConfirmReset = () => {
    try { clockAudio.tick(0); } catch (e) { }
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

  // Check scroll position to show/hide circular green arrow buttons
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollCarousel = (direction) => {
    try { clockAudio.tick(0); } catch (e) { }
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  // Share progress
  const handleShare = async () => {
    try { clockAudio.tick(0); } catch (e) { }
    const shareText = `AVENGERS: DOOMSDAY ROADMAP\nWatched: ${watchedCount} / ${totalCount} Chapters (${percentage}% Complete).\nPreparing for December 18, 2026.`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  // Download graphic
  const handleDownloadGraphic = async () => {
    try {
      try { clockAudio.tick(0); } catch (e) { }
      setDownloading(true);
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#08090B';
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

  return (
    <section
      id="watchlist"
      aria-label="Road to Doomsday Watchlist"
      className="relative z-10 bg-[#08090B] border-t border-[#1E2024] px-3 sm:px-6 lg:px-8 py-10 sm:py-16 overflow-hidden"
    >
      {/* Cinematic Full-Width Background Atmosphere */}
      <CinematicAtmosphere
        poster="/doomsday-ensemble-poster.jpg"
        videoWebm="/videos/doomsday-roadmap-cinematic.webm"
        videoSrc="/videos/doomsday-roadmap-cinematic.mp4"
        overlayOpacity="bg-[#08090B]/88"
        accentGlow="emerald"
        showParticles={true}
      />

      <div className="container-fluid container-xl mx-auto px-0 relative z-10">

        {/* ═════════════════════════════════════════════════════════════════════
            EXACT REFERENCE DESIGN IMPLEMENTATION (Image 4)
            - A single cohesive theatrical container with glowing emerald border
            - Left: Title, Subtitle, Watched Progress, Emerald Bar, Action Buttons
            - Right: Horizontal Theatrical Movie Reel with Circular Green Arrow ( > )
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="border border-[#1E252D] hover:border-[#10B981]/40 bg-[#0A0C10]/95 rounded-xs p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

            {/* ── LEFT COLUMN: TITLE, STATS, PROGRESS & ACTIONS ── */}
            <div className="lg:col-span-4 flex flex-col justify-between">
              <div>
                <h2 className="text-xl xs:text-2xl sm:text-3xl font-cinematic font-black tracking-tight text-white uppercase leading-tight mb-1">
                  YOUR ROAD TO DOOMSDAY
                </h2>

                <p className="text-xs sm:text-sm font-mono tracking-widest text-[#8C9098] uppercase mb-4">
                  15 CHAPTERS. ONE DESTINATION.
                </p>

                {/* Progress Stats */}
                <div className="flex items-center gap-3 text-xs sm:text-sm font-mono tracking-wider mb-2">
                  <span className="text-[#8C9098]">
                    WATCHED: <span className="text-white font-bold font-sans text-sm sm:text-base">{watchedCount}</span> / {totalCount}
                  </span>
                  <span className="text-[#3A3D46]">•</span>
                  <span className="text-[#34D399] font-semibold font-mono text-sm sm:text-base">
                    {percentage}% COMPLETE
                  </span>
                </div>

                {/* Hairline Emerald Progress Track */}
                <div className="w-full h-1.5 bg-[#11141A] border border-[#232731] rounded-[2px] overflow-hidden mb-4">
                  <div
                    className="h-full bg-[#22C55E] transition-all duration-500 ease-out"
                    style={{ width: `${Math.max(percentage, 2)}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1E252D]/60">
                <button
                  type="button"
                  onClick={handleShare}
                  className="px-3 py-1.5 bg-[#12141A] hover:bg-[#1A1C24] border border-[#232731] hover:border-white/40 text-white text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>{copied ? 'COPIED!' : 'SHARE PROGRESS'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadGraphic}
                  disabled={downloading}
                  className="px-3 py-1.5 bg-[#12141A] hover:bg-[#1A1C24] border border-[#232731] hover:border-white/40 text-white text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs"
                >
                  <Download className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>{downloading ? 'EXPORTING...' : 'GRAPHIC'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsResetOpen(true)}
                  className="px-3 py-1.5 bg-[#12141A] hover:bg-[#1A1C24] border border-[#232731] hover:border-[#E62429] text-[#8C9098] hover:text-[#E62429] text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs"
                  title="Reset watch progress"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>RESET</span>
                </button>
              </div>
            </div>

            {/* ── RIGHT COLUMN: HORIZONTAL MOVIE REEL WITH CIRCULAR GREEN ( > ) ARROW ── */}
            <div className="lg:col-span-8 relative flex items-center">

              {/* Navigation Arrow ( < ) on Left */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  className="absolute -left-3 sm:-left-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0C0F14]/95 border border-[#2D3542] hover:border-[#34D399] text-white hover:text-[#34D399] flex items-center justify-center transition-colors duration-200 shadow-xl cursor-pointer"
                  title="Previous Chapters"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </button>
              )}

              {/* Horizontal Scroll Reel Track */}
              <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="flex items-stretch gap-2.5 sm:gap-3 overflow-x-auto pb-2 scrollbar-none scroll-smooth w-full pr-10 sm:pr-12"
              >
                {WATCHLIST.map((item) => {
                  const isCompleted = item.isMultiSeason
                    ? !!(progress['loki-series']?.season1 && progress['loki-series']?.season2)
                    : !!progress[item.id]?.completed;

                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.isMultiSeason) {
                          handleToggleLokiSeason('toggle');
                        } else {
                          handleToggleStandard(item.id);
                        }
                      }}
                      className={`relative w-[125px] xs:w-[138px] sm:w-[150px] aspect-[2/3] shrink-0 rounded-xs border transition-all duration-300 cursor-pointer overflow-hidden group select-none ${
                        isCompleted
                          ? 'border-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-[#0C140E]'
                          : 'border-[#1E252D] hover:border-white/50 bg-[#0E1015]'
                      }`}
                    >
                      <img
                        src={item.poster}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 filter brightness-90 group-hover:brightness-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

                      {/* Top Tag: Number and Check badge */}
                      <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                        {isCompleted ? (
                          <span className="bg-[#22C55E] text-black font-mono font-black text-[8.5px] px-1.5 py-0.5 rounded-xs flex items-center gap-0.5 shadow">
                            <span>{item.number}</span>
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="bg-black/85 text-white/90 border border-white/20 font-mono font-bold text-[8.5px] px-1.5 py-0.5 rounded-xs">
                            {item.number}
                          </span>
                        )}
                      </div>

                      {/* Info Button on Hover to view synopsis */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveModalItem(item);
                          try { clockAudio.tick(0); } catch (e) { }
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/80 hover:bg-[#22C55E] text-[#8C9098] hover:text-black rounded-xs transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                        title="View chapter details"
                      >
                        <Eye className="w-3 h-3" />
                      </button>

                      {/* Bottom Title */}
                      <div className="absolute bottom-0 left-0 right-0 p-2 text-left bg-gradient-to-t from-black via-black/80 to-transparent">
                        <span className="text-[7.5px] font-mono text-[#8C9098] block uppercase">
                          {item.year} • {item.type}
                        </span>
                        <h4 className="text-[10.5px] font-cinematic font-bold text-white uppercase leading-tight line-clamp-2 group-hover:text-[#22C55E] transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Arrow ( > ) on Right */}
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="absolute -right-2 sm:-right-4 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0C0F14]/95 border border-[#2D3542] hover:border-[#34D399] text-white hover:text-[#34D399] flex items-center justify-center transition-colors duration-200 shadow-xl cursor-pointer shrink-0"
                title="Next Chapters"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ── CHAPTER DETAIL MODAL ── */}
      {activeModalItem && (
        <MovieDetailModal
          item={activeModalItem}
          progress={progress}
          onClose={() => setActiveModalItem(null)}
          onToggleStandard={handleToggleStandard}
          onToggleLokiSeason={handleToggleLokiSeason}
        />
      )}

      {/* ── RESET CONFIRMATION MODAL ── */}
      {isResetOpen && (
        <ResetDialog
          isOpen={isResetOpen}
          onClose={() => setIsResetOpen(false)}
          onConfirm={handleConfirmReset}
        />
      )}
    </section>
  );
}
