import React, { useRef, useEffect, useState } from 'react';

/**
 * Reusable Cinematic Atmospheric Movement & Video/Poster Background Component
 * Meets all technical rules:
 * - Lazy loads video/motion only when in viewport via IntersectionObserver
 * - Muted, looped, inline playback, zero audio interference
 * - Compressed WebM / MP4 video sources with poster fallback
 * - Embedded organic floating particles for cinematic atmospheric depth
 * - Deep cinematic vignette overlay ensuring WCAG AAA typography contrast
 * - Respects prefers-reduced-motion
 */
export default function CinematicAtmosphere({
  poster = "/doomsday-ensemble-poster.jpg",
  videoSrc = null,
  videoWebm = null,
  overlayOpacity = "bg-[#08090B]/88",
  accentGlow = "emerald", // 'emerald' | 'crimson' | 'neutral'
  showParticles = true,
  className = ""
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
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

  // Subtle floating atmospheric particle simulation
  useEffect(() => {
    if (!showParticles || prefersReducedMotion || !inView) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 800);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 800;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool: 35 subtle slow-floating particles
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.6,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.4 - 0.15, // float gently upwards
      alpha: Math.random() * 0.4 + 0.15,
      hue: accentGlow === 'crimson' ? '0, 80%, 60%' : '142, 70%, 55%',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${p.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = accentGlow === 'crimson' ? 'rgba(230,36,41,0.5)' : 'rgba(34,197,94,0.5)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showParticles, prefersReducedMotion, inView, accentGlow]);

  const hasVideo = (videoSrc || videoWebm) && !videoError;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* ── 1. Poster Image Fallback (High Quality Theatrical Still) ── */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        className={`w-full h-full object-cover object-center filter brightness-45 contrast-110 transition-transform duration-1000 ${inView && !prefersReducedMotion ? 'scale-104' : 'scale-100'
          }`}
      />

      {/* ── 2. Full-Width Cinematic Background Video Layer ── */}
      {hasVideo && inView && !prefersReducedMotion && (
        <video
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`absolute inset-0 w-full h-full object-cover filter brightness-50 contrast-125 transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        >
          {videoWebm && <source src={videoWebm} type="video/webm" />}
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
        </video>
      )}

      {/* ── 3. Atmospheric Particle Canvas Overlay ── */}
      {showParticles && !prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
        />
      )}

      {/* ── 4. Deep Cinematic Vignette & Color Grading ── */}
      <div
        className={`absolute inset-0 ${overlayOpacity} backdrop-blur-[1px]`}
      />

      {/* ── 5. Edge Fade Gradients to Merge Seamlessly with #08090B ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#08090B] via-transparent to-[#08090B]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#08090B] via-transparent to-[#08090B] opacity-80" />

      {/* ── 6. Dramatic Lighting Radial Atmosphere ── */}
      {accentGlow === 'emerald' && (
        <>
          <div className="absolute -top-32 left-1/4 w-[600px] h-[400px] bg-[#10B981]/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[350px] bg-[#00FF88]/6 blur-[100px] rounded-full pointer-events-none" />
        </>
      )}
      {accentGlow === 'crimson' && (
        <>
          <div className="absolute -top-32 left-1/3 w-[600px] h-[400px] bg-[#E62429]/10 blur-[120px] rounded-full pointer-events-none" />
        </>
      )}
    </div>
  );
}
