# -*- coding: utf-8 -*-
"""Interacciones con lo que ya trae Democracy 4.

El juego base tiene sus propias políticas (jubilaciones, salario mínimo, aranceles, salud pública, universidades,
control de capitales...). Este módulo hace que esas políticas también muevan las situaciones argentinas, así una
decisión tomada con una política del juego tiene las mismas consecuencias que la equivalente del mod.

Además fija el valor inicial de algunas políticas base que en la Argentina de 2023 existían y que el país modelo no
tenía (aranceles altos, empresas estatales), y deja apagadas las del juego que el mod reemplaza con más detalle.
"""

# Política del juego base -> qué situaciones argentinas mueve. Fórmulas: x = nivel de la política (0 a 1).
BASE_LINKS = {
    # Dólar, reservas y riesgo
    'AR_BrechaCambiaria': ['CapitalControls,0+(0.35*x)', 'QuantitativeEasing,0+(0.10*x)'],
    'AR_ReservasAgotadas': ['CapitalControls,0-(0.05*x)', 'QuantitativeEasing,0+(0.08*x)', 'ForeignInvestorTaxBreaks,0-(0.04*x)'],
    'AR_RiesgoPaisAlto': ['JudiciaryIndependence,0.06-(0.06*x)', 'QuantitativeEasing,0+(0.05*x)'],
    'AR_InversionRecord': ['ForeignInvestorTaxBreaks,0+(0.08*x)', 'CorporationTax,0.05-(0.05*x)', 'JudiciaryIndependence,0+(0.04*x)'],
    # Bolsillo, consumo y empleo
    'AR_PerdidaPoderAdquisitivo': ['MinimumWage,0.08-(0.08*x)', 'StatePensions,0.06-(0.06*x)', 'SalesTax,0+(0.05*x)',
                                   'ChildBenefit,0.04-(0.04*x)'],
    'AR_Recesion': ['SalesTax,0+(0.04*x)', 'IncomeTax,0+(0.04*x)', 'CorporationTax,0+(0.04*x)', 'SmallBusinessGrants,0-(0.04*x)'],
    'AR_CierrePymes': ['ImportTarrifs,0.10-(0.10*x)', 'PayrollTax,0+(0.06*x)', 'SmallBusinessGrants,0-(0.06*x)',
                       'EnterpriseInvestmentScheme,0-(0.03*x)'],
    'AR_DesempleoCreciente': ['LabourLaws,0+(0.04*x)', 'PayrollTax,0+(0.04*x)'],
    'AR_SuperCosecha': ['AgricultureSubsidies,0+(0.06*x)'],
    # Calle y sindicatos
    'AR_Piquetes': ['UnemployedBenefit,0.06-(0.06*x)', 'ArmedPolice,0-(0.04*x)'],
    'AR_ParoCGT': ['LabourLaws,0.10-(0.10*x)', 'MinimumWage,0.06-(0.06*x)'],
    'AR_MarchasJubilados': ['StatePensions,0.15-(0.15*x)', 'RetirementAge,0+(0.04*x)'],
    # Servicios públicos
    'AR_ConflictoSalud': ['StateHealthService,0.15-(0.15*x)'],
    'AR_ConflictoUniversitario': ['UniversityGrants,0.12-(0.12*x)', 'ScienceFunding,0.04-(0.04*x)'],
    'AR_CrisisDiscapacidad': ['DisabilityBenefit,0.12-(0.12*x)'],
    # Instituciones y mundo
    'AR_EscandaloCorrupcion': ['JudiciaryIndependence,0.08-(0.08*x)'],
    'AR_CrisisMigratoria': ['BorderControls,0.05-(0.05*x)'],
}

# Políticas del juego base que la Argentina de diciembre de 2023 tenía activas
BASE_START_2023 = {
    'ImportTarrifs': 0.7,          # licencias de importación (SIRA) y aranceles altos
    'SmallBusinessGrants': 0.3,
    'StateAirline': 1.0,           # aerolínea de bandera estatal
    'StateRail': 0.8,              # trenes estatales
    'StateEnergy': 0.5,            # petrolera y empresa de energía con mayoría estatal
    'AgricultureSubsidies': 0.1,
}


def extend(C):
    by = {s['name']: s for s in C.SITUATIONS}
    for name, causes in BASE_LINKS.items():
        by[name]['causes'].extend(causes)
    C.COUNTRY_POLICIES.update(BASE_START_2023)
