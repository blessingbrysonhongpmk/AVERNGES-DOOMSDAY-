/**
 * Isolated Studio Web Audio Synthesizer for MCU ULTIMATE QUIZ.
 * Generates bespoke sci-fi tones for UI ticks, correct/incorrect verification,
 * progression transitions, Infinity Stone milestone unlocks, and holographic HUD beeps.
 * Does NOT interact with Countdown clockAudio or HulkSmash hulkAudio.
 */

import { useState, useEffect } from 'react';

const QUIZ_AUDIO_KEY = 'mcu_ultimate_quiz_audio_v1';

const STONE_FREQ_PROFILES = {
  space: [523.25, 659.25, 783.99, 1046.5],
  mind: [587.33, 739.99, 880.0, 1174.66],
  reality: [440.0, 554.37, 659.25, 880.0],
  power: [392.0, 493.88, 587.33, 783.99],
  time: [659.25, 783.99, 987.77, 1318.51],
  soul: [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98],
};

class McuQuizAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = this._loadEnabled();
    this.subscribers = new Set();
  }

  _loadEnabled() {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    try {
      const saved = window.localStorage.getItem(QUIZ_AUDIO_KEY);
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  }

  _persist(val) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(QUIZ_AUDIO_KEY, String(val));
    } catch { }
  }

  subscribe(cb) {
    this.subscribers.add(cb);
    cb(this.enabled);
    return () => this.subscribers.delete(cb);
  }

  _notify() {
    this.subscribers.forEach((cb) => {
      try { cb(this.enabled); } catch { }
    });
  }

  _ensureCtx() {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        this.ctx = new Ctx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => { });
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    this._persist(this.enabled);
    this._notify();
    if (this.enabled) {
      this._ensureCtx();
      this.tick();
    }
    return this.enabled;
  }

  _tone(freq, startOffset, duration, type = 'sine', peakGain = 0.14, endFreq = null) {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    try {
      const t = ctx.currentTime + startOffset;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      if (endFreq) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
      }
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(peakGain, t + 0.014);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + duration + 0.02);
    } catch { }
  }

  tick() {
    this._tone(1180, 0, 0.045, 'triangle', 0.08, 740);
  }

  next() {
    this._tone(420, 0, 0.09, 'sine', 0.09, 840);
    this._tone(840, 0.045, 0.08, 'triangle', 0.07, 1080);
  }

  correct() {
    this._tone(523.25, 0, 0.14, 'triangle', 0.14);
    this._tone(659.25, 0.07, 0.16, 'triangle', 0.14);
    this._tone(783.99, 0.14, 0.24, 'sine', 0.15);
  }

  correctStreak(streak = 1) {
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 987.77, 1046.5, 1174.66];
    const root = scale[Math.min(Math.max(0, streak - 1), scale.length - 1)];
    this._tone(root, 0, 0.12, 'triangle', 0.14);
    this._tone(root * 1.25, 0.06, 0.16, 'triangle', 0.14);
    this._tone(root * 1.5, 0.12, 0.25, 'sine', 0.16);
    if (streak >= 5) {
      // Extra octave sparkle on 5x+ super combo
      this._tone(root * 2, 0.18, 0.28, 'sine', 0.1);
    }
  }

  thanosSnap() {
    this._tone(1650, 0, 0.035, 'square', 0.12, 420);
    this._tone(340, 0.03, 0.28, 'sawtooth', 0.09, 95);
    this._tone(740, 0.06, 0.18, 'triangle', 0.08, 490);
  }

  timeRewind() {
    this._tone(987.77, 0, 0.09, 'sine', 0.1);
    this._tone(783.99, 0.07, 0.09, 'sine', 0.1);
    this._tone(659.25, 0.14, 0.1, 'triangle', 0.11);
    this._tone(1318.51, 0.22, 0.24, 'sine', 0.13);
  }

  shieldBlock() {
    this._tone(680, 0, 0.08, 'triangle', 0.14, 1020);
    this._tone(1020, 0.05, 0.22, 'sine', 0.12);
  }

  speedBonus() {
    this._tone(1174.66, 0, 0.06, 'sine', 0.08);
    this._tone(1567.98, 0.06, 0.11, 'sine', 0.09);
  }

  incorrect() {
    this._tone(210, 0, 0.18, 'sawtooth', 0.09, 130);
    this._tone(165, 0.1, 0.22, 'triangle', 0.11, 110);
  }

  stoneUnlock(stoneId = 'space') {
    const notes = STONE_FREQ_PROFILES[stoneId] || STONE_FREQ_PROFILES.space;
    notes.forEach((f, idx) => {
      this._tone(f, idx * 0.09, 0.42, 'sine', 0.16);
      this._tone(f * 1.5, idx * 0.09 + 0.02, 0.28, 'triangle', 0.06);
    });
    if (stoneId === 'soul') {
      // Deep Infinity Gauntlet sub-bass chord resolution
      this._tone(130.81, 0.18, 0.85, 'triangle', 0.18, 65.41);
    }
  }

  holoComm() {
    this._tone(920, 0, 0.06, 'sine', 0.09);
    this._tone(1280, 0.07, 0.08, 'sine', 0.09);
    this._tone(1620, 0.15, 0.12, 'triangle', 0.07);
  }
}

export const quizAudio = new McuQuizAudioEngine();

export function useQuizAudio() {
  const [enabled, setEnabled] = useState(() => quizAudio.enabled);

  useEffect(() => {
    return quizAudio.subscribe(setEnabled);
  }, []);

  return {
    enabled,
    toggle: () => quizAudio.toggle(),
    tick: () => quizAudio.tick(),
    next: () => quizAudio.next(),
    correct: () => quizAudio.correct(),
    correctStreak: (streak) => quizAudio.correctStreak(streak),
    thanosSnap: () => quizAudio.thanosSnap(),
    timeRewind: () => quizAudio.timeRewind(),
    shieldBlock: () => quizAudio.shieldBlock(),
    speedBonus: () => quizAudio.speedBonus(),
    incorrect: () => quizAudio.incorrect(),
    stoneUnlock: (stoneId) => quizAudio.stoneUnlock(stoneId),
    holoComm: () => quizAudio.holoComm(),
  };
}
