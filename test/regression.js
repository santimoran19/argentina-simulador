// Regresión de calibración: node test/regression.js
// Verifica invariantes del modelo en los cuatro escenarios con varias semillas.
const { execFileSync } = require('child_process');
const path = require('path');
const smoke = path.join(__dirname, 'smoke.js');
const SEEDS = [1, 2, 3, 4, 5];
const CASES = [
  { id: 'a', scn: 'dic2023', strat: 'ajuste', party: 'LLA', env: {} },
  { id: 'b', scn: 'dic2023', strat: 'nada', party: 'LLA', env: {} },
  { id: 'c', scn: 'dic2015', strat: 'gradual', party: 'PRO', env: {} },
  { id: 'd', scn: 'dic2015', strat: 'nada', party: 'PRO', env: { CHOICE: 'last' } },
  { id: 'e', scn: 'jul1989', strat: 'ancla', party: 'PJ', env: {} },
  { id: 'f', scn: 'jul1989', strat: 'nada', party: 'PJ', env: { CHOICE: 'last' } },
  { id: 'g', scn: 'ene2002', strat: 'estabilizar', party: 'PJ', env: {} },
  { id: 'h', scn: 'ene2002', strat: 'nada', party: 'PJ', env: { CHOICE: 'last' } }
];
const out = {};
for (const c of CASES) {
  out[c.id] = SEEDS.map(seed => {
    const txt = execFileSync('node', [smoke, c.scn, c.strat, c.party, String(seed)], { env: Object.assign({}, process.env, c.env), encoding: 'utf8' });
    if (/NaN en/.test(txt)) throw new Error('NaN en ' + c.id + ' seed ' + seed);
    return JSON.parse(txt.split('\n').find(l => l.startsWith('Resumen:')).slice(9));
  });
}
const avg = (id, k) => out[id].reduce((s, r) => s + r[k], 0) / SEEDS.length;
const checks = [
  ['2023: ajustar supera a no hacer nada (>= 15 pts)', avg('a', 'score') - avg('b', 'score') >= 15],
  ['2023: la inacción termina en pobreza > 55%', avg('b', 'pov') > 55],
  ['2023: el ajuste baja la inflación anual de 161% a < 80%', avg('a', 'infYoy') < 80],
  ['2023: el ajuste mantiene la pobreza entre 25% y 55%', avg('a', 'pov') > 25 && avg('a', 'pov') < 55],
  ['2015: el gradualismo supera a la pasividad', avg('c', 'score') > avg('d', 'score')],
  ['2015: inflación anual del gradualismo entre 20% y 120%', avg('c', 'infYoy') > 20 && avg('c', 'infYoy') < 120],
  ['2015: pobreza entre 28% y 45% con gradualismo', avg('c', 'pov') > 28 && avg('c', 'pov') < 45],
  ['1989: el plan de ancla supera a la pasividad (>= 8 pts)', avg('e', 'score') - avg('f', 'score') >= 8],
  ['1989: la pasividad deja inflación anual > 300%', avg('f', 'infYoy') > 300],
  ['2002: la pobreza sube respecto a 35% al inicio', avg('g', 'pov') > 40],
  ['2002: la desocupación baja de 18% a < 14%', avg('g', 'u') < 14]
];
let bad = 0;
for (const [name, ok] of checks) { console.log((ok ? 'OK   ' : 'FALLA') + ' ' + name); if (!ok) bad++; }
console.log('\nPromedios de puntaje:', Object.fromEntries(Object.keys(out).map(k => [k, Math.round(avg(k, 'score'))])));
process.exit(bad ? 1 : 0);
