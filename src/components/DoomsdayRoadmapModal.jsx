import React, { useState, useEffect, useMemo, useRef } from 'react';
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
} from 'lucide-react';

function isChapterCompleted(item, progress) {
  if (item.isMultiSeason) {
    const loki = progress['loki-series'];
    return !!(loki?.season1 && loki?.season2);
  }
  return !!progress[item.id]?.completed;
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

  const lokiState = progress['loki-series'] || {};

  return (
    <div
      className="fixed inset-0 z-50 bg-[#07080A] text-[#F4F5F7] flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Road to Doomsday Checklist and Chronological Timeline"
    >
      {/* ═════════════════════════════════════════════════════════════════════
          TOP EDITORIAL COMMAND BAR WITH LARGE HIGH-CRAFT OPTION SWITCHER
         ═════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 bg-[#0A0B0E]/98 border-b border-[#20242D] px-4 sm:px-8 py-3.5 sm:py-4 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3.5">
          {/* Top Row (Mobile: Back + Title + Close | Desktop: Left Back + Title) */}
          <div className="flex items-center justify-between lg:justify-start gap-4">
            <button
              type="button"
              onClick={() => {
                playClick();
                onClose();
              }}
              className="h-11 px-4 sm:px-5 bg-[#12141A] hover:bg-[#1B1F28] border border-[#2B303C] hover:border-[#4B5565] text-[#E5E7EB] hover:text-white text-xs sm:text-sm font-display font-semibold tracking-[0.12em] uppercase inline-flex items-center gap-2 rounded-[3px] transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>BACK TO SITE</span>
            </button>

            <div className="hidden sm:block text-left">
              <span className="text-[10px] font-mono tracking-[0.22em] text-[#7D8490] uppercase block leading-none mb-1">
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
              className="lg:hidden h-11 w-11 bg-[#12141A] hover:bg-[#1C2029] border border-[#2B303C] text-[#D1D5DB] hover:text-white inline-flex items-center justify-center rounded-[3px] transition-colors cursor-pointer"
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
              className={`relative h-12 sm:h-14 px-5 sm:px-9 rounded-[3px] inline-flex items-center justify-center gap-2.5 text-xs sm:text-base font-display font-bold tracking-[0.14em] uppercase transition-all cursor-pointer ${
                view === 'checklist'
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
              className={`relative h-12 sm:h-14 px-5 sm:px-9 rounded-[3px] inline-flex items-center justify-center gap-2.5 text-xs sm:text-base font-display font-bold tracking-[0.14em] uppercase transition-all cursor-pointer ${
                view === 'timeline'
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
              className="h-11 w-11 bg-[#12141A] hover:bg-[#1C2029] border border-[#2B303C] hover:border-[#4B5565] text-[#D1D5DB] hover:text-white inline-flex items-center justify-center rounded-[3px] transition-colors cursor-pointer"
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
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-10">
        <div className="max-w-5xl mx-auto">

          {/* Shared Clean Completion Ledger Strip */}
          <div className="bg-[#0C0E12] border border-[#20242D] rounded-[3px] p-5 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
              <div>
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#8A909C] uppercase block mb-1">
                  {view === 'checklist' ? 'CHAPTER VERIFICATION LEDGER' : 'MULTIVERSE CHRONOLOGICAL SEQUENCE'}
                </span>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h3 className="font-hud text-2xl sm:text-3xl font-extrabold text-white tracking-wide uppercase tabular-nums">
                    {watchedCount} OF {totalCount} CHAPTERS CLEARED
                  </h3>
                  <span className="font-mono text-xs sm:text-sm text-[#8A909C] uppercase">
                    {remainingCount === 0
                      ? 'ALL PREREQUISITES COMPLETE'
                      : `${remainingCount} REMAINING FOR DEC 18, 2026`}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {nextUnwatched && (
                  <button
                    type="button"
                    onClick={handleMarkNext}
                    className="h-11 px-5 bg-[#F3F4F6] hover:bg-white text-[#08090B] text-xs sm:text-sm font-display font-bold tracking-[0.1em] uppercase rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    <span>CHECK NEXT: #{nextUnwatched.number}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onShare}
                  className="h-11 px-4 bg-[#12151C] hover:bg-[#1A1E28] border border-[#2A2F3B] text-[#E5E7EB] hover:text-white text-xs sm:text-sm font-display font-semibold tracking-[0.1em] uppercase rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#22C55E]" />
                  <span>{copied ? 'COPIED' : 'SHARE'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onOpenReset();
                  }}
                  className="h-11 px-4 bg-[#12151C] hover:bg-[#1E1416] border border-[#2A2F3B] hover:border-[#DC2626] text-[#9BA1AE] hover:text-[#F87171] text-xs sm:text-sm font-display font-semibold tracking-[0.1em] uppercase rounded-[3px] inline-flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RESET</span>
                </button>
              </div>
            </div>

            <div className="w-full h-2 bg-[#161920] rounded-[2px] overflow-hidden">
              <div
                className="h-full bg-[#22C55E] transition-all duration-300 ease-out"
                style={{ width: `${percentage}%` }}
              />
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
                        className={`h-11 px-4 sm:px-6 text-xs sm:text-sm font-display font-bold tracking-[0.1em] uppercase rounded-[3px] transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#E5E7EB] text-[#08090B]'
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
                <div className="bg-[#0C0E12] border border-[#20242D] rounded-[3px] p-10 text-center">
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
                        className={`bg-[#0C0E12] border rounded-[3px] transition-colors ${
                          done
                            ? 'border-[#1F402C]'
                            : isFocused
                              ? 'border-[#D1D5DB]'
                              : 'border-[#20242D] hover:border-[#323846]'
                        }`}
                      >
                        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center gap-4">
                          {/* Left: Heavyweight Checkbox + Poster + Main Info */}
                          <div className="flex items-start gap-3.5 sm:gap-4 flex-1 min-w-0">
                            <button
                              type="button"
                              onClick={() => handleToggleItem(item)}
                              aria-pressed={done}
                              aria-label={`${done ? 'Uncheck' : 'Mark'} ${item.title} watched`}
                              className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-[3px] border-2 inline-flex items-center justify-center transition-colors cursor-pointer mt-0.5 ${
                                done
                                  ? 'bg-[#16A34A] border-[#22C55E] text-white'
                                  : 'bg-[#08090B] border-[#384050] hover:border-[#9CA3AF] text-transparent hover:text-[#6B7280]'
                              }`}
                            >
                              <Check className="w-5 h-5 stroke-[3]" />
                            </button>

                            <div className="w-14 h-20 sm:w-16 sm:h-24 shrink-0 overflow-hidden border border-[#232834] bg-[#08090B] rounded-[2px]">
                              <img
                                src={item.poster}
                                alt={item.title}
                                loading="lazy"
                                className={`w-full h-full object-cover ${done ? 'opacity-90' : ''}`}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-mono tracking-[0.12em] text-[#848B98] uppercase mb-1">
                                <span className="text-[#D1D5DB] font-bold">CH. {item.number}</span>
                                <span>•</span>
                                <span>{item.year}</span>
                                <span>•</span>
                                <span>{item.type}</span>
                                {item.reality && (
                                  <>
                                    <span className="hidden sm:inline">•</span>
                                    <span className="hidden sm:inline">{item.reality}</span>
                                  </>
                                )}
                              </div>

                              <h4
                                className={`text-base sm:text-xl font-cinematic font-bold tracking-wide leading-snug mb-1 ${
                                  done ? 'text-[#D1FAE5]' : 'text-white'
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
                                    className={`h-11 px-4 rounded-[3px] border text-xs font-display font-bold tracking-[0.1em] uppercase inline-flex items-center gap-2 transition-colors cursor-pointer ${
                                      lokiState.season1
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
                                    className={`h-11 px-4 rounded-[3px] border text-xs font-display font-bold tracking-[0.1em] uppercase inline-flex items-center gap-2 transition-colors cursor-pointer ${
                                      lokiState.season2
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
                              className={`h-11 px-5 rounded-[3px] border text-xs sm:text-sm font-display font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                                done
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
                          <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-[#1A1E26] bg-[#090B0E] grid grid-cols-1 md:grid-cols-12 gap-4">
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
                  className={`h-11 px-5 rounded-[3px] border text-xs sm:text-sm font-display font-bold tracking-[0.12em] uppercase transition-colors cursor-pointer ${
                    selectedEra === 'all'
                      ? 'bg-[#F3F4F6] border-[#F3F4F6] text-[#08090B]'
                      : 'bg-[#0D0F14] border-[#262B36] text-[#9BA1AE] hover:text-white hover:border-[#4B5565]'
                  }`}
                >
                  ALL ERAS (I–IV)
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
                      className={`h-11 px-4 sm:px-5 rounded-[3px] border text-xs sm:text-sm font-display font-bold tracking-[0.12em] uppercase transition-colors cursor-pointer ${
                        active
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
              <div className="space-y-10">
                {visibleEras.map((era) => {
                  const eraItems = WATCHLIST.filter((item) => item.eraId === era.id);
                  const eraDoneCount = eraItems.filter((item) => isChapterCompleted(item, progress)).length;

                  return (
                    <section key={era.id} aria-label={era.title}>
                      {/* Era Editorial Header */}
                      <div className="border-l-4 border-[#F3F4F6] bg-[#0C0E12] border-y border-r border-[#20242D] px-5 py-4 mb-6 rounded-r-[3px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2.5 text-[11px] font-mono tracking-[0.2em] text-[#8A909C] uppercase mb-1">
                            <span className="text-white font-bold">{era.index}</span>
                            <span>•</span>
                            <span>{era.years}</span>
                          </div>
                          <h3 className="text-lg sm:text-2xl font-cinematic font-bold text-white uppercase">
                            {era.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#9BA1AE] mt-0.5">
                            {era.summary}
                          </p>
                        </div>

                        <div className="shrink-0 font-hud text-xl sm:text-2xl font-bold text-[#D1D5DB] tabular-nums">
                          {eraDoneCount} / {eraItems.length} WATCHED
                        </div>
                      </div>

                      {/* Vertical Timeline Milestones */}
                      <div className="relative pl-6 sm:pl-44 space-y-6">
                        {/* Vertical Conduit Line */}
                        <div
                          className="absolute left-[11px] sm:left-[148px] top-3 bottom-3 w-[2px] bg-[#222630]"
                          aria-hidden="true"
                        />

                        {eraItems.map((item) => {
                          const done = isChapterCompleted(item, progress);
                          return (
                            <div
                              key={item.id}
                              ref={(el) => { rowRefs.current[item.id] = el; }}
                              className="relative"
                            >
                              {/* Desktop Left Year & Continuity Gutter */}
                              <div className="hidden sm:flex flex-col items-end text-right absolute -left-44 top-4 w-32 pr-3">
                                <span className="font-hud text-2xl font-extrabold text-white tracking-wide tabular-nums leading-none">
                                  {item.year}
                                </span>
                                <span className="text-[10px] font-mono text-[#7D8490] uppercase tracking-wider mt-1 leading-tight">
                                  {item.reality}
                                </span>
                              </div>

                              {/* Precision Spine Node Marker */}
                              <button
                                type="button"
                                onClick={() => handleToggleItem(item)}
                                aria-label={`Toggle timeline node ${item.title}`}
                                className={`absolute -left-6 sm:-left-[39px] top-5 w-6 h-6 rounded-[2px] border-2 inline-flex items-center justify-center transition-colors cursor-pointer z-10 ${
                                  done
                                    ? 'bg-[#16A34A] border-[#22C55E] text-white'
                                    : 'bg-[#08090B] border-[#4B5565] hover:border-white text-transparent'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </button>

                              {/* Timeline Card */}
                              <div
                                className={`bg-[#0C0E12] border rounded-[3px] p-4 sm:p-5 transition-colors ${
                                  done ? 'border-[#1F402C]' : 'border-[#20242D] hover:border-[#323846]'
                                }`}
                              >
                                <div className="flex flex-col sm:flex-row gap-4">
                                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                    <div className="w-16 h-24 sm:w-20 sm:h-28 shrink-0 overflow-hidden border border-[#232834] bg-[#08090B] rounded-[2px]">
                                      <img src={item.poster} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono tracking-[0.14em] text-[#848B98] uppercase mb-1">
                                        <span className="text-[#D1D5DB] font-bold">#{item.number}</span>
                                        <span className="sm:hidden">• {item.year}</span>
                                        <span>•</span>
                                        <span>{item.inUniverseTime || item.year}</span>
                                      </div>

                                      <h4 className="text-lg sm:text-xl font-cinematic font-bold text-white leading-snug mb-1.5">
                                        {item.title}
                                      </h4>

                                      <p className="text-xs sm:text-sm text-[#A1A7B3] leading-relaxed mb-2">
                                        {item.narrativeSignificance}
                                      </p>

                                      {item.doomsdayLink && (
                                        <p className="text-xs sm:text-sm text-[#E5E7EB] border-l-2 border-[#22C55E] pl-3 py-0.5">
                                          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#8A909C] block">
                                            DOOMSDAY TRAJECTORY
                                          </span>
                                          {item.doomsdayLink}
                                        </p>
                                      )}

                                      {item.isMultiSeason && (
                                        <div className="mt-3 flex flex-wrap gap-2.5">
                                          <button
                                            type="button"
                                            onClick={() => onToggleLokiSeason('s1')}
                                            className={`h-11 px-4 rounded-[3px] border text-xs font-display font-bold tracking-[0.1em] uppercase inline-flex items-center gap-2 transition-colors cursor-pointer ${
                                              lokiState.season1
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
                                            className={`h-11 px-4 rounded-[3px] border text-xs font-display font-bold tracking-[0.1em] uppercase inline-flex items-center gap-2 transition-colors cursor-pointer ${
                                              lokiState.season2
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
                                      className={`h-11 px-5 rounded-[3px] border text-xs sm:text-sm font-display font-bold tracking-[0.12em] uppercase inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                                        done
                                          ? 'bg-[#132A1B] border-[#22C55E]/70 text-[#4ADE80] hover:bg-[#193824]'
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

                {/* CONVERGENCE CAPSTONE: AVENGERS DOOMSDAY */}
                <div className="bg-[#0F1218] border-2 border-[#2D3340] rounded-[3px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.22em] text-[#22C55E] uppercase mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>TIMELINE CONVERGENCE • 18 DECEMBER 2026</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase tracking-wide">
                      AVENGERS: DOOMSDAY
                    </h3>
                    <p className="text-xs sm:text-sm text-[#9BA1AE] mt-1">
                      {watchedCount === totalCount
                        ? 'All 15 Multiverse chapters completed. All timelines synchronized.'
                        : `${watchedCount} of ${totalCount} prerequisite chapters completed toward the Multiverse culmination.`}
                    </p>
                  </div>

                  <div className="font-hud text-3xl sm:text-4xl font-extrabold text-white tabular-nums shrink-0">
                    {percentage}% READY
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
