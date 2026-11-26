/**
 * DOOMSDAY — Authentic Live Clock Audio Engine
 * High-definition Web Audio API physical mechanical clock & countdown timer synthesizer.
 * Pre-computes sample-accurate escapement impact transients, double-pallet latch clicks,
 * multi-modal chamber resonances, and sub-cabinet weight punch routed through a studio
 * dynamics compressor for crisp, powerful TICK/TOCK authority with zero external files.
 */

import { useState, useEffect, useCallback } from 'react';

const SOUND_STORAGE_KEY = 'doomsday_clock_sound_v1';

/**
 * Synthesizes an authentic 95ms mechanical clockwork impulse ("TICK" or "TOCK")
 * combining:
 * 1) Bandpass-filtered escapement tooth strike transient (sharp metallic click)
 * 2) Delayed 12ms secondary pallet release micro-click (real watch/clock mechanics)
 * 3) Damped physical steel gear + resonant clock cabinet modes
 * 4) Sweeping low-mid / sub timer punch for weighty cinematic countdown power
 * 5) Soft analog waveshaping + peak normalization (zero clipping, zero DC offset)
 */
function buildMechanicalBuffer(ctx, isTick) {
  const sampleRate = ctx.sampleRate || 48000;
  const duration = 0.095;
  const length = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);

  let seed = isTick ? 0x13579bdf : 0x2468ace1;
  const nextRand = () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1;
  };

  let phaseA = 0;
  let phaseB = 0;
  let phaseSub = 0;
  let svfLow1 = 0;
  let svfBand1 = 0;
  let svfLow2 = 0;
  let svfBand2 = 0;

  const fc1 = isTick ? 4300 : 2950;
  const f1 = 2 * Math.sin((Math.PI * Math.min(fc1, sampleRate * 0.4)) / sampleRate);
  const fc2 = isTick ? 5400 : 3850;
  const f2 = 2 * Math.sin((Math.PI * Math.min(fc2, sampleRate * 0.4)) / sampleRate);
  const latchOffset = isTick ? 0.0115 : 0.013;

  let peak = 0;

  for (let i = 0; i < length; i++) {
    const t = i / sampleRate;
    const attack = Math.min(1, t / 0.00035);
    const tailFade = t > 0.078 ? Math.max(0, 1 - (t - 0.078) / (duration - 0.078)) : 1;

    // Seeded noise routed through two tuned bandpass SVFs for crisp metallic escapement impact
    const w = nextRand();
    svfLow1 += f1 * svfBand1;
    svfBand1 += f1 * (w - svfLow1 - 0.48 * svfBand1);

    svfLow2 += f2 * svfBand2;
    svfBand2 += f2 * (w - svfLow2 - 0.35 * svfBand2);

    const clickEnv = Math.exp(-t / 0.0021);
    const latchT = t - latchOffset;
    const latchEnv = latchT >= 0 ? Math.min(1, latchT / 0.00025) * Math.exp(-latchT / 0.0017) : 0;

    // Instantaneous phase integration for clickless downward percussive pitch envelopes
    const fA = (isTick ? 1680 : 1220) + (isTick ? 720 : 520) * Math.exp(-t / 0.0028);
    const fB = (isTick ? 610 : 430) + (isTick ? 280 : 210) * Math.exp(-t / 0.0045);
    const fSub = (isTick ? 66 : 52) + (isTick ? 190 : 155) * Math.exp(-t / 0.0065);

    phaseA += (2 * Math.PI * fA) / sampleRate;
    phaseB += (2 * Math.PI * fB) / sampleRate;
    phaseSub += (2 * Math.PI * fSub) / sampleRate;

    const modeA = Math.sin(phaseA) * Math.exp(-t / 0.0044) * (isTick ? 0.55 : 0.50);
    const modeB = Math.sin(phaseB) * Math.exp(-t / (isTick ? 0.0095 : 0.0115)) * (isTick ? 0.62 : 0.68);
    const modeSub = Math.sin(phaseSub) * Math.exp(-t / (isTick ? 0.014 : 0.017)) * (isTick ? 0.68 : 0.78);

    const escapementClick = svfBand1 * clickEnv * (isTick ? 1.05 : 0.92);
    const palletLatch = svfBand2 * latchEnv * (isTick ? 0.36 : 0.32);

    const raw = (escapementClick + palletLatch + modeA + modeB + modeSub) * attack * tailFade;
    const shaped = Math.tanh(raw * 1.55);
    data[i] = shaped;

    const abs = Math.abs(shaped);
    if (abs > peak) peak = abs;
  }

  if (peak > 0.001) {
    const norm = 0.90 / peak;
    for (let i = 0; i < length; i++) {
      data[i] *= norm;
    }
  }

  return buffer;
}

class ClockAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.tickBuffer = null;
    this.tockBuffer = null;
    this.enabled = this.getInitialState();
    this.pausedForGame = false;
    this.hasUserInteracted = false;
    this._lastTickAt = 0;
    this.subscribers = new Set();
    this.setupUserInteractionListener();
  }

  getInitialState() {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    try {
      const saved = window.localStorage.getItem(SOUND_STORAGE_KEY);
      if (saved === null) return true;
      return saved === 'true';
    } catch {
      return true;
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
      } catch { }
    });
  }

  setupUserInteractionListener() {
    if (typeof window === 'undefined') return;

    const unlock = () => {
      this.hasUserInteracted = true;
      if (this.enabled && !this.pausedForGame) {
        const ctx = this.init();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().catch(() => { });
        }
      } else if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => { });
      }
      if (this.ctx && this.ctx.state === 'running') {
        window.removeEventListener('pointerdown', unlock, { capture: true });
        window.removeEventListener('click', unlock, { capture: true });
        window.removeEventListener('keydown', unlock, { capture: true });
        window.removeEventListener('touchstart', unlock, { capture: true });
      }
    };

    window.addEventListener('pointerdown', unlock, { capture: true, passive: true });
    window.addEventListener('click', unlock, { capture: true, passive: true });
    window.addEventListener('keydown', unlock, { capture: true, passive: true });
    window.addEventListener('touchstart', unlock, { capture: true, passive: true });
  }

  _ensureAudioGraph(ctx) {
    if (!ctx) return;
    if (!this.compressor || !this.masterGain) {
      try {
        const comp = ctx.createDynamicsCompressor();
        comp.threshold.setValueAtTime(-14, ctx.currentTime);
        comp.knee.setValueAtTime(10, ctx.currentTime);
        comp.ratio.setValueAtTime(3.5, ctx.currentTime);
        comp.attack.setValueAtTime(0.001, ctx.currentTime);
        comp.release.setValueAtTime(0.055, ctx.currentTime);

        const master = ctx.createGain();
        master.gain.setValueAtTime(0.92, ctx.currentTime);

        master.connect(comp);
        comp.connect(ctx.destination);

        this.compressor = comp;
        this.masterGain = master;
      } catch {
        this.compressor = null;
        this.masterGain = null;
      }
    }
    if (!this.tickBuffer || !this.tockBuffer) {
      try {
        this.tickBuffer = buildMechanicalBuffer(ctx, true);
        this.tockBuffer = buildMechanicalBuffer(ctx, false);
      } catch {
        this.tickBuffer = null;
        this.tockBuffer = null;
      }
    }
  }

  init() {
    if (this.ctx) {
      this._ensureAudioGraph(this.ctx);
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => { });
      }
      return this.ctx;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this._ensureAudioGraph(this.ctx);
      return this.ctx;
    } catch {
      return null;
    }
  }

  _playBuffer(isEven, gainAmount) {
    const ctx = this.ctx;
    const buffer = isEven ? this.tickBuffer : this.tockBuffer;
    if (!ctx || !buffer || ctx.state !== 'running') return;

    try {
      const now = ctx.currentTime;
      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const shotGain = ctx.createGain();
      shotGain.gain.setValueAtTime(gainAmount, now);

      src.connect(shotGain);
      shotGain.connect(this.masterGain || ctx.destination);

      src.onended = () => {
        try {
          src.disconnect();
          shotGain.disconnect();
        } catch { }
      };

      src.start(now);
    } catch {
      // Failsafe
    }
  }

  /**
   * Play an authentic, powerful mechanical clock beat ("TICK" on even seconds, "TOCK" on odd).
   * Silenced automatically while any game modal overlay is active.
   */
  tick(second = 0, options = {}) {
    if (!this.enabled || this.pausedForGame) return;

    const nowMs = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (nowMs - this._lastTickAt < 50) return;

    const ctx = this.init();
    if (!ctx) return;

    const isEven = Math.abs(Math.floor(second)) % 2 === 0;
    const gainAmount = options?.isCountdown ? 0.86 : 0.48;

    if (ctx.state === 'running') {
      this._lastTickAt = nowMs;
      this._playBuffer(isEven, gainAmount);
    } else if (ctx.state === 'suspended' && this.hasUserInteracted) {
      ctx.resume().then(() => {
        if (!this.enabled || this.pausedForGame || ctx.state !== 'running') return;
        const t = typeof performance !== 'undefined' ? performance.now() : Date.now();
        if (t - this._lastTickAt < 50) return;
        this._lastTickAt = t;
        this._playBuffer(isEven, gainAmount);
      }).catch(() => { });
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    this.persistState(this.enabled);
    this.notifySubscribers();

    if (this.enabled) {
      this.hasUserInteracted = true;
      this._lastTickAt = 0;
      const ctx = this.init();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          if (this.enabled && !this.pausedForGame) {
            this.tick(new Date().getSeconds(), { isCountdown: true });
          }
        }).catch(() => { });
      } else {
        this.tick(new Date().getSeconds(), { isCountdown: true });
      }
    }

    return this.enabled;
  }

  enable() {
    if (!this.enabled) this.toggle();
  }

  disable() {
    if (this.enabled) this.toggle();
  }

  setPausedForGame(paused) {
    this.pausedForGame = !!paused;
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

  const toggle = useCallback(() => clockAudio.toggle(), []);
  const tick = useCallback((second, options) => clockAudio.tick(second, options), []);
  const setPausedForGame = useCallback((paused) => clockAudio.setPausedForGame(paused), []);

  return {
    enabled,
    toggle,
    tick,
    setPausedForGame,
  };
}

export const audioEngine = clockAudio;
