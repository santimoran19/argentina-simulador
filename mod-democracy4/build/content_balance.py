# -*- coding: utf-8 -*-
"""Balance y arranque de la Argentina, probados en el juego (Democracy 4 1.67) y calibrados con sus fórmulas reales.

Orden (ver content.py): apply_start() antes de content_merge; extend() después de content_merge y antes de content_base.

- Arranque: políticas del juego con los niveles de una configuración argentina que funcionaba en el juego
  (LATAM_BASELINE), corregidos con valores argentinos reales de diciembre de 2023 (ARG_ON_TOP) y sin las que no
  existen en Argentina (NOT_IN_ARGENTINA). Los niveles de ARG_ON_TOP salen de una búsqueda con build/d4sim.py que
  deja al país, después de los turnos de preparación, cerca de los indicadores reales.
- Deuda inicial: la deuda bruta real (US$ 370.700 millones). Las partidas mostraron que el juego tolera relaciones
  deuda/PBI de 0,9 a 1,3 sin disparar la crisis de deuda.
- Huelga general del juego: en Argentina cuesta lo que un paro real (BASE_EFFECT_OVERRIDES).
- Golpes macro de las crisis argentinas a la mitad y efectos de políticas sobre el PBI al 60 %: se suman entre sí y
  con los del juego.
- Eventos y dilemas con la mecánica del juego; dilemas sin guion bajo en el nombre.
"""

# Golpes macro de las situaciones argentinas: a la mitad (se suman entre sí y con las del juego).
MACRO = ('GDP', 'Unemployment', 'CurrencyStrength', 'BusinessConfidence', 'ForeignInvestment')
SITUATION_MACRO_SCALE = 0.5
POLICY_GDP_SCALE = 0.6

TRAITS = {
    'Inflation': '+0.03+(0.03*x)',
    'TaxEvasion': '+0.04+(0.03*x)',
    'Corruption': '+0.03+(0.02*x)',
    'Polarization': '+0.04+(0.03*x)',
    'BrainDrain': '+0.02+(0.02*x)',
    'BlackMarket': '+0.03+(0.02*x)',
}
DROP_CHAINS = {'Dolar a precios'}   # reemplazaba el enlace dólar->inflación del juego por uno mucho más fuerte

# Segunda partida de prueba: con la configuración anterior de políticas del juego, en el primer turno de preparación
# el delito saltaba de 0,23 a 0,95, la salud de 0,86 a 0,45 y el PBI caía a la mitad, sin que ningún efecto del mod
# lo explicara: era la combinación de políticas base. Se reemplaza por los niveles de arranque de una partida
# argentina que sí funcionaba en este juego (partida guardada del jugador con otro mod de Argentina; sólo políticas
# del juego base, no las de ese mod). Encima van los ajustes argentinos de ARG_ON_TOP.
LATAM_BASELINE = {
    'AbortionLaw': 0.75, 'AdultEducationSubsidies': 0.6, 'AgricultureSubsidies': 0.1, 'AirlineTax': 0.5, 'AlcoholLaw': 0.4,
    'AlcoholTax': 0.25, 'AntiCorruptionAgency': 0.15, 'AntibioticsBan': 0.6, 'ArtsSubsidies': 0.35, 'BicycleSubsidies': 0.1,
    'BorderControls': 0.5, 'BusLanes': 0.6, 'BusSubsidies': 0.25, 'CCTVCameras': 0.5, 'CapitalControls': 0.25,
    'CapitalGainsTax': 0.6, 'CarTax': 0.25, 'ChildBenefit': 0.9, 'ChildcareProvision': 0.6, 'CleanEnergySubsidies': 0.1,
    'CompulsoryForeignLanguageClasses': 0.35, 'ConsumerRights': 0.6, 'CorporationTax': 0.7, 'Creationism': 0.5, 'DisabilityBenefit': 0.83,
    'DivertedProfitsTax': 0.52, 'DrugEnforcement': 0.5, 'DrugTreatment': 0.75, 'ElectricCarsInitiative': 0.1, 'ExecutiveTermLength': 0.25,
    'ExecutiveTermLimit': 1.0, 'FamilyPlanning': 0.15, 'FinancialTransactionsTax': 0.25, 'FoodStamps': 0.8, 'FoodStandards': 0.5,
    'ForeignAid': 0.35, 'ForeignInvestmentRestrictions': 0.35, 'FreeSchoolMeals': 0.25, 'Gambling': 0.8, 'GameHunting': 0.5,
    'GayMarriage': 1.0, 'GenderDiscriminationAct': 0.75, 'GenderTransition': 0.75, 'GovernmentSubsidiesForUnions': 0.8, 'HandgunLaws': 0.5,
    'HelicopterMoney': 0.6, 'IDCards': 0.5, 'ImmigrationRules': 0.78, 'ImportTarrifs': 0.6, 'IncomeTax': 0.62,
    'InheritanceTax': 0.4, 'IntellectualPropertyRights': 0.68, 'IntelligenceServices': 0.52, 'JudiciaryIndependence': 0.2, 'LaborDayBankHoliday': 0.5,
    'LabourLaws': 0.95, 'LegalAid': 0.75, 'LegaliseProstitution': 0.0, 'LimitAutomatedTrading': 0.0, 'LuxuryGoodsTax': 0.05,
    'MansionTax': 0.1, 'MarriedTaxAllowance': 0.25, 'MaternityLeave': 0.3, 'MicrogenerationGrants': 0.5, 'MilitarySpending': 0.1,
    'MinimumWage': 0.25, 'Narcotics': 0.17, 'NuclearFission': 0.5, 'OrganDonation': 0.5, 'OrganicSubsidy': 0.75,
    'PayrollTax': 0.85, 'PetrolTax': 0.51, 'PoliceForce': 0.62, 'PollutionControls': 0.5, 'PressFreedom': 0.72,
    'PrisonRegime': 0.45, 'PrisonerTagging': 0.32, 'PrisonerVoting': 0.8, 'Prisons': 0.5, 'PropertyTax': 0.88,
    'PublicLibraries': 0.34, 'Punitivewealthtax': 0.7, 'RaceDiscriminationAct': 0.5, 'RacialProfiling': 0.25, 'RefugeePolicy': 0.8,
    'RentControls': 0.28, 'RetirementAge': 0.47, 'RightToPrivacy': 0.5, 'RoadBuilding': 0.48, 'RubberBullets': 0.5,
    'SalesTax': 0.45, 'SchoolBuses': 0.61, 'ScienceFunding': 0.22, 'SelectiveSchooling': 0.5, 'SmallBusinessGrants': 0.1,
    'SmartMeterProgram': 0.81, 'StateAirline': 0.6, 'StateBroadcaster': 0.7, 'StateHealthService': 0.65, 'StateHousing': 0.45,
    'StatePensions': 0.62, 'StatePostService': 0.5, 'StateRail': 0.45, 'StateSchools': 0.75, 'StateWater': 0.8,
    'StemCells': 0.25, 'TearGas': 0.2, 'TobaccoTax': 0.35, 'TollRoads': 0.66, 'UnemployedBenefit': 0.75,
    'UniversityGrants': 0.2, 'competitionlaw': 0.5,
}

DROP_FROM_BASELINE = {'HelicopterMoney',   # la emisión la representa la política de emisión del juego (cepo/BCRA)
                      'Creationism'}
# Calibración con las fórmulas reales del juego (archivos data/simulation de Democracy 4 1.67 + build/d4sim.py):
# se buscaron, dentro de rangos realistas para la Argentina de diciembre de 2023, los niveles que después de los
# turnos de preparación dejan al país cerca de los indicadores reales (escala del juego): PBI 0,40 (en recesión),
# desempleo 0,40, inflación 0,72 (211 % anual), peso 0,08 (brecha enorme), pobreza 0,58 (41,7 %), delito 0,62,
# salud 0,62, igualdad 0,45 (Gini ~0,45), confianza empresaria 0,30. Después se ajustó con las partidas reales.
ARG_ON_TOP = {
    # Revisión final contra la Argentina real (venían de la configuración de otra partida)
    'StateAirline': 1.0,               # Aerolíneas Argentinas, 100 % estatal
    'StateRail': 0.8,                  # Trenes Argentinos y Belgrano Cargas
    'GovernmentSubsidiesForUnions': 0.2,   # los gremios se financian con aportes obligatorios (AR_ModeloSindical)
    'ForeignAid': 0.05,                # Argentina casi no es donante
    'SchoolBuses': 0.2,
    'MicrogenerationGrants': 0.2,      # ley de generación distribuida, con poco subsidio
    'CleanEnergySubsidies': 0.3,       # programa RenovAr
    # Todo realista (pedido del jugador): impuestos que existían en dic-2023
    'FinancialTransactionsTax': 0.6,   # impuesto al cheque
    'CapitalGainsTax': 0.3,            # ganancias de capital de personas: 15 % desde 2018
    # Quinta partida: el delito arrancaba en 0,96 y la salud en 0,41. Políticas argentinas reales que faltaban:
    'CommunityPolicing': 0.3,          # policía de cercanía / cuadrantes (cobertura parcial)
    'CompulsoryFoodLabelling': 0.8,    # Ley de Etiquetado Frontal (2021)
    'FamilyPlanning': 0.4,             # Salud sexual y procreación responsable (Ley 25.673)
    'FreeSchoolMeals': 0.4,            # comedores escolares
    'WorkSafetyLaw': 0.6,              # riesgos del trabajo (ART)
    'CompulsorySchoolSports': 0.5,     # educación física obligatoria
    'FoodStandards': 0.6,              # ANMAT / SENASA
    'AlcoholTax': 0.45,   # impuestos internos al alcohol
    'ArmedPolice': 0.8,   # la policía argentina anda armada
    'CCTVCameras': 0.6,
    'CapitalControls': 0.75,   # cepo
    'ChildBenefit': 0.72,   # AUH
    'CorporationTax': 0.5,
    'DisabilityBenefit': 0.4,
    'DrugTreatment': 0.75,
    'FoodStamps': 0.8,   # Tarjeta Alimentar
    'ForeignInvestorTaxBreaks': 0.1,
    'Gambling': 0.63,
    'HandgunLaws': 0.5,
    'IDCards': 0.9,   # DNI obligatorio
    'ImportTarrifs': 0.9,   # aranceles altos y licencias SIRA
    'IncomeTax': 0.41,   # Ganancias: eliminado para casi todos los asalariados en sept-2023
    'IntelligenceServices': 0.3,
    'LabourLaws': 0.5,
    'MinimumWage': 0.25,   # salario mínimo licuado por la inflación
    'PayrollTax': 0.67,   # cargas sociales altas
    'PhoneTapping': 0.3,   # escuchas con orden judicial
    'PoliceForce': 0.72,   # Argentina tiene muchos policías por habitante
    'PrisonRegime': 0.49,
    'PrisonerTagging': 0.34,
    'PropertyTax': 0.4,
    'QuantitativeEasing': 0.8,   # emisión para financiar al Tesoro
    'SalesTax': 0.8,   # IVA 21 %
    'ScienceFunding': 0.35,   # CONICET
    'StateEnergy': 0.35,   # YPF/ENARSA
    'StateHealthService': 0.6,   # hospitales nacionales; el grueso es provincial
    'StateHousing': 0.2,
    'StateSchools': 0.8,
    'UnemployedBenefit': 0.63,
    'UniversityGrants': 0.6,   # universidad pública y gratuita
}
NOT_IN_ARGENTINA = {'LuxuryGoodsTax',   # los impuestos internos son sobre todo al alcohol y al tabaco (AlcoholTax, TobaccoTax)
                    'OrganicSubsidy', 'SmartMeterProgram', 'RacialProfiling', 'DivertedProfitsTax',   # venían de otra partida; no son argentinas
                    'InheritanceTax',   # no hay impuesto a la herencia nacional
                    'MansionTax'}   # el patrimonio lo grava Bienes Personales
# Tercera partida de prueba: al empezar el ajuste se activó la huelga general del juego, que resta 0,3-0,5 de PBI por
# turno mientras dura, y el PBI pasó de 0,37 a 0 en dos turnos. En la realidad la CGT hizo tres paros generales de un
# día en dos años: se reemplaza ese efecto, sólo en Argentina, por uno del tamaño de un paro real.
BASE_EFFECT_OVERRIDES = [
    ('Paro general de un dia', 'GeneralStrike', 'GDP', '-0.03-(0.04*x)', 2),
]
# Deuda bruta real. (Las partidas mostraron que el juego tolera relaciones deuda/PBI de 0,9 a 1,3 sin crisis de deuda.)
STARTING_DEBT = 370000   # deuda bruta real del Estado nacional a dic-2023: US$ 370.700 millones
ECONOMIC_CYCLE_START = 0.4   # la economía mundial en 2023 no estaba en recesión (la recesión era argentina)

START_FIX = {
    'AR_VacaMuerta': 0.15,        # en 2023 el desarrollo era privado; el subsidio estatal, chico
    'AR_EmisionTesoro': 0.8,
    'AR_Cepo': 0.75,
    'AR_TasaBCRA': 0.63,          # tasa de política monetaria del 133 %
    'AR_Mercosur': 0.1,           # economía muy cerrada
    'AR_BonoNavidad': 0.05,
    'AR_ParitariasEstatales': 0.5,
}


def _scale(formula, k):
    import content_merge as M
    a, b = M.linear(formula)
    return M.fmt(a * k, b * k)


def apply_start(C):
    """Antes de content_merge: arranque de las políticas del juego y de las argentinas."""
    keep = {k: v for k, v in C.COUNTRY_POLICIES.items() if k.startswith('_')}
    C.COUNTRY_POLICIES.clear()
    C.COUNTRY_POLICIES.update(keep)
    C.COUNTRY_POLICIES.update({k: v for k, v in LATAM_BASELINE.items() if k not in DROP_FROM_BASELINE})
    C.COUNTRY_POLICIES.update(ARG_ON_TOP)
    for k in NOT_IN_ARGENTINA:
        C.COUNTRY_POLICIES.pop(k, None)
    C.COUNTRY_CONFIG['economic_cycle_start'] = ECONOMIC_CYCLE_START
    C.COUNTRY_CONFIG['starting_debt'] = STARTING_DEBT
    C.START_2023.update(START_FIX)


def extend(C):
    """Después de content_merge, antes de content_base."""
    for s in C.SITUATIONS:
        if not s['name'].startswith('AR_'):
            continue
        out = []
        for e in s['effects']:
            parts = e.split(',')
            if parts[0] in MACRO:
                parts[1] = _scale(parts[1], SITUATION_MACRO_SCALE)
            out.append(','.join(parts))
        s['effects'] = out
    for p in C.POLICIES:
        out = []
        for e in p['effects']:
            parts = e.split(',')
            if parts[0] == 'GDP':
                parts[1] = _scale(parts[1], POLICY_GDP_SCALE)
            out.append(','.join(parts))
        p['effects'] = out
    # Eventos y dilemas con la mecánica del juego (ver archivos data/simulation/events y dilemmas):
    # - un evento ocurre cuando su valor llega a 1; los del juego llevan azar y condiciones que lo llevan ahí cuando
    #   corresponde, y se castigan a sí mismos (-0,9) para no repetirse enseguida. Los del mod llegaban como mucho a
    #   0,67: nunca podían ocurrir.
    # - los dilemas del juego usan azar de 0,2 a 0,8.
    import content_merge as M
    def reshape(items, rnd, cond_max, rnd_only):
        for it in items:
            conds, out = [], []
            for i in it['influences']:
                parts = i.split(',')
                if parts[0] != '_random_':
                    conds.append(parts)
            tops = []
            for parts in conds:
                a0, b0 = M.linear(parts[1])
                tops.append(max(a0, a0 + b0, 0.0))
            total = sum(tops)
            if conds and total > 0:
                out.append('_random_,{:g},{:g}'.format(*rnd))
                k = cond_max / total
                for parts in conds:
                    parts = list(parts)
                    parts[1] = _scale(parts[1], k)
                    out.append(','.join(parts))
            else:
                out.append('_random_,{:g},{:g}'.format(*rnd_only))
            it['influences'] = out
    reshape(C.EVENTS, (0.3, 0.8), 0.35, (0.4, 1.04))
    reshape(C.DILEMMAS, (0.2, 0.8), 0.3, (0.2, 0.8))
    for e in C.EVENTS:
        if not any(t == e['name'] for t, _a, _d in e['grudges']):
            e['grudges'].append((e['name'], -0.9, 0.83))
    # Nombres de dilemas sin guion bajo: el juego identifica las opciones como <dilema>_0, <dilema>_1, y ningún dilema del
    # juego ni de los mods publicados lleva '_' en el nombre. Con 'AR_Dil...' los dilemas aparecían sin texto.
    for d in C.DILEMMAS:
        d['name'] = d['name'].replace('_', '')
    C.COUNTRY_OVERRIDES[:] = [(l, t, TRAITS.get(t, eq)) for l, t, eq in C.COUNTRY_OVERRIDES]
    C.CHAIN_OVERRIDES[:] = [c for c in C.CHAIN_OVERRIDES if c[0] not in DROP_CHAINS] + BASE_EFFECT_OVERRIDES
