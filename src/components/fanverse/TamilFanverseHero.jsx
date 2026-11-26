import React from 'react';
import { Calendar, Play, Flame, ChevronRight, ShieldCheck } from 'lucide-react';
import { clockAudio } from '../../utils/audio.js';

const HERO_PARTICLES = [
  { left: '8%', top: '22%', size: 3, delay: '0s', duration: '9s', color: '#22C55E' },
  { left: '19%', top: '72%', size: 2, delay: '1.5s', duration: '11s', color: '#E62429' },
  { left: '34%', top: '18%', size: 2.5, delay: '2.8s', duration: '10s', color: '#38BDF8' },
  { left: '52%', top: '80%', size: 3, delay: '0.8s', duration: '12s', color: '#22C55E' },
  { left: '66%', top: '26%', size: 2, delay: '3.4s', duration: '8.5s', color: '#22C55E' },
  { left: '78%', top: '64%', size: 2.5, delay: '2.1s', duration: '10.5s', color: '#E62429' },
  { left: '91%', top: '34%', size: 3, delay: '1.1s', duration: '9.5s', color: '#38BDF8' },
];

export default function TamilFanverseHero({
  featuredVideo,
  onPlayVideo,
  formatted,
  onMarkCalendar,
  onJumpTo,
}) {
  return (
    <div className="relative mb-12 sm:mb-16 rounded-[4px] border border-white/[0.09] bg-[#07090D] overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.9)]">
      {/* Layered Multiverse Backdrop + Doctor Doom Parallax Atmosphere */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <img
          src="/doomsday-ensemble-poster.jpg"
          alt="Multiverse Saga Ensemble"
          className="w-full h-full object-cover object-center opacity-25 scale-105 filter contrast-125 saturate-90"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 75% 70% at 68% 35%, rgba(16,185,129,0.18) 0%, rgba(230,36,41,0.08) 42%, rgba(7,9,13,0.95) 85%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06070B] via-[#06070B]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06070B] via-transparent to-[#06070B]/70" />

        {/* Subtle Drifting Energy Particles */}
        {HERO_PARTICLES.map((p, i) => (
          <span
            key={i}
            style={{
              left: p.left,
              top: p.top,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              animation: `pulse ${p.duration} ease-in-out ${p.delay} infinite`,
            }}
            className="absolute rounded-full opacity-55"
          />
        ))}
      </div>

      {/* Top Architectural Edge Highlight */}
      <div className="relative z-10 h-[2px] w-full bg-gradient-to-r from-[#E62429] via-[#22C55E] to-[#38BDF8]" />

      {/* Main Asymmetric Hero Content */}
      <div className="relative z-10 p-5 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-center">
        {/* Left: Tamil Fanverse Identity + Tagline + Quick Hub Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 mb-4 border border-[#22C55E]/40 bg-[#0B1710]/90 rounded-[2px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-[9.5px] sm:text-[10.5px] font-mono font-bold tracking-[0.26em] text-[#86EFAC] uppercase">
              MULTIVERSE ORU TAMIL VIBE!
            </span>
          </div>

          <h2 className="text-4xl xs:text-5xl sm:text-6xl lg:text-[64px] font-cinematic font-black tracking-tight text-metallic uppercase leading-[0.95] mb-3 drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
            TAMIL FANVERSE
          </h2>

          <p className="text-base sm:text-xl font-display font-bold text-[#F3F4F6] tracking-wide mb-3">
            &ldquo;Idhu just oru fandom illa. Idhu oru emotion!&rdquo;
          </p>

          <p className="text-xs sm:text-sm font-body text-[#A1A7B3] leading-relaxed max-w-2xl mb-6 border-l-2 border-[#E62429] pl-3.5">
            &ldquo;Multiverse maaralam... Aana namma fan vibe maarathu!&rdquo; — Tamil-dubbed Avengers theatre whistle memories, verified Doomsday updates, Character dossiers, Timeline secrets &amp; Namma Fan Poll HQ!
          </p>

          {/* Compact Featured Story Deck */}
          <div className="w-full max-w-2xl p-4 border border-white/[0.09] bg-[#0B0E14]/[0.88] backdrop-blur-md rounded-[3px] mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-[9.5px] font-mono font-bold tracking-[0.18em] text-[#4ADE80] uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>FEATURED SPOTLIGHT // LATVERIA RISES</span>
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 bg-[#E62429]/20 border border-[#E62429]/50 text-[#FCA5A5] uppercase rounded-[2px]">
                OFFICIAL MARVEL STUDIOS
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-cinematic font-bold text-white mb-1.5">
              &ldquo;Doctor Doom entry-ku apram game rules-e maarapoguthu.&rdquo;
            </h3>
            <p className="text-xs font-body text-[#9CA3AF] leading-relaxed mb-3.5">
              Robert Downey Jr. portraying Victor von Doom — Russo Brothers direction + Alan Silvestri music kooda Dec 2026-la worldwide Tamil cinema invasion ready aaguthu!
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch {}
                  onPlayVideo(featuredVideo);
                }}
                className="px-4 py-2 bg-[#E62429] hover:bg-[#DC2626] text-white text-[10.5px] font-mono font-extrabold tracking-[0.16em] uppercase rounded-[2px] inline-flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_24px_rgba(230,36,41,0.35)]"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>WATCH FINAL TAMIL TRAILER</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch {}
                  onJumpTo('fanverse-fanzone');
                }}
                className="px-4 py-2 border border-white/[0.14] hover:border-[#22C55E] bg-white/[0.04] hover:bg-[#22C55E]/15 text-[#E5E7EB] hover:text-white text-[10.5px] font-mono font-bold tracking-[0.14em] uppercase rounded-[2px] inline-flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <Flame className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>FAN POLLS &amp; SQUAD</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Featured Doctor Doom Stained-Glass Artwork + Live Final Countdown Stub */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative rounded-[3px] border border-white/[0.12] bg-[#0A0D12] overflow-hidden group shadow-2xl">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src="/doctor-doom-portrait.jpg"
                alt="Victor von Doom — Doctor Doom"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-[#0A0D12]/25 to-transparent" />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 70% 25%, rgba(34,197,94,0.22), transparent 55%)',
                }}
              />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 bg-black/75 backdrop-blur-md border border-[#22C55E]/50 text-[#4ADE80] text-[9px] font-mono font-bold tracking-[0.18em] uppercase rounded-[2px]">
                  VICTOR VON DOOM
                </span>
                <span className="px-2 py-0.5 bg-black/75 backdrop-blur-md border border-white/15 text-[#D8D9DC] text-[9px] font-mono tracking-wider uppercase rounded-[2px]">
                  ROBERT DOWNEY JR.
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-xs font-cinematic font-bold text-white tracking-wider uppercase">
                  &ldquo;Oru Mask. Oru Universe. Zero Escape.&rdquo;
                </p>
              </div>
            </div>

            {/* Integrated Compact Doomsday Ticket Countdown + Calendar Action */}
            <div className="p-4 border-t border-white/[0.08] bg-[#080A0F]">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                  <span className="text-[9.5px] font-mono tracking-[0.2em] text-[#9CA3AF] uppercase">
                    THE FINAL COUNTDOWN
                  </span>
                </div>
                <span className="text-xs sm:text-sm font-cinematic font-black text-metallic tracking-wider">
                  18 DEC 2026
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 p-2.5 mb-3 bg-[#050609] border border-white/[0.07] rounded-[2px] text-center">
                <div>
                  <span className="text-sm font-sans font-bold text-white block tabular-nums">{formatted.months}</span>
                  <span className="text-[7px] font-mono text-[#777A80] uppercase">MONTHS</span>
                </div>
                <div>
                  <span className="text-sm font-sans font-bold text-white block tabular-nums">{formatted.daysInMonth}</span>
                  <span className="text-[7px] font-mono text-[#777A80] uppercase">DAYS</span>
                </div>
                <div>
                  <span className="text-sm font-sans font-bold text-white block tabular-nums">{formatted.hours}</span>
                  <span className="text-[7px] font-mono text-[#777A80] uppercase">HOURS</span>
                </div>
                <div>
                  <span className="text-sm font-sans font-bold text-[#34D399] block tabular-nums">{formatted.minutes}</span>
                  <span className="text-[7px] font-mono text-[#34D399] uppercase">MINS</span>
                </div>
                <div>
                  <span className="text-sm font-sans font-bold text-[#34D399] block tabular-nums">{formatted.seconds}</span>
                  <span className="text-[7px] font-mono text-[#34D399] uppercase">SECS</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onMarkCalendar}
                className="w-full py-2 px-4 border border-white/[0.12] hover:border-[#22C55E] bg-[#0E1218] hover:bg-[#111C15] text-white text-[10px] font-mono font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-[2px]"
              >
                <Calendar className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>MARK YOUR CALENDAR // DEC 18</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
