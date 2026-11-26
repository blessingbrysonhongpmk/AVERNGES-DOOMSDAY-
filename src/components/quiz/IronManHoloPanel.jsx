import React, { useState, useEffect } from 'react';
import { Radio, Volume2, Cpu } from 'lucide-react';

export default function IronManHoloPanel({
  commentText = '',
  score = 0,
  language = 'en',
  onHoloPing,
  isSuspended = false,
}) {
  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  // Natural character-by-character typing effect
  useEffect(() => {
    if (!commentText) {
      setTypedText('');
      setTypingDone(true);
      return;
    }
    setTypedText('');
    setTypingDone(false);
    let idx = 0;
    const timer = setInterval(() => {
      idx += 2;
      if (idx >= commentText.length) {
        setTypedText(commentText);
        setTypingDone(true);
        clearInterval(timer);
      } else {
        setTypedText(commentText.slice(0, idx));
      }
    }, 22);
    return () => clearInterval(timer);
  }, [commentText]);

  const finishTypingNow = () => {
    if (!typingDone) {
      setTypedText(commentText);
      setTypingDone(true);
    }
  };

  const tierLabel =
    score >= 10
      ? language === 'ta'
        ? 'STARK PRIORITY // LEGEND DETECTED'
        : 'STARK PRIORITY // LEGEND DETECTED'
      : score >= 6
        ? language === 'ta'
          ? 'COMPOUND TRANSMISSION // IMPRESSED'
          : 'COMPOUND TRANSMISSION // CLEARED'
        : language === 'ta'
          ? 'EMERGENCY ROAST // REWATCH ALERT'
          : 'STARK ROAST // TRAINING ALERT';

  return (
    <div
      onClick={finishTypingNow}
      className={`relative border rounded-[4px] p-4 sm:p-5 overflow-hidden text-left transition-colors ${
        isSuspended
          ? 'border-[#DC2626]/55 bg-gradient-to-br from-[#160A0D] via-[#0B0D12] to-[#08090C]'
          : 'border-[#255A7A]/60 bg-gradient-to-br from-[#0A1722] via-[#0A0E15] to-[#08090C]'
      }`}
    >
      {/* Animated Holographic Scanlines Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.09] animate-holo-scanlines"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, #38BDF8 0px, #38BDF8 1px, transparent 1px, transparent 4px)',
          backgroundSize: '100% 24px',
        }}
        aria-hidden="true"
      />

      {/* Top Holo-Comm Telemetry Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2 text-[9px] font-mono tracking-[0.2em] uppercase">
          <Radio className={`w-3.5 h-3.5 animate-pulse ${isSuspended ? 'text-[#F87171]' : 'text-[#38BDF8]'}`} />
          <span className={isSuspended ? 'text-[#FCA5A5]' : 'text-[#7DD3FC]'}>
            {tierLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onHoloPing && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onHoloPing();
              }}
              className="px-2.5 py-1 rounded-[2px] border border-[#38BDF8]/40 bg-[#0A1D2B] hover:bg-[#103047] text-[9px] font-mono text-[#BAE6FD] uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer transition-colors"
              title="Trigger holographic HUD signal chirp"
            >
              <Volume2 className="w-3 h-3" />
              <span>HUD SIGNAL</span>
            </button>
          )}
          <span className="px-2 py-0.5 rounded-[2px] bg-black/60 border border-white/15 text-[8.5px] font-mono text-[#9CA3AF] uppercase">
            HOLO-LINK // MK-85
          </span>
        </div>
      </div>

      {/* Main Content: Hologram Iron Man Portrait + Comment */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4">
        {/* Arc-Reactor Framed Portrait */}
        <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0">
          {/* Glowing Arc-Reactor Ring Accent */}
          <div
            className={`w-full h-full overflow-hidden rounded-[3px] border-2 relative ${
              isSuspended
                ? 'border-[#EF4444]/70 shadow-[0_0_24px_rgba(239,68,68,0.35)]'
                : 'border-[#38BDF8]/70 shadow-[0_0_24px_rgba(56,189,248,0.35)]'
            }`}
          >
            <img
              src="/characters/iron-man.jpg"
              alt="Tony Stark / Iron Man Hologram"
              className={`w-full h-full object-cover object-top filter contrast-[1.15] ${
                isSuspended ? 'animate-pulse saturate-125' : ''
              }`}
            />
            {/* Cyan/Crimson Holo Tint */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-25"
              style={{
                background: isSuspended
                  ? 'linear-gradient(180deg, rgba(239,68,68,0.45), transparent)'
                  : 'linear-gradient(180deg, rgba(56,189,248,0.5), transparent)',
              }}
            />
          </div>
          {/* Arc-Reactor Core Indicator */}
          <span
            className={`absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-2 border-[#08090C] flex items-center justify-center ${
              isSuspended ? 'bg-[#DC2626]' : 'bg-[#0284C7]'
            }`}
            title="Arc Reactor Telemetry Active"
          >
            <Cpu className="w-3 h-3 text-white animate-pulse" />
          </span>
        </div>

        {/* Typed Commentary Block */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-cinematic font-black tracking-wider text-white uppercase">
              TONY STARK // HOLO-BRIEFING
            </span>
          </div>
          <p className="text-xs sm:text-sm font-body text-[#F3F4F6] leading-relaxed min-h-[54px]">
            &ldquo;{typedText}&rdquo;
            {!typingDone && (
              <span className="inline-block w-1.5 h-3.5 bg-[#38BDF8] ml-1 align-middle animate-pulse" />
            )}
          </p>
          {!typingDone && (
            <span className="text-[8.5px] font-mono text-[#6B7280] uppercase mt-1 block">
              {language === 'ta' ? 'Click pannaa full message udaney varum' : 'Click panel to reveal instant message'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
