import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  SMASH_TARGETS,
  DECOYS,
  HERO_ASSISTS,
  HULK_RAGE_TIERS,
  HULK_DIALOGUES,
  HULK_PROFILE,
  ALL_AVATARS,
  FEATURED_GAME_CAST,
  RANKS,
  COMIC_WORDS,
} from '../data/hulkGameData';
import { hulkAudio, SOUND_CATALOG } from '../utils/hulkAudio';
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
  Crosshair,
  ShieldAlert,
  Music,
  Mic,
  MicOff,
  Clock,
  Users,
  Search,
  Check,
  Upload,
  Trash2,
} from 'lucide-react';

const GRID_SIZE = 9; // 3x3 Combat Arena Grid
const ROUND_DURATION = 30; // 30 seconds
const AVATAR_STORAGE_KEY = 'hulk_smash_avatar_v1';

const AVATAR_CATEGORIES = [
  'ALL',
  'AVENGERS',
  'FANTASTIC FOUR',
  'THUNDERBOLTS',
  'GUARDIANS',
  'MULTIVERSE',
  'STREET & MYSTIC',
  'ANTAGONIST',
];

function loadSavedAvatar() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return ALL_AVATARS.find((a) => a.id === 'hulk') || HULK_PROFILE;
    const savedId = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (savedId) {
      const found = ALL_AVATARS.find((a) => a.id === savedId);
      if (found) return found;
    }
  } catch { }
  return ALL_AVATARS.find((a) => a.id === 'hulk') || { ...HULK_PROFILE, soundKey: 'hulkRoar' };
}

/**
 * Generates an updated 3x3 arena wave using Marvel Villain Threats and 12 Hero Allies.
 * Respects active Time Stone freeze so existing threats do not despawn prematurely.
 */
function spawnArenaWave(currentSlots, level, { forceInitial = false, isTimeFrozen = false } = {}) {
  const now = Date.now();
  const nextSlots = [...currentSlots];
  const lifespan = level === 1 ? 2300 : level === 2 ? 1750 : 1350;

  for (let i = 0; i < GRID_SIZE; i++) {
    const slot = nextSlots[i];
    if (!slot) continue;
    if (slot.isSmashed || (!isTimeFrozen && now - slot.spawnTime > (slot.lifespan || lifespan))) {
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

    const decoyChance = level === 1 ? 0.2 : 0.27;
    const isDecoy = !forceInitial && Math.random() < decoyChance;

    let template;
    if (isDecoy) {
      template = DECOYS[Math.floor(Math.random() * DECOYS.length)];
    } else {
      const pool = level >= 2 ? SMASH_TARGETS : SMASH_TARGETS.filter((t) => !t.isBonus);
      template = pool[Math.floor(Math.random() * pool.length)];
    }

    nextSlots[slotIdx] = {
      ...template,
      lifespan: template.isBonus ? Math.max(1050, lifespan - 250) : lifespan,
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
  const [loadingStatusText, setLoadingStatusText] = useState('[01/04] INITIALIZING BANNER GAMMA LAB...');
  const [audioLoadCount, setAudioLoadCount] = useState({ loaded: 0, total: SOUND_CATALOG.length });
  const [countdownNumber, setCountdownNumber] = useState(3);

  // Selectable Marvel Character Avatar (defaults to Hulk, switchable to any of 51 characters)
  const [activeAvatar, setActiveAvatar] = useState(loadSavedAvatar);
  const [avatarSearch, setAvatarSearch] = useState('');
  const [avatarCategory, setAvatarCategory] = useState('ALL');

  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_DURATION);
  const [combo, setCombo] = useState(1);
  const [highestCombo, setHighestCombo] = useState(1);
  const [targetsSmashed, setTargetsSmashed] = useState(0);
  const [decoysHit, setDecoysHit] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [teamUpsUsed, setTeamUpsUsed] = useState(0);
  const [teamUpCharge, setTeamUpCharge] = useState(50);

  const [isOverchargeActive, setIsOverchargeActive] = useState(false);
  const [isTimeFrozen, setIsTimeFrozen] = useState(false);

  const [slots, setSlots] = useState(() => Array(GRID_SIZE).fill(null));
  const [dialogue, setDialogue] = useState('HULK IS ALWAYS ANGRY. LET US SMASH!');
  const [screenShake, setScreenShake] = useState(false);
  const [comicBursts, setComicBursts] = useState([]);
  const [floatingScores, setFloatingScores] = useState([]);
  const [shockwaves, setShockwaves] = useState([]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSoundboard, setShowSoundboard] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [pausedByModal, setPausedByModal] = useState(false);
  const [lastPreviewSound, setLastPreviewSound] = useState(null);
  const [customAudioSlot, setCustomAudioSlot] = useState('hulkRoar');
  const [customOverrides, setCustomOverrides] = useState(() => hulkAudio.getCustomOverrides());
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');

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
  const overchargeTimeoutRef = useRef(null);
  const freezeTimeoutRef = useRef(null);
  const isTimeFrozenRef = useRef(false);

  useEffect(() => {
    isTimeFrozenRef.current = isTimeFrozen;
  }, [isTimeFrozen]);

  useEffect(() => {
    hulkAudio.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    hulkAudio.voiceEnabled = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    hulkAudio.preloadAll((progress) => {
      setAudioLoadCount({ loaded: progress.loaded, total: progress.total });
    }, [activeAvatar?.id]).then(() => {
      setCustomOverrides(hulkAudio.getCustomOverrides());
    });
  }, []);

  const clearAllTimers = useCallback(() => {
    clearInterval(gameTimerRef.current);
    clearInterval(spawnTimerRef.current);
    clearInterval(loadingTimerRef.current);
    clearTimeout(loadingDoneTimeoutRef.current);
    clearInterval(countdownTimerRef.current);
    clearTimeout(shakeTimeoutRef.current);
    clearTimeout(overchargeTimeoutRef.current);
    clearTimeout(freezeTimeoutRef.current);
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const triggerScreenShake = useCallback(() => {
    clearTimeout(shakeTimeoutRef.current);
    setScreenShake(true);
    shakeTimeoutRef.current = setTimeout(() => setScreenShake(false), 260);
  }, []);

  const spawnImpactVisuals = useCallback((x, y, { word, color, floatText, isPositive = true }) => {
    const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

    const waveId = `${uid}-wave`;
    setShockwaves((prev) => [...prev.slice(-4), { id: waveId, x, y, color: color || '#00FF88' }]);
    setTimeout(() => {
      setShockwaves((prev) => prev.filter((w) => w.id !== waveId));
    }, 560);

    if (word) {
      const burstId = `${uid}-burst`;
      setComicBursts((prev) => [...prev.slice(-4), { id: burstId, word, x, y, color: color || '#00FF88' }]);
      setTimeout(() => {
        setComicBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 650);
    }

    if (floatText) {
      const floatId = `${uid}-float`;
      setFloatingScores((prev) => [...prev.slice(-4), { id: floatId, text: floatText, x, y, isPositive }]);
      setTimeout(() => {
        setFloatingScores((prev) => prev.filter((f) => f.id !== floatId));
      }, 620);
    }
  }, []);

  const currentLevel = useMemo(() => {
    if (timeLeft > 20) return 1;
    if (timeLeft > 10) return 2;
    return 3;
  }, [timeLeft]);

  const currentRageTier = useMemo(() => {
    for (const tier of HULK_RAGE_TIERS) {
      if (combo >= tier.minCombo) return tier;
    }
    return HULK_RAGE_TIERS[HULK_RAGE_TIERS.length - 1];
  }, [combo]);

  const filteredAvatars = useMemo(() => {
    return ALL_AVATARS.filter((char) => {
      if (avatarCategory !== 'ALL' && char.category !== avatarCategory) return false;
      if (avatarSearch.trim()) {
        const q = avatarSearch.toLowerCase();
        return (
          char.name.toLowerCase().includes(q) ||
          char.alias.toLowerCase().includes(q) ||
          char.affiliation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [avatarCategory, avatarSearch]);

  const handleSelectAvatar = (char) => {
    setActiveAvatar(char);
    try {
      localStorage.setItem(AVATAR_STORAGE_KEY, char.id);
    } catch { }
    try {
      hulkAudio.init();
      hulkAudio.playCharacterVoice(char.id, { gain: 0.95, force: true });
    } catch { }
    setDialogue(
      char.id === 'hulk'
        ? 'HULK IS ALWAYS ANGRY. LET US SMASH!'
        : `${char.name.toUpperCase()}: "${char.voiceLine}"`
    );
    closeModalsSafely();
  };

  // Start Active Gameplay
  const startActiveGame = useCallback(() => {
    clearInterval(countdownTimerRef.current);
    clearTimeout(overchargeTimeoutRef.current);
    clearTimeout(freezeTimeoutRef.current);
    try {
      hulkAudio.playGameStart(activeAvatar?.id);
      hulkAudio.speakHulkLine(activeAvatar?.voiceLine || 'Hulk smash!');
    } catch { }

    setScore(0);
    setTimeLeft(ROUND_DURATION);
    setCombo(1);
    setHighestCombo(1);
    setTargetsSmashed(0);
    setDecoysHit(0);
    setTotalClicks(0);
    setTeamUpsUsed(0);
    setTeamUpCharge(50);
    setIsOverchargeActive(false);
    setIsTimeFrozen(false);
    setComicBursts([]);
    setFloatingScores([]);
    setShockwaves([]);
    setIsNewRecord(false);
    setSlots(spawnArenaWave(Array(GRID_SIZE).fill(null), 1, { forceInitial: true }));
    setDialogue(
      activeAvatar?.id === 'hulk'
        ? HULK_DIALOGUES.intro[Math.floor(Math.random() * HULK_DIALOGUES.intro.length)]
        : `${activeAvatar.name.toUpperCase()} & HULK DEPLOYED — SMASH VILLAINS!`
    );
    setGameState('playing');
  }, [activeAvatar]);

  // Dramatic 3... 2... 1... HULK SMASH! Countdown
  const startCountdownSequence = useCallback(() => {
    clearAllTimers();
    setShowHowToPlay(false);
    setShowSoundboard(false);
    setShowAvatarPicker(false);
    setPausedByModal(false);
    setGameState('countdown');
    setCountdownNumber(3);
    try { hulkAudio.playCountdownBeep(false); } catch { }

    let count = 3;
    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count === 0) {
        setCountdownNumber('HULK SMASH!');
        try {
          hulkAudio.playCountdownBeep(true);
          hulkAudio.playHulkRoar();
        } catch { }
        triggerScreenShake();
      } else if (count < 0) {
        clearInterval(countdownTimerRef.current);
        startActiveGame();
      } else {
        setCountdownNumber(count);
        try { hulkAudio.playCountdownBeep(false); } catch { }
      }
    }, 780);
  }, [clearAllTimers, startActiveGame, triggerScreenShake]);

  // Loading sequence on launch
  useEffect(() => {
    if (gameState !== 'loading') return;

    try { hulkAudio.playChargingSweep(); } catch { }
    let currentPct = 0;

    loadingTimerRef.current = setInterval(() => {
      currentPct += Math.floor(Math.random() * 14) + 12;

      if (currentPct < 28) {
        setLoadingStatusText('[01/04] CALIBRATING GAMMA CORE & SUB-BASS TRANSDUCERS...');
      } else if (currentPct < 58) {
        setLoadingStatusText('[02/04] IMPORTING HULK ROAR & AVENGERS SFX AUDIO BANKS...');
      } else if (currentPct < 88) {
        setLoadingStatusText('[03/04] IMPORTING 51 MARVEL HERO & VILLAIN AVATARS...');
      } else {
        setLoadingStatusText('[04/04] ARENA ARMED — TELL HULK WHO TO SMASH!');
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

  // 1-Second Round Countdown Timer (respects Strange Time Freeze)
  useEffect(() => {
    if (gameState !== 'playing') {
      clearInterval(gameTimerRef.current);
      return;
    }

    gameTimerRef.current = setInterval(() => {
      if (isTimeFrozenRef.current) return;

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

  // Game Over Trigger
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      clearInterval(spawnTimerRef.current);
      clearTimeout(overchargeTimeoutRef.current);
      clearTimeout(freezeTimeoutRef.current);
      setIsOverchargeActive(false);
      setIsTimeFrozen(false);
      setGameState('gameover');
      try {
        hulkAudio.playGameOver();
        hulkAudio.speakHulkLine('Hulk wins!');
      } catch { }
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

    const spawnInterval = currentLevel === 1 ? 1020 : currentLevel === 2 ? 800 : 610;

    spawnTimerRef.current = setInterval(() => {
      setSlots((currentSlots) =>
        spawnArenaWave(currentSlots, currentLevel, { isTimeFrozen: isTimeFrozenRef.current })
      );
    }, spawnInterval);

    return () => clearInterval(spawnTimerRef.current);
  }, [gameState, currentLevel]);

  // Pause automatically if browser tab becomes hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameState === 'playing') {
        setGameState('paused');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameState]);

  // Trigger Avengers Team-Up Ability
  const handleTriggerHeroAssist = useCallback(
    (assist) => {
      if (gameState !== 'playing' || teamUpCharge < 100) return;

      setTeamUpCharge(0);
      setTeamUpsUsed((u) => u + 1);
      setDialogue(assist.dialogue);
      triggerScreenShake();

      try {
        hulkAudio.playHeroAssist(assist.soundKey, assist.characterId);
        hulkAudio.speakHulkLine(assist.abilityName);
      } catch { }

      const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 400;
      const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 300;

      if (assist.id === 'thor-bifrost') {
        let bonusCleared = 0;
        let clearedCount = 0;
        const mult = isOverchargeActive ? combo * 2 : combo;

        setSlots((prev) =>
          prev.map((slot) => {
            if (slot && slot.type === 'smash' && !slot.isSmashed) {
              clearedCount += 1;
              bonusCleared += slot.points * mult;
              return { ...slot, isSmashed: true };
            }
            return slot;
          })
        );

        const guaranteedPts = Math.max(350, bonusCleared);
        setScore((s) => s + guaranteedPts);
        if (clearedCount > 0) {
          setTargetsSmashed((t) => t + clearedCount);
        }
        const nextCombo = Math.min(10, combo + 2);
        setCombo(nextCombo);
        setHighestCombo((h) => Math.max(h, nextCombo));

        spawnImpactVisuals(centerX, centerY, {
          word: 'BIFROST THUNDER!',
          color: '#38BDF8',
          floatText: `+${guaranteedPts} TEAM-UP!`,
          isPositive: true,
        });
      } else if (assist.id === 'ironman-overcharge') {
        clearTimeout(overchargeTimeoutRef.current);
        setIsOverchargeActive(true);
        overchargeTimeoutRef.current = setTimeout(() => {
          setIsOverchargeActive(false);
        }, 5000);

        spawnImpactVisuals(centerX, centerY, {
          word: '2X STARK OVERCHARGE!',
          color: '#F59E0B',
          floatText: '5s DOUBLE POINTS!',
          isPositive: true,
        });
      } else if (assist.id === 'strange-timestasis') {
        clearTimeout(freezeTimeoutRef.current);
        setIsTimeFrozen(true);
        freezeTimeoutRef.current = setTimeout(() => {
          setIsTimeFrozen(false);
        }, 4000);

        spawnImpactVisuals(centerX, centerY, {
          word: 'TIME FROZEN!',
          color: '#00FF88',
          floatText: 'CLOCK PAUSED 4s!',
          isPositive: true,
        });
      }
    },
    [gameState, teamUpCharge, combo, isOverchargeActive, triggerScreenShake, spawnImpactVisuals]
  );

  // Modal toggle helpers that safely pause & refresh grid on resume
  const openModalSafely = (modalSetter) => {
    setShowHowToPlay(false);
    setShowSoundboard(false);
    setShowAvatarPicker(false);
    if (gameState === 'playing') {
      setPausedByModal(true);
      setGameState('paused');
    }
    modalSetter(true);
  };

  const closeModalsSafely = useCallback(() => {
    setShowHowToPlay(false);
    setShowSoundboard(false);
    setShowAvatarPicker(false);
    if (pausedByModal) {
      setPausedByModal(false);
      setSlots((prev) => spawnArenaWave(prev.map(() => null), currentLevel, { forceInitial: true }));
      setGameState('playing');
    }
  }, [pausedByModal, currentLevel]);

  // Keyboard support (Escape + 1/2/3 Team-Up Hotkeys)
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showHowToPlay || showSoundboard || showAvatarPicker) {
          closeModalsSafely();
        } else if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setSlots((prev) => spawnArenaWave(prev.map(() => null), currentLevel, { forceInitial: true }));
          setGameState('playing');
        } else {
          onClose();
        }
      } else if (gameState === 'playing' && !showAvatarPicker && !showSoundboard && !showHowToPlay) {
        const assist = HERO_ASSISTS.find((a) => a.hotkey === e.key);
        if (assist) {
          e.preventDefault();
          handleTriggerHeroAssist(assist);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, showHowToPlay, showSoundboard, showAvatarPicker, currentLevel, closeModalsSafely, handleTriggerHeroAssist, onClose]);

  // Smash Slot Handler
  const handleSmashSlot = (index, e) => {
    if (gameState !== 'playing') return;

    const target = slots[index];
    if (!target || target.isSmashed) return;

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
      const multiplier = isOverchargeActive ? combo * 2 : combo;
      const pointsEarned = target.points * multiplier;

      setScore((s) => s + pointsEarned);
      setCombo(nextCombo);
      if (nextCombo > highestCombo) setHighestCombo(nextCombo);
      setTargetsSmashed((t) => t + 1);
      setTeamUpCharge((c) => Math.min(100, c + 25));

      try {
        hulkAudio.playSmash(combo, target);
        if (combo > 1) hulkAudio.playComboChime(combo);
      } catch { }
      triggerScreenShake();

      const burstWord = target.characterId === 'loki'
        ? 'PUNY GOD!'
        : COMIC_WORDS[Math.floor(Math.random() * COMIC_WORDS.length)];

      spawnImpactVisuals(clickX, clickY, {
        word: burstWord,
        color: target.accent,
        floatText: isOverchargeActive ? `+${pointsEarned} (2X)` : `+${pointsEarned}`,
        isPositive: true,
      });

      if (target.smashLine && (target.isBonus || target.characterId === 'loki' || Math.random() < 0.5)) {
        setDialogue(target.smashLine);
        if (combo >= 6) {
          hulkAudio.speakHulkLine(target.smashLine);
        }
      } else if (combo >= 5) {
        setDialogue(HULK_DIALOGUES.combo[Math.floor(Math.random() * HULK_DIALOGUES.combo.length)]);
      } else {
        setDialogue(HULK_DIALOGUES.correct[Math.floor(Math.random() * HULK_DIALOGUES.correct.length)]);
      }
    } else {
      setScore((s) => Math.max(0, s + target.penalty));
      setCombo(1);
      setDecoysHit((d) => d + 1);

      try {
        hulkAudio.playHeroAlert(target);
      } catch { }
      triggerScreenShake();

      spawnImpactVisuals(clickX, clickY, {
        word: 'ALLY!',
        color: '#EF4444',
        floatText: `${target.penalty}`,
        isPositive: false,
      });

      setDialogue(target.warningLine || HULK_DIALOGUES.wrong[Math.floor(Math.random() * HULK_DIALOGUES.wrong.length)]);
    }
  };

  const handleAuditionSound = (soundId) => {
    setLastPreviewSound(soundId);
    hulkAudio.init();
    if (!hulkAudio.playSound(soundId, { gain: 0.9 })) {
      if (soundId === 'hulkRoar') hulkAudio.playHulkRoar();
      else if (soundId === 'hulkSmash') hulkAudio.playSmash(3);
      else hulkAudio.playGameStart();
    }
  };

  const handleAuditionCharacterVoice = (charId) => {
    setLastPreviewSound(`char-${charId}`);
    hulkAudio.init();
    hulkAudio.playCharacterVoice(charId, { gain: 0.95, force: true });
  };

  const handleImportCustomAudio = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isChar = customAudioSlot.startsWith('char:');
    const targetId = isChar ? customAudioSlot.slice(5) : customAudioSlot;
    const res = await hulkAudio.importCustomAudioFile(targetId, file, isChar);
    if (res.ok) {
      setCustomOverrides(hulkAudio.getCustomOverrides());
      setUploadStatusMsg(`IMPORTED "${res.fileName}" — SAVED TO BROWSER!`);
    } else {
      setUploadStatusMsg(`FAILED: ${res.error}`);
    }
    e.target.value = '';
  };

  const handleResetCustomAudio = async () => {
    const isChar = customAudioSlot.startsWith('char:');
    const targetId = isChar ? customAudioSlot.slice(5) : customAudioSlot;
    const next = await hulkAudio.clearCustomAudio(targetId, isChar);
    setCustomOverrides(next);
    setUploadStatusMsg('RESTORED DEFAULT BUILT-IN MCU-STYLE AUDIO');
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

  const isWorldbreakerAura = combo >= 5 && gameState === 'playing';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Hulk Smash Mayhem Mini-Game"
      className={`fixed inset-0 z-50 bg-[#040608]/98 backdrop-blur-xl flex flex-col justify-between overflow-hidden select-none transition-shadow duration-300 ${isTimeFrozen
        ? 'ring-4 ring-inset ring-[#00FF88]/50 shadow-[inset_0_0_90px_rgba(0,255,136,0.2)]'
        : isOverchargeActive
          ? 'ring-4 ring-inset ring-[#F59E0B]/50 shadow-[inset_0_0_90px_rgba(245,158,11,0.18)]'
          : isWorldbreakerAura
            ? 'shadow-[inset_0_0_80px_rgba(16,185,129,0.18)]'
            : ''
        }`}
    >
      {/* Ambient Radial Containment Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      {/* ── TOP NAV HEADER ── */}
      <header className="relative w-full px-3 sm:px-6 py-2.5 border-b border-[#1E252D] bg-[#07090D]/95 flex items-center justify-between gap-2 z-30 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] font-mono text-[#8C9098] hover:text-[#00FF88] transition-colors inline-flex items-center gap-1.5 cursor-pointer uppercase shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">BACK TO WEBSITE</span>
          <span className="xs:hidden">BACK</span>
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <img
            src={activeAvatar.poster}
            alt={activeAvatar.name}
            className="w-6 h-6 rounded-full object-cover object-top border border-[#00FF88] shrink-0"
          />
          <span className="text-xs sm:text-sm font-cinematic font-black text-white uppercase tracking-wider truncate">
            HULK SMASH MAYHEM
          </span>
          <span className="hidden md:inline-block px-1.5 py-0.5 bg-[#10B981]/15 border border-[#10B981]/40 text-[#00FF88] text-[9px] font-mono uppercase rounded-sm truncate max-w-[140px]">
            AVATAR: {activeAvatar.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* 51-Character Marvel Avatar Selector */}
          <button
            type="button"
            onClick={() => openModalSafely(setShowAvatarPicker)}
            className="px-2 sm:px-2.5 py-1.5 border border-[#10B981]/50 bg-[#0D1A12] text-[#00FF88] hover:bg-[#10B981]/25 rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold"
            title="Choose any of 51 Marvel Character Avatars"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AVATAR ({ALL_AVATARS.length})</span>
          </button>

          {/* Marvel Soundboard & Roster Vault */}
          <button
            type="button"
            onClick={() => openModalSafely(setShowSoundboard)}
            className="px-2 sm:px-2.5 py-1.5 border border-[#232731] bg-[#12141A] text-[#D8D9DC] hover:text-[#00FF88] hover:border-[#00FF88]/50 rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-mono uppercase font-bold"
            title="Hulk & Marvel Audio Vault + Cast"
          >
            <Music className="w-3.5 h-3.5 text-[#00FF88]" />
            <span className="hidden md:inline">AUDIO &amp; HEROES</span>
          </button>

          {/* How To Play */}
          <button
            type="button"
            onClick={() => openModalSafely(setShowHowToPlay)}
            aria-label="How to play"
            className="p-1.5 sm:p-2 border border-[#232731] bg-[#12141A] text-[#8C9098] hover:text-[#00FF88] hover:border-[#00FF88]/50 rounded-sm transition-colors cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Optional Voice Toggle */}
          <button
            type="button"
            onClick={() => setVoiceEnabled((prev) => !prev)}
            aria-label={voiceEnabled ? 'Disable Hulk voice lines' : 'Enable Hulk voice lines'}
            className={`hidden sm:inline-flex items-center gap-1 px-2 py-1.5 border rounded-sm text-[10px] font-mono uppercase transition-colors cursor-pointer ${voiceEnabled
              ? 'border-[#00FF88]/60 bg-[#00FF88]/15 text-[#00FF88]'
              : 'border-[#232731] bg-[#12141A] text-[#777A80] hover:text-white'
              }`}
            title="Toggle English Hulk Voice Callouts"
          >
            {voiceEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>VOICE</span>
          </button>

          {/* SFX Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? 'Mute game sound' : 'Unmute game sound'}
            className="p-1.5 sm:p-2 border border-[#232731] bg-[#12141A] text-[#8C9098] hover:text-white rounded-sm transition-colors cursor-pointer"
            title={soundEnabled ? 'SFX On' : 'SFX Off'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#22C55E]" /> : <VolumeX className="w-4 h-4 text-[#EF4444]" />}
          </button>

          {/* Close Game */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Exit Game"
            className="p-1.5 sm:p-2 border border-[#232731] bg-[#12141A] text-[#8C9098] hover:text-white hover:border-[#EF4444] rounded-sm transition-colors cursor-pointer"
            title="Close Game"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════════════
          1. CINEMATIC GAMMA & MARVEL ROSTER LOADING SCREEN
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center p-5 text-center relative z-20">
          {/* Active Avatar + Hulk Centerpiece + Assembled Marvel Portraits */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-5">
            {FEATURED_GAME_CAST.slice(1, 4).map((hero) => (
              <div
                key={hero.id}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#2D333E] opacity-75 hidden xs:block"
              >
                <img src={hero.poster} alt={hero.name} className="w-full h-full object-cover object-top" />
              </div>
            ))}

            <button
              type="button"
              onClick={() => openModalSafely(setShowAvatarPicker)}
              className="relative w-24 h-24 sm:w-32 sm:h-32 mx-1 rounded-full overflow-hidden border-2 border-[#00FF88] shadow-[0_0_45px_rgba(0,255,136,0.75)] gamma-glow-pulse cursor-pointer group"
              title="Click to switch Marvel Avatar"
            >
              <img src={activeAvatar.poster} alt={activeAvatar.name} className="w-full h-full object-cover object-top" />
              <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8.5px] font-mono font-bold text-[#00FF88] py-0.5 uppercase tracking-wider">
                SWAP AVATAR
              </span>
            </button>

            {FEATURED_GAME_CAST.slice(4, 7).map((char) => (
              <div
                key={char.id}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#2D333E] opacity-75 hidden xs:block"
              >
                <img src={char.poster} alt={char.name} className="w-full h-full object-cover object-top" />
              </div>
            ))}
          </div>

          <span className="text-[10px] font-mono tracking-[0.25em] text-[#00FF88] uppercase font-bold mb-1.5">
            ACTIVE AVATAR: {activeAvatar.name} // GAMMA LAB LINKED
          </span>

          <h2 className="text-3xl sm:text-5xl font-cinematic font-black text-white uppercase tracking-tight mb-2">
            HULK SMASH MAYHEM
          </h2>

          <p className="text-xs sm:text-sm font-mono tracking-widest text-[#8C9098] uppercase mb-6">
            &ldquo;THAT&apos;S MY SECRET, CAP — I&apos;M ALWAYS ANGRY.&rdquo;
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-md h-3 bg-[#0A0D12] border border-[#10B981]/60 rounded-full overflow-hidden p-0.5 shadow-inner mb-2.5 relative">
            <div
              className="h-full bg-gradient-to-r from-[#10B981] via-[#22C55E] to-[#00FF88] rounded-full transition-all duration-150 ease-out shadow-[0_0_15px_rgba(0,255,136,0.9)]"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          {/* Telemetry & Audio Bank Counter */}
          <div className="flex items-center justify-between w-full max-w-md text-xs font-mono mb-6">
            <span className="text-[#9CA3AF] text-[10px] uppercase truncate max-w-[68%] text-left">
              {loadingStatusText}
            </span>
            <span className="text-[#00FF88] font-bold">
              {loadingProgress}% ({audioLoadCount.loaded}/{audioLoadCount.total} SFX)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSkipLoading}
              className="px-6 py-2.5 bg-gradient-to-r from-[#10B981] to-[#00FF88] text-black text-[10px] font-mono font-black tracking-widest uppercase transition-transform hover:scale-105 cursor-pointer rounded-sm inline-flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>SKIP &amp; SMASH NOW</span>
            </button>

            <button
              type="button"
              onClick={() => openModalSafely(setShowAvatarPicker)}
              className="px-4 py-2.5 bg-[#12141A] hover:bg-[#1A1D24] border border-[#232731] hover:border-[#00FF88] text-[#D8D9DC] hover:text-[#00FF88] text-[10px] font-mono font-bold tracking-widest uppercase transition-colors cursor-pointer rounded-sm inline-flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-[#00FF88]" />
              <span>CHANGE AVATAR</span>
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          2. DRAMATIC COUNTDOWN OVERLAY (3... 2... 1... HULK SMASH!)
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'countdown' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-20">
          <div className="text-[11px] font-mono tracking-[0.25em] text-[#00FF88] uppercase mb-4">
            {activeAvatar.name.toUpperCase()} DEPLOYING WITH HULK
          </div>

          <div
            key={countdownNumber}
            className={`font-cinematic font-black tracking-tight leading-none text-center select-none countdown-zoom ${countdownNumber === 'HULK SMASH!'
              ? 'text-4xl sm:text-7xl md:text-8xl text-[#00FF88] drop-shadow-[0_0_50px_rgba(0,255,136,0.9)]'
              : 'text-7xl sm:text-9xl md:text-[11rem] text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.6)]'
              }`}
          >
            {countdownNumber}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono uppercase tracking-widest">
            <span className="px-2.5 py-1 bg-[#10B981]/15 border border-[#10B981]/50 text-[#00FF88] rounded-sm">
              SMASH GREEN VILLAINS
            </span>
            <span className="px-2.5 py-1 bg-[#EF4444]/15 border border-[#EF4444]/50 text-[#EF4444] rounded-sm">
              PROTECT RED AVENGERS
            </span>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          3. ACTIVE GAMEPLAY ARENA (WITH MARVEL HEROES, HULK HUD & TEAM-UPS)
         ═════════════════════════════════════════════════════════════════════ */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div
          className={`w-full max-w-5xl mx-auto px-2.5 sm:px-6 pt-2 pb-2.5 flex flex-col justify-between flex-1 min-h-0 relative z-20 transition-transform ${screenShake ? 'screen-shake-smash' : ''
            }`}
        >
          {/* Top Tactical HUD Bar */}
          <div className="border border-[#1E252D] bg-[#0A0D12]/95 px-3 py-2 sm:px-4 sm:py-2.5 rounded-sm shadow-xl flex items-center justify-between gap-2 sm:gap-4 shrink-0">
            {/* Score + Combo */}
            <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8.5px] font-mono text-[#8C9098] tracking-widest uppercase">
                    SCORE
                  </span>
                  {isOverchargeActive && (
                    <span className="px-1 py-0.2 bg-[#F59E0B] text-black text-[8px] font-mono font-black rounded-sm animate-pulse">
                      2X STARK
                    </span>
                  )}
                </div>
                <span
                  className={`text-lg sm:text-3xl font-mono font-black tracking-wider tabular-nums block leading-tight ${isOverchargeActive ? 'text-[#F59E0B]' : 'text-white'
                    }`}
                >
                  {score.toLocaleString()}
                </span>
              </div>

              <div
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-sm border transition-colors"
                style={{
                  borderColor: `${currentRageTier.color}66`,
                  backgroundColor: `${currentRageTier.color}18`,
                }}
              >
                <Flame
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${combo > 1 ? 'animate-bounce' : ''}`}
                  style={{ color: currentRageTier.color }}
                />
                <span
                  className="text-xs sm:text-sm font-mono font-black tracking-wider"
                  style={{ color: currentRageTier.color }}
                >
                  x{combo}
                </span>
              </div>
            </div>

            {/* Center: Clickable Marvel Avatar + Hulk Live Reaction Bay */}
            <button
              type="button"
              onClick={() => openModalSafely(setShowAvatarPicker)}
              className="hidden md:flex items-center gap-2.5 px-3 py-1.5 bg-[#07090C] hover:bg-[#0D1117] border border-[#1E252D] hover:border-[#00FF88]/50 rounded-sm min-w-0 max-w-md flex-1 cursor-pointer transition-colors text-left"
              title="Click to switch active Marvel Character Avatar"
            >
              <div className="flex -space-x-2 shrink-0">
                <img
                  src={activeAvatar.poster}
                  alt={activeAvatar.name}
                  className={`w-9 h-9 rounded-full object-cover object-top border-2 transition-all ${combo >= 5 ? 'border-[#00FF88] shadow-[0_0_15px_rgba(0,255,136,0.8)]' : 'border-[#00FF88]/70'
                    }`}
                />
                {activeAvatar.id !== 'hulk' && (
                  <img
                    src={HULK_PROFILE.poster}
                    alt="Hulk Co-Op"
                    className="w-7 h-7 self-end rounded-full object-cover object-top border border-[#10B981]"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[8.5px] font-mono font-black tracking-widest uppercase truncate"
                    style={{ color: currentRageTier.color }}
                  >
                    {activeAvatar.name} • {currentRageTier.title}
                  </span>
                  <span className="text-[8px] font-mono text-[#8C9098] uppercase shrink-0">
                    LVL {currentLevel} • SWAP ▾
                  </span>
                </div>
                <p className="text-xs font-cinematic font-bold text-[#E5E7EB] truncate">
                  &ldquo;{dialogue}&rdquo;
                </p>
              </div>
            </button>

            {/* Right: Countdown Clock + Pause */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="text-right">
                <span className="text-[8.5px] font-mono text-[#8C9098] tracking-widest uppercase block">
                  {isTimeFrozen ? 'TIME FROZEN' : 'TIME LEFT'}
                </span>
                <span
                  className={`text-lg sm:text-3xl font-mono font-black tabular-nums leading-tight inline-flex items-center gap-1 ${isTimeFrozen
                    ? 'text-[#38BDF8] drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]'
                    : timeLeft <= 8
                      ? 'text-[#EF4444] animate-pulse drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                      : 'text-[#00FF88]'
                    }`}
                >
                  {isTimeFrozen && <Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                  {timeLeft}s
                </span>
              </div>

              <button
                type="button"
                onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
                className="p-2 bg-[#12141A] hover:bg-[#1A1D24] border border-[#232731] hover:border-white/50 text-white rounded-sm transition-colors cursor-pointer"
                title={gameState === 'playing' ? 'Pause Game' : 'Resume Game'}
                aria-label={gameState === 'playing' ? 'Pause Game' : 'Resume Game'}
              >
                {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
            </div>
          </div>

          {/* Mobile Avatar + Hulk Dialogue Strip + Shared Gamma Surge Charge Bar */}
          <div className="my-1.5 flex flex-col gap-1 shrink-0">
            <button
              type="button"
              onClick={() => openModalSafely(setShowAvatarPicker)}
              className="md:hidden py-1 px-2.5 bg-[#090C0F] border border-[#10B981]/30 rounded-sm flex items-center justify-between gap-2 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src={activeAvatar.poster}
                  alt={activeAvatar.name}
                  className="w-5 h-5 rounded-full object-cover object-top border border-[#00FF88] shrink-0"
                />
                <span className="text-[11px] font-cinematic font-bold text-[#00FF88] uppercase truncate">
                  &ldquo;{dialogue}&rdquo;
                </span>
              </div>
              <span className="text-[8px] font-mono text-[#8C9098] uppercase shrink-0">SWAP ▾</span>
            </button>

            {/* Gamma Team-Up Charge Progress */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-[8.5px] font-mono uppercase tracking-wider text-[#8C9098] shrink-0">
                AVENGERS TEAM-UP:
              </span>
              <div className="flex-1 h-1.5 bg-[#0B0E14] border border-[#1E252D] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${teamUpCharge >= 100
                    ? 'bg-gradient-to-r from-[#22C55E] via-[#00FF88] to-[#38BDF8] shadow-[0_0_10px_#00FF88]'
                    : 'bg-[#10B981]/70'
                    }`}
                  style={{ width: `${teamUpCharge}%` }}
                />
              </div>
              <span
                className={`text-[9px] font-mono font-bold uppercase shrink-0 ${teamUpCharge >= 100 ? 'text-[#00FF88] animate-pulse' : 'text-[#8C9098]'
                  }`}
              >
                {teamUpCharge >= 100 ? 'READY — PRESS 1/2/3' : `${teamUpCharge}%`}
              </span>
            </div>
          </div>

          {/* 3x3 Combat Arena Grid (Marvel Character Portrait Cards) */}
          <div className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3.5 flex-1 min-h-0 max-h-[520px] w-full my-auto">
            {slots.map((item, index) => {
              if (!item) {
                return (
                  <div
                    key={index}
                    className="relative rounded-sm border border-[#161B22] bg-[#06080B]/85 flex flex-col items-center justify-center shadow-inner overflow-hidden"
                  >
                    <div className="w-6 h-6 rounded-full border border-dashed border-[#1E252D] flex items-center justify-center opacity-30">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]/40" />
                    </div>
                  </div>
                );
              }

              const isDecoy = item.type === 'decoy';
              const displayPoints = isOverchargeActive ? item.points * combo * 2 : item.points * combo;

              return (
                <button
                  key={item.instanceId || index}
                  type="button"
                  onClick={(e) => handleSmashSlot(index, e)}
                  style={{ touchAction: 'manipulation' }}
                  aria-label={`${item.name} (${item.badge})`}
                  className={`group relative rounded-sm border-2 flex flex-col justify-between cursor-pointer transition-all duration-150 transform active:scale-95 overflow-hidden select-none shadow-lg text-left ${item.isSmashed
                    ? 'scale-90 opacity-15 border-white'
                    : isDecoy
                      ? 'border-[#EF4444] bg-[#180709] hover:border-[#F87171] shadow-[0_0_18px_rgba(239,68,68,0.35)]'
                      : item.isBonus
                        ? 'border-[#00FF88] bg-[#061810] shadow-[0_0_26px_rgba(0,255,136,0.65)] hover:scale-[1.03]'
                        : 'border-[#10B981] bg-[#07110B] hover:border-[#00FF88] shadow-[0_0_18px_rgba(16,185,129,0.35)] hover:scale-[1.03]'
                    }`}
                >
                  {/* Full-Bleed Marvel Character Portrait */}
                  <img
                    src={item.poster}
                    alt={item.name}
                    className={`absolute inset-0 w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105 ${isDecoy ? 'brightness-75 saturate-75' : 'brightness-90 contrast-110'
                      }`}
                  />

                  {/* Scrim Overlay for High-Speed Readability */}
                  <div
                    className={`absolute inset-0 pointer-events-none ${isDecoy
                      ? 'bg-gradient-to-t from-black/95 via-[#EF4444]/15 to-black/75'
                      : 'bg-gradient-to-t from-black/95 via-[#10B981]/10 to-black/65'
                      }`}
                  />

                  {/* Corner Tactical Crosshairs for Smash Targets */}
                  {!isDecoy && (
                    <div className="absolute inset-1.5 border border-[#00FF88]/25 pointer-events-none rounded-[2px]" />
                  )}

                  {/* Top Action Badge & Points */}
                  <div className="relative z-10 w-full p-1.5 sm:p-2 flex items-center justify-between gap-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[7.5px] sm:text-[9px] font-mono font-black px-1.5 py-0.5 rounded-sm uppercase tracking-wider truncate shadow ${isDecoy
                        ? 'bg-[#EF4444] text-white'
                        : item.isBonus
                          ? 'bg-[#00FF88] text-black'
                          : 'bg-[#10B981] text-black'
                        }`}
                    >
                      {isDecoy ? <ShieldAlert className="w-2.5 h-2.5 shrink-0" /> : <Crosshair className="w-2.5 h-2.5 shrink-0" />}
                      <span className="truncate">{item.badge}</span>
                    </span>

                    <span
                      className={`text-[8.5px] sm:text-[10px] font-mono font-black px-1.5 py-0.5 rounded-sm bg-black/80 border shrink-0 ${isDecoy ? 'text-[#EF4444] border-[#EF4444]/50' : 'text-[#00FF88] border-[#10B981]/50'
                        }`}
                    >
                      {isDecoy ? `${item.penalty}` : `+${displayPoints}`}
                    </span>
                  </div>

                  {/* Bottom Character Identity Nameplate */}
                  <div className="relative z-10 w-full px-1.5 pb-2 pt-3 text-center">
                    <span className="block text-[10px] sm:text-xs font-cinematic font-black text-white uppercase tracking-wide truncate drop-shadow">
                      {item.name}
                    </span>
                    <span className="hidden xs:block text-[8px] font-mono text-[#9CA3AF] uppercase truncate">
                      {item.subtitle}
                    </span>
                  </div>

                  {/* GPU-Composited Lifespan Fuse Strip */}
                  {!item.isSmashed && (
                    <div
                      className={`target-fuse-bar absolute bottom-0 left-0 right-0 h-1 z-20 ${isDecoy ? 'bg-[#EF4444]' : 'bg-[#00FF88]'
                        }`}
                      style={{
                        animationDuration: `${item.lifespan || 2000}ms`,
                        animationPlayState: gameState === 'paused' || isTimeFrozen ? 'paused' : 'running',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Avengers Hero Team-Up Support Deck */}
          <div className="mt-2 grid grid-cols-3 gap-2 shrink-0">
            {HERO_ASSISTS.map((assist) => {
              const isReady = teamUpCharge >= 100;
              return (
                <button
                  key={assist.id}
                  type="button"
                  disabled={!isReady || gameState !== 'playing'}
                  onClick={() => handleTriggerHeroAssist(assist)}
                  className={`relative flex items-center gap-2 p-1.5 sm:p-2 rounded-sm border text-left transition-all overflow-hidden ${isReady
                    ? 'bg-[#0B1610] border-[#00FF88] hover:scale-[1.02] shadow-[0_0_18px_rgba(0,255,136,0.35)] cursor-pointer'
                    : 'bg-[#090B0F] border-[#1A1F28] opacity-60 cursor-not-allowed'
                    }`}
                >
                  <img
                    src={assist.poster}
                    alt={assist.heroName}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-sm object-cover object-top border shrink-0 ${isReady ? 'border-[#00FF88]' : 'border-[#2D333E] grayscale-[40%]'
                      }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-cinematic font-black text-white uppercase truncate">
                        {assist.abilityName}
                      </span>
                      <span
                        className={`hidden sm:inline-block px-1 py-0.2 text-[8px] font-mono font-bold rounded-sm border ${isReady
                          ? 'bg-[#00FF88] text-black border-[#00FF88]'
                          : 'bg-[#12141A] text-[#6B7280] border-[#232731]'
                          }`}
                      >
                        [{assist.hotkey}]
                      </span>
                    </div>
                    <span className="block text-[8px] sm:text-[9px] font-mono text-[#9CA3AF] truncate">
                      {assist.shortDesc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          4. PAUSED MODAL OVERLAY
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'paused' && !showHowToPlay && !showSoundboard && !showAvatarPicker && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#0C0E13] border border-[#1E252D] p-6 rounded-sm shadow-2xl text-center">
            <img
              src={activeAvatar.poster}
              alt={activeAvatar.name}
              className="w-16 h-16 rounded-full object-cover object-top border-2 border-[#00FF88] mx-auto mb-3"
            />
            <h3 className="text-2xl font-cinematic font-black text-white uppercase mb-1">
              ARENA PAUSED
            </h3>
            <p className="text-xs font-mono text-[#8C9098] uppercase mb-5">
              {activeAvatar.name} • SCORE: {score.toLocaleString()} PTS
            </p>

            <div className="space-y-2.5">
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
                onClick={() => openModalSafely(setShowAvatarPicker)}
                className="w-full py-2.5 bg-[#0D1A12] hover:bg-[#10B981]/20 border border-[#10B981]/50 text-[#00FF88] font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
              >
                CHANGE MARVEL AVATAR ({ALL_AVATARS.length})
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
          5. 51-CHARACTER MARVEL AVATAR SELECTOR MODAL
         ═════════════════════════════════════════════════════════════════════ */}
      {showAvatarPicker && (
        <div className="absolute inset-0 z-40 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl w-full bg-[#0A0D12] border border-[#10B981]/60 p-4 sm:p-6 rounded-sm shadow-2xl text-left relative my-auto max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={closeModalsSafely}
              aria-label="Close Avatar Selector"
              className="absolute top-4 right-4 text-[#8C9098] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[10px] font-mono text-[#00FF88] uppercase tracking-widest mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>IMPORTED MULTIVERSE CAST // 51 PLAYABLE AVATARS</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-cinematic font-black text-white uppercase mb-3">
              CHOOSE YOUR MARVEL CHARACTER AVATAR
            </h3>

            {/* Search & Faction Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5 mb-3 shrink-0">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#8C9098] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={avatarSearch}
                  onChange={(e) => setAvatarSearch(e.target.value)}
                  placeholder="Search Iron Man, Spider-Man, Wolverine, Doom..."
                  className="w-full pl-8 pr-3 py-2 bg-[#07090C] border border-[#1E252D] focus:border-[#00FF88] rounded-sm text-xs font-mono text-white placeholder-[#6B7280] outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {AVATAR_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAvatarCategory(cat)}
                    className={`px-2 py-1 text-[9px] font-mono font-bold uppercase rounded-sm border cursor-pointer transition-colors ${avatarCategory === cat
                      ? 'bg-[#00FF88] text-black border-[#00FF88]'
                      : 'bg-[#07090C] text-[#8C9098] border-[#1E252D] hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable 51-Character Avatar Grid */}
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 overflow-y-auto pr-1 py-1 flex-1 min-h-0">
              {filteredAvatars.map((char) => {
                const isSelected = activeAvatar.id === char.id;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => handleSelectAvatar(char)}
                    className={`group relative rounded-sm overflow-hidden border-2 aspect-[3/4] text-left cursor-pointer transition-all ${isSelected
                      ? 'border-[#00FF88] shadow-[0_0_20px_rgba(0,255,136,0.55)] scale-[1.02]'
                      : 'border-[#1E252D] hover:border-[#00FF88]/70'
                      }`}
                  >
                    <img
                      src={char.poster}
                      alt={char.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#00FF88] text-black flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}

                    <div className="absolute bottom-1.5 inset-x-1.5">
                      <span className="block text-[10px] font-cinematic font-black text-white uppercase leading-tight truncate">
                        {char.name}
                      </span>
                      <span className="block text-[7.5px] font-mono text-[#00FF88] truncate">
                        &ldquo;{char.voiceLine}&rdquo;
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#1E252D] flex items-center justify-between gap-2 shrink-0">
              <span className="text-[10px] font-mono text-[#8C9098] uppercase">
                SHOWING {filteredAvatars.length} OF {ALL_AVATARS.length} MARVEL AVATARS
              </span>
              <button
                type="button"
                onClick={closeModalsSafely}
                className="px-5 py-2 bg-[#22C55E] hover:bg-[#10B981] text-black font-mono font-bold text-xs uppercase rounded-sm cursor-pointer"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          6. HOW TO PLAY MODAL OVERLAY
         ═════════════════════════════════════════════════════════════════════ */}
      {showHowToPlay && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-[#0C0E13] border border-[#22C55E]/60 p-6 sm:p-7 rounded-sm shadow-2xl text-left relative">
            <button
              type="button"
              onClick={closeModalsSafely}
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
              30 SECONDS TO PROVE HULK IS THE STRONGEST AVENGER
            </p>

            <div className="space-y-3 text-xs font-body text-[#9CA3AF] leading-relaxed mb-6">
              <div className="p-3 bg-[#08090C] border border-[#10B981]/50 rounded-sm">
                <span className="text-[#00FF88] font-bold font-mono uppercase block mb-1">
                  1. SMASH GREEN VILLAINS (+100 TO +250 PTS x COMBO)
                </span>
                <p>
                  Tap Doctor Doom bots, Thanos echoes, Loki illusions, and Void surges to build up to a x10 Gamma Combo &amp; trigger Worldbreaker Roars!
                </p>
              </div>

              <div className="p-3 bg-[#08090C] border border-[#EF4444]/50 rounded-sm">
                <span className="text-[#EF4444] font-bold font-mono uppercase block mb-1">
                  2. PROTECT 12 RED AVENGERS ALLIES (-50 PTS &amp; COMBO RESET)
                </span>
                <p>
                  Never smash Spider-Man, Iron Man, Captain America, Thor, Wolverine, Deadpool, Scarlet Witch, or Black Widow! Listen for their signature warning sound.
                </p>
              </div>

              <div className="p-3 bg-[#08090C] border border-[#38BDF8]/50 rounded-sm">
                <span className="text-[#38BDF8] font-bold font-mono uppercase block mb-1">
                  3. PICK YOUR AVATAR &amp; TRIGGER TEAM-UPS (KEYS 1, 2, 3)
                </span>
                <p>
                  Switch between any of the 51 Marvel Character Avatars anytime! Charge the Team-Up bar to unleash Thor, Iron Man 2X, or Doctor Strange Time Freeze.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModalsSafely}
              className="w-full py-3 bg-[#22C55E] hover:bg-[#10B981] text-black font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer text-center"
            >
              GOT IT — RETURN TO ARENA
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          7. MARVEL AUDIO SOUNDBOARD & IMPORTED CHARACTER BRIEFING MODAL
         ═════════════════════════════════════════════════════════════════════ */}
      {showSoundboard && (
        <div className="absolute inset-0 z-40 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-3xl w-full bg-[#0A0D12] border border-[#10B981]/60 p-5 sm:p-7 rounded-sm shadow-2xl text-left relative my-auto max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeModalsSafely}
              aria-label="Close Soundboard"
              className="absolute top-4 right-4 text-[#8C9098] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[10px] font-mono text-[#00FF88] uppercase tracking-widest mb-1">
              <Music className="w-3.5 h-3.5" />
              <span>MCU-STYLE BIO-ACOUSTIC AUDIO &amp; 51 CHARACTER VOICES</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-cinematic font-black text-white uppercase mb-3">
              HULK &amp; AVENGERS SOUND VAULT
            </h3>

            {/* Custom Local MP3/WAV Audio Importer */}
            <div className="mb-5 p-3 sm:p-4 bg-[#06090D] border border-[#10B981]/50 rounded-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold text-[#00FF88] uppercase tracking-wider inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>IMPORT YOUR OWN HULK / MARVEL AUDIO (.MP3 / .WAV)</span>
                </span>
                {customOverrides[customAudioSlot] && (
                  <span className="text-[9px] font-mono text-[#EAB308] uppercase truncate max-w-[220px]">
                    ACTIVE: {customOverrides[customAudioSlot]}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <select
                  value={customAudioSlot}
                  onChange={(e) => {
                    setCustomAudioSlot(e.target.value);
                    setUploadStatusMsg('');
                  }}
                  aria-label="Select sound slot to customize"
                  className="px-2.5 py-2 bg-[#0C1016] border border-[#232731] text-white text-xs font-mono rounded-sm outline-none focus:border-[#00FF88] flex-1"
                >
                  <option value="hulkRoar">Slot: Hulk Gamma Roar (Start / Combo)</option>
                  <option value="hulkSmash">Slot: Hulk Seismic Ground Smash</option>
                  <option value="hulkThunderclap">Slot: Hulk Thunderclap (Countdown / Team-Up)</option>
                  <option value="char:hulk">Slot: Hulk Character Voice + Roar</option>
                  <option value="char:iron-man">Slot: Iron Man Voice + Repulsor</option>
                  <option value="char:thanos">Slot: Thanos Terror Voice</option>
                  <option value="char:doctor-doom">Slot: Doctor Doom Voice</option>
                  {activeAvatar?.id && !['hulk', 'iron-man', 'thanos', 'doctor-doom'].includes(activeAvatar.id) && (
                    <option value={`char:${activeAvatar.id}`}>
                      Slot: Active Avatar ({activeAvatar.name})
                    </option>
                  )}
                </select>

                <label className="px-4 py-2 bg-[#22C55E] hover:bg-[#10B981] text-black font-mono font-bold text-xs uppercase rounded-sm cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>CHOOSE MP3/WAV</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleImportCustomAudio}
                    className="sr-only"
                  />
                </label>

                {customOverrides[customAudioSlot] && (
                  <button
                    type="button"
                    onClick={handleResetCustomAudio}
                    className="px-3 py-2 bg-[#161922] hover:bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] font-mono font-bold text-xs uppercase rounded-sm cursor-pointer inline-flex items-center justify-center gap-1 shrink-0"
                    title="Restore built-in sound"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>RESET</span>
                  </button>
                )}
              </div>

              {uploadStatusMsg && (
                <p className="mt-2 text-[10px] font-mono text-[#00FF88] uppercase">
                  {uploadStatusMsg}
                </p>
              )}
            </div>

            {/* Playable Sound Bank Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 mb-6">
              {SOUND_CATALOG.map((sfx) => {
                const isActive = lastPreviewSound === sfx.id;
                return (
                  <button
                    key={sfx.id}
                    type="button"
                    onClick={() => handleAuditionSound(sfx.id)}
                    className={`p-2.5 rounded-sm border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${isActive
                      ? 'bg-[#0F1E16] border-[#00FF88]'
                      : 'bg-[#07090C] border-[#1E252D] hover:border-[#00FF88]/50'
                      }`}
                  >
                    <div className="min-w-0">
                      <span
                        className="text-[8.5px] font-mono font-bold uppercase block"
                        style={{ color: sfx.accent }}
                      >
                        {sfx.character}
                      </span>
                      <span className="text-xs font-cinematic font-bold text-white truncate block">
                        {sfx.label}
                      </span>
                    </div>
                    <Volume2 className="w-4 h-4 text-[#00FF88] shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* 51 Unique Marvel Character Voices + Signature SFX */}
            <div className="mb-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-[10px] font-mono font-bold text-[#00FF88] uppercase tracking-wider">
                  51 UNIQUE CHARACTER VOICES &amp; SIGNATURE SFX (TAP TO PLAY)
                </h4>
                <span className="text-[9px] font-mono text-[#8C9098] uppercase">
                  E.G. IRON MAN / THANOS / HULK
                </span>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
                {ALL_AVATARS.map((char) => {
                  const isActive = lastPreviewSound === `char-${char.id}`;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => handleAuditionCharacterVoice(char.id)}
                      className={`p-2 rounded-sm border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${isActive
                          ? 'bg-[#0F1E16] border-[#00FF88]'
                          : 'bg-[#07090C] border-[#1E252D] hover:border-[#00FF88]/60'
                        }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={char.poster}
                          alt={char.name}
                          loading="lazy"
                          className="w-8 h-8 rounded-sm object-cover object-top shrink-0 border border-[#232731]"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-cinematic font-bold text-white block truncate">
                            {char.name}
                          </span>
                          <span className="text-[8.5px] font-mono text-[#9CA3AF] block truncate">
                            &ldquo;{char.voiceLine}&rdquo;
                          </span>
                        </div>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-[#00FF88] shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Imported Heroes vs Threats Preview (Clickable for Voice+SFX) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <h4 className="text-[10px] font-mono font-bold text-[#00FF88] uppercase tracking-wider mb-2">
                  THREATS TO SMASH ({SMASH_TARGETS.length})
                </h4>
                <div className="space-y-1.5">
                  {SMASH_TARGETS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleAuditionCharacterVoice(t.characterId)}
                      className="w-full text-left flex items-center justify-between gap-2 p-1.5 bg-[#07090C] hover:bg-[#0D1A12] border border-[#10B981]/30 rounded-sm cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={t.poster} alt={t.name} className="w-8 h-8 rounded-sm object-cover object-top shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-white block truncate">{t.name}</span>
                          <span className="text-[9px] font-mono text-[#8C9098] block truncate">+{t.points} PTS • {t.subtitle}</span>
                        </div>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-[#00FF88] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-mono font-bold text-[#EF4444] uppercase tracking-wider mb-2">
                  MARVEL HERO ALLIES — PROTECT ({DECOYS.length})
                </h4>
                <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                  {DECOYS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleAuditionCharacterVoice(d.characterId)}
                      className="w-full text-left flex items-center justify-between gap-2 p-1.5 bg-[#07090C] hover:bg-[#190A0D] border border-[#EF4444]/30 rounded-sm cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={d.poster} alt={d.name} className="w-8 h-8 rounded-sm object-cover object-top shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-white block truncate">{d.name}</span>
                          <span className="text-[9px] font-mono text-[#8C9098] block truncate">{d.subtitle}</span>
                        </div>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-[#EF4444] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModalsSafely}
              className="w-full py-2.5 bg-[#22C55E] hover:bg-[#10B981] text-black font-mono font-bold text-xs uppercase tracking-wider rounded-sm cursor-pointer"
            >
              RETURN TO GAME
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          8. GAME OVER & MISSION DEBRIEF
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'gameover' && (
        <div className="flex-1 flex items-center justify-center p-4 relative z-20 overflow-y-auto">
          <div className="max-w-lg w-full bg-[#0A0D12] border-2 border-[#10B981] p-5 sm:p-7 rounded-sm shadow-[0_20px_70px_rgba(0,255,136,0.25)] text-center relative">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img
                src={activeAvatar.poster}
                alt={activeAvatar.name}
                className="w-12 h-12 rounded-full object-cover object-top border-2 border-[#00FF88]"
              />
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#10B981]/20 border border-[#10B981] text-[#00FF88] text-[9.5px] font-mono tracking-widest uppercase font-bold rounded-sm">
                <Trophy className="w-4 h-4 text-[#EAB308]" />
                <span>{activeAvatar.name} // MISSION DEBRIEF</span>
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-cinematic font-black text-white uppercase tracking-tight">
              FINAL SCORE
            </h3>

            <div className="text-4xl sm:text-6xl font-mono font-black text-[#00FF88] tracking-wider my-2 drop-shadow-[0_0_20px_rgba(0,255,136,0.7)] tabular-nums">
              {score.toLocaleString()}
            </div>

            {isNewRecord && (
              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAB308]/20 border border-[#EAB308] text-[#EAB308] text-xs font-mono font-bold uppercase rounded-sm animate-bounce">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEW ALL-TIME CITY RECORD!</span>
              </div>
            )}

            {/* Rank Card */}
            <div className="p-3.5 bg-[#07090C] border border-[#1E252D] rounded-sm mb-4 text-left">
              <span className="text-[8.5px] font-mono text-[#8C9098] tracking-widest uppercase block mb-0.5">
                COMBAT PERFORMANCE RANK
              </span>
              <div
                className="text-lg sm:text-xl font-cinematic font-black uppercase tracking-wide mb-0.5"
                style={{ color: finalRank.color }}
              >
                {finalRank.title}
              </div>
              <p className="text-xs font-body text-[#9CA3AF]">
                {finalRank.subtitle}
              </p>
            </div>

            {/* Battle Stats */}
            <div className="grid grid-cols-5 gap-1.5 p-3 bg-[#080B0F] border border-[#171A21] rounded-sm mb-5 text-center">
              <div>
                <span className="text-sm sm:text-lg font-mono font-bold text-white block">{targetsSmashed}</span>
                <span className="text-[7px] font-mono text-[#8C9098] uppercase">SMASHED</span>
              </div>
              <div>
                <span className="text-sm sm:text-lg font-mono font-bold text-[#EF4444] block">{decoysHit}</span>
                <span className="text-[7px] font-mono text-[#8C9098] uppercase">ALLIES HIT</span>
              </div>
              <div>
                <span className="text-sm sm:text-lg font-mono font-bold text-[#00FF88] block">x{highestCombo}</span>
                <span className="text-[7px] font-mono text-[#8C9098] uppercase">MAX COMBO</span>
              </div>
              <div>
                <span className="text-sm sm:text-lg font-mono font-bold text-[#38BDF8] block">{teamUpsUsed}</span>
                <span className="text-[7px] font-mono text-[#8C9098] uppercase">TEAM-UPS</span>
              </div>
              <div>
                <span className="text-sm sm:text-lg font-mono font-bold text-white block">{accuracy}%</span>
                <span className="text-[7px] font-mono text-[#8C9098] uppercase">ACCURACY</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={startCountdownSequence}
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-[#10B981] via-[#22C55E] to-[#00FF88] text-black font-mono font-black text-xs uppercase tracking-widest transition-transform hover:scale-105 rounded-sm cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4 stroke-[3]" />
                <span>PLAY AGAIN</span>
              </button>

              <button
                type="button"
                onClick={() => openModalSafely(setShowAvatarPicker)}
                className="w-full sm:w-auto px-4 py-3 bg-[#0D1A12] hover:bg-[#10B981]/25 border border-[#10B981]/60 text-[#00FF88] font-mono font-bold text-xs uppercase tracking-wider rounded-sm cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>SWAP AVATAR</span>
              </button>

              <button
                type="button"
                onClick={() => handleAuditionCharacterVoice(activeAvatar.id)}
                className="w-full sm:w-auto px-4 py-3 bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/60 text-[#00FF88] font-mono font-bold text-xs uppercase tracking-wider rounded-sm cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-4 h-4" />
                <span>{activeAvatar.id === 'hulk' ? 'HULK ROAR' : 'AVATAR VOICE'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 bg-[#12141A] hover:bg-[#1A1D24] border border-[#232731] hover:border-white/50 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors rounded-sm cursor-pointer"
              >
                BACK TO WEBSITE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SHOCKWAVE RING OVERLAYS ── */}
      {shockwaves.map((wave) => (
        <div
          key={wave.id}
          className="fixed pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${wave.x}px`, top: `${wave.y}px` }}
        >
          <div
            className="w-24 h-24 rounded-full border-4 gamma-shockwave-ring"
            style={{ borderColor: wave.color }}
          />
        </div>
      ))}

      {/* ── COMIC BURSTS POPUP OVERLAYS ── */}
      {comicBursts.map((burst) => (
        <div
          key={burst.id}
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${burst.x}px`, top: `${burst.y}px` }}
        >
          <div
            className="comic-word-burst font-cinematic font-black text-2xl sm:text-4xl uppercase drop-shadow-[0_0_15px_rgba(0,0,0,0.95)] whitespace-nowrap"
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
            className={`floating-score font-mono font-black text-lg sm:text-2xl drop-shadow-[0_0_8px_rgba(0,0,0,0.95)] whitespace-nowrap ${float.isPositive ? 'text-[#00FF88]' : 'text-[#EF4444]'
              }`}
          >
            {float.text}
          </div>
        </div>
      ))}
    </div>
  );
}
