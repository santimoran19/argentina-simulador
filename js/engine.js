(function (g) {
  'use strict';
  const AR = g.AR = g.AR || {};
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
  const sum = a => a.reduce((s, x) => s + x, 0);
  const last = (a, n) => a[a.length - (n || 1)];
  const mean = (a, n) => { const s = a.slice(-n); return sum(s) / s.length; };
  const MS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const ML = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  AR.clamp = clamp;
  AR.dateOf = t => { const st = AR.scenario.start; const i = st.m + t; return { y: st.y + Math.floor(i / 12), m: ((i % 12) + 12) % 12 }; };
  AR.dateLabel = t => { const d = AR.dateOf(t); return MS[d.m] + ' ' + d.y; };
  AR.dateLong = t => { const d = AR.dateOf(t); return ML[d.m] + ' de ' + d.y; };
  const SEAS = (() => { const a = [0.8, 0.85, 1, 1.25, 1.4, 1.35, 1.2, 1, 0.85, 0.8, 0.8, 0.8]; const s = sum(a) / 12; return a.map(x => x / s); })();
  const PK = () => AR.partyOrder;

  /* ---------- aleatoriedad determinista (se guarda en el estado) ---------- */
  AR.rnd = S => {
    S.seed = (S.seed + 0x6D2B79F5) | 0;
    let t = S.seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const gauss = S => (AR.rnd(S) + AR.rnd(S) + AR.rnd(S) + AR.rnd(S) - 2) * 1.73;

  /* ---------- acceso a políticas ---------- */
  AR.pol = id => { if (!AR._pi) { AR._pi = {}; AR.policies.forEach(p => { AR._pi[p.id] = p; }); } return AR._pi[id]; };
  const cur = (S, id) => AR.pol(id).levels[S.pol[id].cur];
  const lever = (S, k) => { let s = 0; for (const p of AR.policies) s += (p.levels[S.pol[p.id].cur].fx[k] || 0) - (p.levels[p.init].fx[k] || 0); return s; };
  const gEff = (S, gid) => { let s = 0; for (const p of AR.policies) s += (p.levels[S.pol[p.id].cur].g[gid] || 0) - (p.levels[p.init].g[gid] || 0); return s; };
  const relEff = (S, pid) => { let s = 0; for (const p of AR.policies) s += ((p.levels[S.pol[p.id].cur].rel || {})[pid] || 0) - ((p.levels[p.init].rel || {})[pid] || 0); return s; };
  AR.lever = lever;
  const dist = (a, b) => Math.hypot(a.eco - b.eco, 0.6 * (a.soc - b.soc));

  /* ---------- escenarios ---------- */
  const SCL = () => AR.scenario.scale || 1;
  AR.rs = S => S.m.res / SCL();
  AR.setScenario = function (id) {
    const sc = AR.SC[id]; if (!sc) throw new Error('Escenario desconocido: ' + id);
    AR.scenario = sc; AR.parties = sc.parties; AR.partyOrder = sc.order; AR.family = sc.family || {}; AR.CHAMBER = sc.chamber;
    AR.groups.forEach(gr => { if (!gr.aff23) gr.aff23 = gr.aff; gr.aff = sc.affArr ? Object.fromEntries(sc.order.map((k, i) => [k, sc.affArr[gr.id][i]])) : gr.aff23; });
    AR.policies.forEach(p => {
      if (p.init0 === undefined) { p.init0 = p.init; p.levels.forEach(l => { l.label0 = l.label; }); }
      p.init = sc.polInit && sc.polInit[p.id] !== undefined ? sc.polInit[p.id] : p.init0;
      p.levels.forEach((l, i) => { const o = (sc.labels && sc.labels[p.id] && sc.labels[p.id][i]) || (id !== 'dic2023' && AR.neutral[p.id] && AR.neutral[p.id][i]); l.label = o || l.label0; });
    });
    return sc;
  };
  AR.nearElection = S => { const E = AR.scenario.elections; return [E.general].concat(E.midterm || []).some(x => x !== null && x !== undefined && Math.abs(S.t - x) <= 2 && S.t <= x); };
  AR.neutral = Object.assign({
    jubilaciones: { 0: 'Movilidad por ley (trimestral, inflación y salarios)', 1: 'Inflación rezagada y bono congelado', 2: 'Recomposición extraordinaria + inflación', 3: 'Congelamiento nominal (sólo emergencias)' },
    ganancias: { 0: 'Eximido para la gran mayoría', 1: 'Mínimo no imponible alto restablecido', 2: 'Esquema histórico (más contribuyentes)' },
    overhang: { 2: 'Stock actual de pasivos remunerados del BCRA' }, ive: { 0: 'Marco legal vigente' }, deuda: { 0: 'Pagar en tiempo y forma' },
    vivienda: { 0: 'Régimen de alquileres vigente' }, educacion: { 0: 'Financiamiento educativo actual' }, fmi: { 1: 'Relación vigente con el FMI' },
    privat: { 0: 'Sin privatizaciones' }, sub_energia: { 0: 'Subsidios generalizados' }
  }, AR.neutral || {});

  /* ---------- partida nueva ---------- */
  AR.newGame = function (partyId, seed, scnId) {
    const sc = AR.setScenario(scnId || 'dic2023'), party = AR.parties[partyId];
    const S = {
      ver: 2, scn: sc.id, t: 0, party: partyId, seed: (seed || Math.floor(Math.random() * 2147483647)) | 0,
      m: JSON.parse(JSON.stringify(sc.macro)), pol: {}, pc: party.pc0, seats: {}, rel: {}, A: {}, appr: 50, gv: 40,
      buffs: [], shInf: [], shCred: 0, harv: [], pbSh: [], news: [], evLast: {}, ctx: {}, dnus: [], pending: [], over: null,
      band: { lo: 0, hi: 0, k: 0 }, dollar: false, low: 0, hyper: 0, elect: null, laws: [], stats: { laws: 0, dnu: 0, vetos: 0 }
    };
    AR.policies.forEach(p => { S.pol[p.id] = { cur: p.init, pend: null }; });
    PK().forEach(k => { S.seats[k] = { dip: AR.parties[k].seats0.dip, sen: AR.parties[k].seats0.sen }; });
    const m = S.m;
    m.fxOffLast = m.fxOff; m.pb0 = m.pb; m.usd = sc.usd || 0.5;
    m.b = { pov: m.pov, u: m.u, inf: m.infM, insec: m.insec, gini: m.gini, edu: m.edu, hea: m.hea, cult: m.cult, inst: m.inst, tra: m.tra, ind: m.ind, interest: m.interest, debt: m.debt, risk: m.risk };
    m.riskAdj = m.risk - riskOf(m.C);
    m.b.RI = 0.45 * m.rw + 0.25 * m.rinf + 0.20 * m.rPen + 0.10 * m.rSoc;
    PK().forEach(k => { S.rel[k] = relTarget(S, k); });
    m.rate = cur(S, 'tasa').fx.rate;
    S.h = {
      infM: sc.infH.slice(), fxOff: [m.fxOff], fxBlue: [m.fxEq], risk: [m.risk], res: [m.res], u: [m.u], pov: [m.pov], rw: [m.rw],
      rPen: [m.rPen], pb: Array(12).fill(m.pb), appr: [], gdp: Array.from({ length: 12 }, (_, i) => 100 * (1 + (-sc.gdpYoy0 / 100) * (11 - i) / 11)),
      debt: [m.debt], gap: [m.gap], C: [m.C], rinf: [m.rinf], ri: [100], rate: [m.rate], og: [m.og]
    };
    S.pub = { pov: sc.pub.pov, u: sc.pub.u, infM: last(S.h.infM), gdpYoy: sc.gdpYoy0 };
    updateApproval(S, true);
    S.h.appr.push(S.appr);
    S.base = { inf: AR.inflYoy(S), pov: m.pov };
    news(S, 'Asumís la Presidencia. La inflación del último mes fue de ' + last(S.h.infM).toFixed(1) + '% mensual.', 'INDEC');
    drawEvents(S);
    return S;
  };

  const riskOf = C => Math.round(450 + (100 - C) * 18 + Math.max(0, 12 - C) * 150);
  function news(S, txt, tag) { S.news.unshift({ t: S.t, txt, tag: tag || 'País' }); if (S.news.length > 60) S.news.length = 60; }
  AR.news = news;

  /* ---------- relaciones y Congreso ---------- */
  function relTarget(S, pid) {
    if (pid === S.party) return 92;
    const a = AR.parties[S.party], b = AR.parties[pid];
    let r = 58 - 30 * dist(a, b);
    if (AR.family[S.party] && AR.family[S.party] === AR.family[pid]) r += 14;
    if (b.fed) r += 6;
    if (b.eco <= -0.95) r -= 6;
    const w = (b.fed || b.cash) ? 0.3 : 0.12;
    return clamp(r + w * ((S.appr || 45) - 45) + relEff(S, pid), 4, 96);
  }
  const phi = x => { const t = 1 / (1 + 0.2316419 * Math.abs(x)); const d = 0.3989423 * Math.exp(-x * x / 2); const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return x > 0 ? 1 - p : p; };
  function support(S, pid, p, from, to) {
    const a = AR.parties[pid], A0 = p.levels[from].pos, B0 = p.levels[to].pos;
    const d0 = Math.hypot(a.eco - (A0[0] || 0), 0.5 * (a.soc - (A0[1] || 0)));
    const d1 = Math.hypot(a.eco - (B0[0] || 0), 0.5 * (a.soc - (B0[1] || 0)));
    let s = 2.0 * (d0 - d1) + (S.rel[pid] - 50) / 30;
    if (pid === S.party) s += 2.5;
    return 1 / (1 + Math.exp(-1.8 * s));
  }
  AR.forecast = function (S, pid, to) {
    const p = AR.pol(pid), from = S.pol[pid].cur, out = {}, sup = {};
    PK().forEach(k => { sup[k] = support(S, k, p, from, to); });
    for (const ch of ['dip', 'sen']) {
      const C = AR.CHAMBER[ch];
      let mu = 0, v = 0;
      PK().forEach(k => { const n = S.seats[k][ch]; mu += n * sup[k]; v += n * n * sup[k] * (1 - sup[k]); });
      const sd = 0.5 * Math.sqrt(v) + 3;
      out[ch] = { yes: Math.round(mu), need: C.need, total: C.total, p: phi((mu - C.need + 0.5) / sd) };
    }
    out.p = out.dip.p * out.sen.p;
    out.sup = sup;
    return out;
  };
  AR.cost = function (S, pid, to, how) {
    const p = AR.pol(pid), from = S.pol[pid].cur;
    const gv = AR.parties[S.party];
    const A0 = p.levels[from].pos, B0 = p.levels[to].pos;
    const d0 = Math.hypot(gv.eco - (A0[0] || 0), 0.5 * (gv.soc - (A0[1] || 0)));
    const d1 = Math.hypot(gv.eco - (B0[0] || 0), 0.5 * (gv.soc - (B0[1] || 0)));
    const align = clamp((d0 - d1) / 1.0, -1, 1);
    let c = p.cost * (1 + 0.3 * (Math.abs(to - from) - 1)) * (1 - 0.25 * align);
    if (how === 'dnu') c *= 1.6;
    return Math.max(1, Math.round(c * 10) / 10);
  };
  AR.routes = function (S, pid, to) {
    const p = AR.pol(pid), lv = p.levels[to], how = lv.how || p.how, r = [];
    if (how === 'admin') r.push('admin');
    else { r.push('ley'); if (p.dnu || lv.dnu) r.push('dnu'); }
    return r;
  };
  // Votación nominal por bloque, coherente con el resultado sorteado
  function tally(S, f, passed) {
    const out = { passed };
    for (const ch of ['dip', 'sen']) {
      const by = {}; let yes = 0;
      PK().forEach(k => { const n = S.seats[k][ch], y = Math.round(n * f.sup[k]); by[k] = [y, n - y]; yes += y; });
      out[ch] = { by, yes, need: AR.CHAMBER[ch].need, total: AR.CHAMBER[ch].total };
    }
    const order = PK().slice().sort((a, b) => f.sup[b] - f.sup[a]);
    const move = (ch, target) => {
      const v = out[ch]; let guard = 400;
      while (v.yes !== target && guard--) {
        const up = v.yes < target;
        const k = (up ? order : order.slice().reverse()).find(x => (up ? v.by[x][1] : v.by[x][0]) > 0);
        if (!k) break;
        v.by[k][up ? 0 : 1]++; v.by[k][up ? 1 : 0]--; v.yes += up ? 1 : -1;
      }
    };
    if (passed) ['dip', 'sen'].forEach(ch => { if (out[ch].yes < out[ch].need) move(ch, out[ch].need + Math.floor(AR.rnd(S) * 6)); });
    else if (out.dip.yes >= out.dip.need && out.sen.yes >= out.sen.need) {
      const ch = f.dip.p < f.sen.p ? 'dip' : 'sen';
      move(ch, out[ch].need - 1 - Math.floor(AR.rnd(S) * 6));
    }
    out.fail = !passed ? (out.dip.yes < out.dip.need ? 'dip' : 'sen') : null;
    return out;
  }

  AR.oppSeats = function (S) {
    const o = { dip: 0, sen: 0 };
    PK().forEach(k => { if (k !== S.party && S.rel[k] < 45) { o.dip += S.seats[k].dip; o.sen += S.seats[k].sen; } });
    return o;
  };
  AR.oppStrength = S => { const o = AR.oppSeats(S); return Math.min(o.dip / AR.CHAMBER.dip.total, o.sen / AR.CHAMBER.sen.total) * 2; };
  AR.oppTwoThirds = S => { const o = AR.oppSeats(S); return o.dip >= AR.CHAMBER.dip.two3 && o.sen >= AR.CHAMBER.sen.two3; };

  AR.proposeChange = function (S, pid, to, route) {
    const p = AR.pol(pid), st = S.pol[pid], from = st.cur, lvTo = p.levels[to];
    if (S.over) return { ok: false, msg: 'La partida terminó.' };
    if ((AR.scenario.hide || []).includes(pid)) return { ok: false, msg: 'No aplica en esta época.' };
    if (to === from) return { ok: false, msg: 'Ese nivel ya está vigente.' };
    if (st.pend) return { ok: false, msg: 'Ya hay un cambio en trámite para esta política.' };
    if (p.levels[from].lock) return { ok: false, msg: 'Decisión irreversible.' };
    const req = lvTo.req && lvTo.req(S);
    if (req) return { ok: false, msg: req };
    const how = route || lvTo.how || p.how;
    const cost = AR.cost(S, pid, to, how);
    if (S.pc < cost) return { ok: false, msg: 'Capital político insuficiente: necesitás ' + cost.toFixed(0) + '.' };
    if (how === 'admin') {
      S.pc -= cost; st.pend = { to, from, eta: S.t + (p.delay || 0), how };
      return { ok: true, kind: 'admin', msg: 'Resolución firmada: "' + p.name + '" cambia en ' + Math.max(1, p.delay || 0) + ' mes(es).' };
    }
    if (how === 'dnu') {
      S.pc -= cost; S.stats.dnu++;
      applyLevel(S, pid, to, 'dnu');
      S.m.inst = clamp(S.m.inst - 3, 0, 100);
      S.dnus.push({ pid, from, to, left: 3 });
      news(S, 'Decreto de Necesidad y Urgencia: ' + p.name + ' → ' + lvTo.label, 'Congreso');
      return { ok: true, kind: 'dnu', msg: 'DNU publicado. Rige ya, pero puede ser rechazado por ambas cámaras o suspendido por la Justicia.' };
    }
    const f = AR.forecast(S, pid, to);
    const passed = AR.rnd(S) < f.p, vote = tally(S, f, passed);
    if (passed) {
      S.pc -= cost; st.pend = { to, from, eta: S.t + (p.delay || 2) + 1, how: 'ley' }; S.stats.laws++;
      PK().forEach(k => { S.rel[k] = clamp(S.rel[k] + (f.sup[k] > 0.5 ? 2 : -1), 0, 100); });
      news(S, 'El Congreso sancionó la reforma de "' + p.name + '".', 'Congreso');
      return { ok: true, kind: 'ley', vote, msg: 'La ley fue aprobada. Entra en vigor en ' + ((p.delay || 2) + 1) + ' meses.' };
    }
    S.pc -= Math.round(cost * 0.4);
    PK().forEach(k => { if (f.sup[k] < 0.5) S.rel[k] = clamp(S.rel[k] - 3, 0, 100); });
    news(S, 'El Congreso rechazó el proyecto sobre "' + p.name + '".', 'Congreso');
    return { ok: false, kind: 'ley', vote, msg: 'El proyecto fue rechazado en el Congreso. Perdiste capital político.' };
  };

  function applyLevel(S, pid, to, how) {
    const p = AR.pol(pid), st = S.pol[pid], lv = p.levels[to], m = S.m;
    st.cur = to; st.pend = null;
    const o = lv.once;
    if (o) {
      if (o.unify) {
        const ce = lv.fx.cepo !== undefined ? lv.fx.cepo : cur(S, 'cepo').fx.cepo;
        const direct = lv.fx.fxmode === 'band' || lv.fx.fxmode === 'peg';
        m.fxOff = direct ? m.fxEq * o.unify : m.fxEq * o.unify / (1 + [0, 0.08, 0.2][ce]);
        if (lv.fx.fxmode === 'band') S.band = { lo: m.fxOff * 0.9, hi: m.fxOff * 1.25, k: 0 };
      }
      if (o.res) m.res += o.res * SCL();
      if (o.Ex) m.E *= o.Ex;
      if (o.cred) S.shCred += o.cred;
      if (o.conf) m.conf = clamp(m.conf + o.conf, 0, 100);
      if (o.tra) m.tra = clamp(m.tra + o.tra, 0, 100);
      if (o.inf) S.shInf.push({ per: o.inf / 3, left: 3 });
      if (o.rPen) m.rPen *= 1 + o.rPen / 100;
      if (o.rSoc) m.rSoc *= 1 + o.rSoc / 100;
    }
    if (lv.fx.fxmode === 'dollar' && !S.dollar) { S.dollar = true; m.fxOff = m.fxEq; m.fxOffLast = m.fxEq; }
    news(S, 'Entra en vigor: ' + p.name + ' → ' + lv.label, 'Gobierno');
  }

  AR.devalue = function (S, pct) {
    if (S.dollar) return { ok: false, msg: 'En dolarización no hay tipo de cambio que ajustar.' };
    const cost = 5; if (S.pc < cost) return { ok: false, msg: 'Capital político insuficiente.' };
    S.pc -= cost; S.m.fxOff *= 1 + pct / 100;
    news(S, 'El Banco Central devalúa el dólar oficial ' + pct + '%: $' + Math.round(S.m.fxOff), 'Mercados');
    S.buffs.push({ g: { sp: -3, jb: -2, sn: -3, cm: -1, fin: 3, agro: 4 }, left: 6, tot: 6 });
    return { ok: true, msg: 'Devaluaste el oficial un ' + pct + '%. El efecto sobre precios se siente en el mes.' };
  };

  AR.negotiate = function (S, pid, kind) {
    if (pid === S.party || (AR.parties[pid].eco <= -0.95 && kind !== 'dialogo')) return { ok: false, msg: 'No disponible con este bloque.' };
    const K = { dialogo: { pc: 4, rel: 7 }, cargos: { pc: 2, rel: 10 }, fondos: { pc: 2, rel: 10 } }[kind];
    if (S.pc < K.pc) return { ok: false, msg: 'Capital político insuficiente.' };
    S.pc -= K.pc; S.rel[pid] = clamp(S.rel[pid] + K.rel, 0, 100);
    if (kind === 'cargos') S.m.tra = clamp(S.m.tra - 1.5, 0, 100);
    if (kind === 'fondos') S.pbSh.push({ amt: -0.1, left: 12 });
    return { ok: true, msg: 'La relación con ' + AR.parties[pid].short + ' mejoró. El efecto se diluye si no lo sostenés.' };
  };

  /* ---------- efectos genéricos (eventos y acciones) ---------- */
  function applyEff(S, e) {
    if (!e) return; const m = S.m;
    if (e.pc) S.pc = clamp(S.pc + e.pc, 0, 100);
    if (e.res) m.res += e.res * SCL();
    if (e.fxo) m.fxOff *= 1 + e.fxo / 100;
    if (e.Ex) m.E *= e.Ex;
    if (e.setpol) applyLevel(S, e.setpol[0], e.setpol[1], 'event');
    if (e.cred) S.shCred += e.cred;
    ['conf', 'inst', 'tra', 'insec', 'edu', 'hea', 'cult'].forEach(k => { if (e[k]) m[k] = clamp(m[k] + e[k], 0, 100); });
    if (e.og) m.og += e.og;
    if (e.inf) S.shInf.push({ per: e.inf / 3, left: 3 });
    if (e.fxj) m.fxEq *= 1 + e.fxj / 100;
    if (e.pb) S.pbSh.push({ amt: e.pb, left: 12 });
    if (e.harv) S.harv.push({ amt: e.harv, left: 8 });
    if (e.g) S.buffs.push({ g: e.g, left: 6, tot: 6 });
    if (e.rel) for (const k in e.rel) if (S.rel[k] !== undefined) S.rel[k] = clamp(S.rel[k] + e.rel[k], 0, 100);
  }

  AR.applyEff = applyEff;

  /* ---------- escalas para aprobación ---------- */
  const gdpYoy = S => (last(S.h.gdp) / S.h.gdp[S.h.gdp.length - 12] - 1) * 100;
  AR.gdpYoy = gdpYoy;
  AR.inflYoy = S => (S.h.infM.slice(-12).reduce((a, x) => a * (1 + x / 100), 1) - 1) * 100;
  AR.scores = function (S) {
    const m = S.m, ce = cur(S, 'cepo').fx.cepo;
    return {
      inf: clamp(1 - m.infM / 4, -2.5, 1), wage: clamp((m.rw - 100) / 20, -1.5, 1.5), pen: clamp((m.rPen - 100) / 20, -1.5, 1.5),
      pwage: clamp((m.rPw - 100) / 20, -1.5, 1.5), emp: clamp((7 - m.u) / 3, -1.5, 1), pov: clamp((42 - m.pov) / 12, -1.5, 1.2),
      gro: clamp(gdpYoy(S) / 4, -1.5, 1.2), sec: clamp((50 - m.insec) / 25, -1.5, 1.5), edu: clamp((m.edu - 50) / 30, -1.5, 1.5),
      hea: clamp((m.hea - 50) / 30, -1.5, 1.5), ins: clamp((m.inst - 50) / 30, -1.5, 1.5), tra: clamp((m.tra - 50) / 30, -1.5, 1.5),
      con: clamp((35 - m.conf) / 30, -1.5, 1), cult: clamp((m.cult - 50) / 30, -1.5, 1.5),
      fxs: clamp(0.7 - 0.85 * ce - Math.min(m.gap, 300) / 200, -1.5, 0.8), risk: clamp((1200 - m.risk) / 600, -1.5, 1.2)
    };
  };
  const K = 11;
  const buffOf = (S, gid) => sum(S.buffs.map(b => (b.g[gid] || 0) * (b.left / b.tot)));
  const honey = S => (S.t < 9 ? (AR.scenario.honey === undefined ? 14 : AR.scenario.honey) * (1 - S.t / 9) : 0);
  function groupTarget(S, grp, sc) {
    let s = 0; for (const k in grp.w) s += grp.w[k] * sc[k];
    return 45 + 16 * grp.aff[S.party] + K * s + gEff(S, grp.id) + buffOf(S, grp.id) + honey(S);
  }
  function updateApproval(S, instant) {
    const sc = AR.scores(S); let tot = 0, ws = 0;
    for (const grp of AR.groups) {
      const tg = clamp(groupTarget(S, grp, sc), 3, 97);
      S.A[grp.id] = instant || S.A[grp.id] === undefined ? tg : S.A[grp.id] + 0.25 * (tg - S.A[grp.id]);
      tot += S.A[grp.id] * grp.size; ws += grp.size;
    }
    S.appr = tot / ws;
  }
  AR.groupDrivers = function (S, gid) {
    const grp = AR.groups.find(x => x.id === gid), sc = AR.scores(S), out = [];
    for (const k in grp.w) out.push({ label: AR.scoreLabels[k], val: K * grp.w[k] * sc[k] });
    out.push({ label: 'Medidas de gobierno', val: gEff(S, gid) });
    out.push({ label: 'Afinidad con tu partido', val: 16 * grp.aff[S.party] });
    const b = buffOf(S, gid) + honey(S); if (Math.abs(b) > 0.4) out.push({ label: 'Clima reciente', val: b });
    return out.sort((a, b2) => Math.abs(b2.val) - Math.abs(a.val));
  };

  /* ---------- paso mensual ---------- */
  AR.endTurn = function (S) {
    if (S.over || S.pending.length) return;
    const c = { date: AR.dateOf(S.t), pi1: last(S.h.infM), notes: [] };
    for (const p of AR.policies) { const st = S.pol[p.id]; if (st.pend && st.pend.eta <= S.t) applyLevel(S, p.id, st.pend.to, st.pend.how); }
    stepFx(S, c); stepInflation(S, c); stepReal(S, c); stepFiscal(S, c); stepActivity(S, c); stepReserves(S, c); stepCredibility(S, c); stepSocial(S, c);
    stepPeg(S, c);
    politics(S, c);
    pushHistory(S);
    const prevT = S.t; S.t++;
    publish(S, c);
    checkDnus(S);
    const E = AR.scenario.elections;
    if ((E.midterm || []).includes(prevT)) midterm(S);
    if (E.general === prevT) finalElection(S);
    if (E.end === prevT && !S.over) S.over = { type: 'fin', title: 'Fin del período: balance de tu gobierno', text: 'Las urnas de mitad de camino cierran esta etapa. Es hora de evaluar qué dejaste.', summary: AR.summary(S) };
    checkCollapse(S);
    if (!S.over) drawEvents(S);
  };

  function stepFx(S, c) {
    const m = S.m, fc = cur(S, 'cambio').fx, ce = cur(S, 'cepo').fx.cepo;
    c.mode = fc.fxmode; c.cepo = ce;
    let gfx = 0;
    if (c.mode === 'peg') gfx = clamp(0.10 * c.pi1 - 0.3 + (50 - m.C) * 0.03 - 0.12 * m.trade / SCL() + gauss(S) * 0.5, -2, 40);
    else if (c.mode !== 'dollar') {
      gfx = 0.26 * c.pi1 - 0.3 + (50 - m.C) * 0.04 - 0.14 * clamp(m.rr, -6, 6) - 0.12 * m.trade / SCL() + gauss(S) * 0.8;
      gfx = clamp(gfx, -3, 60);
    }
    m.fxEq *= 1 + gfx / 100;
    const f0 = m.fxOff; let f1 = f0; c.drain = 0;
    if (c.mode === 'crawl') f1 = f0 * (1 + fc.crawl / 100);
    else if (c.mode === 'band') {
      S.band.k++; S.band.lo *= 0.99; S.band.hi *= 1.01;
      const target = m.fxEq / (1 + [0, 0.06, 0.15][ce]);
      f1 = f0 + 0.5 * (clamp(target, S.band.lo, S.band.hi) - f0);
      if (target > S.band.hi) c.drain = Math.min(4, 12 * (target / S.band.hi - 1)) * SCL();
      else if (target < S.band.lo) c.drain = -Math.min(1.5, 8 * (S.band.lo / target - 1)) * SCL();
    } else if (c.mode === 'float') {
      f1 = f0 + 0.6 * (m.fxEq / (1 + [0, 0.08, 0.2][ce]) - f0);
    }
    const gapNow = (m.fxEq / f1 - 1) * 100;
    if (c.mode === 'crawl' && gapNow > 140 && m.res < -13 * SCL()) {
      f1 = m.fxEq / 1.5; c.notes.push('El mercado fuerza una devaluación: el BCRA pierde el control del dólar oficial.');
      news(S, 'Devaluación forzada: el oficial salta a $' + Math.round(f1) + ' tras quedarse sin reservas.', 'Mercados');
    }
    if (c.mode === 'crawl' && ce < 2) {
      const gapIfFree = (m.fxEq / f1 - 1) * 100;
      c.drain += 0.010 * Math.max(0, gapIfFree - 5) * [1, 0.55][ce] * SCL();
    } else if (c.mode === 'crawl') c.drain += 0.010 * Math.max(0, gapNow - 5) * 0.18 * SCL();
    else if (c.mode === 'peg') c.drain += 0.02 * Math.max(0, gapNow - 3) * SCL() * (ce === 2 ? 0.3 : 1);
    m.fxOff = f1;
    c.devOff = (f1 / m.fxOffLast - 1) * 100;
    c.gfx = gfx;
    m.gap = Math.max(0, (m.fxEq / f1 - 1) * 100);
  }

  function stepInflation(S, c) {
    const m = S.m;
    const emit = c.mode === 'peg' ? 0 : cur(S, 'emit').fx.emit, ov = cur(S, 'overhang').fx.ov, ctrl = cur(S, 'precios').fx.ctrl;
    m.rate = cur(S, 'tasa').fx.rate;
    const anchor = (AR.scenario.aBase === undefined ? 1.5 : AR.scenario.aBase) + (100 - m.C) * 0.12 + 0.8 * Math.max(0, 20 - m.C);
    const ep = AR.scenario.Epers || 0.65;
    m.E = ep * m.E + (1 - ep) * (0.55 * c.pi1 + 0.45 * anchor);
    m.rr = m.rate / 12 - m.E;
    const interest = m.interest;
    const need = Math.max(0, interest - m.pb);
    const mkt = clamp((1500 - m.risk) / 900, 0, 1), cap = 0.7 + 4.5 * mkt + (cur(S, 'fmi').fx.cred > 0 ? 1.0 : 0);
    const market = Math.min(need, cap), viaBcra = Math.min(emit * need, need - market), short = Math.max(0, need - market - viaBcra);
    c.short = short;
    const baseR = 0.075 * (1 - 0.5 * clamp((c.pi1 - 20) / 60, 0, 1));
    const moneyG = (viaBcra + short) / 12 / baseR + (ov * (m.rate / 12) / 100 / baseR) * 0.4;
    const moneyD = 0.85 * c.pi1 + 0.6;
    m.mg = moneyG;
    c.mp = clamp(0.40 * (moneyG - moneyD), -0.8, 8);
    const supp = ctrl === 2 ? 0.9 + 0.12 * c.pi1 : ctrl === 1 ? 0.35 + 0.04 * c.pi1 : 0;
    m.pent += 0.4 * supp;
    const rel = ctrl === 2 ? 0.02 * m.pent : 0.25 * m.pent;
    m.pent -= rel; c.pentRel = rel;
    let sh = 0; S.shInf.forEach(x => { sh += x.per; x.left--; }); S.shInf = S.shInf.filter(x => x.left > 0);
    let pi;
    if (c.mode === 'dollar') pi = 0.55 * c.pi1 + 0.45 * 0.7 + sh * 0.5;
    else if (c.mode === 'peg') pi = 0.45 * c.pi1 + 0.55 * 1.0 + sh * 0.5 + c.pentRel * 0.3;
    else pi = 0.50 * c.pi1 + 0.30 * m.E + 0.12 * c.devOff + 0.08 * Math.max(0, c.gfx) + c.mp + 0.10 * m.og + sh + lever(S, 'infl') + rel - supp + 0.5 + gauss(S) * 0.25;
    m.infM = clamp(pi, 0.6, 150);
    c.pi = m.infM;
    S.why = c.mode === 'dollar' || c.mode === 'peg' ? { 'Ancla cambiaria': m.infM } : {
      'Inercia': 0.5 * c.pi1, 'Expectativas': 0.3 * m.E, 'Dólar': 0.12 * c.devOff + 0.08 * Math.max(0, c.gfx), 'Emisión': c.mp,
      'Demanda': 0.1 * m.og, 'Tarifas y shocks': sh + lever(S, 'infl') + rel, 'Controles de precios': -supp
    };
  }

  function stepReal(S, c) {
    const m = S.m, h = S.h.infM, n = h.length, pi = m.infM;
    const lag = k => h[Math.max(0, n - k)], cap = x => Math.min(x, 1.1 * pi + 2);
    const pr = cur(S, 'jubilaciones').fx;
    const adjPen = cap(pr.kPen * 0.5 * (lag(pr.lag) + lag(pr.lag + 1))) + pr.extra;
    m.rPen *= (1 + adjPen / 100) / (1 + pi / 100);
    m.rPw *= (1 + cap(cur(S, 'paritarias_pub').fx.kPw * (0.7 * c.pi1 + 0.3 * lag(2))) / 100) / (1 + pi / 100);
    m.rSoc *= (1 + cap(cur(S, 'asistencia').fx.kSoc * c.pi1) / 100) / (1 + pi / 100);
    m.rProv *= (1 + cap(cur(S, 'transferencias').fx.kProv * c.pi1) / 100) / (1 + pi / 100);
    const wN = cap(cur(S, 'paritarias').fx.kW * (0.6 * c.pi1 + 0.4 * lag(2))) + 0.12 * m.og + 0.04 * Math.max(0, 100 - m.rw);
    m.rw *= (1 + wN / 100) / (1 + pi / 100);
    const iN = cap(cur(S, 'salario_min').fx.kMin * (0.5 * c.pi1 + 0.5 * lag(2)) * 0.9) + 0.5 * m.og + 0.03 * Math.max(0, 100 - m.rinf);
    m.rinf *= (1 + iN / 100) / (1 + pi / 100);
    m.rer *= (1 + c.devOff / 100) / (1 + pi / 100) * 1.003;
    m.rer = clamp(m.rer, 40, 400);
  }

  function stepFiscal(S, c) {
    const m = S.m;
    const spend = (7.6 * m.rPen + 4.0 * m.rPw + 2.2 * m.rSoc + 2.4 * m.rProv) / last(S.h.gdp);
    let sh = 0; S.pbSh.forEach(x => { sh += x.amt; x.left--; }); S.pbSh = S.pbSh.filter(x => x.left > 0);
    const tanzi = -0.06 * (clamp(m.infM, 0, 30) - clamp(m.b.inf, 0, 30)) - 0.03 * (Math.max(0, m.infM - 30) - Math.max(0, m.b.inf - 30));
    const fxT = 0.012 * clamp(m.rer - 100, -50, 120);
    let pb = m.pb0 + lever(S, 'fisc') + (16.2 - spend) + 0.10 * m.og + tanzi + fxT + sh;
    if (c.short > 0.3) pb -= 0;
    m.pb = clamp(pb, -12, 8);
    m.interest = Math.max(0.6, m.b.interest + 0.02 * (m.debt - m.b.debt) + 0.0005 * (m.risk - m.b.risk));
    const ng = m.infM + (c.growthPrev || 0.2);
    m.debt = clamp(m.debt + (-m.pb + m.interest) / 12 + m.usd * m.debt * ((c.gfx || 0) - ng) / 100, 20, 250);
  }
  const gdp0 = S => S.h.gdp[S.h.gdp.length - 1] / 100;

  function stepActivity(S, c) {
    const m = S.m;
    const pbS = mean(S.h.pb.concat([m.pb]), 6), pbP = mean(S.h.pb.slice(-11, -5), 6);
    const dpb = clamp(pbS - pbP, -4, 6);
    const hv = sum(S.harv.map(x => x.amt)); S.harv.forEach(x => x.left--); S.harv = S.harv.filter(x => x.left > 0);
    c.hv = hv;
    const tgt = lever(S, 'og') - 0.45 * dpb - 0.5 * clamp(m.rr, -6, 6) + 0.05 * (m.C - (AR.scenario.cRef || 45)) + 0.012 * clamp(m.rer - 100, -40, 80)
      - 0.15 * Math.max(0, m.infM - 6) - clamp(0.1 * Math.max(0, -m.res / SCL() - 5), 0, 3) - 0.04 * Math.max(0, 25 - m.C) + 4 * hv - (c.mode === 'dollar' ? 0.3 : 0) + 0.03 * (60 - m.conf) * 0;
    const og0 = m.og; m.og = clamp(0.7 * m.og + 0.3 * tgt + gauss(S) * 0.08, -12, 8);
    c.growth = 0.20 + (m.og - og0);
    c.growthPrev = c.growth;
    S.h.gdp.push(last(S.h.gdp) * (1 + c.growth / 100));
    m.u = clamp(m.u - 0.45 * (m.og - og0) + 0.04 * ((AR.scenario.nairu || 6) + lever(S, 'unemp') - m.u), 3, 30);
  }

  function stepReserves(S, c) {
    const m = S.m, d = c.date, rerD = m.rer - 100, hv = c.hv || 0, k = SCL(), sc = AR.scenario;
    const tr = sc.trade || { X: 6.2, M: 6.3 }, ext = sc.ext || { bond: 4.2, ds: 0.35 };
    const X = tr.X * SEAS[d.m] * (1 + 0.0025 * S.t) * (1 + hv) * (1 + clamp(0.003 * rerD, -0.3, 0.3)) * (1 + lever(S, 'expo') / 100);
    const M = tr.M * (1 + 0.03 * m.og) * (1 - clamp(0.0035 * rerD, -0.3, 0.3)) * clamp(1 + 0.012 * Math.min(0, m.res / k + 8), 0.55, 1) * (1 + lever(S, 'impo') / 100);
    const trade = X - M;
    const absorb = { crawl: 1, band: 0.6, float: 0, dollar: 0.8, peg: 1 }[c.mode];
    const carry = (c.cepo < 2 && m.rr > 0 && c.mode !== 'dollar') ? 0.5 * Math.min(m.rr, 3) * k : 0;
    let run = 0;
    if (sc.runRisk && cur(S, 'bancos').fx.bk === 0 && m.C < 40) run = 0.05 * (40 - m.C) * k;
    const inflow = (0.45 + 0.55 * (m.C - 40) / 40 + lever(S, 'fdi')) * k + carry - run;
    const dflt = cur(S, 'deuda').fx.cred < -5;
    const ds = (dflt ? 0.1 * k : ext.ds) + ((d.m === 0 || d.m === 6) && !dflt ? ext.bond : 0);
    m.res = Math.max(-35 * k, m.res + absorb * trade + inflow - ds - c.drain + gauss(S) * 0.15 * k);
    m.trade = trade; c.ds = ds;
  }

  function stepPeg(S, c) {
    const m = S.m;
    if (c.mode !== 'peg') { S.pegBreak = 0; return; }
    S.pegBreak = m.res < -4 * SCL() ? (S.pegBreak || 0) + 1 : 0;
    if (S.pegBreak >= 2) {
      const fl = AR.pol('cambio').levels.findIndex(l => l.fx.fxmode === 'float');
      S.pol.cambio.cur = fl; S.pegBreak = 0; m.fxOff = m.fxEq; S.shCred -= 8;
      m.conf = clamp(m.conf + 15, 0, 100); m.inst = clamp(m.inst - 3, 0, 100);
      news(S, 'Se quiebra la paridad fija: sin reservas, el tipo de cambio pasa a flotar (' + Math.round(m.fxEq) + ').', 'Mercados');
    }
  }

  function stepCredibility(S, c) {
    const m = S.m;
    const pbS = mean(S.h.pb.concat([m.pb]), 6);
    S.shCred *= 0.92;
    S.gv = 100 * sum(PK().map(k => S.seats[k].dip * clamp((S.rel[k] - 35) / 40, 0, 1))) / AR.CHAMBER.dip.total;
    const ct = 45 + 5 * clamp(pbS, -5, 4) - 1.1 * clamp(m.infM - 2, -2, 25) + clamp(m.res / SCL(), -15, 15) - 0.04 * Math.min(m.gap, 200)
      + lever(S, 'cred') + S.shCred + (AR.scenario.cBias || 0) * Math.max(0, 1 - S.t / 30) + 0.12 * (S.appr - 40) + 0.06 * (S.gv - 40) - (c.short > 0.3 ? 4 : 0);
    m.C = clamp(0.85 * m.C + 0.15 * ct, 0, 100);
    m.riskAdj *= 0.95;
    m.risk = Math.max(300, Math.round(riskOf(m.C) + m.riskAdj));
  }

  function stepSocial(S, c) {
    const m = S.m;
    const RI = 0.45 * m.rw + 0.25 * m.rinf + 0.20 * m.rPen + 0.10 * m.rSoc;
    c.ri = RI;
    const b = m.b;
    const Pstar = b.pov + (AR.scenario.povSlope || 1.5) * (b.RI - RI) + 1.0 * (m.u - b.u) + 0.45 * (clamp(m.infM, 0, 30) - clamp(b.inf, 0, 30));
    m.pov = clamp(m.pov + 0.30 * (Pstar - m.pov), AR.scenario.povMin || 22, 78);
    m.ind = m.pov * (b.ind / b.pov);
    m.gini += 0.2 * (b.gini + 0.0016 * (m.pov - b.pov) - m.gini);
    m.insec = clamp(m.insec + 0.08 * (b.insec + 0.25 * (m.pov - b.pov) + lever(S, 'insec') + 0.1 * (m.u - b.u) - m.insec), 5, 98);
    const uAvg = (S.A.sn + S.A.mov + S.A.uni + S.A.pu + S.A.jb) / 5;
    m.conf = clamp(0.75 * m.conf + 0.25 * (15 + 0.45 * (60 - uAvg) + lever(S, 'conf') * 1.0 + 20 * clamp((m.infM - 8) / 20, 0, 1)), 0, 100);
    m.edu += 0.05 * (b.edu + lever(S, 'edu') - m.edu);
    m.hea += 0.05 * (b.hea + lever(S, 'hea') - m.hea);
    m.cult += 0.05 * (b.cult + lever(S, 'cult') - m.cult);
    m.inst += 0.06 * (b.inst + lever(S, 'inst') + 0.1 * (m.tra - 50) - m.inst);
    m.tra += 0.06 * (b.tra + lever(S, 'transp') - m.tra);
    ['edu', 'hea', 'cult', 'inst', 'tra'].forEach(k => { m[k] = clamp(m[k], 0, 100); });
    m.fxOffLast = m.fxOff;
  }

  function politics(S, c) {
    S.buffs.forEach(b => { b.left--; }); S.buffs = S.buffs.filter(b => b.left > 0);
    updateApproval(S, false);
    S.pc = clamp(S.pc + clamp(3.5 + 0.10 * (S.appr - 35), 1.5, 8) * (S.diffK || 1), 0, 100);
    PK().forEach(k => { S.rel[k] += 0.12 * (relTarget(S, k) - S.rel[k]); S.rel[k] = clamp(S.rel[k], 0, 100); });
  }

  function pushHistory(S) {
    const m = S.m, H = S.h;
    H.infM.push(m.infM); H.fxOff.push(m.fxOff); H.fxBlue.push(m.fxEq); H.risk.push(m.risk); H.res.push(m.res); H.u.push(m.u); H.pov.push(m.pov);
    H.rw.push(m.rw); H.rPen.push(m.rPen); H.pb.push(m.pb); H.appr.push(S.appr); H.debt.push(m.debt); H.gap.push(m.gap); H.C.push(m.C);
    H.rinf.push(m.rinf); H.ri.push(0.45 * m.rw + 0.25 * m.rinf + 0.20 * m.rPen + 0.10 * m.rSoc); H.rate.push(m.rate); H.og.push(m.og);
  }

  function publish(S, c) {
    const m = S.m, d = AR.dateOf(S.t), prev = AR.dateOf(S.t - 1);
    S.pub.infM = m.infM;
    news(S, 'INDEC: la inflación de ' + ML[prev.m] + ' fue ' + m.infM.toFixed(1) + '% (interanual ' + AR.inflYoy(S).toFixed(0) + '%).', 'INDEC');
    S.pub.gdpYoy = gdpYoy(S);
    if ([2, 5, 8, 11].includes(d.m)) { S.pub.u = mean(S.h.u, 3); news(S, 'INDEC: la desocupación del trimestre fue ' + S.pub.u.toFixed(1) + '%.', 'INDEC'); }
    if (d.m === 2 || d.m === 8) { S.pub.pov = mean(S.h.pov, 6); news(S, 'INDEC: la pobreza del semestre fue ' + S.pub.pov.toFixed(1) + '% de las personas.', 'INDEC'); }
    if (c.devOff > 12) news(S, 'El dólar oficial subió ' + c.devOff.toFixed(0) + '% en el mes y cerró en $' + Math.round(m.fxOff) + '.', 'Mercados');
    if (m.risk < 1000 && last(S.h.risk, 2) >= 1000) news(S, 'El riesgo país perfora los 1.000 puntos.', 'Mercados');
    if (m.res > 0 && last(S.h.res, 2) <= 0) news(S, 'Las reservas netas vuelven a terreno positivo.', 'Mercados');
    c.notes.forEach(x => news(S, x, 'Mercados'));
  }

  function checkDnus(S) {
    S.dnus.forEach(x => {
      x.left--;
      const f = AR.forecast(S, x.pid, x.to);
      const p = AR.pol(x.pid);
      const rej = (1 - f.dip.p) * (1 - f.sen.p);
      const court = 0.06 * (1 - S.m.inst / 100) * (AR.pol(x.pid).levels[x.to].once ? 1.4 : 1);
      if (AR.rnd(S) < 0.35 * rej * 1 + court) {
        S.pol[x.pid].cur = x.from; x.left = 0;
        S.m.inst = clamp(S.m.inst + 2, 0, 100); S.pc = clamp(S.pc - 4, 0, 100);
        news(S, 'El DNU sobre "' + p.name + '" fue derogado por el Congreso o suspendido por la Justicia. Se vuelve al régimen anterior.', 'Congreso');
      }
    });
    S.dnus = S.dnus.filter(x => x.left > 0);
  }

  function checkCollapse(S) {
    S.low = S.appr < 14 ? S.low + 1 : 0;
    S.hyper = (S.m.infM > 55 && S.t > (AR.scenario.hyperGrace || 0)) ? S.hyper + 1 : 0;
    if (S.hyper >= 2) S.over = { type: 'caida', title: 'Hiperinflación: caída del gobierno', text: 'Con la inflación fuera de control, saqueos y un Congreso en rebelión, el Presidente entrega el mando de manera anticipada, como en 1989. Apenas ' + S.t + ' meses de gestión.' };
    else if (S.low >= 3 || (S.m.conf > 92 && S.appr < 22)) S.over = { type: 'caida', title: 'Estallido social: renuncia del Presidente', text: 'La aprobación se derrumba y las calles se llenan, como el 19 y 20 de diciembre de 2001. El Presidente renuncia y la Asamblea Legislativa designa un sucesor.' };
    if (S.over) S.over.summary = AR.summary(S);
  }

  /* ---------- elecciones ---------- */
  AR.shares = function (S) {
    const tot = {}; PK().forEach(k => { tot[k] = 0; }); let ws = 0;
    for (const grp of AR.groups) {
      const u = {}; let z = 0;
      PK().forEach(k => {
        u[k] = k === S.party ? 1.3 + 3.0 * (S.A[grp.id] - 50) / 50 + 0.6 * grp.aff[k] : 1.1 * grp.aff[k];
        if (k === 'PROV') u[k] -= 0.6;
        u[k] = Math.exp(u[k]); z += u[k];
      });
      PK().forEach(k => { tot[k] += grp.size * u[k] / z; });
      ws += grp.size;
    }
    const out = {}; PK().forEach(k => { out[k] = 100 * tot[k] / ws; });
    return out;
  };
  function alloc(total, shares) {
    const raw = PK().map(k => [k, shares[k] * total]); const out = {}; let used = 0;
    raw.forEach(([k, v]) => { out[k] = Math.floor(v); used += out[k]; });
    raw.map(([k, v]) => [k, v - Math.floor(v)]).sort((a, b) => b[1] - a[1]).slice(0, total - used).forEach(([k]) => { out[k]++; });
    return out;
  }
  function midterm(S) {
    const sh = AR.shares(S), z = sum(PK().map(k => sh[k]));
    const before = JSON.parse(JSON.stringify(S.seats));
    for (const ch of ['dip', 'sen']) {
      const C = AR.CHAMBER[ch], f = C.renew / C.total;
      const keep = {}; PK().forEach(k => { keep[k] = before[k][ch] * (1 - f); });
      const share = {}; PK().forEach(k => { share[k] = sh[k] / z; });
      const fresh = alloc(Math.round(C.total * f), share);
      const mix = {}; PK().forEach(k => { mix[k] = keep[k] + fresh[k]; });
      const fin = alloc(C.total, Object.fromEntries(PK().map(k => [k, mix[k] / C.total])));
      PK().forEach(k => { S.seats[k][ch] = fin[k]; });
    }
    S.elect = { kind: 'midterm', shares: sh, before, after: JSON.parse(JSON.stringify(S.seats)) };
    S.pending.unshift('__elect');
    news(S, 'Elecciones legislativas: ' + AR.parties[S.party].short + ' obtuvo ' + sh[S.party].toFixed(1) + '% de los votos.', 'Elecciones');
    S.shCred += sh[S.party] > 33 ? 5 : -6;
  }
  function finalElection(S) {
    const sh = AR.shares(S), arr = PK().map(k => [k, sh[k]]).sort((a, b) => b[1] - a[1]);
    const gv = S.party; let winner, round = 1, rs = null;
    const top = arr[0], sec = arr[1];
    if (top[1] >= 45 || (top[1] >= 40 && top[1] - sec[1] >= 10)) winner = top[0];
    else {
      round = 2; const a = top[0], b = sec[0]; const A = AR.parties[a], B = AR.parties[b];
      let va = top[1], vb = sec[1];
      arr.slice(2).forEach(([k, v]) => {
        const P = AR.parties[k]; let wa = Math.exp(-1.5 * dist(P, A)), wb = Math.exp(-1.5 * dist(P, B));
        if (a === gv) wa *= Math.exp((S.appr - 50) / 18); if (b === gv) wb *= Math.exp((S.appr - 50) / 18);
        va += v * 0.85 * wa / (wa + wb); vb += v * 0.85 * wb / (wa + wb);
      });
      const z = va + vb; rs = { [a]: 100 * va / z, [b]: 100 * vb / z }; winner = va > vb ? a : b;
    }
    S.elect = { kind: 'general', shares: sh, round, runoff: rs, winner, reelected: winner === gv };
    news(S, 'Elecciones presidenciales: ganó ' + AR.parties[winner].name + (round === 2 ? ' en el balotaje.' : ' en primera vuelta.'), 'Elecciones');
    S.pending = ['__elect'];
    S.over = { type: winner === gv ? 'reeleccion' : 'derrota', title: winner === gv ? 'Reelección: el pueblo renueva tu mandato' : 'Fin del ciclo: el poder cambia de manos', text: '', summary: AR.summary(S) };
  }

  /* ---------- eventos ---------- */
  function calMatch(ev, S) {
    const d = AR.dateOf(S.t), key = d.y + '-' + String(d.m + 1).padStart(2, '0');
    return (ev.cal && ev.cal.includes(key)) || (ev.yearly && ev.yearly.includes(d.m) && S.t > 0);
  }
  function drawEvents(S) {
    const sched = [], rand = [];
    for (const ev of AR.events) {
      if (ev.scn && !ev.scn.includes(S.scn)) continue;
      if (ev.cal || ev.yearly) { if (calMatch(ev, S) && (!ev.when || ev.when(S))) sched.push(ev); continue; }
      const cd = ev.cd || 6;
      if (S.evLast[ev.id] !== undefined && S.t - S.evLast[ev.id] < cd) continue;
      const w = ev.w ? ev.w(S) : 0;
      if (S.t >= 2 && w > 0 && AR.rnd(S) < w) rand.push(ev);
    }
    const pick = sched.concat(rand.slice(0, 2));
    pick.forEach(ev => { S.evLast[ev.id] = S.t; if (ev.init) ev.init(S); S.pending.push(ev.id); });
  }
  AR.eventById = id => AR.events.find(e => e.id === id);
  AR.eventText = (S, ev) => (typeof ev.text === 'function' ? ev.text(S) : ev.text);
  AR.resolveEvent = function (S, ci) {
    const id = S.pending[0], ev = AR.eventById(id); if (!ev) { S.pending.shift(); return ''; }
    const ch = ev.choices[ci];
    let e = typeof ch.e === 'function' ? ch.e(S) : ch.e, msg = ch.t;
    if (ch.veto) {
      if (AR.oppTwoThirds(S)) { const alt = ev.choices[0]; e = typeof alt.e === 'function' ? alt.e(S) : alt.e; msg = 'El Congreso insistió con los dos tercios y el veto fue superado.'; S.stats.vetos++; }
      else { msg = 'El veto se sostuvo: la oposición no reunió los dos tercios.'; S.stats.vetos++; }
    }
    applyEff(S, e);
    updateApproval(S, false);
    news(S, ev.title + ': ' + msg, 'Gobierno');
    S.pending.shift();
    return msg;
  };
  AR.ackElection = function (S) { if (S.pending[0] === '__elect') S.pending.shift(); };

  /* ---------- resumen final ---------- */
  AR.summary = function (S) {
    const m = S.m, H = S.h, yoy = AR.inflYoy(S), g = (last(H.gdp) / 100 - 1) * 100;
    const avgInf = mean(H.infM, Math.min(S.t, 24));
    const items = {
      infYoy: yoy, pov: m.pov, u: m.u, gdp: g, res: m.res, risk: m.risk, rw: m.rw, rPen: m.rPen, debt: m.debt, inst: m.inst, appr: S.appr, avgInf, months: S.t
    };
    let score = 50;
    const par = AR.scenario.par || {}, bInf = par.inf !== undefined ? par.inf : S.base.inf, bPov = par.pov !== undefined ? par.pov : S.base.pov;
    score += clamp(14 * Math.log((bInf + 100) / (yoy + 100)), -25, 22); score += clamp((bPov - m.pov) / 1.2, -18, 15); score += clamp(g / 1.2, -10, 10);
    score += clamp((m.rw - 100) / 3, -8, 8) + clamp((m.inst - 50) / 5, -6, 6) + clamp((S.appr - 40) / 5, -6, 8) + clamp(m.res / (3 * SCL()), -6, 6);
    if (S.over && S.over.type === 'caida') score -= 25;
    items.score = Math.round(clamp(score, 0, 100)); items.base = S.base;
    const arch = [
      { k: 'Alfonsín 1983-1989', test: yoy > 150 || m.infM > 40, x: 'Democracia restaurada pero con un cierre en alta inflación y entrega anticipada.' },
      { k: 'Convertibilidad de Menem', test: yoy < 20 && m.u > 9, x: 'Estabilidad de precios con costo en el empleo y la deuda.' },
      { k: 'Kirchnerismo 2003-2011', test: g > 12 && m.res > 8, x: 'Crecimiento con superávits gemelos y reservas abundantes.' },
      { k: 'Gradualismo de Macri', test: m.risk > 1100 && m.debt > 90, x: 'Gradualismo con deuda y tropiezo externo.' },
      { k: 'De la Rúa 1999-2001', test: m.res < -5 && m.u > 9, x: 'Dólares escasos, recesión y desconfianza.' },
      { k: 'Gobierno de transformación', test: yoy < 40 && m.res > 0, x: 'Disciplina fiscal con costos sociales y políticos relevantes.' }
    ];
    const fallback = items.score >= 62 ? arch[5] : { k: 'Un ciclo sin rumbo claro', x: 'Los desequilibrios heredados siguieron presentes y la sociedad pagó el costo.' };
    const hit = arch.slice(0, 5).find(a => a.test) || fallback;
    items.archetype = hit.k; items.archetypeText = hit.x;
    items.grade = items.score >= 85 ? 'Histórico' : items.score >= 68 ? 'Exitoso' : items.score >= 46 ? 'Pasable' : items.score >= 30 ? 'Difícil' : 'Desastre';
    return items;
  };
  AR.dateLabelFor = sv => { const st = AR.SC[sv.scn || 'dic2023'].start, i = st.m + sv.t; return MS[((i % 12) + 12) % 12] + ' ' + (st.y + Math.floor(i / 12)); };
  AR.setScenario('dic2023');
})(typeof window !== 'undefined' ? window : globalThis);
