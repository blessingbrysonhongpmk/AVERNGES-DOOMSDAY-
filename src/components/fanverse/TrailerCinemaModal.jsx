import React, { useEffect } from 'react';
import { X, Play, ExternalLink, Tv, Sparkles } from 'lucide-react';
import { clockAudio } from '../../utils/audio.js';

export default function TrailerCinemaModal({ videos, activeVideo, onSelectVideo, onClose }) {
  useEffect(() => {
    if (!activeVideo) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeVideo, onClose]);

  if (!activeVideo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={activeVideo.tanglishTitle}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#07090D] border border-white/[0.12] rounded-[4px] shadow-[0_32px_100px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top specularity bar */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#22C55E] to-[#E62429]" />

        {/* Cinema Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-white/[0.08] bg-[#0A0D13]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#E62429]/20 border border-[#E62429]/60 text-[#FCA5A5] text-[9.5px] font-mono font-bold tracking-[0.2em] uppercase rounded-[2px] shrink-0">
              <Tv className="w-3 h-3" />
              <span>{activeVideo.channel} OFFICIAL</span>
            </span>
            <h3 className="text-xs sm:text-base font-cinematic font-bold text-white truncate">
              {activeVideo.tanglishTitle}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={activeVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.12] hover:border-[#22C55E] bg-white/[0.04] hover:bg-[#22C55E]/15 text-[#D8D9DC] hover:text-white text-[10px] font-mono font-bold tracking-wider uppercase rounded-[2px] transition-colors"
            >
              <span>YOUTUBE LINK</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Trailer Theater"
              className="w-8 h-8 border border-white/[0.12] hover:border-[#E62429] bg-white/[0.04] hover:bg-[#E62429] text-[#D8D9DC] hover:text-white rounded-[2px] inline-flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 16:9 YouTube Official Screening Frame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            key={activeVideo.youtubeId}
            src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={activeVideo.officialTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        {/* Tanglish Commentary + Playlist Queue Strip */}
        <div className="p-4 sm:p-5 bg-[#080A0F] border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <p className="text-xs sm:text-sm font-body text-[#D8D9DC] leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-[#22C55E] inline mr-1.5 -mt-0.5" />
              {activeVideo.tanglishCommentary}
            </p>
            <span className="text-[10px] font-mono tracking-wider text-[#8C9098] uppercase shrink-0">
              {activeVideo.officialTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {videos.map((vid) => {
              const isCurrent = vid.id === activeVideo.id;
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch {}
                    onSelectVideo(vid);
                  }}
                  className={`p-2 text-left rounded-[3px] border transition-all cursor-pointer flex items-center gap-2 ${
                    isCurrent
                      ? 'border-[#22C55E] bg-[#0B1C13] text-white'
                      : 'border-white/[0.07] bg-[#0D1017] hover:border-white/25 text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  <div className="relative w-12 h-8 rounded-[2px] overflow-hidden bg-black shrink-0 border border-white/10">
                    <img
                      src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      onError={(e) => { e.currentTarget.src = vid.fallbackImage; }}
                      alt={vid.tag}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute inset-0 bg-black/35 flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-white" />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[8.5px] font-mono uppercase tracking-wider text-[#22C55E] block truncate">
                      {vid.tag.split(' // ')[0]}
                    </span>
                    <span className="text-[10px] font-display font-semibold block truncate">
                      {vid.id === 'final-trailer'
                        ? 'Final Trailer'
                        : vid.id === 'special-look'
                          ? 'Special Look'
                          : vid.id === 'doomsday-trailer-1'
                            ? 'Trailer 1'
                            : vid.id === 'thor-glimpse'
                              ? 'Thor Glimpse'
                              : 'X-Men Glimpse'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
