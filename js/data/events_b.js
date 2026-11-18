(function (g) {
  const AR = g.AR = g.AR || {};
  // Efectos admitidos: pc, res, fxo, Ex, setpol, cred, conf, inst, tra, insec, edu, hea, cult, og, inf, fxj, pb, harv, g, rel
  const lv = (S, id) => S.pol[id].cur;
  const A = (S, id) => S.A[id] || 50;
  const month = (S, ...ms) => ms.includes(AR.dateOf(S.t).m);
  const MOD = ['dic2015', 'dic2023'];

  AR.events.push(
    /* ---------------- generales ---------------- */
    {
      id: 'apagon', title: 'Apagón masivo', cd: 12,
      w: S => (month(S, 11, 0, 1) ? 0.05 + (lv(S, 'obras') === 1 ? 0.04 : 0) : 0.008),
      text: 'Una ola de calor dispara el consumo y una falla en la red deja sin luz a millones de usuarios. Hay vecinos cortando calles con cacerolas y hospitales funcionando con generadores.',
      choices: [
        { t: 'Plan de emergencia y obras de transporte eléctrico', d: 'Cuesta caja, pero ataca el problema.', e: { pb: -0.15, conf: -3, g: { cm: 2, pym: 2 } } },
        { t: 'Multar a las distribuidoras', d: 'Gesto popular que espanta inversiones.', e: { cred: -2, inst: -1, g: { cm: 3, sp: 2, fin: -3 } } }
      ]
    },
    {
      id: 'tomas', title: 'Toma de tierras', cd: 12,
      w: S => (S.m.pov > 40 ? 0.06 : 0.015),
      text: 'Cientos de familias ocupan un predio en el conurbano reclamando un lugar donde vivir. El dueño pide el desalojo y los vecinos están divididos.',
      choices: [
        { t: 'Desalojo con orden judicial', d: 'Orden y propiedad, con costo social.', e: { conf: 6, g: { cm: 4, rel: 1, mov: -8, sp: -3 } } },
        { t: 'Plan de urbanización y lotes con servicios', d: 'Solución de fondo, cuesta plata.', e: { pb: -0.12, g: { sp: 5, mov: 4, cm: -3 } } }
      ]
    },
    {
      id: 'paro_docente', title: 'Paro docente: no empiezan las clases', cd: 10,
      w: S => (month(S, 1, 2) ? (lv(S, 'paritarias_pub') >= 1 ? 0.3 : 0.08) : 0.01),
      text: 'Los gremios docentes anuncian un paro por tiempo indeterminado y las clases no arrancan. Millones de familias se reorganizan y la oposición acusa al Gobierno de abandonar la escuela pública.',
      choices: [
        { t: 'Aumento del fondo de incentivo docente', d: 'Las clases empiezan.', e: { pb: -0.12, edu: 1, g: { pu: 5, uni: 2, cm: 2 } } },
        { t: 'Descontar los días de paro', d: 'Firmeza que divide a la sociedad.', e: { conf: 4, edu: -1, g: { pu: -6, cm: 1 } } }
      ]
    },
    {
      id: 'camioneros', title: 'Bloqueo de camioneros', cd: 12,
      w: S => 0.02 + (lv(S, 'reforma_lab') > 0 ? 0.05 : 0) + (lv(S, 'sindicatos') > 0 ? 0.04 : 0),
      text: 'El gremio de camioneros bloquea centros de distribución y plantas: falta combustible en algunas estaciones y los supermercados no reciben mercadería.',
      choices: [
        { t: 'Negociar con el gremio', d: 'Cuesta capital político.', e: { pc: -3, g: { sn: 4 } } },
        { t: 'Desalojar los bloqueos', d: 'Más conflicto, más autoridad.', e: { conf: 5, og: -0.1, g: { sn: -6, cm: 3, pym: 2 } } }
      ]
    },
    {
      id: 'incendios', title: 'Incendios forestales en la Patagonia', cd: 10,
      w: S => (month(S, 11, 0, 1) ? 0.06 : 0),
      text: 'El fuego arrasa miles de hectáreas de bosque nativo en la cordillera. Hay evacuados, casas quemadas y brigadistas desbordados.',
      choices: [
        { t: 'Brigadistas y aviones hidrantes federales', d: 'Respuesta rápida.', e: { pb: -0.08, g: { int: 4, jov: 2, cm: 1 } } },
        { t: 'Que actúe la provincia', d: 'Ahorro con costo de imagen.', e: { cult: -1, g: { int: -4, jov: -3 } } }
      ]
    },
    {
      id: 'finde_largo', title: 'Fin de semana largo récord', cd: 6, w: S => (S.m.infM < 6 ? 0.03 : 0.01),
      text: 'Las rutas y las terminales explotan: millones de turistas recorren el país en el fin de semana largo y las economías regionales lo festejan.',
      choices: [{ t: 'Celebrar', d: '', e: { og: 0.1, g: { pym: 2, int: 2, cm: 1 } } }]
    },
    {
      id: 'yacimiento', title: 'Descubrimiento de un gran yacimiento', cd: 24, w: S => 0.012,
      text: 'Un relevamiento confirma un yacimiento de enorme potencial en el interior. Las provincias se entusiasman y las empresas piden reglas claras.',
      choices: [
        { t: 'Licitar con reglas claras y estables', d: 'Llegan inversiones.', e: { res: 1, cred: 2, g: { int: 3, ind: 2, fin: 2 } } },
        { t: 'Explotación a cargo del Estado', d: 'Soberanía con menos capital.', e: { pb: -0.05, g: { sn: 2, int: 2, fin: -2 } } }
      ]
    },
    {
      id: 'premio_cine', title: 'Una película argentina triunfa en el mundo', cd: 18, w: S => 0.02,
      text: 'Una producción nacional gana uno de los premios más importantes del cine internacional. El equipo dedica el premio "a la cultura argentina".',
      choices: [
        { t: 'Recibir al equipo en la Casa Rosada', d: '', e: { cult: 3, g: { uni: 2, jov: 2, cm: 1 } } },
        { t: 'Un saludo en las redes y nada más', d: '', e: { cult: 1, g: { uni: -1 } } }
      ]
    },
    {
      id: 'ruidazo', title: 'Ruidazo contra las tarifas', cd: 10,
      w: S => (lv(S, 'sub_energia') === 1 || lv(S, 'sub_energia') === 2 ? 0.09 : 0),
      text: 'Llegan las boletas de luz y gas con aumentos fuertes. A la noche, los barrios suenan a cacerolas y bocinas.',
      choices: [
        { t: 'Tarifa social y topes a los aumentos', d: 'Alivio que cuesta caja.', e: { pb: -0.15, g: { cm: 4, sp: 3, jb: 2 } } },
        { t: 'Sostener los aumentos', d: 'El ajuste sigue.', e: { conf: 4, g: { cm: -4, sp: -3, fin: 2 } } }
      ]
    },
    {
      id: 'motin', title: 'Protesta policial por salarios', cd: 18, w: S => (S.m.rPw < 85 ? 0.05 : 0.01),
      text: 'Agentes de policía se acuartelan reclamando aumentos y rodean edificios públicos con patrulleros. En algunos barrios aumentan los robos.',
      choices: [
        { t: 'Aumento salarial a las fuerzas', d: 'Se termina rápido.', e: { pb: -0.1, insec: -1, g: { cm: 2 } } },
        { t: 'Sancionar a los amotinados', d: 'Autoridad, con días de tensión.', e: { insec: 3, inst: 2, conf: 4 } }
      ]
    },
    {
      id: 'carne', title: 'Se dispara el precio de la carne', cd: 14, w: S => 0.025,
      text: 'El asado se vuelve un lujo: el precio de la carne vacuna sube muy por encima de la inflación. Es un símbolo nacional y el tema copa los noticieros.',
      choices: [
        { t: 'Cerrar las exportaciones de carne', d: 'Baja el precio a costa del campo y los dólares.', e: { inf: -1, og: -0.05, cred: -2, g: { agro: -10, int: -2, sp: 3, cm: 2 } } },
        { t: 'Acuerdo de precios con los frigoríficos', d: 'Intermedio.', e: { inf: -0.5, pc: -3, g: { sp: 1 } } },
        { t: 'Dejar actuar al mercado', d: 'El precio se acomoda solo... o no.', e: { inf: 0.5, g: { agro: 3, sp: -3, cm: -2 } } }
      ]
    },
    {
      id: 'tren', title: 'Tragedia ferroviaria', cd: 24, w: S => (lv(S, 'obras') === 1 ? 0.03 : 0.006),
      text: 'Un tren no frena al llegar a la estación terminal y choca contra el andén: hay muertos y cientos de heridos. Los familiares exigen justicia y la oposición apunta a la falta de inversión.',
      choices: [
        { t: 'Plan de emergencia ferroviaria', d: 'Cuesta caja.', e: { pb: -0.15, g: { sp: 3, cm: 2 } } },
        { t: 'Responsabilizar a la empresa operadora', d: '', e: { inst: -1, g: { sp: -2, cm: -2 } } }
      ]
    },
    {
      id: 'fuga_cerebros', title: 'Fuga de cerebros', cd: 18, w: S => (A(S, 'uni') < 35 ? 0.06 : 0.01),
      text: 'Un informe revela que miles de científicos y jóvenes profesionales emigran cada año. En las redes circulan despedidas en Ezeiza.',
      choices: [
        { t: 'Programa de repatriación de científicos', d: '', e: { pb: -0.03, g: { uni: 5, jov: 2 } } },
        { t: 'Es la libertad de cada uno', d: '', e: { cult: -1, g: { uni: -4, jov: -2 } } }
      ]
    },
    {
      id: 'cuasimonedas', title: 'Una provincia emite cuasimonedas', cd: 18,
      w: S => (S.scn === 'ene2002' ? 0.12 : S.m.C < 15 ? 0.04 : 0),
      text: 'Sin fondos para pagar sueldos, una provincia paga a sus empleados con bonos propios que circulan como moneda, como los patacones de 2001. Otros gobernadores amenazan con imitarla.',
      choices: [
        { t: 'Rescatar los bonos con títulos nacionales', d: 'Paz con las provincias, costo fiscal.', e: { pb: -0.3, rel: { PROV: 8, PF: 6 }, g: { int: 4, pu: 4 } } },
        { t: 'Exigir el ajuste provincial', d: 'Conflicto con gobernadores y estatales.', e: { conf: 5, rel: { PROV: -8, PF: -6 }, g: { int: -5, pu: -5 } } }
      ]
    },
    /* ---------------- épocas modernas ---------------- */
    {
      id: 'ciberataque', scn: MOD, title: 'Ciberataque a organismos públicos', cd: 18, w: S => 0.02,
      text: 'Un grupo de hackers secuestra los datos de un organismo nacional y pide un rescate. Millones de datos personales quedan expuestos.',
      choices: [
        { t: 'Plan nacional de ciberseguridad', d: '', e: { pb: -0.05, inst: 2, g: { jov: 1 } } },
        { t: 'Minimizar el incidente', d: '', e: { tra: -3, g: { cm: -2 } } }
      ]
    },
    {
      id: 'vaticano', scn: MOD, title: 'Audiencia en el Vaticano', cd: 24, w: S => 0.015,
      text: 'El Papa recibe al Presidente en una audiencia privada y le pide prioridad para los pobres y diálogo con las organizaciones sociales.',
      choices: [
        { t: 'Asumir compromisos sociales', d: '', e: { pb: -0.05, g: { rel: 6, sp: 2, mov: 2 } } },
        { t: 'Visita protocolar', d: '', e: { g: { rel: 2 } } }
      ]
    },
    {
      id: 'visita_estado', scn: MOD, title: 'Visita de Estado', cd: 14, w: S => (S.m.C > 40 ? 0.03 : 0.01),
      text: 'Un jefe de Estado de una potencia llega a Buenos Aires con una comitiva de empresarios interesados en invertir.',
      choices: [
        { t: 'Firmar acuerdos comerciales y de inversión', d: '', e: { cred: 3, og: 0.05, g: { fin: 2, ind: 2 } } },
        { t: 'Agenda protocolar', d: '', e: { cred: 1 } }
      ]
    },
    {
      id: 'aceiteros', scn: ['ene2002', 'dic2015', 'dic2023'], title: 'Paro de aceiteros: se frenan las exportaciones', cd: 14, w: S => 0.02,
      text: 'El gremio aceitero para las plantas del Gran Rosario y decenas de barcos esperan para cargar. Cada día de paro son millones de dólares que no entran.',
      choices: [
        { t: 'Dictar la conciliación obligatoria', d: '', e: { pc: -3, g: { sn: -2, agro: 3 } } },
        { t: 'Dejar que las partes negocien', d: 'Se pierden dólares.', e: { res: -1, g: { agro: -4, sn: 1 } } }
      ]
    },
    {
      id: 'vaca_muerta', scn: MOD, title: 'Récord de producción en Vaca Muerta', cd: 12, w: S => (lv(S, 'energia') === 1 ? 0.08 : 0.015),
      text: 'La formación neuquina bate récords de producción de petróleo y gas. La balanza energética mejora y llegan más dólares.',
      choices: [{ t: 'Celebrar en Neuquén', d: '', e: { res: 1.5, cred: 1, g: { int: 3, ind: 2, fin: 2 } } }]
    },
    /* ---------------- 2015-2019 ---------------- */
    {
      id: 'tarifas_corte', scn: ['dic2015'], title: 'La Corte frena el aumento del gas', cal: ['2016-08'], when: S => lv(S, 'sub_energia') >= 1,
      text: 'La Corte Suprema anula los aumentos de gas para los usuarios residenciales porque no se hicieron audiencias públicas. El esquema tarifario debe rehacerse.',
      choices: [
        { t: 'Acatar y convocar audiencias públicas', d: 'Respeto institucional, costo fiscal.', e: { pb: -0.25, inst: 3, g: { cm: 3 } } },
        { t: 'Insistir con un nuevo esquema rápido', d: '', e: { conf: 4, inst: -2, g: { cm: -3 } } }
      ]
    },
    {
      id: 'antidespidos', scn: ['dic2015'], title: 'Ley antidespidos', cal: ['2016-05'], when: S => AR.oppStrength(S) > 0.5,
      text: 'El Congreso aprobó una ley de emergencia ocupacional que prohíbe los despidos sin causa por 180 días y duplica las indemnizaciones. Los empresarios piden el veto y la CGT, la promulgación.',
      choices: [
        { t: 'Promulgar la ley', d: '', e: { og: -0.1, cred: -2, g: { sn: 8, ind: -6, pym: -4 } } },
        { t: 'Vetar la ley', d: 'Si la oposición reúne los 2/3, se revierte.', e: { pc: -4, cred: 2, g: { sn: -8, ind: 3 } }, veto: true }
      ]
    },
    {
      id: 'cuadernos', scn: ['dic2015'], title: 'Una causa por coimas en la obra pública', cal: ['2018-08'],
      text: 'Unas anotaciones de un chofer desatan una investigación judicial sobre coimas en la obra pública durante años. Empresarios y ex funcionarios desfilan por los tribunales.',
      choices: [
        { t: 'Respaldar la investigación', d: '', e: { tra: 4, inst: 2, g: { cm: 3, ind: -3 } } },
        { t: 'Pedir prudencia por la economía', d: '', e: { tra: -2, g: { cm: -2, ind: 2 } } }
      ]
    },
    /* ---------------- 2002 ---------------- */
    {
      id: 'trueque', scn: ['ene2002'], title: 'Los clubes del trueque', cal: ['2002-05'],
      text: 'Sin pesos en el bolsillo, millones de argentinos intercambian ropa, comida y servicios en los clubes del trueque, con sus propios "créditos". Es una de las imágenes de la crisis.',
      choices: [
        { t: 'Apoyar y ordenar los clubes', d: '', e: { cult: 1, g: { sp: 3, inf: 3, mov: 2 } } },
        { t: 'No intervenir', d: '', e: {} }
      ]
    },
    /* ---------------- 1989-1991 ---------------- */
    {
      id: 'segunda_hiper', scn: ['jul1989'], title: 'Segundo brote hiperinflacionario', cal: ['1990-02'],
      text: 'La inflación vuelve a dispararse: los precios suben día a día y el dólar se escapa. Es la segunda hiperinflación en menos de un año y el Gobierno tiene que elegir entre un ajuste brutal o esperar.',
      choices: [
        { t: 'Plan de ajuste drástico', d: 'Recorte del gasto y cierre de la emisión: duele, pero corta la espiral.', e: { inf: 6, Ex: 0.75, pb: 0.8, og: -0.5, cred: 3, g: { pu: -5, sn: -4 } } },
        { t: 'Esperar y sostener el gasto', d: 'La espiral sigue.', e: { inf: 30, Ex: 1.25, cred: -6 } }
      ]
    },
    {
      id: 'entel', scn: ['jul1989'], title: 'Privatización de ENTel y Aerolíneas', cal: ['1990-11'], when: S => lv(S, 'privat') >= 1,
      text: 'Se concreta la venta de la empresa telefónica estatal y de Aerolíneas Argentinas. Ingresan dólares y títulos de deuda, pero los gremios denuncian despidos y "remate del patrimonio".',
      choices: [
        { t: 'Concretar las ventas', d: '', e: { res: 1.2, cred: 4, pb: 0.2, g: { sn: -5, fin: 4, ind: 3 } } },
        { t: 'Postergar las ventas', d: '', e: { cred: -3, g: { sn: 2 } } }
      ]
    }
  );
})(typeof window !== 'undefined' ? window : globalThis);
