import React, { useState, useEffect } from 'react';
import { ThumbsUp, HelpCircle } from 'lucide-react';
import { FAN_THEORIES } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

const THEORY_VOTES_KEY = 'doomsday_fanverse_theory_votes_v1';

const CONFIDENCE_STAMPS = {
  'doom-earth-origin': { label: 'LIKELY', cls: 'text-[#1E3A8A] border-[#2F5BEA] -rotate-6' },
  'multiverse-collapse': { label: 'CONFIRMED', cls: 'text-[#065F46] border-[#059669] rotate-3' },
  'old-heroes-return': { label: 'LIKELY', cls: 'text-[#1E3A8A] border-[#2F5BEA] rotate-2' },
  'stark-anchor-theory': { label: 'WILD', cls: 'text-[#991B1B] border-[#E4262C] -rotate-3' },
};

export default function FanTheoryLab() {
  const [userVotes, setUserVotes] = useState(() => {
    if (typeof window === 'undefined' || !window.localStorage) return {};
    try {
      return JSON.parse(window.localStorage.getItem(THEORY_VOTES_KEY) || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(THEORY_VOTES_KEY, JSON.stringify(userVotes));
    } catch {}
  }, [userVotes]);

  const castVote = (theoryId, choice) => {
    try { clockAudio.tick(0); } catch {}
    setUserVotes((prev) => ({
      ...prev,
      [theoryId]: prev[theoryId] === choice ? null : choice,
    }));
  };

  return (
    <div id="fanverse-theories" className="scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
        <div>
          <span className="text-[10.5px] fan-font-mono font-bold text-[var(--gold-foil)] block mb-0.5">
            DETECTIVE INVESTIGATION CORKBOARD // SPECULATION DESK
          </span>
          <h4 className="text-2xl sm:text-3xl fan-font-flex text-[var(--ink)] uppercase leading-none">
            FAN THEORY LAB
          </h4>
        </div>
        <span className="fan-rubber-stamp text-[9px] text-[#FCD34D] border-[#D9B45B] -rotate-1">
          NOTE: ALL ITEMS LABELED AS UNCONFIRMED FAN THEORY
        </span>
      </div>

      {/* Investigation Corkboard with SVG Red String Connectors */}
      <div className="fan-corkboard relative border-2 border-[#3C2B1E] p-4 sm:p-7 shadow-[inset_0_0_50px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Animated Red Investigation String Network (Desktop Corkboard) */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-0"
        >
          <path
            d="M 245 48 C 380 120, 620 20, 755 52 L 245 290 C 460 320, 580 250, 755 292"
            fill="none"
            stroke="#E4262C"
            strokeWidth="2.5"
            className="fan-red-string-path"
          />
          <path
            d="M 245 48 L 245 290 M 755 52 L 755 292"
            fill="none"
            stroke="rgba(228,38,44,0.65)"
            strokeWidth="1.8"
            className="fan-red-string-path"
          />
        </svg>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {FAN_THEORIES.map((th, idx) => {
            const picked = userVotes[th.id] || null;
            const yesCount = th.defaultVotesYes + (picked === 'yes' ? 1 : 0);
            const doubtCount = th.defaultVotesDoubt + (picked === 'doubt' ? 1 : 0);
            const total = yesCount + doubtCount;
            const yesPct = Math.round((yesCount / total) * 100);
            const conf = CONFIDENCE_STAMPS[th.id] || {
              label: idx % 2 === 0 ? 'LIKELY' : 'WILD',
              cls: 'text-[#1E3A8A] border-[#2F5BEA] -rotate-3',
            };
            const tiltCls = idx % 2 === 0 ? 'md:-rotate-1 hover:rotate-0' : 'md:rotate-1 hover:rotate-0';

            return (
              <div
                key={th.id}
                className={`fan-paper-surface relative p-5 pt-7 border border-[#151412] flex flex-col justify-between gap-4 transition-transform duration-200 ${tiltCls}`}
              >
                {/* Masking Tape Strip + Red Pushpin */}
                <img
                  src="/textures/tape-piece.svg"
                  alt=""
                  width={120}
                  height={36}
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-7 opacity-90"
                />
                <span
                  aria-hidden="true"
                  className="w-3.5 h-3.5 rounded-full bg-[var(--marvel-red)] border-2 border-black shadow-md absolute top-2 left-1/2 -translate-x-1/2"
                />

                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <span className="px-2 py-0.5 bg-[#151412] text-[#FCD34D] text-[8.5px] fan-font-mono font-bold">
                      FAN THEORY
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] fan-font-mono text-[#4B463D] font-bold">
                        {th.evidenceTag}
                      </span>
                      <span className={`fan-rubber-stamp text-[8.5px] px-2 py-0.5 ${conf.cls}`}>
                        {conf.label}
                      </span>
                    </div>
                  </div>

                  <h5 className="text-xl sm:text-2xl fan-font-flex text-[#11100E] uppercase leading-none mb-1.5">
                    {th.title}
                  </h5>
                  <p className="text-xs fan-font-note font-bold text-[#7C2D12] text-base mb-1.5">
                    {th.questionHook}
                  </p>
                  <p className="text-xs sm:text-sm fan-font-body text-[#26231F]">
                    {th.tanglishBody}
                  </p>
                </div>

                <div className="pt-3 border-t border-dashed border-[#151412]/35 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => castVote(th.id, 'yes')}
                      className={`fan-btn-tactile px-3 py-1.5 border-2 text-[10px] fan-font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                        picked === 'yes'
                          ? 'border-[#151412] bg-[#065F46] text-white'
                          : 'border-[#151412] bg-[#DDD4BE] hover:bg-[#CFC4AA] text-[#151412]'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>MASS THEORY ({yesCount})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => castVote(th.id, 'doubt')}
                      className={`fan-btn-tactile px-3 py-1.5 border-2 text-[10px] fan-font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                        picked === 'doubt'
                          ? 'border-[#151412] bg-[var(--marvel-red)] text-white'
                          : 'border-[#151412] bg-[#DDD4BE] hover:bg-[#CFC4AA] text-[#151412]'
                      }`}
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>DOUBT ({doubtCount})</span>
                    </button>
                  </div>

                  <span className="text-[10px] fan-font-mono font-bold text-[#151412]">
                    {yesPct}% AGREE
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
