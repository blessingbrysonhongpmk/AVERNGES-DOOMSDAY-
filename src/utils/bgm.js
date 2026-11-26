/**
 * AVENGERS: DOOMSDAY — Seamless Background Score Engine
 * Defaults to the newly installed alternative score (/sounds/user-bgm-alt.mp3),
 * with seamless track switching to Theme I (/sounds/user-bgm.mp3), built-in
 * Orchestral Score (/sounds/avengers-bgm.wav), or persistent IndexedDB custom uploads.
 */

import { useState, useEffect } from 'react';

const BGM_ENABLED_KEY = 'doomsday_avengers_bgm_v1';
const BGM_TRACK_KEY = 'doomsday_avengers_bgm_track_v1';
const BGM_VOLUME_KEY = 'doomsday_avengers_bgm_vol_v1';
const BGM_DB_NAME = 'doomsday_custom_bgm_v1';
const BGM_STORE_NAME = 'customBgm';

export const BGM_TRACKS = {
  primary: {
    id: 'primary',
    label: 'Alt Theme',
    shortTag: 'ALT',
    path: '/sounds/user-bgm-alt.mp3',
  },
  classic: {
    id: 'classic',
    label: 'Theme I',
    shortTag: 'I',
    path: '/sounds/user-bgm.mp3',
  },
  orchestral: {
    id: 'orchestral',
    label: 'Orchestra',
    shortTag: 'ORCH',
    path: '/sounds/avengers-bgm.wav',
  },
};

export const BGM_DEFAULT_PATH = BGM_TRACKS.primary.path;

function openBgmDB() {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    try {
      const req = indexedDB.open(BGM_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(BGM_STORE_NAME)) {
          db.createObjectStore(BGM_STORE_NAME, { keyPath: 'key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

class AvengersBgmEngine {
  constructor() {
    this.htmlAudio = null;
    this.activeUrl = null;
    this.customBlobUrl = null;
    this.rawArrayBuffer = null;
    this.fadeInterval = null;
    this.enabled = this._loadInitialEnabled();
    this.trackMode = this._loadInitialTrackMode();
    this.isPlaying = false;
    this.isDucked = false;
    this.pausedForGame = false;
    this.baseVolume = this._loadInitialVolume();
    this.customBgmName = null;
    this.customChecked = false;
    this.subscribers = new Set();
    this._setupUnlockListeners();
  }

  _loadInitialEnabled() {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    try {
      const saved = window.localStorage.getItem(BGM_ENABLED_KEY);
      if (saved === null) return true;
      return saved === 'true';
    } catch {
      return true;
    }
  }

  _loadInitialTrackMode() {
    if (typeof window === 'undefined' || !window.localStorage) return 'primary';
    try {
      const saved = window.localStorage.getItem(BGM_TRACK_KEY);
      return saved && BGM_TRACKS[saved] ? saved : 'primary';
    } catch {
      return 'primary';
    }
  }

  _loadInitialVolume() {
    if (typeof window === 'undefined' || !window.localStorage) return 0.46;
    try {
      const saved = parseFloat(window.localStorage.getItem(BGM_VOLUME_KEY));
      if (!Number.isNaN(saved) && saved >= 0.05 && saved <= 1) return saved;
      return 0.46;
    } catch {
      return 0.46;
    }
  }

  _persistEnabled(val) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(BGM_ENABLED_KEY, String(val));
    } catch { }
  }

  _persistTrackMode(val) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(BGM_TRACK_KEY, val);
    } catch { }
  }

  _persistVolume(val) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(BGM_VOLUME_KEY, String(val));
    } catch { }
  }

  _notify() {
    const snap = this.getSnapshot();
    this.subscribers.forEach((cb) => {
      try {
        cb(snap);
      } catch { }
    });
  }

  getSnapshot() {
    return {
      enabled: this.enabled,
      trackMode: this.trackMode,
      isPlaying: this.isPlaying,
      isDucked: this.isDucked,
      volume: this.baseVolume,
      customBgmName: this.customBgmName,
    };
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    callback(this.getSnapshot());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  _setupUnlockListeners() {
    if (typeof window === 'undefined') return;

    const handleFirstGesture = () => {
      if (this.enabled && !this.pausedForGame && !this.isPlaying) {
        this.start();
      }
      if (this.isPlaying) {
        window.removeEventListener('pointerdown', handleFirstGesture);
        window.removeEventListener('keydown', handleFirstGesture);
        window.removeEventListener('click', handleFirstGesture);
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { passive: true });
    window.addEventListener('keydown', handleFirstGesture, { passive: true });
    window.addEventListener('click', handleFirstGesture, { passive: true });
  }

  _targetGain() {
    if (!this.enabled) return 0.0;
    return this.isDucked ? Math.min(0.18, this.baseVolume * 0.36) : this.baseVolume;
  }

  _fadeTo(target, durationMs = 500, onDone = null) {
    clearInterval(this.fadeInterval);
    if (!this.htmlAudio) {
      if (onDone) onDone();
      return;
    }
    const startVol = this.htmlAudio.volume;
    const steps = Math.max(1, Math.round(durationMs / 30));
    let step = 0;

    this.fadeInterval = setInterval(() => {
      step += 1;
      const ratio = Math.min(1, step / steps);
      const next = startVol + (target - startVol) * ratio;
      if (this.htmlAudio) {
        this.htmlAudio.volume = Math.min(1, Math.max(0, next));
      }
      if (step >= steps) {
        clearInterval(this.fadeInterval);
        if (onDone) onDone();
      }
    }, 30);
  }

  async _loadCustomIfAny() {
    if (this.customChecked) return;
    this.customChecked = true;
    const db = await openBgmDB();
    if (!db) return;
    try {
      const record = await new Promise((resolve) => {
        const tx = db.transaction(BGM_STORE_NAME, 'readonly');
        const store = tx.objectStore(BGM_STORE_NAME);
        const req = store.get('primary_bgm');
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      });
      if (record?.data) {
        this.rawArrayBuffer = record.data;
        this.customBgmName = record.fileName || 'Custom Track';
        this._notify();
      }
    } catch { }
  }

  _resolveSourceUrl() {
    if (this.customBgmName && this.rawArrayBuffer) {
      if (!this.customBlobUrl) {
        this.customBlobUrl = URL.createObjectURL(new Blob([this.rawArrayBuffer]));
      }
      return this.customBlobUrl;
    }
    return BGM_TRACKS[this.trackMode]?.path || BGM_DEFAULT_PATH;
  }

  async start() {
    if (!this.enabled || this.pausedForGame || typeof window === 'undefined' || typeof Audio === 'undefined') return false;

    await this._loadCustomIfAny();
    if (!this.enabled || this.pausedForGame) return false;

    const srcUrl = this._resolveSourceUrl();
    try {
      if (!this.htmlAudio || this.activeUrl !== srcUrl) {
        if (this.htmlAudio) {
          try { this.htmlAudio.pause(); } catch { }
        }
        const el = new Audio(srcUrl);
        el.loop = true;
        el.preload = 'auto';
        el.volume = 0.01;
        // Fallback cleanly to built-in orchestral loop if primary audio file is unavailable
        el.addEventListener('error', () => {
          if (srcUrl !== BGM_TRACKS.orchestral.path && !this.customBgmName) {
            this.trackMode = 'orchestral';
            this.activeUrl = BGM_TRACKS.orchestral.path;
            el.src = BGM_TRACKS.orchestral.path;
            if (this.enabled) el.play().catch(() => { });
          }
        });
        this.htmlAudio = el;
        this.activeUrl = srcUrl;
      }

      await this.htmlAudio.play();
      this.isPlaying = true;
      this._fadeTo(this._targetGain(), 550);
      this._notify();
      return true;
    } catch {
      return false;
    }
  }

  stop() {
    clearInterval(this.fadeInterval);
    this.isPlaying = false;
    this._fadeTo(0.0, 260, () => {
      if (this.htmlAudio && !this.enabled) {
        try {
          this.htmlAudio.pause();
        } catch { }
      }
    });
    this._notify();
  }

  toggle() {
    this.enabled = !this.enabled;
    this._persistEnabled(this.enabled);
    if (this.enabled) {
      this._notify();
      this.start();
    } else {
      this.stop();
    }
    return this.enabled;
  }

  setEnabled(val) {
    if (this.enabled === !!val) return;
    this.toggle();
  }

  setVolume(vol) {
    const clamped = Math.min(1, Math.max(0.05, Number(vol) || 0.46));
    this.baseVolume = clamped;
    this._persistVolume(clamped);
    if (this.htmlAudio && this.enabled) {
      clearInterval(this.fadeInterval);
      this.htmlAudio.volume = this._targetGain();
    }
    this._notify();
  }

  setTrackMode(mode) {
    const valid = BGM_TRACKS[mode] ? mode : 'primary';
    if (this.trackMode === valid && !this.customBgmName) return;
    this.trackMode = valid;
    this._persistTrackMode(valid);
    if (this.customBgmName) {
      this.customBgmName = null;
      if (this.customBlobUrl) {
        try { URL.revokeObjectURL(this.customBlobUrl); } catch { }
        this.customBlobUrl = null;
      }
    }
    if (this.htmlAudio) {
      try { this.htmlAudio.pause(); } catch { }
      this.htmlAudio = null;
      this.activeUrl = null;
    }
    this.enabled = true;
    this._persistEnabled(true);
    this._notify();
    this.start();
  }

  setDucked(duck) {
    const next = !!duck;
    if (this.isDucked === next) return;
    this.isDucked = next;
    if (this.isPlaying && this.enabled && !this.pausedForGame) {
      this._fadeTo(this._targetGain(), 400);
    }
    this._notify();
  }

  setPausedForGame(paused) {
    const next = !!paused;
    if (this.pausedForGame === next) return;
    this.pausedForGame = next;
    if (next) {
      this.isPlaying = false;
      this._fadeTo(0, 160);
      setTimeout(() => {
        if (this.pausedForGame && this.htmlAudio && !this.htmlAudio.paused) {
          try {
            this.htmlAudio.pause();
          } catch {}
        }
      }, 170);
      this._notify();
    } else {
      this._notify();
      if (this.enabled) {
        this.start();
      }
    }
  }

  async importCustomBgm(file) {
    if (!file) return { ok: false, error: 'No file selected' };
    try {
      const arrBuf = await file.arrayBuffer();
      const db = await openBgmDB();
      if (db) {
        await new Promise((resolve) => {
          const tx = db.transaction(BGM_STORE_NAME, 'readwrite');
          const store = tx.objectStore(BGM_STORE_NAME);
          store.put({ key: 'primary_bgm', fileName: file.name, data: arrBuf });
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        });
      }
      if (this.customBlobUrl) {
        try { URL.revokeObjectURL(this.customBlobUrl); } catch { }
      }
      this.rawArrayBuffer = arrBuf;
      this.customBlobUrl = URL.createObjectURL(new Blob([arrBuf]));
      this.customBgmName = file.name;
      this.activeUrl = null;
      this.enabled = true;
      this._persistEnabled(true);
      await this.start();
      this._notify();
      return { ok: true, fileName: file.name };
    } catch {
      return { ok: false, error: 'Unsupported audio file' };
    }
  }

  async clearCustomBgm() {
    const db = await openBgmDB();
    if (db) {
      try {
        await new Promise((resolve) => {
          const tx = db.transaction(BGM_STORE_NAME, 'readwrite');
          tx.objectStore(BGM_STORE_NAME).delete('primary_bgm');
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        });
      } catch { }
    }
    if (this.customBlobUrl) {
      try { URL.revokeObjectURL(this.customBlobUrl); } catch { }
      this.customBlobUrl = null;
    }
    this.customBgmName = null;
    this.rawArrayBuffer = null;
    this.activeUrl = null;
    if (this.enabled) {
      await this.start();
    }
    this._notify();
  }
}

export const avengersBgm = new AvengersBgmEngine();

export function useAvengersBgm() {
  const [snap, setSnap] = useState(() => avengersBgm.getSnapshot());

  useEffect(() => {
    return avengersBgm.subscribe(setSnap);
  }, []);

  return {
    ...snap,
    toggle: () => avengersBgm.toggle(),
    setEnabled: (v) => avengersBgm.setEnabled(v),
    setTrackMode: (m) => avengersBgm.setTrackMode(m),
    setVolume: (v) => avengersBgm.setVolume(v),
    setDucked: (v) => avengersBgm.setDucked(v),
    setPausedForGame: (p) => avengersBgm.setPausedForGame(p),
    importCustomBgm: (f) => avengersBgm.importCustomBgm(f),
    clearCustomBgm: () => avengersBgm.clearCustomBgm(),
  };
}
