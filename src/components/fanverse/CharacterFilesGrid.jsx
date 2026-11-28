import React, { useState, useEffect } from 'react';
import { X, Zap, Film, Link2, Sparkles } from 'lucide-react';
import { CHARACTER_FILES } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

export default function CharacterFilesGrid() {
  const [selectedChar, setSelectedChar] = useState(null);

  useEffect(() => {
    if (!selectedChar) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedChar(null);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [selectedChar]);

  return (
    <div id="fanverse-characters" className="mb-10 sm:mb-16 scroll-mt-24">
      {/* Studio Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <span className="text-[11px] font-hud font-bold tracking-[0.26em] text-[#E62429] uppercase block mb-1">
            EXPLORE THE MULTIVERSE LEGENDS
          </span>
          <h3 className="text-2xl sm:text-4xl font-hud font-extrabold text-white uppercase tracking-wide leading-none">
            CHARACTER FILES
          </h3>
        </div>
        <p className="text-xs sm:text-sm font-body text-[#9CA3AF]">
          Click any profile to inspect Tanglish bio, powers &amp; Doomsday links.
        </p>
      </div>

      {/* Signature Marvel.com Chamfer Character Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-5">
        {CHARACTER_FILES.map((char) => (
          <button
            key={char.id}
            type="button"
            onClick={() => {
              try { clockAudio.tick(0); } catch { }
              setSelectedChar(char);
            }}
            className="marvel-chamfer text-left bg-[#151515] group cursor-pointer overflow-hidden flex flex-col focus:outline-none shadow-xl"
          >
            {/* Clean Portrait Plate */}
            <div className="relative aspect-[4/5] w-full bg-black overflow-hidden">
              <img
                src={char.image}
                alt={char.name}
                loading="lazy"
                className="w-full h-full object-cover object-[50%_18%] transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Signature Marvel 4px Red Divider + Hover Curtain Plate */}
            <div className="relative flex-1 p-2.5 sm:p-4 bg-[#151515] border-t-4 border-[#E62429] overflow-hidden flex flex-col justify-between min-h-[78px] sm:min-h-[96px]">
              {/* Upward Marvel Red Curtain on Hover */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[#E62429] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
              />

              <div className="relative z-10">
                <h4 className="text-sm sm:text-base font-hud font-bold text-white uppercase tracking-wide leading-tight">
                  {char.name}
                </h4>
                <span className="text-[10px] font-mono text-[#9CA3AF] group-hover:text-white/90 uppercase block mt-1 truncate">
                  {char.realName}
                </span>
              </div>

              <span className="relative z-10 text-[9.5px] font-hud font-bold tracking-[0.16em] text-[#777A80] group-hover:text-white uppercase mt-3 block truncate">
                {char.actor}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Studio Character Dossier Modal */}
      {selectedChar && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedChar.name} Profile Dossier`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/88 backdrop-blur-md"
          onClick={() => setSelectedChar(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0D0E12] border border-white/[0.12] shadow-2xl marvel-chamfer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-1 w-full bg-[#E62429]" />

            <button
              type="button"
              onClick={() => setSelectedChar(null)}
              aria-label="Close character file"
              className="absolute top-4 right-4 z-20 w-8 h-8 border border-white/15 hover:border-[#E62429] bg-black/75 hover:bg-[#E62429] text-white inline-flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 relative min-h-[260px] bg-black">
                <img
                  src={selectedChar.image}
                  alt={selectedChar.name}
                  className="w-full h-full object-cover object-[50%_18%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-black/25 md:bg-gradient-to-r md:from-transparent md:to-[#0D0E12]" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] font-hud font-bold tracking-[0.2em] text-[#E62429] uppercase block">
                    {selectedChar.actor}
                  </span>
                  <h4 className="text-2xl font-hud font-extrabold text-white uppercase tracking-wide">
                    {selectedChar.name}
                  </h4>
                  <p className="text-[10px] font-mono text-[#9CA3AF] uppercase">{selectedChar.roleLabel}</p>
                </div>
              </div>

              <div className="md:col-span-7 p-5 sm:p-6 space-y-4">
                <div>
                  <p className="text-xs sm:text-sm font-display font-bold text-[#FCA5A5] mb-1.5">
                    {selectedChar.tagline}
                  </p>
                  <p className="text-xs sm:text-sm font-body text-[#D1D5DB] leading-relaxed">
                    {selectedChar.introTanglish}
                  </p>
                </div>

                <div>
                  <h5 className="text-[10.5px] font-hud font-bold tracking-[0.2em] text-white uppercase mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#E62429]" />
                    <span>POWERS &amp; ABILITIES</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {selectedChar.powers.map((pow, i) => (
                      <li key={i} className="text-xs font-body text-[#B8BEC8] flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[#E62429] mt-1.5 shrink-0" />
                        <span>{pow}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-[10.5px] font-hud font-bold tracking-[0.2em] text-white uppercase mb-2 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[#E62429]" />
                    <span>KEY MCU APPEARANCES</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedChar.appearances.map((app, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-[#15171E] border border-white/[0.08] text-[10px] font-mono text-[#E5E7EB]"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-[#12141B] border-l-2 border-[#E62429] space-y-2.5">
                  <div className="flex items-start gap-2 text-xs font-body text-[#C8CDD6]">
                    <Link2 className="w-4 h-4 text-[#E62429] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-hud font-bold tracking-wider text-[10px] uppercase text-white block">
                        STORY CONNECTION
                      </span>
                      {selectedChar.connections}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/[0.07] flex items-start gap-2 text-xs font-body text-[#C8CDD6]">
                    <Sparkles className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-hud font-bold tracking-wider text-[10px] uppercase text-white block">
                        FANVERSE FACT
                      </span>
                      {selectedChar.fact}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
