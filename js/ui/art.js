/* Arte del juego: personajes, emblemas, escenas e íconos (todo SVG/emoji, sin archivos externos) */
(function (g) {
  'use strict';
  const AR = g.AR;
  const ART = AR.art = {};

  /* ---------------- personajes de los sectores ---------------- */
  const LOOK = {
    cm: { skin: '#f1c27d', hair: '#5a3825', hs: 'short', shirt: '#7fb3e0', acc: ['glasses'] },
    sp: { skin: '#c68642', hair: '#1c1c1c', hs: 'short', shirt: '#d9534f', acc: [] },
    jb: { skin: '#f5cfa0', hair: '#d8d8d8', hs: 'bald', shirt: '#b89b72', acc: ['glasses', 'mustache'] },
    pu: { skin: '#e0ac69', hair: '#6b4226', hs: 'bun', shirt: '#2f4b7c', acc: ['badge'] },
    sn: { skin: '#c68642', hair: '#2b2b2b', hs: 'short', shirt: '#2e8b57', acc: ['mustache', 'cap'], capc: '#1e5631' },
    inf: { skin: '#8d5524', hair: '#1c1c1c', hs: 'short', shirt: '#f08a24', acc: ['cap'], capc: '#c0392b' },
    pym: { skin: '#e0ac69', hair: '#3b2a1a', hs: 'short', shirt: '#4a7ab0', acc: ['apron'] },
    ind: { skin: '#f1c27d', hair: '#3b2a1a', hs: 'short', shirt: '#5d6d7e', acc: ['tie', 'hardhat'] },
    agro: { skin: '#d8a26e', hair: '#4a3020', hs: 'short', shirt: '#8e5b3a', acc: ['mustache', 'boina'] },
    fin: { skin: '#f1c27d', hair: '#222222', hs: 'slick', shirt: '#1f2a44', acc: ['tie'] },
    jov: { skin: '#e8b88a', hair: '#2b1b0e', hs: 'long', shirt: '#7d3c98', acc: ['earbuds', 'cap'], capc: '#111111' },
    uni: { skin: '#f1c27d', hair: '#8b4513', hs: 'long', shirt: '#2e8b57', acc: ['glasses'] },
    int: { skin: '#c68642', hair: '#1c1c1c', hs: 'short', shirt: '#a93226', acc: ['poncho', 'hat'] },
    rel: { skin: '#f5cfa0', hair: '#9e9e9e', hs: 'short', shirt: '#222222', acc: ['collar'] },
    mov: { skin: '#a0522d', hair: '#1c1c1c', hs: 'curly', shirt: '#c0392b', acc: ['headband'] },
    // asesores (ficticios)
    eco: { skin: '#f1c27d', hair: '#4a3020', hs: 'bun', shirt: '#2c3e50', acc: ['glasses'] },
    jef: { skin: '#e0ac69', hair: '#2b2b2b', hs: 'slick', shirt: '#34495e', acc: ['tie'] }
  };
  const HAIR = {
    short: c => '<path d="M31 43 C29 19 71 19 69 43 C66 31 58 27 50 28 C42 27 34 31 31 43Z" fill="' + c + '"/>',
    slick: c => '<path d="M31 42 C29 18 71 18 69 42 C67 30 60 26 52 27 L46 33 C40 30 34 33 31 42Z" fill="' + c + '"/>',
    long: c => '<path d="M31 43 C29 19 71 19 69 43 C66 31 58 27 50 28 C42 27 34 31 31 43Z" fill="' + c + '"/><path d="M31 40 C27 56 29 68 37 72 L37 46Z M69 40 C73 56 71 68 63 72 L63 46Z" fill="' + c + '"/>',
    bun: c => '<circle cx="50" cy="20" r="7" fill="' + c + '"/><path d="M31 43 C29 19 71 19 69 43 C66 31 58 27 50 28 C42 27 34 31 31 43Z" fill="' + c + '"/>',
    bald: c => '<path d="M31 47 C29 38 33 33 37 35 L37 48Z M69 47 C71 38 67 33 63 35 L63 48Z" fill="' + c + '"/>',
    curly: c => [30, 38, 46, 54, 62, 70].map((x, i) => '<circle cx="' + x + '" cy="' + (i === 0 || i === 5 ? 36 : 26) + '" r="8" fill="' + c + '"/>').join('')
  };
  const ACC = {
    glasses: () => '<g fill="none" stroke="#2b2b2b" stroke-width="1.6"><circle cx="43" cy="44" r="5"/><circle cx="57" cy="44" r="5"/><path d="M48 44 L52 44"/></g>',
    mustache: L => '<path d="M42 52 Q50 48 58 52 Q50 55 42 52Z" fill="' + L.hair + '"/>',
    cap: L => '<path d="M30 37 C31 18 69 18 70 37 Z" fill="' + (L.capc || '#333') + '"/><path d="M50 33 L80 36 L78 40 L50 38Z" fill="' + (L.capc || '#333') + '"/>',
    hardhat: () => '<path d="M28 39 C28 15 72 15 72 39 Z" fill="#f4c20d"/><rect x="25" y="36" width="50" height="5" rx="2" fill="#e0a800"/>',
    boina: () => '<ellipse cx="47" cy="25" rx="21" ry="8" fill="#2b2b2b" transform="rotate(-8 47 25)"/>',
    hat: () => '<ellipse cx="50" cy="28" rx="30" ry="6" fill="#6e4b2a"/><path d="M36 28 C36 13 64 13 64 28Z" fill="#7d5a36"/>',
    tie: () => '<path d="M44 70 L50 78 L56 70Z" fill="#fff"/><path d="M48.5 74 L51.5 74 L54 88 L50 94 L46 88Z" fill="#c0392b"/>',
    apron: () => '<path d="M36 76 L64 76 L66 100 L34 100Z" fill="#f4f4f4"/><path d="M38 76 L44 70 M62 76 L56 70" stroke="#ddd" stroke-width="2"/>',
    badge: () => '<rect x="56" y="80" width="10" height="7" rx="1" fill="#fff"/><rect x="58" y="82" width="6" height="1.6" fill="#2f4b7c"/>',
    poncho: () => '<path d="M14 100 C14 78 30 70 50 70 C70 70 86 78 86 100 Z" fill="#a93226"/><path d="M20 88 L80 88 M17 94 L83 94" stroke="#1c1c1c" stroke-width="2"/><path d="M22 91 L78 91" stroke="#f4f4f4" stroke-width="1.4"/>',
    collar: () => '<rect x="46" y="68" width="8" height="5" rx="1" fill="#fff"/>',
    headband: () => '<rect x="30" y="32" width="40" height="5" rx="2" fill="#e74c3c"/><path d="M68 35 L76 40 L72 42Z" fill="#e74c3c"/>',
    earbuds: () => '<circle cx="31" cy="49" r="2.5" fill="#fff"/><circle cx="69" cy="49" r="2.5" fill="#fff"/>'
  };
  // mood: -1 enojado, 0 neutral, 1 contento
  ART.face = function (id, mood) {
    const L = LOOK[id] || LOOK.cm, md = mood > 0.33 ? 1 : mood < -0.33 ? -1 : 0;
    const brows = md === 1 ? 'M39 37 Q43 35 47 37 M53 37 Q57 35 61 37' : md === -1 ? 'M39 35 L47 38 M53 38 L61 35' : 'M39 37 L47 37 M53 37 L61 37';
    const mouth = md === 1 ? 'M42 54 Q50 62 58 54' : md === -1 ? 'M43 59 Q50 52 57 59' : 'M44 56 L56 56';
    const acc = L.acc || [];
    const pre = acc.filter(a => a === 'poncho').map(a => ACC[a](L)).join('');
    const top = acc.filter(a => ['cap', 'hardhat', 'boina', 'hat', 'headband'].includes(a)).map(a => ACC[a](L)).join('');
    const mid = acc.filter(a => !['cap', 'hardhat', 'boina', 'hat', 'headband', 'poncho'].includes(a)).map(a => ACC[a](L)).join('');
    return '<svg viewBox="0 0 100 100" class="av" aria-hidden="true">' +
      '<path d="M14 100 C14 78 30 70 50 70 C70 70 86 78 86 100 Z" fill="' + L.shirt + '"/>' + pre +
      '<rect x="44" y="57" width="12" height="15" fill="' + L.skin + '"/>' +
      '<circle cx="32" cy="45" r="4" fill="' + L.skin + '"/><circle cx="68" cy="45" r="4" fill="' + L.skin + '"/>' +
      '<ellipse cx="50" cy="43" rx="18" ry="20" fill="' + L.skin + '"/>' + HAIR[L.hs](L.hair) +
      '<circle cx="43" cy="44" r="2.3" fill="#24180f"/><circle cx="57" cy="44" r="2.3" fill="#24180f"/>' +
      '<path d="' + brows + '" stroke="#3a2a1a" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M50 46 L48 51 L51 51" stroke="#00000033" stroke-width="1.2" fill="none"/>' +
      '<path d="' + mouth + '" stroke="#7a2e2e" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      (md === 1 ? '<circle cx="38" cy="51" r="3" fill="#ff7b7b55"/><circle cx="62" cy="51" r="3" fill="#ff7b7b55"/>' : '') +
      mid + top + '</svg>';
  };
  ART.moodOf = a => (a - 45) / 20;
  // Sector: círculo claro con pictograma; el anillo exterior dice el humor (verde, ámbar o rojo)
  ART.avatar = function (id, mood) {
    const md = mood > 0.33 ? 'ok' : mood < -0.33 ? 'bad' : 'mid', ic = AR.iconOf('grp', id, 'gico');
    return '<span class="av gp ' + md + '">' + ic + '</span>';
  };

  /* ---------------- emblemas de partido ---------------- */
  ART.emblem = function (p, size) {
    const s = size || 40, txt = (p.short || p.id).replace(/[^A-Za-zÁÉÍÓÚÑ\-]/g, '').slice(0, 4).toUpperCase();
    const dark = ['#F2B705', '#F2B705'].includes(p.color);
    return '<svg viewBox="0 0 40 40" width="' + s + '" height="' + s + '" class="emb"><circle cx="20" cy="20" r="19" fill="' + p.color + '" stroke="#ffffff55" stroke-width="2"/>' +
      '<text x="20" y="24.5" text-anchor="middle" font-size="' + (txt.length > 3 ? 10 : 12) + '" font-weight="800" fill="' + (dark ? '#1b1b1b' : '#fff') + '" font-family="Barlow Semi Condensed, Arial Narrow, sans-serif">' + txt + '</text></svg>';
  };

  /* ---------------- escenas ilustradas para eventos ---------------- */
  const sky = (a, b) => '<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs><rect width="640" height="240" fill="url(#sk)"/>';
  const city = col => '<path d="M0 170 L0 120 L40 120 L40 95 L70 95 L70 130 L110 130 L110 80 L150 80 L150 125 L190 125 L190 100 L230 100 L230 140 L280 140 L280 90 L320 90 L320 130 L370 130 L370 105 L410 105 L410 135 L460 135 L460 85 L500 85 L500 125 L540 125 L540 100 L590 100 L590 130 L640 130 L640 170Z" fill="' + col + '"/>';
  const crowd = (col, n, y) => { let o = ''; for (let i = 0; i < n; i++) { const x = (i + 0.5) * 640 / n + (i % 2 ? 6 : -6), yy = y + (i % 3) * 6; o += '<circle cx="' + x + '" cy="' + yy + '" r="11" fill="' + col + '"/><rect x="' + (x - 13) + '" y="' + (yy + 9) + '" width="26" height="40" rx="10" fill="' + col + '"/>'; } return o; };
  const flags = () => { let o = ''; [80, 210, 330, 470, 580].forEach((x, i) => { o += '<line x1="' + x + '" y1="190" x2="' + x + '" y2="' + (110 + i % 2 * 12) + '" stroke="#ddd" stroke-width="3"/><g transform="translate(' + x + ',' + (110 + i % 2 * 12) + ')"><rect width="46" height="10" fill="#74acdf"/><rect y="10" width="46" height="10" fill="#fff"/><rect y="20" width="46" height="10" fill="#74acdf"/><circle cx="23" cy="15" r="3.5" fill="#f6b40e"/></g>'; }); return o; };
  const SCENES = {
    calle: () => sky('#1d3557', '#457b9d') + city('#14213d') + flags() + crowd('#0b132b', 16, 185),
    fuego: () => sky('#3d0c02', '#a4161a') + city('#1a0503') + '<path d="M300 240 Q310 170 330 190 Q340 140 360 200 Q380 160 380 240Z" fill="#f48c06"/><path d="M315 240 Q325 200 338 210 Q348 180 360 220 Q368 205 368 240Z" fill="#ffba08"/>' + crowd('#000', 14, 190),
    congreso: () => sky('#0f2a47', '#2a6f97') + '<rect x="120" y="150" width="400" height="90" fill="#d9d2c0"/><rect x="180" y="110" width="280" height="45" fill="#e8e1cf"/><path d="M240 110 Q320 20 400 110Z" fill="#7aa874"/><rect x="314" y="18" width="12" height="22" fill="#e8e1cf"/>' +
      [140, 175, 210, 245, 280, 315, 350, 385, 420, 455, 490].map(x => '<rect x="' + x + '" y="160" width="12" height="70" fill="#bfb6a0"/>').join('') + '<rect x="100" y="228" width="440" height="12" fill="#a39b86"/>',
    casa: () => sky('#264653', '#8ab6d6') + '<rect x="80" y="100" width="480" height="140" fill="#e8a0a8"/><rect x="250" y="70" width="140" height="40" fill="#e09098"/><path d="M250 70 L320 40 L390 70Z" fill="#d88a92"/>' +
      [110, 170, 230, 290, 350, 410, 470, 520].map(x => '<path d="M' + x + ' 240 L' + x + ' 170 Q' + (x + 15) + ' 150 ' + (x + 30) + ' 170 L' + (x + 30) + ' 240Z" fill="#9b5d66"/>').join('') + '<rect x="314" y="24" width="3" height="20" fill="#555"/><rect x="317" y="24" width="20" height="5" fill="#74acdf"/><rect x="317" y="29" width="20" height="4" fill="#fff"/><rect x="317" y="33" width="20" height="5" fill="#74acdf"/>',
    mercado: () => '<rect width="640" height="240" fill="#0b1220"/>' + [40, 80, 120, 160, 200].map(y => '<line x1="0" x2="640" y1="' + y + '" y2="' + y + '" stroke="#1d2b44"/>').join('') +
      '<polyline points="0,60 60,70 120,55 180,90 240,80 300,120 360,110 420,160 480,150 540,200 640,215" fill="none" stroke="#ef4444" stroke-width="5"/><text x="560" y="70" font-size="64" fill="#ef444455" font-weight="900">$</text><text x="40" y="200" font-size="48" fill="#22c55e33" font-weight="900">US$</text>',
    mercadoBueno: () => '<rect width="640" height="240" fill="#071a12"/>' + [40, 80, 120, 160, 200].map(y => '<line x1="0" x2="640" y1="' + y + '" y2="' + y + '" stroke="#12382a"/>').join('') +
      '<polyline points="0,210 60,200 120,205 180,170 240,175 300,140 360,150 420,110 480,105 540,70 640,50" fill="none" stroke="#22c55e" stroke-width="5"/><text x="540" y="200" font-size="64" fill="#22c55e33" font-weight="900">▲</text>',
    banco: () => sky('#2b2d42', '#8d99ae') + '<rect x="160" y="70" width="320" height="150" fill="#d6d3cc"/><path d="M150 70 L320 25 L490 70Z" fill="#c4c0b8"/>' + [190, 250, 310, 370, 430].map(x => '<rect x="' + x + '" y="85" width="18" height="120" fill="#b5b0a6"/>').join('') +
      '<rect x="270" y="150" width="100" height="40" fill="#b91c1c"/><text x="320" y="177" font-size="20" fill="#fff" text-anchor="middle" font-weight="800">CERRADO</text>' + crowd('#1b1b2f', 12, 205),
    seco: () => sky('#f4a261', '#f8d38a') + '<circle cx="520" cy="60" r="38" fill="#ffd166"/><rect y="170" width="640" height="70" fill="#c9a66b"/><path d="M40 200 L90 190 L120 210 M200 190 L260 205 L300 195 M380 210 L430 195 L470 212 M520 195 L580 205" stroke="#8a6d3b" stroke-width="3" fill="none"/>' +
      [100, 220, 340, 460].map(x => '<path d="M' + x + ' 170 L' + x + ' 140 M' + (x - 8) + ' 152 L' + x + ' 146 M' + (x + 8) + ' 156 L' + x + ' 150" stroke="#7a5c2e" stroke-width="2.5"/>').join(''),
    campo: () => sky('#4ea8de', '#bde0fe') + '<circle cx="520" cy="60" r="30" fill="#ffe66d"/><rect y="160" width="640" height="80" fill="#6a994e"/>' + Array.from({ length: 16 }, (_, i) => '<path d="M' + (i * 42) + ' 240 Q' + (i * 42 + 20) + ' 175 ' + (i * 42 + 40) + ' 240" fill="#a7c957"/>').join(''),
    agua: () => sky('#14213d', '#4a6fa5') + city('#0d1b2a') + '<path d="M0 170 Q40 155 80 170 T160 170 T240 170 T320 170 T400 170 T480 170 T560 170 T640 170 L640 240 L0 240Z" fill="#2a6f97"/><path d="M0 195 Q40 180 80 195 T160 195 T240 195 T320 195 T400 195 T480 195 T560 195 T640 195 L640 240 L0 240Z" fill="#1d4e89"/>',
    estadio: () => sky('#03045e', '#0077b6') + '<path d="M0 240 L0 130 Q320 60 640 130 L640 240Z" fill="#023e8a"/>' + Array.from({ length: 40 }, (_, i) => '<circle cx="' + (i * 16 + 8) + '" cy="' + (150 - Math.sin(i / 39 * Math.PI) * 50 + (i % 2) * 6) + '" r="5" fill="' + (i % 3 ? '#74acdf' : '#fff') + '"/>').join('') +
      '<rect x="40" y="20" width="8" height="70" fill="#adb5bd"/><rect x="28" y="12" width="32" height="14" fill="#fff9c4"/><rect x="592" y="20" width="8" height="70" fill="#adb5bd"/><rect x="580" y="12" width="32" height="14" fill="#fff9c4"/><rect x="0" y="205" width="640" height="35" fill="#2d6a4f"/>',
    corte: () => sky('#212529', '#6c757d') + '<rect x="130" y="80" width="380" height="150" fill="#ced4da"/><path d="M110 80 L320 30 L530 80Z" fill="#adb5bd"/>' + [150, 205, 260, 315, 370, 425, 480].map(x => '<rect x="' + x + '" y="92" width="22" height="130" fill="#e9ecef"/>').join('') + '<text x="320" y="70" font-size="26" text-anchor="middle">⚖️</text>',
    mundo: () => sky('#0b132b', '#1c2541') + '<circle cx="320" cy="140" r="90" fill="#3a86ff"/><path d="M260 90 Q290 70 310 95 Q330 120 300 130 Q270 140 260 110Z M340 150 Q370 130 390 160 Q380 200 350 190 Q330 175 340 150Z M290 170 Q300 160 310 175 Q305 200 290 195Z" fill="#8ac926"/><ellipse cx="320" cy="140" rx="130" ry="22" fill="none" stroke="#ffd16655" stroke-width="3"/>',
    noche: () => '<rect width="640" height="240" fill="#05070d"/>' + Array.from({ length: 40 }, (_, i) => '<circle cx="' + ((i * 97) % 640) + '" cy="' + ((i * 53) % 120) + '" r="1.2" fill="#fff8"/>').join('') + city('#0b0f1a') +
      [60, 150, 230, 330, 420, 510, 590].map((x, i) => '<rect x="' + x + '" y="' + (140 + i % 3 * 8) + '" width="10" height="10" fill="' + (i === 3 ? '#ffd166' : '#1b2233') + '"/>').join('') + '<text x="320" y="80" font-size="46" text-anchor="middle" fill="#ffd16633">⚡</text>',
    bosque: () => sky('#4a1c0a', '#c2410c') + '<rect y="190" width="640" height="50" fill="#2d1608"/>' + Array.from({ length: 14 }, (_, i) => '<path d="M' + (i * 48 + 10) + ' 200 L' + (i * 48 + 30) + ' ' + (120 + (i % 3) * 15) + ' L' + (i * 48 + 50) + ' 200Z" fill="#1f2d14"/>').join('') +
      Array.from({ length: 9 }, (_, i) => '<path d="M' + (i * 72 + 20) + ' 200 Q' + (i * 72 + 35) + ' 150 ' + (i * 72 + 45) + ' 170 Q' + (i * 72 + 55) + ' 130 ' + (i * 72 + 70) + ' 200Z" fill="#f97316" opacity=".85"/>').join(''),
    tren: () => sky('#1e293b', '#64748b') + city('#0f172a') + '<rect y="200" width="640" height="40" fill="#334155"/><path d="M0 210 L640 210 M0 222 L640 222" stroke="#94a3b8" stroke-width="3"/>' +
      '<rect x="120" y="140" width="380" height="60" rx="10" fill="#b91c1c"/>' + [140, 210, 280, 350, 420].map(x => '<rect x="' + x + '" y="152" width="50" height="26" fill="#fde68a"/>').join(''),
    puerto: () => sky('#0c4a6e', '#7dd3fc') + '<rect y="170" width="640" height="70" fill="#075985"/>' + [70, 260, 450].map(x => '<path d="M' + x + ' 170 L' + (x + 140) + ' 170 L' + (x + 120) + ' 195 L' + (x + 20) + ' 195Z" fill="#1e293b"/><rect x="' + (x + 30) + '" y="148" width="80" height="22" fill="#f59e0b"/><rect x="' + (x + 90) + '" y="128" width="16" height="20" fill="#e2e8f0"/>').join('') +
      '<rect x="560" y="60" width="10" height="110" fill="#334155"/><path d="M565 60 L630 60 L630 66 L565 66Z" fill="#334155"/>',
    vaticano: () => sky('#1e3a8a', '#93c5fd') + '<rect x="120" y="140" width="400" height="100" fill="#e7e2d6"/><path d="M240 140 Q320 30 400 140Z" fill="#d6cfbf"/><rect x="314" y="28" width="12" height="26" fill="#d6cfbf"/><rect x="306" y="36" width="28" height="5" fill="#d6cfbf"/>' +
      [140, 190, 240, 290, 340, 390, 440, 490].map(x => '<rect x="' + x + '" y="150" width="14" height="80" fill="#cfc8b8"/>').join(''),
    cine: () => '<rect width="640" height="240" fill="#120a1a"/><path d="M0 0 L640 0 L560 40 L80 40Z" fill="#7f1d1d"/><rect x="160" y="50" width="320" height="130" rx="6" fill="#fef3c7"/><text x="320" y="135" font-size="64" text-anchor="middle">🏆</text>' + crowd('#05030a', 14, 200),
    militar: () => sky('#2b2d42', '#6d6875') + city('#1b1b2f') + '<path d="M0 240 L0 200 L640 200 L640 240Z" fill="#3d405b"/>' + Array.from({ length: 9 }, (_, i) => '<g transform="translate(' + (60 + i * 64) + ',150)"><circle cx="0" cy="0" r="9" fill="#283618"/><rect x="-10" y="8" width="20" height="40" fill="#606c38"/><rect x="-14" y="-6" width="28" height="6" fill="#283618"/></g>').join('')
  };
  ART.scene = (type) => '<svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice" class="scene">' + (SCENES[type] || SCENES.casa)() + '</svg>';
  ART.sceneFor = {
    paro_cgt: 'calle', marcha_univ: 'calle', sequia: 'seco', cosecha: 'campo', corrida: 'mercado', contagio: 'mercado', waiver_fmi: 'mundo', escandalo: 'corte',
    inundacion: 'agua', copa_america: 'estadio', mundial: 'estadio', dia_memoria: 'calle', ni_una_menos: 'calle', crisis_gas: 'seco', narco: 'fuego', dengue: 'agua',
    veto_jub: 'congreso', veto_univ: 'congreso', lockout_agro: 'campo', cierre_fabricas: 'calle', megainversion: 'mercadoBueno', calificadoras: 'mercado', fallo_corte: 'corte',
    represion: 'fuego', corralito: 'banco', hiper: 'mercado', fuga_elec: 'mercado', gobernadores: 'casa', davos: 'mundo', bonaerense: 'congreso', duelo: 'calle', repo_enero: 'mundo',
    holdouts: 'mundo', corrida_2018: 'mercado', paso_2019: 'mercado', salida_conv: 'banco', cacerolazo: 'fuego', smith: 'corte', jefes: 'calle', avellaneda: 'fuego',
    saqueos: 'fuego', bb: 'casa', indultos: 'militar', bonex: 'banco', carapintadas: 'militar', cavallo: 'mercadoBueno',
    apagon: 'noche', tomas: 'calle', paro_docente: 'calle', camioneros: 'calle', incendios: 'bosque', finde_largo: 'campo', yacimiento: 'mercadoBueno', premio_cine: 'cine', ruidazo: 'noche',
    motin: 'noche', carne: 'campo', tren: 'tren', fuga_cerebros: 'mundo', cuasimonedas: 'banco', ciberataque: 'noche', vaticano: 'vaticano', visita_estado: 'mundo', aceiteros: 'puerto',
    vaca_muerta: 'mercadoBueno', tarifas_corte: 'corte', antidespidos: 'congreso', cuadernos: 'corte', trueque: 'calle', segunda_hiper: 'mercado', entel: 'casa'
  };
  ART.urgent = new Set(['corrida', 'corralito', 'hiper', 'saqueos', 'sequia', 'inundacion', 'contagio', 'represion', 'narco', 'crisis_gas', 'avellaneda', 'carapintadas', 'cacerolazo', 'salida_conv', 'paro_cgt', 'corrida_2018', 'fuga_elec', 'dengue', 'apagon', 'incendios', 'tren', 'motin', 'camioneros', 'ciberataque', 'aceiteros', 'segunda_hiper', 'tomas']);
  ART.happy = new Set(['copa_america', 'mundial', 'cosecha', 'megainversion', 'finde_largo', 'yacimiento', 'premio_cine', 'vaca_muerta', 'visita_estado']);

  /* ---------------- íconos ---------------- */
  ART.catIcon = { mon: '🏦', fis: '🧾', gas: '🏛️', tra: '👷', pro: '🏭', seg: '🚓', soc: '🎓', ins: '🗳️' };
  ART.catColor = { mon: '#f6b40e', fis: '#f97316', gas: '#ef4444', tra: '#22c55e', pro: '#06b6d4', seg: '#6366f1', soc: '#ec4899', ins: '#a3a3a3' };
  ART.polIcon = {
    tasa: '📈', cambio: '💱', cepo: '🔒', emit: '🖨️', overhang: '🏦', credito: '💳', deuda: '📜', fmi: '🌐', blanqueo: '🛏️', bancos: '🏧',
    iva: '🧾', ganancias: '💼', retenciones: '🌾', ret_ind: '🏭', bienes: '🏠', estructura: '🪚', privat: '🏷️',
    jubilaciones: '👵', moratoria: '📋', regimenes: '🧓', paritarias_pub: '🏛️', asistencia: '🍲', sub_energia: '💡', sub_transp: '🚌', obras: '🏗️', transferencias: '🗺️',
    paritarias: '🤝', salario_min: '💰', reforma_lab: '👷', sindicatos: '✊', empleo_reg: '📝', precios: '🛒', vivienda: '🔑',
    aranceles: '🚢', rigi: '💎', energia: '🛢️', mineria: '⛏️', mercosur: '🌎', exterior: '🕊️',
    seguridad: '🚓', protesta: '🚧', narco: '🕵️', justicia: '⚖️', defensa: '🛡️',
    educacion: '📚', universidades: '🎓', ciencia: '🔬', salud: '🏥', ive: '⚕️', diversidad: '🌈', medios: '📺', cultura: '🎭', futbol: '⚽',
    electoral: '🗳️', ficha: '🚫', anticorrupcion: '🔍', malvinas: '🏝️', memoria: '🕯️',
    coparticipacion: '🤲', monotributo: '🧑‍🔧', evasion: '🧐', pami: '💊', jornada: '⏰', plataformas: '🛵', turismo: '🧳', tdf: '📱', conocimiento: '💻', hidrovia: '⛴️',
    armas: '🔫', carceles: '⛓️', migracion: '🛂', inteligencia: '🕶️', acceso_info: '📂', comedores: '🥘'
  };

  // Nombres cortos para que cada círculo del tablero tenga su etiqueta
  ART.polShort = {
    tasa: 'Tasa de interés', cambio: 'Tipo de cambio', cepo: 'Cepo', emit: 'Emisión', overhang: 'Pasivos BCRA', credito: 'Crédito', deuda: 'Deuda', fmi: 'FMI', blanqueo: 'Blanqueo', bancos: 'Depósitos',
    iva: 'IVA', ganancias: 'Ganancias', retenciones: 'Retenciones agro', ret_ind: 'Retenciones industria', bienes: 'Bienes Personales', estructura: 'Tamaño del Estado', privat: 'Privatizaciones', coparticipacion: 'Coparticipación', monotributo: 'Monotributo', evasion: 'Control de evasión',
    jubilaciones: 'Jubilaciones', moratoria: 'Moratoria', regimenes: 'Reforma previsional', paritarias_pub: 'Sueldos estatales', asistencia: 'Planes sociales', sub_energia: 'Subsidio luz y gas', sub_transp: 'Subsidio transporte', obras: 'Obra pública', transferencias: 'Fondos a provincias', pami: 'PAMI y remedios',
    paritarias: 'Paritarias', salario_min: 'Salario mínimo', reforma_lab: 'Reforma laboral', sindicatos: 'Sindicatos', empleo_reg: 'Empleo en blanco', precios: 'Control de precios', vivienda: 'Alquileres', jornada: 'Jornada laboral', plataformas: 'Apps de reparto',
    aranceles: 'Importaciones', rigi: 'RIGI', energia: 'Vaca Muerta', mineria: 'Minería', mercosur: 'Acuerdos comerciales', turismo: 'Turismo', tdf: 'Tierra del Fuego', conocimiento: 'Economía del conocimiento', hidrovia: 'Hidrovía',
    seguridad: 'Policía', protesta: 'Protocolo antipiquetes', narco: 'Narcotráfico', justicia: 'Reforma judicial', defensa: 'Fuerzas Armadas', armas: 'Control de armas', carceles: 'Cárceles', migracion: 'Migración',
    educacion: 'Escuelas', universidades: 'Universidades', ciencia: 'Ciencia', salud: 'Hospitales', ive: 'Aborto legal', diversidad: 'Diversidad', medios: 'Medios públicos', cultura: 'Cultura', futbol: 'Fútbol', comedores: 'Comedores',
    electoral: 'Sistema electoral', ficha: 'Ficha Limpia', anticorrupcion: 'Anticorrupción', malvinas: 'Malvinas', memoria: 'Memoria y DD.HH.', exterior: 'Política exterior', inteligencia: 'Inteligencia', acceso_info: 'Acceso a la info'
  };
  ART.short = p => ART.polShort[p.id] || p.name.replace(/\s*\(.*\)$/, '');

  // Gritos de cada sector cuando una medida los toca: [enojo, alegría]
  ART.shouts = {
    cm: ['¡Así no llegamos a fin de mes!', '¡Por fin una buena para la clase media!'],
    sp: ['¡En el barrio no damos más!', '¡Esto sí ayuda al barrio!'],
    jb: ['¡Con los jubilados no!', '¡Gracias! ¡Por fin nos escuchan!'],
    pu: ['¡Paro de estatales!', '¡Bien ahí con los estatales!'],
    sn: ['¡Paro general, compañeros!', '¡Victoria de los trabajadores!'],
    inf: ['¡Changas no hay, señor!', '¡Ahora sí se puede laburar!'],
    pym: ['¡Así cerramos la persiana!', '¡Las pymes festejan!'],
    ind: ['¡La industria se funde!', '¡Vuelven las máquinas!'],
    agro: ['¡El campo dice basta!', '¡Viva el campo!'],
    fin: ['¡Los mercados se asustan!', '¡Los mercados aplauden!'],
    jov: ['¡Me voy a Ezeiza!', '¡Vamos, loco, esto sí!'],
    uni: ['¡La universidad se defiende!', '¡Educación pública, sí!'],
    int: ['¡El interior también existe!', '¡Por fin se acuerdan del interior!'],
    rel: ['¡Recemos por la Patria!', '¡Bendito sea!'],
    mov: ['¡Unidad de los que luchan!', '¡Esta es para el pueblo!']
  };

  // Situaciones activas: crisis y logros que aparecen en el centro del tablero
  ART.situations = function (S) {
    const m = S.m, out = [], gy = AR.gdpYoy ? AR.gdpYoy(S) : 0;
    const add = (ok, icon, name, good, ind, d) => { if (ok) out.push({ icon, name, good, ind, d }); };
    add(m.infM >= 40, AR.icon('flame'), 'Hiperinflación', false, 'infl', 'Los precios se duplican en semanas.');
    add(m.infM >= 6 && m.infM < 40, AR.icon('flame'), 'Inflación alta', false, 'infl', 'La inflación mensual supera el 6%.');
    add(m.infM <= 2, AR.icon('snowflake'), 'Precios estables', true, 'infl', 'Inflación mensual del 2% o menos.');
    add(m.gap >= 60, AR.icon('cash'), 'Brecha cambiaria', false, 'dolar', 'El dólar libre vale mucho más que el oficial.');
    add(m.gap <= 5 && m.infM < 6, AR.icon('currency-dollar'), 'Dólar unificado', true, 'dolar', 'Casi no hay brecha entre oficial y libre.');
    add(m.res < 0, AR.icon('building-bank'), 'Reservas negativas', false, 'reservas', 'El BCRA debe más dólares de los que tiene.');
    add(m.risk >= 2000, AR.icon('alert-triangle'), 'Riesgo de default', false, 'riesgo', 'Nadie presta: el riesgo país supera los 2.000.');
    add(m.risk <= 650, AR.icon('heart-handshake'), 'Crédito externo', true, 'riesgo', 'El país vuelve a conseguir financiamiento.');
    add(gy <= -2, AR.icon('chart-line'), 'Recesión', false, 'pbi', 'La economía cae más del 2% interanual.');
    add(gy >= 4, AR.icon('rocket'), 'Crecimiento fuerte', true, 'pbi', 'La economía crece más del 4%.');
    add(m.u >= 11, AR.icon('briefcase-off'), 'Desempleo masivo', false, 'desempleo', 'Más del 11% de la gente busca trabajo y no lo encuentra.');
    add(m.pov >= 45, AR.icon('bowl'), 'Emergencia social', false, 'pobreza', 'Casi la mitad del país es pobre.');
    add(m.pov <= 28, AR.icon('home'), 'Pobreza en baja', true, 'pobreza', 'La pobreza baja del 28%.');
    add(m.conf >= 60, AR.icon('speakerphone'), 'Calles calientes', false, 'conflicto', 'Piquetes, paros y marchas todas las semanas.');
    add(m.insec >= 65, AR.icon('alert-triangle'), 'Ola de inseguridad', false, 'inseguridad', 'El delito es la preocupación número uno.');
    add(m.inst <= 35, AR.icon('scale'), 'Crisis institucional', false, 'instituciones', 'Los poderes del Estado están en choque.');
    add(m.pb >= 0.5, AR.icon('calculator'), 'Superávit fiscal', true, 'deficit', 'El Estado gasta menos de lo que recauda.');
    add(m.pb <= -4, AR.icon('alert-octagon'), 'Déficit descontrolado', false, 'deficit', 'El rojo fiscal supera el 4% del PBI.');
    return out;
  };

  Object.keys(ART.polIcon).forEach(k => { ART.polIcon[k] = AR.iconOf('pol', k); });
  Object.keys(ART.catIcon).forEach(k => { ART.catIcon[k] = AR.iconOf('cat', k); });
  ART.catColor = { mon: '#c9a227', fis: '#d9822b', gas: '#cf6060', tra: '#4fa36b', pro: '#3a9fb5', seg: '#7584d8', soc: '#c76aa5', ins: '#8b98a8' };

  /* ---------------- indicadores del tablero ---------------- */
  const tone = (v, good, bad) => (good < bad ? (v <= good ? 1 : v >= bad ? -1 : 1 - 2 * (v - good) / (bad - good)) : (v >= good ? 1 : v <= bad ? -1 : -1 + 2 * (v - bad) / (good - bad)));
  ART.indicators = [
    { id: 'infl', icon: '🔥', name: 'Inflación', v: S => S.m.infM, f: v => v.toFixed(1) + '%', sub: 'mensual', t: v => tone(v, 2, 10), h: 'infM' },
    { id: 'dolar', icon: '💵', name: 'Dólar', v: S => S.m.gap, f: (v, S) => '$' + fmtN(S.m.fxOff), sub: S => 'brecha ' + Math.round(S.m.gap) + '%', t: v => tone(v, 10, 80), h: 'fxOff' },
    { id: 'reservas', icon: '🏦', name: 'Reservas', v: S => AR.rs(S), f: (v, S) => (S.m.res < 0 ? '-' : '') + 'US$' + Math.abs(S.m.res).toFixed(1) + 'B', sub: 'netas', t: v => tone(v, 10, -8), h: 'res' },
    { id: 'riesgo', icon: '📉', name: 'Riesgo país', v: S => S.m.risk, f: v => fmtN(v), sub: 'puntos', t: v => tone(v, 700, 2000), h: 'risk' },
    { id: 'deficit', icon: '🧮', name: 'Déficit', v: S => S.m.pb, f: v => (v > 0 ? '+' : '') + v.toFixed(1) + '%', sub: 'del PBI', t: v => tone(v, 1, -3), h: 'pb' },
    { id: 'pbi', icon: '📊', name: 'Crecimiento', v: S => AR.gdpYoy(S), f: v => (v > 0 ? '+' : '') + v.toFixed(1) + '%', sub: 'interanual', t: v => tone(v, 3, -2), h: 'gdp' },
    { id: 'desempleo', icon: '🧰', name: 'Desempleo', v: S => S.m.u, f: v => v.toFixed(1) + '%', sub: 'de la población activa', t: v => tone(v, 6, 12), h: 'u' },
    { id: 'pobreza', icon: '🥣', name: 'Pobreza', v: S => S.m.pov, f: v => v.toFixed(0) + '%', sub: 'de las personas', t: v => tone(v, 28, 50), h: 'pov' },
    { id: 'salario', icon: '👛', name: 'Salario real', v: S => S.m.rw, f: v => v.toFixed(0), sub: 'base 100', t: v => tone(v, 105, 85), h: 'rw' },
    { id: 'jubilacion', icon: '🧓', name: 'Jubilación real', v: S => S.m.rPen, f: v => v.toFixed(0), sub: 'base 100', t: v => tone(v, 105, 85), h: 'rPen' },
    { id: 'inseguridad', icon: '🚨', name: 'Inseguridad', v: S => S.m.insec, f: v => v.toFixed(0), sub: '0-100', t: v => tone(v, 35, 70) },
    { id: 'conflicto', icon: '📢', name: 'Conflicto social', v: S => S.m.conf, f: v => v.toFixed(0), sub: '0-100', t: v => tone(v, 25, 65) },
    { id: 'instituciones', icon: '🏛️', name: 'Instituciones', v: S => S.m.inst, f: v => v.toFixed(0), sub: '0-100', t: v => tone(v, 65, 35) },
    { id: 'educacion', icon: '🎒', name: 'Educación', v: S => S.m.edu, f: v => v.toFixed(0), sub: '0-100', t: v => tone(v, 62, 40) },
    { id: 'salud', icon: '❤️‍🩹', name: 'Salud', v: S => S.m.hea, f: v => v.toFixed(0), sub: '0-100', t: v => tone(v, 62, 40) }
  ];
  ART.indicators.forEach(d => { d.icon = AR.iconOf('ind', d.id); });
  function fmtN(x) { return Number(x).toLocaleString('es-AR', { maximumFractionDigits: x < 20 ? 2 : 0 }); }
  ART.fmtN = fmtN;

  /* ---------------- efectos de una política (para líneas y fichas) ---------------- */
  // Devuelve { ind: {id: valor}, grp: {id: valor} } donde valor > 0 es bueno
  const FX2IND = { fisc: ['deficit', 1], og: ['pbi', 1.5], infl: ['infl', -3], cred: ['riesgo', 0.25], conf: ['conflicto', -0.3], insec: ['inseguridad', -0.3], inst: ['instituciones', 0.4],
    transp: ['instituciones', 0.3], edu: ['educacion', 0.4], hea: ['salud', 0.4], expo: ['reservas', 0.15], impo: ['reservas', -0.12], unemp: ['desempleo', -2], fdi: ['reservas', 3] };
  ART.effects = function (p, from, to) {
    const A = p.levels[from], B = p.levels[to], ind = {}, grp = {};
    const add = (k, v) => { if (Math.abs(v) > 0.01) ind[k] = (ind[k] || 0) + v; };
    for (const k in FX2IND) { const d = (B.fx[k] || 0) - (A.fx[k] || 0); if (d) add(FX2IND[k][0], d * FX2IND[k][1]); }
    const d = k => (B.fx[k] !== undefined && A.fx[k] !== undefined ? B.fx[k] - A.fx[k] : 0);
    if (d('rate')) { add('infl', d('rate') / 60); add('pbi', -d('rate') / 60); }
    if (d('crawl')) { add('infl', -d('crawl') / 3); add('reservas', d('crawl') / 4); }
    if (A.fx.fxmode !== B.fx.fxmode) { const order = { crawl: 0, band: 1, float: 2, dollar: 3, peg: 3 }; const s = (order[B.fx.fxmode] || 0) - (order[A.fx.fxmode] || 0); add('dolar', s * 0.6); add('infl', B.fx.fxmode === 'dollar' || B.fx.fxmode === 'peg' ? 1.5 : -0.5 * s); }
    if (d('cepo')) { add('dolar', -d('cepo') * 0.8); add('reservas', d('cepo') * 0.4); add('pbi', -d('cepo') * 0.4); }
    if (d('emit')) add('infl', -d('emit') * 3);
    if (d('ov')) add('infl', -d('ov') / 4);
    if (d('ctrl')) { add('infl', d('ctrl') * 0.5); add('riesgo', -d('ctrl') * 0.4); }
    if (d('kPen') || d('extra')) { const v = d('kPen') + d('extra'); add('jubilacion', v * 2); add('deficit', -v * 1.5); }
    if (d('kPw')) add('deficit', -d('kPw') * 1.5);
    if (d('kSoc')) { add('pobreza', d('kSoc') * 1.5); add('deficit', -d('kSoc')); }
    if (d('kProv')) add('deficit', -d('kProv'));
    if (d('kW')) { add('salario', d('kW') * 2); add('infl', -d('kW')); }
    if (d('kMin')) { add('salario', d('kMin') * 1.5); add('pobreza', d('kMin') * 1.5); }
    if (d('bk')) { add('reservas', d('bk') * 0.6); add('pbi', -d('bk') * 0.8); add('instituciones', -d('bk') * 0.6); }
    const o = B.once || {};
    if (o.inf) add('infl', -o.inf / 2);
    if (o.res) add('reservas', o.res / 3);
    if (o.conf) add('conflicto', -o.conf / 6);
    if (o.rPen) { add('jubilacion', o.rPen / 8); add('deficit', -o.rPen / 15); }
    if (o.rSoc) { add('pobreza', o.rSoc / 15); add('deficit', -o.rSoc / 40); }
    if (o.unify) { add('dolar', 1.2); add('infl', -1); }
    AR.groups.forEach(gr => { const v = (B.g[gr.id] || 0) - (A.g[gr.id] || 0); if (v) grp[gr.id] = v; });
    return { ind, grp };
  };
  // Todos los nodos a los que se conecta una política (para las líneas al pasar el mouse)
  ART.links = function (p) {
    const ind = new Set(), grp = new Set();
    for (let i = 0; i < p.levels.length; i++) for (let j = i + 1; j < p.levels.length; j++) {
      const e = ART.effects(p, i, j); Object.keys(e.ind).forEach(k => ind.add(k)); Object.keys(e.grp).forEach(k => grp.add(k));
    }
    return { ind: [...ind], grp: [...grp] };
  };

  /* ---------------- frases de los personajes ---------------- */
  ART.quotes = {
    'Inflación': ['¡Los precios suben todos los días!', '¡Por fin se calmaron los precios!'],
    'Salario real': ['El sueldo no alcanza ni para la primera quincena.', 'Este mes el sueldo me rindió.'],
    'Jubilación real': ['Con la jubilación no llego ni al 10.', 'La jubilación al menos acompaña.'],
    'Salario público': ['Los estatales cobramos cada vez menos.', 'La paritaria estatal fue razonable.'],
    'Empleo': ['No hay laburo por ningún lado.', 'Hay trabajo otra vez.'],
    'Pobreza': ['El comedor del barrio está desbordado.', 'Se nota un poco de alivio en el barrio.'],
    'Crecimiento': ['Las ventas están por el piso.', '¡La economía arranca!'],
    'Seguridad': ['No se puede salir a la calle.', 'El barrio está más tranquilo.'],
    'Educación': ['La escuela se cae a pedazos.', 'Las escuelas mejoraron.'],
    'Salud': ['No hay turnos en el hospital.', 'El hospital funciona bien.'],
    'Instituciones': ['Gobiernan a fuerza de decretos.', 'Se respetan las instituciones.'],
    'Transparencia': ['Otra vez un caso de corrupción...', 'Hay más transparencia.'],
    'Paz social': ['Cortes de calle todos los días.', 'Hay paz en las calles.'],
    'Vida cultural': ['¡La cultura no es un gasto!', 'La cultura está viva.'],
    'Libertad cambiaria': ['Quiero comprar dólares tranquilo.', 'Por fin compro dólares sin trabas.'],
    'Riesgo país': ['Nadie le presta un peso al país.', 'Los mercados nos vuelven a creer.'],
    'Medidas de gobierno': ['¡No nos gustan estas medidas!', 'Las medidas van en la dirección correcta.'],
    'Afinidad con tu partido': ['Nunca voy a votar a estos.', 'Somos de los tuyos.'],
    'Clima reciente': ['El clima social está pesado.', 'Hay buena onda con el gobierno.']
  };
})(typeof window !== 'undefined' ? window : globalThis);
