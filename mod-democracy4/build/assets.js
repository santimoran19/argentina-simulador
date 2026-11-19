// Genera los gráficos del mod: íconos (PNG para vectorizar), bandera, mapa, imágenes de eventos y portada.
// Uso: NODE_PATH=<carpeta con @tabler/icons, world-atlas y topojson-client> node mod-democracy4/build/assets.js <carpeta-temporal>
// Después: python3 mod-democracy4/build/trace_icons.py <carpeta-temporal>  (convierte los PNG en SVG rellenos)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const topojson = require('topojson-client');

const ROOT = path.resolve(__dirname, '..');
const GAME = path.resolve(ROOT, '..');                    // el juego web, para reusar las escenas de eventos
const OUT = path.join(ROOT, 'assets');
const TMP = process.argv[2] || path.join(ROOT, '.tmp');
const content = JSON.parse(fs.readFileSync(path.join(TMP, 'content.json'), 'utf8'));
const tablerDir = require.resolve.paths('@tabler/icons').map(d => d + '/@tabler/icons/icons/outline/').find(d => fs.existsSync(d));
const mk = d => fs.mkdirSync(d, { recursive: true });

function tablerInner(name) {
  const svg = fs.readFileSync(path.join(tablerDir, name + '.svg'), 'utf8');
  return svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<path stroke="none" d="M0 0h24v24H0z" fill="none"\s*\/>/, '');
}

// Mapa: Argentina continental, Tierra del Fuego y las islas Malvinas (como las representa la cartografía oficial argentina)
function mapSvg() {
  const topo = JSON.parse(fs.readFileSync(require.resolve('world-atlas/countries-50m.json'), 'utf8'));
  const feats = topojson.feature(topo, topo.objects.countries).features.filter(f => f.id === '032' || f.id === '238');
  const polys = [];
  feats.forEach(f => { const g = f.geometry; (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).forEach(p => polys.push(p)); });
  const lat0 = -38 * Math.PI / 180, k = Math.cos(lat0);
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  polys.forEach(p => p.forEach(r => r.forEach(([lon, lat]) => { const x = lon * k, y = -lat; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); })));
  const s = 380 / Math.max(maxX - minX, maxY - minY), ox = (400 - (maxX - minX) * s) / 2, oy = (400 - (maxY - minY) * s) / 2;
  const d = polys.map(p => p.map(r => 'M' + r.map(([lon, lat]) => ((lon * k - minX) * s + ox).toFixed(1) + ' ' + ((-lat - minY) * s + oy).toFixed(1)).join(' L') + ' Z').join(' ')).join(' ');
  return '<svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0, 0, 400,400"><g id="svgg"><path id="path0" d="' + d + '" stroke="none" fill="#ececec" fill-rule="evenodd"></path></g></svg>';
}

// Bandera circular con el Sol de Mayo (512x512, fondo transparente, como las del juego)
function flagHtml() {
  let rays = '';
  for (let i = 0; i < 32; i++) {
    const a = i * 11.25, long = i % 2 === 0;
    rays += long ? '<path d="M0 -60 L5 -36 L-5 -36Z" transform="rotate(' + a + ')"/>' : '<path d="M0 -55 Q6 -46 0 -36 Q-6 -46 0 -55Z" transform="rotate(' + a + ')"/>';
  }
  return '<html><body style="margin:0;background:transparent"><svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">' +
    '<defs><clipPath id="c"><circle cx="256" cy="256" r="256"/></clipPath></defs><g clip-path="url(#c)">' +
    '<rect width="512" height="171" fill="#74acdf"/><rect y="171" width="512" height="170" fill="#ffffff"/><rect y="341" width="512" height="171" fill="#74acdf"/>' +
    '<g transform="translate(256 256) scale(1.25)" fill="#f6b40e" stroke="#85340a" stroke-width="1.1">' + rays +
    '<circle r="30"/><g fill="#85340a" stroke="none"><circle cx="-10" cy="-6" r="3"/><circle cx="10" cy="-6" r="3"/></g>' +
    '<path d="M-10 10 Q0 17 10 10" fill="none" stroke="#85340a" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M0 -4 L-2 4 L2 4" fill="none" stroke="#85340a" stroke-width="1.6"/></g></g></svg></body></html>';
}

(async () => {
  mk(TMP); mk(path.join(TMP, 'iconpng'));
  mk(path.join(OUT, 'data/svg')); mk(path.join(OUT, 'data/bitmaps/flags')); mk(path.join(OUT, 'data/bitmaps/events'));
  const b = await chromium.launch();

  // 1) Íconos: trazo negro grueso sobre blanco a 512 px, para vectorizar con potrace
  const p = await b.newPage({ viewport: { width: 512, height: 512 } });
  const list = content.policies.map(x => ['icons_' + x.name.toLowerCase(), x.icon]).concat(content.situations.map(x => ['sit_icons_' + x.name.toLowerCase(), x.icon]));
  for (const [file, icon] of list) {
    await p.setContent('<html><body style="margin:0;background:#fff"><svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="-1 -1 26 26" fill="none" stroke="#000" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">' + tablerInner(icon) + '</svg></body></html>');
    await p.screenshot({ path: path.join(TMP, 'iconpng', file + '.png') });
  }

  // 2) Bandera
  const fp = await b.newPage({ viewport: { width: 512, height: 512 } });
  await fp.setContent(flagHtml());
  await fp.screenshot({ path: path.join(OUT, 'data/bitmaps/flags/flag_argentina_gb.png'), omitBackground: true });

  // 3) Mapa
  fs.writeFileSync(path.join(OUT, 'data/svg/map_argentina_gb.svg'), mapSvg());

  // 4) Imágenes de eventos con las escenas ilustradas del juego web
  const g = await b.newPage({ viewport: { width: 1200, height: 800 } });
  await g.goto('file://' + path.join(GAME, 'index.html'));
  await g.waitForTimeout(300);
  for (const e of content.events) {
    const svg = await g.evaluate(t => AR.art.scene(t), e.scene);
    const ev = await b.newPage({ viewport: { width: 1200, height: 800 } });
    await ev.setContent('<html><body style="margin:0;width:1200px;height:800px;overflow:hidden;background:#0d1822">' +
      '<div style="width:1200px;height:800px">' + svg.replace('class="scene"', 'style="width:100%;height:100%;display:block"') + '</div>' +
      '<div style="position:absolute;inset:0;background:radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.35))"></div></body></html>');
    await ev.screenshot({ path: path.join(OUT, 'data/bitmaps/events', e.name + '.jpg'), type: 'jpeg', quality: 86 });
    await ev.close();
  }

  // 5) Portada para Steam Workshop (cuadrada)
  const pv = await b.newPage({ viewport: { width: 1024, height: 1024 } });
  const flag = fs.readFileSync(path.join(OUT, 'data/bitmaps/flags/flag_argentina_gb.png')).toString('base64');
  const fontDir = path.join(GAME, 'fonts');
  const previewHtml = ('<!doctype html><html><head><meta charset="utf-8"><style>' +
    ['500', '600', '700'].map(w => '@font-face{font-family:Barlow;font-weight:' + w + ';src:url(file://' + fontDir + '/barlow-' + w + '.woff2)}').join('') +
    'body{margin:0;width:1024px;height:1024px;background:radial-gradient(circle at 50% 30%,#1b4a80,#0d1822 70%);font-family:Barlow,sans-serif;color:#e7edf4;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}' +
    'img{width:330px;height:330px;filter:drop-shadow(0 18px 40px #0009)}h1{font-size:120px;font-weight:700;margin:40px 0 0;letter-spacing:-.01em}h2{font-size:46px;font-weight:600;color:#e3b341;margin:6px 0 26px}' +
    'p{font-size:30px;color:#c3d0de;margin:0;line-height:1.4}.tag{margin-top:34px;font-size:24px;letter-spacing:.14em;color:#6cb4e8;font-weight:600}</style></head><body>' +
    '<img src="data:image/png;base64,' + flag + '"><h1>ARGENTINA</h1><h2>Gobernala</h2><p>Cepo · inflación · FMI · retenciones<br>Vaca Muerta · piquetes · la grieta</p>' +
    '<div class="tag">' + content.policies.length + ' POLÍTICAS · ' + content.situations.length + ' SITUACIONES · ' + (content.events.length + (content.dilemmas || 16)) + ' EVENTOS Y DILEMAS</div></body></html>');
  fs.writeFileSync(path.join(TMP, 'preview.html'), previewHtml);
  await pv.goto('file://' + path.join(TMP, 'preview.html'));
  await pv.waitForTimeout(400);
  await pv.screenshot({ path: path.join(OUT, 'preview.jpg'), type: 'jpeg', quality: 90 });

  await b.close();
  console.log('gráficos listos:', list.length, 'íconos a vectorizar,', content.events.length, 'eventos');
})();
