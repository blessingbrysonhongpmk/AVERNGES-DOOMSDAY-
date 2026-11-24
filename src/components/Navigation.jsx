import React, { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'characters', label: 'CHARACTERS' },
  { id: 'watchlist', label: 'ROAD TO DOOMSDAY' },
  { id: 'trailers', label: 'ARCHIVE' },
  { id: 'final-countdown', label: 'COUNTDOWN' },
];

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      // ScrollSpy: identify active section in viewport
      const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 180;

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
          ? 'bg-[#08090B]/95 backdrop-blur-md border-b border-[#1E2024] shadow-lg'
          : 'bg-[#08090B]/85 backdrop-blur-sm border-b border-[#1E2024]/60'
      }`}
    >
      <div className="container-fluid container-xl mx-auto px-3 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <a
          href="#overview"
          onClick={(e) => scrollToSection(e, 'overview')}
          className="text-xs xs:text-sm font-cinematic font-bold tracking-[0.14em] sm:tracking-[0.2em] text-[#F5F5F5] hover:text-white uppercase transition-colors select-none flex items-center gap-2 truncate"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#E62429] shrink-0" />
          <span className="truncate">AVENGERS: DOOMSDAY</span>
        </a>

        {/* Center / Right: Desktop Cinematic Navigation */}
        <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-5 xl:gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`relative py-1 text-[11px] font-mono tracking-[0.16em] uppercase transition-colors duration-200 ${
                  isActive ? 'text-white font-semibold' : 'text-[#777A80] hover:text-[#D8D9DC]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E62429] animate-fade-in" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Hamburger Button (Accessible 44x44px touch area) */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-[#777A80] hover:text-white transition-colors cursor-pointer select-none"
        >
          {mobileMenuOpen ? (
            <span className="text-xl leading-none">✕</span>
          ) : (
            <div className="w-5 h-3.5 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-current" />
              <span className="w-3/4 h-0.5 bg-current" />
              <span className="w-full h-0.5 bg-current" />
            </div>
          )}
        </button>

      </div>

      {/* Mobile Drawer Menu (Responsive full-width touch panel) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-13 bg-[#08090B]/98 border-b border-[#1E2024] p-5 shadow-2xl backdrop-blur-xl animate-fade-in z-50">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`flex items-center justify-between min-h-[44px] px-3 py-2 text-xs font-mono tracking-[0.2em] uppercase transition-colors border-b border-[#1E2024]/40 ${
                    isActive ? 'text-[#E62429] font-bold bg-[#111216]' : 'text-[#777A80] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="text-[10px]">●</span>}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
