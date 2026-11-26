import React, { useState, useCallback } from 'react';
import {
  Trophy,
  Sparkles,
  Lock,
  RotateCcw,
  Award,
  X,
  Play,
  Shield,
  Zap,
  CheckCircle2,
  Crown,
  Gift,
  History,
  Star,
  ChevronRight,
  ChevronLeft,
  Flame,
  Target,
} from 'lucide-react';
import { INFINITY_STONES, QUIZ_ACHIEVEMENTS, getFanRank } from '../../data/mcuQuizData.js';
import { quizAudio } from '../../utils/quizAudio.js';
import { InfinityGemSvg, InfinityContainmentCubeSvg } from './StoneVaultAnimation';

const STONE_THEMES = {
  space: {
    border: 'border-[#3B82F6]/65',
    lockedBorder: 'border-[#1E3A5F]/65',
    glow: 'rgba(59, 130, 246, 0.5)',
    softBg: 'from-[#0C1D3A]/85 via-[#070E1C]/95 to-[#05080D]',
    accent: '#3B82F6',
    secondary: '#93C5FD',
  },
  mind: {
    border: 'border-[#EAB308]/65',
    lockedBorder: 'border-[#4D3D10]/70',
    glow: 'rgba(234, 179, 8, 0.5)',
    softBg: 'from-[#2A2005]/85 via-[#120E04]/95 to-[#05080D]',
    accent: '#EAB308',
    secondary: '#FDE047',
  },
  reality: {
    border: 'border-[#EF4444]/65',
    lockedBorder: 'border-[#4D171D]/70',
    glow: 'rgba(239, 68, 68, 0.5)',
    softBg: 'from-[#320A0E]/85 via-[#140507]/95 to-[#05080D]',
    accent: '#EF4444',
    secondary: '#FCA5A5',
  },
  power: {
    border: 'border-[#A855F7]/65',
    lockedBorder: 'border-[#3B1B59]/70',
    glow: 'rgba(168, 85, 247, 0.5)',
    softBg: 'from-[#260C3B]/85 via-[#100619]/95 to-[#05080D]',
    accent: '#A855F7',
    secondary: '#D8B4FE',
  },
  time: {
    border: 'border-[#22C55E]/70',
    lockedBorder: 'border-[#164028]/70',
    glow: 'rgba(34, 197, 94, 0.52)',
    softBg: 'from-[#092917]/85 via-[#05120A]/95 to-[#05080D]',
    accent: '#22C55E',
    secondary: '#86EFAC',
  },
  soul: {
    border: 'border-[#F97316]/70',
    lockedBorder: 'border-[#4E230B]/70',
    glow: 'rgba(249, 115, 22, 0.55)',
    softBg: 'from-[#341505]/85 via-[#140804]/95 to-[#05080D]',
    accent: '#F97316',
    secondary: '#FDBA74',
  },
};

const ACHIEVEMENT_REQUIREMENTS = {
  'spider-sense': { label: '5-ANSWER STREAK', icon: Zap, color: '#EF4444' },
  'super-soldier': { label: '7+ PTS (70%)', icon: Shield, color: '#3B82F6' },
  'thunder-power': { label: '8+ PTS', icon: Flame, color: '#38BDF8' },
  'nano-armor': { label: '10/10 PERFECT', icon: Crown, color: '#EAB308' },
};

/**
 * Interactive subtle 3D perspective card wrapper with cursor specular tracking.
 */
function VaultTiltCard({ children, className = '', style = {}, onClick }) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: (0.5 - py) * 7,
      ry: (px - 0.5) * 7,
      gx: px * 100,
      gy: py * 100,
      active: true,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt((prev) => ({ ...prev, rx: 0, ry: 0, active: false }));
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      style={{
        ...style,
        transform: tilt.active
          ? `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-4px) scale(1.01)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)',
        transition: tilt.active
          ? 'transform 0.12s ease-out, box-shadow 0.25s ease, border-color 0.25s ease'
          : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.3s ease',
      }}
    >
      {/* Dynamic cursor highlight glare */}
      {tilt.active && (
        <div
          className="absolute inset-0 pointer-events-none z-20 opacity-40"
          style={{
            background: `radial-gradient(circle 160px at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.14), transparent 70%)`,
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}

export default function RewardVaultModal({
  progress,
  language = 'en',
  onReplayStone,
  onResetProgress,
  onClose,
}) {
  const [viewMode, setViewMode] = useState('vault'); // 'vault' | 'history'
  const [confirmReset, setConfirmReset] = useState(false);

  const unlockedStones = progress?.unlockedStones || [];
  const unlockedAchievements = progress?.unlockedAchievements || [];
  const bestScore = progress?.bestScore || 0;
  const totalSessions = progress?.totalSessions || 0;
  const perfectCount = progress?.perfectCount || 0;
  const lastSession = progress?.lastSession || null;

  const totalRewardsCount = INFINITY_STONES.length + QUIZ_ACHIEVEMENTS.length;
  const unlockedTotalCount = unlockedStones.length + unlockedAchievements.length;
  const gauntletPowerPct = Math.round((unlockedStones.length / INFINITY_STONES.length) * 100);
  const lastRank = lastSession ? getFanRank(lastSession.score || 0) : null;

  const handleReplay = (stone) => {
    try { quizAudio.stoneUnlock(stone.id); } catch { }
    if (onReplayStone) onReplayStone(stone);
  };

  const handleToggleHistory = () => {
    try { quizAudio.tick(); } catch { }
    setViewMode((m) => (m === 'vault' ? 'history' : 'vault'));
  };

  const handleClose = () => {
    try { quizAudio.tick(); } catch { }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Avengers Infinity Reward Vault"
      className="fixed inset-0 z-[65] flex items-center justify-center p-2 sm:p-5 bg-[#04070A]/[0.92] backdrop-blur-2xl animate-fade-in select-none"
      onClick={handleClose}
    >
      {/* Subtle Battlefield Backdrop & Ambient Doomsday Portal Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <img
          src="/mcu-quiz-battleground.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-20 filter brightness-75 contrast-125"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 25%, rgba(34,197,94,0.16) 0%, transparent 52%), radial-gradient(circle at 82% 72%, rgba(234,179,8,0.14) 0%, transparent 52%), linear-gradient(180deg, rgba(4,7,10,0.75) 0%, rgba(4,7,10,0.92) 100%)',
          }}
        />
      </div>

      {/* Main Heavy Armored Vault Chassis */}
      <div
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col border border-[#2C3E45] bg-gradient-to-b from-[#0C1317]/[0.96] via-[#080C10]/[0.98] to-[#05080B] text-[#F5F5F5] rounded-[8px] shadow-[0_32px_100px_rgba(0,0,0,0.98),0_0_70px_rgba(34,197,94,0.15)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Luminous Edge Conduit */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#22C55E]/20 via-[#EAB308]/80 to-[#22C55E]/20 pointer-events-none z-30" />

        {/* Corner Titanium Brackets */}
        <span className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#22C55E]/70 pointer-events-none z-30" aria-hidden="true" />
        <span className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#22C55E]/70 pointer-events-none z-30" aria-hidden="true" />
        <span className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#EAB308]/50 pointer-events-none z-30" aria-hidden="true" />
        <span className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#EAB308]/50 pointer-events-none z-30" aria-hidden="true" />

        {/* ═══════════════════════════════════════════════════════════
            HEADER STRIP (MATCHING VAULT REFERENCE DIRECTION)
           ═══════════════════════════════════════════════════════════ */}
        <div className="relative px-4 py-3.5 sm:px-7 sm:py-[18px] border-b border-[#1E2B33] bg-gradient-to-r from-[#0F171C] via-[#0B1115] to-[#0F171C] flex flex-wrap items-center justify-between gap-3">
          {/* Radar Scan Line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25" aria-hidden="true">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#22C55E] to-transparent animate-hud-scan" />
          </div>

          {/* Left: Avengers Emblem + Vault Title */}
          <div className="flex items-center gap-3.5 min-w-0 z-10">
            <div className="w-11 h-11 rounded-full border-2 border-[#D4AF37]/75 bg-gradient-to-br from-[#2B220B] via-[#131008] to-black flex items-center justify-center shadow-[0_0_22px_rgba(234,179,8,0.3)] shrink-0">
              <span className="font-cinematic font-black text-xl text-[#FDE047] italic tracking-tighter drop-shadow">
                A
              </span>
            </div>

            <div className="min-w-0">
              <span className="text-[9px] font-mono tracking-[0.26em] text-[#94A3B8] uppercase block leading-none mb-1">
                MCU ULTIMATE QUIZ
              </span>
              <h2 className="text-lg sm:text-2xl font-cinematic font-black text-metallic uppercase tracking-wider leading-none truncate">
                INFINITY REWARD VAULT
              </h2>
              <span className="text-[8.5px] font-mono tracking-[0.22em] text-[#4ADE80] uppercase block mt-1">
                {language === 'ta'
                  ? 'PLAY • EARN • COLLECT LEGENDARY STONES'
                  : 'PLAY • EARN • UNLOCK LEGENDARY REWARDS'}
              </span>
            </div>
          </div>

          {/* Right: Profile Status + Rewards Toggle Pill + Close */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 z-10">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-[#24333C] bg-[#090E12] rounded-full">
              <div className="w-6 h-6 rounded-full border border-[#22C55E]/70 bg-[#0A2416] flex items-center justify-center text-[9px] font-mono font-bold text-[#86EFAC]">
                IM
              </div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-[#E2E8F0] uppercase">
                {language === 'ta' ? 'TANGLISH' : 'ENGLISH'} VAULT
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleHistory}
              className={`h-9 px-3.5 border rounded-[4px] text-[10px] font-mono font-bold tracking-wider uppercase inline-flex items-center gap-2 cursor-pointer transition-all ${viewMode === 'history'
                ? 'border-[#22C55E] bg-[#0D301C] text-[#4ADE80] shadow-[0_0_16px_rgba(34,197,94,0.3)]'
                : 'border-[#D4AF37]/55 hover:border-[#FACC15] bg-[#161308] text-[#FDE68A] hover:text-white shadow-[0_0_14px_rgba(234,179,8,0.16)]'
                }`}
            >
              <Gift className="w-3.5 h-3.5 text-[#FACC15]" />
              <span>
                {viewMode === 'history'
                  ? 'BACK TO VAULT'
                  : `YOUR REWARDS (${unlockedTotalCount}/${totalRewardsCount})`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close Reward Vault"
              className="w-9 h-9 border border-[#2A3B44] hover:border-white bg-[#0D1419] hover:bg-white text-[#94A3B8] hover:text-black rounded-[4px] flex items-center justify-center cursor-pointer transition-all shrink-0"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SCROLLABLE VAULT INTERIOR
           ═══════════════════════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">

          {/* ── DASHBOARD STAT CARDS (BEST SCORE / TOTAL QUIZZES / PERFECT ROUNDS / VAULT POWER) ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Stat 1: Best Score / Points */}
            <div className="relative p-3.5 sm:p-4 border border-[#1E3B2B] bg-gradient-to-br from-[#0D1C15] via-[#09110E] to-[#06090B] rounded-[6px] flex items-center gap-3 shadow-inner overflow-hidden">
              <div className="w-11 h-11 rounded-[6px] border border-[#22C55E]/40 bg-[#082214] flex items-center justify-center shrink-0">
                <InfinityGemSvg color="#22C55E" size={26} />
              </div>
              <div className="min-w-0">
                <span className="text-[8.5px] font-mono tracking-[0.16em] text-[#94A3B8] uppercase block">
                  BEST SCORE • POINTS
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-cinematic font-black text-white tabular-nums">
                    {bestScore}
                  </span>
                  <span className="text-xs font-mono text-[#64748B]">/ 10</span>
                  {lastSession && (
                    <span className="ml-1 text-[9.5px] font-mono font-bold text-[#4ADE80]">
                      +{lastSession.score}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stat 2: Total Quizzes */}
            <div className="relative p-3.5 sm:p-4 border border-[#3B3014] bg-gradient-to-br from-[#1B1609] via-[#0F0D08] to-[#06090B] rounded-[6px] flex items-center gap-3 shadow-inner overflow-hidden">
              <div className="w-11 h-11 rounded-[6px] border border-[#EAB308]/45 bg-[#201907] flex items-center justify-center shrink-0">
                <Star className="w-5 h-5 text-[#FACC15] fill-[#FACC15]/30" />
              </div>
              <div className="min-w-0">
                <span className="text-[8.5px] font-mono tracking-[0.16em] text-[#94A3B8] uppercase block">
                  TOTAL QUIZZES
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-cinematic font-black text-white tabular-nums">
                    {totalSessions}
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8] uppercase">
                    {totalSessions === 1 ? 'RUN' : 'RUNS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stat 3: Perfect Rounds */}
            <div className="relative p-3.5 sm:p-4 border border-[#243154] bg-gradient-to-br from-[#0E162B] via-[#090D18] to-[#06090B] rounded-[6px] flex items-center gap-3 shadow-inner overflow-hidden">
              <div className="w-11 h-11 rounded-[6px] border border-[#3B82F6]/45 bg-[#0B1730] flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-[#60A5FA]" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[8.5px] font-mono tracking-[0.16em] text-[#94A3B8] uppercase block">
                  PERFECT ROUNDS
                </span>
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-cinematic font-black text-white tabular-nums">
                      {perfectCount}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">10/10</span>
                  </div>
                  {perfectCount > 0 && (
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                  )}
                </div>
              </div>
            </div>

            {/* Stat 4: Gauntlet Vault Completion */}
            <div className="relative p-3.5 sm:p-4 border border-[#24353C] bg-gradient-to-br from-[#0E181D] via-[#091014] to-[#06090B] rounded-[6px] flex items-center gap-3 shadow-inner overflow-hidden">
              <div className="w-11 h-11 rounded-[6px] border border-[#38BDF8]/40 bg-[#0A1E2B] flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5 text-[#FACC15]" />
              </div>
              <div className="min-w-0">
                <span className="text-[8.5px] font-mono tracking-[0.16em] text-[#94A3B8] uppercase block">
                  VAULT COLLECTED
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl sm:text-2xl font-cinematic font-black text-[#4ADE80] tabular-nums">
                    {unlockedTotalCount}
                  </span>
                  <span className="text-xs font-mono text-[#64748B]">/ {totalRewardsCount}</span>
                  <span className="ml-1 text-[9.5px] font-mono text-[#EAB308]">
                    ({gauntletPowerPct}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── INFINITY STONES VAULT PROGRESS BAR (MATCHES REFERENCE BAR) ── */}
          <div className="p-4 border border-[#223438] bg-gradient-to-r from-[#0C1418] via-[#091014] to-[#0C1418] rounded-[6px] shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-[4px] border border-[#EAB308]/50 bg-[#1B1606] flex items-center justify-center">
                  <Crown className="w-4 h-4 text-[#FACC15]" />
                </div>
                <h3 className="text-xs sm:text-sm font-cinematic font-bold text-white uppercase tracking-wider">
                  {language === 'ta'
                    ? `INFINITY STONES (${unlockedStones.length}/6 COLLECTED)`
                    : `INFINITY STONES VAULT (${unlockedStones.length}/6 UNLOCKED)`}
                </h3>
              </div>

              <span className="text-[9.5px] font-mono tracking-[0.18em] text-[#4ADE80] uppercase font-semibold">
                &raquo; {INFINITY_STONES.length - unlockedStones.length === 0
                  ? 'ALL 6 INFINITY STONES MASTERED'
                  : `${INFINITY_STONES.length - unlockedStones.length} STONES AWAIT IN ARENA`} &laquo;
              </span>
            </div>

            {/* 6 Segmented Illuminated Emerald Channels */}
            <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
              {INFINITY_STONES.map((stone) => {
                const isUnlocked = unlockedStones.includes(stone.id);
                return (
                  <div
                    key={stone.id}
                    className={`h-2.5 rounded-full border transition-all duration-500 ${isUnlocked
                      ? 'border-[#86EFAC]/80 bg-gradient-to-r from-[#16A34A] via-[#22C55E] to-[#4ADE80] shadow-[0_0_14px_rgba(34,197,94,0.55)]'
                      : 'border-[#1E2A32] bg-[#0B1014]'
                      }`}
                    title={`${stone.en.name} (${stone.minScore}/10)`}
                  />
                );
              })}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              VIEW A: REWARD VAULT CARDS (STONES + BADGES)
             ═══════════════════════════════════════════════════════════ */}
          <div className={viewMode === 'vault' ? 'space-y-6' : 'hidden'}>

            {/* 6 Collectible Infinity Stone Reliquary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {INFINITY_STONES.map((stone) => {
                const isUnlocked = unlockedStones.includes(stone.id);
                const theme = STONE_THEMES[stone.id] || STONE_THEMES.space;
                const copy = stone[language] || stone.en;
                const isFinale = stone.id === 'soul';
                const remainingPoints = Math.max(0, stone.minScore - bestScore);

                return (
                  <VaultTiltCard
                    key={stone.id}
                    onClick={isUnlocked ? () => handleReplay(stone) : undefined}
                    className={`relative rounded-[6px] border-2 flex flex-col justify-between overflow-hidden group ${isUnlocked
                      ? `border-[#22C55E] bg-gradient-to-b from-[#0A2517] via-[#07130D] to-[#05080A] cursor-pointer`
                      : `${theme.lockedBorder} bg-gradient-to-b ${theme.softBg} opacity-90`
                      }`}
                    style={{
                      boxShadow: isUnlocked
                        ? '0 14px 38px rgba(0,0,0,0.88), 0 0 28px rgba(34,197,94,0.22)'
                        : `0 12px 30px rgba(0,0,0,0.85), inset 0 0 22px ${theme.glow.replace('0.5', '0.08')}`,
                    }}
                  >
                    {/* Corner Edge Accents */}
                    <span
                      className={`absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 pointer-events-none ${isUnlocked ? 'border-[#86EFAC]' : 'border-white/25'
                        }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 pointer-events-none ${isUnlocked ? 'border-[#86EFAC]' : 'border-white/25'
                        }`}
                      aria-hidden="true"
                    />

                    {/* Top Status Banner Pill */}
                    <div className="pt-3.5 px-4 flex items-center justify-between gap-2 relative z-10">
                      <span className="text-[8.5px] font-mono text-[#94A3B8] uppercase">
                        REQ: {stone.minScore}/10
                      </span>

                      <span
                        className={`px-3 py-0.5 rounded-[3px] border text-[9px] font-mono font-bold tracking-[0.16em] uppercase inline-flex items-center gap-1 ${isUnlocked
                          ? 'border-[#4ADE80]/80 bg-[#0D3820] text-[#86EFAC] shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                          : 'border-[#334155] bg-[#0C1117] text-[#94A3B8]'
                          }`}
                      >
                        {isUnlocked ? (
                          <>
                            <Sparkles className="w-2.5 h-2.5 text-[#4ADE80]" />
                            <span>UNLOCKED</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-2.5 h-2.5" />
                            <span>LOCKED</span>
                          </>
                        )}
                      </span>

                      <span className="w-6 text-right">
                        {isUnlocked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] inline" />
                        ) : (
                          <Lock className="w-3 h-3 text-[#475569] inline" />
                        )}
                      </span>
                    </div>

                    {/* Center Large Detailed Containment Cube Artwork */}
                    <div className="px-4 py-4 flex flex-col items-center text-center relative z-10">
                      <div className="relative my-1 transition-transform duration-500 group-hover:scale-105">
                        <InfinityContainmentCubeSvg
                          color={stone.color}
                          size={112}
                          locked={!isUnlocked}
                          isFinale={isFinale}
                        />
                      </div>

                      <h4 className="text-sm sm:text-base font-cinematic font-black text-white uppercase tracking-wider mt-2.5 leading-snug">
                        {copy.name}
                      </h4>

                      <p className="text-[10.5px] font-mono text-[#94A3B8] uppercase tracking-wider mt-1">
                        {copy.shortUnlock}
                      </p>
                    </div>

                    {/* Bottom Action / Status Bar */}
                    <div className="p-3 border-t border-white/[0.08] bg-black/50 relative z-10">
                      {isUnlocked && onReplayStone ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReplay(stone);
                          }}
                          className="mass-cta-btn w-full py-2 px-3 rounded-[4px] border border-[#22C55E]/75 hover:border-white bg-gradient-to-r from-[#0E3A21] via-[#15803D] to-[#0E3A21] hover:from-[#16A34A] hover:to-[#22C55E] text-[#BBF7D0] hover:text-white text-[10px] font-mono font-bold tracking-[0.16em] uppercase inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-[0_0_16px_rgba(34,197,94,0.22)]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>CLAIMED • REPLAY</span>
                          <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                        </button>
                      ) : (
                        <div className="w-full py-2 px-3 rounded-[4px] border border-[#222D38] bg-[#0B1015] text-[9.5px] font-mono text-[#64748B] uppercase tracking-[0.15em] inline-flex items-center justify-center gap-1.5">
                          <Lock className="w-3 h-3" />
                          <span>
                            {bestScore > 0 && remainingPoints > 0
                              ? `LOCKED • ${remainingPoints} MORE NEEDED`
                              : `LOCKED • ${stone.minScore} QUIZ POINTS`}
                          </span>
                        </div>
                      )}
                    </div>
                  </VaultTiltCard>
                );
              })}
            </div>

            {/* 4 Special Ability Achievements (Collectible Avengers Medals) */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3.5 border-b border-[#1E2B33]">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#EAB308]" />
                  <h3 className="text-xs sm:text-sm font-cinematic font-bold text-white uppercase tracking-wider">
                    {language === 'ta' ? 'SPECIAL ABILITY BADGES' : 'SPECIAL ABILITY ACHIEVEMENTS'}
                  </h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#FACC15] uppercase tracking-wider">
                  {unlockedAchievements.length} / {QUIZ_ACHIEVEMENTS.length} UNLOCKED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {QUIZ_ACHIEVEMENTS.map((ach) => {
                  const earned = unlockedAchievements.includes(ach.id);
                  const copy = ach[language] || ach.en;
                  const meta = ACHIEVEMENT_REQUIREMENTS[ach.id] || {
                    label: 'MISSION CLEAR',
                    icon: Award,
                    color: '#22C55E',
                  };
                  const BadgeIcon = meta.icon;

                  return (
                    <VaultTiltCard
                      key={ach.id}
                      className={`relative p-4 border rounded-[6px] flex items-center gap-4 overflow-hidden ${earned
                        ? 'border-[#22C55E]/75 bg-gradient-to-r from-[#0B2317] via-[#09130F] to-[#06090B] shadow-[0_10px_28px_rgba(34,197,94,0.16)]'
                        : 'border-[#1E2A35] bg-[#070B0F] opacity-75'
                        }`}
                    >
                      {/* Metallic Crest Medal */}
                      <div
                        className={`w-14 h-14 rounded-[8px] border-2 flex items-center justify-center shrink-0 relative ${earned
                          ? 'border-[#FACC15] bg-gradient-to-br from-[#2B2107] via-[#131006] to-black shadow-[0_0_22px_rgba(234,179,8,0.4)]'
                          : 'border-[#293545] bg-[#0B1016] text-[#475569]'
                          }`}
                      >
                        {earned ? (
                          <BadgeIcon className="w-6 h-6" style={{ color: meta.color }} />
                        ) : (
                          <Lock className="w-5 h-5 text-[#64748B]" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-cinematic font-black text-white uppercase tracking-wide truncate">
                            {copy.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-[2px] border text-[8px] font-mono font-bold uppercase shrink-0 ${earned
                              ? 'border-[#22C55E]/70 bg-[#0D331E] text-[#86EFAC]'
                              : 'border-[#283546] bg-[#0C1219] text-[#64748B]'
                              }`}
                          >
                            {earned ? 'UNLOCKED' : meta.label}
                          </span>
                        </div>
                        <p className="text-[11px] font-body text-[#94A3B8] leading-snug">
                          {copy.desc}
                        </p>
                      </div>
                    </VaultTiltCard>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              VIEW B: REWARDS HISTORY & LATEST MISSION LOG
             ═══════════════════════════════════════════════════════════ */}
          <div className={viewMode === 'history' ? 'space-y-4 animate-fade-in' : 'hidden'}>
            <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[#1E2B33]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#4ADE80]" />
                <h3 className="text-xs sm:text-sm font-cinematic font-bold text-white uppercase tracking-wider">
                  REWARDS HISTORY &amp; MISSION LEDGER
                </h3>
              </div>

              <button
                type="button"
                onClick={handleToggleHistory}
                className="px-3 py-1 border border-[#2B3B45] hover:border-white bg-[#0C1318] text-[10px] font-mono text-[#E2E8F0] rounded-[3px] inline-flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>BACK TO VAULT</span>
              </button>
            </div>

            {lastSession ? (
              <div className="p-4 sm:p-5 border border-[#22C55E]/40 bg-gradient-to-br from-[#0B1C14] to-[#070B0E] rounded-[6px] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.2em] text-[#4ADE80] uppercase block">
                      MOST RECENT MISSION LOG
                    </span>
                    <h4 className="text-base sm:text-lg font-cinematic font-black text-white uppercase">
                      {((lastRank && (lastRank[language] || lastRank.en)) || { label: 'MISSION RECORD' }).label}
                    </h4>
                  </div>

                  <span className="px-3 py-1 border border-[#22C55E]/50 bg-[#0A2918] rounded-full text-xs font-mono font-bold text-[#86EFAC]">
                    {lastSession.score} / {lastSession.totalQuestions || 10} ({lastSession.accuracy}%)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-2.5 border border-[#1E2D27] bg-black/40 rounded-[4px]">
                    <span className="text-[8.5px] font-mono text-[#94A3B8] uppercase block">MAX STREAK</span>
                    <strong className="text-sm font-cinematic text-[#FACC15]">{lastSession.maxStreak || 0}</strong>
                  </div>
                  <div className="p-2.5 border border-[#1E2D27] bg-black/40 rounded-[4px]">
                    <span className="text-[8.5px] font-mono text-[#94A3B8] uppercase block">STONES IN RUN</span>
                    <strong className="text-sm font-cinematic text-[#4ADE80]">
                      {(lastSession.stonesInRun || []).length}/6
                    </strong>
                  </div>
                  <div className="p-2.5 border border-[#1E2D27] bg-black/40 rounded-[4px]">
                    <span className="text-[8.5px] font-mono text-[#94A3B8] uppercase block">BADGES IN RUN</span>
                    <strong className="text-sm font-cinematic text-[#60A5FA]">
                      {(lastSession.achievementsInRun || []).length}/4
                    </strong>
                  </div>
                  <div className="p-2.5 border border-[#1E2D27] bg-black/40 rounded-[4px]">
                    <span className="text-[8.5px] font-mono text-[#94A3B8] uppercase block">LANGUAGE</span>
                    <strong className="text-xs font-mono text-white uppercase">
                      {lastSession.language === 'ta' ? 'TANGLISH' : 'ENGLISH'}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center border border-[#1E2933] bg-[#080C10] rounded-[6px]">
                <History className="w-8 h-8 text-[#475569] mx-auto mb-2.5" />
                <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider">
                  NO MISSIONS RECORDED YET
                </p>
                <p className="text-xs font-body text-[#64748B] mt-1">
                  Complete a 10-question MCU Quiz session to log your mission stats and Infinity Stone unlocks here.
                </p>
              </div>
            )}

            {/* Claimed Collectible Inventory Summary */}
            <div className="p-4 border border-[#1E2A33] bg-[#080C10] rounded-[6px]">
              <span className="text-[9.5px] font-mono tracking-[0.18em] text-[#94A3B8] uppercase block mb-3">
                CLAIMED REWARDS IN VAULT ({unlockedTotalCount}/{totalRewardsCount})
              </span>
              {unlockedTotalCount === 0 ? (
                <p className="text-xs font-body text-[#64748B]">
                  No Infinity Stones or Achievement Badges unlocked yet. Score 5+ in a round to claim the Space Stone!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {INFINITY_STONES.filter((s) => unlockedStones.includes(s.id)).map((stone) => {
                    const copy = stone[language] || stone.en;
                    return (
                      <button
                        key={stone.id}
                        type="button"
                        onClick={() => handleReplay(stone)}
                        className="px-3 py-1.5 rounded-[4px] border border-[#22C55E]/50 bg-[#0A2115] hover:bg-[#103522] text-[10px] font-mono font-bold text-[#86EFAC] inline-flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <InfinityGemSvg color={stone.color} size={14} />
                        <span>{copy.name}</span>
                      </button>
                    );
                  })}
                  {QUIZ_ACHIEVEMENTS.filter((a) => unlockedAchievements.includes(a.id)).map((ach) => {
                    const copy = ach[language] || ach.en;
                    return (
                      <span
                        key={ach.id}
                        className="px-3 py-1.5 rounded-[4px] border border-[#EAB308]/50 bg-[#1A1506] text-[10px] font-mono font-bold text-[#FDE047] inline-flex items-center gap-1.5"
                      >
                        <Award className="w-3 h-3 text-[#FACC15]" />
                        <span>{copy.title}</span>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════════
            BOTTOM VAULT ARCHITECTURAL FOOTER (MATCHES REFERENCE IMAGE)
           ═══════════════════════════════════════════════════════════ */}
        <div className="px-4 sm:px-7 py-3 border-t border-[#1E2B33] bg-[#070B0E] flex flex-wrap items-center justify-between gap-3 z-20">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            <span className="text-[9.5px] font-mono italic text-[#64748B] uppercase tracking-wider truncate">
              &ldquo;PART OF THE JOURNEY IS THE END.&rdquo; — TONY STARK
            </span>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => {
                  try { quizAudio.tick(); } catch { }
                  setConfirmReset(true);
                }}
                className="px-2.5 py-1 border border-[#27333D] hover:border-[#EF4444]/70 text-[9px] font-mono text-[#64748B] hover:text-[#F87171] uppercase tracking-wider rounded-[3px] inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{language === 'ta' ? 'RESET VAULT' : 'RESET'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    try { quizAudio.incorrect(); } catch { }
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="px-2.5 py-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-[9px] font-mono font-bold uppercase rounded-[3px] cursor-pointer"
                >
                  CONFIRM
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 border border-[#374151] text-[#9CA3AF] text-[9px] font-mono uppercase rounded-[3px] cursor-pointer"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggleHistory}
            className="px-3.5 py-1.5 border border-[#22C55E]/50 hover:border-[#4ADE80] bg-[#0A2216] hover:bg-[#113624] text-[#86EFAC] hover:text-white text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase rounded-[4px] inline-flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <History className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>{viewMode === 'history' ? 'RETURN TO STONES' : 'REWARDS HISTORY'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
