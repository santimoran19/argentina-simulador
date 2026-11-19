# -*- coding: utf-8 -*-
"""Balance probado en el juego (partida de prueba con Democracy 4 1.67, noviembre de 2026).

Qué pasó: en los ~16 turnos de preparación que el juego simula antes de entregarte el país, la economía colapsó
(PBI 0,58 -> 0, desempleo 32 % -> 77 %, peso 0,37 -> 0) y el jugador recibió un país destruido. Causas:

1. Muchas crisis argentinas activas a la vez, cada una con su golpe fijo al PBI/desempleo/peso: sumadas, -0,17 de
   PBI por turno, más los efectos de las políticas.
2. El rasgo "inercia inflacionaria" sumaba +0,12 de inflación por turno, fijo, y el enlace dólar->precios
   reemplazaba el del juego: espiral inflación -> peso -> inflación.
3. Un gasto inicial de casi el doble de lo recaudado (la Argentina real gastaba ~1,3 veces), con escuelas y
   hospitales cargados como gasto nacional (en Argentina los pagan sobre todo las provincias).

Este módulo se aplica después de content_merge y antes de content_base (así los enlaces con el juego se centran en
los valores de arranque ya corregidos).
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
# Probabilidad de eventos y dilemas: en la partida de prueba los eventos del juego llegaban a ~0,9 de valor y los
# argentinos a 0,15 como máximo, así que no salió ninguno en 8 turnos. Se llevan a la escala del juego.
EVENT_INFLUENCE_SCALE = 4.0
DILEMMA_INFLUENCE_SCALE = 2.5

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
# salud 0,62, igualdad 0,45 (Gini ~0,45), confianza empresaria 0,30. Resultado simulado: 0,45 / 0,43 / 0,71 / 0,08 /
# (ver warmup.py), estable 8 turnos sin tocar nada (el peso se sigue debilitando, como en la realidad).
ARG_ON_TOP = {
    'AlcoholTax': 0.23,
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
    'StateHealthService': 0.75,
    'StateHousing': 0.2,
    'StateSchools': 0.8,
    'UnemployedBenefit': 0.63,
    'UniversityGrants': 0.6,   # universidad pública y gratuita
}
NOT_IN_ARGENTINA = {'InheritanceTax',   # no hay impuesto a la herencia nacional
                    'LuxuryGoodsTax', 'MansionTax'}   # el patrimonio lo grava Bienes Personales
# Tercera partida de prueba: al empezar el ajuste se activó la huelga general del juego, que resta 0,3-0,5 de PBI por
# turno mientras dura, y el PBI pasó de 0,37 a 0 en dos turnos. En la realidad la CGT hizo tres paros generales de un
# día en dos años: se reemplaza ese efecto, sólo en Argentina, por uno del tamaño de un paro real.
BASE_EFFECT_OVERRIDES = [
    ('Paro general de un dia', 'GeneralStrike', 'GDP', '-0.03-(0.04*x)', 2),
]
# La deuda "efectiva" del juego baja la confianza empresaria y la estabilidad y dispara la crisis de deuda. Se cuenta
# la deuda con privados y organismos (FMI), no la intra-sector público (BCRA, ANSES), que no presiona igual.
STARTING_DEBT = 240000
ECONOMIC_CYCLE_START = 0.4   # la economía mundial en 2023 no estaba en recesión (la recesión era argentina)

# (ya no se usa: reemplazado por LATAM_BASELINE + ARG_ON_TOP)
COUNTRY_POLICY_FIX_OLD = {
    'StateHealthService': 0.55,   # hospitales: sobre todo provinciales
    'StateSchools': 0.50,         # escuelas: provinciales
    'MilitarySpending': 0.10,     # Defensa ~0,5 % del PBI
    'ChildcareProvision': 0.15,
    'StateHousing': 0.20,
    'SalesTax': 0.85,             # IVA del 21 %, de los más altos del mundo
    'CorporationTax': 0.70,       # Ganancias de sociedades del 35 %
}
START_FIX = {
    'AR_VacaMuerta': 0.15,        # en 2023 el desarrollo era privado; el subsidio estatal, chico
    'AR_EmisionTesoro': 0.8,
    'AR_Cepo': 0.75,
    'AR_TasaBCRA': 0.63,          # tasa de política monetaria del 133 %
    'AR_Mercosur': 0.1,           # economía muy cerrada
    'AR_BonoNavidad': 0.05,
    'AR_ParitariasEstatales': 0.5,
}
BASE_START_FIX = {'StateRail': 0.45, 'StateEnergy': 0.35}


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
    import content_base as B
    B.BASE_START_2023.update(BASE_START_FIX)
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
    for items, k in ((C.EVENTS, EVENT_INFLUENCE_SCALE), (C.DILEMMAS, DILEMMA_INFLUENCE_SCALE)):
        for it in items:
            out = []
            for i in it['influences']:
                parts = i.split(',')
                if parts[0] == '_random_':
                    parts[2] = '{:g}'.format(min(0.6, float(parts[2]) * k))
                else:
                    import content_merge as M
                    a0, b0 = M.linear(parts[1])
                    top = max(abs(a0), abs(a0 + b0)) * k
                    parts[1] = _scale(parts[1], k * min(1.0, 0.5 / top) if top else k)   # tope 0,5 por término
                out.append(','.join(parts))
            it['influences'] = out
    C.COUNTRY_OVERRIDES[:] = [(l, t, TRAITS.get(t, eq)) for l, t, eq in C.COUNTRY_OVERRIDES]
    C.CHAIN_OVERRIDES[:] = [c for c in C.CHAIN_OVERRIDES if c[0] not in DROP_CHAINS] + BASE_EFFECT_OVERRIDES
