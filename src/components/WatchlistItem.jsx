import React, { useState } from 'react';
import { Check, Film, Tv, Eye } from 'lucide-react';
import { clockAudio } from '../utils/audio.js';

/**
 * Editorial Chapter Poster Card
 * High-definition poster presentation with zero-crop fidelity and hover elevation
 */
function ChapterPoster({
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
      aria-label={`View intelligence dossier for Chapter ${number}: ${title}`}
      className={`relative w-full aspect-[2/3] bg-[#0A0C10] border overflow-hidden group/img cursor-pointer transition-all duration-300 rounded-xs select-none ${isWatched
          ? 'border-[#22C55E]/60 shadow-[0_0_15px_rgba(34,197,94,0.15)]'
          : isNextWatch
            ? 'border-[#E62429] ring-2 ring-[#E62429]/40 shadow-[0_0_25px_rgba(230,36,41,0.35)]'
            : 'border-[#1E252D] hover:border-[#383C46] hover:shadow-[0_12px_28px_rgba(0,0,0,0.85)]'
        }`}
    >
      {!hasError ? (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#0F1116] flex items-center justify-center">
              <span className="text-xs font-mono text-[#555862]">{number}</span>
            </div>
          )}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-all duration-500 ease-out group-hover/img:scale-106 ${isWatched
                ? 'brightness-80 saturate-75 filter'
                : isNextWatch
                  ? 'brightness-100 group-hover/img:brightness-110'
                  : 'brightness-90 group-hover/img:brightness-105'
              } ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Chapter number badge */}
          <div className="absolute top-1.5 left-1.5 bg-black/90 px-2 py-0.5 border border-white/20 shadow-md rounded-xs">
            <span className="text-[10px] font-mono font-bold text-white tracking-wider">
              CH. {number}
            </span>
          </div>

          {/* Active Chapter / Next Mission Badge */}
          {isNextWatch && !isWatched && (
            <div className="absolute bottom-1.5 left-1.5 bg-[#E62429] text-white px-2 py-0.5 text-[8.5px] font-mono font-bold tracking-wider uppercase shadow-lg flex items-center gap-1 rounded-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>NEXT MISSION</span>
            </div>
          )}

          {/* Season label badge if present */}
          {label && (
            <div className="absolute top-1.5 right-1.5 bg-black/90 px-1.5 py-0.5 text-[9px] font-mono text-[#D8D9DC] border border-[#2A2E38] rounded-xs">
              {label}
            </div>
          )}

          {/* Watched Verified Badge */}
          {isWatched && (
            <div className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-[#22C55E] text-black font-bold text-[8.5px] font-mono tracking-wider flex items-center gap-1 shadow-md uppercase rounded-xs">
              <Check className="w-3 h-3 stroke-[3]" />
              <span>WATCHED</span>
            </div>
          )}

          {/* Hover Overlay Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 pointer-events-none flex items-end p-2">
            <span className="text-[9px] font-mono text-white/90 uppercase tracking-widest inline-flex items-center gap-1">
              <Eye className="w-3 h-3 text-[#22C55E]" />
              <span>VIEW DOSSIER</span>
            </span>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col justify-between p-3 bg-[#0F1116] border border-[#1E252D]">
          <span className="text-xs font-mono text-[#777A80]">{number}</span>
          <p className="text-xs font-cinematic font-bold text-white leading-tight">
            {title}
          </p>
          <span className="text-[10px] font-mono text-[#777A80]">{year}</span>
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
  onCardClick,
  progress,
}) {
  const isLoki = item.isMultiSeason;
  const handleOpen = onOpenDetails || onCardClick;

  // Compute status from progress if passed
  const resolvedCompleted =
    isCompleted !== undefined
      ? isCompleted
      : isLoki
        ? !!(progress?.['loki-series']?.season1 && progress?.['loki-series']?.season2)
        : !!progress?.[item.id]?.completed;

  const resolvedLokiSeasons =
    lokiSeasons ||
    (isLoki
      ? {
        s1: !!progress?.['loki-series']?.season1,
        s2: !!progress?.['loki-series']?.season2,
      }
      : null);

  const handleStandardClick = (e) => {
    e.stopPropagation();
    try { clockAudio.tick(0); } catch (err) { }
    onToggleStandard(item.id);
  };

  const handleLokiClick = (seasonId, e) => {
    e.stopPropagation();
    try { clockAudio.tick(0); } catch (err) { }
    onToggleLokiSeason(seasonId);
  };

  return (
    <article
      className={`flex flex-col group relative bg-[#0D0F14] border p-3 sm:p-3.5 transition-all duration-300 rounded-xs shadow-lg ${resolvedCompleted
          ? 'border-[#22C55E]/40 bg-[#09110D]/60'
          : isNextWatch
            ? 'border-[#E62429] bg-[#140D0F] shadow-[0_0_20px_rgba(230,36,41,0.2)]'
            : 'border-[#1E252D] hover:border-[#383C46] hover:bg-[#11131A]'
        }`}
      aria-label={`Chapter ${item.number}. ${item.title}`}
    >
      {/* ── Poster Area ── */}
      {isLoki ? (
        <div className="flex gap-2 w-full">
          <div className="flex-1">
            <ChapterPoster
              src={item.posterSeason1}
              alt="Loki Season 1"
              number="07"
              title="Loki S1"
              year="2021"
              isWatched={!!resolvedLokiSeasons?.s1}
              label="S1"
              isNextWatch={isNextWatch && !resolvedLokiSeasons?.s1}
              onClick={() => handleOpen(item)}
            />
          </div>
          <div className="flex-1">
            <ChapterPoster
              src={item.posterSeason2}
              alt="Loki Season 2"
              number="07"
              title="Loki S2"
              year="2023"
              isWatched={!!resolvedLokiSeasons?.s2}
              label="S2"
              isNextWatch={isNextWatch && !!resolvedLokiSeasons?.s1 && !resolvedLokiSeasons?.s2}
              onClick={() => handleOpen(item)}
            />
          </div>
        </div>
      ) : (
        <ChapterPoster
          src={item.poster}
          alt={`Official poster for ${item.title}`}
          number={item.number}
          title={item.title}
          year={item.year}
          isWatched={resolvedCompleted}
          isNextWatch={isNextWatch}
          onClick={() => handleOpen(item)}
        />
      )}

      {/* ── Info Row Below Poster ── */}
      <div className="flex flex-col justify-between flex-1 mt-3">
        {/* Title & Metadata */}
        <div
          className="cursor-pointer"
          onClick={() => handleOpen(item)}
        >
          <div className="flex items-center gap-1.5 mb-1 text-[9.5px] font-mono text-[#777A80]">
            <span className={resolvedCompleted ? 'text-[#22C55E]' : isNextWatch ? 'text-[#E62429]' : 'text-[#8C9098]'}>
              CH. {item.number}
            </span>
            <span className="text-[#3A3D44]">•</span>
            <span>{isLoki ? '2021 – 2023' : item.year}</span>
            <span className="text-[#3A3D44]">•</span>
            <div className="flex items-center gap-1">
              {item.type === 'Series' ? (
                <Tv className="w-2.5 h-2.5 text-[#777A80] shrink-0" />
              ) : (
                <Film className="w-2.5 h-2.5 text-[#777A80] shrink-0" />
              )}
              <span className="uppercase font-medium text-[9px]">{item.type}</span>
            </div>
          </div>

          <p
            className={`text-xs sm:text-sm font-cinematic font-bold leading-snug line-clamp-2 min-h-[2.4rem] transition-colors ${resolvedCompleted
                ? 'text-[#9CA3AF]'
                : isNextWatch
                  ? 'text-white'
                  : 'text-[#F5F5F5] group-hover:text-white'
              }`}
          >
            {isLoki ? 'Loki — Season 1 & 2' : item.title}
          </p>
        </div>

        {/* ── Completion Checkbox & Touch Target Row (Min 44x44px Touch Target) ── */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#1E252D]">
          <span
            className={`text-[9px] font-mono tracking-wider uppercase font-bold ${resolvedCompleted
                ? 'text-[#22C55E]'
                : isNextWatch
                  ? 'text-[#E62429]'
                  : 'text-[#6B7280]'
              }`}
          >
            {resolvedCompleted
              ? '✓ VERIFIED'
              : isNextWatch
                ? '● ACTIVE'
                : 'UPCOMING'}
          </span>

          {/* Minimum 44x44px accessible touch-target controls */}
          {isLoki ? (
            <div
              className="flex items-center gap-1.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* S1 Checkbox (44x44px hit area) */}
              <button
                type="button"
                onClick={(e) => handleLokiClick('s1', e)}
                aria-pressed={!!resolvedLokiSeasons?.s1}
                aria-label="Toggle Loki Season 1 completion status"
                className={`min-w-[44px] min-h-[44px] h-11 px-2.5 border flex items-center justify-center gap-1 transition-all duration-200 text-xs font-mono font-bold cursor-pointer rounded-xs ${resolvedLokiSeasons?.s1
                    ? 'border-[#22C55E] bg-[#22C55E] text-black shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                    : 'border-[#232731] bg-[#12141A] text-[#8C9098] hover:border-[#22C55E] hover:text-white'
                  }`}
              >
                {resolvedLokiSeasons?.s1 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>S1</span>
              </button>

              {/* S2 Checkbox (44x44px hit area) */}
              <button
                type="button"
                onClick={(e) => handleLokiClick('s2', e)}
                aria-pressed={!!resolvedLokiSeasons?.s2}
                aria-label="Toggle Loki Season 2 completion status"
                className={`min-w-[44px] min-h-[44px] h-11 px-2.5 border flex items-center justify-center gap-1 transition-all duration-200 text-xs font-mono font-bold cursor-pointer rounded-xs ${resolvedLokiSeasons?.s2
                    ? 'border-[#22C55E] bg-[#22C55E] text-black shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                    : 'border-[#232731] bg-[#12141A] text-[#8C9098] hover:border-[#22C55E] hover:text-white'
                  }`}
              >
                {resolvedLokiSeasons?.s2 && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                <span>S2</span>
              </button>
            </div>
          ) : (
            /* Standard Chapter Checkbox (Min 44x44px hit area) */
            <button
              type="button"
              onClick={handleStandardClick}
              aria-pressed={resolvedCompleted}
              aria-label={`Mark Chapter ${item.number}: ${item.title} as ${resolvedCompleted ? 'unwatched' : 'completed'
                }`}
              className={`min-w-[44px] min-h-[44px] w-11 h-11 border flex items-center justify-center transition-all duration-200 cursor-pointer rounded-xs ${resolvedCompleted
                  ? 'border-[#22C55E] bg-[#22C55E] text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                  : isNextWatch
                    ? 'border-[#E62429] bg-[#1C1215] text-[#E62429] hover:bg-[#E62429] hover:text-white ring-1 ring-[#E62429]/50'
                    : 'border-[#232731] bg-[#12141A] text-transparent hover:border-[#22C55E] hover:bg-[#1A1C24]'
                }`}
            >
              {resolvedCompleted ? (
                <Check className="w-5 h-5 stroke-[3]" />
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-[#383C46] group-hover:bg-[#22C55E] transition-colors" />
              )}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
