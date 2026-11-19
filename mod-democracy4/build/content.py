# -*- coding: utf-8 -*-
"""
Contenido del mod "Argentina: Gobernala" para Democracy 4.

Todo lo que el mod agrega está definido acá como datos. build.py lo convierte en los archivos
que lee el juego y validate.py revisa que sean coherentes.

Convenciones del juego (tomadas de mods publicados que funcionan):
- Efectos: "Destino,fórmula[,demora]". x es la posición del deslizador (0 a 1) o el valor de la fuente.
- Todo lo exclusivo de Argentina exige el prerrequisito PREREQ, que sólo el país "argentina" tiene en 1.
- Prefijo AR_ en todos los nombres para no chocar con el juego base ni con otros mods.
"""

MOD_NAME = 'argentina_gobernala'
COUNTRY = 'argentina'
PREREQ = '_prereq_argentina_gb'
PREREQ_ID = 7311          # número libre (el Overhaul usa 921-950)
COUNTRY_GUID = 731

MOD_CONFIG = {
    'guiname': 'Argentina: Gobernala',
    'author': 'santimoran19',
    'description_es': ('Argentina completa para Democracy 4: inflación inercial, cepo, brecha cambiaria, retenciones, '
                       'FMI, Vaca Muerta, piquetes, sindicatos y la grieta. 28 políticas propias, 13 situaciones, '
                       '15 eventos y 16 dilemas basados en la historia económica argentina. Textos en español e inglés.'),
}

# ---------------------------------------------------------------------------------------------
# País
# ---------------------------------------------------------------------------------------------
# Los montos usan dólares (fx 0.79 libras por dólar) para evitar cifras absurdas en pesos.
COUNTRY_CONFIG = {
    'currency': '"US$"',
    'population': 23000,            # escala interna del juego (Brasil = 104750 con 210 M)
    'economic_cycle_start': 0.10,   # arranca en recesión
    'min_income': 0,
    'max_income': 120000,
    'min_gdp': 220000,
    'max_gdp': 640000,
    'wealth_mod': 2.0,
    'fx_rate_to_pound': 0.79,
    'starting_debt': 390000,        # deuda alta, cerca del 90 % del PBI
    'name ': COUNTRY,
    'names_file': '"data/names/argentinanames_gb.txt"',
    'flag': '"flag_argentina_gb.png"',
    'apathy': 0.24,                 # voto obligatorio: participación alta
    'map': '"map_argentina_gb.svg"',
    'GUID': COUNTRY_GUID,
    'minor_parties': 4,
    'difficulty': 5,
}

# Valores iniciales de políticas del juego base (0 a 1), calibrados para Argentina hacia fines de 2023.
COUNTRY_POLICIES = {
    '_prereq_has_coast': 1, '_prereq_sovereign_currency': 1, '_prereq_land_border': 1,
    'AirlineTax': 0.3, 'AlcoholTax': 0.35, 'ArmedPolice': 0.5, 'BorderControls': 0.4, 'BusLanes': 0.35,
    'CCTVCameras': 0.45, 'CapitalGainsTax': 0.15, 'CarEmmissionsLimits': 0.3, 'CarTax': 0.45, 'ChildBenefit': 0.7,
    'CorporationTax': 0.6, 'ChildcareProvision': 0.3, 'CompulsorySchoolSports': 0.5, 'CompulsoryLanguageLessons': 0.4,
    'CompulsoryForeignLanguageClasses': 0.5, 'DisabilityBenefit': 0.55, 'DetentionWithoutTrial': 0.0,
    'DiplomaticService': 0.4, 'ExecutiveTermLimit': 0.5, 'ExecutiveTermLength': 0.3, 'FoodStandards': 0.6,
    'ForeignAid': 0.05, 'ForeignInvestorTaxBreaks': 0.2, 'Gambling': 0.45, 'GameHunting': 0.3, 'GayMarriage': 1.0,
    'GatedCommunities': 0.55, 'HandgunLaws': 0.7, 'IncomeTax': 0.45, 'InheritanceTax': 0.0,
    'IntellectualPropertyRights': 0.45, 'IntelligenceServices': 0.35, 'JudiciaryIndependence': 0.45, 'JuryTrial': 0.15,
    'LabourLaws': 0.75, 'LegalAid': 0.6, 'MaternityLeave': 0.35, 'MilitarySpending': 0.2, 'MinimumWage': 0.45,
    'Narcotics': 0.1, 'PayrollTax': 0.75, 'PetrolTax': 0.45, 'PoliceForce': 0.55, 'PollutionControls': 0.35,
    'PressFreedom': 0.75, 'PrisonerTagging': 0.3, 'PrisonRegime': 0.55, 'PropertyTax': 0.3, 'PrisonerVoting': 0.5,
    'PhoneTapping': 0.25, 'RaceDiscriminationAct': 0.8, 'Recycling': 0.3, 'RetirementAge': 0.5, 'RoadBuilding': 0.35,
    'RubberBullets': 0.3, 'SalesTax': 0.75, 'ScienceFunding': 0.35, 'SelectiveSchooling': 0.2, 'SpeedCameras': 0.4,
    'SocialCare': 0.3, 'StateBroadcaster': 0.6, 'StateHealthService': 0.75, 'StateHousing': 0.35,
    'StatePensions': 0.65, 'StateSchools': 0.75, 'StatePostalService': 0.6, 'TobaccoTax': 0.7,
    'UnemployedBenefit': 0.35, 'UniversityGrants': 0.65, 'WorkSafetyLaw': 0.6,
}

# Rasgos estructurales: sólo en Argentina (overrides del país). Mismo patrón que usan los países del Overhaul.
COUNTRY_OVERRIDES = [
    ('Inercia inflacionaria', 'Inflation', '+0.12+(0.05*x)'),
    ('Evasion estructural', 'TaxEvasion', '+0.10+(0.04*x)'),
    ('Corrupcion arraigada', 'Corruption', '+0.06+(0.03*x)'),
    ('La grieta', 'Polarization', '+0.08+(0.04*x)'),
    ('Fuga de cerebros', 'BrainDrain', '+0.04+(0.03*x)'),
    ('Economia informal', 'BlackMarket', '+0.06+(0.03*x)'),
]

# ---------------------------------------------------------------------------------------------
# Deslizadores con etiquetas propias
# ---------------------------------------------------------------------------------------------
SLIDERS = {
    'ar_cepo': {'es': ['Restricciones mínimas', 'Cepo a personas', 'Cepo a personas y empresas', 'Cepo total'],
                'en': ['Minimal controls', 'Controls on individuals', 'Controls on individuals and firms', 'Full capital controls']},
    'ar_retenciones': {'es': ['0 %', '5 %', '12 %', '26 %', '33 %'], 'en': ['0%', '5%', '12%', '26%', '33%']},
    'ar_fmi': {'es': ['Sin programa', 'Facilidades extendidas', 'Programa con metas estrictas'],
               'en': ['No program', 'Extended facility', 'Strict conditional program']},
    'ar_subsidios': {'es': ['Tarifa plena', 'Subsidios segmentados', 'Subsidios amplios', 'Subsidios generalizados'],
                     'en': ['Full tariffs', 'Targeted subsidies', 'Broad subsidies', 'Universal subsidies']},
    'ar_movilidad': {'es': ['Congelada por decreto', 'Ajuste por inflación', 'Inflación y salarios', 'Fórmula generosa'],
                     'en': ['Frozen by decree', 'Indexed to inflation', 'Inflation plus wages', 'Generous formula']},
    'ar_reformalab': {'es': ['Ley de contrato vigente', 'Modernización parcial', 'Reforma profunda'],
                      'en': ['Current labour code', 'Partial modernisation', 'Deep reform']},
    'ar_malvinas': {'es': ['Diálogo y cooperación', 'Reclamo diplomático firme', 'Confrontación'],
                    'en': ['Dialogue and cooperation', 'Firm diplomatic claim', 'Confrontation']},
    'ar_mercosur': {'es': ['Arancel externo alto', 'Mercosur flexible', 'Apertura y acuerdo con la UE'],
                    'en': ['High external tariff', 'Flexible Mercosur', 'Opening and EU agreement']},
}

# ---------------------------------------------------------------------------------------------
# Políticas (todas exigen PREREQ). Campos:
#   name, dept, slider, pc=(introducir, cancelar, subir, bajar), impl (turnos),
#   cost=(min,max) gasto o income=(min,max) recaudación, opposites, icon (Tabler), effects, es, en
# ---------------------------------------------------------------------------------------------
P = []
def pol(name, dept, icon, es, en, effects, slider='default', pc=(10, 8, 5, 5), impl=2, cost=(0, 0), income=(0, 0), opposites=''):
    P.append(dict(name=name, dept=dept, icon=icon, es=es, en=en, effects=effects, slider=slider, pc=pc, impl=impl,
                  cost=cost, income=income, opposites=opposites))

pol('AR_Cepo', 'ECONOMY', 'lock',
    ('Cepo cambiario', 'Restricciones para comprar dólares y girar divisas al exterior. Protege las reservas en el corto plazo, '
     'pero agranda la brecha con el dólar paralelo, ahuyenta inversiones y alimenta el mercado negro.'),
    ('Currency controls ("cepo")', 'Restrictions on buying US dollars and moving money abroad. It protects reserves in the short run, '
     'but widens the gap with the parallel dollar, scares off investment and feeds the black market.'),
    ['ForeignInvestment,0-(0.20*x)', 'BusinessConfidence,0-(0.15*x)', 'TaxEvasion,0+(0.08*x)', 'BlackMarket,0+(0.12*x)',
     'InternationalTrade,0-(0.10*x)', 'MiddleIncome,0-(0.10*x)', 'Capitalist,0-(0.15*x)', 'Wealthy,0-(0.10*x)',
     'GDP,0-(0.03*x),4'],
    slider='ar_cepo', pc=(12, 15, 8, 8), impl=1, cost=(5, 30), opposites='AR_Dolarizacion')

pol('AR_EmisionTesoro', 'ECONOMY', 'printer',
    ('Asistencia del Banco Central al Tesoro', 'El Banco Central imprime pesos para financiar el déficit. Da recursos rápidos, '
     'pero es la fuente clásica de la inflación argentina: debilita la moneda y licua salarios y jubilaciones.'),
    ('Central bank financing of the Treasury', 'The central bank prints pesos to finance the deficit. It is quick money, but it is the '
     'classic source of Argentine inflation: it weakens the currency and erodes wages and pensions.'),
    ['Inflation,0+(0.35*x),3', 'CurrencyStrength,0-(0.25*x),3', 'Poor,0-(0.08*x),4', 'Retired,0-(0.08*x),4',
     'MiddleIncome,0-(0.06*x),4', 'Capitalist,0-(0.12*x)', 'BusinessConfidence,0-(0.08*x)'],
    pc=(8, 12, 4, 4), impl=1, income=(0, 4000), opposites='AR_Dolarizacion')

pol('AR_Retenciones', 'TAX', 'plant-2',
    ('Derechos de exportación (retenciones)', 'Impuesto a las exportaciones agropecuarias, sobre todo a la soja. Recauda mucho y '
     'abarata alimentos, pero el campo lo resiste con fuerza y desalienta exportar, lo que cuesta dólares.'),
    ('Export duties ("retenciones")', 'A tax on farm exports, mainly soybeans. It raises a lot of money and makes food cheaper, but '
     'farmers fiercely oppose it and it discourages exports, which costs dollars.'),
    ['Farmers,0-(0.35*x)', 'Farmers_income,0-(0.15*x)', 'InternationalTrade,0-(0.12*x)', 'GDP,0-(0.04*x),4',
     'FoodPrice,0-(0.06*x)', 'Equality,0+(0.03*x)', 'Socialist,0+(0.08*x)', 'Capitalist,0-(0.10*x)'],
    slider='ar_retenciones', pc=(15, 10, 12, 6), impl=1, income=(0, 5000))

pol('AR_ImpuestoPAIS', 'TAX', 'world-dollar',
    ('Impuesto PAIS', 'Recargo a la compra de dólares, pasajes y consumos en el exterior. Junta recursos y frena la demanda de '
     'divisas, pero castiga a la clase media y agranda la brecha cambiaria.'),
    ('PAIS tax', 'A surcharge on buying dollars, plane tickets and spending abroad. It raises revenue and curbs demand for foreign '
     'currency, but hits the middle class and widens the exchange-rate gap.'),
    ['MiddleIncome,0-(0.12*x)', 'Wealthy,0-(0.05*x)', 'Tourism,0+(0.03*x)', 'TaxEvasion,0+(0.03*x)'],
    pc=(8, 5, 5, 3), impl=1, income=(0, 2500))

pol('AR_AcuerdoFMI', 'FOREIGNPOLICY', 'building-bank',
    ('Programa con el FMI', 'Acuerdo con el Fondo Monetario Internacional: desembolsos y respaldo a cambio de metas de déficit, '
     'emisión y reservas. Calma a los mercados, pero es impopular en buena parte del país.'),
    ('IMF program', 'An agreement with the International Monetary Fund: disbursements and backing in exchange for targets on the '
     'deficit, money printing and reserves. It calms markets but is unpopular with much of the country.'),
    ['ForeignRelations,0+(0.10*x)', 'Inflation,0-(0.10*x),6', 'Socialist,0-(0.25*x)', 'TradeUnionist,0-(0.12*x)',
     'Patriot,0-(0.08*x)', 'Capitalist,0+(0.12*x)', 'BusinessConfidence,0+(0.10*x)', 'ForeignInvestment,0+(0.06*x),4'],
    slider='ar_fmi', pc=(15, 10, 10, 8), impl=4, cost=(0, 0))

pol('AR_ControlPrecios', 'ECONOMY', 'shopping-cart',
    ('Control de precios', 'Acuerdos y congelamientos de precios en supermercados. Frena la inflación unos meses, pero genera '
     'faltantes, mercado negro y un rebote cuando se levanta.'),
    ('Price controls', 'Price agreements and freezes in supermarkets. They slow inflation for a few months, but cause shortages, a '
     'black market and a rebound when lifted.'),
    ['Inflation,0-(0.10*x),2', 'Inflation,0+(0.06*x),10', 'BusinessConfidence,0-(0.12*x)', 'BlackMarket,0+(0.08*x)',
     'Poor,0+(0.06*x)', 'Capitalist,0-(0.15*x)', 'SelfEmployed,0-(0.08*x)', 'FoodPrice,0-(0.08*x)'],
    pc=(8, 6, 4, 4), impl=1, cost=(20, 120))

pol('AR_RIGI', 'ECONOMY', 'diamond',
    ('Régimen de incentivo a grandes inversiones', 'Beneficios impositivos, aduaneros y cambiarios por décadas para proyectos de más de '
     'doscientos millones de dólares en energía, minería e infraestructura.'),
    ('Large investment incentive regime (RIGI)', 'Decades-long tax, customs and currency benefits for projects over two hundred million '
     'dollars in energy, mining and infrastructure.'),
    ['ForeignInvestment,0+(0.25*x),4', 'Capitalist,0+(0.15*x)', 'Environmentalist,0-(0.15*x)', 'Socialist,0-(0.10*x)',
     'Pollution,0+(0.04*x),6', 'GDP,0+(0.03*x),8', 'Unemployment,0-(0.02*x),8'],
    pc=(12, 10, 6, 6), impl=3, cost=(50, 400))

pol('AR_VacaMuerta', 'ECONOMY', 'gas-station',
    ('Desarrollo de Vaca Muerta', 'Inversión pública y oleoductos para explotar la segunda reserva de gas no convencional del mundo. '
     'Puede dar vuelta la balanza energética y traer dólares, a costa del ambiente.'),
    ('Vaca Muerta development', 'Public investment and pipelines to exploit the world\'s second-largest shale gas reserve. It can '
     'turn around the energy balance and bring in dollars, at an environmental cost.'),
    ['OilSupply,0+(0.15*x),8', 'GDP,0+(0.04*x),8', 'Unemployment,0-(0.03*x),6', 'Environmentalist,0-(0.20*x)',
     'CO2Emissions,0+(0.05*x),6', 'Pollution,0+(0.04*x),6', 'Capitalist,0+(0.08*x)', 'Patriot,0+(0.06*x)'],
    pc=(10, 8, 6, 6), impl=6, cost=(100, 900))

pol('AR_Litio', 'ECONOMY', 'pick',
    ('Explotación de litio', 'Promoción de la minería de litio en la Puna. Atrae inversión y exportaciones, pero preocupa a '
     'comunidades y ambientalistas por el uso del agua.'),
    ('Lithium mining', 'Promotion of lithium mining in the Puna highlands. It attracts investment and exports, but worries local '
     'communities and environmentalists about water use.'),
    ['ForeignInvestment,0+(0.08*x),4', 'Environmentalist,0-(0.12*x)', 'Technology,0+(0.03*x),8', 'GDP,0+(0.02*x),8',
     'Watershortage,0+(0.03*x),8'],
    pc=(8, 6, 4, 4), impl=4, cost=(30, 200))

pol('AR_Coparticipacion', 'PUBLICSERVICES', 'chart-pie',
    ('Transferencias discrecionales a provincias', 'Fondos que el gobierno nacional reparte a gobernadores por fuera de la '
     'coparticipación. Compran apoyo en el Congreso y gobernabilidad, pero alientan el clientelismo.'),
    ('Discretionary transfers to provinces', 'Money the national government hands to governors outside the federal tax-sharing '
     'scheme. It buys support in Congress and stability, but encourages patronage.'),
    ['Corruption,0+(0.06*x)', 'Stability,0+(0.06*x)', 'Equality,0+(0.03*x)', '_All_,0+(0.02*x)'],
    pc=(5, 10, 3, 3), impl=1, cost=(100, 1200))

pol('AR_SubsidiosEnergia', 'WELFARE', 'bulb',
    ('Subsidios a la luz y el gas', 'El Estado paga parte de las tarifas. Alivia a los hogares y contiene la inflación, pero cuesta '
     'una fortuna, desalienta el ahorro y la inversión y termina en cortes de luz.'),
    ('Energy subsidies', 'The state pays part of electricity and gas bills. It helps households and holds down inflation, but it costs a '
     'fortune, discourages saving and investment and ends in blackouts.'),
    ['Poor,0+(0.12*x)', 'MiddleIncome,0+(0.12*x)', 'Inflation,0-(0.05*x)', 'EnergyEfficiency,0-(0.10*x)',
     'PowerBlackouts,0+(0.08*x),8', 'OilSupply,0-(0.05*x),8', 'Environmentalist,0-(0.06*x)', 'CO2Emissions,0+(0.03*x)'],
    slider='ar_subsidios', pc=(8, 18, 4, 12), impl=1, cost=(200, 2500))

pol('AR_SubsidiosTransporte', 'TRANSPORT', 'bus',
    ('Subsidios al transporte', 'Boletos de colectivo y tren baratos gracias a fondos nacionales, concentrados en el Área '
     'Metropolitana. Alivian a los trabajadores, pero el interior protesta.'),
    ('Public transport subsidies', 'Cheap bus and train fares paid with national funds, concentrated in Greater Buenos Aires. They '
     'help workers, but the provinces complain.'),
    ['Poor,0+(0.08*x)', 'RailUsage,0+(0.05*x)', 'CarUsage,0-(0.04*x)', 'TrafficCongestion,0-(0.03*x)',
     'Inflation,0-(0.02*x)', 'Farmers,0-(0.03*x)'],
    pc=(6, 12, 4, 8), impl=1, cost=(100, 900))

pol('AR_Moratoria', 'WELFARE', 'calendar-plus',
    ('Moratoria previsional', 'Permite jubilarse a quienes no completaron los años de aportes, en general mujeres y trabajadores '
     'informales. Amplía la cobertura, pero pesa sobre el sistema.'),
    ('Pension amnesty', 'Lets people retire without the full years of contributions, mostly women and informal workers. It expands '
     'coverage, but strains the system.'),
    ['Retired,0+(0.20*x)', 'Poor,0+(0.06*x)', 'Equality,0+(0.03*x)', 'GenderEquality,0+(0.04*x)',
     'Capitalist,0-(0.06*x)', 'Conservatives,0-(0.04*x)'],
    pc=(8, 15, 5, 8), impl=2, cost=(100, 1000))

pol('AR_MovilidadJubilatoria', 'WELFARE', 'old',
    ('Movilidad jubilatoria', 'La fórmula que actualiza las jubilaciones. Si queda por debajo de la inflación, los jubilados pierden; '
     'si es generosa, el gasto se dispara.'),
    ('Pension indexation', 'The formula that updates pensions. If it lags inflation, pensioners lose; if it is generous, spending '
     'soars.'),
    ['Retired,-0.25+(0.45*x)', 'Poor,-0.05+(0.10*x)', 'Inflation,0+(0.04*x)', 'Socialist,-0.05+(0.10*x)'],
    slider='ar_movilidad', pc=(10, 20, 6, 14), impl=1, cost=(300, 2500))

pol('AR_PlanesSociales', 'WELFARE', 'heart-handshake',
    ('Planes sociales', 'Programas de empleo y ayuda directa administrados en parte por organizaciones sociales. Contienen la pobreza '
     'extrema y la conflictividad, pero tienen mala imagen en la clase media.'),
    ('Social programs', 'Work-for-welfare and cash programs partly run by grassroots organisations. They hold down extreme poverty and '
     'unrest, but have a poor image among the middle class.'),
    ['Poor,0+(0.18*x)', 'ExtremePoverty,0-(0.12*x),3', 'Unemployment,0+(0.02*x)', 'Corruption,0+(0.04*x)',
     'MiddleIncome,0-(0.06*x)', 'Capitalist,0-(0.06*x)', 'Socialist,0+(0.10*x)'],
    pc=(8, 15, 5, 8), impl=1, cost=(100, 1500))

pol('AR_ProtocoloAntipiquetes', 'LAWANDORDER', 'barrier-block',
    ('Protocolo antipiquetes', 'Las fuerzas federales despejan los cortes de calles y rutas sin orden judicial. Ordena el tránsito '
     'y gusta a parte de la clase media, pero choca con sindicatos, organizaciones sociales y organismos de derechos humanos.'),
    ('Anti-roadblock protocol', 'Federal forces clear street and road blockades without a court order. It restores traffic and pleases '
     'part of the middle class, but clashes with unions, grassroots groups and human rights organisations.'),
    ['TrafficCongestion,0-(0.05*x)', 'Liberal,0-(0.15*x)', 'Socialist,0-(0.20*x)', 'TradeUnionist,0-(0.12*x)',
     'Conservatives,0+(0.12*x)', 'MiddleIncome,0+(0.05*x)', 'Democracy,0-(0.04*x)', 'Stability,0+(0.03*x)'],
    pc=(10, 8, 6, 6), impl=1, cost=(10, 80))

pol('AR_ReformaLaboral', 'ECONOMY', 'tool',
    ('Reforma laboral', 'Cambios a la Ley de Contrato de Trabajo: indemnizaciones, período de prueba y convenios por empresa. '
     'Los empresarios la piden hace décadas; la CGT la considera una línea roja.'),
    ('Labour reform', 'Changes to the employment contract law: severance pay, probation periods and company-level agreements. '
     'Employers have asked for it for decades; the unions see it as a red line.'),
    ['Unemployment,0-(0.06*x),6', 'BusinessConfidence,0+(0.10*x)', 'TradeUnionist,0-(0.35*x)', 'Capitalist,0+(0.15*x)',
     'SelfEmployed,0+(0.10*x)', 'Wages,0-(0.04*x)', 'Equality,0-(0.04*x)', 'Socialist,0-(0.12*x)', 'GigEconomy,0+(0.05*x)'],
    slider='ar_reformalab', pc=(20, 15, 15, 10), impl=3, cost=(0, 0))

pol('AR_ModeloSindical', 'ECONOMY', 'flag',
    ('Aportes sindicales y obras sociales', 'Cuota sindical obligatoria y manejo de las obras sociales por los gremios. Sostiene el '
     'poder de la CGT, que a cambio garantiza paz social o la quita.'),
    ('Union dues and health funds', 'Compulsory union dues and union control of health insurance funds. It sustains the power of the '
     'labour federation, which in return grants or withholds social peace.'),
    ['TradeUnionist,0+(0.30*x)', 'Capitalist,0-(0.10*x)', 'Corruption,0+(0.04*x)', 'Wages,0+(0.04*x)',
     'Unemployment,0+(0.02*x),6'],
    pc=(10, 25, 6, 15), impl=1, cost=(0, 0))

pol('AR_Monotributo', 'TAX', 'id-badge-2',
    ('Monotributo', 'Régimen simplificado para pequeños contribuyentes: una cuota fija que incluye impuestos, jubilación y obra '
     'social. Cuanto más generoso, más gente sale de la informalidad.'),
    ('Simplified tax regime ("monotributo")', 'A simplified scheme for small taxpayers: one flat payment covering taxes, pension and '
     'health insurance. The more generous it is, the more people leave the informal economy.'),
    ['SelfEmployed,0+(0.15*x)', 'TaxEvasion,0-(0.08*x)', 'GigEconomy,0+(0.05*x)', 'Unemployment,0-(0.02*x)'],
    pc=(5, 10, 3, 3), impl=1, income=(200, 1500))

pol('AR_BienesPersonales', 'TAX', 'home-dollar',
    ('Bienes Personales', 'Impuesto anual al patrimonio. Lo pagan los que más tienen, pero también empuja a sacar los ahorros del '
     'país o a esconderlos.'),
    ('Wealth tax ("Bienes Personales")', 'An annual tax on personal wealth. The richest pay it, but it also pushes savings out of the '
     'country or into hiding.'),
    ['Wealthy,0-(0.25*x)', 'Equality,0+(0.05*x)', 'TaxEvasion,0+(0.06*x)', 'Capitalist,0-(0.10*x)', 'Socialist,0+(0.10*x)',
     'BrainDrain,0+(0.03*x)'],
    pc=(8, 6, 6, 4), impl=1, income=(200, 2500))

pol('AR_UniversidadPublica', 'PUBLICSERVICES', 'certificate',
    ('Universidad pública y gratuita', 'Financiamiento de las universidades nacionales, gratuitas y con ingreso irrestricto. Una '
     'tradición argentina que moviliza a cientos de miles cuando se la recorta.'),
    ('Free public universities', 'Funding for national universities, free and open to all. An Argentine tradition that brings hundreds '
     'of thousands onto the streets whenever it is cut.'),
    ['Education,0+(0.12*x),6', 'Young,0+(0.20*x)', 'Liberal,0+(0.10*x)', 'Socialist,0+(0.06*x)', 'Technology,0+(0.04*x),8',
     'BrainDrain,0-(0.05*x)', 'Equality,0+(0.03*x)'],
    pc=(8, 25, 5, 15), impl=2, cost=(200, 1500))

pol('AR_CONICET', 'PUBLICSERVICES', 'microscope',
    ('CONICET y ciencia', 'Becas y salarios para investigadores del sistema científico nacional. Retiene talento y genera '
     'tecnología a largo plazo.'),
    ('National science council (CONICET)', 'Grants and salaries for researchers in the national science system. It keeps talent at '
     'home and produces technology in the long run.'),
    ['Technology,0+(0.10*x),8', 'BrainDrain,0-(0.10*x)', 'Liberal,0+(0.08*x)', 'Young,0+(0.04*x)', 'GDP,0+(0.02*x),12'],
    pc=(6, 12, 4, 6), impl=2, cost=(100, 800))

pol('AR_ReclamoMalvinas', 'FOREIGNPOLICY', 'map-pin',
    ('Cuestión Malvinas', 'La estrategia frente al reclamo de soberanía sobre las islas Malvinas, Georgias y Sandwich del Sur. '
     'Unir al país detrás de la causa o priorizar la relación con las potencias.'),
    ('Malvinas/Falklands question', 'The strategy on the sovereignty claim over the Malvinas/Falklands, South Georgia and South '
     'Sandwich Islands: rallying the country behind the cause or prioritising relations with the great powers.'),
    ['Patriot,-0.10+(0.30*x)', 'ForeignRelations,0.05-(0.25*x)', 'ForeignInvestment,0-(0.06*x)', 'Liberal,0.05-(0.10*x)'],
    slider='ar_malvinas', pc=(6, 6, 6, 6), impl=1, cost=(5, 50))

pol('AR_Mercosur', 'FOREIGNPOLICY', 'world-share',
    ('Mercosur y apertura comercial', 'Cuánto se abre la economía: aranceles, el bloque con Brasil y el acuerdo con la Unión Europea. '
     'Al campo le conviene abrir; a la industria protegida, no.'),
    ('Mercosur and trade opening', 'How open the economy is: tariffs, the bloc with Brazil and the agreement with the European Union. '
     'Farmers gain from opening up; protected industry does not.'),
    ['InternationalTrade,0+(0.15*x),4', 'Farmers,0+(0.12*x)', 'Unemployment,0+(0.03*x),6', 'TradeUnionist,0-(0.10*x)',
     'Capitalist,0+(0.06*x)', 'FoodPrice,0-(0.03*x)', 'GDP,0+(0.03*x),8'],
    slider='ar_mercosur', pc=(10, 10, 8, 8), impl=3, cost=(0, 0))

pol('AR_Dolarizacion', 'ECONOMY', 'currency-dollar',
    ('Dolarización', 'Reemplazar el peso por el dólar estadounidense. Termina con la emisión y la inflación de raíz, pero el país '
     'pierde la política monetaria y el Banco Central necesita dólares que no tiene.'),
    ('Dollarisation', 'Replace the peso with the US dollar. It ends money printing and inflation at the root, but the country loses '
     'monetary policy and the central bank needs dollars it does not have.'),
    ['Inflation,0-(0.45*x),6', 'Patriot,0-(0.20*x)', 'Socialist,0-(0.25*x)', 'Capitalist,0+(0.15*x)', 'StateEmployees,0-(0.10*x)',
     'Unemployment,0+(0.04*x),4', 'BusinessConfidence,0+(0.10*x),6', 'CurrencyStrength,0+(0.30*x),4'],
    pc=(40, 40, 20, 20), impl=8, cost=(50, 300), opposites='AR_EmisionTesoro')

pol('AR_FichaLimpia', 'LAWANDORDER', 'user-x',
    ('Ficha Limpia', 'Prohíbe ser candidatos a quienes tengan una condena por corrupción confirmada en segunda instancia.'),
    ('Clean record law ("Ficha Limpia")', 'Bars anyone with a corruption conviction upheld on appeal from running for office.'),
    ['Corruption,0-(0.06*x),6', 'Democracy,0+(0.03*x)', 'Liberal,0+(0.05*x)', 'MiddleIncome,0+(0.06*x)'],
    pc=(10, 15, 5, 5), impl=2, cost=(5, 20))

pol('AR_Narcotrafico', 'LAWANDORDER', 'spy',
    ('Plan contra el narcotráfico', 'Desembarco de fuerzas federales, inteligencia criminal y control de los puertos del río Paraná, '
     'con Rosario como epicentro.'),
    ('Anti-drug trafficking plan', 'Deployment of federal forces, criminal intelligence and control of the Paraná river ports, with '
     'the city of Rosario at its centre.'),
    ['Organised Crime,0-(0.12*x),4', 'ViolentCrimeRate,0-(0.06*x),4', 'Conservatives,0+(0.08*x)', 'Liberal,0-(0.04*x)'],
    pc=(8, 12, 5, 6), impl=2, cost=(100, 900))

pol('AR_BonoNavidad', 'WELFARE', 'coins',
    ('Bonos de emergencia', 'Pagos extraordinarios a jubilados, beneficiarios de planes y trabajadores informales para atravesar '
     'una crisis. Muy populares, muy caros y a menudo financiados con emisión.'),
    ('Emergency bonuses', 'One-off payments to pensioners, welfare recipients and informal workers to get through a crisis. Very '
     'popular, very expensive and often paid for by printing money.'),
    ['Poor,0+(0.15*x)', 'Retired,0+(0.10*x)', 'ExtremePoverty,0-(0.06*x),2', 'Inflation,0+(0.04*x),2', 'Capitalist,0-(0.05*x)'],
    pc=(6, 8, 4, 4), impl=1, cost=(100, 1500))

POLICIES = P

# ---------------------------------------------------------------------------------------------
# Situaciones exclusivas de Argentina. Campos:
#   name, zone, icon, positive, start, stop, causes (incluye "_default_,v"), effects, es, en
# ---------------------------------------------------------------------------------------------
S = []
def sit(name, zone, icon, positive, start, stop, causes, effects, es, en, cost=(0, 0)):
    S.append(dict(name=name, zone=zone, icon=icon, positive=positive, start=start, stop=stop, causes=causes, effects=effects,
                  es=es, en=en, cost=cost))

sit('AR_BrechaCambiaria', 'ECONOMY', 'arrows-exchange', 0, 0.55, 0.40,
    ['_default_,0.35', 'AR_Cepo,0+(0.45*x)', 'AR_ImpuestoPAIS,0+(0.10*x)', 'AR_EmisionTesoro,0+(0.20*x)', 'Inflation,0+(0.30*x)',
     'CurrencyStrength,0-(0.20*x)', 'AR_Dolarizacion,0-(0.90*x)', 'AR_AcuerdoFMI,0-(0.08*x)'],
    ['TaxEvasion,0.04+(0.06*x)', 'ForeignInvestment,-0.06-(0.08*x)', 'BlackMarket,0.05+(0.08*x)', 'MiddleIncome,-0.04-(0.06*x)',
     'Capitalist,-0.04-(0.06*x)', 'Inflation,0.02+(0.04*x),3', 'GDP,-0.01-(0.02*x),4'],
    ('Brecha cambiaria', 'El dólar paralelo ("blue") vale mucho más que el oficial. Exportadores retienen la cosecha, importadores '
     'adelantan compras y los precios se acomodan al dólar más caro.'),
    ('Exchange-rate gap', 'The parallel ("blue") dollar trades far above the official rate. Exporters hold back their harvest, importers '
     'rush their purchases and prices adjust to the dearer dollar.'))

sit('AR_ReservasAgotadas', 'ECONOMY', 'building-bank', 0, 0.60, 0.42,
    ['_default_,0.55', 'AR_EmisionTesoro,0+(0.15*x)', 'AR_Retenciones,0+(0.08*x)', 'AR_SubsidiosEnergia,0+(0.06*x)',
     'AR_AcuerdoFMI,0-(0.22*x)', 'AR_VacaMuerta,0-(0.12*x)', 'AR_Litio,0-(0.06*x)', 'AR_RIGI,0-(0.08*x)', 'AR_Cepo,0-(0.05*x)',
     '_effectivedebt_,0+(0.15*x)', 'CurrencyStrength,0.20-(0.20*x)',
     'InternationalTrade,0-(0.20*x)', 'AR_SuperCosecha,0-(0.15*x)', 'AR_BoomEnergetico,0-(0.15*x)'],
    ['CurrencyStrength,-0.08-(0.10*x)', 'Inflation,0.03+(0.05*x),2', 'BusinessConfidence,-0.05-(0.06*x)', 'GDP,-0.01-(0.02*x),3',
     'Capitalist,-0.05-(0.05*x)'],
    ('Reservas agotadas', 'El Banco Central casi no tiene dólares propios. No puede defender el peso, no alcanza para importar '
     'energía ni insumos y cada vencimiento de deuda es una crisis.'),
    ('Depleted reserves', 'The central bank has almost no dollars of its own. It cannot defend the peso, cannot pay for energy and '
     'parts imports, and every debt payment becomes a crisis.'))

sit('AR_RiesgoPaisAlto', 'ECONOMY', 'chart-line', 0, 0.58, 0.40,
    ['_default_,0.30', '_effectivedebt_,0+(0.30*x)', 'AR_ReservasAgotadas,0+(0.20*x)', 'AR_EmisionTesoro,0+(0.10*x)',
     'AR_AcuerdoFMI,0-(0.15*x)', 'Stability,0-(0.15*x)', 'AR_ReclamoMalvinas,0+(0.04*x)', 'AR_EstabilidadMacro,0-(0.20*x)'],
    ['ForeignInvestment,-0.06-(0.08*x)', 'BusinessConfidence,-0.04-(0.06*x)', 'GDP,-0.01-(0.02*x),4', 'Capitalist,-0.04-(0.06*x)'],
    ('Riesgo país por las nubes', 'Los bonos argentinos rinden miles de puntos más que los de Estados Unidos. Nadie presta, las '
     'empresas no consiguen crédito y la deuda se vuelve impagable.'),
    ('Sky-high country risk', 'Argentine bonds yield thousands of basis points above US Treasuries. Nobody lends, companies cannot get '
     'credit and the debt becomes unpayable.'))

sit('AR_CorridaCambiaria', 'ECONOMY', 'trending-up', 0, 0.70, 0.45,
    ['_default_,0.15', 'AR_BrechaCambiaria,0+(0.35*x)', 'AR_ReservasAgotadas,0+(0.25*x)', 'Inflation,0+(0.20*x)',
     'AR_Cepo,0-(0.10*x)', 'AR_AcuerdoFMI,0-(0.10*x)', 'AR_EstabilidadMacro,0-(0.25*x)'],
    ['Inflation,0.05+(0.08*x)', 'GDP,-0.02-(0.03*x),2', 'MiddleIncome,-0.06-(0.06*x)', 'Wealthy,-0.03-(0.04*x)',
     'CurrencyStrength,-0.10-(0.10*x)', '_All_,-0.02-(0.03*x)'],
    ('Corrida cambiaria', 'Todos quieren dólares al mismo tiempo. El precio salta día a día, los comercios remarcan y el Banco Central '
     'quema reservas para frenar la estampida.'),
    ('Run on the peso', 'Everyone wants dollars at once. The price jumps day after day, shops mark up prices and the central bank '
     'burns reserves to stop the stampede.'))

sit('AR_Corralito', 'ECONOMY', 'lock', 0, 0.82, 0.50,
    ['_default_,0.05', 'AR_ReservasAgotadas,0+(0.30*x)', 'AR_RiesgoPaisAlto,0+(0.25*x)', 'AR_CorridaCambiaria,0+(0.30*x)',
     'AR_Dolarizacion,0+(0.10*x)', 'Stability,0-(0.10*x)'],
    ['MiddleIncome,-0.20-(0.15*x)', 'Wealthy,-0.10-(0.10*x)', 'Stability,-0.10-(0.10*x)', 'GDP,-0.04-(0.04*x),2',
     '_All_,-0.05-(0.05*x)', 'Retired,-0.08-(0.08*x)'],
    ('Corralito', 'Los bancos limitan los retiros de depósitos. Los ahorristas golpean las persianas de los bancos con cacerolas y '
     'la economía se paraliza.'),
    ('Bank freeze ("corralito")', 'Banks cap withdrawals of deposits. Savers bang pots on bank shutters and the economy grinds to a '
     'halt.'))

sit('AR_Default', 'FOREIGNPOLICY', 'alert-octagon', 0, 0.80, 0.45,
    ['_default_,0.05', 'AR_RiesgoPaisAlto,0+(0.40*x)', '_effectivedebt_,0+(0.25*x)', 'AR_ReservasAgotadas,0+(0.20*x)',
     'AR_AcuerdoFMI,0-(0.20*x)'],
    ['ForeignInvestment,-0.15-(0.10*x)', 'InternationalTrade,-0.05-(0.05*x)', 'ForeignRelations,-0.08-(0.07*x)',
     'GDP,-0.03-(0.03*x),3', 'Capitalist,-0.08-(0.07*x)'],
    ('Default', 'El país deja de pagar su deuda externa. Se corta el crédito internacional por años y empieza una larga '
     'renegociación con bonistas y fondos buitre.'),
    ('Sovereign default', 'The country stops paying its foreign debt. International credit is cut off for years and a long '
     'renegotiation with bondholders and holdout funds begins.'))

sit('AR_Piquetes', 'LAWANDORDER', 'speakerphone', 0, 0.60, 0.40,
    ['_default_,0.25', 'PovertyRate,0+(0.25*x)', 'Unemployment,0+(0.25*x)', 'AR_PlanesSociales,0-(0.12*x)',
     'AR_ProtocoloAntipiquetes,0-(0.15*x)', 'Inflation,0+(0.10*x)', 'AR_MovilidadJubilatoria,0-(0.05*x)'],
    ['TrafficCongestion,0.04+(0.05*x)', 'Stability,-0.03-(0.04*x)', 'MiddleIncome,-0.03-(0.04*x)', 'Tourism,-0.01-(0.02*x)',
     'Socialist,0.02+(0.02*x)'],
    ('Piquetes y cortes de calle', 'Organizaciones sociales y desocupados cortan rutas, puentes y avenidas todos los días para '
     'reclamar trabajo, comida y planes.'),
    ('Pickets and road blockades', 'Grassroots groups and the unemployed block roads, bridges and avenues every day to demand jobs, '
     'food and welfare.'))

sit('AR_ParoCGT', 'ECONOMY', 'flag', 0, 0.65, 0.45,
    ['_default_,0.20', 'AR_ReformaLaboral,0+(0.30*x)', 'AR_ModeloSindical,0-(0.15*x)', 'Inflation,0+(0.15*x)',
     'Unemployment,0+(0.10*x)', 'AR_AcuerdoFMI,0+(0.06*x)'],
    ['GDP,-0.02-(0.02*x)', 'TradeUnionist,0.03+(0.03*x)', 'Capitalist,-0.03-(0.03*x)', 'Stability,-0.02-(0.03*x)'],
    ('Paros generales de la CGT', 'La central obrera convoca a paros generales y movilizaciones. Transporte detenido, fábricas cerradas '
     'y un mensaje claro al gobierno.'),
    ('General strikes', 'The labour federation calls general strikes and mass marches. Transport stops, factories close and the '
     'government gets a clear message.'))

sit('AR_CrisisEnergetica', 'ECONOMY', 'bulb', 0, 0.60, 0.42,
    ['_default_,0.25', 'AR_SubsidiosEnergia,0+(0.25*x)', 'AR_VacaMuerta,0.20-(0.30*x)', 'AR_ReservasAgotadas,0+(0.10*x)',
     'OilSupply,0.15-(0.15*x)'],
    ['PowerBlackouts,0.05+(0.05*x)', 'GDP,-0.01-(0.02*x)', '_All_,-0.01-(0.02*x)', 'Inflation,0.01+(0.02*x)'],
    ('Crisis energética', 'Falta gas en invierno y luz en verano. El país importa barcos de gas a precio de oro y hay cortes '
     'programados para la industria.'),
    ('Energy crisis', 'Gas runs short in winter and power in summer. The country imports LNG cargoes at a fortune and industry '
     'faces scheduled cuts.'))

sit('AR_Grieta', 'WELFARE', 'arrows-horizontal', 0, 0.60, 0.42,
    ['_default_,0.40', 'Polarization,0+(0.30*x)', 'AR_ReclamoMalvinas,0-(0.05*x)', 'AR_ProtocoloAntipiquetes,0+(0.05*x)',
     'AR_PlanesSociales,0+(0.03*x)', 'AR_Coparticipacion,0-(0.05*x)'],
    ['Stability,-0.02-(0.03*x)', '_turnout,0.01+(0.02*x)', 'Democracy,-0.01-(0.02*x)'],
    ('La grieta', 'El país está partido en dos mitades que no se escuchan. Cada medida es una batalla y la mitad del electorado '
     'nunca te va a votar.'),
    ('"La grieta" (the great divide)', 'The country is split into two halves that do not listen to each other. Every measure is a '
     'battle and half the electorate will never vote for you.'))

sit('AR_SuperCosecha', 'ECONOMY', 'plant-2', 1, 0.60, 0.45,
    ['_default_,0.30', 'AR_Retenciones,0.25-(0.25*x)', 'AR_Mercosur,0+(0.10*x)', 'AR_BrechaCambiaria,0.08-(0.08*x)'],
    ['GDP,0.02+(0.02*x)', 'Farmers,0.06+(0.06*x)', 'InternationalTrade,0.03+(0.03*x)', 'CurrencyStrength,0.03+(0.04*x)'],
    ('Cosecha récord', 'Buen clima y buenos precios: la soja, el maíz y el trigo rinden como nunca y entran dólares por el puerto '
     'de Rosario.'),
    ('Record harvest', 'Good weather and good prices: soybeans, corn and wheat yield like never before and dollars pour in through '
     'the port of Rosario.'))

sit('AR_BoomEnergetico', 'ECONOMY', 'gas-station', 1, 0.62, 0.45,
    ['_default_,0.15', 'AR_VacaMuerta,0+(0.40*x)', 'AR_RIGI,0+(0.15*x)', 'AR_SubsidiosEnergia,0-(0.10*x)'],
    ['GDP,0.02+(0.03*x)', 'Unemployment,-0.01-(0.02*x)', 'CurrencyStrength,0.03+(0.04*x)', 'Capitalist,0.03+(0.03*x)'],
    ('Boom energético', 'Vaca Muerta produce a pleno. Argentina pasa de importar gas a exportar energía, y la balanza energética '
     'deja dólares por primera vez en años.'),
    ('Energy boom', 'Vaca Muerta is producing at full tilt. Argentina goes from importing gas to exporting energy, and the energy '
     'balance brings in dollars for the first time in years.'))

sit('AR_EstabilidadMacro', 'ECONOMY', 'scale', 1, 0.62, 0.48,
    ['_default_,0.10', 'Inflation,0.30-(0.30*x)', 'AR_BrechaCambiaria,0.20-(0.20*x)', 'AR_ReservasAgotadas,0.20-(0.20*x)',
     'AR_AcuerdoFMI,0+(0.08*x)', 'AR_EmisionTesoro,0.10-(0.20*x)', 'AR_Dolarizacion,0+(0.20*x)'],
    ['BusinessConfidence,0.05+(0.06*x)', 'ForeignInvestment,0.04+(0.05*x)', '_All_,0.02+(0.02*x)', 'MiddleIncome,0.03+(0.03*x)'],
    ('Estabilidad macroeconómica', 'Inflación baja, dólar quieto y reservas en alza. Por primera vez en mucho tiempo los argentinos '
     'pueden planificar a más de un mes.'),
    ('Macroeconomic stability', 'Low inflation, a steady dollar and rising reserves. For the first time in a long while, Argentines can '
     'plan more than a month ahead.'))

SITUATIONS = S

# ---------------------------------------------------------------------------------------------
# Eventos (con imagen). influences: "Fuente,fórmula" o "_random_,min,max"
# ---------------------------------------------------------------------------------------------
E = []
def ev(name, scene, influences, grudges, es, en):
    E.append(dict(name=name, scene=scene, influences=influences, grudges=grudges, es=es, en=en))

ev('AR_EvMundial', 'estadio', ['_random_,0,0.12'],
   [('_All_', 0.06, 0.80), ('Patriot', 0.05, 0.80), ('Young', 0.04, 0.80)],
   ('¡Argentina campeón del mundo!', 'La Selección gana el Mundial. Millones salen a festejar al Obelisco y en todo el país; '
    'por unas semanas nadie habla de la inflación.'),
   ('Argentina are world champions!', 'The national team wins the World Cup. Millions celebrate at the Obelisk and across the '
    'country; for a few weeks nobody talks about inflation.'))
ev('AR_EvSequia', 'seco', ['_random_,0,0.15', 'AR_Retenciones,0+(0.02*x)'],
   [('GDP', -0.03, 0.80), ('Farmers', -0.06, 0.80), ('AR_ReservasAgotadas', 0.08, 0.85)],
   ('Sequía histórica', 'La peor sequía en sesenta años arrasa la cosecha. Se pierden miles de millones de dólares en exportaciones.'),
   ('Historic drought', 'The worst drought in sixty years wipes out the harvest. Billions of dollars in exports are lost.'))
ev('AR_EvInundacion', 'agua', ['_random_,0,0.10', 'AR_ObraPublicaNacional,0.05-(0.05*x)'],
   [('_All_', -0.02, 0.75), ('Poor', -0.04, 0.75), ('GDP', -0.01, 0.70)],
   ('Inundaciones en el litoral', 'Lluvias extraordinarias desbordan ríos y arroyos. Miles de evacuados y barrios enteros bajo el agua.'),
   ('Floods in the north-east', 'Extraordinary rains burst rivers and streams. Thousands evacuated and whole neighbourhoods under water.'))
ev('AR_EvApagon', 'noche', ['_random_,0,0.06', 'AR_CrisisEnergetica,0+(0.20*x)', 'AR_SubsidiosEnergia,0+(0.04*x)'],
   [('_All_', -0.04, 0.70), ('MiddleIncome', -0.04, 0.70), ('GDP', -0.01, 0.60)],
   ('Apagón masivo', 'Una falla en la red deja sin luz a millones de personas en plena ola de calor. Los vecinos cortan calles '
    'con fogatas.'),
   ('Massive blackout', 'A grid failure leaves millions without power in the middle of a heatwave. Residents block streets with '
    'bonfires.'))
ev('AR_EvVisitaPapal', 'vaticano', ['_random_,0,0.06'],
   [('Religious', 0.08, 0.85), ('_All_', 0.02, 0.80), ('Poor', 0.03, 0.80)],
   ('El Papa visita la Argentina', 'Por primera vez desde su elección, el Papa argentino recorre el país. Multitudes en las calles y '
    'un mensaje sobre la pobreza que nadie puede ignorar.'),
   ('The Pope visits Argentina', 'For the first time since his election, the Argentine Pope tours the country. Huge crowds and a '
    'message about poverty no one can ignore.'))
ev('AR_EvEscandalo', 'corte', ['_random_,0,0.08', 'AR_EscandaloCorrupcion,0+(0.15*x)', 'AR_Coparticipacion,0+(0.04*x)'],
   [('_All_', -0.05, 0.80), ('MiddleIncome', -0.05, 0.80), ('Democracy', -0.02, 0.85)],
   ('Escándalo de corrupción', 'Una investigación periodística revela sobornos en la obra pública. Los cuadernos de un chofer anotan '
    'cada bolso con dinero.'),
   ('Corruption scandal', 'A newspaper investigation exposes bribes in public works. A driver\'s notebooks record every bag of cash.'))
ev('AR_EvLitio', 'mercadoBueno', ['_random_,0,0.06', 'AR_Litio,0+(0.12*x)'],
   [('ForeignInvestment', 0.04, 0.85), ('GDP', 0.01, 0.85), ('Environmentalist', -0.03, 0.80)],
   ('Megainversión en litio', 'Una minera internacional anuncia una inversión récord en un salar de la Puna.'),
   ('Lithium mega-investment', 'An international miner announces a record investment in a salt flat in the Puna.'))
ev('AR_EvTemporada', 'campo', ['_random_,0,0.10', 'AR_BrechaCambiaria,0+(0.06*x)'],
   [('Tourism', 0.04, 0.75), ('SelfEmployed', 0.03, 0.75), ('GDP', 0.01, 0.70)],
   ('Récord de turistas extranjeros', 'Con el país barato en dólares, llegan turistas de todo el mundo. Bariloche, Iguazú y '
    'Buenos Aires están llenos.'),
   ('Record foreign tourists', 'With the country cheap in dollars, tourists arrive from all over the world. Bariloche, Iguazú and '
    'Buenos Aires are packed.'))
ev('AR_EvSaqueos', 'fuego', ['_random_,0,0.03', 'AR_PerdidaPoderAdquisitivo,0+(0.15*x)', 'AR_SaltoCambiario,0+(0.10*x)', 'AR_PlanesSociales,0-(0.05*x)'],
   [('_All_', -0.05, 0.80), ('SelfEmployed', -0.06, 0.80), ('Stability', -0.05, 0.80)],
   ('Saqueos a supermercados', 'Con los precios disparados, grupos saquean supermercados en el conurbano, Rosario y Córdoba.'),
   ('Supermarket looting', 'With prices soaring, crowds loot supermarkets in Greater Buenos Aires, Rosario and Córdoba.'))
ev('AR_EvMarchaUniversitaria', 'calle', ['_random_,0,0.05', 'AR_UniversidadPublica,0.10-(0.10*x)'],
   [('Young', -0.05, 0.80), ('Liberal', -0.04, 0.80), ('Socialist', -0.03, 0.80)],
   ('Marcha federal universitaria', 'Cientos de miles de estudiantes, docentes y familias marchan en defensa de la universidad '
    'pública. Es una de las movilizaciones más grandes en décadas.'),
   ('Nationwide university march', 'Hundreds of thousands of students, lecturers and families march in defence of public universities. '
    'It is one of the largest protests in decades.'))
ev('AR_EvPremioCine', 'cine', ['_random_,0,0.05'],
   [('_All_', 0.02, 0.80), ('Liberal', 0.03, 0.80)],
   ('Una película argentina gana el Oscar', 'El cine nacional vuelve a ganar el premio a mejor película internacional.'),
   ('An Argentine film wins the Oscar', 'Argentine cinema wins the award for best international feature once again.'))
ev('AR_EvIncendios', 'bosque', ['_random_,0,0.07', 'AR_LeyGlaciares,0.04-(0.04*x)'],
   [('Environment', -0.03, 0.85), ('Environmentalist', -0.05, 0.80), ('Tourism', -0.02, 0.80)],
   ('Incendios en la Patagonia', 'El fuego avanza sobre bosques nativos de la cordillera. Brigadistas de todo el país combaten las '
    'llamas.'),
   ('Wildfires in Patagonia', 'Fire spreads through native forests in the Andes. Firefighters from across the country battle the '
    'flames.'))
ev('AR_EvRecordExportacion', 'puerto', ['_random_,0,0.05', 'AR_BoomEnergetico,0+(0.20*x)', 'AR_SuperCosecha,0+(0.15*x)'],
   [('CurrencyStrength', 0.04, 0.85), ('BusinessConfidence', 0.04, 0.85), ('GDP', 0.01, 0.80)],
   ('Exportaciones récord', 'El superávit comercial rompe récords: entran más dólares que en cualquier año de la historia.'),
   ('Record exports', 'The trade surplus breaks records: more dollars come in than in any year in history.'))
ev('AR_EvTrenes', 'tren', ['_random_,0,0.05', 'AR_SubsidiosTransporte,0.06-(0.06*x)'],
   [('_All_', -0.03, 0.75), ('Poor', -0.04, 0.75), ('Stability', -0.02, 0.75)],
   ('Accidente ferroviario', 'Un tren sin frenos choca en una estación cabecera. La falta de mantenimiento queda expuesta.'),
   ('Train crash', 'A train with failed brakes crashes into a terminal station. Years of poor maintenance are exposed.'))
ev('AR_EvCumbre', 'mundo', ['_random_,0,0.06', 'AR_AcuerdoEEUU,0+(0.06*x)'],
   [('ForeignRelations', 0.04, 0.85), ('ForeignInvestment', 0.02, 0.85)],
   ('Cumbre internacional en Buenos Aires', 'Jefes de Estado de todo el mundo llegan a Buenos Aires para una cumbre del G20.'),
   ('International summit in Buenos Aires', 'Heads of state from around the world arrive in Buenos Aires for a G20 summit.'))
EVENTS = E

# ---------------------------------------------------------------------------------------------
# Dilemas (sólo Argentina). options: [(grudges, título, texto), ...] en es y en
# ---------------------------------------------------------------------------------------------
D = []
def dil(name, influences, es, en, options):
    D.append(dict(name=name, influences=influences, es=es, en=en, options=options))

dil('AR_DilDeudaFMI', ['_random_,0,0.15', 'AR_ReservasAgotadas,0+(0.20*x)'],
    ('Vence la deuda con el FMI', 'Llega un vencimiento de miles de millones con el Fondo y las reservas no alcanzan.'),
    ('IMF debt payment due', 'A multi-billion payment to the Fund falls due and reserves are not enough.'),
    [([('AR_ReservasAgotadas', -0.06), ('Socialist', -0.04), ('Capitalist', 0.03), ('ForeignRelations', 0.03)],
      ('Refinanciar con un nuevo programa', 'La ministra de Economía: "Firmemos un nuevo acuerdo. Es amargo, pero evita el default."'),
      ('Refinance with a new program', 'The economy minister: "Let us sign a new agreement. It is bitter, but it avoids default."')),
     ([('AR_ReservasAgotadas', 0.08), ('Patriot', 0.04), ('Capitalist', -0.05), ('ForeignRelations', -0.05)],
      ('Pagar con reservas y no firmar nada', 'El jefe de Gabinete: "Pagamos con lo que tenemos. No vamos a entregar la soberanía."'),
      ('Pay with reserves and sign nothing', 'The chief of staff: "We pay with what we have. We will not hand over our sovereignty."'))])
dil('AR_DilParitarias', ['_random_,0,0.15', 'AR_PerdidaPoderAdquisitivo,0+(0.12*x)'],
    ('Paritarias en tensión', 'Los gremios piden aumentos por encima de la inflación. Las empresas dicen que no pueden pagar.'),
    ('Tense wage talks', 'Unions demand raises above inflation. Employers say they cannot pay.'),
    [([('TradeUnionist', 0.06), ('Inflation', 0.04), ('Capitalist', -0.04)],
      ('Homologar aumentos altos', 'El ministro de Trabajo: "Los salarios vienen perdiendo. Firmemos y evitemos el paro."'),
      ('Approve large raises', 'The labour minister: "Wages have been losing ground. Let us sign and avoid a strike."')),
     ([('TradeUnionist', -0.06), ('Inflation', -0.02), ('AR_ParoCGT', 0.06)],
      ('Poner un techo a los aumentos', 'La ministra de Economía: "Si convalidamos esto, la inflación no baja nunca."'),
      ('Cap wage increases', 'The economy minister: "If we approve this, inflation will never come down."'))])
dil('AR_DilTomaDeTierras', ['_random_,0,0.10', 'AR_PerdidaPoderAdquisitivo,0+(0.10*x)'],
    ('Toma de tierras', 'Miles de familias ocupan un predio en el conurbano. El dueño pide el desalojo inmediato.'),
    ('Land occupation', 'Thousands of families occupy a plot on the outskirts of Buenos Aires. The owner demands immediate eviction.'),
    [([('Conservatives', 0.05), ('Socialist', -0.05), ('Poor', -0.04)],
      ('Desalojar con fuerzas federales', 'El ministro de Seguridad: "La propiedad privada se respeta. Desalojamos hoy."'),
      ('Evict with federal forces', 'The security minister: "Private property must be respected. We evict today."')),
     ([('Poor', 0.05), ('Socialist', 0.04), ('Conservatives', -0.05), ('Capitalist', -0.03)],
      ('Negociar y urbanizar', 'La ministra de Desarrollo Social: "Ofrezcamos lotes con servicios. Nadie toma tierras por gusto."'),
      ('Negotiate and build housing', 'The social development minister: "Let us offer serviced plots. Nobody occupies land for fun."'))])
dil('AR_DilParoDocente', ['_random_,0,0.12', 'AR_UniversidadPublica,0.06-(0.06*x)'],
    ('Paro docente nacional', 'Los gremios docentes anuncian un paro por tiempo indeterminado. Las clases no empiezan.'),
    ('National teachers\' strike', 'Teachers\' unions announce an open-ended strike. The school year does not start.'),
    [([('Parents', 0.04), ('StateEmployees', 0.05), ('Education', 0.02), ('Inflation', 0.01)],
      ('Aumentar el fondo de incentivo docente', 'El ministro de Educación: "Sin docentes no hay país. Pongamos los fondos."'),
      ('Raise teacher pay from national funds', 'The education minister: "No teachers, no country. Let us put up the money."')),
     ([('Parents', -0.04), ('StateEmployees', -0.05), ('Conservatives', 0.03)],
      ('Descontar los días de paro', 'El jefe de Gabinete: "El que para, no cobra. Los chicos tienen que estar en el aula."'),
      ('Dock pay for strike days', 'The chief of staff: "No work, no pay. The children must be in the classroom."'))])
dil('AR_DilTarifazo', ['_random_,0,0.12', 'AR_SubsidiosEnergia,0+(0.10*x)'],
    ('Las distribuidoras exigen aumentos', 'Las empresas de energía dicen que sin tarifas actualizadas no pueden invertir.'),
    ('Utilities demand tariff increases', 'Energy companies say they cannot invest without updated tariffs.'),
    [([('MiddleIncome', -0.06), ('Poor', -0.04), ('AR_CrisisEnergetica', -0.06), ('Inflation', 0.03)],
      ('Autorizar el aumento', 'El secretario de Energía: "O pagamos la luz, o nos quedamos a oscuras."'),
      ('Approve the increase', 'The energy secretary: "Either we pay for power or we sit in the dark."')),
     ([('MiddleIncome', 0.04), ('AR_CrisisEnergetica', 0.06), ('Capitalist', -0.04)],
      ('Congelar las tarifas', 'El jefe de Gabinete: "Un tarifazo ahora sería un suicidio político."'),
      ('Freeze tariffs', 'The chief of staff: "A tariff hike now would be political suicide."'))])
dil('AR_DilHoldouts', ['_random_,0,0.08', 'AR_Default,0+(0.25*x)'],
    ('Fallo de un juez de Nueva York', 'Un tribunal de Nueva York ordena pagar el total a los fondos que no entraron al canje.'),
    ('A New York court ruling', 'A New York court orders full payment to the funds that rejected the debt swap.'),
    [([('ForeignInvestment', 0.04), ('Patriot', -0.05), ('Capitalist', 0.03)],
      ('Negociar y pagar', 'La ministra de Economía: "Pagar es caro, pero volvemos a los mercados."'),
      ('Negotiate and pay', 'The economy minister: "Paying is expensive, but we get back into the markets."')),
     ([('ForeignInvestment', -0.05), ('Patriot', 0.06), ('Socialist', 0.03)],
      ('Patria o buitres', 'El jefe de Gabinete: "No le vamos a pagar a los buitres lo que no pagan los demás acreedores."'),
      ('Homeland or vultures', 'The chief of staff: "We will not pay the vultures what other creditors did not get."'))])
dil('AR_DilCampo', ['_random_,0,0.10', 'AR_Retenciones,0+(0.15*x)'],
    ('El campo para', 'Las entidades rurales anuncian un lockout y cortan rutas contra las retenciones.'),
    ('Farmers strike', 'Rural associations announce a lockout and block highways against export duties.'),
    [([('Farmers', 0.08), ('Socialist', -0.04), ('AR_ReservasAgotadas', -0.03)],
      ('Bajar retenciones', 'El ministro de Agricultura: "Sin el campo no hay dólares. Hay que escucharlos."'),
      ('Lower export duties', 'The agriculture minister: "Without farmers there are no dollars. We have to listen."')),
     ([('Farmers', -0.08), ('Socialist', 0.04), ('Stability', -0.03)],
      ('Sostener la medida', 'La ministra de Economía: "No podemos ceder ante un lockout patronal."'),
      ('Hold firm', 'The economy minister: "We cannot give in to an employers\' lockout."'))])
dil('AR_DilMalvinas', ['_random_,0,0.06', 'AR_ReclamoMalvinas,0+(0.05*x)'],
    ('Exploración petrolera en Malvinas', 'Una empresa británica anuncia exploración de petróleo en aguas de Malvinas.'),
    ('Oil exploration off the Malvinas', 'A British company announces oil exploration in waters off the islands.'),
    [([('Patriot', 0.07), ('ForeignRelations', -0.05)],
      ('Sanciones a la empresa y reclamo en la ONU', 'El canciller: "Es nuestro territorio. Llevamos el caso a Naciones Unidas."'),
      ('Sanctions and a UN complaint', 'The foreign minister: "It is our territory. We take the case to the United Nations."')),
     ([('Patriot', -0.05), ('ForeignRelations', 0.04), ('ForeignInvestment', 0.02)],
      ('Protesta formal y cooperación', 'El vicecanciller: "Protestemos, pero sin romper puentes con Londres."'),
      ('Formal protest and cooperation', 'The deputy foreign minister: "We protest, but without burning bridges with London."'))])
dil('AR_DilDolarBlue', ['_random_,0,0.10', 'AR_BrechaCambiaria,0+(0.20*x)'],
    ('El dólar blue se dispara', 'El paralelo sube un 20 % en una semana y las cuevas no dan abasto.'),
    ('The blue dollar soars', 'The parallel dollar jumps 20% in a week and black-market exchange houses cannot keep up.'),
    [([('AR_BrechaCambiaria', -0.06), ('Inflation', 0.04), ('MiddleIncome', 0.02)],
      ('Devaluar el oficial', 'El presidente del Banco Central: "Hay que cerrar la brecha aunque duela."'),
      ('Devalue the official rate', 'The central bank governor: "We must close the gap even if it hurts."')),
     ([('AR_BrechaCambiaria', 0.05), ('BlackMarket', 0.04), ('Wealthy', -0.03)],
      ('Allanar las cuevas', 'El ministro de Seguridad: "Vamos contra los especuladores."'),
      ('Raid the black-market dealers', 'The security minister: "We are going after the speculators."'))])
dil('AR_DilNarcoRosario', ['_random_,0,0.10', 'AR_Narcotrafico,0.15-(0.15*x)'],
    ('Balaceras en Rosario', 'Las bandas narco amenazan al gobernador y atacan comercios. La ciudad vive con miedo.'),
    ('Shootings in Rosario', 'Drug gangs threaten the governor and attack shops. The city lives in fear.'),
    [([('Organised Crime', -0.06), ('Conservatives', 0.05), ('Liberal', -0.04)],
      ('Enviar al Ejército', 'La ministra de Seguridad: "Hace falta todo el poder del Estado."'),
      ('Send in the army', 'The security minister: "We need the full power of the state."')),
     ([('Organised Crime', -0.03), ('Liberal', 0.03), ('Conservatives', -0.03)],
      ('Inteligencia y lavado de dinero', 'El fiscal general: "Sigamos la plata, no sólo a los soldaditos."'),
      ('Intelligence and money laundering', 'The attorney general: "Follow the money, not just the foot soldiers."'))])
dil('AR_DilVeto', ['_random_,0,0.10', 'AR_MovilidadJubilatoria,0.08-(0.08*x)'],
    ('El Congreso aprueba un aumento a jubilados', 'La oposición sanciona una ley de movilidad generosa. ¿La vetás?'),
    ('Congress passes a pension rise', 'The opposition passes a generous pension law. Do you veto it?'),
    [([('Retired', -0.07), ('Capitalist', 0.04), ('Inflation', -0.02)],
      ('Vetar la ley', 'La ministra de Economía: "No hay plata. El equilibrio fiscal no se negocia."'),
      ('Veto the bill', 'The economy minister: "There is no money. Fiscal balance is not negotiable."')),
     ([('Retired', 0.07), ('Inflation', 0.03), ('AR_RiesgoPaisAlto', 0.04)],
      ('Promulgarla', 'El jefe de Gabinete: "No podemos pelearnos con los jubilados en año electoral."'),
      ('Sign it into law', 'The chief of staff: "We cannot fight pensioners in an election year."'))])
dil('AR_DilGobernadores', ['_random_,0,0.12'],
    ('Los gobernadores piden fondos', 'Un grupo de gobernadores condiciona sus votos en el Congreso a recibir obras y transferencias.'),
    ('Governors demand funds', 'A group of provincial governors make their votes in Congress conditional on public works and transfers.'),
    [([('Corruption', 0.03), ('Stability', 0.04), ('Capitalist', -0.02)],
      ('Firmar los acuerdos', 'El ministro del Interior: "Con los votos de las provincias sacamos las leyes."'),
      ('Sign the deals', 'The interior minister: "With the provinces\' votes we get our laws through."')),
     ([('Corruption', -0.02), ('Stability', -0.04), ('MiddleIncome', 0.02)],
      ('Negarse', 'La ministra de Economía: "Se terminó la caja política."'),
      ('Refuse', 'The economy minister: "The political slush fund is over."'))])
dil('AR_DilSubsidioColectivo', ['_random_,0,0.08', 'AR_SubsidiosTransporte,0+(0.08*x)'],
    ('Paro de colectivos', 'Las empresas de transporte dejan de circular: dicen que los subsidios no alcanzan para pagar sueldos.'),
    ('Bus strike', 'Bus companies stop running: they say subsidies do not cover wages.'),
    [([('Poor', 0.03), ('Inflation', 0.01), ('Farmers', -0.02)],
      ('Pagar más subsidios', 'El secretario de Transporte: "Millones no pueden ir a trabajar."'),
      ('Pay more subsidies', 'The transport secretary: "Millions cannot get to work."')),
     ([('Poor', -0.04), ('Inflation', 0.02), ('Capitalist', 0.02)],
      ('Liberar el boleto', 'La ministra de Economía: "Que el precio refleje el costo."'),
      ('Free up fares', 'The economy minister: "Let fares reflect the real cost."'))])
dil('AR_DilFutbol', ['_random_,0,0.06'],
    ('Sociedades anónimas deportivas', 'Un grupo inversor ofrece comprar un club grande si se permiten las sociedades anónimas en el fútbol.'),
    ('Football clubs as companies', 'An investor group offers to buy a big club if football clubs may become private companies.'),
    [([('Capitalist', 0.04), ('Patriot', -0.04), ('Young', -0.03)],
      ('Habilitarlas', 'El ministro de Deporte: "Los clubes necesitan capital para competir."'),
      ('Allow it', 'The sports minister: "Clubs need capital to compete."')),
     ([('Capitalist', -0.03), ('Patriot', 0.04), ('Young', 0.03)],
      ('Los clubes son de los socios', 'El jefe de Gabinete: "No vamos a tocar el corazón del fútbol argentino."'),
      ('Clubs belong to their members', 'The chief of staff: "We will not touch the heart of Argentine football."'))])
dil('AR_DilAborto', ['_random_,0,0.05'],
    ('Proyecto para derogar la ley del aborto', 'Diputados oficialistas proponen derogar la interrupción voluntaria del embarazo.'),
    ('Bill to repeal the abortion law', 'Governing-party deputies propose repealing the law on voluntary termination of pregnancy.'),
    [([('Religious', 0.06), ('Conservatives', 0.05), ('Liberal', -0.07), ('Young', -0.05)],
      ('Apoyar la derogación', 'El secretario de Culto: "Defendamos la vida desde la concepción."'),
      ('Back the repeal', 'The religious affairs secretary: "Let us defend life from conception."')),
     ([('Religious', -0.05), ('Conservatives', -0.03), ('Liberal', 0.05), ('Young', 0.04)],
      ('Rechazar el proyecto', 'La ministra de la Mujer: "Es un derecho conquistado en las calles."'),
      ('Reject the bill', 'The women\'s affairs minister: "It is a right won on the streets."'))])
dil('AR_DilEmisionFinDeAnio', ['_random_,0,0.10', 'AR_EmisionTesoro,0.05-(0.05*x)'],
    ('Aguinaldos sin fondos', 'En diciembre faltan pesos para pagar aguinaldos a estatales y jubilados.'),
    ('No money for year-end bonuses', 'In December there are not enough pesos to pay the thirteenth-month bonus to state workers and pensioners.'),
    [([('Inflation', 0.05), ('StateEmployees', 0.03), ('Retired', 0.03)],
      ('Pedirle pesos al Banco Central', 'El jefe de Gabinete: "Se paga. Después vemos."'),
      ('Ask the central bank for pesos', 'The chief of staff: "We pay. We will deal with it later."')),
     ([('StateEmployees', -0.06), ('Retired', -0.05), ('Inflation', -0.01)],
      ('Pagar en cuotas', 'La ministra de Economía: "No vamos a emitir. Se paga en dos cuotas."'),
      ('Pay in instalments', 'The economy minister: "We will not print money. It will be paid in two instalments."'))])
DILEMMAS = D

# ---------------------------------------------------------------------------------------------
# País: textos
# ---------------------------------------------------------------------------------------------
COUNTRY_TEXT = {
    'es': {
        'guiname': 'República Argentina (diciembre de 2023)',
        'jobtitle': 'Presidente',
        'description': ('10 de diciembre de 2023: asumís la Presidencia. Argentina tiene recursos de sobra (la pampa húmeda, '
                        'Vaca Muerta, litio y una población educada), pero recibís reservas negativas, una inflación del 25 % '
                        'mensual, cepo, déficit, la mitad del país bajo la línea de pobreza y un Congreso en contra. En los años '
                        'que vienen te esperan el FMI, la CGT, los vetos, los mercados y un mundo en guerra. ¿Podés con la Argentina?'),
        'stats': [('Lema', 'En unión y libertad'), ('Himno', 'Himno Nacional Argentino'), ('Población', '46 millones (2023)'),
                  ('Superficie', '2.780.400 km² (continental)'), ('Moneda', 'Peso argentino (ARS)'),
                  ('PBI', 'US$ 640.000 millones (2023)'), ('Inflación', '211 % anual (2023)'), ('Pobreza', '41,7 % (2023)'),
                  ('Capital', 'Buenos Aires'), ('Ciudad más grande', 'Buenos Aires'), ('Dificultad', 'Muy alta')],
    },
    'en': {
        'guiname': 'Argentine Republic (December 2023)',
        'jobtitle': 'President',
        'description': ('10 December 2023: you take office. Argentina has resources to spare (the fertile Pampas, Vaca Muerta '
                        'shale, lithium and an educated population), but you inherit negative reserves, 25% monthly inflation, '
                        'currency controls, a deficit, half the country below the poverty line and a hostile Congress. Ahead lie the '
                        'IMF, the unions, vetoes, the markets and a world at war. Can you govern Argentina?'),
        'stats': [('Motto', 'In union and liberty'), ('National Anthem', 'Argentine National Anthem'),
                  ('Population', '46 million (2023)'), ('Area', '2,780,400 km2 (mainland)'), ('Currency', 'Argentine peso (ARS)'),
                  ('GDP', 'US$640 billion (2023)'), ('Inflation', '211% a year (2023)'), ('Poverty', '41.7% (2023)'),
                  ('Capital', 'Buenos Aires'), ('Largest City', 'Buenos Aires'), ('Difficulty', 'Very hard')],
    },
}

NAMES = {
    'maleforenames': ['Agustín', 'Alberto', 'Alejandro', 'Andrés', 'Ariel', 'Bautista', 'Benjamín', 'Carlos', 'Claudio', 'Cristian',
                      'Daniel', 'Diego', 'Eduardo', 'Emiliano', 'Esteban', 'Facundo', 'Federico', 'Fernando', 'Franco', 'Gabriel',
                      'Gastón', 'Gonzalo', 'Guillermo', 'Gustavo', 'Hernán', 'Horacio', 'Ignacio', 'Javier', 'Joaquín', 'Jorge',
                      'José', 'Juan', 'Julián', 'Leandro', 'Lautaro', 'Lucas', 'Luciano', 'Marcelo', 'Mariano', 'Martín',
                      'Matías', 'Maximiliano', 'Nahuel', 'Nicolás', 'Pablo', 'Ramiro', 'Raúl', 'Ricardo', 'Rodrigo', 'Santiago',
                      'Sebastián', 'Sergio', 'Tomás', 'Valentín'],
    'femaleforenames': ['Agustina', 'Alejandra', 'Ana', 'Andrea', 'Antonella', 'Camila', 'Carla', 'Carolina', 'Catalina',
                        'Cecilia', 'Claudia', 'Constanza', 'Daniela', 'Delfina', 'Florencia', 'Gabriela', 'Graciela', 'Jimena',
                        'Josefina', 'Julieta', 'Laura', 'Lucía', 'Luciana', 'Malena', 'Marcela', 'María', 'Mariana', 'Martina',
                        'Micaela', 'Milagros', 'Mónica', 'Natalia', 'Noelia', 'Paula', 'Romina', 'Silvina', 'Sofía', 'Valentina',
                        'Valeria', 'Victoria', 'Ximena', 'Yamila'],
    'surnames': ['Acosta', 'Aguirre', 'Álvarez', 'Benítez', 'Bianchi', 'Cabrera', 'Castro', 'Díaz', 'Domínguez', 'Fernández',
                 'Ferrari', 'Flores', 'Gallo', 'García', 'Giménez', 'Gómez', 'González', 'Gutiérrez', 'Herrera', 'Juárez',
                 'López', 'Martínez', 'Medina', 'Molina', 'Morales', 'Moreno', 'Muñoz', 'Núñez', 'Ojeda', 'Pereyra', 'Pérez',
                 'Quiroga', 'Ramírez', 'Ríos', 'Rodríguez', 'Rojas', 'Romero', 'Rossi', 'Ruiz', 'Sánchez', 'Sosa', 'Suárez',
                 'Torres', 'Vázquez', 'Villalba', 'Ferreyra', 'Ledesma', 'Coria'],
}


# ---------------------------------------------------------------------------------------------
# Valores iniciales de las políticas propias en el escenario 2023 (las no listadas arrancan sin implementar)
# ---------------------------------------------------------------------------------------------
START_2023 = {'AR_Cepo': 1.0, 'AR_EmisionTesoro': 0.8, 'AR_Retenciones': 0.75, 'AR_ImpuestoPAIS': 0.6, 'AR_AcuerdoFMI': 0.5,
              'AR_ControlPrecios': 0.4, 'AR_Coparticipacion': 0.6, 'AR_SubsidiosEnergia': 0.67, 'AR_SubsidiosTransporte': 0.7,
              'AR_Moratoria': 0.6, 'AR_MovilidadJubilatoria': 0.33, 'AR_PlanesSociales': 0.6, 'AR_ModeloSindical': 0.8,
              'AR_Monotributo': 0.5, 'AR_BienesPersonales': 0.5, 'AR_UniversidadPublica': 0.6, 'AR_CONICET': 0.5,
              'AR_ReclamoMalvinas': 0.5, 'AR_Mercosur': 0.0, 'AR_VacaMuerta': 0.4, 'AR_Litio': 0.3,
              'AR_Narcotrafico': 0.3, 'AR_BonoNavidad': 0.3}

# Ampliación 2024-2026 (políticas, situaciones encadenadas, eventos, dilemas y enlaces causales)
import sys as _sys
_mod = _sys.modules[__name__]
import content_ext as _ext
_ext.extend(_mod)
CHAIN_OVERRIDES = _ext.CHAIN_OVERRIDES
START_2026 = _ext.START_2026

# Contenido internacional (política exterior, crisis globales, eventos y dilemas del mundo)
import content_intl as _intl
_intl.extend(_mod)

# Interacciones con las políticas que ya trae Democracy 4
import content_base as _base
_base.extend(_mod)

# Un solo país: la Argentina de diciembre de 2023. La configuración de 2026 se conserva sólo como referencia para
# simulate.py (comprobar que aplicando las políticas de 2024-2026 el modelo llega a algo parecido a la realidad).
REFERENCIA_2026 = START_2026
