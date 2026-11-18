(function (g) {
  const AR = g.AR = g.AR || {};
  AR.SC = AR.SC || {};
  // Banderas para el Congreso: fed = bloque provincial/gobernadores; cash = vota según fondos
  AR.parties.PF.fed = true; AR.parties.PROV.fed = true; AR.parties.UCR.cash = true; AR.parties.PJ.cash = true;

  // Escenario base: 10 de diciembre de 2023. Cifras aproximadas basadas en INDEC, BCRA, Ministerio de Economía y prensa económica.
  AR.SC.dic2023 = {
    id: 'dic2023', short: 'Diciembre de 2023', name: 'El día después del balotaje', months: 47,
    blurb: 'Inflación del 211% anual, cepo, reservas negativas y un Congreso fragmentado. La crisis macroeconómica heredada más compleja en dos décadas.',
    start: { y: 2023, m: 11 },
    parties: AR.parties, order: AR.partyOrder, family: AR.family, chamber: AR.CHAMBER,
    intro: 'Es el 10 de diciembre de 2023. Asumís la Presidencia de la Nación con la inflación en 12,8% mensual (161% interanual), reservas netas negativas, un cepo cambiario que separa el dólar oficial ($366) del blue (~$1.000), un riesgo país cercano a 1.900 puntos y un 40% de pobreza. El Congreso está fragmentado: nadie tiene mayoría. Cada decisión cuesta capital político, y cada mes que pasa la economía real responde con rezagos.',
    source: 'INDEC, BCRA, Ministerio de Economía, Cámara de Diputados y Senado (cifras aproximadas).',
    macro: {
      infM: 12.8, E: 11.0, fxOff: 366, fxEq: 1000, res: -10.5, C: 18, og: -2.0, u: 5.7, pov: 40.1, ind: 9.3, gini: 0.435,
      rw: 100, rinf: 100, rPen: 100, rPw: 100, rSoc: 100, rProv: 100, rer: 100, pb: -2.9, interest: 1.7, debt: 85,
      insec: 55, conf: 35, edu: 52, hea: 55, inst: 55, tra: 45, cult: 55, pent: 0, trade: -0.3, rr: 0, mg: 10, gap: 173, risk: 1900, rate: 133
    },
    infH: [6.0, 6.6, 7.7, 8.4, 7.8, 6.0, 6.3, 12.4, 12.7, 8.3, 12.8], // Ene-Nov 2023 (INDEC)
    gdpYoy0: -1.6, pub: { pov: 40.1, u: 5.7 }, usd: 0.5, povSlope: 2.0,
    elections: { midterm: [22], general: 46, end: 46 }
  };
})(typeof window !== 'undefined' ? window : globalThis);
