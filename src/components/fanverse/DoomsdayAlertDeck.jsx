import React, { useState } from 'react';
import { Play, Radio, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';
import { FANVERSE_VIDEOS, DOOMSDAY_VERIFIED_UPDATES } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

export default function DoomsdayAlertDeck({ onOpenTrailer }) {
  const [selectedVideo, setSelectedVideo] = useState(FANVERSE_VIDEOS[0]);

  return (
    <div id="fanverse-alert" className="mb-12 sm:mb-16 scroll-mt-24">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 mb-1.5">
            <Radio className="w-3.5 h-3.5 text-[#E62429] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#E62429] uppercase">
              01 // DOOMSDAY ALERT — INDIAMARVEL TAMIL VAULT
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase tracking-tight">
            DOOMSDAY ALERT!
          </h3>
          <p className="text-xs sm:text-sm font-body text-[#9CA3AF] mt-0.5">
            &ldquo;Indha vaati multiverse-ku escape route irukka?&rdquo; — Verified Tamil trailers, Special Look, &amp; Official Cast vs Fan Speculation.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[9.5px] font-mono uppercase tracking-wider shrink-0">
          <span className="px-2.5 py-1 border border-[#E62429]/50 bg-[#E62429]/15 text-[#FCA5A5] rounded-[2px]">
            OFFICIAL MARVEL
          </span>
          <span className="px-2.5 py-1 border border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FCD34D] rounded-[2px]">
            FAN THEORY SEPARATE
          </span>
        </div>
      </div>

      {/* Main Split: 5 Official Tamil Video Screening Deck (Left) + Verified Intel vs Theory Ledger (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (7 Cols): Featured Official Tamil Video Card + 5-Clip Selection Strip */}
        <div className="lg:col-span-7 flex flex-col gap-3.5">
          {/* Selected Featured Video Stage */}
          <div className="border border-white/[0.1] hover:border-[#22C55E]/40 bg-[#0A0D12] rounded-[3px] overflow-hidden shadow-2xl transition-colors group">
            <div
              onClick={() => {
                try { clockAudio.tick(0); } catch {}
                onOpenTrailer(selectedVideo);
              }}
              className="relative aspect-video w-full bg-black cursor-pointer overflow-hidden"
            >
              <img
                src={`https://i.ytimg.com/vi/${selectedVideo.youtubeId}/hqdefault.jpg`}
                onError={(e) => { e.currentTarget.src = selectedVideo.fallbackImage; }}
                alt={selectedVideo.tanglishTitle}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-black/30 to-transparent" />

              {/* Badges Top */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 bg-[#E62429] text-white text-[9px] font-mono font-black tracking-[0.2em] uppercase rounded-[2px] shadow">
                  {selectedVideo.badge} // {selectedVideo.channel}
                </span>
                <span className="px-2.5 py-1 bg-black/75 border border-white/15 text-[#D8D9DC] text-[9px] font-mono tracking-wider uppercase rounded-[2px]">
                  {selectedVideo.releaseNote}
                </span>
              </div>

              {/* Center Play Reticle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-white/40 bg-black/65 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:border-[#22C55E] group-hover:bg-[#22C55E]/25 transition-all shadow-[0_0_40px_rgba(0,0,0,0.9)]">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
              </div>

              {/* Bottom Title Overlay */}
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <span className="text-[9.5px] font-mono tracking-[0.2em] text-[#4ADE80] uppercase block mb-0.5">
                    {selectedVideo.tag}
                  </span>
                  <h4 className="text-base sm:text-xl font-cinematic font-bold text-white leading-snug">
                    {selectedVideo.tanglishTitle}
                  </h4>
                </div>
              </div>
            </div>

            <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/[0.07]">
              <p className="text-xs sm:text-sm font-body text-[#B4BAC4] leading-relaxed">
                {selectedVideo.tanglishCommentary}
              </p>
              <a
                href={selectedVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-white/[0.12] hover:border-[#E62429] bg-white/[0.04] text-[#E5E7EB] hover:text-white text-[10px] font-mono font-bold tracking-wider uppercase rounded-[2px] shrink-0 transition-colors"
              >
                <span>YOUTUBE</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* 5-Video Official Tamil Playlist Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {FANVERSE_VIDEOS.map((vid) => {
              const active = vid.id === selectedVideo.id;
              return (
                <button
                  key={vid.id}
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch {}
                    if (active) onOpenTrailer(vid);
                    else setSelectedVideo(vid);
                  }}
                  className={`text-left border rounded-[3px] overflow-hidden transition-all cursor-pointer flex flex-col group ${
                    active
                      ? 'border-[#22C55E] bg-[#0B1710] shadow-[0_0_20px_rgba(34,197,94,0.16)]'
                      : 'border-white/[0.08] bg-[#0B0D12] hover:border-white/25'
                  }`}
                >
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    <img
                      src={`https://i.ytimg.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                      onError={(e) => { e.currentTarget.src = vid.fallbackImage; }}
                      alt={vid.tanglishTitle}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                    <span className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className={`w-4 h-4 fill-current ${active ? 'text-[#22C55E]' : 'text-white/90'}`} />
                    </span>
                  </div>
                  <div className="p-2 flex-1 flex flex-col justify-between">
                    <span className={`text-[8px] font-mono font-bold uppercase tracking-wider block ${active ? 'text-[#4ADE80]' : 'text-[#8C9098]'}`}>
                      {vid.tag.split(' // ')[0]}
                    </span>
                    <span className="text-[10.5px] font-display font-semibold text-white leading-tight mt-0.5 line-clamp-2">
                      {vid.id === 'final-trailer'
                        ? 'Final Trailer Tamil'
                        : vid.id === 'special-look'
                          ? 'Special Look Tamil'
                          : vid.id === 'doomsday-trailer-1'
                            ? 'Doomsday Trailer 1'
                            : vid.id === 'thor-glimpse'
                              ? 'Thor Glimpse'
                              : 'X-Men Doomsday'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right (5 Cols): Verified Facts vs Unconfirmed Theory Feed */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          {DOOMSDAY_VERIFIED_UPDATES.map((item) => {
            const isTheory = item.badge === 'FAN THEORY';
            const badgeStyle =
              item.tone === 'red'
                ? 'border-[#E62429]/50 bg-[#E62429]/15 text-[#FCA5A5]'
                : item.tone === 'emerald'
                  ? 'border-[#22C55E]/50 bg-[#22C55E]/15 text-[#86EFAC]'
                  : item.tone === 'blue'
                    ? 'border-[#38BDF8]/50 bg-[#38BDF8]/15 text-[#7DD3FC]'
                    : 'border-[#F59E0B]/50 bg-[#F59E0B]/15 text-[#FCD34D]';

            return (
              <div
                key={item.id}
                className={`p-3.5 border rounded-[3px] transition-colors ${
                  isTheory
                    ? 'border-[#F59E0B]/25 bg-[#120F08]/90 hover:border-[#F59E0B]/50'
                    : 'border-white/[0.08] bg-[#0B0D12] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 border text-[8.5px] font-mono font-bold tracking-[0.16em] uppercase rounded-[2px] inline-flex items-center gap-1 ${badgeStyle}`}>
                    {isTheory ? <AlertTriangle className="w-2.5 h-2.5" /> : <ShieldCheck className="w-2.5 h-2.5" />}
                    <span>{item.badge}</span>
                  </span>
                  <span className="text-[9px] font-mono text-[#777A80] truncate">{item.source}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-cinematic font-bold text-white leading-snug mb-1">
                  {item.headline}
                </h4>
                <p className="text-[11.5px] font-body text-[#9CA3AF] leading-relaxed">
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
