import React, { useId } from 'react';
import { Sparkles, ShieldCheck, ChevronRight, Zap } from 'lucide-react';

const STONE_VISUALS = {
  space: {
    color: '#3B82F6',
    secondary: '#93C5FD',
    glow: 'rgba(59, 130, 246, 0.65)',
    gradient: 'from-[#0A1A36] via-[#060C18] to-[#04060A]',
    ringBorder: 'border-[#60A5FA]',
  },
  mind: {
    color: '#EAB308',
    secondary: '#FDE047',
    glow: 'rgba(234, 179, 8, 0.65)',
    gradient: 'from-[#2A2006] via-[#100D05] to-[#04060A]',
    ringBorder: 'border-[#FACC15]',
  },
  reality: {
    color: '#EF4444',
    secondary: '#FCA5A5',
    glow: 'rgba(239, 68, 68, 0.65)',
    gradient: 'from-[#33090D] via-[#130608] to-[#04060A]',
    ringBorder: 'border-[#F87171]',
  },
  power: {
    color: '#A855F7',
    secondary: '#D8B4FE',
    glow: 'rgba(168, 85, 247, 0.68)',
    gradient: 'from-[#260C3A] via-[#0E0616] to-[#04060A]',
    ringBorder: 'border-[#C084FC]',
  },
  time: {
    color: '#22C55E',
    secondary: '#86EFAC',
    glow: 'rgba(34, 197, 94, 0.68)',
    gradient: 'from-[#082A17] via-[#05120B] to-[#04060A]',
    ringBorder: 'border-[#4ADE80]',
  },
  soul: {
    color: '#F97316',
    secondary: '#FDBA74',
    glow: 'rgba(249, 115, 22, 0.72)',
    gradient: 'from-[#361605] via-[#140905] to-[#04060A]',
    ringBorder: 'border-[#FB923C]',
  },
};

const ALL_STONE_ORDER = [
  { id: 'space', color: '#3B82F6', label: 'SPACE' },
  { id: 'mind', color: '#EAB308', label: 'MIND' },
  { id: 'reality', color: '#EF4444', label: 'REALITY' },
  { id: 'power', color: '#A855F7', label: 'POWER' },
  { id: 'time', color: '#22C55E', label: 'TIME' },
  { id: 'soul', color: '#F97316', label: 'SOUL' },
];

/**
 * Shared Faceted Infinity Gem SVG (also imported by McuQuizThumbnail).
 */
export function InfinityGemSvg({ color, size = 84, isFinale = false }) {
  const uid = useId().replace(/:/g, '');
  const gradId = `gemGrad-${uid}`;
  const glowId = `gemGlow-${uid}`;
  const useSvgFilter = size > 32;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="overflow-visible select-none drop-shadow-[0_0_12px_currentColor]"
      style={{ color }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradId} cx="38%" cy="28%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
          <stop offset="28%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor="#05070B" stopOpacity="0.98" />
        </radialGradient>
        {useSvgFilter && (
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={isFinale ? '7' : '5'} result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
      </defs>
      {/* Faceted Crystalline Infinity Stone Silhouette */}
      <g filter={useSvgFilter ? `url(#${glowId})` : undefined}>
        <polygon
          points="50,4 84,26 86,72 50,96 14,72 16,26"
          fill={`url(#${gradId})`}
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeOpacity="0.88"
        />
        <polygon points="50,4 70,30 50,56 30,30" fill="#FFFFFF" fillOpacity="0.38" />
        <polygon points="50,56 86,72 50,96 14,72" fill="#000000" fillOpacity="0.28" />
      </g>
    </svg>
  );
}

/**
 * Detailed Cybernetic Containment Reliquary Cube framing the Infinity Gem.
 * Renders a heavy sci-fi metallic armored housing matching the AAA vault mockup.
 */
export function InfinityContainmentCubeSvg({
  color = '#3B82F6',
  size = 116,
  locked = false,
  isFinale = false,
}) {
  const uid = useId().replace(/:/g, '');
  const metalGradId = `cubeMetal-${uid}`;
  const coreGlowId = `cubeCore-${uid}`;
  const gemGradId = `cubeGem-${uid}`;

  const rimColor = locked ? '#64748B' : '#CBD5E1';
  const accentColor = color;
  const gemOpacity = locked ? 0.52 : 1;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      className="overflow-visible select-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={metalGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={locked ? '#28313D' : '#475569'} />
          <stop offset="50%" stopColor={locked ? '#141920' : '#1E293B'} />
          <stop offset="100%" stopColor="#090C11" />
        </linearGradient>

        <radialGradient id={coreGlowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accentColor} stopOpacity={locked ? '0.28' : '0.82'} />
          <stop offset="55%" stopColor={accentColor} stopOpacity={locked ? '0.1' : '0.24'} />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>

        <radialGradient id={gemGradId} cx="38%" cy="30%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={locked ? '0.55' : '0.98'} />
          <stop offset="32%" stopColor={accentColor} stopOpacity={gemOpacity} />
          <stop offset="100%" stopColor="#05070B" stopOpacity="0.98" />
        </radialGradient>
      </defs>

      {/* Cosmic Aura Backdrop Circle */}
      <circle cx="70" cy="70" r="64" fill={`url(#${coreGlowId})`} />

      {/* Outer Armored Reliquary Chassis */}
      <polygon
        points="32,14 108,14 126,32 126,108 108,126 32,126 14,108 14,32"
        fill={`url(#${metalGradId})`}
        stroke={locked ? '#334155' : rimColor}
        strokeWidth="2.2"
      />

      {/* Inner Chamfered Steel Cavity */}
      <polygon
        points="40,24 100,24 116,40 116,100 100,116 40,116 24,100 24,40"
        fill="#070A0F"
        stroke={accentColor}
        strokeOpacity={locked ? '0.28' : '0.7'}
        strokeWidth="1.4"
      />

      {/* Corner Armored Clamp Plates & Rivets */}
      {[
        [22, 22],
        [118, 22],
        [22, 118],
        [118, 118],
      ].map(([cx, cy], idx) => (
        <g key={idx}>
          <circle
            cx={cx}
            cy={cy}
            r="5.5"
            fill={locked ? '#1E293B' : '#334155'}
            stroke={locked ? '#475569' : '#94A3B8'}
            strokeWidth="1.2"
          />
          <circle
            cx={cx}
            cy={cy}
            r="2"
            fill={locked ? '#475569' : accentColor}
            fillOpacity={locked ? '0.55' : '0.95'}
          />
        </g>
      ))}

      {/* 4 Diagonal Conduit Struts Holding Core */}
      <g stroke={locked ? '#475569' : accentColor} strokeWidth="2" strokeOpacity={locked ? '0.45' : '0.85'}>
        <line x1="29" y1="29" x2="47" y2="47" />
        <line x1="111" y1="29" x2="93" y2="47" />
        <line x1="29" y1="111" x2="47" y2="93" />
        <line x1="111" y1="111" x2="93" y2="93" />
      </g>

      {/* Circular Containment Magnetic Ring */}
      <circle
        cx="70"
        cy="70"
        r="34"
        fill="none"
        stroke={locked ? '#334155' : accentColor}
        strokeWidth="1.8"
        strokeDasharray="6 4"
        strokeOpacity={locked ? '0.45' : '0.85'}
      />

      {/* Vertical & Horizontal Stabilization Clamps */}
      <rect x="64" y="16" width="12" height="10" rx="1.5" fill={locked ? '#334155' : '#94A3B8'} />
      <rect x="64" y="114" width="12" height="10" rx="1.5" fill={locked ? '#334155' : '#94A3B8'} />
      <rect x="16" y="64" width="10" height="12" rx="1.5" fill={locked ? '#334155' : '#94A3B8'} />
      <rect x="114" y="64" width="10" height="12" rx="1.5" fill={locked ? '#334155' : '#94A3B8'} />

      {/* Center Faceted Infinity Gemstone */}
      <g
        style={{
          filter: locked ? 'none' : `drop-shadow(0 0 ${isFinale ? '14px' : '10px'} ${accentColor})`,
        }}
      >
        <polygon
          points="70,38 92,52 93,86 70,102 47,86 48,52"
          fill={`url(#${gemGradId})`}
          stroke={locked ? '#94A3B8' : '#FFFFFF'}
          strokeOpacity={locked ? '0.4' : '0.9'}
          strokeWidth="1.6"
        />
        {/* Upper Specular Facet */}
        <polygon
          points="70,38 83,55 70,71 57,55"
          fill="#FFFFFF"
          fillOpacity={locked ? '0.16' : '0.42'}
        />
        {/* Lower Shadow Facet */}
        <polygon
          points="70,71 93,86 70,102 47,86"
          fill="#000000"
          fillOpacity="0.32"
        />
        {/* Center Gem Ridge Line */}
        <line
          x1="70"
          y1="38"
          x2="70"
          y2="102"
          stroke="#FFFFFF"
          strokeOpacity={locked ? '0.15' : '0.35'}
          strokeWidth="0.9"
        />
      </g>
    </svg>
  );
}

export default function StoneVaultAnimation({
  stone,
  language = 'en',
  unlockedStoneIds = [],
  onContinue,
}) {
  if (!stone) return null;

  const vis = STONE_VISUALS[stone.id] || STONE_VISUALS.space;
  const isFinale = stone.id === 'soul';
  const copy = stone[language] || stone.en;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 bg-black/[0.94] backdrop-blur-2xl animate-fade-in overflow-y-auto select-none"
    >
      {/* Screen Dimming + Radial Cosmic Energy Burst */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isFinale
            ? 'radial-gradient(circle at 50% 40%, rgba(249,115,22,0.34) 0%, rgba(234,179,8,0.2) 32%, rgba(34,197,94,0.12) 55%, transparent 76%)'
            : `radial-gradient(circle at 50% 40%, ${vis.glow} 0%, transparent 66%)`,
        }}
        aria-hidden="true"
      />

      {/* Ambient Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-45" aria-hidden="true">
        <span className="absolute top-[22%] left-[26%] w-1.5 h-1.5 rounded-full bg-white animate-gamma-spark" />
        <span className="absolute top-[30%] right-[24%] w-2 h-2 rounded-full bg-[#86EFAC] animate-gamma-spark" style={{ animationDelay: '0.6s' }} />
        <span className="absolute bottom-[28%] left-[32%] w-1.5 h-1.5 rounded-full bg-[#FDE047] animate-gamma-spark" style={{ animationDelay: '1.1s' }} />
        <span className="absolute bottom-[24%] right-[28%] w-1.5 h-1.5 rounded-full bg-white animate-gamma-spark" style={{ animationDelay: '1.7s' }} />
      </div>

      {/* Heavy Cybernetic Containment Frame */}
      <div
        className={`relative w-full max-w-xl border-2 ${vis.ringBorder} bg-gradient-to-b ${vis.gradient} p-6 sm:p-10 rounded-[8px] text-center overflow-hidden animate-vault-unlock`}
        style={{
          boxShadow: `0 30px 100px rgba(0,0,0,0.98), 0 0 65px ${vis.glow}`,
        }}
      >
        {/* Top Metallic Bevel Light + HUD Brackets */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
        <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-white/50 pointer-events-none" aria-hidden="true" />
        <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-white/50 pointer-events-none" aria-hidden="true" />
        <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-white/50 pointer-events-none" aria-hidden="true" />
        <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-white/50 pointer-events-none" aria-hidden="true" />

        {/* REWARD UNLOCKED Top Telemetry Banner */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 border border-white/25 bg-black/80 text-[10px] font-mono font-bold tracking-[0.22em] text-white uppercase rounded-full shadow-lg">
          <Sparkles className="w-3.5 h-3.5" style={{ color: vis.secondary }} />
          <span>
            {isFinale
              ? 'REWARD UNLOCKED • INFINITY GAUNTLET COMPLETE'
              : `REWARD UNLOCKED • ${stone.minScore}/10 SCORE THRESHOLD`}
          </span>
        </div>

        {/* Central Rotating Orbital Rings & Armored Cube Artwork */}
        <div className="relative mx-auto w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center mb-5">
          {/* Expanding Unlock Shockwave */}
          <div
            className="absolute w-32 h-32 rounded-full border-2 animate-vault-shockwave pointer-events-none"
            style={{ borderColor: vis.color }}
            aria-hidden="true"
          />

          {/* Orbital Ring 1 */}
          <div
            className="absolute inset-1 rounded-full border-2 border-dashed animate-cosmic-orbit opacity-55"
            style={{ borderColor: vis.color }}
            aria-hidden="true"
          />

          {/* Orbital Ring 2 (Counter-spin) */}
          <div
            className="absolute inset-5 rounded-full border border-dotted animate-cosmic-orbit-reverse opacity-70"
            style={{ borderColor: vis.secondary }}
            aria-hidden="true"
          />

          {/* Radiant Core Glow Pod */}
          <div
            className="absolute inset-11 rounded-full pointer-events-none"
            style={{
              backgroundColor: `${vis.color}22`,
              boxShadow: `0 0 55px ${vis.glow}, inset 0 0 32px ${vis.glow}`,
            }}
            aria-hidden="true"
          />

          {/* Detailed Collectible Reliquary Cube & Faceted Gem */}
          <div className="relative z-10 animate-bounce" style={{ animationDuration: '2.9s' }}>
            <InfinityContainmentCubeSvg
              color={vis.color}
              size={isFinale ? 156 : 142}
              isFinale={isFinale}
            />
          </div>
        </div>

        {/* Stone Title & Narrative */}
        <h2
          className="text-2xl sm:text-3xl font-cinematic font-black uppercase tracking-wider text-white mb-2.5"
          style={{ textShadow: `0 0 28px ${vis.glow}` }}
        >
          {copy.title}
        </h2>
        <p className="text-xs sm:text-sm font-body text-[#E2E8F0] max-w-md mx-auto leading-relaxed mb-6">
          {copy.message}
        </p>

        {/* Mini Gauntlet Dock Matrix */}
        <div className="p-3.5 mb-6 border border-white/15 bg-black/75 rounded-[5px]">
          <div className="text-[9px] font-mono tracking-[0.2em] text-[#94A3B8] uppercase mb-2.5 flex items-center justify-center gap-1.5 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>GAUNTLET CONTAINMENT MATRIX</span>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {ALL_STONE_ORDER.map((s) => {
              const active = unlockedStoneIds.includes(s.id) || s.id === stone.id;
              const isJustNow = s.id === stone.id;
              return (
                <div
                  key={s.id}
                  className={`py-2 px-1 rounded-[3px] border flex flex-col items-center justify-center transition-all duration-500 ${isJustNow
                    ? 'scale-105 bg-white/15 border-white shadow-[0_0_16px_rgba(255,255,255,0.38)]'
                    : active
                      ? 'bg-white/5 border-white/30'
                      : 'bg-[#090B0F] border-[#1E232C] opacity-35'
                    }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full mb-1 ${isJustNow ? 'animate-pulse' : ''}`}
                    style={{
                      backgroundColor: active ? s.color : '#2A303C',
                      boxShadow: active ? `0 0 12px ${s.color}` : 'none',
                    }}
                  />
                  <span className="text-[8px] font-mono font-bold text-white">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Claim / Continue Protocol CTA */}
        <button
          type="button"
          onClick={onContinue}
          style={{
            background: `linear-gradient(135deg, ${vis.color} 0%, #0F172A 145%)`,
          }}
          className="mass-cta-btn px-8 py-3.5 rounded-[4px] border border-white/45 hover:border-white text-white font-display font-black text-xs tracking-[0.2em] uppercase inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105 hover:brightness-110 shadow-[0_12px_35px_rgba(0,0,0,0.85)]"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'CONTINUE PROTOCOL' : 'CLAIM & CONTINUE'}</span>
          <ChevronRight className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}
