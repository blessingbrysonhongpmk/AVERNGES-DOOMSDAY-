import React, { useState, useEffect } from 'react';
import { TRAILERS_DATA } from '../data/trailers.js';

export default function TrailerArchive() {
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveVideo(null);
    };
    if (activeVideo) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [activeVideo]);

  return (
    <section
      id="trailers"
      aria-label="Official Trailer Archive"
      className="relative py-16 sm:py-24 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#08090B]"
    >
      {/* Bootstrap container boundary */}
      <div className="container max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="mb-10 sm:mb-14 text-center max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 border border-[#1E2024] bg-[#111216]/80 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#E62429] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E62429] shrink-0" />
            OFFICIAL FOOTAGE ARCHIVE
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-cinematic font-black tracking-tight text-white uppercase mb-3">
            TRAILER ARCHIVE
          </h2>
          <p className="text-xs sm:text-sm font-body text-[#777A80] leading-relaxed">
            Verified presentations, hall reveals, and official trailers from Marvel Studios leading to Doomsday.
          </p>
        </div>

        {/* Trailer Cards Grid (Bootstrap 12-column responsive layout: 1 col on mobile, 2 cols on tablet/desktop) */}
        <div className="row g-3 sm:g-4">
          {TRAILERS_DATA.map((trailer) => (
            <div key={trailer.id} className="col-12 col-md-6 flex">
              <div className="w-full border border-[#1E2024] bg-[#111216] overflow-hidden hover:border-[#3A3D45] transition-all flex flex-col justify-between">
                {/* Thumbnail Container */}
                <div
                  onClick={() => setActiveVideo(trailer)}
                  className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer"
                >
                  <img
                    src={trailer.thumbnail}
                    alt={trailer.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-103 opacity-80 hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Button Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-full border border-white/40 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:scale-110 hover:border-[#E62429] transition-all">
                      <span className="translate-x-0.5 text-sm xs:text-base sm:text-lg">▶</span>
                    </div>
                  </div>

                  {/* Runtime Badge */}
                  <span className="absolute bottom-2 right-2 text-[8px] xs:text-[9px] font-mono tracking-wider px-1.5 py-0.5 bg-black/90 text-white border border-white/10">
                    {trailer.runtime}
                  </span>

                  <span className="absolute top-2 left-2 text-[7px] xs:text-[8px] font-mono tracking-wider px-1.5 py-0.5 bg-black/90 text-[#22C55E] border border-[#22C55E]/30 uppercase">
                    {trailer.verifiedBadge}
                  </span>
                </div>

                {/* Info Block */}
                <div className="p-3.5 xs:p-4 sm:p-5 flex flex-col justify-between grow">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[8px] xs:text-[9px] font-mono text-[#777A80] uppercase mb-1.5">
                      <span>{trailer.category}</span>
                      <span>{trailer.date}</span>
                    </div>
                    <h3
                      onClick={() => setActiveVideo(trailer)}
                      className="text-xs xs:text-sm sm:text-base font-cinematic font-bold text-white hover:text-[#D8D9DC] transition-colors leading-snug cursor-pointer mb-2"
                    >
                      {trailer.title}
                    </h3>
                    <p className="text-[11px] xs:text-xs font-body text-[#777A80] leading-relaxed line-clamp-2">
                      {trailer.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveVideo(trailer)}
                    className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-[9px] xs:text-[10px] font-mono tracking-widest text-[#E62429] hover:text-[#F0383D] uppercase font-bold cursor-pointer transition-colors"
                  >
                    <span>WATCH FOOTAGE</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Fullscreen Video Modal (Responsive bounds for phone screens) */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 xs:p-3 sm:p-6 bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-black border border-[#1E2024] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-2.5 xs:p-3 sm:p-4 border-b border-[#1E2024] bg-[#0E0F13]">
              <div className="pr-3 truncate">
                <span className="text-[8px] xs:text-[9px] font-mono text-[#E62429] tracking-wider uppercase block">
                  {activeVideo.category}
                </span>
                <h4 className="text-xs xs:text-sm font-cinematic font-bold text-white truncate">
                  {activeVideo.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video"
                className="text-[#777A80] hover:text-white px-2 py-1 text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Responsive Video Embed */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
