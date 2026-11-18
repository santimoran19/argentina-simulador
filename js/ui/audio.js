/* Audio sintetizado con Web Audio (sin archivos) y voces con speechSynthesis */
(function (g) {
  'use strict';
  const AR = g.AR;
  const KEY = 'ar-sim-audio';
  let cfg = { sfx: true, voice: true, vol: 0.7 };
  try { cfg = Object.assign(cfg, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* sin almacenamiento */ }
  let ctx = null, master = null, noiseBuf = null;

  function ensure() {
    if (!cfg.sfx) return null;
    try {
      if (!ctx) {
        const C = g.AudioContext || g.webkitAudioContext; if (!C) return null;
        ctx = new C(); master = ctx.createGain(); master.gain.value = cfg.vol; master.connect(ctx.destination);
        noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
      return ctx;
    } catch (e) { return null; }
  }
  function tone(freq, start, dur, type, vol, glide) {
    const c = ensure(); if (!c) return;
    const o = c.createOscillator(), gn = c.createGain(), t = c.currentTime + start;
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.01); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(gn); gn.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  function noise(start, dur, freq, q, vol, type) {
    const c = ensure(); if (!c) return null;
    const s = c.createBufferSource(), f = c.createBiquadFilter(), gn = c.createGain(), t = c.currentTime + start;
    s.buffer = noiseBuf; s.loop = true; f.type = type || 'bandpass'; f.frequency.value = freq; f.Q.value = q || 1;
    gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(vol, t + Math.min(0.05, dur / 3)); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(gn); gn.connect(master); s.start(t, Math.random()); s.stop(t + dur + 0.05);
    return gn;
  }

  const SFX = AR.sfx = {
    cfg,
    save() { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) { /* nada */ } if (master) master.gain.value = cfg.vol; },
    unlock() { ensure(); },
    click() { tone(880, 0, 0.05, 'triangle', 0.08); },
    hover() { tone(1320, 0, 0.03, 'sine', 0.025); },
    coin() { tone(988, 0, 0.08, 'square', 0.06); tone(1319, 0.07, 0.18, 'square', 0.06); },
    stamp() { noise(0, 0.12, 200, 0.8, 0.5, 'lowpass'); tone(90, 0, 0.18, 'sine', 0.5, 50); },
    gavel() { [0, 0.28, 0.56].forEach(t => { tone(140, t, 0.12, 'triangle', 0.5, 70); noise(t, 0.08, 1800, 2, 0.25); }); },
    pen() { for (let i = 0; i < 6; i++) noise(i * 0.06, 0.05, 3500 + Math.random() * 1500, 4, 0.08); },
    turn() { tone(523, 0, 0.12, 'triangle', 0.1); tone(659, 0.1, 0.12, 'triangle', 0.1); tone(784, 0.2, 0.2, 'triangle', 0.1); },
    chime() { [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.09, 0.5, 'sine', 0.12)); },
    news() { tone(392, 0, 0.15, 'sawtooth', 0.06); tone(523, 0.15, 0.15, 'sawtooth', 0.06); tone(784, 0.3, 0.35, 'sawtooth', 0.07); },
    bad() { tone(220, 0, 0.25, 'sawtooth', 0.08, 160); tone(165, 0.2, 0.4, 'sawtooth', 0.08, 110); },
    good() { tone(523, 0, 0.12, 'sine', 0.12); tone(784, 0.1, 0.3, 'sine', 0.12); },
    drum(dur) { const n = Math.floor((dur || 2) / 0.07); for (let i = 0; i < n; i++) noise(i * 0.07, 0.06, 120, 1, 0.25 + 0.3 * i / n, 'lowpass'); },
    murmur(dur) { noise(0, dur || 3, 400, 0.6, 0.12, 'lowpass'); noise(0.2, (dur || 3) - 0.2, 900, 1.5, 0.05); },
    applause(dur, k) {
      const d = dur || 2.6, n = Math.floor(160 * (k || 1) * d / 2.6);
      for (let i = 0; i < n; i++) { const t = Math.random() * d * (0.4 + 0.6 * Math.random()); noise(t, 0.035 + Math.random() * 0.03, 1500 + Math.random() * 2500, 1.2, 0.07 + Math.random() * 0.08); }
      noise(0, d, 2500, 0.5, 0.05);
      for (let i = 0; i < 4; i++) tone(1800 + Math.random() * 600, 0.3 + Math.random() * d * 0.6, 0.25, 'sine', 0.03, 2600); // silbidos de festejo
    },
    boo(dur) {
      const c = ensure(); if (!c) return; const d = dur || 2.2;
      for (let i = 0; i < 7; i++) {
        const o = c.createOscillator(), f = c.createBiquadFilter(), gn = c.createGain(), t = c.currentTime + Math.random() * 0.4, base = 120 + Math.random() * 70;
        o.type = 'sawtooth'; o.frequency.setValueAtTime(base * 1.15, t); o.frequency.linearRampToValueAtTime(base * 0.85, t + d);
        f.type = 'bandpass'; f.frequency.value = 500; f.Q.value = 2.5;
        gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(0.05, t + 0.25); gn.gain.exponentialRampToValueAtTime(0.0001, t + d);
        o.connect(f); f.connect(gn); gn.connect(master); o.start(t); o.stop(t + d + 0.1);
      }
      noise(0, d, 300, 0.7, 0.08, 'lowpass');
    },
    siren(dur) {
      const c = ensure(); if (!c) return; const d = dur || 2.4, o = c.createOscillator(), gn = c.createGain(), t = c.currentTime;
      o.type = 'square'; for (let i = 0; i < d / 0.6; i++) { o.frequency.setValueAtTime(660, t + i * 0.6); o.frequency.linearRampToValueAtTime(980, t + i * 0.6 + 0.3); o.frequency.linearRampToValueAtTime(660, t + i * 0.6 + 0.6); }
      gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(0.05, t + 0.05); gn.gain.setValueAtTime(0.05, t + d - 0.2); gn.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(gn); gn.connect(master); o.start(t); o.stop(t + d + 0.05);
    },
    cheer(dur) { SFX.applause(dur || 3, 1.4); noise(0, dur || 3, 700, 0.8, 0.09); }
  };

  /* ---------------- voces ---------------- */
  let voices = [];
  function loadVoices() { try { voices = g.speechSynthesis ? g.speechSynthesis.getVoices() : []; } catch (e) { voices = []; } }
  if (g.speechSynthesis) { loadVoices(); g.speechSynthesis.onvoiceschanged = loadVoices; }
  const pick = (pref) => {
    const es = voices.filter(v => /^es/i.test(v.lang));
    return es.find(v => /AR/i.test(v.lang)) || es.find(v => (pref === 'f' ? /female|mujer|helena|sabina|paulina|monica|laura/i : /male|hombre|pablo|jorge|raul|diego|alvaro/i).test(v.name)) || es[0] || null;
  };
  AR.voice = {
    say(text, opts) {
      if (!cfg.voice || !g.speechSynthesis) return;
      try {
        const u = new SpeechSynthesisUtterance(text), o = opts || {};
        const v = pick(o.who); if (v) u.voice = v; u.lang = (v && v.lang) || 'es-AR';
        u.rate = o.rate || 1.05; u.pitch = o.pitch || 1; u.volume = Math.min(1, cfg.vol + 0.2);
        if (o.interrupt) g.speechSynthesis.cancel();
        g.speechSynthesis.speak(u);
      } catch (e) { /* sin voz */ }
    },
    stop() { try { g.speechSynthesis && g.speechSynthesis.cancel(); } catch (e) { /* nada */ } }
  };
})(typeof window !== 'undefined' ? window : globalThis);
