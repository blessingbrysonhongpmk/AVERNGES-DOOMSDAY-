import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
} from 'lucide-react';
import {
  FAN_ZONE_POLLS,
  DREAM_TEAM_ROSTER,
  GUESS_CHARACTER_CHALLENGES,
  FANVERSE_TRIVIA,
} from '../../data/tamilFanverseData.js';
import { clockAudio } from '../../utils/audio.js';

const POLLS_STORAGE_KEY = 'doomsday_fanverse_polls_v1';
const SQUAD_STORAGE_KEY = 'doomsday_fanverse_dream_squad_v1';

const FAN_ZONE_TABS = [
  { id: 'polls', label: 'FAN POLLS' },
  { id: 'squad', label: 'DREAM SQUAD 5' },
  { id: 'guess', label: 'GUESS HERO' },
  { id: 'trivia', label: 'TAMIL TRIVIA' },
];

export default function FanZoneHub() {
  const [activeTab, setActiveTab] = useState('polls');

  const [pollVotes, setPollVotes] = useState(() => {
    if (typeof window === 'undefined' || !window.localStorage) return {};
    try {
      return JSON.parse(window.localStorage.getItem(POLLS_STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(POLLS_STORAGE_KEY, JSON.stringify(pollVotes));
    } catch {}
  }, [pollVotes]);

  const votePoll = (pollId, optId) => {
    try { clockAudio.tick(0); } catch {}
    setPollVotes((prev) => ({ ...prev, [pollId]: optId }));
  };

  const [squadIds, setSquadIds] = useState(() => {
    if (typeof window === 'undefined' || !window.localStorage) return ['thor', 'sam', 'strange'];
    try {
      const saved = JSON.parse(window.localStorage.getItem(SQUAD_STORAGE_KEY) || 'null');
      return Array.isArray(saved) ? saved.slice(0, 5) : ['thor', 'sam', 'strange'];
    } catch {
      return ['thor', 'sam', 'strange'];
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(SQUAD_STORAGE_KEY, JSON.stringify(squadIds));
    } catch {}
  }, [squadIds]);

  const toggleHero = (heroId) => {
    try { clockAudio.tick(0); } catch {}
    setSquadIds((prev) => {
      if (prev.includes(heroId)) return prev.filter((id) => id !== heroId);
      if (prev.length >= 5) return prev;
      return [...prev, heroId];
    });
  };

  const selectedRoster = DREAM_TEAM_ROSTER.filter((h) => squadIds.includes(h.id));
  const totalPower = selectedRoster.reduce((sum, h) => sum + h.powerScore, 0);

  const [guessIdx, setGuessIdx] = useState(0);
  const [guessPick, setGuessPick] = useState(null);
  const [showGuessHint, setShowGuessHint] = useState(false);
  const [guessScore, setGuessScore] = useState(0);

  const currentGuess = GUESS_CHARACTER_CHALLENGES[guessIdx];

  const handleGuessPick = (optionName) => {
    if (guessPick !== null) return;
    try { clockAudio.tick(0); } catch {}
    setGuessPick(optionName);
    if (optionName === currentGuess.answer) {
      setGuessScore((s) => s + 1);
    }
  };

  const nextGuess = () => {
    try { clockAudio.tick(0); } catch {}
    setGuessPick(null);
    setShowGuessHint(false);
    setGuessIdx((i) => (i + 1) % GUESS_CHARACTER_CHALLENGES.length);
  };

  const [triviaIdx, setTriviaIdx] = useState(0);
  const [triviaPick, setTriviaPick] = useState(null);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaDone, setTriviaDone] = useState(false);

  const currentTrivia = FANVERSE_TRIVIA[triviaIdx];

  const pickTrivia = (optIdx) => {
    if (triviaPick !== null) return;
    try { clockAudio.tick(0); } catch {}
    setTriviaPick(optIdx);
    if (optIdx === currentTrivia.correct) {
      setTriviaScore((s) => s + 1);
    }
  };

  const nextTrivia = () => {
    try { clockAudio.tick(0); } catch {}
    if (triviaIdx + 1 >= FANVERSE_TRIVIA.length) {
      setTriviaDone(true);
    } else {
      setTriviaIdx((i) => i + 1);
      setTriviaPick(null);
    }
  };

  const restartTrivia = () => {
    try { clockAudio.tick(0); } catch {}
    setTriviaIdx(0);
    setTriviaPick(null);
    setTriviaScore(0);
    setTriviaDone(false);
  };

  return (
    <div id="fanverse-fanzone" className="scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
        <div>
          <span className="text-[10.5px] font-hud font-bold tracking-[0.24em] text-[#E62429] uppercase block mb-0.5">
            COMMUNITY ARENA
          </span>
          <h4 className="text-xl sm:text-2xl font-hud font-extrabold text-white uppercase tracking-wide">
            TAMIL FAN ZONE
          </h4>
        </div>

        {/* Clean Studio Underline Sub-Tabs */}
        <div className="flex flex-wrap items-center gap-4 border-b border-white/[0.1]">
          {FAN_ZONE_TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch {}
                  setActiveTab(t.id);
                }}
                className={`pb-2 text-xs font-hud font-bold tracking-[0.16em] uppercase border-b-2 -mb-[1px] cursor-pointer transition-colors ${
                  active
                    ? 'border-[#E62429] text-white'
                    : 'border-transparent text-[#8C9098] hover:text-white'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="marvel-chamfer border border-white/[0.08] bg-[#121318] p-5 sm:p-6">
        {activeTab === 'polls' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {FAN_ZONE_POLLS.map((poll) => {
              const userChoice = pollVotes[poll.id];
              const totalVotes = poll.options.reduce(
                (acc, o) => acc + o.baseVotes + (userChoice === o.id ? 1 : 0),
                0
              );

              return (
                <div key={poll.id} className="flex flex-col justify-between">
                  <div>
                    <h5 className="text-base font-hud font-bold text-white uppercase tracking-wide mb-1">
                      {poll.title}
                    </h5>
                    <p className="text-xs font-body text-[#9CA3AF] mb-3.5">{poll.subtitle}</p>
                  </div>

                  <div className="space-y-2">
                    {poll.options.map((opt) => {
                      const picked = userChoice === opt.id;
                      const count = opt.baseVotes + (picked ? 1 : 0);
                      const pct = Math.round((count / totalVotes) * 100);

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => votePoll(poll.id, opt.id)}
                          className={`relative w-full text-left px-3 py-2 border overflow-hidden cursor-pointer transition-colors ${
                            picked
                              ? 'border-[#E62429] bg-[#1B1013]'
                              : 'border-white/[0.08] bg-[#0B0C10] hover:border-white/30'
                          }`}
                        >
                          <div
                            className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                              picked ? 'bg-[#E62429]/25' : 'bg-white/[0.05]'
                            }`}
                            style={{ width: `${userChoice ? pct : 0}%` }}
                          />
                          <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                            <span className={`font-body font-medium ${picked ? 'text-white font-semibold' : 'text-[#D1D5DB]'}`}>
                              {opt.label}
                            </span>
                            <span className="text-[10px] font-mono text-[#9CA3AF] tabular-nums shrink-0">
                              {userChoice ? `${pct}%` : 'VOTE'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'squad' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <h5 className="text-base font-hud font-bold text-white uppercase tracking-wide">
                  UNGA DREAM AVENGERS SQUAD (SELECT 5)
                </h5>
                <p className="text-xs font-body text-[#9CA3AF]">
                  Doctor Doom-a stop panna unga Top 5 Marvel heroes-a pick pannunga.
                </p>
              </div>
              <div className="px-3 py-1 bg-black/50 border-l-2 border-[#E62429] text-[10.5px] font-mono font-bold text-white tabular-nums">
                SQUAD: {squadIds.length}/5 • POWER: {totalPower}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-4">
              {DREAM_TEAM_ROSTER.map((hero) => {
                const selected = squadIds.includes(hero.id);
                const disabled = !selected && squadIds.length >= 5;
                return (
                  <button
                    key={hero.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleHero(hero.id)}
                    className={`text-left border transition-colors cursor-pointer overflow-hidden ${
                      selected
                        ? 'border-[#E62429] bg-[#1A1013]'
                        : disabled
                          ? 'border-white/[0.04] bg-[#0B0C10] opacity-40 cursor-not-allowed'
                          : 'border-white/[0.08] bg-[#0B0C10] hover:border-white/30'
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full bg-black">
                      <img
                        src={hero.image}
                        alt={hero.name}
                        className="w-full h-full object-cover object-[50%_18%]"
                      />
                      {selected && <div className="h-[3px] bg-[#E62429] absolute bottom-0 inset-x-0" />}
                    </div>
                    <div className="p-2">
                      <span className="text-xs font-hud font-bold text-white uppercase block truncate">
                        {hero.name}
                      </span>
                      <span className="text-[9px] font-mono text-[#8C9098] uppercase block truncate">
                        {hero.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-body text-[#D1D5DB]">
                {squadIds.length === 5
                  ? totalPower >= 470
                    ? 'VERITHANAM LINEUP! Indha 5 per team Doom-ku solid counter kuduppanga!'
                    : 'BALANCED SQUAD! Brain + Brawn + Magic mix super-a irukku Machi!'
                  : `Innum ${5 - squadIds.length} hero(s) pick pannunga full Dream Team lock panna!`}
              </p>
              <button
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch {}
                  setSquadIds([]);
                }}
                className="text-[10px] font-mono text-[#E62429] hover:text-white uppercase underline cursor-pointer"
              >
                RESET TEAM
              </button>
            </div>
          </div>
        )}

        {activeTab === 'guess' && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold text-[#E62429] uppercase tracking-wider">
                RIDDLE 0{guessIdx + 1} / 0{GUESS_CHARACTER_CHALLENGES.length}
              </span>
              <span className="text-[10px] font-mono text-white uppercase">
                SCORE: {guessScore} CORRECT
              </span>
            </div>

            <div className="p-4 bg-[#0B0C10] border-l-2 border-[#E62429] mb-4">
              <p className="text-sm sm:text-base font-display font-semibold text-white leading-relaxed mb-3">
                &ldquo;{currentGuess.clueTanglish}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setShowGuessHint((h) => !h)}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#9CA3AF] hover:text-white uppercase cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#E62429]" />
                <span>{showGuessHint ? currentGuess.hintTanglish : 'SHOW HINT CLUE'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {currentGuess.options.map((opt) => {
                const isRevealed = guessPick !== null;
                const isCorrect = opt === currentGuess.answer;
                const isPicked = opt === guessPick;
                let cls = 'border-white/[0.1] bg-[#0B0C10] hover:border-white/35 text-white';
                if (isRevealed) {
                  if (isCorrect) cls = 'border-[#22C55E] bg-[#0E2015] text-[#86EFAC]';
                  else if (isPicked) cls = 'border-[#E62429] bg-[#210B0D] text-[#FCA5A5]';
                  else cls = 'border-white/[0.05] bg-[#090A0D] text-[#6B7280]';
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={isRevealed}
                    onClick={() => handleGuessPick(opt)}
                    className={`p-3 border text-left text-xs font-hud font-bold tracking-wider uppercase flex items-center justify-between cursor-pointer transition-colors ${cls}`}
                  >
                    <span>{opt}</span>
                    {isRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />}
                    {isRevealed && isPicked && !isCorrect && <XCircle className="w-4 h-4 text-[#E62429]" />}
                  </button>
                );
              })}
            </div>

            {guessPick !== null && (
              <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentGuess.image}
                    alt={currentGuess.answer}
                    className="w-10 h-10 object-cover object-top border border-white/15 shrink-0"
                  />
                  <p className="text-xs font-body text-[#D1D5DB]">
                    {guessPick === currentGuess.answer
                      ? currentGuess.rewardLine
                      : `Aiyo miss aachu! Correct answer: ${currentGuess.answer}.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={nextGuess}
                  className="marvel-btn-cut px-4 py-2 bg-[#E62429] hover:bg-[#C8191E] text-white text-[10.5px] font-hud font-bold uppercase tracking-wider cursor-pointer"
                >
                  NEXT RIDDLE →
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trivia' && (
          <div className="max-w-2xl">
            {triviaDone ? (
              <div className="py-4 space-y-3">
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#E62429] uppercase block">
                  TRIVIA COMPLETE
                </span>
                <h5 className="text-2xl font-hud font-extrabold text-white uppercase">
                  SCORE: {triviaScore} / {FANVERSE_TRIVIA.length}
                </h5>
                <p className="text-xs sm:text-sm font-body text-[#B4BAC4]">
                  {triviaScore >= 5
                    ? 'Vera level! Nee 100% Certified Tamil MCU Veteran Machi!'
                    : triviaScore >= 3
                      ? 'Sema score! Innum oru round potta full 6/6 adichiruvai!'
                      : 'Relax thala! Watchlist revisit panni thirumba try pannu!'}
                </p>
                <button
                  type="button"
                  onClick={restartTrivia}
                  className="marvel-btn-cut px-5 py-2.5 bg-[#E62429] hover:bg-[#C8191E] text-white text-xs font-hud font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>PLAY AGAIN</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-[#E62429] uppercase">
                    QUESTION 0{triviaIdx + 1} / 0{FANVERSE_TRIVIA.length}
                  </span>
                  <span className="text-[10px] font-mono text-white uppercase">
                    SCORE: {triviaScore}
                  </span>
                </div>

                <h5 className="text-sm sm:text-base font-display font-bold text-white leading-snug mb-3.5">
                  {currentTrivia.question}
                </h5>

                <div className="space-y-2 mb-4">
                  {currentTrivia.options.map((opt, idx) => {
                    const revealed = triviaPick !== null;
                    const isRight = idx === currentTrivia.correct;
                    const isMine = idx === triviaPick;
                    let cls = 'border-white/[0.08] bg-[#0B0C10] hover:border-white/30 text-[#E5E7EB]';
                    if (revealed) {
                      if (isRight) cls = 'border-[#22C55E] bg-[#0E2015] text-[#86EFAC]';
                      else if (isMine) cls = 'border-[#E62429] bg-[#210B0D] text-[#FCA5A5]';
                      else cls = 'border-white/[0.05] bg-[#090A0D] text-[#6B7280]';
                    }
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={revealed}
                        onClick={() => pickTrivia(idx)}
                        className={`w-full p-2.5 px-3 border text-left text-xs font-body font-medium flex items-center justify-between cursor-pointer transition-colors ${cls}`}
                      >
                        <span>{opt}</span>
                        {revealed && isRight && <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />}
                        {revealed && isMine && !isRight && <XCircle className="w-4 h-4 text-[#E62429] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {triviaPick !== null && (
                  <div className="pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-body text-[#C8CDD6]">{currentTrivia.note}</p>
                    <button
                      type="button"
                      onClick={nextTrivia}
                      className="marvel-btn-cut px-4 py-2 bg-[#E62429] hover:bg-[#C8191E] text-white text-[10.5px] font-hud font-bold uppercase cursor-pointer shrink-0"
                    >
                      {triviaIdx + 1 >= FANVERSE_TRIVIA.length ? 'FINISH' : 'NEXT →'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
