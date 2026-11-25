import React, { useState } from 'react';
import { TRIVIA_QUESTIONS, GUESS_HEROES } from '../data/games.js';
import { clockAudio } from '../utils/audio.js';
import { Trophy, RotateCcw, Check, X, Shield, HelpCircle, UserCheck } from 'lucide-react';
import CinematicAtmosphere from './CinematicAtmosphere';

export default function GameZone() {
  const [activeTab, setActiveTab] = useState('trivia'); // 'trivia' | 'guess'
  
  // Trivia State
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState(null);
  const [isTriviaAnswered, setIsTriviaAnswered] = useState(false);
  const [triviaFinished, setTriviaFinished] = useState(false);

  // Guess the Hero State
  const [guessIndex, setGuessIndex] = useState(0);
  const [guessScore, setGuessScore] = useState(0);
  const [selectedGuessOption, setSelectedGuessOption] = useState(null);
  const [isGuessAnswered, setIsGuessAnswered] = useState(false);
  const [guessFinished, setGuessFinished] = useState(false);

  // ── Trivia Actions ──
  const handleSelectTrivia = (optionIdx) => {
    if (isTriviaAnswered) return;
    try { clockAudio.tick(0); } catch (e) {}
    setSelectedTriviaOption(optionIdx);
    setIsTriviaAnswered(true);
    if (optionIdx === TRIVIA_QUESTIONS[triviaIndex].answer) {
      setTriviaScore((prev) => prev + 1);
    }
  };

  const handleNextTrivia = () => {
    try { clockAudio.tick(0); } catch (e) {}
    if (triviaIndex + 1 < TRIVIA_QUESTIONS.length) {
      setTriviaIndex((prev) => prev + 1);
      setSelectedTriviaOption(null);
      setIsTriviaAnswered(false);
    } else {
      setTriviaFinished(true);
    }
  };

  const handleResetTrivia = () => {
    try { clockAudio.tick(0); } catch (e) {}
    setTriviaIndex(0);
    setTriviaScore(0);
    setSelectedTriviaOption(null);
    setIsTriviaAnswered(false);
    setTriviaFinished(false);
  };

  // ── Guess the Hero Actions ──
  const handleSelectGuess = (optionName) => {
    if (isGuessAnswered) return;
    try { clockAudio.tick(0); } catch (e) {}
    setSelectedGuessOption(optionName);
    setIsGuessAnswered(true);
    if (optionName === GUESS_HEROES[guessIndex].name) {
      setGuessScore((prev) => prev + 1);
    }
  };

  const handleNextGuess = () => {
    try { clockAudio.tick(0); } catch (e) {}
    if (guessIndex + 1 < GUESS_HEROES.length) {
      setGuessIndex((prev) => prev + 1);
      setSelectedGuessOption(null);
      setIsGuessAnswered(false);
    } else {
      setGuessFinished(true);
    }
  };

  const handleResetGuess = () => {
    try { clockAudio.tick(0); } catch (e) {}
    setGuessIndex(0);
    setGuessScore(0);
    setSelectedGuessOption(null);
    setIsGuessAnswered(false);
    setGuessFinished(false);
  };

  const currentTrivia = TRIVIA_QUESTIONS[triviaIndex];
  const currentGuess = GUESS_HEROES[guessIndex];

  return (
    <section
      id="game-zone"
      aria-label="Avengers Doomsday Tactical Game Zone"
      className="relative py-14 sm:py-20 px-3 sm:px-6 lg:px-8 border-t border-[#1E2024] bg-[#08090B] overflow-hidden"
    >
      {/* Background Cinematic Atmosphere */}
      <CinematicAtmosphere
        poster="/doomsday-ensemble-poster.jpg"
        overlayOpacity="bg-[#08090B]/90"
        accentGlow="emerald"
      />

      <div className="container max-w-4xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="mb-8 sm:mb-12 text-center max-w-2xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 border border-[#1E2024] bg-[#111216]/90 text-[9px] xs:text-[10px] font-mono tracking-[0.24em] text-[#22C55E] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shrink-0" />
            TACTICAL SIMULATION // GAME ZONE
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-cinematic font-black tracking-tight text-white uppercase mb-2">
            GAME ZONE
          </h2>
          <p className="text-xs sm:text-sm font-body text-[#8C9098] leading-relaxed">
            Test your Multiverse Saga intelligence: canonical Secret Wars trivia and classified hero dossier recognition.
          </p>
        </div>

        {/* Game Mode Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6 sm:mb-8 select-none">
          <button
            type="button"
            onClick={() => {
              try { clockAudio.tick(0); } catch (e) {}
              setActiveTab('trivia');
            }}
            className={`px-4 sm:px-6 py-2 text-xs font-mono tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 border rounded-xs ${
              activeTab === 'trivia'
                ? 'border-white/50 bg-white/10 text-white font-bold shadow-md'
                : 'border-[#1E2024] bg-[#101115]/80 text-[#777A80] hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>MULTIVERSE TRIVIA</span>
          </button>

          <button
            type="button"
            onClick={() => {
              try { clockAudio.tick(0); } catch (e) {}
              setActiveTab('guess');
            }}
            className={`px-4 sm:px-6 py-2 text-xs font-mono tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 border rounded-xs ${
              activeTab === 'guess'
                ? 'border-white/50 bg-white/10 text-white font-bold shadow-md'
                : 'border-[#1E2024] bg-[#101115]/80 text-[#777A80] hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>GUESS THE CHARACTER</span>
          </button>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            GAME 1: MULTIVERSE TRIVIA QUIZ
           ═════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'trivia' && (
          <div className="border border-[#1E2024] bg-[#0E0F14]/95 p-4 sm:p-8 rounded-xs shadow-2xl">
            {!triviaFinished ? (
              <div>
                {/* Progress & Score Bar */}
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#1A1C22] text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-[#8C9098]">
                    QUESTION {triviaIndex + 1} OF {TRIVIA_QUESTIONS.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8C9098]">SCORE:</span>
                    <span className="text-white font-bold text-xs">{triviaScore}</span>
                  </div>
                </div>

                {/* Question */}
                <h3 className="text-base sm:text-xl font-cinematic font-bold text-white mb-6 leading-snug">
                  {currentTrivia.question}
                </h3>

                {/* 4 Answer Options */}
                <div className="space-y-2.5 mb-6">
                  {currentTrivia.options.map((option, idx) => {
                    const isSelected = selectedTriviaOption === idx;
                    const isCorrect = idx === currentTrivia.answer;

                    let btnStyle = "border-[#1E2024] bg-[#121319] text-[#D8D9DC] hover:border-white/40 hover:bg-[#181920]";
                    if (isTriviaAnswered) {
                      if (isCorrect) {
                        btnStyle = "border-[#22C55E] bg-[#22C55E]/15 text-white font-bold";
                      } else if (isSelected) {
                        btnStyle = "border-[#E62429] bg-[#E62429]/15 text-white font-bold";
                      } else {
                        btnStyle = "border-[#1E2024] bg-[#101116] text-[#55585E] opacity-60";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectTrivia(idx)}
                        disabled={isTriviaAnswered}
                        className={`w-full p-3 sm:p-4 text-left border rounded-xs text-xs sm:text-sm font-body transition-all flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-xs border border-white/10 bg-black/40 text-[10px] font-mono flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isTriviaAnswered && isCorrect && (
                          <Check className="w-4 h-4 text-[#22C55E] shrink-0" />
                        )}
                        {isTriviaAnswered && isSelected && !isCorrect && (
                          <X className="w-4 h-4 text-[#E62429] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation & Next Button */}
                {isTriviaAnswered && (
                  <div className="pt-4 border-t border-[#1A1C22] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
                    <p className="text-[11px] font-body text-[#8C9098] leading-relaxed max-w-lg">
                      <span className="text-[#22C55E] font-mono font-bold uppercase mr-1">DOSSIER DEBRIEF:</span>
                      {currentTrivia.explanation}
                    </p>
                    <button
                      type="button"
                      onClick={handleNextTrivia}
                      className="px-5 py-2.5 bg-white text-black text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#E5E7EB] transition-colors cursor-pointer shrink-0 rounded-xs flex items-center gap-2"
                    >
                      <span>{triviaIndex + 1 === TRIVIA_QUESTIONS.length ? 'FINISH' : 'NEXT QUESTION'}</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Trivia Result Reveal */
              <div className="text-center py-6 sm:py-10">
                <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-7 h-7 text-[#22C55E]" />
                </div>
                <h4 className="text-xl sm:text-2xl font-cinematic font-black text-white uppercase mb-1">
                  TACTICAL EVALUATION COMPLETE
                </h4>
                <p className="text-xs font-mono text-[#8C9098] tracking-widest uppercase mb-4">
                  {triviaScore >= 5 ? 'RANK: SUPREME MULTIVERSE STRATEGIST' : 'RANK: MULTIVERSE SURVIVOR'}
                </p>
                <div className="inline-block px-5 py-3 border border-[#1E2024] bg-black/60 rounded-xs mb-6">
                  <span className="text-2xl sm:text-3xl font-sans font-bold text-white tabular-nums">
                    {triviaScore}
                  </span>
                  <span className="text-sm font-mono text-[#777A80] ml-2 uppercase">
                    / {TRIVIA_QUESTIONS.length} CORRECT
                  </span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleResetTrivia}
                    className="px-6 py-2.5 bg-white text-black text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#E5E7EB] transition-colors cursor-pointer inline-flex items-center gap-2 rounded-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>PLAY AGAIN</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════════
            GAME 2: GUESS THE CHARACTER DOSSIER
           ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'guess' && (
          <div className="border border-[#1E2024] bg-[#0E0F14]/95 p-4 sm:p-8 rounded-xs shadow-2xl">
            {!guessFinished ? (
              <div>
                {/* Progress & Score Bar */}
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#1A1C22] text-[10px] font-mono uppercase tracking-wider">
                  <span className="text-[#8C9098]">
                    CLASSIFIED SUBJECT {guessIndex + 1} OF {GUESS_HEROES.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#8C9098]">SCORE:</span>
                    <span className="text-white font-bold text-xs">{guessScore}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
                  {/* Left: Mystery Avatar Frame */}
                  <div className="md:col-span-4 flex justify-center">
                    <div className="relative w-36 sm:w-44 aspect-[2/3] rounded-xs border border-[#262830] bg-black overflow-hidden shadow-xl">
                      <img
                        src={currentGuess.poster}
                        alt="Mystery Hero"
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isGuessAnswered
                            ? 'filter-none scale-100'
                            : 'filter brightness-0 contrast-200 blur-sm scale-110'
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                      {!isGuessAnswered && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl sm:text-4xl font-cinematic font-bold text-white/50 select-none">
                            ?
                          </span>
                        </div>
                      )}
                      {isGuessAnswered && (
                        <div className="absolute bottom-2 left-2 right-2 text-center">
                          <span className="text-[9px] font-mono font-bold text-white uppercase tracking-wider bg-black/80 px-2 py-0.5 border border-white/20">
                            {currentGuess.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Clues & Options */}
                  <div className="md:col-span-8">
                    <div className="mb-4">
                      <span className="text-[9px] font-mono text-[#8C9098] tracking-widest uppercase block mb-2 font-bold">
                        CLASSIFIED DOSSIER CLUES:
                      </span>
                      <ul className="space-y-1.5 text-xs font-body text-[#D1D5DB]">
                        {currentGuess.clues.map((clue, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#22C55E] font-mono text-xs">•</span>
                            <span>{clue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 4 Multiple Choice Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentGuess.options.map((opt, idx) => {
                        const isSelected = selectedGuessOption === opt;
                        const isCorrect = opt === currentGuess.name;

                        let btnStyle = "border-[#1E2024] bg-[#121319] text-[#D8D9DC] hover:border-white/40 hover:bg-[#181920]";
                        if (isGuessAnswered) {
                          if (isCorrect) {
                            btnStyle = "border-[#22C55E] bg-[#22C55E]/15 text-white font-bold";
                          } else if (isSelected) {
                            btnStyle = "border-[#E62429] bg-[#E62429]/15 text-white font-bold";
                          } else {
                            btnStyle = "border-[#1E2024] bg-[#101116] text-[#55585E] opacity-60";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelectGuess(opt)}
                            disabled={isGuessAnswered}
                            className={`p-3 text-left border rounded-xs text-xs font-body transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isGuessAnswered && isCorrect && (
                              <Check className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                            )}
                            {isGuessAnswered && isSelected && !isCorrect && (
                              <X className="w-3.5 h-3.5 text-[#E62429] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Next Button */}
                {isGuessAnswered && (
                  <div className="pt-4 border-t border-[#1A1C22] flex items-center justify-end">
                    <button
                      type="button"
                      onClick={handleNextGuess}
                      className="px-5 py-2.5 bg-white text-black text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#E5E7EB] transition-colors cursor-pointer rounded-xs flex items-center gap-2"
                    >
                      <span>{guessIndex + 1 === GUESS_HEROES.length ? 'FINISH' : 'NEXT DOSSIER'}</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guess Result Reveal */
              <div className="text-center py-6 sm:py-10">
                <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-[#22C55E]" />
                </div>
                <h4 className="text-xl sm:text-2xl font-cinematic font-black text-white uppercase mb-1">
                  RECOGNITION TRIAL COMPLETE
                </h4>
                <p className="text-xs font-mono text-[#8C9098] tracking-widest uppercase mb-4">
                  {guessScore >= 5 ? 'RANK: MASTER INTEL ARCHIVIST' : 'RANK: ROOKIE AGENT'}
                </p>
                <div className="inline-block px-5 py-3 border border-[#1E2024] bg-black/60 rounded-xs mb-6">
                  <span className="text-2xl sm:text-3xl font-sans font-bold text-white tabular-nums">
                    {guessScore}
                  </span>
                  <span className="text-sm font-mono text-[#777A80] ml-2 uppercase">
                    / {GUESS_HEROES.length} IDENTIFIED
                  </span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleResetGuess}
                    className="px-6 py-2.5 bg-white text-black text-xs font-mono font-bold tracking-wider uppercase hover:bg-[#E5E7EB] transition-colors cursor-pointer inline-flex items-center gap-2 rounded-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>PLAY AGAIN</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
