/**
 * Isolated In-Game BGM Engine for HULK SMASH MAYHEM & MCU ULTIMATE QUIZ.
 * Strictly separate from website avengersBgm (which automatically pauses whenever a game opens)
 * so ONLY active game music & SFX are audible inside games.
 */

import { useState, useEffect } from 'react';

const GAME_BGM_ENABLED_KEY = 'doomsday_game_bgm_enabled_v1';

const GAME_TRACKS = {
  hulk: {
    src: '/sounds/avengers-bgm.wav',
    volume: 0.36,
  },
  quiz: {
    src: '/sounds/user-bgm.mp3',
    fallbackSrc: '/sounds/user-bgm-alt.mp3',
    volume: 0.22,
  },
};

class GameBgmEngine {
  constructor() {
    this.htmlAudio = null;
    this.activeGame = null;
    this.activeSrc = null;
    this.enabled = this._loadEnabled();
    this.isPlaying = false;
    this.fadeInterval = null;
    this.subscribers = new Set();
    this._gestureHandler = null;
  }

  _loadEnabled() {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    try {
      const saved = window.localStorage.getItem(GAME_BGM_ENABLED_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  }

  _persist(val) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(GAME_BGM_ENABLED_KEY, String(val));
    } catch { }
  }

  _notify() {
    const snap = this.getSnapshot();
    this.subscribers.forEach((cb) => {
      try { cb(snap); } catch { }
    });
  }

  getSnapshot() {
    return {
      enabled: this.enabled,
      isPlaying: this.isPlaying,
      activeGame: this.activeGame,
    };
  }

  subscribe(cb) {
    this.subscribers.add(cb);
    cb(this.getSnapshot());
    return () => this.subscribers.delete(cb);
  }

  _clearGestureFallback() {
    if (typeof window === 'undefined' || !this._gestureHandler) return;
    window.removeEventListener('pointerdown', this._gestureHandler);
    window.removeEventListener('keydown', this._gestureHandler);
    this._gestureHandler = null;
  }

  _attachGestureFallback() {
    if (typeof window === 'undefined' || this._gestureHandler) return;
    this._gestureHandler = () => {
      if (this.activeGame && this.enabled && !this.isPlaying) {
        this._beginPlay();
      }
      if (this.isPlaying || !this.activeGame) {
        this._clearGestureFallback();
      }
    };
    window.addEventListener('pointerdown', this._gestureHandler, { passive: true });
    window.addEventListener('keydown', this._gestureHandler, { passive: true });
  }

  _fadeTo(target, durationMs = 300, onDone = null) {
    clearInterval(this.fadeInterval);
    if (!this.htmlAudio) {
      if (onDone) onDone();
      return;
    }
    const startVol = this.htmlAudio.volume;
    const steps = Math.max(1, Math.round(durationMs / 25));
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
    }, 25);
  }

  async _beginPlay() {
    if (!this.activeGame || !this.enabled || typeof window === 'undefined' || typeof Audio === 'undefined') {
      return false;
    }
    const cfg = GAME_TRACKS[this.activeGame] || GAME_TRACKS.hulk;
    try {
      if (!this.htmlAudio || this.activeSrc !== cfg.src) {
        if (this.htmlAudio) {
          try { this.htmlAudio.pause(); } catch { }
        }
        const el = new Audio(cfg.src);
        el.loop = true;
        el.preload = 'auto';
        el.volume = 0.01;
        if (cfg.fallbackSrc) {
          el.addEventListener('error', () => {
            if (el.dataset.fbUsed === '1') return;
            el.dataset.fbUsed = '1';
            el.src = cfg.fallbackSrc;
            if (this.activeGame && this.enabled) {
              el.play().catch(() => { });
            }
          });
        }
        this.htmlAudio = el;
        this.activeSrc = cfg.src;
      }
      await this.htmlAudio.play();
      this.isPlaying = true;
      this._clearGestureFallback();
      this._fadeTo(cfg.volume, 380);
      this._notify();
      return true;
    } catch {
      this._attachGestureFallback();
      return false;
    }
  }

  start(mode = 'hulk') {
    this.activeGame = GAME_TRACKS[mode] ? mode : 'hulk';
    if (this.enabled) {
      this._beginPlay();
    } else {
      this._notify();
    }
  }

  stop() {
    clearInterval(this.fadeInterval);
    this._clearGestureFallback();
    this.activeGame = null;
    this.isPlaying = false;
    if (this.htmlAudio) {
      const el = this.htmlAudio;
      this._fadeTo(0, 160, () => {
        try {
          el.pause();
          el.currentTime = 0;
        } catch { }
      });
    }
    this._notify();
  }

  toggle() {
    this.enabled = !this.enabled;
    this._persist(this.enabled);
    if (this.enabled && this.activeGame) {
      this._beginPlay();
    } else {
      clearInterval(this.fadeInterval);
      this.isPlaying = false;
      if (this.htmlAudio) {
        const el = this.htmlAudio;
        this._fadeTo(0, 160, () => {
          try { el.pause(); } catch { }
        });
      }
      this._notify();
    }
    return this.enabled;
  }
}

export const gameBgm = new GameBgmEngine();

export function useGameBgm() {
  const [snap, setSnap] = useState(() => gameBgm.getSnapshot());
  useEffect(() => gameBgm.subscribe(setSnap), []);
  return {
    ...snap,
    start: (mode) => gameBgm.start(mode),
    stop: () => gameBgm.stop(),
    toggle: () => gameBgm.toggle(),
  };
}
