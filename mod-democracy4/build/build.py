# -*- coding: utf-8 -*-
"""Genera la carpeta del mod a partir de content.py.

Uso:  python3 mod-democracy4/build/build.py
Salida: mod-democracy4/dist/argentina_gobernala/
Los gráficos (íconos, bandera, mapa, imágenes de eventos) los genera assets.js; build.py sólo los referencia.
"""
import csv, io, os, re, shutil, sys

sys.path.insert(0, os.path.dirname(__file__))
import content as C
import content_names as N

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
OUT = os.path.join(ROOT, 'dist', C.MOD_NAME)
ASSETS = os.path.join(ROOT, 'assets')        # salida de assets.js
NL = '\n'                                    # fin de línea Unix, igual que los mods publicados que funcionan
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
        C.MOD_NAME, C.MOD_CONFIG['guiname'], C.MOD_CONFIG['author'], C.MOD_CONFIG['description_es'].format(
            pol=len(C.POLICIES), sit=len(C.SITUATIONS), ev=len(C.EVENTS), dil=len(C.DILEMMAS))))

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
    # El mod está pensado para jugar con Argentina: los eventos usan el azar del juego tal cual y pueden depender de
    # valores globales. (Si algún día hace falta limitarlos a Argentina, este es el lugar.)
    def gate(infl):
        return list(infl)

    POSITIVE_SITS = {x['name'] for x in C.SITUATIONS if x['positive']}
    for e in C.EVENTS:
        grudges = ''.join('CreateGrudge({},{},{});'.format(t, a, d) for t, a, d in e['grudges'])
        # sonido del juego base, como los eventos de los mods publicados: uno para buenas noticias y otro para malas
        tone = sum(a for _t, a, _d in e['grudges'] if not _t.startswith('AR_')) - \
            sum(a for _t, a, _d in e['grudges'] if _t.startswith('AR_') and not _t in POSITIVE_SITS)
        sound = 'DM4_Low Corruption Praised.wav' if tone > 0 else 'DM4_Credit Rating Downgraded.wav'
        infl = '\n'.join('{} = {}'.format(i, x) for i, x in enumerate(gate(e['influences'])))
        write('data/simulation/events/{}.txt'.format(e['name']),
              '[config]\nName = {}\nTexture = {}.jpg\nGUISound = {}\nOnImplement = {}\n\n[influences]\n{}\n'.format(
                  e['name'], e['name'], sound, grudges, infl))

    # ---------- dilemas ----------
    for d in C.DILEMMAS:
        infl = '\n'.join('{} = {}'.format(i, x) for i, x in enumerate(gate(d['influences'])))
        opts = ''
        for i, (grudges, _es, _en) in enumerate(d['options']):
            g = ''.join('CreateGrudge({},{},0.9);'.format(t, a) for t, a in grudges)
            opts += '\n[option{}]\nOnImplement = {}\n'.format(i, g)
        write('data/simulation/dilemmas/{}.txt'.format(d['name']),
              '[dilemma]\nname={}\n\n[influences]\n{}\n{}'.format(d['name'], infl, opts))

    # ---------- país: la Argentina de diciembre de 2023 ----------
    def mission(name, cfg_over, base_changes, start, text, boosts=()):
        cfg = dict(C.COUNTRY_CONFIG)
        cfg['name '] = name
        cfg.update(cfg_over)
        pols = dict(C.COUNTRY_POLICIES)
        for k, v in base_changes.items():
            if v is None:
                pols.pop(k, None)
            else:
                pols[k] = v
        pols[C.PREREQ] = 1
        pols.update(start)
        write('data/missions/{0}/{0}.txt'.format(name),
              '[config]\n{}\n\n[policies]\n{}\n\n[options]\nMULTIPLEPARTIES\n'.format(
                  '\n'.join('{} = {}'.format(k, v) for k, v in cfg.items()),
                  '\n'.join('{} = {}'.format(k, v) for k, v in pols.items())))
        for label, target, eq in C.COUNTRY_OVERRIDES:
            write('data/missions/{}/overrides/{}.ini'.format(name, label),
                  '[override]\nTargetName = "{0}"\nHostName = "{0}"\nEquation = "{1}"\nInertia = 0\n'.format(target, eq))
        for label, host, target, eq, inertia in C.CHAIN_OVERRIDES:
            write('data/missions/{}/overrides/{}.ini'.format(name, label),
                  '[override]\nTargetName = "{}"\nHostName = "{}"\nEquation = "{}"\nInertia = {}\n'.format(target, host, eq, inertia))
        for label, target, eq in boosts:
            write('data/missions/{}/overrides/{}.ini'.format(name, label),
                  '[override]\nTargetName = "{0}"\nHostName = "{0}"\nEquation = "{1}"\nInertia = 0\n'.format(target, eq))
        for lang, code in LANGS.items():
            ct = text[code]
            stats = '\n'.join('{}: = "{}"'.format(k, v) for k, v in ct['stats'])
            write('translations/{}/missions/{}.txt'.format(lang, name),
                  '[config]\nname  = {}\nguiname = "{}"\ndescription = "{}"\n\njobtitle = "{}"\n\n[stats]\n{}\n'.format(
                      name, ct['guiname'], ct['description'], ct['jobtitle'], stats))

    mission(C.COUNTRY, {}, {'RentControls': 0.6}, C.START_2023, C.COUNTRY_TEXT)

    # ---------- nombres ----------
    write('data/names/argentinanames_gb.txt', ''.join('[{}]\n{}\n\n'.format(k, '\n'.join(v)) for k, v in C.NAMES.items()))

    # ---------- traducciones ----------
    for lang, code in LANGS.items():
        base = 'translations/{}/'.format(lang)
        k = 0 if code == 'es' else 1
        # políticas y situaciones del juego con nombre argentino (content_names.py)
        write(base + 'policies.csv', csv_text([['#', p['name'], p[code][0], p[code][1]] for p in C.POLICIES] +
                                              [['#', n, t[k][0], t[k][1]] for n, t in N.POLICY_NAMES.items()]))
        write(base + 'situations.csv', csv_text([['#', s['name'], s[code][0], s[code][1]] for s in C.SITUATIONS] +
                                                [['#', n, t[k][0], t[k][1]] + list(N.SITUATION_NOTICES[n][k])
                                                 for n, t in N.SITUATION_NAMES.items()]))
        write(base + 'events.csv', csv_text([['#', e['name'], e[code][0], e[code][1]] for e in C.EVENTS] +
                                            [['#', n, t[k][0], t[k][1]] for n, t in N.EVENT_NAMES.items()]))
        drows = []
        for d in C.DILEMMAS:
            drows.append(['#', d['name'], d[code][0], d[code][1], ' '])
            for i, opt in enumerate(d['options']):
                t = opt[1] if code == 'es' else opt[2]
                drows.append(['#', '{}_{}'.format(d['name'], i), t[0], t[1]])
        write(base + 'dilemmas.csv', csv_text(drows))
        write(base + 'sliders.csv', csv_text([['#', k] + v[code] for k, v in C.SLIDERS.items()]))

    # ---------- gráficos ----------
    copied = 0
    if os.path.isdir(ASSETS):
        for dirpath, _dirs, files in os.walk(ASSETS):
            for f in files:
                src = os.path.join(dirpath, f)
                if f.lower() in {'icons_{}.svg'.format(n.lower()) for n in C.MERGED}:
                    continue  # política fusionada con una del juego
                rel = os.path.relpath(src, ASSETS)
                dst = os.path.join(OUT, rel)
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.copy2(src, dst)
                copied += 1
    # Imagen del menú de mods: el juego la busca como mods/<nombre del mod>.jpg, AL LADO de la carpeta del mod
    # (así lo dice su registro: "Failed to create texture from file: argentina_gobernala.jpg").
    prev = os.path.join(OUT, 'preview.jpg')
    if os.path.exists(prev):
        shutil.move(prev, os.path.join(os.path.dirname(OUT), C.MOD_NAME + '.jpg'))
    print('Mod generado en', OUT)
    print('  {} políticas, {} situaciones, {} eventos, {} dilemas, {} deslizadores, {} rasgos y {} enlaces causales argentinos, '
          '{} gráficos'.format(len(C.POLICIES), len(C.SITUATIONS), len(C.EVENTS), len(C.DILEMMAS), len(C.SLIDERS),
                               len(C.COUNTRY_OVERRIDES), len(C.CHAIN_OVERRIDES), copied))


if __name__ == '__main__':
    build()
