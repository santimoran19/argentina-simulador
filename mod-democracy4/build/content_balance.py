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

# Gasto inicial más parecido al presupuesto nacional real
COUNTRY_POLICY_FIX = {
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
    'AR_EmisionTesoro': 0.6,
    'AR_Mercosur': 0.2,           # aranceles altos (0,8), no al máximo
    'AR_BonoNavidad': 0.05,
    'AR_ParitariasEstatales': 0.5,
}
BASE_START_FIX = {'StateRail': 0.45, 'StateEnergy': 0.35}


def _scale(formula, k):
    import content_merge as M
    a, b = M.linear(formula)
    return M.fmt(a * k, b * k)


def apply_start(C):
    """Antes de content_merge: valores de arranque de las políticas argentinas."""
    C.START_2023.update(START_FIX)


def extend(C):
    """Después de content_merge, antes de content_base."""
    C.COUNTRY_POLICIES.update(COUNTRY_POLICY_FIX)
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
    C.CHAIN_OVERRIDES[:] = [c for c in C.CHAIN_OVERRIDES if c[0] not in DROP_CHAINS]
