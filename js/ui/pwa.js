/* App instalable: registro del service worker, botón "Instalar", aviso de versión nueva y pantalla completa */
(function (g) {
  'use strict';
  const AR = g.AR;
  const P = AR.pwa = { prompt: null, installed: false, canSW: 'serviceWorker' in navigator && /^https?:$/.test(location.protocol) };
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  P.standalone = () => (g.matchMedia && g.matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches) || navigator.standalone === true;
  P.installed = P.standalone();

  g.addEventListener('beforeinstallprompt', e => { e.preventDefault(); P.prompt = e; refresh(); });
  g.addEventListener('appinstalled', () => { P.installed = true; P.prompt = null; refresh(); AR.flow && AR.flow.toast('' + AR.icon('download') + ' ¡Listo! El juego quedó instalado.', 'ok'); });
  function refresh() { if (AR.ui && AR.ui.screen === 'menu') AR.ui.render(); else if (AR.ui && !AR.ui.S && AR.flow) AR.flow.start(); }

  // Texto y botón para el menú y la pantalla de inicio
  P.button = cls => {
    if (P.installed) return '';
    if (P.prompt) return '<button class="' + (cls || 'big') + ' inst" data-act="install">' + AR.icon('download') + ' Instalar el juego<small>Se abre como una app y anda sin internet</small></button>';
    if (ios) return '<div class="insthelp">' + AR.icon('download') + ' <b>Instalalo en tu iPhone:</b> tocá <b>Compartir</b> ' + AR.icon('share') + ' y después <b>Agregar a inicio</b>.</div>';
    return '';
  };
  P.install = async () => {
    if (!P.prompt) return;
    P.prompt.prompt();
    try { await P.prompt.userChoice; } catch (e) { /* nada */ }
    P.prompt = null; refresh();
  };
  P.fullscreen = () => {
    const d = document, el = d.documentElement;
    try { if (!d.fullscreenElement) { (el.requestFullscreen || el.webkitRequestFullscreen).call(el); if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {}); } else (d.exitFullscreen || d.webkitExitFullscreen).call(d); } catch (e) { /* no soportado */ }
  };

  // Service worker y aviso de actualización
  if (P.canSW) {
    g.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').then(reg => {
        const ask = w => {
          if (!navigator.serviceWorker.controller) return; // primera instalación: no hay versión vieja
          const bar = document.createElement('div'); bar.className = 'upd';
          bar.innerHTML = '' + AR.icon('sparkles') + ' Hay una versión nueva del juego. <button>Actualizar</button>';
          bar.querySelector('button').onclick = () => { w.postMessage('skipWaiting'); bar.remove(); };
          document.body.appendChild(bar);
        };
        if (reg.waiting) ask(reg.waiting);
        reg.addEventListener('updatefound', () => { const w = reg.installing; if (w) w.addEventListener('statechange', () => { if (w.state === 'installed') ask(w); }); });
      }).catch(() => { /* sin service worker */ });
      let reloading = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => { if (reloading) return; reloading = true; location.reload(); });
    });
  }

  // Sin conexión / con conexión
  g.addEventListener('offline', () => AR.flow && AR.flow.toast('' + AR.icon('wifi-off') + ' Sin internet: el juego sigue andando igual.', 'ok'));
})(typeof window !== 'undefined' ? window : globalThis);
