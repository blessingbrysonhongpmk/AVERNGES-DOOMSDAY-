import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Home,
  Film,
  Users,
  Newspaper,
  Gamepad2,
  Upload,
  RotateCcw,
  SlidersHorizontal,
  Music,
  Check,
  Clock,
} from 'lucide-react';
import { useClockAudio } from '../utils/audio.js';
import { useAvengersBgm, BGM_TRACKS } from '../utils/bgm.js';

const NAV_ITEMS = [
  { id: 'overview', label: 'Home', icon: Home },
  { id: 'game-mayhem', label: 'Games', icon: Gamepad2 },
  { id: 'watchlist', label: 'Road to Doomsday', icon: Film },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'intelligence', label: 'Intelligence', icon: Newspaper },
];

/**
 * Custom metallic Avengers 'A' insignia mark (replaces generic circular text badge).
 */
function AvengersEmblemSvg() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 64 64"
      fill="none"
      className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 drop-shadow-[0_0_8px_rgba(34,197,94,0.28)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="navAvSilver" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="48%" stopColor="#D1D5DB" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="navAvGreen" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#15803D" />
        </linearGradient>
      </defs>
      {/* Signature open-bottom Avengers orbital arc */}
      <path
        d="M19.5 47.5A21.5 21.5 0 1 1 49 38"
        stroke="url(#navAvGreen)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="21.5" stroke="url(#navAvSilver)" strokeWidth="1.2" strokeOpacity="0.38" />
      {/* Sculpted Avengers "A" letterform + forward arrow crossbar */}
      <path
        d="M34.5 9L14.5 52H22.2L27.4 40.5H36.8L38.4 44.5H45.2L37.8 9H34.5ZM29.8 34.8L34.4 22.8L36.2 34.8H29.8Z"
        fill="url(#navAvSilver)"
      />
      <path
        d="M25 36.2H39.5L43.5 39.2L39.5 42.2H25V36.2Z"
        fill="url(#navAvGreen)"
      />
    </svg>
  );
}

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { enabled: soundEnabled, toggle: toggleSound } = useClockAudio();
  const {
    enabled: bgmEnabled,
    trackMode,
    isPlaying: bgmPlaying,
    volume: bgmVolume,
    customBgmName,
    toggle: toggleBgm,
    setTrackMode,
    setVolume,
    importCustomBgm,
    clearCustomBgm,
  } = useAvengersBgm();
  const activeTrack = BGM_TRACKS[trackMode] || BGM_TRACKS.primary;
  const [bgmUploadError, setBgmUploadError] = useState('');
  const audioMenuRef = useRef(null);

  const handleNavbarBgmUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBgmUploadError('');
    const res = await importCustomBgm(file);
    if (!res.ok) {
      setBgmUploadError(res.error || 'Unsupported file');
      setTimeout(() => setBgmUploadError(''), 3000);
    }
  };

  useEffect(() => {
    if (!audioMenuOpen) return;
    const onOutside = (e) => {
      if (audioMenuRef.current && !audioMenuRef.current.contains(e.target)) {
        setAudioMenuOpen(false);
      }
    };
    window.addEventListener('pointerdown', onOutside);
    return () => window.removeEventListener('pointerdown', onOutside);
  }, [audioMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec.offsetTop <= scrollPosition) {
          setActiveSection(sec.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      const headerOffset = 64;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-40 h-14 sm:h-[62px] transition-all duration-300 ${scrolled
          ? 'bg-[#050608]/[0.96] backdrop-blur-md border-b border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.85)]'
          : 'bg-[#060709]/85 backdrop-blur-sm border-b border-white/[0.05]'
        }`}
    >
      <div className="container-fluid container-xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2 sm:gap-4">

        {/* Left: Bespoke Avengers Emblem SVG + Crisp DOOMSDAY Wordmark Only */}
        <a
          href="#overview"
          onClick={(e) => scrollToSection(e, 'overview')}
          aria-label="Doomsday Home"
          className="inline-flex items-center gap-1.5 sm:gap-2.5 shrink-0 select-none group"
        >
          <AvengersEmblemSvg />
          <span className="text-[13px] xs:text-[14px] sm:text-[16px] font-cinematic font-black tracking-[0.16em] sm:tracking-[0.28em] text-metallic group-hover:brightness-110 uppercase whitespace-nowrap leading-none pt-0.5">
            DOOMSDAY
          </span>
        </a>

        {/* Center: Clean Editorial Single-Line Navigation (Zero AI Pill Boxes / No Wrapping) */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center h-full gap-4 lg:gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`relative h-full inline-flex items-center whitespace-nowrap text-[11px] lg:text-xs font-display tracking-[0.14em] uppercase transition-colors duration-200 ${isActive
                    ? 'text-white font-semibold'
                    : 'text-[#848A94] hover:text-[#E5E7EB] font-medium'
                  }`}
              >
                <span>{item.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#34D399] to-transparent shadow-[0_0_10px_rgba(52,211,153,0.75)]"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right: Minimalist Architectural Audio Rail + Studio Mixer Trigger */}
        <div className="flex items-center gap-1 sm:gap-2 relative shrink-0" ref={audioMenuRef}>
          <div className="h-8 sm:h-9 rounded-[4px] border border-white/[0.1] bg-[#0B0D12]/90 inline-flex items-center divide-x divide-white/[0.08] shadow-inner">
            {/* Website Countdown Clock Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={soundEnabled}
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute website countdown clock sound' : 'Enable website countdown clock sound'}
              title={`Website Timer Clock Sound (${soundEnabled ? 'ON' : 'OFF'} — Active on website countdown only, paused in game)`}
              className={`h-full px-2 sm:px-3 inline-flex items-center gap-1.5 text-[10px] font-mono tracking-[0.12em] uppercase cursor-pointer transition-colors whitespace-nowrap ${soundEnabled
                  ? 'text-[#4ADE80] bg-[#22C55E]/[0.07]'
                  : 'text-[#7B818C] hover:text-[#D1D5DB]'
                }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden xl:inline">{soundEnabled ? 'TICK ON' : 'CLOCK'}</span>
            </button>

            {/* Primary Avengers Score (BGM) Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={bgmEnabled}
              onClick={toggleBgm}
              aria-label={bgmEnabled ? 'Turn AVENGERS BGM Off' : 'Turn AVENGERS BGM On'}
              title={`AVENGERS BGM (${bgmEnabled ? 'ON' : 'OFF'}) — Click to toggle`}
              className={`h-full px-2 sm:px-3.5 inline-flex items-center gap-1.5 sm:gap-2 text-[9.5px] sm:text-[10px] font-mono tracking-[0.12em] sm:tracking-[0.14em] uppercase cursor-pointer transition-colors whitespace-nowrap ${bgmEnabled
                  ? 'text-white bg-[#22C55E]/[0.09]'
                  : 'text-[#7B818C] hover:text-[#E5E7EB]'
                }`}
            >
              <span className="inline-flex items-end gap-[2px] h-3 w-3 sm:w-3.5 justify-center" aria-hidden="true">
                {[0, 140, 260].map((delay, i) => (
                  <span
                    key={delay}
                    style={{
                      animationDelay: `${delay}ms`,
                      height: i === 1 ? '11px' : '7px',
                    }}
                    className={`w-[2px] rounded-full ${bgmEnabled && bgmPlaying
                        ? 'bgm-eq-bar bg-[#34D399]'
                        : bgmEnabled
                          ? 'bg-[#86EFAC]'
                          : 'bg-[#4B5563]'
                      }`}
                  />
                ))}
              </span>
              <span className="font-bold">BGM</span>
              <span
                className={`text-[8.5px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded-[2px] ${bgmEnabled
                    ? 'text-[#4ADE80] bg-[#14532D]/50'
                    : 'text-[#6B7280] bg-white/[0.04]'
                  }`}
              >
                {bgmEnabled ? (bgmPlaying ? 'LIVE' : 'ON') : 'OFF'}
              </span>
            </button>

            {/* Audio Settings Drawer Button */}
            <button
              type="button"
              onClick={() => setAudioMenuOpen((o) => !o)}
              aria-expanded={audioMenuOpen}
              aria-label="Open Studio Audio Options"
              title="Audio Deck: Switch Score Tracks, Master Volume & Clock SFX"
              className={`h-full px-2 sm:px-3 inline-flex items-center justify-center transition-colors cursor-pointer ${audioMenuOpen
                  ? 'bg-white/[0.1] text-white'
                  : 'text-[#848A94] hover:text-white'
                }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Studio Audio Settings Popover */}
          {audioMenuOpen && (
            <div className="absolute right-0 top-12 sm:top-14 w-72 sm:w-80 bg-[#0A0C10]/[0.98] backdrop-blur-xl border border-[#282F3C] rounded-[6px] shadow-[0_24px_70px_rgba(0,0,0,0.95)] p-4 z-50 text-left">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#1C2029]">
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#D1D5DB] uppercase inline-flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>STUDIO AUDIO DECK</span>
                </span>
                <span className="text-[9px] font-mono text-[#34D399] uppercase">
                  {customBgmName ? 'CUSTOM' : activeTrack.shortTag}
                </span>
              </div>

              {/* Tri-Source Built-In BGM Switcher */}
              <div className="space-y-1.5 mb-3.5">
                <span className="text-[9px] font-mono tracking-[0.18em] text-[#7C828D] uppercase block">
                  BACKGROUND SCORE
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {Object.values(BGM_TRACKS).map((trk) => {
                    const active = !customBgmName && trackMode === trk.id;
                    return (
                      <button
                        key={trk.id}
                        type="button"
                        onClick={() => setTrackMode(trk.id)}
                        className={`h-9 px-2 rounded-[3px] border text-[9.5px] font-display font-bold tracking-wider uppercase inline-flex items-center justify-center gap-1 transition-all cursor-pointer ${active
                            ? 'bg-[#F3F4F6] border-[#F3F4F6] text-[#08090B] shadow-sm'
                            : 'bg-[#101319] border-[#252B36] text-[#9CA3AF] hover:text-white hover:border-[#3D4554]'
                          }`}
                      >
                        {active && <Check className="w-3 h-3 text-[#16A34A] stroke-[3] shrink-0" />}
                        <span className="truncate">{trk.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Master Volume Level Fader */}
              <div className="mb-3.5 p-2.5 bg-[#0E1117] border border-[#1E242E] rounded-[3px]">
                <div className="flex items-center justify-between mb-1.5 text-[9px] font-mono uppercase">
                  <span className="text-[#8C9098] tracking-wider">MASTER GAIN</span>
                  <span className="text-[#34D399] font-bold">{Math.round((bgmVolume ?? 0.46) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  value={Math.round((bgmVolume ?? 0.46) * 100)}
                  onChange={(e) => setVolume(Number(e.target.value) / 100)}
                  aria-label="Background music volume"
                  className="w-full h-1.5 accent-[#22C55E] cursor-pointer bg-[#1F242E] rounded-lg"
                />
              </div>

              {/* Custom MP3/WAV Uploader & Reset */}
              <div className="flex items-center gap-1.5 mb-3.5">
                <label className="flex-1 h-9 px-3 bg-[#101319] hover:bg-[#171C25] border border-[#272D39] hover:border-[#34D399]/70 text-[#E5E7EB] hover:text-white rounded-[3px] text-[10px] font-mono font-semibold uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-1.5 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-[#34D399]" />
                  <span className="truncate">{customBgmName ? customBgmName : 'LOAD CUSTOM AUDIO'}</span>
                  <input
                    type="file"
                    accept="audio/*"
                    aria-label="Upload custom Avengers BGM audio file"
                    onChange={handleNavbarBgmUpload}
                    className="sr-only"
                  />
                </label>

                {customBgmName && (
                  <button
                    type="button"
                    onClick={() => clearCustomBgm()}
                    aria-label="Restore default BGM"
                    title="Restore default BGM track"
                    className="h-9 w-9 bg-[#101319] hover:bg-[#1C1214] border border-[#272D39] hover:border-[#DC2626] text-[#9CA3AF] hover:text-[#F87171] rounded-[3px] inline-flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {bgmUploadError && (
                <p className="text-[10px] font-mono text-[#F87171] mb-2">{bgmUploadError}</p>
              )}

              {/* Mechanical Timer Clock Tick SFX Row */}
              <div className="pt-2.5 border-t border-[#1C2029] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-[#6B7280]" />
                  )}
                  <span className="text-[10px] font-mono tracking-wider text-[#D1D5DB] uppercase">
                    Timer Clock SFX
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleSound}
                  className={`h-7 px-3 rounded-[3px] border text-[9px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors ${soundEnabled
                      ? 'bg-[#122619] border-[#22C55E]/70 text-[#4ADE80]'
                      : 'bg-[#12151B] border-[#282E3A] text-[#8E95A2] hover:text-white'
                    }`}
                >
                  {soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden w-9 h-9 flex items-center justify-center text-[#9CA3AF] hover:text-white transition-colors cursor-pointer select-none shrink-0"
          >
            {mobileMenuOpen ? (
              <span className="text-lg leading-none">✕</span>
            ) : (
              <div className="w-5 h-3.5 flex flex-col justify-between">
                <span className="w-full h-0.5 bg-current" />
                <span className="w-3/4 h-0.5 bg-current" />
                <span className="w-full h-0.5 bg-current" />
              </div>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 sm:top-[62px] bg-[#060709]/[0.98] border-b border-white/[0.08] p-4 shadow-2xl backdrop-blur-xl animate-fade-in z-50">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`flex items-center justify-between min-h-[44px] px-3.5 py-2 text-xs font-display tracking-[0.14em] uppercase transition-colors border-l-2 ${isActive
                      ? 'border-[#34D399] bg-white/[0.04] text-white font-semibold'
                      : 'border-transparent text-[#8C9098] hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-[#8C9098]" />
                    <span>{item.label}</span>
                  </div>
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
