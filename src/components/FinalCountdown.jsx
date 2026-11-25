import React, { memo } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { CONFIG } from '../data/config.js';
import CinematicAtmosphere from './CinematicAtmosphere';

const CompactUnit = memo(function CompactUnit({ value, label, isGreen = false }) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[28px] xs:min-w-[36px] sm:min-w-[54px] md:min-w-[70px]">
      <span
        className={`text-base xs:text-xl sm:text-3xl md:text-4xl font-sans font-bold leading-none select-none tabular-nums ${isGreen ? 'text-[#22C55E]' : 'text-white'
          }`}
      >
        {value}
      </span>
      <span className="text-[6px] xs:text-[7px] sm:text-[9px] font-mono tracking-[0.14em] sm:tracking-[0.2em] text-[#777A80] uppercase mt-1 sm:mt-1.5 font-semibold select-none">
        {label}
      </span>
    </div>
  );
});

export default function FinalCountdown() {
  const { formatted, isArrived } = useCountdown(CONFIG.release.targetIsoString);

  return (
    <section
      id="final-countdown"
      aria-label="Final Doomsday Countdown"
      className="relative py-16 sm:py-24 px-3 sm:px-6 border-t border-[#1E2024] bg-[#08090B] text-center overflow-hidden"
    >
      {/* Background Cinematic Atmosphere */}
      <CinematicAtmosphere
        poster="/doctor-doom-stained-glass.jpg"
        overlayOpacity="bg-[#08090B]/92"
        accentGlow="emerald"
      />

      <div className="container max-w-4xl mx-auto relative z-10 flex flex-col items-center px-2">

        {/* Closing Monolith Emblem */}
        <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-full border border-[#1E2024] bg-[#111216] flex items-center justify-center mb-5">
          <span className="w-2 h-2 rounded-full bg-[#E62429] animate-pulse" />
        </div>

        {/* Closing Title per specification */}
        <h2 className="text-lg xs:text-xl sm:text-3xl md:text-4xl font-cinematic font-black tracking-tight text-white uppercase mb-2 max-w-xl">
          EVERYTHING LEADS TO DOOMSDAY.
        </h2>

        {/* Release Date */}
        <p className="text-[11px] xs:text-xs sm:text-sm font-mono tracking-[0.24em] sm:tracking-[0.28em] text-[#D8D9DC] uppercase mb-6 sm:mb-8 font-semibold">
          {CONFIG.release.displayDate}
        </p>

        {/* Live Synchronized Countdown Block (Fluid for all screen widths) */}
        {!isArrived ? (
          <div className="w-full max-w-fit flex items-center justify-center gap-0.5 xs:gap-1.5 sm:gap-2 px-2 xs:px-3 sm:px-5 py-2.5 sm:py-3.5 border border-[#1E2024] bg-[#0E0F13]/90 rounded-md shadow-2xl">
            <CompactUnit value={formatted.months} label="MONTHS" isGreen={false} />
            <span className="text-white/60 font-sans font-bold text-sm xs:text-lg sm:text-2xl self-start mt-0.5 px-0.5">:</span>
            <CompactUnit value={formatted.daysInMonth} label="DAYS" isGreen={false} />
            <span className="text-white/60 font-sans font-bold text-sm xs:text-lg sm:text-2xl self-start mt-0.5 px-0.5">:</span>
            <CompactUnit value={formatted.hours} label="HOURS" isGreen={false} />
            <span className="text-[#22C55E]/80 font-sans font-bold text-sm xs:text-lg sm:text-2xl self-start mt-0.5 px-0.5">:</span>
            <CompactUnit value={formatted.minutes} label="MINS" isGreen={true} />
            <span className="text-[#22C55E]/80 font-sans font-bold text-sm xs:text-lg sm:text-2xl self-start mt-0.5 px-0.5">:</span>
            <CompactUnit value={formatted.seconds} label="SECS" isGreen={true} />
          </div>
        ) : (
          <div className="text-xs sm:text-sm font-mono tracking-widest text-[#22C55E] uppercase">
            {CONFIG.brand.arrivedMessage}
          </div>
        )}

        <p className="mt-6 sm:mt-8 text-[9px] xs:text-[10px] font-mono tracking-[0.16em] sm:tracking-[0.2em] text-[#55585E] uppercase max-w-md">
          ONE UNIVERSE WILL SURVIVE. PREPARE ACCORDINGLY.
        </p>

      </div>
    </section>
  );
}
