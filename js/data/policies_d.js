(function (g) {
  const AR = g.AR = g.AR || {};
  const L = AR.L, P = AR.P;
  const byId = id => AR.policies.find(p => p.id === id);

  // Niveles históricos adicionales (se agregan al final para no alterar los índices existentes)
  const cambio = byId('cambio');
  cambio.levels[5].req = S => (AR.rs(S) >= 15 ? null : 'Inviable: harían falta al menos US$15.000 M (a escala de 2023) de reservas netas para canjear la base monetaria.');
  cambio.levels.push(
    L('Minidevaluaciones aceleradas (30% mensual)', { fxmode: 'crawl', crawl: 30 }, {}, [-0.4]),
    L('Dólar oficial fijo, sin deslizamiento', { fxmode: 'crawl', crawl: 0 }, { cm: 1 }, [-0.1]),
    L('Convertibilidad: paridad fija por ley (1 a 1)', { fxmode: 'peg', cred: 7 }, { cm: 3, fin: 5, ind: 2, sn: -2, agro: -2 }, [0.7],
      { how: 'ley', once: { unify: 1 }, dnu: false, req: S => (S.m.C >= 25 ? null : 'Sin credibilidad suficiente (se necesitan 25 puntos): nadie creería en una paridad fija.') })
  );
  cambio.hist += ' La Ley de Convertibilidad (marzo de 1991, Cavallo) fijó 1 peso = 1 dólar y prohibió emitir sin respaldo; el sistema se rompió en diciembre de 2001-enero de 2002.';

  const tasa = byId('tasa');
  tasa.levels.push(
    L('300% TNA', { rate: 300 }, { pym: -6, ind: -4, fin: 2 }),
    L('600% TNA', { rate: 600 }, { pym: -10, ind: -7, fin: 3 })
  );

  P('bancos', 'mon', 'Depósitos y sistema bancario',
    'Qué se hace con los depósitos cuando hay desconfianza. Restringir retiros frena la corrida, pero hunde la confianza y la actividad.',
    'El Plan Bonex (diciembre de 1989) canjeó compulsivamente plazos fijos por bonos en dólares a 10 años. El corralito (1 de diciembre de 2001) limitó los retiros a $250 semanales; en 2002 se pesificaron y reprogramaron depósitos (el "corralón").',
    0, 7, 'ley', 1, [
      L('Depósitos de libre disponibilidad', { bk: 0 }, {}, [0.5]),
      L('Corralito: restricción de retiros', { bk: 1, og: -0.5, conf: 2 }, { cm: -8, pym: -6, fin: -3, sp: -2 }, [-0.2], { once: { conf: 8 } }),
      L('Canje compulsivo de depósitos por bonos (Plan Bonex 1989 / corralón 2002)', { bk: 2, fisc: 0.8, cred: -6, og: -0.8 }, { cm: -14, pym: -8, fin: -8, jb: -5, ind: -2 }, [-0.4],
        { once: { conf: 15, Ex: 0.6 } })
    ], { dnu: true });
})(typeof window !== 'undefined' ? window : globalThis);
