import React, { useEffect } from 'react';
import { ShieldCheck, Film, Users, Sparkles, X } from 'lucide-react';

export default function CharacterModal({ character, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!character) return null;

  const fileIndex = character.castNumber
    ? String(character.castNumber).padStart(2, '0')
    : '00';
  const civilName = character.characterName || character.alias;
  const displayIdentity = character.identity || character.name;
  const distinctCivilName =
    civilName && civilName.toLowerCase() !== displayIdentity.toLowerCase()
      ? civilName
      : null;

  const powers = character.capabilities || [];
  const priorCredits = character.previousAppearances || [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[#232A35] bg-[#0B0D12] text-[#F5F5F5] shadow-[0_25px_80px_rgba(0,0,0,0.95)] rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Classified Intelligence Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3 border-b border-[#1E242E] bg-[#0F1218]">
          <div className="flex items-center gap-2.5 text-[9.5px] font-mono tracking-[0.22em] text-[#9CA3AF] uppercase">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E]" />
            <span>DOSSIER #{fileIndex} // AVENGERS: DOOMSDAY CAST FILE</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-[#8C9098] hover:text-white p-1.5 border border-transparent hover:border-[#2A313D] rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-8">
          {/* Header Block */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-[#1E242E]">
            <div className="w-32 sm:w-44 aspect-[2/3] shrink-0 overflow-hidden border border-[#2A313D] bg-black rounded-xs shadow-xl self-center sm:self-start relative">
              <img
                src={character.poster}
                alt={`${displayIdentity} portrayed by ${character.actor}`}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#E62429] via-[#22C55E] to-[#E62429]" />
            </div>

            <div className="flex flex-col justify-center flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[9.5px] font-mono tracking-[0.18em] px-2 py-0.5 border border-[#E62429]/40 text-[#E62429] bg-[#E62429]/10 uppercase font-bold rounded-xs">
                  {character.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[9.5px] font-mono tracking-wider px-2.5 py-0.5 border border-[#22C55E]/40 text-[#22C55E] bg-[#22C55E]/10 uppercase font-semibold rounded-xs">
                  <ShieldCheck className="w-3 h-3 shrink-0" />
                  {character.status || 'CONFIRMED CAST'}
                </span>
              </div>

              <h2
                id="character-title"
                className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase tracking-tight leading-tight mb-1"
              >
                {displayIdentity}
              </h2>

              {distinctCivilName && (
                <p className="text-xs sm:text-sm font-mono tracking-wider text-[#D1D5DB] uppercase mb-2">
                  IDENTITY: <span className="text-white font-semibold">{distinctCivilName}</span>
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2 p-3 border border-[#1E242E] bg-[#101319] rounded-xs text-xs">
                <div>
                  <span className="block text-[9px] font-mono tracking-[0.18em] text-[#777A80] uppercase">
                    PORTRAYED BY
                  </span>
                  <span className="text-sm font-semibold text-white">
                    {character.actor}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] font-mono tracking-[0.18em] text-[#777A80] uppercase">
                    TEAM / AFFILIATION
                  </span>
                  <span className="text-xs font-mono text-[#D1D5DB] inline-flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#22C55E] shrink-0" />
                    {character.affiliation}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Dossier Body Sections */}
          <div className="space-y-5 text-xs text-[#C4C7CE] leading-relaxed">
            <div>
              <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#777A80] uppercase mb-1.5 font-bold">
                ARCHIVE OVERVIEW
              </h3>
              <p className="text-sm text-white font-medium leading-relaxed">
                {character.summary}
              </p>
            </div>

            <div>
              <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#777A80] uppercase mb-1.5 font-bold">
                CHARACTER BIOGRAPHY
              </h3>
              <p className="text-xs sm:text-[13px] text-[#B3B7C0] leading-relaxed">
                {character.biography}
              </p>
            </div>

            {powers.length > 0 && (
              <div>
                <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#777A80] uppercase mb-2 font-bold inline-flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#E62429]" />
                  <span>KNOWN POWERS &amp; ABILITIES</span>
                </h3>
                <ul className="space-y-1.5 pl-3 border-l border-[#2A2D33]">
                  {powers.map((cap, i) => (
                    <li key={i} className="text-[#E5E7EB] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#E62429] rounded-full shrink-0 mt-1.5" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {priorCredits.length > 0 && (
              <div>
                <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#777A80] uppercase mb-2 font-bold inline-flex items-center gap-1.5">
                  <Film className="w-3 h-3 text-[#22C55E]" />
                  <span>PREVIOUS MCU / LIVE-ACTION APPEARANCES</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {priorCredits.map((credit, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#11141C] border border-[#232A35] text-[10px] font-mono text-[#D8D9DC] rounded-xs"
                    >
                      {credit}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#1E242E] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[9.5px] font-mono text-[#8C9098]">
              <div className="space-y-0.5">
                <div className="text-[#22C55E] font-semibold">
                  CAST CONFIRMATION: {character.castConfirmation || character.confirmedSources}
                </div>
                <div className="text-[#6B7280]">
                  SOURCE: {character.confirmedSources} • {character.associatedMovie}
                </div>
              </div>
              <span className="text-[#E62429] font-bold tracking-widest uppercase shrink-0">
                OFFICIAL DOSSIER
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
