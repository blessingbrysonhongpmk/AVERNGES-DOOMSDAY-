/**
 * AVENGERS: DOOMSDAY — HULK & MARVEL CHARACTER AUDIO ENGINE
 * Preloads & decodes local imported WAV SFX assets from /sounds/*.wav into Web Audio API
 * AudioBuffers for zero-latency playback, with real-time Web Audio DSP synthesis fallback
 * and optional low-pitch Hulk English voice synthesis.
 */

export const SOUND_CATALOG = [
  {
    id: 'hulkRoar',
    label: 'Hulk Gamma Roar',
    character: 'The Incredible Hulk',
    path: '/sounds/hulk-roar.wav',
    category: 'HULK',
    accent: '#00FF88',
  },
  {
    id: 'hulkSmash',
    label: 'Seismic Ground Smash',
    character: 'The Incredible Hulk',
    path: '/sounds/hulk-smash.wav',
    category: 'HULK',
    accent: '#22C55E',
  },
  {
    id: 'hulkThunderclap',
    label: 'Worldbreaker Thunderclap',
    character: 'The Incredible Hulk',
    path: '/sounds/hulk-thunderclap.wav',
    category: 'HULK',
    accent: '#10B981',
  },
  {
    id: 'gammaCharge',
    label: 'Gamma Core Overdrive',
    character: 'Bruce Banner Lab',
    path: '/sounds/gamma-charge.wav',
    category: 'HULK',
    accent: '#00FF88',
  },
  {
    id: 'ironmanRepulsor',
    label: 'Mark LXXXV Repulsor',
    character: 'Iron Man',
    path: '/sounds/ironman-repulsor.wav',
    category: 'HERO',
    accent: '#F59E0B',
  },
  {
    id: 'thorThunder',
    label: 'Stormbreaker Thunder',
    character: 'Thor Odinson',
    path: '/sounds/thor-thunder.wav',
    category: 'HERO',
    accent: '#38BDF8',
  },
  {
    id: 'capShield',
    label: 'Vibranium Shield Clang',
    character: 'Captain America',
    path: '/sounds/cap-shield.wav',
    category: 'HERO',
    accent: '#60A5FA',
  },
  {
    id: 'spideyThwip',
    label: 'Web-Shooter Thwip',
    character: 'Spider-Man',
    path: '/sounds/spidey-thwip.wav',
    category: 'HERO',
    accent: '#EF4444',
  },
  {
    id: 'strangeMystic',
    label: 'Sling-Ring Portal Chime',
    character: 'Doctor Strange',
    path: '/sounds/strange-mystic.wav',
    category: 'HERO',
    accent: '#A855F7',
  },
  {
    id: 'doomLatveria',
    label: 'Latverian Armor Strike',
    character: 'Doctor Doom / Threats',
    path: '/sounds/doom-latveria.wav',
    category: 'THREAT',
    accent: '#10B981',
  },
];

const SOUND_BY_ID = Object.fromEntries(SOUND_CATALOG.map((s) => [s.id, s]));

class HulkAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.voiceEnabled = false;
    this.buffers = new Map();
    this.rawBuffers = new Map();
    this.preloadPromise = null;
    this.lastVoiceAt = 0;
  }

  /**
   * Initializes or resumes the shared Web Audio API AudioContext safely.
   */
  init() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        try {
          this.ctx = new AudioContext();
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

  /**
   * Preloads all imported WAV files from SOUND_CATALOG and decodes them into AudioBuffers.
   * Safe to call multiple times; caches in-flight promise.
   */
  async preloadAll(onProgress) {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') {
      return { loaded: 0, total: SOUND_CATALOG.length };
    }
    if (this.preloadPromise) return this.preloadPromise;

    this.init();
    const total = SOUND_CATALOG.length;
    let loaded = 0;

    this.preloadPromise = (async () => {
      await Promise.all(
        SOUND_CATALOG.map(async (entry) => {
          try {
            const res = await fetch(entry.path);
            if (res.ok) {
              const arrBuf = await res.arrayBuffer();
              this.rawBuffers.set(entry.id, arrBuf);
              if (this.ctx && typeof this.ctx.decodeAudioData === 'function') {
                try {
                  const decoded = await this.ctx.decodeAudioData(arrBuf.slice(0));
                  this.buffers.set(entry.id, decoded);
                } catch {
                  // Context may require first user gesture before decode; raw buffer retained
                }
              }
            }
          } catch {
            // Network/offline safety: synth fallback remains active
          } finally {
            loaded += 1;
            if (typeof onProgress === 'function') {
              onProgress({ loaded, total, lastId: entry.id });
            }
          }
        })
      );
      return { loaded, total };
    })();

    return this.preloadPromise;
  }

  /**
   * Decodes retained raw ArrayBuffers if AudioContext just unlocked after user interaction.
   */
  async ensureDecoded(id) {
    if (this.buffers.has(id)) return this.buffers.get(id);
    const raw = this.rawBuffers.get(id);
    const ctx = this.init();
    if (!raw || !ctx || typeof ctx.decodeAudioData !== 'function') return null;
    try {
      const decoded = await ctx.decodeAudioData(raw.slice(0));
      this.buffers.set(id, decoded);
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Plays an imported WAV sound asset by SOUND_CATALOG ID with optional gain & playback rate.
   * Returns true if buffer playback started, false if falling back to procedural DSP.
   */
  playSound(id, { gain = 0.8, playbackRate = 1.0 } = {}) {
    if (!this.enabled) return false;
    const ctx = this.init();
    if (!ctx) return false;

    const buffer = this.buffers.get(id);
    if (buffer && ctx.state === 'running') {
      try {
        const src = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        src.buffer = buffer;
        src.playbackRate.setValueAtTime(playbackRate, ctx.currentTime);
        gainNode.gain.setValueAtTime(gain, ctx.currentTime);
        src.connect(gainNode);
        gainNode.connect(ctx.destination);
        src.start(ctx.currentTime);
        return true;
      } catch {
        // Fall through to HTMLAudio/synth
      }
    }

    // Attempt lazy decode + HTMLAudio fallback for unlocked playback
    if (this.rawBuffers.has(id)) {
      this.ensureDecoded(id).then((decoded) => {
        if (decoded && this.enabled && this.ctx && this.ctx.state === 'running') {
          try {
            const src = this.ctx.createBufferSource();
            const g = this.ctx.createGain();
            src.buffer = decoded;
            src.playbackRate.setValueAtTime(playbackRate, this.ctx.currentTime);
            g.gain.setValueAtTime(gain, this.ctx.currentTime);
            src.connect(g);
            g.connect(this.ctx.destination);
            src.start(this.ctx.currentTime);
          } catch { }
        }
      });
    } else if (typeof Audio !== 'undefined' && SOUND_BY_ID[id]) {
      try {
        const audioEl = new Audio(SOUND_BY_ID[id].path);
        audioEl.volume = Math.min(1, Math.max(0, gain));
        audioEl.playbackRate = playbackRate;
        audioEl.play().catch(() => { });
        return true;
      } catch { }
    }

    return false;
  }

  /**
   * Optional low-pitch English Hulk announcer callout via browser SpeechSynthesis.
   */
  speakHulkLine(text) {
    if (!this.enabled || !this.voiceEnabled || typeof window === 'undefined') return;
    if (!('speechSynthesis' in window)) return;
    const now = Date.now();
    if (now - this.lastVoiceAt < 1400) return;
    this.lastVoiceAt = now;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.pitch = 0.45;
      utterance.rate = 0.92;
      utterance.volume = 0.85;
      const voices = window.speechSynthesis.getVoices?.() || [];
      const preferred =
        voices.find((v) => v.lang.startsWith('en') && /david|mark|daniel|guy|male|google us/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    } catch { }
  }

  // 1. Hulk Smash Impact + Target Signature Flavor
  playSmash(combo = 1, target = null) {
    if (!this.enabled) return;
    const rate = Math.min(1.22, 0.94 + combo * 0.025);
    const played = this.playSound('hulkSmash', { gain: 0.9, playbackRate: rate });

    if (!played) {
      this._synthSmash(combo);
    }

    // Layer target-specific signature character audio cleanly
    if (target?.soundKey && target.soundKey !== 'hulkSmash') {
      setTimeout(() => {
        this.playSound(target.soundKey, { gain: 0.45, playbackRate: 1.05 });
      }, 45);
    }

    // Milestone roars on major combo streaks (x5 Worldbreaker, x10 Apex)
    if (combo === 4 || combo === 9) {
      setTimeout(() => {
        this.playSound('hulkRoar', { gain: 0.65 });
      }, 90);
    }
  }

  _synthSmash(combo = 1) {
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const baseFreq = Math.min(180, 80 + combo * 10);
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.22);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);

    const bufferSize = Math.floor(ctx.sampleRate * 0.08);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200 + combo * 150, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.09);
  }

  // 2. Marvel Hero Ally Alert + Dissonant Buzzer
  playHeroAlert(decoy = null) {
    if (!this.enabled) return;
    this.playDecoyHit();
    if (decoy?.soundKey) {
      setTimeout(() => {
        this.playSound(decoy.soundKey, { gain: 0.65 });
      }, 65);
    }
  }

  playDecoyHit() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';
    osc1.frequency.setValueAtTime(130, now);
    osc2.frequency.setValueAtTime(185, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.28);
    osc2.stop(now + 0.28);
  }

  // 3. Ascending Combo Chime
  playComboChime(combo = 1) {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const notes = [440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    const freq = notes[Math.min(combo - 1, notes.length - 1)] || 440;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  // 4. Hulk Roar & Game Start Fanfare
  playHulkRoar() {
    if (!this.enabled) return;
    if (!this.playSound('hulkRoar', { gain: 0.9 })) {
      this._synthSmash(8);
    }
  }

  playGameStart() {
    if (!this.enabled) return;
    if (!this.playSound('hulkRoar', { gain: 0.85 })) {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.35);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  }

  // 5. Avengers Hero Team-Up Sound
  playHeroAssist(soundKey = 'thorThunder') {
    if (!this.enabled) return;
    this.playSound(soundKey, { gain: 0.9 });
    setTimeout(() => {
      this.playSound('hulkThunderclap', { gain: 0.65 });
    }, 110);
  }

  // 6. Timer Urgency Beep
  playTimerTick(isLow = false) {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isLow ? 880 : 440, now);
    gain.gain.setValueAtTime(isLow ? 0.22 : 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 7. Gamma Core Charging Sweep (Loading Sequence)
  playChargingSweep() {
    if (!this.enabled) return;
    if (!this.playSound('gammaCharge', { gain: 0.65 })) {
      const ctx = this.init();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 1.2);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    }
  }

  // 8. Countdown Beep (3, 2, 1, HULK SMASH!)
  playCountdownBeep(isFinal = false) {
    if (!this.enabled) return;
    if (isFinal) {
      this.playSound('hulkThunderclap', { gain: 0.85 });
      return;
    }
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // 9. Game Over Triumphant Chord
  playGameOver() {
    if (!this.enabled) return;
    this.playSound('capShield', { gain: 0.55 });
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const freqs = [220, 277.18, 329.63, 440];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + 0.85);
    });
  }
}

export const hulkAudio = new HulkAudioEngine();
