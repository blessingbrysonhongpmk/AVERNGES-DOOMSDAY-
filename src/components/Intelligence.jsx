import React from 'react';
import { INTELLIGENCE_DATA } from '../data/intelligence.js';
import CinematicAtmosphere from './CinematicAtmosphere';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Intelligence() {
  const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal();
  const { ref: gridRef, isRevealed: gridRevealed } = useScrollReveal();
  const { ref: telemetryRef, isRevealed: telemetryRevealed } = useScrollReveal();

  return (
    <section
      id="intelligence"
      aria-label="Doomsday Intelligence Briefing"
      className="relative py-16 sm:py-24 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#08090B] overflow-hidden"
    >
      {/* Background Cinematic Atmosphere */}
      <CinematicAtmosphere
        poster="/doctor-doom-portrait.jpg"
        overlayOpacity="bg-[#08090B]/92"
        accentGlow="emerald"
      />

      {/* Bootstrap container boundary */}
      <div className="container max-w-6xl mx-auto relative z-10">

        {/* Section Header with Scroll Reveal */}
        <div
          ref={headerRef}
          className={`mb-10 sm:mb-16 text-center max-w-2xl mx-auto px-2 reveal-fade-up ${
            headerRevealed ? 'is-revealed' : ''
          }`}
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 border border-[#1E2024] bg-[#111216]/90 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#22C55E] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
            {INTELLIGENCE_DATA.header.kicker}
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-cinematic font-black tracking-tight text-white uppercase mb-3">
            {INTELLIGENCE_DATA.header.title}
          </h2>
          <p className="text-xs sm:text-sm font-body text-[#8C9098] leading-relaxed">
            {INTELLIGENCE_DATA.header.subtitle}
          </p>
        </div>

        {/* Verified Production Facts Grid (Bootstrap 12-column responsive layout) */}
        <div
          ref={gridRef}
          className={`row g-3 sm:g-4 mb-12 sm:mb-16 reveal-fade-up ${
            gridRevealed ? 'is-revealed' : ''
          }`}
        >
          {INTELLIGENCE_DATA.productionFacts.map((fact, idx) => (
            <div key={fact.id} className="col-12 col-md-6 col-lg-4 flex">
              <div className="w-full border border-[#1E2024] hover:border-[#2E323D] bg-[#0D0E13]/90 p-4 sm:p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl rounded-xs group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <span className="text-[9px] xs:text-[10px] font-mono tracking-[0.2em] text-[#717682] uppercase">
                      {fact.category}
                    </span>
                    <span
                      className={`text-[8px] xs:text-[9px] font-mono tracking-wider px-2 py-0.5 border rounded-xs ${
                        fact.badgeColor === 'green'
                          ? 'text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10'
                          : 'text-[#E62429] border-[#E62429]/30 bg-[#E62429]/10'
                      }`}
                    >
                      {fact.status}
                    </span>
                  </div>
                  <h3 className="text-sm xs:text-base sm:text-lg font-cinematic font-bold text-white mb-2 leading-snug group-hover:text-white transition-colors">
                    {fact.headline}
                  </h3>
                  <p className="text-xs font-body text-[#8C9098] leading-relaxed">
                    {fact.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Canonical Incursion Telemetry Panels (Bootstrap 12-column responsive layout) */}
        <div
          ref={telemetryRef}
          className={`border border-[#1E2024] bg-[#0B0C10]/95 p-4 xs:p-6 sm:p-10 rounded-xs shadow-2xl reveal-fade-up ${
            telemetryRevealed ? 'is-revealed' : ''
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-6 pb-3 border-b border-[#1A1C22]">
            <span className="w-2 h-2 bg-[#22C55E] shrink-0" />
            <h3 className="text-xs sm:text-sm font-mono tracking-[0.2em] sm:tracking-[0.22em] text-white uppercase font-bold">
              CANONICAL MULTIVERSAL TELEMETRY
            </h3>
          </div>
          <div className="row g-4">
            {INTELLIGENCE_DATA.incursionBriefings.map((briefing, idx) => (
              <div key={idx} className="col-12 col-md-4">
                <div className="border-l-2 border-[#2A2D33] pl-3 sm:pl-5 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.2em] text-[#717682] uppercase block mb-1">
                      {briefing.tag}
                    </span>
                    <h4 className="text-xs xs:text-sm font-cinematic font-bold text-white mb-2">
                      {briefing.title}
                    </h4>
                    <p className="text-xs text-[#8C9098] leading-relaxed">
                      {briefing.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
