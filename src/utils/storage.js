/**
 * DOOMSDAY — Storage Utility
 * Safe, robust LocalStorage manager for Watchlist progress & Ambient Mode.
 * Handles missing data, invalid or corrupted JSON gracefully.
 */

import { CONFIG } from '../data/config.js';

const WATCHLIST_STORAGE_KEY = CONFIG.storageKeys.watchlistProgress;
const AMBIENT_STORAGE_KEY = CONFIG.storageKeys.ambientMode;

export function loadWatchlistProgress() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!raw) return {};
    
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      console.warn('[Doomsday Storage] Invalid saved format, resetting to empty state.');
      return {};
    }

    return parsed;
  } catch (err) {
    console.error('[Doomsday Storage] Failed to load progress from localStorage:', err);
    return {};
  }
}

export function saveWatchlistProgress(data) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    if (typeof data !== 'object' || data === null) {
      console.warn('[Doomsday Storage] Attempted to save non-object data.');
      return false;
    }
    window.localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (err) {
    console.error('[Doomsday Storage] Failed to persist progress to localStorage:', err);
    return false;
  }
}

export function clearWatchlistProgress() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    window.localStorage.removeItem(WATCHLIST_STORAGE_KEY);
    return true;
  } catch (err) {
    console.error('[Doomsday Storage] Failed to clear progress from localStorage:', err);
    return false;
  }
}

/* ── Ambient Mode Persistence ── */
export function loadAmbientMode() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'normal';
  }

  try {
    const saved = window.localStorage.getItem(AMBIENT_STORAGE_KEY);
    return saved === 'cinematic' ? 'cinematic' : 'normal';
  } catch {
    return 'normal';
  }
}

export function saveAmbientMode(mode) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const val = mode === 'cinematic' ? 'cinematic' : 'normal';
    window.localStorage.setItem(AMBIENT_STORAGE_KEY, val);
    return true;
  } catch {
    return false;
  }
}
