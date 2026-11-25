import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  Target,
  Flame,
  Check,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

const GRID_SIZE = 9; // 3x3 Combat Arena Grid
const ROUND_DURATION = 30; // 30 seconds

export default function HulkSmashGame({ onClose }) {
  const [gameState, setGameState] = useState('intro'); // 'intro' | 'playing' | 'paused' | 'gameover'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [combo, setCombo] = useState(1);
  const [highestCombo, setHighestCombo] = useState(1);
  const [targetsSmashed, setTargetsSmashed] = useState(0);
  const [decoysHit, setDecoysHit] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [slots, setSlots] = useState(Array(GRID_SIZE).fill(null));
  const [dialogue, setDialogue] = useState('HULK IS READY!');
  const [screenShake, setScreenShake] = useState(false);
  const [comicBursts, setComicBursts] = useState([]);
  const [floatingScores, setFloatingScores] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const gameTimerRef = useRef(null);
  const spawnTimerRef = useRef(null);
  const arenaRef = useRef(null);

  // Sync sound setting
  useEffect(() => {
    hulkAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  // Load high score from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('hulk_smash_high_score_v1');
      if (saved) setHighScore(parseInt(saved, 10) || 0);
    } catch (e) {}
  }, []);

  // Prevent background scrolling while game overlay is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (gameState === 'playing') setGameState('paused');
        else if (gameState === 'paused') setGameState('playing');
        else if (showHowToPlay) setShowHowToPlay(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, showHowToPlay, onClose]);

  // Automatically pause game if user switches tabs
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameState === 'playing') {
        setGameState('paused');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameState]);

  // Screen shake trigger helper
  const triggerScreenShake = useCallback(() => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 260);
  }, []);

  // Level determination: Level 1 (30-20s), Level 2 (20-10s), Level 3 (10-0s)
  const currentLevel = useMemo(() => {
    if (timeLeft > 20) return 1;
    if (timeLeft > 10) return 2;
    return 3;
  }, [timeLeft]);

  // Start / Restart Game
  const handleStartGame = () => {
    hulkAudio.playGameStart();
    setScore(0);
    setTimeLeft(ROUND_DURATION);
    setCombo(1);
    setHighestCombo(1);
    setTargetsSmashed(0);
    setDecoysHit(0);
    setTotalClicks(0);
    setSlots(Array(GRID_SIZE).fill(null));
    setComicBursts([]);
    setFloatingScores([]);
    setIsNewRecord(false);
    setDialogue(HULK_DIALOGUES.intro[Math.floor(Math.random() * HULK_DIALOGUES.intro.length)]);
    setGameState('playing');
  };

  // ── GAME LOOP: 1-SECOND TIMER ──
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

        // Low time alert (< 8s)
        if (prev <= 8) {
          hulkAudio.playTimerTick(true);
          if (prev % 3 === 0) {
            setDialogue(HULK_DIALOGUES.lowTime[Math.floor(Math.random() * HULK_DIALOGUES.lowTime.length)]);
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimerRef.current);
  }, [gameState]);

  // Handle Game Over transition when timeLeft hits 0
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      setGameState('gameover');
      hulkAudio.playGameOver();
      setDialogue(HULK_DIALOGUES.gameOver[Math.floor(Math.random() * HULK_DIALOGUES.gameOver.length)]);

      // Save high score
      if (score > highScore) {
        setIsNewRecord(true);
        setHighScore(score);
        try {
          localStorage.setItem('hulk_smash_high_score_v1', score.toString());
        } catch (e) {}
      }
    }
  }, [timeLeft, gameState, score, highScore]);

  // ── TARGET SPAWN LOOP ──
  useEffect(() => {
    if (gameState !== 'playing') {
      clearInterval(spawnTimerRef.current);
      return;
    }

    // Spawn speed increases per level
    const spawnInterval = currentLevel === 1 ? 1150 : currentLevel === 2 ? 880 : 680;

    spawnTimerRef.current = setInterval(() => {
      setSlots((currentSlots) => {
        const now = Date.now();
        const nextSlots = [...currentSlots];

        // 1. Remove expired items (older than 2.0s in L1, 1.6s in L2, 1.2s in L3)
        const lifespan = currentLevel === 1 ? 2100 : currentLevel === 2 ? 1700 : 1300;
        for (let i = 0; i < GRID_SIZE; i++) {
          if (nextSlots[i] && (now - nextSlots[i].spawnTime > lifespan || nextSlots[i].isSmashed)) {
            nextSlots[i] = null;
          }
        }

        // 2. Determine empty slots
        const emptyIndices = [];
        for (let i = 0; i < GRID_SIZE; i++) {
          if (!nextSlots[i]) emptyIndices.push(i);
        }

        if (emptyIndices.length === 0) return nextSlots;

        // 3. Number of items to spawn (1 in L1, 1-2 in L2, 2-3 in L3)
        const maxSpawns = currentLevel === 1 ? 1 : currentLevel === 2 ? 2 : 3;
        const spawnCount = Math.min(emptyIndices.length, Math.floor(Math.random() * maxSpawns) + 1);

        for (let s = 0; s < spawnCount; s++) {
          if (emptyIndices.length === 0) break;
          const randomIdx = Math.floor(Math.random() * emptyIndices.length);
          const slotIdx = emptyIndices.splice(randomIdx, 1)[0];

          // 78% Smash Target, 22% Decoy
          const isDecoy = Math.random() < (currentLevel === 1 ? 0.15 : 0.26);
          let targetTemplate;

          if (isDecoy) {
            targetTemplate = DECOYS[Math.floor(Math.random() * DECOYS.length)];
          } else {
            // Level 3 allows rare bonus gamma cell
            const pool = currentLevel === 3 ? SMASH_TARGETS : SMASH_TARGETS.filter((t) => !t.isBonus);
            targetTemplate = pool[Math.floor(Math.random() * pool.length)];
          }

          nextSlots[slotIdx] = {
            ...targetTemplate,
            instanceId: `${slotIdx}-${now}-${s}`,
            spawnTime: now,
            isSmashed: false,
          };
        }

        return nextSlots;
      });
    }, spawnInterval);

    return () => clearInterval(spawnTimerRef.current);
  }, [gameState, currentLevel]);

  // ── SMASH INTERACTION HANDLER ──
  const handleSmashSlot = (index, e) => {
    if (gameState !== 'playing') return;

    const target = slots[index];
    if (!target || target.isSmashed) return;

    // Multi-click prevention: immediately lock this slot
    setSlots((prev) => {
      const copy = [...prev];
      if (copy[index]) copy[index] = { ...copy[index], isSmashed: true };
      return copy;
    });

    setTotalClicks((prev) => prev + 1);

    // Compute click coordinates for FX
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX || rect.left + rect.width / 2;
    const clickY = e.clientY || rect.top + rect.height / 2;

    if (target.type === 'smash') {
      // ── CORRECT SMASH HIT ──
      const pointsEarned = target.points * combo;
      setScore((prev) => prev + pointsEarned);
      setTargetsSmashed((prev) => prev + 1);

      const nextCombo = Math.min(combo + 1, 10);
      setCombo(nextCombo);
      setHighestCombo((prev) => Math.max(prev, nextCombo));

      // Sound & Screen shake
      hulkAudio.playSmash(combo);
      triggerScreenShake();

      // Comic burst ("SMASH!", "BAM!")
      const comicWord = COMIC_WORDS[Math.floor(Math.random() * COMIC_WORDS.length)];
      const burstId = Date.now() + Math.random();
      setComicBursts((prev) => [...prev, { id: burstId, word: comicWord, x: clickX, y: clickY }]);
      setTimeout(() => {
        setComicBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 650);

      // Floating points pop
      const floatId = Date.now() + Math.random();
      setFloatingScores((prev) => [
        ...prev,
        { id: floatId, text: `+${pointsEarned}`, x: clickX, y: clickY, isPenalty: false },
      ]);
      setTimeout(() => {
        setFloatingScores((prev) => prev.filter((f) => f.id !== floatId));
      }, 600);

      // Audio combo chime & dialogue updates
      if (nextCombo >= 3 && nextCombo % 2 === 0) {
        hulkAudio.playComboChime(nextCombo);
        setDialogue(HULK_DIALOGUES.combo[Math.floor(Math.random() * HULK_DIALOGUES.combo.length)]);
      } else if (Math.random() < 0.45) {
        setDialogue(HULK_DIALOGUES.correct[Math.floor(Math.random() * HULK_DIALOGUES.correct.length)]);
      }
    } else {
      // ── DECOY / WRONG TARGET HIT (DO NOT SMASH!) ──
      setDecoysHit((prev) => prev + 1);
      setScore((prev) => Math.max(0, prev + target.penalty));
      setCombo(1); // Reset combo

      hulkAudio.playDecoyHit();

      // Floating penalty indicator
      const floatId = Date.now() + Math.random();
      setFloatingScores((prev) => [
        ...prev,
        { id: floatId, text: `${target.penalty}`, x: clickX, y: clickY, isPenalty: true },
      ]);
      setTimeout(() => {
        setFloatingScores((prev) => prev.filter((f) => f.id !== floatId));
      }, 600);

      setDialogue(HULK_DIALOGUES.wrong[Math.floor(Math.random() * HULK_DIALOGUES.wrong.length)]);
    }
  };

  // Calculate final rank
  const finalRank = useMemo(() => {
    return RANKS.find((r) => score >= r.minScore) || RANKS[RANKS.length - 1];
  }, [score]);

  // Accuracy calculation
  const accuracy = useMemo(() => {
    if (totalClicks === 0) return 0;
    return Math.min(100, Math.round((targetsSmashed / totalClicks) * 100));
  }, [targetsSmashed, totalClicks]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Hulk Smash Mayhem Mini-Game"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md select-none overflow-hidden"
    >
      {/* ── TOP NAV BAR (ALWAYS VISIBLE) ── */}
      <header className="absolute top-0 left-0 right-0 h-14 border-b border-[#1E252D] bg-[#07090C]/90 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between z-30">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 bg-[#12141A] hover:bg-white text-white hover:text-black border border-[#232731] text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-colors rounded-xs flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO WEBSITE</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
          <span className="text-xs sm:text-sm font-cinematic font-black text-white uppercase tracking-wider">
            HULK SMASH MAYHEM
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? 'Mute game sound' : 'Unmute game sound'}
            className="p-2 border border-[#232731] bg-[#12141A] text-[#8C9098] hover:text-white rounded-xs transition-colors cursor-pointer"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#22C55E]" /> : <VolumeX className="w-4 h-4 text-[#EF4444]" />}
          </button>

          {/* Close Game */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit Game"
            className="p-2 border border-[#232731] bg-[#12141A] text-[#8C9098] hover:text-white hover:border-[#EF4444] rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════════════
          1. INTRO / START SCREEN
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'intro' && (
        <div className="max-w-2xl w-full mx-4 p-6 sm:p-10 border border-[#10B981]/50 bg-[#090C0F] rounded-xs shadow-[0_20px_70px_rgba(0,255,136,0.2)] text-center relative z-20">
          {/* Hulk Avatar Header */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[#00FF88] shadow-[0_0_30px_rgba(0,255,136,0.6)]">
            <img src="/characters/hulk.jpg" alt="Hulk" className="w-full h-full object-cover" />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981]/20 border border-[#10B981]/60 text-[#34D399] text-[9.5px] font-mono tracking-widest uppercase font-bold rounded-xs mb-3">
            <Zap className="w-3.5 h-3.5 text-[#00FF88]" />
            <span>MARVEL ARCADE REFLEX MINI-GAME</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-cinematic font-black text-white uppercase tracking-tight mb-2">
            HULK SMASH MAYHEM
          </h2>

          <p className="text-xs sm:text-sm font-mono tracking-[0.2em] text-[#00FF88] uppercase font-bold mb-4">
            "HULK IS READY. ARE YOU?"
          </p>

          <p className="text-xs sm:text-sm font-body text-[#9CA3AF] max-w-lg mx-auto leading-relaxed mb-6">
            Rogue drones, windup combat toys, and runaway cargo are flooding the streets. Tap correct targets to rack up points and build massive combos. Avoid friendly citizens and rescue crews!
          </p>

          {/* High Score Banner */}
          {highScore > 0 && (
            <div className="mb-6 py-2 px-4 bg-[#0E1310] border border-[#22C55E]/40 rounded-xs inline-flex items-center gap-2 text-xs font-mono text-[#00FF88]">
              <Trophy className="w-4 h-4 text-[#EAB308]" />
              <span>CURRENT CITY HIGH SCORE: {highScore.toLocaleString()} PTS</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleStartGame}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#10B981] via-[#22C55E] to-[#00FF88] hover:scale-105 text-black font-mono font-black text-xs sm:text-sm tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(34,197,94,0.7)] cursor-pointer rounded-xs flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>START GAME (30 SECONDS)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHowToPlay(true)}
              className="w-full sm:w-auto px-6 py-4 bg-[#111318] hover:bg-[#1A1D24] border border-[#232731] hover:border-white/50 text-[#D8D9DC] text-xs font-mono font-bold tracking-wider uppercase transition-colors cursor-pointer rounded-xs flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-[#22C55E]" />
              <span>HOW TO PLAY</span>
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          2. HOW TO PLAY MODAL OVERLAY
         ═════════════════════════════════════════════════════════════════════ */}
      {showHowToPlay && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xl w-full bg-[#0C0E13] border border-[#22C55E]/60 p-6 sm:p-8 rounded-xs shadow-2xl text-left relative">
            <button
              type="button"
              onClick={() => setShowHowToPlay(false)}
              className="absolute top-4 right-4 text-[#8C9098] hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl sm:text-2xl font-cinematic font-black text-white uppercase mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00FF88]" />
              <span>MISSION BRIEFING & RULES</span>
            </h3>
            <p className="text-xs font-mono text-[#00FF88] uppercase mb-4">
              MASTER THE SMASH TO EARN THE LEGENDARY RANK
            </p>

            <div className="space-y-4 text-xs font-body text-[#9CA3AF] leading-relaxed mb-6">
              <div className="p-3 bg-[#08090C] border border-[#1E252D] rounded-xs">
                <span className="text-[#00FF88] font-bold font-mono uppercase block mb-1">
                  1. SMASH ROGUE TARGETS (+100 PTS x COMBO)
                </span>
                <p>
                  Click rogue robot toys, runaway carts, falling crates, and drones as fast as they spawn. Consecutive hits multiply your combo up to 10x!
                </p>
              </div>

              <div className="p-3 bg-[#08090C] border border-[#EF4444]/40 rounded-xs">
                <span className="text-[#EF4444] font-bold font-mono uppercase block mb-1">
                  2. DO NOT SMASH DECOYS (-50 PTS & RESET COMBO)
                </span>
                <p>
                  Friendly civilians, emergency rescue personnel, innocent puppies, and crates labeled "DO NOT SMASH" must be left alone. Striking them breaks your combo streak!
                </p>
              </div>

              <div className="p-3 bg-[#08090C] border border-[#1E252D] rounded-xs">
                <span className="text-white font-bold font-mono uppercase block mb-1">
                  3. 30-SECOND ROUND & DIFFICULTY PROGRESSION
                </span>
                <p>
                  The round lasts 30 seconds. In the final 10 seconds (Gamma Overdrive), targets spawn at maximum velocity. React fast for a world-class high score!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-3 bg-[#22C55E] hover:bg-[#10B981] text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-xs cursor-pointer text-center"
            >
              UNDERSTOOD // RETURN TO ARENA
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          3. ACTIVE GAMEPLAY ARENA
         ═════════════════════════════════════════════════════════════════════ */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div
          ref={arenaRef}
          className={`w-full max-w-4xl mx-auto px-3 sm:px-6 pt-16 pb-6 flex flex-col justify-between h-[90vh] transition-transform ${
            screenShake ? 'screen-shake-smash' : ''
          }`}
        >
          {/* Top HUD Bar */}
          <div className="border border-[#1E252D] bg-[#0A0D12]/95 p-3 sm:p-4 rounded-xs shadow-xl flex flex-wrap items-center justify-between gap-4">
            
            {/* Score & Multiplier */}
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[9px] font-mono text-[#8C9098] tracking-widest uppercase block">
                  SCORE
                </span>
                <span className="text-xl sm:text-3xl font-mono font-black text-white tracking-wider">
                  {score.toLocaleString()}
                </span>
              </div>

              {/* Combo Gauge */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#10B981]/15 border border-[#10B981]/50 rounded-xs">
                <Flame className={`w-4 h-4 ${combo > 1 ? 'text-[#00FF88] animate-bounce' : 'text-[#8C9098]'}`} />
                <span className="text-xs sm:text-sm font-mono font-black text-[#00FF88] tracking-wider">
                  COMBO x{combo}
                </span>
              </div>
            </div>

            {/* Level Badge */}
            <div className="hidden xs:flex items-center gap-1.5 px-3 py-1 bg-[#12141A] border border-[#232731] rounded-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EAB308]" />
              <span className="text-[10px] font-mono uppercase text-[#D8D9DC] font-semibold">
                {currentLevel === 1 ? 'LVL 1: STREET PATROL' : currentLevel === 2 ? 'LVL 2: CITY MAYHEM' : 'LVL 3: GAMMA OVERDRIVE'}
              </span>
            </div>

            {/* Timer & Controls */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[9px] font-mono text-[#8C9098] tracking-widest uppercase block">
                  TIME REMAINING
                </span>
                <span
                  className={`text-xl sm:text-3xl font-mono font-black tabular-nums ${
                    timeLeft <= 7 ? 'text-[#EF4444] animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-[#00FF88]'
                  }`}
                >
                  00:{timeLeft.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Pause Button */}
              <button
                type="button"
                onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
                className="p-2.5 border border-[#232731] bg-[#12141A] hover:bg-white text-[#D8D9DC] hover:text-black rounded-xs transition-colors cursor-pointer"
                title={gameState === 'playing' ? 'Pause Game' : 'Resume Game'}
              >
                {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Real-time Hulk Reaction Speech Bubble */}
          <div className="flex items-center justify-center my-2 select-none">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 border border-[#10B981]/50 bg-[#0A120E] text-[#00FF88] font-mono text-xs sm:text-sm font-bold uppercase rounded-full shadow-[0_0_15px_rgba(0,255,136,0.3)]">
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-ping" />
              <span>HULK SAYS: "{dialogue}"</span>
            </div>
          </div>

          {/* 3x3 Combat Grid Arena */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 flex-1 max-h-[500px] my-auto">
            {slots.map((item, idx) => {
              const isSmash = item?.type === 'smash';
              const isDecoy = item?.type === 'decoy';
              const isBonus = item?.isBonus;

              return (
                <div
                  key={idx}
                  onClick={(e) => handleSmashSlot(idx, e)}
                  role="button"
                  tabIndex={0}
                  className={`relative aspect-square border-2 rounded-xs flex flex-col items-center justify-center p-2 transition-all duration-150 cursor-pointer overflow-hidden ${
                    item
                      ? item.isSmashed
                        ? 'border-[#383C46] bg-[#0A0B0E] opacity-40 scale-95'
                        : isSmash
                        ? isBonus
                          ? 'border-[#00FF88] bg-[#0A1810] shadow-[0_0_25px_rgba(0,255,136,0.6)] scale-102 hover:scale-105'
                          : 'border-[#10B981] bg-[#08120B] shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:scale-103'
                        : 'border-[#EF4444] bg-[#160B0D] shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:scale-103'
                      : 'border-[#1A1D24] bg-[#07090C]/80 hover:border-[#2A2E38]'
                  }`}
                >
                  {item && !item.isSmashed ? (
                    <div className="w-full h-full flex flex-col items-center justify-between text-center animate-fade-in pointer-events-none">
                      {/* Top Badge */}
                      <span
                        className={`text-[7px] xs:text-[8px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-xs uppercase ${
                          isSmash
                            ? isBonus
                              ? 'bg-[#00FF88] text-black'
                              : 'bg-[#10B981] text-black'
                            : 'bg-[#EF4444] text-white animate-pulse'
                        }`}
                      >
                        {item.badge}
                      </span>

                      {/* Icon */}
                      <span className="text-3xl sm:text-5xl my-auto transition-transform">
                        {item.icon}
                      </span>

                      {/* Label & Points */}
                      <div className="w-full">
                        <p className="text-[9px] sm:text-[11px] font-cinematic font-bold text-white uppercase truncate">
                          {item.name}
                        </p>
                        <p
                          className={`text-[8px] font-mono font-bold ${
                            isSmash ? 'text-[#00FF88]' : 'text-[#EF4444]'
                          }`}
                        >
                          {isSmash ? `+${item.points * combo} PTS` : `${item.penalty} PTS`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* Empty Arena Pit Grid Markings */
                    <div className="w-full h-full flex items-center justify-center pointer-events-none opacity-20">
                      <span className="text-xs font-mono text-[#555862]">[{idx + 1}]</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Floating Comic FX & Points Popups */}
          {comicBursts.map((b) => (
            <div
              key={b.id}
              className="fixed pointer-events-none z-50 text-xl sm:text-3xl font-cinematic font-black text-[#00FF88] comic-word-burst drop-shadow-[0_0_15px_rgba(0,255,136,0.9)]"
              style={{ left: b.x - 40, top: b.y - 40 }}
            >
              {b.word}
            </div>
          ))}

          {floatingScores.map((f) => (
            <div
              key={f.id}
              className={`fixed pointer-events-none z-50 text-base sm:text-2xl font-mono font-black floating-score ${
                f.isPenalty
                  ? 'text-[#EF4444] drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                  : 'text-[#00FF88] drop-shadow-[0_0_10px_rgba(0,255,136,0.8)]'
              }`}
              style={{ left: f.x - 20, top: f.y - 30 }}
            >
              {f.text}
            </div>
          ))}

          {/* Pause Modal */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm z-40 flex items-center justify-center p-4">
              <div className="max-w-sm w-full bg-[#0C0E13] border border-[#232731] p-6 rounded-xs text-center shadow-2xl">
                <Pause className="w-10 h-10 text-[#00FF88] mx-auto mb-3" />
                <h3 className="text-2xl font-cinematic font-black text-white uppercase mb-1">
                  GAME PAUSED
                </h3>
                <p className="text-xs font-mono text-[#8C9098] mb-6">
                  CURRENT SCORE: {score.toLocaleString()} PTS
                </p>

                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGameState('playing')}
                    className="w-full py-3 bg-[#22C55E] hover:bg-[#10B981] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                  >
                    RESUME GAME
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 bg-[#12141A] hover:bg-[#1A1D24] border border-[#232731] text-[#D8D9DC] font-mono text-xs uppercase tracking-wider rounded-xs cursor-pointer"
                  >
                    EXIT TO WEBSITE
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          4. GAME OVER & RESULT SCREEN
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'gameover' && (
        <div className="max-w-xl w-full mx-4 p-6 sm:p-10 border-2 border-[#10B981] bg-[#0A0D11] rounded-xs shadow-[0_20px_80px_rgba(0,255,136,0.3)] text-center relative z-20 animate-fade-in">
          
          {/* Record Alert */}
          {isNewRecord && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#00FF88] text-black text-xs font-mono font-black tracking-widest uppercase rounded-xs mb-3 shadow-[0_0_15px_rgba(0,255,136,0.8)]">
              <Sparkles className="w-4 h-4 fill-black" />
              <span>★ NEW CITY RECORD ★</span>
            </div>
          )}

          <h2 className="text-3xl sm:text-5xl font-cinematic font-black text-white uppercase tracking-tight mb-1">
            ROUND COMPLETE
          </h2>

          <p className="text-xs font-mono text-[#00FF88] uppercase mb-4">
            HULK SAYS: "{dialogue}"
          </p>

          {/* Performance Rank Card */}
          <div
            className="p-4 border rounded-xs mb-6 shadow-inner"
            style={{ borderColor: `${finalRank.color}60`, backgroundColor: `${finalRank.color}10` }}
          >
            <span className="text-[9px] font-mono tracking-widest uppercase text-[#8C9098] block mb-1">
              PERFORMANCE RANK ACHIEVED
            </span>
            <h3
              className="text-2xl sm:text-3xl font-cinematic font-black uppercase tracking-wider"
              style={{ color: finalRank.color }}
            >
              {finalRank.title}
            </h3>
            <p className="text-xs font-body text-[#C4C7CE] mt-1">
              {finalRank.subtitle}
            </p>
          </div>

          {/* Detailed Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            <div className="p-3 bg-[#08090C] border border-[#1E252D] rounded-xs">
              <span className="text-[8px] font-mono text-[#8C9098] uppercase block">FINAL SCORE</span>
              <span className="text-lg sm:text-xl font-mono font-black text-white">
                {score.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-[#08090C] border border-[#1E252D] rounded-xs">
              <span className="text-[8px] font-mono text-[#8C9098] uppercase block">MAX COMBO</span>
              <span className="text-lg sm:text-xl font-mono font-black text-[#00FF88]">
                {highestCombo}x
              </span>
            </div>

            <div className="p-3 bg-[#08090C] border border-[#1E252D] rounded-xs">
              <span className="text-[8px] font-mono text-[#8C9098] uppercase block">TARGETS SMASHED</span>
              <span className="text-lg sm:text-xl font-mono font-black text-white">
                {targetsSmashed}
              </span>
            </div>

            <div className="p-3 bg-[#08090C] border border-[#1E252D] rounded-xs">
              <span className="text-[8px] font-mono text-[#8C9098] uppercase block">ACCURACY</span>
              <span className="text-lg sm:text-xl font-mono font-black text-white">
                {accuracy}%
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleStartGame}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#10B981] to-[#00FF88] text-black font-mono font-black text-xs uppercase tracking-widest rounded-xs cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.6)] flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>PLAY AGAIN</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#12141A] hover:bg-white text-white hover:text-black font-mono font-bold text-xs uppercase tracking-wider border border-[#232731] rounded-xs cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <span>BACK TO WEBSITE</span>
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
