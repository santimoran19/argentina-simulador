# -*- coding: utf-8 -*-
"""Sin políticas repetidas: fusiona con las del juego base las políticas argentinas que hacían lo mismo.

Democracy 4 ya trae jubilaciones, asignaciones familiares, becas universitarias, impuesto a la renta, gasto militar,
control de capitales, etc. Tener además una versión argentina de cada una dejaba dos sliders para la misma cosa
(por ejemplo, "Universidad pública" y "Becas universitarias" activas a la vez). Para cada par de esta lista:

- la política argentina desaparece y queda sólo la del juego;
- todo lo que la argentina movía (situaciones, eventos, dilemas, enlaces) pasa a moverlo la del juego;
- si la del juego mide lo contrario (privatizar = menos aerolínea estatal; reforma laboral = menos leyes laborales;
  apertura = menos aranceles), las fórmulas se invierten;
- el valor de arranque de 2023 se conserva: si el país ya traía un valor calibrado para la política del juego, queda ese.

Se aplica al final, después de content_ext, content_intl y content_base.
"""
import re

# política argentina -> (política del juego, invertida)
MERGE = {
    'AR_Cepo': ('CapitalControls', False),
    'AR_EmisionTesoro': ('QuantitativeEasing', False),
    'AR_SubsidiosTransporte': ('BusSubsidies', False),
    'AR_MovilidadJubilatoria': ('StatePensions', False),
    'AR_TarjetaAlimentar': ('ChildBenefit', False),
    'AR_LeyDiscapacidad': ('DisabilityBenefit', False),
    'AR_UniversidadPublica': ('UniversityGrants', False),
    'AR_CONICET': ('ScienceFunding', False),
    'AR_EmergenciaPediatrica': ('StateHealthService', False),
    'AR_Ganancias4ta': ('IncomeTax', False),
    'AR_BienesPersonales': ('Punitivewealthtax', False),
    'AR_Reequipamiento': ('MilitarySpending', False),
    'AR_ObraPublicaNacional': ('RoadBuilding', False),
    'AR_RIGI': ('ForeignInvestorTaxBreaks', False),
    'AR_PoliticaMigratoria': ('BorderControls', False),
    'AR_VacaMuerta': ('OilDrillingSubsidy', False),
    'AR_Narcotrafico': ('DrugEnforcement', False),
    'AR_Privatizaciones': ('StateAirline', True),
    'AR_ReformaLaboral': ('LabourLaws', True),
    'AR_Mercosur': ('ImportTarrifs', True),
}

_LIN = re.compile(r'^([-+]?\d*\.?\d+)([+-])\((\d*\.?\d+)\*x\)$')


def invert(formula):
    """a ± b·x  ->  la misma fórmula evaluada en (1 - x)."""
    m = _LIN.match(formula.replace(' ', ''))
    if not m:
        raise ValueError('no sé invertir la fórmula ' + formula)
    a, sign, b = float(m.group(1)), m.group(2), float(m.group(3))
    b = b if sign == '+' else -b
    a2, b2 = a + b, -b
    return '{:g}{}({:g}*x)'.format(a2, '+' if b2 >= 0 else '-', abs(b2))


SHIFT = {}   # política argentina -> corrimiento entre su valor de 2023 y el de la política del juego


def linear(formula):
    m = _LIN.match(formula.replace(' ', ''))
    if not m:
        raise ValueError('fórmula no lineal ' + formula)
    b = float(m.group(3))
    return float(m.group(1)), (b if m.group(2) == '+' else -b)


def fmt(a, b):
    return '{:g}{}({:g}*x)'.format(round(a, 4), '+' if b >= 0 else '-', abs(round(b, 4)))


def _rename(entry):
    """'Nombre,formula[,inercia]' -> renombrado (e invertido si corresponde).

    Si el país ya traía otro valor de arranque para la política del juego, la fórmula se corre para que en 2023
    dé exactamente lo mismo que daba la política argentina (así no cambia la calibración)."""
    parts = entry.split(',')
    if parts[0] in MERGE:
        name = parts[0]
        base, inv = MERGE[name]
        parts[0] = base
        if inv:
            parts[1] = invert(parts[1])
        d = SHIFT.get(name, 0.0)
        if abs(d) > 1e-9:
            a, b = linear(parts[1])
            parts[1] = fmt(a + b * d, b)
    return ','.join(parts)


def _dedupe(causes):
    """Una sola causa por origen: queda la primera (la calibrada a mano antes que el enlace genérico)."""
    seen, out = set(), []
    for c in causes:
        src = c.split(',')[0]
        if src != '_default_' and src in seen:
            continue
        seen.add(src)
        out.append(c)
    return out


def extend(C):
    merged = {p['name']: p for p in C.POLICIES if p['name'] in MERGE}
    assert len(merged) == len(MERGE), set(MERGE) - set(merged)
    sit_names = {s['name'] for s in C.SITUATIONS}

    # valores de arranque
    for name, (base, inv) in MERGE.items():
        conv = lambda v: round(1 - v, 3) if inv else v
        v23 = C.START_2023.pop(name, None)
        v26 = C.START_2026.pop(name, None)
        if base in C.COUNTRY_POLICIES or v23 is None:
            start = C.COUNTRY_POLICIES.get(base, 0.0)
            if v23 is not None:
                SHIFT[name] = conv(v23) - start
        else:
            start = conv(v23)
            C.COUNTRY_POLICIES[base] = start
        if v26 is not None:
            # la referencia 2026 conserva el cambio respecto de 2023, aplicado sobre el valor del juego
            delta = conv(v26) - (conv(v23) if v23 is not None else start)
            C.START_2026[base] = round(max(0.0, min(1.0, start + delta)), 3)


    # efectos de la política argentina sobre situaciones argentinas -> causas de esas situaciones
    by = {s['name']: s for s in C.SITUATIONS}
    for name, p in merged.items():
        for e in p['effects']:
            if e.split(',')[0] in sit_names:
                tgt, rest = e.split(',', 1)
                by[tgt]['causes'].append(_rename(name + ',' + rest))

    C.POLICIES[:] = [p for p in C.POLICIES if p['name'] not in MERGE]
    for p in C.POLICIES:
        p['effects'] = [_rename(e) for e in p['effects']]
        if p['opposites'] in MERGE:
            p['opposites'] = MERGE[p['opposites']][0]
    for s in C.SITUATIONS:
        s['causes'] = _dedupe([_rename(c) for c in s['causes']])
        s['effects'] = [_rename(e) for e in s['effects']]
    for e in C.EVENTS:
        e['influences'] = [_rename(i) for i in e['influences']]
        e['grudges'] = [(MERGE.get(t, (t,))[0], a, d) for t, a, d in e['grudges']]
    for d in C.DILEMMAS:
        d['influences'] = [_rename(i) for i in d['influences']]
    C.CHAIN_OVERRIDES[:] = [(l, MERGE.get(h, (h,))[0], MERGE.get(t, (t,))[0], eq, i) for l, h, t, eq, i in C.CHAIN_OVERRIDES]

    # deslizadores que ya no usa ninguna política
    used = {p['slider'] for p in C.POLICIES}
    for k in [k for k in C.SLIDERS if k not in used]:
        del C.SLIDERS[k]
    C.MERGED = dict(MERGE)
