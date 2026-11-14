#!/usr/bin/env python3
"""Corta silêncios de um vídeo falado mantendo áudio e imagem em sincronia.
Uso: cut_silence.py entrada.mp4 saida.mp4 [--db -32] [--min 0.35] [--pad 0.08]
  --db   limiar de silêncio em dB (mais negativo = só corta silêncio profundo)
  --min  duração mínima do silêncio a cortar (s)
  --pad  folga mantida em cada borda da fala (s), evita "comer" o início das palavras
Imprime também o mapa de tempo (original -> editado) em <saida>.map.json, útil para alinhar legendas.
"""
import subprocess, re, sys, json, argparse
p = argparse.ArgumentParser(); p.add_argument('inp'); p.add_argument('out')
p.add_argument('--db', type=float, default=-32); p.add_argument('--min', type=float, default=0.35); p.add_argument('--pad', type=float, default=0.08)
a = p.parse_args()

def probe_dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode().strip())
D = probe_dur(a.inp)
log = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', a.inp, '-af', f'silencedetect=noise={a.db}dB:d={a.min}', '-f', 'null', '-'],
                     stderr=subprocess.PIPE, text=True).stderr
starts = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]
ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
sil = list(zip(starts, ends + [D] * (len(starts) - len(ends))))
keep, cur = [], 0.0
for s, e in sil:
    if s - cur > 0.05: keep.append((max(0, cur - a.pad), min(D, s + a.pad)))
    cur = e
if D - cur > 0.05: keep.append((max(0, cur - a.pad), D))
# funde trechos que se tocam por causa do pad
merged = []
for s, e in keep:
    if merged and s <= merged[-1][1]: merged[-1] = (merged[-1][0], max(e, merged[-1][1]))
    else: merged.append((s, e))
if not merged: sys.exit('Nenhuma fala detectada; ajuste --db.')
parts_v = ''.join(f'[0:v]trim={s:.3f}:{e:.3f},setpts=PTS-STARTPTS[v{i}];[0:a]atrim={s:.3f}:{e:.3f},asetpts=PTS-STARTPTS[a{i}];' for i, (s, e) in enumerate(merged))
cat = ''.join(f'[v{i}][a{i}]' for i in range(len(merged))) + f'concat=n={len(merged)}:v=1:a=1[v][a]'
subprocess.check_call(['ffmpeg', '-y', '-v', 'error', '-i', a.inp, '-filter_complex', parts_v + cat, '-map', '[v]', '-map', '[a]',
                       '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', a.out])
acc, tmap = 0.0, []
for s, e in merged:
    tmap.append({'orig_start': round(s, 3), 'orig_end': round(e, 3), 'new_start': round(acc, 3)}); acc += e - s
json.dump(tmap, open(a.out + '.map.json', 'w'), indent=1)
print(f'OK: {D:.1f}s -> {acc:.1f}s ({len(merged)} trechos mantidos)')
