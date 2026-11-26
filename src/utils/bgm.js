/**
 * AVENGERS: DOOMSDAY — Seamless Orchestral Background Score Engine
 * Plays high-definition Stereo Orchestral Avengers-style BGM (/sounds/avengers-bgm.wav)
 * seamlessly in a sample-exact Web Audio loop with smooth volume ducking,
 * first-interaction browser unlock, and optional persistent custom MP3/WAV BGM override.
 */

import { useState, useEffect } from 'react';

const BGM_ENABLED_KEY = 'doomsday_avengers_bgm_v1';
const BGM_DB_NAME = 'doomsday_custom_bgm_v1';
const BGM_STORE_NAME = 'customBgm';
export const BGM_DEFAULT_PATH = '/sounds/avengers-bgm.wav';

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
    this.ctx = null;
    this.gainNode = null;
    this.source = null;
    this.buffer = null;
    this.rawArrayBuffer = null;
    this.htmlAudio = null;
    this.enabled = this._loadInitialEnabled();
    this.isPlaying = false;
    this.isDucked = false;
    this.baseVolume = 0.42;
    this.duckedVolume = 0.16;
    this.customBgmName = null;
    this.loadPromise = null;
    this.customChecked = false;
    this.subscribers = new Set();
    this._setupUnlockListeners();
  }

  _loadInitialEnabled() {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    try {
      const saved = window.localStorage.getItem(BGM_ENABLED_KEY);
      if (saved === null) return true; // Enabled by default
      return saved === 'true';
    } catch {
      return true;
    }
  }

  _persistEnabled(val) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(BGM_ENABLED_KEY, String(val));
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
      isPlaying: this.isPlaying,
      isDucked: this.isDucked,
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
      if (this.enabled && !this.isPlaying) {
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

  _ensureContext() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
          this.gainNode = this.ctx.createGain();
          this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
          this.gainNode.connect(this.ctx.destination);
        } catch {
          return null;
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { });
    }
    return this.ctx;
  }

  _targetGain() {
    if (!this.enabled) return 0.0001;
    return this.isDucked ? this.duckedVolume : this.baseVolume;
  }

  _fadeTo(target, seconds = 0.65) {
    if (this.gainNode && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(Math.max(0.0001, this.gainNode.gain.value), now);
        this.gainNode.gain.exponentialRampToValueAtTime(Math.max(0.0001, target), now + seconds);
      } catch { }
    }
    if (this.htmlAudio) {
      this.htmlAudio.volume = Math.min(1, Math.max(0, target));
    }
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
        this.customBgmName = record.fileName || 'Custom Avengers BGM';
        this.buffer = null;
        this._notify();
      }
    } catch { }
  }

  async _ensureBuffer() {
    await this._loadCustomIfAny();
    const ctx = this._ensureContext();
    if (this.buffer) return this.buffer;

    if (!this.rawArrayBuffer && typeof fetch !== 'undefined') {
      if (!this.loadPromise) {
        this.loadPromise = fetch(BGM_DEFAULT_PATH)
          .then((res) => (res.ok ? res.arrayBuffer() : null))
          .then((buf) => {
            if (buf) this.rawArrayBuffer = buf;
            return buf;
          })
          .catch(() => null);
      }
      await this.loadPromise;
    }

    if (this.rawArrayBuffer && ctx && typeof ctx.decodeAudioData === 'function') {
      try {
        this.buffer = await ctx.decodeAudioData(this.rawArrayBuffer.slice(0));
        return this.buffer;
      } catch { }
    }
    return null;
  }

  async start() {
    if (!this.enabled || typeof window === 'undefined') return false;
    const ctx = this._ensureContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch { }
    }

    const buffer = await this._ensureBuffer();
    if (!this.enabled) return false;

    if (buffer && ctx && ctx.state === 'running' && this.gainNode) {
      try {
        if (this.source) {
          this.source.stop();
          this.source.disconnect();
        }
      } catch { }
      try {
        if (this.htmlAudio) {
          this.htmlAudio.pause();
          this.htmlAudio = null;
        }
      } catch { }

      try {
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;
        src.connect(this.gainNode);
        this.gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        src.start(ctx.currentTime);
        this.source = src;
        this.isPlaying = true;
        this._fadeTo(this._targetGain(), 0.9);
        this._notify();
        return true;
      } catch { }
    }

    // Fallback HTMLAudioElement loop (supports default WAV & custom uploaded audio blobs)
    if (typeof Audio !== 'undefined') {
      try {
        let srcUrl = BGM_DEFAULT_PATH;
        if (this.customBgmName && this.rawArrayBuffer) {
          if (this.customBlobUrl) {
            try { URL.revokeObjectURL(this.customBlobUrl); } catch { }
          }
          this.customBlobUrl = URL.createObjectURL(new Blob([this.rawArrayBuffer]));
          srcUrl = this.customBlobUrl;
        }
        if (!this.htmlAudio || this.htmlAudio.src !== srcUrl) {
          if (this.htmlAudio) {
            try { this.htmlAudio.pause(); } catch { }
          }
          this.htmlAudio = new Audio(srcUrl);
          this.htmlAudio.loop = true;
        }
        this.htmlAudio.volume = this._targetGain();
        await this.htmlAudio.play();
        this.isPlaying = true;
        this._notify();
        return true;
      } catch { }
    }

    return false;
  }

  stop() {
    this._fadeTo(0.0001, 0.28);
    const oldSrc = this.source;
    this.source = null;
    this.isPlaying = false;
    if (oldSrc) {
      setTimeout(() => {
        try {
          oldSrc.stop();
          oldSrc.disconnect();
        } catch { }
      }, 300);
    }
    if (this.htmlAudio) {
      try {
        this.htmlAudio.pause();
      } catch { }
    }
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

  setDucked(duck) {
    const next = !!duck;
    if (this.isDucked === next) return;
    this.isDucked = next;
    if (this.isPlaying && this.enabled) {
      this._fadeTo(this._targetGain(), 0.45);
    }
    this._notify();
  }

  async importCustomBgm(file) {
    if (!file) return { ok: false, error: 'No file selected' };
    const ctx = this._ensureContext();
    try {
      const arrBuf = await file.arrayBuffer();
      let decoded = null;
      if (ctx && typeof ctx.decodeAudioData === 'function') {
        try {
          decoded = await ctx.decodeAudioData(arrBuf.slice(0));
        } catch {
          // Will fall back to HTMLAudioElement playback via Blob URL if browser container isn't WebAudio-decodable
        }
      }
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
      this.rawArrayBuffer = arrBuf;
      this.buffer = decoded;
      this.customBgmName = file.name;
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
    this.customBgmName = null;
    this.rawArrayBuffer = null;
    this.buffer = null;
    this.loadPromise = null;
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
    setDucked: (v) => avengersBgm.setDucked(v),
    importCustomBgm: (f) => avengersBgm.importCustomBgm(f),
    clearCustomBgm: () => avengersBgm.clearCustomBgm(),
  };
}
