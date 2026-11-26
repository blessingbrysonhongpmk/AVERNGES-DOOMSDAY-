import React, { useEffect } from 'react';
import { X, Play, ExternalLink } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#0D0E12] border border-white/[0.12] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-[3px] w-full bg-[#E62429]" />

        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-white/[0.08] bg-[#121318]">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2 py-0.5 bg-[#E62429] text-white text-[9.5px] font-hud font-bold tracking-[0.2em] uppercase shrink-0">
              {activeVideo.channel}
            </span>
            <h3 className="text-sm sm:text-lg font-hud font-bold text-white uppercase tracking-wide truncate">
              {activeVideo.tanglishTitle}
            </h3>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={activeVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/15 hover:border-white text-[#D8D9DC] hover:text-white text-[10px] font-mono uppercase transition-colors"
            >
              <span>YOUTUBE</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Trailer Theater"
              className="w-8 h-8 border border-white/15 hover:border-[#E62429] bg-black/50 hover:bg-[#E62429] text-white inline-flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

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

        <div className="p-4 sm:p-5 bg-[#0A0B0E] border-t border-white/[0.08]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <p className="text-xs sm:text-sm font-body text-[#D8D9DC] leading-relaxed">
              {activeVideo.tanglishCommentary}
            </p>
            <span className="text-[10px] font-mono tracking-wider text-[#777A80] uppercase shrink-0">
              {activeVideo.officialTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
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
                  className={`p-2 text-left border transition-colors cursor-pointer flex items-center gap-2 ${
                    isCurrent
                      ? 'border-[#E62429] bg-[#181013] text-white'
                      : 'border-white/[0.08] bg-[#121318] hover:border-white/25 text-[#9CA3AF] hover:text-white'
                  }`}
                >
                  <div className="relative w-12 h-8 overflow-hidden bg-black shrink-0">
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
                    <span className="text-[10px] font-hud font-bold uppercase block truncate">
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
