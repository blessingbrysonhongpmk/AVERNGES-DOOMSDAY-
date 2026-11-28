import React from 'react';
import { Calendar, Play, ChevronRight } from 'lucide-react';
import { clockAudio } from '../../utils/audio.js';

export default function TamilFanverseHero({
  featuredVideo,
  onPlayVideo,
  formatted,
  onMarkCalendar,
  onJumpTo,
}) {
  return (
    <div className="relative mb-9 sm:mb-16 border-b border-white/[0.08] bg-[#0B0C0F] overflow-hidden">
      {/* Studio Widescreen Key Art Composition */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 sm:min-h-[430px]">
        {/* Background Atmospheric Key Art */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <img
            src="/doomsday-ensemble-poster.jpg"
            alt="Avengers Doomsday Key Art"
            className="w-full h-full object-cover object-[72%_25%] opacity-40 filter contrast-115 saturate-95"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090A0D] via-[#090A0D]/88 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A0D] via-transparent to-[#090A0D]/55" />
        </div>

        {/* Left Column: Pure Marvel Editorial Title Block */}
        <div className="lg:col-span-7 relative z-10 px-4 sm:px-8 lg:px-10 py-6 sm:py-12 flex flex-col justify-center items-start text-left min-w-0">
          {/* Iconic Marvel Scarlet Eyebrow Rule */}
          <div className="flex items-center gap-3 mb-3">
            <span className="h-[3px] w-7 bg-[#E62429]" />
            <span className="text-[11px] font-hud font-bold tracking-[0.26em] text-white uppercase">
              MULTIVERSE ORU TAMIL VIBE!
            </span>
          </div>

          <h2 className="text-4xl xs:text-5xl sm:text-6xl lg:text-[66px] font-cinematic font-black tracking-tight text-white uppercase leading-[0.94] mb-3 drop-shadow-[0_6px_28px_rgba(0,0,0,0.85)]">
            TAMIL FANVERSE
          </h2>

          <p className="text-base sm:text-xl font-hud font-bold tracking-wide text-[#F3F4F6] uppercase mb-2.5">
            &ldquo;Idhu just oru fandom illa. Idhu oru emotion!&rdquo;
          </p>

          <p className="text-xs sm:text-sm font-body text-[#B4B9C2] leading-relaxed max-w-xl mb-5">
            &ldquo;Multiverse maaralam... Aana namma fan vibe maarathu!&rdquo; — Avengers, X-Men, Fantastic Four &amp; Doctor Doom ore frame-la varra Doomsday event-ukkana Tamil fan hub.
          </p>

          {/* Studio Credit Line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] font-mono text-[#8C9098] uppercase tracking-wider mb-6">
            <span className="text-white font-semibold">IN CINEMAS DEC 18, 2026</span>
            <span>/</span>
            <span>RUSSO BROTHERS</span>
            <span>/</span>
            <span>MCFEELY &amp; WALDRON</span>
            <span>/</span>
            <span>ALAN SILVESTRI</span>
            <span>/</span>
            <span className="text-[#E62429] font-semibold">TAMIL • IMAX • PLF</span>
          </div>

          {/* Authentic Chamfered Marvel CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                try { clockAudio.tick(0); } catch { }
                onPlayVideo(featuredVideo);
              }}
              className="marvel-btn-cut px-6 py-3 bg-[#E62429] hover:bg-[#C8191E] text-white text-xs font-hud font-bold tracking-[0.2em] uppercase inline-flex items-center gap-2.5 cursor-pointer transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>WATCH TAMIL TRAILER</span>
            </button>

            <button
              type="button"
              onClick={onMarkCalendar}
              className="marvel-btn-cut px-5 py-3 border border-white/25 hover:border-white bg-black/50 hover:bg-white/[0.08] text-white text-xs font-hud font-bold tracking-[0.18em] uppercase inline-flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-[#E62429]" />
              <span>REMIND DEC 18</span>
            </button>

            <button
              type="button"
              onClick={() => {
                try { clockAudio.tick(0); } catch { }
                onJumpTo('fanverse-hub');
              }}
              className="px-2 py-2 text-[11px] font-hud font-bold tracking-[0.18em] text-[#D1D5DB] hover:text-white uppercase inline-flex items-center gap-1 cursor-pointer transition-colors group"
            >
              <span>FAN CLUB &amp; POLLS</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#E62429] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Doctor Doom Theatrical Portrait + Clean Matte Ticket Countdown */}
        <div className="lg:col-span-5 relative z-10 p-4 sm:p-8 lg:p-8 flex flex-col justify-end lg:border-l border-white/[0.08] bg-black/35 backdrop-blur-[2px] min-w-0">
          <div className="marvel-chamfer bg-[#121318] border border-white/[0.1] overflow-hidden shadow-2xl">
            <div className="relative aspect-[16/9] overflow-hidden bg-black">
              <img
                src="/doctor-doom-portrait.jpg"
                alt="Robert Downey Jr. as Victor von Doom — Doctor Doom"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-black/25" />
              <div className="absolute bottom-2.5 left-4 right-4 flex items-end justify-between gap-2">
                <div>
                  <span className="text-[9.5px] font-mono tracking-[0.2em] text-[#E62429] font-semibold uppercase block">
                    VICTOR VON DOOM
                  </span>
                  <p className="text-sm sm:text-base font-hud font-bold text-white uppercase tracking-wide">
                    Robert Downey Jr. Returns
                  </p>
                </div>
              </div>
            </div>

            <div className="h-[3px] w-full bg-[#E62429]" />

            <div className="p-4">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-mono tracking-[0.18em] text-[#9CA3AF] uppercase">
                  THEATRICAL COUNTDOWN
                </span>
                <span className="text-xs font-hud font-bold tracking-[0.16em] text-white uppercase">
                  18 DEC 2026
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 text-center border-t border-b border-white/[0.08] py-2.5">
                {[
                  { val: formatted.months, label: 'MTH' },
                  { val: formatted.daysInMonth, label: 'DAYS' },
                  { val: formatted.hours, label: 'HRS' },
                  { val: formatted.minutes, label: 'MIN' },
                  { val: formatted.seconds, label: 'SEC', accent: true },
                ].map((u) => (
                  <div key={u.label}>
                    <span
                      className={`text-base font-hud font-bold block tabular-nums leading-none ${u.accent ? 'text-[#E62429]' : 'text-white'
                        }`}
                    >
                      {u.val}
                    </span>
                    <span className="text-[8px] font-mono text-[#777A80] uppercase mt-1 block">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
