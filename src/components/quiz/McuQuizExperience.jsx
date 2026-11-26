import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Trophy,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Languages,
  Flame,
  Crown,
  FileQuestion,
  BarChart3,
  Settings,
  ChevronDown,
  Shield,
  Zap,
  RefreshCw,
  Clock,
  FastForward,
  Music,
} from 'lucide-react';
import {
  MCU_QUIZ_QUESTIONS,
  INFINITY_STONES,
  getFanRank,
  pickIronManComment,
  selectQuizSessionQuestions,
  pickBonusSwapQuestion,
} from '../../data/mcuQuizData.js';
import {
  loadQuizProgress,
  saveQuizSessionResult,
  resetQuizProgress,
  STONE_MILESTONES,
  computeUnlockedStones,
} from '../../utils/quizStorage.js';
import { useQuizAudio } from '../../utils/quizAudio.js';
import { useGameBgm, gameBgm } from '../../utils/gameBgm.js';
import StoneVaultAnimation from './StoneVaultAnimation';
import IronManHoloPanel from './IronManHoloPanel';
import RewardVaultModal from './RewardVaultModal';

const SESSION_LENGTH = 10;
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];
const RUSH_SECONDS = 15;
const FAST_ANSWER_SECONDS = 6;

const KEYWORD_HIGHLIGHT_RE =
  /\b(Iron Man|Tony Stark|Captain America|Steve Rogers|Thor|Mjolnir|Stormbreaker|Thanos|Hulk|Bruce Banner|Spider-Man|Peter Parker|Doctor Strange|Loki|Black Panther|T'Challa|Shuri|Wanda|Natasha|Black Widow|Hawkeye|Clint Barton|Nick Fury|Bucky Barnes|Winter Soldier|Ant-Man|Scott Lang|Star-Lord|Groot|Rocket|Vision|Ultron|Red Skull|Hela|Dormammu|Vibranium|Tesseract|Aether|Vormir|Wakanda|Asgard|Sakaar|Endgame|Infinity War|E\.D\.I\.T\.H\.|Shawarma|Baskin-Robbins|NoobMaster69|Quantumania)\b/gi;

function HighlightedPrompt({ text }) {
  if (!text) return null;
  const parts = String(text).split(KEYWORD_HIGHLIGHT_RE);
  return (
    <>
      {parts.map((part, i) => {
        const isHit = i % 2 === 1;
        return isHit ? (
          <span key={i} className="text-[#4ADE80] drop-shadow-[0_0_10px_rgba(74,222,128,0.35)]">
            {part}
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        );
      })}
    </>
  );
}

function getComboTier(streak) {
  if (streak >= 10) {
    return { mult: 5, label: 'MULTIVERSE OVERDRIVE!', badgeBg: 'border-[#FACC15] bg-[#2D2205] text-[#FDE047]' };
  }
  if (streak >= 7) {
    return { mult: 4, label: 'GODLIKE COMBO!', badgeBg: 'border-[#38BDF8] bg-[#082233] text-[#7DD3FC]' };
  }
  if (streak >= 5) {
    return { mult: 3, label: 'SUPER SOLDIER!', badgeBg: 'border-[#22C55E] bg-[#0A2616] text-[#86EFAC]' };
  }
  if (streak >= 3) {
    return { mult: 2, label: 'ON FIRE!', badgeBg: 'border-[#F97316] bg-[#2B1406] text-[#FDBA74]' };
  }
  if (streak === 2) {
    return { mult: 2, label: '2X COMBO', badgeBg: 'border-[#FB923C]/70 bg-[#231206] text-[#FED7AA]' };
  }
  return { mult: 1, label: null, badgeBg: '' };
}

function getNextStoneGoal(score, language) {
  const nextM = STONE_MILESTONES.find((m) => m.minScore > score);
  if (!nextM) return null;
  const stoneObj = INFINITY_STONES.find((s) => s.id === nextM.id);
  const name = stoneObj ? (stoneObj[language] || stoneObj.en).name.replace(' + Infinity Gauntlet', '') : nextM.id.toUpperCase();
  return {
    id: nextM.id,
    name,
    color: stoneObj?.color || '#22C55E',
    needed: nextM.minScore - score,
  };
}

function pickHypeCallout(streak, isFast, language) {
  const enPool = [
    'AVENGERS PRECISION!',
    'SMASHING IT!',
    'STARK GENIUS!',
    'VIBRANIUM SHARP!',
    'PURE MULTIVERSE IQ!',
  ];
  const taPool = [
    'MASS THALA!!',
    'VERITHANAM!!',
    'SEMA SHOT MACHI!',
    'THOR LEVEL!!',
    'PURE FAN POWER!',
  ];
  if (streak >= 5) {
    return language === 'ta' ? `UNSTOPPABLE ${streak}X STREAK!!` : `UNSTOPPABLE ${streak}X STREAK!!`;
  }
  if (isFast) {
    return language === 'ta' ? 'LIGHTNING SPEED!!' : 'LIGHTNING FAST!!';
  }
  const pool = language === 'ta' ? taPool : enPool;
  return pool[streak % pool.length];
}

export default function McuQuizExperience({ onClose, initialView = 'intro' }) {
  const [language, setLanguage] = useState('en'); // 'ta' | 'en'
  const [gameMode, setGameMode] = useState('fun'); // 'fun' | 'rush' | 'pro'
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [screen, setScreen] = useState(initialView === 'vault' ? 'intro' : 'intro'); // 'intro' | 'playing' | 'result'
  const [isVaultOpen, setIsVaultOpen] = useState(initialView === 'vault');
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [progress, setProgress] = useState(() => loadQuizProgress());

  // Session core state
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null); // null | 0..3 | -1 (timeout)
  const [showHint, setShowHint] = useState(false);

  // Addictive arcade & lifelines state
  const [xpScore, setXpScore] = useState(0);
  const [fastCount, setFastCount] = useState(0);
  const [lifelines, setLifelines] = useState({ snap: 2, swap: 2, shield: 1 });
  const [eliminatedOptions, setEliminatedOptions] = useState([]);
  const [shieldActive, setShieldActive] = useState(false);
  const [lastReaction, setLastReaction] = useState(null);
  const [rushTimeLeft, setRushTimeLeft] = useState(RUSH_SECONDS);

  // Active Milestone Animation + Post-Milestone queue
  const [activeStoneModal, setActiveStoneModal] = useState(null);
  const [vaultReplayStone, setVaultReplayStone] = useState(null);
  const [sessionComment, setSessionComment] = useState('');
  const pendingResultRef = useRef(false);
  const questionStartRef = useRef(Date.now());

  const audio = useQuizAudio();
  const { enabled: gameBgmEnabled, isPlaying: gameBgmPlaying, toggle: toggleGameBgm } = useGameBgm();

  // Start isolated Quiz BGM cleanly while website BGM is paused
  useEffect(() => {
    gameBgm.start('quiz');
    return () => {
      gameBgm.stop();
    };
  }, []);

  // Lock body scroll cleanly while full-screen quiz is mounted
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const currentQuestion = sessionQuestions[currentIndex] || null;
  const activeCopy = currentQuestion ? currentQuestion[language] || currentQuestion.en : null;

  const startNewQuizSession = useCallback(
    (overrideMode) => {
      const activeMode = overrideMode || gameMode;
      const freshProgress = loadQuizProgress();
      const picked = selectQuizSessionQuestions(freshProgress.recentQuestionIds, SESSION_LENGTH, activeMode);
      if (!picked.length) return;

      audio.next();
      pendingResultRef.current = false;
      questionStartRef.current = Date.now();
      setSessionQuestions(picked);
      setCurrentIndex(0);
      setScore(0);
      setStreak(0);
      setMaxStreak(0);
      setXpScore(0);
      setFastCount(0);
      setLifelines({ snap: 2, swap: 2, shield: 1 });
      setEliminatedOptions([]);
      setShieldActive(false);
      setLastReaction(null);
      setRushTimeLeft(RUSH_SECONDS);
      setAutoAdvance(activeMode === 'rush');
      setSelectedOption(null);
      setShowHint(false);
      setActiveStoneModal(null);
      setSessionComment('');
      setScreen('playing');
    },
    [audio, gameMode]
  );

  const finishAndSaveSession = useCallback(
    (finalScore, finalMaxStreak, questionsList) => {
      const rank = getFanRank(finalScore);
      const updated = saveQuizSessionResult({
        score: finalScore,
        totalQuestions: questionsList.length,
        maxStreak: finalMaxStreak,
        questionIds: questionsList.map((q) => q.id),
        language,
        rankId: rank.id,
      });
      setProgress(updated);
      setSessionComment(pickIronManComment(finalScore, language));
      setScreen('result');
      audio.holoComm();
    },
    [language, audio]
  );

  const handleAdvanceQuestion = useCallback(() => {
    if (selectedOption === null) return;
    audio.next();
    if (currentIndex + 1 < sessionQuestions.length) {
      questionStartRef.current = Date.now();
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowHint(false);
      setEliminatedOptions([]);
      setShieldActive(false);
      setLastReaction(null);
      setRushTimeLeft(RUSH_SECONDS);
    } else {
      finishAndSaveSession(score, maxStreak, sessionQuestions);
    }
  }, [selectedOption, currentIndex, sessionQuestions, score, maxStreak, finishAndSaveSession, audio]);

  const handleSelectAnswer = useCallback(
    (optionIdx) => {
      if (!currentQuestion || selectedOption !== null) return;
      if (eliminatedOptions.includes(optionIdx)) return;

      const elapsedSec = (Date.now() - questionStartRef.current) / 1000;
      const isFast = optionIdx >= 0 && elapsedSec <= FAST_ANSWER_SECONDS;

      setSelectedOption(optionIdx);
      const isRight = optionIdx === currentQuestion.correctIndex;

      if (isRight) {
        const nextScore = score + 1;
        const nextStreak = streak + 1;
        const nextMaxStreak = Math.max(maxStreak, nextStreak);
        const tier = getComboTier(nextStreak);
        const speedBonus = isFast ? 50 : 0;
        const xpGain = 100 * tier.mult + speedBonus;

        setScore(nextScore);
        setStreak(nextStreak);
        setMaxStreak(nextMaxStreak);
        setXpScore((x) => x + xpGain);
        if (isFast) setFastCount((f) => f + 1);

        setLastReaction({
          type: 'correct',
          callout: pickHypeCallout(nextStreak, isFast, language),
          xpDelta: xpGain,
          isFast,
          streak: nextStreak,
        });

        audio.correctStreak(nextStreak);
        if (isFast) {
          setTimeout(() => audio.speedBonus(), 150);
        }

        const hitMilestone = STONE_MILESTONES.find((m) => m.minScore === nextScore);
        if (hitMilestone) {
          const stoneObj = INFINITY_STONES.find((s) => s.id === hitMilestone.id);
          if (stoneObj) {
            if (currentIndex + 1 >= sessionQuestions.length) {
              pendingResultRef.current = { finalScore: nextScore, finalMaxStreak: nextMaxStreak };
            }
            setTimeout(() => {
              audio.stoneUnlock(stoneObj.id);
              setActiveStoneModal(stoneObj);
            }, 450);
          }
        }
      } else {
        const savedByShield = shieldActive && streak > 0;
        if (savedByShield) {
          audio.shieldBlock();
          setShieldActive(false);
          setLastReaction({
            type: 'shielded',
            callout:
              language === 'ta'
                ? `SHIELD UNGA ${streak}X STREAK-A KAAPAATHIDUCHU!`
                : `CAP SHIELD PROTECTED YOUR ${streak}X STREAK!`,
            xpDelta: 0,
            isFast: false,
            streak,
          });
        } else {
          setStreak(0);
          audio.incorrect();
          setLastReaction({
            type: optionIdx === -1 ? 'timeout' : 'wrong',
            callout:
              optionIdx === -1
                ? language === 'ta'
                  ? 'TIME OUT MACHI! SPEED YETHU!'
                  : "TIME'S UP! KEEP THE PACE!"
                : language === 'ta'
                  ? 'CLOSE MACHI! NEXT QUESTION-LA MASS KAATTU!'
                  : 'CLOSE! SHAKE IT OFF & BUILD THE NEXT STREAK!',
            xpDelta: 0,
            isFast: false,
            streak: 0,
          });
        }
      }
    },
    [
      currentQuestion,
      selectedOption,
      eliminatedOptions,
      score,
      streak,
      maxStreak,
      shieldActive,
      currentIndex,
      sessionQuestions.length,
      language,
      audio,
    ]
  );

  // Rush mode 15-second arcade countdown ticker
  useEffect(() => {
    if (screen !== 'playing' || gameMode !== 'rush' || selectedOption !== null || activeStoneModal || isVaultOpen) {
      return;
    }
    const timer = setInterval(() => {
      setRushTimeLeft((prev) => {
        if (prev <= 0.1) {
          clearInterval(timer);
          handleSelectAnswer(-1);
          return 0;
        }
        return Number((prev - 0.1).toFixed(1));
      });
    }, 100);
    return () => clearInterval(timer);
  }, [screen, gameMode, selectedOption, activeStoneModal, isVaultOpen, handleSelectAnswer]);

  // Optional Fast Auto-Advance after answer reveal
  useEffect(() => {
    if (screen !== 'playing' || !autoAdvance || selectedOption === null || activeStoneModal || isVaultOpen) {
      return;
    }
    // Give extra breathing room if a stone unlock timeout (450ms) is about to fire
    const hitStoneSoon = STONE_MILESTONES.some((m) => m.minScore === score && selectedOption === currentQuestion?.correctIndex);
    if (hitStoneSoon) return;

    const t = setTimeout(() => {
      handleAdvanceQuestion();
    }, 1650);
    return () => clearTimeout(t);
  }, [screen, autoAdvance, selectedOption, activeStoneModal, isVaultOpen, score, currentQuestion, handleAdvanceQuestion]);

  // Lifeline 1: Thanos 50/50 Snap (removes 2 wrong choices cleanly)
  const handleThanosSnap = () => {
    if (!currentQuestion || selectedOption !== null || lifelines.snap <= 0 || eliminatedOptions.length > 0) return;
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== currentQuestion.correctIndex);
    const first = wrongIndices.splice(Math.floor(Math.random() * wrongIndices.length), 1)[0];
    const second = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
    audio.thanosSnap();
    setEliminatedOptions([first, second]);
    setLifelines((l) => ({ ...l, snap: l.snap - 1 }));
  };

  // Lifeline 2: Time Stone Swap (replaces current question with a crisp Easy bonus question)
  const handleTimeSwap = () => {
    if (!currentQuestion || selectedOption !== null || lifelines.swap <= 0) return;
    const exclude = sessionQuestions.map((q) => q.id);
    const freshQ = pickBonusSwapQuestion(exclude);
    if (!freshQ) return;
    audio.timeRewind();
    questionStartRef.current = Date.now();
    setSessionQuestions((prev) => prev.map((item, idx) => (idx === currentIndex ? freshQ : item)));
    setEliminatedOptions([]);
    setShowHint(false);
    setRushTimeLeft(RUSH_SECONDS);
    setLifelines((l) => ({ ...l, swap: l.swap - 1 }));
  };

  // Lifeline 3: Captain America Streak Shield
  const handleArmShield = () => {
    if (selectedOption !== null || lifelines.shield <= 0 || shieldActive) return;
    audio.shieldBlock();
    setShieldActive(true);
    setLifelines((l) => ({ ...l, shield: l.shield - 1 }));
  };

  const handleContinueAfterStone = useCallback(() => {
    audio.next();
    setActiveStoneModal(null);
    if (pendingResultRef.current) {
      const { finalScore, finalMaxStreak } = pendingResultRef.current;
      pendingResultRef.current = false;
      finishAndSaveSession(finalScore, finalMaxStreak, sessionQuestions);
    }
  }, [audio, finishAndSaveSession, sessionQuestions]);

  // Keyboard navigation during gameplay & Escape handler
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (vaultReplayStone) {
          setVaultReplayStone(null);
          return;
        }
        if (isVaultOpen) {
          setIsVaultOpen(false);
          return;
        }
        if (showSettingsDropdown) {
          setShowSettingsDropdown(false);
          return;
        }
        if (screen === 'intro' || screen === 'result') {
          onClose();
        }
        return;
      }

      if (screen !== 'playing' || activeStoneModal || isVaultOpen) return;

      if (selectedOption === null) {
        const keyMap = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
        const idx = keyMap[e.key.toLowerCase()];
        if (idx !== undefined) {
          e.preventDefault();
          handleSelectAnswer(idx);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleAdvanceQuestion();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    screen,
    activeStoneModal,
    isVaultOpen,
    vaultReplayStone,
    showSettingsDropdown,
    selectedOption,
    handleSelectAnswer,
    handleAdvanceQuestion,
    onClose,
  ]);

  const finalRank = getFanRank(score);
  const isSuspended = score < 10;
  const comboTier = getComboTier(streak);
  const nextStone = getNextStoneGoal(score, language);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="MCU Ultimate Quiz Arena"
      className="fixed inset-0 z-50 bg-[#06080D] text-[#F5F5F5] flex flex-col overflow-hidden select-none"
    >
      {/* ═══════════════════════════════════════════════════════════
          LAYER 1: CINEMATIC BATTLEFIELD BACKGROUND ART
         ═══════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="/mcu-quiz-battleground.jpg"
          alt="Avengers Doomsday Battlefield"
          className="w-full h-full object-cover object-center filter brightness-[0.42] contrast-[1.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040609] via-[#05070C]/80 to-[#040609]/90" />
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background:
              streak >= 5
                ? 'radial-gradient(circle at 50% 25%, rgba(250,204,21,0.16) 0%, rgba(34,197,94,0.18) 38%, transparent 65%)'
                : 'radial-gradient(circle at 50% 25%, rgba(34,197,94,0.12) 0%, transparent 60%), radial-gradient(circle at 15% 75%, rgba(220,38,38,0.14) 0%, transparent 50%)',
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          LAYER 2: TOP AAA GAME HUD NAVIGATION BAR
         ═══════════════════════════════════════════════════════════ */}
      <header className="relative z-30 shrink-0 h-16 sm:h-20 px-3 sm:px-8 border-b border-[#1E2738]/80 bg-gradient-to-r from-[#080B12]/95 via-[#0A0E18]/95 to-[#080B12]/95 backdrop-blur-xl flex items-center justify-between gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
        {/* Left: Avengers 'A' Logo & Identity */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/20 bg-gradient-to-br from-[#222E3F] via-[#0E1522] to-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.12)] shrink-0">
            <span className="font-cinematic font-black text-xl sm:text-2xl text-white italic tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              A
            </span>
          </div>

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-cinematic font-black tracking-wider text-white uppercase truncate drop-shadow">
              MCU ULTIMATE QUIZ
            </h1>
            <p className="text-[8.5px] sm:text-[9.5px] font-mono tracking-[0.25em] text-[#86EFAC] uppercase leading-none">
              {screen === 'playing'
                ? `${gameMode === 'rush' ? 'CRAZY RUSH' : gameMode === 'pro' ? 'TRUE FAN PRO' : 'CHILL & FUN'} MODE`
                : 'TEST YOUR KNOWLEDGE'}
            </p>
          </div>
        </div>

        {/* Center: Nav Switcher OR Live Arcade Score Telemetry during play */}
        <div className="hidden lg:flex items-center p-1 border border-[#233145] bg-[#0A0E17]/90 rounded-full shadow-[0_0_25px_rgba(34,197,94,0.12)]">
          <button
            type="button"
            onClick={() => {
              if (screen === 'intro') startNewQuizSession();
            }}
            className={`px-5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer inline-flex items-center gap-2 ${
              screen === 'playing' || screen === 'intro'
                ? 'bg-gradient-to-r from-[#15803D] to-[#22C55E] text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <FileQuestion className="w-3.5 h-3.5" />
            <span>QUESTIONS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audio.tick();
              setIsVaultOpen(true);
            }}
            className="px-5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-[#94A3B8] hover:text-white transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>PROGRESS ({progress.unlockedStones.length}/6)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              audio.tick();
              setShowSettingsDropdown((s) => !s);
            }}
            className="px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase text-[#94A3B8] hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>SETTINGS</span>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Guest Avatar, Wall of Fame & Control Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {screen === 'playing' ? (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 border border-[#22C55E]/60 bg-[#0A2215] text-[#4ADE80] text-xs font-mono font-black tracking-wider rounded-full tabular-nums shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                ⚡ {xpScore.toLocaleString()} XP
              </span>
              {streak >= 2 && (
                <span className={`px-3 py-1.5 border text-xs font-mono font-black tracking-wider uppercase rounded-full inline-flex items-center gap-1 animate-pulse ${comboTier.badgeBg}`}>
                  <Flame className="w-3.5 h-3.5" />
                  <span>{streak}X STREAK</span>
                </span>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 border border-[#233145] bg-[#0C121D] rounded-full">
              <div className="w-7 h-7 rounded-full overflow-hidden border border-[#DC2626] bg-[#DC2626]/20 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-mono font-bold text-white">IM</span>
              </div>
              <span className="text-[10.5px] font-mono font-bold tracking-wider text-white uppercase">
                {language === 'ta' ? 'AVENGER GUEST' : 'GUEST PLAYER'}
              </span>
            </div>
          )}

          {/* Wall of Fame / Vault Button */}
          <button
            type="button"
            onClick={() => {
              audio.tick();
              setIsVaultOpen(true);
            }}
            className="h-9 sm:h-10 px-3 sm:px-4 border border-[#EAB308]/60 hover:border-[#FACC15] bg-gradient-to-r from-[#221B05] via-[#151104] to-[#221B05] hover:brightness-110 text-[#FDE047] text-[10.5px] font-mono font-bold tracking-wider uppercase rounded-full inline-flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(234,179,8,0.25)]"
          >
            <Crown className="w-4 h-4 text-[#FACC15]" />
            <span className="hidden xs:inline">WALL OF FAME</span>
          </button>

          {/* In-Game BGM Music Toggle */}
          <button
            type="button"
            onClick={() => {
              audio.tick();
              toggleGameBgm();
            }}
            aria-label={gameBgmEnabled ? 'Mute Quiz Music' : 'Enable Quiz Music'}
            className={`h-9 sm:h-10 px-2.5 sm:px-3 border rounded-full text-[10px] font-mono font-bold uppercase inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
              gameBgmEnabled
                ? 'border-[#22C55E]/60 bg-[#0B2315] text-[#4ADE80] shadow-[0_0_12px_rgba(34,197,94,0.22)]'
                : 'border-[#233145] bg-[#0E131E] text-[#64748B] hover:text-white'
            }`}
            title={gameBgmEnabled ? 'Quiz BGM Music: ON' : 'Quiz BGM Music: OFF'}
          >
            <Music className={`w-3.5 h-3.5 ${gameBgmEnabled && gameBgmPlaying ? 'animate-pulse' : ''}`} />
            <span className="hidden sm:inline">{gameBgmEnabled ? 'BGM ON' : 'BGM OFF'}</span>
          </button>

          {/* SFX Audio Toggle */}
          <button
            type="button"
            onClick={() => audio.toggle()}
            aria-label={audio.enabled ? 'Mute Quiz SFX' : 'Enable Quiz SFX'}
            className={`w-9 h-9 sm:w-10 sm:h-10 border rounded-full text-xs flex items-center justify-center cursor-pointer transition-colors ${
              audio.enabled
                ? 'border-[#22C55E]/60 bg-[#0B2315] text-[#4ADE80] shadow-[0_0_12px_rgba(34,197,94,0.25)]'
                : 'border-[#233145] bg-[#0E131E] text-[#64748B] hover:text-white'
            }`}
            title={audio.enabled ? 'Sound FX: ON' : 'Sound FX: OFF'}
          >
            {audio.enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Close Game Exit Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit MCU Ultimate Quiz"
            className="w-9 h-9 sm:w-10 sm:h-10 border border-[#28374D] hover:border-[#EF4444] bg-[#0E131E] hover:bg-[#EF4444] text-[#94A3B8] hover:text-white rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md"
            title="Exit to Main Site"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Settings Dropdown Popover */}
      {showSettingsDropdown && (
        <div
          className="absolute top-20 right-8 z-40 w-72 p-4 border border-[#2B3B52] bg-[#0A0E18]/[0.98] backdrop-blur-2xl rounded-[6px] shadow-[0_20px_50px_rgba(0,0,0,0.95)] animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#1E293B]">
            <span className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase font-bold">
              MISSION SETTINGS
            </span>
            <button
              type="button"
              onClick={() => setShowSettingsDropdown(false)}
              className="text-[#64748B] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mb-3">
            <span className="text-[9px] font-mono text-[#64748B] uppercase block mb-1.5">
              BRIEFING LANGUAGE
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setLanguage('en');
                  audio.tick();
                }}
                className={`py-1.5 px-2 text-xs font-mono font-bold rounded-[3px] border uppercase transition-colors ${
                  language === 'en'
                    ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#4ADE80]'
                    : 'border-[#1E293B] bg-[#0E131E] text-[#94A3B8]'
                }`}
              >
                ENGLISH
              </button>
              <button
                type="button"
                onClick={() => {
                  setLanguage('ta');
                  audio.tick();
                }}
                className={`py-1.5 px-2 text-xs font-mono font-bold rounded-[3px] border uppercase transition-colors ${
                  language === 'ta'
                    ? 'border-[#22C55E] bg-[#22C55E]/15 text-[#4ADE80]'
                    : 'border-[#1E293B] bg-[#0E131E] text-[#94A3B8]'
                }`}
              >
                TANGLISH
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">
              AUTO-NEXT FLOW
            </span>
            <button
              type="button"
              onClick={() => {
                audio.tick();
                setAutoAdvance((a) => !a);
              }}
              className="text-xs font-mono text-[#4ADE80] underline font-bold cursor-pointer"
            >
              {autoAdvance ? 'ENABLED' : 'MANUAL'}
            </button>
          </div>

          <div className="pt-2 mt-2 border-t border-[#1E293B] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase">
              QUIZ MUSIC (BGM)
            </span>
            <button
              type="button"
              onClick={() => {
                audio.tick();
                toggleGameBgm();
              }}
              className={`text-xs font-mono font-bold underline cursor-pointer ${
                gameBgmEnabled ? 'text-[#4ADE80]' : 'text-[#94A3B8]'
              }`}
            >
              {gameBgmEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          LAYER 3: MAIN VIEWPORT WITH DOOMSDAY SIDE ELEMENTS & ARENA
         ═══════════════════════════════════════════════════════════ */}
      <main className="relative z-20 flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 flex items-center justify-center">

        {/* Desktop Left Side Quote */}
        <div className="hidden xl:flex flex-col items-start justify-center fixed left-8 top-1/2 -translate-y-1/2 max-w-[210px] pointer-events-none opacity-80 select-none">
          <p className="text-[11px] font-mono tracking-[0.22em] text-[#94A3B8] uppercase leading-relaxed font-semibold">
            &ldquo;SOME QUESTIONS
            <br />
            ARE MORE POWERFUL
            <br />
            THAN A THOUSAND
            <br />
            WEAPONS&rdquo;
          </p>
          <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center mt-3 text-[10px] font-cinematic font-bold text-white">
            A
          </div>
        </div>

        {/* Desktop Right Side Doomsday Emblem */}
        <div className="hidden xl:flex flex-col items-center fixed right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-85 select-none">
          <div className="text-right">
            <span className="text-3xl font-cinematic font-black tracking-tight text-white uppercase italic block drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]">
              AVENGERS
            </span>
            <span className="text-xl font-cinematic font-black tracking-widest text-[#22C55E] uppercase block drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]">
              DOOMSDAY
            </span>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SCREEN 1: ENTRY SCREEN — LANGUAGE & ARCADE VIBE PICKER
           ═══════════════════════════════════════════════════════════ */}
        {screen === 'intro' && (
          <div className="w-full max-w-3xl border-2 border-[#26374D] bg-[#090D15]/95 backdrop-blur-xl rounded-[8px] shadow-[0_30px_100px_rgba(0,0,0,0.98),0_0_50px_rgba(34,197,94,0.12)] p-5 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-[#DC2626] via-[#22C55E] to-[#DC2626]" />

            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-3 border border-[#233347] bg-[#0C121E] text-[9.5px] font-mono tracking-[0.22em] text-[#34D399] uppercase rounded-full shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>INITIATE MCU PROTOCOL • 1000-QUESTION ARCHIVE</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-cinematic font-black text-white uppercase tracking-tight mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                WELCOME, AVENGER.
              </h2>
              <p className="text-xs sm:text-sm font-body text-[#CBD5E1] max-w-xl mx-auto leading-relaxed">
                {language === 'ta'
                  ? 'Short-aa, jolly-aa, full mass-aa Marvel questions! Streak build panni Infinity Stones thookku!'
                  : 'Short, punchy MCU trivia with Avengers power-ups, combo streaks & Infinity Stone unlocks!'}
              </p>
            </div>

            {/* Step 1: Language Selector Cards */}
            <div className="mb-5">
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-[0.22em] text-[#94A3B8] uppercase mb-2.5 font-bold">
                <Languages className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>1. SELECT MISSION LANGUAGE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('ta');
                    audio.tick();
                  }}
                  className={`p-4 border-2 rounded-[5px] text-left cursor-pointer transition-all duration-200 ${
                    language === 'ta'
                      ? 'border-[#22C55E] bg-gradient-to-br from-[#0B2516] to-[#06120B] shadow-[0_0_24px_rgba(34,197,94,0.22)]'
                      : 'border-[#1E293B] bg-[#0B0F18] hover:border-[#384E6E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm sm:text-base font-cinematic font-black text-white uppercase tracking-wide">
                      1. TANGlish
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase rounded-[2px] ${
                        language === 'ta' ? 'bg-[#22C55E] text-black' : 'bg-[#151D2A] text-[#94A3B8]'
                      }`}
                    >
                      {language === 'ta' ? 'SELECTED' : 'TAMIL-ENGLISH'}
                    </span>
                  </div>
                  <p className="text-[11px] font-body text-[#94A3B8] leading-snug">
                    Casual Tamil fan style, easy words, fiery combos &amp; Tony Stark roast!
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLanguage('en');
                    audio.tick();
                  }}
                  className={`p-4 border-2 rounded-[5px] text-left cursor-pointer transition-all duration-200 ${
                    language === 'en'
                      ? 'border-[#22C55E] bg-gradient-to-br from-[#0B2516] to-[#06120B] shadow-[0_0_24px_rgba(34,197,94,0.22)]'
                      : 'border-[#1E293B] bg-[#0B0F18] hover:border-[#384E6E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm sm:text-base font-cinematic font-black text-white uppercase tracking-wide">
                      2. ENGLISH
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[8.5px] font-mono font-bold uppercase rounded-[2px] ${
                        language === 'en' ? 'bg-[#22C55E] text-black' : 'bg-[#151D2A] text-[#94A3B8]'
                      }`}
                    >
                      {language === 'en' ? 'SELECTED' : 'STANDARD'}
                    </span>
                  </div>
                  <p className="text-[11px] font-body text-[#94A3B8] leading-snug">
                    Crisp, fast English MCU trivia across Infinity Saga &amp; Multiverse moments.
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Arcade Difficulty / Hype Mode Selector */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-[0.22em] text-[#94A3B8] uppercase mb-2.5 font-bold">
                <Zap className="w-3.5 h-3.5 text-[#FACC15]" />
                <span>2. CHOOSE GAME VIBE</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setGameMode('fun');
                    audio.tick();
                  }}
                  className={`p-3 border rounded-[5px] text-left cursor-pointer transition-all ${
                    gameMode === 'fun'
                      ? 'border-[#22C55E] bg-[#0A2215] shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                      : 'border-[#1E293B] bg-[#0B0F18] hover:border-[#384E6E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-cinematic font-black text-white uppercase">
                      CHILL &amp; FUN
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#22C55E]/20 text-[#86EFAC] font-bold">
                      EASY
                    </span>
                  </div>
                  <p className="text-[10.5px] font-body text-[#94A3B8]">
                    Iconic movie Qs first, zero timer stress, full power-ups!
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGameMode('rush');
                    audio.tick();
                  }}
                  className={`p-3 border rounded-[5px] text-left cursor-pointer transition-all ${
                    gameMode === 'rush'
                      ? 'border-[#FACC15] bg-[#211A06] shadow-[0_0_20px_rgba(234,179,8,0.22)]'
                      : 'border-[#1E293B] bg-[#0B0F18] hover:border-[#384E6E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-cinematic font-black text-white uppercase">
                      CRAZY RUSH
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#EAB308]/20 text-[#FDE047] font-bold">
                      15S BLITZ
                    </span>
                  </div>
                  <p className="text-[10.5px] font-body text-[#94A3B8]">
                    Fast 15s clock, rapid auto-flow &amp; blazing combo multipliers!
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGameMode('pro');
                    audio.tick();
                  }}
                  className={`p-3 border rounded-[5px] text-left cursor-pointer transition-all ${
                    gameMode === 'pro'
                      ? 'border-[#EF4444] bg-[#240B10] shadow-[0_0_20px_rgba(239,68,68,0.22)]'
                      : 'border-[#1E293B] bg-[#0B0F18] hover:border-[#384E6E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-cinematic font-black text-white uppercase">
                      TRUE FAN PRO
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#EF4444]/20 text-[#FCA5A5] font-bold">
                      HARD MIX
                    </span>
                  </div>
                  <p className="text-[10.5px] font-body text-[#94A3B8]">
                    Deep lore, Disney+ mysteries &amp; tough Phase 1–5 trivia.
                  </p>
                </button>
              </div>
            </div>

            {/* Power-ups Preview Pill Bar */}
            <div className="grid grid-cols-3 gap-2 p-3 mb-6 border border-[#202E42] bg-[#0B0F18] rounded-[4px] text-center text-[9.5px] font-mono text-[#CBD5E1] uppercase">
              <div className="flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
                <span>2X 50/50 SNAP</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>2X TIME SWAP</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>1X CAP SHIELD</span>
              </div>
            </div>

            {/* Launch Action Button */}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => startNewQuizSession()}
                className="mass-cta-btn w-full sm:w-auto min-w-[280px] h-[54px] px-9 border-2 border-[#22C55E] hover:border-white bg-gradient-to-r from-[#15803D] via-[#16A34A] to-[#22C55E] text-white font-display font-black text-sm tracking-[0.22em] uppercase rounded-[5px] shadow-[0_12px_40px_rgba(34,197,94,0.4)] hover:brightness-110 hover:scale-[1.02] transition-all cursor-pointer inline-flex items-center justify-center gap-3"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>START QUIZ</span>
                <ChevronRight className="w-5 h-5 stroke-[3]" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            SCREEN 2: CRAZY & ADDICTIVE 10-QUESTION ARENA
           ═══════════════════════════════════════════════════════════ */}
        {screen === 'playing' && currentQuestion && activeCopy && (
          <div className="w-full max-w-3xl my-auto animate-fade-in space-y-3">

            {/* ── LIVE COMBO, NEXT STONE GOAL & POWER-UPS BAR ── */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 border border-[#223447] bg-[#090E17]/90 backdrop-blur-md rounded-[6px] shadow-md">
              {/* Left: Score & Combo Status */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-[4px] border border-[#22C55E]/50 bg-[#0A2215] text-[10px] font-mono font-bold text-[#4ADE80] tabular-nums">
                  SCORE: {score}/{SESSION_LENGTH}
                </span>

                {comboTier.label ? (
                  <span className={`px-2.5 py-1 rounded-[4px] border text-[10px] font-mono font-black tracking-wider uppercase inline-flex items-center gap-1 ${comboTier.badgeBg} ${comboTier.glow}`}>
                    <Flame className="w-3 h-3" />
                    <span>{comboTier.label} ({comboTier.mult}X XP)</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-[#94A3B8] uppercase hidden xs:inline">
                    {language === 'ta' ? 'STREAK BUILD PANNU!' : 'BUILD A STREAK FOR 2X–5X XP!'}
                  </span>
                )}
              </div>

              {/* Right: Next Stone Goal Pill */}
              {nextStone ? (
                <div className="flex items-center gap-2 text-[9.5px] font-mono uppercase">
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: nextStone.color, boxShadow: `0 0 10px ${nextStone.color}` }}
                  />
                  <span className="text-[#CBD5E1]">
                    NEXT GEM: <strong className="text-white">{nextStone.name}</strong> ({nextStone.needed} LEFT)
                  </span>
                </div>
              ) : (
                <span className="text-[9.5px] font-mono font-bold text-[#FACC15] uppercase">
                  ALL 6 STONES UNLOCKED!
                </span>
              )}
            </div>

            {/* ── HEAVY MECH QUESTION CHASSIS ── */}
            <div className="relative border-2 border-[#2A3B52] bg-gradient-to-b from-[#0C121D]/95 via-[#080C14]/[0.98] to-[#060910] rounded-[8px] p-5 sm:p-7 shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(34,197,94,0.12)] overflow-hidden">

              {/* Rush Mode 15-Second Top Countdown Drain */}
              {gameMode === 'rush' && (
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#0D1522] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-100 ${
                      rushTimeLeft <= 4
                        ? 'bg-[#EF4444] shadow-[0_0_12px_#EF4444]'
                        : 'bg-gradient-to-r from-[#22C55E] to-[#FACC15]'
                    }`}
                    style={{ width: `${Math.max(0, (rushTimeLeft / RUSH_SECONDS) * 100)}%` }}
                  />
                </div>
              )}

              {/* Glowing Corner HUD Brackets */}
              <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#22C55E]/80 pointer-events-none" />
              <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#22C55E]/80 pointer-events-none" />
              <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#22C55E]/80 pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#22C55E]/80 pointer-events-none" />

              {/* Top Capsule Row: Question Counter + Progress Bar + Difficulty Status */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 mb-4 border-b border-[#1E293B]">

                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 border border-[#23354C] bg-[#0A101A] text-[11px] font-mono font-bold tracking-wider text-white uppercase rounded-full shadow-inner">
                    QUESTION {currentIndex + 1} OF {SESSION_LENGTH}
                  </div>

                  <div className="w-24 sm:w-40 h-2.5 bg-[#0D1522] rounded-full overflow-hidden border border-[#1E2B3E] shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-[#16A34A] to-[#4ADE80] rounded-full transition-all duration-300 shadow-[0_0_12px_#22C55E]"
                      style={{
                        width: `${((currentIndex + (selectedOption !== null ? 1 : 0)) / SESSION_LENGTH) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Right: Timer (in Rush) + Difficulty + Source + Hint */}
                <div className="flex flex-wrap items-center gap-2">
                  {gameMode === 'rush' && (
                    <span
                      className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-black tabular-nums inline-flex items-center gap-1 ${
                        rushTimeLeft <= 4
                          ? 'border-[#EF4444] bg-[#2B090D] text-[#FCA5A5] animate-pulse'
                          : 'border-[#FACC15]/60 bg-[#211A05] text-[#FDE047]'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>{rushTimeLeft.toFixed(1)}s</span>
                    </span>
                  )}

                  <div
                    className={`px-3 py-1 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm ${
                      currentQuestion.difficulty === 'Hard'
                        ? 'border-[#EF4444]/60 bg-[#EF4444]/15 text-[#FCA5A5]'
                        : currentQuestion.difficulty === 'Medium'
                          ? 'border-[#FACC15]/60 bg-[#EAB308]/15 text-[#FDE047]'
                          : 'border-[#22C55E]/60 bg-[#22C55E]/15 text-[#86EFAC]'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>{currentQuestion.difficulty.toUpperCase()}</span>
                  </div>

                  {activeCopy.hint && (
                    <button
                      type="button"
                      onClick={() => {
                        audio.tick();
                        setShowHint((h) => !h);
                      }}
                      className={`px-2.5 py-1 rounded-full border text-[9.5px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1 cursor-pointer transition-colors ${
                        showHint
                          ? 'border-[#EAB308] bg-[#EAB308]/20 text-[#FDE047]'
                          : 'border-[#28394E] bg-[#0E1522] text-[#94A3B8] hover:text-white'
                      }`}
                      title="Request free tactical hint"
                    >
                      <Lightbulb className="w-3 h-3 text-[#FACC15]" />
                      <span>{showHint ? 'HIDE' : 'HINT'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Movie Source Sub-Tag + Live Reaction Pop Toast */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-[9.5px] font-mono tracking-[0.18em] text-[#64748B] uppercase">
                  ARCHIVE // {currentQuestion.source}
                </span>

                {lastReaction && (
                  <span
                    className={`px-3 py-1 rounded-full border text-[10px] font-mono font-black uppercase tracking-wider animate-vault-unlock ${
                      lastReaction.type === 'correct'
                        ? 'border-[#4ADE80] bg-[#0C331D] text-[#86EFAC] shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                        : lastReaction.type === 'shielded'
                          ? 'border-[#38BDF8] bg-[#0A2638] text-[#7DD3FC]'
                          : 'border-[#EF4444]/60 bg-[#2B090D] text-[#FCA5A5]'
                    }`}
                  >
                    {lastReaction.callout}
                    {lastReaction.xpDelta > 0 ? ` • +${lastReaction.xpDelta} XP` : ''}
                  </span>
                )}
              </div>

              {/* Optional Hint Callout */}
              {showHint && activeCopy.hint && (
                <div className="mb-4 p-3.5 border border-[#EAB308]/50 bg-[#1D1706]/90 rounded-[4px] text-xs font-body text-[#FEF08A] shadow-md animate-fade-in">
                  <strong className="font-mono text-[10px] uppercase tracking-wider block text-[#FACC15] mb-1">
                    FRIDAY QUICK HINT:
                  </strong>
                  {activeCopy.hint}
                </div>
              )}

              {/* ── QUESTION PROMPT TEXT WITH HIGHLIGHTED MARVEL TERMS ── */}
              <h2 className="text-base sm:text-xl font-cinematic font-bold text-white leading-relaxed mb-5 tracking-wide drop-shadow">
                <HighlightedPrompt text={activeCopy.question} />
              </h2>

              {/* ── 3 AVENGERS LIFELINES (USABLE BEFORE ANSWERING) ── */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <button
                  type="button"
                  disabled={selectedOption !== null || lifelines.snap <= 0 || eliminatedOptions.length > 0}
                  onClick={handleThanosSnap}
                  className={`px-3 py-1.5 rounded-[4px] border text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all ${
                    selectedOption === null && lifelines.snap > 0 && eliminatedOptions.length === 0
                      ? 'border-[#A855F7]/70 bg-[#1D0B2B] hover:bg-[#31124A] text-[#E9D5FF] cursor-pointer shadow-[0_0_14px_rgba(168,85,247,0.22)]'
                      : 'border-[#1E2633] bg-[#090C12] text-[#475569] opacity-50 cursor-not-allowed'
                  }`}
                  title="Thanos Snap: Dusts 2 wrong options!"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span>50/50 SNAP ({lifelines.snap})</span>
                </button>

                <button
                  type="button"
                  disabled={selectedOption !== null || lifelines.swap <= 0}
                  onClick={handleTimeSwap}
                  className={`px-3 py-1.5 rounded-[4px] border text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all ${
                    selectedOption === null && lifelines.swap > 0
                      ? 'border-[#22C55E]/70 bg-[#0A2416] hover:bg-[#113D25] text-[#BBF7D0] cursor-pointer shadow-[0_0_14px_rgba(34,197,94,0.2)]'
                      : 'border-[#1E2633] bg-[#090C12] text-[#475569] opacity-50 cursor-not-allowed'
                  }`}
                  title="Time Stone: Swap for an easier bonus question!"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>TIME SWAP ({lifelines.swap})</span>
                </button>

                <button
                  type="button"
                  disabled={selectedOption !== null || lifelines.shield <= 0 || shieldActive}
                  onClick={handleArmShield}
                  className={`px-3 py-1.5 rounded-[4px] border text-[10px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all ${
                    shieldActive
                      ? 'border-[#38BDF8] bg-[#0B2D45] text-[#BAE6FD] shadow-[0_0_16px_rgba(56,189,248,0.4)]'
                      : selectedOption === null && lifelines.shield > 0
                        ? 'border-[#38BDF8]/65 bg-[#091C29] hover:bg-[#0E2B3E] text-[#BAE6FD] cursor-pointer'
                        : 'border-[#1E2633] bg-[#090C12] text-[#475569] opacity-50 cursor-not-allowed'
                  }`}
                  title="Cap's Shield: Saves your streak if you miss!"
                >
                  <Shield className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>{shieldActive ? 'SHIELD ARMED!' : `CAP SHIELD (${lifelines.shield})`}</span>
                </button>
              </div>

              {/* ── 4 CHAMFERED METALLIC ANSWER CARDS ── */}
              <div className="grid grid-cols-1 gap-3 mb-5">
                {activeCopy.options.map((optText, idx) => {
                  const isEliminated = eliminatedOptions.includes(idx);
                  const isLocked = selectedOption !== null || isEliminated;
                  const isPicked = selectedOption === idx;
                  const isCorrectOpt = idx === currentQuestion.correctIndex;

                  let cardStyle =
                    'border-[#26374D] bg-gradient-to-r from-[#0F1622] to-[#0A0F18] text-[#E2E8F0] hover:border-[#38BDF8]/70 hover:shadow-[0_0_25px_rgba(56,189,248,0.2)] cursor-pointer';
                  let badgeStyle =
                    'border-[#3A4E6B] bg-[#141C2B] text-[#94A3B8] group-hover:border-[#38BDF8] group-hover:text-white';
                  let iconElement = (
                    <div className="w-5 h-5 rounded-full border border-[#3A4E6B] shrink-0" />
                  );

                  if (isEliminated) {
                    cardStyle =
                      'border-[#2A1B33] bg-[#09070C] text-[#475569] opacity-35 line-through cursor-not-allowed';
                    badgeStyle = 'border-[#3B1F4E] bg-[#140B1C] text-[#6B21A8]';
                    iconElement = <span className="text-[9px] font-mono text-[#9333EA]">DUSTED</span>;
                  } else if (selectedOption !== null) {
                    cardStyle = 'cursor-default ';
                    if (isCorrectOpt) {
                      cardStyle +=
                        'border-2 border-[#22C55E] bg-gradient-to-r from-[#0B2516] via-[#0E2F1C] to-[#091D11] text-white shadow-[0_0_35px_rgba(34,197,94,0.4)] animate-emerald-pulse';
                      badgeStyle =
                        'border-[#22C55E] bg-[#22C55E] text-black font-black shadow-[0_0_15px_#22C55E]';
                      iconElement = (
                        <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0 shadow-[0_0_15px_#22C55E]">
                          <CheckCircle2 className="w-4 h-4 text-black stroke-[3]" />
                        </div>
                      );
                    } else if (isPicked) {
                      cardStyle +=
                        'border-2 border-[#EF4444] bg-gradient-to-r from-[#290B0F] via-[#21090C] to-[#160507] text-[#FEE2E2] shadow-[0_0_30px_rgba(239,68,68,0.35)]';
                      badgeStyle = 'border-[#EF4444] bg-[#EF4444] text-white font-black';
                      iconElement = (
                        <div className="w-6 h-6 rounded-full bg-[#EF4444] flex items-center justify-center shrink-0 shadow-[0_0_12px_#EF4444]">
                          <XCircle className="w-4 h-4 text-white stroke-[3]" />
                        </div>
                      );
                    } else {
                      cardStyle += 'border-[#182333] bg-[#070B12] text-[#64748B] opacity-55';
                      badgeStyle = 'border-[#1E2B3E] bg-[#0A0F18] text-[#475569]';
                      iconElement = (
                        <div className="w-5 h-5 rounded-full border border-[#1E2B3E] shrink-0 opacity-40" />
                      );
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isLocked}
                      onClick={() => handleSelectAnswer(idx)}
                      className={`relative w-full p-3.5 sm:p-[18px] rounded-[5px] border text-left flex items-center justify-between gap-3.5 transition-all duration-200 group quiz-3d-card ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`w-8 h-8 rounded-[4px] border-2 font-mono text-xs font-black flex items-center justify-center shrink-0 transition-colors ${badgeStyle}`}
                        >
                          {OPTION_LETTERS[idx]}
                        </span>
                        <span className="text-xs sm:text-sm font-body font-medium leading-relaxed">
                          {optText}
                        </span>
                      </div>
                      {iconElement}
                    </button>
                  );
                })}
              </div>

              {/* ── QUESTION FOOTER: AUTO-FLOW SWITCH + NEXT >> BUTTON ── */}
              <div className="pt-4 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      audio.tick();
                      setAutoAdvance((a) => !a);
                    }}
                    className={`px-3 py-1.5 rounded-full border text-[9.5px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                      autoAdvance
                        ? 'border-[#22C55E] bg-[#0A2416] text-[#86EFAC]'
                        : 'border-[#263547] bg-[#0B1018] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    <FastForward className="w-3 h-3" />
                    <span>AUTO-NEXT: {autoAdvance ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {selectedOption !== null && (
                  <button
                    type="button"
                    onClick={handleAdvanceQuestion}
                    className="mass-cta-btn px-6 py-2.5 border-2 border-[#22C55E] hover:border-white bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-display font-black text-xs tracking-[0.2em] uppercase rounded-[4px] inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105 shadow-[0_0_25px_rgba(34,197,94,0.4)]"
                  >
                    <span>
                      {currentIndex + 1 < sessionQuestions.length ? 'NEXT >>' : 'VIEW RESULT >>'}
                    </span>
                  </button>
                )}
              </div>

              {/* Explanation Reveal Callout */}
              {selectedOption !== null && (
                <div
                  className={`mt-4 p-4 rounded-[4px] border animate-fade-in ${
                    selectedOption === currentQuestion.correctIndex
                      ? 'border-[#22C55E]/40 bg-[#0B2516]/90'
                      : 'border-[#EF4444]/40 bg-[#290B0F]/90'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                    {selectedOption === currentQuestion.correctIndex ? (
                      <span className="text-[#4ADE80]">
                        {language === 'ta'
                          ? 'MASS CORRECT! +1 STONE POINT VAULT-LA ADD AAYIDUCHU!'
                          : 'VERIFIED CORRECT • +1 POINT REWARDED'}
                      </span>
                    ) : (
                      <span className="text-[#FCA5A5]">
                        {language === 'ta'
                          ? `SARIYANA ANSWER: ${OPTION_LETTERS[currentQuestion.correctIndex]}`
                          : `CORRECT ANSWER: ${OPTION_LETTERS[currentQuestion.correctIndex]}`}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-[13px] font-body text-[#CBD5E1] leading-relaxed">
                    {activeCopy.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            SCREEN 3: RESULT SCREEN (DOSSIER, XP & TONY STARK HOLOCOMM)
           ═══════════════════════════════════════════════════════════ */}
        {screen === 'result' && (
          <div className="w-full max-w-3xl space-y-5 my-auto animate-fade-in">
            {isSuspended && (
              <div className="border-2 border-[#DC2626] bg-gradient-to-r from-[#2B090D] via-[#140608] to-[#2B090D] p-5 sm:p-6 rounded-[6px] text-center shadow-[0_0_40px_rgba(220,38,38,0.35)]">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 bg-[#DC2626]/20 border border-[#EF4444]/60 text-[#FCA5A5] text-[9.5px] font-mono font-bold tracking-[0.22em] uppercase rounded-full">
                  <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
                  <span>CLEARANCE FAILED • SCORE BELOW 10</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase tracking-wide mb-2">
                  AVENGER TRAINING SUSPENDED
                </h2>
                <p className="text-xs sm:text-sm font-body text-[#E2E8F0] max-w-xl mx-auto">
                  {language === 'ta'
                    ? 'Poi Chill & Fun mode-la try pannunga machi! Next round-la easy-aa Infinity Stones thookkalam!'
                    : "Don't sweat it! Jump back into Chill & Fun mode with 50/50 Snap & Time Swap ready!"}
                </p>
              </div>
            )}

            <div className="border-2 border-[#26374D] bg-[#0A0E18]/95 rounded-[6px] p-5 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-[#1E293B]">
                <div>
                  <span className="text-[9.5px] font-mono tracking-[0.2em] text-[#34D399] uppercase block mb-1">
                    MISSION EVALUATION COMPLETE • {xpScore.toLocaleString()} ARCADE XP
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase">
                    {(finalRank[language] || finalRank.en).label}
                  </h2>
                  <p className="text-xs font-body text-[#94A3B8] mt-0.5">
                    {(finalRank[language] || finalRank.en).subtitle}
                  </p>
                </div>

                <div className="px-6 py-3 border-2 border-[#22C55E]/60 bg-[#0B1E13] rounded-[4px] text-center shrink-0 shadow-[0_0_25px_rgba(34,197,94,0.25)]">
                  <span className="text-[8.5px] font-mono text-[#86EFAC] uppercase block font-bold">
                    FINAL SCORE
                  </span>
                  <span className="text-3xl font-cinematic font-black text-white tabular-nums">
                    {score}
                    <span className="text-base text-[#64748B]"> / {SESSION_LENGTH}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
                <div className="p-3 border border-[#1E293B] bg-[#0B101A] rounded-[4px] text-center">
                  <span className="text-[8.5px] font-mono text-[#94A3B8] uppercase block">ARCADE XP</span>
                  <strong className="text-lg font-cinematic text-[#4ADE80] tabular-nums">
                    {xpScore.toLocaleString()}
                  </strong>
                </div>

                <div className="p-3 border border-[#1E293B] bg-[#0B101A] rounded-[4px] text-center">
                  <span className="text-[8.5px] font-mono text-[#94A3B8] uppercase block">LIGHTNING FAST</span>
                  <strong className="text-lg font-cinematic text-[#38BDF8] tabular-nums">{fastCount}</strong>
                </div>

                <div className="p-3 border border-[#1E293B] bg-[#0B101A] rounded-[4px] text-center">
                  <span className="text-[8.5px] font-mono text-[#94A3B8] uppercase block">ACCURACY</span>
                  <strong className="text-lg font-cinematic text-white tabular-nums">
                    {Math.round((score / SESSION_LENGTH) * 100)}%
                  </strong>
                </div>

                <div className="p-3 border border-[#1E293B] bg-[#0B101A] rounded-[4px] text-center">
                  <span className="text-[8.5px] font-mono text-[#94A3B8] uppercase block">MAX STREAK</span>
                  <strong className="text-lg font-cinematic text-[#FACC15] tabular-nums">{maxStreak}</strong>
                </div>
              </div>

              <div className="mb-6">
                <IronManHoloPanel
                  commentText={sessionComment}
                  score={score}
                  language={language}
                  isSuspended={isSuspended}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => startNewQuizSession()}
                  className="mass-cta-btn px-6 py-3 border-2 border-[#22C55E] hover:border-white bg-gradient-to-r from-[#16A34A] to-[#22C55E] text-white font-display font-black text-xs tracking-[0.2em] uppercase rounded-[4px] inline-flex items-center gap-2 cursor-pointer transition-all hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>PLAY AGAIN</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsVaultOpen(true)}
                    className="px-5 py-3 border border-[#EAB308]/60 hover:border-[#FACC15] bg-[#161205] text-[#FDE047] font-mono font-bold text-xs tracking-wider uppercase rounded-[4px] inline-flex items-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <Trophy className="w-4 h-4 text-[#FACC15]" />
                    <span>INSPECT VAULT</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-3 border border-[#2D3C52] hover:border-white bg-[#0E1522] text-[#94A3B8] hover:text-white font-mono font-bold text-xs tracking-wider uppercase rounded-[4px] cursor-pointer transition-colors"
                  >
                    MAIN SITE
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ═══════════════════════════════════════════════════════════
          MODAL OVERLAYS (STONE UNLOCK REVEAL & REWARDS VAULT)
         ═══════════════════════════════════════════════════════════ */}
      {activeStoneModal && (
        <StoneVaultAnimation
          stone={activeStoneModal}
          language={language}
          unlockedStoneIds={computeUnlockedStones(score)}
          onContinue={handleContinueAfterStone}
        />
      )}

      {vaultReplayStone && (
        <StoneVaultAnimation
          stone={vaultReplayStone}
          language={language}
          unlockedStoneIds={progress.unlockedStones}
          onContinue={() => setVaultReplayStone(null)}
        />
      )}

      {isVaultOpen && (
        <RewardVaultModal
          progress={progress}
          language={language}
          onReplayStone={(stone) => {
            setIsVaultOpen(false);
            setVaultReplayStone(stone);
          }}
          onResetProgress={() => {
            const cleared = resetQuizProgress();
            setProgress(cleared);
          }}
          onClose={() => setIsVaultOpen(false)}
        />
      )}
    </div>
  );
}
