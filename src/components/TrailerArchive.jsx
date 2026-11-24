import React, { useState, useEffect } from 'react';
import { TRAILERS_DATA } from '../data/trailers.js';
import { clockAudio } from '../utils/audio.js';

export default function TrailerArchive() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const categories = [
    'ALL',
    'THOR',
    'CAPTAIN AMERICA & SHIELD',
    'DOCTOR DOOM',
    'FANTASTIC FOUR',
    'THUNDERBOLTS',
    'DEADPOOL & WOLVERINE'
  ];

  const filteredTrailers = TRAILERS_DATA.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'THOR') return item.featuredHero?.includes('THOR') || item.title.includes('Thor');
    if (filter === 'CAPTAIN AMERICA & SHIELD') return item.featuredHero?.includes('SHIELD') || item.featuredHero?.includes('CAPTAIN');
    if (filter === 'DOCTOR DOOM') return item.featuredHero?.includes('DOOM') || item.title.includes('Doom');
    if (filter === 'FANTASTIC FOUR') return item.featuredHero?.includes('FANTASTIC') || item.title.includes('Fantastic');
    if (filter === 'THUNDERBOLTS') return item.featuredHero?.includes('THUNDERBOLTS') || item.title.includes('Thunderbolts');
    if (filter === 'DEADPOOL & WOLVERINE') return item.featuredHero?.includes('WOLVERINE') || item.title.includes('Deadpool');
    return true;
  });

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
      <div className="container max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="mb-8 sm:mb-10 text-center max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 border border-[#1E2024] bg-[#111216]/80 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#E62429] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E62429] shrink-0" />
            OFFICIAL FOOTAGE VAULT // THEATRICAL ARCHIVE
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-cinematic font-black tracking-tight text-white uppercase mb-2">
            FOOTAGE & TRAILER ARCHIVE
          </h2>
          <p className="text-xs sm:text-sm font-body text-[#777A80] leading-relaxed">
            Verified presentations, hall reveals, Thor celestial lightning sequences, and Captain America shield battles from Marvel Studios.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-8 select-none">
          {categories.map((cat) => {
            const count = cat === 'ALL'
              ? TRAILERS_DATA.length
              : TRAILERS_DATA.filter((item) => {
                if (cat === 'THOR') return item.featuredHero?.includes('THOR') || item.title.includes('Thor');
                if (cat === 'CAPTAIN AMERICA & SHIELD') return item.featuredHero?.includes('SHIELD') || item.featuredHero?.includes('CAPTAIN');
                if (cat === 'DOCTOR DOOM') return item.featuredHero?.includes('DOOM') || item.title.includes('Doom');
                if (cat === 'FANTASTIC FOUR') return item.featuredHero?.includes('FANTASTIC') || item.title.includes('Fantastic');
                if (cat === 'THUNDERBOLTS') return item.featuredHero?.includes('THUNDERBOLTS') || item.title.includes('Thunderbolts');
                if (cat === 'DEADPOOL & WOLVERINE') return item.featuredHero?.includes('WOLVERINE') || item.title.includes('Deadpool');
                return true;
              }).length;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setFilter(cat);
                  try { clockAudio.tick(0); } catch (e) { }
                }}
                className={`px-3 py-1 text-[9px] xs:text-[10px] font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer border ${filter === cat
                  ? 'border-[#E62429] bg-[#E62429]/20 text-white shadow-[0_0_12px_rgba(230,36,41,0.3)] font-bold'
                  : 'border-[#1E2024] bg-[#111216]/60 text-[#777A80] hover:text-[#D8D9DC] hover:border-[#2D3036]'
                  }`}
              >
                {cat} <span className="opacity-60 text-[8px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Trailer Cards Grid */}
        <div className="row g-3 sm:g-4">
          {filteredTrailers.map((trailer) => (
            <div key={trailer.id} className="col-12 col-md-6 flex">
              <div className="w-full border border-[#1E2024] hover:border-[#E62429]/60 bg-[#111216] overflow-hidden transition-all duration-300 flex flex-col justify-between shimmer-card group shadow-lg">
                {/* Thumbnail Container */}
                <div
                  onClick={() => {
                    setActiveVideo(trailer);
                    try { clockAudio.tick(0); } catch (e) { }
                  }}
                  className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer"
                >
                  <img
                    src={trailer.thumbnail}
                    alt={trailer.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106 opacity-85 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Play Button Icon with Pulsing Effect */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 xs:w-13 xs:h-13 sm:w-14 sm:h-14 rounded-full border border-white/50 bg-black/70 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-115 group-hover:border-[#E62429] group-hover:bg-[#E62429]/90 transition-all duration-300 shadow-2xl">
                      <span className="translate-x-0.5 text-sm xs:text-base sm:text-lg">▶</span>
                    </div>
                  </div>

                  {/* Hero Pill */}
                  <span className="absolute top-2.5 left-2.5 text-[8px] font-mono tracking-wider px-2 py-0.5 bg-black/90 text-[#E62429] border border-[#E62429]/40 uppercase font-bold">
                    {trailer.featuredHero || 'MARVEL FOOTAGE'}
                  </span>

                  {/* Runtime Badge */}
                  <span className="absolute bottom-2.5 right-2.5 text-[8px] xs:text-[9px] font-mono tracking-wider px-1.5 py-0.5 bg-black/95 text-white border border-white/20">
                    {trailer.runtime}
                  </span>

                  <span className="absolute bottom-2.5 left-2.5 text-[7px] xs:text-[8px] font-mono tracking-wider px-1.5 py-0.5 bg-black/90 text-[#22C55E] border border-[#22C55E]/30 uppercase">
                    {trailer.verifiedBadge}
                  </span>
                </div>

                {/* Info Block */}
                <div className="p-4 sm:p-5 flex flex-col justify-between grow">
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[8px] xs:text-[9px] font-mono text-[#777A80] uppercase mb-1.5">
                      <span>{trailer.category}</span>
                      <span>{trailer.date}</span>
                    </div>
                    <h3
                      onClick={() => {
                        setActiveVideo(trailer);
                        try { clockAudio.tick(0); } catch (e) { }
                      }}
                      className="text-xs xs:text-sm sm:text-base font-cinematic font-bold text-white group-hover:text-white transition-colors leading-snug cursor-pointer mb-2"
                    >
                      {trailer.title}
                    </h3>
                    <p className="text-[11px] xs:text-xs font-body text-[#777A80] leading-relaxed line-clamp-2">
                      {trailer.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveVideo(trailer);
                      try { clockAudio.tick(0); } catch (e) { }
                    }}
                    className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 text-[9px] xs:text-[10px] font-mono tracking-widest text-[#E62429] hover:text-[#F0383D] uppercase font-bold cursor-pointer transition-colors"
                  >
                    <span>WATCH FOOTAGE</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Embedded Video Modal */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl border border-[#1E2024] bg-[#0E0F13] p-3 sm:p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1E2024]">
              <div>
                <span className="text-[9px] font-mono tracking-wider text-[#E62429] uppercase font-bold">
                  {activeVideo.category} • {activeVideo.verifiedBadge}
                </span>
                <h3 id="video-title" className="text-xs sm:text-sm font-cinematic font-bold text-white uppercase truncate max-w-lg">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveVideo(null)}
                aria-label="Close video player"
                className="text-[#777A80] hover:text-white p-1.5 transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {/* Responsive 16:9 Video Embed Frame */}
            <div className="relative aspect-video w-full bg-black overflow-hidden border border-[#1E2024]">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Description footer */}
            <p className="mt-3 text-[11px] font-body text-[#A0A4AB] leading-relaxed">
              {activeVideo.description}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
