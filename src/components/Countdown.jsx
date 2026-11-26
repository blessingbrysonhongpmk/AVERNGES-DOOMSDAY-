import React, { memo, useState, useEffect, useRef } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { CONFIG, getCountdownMilestone } from '../data/config.js';
import { useClockAudio } from '../utils/audio.js';

/**
 * Responsive geometric digit unit matching live broadcast reference.
 * Optimized with Bootstrap-aligned breakpoints (xs, sm, md, lg, xl).
 * Tabular numerals ensure zero layout jitter across all screen widths.
 */
const DigitBlock = memo(function DigitBlock({ value, label, isGreen = false }) {
  return (
    <div className="flex flex-col items-center justify-center min-w-[28px] xs:min-w-[34px] sm:min-w-[56px] md:min-w-[76px] lg:min-w-[92px]">
      <span
        className={`text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-sans font-bold leading-none select-none tabular-nums transition-colors duration-150 ${isGreen
          ? 'text-[#22C55E] sm:text-[#38E54D] drop-shadow-[0_0_16px_rgba(34,197,94,0.65)]'
          : 'text-white'
          }`}
        style={{ letterSpacing: '-0.02em' }}
      >
        {value}
      </span>
      <span className="text-[7px] xs:text-[8px] sm:text-[10px] md:text-xs font-mono tracking-[0.14em] xs:tracking-[0.18em] sm:tracking-[0.2em] text-[#8E929A] uppercase mt-1.5 sm:mt-2.5 font-semibold select-none">
        {label}
      </span>
    </div>
  );
});

/**
 * Colon separator between countdown time units.
 */
const ColonSeparator = memo(function ColonSeparator({ isGreen = false }) {
  return (
    <div className="flex flex-col items-center justify-start self-start pt-0.5 sm:pt-1 md:pt-1.5 px-0.5 sm:px-1 md:px-1.5 shrink-0 select-none" aria-hidden="true">
      <span
        className={`text-base xs:text-lg sm:text-3xl md:text-4xl lg:text-5xl font-sans font-bold leading-none ${isGreen
          ? 'text-[#22C55E] sm:text-[#38E54D] drop-shadow-[0_0_12px_rgba(34,197,94,0.5)]'
          : 'text-white/80'
          }`}
      >
        :
      </span>
      <span className="text-[7px] xs:text-[8px] sm:text-[10px] md:text-xs font-mono uppercase mt-1.5 sm:mt-2.5 opacity-0 select-none">
        .
      </span>
    </div>
  );
});

export default function Countdown() {
  const { days, isArrived, formatted } = useCountdown(CONFIG.release.targetIsoString);
  const [bgError, setBgError] = useState(false);
  const { enabled: soundEnabled, tick: playTick } = useClockAudio();
  const lastTickSecondRef = useRef(null);
  const prevSoundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    const justEnabled = !prevSoundEnabledRef.current && soundEnabled;
    prevSoundEnabledRef.current = soundEnabled;

    if (!soundEnabled || isArrived || formatted.seconds === undefined) {
      if (!soundEnabled) lastTickSecondRef.current = null;
      return;
    }

    const sec = Number(formatted.seconds);
    if (justEnabled) {
      lastTickSecondRef.current = sec;
      return;
    }
    if (lastTickSecondRef.current === sec) return;
    lastTickSecondRef.current = sec;
    playTick(sec, { isCountdown: true });
  }, [formatted.seconds, soundEnabled, isArrived, playTick]);

  const milestone = getCountdownMilestone(days, isArrived);

  return (
    <section
      id="overview"
      aria-label="Avengers Doomsday Countdown"
      className="relative min-h-[88svh] sm:min-h-[94svh] flex flex-col items-center justify-center text-center overflow-hidden px-2 xs:px-3 sm:px-4"
    >
      {/* ── Background Artwork (Doctor Doom Stained-Glass with dark falloff) ── */}
      {!bgError ? (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <img
            src="/doctor-doom-stained-glass.jpg"
            alt="Doctor Doom"
            loading="eager"
            onError={() => setBgError(true)}
            className="hero-bg-img w-full h-full object-cover transition-opacity duration-700"
            style={{
              objectPosition: 'center 20%',
              filter: 'contrast(1.15) brightness(0.7)',
            }}
          />
          {/* Natural dark cinematic gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(8,9,11,0.65) 0%, rgba(8,9,11,0.2) 20%, rgba(8,9,11,0.7) 48%, #08090B 75%, #08090B 100%)',
            }}
          />
          {/* Subtle edge vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to right, #08090B 0%, transparent 20%, transparent 80%, #08090B 100%)',
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-[#08090B]" aria-hidden="true" />
      )}

      {/* ── Hero Theatrical Content (Bootstrap Container Aligned) ── */}
      <div className="container relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto pt-8 pb-10 sm:pt-14 sm:pb-16 px-2 sm:px-4">

        {/* Main Cinematic Title — Official Marvel Studios Avengers: Doomsday Emblem */}
        <div className="relative flex flex-col items-center justify-center text-center select-none mb-3 sm:mb-4 w-full">
          <h1 className="sr-only">Marvel Studios Avengers: Doomsday</h1>
          <div className="w-full max-w-[240px] xs:max-w-[280px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[540px] px-2 flex items-center justify-center">
            <img
              src="/avengers-doomsday-logo.png"
              alt="Marvel Studios Avengers: Doomsday"
              loading="eager"
              className="w-full h-auto object-contain select-none filter drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]"
            />
          </div>
        </div>

        {/* Release Date */}
        <p className="text-[11px] xs:text-xs sm:text-sm font-mono tracking-[0.24em] sm:tracking-[0.26em] text-[#D8D9DC] uppercase mb-4 sm:mb-6 select-none font-medium">
          {CONFIG.release.displayDate}
        </p>

        {/* Milestone Indicator */}
        {milestone && !isArrived && (
          <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 px-3 py-1 border border-[#1E2024] bg-[#111216]/90 backdrop-blur-sm select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E62429]" />
            <span className="text-[9px] xs:text-[10px] font-mono tracking-[0.2em] text-[#D8D9DC] uppercase">
              {milestone}
            </span>
          </div>
        )}

        {/* ── Reference Header: DOOMSDAY IS COMING ── */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2.5 sm:mb-4 w-full max-w-md">
          <span className="h-px w-4 xs:w-6 sm:w-8 bg-gradient-to-r from-transparent to-[#777A80]/60 shrink-0" />
          <h2 className="text-[11px] xs:text-xs sm:text-sm md:text-base font-sans font-bold tracking-[0.22em] sm:tracking-[0.24em] text-white uppercase select-none truncate">
            DOOMSDAY IS COMING
          </h2>
          <span className="h-px w-4 xs:w-6 sm:w-8 bg-gradient-to-l from-transparent to-[#777A80]/60 shrink-0" />
        </div>

        {/* ── Countdown Units (Fluidly responsive across all devices) ── */}
        {isArrived ? (
          <div className="border border-[#1E2024] bg-[#111216]/95 py-8 sm:py-10 px-6 sm:px-8 w-full max-w-xl">
            <h2
              className="font-cinematic font-black text-metallic uppercase mb-2"
              style={{ fontSize: 'clamp(1.25rem, 5vw, 3rem)', letterSpacing: '0.08em' }}
            >
              {CONFIG.brand.arrivedMessage}
            </h2>
            <p className="text-[10px] font-mono tracking-[0.2em] text-[#777A80] uppercase">
              The saga has begun.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-fit flex items-center justify-center my-1 sm:my-2 px-1 xs:px-2 sm:px-4 py-2 sm:py-3 rounded-lg bg-black/35 backdrop-blur-[2px] border border-white/5">
            {/* MONTHS — White */}
            <DigitBlock value={formatted.months} label="MONTHS" isGreen={false} />
            <ColonSeparator isGreen={false} />

            {/* DAYS — White */}
            <DigitBlock value={formatted.daysInMonth} label="DAYS" isGreen={false} />
            <ColonSeparator isGreen={false} />

            {/* HOURS — White */}
            <DigitBlock value={formatted.hours} label="HOURS" isGreen={false} />
            <ColonSeparator isGreen={true} />

            {/* MINUTES — Green */}
            <DigitBlock value={formatted.minutes} label="MINUTES" isGreen={true} />
            <ColonSeparator isGreen={true} />

            {/* SECONDS — Green */}
            <DigitBlock value={formatted.seconds} label="SECONDS" isGreen={true} />
          </div>
        )}

      </div>

      {/* Fade transition to following section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, #08090B)' }}
        aria-hidden="true"
      />
    </section>
  );
}
