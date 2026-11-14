#!/usr/bin/env python3
"""ETAPA 6 · Projeto de Premiere (XML Final Cut 7 / xmeml v4 — Premiere: Arquivo > Importar).
Faixas: V1 = bruto cortado (dá pra reabrir o corte) · V2 = cenas (um clipe por cena) · V3 = legendas (MOV com transparência)
        A1 = voz · A2 = SFX.   Cada cena/legenda é um clipe separado e com nome estável: para trocar uma cena, o agente
        regera SÓ aquele arquivo (mesmo nome) e o Premiere reconecta.
Uso: export_premiere.py plano.json --bruto cut.mp4 --cenas <dir> --legendas <dir> --sfx-dir <dir> -o renders/premiere_<cliente>/PROJETO_PREMIERE.xml
Os caminhos viram file://localhost/... ABSOLUTOS; use package_project.py para copiar tudo e reescrever os caminhos."""
import argparse, json, pathlib, subprocess
from urllib.parse import quote
from xml.sax.saxutils import escape

ap = argparse.ArgumentParser(); ap.add_argument('plan'); ap.add_argument('--bruto', required=True)
ap.add_argument('--cenas'); ap.add_argument('--legendas'); ap.add_argument('--sfx-dir'); ap.add_argument('-o', required=True)
a = ap.parse_args()
plan = json.load(open(a.plan, encoding='utf-8')); fps = plan['meta']['fps']; W, H = plan['meta']['width'], plan['meta']['height']
F = lambda s: int(round(s * fps))
def url(p): return 'file://localhost' + quote(str(pathlib.Path(p).resolve()))
def dur_frames(p):
    try:
        d = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)]).decode().strip())
        return F(d)
    except Exception: return None
rate = f'<rate><timebase>{fps}</timebase><ntsc>FALSE</ntsc></rate>'
def vfmt(): return f'<samplecharacteristics>{rate}<width>{W}</width><height>{H}</height><anamorphic>FALSE</anamorphic><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance></samplecharacteristics>'
_ids = {}
def file_el(path, name, n, has_v=True, has_a=False):
    if path in _ids: return f'<file id="{_ids[path]}"/>'
    fid = f'file-{len(_ids)+1}'; _ids[path] = fid
    media = ''
    if has_v: media += f'<video>{vfmt()}</video>'
    if has_a: media += '<audio><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics><channelcount>2</channelcount></audio>'
    return f'<file id="{fid}"><name>{escape(name)}</name><pathurl>{escape(url(path))}</pathurl>{rate}<duration>{n}</duration><media>{media}</media></file>'
def clip(cid, name, path, start, end, n, kind='video', has_a=False, link=None):
    s, e = F(start), F(end); body = file_el(path, pathlib.Path(path).name, n, has_v=(kind == 'video'), has_a=has_a or kind == 'audio')
    extra = ''.join(f'<link><linkclipref>{l}</linkclipref></link>' for l in (link or []))
    return f'<clipitem id="{cid}"><name>{escape(name)}</name><enabled>TRUE</enabled><duration>{n}</duration>{rate}<start>{s}</start><end>{e}</end><in>0</in><out>{e - s}</out>{body}{extra}</clipitem>'

bruto = pathlib.Path(a.bruto); total = F(plan['meta']['duration']); bn = dur_frames(bruto) or total
v1 = clip('v1-bruto', bruto.stem, bruto, 0, plan['meta']['duration'], bn, has_a=True, link=['a1-voz'])
a1 = clip('a1-voz', bruto.stem + ' (voz)', bruto, 0, plan['meta']['duration'], bn, kind='audio')
v2 = ''
for s in sorted(plan['scenes'], key=lambda x: x['start']):
    p = pathlib.Path(a.cenas or '.') / f"{s['id']}.mp4"
    v2 += clip(f"v2-{s['id']}", s['id'], p, s['start'], s['end'], dur_frames(p) or F(s['end'] - s['start']))
v3 = ''
for c in plan['captions']:
    p = pathlib.Path(a.legendas or '.') / f"{c['id']}.mov"
    v3 += clip(f"v3-{c['id']}", c['id'], p, c['start'], c['end'], dur_frames(p) or F(c['end'] - c['start']))
a2 = ''
for i, x in enumerate(plan.get('sfx', [])):
    p = pathlib.Path(a.sfx_dir or '.') / pathlib.Path(x['file']).name
    n = dur_frames(p) or F(0.5); a2 += clip(f'a2-sfx{i}', p.stem, p, x['at'], x['at'] + n / fps, n, kind='audio')
track = lambda items, kind: f'<track>{items}</track>' if items else '<track></track>'
xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4">
  <sequence id="seq-1"><name>{escape(plan['meta'].get('cliente', 'Minimal Premium'))} · edição</name><duration>{total}</duration>{rate}
    <media>
      <video><format>{vfmt()}</format>
        {track(v1, 'v')}{track(v2, 'v')}{track(v3, 'v')}
      </video>
      <audio><numOutputChannels>2</numOutputChannels><format><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics></format>
        {track(a1, 'a')}{track(a2, 'a')}
      </audio>
    </media>
  </sequence>
</xmeml>
'''
out = pathlib.Path(a.o); out.parent.mkdir(parents=True, exist_ok=True); out.write_text(xml, encoding='utf-8')
import xml.dom.minidom as m; m.parseString(xml.encode())   # garante XML bem-formado
print(f'OK: {out}  (V1 bruto · V2 {len(plan["scenes"])} cenas · V3 {len(plan["captions"])} legendas · A1 voz · A2 {len(plan.get("sfx", []))} sfx)')
