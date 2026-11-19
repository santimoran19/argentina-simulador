# -*- coding: utf-8 -*-
"""Genera la carpeta del mod a partir de content.py.

Uso:  python3 mod-democracy4/build/build.py
Salida: mod-democracy4/dist/argentina_gobernala/
Los gráficos (íconos, bandera, mapa, imágenes de eventos) los genera assets.js; build.py sólo los referencia.
"""
import csv, io, os, re, shutil, sys

sys.path.insert(0, os.path.dirname(__file__))
import content as C

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'dist', C.MOD_NAME)
ASSETS = os.path.join(ROOT, 'assets')        # salida de assets.js
NL = '\r\n'                                  # archivos del juego en formato Windows
LANGS = {'English': 'en', 'Spanish': 'es'}


def write(rel, text):
    p = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8', newline='') as f:
        f.write(text.replace('\r\n', '\n').replace('\n', NL))


def tq(text):
    """Comillas tipográficas: evita comillas dobles escapadas dentro del CSV."""
    return re.sub(r'"([^"]*)"', '\u201c\\1\u201d', str(text)) if isinstance(text, str) else text


def csv_text(rows):
    rows = [[tq(c) for c in r] for r in rows]
    buf = io.StringIO()
    w = csv.writer(buf, lineterminator='\n', quoting=csv.QUOTE_MINIMAL)
    for r in rows:
        w.writerow(r)
    return buf.getvalue()


def icon_name(kind, name):
    return ('icons_' if kind == 'pol' else 'sit_icons_') + name.lower()


def build():
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)

    # ---------- config.txt ----------
    write('config.txt', '[config]\nname = {}\nguiname = {}\nauthor = {}\ndescription = {}\n'.format(
        C.MOD_NAME, C.MOD_CONFIG['guiname'], C.MOD_CONFIG['author'], C.MOD_CONFIG['description_es']))

    # ---------- prerrequisito del país ----------
    write('data/simulation/prereqs.txt', '[config]\n{} = {}\n'.format(C.PREREQ_ID, C.PREREQ))

    # ---------- deslizadores ----------
    rows = [['#', 'default', 'DISCRETE', '0', '']]
    for k, v in C.SLIDERS.items():
        rows.append(['#', k, 'DISCRETE', str(len(v['es'])), ''])
    write('data/simulation/sliders.csv', csv_text(rows))

    # ---------- políticas ----------
    hdr = ['', 'name', 'slider', 'flags', 'opposites', 'introduce', 'cancel', 'raise', 'lower', 'department', 'prereqs',
           'mincost', 'maxcost', 'costfunction', 'cost multiplier', 'implementation', 'minincome', 'maxincome',
           'incomefunction', 'incomemultiplier', 'nationalisation GDP percentage', '']
    rows = [hdr]
    for p in C.POLICIES:
        intro, cancel, raise_, lower = p['pc']
        rows.append(['#', p['name'], p['slider'], '', p['opposites'], intro, cancel, raise_, lower, p['dept'], C.PREREQ,
                     p['cost'][0], p['cost'][1], '0+(1.0*x)', '', p['impl'], p['income'][0], p['income'][1], '0+(1.0*x)',
                     '', '', '#Effects'] + p['effects'])
    write('data/simulation/policies.csv', csv_text(rows))

    # ---------- situaciones ----------
    hdr = ['', '', '', 'prereqs', '', 'positive', 'start trigger', 'stop trigger', 'cost', 'costfunction', 'income',
           'incomefunction', 'CAUSES']
    rows = [hdr]
    for s in C.SITUATIONS:
        rows.append(['#', s['name'], s['zone'], C.PREREQ, icon_name('sit', s['name']), s['positive'], s['start'], s['stop'],
                     s['cost'][0], '0+(1.0*x)', s['cost'][1], '0+(1.0*x)'] + s['causes'] + ['#'] + s['effects'])
    write('data/simulation/situations.csv', csv_text(rows))

    # ---------- eventos ----------
    for e in C.EVENTS:
        grudges = ''.join('CreateGrudge({},{},{});'.format(t, a, d) for t, a, d in e['grudges'])
        infl = '\n'.join('{} = {}'.format(i, x) for i, x in enumerate(e['influences']))
        write('data/simulation/events/{}.txt'.format(e['name']),
              '[config]\nName = {}\nTexture = {}.jpg\ncountry_specific = {}\nOnImplement = {}\n\n[influences]\n{}\n'.format(
                  e['name'], e['name'], C.COUNTRY, grudges, infl))

    # ---------- dilemas ----------
    for d in C.DILEMMAS:
        infl = '\n'.join('{} = {}'.format(i, x) for i, x in enumerate(d['influences']))
        opts = ''
        for i, (grudges, _es, _en) in enumerate(d['options']):
            g = ''.join('CreateGrudge({},{},0.9);'.format(t, a) for t, a in grudges)
            opts += '\n[option{}]\nOnImplement = {}\n'.format(i, g)
        write('data/simulation/dilemmas/{}.txt'.format(d['name']),
              '[dilemma]\nname={}\ncountry_specific = {}\n\n[influences]\n{}\n{}'.format(d['name'], C.COUNTRY, infl, opts))

    # ---------- país ----------
    cfg = '\n'.join('{} = {}'.format(k, v) for k, v in C.COUNTRY_CONFIG.items())
    pols = {**C.COUNTRY_POLICIES, C.PREREQ: 1}
    # Las políticas propias arrancan como en Argentina a fines de 2023
    start = {'AR_Cepo': 1.0, 'AR_EmisionTesoro': 0.8, 'AR_Retenciones': 0.75, 'AR_ImpuestoPAIS': 0.6, 'AR_AcuerdoFMI': 0.5,
             'AR_ControlPrecios': 0.4, 'AR_Coparticipacion': 0.6, 'AR_SubsidiosEnergia': 0.67, 'AR_SubsidiosTransporte': 0.7,
             'AR_Moratoria': 0.6, 'AR_MovilidadJubilatoria': 0.33, 'AR_PlanesSociales': 0.6, 'AR_ModeloSindical': 0.8,
             'AR_Monotributo': 0.5, 'AR_BienesPersonales': 0.5, 'AR_UniversidadPublica': 0.6, 'AR_CONICET': 0.5,
             'AR_ReclamoMalvinas': 0.5, 'AR_Mercosur': 0.0, 'AR_VacaMuerta': 0.4, 'AR_Litio': 0.3,
             'AR_Narcotrafico': 0.3, 'AR_BonoNavidad': 0.3}
    pols.update(start)
    pol_txt = '\n'.join('{} = {}'.format(k, v) for k, v in pols.items())
    write('data/missions/{0}/{0}.txt'.format(C.COUNTRY),
          '[config]\n{}\n\n[policies]\n{}\n\n[options]\nMULTIPLEPARTIES\n'.format(cfg, pol_txt))
    for label, target, eq in C.COUNTRY_OVERRIDES:
        write('data/missions/{}/overrides/{}.ini'.format(C.COUNTRY, label),
              '[override]\nTargetName = "{0}"\nHostName = "{0}"\nEquation = "{1}"\nInertia = 0\n'.format(target, eq))

    # ---------- nombres ----------
    write('data/names/argentinanames_gb.txt', ''.join('[{}]\n{}\n\n'.format(k, '\n'.join(v)) for k, v in C.NAMES.items()))

    # ---------- traducciones ----------
    for lang, code in LANGS.items():
        base = 'translations/{}/'.format(lang)
        write(base + 'policies.csv', csv_text([['#', p['name'], p[code][0], p[code][1]] for p in C.POLICIES]))
        write(base + 'situations.csv', csv_text([['#', s['name'], s[code][0], s[code][1]] for s in C.SITUATIONS]))
        write(base + 'events.csv', csv_text([['#', e['name'], e[code][0], e[code][1]] for e in C.EVENTS]))
        drows = []
        for d in C.DILEMMAS:
            drows.append(['#', d['name'], d[code][0], d[code][1], ' '])
            for i, opt in enumerate(d['options']):
                t = opt[1] if code == 'es' else opt[2]
                drows.append(['#', '{}_{}'.format(d['name'], i), t[0], t[1]])
        write(base + 'dilemmas.csv', csv_text(drows))
        write(base + 'sliders.csv', csv_text([['#', k] + v[code] for k, v in C.SLIDERS.items()]))
        ct = C.COUNTRY_TEXT[code]
        stats = '\n'.join('{}: = "{}"'.format(k, v) for k, v in ct['stats'])
        write(base + 'missions/{}.txt'.format(C.COUNTRY),
              '[config]\nname  = {}\nguiname = "{}"\ndescription = "{}"\n\njobtitle = "{}"\n\n[stats]\n{}\n'.format(
                  C.COUNTRY, ct['guiname'], ct['description'], ct['jobtitle'], stats))

    # ---------- gráficos ----------
    copied = 0
    if os.path.isdir(ASSETS):
        for dirpath, _dirs, files in os.walk(ASSETS):
            for f in files:
                src = os.path.join(dirpath, f)
                rel = os.path.relpath(src, ASSETS)
                dst = os.path.join(OUT, rel)
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.copy2(src, dst)
                copied += 1
    print('Mod generado en', OUT)
    print('  {} políticas, {} situaciones, {} eventos, {} dilemas, {} deslizadores, {} overrides del país, {} gráficos'.format(
        len(C.POLICIES), len(C.SITUATIONS), len(C.EVENTS), len(C.DILEMMAS), len(C.SLIDERS), len(C.COUNTRY_OVERRIDES), copied))


if __name__ == '__main__':
    build()
