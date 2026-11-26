import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Home, Film, Users, Newspaper, Gamepad2, Upload, RotateCcw } from 'lucide-react';
import { useClockAudio } from '../utils/audio.js';
import { useAvengersBgm } from '../utils/bgm.js';

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
  const [scrolled, setScrolled] = useState(false);
  const { enabled: soundEnabled, toggle: toggleSound } = useClockAudio();
  const {
    enabled: bgmEnabled,
    isPlaying: bgmPlaying,
    customBgmName,
    toggle: toggleBgm,
    importCustomBgm,
    clearCustomBgm,
  } = useAvengersBgm();
  const [bgmUploadError, setBgmUploadError] = useState('');

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
            const Icon = item.icon;
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

        {/* Right: Luxury Avengers BGM Rocker Console, Clock Sound Toggle & Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Machined Brushed-Metal Avengers BGM ON/OFF Hardware Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={bgmEnabled}
            onClick={toggleBgm}
            aria-label={bgmEnabled ? 'Turn Avengers Background Music Off' : 'Turn Avengers Background Music On'}
            title={
              customBgmName
                ? `BGM: ${customBgmName} (Click to turn ${bgmEnabled ? 'OFF' : 'ON'})`
                : `Avengers Score BGM (Click to turn ${bgmEnabled ? 'OFF' : 'ON'})`
            }
            className={`group h-9 sm:h-10 pl-2.5 sm:pl-3 pr-1.5 rounded-[3px] border inline-flex items-center gap-2 sm:gap-3 transition-colors cursor-pointer select-none ${
              bgmEnabled
                ? 'bg-[#0C120F] border-[#264633] hover:border-[#34D399]/70 text-white'
                : 'bg-[#0B0D11] border-[#252A34] hover:border-[#3F4756] text-[#8E94A0]'
            }`}
          >
            {/* Studio Equalizer Bars */}
            <div className="flex items-end gap-[2px] h-3.5 shrink-0" aria-hidden="true">
              {[0, 140, 280, 90].map((delay, i) => (
                <span
                  key={delay}
                  style={{
                    animationDelay: `${delay}ms`,
                    height: i === 1 ? '14px' : i === 3 ? '12px' : i === 0 ? '9px' : '10px',
                  }}
                  className={`w-[2.5px] rounded-[1px] transition-colors ${
                    bgmEnabled && bgmPlaying
                      ? 'bgm-eq-bar bg-[#22C55E]'
                      : bgmEnabled
                        ? 'bg-[#D1D5DB] opacity-75'
                        : 'bg-[#3B4250] scale-y-[0.35]'
                  }`}
                />
              ))}
            </div>

            <div className="hidden xs:flex flex-col items-start text-left leading-none">
              <span className="text-[7.5px] font-mono tracking-[0.18em] text-[#8A909C] uppercase mb-0.5">
                {customBgmName ? 'CUSTOM SCORE' : 'AVENGERS BGM'}
              </span>
              <span className="text-[10px] font-display font-bold tracking-[0.12em] uppercase text-[#F3F4F6]">
                {bgmEnabled ? (bgmPlaying ? 'SCORE LIVE' : 'TAP TO PLAY') : 'SCORE OFF'}
              </span>
            </div>

            {/* Hardware Sliding ON / OFF Switch Housing */}
            <div
              className={`relative w-12 h-6 rounded-[2px] border p-0.5 flex items-center transition-colors ${
                bgmEnabled
                  ? 'bg-[#07140C] border-[#22C55E]/70 justify-end'
                  : 'bg-[#060709] border-[#2A303C] justify-start'
              }`}
            >
              <span
                className={`h-full px-1.5 rounded-[1px] text-[9px] font-mono font-extrabold tracking-wider uppercase inline-flex items-center justify-center transition-all ${
                  bgmEnabled
                    ? 'bg-[#F3F4F6] text-[#08090B] shadow-sm'
                    : 'bg-[#222733] text-[#9CA3AF]'
                }`}
              >
                {bgmEnabled ? 'ON' : 'OFF'}
              </span>
            </div>
          </button>

          {/* Load Custom Authorized MP3/WAV BGM Button */}
          <label
            title={
              bgmUploadError
                ? bgmUploadError
                : customBgmName
                  ? `Replace custom BGM (${customBgmName})`
                  : 'Load your own MP3 or WAV as sitewide Avengers BGM'
            }
            className="h-9 sm:h-10 px-2.5 bg-[#0D1015] hover:bg-[#171C25] border border-[#272D38] hover:border-[#34D399]/70 text-[#D1D5DB] hover:text-white rounded-[3px] transition-colors cursor-pointer inline-flex items-center gap-1.5 text-[9.5px] font-mono font-bold uppercase tracking-wider shrink-0"
          >
            <Upload className="w-3.5 h-3.5 text-[#34D399]" />
            <span className="hidden xl:inline">{bgmUploadError ? 'ERROR' : 'LOAD BGM'}</span>
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
              aria-label="Restore built-in Avengers BGM"
              title={`Restore built-in score (currently playing ${customBgmName})`}
              className="h-9 sm:h-10 w-9 sm:w-10 bg-[#0D1015] hover:bg-[#1B1214] border border-[#272D38] hover:border-[#DC2626]/70 text-[#9CA3AF] hover:text-[#F87171] rounded-[3px] transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Compact Clock Escapement SFX Button */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute live mechanical clock' : 'Unmute live mechanical clock'}
            className={`h-9 sm:h-10 px-2.5 text-[10px] font-mono tracking-wider transition-colors cursor-pointer inline-flex items-center gap-1.5 border rounded-[3px] ${
              soundEnabled
                ? 'border-[#2D3542] bg-[#12161E] text-[#F3F4F6] hover:border-[#4B5565]'
                : 'border-[#1E222B] bg-[#0B0D11] text-[#777A80] hover:text-white'
            }`}
            title={soundEnabled ? 'Clock Tick Sound: ON' : 'Clock Tick Sound: OFF'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#22C55E]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden lg:inline uppercase font-semibold">SFX</span>
          </button>

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
