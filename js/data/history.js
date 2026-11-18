(function (g) {
  const AR = g.AR = g.AR || {};
  AR.timeline = [
    { y: '1810-1816', k: 'pol', t: 'Revolución de Mayo e Independencia', x: 'El 25 de mayo de 1810 se forma la Primera Junta; el 9 de julio de 1816 el Congreso de Tucumán declara la independencia. Desde entonces, la tensión entre Buenos Aires y las provincias organiza buena parte de la política argentina.' },
    { y: '1853', k: 'pol', t: 'Constitución Nacional', x: 'Sancionada con la influencia de Alberdi, consagra el federalismo, el modelo agroexportador y la apertura a la inmigración. Con reformas (1860, 1866, 1898, 1949, 1957, 1994) sigue vigente.' },
    { y: '1880-1914', k: 'eco', t: 'Modelo agroexportador', x: 'Carne, trigo y maíz hacia Europa, ferrocarriles británicos y millones de inmigrantes. Hacia 1910 el ingreso per cápita era de los más altos del mundo. Dependencia de un solo socio comercial y de pocas exportaciones.' },
    { y: '1912-1916', k: 'pol', t: 'Ley Sáenz Peña y primer gobierno radical', x: 'Voto secreto y obligatorio para varones. En 1916 Hipólito Yrigoyen, de la UCR, es el primer presidente elegido en elecciones limpias de masas.' },
    { y: '1930', k: 'pol', t: 'Primer golpe de Estado', x: 'Uriburu derroca a Yrigoyen. Comienza la "Década Infame": fraude electoral, el Pacto Roca-Runciman (1933) y la creación del Banco Central (1935).' },
    { y: '1946-1955', k: 'pol', t: 'Primer peronismo', x: 'Perón nacionaliza el Banco Central y los ferrocarriles, impulsa la industria sustitutiva, el aguinaldo y las vacaciones pagas. Voto femenino (1947, Ley 13.010) con Eva Perón. Nacimiento de la alianza Estado, sindicatos y mercado interno.' },
    { y: '1955-1973', k: 'pol', t: 'Proscripción y alternancia de golpes', x: 'La Revolución Libertadora proscribe al peronismo. Frondizi (desarrollismo), Illia (derrocado en 1966), Onganía y el Cordobazo de 1969: obreros y estudiantes enfrentan a la dictadura.' },
    { y: '1973-1975', k: 'eco', t: 'Regreso de Perón y Rodrigazo', x: 'Perón vuelve y muere en 1974. En junio de 1975 el "Rodrigazo" combina mega-devaluación y ajuste de tarifas: la inflación se dispara y la CGT logra la caída del ministro.' },
    { y: '1976-1983', k: 'pol', t: 'Dictadura cívico-militar', x: 'Terrorismo de Estado con 30.000 desaparecidos según los organismos de derechos humanos. Apertura financiera de Martínez de Hoz, "tablita" cambiaria y deuda externa de ~8.000 a ~45.000 millones de dólares.' },
    { y: '1982-1983', k: 'pol', t: 'Guerra de Malvinas y vuelta a la democracia', x: 'La derrota acelera la salida militar. En octubre de 1983 gana Raúl Alfonsín (UCR). El Juicio a las Juntas (1985) es un hito mundial.' },
    { y: '1985-1989', k: 'eco', t: 'Plan Austral e hiperinflación', x: 'El Plan Austral (1985) estabiliza un tiempo, pero la deuda, el déficit y la puja distributiva llevan a la hiperinflación de 1989 (196% mensual en julio). Alfonsín entrega el poder anticipadamente a Menem.' },
    { y: '1989-1991', k: 'eco', t: 'Reforma del Estado y Convertibilidad', x: 'Menem privatiza YPF, teléfonos, trenes y más. En abril de 1991 el ministro Cavallo fija por ley 1 peso = 1 dólar. La inflación cae a un dígito anual hacia 1993-94.' },
    { y: '1994-1995', k: 'pol', t: 'Reforma constitucional y Efecto Tequila', x: 'Pacto de Olivos, reelección inmediata y creación de las AFJP. La crisis mexicana golpea: desempleo del 18,4% en 1995.' },
    { y: '1998-2002', k: 'eco', t: 'Recesión, corralito y default', x: 'Cuatro años de recesión bajo convertibilidad. El 1 de diciembre de 2001 se impone el corralito; el 19-20 de diciembre estalla la crisis y renuncia De la Rúa. Cinco presidentes en pocos días, el mayor default soberano de la época (~95.000 millones) y pesificación.' },
    { y: '2002', k: 'eco', t: 'Pico de pobreza y desempleo', x: 'Pobreza del 57,5% en octubre de 2002 y desocupación del 21,5% en mayo. El dólar pasa de $1 a ~$3,90 y la inflación del año supera el 40%.' },
    { y: '2003-2007', k: 'eco', t: 'Recuperación y crecimiento chino', x: 'Kirchner asume en 2003. Superávit gemelos, tipo de cambio competitivo y suba de commodities: ~8% anual. En 2005 el canje reestructura el 76% de la deuda; en 2006 se cancela la deuda con el FMI.' },
    { y: '2008', k: 'pol', t: 'Conflicto del campo y estatización de las AFJP', x: 'La Resolución 125 (retenciones móviles) provoca cuatro meses de conflicto con el agro y se cae en el Senado por el voto no positivo del vicepresidente. En noviembre se estatizan las AFJP.' },
    { y: '2009-2014', k: 'pol', t: 'Ampliación de derechos y cepo', x: 'Asignación Universal por Hijo (2009), Matrimonio Igualitario (2010), Ley de Identidad de Género (2012). En 2011 aparece el cepo cambiario; en 2012 se expropia el 51% de YPF; en 2014 el fallo Griesa deja al país en default técnico con los holdouts.' },
    { y: '2015-2019', k: 'eco', t: 'Macri: gradualismo y crisis de 2018', x: 'Se levanta el cepo (2015) y se arregla con los holdouts (2016). La deuda en dólares crece; en 2018 una corrida lleva al mayor préstamo de la historia del FMI (Stand-By de 57.000 millones). Tras las PASO de agosto de 2019, devaluación y regreso del cepo.' },
    { y: '2020-2022', k: 'eco', t: 'Pandemia, reestructuración y acuerdo con el FMI', x: 'Aislamiento estricto en 2020; reestructuración de la deuda en dólares (~65.000 millones, 99% de adhesión). Ley de Interrupción Voluntaria del Embarazo (Ley 27.610). En 2022 se firma el programa de Facilidades Extendidas por 44.000 millones.' },
    { y: '2023', k: 'eco', t: 'Sequía, PASO y balotaje', x: 'La peor sequía en décadas reduce las exportaciones. Las PASO de agosto las gana Javier Milei y se devalúa 22%. La inflación de 2023 cierra en 211%. El 19 de noviembre gana el balotaje con el 55,7%.' }
  ];

  AR.glossary = [
    ['Cepo', 'Restricciones a la compra de divisas. Genera una brecha entre el dólar oficial y el libre (blue / CCL).'],
    ['Crawling peg', 'Devaluación pautada y gradual del tipo de cambio oficial, a un ritmo mensual fijo.'],
    ['Banda cambiaria', 'El dólar flota entre un piso y un techo; el Banco Central interviene solo en los extremos.'],
    ['Licuadora', 'Cuando el Estado ajusta jubilaciones, salarios y programas por debajo de la inflación y el gasto real cae. Es la principal fuente del superávit en los primeros meses de un ajuste.'],
    ['LELIQ / Pases', 'Pasivos remunerados del BCRA con los que absorbía pesos. Pagan intereses con emisión, lo que alimenta la base monetaria.'],
    ['Riesgo país', 'Sobretasa que pagan los bonos soberanos en dólares sobre los del Tesoro de EE.UU., medida en puntos básicos.'],
    ['DNU', 'Decreto de Necesidad y Urgencia: rige de inmediato, pero queda vigente salvo que ambas cámaras lo rechacen. La Justicia también puede suspenderlo.'],
    ['Veto', 'El Presidente puede vetar leyes; el Congreso lo supera con dos tercios en ambas cámaras.'],
    ['Coparticipación', 'Régimen de reparto de impuestos nacionales entre Nación y provincias.'],
    ['ATN', 'Aportes del Tesoro Nacional: fondos discrecionales que la Nación gira a las provincias.']
  ];
})(typeof window !== 'undefined' ? window : globalThis);
