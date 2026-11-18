// Diagnóstico de componentes de la inflación por mes. Uso: node test/diag.js escenario estrategia partido
const path = require('path'); const root = path.join(__dirname, '..', 'js');
['data/parties','data/groups','data/scenario','data/history','data/policies_a','data/policies_b','data/policies_c','data/policies_d','data/policies_e','data/events','data/events_b','data/sc_2015','data/sc_2002','data/sc_1989','engine'].forEach(f => require(path.join(root, f + '.js')));
const AR = globalThis.AR;
const [scn, strat, party] = process.argv.slice(2);
const PL = { dic2015: [[0,'cepo',0],[0,'cambio',4],[0,'retenciones',1],[0,'ret_ind',0],[0,'sub_energia',1],[1,'emit',1],[3,'tasa',3]] };
const S = AR.newGame(party, 7, scn); const plan = PL[scn] || [];
for (let i = 0; i < 24; i++) {
  AR.partyOrder.forEach(k => { if (k !== S.party && S.rel[k] < 50 && S.pc > 25 && S.t % 3 === 0 && AR.parties[k].eco > -0.9) AR.negotiate(S, k, 'fondos'); });
  plan.filter(x => x[0] <= S.t && !x.done).forEach(x => { const r = AR.proposeChange(S, x[1], x[2], AR.routes(S, x[1], x[2])[0]); if (r.ok) x.done = true; });
  while (S.pending.length) { if (S.pending[0] === '__elect') AR.ackElection(S); else AR.resolveEvent(S, 0); }
  AR.endTurn(S); const m = S.m;
  console.log(AR.dateLabel(S.t - 1), 'pi', m.infM.toFixed(1), 'E', m.E.toFixed(1), 'mg', m.mg.toFixed(1), 'rr', m.rr.toFixed(1), 'C', m.C.toFixed(0), 'pb', m.pb.toFixed(1), 'fxO', m.fxOff.toFixed(1), 'fxEq', m.fxEq.toFixed(1), 'gap', m.gap.toFixed(0), 'rer', m.rer.toFixed(0), 'res', m.res.toFixed(1), 'og', m.og.toFixed(1), 'pov', m.pov.toFixed(1), 'RI', S.h.ri[S.h.ri.length-1].toFixed(0), 'rw', m.rw.toFixed(0));
}
