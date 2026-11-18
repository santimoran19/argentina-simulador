(function (g) {
  const AR = g.AR = g.AR || {};
  AR.policies = AR.policies || [];
  AR.cats = {
    mon: 'Monetaria y cambiaria', fis: 'Impuestos y deuda', gas: 'Gasto y previsión', tra: 'Trabajo e ingresos',
    pro: 'Producción y comercio', seg: 'Seguridad y justicia', soc: 'Educación, salud y cultura', ins: 'Instituciones y mundo'
  };
  // L(label, fx, g, pos, extra): un nivel de política. pos = [eco, soc] posición ideológica del nivel.
  AR.L = (label, fx, grp, pos, extra) => Object.assign({ label, fx: fx || {}, g: grp || {}, pos: pos || [0, 0] }, extra || {});
  // P(id, cat, name, desc, hist, init, cost, how, delay, levels, opts)
  AR.P = (id, cat, name, desc, hist, init, cost, how, delay, levels, opts) =>
    AR.policies.push(Object.assign({ id, cat, name, desc, hist, init, cost, how, delay, levels }, opts || {}));
  const L = AR.L, P = AR.P;

  /* ---------------- MONETARIA Y CAMBIARIA ---------------- */
  P('tasa', 'mon', 'Tasa de política monetaria',
    'La tasa de referencia del BCRA. Alta: atrae pesos y frena la demanda de dólares, pero encarece el crédito y paga intereses. Baja: estimula, pero puede alimentar el dólar y la inflación.',
    'En agosto de 2023 el BCRA subió la tasa a 118% tras las PASO y la llevó a 133% en octubre. En diciembre de 2023 la bajó a 100% y luego la redujo hasta ~40% en abril de 2024.',
    5, 3, 'admin', 0, [
      L('30% TNA', { rate: 30 }, { pym: 4, ind: 3, fin: -2 }),
      L('40% TNA', { rate: 40 }, { pym: 3, ind: 2, fin: -1 }),
      L('60% TNA', { rate: 60 }, { pym: 2, ind: 1.5 }),
      L('80% TNA', { rate: 80 }, { pym: 1, ind: 1 }),
      L('100% TNA', { rate: 100 }, { pym: 0.5 }),
      L('133% TNA (vigente)', { rate: 133 }),
      L('160% TNA', { rate: 160 }, { pym: -3, ind: -2, fin: 1 })
    ]);

  P('cambio', 'mon', 'Régimen cambiario',
    'Cómo se fija el dólar oficial. Pasar a banda o flotación unifica el mercado: implica una devaluación inmediata y presión sobre los precios. La dolarización requiere dólares suficientes y es irreversible.',
    'Convertibilidad (1991-2001), flotación sucia (2002-2011), cepo (2011-2015), flotación (2016-2018), crawling peg con cepo (2019-2024), bandas cambiarias desde abril de 2025.',
    0, 6, 'admin', 0, [
      L('Crawling peg 4% mensual', { fxmode: 'crawl', crawl: 4 }, {}, [-0.2]),
      L('Crawling peg 2% mensual', { fxmode: 'crawl', crawl: 2 }, { cm: 1 }, [0]),
      L('Crawling peg 1% mensual', { fxmode: 'crawl', crawl: 1 }, { cm: 1 }, [0.2]),
      L('Banda de flotación', { fxmode: 'band' }, { cm: 2, fin: 3 }, [0.5], { once: { unify: 0.97 } }),
      L('Flotación libre', { fxmode: 'float' }, { cm: 1, fin: 4, ind: -2 }, [0.8], { once: { unify: 1 } }),
      L('Dolarización', { fxmode: 'dollar', cred: 6 }, { cm: 3, fin: 6, jov: 3, sn: -4, ind: -2 }, [1],
        { how: 'ley', lock: true, req: S => (S.m.res >= 15 ? null : 'Inviable: harían falta al menos US$15.000 M de reservas netas para canjear la base monetaria.') })
    ]);

  P('cepo', 'mon', 'Cepo cambiario',
    'Restricciones para comprar dólares y girar divisas. Contiene la salida de reservas, pero crea brecha, desalienta exportar e invertir y frena las importaciones.',
    'Creado en octubre de 2011, levantado en diciembre de 2015, vuelto a imponer el 1 de septiembre de 2019. En abril de 2025 se liberó para personas humanas.',
    2, 5, 'admin', 0, [
      L('Sin cepo', { cepo: 0, impo: 0 }, { cm: 6, agro: 5, fin: 4, jov: 3, ind: 2 }, [1]),
      L('Cepo para empresas, personas liberadas', { cepo: 1, impo: -2 }, { cm: 3, agro: 3, fin: 2, jov: 1.5 }, [0.4]),
      L('Cepo total (vigente)', { cepo: 2, impo: -6 }, {}, [-0.6])
    ]);

  P('emit', 'mon', 'Asistencia del BCRA al Tesoro',
    'Cuánto del déficit se financia con emisión monetaria. Es la fuente clásica de inflación argentina.',
    'La Carta Orgánica del BCRA fue modificada varias veces; entre 2020 y 2023 la emisión para el Tesoro rondó el 3,5% del PBI anual. Desde 2024 el Tesoro no recibe adelantos del BCRA.',
    2, 4, 'ley', 2, [
      L('Prohibida por ley', { emit: 0, cred: 5 }, {}, [0.9]),
      L('Adelantos transitorios con tope', { emit: 0.35, cred: 2 }, {}, [0.3]),
      L('Sin límite (vigente)', { emit: 0.9 }, {}, [-0.5])
    ]);

  P('overhang', 'mon', 'Pasivos remunerados del BCRA',
    'Stock de LELIQ y pases pasivos con los que el BCRA absorbe pesos. Pagan intereses emitiendo, lo que realimenta la base monetaria.',
    'Las LELIQ se crearon en 2018; en 2023 los pasivos remunerados superaron 10 puntos del PBI. En diciembre de 2023 se reemplazaron por pases pasivos y luego se transfirieron deuda al Tesoro.',
    2, 4, 'admin', 1, [
      L('Cancelación gradual y saneamiento del balance', { ov: 2, cred: 3 }, { fin: 3 }, [0.6], { once: { cred: 2 } }),
      L('Transferir pasivos al Tesoro (Letras Intransferibles)', { ov: 5, cred: 1 }, { fin: 2 }, [0.3]),
      L('Stock actual de LELIQ y pases (vigente)', { ov: 9 }, {}, [-0.2])
    ]);

  P('credito', 'mon', 'Sistema financiero y crédito',
    'Nivel de regulación sobre tasas, encajes y crédito dirigido.',
    'Durante 2020-2023 rigieron topes de tasas y líneas dirigidas. La inflación baja vuelve rentable el crédito hipotecario ajustable por UVA (lanzado en 2016).',
    0, 4, 'admin', 1, [
      L('Crédito dirigido y tasas reguladas (vigente)'),
      L('Liberalización con menores encajes', { og: 0.4 }, { pym: 3, cm: 2, fin: 3 }, [0.6]),
      L('Banca libre y crédito hipotecario UVA', { og: 0.7 }, { cm: 4, jov: 2, fin: 3, pym: 3 }, [0.9])
    ]);

  P('deuda', 'mon', 'Estrategia de deuda soberana',
    'Cómo se enfrenta la deuda pública. Reestructurar da alivio pero cierra los mercados; pagar todo ahoga el presupuesto.',
    'Default 2001, canje 2005 y 2010, litigio holdouts 2014-2016, reperfilamiento 2019 y reestructuración 2020 (99% de adhesión).',
    0, 6, 'ley', 3, [
      L('Pagar en tiempo y forma (vigente)'),
      L('Canje voluntario y reperfilamiento', { fisc: 0.3, cred: -1 }, { fin: -3 }, [0], { once: { cred: -3 } }),
      L('Reestructuración unilateral (default selectivo)', { fisc: 1.0, cred: -12 }, { fin: -15, cm: -3, sn: 2, mov: 3 }, [-0.8], { once: { cred: -10, conf: 5 } })
    ]);

  P('fmi', 'mon', 'Relación con el FMI',
    'Argentina es el mayor deudor del Fondo. Un nuevo programa trae dólares y credibilidad a cambio de metas fiscales y de reservas.',
    'Stand-By de US$57.000 M en 2018; Facilidades Extendidas por US$44.000 M en 2022; nuevo acuerdo por US$20.000 M en abril de 2025.',
    1, 5, 'ley', 2, [
      L('Ruptura con el FMI (cesación de pagos con el Fondo)', { cred: -15 }, { fin: -10, cm: -3, sn: 3, mov: 4 }, [-0.9], { once: { cred: -8, conf: 5 } }),
      L('Programa 2022 con waivers (vigente)'),
      L('Nuevo programa con desembolso y metas de reservas', { cred: 5 }, { fin: 5, cm: 2, sn: -3, mov: -3 }, [0.6], { once: { res: 12, cred: 4 }, dnu: true })
    ], { dnu: true });

  P('blanqueo', 'mon', 'Blanqueo de capitales',
    'Régimen para regularizar dólares no declarados ("colchón"). Atrae depósitos y reservas, pero premia a quien evadió.',
    'Hubo blanqueos en 2016 (Ley 27.260) y en 2024 (Ley 27.743, que captó cerca de US$20.000 M).',
    0, 3, 'ley', 2, [
      L('Sin blanqueo (vigente)'),
      L('Régimen amplio de regularización de activos', { cred: 1 }, { fin: 3, cm: 2, sp: -2, uni: -2 }, [0.5], { once: { res: 3, tra: -3 } })
    ]);

  /* ---------------- IMPUESTOS ---------------- */
  P('iva', 'fis', 'IVA',
    'Impuesto al valor agregado, la mayor fuente de recaudación. Rebajarlo abarata el consumo pero resta caja.',
    'Alícuota general del 21% desde 1995 (antes 18%). Es regresivo en términos de ingreso, pero difícil de evadir.',
    2, 4, 'ley', 3, [
      L('17%', { fisc: -1.3 }, { cm: 5, sp: 4, pym: 4, inf: 3, jb: 2 }, [0.6]),
      L('19%', { fisc: -0.65 }, { cm: 2.5, sp: 2, pym: 2, inf: 1.5, jb: 1 }, [0.3]),
      L('21% (vigente)'),
      L('23%', { fisc: 0.65 }, { cm: -3, sp: -3, pym: -3, inf: -2, jb: -2 }, [-0.3])
    ]);

  P('ganancias', 'fis', 'Impuesto a las Ganancias (4ta categoría)',
    'Impuesto sobre salarios y honorarios altos. Cada cambio afecta a clase media y a empleados sindicalizados.',
    'En 2023 una ley (27.725) eximió a casi todos los asalariados. En 2024, la Ley 27.743 volvió a incluirlos con un mínimo no imponible alto.',
    0, 5, 'ley', 3, [
      L('Eximido para la gran mayoría (vigente)'),
      L('Mínimo no imponible alto restablecido', { fisc: 0.35 }, { sn: -4, cm: -3, pu: -3 }, [0.2]),
      L('Esquema histórico (más contribuyentes)', { fisc: 0.7 }, { sn: -8, cm: -6, pu: -6 }, [-0.1])
    ]);

  P('retenciones', 'fis', 'Derechos de exportación al agro (soja)',
    'Las "retenciones" aportan caja y abaratan los alimentos locales, pero desalientan la producción y exportación del campo.',
    'La Resolución 125 (2008) intentó retenciones móviles y desató el mayor conflicto con el campo. Macri las eliminó en 2015 y repuso un tributo en 2018. En 2025 se redujeron de manera transitoria y luego permanente.',
    3, 5, 'admin', 1, [
      L('0%', { fisc: -1.5, expo: 12 }, { agro: 14, int: 3, fin: 1 }, [1]),
      L('12%', { fisc: -1.0, expo: 8 }, { agro: 9, int: 2 }, [0.8]),
      L('26%', { fisc: -0.4, expo: 3 }, { agro: 3, int: 1 }, [0.3]),
      L('33% (vigente)'),
      L('40%', { fisc: 0.4, expo: -5 }, { agro: -6, int: -1 }, [-0.5])
    ]);

  P('ret_ind', 'fis', 'Derechos de exportación industriales y regionales',
    'Impuestos a exportaciones de manufacturas y economías regionales. Eliminarlos mejora la competitividad.',
    'Se aplicaron con la devaluación de 2002 y se eliminaron para muchas economías regionales en 2024-2025.',
    1, 3, 'admin', 1, [
      L('Eliminados', { fisc: -0.25, expo: 3 }, { ind: 3, int: 3, pym: 1 }, [0.8]),
      L('Parciales (vigente)'),
      L('Ampliados', { fisc: 0.15, expo: -2 }, { ind: -3, int: -3 }, [-0.4])
    ]);

  P('bienes', 'fis', 'Bienes Personales',
    'Impuesto al patrimonio. Su eliminación es una bandera liberal; su refuerzo, una demanda de equidad.',
    'Creado en 1991; el "aporte solidario y extraordinario" de 2020 grabó grandes fortunas por única vez.',
    2, 3, 'ley', 3, [
      L('Eliminado', { fisc: -0.25 }, { cm: 2, fin: 3, ind: 2, sp: -1 }, [1]),
      L('Alícuotas reducidas', { fisc: -0.12 }, { cm: 1, fin: 1.5, ind: 1 }, [0.5]),
      L('Vigente'),
      L('Aporte extraordinario sobre grandes fortunas', { fisc: 0.3 }, { cm: -3, fin: -6, ind: -4, sp: 2, sn: 2 }, [-0.8])
    ]);

  P('estructura', 'fis', 'Estructura del Estado',
    'Reducción de ministerios, organismos y planta de personal.',
    'En 2024 se pasó de 18 a 9 ministerios y se disolvieron o fusionaron decenas de organismos. Antecedentes: Reforma del Estado de 1989-1990.',
    0, 6, 'ley', 2, [
      L('Estructura actual (vigente)'),
      L('Fusión de ministerios y reducción de planta', { fisc: 0.5, cred: 2 }, { pu: -10, fin: 2, cm: 2 }, [0.6], { once: { conf: 3 } }),
      L('"Motosierra": cierre masivo de organismos y despidos', { fisc: 1.3, cred: 4 }, { pu: -22, sn: -3, fin: 4, cm: 3, jov: 1 }, [1], { once: { conf: 8 } })
    ], { dnu: true });

  P('privat', 'fis', 'Privatizaciones',
    'Venta o concesión de empresas públicas: aportan caja y bajan déficit, pero generan conflicto y dudas de soberanía.',
    'En los 90 se privatizaron YPF, telefonía, gas, electricidad, trenes y ferrocarriles. Entre 2003 y 2012 hubo reestatizaciones (Aguas, Correo, Aerolíneas, YPF).',
    0, 5, 'ley', 3, [
      L('Sin privatizaciones (vigente)'),
      L('Empresas deficitarias (trenes, agua, correo)', { fisc: 0.15 }, { sn: -3, pu: -2, fin: 3, ind: 2 }, [0.7], { once: { res: 1.5 } }),
      L('Privatización amplia (incluye Aerolíneas, ENARSA, otras)', { fisc: 0.4, cred: 2 }, { sn: -8, pu: -6, fin: 6, ind: 4, uni: -4, mov: -3 }, [1], { once: { res: 4, conf: 5 } })
    ]);

  /* ---------------- GASTO Y PREVISION ---------------- */
  P('jubilaciones', 'gas', 'Movilidad jubilatoria',
    'Cómo se actualizan las jubilaciones. El haber real determina el gasto y la aprobación de un grupo electoral enorme.',
    'Fórmulas: 2017 (inflación + salarios), suspendida en 2019; 2020 (Ley 27.609, mitad inflación y mitad salarios); decreto 274/2024 (inflación mensual). El bono de $70.000 quedó congelado y perdió valor.',
    0, 5, 'ley', 2, [
      L('Ley 27.609 (trimestral, inflación y salarios; vigente)', { kPen: 0.95, lag: 2, extra: 0 }, {}, [-0.3]),
      L('Inflación mensual rezagada y bono congelado', { kPen: 1.0, lag: 2, extra: -0.35 }, { jb: -3 }, [0.5]),
      L('Recomposición extraordinaria + inflación', { kPen: 1.0, lag: 1, extra: 0 }, { jb: 4, sp: 1 }, [-0.7], { once: { rPen: 12 } }),
      L('Congelamiento nominal (sólo emergencias)', { kPen: 0.3, lag: 3, extra: 0 }, { jb: -8, sp: -2 }, [1])
    ], { dnu: true });

  P('moratoria', 'gas', 'Moratoria previsional',
    'Permite jubilarse sin haber completado aportes (en su mayoría mujeres). Incluyó a 3 de cada 4 nuevos jubilados.',
    'Las moratorias de 2005, 2014 y 2022 explicaron la cobertura previsional de ~90%, una de las más altas de la región.',
    0, 4, 'ley', 3, [
      L('Moratoria vigente'),
      L('Cierre de la moratoria (jubilación proporcional por edad)', { fisc: 0.25 }, { jb: -3, sp: -3, sn: -1 }, [0.7])
    ]);

  P('regimenes', 'gas', 'Reforma previsional',
    'Reforma de edad, cálculo del haber y regímenes especiales. Una reforma del sistema ahorra a largo plazo, pero tiene costo político inmediato.',
    'Reforma de 2017 (Macri) fue repudiada en la calle. Las AFJP (1994-2008) fueron estatizadas por la Ley 26.425. En 2024 se discutió volver a un sistema mixto.',
    0, 8, 'ley', 4, [
      L('Sistema de reparto (vigente)'),
      L('Reforma paramétrica (edad, fórmula, regímenes especiales)', { fisc: 0.5, cred: 3 }, { jb: -6, sn: -5, pu: -4, fin: 3 }, [0.6]),
      L('Sistema mixto con capitalización (vuelta de las AFJP)', { fisc: -0.4, cred: 3 }, { fin: 7, jb: -3, sn: -6, uni: -3 }, [1])
    ], { dnu: false });

  P('paritarias_pub', 'gas', 'Salarios del sector público',
    'Paritaria estatal: es la variable de ajuste más usada del gasto.',
    'Entre 2015 y 2019 los salarios públicos cayeron ~15% reales; también cayeron en 2024. Los estatales nacionales son unos 300.000, los provinciales más de 2 millones.',
    0, 3, 'admin', 0, [
      L('Paritarias indexadas (vigente)', { kPw: 0.95 }, {}, [-0.3]),
      L('Aumentos por debajo de la inflación', { kPw: 0.65 }, { pu: -6, sn: -1 }, [0.4]),
      L('Congelamiento y retiros voluntarios', { kPw: 0.25 }, { pu: -14, sn: -2 }, [0.9], { once: { conf: 4 } })
    ]);

  P('asistencia', 'gas', 'Asistencia social',
    'AUH, Tarjeta Alimentar, Potenciar Trabajo y otros programas. Sostienen el piso de ingresos, con costo fiscal y discusión sobre intermediarios.',
    'La AUH nació en 2009 por decreto. Potenciar Trabajo (2020) reemplazó a Hacemos Futuro. En 2024 se duplicó la AUH y la Tarjeta Alimentar mientras se auditaban planes.',
    0, 4, 'admin', 1, [
      L('Programas indexados (vigente)', { kSoc: 1.0 }),
      L('Refuerzo de AUH y Tarjeta Alimentar con auditoría', { kSoc: 1.0 }, { sp: 4, mov: -4, jb: 0 }, [-0.1], { once: { rSoc: 35 } }),
      L('Recorte de planes y control de intermediarios', { kSoc: 0.55 }, { mov: -12, sp: -4, cm: 1 }, [0.7], { once: { rSoc: -10, conf: 4 } }),
      L('Ingreso ciudadano universal', { kSoc: 1.0, cred: -3 }, { sp: 9, mov: 6, cm: -3, fin: -4, jov: 3 }, [-0.9], { once: { rSoc: 60 } })
    ]);

  P('sub_energia', 'gas', 'Subsidios energéticos',
    'Tarifas de luz y gas. Quitarlos mejora las cuentas pero impacta fuerte en hogares y empresas.',
    'Las tarifas se congelaron a partir de 2019. En 2022 comenzó la segmentación por ingresos (N1, N2, N3). En 2024 se redujeron los subsidios y las tarifas subieron varias veces por encima de la inflación.',
    0, 5, 'admin', 1, [
      L('Subsidios generalizados (vigente)'),
      L('Segmentación por ingresos', { fisc: 0.9 }, { cm: -4, sp: -3, jb: -3, sn: -2 }, [0.4], { once: { inf: 1.8 } }),
      L('Quita total (tarifas plenas)', { fisc: 1.6 }, { cm: -8, sp: -8, jb: -6, pym: -6, ind: -3, int: -4 }, [0.9], { once: { inf: 3.0, conf: 4 } }),
      L('Tarifa social ampliada y congelamiento', { fisc: -0.5, cred: -2 }, { sp: 5, cm: 3, jb: 3, pym: 3 }, [-0.8])
    ]);

  P('sub_transp', 'gas', 'Subsidios al transporte',
    'Boleto de colectivos y trenes en el AMBA y el interior.',
    'En 2023 el boleto en el AMBA era de los más bajos del mundo en dólares. Las provincias recibieron un fondo compensador que se eliminó en 2024.',
    0, 4, 'admin', 1, [
      L('Tarifas congeladas (vigente)'),
      L('Actualización gradual', { fisc: 0.4 }, { sp: -2, cm: -2, jov: -1 }, [0.3], { once: { inf: 0.7 } }),
      L('Sin subsidios', { fisc: 0.7 }, { sp: -5, cm: -4, jov: -2, int: -3 }, [0.8], { once: { inf: 1.2, conf: 3 } })
    ]);

  P('obras', 'gas', 'Obra pública',
    'Rutas, vivienda, agua y energía. Motor de empleo local y de las provincias; primera víctima de los ajustes.',
    'Entre 2003 y 2015 la inversión pública fue una política de Estado; en 2024 se paralizó prácticamente toda. Las concesiones privadas (PPP) son una alternativa ensayada en 2018.',
    0, 4, 'admin', 1, [
      L('Plan de obras vigente'),
      L('Paralización de la obra pública', { fisc: 0.9, og: -0.4 }, { int: -9, ind: -3, pym: -2, sn: -2, sp: -2 }, [0.8], { once: { conf: 3 } }),
      L('Obras por concesión (PPP y capitales privados)', { fisc: 0.5, og: -0.1 }, { int: -4, ind: 2, fin: 2 }, [0.5])
    ]);

  P('transferencias', 'gas', 'Transferencias a provincias',
    'Fondos discrecionales y obras que financian a los gobernadores. Alimentan la gobernabilidad.',
    'Los ATN y fondos fiduciarios son discrecionales. Desde 2024 se cortó la mayoría de las transferencias no automáticas, y varios gobernadores exigieron compensaciones.',
    0, 4, 'admin', 0, [
      L('Transferencias discrecionales fluidas (vigente)', { kProv: 1.0 }, {}, [-0.2]),
      L('Ajustadas por debajo de la inflación', { kProv: 0.55 }, { int: -4, pu: -2 }, [0.4], { rel: { PROV: -6, PF: -4, UCR: -3, PJ: -3 } }),
      L('Corte de transferencias discrecionales', { kProv: 0.1 }, { int: -8, pu: -3 }, [0.9], { rel: { PROV: -14, PF: -10, UCR: -8, PJ: -8 } })
    ]);
})(typeof window !== 'undefined' ? window : globalThis);
