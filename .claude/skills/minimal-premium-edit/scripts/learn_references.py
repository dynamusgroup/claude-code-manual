#!/usr/bin/env python3
"""ETAPA 2 · Estudar as referências: frames-chave, transcrição opcional e métricas de ritmo.
Para cada vídeo em referencias/ gera: frames de mudança de cena, um MOSAICO por vídeo e um mosaico geral
(board/mosaico_referencias.jpg — "a forma mais barata de corrigir o rumo": confira em 10 s se são os vídeos certos).
Uso: learn_references.py <pasta_referencias> <pasta_board> [--per-video 12]"""
import argparse, json, pathlib, re, subprocess
from PIL import Image, ImageDraw
ap = argparse.ArgumentParser(); ap.add_argument('refs'); ap.add_argument('board'); ap.add_argument('--per-video', type=int, default=12); ap.add_argument('--scene', type=float, default=0.2, help='limiar de detecção de corte (menor = mais sensível)')
a = ap.parse_args()
refs = pathlib.Path(a.refs); board = pathlib.Path(a.board); fr = board / 'frames_referencias'; fr.mkdir(parents=True, exist_ok=True)
VID = {'.mp4', '.mov', '.m4v', '.webm', '.mkv'}
vids = sorted(p for p in refs.iterdir() if p.suffix.lower() in VID)
if not vids: raise SystemExit(f'Nenhum vídeo em {refs}. Coloque 5–10 reels do estilo que você admira.')
def probe(p):
    o = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=width,height,r_frame_rate', '-of', 'json', str(p)])
    j = json.loads(o); st = [s for s in j['streams'] if 'width' in s][0]
    return float(j['format']['duration']), st['width'], st['height']
report = []; tiles = []
for v in vids:
    dur, w, h = probe(v)
    # cortes: detecção de mudança de cena
    log = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(v), '-vf', f"select='gt(scene,{a.scene})',showinfo", '-an', '-f', 'null', '-'], capture_output=True, text=True).stderr
    cuts = [float(x) for x in re.findall(r'pts_time:([\d.]+)', log)]
    # loudness
    ll = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(v), '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
    lufs = re.findall(r'I:\s+(-?[\d.]+) LUFS', ll)
    n = a.per_video; stem = v.stem
    for i in range(n):
        t = dur * (i + 0.5) / n
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', str(v), '-frames:v', '1', '-vf', 'scale=270:-2', str(fr / f'{stem}_{i:02d}.jpg')], check=True)
    ims = [Image.open(fr / f'{stem}_{i:02d}.jpg') for i in range(n)]
    cols = 6; rows = (n + cols - 1) // cols; tw, th = ims[0].size
    sheet = Image.new('RGB', (cols * tw, rows * th + 28), '#111')
    ImageDraw.Draw(sheet).text((6, 6), f'{v.name}  ·  {dur:.0f}s  ·  {len(cuts)} cortes ({len(cuts)/dur*60:.0f}/min)', fill='#ddd')
    for i, im in enumerate(ims): sheet.paste(im, ((i % cols) * tw, 28 + (i // cols) * th))
    sheet.save(board / f'mosaico_{stem}.jpg', quality=88); tiles.append(sheet)
    report.append({'arquivo': v.name, 'duracao_s': round(dur, 1), 'resolucao': f'{w}x{h}', 'cortes': len(cuts), 'cortes_por_min': round(len(cuts) / dur * 60, 1),
                   'plano_medio_s': round(dur / (len(cuts) + 1), 2), 'loudness_lufs': float(lufs[-1]) if lufs else None, 'tempos_dos_cortes': [round(c, 2) for c in cuts[:60]]})
W = max(t.width for t in tiles); allh = sum(t.height for t in tiles)
big = Image.new('RGB', (W, allh), '#111'); y = 0
for t in tiles: big.paste(t, (0, y)); y += t.height
big.thumbnail((2400, 6000)); big.save(board / 'mosaico_referencias.jpg', quality=85)
(board / 'referencias_analise.json').write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding='utf-8')
print(json.dumps([{k: r[k] for k in ('arquivo', 'duracao_s', 'cortes_por_min', 'plano_medio_s', 'loudness_lufs')} for r in report], ensure_ascii=False, indent=1))
print('Mosaico:', board / 'mosaico_referencias.jpg')
