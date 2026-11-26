import React, { memo } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { CONFIG } from '../data/config.js';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { clockAudio } from '../utils/audio.js';
import CinematicAtmosphere from './CinematicAtmosphere';

const CompactUnit = memo(function CompactUnit({ value, label, isGreen = false }) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[28px] xs:min-w-[36px] sm:min-w-[52px] md:min-w-[68px]">
      <span
        className={`text-base xs:text-xl sm:text-3xl md:text-4xl font-sans font-bold leading-none select-none tabular-nums ${isGreen ? 'text-[#22C55E] drop-shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'text-white'
          }`}
      >
        {value}
      </span>
      <span className="text-[6.5px] xs:text-[7.5px] sm:text-[9px] font-mono tracking-[0.14em] sm:tracking-[0.2em] text-[#8C9098] uppercase mt-1 sm:mt-1.5 font-semibold select-none">
        {label}
      </span>
    </div>
  );
});

export default function FinalCountdown() {
  const { formatted, isArrived } = useCountdown(CONFIG.release.targetIsoString);

  const handleMarkCalendar = () => {
    try { clockAudio.tick(0); } catch (e) { }
    const title = encodeURIComponent("Marvel Studios' Avengers: Doomsday Theatrical Premiere");
    const details = encodeURIComponent("Everything leads to Doomsday. The Multiverse war culminates in theaters worldwide.");
    const location = encodeURIComponent("Cinemas Worldwide");
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261218T000000Z/20261218T235959Z&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="final-countdown"
      aria-label="Final Doomsday Countdown"
      className="relative py-16 sm:py-24 px-3 sm:px-6 border-t border-[#1E2024] bg-[#07080A] overflow-hidden"
    >
      {/* Background Cinematic Atmosphere */}
      <CinematicAtmosphere
        poster="/doctor-doom-stained-glass.jpg"
        overlayOpacity="bg-[#07080A]/[0.92]"
        accentGlow="emerald"
      />

      <div className="container max-w-5xl mx-auto relative z-10">

        {/* ── THE FINAL COUNTDOWN CARD (Matching reference image) ── */}
        <div className="relative border border-[#10B981]/40 bg-gradient-to-br from-[#0C0F14] via-[#080A0D] to-[#040507] p-6 sm:p-10 rounded-xs shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">

          {/* Subtle Stained Glass / Incursion Ambient Corner Lighting */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#10B981]/10 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#00FF88]/5 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* Left / Center Info */}
            <div className="text-center lg:text-left">

              <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 border border-[#10B981]/30 bg-[#10B981]/10 text-[9px] xs:text-[10px] font-mono tracking-[0.22em] text-[#34D399] uppercase rounded-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping shrink-0" />
                <span>THE FINAL COUNTDOWN</span>
              </div>

              <h2 className="text-xl xs:text-2xl sm:text-4xl font-cinematic font-black tracking-tight text-white uppercase mb-1">
                EVERYTHING LEADS TO DOOMSDAY.
              </h2>

              <p className="text-xs sm:text-sm font-mono tracking-widest text-[#8C9098] uppercase mb-4">
                ONE DESTINATION. ONE DATE.
              </p>

              {/* Big Vibrant Emerald Green Date Display */}
              <div className="text-2xl xs:text-3xl sm:text-5xl font-cinematic font-black text-[#22C55E] tracking-wider mb-6 drop-shadow-[0_0_20px_rgba(34,197,94,0.55)]">
                18 DECEMBER 2026
              </div>

              {/* Mark Your Calendar Action Button */}
              <button
                type="button"
                onClick={handleMarkCalendar}
                className="px-6 py-3 border border-[#10B981]/60 hover:border-[#00FF88] bg-[#0A120E] hover:bg-[#10B981]/20 text-white hover:text-[#00FF88] text-xs font-mono font-bold tracking-widest uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] inline-flex items-center gap-2.5 cursor-pointer rounded-xs"
              >
                <Calendar className="w-4 h-4 text-[#22C55E]" />
                <span>MARK YOUR CALENDAR</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

            </div>

            {/* Right: Live Synchronized Precision Countdown Monolith */}
            <div className="flex flex-col items-center shrink-0 w-full lg:w-auto">

              <div className="text-[10px] font-mono tracking-widest text-[#717682] uppercase mb-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>LIVE TIME REMAINING</span>
              </div>

              {!isArrived ? (
                <div className="w-full max-w-fit flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 border border-[#1E252D] bg-[#0A0C10] rounded-xs shadow-2xl">
                  <CompactUnit value={formatted.months} label="MONTHS" isGreen={false} />
                  <span className="text-white/60 font-sans font-bold text-sm sm:text-2xl self-start mt-0.5 px-0.5">:</span>
                  <CompactUnit value={formatted.daysInMonth} label="DAYS" isGreen={false} />
                  <span className="text-white/60 font-sans font-bold text-sm sm:text-2xl self-start mt-0.5 px-0.5">:</span>
                  <CompactUnit value={formatted.hours} label="HOURS" isGreen={false} />
                  <span className="text-[#22C55E]/80 font-sans font-bold text-sm sm:text-2xl self-start mt-0.5 px-0.5">:</span>
                  <CompactUnit value={formatted.minutes} label="MINS" isGreen={true} />
                  <span className="text-[#22C55E]/80 font-sans font-bold text-sm sm:text-2xl self-start mt-0.5 px-0.5">:</span>
                  <CompactUnit value={formatted.seconds} label="SECS" isGreen={true} />
                </div>
              ) : (
                <div className="text-sm font-mono tracking-widest text-[#22C55E] uppercase px-6 py-3 border border-[#22C55E]/40 bg-[#22C55E]/10">
                  {CONFIG.brand.arrivedMessage}
                </div>
              )}

              <p className="mt-4 text-[9px] sm:text-[10px] font-mono tracking-[0.18em] text-[#555862] uppercase text-center">
                ONE UNIVERSE WILL SURVIVE. PREPARE ACCORDINGLY.
              </p>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
