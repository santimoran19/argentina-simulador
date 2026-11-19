# -*- coding: utf-8 -*-
"""Corre los turnos de preparación del juego con la configuración del país del mod (usa d4sim y los archivos
del juego en D4_BASE) e informa cómo queda la Argentina al empezar. Uso:
  D4_BASE=<data/simulation del juego> python3 build/warmup.py [carpeta del mod] [turnos]"""
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import d4sim

BASE = os.environ.get('D4_BASE')
MOD = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dist', 'argentina_gobernala')
TURNS = 16
# Variables que maneja el motor (no están en los CSV). Valores típicos tomados de partidas guardadas.
ENGINE = {'_year': 0.5, '_winning_': 0.0, '_global_interest_rates_': 0.3, '_global_liberalism': 0.5,
          '_global_socialism': 0.5, '_effectivedebt_': 0.5, '_globaleconomy_': 0.5}
VOTER_PERC = {'Socialist': 0.35, 'Capitalist': 0.45, 'Retired': 0.25, 'Commuter': 0.5, 'Patriot': 0.4, 'Motorist': 0.6,
              'Liberal': 0.5, 'Religious': 0.45, 'TradeUnionist': 0.35, 'SelfEmployed': 0.25, 'Environmentalist': 0.25,
              'Wealthy': 0.1, 'Poor': 0.4, 'MiddleIncome': 0.5, 'Parents': 0.45, 'Farmers': 0.08, 'StateEmployees': 0.2,
              'Conservatives': 0.35, 'Young': 0.3, 'EthnicMinorities': 0.1}


def mission_policies(mod):
    t = open(os.path.join(mod, 'data/missions/argentina/argentina.txt'), encoding='utf-8').read()
    body = t.split('[policies]')[1].split('[options]')[0]
    pol = {}
    for k, v in re.findall(r'^\s*([^\s=\[][^=]*?)\s*=\s*([-\d.]+)', body, re.M):
        pol[k.strip()] = float(v)
    return pol, t


def run(mod=MOD, turns=TURNS, policy_override=None, engine=None, verbose=False):
    m = d4sim.Model(BASE, mod, 'argentina')
    m.apply_overrides(add_missing=True)
    pol, t = mission_policies(mod)
    pol.update(policy_override or {})
    pol = {k: v for k, v in pol.items() if v is not None}
    fixed = dict(ENGINE)
    g = re.search(r'economic_cycle_start\s*=\s*([\d.]+)', t)
    if g:
        fixed['_globaleconomy_'] = float(g.group(1))
    fixed.update(engine or {})
    for k, v in VOTER_PERC.items():
        fixed[k + '_perc'] = v
    sim = d4sim.Sim(m, pol, fixed)
    for _ in range(turns):
        sim.step()
    return sim, m


KEY = ['GDP', 'Unemployment', 'Inflation', 'CurrencyStrength', 'PovertyRate', 'CrimeRate', 'Health', 'Equality',
       'BusinessConfidence', 'ForeignInvestment', 'Wages', 'Stability']

if __name__ == '__main__':
    if len(sys.argv) > 1:
        MOD = sys.argv[1]
    if len(sys.argv) > 2:
        TURNS = int(sys.argv[2])
    sim, m = run(MOD, TURNS)
    for k in KEY:
        print('%-18s %s' % (k, ' '.join('%.2f' % v for v in sim.hist[k][::2])))
    act = [n for n, a in sim.active.items() if a]
    print('situaciones activas:', ', '.join(act))
