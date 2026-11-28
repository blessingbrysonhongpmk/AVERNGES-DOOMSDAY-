import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { FANVERSE_VIDEOS, DOOMSDAY_VERIFIED_UPDATES } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

export default function DoomsdayAlertDeck({ onOpenTrailer }) {
  const [selectedVideo, setSelectedVideo] = useState(FANVERSE_VIDEOS[0]);

  return (
    <div id="fanverse-alert" className="mb-10 sm:mb-16 scroll-mt-24">
      {/* Marvel.com Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-[11px] font-hud font-bold tracking-[0.26em] text-[#E62429] uppercase block mb-1">
            OFFICIAL TAMIL TRAILERS &amp; PRODUCTION DISPATCH
          </span>
          <h3 className="text-2xl sm:text-4xl font-hud font-extrabold text-white uppercase tracking-wide leading-none">
            DOOMSDAY ALERT!
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-body text-[#9CA3AF]">
          &ldquo;Indha vaati multiverse-ku escape route irukka?&rdquo; — @IndiaMarvel Official Clips
        </p>
      </div>

      {/* Main Split: Widescreen Cinema Player + Clean Marvel Briefing Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left (7 Cols): Featured Video + Clean 5-Trailer Reel */}
        <div className="lg:col-span-7">
          <div
            onClick={() => {
              try { clockAudio.tick(0); } catch { }
              onOpenTrailer(selectedVideo);
            }}
            className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer group border border-white/[0.08]"
          >
            <img
              src={`https://i.ytimg.com/vi/${selectedVideo.youtubeId}/hqdefault.jpg`}
              onError={(e) => { e.currentTarget.src = selectedVideo.fallbackImage; }}
              alt={selectedVideo.tanglishTitle}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

            {/* Clean Center Play Trigger */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-14 h-14 sm:w-16 sm:h-16 bg-[#E62429]/95 group-hover:bg-[#E62429] text-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-2xl marvel-btn-cut">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </span>
            </div>

            {/* Minimal Bottom-Left Metadata */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <span className="text-[10px] font-hud font-bold tracking-[0.2em] text-[#FCA5A5] uppercase block">
                  {selectedVideo.channel} • {selectedVideo.tag}
                </span>
                <h4 className="text-base sm:text-xl font-hud font-bold text-white uppercase tracking-wide leading-tight">
                  {selectedVideo.tanglishTitle}
                </h4>
              </div>
              <a
                href={selectedVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-black/80 border border-white/20 hover:border-white text-[10px] font-mono text-white uppercase shrink-0"
              >
                <span>YT</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Caption below video without cluttering image frame */}
          <p className="text-xs sm:text-sm font-body text-[#B4B9C2] leading-relaxed mt-3 mb-4">
            {selectedVideo.tanglishCommentary}
          </p>

          {/* Clean 5-Video Strip (Marvel Video Shelf Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {FANVERSE_VIDEOS.map((vid) => {
              const active = vid.id === selectedVideo.id;
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch { }
                    if (active) onOpenTrailer(vid);
                    else setSelectedVideo(vid);
                  }}
                  className="text-left group cursor-pointer focus:outline-none"
                >
                  <div className="relative aspect-video w-full bg-black overflow-hidden mb-1.5">
                    <img
                      src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      onError={(e) => { e.currentTarget.src = vid.fallbackImage; }}
                      alt={vid.tanglishTitle}
                      className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                        }`}
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play className={`w-4 h-4 fill-white ${active ? 'text-white' : 'text-white/80'}`} />
                    </span>
                    <div
                      className={`absolute bottom-0 inset-x-0 transition-all ${active ? 'h-[3px] bg-[#E62429]' : 'h-[2px] bg-white/0 group-hover:bg-white/40'
                        }`}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-hud font-bold uppercase tracking-wide block leading-tight ${active ? 'text-white' : 'text-[#9CA3AF] group-hover:text-white'
                      }`}
                  >
                    {vid.id === 'final-trailer'
                      ? 'Final Trailer Tamil'
                      : vid.id === 'special-look'
                        ? 'Special Look Tamil'
                        : vid.id === 'doomsday-trailer-1'
                          ? 'Trailer 1 Tamil'
                          : vid.id === 'thor-glimpse'
                            ? 'Thor Glimpse'
                            : 'X-Men Doomsday'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right (5 Cols): Clean Marvel Editorial Dispatch List (Hairline Rules, Zero AI Boxes) */}
        <div className="lg:col-span-5 border-t border-white/[0.12]">
          {DOOMSDAY_VERIFIED_UPDATES.map((item) => {
            const isTheory = item.badge === 'FAN THEORY';
            return (
              <div
                key={item.id}
                className="py-3.5 border-b border-white/[0.08] flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-hud font-bold tracking-[0.2em] uppercase ${isTheory ? 'text-[#F59E0B]' : 'text-[#E62429]'
                      }`}
                  >
                    {item.badge}
                  </span>
                  <span className="text-[9.5px] font-mono text-[#6B7280] truncate">{item.source}</span>
                </div>
                <h4 className="text-sm sm:text-base font-hud font-bold text-white uppercase tracking-wide leading-snug">
                  {item.headline}
                </h4>
                <p className="text-xs font-body text-[#9CA3AF] leading-relaxed">
                  {item.tanglishNote}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
