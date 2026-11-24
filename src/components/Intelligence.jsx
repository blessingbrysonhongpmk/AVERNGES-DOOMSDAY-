import React from 'react';
import { INTELLIGENCE_DATA } from '../data/intelligence.js';

export default function Intelligence() {
  return (
    <section
      id="intelligence"
      aria-label="Doomsday Intelligence Briefing"
      className="relative py-16 sm:py-24 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#08090B]"
    >
      {/* Bootstrap container boundary */}
      <div className="container max-w-6xl mx-auto">

        {/* Section Header */}
        <div className="mb-10 sm:mb-16 text-center max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 border border-[#1E2024] bg-[#111216]/80 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#E62429] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E62429] animate-pulse shrink-0" />
            {INTELLIGENCE_DATA.header.kicker}
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-cinematic font-black tracking-tight text-white uppercase mb-3">
            {INTELLIGENCE_DATA.header.title}
          </h2>
          <p className="text-xs sm:text-sm font-body text-[#777A80] leading-relaxed">
            {INTELLIGENCE_DATA.header.subtitle}
          </p>
        </div>

        {/* Verified Production Facts Grid (Bootstrap 12-column responsive layout) */}
        <div className="row g-3 sm:g-4 mb-12 sm:mb-16">
          {INTELLIGENCE_DATA.productionFacts.map((fact) => (
            <div key={fact.id} className="col-12 col-md-6 col-lg-4 flex">
              <div className="w-full border border-[#1E2024] bg-[#111216]/90 p-4 sm:p-6 flex flex-col justify-between hover:border-[#2D3036] transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <span className="text-[9px] xs:text-[10px] font-mono tracking-[0.2em] text-[#777A80] uppercase">
                      {fact.category}
                    </span>
                    <span
                      className={`text-[8px] xs:text-[9px] font-mono tracking-wider px-2 py-0.5 border ${
                        fact.badgeColor === 'green'
                          ? 'text-[#22C55E] border-[#22C55E]/30 bg-[#22C55E]/10'
                          : 'text-[#E62429] border-[#E62429]/30 bg-[#E62429]/10'
                      }`}
                    >
                      {fact.status}
                    </span>
                  </div>
                  <h3 className="text-sm xs:text-base sm:text-lg font-cinematic font-bold text-white mb-2 leading-snug">
                    {fact.headline}
                  </h3>
                  <p className="text-xs font-body text-[#D8D9DC]/80 leading-relaxed">
                    {fact.detail}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Canonical Incursion Telemetry Panels (Bootstrap 12-column responsive layout) */}
        <div className="border border-[#1E2024] bg-[#0D0E12] p-4 xs:p-6 sm:p-10">
          <div className="flex items-center gap-2 sm:gap-3 mb-6">
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
                    <span className="text-[9px] font-mono tracking-[0.2em] text-[#777A80] uppercase block mb-1">
                      {briefing.tag}
                    </span>
                    <h4 className="text-xs xs:text-sm font-cinematic font-bold text-white mb-2">
                      {briefing.title}
                    </h4>
                    <p className="text-xs text-[#8E929A] leading-relaxed">
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
