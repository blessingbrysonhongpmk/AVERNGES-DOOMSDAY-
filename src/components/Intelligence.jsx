import React, { useState } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { CONFIG } from '../data/config.js';
import { clockAudio } from '../utils/audio.js';
import { FANVERSE_VIDEOS } from '../data/tamilFanverseData.js';
import TamilFanverseHero from './fanverse/TamilFanverseHero';
import DoomsdayAlertDeck from './fanverse/DoomsdayAlertDeck';
import TamilDubNostalgia from './fanverse/TamilDubNostalgia';
import CharacterFilesGrid from './fanverse/CharacterFilesGrid';
import MultiverseTimeline from './fanverse/MultiverseTimeline';
import FanTheoryLab from './fanverse/FanTheoryLab';
import FanZoneHub from './fanverse/FanZoneHub';
import TrailerCinemaModal from './fanverse/TrailerCinemaModal';

const ARCHIVE_TABS = [
  { id: 'timeline', label: 'MULTIVERSE CONNECTIONS' },
  { id: 'theories', label: 'FAN THEORY LAB' },
  { id: 'fanzone', label: 'TAMIL FAN ZONE' },
];

export default function Intelligence() {
  const { formatted } = useCountdown(CONFIG.release.targetIsoString);
  const [theaterVideo, setTheaterVideo] = useState(null);
  const [hubTab, setHubTab] = useState('timeline');

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
    if (elementId === 'fanverse-hub' || elementId === 'fanverse-fanzone') {
      setHubTab('fanzone');
    }
    const target = document.getElementById(elementId === 'fanverse-fanzone' ? 'fanverse-hub' : elementId);
    if (target) {
      const y = target.getBoundingClientRect().top + window.pageYOffset - 78;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="intelligence"
      aria-label="Tamil Fanverse — Multiverse Oru Tamil Vibe"
      className="relative z-10 py-8 sm:py-16 px-3 sm:px-6 lg:px-8 border-t border-white/[0.08] bg-[#090A0D]"
    >
      <div className="container-fluid container-xl mx-auto px-0 max-w-7xl">
        {/* Main Marvel Studios Style Hero Stage */}
        <TamilFanverseHero
          featuredVideo={FANVERSE_VIDEOS[0]}
          onPlayVideo={setTheaterVideo}
          formatted={formatted}
          onMarkCalendar={handleMarkCalendar}
          onJumpTo={jumpToModule}
        />

        {/* Official Tamil Trailers & Verified Briefing Dispatch */}
        <DoomsdayAlertDeck onOpenTrailer={setTheaterVideo} />

        {/* Marvel.com Style Horizontal Movie Shelf: Tamil Dub Nostalgia */}
        <TamilDubNostalgia />

        {/* Marvel.com Signature Chamfered Character Grid */}
        <CharacterFilesGrid />

        {/* Streamlined Interactive Hub: Timeline / Theory Desk / Tamil Fan Zone */}
        <div id="fanverse-hub" className="pt-6 border-t border-white/[0.1] scroll-mt-24">
          <div className="flex flex-wrap items-center gap-6 border-b border-white/[0.1] mb-8">
            {ARCHIVE_TABS.map((t) => {
              const active = hubTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch { }
                    setHubTab(t.id);
                  }}
                  className={`pb-3 text-sm sm:text-base font-hud font-extrabold tracking-[0.16em] uppercase border-b-[3px] -mb-[1px] cursor-pointer transition-colors ${active
                    ? 'border-[#E62429] text-white'
                    : 'border-transparent text-[#8C9098] hover:text-white'
                    }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          <div className={hubTab === 'timeline' ? 'block' : 'hidden'}>
            <MultiverseTimeline />
          </div>
          <div className={hubTab === 'theories' ? 'block' : 'hidden'}>
            <FanTheoryLab />
          </div>
          <div className={hubTab === 'fanzone' ? 'block' : 'hidden'}>
            <FanZoneHub />
          </div>
        </div>
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
