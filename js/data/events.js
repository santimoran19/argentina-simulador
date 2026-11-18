(function (g) {
  const AR = g.AR = g.AR || {};
  // Efectos admitidos en choices (clave "e"): pc, res, cred, conf, inst, tra, insec, edu, hea, cult, og, inf, fxj, pb, harv, g, rel
  const lv = (S, id) => S.pol[id].cur;
  const A = (S, id) => S.A[id] || 50;
  const win = (S) => S.appr > 45;
  const season = (S, ...ms) => ms.includes(AR.dateOf(S.t).m);

  AR.events = [
    {
      id: 'paro_cgt', title: 'Paro general de la CGT', cd: 6,
      w: S => 0.05 + 0.012 * Math.max(0, S.m.conf - 40) + 0.03 * (lv(S, 'paritarias') >= 2) + 0.03 * (lv(S, 'reforma_lab') > 0),
      text: 'La CGT convoca a un paro general de 24 horas. Transporte, bancos y comercio adhieren. Las centrales sindicales reclaman paritarias libres, defensa del empleo y rechazo a las reformas. El primer paro general contra un gobierno electo fue contra Alfonsín en 1984; desde entonces todos los presidentes tuvieron el suyo.',
      choices: [
        { t: 'Abrir una mesa de diálogo con la CGT', d: 'Cuesta capital político pero baja la tensión.', e: { pc: -4, conf: -8, g: { sn: 4 } } },
        { t: 'Aguantar el paro y descontar el día', d: 'Postura firme: desgasta con los gremios.', e: { conf: 3, og: -0.1, g: { sn: -6, cm: 2 } } },
        { t: 'Judicializar y sancionar a los gremios', d: 'Más conflicto, menos institucionalidad.', e: { pc: -2, conf: 8, inst: -2, g: { sn: -10, cm: 3 } } }
      ]
    },
    {
      id: 'marcha_univ', title: 'Marcha Federal Universitaria', cd: 10,
      w: S => (lv(S, 'universidades') === 1 || lv(S, 'universidades') === 2 || A(S, 'uni') < 35 ? 0.2 : 0.02),
      text: 'Cientos de miles de personas marchan en todo el país en defensa de la universidad pública. Rectores, estudiantes, docentes, científicos, y también muchos que no son universitarios, llenan las plazas. Es un símbolo transversal: la Reforma de 1918 y la gratuidad pesan en la cultura política argentina.',
      choices: [
        { t: 'Recomponer el presupuesto universitario', d: 'Cuesta caja, recupera apoyo.', e: { pb: -0.15, conf: -6, g: { uni: 10, jov: 3, cm: 2 } } },
        { t: 'Sostener el ajuste', d: 'La imagen se desgasta.', e: { conf: 5, g: { uni: -6, cm: -2, jov: -2 } } }
      ]
    },
    {
      id: 'sequia', title: 'Sequía severa', cd: 36,
      w: S => 0.012,
      text: 'La Niña regresa con fuerza y la Pampa Húmeda atraviesa una de las peores sequías en décadas, como la de 2022-23, que costó unos US$20.000 millones. Cae la cosecha de soja y maíz.',
      choices: [
        { t: 'Declarar emergencia agropecuaria con alivio fiscal', d: 'Cuesta caja pero amortigua.', e: { pb: -0.25, harv: -0.2, g: { agro: 6 } } },
        { t: 'No intervenir', d: 'Menos gasto, más daño.', e: { harv: -0.28, g: { agro: -3, int: -2 } } }
      ]
    },
    {
      id: 'cosecha', title: 'Cosecha récord', cd: 30, w: S => 0.02,
      text: 'Las lluvias acompañaron: la campaña gruesa se encamina a un récord. Llegan dólares del campo y mejora la actividad en el interior.',
      choices: [{ t: 'Celebrar la buena noticia', d: 'Más exportaciones y recaudación.', e: { harv: 0.18, g: { agro: 3, int: 2 } } }]
    },
    {
      id: 'corrida', title: 'Corrida cambiaria', cd: 8,
      w: S => (S.m.C < 35 && (S.m.gap > 45 || AR.rs(S) < -8) ? 0.35 : 0.01),
      text: 'Los mercados ponen en duda la sostenibilidad del esquema: el dólar blue se dispara, caen los bonos y el Banco Central pierde reservas. Los ahorristas recuerdan 1989, 2001 y 2019.',
      choices: [
        { t: 'Defender el tipo de cambio con reservas y tasas', d: 'Consume dólares que no sobran.', e: { res: -2.5, cred: 2, og: -0.3, g: { pym: -3 } } },
        { t: 'Dejar correr el dólar', d: 'Devaluación más inflación.', e: { fxj: 22, inf: 2, g: { cm: -3, sp: -3 } } },
        { t: 'Ofrecer un anuncio fiscal creíble', d: 'Cuesta capital político.', e: { pc: -6, cred: 5, fxj: 8 } }
      ]
    },
    {
      id: 'contagio', title: 'Shock financiero internacional', cd: 14, w: S => 0.04,
      text: 'La Reserva Federal sube las tasas y los emergentes sufren una salida de capitales; cae el precio de las materias primas. El riesgo país sube en toda la región.',
      choices: [
        { t: 'Reforzar las señales fiscales', d: 'Contiene el contagio.', e: { pc: -4, cred: -3 } },
        { t: 'Esperar que pase', d: 'El costo lo pagan los mercados.', e: { cred: -8, og: -0.2, fxj: 5 } }
      ]
    },
    {
      id: 'waiver_fmi', title: 'Revisión del FMI', cd: 9,
      w: S => (lv(S, 'fmi') >= 1 ? 0.07 + (S.m.pb < 0 ? 0.08 : 0) : 0),
      text: 'El staff del Fondo llega para revisar las metas fiscales y de acumulación de reservas. Si no se cumplen, deberán dar un waiver o suspender los desembolsos.',
      choices: [
        { t: 'Aceptar condiciones adicionales', d: 'Más ajuste, más credibilidad.', e: { pb: 0.4, cred: 4, g: { sn: -3, pu: -3, fin: 3 } } },
        { t: 'Pedir un waiver por la recesión', d: 'El Fondo cede, con costo político.', e: { pc: -5, cred: -1 } }
      ]
    },
    {
      id: 'escandalo', title: 'Escándalo de corrupción', cd: 8,
      w: S => 0.03 + Math.max(0, 55 - S.m.tra) * 0.003,
      text: S => (S.scn === 'dic2023' || S.scn === 'dic2015' ? 'Una investigación periodística revela audios y documentos que comprometen a funcionarios del gobierno en un caso de sobreprecios. La oposición pide interpelaciones. Argentina tiene una larga historia de escándalos presidenciales, de los cuadernos (2018) a los "Seguros" y "Vacunatorio VIP".' : 'La prensa revela un caso de coimas y sobornos que compromete a funcionarios del gobierno. La oposición pide interpelaciones. Argentina tiene una larga historia: desde el Yomagate (1991) hasta las supuestas coimas en el Senado (2000).'),
      choices: [
        { t: 'Echar a los involucrados y colaborar con la Justicia', d: 'Cuesta capital pero salva la credibilidad.', e: { pc: -6, tra: 3, g: { cm: 3 } } },
        { t: 'Negar y contraatacar', d: 'Se hunde la transparencia.', e: { tra: -6, inst: -2, g: { cm: -6, rel: -4, sp: -2 } } }
      ]
    },
    {
      id: 'inundacion', title: 'Temporal e inundación catastrófica', cd: 18, w: S => 0.025,
      text: 'Un temporal histórico anega una ciudad bonaerense (como el de Bahía Blanca en 2025 o La Plata en 2013). Hay muertos, evacuados y daños millonarios.',
      choices: [
        { t: 'Asistencia federal robusta', d: 'Cuesta caja y gana empatía.', e: { pb: -0.2, g: { sp: 4, int: 3, cm: 2 } } },
        { t: 'Que responda la provincia', d: 'Choque federal.', e: { g: { sp: -4, int: -3, cm: -2 }, rel: { PJ: -3 } } }
      ]
    },
    {
      id: 'copa_america', scn: ['dic2023'], title: 'Copa América', cal: ['2024-07'],
      init: S => { S.ctx.copa = AR.rnd(S) < 0.5; },
      text: S => (S.ctx.copa ? 'La Selección se consagra campeona de la Copa América y el país celebra: la gente sale a las calles. El fútbol funciona como sedante social en un contexto de ajuste.' : 'La Selección cae eliminada antes de lo esperado. El humor social se resiente.'),
      choices: [{ t: 'Continuar', d: '', e: S => (S.ctx.copa ? { g: { jov: 3, sp: 3, cm: 2, sn: 2 }, cult: 2 } : { g: { jov: -1, sp: -1 } }) }]
    },
    {
      id: 'mundial', scn: ['dic2023'], title: 'Mundial 2026', cal: ['2026-06'],
      init: S => { S.ctx.mundial = AR.rnd(S) < 0.28; },
      text: S => (S.ctx.mundial ? '¡Argentina bicampeona del mundo! Millones salen a festejar. El Mundial de 1978 fue manipulado por la dictadura, el de 1986 devolvió orgullo nacional y el de 2022 congregó cinco millones en el Obelisco.' : 'La Selección queda eliminada en el Mundial. La frustración se nota, aunque la agenda económica sigue.'),
      choices: [{ t: 'Continuar', d: '', e: S => (S.ctx.mundial ? { g: { jov: 6, sp: 5, cm: 4, sn: 4, pu: 3, jb: 3 }, cult: 4 } : { g: { jov: -1, sp: -1 } }) }]
    },
    {
      id: 'dia_memoria', scn: ['dic2023', 'dic2015'], title: '24 de marzo: Día de la Memoria', yearly: [2],
      text: 'Se cumple un nuevo aniversario del golpe de 1976. Las organizaciones de derechos humanos convocan a la marcha masiva a Plaza de Mayo. Cada gobierno marca su postura con el discurso y los gestos de ese día.',
      choices: [
        { t: 'Acompañar con un acto oficial', d: '', e: { g: { uni: 5, mov: 5, jov: 2, cm: 1, rel: -1 } } },
        { t: 'Mantener distancia y cuestionar el relato', d: '', e: { conf: 4, g: { uni: -6, mov: -6, cm: 2, rel: 1 } } }
      ]
    },
    {
      id: 'ni_una_menos', scn: ['dic2023', 'dic2015'], title: '3J: Ni Una Menos', yearly: [5],
      text: 'Se convoca a una nueva marcha de Ni Una Menos contra la violencia de género, nacida en 2015. Reclaman fondos para la prevención y la atención.',
      choices: [
        { t: 'Respaldar el reclamo y reforzar programas', d: '', e: { pb: -0.03, g: { jov: 3, uni: 3, mov: 3, rel: -2 } } },
        { t: 'Minimizar la convocatoria', d: '', e: { g: { jov: -3, uni: -3, mov: -3, rel: 1 } } }
      ]
    },
    {
      id: 'crisis_gas', title: 'Ola de frío y falta de gas', cd: 12,
      w: S => (season(S, 5, 6, 7) ? (lv(S, 'energia') === 1 ? 0.04 : 0.14) : 0),
      text: 'Una ola polar dispara la demanda y el sistema se queda sin gas. Faltan buques de GNL y hay que decidir cómo se prioriza el suministro.',
      choices: [
        { t: 'Importar GNL de emergencia', d: 'Cuesta dólares.', e: { res: -1.5, pb: -0.1, g: { cm: 2, ind: 2 } } },
        { t: 'Cortes programados a industrias', d: 'Afecta la actividad.', e: { og: -0.3, g: { ind: -6, pym: -4, cm: 1 } } }
      ]
    },
    {
      id: 'narco', scn: ['dic2023', 'dic2015'], title: 'Violencia narco en Rosario', cd: 12,
      w: S => (S.m.insec > 55 ? 0.12 : 0.03),
      text: 'Ataques a tiros y amenazas en comercios de Rosario: una banda narco desafía al Estado, como en 2023-2024. La opinión pública exige respuestas.',
      choices: [
        { t: 'Plan de intervención federal con fuerzas', d: 'Respuesta contundente.', e: { pc: -4, insec: -3, g: { cm: 4, sp: 2, rel: 2 } } },
        { t: 'Delegar en la provincia', d: 'Parece una deserción.', e: { g: { cm: -3, sp: -2 }, insec: 2 } }
      ]
    },
    {
      id: 'dengue', scn: ['dic2023', 'dic2015'], title: 'Brote de dengue', cd: 24,
      w: S => (season(S, 1, 2, 3) ? 0.1 : 0),
      text: 'El dengue alcanza niveles récord en el norte y el centro del país. Faltan insecticidas y campañas, y se pide una vacunación masiva.',
      choices: [
        { t: 'Campaña nacional de vacunación y fumigación', d: '', e: { pb: -0.1, hea: 2, g: { sp: 3, int: 3, jb: 1 } } },
        { t: 'Recortar la respuesta federal', d: '', e: { hea: -2, g: { sp: -3, int: -3 } } }
      ]
    },
    {
      id: 'veto_jub', title: 'El Congreso aprueba un aumento a los jubilados', cd: 12,
      w: S => (AR.oppStrength(S) > 0.5 && A(S, 'jb') < 55 && lv(S, 'jubilaciones') !== 2 ? 0.2 : 0),
      text: 'La oposición reunió mayorías en ambas cámaras y sancionó una ley de movilidad con recomposición del haber mínimo. El Ejecutivo debe decidir entre promulgar o vetar. Superar un veto requiere los dos tercios en cada cámara.',
      choices: [
        { t: 'Promulgar la ley', d: 'Costo fiscal alto (~1% del PBI).', e: { pb: -0.9, g: { jb: 9, sp: 2 } } },
        { t: 'Vetar la ley', d: 'Si la oposición reúne los 2/3, se revierte.', e: { pc: -4, g: { jb: -9, sp: -3 } }, veto: true }
      ]
    },
    {
      id: 'veto_univ', title: 'Ley de financiamiento universitario', cd: 12,
      w: S => (AR.oppStrength(S) > 0.5 && A(S, 'uni') < 40 ? 0.15 : 0),
      text: 'El Congreso sancionó una ley que actualiza por inflación el presupuesto de las universidades y los salarios docentes. El gobierno dice que desfinancia al Estado.',
      choices: [
        { t: 'Promulgar la ley', d: 'Costo fiscal moderado.', e: { pb: -0.35, g: { uni: 10, jov: 3 } } },
        { t: 'Vetar la ley', d: 'Si la oposición reúne los 2/3, se revierte.', e: { pc: -4, g: { uni: -10, jov: -2 } }, veto: true }
      ]
    },
    {
      id: 'lockout_agro', title: 'Paro agropecuario', cd: 14,
      w: S => (lv(S, 'retenciones') >= 3 && A(S, 'agro') < 40 ? 0.18 : 0),
      text: 'Las entidades de la Mesa de Enlace convocan a un paro y a un "tractorazo". La Resolución 125 en 2008 mostró que un gobierno puede perder el pulso con el campo.',
      choices: [
        { t: 'Reducir retenciones transitoriamente', d: 'Calma al campo, cuesta caja.', e: { pb: -0.3, g: { agro: 8, int: 2 } } },
        { t: 'Sostener y negociar', d: '', e: { conf: 4, g: { agro: -6, int: -2 } } }
      ]
    },
    {
      id: 'cierre_fabricas', title: 'Cierre de plantas industriales', cd: 10,
      w: S => (lv(S, 'aranceles') >= 1 ? 0.12 : 0.02),
      text: 'Fábricas textiles y electrónicas anuncian despidos y cierres por la competencia de importados. Hay marchas de trabajadores en Tierra del Fuego y en el conurbano.',
      choices: [
        { t: 'Salvataje sectorial y protección transitoria', d: 'Cuesta caja.', e: { pb: -0.2, g: { ind: 5, sn: 4, pym: 2 } } },
        { t: 'Que el mercado ajuste', d: '', e: { conf: 4, g: { sn: -4, ind: -3, sp: -2 } } }
      ]
    },
    {
      id: 'megainversion', scn: ['dic2023'], title: 'Anuncio de una megainversión', cd: 8,
      w: S => (lv(S, 'rigi') >= 1 ? 0.1 : 0.015),
      text: 'Una empresa internacional anuncia una inversión de US$3.000 millones en litio, cobre o infraestructura energética. Es la clase de proyecto para la que fue diseñado el RIGI.',
      choices: [{ t: 'Celebrar con un acto', d: '', e: { res: 1.5, cred: 2, g: { ind: 2, fin: 3, int: 2 } } }]
    },
    {
      id: 'calificadoras', scn: ['dic2023', 'dic2015'], title: 'Las calificadoras revisan la nota', cd: 12,
      w: S => (S.m.C > 55 || S.m.C < 25 ? 0.12 : 0),
      text: S => (S.m.C > 55 ? 'Una calificadora de riesgo mejora la nota soberana de la Argentina al reconocer los avances fiscales.' : 'Una calificadora degrada la nota soberana y advierte sobre un nuevo evento de crédito.'),
      choices: [{ t: 'Tomar nota', d: '', e: S => ({ cred: S.m.C > 55 ? 4 : -5, g: { fin: S.m.C > 55 ? 3 : -3 } }) }]
    },
    {
      id: 'fallo_corte', title: 'La Corte Suprema falla contra una medida del Ejecutivo', cd: 10,
      w: S => 0.015 + 0.04 * (S.dnus.length > 0) + 0.04 * (lv(S, 'protesta') > 1),
      text: 'La Corte declara inconstitucional una medida clave del Gobierno. El oficialismo cuestiona el fallo.',
      choices: [
        { t: 'Acatar el fallo', d: 'Fortalece la república.', e: { inst: 3, tra: 1, g: { cm: 2 } } },
        { t: 'Desconocer o dilatar el cumplimiento', d: 'Grave daño institucional.', e: { inst: -8, conf: 8, g: { cm: -4, uni: -4 } } }
      ]
    },
    {
      id: 'represion', scn: ['dic2023'], title: 'Incidentes en la marcha de los miércoles', cd: 10,
      w: S => (lv(S, 'protesta') >= 1 && A(S, 'jb') < 40 ? 0.14 : 0.02),
      text: 'Durante la marcha semanal de jubilados frente al Congreso hay represión: un jubilado herido y un fotógrafo grave. Las imágenes dan la vuelta al mundo.',
      choices: [
        { t: 'Pedir informes y reformar el protocolo', d: '', e: { inst: 1, g: { jb: 3, cm: -1, mov: 2 } } },
        { t: 'Respaldar a las fuerzas de seguridad', d: '', e: { conf: 6, g: { cm: 2, jb: -6, mov: -4, uni: -3 } } }
      ]
    },
    {
      id: 'corralito', title: '¿Un nuevo corralito?', cd: 24,
      w: S => (S.m.C < 15 && AR.rs(S) < -10 && !S.pol.bancos.cur ? 0.3 : 0),
      text: 'Los depósitos en dólares caen a toda velocidad y los bancos cierran las ventanillas por colas. Los fantasmas del 1 de diciembre de 2001 vuelven a la calle.',
      choices: [
        { t: 'Imponer restricciones a los retiros (corralito)', d: 'Detiene la salida pero hunde la confianza.', e: { res: 3, inst: -10, conf: 25, og: -1.2, g: { cm: -12, pym: -8, sp: -3, fin: -6 } } },
        { t: 'Garantizar depósitos con un salvataje internacional', d: 'Pedir plata al FMI y EE.UU.', e: { pc: -8, res: 5, cred: -5, fxj: 15 } }
      ]
    },
    {
      id: 'hiper', title: 'Fantasma de la hiperinflación', cd: 6,
      w: S => (S.m.infM > 28 ? 0.7 : 0),
      text: 'Con la inflación por encima del 28% mensual, circulan versiones de 1989, cuando los precios subieron 196% en un mes. Los sindicatos piden bonos y los comercios remarcan a diario.',
      choices: [
        { t: 'Plan de shock: congelar precios y tarifas por 90 días', d: 'Baja la inflación hoy a costa de distorsiones.', e: { pc: -6, inf: -6, conf: 10, og: -0.4, cred: -5 } },
        { t: 'Tomar medidas fiscales y monetarias fuertes', d: 'Ancla nominal más creíble.', e: { pc: -8, cred: 6, inf: -3, og: -0.6, g: { sn: -3, pu: -3 } } }
      ]
    },
    {
      id: 'fuga_elec', title: 'Fuga de dólares antes de las elecciones', cd: 10,
      w: S => (AR.nearElection(S) && S.appr < 45 ? 0.4 : 0),
      text: 'Con las encuestas desfavorables, los ahorristas compran dólares ante la incertidumbre electoral, como en agosto de 2019 tras las PASO.',
      choices: [
        { t: 'Ofrecer instrumentos de cobertura y tasas más altas', d: 'Cuesta crecimiento.', e: { og: -0.3, res: -1, g: { pym: -2 } } },
        { t: 'Ignorar la volatilidad', d: '', e: { fxj: 8, cred: -4, inf: 1 } }
      ]
    },
    {
      id: 'gobernadores', title: 'Los gobernadores piden fondos', cd: 8,
      w: S => (Math.min(S.rel.PF, S.rel.PROV) < 40 ? 0.18 : 0.03),
      text: 'Los gobernadores se reúnen y reclaman fondos adeudados, la finalización de obras y coparticipación. Sus votos en el Congreso están en juego.',
      choices: [
        { t: 'Girar ATN y reactivar obras', d: 'Cuesta caja, compra voluntades.', e: { pb: -0.2, rel: { PF: 8, PROV: 10, UCR: 4, PJ: 2 } } },
        { t: 'Negarse y marcar la cancha', d: '', e: { rel: { PF: -6, PROV: -8, UCR: -3 }, g: { int: -4 } } }
      ]
    },
    {
      id: 'davos', scn: ['dic2023'], title: 'Foro de Davos', cal: ['2024-01'],
      text: 'El Gobierno es invitado a presentar su programa económico ante los inversores globales en Suiza.',
      choices: [
        { t: 'Presentar un plan pro-mercado ante inversores', d: '', e: { cred: 2, g: { fin: 4, cm: 1, uni: -1 } } },
        { t: 'Enfocar el mensaje en el mercado interno', d: '', e: { g: { sn: 2, sp: 1, fin: -2 } } }
      ]
    },
    {
      id: 'bonaerense', scn: ['dic2023'], title: 'Elecciones en la Provincia de Buenos Aires', cal: ['2025-09'],
      init: S => { S.ctx.pba = S.appr > 44; },
      text: S => (S.ctx.pba ? 'El oficialismo nacional resiste en el distrito electoral más grande del país y los mercados lo festejan.' : 'El oficialismo nacional pierde por varios puntos en el distrito más grande del país. Los mercados reaccionan con nervios y suben el dólar y el riesgo país, adelantando una derrota nacional.'),
      choices: [{ t: 'Continuar', d: '', e: S => (S.ctx.pba ? { cred: 3, g: { fin: 3 } } : { cred: -7, fxj: 6, g: { fin: -4, cm: -2 } }) }]
    },
    {
      id: 'duelo', title: 'Fallece un ícono de la cultura argentina', cd: 24, w: S => 0.012,
      text: 'Muere una figura de la música o del cine que marcó a varias generaciones. El país entero se reúne en el duelo, y por un día baja la grieta.',
      choices: [{ t: 'Decretar duelo nacional', d: '', e: { cult: 2, g: { jov: 1, sp: 1, cm: 1, uni: 1 } } }]
    },
    {
      id: 'repo_enero', scn: ['dic2023', 'dic2015'], title: 'Vencimientos de bonos en dólares', yearly: [0, 6],
      when: S => AR.rs(S) < 5,
      text: 'Se acercan los pagos semestrales de bonos en dólares (enero y julio, cerca de US$4.200 M cada uno). Con las reservas actuales, el Tesoro debe decidir cómo pagarlos.',
      choices: [
        { t: 'Pagar con reservas', d: 'Se deteriora el colchón.', e: {} },
        { t: 'Tomar un repo con bancos internacionales', d: 'Costo financiero y dependencia.', e: { res: 2, cred: -1 } }
      ]
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
