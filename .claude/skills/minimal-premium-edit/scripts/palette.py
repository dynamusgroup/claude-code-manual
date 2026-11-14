#!/usr/bin/env python3
"""Paleta harmônica (1 fundo, 1 texto, 1 destaque, 1 apoio). Sem arg: sorteia (NÃO usa azul como padrão).
Uso: palette.py [--seed N] [--hue 0-360] [--brand "#hex,#hex,..."]   -> JSON de tema no stdout"""
import argparse, colorsys, json, random
p = argparse.ArgumentParser(); p.add_argument('--seed', type=int); p.add_argument('--hue', type=float); p.add_argument('--brand')
a = p.parse_args()
def hx(h, s, l): r, g, b = colorsys.hls_to_rgb(h / 360, l, s); return '#%02X%02X%02X' % (round(r*255), round(g*255), round(b*255))
def lum(c):
    c = c.lstrip('#'); v = [int(c[i:i+2], 16)/255 for i in (0, 2, 4)]
    v = [x/12.92 if x <= .03928 else ((x+.055)/1.055)**2.4 for x in v]; return .2126*v[0]+.7152*v[1]+.0722*v[2]
def contrast(a, b): la, lb = sorted([lum(a), lum(b)], reverse=True); return (la+.05)/(lb+.05)
if a.brand:
    c = [x.strip().upper() for x in a.brand.split(',')]
    theme = {'bg': c[0], 'text': c[1] if len(c) > 1 else '#141414', 'accent': c[2] if len(c) > 2 else '#B8923F', 'support': c[3] if len(c) > 3 else '#1F4D3A'}
else:
    rnd = random.Random(a.seed)
    for _ in range(200):
        hue = a.hue if a.hue is not None else rnd.uniform(0, 360)
        if a.hue is None and 190 <= hue <= 260: continue   # evita azul como padrão
        harmony = rnd.choice([30, 150, 180, 210])
        theme = {'bg': hx(hue, rnd.uniform(.08, .18), rnd.uniform(.93, .96)),
                 'text': hx(hue, rnd.uniform(.1, .25), rnd.uniform(.07, .12)),
                 'accent': hx(hue + harmony, rnd.uniform(.45, .7), rnd.uniform(.38, .5)),
                 'support': hx(hue - 25, rnd.uniform(.25, .45), rnd.uniform(.2, .3))}
        if contrast(theme['bg'], theme['text']) >= 12 and contrast(theme['bg'], theme['accent']) >= 3.2: break
theme['dark'] = '#0F0F0F'; theme['paper'] = theme['bg']
theme['contrast_bg_text'] = round(contrast(theme['bg'], theme['text']), 1); theme['contrast_bg_accent'] = round(contrast(theme['bg'], theme['accent']), 1)
print(json.dumps(theme, indent=1))
