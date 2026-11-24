import React, { useState } from 'react';
import { RotateCcw, Share2, Check, Download } from 'lucide-react';

/**
 * Enhanced Watch Progress with:
 * - Feature Two: Completed count, percentage, remaining chapters
 * - Feature Six: Share My Progress (Web Share API + Clipboard fallback + Canvas graphic download)
 */
export default function ProgressBar({ watchedCount, totalCount, onResetClick }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const percentage = totalCount > 0 ? Math.round((watchedCount / totalCount) * 100) : 0;
  const remainingCount = Math.max(0, totalCount - watchedCount);

  // Generate clean shareable text
  const shareText = `AVENGERS: DOOMSDAY COUNTDOWN\n\nMy Road to Doomsday:\n${watchedCount} / ${totalCount} Chapters Completed.\n\n${percentage}% Ready.\n\nTHE COUNTDOWN HAS BEGUN.`;

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'AVENGERS: DOOMSDAY — THE COUNTDOWN',
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch (err) {
        if (err.name === 'AbortError') return;
      }
    }

    // Clipboard fallback
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    }
  };

  // Downloadable progress graphic using native HTML5 Canvas
  const handleDownloadGraphic = () => {
    try {
      setDownloading(true);
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Dark cinematic background
      ctx.fillStyle = '#08090B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle atmospheric vignette
      const radial = ctx.createRadialGradient(600, 200, 50, 600, 200, 500);
      radial.addColorStop(0, 'rgba(230, 36, 41, 0.08)');
      radial.addColorStop(1, 'rgba(8, 9, 11, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Outer border
      ctx.strokeStyle = '#1E2024';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // Top label
      ctx.fillStyle = '#777A80';
      ctx.font = '600 15px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MARVEL CINEMATIC UNIVERSE', 600, 110);

      // Main Title
      ctx.fillStyle = '#F5F5F5';
      ctx.font = '900 62px "Cinzel", Georgia, serif';
      ctx.fillText('AVENGERS: DOOMSDAY', 600, 190);

      // Subtitle
      ctx.fillStyle = '#777A80';
      ctx.font = '500 16px monospace';
      ctx.fillText('ROAD TO DOOMSDAY // PROGRESS REPORT', 600, 235);

      // Stat Callout
      ctx.fillStyle = '#F5F5F5';
      ctx.font = '700 48px monospace';
      ctx.fillText(`${watchedCount} / ${totalCount} COMPLETED`, 600, 330);

      ctx.fillStyle = '#E62429';
      ctx.font = '600 22px monospace';
      ctx.fillText(`${percentage}% READY  •  ${remainingCount} CHAPTERS REMAINING`, 600, 375);

      // Progress bar track
      const barX = 200;
      const barY = 425;
      const barW = 800;
      const barH = 8;
      ctx.fillStyle = '#1E2024';
      ctx.fillRect(barX, barY, barW, barH);

      // Progress bar fill
      ctx.fillStyle = '#E62429';
      ctx.fillRect(barX, barY, (barW * percentage) / 100, barH);

      // Bottom footer quote
      ctx.fillStyle = '#777A80';
      ctx.font = '500 15px monospace';
      ctx.fillText('THE COUNTDOWN BEGINS. // 18 DECEMBER 2026', 600, 520);

      // Convert to image and trigger download
      const link = document.createElement('a');
      link.download = `doomsday-progress-${watchedCount}-of-${totalCount}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="mb-10 sm:mb-12">
      {/* Metrics Row */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-4 mb-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] text-[#777A80] uppercase">
            Watched:
          </span>
          <span className="text-base sm:text-lg font-mono font-bold text-[#F5F5F5] tabular-nums">
            {watchedCount}
          </span>
          <span className="text-[#3A3D44] font-mono text-sm">/</span>
          <span className="text-base sm:text-lg font-mono text-[#777A80] tabular-nums">
            {totalCount}
          </span>
        </div>

        {/* Action controls (Share Progress + Reset) */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Share button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share your watch progress"
            className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.14em] text-[#777A80] hover:text-[#F5F5F5] transition-colors duration-150 uppercase py-1 px-2 border border-[#1E2024] hover:border-[#2D3036] bg-[#111216]"
          >
            {copied ? (
              <>
                <Check className="w-2.5 h-2.5 text-[#E62429]" />
                <span className="text-[#E62429]">COPIED</span>
              </>
            ) : (
              <>
                <Share2 className="w-2.5 h-2.5 text-[#777A80]" />
                <span>SHARE PROGRESS</span>
              </>
            )}
          </button>

          {/* Download Graphic Button */}
          <button
            type="button"
            onClick={handleDownloadGraphic}
            disabled={downloading}
            aria-label="Download progress graphic"
            title="Download shareable progress image"
            className="inline-flex items-center gap-1 text-[10px] font-mono tracking-[0.14em] text-[#55585E] hover:text-[#777A80] transition-colors duration-150 uppercase py-1 px-2 border border-[#1E2024] hover:border-[#2D3036] bg-[#111216]"
          >
            <Download className="w-2.5 h-2.5" />
            <span className="hidden sm:inline">GRAPHIC</span>
          </button>

          {/* Reset Action */}
          {watchedCount > 0 && (
            <button
              type="button"
              onClick={onResetClick}
              aria-label="Reset watched progress"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.14em] text-[#55585E] hover:text-[#E62429] transition-colors duration-150 uppercase py-1 px-2 focus:outline-none"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </div>

      {/* Feature 2: Enhanced Progress Details Sub-row */}
      <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.12em] text-[#777A80] mb-3">
        <span className="text-[#F5F5F5] font-semibold">{watchedCount} / {totalCount} COMPLETED</span>
        <span className="text-[#3A3D44]">•</span>
        <span className="text-[#E62429] font-semibold">{percentage}% COMPLETE</span>
        <span className="text-[#3A3D44]">•</span>
        <span>{remainingCount} {remainingCount === 1 ? 'CHAPTER' : 'CHAPTERS'} REMAINING</span>
      </div>

      {/* Thin progress track */}
      <div
        className="w-full h-1 bg-[#1E2024] overflow-hidden"
        role="progressbar"
        aria-valuenow={watchedCount}
        aria-valuemin={0}
        aria-valuemax={totalCount}
        aria-label="Watchlist progress"
      >
        <div
          className="h-full bg-[#E62429] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
