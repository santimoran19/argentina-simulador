(function (g) {
  const AR = g.AR = g.AR || {};
  const base = AR.SC.dic2023;
  const PT = (id, name, short, color, eco, soc, pc0, govern, d, o, extra) => Object.assign({ id, name, short, color, eco, soc, pc0, govern, seats0: { dip: d[0], sen: d[1] }, desc: o.desc, plat: o.plat, dificultad: o.dif }, extra || {});

  const parties = {
    IZQ: PT('IZQ', 'Izquierda (PO, PTS, MST, Izquierda Unida)', 'Izquierda', '#F26B38', -1, -0.85, 18, true, [3, 0], { desc: 'Partidos de izquierda trotskista y comunista. Protagonistas de las asambleas barriales y el movimiento piquetero del 2001-2002.', plat: 'No pago de la deuda, nacionalización de la banca, salario mínimo igual a la canasta.', dif: 'Modo extremo: 3 diputados y ningún senador.' }),
    PJ: PT('PJ', 'Partido Justicialista', 'PJ', '#4DA8DA', -0.4, -0.2, 40, true, [116, 40], { desc: 'Principal fuerza del Congreso y de las provincias. Con la caída de De la Rúa, la Asamblea Legislativa elige al presidente entre peronistas. Productivismo, industria nacional, devaluación competitiva.', plat: 'Salir de la convertibilidad, proteger la industria, emergencia social.', dif: 'Moderada: primera minoría, pero el país está en default, en corralito y en la calle.' }, { cash: true }),
    FREP: PT('FREP', 'Frente Grande / FREPASO', 'FREPASO', '#8E5BD6', -0.4, -0.5, 0, false, [13, 1], { desc: 'Centroizquierda que integró la Alianza con la UCR; su vicepresidente renunció en 2000. Muy debilitado.', plat: 'Anticorrupción, políticas sociales.' }),
    ARI: PT('ARI', 'Argentinos por una República de Iguales (ARI)', 'ARI', '#2FBF71', 0, -0.4, 26, true, [17, 1], { desc: 'Creado en 2001 desde la Alianza por una figura anticorrupción. Crece con el rechazo a la clase política.', plat: 'Transparencia, justicia independiente, reforma política.', dif: 'Difícil: 17 diputados y 1 senador, pero con capital simbólico.' }),
    UCR: PT('UCR', 'Unión Cívica Radical', 'UCR', '#D7263D', 0.3, 0, 25, true, [66, 22], { desc: 'El partido de De la Rúa. Se desploma en octubre de 2001 y queda asociado a la crisis; sigue con fuerte peso en el Senado y las provincias.', plat: 'Institucionalidad y salida ordenada.', dif: 'Difícil: castigo social y sin mayoría.' }, { cash: true }),
    PROV: PT('PROV', 'Partidos provinciales y otros', 'Provinciales', '#B08968', 0.1, 0.3, 0, false, [37, 8], { desc: 'Movimiento Popular Neuquino, Partido Demócrata de Mendoza, Partido Renovador de Salta, entre otros. Votan según la billetera de la Nación.', plat: 'Obras, recursos y regalías.' }, { fed: true }),
    AR: PT('AR', 'Acción por la República', 'Acción por la República', '#F2B705', 0.85, 0.2, 20, true, [5, 0], { desc: 'Partido fundado en 1997 por el ex ministro de Economía de la Convertibilidad: liberalismo económico y modernización.', plat: 'Ortodoxia económica, apertura, equilibrio fiscal.', dif: 'Modo extremo: 5 diputados y las cicatrices del 2001.' })
  };
  const order = ['IZQ', 'PJ', 'FREP', 'ARI', 'UCR', 'PROV', 'AR'];
  const aff = { //          IZQ    PJ    FREP  ARI   UCR   PROV  AR
    cm: [-0.6, -0.4, 0, 0.45, 0.1, -0.1, 0.5], sp: [-0.1, 0.7, 0.1, 0.05, -0.4, 0.2, -0.5], jb: [0.1, 0.45, 0.1, 0.15, 0.1, 0.1, -0.2], pu: [0.25, 0.5, 0.2, 0.1, 0, 0.3, -0.5],
    sn: [0.4, 0.65, 0.35, 0.1, -0.2, 0.1, -0.7], inf: [-0.1, 0.55, 0, 0.1, -0.2, 0.15, 0.1], pym: [-0.5, 0.2, -0.1, 0.3, 0.2, 0.1, 0.5], ind: [-0.9, 0.2, -0.3, 0.2, 0.1, 0.1, 0.7],
    agro: [-0.9, -0.1, -0.3, 0.3, 0.3, 0.2, 0.6], fin: [-0.9, -0.1, -0.2, 0.2, 0.1, 0, 0.8], jov: [0.3, 0.15, 0.2, 0.4, -0.2, -0.15, 0.1], uni: [0.5, 0.1, 0.35, 0.45, 0.1, -0.1, -0.3],
    int: [-0.3, 0.5, 0.1, 0, 0.2, 0.55, 0], rel: [-0.7, 0.2, -0.1, 0.2, 0.25, 0.3, 0.2], mov: [0.75, 0.5, 0.2, 0.05, -0.5, -0.1, -0.7]
  };
  AR.SC.ene2002 = {
    id: 'ene2002', short: 'Enero de 2002', name: 'Después del 2001', months: 16,
    blurb: 'Default, corralito, 18% de desocupación y un país en la calle. Tenés 16 meses hasta las elecciones de abril de 2003.',
    start: { y: 2002, m: 0 },
    parties, order, family: { PJ: 'PERON', FREP: 'ALIANZA', UCR: 'ALIANZA' }, chamber: AR.CHAMBER, affArr: aff,
    intro: 'Es el 2 de enero de 2002. Tras la renuncia de De la Rúa y la sucesión de cinco presidentes en pocos días, la Asamblea Legislativa te elige para completar el mandato hasta 2003. Argentina declaró el mayor default de su historia, los bancos están cerrados por el corralito, la desocupación supera el 18% y la pobreza se acerca al 40%. La convertibilidad (1 peso = 1 dólar) está terminada en los hechos, pero nadie sabe cómo salir de ella. En la calle se corea "que se vayan todos".',
    source: 'INDEC, BCRA, Ministerio de Economía, Congreso de la Nación (cifras aproximadas; la reconstrucción de cifras de 2002 tiene gran dispersión).',
    macro: Object.assign({}, base.macro, {
      infM: -0.2, E: 3.0, fxOff: 1.0, fxEq: 1.7, res: 1.0, C: 3, og: -6, u: 18.3, pov: 35.4, ind: 12.2, gini: 0.5, pb: -0.5, interest: 2.0, debt: 55,
      insec: 60, conf: 60, edu: 50, hea: 50, inst: 25, tra: 25, cult: 55, trade: 0.3, mg: 3, gap: 70, risk: 4500, rate: 80
    }),
    par: { inf: 45, pov: 57 }, infH: [-0.1, -0.3, 0.2, -0.4, -0.1, -0.3, -0.1, -0.2, -0.2, -0.1, -0.2], gdpYoy0: -4.4, pub: { pov: 35.4, u: 18.3 }, usd: 0.9, aBase: -7, scale: 0.355, nairu: 9, honey: 2, cRef: 10, runRisk: true,
    trade: { X: 2.2, M: 1.9 }, ext: { bond: 0, ds: 0.15 },
    polInit: { acceso_info: 0, tasa: 3, cambio: 7, overhang: 0, bancos: 1, deuda: 2, retenciones: 0, ret_ind: 0, aranceles: 1, privat: 2, jubilaciones: 3, paritarias_pub: 2, paritarias: 1, salario_min: 2, regimenes: 2, reforma_lab: 1, sub_energia: 3, transferencias: 1, precios: 2, exterior: 2 },
    labels: { cambio: { 7: 'Convertibilidad 1 a 1 (en agonía; dólar oficial fijo)' }, fmi: { 1: 'Acuerdo Stand-By suspendido (blindaje 2000-2001)' }, overhang: { 0: 'Sin stock relevante de pasivos del BCRA' }, educacion: { 0: 'Financiamiento actual (Ley Federal de Educación)' } },
    hide: ['rigi', 'ive', 'diversidad', 'futbol', 'ficha', 'medios', 'memoria', 'vivienda', 'moratoria', 'electoral', 'plataformas'],
    elections: { midterm: [], general: 15, end: 15 }
  };

  AR.events.push(
    {
      id: 'salida_conv', scn: ['ene2002'], title: 'La salida de la convertibilidad', cal: ['2002-01'],
      text: 'El Congreso sancionó la Ley de Emergencia Pública y el fin de la convertibilidad. Hay que decidir ya cómo se fija el tipo de cambio: en la calle el dólar libre vale un 70% más que el oficial. Cualquier decisión pesa sobre ahorristas, deudores en dólares, exportadores y salarios.',
      choices: [
        { t: 'Devaluación pactada: dólar oficial a $1,40', d: 'Mercado dual. Cuesta inflación hoy.', e: { fxo: 40, inf: 3, g: { cm: -6, sp: -3, agro: 6, ind: 6, fin: -4 } } },
        { t: 'Unificar y dejar flotar el dólar', d: 'Choque mayor, pero evita una brecha insostenible.', e: { setpol: ['cambio', 4], cred: 2, inf: 4, g: { cm: -8, sp: -4, agro: 6, ind: 8, fin: -6 } } },
        { t: 'Sostener el 1 a 1 con el corralito', d: 'Tiempo comprado, reservas sangrando.', e: { cred: -6, res: -0.8, g: { cm: -3 } } }
      ]
    },
    {
      id: 'cacerolazo', scn: ['ene2002'], title: 'Cacerolazos y asambleas barriales', cal: ['2002-02'],
      text: 'Las clases medias, golpeadas por el corralito, salen a golpear cacerolas frente a los bancos y se organizan en asambleas barriales. Junto a las organizaciones piqueteras, el reclamo de "que se vayan todos" cuestiona toda representación política.',
      choices: [
        { t: 'Convocar al Diálogo Argentino con la Iglesia y las ONG', d: 'Cuesta capital político pero descomprime.', e: { pc: -4, conf: -8, inst: 2, g: { cm: 3, rel: 4, mov: 2 } } },
        { t: 'Declarar el estado de sitio', d: 'Respuesta dura, mucho costo institucional.', e: { conf: 10, inst: -8, g: { cm: -6, mov: -8, uni: -4 } } }
      ]
    },
    {
      id: 'smith', scn: ['ene2002'], title: 'La Corte declara inconstitucional el corralito', cal: ['2002-02'],
      text: 'La Corte Suprema (fallo "Smith") declara inconstitucional el corralito y miles de ahorristas presentan amparos. Si el Gobierno acata y libera depósitos, los bancos no tienen liquidez; si no, se abre una guerra con el Poder Judicial.',
      choices: [
        { t: 'Acatar y pagar las sentencias a medida que se pueda', d: 'Respeta la Justicia, pero drena el sistema.', e: { inst: 3, res: -1.2, g: { cm: 5, pym: 3, fin: -3 } } },
        { t: 'Demorar los fallos y reprogramar', d: 'Conflicto con la Corte.', e: { inst: -6, conf: 6, g: { cm: -6, pym: -3 } } }
      ]
    },
    {
      id: 'jefes', scn: ['ene2002'], title: 'Plan Jefes y Jefas de Hogar Desocupados', cal: ['2002-04'],
      text: 'Con millones de desocupados y las organizaciones piqueteras en la calle, el Gobierno puede lanzar un plan masivo de asistencia (150 pesos por mes por jefe o jefa de hogar con contraprestación laboral), que llegó a alcanzar a unos dos millones de personas.',
      choices: [
        { t: 'Lanzar el plan a escala nacional', d: 'Cuesta cerca del 1% del PBI, pero baja la tensión.', e: { pb: -0.9, conf: -10, g: { sp: 8, mov: 6, inf: 3, int: 3, cm: -1 } } },
        { t: 'Hacer un programa acotado', d: 'Menos costo, menos alivio.', e: { pb: -0.3, g: { sp: 2, mov: 1 } } }
      ]
    },
    {
      id: 'avellaneda', scn: ['ene2002'], title: 'Crisis de Avellaneda y adelantamiento electoral', cal: ['2002-06'],
      text: 'En el puente Pueyrredón, una protesta piquetera termina con una brutal represión y dos jóvenes manifestantes asesinados. La conmoción nacional obliga a replantear el calendario político: la sociedad exige elecciones anticipadas.',
      choices: [
        { t: 'Adelantar las elecciones y garantizar la transición', d: 'Reduce la presión social y reordena la agenda.', e: { inst: 6, conf: -12, pc: -3, g: { cm: 4, mov: 3, uni: 3, sn: 2 } } },
        { t: 'Mantener el cronograma original', d: 'Mayor desgaste.', e: { conf: 10, inst: -4, g: { cm: -5, mov: -6, uni: -3 } } }
      ]
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
