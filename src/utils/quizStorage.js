/**
 * Isolated LocalStorage Progress Manager for MCU ULTIMATE QUIZ.
 * Stores unlocked Infinity Stones, special achievements, session stats,
 * and a rolling recently-seen question history without touching existing site keys.
 */

const QUIZ_STORAGE_KEY = 'mcu_ultimate_quiz_progress_v1';
const MAX_RECENT_QUESTIONS = 250;

export const STONE_MILESTONES = [
  { id: 'space', minScore: 2 },
  { id: 'mind', minScore: 4 },
  { id: 'reality', minScore: 6 },
  { id: 'power', minScore: 8 },
  { id: 'time', minScore: 9 },
  { id: 'soul', minScore: 10 },
];

export function computeUnlockedStones(score) {
  return STONE_MILESTONES.filter((m) => score >= m.minScore).map((m) => m.id);
}

export function computeEarnedAchievements({ score, maxStreak }) {
  const earned = [];
  if (maxStreak >= 5) earned.push('spider-sense');
  if (score >= 7) earned.push('super-soldier');
  if (score >= 8) earned.push('thunder-power');
  if (score >= 10) earned.push('nano-armor');
  return earned;
}

const DEFAULT_PROGRESS = {
  bestScore: 0,
  totalSessions: 0,
  perfectCount: 0,
  unlockedStones: [],
  unlockedAchievements: [],
  recentQuestionIds: [],
  lastSession: null,
};

export function loadQuizProgress() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { ...DEFAULT_PROGRESS };
  }
  try {
    const raw = window.localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    const rawBest = Number(parsed.bestScore) || 0;
    const scaledBest = rawBest > 10 ? Math.min(10, Math.max(1, Math.round((rawBest / 25) * 10))) : rawBest;
    return {
      bestScore: scaledBest,
      totalSessions: Number(parsed.totalSessions) || 0,
      perfectCount: Number(parsed.perfectCount) || 0,
      unlockedStones: Array.isArray(parsed.unlockedStones) ? parsed.unlockedStones : [],
      unlockedAchievements: Array.isArray(parsed.unlockedAchievements) ? parsed.unlockedAchievements : [],
      recentQuestionIds: Array.isArray(parsed.recentQuestionIds) ? parsed.recentQuestionIds : [],
      lastSession: parsed.lastSession || null,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveQuizSessionResult({
  score,
  totalQuestions = 10,
  maxStreak = 0,
  questionIds = [],
  language = 'en',
  rankId = 'tourist',
}) {
  const current = loadQuizProgress();
  const newlyUnlockedStones = computeUnlockedStones(score);
  const newlyEarnedAchievements = computeEarnedAchievements({ score, maxStreak });

  const mergedStones = Array.from(
    new Set([...current.unlockedStones, ...newlyUnlockedStones])
  );
  const mergedAchievements = Array.from(
    new Set([...current.unlockedAchievements, ...newlyEarnedAchievements])
  );

  // Rolling non-repeating queue keeping the most recent 250 seen IDs
  const filteredOld = current.recentQuestionIds.filter((id) => !questionIds.includes(id));
  const mergedRecent = [...filteredOld, ...questionIds].slice(-MAX_RECENT_QUESTIONS);

  const next = {
    bestScore: Math.max(current.bestScore, score),
    totalSessions: current.totalSessions + 1,
    perfectCount: current.perfectCount + (score === totalQuestions ? 1 : 0),
    unlockedStones: mergedStones,
    unlockedAchievements: mergedAchievements,
    recentQuestionIds: mergedRecent,
    lastSession: {
      score,
      totalQuestions,
      accuracy: Math.round((score / totalQuestions) * 100),
      maxStreak,
      language,
      rankId,
      stonesInRun: newlyUnlockedStones,
      achievementsInRun: newlyEarnedAchievements,
      completedAt: new Date().toISOString(),
    },
  };

  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }
  return next;
}

export function resetQuizProgress() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.removeItem(QUIZ_STORAGE_KEY);
    } catch { }
  }
  return { ...DEFAULT_PROGRESS };
}
