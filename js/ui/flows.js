/* Flujos de juego: inicio, votaciones animadas, informe mensual, eventos, elecciones, final y logros */
(function (g) {
  'use strict';
  const AR = g.AR, ART = AR.art, SFX = AR.sfx, VOX = AR.voice, U = AR.ui, $ = id => document.getElementById(id);
  const F = AR.flow = {};
  const fmt = U.fmt, sgn = U.sgn;
  const MN = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const wait = ms => new Promise(r => setTimeout(r, ms));

  /* ---------------- modal y avisos ---------------- */
  F.modal = (html, cls) => { const m = $('modal'); m.className = 'modal ' + (cls || ''); m.innerHTML = '<div class="mbox">' + html + '</div>'; m.hidden = false; };
  F.close = () => { const m = $('modal'); m.hidden = true; m.innerHTML = ''; };
  F.toast = (msg, kind) => {
    let box = $('toasts'); if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'toast ' + (kind || ''); t.innerHTML = msg; box.appendChild(t);
    setTimeout(() => t.classList.add('out'), 3600); setTimeout(() => t.remove(), 4200);
  };
  F.achPop = list => list.forEach((a, i) => setTimeout(() => {
    let box = $('toasts'); if (!box) { box = document.createElement('div'); box.id = 'toasts'; document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'achpop'; t.innerHTML = '<i>' + a.icon + '</i><div><small>🏆 LOGRO DESBLOQUEADO</small><b>' + a.name + '</b><span>' + a.d + '</span></div>'; box.appendChild(t);
    SFX.fanfare(); setTimeout(() => SFX.applause(1.6, 0.7), 500); if (i === 0) VOX.say('Logro desbloqueado: ' + a.name);
    setTimeout(() => t.classList.add('out'), 4800); setTimeout(() => t.remove(), 5400);
  }, i * 900));
  const confetti = () => {
    const c = document.createElement('div'); c.className = 'confetti';
    c.innerHTML = Array.from({ length: 60 }, (_, i) => '<i style="left:' + Math.random() * 100 + '%;animation-delay:' + Math.random() * 0.8 + 's;background:' + ['#74acdf', '#fff', '#f6b40e'][i % 3] + '"></i>').join('');
    document.body.appendChild(c); setTimeout(() => c.remove(), 3500);
  };

  /* ---------------- pantalla de inicio ---------------- */
  const SCN_ART = { dic2023: 'mercado', dic2015: 'mundo', ene2002: 'banco', jul1989: 'fuego' };
  const SCN_DIF = { dic2023: 4, dic2015: 3, ene2002: 4, jul1989: 5 };
  F.start = function () {
    const saved = U.load(); let body;
    if (!U.scn) {
      body = '<h2 class="sec">Elegí tu momento de la historia</h2><div class="scns">' + Object.keys(AR.SC).map(k => {
        const c = AR.SC[k];
        return '<button class="scn" data-act="scn" data-v="' + k + '"><div class="scnart">' + ART.scene(SCN_ART[k]) + '<span class="year">' + c.start.y + '</span></div><div class="scnb"><h3>' + c.name + '</h3><p>' + c.blurb + '</p><div class="meta"><span>⏳ ' + c.months + ' meses</span><span>' + '🔥'.repeat(SCN_DIF[k]) + '</span></div></div></button>';
      }).join('') + '</div>';
    } else {
      AR.setScenario(U.scn); const sc = AR.scenario;
      body = '<button class="back" data-act="back">← Otra época</button><div class="intro"><div class="scnart small">' + ART.scene(SCN_ART[sc.id]) + '<span class="year">' + sc.start.y + '</span></div><div><h2>' + sc.name + '</h2><p>' + sc.intro + '</p></div></div>' +
        '<h2 class="sec">¿Con qué partido gobernás?</h2>' + (AR.extras ? AR.extras.diffPicker() : '') + '<div class="parties">' + Object.keys(sc.parties).filter(k => sc.parties[k].govern).map(k => {
          const p = sc.parties[k], d = p.seats0.dip / sc.chamber.dip.total * 100, s = p.seats0.sen / sc.chamber.sen.total * 100;
          return '<button class="party" data-act="start" data-v="' + k + '" style="--c:' + p.color + '">' + ART.emblem(p, 64) + '<h3>' + p.name + '</h3><p>' + p.desc + '</p>' +
            '<div class="sb"><span>Diputados</span><div class="track"><i style="width:' + d + '%"></i></div><em>' + p.seats0.dip + '</em></div><div class="sb"><span>Senado</span><div class="track"><i style="width:' + s + '%"></i></div><em>' + p.seats0.sen + '</em></div>' +
            (p.dificultad ? '<small>⚠️ ' + p.dificultad + '</small>' : '') + '<span class="go">GOBERNAR ▶</span></button>';
        }).join('') + '</div>';
    }
    $('app').innerHTML = '<div class="start"><div class="hero">' + ART.scene('casa') + '<div class="herot"><div class="sol">☀️</div><h1>ARGENTINA</h1><p>Simulador de Gobierno</p></div></div><div class="sbody">' +
      (saved && !U.scn ? '<button class="cont" data-act="continue">▶ Continuar partida · ' + (saved.scnLabel || '') + ' · ' + AR.dateLabelFor(saved) + '</button>' : '') + body +
      (AR.pwa && !U.scn ? '<div class="instwrap">' + AR.pwa.button('cont') + '</div>' : '') + '<p class="foot">Partidos e instituciones reales · datos aproximados del INDEC y el BCRA · los personajes son ficticios</p></div></div>';
    F.close();
  };

  /* ---------------- tutorial ---------------- */
  F.tutorial = function (force) {
    let seen = false; try { seen = !!localStorage.getItem('ar-sim-tuto'); } catch (e) { /* nada */ }
    if (seen && !force) return;
    try { localStorage.setItem('ar-sim-tuto', '1'); } catch (e) { /* nada */ }
    const steps = [
      ['👥', 'La sociedad', 'Arriba están los sectores sociales. Sus caras muestran el humor: sonríen si te aprueban y se enojan si no. Hacé clic en uno para saber qué le preocupa.'],
      ['📊', 'El país', 'En el centro, los indicadores: inflación, dólar, reservas, pobreza... Verde es bueno y rojo es malo.'],
      ['🏛️', 'Tus políticas', 'A los costados, tus herramientas agrupadas por área. Al pasar el mouse ves a qué afectan. Hacé clic para cambiar el nivel y ver líneas verdes (mejora) o rojas (empeora).'],
      ['🪙', 'Capital político', 'Cada cambio cuesta capital político. Los decretos son rápidos, las leyes se votan en el Congreso y los DNU son un atajo con riesgo.'],
      ['📺', 'Cadena nacional, encuestas y redes', 'Una vez por mes podés hablarle al país. En Encuestas ves la intención de voto y en Redes qué dice la gente. Cumplí los 🎯 Objetivos del mandato para ganar capital extra.'],
      ['▶', 'Siguiente mes', 'Cuando estés listo, pasá de mes. La economía reacciona con rezago, la gente opina y pueden aparecer emergencias. ¡Suerte, Presidente!']
    ];
    F.modal('<div class="tuto"><h2>Cómo se juega</h2>' + steps.map(s => '<div class="ts"><i>' + s[0] + '</i><div><b>' + s[1] + '</b><p>' + s[2] + '</p></div></div>').join('') + '<button class="big" data-act="closemodal">¡A gobernar!</button></div>', 'wide');
  };

  /* ---------------- aplicar políticas ---------------- */
  F.apply = function (pid, route) {
    const S = U.S, p = AR.pol(pid), to = U.sel[pid], label = U.lab(p.levels[to]);
    const eff = ART.effects(p, S.pol[pid].cur, to).grp;
    const r = AR.proposeChange(S, pid, to, route); r.eff = eff;
    if (!r.kind) { SFX.bad(); F.toast(r.msg, 'bad'); return; }
    delete U.sel[pid];
    const after = live => { U.panel = null; U.save(); U.render(); if (live) setTimeout(() => U.react(r.eff, { quiet: r.kind === 'ley' }), 120); F.achPop(AR.ach.check(S)); };
    if (r.kind === 'ley') F.vote(p, label, r, () => { F.toast(r.msg, r.ok ? 'ok' : 'bad'); after(r.ok); });
    else F.stamp(r.kind === 'dnu' ? 'DNU' : 'DECRETO', p, label, () => { F.toast(r.msg, 'ok'); after(true); });
  };
  F.stamp = function (kind, p, label, cb) {
    F.modal('<div class="stampbox"><div class="paper"><small>BOLETÍN OFICIAL DE LA REPÚBLICA ARGENTINA</small><h3>' + (ART.polIcon[p.id] || '') + ' ' + p.name + '</h3><p>' + label + '</p><div class="sign">✍️ Presidencia de la Nación</div><div class="stamp ' + (kind === 'DNU' ? 'red' : '') + '">' + kind + ' FIRMADO</div></div></div>', 'clear');
    SFX.pen(); setTimeout(SFX.stamp, 450);
    setTimeout(() => { F.close(); cb(); }, 1700);
  };

  /* ---------------- votación animada ---------------- */
  F.vote = function (p, label, res, cb) {
    const S = U.S, v = res.vote; let skip = false;
    F.modal('<div class="votem"><small class="kick">🏛️ SESIÓN EN EL CONGRESO DE LA NACIÓN</small><h2>' + (ART.polIcon[p.id] || '') + ' ' + p.name + '</h2><p class="lv">' + label + '</p>' +
      '<h3 id="vch"></h3><div id="vhemi" class="vhemi"></div>' +
      '<div class="score"><div class="yes"><b id="vy">0</b><small>AFIRMATIVOS</small></div><div class="need"><b id="vneed">-</b><small>NECESARIOS</small></div><div class="no"><b id="vn">0</b><small>NEGATIVOS</small></div></div>' +
      '<div class="blocs" id="vblocs"></div><div id="vres" class="vres"></div><div class="vbtns"><button class="sm" id="vskip" data-act="vskip">⏩ Saltar</button><button class="big hidden" id="vdone" data-act="vdone">Continuar</button></div></div>', 'wide dark');
    AR.uiActions.vskip = () => { skip = true; };
    AR.uiActions.vdone = () => { F.close(); VOX.stop(); cb(); };
    const chamber = async (ch) => {
      const c = v[ch], tot = AR.CHAMBER[ch];
      $('vch').textContent = ch === 'dip' ? 'Cámara de Diputados' : 'Honorable Senado';
      $('vhemi').innerHTML = U.hemicycle(S, ch, c); $('vneed').textContent = c.need; $('vy').textContent = '0'; $('vn').textContent = '0'; $('vres').innerHTML = '';
      $('vblocs').innerHTML = AR.partyOrder.filter(k => S.seats[k][ch] > 0).map(k => '<span style="--c:' + AR.parties[k].color + '">' + AR.parties[k].short + ' <b class="y">' + c.by[k][0] + '</b>/<b class="n">' + c.by[k][1] + '</b></span>').join('');
      SFX.murmur(ch === 'dip' ? 3.6 : 2.6);
      VOX.say(ch === 'dip' ? 'Señoras y señores diputados: se vota.' : 'Pasamos al Senado. Se vota.', { interrupt: true });
      const seats = Array.from(document.querySelectorAll('#vhemi .seat'));
      for (let i = seats.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [seats[i], seats[j]] = [seats[j], seats[i]]; }
      let y = 0, n = 0; const step = Math.max(1, Math.round(seats.length / 60));
      for (let i = 0; i < seats.length; i += step) {
        seats.slice(i, i + step).forEach(s => { const yes = s.dataset.y === '1'; s.setAttribute('fill', yes ? '#22c55e' : '#ef4444'); s.classList.add('pop'); if (yes) y++; else n++; });
        $('vy').textContent = y; $('vn').textContent = n;
        if (i % (step * 12) === 0) SFX.click();
        if (i === step * 20) VOX.say(Math.random() < c.yes / tot.total ? '¡Afirmativo!' : '¡Negativo!', { rate: 1.2, pitch: 0.8 + Math.random() * 0.5 });
        if (!skip) await wait(ch === 'dip' ? 50 : 70);
      }
      const ok = c.yes >= c.need;
      SFX.gavel();
      await wait(skip ? 100 : 700);
      $('vres').innerHTML = '<div class="stamp xl ' + (ok ? '' : 'red') + '">' + (ok ? 'APROBADO' : 'RECHAZADO') + '</div>';
      if (ok) { SFX.applause(2.8); SFX.crowd('cheer', 18, 2.6); setTimeout(() => VOX.say(['¡Bravo!', '¡Muy bien!', '¡Es ley!'][Math.floor(Math.random() * 3)], { pitch: 1.3, rate: 1.2 }), 200); } else { SFX.boo(2.4); SFX.crowd('boo', 14, 2.4); setTimeout(() => VOX.say(['¡Vergüenza!', '¡Afuera!', '¡No pasará!'][Math.floor(Math.random() * 3)], { pitch: 0.8, rate: 1.15 }), 200); }
      VOX.say((ok ? 'Resulta afirmativa' : 'Resulta negativa') + ', con ' + c.yes + ' votos a favor y ' + (c.total - c.yes) + ' en contra.', { interrupt: true });
      if (!skip) await wait(2200);
      return ok;
    };
    (async () => {
      const okD = await chamber('dip');
      if (okD) await chamber('sen');
      $('vskip').classList.add('hidden'); $('vdone').classList.remove('hidden');
      if (res.ok) { confetti(); SFX.celebrate(2); }
    })();
  };

  /* ---------------- pasar de mes ---------------- */
  F.next = async function () {
    const S = U.S; if (U.busy || S.over) return;
    if (S.pending.length) { F.queue(); return; }
    U.busy = true; U.panel = null;
    const snap = { m: Object.assign({}, S.m), A: Object.assign({}, S.A), appr: S.appr, pc: S.pc, t: S.t };
    const d0 = AR.dateOf(S.t);
    F.modal('<div class="flip"><div class="page"><b>' + MN[d0.m].toUpperCase() + '</b><span>' + d0.y + '</span></div><p>Pasa el mes...</p></div>', 'clear');
    SFX.turn();
    AR.endTurn(S);
    if (AR.extras) { AR.extras.monthly(S, snap); AR.extras.checkGoals(S); }
    const fresh = AR.ach.check(S);
    U.save();
    await wait(1000);
    U.busy = false; U.render();
    F.report(snap, fresh);
  };
  F.report = function (snap, fresh) {
    const S = U.S, m = S.m, d = AR.dateOf(S.t - 1);
    const tile = (icon, name, before, after, dec, upGood, unit) => {
      const dv = after - before, good = Math.abs(dv) < 1e-9 ? null : (dv > 0) === upGood;
      return '<div class="rt ' + (good === null ? '' : good ? 'up' : 'dn') + '"><i>' + icon + '</i><small>' + name + '</small><b>' + fmt(after, dec) + (unit || '') + '</b><em>' + (Math.abs(dv) < 1e-9 ? '=' : (dv > 0 ? '▲ ' : '▼ ') + fmt(Math.abs(dv), dec)) + '</em></div>';
    };
    const tiles = [tile('🔥', 'Inflación', snap.m.infM, m.infM, 1, false, '%'), tile('💵', 'Dólar oficial', snap.m.fxOff, m.fxOff, m.fxOff < 20 ? 2 : 0, false), tile('🏦', 'Reservas', snap.m.res, m.res, 1, true, 'B'),
      tile('📉', 'Riesgo país', snap.m.risk, m.risk, 0, false), tile('🥣', 'Pobreza', snap.m.pov, m.pov, 1, false, '%'), tile('❤️', 'Aprobación', snap.appr, S.appr, 0, true, '%')].join('');
    const ch = AR.groups.map(gr => ({ gr, dv: S.A[gr.id] - snap.A[gr.id] })).sort((a, b) => Math.abs(b.dv) - Math.abs(a.dv)).slice(0, 5);
    const faces = ch.map(x => '<div class="rf ' + (x.dv >= 0 ? 'up' : 'dn') + '">' + ART.avatar(x.gr.id, ART.moodOf(S.A[x.gr.id])) + '<b>' + sgn(Math.round(x.dv)) + '</b><small>' + U.gshort[x.gr.id] + '</small><q>' + U.quote(S, x.gr.id) + '</q></div>').join('');
    let why = '';
    if (S.why) { const w = Object.entries(S.why).filter(x => x[1] > 0.1).sort((a, b) => b[1] - a[1]).slice(0, 3); why = '<p class="why">🔥 La inflación vino sobre todo por: ' + w.map(x => '<b>' + x[0] + '</b>').join(' · ') + '</p>'; }
    const ach = fresh.length ? '<div class="rach">' + fresh.map(a => '<span>' + a.icon + ' ' + a.name + '</span>').join('') + '</div>' : '';
    F.modal('<div class="report"><small class="kick">📋 INFORME MENSUAL</small><h2>' + MN[d.m].replace(/^./, c => c.toUpperCase()) + ' de ' + d.y + '</h2><div class="rts">' + tiles + '</div>' + why +
      (AR.extras ? AR.extras.papers(S, snap) : '') + '<h3>Cómo reaccionó la gente</h3><div class="rfs">' + faces + '</div>' + ach + '<button class="big" data-act="repok">Continuar ▶</button></div>', 'wide');
    const dA = S.appr - snap.appr; if (dA >= 1.5) { SFX.good(); SFX.celebrate(1); } else if (dA >= 0) SFX.good(); else if (dA <= -1.5) { SFX.bad(); SFX.disappoint(); } else SFX.bad();
    U.lastDelta = Object.fromEntries(AR.groups.map(gr => [gr.id, S.A[gr.id] - snap.A[gr.id]]));
    VOX.say('Informe de ' + MN[d.m] + '. La inflación fue de ' + fmt(m.infM, 1) + ' por ciento. ' + (dA >= 0 ? 'Tu aprobación sube.' : 'Tu aprobación baja.'), { interrupt: true, who: 'f' });
    F.achPop(fresh);
  };

  /* ---------------- eventos ---------------- */
  const HINT = { pc: ['🪙', 'Capital', 1], res: ['🏦', 'Reservas', 1], pb: ['🧮', 'Fiscal', 1], inf: ['🔥', 'Inflación', -1], conf: ['📢', 'Conflicto', -1], inst: ['🏛️', 'Instituciones', 1], tra: ['🔎', 'Transparencia', 1],
    insec: ['🚨', 'Inseguridad', -1], og: ['📊', 'Actividad', 1], cred: ['🤝', 'Confianza', 1], fxj: ['💸', 'Dólar libre', -1], fxo: ['💵', 'Devaluación', -1], harv: ['🌾', 'Cosecha', 1], Ex: ['🧠', 'Expectativas', -1], hea: ['❤️‍🩹', 'Salud', 1], cult: ['🎭', 'Cultura', 1] };
  function hints(c, S) {
    let e; try { e = typeof c.e === 'function' ? c.e(S) : c.e; } catch (x) { e = {}; } e = e || {};
    let o = Object.keys(HINT).filter(k => e[k]).map(k => { const good = e[k] * HINT[k][2] > 0; return '<span class="hc ' + (good ? 'up' : 'dn') + '">' + HINT[k][0] + ' ' + HINT[k][1] + '</span>'; }).join('');
    if (e.g) { const ks = Object.keys(e.g).sort((a, b) => Math.abs(e.g[b]) - Math.abs(e.g[a])).slice(0, 4); o += ks.map(k => '<span class="hf ' + (e.g[k] > 0 ? 'up' : 'dn') + '" title="' + U.gshort[k] + '">' + ART.avatar(k, e.g[k] > 0 ? 1 : -1) + '</span>').join(''); }
    if (e.setpol) o += '<span class="hc">📋 Cambia una política</span>';
    if (c.veto) o += '<span class="hc">✋ Veto</span>';
    return o;
  }
  F.queue = function () {
    const S = U.S;
    if (!S.pending.length) { if (S.over) F.end(); else F.close(); return; }
    const id = S.pending[0];
    if (id === '__elect') { F.election(); return; }
    const ev = AR.eventById(id), urgent = ART.urgent.has(id), happy = ART.happy.has(id);
    F.modal('<div class="evt ' + (urgent ? 'urgent' : happy ? 'happy' : '') + '"><div class="evscene">' + ART.scene(ART.sceneFor[id] || 'casa') + '<div class="evtag">' + (urgent ? '🚨 EMERGENCIA' : happy ? '🎉 BUENAS NOTICIAS' : '📰 ÚLTIMO MOMENTO') + '</div><h2>' + ev.title + '</h2></div>' +
      '<p class="evtext">' + AR.eventText(S, ev) + '</p><div class="choices">' + ev.choices.map((c, i) => '<button class="choice" data-act="evc" data-v="' + i + '"><b>' + c.t + '</b>' + (c.d ? '<small>' + c.d + '</small>' : '') + '<span class="hints">' + hints(c, S) + '</span></button>').join('') + '</div></div>', 'wide' + (urgent ? ' alarm' : ''));
    if (urgent && PROTEST.has(id)) { SFX.protest(2); VOX.say('Atención. ' + ev.title, { interrupt: true }); }
    else if (urgent) { SFX.siren(2.4); SFX.gasp(); VOX.say('Atención. ' + ev.title, { interrupt: true }); }
    else if (happy) { SFX.celebrate(BIG.has(id) ? 3 : 2); confetti(); VOX.say(ev.title, { interrupt: true }); }
    else if (PROTEST.has(id)) { SFX.news(); SFX.protest(1); VOX.say(ev.title, { interrupt: true }); }
    else { SFX.news(); VOX.say(ev.title, { interrupt: true }); }
  };
  const PROTEST = new Set(['paro_cgt', 'marcha_univ', 'cacerolazo', 'saqueos', 'tomas', 'paro_docente', 'camioneros', 'ruidazo', 'ni_una_menos', 'dia_memoria', 'jefes', 'avellaneda', 'lockout_agro', 'cierre_fabricas', 'aceiteros', 'veto_jub', 'veto_univ']);
  const BIG = new Set(['mundial', 'copa_america']);
  F.choose = function (i) {
    const S = U.S, ev = AR.eventById(S.pending[0]), c = ev.choices[i];
    const msg = AR.resolveEvent(S, i);
    if (c.veto) { if (/sostuvo/.test(msg)) { SFX.gavel(); SFX.applause(2); } else { SFX.boo(2); } } else SFX.click();
    F.toast((ART.polIcon[ev.id] || '📰') + ' ' + msg, /superado|negativ/.test(msg) ? 'bad' : 'ok');
    F.achPop(AR.ach.check(S)); U.save(); U.render(); F.queue();
    let e; try { e = typeof c.e === 'function' ? c.e(S) : c.e; } catch (x) { e = null; }
    if (e && e.g) setTimeout(() => U.react(e.g, { quiet: !$('modal').hidden || !!c.veto }), 150);
  };

  /* ---------------- elecciones ---------------- */
  F.election = function () {
    const S = U.S, e = S.elect, sh = e.shares, ord = Object.keys(sh).sort((a, b) => sh[b] - sh[a]), mx = sh[ord[0]];
    const bars = ord.map(k => '<div class="eb">' + ART.emblem(AR.parties[k], 34) + '<span>' + AR.parties[k].short + '</span><div class="track"><i data-w="' + (sh[k] / mx * 100) + '" style="width:0;background:' + AR.parties[k].color + '"></i></div><b>' + fmt(sh[k], 1) + '%</b></div>').join('');
    let res = '', won;
    if (e.kind === 'midterm') {
      won = ord[0] === S.party;
      res = '<div class="seatsnew">' + AR.partyOrder.slice().reverse().map(k => '<span style="--c:' + AR.parties[k].color + '">' + AR.parties[k].short + ' <b>' + S.seats[k].dip + '</b>/' + S.seats[k].sen + '</span>').join('') + '</div><p class="mut">Nuevo Congreso (diputados/senadores)</p>';
    } else {
      won = e.reelected;
      res = (e.runoff ? '<p class="runoff">🗳️ Balotaje: ' + Object.keys(e.runoff).map(k => AR.parties[k].short + ' ' + fmt(e.runoff[k], 1) + '%').join(' vs ') + '</p>' : '') + '<h3 class="win">Gana ' + AR.parties[e.winner].name + '</h3>';
    }
    F.modal('<div class="elect"><small class="kick">🗳️ ' + (e.kind === 'midterm' ? 'ELECCIONES LEGISLATIVAS' : 'ELECCIONES PRESIDENCIALES') + ' · ' + AR.dateLong(S.t - 1).toUpperCase() + '</small><h2>Escrutinio</h2><div class="ebs">' + bars + '</div><div id="eres" class="hidden">' + res + '</div><button class="big hidden" id="eok" data-act="ackelect">Continuar ▶</button></div>', 'wide dark');
    SFX.drum(2.4); VOX.say('Comienza el escrutinio.', { interrupt: true });
    setTimeout(() => document.querySelectorAll('.eb i').forEach(i => { i.style.width = i.dataset.w + '%'; }), 80);
    setTimeout(() => {
      $('eres').classList.remove('hidden'); $('eok').classList.remove('hidden');
      if (won) { SFX.celebrate(3); confetti(); setTimeout(() => SFX.chant('si', 18), 2200); } else { SFX.disappoint(); SFX.boo(2.6); }
      VOX.say(e.kind === 'midterm' ? (won ? 'Tu espacio gana las elecciones legislativas.' : 'Tu espacio pierde las elecciones legislativas.') : 'Gana ' + AR.parties[e.winner].name + '.', { interrupt: true });
    }, 2700);
  };

  /* ---------------- final ---------------- */
  F.end = function () {
    const S = U.S, s = S.over.summary || AR.summary(S);
    const medal = { 'Histórico': '🏆', 'Exitoso': '🥇', 'Pasable': '🥈', 'Difícil': '🥉', 'Desastre': '💀' }[s.grade] || '🎖️';
    const t = (i, n, v) => '<div class="tile"><i>' + i + '</i><b>' + v + '</b><small>' + n + '</small></div>';
    const achs = (S.ach || []).map(id => AR.ACH.find(a => a.id === id)).filter(Boolean);
    F.modal('<div class="endm"><div class="medal">' + medal + '</div><small class="kick">FIN DE LA PARTIDA</small><h2>' + S.over.title + '</h2>' + (S.over.text ? '<p>' + S.over.text + '</p>' : '') +
      '<div class="grade">' + s.grade + ' · ' + s.score + '/100</div><p class="arq">Tu gobierno se parece a: <b>' + s.archetype + '</b><br><span>' + s.archetypeText + '</span></p>' +
      '<div class="tiles">' + t('🔥', 'Inflación anual (inicio ' + fmt(s.base.inf) + '%)', fmt(s.infYoy) + '%') + t('🥣', 'Pobreza (inicio ' + fmt(s.base.pov, 1) + '%)', fmt(s.pov, 1) + '%') + t('🧰', 'Desocupación', fmt(s.u, 1) + '%') + t('📊', 'PBI acumulado', sgn(s.gdp, 1) + '%') + t('📉', 'Riesgo país', fmt(s.risk)) + t('❤️', 'Aprobación final', fmt(s.appr) + '%') + '</div>' +
      (achs.length ? '<h3>Logros de esta partida</h3><div class="rach">' + achs.map(a => '<span>' + a.icon + ' ' + a.name + '</span>').join('') + '</div>' : '') +
      (AR.extras ? '<p class="arq">🎯 Objetivos cumplidos: <b>' + AR.extras.goalCount(S) + '</b></p>' : '') +
      '<div class="endbtns"><button class="big alt" data-act="share">📤 Compartir resultado</button><button class="big" data-act="newgame">🔄 Jugar otra vez</button></div></div>', 'wide');
    if (['Histórico', 'Exitoso'].includes(s.grade)) { SFX.celebrate(3); confetti(); } else if (s.grade === 'Desastre') { SFX.protest(2); } else { SFX.good(); SFX.applause(2); }
    VOX.say(S.over.title + '. Tu gobierno fue calificado como ' + s.grade + '.', { interrupt: true });
  };

  /* ---------------- acciones de esta capa ---------------- */
  AR.uiActions = {
    scn: el => { SFX.click(); U.scn = el.dataset.v; F.start(); },
    back: () => { SFX.click(); U.scn = null; F.start(); },
    start: el => {
      SFX.coin(); U.S = AR.newGame(el.dataset.v, null, U.scn); U.S.scnLabel = AR.scenario.short; if (AR.extras) AR.extras.applyDiff(U.S); U.pos = null; U.panel = null; U.screen = null; U.save(); U.render();
      SFX.fanfare(); setTimeout(() => SFX.celebrate(2), 500); confetti(); VOX.say('Asume la Presidencia. Que Dios y la Patria te lo demanden.', { interrupt: true });
      F.tutorial(false); if (!$('modal').hidden) return; F.queue();
    },
    continue: () => { const sv = U.load(); if (!sv) return; AR.setScenario(sv.scn || 'dic2023'); AR.policies.forEach(p => { if (!sv.pol[p.id]) sv.pol[p.id] = { cur: p.init, pend: null }; }); U.S = sv; U.scn = sv.scn; U.pos = null; SFX.click(); U.render(); F.queue(); },
    evc: el => F.choose(parseInt(el.dataset.v, 10)),
    repok: () => { SFX.click(); F.queue(); if (U.lastDelta && $('modal').hidden) U.react(U.lastDelta, { min: 1.5 }); U.lastDelta = null; },
    ackelect: () => { AR.ackElection(U.S); U.save(); U.render(); F.queue(); },
    closemodal: () => { F.close(); if (U.S) F.queue(); }
  };

  /* ---------------- arranque ---------------- */
  const boot = () => {
    const sv = U.load();
    if (sv) { U.scn = null; }
    U.render();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})(typeof window !== 'undefined' ? window : globalThis);
