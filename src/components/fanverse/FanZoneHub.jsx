import React, { useState, useEffect } from 'react';
import {
  Flame,
  BarChart2,
  Users,
  HelpCircle,
  Zap,
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
  { id: 'polls', label: 'FAN POLLS', icon: BarChart2 },
  { id: 'squad', label: 'DREAM SQUAD 5', icon: Users },
  { id: 'guess', label: 'GUESS HERO', icon: HelpCircle },
  { id: 'trivia', label: 'TAMIL TRIVIA', icon: Zap },
];

export default function FanZoneHub() {
  const [activeTab, setActiveTab] = useState('polls');

  // 1) Polls State
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

  // 2) Dream Squad State (Max 5)
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

  // 3) Guess the Character State
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

  // 4) Mini Trivia State
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <Flame className="w-3.5 h-3.5 text-[#22C55E]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.24em] text-[#4ADE80] uppercase">
              06 // LIVE INTERACTIVE HEADQUARTERS
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-cinematic font-black text-white uppercase tracking-tight">
            TAMIL FAN ZONE
          </h3>
        </div>
        <span className="text-[9.5px] font-mono text-[#8C9098] uppercase">
          POLLS • SQUAD • RIDDLES • TRIVIA
        </span>
      </div>

      {/* Mode Switch Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {FAN_ZONE_TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                try { clockAudio.tick(0); } catch {}
                setActiveTab(t.id);
              }}
              className={`py-2.5 px-3 border rounded-[2px] text-[10px] font-mono font-bold tracking-wider uppercase inline-flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                active
                  ? 'border-[#22C55E] bg-[#0B1810] text-white shadow-[0_0_18px_rgba(34,197,94,0.18)]'
                  : 'border-white/[0.09] bg-[#0A0C11] text-[#8C9098] hover:text-white hover:border-white/25'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#22C55E]' : ''}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Interactive Panel Enclosure */}
      <div className="border border-white/[0.1] bg-[#090B10] rounded-[3px] p-4 sm:p-5">
        {/* ─── TAB 1: FAN POLLS ─── */}
        {activeTab === 'polls' && (
          <div className="space-y-5">
            {FAN_ZONE_POLLS.map((poll) => {
              const userChoice = pollVotes[poll.id];
              const totalVotes = poll.options.reduce(
                (acc, o) => acc + o.baseVotes + (userChoice === o.id ? 1 : 0),
                0
              );

              return (
                <div key={poll.id} className="pb-4 last:pb-0 border-b last:border-b-0 border-white/[0.07]">
                  <h4 className="text-sm font-cinematic font-bold text-white mb-0.5">{poll.title}</h4>
                  <p className="text-[11px] font-body text-[#8C9098] mb-3">{poll.subtitle}</p>

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
                          className={`relative w-full text-left px-3 py-2 border rounded-[2px] overflow-hidden cursor-pointer transition-colors ${
                            picked
                              ? 'border-[#22C55E] bg-[#0B1710]'
                              : 'border-white/[0.08] bg-[#0D1017] hover:border-white/25'
                          }`}
                        >
                          <div
                            className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                              picked ? 'bg-[#22C55E]/20' : 'bg-white/[0.04]'
                            }`}
                            style={{ width: `${userChoice ? pct : 0}%` }}
                          />
                          <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                            <span className={`font-display font-medium ${picked ? 'text-[#86EFAC] font-bold' : 'text-[#E5E7EB]'}`}>
                              {picked ? '✓ ' : ''}{opt.label}
                            </span>
                            <span className="text-[10px] font-mono text-[#9CA3AF] tabular-nums shrink-0">
                              {userChoice ? `${pct}% (${count})` : 'VOTE'}
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

        {/* ─── TAB 2: DREAM AVENGERS SQUAD 5 ─── */}
        {activeTab === 'squad' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div>
                <h4 className="text-sm font-cinematic font-bold text-white">
                  UNGA DREAM AVENGERS SQUAD (SELECT 5)
                </h4>
                <p className="text-[11px] font-body text-[#9CA3AF]">
                  Doctor Doom-a stop panna unga Top 5 Marvel heroes-a pick pannunga!
                </p>
              </div>
              <div className="px-3 py-1 bg-[#0B1710] border border-[#22C55E]/40 rounded-[2px] text-[10px] font-mono font-bold text-[#4ADE80] tabular-nums">
                SQUAD: {squadIds.length}/5 • POWER: {totalPower}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {DREAM_TEAM_ROSTER.map((hero) => {
                const selected = squadIds.includes(hero.id);
                const disabled = !selected && squadIds.length >= 5;
                return (
                  <button
                    key={hero.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleHero(hero.id)}
                    className={`p-2 text-left rounded-[2px] border transition-all cursor-pointer ${
                      selected
                        ? 'border-[#22C55E] bg-[#0B1710]'
                        : disabled
                          ? 'border-white/[0.04] bg-[#0A0C10] opacity-40 cursor-not-allowed'
                          : 'border-white/[0.08] bg-[#0D1017] hover:border-white/25'
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full rounded-[2px] overflow-hidden bg-black mb-1.5">
                      <img
                        src={hero.image}
                        alt={hero.name}
                        className="w-full h-full object-cover object-[50%_18%]"
                      />
                    </div>
                    <span className="text-[10.5px] font-cinematic font-bold text-white block truncate">
                      {hero.name}
                    </span>
                    <span className="text-[8.5px] font-mono text-[#8C9098] uppercase block truncate">
                      {hero.role}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-[#0D1017] border border-white/[0.08] rounded-[2px] flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-body text-[#D1D5DB]">
                {squadIds.length === 5
                  ? totalPower >= 470
                    ? '🔥 VERITHANAM LINEUP! Indha 5 per team Doom-ku solid counter kuduppanga!'
                    : '⚡ BALANCED SQUAD! Brain + Brawn + Magic mix super-a irukku Machi!'
                  : `Innum ${5 - squadIds.length} hero(s) pick pannunga full Dream Team lock panna!`}
              </p>
              <button
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch {}
                  setSquadIds([]);
                }}
                className="text-[9.5px] font-mono text-[#9CA3AF] hover:text-white uppercase underline cursor-pointer"
              >
                RESET TEAM
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 3: GUESS THE CHARACTER ─── */}
        {activeTab === 'guess' && (
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] font-mono font-bold text-[#4ADE80] uppercase tracking-wider">
                RIDDLE 0{guessIdx + 1} / 0{GUESS_CHARACTER_CHALLENGES.length}
              </span>
              <span className="text-[10px] font-mono text-[#FCD34D] uppercase">
                SCORE: {guessScore} CORRECT
              </span>
            </div>

            <div className="p-4 bg-[#0D1017] border border-white/[0.09] rounded-[2px] mb-3.5">
              <p className="text-sm sm:text-base font-display font-semibold text-white leading-relaxed mb-3">
                &ldquo;{currentGuess.clueTanglish}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setShowGuessHint((h) => !h)}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[#38BDF8] hover:text-white uppercase cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showGuessHint ? currentGuess.hintTanglish : 'SHOW HINT CLUE'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3.5">
              {currentGuess.options.map((opt) => {
                const isRevealed = guessPick !== null;
                const isCorrect = opt === currentGuess.answer;
                const isPicked = opt === guessPick;
                let cls = 'border-white/[0.1] bg-[#0D1017] hover:border-white/30 text-[#E5E7EB]';
                if (isRevealed) {
                  if (isCorrect) cls = 'border-[#22C55E] bg-[#0B1E13] text-[#86EFAC]';
                  else if (isPicked) cls = 'border-[#E62429] bg-[#210B0D] text-[#FCA5A5]';
                  else cls = 'border-white/[0.05] bg-[#090B0F] text-[#6B7280]';
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={isRevealed}
                    onClick={() => handleGuessPick(opt)}
                    className={`p-3 border rounded-[2px] text-left text-xs font-mono font-bold uppercase flex items-center justify-between cursor-pointer transition-colors ${cls}`}
                  >
                    <span>{opt}</span>
                    {isRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />}
                    {isRevealed && isPicked && !isCorrect && <XCircle className="w-4 h-4 text-[#E62429]" />}
                  </button>
                );
              })}
            </div>

            {guessPick !== null && (
              <div className="p-3 bg-[#0B1510] border border-[#22C55E]/35 rounded-[2px] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentGuess.image}
                    alt={currentGuess.answer}
                    className="w-10 h-10 object-cover object-top rounded-[2px] border border-white/20 shrink-0"
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
                  className="px-3 py-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-black text-[10px] font-mono font-black uppercase rounded-[2px] cursor-pointer"
                >
                  NEXT RIDDLE →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 4: TAMIL FANVERSE TRIVIA RUSH ─── */}
        {activeTab === 'trivia' && (
          <div>
            {triviaDone ? (
              <div className="py-6 text-center space-y-3">
                <span className="text-[10px] font-mono tracking-[0.22em] text-[#4ADE80] uppercase block">
                  TRIVIA MISSION COMPLETE
                </span>
                <h4 className="text-2xl font-cinematic font-black text-white">
                  SCORE: {triviaScore} / {FANVERSE_TRIVIA.length}
                </h4>
                <p className="text-xs sm:text-sm font-body text-[#B4BAC4] max-w-md mx-auto">
                  {triviaScore >= 5
                    ? 'Vera level! Nee 100% Certified Tamil MCU Veteran Machi!'
                    : triviaScore >= 3
                      ? 'Sema score! Innum oru round potta full 6/6 adichiruvai!'
                      : 'Relax thala! Watchlist revisit panni thirumba try pannu!'}
                </p>
                <button
                  type="button"
                  onClick={restartTrivia}
                  className="px-4 py-2 bg-[#E62429] hover:bg-[#DC2626] text-white text-[10px] font-mono font-bold uppercase tracking-wider rounded-[2px] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>PLAY AGAIN</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold text-[#4ADE80] uppercase">
                    QUESTION 0{triviaIdx + 1} / 0{FANVERSE_TRIVIA.length}
                  </span>
                  <span className="text-[10px] font-mono text-[#FCD34D] uppercase">
                    POINTS: {triviaScore}
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-display font-bold text-white leading-snug mb-3.5">
                  {currentTrivia.question}
                </h4>

                <div className="space-y-2 mb-3.5">
                  {currentTrivia.options.map((opt, idx) => {
                    const revealed = triviaPick !== null;
                    const isRight = idx === currentTrivia.correct;
                    const isMine = idx === triviaPick;
                    let cls = 'border-white/[0.1] bg-[#0D1017] hover:border-white/30 text-[#E5E7EB]';
                    if (revealed) {
                      if (isRight) cls = 'border-[#22C55E] bg-[#0B1E13] text-[#86EFAC]';
                      else if (isMine) cls = 'border-[#E62429] bg-[#210B0D] text-[#FCA5A5]';
                      else cls = 'border-white/[0.05] bg-[#090B0F] text-[#6B7280]';
                    }
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={revealed}
                        onClick={() => pickTrivia(idx)}
                        className={`w-full p-2.5 px-3 border rounded-[2px] text-left text-xs font-display font-medium flex items-center justify-between cursor-pointer transition-colors ${cls}`}
                      >
                        <span>{opt}</span>
                        {revealed && isRight && <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />}
                        {revealed && isMine && !isRight && <XCircle className="w-4 h-4 text-[#E62429] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {triviaPick !== null && (
                  <div className="p-3 bg-[#0D1017] border border-white/[0.1] rounded-[2px] flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs font-body text-[#C8CDD6]">{currentTrivia.note}</p>
                    <button
                      type="button"
                      onClick={nextTrivia}
                      className="px-3 py-1.5 bg-[#22C55E] hover:bg-[#16A34A] text-black text-[10px] font-mono font-black uppercase rounded-[2px] cursor-pointer shrink-0"
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
