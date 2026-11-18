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
        ctx = new C(); master = ctx.createGain(); master.gain.value = cfg.vol;
        const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 8; comp.attack.value = 0.004; comp.release.value = 0.25;
        master.connect(comp); comp.connect(ctx.destination);
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
    cheer(dur) { SFX.applause(dur || 3, 1.4); crowd('cheer', 22, dur || 3); whistles(4, dur || 3); }
  };

  /* ---------------- multitudes sintetizadas (voces con formantes) ---------------- */
  // Cada "persona" es un oscilador con vibrato filtrado por los formantes de una vocal.
  const VOW = { a: [800, 1150, 2900], o: [450, 800, 2830], e: [400, 2000, 2550], u: [325, 700, 2530], i: [300, 2300, 3000] };
  function person(t0, dur, f0, vowel, shape, vol, pan) {
    const c = ensure(); if (!c) return;
    const t = c.currentTime + t0, o = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain(), out = c.createGain();
    o.type = 'sawtooth'; lfo.frequency.value = 4.5 + Math.random() * 2.5; lg.gain.value = f0 * 0.035; lfo.connect(lg); lg.connect(o.frequency);
    const f = o.frequency;
    if (shape === 'up') { f.setValueAtTime(f0 * 0.8, t); f.exponentialRampToValueAtTime(f0 * 1.55, t + dur * 0.35); f.exponentialRampToValueAtTime(f0 * 1.15, t + dur); }
    else if (shape === 'down') { f.setValueAtTime(f0 * 1.15, t); f.exponentialRampToValueAtTime(f0 * 0.68, t + dur); }
    else if (shape === 'hit') { f.setValueAtTime(f0 * 1.25, t); f.exponentialRampToValueAtTime(f0 * 0.9, t + dur); }
    else f.setValueAtTime(f0, t);
    const F = VOW[vowel] || VOW.a;
    F.forEach((fr, k) => { const bp = c.createBiquadFilter(), gg = c.createGain(); bp.type = 'bandpass'; bp.frequency.value = fr * (f0 > 180 ? 1.12 : 1); bp.Q.value = fr / 90; gg.gain.value = [1, 0.55, 0.22][k]; o.connect(bp); bp.connect(gg); gg.connect(out); });
    const env = c.createGain(), att = Math.min(0.09, dur / 4);
    env.gain.setValueAtTime(0.0001, t); env.gain.exponentialRampToValueAtTime(vol, t + att); env.gain.setValueAtTime(vol, t + dur * 0.7); env.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    out.connect(env);
    let node = env; if (c.createStereoPanner) { const p = c.createStereoPanner(); p.pan.value = pan; env.connect(p); node = p; }
    node.connect(master); o.start(t); lfo.start(t); o.stop(t + dur + 0.05); lfo.stop(t + dur + 0.05);
  }
  const rnd = (a, b) => a + Math.random() * (b - a);
  const f0of = () => (Math.random() < 0.55 ? rnd(95, 165) : rnd(185, 310));
  function crowd(kind, n, dur) {
    const d = dur || 2.5;
    for (let i = 0; i < n; i++) {
      const st = rnd(0, kind === 'cheer' ? 0.5 : 0.3), len = Math.max(0.5, rnd(d * 0.45, d) - st);
      if (kind === 'cheer') person(st, len, f0of(), 'aoeo'[i % 4], Math.random() < 0.75 ? 'up' : 'flat', 0.022, rnd(-0.9, 0.9));
      else if (kind === 'boo') person(st, len, rnd(85, 150), 'uo'[i % 2], 'down', 0.026, rnd(-0.9, 0.9));
      else if (kind === 'aww') person(st, Math.min(len, 1.6), f0of(), 'oa'[i % 2], 'down', 0.02, rnd(-0.9, 0.9));
      else if (kind === 'gasp') person(st * 0.3, 0.45, f0of(), 'a', 'up', 0.02, rnd(-0.9, 0.9));
    }
    noise(0, d, kind === 'boo' ? 350 : 900, 0.7, kind === 'cheer' ? 0.07 : 0.05);
  }
  // Cánticos rítmicos: una tribuna entera cantando sílabas al mismo tiempo
  const CHANTS = {
    ole: { bpm: 0.28, syl: [['o', 0], ['e', 4], ['o', 0], ['e', 4], ['o', 0], ['e', 4], ['o', 2], ['e', 5, 2], ['o', 2], ['e', 5, 2]] },
    vamos: { bpm: 0.3, syl: [['a', 0], ['o', 3], ['a', 5, 1.4], [null], ['a', 0], ['o', 3], ['a', 5, 1.4], [null]] },
    fuera: { bpm: 0.36, syl: [['u', 3], ['a', 0, 1.3], [null], ['u', 3], ['a', 0, 1.3], [null], ['u', 3], ['a', 0, 1.3]] },
    si: { bpm: 0.32, syl: [['i', 0], ['e', 0], ['u', 2], ['e', 4, 1.6], [null], ['i', 0], ['e', 0], ['u', 2], ['e', 4, 1.6]] }
  };
  function chant(name, voices) {
    const ch = CHANTS[name]; if (!ch || !ensure()) return 0;
    const base = Array.from({ length: voices || 14 }, () => ({ f: f0of() * 0.9, p: rnd(-0.9, 0.9) }));
    let t = 0;
    ch.syl.forEach(s => {
      const len = ch.bpm * (s[2] || 1);
      if (s[0]) base.forEach(v => person(t + rnd(0, 0.035), len * 0.92, v.f * Math.pow(2, s[1] / 12), s[0], 'hit', 0.018, v.p));
      t += len;
    });
    return t;
  }
  function whistles(n, d) {
    for (let i = 0; i < n; i++) { const t = rnd(0.1, (d || 2) * 0.7), b = rnd(1800, 2600); tone(b, t, 0.16, 'sine', 0.045, b * 1.5); tone(b * 1.4, t + 0.2, 0.38, 'sine', 0.045, b * 0.95); }
  }
  function bombo(beats, gap, t0) {
    for (let i = 0; i < beats; i++) { const t = (t0 || 0) + i * (gap || 0.3); tone(68, t, 0.32, 'sine', 0.5, 42); noise(t, 0.05, 900, 1, 0.12); }
  }
  function platillo(t) { noise(t || 0, 0.9, 7000, 0.4, 0.09, 'highpass'); }
  function corneta(t0, n) { for (let i = 0; i < (n || 2); i++) { const c = ensure(); if (!c) return; const t = c.currentTime + t0 + i * 0.75, o = c.createOscillator(), f = c.createBiquadFilter(), gn = c.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(233, t); o.frequency.linearRampToValueAtTime(240, t + 0.6); f.type = 'lowpass'; f.frequency.value = 1400; gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(0.07, t + 0.06); gn.gain.setValueAtTime(0.07, t + 0.5); gn.gain.exponentialRampToValueAtTime(0.0001, t + 0.62); o.connect(f); f.connect(gn); gn.connect(master); o.start(t); o.stop(t + 0.7); } }
  function bocinas(t0) { [0, 0.18, 0.5, 0.62, 0.9].forEach(x => { tone(415, t0 + x, 0.14, 'square', 0.03); tone(523, t0 + x, 0.14, 'square', 0.025); }); }
  function fuegos(n, t0) {
    for (let i = 0; i < n; i++) {
      const t = (t0 || 0) + i * rnd(0.35, 0.7), up = rnd(0.5, 0.8);
      tone(rnd(900, 1300), t, up, 'sine', 0.025, rnd(2600, 3400));
      noise(t + up, 0.5, 300, 0.6, 0.35, 'lowpass');
      for (let k = 0; k < 14; k++) noise(t + up + 0.1 + Math.random() * 0.7, 0.025, rnd(3000, 6000), 2, 0.05);
    }
  }
  function cacerolas(d) {
    const n = Math.floor((d || 3) * 9);
    for (let i = 0; i < n; i++) { const t = (i / n) * (d || 3) + rnd(0, 0.08), b = rnd(500, 900); [1, 2.76, 5.4, 8.9].forEach((m, k) => tone(b * m, t, 0.18 - k * 0.03, 'sine', 0.04 / (k + 1))); noise(t, 0.03, 4000, 1, 0.06); }
  }
  function fanfarria() { [[523, 0, 0.16], [659, 0.16, 0.16], [784, 0.32, 0.16], [1047, 0.48, 0.55]].forEach(([f, t, d]) => { tone(f, t, d, 'sawtooth', 0.05); tone(f * 2, t, d, 'triangle', 0.025); }); }
  function corcho() { tone(700, 0, 0.06, 'sine', 0.3, 200); noise(0, 0.06, 1500, 1, 0.3); noise(0.06, 1.2, 6000, 0.5, 0.03, 'highpass'); }

  // Paquetes listos para usar. k = intensidad 1..3
  Object.assign(SFX, {
    crowd, chant,
    celebrate(k) {
      k = k || 1; if (!ensure()) return;
      SFX.applause(1.8 + k, 0.8 + 0.3 * k); crowd('cheer', 10 + 8 * k, 1.8 + k * 0.6); whistles(1 + 2 * k, 2 + k);
      if (k >= 2) { bombo(8, 0.3, 0.2); platillo(0.2); platillo(1.4); setTimeout(() => chant(Math.random() < 0.5 ? 'ole' : 'vamos', 10 + 4 * k), 900); corneta(0.6, 2); }
      if (k >= 3) { fuegos(4, 0.8); bocinas(2.2); corcho(); bombo(8, 0.3, 2.6); }
    },
    protest(k) {
      k = k || 1; if (!ensure()) return;
      crowd('boo', 8 + 6 * k, 2.2); setTimeout(() => chant(Math.random() < 0.6 ? 'fuera' : 'si', 10 + 4 * k), 400); bombo(6 + 4 * k, 0.36, 0.4);
      if (k >= 2) cacerolas(2.5 + k);
    },
    disappoint() { crowd('aww', 14, 1.6); },
    gasp() { crowd('gasp', 12, 0.7); },
    fanfare: fanfarria, fireworks: n => fuegos(n || 4, 0), horns: () => bocinas(0), pots: d => cacerolas(d), drums: (n, g2) => bombo(n || 8, g2 || 0.3, 0), pop: corcho
  });

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
    stop() { try { g.speechSynthesis && g.speechSynthesis.cancel(); } catch (e) { /* nada */ } },
    // Grito de una persona de un sector: cada personaje tiene su tono de voz
    shout(text, gid) {
      const P = { jb: [0.75, 0.9, 'm'], jov: [1.35, 1.25, 'f'], uni: [1.25, 1.15, 'f'], fin: [0.95, 1.15, 'm'], agro: [0.8, 1, 'm'], sn: [0.7, 1.1, 'm'], rel: [0.8, 0.85, 'm'], mov: [1.1, 1.2, 'f'], pu: [1.2, 1.05, 'f'], inf: [1, 1.2, 'm'], cm: [1.1, 1.1, 'f'], sp: [1, 1.15, 'm'], pym: [0.95, 1.1, 'm'], ind: [0.85, 1, 'm'], int: [0.9, 1, 'm'] }[gid] || [1.1, 1.15];
      AR.voice.say(text, { pitch: P[0], rate: P[1], who: P[2], interrupt: true });
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
