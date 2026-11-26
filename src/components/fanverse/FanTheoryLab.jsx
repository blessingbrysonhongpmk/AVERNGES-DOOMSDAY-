import React, { useState, useEffect } from 'react';
import { FlaskConical, AlertTriangle, ThumbsUp, HelpCircle } from 'lucide-react';
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
    <div id="fanverse-theories" className="mb-12 sm:mb-16 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <FlaskConical className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.24em] text-[#FCD34D] uppercase">
              05 // UNCONFIRMED SPECULATION ZONE
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase tracking-tight">
            FAN THEORY LAB
          </h3>
          <p className="text-xs sm:text-sm font-body text-[#9CA3AF] mt-0.5">
            &ldquo;Doctor Doom plan enna? Old heroes epdi varuvaanga?&rdquo; — Strictly labeled fan theories! Vote &amp; discuss.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 border border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FCD34D] text-[9px] font-mono font-bold uppercase rounded-[2px] self-start sm:self-auto">
          <AlertTriangle className="w-3 h-3" />
          <span>ALL ITEMS: FAN THEORY</span>
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
              className="p-4 border border-white/[0.09] hover:border-[#F59E0B]/40 bg-[#0A0C11] rounded-[3px] transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 border border-[#F59E0B]/50 bg-[#F59E0B]/15 text-[#FCD34D] text-[8.5px] font-mono font-bold tracking-wider uppercase rounded-[2px]">
                    FAN THEORY
                  </span>
                  <span className="text-[9px] font-mono text-[#777A80] uppercase">{th.evidenceTag}</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-[#4ADE80]">{th.heat}</span>
              </div>

              <h4 className="text-sm sm:text-base font-cinematic font-bold text-white leading-snug mb-1">
                {th.title}
              </h4>
              <p className="text-[11px] font-mono text-[#93C5FD] mb-2">{th.questionHook}</p>
              <p className="text-xs font-body text-[#B4BAC4] leading-relaxed mb-3.5">
                {th.tanglishBody}
              </p>

              {/* Interactive Speculation Meter + Vote Buttons */}
              <div className="pt-2.5 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => castVote(th.id, 'yes')}
                    className={`px-2.5 py-1 border text-[9.5px] font-mono font-bold uppercase rounded-[2px] inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                      picked === 'yes'
                        ? 'border-[#22C55E] bg-[#22C55E]/20 text-[#86EFAC]'
                        : 'border-white/[0.1] bg-white/[0.03] hover:border-white/25 text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>MASS THEORY ({yesCount})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => castVote(th.id, 'doubt')}
                    className={`px-2.5 py-1 border text-[9.5px] font-mono font-bold uppercase rounded-[2px] inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                      picked === 'doubt'
                        ? 'border-[#E62429] bg-[#E62429]/20 text-[#FCA5A5]'
                        : 'border-white/[0.1] bg-white/[0.03] hover:border-white/25 text-[#9CA3AF] hover:text-white'
                    }`}
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>DOUBT IRUKKU ({doubtCount})</span>
                  </button>
                </div>

                <span className="text-[9.5px] font-mono text-[#9CA3AF] tabular-nums">
                  {yesPct}% BELIEVE THIS
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
