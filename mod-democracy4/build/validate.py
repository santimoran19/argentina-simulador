# -*- coding: utf-8 -*-
"""Valida el mod generado sin necesidad de abrir Democracy 4.

Revisa que todo nombre usado exista (juego base o el propio mod), que las fórmulas se puedan evaluar y den valores
razonables, que no falten traducciones, íconos, imágenes ni deslizadores, y que los CSV se lean bien.

known_names.json: nombres del juego base que usan mods publicados y funcionando (D4 Overhaul & Expansion,
The Culture War). Es la mejor aproximación disponible sin los archivos del juego.
"""
import csv, glob, json, math, os, re, sys

sys.path.insert(0, os.path.dirname(__file__))
import content as C

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'dist', C.MOD_NAME)
BASE = set(json.load(open(os.path.join(os.path.dirname(__file__), 'known_names.json')))['base'])
SPECIAL = {'_All_', '_random_', '_default_', '_effectivedebt_', '_turnout', '_global_liberalism', '_LowIncome', '_MiddleIncome',
           '_HighIncome'}
DEPTS = {'TAX', 'ECONOMY', 'WELFARE', 'PUBLICSERVICES', 'LAWANDORDER', 'FOREIGNPOLICY', 'TRANSPORT'}
ZONES = DEPTS | {'HIDDEN'}

errors, warnings = [], []
OWN_POL = {p['name'] for p in C.POLICIES}
OWN_SIT = {s['name'] for s in C.SITUATIONS}
KNOWN = BASE | SPECIAL | OWN_POL | OWN_SIT


def err(m): errors.append(m)
def warn(m): warnings.append(m)


def check_formula(where, f, lo=-1.0, hi=1.0):
    if not re.fullmatch(r'[0-9x+\-*/().^ ]+', f):
        err('{}: fórmula con caracteres inesperados: {!r}'.format(where, f)); return
    try:
        vals = [eval(f.replace('^', '**'), {'__builtins__': {}}, {'x': x}) for x in (0, 0.25, 0.5, 0.75, 1)]
    except Exception as e:
        err('{}: fórmula inválida {!r} ({})'.format(where, f, e)); return
    for v in vals:
        if not math.isfinite(v):
            err('{}: fórmula no finita {!r}'.format(where, f))
        elif v < lo or v > hi:
            warn('{}: valor fuera de rango habitual ({:.2f}) en {!r}'.format(where, v, f))


def check_effect(where, e, lo=-1.0, hi=1.0):
    parts = e.split(',')
    if len(parts) not in (2, 3):
        err('{}: efecto mal formado {!r}'.format(where, e)); return
    tgt = parts[0]
    if tgt not in KNOWN:
        err('{}: nombre desconocido {!r}'.format(where, tgt))
    check_formula(where + ' ' + tgt, parts[1], lo, hi)
    if len(parts) == 3 and not parts[2].isdigit():
        err('{}: demora no entera {!r}'.format(where, parts[2]))


def check_influence(where, i):
    parts = i.split(',')
    if parts[0] == '_random_':
        if len(parts) != 3: err('{}: _random_ necesita mínimo y máximo'.format(where))
        return
    check_effect(where, i, -0.5, 0.5)


# ---------------- unicidad y prefijos ----------------
names = [p['name'] for p in C.POLICIES] + [s['name'] for s in C.SITUATIONS] + [e['name'] for e in C.EVENTS] + [d['name'] for d in C.DILEMMAS]
for n in names:
    if names.count(n) > 1: err('nombre repetido: ' + n)
    if not n.startswith('AR_'): err('falta el prefijo AR_: ' + n)
    if n in BASE: err('choca con un nombre del juego base: ' + n)

# ---------------- políticas ----------------
for p in C.POLICIES:
    w = 'política ' + p['name']
    if p['dept'] not in DEPTS: err(w + ': departamento inválido ' + p['dept'])
    if p['slider'] != 'default' and p['slider'] not in C.SLIDERS: err(w + ': deslizador no definido ' + p['slider'])
    if p['opposites'] and p['opposites'] not in OWN_POL | BASE: err(w + ': opuesta inexistente ' + p['opposites'])
    if not p['effects']: err(w + ': sin efectos')
    if p['cost'] == (0, 0) and p['income'] == (0, 0): pass
    for e in p['effects']: check_effect(w, e, -0.6, 0.6)
    for lang in ('es', 'en'):
        t = p[lang]
        if len(t) != 2 or not t[0] or len(t[1]) < 40: err(w + ': traducción incompleta ' + lang)
    if not os.path.exists(os.path.join(OUT, 'data/svg/icons_{}.svg'.format(p['name'].lower()))): err(w + ': falta el ícono')

# ---------------- situaciones ----------------
for s in C.SITUATIONS:
    w = 'situación ' + s['name']
    if s['zone'] not in ZONES: err(w + ': zona inválida')
    if not (0 < s['stop'] < s['start'] < 1): err(w + ': umbrales incoherentes (fin debe ser menor que inicio)')
    if not s['causes'] or not s['causes'][0].startswith('_default_,'): err(w + ': debe empezar con _default_')
    for c in s['causes'][1:]:
        check_effect(w + ' causa', c, -1, 1)
        if c.split(',')[0] == s['name']: err(w + ': se causa a sí misma')
    for e in s['effects']: check_effect(w + ' efecto', e, -0.6, 0.6)
    if not os.path.exists(os.path.join(OUT, 'data/svg/sit_icons_{}.svg'.format(s['name'].lower()))): err(w + ': falta el ícono')
    # ¿puede activarse? valor máximo posible de las causas
    mx = float(s['causes'][0].split(',')[1])
    for c in s['causes'][1:]:
        f = c.split(',')[1]
        mx += max(0, max(eval(f.replace('^', '**'), {'__builtins__': {}}, {'x': x}) for x in (0, 1)))
    if mx < s['start']:
        if s.get('trigger') == 'evento':
            kick = [e['name'] for e in C.EVENTS for t, a, d in e['grudges'] if t == s['name'] and a >= 0.4]
            if not kick: err(w + ': crisis disparada por eventos, pero ningún evento la dispara con fuerza suficiente')
        else:
            err(w + ': nunca puede activarse (máximo {:.2f} < inicio {})'.format(mx, s['start']))

# ---------------- eventos y dilemas ----------------
for e in C.EVENTS:
    w = 'evento ' + e['name']
    for i in e['influences']: check_influence(w, i)
    for t, a, d in e['grudges']:
        if t not in KNOWN: err(w + ': nombre desconocido ' + t)
        lim = 0.7 if t in OWN_SIT else 0.2
        if not (-lim <= a <= lim and 0 < d < 1): warn(w + ': grudge fuera de rango ' + t)
    if not os.path.exists(os.path.join(OUT, 'data/bitmaps/events/{}.jpg'.format(e['name']))): err(w + ': falta la imagen')
for d in C.DILEMMAS:
    w = 'dilema ' + d['name']
    for i in d['influences']: check_influence(w, i)
    if not 2 <= len(d['options']) <= 3: err(w + ': debe tener 2 o 3 opciones')
    for grudges, es, en in d['options']:
        for t, a in grudges:
            if t not in KNOWN: err(w + ': nombre desconocido ' + t)
        if not es[0] or not en[0]: err(w + ': opción sin texto')

# ---------------- escenarios ----------------
for label, start in (('2023', C.START_2023), ('referencia 2026', C.REFERENCIA_2026)):
    for k, v in start.items():
        if k not in OWN_POL | BASE: err('escenario {}: política inexistente {}'.format(label, k))
        if not 0 <= v <= 1: err('escenario {}: valor fuera de 0-1 en {}'.format(label, k))
for m in (C.COUNTRY,):
    for f in ('data/missions/{0}/{0}.txt'.format(m), 'translations/English/missions/{}.txt'.format(m),
              'translations/Spanish/missions/{}.txt'.format(m)):
        if not os.path.exists(os.path.join(OUT, f)): err('falta ' + f)
for label, host, tgt, eq, inertia in C.CHAIN_OVERRIDES:
    if host not in BASE or tgt not in BASE: err('enlace {}: nombre desconocido'.format(label))
    if host == tgt: err('enlace {}: usa el mismo valor como causa y efecto'.format(label))
    check_formula('enlace ' + label, eq, -0.5, 0.5)
for e in C.EVENTS + C.DILEMMAS:
    if not any(i.split(',')[0] in OWN_POL | OWN_SIT for i in e['influences']) and not any(i.startswith('_random_') for i in e['influences']):
        err('{}: sin ninguna influencia'.format(e['name']))

# ---------------- cadenas entre situaciones ----------------
edges = {}
for st in C.SITUATIONS:
    for c in st['causes'][1:]:
        src, f = c.split(',')[0], c.split(',')[1]
        if src in OWN_SIT:
            gain = eval(f.replace('^', '**'), {'__builtins__': {}}, {'x': 1}) - eval(f.replace('^', '**'), {'__builtins__': {}}, {'x': 0})
            edges.setdefault(src, []).append((st['name'], gain))
for a, outs in edges.items():
    for b, g1 in outs:
        for c2, g2 in edges.get(b, []):
            if c2 == a and g1 > 0.15 and g2 > 0.15:
                warn('realimentación fuerte entre {} y {} ({:+.2f} / {:+.2f})'.format(a, b, g1, g2))
def reach(n, seen):
    for b, g in edges.get(n, []):
        if g > 0 and b not in seen:
            seen.add(b); reach(b, seen)
    return seen
CHAINS = {n: sorted(reach(n, set()) - {n}) for n in OWN_SIT}

# ---------------- país ----------------
for k in C.COUNTRY_POLICIES:
    if k not in BASE and not k.startswith('_prereq_'): err('país: política inicial desconocida ' + k)
    v = C.COUNTRY_POLICIES[k]
    if not 0 <= v <= 1: err('país: valor fuera de 0-1 en ' + k)
for _l, tgt, eq in C.COUNTRY_OVERRIDES:
    if tgt not in BASE: err('override: nombre desconocido ' + tgt)
    check_formula('override ' + tgt, eq.lstrip('+'), -0.5, 0.5)
for f in ('data/bitmaps/flags/flag_argentina_gb.png', 'data/svg/map_argentina_gb.svg', 'data/names/argentinanames_gb.txt'):
    if not os.path.exists(os.path.join(OUT, f)): err('falta ' + f)

# ---------------- archivos generados ----------------
for f in glob.glob(os.path.join(OUT, '**/*.csv'), recursive=True):
    raw = open(f, 'rb').read()
    if raw.startswith(b'\xef\xbb\xbf'): err('BOM en ' + f)
    try:
        rows = list(csv.reader(raw.decode('utf-8').splitlines()))
    except Exception as e:
        err('no se puede leer {} ({})'.format(f, e)); continue
    for r in rows:
        if r and r[0] == '#' and len(r) < 3: err('fila corta en {}: {}'.format(os.path.basename(f), r))
for lang in ('English', 'Spanish'):
    tr = {r[1] for f in glob.glob(os.path.join(OUT, 'translations', lang, '*.csv')) for r in csv.reader(open(f, encoding='utf-8')) if len(r) > 1}
    for n in OWN_POL | OWN_SIT | {e['name'] for e in C.EVENTS} | {d['name'] for d in C.DILEMMAS}:
        if n not in tr: err('{}: falta traducir {}'.format(lang, n))

print('Validación del mod {}'.format(C.MOD_NAME))
for w in warnings: print('  AVISO  ', w)
for e in errors: print('  ERROR  ', e)
print('Cadenas: cuántas situaciones puede desencadenar cada una (efecto dominó)')
for n, r in sorted(CHAINS.items(), key=lambda kv: -len(kv[1]))[:8]:
    print('  {:<28} -> {:2d}: {}'.format(n, len(r), ', '.join(x.replace('AR_', '') for x in r[:7]) + (' ...' if len(r) > 7 else '')))
print('{} errores, {} avisos'.format(len(errors), len(warnings)))
sys.exit(1 if errors else 0)
