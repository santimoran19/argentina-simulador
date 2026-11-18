// Uso: npm i --no-save @tabler/icons@3.19.0 && node tools/build-icons.js
const fs = require('fs');
// Extrae de Tabler Icons sólo los íconos que usa el juego y genera js/ui/icons.js
const DIR = require.resolve.paths('@tabler/icons').map(d => d + '/@tabler/icons/icons/outline/').find(d => fs.existsSync(d));
const MAP = {
  pol: {
    tasa: 'percentage', cambio: 'arrows-exchange', cepo: 'lock', emit: 'printer', overhang: 'stack-2', credito: 'credit-card', deuda: 'file-invoice', fmi: 'world-dollar', blanqueo: 'cash-banknote', bancos: 'pig-money',
    iva: 'receipt-tax', ganancias: 'report-money', retenciones: 'plant-2', ret_ind: 'building-factory-2', bienes: 'home-dollar', estructura: 'sitemap', privat: 'tag', coparticipacion: 'chart-pie', monotributo: 'id-badge-2', evasion: 'zoom-money',
    jubilaciones: 'old', moratoria: 'calendar-plus', regimenes: 'scale', paritarias_pub: 'briefcase', asistencia: 'heart-handshake', sub_energia: 'bulb', sub_transp: 'bus', obras: 'crane', transferencias: 'map-2', pami: 'pill',
    paritarias: 'users-group', salario_min: 'coins', reforma_lab: 'tool', sindicatos: 'flag', empleo_reg: 'file-certificate', precios: 'shopping-cart', vivienda: 'key', jornada: 'clock-hour-8', plataformas: 'moped',
    aranceles: 'ship', rigi: 'diamond', energia: 'gas-station', mineria: 'pick', mercosur: 'world-share', turismo: 'luggage', tdf: 'device-mobile', conocimiento: 'code', hidrovia: 'anchor',
    exterior: 'world', seguridad: 'shield-check', protesta: 'barrier-block', narco: 'spy', justicia: 'gavel', defensa: 'shield', armas: 'target-arrow', carceles: 'fence', migracion: 'plane-arrival',
    educacion: 'school', universidades: 'certificate', ciencia: 'microscope', salud: 'first-aid-kit', ive: 'gender-female', diversidad: 'rainbow', medios: 'device-tv', cultura: 'masks-theater', futbol: 'ball-football', comedores: 'tools-kitchen-2',
    electoral: 'checkbox', ficha: 'user-x', anticorrupcion: 'search', malvinas: 'map-pin', memoria: 'flame', inteligencia: 'eye', acceso_info: 'folder-open'
  },
  ind: { infl: 'trending-up', dolar: 'currency-dollar', reservas: 'building-bank', riesgo: 'chart-line', deficit: 'calculator', pbi: 'chart-bar', desempleo: 'briefcase-off', pobreza: 'bowl', salario: 'wallet', jubilacion: 'old', inseguridad: 'alert-triangle', conflicto: 'speakerphone', instituciones: 'building-community', educacion: 'school', salud: 'heartbeat' },
  grp: { cm: 'home', sp: 'users', jb: 'old', pu: 'id', sn: 'flag', inf: 'hammer', pym: 'building-store', ind: 'building-factory', agro: 'tractor', fin: 'chart-candle', jov: 'headphones', uni: 'school', int: 'map', rel: 'building-church', mov: 'users-group' },
  cat: { mon: 'building-bank', fis: 'receipt', gas: 'wallet', tra: 'briefcase', pro: 'building-factory-2', seg: 'shield', soc: 'school', ins: 'building-community' },
  ui: { congreso: 'building-community', economia: 'chart-bar', encuestas: 'chart-line', redes: 'message-circle', objetivos: 'target', logros: 'trophy', archivo: 'book', menu: 'settings', sonido: 'volume', mudo: 'volume-off', cadena: 'device-tv',
    capital: 'coin', gob: 'building-community', next: 'player-play', close: 'x', up: 'caret-up', down: 'caret-down', check: 'check', clock: 'hourglass', pen: 'writing-sign', law: 'file-text', vote: 'checkbox', bolt: 'bolt', alert: 'alert-triangle', star: 'star', info: 'info-circle', share: 'share', install: 'download', full: 'maximize', help: 'help-circle', reload: 'refresh', news: 'news', heart: 'heart', repeat: 'repeat', comment: 'message' }
};
const names = new Set(); Object.values(MAP).forEach(m => Object.values(m).forEach(n => names.add(n)));
require('./icons-extra.json').forEach(n => names.add(n)); ['mood-happy', 'mood-angry', 'arrow-up-right', 'arrow-down-right', 'chevron-right'].forEach(n => names.add(n));
const out = {}, missing = [];
for (const n of names) {
  const f = DIR + n + '.svg';
  if (!fs.existsSync(f)) { missing.push(n); continue; }
  const svg = fs.readFileSync(f, 'utf8');
  out[n] = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*\/>/, '').replace(/\s+/g, ' ').trim();
}
if (missing.length) { console.log('FALTAN:', missing.join(', ')); process.exit(1); }
const js = '/* Íconos: subconjunto de Tabler Icons (MIT, https://tabler.io/icons) generado por build-icons.js */\n(function (g) {\n  \'use strict\';\n  const AR = g.AR;\n  const P = ' + JSON.stringify(out) + ';\n  const M = ' + JSON.stringify(MAP) + ';\n' +
  '  AR.icon = (name, cls) => \'<svg class="ic\' + (cls ? \' \' + cls : \'\') + \'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">\' + (P[name] || P[M.ui.info]) + \'</svg>\';\n' +
  '  AR.iconOf = (kind, id, cls) => AR.icon((M[kind] && M[kind][id]) || M.ui.info, cls);\n})(typeof window !== \'undefined\' ? window : globalThis);\n';
fs.writeFileSync(__dirname + '/../js/ui/icons.js', js);
console.log('ok', names.size, 'íconos,', js.length, 'bytes');
