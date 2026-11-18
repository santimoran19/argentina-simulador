/* Logros y consejos del gabinete */
(function (g) {
  'use strict';
  const AR = g.AR;
  const KEY = 'ar-sim-logros';
  const lv = (S, id) => S.pol[id].cur;
  const init = id => AR.pol(id).init;
  const first = (S, k) => S.h[k][S.h[k].length - S.t - 1] !== undefined ? S.h[k][S.h[k].length - S.t - 1] : S.h[k][0];

  AR.ACH = [
    { id: 'primera_ley', icon: '📜', name: 'Ley de la Nación', d: 'Aprobá tu primera ley en el Congreso.', ok: S => S.stats.laws >= 1 },
    { id: 'cinco_leyes', icon: '🏛️', name: 'Constructor de consensos', d: 'Aprobá 5 leyes en una partida.', ok: S => S.stats.laws >= 5 },
    { id: 'decretazo', icon: '🖋️', name: 'Decretazo', d: 'Firmá 3 decretos de necesidad y urgencia.', ok: S => S.stats.dnu >= 3 },
    { id: 'un_digito', icon: '🎯', name: 'Un dígito', d: 'Bajá la inflación mensual a menos del 10% partiendo de más.', ok: S => S.m.infM < 10 && first(S, 'infM') >= 10 && S.t > 0 },
    { id: 'bajo_dos', icon: '🧊', name: 'Inflación de país normal', d: 'Inflación mensual por debajo del 2%.', ok: S => S.m.infM < 2 && S.t > 2 },
    { id: 'sin_cepo', icon: '🔓', name: 'Adiós al cepo', d: 'Levantá el cepo cambiario.', ok: S => lv(S, 'cepo') === 0 && init('cepo') > 0 },
    { id: 'reservas', icon: '🏦', name: 'Bóveda llena', d: 'Pasá las reservas netas a terreno positivo.', ok: S => S.m.res > 0 && first(S, 'res') < 0 },
    { id: 'superavit', icon: '➕', name: 'Superávit', d: 'Lográ superávit fiscal primario.', ok: S => S.m.pb > 0 && S.t > 0 },
    { id: 'riesgo_1000', icon: '📉', name: 'Bajo los mil', d: 'Riesgo país por debajo de 1.000 puntos.', ok: S => S.m.risk < 1000 && S.t > 0 },
    { id: 'riesgo_600', icon: '🚀', name: 'Vuelta al mundo', d: 'Riesgo país por debajo de 600 puntos.', ok: S => S.m.risk < 600 && S.t > 0 },
    { id: 'pobreza', icon: '🌅', name: 'Menos pobres', d: 'Reducí la pobreza 5 puntos respecto del inicio.', ok: S => S.m.pov < S.base.pov - 5 },
    { id: 'empleo', icon: '👷', name: 'Pleno empleo', d: 'Desocupación por debajo del 6% y al menos un punto menor que al inicio.', ok: S => S.m.u < 6 && S.m.u < S.m.b.u - 1 },
    { id: 'crecimiento', icon: '📈', name: 'Tasas chinas', d: 'Crecimiento interanual superior al 6%.', ok: S => AR.gdpYoy(S) > 6 },
    { id: 'popular', icon: '❤️', name: 'Querido por el pueblo', d: 'Aprobación del gobierno superior al 60%.', ok: S => S.appr > 60 },
    { id: 'odiado', icon: '💔', name: 'Que se vayan todos', d: 'Caé por debajo del 25% de aprobación (y sobreviví).', ok: S => S.appr < 25 && !S.over },
    { id: 'todos', icon: '🤝', name: 'Unidad nacional', d: 'Todos los grupos sociales con más de 40% de aprobación.', ok: S => AR.groups.every(x => S.A[x.id] > 40) },
    { id: 'paz', icon: '🕊️', name: 'Paz social', d: 'Conflictividad social por debajo de 20.', ok: S => S.m.conf < 20 },
    { id: 'legislativas', icon: '🗳️', name: 'Ganador de medio término', d: 'Sé la fuerza más votada en las legislativas.', ok: S => S.elect && S.elect.kind === 'midterm' && Object.keys(S.elect.shares).every(k => S.elect.shares[k] <= S.elect.shares[S.party]) },
    { id: 'reelecto', icon: '🏆', name: 'Cuatro años más', d: 'Ganá la elección presidencial.', ok: S => S.elect && S.elect.kind === 'general' && S.elect.reelected },
    { id: 'mandato', icon: '🛡️', name: 'Mandato completo', d: 'Terminá el período sin caer.', ok: S => S.over && S.over.type !== 'caida' },
    { id: 'convertible', icon: '💵', name: 'Uno a uno', d: 'Aplicá la convertibilidad.', ok: S => AR.pol('cambio').levels[lv(S, 'cambio')].fx.fxmode === 'peg' },
    { id: 'dolarizado', icon: '💲', name: 'Dolarizaste', d: 'Reemplazá el peso por el dólar.', ok: S => !!S.dollar },
    { id: 'motosierra', icon: '🪚', name: 'Motosierra', d: 'Aplicá el recorte máximo de la estructura del Estado.', ok: S => lv(S, 'estructura') === 2 },
    { id: 'fmi', icon: '🌐', name: 'Con el Fondo', d: 'Firmá un nuevo programa con el FMI.', ok: S => lv(S, 'fmi') === 2 },
    { id: 'federal', icon: '🤲', name: 'Federalismo de verdad', d: 'Aprobá un nuevo pacto de coparticipación con las provincias.', ok: S => lv(S, 'coparticipacion') === 1 },
    { id: 'campeon', icon: '⚽', name: '¡Campeones!', d: 'La Selección sale campeona durante tu mandato.', ok: S => !!(S.ctx.copa || S.ctx.mundial) },
    { id: 'hiper', icon: '🧯', name: 'Apagaste el incendio', d: 'En 1989, bajá la inflación mensual a menos del 5%.', ok: S => S.scn === 'jul1989' && S.m.infM < 5 },
    { id: 'salida2001', icon: '🌄', name: 'Salir del infierno', d: 'En 2002, bajá la desocupación a menos del 14%.', ok: S => S.scn === 'ene2002' && S.m.u < 14 }
  ];
  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { store = {}; }
  AR.ach = {
    all: () => AR.ACH.map(a => Object.assign({ got: !!store[a.id] }, a)),
    count: () => Object.keys(store).length,
    // Devuelve los logros recién desbloqueados en esta partida
    check(S) {
      S.ach = S.ach || [];
      const fresh = [];
      AR.ACH.forEach(a => {
        if (S.ach.includes(a.id)) return;
        let ok = false; try { ok = a.ok(S); } catch (e) { ok = false; }
        if (ok) { S.ach.push(a.id); if (!store[a.id]) { store[a.id] = Date.now(); fresh.push(a); } }
      });
      if (fresh.length) { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) { /* nada */ } }
      return fresh;
    }
  };

  /* -------- gabinete: consejos según el problema más grave -------- */
  AR.advisor = function (S) {
    const m = S.m, E = AR.scenario.elections, cepo = AR.pol('cepo').levels[lv(S, 'cepo')].fx.cepo;
    const nextE = [E.general].concat(E.midterm || []).filter(x => x !== null && x !== undefined && x >= S.t).sort((a, b) => a - b)[0];
    const worst = AR.groups.slice().sort((a, b) => S.A[a.id] - S.A[b.id])[0];
    const tips = [];
    if (m.infM > 8) tips.push({ who: 'eco', p: 10, t: 'La inflación del ' + m.infM.toFixed(1) + '% mensual es la prioridad. Sin ancla no baja: mirá la emisión para el Tesoro 🖨️, el déficit 🧮 y el tipo de cambio 💱.', fx: ['emit', 'cambio'] });
    if (m.gap > 60 && cepo > 0) tips.push({ who: 'eco', p: 9, t: 'La brecha cambiaria es del ' + Math.round(m.gap) + '%. Nadie liquida dólares al oficial y el Banco Central se desangra. Pensá en una devaluación o en cambiar el régimen 💱.', fx: ['cambio'] });
    if (AR.rs(S) < -5) tips.push({ who: 'eco', p: 8, t: 'Las reservas netas están en rojo. Un acuerdo con el FMI 🌐, bajar retenciones 🌾 o exportar energía 🛢️ trae dólares.', fx: ['fmi', 'retenciones', 'energia'] });
    if (m.pb < -2) tips.push({ who: 'eco', p: 7, t: 'El déficit primario es del ' + m.pb.toFixed(1) + '% del PBI y se financia emitiendo. Subsidios 💡, obra pública 🏗️ y estructura del Estado 🪚 son las palancas.', fx: ['sub_energia', 'obras', 'estructura'] });
    if (S.appr < 35) tips.push({ who: 'jef', p: 8, t: 'Estamos en ' + Math.round(S.appr) + '% de aprobación. El sector más enojado es ' + worst.name + ' (' + Math.round(S.A[worst.id]) + '%). Hay que darles algo.' });
    if (m.conf > 60) tips.push({ who: 'jef', p: 7, t: 'La calle está caliente: conflictividad ' + Math.round(m.conf) + '. Abrí el diálogo con la CGT y las organizaciones o vas a tener paros.' });
    if (S.pc < 8) tips.push({ who: 'jef', p: 6, t: 'Nos queda poco capital político. Esperemos un mes y priorizá medidas por decreto, que son más baratas.' });
    if (m.pov > 45) tips.push({ who: 'jef', p: 6, t: 'La pobreza ronda el ' + Math.round(m.pov) + '%. Reforzar la AUH y la Tarjeta Alimentar 🍲 alivia rápido.', fx: ['asistencia'] });
    if (nextE !== undefined && nextE - S.t <= 4) tips.push({ who: 'jef', p: 9, t: 'Faltan ' + (nextE - S.t) + ' meses para las elecciones. No es momento de medidas impopulares.' });
    if (!tips.length) tips.push({ who: 'jef', p: 1, t: 'Vamos bien, Presidente. Sostené el rumbo y cuidá la relación con el Congreso 🏛️.' });
    return tips.sort((a, b) => b.p - a.p)[0];
  };
})(typeof window !== 'undefined' ? window : globalThis);
