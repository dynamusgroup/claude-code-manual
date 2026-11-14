#!/usr/bin/env python3
"""Gera legenda .ass (estilo shorts) a partir de timestamps por palavra.

Entrada JSON: [{"w":"Muita","s":0.00,"e":0.30}, ...]   (formato simples; veja --from-whisper)
Palavras-chave em destaque: --kw "criativo,briefing"  ou marque com *asteriscos* no texto.
Uso: make_captions.py palavras.json legenda.ass [--max 3] [--kw a,b] [--hl "#D96D54"] [--w 1080 --h 1920] [--y 0.66] [--font "Manrope"]
     make_captions.py whisper.json legenda.ass --from-whisper   (JSON do whisper com word_timestamps)
"""
import json, sys, argparse, re

p = argparse.ArgumentParser()
p.add_argument('src'); p.add_argument('out')
p.add_argument('--max', type=int, default=3, help='máx. palavras por bloco')
p.add_argument('--kw', default='')
p.add_argument('--hl', default='#D96D54')
p.add_argument('--w', type=int, default=1080); p.add_argument('--h', type=int, default=1920)
p.add_argument('--y', type=float, default=0.66, help='posição vertical (0-1), 0.66 = terço inferior')
p.add_argument('--font', default='Manrope'); p.add_argument('--size', type=int, default=64)
p.add_argument('--from-whisper', action='store_true')
a = p.parse_args()

def bgr(hexcol):  # '#RRGGBB' -> ASS &HBBGGRR&
    h = hexcol.lstrip('#'); return '&H%s%s%s&' % (h[4:6], h[2:4], h[0:2])

data = json.load(open(a.src, encoding='utf-8'))
if a.from_whisper:
    words = [{'w': w['word'].strip(), 's': w['start'], 'e': w['end']}
             for seg in data.get('segments', []) for w in seg.get('words', [])]
else:
    words = data
kws = {k.strip().lower() for k in a.kw.split(',') if k.strip()}

def ts(t):
    h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return '%d:%02d:%05.2f' % (h, m, s)

def is_kw(w):
    plain = re.sub(r'\W', '', w['w']).lower()
    return w['w'].startswith('*') or plain in kws

lines = []
i = 0
while i < len(words):
    chunk = [words[i]]
    while len(chunk) < a.max and i + len(chunk) < len(words):
        nxt = words[i + len(chunk)]
        if nxt['s'] - chunk[-1]['e'] > 0.35 or re.search(r'[.!?]$', chunk[-1]['w']): break
        chunk.append(nxt)
    i += len(chunk)
    txt = ' '.join(('{\\c%s}%s{\\c&HFFFFFF&}' % (bgr(a.hl), c['w'].strip('*')) if is_kw(c) else c['w'].strip('*')) for c in chunk)
    lines.append((chunk[0]['s'], max(chunk[-1]['e'], chunk[0]['s'] + 0.25), txt))

# ligeiro "pop" de entrada (escala 92->100%) para dar vida
head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {a.w}
PlayResY: {a.h}
WrapStyle: 0

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Cap,{a.font},{a.size},&H00FFFFFF,&H00FFFFFF,&H00101010,&H80000000,1,0,0,0,100,100,0,0,1,6,2,5,60,60,0,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""
y = int(a.h * a.y)
with open(a.out, 'w', encoding='utf-8') as f:
    f.write(head)
    for s, e, t in lines:
        f.write('Dialogue: 0,%s,%s,Cap,,0,0,0,,{\\pos(%d,%d)\\fscx92\\fscy92\\t(0,90,\\fscx100\\fscy100)}%s\n' % (ts(s), ts(e), a.w // 2, y, t))
print('OK:', a.out, len(lines), 'blocos')
