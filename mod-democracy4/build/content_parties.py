# -*- coding: utf-8 -*-
"""Políticas de los otros espacios políticos.

El mod tenía sobre todo lo que hizo el gobierno que asumió en 2023. Acá están las políticas que propusieron o
aplicaron los otros espacios (Unión por la Patria, el PRO y Juntos por el Cambio, el Frente de Izquierda), para que
se pueda gobernar la Argentina de 2023 con otro programa y ver qué pasa. Ninguna arranca activa.

Cuando el juego ya tiene una política equivalente, se usa la del juego con nombre argentino (content_names.py):
salario básico universal, ley de alquileres, Procrear, participación en las ganancias, impuesto al cheque...
"""

# Política del juego -> (nombre es, descripción es, nombre en, descripción en)
BASE_RENAMES = {
    'UniversalBasicIncome': (
        'Salario Básico Universal', 'Un ingreso mínimo para todas las personas adultas sin empleo formal, financiado por el '
        'Estado. Lo impulsaron los movimientos sociales y sectores de Unión por la Patria. Reduce la pobreza extrema, pero es '
        'carísimo y, según sus críticos, desalienta el trabajo formal.',
        'Universal Basic Wage', 'A minimum income for every adult without a formal job, paid by the state. Pushed by social '
        'movements and parts of the Peronist coalition. It cuts extreme poverty, but is very expensive and, critics say, '
        'discourages formal work.'),
    'RentControls': (
        'Ley de Alquileres', 'Contratos de tres años con ajuste anual por un índice oficial. Protege a los inquilinos, pero '
        'los propietarios retiran departamentos del mercado y la oferta se desploma.',
        'Rental Law', 'Three-year leases with annual adjustment by an official index. It protects tenants, but landlords '
        'pull flats off the market and supply collapses.'),
    'StateHousing': (
        'Procrear y vivienda social', 'Créditos hipotecarios subsidiados y construcción de viviendas por el Estado.',
        'Procrear and social housing', 'Subsidised mortgages and state-built housing.'),
    'WorkersOnBoards': (
        'Participación de los trabajadores en las ganancias', 'El artículo 14 bis de la Constitución lo prevé desde 1957 y '
        'nunca se reglamentó. Distintos proyectos de la CGT y de Unión por la Patria proponen aplicarlo.',
        'Workers\' profit sharing', 'Article 14 bis of the Constitution has provided for it since 1957 but it was never '
        'regulated. Bills from the unions and the Peronist coalition propose applying it.'),
    'FinancialTransactionsTax': (
        'Impuesto al cheque', 'Impuesto a los débitos y créditos bancarios. Recauda mucho y es fácil de cobrar, pero '
        'empuja a la gente a usar efectivo y a la informalidad.',
        'Bank debit tax', 'Tax on bank debits and credits. It raises a lot and is easy to collect, but pushes people to '
        'cash and the informal economy.'),
    'LuxuryGoodsTax': (
        'Impuestos internos', 'Impuestos especiales a autos de alta gama, electrónica, bebidas alcohólicas y otros bienes.',
        'Excise taxes', 'Special taxes on high-end cars, electronics, alcoholic drinks and other goods.'),
}

# Niveles reales de diciembre de 2023 para esas políticas del juego
BASE_START_REAL = {'FinancialTransactionsTax': 0.6, 'LuxuryGoodsTax': 0.3}


def extend(C):
    pol = C.pol

    # ------------------------------------------------------------------ Unión por la Patria / peronismo
    pol('AR_DolarDiferencial', 'ECONOMY', 'cash',
        ('Dólares diferenciales (dólar soja, dólar agro)', 'Tipos de cambio especiales y temporarios para que el campo y otros '
         'exportadores liquiden. Entran dólares rápido, pero se multiplican las cotizaciones, crece la emisión y la brecha '
         'vuelve apenas termina el programa. Lo usó Sergio Massa en 2022 y 2023.'),
        ('Special exchange rates ("soy dollar")', 'Temporary special exchange rates so farmers and other exporters sell their '
         'dollars. Dollars come in fast, but exchange rates multiply, money printing grows and the gap returns as soon as the '
         'scheme ends. Used by Sergio Massa in 2022 and 2023.'),
        ['Farmers,0+(0.12*x)', 'InternationalTrade,0+(0.05*x)', 'Inflation,0+(0.05*x),3', 'CurrencyStrength,0-(0.04*x)',
         'Capitalist,0+(0.04*x)', 'BlackMarket,0+(0.04*x)'],
        pc=(6, 4, 4, 4), impl=1, cost=(0, 0))

    pol('AR_ProhibicionDespidos', 'ECONOMY', 'hand-stop',
        ('Prohibición de despidos y doble indemnización', 'Despedir sin causa queda prohibido o cuesta el doble. Rigió entre '
         '2019 y 2022. Protege los empleos que existen, pero nadie contrata en blanco y crece la informalidad.'),
        ('Ban on dismissals and double severance', 'Dismissals without cause are banned or cost double. It was in force from '
         '2019 to 2022. It protects existing jobs, but nobody hires formally and informality grows.'),
        ['TradeUnionist,0+(0.15*x)', 'Capitalist,0-(0.15*x)', 'SelfEmployed,0-(0.06*x)', 'Unemployment,0-(0.03*x),2',
         'BusinessConfidence,0-(0.08*x)', 'ForeignInvestment,0-(0.04*x),4', 'BlackMarket,0+(0.04*x),4'],
        pc=(10, 8, 5, 5), impl=1, cost=(0, 0))

    pol('AR_CompreArgentino', 'ECONOMY', 'building-factory-2',
        ('Compre Argentino y sustitución de importaciones', 'Preferencia para la industria nacional en las compras del Estado '
         'y trabas a lo importado. Defiende fábricas y empleos industriales, pero encarece todo y aísla del mundo.'),
        ('Buy Argentine and import substitution', 'Preference for domestic industry in state purchases and barriers to '
         'imports. It protects factories and industrial jobs, but makes everything dearer and isolates the economy.'),
        ['TradeUnionist,0+(0.08*x)', 'Patriot,0+(0.08*x)', 'Unemployment,0-(0.02*x),4', 'Inflation,0+(0.03*x),4',
         'InternationalTrade,0-(0.06*x)', 'Capitalist,0-(0.04*x)', 'MiddleIncome,0-(0.04*x)'],
        pc=(8, 6, 4, 4), impl=4, cost=(0, 40))

    pol('AR_AporteSolidario', 'TAX', 'coins',
        ('Aporte solidario de las grandes fortunas', 'Impuesto extraordinario a los patrimonios de más de 200 millones de '
         'pesos, como el de la pandemia en 2021. Recauda una vez, pero los grandes ahorristas sacan su plata del país.'),
        ('Solidarity levy on large fortunes', 'One-off tax on fortunes above 200 million pesos, like the 2021 pandemic levy. '
         'It raises money once, but large savers move their money abroad.'),
        ['Wealthy,0-(0.25*x)', 'Capitalist,0-(0.10*x)', 'Socialist,0+(0.12*x)', 'Equality,0+(0.03*x),4',
         'ForeignInvestment,0-(0.04*x),4', 'BusinessConfidence,0-(0.04*x)'],
        pc=(12, 8, 6, 6), impl=2, income=(0, 2500))

    pol('AR_ReformaJudicial', 'LAWANDORDER', 'gavel',
        ('Reforma judicial y ampliación de la Corte', 'Más jueces en la Corte Suprema y cambios en los tribunales federales. '
         'Sus defensores hablan de democratizar la Justicia; sus críticos, de colonizarla.'),
        ('Judicial reform and Supreme Court expansion', 'More justices on the Supreme Court and changes to the federal courts. '
         'Supporters call it democratising the courts; critics call it packing them.'),
        ['Socialist,0+(0.08*x)', 'Liberal,0-(0.10*x)', 'Conservatives,0-(0.08*x)', 'Democracy,0-(0.04*x),4',
         'Corruption,0+(0.03*x),6', 'ForeignInvestment,0-(0.03*x),4'],
        pc=(25, 10, 10, 8), impl=4, cost=(0, 0))

    pol('AR_LeyMedios', 'LAWANDORDER', 'news',
        ('Ley de medios (desmonopolización)', 'Límites a las licencias de radio y televisión que puede tener un mismo grupo, '
         'como la ley de 2009. Más voces o más control político de los medios, según quién lo mire.'),
        ('Media law (breaking up monopolies)', 'Limits on how many radio and TV licences one group can hold, like the 2009 '
         'law. More voices or more political control of the media, depending on who you ask.'),
        ['Socialist,0+(0.06*x)', 'Capitalist,0-(0.08*x)', 'Liberal,0-(0.04*x)', 'Polarization,0+(0.03*x),4'],
        pc=(15, 8, 6, 6), impl=4, cost=(0, 20))

    pol('AR_Expropiaciones', 'ECONOMY', 'building-factory',
        ('Expropiación de empresas estratégicas', 'El Estado toma el control de empresas en crisis o consideradas '
         'estratégicas, como se intentó con Vicentin en 2020. Gusta a la militancia y espanta a los inversores.'),
        ('Expropriation of strategic firms', 'The state takes over firms in crisis or deemed strategic, as was attempted with '
         'the Vicentin grain company in 2020. Activists love it; investors flee.'),
        ['Capitalist,0-(0.20*x)', 'Socialist,0+(0.12*x)', 'Patriot,0+(0.05*x)', 'ForeignInvestment,0-(0.10*x),4',
         'BusinessConfidence,0-(0.10*x)', 'StateEmployees,0+(0.05*x)'],
        pc=(20, 10, 10, 8), impl=2, cost=(0, 80))

    # ------------------------------------------------------------------ PRO / Juntos por el Cambio
    pol('AR_Bimonetarismo', 'ECONOMY', 'arrows-exchange',
        ('Bimonetarismo', 'El peso y el dólar circulan juntos con curso legal: se puede cobrar, pagar y contratar en '
         'cualquiera de los dos. Fue la propuesta de Patricia Bullrich y de parte del PRO. Frena la huida del peso sin '
         'abandonarlo, pero deja al Banco Central con menos poder.'),
        ('Dual currency', 'The peso and the US dollar both circulate as legal tender: wages, payments and contracts can be in '
         'either. Proposed by Patricia Bullrich and part of the PRO party. It slows the flight from the peso without '
         'abandoning it, but leaves the central bank with less power.'),
        ['Inflation,0-(0.06*x),6', 'CurrencyStrength,0+(0.05*x)', 'BusinessConfidence,0+(0.06*x)', 'MiddleIncome,0+(0.06*x)',
         'Patriot,0-(0.06*x)', 'Socialist,0-(0.06*x)'],
        pc=(15, 10, 6, 6), impl=4, cost=(0, 0), opposites='AR_Dolarizacion')

    pol('AR_BCRAIndependiente', 'ECONOMY', 'shield-check',
        ('Independencia del Banco Central', 'Por ley, el Banco Central no puede financiar al Tesoro y su directorio no '
         'responde al gobierno. Lo propusieron Juntos por el Cambio y los economistas ortodoxos. Da credibilidad, pero ata '
         'las manos en una crisis.'),
        ('Central bank independence', 'By law the central bank cannot finance the Treasury and its board does not answer to '
         'the government. Proposed by the centre-right coalition and orthodox economists. It brings credibility, but ties '
         'the government\'s hands in a crisis.'),
        ['Inflation,0-(0.06*x),8', 'BusinessConfidence,0+(0.06*x)', 'ForeignInvestment,0+(0.03*x),4', 'Capitalist,0+(0.06*x)',
         'Socialist,0-(0.05*x)'],
        pc=(20, 20, 8, 8), impl=4, cost=(0, 0), opposites='QuantitativeEasing')

    pol('AR_BoletaUnica', 'LAWANDORDER', 'checkbox',
        ('Boleta Única de Papel', 'Una sola boleta con todos los candidatos, impresa por el Estado. Termina con el robo de '
         'boletas y abarata las elecciones para los partidos chicos. Se aprobó en 2024, impulsada por el PRO.'),
        ('Single paper ballot', 'One state-printed ballot listing every candidate. It ends ballot theft and makes elections '
         'cheaper for small parties. Approved in 2024, pushed by the PRO party.'),
        ['Democracy,0+(0.03*x),4', 'Corruption,0-(0.02*x),6', 'Liberal,0+(0.04*x)'],
        pc=(8, 8, 4, 4), impl=4, cost=(0, 10))

    pol('AR_EducacionEsencial', 'PUBLICSERVICES', 'school',
        ('Educación como servicio esencial', 'Las escuelas no pueden cerrar por paros: se garantiza un mínimo de clases. Lo '
         'impulsa el PRO desde la pandemia. Los gremios docentes lo consideran un ataque al derecho de huelga.'),
        ('Education as an essential service', 'Schools cannot close because of strikes: a minimum of classes is guaranteed. '
         'Pushed by the PRO party since the pandemic. Teachers\' unions see it as an attack on the right to strike.'),
        ['Education,0+(0.03*x),8', 'Parents,0+(0.10*x)', 'TradeUnionist,0-(0.10*x)', 'StateEmployees,0-(0.06*x)'],
        pc=(10, 8, 5, 5), impl=2, cost=(0, 0))

    pol('AR_Reiterancia', 'LAWANDORDER', 'shield-lock',
        ('Ley de reiterancia', 'Quien acumula causas penales espera el juicio preso, aunque cada delito por separado no lo '
         'justifique. Es parte de la agenda de seguridad del PRO y de Patricia Bullrich.'),
        ('Repeat-offender law', 'Anyone with several pending criminal cases awaits trial in custody, even if no single offence '
         'would justify it. Part of the security agenda of the PRO party and Patricia Bullrich.'),
        ['CrimeRate,0-(0.04*x),6', 'Conservatives,0+(0.10*x)', 'Liberal,0-(0.08*x)', 'Retired,0+(0.04*x)'],
        pc=(10, 8, 5, 5), impl=2, cost=(0, 60))

    # ------------------------------------------------------------------ Frente de Izquierda
    pol('AR_NoPagoDeuda', 'FOREIGNPOLICY', 'ban',
        ('Desconocer la deuda y romper con el FMI', 'Suspender los pagos de la deuda externa y del acuerdo con el Fondo, '
         'como propone el Frente de Izquierda. Libera recursos para salarios y salud, pero corta el crédito externo, '
         'derrumba la confianza y aísla al país.'),
        ('Repudiate the debt and break with the IMF', 'Suspend payments on foreign debt and the IMF programme, as the '
         'Trotskyist Left Front proposes. It frees money for wages and health, but cuts off foreign credit, collapses '
         'confidence and isolates the country.'),
        ['Socialist,0+(0.20*x)', 'TradeUnionist,0+(0.08*x)', 'Capitalist,0-(0.30*x)', 'Wealthy,0-(0.15*x)',
         'ForeignRelations,0-(0.15*x),4', 'ForeignInvestment,0-(0.15*x),4', 'BusinessConfidence,0-(0.12*x)',
         'CurrencyStrength,0-(0.06*x)'],
        pc=(30, 30, 10, 10), impl=1, income=(0, 4000), opposites='AR_AcuerdoFMI')

    pol('AR_NacionalizacionBanca', 'ECONOMY', 'building-bank',
        ('Nacionalización de la banca y del comercio exterior', 'Todos los bancos pasan al Estado y sólo el Estado puede '
         'exportar e importar. Es el programa del Frente de Izquierda. Controla los dólares de raíz, pero los ahorristas '
         'corren a retirar sus depósitos.'),
        ('Nationalise the banks and foreign trade', 'All banks pass to the state and only the state may export and import. '
         'It is the Left Front\'s programme. It controls the dollars at the source, but savers rush to withdraw deposits.'),
        ['Capitalist,0-(0.35*x)', 'Wealthy,0-(0.20*x)', 'Socialist,0+(0.20*x)', 'ForeignInvestment,0-(0.15*x),4',
         'BusinessConfidence,0-(0.15*x)', 'InternationalTrade,0-(0.08*x)', 'Corruption,0+(0.03*x),6',
         'BlackMarket,0+(0.06*x),4', 'StateEmployees,0+(0.06*x)'],
        pc=(35, 25, 12, 10), impl=4, cost=(0, 200))

    pol('AR_JornadaReducida', 'ECONOMY', 'clock',
        ('Reducción de la jornada laboral', 'Seis horas o cuatro días por semana sin bajar el sueldo, como proponen el Frente '
         'de Izquierda y algunos diputados de Unión por la Patria. Mejora la calidad de vida, pero sube el costo de cada '
         'puesto de trabajo.'),
        ('Shorter working week', 'Six-hour days or a four-day week with no pay cut, as proposed by the Left Front and some '
         'Peronist deputies. Better quality of life, but each job costs more.'),
        ['WorkingWeek,0-(0.10*x),4', 'TradeUnionist,0+(0.12*x)', 'Young,0+(0.06*x)', 'Capitalist,0-(0.15*x)',
         'SelfEmployed,0-(0.06*x)', 'Health,0+(0.02*x),8', 'GDP,0-(0.03*x),4', 'BusinessConfidence,0-(0.05*x)'],
        pc=(12, 8, 6, 6), impl=4, cost=(0, 0))

    # ------------------------------------------------------------------ cómo encadenan con las crisis argentinas
    links = {
        'AR_BrechaCambiaria': ['AR_DolarDiferencial,0+(0.08*x)', 'AR_Bimonetarismo,0-(0.15*x)',
                               'AR_NacionalizacionBanca,0+(0.10*x)'],
        'AR_ReservasAgotadas': ['AR_DolarDiferencial,0-(0.06*x)', 'AR_NoPagoDeuda,0-(0.10*x)'],
        'AR_RiesgoPaisAlto': ['AR_NoPagoDeuda,0+(0.40*x)', 'AR_Expropiaciones,0+(0.10*x)', 'AR_ReformaJudicial,0+(0.05*x)',
                              'AR_BCRAIndependiente,0-(0.06*x)', 'AR_NacionalizacionBanca,0+(0.12*x)'],
        'AR_Default': ['AR_NoPagoDeuda,0+(0.55*x)'],
        'AR_CorridaCambiaria': ['AR_NacionalizacionBanca,0+(0.30*x)', 'AR_NoPagoDeuda,0+(0.10*x)',
                                'AR_Bimonetarismo,0-(0.10*x)'],
        'AR_Corralito': ['AR_NacionalizacionBanca,0+(0.25*x)'],
        'AR_InversionRecord': ['AR_Expropiaciones,0-(0.15*x)', 'AR_NoPagoDeuda,0-(0.20*x)', 'AR_AporteSolidario,0-(0.06*x)',
                               'AR_NacionalizacionBanca,0-(0.20*x)', 'AR_BCRAIndependiente,0+(0.05*x)'],
        'AR_EstabilidadMacro': ['AR_BCRAIndependiente,0+(0.08*x)', 'AR_Bimonetarismo,0+(0.05*x)'],
        'AR_Desinflacion': ['AR_BCRAIndependiente,0+(0.06*x)', 'AR_Bimonetarismo,0+(0.05*x)'],
        'AR_CierrePymes': ['AR_ProhibicionDespidos,0+(0.06*x)', 'AR_JornadaReducida,0+(0.08*x)',
                           'AR_CompreArgentino,0-(0.08*x)'],
        'AR_DesempleoCreciente': ['AR_ProhibicionDespidos,0-(0.06*x)'],
        'AR_ParoCGT': ['AR_JornadaReducida,0-(0.10*x)', 'AR_ProhibicionDespidos,0-(0.08*x)',
                       'AR_EducacionEsencial,0+(0.04*x)'],
        'AR_ConflictoUniversitario': ['AR_EducacionEsencial,0+(0.05*x)'],
        'AR_Grieta': ['AR_LeyMedios,0+(0.08*x)', 'AR_ReformaJudicial,0+(0.10*x)', 'AR_Expropiaciones,0+(0.05*x)'],
        'AR_EscandaloCorrupcion': ['AR_BoletaUnica,0-(0.04*x)'],
        'AR_BloqueoLegislativo': ['AR_ReformaJudicial,0+(0.10*x)', 'AR_NoPagoDeuda,0+(0.08*x)'],
        'AR_PerdidaPoderAdquisitivo': ['AR_DolarDiferencial,0+(0.04*x)'],
    }
    by = {s['name']: s for s in C.SITUATIONS}
    for name, causes in links.items():
        by[name]['causes'].extend(causes)
