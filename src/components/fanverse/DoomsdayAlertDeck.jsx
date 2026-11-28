import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { FANVERSE_VIDEOS, DOOMSDAY_VERIFIED_UPDATES } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

export default function DoomsdayAlertDeck({ onOpenTrailer }) {
  const [selectedVideo, setSelectedVideo] = useState(FANVERSE_VIDEOS[0]);

  return (
    <div id="fanverse-alert" className="mb-12 sm:mb-16 scroll-mt-24">
      {/* News-Ticker Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--marvel-red)] text-white text-[9.5px] fan-font-mono font-bold shadow-[2px_2px_0_#000]">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>ALERT</span>
            </span>
            <span className="text-[10.5px] fan-font-mono font-bold text-[#B8B4AC]">
              OFFICIAL TAMIL TRAILERS &amp; PRODUCTION DISPATCH
            </span>
          </div>
          <h3 className="text-3xl sm:text-5xl fan-font-flex text-[var(--ink)] uppercase leading-none">
            DOOMSDAY ALERT!
          </h3>
        </div>
        <p className="text-xs sm:text-sm fan-font-editorial text-[#D5D1C8]">
          &ldquo;Indha vaati multiverse-ku escape route irukka?&rdquo; — @IndiaMarvel Official Clips
        </p>
      </div>

      {/* Main Split Preserved: Widescreen Cinema Player + Clean Marvel Briefing Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left (7 Cols): Featured Video + Clean 5-Trailer Reel */}
        <div className="lg:col-span-7">
          <div
            onClick={() => {
              try { clockAudio.tick(0); } catch { }
              onOpenTrailer(selectedVideo);
            }}
            className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer group border-2 border-white/15 shadow-[7px_7px_0_#000]"
          >
            <img
              src={`https://i.ytimg.com/vi/${selectedVideo.youtubeId}/hqdefault.jpg`}
              onError={(e) => { e.currentTarget.src = selectedVideo.fallbackImage; }}
              alt={selectedVideo.tanglishTitle}
              width={640}
              height={360}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

            {/* Clean Center Play Trigger */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-14 h-14 sm:w-16 sm:h-16 bg-[var(--marvel-red)] group-hover:bg-[#ff2b31] text-white flex items-center justify-center transition-transform duration-200 group-hover:scale-105 shadow-[4px_4px_0_#000] marvel-btn-cut">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </span>
            </div>

            {/* Minimal Bottom-Left Metadata */}
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <span className="text-[10px] fan-font-mono font-bold text-[#FCA5A5] block">
                  {selectedVideo.channel} &bull; {selectedVideo.tag}
                </span>
                <h4 className="text-lg sm:text-2xl fan-font-flex text-white uppercase leading-tight">
                  {selectedVideo.tanglishTitle}
                </h4>
              </div>
              <a
                href={selectedVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 bg-black/85 border border-white/25 hover:border-white text-[10px] fan-font-mono text-white shrink-0"
              >
                <span>YT</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Caption below video */}
          <p className="text-xs sm:text-sm fan-font-body text-[#D5D1C8] mt-3.5 mb-4">
            {selectedVideo.tanglishCommentary}
          </p>

          {/* Clean 5-Video Strip (Exact Structure Preserved) */}
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
                  <div className="relative aspect-video w-full bg-black overflow-hidden mb-1.5 border border-white/10">
                    <img
                      src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      onError={(e) => { e.currentTarget.src = vid.fallbackImage; }}
                      alt={vid.tanglishTitle}
                      width={320}
                      height={180}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
                        active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
                      }`}
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play className={`w-4 h-4 fill-white ${active ? 'text-white' : 'text-white/80'}`} />
                    </span>
                    <div
                      className={`absolute bottom-0 inset-x-0 transition-all ${
                        active ? 'h-[3px] bg-[var(--marvel-red)]' : 'h-[2px] bg-white/0 group-hover:bg-white/40'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[11px] fan-font-mono font-bold block leading-tight ${
                      active ? 'text-white' : 'text-[#9CA3AF] group-hover:text-white'
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

        {/* Right (5 Cols): News List Preserved with Color-Coded Stamped Source Badges */}
        <div className="lg:col-span-5 border-t-2 border-white/15">
          {DOOMSDAY_VERIFIED_UPDATES.map((item) => {
            const isTheory = item.badge === 'FAN THEORY';
            const isFormats = item.badge === 'OFFICIAL FORMATS';
            const stampStyle = isTheory
              ? 'text-[#FCD34D] border-[#D9B45B] bg-[#241B08]/70 -rotate-1'
              : isFormats
                ? 'text-[#60A5FA] border-[var(--stamp-blue)] bg-[#0E1833]/70 rotate-1'
                : item.tone === 'emerald'
                  ? 'text-[var(--doom-green)] border-[var(--doom-green)] bg-[#0C2016]/70 rotate-0.5'
                  : 'text-[#FCA5A5] border-[var(--marvel-red)] bg-[#260C0E]/70 -rotate-0.5';

            return (
              <div
                key={item.id}
                className="py-3.5 border-b border-white/[0.1] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`fan-rubber-stamp text-[8.5px] px-2 py-0.5 ${stampStyle}`}>
                    {item.badge}
                  </span>
                  <span className="text-[9.5px] fan-font-mono text-[#7C828E] truncate">{item.source}</span>
                </div>
                <h4 className="text-lg sm:text-xl fan-font-flex text-[var(--ink)] uppercase leading-tight">
                  {item.headline}
                </h4>
                <p className="text-xs fan-font-body text-[#B4B0A8]">
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
