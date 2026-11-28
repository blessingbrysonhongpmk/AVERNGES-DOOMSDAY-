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
    } catch { }
  }, [pollVotes]);

  const votePoll = (pollId, optId) => {
    try { clockAudio.tick(0); } catch { }
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
    } catch { }
  }, [squadIds]);

  const toggleHero = (heroId) => {
    try { clockAudio.tick(0); } catch { }
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
    try { clockAudio.tick(0); } catch { }
    setGuessPick(optionName);
    if (optionName === currentGuess.answer) {
      setGuessScore((s) => s + 1);
    }
  };

  const nextGuess = () => {
    try { clockAudio.tick(0); } catch { }
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
    try { clockAudio.tick(0); } catch { }
    setTriviaPick(optIdx);
    if (optIdx === currentTrivia.correct) {
      setTriviaScore((s) => s + 1);
    }
  };

  const nextTrivia = () => {
    try { clockAudio.tick(0); } catch { }
    if (triviaIdx + 1 >= FANVERSE_TRIVIA.length) {
      setTriviaDone(true);
    } else {
      setTriviaIdx((i) => i + 1);
      setTriviaPick(null);
    }
  };

  const restartTrivia = () => {
    try { clockAudio.tick(0); } catch { }
    setTriviaIdx(0);
    setTriviaPick(null);
    setTriviaScore(0);
    setTriviaDone(false);
  };

  const votesCastCount = Object.keys(pollVotes).length;
  const fanRank = votesCastCount >= 3 ? 'FDFS CAPTAIN' : votesCastCount >= 1 ? 'SQUAD MEMBER' : 'MULTIVERSE INITIATE';

  return (
    <div id="fanverse-fanzone" className="scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
        <div>
          <span className="text-[10.5px] fan-font-mono font-bold text-[var(--marvel-red)] block mb-0.5">
            FDFS COMMUNITY WALL // CLUB PASS
          </span>
          <h4 className="text-2xl sm:text-3xl fan-font-flex text-[var(--ink)] uppercase leading-none">
            TAMIL FAN ZONE
          </h4>
        </div>

        {/* Sub-Tab Selector */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 border-b border-white/15">
          {FAN_ZONE_TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch { }
                  setActiveTab(t.id);
                }}
                className={`pb-2 text-xs fan-font-mono font-bold border-b-[3px] -mb-[1px] cursor-pointer transition-colors ${
                  active
                    ? 'border-[var(--marvel-red)] text-white'
                    : 'border-transparent text-[#8C9098] hover:text-white'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Community Fan Wall Frame */}
      <div className="relative border-2 border-white/15 bg-[#0C0D13] p-4 sm:p-6 shadow-[6px_6px_0_#000]">
        {/* Top Row: Fan Club Member ID Card + Handwritten Quote Sticky Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6 pb-5 border-b border-dashed border-white/15 items-center">
          {/* Handwritten Quote Sticker Bombs */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="relative bg-[#F5E09A] text-[#141210] p-3.5 shadow-[3px_4px_0_#000] sm:-rotate-1">
              <span className="text-[8.5px] fan-font-mono font-bold text-[#78350F] block mb-0.5">
                FAN STICKER // #01
              </span>
              <p className="fan-font-note text-lg sm:text-xl font-bold leading-snug">
                &ldquo;Tony Stark oda journey inga mudinjirukkalam... aana avan impact innum MCU-la irukku.&rdquo;
              </p>
            </div>
            <div className="relative fan-paper-surface text-[#141210] p-3.5 border border-[#151412] sm:rotate-1">
              <span className="text-[8.5px] fan-font-mono font-bold text-[#991B1B] block mb-0.5">
                FAN STICKER // #02
              </span>
              <p className="fan-font-note text-lg sm:text-xl font-bold leading-snug">
                &ldquo;Doctor Doom entry-ku apram game rules-e maarapoguthu.&rdquo;
              </p>
            </div>
          </div>

          {/* Corner Collector Fan Club Member ID Card */}
          <div className="lg:col-span-4 relative bg-[#12141C] border-2 border-[var(--gold-foil)] p-3.5 shadow-[4px_4px_0_#000]">
            <div className="flex items-center justify-between gap-2 pb-1.5 mb-2 border-b border-white/10">
              <span className="text-[9px] fan-font-mono font-bold text-[var(--gold-foil)]">
                FAN CLUB MEMBER PASS
              </span>
              <span className="text-[8.5px] fan-font-mono text-[#9CA3AF]">ID #TVF-616</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[9px] fan-font-mono text-[#9CA3AF] block">ACTIVE RANK</span>
                <span className="text-lg fan-font-flex text-white uppercase tracking-wide leading-none">
                  {fanRank}
                </span>
              </div>
              <span className="px-2 py-1 bg-[#1D202B] border border-[var(--gold-foil)]/60 text-[9px] fan-font-mono font-bold text-[var(--gold-foil)]">
                {votesCastCount}/3 BALLOTS
              </span>
            </div>
          </div>
        </div>

        {activeTab === 'polls' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
            {FAN_ZONE_POLLS.map((poll, pidx) => {
              const userChoice = pollVotes[poll.id];
              const totalVotes = poll.options.reduce(
                (acc, o) => acc + o.baseVotes + (userChoice === o.id ? 1 : 0),
                0
              );

              return (
                <div
                  key={poll.id}
                  className={`fan-paper-surface border-2 border-[#151412] p-4 flex flex-col justify-between ${
                    pidx === 1 ? 'lg:rotate-0.5' : pidx === 2 ? 'lg:-rotate-0.5' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-1.5 mb-2 border-b border-dashed border-[#151412]/35">
                      <span className="text-[8.5px] fan-font-mono font-bold text-[#991B1B]">
                        OFFICIAL BALLOT SLIP #0{pidx + 1}
                      </span>
                      <span className="fan-rubber-stamp text-[7.5px] px-1.5 py-0 text-[#151412]">
                        {userChoice ? 'CAST' : 'OPEN'}
                      </span>
                    </div>
                    <h5 className="text-xl fan-font-flex text-[#11100E] uppercase leading-none mb-1">
                      {poll.title}
                    </h5>
                    <p className="text-xs fan-font-body text-[#3E3932] mb-3.5">{poll.subtitle}</p>
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
                          className={`relative w-full text-left px-3 py-2 border-2 overflow-hidden cursor-pointer transition-colors ${
                            picked
                              ? 'border-[var(--marvel-red)] bg-[#DFC7B8]'
                              : 'border-[#151412]/40 bg-[#DFD7C3] hover:border-[#151412]'
                          }`}
                        >
                          <div
                            className={`absolute inset-y-0 left-0 transition-all duration-300 ${
                              picked ? 'bg-[var(--marvel-red)]/25' : 'bg-[#151412]/10'
                            }`}
                            style={{ width: `${userChoice ? pct : 0}%` }}
                          />
                          <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                            <span className={`fan-font-body ${picked ? 'text-[#11100E] font-bold' : 'text-[#26231F] font-medium'}`}>
                              {picked ? '✓ ' : '☐ '}
                              {opt.label}
                            </span>
                            <span className="text-[10px] fan-font-mono font-bold text-[#991B1B] shrink-0">
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
                <h5 className="text-xl fan-font-flex text-white uppercase">
                  UNGA DREAM AVENGERS SQUAD (SELECT 5)
                </h5>
                <p className="text-xs fan-font-body text-[#B4B0A8]">
                  Doctor Doom-a stop panna unga Top 5 Marvel heroes-a pick pannunga.
                </p>
              </div>
              <div className="px-3 py-1 bg-[var(--paper)] text-[#141210] border-2 border-[#151412] shadow-[2px_2px_0_#000] text-[10.5px] fan-font-mono font-bold">
                SQUAD: {squadIds.length}/5 &bull; POWER: {totalPower}
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
                    className={`text-left border-2 transition-colors cursor-pointer overflow-hidden ${
                      selected
                        ? 'border-[var(--marvel-red)] bg-[#1A1013] shadow-[3px_3px_0_#000]'
                        : disabled
                          ? 'border-white/10 bg-[#0B0C10] opacity-40 cursor-not-allowed'
                          : 'border-white/15 bg-[#0B0C10] hover:border-[var(--gold-foil)]'
                    }`}
                  >
                    <div className="relative aspect-[4/3] w-full bg-black">
                      <img
                        src={hero.image}
                        alt={hero.name}
                        width={240}
                        height={180}
                        loading="lazy"
                        className="w-full h-full object-cover object-[50%_18%]"
                      />
                      {selected && <div className="h-[4px] bg-[var(--marvel-red)] absolute bottom-0 inset-x-0" />}
                    </div>
                    <div className="p-2">
                      <span className="text-sm fan-font-flex text-white uppercase block truncate">
                        {hero.name}
                      </span>
                      <span className="text-[9px] fan-font-mono text-[#9CA3AF] block truncate">
                        {hero.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs fan-font-body text-[#D5D1C8]">
                {squadIds.length === 5
                  ? totalPower >= 470
                    ? 'VERITHANAM LINEUP! Indha 5 per team Doom-ku solid counter kuduppanga!'
                    : 'BALANCED SQUAD! Brain + Brawn + Magic mix super-a irukku Machi!'
                  : `Innum ${5 - squadIds.length} hero(s) pick pannunga full Dream Team lock panna!`}
              </p>
              <button
                type="button"
                onClick={() => {
                  try { clockAudio.tick(0); } catch { }
                  setSquadIds([]);
                }}
                className="text-[10px] fan-font-mono text-[var(--marvel-red)] hover:text-white underline cursor-pointer"
              >
                RESET TEAM
              </button>
            </div>
          </div>
        )}

        {activeTab === 'guess' && (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[10px] fan-font-mono font-bold text-[var(--marvel-red)]">
                RIDDLE 0{guessIdx + 1} / 0{GUESS_CHARACTER_CHALLENGES.length}
              </span>
              <span className="text-[10px] fan-font-mono text-white">
                SCORE: {guessScore} CORRECT
              </span>
            </div>

            <div className="fan-paper-surface p-4 border-2 border-[#151412] mb-4">
              <p className="text-sm sm:text-base fan-font-editorial font-bold text-[#11100E] mb-3">
                &ldquo;{currentGuess.clueTanglish}&rdquo;
              </p>
              <button
                type="button"
                onClick={() => setShowGuessHint((h) => !h)}
                className="inline-flex items-center gap-1.5 text-[10px] fan-font-mono font-bold text-[#991B1B] hover:text-black cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showGuessHint ? currentGuess.hintTanglish : 'SHOW HINT CLUE'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
              {currentGuess.options.map((opt) => {
                const isRevealed = guessPick !== null;
                const isCorrect = opt === currentGuess.answer;
                const isPicked = opt === guessPick;
                let cls = 'border-white/20 bg-[#0B0C10] hover:border-[var(--gold-foil)] text-white';
                if (isRevealed) {
                  if (isCorrect) cls = 'border-[var(--doom-green)] bg-[#0E2015] text-[#86EFAC]';
                  else if (isPicked) cls = 'border-[var(--marvel-red)] bg-[#210B0D] text-[#FCA5A5]';
                  else cls = 'border-white/[0.06] bg-[#090A0D] text-[#6B7280]';
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={isRevealed}
                    onClick={() => handleGuessPick(opt)}
                    className={`p-3 border-2 text-left text-xs fan-font-mono font-bold flex items-center justify-between cursor-pointer transition-colors ${cls}`}
                  >
                    <span>{opt}</span>
                    {isRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-[var(--doom-green)]" />}
                    {isRevealed && isPicked && !isCorrect && <XCircle className="w-4 h-4 text-[var(--marvel-red)]" />}
                  </button>
                );
              })}
            </div>

            {guessPick !== null && (
              <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentGuess.image}
                    alt={currentGuess.answer}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="w-10 h-10 object-cover object-top border border-white/20 shrink-0"
                  />
                  <p className="text-xs fan-font-body text-[#D5D1C8]">
                    {guessPick === currentGuess.answer
                      ? currentGuess.rewardLine
                      : `Aiyo miss aachu! Correct answer: ${currentGuess.answer}.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={nextGuess}
                  className="fan-btn-tactile marvel-btn-cut px-4 py-2 bg-[var(--marvel-red)] text-white text-[10.5px] fan-font-mono font-bold cursor-pointer"
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
                <span className="text-[10px] fan-font-mono text-[var(--marvel-red)] block">
                  TRIVIA COMPLETE
                </span>
                <h5 className="text-3xl fan-font-flex text-white uppercase">
                  SCORE: {triviaScore} / {FANVERSE_TRIVIA.length}
                </h5>
                <p className="text-xs sm:text-sm fan-font-body text-[#D5D1C8]">
                  {triviaScore >= 5
                    ? 'Vera level! Nee 100% Certified Tamil MCU Veteran Machi!'
                    : triviaScore >= 3
                      ? 'Sema score! Innum oru round potta full 6/6 adichiruvai!'
                      : 'Relax thala! Watchlist revisit panni thirumba try pannu!'}
                </p>
                <button
                  type="button"
                  onClick={restartTrivia}
                  className="fan-btn-tactile marvel-btn-cut px-5 py-2.5 bg-[var(--marvel-red)] text-white text-xs fan-font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>PLAY AGAIN</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] fan-font-mono font-bold text-[var(--marvel-red)]">
                    QUESTION 0{triviaIdx + 1} / 0{FANVERSE_TRIVIA.length}
                  </span>
                  <span className="text-[10px] fan-font-mono text-white">
                    SCORE: {triviaScore}
                  </span>
                </div>

                <h5 className="text-base sm:text-lg fan-font-editorial font-bold text-white leading-snug mb-3.5">
                  {currentTrivia.question}
                </h5>

                <div className="space-y-2 mb-4">
                  {currentTrivia.options.map((opt, idx) => {
                    const revealed = triviaPick !== null;
                    const isRight = idx === currentTrivia.correct;
                    const isMine = idx === triviaPick;
                    let cls = 'border-white/15 bg-[#0B0C10] hover:border-[var(--gold-foil)] text-[#F2EFE8]';
                    if (revealed) {
                      if (isRight) cls = 'border-[var(--doom-green)] bg-[#0E2015] text-[#86EFAC]';
                      else if (isMine) cls = 'border-[var(--marvel-red)] bg-[#210B0D] text-[#FCA5A5]';
                      else cls = 'border-white/[0.06] bg-[#090A0D] text-[#6B7280]';
                    }
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={revealed}
                        onClick={() => pickTrivia(idx)}
                        className={`w-full p-2.5 px-3 border-2 text-left text-xs fan-font-body font-medium flex items-center justify-between cursor-pointer transition-colors ${cls}`}
                      >
                        <span>{opt}</span>
                        {revealed && isRight && <CheckCircle2 className="w-4 h-4 text-[var(--doom-green)] shrink-0" />}
                        {revealed && isMine && !isRight && <XCircle className="w-4 h-4 text-[var(--marvel-red)] shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {triviaPick !== null && (
                  <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs fan-font-body text-[#D5D1C8]">{currentTrivia.note}</p>
                    <button
                      type="button"
                      onClick={nextTrivia}
                      className="fan-btn-tactile marvel-btn-cut px-4 py-2 bg-[var(--marvel-red)] text-white text-[10.5px] fan-font-mono font-bold cursor-pointer shrink-0"
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
