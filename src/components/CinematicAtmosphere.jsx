import React, { useRef, useEffect, useState } from 'react';

/**
 * Editorial Cinema Atmospheric Video & Key-Art Backdrop Component
 * - Lazy loads video/motion when in viewport via IntersectionObserver
 * - Muted, looped, inline playback, zero audio interference
 * - Deep matte vignette grading for crisp editorial typography contrast
 * - Respects prefers-reduced-motion
 */
export default function CinematicAtmosphere({
  poster = "/doomsday-ensemble-poster.jpg",
  videoSrc = null,
  videoWebm = null,
  overlayOpacity = "bg-[#08090B]/90",
  accentGlow = "neutral",
  showParticles = false,
  className = ""
}) {
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: '200px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const hasVideo = (videoSrc || videoWebm) && !videoError;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* 1. Poster Still Fallback */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-115 grayscale-[15%]"
      />

      {/* 2. Full-Width Cinema Video Layer */}
      {hasVideo && inView && !prefersReducedMotion && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover filter brightness-[0.42] contrast-125 transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
        </video>
      )}

      {/* 3. Deep Matte Vignette & Color Grading */}
      <div className={`absolute inset-0 ${overlayOpacity}`} />

      {/* 4. Seamless Obsidian Edge Integration */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090B] via-transparent to-[#08090B]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090B] via-transparent to-[#08090B] opacity-85" />
    </div>
  );
}
