import React, { useState, useEffect } from 'react';
import { ThumbsUp, HelpCircle } from 'lucide-react';
import { FAN_THEORIES } from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

const THEORY_VOTES_KEY = 'doomsday_fanverse_theory_votes_v1';

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
          <span className="text-[10.5px] font-hud font-bold tracking-[0.24em] text-[#F59E0B] uppercase block mb-0.5">
            UNCONFIRMED MULTIVERSE SPECULATION DESK
          </span>
          <h4 className="text-xl sm:text-2xl font-hud font-extrabold text-white uppercase tracking-wide">
            FAN THEORY LAB
          </h4>
        </div>
        <span className="text-[9.5px] font-mono text-[#FCD34D] uppercase tracking-wider">
          NOTE: ALL ITEMS LABELED AS UNCONFIRMED FAN THEORY
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FAN_THEORIES.map((th) => {
          const picked = userVotes[th.id] || null;
          const yesCount = th.defaultVotesYes + (picked === 'yes' ? 1 : 0);
          const doubtCount = th.defaultVotesDoubt + (picked === 'doubt' ? 1 : 0);
          const total = yesCount + doubtCount;
          const yesPct = Math.round((yesCount / total) * 100);

          return (
            <div
              key={th.id}
              className="marvel-chamfer p-5 bg-[#121318] border border-white/[0.08] flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-[#F59E0B]/15 border-l-2 border-[#F59E0B] text-[#FCD34D] text-[9px] font-hud font-bold tracking-[0.18em] uppercase">
                    FAN THEORY
                  </span>
                  <span className="text-[9.5px] font-mono text-[#777A80] uppercase">{th.evidenceTag}</span>
                </div>

                <h5 className="text-base sm:text-lg font-hud font-bold text-white uppercase tracking-wide leading-snug mb-1">
                  {th.title}
                </h5>
                <p className="text-[11px] font-mono text-[#9CA3AF] mb-2">{th.questionHook}</p>
                <p className="text-xs sm:text-sm font-body text-[#D1D5DB] leading-relaxed">
                  {th.tanglishBody}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => castVote(th.id, 'yes')}
                    className={`px-3 py-1.5 border text-[10px] font-hud font-bold tracking-wider uppercase inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                      picked === 'yes'
                        ? 'border-[#22C55E] bg-[#0F2417] text-[#86EFAC]'
                        : 'border-white/15 bg-black/40 hover:border-white text-[#D1D5DB]'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>MASS THEORY ({yesCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => castVote(th.id, 'doubt')}
                    className={`px-3 py-1.5 border text-[10px] font-hud font-bold tracking-wider uppercase inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                      picked === 'doubt'
                        ? 'border-[#E62429] bg-[#240B0E] text-[#FCA5A5]'
                        : 'border-white/15 bg-black/40 hover:border-white text-[#D1D5DB]'
                    }`}
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>DOUBT ({doubtCount})</span>
                  </button>
                </div>

                <span className="text-[10px] font-mono text-[#9CA3AF] tabular-nums">
                  {yesPct}% AGREE
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
