(function (g) {
  const AR = g.AR = g.AR || {};
  const L = AR.L, P = AR.P;

  /* ---------------- SEGURIDAD Y JUSTICIA ---------------- */
  P('seguridad', 'seg', 'Seguridad ciudadana',
    'Estrategia contra el delito urbano.',
    'Argentina tiene tasas de homicidio bajas para la región (~4 cada 100.000), pero la sensación de inseguridad es alta, con picos en Rosario y el conurbano.',
    0, 5, 'ley', 2, [
      L('Estrategia actual (vigente)'),
      L('Mano dura: más fuerzas federales y baja de edad de imputabilidad', { insec: -8, fisc: -0.15, inst: -2 }, { cm: 5, sp: 3, rel: 4, mov: -8, uni: -6 }, [0.2, 0.8], { once: { conf: 6 } }),
      L('Reforma policial integral y prevención', { insec: -5, fisc: -0.15 }, { cm: 3, sp: 3, uni: 3, mov: 2 }, [-0.1, -0.2])
    ]);

  P('protesta', 'seg', 'Protocolo de protesta social',
    'Cómo se enfrentan los cortes de calles y movilizaciones.',
    'Los piquetes nacieron en los 90 (Cutral Có, 1996). En diciembre de 2001 la represión dejó 39 muertos. En 2023 se aprobó el protocolo "antipiquetes".',
    0, 4, 'admin', 0, [
      L('Sin protocolo (vigente)'),
      L('Protocolo antipiquetes', { conf: -5, inst: -2 }, { cm: 4, mov: -9, sn: -3, pym: 2, uni: -3 }, [0.3, 0.6]),
      L('Protocolo con criminalización de la protesta', { conf: -8, inst: -6, transp: -3 }, { cm: 3, mov: -16, sn: -6, uni: -6, jb: -2 }, [0.4, 0.9], { once: { conf: 8 } })
    ]);

  P('narco', 'seg', 'Narcotráfico y crimen organizado',
    'Ataque al delito complejo, con rol de las Fuerzas Armadas o inteligencia financiera.',
    'Rosario sufrió la mayor ola de violencia por narcotráfico en 2023-2024. Las leyes de Defensa (1988) y Seguridad Interior (1991) separan estrictamente defensa y seguridad.',
    0, 5, 'ley', 3, [
      L('Cooperación con las provincias (vigente)'),
      L('Fuerzas Armadas en seguridad interior', { insec: -4, inst: -3, fisc: -0.15 }, { cm: 3, rel: 2, uni: -4, mov: -3 }, [0.3, 0.6]),
      L('Inteligencia financiera y cooperación internacional', { insec: -3, cred: 2 }, { cm: 2, fin: 2, rel: 1 }, [0.1, 0.1])
    ]);

  P('justicia', 'seg', 'Reforma judicial',
    'Corte Suprema, Consejo de la Magistratura y procedimiento penal.',
    'La Corte tiene cuatro miembros desde 2021. Intentos de ampliación (2004, 2020) y de reforma (2013) fracasaron o fueron resistidos. El sistema acusatorio rige en algunas jurisdicciones.',
    0, 6, 'ley', 4, [
      L('Estado actual (vigente)'),
      L('Ampliación de la Corte Suprema', { inst: -4 }, { cm: -3, uni: -1 }, [-0.3], { once: { conf: 5 }, rel: { PJ: 4, PRO: -6, UCR: -4 } }),
      L('Reforma del Consejo, jurados y sistema acusatorio', { inst: 6, transp: 5 }, { cm: 3, uni: 2 }, [0, -0.1], { rel: { CC: 5, UCR: 3 } })
    ]);

  P('defensa', 'seg', 'Defensa',
    'Presupuesto y equipamiento de las Fuerzas Armadas.',
    'El gasto militar cayó de ~3% del PBI en 1982 a ~0,7% en 2023. Caza F-16 adquiridos en 2024.',
    0, 3, 'admin', 1, [
      L('Presupuesto actual (vigente)'),
      L('Modernización de las FFAA', { fisc: -0.2, cred: 1 }, { cm: 1, rel: 1 }, [0.3, 0.3]),
      L('Reducción del gasto militar', { fisc: 0.1 }, { fin: 0, uni: 1 }, [0.3])
    ]);

  /* ---------------- EDUCACION, SALUD, CULTURA ---------------- */
  P('educacion', 'soc', 'Educación básica',
    'Financiamiento, contenidos y modelo educativo.',
    'La Ley de Financiamiento Educativo (2005, reforzada en 2006) fijó 6% del PBI. En las pruebas Aprender, 1 de cada 2 estudiantes no alcanza niveles satisfactorios de lectura.',
    0, 5, 'ley', 3, [
      L('Financiamiento del 6% del PBI (vigente)'),
      L('Recorte moderado y descentralización', { fisc: 0.3, edu: -3 }, { uni: -6, cm: -2, sn: -2 }, [0.5]),
      L('Libertad educativa (vouchers y escuelas autogestionadas)', { fisc: 0.1, edu: -1 }, { rel: 4, cm: 1, uni: -5, sn: -4 }, [0.9, 0.4]),
      L('Inversión extraordinaria (jornada completa y alfabetización)', { fisc: -0.5, edu: 8 }, { uni: 5, cm: 3, sp: 3, sn: 3 }, [-0.7, -0.2])
    ]);

  P('universidades', 'soc', 'Universidades públicas',
    'Financiamiento y acceso a la universidad pública y gratuita.',
    'La Reforma de 1918 (Córdoba) fundó la autonomía universitaria. La gratuidad se estableció en 1949. En 2024 millones marcharon por el financiamiento en la mayor movilización universitaria de la historia reciente.',
    0, 4, 'admin', 1, [
      L('Financiamiento actualizado (vigente)'),
      L('Congelamiento de gastos y auditorías', { fisc: 0.15, edu: -2 }, { uni: -14, jov: -3, cm: -2 }, [0.6], { once: { conf: 10 } }),
      L('Arancelamiento a extranjeros y aranceles parciales', { fisc: 0.1 }, { uni: -12, jov: -4, cm: 1 }, [0.8]),
      L('Financiamiento ampliado e ingreso irrestricto', { fisc: -0.25, edu: 2 }, { uni: 10, jov: 3, cm: 1 }, [-0.7])
    ]);

  P('ciencia', 'soc', 'Ciencia y tecnología',
    'CONICET, INTA, INTI, CNEA y la política científica.',
    'Argentina tiene tres premios Nobel en ciencias (Houssay, Leloir, Milstein). El CONICET emplea unos 11.000 investigadores.',
    0, 3, 'admin', 1, [
      L('Sistema científico financiado (vigente)'),
      L('Ajuste y reordenamiento', { fisc: 0.1, cult: -2, edu: -2 }, { uni: -9, jov: -2 }, [0.6]),
      L('Ciencia asociada al sector privado', { fisc: -0.05 }, { ind: 2, uni: -2 }, [0.5])
    ]);

  P('salud', 'soc', 'Salud',
    'Hospitales públicos, obras sociales, prepagas y PAMI.',
    'El sistema es mixto: subsector público, obras sociales y prepagas. En 2024 hubo un brote récord de dengue.',
    0, 5, 'admin', 2, [
      L('Sistema actual (vigente)'),
      L('Desregulación de obras sociales y prepagas', { hea: -2, fisc: 0.1 }, { fin: 3, cm: 2, sn: -5, jb: -3 }, [0.8]),
      L('Atención primaria y red federal', { hea: 6, fisc: -0.3 }, { sp: 4, jb: 4, int: 4 }, [-0.5]),
      L('Recorte del gasto sanitario', { hea: -6, fisc: 0.35 }, { jb: -6, sp: -5, int: -4, uni: -3 }, [0.6])
    ]);

  P('ive', 'soc', 'Interrupción voluntaria del embarazo',
    'Marco legal sobre el acceso al aborto, uno de los temas que más divide a la sociedad.',
    'La Ley 27.610 (diciembre de 2020) lo legalizó hasta la semana 14. Antes regía el Código Penal de 1921 con causales.',
    0, 5, 'ley', 3, [
      L('Legal hasta la semana 14 (Ley 27.610, vigente)'),
      L('Más restricciones (objeción de conciencia y plazos)', {}, { rel: 6, jov: -3, uni: -4, cm: -1, mov: -3 }, [0, 0.6], { once: { conf: 4 } }),
      L('Derogación de la ley', {}, { rel: 9, jov: -9, uni: -8, cm: -4, mov: -6 }, [0, 1], { once: { conf: 12 } }),
      L('Ampliación del acceso en el sistema público', { hea: 1 }, { jov: 3, uni: 3, mov: 3, rel: -5 }, [0, -0.6])
    ]);

  P('diversidad', 'soc', 'Derechos y diversidad',
    'Políticas de género y diversidad.',
    'Matrimonio Igualitario (2010), Identidad de Género (2012) y cupo laboral trans (2021) son leyes pioneras en la región.',
    0, 4, 'admin', 1, [
      L('Marco actual (vigente)'),
      L('Cierre de áreas específicas y reducción de programas', { fisc: 0.03 }, { jov: -3, uni: -4, mov: -4, rel: 2 }, [0, 0.6]),
      L('Ampliación de políticas de género y diversidad', { fisc: -0.1 }, { jov: 3, uni: 4, mov: 4, rel: -3 }, [0, -0.7])
    ]);

  P('medios', 'soc', 'Medios públicos y pauta oficial',
    'Televisión Pública, Radio Nacional, Télam y publicidad oficial.',
    'Radio Nacional existe desde 1937. En 2024 Télam fue cerrada y reemplazada por una agencia de publicidad estatal.',
    0, 3, 'admin', 1, [
      L('Medios públicos y pauta (vigente)'),
      L('Ajuste de pauta y reestructuración', { fisc: 0.05, cult: -2 }, { uni: -3, pu: -2, cm: 1 }, [0.5]),
      L('Privatización de medios públicos', { fisc: 0.1, cult: -3, inst: -1 }, { uni: -5, pu: -3, cm: 1 }, [0.9])
    ]);

  P('cultura', 'soc', 'Política cultural',
    'INCAA, Fondo Nacional de las Artes, teatros, bibliotecas y festivales.',
    'El cine argentino ganó dos Oscar y la literatura tiene proyección mundial (Borges, Cortázar, Sábato). El INCAA se financia con un impuesto a las entradas.',
    0, 3, 'admin', 1, [
      L('Estructura vigente'),
      L('Ajuste y desregulación cultural', { fisc: 0.05, cult: -5 }, { jov: -4, uni: -6, cm: -3 }, [0.6]),
      L('Plan federal de cultura', { fisc: -0.1, cult: 6 }, { jov: 3, uni: 5, cm: 2 }, [-0.5])
    ]);

  P('futbol', 'soc', 'Fútbol y deporte',
    'Régimen de clubes, AFA y sociedades anónimas deportivas.',
    'El fútbol es una institución nacional: Mundial 1978, 1986, 2022. Los clubes son asociaciones civiles sin fines de lucro; la AFA gestiona selecciones y torneos.',
    0, 3, 'ley', 2, [
      L('Clubes como asociaciones civiles (vigente)'),
      L('Sociedades Anónimas Deportivas permitidas', { cult: -1 }, { jov: 3, fin: 2, cm: 1, sp: -4 }, [0.9], { once: { conf: 4 } }),
      L('Intervención y control de la AFA', { inst: -2 }, { sp: 1, jov: 1 }, [-0.2], { once: { conf: 4 } })
    ]);

  /* ---------------- INSTITUCIONES Y MUNDO ---------------- */
  P('electoral', 'ins', 'Sistema electoral',
    'Reglas para votar y elegir candidatos.',
    'Las PASO se crearon en 2009. La Boleta Única de Papel se usó por primera vez a nivel nacional en 2025 (Ley 27.781).',
    0, 5, 'ley', 3, [
      L('Sistema vigente (PASO y boleta partidaria)'),
      L('Boleta Única de Papel', { inst: 3, transp: 3 }, { cm: 2 }, [0, 0], { rel: { PF: 3, UCR: 3, CC: 3 } }),
      L('Boleta Única y eliminación de las PASO', { inst: 2, transp: 3 }, { cm: 1 }, [0.2], { rel: { PJ: -6, PROV: -3, PRO: 2 } }),
      L('Reforma política integral', { inst: 5, transp: 5 }, { cm: 3, uni: 2 }, [0, -0.2], { rel: { CC: 6, UCR: 4, PJ: -4 } })
    ]);

  P('ficha', 'ins', 'Ficha Limpia',
    'Impide candidatearse a condenados en segunda instancia.',
    'Se discute desde 2010. En 2025 se aprobó en Diputados y fue rechazada en el Senado.',
    0, 4, 'ley', 3, [
      L('Sin Ficha Limpia (vigente)'),
      L('Ley de Ficha Limpia', { transp: 6, inst: 3 }, { cm: 4, rel: 2 }, [-0.1], { rel: { PJ: -8, CC: 6, PRO: 4 } })
    ]);

  P('anticorrupcion', 'ins', 'Política anticorrupción',
    'Oficina Anticorrupción, extinción de dominio y control del gasto.',
    'Desde los cuadernos (2018) y la obra pública (Vialidad) hay causas históricas; la corrupción figura en el podio de preocupaciones públicas desde 2000.',
    0, 4, 'ley', 3, [
      L('Oficina Anticorrupción (vigente)'),
      L('Cierre y simplificación de organismos de control', { transp: -8 }, { cm: -2, rel: -1 }, [0.4]),
      L('Agencia independiente y extinción de dominio', { transp: 10, inst: 4 }, { cm: 3, rel: 2, uni: 2 }, [-0.1, -0.1])
    ]);

  P('malvinas', 'ins', 'Cuestión Malvinas',
    'Estrategia sobre la soberanía de las islas.',
    'La guerra de 1982 dejó 649 muertos argentinos y la derrota aceleró el fin de la dictadura. La disputa figura en la Constitución (cláusula transitoria primera).',
    0, 3, 'admin', 1, [
      L('Reclamo diplomático (vigente)'),
      L('Deshielo con el Reino Unido (cooperación, vuelos, pesca)', { cred: 1 }, { sn: -2, mov: -2, uni: -3, cm: 1, fin: 1 }, [0.5, 0.2]),
      L('Línea dura: denuncia en foros y sanciones', { cred: -1 }, { sn: 2, uni: 2, fin: -1 }, [-0.4, -0.2])
    ]);

  P('memoria', 'ins', 'Memoria, Verdad y Justicia',
    'Política sobre los crímenes de la última dictadura y la memoria histórica, con fuerte carga simbólica.',
    'Juicio a las Juntas (1985), leyes de Punto Final y Obediencia Debida (1986-87), indultos (1989-90), nulidad (2003) y reapertura de juicios. El 24 de marzo es feriado desde 2002 (inamovible desde 2006).',
    0, 4, 'admin', 1, [
      L('Política actual (vigente)'),
      L('Reducción de presupuesto y revisión de programas', { fisc: 0.02, cult: -3 }, { uni: -6, mov: -6, jov: -2, rel: 1, cm: 1 }, [0.2, 0.6]),
      L('"Memoria completa" (incluye víctimas de la violencia guerrillera)', { cult: -2 }, { uni: -8, mov: -8, cm: 2, rel: 3 }, [0.2, 0.9], { once: { conf: 4 } })
    ]);
})(typeof window !== 'undefined' ? window : globalThis);
