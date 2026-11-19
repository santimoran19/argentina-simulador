# -*- coding: utf-8 -*-
"""Contenido internacional: política exterior, crisis globales encadenadas con la economía argentina,
eventos y dilemas del mundo, y el escenario "Argentina 2026: tormenta global".

Las crisis globales (situaciones con trigger='evento') arrancan cuando un evento las dispara con CreateGrudge, y se
apagan solas a medida que el impulso decae. Cada evento también aplica su golpe directo sobre la economía, así el shock
se siente aunque la situación tarde en activarse.

Contexto real (nov-2026): conflicto en Medio Oriente con cierre parcial del estrecho de Ormuz y Brent de hasta
US$ 120; la Fed volvió a subir tasas (3,75-4 %); aranceles de EE.UU. al acero y aluminio; acuerdo Mercosur-UE firmado en
enero de 2026; producción récord de petróleo en Argentina (973.700 barriles diarios).
"""


def extend(C):
    pol, sit, ev, dil = C.pol, C.sit, C.ev, C.dil

    C.SLIDERS.update({
        'ar_ucrania': {'es': ['Neutralidad', 'Apoyo diplomático a Ucrania', 'Apoyo activo y sanciones a Rusia'],
                       'en': ['Neutrality', 'Diplomatic support for Ukraine', 'Active support and sanctions on Russia']},
        'ar_israel': {'es': ['Equidistancia', 'Alianza estratégica', 'Embajada en Jerusalén'],
                      'en': ['Even-handedness', 'Strategic alliance', 'Embassy in Jerusalem']},
        'ar_china': {'es': ['Distancia', 'Pragmatismo comercial', 'Socio estratégico'],
                     'en': ['Distance', 'Trade pragmatism', 'Strategic partner']},
        'ar_migracion': {'es': ['Fronteras abiertas', 'Migración ordenada', 'Restricción y deportaciones'],
                         'en': ['Open borders', 'Orderly migration', 'Restrictions and deportations']},
    })

    # =========================================================================================
    # POLÍTICA EXTERIOR
    # =========================================================================================
    pol('AR_PosturaUcrania', 'FOREIGNPOLICY', 'swords',
        ('Postura ante la guerra en Ucrania', 'Desde la neutralidad tradicional hasta el apoyo activo a Kiev con sanciones a Rusia. '
         'Acerca a Europa y a EE.UU., pero encarece los fertilizantes rusos que usa el campo.'),
        ('Stance on the war in Ukraine', 'From traditional neutrality to active support for Kyiv with sanctions on Russia. It brings '
         'Argentina closer to Europe and the US, but makes the Russian fertiliser farmers use more expensive.'),
        ['ForeignRelations,0+(0.08*x)', 'Liberal,0+(0.05*x)', 'Socialist,0-(0.06*x)', 'Farmers,0-(0.03*x)',
         'InternationalTrade,0-(0.02*x)'],
        slider='ar_ucrania', pc=(6, 6, 5, 5), impl=1, cost=(5, 60))

    pol('AR_RelacionIsrael', 'FOREIGNPOLICY', 'compass',
        ('Relación con Israel y Medio Oriente', 'Equidistancia histórica, alianza estratégica o traslado de la embajada a Jerusalén. '
         'Un tema sensible en el país de los atentados a la Embajada de Israel y a la AMIA.'),
        ('Relations with Israel and the Middle East', 'Traditional even-handedness, a strategic alliance or moving the embassy to '
         'Jerusalem. A sensitive issue in the country that suffered the bombings of the Israeli embassy and the AMIA centre.'),
        ['ForeignRelations,0.03-(0.08*x)', 'Religious,0+(0.05*x)', 'Conservatives,0+(0.05*x)', 'Socialist,0-(0.08*x)',
         '_Terrorism,0+(0.04*x)'],
        slider='ar_israel', pc=(8, 8, 6, 6), impl=2, cost=(5, 40))

    pol('AR_RelacionChina', 'FOREIGNPOLICY', 'yin-yang',
        ('Relación con China', 'China es el segundo socio comercial: compra soja y carne, financia represas y trenes y sostiene un '
         'swap en yuanes. Acercarse trae dólares; alejarse alinea con Washington.'),
        ('Relations with China', 'China is the second-largest trading partner: it buys soybeans and beef, funds dams and railways and '
         'keeps a yuan swap line. Getting closer brings in money; distancing aligns with Washington.'),
        ['Farmers,0+(0.08*x)', 'ForeignInvestment,0+(0.05*x),4', 'CurrencyStrength,0+(0.04*x)', 'InternationalTrade,0+(0.05*x)',
         'ForeignRelations,0-(0.03*x)', 'Socialist,0+(0.04*x)'],
        slider='ar_china', pc=(6, 6, 5, 5), impl=2, cost=(0, 0))

    pol('AR_BRICS', 'FOREIGNPOLICY', 'circles-relation',
        ('Ingreso a los BRICS', 'Sumarse al bloque de Brasil, Rusia, India, China y Sudáfrica. Abre mercados y financiamiento '
         'alternativo, pero aleja a Occidente y a los mercados financieros.'),
        ('Joining the BRICS', 'Joining the bloc of Brazil, Russia, India, China and South Africa. It opens markets and alternative '
         'financing, but distances the country from the West and financial markets.'),
        ['Socialist,0+(0.10*x)', 'Capitalist,0-(0.08*x)', 'ForeignRelations,0-(0.04*x)', 'InternationalTrade,0+(0.04*x)',
         'ForeignInvestment,0-(0.04*x)', 'Patriot,0+(0.03*x)'],
        pc=(15, 10, 6, 6), impl=4, cost=(10, 50))

    pol('AR_OCDE', 'FOREIGNPOLICY', 'badge',
        ('Adhesión a la OCDE', 'Adoptar los estándares del club de países desarrollados: transparencia, competencia y reglas '
         'fiscales. Mejora la reputación, pero exige reformas incómodas.'),
        ('OECD accession', 'Adopting the standards of the developed-country club: transparency, competition and fiscal rules. It '
         'improves the country\'s reputation, but demands uncomfortable reforms.'),
        ['BusinessConfidence,0+(0.06*x)', 'Corruption,0-(0.04*x),8', 'TaxEvasion,0-(0.03*x),6', 'Capitalist,0+(0.05*x)',
         'Bureaucracy,0+(0.03*x)'],
        pc=(10, 10, 5, 5), impl=6, cost=(20, 100))

    pol('AR_Reequipamiento', 'FOREIGNPOLICY', 'plane',
        ('Reequipamiento militar', 'Compra de aviones de combate, patrulleros y radares para unas Fuerzas Armadas que llevan '
         'décadas sin inversión.'),
        ('Military re-equipment', 'Buying fighter jets, patrol vessels and radars for armed forces starved of investment for decades.'),
        ['Patriot,0+(0.10*x)', 'Conservatives,0+(0.06*x)', 'Socialist,0-(0.05*x)', 'ForeignRelations,0+(0.03*x)'],
        pc=(10, 6, 6, 4), impl=6, cost=(200, 1500))

    pol('AR_MisionesPaz', 'FOREIGNPOLICY', 'helmet',
        ('Misiones de paz y ayuda humanitaria', 'Cascos azules argentinos en misiones de la ONU y envíos de ayuda a zonas de '
         'desastre y guerra.'),
        ('Peacekeeping and humanitarian aid', 'Argentine peacekeepers on UN missions and aid shipments to disaster and war zones.'),
        ['ForeignRelations,0+(0.06*x)', 'Liberal,0+(0.04*x)', 'Patriot,0+(0.02*x)'],
        pc=(4, 4, 3, 3), impl=2, cost=(20, 200))

    pol('AR_Antartida', 'FOREIGNPOLICY', 'snowman',
        ('Antártida y control del Mar Argentino', 'Bases antárticas, rompehielos y patrullaje contra la pesca ilegal de cientos de '
         'buques extranjeros en el borde de la zona económica exclusiva.'),
        ('Antarctica and the Argentine Sea', 'Antarctic bases, icebreakers and patrols against illegal fishing by hundreds of foreign '
         'vessels at the edge of the exclusive economic zone.'),
        ['Patriot,0+(0.08*x)', 'Environment,0+(0.02*x),8', 'Organised Crime,0-(0.02*x)', 'Environmentalist,0+(0.04*x)'],
        pc=(5, 5, 3, 3), impl=3, cost=(50, 400))

    pol('AR_PoliticaMigratoria', 'LAWANDORDER', 'walk',
        ('Política migratoria', 'Argentina recibió a millones de inmigrantes de países vecinos y de Venezuela. Las restricciones y el '
         'cobro de salud y universidad a extranjeros dividen al país.'),
        ('Immigration policy', 'Argentina has taken in millions of immigrants from neighbouring countries and Venezuela. Restrictions and '
         'charging foreigners for healthcare and university divide the country.'),
        ['Immigration,0.10-(0.20*x),4', 'Conservatives,0+(0.10*x)', 'Liberal,0-(0.10*x)', 'Socialist,0-(0.06*x)',
         'EthnicMinorities,0-(0.10*x)', 'SkillsShortage,0+(0.03*x),8'],
        slider='ar_migracion', pc=(8, 8, 5, 5), impl=2, cost=(10, 120))

    # =========================================================================================
    # CRISIS INTERNACIONALES (las dispara un evento; los vínculos con Argentina las encadenan)
    # =========================================================================================
    def isit(name, icon, positive, causes, effects, es, en, start=0.55, stop=0.35):
        sit(name, 'FOREIGNPOLICY', icon, positive, start, stop, causes, effects, es, en)
        C.SITUATIONS[-1]['trigger'] = 'evento'

    isit('AR_GuerraEuropa', 'tank', 0,
         ['_default_,0.05', 'AR_PosturaUcrania,0+(0.05*x)'],
         ['OilPrice,0.04+(0.06*x)', 'FoodPrice,0.03+(0.04*x)', 'Farmers,0.03+(0.03*x)', 'Inflation,0.02+(0.03*x),2',
          'GDP,-0.01-(0.01*x)'],
         ('Guerra en Europa', 'Una guerra de alta intensidad en Europa del Este dispara el petróleo, el gas y los granos. El campo '
          'argentino vende más caro; la inflación importada pega en el bolsillo.'),
         ('War in Europe', 'A high-intensity war in Eastern Europe sends oil, gas and grain prices soaring. Argentine farmers sell at '
          'higher prices; imported inflation hits household budgets.'))
    isit('AR_CrisisMedioOriente', 'barrel', 0,
         ['_default_,0.05', 'AR_RelacionIsrael,0+(0.05*x)'],
         ['OilPrice,0.06+(0.08*x)', 'Inflation,0.02+(0.03*x),2', '_Terrorism,0.01+(0.02*x)', 'GDP,-0.01-(0.01*x)'],
         ('Crisis en Medio Oriente', 'La guerra en el golfo Pérsico cierra parcialmente el estrecho de Ormuz. El petróleo vuela: '
          'Asia sale a buscar proveedores y Vaca Muerta encuentra compradores.'),
         ('Middle East crisis', 'War in the Persian Gulf partly closes the Strait of Hormuz. Oil soars: Asia scrambles for suppliers '
          'and Vaca Muerta finds buyers.'))
    isit('AR_GuerraComercial', 'ship', 0,
         ['_default_,0.05', 'AR_AcuerdoEEUU,0+(0.05*x)', 'AR_RelacionChina,0+(0.05*x)'],
         ['InternationalTrade,-0.03-(0.04*x)', 'GDP,-0.01-(0.02*x)', 'Farmers,0.01+(0.02*x)', 'ForeignInvestment,-0.02-(0.02*x)'],
         ('Guerra comercial global', 'EE.UU. y China se cruzan aranceles. El acero y el aluminio argentinos pagan recargos, pero China '
          'compra más soja sudamericana para no depender de EE.UU.'),
         ('Global trade war', 'The US and China trade tariffs. Argentine steel and aluminium face surcharges, but China buys more South '
          'American soybeans to avoid depending on the US.'))
    isit('AR_TasasFedAltas', 'arrow-big-up-lines', 0,
         ['_default_,0.05'],
         ['CurrencyStrength,-0.03-(0.04*x)', 'ForeignInvestment,-0.03-(0.04*x)', 'BusinessConfidence,-0.01-(0.02*x)'],
         ('Tasas altas en EE.UU.', 'La Reserva Federal sube las tasas. Los capitales vuelven a Wall Street, los emergentes pagan más '
          'por endeudarse y el riesgo país argentino rebota.'),
         ('High US interest rates', 'The Federal Reserve raises rates. Capital flows back to Wall Street, emerging markets pay more to '
          'borrow and Argentine country risk rebounds.'))
    isit('AR_CrisisBrasil', 'car-crash', 0,
         ['_default_,0.05', 'AR_Mercosur,0+(0.04*x)'],
         ['InternationalTrade,-0.03-(0.04*x)', 'Unemployment,0.01+(0.02*x),2', 'Tourism,0.01+(0.02*x)', 'TradeUnionist,-0.01-(0.02*x)'],
         ('Crisis en Brasil', 'Brasil, principal comprador de autos e industria argentina, devalúa el real y entra en recesión. '
          'Las automotrices suspenden turnos.'),
         ('Crisis in Brazil', 'Brazil, the main buyer of Argentine cars and manufactures, devalues the real and slides into recession. '
          'Car plants suspend shifts.'))
    isit('AR_Superciclo', 'droplet', 1,
         ['_default_,0.05', 'AR_RelacionChina,0+(0.05*x)'],
         ['Farmers,0.05+(0.05*x)', 'GDP,0.01+(0.02*x)', 'CurrencyStrength,0.02+(0.03*x)', 'FoodPrice,0.01+(0.02*x)'],
         ('Superciclo de materias primas', 'La soja, el maíz, el litio y el cobre cotizan en máximos. Entran dólares como en 2008.'),
         ('Commodity supercycle', 'Soybeans, corn, lithium and copper trade at highs. Dollars pour in as in 2008.'))
    isit('AR_PandemiaGlobal', 'virus', 0,
         ['_default_,0.05'],
         ['Health,-0.04-(0.04*x)', 'GDP,-0.04-(0.04*x)', 'Unemployment,0.03+(0.04*x)', 'Tourism,-0.05-(0.05*x)',
          'HealthcareDemand,0.05+(0.05*x)'],
         ('Nueva pandemia', 'Un nuevo virus se propaga por el mundo. Fronteras cerradas, guardias colapsadas y la economía en pausa.'),
         ('New pandemic', 'A new virus spreads around the world. Closed borders, overwhelmed hospitals and an economy on hold.'))
    isit('AR_CrisisFinancieraGlobal', 'trending-down', 0,
         ['_default_,0.05', 'AR_AcuerdoEEUU,0+(0.03*x)'],
         ['ForeignInvestment,-0.05-(0.05*x)', 'GDP,-0.02-(0.02*x)', 'BusinessConfidence,-0.03-(0.03*x)', 'Wealthy,-0.03-(0.03*x)'],
         ('Crisis financiera global', 'Un colapso en Wall Street congela el crédito mundial. Los inversores huyen de todo lo que '
          'parezca riesgoso, empezando por Argentina.'),
         ('Global financial crisis', 'A Wall Street crash freezes world credit. Investors flee anything that looks risky, starting with '
          'Argentina.'))
    isit('AR_CrisisMigratoria', 'plane-arrival', 0,
         ['_default_,0.05', 'AR_PoliticaMigratoria,0.05-(0.05*x)'],
         ['Immigration,0.03+(0.04*x)', 'Conservatives,-0.02-(0.02*x)', 'HealthcareDemand,0.01+(0.02*x)', 'SkillsShortage,-0.01-(0.02*x)'],
         ('Ola migratoria regional', 'La crisis en Venezuela y la violencia en otros países empujan a cientos de miles de personas '
          'hacia Argentina.'),
         ('Regional migration wave', 'The crisis in Venezuela and violence elsewhere push hundreds of thousands of people towards '
          'Argentina.'))
    isit('AR_AcuerdoUEVigente', 'world-check', 1,
         ['_default_,0.05', 'AR_Mercosur,0+(0.20*x)'],
         ['InternationalTrade,0.03+(0.04*x)', 'Farmers,0.03+(0.04*x)', 'TradeUnionist,-0.01-(0.02*x)', 'ForeignInvestment,0.02+(0.02*x)'],
         ('Acuerdo con la Unión Europea en vigor', 'Tras 25 años de negociación, el acuerdo Mercosur-UE entra en vigor: carne, vino y '
          'limones entran a Europa sin aranceles.'),
         ('EU agreement in force', 'After 25 years of talks, the Mercosur-EU agreement takes effect: beef, wine and lemons enter Europe '
          'tariff-free.'), start=0.50, stop=0.30)

    # Encadenamiento de las crisis globales con las argentinas
    chains = {
        'AR_ReservasAgotadas': ['AR_TasasFedAltas,0+(0.10*x)', 'AR_CrisisFinancieraGlobal,0+(0.12*x)', 'AR_Superciclo,0-(0.12*x)',
                                'AR_CrisisMedioOriente,0-(0.04*x)'],
        'AR_RiesgoPaisAlto': ['AR_TasasFedAltas,0+(0.15*x)', 'AR_CrisisFinancieraGlobal,0+(0.20*x)'],
        'AR_CorridaCambiaria': ['AR_TasasFedAltas,0+(0.06*x)', 'AR_CrisisFinancieraGlobal,0+(0.10*x)'],
        'AR_BoomEnergetico': ['AR_CrisisMedioOriente,0+(0.20*x)', 'AR_GuerraEuropa,0+(0.10*x)'],
        'AR_SuperCosecha': ['AR_Superciclo,0+(0.15*x)', 'AR_GuerraEuropa,0+(0.06*x)'],
        'AR_CrisisEnergetica': ['AR_GuerraEuropa,0+(0.10*x)', 'AR_CrisisMedioOriente,0+(0.06*x)'],
        'AR_Recesion': ['AR_CrisisBrasil,0+(0.12*x)', 'AR_PandemiaGlobal,0+(0.25*x)', 'AR_CrisisFinancieraGlobal,0+(0.10*x)',
                        'AR_GuerraComercial,0+(0.05*x)'],
        'AR_CierrePymes': ['AR_CrisisBrasil,0+(0.10*x)', 'AR_AcuerdoUEVigente,0+(0.05*x)', 'AR_GuerraComercial,0+(0.04*x)'],
        'AR_PerdidaPoderAdquisitivo': ['AR_GuerraEuropa,0+(0.06*x)', 'AR_CrisisMedioOriente,0+(0.06*x)'],
        'AR_ConflictoSalud': ['AR_PandemiaGlobal,0+(0.25*x)'],
        'AR_InversionRecord': ['AR_CrisisMedioOriente,0+(0.05*x)', 'AR_AcuerdoUEVigente,0+(0.08*x)', 'AR_TasasFedAltas,0-(0.08*x)'],
        'AR_SaltoCambiario': ['AR_CrisisBrasil,0+(0.05*x)', 'AR_TasasFedAltas,0+(0.05*x)'],
    }
    by = {s['name']: s for s in C.SITUATIONS}
    for name, causes in chains.items():
        by[name]['causes'].extend(causes)

    # =========================================================================================
    # EVENTOS INTERNACIONALES (disparan las crisis globales)
    # =========================================================================================
    ev('AR_EvGuerraEuropa', 'militar', ['_random_,0,0.04'],
       [('AR_GuerraEuropa', 0.55, 0.92), ('OilPrice', 0.05, 0.85), ('FoodPrice', 0.04, 0.85), ('Farmers', 0.04, 0.85),
        ('Inflation', 0.02, 0.80)],
       ('Estalla una guerra en Europa', 'Tanques cruzan una frontera en Europa del Este. Los mercados de granos y energía enloquecen.'),
       ('War breaks out in Europe', 'Tanks cross a border in Eastern Europe. Grain and energy markets go wild.'))
    ev('AR_EvOrmuz', 'puerto', ['_random_,0,0.04', 'AR_RelacionIsrael,0+(0.02*x)'],
       [('AR_CrisisMedioOriente', 0.55, 0.92), ('OilPrice', 0.08, 0.85), ('Inflation', 0.03, 0.80), ('AR_BoomEnergetico', 0.15, 0.88)],
       ('Se cierra el estrecho de Ormuz', 'La guerra en el golfo bloquea el paso de un quinto del petróleo mundial. El Brent supera '
        'los 120 dólares; refinerías de Asia piden crudo argentino.'),
       ('The Strait of Hormuz is closed', 'War in the Gulf blocks a fifth of the world\'s oil. Brent tops 120 dollars; Asian refineries '
        'ask for Argentine crude.'))
    ev('AR_EvAranceles', 'puerto', ['_random_,0,0.05', 'AR_AcuerdoEEUU,0+(0.02*x)'],
       [('AR_GuerraComercial', 0.55, 0.92), ('InternationalTrade', -0.04, 0.85), ('Farmers', 0.03, 0.85), ('GDP', -0.01, 0.80)],
       ('EE.UU. impone aranceles globales', 'Washington anuncia aranceles a todo el mundo y China responde con represalias. El acero '
        'y el aluminio argentinos quedan alcanzados.'),
       ('The US imposes global tariffs', 'Washington announces tariffs on the whole world and China retaliates. Argentine steel and '
        'aluminium are hit.'))
    ev('AR_EvFedSube', 'mercado', ['_random_,0,0.05', 'Inflation,0+(0.02*x)'],
       [('AR_TasasFedAltas', 0.55, 0.92), ('AR_RiesgoPaisAlto', 0.08, 0.85), ('CurrencyStrength', -0.03, 0.85)],
       ('La Fed sube las tasas', 'La Reserva Federal sube la tasa por primera vez en años. Los bonos argentinos caen y el riesgo país '
        'rebota.'),
       ('The Fed raises rates', 'The Federal Reserve raises its rate for the first time in years. Argentine bonds fall and country risk '
        'rebounds.'))
    ev('AR_EvBrasilDevalua', 'mercado', ['_random_,0,0.05', 'AR_Mercosur,0+(0.02*x)'],
       [('AR_CrisisBrasil', 0.55, 0.92), ('InternationalTrade', -0.03, 0.85), ('Unemployment', 0.01, 0.85)],
       ('Brasil devalúa el real', 'El real se desploma y Brasil entra en recesión. Las automotrices argentinas suspenden turnos.'),
       ('Brazil devalues the real', 'The real collapses and Brazil enters recession. Argentine car plants suspend shifts.'))
    ev('AR_EvSuperciclo', 'campo', ['_random_,0,0.05', 'AR_RelacionChina,0+(0.03*x)'],
       [('AR_Superciclo', 0.55, 0.92), ('Farmers', 0.05, 0.85), ('GDP', 0.01, 0.85)],
       ('La soja vuela', 'Una mala cosecha en EE.UU. y la demanda china llevan la soja a máximos de una década.'),
       ('Soybeans soar', 'A poor US harvest and Chinese demand push soybeans to a ten-year high.'))
    ev('AR_EvPandemia', 'agua', ['_random_,0,0.02'],
       [('AR_PandemiaGlobal', 0.65, 0.93), ('Health', -0.04, 0.85), ('GDP', -0.03, 0.85), ('Tourism', -0.05, 0.85)],
       ('La OMS declara una pandemia', 'Un nuevo virus respiratorio se propaga por todos los continentes. Se cierran fronteras.'),
       ('WHO declares a pandemic', 'A new respiratory virus spreads across every continent. Borders close.'))
    ev('AR_EvWallStreet', 'mercado', ['_random_,0,0.03', 'AR_TasasFedAltas,0+(0.05*x)'],
       [('AR_CrisisFinancieraGlobal', 0.55, 0.92), ('ForeignInvestment', -0.05, 0.85), ('GDP', -0.02, 0.85)],
       ('Derrumbe en Wall Street', 'Las bolsas mundiales caen un 20 % en una semana. Quiebran fondos y el crédito se congela.'),
       ('Wall Street crash', 'World stock markets fall 20% in a week. Funds go bust and credit freezes.'))
    ev('AR_EvMigracion', 'calle', ['_random_,0,0.04', 'AR_PoliticaMigratoria,0.03-(0.03*x)'],
       [('AR_CrisisMigratoria', 0.55, 0.92), ('Immigration', 0.04, 0.85)],
       ('Éxodo venezolano', 'Una nueva crisis en Venezuela empuja a miles de familias hacia el sur. Muchas llegan a Buenos Aires.'),
       ('Venezuelan exodus', 'A new crisis in Venezuela pushes thousands of families south. Many reach Buenos Aires.'))
    ev('AR_EvAcuerdoUE', 'mundo', ['_random_,0,0.03', 'AR_Mercosur,0+(0.08*x)'],
       [('AR_AcuerdoUEVigente', 0.55, 0.95), ('InternationalTrade', 0.04, 0.85), ('Farmers', 0.04, 0.85), ('TradeUnionist', -0.03, 0.85)],
       ('Entra en vigor el acuerdo con la UE', 'El Parlamento Europeo ratifica el acuerdo con el Mercosur. Productores de carne, '
        'vino y limones festejan; la industria se preocupa.'),
       ('EU agreement takes effect', 'The European Parliament ratifies the Mercosur agreement. Beef, wine and lemon producers celebrate; '
        'industry worries.'))
    ev('AR_EvChinaSoja', 'puerto', ['_random_,0,0.04', 'AR_RelacionChina,0+(0.05*x)'],
       [('Farmers', 0.05, 0.85), ('CurrencyStrength', 0.03, 0.85), ('AR_ReservasAgotadas', -0.05, 0.85)],
       ('China compra soja argentina récord', 'Pekín cierra la mayor compra de soja argentina en años en plena guerra comercial con '
        'EE.UU.'),
       ('China makes record soybean purchase', 'Beijing closes its largest purchase of Argentine soybeans in years amid its trade war '
        'with the US.'))

    # =========================================================================================
    # DILEMAS INTERNACIONALES
    # =========================================================================================
    dil('AR_DilArmasUcrania', ['_random_,0,0.05', 'AR_GuerraEuropa,0+(0.15*x)'],
        ('Ucrania pide armas', 'Kiev pide a la Argentina material militar y apoyo en la ONU. Rusia advierte represalias comerciales.'),
        ('Ukraine asks for weapons', 'Kyiv asks Argentina for military equipment and support at the UN. Russia warns of trade reprisals.'),
        [([('ForeignRelations', 0.05), ('Socialist', -0.04), ('Farmers', -0.03)],
          ('Enviar ayuda y votar con Occidente', 'El canciller: "Estamos del lado de la libertad."'),
          ('Send aid and vote with the West', 'The foreign minister: "We stand on the side of freedom."')),
         ([('ForeignRelations', -0.03), ('Patriot', 0.03), ('Farmers', 0.02)],
          ('Mantener la neutralidad', 'El vicecanciller: "No es nuestra guerra."'),
          ('Stay neutral', 'The deputy foreign minister: "It is not our war."'))])
    dil('AR_DilVotoONU', ['_random_,0,0.06', 'AR_CrisisMedioOriente,0+(0.15*x)'],
        ('Votación en la ONU sobre Medio Oriente', 'La Asamblea General vota un alto el fuego que Israel y EE.UU. rechazan.'),
        ('UN vote on the Middle East', 'The General Assembly votes on a ceasefire that Israel and the US reject.'),
        [([('ForeignRelations', -0.03), ('Liberal', 0.04), ('Socialist', 0.03), ('Religious', -0.02)],
          ('Votar a favor del alto el fuego', 'La embajadora ante la ONU: "La vida de los civiles está primero."'),
          ('Vote for the ceasefire', 'The UN ambassador: "Civilian lives come first."')),
         ([('ForeignRelations', 0.03), ('Conservatives', 0.03), ('Socialist', -0.04)],
          ('Votar con EE.UU. e Israel', 'El canciller: "Somos aliados y lo vamos a demostrar."'),
          ('Vote with the US and Israel', 'The foreign minister: "We are allies and we will show it."'))])
    dil('AR_DilEmbajada', ['_random_,0,0.04', 'AR_RelacionIsrael,0+(0.06*x)'],
        ('Mudar la embajada a Jerusalén', 'El Gobierno evalúa trasladar la embajada argentina en Israel a Jerusalén.'),
        ('Move the embassy to Jerusalem', 'The government considers moving the Argentine embassy in Israel to Jerusalem.'),
        [([('Religious', 0.04), ('ForeignRelations', -0.04), ('_Terrorism', 0.03), ('Socialist', -0.04)],
          ('Mudarla', 'El Presidente: "Es una promesa y la vamos a cumplir."'),
          ('Move it', 'The President: "It is a promise and we will keep it."')),
         ([('ForeignRelations', 0.03), ('Religious', -0.02)],
          ('Postergar la decisión', 'El canciller: "No es el momento: arriesgamos el comercio con los países árabes."'),
          ('Postpone the decision', 'The foreign minister: "Now is not the time: we would risk trade with Arab countries."'))])
    dil('AR_DilRefugiados', ['_random_,0,0.05', 'AR_CrisisMigratoria,0+(0.15*x)'],
        ('Miles de migrantes en la frontera', 'Familias venezolanas esperan en la frontera norte sin documentos.'),
        ('Thousands of migrants at the border', 'Venezuelan families wait at the northern border without papers.'),
        [([('Immigration', 0.04), ('Liberal', 0.04), ('Conservatives', -0.04), ('SkillsShortage', -0.01)],
          ('Darles residencia humanitaria', 'La ministra de Desarrollo Humano: "Argentina siempre fue tierra de inmigrantes."'),
          ('Grant humanitarian residence', 'The human development minister: "Argentina has always been a land of immigrants."')),
         ([('Immigration', -0.03), ('Conservatives', 0.05), ('Liberal', -0.04)],
          ('Cerrar el paso', 'La ministra de Seguridad: "Primero los argentinos."'),
          ('Close the crossing', 'The security minister: "Argentines first."'))])
    dil('AR_DilEstacionEspacial', ['_random_,0,0.04', 'AR_AcuerdoEEUU,0+(0.04*x)'],
        ('La estación espacial china en Neuquén', 'EE.UU. pide revisar el acuerdo que permite a China operar una antena espacial en la '
         'Patagonia.'),
        ('The Chinese space station in Neuquén', 'The US asks Argentina to review the agreement that lets China run a space antenna in '
         'Patagonia.'),
        [([('ForeignRelations', 0.04), ('Farmers', -0.03), ('Patriot', 0.02)],
          ('Inspeccionarla y limitarla', 'El ministro de Defensa: "Nadie opera en territorio argentino sin control."'),
          ('Inspect and restrict it', 'The defence minister: "No one operates on Argentine soil without oversight."')),
         ([('Farmers', 0.02), ('ForeignRelations', -0.03)],
          ('Respetar el acuerdo', 'El canciller: "China es nuestro cliente. No rompamos contratos."'),
          ('Honour the agreement', 'The foreign minister: "China is our customer. Let us not break contracts."'))])
    dil('AR_Dil5G', ['_random_,0,0.04', 'AR_RelacionChina,0+(0.03*x)'],
        ('El 5G y las empresas chinas', 'Washington pide excluir a proveedores chinos de la red 5G argentina.'),
        ('5G and Chinese companies', 'Washington asks Argentina to exclude Chinese suppliers from its 5G network.'),
        [([('ForeignRelations', 0.03), ('Technology', -0.01), ('Capitalist', 0.02)],
          ('Excluirlas', 'El secretario de Innovación: "La seguridad de la red no se negocia."'),
          ('Exclude them', 'The innovation secretary: "Network security is not negotiable."')),
         ([('Technology', 0.02), ('ForeignRelations', -0.03), ('MiddleIncome', 0.01)],
          ('Licitación abierta', 'La ministra de Economía: "Que gane la mejor oferta."'),
          ('Open tender', 'The economy minister: "May the best offer win."'))])
    dil('AR_DilMonedaComun', ['_random_,0,0.03', 'AR_Mercosur,0+(0.03*x)'],
        ('Brasil propone una moneda común', 'El gobierno brasileño propone una moneda común para el comercio del Mercosur.'),
        ('Brazil proposes a common currency', 'The Brazilian government proposes a common currency for Mercosur trade.'),
        [([('InternationalTrade', 0.03), ('Socialist', 0.03), ('Capitalist', -0.03)],
          ('Estudiarla', 'El canciller: "Comerciar sin dólares nos ahorra reservas."'),
          ('Study it', 'The foreign minister: "Trading without dollars saves reserves."')),
         ([('Capitalist', 0.03), ('Socialist', -0.02)],
          ('Rechazarla', 'El presidente del Banco Central: "Ya tenemos bastantes problemas con una moneda."'),
          ('Reject it', 'The central bank governor: "We have enough trouble with one currency."'))])
    dil('AR_DilAviones', ['_random_,0,0.04', 'AR_Reequipamiento,0+(0.06*x)'],
        ('Compra de aviones de combate', 'Hay dos ofertas: cazas estadounidenses usados o aviones chinos nuevos y más baratos.'),
        ('Fighter jet purchase', 'There are two offers: used US fighters or newer, cheaper Chinese jets.'),
        [([('ForeignRelations', 0.04), ('Patriot', 0.03), ('Socialist', -0.02)],
          ('Aviones estadounidenses', 'El jefe de la Fuerza Aérea: "Nos integra a la OTAN como aliado."'),
          ('US jets', 'The air force chief: "It ties us to NATO as an ally."')),
         ([('Patriot', 0.02), ('ForeignRelations', -0.04), ('Farmers', 0.01)],
          ('Aviones chinos', 'El ministro de Economía: "Son más nuevos y los pagamos en cuotas."'),
          ('Chinese jets', 'The economy minister: "They are newer and we pay in instalments."'))])
    dil('AR_DilClausulaAmbiental', ['_random_,0,0.04', 'AR_AcuerdoUEVigente,0+(0.10*x)'],
        ('Europa exige cláusulas ambientales', 'Productores europeos presionan para frenar la carne argentina por deforestación en el '
         'norte del país.'),
        ('Europe demands environmental clauses', 'European farmers push to block Argentine beef over deforestation in the north.'),
        [([('Environmentalist', 0.04), ('Farmers', -0.04), ('InternationalTrade', 0.02)],
          ('Aceptar controles de trazabilidad', 'La secretaria de Ambiente: "Es una oportunidad para frenar los desmontes."'),
          ('Accept traceability controls', 'The environment secretary: "It is a chance to stop forest clearing."')),
         ([('Farmers', 0.04), ('Environmentalist', -0.04), ('InternationalTrade', -0.02)],
          ('Denunciar proteccionismo', 'El secretario de Agricultura: "Es proteccionismo disfrazado de ecología."'),
          ('Denounce protectionism', 'The agriculture secretary: "It is protectionism dressed up as ecology."'))])

    # Políticas internacionales en los escenarios (las no listadas arrancan sin implementar)
    C.START_2023.update({'AR_PosturaUcrania': 0.0, 'AR_RelacionIsrael': 0.0, 'AR_RelacionChina': 1.0, 'AR_MisionesPaz': 0.4,
                         'AR_Antartida': 0.4, 'AR_PoliticaMigratoria': 0.0})
    C.START_2026.update({'AR_PosturaUcrania': 0.5, 'AR_RelacionIsrael': 0.5, 'AR_RelacionChina': 0.5, 'AR_OCDE': 0.5,
                         'AR_Reequipamiento': 0.4, 'AR_MisionesPaz': 0.3, 'AR_Antartida': 0.4, 'AR_PoliticaMigratoria': 1.0})


# =============================================================================================
# Tercer escenario: Argentina 2026 en una tormenta global (Ormuz, Fed, guerra comercial, Europa)
# Las crisis internacionales arrancan activas mediante overrides del escenario.
# =============================================================================================
COUNTRY_GLOBAL = {
    'mission': 'argentina2026global', 'guid': 733, 'cycle': 0.35, 'difficulty': 5, 'debt': 360000, 'apathy': 0.30,
    'boosts': [('Tormenta - Medio Oriente', 'AR_CrisisMedioOriente', '+0.60'),
               ('Tormenta - Tasas de la Fed', 'AR_TasasFedAltas', '+0.60'),
               ('Tormenta - Guerra comercial', 'AR_GuerraComercial', '+0.60'),
               ('Tormenta - Guerra en Europa', 'AR_GuerraEuropa', '+0.60')],
    'text': {
        'es': {
            'guiname': 'Argentina 2026: tormenta global',
            'jobtitle': 'Presidente',
            'description': ('El mismo país de 2026, pero en un mundo en llamas: guerra en el golfo Pérsico con el estrecho de Ormuz '
                            'semicerrado y el petróleo arriba de los 100 dólares, la Reserva Federal subiendo tasas, guerra comercial '
                            'entre EE.UU. y China y una guerra abierta en Europa. Vaca Muerta y el campo pueden salvarte; la deuda y '
                            'las tasas pueden hundirte.'),
            'stats': [('Lema', 'En unión y libertad'), ('Petróleo Brent', 'US$ 90-120'), ('Tasa de la Fed', '3,75-4 %'),
                      ('Producción de petróleo', 'Récord: 973.700 barriles diarios'), ('Riesgo país', '~800-900 puntos'),
                      ('Capital', 'Buenos Aires'), ('Dificultad', 'Muy alta')],
        },
        'en': {
            'guiname': 'Argentina 2026: global storm',
            'jobtitle': 'President',
            'description': ('The same country as 2026, but in a world on fire: war in the Persian Gulf with the Strait of Hormuz '
                            'half-closed and oil above 100 dollars, the Federal Reserve raising rates, a US-China trade war and open war '
                            'in Europe. Vaca Muerta and the farm sector can save you; debt and interest rates can sink you.'),
            'stats': [('Motto', 'In union and liberty'), ('Brent crude', 'US$90-120'), ('Fed rate', '3.75-4%'),
                      ('Oil output', 'Record: 973,700 barrels a day'), ('Country risk', '~800-900 basis points'),
                      ('Capital', 'Buenos Aires'), ('Difficulty', 'Very hard')],
        },
    },
}
