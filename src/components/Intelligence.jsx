import React, { useState } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { CONFIG } from '../data/config.js';
import { clockAudio } from '../utils/audio.js';
import CinematicAtmosphere from './CinematicAtmosphere';
import { FANVERSE_VIDEOS } from '../data/tamilFanverseData.js';
import TamilFanverseHero from './fanverse/TamilFanverseHero';
import DoomsdayAlertDeck from './fanverse/DoomsdayAlertDeck';
import TamilDubNostalgia from './fanverse/TamilDubNostalgia';
import CharacterFilesGrid from './fanverse/CharacterFilesGrid';
import MultiverseTimeline from './fanverse/MultiverseTimeline';
import FanTheoryLab from './fanverse/FanTheoryLab';
import FanZoneHub from './fanverse/FanZoneHub';
import TrailerCinemaModal from './fanverse/TrailerCinemaModal';

const MODULE_LINKS = [
  { id: 'fanverse-alert', code: '01', label: 'DOOMSDAY ALERT' },
  { id: 'fanverse-dubs', code: '02', label: 'TAMIL DUB NOSTALGIA' },
  { id: 'fanverse-characters', code: '03', label: 'CHARACTER FILES' },
  { id: 'fanverse-timeline', code: '04', label: 'MULTIVERSE TIMELINE' },
  { id: 'fanverse-theories', code: '05', label: 'FAN THEORY LAB' },
  { id: 'fanverse-fanzone', code: '06', label: 'FAN ZONE' },
];

export default function Intelligence() {
  const { formatted } = useCountdown(CONFIG.release.targetIsoString);
  const [theaterVideo, setTheaterVideo] = useState(null);

  const handleMarkCalendar = () => {
    try { clockAudio.tick(0); } catch { }
    const title = encodeURIComponent("Marvel Studios' Avengers: Doomsday Theatrical Premiere");
    const details = encodeURIComponent('Everything leads to Doomsday. The Multiverse war culminates in theaters worldwide.');
    const location = encodeURIComponent('Cinemas Worldwide');
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261218T000000Z/20261218T235959Z&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');
  };

  const jumpToModule = (elementId) => {
    try { clockAudio.tick(0); } catch { }
    const target = document.getElementById(elementId);
    if (target) {
      const y = target.getBoundingClientRect().top + window.pageYOffset - 78;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="intelligence"
      aria-label="Tamil Fanverse — Multiverse Oru Tamil Vibe"
      className="relative z-10 py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#06070A] overflow-hidden"
    >
      {/* Subtle Background Cinema Atmosphere */}
      <CinematicAtmosphere
        poster="/doctor-doom-stained-glass.jpg"
        overlayOpacity="bg-[#06070A]/[0.94]"
        accentGlow="emerald"
      />

      <div className="container-fluid container-xl mx-auto px-0 relative z-10 max-w-7xl">
        {/* Main Tamil Fanverse Hero + Featured Doom Visual + Final Countdown Stub */}
        <TamilFanverseHero
          featuredVideo={FANVERSE_VIDEOS[0]}
          onPlayVideo={setTheaterVideo}
          formatted={formatted}
          onMarkCalendar={handleMarkCalendar}
          onJumpTo={jumpToModule}
        />

        {/* Quick Headquarters Section Jump Rail */}
        <nav
          aria-label="Tamil Fanverse Modules"
          className="mb-10 sm:mb-12 flex flex-wrap items-center gap-2 p-2 border border-white/[0.08] bg-[#090B10]/90 rounded-[3px]"
        >
          {MODULE_LINKS.map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => jumpToModule(mod.id)}
              className="px-3 py-1.5 border border-white/[0.07] hover:border-[#22C55E]/60 bg-[#0D1017] hover:bg-[#0E1912] text-[#C8CDD6] hover:text-white rounded-[2px] text-[9.5px] font-mono font-bold tracking-[0.14em] uppercase inline-flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span className="text-[#22C55E]">{mod.code}</span>
              <span>{mod.label}</span>
            </button>
          ))}
        </nav>

        {/* B. Doomsday Alert (5 Official IndiaMarvel Tamil Videos + Verified Facts vs Theory) */}
        <DoomsdayAlertDeck onOpenTrailer={setTheaterVideo} />

        {/* A. Tamil Dub Nostalgia ("Namma Tamil Dub Memories") */}
        <TamilDubNostalgia />

        {/* C. Character Files (8 Iconic Interactive Dossiers) */}
        <CharacterFilesGrid />

        {/* D. Multiverse Connections Interactive Timeline */}
        <MultiverseTimeline />

        {/* E. Fan Theory Lab (Strictly Unconfirmed Speculation) */}
        <FanTheoryLab />

        {/* F. Interactive Tamil Fan Zone (Polls, Dream Squad 5, Guess Hero, Trivia) */}
        <FanZoneHub />
      </div>

      {/* Widescreen YouTube Tamil Screening Modal */}
      <TrailerCinemaModal
        videos={FANVERSE_VIDEOS}
        activeVideo={theaterVideo}
        onSelectVideo={setTheaterVideo}
        onClose={() => setTheaterVideo(null)}
      />
    </section>
  );
}
