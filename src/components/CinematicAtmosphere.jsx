import React, { useRef, useEffect, useState } from 'react';

/**
 * Reusable Cinematic Atmospheric Movement & Video/Poster Background Component
 * Meets all technical rules:
 * - Lazy loads video/motion only when in viewport via IntersectionObserver
 * - Muted, looped, inline playback, zero audio interference
 * - Compressed poster image fallbacks
 * - Deep cinematic vignette overlay ensuring WCAG AAA typography contrast
 * - Respects prefers-reduced-motion
 */
export default function CinematicAtmosphere({
  poster = "/doomsday-ensemble-poster.jpg",
  videoSrc = null,
  overlayOpacity = "bg-[#08090B]/88",
  accentGlow = "emerald", // 'emerald' | 'crimson' | 'neutral'
  className = ""
}) {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { rootMargin: '200px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* ── 1. Poster Image Fallback (High Quality Cinematic Still) ── */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        className={`w-full h-full object-cover object-center filter brightness-45 contrast-110 transition-transform duration-1000 ${
          inView && !prefersReducedMotion ? 'scale-104' : 'scale-100'
        }`}
      />

      {/* ── 2. Cinematic Video Layer (Lazy Loaded In Viewport) ── */}
      {videoSrc && inView && !prefersReducedMotion && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover filter brightness-50 contrast-115 transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* ── 3. Subtle Incursion Atmospheric Vignette & Color Grading ── */}
      <div
        className={`absolute inset-0 ${overlayOpacity} backdrop-blur-[1px]`}
      />

      {/* ── 4. Edge Fade to Seamlessly Merge with Site Background (#08090B) ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090B] via-transparent to-[#08090B]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090B] via-transparent to-[#08090B] opacity-80" />

      {/* ── 5. Natural Atmospheric Accent Hue ── */}
      {accentGlow === 'emerald' && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[#10B981]/8 blur-3xl rounded-full" />
      )}
      {accentGlow === 'crimson' && (
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[#E62429]/6 blur-3xl rounded-full" />
      )}
    </div>
  );
}
