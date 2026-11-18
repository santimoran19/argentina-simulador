// Prueba de humo y calibración. Uso: node test/smoke.js <escenario> <estrategia> <partido> [seed] [verbose]
const path = require('path');
const root = path.join(__dirname, '..', 'js');
['data/parties', 'data/groups', 'data/scenario', 'data/history', 'data/policies_a', 'data/policies_b', 'data/policies_c', 'data/policies_d', 'data/policies_e', 'data/events', 'data/events_b', 'data/sc_2015', 'data/sc_2002', 'data/sc_1989', 'engine']
  .forEach(f => require(path.join(root, f + '.js')));
const AR = globalThis.AR;

// [mes, politica, nivel]
const PLANS = {
  dic2023: {
    nada: [], ajuste: [[0, 'cambio', 1], [0, 'emit', 0], [0, 'overhang', 1], [0, 'sub_energia', 1], [0, 'obras', 1], [0, 'jubilaciones', 1], [0, 'paritarias_pub', 1], [0, 'transferencias', 1],
      [0, 'paritarias', 2], [0, 'tasa', 2], [0, 'asistencia', 1], [0, 'estructura', 1], [0, 'precios', 1], [0, 'salario_min', 1], [6, 'cepo', 1], [8, 'tasa', 1], [12, 'cambio', 2], [18, 'cambio', 3], [20, 'cepo', 0]]
  },
  dic2015: {
    nada: [], gradual: [[0, 'cepo', 0], [0, 'cambio', 4], [0, 'retenciones', 1], [0, 'ret_ind', 0], [0, 'sub_energia', 1], [1, 'emit', 1], [3, 'tasa', 3], [6, 'sub_transp', 1], [10, 'obras', 2], [12, 'sub_energia', 2], [14, 'emit', 0]]
  },
  ene2002: {
    nada: [], estabilizar: [[0, 'cambio', 4], [0, 'retenciones', 2], [0, 'asistencia', 1], [1, 'emit', 1], [3, 'tasa', 2], [8, 'bancos', 0], [8, 'cepo', 1]]
  },
  jul1989: {
    nada: [], ancla: [[0, 'cambio', 4], [0, 'emit', 1], [0, 'privat', 1], [2, 'estructura', 1], [4, 'precios', 2], [6, 'privat', 2], [8, 'tasa', 8], [10, 'overhang', 0], [12, 'aranceles', 1], [14, 'emit', 0], [16, 'tasa', 5]]
  }
};

function run(scn, strat, party, seed, verbose) {
  const S = AR.newGame(party, seed, scn);
  const rows = [], plan = (PLANS[scn] || {})[strat] || [];
  const act = (p, i) => AR.proposeChange(S, p, i, AR.routes(S, p, i)[0]);
  if (scn === 'dic2023' && strat === 'ajuste') AR.devalue(S, 118);
  let guard = 0;
  while (!S.over && guard++ < 80) {
    AR.partyOrder.forEach(k => { if (k !== S.party && S.rel[k] < 50 && S.pc > 25 && S.t % 3 === 0 && AR.parties[k].eco > -0.9) AR.negotiate(S, k, AR.parties[k].fed || AR.parties[k].cash ? 'fondos' : 'dialogo'); });
    plan.filter(x => x[0] <= S.t && !x.done && S.t - x[0] < 8).forEach(x => { const r = act(x[1], x[2]); if (r.ok || /ya está/.test(r.msg)) x.done = true; if (verbose && !r.ok && S.t === x[0]) console.log('  (' + AR.dateLabel(S.t) + ') ' + x[1] + '->' + x[2] + ': ' + r.msg); });
    while (S.pending.length) { if (S.pending[0] === '__elect') AR.ackElection(S); else AR.resolveEvent(S, process.env.CHOICE === 'last' ? AR.eventById(S.pending[0]).choices.length - 1 : 0); }
    AR.endTurn(S);
    const m = S.m;
    for (const k of Object.keys(m)) if (typeof m[k] === 'number' && !isFinite(m[k])) { console.log('NaN en', k, 't=', S.t); process.exit(1); }
    rows.push([AR.dateLabel(S.t - 1), m.infM.toFixed(1), m.fxOff.toFixed(m.fxOff < 20 ? 2 : 0), Math.round(m.gap), m.res.toFixed(1), m.risk, m.u.toFixed(1), m.pov.toFixed(1), m.rw.toFixed(0), m.rPen.toFixed(0), m.pb.toFixed(1), S.appr.toFixed(0), S.pc.toFixed(0), AR.gdpYoy(S).toFixed(1), m.C.toFixed(0)]);
  }
  return { S, rows };
}

const [scn = 'dic2023', strat = 'nada', party = 'LLA', seedArg = '7', verbose] = process.argv.slice(2);
const { S, rows } = run(scn, strat, party, parseInt(seedArg, 10), verbose);
console.log('mes     inf%  oficial brecha res    riesgo u%   pob%  salR  jubR  pb   aprob PC  PBIyoy C');
const step = rows.length > 30 ? 3 : 2;
rows.forEach((r, i) => { if (i % step === 0 || i === rows.length - 1) console.log(r.map((x, j) => String(x).padEnd(j === 0 ? 9 : 6)).join('')); });
console.log('Fin:', S.over ? S.over.title : 'en curso', '| t=', S.t);
if (S.elect) console.log('Elección:', S.elect.kind, JSON.stringify(Object.fromEntries(Object.entries(S.elect.shares).map(([k, v]) => [k, +v.toFixed(1)]))));
const sm = AR.summary(S);
console.log('Resumen:', JSON.stringify({ infYoy: Math.round(sm.infYoy), pov: +sm.pov.toFixed(1), u: +sm.u.toFixed(1), gdp: +sm.gdp.toFixed(1), res: +sm.res.toFixed(1), risk: sm.risk, score: sm.score, grade: sm.grade, arq: sm.archetype }));
