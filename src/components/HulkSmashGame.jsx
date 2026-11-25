import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  SMASH_TARGETS,
  DECOYS,
  HULK_DIALOGUES,
  RANKS,
  COMIC_WORDS,
} from '../data/hulkGameData';
import { hulkAudio } from '../utils/hulkAudio';
import {
  X,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Pause,
  HelpCircle,
  Trophy,
  Zap,
  Flame,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const GRID_SIZE = 9; // 3x3 Combat Arena Grid
const ROUND_DURATION = 30; // 30 seconds

/**
 * Generates an updated 3x3 grid wave by pruning expired/smashed targets
 * and spawning new smash targets / decoys scaled by current level.
 */
function spawnArenaWave(currentSlots, level, { forceInitial = false } = {}) {
  const now = Date.now();
  const nextSlots = [...currentSlots];
  const lifespan = level === 1 ? 2200 : level === 2 ? 1700 : 1300;

  for (let i = 0; i < GRID_SIZE; i++) {
    if (nextSlots[i] && (now - nextSlots[i].spawnTime > lifespan || nextSlots[i].isSmashed)) {
      nextSlots[i] = null;
    }
  }

  const emptyIndices = [];
  for (let i = 0; i < GRID_SIZE; i++) {
    if (!nextSlots[i]) emptyIndices.push(i);
  }
  if (emptyIndices.length === 0) return nextSlots;

  const maxSpawns = level === 1 ? 2 : level === 2 ? 2 : 3;
  const minSpawns = forceInitial ? 2 : 1;
  const spawnCount = Math.min(
    emptyIndices.length,
    Math.max(minSpawns, Math.floor(Math.random() * maxSpawns) + 1)
  );

  for (let s = 0; s < spawnCount; s++) {
    if (emptyIndices.length === 0) break;
    const randomIdx = Math.floor(Math.random() * emptyIndices.length);
    const slotIdx = emptyIndices.splice(randomIdx, 1)[0];

    const decoyChance = level === 1 ? 0.18 : 0.25;
    const isDecoy = !forceInitial && Math.random() < decoyChance;

    let targetTemplate;
    if (isDecoy) {
      targetTemplate = DECOYS[Math.floor(Math.random() * DECOYS.length)];
    } else {
      const pool = level === 3 ? SMASH_TARGETS : SMASH_TARGETS.filter((t) => !t.isBonus);
      targetTemplate = pool[Math.floor(Math.random() * pool.length)];
    }

    nextSlots[slotIdx] = {
      ...targetTemplate,
      instanceId: `${slotIdx}-${now}-${s}-${Math.random().toString(36).slice(2, 6)}`,
      spawnTime: now,
      isSmashed: false,
    };
  }

  return nextSlots;
}

export default function HulkSmashGame({ onClose }) {
  // Game state: 'loading' | 'countdown' | 'playing' | 'paused' | 'gameover'
  const [gameState, setGameState] = useState('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState('[01/04] CALIBRATING GAMMA CORE...');
  const [countdownNumber, setCountdownNumber] = useState(3);

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [combo, setCombo] = useState(1);
  const [highestCombo, setHighestCombo] = useState(1);
  const [targetsSmashed, setTargetsSmashed] = useState(0);
  const [decoysHit, setDecoysHit] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [slots, setSlots] = useState(() => Array(GRID_SIZE).fill(null));
  const [dialogue, setDialogue] = useState('HULK IS READY!');
  const [screenShake, setScreenShake] = useState(false);
  const [comicBursts, setComicBursts] = useState([]);
  const [floatingScores, setFloatingScores] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [pausedByHelp, setPausedByHelp] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    try {
      const saved = localStorage.getItem('hulk_smash_high_score_v1');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const [isNewRecord, setIsNewRecord] = useState(false);

  const gameTimerRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const loadingTimerRef = useRef(null);
  const loadingDoneTimeoutRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const shakeTimeoutRef = useRef(null);

  // Sync sound setting
  useEffect(() => {
    hulkAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  // Helper to clear all active intervals/timeouts safely
  const clearAllTimers = useCallback(() => {
    clearInterval(gameTimerRef.current);
    clearInterval(spawnTimerRef.current);
    clearInterval(loadingTimerRef.current);
    clearTimeout(loadingDoneTimeoutRef.current);
    clearInterval(countdownTimerRef.current);
    clearTimeout(shakeTimeoutRef.current);
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  // Prevent background scrolling and support Escape key
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showHowToPlay) {
          setShowHowToPlay(false);
          if (pausedByHelp) {
            setPausedByHelp(false);
            setGameState('playing');
          }
        } else if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, showHowToPlay, pausedByHelp, onClose]);

  // Pause automatically if tab loses visibility during active gameplay
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameState === 'playing') {
        setGameState('paused');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameState]);

  const triggerScreenShake = useCallback(() => {
    clearTimeout(shakeTimeoutRef.current);
    setScreenShake(true);
    shakeTimeoutRef.current = setTimeout(() => setScreenShake(false), 260);
  }, []);

  // Level determination: Level 1 (30-21s), Level 2 (20-11s), Level 3 (10-0s)
  const currentLevel = useMemo(() => {
    if (timeLeft > 20) return 1;
    if (timeLeft > 10) return 2;
    return 3;
  }, [timeLeft]);

  // Start Active Gameplay
  const startActiveGame = useCallback(() => {
    clearInterval(countdownTimerRef.current);
    try { hulkAudio.playGameStart(); } catch { }
    setScore(0);
    setTimeLeft(ROUND_DURATION);
    setCombo(1);
    setHighestCombo(1);
    setTargetsSmashed(0);
    setDecoysHit(0);
    setTotalClicks(0);
    setComicBursts([]);
    setFloatingScores([]);
    setIsNewRecord(false);
    setSlots(spawnArenaWave(Array(GRID_SIZE).fill(null), 1, { forceInitial: true }));
    setDialogue(HULK_DIALOGUES.intro[Math.floor(Math.random() * HULK_DIALOGUES.intro.length)]);
    setGameState('playing');
  }, []);

  // Start Dramatic 3... 2... 1... SMASH! Countdown Sequence
  const startCountdownSequence = useCallback(() => {
    clearInterval(loadingTimerRef.current);
    clearTimeout(loadingDoneTimeoutRef.current);
    clearInterval(countdownTimerRef.current);
    clearInterval(gameTimerRef.current);
    clearInterval(spawnTimerRef.current);

    setShowHowToPlay(false);
    setPausedByHelp(false);
    setGameState('countdown');
    setCountdownNumber(3);
    try { hulkAudio.playCountdownBeep(false); } catch { }

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count === 0) {
        setCountdownNumber('SMASH!');
        try { hulkAudio.playCountdownBeep(true); } catch { }
        triggerScreenShake();
      } else if (count < 0) {
        clearInterval(countdownTimerRef.current);
        startActiveGame();
      } else {
        setCountdownNumber(count);
        try { hulkAudio.playCountdownBeep(false); } catch { }
      }
    }, 800);
  }, [startActiveGame, triggerScreenShake]);

  // Loading Sequence on launch
  useEffect(() => {
    if (gameState !== 'loading') return;

    try { hulkAudio.playChargingSweep(); } catch { }
    let currentPct = 0;

    loadingTimerRef.current = setInterval(() => {
      currentPct += Math.floor(Math.random() * 14) + 10;

      if (currentPct < 25) {
        setLoadingStatusText('[01/04] CALIBRATING GAMMA CORE & SUB-BASS TRANSDUCERS...');
      } else if (currentPct < 55) {
        setLoadingStatusText('[02/04] SCANNING 5TH AVENUE TARGET COORDINATES...');
      } else if (currentPct < 85) {
        setLoadingStatusText('[03/04] INJECTING CHITAURI DRONES, ROGUE BOTS & CIVILIAN EVACUATIONS...');
      } else {
        setLoadingStatusText('[04/04] ARENA ONLINE! HULK IS READY TO SMASH!');
      }

      if (currentPct >= 100) {
        clearInterval(loadingTimerRef.current);
        setLoadingProgress(100);
        loadingDoneTimeoutRef.current = setTimeout(() => {
          startCountdownSequence();
        }, 280);
      } else {
        setLoadingProgress(currentPct);
      }
    }, 105);

    return () => {
      clearInterval(loadingTimerRef.current);
      clearTimeout(loadingDoneTimeoutRef.current);
    };
  }, [gameState, startCountdownSequence]);

  const handleSkipLoading = () => {
    clearInterval(loadingTimerRef.current);
    clearTimeout(loadingDoneTimeoutRef.current);
    setLoadingProgress(100);
    startCountdownSequence();
  };

  // 1-Second Round Countdown Timer
  useEffect(() => {
    if (gameState !== 'playing') {
      clearInterval(gameTimerRef.current);
      return;
    }

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimerRef.current);
          return 0;
        }
        if (prev <= 8) {
          try { hulkAudio.playTimerTick(true); } catch { }
          if (prev % 3 === 0) {
            setDialogue(HULK_DIALOGUES.lowTime[Math.floor(Math.random() * HULK_DIALOGUES.lowTime.length)]);
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimerRef.current);
  }, [gameState]);

  // Game Over Trigger when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      clearInterval(spawnTimerRef.current);
      setGameState('gameover');
      try { hulkAudio.playGameOver(); } catch { }
      setDialogue(HULK_DIALOGUES.gameOver[Math.floor(Math.random() * HULK_DIALOGUES.gameOver.length)]);

      if (score > highScore) {
        setIsNewRecord(true);
        setHighScore(score);
        try {
          localStorage.setItem('hulk_smash_high_score_v1', score.toString());
        } catch { }
      }
    }
  }, [timeLeft, gameState, score, highScore]);

  // Target Spawn Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      clearInterval(spawnTimerRef.current);
      return;
    }

    const spawnInterval = currentLevel === 1 ? 1050 : currentLevel === 2 ? 820 : 620;

    spawnTimerRef.current = setInterval(() => {
      setSlots((currentSlots) => spawnArenaWave(currentSlots, currentLevel));
    }, spawnInterval);

    return () => clearInterval(spawnTimerRef.current);
  }, [gameState, currentLevel]);

  // Handle How-To-Play toggle cleanly (pauses active play without losing round)
  const handleOpenHowToPlay = () => {
    if (gameState === 'playing') {
      setPausedByHelp(true);
      setGameState('paused');
    }
    setShowHowToPlay(true);
  };

  const handleCloseHowToPlay = () => {
    setShowHowToPlay(false);
    if (pausedByHelp) {
      setPausedByHelp(false);
      // Refresh targets cleanly on resume so stale pause timestamps don't vanish
      setSlots((prev) => spawnArenaWave(prev.map(() => null), currentLevel, { forceInitial: true }));
      setGameState('playing');
    }
  };

  // Smash Interaction Handler
  const handleSmashSlot = (index, e) => {
    if (gameState !== 'playing') return;

    const target = slots[index];
    if (!target || target.isSmashed) return;

    // Immediately lock clicked slot
    setSlots((prev) => {
      const copy = [...prev];
      if (copy[index]) copy[index] = { ...copy[index], isSmashed: true };
      return copy;
    });

    setTotalClicks((prev) => prev + 1);

    const rect = e?.currentTarget?.getBoundingClientRect?.() || {
      left: window.innerWidth / 2,
      top: window.innerHeight / 2,
      width: 100,
      height: 100,
    };
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    if (target.type === 'smash') {
      const nextCombo = Math.min(10, combo + 1);
      const pointsEarned = target.points * combo;

      setScore((s) => s + pointsEarned);
      setCombo(nextCombo);
      if (nextCombo > highestCombo) setHighestCombo(nextCombo);
      setTargetsSmashed((t) => t + 1);

      try {
        hulkAudio.playSmash(combo);
        if (combo > 1) hulkAudio.playComboChime(combo);
      } catch { }
      triggerScreenShake();

      const randomWord = COMIC_WORDS[Math.floor(Math.random() * COMIC_WORDS.length)];
      const burstId = `${Date.now()}-${Math.random()}`;
      setComicBursts((prev) => [
        ...prev.slice(-4),
        { id: burstId, word: randomWord, x: clickX, y: clickY, color: target.accent },
      ]);
      setTimeout(() => {
        setComicBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 650);

      const floatId = `${Date.now()}-${Math.random()}-pts`;
      setFloatingScores((prev) => [
        ...prev.slice(-4),
        { id: floatId, text: `+${pointsEarned}`, x: clickX, y: clickY, isPositive: true },
      ]);
      setTimeout(() => {
        setFloatingScores((prev) => prev.filter((f) => f.id !== floatId));
      }, 620);

      if (Math.random() < 0.4) {
        if (combo >= 4) {
          setDialogue(HULK_DIALOGUES.combo[Math.floor(Math.random() * HULK_DIALOGUES.combo.length)]);
        } else {
          setDialogue(HULK_DIALOGUES.correct[Math.floor(Math.random() * HULK_DIALOGUES.correct.length)]);
        }
      }
    } else {
      setScore((s) => Math.max(0, s + target.penalty));
      setCombo(1);
      setDecoysHit((d) => d + 1);

      try { hulkAudio.playDecoyHit(); } catch { }
      triggerScreenShake();

      const floatId = `${Date.now()}-${Math.random()}-pen`;
      setFloatingScores((prev) => [
        ...prev.slice(-4),
        { id: floatId, text: `${target.penalty}`, x: clickX, y: clickY, isPositive: false },
      ]);
      setTimeout(() => {
        setFloatingScores((prev) => prev.filter((f) => f.id !== floatId));
      }, 620);

      setDialogue(HULK_DIALOGUES.wrong[Math.floor(Math.random() * HULK_DIALOGUES.wrong.length)]);
    }
  };

  const finalRank = useMemo(() => {
    for (const rank of RANKS) {
      if (score >= rank.minScore) return rank;
    }
    return RANKS[RANKS.length - 1];
  }, [score]);

  const accuracy = useMemo(() => {
    if (totalClicks === 0) return 0;
    return Math.round((targetsSmashed / totalClicks) * 100);
  }, [targetsSmashed, totalClicks]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Hulk Smash Mayhem Mini-Game"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden select-none"
    >
      {/* ── TOP NAV HEADER ── */}
      <header className="w-full px-4 sm:px-8 py-3 border-b border-[#1E252D] bg-[#0A0D12]/90 flex items-center justify-between z-30 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-mono text-[#8C9098] hover:text-[#00FF88] transition-colors inline-flex items-center gap-1.5 cursor-pointer uppercase"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO WEBSITE</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
          <span className="text-xs sm:text-sm font-cinematic font-black text-white uppercase tracking-wider">
            HULK SMASH MAYHEM
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* How To Play Button */}
          <button
            type="button"
            onClick={handleOpenHowToPlay}
            aria-label="How to play"
            className="p-2 border border-[#232731] bg-[#12141A] text-[#8C9098] hover:text-[#00FF88] hover:border-[#00FF88]/50 rounded-sm transition-colors cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? 'Mute game sound' : 'Unmute game sound'}
            className="p-2 border border-[#232731] bg-[#12141A] text-[#8C9098] hover:text-white rounded-sm transition-colors cursor-pointer"
            title={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#22C55E]" /> : <VolumeX className="w-4 h-4 text-[#EF4444]" />}
          </button>

          {/* Close Game */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit Game"
            className="p-2 border border-[#232731] bg-[#12141A] text-[#8C9098] hover:text-white hover:border-[#EF4444] rounded-sm transition-colors cursor-pointer"
            title="Close Game"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════════════
          1. CINEMATIC GAMMA LOADING SCREEN
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-20">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-6 rounded-full overflow-hidden border-2 border-[#00FF88] shadow-[0_0_40px_rgba(0,255,136,0.8)] gamma-glow-pulse">
            <img src="/characters/hulk.jpg" alt="Hulk" className="w-full h-full object-cover" />
          </div>

          <span className="text-[10px] font-mono tracking-[0.25em] text-[#00FF88] uppercase font-bold mb-2">
            AVENGERS TACTICAL COMBAT SIMULATOR
          </span>

          <h2 className="text-3xl sm:text-5xl font-cinematic font-black text-white uppercase tracking-tight mb-2">
            HULK SMASH MAYHEM
          </h2>

          <p className="text-xs sm:text-sm font-mono tracking-widest text-[#8C9098] uppercase mb-8">
            INITIALIZING 30-SECOND FAST REFLEX ARENA
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-md h-3 bg-[#0A0D12] border border-[#10B981]/60 rounded-full overflow-hidden p-0.5 shadow-inner mb-3 relative">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] via-[#22C55E] to-[#00FF88] rounded-full transition-all duration-150 ease-out shadow-[0_0_15px_rgba(0,255,136,0.9)]"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {/* Telemetry & Percentage */}
          <div className="flex items-center justify-between w-full max-w-md text-xs font-mono mb-6">
            <span className="text-[#9CA3AF] text-[10px] uppercase truncate max-w-[82%] text-left">
              {loadingStatusText}
            </span>
            <span className="text-[#00FF88] font-bold">
              {loadingProgress}%
            </span>
          </div>

          <button
            type="button"
            onClick={handleSkipLoading}
            className="px-5 py-2.5 bg-[#12141A] hover:bg-[#1A1D24] border border-[#232731] hover:border-[#00FF88] text-[#D8D9DC] hover:text-[#00FF88] text-[10px] font-mono font-bold tracking-widest uppercase transition-colors cursor-pointer rounded-sm inline-flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-[#00FF88]" />
            <span>SKIP &amp; SMASH NOW</span>
          </button>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          2. DRAMATIC COUNTDOWN OVERLAY (3... 2... 1... SMASH!)
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'countdown' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-20">
          <div className="text-[11px] font-mono tracking-[0.25em] text-[#00FF88] uppercase mb-4">
            GET READY TO SMASH
          </div>

          <div
            key={countdownNumber}
            className={`font-cinematic font-black tracking-tight leading-none text-center select-none countdown-zoom ${
              countdownNumber === 'SMASH!'
                ? 'text-5xl sm:text-8xl md:text-9xl text-[#00FF88] drop-shadow-[0_0_50px_rgba(0,255,136,0.9)]'
                : 'text-7xl sm:text-9xl md:text-[11rem] text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.6)]'
            }`}
          >
            {countdownNumber}
          </div>

          <p className="text-xs font-mono text-[#8C9098] uppercase mt-6 tracking-widest">
            {countdownNumber === 'SMASH!' ? 'TAP GREEN TARGETS • AVOID RED DECOYS!' : 'IDENTIFY CORRECT TARGETS • AVOID DECOYS'}
          </p>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          3. ACTIVE GAMEPLAY ARENA
         ═════════════════════════════════════════════════════════════════════ */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div
          className={`w-full max-w-4xl mx-auto px-3 sm:px-6 pt-3 pb-4 flex flex-col justify-between flex-1 min-h-0 transition-transform ${
            screenShake ? 'screen-shake-smash' : ''
          }`}
        >
          {/* Top HUD Bar */}
          <div className="border border-[#1E252D] bg-[#0A0D12]/95 p-3 sm:p-4 rounded-sm shadow-xl flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[9px] font-mono text-[#8C9098] tracking-widest uppercase block">
                  SCORE
                </span>
                <span className="text-xl sm:text-3xl font-mono font-black text-white tracking-wider tabular-nums">
                  {score.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#10B981]/15 border border-[#10B981]/50 rounded-sm">
                <Flame className={`w-4 h-4 ${combo > 1 ? 'text-[#00FF88] animate-bounce' : 'text-[#8C9098]'}`} />
                <span className="text-xs sm:text-sm font-mono font-black text-[#00FF88] tracking-wider">
                  COMBO x{combo}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#12141A] border border-[#232731] rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
              <span className="text-[10px] font-mono uppercase text-[#D8D9DC] font-semibold">
                {currentLevel === 1 ? 'LVL 1: STREET PATROL' : currentLevel === 2 ? 'LVL 2: CITY MAYHEM' : 'LVL 3: GAMMA OVERDRIVE'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[9px] font-mono text-[#8C9098] tracking-widest uppercase block">
                  TIME REMAINING
                </span>
                <span
                  className={`text-xl sm:text-3xl font-mono font-black tabular-nums ${
                    timeLeft <= 8
                      ? 'text-[#EF4444] animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                      : 'text-[#00FF88]'
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>

              <button
                type="button"
                onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
                className="p-2.5 bg-[#12141A] hover:bg-[#1A1D24] border border-[#232731] hover:border-white/50 text-white rounded-sm transition-colors cursor-pointer"
                title={gameState === 'playing' ? 'Pause Game' : 'Resume Game'}
                aria-label={gameState === 'playing' ? 'Pause Game' : 'Resume Game'}
              >
                {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
            </div>
          </div>

          {/* Hulk Live Dialogue Bubble */}
          <div className="my-2 py-1.5 px-4 bg-[#090C0F] border border-[#10B981]/30 rounded-sm flex items-center justify-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] shadow-[0_0_8px_rgba(0,255,136,0.9)] shrink-0" />
            <span className="text-xs sm:text-sm font-cinematic font-black text-[#00FF88] uppercase tracking-wider truncate">
              HULK: &ldquo;{dialogue}&rdquo;
            </span>
          </div>

          {/* 3x3 Combat Arena Grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-2.5 sm:gap-4 flex-1 min-h-0 max-h-[540px] w-full my-auto">
            {slots.map((item, index) => {
              if (!item) {
                return (
                  <div
                    key={index}
                    className="relative rounded-sm border border-[#171A21] bg-[#07090C]/80 flex items-center justify-center shadow-inner overflow-hidden"
                  >
                    <div className="w-3 h-3 rounded-full border border-[#1E252D] opacity-30" />
                  </div>
                );
              }

              const isDecoy = item.type === 'decoy';

              return (
                <button
                  key={item.instanceId || index}
                  type="button"
                  onClick={(e) => handleSmashSlot(index, e)}
                  style={{ touchAction: 'manipulation' }}
                  aria-label={`${item.name} (${item.badge})`}
                  className={`relative rounded-sm border-2 p-2 sm:p-4 flex flex-col items-center justify-between cursor-pointer transition-all duration-150 transform active:scale-95 overflow-hidden select-none shadow-lg text-left ${
                    item.isSmashed
                      ? 'scale-90 opacity-20 border-white'
                      : isDecoy
                        ? 'border-[#EF4444]/70 bg-gradient-to-b from-[#1C0D0F] to-[#0E0607] hover:border-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        : 'border-[#10B981] bg-gradient-to-b from-[#0C1610] to-[#070D09] hover:border-[#00FF88] shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.03]'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="w-full flex items-center justify-between gap-1">
                    <span
                      className={`text-[7.5px] sm:text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider truncate ${
                        isDecoy
                          ? 'bg-[#EF4444]/20 border border-[#EF4444] text-[#EF4444]'
                          : 'bg-[#10B981]/20 border border-[#10B981] text-[#00FF88]'
                      }`}
                    >
                      {item.badge}
                    </span>

                    <span className="text-[8px] sm:text-[9.5px] font-mono font-bold text-[#8C9098] shrink-0">
                      {isDecoy ? `${item.penalty}` : `+${item.points * combo}`}
                    </span>
                  </div>

                  {/* Big Target Icon */}
                  <div className="text-3xl sm:text-5xl md:text-6xl my-auto leading-none">
                    {item.icon}
                  </div>

                  {/* Target Name */}
                  <div className="w-full text-center">
                    <span className="block text-[9px] sm:text-xs font-cinematic font-bold text-white uppercase truncate">
                      {item.name}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Bottom Game Tips */}
          <div className="mt-2 text-center text-[9px] sm:text-[10px] font-mono text-[#6B7280] uppercase tracking-wider flex flex-wrap items-center justify-center gap-2 sm:gap-3 shrink-0">
            <span className="text-[#22C55E]">SMASH GREEN: ROBOTS, DRONES, CARGO</span>
            <span>•</span>
            <span className="text-[#EF4444]">PROTECT RED: CIVILIANS, PUPPIES, CREWS</span>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          4. PAUSED MODAL OVERLAY
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'paused' && !showHowToPlay && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#0C0E13] border border-[#1E252D] p-6 rounded-sm shadow-2xl text-center">
            <h3 className="text-2xl font-cinematic font-black text-white uppercase mb-2">
              GAME PAUSED
            </h3>
            <p className="text-xs font-mono text-[#8C9098] uppercase mb-6">
              CURRENT SCORE: {score.toLocaleString()} PTS
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  setSlots((prev) => spawnArenaWave(prev.map(() => null), currentLevel, { forceInitial: true }));
                  setGameState('playing');
                }}
                className="w-full py-3 bg-[#22C55E] hover:bg-[#10B981] text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
              >
                RESUME SMASH
              </button>

              <button
                type="button"
                onClick={startCountdownSequence}
                className="w-full py-2.5 bg-[#12141A] hover:bg-[#1A1D24] border border-[#232731] text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
              >
                RESTART ROUND
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 border border-[#EF4444]/40 hover:bg-[#EF4444]/20 text-[#EF4444] font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
              >
                EXIT TO WEBSITE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          5. HOW TO PLAY MODAL OVERLAY
         ═════════════════════════════════════════════════════════════════════ */}
      {showHowToPlay && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#0C0E13] border border-[#22C55E]/60 p-6 sm:p-8 rounded-sm shadow-2xl text-left relative">
            <button
              type="button"
              onClick={handleCloseHowToPlay}
              aria-label="Close instructions"
              className="absolute top-4 right-4 text-[#8C9098] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl sm:text-2xl font-cinematic font-black text-white uppercase mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00FF88]" />
              <span>HOW TO PLAY</span>
            </h3>
            <p className="text-xs font-mono text-[#00FF88] uppercase mb-4">
              30 SECONDS TO PROVE HULK IS THE STRONGEST
            </p>

            <div className="space-y-3 text-xs font-body text-[#9CA3AF] leading-relaxed mb-6">
              <div className="p-3 bg-[#08090C] border border-[#10B981]/50 rounded-sm">
                <span className="text-[#00FF88] font-bold font-mono uppercase block mb-1">
                  1. SMASH GREEN TARGETS (+100 PTS x COMBO)
                </span>
                <p>
                  Tap rogue robots (🤖), Chitauri drones (🛸), cargo stacks (📦), and shopping carts (🛒) fast to stack combos up to x10!
                </p>
              </div>

              <div className="p-3 bg-[#08090C] border border-[#EF4444]/50 rounded-sm">
                <span className="text-[#EF4444] font-bold font-mono uppercase block mb-1">
                  2. AVOID RED DECOYS (-50 PTS &amp; COMBO RESET)
                </span>
                <p>
                  Never smash civilians (☕), first responders (🚑), puppies (🐶), or fragile displays (⚠️).
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCloseHowToPlay}
              className="w-full py-3 bg-[#22C55E] hover:bg-[#10B981] text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer text-center"
            >
              GOT IT — RETURN TO ARENA
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          6. GAME OVER & SCORE REPORT
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'gameover' && (
        <div className="flex-1 flex items-center justify-center p-4 relative z-20 overflow-y-auto">
          <div className="max-w-lg w-full bg-[#0A0D12] border-2 border-[#10B981] p-6 sm:p-8 rounded-sm shadow-[0_20px_70px_rgba(0,255,136,0.25)] text-center relative">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10B981]/20 border border-[#10B981] text-[#00FF88] text-[9.5px] font-mono tracking-widest uppercase font-bold rounded-sm mb-3">
              <Trophy className="w-4 h-4 text-[#EAB308]" />
              <span>ROUND COMPLETE // MISSION DEBRIEF</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-cinematic font-black text-white uppercase tracking-tight mb-1">
              FINAL SCORE
            </h3>

            <div className="text-4xl sm:text-6xl font-mono font-black text-[#00FF88] tracking-wider my-3 drop-shadow-[0_0_20px_rgba(0,255,136,0.7)] tabular-nums">
              {score.toLocaleString()}
            </div>

            {isNewRecord && (
              <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAB308]/20 border border-[#EAB308] text-[#EAB308] text-xs font-mono font-bold uppercase rounded-sm animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEW ALL-TIME CITY RECORD!</span>
              </div>
            )}

            {/* Rank Card */}
            <div className="p-4 bg-[#07090C] border border-[#1E252D] rounded-sm mb-6 text-left">
              <span className="text-[8.5px] font-mono text-[#8C9098] tracking-widest uppercase block mb-1">
                COMBAT PERFORMANCE RANK
              </span>
              <div
                className="text-lg sm:text-xl font-cinematic font-black uppercase tracking-wide mb-1"
                style={{ color: finalRank.color }}
              >
                {finalRank.title}
              </div>
              <p className="text-xs font-body text-[#9CA3AF]">
                {finalRank.subtitle}
              </p>
            </div>

            {/* Battle Stats Breakdown */}
            <div className="grid grid-cols-4 gap-2 p-3 bg-[#080B0F] border border-[#171A21] rounded-sm mb-6 text-center">
              <div>
                <span className="text-base sm:text-xl font-mono font-bold text-white block">
                  {targetsSmashed}
                </span>
                <span className="text-[7px] sm:text-[7.5px] font-mono text-[#8C9098] uppercase">
                  SMASHED
                </span>
              </div>
              <div>
                <span className="text-base sm:text-xl font-mono font-bold text-[#EF4444] block">
                  {decoysHit}
                </span>
                <span className="text-[7px] sm:text-[7.5px] font-mono text-[#8C9098] uppercase">
                  DECOYS HIT
                </span>
              </div>
              <div>
                <span className="text-base sm:text-xl font-mono font-bold text-[#00FF88] block">
                  x{highestCombo}
                </span>
                <span className="text-[7px] sm:text-[7.5px] font-mono text-[#8C9098] uppercase">
                  MAX COMBO
                </span>
              </div>
              <div>
                <span className="text-base sm:text-xl font-mono font-bold text-white block">
                  {accuracy}%
                </span>
                <span className="text-[7px] sm:text-[7.5px] font-mono text-[#8C9098] uppercase">
                  ACCURACY
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={startCountdownSequence}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#10B981] via-[#22C55E] to-[#00FF88] text-black font-mono font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 rounded-sm cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4 stroke-[3]" />
                <span>PLAY AGAIN</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#12141A] hover:bg-[#1A1D24] border border-[#232731] hover:border-white/50 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
              >
                BACK TO WEBSITE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── COMIC BURSTS POPUP OVERLAYS ── */}
      {comicBursts.map((burst) => (
        <div
          key={burst.id}
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${burst.x}px`, top: `${burst.y}px` }}
        >
          <div
            className="comic-word-burst font-cinematic font-black text-3xl sm:text-5xl uppercase drop-shadow-[0_0_15px_rgba(0,0,0,0.95)] whitespace-nowrap"
            style={{ color: burst.color || '#00FF88' }}
          >
            {burst.word}
          </div>
        </div>
      ))}

      {/* ── FLOATING SCORE POPUPS ── */}
      {floatingScores.map((float) => (
        <div
          key={float.id}
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${float.x}px`, top: `${float.y}px` }}
        >
          <div
            className={`floating-score font-mono font-black text-lg sm:text-2xl drop-shadow-[0_0_8px_rgba(0,0,0,0.95)] whitespace-nowrap ${
              float.isPositive ? 'text-[#00FF88]' : 'text-[#EF4444]'
            }`}
          >
            {float.text}
          </div>
        </div>
      ))}
    </div>
  );
}
