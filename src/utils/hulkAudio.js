/**
 * AVENGERS: DOOMSDAY — HULK & 51 MARVEL CHARACTER AUDIO ENGINE
 * Preloads core WAV SFX assets + unique DSP character voice+SFX tracks (/sounds/chars/<id>.wav)
 * into Web Audio API AudioBuffers for zero-latency playback, with cooldown control and DSP fallbacks.
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

const PRIORITY_CHAR_IDS = [
  'hulk',
  'iron-man',
  'thanos',
  'doctor-doom',
  'thor',
  'spider-man',
  'steve-rogers',
  'doctor-strange',
  'black-widow',
  'loki',
  'galactus',
  'sentry',
  'wolverine',
  'deadpool',
];

const CUSTOM_DB_NAME = 'doomsday_custom_audio_v1';
const CUSTOM_STORE_NAME = 'audioOverrides';

function openCustomAudioDB() {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    try {
      const req = indexedDB.open(CUSTOM_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(CUSTOM_STORE_NAME)) {
          db.createObjectStore(CUSTOM_STORE_NAME, { keyPath: 'key' });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

class HulkAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.voiceEnabled = false;
    this.buffers = new Map();
    this.rawBuffers = new Map();
    this.charBuffers = new Map();
    this.charRawBuffers = new Map();
    this.customNames = new Map();
    this.preloadPromise = null;
    this.activeVoiceSource = null;
    this.activeHtmlAudio = null;
    this.lastVoiceAt = 0;
    this.lastCharVoiceAt = 0;
  }

  getCustomOverrides() {
    return Object.fromEntries(this.customNames.entries());
  }

  async loadCustomOverrides() {
    const db = await openCustomAudioDB();
    if (!db) return;
    try {
      const records = await new Promise((resolve) => {
        const tx = db.transaction(CUSTOM_STORE_NAME, 'readonly');
        const store = tx.objectStore(CUSTOM_STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      });
      const ctx = this.init();
      for (const rec of records) {
        if (!rec?.key || !rec?.arrayBuffer) continue;
        const isChar = rec.key.startsWith('char:');
        const id = isChar ? rec.key.slice(5) : rec.key;
        const rawMap = isChar ? this.charRawBuffers : this.rawBuffers;
        const bufMap = isChar ? this.charBuffers : this.buffers;
        rawMap.set(id, rec.arrayBuffer);
        this.customNames.set(rec.key, rec.fileName || 'Custom Clip');
        if (ctx && typeof ctx.decodeAudioData === 'function') {
          try {
            const decoded = await ctx.decodeAudioData(rec.arrayBuffer.slice(0));
            bufMap.set(id, decoded);
          } catch { }
        }
      }
    } catch { }
  }

  async importCustomAudioFile(slotKey, file, isCharVoice = false) {
    if (!file || typeof window === 'undefined') return { ok: false, error: 'Invalid file' };
    const ctx = this.init();
    try {
      const arrayBuffer = await file.arrayBuffer();
      const rawMap = isCharVoice ? this.charRawBuffers : this.rawBuffers;
      const bufMap = isCharVoice ? this.charBuffers : this.buffers;
      const fullKey = isCharVoice ? `char:${slotKey}` : slotKey;

      rawMap.set(slotKey, arrayBuffer);
      if (ctx && typeof ctx.decodeAudioData === 'function') {
        const decoded = await ctx.decodeAudioData(arrayBuffer.slice(0));
        bufMap.set(slotKey, decoded);
      }
      this.customNames.set(fullKey, file.name);

      const db = await openCustomAudioDB();
      if (db) {
        await new Promise((resolve) => {
          const tx = db.transaction(CUSTOM_STORE_NAME, 'readwrite');
          tx.objectStore(CUSTOM_STORE_NAME).put({ key: fullKey, fileName: file.name, arrayBuffer });
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        });
      }

      if (isCharVoice) {
        this.playCharacterVoice(slotKey, { gain: 0.95, force: true });
      } else {
        this.playSound(slotKey, { gain: 0.95 });
      }
      return { ok: true, fileName: file.name };
    } catch (err) {
      return { ok: false, error: err?.message || 'Unsupported audio format' };
    }
  }

  async clearCustomAudio(slotKey, isCharVoice = false) {
    const fullKey = isCharVoice ? `char:${slotKey}` : slotKey;
    const rawMap = isCharVoice ? this.charRawBuffers : this.rawBuffers;
    const bufMap = isCharVoice ? this.charBuffers : this.buffers;

    this.customNames.delete(fullKey);
    rawMap.delete(slotKey);
    bufMap.delete(slotKey);

    const db = await openCustomAudioDB();
    if (db) {
      try {
        await new Promise((resolve) => {
          const tx = db.transaction(CUSTOM_STORE_NAME, 'readwrite');
          tx.objectStore(CUSTOM_STORE_NAME).delete(fullKey);
          tx.oncomplete = () => resolve(true);
          tx.onerror = () => resolve(false);
        });
      } catch { }
    }

    const url = isCharVoice ? `/sounds/chars/${slotKey}.wav` : SOUND_BY_ID[slotKey]?.path;
    if (url) {
      await this._fetchAndDecode(url, bufMap, rawMap, slotKey);
    }
    return this.getCustomOverrides();
  }

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

  async _fetchAndDecode(url, bufferMap, rawMap, key) {
    if (bufferMap.has(key) || rawMap.has(key)) return true;
    try {
      const res = await fetch(url);
      if (!res.ok) return false;
      const arrBuf = await res.arrayBuffer();
      rawMap.set(key, arrBuf);
      if (this.ctx && typeof this.ctx.decodeAudioData === 'function') {
        try {
          const decoded = await this.ctx.decodeAudioData(arrBuf.slice(0));
          bufferMap.set(key, decoded);
        } catch { }
      }
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Preloads all 10 core WAV SFX assets plus core combat character voice+SFX WAV files.
   */
  async preloadAll(onProgress, extraCharIds = []) {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') {
      return { loaded: 0, total: SOUND_CATALOG.length };
    }
    if (this.preloadPromise) return this.preloadPromise;

    this.init();
    const charIdsToLoad = Array.from(new Set([...PRIORITY_CHAR_IDS, ...extraCharIds.filter(Boolean)]));
    const total = SOUND_CATALOG.length + charIdsToLoad.length;
    let loaded = 0;

    const bump = (id) => {
      loaded += 1;
      if (typeof onProgress === 'function') {
        onProgress({ loaded, total, lastId: id });
      }
    };

    this.preloadPromise = (async () => {
      await Promise.all([
        ...SOUND_CATALOG.map(async (entry) => {
          await this._fetchAndDecode(entry.path, this.buffers, this.rawBuffers, entry.id);
          bump(entry.id);
        }),
        ...charIdsToLoad.map(async (charId) => {
          await this._fetchAndDecode(`/sounds/chars/${charId}.wav`, this.charBuffers, this.charRawBuffers, charId);
          bump(charId);
        }),
      ]);
      await this.loadCustomOverrides();
      return { loaded, total };
    })();

    return this.preloadPromise;
  }

  async ensureDecoded(id, isChar = false) {
    const bMap = isChar ? this.charBuffers : this.buffers;
    const rMap = isChar ? this.charRawBuffers : this.rawBuffers;
    if (bMap.has(id)) return bMap.get(id);
    const raw = rMap.get(id);
    const ctx = this.init();
    if (!raw || !ctx || typeof ctx.decodeAudioData !== 'function') return null;
    try {
      const decoded = await ctx.decodeAudioData(raw.slice(0));
      bMap.set(id, decoded);
      return decoded;
    } catch {
      return null;
    }
  }

  _stopCurrentCharVoice() {
    try {
      if (this.activeVoiceSource) {
        this.activeVoiceSource.stop();
        this.activeVoiceSource.disconnect();
        this.activeVoiceSource = null;
      }
    } catch { }
    try {
      if (this.activeHtmlAudio) {
        this.activeHtmlAudio.pause();
        this.activeHtmlAudio = null;
      }
    } catch { }
  }

  /**
   * Plays a unique character voice+SFX WAV (/sounds/chars/<characterId>.wav).
   * Throttled by cooldownMs during rapid gameplay unless force=true (preview/team-up/avatar pick).
   */
  async playCharacterVoice(characterId, { gain = 0.88, cooldownMs = 1500, force = false } = {}) {
    if (!this.enabled || !characterId || typeof window === 'undefined') return false;

    const nowMs = Date.now();
    if (!force && nowMs - this.lastCharVoiceAt < cooldownMs) {
      return false;
    }
    this.lastCharVoiceAt = nowMs;

    if (force) {
      this._stopCurrentCharVoice();
    }

    const url = `/sounds/chars/${characterId}.wav`;
    const ctx = this.init();

    // Lazy-fetch if this character isn't preloaded yet
    if (!this.charBuffers.has(characterId) && !this.charRawBuffers.has(characterId)) {
      await this._fetchAndDecode(url, this.charBuffers, this.charRawBuffers, characterId);
    }

    const buffer = (await this.ensureDecoded(characterId, true)) || this.charBuffers.get(characterId);
    if (buffer && ctx && ctx.state === 'running') {
      try {
        const src = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        src.buffer = buffer;
        gainNode.gain.setValueAtTime(gain, ctx.currentTime);
        src.connect(gainNode);
        gainNode.connect(ctx.destination);
        if (force) {
          this.activeVoiceSource = src;
          src.onended = () => {
            if (this.activeVoiceSource === src) this.activeVoiceSource = null;
          };
        }
        src.start(ctx.currentTime);
        return true;
      } catch { }
    }

    if (typeof Audio !== 'undefined') {
      try {
        const el = new Audio(url);
        el.volume = Math.min(1, Math.max(0, gain));
        if (force) this.activeHtmlAudio = el;
        el.play().catch(() => { });
        return true;
      } catch { }
    }
    return false;
  }

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
      } catch { }
    }

    if (this.rawBuffers.has(id)) {
      this.ensureDecoded(id, false).then((decoded) => {
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

  playSmash(combo = 1, target = null) {
    if (!this.enabled) return;
    const rate = Math.min(1.22, 0.94 + combo * 0.025);
    const played = this.playSound('hulkSmash', { gain: 0.9, playbackRate: rate });

    if (!played) {
      this._synthSmash(combo);
    }

    // Play the target character's unique voice+SFX (e.g., Thanos terror voice, Doom metallic line)
    if (target?.characterId) {
      setTimeout(() => {
        this.playCharacterVoice(target.characterId, {
          gain: 0.72,
          cooldownMs: target.isBonus || target.characterId === 'thanos' ? 1200 : 2100,
        });
      }, 55);
    } else if (target?.soundKey && target.soundKey !== 'hulkSmash') {
      setTimeout(() => {
        this.playSound(target.soundKey, { gain: 0.45, playbackRate: 1.05 });
      }, 45);
    }

    if (combo === 4 || combo === 9) {
      setTimeout(() => {
        this.playSound('hulkRoar', { gain: 0.65 });
      }, 95);
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

  playHeroAlert(decoy = null) {
    if (!this.enabled) return;
    this.playDecoyHit();
    if (decoy?.characterId) {
      setTimeout(() => {
        this.playCharacterVoice(decoy.characterId, { gain: 0.8, cooldownMs: 900, force: true });
      }, 95);
    } else if (decoy?.soundKey) {
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

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.26);
    osc2.stop(now + 0.26);
  }

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
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  playHulkRoar() {
    if (!this.enabled) return;
    if (!this.playSound('hulkRoar', { gain: 0.9 })) {
      this._synthSmash(8);
    }
  }

  playGameStart(avatarId = 'hulk') {
    if (!this.enabled) return;
    if (avatarId && avatarId !== 'hulk') {
      this.playCharacterVoice(avatarId, { gain: 0.9, force: true });
    } else if (!this.playSound('hulkRoar', { gain: 0.85 })) {
      this._synthSmash(8);
    }
  }

  playHeroAssist(soundKey = 'thorThunder', characterId = null) {
    if (!this.enabled) return;
    this.playSound(soundKey, { gain: 0.78 });
    if (characterId) {
      setTimeout(() => {
        this.playCharacterVoice(characterId, { gain: 0.95, force: true });
      }, 90);
    }
  }

  playTimerTick(isLow = false) {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isLow ? 880 : 440, now);
    gain.gain.setValueAtTime(isLow ? 0.2 : 0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

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
