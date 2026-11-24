import React, { useState } from 'react';
import { Check, Film, Tv } from 'lucide-react';

/**
 * Compact portrait poster card with click to open details modal
 */
function PosterCard({
  src,
  alt,
  number,
  title,
  year,
  isWatched,
  label,
  isNextWatch,
  onClick,
}) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`View details for ${title}`}
      className={`relative w-full aspect-[2/3] bg-[#0c0d10] border overflow-hidden group/img cursor-pointer transition-colors duration-200 ${
        isNextWatch
          ? 'border-[#E62429] ring-1 ring-[#E62429]/40'
          : 'border-[#1E2024] hover:border-[#2D3036]'
      }`}
    >
      {!hasError ? (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#111216] flex items-center justify-center">
              <span className="text-[10px] font-mono text-[#777A80]">{number}</span>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-all duration-300 ease-out
              group-hover/img:scale-[1.03]
              ${isWatched ? 'brightness-70 saturate-60' : 'brightness-95 group-hover/img:brightness-100'}
              ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Chapter number badge — top left */}
          <div className="absolute top-1.5 left-1.5 bg-[#08090B]/90 backdrop-blur-sm px-1.5 py-0.5 border-l-2 border-[#D8D9DC]">
            <span className="text-[10px] font-mono font-bold text-[#D8D9DC]">{number}</span>
          </div>

          {/* Next Watch badge */}
          {isNextWatch && !isWatched && (
            <div className="absolute bottom-1.5 left-1.5 bg-[#E62429] text-white px-1.5 py-0.5 text-[8px] font-mono font-bold tracking-wider uppercase">
              NEXT
            </div>
          )}

          {/* Season label badge if present */}
          {label && (
            <div className="absolute top-1.5 right-1.5 bg-[#08090B]/90 px-1.5 py-0.5 text-[9px] font-mono text-[#D8D9DC] border border-[#1E2024]">
              {label}
            </div>
          )}

          {/* Watched check badge */}
          {isWatched && (
            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#E62429] text-white flex items-center justify-center shadow-sm">
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </div>
          )}

          {/* Natural hover vignette */}
          <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors duration-200 pointer-events-none" />
        </>
      ) : (
        /* Minimalist fallback */
        <div className="w-full h-full flex flex-col justify-between p-2.5 bg-[#111216] border border-[#1E2024]">
          <span className="text-[10px] font-mono text-[#777A80]">{number}</span>
          <p className="text-[10px] sm:text-[11px] font-cinematic font-bold text-[#F5F5F5] leading-tight">
            {title}
          </p>
          <span className="text-[9px] font-mono text-[#777A80]">{year}</span>
        </div>
      )}
    </div>
  );
}

export default function WatchlistItem({
  item,
  isCompleted,
  lokiSeasons,
  isNextWatch,
  onToggleStandard,
  onToggleLokiSeason,
  onOpenDetails,
}) {
  const isLoki = item.isMultiSeason;

  return (
    <article
      className="flex flex-col group relative bg-[#111216] border border-[#1E2024] hover:border-[#2D3036] p-2.5 sm:p-3 transition-colors duration-200"
      aria-label={`${item.number}. ${item.title}`}
    >
      {/* ── Poster Area ── */}
      {isLoki ? (
        /* Loki: two side-by-side posters within one grid entry */
        <div className="flex gap-1.5 w-full">
          <div className="flex-1">
            <PosterCard
              src={item.posterSeason1}
              alt="Loki Season 1"
              number="07"
              title="Loki S1"
              year="2021"
              isWatched={!!lokiSeasons?.s1}
              label="S1"
              isNextWatch={isNextWatch && !lokiSeasons?.s1}
              onClick={() => onOpenDetails(item)}
            />
          </div>
          <div className="flex-1">
            <PosterCard
              src={item.posterSeason2}
              alt="Loki Season 2"
              number="07"
              title="Loki S2"
              year="2023"
              isWatched={!!lokiSeasons?.s2}
              label="S2"
              isNextWatch={isNextWatch && !!lokiSeasons?.s1 && !lokiSeasons?.s2}
              onClick={() => onOpenDetails(item)}
            />
          </div>
        </div>
      ) : (
        <PosterCard
          src={item.poster}
          alt={`Official poster for ${item.title}`}
          number={item.number}
          title={item.title}
          year={item.year}
          isWatched={isCompleted}
          isNextWatch={isNextWatch}
          onClick={() => onOpenDetails(item)}
        />
      )}

      {/* ── Info Row Below Poster ── */}
      <div className="flex flex-col justify-between flex-1 mt-3">
        {/* Title & Metadata */}
        <div
          className="cursor-pointer"
          onClick={() => onOpenDetails(item)}
        >
          {/* Title — high legibility, 2 lines max, no truncation */}
          <p
            className={`text-xs sm:text-sm font-cinematic font-bold leading-snug line-clamp-2 min-h-[2.4rem] transition-colors ${
              isCompleted ? 'text-[#777A80]' : 'text-[#F5F5F5] group-hover:text-white'
            }`}
          >
            {isLoki ? 'Loki — Season 1 & 2' : item.title}
          </p>

          {/* Year & Format Type */}
          <div className="flex items-center gap-1.5 mt-1 text-[10px] sm:text-[11px] font-mono text-[#777A80]">
            <span>{isLoki ? '2021 – 2023' : item.year}</span>
            <span className="text-[#3A3D44]">•</span>
            <div className="flex items-center gap-1">
              {item.type === 'Series' ? (
                <Tv className="w-2.5 h-2.5 text-[#777A80] shrink-0" />
              ) : (
                <Film className="w-2.5 h-2.5 text-[#777A80] shrink-0" />
              )}
              <span className="uppercase font-medium">{item.type}</span>
            </div>
          </div>
        </div>

        {/* ── Completion Checkbox & Status Row ── */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1E2024]">
          <span className="text-[9px] font-mono tracking-wider text-[#777A80] uppercase">
            {isCompleted ? 'WATCHED' : 'CHAPTER ' + item.number}
          </span>

          {/* Checkboxes / Controls */}
          {isLoki ? (
            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLokiSeason('s1');
                }}
                aria-pressed={!!lokiSeasons?.s1}
                aria-label="Toggle Loki Season 1"
                className={`px-2 py-0.5 border flex items-center gap-1 transition-colors text-[9px] font-mono ${
                  lokiSeasons?.s1
                    ? 'border-[#E62429] bg-[#E62429] text-white font-bold'
                    : 'border-[#1E2024] bg-[#08090B] text-[#777A80] hover:border-[#2D3036]'
                }`}
              >
                {lokiSeasons?.s1 && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                <span>S1</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLokiSeason('s2');
                }}
                aria-pressed={!!lokiSeasons?.s2}
                aria-label="Toggle Loki Season 2"
                className={`px-2 py-0.5 border flex items-center gap-1 transition-colors text-[9px] font-mono ${
                  lokiSeasons?.s2
                    ? 'border-[#E62429] bg-[#E62429] text-white font-bold'
                    : 'border-[#1E2024] bg-[#08090B] text-[#777A80] hover:border-[#2D3036]'
                }`}
              >
                {lokiSeasons?.s2 && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                <span>S2</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStandard(item.id);
              }}
              aria-pressed={isCompleted}
              aria-label={`Mark ${item.title} as ${isCompleted ? 'unwatched' : 'watched'}`}
              className={`shrink-0 w-5 h-5 border flex items-center justify-center transition-colors duration-150 ${
                isCompleted
                  ? 'border-[#E62429] bg-[#E62429] text-white'
                  : 'border-[#1E2024] bg-[#08090B] hover:border-[#2D3036]'
              }`}
            >
              {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
