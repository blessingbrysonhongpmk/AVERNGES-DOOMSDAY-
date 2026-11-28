import React, { useState, useRef } from 'react';
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
  { id: 'timeline', num: 'FILE 01', label: 'MULTIVERSE CONNECTIONS' },
  { id: 'theories', num: 'FILE 02', label: 'FAN THEORY LAB' },
  { id: 'fanzone', num: 'FILE 03', label: 'TAMIL FAN ZONE' },
];

export default function Intelligence() {
  const { formatted } = useCountdown(CONFIG.release.targetIsoString);
  const [theaterVideo, setTheaterVideo] = useState(null);
  const [hubTab, setHubTab] = useState('timeline');
  const projectorZoneRef = useRef(null);
  const projectorRafRef = useRef(null);

  const handleProjectorMove = (e) => {
    const el = projectorZoneRef.current;
    if (!el || window.matchMedia?.('(hover: none), (pointer: coarse)').matches) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    if (projectorRafRef.current) cancelAnimationFrame(projectorRafRef.current);
    projectorRafRef.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${x.toFixed(2)}%`);
      el.style.setProperty('--my', `${y.toFixed(2)}%`);
    });
  };

  const handleProjectorLeave = () => {
    const el = projectorZoneRef.current;
    if (!el) return;
    if (projectorRafRef.current) cancelAnimationFrame(projectorRafRef.current);
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '50%');
  };

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
      ref={projectorZoneRef}
      onMouseMove={handleProjectorMove}
      onMouseLeave={handleProjectorLeave}
      aria-label="Tamil Fanverse — Multiverse Oru Tamil Vibe"
      className="fanverse-zine fanverse-projector-zone relative z-10 py-8 sm:py-16 px-3 sm:px-6 lg:px-8 border-t border-white/[0.1] overflow-x-clip"
    >
      {/* Signature Warm Theatre Projector Light Cone (Hidden on Touch/Reduced Motion) */}
      <div className="fanverse-projector-beam" aria-hidden="true" />

      <div className="container-fluid container-xl mx-auto px-0 max-w-7xl relative z-10">
        {/* Main FDFS Zine Hero + Perforated Theatre Ticket Countdown */}
        <TamilFanverseHero
          featuredVideo={FANVERSE_VIDEOS[0]}
          onPlayVideo={setTheaterVideo}
          formatted={formatted}
          onMarkCalendar={handleMarkCalendar}
          onJumpTo={jumpToModule}
        />

        {/* Official Tamil Trailers & Stamped Briefing Dispatch (Structure Preserved) */}
        <DoomsdayAlertDeck onOpenTrailer={setTheaterVideo} />

        {/* Video-Store VHS Spine Wall + Cassette-Ticket Hybrid */}
        <TamilDubNostalgia />

        {/* Collector Trading Cards with Rarity Strips & 3D Foil Tilt */}
        <CharacterFilesGrid />

        {/* Folder Cut-Out Tabs: Film-Strip Timeline / Investigation Corkboard / Fan Wall */}
        <div id="fanverse-hub" className="pt-6 scroll-mt-24">
          <div className="flex flex-wrap items-end gap-2 sm:gap-3 border-b-2 border-[var(--marvel-red)] mb-7">
            {ARCHIVE_TABS.map((t, idx) => {
              const active = hubTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    try { clockAudio.tick(0); } catch { }
                    setHubTab(t.id);
                  }}
                  style={active ? undefined : { transform: `translateY(2px) rotate(${idx === 1 ? '0.6deg' : '-0.6deg'})` }}
                  className={`fan-folder-tab relative px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm fan-font-mono font-bold cursor-pointer transition-all ${
                    active
                      ? 'bg-[var(--paper)] text-[#141210] z-10 translate-y-0 border-t-4 border-[var(--marvel-red)] shadow-[3px_-2px_0_rgba(0,0,0,0.45)]'
                      : 'bg-[#13141B] hover:bg-[#1B1D27] text-[#B8B4AC] hover:text-[var(--ink)] border-t-2 border-white/15'
                  }`}
                >
                  <span className={`block text-[8.5px] leading-none mb-0.5 ${active ? 'text-[var(--marvel-red)]' : 'text-[#7C828E]'}`}>
                    {t.num}
                  </span>
                  <span>{t.label}</span>
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
