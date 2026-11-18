(function (g) {
  const AR = g.AR = g.AR || {};
  const base = AR.SC.dic2023;
  const PT = (id, name, short, color, eco, soc, pc0, govern, d, o, extra) => Object.assign({ id, name, short, color, eco, soc, pc0, govern, seats0: { dip: d[0], sen: d[1] }, desc: o.desc, plat: o.plat, dificultad: o.dif }, extra || {});

  const parties = {
    IU: PT('IU', 'Izquierda Unida (MAS y Partido Comunista)', 'Izquierda Unida', '#F26B38', -0.95, -0.5, 18, false, [4, 0], { desc: 'Frente de izquierda de fines de los 80, con el MAS y el PC. Defensa del salario y rechazo del pago de la deuda externa.', plat: 'No pago de la deuda, salario, nacionalizaciones.' }),
    PJ: PT('PJ', 'Partido Justicialista (Frente Justicialista Popular)', 'PJ', '#4DA8DA', -0.5, -0.1, 50, true, [118, 24], { desc: 'Ganó en mayo de 1989 con una campaña de "salariazo" y "revolución productiva". Sindicatos, conurbano y gobernadores. Su programa real será una profunda reforma del Estado.', plat: 'Mercado interno, industria, pacto con empresarios y sindicatos.', dif: 'Fácil en términos relativos: primera minoría y mandato fuerte, pero con hiperinflación.' }, { cash: true }),
    UCR: PT('UCR', 'Unión Cívica Radical', 'UCR', '#D7263D', -0.1, -0.2, 25, true, [95, 14], { desc: 'Partido del Gobierno saliente de Alfonsín. Perdió la elección de mayo de 1989 en el pico de la crisis; conserva un gran bloque y provincias.', plat: 'Democracia, estabilidad, equilibrio fiscal con inclusión.', dif: 'Muy difícil: asumís tras el naufragio del plan económico del gobierno radical.' }, { cash: true }),
    PROV: PT('PROV', 'Partidos provinciales', 'Provinciales', '#B08968', 0.1, 0.3, 0, false, [26, 8], { desc: 'Movimiento Popular Neuquino, Pacto Autonomista-Liberal de Corrientes, Partido Bloquista de San Juan y otros. Votan según los recursos para su provincia.', plat: 'Regalías, obras, coparticipación.' }, { fed: true }),
    UCEDE: PT('UCEDE', 'Unión del Centro Democrático (UCEDE)', 'UCEDE', '#F2B705', 1, 0.3, 20, true, [11, 0], { desc: 'Partido liberal-conservador fundado en 1982: reducción del Estado, privatizaciones y apertura. Aliado del gobierno entrante en materia económica.', plat: 'Privatizaciones, apertura, desregulación, equilibrio fiscal.', dif: 'Modo extremo: 11 diputados y ningún senador.' })
  };
  const order = ['IU', 'PJ', 'UCR', 'PROV', 'UCEDE'];
  const aff = { //          IU    PJ    UCR   PROV  UCEDE
    cm: [-0.6, -0.1, 0.3, -0.05, 0.6], sp: [-0.1, 0.8, -0.1, 0.15, -0.4], jb: [0.05, 0.5, 0.15, 0.1, -0.2], pu: [0.2, 0.5, 0.15, 0.3, -0.5], sn: [0.4, 0.75, -0.2, 0.1, -0.7],
    inf: [-0.1, 0.5, 0, 0.1, 0.2], pym: [-0.5, 0.2, 0.25, 0, 0.5], ind: [-0.9, 0.1, 0.1, 0.1, 0.7], agro: [-0.9, -0.2, 0.3, 0.1, 0.7], fin: [-0.9, -0.2, 0.1, -0.05, 0.8],
    jov: [0.3, 0.3, 0.1, -0.15, 0.15], uni: [0.5, 0.2, 0.45, -0.1, -0.3], int: [-0.3, 0.5, 0.3, 0.6, 0.05], rel: [-0.7, 0.25, 0.2, 0.3, 0.3], mov: [0.75, 0.5, -0.1, -0.1, -0.6]
  };
  AR.SC.jul1989 = {
    id: 'jul1989', short: 'Julio de 1989', name: 'La hiperinflación', months: 27,
    blurb: 'Inflación del 114% mensual, saqueos y un gobierno que se va seis meses antes. Hay 27 meses hasta las legislativas de 1991.',
    start: { y: 1989, m: 6 },
    parties, order, family: { PJ: 'PERON', UCR: 'RAD' }, chamber: { dip: { total: 254, need: 128, two3: 170, renew: 127 }, sen: { total: 46, need: 24, two3: 31, renew: 15 } }, affArr: aff,
    intro: 'Es el 8 de julio de 1989. Alfonsín entregó el poder cinco meses antes de lo previsto. La inflación de junio fue de 114% mensual y la de julio se encamina a casi 200%; hubo saqueos a supermercados en Rosario y el Gran Buenos Aires, el estado de sitio rige desde mayo, las reservas están agotadas y el país no paga la deuda externa. Hay que frenar la hiperinflación sin quebrar la democracia recuperada hace apenas seis años. Argentina es una moneda sin ancla y una sociedad sin ahorros.',
    source: 'INDEC, BCRA, Ministerio de Economía, Congreso de la Nación (cifras aproximadas; las series de 1989 tienen mucha dispersión; el dólar se expresa en australes).',
    macro: Object.assign({}, base.macro, {
      infM: 114.5, E: 60, fxOff: 300, fxEq: 650, res: -0.4, C: 5, og: -3, u: 7.2, pov: 42, ind: 13, gini: 0.45, pb: -3.5, interest: 3.0, debt: 65, rw: 75, rinf: 70, rPen: 80, rPw: 75, rSoc: 90,
      insec: 40, conf: 55, edu: 55, hea: 55, inst: 55, tra: 40, cult: 55, trade: 0.4, mg: 90, gap: 117, risk: 3200, rate: 160
    }),
    par: { inf: 250, pov: 42 }, infH: [9.6, 9.9, 17.0, 33.4, 78.5, 114.5], gdpYoy0: -4.0, pub: { pov: 42, u: 7.2 }, usd: 0.85, scale: 0.13, nairu: 7, honey: 12, cRef: 10, hyperGrace: 5, povSlope: 1.0, Epers: 0.92, aBase: 5, povMin: 28, runRisk: true,
    trade: { X: 0.8, M: 0.42 }, ext: { bond: 0, ds: 0.1 },
    polInit: { acceso_info: 0, cambio: 6, tasa: 6, overhang: 1, bancos: 0, deuda: 2, fmi: 0 },
    labels: { cambio: { 6: 'Minidevaluaciones diarias aceleradas (mercado oficial y libre)' }, fmi: { 0: 'Stand-By suspendido (el FMI cortó los desembolsos)' }, deuda: { 2: 'Moratoria de hecho con la banca acreedora (desde 1988)' } },
    hide: ['rigi', 'ive', 'diversidad', 'futbol', 'ficha', 'medios', 'electoral', 'memoria', 'vivienda', 'moratoria', 'narco', 'mineria', 'mercosur', 'plataformas', 'conocimiento', 'hidrovia', 'monotributo'],
    elections: { midterm: [26], general: null, end: 26 }
  };

  AR.events.push(
    {
      id: 'saqueos', scn: ['jul1989'], title: 'Saqueos y estado de sitio', cal: ['1989-07'],
      text: 'Con los precios disparados, hay saqueos a supermercados en Rosario, Córdoba y el conurbano; cientos de detenidos y varios muertos. Los comerciantes remarcan por la mañana y por la tarde. El estado de sitio decretado en mayo sigue vigente.',
      choices: [
        { t: 'Asistencia alimentaria de emergencia (Bono Solidario)', d: 'Cuesta caja y descomprime.', e: { pb: -0.4, conf: -10, g: { sp: 5, mov: 3, cm: 1 } } },
        { t: 'Mantener el estado de sitio y reprimir', d: 'Restaura el orden con más tensión.', e: { conf: 6, inst: -6, g: { cm: 2, sp: -5, mov: -6, uni: -3 } } }
      ]
    },
    {
      id: 'bb', scn: ['jul1989'], title: 'Plan Bunge & Born', cal: ['1989-07'],
      text: 'Los empresarios más influyentes del país proponen un plan: devaluación fuerte, aumento de tarifas, congelamiento de precios y un acuerdo con grandes grupos. El equipo económico lo propone; los sindicatos desconfían.',
      choices: [
        { t: 'Aplicar el plan completo (devaluación, tarifas y congelamiento)', d: 'Baja la inflación de golpe, pero sin ancla es frágil.', e: { fxo: 90, Ex: 0.55, inf: -10, conf: -4, cred: 5, g: { ind: 8, agro: 8, fin: 4, sn: -6, sp: -3, jb: -3 } } },
        { t: 'Un pacto social gradual con sindicatos y empresarios', d: 'Menos choque, menos efecto.', e: { Ex: 0.85, inf: -3, pc: -3, g: { sn: 3, ind: -1 } } }
      ]
    },
    {
      id: 'indultos', scn: ['jul1989'], title: 'Indultos', cal: ['1989-10'],
      text: 'Hay presión para pacificar al país tras los levantamientos militares de Semana Santa, Monte Caseros y Villa Martelli. Una de las opciones es decretar indultos a militares condenados y a líderes guerrilleros. La sociedad está dividida entre quienes piden "reconciliación" y quienes reclaman justicia.',
      choices: [
        { t: 'Indultar para cerrar la etapa', d: 'Baja la presión militar, daña la imagen en derechos humanos.', e: { inst: -5, conf: 8, g: { uni: -10, mov: -8, cm: -3, rel: 2 } } },
        { t: 'No indultar', d: 'Se mantiene la tensión con los cuarteles.', e: { conf: 3, inst: 2, g: { uni: 3, mov: 3, cm: 1 } } }
      ]
    },
    {
      id: 'bonex', scn: ['jul1989'], title: 'Una salida de emergencia: el Plan Bonex', cal: ['1989-12'],
      text: 'La hiperinflación se reaviva en diciembre, con 40% mensual. Una medida drástica es canjear compulsivamente los depósitos a plazo fijo en australes por bonos en dólares a 10 años, que absorbe el exceso de liquidez. Es un golpe fuerte a los ahorristas.',
      choices: [
        { t: 'Decretar el Plan Bonex', d: 'Frena la inflación pero es una confiscación de hecho.', e: { setpol: ['bancos', 2], Ex: 0.6, inf: -8 } },
        { t: 'Buscar otra salida', d: 'Sin shock, la inflación sigue.', e: { cred: -3 } }
      ]
    },
    {
      id: 'carapintadas', scn: ['jul1989'], title: 'Levantamiento carapintada', cal: ['1990-12'],
      text: 'Un sector del Ejército se subleva en el Regimiento de Patricios y toma el Edificio Libertador. Hay enfrentamientos con muertos y heridos. Es el cuarto alzamiento desde 1987 y pone a prueba la autoridad civil.',
      choices: [
        { t: 'Reprimir y sancionar con dureza', d: 'Restaura la cadena de mando.', e: { inst: 5, conf: 5, g: { cm: 4, uni: 3, rel: 1 } } },
        { t: 'Negociar con los rebeldes', d: 'Evita el derramamiento de sangre, a costa de autoridad.', e: { inst: -6, conf: -3, g: { cm: -3 } } }
      ]
    },
    {
      id: 'cavallo', scn: ['jul1989'], title: 'Llega Cavallo: ¿convertibilidad?', cal: ['1991-02'],
      text: 'Un nuevo ministro de Economía propone fijar por ley que 1 austral valga 1/10.000 de dólar (más tarde 1 peso = 1 dólar), prohibir emitir sin respaldo en reservas, indexación cero y apertura comercial. Si funciona, es el ancla que faltaba; si falla, se rompe en la crisis del dólar.',
      choices: [
        { t: 'Sancionar la Ley de Convertibilidad (1 a 1)', d: 'Ancla nominal fuerte; hay que sostenerla con reservas.', e: { setpol: ['cambio', 8], cred: 5, pc: -6 } },
        { t: 'Seguir sin ancla cambiaria', d: 'Se mantiene la flexibilidad y el riesgo inflacionario.', e: {} }
      ]
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
