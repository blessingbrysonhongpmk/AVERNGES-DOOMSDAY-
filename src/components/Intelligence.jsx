import React, { useState } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { CONFIG } from '../data/config.js';
import { Calendar, ChevronRight, X, ExternalLink } from 'lucide-react';
import { clockAudio } from '../utils/audio.js';
import CinematicAtmosphere from './CinematicAtmosphere';

export default function Intelligence() {
  const { formatted } = useCountdown(CONFIG.release.targetIsoString);
  const [selectedNews, setSelectedNews] = useState(null);

  const handleMarkCalendar = () => {
    try { clockAudio.tick(0); } catch (e) { }
    const title = encodeURIComponent("Marvel Studios' Avengers: Doomsday Theatrical Premiere");
    const details = encodeURIComponent("Everything leads to Doomsday. The Multiverse war culminates in theaters worldwide.");
    const location = encodeURIComponent("Cinemas Worldwide");
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261218T000000Z/20261218T235959Z&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  const featuredArticle = {
    id: 'feat-01',
    badge: 'OFFICIAL',
    title: 'AVENGERS: DOOMSDAY BRINGS THE MULTIVERSE TOGETHER',
    subtitle: 'Marvel Studios unveils an epic new chapter uniting heroes across universes.',
    date: 'OFFICIAL ANNOUNCEMENT',
    image: '/doomsday-ensemble-poster.jpg',
    content: `Marvel Studios officially confirmed Avengers: Doomsday at San Diego Comic-Con Hall H. Directed by Anthony and Joe Russo (The Russo Brothers) with a screenplay by Stephen McFeely and an original musical score by Alan Silvestri.

Robert Downey Jr. makes his monumental return to the Marvel Cinematic Universe portraying Victor von Doom / Doctor Doom. Filming begins in spring 2025 at Pinewood Studios in the United Kingdom, leading directly into Avengers: Secret Wars.

The film unites the Avengers, Fantastic Four, Thunderbolts*, Guardians of the Galaxy, and Multiversal entities as incursions threaten infinite timelines with total collapse.`,
  };

  const newsItems = [
    {
      id: 'news-01',
      date: 'NOV 14, 2025',
      title: 'First Look at Doctor Doom',
      image: '/doctor-doom-portrait.jpg',
      content: 'Exclusive production insights and character design details for Robert Downey Jr.’s Victor von Doom. Marvel Studios confirms Doom is an authentic Latverian sovereign and multiversal conqueror, distinct from Tony Stark.',
    },
    {
      id: 'news-02',
      date: 'NOV 10, 2025',
      title: 'The Multiverse Expands',
      image: '/doomsday-ensemble-poster.jpg',
      content: 'Following the events of Deadpool & Wolverine, Fantastic Four: First Steps, and Loki Season 2, the Sacred Timeline faces severe incursion events where alternate universes collide, forcing unprecedented alliances.',
    },
    {
      id: 'news-03',
      date: 'NOV 05, 2025',
      title: 'Official Trailer Released',
      image: '/posters/infinity-war.webp',
      content: 'Marvel Studios debuts the worldwide theatrical teaser trailer for Avengers: Doomsday across IMAX and premium large formats, setting record-breaking viewership in its first 24 hours.',
    },
  ];

  return (
    <section
      id="intelligence"
      aria-label="Doomsday Intelligence Briefing"
      className="relative z-10 py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#07080A] overflow-hidden"
    >
      {/* Background Cinematic Atmosphere */}
      <CinematicAtmosphere
        poster="/doctor-doom-stained-glass.jpg"
        overlayOpacity="bg-[#07080A]/92"
        accentGlow="emerald"
      />

      <div className="container-fluid container-xl mx-auto px-0 relative z-10">

        {/* ── SECTION HEADER (Matching Image 4) ── */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-cinematic font-black tracking-tight text-white uppercase mb-1">
            DOOMSDAY INTELLIGENCE
          </h2>
          <p className="text-xs sm:text-sm font-mono tracking-widest text-[#8C9098] uppercase">
            STAY UPDATED. STAY AHEAD.
          </p>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            3-COLUMN CINEMATIC INTELLIGENCE GRID (Matching Image 4)
            - Column 1: Featured Announcement Card [OFFICIAL] + [READ MORE ->]
            - Column 2: 3 News Items (Nov 14, Nov 10, Nov 05) with Thumbnails
            - Column 3: The Final Countdown (18 DECEMBER 2026 + MARK YOUR CALENDAR)
           ═════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">

          {/* ── COLUMN 1 (Left): FEATURED OFFICIAL ARTICLE CARD ── */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="h-full border border-[#1E252D] hover:border-[#22C55E]/40 bg-[#0E1015] rounded-xs overflow-hidden relative group flex flex-col justify-between shadow-2xl transition-all duration-300">
              {/* Image visual */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden shrink-0">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106 filter brightness-90 group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1015] via-[#0E1015]/40 to-transparent" />

                {/* Red OFFICIAL Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#E62429] text-white text-[9px] font-mono font-black tracking-widest px-2.5 py-1 uppercase rounded-xs shadow">
                    {featuredArticle.badge}
                  </span>
                </div>
              </div>

              {/* Content text */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-cinematic font-bold text-white uppercase leading-snug mb-2 group-hover:text-[#22C55E] transition-colors">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-xs font-body text-[#9CA3AF] leading-relaxed mb-4">
                    {featuredArticle.subtitle}
                  </p>
                </div>

                {/* READ MORE Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedNews(featuredArticle);
                      try { clockAudio.tick(0); } catch (e) { }
                    }}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#12141A] hover:bg-[#22C55E] text-white hover:text-black border border-[#22C55E]/40 hover:border-[#22C55E] text-[10px] font-mono font-bold tracking-wider uppercase rounded-xs transition-all cursor-pointer shadow-sm"
                  >
                    <span>READ MORE</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── COLUMN 2 (Center): 3 NEWS ITEMS WITH THUMBNAILS ── */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-3">
            {newsItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedNews(item);
                  try { clockAudio.tick(0); } catch (e) { }
                }}
                className="flex-1 p-3 border border-[#1E252D] hover:border-[#22C55E]/50 bg-[#0E1015] hover:bg-[#12151C] rounded-xs cursor-pointer group transition-all duration-200 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-11 h-14 object-cover border border-[#232731] rounded-xs shrink-0 filter brightness-85 group-hover:brightness-100 transition-all"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] font-mono text-[#8C9098] uppercase block mb-1">
                      {item.date}
                    </span>
                    <h4 className="text-xs font-cinematic font-bold text-white uppercase truncate group-hover:text-[#22C55E] transition-colors">
                      {item.title}
                    </h4>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#8C9098] group-hover:text-[#22C55E] shrink-0 transition-transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>

          {/* ── COLUMN 3 (Right): THE FINAL COUNTDOWN MONOLITH ── */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="h-full border border-[#232934] bg-[#090B0E] p-5 sm:p-6 rounded-xs relative overflow-hidden flex flex-col justify-between shadow-2xl">

              {/* Background Doctor Doom Portal Artwork with matte vignette */}
              <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <img
                  src="/doctor-doom-stained-glass.jpg"
                  alt="Doctor Doom Portal"
                  className="w-full h-full object-cover filter brightness-65 contrast-120"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E] via-[#090B0E]/45 to-[#090B0E]" />
              </div>

              {/* Content Deck */}
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-2 px-2.5 py-0.5 border border-[#26302B] bg-[#0E1311] text-[9px] font-mono tracking-[0.22em] text-[#9CA3AF] uppercase rounded-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34D399] shrink-0" />
                  <span>THE FINAL COUNTDOWN</span>
                </div>

                <p className="text-[11px] font-mono tracking-widest text-[#8C9098] uppercase mb-1">
                  ONE DESTINATION. ONE DATE.
                </p>

                {/* Metallic Platinum Date Display */}
                <div className="text-2xl xs:text-3xl sm:text-4xl font-cinematic font-black text-metallic tracking-wider my-3">
                  18 DECEMBER 2026
                </div>

                {/* Live Countdown Display */}
                <div className="grid grid-cols-4 gap-2 mb-4 p-2.5 bg-[#060709]/85 border border-[#1E242D] rounded-xs text-center">
                  <div>
                    <span className="text-sm font-sans font-bold text-white block tabular-nums">{formatted.months}</span>
                    <span className="text-[7px] font-mono text-[#8C9098] uppercase">MONTHS</span>
                  </div>
                  <div>
                    <span className="text-sm font-sans font-bold text-white block tabular-nums">{formatted.days}</span>
                    <span className="text-[7px] font-mono text-[#8C9098] uppercase">DAYS</span>
                  </div>
                  <div>
                    <span className="text-sm font-sans font-bold text-white block tabular-nums">{formatted.hours}</span>
                    <span className="text-[7px] font-mono text-[#8C9098] uppercase">HOURS</span>
                  </div>
                  <div>
                    <span className="text-sm font-sans font-bold text-[#34D399] block tabular-nums">{formatted.seconds}</span>
                    <span className="text-[7px] font-mono text-[#34D399] uppercase">SECS</span>
                  </div>
                </div>
              </div>

              {/* Mark Your Calendar Action Button */}
              <div className="relative z-10 pt-2 border-t border-[#1C2027]">
                <button
                  type="button"
                  onClick={handleMarkCalendar}
                  className="w-full py-2.5 px-4 border border-[#2C3440] hover:border-[#34D399] bg-[#101318] hover:bg-[#141A18] text-white text-[11px] font-mono font-bold tracking-[0.2em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer rounded-xs"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>MARK YOUR CALENDAR</span>
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ── INTEL DETAIL MODAL ── */}
      {selectedNews && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="relative w-full max-w-lg bg-[#0C0E14] border border-[#1E252D] rounded-xs p-6 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedNews(null)}
              className="absolute top-4 right-4 text-[#8C9098] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[9px] font-mono text-[#22C55E] uppercase block mb-1 font-bold">
              {selectedNews.date}
            </span>

            <h3 className="text-lg sm:text-xl font-cinematic font-bold text-white uppercase mb-3 pr-6">
              {selectedNews.title}
            </h3>

            <p className="text-xs sm:text-sm font-body text-[#9CA3AF] leading-relaxed whitespace-pre-line mb-6">
              {selectedNews.content}
            </p>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="px-4 py-1.5 bg-[#14171F] hover:bg-white text-white hover:text-black text-xs font-mono font-bold uppercase transition-colors rounded-xs"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
