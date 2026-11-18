(function (g) {
  const AR = g.AR = g.AR || {};
  AR.partyOrder = ['FIT', 'PJ', 'PF', 'PROV', 'CC', 'UCR', 'PRO', 'LLA'];
  // eco: -1 (estatista/izquierda) .. +1 (libre mercado). soc: -1 (progresista) .. +1 (conservador)
  AR.parties = {
    LLA: {
      id: 'LLA', name: 'La Libertad Avanza', short: 'LLA', color: '#8E5BD6', eco: 0.95, soc: 0.5, pc0: 30, govern: true,
      seats0: { dip: 38, sen: 7 },
      desc: 'Fundada en 2021, ganó la presidencia en el balotaje de noviembre de 2023 con el 55,7%. Libertarios y conservadores: ajuste fiscal profundo, desregulación, apertura comercial, competencia de monedas o dolarización y confrontación con "la casta". Llega con un bloque muy chico en el Congreso.',
      plat: 'Déficit cero, baja de impuestos, reforma laboral y previsional, apertura, fin del cepo, achicamiento del Estado.',
      dificultad: 'Muy difícil políticamente (38 diputados y 7 senadores), pero con luna de miel y mandato de cambio.'
    },
    PRO: {
      id: 'PRO', name: 'Propuesta Republicana (PRO)', short: 'PRO', color: '#F2B705', eco: 0.6, soc: 0.15, pc0: 40, govern: true,
      seats0: { dip: 37, sen: 8 },
      desc: 'Nacido en 2005 desde la Ciudad de Buenos Aires, gobernó el país entre 2015 y 2019 dentro de Cambiemos / Juntos por el Cambio. Centroderecha gerencial: liberal en economía, republicano en lo institucional, gradualista en el ajuste.',
      plat: 'Reducción gradual del déficit, apertura, reformas laborales y previsional pactadas, seguridad, institucionalidad.',
      dificultad: 'Difícil: bloque mediano, necesita al radicalismo y a los federales.'
    },
    UCR: {
      id: 'UCR', name: 'Unión Cívica Radical (UCR)', short: 'UCR', color: '#D7263D', eco: 0.1, soc: -0.15, pc0: 38, govern: true,
      seats0: { dip: 34, sen: 13 },
      desc: 'Fundada en 1891, es el partido más antiguo en actividad: Yrigoyen, Illia, Alfonsín, De la Rúa. Centrista y republicano, con raíz federal (intendencias, gobernaciones, el Senado).',
      plat: 'Institucionalidad, federalismo, educación pública, equilibrio fiscal sin shock, acuerdos amplios.',
      dificultad: 'Difícil: sin mayoría propia y con un electorado dividido.'
    },
    PJ: {
      id: 'PJ', name: 'Partido Justicialista / Unión por la Patria', short: 'PJ-UxP', color: '#4DA8DA', eco: -0.6, soc: -0.35, pc0: 45, govern: true,
      seats0: { dip: 99, sen: 33 },
      desc: 'El movimiento fundado por Perón en 1946-47: sindicatos, conurbano, gobernadores y el kirchnerismo (2003-2015, 2019-2023). Mercado interno, Estado presente, derechos sociales y laborales.',
      plat: 'Salario y empleo, mercado interno, subsidios, soberanía económica, jubilaciones, derechos.',
      dificultad: 'Moderada: primera minoría en ambas cámaras, pero lejos de la mayoría propia y con una crisis macro heredada.'
    },
    FIT: {
      id: 'FIT', name: 'Frente de Izquierda y de los Trabajadores - Unidad', short: 'FIT-U', color: '#F26B38', eco: -1, soc: -0.85, pc0: 22, govern: true,
      seats0: { dip: 5, sen: 0 },
      desc: 'Creado en 2011 por PTS, Partido Obrero, Izquierda Socialista y MST. Trotskismo con fuerte presencia sindical y universitaria; rechaza el pago de la deuda al FMI y propone nacionalizaciones.',
      plat: 'No pago de la deuda, nacionalización de la banca y el comercio exterior, salario mínimo igual a la canasta, reparto de las horas de trabajo.',
      dificultad: 'Modo extremo: 5 diputados y ningún senador. Casi todo debe pasar por decreto o por la calle.'
    },
    CC: {
      id: 'CC', name: 'Coalición Cívica ARI', short: 'CC-ARI', color: '#2FBF71', eco: 0.25, soc: -0.3, pc0: 30, govern: true,
      seats0: { dip: 6, sen: 3 },
      desc: 'Surgida en 2002-2007 como ARI y Coalición Cívica: republicanismo, anticorrupción y control de las instituciones. Socio histórico de Juntos por el Cambio.',
      plat: 'Transparencia, justicia independiente, reforma política, equilibrio fiscal con inclusión.',
      dificultad: 'Modo extremo: bloque muy chico, gobernás con acuerdos permanentes.'
    },
    PF: {
      id: 'PF', name: 'Federales (Hacemos Coalición Federal / Provincias Unidas)', short: 'Federales', color: '#7F8FA9', eco: -0.05, soc: 0.0, pc0: 36, govern: true,
      seats0: { dip: 25, sen: 2 },
      desc: 'Bloque de gobernadores y legisladores de origen peronista no kirchnerista y radical (Córdoba, Santa Fe y otras provincias). Defienden la producción del interior y los recursos provinciales.',
      plat: 'Federalismo fiscal, baja de retenciones, producción, institucionalidad, "ancha avenida del medio".',
      dificultad: 'Difícil: 25 diputados y sin red nacional.'
    },
    PROV: {
      id: 'PROV', name: 'Partidos provinciales', short: 'Provinciales', color: '#B08968', eco: 0.1, soc: 0.25, pc0: 0, govern: false,
      seats0: { dip: 13, sen: 6 },
      desc: 'Movimiento Popular Neuquino, Frente Cívico Santiagueño, Frente Renovador de la Concordia, Independencia (Tucumán) y otros. Votan según los recursos y obras de su provincia y la relación de la Casa Rosada con su gobernador.',
      plat: 'Obras, transferencias y regalías para la provincia.'
    }
  };
  // Familias políticas históricas (bonus de afinidad)
  AR.family = { PRO: 'JxC', UCR: 'JxC', CC: 'JxC', PJ: 'PERON', PF: 'PERON' };
  AR.CHAMBER = { dip: { total: 257, need: 129, two3: 172, renew: 127 }, sen: { total: 72, need: 37, two3: 48, renew: 24 } };
})(typeof window !== 'undefined' ? window : globalThis);
