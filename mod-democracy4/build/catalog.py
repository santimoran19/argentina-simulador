# -*- coding: utf-8 -*-
"""Genera CATALOGO.md: todo el contenido del mod, ordenado y en castellano.

Uso: python3 mod-democracy4/build/catalog.py
"""
import os, sys

sys.path.insert(0, os.path.dirname(__file__))
import content as C

OUT = os.path.join(os.path.dirname(__file__), '..', 'CATALOGO.md')

ES = {
    'Inflation': 'inflación', 'CurrencyStrength': 'fortaleza del peso', 'GDP': 'PBI', 'Unemployment': 'desempleo',
    'PovertyRate': 'pobreza', 'ExtremePoverty': 'indigencia', 'Equality': 'igualdad', 'Wages': 'salarios', 'TaxEvasion': 'evasión',
    'BlackMarket': 'mercado negro', 'Corruption': 'corrupción', 'ForeignInvestment': 'inversión extranjera',
    'BusinessConfidence': 'confianza empresaria', 'InternationalTrade': 'comercio exterior', 'ForeignRelations': 'relaciones exteriores',
    'Tourism': 'turismo', 'FoodPrice': 'precio de los alimentos', 'OilPrice': 'precio del petróleo', 'OilSupply': 'oferta de petróleo',
    'PowerBlackouts': 'cortes de luz', 'EnergyEfficiency': 'eficiencia energética', 'CO2Emissions': 'emisiones de CO2',
    'Pollution': 'contaminación', 'Environment': 'ambiente', 'Watershortage': 'escasez de agua', 'Health': 'salud',
    'HealthcareDemand': 'demanda en hospitales', 'Education': 'educación', 'Technology': 'tecnología', 'BrainDrain': 'fuga de cerebros',
    'Bureaucracy': 'burocracia', 'WorkerProductivity': 'productividad', 'GigEconomy': 'trabajo por aplicaciones',
    'Democracy': 'calidad democrática', 'Stability': 'estabilidad', 'Polarization': 'polarización', 'CrimeRate': 'delito',
    'ViolentCrimeRate': 'delito violento', 'Organised Crime': 'crimen organizado', 'PrisonOvercrowding': 'hacinamiento carcelario',
    'TrafficCongestion': 'tránsito', 'RailUsage': 'uso del tren', 'CarUsage': 'uso del auto', 'Immigration': 'inmigración',
    'SkillsShortage': 'falta de mano de obra calificada', 'GenderEquality': 'igualdad de género', '_Terrorism': 'riesgo de terrorismo',
    '_All_': 'todos los votantes', '_turnout': 'participación electoral', '_effectivedebt_': 'peso de la deuda',
    'Poor': 'sectores bajos', 'MiddleIncome': 'clase media', 'Wealthy': 'clase alta', 'Retired': 'jubilados',
    'StateEmployees': 'estatales', 'TradeUnionist': 'sindicalistas', 'Capitalist': 'empresarios', 'SelfEmployed': 'cuentapropistas',
    'Farmers': 'campo', 'Farmers_income': 'ingresos del campo', 'Young': 'jóvenes', 'Parents': 'familias', 'Religious': 'religiosos',
    'Conservatives': 'conservadores', 'Liberal': 'progresistas', 'Socialist': 'izquierda', 'Patriot': 'nacionalistas',
    'Environmentalist': 'ambientalistas', 'EthnicMinorities': 'migrantes y minorías',
    # políticas del juego base
    'CapitalControls': 'control de capitales (juego)', 'QuantitativeEasing': 'emisión monetaria (juego)',
    'ImportTarrifs': 'aranceles (juego)', 'StatePensions': 'jubilaciones (juego)', 'MinimumWage': 'salario mínimo (juego)',
    'LabourLaws': 'leyes laborales (juego)', 'StateHealthService': 'salud pública (juego)', 'UniversityGrants': 'becas universitarias (juego)',
    'DisabilityBenefit': 'pensión por discapacidad (juego)', 'UnemployedBenefit': 'seguro de desempleo (juego)',
    'JudiciaryIndependence': 'independencia judicial (juego)', 'ForeignInvestorTaxBreaks': 'beneficios a inversores (juego)',
    'CorporationTax': 'impuesto a las empresas (juego)', 'PayrollTax': 'cargas sociales (juego)', 'IncomeTax': 'impuesto a la renta (juego)',
    'SalesTax': 'IVA (juego)', 'RetirementAge': 'edad jubilatoria (juego)', 'ChildBenefit': 'asignaciones familiares (juego)',
    'ScienceFunding': 'financiamiento científico (juego)', 'BorderControls': 'controles fronterizos (juego)',
    'ArmedPolice': 'policía armada (juego)', 'SmallBusinessGrants': 'ayuda a pymes (juego)',
    'Hyperinflation': 'hiperinflación (juego)', 'HighInflation': 'inflación alta (juego)', 'GeneralStrike': 'huelga general (juego)',
    'DoctorsStrike': 'paro de médicos (juego)', 'TeachersStrike': 'paro docente (juego)', 'CorporateExodus': 'éxodo de empresas (juego)',
    'BusSubsidies': 'subsidios al colectivo (juego)', 'Punitivewealthtax': 'impuesto a la riqueza (juego)',
    'MilitarySpending': 'gasto militar (juego)', 'RoadBuilding': 'construcción de rutas (juego)',
    'OilDrillingSubsidy': 'subsidio a la perforación petrolera (juego)', 'DrugEnforcement': 'lucha contra el narcotráfico (juego)',
    'StateAirline': 'aerolínea estatal (juego)', 'FoodStamps': 'tarjeta alimentaria (juego)',
    'EnterpriseInvestmentScheme': 'incentivo a la inversión (juego)', 'AgricultureSubsidies': 'subsidios agrícolas (juego)',
}
DEPT = {'ECONOMY': 'Economía', 'TAX': 'Impuestos', 'WELFARE': 'Bienestar social', 'PUBLICSERVICES': 'Servicios públicos',
        'LAWANDORDER': 'Ley y orden', 'FOREIGNPOLICY': 'Política exterior', 'TRANSPORT': 'Transporte'}
NAME = {p['name']: p['es'][0] for p in C.POLICIES}
import content_names as N
for _n, _t in list(N.POLICY_NAMES.items()) + list(N.SITUATION_NAMES.items()):
    ES[_n] = _t[0][0] + ' (juego)'
NAME.update({s['name']: s['es'][0] for s in C.SITUATIONS})


def label(n):
    return NAME.get(n) or ES.get(n, n)


def delta(f):
    ev = lambda x: eval(f.replace('^', '**'), {'__builtins__': {}}, {'x': x})
    return ev(1) - ev(0), ev(0)


def effects_text(effs):
    up, down = [], []
    for e in effs:
        parts = e.split(',')
        d, base = delta(parts[1])
        val = d if abs(d) > 1e-9 else base
        (up if val > 0 else down).append(label(parts[0]))
    out = []
    if up: out.append('▲ ' + ', '.join(dict.fromkeys(up)))
    if down: out.append('▼ ' + ', '.join(dict.fromkeys(down)))
    return ' · '.join(out)


lines = ['# Catálogo del mod "Argentina: Gobernala"', '',
         'Generado automáticamente a partir del contenido (`build/catalog.py`). ▲ sube, ▼ baja, al aumentar la política o la '
         'intensidad de la situación. En los grupos de votantes, ▲ significa que te aprueban más.', '',
         '- {} políticas · {} situaciones · {} eventos · {} dilemas'.format(len(C.POLICIES), len(C.SITUATIONS), len(C.EVENTS),
                                                                        len(C.DILEMMAS)), '']

lines += ['## Políticas', '']
for dept in DEPT:
    ps = [p for p in C.POLICIES if p['dept'] == dept]
    if not ps:
        continue
    lines += ['### {} ({})'.format(DEPT[dept], len(ps)), '', '| Política | Nivel inicial | Efectos |', '|---|---|---|']
    for p in sorted(ps, key=lambda p: p['es'][0]):
        st = C.START_2023.get(p['name'])
        ini = '—' if st is None else '{:.0%}'.format(st)
        lines.append('| **{}** | {} | {} |'.format(p['es'][0], ini, effects_text(p['effects'])))
    lines.append('')

lines += ['## Situaciones', '', 'Qué las enciende (causas) y qué provocan mientras están activas (efectos). Las causas marcadas '
          '"(juego)" son políticas que ya trae Democracy 4.', '']
groups = [('Crisis argentinas', lambda s: not s['positive'] and s.get('trigger') != 'evento'),
          ('Logros', lambda s: s['positive'] and s.get('trigger') != 'evento'),
          ('Mundo (las dispara un evento)', lambda s: s.get('trigger') == 'evento')]
for title, pred in groups:
    ss = [s for s in C.SITUATIONS if pred(s)]
    lines += ['### {} ({})'.format(title, len(ss)), '', '| Situación | La encienden | La apagan | Provoca |', '|---|---|---|---|']
    for s in ss:
        on, off = [], []
        for c in s['causes'][1:]:
            src, f = c.split(',')[0], c.split(',')[1]
            d, _b = delta(f)
            (on if d > 0 else off).append(label(src))
        lines.append('| **{}** | {} | {} | {} |'.format(s['es'][0], ', '.join(dict.fromkeys(on)) or '—',
                                                        ', '.join(dict.fromkeys(off)) or '—', effects_text(s['effects'])))
    lines.append('')

lines += ['## Eventos', '', '| Evento | Qué hace |', '|---|---|']
for e in C.EVENTS:
    eff = ['{} {}'.format('▲' if a > 0 else '▼', label(t)) for t, a, _d in e['grudges']]
    lines.append('| **{}** | {} |'.format(e['es'][0], ', '.join(eff)))
lines += ['', '## Dilemas', '', '| Dilema | Opción A | Opción B |', '|---|---|---|']
for d in C.DILEMMAS:
    opts = []
    for grudges, es, _en in d['options'][:2]:
        opts.append('{}: {}'.format(es[0], ', '.join('{} {}'.format('▲' if a > 0 else '▼', label(t)) for t, a in grudges)))
    lines.append('| **{}** | {} | {} |'.format(d['es'][0], opts[0], opts[1]))

lines += ['', '## Nombres argentinos para cosas del juego', '',
          'El mod renombra estas políticas y situaciones del juego (sólo el texto; la mecánica es la del juego más lo que '
          'el mod le conecta). Mientras el mod esté activo, el nombre cambia en cualquier país.', '',
          '| En el juego (nombre aproximado) | En el mod |', '|---|---|']
GAME_ES = {'CapitalControls': 'Control de capitales', 'QuantitativeEasing': 'Flexibilización cuantitativa',
           'StatePensions': 'Pensiones estatales', 'ChildBenefit': 'Prestación por hijo', 'DisabilityBenefit': 'Prestación por discapacidad',
           'UniversityGrants': 'Becas universitarias', 'ScienceFunding': 'Financiamiento científico', 'StateHealthService': 'Sanidad pública',
           'IncomeTax': 'Impuesto sobre la renta', 'Punitivewealthtax': 'Impuesto a la riqueza',
           'ForeignInvestorTaxBreaks': 'Desgravaciones a inversores extranjeros', 'OilDrillingSubsidy': 'Subvención a la perforación petrolera',
           'BusSubsidies': 'Subvenciones al autobús', 'RoadBuilding': 'Construcción de carreteras', 'MilitarySpending': 'Gasto militar',
           'DrugEnforcement': 'Lucha antidroga', 'BorderControls': 'Controles fronterizos', 'StateAirline': 'Aerolínea estatal',
           'LabourLaws': 'Leyes laborales', 'ImportTarrifs': 'Aranceles a la importación', 'SalesTax': 'Impuesto sobre las ventas',
           'PayrollTax': 'Impuesto sobre la nómina', 'CorporationTax': 'Impuesto de sociedades', 'MinimumWage': 'Salario mínimo',
           'UnemployedBenefit': 'Subsidio de desempleo', 'StateRail': 'Ferrocarril estatal', 'StateEnergy': 'Energía estatal',
           'StatePostService': 'Servicio postal estatal', 'StateBroadcaster': 'Radiotelevisión estatal',
           'IntelligenceServices': 'Servicios de inteligencia', 'DoctorsStrike': 'Huelga de médicos', 'TeachersStrike': 'Huelga de profesores',
           'Homelessness': 'Personas sin hogar', 'PowerBlackouts': 'Apagones'}
for _n, _t in list(N.POLICY_NAMES.items()) + list(N.SITUATION_NAMES.items()):
    lines.append('| {} | **{}** |'.format(GAME_ES.get(_n, _n), _t[0][0]))
lines += ['', '## Políticas argentinas fusionadas con las del juego', '',
          'Para que no haya dos políticas para lo mismo, estas versiones argentinas no existen como política aparte: '
          'se usa la del juego, que ahora mueve todo lo que movía la argentina. "Al revés" quiere decir que subir la del '
          'juego equivale a bajar la argentina.', '', '| Antes (mod) | Ahora (juego) |', '|---|---|']
OLD_ES = {'AR_Cepo': 'Cepo cambiario', 'AR_EmisionTesoro': 'Asistencia del BCRA al Tesoro', 'AR_SubsidiosTransporte': 'Subsidios al transporte',
          'AR_MovilidadJubilatoria': 'Movilidad jubilatoria', 'AR_TarjetaAlimentar': 'AUH y Tarjeta Alimentar',
          'AR_LeyDiscapacidad': 'Prestaciones por discapacidad', 'AR_UniversidadPublica': 'Universidad pública', 'AR_CONICET': 'CONICET',
          'AR_EmergenciaPediatrica': 'Hospitales nacionales', 'AR_Ganancias4ta': 'Ganancias sobre salarios',
          'AR_BienesPersonales': 'Bienes Personales', 'AR_Reequipamiento': 'Reequipamiento militar',
          'AR_ObraPublicaNacional': 'Obra pública nacional', 'AR_RIGI': 'RIGI', 'AR_PoliticaMigratoria': 'Política migratoria',
          'AR_VacaMuerta': 'Vaca Muerta', 'AR_Narcotrafico': 'Plan contra el narcotráfico', 'AR_Privatizaciones': 'Privatizaciones',
          'AR_ReformaLaboral': 'Reforma laboral', 'AR_Mercosur': 'Apertura comercial / Mercosur'}
for k, (base, inv) in C.MERGED.items():
    lines.append('| {} | {}{} |'.format(OLD_ES.get(k, k), label(base), ' (al revés)' if inv else ''))
lines += ['', '## Rasgos estructurales y enlaces causales argentinos', '',
          '| Rasgo | Efecto |', '|---|---|'] + ['| {} | ▲ {} |'.format(l, label(t)) for l, t, _e in C.COUNTRY_OVERRIDES]
lines += ['', '| Causa | Consecuencia |', '|---|---|']
for _l, host, tgt, eq, _i in C.CHAIN_OVERRIDES:
    d, _b = delta(eq)
    lines.append('| {} ▲ | {} {} |'.format(label(host), label(tgt), '▲' if d > 0 else '▼'))

open(OUT, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print('Catálogo escrito en', os.path.abspath(OUT), '({} líneas)'.format(len(lines)))
