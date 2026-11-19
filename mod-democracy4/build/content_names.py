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
