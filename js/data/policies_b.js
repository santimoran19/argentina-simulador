(function (g) {
  const AR = g.AR = g.AR || {};
  const L = AR.L, P = AR.P;

  /* ---------------- TRABAJO E INGRESOS ---------------- */
  P('paritarias', 'tra', 'Paritarias privadas',
    'Cómo se negocian los salarios formales. La indexación protege el salario real pero realimenta la inflación.',
    'Entre 2020 y 2023 muchas paritarias ajustaban mes a mes ("cláusula gatillo"). En 2024 el gobierno limitó la homologación de convenios que superaran su pauta.',
    0, 4, 'admin', 0, [
      L('Libres con cláusulas de ajuste (vigente)', { kW: 0.97 }, {}, [-0.4]),
      L('Libres, sin indexación formal', { kW: 0.85 }, { sn: -3 }, [0.2]),
      L('Pauta oficial a la inflación esperada', { kW: 0.68 }, { sn: -6, pu: -2 }, [0.6], { once: { conf: 3 } }),
      L('Tope duro (sin homologación)', { kW: 0.45 }, { sn: -12, pu: -3 }, [1], { once: { conf: 8 } })
    ]);

  P('salario_min', 'tra', 'Salario mínimo',
    'El Consejo del Salario fija el SMVM, que sirve de referencia para informales, planes y jubilados.',
    'El SMVM equivalía a unos US$600 en 2011 y cayó por debajo de US$250 en 2023-2024.',
    0, 3, 'admin', 0, [
      L('Actualización por inflación (vigente)', { kMin: 1.0 }, {}, [-0.4]),
      L('Rezagado respecto de la inflación', { kMin: 0.8 }, { sp: -2, inf: -2, sn: -2 }, [0.3]),
      L('Congelado', { kMin: 0.55 }, { sp: -5, inf: -5, sn: -4 }, [0.8])
    ]);

  P('reforma_lab', 'tra', 'Reforma laboral',
    'Cambios en indemnizaciones, convenios y período de prueba. Prometen empleo formal; los sindicatos los resisten.',
    'La Ley Banelco (2000) cayó en un escándalo; la reforma de 2017 se frenó tras la marcha de diciembre. En 2024 el DNU 70/23 y la Ley 27.742 incluyeron cambios laborales, con litigios judiciales.',
    0, 8, 'ley', 3, [
      L('Ley de Contrato de Trabajo vigente'),
      L('Modernización laboral (fondo de cese, convenios por empresa)', { og: 0.35, unemp: -0.4 }, { sn: -12, pym: 6, ind: 6, jov: 2, inf: 0 }, [0.6, 0.2], { once: { conf: 6 } }),
      L('Desregulación total del mercado laboral', { og: 0.6, unemp: -0.7 }, { sn: -24, pym: 9, ind: 10, jov: 4, sp: -4, mov: -5 }, [1, 0.3], { once: { conf: 15 } })
    ], { dnu: true });

  P('sindicatos', 'tra', 'Régimen sindical',
    'Cuota solidaria, elecciones y control de las obras sociales sindicales.',
    'El modelo sindical por rama nació con el peronismo (Ley 23.551, 1988). La CGT convocó paros generales contra todos los gobiernos desde 1976.',
    0, 5, 'ley', 3, [
      L('Régimen vigente'),
      L('Reforma sindical (elecciones, transparencia, cuotas)', { cred: 1 }, { sn: -6 }, [0.5], { once: { conf: 5 } }),
      L('Fin de la cuota solidaria y pluralidad sindical', { cred: 1 }, { sn: -12 }, [0.9], { once: { conf: 10 } }),
      L('Participación de los trabajadores en las ganancias', {}, { sn: 8, pym: -3, ind: -4 }, [-0.7])
    ], { dnu: true });

  P('empleo_reg', 'tra', 'Incentivos al empleo registrado',
    'Reducción de cargas patronales y regímenes simplificados para contratar en blanco.',
    'En Argentina el empleo no registrado ronda el 36%. Hubo regímenes de promoción en 2008, 2017 y 2024 (RIMI).',
    0, 3, 'ley', 2, [
      L('Sin incentivos (vigente)'),
      L('Reducción de contribuciones patronales a nuevas contrataciones', { fisc: -0.25, unemp: -0.6 }, { pym: 5, ind: 3, jov: 2 }, [0.6]),
      L('Monotributo laboral y blanqueo', { fisc: -0.15, unemp: -0.3 }, { pym: 3, inf: 2 }, [0.4])
    ]);

  P('precios', 'tra', 'Control de precios',
    'Programas como Precios Justos o Precios Máximos. Contienen precios por un tiempo, pero generan desabastecimiento y inflación reprimida que se libera después.',
    'Comisión de Control de Precios (1946), Gelbard (1973-74), Plan Austral (1985), Precios Cuidados (2014), Precios Justos (2022).',
    0, 4, 'admin', 0, [
      L('Precios Justos y controles (vigente)', { ctrl: 2 }, {}, [-0.8]),
      L('Acuerdos voluntarios sectoriales', { ctrl: 1 }, { pym: 1 }, [0]),
      L('Libertad de precios', { ctrl: 0, cred: 3 }, { pym: 3, fin: 3, ind: 3, sp: -2 }, [1])
    ]);

  P('vivienda', 'tra', 'Alquileres y vivienda',
    'Regulación de contratos de alquiler y crédito hipotecario.',
    'La Ley 27.551 (2020) regulaba plazos y ajustes; el DNU 70/23 la derogó en 2023. En 2016 llegaron los créditos UVA.',
    0, 3, 'ley', 2, [
      L('Ley de Alquileres vigente'),
      L('Libre contratación (derogación)', { og: 0.15 }, { cm: 3, jov: -3, sp: -2 }, [0.9]),
      L('Plan de vivienda y créditos hipotecarios', { fisc: -0.3, og: 0.3 }, { cm: 4, jov: 4, sp: 3, int: 3 }, [-0.3])
    ], { dnu: true });

  /* ---------------- PRODUCCION Y COMERCIO ---------------- */
  P('aranceles', 'pro', 'Aranceles y apertura comercial',
    'Nivel de protección de la industria. La apertura baja precios y abre mercados, pero expone a sectores sin competitividad.',
    'La apertura de 1976-1981 destruyó parte de la industria; la de los 90 fue más amplia. Entre 2003 y 2015 y en 2020-2023 hubo licencias y cupos de importación.',
    0, 5, 'admin', 1, [
      L('Protección alta con restricciones (vigente)'),
      L('Apertura gradual', { impo: 6, infl: -0.15 }, { ind: -6, cm: 3, jov: 3, pym: -3, sn: -2, fin: 2 }, [0.7], { once: { conf: 3 } }),
      L('Apertura unilateral amplia', { impo: 14, infl: -0.35 }, { ind: -14, pym: -8, sn: -8, cm: 6, jov: 5, fin: 4 }, [1], { once: { conf: 8 } })
    ]);

  P('rigi', 'pro', 'Incentivos a grandes inversiones (RIGI)',
    'Estabilidad fiscal, cambiaria y aduanera por 30 años para proyectos de más de US$200 millones.',
    'La Ley Bases (2024) creó el RIGI. Los regímenes de promoción de 1958 y 1993 son antecedentes.',
    0, 5, 'ley', 3, [
      L('Sin régimen especial (vigente)'),
      L('RIGI para sectores estratégicos', { fdi: 0.35, cred: 4, og: 0.15 }, { ind: 5, fin: 5, int: 2, uni: -2, mov: -2 }, [0.8]),
      L('RIGI ampliado a todos los sectores', { fdi: 0.6, cred: 6, og: 0.3 }, { ind: 8, fin: 8, pym: -3, uni: -3, mov: -3 }, [1])
    ]);

  P('energia', 'pro', 'Energía y Vaca Muerta',
    'Un país con petróleo y gas no convencional enorme. Liberar exportaciones y asociar capital privado genera dólares.',
    'Argentina fue exportadora neta de energía hasta 2010; importó entre 2011 y 2023 (hasta US$12.000 M en 2022). El gasoducto Néstor Kirchner (2023) abrió la ruta de la autonomía.',
    0, 5, 'ley', 2, [
      L('Marco regulatorio actual (vigente)'),
      L('Liberar exportaciones y desarrollar GNL', { expo: 8, fdi: 0.2, cred: 3 }, { ind: 4, int: 3, fin: 3, uni: -2 }, [0.8]),
      L('Rol estatal ampliado (YPF y ENARSA)', { expo: -2, fisc: -0.4, cred: -3 }, { sn: 4, uni: 2, fin: -4, ind: -3 }, [-0.7])
    ]);

  P('mineria', 'pro', 'Minería y ambiente',
    'Litio, cobre y oro. Divide a las provincias productoras y a los ambientalistas.',
    'La Ley de Glaciares (2010) protege reservas de agua; Chubut aprobó un plebiscito contra la megaminería (2003).',
    0, 4, 'ley', 3, [
      L('Marco actual'),
      L('Impulso minero (litio y cobre)', { expo: 5, fdi: 0.2, cred: 2 }, { int: 4, ind: 2, uni: -2 }, [0.7]),
      L('Reforma de la Ley de Glaciares y flexibilización ambiental', { expo: 8, fdi: 0.3, cred: 3 }, { int: 5, ind: 3, uni: -5, jov: -3 }, [1])
    ]);

  P('mercosur', 'pro', 'Acuerdos comerciales',
    'El Mercosur impone un arancel externo común. Los acuerdos abren mercados.',
    'Mercosur (1991). El acuerdo con la UE se negoció desde 1999 y se cerró en 2019 y 2024-2025. Ciclos de apertura y repliegue.',
    0, 5, 'admin', 2, [
      L('Mercosur actual'),
      L('Acuerdo Mercosur-Unión Europea', { expo: 4, impo: 4 }, { agro: 6, ind: -4, cm: 2, fin: 2, int: 1 }, [0.5]),
      L('Flexibilización del Mercosur y TLC bilateral', { expo: 6, impo: 8 }, { agro: 8, ind: -8, cm: 3, fin: 4, sn: -3 }, [0.9])
    ]);

  P('exterior', 'ins', 'Política exterior',
    'Alineamientos geopolíticos y swaps de monedas.',
    'El swap con China se firmó en 2009 y se ampliaó varias veces; en 2023 se usó para pagar al FMI. EE.UU. anunció un swap en 2025.',
    0, 6, 'admin', 1, [
      L('No alineamiento (swap con China; vigente)'),
      L('Pragmatismo multipolar', { cred: 1 }, { cm: 1, ind: 1 }, [0]),
      L('Alineamiento con EE.UU. e Israel', { cred: 6 }, { fin: 5, cm: 2, rel: 3, uni: -5, mov: -5, sn: -2 }, [0.9], { once: { res: 8 } }),
      L('Eje Sur (BRICS y expansión del swap con China)', { cred: -2 }, { sn: 2, mov: 3, fin: -3, cm: -3 }, [-0.6], { once: { res: 6 } })
    ]);
})(typeof window !== 'undefined' ? window : globalThis);
