/* Contenido extra: cadena nacional, tapas de diarios, redes sociales, encuestas, objetivos del mandato, dificultad y compartir */
(function (g) {
  'use strict';
  const AR = g.AR, ART = AR.art, SFX = AR.sfx, VOX = AR.voice, U = AR.ui, F = AR.flow, $ = id => document.getElementById(id);
  const X = AR.extras = {};
  const fmt = U.fmt, sgn = U.sgn, clamp = (x, a, b) => Math.max(a, Math.min(b, x)), last = a => a[a.length - 1];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const MN = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ================= dificultad ================= */
  X.DIFF = {
    facil: { icon: '🙂', name: 'Fácil', d: 'Más capital político cada mes y arrancás con más margen.', k: 1.35, pc: 15 },
    normal: { icon: '😐', name: 'Normal', d: 'La Argentina tal como es.', k: 1, pc: 0 },
    dificil: { icon: '😈', name: 'Difícil', d: 'El capital político rinde poco. Cada decisión cuesta el doble.', k: 0.75, pc: -8 }
  };
  U.diff = U.diff || 'normal';
  X.diffPicker = () => '<div class="diffs"><span>Dificultad:</span>' + Object.keys(X.DIFF).map(k => '<button class="diff' + (U.diff === k ? ' on' : '') + '" data-act="diff" data-v="' + k + '" title="' + X.DIFF[k].d + '">' + X.DIFF[k].icon + ' ' + X.DIFF[k].name + '</button>').join('') + '</div>';
  X.applyDiff = S => { const d = X.DIFF[U.diff] || X.DIFF.normal; S.diff = U.diff; S.diffK = d.k; S.pc = clamp(S.pc + d.pc, 0, 100); };

  /* ================= objetivos del mandato ================= */
  const gy = S => AR.gdpYoy(S);
  X.GOALS = {
    dic2023: [
      { id: 'i3', icon: '🔥', name: 'Inflación debajo del 3% mensual', ok: S => S.m.infM < 3 },
      { id: 'res', icon: '🏦', name: 'Reservas netas positivas', ok: S => S.m.res > 0 },
      { id: 'rk', icon: '📉', name: 'Riesgo país debajo de 900', ok: S => S.m.risk < 900 },
      { id: 'pov', icon: '🥣', name: 'Pobreza debajo del 35%', ok: S => S.m.pov < 35 }
    ],
    dic2015: [
      { id: 'gap', icon: '💵', name: 'Unificar el dólar (brecha menor al 5%)', ok: S => S.m.gap < 5 },
      { id: 'i15', icon: '🔥', name: 'Inflación debajo del 1,5% mensual', ok: S => S.m.infM < 1.5 },
      { id: 'pov', icon: '🥣', name: 'Pobreza debajo del 26%', ok: S => S.m.pov < 26 },
      { id: 'gro', icon: '📊', name: 'Crecer más del 3% anual', ok: S => gy(S) > 3 }
    ],
    ene2002: [
      { id: 'pov', icon: '🥣', name: 'Bajar la pobreza del 45%', ok: S => S.m.pov < 45 },
      { id: 'u', icon: '🧰', name: 'Desocupación debajo del 14%', ok: S => S.m.u < 14 },
      { id: 'inf', icon: '🔥', name: 'Inflación debajo del 1,5% mensual', ok: S => S.m.infM < 1.5 && S.t > 3 },
      { id: 'gro', icon: '🚀', name: 'Crecer más del 5% anual', ok: S => gy(S) > 5 }
    ],
    jul1989: [
      { id: 'hip', icon: '🌋', name: 'Terminar con la hiper (menos del 5% mensual)', ok: S => S.m.infM < 5 },
      { id: 'i1', icon: '🧊', name: 'Inflación debajo del 1% mensual', ok: S => S.m.infM < 1 },
      { id: 'gro', icon: '📊', name: 'Crecer más del 4% anual', ok: S => gy(S) > 4 },
      { id: 'ap', icon: '❤️', name: 'Recuperar el 50% de aprobación', ok: S => S.appr >= 50 }
    ]
  };
  X.goals = S => X.GOALS[S.scn] || X.GOALS.dic2023;
  X.checkGoals = S => {
    S.goals = S.goals || {}; const fresh = [];
    X.goals(S).forEach(gl => { if (!S.goals[gl.id]) { let ok = false; try { ok = gl.ok(S); } catch (e) { ok = false; } if (ok) { S.goals[gl.id] = S.t; S.pc = clamp(S.pc + 10, 0, 100); fresh.push(gl); } } });
    fresh.forEach((gl, i) => setTimeout(() => {
      F.toast('<b>🎯 ¡Objetivo cumplido!</b> ' + gl.icon + ' ' + gl.name + ' · <b>+10 🪙</b>', 'ok'); SFX.fanfare(); setTimeout(() => SFX.celebrate(1), 400);
      VOX.say('Objetivo cumplido: ' + gl.name, { interrupt: false });
    }, 900 + i * 1200));
    return fresh;
  };
  X.goalCount = S => { const all = X.goals(S); return Object.keys(S.goals || {}).filter(k => all.some(x => x.id === k)).length + '/' + all.length; };
  function scrObjetivos(S) {
    const all = X.goals(S), done = S.goals || {};
    return '<h1>🎯 Objetivos del mandato <small>' + X.goalCount(S) + '</small></h1><p class="mut">Cada objetivo cumplido te da <b>+10 de capital político</b> al instante. Se cumple apenas el indicador llega a la meta, al cerrar el mes.</p>' +
      '<div class="goals">' + all.map(gl => { const ok = done[gl.id] !== undefined; return '<div class="goal' + (ok ? ' ok' : '') + '"><i>' + (ok ? '✅' : gl.icon) + '</i><div><b>' + gl.name + '</b><small>' + (ok ? 'Cumplido en ' + AR.dateLabel(done[gl.id] - 1) : 'Pendiente') + '</small></div></div>'; }).join('') + '</div>' +
      '<h2>Dificultad</h2><p class="mut">Esta partida: <b>' + (X.DIFF[S.diff || 'normal'].icon + ' ' + X.DIFF[S.diff || 'normal'].name) + '</b>. ' + X.DIFF[S.diff || 'normal'].d + '</p>';
  }

  /* ================= cadena nacional ================= */
  X.SPEECH = {
    economia: { icon: '📈', name: 'Defender el rumbo económico', txt: 'Queridos compatriotas: el esfuerzo vale la pena. Estamos ordenando la economía y lo peor ya pasó.', g: { fin: 6, cm: 3, pym: 2, sp: -2, sn: -3 } },
    jubilados: { icon: '👵', name: 'Homenaje a los jubilados', txt: 'A nuestros abuelos: ustedes construyeron este país, y este gobierno no los va a abandonar.', g: { jb: 7, rel: 2, cm: 1 } },
    unidad: { icon: '🤝', name: 'Llamado a la unidad nacional', txt: 'Les pido a todos, sin importar a quién votaron, que tiremos para el mismo lado. La Argentina nos necesita unidos.', g: { cm: 1.6, sp: 1.6, jb: 1.6, pu: 1.6, sn: 1.6, inf: 1.6, pym: 1.6, ind: 1.6, agro: 1.6, fin: 1.6, jov: 1.6, uni: 1.6, int: 1.6, rel: 2.5, mov: 1.6 }, e: { conf: -3 } },
    seguridad: { icon: '🚓', name: 'Mano dura contra el delito', txt: 'Se terminó la impunidad. El que las hace, las paga. Vamos a recuperar las calles para la gente de bien.', g: { cm: 4, int: 3, rel: 2, uni: -3, mov: -3 }, e: { insec: -2 } },
    produccion: { icon: '🏭', name: 'Apoyo a la producción', txt: 'El trabajo argentino es el motor del país. Vamos a cuidar cada fábrica, cada campo y cada comercio.', g: { agro: 4, ind: 4, pym: 4, sn: 2, fin: -1 } },
    juventud: { icon: '🎒', name: 'Los jóvenes y el futuro', txt: 'A los jóvenes les digo: no se vayan. Este país va a tener un lugar para ustedes.', g: { jov: 6, uni: 4 } },
    privilegios: { icon: '✂️', name: 'Contra los privilegios', txt: 'Se terminaron los privilegios de unos pocos que vivieron a costa del esfuerzo de todos.', g: { cm: 4, jov: 3, inf: 2, pu: -4, sn: -4 } },
    social: { icon: '🍲', name: 'Nadie se salva solo', txt: 'Mientras haya un chico con hambre en la Argentina, ningún gobierno puede estar tranquilo.', g: { sp: 5, mov: 5, rel: 3, inf: 3, fin: -3 } }
  };
  X.SPEECH_COST = 6;
  X.openSpeech = () => {
    const S = U.S; if (!S || S.over) return;
    if (S.speechT === S.t) { SFX.bad(); F.toast('📺 Ya hablaste en cadena nacional este mes. Volvé el mes que viene.', 'bad'); return; }
    const p = Math.round(X.speechOdds(S) * 100);
    F.modal('<div class="speechm"><div class="tv"><div class="tvin"><span class="cn">🔴 CADENA NACIONAL</span>' + ART.emblem(AR.parties[S.party], 70) + '<b>¿De qué le vas a hablar al país?</b></div></div>' +
      '<p class="mut center">Cuesta <b>' + X.SPEECH_COST + ' 🪙</b> y podés hacerlo una vez por mes. Con tu aprobación actual, la chance de que el mensaje caiga bien es de <b>' + p + '%</b>.</p>' +
      '<div class="topics">' + Object.keys(X.SPEECH).map(k => { const s = X.SPEECH[k]; const gs = Object.keys(s.g).filter(x => Math.abs(s.g[x]) >= 2).sort((a, b) => s.g[b] - s.g[a]);
        return '<button class="topic" data-act="speech" data-v="' + k + '"' + (S.pc < X.SPEECH_COST ? ' disabled' : '') + '><i>' + s.icon + '</i><b>' + s.name + '</b><span class="hints">' + (gs.length ? gs.map(x => '<span class="hf ' + (s.g[x] > 0 ? 'up' : 'dn') + '" title="' + U.gshort[x] + '">' + ART.avatar(x, s.g[x] > 0 ? 1 : -1) + '</span>').join('') : '<span class="hc up">👥 Todos un poco</span>') + '</span></button>'; }).join('') + '</div>' +
      '<button class="sm" data-act="closemodal">Cancelar</button></div>', 'wide dark');
  };
  X.speechOdds = S => clamp(0.5 + (S.appr - 40) / 80 + (S.m.conf < 40 ? 0.05 : -0.05), 0.25, 0.92);
  X.giveSpeech = k => {
    const S = U.S, sp = X.SPEECH[k]; if (!sp || S.pc < X.SPEECH_COST || S.speechT === S.t) return;
    S.pc -= X.SPEECH_COST; S.speechT = S.t; S.stats.speeches = (S.stats.speeches || 0) + 1;
    const ok = Math.random() < X.speechOdds(S), gg = {};
    Object.keys(sp.g).forEach(x => { gg[x] = ok ? sp.g[x] : (sp.g[x] > 0 ? -sp.g[x] * 0.4 : sp.g[x] * 1.2); });
    F.modal('<div class="speechm"><div class="tv on"><div class="tvin"><span class="cn">🔴 EN VIVO · CADENA NACIONAL</span>' + ART.emblem(AR.parties[S.party], 70) + '<p class="tvtxt" id="tvtxt"></p></div><div class="scan"></div></div><div id="spres" class="spres"></div></div>', 'wide dark');
    SFX.news(); VOX.say(sp.txt, { interrupt: true, rate: 1, pitch: 0.95 });
    const el = $('tvtxt'); let i = 0;
    const iv = setInterval(() => { if (!el.isConnected) { clearInterval(iv); return; } i += 2; el.textContent = '“' + sp.txt.slice(0, i) + (i < sp.txt.length ? '' : '”'); if (i >= sp.txt.length) { clearInterval(iv); done(); } }, 45);
    const done = () => {
      AR.applyEff(S, Object.assign({ g: gg }, ok ? (sp.e || {}) : { conf: 3 }));
      let tot = 0, ws = 0; AR.groups.forEach(gr => { if (gg[gr.id]) S.A[gr.id] = clamp(S.A[gr.id] + gg[gr.id] * 0.45, 2, 98); tot += S.A[gr.id] * gr.size; ws += gr.size; }); S.appr = tot / ws;
      AR.news(S, ok ? 'Cadena nacional: "' + sp.name + '". El mensaje fue bien recibido.' : 'Cadena nacional: "' + sp.name + '". Ruidazo y memes en las redes.', 'País');
      $('spres').innerHTML = (ok ? '<div class="stamp">¡LLEGÓ A LA GENTE!</div>' : '<div class="stamp red">CAYÓ MAL</div>') + '<p>' + (ok ? 'El rating fue alto y los sectores a los que les hablaste se sienten escuchados.' : 'Hubo ruidazo en los balcones y el discurso se volvió meme. Los sectores que querías conquistar desconfían.') + '</p><button class="big" data-act="closemodal">Volver al tablero</button>';
      if (ok) SFX.celebrate(1); else { SFX.pots(3); SFX.crowd('boo', 10, 2); }
      U.save();
      X.post(S, ok ? 'speechOk' : 'speechBad', sp.name);
    };
    U.pendingReact = gg;
  };

  /* ================= tapas de diarios ================= */
  const PAPERS = [
    { id: 'mat', name: 'El Matutino', sub: 'El diario de todos los argentinos', cls: 'p-mat' },
    { id: 'voz', name: 'La Voz del Pueblo', sub: 'Con los que menos tienen', cls: 'p-voz' },
    { id: 'inv', name: 'El Inversor', sub: 'Economía, finanzas y negocios', cls: 'p-inv' }
  ];
  // Titulares según qué miró cada diario y si el dato mejoró o empeoró
  function headlines(S, snap) {
    const m = S.m, o = snap.m, mes = MN[AR.dateOf(S.t - 1).m];
    const dInf = m.infM - o.infM, dFx = (m.fxOff / o.fxOff - 1) * 100, dPov = m.pov - o.pov, dAp = S.appr - snap.appr, dRisk = m.risk - o.risk, dRes = m.res - o.res, dRw = m.rw - o.rw, dU = m.u - o.u;
    const ev = S.news.find(n => n.t >= S.t - 1 && n.tag !== 'INDEC' && n.tag !== 'Mercados');
    const mat = Math.abs(dInf) > 0.6 || m.infM > 8
      ? (dInf < 0 ? ['Baja la inflación: ' + fmt(m.infM, 1) + '% en ' + mes, 'Es ' + fmt(Math.abs(dInf), 1) + ' puntos menos que el mes anterior.'] : ['La inflación de ' + mes + ' fue ' + fmt(m.infM, 1) + '%', 'Los precios ' + (dInf > 0 ? 'se aceleraron' : 'siguen altos') + ' y preocupa a las familias.'])
      : Math.abs(dAp) >= 2 ? [(dAp > 0 ? 'Repunta' : 'Cae') + ' la imagen del Gobierno', 'La aprobación ' + (dAp > 0 ? 'sube' : 'baja') + ' a ' + fmt(S.appr) + '%, según encuestas.'] : ['Mes de calma relativa en la economía', 'Inflación de ' + fmt(m.infM, 1) + '% y dólar a $' + ART.fmtN(m.fxOff) + '.'];
    if (ev && Math.random() < 0.45) mat[1] = ev.txt;
    const popBad = dRw < -1 || dPov > 0.4 || dU > 0.2 || m.infM > 6;
    const voz = popBad
      ? (dPov > 0.4 ? ['Más pobres: la pobreza llega al ' + fmt(m.pov) + '%', 'En los barrios crece la demanda en los comedores.'] : dRw < -1 ? ['El sueldo no alcanza: el salario real cae otra vez', 'Los trabajadores perdieron ' + fmt(Math.abs(dRw), 1) + ' puntos de poder de compra.'] : dU > 0.2 ? ['Crece el desempleo: ' + fmt(m.u, 1) + '%', 'Cierran comercios y talleres en el conurbano.'] : ['Ajuste sobre el bolsillo', 'Con ' + fmt(m.infM, 1) + '% de inflación, la mesa de los argentinos se achica.'])
      : (dRw > 0.5 ? ['Alivio: los salarios le ganan a la inflación', 'El salario real sube ' + fmt(dRw, 1) + ' puntos en ' + mes + '.'] : ['Respiro en los barrios', 'La pobreza se ubica en ' + fmt(m.pov) + '% y el empleo se sostiene.']);
    if (S.A.jb - snap.A.jb < -2) voz[1] = 'Los jubilados vuelven a marchar frente al Congreso.';
    const inv = Math.abs(dRisk) > 60 ? (dRisk < 0 ? ['Fuerte baja del riesgo país: ' + ART.fmtN(m.risk) + ' puntos', 'Los bonos argentinos suben y el mercado se entusiasma.'] : ['El riesgo país se dispara a ' + ART.fmtN(m.risk), 'Los inversores desconfían y los bonos caen.'])
      : Math.abs(dFx) > 4 ? [(dFx > 0 ? 'Salta' : 'Cede') + ' el dólar: $' + ART.fmtN(m.fxOff), 'La brecha cambiaria está en ' + fmt(m.gap) + '%.']
      : Math.abs(dRes) > 0.3 ? [(dRes > 0 ? 'El BCRA suma' : 'El BCRA pierde') + ' reservas', 'Las reservas netas quedan en US$' + fmt(m.res, 1) + ' mil millones.']
      : [m.pb >= 0 ? 'Superávit fiscal: ' + sgn(m.pb, 1) + '% del PBI' : 'El rojo fiscal sigue en ' + fmt(m.pb, 1) + '% del PBI', 'Los mercados miran las cuentas públicas.'];
    const mood = { mat: dAp >= 0, voz: !popBad, inv: dRisk <= 0 };
    return { mat, voz, inv, mood };
  }
  X.papers = (S, snap) => {
    const h = headlines(S, snap), d = AR.dateOf(S.t);
    const scene = { mat: h.mood.mat ? 'casa' : 'congreso', voz: h.mood.voz ? 'campo' : 'calle', inv: h.mood.inv ? 'mercadoBueno' : 'mercado' };
    return '<h3>📰 Las tapas de mañana</h3><div class="papers">' + PAPERS.map(p => '<div class="paper2 ' + p.cls + '"><div class="mast"><b>' + p.name + '</b><small>' + p.sub + ' · 1 de ' + MN[d.m] + ' de ' + d.y + '</small></div><h4>' + esc(h[p.id][0]) + '</h4><div class="pimg">' + ART.scene(scene[p.id]) + '</div><p>' + esc(h[p.id][1]) + '</p></div>').join('') + '</div>';
  };

  /* ================= redes sociales ================= */
  const HANDLE = { cm: ['lauri_contadora', 'Laura'], sp: ['vecina_del_oeste', 'Marta'], jb: ['abuelo_tito', 'Tito'], pu: ['seño_estatal', 'Seño Ana'], sn: ['delegado_de_planta', 'Rubén'], inf: ['changas_del_rulo', 'El Rulo'],
    pym: ['ferreteria_don_luis', 'Don Luis'], ind: ['ingeniera_planta', 'Caro'], agro: ['chacarero_pampa', 'El Vasco'], fin: ['trader_porteño', 'Fede'], jov: ['flor.tiktok', 'Flor'], uni: ['centro_estudiantes', 'Centro de Estudiantes'],
    int: ['tucumano_de_ley', 'Nacho'], rel: ['padre_beto', 'Padre Beto'], mov: ['comedor_los_pibes', 'Comedor Los Pibes'] };
  const SPEECH_POSTS = {
    speechOk: ['Me gustó la cadena nacional, por fin dijo algo claro 👏', 'Buen discurso. A ver si lo cumplen 🤞', 'Hoy sí habló como presidente 🇦🇷'],
    speechBad: ['Otra cadena nacional para no decir nada 🙄', '¿Nos interrumpieron la novela para ESTO? 📺🔥', 'Se escucha el ruidazo desde mi balcón 🥁']
  };
  X.post = (S, kind, extra) => {
    S.feed = S.feed || [];
    const gids = Object.keys(HANDLE), gid = pick(gids);
    S.feed.unshift({ t: S.t, gid, txt: pick(SPEECH_POSTS[kind]), likes: Math.round(200 + Math.random() * 9000), rt: Math.round(30 + Math.random() * 2000), up: kind === 'speechOk', tag: extra });
    S.feed.length = Math.min(S.feed.length, 50);
  };
  // Posteos por tema: [quejas, celebraciones]
  const TWEETS = {
    'Inflación': [['Fui al súper con 20 lucas y volví con dos bolsas', 'Remarcaron los precios mientras hacía la fila', 'El precio de la yerba es un chiste'], ['Primer mes en años que el súper no me asusta', 'Los precios quietos, ¿esto es Suiza?', 'Comparé el ticket con el del mes pasado y es igual']],
    'Salario real': [['Cobré el viernes y el lunes ya no tenía nada', 'Laburo 10 horas y no llego al 20', 'El aguinaldo ya está gastado'], ['Este mes me sobró algo para el asado', 'Por primera vez el sueldo me rindió', 'Pude ahorrar un poquito']],
    'Jubilación real': [['Los remedios cuestan más que mi jubilación', 'Mi abuela eligió entre comer y comprar remedios'], ['La jubilación de mi viejo por fin alcanza', 'Los abuelos respiran un poco']],
    'Empleo': [['Mandé 80 CV y nadie me llama', 'Cerró la fábrica de mi barrio'], ['Conseguí laburo en blanco', 'En mi trabajo están tomando gente otra vez']],
    'Pobreza': [['En el comedor ya no alcanza la comida', 'Cada vez más familias durmiendo en la calle'], ['En el comedor viene menos gente, buena señal', 'Se nota un alivio en el barrio']],
    'Crecimiento': [['Las ventas del local están por el piso', 'Bajé la persiana a las 6 porque no entra nadie'], ['¡Se mueve la economía!', 'Volvieron los clientes al negocio']],
    'Seguridad': [['Me robaron el celu en el colectivo, otra vez', 'No se puede esperar el bondi de noche'], ['El barrio está más tranquilo', 'Volvimos a tomar mate en la vereda']],
    'Libertad cambiaria': [['El blue está por las nubes', 'Quiero comprar 100 dólares y es un trámite'], ['Compré dólares en el home banking en un minuto', 'Se terminó el cepo, por fin']],
    'Riesgo país': [['Nadie le presta un peso a la Argentina', 'Los bonos se desploman'], ['Los bonos argentinos vuelan', 'Vuelven las inversiones']],
    'Educación': [['No hay clases otra vez', 'La escuela de mi hijo se llueve'], ['Mi hija volvió contenta del cole', 'Arreglaron la escuela del barrio']],
    'Salud': [['Tres meses para un turno en el hospital', 'En la guardia no hay ni gasas'], ['Me atendieron rapidísimo en el hospital', 'Llegaron los remedios al centro de salud']],
    'Paz social': [['Otra vez cortada la 9 de Julio', 'Tres horas para llegar al laburo por los piquetes'], ['Llegué al trabajo sin cortes, milagro', 'Las calles están en paz']]
  };
  const EMO = { up: ['🙌', '👏', '🇦🇷', '💪', '😍', '🚀'], dn: ['😡', '🤬', '😩', '💸', '🔥', '😤'] };
  X.monthly = (S, snap) => {
    S.feed = S.feed || [];
    const ch = AR.groups.map(gr => ({ id: gr.id, dv: S.A[gr.id] - snap.A[gr.id], a: S.A[gr.id] })).sort((a, b) => Math.abs(b.dv) - Math.abs(a.dv)).slice(0, 5);
    ch.reverse().forEach(c => {
      const top = AR.groupDrivers(S, c.id).filter(x => !/Afinidad|Clima/.test(x.label))[Math.random() < 0.6 ? 0 : 1] || { label: '', val: c.dv };
      const up = top.val >= 0, pool = (TWEETS[top.label] || [[], []])[up ? 1 : 0];
      const q = (pool.length && Math.random() < 0.7 ? pick(pool) : (ART.quotes[top.label] || [])[up ? 1 : 0]) || ART.shouts[c.id][up ? 1 : 0];
      S.feed.unshift({ t: S.t, gid: c.id, txt: q + ' ' + pick(EMO[up ? 'up' : 'dn']), likes: Math.round((Math.abs(c.dv) + 1) * (300 + Math.random() * 3000)), rt: Math.round((Math.abs(c.dv) + 1) * (40 + Math.random() * 600)), up });
    });
    S.feed.length = Math.min(S.feed.length, 50);
    // tendencias del mes
    const pa = AR.parties[S.party], tags = [];
    tags.push(S.appr >= 50 ? '#Vamos' + pa.short.replace(/\W/g, '') : S.appr < 35 ? '#QueSeVayan' : '#' + pa.short.replace(/\W/g, '') + 'EnDebate');
    ART.situations(S).forEach(s => tags.push('#' + s.name.replace(/\s+(\w)/g, (_, c) => c.toUpperCase()).replace(/[^\wÁÉÍÓÚáéíóúñÑ]/g, '')));
    if (S.m.infM > 5) tags.push('#PreciosPorLasNubes'); if (S.m.gap > 40) tags.push('#DólarBlue'); if (S.m.conf > 55) tags.push('#ParoGeneral');
    const ev = S.news.find(n => n.t >= S.t - 1 && n.tag !== 'INDEC' && n.tag !== 'Mercados'); if (ev) tags.push('#' + ev.txt.split(/[:.]/)[0].split(' ').filter(w => w.length > 3).slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('').replace(/[^\wÁÉÍÓÚáéíóúñÑ]/g, ''));
    tags.push(pick(['#Messi', '#Asado', '#MateConAmigos', '#Superclásico', '#FinDeSemanaLargo', '#Bailando']));
    S.trends = tags.slice(0, 7).map((t2, i) => ({ t: t2, n: Math.round((8 - i) * (5 + Math.random() * 20)) + 'K' }));
  };
  function scrRedes(S) {
    const feed = (S.feed || []).slice(0, 24);
    const posts = feed.length ? feed.map(p => { const h = HANDLE[p.gid]; return '<div class="post ' + (p.up ? 'pup' : 'pdn') + '"><div class="pav">' + ART.avatar(p.gid, p.up ? 1 : -1) + '</div><div class="pb2"><div class="ph2"><b>' + h[1] + '</b><span>@' + h[0] + ' · ' + AR.dateLabel(p.t - 1) + '</span></div><p>' + esc(p.txt) + '</p><div class="pact"><span>💬 ' + Math.round(p.rt / 3) + '</span><span>🔁 ' + p.rt + '</span><span>❤️ ' + p.likes + '</span></div></div></div>'; }).join('') : '<p class="mut">Todavía no hay posteos. Pasá de mes y mirá qué dice la gente.</p>';
    const tr = (S.trends || []).map((x, i) => '<div class="trend"><small>' + (i + 1) + ' · Tendencia en Argentina</small><b>' + esc(x.t) + '</b><small>' + x.n + ' posteos</small></div>').join('') || '<p class="mut">Sin tendencias todavía.</p>';
    return '<h1>📱 Redes sociales</h1><div class="redes"><div class="feed">' + posts + '</div><aside class="trends"><h3>🔥 Tendencias</h3>' + tr + '</aside></div>';
  }

  /* ================= encuestas ================= */
  function nextElection(S) {
    const E = AR.scenario.elections, list = [];
    (E.midterm || []).forEach(t => list.push({ t, k: 'Legislativas' })); if (E.general !== null && E.general !== undefined) list.push({ t: E.general, k: 'Presidenciales' });
    return list.filter(x => x.t >= S.t).sort((a, b) => a.t - b.t)[0] || null;
  }
  function scrEncuestas(S) {
    const sh = AR.shares(S), ord = Object.keys(sh).sort((a, b) => sh[b] - sh[a]), mx = sh[ord[0]] || 1, ne = nextElection(S);
    const bars = ord.map(k => '<div class="eb">' + ART.emblem(AR.parties[k], 30) + '<span>' + AR.parties[k].short + (k === S.party ? ' (vos)' : '') + '</span><div class="track"><i style="width:' + (sh[k] / mx * 100) + '%;background:' + AR.parties[k].color + '"></i></div><b>' + fmt(sh[k], 1) + '%</b></div>').join('');
    const grs = AR.groups.slice().sort((a, b) => S.A[b.id] - S.A[a.id]).map(gr => '<div class="gbar" data-act="open" data-t="grp" data-v="' + gr.id + '"><span class="gfa">' + ART.avatar(gr.id, ART.moodOf(S.A[gr.id])) + '</span><span>' + U.gshort[gr.id] + '</span><div class="track"><i style="width:' + S.A[gr.id] + '%;background:hsl(' + U.hueOf((S.A[gr.id] - 40) / 20) + ' 70% 50%)"></i></div><b>' + fmt(S.A[gr.id]) + '%</b></div>').join('');
    const probs = ART.situations(S).filter(s => !s.good);
    return '<h1>📈 Encuestas</h1>' +
      (ne ? '<div class="countdown"><b>' + (ne.t - S.t + 1) + '</b><span>' + (ne.t - S.t + 1 === 1 ? 'mes' : 'meses') + ' para las ' + ne.k + '<small>' + AR.dateLong(ne.t) + '</small></span></div>' : '') +
      '<div class="grid2"><div class="card"><h4>❤️ Aprobación del gobierno</h4>' + U.lineChart(S.h.appr.length > 1 ? S.h.appr : [S.appr, S.appr], '#f6b40e', 200) + '</div>' +
      '<div class="card"><h4>🗳️ Si las elecciones fueran hoy</h4><div class="ebs">' + bars + '</div></div></div>' +
      '<div class="grid2"><div class="card"><h4>👥 Aprobación por sector</h4>' + grs + '</div><div class="card"><h4>😟 Lo que más preocupa</h4>' +
      (probs.length ? probs.map(s => '<div class="prob2"><i>' + s.icon + '</i><b>' + s.name + '</b><small>' + s.d + '</small></div>').join('') : '<p class="mut">Ningún problema grave domina la agenda. ¡Aprovechalo!</p>') + '</div></div>';
  }

  /* ================= compartir resultado ================= */
  X.share = async () => {
    const S = U.S; if (!S || !S.over) return;
    const s = S.over.summary || AR.summary(S), sc = AR.scenario;
    const txt = '🇦🇷 Goberné la Argentina (' + sc.short + ') con ' + AR.parties[S.party].short + ' y terminé con calificación "' + s.grade + '" (' + s.score + '/100).\n🔥 Inflación anual: ' + fmt(s.infYoy) + '% · 🥣 Pobreza: ' + fmt(s.pov, 1) + '% · ❤️ Aprobación: ' + fmt(s.appr) + '%\n🎯 Objetivos: ' + X.goalCount(S) + '\n¿Vos lo harías mejor?';
    const url = /^https?:/.test(location.protocol) ? location.href.split('#')[0] : '';
    try {
      if (navigator.share) { await navigator.share({ title: 'Argentina: Simulador de Gobierno', text: txt, url: url || undefined }); return; }
      await navigator.clipboard.writeText(txt + (url ? '\n' + url : '')); F.toast('📋 Resultado copiado. ¡Pegalo donde quieras!', 'ok');
    } catch (e) { F.toast('No se pudo compartir desde este navegador.', 'bad'); }
  };

  /* ================= registro en la interfaz ================= */
  X.screens = { objetivos: scrObjetivos, redes: scrRedes, encuestas: scrEncuestas };
  Object.assign(AR.uiActions, {
    diff: el => { SFX.click(); U.diff = el.dataset.v; F.start(); },
    cadena: () => { SFX.click(); X.openSpeech(); },
    speech: el => X.giveSpeech(el.dataset.v),
    install: () => AR.pwa.install(),
    fullscreen: () => AR.pwa.fullscreen(),
    share: () => X.share()
  });
  // al cerrar el resultado de la cadena nacional, la gente reacciona en el tablero
  const prevClose = AR.uiActions.closemodal;
  AR.uiActions.closemodal = el => { prevClose(el); if (U.pendingReact && $('modal').hidden) { const r = U.pendingReact; U.pendingReact = null; U.render(); setTimeout(() => U.react(r, { quiet: true }), 100); } };

  // Atajos de teclado: espacio = siguiente mes
  document.addEventListener('keydown', e => {
    if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    if (e.code === 'Space' && U.S && !U.screen && $('modal').hidden && !U.busy) { e.preventDefault(); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); F.next(); }
  });
})(typeof window !== 'undefined' ? window : globalThis);
