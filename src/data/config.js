/**
 * DOOMSDAY — Central Configuration
 * Configurable release target, regional theatrical date, countdown metadata and milestones.
 */

export const CONFIG = {
  // Official project metadata
  brand: {
    universe: 'MARVEL CINEMATIC UNIVERSE',
    franchise: 'AVENGERS',
    title: 'DOOMSDAY',
    fullName: 'AVENGERS: DOOMSDAY',
    subtitle: 'THE COUNTDOWN BEGINS.',
    destination: '15 CHAPTERS. ONE DESTINATION.',
    arrivedMessage: 'DOOMSDAY HAS ARRIVED.',
  },

  // Theatrical Release Configuration
  // Default Target: 18 December 2026, Asia/Kolkata boundary (00:00:00 local time)
  release: {
    displayDate: '18 DECEMBER 2026',
    year: 2026,
    month: 12, // 1-indexed (December)
    day: 18,
    time: '00:00:00',
    timezoneOffset: '+05:30', // Asia/Kolkata default
    // ISO 8601 target timestamp with precise timezone offset:
    targetIsoString: '2026-12-18T00:00:00+05:30',

    // Human-readable release info
    theatricalNote: 'In Theatres Worldwide',
    studio: 'Marvel Studios',
  },

  // LocalStorage keys
  storageKeys: {
    watchlistProgress: 'doomsday_countdown_watchlist_v1',
    ambientMode: 'doomsday_ambient_mode_v1',
  },

  // Countdown Milestones
  milestones: [
    { thresholdDays: 0, message: 'DOOMSDAY HAS ARRIVED.' },
    { thresholdDays: 1, message: 'TOMORROW CHANGES EVERYTHING.' },
    { thresholdDays: 7, message: 'THE FINAL WEEK.' },
    { thresholdDays: 30, message: 'ONE MONTH REMAINS.' },
    { thresholdDays: 50, message: 'THE WORLD IS GETTING CLOSER.' },
    { thresholdDays: 100, message: 'THE FINAL COUNTDOWN BEGINS.' },
  ],
};

/**
 * Calculates current relevant milestone message based on remaining days.
 * Strictly adheres to milestone thresholds and never displays an inconsistent badge.
 * (e.g. "ONE MONTH REMAINS" is only displayed when 30 days remain, never when < 30 days).
 */
export function getCountdownMilestone(days, isArrived) {
  if (isArrived || days <= 0) {
    return 'DOOMSDAY HAS ARRIVED.';
  }
  if (days === 1) {
    return 'TOMORROW CHANGES EVERYTHING.';
  }
  if (days <= 7 && days > 1) {
    return 'THE FINAL WEEK.';
  }
  if (days === 30) {
    return 'ONE MONTH REMAINS.';
  }
  if (days > 30 && days <= 50) {
    return 'THE WORLD IS GETTING CLOSER.';
  }
  if (days > 50 && days <= 100) {
    return 'THE FINAL COUNTDOWN BEGINS.';
  }
  return null;
}
