(function (g) {
  const AR = g.AR = g.AR || {};
  const L = AR.L, P = AR.P;

  /* ---------------- IMPUESTOS Y DEUDA ---------------- */
  P('coparticipacion', 'fis', 'Coparticipación federal',
    'Cómo se reparten los impuestos nacionales con las provincias. Es la madre de todas las negociaciones con los gobernadores.',
    'La ley convenio 23.548 (1988) nació como "transitoria". La Constitución de 1994 ordenó dictar un nuevo régimen antes de 1996, algo que nunca ocurrió.',
    0, 7, 'ley', 4, [
      L('Régimen vigente (Ley 23.548 de 1988)'),
      L('Nuevo pacto fiscal con las provincias', { fisc: 0.2, inst: 2 }, { int: 4 }, [0.1], { rel: { PROV: 8, PF: 6, UCR: 3 } }),
      L('Recentralizar recursos en la Nación', { fisc: 0.6 }, { int: -8, pu: -3 }, [0.2], { rel: { PROV: -12, PF: -10, UCR: -6, PJ: -4 }, once: { conf: 4 } })
    ]);

  P('monotributo', 'fis', 'Monotributo',
    'Régimen simplificado para cuentapropistas y pequeños comercios. Facilita la formalidad, pero recauda poco.',
    'Creado en 1998 (Ley 24.977). Hoy lo usan millones de trabajadores independientes, desde plomeros hasta programadores.',
    0, 3, 'ley', 2, [
      L('Monotributo vigente'),
      L('Ampliación y simplificación', { fisc: -0.15, unemp: -0.2 }, { inf: 5, pym: 3, jov: 1 }, [0.5]),
      L('Endurecimiento y recategorización de oficio', { fisc: 0.2 }, { inf: -6, pym: -4 }, [-0.3])
    ]);

  P('evasion', 'fis', 'Control de la evasión',
    'Fiscalización, cruce de datos y amnistías. Recaudar sin subir impuestos o perdonar para que vuelvan a la formalidad.',
    'La evasión del IVA se estima en una porción muy alta de lo que se debería recaudar. En 2024 la AFIP (creada en 1997) fue reemplazada por ARCA.',
    0, 4, 'admin', 2, [
      L('Fiscalización actual'),
      L('Modernización de la agencia recaudadora y cruce de datos', { fisc: 0.3, transp: 3 }, { pym: -2, fin: -1, cm: -1 }, [-0.2]),
      L('Amnistía fiscal amplia', { fisc: -0.1, transp: -4, cred: 1 }, { pym: 4, cm: 2, fin: 3 }, [0.6])
    ]);

  /* ---------------- GASTO Y PREVISION ---------------- */
  P('pami', 'gas', 'PAMI y medicamentos',
    'La obra social de los jubilados. La cobertura de medicamentos pesa en el bolsillo y en el humor de los mayores.',
    'El PAMI se creó en 1971 y es la mayor obra social de América Latina, con unos cinco millones de afiliados.',
    0, 4, 'admin', 1, [
      L('Cobertura actual'),
      L('Medicamentos gratuitos ampliados', { fisc: -0.25, hea: 2 }, { jb: 7, sp: 1 }, [-0.6]),
      L('Recorte de la cobertura gratuita', { fisc: 0.15, hea: -2 }, { jb: -7, sp: -1 }, [0.6], { once: { conf: 3 } })
    ]);

  /* ---------------- TRABAJO E INGRESOS ---------------- */
  P('jornada', 'tra', 'Jornada laboral',
    'Cuántas horas se trabaja por semana. Menos horas reparten empleo y tiempo libre, pero suben los costos de las empresas.',
    'La Ley 11.544 de 1929 fijó la jornada de 8 horas diarias y 48 semanales. Varios proyectos proponen bajarla a 40 horas.',
    0, 5, 'ley', 3, [
      L('Jornada de 48 horas semanales (Ley 11.544)'),
      L('Reducción a 40 horas semanales', { og: -0.25, unemp: -0.3, infl: 0.1 }, { sn: 8, jov: 3, pym: -6, ind: -5 }, [-0.7]),
      L('Banco de horas y jornada flexible', { og: 0.15 }, { sn: -6, pym: 4, ind: 4 }, [0.6], { once: { conf: 3 } })
    ]);

  P('plataformas', 'tra', 'Trabajo en plataformas',
    'Repartidores y choferes de aplicaciones: ¿empleados o independientes?',
    'Las aplicaciones de reparto y transporte crecieron explosivamente desde 2018 y se debaten varios proyectos de estatuto propio.',
    0, 3, 'ley', 2, [
      L('Sin régimen específico'),
      L('Estatuto con aportes y seguro', { unemp: 0.1, fisc: 0.05 }, { jov: 3, inf: 4, sn: 2, pym: -1 }, [-0.4]),
      L('Monotributo de plataformas sin relación laboral', {}, { jov: 2, fin: 1, sn: -2 }, [0.6])
    ]);

  /* ---------------- PRODUCCION Y COMERCIO ---------------- */
  P('turismo', 'pro', 'Promoción turística',
    'Incentivos al turismo interno: mueve las economías regionales y el empleo en temporada.',
    'El programa PreViaje (2020-2023) reintegraba la mitad del gasto en viajes dentro del país.',
    0, 3, 'admin', 1, [
      L('Promoción estándar'),
      L('Reintegros al turismo interno', { fisc: -0.15, og: 0.15 }, { cm: 3, pym: 4, int: 4 }, [-0.4]),
      L('Cierre de los organismos de promoción', { fisc: 0.03 }, { int: -2, pym: -2 }, [0.6])
    ]);

  P('tdf', 'pro', 'Régimen de Tierra del Fuego',
    'Beneficios impositivos para la industria electrónica fueguina. Empleo en el sur contra productos más caros en todo el país.',
    'La Ley 19.640 de 1972 creó el régimen para poblar el extremo sur. Allí se ensamblan la mayoría de los celulares y televisores del país.',
    0, 4, 'ley', 3, [
      L('Régimen de promoción vigente (Ley 19.640)'),
      L('Eliminación gradual del régimen', { fisc: 0.2, cred: 1, infl: -0.05 }, { ind: -4, sn: -4, cm: 1 }, [0.7], { rel: { PROV: -4 } }),
      L('Ampliación a nuevos sectores', { fisc: -0.1 }, { ind: 3, sn: 3 }, [-0.5])
    ]);

  P('conocimiento', 'pro', 'Economía del conocimiento',
    'Software, servicios profesionales y biotecnología: el sector que exporta talento y trae dólares.',
    'La Ley de Software (2004) y la de Economía del Conocimiento (2019-2020) dieron beneficios al sector. Argentina tiene varias empresas tecnológicas valuadas en más de mil millones de dólares.',
    0, 3, 'ley', 2, [
      L('Beneficios vigentes'),
      L('Ampliación de beneficios y exportación de servicios', { fisc: -0.08, expo: 2, fdi: 0.1 }, { jov: 4, uni: 3, ind: 2 }, [0.3]),
      L('Eliminación de los beneficios', { fisc: 0.06, expo: -1 }, { jov: -3, uni: -2 }, [0.4])
    ]);

  P('hidrovia', 'pro', 'Hidrovía Paraná-Paraguay',
    'La vía navegable por donde sale cerca del 80% de las exportaciones agroindustriales.',
    'Fue concesionada en 1995. Desde 2021 la administra el Estado de manera provisoria y luego se lanzó una nueva licitación internacional.',
    0, 4, 'admin', 3, [
      L('Administración estatal provisoria'),
      L('Licitación internacional con dragado profundo', { expo: 2, fdi: 0.1, cred: 1 }, { agro: 4, ind: 2 }, [0.6]),
      L('Gestión estatal plena con peaje', { fisc: 0.05 }, { sn: 2, agro: -2 }, [-0.6])
    ]);

  /* ---------------- SEGURIDAD Y JUSTICIA ---------------- */
  P('armas', 'seg', 'Control de armas',
    'Tenencia, portación y registro de armas de fuego.',
    'Desde 2007 existe un programa de entrega voluntaria de armas. El debate sobre la legítima defensa reaparece con cada caso policial.',
    0, 4, 'admin', 1, [
      L('Registro y control actual'),
      L('Flexibilización de la tenencia y portación', { insec: -1, conf: 2 }, { cm: 2, rel: 1, uni: -3, mov: -2 }, [0.3, 0.8]),
      L('Desarme voluntario y control estricto', { insec: -2, fisc: -0.03 }, { uni: 2, cm: 1 }, [-0.2, -0.5])
    ]);

  P('carceles', 'seg', 'Sistema penitenciario',
    'Cárceles superpobladas: más plazas, más castigo o más reinserción.',
    'Las cárceles federales y bonaerenses funcionan muy por encima de su capacidad, con presos alojados en comisarías.',
    0, 4, 'admin', 3, [
      L('Sistema actual (sobrepoblación)'),
      L('Nuevas cárceles y penas más duras', { fisc: -0.12, insec: -3 }, { cm: 3, rel: 1, mov: -2 }, [0.2, 0.7]),
      L('Reinserción: trabajo y educación en las cárceles', { fisc: -0.08, insec: -2 }, { uni: 2, rel: 2 }, [-0.2, -0.4])
    ]);

  P('migracion', 'seg', 'Política migratoria',
    'Requisitos de residencia, acceso a la salud y la educación para extranjeros, y expulsiones.',
    'La Ley 25.871 (2004) reconoce la migración como un derecho humano. En 2025 un decreto endureció requisitos y habilitó cobrar servicios a no residentes.',
    0, 4, 'admin', 1, [
      L('Ley de Migraciones vigente'),
      L('Endurecimiento: cobro de servicios a no residentes y expulsiones', { fisc: 0.05, conf: 2 }, { cm: 3, sp: 1, rel: -2, mov: -4, uni: -4 }, [0.3, 0.8]),
      L('Regularización e integración de migrantes', { fisc: -0.03 }, { mov: 3, uni: 2, cm: -2 }, [-0.2, -0.6])
    ]);

  /* ---------------- INSTITUCIONES ---------------- */
  P('inteligencia', 'ins', 'Servicios de inteligencia',
    'Control, fondos reservados y alcance de los espías del Estado.',
    'La SIDE fue disuelta en 2015 y reemplazada por la AFI; en 2024 volvió a llamarse SIDE. Las escuchas ilegales son un tema recurrente.',
    0, 4, 'admin', 2, [
      L('Estructura actual'),
      L('Control parlamentario y menos fondos reservados', { inst: 4, transp: 3, fisc: 0.02 }, { cm: 2, uni: 2 }, [0, -0.3]),
      L('Más fondos reservados y vigilancia', { inst: -4, transp: -4, insec: -1 }, { uni: -4, cm: -2 }, [0.2, 0.6])
    ]);

  P('acceso_info', 'ins', 'Acceso a la información pública',
    'El derecho de cualquier ciudadano a pedir datos al Estado.',
    'La Ley 27.275 (2016) creó una agencia de acceso a la información. En 2024 un decreto amplió las excepciones para negar pedidos.',
    1, 3, 'ley', 2, [
      L('Sin ley específica'),
      L('Ley de Acceso a la Información Pública', { transp: 5, inst: 2 }, { cm: 2, uni: 1 }, [0, -0.2]),
      L('Restricción del acceso por decreto', { transp: -5 }, { cm: -2, uni: -2 }, [0.2, 0.3], { how: 'admin' })
    ]);

  /* ---------------- SOCIAL ---------------- */
  P('comedores', 'soc', 'Comedores comunitarios',
    'Cómo llega la comida a los barrios: por organizaciones sociales o directamente del Estado.',
    'Después de 2001 los comedores populares se multiplicaron en todo el país. En 2024 la distribución de alimentos terminó en una disputa judicial.',
    0, 3, 'admin', 1, [
      L('Asistencia alimentaria a través de organizaciones'),
      L('Entrega directa con auditoría, sin intermediarios', { transp: 2 }, { mov: -6, sp: 1, cm: 2 }, [0.6]),
      L('Refuerzo alimentario de emergencia', { fisc: -0.1 }, { sp: 4, mov: 4, rel: 2 }, [-0.6])
    ]);

  // etiquetas neutras para épocas anteriores a cada ley
  Object.assign(AR.neutral || (AR.neutral = {}), {
    conocimiento: { 0: 'Sin régimen de promoción específico' }, migracion: { 0: 'Régimen migratorio vigente' },
    acceso_info: { 1: 'Ley de acceso a la información pública' }, jornada: { 0: 'Jornada de 48 horas semanales' }
  });
})(typeof window !== 'undefined' ? window : globalThis);
