/**
 * DOOMSDAY — Authentic Live Clock Audio Engine
 * High-definition Web Audio API mechanical clock tick synthesizer.
 * Generates an authentic mechanical escapement tick-tock with zero external MP3s,
 * zero latency, zero bandwidth overhead, and complete cross-browser support.
 * Sound is disabled by default per user specification.
 */

import { useState, useEffect } from 'react';

const SOUND_STORAGE_KEY = 'doomsday_clock_sound_v1';

class ClockAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = this.getInitialState();
    this.hasUserInteracted = false;
    this.subscribers = new Set();
    this.setupUserInteractionListener();
  }

  getInitialState() {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    try {
      const saved = window.localStorage.getItem(SOUND_STORAGE_KEY);
      // Disabled by default per performance & quality specification
      return saved === 'true';
    } catch {
      return false;
    }
  }

  persistState(val) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(SOUND_STORAGE_KEY, String(val));
    } catch {
      // Ignore storage errors
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach((cb) => {
      try {
        cb(this.enabled);
      } catch {}
    });
  }

  setupUserInteractionListener() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.hasUserInteracted = true;
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      return this.ctx;
    } catch (e) {
      return null;
    }
  }

  /**
   * Play an authentic mechanical clock tick synchronized with each countdown second.
   * Alternates pitch and timbre for realistic escapement "tick" (even) and "tock" (odd).
   */
  tick(second = 0) {
    if (!this.enabled) return;

    const ctx = this.init();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const isEven = Math.abs(Math.floor(second)) % 2 === 0;

    const primaryFreq = isEven ? 2400 : 1850;
    const bodyFreq = isEven ? 720 : 580;
    const duration = isEven ? 0.035 : 0.042;
    const masterGainVal = 0.2;

    try {
      const master = ctx.createGain();
      master.gain.setValueAtTime(masterGainVal, now);
      master.connect(ctx.destination);

      const oscHigh = ctx.createOscillator();
      const gainHigh = ctx.createGain();
      oscHigh.type = 'sine';
      oscHigh.frequency.setValueAtTime(primaryFreq, now);
      oscHigh.frequency.exponentialRampToValueAtTime(primaryFreq * 0.4, now + duration);

      gainHigh.gain.setValueAtTime(0.85, now);
      gainHigh.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      oscHigh.connect(gainHigh);
      gainHigh.connect(master);

      const oscBody = ctx.createOscillator();
      const gainBody = ctx.createGain();
      oscBody.type = 'triangle';
      oscBody.frequency.setValueAtTime(bodyFreq, now);
      oscBody.frequency.exponentialRampToValueAtTime(bodyFreq * 0.6, now + duration * 1.2);

      gainBody.gain.setValueAtTime(0.45, now);
      gainBody.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.2);

      oscBody.connect(gainBody);
      gainBody.connect(master);

      const oscThud = ctx.createOscillator();
      const gainThud = ctx.createGain();
      oscThud.type = 'sine';
      oscThud.frequency.setValueAtTime(140, now);
      oscThud.frequency.exponentialRampToValueAtTime(50, now + 0.02);

      gainThud.gain.setValueAtTime(0.3, now);
      gainThud.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      oscThud.connect(gainThud);
      gainThud.connect(master);

      oscHigh.start(now);
      oscBody.start(now);
      oscThud.start(now);

      oscHigh.stop(now + duration + 0.01);
      oscBody.stop(now + duration * 1.2 + 0.01);
      oscThud.stop(now + 0.03);

      setTimeout(() => {
        try {
          master.disconnect();
          gainHigh.disconnect();
          gainBody.disconnect();
          gainThud.disconnect();
        } catch {}
      }, 150);
    } catch (e) {
      // Failsafe
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    this.persistState(this.enabled);
    this.notifySubscribers();

    if (this.enabled) {
      const ctx = this.init();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      this.tick(0);
    }

    return this.enabled;
  }

  enable() {
    if (!this.enabled) this.toggle();
  }

  disable() {
    if (this.enabled) this.toggle();
  }

  isEnabled() {
    return this.enabled;
  }
}

export const clockAudio = new ClockAudioEngine();

export function useClockAudio() {
  const [enabled, setEnabled] = useState(() => clockAudio.isEnabled());

  useEffect(() => {
    return clockAudio.subscribe(setEnabled);
  }, []);

  return {
    enabled,
    toggle: () => clockAudio.toggle(),
    tick: (second) => clockAudio.tick(second),
  };
}

export const audioEngine = clockAudio;
