import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Home, Film, Users, Clock } from 'lucide-react';
import { useClockAudio } from '../utils/audio.js';

const NAV_ITEMS = [
  { id: 'overview', label: 'Home', icon: Home },
  { id: 'watchlist', label: 'Road to Doomsday', icon: Film },
  { id: 'characters', label: 'Character Database', icon: Users },
  { id: 'final-countdown', label: 'The Final Countdown', icon: Clock },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { enabled: soundEnabled, toggle: toggleSound } = useClockAudio();

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

        {/* Right: Sound Toggle & Mobile Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle Button (Matching top right sound button in reference image) */}
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute live mechanical clock' : 'Unmute live mechanical clock'}
            className={`px-2.5 py-1 text-[11px] font-mono tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border rounded-xs ${
              soundEnabled
                ? 'border-[#22C55E]/60 bg-[#22C55E]/15 text-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                : 'border-[#1E2024] bg-[#111216]/80 text-[#777A80] hover:text-white'
            }`}
            title="Toggle live sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline text-[9px] uppercase font-bold">
              {soundEnabled ? 'SOUND: ON' : 'SOUND: OFF'}
            </span>
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
