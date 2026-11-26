import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { WATCHLIST, WATCHLIST_ERAS } from '../data/watchlist';
import { clockAudio } from '../utils/audio.js';
import {
  ArrowLeft,
  X,
  Check,
  ListChecks,
  GitCommitVertical,
  ChevronDown,
  ChevronUp,
  Share2,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Film,
  Tv,
  Compass,
} from 'lucide-react';

function isChapterCompleted(item, progress) {
  if (item.isMultiSeason) {
    const loki = progress['loki-series'];
    return !!(loki?.season1 && loki?.season2);
  }
  return !!progress[item.id]?.completed;
}

/**
 * 15-Segment Architectural Multiverse Progress Ring
 * Each discrete arc segment around the ring corresponds to Chapters 01–15.
 */
function MultiverseProgressDial({ watchedCount, totalCount, percentage, items, progress, onJumpToChapter }) {
  const size = 148;
  const cx = size / 2;
  const cy = size / 2;
  const r = 56;
  const circumference = 2 * Math.PI * r;
  const gapPx = 4.5;
  const segLen = Math.max(4, circumference / totalCount - gapPx);

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        {items.map((item, idx) => {
          const done = isChapterCompleted(item, progress);
          const angleDeg = (360 / totalCount) * idx;
          return (
            <circle
              key={item.id}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              strokeWidth="6"
              strokeLinecap="butt"
              stroke={done ? '#22C55E' : '#1F242E'}
              strokeDasharray={`${segLen} ${circumference}`}
              transform={`rotate(${angleDeg} ${cx} ${cy})`}
              className="transition-colors duration-300 cursor-pointer hover:opacity-80"
              onClick={() => onJumpToChapter(item.id)}
            >
              <title>{`Ch. ${item.number}: ${item.title} (${done ? 'Watched' : 'Unwatched'})`}</title>
            </circle>
          );
        })}
        <circle cx={cx} cy={cy} r={45} fill="none" stroke="#181C24" strokeWidth="1" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <span className="font-hud text-3xl font-extrabold text-white tabular-nums leading-none">
          {percentage}%
        </span>
        <span className="text-[9px] font-mono tracking-[0.18em] text-[#8A909C] uppercase mt-1 tabular-nums">
          {watchedCount}/{totalCount} READY
        </span>
      </div>
    </div>
  );
}

export default function DoomsdayRoadmapModal({
  isOpen,
  onClose,
  progress,
  onToggleStandard,
  onToggleLokiSeason,
  onShare,
  copied,
  onOpenReset,
  initialView = 'checklist',
  initialFocusId = null,
}) {
  const [view, setView] = useState(initialView); // 'checklist' | 'timeline'
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'remaining' | 'completed'
  const [selectedEra, setSelectedEra] = useState('all');
  const [expandedIds, setExpandedIds] = useState(() => (initialFocusId ? { [initialFocusId]: true } : {}));
  const [hoveredPoster, setHoveredPoster] = useState(null);
  const rowRefs = useRef({});

  // Sync initial view & target chapter focus whenever reopened
  useEffect(() => {
    if (!isOpen) return;
    setView(initialView);
    if (initialFocusId) {
      setExpandedIds((prev) => ({ ...prev, [initialFocusId]: true }));
      const timer = setTimeout(() => {
        const el = rowRefs.current[initialFocusId];
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 90);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialView, initialFocusId]);

  // Escape closes and locks document body scrolling while open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  const { watchedCount, totalCount, percentage, remainingCount, nextUnwatched } = useMemo(() => {
    let done = 0;
    let firstPending = null;
    for (const item of WATCHLIST) {
      const ok = isChapterCompleted(item, progress);
      if (ok) {
        done += 1;
      } else if (!firstPending) {
        firstPending = item;
      }
    }
    const total = WATCHLIST.length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;
    return {
      watchedCount: done,
      totalCount: total,
      percentage: pct,
      remainingCount: Math.max(0, total - done),
      nextUnwatched: firstPending,
    };
  }, [progress]);

  const filteredChecklistItems = useMemo(() => {
    return WATCHLIST.filter((item) => {
      const done = isChapterCompleted(item, progress);
      if (filterMode === 'remaining') return !done;
      if (filterMode === 'completed') return done;
      return true;
    });
  }, [progress, filterMode]);

  const visibleEras = useMemo(() => {
    if (selectedEra === 'all') return WATCHLIST_ERAS;
    return WATCHLIST_ERAS.filter((era) => era.id === selectedEra);
  }, [selectedEra]);

  if (!isOpen) return null;

  const playClick = () => {
    try { clockAudio.tick(0); } catch { }
  };

  const handleViewChange = (nextView) => {
    playClick();
    setView(nextView);
  };

  const toggleExpand = (id) => {
    playClick();
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleItem = (item) => {
    if (item.isMultiSeason) {
      onToggleLokiSeason('toggle');
    } else {
      onToggleStandard(item.id);
    }
  };

  const handleMarkNext = () => {
    if (!nextUnwatched) return;
    handleToggleItem(nextUnwatched);
  };

  const handleJumpToChapter = (id) => {
    playClick();
    const el = rowRefs.current[id];
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const lokiState = progress['loki-series'] || {};
  const spotlightItem = nextUnwatched || WATCHLIST[WATCHLIST.length - 1];
  const activeBackdropPoster = hoveredPoster || spotlightItem?.poster || '/doomsday-ensemble-poster.jpg';

  const modalMarkup = (
    <div
      className="fixed inset-0 z-[90] bg-[#060709] text-[#F4F5F7] flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Road to Doomsday Checklist and Chronological Timeline"
    >
      {/* Dynamic Atmospheric Film-Still Key-Art Wash Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <img
          src={activeBackdropPoster}
          alt=""
          className="w-full h-[540px] object-cover object-[50%_20%] opacity-[0.15] blur-2xl scale-110 transition-all duration-700"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(6,7,9,0.52) 0%, rgba(6,7,9,0.92) 380px, #060709 620px)',
          }}
        />
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          TOP EDITORIAL COMMAND BAR WITH LARGE HIGH-CRAFT OPTION SWITCHER
         ═════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-[#08090C]/95 backdrop-blur-md border-b border-[#202530] px-4 sm:px-8 py-3.5 sm:py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          {/* Left: Back + Title */}
          <div className="flex items-center justify-between lg:justify-start gap-4">
            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="h-11 px-4 sm:px-5 bg-[#12151B] hover:bg-[#1B202A] border border-[#2C323F] hover:border-[#4B5565] text-[#E5E7EB] hover:text-white text-xs sm:text-sm font-display font-semibold tracking-[0.12em] uppercase inline-flex items-center gap-2 rounded-[3px] transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO SITE</span>
            </button>

            <div className="hidden sm:block text-left">
              <span className="text-[10px] font-mono tracking-[0.22em] text-[#848B98] uppercase block leading-none mb-1">
                OFFICIAL WATCH DOSSIER
              </span>
              <h2 className="text-base sm:text-lg font-cinematic font-bold text-white tracking-wide uppercase leading-none">
                YOUR ROAD TO DOOMSDAY
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Roadmap"
              className="lg:hidden h-11 w-11 bg-[#12151B] hover:bg-[#1C212B] border border-[#2C323F] text-[#D1D5DB] hover:text-white inline-flex items-center justify-center rounded-[3px] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* CENTER: LARGE WEIGHTED OPTION SWITCHER (CHECKLIST <-> TIMELINE) */}
          <div
            role="tablist"
            aria-label="Roadmap Display Mode"
            className="w-full lg:w-auto grid grid-cols-2 p-1.5 bg-[#050608] border border-[#2B303C] rounded-[4px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.65)]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === 'checklist'}
              onClick={() => handleViewChange('checklist')}
              className={`relative h-12 sm:h-14 px-5 sm:px-9 rounded-[3px] inline-flex items-center justify-center gap-2.5 text-xs sm:text-base font-display font-bold tracking-[0.14em] uppercase transition-all cursor-pointer ${view === 'checklist'
                  ? 'bg-[#F3F4F6] text-[#08090B] shadow-[0_4px_14px_rgba(0,0,0,0.5)]'
                  : 'text-[#8F96A3] hover:text-white hover:bg-[#12151C]'
                }`}
            >
              <ListChecks className={`w-4 h-4 sm:w-5 sm:h-5 ${view === 'checklist' ? 'text-[#08090B]' : 'text-[#8F96A3]'}`} />
              <span>CHECKLIST</span>
              {view === 'checklist' && (
                <span className="absolute bottom-0 inset-x-3 h-[3px] bg-[#16A34A]" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={view === 'timeline'}
              onClick={() => handleViewChange('timeline')}
              className={`relative h-12 sm:h-14 px-5 sm:px-9 rounded-[3px] inline-flex items-center justify-center gap-2.5 text-xs sm:text-base font-display font-bold tracking-[0.14em] uppercase transition-all cursor-pointer ${view === 'timeline'
                  ? 'bg-[#F3F4F6] text-[#08090B] shadow-[0_4px_14px_rgba(0,0,0,0.5)]'
                  : 'text-[#8F96A3] hover:text-white hover:bg-[#12151C]'
                }`}
            >
              <GitCommitVertical className={`w-4 h-4 sm:w-5 sm:h-5 ${view === 'timeline' ? 'text-[#08090B]' : 'text-[#8F96A3]'}`} />
              <span>TIMELINE</span>
              {view === 'timeline' && (
                <span className="absolute bottom-0 inset-x-3 h-[3px] bg-[#16A34A]" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* RIGHT (Desktop): Numeric Completion Readout + Close */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#7D8490] uppercase block leading-none mb-1">
                COMPLETION
              </span>
              <div className="inline-flex items-baseline gap-2">
                <span className="font-hud text-2xl font-extrabold text-white tabular-nums leading-none">
                  {watchedCount}/{totalCount}
                </span>
                <span className="font-hud text-xl font-bold text-[#22C55E] tabular-nums leading-none">
                  {percentage}%
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close Roadmap"
              className="h-11 w-11 bg-[#12151B] hover:bg-[#1C212B] border border-[#2C323F] hover:border-[#4B5565] text-[#D1D5DB] hover:text-white inline-flex items-center justify-center rounded-[3px] transition-colors cursor-pointer"
              title="Close (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════════════
          SCROLLABLE VIEWPORT BODY
         ═════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto">

          {/* CREATIVE TWO-PANEL CINEMA SPOTLIGHT + 15-SEGMENT MULTIVERSE DIAL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-7 sm:mb-9">
            {/* LEFT PANEL (7 cols): RECOMMENDED NEXT WATCH SPOTLIGHT */}
            <div className="lg:col-span-7 relative overflow-hidden bg-[#0B0D12]/95 border border-[#222834] rounded-[3px] p-5 sm:p-6 flex flex-col justify-between shadow-2xl">
              <span className="text-[10px] font-mono tracking-[0.22em] text-[#34D399] uppercase block mb-3">
                {view === 'checklist' ? 'CHAPTER VERIFICATION LEDGER' : 'MULTIVERSE CHRONOLOGICAL SEQUENCE'}
              </span>

              {nextUnwatched ? (
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                  <div className="w-24 h-36 sm:w-28 sm:h-40 shrink-0 rounded-[2px] border border-[#2E3646] overflow-hidden bg-[#060709] shadow-xl">
                    <img
                      src={nextUnwatched.poster}
                      alt={nextUnwatched.title}
                      className="w-full h-full object-cover object-top brightness-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-[10.5px] font-mono tracking-[0.16em] text-[#8C93A0] uppercase mb-1">
                        <span className="text-[#F3F4F6] font-bold">UP NEXT · CH. {nextUnwatched.number}</span>
                        <span>•</span>
                        <span>{nextUnwatched.year}</span>
                        {nextUnwatched.reality && (
                          <>
                            <span>•</span>
                            <span className="text-[#34D399]">{nextUnwatched.reality}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-cinematic font-black text-white leading-tight mb-2">
                        {nextUnwatched.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#A2A8B5] leading-relaxed mb-4">
                        {nextUnwatched.doomsdayLink || nextUnwatched.narrativeSignificance}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleMarkNext}
                        className="h-11 px-5 bg-[#16A34A] hover:bg-[#22C55E] text-white text-xs sm:text-sm font-display font-bold tracking-[0.12em] uppercase rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer shadow-[0_6px_18px_rgba(22,163,74,0.28)]"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>MARK CH. {nextUnwatched.number} WATCHED</span>
                      </button>

                      {nextUnwatched.isMultiSeason && (
                        <>
                          <button
                            type="button"
                            onClick={() => onToggleLokiSeason('s1')}
                            className={`h-11 px-3.5 border rounded-[3px] text-xs font-mono font-bold uppercase cursor-pointer ${lokiState.season1
                                ? 'bg-[#132A1B] border-[#22C55E] text-[#4ADE80]'
                                : 'bg-[#12151C] border-[#2E3442] text-[#D1D5DB]'
                              }`}
                          >
                            {lokiState.season1 ? '✓ S1' : 'S1'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleLokiSeason('s2')}
                            className={`h-11 px-3.5 border rounded-[3px] text-xs font-mono font-bold uppercase cursor-pointer ${lokiState.season2
                                ? 'bg-[#132A1B] border-[#22C55E] text-[#4ADE80]'
                                : 'bg-[#12151C] border-[#2E3442] text-[#D1D5DB]'
                              }`}
                          >
                            {lokiState.season2 ? '✓ S2' : 'S2'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-24 h-36 sm:w-28 sm:h-40 shrink-0 rounded-[2px] border border-[#22C55E]/70 overflow-hidden bg-[#060709] shadow-xl">
                    <img
                      src="/doctor-doom-stained-glass.jpg"
                      alt="Avengers Doomsday"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-mono tracking-[0.2em] text-[#22C55E] uppercase mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>100% CONVERGENCE ACHIEVED</span>
                    </span>
                    <h3 className="text-xl sm:text-2xl font-cinematic font-black text-white uppercase mb-1.5">
                      TIMELINES SYNCHRONIZED FOR DOOMSDAY
                    </h3>
                    <p className="text-xs sm:text-sm text-[#A2A8B5] leading-relaxed">
                      Every essential X-Men, Avengers, Loki &amp; Multiverse chapter is checked off. You are ready for December 18, 2026.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL (5 cols): 15-TICK MULTIVERSE SVG READINESS DIAL & CONTROLS */}
            <div className="lg:col-span-5 bg-[#0B0D12]/95 border border-[#222834] rounded-[3px] p-5 sm:p-6 flex flex-col justify-between gap-4 shadow-2xl">
              <div className="flex items-center gap-5">
                <MultiverseProgressDial
                  watchedCount={watchedCount}
                  totalCount={totalCount}
                  percentage={percentage}
                  items={WATCHLIST}
                  progress={progress}
                  onJumpToChapter={handleJumpToChapter}
                />

                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-[#848B98] uppercase block mb-1">
                    SECTOR STATUS
                  </span>
                  <h3 className="font-hud text-xl sm:text-2xl font-extrabold text-white tracking-wide uppercase tabular-nums leading-tight">
                    {watchedCount} OF {totalCount} CHAPTERS CLEARED
                  </h3>
                  <p className="text-xs font-mono text-[#9BA1AE] uppercase mt-1">
                    {remainingCount === 0
                      ? 'ALL PREREQUISITES COMPLETE'
                      : `${remainingCount} REMAINING FOR DEC 18, 2026`}
                  </p>
                  <p className="text-[10px] font-mono text-[#6B7280] mt-2">
                    Click any ring segment to jump to chapter
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-[#1D222C]">
                <button
                  type="button"
                  onClick={onShare}
                  className="flex-1 h-11 px-4 bg-[#13161E] hover:bg-[#1B202B] border border-[#2B313F] text-[#E5E7EB] hover:text-white text-xs font-display font-bold tracking-[0.12em] uppercase rounded-[3px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#22C55E]" />
                  <span>{copied ? 'COPIED TO CLIPBOARD' : 'SHARE PROGRESS'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onOpenReset();
                  }}
                  className="h-11 px-4 bg-[#13161E] hover:bg-[#1F1416] border border-[#2B313F] hover:border-[#DC2626] text-[#9BA1AE] hover:text-[#F87171] text-xs font-display font-bold tracking-[0.12em] uppercase rounded-[3px] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESET</span>
                </button>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════════════
              MODE 1: STRUCTURED CHECKLIST VIEW
             ═════════════════════════════════════════════════════════════════ */}
          {view === 'checklist' && (
            <div>
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <div
                  className="inline-flex p-1 bg-[#0B0D11] border border-[#252A35] rounded-[4px]"
                  role="group"
                  aria-label="Checklist Filter"
                >
                  {[
                    { id: 'all', label: `ALL (${totalCount})` },
                    { id: 'remaining', label: `TO WATCH (${remainingCount})` },
                    { id: 'completed', label: `WATCHED (${watchedCount})` },
                  ].map((tab) => {
                    const active = filterMode === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          playClick();
                          setFilterMode(tab.id);
                        }}
                        className={`h-11 px-4 sm:px-6 text-xs sm:text-sm font-display font-bold tracking-[0.1em] uppercase rounded-[3px] transition-colors cursor-pointer ${active
                            ? 'bg-[#F3F4F6] text-[#08090B]'
                            : 'text-[#8F96A3] hover:text-white hover:bg-[#14171F]'
                          }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                <span className="text-xs font-mono text-[#7D8490] uppercase tracking-wider">
                  SHOWING {filteredChecklistItems.length} OF {totalCount} CHAPTERS
                </span>
              </div>

              {filteredChecklistItems.length === 0 ? (
                <div className="bg-[#0B0D12] border border-[#20242D] rounded-[3px] p-10 text-center">
                  <p className="text-base font-display font-semibold text-white mb-2">
                    {filterMode === 'remaining'
                      ? 'Every chapter on the Road to Doomsday is checked off.'
                      : 'No chapters marked as watched yet.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setFilterMode('all');
                    }}
                    className="mt-3 h-11 px-6 bg-[#F3F4F6] text-[#08090B] text-xs font-display font-bold tracking-[0.12em] uppercase rounded-[3px] cursor-pointer"
                  >
                    SHOW ALL 15 CHAPTERS
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredChecklistItems.map((item) => {
                    const done = isChapterCompleted(item, progress);
                    const isFocused = initialFocusId === item.id;
                    const isExpanded = !!expandedIds[item.id];

                    return (
                      <div
                        key={item.id}
                        ref={(el) => { rowRefs.current[item.id] = el; }}
                        onMouseEnter={() => setHoveredPoster(item.poster)}
                        className={`relative overflow-hidden bg-[#0B0D12]/95 border rounded-[3px] transition-colors ${done
                            ? 'border-[#1F4A31]'
                            : isFocused
                              ? 'border-[#E5E7EB]'
                              : 'border-[#202530] hover:border-[#374050]'
                          }`}
                      >
                        {/* Architectural Index Watermark */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none select-none absolute -bottom-3 right-3 font-hud text-6xl sm:text-7xl font-black text-white/[0.03] leading-none"
                        >
                          {item.number}
                        </span>

                        <div className="relative z-10 p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4">
                          {/* Left: Checkbox + Clear Film Frame + Info */}
                          <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => handleToggleItem(item)}
                              aria-pressed={done}
                              aria-label={`${done ? 'Uncheck' : 'Mark'} ${item.title} watched`}
                              className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-[3px] border-2 inline-flex items-center justify-center transition-colors cursor-pointer mt-0.5 ${done
                                  ? 'bg-[#16A34A] border-[#22C55E] text-white'
                                  : 'bg-[#08090B] border-[#384050] hover:border-[#D1D5DB] text-transparent hover:text-[#6B7280]'
                                }`}
                            >
                              <Check className="w-5 h-5 stroke-[3]" />
                            </button>

                            <div className="w-16 h-24 sm:w-20 sm:h-28 shrink-0 overflow-hidden border border-[#272D3B] bg-[#07080B] rounded-[2px] shadow-md">
                              <img
                                src={item.poster}
                                alt={item.title}
                                loading="lazy"
                                className="w-full h-full object-cover object-top brightness-105"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-mono tracking-[0.12em] text-[#848B98] uppercase mb-1">
                                <span className="text-[#F3F4F6] font-bold">CH. {item.number}</span>
                                <span>•</span>
                                <span>{item.year}</span>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1">
                                  {item.type === 'Series' ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                                  {item.type}
                                </span>
                                {item.reality && (
                                  <>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline text-[#9CA3AF]">{item.reality}</span>
                                  </>
                                )}
                              </div>

                              <h4
                                className={`text-base sm:text-xl font-cinematic font-bold tracking-wide leading-snug mb-1 ${done ? 'text-[#D1FAE5]' : 'text-white'
                                  }`}
                              >
                                {item.title}
                              </h4>

                              <p className="text-xs sm:text-sm text-[#9BA1AE] leading-relaxed">
                                {item.narrativeSignificance}
                              </p>

                              {/* Loki Dual Season Checkboxes */}
                              {item.isMultiSeason && (
                                <div className="mt-3 flex flex-wrap gap-2.5">
                                  <button
                                    type="button"
                                    onClick={() => onToggleLokiSeason('s1')}
                                    aria-pressed={!!lokiState.season1}
                                    className={`h-11 px-4 rounded-[3px] border text-xs font-display font-bold tracking-[0.1em] uppercase inline-flex items-center gap-2 transition-colors cursor-pointer ${lokiState.season1
                                        ? 'bg-[#16A34A] border-[#22C55E] text-white'
                                        : 'bg-[#08090B] border-[#303746] text-[#C4C9D4] hover:border-[#9CA3AF]'
                                      }`}
                                  >
                                    <Check className={`w-4 h-4 ${lokiState.season1 ? 'opacity-100' : 'opacity-30'}`} />
                                    <span>SEASON 1 (2021)</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => onToggleLokiSeason('s2')}
                                    aria-pressed={!!lokiState.season2}
                                    className={`h-11 px-4 rounded-[3px] border text-xs font-display font-bold tracking-[0.1em] uppercase inline-flex items-center gap-2 transition-colors cursor-pointer ${lokiState.season2
                                        ? 'bg-[#16A34A] border-[#22C55E] text-white'
                                        : 'bg-[#08090B] border-[#303746] text-[#C4C9D4] hover:border-[#9CA3AF]'
                                      }`}
                                  >
                                    <Check className={`w-4 h-4 ${lokiState.season2 ? 'opacity-100' : 'opacity-30'}`} />
                                    <span>SEASON 2 (2023)</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right: Large Action Controls */}
                          <div className="flex items-center gap-2.5 md:flex-col md:items-stretch shrink-0 pl-14 sm:pl-16 md:pl-0">
                            <button
                              type="button"
                              onClick={() => handleToggleItem(item)}
                              className={`h-11 px-5 rounded-[3px] border text-xs sm:text-sm font-display font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${done
                                  ? 'bg-[#132A1B] border-[#22C55E]/70 text-[#4ADE80] hover:bg-[#193824]'
                                  : 'bg-[#F3F4F6] border-[#F3F4F6] text-[#08090B] hover:bg-white'
                                }`}
                            >
                              {done && <Check className="w-4 h-4 stroke-[2.5]" />}
                              <span>{done ? 'WATCHED' : 'CHECK OFF'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => toggleExpand(item.id)}
                              className="h-11 px-4 bg-[#12151C] hover:bg-[#1B1F29] border border-[#282E3A] text-[#C4C9D4] hover:text-white text-xs font-display font-semibold tracking-[0.12em] uppercase rounded-[3px] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <span>DOSSIER</span>
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Editorial Dossier Drawer */}
                        {isExpanded && (
                          <div className="relative z-10 px-4 sm:px-5 pb-5 pt-3 border-t border-[#1A1E26] bg-[#080A0D] grid grid-cols-1 md:grid-cols-12 gap-4">
                            {item.isMultiSeason ? (
                              <div className="md:col-span-3 flex gap-2">
                                <img src={item.posterSeason1} alt="Loki Season 1" className="w-1/2 aspect-[2/3] object-cover border border-[#242934] rounded-[2px]" />
                                <img src={item.posterSeason2} alt="Loki Season 2" className="w-1/2 aspect-[2/3] object-cover border border-[#242934] rounded-[2px]" />
                              </div>
                            ) : null}

                            <div className={item.isMultiSeason ? 'md:col-span-9 space-y-2' : 'md:col-span-12 space-y-2'}>
                              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-mono text-[#8A909C]">
                                {item.tagline && <span>TAGLINE: &ldquo;{item.tagline}&rdquo;</span>}
                                {item.inUniverseTime && <span>TIMELINE SLOT: {item.inUniverseTime}</span>}
                              </div>
                              {item.doomsdayLink && (
                                <p className="text-xs sm:text-sm text-[#E5E7EB] leading-relaxed">
                                  <strong className="font-mono text-[11px] tracking-[0.14em] uppercase text-[#22C55E] mr-2">
                                    DOOMSDAY CONNECTION //
                                  </strong>
                                  {item.doomsdayLink}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════════════
              MODE 2: CHRONOLOGICAL MULTIVERSE TIMELINE VIEW
             ═════════════════════════════════════════════════════════════════ */}
          {view === 'timeline' && (
            <div>
              {/* Large Era Filter Controls */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setSelectedEra('all');
                  }}
                  className={`h-11 px-5 rounded-[3px] border text-xs sm:text-sm font-display font-bold tracking-[0.12em] uppercase transition-colors cursor-pointer inline-flex items-center gap-2 ${selectedEra === 'all'
                      ? 'bg-[#F3F4F6] border-[#F3F4F6] text-[#08090B]'
                      : 'bg-[#0D0F14] border-[#262B36] text-[#9BA1AE] hover:text-white hover:border-[#4B5565]'
                    }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>ALL ERAS (I–IV)</span>
                </button>
                {WATCHLIST_ERAS.map((era) => {
                  const active = selectedEra === era.id;
                  return (
                    <button
                      key={era.id}
                      type="button"
                      onClick={() => {
                        playClick();
                        setSelectedEra(era.id);
                      }}
                      className={`h-11 px-4 sm:px-5 rounded-[3px] border text-xs sm:text-sm font-display font-bold tracking-[0.12em] uppercase transition-colors cursor-pointer ${active
                          ? 'bg-[#F3F4F6] border-[#F3F4F6] text-[#08090B]'
                          : 'bg-[#0D0F14] border-[#262B36] text-[#9BA1AE] hover:text-white hover:border-[#4B5565]'
                        }`}
                    >
                      {era.index} · {era.years}
                    </button>
                  );
                })}
              </div>

              {/* Architectural Chronological Spine */}
              <div className="space-y-12">
                {visibleEras.map((era) => {
                  const eraItems = WATCHLIST.filter((item) => item.eraId === era.id);
                  const eraDoneCount = eraItems.filter((item) => isChapterCompleted(item, progress)).length;
                  const eraPct = Math.round((eraDoneCount / Math.max(1, eraItems.length)) * 100);

                  return (
                    <section key={era.id} aria-label={era.title}>
                      {/* Era Editorial Header Banner */}
                      <div className="relative overflow-hidden border-l-4 border-[#F3F4F6] bg-[#0B0D12] border-y border-r border-[#222733] px-5 sm:px-6 py-4 sm:py-5 mb-7 rounded-r-[3px]">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-[0.22em] text-[#8A909C] uppercase mb-1">
                              <span className="text-[#34D399] font-bold">{era.index}</span>
                              <span>•</span>
                              <span>{era.years}</span>
                            </div>
                            <h3 className="text-lg sm:text-2xl font-cinematic font-black text-white uppercase tracking-wide">
                              {era.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-[#9BA1AE] mt-1">
                              {era.summary}
                            </p>
                          </div>

                          <div className="shrink-0 text-left sm:text-right">
                            <div className="font-hud text-2xl sm:text-3xl font-extrabold text-white tabular-nums leading-none">
                              {eraDoneCount}/{eraItems.length}
                            </div>
                            <span className="text-[10px] font-mono text-[#7D8490] uppercase tracking-wider">
                              {eraPct}% COMPLETE
                            </span>
                          </div>
                        </div>

                        <div className="mt-3.5 h-1 bg-[#171B22] rounded-[1px] overflow-hidden">
                          <div
                            className="h-full bg-[#22C55E] transition-all duration-300"
                            style={{ width: `${eraPct}%` }}
                          />
                        </div>
                      </div>

                      {/* Vertical Illuminated Timeline Milestones */}
                      <div className="relative pl-7 sm:pl-44 space-y-6">
                        {eraItems.map((item, idx) => {
                          const done = isChapterCompleted(item, progress);
                          const isLastInEra = idx === eraItems.length - 1;
                          return (
                            <div
                              key={item.id}
                              ref={(el) => { rowRefs.current[item.id] = el; }}
                              onMouseEnter={() => setHoveredPoster(item.poster)}
                              className="relative"
                            >
                              {/* Per-Segment Dynamic Spine Line (lit emerald if watched, slate if pending) */}
                              {!isLastInEra && (
                                <div
                                  aria-hidden="true"
                                  className={`absolute -left-[17px] sm:-left-[28px] top-8 -bottom-7 w-[2px] ${done ? 'bg-[#22C55E]/75' : 'bg-[#222630]'
                                    }`}
                                />
                              )}

                              {/* Desktop Left Year & Continuity Gutter */}
                              <div className="hidden sm:flex flex-col items-end text-right absolute -left-44 top-4 w-32 pr-4">
                                <span className={`font-hud text-2xl font-extrabold tracking-wide tabular-nums leading-none ${done ? 'text-[#4ADE80]' : 'text-white'
                                  }`}>
                                  {item.year}
                                </span>
                                <span className="text-[10px] font-mono text-[#7D8490] uppercase tracking-wider mt-1.5 leading-tight">
                                  {item.reality}
                                </span>
                              </div>

                              {/* Precision Reticle Spine Node Marker */}
                              <button
                                type="button"
                                onClick={() => handleToggleItem(item)}
                                aria-label={`Toggle timeline node ${item.title}`}
                                className={`absolute -left-[29px] sm:-left-[40px] top-4 w-7 h-7 rounded-[3px] border-2 inline-flex items-center justify-center transition-all cursor-pointer z-10 ${done
                                    ? 'bg-[#16A34A] border-[#4ADE80] text-white shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                                    : 'bg-[#08090B] border-[#4B5565] hover:border-white text-transparent'
                                  }`}
                              >
                                <Check className="w-4 h-4 stroke-[3]" />
                              </button>

                              {/* Theatrical Collector Timeline Card */}
                              <div
                                className={`group relative overflow-hidden bg-[#0B0D12]/95 border rounded-[3px] p-4 sm:p-5 transition-all ${done ? 'border-[#1F4A31]' : 'border-[#202530] hover:border-[#394254]'
                                  }`}
                              >
                                {/* Subtle Poster Backdrop Atmosphere Inside Card */}
                                <img
                                  src={item.poster}
                                  alt=""
                                  aria-hidden="true"
                                  className="pointer-events-none select-none absolute right-0 top-0 h-full w-48 object-cover object-top opacity-[0.06] blur-[1px]"
                                />

                                <div className="relative z-10 flex flex-col sm:flex-row gap-4 sm:gap-5">
                                  <div className="flex items-start gap-4 flex-1 min-w-0">
                                    {/* Larger Uncropped Cinema Poster Frame */}
                                    <div className="relative w-20 h-28 sm:w-24 sm:h-36 shrink-0 overflow-hidden border border-[#2A3140] bg-[#060709] rounded-[2px] shadow-lg">
                                      <img
                                        src={item.poster}
                                        alt={item.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover object-top brightness-105 group-hover:scale-105 transition-transform duration-500"
                                      />
                                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/85 border border-white/15 font-mono font-bold text-[9px] text-white rounded-[1px]">
                                        #{item.number}
                                      </span>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono tracking-[0.14em] text-[#848B98] uppercase mb-1">
                                        <span className="text-[#F3F4F6] font-bold">CHAPTER {item.number}</span>
                                        <span className="sm:hidden">• {item.year}</span>
                                        <span>•</span>
                                        <span>{item.inUniverseTime || item.year}</span>
                                      </div>

                                      <h4 className="text-lg sm:text-2xl font-cinematic font-black text-white leading-snug mb-1">
                                        {item.title}
                                      </h4>

                                      {item.tagline && (
                                        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#7D8490] italic mb-2">
                                          &ldquo;{item.tagline}&rdquo;
                                        </p>
                                      )}

                                      <p className="text-xs sm:text-sm text-[#A1A7B3] leading-relaxed mb-3">
                                        {item.narrativeSignificance}
                                      </p>

                                      {item.doomsdayLink && (
                                        <div className="bg-[#080A0E] border-l-2 border-[#22C55E] px-3 py-2 rounded-r-[2px] text-xs sm:text-sm text-[#E5E7EB]">
                                          <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#4ADE80] block mb-0.5">
                                            DOOMSDAY TRAJECTORY
                                          </span>
                                          {item.doomsdayLink}
                                        </div>
                                      )}

                                      {item.isMultiSeason && (
                                        <div className="mt-3 flex flex-wrap gap-2.5">
                                          <button
                                            type="button"
                                            onClick={() => onToggleLokiSeason('s1')}
                                            className={`h-11 px-4 rounded-[3px] border text-xs font-display font-bold tracking-[0.1em] uppercase inline-flex items-center gap-2 transition-colors cursor-pointer ${lokiState.season1
                                                ? 'bg-[#16A34A] border-[#22C55E] text-white'
                                                : 'bg-[#08090B] border-[#303746] text-[#C4C9D4] hover:border-[#9CA3AF]'
                                              }`}
                                          >
                                            <Check className={`w-4 h-4 ${lokiState.season1 ? 'opacity-100' : 'opacity-30'}`} />
                                            <span>SEASON 1</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => onToggleLokiSeason('s2')}
                                            className={`h-11 px-4 rounded-[3px] border text-xs font-display font-bold tracking-[0.1em] uppercase inline-flex items-center gap-2 transition-colors cursor-pointer ${lokiState.season2
                                                ? 'bg-[#16A34A] border-[#22C55E] text-white'
                                                : 'bg-[#08090B] border-[#303746] text-[#C4C9D4] hover:border-[#9CA3AF]'
                                              }`}
                                          >
                                            <Check className={`w-4 h-4 ${lokiState.season2 ? 'opacity-100' : 'opacity-30'}`} />
                                            <span>SEASON 2</span>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="shrink-0 flex sm:flex-col justify-end">
                                    <button
                                      type="button"
                                      onClick={() => handleToggleItem(item)}
                                      className={`h-11 px-5 rounded-[3px] border text-xs sm:text-sm font-display font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${done
                                          ? 'bg-[#132A1B] border-[#22C55E]/75 text-[#4ADE80] hover:bg-[#193824]'
                                          : 'bg-[#F3F4F6] border-[#F3F4F6] text-[#08090B] hover:bg-white'
                                        }`}
                                    >
                                      {done && <Check className="w-4 h-4 stroke-[2.5]" />}
                                      <span>{done ? 'WATCHED' : 'MARK WATCHED'}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  );
                })}

                {/* MONUMENTAL CONVERGENCE CAPSTONE: AVENGERS DOOMSDAY */}
                <div className="relative overflow-hidden bg-[#0B0E12] border-2 border-[#253B30] rounded-[3px] p-6 sm:p-8 shadow-2xl">
                  <img
                    src="/doctor-doom-stained-glass.jpg"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none select-none absolute right-0 top-0 h-full w-1/2 object-cover object-top opacity-[0.16]"
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(90deg, #0B0E12 45%, rgba(11,14,18,0.55) 100%)',
                    }}
                  />

                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                      <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-[#22C55E] uppercase mb-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>TIMELINE CONVERGENCE • 18 DECEMBER 2026</span>
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-cinematic font-black text-metallic uppercase tracking-wide">
                        AVENGERS: DOOMSDAY
                      </h3>
                      <p className="text-xs sm:text-sm text-[#A4ACB8] mt-1 max-w-xl">
                        {watchedCount === totalCount
                          ? 'All 15 Multiverse chapters completed. All timelines synchronized.'
                          : `${watchedCount} of ${totalCount} prerequisite chapters completed toward the Multiverse culmination.`}
                      </p>

                      {/* 15-Chapter Convergence Light-Bar */}
                      <div className="mt-4 flex items-center gap-1 max-w-sm">
                        {WATCHLIST.map((ch) => {
                          const ok = isChapterCompleted(ch, progress);
                          return (
                            <span
                              key={ch.id}
                              title={`Ch. ${ch.number}: ${ch.title}`}
                              className={`h-2 flex-1 rounded-[1px] ${ok ? 'bg-[#22C55E]' : 'bg-[#1E242E]'}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="font-hud text-4xl sm:text-5xl font-extrabold text-white tabular-nums block leading-none">
                        {percentage}%
                      </span>
                      <span className="text-[10px] font-mono tracking-[0.2em] text-[#4ADE80] uppercase mt-1 block">
                        CONVERGENCE READY
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalMarkup, document.body);
  }
  return modalMarkup;
}
