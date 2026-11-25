import React, { useState, useEffect, useMemo, useRef } from 'react';
import { WATCHLIST } from '../data/watchlist';
import { loadWatchlistProgress, saveWatchlistProgress, clearWatchlistProgress } from '../utils/storage';
import ResetDialog from './ResetDialog';
import MovieDetailModal from './MovieDetailModal';
import WatchlistItem from './WatchlistItem';
import CinematicAtmosphere from './CinematicAtmosphere';
import { clockAudio } from '../utils/audio.js';
import {
  ChevronRight,
  ChevronLeft,
  Share2,
  Download,
  RotateCcw,
  Check,
  LayoutGrid,
  Layers,
  Film,
  Tv,
  Eye,
  Flame,
  Milestone,
  Compass,
} from 'lucide-react';

export default function Watchlist() {
  const [progress, setProgress] = useState(() => loadWatchlistProgress());
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline' | 'carousel' | 'grid'
  const [sagaFilter, setSagaFilter] = useState('ALL');
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

  const handleToggleLokiSeason = (seasonId) => {
    try { clockAudio.tick(0); } catch (e) { }
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

  // Next unwatched movie detection (Active Chapter)
  const nextWatchItem = useMemo(() => {
    for (const item of WATCHLIST) {
      if (item.isMultiSeason) {
        const loki = progress['loki-series'];
        if (!(loki?.season1 && loki?.season2)) return item;
      } else {
        if (!progress[item.id]?.completed) return item;
      }
    }
    return null;
  }, [progress]);

  // Carousel navigation
  const scrollCarousel = (direction) => {
    try { clockAudio.tick(0); } catch (e) { }
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Share Progress text (Preserves exact tested string contract)
  const shareText = `AVENGERS: DOOMSDAY COUNTDOWN\n\nMy Road to Doomsday:\n${watchedCount} / ${totalCount} Chapters Completed.\n\n${percentage}% Ready.\n\nTHE COUNTDOWN HAS BEGUN.`;

  const handleShare = async () => {
    try { clockAudio.tick(0); } catch (e) { }
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

  // Downloadable progress graphic using HTML5 Canvas (Preserved)
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

  // Filtered items based on saga and watched filters
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

  // Era labels for continuous storytelling
  const getEraLabel = (number) => {
    const n = parseInt(number, 10);
    if (n === 1) return { title: 'PHASE 1 // MUTANT ORIGINS & FIRST AVENGERS', subtitle: 'Foundation of heroic alliances & early Tesseract occurrences.' };
    if (n === 5) return { title: 'PHASE 2 // THE INFINITY GAUNTLET CATACLYSM', subtitle: 'Universal decimation and the fractures in the Sacred Timeline.' };
    if (n === 7) return { title: 'PHASE 3 // MULTIVERSE BRANCHES & TIME WARPING', subtitle: 'Loki, the TVA, and the opening of trans-dimensional corridors.' };
    if (n === 12) return { title: 'PHASE 4 // INCURSIONS & THE ROAD TO DOOMSDAY', subtitle: 'The Void, Adamantium, and the collision course with Victor von Doom.' };
    return null;
  };

  return (
    <section
      id="watchlist"
      aria-label="Road to Doomsday Watchlist"
      className="relative z-10 bg-[#08090B] border-t border-[#1E2024] px-3 sm:px-6 lg:px-8 py-14 sm:py-20 overflow-hidden"
    >
      {/* ── 1. CINEMATIC FULL-WIDTH BACKGROUND VIDEO EXPERIENCE ── */}
      <CinematicAtmosphere
        poster="/doomsday-ensemble-poster.jpg"
        videoWebm="/videos/doomsday-roadmap-cinematic.webm"
        videoSrc="/videos/doomsday-roadmap-cinematic.mp4"
        overlayOpacity="bg-[#08090B]/86"
        accentGlow="emerald"
        showParticles={true}
      />

      <div className="container-fluid container-xl mx-auto px-0 relative z-10">

        {/* ═════════════════════════════════════════════════════════════════════
            2. THEATRICAL COMMAND & PROGRESS HUD
            - Large-scale cinematic typography
            - High-contrast HUD stats, precision glowing emerald bar
            - Instant Action controls: Share, Graphic, Reset
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="border border-[#1E252D] bg-[#0A0C10]/95 rounded-xs p-5 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.95)] mb-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#1E252D]">

            {/* Title & Narrative Lead */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 border border-[#10B981]/40 bg-[#10B981]/10 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#34D399] uppercase rounded-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping shrink-0" />
                <span>MULTIVERSE INCURSION TIMELINE // 15 CHAPTERS</span>
              </div>

              <h2 className="text-2xl xs:text-3xl sm:text-5xl font-cinematic font-black tracking-tight text-white uppercase leading-none mb-2">
                YOUR ROAD TO DOOMSDAY
              </h2>

              <p className="text-xs sm:text-sm font-mono tracking-widest text-[#8C9098] uppercase mb-2">
                15 CHAPTERS. ONE DESTINATION.
              </p>

              <p className="text-xs sm:text-sm font-body text-[#787D87] leading-relaxed max-w-xl">
                From the dawn of the mutant awakening to the collapse of the Sacred Timeline — relive the critical chapters that forged the Marvel Multiverse before Victor von Doom claims everything.
              </p>
            </div>

            {/* Live Progress Stats Monolith */}
            <div className="flex flex-col sm:items-end justify-between shrink-0">
              <div className="flex items-center gap-4 text-xs sm:text-sm font-mono tracking-wider mb-2">
                <span className="text-[#8C9098]">
                  WATCHED: <span className="text-white font-bold font-sans text-sm sm:text-base">{watchedCount}</span> / {totalCount}
                </span>
                <span className="text-[#3A3D46]">•</span>
                <span className="text-[#22C55E] font-bold font-mono text-sm sm:text-base drop-shadow-[0_0_10px_rgba(34,197,94,0.7)]">
                  {percentage}% COMPLETE
                </span>
              </div>

              {/* Glowing Emerald Progress Track */}
              <div className="w-full sm:w-72 h-3.5 bg-[#0F1116] border border-[#232731] rounded-full overflow-hidden p-0.5 shadow-inner mb-3">
                <div
                  className="h-full bg-gradient-to-r from-[#10B981] via-[#22C55E] to-[#00FF88] rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(34,197,94,0.9)]"
                  style={{ width: `${Math.max(percentage, 4)}%` }}
                />
              </div>

              <span className="text-[9.5px] font-mono text-[#6B7280] uppercase tracking-wider">
                {remainingCount === 0 ? 'ALL CHAPTERS COMPLETE' : `${remainingCount} CHAPTERS REMAINING TO PREPARE`}
              </span>
            </div>

          </div>

          {/* Action Buttons & Filter Row */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-5">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 select-none w-full md:w-auto">
              {[
                { id: 'ALL', label: `ALL CHRONOLOGY (${totalCount})` },
                { id: 'UNWATCHED', label: `UNWATCHED (${remainingCount})` },
                { id: 'INFINITY', label: 'INFINITY SAGA (01–06)' },
                { id: 'MULTIVERSE', label: 'MULTIVERSE (07–11)' },
                { id: 'INCURSION', label: 'INCURSION (12–15)' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch (e) { }
                    setSagaFilter(filter.id);
                  }}
                  className={`px-3 py-1.5 text-[9.5px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer border rounded-xs ${sagaFilter === filter.id
                    ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#22C55E] font-bold shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                    : 'border-[#1E252D] bg-[#0E1015] text-[#8C9098] hover:text-white hover:border-[#383C46]'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Action Buttons & View Mode Switcher */}
            <div className="flex flex-wrap items-center justify-end gap-2 w-full md:w-auto">
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
                className="px-3 py-2 bg-[#12141A] hover:bg-[#1A1C24] border border-[#232731] hover:border-[#E62429] text-[#8C9098] hover:text-[#E62429] text-[10px] font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5 rounded-xs"
                title="Reset watch progress"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESET</span>
              </button>

              {/* View Toggle */}
              <div className="flex items-center border border-[#232731] bg-[#12141A] p-0.5 rounded-xs">
                <button
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch (e) { }
                    setViewMode('timeline');
                  }}
                  className={`px-2.5 py-1 text-[9px] font-mono tracking-wider uppercase transition-colors rounded-xs ${viewMode === 'timeline'
                    ? 'bg-[#22C55E] text-black font-bold'
                    : 'text-[#8C9098] hover:text-white'
                    }`}
                  title="Editorial Storytelling Timeline"
                >
                  TIMELINE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch (e) { }
                    setViewMode('carousel');
                  }}
                  className={`px-2.5 py-1 text-[9px] font-mono tracking-wider uppercase transition-colors rounded-xs ${viewMode === 'carousel'
                    ? 'bg-[#22C55E] text-black font-bold'
                    : 'text-[#8C9098] hover:text-white'
                    }`}
                  title="Horizontal Movie Reel"
                >
                  REEL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch (e) { }
                    setViewMode('grid');
                  }}
                  className={`px-2.5 py-1 text-[9px] font-mono tracking-wider uppercase transition-colors rounded-xs ${viewMode === 'grid'
                    ? 'bg-[#22C55E] text-black font-bold'
                    : 'text-[#8C9098] hover:text-white'
                    }`}
                  title="Compact Grid Overview"
                >
                  GRID
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            3. HEROIC ACTIVE CHAPTER / NEXT MISSION SPOTLIGHT
            - Prominent cinematic card for the next unwatched movie
            - Large oversized poster, narrative significance, 48px checkbox
           ═════════════════════════════════════════════════════════════════════ */}
        {nextWatchItem ? (
          <div className="relative border-2 border-[#E62429] bg-gradient-to-r from-[#140B0E] via-[#0C0D11] to-[#0A0B0E] p-5 sm:p-8 rounded-xs shadow-[0_20px_60px_rgba(230,36,41,0.25)] mb-12 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#E62429]/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-10">

              {/* Oversized Poster with Cinematic Rim Glow */}
              <div
                className="w-36 xs:w-44 sm:w-56 aspect-[2/3] shrink-0 border border-[#E62429]/80 rounded-xs overflow-hidden shadow-2xl cursor-pointer group/spotlight relative"
                onClick={() => {
                  setActiveModalItem(nextWatchItem);
                  try { clockAudio.tick(0); } catch (e) { }
                }}
              >
                <img
                  src={nextWatchItem.poster}
                  alt={nextWatchItem.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/spotlight:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />
                <span className="absolute top-2 left-2 bg-[#E62429] text-white px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase rounded-xs shadow">
                  CH. {nextWatchItem.number}
                </span>
              </div>

              {/* Mission Details & Action Deck */}
              <div className="flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-[#E62429]/20 border border-[#E62429] text-[9.5px] font-mono tracking-[0.2em] text-[#FF4D4F] uppercase font-bold rounded-xs">
                    <span className="w-2 h-2 rounded-full bg-[#E62429] animate-ping" />
                    <span>CURRENT DESTINATION // ACTIVE CHAPTER {nextWatchItem.number}</span>
                  </div>

                  <h3 className="text-2xl xs:text-3xl sm:text-4xl font-cinematic font-black text-white uppercase tracking-tight mb-1">
                    {nextWatchItem.title}
                  </h3>

                  <p className="text-xs font-mono text-[#D8D9DC] mb-3">
                    {nextWatchItem.year} • <span className="text-[#E62429] uppercase font-bold">{nextWatchItem.type}</span>
                    {nextWatchItem.tagline && <span className="text-[#8C9098] italic ml-2">"{nextWatchItem.tagline}"</span>}
                  </p>

                  <p className="text-xs sm:text-sm font-body text-[#C4C7CE] leading-relaxed mb-6 max-w-2xl">
                    {nextWatchItem.narrativeSignificance}
                  </p>
                </div>

                {/* Big 48x48px Interactive Checklist Bar */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-[#1E252D]">
                  {nextWatchItem.isMultiSeason ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLokiSeason('s1');
                        }}
                        className={`min-h-[44px] px-4 py-2 border text-xs font-mono font-bold tracking-wider uppercase transition-all rounded-xs cursor-pointer flex items-center gap-2 ${progress['loki-series']?.season1
                          ? 'border-[#22C55E] bg-[#22C55E] text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                          : 'border-[#E62429] bg-[#E62429]/15 text-white hover:bg-[#E62429]'
                          }`}
                      >
                        {progress['loki-series']?.season1 && <Check className="w-4 h-4 stroke-[3]" />}
                        <span>SEASON 1 {progress['loki-series']?.season1 ? '✓ WATCHED' : 'MARK COMPLETED'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLokiSeason('s2');
                        }}
                        className={`min-h-[44px] px-4 py-2 border text-xs font-mono font-bold tracking-wider uppercase transition-all rounded-xs cursor-pointer flex items-center gap-2 ${progress['loki-series']?.season2
                          ? 'border-[#22C55E] bg-[#22C55E] text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                          : 'border-[#E62429] bg-[#E62429]/15 text-white hover:bg-[#E62429]'
                          }`}
                      >
                        {progress['loki-series']?.season2 && <Check className="w-4 h-4 stroke-[3]" />}
                        <span>SEASON 2 {progress['loki-series']?.season2 ? '✓ WATCHED' : 'MARK COMPLETED'}</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStandard(nextWatchItem.id);
                      }}
                      className="min-h-[48px] px-6 py-3 border border-[#E62429] hover:border-[#22C55E] bg-[#E62429] hover:bg-[#22C55E] text-white hover:text-black text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(230,36,41,0.4)] cursor-pointer inline-flex items-center gap-2.5 rounded-xs"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>MARK CHAPTER {nextWatchItem.number} AS COMPLETED</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setActiveModalItem(nextWatchItem);
                      try { clockAudio.tick(0); } catch (e) { }
                    }}
                    className="min-h-[48px] px-5 py-3 bg-[#111318] hover:bg-white text-white hover:text-black text-xs font-mono font-bold tracking-wider uppercase border border-[#232731] transition-all cursor-pointer rounded-xs inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>VIEW INTEL DOSSIER ↗</span>
                  </button>
                </div>

              </div>

            </div>
          </div>
        ) : (
          /* All 15 Chapters Completed Victory Banner */
          <div className="border-2 border-[#22C55E] bg-[#0A120E] p-6 sm:p-8 rounded-xs shadow-[0_0_40px_rgba(34,197,94,0.3)] mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#22C55E] text-black flex items-center justify-center font-bold text-xl shadow-[0_0_20px_rgba(34,197,94,0.8)] shrink-0">
                ✓
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-cinematic font-black text-white uppercase">
                  DESTINATION REACHED — 15 / 15 CHAPTERS VERIFIED
                </h3>
                <p className="text-xs font-mono text-[#22C55E] tracking-wider uppercase">
                  You are fully prepared for Avengers: Doomsday on 18 December 2026.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="px-6 py-3 bg-[#22C55E] hover:bg-[#10B981] text-black font-mono font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] cursor-pointer rounded-xs shrink-0"
            >
              SHARE 100% VICTORY
            </button>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            4. VIEW MODE 1: CONTINUOUS THEATRICAL EDITORIAL TIMELINE (Default)
            - Asymmetric editorial composition with phase milestone banners
            - Large chapter numbers, oversized posters, 44x44px accessible checklists
           ═════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'timeline' && (
          <div className="space-y-8 sm:space-y-12">
            {filteredWatchlist.map((item, index) => {
              const isItemCompleted = item.isMultiSeason
                ? !!(progress['loki-series']?.season1 && progress['loki-series']?.season2)
                : !!progress[item.id]?.completed;

              const isNextWatch = nextWatchItem?.id === item.id;
              const era = getEraLabel(item.number);

              return (
                <div key={item.id} className="relative">
                  {/* Era Milestone Banner Break */}
                  {era && (
                    <div className="mb-6 pt-4 pb-2 border-b border-[#1E252D] flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 select-none">
                      <span className="text-xs sm:text-sm font-mono tracking-[0.2em] text-[#22C55E] uppercase font-bold">
                        {era.title}
                      </span>
                      <span className="text-[10px] font-mono text-[#6B7280]">
                        {era.subtitle}
                      </span>
                    </div>
                  )}

                  {/* Asymmetric Theatrical Chapter Row Card */}
                  <div
                    className={`relative border p-4 sm:p-6 transition-all duration-300 rounded-xs shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-8 ${isItemCompleted
                      ? 'border-[#22C55E]/40 bg-[#0A100D]/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                      : isNextWatch
                        ? 'border-[#E62429] bg-[#140B0E]/90 ring-1 ring-[#E62429]/50 shadow-[0_15px_40px_rgba(230,36,41,0.25)]'
                        : 'border-[#1E252D] bg-[#0C0E13]/90 hover:border-[#383C46] hover:bg-[#101218]'
                      }`}
                  >
                    {/* Left: Giant Chapter Number */}
                    <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-16">
                      <span
                        className={`text-3xl sm:text-4xl font-mono font-black ${isItemCompleted
                          ? 'text-[#22C55E]/70'
                          : isNextWatch
                            ? 'text-[#E62429]'
                            : 'text-[#3A3D46]'
                          }`}
                      >
                        {item.number}
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-[#6B7280] uppercase">
                        CHAPTER
                      </span>
                    </div>

                    {/* Middle: Oversized Poster (Supports Loki S1 & S2 Dual View) */}
                    <div className="shrink-0 flex items-center gap-2">
                      {item.isMultiSeason ? (
                        <div className="flex gap-2">
                          <div
                            onClick={() => {
                              setActiveModalItem(item);
                              try { clockAudio.tick(0); } catch (e) { }
                            }}
                            className="w-20 xs:w-24 sm:w-28 aspect-[2/3] border border-[#232731] hover:border-[#22C55E] rounded-xs overflow-hidden shadow-md cursor-pointer group/p relative"
                          >
                            <img
                              src={item.posterSeason1}
                              alt="Loki Season 1"
                              className="w-full h-full object-cover group-hover/p:scale-106 transition-transform"
                            />
                            <span className="absolute bottom-1 right-1 px-1 bg-black/90 text-[8px] font-mono text-white">S1</span>
                          </div>
                          <div
                            onClick={() => {
                              setActiveModalItem(item);
                              try { clockAudio.tick(0); } catch (e) { }
                            }}
                            className="w-20 xs:w-24 sm:w-28 aspect-[2/3] border border-[#232731] hover:border-[#22C55E] rounded-xs overflow-hidden shadow-md cursor-pointer group/p relative"
                          >
                            <img
                              src={item.posterSeason2}
                              alt="Loki Season 2"
                              className="w-full h-full object-cover group-hover/p:scale-106 transition-transform"
                            />
                            <span className="absolute bottom-1 right-1 px-1 bg-black/90 text-[8px] font-mono text-white">S2</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setActiveModalItem(item);
                            try { clockAudio.tick(0); } catch (e) { }
                          }}
                          className={`w-24 xs:w-28 sm:w-32 aspect-[2/3] border rounded-xs overflow-hidden shadow-lg cursor-pointer group/p relative ${isItemCompleted
                            ? 'border-[#22C55E]/50'
                            : isNextWatch
                              ? 'border-[#E62429]'
                              : 'border-[#232731] hover:border-[#22C55E]'
                            }`}
                        >
                          <img
                            src={item.poster}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-transform duration-500 group-hover/p:scale-108 ${isItemCompleted ? 'brightness-85 saturate-80' : 'brightness-95'
                              }`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                          <span className="sm:hidden absolute top-1 left-1 px-1 bg-black/90 text-[9px] font-mono text-white font-bold">
                            CH. {item.number}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Middle-Right: Editorial Story & Significance */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => {
                        setActiveModalItem(item);
                        try { clockAudio.tick(0); } catch (e) { }
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-[9px] font-mono uppercase font-bold tracking-wider ${isItemCompleted
                            ? 'text-[#22C55E]'
                            : isNextWatch
                              ? 'text-[#E62429]'
                              : 'text-[#8C9098]'
                            }`}
                        >
                          CHAPTER {item.number} • {item.year}
                        </span>
                        <span className="text-[#3A3D44]">•</span>
                        <span className="text-[9px] font-mono uppercase text-[#6B7280]">
                          {item.type}
                        </span>
                        {isNextWatch && (
                          <span className="px-1.5 py-0.5 bg-[#E62429] text-white text-[8px] font-mono font-bold tracking-wider uppercase rounded-xs">
                            ACTIVE
                          </span>
                        )}
                        {isItemCompleted && (
                          <span className="px-1.5 py-0.5 bg-[#22C55E] text-black text-[8px] font-mono font-bold tracking-wider uppercase rounded-xs">
                            ✓ VERIFIED
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg xs:text-xl sm:text-2xl font-cinematic font-bold text-white uppercase tracking-tight group-hover:text-[#22C55E] transition-colors leading-tight mb-1">
                        {item.title}
                      </h4>

                      {item.tagline && (
                        <p className="text-xs font-mono text-[#8C9098] italic mb-2">
                          "{item.tagline}"
                        </p>
                      )}

                      <p className="text-xs sm:text-[13px] font-body text-[#9CA3AF] leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {item.narrativeSignificance}
                      </p>
                    </div>

                    {/* Right: Functional 44x44px Checklist Area */}
                    <div
                      className="shrink-0 flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#1E252D] pt-3 sm:pt-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.isMultiSeason ? (
                        <div className="flex items-center gap-2">
                          {/* S1 Checkbox (44x44px target) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLokiSeason('s1');
                            }}
                            aria-pressed={!!progress['loki-series']?.season1}
                            aria-label={`Toggle Loki Season 1`}
                            className={`min-w-[44px] min-h-[44px] h-11 px-3 border flex items-center justify-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer rounded-xs ${progress['loki-series']?.season1
                              ? 'border-[#22C55E] bg-[#22C55E] text-black shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                              : 'border-[#232731] bg-[#12141A] text-[#8C9098] hover:border-[#22C55E] hover:text-white'
                              }`}
                          >
                            {progress['loki-series']?.season1 && <Check className="w-4 h-4 stroke-[3]" />}
                            <span>S1</span>
                          </button>

                          {/* S2 Checkbox (44x44px target) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleLokiSeason('s2');
                            }}
                            aria-pressed={!!progress['loki-series']?.season2}
                            aria-label={`Toggle Loki Season 2`}
                            className={`min-w-[44px] min-h-[44px] h-11 px-3 border flex items-center justify-center gap-1.5 transition-all text-xs font-mono font-bold cursor-pointer rounded-xs ${progress['loki-series']?.season2
                              ? 'border-[#22C55E] bg-[#22C55E] text-black shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                              : 'border-[#232731] bg-[#12141A] text-[#8C9098] hover:border-[#22C55E] hover:text-white'
                              }`}
                          >
                            {progress['loki-series']?.season2 && <Check className="w-4 h-4 stroke-[3]" />}
                            <span>S2</span>
                          </button>
                        </div>
                      ) : (
                        /* Standard Chapter 44x44px Checkbox */
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleStandard(item.id);
                            }}
                            aria-pressed={isItemCompleted}
                            aria-label={`Mark Chapter ${item.number}: ${item.title} as ${isItemCompleted ? 'unwatched' : 'completed'
                              }`}
                            className={`min-w-[44px] min-h-[44px] w-12 h-12 border flex items-center justify-center transition-all duration-200 cursor-pointer rounded-xs ${isItemCompleted
                              ? 'border-[#22C55E] bg-[#22C55E] text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                              : isNextWatch
                                ? 'border-[#E62429] bg-[#1C1215] text-[#E62429] hover:bg-[#E62429] hover:text-white ring-1 ring-[#E62429]/50'
                                : 'border-[#232731] bg-[#12141A] text-transparent hover:border-[#22C55E] hover:bg-[#1A1C24]'
                              }`}
                          >
                            {isItemCompleted ? (
                              <Check className="w-6 h-6 stroke-[3]" />
                            ) : (
                              <span className="w-3 h-3 rounded-full bg-[#383C46] hover:bg-[#22C55E] transition-colors" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setActiveModalItem(item);
                              try { clockAudio.tick(0); } catch (e) { }
                            }}
                            className="p-3 bg-[#111318] hover:bg-[#1A1C24] border border-[#232731] hover:border-white/50 text-[#8C9098] hover:text-white text-xs font-mono transition-colors cursor-pointer rounded-xs"
                            title="Open Intelligence Dossier"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            5. VIEW MODE 2: THEATRICAL HORIZONTAL REEL CAROUSEL (Image 4 Concept)
           ═════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'carousel' && (
          <div className="relative">
            {/* Carousel Reel Track */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-3.5 overflow-x-auto pb-4 scrollbar-none scroll-smooth pr-14"
            >
              {filteredWatchlist.map((item) => {
                const isItemCompleted = item.isMultiSeason
                  ? !!(progress['loki-series']?.season1 && progress['loki-series']?.season2)
                  : !!progress[item.id]?.completed;

                const isNextWatch = nextWatchItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    className={`relative w-36 xs:w-40 sm:w-48 aspect-[2/3] shrink-0 border bg-[#0E1015] rounded-xs overflow-hidden shadow-xl cursor-pointer group transition-all duration-300 hover:scale-104 select-none ${isItemCompleted
                      ? 'border-[#22C55E]/60'
                      : isNextWatch
                        ? 'border-[#E62429] ring-2 ring-[#E62429]/40'
                        : 'border-[#1E252D] hover:border-[#22C55E]'
                      }`}
                    onClick={() => {
                      setActiveModalItem(item);
                      try { clockAudio.tick(0); } catch (e) { }
                    }}
                  >
                    <img
                      src={item.poster}
                      alt={item.title}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 ${isItemCompleted ? 'filter brightness-90' : 'filter brightness-80'
                        }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-85" />

                    {/* Chapter number */}
                    <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/85 border border-white/20 text-[9px] font-mono font-bold text-white uppercase rounded-xs">
                      {item.number}
                    </span>

                    {/* Watched check button directly on card */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.isMultiSeason) {
                          handleToggleLokiSeason('s1');
                          handleToggleLokiSeason('s2');
                        } else {
                          handleToggleStandard(item.id);
                        }
                      }}
                      className={`absolute top-2 right-2 min-w-[36px] min-h-[36px] p-1.5 rounded-xs flex items-center justify-center shadow-lg transition-all cursor-pointer ${isItemCompleted
                        ? 'bg-[#22C55E] text-black font-bold'
                        : 'bg-black/80 hover:bg-[#22C55E] hover:text-black text-white border border-white/20'
                        }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>

                    {/* Bottom label */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 text-left">
                      <p className="text-[8px] font-mono text-[#22C55E] font-bold uppercase truncate">
                        {item.year}
                      </p>
                      <h4 className="text-xs sm:text-sm font-cinematic font-bold text-white uppercase truncate leading-tight group-hover:text-white">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Slider Navigation Arrows */}
            <button
              type="button"
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-[#22C55E] bg-black/90 hover:bg-[#22C55E] text-[#22C55E] hover:text-black flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,197,94,0.6)] cursor-pointer z-10 shrink-0"
              aria-label="Scroll watchlist carousel prev"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-[#22C55E] bg-black/90 hover:bg-[#22C55E] text-[#22C55E] hover:text-black flex items-center justify-center transition-all shadow-[0_0_15px_rgba(34,197,94,0.6)] cursor-pointer z-10 shrink-0"
              aria-label="Scroll watchlist carousel next"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            6. VIEW MODE 3: COMPACT 15-MOVIE GRID OVERVIEW
           ═════════════════════════════════════════════════════════════════════ */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
            {filteredWatchlist.map((item) => {
              const isItemCompleted = item.isMultiSeason
                ? !!(progress['loki-series']?.season1 && progress['loki-series']?.season2)
                : !!progress[item.id]?.completed;

              return (
                <WatchlistItem
                  key={item.id}
                  item={item}
                  progress={progress}
                  isCompleted={isItemCompleted}
                  isNextWatch={nextWatchItem?.id === item.id}
                  onToggleStandard={handleToggleStandard}
                  onToggleLokiSeason={handleToggleLokiSeason}
                  onOpenDetails={(m) => {
                    setActiveModalItem(m);
                    try { clockAudio.tick(0); } catch (e) { }
                  }}
                />
              );
            })}
          </div>
        )}

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
