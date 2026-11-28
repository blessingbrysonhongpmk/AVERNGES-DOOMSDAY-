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
    <div className="relative mb-10 sm:mb-16 border-2 border-white/15 bg-[#0A0B10] shadow-[6px_6px_0_#000] overflow-hidden">
      {/* Studio Widescreen Backdrop + Halftone Banner Texture */}
      <div className="relative grid grid-cols-1 lg:grid-cols-12 sm:min-h-[430px]">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
          <img
            src="/doomsday-ensemble-poster.jpg"
            alt="Avengers Doomsday Key Art"
            width={1280}
            height={720}
            loading="eager"
            className="w-full h-full object-cover object-[72%_25%] opacity-35 filter contrast-125 saturate-95"
          />
          <div className="absolute inset-0 fan-halftone-bg opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07080C] via-[#07080C]/88 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07080C] via-transparent to-[#07080C]/60" />

          {/* Projector-Cone Secret Scribbles (Revealed Only Under Cursor Beam) */}
          <div className="fanverse-projector-secret absolute inset-0 flex items-start justify-end p-6 sm:p-10">
            <p className="fan-font-note text-xl sm:text-2xl text-[#FACC15] -rotate-3 max-w-xs text-right">
              &ldquo;4AM FDFS TICKET LOCKED — ROHINI SCREEN 1 CONFIRMED?&rdquo;
            </p>
          </div>
        </div>

        {/* Left Column: Flex-Banner Oversized Tamil Cinema Typography */}
        <div className="lg:col-span-7 relative z-10 px-4 sm:px-8 lg:px-10 py-7 sm:py-12 flex flex-col justify-center items-start text-left min-w-0">
          {/* Stamped Theatre Tag */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="px-2.5 py-1 bg-[var(--marvel-red)] text-white text-[10px] fan-font-mono font-bold shadow-[2px_2px_0_#000]">
              FDFS SPECIAL EDITION
            </span>
            <span className="text-[10.5px] fan-font-mono font-bold text-[var(--gold-foil)]">
              MULTIVERSE ORU TAMIL VIBE!
            </span>
          </div>

          {/* Oversized Flex-Banner Title with Halftone & One Slow Diagonal Sweep */}
          <div className="relative overflow-hidden inline-block max-w-full mb-3 pr-2">
            <h2 className="text-5xl xs:text-6xl sm:text-7xl lg:text-[82px] fan-font-flex fan-flex-headline uppercase leading-[0.88]">
              TAMIL FANVERSE
            </h2>
            <span className="fan-flex-sweep" aria-hidden="true" />
          </div>

          <p className="text-base sm:text-xl fan-font-editorial text-[var(--gold-foil)] mb-2.5">
            &ldquo;Idhu just oru fandom illa. Idhu oru emotion!&rdquo;
          </p>

          <p className="text-xs sm:text-sm fan-font-body text-[#D5D1C8] max-w-xl mb-5">
            &ldquo;Multiverse maaralam... Aana namma fan vibe maarathu!&rdquo; — Avengers, X-Men, Fantastic Four &amp; Doctor Doom ore frame-la varra Doomsday event-ukkana Tamil fan hub.
          </p>

          {/* Studio Credit Line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] fan-font-mono text-[#A6A298] mb-6">
            <span className="text-[var(--ink)] font-bold">IN CINEMAS DEC 18, 2026</span>
            <span>/</span>
            <span>RUSSO BROTHERS</span>
            <span>/</span>
            <span>MCFEELY &amp; WALDRON</span>
            <span>/</span>
            <span>ALAN SILVESTRI</span>
            <span>/</span>
            <span className="text-[var(--doom-green)] font-bold">TAMIL &bull; IMAX &bull; PLF</span>
          </div>

          {/* Tactile Hard-Offset Angled-Cut Buttons (Exact Copy Preserved) */}
          <div className="flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => {
                try { clockAudio.tick(0); } catch { }
                onPlayVideo(featuredVideo);
              }}
              className="fan-btn-tactile marvel-btn-cut px-6 py-3 bg-[var(--marvel-red)] hover:bg-[#c81f25] text-white text-xs fan-font-mono font-bold inline-flex items-center gap-2.5 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>WATCH TAMIL TRAILER</span>
            </button>

            <button
              type="button"
              onClick={onMarkCalendar}
              className="fan-btn-tactile marvel-btn-cut px-5 py-3 border-2 border-white/30 hover:border-[var(--gold-foil)] bg-[#11131B] text-[var(--ink)] text-xs fan-font-mono font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[var(--marvel-red)]" />
              <span>REMIND DEC 18</span>
            </button>

            <button
              type="button"
              onClick={() => {
                try { clockAudio.tick(0); } catch { }
                onJumpTo('fanverse-hub');
              }}
              className="px-2.5 py-2 text-[11px] fan-font-mono font-bold text-[var(--paper)] hover:text-[var(--doom-green)] inline-flex items-center gap-1 cursor-pointer transition-colors group"
            >
              <span>FAN CLUB &amp; POLLS</span>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--marvel-red)] group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Column: Doctor Doom + Giant Perforated Theatre Ticket Countdown */}
        <div className="lg:col-span-5 relative z-10 p-4 sm:p-7 flex flex-col justify-end lg:border-l-2 border-white/10 bg-black/45 min-w-0">
          <div className="relative bg-[#101218] border-2 border-white/15 shadow-[6px_6px_0_#000] overflow-visible">
            {/* Portrait Plate with Doom Green Rim Bar */}
            <div className="relative aspect-[16/9] overflow-hidden bg-black">
              <img
                src="/doctor-doom-portrait.jpg"
                alt="Robert Downey Jr. as Victor von Doom — Doctor Doom"
                width={800}
                height={450}
                loading="eager"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101218] via-transparent to-black/25" />
              <div className="absolute bottom-2.5 left-4 right-4 flex items-end justify-between gap-2">
                <div>
                  <span className="text-[9.5px] fan-font-mono text-[var(--doom-green)] font-bold block">
                    VICTOR VON DOOM
                  </span>
                  <p className="text-lg sm:text-xl fan-font-flex text-white uppercase tracking-wide leading-none">
                    Robert Downey Jr. Returns
                  </p>
                </div>
                <span className="text-[9px] fan-font-mono px-2 py-0.5 bg-black/85 border border-[var(--doom-green)]/50 text-[var(--doom-green)]">
                  SERIAL #616-A
                </span>
              </div>
            </div>

            {/* Perforated Paper Theatre Ticket Stub */}
            <div className="fan-paper-surface relative border-t-2 border-dashed border-[#151412] p-4 sm:p-5">
              {/* Perforated left/right ticket semi-circles */}
              <span aria-hidden="true" className="hidden sm:block absolute -left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--bg)] border border-white/15" />
              <span aria-hidden="true" className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[var(--bg)] border border-white/15" />

              {/* Angled FDFS READY Stamp */}
              <div
                aria-hidden="true"
                className="fan-rubber-stamp absolute top-3 right-3 text-[9px] text-[var(--marvel-red)] rotate-[-8deg] bg-[#E9E2D0]/85 pointer-events-none"
              >
                FDFS READY
              </div>

              <div className="flex items-end justify-between gap-2 mb-3 pr-24">
                <div>
                  <span className="text-[9px] fan-font-mono text-[#4B463D] block font-bold">
                    THEATRICAL COUNTDOWN // ROW A SEAT 01
                  </span>
                  <span className="text-2xl sm:text-3xl fan-font-flex text-[#11100E] uppercase leading-none block mt-0.5">
                    18 DEC 2026
                  </span>
                </div>
              </div>

              {/* Mechanical Split-Flap Countdown Digits */}
              <div className="grid grid-cols-5 gap-1.5 text-center border-t border-b border-[#151412]/25 py-2.5">
                {[
                  { val: formatted.months, label: 'MTH' },
                  { val: formatted.daysInMonth, label: 'DAYS' },
                  { val: formatted.hours, label: 'HRS' },
                  { val: formatted.minutes, label: 'MIN' },
                  { val: formatted.seconds, label: 'SEC', accent: true },
                ].map((u) => (
                  <div key={u.label} className="bg-[#151412] text-white py-1.5 px-1 rounded-[2px] border-b-2 border-black">
                    <span
                      key={u.accent ? `sec-${u.val}` : u.label}
                      className={`text-base sm:text-lg fan-font-mono font-bold block leading-none ${
                        u.accent ? 'fan-flip-digit text-[var(--doom-green)]' : 'text-[var(--ink)]'
                      }`}
                    >
                      {u.val}
                    </span>
                    <span className="text-[8px] font-mono text-[#9CA3AF] uppercase mt-1 block">
                      {u.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Ticket Barcode & Stub Serial Row */}
              <div className="mt-2.5 flex items-center justify-between gap-3">
                <svg width="110" height="18" viewBox="0 0 110 18" aria-hidden="true" className="opacity-85 shrink-0">
                  <path
                    d="M2 0h3v18H2zM7 0h1v18H7zM10 0h4v18h-4zM16 0h2v18h-2zM20 0h1v18h-1zM24 0h3v18h-3zM29 0h2v18h-2zM34 0h4v18h-4zM40 0h1v18h-1zM44 0h2v18h-2zM48 0h3v18h-3zM54 0h1v18h-1zM58 0h4v18h-4zM64 0h2v18h-2zM69 0h1v18h-1zM73 0h3v18h-3zM79 0h2v18h-2zM84 0h4v18h-4zM90 0h1v18h-1zM94 0h3v18h-3zM99 0h2v18h-2zM104 0h4v18h-4z"
                    fill="#151412"
                  />
                </svg>
                <span className="text-[9px] fan-font-mono text-[#3F3A32] font-bold">
                  NO. 0616-DOOM-IMAX
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
