import React, { useEffect } from 'react';

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="character-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#1E2024] bg-[#0E0F13] text-[#F5F5F5] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-[#777A80] hover:text-white p-2 transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6 pb-6 border-b border-[#1E2024]">
          <div className="w-28 sm:w-36 aspect-[2/3] shrink-0 overflow-hidden border border-[#1E2024] bg-black">
            <img
              src={character.poster}
              alt={character.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#E62429] uppercase font-bold mb-1">
              {character.roleTag}
            </span>
            <h2 id="character-title" className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase">
              {character.name}
            </h2>
            <p className="text-sm font-mono text-[#D8D9DC] mb-1">
              {character.alias} • <span className="text-white font-semibold">{character.actor}</span>
            </p>
            <p className="text-xs text-[#777A80] mb-3">
              {character.associatedMovie}
            </p>
            <div className="inline-block">
              <span className="text-[9px] font-mono tracking-wider px-2.5 py-1 border border-[#22C55E]/40 text-[#22C55E] bg-[#22C55E]/10 uppercase font-semibold">
                {character.status}
              </span>
            </div>
          </div>
        </div>

        {/* Dossier Content */}
        <div className="space-y-5 text-xs text-[#C4C7CE] leading-relaxed">
          <div>
            <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#777A80] uppercase mb-1.5 font-bold">
              THEATRICAL SUMMARY
            </h3>
            <p className="text-sm text-white font-medium">
              {character.summary}
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#777A80] uppercase mb-1.5 font-bold">
              INTELLIGENCE DOSSIER
            </h3>
            <p className="text-xs text-[#A0A4AB]">
              {character.biography}
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-mono tracking-[0.2em] text-[#777A80] uppercase mb-2 font-bold">
              OBSERVED CAPABILITIES & THREAT PROFILE
            </h3>
            <ul className="space-y-1.5 pl-3 border-l border-[#2A2D33]">
              {character.capabilities.map((cap, i) => (
                <li key={i} className="text-[#D8D9DC] flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#E62429] rounded-full shrink-0" />
                  {cap}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-3 border-t border-[#1E2024] flex items-center justify-between text-[9px] font-mono text-[#55585E]">
            <span>VERIFIED SOURCE: {character.confirmedSources}</span>
            <span className="text-[#E62429]">CLASSIFIED ARCHIVE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
