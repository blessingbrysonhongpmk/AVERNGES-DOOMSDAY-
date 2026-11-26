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
} from 'lucide-react';
import { useClockAudio } from '../utils/audio.js';
import { useAvengersBgm, BGM_TRACKS } from '../utils/bgm.js';

const NAV_ITEMS = [
  { id: 'overview', label: 'Home', icon: Home },
  { id: 'watchlist', label: 'Road to Doomsday', icon: Film },
  { id: 'characters', label: 'Character Database', icon: Users },
  { id: 'intelligence', label: 'Doomsday Intelligence', icon: Newspaper },
  { id: 'game-mayhem', label: 'Game Zone', icon: Gamepad2 },
];

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
    customBgmName,
    toggle: toggleBgm,
    setTrackMode,
    importCustomBgm,
    clearCustomBgm,
  } = useAvengersBgm();
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

  // Close Studio Audio Drawer when clicking outside
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
      const headerOffset = 60;
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
      className={`sticky top-0 left-0 right-0 z-40 h-13 sm:h-14 transition-all duration-300 ${
        scrolled
          ? 'bg-[#060709]/95 backdrop-blur-md border-b border-[#1E2024] shadow-xl'
          : 'bg-[#060709]/80 backdrop-blur-sm border-b border-[#1E2024]/60'
      }`}
    >
      <div className="container-fluid container-xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between">

        {/* Left: Brand Monogram Identity */}
        <a
          href="#overview"
          onClick={(e) => scrollToSection(e, 'overview')}
          className="text-xs xs:text-sm font-cinematic font-bold tracking-[0.14em] sm:tracking-[0.18em] text-[#F5F5F5] hover:text-white uppercase transition-colors select-none flex items-center gap-2 truncate group"
        >
          <span className="w-5 h-5 rounded-full bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[10px] text-[#22C55E] group-hover:shadow-[0_0_10px_rgba(34,197,94,0.6)] shrink-0 font-bold">
            A
          </span>
          <span className="truncate">AVENGERS: DOOMSDAY</span>
        </a>

        {/* Center: Desktop Cinematic Navigation Tabs */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`relative px-3 py-1.5 text-xs font-mono transition-all duration-200 flex items-center gap-1.5 rounded-xs ${
                  isActive
                    ? 'text-white font-semibold bg-[#111318] border border-[#232630] shadow-sm'
                    : 'text-[#8C9098] hover:text-white hover:bg-[#0D0E12]'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.9)] shrink-0" />
                )}
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Right: Single Milled-Titanium BGM Capsule Console + Mobile Drawer */}
        <div className="flex items-center gap-2 relative" ref={audioMenuRef}>
          {/* Unified Luxury Audio Pill Capsule */}
          <div
            style={{
              background: 'linear-gradient(180deg, #161920 0%, #0A0C10 100%)',
            }}
            className={`h-9 sm:h-10 rounded-full border inline-flex items-center overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.10),0_6px_20px_rgba(0,0,0,0.65)] transition-colors ${
              bgmEnabled
                ? 'border-[#2D4D3B] hover:border-[#34D399]/75'
                : 'border-[#282D38] hover:border-[#424B5C]'
            }`}
          >
            {/* Primary Hardware Toggle (ON / OFF) */}
            <button
              type="button"
              role="switch"
              aria-checked={bgmEnabled}
              onClick={toggleBgm}
              aria-label={bgmEnabled ? 'Turn Background Music Off' : 'Turn Background Music On'}
              title={`AVENGERS BGM (${bgmEnabled ? 'ON' : 'OFF'}) — Click to toggle`}
              className="h-full pl-2 pr-2.5 sm:pl-2.5 sm:pr-3 inline-flex items-center gap-2.5 cursor-pointer select-none group focus:outline-none"
            >
              {/* Recessed Circular Waveform Gauge */}
              <span
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border flex items-end justify-center gap-[2px] pb-1.5 px-1 shrink-0 transition-colors ${
                  bgmEnabled
                    ? 'bg-[#07110B] border-[#22C55E]/50'
                    : 'bg-[#07080B] border-[#222731]'
                }`}
                aria-hidden="true"
              >
                {[0, 140, 260, 80, 190].map((delay, i) => (
                  <span
                    key={delay}
                    style={{
                      animationDelay: `${delay}ms`,
                      height: i === 2 ? '11px' : i % 2 === 1 ? '9px' : '6px',
                    }}
                    className={`w-[1.8px] rounded-full transition-colors ${
                      bgmEnabled && bgmPlaying
                        ? 'bgm-eq-bar bg-[#34D399]'
                        : bgmEnabled
                          ? 'bg-[#D1D5DB]/80'
                          : 'bg-[#3C4352] scale-y-[0.35]'
                    }`}
                  />
                ))}
              </span>

              {/* Clean Studio Track Label */}
              <div className="hidden xs:flex flex-col items-start text-left leading-none">
                <span className="text-[7.5px] font-mono tracking-[0.2em] text-[#8B92A0] uppercase mb-0.5">
                  AVENGERS BGM
                </span>
                <span className="text-[10px] font-display font-bold tracking-[0.14em] uppercase text-[#F4F5F7]">
                  {bgmEnabled ? (bgmPlaying ? 'LIVE' : 'READY') : 'MUTED'}
                </span>
              </div>

              {/* Smooth Gliding Machined Rocker Pill */}
              <span
                className={`relative w-12 sm:w-14 h-6 rounded-full border p-0.5 flex items-center transition-colors duration-200 shadow-[inset_0_2px_5px_rgba(0,0,0,0.85)] ${
                  bgmEnabled
                    ? 'bg-[#0A2214] border-[#22C55E]/65'
                    : 'bg-[#06070A] border-[#242934]'
                }`}
              >
                <span
                  className={`text-[7.5px] font-mono font-extrabold tracking-wider uppercase absolute transition-opacity duration-200 ${
                    bgmEnabled ? 'left-1.5 text-[#4ADE80] opacity-100' : 'opacity-0'
                  }`}
                >
                  ON
                </span>
                <span
                  className={`text-[7.5px] font-mono font-bold tracking-wider uppercase absolute right-1.5 transition-opacity duration-200 ${
                    !bgmEnabled ? 'text-[#6B7280] opacity-100' : 'opacity-0'
                  }`}
                >
                  OFF
                </span>

                <span
                  className={`w-5 h-4.5 rounded-full flex items-center justify-center transition-transform duration-200 shadow-md ${
                    bgmEnabled
                      ? 'translate-x-5.5 sm:translate-x-7.5 bg-[#F8FAFC]'
                      : 'translate-x-0 bg-[#2C323F]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      bgmEnabled ? 'bg-[#16A34A]' : 'bg-[#64748B]'
                    }`}
                  />
                </span>
              </span>
            </button>

            {/* Hairline Steel Divider + Studio Audio Drawer Trigger */}
            <span className="w-px h-5 bg-[#242A35]" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setAudioMenuOpen((o) => !o)}
              aria-expanded={audioMenuOpen}
              aria-label="Open Studio Audio Options"
              title="Audio Options: Switch Theme, Load Custom Audio & Clock SFX"
              className={`h-full px-2.5 sm:px-3 inline-flex items-center justify-center transition-colors cursor-pointer ${
                audioMenuOpen
                  ? 'bg-[#1D232E] text-white'
                  : 'text-[#8E95A2] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Studio Audio Settings Popover */}
          {audioMenuOpen && (
            <div className="absolute right-0 top-12 sm:top-13 w-72 sm:w-80 bg-[#0A0C10]/98 backdrop-blur-xl border border-[#282F3C] rounded-[6px] shadow-[0_24px_60px_rgba(0,0,0,0.92)] p-4 z-50 text-left">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#1C2029]">
                <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#D1D5DB] uppercase inline-flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>STUDIO AUDIO DECK</span>
                </span>
                <span className="text-[9px] font-mono text-[#6B7280] uppercase">
                  {customBgmName ? 'CUSTOM' : trackMode === 'primary' ? 'TRACK I' : 'TRACK II'}
                </span>
              </div>

              {/* Dual Built-In BGM Source Selector */}
              <div className="space-y-1.5 mb-3.5">
                <span className="text-[9px] font-mono tracking-[0.18em] text-[#7C828D] uppercase block">
                  BACKGROUND TRACK
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {Object.values(BGM_TRACKS).map((trk) => {
                    const active = !customBgmName && trackMode === trk.id;
                    return (
                      <button
                        key={trk.id}
                        type="button"
                        onClick={() => setTrackMode(trk.id)}
                        className={`h-9 px-2.5 rounded-[3px] border text-[10px] font-display font-bold tracking-wider uppercase inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#F3F4F6] border-[#F3F4F6] text-[#08090B]'
                            : 'bg-[#101319] border-[#252B36] text-[#9CA3AF] hover:text-white hover:border-[#3D4554]'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 text-[#16A34A] stroke-[3]" />}
                        <span className="truncate">{trk.label}</span>
                      </button>
                    );
                  })}
                </div>
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

              {/* Mechanical Clock Tick SFX Row */}
              <div className="pt-2.5 border-t border-[#1C2029] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5 text-[#6B7280]" />
                  )}
                  <span className="text-[10px] font-mono tracking-wider text-[#D1D5DB] uppercase">
                    Clock Tick SFX
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleSound}
                  className={`h-7 px-3 rounded-full border text-[9px] font-mono font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                    soundEnabled
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
            className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center text-[#777A80] hover:text-white transition-colors cursor-pointer select-none"
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
        <div className="md:hidden fixed inset-x-0 top-13 bg-[#08090B]/98 border-b border-[#1E2024] p-4 shadow-2xl backdrop-blur-xl animate-fade-in z-50">
          <nav className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`flex items-center justify-between min-h-[44px] px-3.5 py-2 text-xs font-mono tracking-wider uppercase transition-colors border rounded-xs ${
                    isActive
                      ? 'border-[#22C55E]/50 bg-[#22C55E]/10 text-white font-bold'
                      : 'border-transparent text-[#8C9098] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#8C9098]" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.9)]" />
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
