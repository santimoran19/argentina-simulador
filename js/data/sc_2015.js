(function (g) {
  const AR = g.AR = g.AR || {};
  const base = AR.SC.dic2023;
  const PT = (id, name, short, color, eco, soc, pc0, govern, d, o, extra) => Object.assign({ id, name, short, color, eco, soc, pc0, govern, seats0: { dip: d[0], sen: d[1] }, desc: o.desc, plat: o.plat, dificultad: o.dif }, extra || {});

  const parties = {
    FIT: PT('FIT', 'Frente de Izquierda y de los Trabajadores', 'FIT', '#F26B38', -1, -0.85, 22, false, [3, 0], { desc: 'Coalición de PTS, Partido Obrero, Izquierda Socialista y MST, creada en 2011. Segunda fuerza en varias provincias en 2015.', plat: 'No pago de la deuda, nacionalizaciones, salario igual a la canasta.' }),
    PJ: PT('PJ', 'Frente para la Victoria / PJ (kirchnerismo)', 'FPV-PJ', '#4DA8DA', -0.6, -0.4, 45, true, [117, 42], { desc: 'El proyecto que gobernó entre 2003 y 2015: crecimiento con inclusión, estatizaciones (YPF, AFJP), ampliación de derechos y cepo cambiario. Primera minoría en el Congreso.', plat: 'Mercado interno, subsidios, soberanía económica, derechos sociales.', dif: 'Moderada: primera minoría, pero con déficit gemelo y escasez de dólares.' }),
    FR: PT('FR', 'Frente Renovador', 'FR', '#C86DD7', -0.1, 0.1, 38, true, [20, 1], { desc: 'Peronismo moderado nacido en 2013 en el conurbano. Pragmático: menos impuestos al trabajo, más seguridad, diálogo con todos.', plat: 'Seguridad, baja de impuestos al trabajo, gestión eficiente.', dif: 'Difícil: bloque de 20 diputados.' }),
    PF: PT('PF', 'Peronismo federal / gobernadores', 'PF', '#7F8FA9', -0.1, 0, 36, false, [14, 4], { desc: 'Legisladores de provincias peronistas no kirchneristas (Córdoba, Salta y otras). Priorizan los recursos provinciales.', plat: 'Federalismo fiscal.' }, { fed: true }),
    PROV: PT('PROV', 'Partidos provinciales', 'Provinciales', '#B08968', 0.1, 0.25, 0, false, [12, 6], { desc: 'Movimiento Popular Neuquino, Frente Cívico, partidos de Misiones, Tucumán y otras provincias. Votan según los recursos para su distrito.', plat: 'Obras y transferencias.' }, { fed: true }),
    CC: PT('CC', 'Coalición Cívica ARI', 'CC-ARI', '#2FBF71', 0.25, -0.3, 30, false, [8, 1], { desc: 'Republicanismo y anticorrupción; socio de Cambiemos.', plat: 'Transparencia, justicia independiente.' }),
    UCR: PT('UCR', 'Unión Cívica Radical', 'UCR', '#D7263D', 0.15, -0.1, 38, true, [40, 14], { desc: 'Partido centenario; en 2015 aportó candidatos, gobernaciones e intendencias a la alianza Cambiemos.', plat: 'Institucionalidad, federalismo, gradualismo.', dif: 'Difícil: sin mayoría propia, pero con peso territorial.' }, { cash: true }),
    PRO: PT('PRO', 'Propuesta Republicana (PRO)', 'PRO', '#F2B705', 0.6, 0.15, 40, true, [43, 4], { desc: 'Nacido en 2005 en la Ciudad de Buenos Aires, ganó la Presidencia en 2015 al frente de Cambiemos: gradualismo, apertura, fin del cepo y vuelta a los mercados.', plat: 'Sin cepo, acuerdo con los holdouts, inversión, baja gradual de retenciones, tarifas sinceras.', dif: 'Difícil: 43 diputados y 4 senadores; depende de la UCR y el peronismo dialoguista.' })
  };
  const order = ['FIT', 'PJ', 'FR', 'PF', 'PROV', 'CC', 'UCR', 'PRO'];
  const aff = { //            FIT   PJ    FR   PF    PROV  CC    UCR   PRO
    cm: [-0.75, -0.5, -0.05, 0, -0.1, 0.35, 0.3, 0.7], sp: [-0.1, 0.7, 0.3, 0.2, 0.1, -0.4, -0.25, -0.3], jb: [0.05, 0.55, 0.2, 0.15, 0.1, -0.1, 0.05, 0.05],
    pu: [0.2, 0.6, 0.1, 0.25, 0.3, -0.05, 0, -0.35], sn: [0.35, 0.6, 0.2, 0.15, 0.05, -0.2, -0.1, -0.35], inf: [-0.05, 0.35, 0.3, 0.1, 0.05, -0.2, -0.15, 0.1],
    pym: [-0.6, -0.2, 0.15, 0.1, 0, 0.25, 0.3, 0.5], ind: [-0.9, -0.15, 0.1, 0.2, 0.1, 0.2, 0.25, 0.6], agro: [-0.9, -0.75, -0.1, 0.3, 0.1, 0.25, 0.4, 0.65],
    fin: [-0.9, -0.6, -0.1, 0.1, -0.05, 0.15, 0.2, 0.6], jov: [0.25, 0.1, 0, -0.05, -0.2, -0.2, -0.3, 0.15], uni: [0.5, 0.4, 0.05, 0.1, -0.1, 0.25, 0.2, -0.3],
    int: [-0.4, 0.35, 0.15, 0.35, 0.6, -0.15, 0.2, -0.1], rel: [-0.8, 0, 0.1, 0.1, 0.3, 0.05, 0.25, 0.3], mov: [0.75, 0.5, -0.05, -0.05, -0.1, -0.3, -0.4, -0.7]
  };
  AR.SC.dic2015 = {
    id: 'dic2015', short: 'Diciembre de 2015', name: 'Fin del ciclo kirchnerista', months: 47,
    blurb: 'Cepo, brecha del 50%, déficit fiscal de casi 5 puntos y holdouts sin resolver. ¿Gradualismo o shock?',
    start: { y: 2015, m: 11 }, parties, order, family: { PRO: 'JxC', UCR: 'JxC', CC: 'JxC', PJ: 'PERON', PF: 'PERON', FR: 'PERON' }, chamber: AR.CHAMBER, affArr: aff,
    intro: 'Es el 10 de diciembre de 2015. Termina el ciclo kirchnerista y la alternancia llega con la UCR y el PRO en Cambiemos. La inflación ronda el 2% mensual (las estadísticas oficiales fueron intervenidas y las privadas son la referencia), el dólar oficial es $9,8 y el libre ~$14, el cepo rige desde 2011 y el déficit primario supera el 4% del PBI. Argentina está en default técnico con los holdouts que ganaron en Nueva York, lo que le cierra los mercados. El Congreso no tiene mayoría para nadie.',
    source: 'Estimaciones privadas de inflación (el INDEC estaba intervenido), BCRA, Ministerio de Economía, Cámara de Diputados y Senado (cifras aproximadas).',
    macro: Object.assign({}, base.macro, {
      infM: 2.0, E: 2.2, fxOff: 9.8, fxEq: 14.4, res: 3, C: 52, og: -0.5, u: 6.6, pov: 29, ind: 5.5, gini: 0.42, pb: -4.8, interest: 1.0, debt: 53,
      insec: 50, conf: 40, edu: 50, hea: 52, inst: 45, tra: 35, cult: 55, trade: -0.1, mg: 5, gap: 47, risk: 520, rate: 30
    }),
    par: { inf: 45, pov: 33 }, infH: [2.0, 2.2, 2.5, 1.8, 2.0, 1.9, 1.5, 2.3, 2.2, 2.4, 2.4], gdpYoy0: 2.0, pub: { pov: 29, u: 6.6 }, usd: 0.6, scale: 0.76, povSlope: 0.7, cBias: 12, aBase: -2, nairu: 6.5, honey: 12, cRef: 45,
    trade: { X: 4.7, M: 5.0 }, ext: { bond: 2.0, ds: 0.45 },
    polInit: { acceso_info: 0, tasa: 0, cambio: 2, overhang: 1, ganancias: 2, precios: 1 },
    labels: { fmi: { 1: 'Sin programa (relación cortada desde 2006)' }, deuda: { 0: 'Litigio con los holdouts (default técnico)' }, vivienda: { 0: 'Marco previo (Código Civil, sin regulación específica)' } },
    hide: ['rigi', 'ive', 'futbol'],
    elections: { midterm: [22], general: 46, end: 46 }
  };

  const E = AR.events;
  E.push(
    {
      id: 'holdouts', scn: ['dic2015'], title: 'Acuerdo con los holdouts', cal: ['2016-03'],
      text: 'Tras más de una década de litigio, los fondos buitre (holdouts) aceptan negociar. Un acuerdo cierra el default técnico y permite volver a emitir deuda, pero obliga a pagar unos US$9.300 millones y a endeudarse en el exterior. El Congreso debe derogar las leyes Cerrojo y de Pago Soberano.',
      choices: [
        { t: 'Pagar a los holdouts y volver a los mercados', d: 'Ingresan dólares y mejora la confianza, pero sube la deuda.', e: { res: 8, cred: 8, pb: -0.2, g: { fin: 6, agro: 2, sn: -2, mov: -3, uni: -2 } } },
        { t: 'Seguir negociando para no pagar el 100%', d: 'Se prolonga el aislamiento financiero.', e: { cred: -3, g: { fin: -4, sn: 2 } } }
      ]
    },
    {
      id: 'corrida_2018', scn: ['dic2015'], title: 'La corrida de 2018', cal: ['2018-04'],
      when: S => S.m.C < 55,
      text: 'La suba de tasas en Estados Unidos, la sequía y el déficit dejan a la Argentina vulnerable: se corta el financiamiento externo, el dólar se dispara y el Banco Central vende reservas. Como en tantas crisis anteriores, el gobierno debe decidir entre el Fondo Monetario y la flotación pura.',
      choices: [
        { t: 'Pedir un Stand-By al FMI por US$50.000 millones', d: 'Es el mayor préstamo de la historia del Fondo, con metas fiscales.', e: { res: 25, cred: -3, fxj: 40, og: -0.9, inf: 4, pb: 0.5, g: { sn: -4, sp: -4, mov: -4, fin: 3, cm: -3 } } },
        { t: 'Subir las tasas y dejar flotar', d: 'Costo en actividad y empleo.', e: { fxj: 55, og: -1.2, inf: 6, cred: -6, g: { pym: -6, cm: -4, sp: -3 } } }
      ]
    },
    {
      id: 'paso_2019', scn: ['dic2015'], title: 'Las PASO de agosto de 2019', cal: ['2019-08'],
      init: S => { S.ctx.paso = S.appr > 45; },
      text: S => (S.ctx.paso ? 'El oficialismo se sostiene en las primarias y los mercados lo reciben con calma.' : 'El oficialismo pierde por diferencia amplia en las primarias y los mercados descuentan un cambio de signo político: caen los bonos y el dólar se dispara, como el lunes siguiente a las PASO de 2019.'),
      choices: [{ t: 'Continuar', d: '', e: S => (S.ctx.paso ? { cred: 3 } : { cred: -10, fxj: 25, res: -3, inf: 3, g: { cm: -4, fin: -5 } }) }]
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
