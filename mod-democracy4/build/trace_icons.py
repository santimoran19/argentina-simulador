# -*- coding: utf-8 -*-
"""Convierte los íconos PNG (trazo negro sobre blanco) en SVG de formas rellenas blancas, como los del juego.

Uso: python3 trace_icons.py <carpeta-temporal>     (necesita: pip install potracer pillow numpy)
"""
import glob, os, sys
import numpy as np
from PIL import Image
import potrace

TMP = sys.argv[1]
OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'data', 'svg')
os.makedirs(OUT, exist_ok=True)
S = 256 / 512  # de 512 px a la grilla de 256 del juego

n = 0
for f in sorted(glob.glob(os.path.join(TMP, 'iconpng', '*.png'))):
    img = np.array(Image.open(f).convert('L'))
    bmp = potrace.Bitmap(img >= 128)  # potracer traza los píxeles en False: el trazo oscuro
    paths = bmp.trace(turdsize=6, alphamax=1.0, opticurve=True, opttolerance=0.2)
    d = []
    for curve in paths:
        sp = curve.start_point
        seg = ['M{:.1f} {:.1f}'.format(sp.x * S, sp.y * S)]
        for s in curve.segments:
            if s.is_corner:
                seg.append('L{:.1f} {:.1f} L{:.1f} {:.1f}'.format(s.c.x * S, s.c.y * S, s.end_point.x * S, s.end_point.y * S))
            else:
                seg.append('C{:.1f} {:.1f} {:.1f} {:.1f} {:.1f} {:.1f}'.format(s.c1.x * S, s.c1.y * S, s.c2.x * S, s.c2.y * S,
                                                                             s.end_point.x * S, s.end_point.y * S))
        d.append(' '.join(seg) + ' Z')
    name = os.path.splitext(os.path.basename(f))[0]
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">'
           '<path style="fill:#ffffff;fill-rule:evenodd" d="{}"/></svg>').format(' '.join(d))
    open(os.path.join(OUT, name + '.svg'), 'w', encoding='utf-8').write(svg)
    n += 1
print('íconos vectorizados:', n)
