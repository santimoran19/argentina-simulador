# -*- coding: utf-8 -*-
"""Nombres argentinos para políticas y situaciones del juego base.

El mod trae su propia traducción para estas entradas del juego, así en pantalla se lee "Cepo cambiario" en vez de
"Control de capitales" o "Impuesto a las Ganancias" en vez de "Impuesto sobre la renta". Sólo cambia el texto: la
mecánica sigue siendo la del juego (más lo que el mod le conecta). Ojo: mientras el mod esté activo, el nombre cambia
en cualquier país, no sólo en Argentina.

Cada entrada: nombre interno -> ((título es, descripción es), (título en, descripción en)).
"""

POLICY_NAMES = {
    # --- fusionadas con políticas argentinas (ver content_merge.py) ---
    'CapitalControls': (
        ('Cepo cambiario', 'Restricciones para comprar dólares y girar divisas al exterior. Protege las reservas en el corto '
         'plazo, pero agranda la brecha con el dólar blue, ahuyenta inversiones y alimenta el mercado negro.'),
        ('Currency controls ("cepo")', 'Restrictions on buying US dollars and moving money abroad. They protect reserves '
         'in the short run, but widen the gap with the "blue" dollar, scare off investment and feed the black market.')),
    'QuantitativeEasing': (
        ('Emisión del Banco Central para el Tesoro', 'El Banco Central imprime pesos para financiar el déficit. Da recursos '
         'rápidos, pero es la fuente clásica de la inflación argentina y debilita el peso.'),
        ('Central Bank financing of the Treasury', 'The Central Bank prints pesos to finance the deficit. It provides quick '
         'funds, but it is the classic source of Argentine inflation and weakens the peso.')),
    'StatePensions': (
        ('Jubilaciones y movilidad (ANSES)', 'El nivel de las jubilaciones y la fórmula que las actualiza. Si quedan por '
         'debajo de la inflación los jubilados pierden y salen a marchar los miércoles; si suben, el gasto se dispara.'),
        ('Pensions and indexation (ANSES)', 'The level of state pensions and the formula that updates them. If they lag '
         'inflation, retirees lose out and march every Wednesday; if they rise, spending soars.')),
    'ChildBenefit': (
        ('AUH y asignaciones familiares', 'Asignación Universal por Hijo para trabajadores informales y desocupados, y '
         'asignaciones familiares para los formales. Es la principal red contra la pobreza infantil.'),
        ('Universal Child Allowance (AUH)', 'Child allowance for informal and unemployed workers, plus family allowances '
         'for formal ones. It is the main safety net against child poverty.')),
    'DisabilityBenefit': (
        ('Pensiones y prestaciones por discapacidad', 'Pensiones no contributivas y pagos a prestadores, transportistas y '
         'centros terapéuticos. Si se atrasan, se cortan tratamientos y las familias salen a protestar.'),
        ('Disability pensions and services', 'Non-contributory pensions and payments to providers, transport and therapy '
         'centres. If they fall behind, treatments stop and families take to the streets.')),
    'UniversityGrants': (
        ('Universidad pública y gratuita', 'Financiamiento de las universidades nacionales, gratuitas y con ingreso '
         'irrestricto. Una tradición argentina que forma profesionales y moviliza multitudes cuando se recorta.'),
        ('Free public universities', 'Funding for national universities, free and open to all. An Argentine tradition '
         'that trains professionals and brings out huge crowds when it is cut.')),
    'ScienceFunding': (
        ('CONICET y ciencia', 'Becas y salarios para investigadores del sistema científico nacional. Retiene talento y '
         'genera tecnología a largo plazo; si se recorta, los científicos emigran.'),
        ('CONICET and science', 'Grants and salaries for researchers in the national science system. It keeps talent at '
         'home and builds technology in the long run; if cut, scientists emigrate.')),
    'StateHealthService': (
        ('Hospitales públicos', 'Hospitales nacionales y provinciales, gratuitos para todos, como el Garrahan o el Posadas. '
         'Atienden a quienes no tienen obra social ni prepaga; si se desfinancian, hay paros y faltan insumos.'),
        ('Public hospitals', 'National and provincial hospitals, free for everyone, such as the Garrahan children\'s '
         'hospital. They treat people without health insurance; underfunding brings strikes and shortages.')),
    'IncomeTax': (
        ('Impuesto a las Ganancias', 'Lo pagan los trabajadores de sueldos altos y los profesionales. Recauda mucho, pero '
         'es impopular en la clase media y entre los gremios de los trabajadores mejor pagos.'),
        ('Income tax ("Ganancias")', 'Paid by higher-wage workers and professionals. It raises a lot, but it is unpopular '
         'with the middle class and the unions of the best-paid workers.')),
    'Punitivewealthtax': (
        ('Bienes Personales', 'Impuesto anual al patrimonio. Lo pagan los que más tienen, pero también empuja a sacar los '
         'ahorros del país o a no declararlos.'),
        ('Personal assets tax', 'Annual wealth tax. It is paid by the richest, but it also pushes savings abroad or off '
         'the books.')),
    'ForeignInvestorTaxBreaks': (
        ('RIGI: incentivo a grandes inversiones', 'Beneficios impositivos, aduaneros y cambiarios por décadas para '
         'proyectos de más de doscientos millones de dólares. Atrae minería y energía, pero resigna recaudación.'),
        ('RIGI: large investment incentive', 'Tax, customs and currency benefits for decades for projects above two '
         'hundred million dollars. It attracts mining and energy, but gives up revenue.')),
    'OilDrillingSubsidy': (
        ('Desarrollo de Vaca Muerta', 'Inversión, oleoductos y gasoductos para explotar la segunda reserva de gas no '
         'convencional del mundo. Puede dar vuelta la balanza energética, pero preocupa a los ambientalistas.'),
        ('Vaca Muerta development', 'Investment and pipelines to tap the world\'s second-largest shale gas reserve. It can '
         'turn the energy balance around, but it worries environmentalists.')),
    'BusSubsidies': (
        ('Subsidios al transporte', 'Boletos de colectivo y tren baratos gracias a fondos nacionales, concentrados en el '
         'Área Metropolitana. Alivian el bolsillo, pero el interior se queja de pagar más.'),
        ('Public transport subsidies', 'Cheap bus and train fares paid for by national funds, concentrated in Greater '
         'Buenos Aires. They ease household budgets, but the provinces complain of paying more.')),
    'RoadBuilding': (
        ('Obra pública vial', 'Rutas y autovías financiadas por la Nación a través de Vialidad. Genera empleo y conecta '
         'provincias, pero es cara y suele estar en el centro de las causas por corrupción.'),
        ('Public road works', 'Highways funded by the national government. They create jobs and connect provinces, but '
         'they are expensive and often at the centre of corruption cases.')),
    'MilitarySpending': (
        ('Presupuesto de Defensa', 'Sueldos y reequipamiento de unas Fuerzas Armadas que llevan décadas sin inversión: '
         'aviones de combate, patrulleros y radares.'),
        ('Defence budget', 'Salaries and new equipment for armed forces that have gone decades without investment: '
         'fighter jets, patrol ships and radars.')),
    'DrugEnforcement': (
        ('Plan contra el narcotráfico', 'Fuerzas federales, inteligencia criminal y control de los puertos del río Paraná, '
         'con Rosario como prioridad.'),
        ('Anti drug-trafficking plan', 'Federal forces, criminal intelligence and control of the Paraná river ports, with '
         'Rosario as the priority.')),
    'BorderControls': (
        ('Controles migratorios y de frontera', 'Argentina recibió a millones de inmigrantes de países vecinos y de '
         'Venezuela. Más controles y el cobro de servicios a extranjeros dividen a la sociedad.'),
        ('Migration and border controls', 'Argentina has taken in millions of immigrants from neighbouring countries and '
         'Venezuela. Tighter controls and charging foreigners for services divide society.')),
    'StateAirline': (
        ('Aerolíneas Argentinas estatal', 'La aerolínea de bandera en manos del Estado. Conecta provincias que no son '
         'rentables, pero da pérdidas. Bajarla es privatizarla.'),
        ('State-owned Aerolíneas Argentinas', 'The flag carrier in state hands. It serves unprofitable provinces, but '
         'loses money. Lowering it means privatising it.')),
    'LabourLaws': (
        ('Ley de Contrato de Trabajo', 'Indemnizaciones, período de prueba, convenios colectivos. Bajarla es la reforma '
         'laboral: los empresarios dicen que crea empleo formal; la CGT, que precariza.'),
        ('Employment protection law', 'Severance pay, probation periods, collective agreements. Lowering it is the labour '
         'reform: business says it creates formal jobs; the CGT unions say it erodes rights.')),
    'ImportTarrifs': (
        ('Aranceles y licencias de importación', 'Aranceles altos y permisos para importar protegen a la industria '
         'nacional, pero encarecen los precios. Bajarlos es abrir la economía, como pide el acuerdo Mercosur-UE.'),
        ('Tariffs and import licences', 'High tariffs and import permits protect domestic industry, but raise prices. '
         'Lowering them opens the economy, as the Mercosur-EU deal requires.')),
    # --- otras políticas del juego con nombre argentino ---
    'SalesTax': (('IVA', 'Impuesto al valor agregado del 21 %. Es la mayor fuente de recaudación y pega más en los '
                  'que menos tienen.'),
                 ('VAT', 'The 21 % value added tax. The biggest source of revenue, and it hits the poorest hardest.')),
    'PayrollTax': (('Cargas sociales', 'Aportes y contribuciones sobre los sueldos. Financian jubilaciones y obras '
                    'sociales, pero encarecen contratar en blanco.'),
                   ('Payroll contributions', 'Contributions on wages. They fund pensions and health insurance, but make '
                    'formal hiring expensive.')),
    'CorporationTax': (('Ganancias de sociedades', 'Impuesto sobre las utilidades de las empresas.'),
                       ('Corporate income tax', 'Tax on company profits.')),
    'MinimumWage': (('Salario mínimo, vital y móvil', 'Lo fija el Consejo del Salario entre gobierno, empresarios y CGT. '
                     'Es referencia para planes sociales y para los trabajadores informales.'),
                    ('Minimum wage', 'Set by the Wage Council of government, business and unions. It is a benchmark for '
                     'welfare plans and informal workers.')),
    'UnemployedBenefit': (('Seguro de desempleo', 'Ayuda temporal de la ANSES para quienes pierden un empleo registrado.'),
                          ('Unemployment insurance', 'Temporary benefit for workers who lose a registered job.')),
    'StateRail': (('Trenes Argentinos', 'Trenes de pasajeros y de carga del Estado.'),
                  ('State railways', 'State-owned passenger and freight trains.')),
    'StateEnergy': (('YPF y energía estatal', 'Participación estatal en la petrolera YPF y en empresas de energía.'),
                    ('YPF and state energy', 'State stakes in the YPF oil company and in energy firms.')),
    'StatePostService': (('Correo Argentino', 'El correo nacional en manos del Estado.'),
                         ('Correo Argentino', 'The state-owned national postal service.')),
    'StateBroadcaster': (('Medios públicos', 'TV Pública, Radio Nacional y la agencia Télam.'),
                         ('Public media', 'Public TV, National Radio and the national news agency.')),
    'IntelligenceServices': (('SIDE', 'La Secretaría de Inteligencia del Estado.'),
                             ('SIDE intelligence', 'The State Intelligence Secretariat.')),
}

SITUATION_NAMES = {
    'DoctorsStrike': (('Paro de médicos y residentes', 'Médicos y residentes de los hospitales públicos paran por salarios.'),
                      ('Doctors\' and residents\' strike', 'Doctors and residents in public hospitals strike over pay.')),
    'TeachersStrike': (('Paro docente', 'Los gremios docentes paran por salarios y no empiezan las clases.'),
                       ('Teachers\' strike', 'Teachers\' unions strike over pay and classes do not start.')),
    'Homelessness': (('Personas en situación de calle', 'Cada vez más gente duerme en la calle en las grandes ciudades.'),
                     ('Homelessness', 'More and more people sleep rough in the big cities.')),
    'PowerBlackouts': (('Cortes de luz', 'Las olas de calor dejan barrios enteros sin luz durante días.'),
                       ('Power cuts', 'Heatwaves leave whole neighbourhoods without power for days.')),
}

# Textos de inicio y fin para las situaciones renombradas (el juego los muestra como aviso).
SITUATION_NOTICES = {
    'DoctorsStrike': (('Paran los médicos y residentes de los hospitales públicos.', 'Los médicos levantaron el paro.'),
                      ('Public hospital doctors and residents are on strike.', 'The doctors have called off the strike.')),
    'TeachersStrike': (('Paro docente: las escuelas están cerradas.', 'Los docentes levantaron el paro y vuelven las clases.'),
                       ('Teachers are on strike: schools are closed.', 'Teachers have ended the strike and classes resume.')),
    'Homelessness': (('Crece la cantidad de personas que duermen en la calle.', 'Bajó la cantidad de personas en situación de calle.'),
                     ('More and more people are sleeping rough.', 'The number of homeless people has fallen.')),
    'PowerBlackouts': (('Empiezan los cortes de luz.', 'Se normalizó el suministro eléctrico.'),
                       ('Power cuts have begun.', 'The power supply is back to normal.')),
}

# Eventos del juego con versión argentina. Mismo hecho y mismo efecto que el original; sólo cambia el relato.
# Quedan afuera los que ya tienen un evento propio en el mod (sequía, Mundial ganado, cierre de fábrica, temporal,
# guerra comercial, mejora de la calificación, incendios en la Patagonia, pandemia), los que no aplican a Argentina (realeza) y "falklands", que el juego
# cuenta desde el lado británico.
EVENT_NAMES = {
    'CryptocurrencyCrash': (
        ('Se derrumba una criptomoneda', 'Estalló la burbuja de una criptomoneda muy promocionada en el país. Miles de '
         'cuentapropistas perdieron sus ahorros y ahora piden que se regulen las monedas digitales.'),
        ('A cryptocurrency collapses', 'The bubble of a heavily promoted cryptocurrency has burst. Thousands of self-employed '
         'people lost their savings and now demand regulation of digital currencies.')),
    'CryptocurrencyCrash!': (
        ('Se derrumba una criptomoneda', 'Estalló la burbuja de una criptomoneda muy promocionada en el país. Miles de '
         'cuentapropistas perdieron sus ahorros y ahora piden que se regulen las monedas digitales.'),
        ('A cryptocurrency collapses', 'The bubble of a heavily promoted cryptocurrency has burst. Thousands of self-employed '
         'people lost their savings and now demand regulation of digital currencies.')),
    'FlashCrash': (
        ('Desplome relámpago del Merval', 'Una sola operación automatizada hundió las acciones argentinas en minutos. Los '
         'economistas piden reglas urgentes para el trading automático.'),
        ('Flash crash on the Merval', 'A single automated trade sent Argentine shares into a tailspin within minutes. '
         'Economists call for urgent rules on automated trading.')),
    'accidentalshooting': (
        ('Un famoso dispara contra un familiar', 'La inseguridad es tal que un conocido conductor de televisión le disparó a '
         'un familiar en su casa porque lo confundió con un ladrón.'),
        ('Celebrity shoots a relative', 'Crime is so high that a well-known TV host shot a relative at home, mistaking them '
         'for a burglar.')),
    'accountantsbusted': (
        ('Filtración de cuentas offshore', 'Periodistas publicaron la base de datos de un estudio contable extranjero: miles '
         'de argentinos ricos escondían su plata en paraísos fiscales.'),
        ('Offshore accounts leaked', 'Journalists published the database of a foreign accounting firm: thousands of wealthy '
         'Argentines were hiding their money in tax havens.')),
    'affair': (
        ('Escándalo con una vedette', 'Una vedette asegura que tuvo un romance con vos y que le pagaron por su silencio con '
         'fondos de la campaña, lo que es un delito. Los programas de la tarde no hablan de otra cosa.'),
        ('Showgirl scandal', 'A showgirl claims she had an affair with you and was paid for her silence out of campaign '
         'funds, which is a crime. The afternoon TV shows talk of nothing else.')),
    'centralbankfraud': (
        ('Fraude en el Banco Central', 'Empleados del Banco Central cambiaban billetes nuevos por falsos. Si la institución '
         'que cuida la moneda es corrupta, ¿cómo va a confiar la gente en el peso?'),
        ('Central Bank fraud', 'Central Bank staff were swapping new banknotes for fake ones. If the institution guarding the '
         'currency is corrupt, how can people trust the peso?')),
    'civilservantsstrike': (
        ('Paro de estatales', 'ATE y UPCN paran por salarios. Los trámites se frenan en todo el país.'),
        ('Public sector strike', 'The public employees\' unions are striking over pay. Paperwork grinds to a halt nationwide.')),
    'coastaloilspill': (
        ('Derrame de petróleo en la costa patagónica', 'Un derrame arrasó la pesca artesanal de la zona y deja sin sustento '
         'a los pueblos costeros, que empiezan a irse a las ciudades.'),
        ('Oil spill on the Patagonian coast', 'A spill has wiped out local fishing and left coastal towns without a '
         'livelihood; people are starting to move to the cities.')),
    'corruptionarrests': (
        ('Detenidos por corrupción en Comodoro Py', 'La Justicia federal detuvo a funcionarios acusados de desviar fondos '
         'públicos. Se nota que la corrupción ya no tiene protección.'),
        ('Corruption arrests', 'Federal courts have arrested officials accused of embezzling public funds. Corruption is no '
         'longer protected.')),
    'deadlywatercontamination': (
        ('Agua contaminada con plomo', 'Cientos de miles de vecinos de un municipio se quedaron sin agua potable: para ahorrar, '
         'cambiaron la fuente de agua y la nueva corroyó las cañerías de plomo.'),
        ('Lead-contaminated water', 'Hundreds of thousands of residents have no safe drinking water: to save money the '
         'municipality switched water source and it corroded the lead pipes.')),
    'dubiousrolemodel': (
        ('Un funcionario elogia a un dictador', 'Un funcionario que elegiste vos elogió en un discurso a un dictador '
         'sanguinario. Los organismos de derechos humanos piden su renuncia.'),
        ('Official praises a dictator', 'An official you appointed praised a bloodthirsty dictator in a speech. Human rights '
         'groups demand their resignation.')),
    'earthquake': (
        ('Terremoto en Cuyo', 'Un sismo sacudió Mendoza y San Juan. Por suerte hubo pocas víctimas, pero los daños van a '
         'frenar la economía regional por un tiempo.'),
        ('Earthquake in Cuyo', 'An earthquake has struck Mendoza and San Juan. Few lives were lost, but the damage will slow '
         'the regional economy for a while.')),
    'embezzledfundsrecovered': (
        ('Se recupera la ruta del dinero', 'Se repatrió plata que un exfuncionario había escondido en cuentas en el exterior.'),
        ('Embezzled funds recovered', 'Money a former official had hidden in foreign bank accounts has been brought home.')),
    'formermilitaryleaderssentenced': (
        ('Condenas por crímenes de lesa humanidad', 'La Justicia condenó a exjefes militares de la última dictadura. Un nuevo '
         'paso de Memoria, Verdad y Justicia.'),
        ('Former junta officers sentenced', 'The courts have sentenced former military leaders of the last dictatorship. '
         'Another step for Memory, Truth and Justice.')),
    'foodscandal': (
        ('Escándalo en los frigoríficos', 'Una cámara oculta mostró las condiciones en varios frigoríficos del país. La carne '
         'barata tiene un costo que nadie quería ver.'),
        ('Meatpacking scandal', 'Hidden-camera footage exposed conditions in several meatpacking plants. Cheap meat has a '
         'cost nobody wanted to see.')),
    'formerspypoisoned': (
        ('Envenenan a un exespía', 'Un exespía extranjero que tenía asilo en el país fue envenenado con material radiactivo '
         'en un restaurante de Buenos Aires.'),
        ('Former spy poisoned', 'A foreign former spy granted asylum here was poisoned with radioactive material in a Buenos '
         'Aires restaurant.')),
    'fuelshortage': (
        ('Faltante de nafta', 'Las estaciones de servicio se quedaron sin combustible: la producción no alcanza y la '
         'importación está trabada.'),
        ('Fuel shortage', 'Petrol stations have run dry: domestic production cannot keep up and imports are stuck.')),
    'globalhitdrama': (
        ('Una serie argentina arrasa en el mundo', 'Una serie nacional es un éxito global: la compraron más de cien países y '
         'gana premios en todas partes.'),
        ('Argentine series is a global hit', 'A domestic series is a worldwide sensation: over a hundred countries have bought '
         'it and it is winning awards everywhere.')),
    'governmentshutdown': (
        ('El Congreso te traba los fondos', 'El Congreso no aprobó el Presupuesto y los servicios públicos quedan frenados un '
         'mes. Tus políticas no tienen apoyo suficiente en las cámaras.'),
        ('Congress blocks funding', 'Congress has refused to pass the budget and public services are suspended for a month. '
         'Your policies lack enough support in Congress.')),
    'heatwave': (
        ('Ola de calor', 'Una ola de calor récord provoca incendios y varias muertes. El país no está preparado para '
         'temperaturas así.'),
        ('Heatwave', 'A record heatwave is causing fires and several deaths. The country is not prepared for such '
         'temperatures.')),
    'highcorruptioncriticized': (
        ('Nos castiga el ranking de corrupción', 'Un informe internacional ubica al país entre los más corruptos de América. '
         'La corrupción frena todo: inversiones, servicios y confianza.'),
        ('Corruption ranking slams us', 'An international report ranks the country among the most corrupt in the Americas. '
         'Corruption holds everything back: investment, services and trust.')),
    'highriseblaze': (
        ('Incendio en un monoblock', 'Una falla eléctrica provocó un incendio mortal en un monoblock de vivienda social. La '
         'mala construcción y la falta de controles agravaron la tragedia.'),
        ('Tower block fire', 'An electrical fault caused a deadly fire in a social housing tower. Poor construction and lack '
         'of inspections made the tragedy worse.')),
    'housingmarketboom': (
        ('Boom inmobiliario', 'Los precios de las propiedades en dólares llegan a un récord. Una señal de que la economía se '
         'está fortaleciendo.'),
        ('Property boom', 'Property prices in dollars hit a record. A sign the economy is getting stronger.')),
    'housingmarketcrash': (
        ('Se desploma el precio de las propiedades', 'Los precios caen otra vez. Los que compraron varias propiedades e '
         'inversores extranjeros los habían inflado por encima de lo que la gente podía pagar.'),
        ('Property prices crash', 'Prices are falling again. Multiple-home buyers and foreign investors had pushed them '
         'beyond what people could afford.')),
    'illegalimmigrationoutcry': (
        ('Malestar por la inmigración irregular', 'El aumento de la inmigración irregular por las fronteras del norte '
         'despierta reclamos de los sectores conservadores.'),
        ('Outcry over irregular immigration', 'Rising irregular immigration across the northern borders is provoking '
         'complaints from conservatives.')),
    'internationalliteraryaward': (
        ('Gran premio para un escritor argentino', 'Un escritor argentino ganó el premio literario más prestigioso del mundo '
         'con una novela que transcurre en el país.'),
        ('Top prize for an Argentine writer', 'An Argentine writer has won the world\'s most prestigious literary prize for '
         'a novel set in the country.')),
    'lowcorruptionpraised': (
        ('Mejoramos en el ranking de transparencia', 'Un informe internacional destaca al país entre los menos corruptos de '
         'América. Así las empresas pueden crecer y la gente confía más.'),
        ('Transparency ranking praises us', 'An international report ranks the country among the least corrupt in the '
         'Americas. Business can thrive and people trust more.')),
    'martyrdies': (
        ('Se prende fuego frente a la Casa Rosada', 'Un manifestante se prendió fuego en Plaza de Mayo en protesta contra el '
         'gobierno y murió. Su muerte desata una ola de bronca.'),
        ('Self-immolation outside the Casa Rosada', 'A protester set themselves on fire in Plaza de Mayo against the '
         'government and died. Their death unleashes a wave of anger.')),
    'militarycontractscandal': (
        ('Escándalo en compras militares', 'Un diario reveló licitaciones truchas en las Fuerzas Armadas para desviar plata '
         'pública a cuentas privadas. Ya hay una investigación.'),
        ('Military procurement scandal', 'A newspaper revealed rigged tenders in the armed forces used to divert public '
         'money into private accounts. An investigation is under way.')),
    'minerskilled': (
        ('Derrumbe en una mina', 'Un derrumbe en una mina de la cordillera mató a decenas de mineros. Investigan las normas '
         'de seguridad, pero para la gente es demasiado poco y demasiado tarde.'),
        ('Mine collapse', 'A collapse at a mine in the Andes killed dozens of miners. Safety standards are being '
         'investigated, but people see it as too little, too late.')),
    'multinationalcompanyheadquarters': (
        ('Una multinacional elige Buenos Aires', 'Una gran multinacional va a instalar su sede regional en el país, atraída '
         'por la mano de obra calificada y la estabilidad.'),
        ('Multinational picks Buenos Aires', 'A major multinational will set up its regional headquarters here, drawn by the '
         'skilled workforce and stability.')),
    'nationalcyberattack': (
        ('Ciberataque masivo', 'Bancos, medios y sitios del Estado cayeron por un ciberataque masivo desde el exterior.'),
        ('Massive cyberattack', 'Banks, media and government websites were knocked out by a massive foreign cyberattack.')),
    'nationalteamexitsworldcup': (
        ('La Selección se vuelve temprano del Mundial', 'La Selección quedó eliminada antes de lo esperado. Los jugadores '
         'reciben críticas por todos lados y el país está de luto futbolero.'),
        ('Argentina crash out of the World Cup', 'The national team has been knocked out earlier than expected. The players '
         'are slammed everywhere and the country is in football mourning.')),
    'nobelpeaceprize': (
        ('Nobel de la Paz para un argentino', 'Un argentino que promueve la democracia en el país y en el mundo recibió el '
         'Premio Nobel de la Paz. Un respaldo internacional enorme.'),
        ('Nobel Peace Prize for an Argentine', 'An Argentine who promotes democracy at home and abroad has received the Nobel '
         'Peace Prize. A huge international endorsement.')),
    'olympichosts': (
        ('Buenos Aires, sede olímpica', 'Buenos Aires organizó los Juegos Olímpicos y todo salió impecable. El mundo entero '
         'miró al país.'),
        ('Buenos Aires hosts the Olympics', 'Buenos Aires hosted the Olympic Games flawlessly. The whole world was watching.')),
    'pipelineprotests': (
        ('Protestas contra un oleoducto', 'Un oleoducto de Vaca Muerta pasa por tierras de una comunidad indígena, que se '
         'opone por el impacto ambiental y ya consiguió apoyo internacional.'),
        ('Pipeline protests', 'A Vaca Muerta pipeline crosses land owned by an indigenous community, which opposes it over '
         'the environmental impact and has won international support.')),
    'planecrash': (
        ('Cae un avión de la aerolínea de bandera', 'Un avión de la aerolínea nacional se estrelló y no hubo sobrevivientes. '
         'Apuntan a la falta de mantenimiento y culpan al Estado.'),
        ('National airline plane crash', 'A plane belonging to the national airline crashed with no survivors. Poor '
         'maintenance is blamed, and so is the state.')),
    'policeshooting': (
        ('Gatillo fácil', 'Un joven desarmado de un barrio humilde murió por un disparo policial. Los organismos de derechos '
         'humanos y su comunidad marchan pidiendo justicia.'),
        ('Police shooting', 'An unarmed young man from a poor neighbourhood was shot dead by police. Human rights groups and '
         'his community march for justice.')),
    'protesterskilled': (
        ('Muertos en una represión', 'La policía mató a varios manifestantes durante una marcha. Sea legal o no la protesta, '
         'la represión es repudiada en el país y en el mundo.'),
        ('Protesters killed', 'Police killed several protesters during a march. Legal or not, the crackdown is condemned at '
         'home and abroad.')),
    'richestcompanypaysnotax': (
        ('Una multinacional gigante no paga impuestos', 'La empresa más rica del mundo facturó miles de millones en el país '
         'y no pagó un peso de impuestos gracias a maniobras contables.'),
        ('Tech giant pays no tax', 'The world\'s richest company made billions here and paid no tax at all thanks to '
         'accounting tricks.')),
    'scientificbreakthrough': (
        ('Avance científico argentino', 'Científicos argentinos desarrollaron una batería de litio con el doble de capacidad. '
         'Puede cambiar la industria en todo el mundo.'),
        ('Argentine scientific breakthrough', 'Argentine scientists have developed a lithium battery with twice the capacity. '
         'It could change industry worldwide.')),
    'shareipocancelled': (
        ('Se suspende una salida a la bolsa', 'Una empresa conocida canceló su debut en la bolsa. Cada vez más empresas '
         'prefieren no cotizar en el país.'),
        ('IPO cancelled', 'A well-known company has cancelled its stock market debut. More and more firms prefer not to list '
         'here.')),
    'shareiposuccess': (
        ('Un unicornio argentino sale a la bolsa', 'La última startup tecnológica argentina salió a cotizar y los inversores '
         'se pelearon por comprar acciones.'),
        ('Argentine unicorn goes public', 'The latest Argentine tech startup has listed on the stock exchange and investors '
         'scrambled to buy shares.')),
    'spousescandal': (
        ('Escándalo por un viaje de tu pareja', 'Se supo que tu pareja viajó en un avión privado a hacer compras a Miami. Un '
         'abuso de poder que la gente no te va a perdonar fácil.'),
        ('Partner\'s shopping trip scandal', 'It emerged that your partner took a private jet to go shopping in Miami. An '
         'abuse of power voters will not easily forgive.')),
    'statevisitcancelled': (
        ('Se cae una visita de Estado', 'Un jefe de Estado extranjero suspendió su visita al país por inseguridad e '
         'inestabilidad. Quedás debilitado ante el mundo.'),
        ('State visit cancelled', 'A foreign head of state has called off a visit, citing insecurity and instability. You look '
         'weak to the world.')),
    'stormdestroysrailway': (
        ('Un temporal destruye las vías', 'Un temporal destruyó un tramo clave de vías del tren. La falta de inversión en '
         'infraestructura quedó a la vista.'),
        ('Storm wrecks railway', 'A storm has destroyed a key stretch of railway. Underinvestment in infrastructure is plain '
         'to see.')),
    'touristmurdered': (
        ('Asesinan a un turista en un robo', 'Un turista extranjero fue asesinado durante un robo. La noticia recorre el '
         'mundo y golpea al turismo.'),
        ('Tourist murdered', 'A foreign tourist was killed in a robbery. The story is everywhere and hurts tourism.')),
    'unitednationssecretary_general': (
        ('Un argentino al frente de la ONU', 'Un diplomático argentino fue elegido secretario general de las Naciones Unidas.'),
        ('An Argentine leads the UN', 'An Argentine diplomat has been chosen as Secretary-General of the United Nations.')),
    'women_smarch': (
        ('Marcha federal de mujeres', 'Multitudes de mujeres marcharon al Congreso contra la desigualdad y la violencia de '
         'género. Son la mitad del electorado.'),
        ('Women\'s march', 'Huge crowds of women marched on Congress against inequality and gender violence. They are half '
         'the electorate.')),
    'worldheritagesite': (
        ('Nuevo Patrimonio de la Humanidad', 'La UNESCO declaró Patrimonio de la Humanidad un nuevo sitio argentino.'),
        ('New World Heritage Site', 'UNESCO has declared a new Argentine site a World Heritage Site.')),
    'xenophobicattacks': (
        ('Ataques xenófobos', 'Grupos violentos atacaron comercios de extranjeros acusándolos de quitar trabajo. Los '
         'atacados se refugiaron en iglesias y comisarías.'),
        ('Xenophobic attacks', 'Mobs attacked foreign-owned shops, accusing them of taking jobs. The victims sheltered in '
         'churches and police stations.')),
    'CreditRatingDowngraded': (
        ('Bajan la nota de la deuda argentina', 'Las calificadoras bajaron la nota de la deuda. Sube el riesgo país y los '
         'inversores se van a pensar dos veces antes de venir.'),
        ('Argentina\'s credit rating cut', 'Rating agencies have downgraded the debt. Country risk rises and investors will '
         'think twice before coming.')),
}


# Políticas del juego que usan los programas de otros espacios (content_parties.py)
import content_parties as _p
for _k, (_tes, _des, _ten, _den) in _p.BASE_RENAMES.items():
    POLICY_NAMES[_k] = ((_tes, _des), (_ten, _den))
