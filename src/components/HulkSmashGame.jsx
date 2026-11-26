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
import { hulkAudio, SOUND_CATALOG, STUDIO_SFX_PATHS } from '../utils/hulkAudio';
import { useAvengersBgm } from '../utils/bgm.js';
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
  ArrowLeft,
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
    if (typeof window === 'undefined' || !window.localStorage) {
      return ALL_AVATARS.find((a) => a.id === 'hulk') || HULK_PROFILE;
    }
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
export function spawnArenaWave(currentSlots, level, { forceInitial = false, isTimeFrozen = false, excludeAvatarId = null } = {}) {
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
      const decoyPool = excludeAvatarId
        ? DECOYS.filter((d) => d.characterId !== excludeAvatarId)
        : DECOYS;
      const effectivePool = decoyPool.length > 0 ? decoyPool : DECOYS;
      template = effectivePool[Math.floor(Math.random() * effectivePool.length)];
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
  const [gameState, setGameState] = useState('loading');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatusText, setLoadingStatusText] = useState('[01/04] INITIALIZING BANNER GAMMA LAB...');
  const [audioLoadCount, setAudioLoadCount] = useState({
    loaded: 0,
    total: SOUND_CATALOG.length + Object.keys(STUDIO_SFX_PATHS).length,
  });
  const [countdownNumber, setCountdownNumber] = useState(3);

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

  const [overchargeMs, setOverchargeMs] = useState(0);
  const [freezeMs, setFreezeMs] = useState(0);
  const isOverchargeActive = overchargeMs > 0;
  const isTimeFrozen = freezeMs > 0;

  const [slots, setSlots] = useState(() => Array(GRID_SIZE).fill(null));
  const [dialogue, setDialogue] = useState('HULK IS ALWAYS ANGRY. LET US SMASH!');
  const [screenShake, setScreenShake] = useState(false);
  const [comicBursts, setComicBursts] = useState([]);
  const [floatingScores, setFloatingScores] = useState([]);
  const [shockwaves, setShockwaves] = useState([]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const {
    enabled: bgmEnabled,
    isPlaying: bgmPlaying,
    customBgmName,
    toggle: toggleBgm,
    importCustomBgm,
    clearCustomBgm,
  } = useAvengersBgm();
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
  const loadingProgressRef = useRef(0);
  const countdownStepRef = useRef(3);
  const activeTimeoutsRef = useRef(new Set());
  const isTimeFrozenRef = useRef(false);
  const gameStateRef = useRef(gameState);

  useEffect(() => {
    isTimeFrozenRef.current = isTimeFrozen;
  }, [isTimeFrozen]);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

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

  const scheduleTimeout = useCallback((fn, delay) => {
    const id = setTimeout(() => {
      activeTimeoutsRef.current.delete(id);
      fn();
    }, delay);
    activeTimeoutsRef.current.add(id);
    return id;
  }, []);

  const clearAllTimers = useCallback(() => {
    clearInterval(gameTimerRef.current);
    clearInterval(spawnTimerRef.current);
    clearInterval(loadingTimerRef.current);
    clearTimeout(loadingDoneTimeoutRef.current);
    clearInterval(countdownTimerRef.current);
    clearTimeout(shakeTimeoutRef.current);
    activeTimeoutsRef.current.forEach((id) => clearTimeout(id));
    activeTimeoutsRef.current.clear();
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
    setShockwaves((prev) => [...prev.slice(-4), { id: waveId, x, y, color: color || '#34D399' }]);
    scheduleTimeout(() => {
      setShockwaves((prev) => prev.filter((w) => w.id !== waveId));
    }, 560);

    if (word) {
      const burstId = `${uid}-burst`;
      setComicBursts((prev) => [...prev.slice(-4), { id: burstId, word, x, y, color: color || '#E5E7EB' }]);
      scheduleTimeout(() => {
        setComicBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 650);
    }

    if (floatText) {
      const floatId = `${uid}-float`;
      setFloatingScores((prev) => [...prev.slice(-4), { id: floatId, text: floatText, x, y, isPositive }]);
      scheduleTimeout(() => {
        setFloatingScores((prev) => prev.filter((f) => f.id !== floatId));
      }, 620);
    }
  }, [scheduleTimeout]);

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

  const closeModalsSafely = useCallback(() => {
    setShowHowToPlay(false);
    setShowSoundboard(false);
    setShowAvatarPicker(false);
    if (pausedByModal) {
      setPausedByModal(false);
      setSlots((prev) =>
        spawnArenaWave(prev.map(() => null), currentLevel, {
          forceInitial: true,
          excludeAvatarId: activeAvatar?.id,
        })
      );
      setGameState('playing');
    }
  }, [pausedByModal, currentLevel, activeAvatar]);

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

  const startActiveGame = useCallback(() => {
    clearInterval(countdownTimerRef.current);
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
    setOverchargeMs(0);
    setFreezeMs(0);
    setComicBursts([]);
    setFloatingScores([]);
    setShockwaves([]);
    setIsNewRecord(false);
    setSlots(
      spawnArenaWave(Array(GRID_SIZE).fill(null), 1, {
        forceInitial: true,
        excludeAvatarId: activeAvatar?.id,
      })
    );
    setDialogue(
      activeAvatar?.id === 'hulk'
        ? HULK_DIALOGUES.intro[Math.floor(Math.random() * HULK_DIALOGUES.intro.length)]
        : `${activeAvatar.name.toUpperCase()} & HULK DEPLOYED — SMASH VILLAINS!`
    );
    setGameState('playing');
  }, [activeAvatar]);

  const startCountdownSequence = useCallback(() => {
    clearAllTimers();
    setShowHowToPlay(false);
    setShowSoundboard(false);
    setShowAvatarPicker(false);
    setPausedByModal(false);
    countdownStepRef.current = 3;
    setCountdownNumber(3);
    setGameState('countdown');
    try { hulkAudio.playCountdownBeep(false, 3); } catch { }
  }, [clearAllTimers]);

  useEffect(() => {
    if (gameState !== 'countdown' || showHowToPlay || showSoundboard || showAvatarPicker) {
      clearInterval(countdownTimerRef.current);
      return;
    }

    countdownTimerRef.current = setInterval(() => {
      const nextCount = countdownStepRef.current - 1;
      countdownStepRef.current = nextCount;
      if (nextCount === 0) {
        setCountdownNumber('HULK SMASH!');
        try {
          hulkAudio.playCountdownBeep(true, 0);
          hulkAudio.playHulkRoar();
        } catch { }
        triggerScreenShake();
      } else if (nextCount < 0) {
        clearInterval(countdownTimerRef.current);
        startActiveGame();
      } else {
        setCountdownNumber(nextCount);
        try { hulkAudio.playCountdownBeep(false, nextCount); } catch { }
      }
    }, 860);

    return () => clearInterval(countdownTimerRef.current);
  }, [gameState, showHowToPlay, showSoundboard, showAvatarPicker, startActiveGame, triggerScreenShake]);

  useEffect(() => {
    if (gameState !== 'loading' || showHowToPlay || showSoundboard || showAvatarPicker) {
      clearInterval(loadingTimerRef.current);
      clearTimeout(loadingDoneTimeoutRef.current);
      return;
    }

    if (loadingProgressRef.current === 0) {
      try { hulkAudio.playChargingSweep(); } catch { }
    }
    let currentPct = loadingProgressRef.current;

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
        loadingProgressRef.current = 100;
        setLoadingProgress(100);
        loadingDoneTimeoutRef.current = setTimeout(() => {
          startCountdownSequence();
        }, 280);
      } else {
        loadingProgressRef.current = currentPct;
        setLoadingProgress(currentPct);
      }
    }, 105);

    return () => {
      clearInterval(loadingTimerRef.current);
      clearTimeout(loadingDoneTimeoutRef.current);
    };
  }, [gameState, showHowToPlay, showSoundboard, showAvatarPicker, startCountdownSequence]);

  const handleSkipLoading = () => {
    clearInterval(loadingTimerRef.current);
    clearTimeout(loadingDoneTimeoutRef.current);
    loadingProgressRef.current = 100;
    setLoadingProgress(100);
    startCountdownSequence();
  };

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
        if (prev <= 10) {
          try { hulkAudio.playTimerTick(prev <= 6); } catch { }
          if (prev <= 8 && prev % 3 === 0) {
            setDialogue(HULK_DIALOGUES.lowTime[Math.floor(Math.random() * HULK_DIALOGUES.lowTime.length)]);
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimerRef.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const buffTicker = setInterval(() => {
      setOverchargeMs((prev) => (prev > 100 ? prev - 100 : 0));
      setFreezeMs((prev) => (prev > 100 ? prev - 100 : 0));
    }, 100);
    return () => clearInterval(buffTicker);
  }, [gameState]);

  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing') {
      clearInterval(spawnTimerRef.current);
      setOverchargeMs(0);
      setFreezeMs(0);
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

  useEffect(() => {
    if (gameState !== 'playing') {
      clearInterval(spawnTimerRef.current);
      return;
    }

    const spawnInterval = currentLevel === 1 ? 1020 : currentLevel === 2 ? 800 : 610;

    spawnTimerRef.current = setInterval(() => {
      setSlots((currentSlots) =>
        spawnArenaWave(currentSlots, currentLevel, {
          isTimeFrozen: isTimeFrozenRef.current,
          excludeAvatarId: activeAvatar?.id,
        })
      );
    }, spawnInterval);

    return () => clearInterval(spawnTimerRef.current);
  }, [gameState, currentLevel, activeAvatar]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && gameState === 'playing') {
        setGameState('paused');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [gameState]);

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
          word: 'BIFROST THUNDER',
          color: '#60A5FA',
          floatText: `+${guaranteedPts} TEAM-UP`,
          isPositive: true,
        });

        scheduleTimeout(() => {
          if (gameStateRef.current !== 'playing') return;
          setSlots((cur) =>
            spawnArenaWave(cur, currentLevel, {
              isTimeFrozen: isTimeFrozenRef.current,
              excludeAvatarId: activeAvatar?.id,
            })
          );
        }, 280);
      } else if (assist.id === 'ironman-overcharge') {
        setOverchargeMs(5000);

        spawnImpactVisuals(centerX, centerY, {
          word: 'STARK 2X OVERCHARGE',
          color: '#D4AF37',
          floatText: '5S DOUBLE POINTS',
          isPositive: true,
        });
      } else if (assist.id === 'strange-timestasis') {
        setFreezeMs(4000);

        spawnImpactVisuals(centerX, centerY, {
          word: 'TIME STASIS',
          color: '#34D399',
          floatText: 'CLOCK PAUSED 4S',
          isPositive: true,
        });
      }
    },
    [gameState, teamUpCharge, combo, isOverchargeActive, currentLevel, activeAvatar, triggerScreenShake, spawnImpactVisuals, scheduleTimeout]
  );

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
          setSlots((prev) =>
            spawnArenaWave(prev.map(() => null), currentLevel, {
              forceInitial: true,
              excludeAvatarId: activeAvatar?.id,
            })
          );
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
  }, [gameState, showHowToPlay, showSoundboard, showAvatarPicker, currentLevel, activeAvatar, closeModalsSafely, handleTriggerHeroAssist, onClose]);

  const handleSmashSlot = (index, e) => {
    if (gameState !== 'playing') return;

    const target = slots[index];
    if (!target || target.isSmashed) return;

    const hasRemainingTarget = slots.some(
      (s, i) => i !== index && s && s.type === 'smash' && !s.isSmashed
    );

    setSlots((prev) => {
      const copy = [...prev];
      if (copy[index]) copy[index] = { ...copy[index], isSmashed: true };
      return copy;
    });

    if (target.type === 'smash' && !hasRemainingTarget) {
      scheduleTimeout(() => {
        if (gameStateRef.current !== 'playing') return;
        setSlots((cur) =>
          spawnArenaWave(cur, currentLevel, {
            isTimeFrozen: isTimeFrozenRef.current,
            excludeAvatarId: activeAvatar?.id,
          })
        );
      }, 240);
    }

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
        color: '#E5E7EB',
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
        color: '#DC2626',
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
    if (customAudioSlot === 'bgm:primary') {
      const res = await importCustomBgm(file);
      if (res.ok) {
        setUploadStatusMsg(`ACTIVE AVENGERS BGM: "${res.fileName}"`);
      } else {
        setUploadStatusMsg(`FAILED: ${res.error}`);
      }
      e.target.value = '';
      return;
    }
    const isChar = customAudioSlot.startsWith('char:');
    const targetId = isChar ? customAudioSlot.slice(5) : customAudioSlot;
    const res = await hulkAudio.importCustomAudioFile(targetId, file, isChar);
    if (res.ok) {
      setCustomOverrides(hulkAudio.getCustomOverrides());
      setUploadStatusMsg(`IMPORTED "${res.fileName}" — SAVED TO BROWSER`);
    } else {
      setUploadStatusMsg(`FAILED: ${res.error}`);
    }
    e.target.value = '';
  };

  const handleResetCustomAudio = async () => {
    if (customAudioSlot === 'bgm:primary') {
      await clearCustomBgm();
      setUploadStatusMsg('RESTORED BUILT-IN ORCHESTRAL AVENGERS BGM');
      return;
    }
    const isChar = customAudioSlot.startsWith('char:');
    const targetId = isChar ? customAudioSlot.slice(5) : customAudioSlot;
    const next = await hulkAudio.clearCustomAudio(targetId, isChar);
    setCustomOverrides(next);
    setUploadStatusMsg('RESTORED BUILT-IN AUDIO ASSET');
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
      className={`fixed inset-0 z-50 bg-[#050608] flex flex-col justify-between overflow-hidden select-none transition-colors duration-300 ${isTimeFrozen
        ? 'ring-2 ring-inset ring-[#34D399]/60'
        : isOverchargeActive
          ? 'ring-2 ring-inset ring-[#D4AF37]/60'
          : ''
        }`}
    >
      {/* Subtle Film-Still Cinema Backdrop */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <img
          src={activeAvatar.poster}
          alt=""
          className="w-full h-full object-cover object-top opacity-[0.06] filter grayscale contrast-125"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(5,6,8,0.65) 0%, #050608 75%)',
          }}
        />
      </div>

      {/* ── TOP EDITORIAL HEADER BAR ── */}
      <header className="relative w-full px-3 sm:px-6 py-2.5 border-b border-[#1A1E26] bg-[#07080B]/95 flex items-center justify-between gap-2 z-30 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="text-[11px] font-mono text-[#8E94A0] hover:text-white transition-colors inline-flex items-center gap-1.5 cursor-pointer uppercase tracking-wider shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">BACK TO SITE</span>
          <span className="xs:hidden">BACK</span>
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={activeAvatar.poster}
            alt={activeAvatar.name}
            className="w-8 h-9 rounded-[2px] object-cover object-[50%_18%] brightness-105 contrast-105 border border-[#34D399]/75 shrink-0 shadow-sm"
          />
          <span className="text-xs sm:text-sm font-cinematic font-black text-metallic uppercase tracking-[0.14em] truncate">
            HULK SMASH MAYHEM
          </span>
          <span className="hidden lg:inline-block text-[10px] font-mono tracking-[0.16em] text-[#34D399] font-semibold uppercase border-l border-[#232833] pl-2.5 truncate max-w-[180px]">
            {activeAvatar.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => openModalSafely(setShowAvatarPicker)}
            className="px-2.5 py-1.5 border border-[#34D399]/50 hover:border-[#34D399] bg-[#0D1411] text-white rounded-[2px] transition-colors cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold"
            title="Choose any of 51 Marvel Character Avatars"
          >
            <img
              src={activeAvatar.poster}
              alt=""
              className="w-4 h-5 rounded-[1px] object-cover object-[50%_18%] brightness-110 shrink-0"
            />
            <span className="hidden sm:inline">AVATAR ({ALL_AVATARS.length})</span>
            <span className="sm:hidden">HERO</span>
          </button>

          <button
            type="button"
            onClick={() => openModalSafely(setShowSoundboard)}
            className="px-2.5 py-1.5 border border-[#272D38] hover:border-[#4B5565] bg-[#0D1015] text-[#D1D5DB] hover:text-white rounded-[2px] transition-colors cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-semibold"
            title="Hulk & Marvel Tamil AI Voice Vault + Custom Importer"
          >
            <Music className="w-3.5 h-3.5 text-[#9CA3AF]" />
            <span className="hidden md:inline">AUDIO &amp; HEROES</span>
          </button>

          <button
            type="button"
            onClick={() => openModalSafely(setShowHowToPlay)}
            aria-label="How to play"
            className="p-1.5 sm:p-2 border border-[#272D38] bg-[#0D1015] text-[#8E94A0] hover:text-white hover:border-[#4B5565] rounded-[2px] transition-colors cursor-pointer"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            role="switch"
            aria-checked={bgmEnabled}
            onClick={toggleBgm}
            aria-label={bgmEnabled ? 'Turn Avengers BGM Off' : 'Turn Avengers BGM On'}
            className={`hidden sm:inline-flex items-center gap-2 pl-2 pr-1 py-1 border rounded-[3px] text-[9.5px] font-mono font-bold uppercase transition-colors cursor-pointer ${
              bgmEnabled
                ? 'border-[#264633] bg-[#0B120E] text-white'
                : 'border-[#272D38] bg-[#0B0D11] text-[#7A818D] hover:text-white'
            }`}
            title="Toggle Avengers Orchestral Background Score"
          >
            <div className="flex items-end gap-[1.5px] h-2.5" aria-hidden="true">
              {[0, 120, 240].map((d, idx) => (
                <span
                  key={d}
                  style={{ animationDelay: `${d}ms`, height: idx === 1 ? '10px' : '7px' }}
                  className={`w-[2px] rounded-[1px] ${
                    bgmEnabled && bgmPlaying
                      ? 'bgm-eq-bar bg-[#22C55E]'
                      : bgmEnabled
                        ? 'bg-[#D1D5DB]'
                        : 'bg-[#3B4250]'
                  }`}
                />
              ))}
            </div>
            <span>BGM</span>
            <span
              className={`px-1.5 py-0.5 rounded-[2px] text-[8.5px] font-extrabold leading-none ${
                bgmEnabled ? 'bg-[#F3F4F6] text-[#08090B]' : 'bg-[#1D222C] text-[#9CA3AF]'
              }`}
            >
              {bgmEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setVoiceEnabled((prev) => !prev)}
            aria-label={voiceEnabled ? 'Disable Tamil AI Hero Voices' : 'Enable Tamil AI Hero Voices'}
            className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 border rounded-[2px] text-[10px] font-mono font-semibold uppercase transition-colors cursor-pointer ${voiceEnabled
              ? 'border-[#34D399]/70 bg-[#0F1B16] text-[#34D399]'
              : 'border-[#272D38] bg-[#0D1015] text-[#7A818D] hover:text-white'
              }`}
            title="Toggle Neural AI Tamil Hero & Mass Voices"
          >
            {voiceEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{voiceEnabled ? 'TAMIL VOICE ON' : 'VOICE OFF'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? 'Mute game sound' : 'Unmute game sound'}
            className="p-1.5 sm:p-2 border border-[#272D38] bg-[#0D1015] text-[#8E94A0] hover:text-white rounded-[2px] transition-colors cursor-pointer"
            title={soundEnabled ? 'SFX On' : 'SFX Off'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-[#34D399]" /> : <VolumeX className="w-4 h-4 text-[#DC2626]" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Exit Game"
            className="p-1.5 sm:p-2 border border-[#272D38] bg-[#0D1015] text-[#8E94A0] hover:text-white hover:border-[#DC2626] rounded-[2px] transition-colors cursor-pointer"
            title="Close Game"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ═════════════════════════════════════════════════════════════════════
          1. CINEMATIC CONTAINMENT BRIEFING & LOADING SEQUENCE
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'loading' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-20">
          {/* Architectural Film-Frame Roster Lineup */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6">
            {FEATURED_GAME_CAST.slice(1, 4).map((hero) => (
              <div
                key={hero.id}
                className="w-10 h-14 sm:w-12 sm:h-16 overflow-hidden border border-[#222834] bg-[#090B0E] rounded-[2px] opacity-60 hidden xs:block"
              >
                <img src={hero.poster} alt={hero.name} className="w-full h-full object-cover object-top filter grayscale-[25%]" />
              </div>
            ))}

            <button
              type="button"
              onClick={() => openModalSafely(setShowAvatarPicker)}
              className="relative w-24 h-32 sm:w-28 sm:h-36 mx-1.5 overflow-hidden border border-[#34D399]/70 bg-[#090B0E] rounded-[2px] gamma-glow-pulse cursor-pointer group"
              title="Click to switch Marvel Avatar"
            >
              <img src={activeAvatar.poster} alt={activeAvatar.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
              <span className="absolute bottom-1.5 inset-x-1.5 text-[8.5px] font-mono font-semibold text-[#D1D5DB] uppercase tracking-[0.16em]">
                SWAP AVATAR
              </span>
            </button>

            {FEATURED_GAME_CAST.slice(4, 7).map((char) => (
              <div
                key={char.id}
                className="w-10 h-14 sm:w-12 sm:h-16 overflow-hidden border border-[#222834] bg-[#090B0E] rounded-[2px] opacity-60 hidden xs:block"
              >
                <img src={char.poster} alt={char.name} className="w-full h-full object-cover object-top filter grayscale-[25%]" />
              </div>
            ))}
          </div>

          <span className="text-[10px] font-mono tracking-[0.26em] text-[#8E94A0] uppercase mb-2">
            ACTIVE AVATAR: <span className="text-[#34D399] font-semibold">{activeAvatar.name}</span> // SECTOR 616
          </span>

          <h2 className="text-3xl sm:text-5xl font-cinematic font-black text-metallic uppercase tracking-tight mb-2">
            HULK SMASH MAYHEM
          </h2>

          <p className="text-xs font-mono tracking-[0.22em] text-[#7D838E] uppercase mb-7">
            &ldquo;THAT&apos;S MY SECRET, CAP — I&apos;M ALWAYS ANGRY.&rdquo;
          </p>

          {/* Hairline Architectural Progress Track */}
          <div className="w-full max-w-md h-[3px] bg-[#141820] overflow-hidden mb-2.5">
            <div
              className="h-full bg-[#34D399] transition-all duration-150 ease-out"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-between w-full max-w-md text-[10px] font-mono mb-7 tracking-wider">
            <span className="text-[#8E94A0] uppercase truncate max-w-[68%] text-left">
              {loadingStatusText}
            </span>
            <span className="text-[#D1D5DB] font-semibold">
              {loadingProgress}% ({audioLoadCount.loaded}/{audioLoadCount.total} SFX)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSkipLoading}
              className="relative px-6 py-2.5 bg-[#ECEEF2] hover:bg-white text-[#08090B] text-[10px] font-mono font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer rounded-[2px] inline-flex items-center gap-2"
            >
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#16A34A]" aria-hidden="true" />
              <Zap className="w-3.5 h-3.5" />
              <span>SKIP &amp; SMASH NOW</span>
            </button>

            <button
              type="button"
              onClick={() => openModalSafely(setShowAvatarPicker)}
              className="px-4 py-2.5 bg-[#0D1015] hover:bg-[#151922] border border-[#272D38] hover:border-[#4B5565] text-[#D1D5DB] hover:text-white text-[10px] font-mono font-semibold tracking-[0.18em] uppercase transition-colors cursor-pointer rounded-[2px] inline-flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-[#34D399]" />
              <span>CHANGE AVATAR</span>
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          2. THEATRICAL COUNTDOWN OVERLAY (3... 2... 1... HULK SMASH!)
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'countdown' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 sm:w-12 bg-[#2C333E]" />
            <span className="text-[10px] font-mono tracking-[0.28em] text-[#8E94A0] uppercase">
              {activeAvatar.name.toUpperCase()} DEPLOYING WITH HULK
            </span>
            <span className="h-px w-8 sm:w-12 bg-[#2C333E]" />
          </div>

          <div
            key={countdownNumber}
            className={`font-trailer font-normal leading-none text-center select-none countdown-zoom ${countdownNumber === 'HULK SMASH!'
              ? 'text-6xl sm:text-8xl md:text-[10rem] tracking-[0.06em] text-[#34D399] drop-shadow-[0_0_32px_rgba(52,211,153,0.4)]'
              : 'text-8xl sm:text-[10.5rem] md:text-[13rem] tracking-[0.04em] text-metallic drop-shadow-[0_12px_32px_rgba(0,0,0,0.85)]'
              }`}
          >
            {countdownNumber}
          </div>

          <span className="mt-3 text-[10px] sm:text-xs font-hud font-bold tracking-[0.34em] uppercase text-[#9CA3AF]">
            {countdownNumber === 3
              ? 'CALIBRATING GAMMA IMPACT'
              : countdownNumber === 2
                ? 'HOSTILE SIGNATURES LOCKED'
                : countdownNumber === 1
                  ? 'ALLIES SHIELDED — READY'
                  : 'SMASH ACTIVATED — ENGAGE!'}
          </span>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E94A0]">
            <span>
              <strong className="text-[#34D399] font-semibold">STRIKE</strong> HOSTILES
            </span>
            <span className="text-[#2C333E]">|</span>
            <span>
              <strong className="text-[#DC2626] font-semibold">PROTECT</strong> AVENGERS
            </span>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          3. ACTIVE TACTICAL COMBAT ARENA
         ═════════════════════════════════════════════════════════════════════ */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div
          className={`w-full max-w-5xl mx-auto px-2.5 sm:px-6 pt-2.5 pb-2.5 flex flex-col justify-between flex-1 min-h-0 relative z-20 transition-transform ${screenShake ? 'screen-shake-smash' : ''
            }`}
        >
          {/* Top Architectural HUD Bar */}
          <div className="border border-[#1D222B] bg-[#0A0C10]/95 rounded-[2px] grid grid-cols-12 items-stretch shrink-0 divide-x divide-[#1A1F28]">
            {/* Score + Multiplier */}
            <div className="col-span-5 md:col-span-4 px-3 py-2 flex items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[8.5px] font-mono text-[#7C828D] tracking-[0.2em] uppercase">
                    SCORE
                  </span>
                  {isOverchargeActive && (
                    <span className="px-1.5 py-0.2 bg-[#D4AF37] text-black text-[8px] font-mono font-bold rounded-[1px] tabular-nums">
                      2X {(overchargeMs / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
                <span
                  className={`text-2xl sm:text-4xl font-hud font-extrabold tracking-wide tabular-nums block leading-none mt-0.5 ${isOverchargeActive ? 'text-[#D4AF37]' : 'text-white'
                    }`}
                >
                  {score.toLocaleString()}
                </span>
              </div>

              <div className="px-2.5 py-1 bg-[#0F1218] border border-[#232934] rounded-[2px] text-right">
                <span className="text-[7.5px] font-mono text-[#7C828D] uppercase block tracking-wider">
                  STREAK
                </span>
                <span
                  className="text-sm sm:text-base font-hud font-bold tracking-wider tabular-nums"
                  style={{ color: combo >= 5 ? '#34D399' : '#D1D5DB' }}
                >
                  x{combo}
                </span>
              </div>
            </div>

            {/* Center: Clickable Clear Avatar & Live Reaction Console */}
            <button
              type="button"
              onClick={() => openModalSafely(setShowAvatarPicker)}
              className="hidden md:flex md:col-span-5 items-center gap-3 px-3.5 py-2 hover:bg-[#0F1319] transition-colors cursor-pointer text-left min-w-0"
              title="Click to switch active Marvel Character Avatar"
            >
              <div className="flex -space-x-2 shrink-0">
                <img
                  src={activeAvatar.poster}
                  alt={activeAvatar.name}
                  className="w-12 h-14 rounded-[2px] object-cover object-[50%_18%] brightness-110 contrast-105 border-2 border-[#34D399]/80 shadow-md"
                />
                {activeAvatar.id !== 'hulk' && (
                  <img
                    src={HULK_PROFILE.poster}
                    alt="Hulk Co-Op"
                    className="w-8 h-9 self-end rounded-[2px] object-cover object-[50%_18%] brightness-105 border border-[#34D399]/60"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono font-bold tracking-[0.16em] uppercase text-[#34D399] truncate">
                    {activeAvatar.name} • {currentRageTier.title}
                  </span>
                  <span className="text-[8px] font-mono px-1.5 py-0.5 bg-[#121720] border border-[#2B3340] text-[#D1D5DB] uppercase shrink-0 rounded-[1px]">
                    LVL {currentLevel} • SWAP ▾
                  </span>
                </div>
                <p className="text-xs font-cinematic font-bold text-[#F3F4F6] truncate mt-0.5">
                  &ldquo;{dialogue}&rdquo;
                </p>
                {activeAvatar.voiceLineTamil && (
                  <span className="text-[9px] font-sans text-[#9CA3AF] truncate block mt-0.5">
                    {activeAvatar.voiceLineTamil}
                  </span>
                )}
              </div>
            </button>

            {/* Right: Countdown Clock + Pause */}
            <div className="col-span-7 md:col-span-3 px-3 py-2 flex items-center justify-end gap-3">
              <div className="text-right">
                <span className="text-[8.5px] font-mono text-[#7C828D] tracking-[0.2em] uppercase block tabular-nums">
                  {isTimeFrozen ? `STASIS ${(freezeMs / 1000).toFixed(1)}s` : 'REMAINING'}
                </span>
                <span
                  className={`text-2xl sm:text-4xl font-hud font-extrabold tracking-wide tabular-nums leading-none inline-flex items-center gap-1 mt-0.5 ${isTimeFrozen
                    ? 'text-[#60A5FA]'
                    : timeLeft <= 8
                      ? 'text-[#DC2626]'
                      : 'text-white'
                    }`}
                >
                  {isTimeFrozen && <Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                  {timeLeft}s
                </span>
              </div>

              <button
                type="button"
                onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
                className="p-2 bg-[#11141B] hover:bg-[#191D26] border border-[#262C37] text-[#E5E7EB] rounded-[2px] transition-colors cursor-pointer"
                title={gameState === 'playing' ? 'Pause Game' : 'Resume Game'}
                aria-label={gameState === 'playing' ? 'Pause Game' : 'Resume Game'}
              >
                {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
            </div>
          </div>

          {/* Mobile Avatar Dialogue + Hairline Team-Up Charge Track */}
          <div className="my-1.5 flex flex-col gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => openModalSafely(setShowAvatarPicker)}
              className="md:hidden py-1.5 px-2.5 bg-[#0A0C10] border border-[#1D222B] rounded-[2px] flex items-center justify-between gap-2 text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={activeAvatar.poster}
                  alt={activeAvatar.name}
                  className="w-8 h-9 rounded-[2px] object-cover object-[50%_18%] brightness-110 border border-[#34D399]/70 shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[8.5px] font-mono font-semibold text-[#34D399] uppercase block truncate">
                    {activeAvatar.name}
                  </span>
                  <span className="text-[11px] font-cinematic font-bold text-[#E5E7EB] uppercase block truncate">
                    &ldquo;{dialogue}&rdquo;
                  </span>
                </div>
              </div>
              <span className="text-[8.5px] font-mono font-semibold text-[#D1D5DB] uppercase shrink-0">SWAP ▾</span>
            </button>

            <div className="flex items-center gap-2.5 px-0.5">
              <span className="text-[8.5px] font-mono uppercase tracking-[0.2em] text-[#7C828D] shrink-0">
                TEAM-UP CHARGE
              </span>
              <div className="flex-1 h-[3px] bg-[#141820] overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${teamUpCharge >= 100 ? 'bg-[#34D399]' : 'bg-[#2C4A3A]'
                    }`}
                  style={{ width: `${teamUpCharge}%` }}
                />
              </div>
              <span
                className={`text-[9px] font-mono font-semibold uppercase tracking-wider shrink-0 ${teamUpCharge >= 100 ? 'text-[#34D399]' : 'text-[#7C828D]'
                  }`}
              >
                {teamUpCharge >= 100 ? 'READY [1/2/3]' : `${teamUpCharge}%`}
              </span>
            </div>
          </div>

          {/* 3x3 Tactical Combat Grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 flex-1 min-h-0 max-h-[520px] w-full my-auto">
            {slots.map((item, index) => {
              if (!item) {
                return (
                  <div
                    key={index}
                    className="relative rounded-[2px] border border-[#151820] bg-[#08090C]/90 flex items-center justify-center overflow-hidden"
                  >
                    <div className="w-4 h-4 border border-[#1E232C] opacity-35" />
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
                  className={`group relative rounded-[2px] border flex items-stretch cursor-pointer transition-all duration-150 active:scale-95 overflow-hidden select-none text-left ${item.isSmashed
                    ? 'scale-95 opacity-15 border-white/40'
                    : isDecoy
                      ? 'border-[#7F2930] hover:border-[#EF4444] bg-[#12090B]'
                      : item.isBonus
                        ? 'border-[#34D399] bg-[#08130E]'
                        : 'border-[#254D38] hover:border-[#34D399] bg-[#090E0C]'
                    }`}
                >
                  {/* Subtle Blurred Atmospheric Backdrop Under Telemetry Column */}
                  <img
                    src={item.poster}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover object-[50%_20%] opacity-[0.16] blur-[2px] scale-110 pointer-events-none"
                  />

                  {/* Left Telemetry Column: Tag, Score Delta & Nameplate */}
                  <div className="relative z-10 flex-1 min-w-0 p-1.5 sm:p-2.5 flex flex-col justify-between gap-1">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`inline-flex items-center gap-1 text-[7px] sm:text-[8.5px] font-mono font-bold px-1.5 py-0.5 rounded-[1px] uppercase tracking-[0.12em] truncate border ${isDecoy
                          ? 'bg-[#7F1D1D]/90 border-[#DC2626]/70 text-white'
                          : item.isBonus
                            ? 'bg-[#34D399] border-[#34D399] text-[#050608]'
                            : 'bg-[#0C1D15]/95 border-[#34D399]/60 text-[#34D399]'
                          }`}
                      >
                        {isDecoy ? <ShieldAlert className="w-2.5 h-2.5 shrink-0" /> : <Crosshair className="w-2.5 h-2.5 shrink-0" />}
                        <span className="truncate">{item.badge}</span>
                      </span>

                      <span
                        className={`text-[9px] sm:text-xs font-hud font-bold px-1.5 py-0.5 rounded-[1px] bg-black/85 border border-[#232832] shrink-0 tabular-nums ${isDecoy ? 'text-[#F87171]' : 'text-[#F3F4F6]'
                          }`}
                      >
                        {isDecoy ? `${item.penalty}` : `+${displayPoints}`}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <span className="block text-[10px] sm:text-xs font-cinematic font-bold text-white uppercase leading-tight line-clamp-2">
                        {item.name}
                      </span>
                      <span className="hidden xs:block text-[8px] font-mono text-[#A1A7B3] uppercase tracking-wider truncate mt-0.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Right Crystal-Clear Unobscured Character Portrait Window */}
                  <div
                    className={`relative z-10 w-[44%] sm:w-[46%] max-w-[144px] h-full shrink-0 border-l overflow-hidden bg-[#060709] ${isDecoy ? 'border-[#7F2930]/80' : 'border-[#254D38]/80'
                      }`}
                  >
                    <img
                      src={item.poster}
                      alt={item.name}
                      className="w-full h-full object-cover object-[50%_18%] brightness-110 contrast-[1.06] transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Thin edge vignette only, keeping face 100% visible */}
                    <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/65 to-transparent pointer-events-none" />
                    {!isDecoy && (
                      <>
                        <span className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#34D399]/80 pointer-events-none" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#34D399]/80 pointer-events-none" />
                      </>
                    )}
                  </div>

                  {/* Razor-Thin Lifespan Progress Line */}
                  {!item.isSmashed && (
                    <div
                      className={`target-fuse-bar absolute bottom-0 left-0 right-0 h-[2.5px] z-20 ${isDecoy ? 'bg-[#EF4444]' : 'bg-[#34D399]'
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

          {/* Bottom Avengers Tactical Support Bar */}
          <div className="mt-2 grid grid-cols-3 gap-2 shrink-0">
            {HERO_ASSISTS.map((assist) => {
              const isReady = teamUpCharge >= 100;
              return (
                <button
                  key={assist.id}
                  type="button"
                  disabled={!isReady || gameState !== 'playing'}
                  onClick={() => handleTriggerHeroAssist(assist)}
                  className={`relative flex items-center gap-2.5 p-1.5 sm:p-2 rounded-[2px] border text-left transition-colors overflow-hidden ${isReady
                    ? 'bg-[#0D1512] border-[#34D399]/70 hover:border-[#34D399] cursor-pointer'
                    : 'bg-[#090B0E] border-[#1A1E26] opacity-55 cursor-not-allowed'
                    }`}
                >
                  <img
                    src={assist.poster}
                    alt={assist.heroName}
                    className={`w-10 h-12 sm:w-12 sm:h-14 rounded-[2px] object-cover object-[50%_18%] border shrink-0 ${isReady ? 'border-[#34D399]/75 brightness-110' : 'border-[#262B35] brightness-95'
                      }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] sm:text-[10px] font-cinematic font-bold text-white uppercase truncate">
                        {assist.abilityName}
                      </span>
                      <span
                        className={`hidden sm:inline-block px-1 py-0.2 text-[8px] font-mono font-semibold rounded-[1px] border ${isReady
                          ? 'bg-[#ECEEF2] text-[#08090B] border-[#ECEEF2]'
                          : 'bg-[#11141A] text-[#6B7280] border-[#222732]'
                          }`}
                      >
                        [{assist.hotkey}]
                      </span>
                    </div>
                    <span className="block text-[8px] sm:text-[9px] font-mono text-[#8E94A0] truncate">
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
          4. PAUSED MODAL
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'paused' && !showHowToPlay && !showSoundboard && !showAvatarPicker && (
        <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-[#090B0F] border border-[#252B36] p-6 rounded-[2px] shadow-2xl text-center">
            <img
              src={activeAvatar.poster}
              alt={activeAvatar.name}
              className="w-16 h-20 rounded-[2px] object-cover object-top border border-[#323A48] mx-auto mb-3"
            />
            <h3 className="text-2xl font-cinematic font-black text-metallic uppercase mb-1">
              ARENA PAUSED
            </h3>
            <p className="text-[11px] font-mono tracking-[0.18em] text-[#8E94A0] uppercase mb-5">
              {activeAvatar.name} • {score.toLocaleString()} PTS
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  setSlots((prev) =>
                    spawnArenaWave(prev.map(() => null), currentLevel, {
                      forceInitial: true,
                      excludeAvatarId: activeAvatar?.id,
                    })
                  );
                  setGameState('playing');
                }}
                className="w-full py-2.5 bg-[#ECEEF2] hover:bg-white text-[#08090B] font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors rounded-[2px] cursor-pointer"
              >
                RESUME SMASH
              </button>

              <button
                type="button"
                onClick={() => openModalSafely(setShowAvatarPicker)}
                className="w-full py-2.5 bg-[#101319] hover:bg-[#171C24] border border-[#2A313E] text-[#E5E7EB] font-mono font-semibold text-xs uppercase tracking-[0.18em] transition-colors rounded-[2px] cursor-pointer"
              >
                CHANGE AVATAR ({ALL_AVATARS.length})
              </button>

              <button
                type="button"
                onClick={startCountdownSequence}
                className="w-full py-2.5 bg-[#101319] hover:bg-[#171C24] border border-[#232833] text-[#D1D5DB] font-mono font-semibold text-xs uppercase tracking-[0.18em] transition-colors rounded-[2px] cursor-pointer"
              >
                RESTART ROUND
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 border border-[#5C2428] hover:bg-[#7F1D1D]/25 text-[#F87171] font-mono font-semibold text-xs uppercase tracking-[0.18em] transition-colors rounded-[2px] cursor-pointer"
              >
                EXIT TO SITE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          5. 51-CHARACTER MARVEL AVATAR SELECTOR
         ═════════════════════════════════════════════════════════════════════ */}
      {showAvatarPicker && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl w-full bg-[#090B0F] border border-[#252B36] p-5 sm:p-6 rounded-[2px] shadow-2xl text-left relative my-auto max-h-[90vh] flex flex-col">
            <button
              type="button"
              onClick={closeModalsSafely}
              aria-label="Close Avatar Selector"
              className="absolute top-4 right-4 text-[#8E94A0] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[9.5px] font-mono tracking-[0.24em] text-[#34D399] uppercase mb-1">
              MULTIVERSE CAST ARCHIVE // 51 CHARACTERS
            </span>
            <h3 className="text-xl sm:text-2xl font-cinematic font-black text-metallic uppercase mb-4">
              SELECT COMBAT AVATAR
            </h3>

            <div className="flex flex-col sm:flex-row gap-2.5 mb-3 shrink-0">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-[#7C828D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={avatarSearch}
                  onChange={(e) => setAvatarSearch(e.target.value)}
                  placeholder="Search Iron Man, Spider-Man, Wolverine, Doom..."
                  className="w-full pl-8 pr-3 py-2 bg-[#060709] border border-[#212630] focus:border-[#4B5565] rounded-[2px] text-xs font-mono text-white placeholder-[#5F6672] outline-none"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {AVATAR_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setAvatarCategory(cat)}
                    className={`px-2 py-1 text-[9px] font-mono font-semibold uppercase rounded-[2px] border cursor-pointer transition-colors ${avatarCategory === cat
                      ? 'bg-[#ECEEF2] text-[#08090B] border-[#ECEEF2]'
                      : 'bg-[#0C0F14] text-[#8E94A0] border-[#212630] hover:text-white'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 overflow-y-auto pr-1 py-1 flex-1 min-h-0">
              {filteredAvatars.map((char) => {
                const isSelected = activeAvatar.id === char.id;
                return (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => handleSelectAvatar(char)}
                    className={`group relative rounded-[2px] overflow-hidden border aspect-[3/4] text-left cursor-pointer transition-colors ${isSelected
                      ? 'border-[#34D399]'
                      : 'border-[#1E232C] hover:border-[#4B5565]'
                      }`}
                  >
                    <img
                      src={char.poster}
                      alt={char.name}
                      loading="lazy"
                      className="w-full h-full object-cover object-[50%_18%] brightness-110 contrast-[1.04] group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/75 to-transparent pointer-events-none" />

                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-[2px] bg-[#34D399] text-[#050608] flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}

                    <div className="absolute bottom-1.5 inset-x-1.5">
                      <span className="block text-[10px] font-cinematic font-bold text-white uppercase leading-tight truncate">
                        {char.name}
                      </span>
                      <span className="block text-[8px] font-sans text-[#D1D5DB] truncate">
                        {char.voiceLineTamil || char.voiceLine}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-[#1C2027] flex items-center justify-between gap-2 shrink-0">
              <span className="text-[10px] font-mono text-[#7C828D] uppercase tracking-wider">
                {filteredAvatars.length} / {ALL_AVATARS.length} AVAILABLE
              </span>
              <button
                type="button"
                onClick={closeModalsSafely}
                className="px-5 py-2 bg-[#ECEEF2] hover:bg-white text-[#08090B] font-mono font-bold text-xs uppercase rounded-[2px] cursor-pointer"
              >
                DONE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          6. HOW TO PLAY MODAL
         ═════════════════════════════════════════════════════════════════════ */}
      {showHowToPlay && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-lg w-full bg-[#090B0F] border border-[#252B36] p-6 sm:p-7 rounded-[2px] shadow-2xl text-left relative">
            <button
              type="button"
              onClick={closeModalsSafely}
              aria-label="Close instructions"
              className="absolute top-4 right-4 text-[#8E94A0] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[9.5px] font-mono tracking-[0.22em] text-[#34D399] uppercase block mb-1">
              FIELD BRIEFING // 30S COMBAT PROTOCOL
            </span>
            <h3 className="text-xl sm:text-2xl font-cinematic font-black text-metallic uppercase mb-4">
              HOW TO PLAY
            </h3>

            <div className="space-y-3 text-xs font-body text-[#949AA4] leading-relaxed mb-6">
              <div className="p-3 bg-[#0C0F14] border-l-2 border-[#34D399] rounded-[1px]">
                <span className="text-white font-semibold font-mono text-[11px] uppercase block mb-1 tracking-wider">
                  1. STRIKE HOSTILES (+100 TO +250 PTS x COMBO)
                </span>
                <p>
                  Strike Doombot sentries, Thanos echoes, Loki illusions, and Void anomalies rapidly to stack up to a x10 multiplier.
                </p>
              </div>

              <div className="p-3 bg-[#0C0F14] border-l-2 border-[#DC2626] rounded-[1px]">
                <span className="text-white font-semibold font-mono text-[11px] uppercase block mb-1 tracking-wider">
                  2. PROTECT ALLIED AVENGERS (-50 PTS &amp; STREAK RESET)
                </span>
                <p>
                  Avoid hitting Spider-Man, Iron Man, Captain America, Thor, Wolverine, Deadpool, Scarlet Witch, or Black Widow.
                </p>
              </div>

              <div className="p-3 bg-[#0C0F14] border-l-2 border-[#60A5FA] rounded-[1px]">
                <span className="text-white font-semibold font-mono text-[11px] uppercase block mb-1 tracking-wider">
                  3. AVENGERS TEAM-UPS (KEYS 1, 2, 3) &amp; 51 AVATARS
                </span>
                <p>
                  Fill the Team-Up bar to trigger Thor&apos;s Bifrost Thunder, Iron Man&apos;s 2X Overcharge, or Doctor Strange&apos;s Time Stasis.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModalsSafely}
              className="w-full py-2.5 bg-[#ECEEF2] hover:bg-white text-[#08090B] font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors rounded-[2px] cursor-pointer text-center"
            >
              RETURN TO ARENA
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          7. SOUND VAULT, 51 VOICES & CUSTOM AUDIO IMPORTER MODAL
         ═════════════════════════════════════════════════════════════════════ */}
      {showSoundboard && (
        <div className="absolute inset-0 z-40 bg-black/92 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-3xl w-full bg-[#090B0F] border border-[#252B36] p-5 sm:p-7 rounded-[2px] shadow-2xl text-left relative my-auto max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeModalsSafely}
              aria-label="Close Soundboard"
              className="absolute top-4 right-4 text-[#8E94A0] hover:text-white p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[9.5px] font-mono tracking-[0.24em] text-[#34D399] uppercase block mb-1">
              ACOUSTIC TELEMETRY // BUILT-IN &amp; CUSTOM AUDIO
            </span>
            <h3 className="text-xl sm:text-2xl font-cinematic font-black text-metallic uppercase mb-4">
              HULK &amp; AVENGERS SOUND VAULT
            </h3>

            {/* Custom Local MP3/WAV Audio Importer */}
            <div className="mb-5 p-3.5 bg-[#0C0F14] border border-[#212732] rounded-[2px]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <span className="text-[10px] font-mono font-semibold text-[#D1D5DB] uppercase tracking-[0.16em] inline-flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>IMPORT CUSTOM HULK OR TAMIL CLIP (.MP3 / .WAV)</span>
                </span>
                {(customAudioSlot === 'bgm:primary' ? customBgmName : customOverrides[customAudioSlot]) && (
                  <span className="text-[9px] font-mono text-[#D4AF37] uppercase truncate max-w-[220px]">
                    ACTIVE: {customAudioSlot === 'bgm:primary' ? customBgmName : customOverrides[customAudioSlot]}
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
                  className="px-2.5 py-2 bg-[#060709] border border-[#252B36] text-white text-xs font-mono rounded-[2px] outline-none focus:border-[#4B5565] flex-1"
                >
                  <optgroup label="Avengers Website Background Score (BGM)">
                    <option value="bgm:primary">
                      Background Music: Avengers Original / Custom BGM Loop
                    </option>
                  </optgroup>
                  <optgroup label="Core Hulk &amp; Arena SFX">
                    {SOUND_CATALOG.map((sfx) => (
                      <option key={sfx.id} value={sfx.id}>
                        SFX: {sfx.label} ({sfx.character})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All 51 Marvel Characters (Tamil / Custom Clips)">
                    {ALL_AVATARS.map((char) => (
                      <option key={char.id} value={`char:${char.id}`}>
                        Character: {char.name} ({char.alias})
                      </option>
                    ))}
                  </optgroup>
                </select>

                <label className="px-4 py-2 bg-[#ECEEF2] hover:bg-white text-[#08090B] font-mono font-bold text-xs uppercase rounded-[2px] cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>CHOOSE MP3/WAV</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleImportCustomAudio}
                    className="sr-only"
                  />
                </label>

                {(customAudioSlot === 'bgm:primary' ? customBgmName : customOverrides[customAudioSlot]) && (
                  <button
                    type="button"
                    onClick={handleResetCustomAudio}
                    className="px-3 py-2 bg-[#141820] hover:bg-[#7F1D1D]/25 border border-[#5C2428] text-[#F87171] font-mono font-semibold text-xs uppercase rounded-[2px] cursor-pointer inline-flex items-center justify-center gap-1 shrink-0"
                    title="Restore built-in sound"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>RESET</span>
                  </button>
                )}
              </div>

              {uploadStatusMsg && (
                <p className="mt-2 text-[10px] font-mono text-[#34D399] uppercase">
                  {uploadStatusMsg}
                </p>
              )}
            </div>

            {/* Playable Core SFX Bank */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 mb-5">
              {SOUND_CATALOG.map((sfx) => {
                const isActive = lastPreviewSound === sfx.id;
                return (
                  <button
                    key={sfx.id}
                    type="button"
                    onClick={() => handleAuditionSound(sfx.id)}
                    className={`p-2.5 rounded-[2px] border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${isActive
                      ? 'bg-[#101814] border-[#34D399]'
                      : 'bg-[#0C0F14] border-[#1D222B] hover:border-[#3A4352]'
                      }`}
                  >
                    <div className="min-w-0">
                      <span className="text-[8.5px] font-mono font-semibold uppercase block text-[#8E94A0]">
                        {sfx.character}
                      </span>
                      <span className="text-xs font-cinematic font-bold text-white truncate block">
                        {sfx.label}
                      </span>
                    </div>
                    <Volume2 className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* 51 Character Voices + SFX */}
            <div className="mb-5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h4 className="text-[10px] font-mono font-semibold text-[#D1D5DB] uppercase tracking-[0.18em]">
                  CHARACTER AUDIO SIGNATURES (51)
                </h4>
                <span className="text-[9px] font-mono text-[#7C828D] uppercase">
                  CLICK TO AUDITION
                </span>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                {ALL_AVATARS.map((char) => {
                  const isActive = lastPreviewSound === `char-${char.id}`;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => handleAuditionCharacterVoice(char.id)}
                      className={`p-2 rounded-[2px] border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${isActive
                        ? 'bg-[#101814] border-[#34D399]'
                        : 'bg-[#0C0F14] border-[#1D222B] hover:border-[#3A4352]'
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={char.poster}
                          alt={char.name}
                          loading="lazy"
                          className="w-9 h-11 rounded-[2px] object-cover object-[50%_18%] brightness-110 shrink-0 border border-[#2D3542]"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-cinematic font-bold text-white block truncate">
                            {char.name}
                          </span>
                          <span className="text-[8.5px] font-sans text-[#9CA3AF] block truncate">
                            {char.voiceLineTamil || char.voiceLine}
                          </span>
                        </div>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Targets vs Allies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <h4 className="text-[10px] font-mono font-semibold text-[#34D399] uppercase tracking-[0.16em] mb-2">
                  HOSTILE TARGETS ({SMASH_TARGETS.length})
                </h4>
                <div className="space-y-1.5">
                  {SMASH_TARGETS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleAuditionCharacterVoice(t.characterId)}
                      className="w-full text-left flex items-center justify-between gap-2 p-1.5 bg-[#0C0F14] hover:bg-[#111815] border border-[#22342A] rounded-[2px] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={t.poster} alt={t.name} className="w-8 h-8 rounded-[1px] object-cover object-top shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-white block truncate">{t.name}</span>
                          <span className="text-[9px] font-mono text-[#8E94A0] block truncate">+{t.points} PTS • {t.subtitle}</span>
                        </div>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-[#34D399] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-mono font-semibold text-[#F87171] uppercase tracking-[0.16em] mb-2">
                  ALLIED AVENGERS — PROTECT ({DECOYS.length})
                </h4>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {DECOYS.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => handleAuditionCharacterVoice(d.characterId)}
                      className="w-full text-left flex items-center justify-between gap-2 p-1.5 bg-[#0C0F14] hover:bg-[#191011] border border-[#3E2023] rounded-[2px] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={d.poster} alt={d.name} className="w-8 h-8 rounded-[1px] object-cover object-top shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-white block truncate">{d.name}</span>
                          <span className="text-[9px] font-mono text-[#8E94A0] block truncate">{d.subtitle}</span>
                        </div>
                      </div>
                      <Volume2 className="w-3.5 h-3.5 text-[#F87171] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={closeModalsSafely}
              className="w-full py-2.5 bg-[#ECEEF2] hover:bg-white text-[#08090B] font-mono font-bold text-xs uppercase tracking-[0.2em] rounded-[2px] cursor-pointer"
            >
              RETURN TO GAME
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          8. MISSION DEBRIEF (GAME OVER)
         ═════════════════════════════════════════════════════════════════════ */}
      {gameState === 'gameover' && (
        <div className="flex-1 flex items-center justify-center p-4 relative z-20 overflow-y-auto">
          <div className="max-w-lg w-full bg-[#090B0F] border border-[#252B36] p-6 sm:p-7 rounded-[2px] shadow-2xl text-center relative">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img
                src={activeAvatar.poster}
                alt={activeAvatar.name}
                className="w-12 h-14 rounded-[2px] object-cover object-top border border-[#323A48]"
              />
              <div className="text-left">
                <span className="text-[9px] font-mono tracking-[0.22em] text-[#8E94A0] uppercase block">
                  MISSION DEBRIEF // {activeAvatar.name}
                </span>
                <span className="text-xs font-cinematic font-bold text-white uppercase inline-flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                  FINAL ASSESSMENT
                </span>
              </div>
            </div>

            <div className="text-5xl sm:text-7xl font-hud font-extrabold text-metallic tracking-wide my-3 tabular-nums">
              {score.toLocaleString()}
            </div>

            {isNewRecord && (
              <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#14120C] border border-[#D4AF37]/60 text-[#D4AF37] text-[10px] font-mono font-semibold uppercase tracking-[0.2em] rounded-[2px]">
                NEW ALL-TIME RECORD
              </div>
            )}

            <div className="p-3.5 bg-[#0C0F14] border border-[#1E232D] rounded-[2px] mb-4 text-left">
              <span className="text-[8.5px] font-mono text-[#7C828D] tracking-[0.2em] uppercase block mb-0.5">
                COMBAT PERFORMANCE TIER
              </span>
              <div
                className="text-lg sm:text-xl font-cinematic font-black uppercase tracking-wide mb-0.5"
                style={{ color: finalRank.color }}
              >
                {finalRank.title}
              </div>
              <p className="text-xs font-body text-[#949AA4]">
                {finalRank.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-5 gap-1.5 p-3 bg-[#060709] border border-[#191D24] rounded-[2px] mb-5 text-center">
              <div>
                <span className="text-base sm:text-xl font-hud font-bold text-white tabular-nums block">{targetsSmashed}</span>
                <span className="text-[7px] font-mono text-[#7C828D] uppercase">STRUCK</span>
              </div>
              <div>
                <span className="text-base sm:text-xl font-hud font-bold text-[#F87171] tabular-nums block">{decoysHit}</span>
                <span className="text-[7px] font-mono text-[#7C828D] uppercase">ALLIES HIT</span>
              </div>
              <div>
                <span className="text-base sm:text-xl font-hud font-bold text-[#34D399] tabular-nums block">x{highestCombo}</span>
                <span className="text-[7px] font-mono text-[#7C828D] uppercase">MAX STREAK</span>
              </div>
              <div>
                <span className="text-base sm:text-xl font-hud font-bold text-[#60A5FA] tabular-nums block">{teamUpsUsed}</span>
                <span className="text-[7px] font-mono text-[#7C828D] uppercase">TEAM-UPS</span>
              </div>
              <div>
                <span className="text-base sm:text-xl font-hud font-bold text-white tabular-nums block">{accuracy}%</span>
                <span className="text-[7px] font-mono text-[#7C828D] uppercase">ACCURACY</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={startCountdownSequence}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#ECEEF2] hover:bg-white text-[#08090B] font-mono font-bold text-xs uppercase tracking-[0.2em] transition-colors rounded-[2px] cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>PLAY AGAIN</span>
              </button>

              <button
                type="button"
                onClick={() => openModalSafely(setShowAvatarPicker)}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#101319] hover:bg-[#171C24] border border-[#2A313E] text-[#E5E7EB] font-mono font-semibold text-xs uppercase tracking-[0.16em] rounded-[2px] cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-[#34D399]" />
                <span>SWAP AVATAR</span>
              </button>

              <button
                type="button"
                onClick={() => handleAuditionCharacterVoice(activeAvatar.id)}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#101319] hover:bg-[#171C24] border border-[#2A313E] text-[#D1D5DB] font-mono font-semibold text-xs uppercase tracking-[0.16em] rounded-[2px] cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#34D399]" />
                <span>{activeAvatar.id === 'hulk' ? 'HULK ROAR' : 'AVATAR VOICE'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#090B0F] hover:bg-[#14171F] border border-[#222732] text-[#8E94A0] hover:text-white font-mono font-semibold text-xs uppercase tracking-[0.16em] transition-colors rounded-[2px] cursor-pointer"
              >
                EXIT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TACTICAL SHOCKWAVE OVERLAYS ── */}
      {shockwaves.map((wave) => (
        <div
          key={wave.id}
          className="fixed pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${wave.x}px`, top: `${wave.y}px` }}
        >
          <div
            className="w-20 h-20 rounded-full border-2 gamma-shockwave-ring"
            style={{ borderColor: wave.color }}
          />
        </div>
      ))}

      {/* ── IMPACT CALLOUTS ── */}
      {comicBursts.map((burst) => (
        <div
          key={burst.id}
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${burst.x}px`, top: `${burst.y}px` }}
        >
          <div
            className="comic-word-burst font-cinematic font-black text-2xl sm:text-4xl uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)] whitespace-nowrap"
            style={{ color: burst.color || '#E5E7EB' }}
          >
            {burst.word}
          </div>
        </div>
      ))}

      {/* ── FLOATING SCORE DELTAS ── */}
      {floatingScores.map((float) => (
        <div
          key={float.id}
          className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${float.x}px`, top: `${float.y}px` }}
        >
          <div
            className={`floating-score font-mono font-bold text-base sm:text-xl drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)] whitespace-nowrap ${float.isPositive ? 'text-[#34D399]' : 'text-[#F87171]'
              }`}
          >
            {float.text}
          </div>
        </div>
      ))}
    </div>
  );
}
