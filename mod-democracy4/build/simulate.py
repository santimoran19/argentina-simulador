# -*- coding: utf-8 -*-
"""Simulación aproximada de la red de situaciones del mod, para revisar el balance sin abrir el juego.

No reproduce el motor de Democracy 4: usa valores del juego base estimados para cada escenario (0 a 1) y calcula qué
situaciones argentinas quedan activas al arrancar, con la misma regla de activación (umbral de inicio y de fin).
Sirve para detectar escenarios absurdos: crisis que nunca aparecen o que aparecen todas juntas.
"""
import os, sys

sys.path.insert(0, os.path.dirname(__file__))
import content as C

# Valores aproximados del juego base al empezar cada escenario (0 = mínimo, 1 = máximo)
BASE = {
    '2023': {'Inflation': 0.95, 'CurrencyStrength': 0.15, 'GDP': 0.35, 'Unemployment': 0.35, 'PovertyRate': 0.75, 'Wages': 0.30,
             'Health': 0.45, 'Polarization': 0.80, 'Corruption': 0.60, 'Stability': 0.40, 'InternationalTrade': 0.35,
             'OilSupply': 0.45, '_effectivedebt_': 0.75},
    '2026': {'Inflation': 0.35, 'CurrencyStrength': 0.70, 'GDP': 0.45, 'Unemployment': 0.50, 'PovertyRate': 0.55, 'Wages': 0.35,
             'Health': 0.40, 'Polarization': 0.80, 'Corruption': 0.55, 'Stability': 0.50, 'InternationalTrade': 0.55,
             'OilSupply': 0.70, '_effectivedebt_': 0.60},
}


def f(expr, x):
    return eval(expr.replace('^', '**'), {'__builtins__': {}}, {'x': x})


def run(label, start, turns=24, boosts=()):
    boost = {t: float(eq) for _l, t, eq in boosts}
    pol = {p['name']: 0.0 for p in C.POLICIES}
    pol.update(start)
    val = {s['name']: 0.0 for s in C.SITUATIONS}
    active = {s['name']: False for s in C.SITUATIONS}
    history = []
    for _ in range(turns):
        new = {}
        for s in C.SITUATIONS:
            v = float(s['causes'][0].split(',')[1]) + boost.get(s['name'], 0.0)
            for c in s['causes'][1:]:
                src, ex = c.split(',')[0], c.split(',')[1]
                x = pol.get(src, val.get(src, BASE[label].get(src)))
                if x is None:
                    continue
                v += f(ex, x)
            new[s['name']] = max(0.0, min(1.0, v))
        for s in C.SITUATIONS:
            n = s['name']
            val[n] += 0.5 * (new[n] - val[n])        # inercia: las situaciones se mueven gradualmente
            if not active[n] and val[n] >= s['start']:
                active[n] = True
            elif active[n] and val[n] <= s['stop']:
                active[n] = False
        history.append(sum(active.values()))
    on = [n for n in active if active[n]]
    return on, val, history


if __name__ == '__main__':
    casos = (('2023', C.START_2023, 'Arranque: diciembre de 2023 (lo que hereda el jugador)'),
             ('2026', C.REFERENCIA_2026, 'Referencia: con las políticas de 2024-2026 y la economía de 2026 (para comparar con la realidad)'))
    for label, start, titulo in casos:
        on, val, hist = run(label, start)
        good = [n for n in on if next(s for s in C.SITUATIONS if s['name'] == n)['positive']]
        bad = [n for n in on if n not in good]
        print(titulo)
        print('  crisis:   ' + ', '.join(x.replace('AR_', '') for x in bad))
        print('  a favor:  ' + (', '.join(x.replace('AR_', '') for x in good) or '-'))
        near = sorted(((v, n) for n, v in val.items() if n not in on and v > 0.45), reverse=True)[:5]
        print('  cerca de activarse: ' + ', '.join('{} ({:.2f})'.format(n.replace('AR_', ''), v) for v, n in near))
