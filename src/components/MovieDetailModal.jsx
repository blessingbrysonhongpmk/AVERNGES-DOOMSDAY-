import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Film, Tv } from 'lucide-react';

export default function MovieDetailModal({
  item,
  isOpen,
  onClose,
  isCompleted,
  lokiSeasons,
  onToggleStandard,
  onToggleLokiSeason,
}) {
  // Close on Escape & lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) return null;

  const isLoki = item.isMultiSeason;

  const modalContent = (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-[#111216] border border-[#1E2024] shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-3.5 right-3.5 z-20 p-1.5 text-[#777A80] hover:text-[#F5F5F5] transition-colors duration-150 border border-transparent hover:border-[#1E2024] bg-[#08090B]/60"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* Poster Column */}
          <div className="sm:w-5/12 bg-[#08090B] border-b sm:border-b-0 sm:border-r border-[#1E2024] p-4 sm:p-6 flex flex-col items-center justify-center shrink-0">
            {isLoki ? (
              /* Loki Dual Poster Display in modal */
              <div className="flex gap-2 w-full max-w-[240px]">
                <div className="flex-1 aspect-[2/3] border border-[#1E2024] relative overflow-hidden bg-[#0c0d10]">
                  <img
                    src={item.posterSeason1}
                    alt="Loki Season 1"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 px-1 bg-[#08090B]/90 text-[8px] font-mono text-[#D8D9DC] border border-[#1E2024]">
                    S1
                  </div>
                  {lokiSeasons?.s1 && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#E62429] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="flex-1 aspect-[2/3] border border-[#1E2024] relative overflow-hidden bg-[#0c0d10]">
                  <img
                    src={item.posterSeason2}
                    alt="Loki Season 2"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 px-1 bg-[#08090B]/90 text-[8px] font-mono text-[#D8D9DC] border border-[#1E2024]">
                    S2
                  </div>
                  {lokiSeasons?.s2 && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#E62429] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Single Movie Poster in modal */
              <div className="w-36 sm:w-44 aspect-[2/3] border border-[#1E2024] overflow-hidden relative shadow-lg bg-[#0c0d10]">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {isCompleted && (
                  <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-[#E62429] text-white text-[9px] font-mono font-bold flex items-center gap-1 shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                    <span>WATCHED</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Details Content Column */}
          <div className="sm:w-7/12 p-5 sm:p-7 flex flex-col justify-between">
            <div>
              {/* Header tags */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-[#E62429] tracking-widest">
                  CHAPTER {item.number}
                </span>
                <span className="text-[#2D3036] text-xs">•</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono tracking-wider text-[#777A80] uppercase">
                  {item.type === 'Series' ? <Tv className="w-3 h-3 text-[#777A80]" /> : <Film className="w-3 h-3 text-[#777A80]" />}
                  {item.type}
                </span>
                <span className="text-[#2D3036] text-xs">•</span>
                <span className="text-[10px] font-mono text-[#777A80]">
                  {item.year}
                </span>
              </div>

              {/* Title */}
              <h3 id="modal-title" className="text-xl sm:text-2xl font-cinematic font-bold text-[#F5F5F5] tracking-wide mb-2 leading-tight">
                {item.title}
              </h3>

              {/* Tagline */}
              {item.tagline && (
                <p className="text-[11px] font-mono text-[#D8D9DC] tracking-wider uppercase mb-3 italic">
                  "{item.tagline}"
                </p>
              )}

              {/* Spoiler-free synopsis & significance */}
              <p className="text-xs sm:text-sm text-[#A0A3AA] leading-relaxed mb-4 font-light">
                {item.narrativeSignificance}
              </p>
            </div>

            {/* Completion Controls */}
            <div className="pt-4 border-t border-[#1E2024] mt-2">
              {isLoki ? (
                /* Loki Season 1 & 2 controls */
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-[#777A80] uppercase tracking-wider">
                    Season Tracking (Both Required):
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleLokiSeason('s1')}
                      aria-pressed={!!lokiSeasons?.s1}
                      className={`flex items-center justify-center gap-2 py-2 px-3 border text-xs font-mono tracking-wider transition-colors ${lokiSeasons?.s1
                          ? 'border-[#E62429] bg-[#E62429] text-white font-bold'
                          : 'border-[#1E2024] bg-[#08090B] text-[#777A80] hover:border-[#2D3036] hover:text-[#F5F5F5]'
                        }`}
                    >
                      <div className={`w-3.5 h-3.5 border flex items-center justify-center ${lokiSeasons?.s1 ? 'border-[#E62429] bg-[#E62429]' : 'border-[#383E42]'
                        }`}>
                        {lokiSeasons?.s1 && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                      </div>
                      <span>SEASON 1</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleLokiSeason('s2')}
                      aria-pressed={!!lokiSeasons?.s2}
                      className={`flex items-center justify-center gap-2 py-2 px-3 border text-xs font-mono tracking-wider transition-colors ${lokiSeasons?.s2
                          ? 'border-[#E62429] bg-[#E62429] text-white font-bold'
                          : 'border-[#1E2024] bg-[#08090B] text-[#777A80] hover:border-[#2D3036] hover:text-[#F5F5F5]'
                        }`}
                    >
                      <div className={`w-3.5 h-3.5 border flex items-center justify-center ${lokiSeasons?.s2 ? 'border-[#E62429] bg-[#E62429]' : 'border-[#383E42]'
                        }`}>
                        {lokiSeasons?.s2 && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                      </div>
                      <span>SEASON 2</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard single movie toggle */
                <button
                  type="button"
                  onClick={() => onToggleStandard(item.id)}
                  aria-pressed={isCompleted}
                  className={`w-full flex items-center justify-center gap-2.5 py-2.5 px-4 border text-xs font-mono tracking-widest uppercase transition-colors duration-150 ${isCompleted
                      ? 'border-[#E62429] bg-[#E62429] text-white font-bold'
                      : 'border-[#1E2024] bg-[#08090B] text-[#777A80] hover:border-[#2D3036] hover:text-[#F5F5F5]'
                    }`}
                >
                  <div className={`w-4 h-4 border flex items-center justify-center ${isCompleted ? 'border-white bg-white' : 'border-[#383E42]'
                    }`}>
                    {isCompleted && <Check className="w-3 h-3 text-[#E62429] stroke-[3]" />}
                  </div>
                  <span>{isCompleted ? 'MARKED AS WATCHED' : 'MARK AS WATCHED'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return modalContent;
}
