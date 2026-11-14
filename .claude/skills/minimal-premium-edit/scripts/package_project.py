#!/usr/bin/env python3
"""Empacotar para outro editor: copia o projeto de Premiere + TODAS as mídias usadas para uma pasta organizada
(brutos/ cenas/ legendas/ musicas/ sfx/) e ajusta os caminhos do XML (funciona em HD externo).
Uso: package_project.py renders/premiere_<cliente>/PROJETO_PREMIERE.xml <pasta_destino>"""
import re, shutil, sys, pathlib
from urllib.parse import unquote, quote
if len(sys.argv) != 3: sys.exit(__doc__)
xmlp, dest = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
xml = xmlp.read_text(encoding='utf-8'); copied = {}
def bucket(p):
    e, n = p.suffix.lower(), p.name
    if e == '.mov': return 'legendas'
    if e in ('.wav', '.mp3', '.aac', '.m4a'): return 'musicas' if p.stat().st_size > 2_000_000 else 'sfx'
    return 'cenas' if n.startswith(('C0', 'S0')) or n[:1] in 'CS' and n[1:4].isdigit() else 'brutos'
def repl(m):
    src = pathlib.Path(unquote(m.group(1).replace('file://localhost', '')))
    if src in copied: return f'<pathurl>{copied[src]}</pathurl>'
    if not src.exists(): print('  ✘ ausente:', src); return m.group(0)
    d = dest / bucket(src); d.mkdir(parents=True, exist_ok=True); tgt = d / src.name; shutil.copy2(src, tgt)
    u = 'file://localhost' + quote(str(tgt.resolve())); copied[src] = u; return f'<pathurl>{u}</pathurl>'
new = re.sub(r'<pathurl>(.*?)</pathurl>', repl, xml)
dest.mkdir(parents=True, exist_ok=True); (dest / xmlp.name).write_text(new, encoding='utf-8')
print(f'OK: {len(copied)} arquivo(s) copiados para {dest}')
