import React, { useState, useEffect } from 'react';
import { X, Zap, Film, Link2, Sparkles } from 'lucide-react';
import { CHARACTER_FILES } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

const CHARACTER_RARITY_THEME = {
  'iron-man': { edge: '#E4262C', second: '#D9B45B', rarity: 'LEGEND', note: 'Mk 85 Forever' },
  'captain-america': { edge: '#2F5BEA', second: '#E4262C', rarity: 'ICON', note: 'Worthiness Check!' },
  thor: { edge: '#38BDF8', second: '#D9B45B', rarity: 'MYTHIC', note: 'Bring me Thanos!' },
  loki: { edge: '#3FD07A', second: '#D9B45B', rarity: 'SOVEREIGN', note: 'God of Stories' },
  thanos: { edge: '#A855F7', second: '#D9B45B', rarity: 'TITAN', note: '6 Stones Balance' },
  'doctor-strange': { edge: '#E4262C', second: '#F97316', rarity: 'MYSTIC', note: '1 in 14,000,605' },
  'spider-man': { edge: '#E4262C', second: '#2F5BEA', rarity: 'SPIDEY', note: 'No Way Home Peak' },
  'doctor-doom': { edge: '#3FD07A', second: '#D9B45B', rarity: 'OMEGA', note: 'New Mask, Same Task' },
};

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
    <div id="fanverse-characters" className="mb-12 sm:mb-16 scroll-mt-24">
      {/* Studio Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-7">
        <div>
          <span className="text-[10.5px] fan-font-mono font-bold text-[var(--marvel-red)] block mb-1">
            COLLECTOR TRADING ARCHIVE // MULTIVERSE LEGENDS
          </span>
          <h3 className="text-3xl sm:text-5xl fan-font-flex text-[var(--ink)] uppercase leading-none">
            CHARACTER FILES
          </h3>
        </div>
        <p className="text-xs sm:text-sm fan-font-body text-[#A6A298]">
          Click any profile to inspect Tanglish bio, powers &amp; Doomsday links.
        </p>
      </div>

      {/* Collector Trading Cards with Top-Bleed Portraits, Notched Frames & 3D Tilt */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3.5 gap-y-7 sm:gap-x-5 sm:gap-y-8 pt-4">
        {CHARACTER_FILES.map((char, idx) => {
          const theme = CHARACTER_RARITY_THEME[char.id] || {
            edge: '#E4262C',
            second: '#D9B45B',
            rarity: 'SPECIAL',
            note: 'Doomsday File',
          };
          const serialNum = `No. ${String(idx + 1).padStart(3, '0')} / 031`;

          return (
            <button
              key={char.id}
              type="button"
              onClick={() => {
                try { clockAudio.tick(0); } catch { }
                setSelectedChar(char);
              }}
              style={{
                borderColor: theme.edge,
                boxShadow: `4px 5px 0 #000`,
              }}
              className="fan-trading-card marvel-chamfer text-left bg-[#121319] border-2 group cursor-pointer flex flex-col focus:outline-none overflow-visible"
            >
              {/* Top Dual-Tone Rarity Strip */}
              <div
                className="h-2 w-full flex"
                aria-hidden="true"
              >
                <span className="flex-1 h-full" style={{ backgroundColor: theme.edge }} />
                <span className="w-1/3 h-full" style={{ backgroundColor: theme.second }} />
              </div>

              {/* Foil Diagonal Corner Emblem */}
              <span
                aria-hidden="true"
                className="absolute top-3 right-2.5 z-20 px-1.5 py-0.5 text-[7.5px] fan-font-mono font-bold text-[#141210] shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #F6E2A2 0%, #D9B45B 55%, #A77D26 100%)',
                }}
              >
                {theme.rarity}
              </span>

              {/* Portrait Bleeds 14px–16px Out Top of Frame */}
              <div className="relative -mt-4 mx-2.5 aspect-[4/5] bg-black border border-white/20 overflow-hidden z-10 shadow-[0_10px_22px_rgba(0,0,0,0.85)]">
                <img
                  src={char.image}
                  alt={char.name}
                  width={360}
                  height={450}
                  loading="lazy"
                  className="w-full h-full object-cover object-[50%_18%]"
                />
                {/* Moving Foil Sheen on Hover */}
                <div className="fan-foil-sheen" aria-hidden="true" />

                {/* Projector-Beam Hidden Scribble Annotation */}
                <span className="fanverse-projector-secret absolute bottom-2 left-2 right-2 fan-font-note text-base text-[var(--gold-foil)] drop-shadow">
                  * {theme.note} *
                </span>
              </div>

              {/* Character-Specific Colored Rim Divider & Foil Plate */}
              <div
                className="relative flex-1 p-3 sm:p-3.5 bg-[#121319] flex flex-col justify-between min-h-[92px] sm:min-h-[100px]"
                style={{
                  borderTop: `3px solid ${theme.edge}`,
                  borderBottom: `4px solid ${theme.second}`,
                }}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-[8px] fan-font-mono text-[#9CA3AF] font-bold">
                      {serialNum}
                    </span>
                  </div>
                  <h4
                    className="fan-stamp-name text-lg sm:text-xl fan-font-flex uppercase leading-[0.94] tracking-wide"
                    style={{ color: '#F2EFE8' }}
                  >
                    {char.name}
                  </h4>
                  <span className="text-[9.5px] fan-font-mono text-[#A6A298] block mt-0.5 truncate">
                    {char.realName}
                  </span>
                </div>

                <span
                  className="text-[9px] fan-font-mono font-bold mt-2.5 block truncate"
                  style={{ color: theme.edge }}
                >
                  {char.actor}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Studio Character Dossier Modal (Preserved Interactive Behavior) */}
      {selectedChar && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedChar.name} Profile Dossier`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/88 backdrop-blur-md"
          onClick={() => setSelectedChar(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0D0E12] border-2 border-white/20 shadow-[8px_8px_0_#000] marvel-chamfer"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="h-1.5 w-full"
              style={{
                background: `linear-gradient(90deg, ${(CHARACTER_RARITY_THEME[selectedChar.id] || {}).edge || '#E4262C'} 0%, ${(CHARACTER_RARITY_THEME[selectedChar.id] || {}).second || '#D9B45B'} 100%)`,
              }}
            />

            <button
              type="button"
              onClick={() => setSelectedChar(null)}
              aria-label="Close character file"
              className="absolute top-4 right-4 z-20 w-8 h-8 border border-white/20 hover:border-[var(--marvel-red)] bg-black/80 hover:bg-[var(--marvel-red)] text-white inline-flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 relative min-h-[260px] bg-black">
                <img
                  src={selectedChar.image}
                  alt={selectedChar.name}
                  width={420}
                  height={560}
                  className="w-full h-full object-cover object-[50%_18%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0E12] via-transparent to-black/25 md:bg-gradient-to-r md:from-transparent md:to-[#0D0E12]" />
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="text-[10px] fan-font-mono font-bold text-[var(--gold-foil)] block">
                    {selectedChar.actor}
                  </span>
                  <h4 className="text-3xl fan-font-flex text-white uppercase leading-none">
                    {selectedChar.name}
                  </h4>
                  <p className="text-[10px] fan-font-mono text-[#9CA3AF] mt-1">{selectedChar.roleLabel}</p>
                </div>
              </div>

              <div className="md:col-span-7 p-5 sm:p-6 space-y-4">
                <div>
                  <p className="text-sm sm:text-base fan-font-editorial text-[#FCA5A5] mb-1.5">
                    {selectedChar.tagline}
                  </p>
                  <p className="text-xs sm:text-sm fan-font-body text-[#D5D1C8]">
                    {selectedChar.introTanglish}
                  </p>
                </div>

                <div>
                  <h5 className="text-[10.5px] fan-font-mono font-bold text-white mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[var(--marvel-red)]" />
                    <span>POWERS &amp; ABILITIES</span>
                  </h5>
                  <ul className="space-y-1.5">
                    {selectedChar.powers.map((pow, i) => (
                      <li key={i} className="text-xs fan-font-body text-[#B8BEC8] flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-[var(--marvel-red)] mt-2 shrink-0" />
                        <span>{pow}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-[10.5px] fan-font-mono font-bold text-white mb-2 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-[var(--marvel-red)]" />
                    <span>KEY MCU APPEARANCES</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedChar.appearances.map((app, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-[#15171E] border border-white/15 text-[10px] fan-font-mono text-[#E5E7EB]"
                      >
                        {app}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="fan-paper-surface p-3.5 border border-[#151412] space-y-2.5">
                  <div className="flex items-start gap-2 text-xs fan-font-body text-[#1A1815]">
                    <Link2 className="w-4 h-4 text-[#991B1B] shrink-0 mt-0.5" />
                    <div>
                      <span className="fan-font-mono font-bold text-[9.5px] text-[#991B1B] block">
                        STORY CONNECTION
                      </span>
                      {selectedChar.connections}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#151412]/20 flex items-start gap-2 text-xs fan-font-body text-[#1A1815]">
                    <Sparkles className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                    <div>
                      <span className="fan-font-mono font-bold text-[9.5px] text-[#78350F] block">
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
