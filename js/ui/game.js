/* Interfaz principal: HUD, tablero estilo Democracy, paneles laterales y pantallas */
(function (g) {
  'use strict';
  const AR = g.AR, ART = AR.art, SFX = AR.sfx, $ = id => document.getElementById(id);
  const SAVE = 'ar-sim-save-v1';
  const U = AR.ui = { S: null, scn: null, panel: null, sel: {}, route: {}, screen: null, chart: 'infM', busy: false, pos: null, rev: null };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fmt = (x, d) => (x === undefined || isNaN(x) ? '-' : Number(x).toLocaleString('es-AR', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }));
  const sgn = (x, d) => (x > 0 ? '+' : '') + fmt(x, d);
  const last = (a, n) => a[a.length - (n || 1)];
  U.fmt = fmt; U.sgn = sgn;
  U.lab = l => l.label.replace(/ \(vigente\)/, '').replace(/[;,] vigente\)/, ')').replace(/\(vigente\)/, '').trim();
  U.save = () => { try { localStorage.setItem(SAVE, JSON.stringify(U.S)); } catch (e) { /* sin almacenamiento */ } };
  U.load = () => { try { const o = JSON.parse(localStorage.getItem(SAVE) || 'null'); return o && o.ver === 2 ? o : null; } catch (e) { return null; } };
  U.clear = () => { try { localStorage.removeItem(SAVE); } catch (e) { /* nada */ } };
  const GSHORT = { cm: 'Clase media', sp: 'Sectores populares', jb: 'Jubilados', pu: 'Estatales', sn: 'Sindicatos', inf: 'Informales', pym: 'PyMEs', ind: 'Industria', agro: 'Campo', fin: 'Mercados', jov: 'Jóvenes', uni: 'Universidad', int: 'Interior', rel: 'Religiosos', mov: 'Org. sociales' };
  U.gshort = GSHORT;
  const IND = ART.indicators, INDM = Object.fromEntries(IND.map(d => [d.id, d]));
  const IND2SC = { infl: 'inf', salario: 'wage', jubilacion: 'pen', desempleo: 'emp', pobreza: 'pov', pbi: 'gro', inseguridad: 'sec', educacion: 'edu', salud: 'hea', instituciones: 'ins', conflicto: 'con', dolar: 'fxs', riesgo: 'risk' };
  const SC2IND = Object.assign(Object.fromEntries(Object.entries(IND2SC).map(([a, b]) => [b, a])), { pwage: 'salario', tra: 'instituciones' });
  U.SC2IND = SC2IND;
  const hueOf = t => Math.round((clamp(t, -1, 1) + 1) * 60);
  U.hueOf = hueOf;
  const UPGOOD = { infl: false, reservas: true, riesgo: false, deficit: true, pbi: true, desempleo: false, pobreza: false, salario: true, jubilacion: true };
  const visible = () => AR.policies.filter(p => !(AR.scenario.hide || []).includes(p.id));

  /* ---------------- disposición del tablero ---------------- */
  U.layout = function () {
    const P = { pol: {}, ind: {}, grp: {}, box: [] };
    AR.groups.forEach((gr, i) => { P.grp[gr.id] = { x: 4.2 + i * (91.6 / (AR.groups.length - 1)), y: 9.5 }; });
    IND.forEach((d, i) => { P.ind[d.id] = { x: 34 + (i % 5) * 8, y: 33 + Math.floor(i / 5) * 21 }; });
    const cols = [['mon', 'fis', 'gas', 'tra'], ['pro', 'seg', 'soc', 'ins']];
    cols.forEach((col, ci) => col.forEach((cat, ri) => {
      const x0 = ci ? 73 : 1, y0 = 21.5 + ri * 19.6;
      P.box.push({ cat, x: x0, y: y0, w: 26, h: 18.6 });
      visible().filter(p => p.cat === cat).forEach((p, k) => { P.pol[p.id] = { x: x0 + 2.9 + (k % 5) * 5.05, y: y0 + 6.6 + Math.floor(k / 5) * 7.3 }; });
    }));
    // índice inverso: indicador -> políticas que lo afectan
    U.rev = {}; U.lnk = {};
    visible().forEach(p => { const l = ART.links(p); U.lnk[p.id] = l; l.ind.forEach(k => { (U.rev[k] = U.rev[k] || []).push(p.id); }); });
    U.pos = P;
  };

  /* ---------------- HUD ---------------- */
  function gauge(v) {
    const a = clamp(v, 0, 100) / 100, len = 125.6;
    return '<svg viewBox="0 0 100 56" class="gauge"><path d="M10 50 A40 40 0 0 1 90 50" stroke="#ffffff1a" stroke-width="10" fill="none" stroke-linecap="round"/>' +
      '<path d="M10 50 A40 40 0 0 1 90 50" stroke="hsl(' + hueOf((v - 40) / 20) + ' 75% 52%)" stroke-width="10" fill="none" stroke-linecap="round" stroke-dasharray="' + (a * len) + ' 200"/>' +
      '<text x="50" y="47" text-anchor="middle" font-size="20" font-weight="800" fill="#fff" font-family="Oswald, sans-serif">' + Math.round(v) + '%</text></svg>';
  }
  function hud(S) {
    const sc = AR.scenario, d = AR.dateOf(S.t), MN = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const pa = AR.parties[S.party], prev = last(S.h.appr, 2), tr = S.appr - (prev === undefined ? S.appr : prev);
    const gv = Math.round(S.gv || 0);
    return '<header class="hud">' +
      '<div class="cal"><b>' + MN[d.m] + '</b><span>' + d.y + '</span></div>' +
      '<div class="who">' + ART.emblem(pa, 38) + '<div><b>' + pa.short + '</b><small>' + sc.short + ' · mes ' + Math.min(S.t + 1, sc.months) + '/' + sc.months + '</small></div></div>' +
      '<div class="appr" title="Aprobación del gobierno">' + gauge(S.appr) + '<small>Aprobación <em class="' + (tr >= 0 ? 'up' : 'dn') + '">' + (tr >= 0 ? '▲' : '▼') + fmt(Math.abs(tr), 1) + '</em></small></div>' +
      '<div class="pc" title="Capital político: se gasta al cambiar políticas y se recupera cada mes"><span class="coin">🪙</span><div><b>' + Math.round(S.pc) + '</b><small>Capital político</small><div class="bar"><i style="width:' + S.pc + '%"></i></div></div></div>' +
      '<div class="pc" title="Respaldo en Diputados"><span class="coin">🏛️</span><div><b>' + gv + '</b><small>Gobernabilidad</small><div class="bar"><i style="width:' + gv + '%;background:#74acdf"></i></div></div></div>' +
      '<div class="spacer"></div>' +
      '<nav class="hbtn">' +
      ['congreso:🏛️:Congreso', 'economia:📊:Economía', 'logros:🏆:Logros', 'archivo:📜:Historia', 'menu:⚙️:Menú'].map(x => { const [k, i, l] = x.split(':'); return '<button data-act="screen" data-v="' + k + '" title="' + l + '"><span>' + i + '</span><small>' + l + '</small></button>'; }).join('') +
      '<button data-act="mute" title="Sonido"><span>' + (SFX.cfg.sfx ? '🔊' : '🔇') + '</span><small>Sonido</small></button></nav></header>';
  }

  /* ---------------- tablero ---------------- */
  function board(S) {
    const P = U.pos; let o = '<div class="board-wrap"><div class="board" id="board"><svg id="links" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>';
    o += '<div class="zone-t">👥 La sociedad</div><div class="zone-c">📊 El país</div>';
    P.box.forEach(b => { o += '<div class="cbox" style="left:' + b.x + '%;top:' + b.y + '%;width:' + b.w + '%;height:' + b.h + '%;--c:' + ART.catColor[b.cat] + '"><span>' + ART.catIcon[b.cat] + ' ' + AR.cats[b.cat] + '</span></div>'; });
    visible().forEach(p => {
      const q = P.pol[p.id], st = S.pol[p.id], n = p.levels.length, on = U.panel && U.panel.t === 'pol' && U.panel.id === p.id;
      const pips = p.levels.map((_, i) => '<i class="' + (i === st.cur ? 'c' : '') + (st.pend && st.pend.to === i ? ' p' : '') + '"></i>').join('');
      const dnu = S.dnus.some(d => d.pid === p.id);
      o += '<button class="node pn' + (on ? ' on' : '') + '" data-node="pol:' + p.id + '" data-act="open" data-t="pol" data-v="' + p.id + '" style="left:' + q.x + '%;top:' + q.y + '%;--c:' + ART.catColor[p.cat] + '" aria-label="' + p.name + '">' +
        '<i>' + (ART.polIcon[p.id] || '•') + '</i>' + (st.pend ? '<b class="badge">⏳</b>' : dnu ? '<b class="badge">🖋️</b>' : '') + (n <= 8 ? '<span class="pips">' + pips + '</span>' : '') + '</button>';
    });
    IND.forEach(d => {
      const q = P.ind[d.id], v = d.v(S), t = d.t(v), h = d.h && S.h[d.h], pv = h && h.length > 1 ? h[h.length - 2] : null, cv = h ? last(h) : null;
      let arr = ''; if (pv !== null && cv !== null && Math.abs(cv - pv) > Math.abs(pv) * 0.004 + 1e-9) { const ug = UPGOOD[d.id]; arr = '<b class="tr ' + (ug === undefined ? '' : (cv > pv) === ug ? 'up' : 'dn') + '">' + (cv > pv ? '▲' : '▼') + '</b>'; }
      o += '<button class="node in" data-node="ind:' + d.id + '" data-act="open" data-t="ind" data-v="' + d.id + '" style="left:' + q.x + '%;top:' + q.y + '%;--h:' + hueOf(t) + '"><i>' + d.icon + '</i>' + arr +
        '<em>' + d.f(v, S) + '</em><small>' + d.name + '</small></button>';
    });
    AR.groups.forEach(gr => {
      const q = P.grp[gr.id], a = S.A[gr.id];
      o += '<button class="node gn" data-node="grp:' + gr.id + '" data-act="open" data-t="grp" data-v="' + gr.id + '" style="left:' + q.x + '%;top:' + q.y + '%;--h:' + hueOf((a - 40) / 20) + '">' +
        ART.avatar(gr.id, ART.moodOf(a)) + '<b class="pct">' + Math.round(a) + '%</b><small>' + GSHORT[gr.id] + '</small></button>';
    });
    return o + '</div></div>';
  }

  /* ---------------- líneas de conexión ---------------- */
  const posOf = key => { const [t, id] = key.split(':'); return U.pos[t === 'pol' ? 'pol' : t === 'ind' ? 'ind' : 'grp'][id]; };
  function drawLinks(spec) {
    const svg = $('links'); if (!svg) return;
    svg.innerHTML = spec.map(l => {
      const a = posOf(l.a), b = posOf(l.b); if (!a || !b) return '';
      const mx = (a.x + b.x) / 2 + (50 - (a.x + b.x) / 2) * 0.15, my = (a.y + b.y) / 2 - 6;
      return '<path d="M' + a.x + ' ' + a.y + ' Q' + mx + ' ' + my + ' ' + b.x + ' ' + b.y + '" stroke="' + l.c + '" stroke-width="' + l.w + '" class="ln' + (l.flow ? ' flow' : '') + '" vector-effect="non-scaling-stroke"/>';
    }).join('');
    const brd = $('board'); if (!brd) return;
    brd.classList.toggle('focus', spec.length > 0);
    brd.querySelectorAll('.hl').forEach(n => n.classList.remove('hl'));
    const keys = new Set(); spec.forEach(l => { keys.add(l.a); keys.add(l.b); });
    keys.forEach(k => { const n = brd.querySelector('[data-node="' + k + '"]'); if (n) n.classList.add('hl'); });
  }
  const colorOf = v => (v > 0 ? '#22c55e' : '#ef4444');
  const width = v => clamp(1.5 + Math.abs(v) * 0.9, 1.5, 6);
  function linksFor(key) {
    const S = U.S, [t, id] = key.split(':'), out = [];
    if (t === 'pol') {
      const p = AR.pol(id), sel = U.sel[id];
      if (sel !== undefined && sel !== S.pol[id].cur) {
        const e = ART.effects(p, S.pol[id].cur, sel);
        Object.keys(e.ind).forEach(k => out.push({ a: key, b: 'ind:' + k, c: colorOf(e.ind[k]), w: width(e.ind[k]), flow: true }));
        Object.keys(e.grp).forEach(k => out.push({ a: key, b: 'grp:' + k, c: colorOf(e.grp[k]), w: width(e.grp[k] / 3), flow: true }));
      } else {
        const l = U.lnk[id] || { ind: [], grp: [] };
        l.ind.forEach(k => out.push({ a: key, b: 'ind:' + k, c: '#9fc4ea', w: 1.6 }));
        l.grp.forEach(k => out.push({ a: key, b: 'grp:' + k, c: '#9fc4ea88', w: 1.2 }));
      }
    } else if (t === 'ind') {
      (U.rev[id] || []).forEach(p => out.push({ a: 'pol:' + p, b: key, c: '#f6b40e', w: 1.4 }));
      const sk = IND2SC[id];
      if (sk) { const sc = AR.scores(S); AR.groups.forEach(gr => { if ((gr.w[sk] || 0) >= 0.4) out.push({ a: key, b: 'grp:' + gr.id, c: colorOf(sc[sk]), w: 1 + gr.w[sk] * 2 }); }); }
    } else {
      const gr = AR.groups.find(x => x.id === id), sc = AR.scores(S);
      Object.keys(gr.w).forEach(k => { const ik = SC2IND[k]; if (ik && gr.w[k] >= 0.3) out.push({ a: key, b: 'ind:' + ik, c: colorOf(sc[k]), w: 1 + gr.w[k] * 2 }); });
      visible().forEach(p => { const v = (p.levels[S.pol[p.id].cur].g[id] || 0) - (p.levels[p.init].g[id] || 0); if (Math.abs(v) >= 1) out.push({ a: 'pol:' + p.id, b: key, c: colorOf(v), w: width(v / 3) }); });
    }
    return out;
  }
  U.pinLinks = () => { if (U.panel) drawLinks(linksFor(U.panel.t + ':' + U.panel.id)); else drawLinks([]); };

  /* ---------------- paneles laterales ---------------- */
  function effChips(e) {
    const ind = Object.keys(e.ind).sort((a, b) => Math.abs(e.ind[b]) - Math.abs(e.ind[a])).slice(0, 7);
    const grp = Object.keys(e.grp).sort((a, b) => Math.abs(e.grp[b]) - Math.abs(e.grp[a])).slice(0, 8);
    const arrows = v => { const n = Math.abs(v) > 2 ? 3 : Math.abs(v) > 0.8 ? 2 : 1; return (v > 0 ? '▲' : '▼').repeat(n); };
    let o = '';
    if (ind.length) o += '<div class="eff">' + ind.map(k => '<span class="ef ' + (e.ind[k] > 0 ? 'up' : 'dn') + '" title="' + (e.ind[k] > 0 ? 'Mejora' : 'Empeora') + '"><i>' + INDM[k].icon + '</i>' + INDM[k].name + ' <b>' + arrows(e.ind[k]) + '</b></span>').join('') + '</div>';
    if (grp.length) o += '<div class="faces">' + grp.map(k => '<span class="face ' + (e.grp[k] > 0 ? 'up' : 'dn') + '" title="' + GSHORT[k] + '">' + ART.avatar(k, e.grp[k] > 0 ? 1 : -1) + '<b>' + sgn(Math.round(e.grp[k])) + '</b><small>' + GSHORT[k] + '</small></span>').join('') + '</div>';
    return o || '<p class="mut">Sin efectos directos medibles: es una decisión mayormente simbólica.</p>';
  }
  function voteBar(ch, v) {
    const pct = clamp(v.yes / v.total * 100, 0, 100), need = v.need / v.total * 100;
    return '<div class="vbar"><span>' + (ch === 'dip' ? 'Diputados' : 'Senado') + '</span><div class="track"><i style="width:' + pct + '%" class="' + (v.yes >= v.need ? 'ok' : 'no') + '"></i><b style="left:' + need + '%"></b></div><em>' + v.yes + '/' + v.total + '</em></div>';
  }
  function polPanel(S, id) {
    const p = AR.pol(id), st = S.pol[id], sel = U.sel[id] !== undefined ? U.sel[id] : st.cur;
    const levels = p.levels.map((l, i) => '<button class="lvl' + (i === st.cur ? ' cur' : '') + (i === sel ? ' sel' : '') + '" data-act="pick" data-p="' + id + '" data-v="' + i + '"><span class="dot"></span>' + U.lab(l) +
      (i === st.cur ? '<em>ACTUAL</em>' : '') + (st.pend && st.pend.to === i ? '<em class="pe">EN TRÁMITE</em>' : '') + '</button>').join('');
    let act = '';
    if (sel !== st.cur) {
      const routes = AR.routes(S, id, sel), route = routes.includes(U.route[id]) ? U.route[id] : routes[0], cost = AR.cost(S, id, sel, route), can = S.pc >= cost && !st.pend;
      let vote = '';
      if (route !== 'admin') {
        const f = AR.forecast(S, id, sel), pr = Math.round(f.p * 100);
        vote = '<div class="card soft"><h4>🏛️ Pronóstico en el Congreso</h4>' + voteBar('dip', f.dip) + voteBar('sen', f.sen) +
          '<div class="prob ' + (pr >= 60 ? 'ok' : pr >= 35 ? 'mid' : 'no') + '">' + (pr >= 60 ? '👍 Probable' : pr >= 35 ? '🤞 Reñida' : '👎 Muy difícil') + ' · ' + pr + '%</div>' +
          (route === 'dnu' ? '<p class="mut small">Por DNU rige hoy, pero el Congreso puede rechazarlo y la Justicia suspenderlo.</p>' : '') + '</div>';
      }
      const rb = routes.length > 1 ? '<div class="seg">' + routes.map(r => '<button class="' + (r === route ? 'on' : '') + '" data-act="route" data-p="' + id + '" data-v="' + r + '">' + (r === 'ley' ? '📜 Por ley' : '🖋️ Por DNU') + '</button>').join('') + '</div>' : '';
      const verb = route === 'admin' ? '✍️ Firmar decreto' : route === 'dnu' ? '🖋️ Firmar DNU' : '🏛️ Enviar al Congreso';
      act = '<div class="card soft"><h4>Qué cambia</h4>' + effChips(ART.effects(p, st.cur, sel)) + '</div>' + vote + rb +
        '<button class="big ' + (can ? '' : 'dis') + '" data-act="apply" data-p="' + id + '" data-r="' + route + '"' + (can ? '' : ' disabled') + '>' + verb + '<small>🪙 ' + fmt(cost, 1) + ' de capital político' + (st.pend ? ' · ya hay un cambio en trámite' : S.pc < cost ? ' · no alcanza' : '') + '</small></button>';
    } else act = '<p class="hint">👆 Elegí otro nivel para ver qué pasaría.</p>';
    return '<div class="ph" style="--c:' + ART.catColor[p.cat] + '"><div class="bigico">' + (ART.polIcon[id] || '•') + '</div><div><small>' + ART.catIcon[p.cat] + ' ' + AR.cats[p.cat] + ' · ' + (p.how === 'admin' ? 'Decreto' : 'Ley') + '</small><h2>' + p.name + '</h2></div></div>' +
      '<p class="lead">' + p.desc.split('. ')[0] + '.</p><div class="lvls">' + levels + '</div>' + act +
      '<details class="hist"><summary>📜 Contexto histórico</summary><p>' + p.hist + '</p></details>';
  }
  const DRV_ICON = { 'Inflación': '🔥', 'Salario real': '👛', 'Jubilación real': '🧓', 'Salario público': '🏛️', 'Empleo': '🧰', 'Pobreza': '🥣', 'Crecimiento': '📊', 'Seguridad': '🚨', 'Educación': '🎒', 'Salud': '❤️‍🩹', 'Instituciones': '🏛️', 'Transparencia': '🔎', 'Paz social': '📢', 'Vida cultural': '🎭', 'Libertad cambiaria': '💵', 'Riesgo país': '📉', 'Medidas de gobierno': '📋', 'Afinidad con tu partido': '🎗️', 'Clima reciente': '🌡️' };
  U.quote = (S, id) => { const d = AR.groupDrivers(S, id).filter(x => !/Afinidad|Clima/.test(x.label)); const top = d[0]; if (!top) return ''; const q = ART.quotes[top.label]; return q ? q[top.val >= 0 ? 1 : 0] : ''; };
  function grpPanel(S, id) {
    const gr = AR.groups.find(x => x.id === id), a = S.A[id], drv = AR.groupDrivers(S, id).slice(0, 7), mx = Math.max(...drv.map(d => Math.abs(d.val)), 1);
    const party = AR.partyOrder.slice().sort((x, y) => gr.aff[y] - gr.aff[x]).slice(0, 3);
    const pols = visible().map(p => ({ p, v: (p.levels[S.pol[p.id].cur].g[id] || 0) - (p.levels[p.init].g[id] || 0) })).filter(x => Math.abs(x.v) >= 1).sort((x, y) => Math.abs(y.v) - Math.abs(x.v)).slice(0, 6);
    const tot = AR.groups.reduce((s, x) => s + x.size, 0);
    return '<div class="gh" style="--h:' + hueOf((a - 40) / 20) + '"><div class="bigav">' + ART.avatar(id, ART.moodOf(a)) + '</div><div><small>' + fmt(gr.size / tot * 100) + '% del electorado</small><h2>' + gr.name + '</h2><div class="bigpct">' + Math.round(a) + '%<small> te aprueba</small></div></div></div>' +
      '<div class="bubble">“' + U.quote(S, id) + '”</div><p class="lead">' + gr.desc + '</p>' +
      '<div class="card soft"><h4>Qué los mueve hoy</h4>' + drv.map(d => '<div class="drv"><span>' + (DRV_ICON[d.label] || '•') + ' ' + d.label + '</span><div class="dtrack"><i class="' + (d.val >= 0 ? 'up' : 'dn') + '" style="width:' + Math.abs(d.val) / mx * 50 + '%;' + (d.val >= 0 ? 'left:50%' : 'right:50%') + '"></i></div></div>').join('') + '</div>' +
      (pols.length ? '<div class="card soft"><h4>Tus medidas que les importan</h4><div class="minis">' + pols.map(x => '<button class="mini ' + (x.v > 0 ? 'up' : 'dn') + '" data-act="open" data-t="pol" data-v="' + x.p.id + '" title="' + x.p.name + '">' + ART.polIcon[x.p.id] + '<b>' + sgn(Math.round(x.v)) + '</b></button>').join('') + '</div></div>' : '') +
      '<div class="card soft"><h4>A quién votan</h4>' + party.map(k => '<div class="lean">' + ART.emblem(AR.parties[k], 26) + '<span>' + AR.parties[k].short + '</span><div class="track"><i style="width:' + clamp((gr.aff[k] + 1) * 50, 0, 100) + '%;background:' + AR.parties[k].color + '"></i></div></div>').join('') + '</div>';
  }
  U.lineChart = function (arr, color, h) {
    const W = 600, H = h || 200, p = 34; if (!arr || arr.length < 2) return '';
    const mn = Math.min(...arr), mx = Math.max(...arr), r = mx - mn || 1, x = i => p + i / (arr.length - 1) * (W - p - 8), y = v => H - 18 - (v - mn) / r * (H - 34);
    const pts = arr.map((v, i) => x(i).toFixed(1) + ',' + y(v).toFixed(1)).join(' ');
    let ax = ''; for (let k = 0; k <= 3; k++) { const v = mn + r * k / 3, yy = y(v); ax += '<line x1="' + p + '" x2="' + (W - 8) + '" y1="' + yy + '" y2="' + yy + '" stroke="#ffffff14"/><text x="2" y="' + (yy + 4) + '" fill="#8ea3bd" font-size="11">' + fmt(v, r < 10 ? 1 : 0) + '</text>'; }
    const n = arr.length, s = U.S.t - n;
    [0, n - 1].forEach(i => { ax += '<text x="' + x(i) + '" y="' + (H - 3) + '" fill="#8ea3bd" font-size="11" text-anchor="' + (i ? 'end' : 'start') + '">' + AR.dateLabel(s + i) + '</text>'; });
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" class="lchart"><defs><linearGradient id="lg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="' + color + '" stop-opacity=".35"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs>' + ax +
      '<polygon fill="url(#lg)" points="' + x(0) + ',' + (H - 18) + ' ' + pts + ' ' + x(n - 1) + ',' + (H - 18) + '"/><polyline fill="none" stroke="' + color + '" stroke-width="2.6" points="' + pts + '"/></svg>';
  };
  function indPanel(S, id) {
    const d = INDM[id], v = d.v(S), t = d.t(v), hist = d.h ? S.h[d.h] : null;
    let why = '';
    if (id === 'infl' && S.why) {
      const w = Object.entries(S.why).filter(x => Math.abs(x[1]) > 0.05).sort((a, b) => b[1] - a[1]), mx = Math.max(...w.map(x => Math.abs(x[1])), 1);
      why = '<div class="card soft"><h4>¿Por qué la inflación fue ' + d.f(v, S) + '?</h4>' + w.map(([k, val]) => '<div class="drv"><span>' + k + '</span><div class="dtrack"><i class="' + (val > 0 ? 'dn' : 'up') + '" style="width:' + Math.abs(val) / mx * 50 + '%;' + (val >= 0 ? 'left:50%' : 'right:50%') + '"></i></div><em>' + sgn(val, 1) + '</em></div>').join('') + '</div>';
    }
    const pols = (U.rev[id] || []).map(pid => '<button class="mini" data-act="open" data-t="pol" data-v="' + pid + '" title="' + AR.pol(pid).name + '">' + ART.polIcon[pid] + '</button>').join('');
    const sk = IND2SC[id], grps = sk ? AR.groups.filter(gr => (gr.w[sk] || 0) >= 0.4).map(gr => '<button class="mini face" data-act="open" data-t="grp" data-v="' + gr.id + '" title="' + gr.name + '">' + ART.avatar(gr.id, ART.moodOf(S.A[gr.id])) + '</button>').join('') : '';
    return '<div class="ih" style="--h:' + hueOf(t) + '"><div class="bigico">' + d.icon + '</div><div><small>' + (typeof d.sub === 'function' ? d.sub(S) : d.sub) + '</small><h2>' + d.name + '</h2><div class="bigpct">' + d.f(v, S) + '</div></div></div>' +
      (hist ? '<div class="card soft">' + U.lineChart(hist.slice(-36), 'hsl(' + hueOf(t) + ' 70% 55%)') + '</div>' : '') + why +
      (pols ? '<div class="card soft"><h4>Políticas que lo afectan</h4><div class="minis">' + pols + '</div></div>' : '') +
      (grps ? '<div class="card soft"><h4>A quiénes les importa</h4><div class="minis">' + grps + '</div></div>' : '');
  }
  function panel(S) {
    if (!U.panel) return '';
    const P = U.panel, body = P.t === 'pol' ? polPanel(S, P.id) : P.t === 'grp' ? grpPanel(S, P.id) : indPanel(S, P.id);
    return '<aside class="drawer" id="drawer"><button class="x" data-act="close" aria-label="Cerrar">✕</button>' + body + '</aside>';
  }

  /* ---------------- asesor y noticiero ---------------- */
  function advisor(S) {
    const tip = AR.advisor(S); if (!tip) return '';
    const who = tip.who === 'eco' ? 'Ministra de Economía' : 'Jefe de Gabinete';
    const btns = (tip.fx || []).filter(id => U.pos.pol[id]).map(id => '<button class="mini" data-act="open" data-t="pol" data-v="' + id + '" title="' + AR.pol(id).name + '">' + ART.polIcon[id] + '</button>').join('');
    return '<div class="advisor"><div class="advav">' + ART.avatar(tip.who, 0.4) + '</div><div class="advb"><small>' + who + '</small><p>' + tip.t + '</p>' + (btns ? '<div class="minis">' + btns + '</div>' : '') + '</div></div>';
  }
  function ticker(S) {
    const items = S.news.slice(0, 10).map(n => '<span>' + (n.tag === 'Mercados' ? '💹' : n.tag === 'INDEC' ? '📊' : n.tag === 'Congreso' ? '🏛️' : n.tag === 'Elecciones' ? '🗳️' : '📰') + ' ' + n.txt + '</span>').join('<em>•</em>');
    return '<div class="ticker"><b>ÚLTIMO MOMENTO</b><div class="tk"><div class="tkin">' + items + '<em>•</em>' + items + '</div></div></div>';
  }

  /* ---------------- pantallas completas ---------------- */
  function hemicycle(S, ch, votes) {
    const total = AR.CHAMBER[ch].total, rows = total > 100 ? 9 : 5, r0 = 42, dr = (132 - r0) / (rows - 1);
    const radii = Array.from({ length: rows }, (_, i) => r0 + i * dr), sumR = radii.reduce((a, b) => a + b, 0); let pos = [];
    radii.forEach(r => { const n = Math.round(total * r / sumR); for (let k = 0; k < n; k++) { const a = Math.PI - (n === 1 ? 0 : k / (n - 1)) * Math.PI; pos.push({ a, x: 150 + r * Math.cos(a), y: 150 - r * Math.sin(a) }); } });
    pos.sort((A, B) => B.a - A.a); pos = pos.slice(0, total);
    const seq = []; AR.partyOrder.forEach(k => { const v = votes ? votes.by[k] : null; for (let i = 0; i < S.seats[k][ch]; i++) seq.push({ k, yes: v ? i < v[0] : null }); });
    const rad = total > 100 ? 3.5 : 6;
    return '<svg viewBox="0 0 300 160" class="hemi" data-ch="' + ch + '">' + pos.map((p, i) => { const s = seq[i] || { k: AR.partyOrder[0] }; return '<circle class="seat" data-i="' + i + '" cx="' + p.x.toFixed(1) + '" cy="' + p.y.toFixed(1) + '" r="' + rad + '" fill="' + (votes ? '#3a4a5e' : AR.parties[s.k].color) + '" stroke="' + AR.parties[s.k].color + '" stroke-width="' + (votes ? 1.4 : 0) + '" data-y="' + (s.yes ? 1 : 0) + '"/>'; }).join('') + '</svg>';
  }
  U.hemicycle = hemicycle;
  function scrCongreso(S) {
    const tot = AR.CHAMBER, o = AR.oppSeats(S);
    const cards = AR.partyOrder.slice().reverse().map(k => {
      const p = AR.parties[k], rel = S.rel[k], me = k === S.party, hearts = '❤️'.repeat(Math.round(rel / 20)) + '🤍'.repeat(5 - Math.round(rel / 20));
      const btn = me ? '<span class="tag">Tu bloque</span>' : '<button class="sm" data-act="neg" data-p="' + k + '" data-v="dialogo">🗣️ Dialogar <small>4🪙</small></button><button class="sm" data-act="neg" data-p="' + k + '" data-v="cargos">💼 Cargos <small>2🪙</small></button>' + (p.fed || p.cash ? '<button class="sm" data-act="neg" data-p="' + k + '" data-v="fondos">💰 Fondos <small>2🪙</small></button>' : '');
      return '<div class="pcard" style="--c:' + p.color + '">' + ART.emblem(p, 46) + '<div class="pi"><b>' + p.name + '</b><div class="seats"><span>🪑 ' + S.seats[k].dip + ' diputados</span><span>🪑 ' + S.seats[k].sen + ' senadores</span></div><div class="hearts" title="Relación: ' + Math.round(rel) + '/100">' + hearts + '</div></div><div class="pb">' + btn + '</div></div>';
    }).join('');
    return '<h1>🏛️ Congreso de la Nación</h1><div class="hemis"><div><h3>Diputados <small>' + tot.dip.need + ' para aprobar</small></h3>' + hemicycle(S, 'dip') + '</div><div><h3>Senado <small>' + tot.sen.need + ' para aprobar</small></h3>' + hemicycle(S, 'sen') + '</div></div>' +
      '<p class="mut center">Oposición dura: ' + o.dip + ' diputados y ' + o.sen + ' senadores · Para superar un veto hacen falta ' + tot.dip.two3 + ' y ' + tot.sen.two3 + '.</p><div class="pcards">' + cards + '</div>';
  }
  const SERIES = { infM: ['🔥', 'Inflación mensual'], fxOff: ['💵', 'Dólar oficial'], fxBlue: ['💸', 'Dólar libre'], gap: ['↔️', 'Brecha'], risk: ['📉', 'Riesgo país'], res: ['🏦', 'Reservas'], pb: ['🧮', 'Resultado fiscal'], gdp: ['📊', 'PBI real'], u: ['🧰', 'Desocupación'], pov: ['🥣', 'Pobreza'], rw: ['👛', 'Salario real'], rPen: ['🧓', 'Jubilación real'], appr: ['❤️', 'Aprobación'], debt: ['📚', 'Deuda/PBI'], rate: ['📈', 'Tasa'], C: ['🤝', 'Confianza'] };
  function scrEconomia(S) {
    const pills = Object.keys(SERIES).map(k => '<button class="pill ' + (U.chart === k ? 'on' : '') + '" data-act="chart" data-v="' + k + '">' + SERIES[k][0] + ' ' + SERIES[k][1] + '</button>').join('');
    const arr = S.h[U.chart] || [];
    const m = S.m, tiles = [['🔥', 'Inflación interanual', fmt(AR.inflYoy(S)) + '%'], ['📈', 'Tasa de política', fmt(m.rate) + '% TNA'], ['🖨️', 'Base monetaria', sgn(m.mg, 1) + '% mensual'], ['🚢', 'Balanza comercial', 'US$' + sgn(m.trade, 1) + 'B/mes'], ['📚', 'Deuda pública', fmt(m.debt) + '% PBI'], ['⚖️', 'Gini', fmt(m.gini, 3)], ['🍞', 'Indigencia', fmt(m.ind, 1) + '%'], ['🤝', 'Confianza', fmt(m.C) + '/100']];
    return '<h1>📊 La economía</h1><div class="pills">' + pills + '</div><div class="card">' + U.lineChart(arr, '#74acdf', 260) + '<p class="center big2">' + SERIES[U.chart][0] + ' ' + fmt(last(arr), Math.abs(last(arr)) < 20 ? 1 : 0) + '</p></div><div class="tiles">' + tiles.map(t => '<div class="tile"><i>' + t[0] + '</i><b>' + t[2] + '</b><small>' + t[1] + '</small></div>').join('') + '</div>';
  }
  function scrLogros() {
    const all = AR.ach.all(), got = all.filter(a => a.got).length;
    return '<h1>🏆 Logros <small>' + got + '/' + all.length + '</small></h1><div class="achs">' + all.map(a => '<div class="ach ' + (a.got ? 'got' : '') + '"><i>' + (a.got ? a.icon : '🔒') + '</i><b>' + a.name + '</b><small>' + a.d + '</small></div>').join('') + '</div>';
  }
  function scrArchivo(S) {
    return '<h1>📜 Historia argentina</h1><div class="tl">' + AR.timeline.map(e => '<div class="tli ' + e.k + '"><b>' + e.y + '</b><h3>' + e.t + '</h3><p>' + e.x + '</p></div>').join('') + '</div>' +
      '<h2>Glosario</h2><div class="gloss">' + AR.glossary.map(x => '<div><b>' + x[0] + '</b><p>' + x[1] + '</p></div>').join('') + '</div>' +
      '<p class="mut small">Fuentes de referencia del escenario: ' + AR.scenario.source + ' El modelo es una simplificación y no un pronóstico.</p>';
  }
  function scrMenu() {
    const c = SFX.cfg;
    return '<h1>⚙️ Menú</h1><div class="menu"><label class="sw"><input type="checkbox" data-act="cfg" data-v="sfx"' + (c.sfx ? ' checked' : '') + '> 🔊 Efectos de sonido</label>' +
      '<label class="sw"><input type="checkbox" data-act="cfg" data-v="voice"' + (c.voice ? ' checked' : '') + '> 🗣️ Voces (locutor y diputados)</label>' +
      '<label class="sw">🎚️ Volumen <input type="range" min="0" max="1" step="0.05" value="' + c.vol + '" data-act="vol"></label>' +
      '<button class="big" data-act="tutorial">❓ Cómo se juega</button><button class="big warn" data-act="newgame">🔄 Nueva partida</button></div>';
  }
  function screen(S) {
    if (!U.screen) return '';
    const f = { congreso: scrCongreso, economia: scrEconomia, logros: scrLogros, archivo: scrArchivo, menu: scrMenu }[U.screen];
    return '<div class="screen"><div class="sbox"><button class="x" data-act="screen" data-v="">✕</button>' + f(S) + '</div></div>';
  }

  /* ---------------- render ---------------- */
  U.render = function () {
    const S = U.S; if (!S) { AR.flow.start(); return; }
    if (!U.pos) U.layout();
    $('app').innerHTML = hud(S) + '<main class="main">' + board(S) + panel(S) + '</main>' + advisor(S) + ticker(S) +
      '<button class="next" data-act="next"' + (S.over ? ' disabled' : '') + '><span>SIGUIENTE MES</span><b>▶</b></button>' + screen(S);
    U.pinLinks();
  };
  U.open = function (t, id) { U.panel = { t, id }; U.render(); };

  /* ---------------- interacción ---------------- */
  let hoverKey = null;
  document.addEventListener('mouseover', e => {
    const n = e.target.closest && e.target.closest('[data-node]'); const k = n ? n.dataset.node : null;
    if (k === hoverKey) return; hoverKey = k;
    if (!U.S || U.busy) return;
    if (k) { drawLinks(linksFor(k)); SFX.hover(); } else U.pinLinks();
  });
  document.addEventListener('click', e => {
    const el = e.target.closest && e.target.closest('[data-act]'); if (!el) return;
    if (el.tagName === 'INPUT') return;
    SFX.unlock();
    const a = el.dataset.act, v = el.dataset.v, p = el.dataset.p, S = U.S;
    const H = AR.uiActions && AR.uiActions[a];
    if (H) { H(el, e); return; }
    if (a === 'open') { SFX.click(); U.open(el.dataset.t, v); }
    else if (a === 'close') { U.panel = null; U.render(); }
    else if (a === 'pick') { SFX.click(); U.sel[p] = parseInt(v, 10); U.render(); }
    else if (a === 'route') { SFX.click(); U.route[p] = v; U.render(); }
    else if (a === 'apply') AR.flow.apply(p, el.dataset.r);
    else if (a === 'next') AR.flow.next();
    else if (a === 'screen') { SFX.click(); U.screen = v || null; U.render(); }
    else if (a === 'chart') { U.chart = v; U.render(); }
    else if (a === 'neg') { const r = AR.negotiate(S, p, v); if (r.ok) SFX.coin(); else SFX.bad(); AR.flow.toast(r.msg, r.ok ? 'ok' : 'bad'); U.save(); U.render(); }
    else if (a === 'mute') { SFX.cfg.sfx = !SFX.cfg.sfx; SFX.cfg.voice = SFX.cfg.sfx; SFX.save(); if (!SFX.cfg.sfx) AR.voice.stop(); U.render(); }
    else if (a === 'newgame') { if (!S || S.over || confirm('¿Empezar una partida nueva? Se pierde la actual.')) { U.S = null; U.scn = null; U.panel = null; U.screen = null; U.sel = {}; U.pos = null; U.clear(); U.render(); } }
    else if (a === 'tutorial') { U.screen = null; AR.flow.tutorial(true); }
  });
  document.addEventListener('change', e => {
    const el = e.target; if (!el.dataset) return;
    if (el.dataset.act === 'cfg') { SFX.cfg[el.dataset.v] = el.checked; SFX.save(); if (!SFX.cfg.voice) AR.voice.stop(); }
    if (el.dataset.act === 'vol') { SFX.cfg.vol = parseFloat(el.value); SFX.save(); SFX.click(); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { if (U.screen) { U.screen = null; U.render(); } else if (U.panel) { U.panel = null; U.render(); } }
  });
})(typeof window !== 'undefined' ? window : globalThis);
