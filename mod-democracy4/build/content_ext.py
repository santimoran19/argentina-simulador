# -*- coding: utf-8 -*-
"""Ampliación 2024-2026 del mod: más políticas, situaciones encadenadas, eventos, dilemas, enlaces causales
propios de Argentina y una referencia de las políticas de 2026 para calibrar el balance.

Se importa desde content.py, que ya define pol(), sit(), ev() y dil().
Hechos de referencia: salida del cepo con bandas (abr-2025), swap con EE.UU. (oct-2025), legislativas (oct-2025),
reforma laboral (feb/mar-2026), vetos a jubilados, universidades, Garrahan y discapacidad (2025),
casos $LIBRA, ANDIS y fentanilo (2025), incendios en la Patagonia (2026), privatizaciones (2025-2026),
inflación ~1,8 % mensual y reservas ~US$ 50.000 M (nov-2026). Sin nombres de personas reales.
"""


def extend(C):
    pol, sit, ev, dil = C.pol, C.sit, C.ev, C.dil

    # =========================================================================================
    # POLÍTICAS NUEVAS
    # =========================================================================================
    pol('AR_BandasCambiarias', 'ECONOMY', 'arrows-diff',
        ('Bandas cambiarias', 'El dólar flota entre un piso y un techo que se ajustan con la inflación. Si toca el techo, el Banco '
         'Central vende reservas para defenderlo. Cuanto más se defiende la banda, más estable el dólar, pero más reservas se queman.'),
        ('Exchange-rate bands', 'The dollar floats between a floor and a ceiling adjusted for inflation. If it hits the ceiling, the '
         'central bank sells reserves to defend it. The harder the band is defended, the steadier the dollar, but the more reserves burn.'),
        ['CurrencyStrength,0+(0.10*x)', 'Inflation,0-(0.06*x),3', 'BusinessConfidence,0+(0.06*x)', 'Farmers,0-(0.04*x)',
         'Capitalist,0+(0.05*x)'],
        pc=(15, 15, 6, 6), impl=2, cost=(0, 0), opposites='AR_Cepo')

    pol('AR_TasaBCRA', 'ECONOMY', 'percentage',
        ('Tasa de interés del Banco Central', 'Tasas altas ponen a los ahorristas del lado del peso y frenan el dólar y la '
         'inflación, pero encarecen el crédito, enfrían la actividad y ahogan a las pymes endeudadas.'),
        ('Central bank interest rate', 'High rates keep savers in pesos and hold down the dollar and inflation, but make credit '
         'expensive, cool the economy and choke indebted small businesses.'),
        ['Inflation,0-(0.12*x),2', 'CurrencyStrength,0+(0.10*x)', 'GDP,0-(0.05*x),3', 'SelfEmployed,0-(0.08*x)',
         'Unemployment,0+(0.03*x),4', 'MiddleIncome,0-(0.04*x)', 'Wealthy,0+(0.06*x)'],
        pc=(4, 4, 3, 3), impl=1, cost=(0, 0))

    pol('AR_Motosierra', 'ECONOMY', 'scissors',
        ('Recorte del gasto público ("motosierra")', 'Recorte drástico de transferencias, obra pública, salarios estatales y '
         'subsidios para eliminar el déficit. Baja la inflación y gana la confianza de los mercados, pero el ajuste lo siente la gente.'),
        ('Spending cuts ("chainsaw")', 'Drastic cuts to transfers, public works, state salaries and subsidies to eliminate the '
         'deficit. It brings down inflation and wins market confidence, but people feel the squeeze.'),
        ['StateEmployees,0-(0.30*x)', 'Inflation,0-(0.10*x),6', 'GDP,0-(0.04*x),2', 'Unemployment,0+(0.04*x),4',
         'Capitalist,0+(0.15*x)', 'Socialist,0-(0.20*x)', 'Bureaucracy,0-(0.15*x)', 'Poor,0-(0.06*x)', 'Retired,0-(0.05*x)'],
        pc=(20, 10, 12, 6), impl=1, income=(0, 3000))

    pol('AR_DeficitCero', 'ECONOMY', 'calculator',
        ('Regla de déficit cero', 'Compromiso legal de no gastar más de lo que se recauda: cada nuevo gasto necesita un recorte o '
         'un impuesto. Ancla las expectativas, pero obliga a vetar leyes populares.'),
        ('Zero-deficit rule', 'A legal commitment not to spend more than is collected: every new outlay needs a cut or a tax. It '
         'anchors expectations, but forces the government to veto popular laws.'),
        ['Inflation,0-(0.06*x),6', 'BusinessConfidence,0+(0.08*x)', 'Capitalist,0+(0.10*x)', 'Retired,0-(0.08*x)',
         'StateEmployees,0-(0.08*x)', 'Socialist,0-(0.08*x)'],
        pc=(15, 15, 8, 8), impl=2, cost=(0, 0))

    pol('AR_Privatizaciones', 'ECONOMY', 'tag',
        ('Privatización de empresas públicas', 'Venta o concesión de Aerolíneas, AySA, Intercargo, trenes de carga y otras '
         'empresas del Estado. Trae dólares y achica el déficit, pero despierta resistencia gremial y nacionalista.'),
        ('Privatisation of state companies', 'Sale or concession of the national airline, water utility, airport services, freight '
         'railways and other state firms. It brings in dollars and shrinks the deficit, but meets union and nationalist resistance.'),
        ['StateEmployees,0-(0.15*x)', 'Patriot,0-(0.10*x)', 'Capitalist,0+(0.12*x)', 'ForeignInvestment,0+(0.06*x),4',
         'Unemployment,0+(0.02*x),4', 'Socialist,0-(0.12*x)', 'TradeUnionist,0-(0.08*x)'],
        pc=(15, 10, 10, 6), impl=6, income=(0, 2000))

    pol('AR_Desregulacion', 'ECONOMY', 'sitemap',
        ('Desregulación de la economía', 'Derogación de cientos de normas por decreto: alquileres, prepagas, comercio, '
         'aerocomercial. Libera la competencia y la inversión, pero deja a muchos sectores sin protección.'),
        ('Economic deregulation', 'Hundreds of rules repealed by decree: rents, private health plans, retail, aviation. It frees '
         'competition and investment, but leaves many sectors unprotected.'),
        ['BusinessConfidence,0+(0.10*x)', 'SelfEmployed,0+(0.08*x)', 'Bureaucracy,0-(0.15*x)', 'TradeUnionist,0-(0.10*x)',
         'Democracy,0-(0.03*x)', 'WorkerProductivity,0+(0.06*x),4', 'Capitalist,0+(0.08*x)', 'Poor,0-(0.03*x)'],
        pc=(15, 10, 8, 6), impl=2, cost=(0, 0))

    pol('AR_FacultadesDelegadas', 'LAWANDORDER', 'writing-sign',
        ('Facultades delegadas y gobierno por decreto', 'El Congreso delega poderes legislativos al Ejecutivo, que gobierna con '
         'decretos de necesidad y urgencia. Es rápido, pero erosiona las instituciones y enoja a la oposición.'),
        ('Delegated powers and rule by decree', 'Congress hands legislative powers to the executive, which governs through '
         'emergency decrees. It is fast, but erodes institutions and angers the opposition.'),
        ['Democracy,0-(0.08*x)', 'Liberal,0-(0.10*x)', 'Bureaucracy,0-(0.05*x)', 'Capitalist,0+(0.05*x)', 'Stability,0-(0.03*x)'],
        pc=(20, 5, 10, 5), impl=1, cost=(0, 0))

    pol('AR_AcuerdoEEUU', 'FOREIGNPOLICY', 'world',
        ('Alineamiento con Estados Unidos', 'Alianza estrecha con Washington: swap del Tesoro estadounidense, acuerdo comercial y '
         'apoyo en el FMI. Respalda al peso, pero tensiona la relación con China y con parte del electorado.'),
        ('Alignment with the United States', 'A close alliance with Washington: a US Treasury swap line, a trade agreement and '
         'support at the IMF. It props up the peso, but strains ties with China and part of the electorate.'),
        ['ForeignRelations,0+(0.08*x)', 'ForeignInvestment,0+(0.08*x),4', 'CurrencyStrength,0+(0.06*x)', 'Patriot,0-(0.06*x)',
         'Socialist,0-(0.10*x)', 'Capitalist,0+(0.08*x)', 'InternationalTrade,0+(0.04*x)', 'Farmers,0-(0.03*x)'],
        pc=(10, 10, 6, 6), impl=2, cost=(0, 0))

    pol('AR_LeyDiscapacidad', 'WELFARE', 'accessible',
        ('Prestaciones por discapacidad', 'Pensiones no contributivas y pagos a prestadores, transportistas y centros terapéuticos '
         'para personas con discapacidad. Recortarlas ahorra, pero desata protestas de familias y prestadores.'),
        ('Disability benefits', 'Non-contributory pensions and payments to care providers, transport and therapy centres for '
         'disabled people. Cutting them saves money, but triggers protests from families and providers.'),
        ['Poor,0+(0.06*x)', 'Parents,0+(0.06*x)', 'Equality,0+(0.03*x)', 'Health,0+(0.02*x),4', 'Liberal,0+(0.04*x)'],
        pc=(8, 20, 5, 12), impl=1, cost=(100, 1200))

    pol('AR_EmergenciaPediatrica', 'PUBLICSERVICES', 'baby-carriage',
        ('Financiamiento de hospitales nacionales', 'Fondos y salarios para los hospitales nacionales de referencia, como el '
         'pediátrico Garrahan. Si se desfinancian, los especialistas se van y estallan los conflictos.'),
        ('National hospital funding', 'Funding and salaries for national referral hospitals such as the Garrahan children\'s '
         'hospital. If they are starved of funds, specialists leave and conflicts erupt.'),
        ['Health,0+(0.06*x),4', 'Parents,0+(0.10*x)', 'StateEmployees,0+(0.06*x)', 'Liberal,0+(0.04*x)', 'BrainDrain,0-(0.03*x)'],
        pc=(6, 18, 4, 10), impl=1, cost=(100, 900))

    pol('AR_ControlANMAT', 'PUBLICSERVICES', 'pill',
        ('Controles sanitarios (ANMAT)', 'Inspecciones a laboratorios y medicamentos. Si se relajan para agilizar trámites, el '
         'riesgo es que circulen productos contaminados.'),
        ('Health product controls (ANMAT)', 'Inspections of laboratories and medicines. If they are relaxed to cut red tape, '
         'contaminated products may slip through.'),
        ['Health,0+(0.04*x),4', 'Corruption,0-(0.02*x)', 'BusinessConfidence,0-(0.03*x)', 'Bureaucracy,0+(0.04*x)'],
        pc=(4, 8, 3, 3), impl=2, cost=(20, 200))

    pol('AR_InocenciaFiscal', 'TAX', 'pig-money',
        ('Inocencia fiscal ("dólares del colchón")', 'Permite usar los ahorros no declarados sin explicar su origen y presume '
         'inocente al contribuyente. Puede volcar a la economía miles de millones guardados, pero abre la puerta al lavado.'),
        ('Tax innocence ("mattress dollars")', 'Lets people spend undeclared savings without explaining their origin and presumes '
         'taxpayers innocent. It could bring billions in hidden savings into the economy, but opens the door to money laundering.'),
        ['TaxEvasion,0+(0.06*x)', 'BusinessConfidence,0+(0.06*x)', 'Wealthy,0+(0.08*x)', 'MiddleIncome,0+(0.05*x)',
         'CurrencyStrength,0+(0.04*x),4', 'Socialist,0-(0.06*x)', 'Corruption,0+(0.03*x)'],
        pc=(10, 8, 5, 5), impl=2, income=(0, 800))

    pol('AR_Blanqueo', 'TAX', 'cash-banknote',
        ('Blanqueo de capitales', 'Amnistía para declarar dólares y bienes no registrados pagando una alícuota baja. Recauda y '
         'suma depósitos, pero premia a quienes evadieron.'),
        ('Tax amnesty', 'An amnesty to declare unregistered dollars and assets for a small levy. It raises revenue and adds '
         'deposits, but rewards those who evaded.'),
        ['TaxEvasion,0-(0.04*x),4', 'Corruption,0+(0.04*x)', 'Wealthy,0+(0.08*x)', 'MiddleIncome,0-(0.03*x)',
         'BusinessConfidence,0+(0.04*x)'],
        pc=(10, 4, 5, 3), impl=1, income=(0, 2500))

    pol('AR_Ganancias4ta', 'TAX', 'report-money',
        ('Ganancias sobre los salarios', 'El impuesto a las ganancias que pagan los trabajadores de mayores sueldos. Restituirlo '
         'recauda mucho, pero enoja a gremios fuertes como camioneros, bancarios y petroleros.'),
        ('Income tax on wages', 'The income tax paid by higher-earning employees. Restoring it raises a lot, but angers powerful '
         'unions such as truckers, bank workers and oil workers.'),
        ['MiddleIncome,0-(0.15*x)', 'TradeUnionist,0-(0.12*x)', 'Wealthy,0-(0.05*x)', 'Equality,0+(0.03*x)',
         'TaxEvasion,0+(0.03*x)'],
        pc=(12, 8, 8, 4), impl=1, income=(300, 4000))

    pol('AR_ParitariasEstatales', 'PUBLICSERVICES', 'briefcase',
        ('Salarios del sector público', 'Aumentos para los empleados nacionales: administración, docentes universitarios, médicos de '
         'hospitales nacionales y fuerzas de seguridad.'),
        ('Public sector pay', 'Raises for national government employees: civil servants, university lecturers, national hospital '
         'doctors and the security forces.'),
        ['StateEmployees,0+(0.25*x)', 'Inflation,0+(0.03*x)', 'TradeUnionist,0+(0.06*x)', 'Capitalist,0-(0.04*x)'],
        pc=(5, 15, 3, 10), impl=1, cost=(300, 2500))

    pol('AR_TarjetaAlimentar', 'WELFARE', 'tools-kitchen-2',
        ('AUH y Tarjeta Alimentar', 'Asignación por hijo y tarjeta para comprar alimentos para las familias más pobres. Es la '
         'principal red contra la indigencia infantil.'),
        ('Child allowance and food card', 'A per-child allowance and a food-purchase card for the poorest families. It is the main '
         'safety net against child destitution.'),
        ['Poor,0+(0.15*x)', 'ExtremePoverty,0-(0.10*x),2', 'Parents,0+(0.08*x)', 'Inflation,0+(0.02*x)', 'MiddleIncome,0-(0.03*x)'],
        pc=(6, 20, 4, 12), impl=1, cost=(300, 2000))

    pol('AR_ObraPublicaNacional', 'TRANSPORT', 'crane',
        ('Obra pública nacional', 'Rutas, viviendas, cloacas y represas financiadas por la Nación. Genera empleo y conecta '
         'provincias, pero es cara y es históricamente la caja de la corrupción.'),
        ('National public works', 'Roads, housing, sewers and dams funded by the national government. It creates jobs and connects '
         'the provinces, but it is expensive and historically a source of graft.'),
        ['GDP,0+(0.03*x),6', 'Unemployment,0-(0.04*x),4', 'Corruption,0+(0.04*x)', 'TradeUnionist,0+(0.06*x)',
         'Farmers,0+(0.04*x)', 'Stability,0+(0.02*x)', 'TrafficCongestion,0-(0.03*x),8'],
        pc=(8, 10, 5, 6), impl=4, cost=(200, 2000))

    pol('AR_CierreOrganismos', 'PUBLICSERVICES', 'building-off',
        ('Cierre de organismos públicos', 'Disolución o reducción de organismos como Vialidad, el INTA o el INTI. Ahorra y achica '
         'la burocracia, pero se pierden capacidades técnicas que el sector privado no reemplaza.'),
        ('Closing public agencies', 'Dissolving or shrinking agencies such as the national roads authority or the agricultural and '
         'industrial technology institutes. It saves money and cuts red tape, but loses technical capacity the private sector does not replace.'),
        ['StateEmployees,0-(0.20*x)', 'Farmers,0-(0.06*x)', 'Technology,0-(0.04*x),8', 'Bureaucracy,0-(0.10*x)',
         'Capitalist,0+(0.06*x)'],
        pc=(12, 10, 6, 6), impl=3, income=(0, 800))

    pol('AR_EliminarPASO', 'LAWANDORDER', 'checkbox',
        ('Primarias abiertas (PASO)', 'Elecciones primarias obligatorias para todos los partidos. Ordenan la oferta electoral, '
         'pero cuestan mucho y obligan a ir a votar una vez más.'),
        ('Open primaries (PASO)', 'Compulsory open primaries for all parties. They sort out the candidates, but are costly and mean '
         'one more trip to the polls.'),
        ['Democracy,0+(0.04*x)', 'Liberal,0+(0.03*x)', 'Bureaucracy,0+(0.02*x)'],
        pc=(10, 15, 5, 5), impl=2, cost=(50, 200))

    pol('AR_RegimenPenalJuvenil', 'LAWANDORDER', 'gavel',
        ('Baja de la edad de imputabilidad', 'Permite juzgar penalmente a menores desde los 14 años. Popular en la agenda de '
         'seguridad, cuestionado por especialistas y organismos de infancia.'),
        ('Lower age of criminal responsibility', 'Allows minors to be tried from age 14. Popular on the security agenda, criticised '
         'by experts and child-rights bodies.'),
        ['Conservatives,0+(0.12*x)', 'Liberal,0-(0.12*x)', 'CrimeRate,0-(0.02*x),6', 'PrisonOvercrowding,0+(0.04*x),4',
         'Young,0-(0.04*x)'],
        pc=(10, 10, 5, 5), impl=3, cost=(10, 120))

    pol('AR_LeyGlaciares', 'LAWANDORDER', 'mountain',
        ('Ley de glaciares', 'Protección de glaciares y zonas periglaciares frente a la minería. Las provincias mineras piden '
         'flexibilizarla para atraer inversiones de cobre y oro.'),
        ('Glacier protection law', 'Protection of glaciers and periglacial zones from mining. Mining provinces want it relaxed to '
         'attract copper and gold investment.'),
        ['Environmentalist,0+(0.15*x)', 'ForeignInvestment,0-(0.05*x)', 'Environment,0+(0.03*x),8', 'Capitalist,0-(0.05*x)',
         'Watershortage,0-(0.03*x),8'],
        pc=(8, 12, 5, 8), impl=2, cost=(5, 40))

    pol('AR_Hidrovia', 'TRANSPORT', 'anchor',
        ('Licitación de la Hidrovía', 'Concesión internacional del dragado y balizamiento de la vía navegable Paraná-Paraguay, por '
         'donde sale el 80 % de las exportaciones agrícolas.'),
        ('Paraná waterway tender', 'An international concession to dredge and mark the Paraná-Paraguay waterway, which carries 80% '
         'of farm exports.'),
        ['InternationalTrade,0+(0.05*x),4', 'Farmers,0+(0.05*x)', 'Patriot,0-(0.04*x)', 'Corruption,0+(0.02*x)',
         'Organised Crime,0-(0.02*x)'],
        pc=(8, 8, 5, 5), impl=4, cost=(0, 0))

    # =========================================================================================
    # SITUACIONES NUEVAS: la cadena dólar -> precios -> bolsillo -> consumo -> empleo -> calle
    # =========================================================================================
    sit('AR_SaltoCambiario', 'ECONOMY', 'trending-up', 0, 0.60, 0.40,
        ['_default_,0.10', 'AR_BrechaCambiaria,0+(0.30*x)', 'AR_ReservasAgotadas,0+(0.25*x)', 'AR_CorridaCambiaria,0+(0.30*x)',
         'AR_BandasCambiarias,0-(0.10*x)', 'AR_AcuerdoEEUU,0-(0.10*x)', 'AR_TasaBCRA,0-(0.10*x)', 'AR_RiesgoPaisAlto,0+(0.10*x)'],
        ['Inflation,0.08+(0.08*x),2', 'CurrencyStrength,-0.15-(0.10*x)', 'MiddleIncome,-0.05-(0.05*x)', 'Poor,-0.04-(0.04*x)',
         'Tourism,0.02+(0.03*x)', 'Farmers,0.03+(0.03*x)'],
        ('Salto cambiario', 'El dólar oficial salta de golpe. Las góndolas se remarcan en cuestión de días: los alimentos, los '
         'remedios y los alquileres se acomodan al nuevo precio de la divisa.'),
        ('Currency jump', 'The official dollar jumps overnight. Shelf prices are marked up within days: food, medicine and rents '
         'adjust to the new exchange rate.'))

    sit('AR_PerdidaPoderAdquisitivo', 'WELFARE', 'wallet', 0, 0.58, 0.40,
        ['_default_,0.15', 'Inflation,0+(0.40*x)', 'Wages,0.20-(0.20*x)', 'AR_MovilidadJubilatoria,0.10-(0.10*x)',
         'AR_ParitariasEstatales,0.08-(0.08*x)', 'AR_SaltoCambiario,0+(0.15*x)', 'AR_Ganancias4ta,0+(0.05*x)',
         'AR_Desinflacion,0-(0.15*x)'],
        ['PovertyRate,0.04+(0.06*x),2', 'Poor,-0.06-(0.06*x)', 'Retired,-0.04-(0.06*x)', 'TradeUnionist,-0.04-(0.04*x)',
         'MiddleIncome,-0.03-(0.04*x)', 'GDP,-0.01-(0.02*x),3'],
        ('El sueldo no alcanza', 'Los salarios y las jubilaciones corren detrás de los precios. Las familias recortan carne, salidas '
         'y medicamentos, y se endeudan con la tarjeta para llegar a fin de mes.'),
        ('Wages do not stretch', 'Wages and pensions trail prices. Families cut back on meat, outings and medicine, and run up credit '
         'card debt to reach the end of the month.'))

    sit('AR_Recesion', 'ECONOMY', 'chart-arrows-vertical', 0, 0.58, 0.40,
        ['_default_,0.15', 'GDP,0.30-(0.30*x)', 'AR_PerdidaPoderAdquisitivo,0+(0.20*x)', 'AR_Motosierra,0+(0.10*x)',
         'AR_TasaBCRA,0+(0.15*x)', 'AR_RiesgoPaisAlto,0+(0.10*x)', 'AR_ObraPublicaNacional,0-(0.10*x)',
         'AR_InversionRecord,0-(0.15*x)'],
        ['Unemployment,0.03+(0.05*x),3', 'SelfEmployed,-0.05-(0.05*x)', 'Capitalist,-0.02-(0.03*x)', 'GDP,-0.01-(0.02*x)'],
        ('Caída de la actividad', 'Los comercios venden menos, las fábricas trabajan a media máquina y la construcción está parada. '
         'La economía entra en recesión.'),
        ('Economic slump', 'Shops sell less, factories run at half capacity and construction has stalled. The economy slides into '
         'recession.'))

    sit('AR_AtrasoCambiario', 'ECONOMY', 'currency-dollar', 0, 0.54, 0.42,
        ['_default_,0.15', 'CurrencyStrength,0+(0.40*x)', 'AR_BandasCambiarias,0+(0.15*x)', 'AR_TasaBCRA,0+(0.10*x)',
         'AR_AcuerdoEEUU,0+(0.05*x)', 'AR_SaltoCambiario,0-(0.30*x)'],
        ['Tourism,-0.04-(0.04*x)', 'Farmers,-0.04-(0.04*x)', 'MiddleIncome,0.03+(0.03*x)', 'Inflation,-0.02-(0.03*x)',
         'InternationalTrade,-0.01-(0.02*x)'],
        ('Argentina cara en dólares', 'Con el peso apreciado, el país se encarece en dólares: conviene veranear en Brasil y comprar '
         'en Chile, entran importaciones baratas y la industria nacional pierde competitividad.'),
        ('Argentina is expensive in dollars', 'With a strong peso, the country becomes pricey in dollar terms: holidays in Brazil and '
         'shopping in Chile are cheaper, cheap imports pour in and local industry loses competitiveness.'))

    sit('AR_CierrePymes', 'ECONOMY', 'building-store', 0, 0.50, 0.38,
        ['_default_,0.10', 'AR_Recesion,0+(0.30*x)', 'AR_AtrasoCambiario,0+(0.15*x)', 'AR_Mercosur,0+(0.10*x)',
         'AR_TasaBCRA,0+(0.10*x)', 'AR_SubsidiosEnergia,0.08-(0.08*x)', 'AR_CrisisEnergetica,0+(0.08*x)'],
        ['Unemployment,0.04+(0.04*x),2', 'SelfEmployed,-0.06-(0.05*x)', 'TradeUnionist,-0.03-(0.03*x)',
         'InternationalTrade,0.01+(0.02*x)'],
        ('Cierre de pymes', 'Talleres, fábricas textiles y comercios bajan la persiana. No pueden competir con las importaciones '
         'ni pagar tarifas, tasas y alquileres con ventas en caída.'),
        ('Small businesses closing', 'Workshops, textile mills and shops close their doors. They cannot compete with imports or pay '
         'utility bills, interest and rent while sales fall.'))

    sit('AR_DesempleoCreciente', 'WELFARE', 'briefcase-off', 0, 0.58, 0.40,
        ['_default_,0.10', 'Unemployment,0+(0.45*x)', 'AR_CierrePymes,0+(0.20*x)', 'AR_Recesion,0+(0.10*x)',
         'AR_Motosierra,0+(0.05*x)', 'AR_InversionRecord,0-(0.10*x)'],
        ['CrimeRate,0.02+(0.03*x),4', 'Poor,-0.04-(0.04*x)', 'Young,-0.03-(0.04*x)', 'TradeUnionist,-0.03-(0.03*x)',
         'BrainDrain,0.01+(0.02*x)'],
        ('Desempleo en alza', 'Cada mes se pierden puestos formales. Crecen las changas, las aplicaciones de reparto y la '
         'desesperación en los barrios.'),
        ('Rising unemployment', 'Formal jobs are lost every month. Odd jobs, delivery apps and despair in poor neighbourhoods grow.'))

    sit('AR_Desinflacion', 'ECONOMY', 'snowflake', 1, 0.53, 0.42,
        ['_default_,0.10', 'Inflation,0.40-(0.40*x)', 'AR_Motosierra,0+(0.10*x)', 'AR_DeficitCero,0+(0.10*x)',
         'AR_EmisionTesoro,0.10-(0.10*x)', 'AR_BandasCambiarias,0+(0.05*x)', 'AR_SaltoCambiario,0-(0.25*x)'],
        ['MiddleIncome,0.04+(0.04*x)', 'Poor,0.02+(0.03*x)', 'BusinessConfidence,0.03+(0.03*x)', '_All_,0.01+(0.02*x)'],
        ('Desinflación', 'La inflación mensual baja mes a mes. Vuelven los créditos en cuotas, las hipotecas y la posibilidad de '
         'comparar precios.'),
        ('Disinflation', 'Monthly inflation falls month after month. Instalment credit, mortgages and the ability to compare prices '
         'come back.'))

    sit('AR_SuperavitFiscal', 'ECONOMY', 'moneybag', 1, 0.60, 0.45,
        ['_default_,0.10', 'AR_Motosierra,0+(0.30*x)', 'AR_DeficitCero,0+(0.20*x)', 'AR_Privatizaciones,0+(0.05*x)',
         'AR_EmisionTesoro,0.10-(0.10*x)', 'AR_SubsidiosEnergia,0.08-(0.08*x)', 'AR_MovilidadJubilatoria,0.06-(0.06*x)',
         'AR_ObraPublicaNacional,0.05-(0.05*x)'],
        ['Capitalist,0.04+(0.04*x)', 'BusinessConfidence,0.03+(0.04*x)', 'ForeignInvestment,0.02+(0.03*x)'],
        ('Superávit fiscal', 'Por primera vez en años, el Estado gasta menos de lo que recauda. Ya no hace falta emitir para pagar '
         'sueldos.'),
        ('Fiscal surplus', 'For the first time in years, the state spends less than it collects. There is no longer a need to print '
         'money to pay salaries.'))

    sit('AR_InversionRecord', 'ECONOMY', 'diamond', 1, 0.60, 0.45,
        ['_default_,0.10', 'AR_RIGI,0+(0.25*x)', 'AR_AcuerdoEEUU,0+(0.10*x)', 'AR_EstabilidadMacro,0+(0.15*x)',
         'AR_Desregulacion,0+(0.10*x)', 'AR_RiesgoPaisAlto,0.10-(0.10*x)', 'AR_Cepo,0.08-(0.08*x)'],
        ['ForeignInvestment,0.05+(0.05*x)', 'Unemployment,-0.01-(0.02*x),4', 'GDP,0.01+(0.02*x),4', 'CurrencyStrength,0.02+(0.03*x)'],
        ('Lluvia de inversiones', 'Llegan los grandes proyectos: oleoductos, minas de cobre y litio, data centers y puertos. Las '
         'provincias del interior compiten por atraerlos.'),
        ('Investment boom', 'Big projects arrive: pipelines, copper and lithium mines, data centres and ports. The provinces compete '
         'to attract them.'))

    sit('AR_ConflictoSalud', 'PUBLICSERVICES', 'first-aid-kit', 0, 0.55, 0.40,
        ['_default_,0.15', 'AR_EmergenciaPediatrica,0.25-(0.25*x)', 'AR_Motosierra,0+(0.15*x)',
         'AR_ParitariasEstatales,0.10-(0.10*x)', 'Health,0.15-(0.15*x)'],
        ['Health,-0.02-(0.03*x),2', 'Parents,-0.04-(0.04*x)', 'StateEmployees,-0.03-(0.03*x)', 'Liberal,-0.02-(0.03*x)'],
        ('Conflicto en los hospitales', 'Residentes y especialistas de los hospitales nacionales paran por salarios. Las cirugías se '
         'reprograman y las familias de pacientes marchan junto a los médicos.'),
        ('Hospital conflict', 'Residents and specialists at national hospitals strike over pay. Surgeries are rescheduled and '
         'patients\' families march alongside the doctors.'))

    sit('AR_CrisisDiscapacidad', 'WELFARE', 'wheelchair', 0, 0.60, 0.42,
        ['_default_,0.15', 'AR_LeyDiscapacidad,0.30-(0.30*x)', 'AR_Motosierra,0+(0.15*x)', 'AR_PerdidaPoderAdquisitivo,0+(0.05*x)'],
        ['Parents,-0.04-(0.04*x)', 'Poor,-0.03-(0.03*x)', '_All_,-0.01-(0.02*x)', 'Liberal,-0.02-(0.03*x)'],
        ('Crisis en el sistema de discapacidad', 'Prestadores que cobran con meses de atraso, pensiones dadas de baja y centros que '
         'cierran. Las familias se movilizan frente al Congreso.'),
        ('Disability care crisis', 'Providers paid months late, pensions cancelled and centres closing. Families rally outside '
         'Congress.'))

    sit('AR_ConflictoUniversitario', 'PUBLICSERVICES', 'certificate', 0, 0.60, 0.42,
        ['_default_,0.15', 'AR_UniversidadPublica,0.30-(0.30*x)', 'AR_Motosierra,0+(0.10*x)', 'AR_CONICET,0.08-(0.08*x)'],
        ['Young,-0.05-(0.05*x)', 'Liberal,-0.04-(0.04*x)', 'BrainDrain,0.02+(0.02*x),4', 'Education,-0.01-(0.02*x),4'],
        ('Universidades en pie de guerra', 'Docentes con salarios por el piso, clases públicas en las plazas y tomas de facultades. '
         'La comunidad universitaria se vuelve el principal foco opositor.'),
        ('Universities up in arms', 'Lecturers on rock-bottom pay, open-air classes in squares and faculty occupations. The university '
         'community becomes the main hub of opposition.'))

    sit('AR_MarchasJubilados', 'WELFARE', 'old', 0, 0.54, 0.40,
        ['_default_,0.15', 'AR_MovilidadJubilatoria,0.30-(0.30*x)', 'AR_PerdidaPoderAdquisitivo,0+(0.15*x)',
         'AR_Moratoria,0.08-(0.08*x)', 'AR_ProtocoloAntipiquetes,0+(0.05*x)'],
        ['Retired,-0.05-(0.05*x)', 'Stability,-0.01-(0.02*x)', '_All_,-0.01-(0.01*x)', 'Liberal,-0.02-(0.02*x)'],
        ('Las marchas de los miércoles', 'Cada miércoles, los jubilados marchan al Congreso por haberes que no alcanzan. Las imágenes '
         'de la represión recorren el mundo.'),
        ('Wednesday marches', 'Every Wednesday, pensioners march to Congress over pensions that do not stretch. Images of police '
         'crackdowns travel around the world.'))

    sit('AR_BloqueoLegislativo', 'LAWANDORDER', 'building-community', 0, 0.62, 0.45,
        ['_default_,0.25', 'AR_FacultadesDelegadas,0+(0.15*x)', 'AR_Coparticipacion,0.20-(0.20*x)', 'Polarization,0+(0.15*x)',
         'AR_Grieta,0+(0.10*x)', 'AR_EscandaloCorrupcion,0+(0.10*x)'],
        ['Stability,-0.02-(0.02*x)', 'BusinessConfidence,-0.02-(0.02*x)', 'Democracy,-0.01-(0.01*x)'],
        ('Congreso en contra', 'La oposición y los gobernadores se unen: insisten con leyes vetadas, rechazan decretos y bloquean el '
         'presupuesto.'),
        ('Hostile Congress', 'The opposition and the governors join forces: they override vetoes, reject decrees and block the '
         'budget.'))

    sit('AR_EscandaloCorrupcion', 'LAWANDORDER', 'eye', 0, 0.60, 0.42,
        ['_default_,0.10', 'Corruption,0+(0.35*x)', 'AR_Coparticipacion,0+(0.05*x)', 'AR_FichaLimpia,0-(0.10*x)',
         'AR_ControlANMAT,0.05-(0.05*x)', 'AR_InocenciaFiscal,0+(0.04*x)', 'AR_ObraPublicaNacional,0+(0.05*x)'],
        ['_All_,-0.02-(0.03*x)', 'MiddleIncome,-0.02-(0.03*x)', 'Democracy,-0.01-(0.02*x)', 'BusinessConfidence,-0.01-(0.02*x)'],
        ('Gobierno salpicado por la corrupción', 'Audios, causas judiciales y allanamientos todas las semanas. Cada nueva revelación '
         'erosiona el apoyo incluso entre los votantes propios.'),
        ('Government mired in scandal', 'Leaked audio, court cases and raids every week. Each new revelation erodes support even '
         'among the government\'s own voters.'))

    # =========================================================================================
    # EVENTOS NUEVOS (2024-2026)
    # =========================================================================================
    ev('AR_EvCripto', 'mercado', ['_random_,0,0.05', 'AR_Desregulacion,0+(0.03*x)'],
       [('_All_', -0.04, 0.85), ('MiddleIncome', -0.04, 0.85), ('Corruption', 0.03, 0.90), ('Liberal', -0.03, 0.85)],
       ('Escándalo cripto presidencial', 'El Presidente promociona en redes una criptomoneda que se desploma minutos después. Miles '
        'de inversores pierden sus ahorros y la oposición pide juicio político.'),
       ('Presidential crypto scandal', 'The President promotes a cryptocurrency on social media that crashes minutes later. Thousands of '
        'investors lose their savings and the opposition calls for impeachment.'))
    ev('AR_EvAudiosCoimas', 'corte', ['_random_,0,0.05', 'AR_LeyDiscapacidad,0+(0.04*x)', 'AR_EscandaloCorrupcion,0+(0.10*x)'],
       [('_All_', -0.06, 0.85), ('Parents', -0.06, 0.85), ('AR_EscandaloCorrupcion', 0.10, 0.90)],
       ('Audios de coimas en discapacidad', 'Se filtran audios de un ex funcionario que describe un sistema de sobornos en la compra '
        'de medicamentos para personas con discapacidad.'),
       ('Bribery recordings in disability agency', 'Recordings leak of a former official describing a bribery scheme in the purchase '
        'of medicines for disabled people.'))
    ev('AR_EvFentanilo', 'noche', ['_random_,0,0.04', 'AR_ControlANMAT,0.08-(0.08*x)'],
       [('Health', -0.03, 0.85), ('_All_', -0.04, 0.85), ('Parents', -0.04, 0.85)],
       ('Fentanilo contaminado', 'Un lote de fentanilo contaminado causa decenas de muertes en hospitales. Se descubre que los '
        'controles sobre el laboratorio fallaron.'),
       ('Contaminated fentanyl', 'A batch of contaminated fentanyl causes dozens of deaths in hospitals. Controls on the laboratory are '
        'found to have failed.'))
    ev('AR_EvTemporal', 'agua', ['_random_,0,0.06', 'AR_ObraPublicaNacional,0.04-(0.04*x)'],
       [('_All_', -0.03, 0.80), ('Poor', -0.05, 0.80), ('GDP', -0.01, 0.75)],
       ('Temporal devastador en una ciudad del sur bonaerense', 'Una lluvia histórica inunda una ciudad portuaria en pocas horas: '
        'hay víctimas fatales, miles de evacuados y barrios enteros destruidos.'),
       ('Devastating storm in a southern Buenos Aires city', 'Historic rainfall floods a port city within hours: there are deaths, '
        'thousands evacuated and entire neighbourhoods destroyed.'))
    ev('AR_EvMuertePapa', 'vaticano', ['_random_,0,0.03'],
       [('Religious', -0.05, 0.85), ('Poor', 0.02, 0.85), ('_All_', 0.01, 0.80)],
       ('Muere el Papa argentino', 'El primer Papa latinoamericano muere en Roma. El país decreta duelo nacional y millones '
        'despiden al hombre que hizo de los pobres su bandera.'),
       ('The Argentine Pope dies', 'The first Latin American Pope dies in Rome. The country declares national mourning and millions '
        'bid farewell to the man who made the poor his cause.'))
    ev('AR_EvRescateEEUU', 'mundo', ['_random_,0,0.04', 'AR_AcuerdoEEUU,0+(0.10*x)', 'AR_CorridaCambiaria,0+(0.10*x)'],
       [('CurrencyStrength', 0.06, 0.85), ('AR_CorridaCambiaria', -0.10, 0.85), ('Patriot', -0.03, 0.80), ('Capitalist', 0.04, 0.85)],
       ('El Tesoro de EE.UU. sale al rescate', 'Washington anuncia un swap de 20.000 millones de dólares y compra pesos en el '
        'mercado para frenar una corrida antes de las elecciones.'),
       ('The US Treasury steps in', 'Washington announces a 20 billion dollar swap line and buys pesos in the market to halt a run '
        'before the elections.'))
    ev('AR_EvDengue', 'agua', ['_random_,0,0.06', 'AR_EmergenciaPediatrica,0.03-(0.03*x)'],
       [('Health', -0.03, 0.80), ('_All_', -0.02, 0.80), ('HealthcareDemand', 0.04, 0.80)],
       ('Epidemia récord de dengue', 'El país registra la peor epidemia de dengue de su historia: guardias colapsadas, faltante de '
        'repelente y debate por la vacuna.'),
       ('Record dengue epidemic', 'The country suffers the worst dengue epidemic in its history: overwhelmed emergency rooms, '
        'repellent shortages and a row over the vaccine.'))
    ev('AR_EvFaltanteGas', 'noche', ['_random_,0,0.05', 'AR_CrisisEnergetica,0+(0.15*x)'],
       [('_All_', -0.03, 0.75), ('MiddleIncome', -0.02, 0.75), ('GDP', -0.01, 0.70)],
       ('Ola polar y falta de gas', 'El frío extremo dispara la demanda: se corta el gas a industrias y estaciones de GNC mientras se '
        'importan barcos de GNL de urgencia.'),
       ('Cold snap and gas shortage', 'Extreme cold sends demand soaring: gas is cut to factories and CNG filling stations while LNG '
        'cargoes are rushed in.'))
    ev('AR_EvParoControladores', 'mundo', ['_random_,0,0.05', 'AR_ParitariasEstatales,0.04-(0.04*x)'],
       [('Tourism', -0.03, 0.75), ('MiddleIncome', -0.02, 0.75), ('TradeUnionist', 0.02, 0.75)],
       ('Paro de controladores aéreos', 'Los controladores de tránsito aéreo paran por salarios: cientos de vuelos cancelados en '
        'pleno fin de semana largo.'),
       ('Air traffic controllers strike', 'Air traffic controllers strike over pay: hundreds of flights cancelled over a long weekend.'))
    ev('AR_EvPlanBandera', 'militar', ['_random_,0,0.04', 'AR_Narcotrafico,0+(0.12*x)'],
       [('Organised Crime', -0.05, 0.85), ('Conservatives', 0.04, 0.85), ('_All_', 0.02, 0.80)],
       ('Caen los homicidios en Rosario', 'Tras años de violencia narco, los homicidios en Rosario caen a su menor nivel en dos '
        'décadas gracias al operativo federal.'),
       ('Murders fall in Rosario', 'After years of drug violence, murders in Rosario fall to a two-decade low thanks to the federal '
        'operation.'))
    ev('AR_EvCalificadora', 'mercadoBueno', ['_random_,0,0.04', 'AR_SuperavitFiscal,0+(0.10*x)', 'AR_EstabilidadMacro,0+(0.10*x)'],
       [('ForeignInvestment', 0.04, 0.85), ('AR_RiesgoPaisAlto', -0.08, 0.85), ('Capitalist', 0.03, 0.85)],
       ('Mejora la nota de la deuda', 'Una calificadora internacional sube la nota soberana argentina. El riesgo país perfora un '
        'nuevo piso.'),
       ('Credit rating upgrade', 'An international agency upgrades Argentina\'s sovereign rating. Country risk breaks through a new low.'))
    ev('AR_EvCierreFabrica', 'calle', ['_random_,0,0.04', 'AR_CierrePymes,0+(0.15*x)', 'AR_AtrasoCambiario,0+(0.06*x)'],
       [('TradeUnionist', -0.04, 0.80), ('Unemployment', 0.02, 0.85), ('_All_', -0.02, 0.80)],
       ('Cierra una fábrica emblemática', 'Una fábrica histórica del conurbano cierra y deja en la calle a cientos de trabajadores. '
        'Los operarios acampan en la puerta.'),
       ('An iconic factory closes', 'A historic factory on the outskirts of Buenos Aires closes, leaving hundreds out of work. The '
        'workers camp at the gate.'))

    # =========================================================================================
    # DILEMAS NUEVOS (2024-2026)
    # =========================================================================================
    dil('AR_DilVetoDiscapacidad', ['_random_,0,0.08', 'AR_CrisisDiscapacidad,0+(0.20*x)'],
        ('Ley de emergencia en discapacidad', 'El Congreso aprobó aumentos para prestadores y pensiones por discapacidad.'),
        ('Disability emergency law', 'Congress has passed increases for disability care providers and pensions.'),
        [([('Parents', -0.06), ('AR_CrisisDiscapacidad', 0.08), ('Capitalist', 0.03)],
          ('Vetarla', 'La ministra de Economía: "El superávit no se toca. Revisemos primero las pensiones mal otorgadas."'),
          ('Veto it', 'The economy minister: "The surplus is untouchable. Let us first review the wrongly granted pensions."')),
         ([('Parents', 0.06), ('AR_CrisisDiscapacidad', -0.10), ('Inflation', 0.01)],
          ('Promulgarla', 'El jefe de Gabinete: "No vale la pena pagar este costo político."'),
          ('Sign it', 'The chief of staff: "This political cost is not worth paying."'))])
    dil('AR_DilFinanciamientoUniversitario', ['_random_,0,0.08', 'AR_ConflictoUniversitario,0+(0.20*x)'],
        ('Ley de financiamiento universitario', 'Tras una marcha masiva, el Congreso sanciona fondos para universidades y salarios '
         'docentes.'),
        ('University funding law', 'After a huge march, Congress passes funds for universities and lecturers\' salaries.'),
        [([('Young', -0.06), ('Liberal', -0.04), ('AR_ConflictoUniversitario', 0.08), ('Capitalist', 0.02)],
          ('Veto total', 'El jefe de Gabinete: "Primero que las universidades acepten auditorías."'),
          ('Full veto', 'The chief of staff: "First the universities must accept audits."')),
         ([('Young', 0.05), ('Liberal', 0.04), ('AR_ConflictoUniversitario', -0.10), ('Inflation', 0.01)],
          ('Promulgar y negociar', 'El ministro de Educación: "La universidad pública es un orgullo nacional."'),
          ('Sign it and negotiate', 'The education minister: "Public universities are a source of national pride."'))])
    dil('AR_DilGarrahan', ['_random_,0,0.08', 'AR_ConflictoSalud,0+(0.20*x)'],
        ('Paro en el hospital pediátrico', 'Los residentes del principal hospital de niños del país paran por salarios.'),
        ('Strike at the children\'s hospital', 'Residents at the country\'s main children\'s hospital strike over pay.'),
        [([('Parents', 0.05), ('AR_ConflictoSalud', -0.10), ('StateEmployees', 0.03)],
          ('Otorgar un aumento especial', 'El ministro de Salud: "No podemos perder a los mejores pediatras del país."'),
          ('Grant a special raise', 'The health minister: "We cannot lose the country\'s best paediatricians."')),
         ([('Parents', -0.05), ('AR_ConflictoSalud', 0.08), ('Capitalist', 0.02)],
          ('Sostener la pauta salarial', 'La ministra de Economía: "Si cedemos acá, mañana piden todos."'),
          ('Hold the pay guideline', 'The economy minister: "If we give in here, everyone will ask tomorrow."'))])
    dil('AR_DilSwapEEUU', ['_random_,0,0.06', 'AR_ReservasAgotadas,0+(0.15*x)'],
        ('Condiciones del swap con EE.UU.', 'Washington ofrece un swap millonario, pero pide limitar la presencia de China en '
         'infraestructura estratégica.'),
        ('Terms of the US swap', 'Washington offers a huge swap line, but asks to limit China\'s presence in strategic infrastructure.'),
        [([('CurrencyStrength', 0.05), ('AR_ReservasAgotadas', -0.08), ('Patriot', -0.04), ('Farmers', -0.02)],
          ('Aceptar', 'El canciller: "Es el respaldo que necesitamos para que no haya corrida."'),
          ('Accept', 'The foreign minister: "It is the backing we need to prevent a run."')),
         ([('Patriot', 0.04), ('ForeignRelations', -0.03), ('AR_ReservasAgotadas', 0.04)],
          ('Rechazar las condiciones', 'El ministro de Economía: "China es nuestro segundo socio comercial. No podemos elegir."'),
          ('Reject the terms', 'The economy minister: "China is our second trading partner. We cannot pick sides."'))])
    dil('AR_DilTechoBanda', ['_random_,0,0.08', 'AR_BandasCambiarias,0+(0.10*x)', 'AR_BrechaCambiaria,0+(0.10*x)'],
        ('El dólar toca el techo de la banda', 'La presión preelectoral lleva al dólar al límite superior de la banda.'),
        ('The dollar hits the band ceiling', 'Pre-election pressure pushes the dollar to the top of the band.'),
        [([('AR_ReservasAgotadas', 0.08), ('Inflation', -0.02), ('CurrencyStrength', 0.03)],
          ('Vender reservas para defenderla', 'El presidente del Banco Central: "La banda se defiende. Es nuestra palabra."'),
          ('Sell reserves to defend it', 'The central bank governor: "The band will be defended. Our word is at stake."')),
         ([('AR_SaltoCambiario', 0.10), ('Inflation', 0.04), ('Farmers', 0.03)],
          ('Dejarlo subir y ampliar la banda', 'La ministra de Economía: "Que el mercado encuentre su precio."'),
          ('Let it rise and widen the band', 'The economy minister: "Let the market find its price."'))])
    dil('AR_DilAerolineas', ['_random_,0,0.06', 'AR_Privatizaciones,0+(0.10*x)'],
        ('Privatizar la aerolínea de bandera', 'Un grupo inversor ofrece comprar la línea aérea estatal, que pierde dinero.'),
        ('Privatise the flag carrier', 'An investor group offers to buy the loss-making state airline.'),
        [([('Patriot', -0.05), ('StateEmployees', -0.05), ('Capitalist', 0.05), ('TradeUnionist', -0.04)],
          ('Venderla', 'El ministro de Desregulación: "Que la paguen los que vuelan, no todos los argentinos."'),
          ('Sell it', 'The deregulation minister: "Let those who fly pay for it, not every Argentine."')),
         ([('Patriot', 0.04), ('StateEmployees', 0.03), ('Capitalist', -0.03)],
          ('Mantenerla estatal', 'El jefe de Gabinete: "Conecta a provincias que ninguna empresa privada quiere volar."'),
          ('Keep it state-owned', 'The chief of staff: "It connects provinces no private airline wants to serve."'))])
    dil('AR_DilPASO', ['_random_,0,0.05', 'AR_EliminarPASO,0+(0.05*x)'],
        ('Suspender las primarias', 'El oficialismo propone suspender las PASO para ahorrar y ordenar la elección.'),
        ('Suspend the primaries', 'The governing party proposes suspending the open primaries to save money and simplify the election.'),
        [([('Democracy', -0.03), ('Liberal', -0.03), ('Capitalist', 0.02)],
          ('Suspenderlas', 'El ministro del Interior: "Es un gasto inútil que los votantes no quieren."'),
          ('Suspend them', 'The interior minister: "It is a pointless expense voters do not want."')),
         ([('Democracy', 0.02), ('Liberal', 0.02), ('AR_BloqueoLegislativo', -0.04)],
          ('Mantenerlas', 'El vocero: "No vamos a cambiar las reglas a meses de votar."'),
          ('Keep them', 'The spokesman: "We will not change the rules months before a vote."'))])
    dil('AR_DilImputabilidad', ['_random_,0,0.06', 'AR_DesempleoCreciente,0+(0.08*x)'],
        ('Crimen cometido por un menor', 'Un adolescente de 15 años mata a un comerciante en un robo. El país discute bajar la edad '
         'de imputabilidad.'),
        ('Crime committed by a minor', 'A 15-year-old kills a shopkeeper in a robbery. The country debates lowering the age of criminal '
         'responsibility.'),
        [([('Conservatives', 0.06), ('Liberal', -0.05), ('PrisonOvercrowding', 0.02)],
          ('Impulsar la baja a 14 años', 'La ministra de Seguridad: "El que las hace, las paga, tenga la edad que tenga."'),
          ('Push to lower it to 14', 'The security minister: "Whoever commits the crime pays for it, whatever their age."')),
         ([('Conservatives', -0.04), ('Liberal', 0.04), ('Young', 0.02)],
          ('Programa de prevención juvenil', 'La ministra de Desarrollo Humano: "La cárcel no recupera a un chico de 14 años."'),
          ('Youth prevention programme', 'The human development minister: "Prison does not reform a 14-year-old."'))])
    dil('AR_DilGlaciares', ['_random_,0,0.06', 'AR_LeyGlaciares,0+(0.06*x)'],
        ('Gobernadores mineros piden cambiar la ley de glaciares', 'Provincias cordilleranas reclaman flexibilizar la ley para '
         'habilitar proyectos de cobre por miles de millones.'),
        ('Mining governors want the glacier law changed', 'Andean provinces demand the law be relaxed to allow multi-billion copper '
         'projects.'),
        [([('ForeignInvestment', 0.05), ('Environmentalist', -0.08), ('Capitalist', 0.04)],
          ('Flexibilizarla', 'El secretario de Minería: "El cobre es el próximo Vaca Muerta."'),
          ('Relax it', 'The mining secretary: "Copper is the next Vaca Muerta."')),
         ([('Environmentalist', 0.06), ('ForeignInvestment', -0.03), ('Environment', 0.01)],
          ('Mantenerla', 'La secretaria de Ambiente: "El agua vale más que el cobre."'),
          ('Keep it', 'The environment secretary: "Water is worth more than copper."'))])
    dil('AR_DilDolaresColchon', ['_random_,0,0.06', 'AR_InocenciaFiscal,0+(0.06*x)'],
        ('Los dólares del colchón', 'Los argentinos guardan más de 200.000 millones de dólares fuera del sistema. ¿Cómo atraerlos?'),
        ('Mattress dollars', 'Argentines keep over 200 billion dollars outside the banking system. How do you lure them in?'),
        [([('CurrencyStrength', 0.04), ('TaxEvasion', 0.04), ('Corruption', 0.02), ('MiddleIncome', 0.03)],
          ('Que se usen sin preguntas', 'La ministra de Economía: "Cada dólar que sale del colchón es inversión y consumo."'),
          ('Let them be spent, no questions asked', 'The economy minister: "Every dollar out of the mattress means investment and spending."')),
         ([('TaxEvasion', -0.03), ('Corruption', -0.02), ('Wealthy', -0.03)],
          ('Exigir declarar el origen', 'El titular del organismo antilavado: "No podemos ser una lavandería."'),
          ('Require the source to be declared', 'The anti-money-laundering chief: "We cannot become a laundromat."'))])
    dil('AR_DilCierreINTA', ['_random_,0,0.05', 'AR_CierreOrganismos,0+(0.08*x)'],
        ('Cierre del instituto agropecuario', 'El plan de ajuste incluye cerrar estaciones experimentales del INTA en el interior.'),
        ('Closing the farm research institute', 'The austerity plan includes closing agricultural research stations in the provinces.'),
        [([('Farmers', -0.05), ('StateEmployees', -0.04), ('Capitalist', 0.03), ('Technology', -0.01)],
          ('Cerrarlas', 'El ministro de Desregulación: "Que la investigación la pague quien la aprovecha."'),
          ('Close them', 'The deregulation minister: "Let those who benefit from research pay for it."')),
         ([('Farmers', 0.04), ('StateEmployees', 0.02)],
          ('Mantenerlas', 'El secretario de Agricultura: "Sin el INTA, los pequeños productores quedan solos."'),
          ('Keep them', 'The agriculture secretary: "Without the institute, small farmers are on their own."'))])
    dil('AR_DilReformaCGT', ['_random_,0,0.06', 'AR_ReformaLaboral,0+(0.10*x)'],
        ('La CGT ofrece negociar la reforma laboral', 'La central obrera promete no hacer paros si se mantienen las cuotas sindicales '
         'y los convenios por actividad.'),
        ('The union federation offers to negotiate', 'The labour federation promises no strikes if union dues and sector-wide '
         'agreements are kept.'),
        [([('TradeUnionist', 0.05), ('AR_ParoCGT', -0.08), ('Capitalist', -0.04)],
          ('Negociar con la CGT', 'El ministro del Interior: "Una reforma con acuerdo dura más."'),
          ('Negotiate with the unions', 'The interior minister: "A reform with consensus lasts longer."')),
         ([('TradeUnionist', -0.06), ('AR_ParoCGT', 0.08), ('Capitalist', 0.05)],
          ('Avanzar sin ellos', 'La ministra de Capital Humano: "Los privilegios sindicales se terminan."'),
          ('Push ahead without them', 'The human capital minister: "Union privileges are over."'))])
    dil('AR_DilImportaciones', ['_random_,0,0.06', 'AR_CierrePymes,0+(0.12*x)', 'AR_AtrasoCambiario,0+(0.06*x)'],
        ('Los industriales piden frenar las importaciones', 'Textiles, metalúrgicas y fabricantes de electrodomésticos denuncian '
         'competencia desleal de productos importados.'),
        ('Manufacturers demand curbs on imports', 'Textile mills, metalworkers and appliance makers complain of unfair competition from '
         'imports.'),
        [([('SelfEmployed', 0.04), ('TradeUnionist', 0.04), ('AR_CierrePymes', -0.06), ('Inflation', 0.02), ('MiddleIncome', -0.02)],
          ('Subir aranceles', 'El secretario de Industria: "Sin industria no hay empleo."'),
          ('Raise tariffs', 'The industry secretary: "Without industry there are no jobs."')),
         ([('MiddleIncome', 0.03), ('Inflation', -0.02), ('AR_CierrePymes', 0.05), ('TradeUnionist', -0.03)],
          ('Mantener la apertura', 'El ministro de Economía: "Los argentinos merecen precios internacionales."'),
          ('Keep markets open', 'The economy minister: "Argentines deserve international prices."'))])

    # =========================================================================================
    # CADENAS EN SITUACIONES EXISTENTES: se suman causas para que unas crisis desencadenen otras
    # =========================================================================================
    more = {
        'AR_Piquetes': ['AR_DesempleoCreciente,0+(0.15*x)', 'AR_PerdidaPoderAdquisitivo,0+(0.10*x)'],
        'AR_ParoCGT': ['AR_PerdidaPoderAdquisitivo,0+(0.12*x)', 'AR_DesempleoCreciente,0+(0.08*x)', 'AR_Motosierra,0+(0.05*x)'],
        'AR_RiesgoPaisAlto': ['AR_SuperavitFiscal,0-(0.12*x)', 'AR_BloqueoLegislativo,0+(0.06*x)'],
        'AR_ReservasAgotadas': ['AR_AcuerdoEEUU,0-(0.10*x)', 'AR_BandasCambiarias,0+(0.05*x)', 'AR_InocenciaFiscal,0-(0.04*x)',
                                'AR_Blanqueo,0-(0.05*x)', 'AR_InversionRecord,0-(0.08*x)'],
        'AR_BrechaCambiaria': ['AR_BandasCambiarias,0-(0.10*x)', 'AR_TasaBCRA,0-(0.08*x)'],
        'AR_CorridaCambiaria': ['AR_TasaBCRA,0-(0.08*x)', 'AR_AcuerdoEEUU,0-(0.08*x)', 'AR_EscandaloCorrupcion,0+(0.05*x)'],
        'AR_Grieta': ['AR_EscandaloCorrupcion,0+(0.05*x)', 'AR_MarchasJubilados,0+(0.04*x)'],
        'AR_EstabilidadMacro': ['AR_SuperavitFiscal,0+(0.10*x)', 'AR_Desinflacion,0+(0.10*x)'],
        'AR_CrisisEnergetica': ['AR_InversionRecord,0-(0.05*x)'],
    }
    by = {s['name']: s for s in C.SITUATIONS}
    for name, causes in more.items():
        by[name]['causes'].extend(causes)

    # Nuevas políticas en el escenario 2023 (las que no se listan arrancan sin implementar)
    C.START_2023.update({'AR_AcuerdoEEUU': 0.2, 'AR_LeyDiscapacidad': 0.6, 'AR_EmergenciaPediatrica': 0.6, 'AR_ControlANMAT': 0.5,
                         'AR_Ganancias4ta': 0.1, 'AR_EliminarPASO': 1.0, 'AR_TarjetaAlimentar': 0.7,
                         'AR_ObraPublicaNacional': 0.6, 'AR_LeyGlaciares': 0.6, 'AR_Hidrovia': 0.3, 'AR_TasaBCRA': 0.9,
                         'AR_ParitariasEstatales': 0.6, 'AR_Desregulacion': 0.1})


# =============================================================================================
# Enlaces causales propios de Argentina (overrides del país): la cadena de transmisión
# Host -> Target. Reemplazan o agregan el enlace sólo en las partidas argentinas.
# =============================================================================================
CHAIN_OVERRIDES = [
    # (archivo, causa, efecto, ecuación, demora)
    ('Dolar a precios', 'CurrencyStrength', 'Inflation', '0.08-(0.16*x)', 1),
    ('Inflacion a pobreza', 'Inflation', 'PovertyRate', '0+(0.20*x)', 2),
    ('Inflacion a sectores bajos', 'Inflation', 'Poor', '0-(0.12*x)', 0),
    ('Inflacion a jubilados', 'Inflation', 'Retired', '0-(0.10*x)', 0),
    ('Inflacion a sindicatos', 'Inflation', 'TradeUnionist', '0-(0.08*x)', 0),
    ('Inflacion a confianza empresaria', 'Inflation', 'BusinessConfidence', '0-(0.08*x)', 0),
    ('Desempleo a pobreza', 'Unemployment', 'PovertyRate', '0+(0.12*x)', 2),
    ('Pobreza a delito', 'PovertyRate', 'CrimeRate', '0+(0.08*x)', 4),
    ('Dolar a turismo', 'CurrencyStrength', 'Tourism', '0.05-(0.08*x)', 2),
    ('Dolar a clase media', 'CurrencyStrength', 'MiddleIncome', '0+(0.06*x)', 0),
    ('Dolar a campo', 'CurrencyStrength', 'Farmers', '0.04-(0.08*x)', 0),
    ('Pobreza a sectores bajos', 'PovertyRate', 'Poor', '0-(0.10*x)', 0),
]

# =============================================================================================
# Referencia 2026: las políticas que aplicó el gobierno entre 2024 y 2026 (para simulate.py)
# =============================================================================================
START_2026 = {
    'AR_Cepo': 0.33, 'AR_Retenciones': 0.7, 'AR_AcuerdoFMI': 0.5, 'AR_RIGI': 1.0, 'AR_VacaMuerta': 0.7, 'AR_Litio': 0.6,
    'AR_Coparticipacion': 0.25, 'AR_SubsidiosEnergia': 0.33, 'AR_SubsidiosTransporte': 0.35, 'AR_MovilidadJubilatoria': 0.33,
    'AR_PlanesSociales': 0.3, 'AR_ProtocoloAntipiquetes': 1.0, 'AR_ReformaLaboral': 1.0, 'AR_ModeloSindical': 0.6,
    'AR_Monotributo': 0.5, 'AR_BienesPersonales': 0.25, 'AR_UniversidadPublica': 0.4, 'AR_CONICET': 0.3, 'AR_ReclamoMalvinas': 0.5,
    'AR_Mercosur': 0.5, 'AR_Narcotrafico': 0.7, 'AR_BonoNavidad': 0.2, 'AR_BandasCambiarias': 0.6, 'AR_TasaBCRA': 0.5,
    'AR_Motosierra': 0.8, 'AR_DeficitCero': 1.0, 'AR_Privatizaciones': 0.5, 'AR_Desregulacion': 0.8,
    'AR_FacultadesDelegadas': 0.5, 'AR_AcuerdoEEUU': 0.8, 'AR_LeyDiscapacidad': 0.4, 'AR_EmergenciaPediatrica': 0.4,
    'AR_ControlANMAT': 0.4, 'AR_InocenciaFiscal': 1.0, 'AR_Blanqueo': 0.3, 'AR_Ganancias4ta': 0.5, 'AR_EliminarPASO': 1.0,
    'AR_RegimenPenalJuvenil': 0.5, 'AR_TarjetaAlimentar': 0.7, 'AR_ObraPublicaNacional': 0.15, 'AR_CierreOrganismos': 0.5,
    'AR_LeyGlaciares': 0.6, 'AR_Hidrovia': 0.5, 'AR_ParitariasEstatales': 0.35,
}
