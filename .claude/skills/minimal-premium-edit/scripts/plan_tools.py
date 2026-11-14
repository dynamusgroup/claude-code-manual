#!/usr/bin/env python3
"""Ferramentas do PLANO DE EDIÇÃO (plano.json).
  validate  plano.json [--words transcricao.json] [--public-dir pasta]   confere as regras do estilo
  snap      plano.json transcricao.json                                  alinha inícios ao começo da palavra falada
  markdown  plano.json [--words transcricao.json] -o PLANO_DE_EDICAO.md  documento cena a cena (para aprovar / passar a um editor)
Regras checadas (guia Minimal Premium): cortes no início de uma palavra · primeiros 2–3 s só rosto+legenda ·
cenas cobrem ~55–65% · nunca o mesmo tipo duas vezes seguidas · legenda ≤5 palavras · b-roll 1,5–5 s · arquivos existem."""
import argparse, json, pathlib, sys

def load(p): return json.loads(pathlib.Path(p).read_text(encoding='utf-8'))
def words_in(words, a, b): return ' '.join(w['w'] for w in words if w['s'] >= a - 0.02 and w['s'] < b)

def validate(plan, words, public_dir):
    err, warn = [], []
    m = plan['meta']; dur = m['duration']
    if m['fps'] not in (24, 30): warn.append(f"fps={m['fps']} (padrão do guia: 24 ou 30)")
    sc = sorted(plan['scenes'], key=lambda s: s['start'])
    covered = 0.0
    for i, s in enumerate(sc):
        d = s['end'] - s['start']; covered += max(0, d)
        if d <= 0: err.append(f"{s['id']}: fim ≤ início")
        if s['end'] > dur + 1e-6: err.append(f"{s['id']}: termina depois do vídeo ({s['end']}>{dur})")
        if s['type'] == 'broll_text' and not (1.5 <= d <= 5.0): warn.append(f"{s['id']}: b-roll deve durar 1,5–5 s (tem {d:.1f}s)")
        if s['start'] < 2.0: err.append(f"{s['id']}: começa em {s['start']}s — os primeiros 2–3 s são só rosto + legenda (conexão)")
        if i and s['type'] == sc[i-1]['type']: err.append(f"{s['id']}: mesmo tipo ({s['type']}) duas vezes seguidas")
        if i and s['start'] < sc[i-1]['end'] - 1e-6: err.append(f"{s['id']}: sobrepõe {sc[i-1]['id']}")
        if words:
            nearest = min(words, key=lambda w: abs(w['s'] - s['start']))
            if abs(nearest['s'] - s['start']) > 0.12: warn.append(f"{s['id']}: início {s['start']}s não está no começo de uma palavra (mais próxima: '{nearest['w']}' em {nearest['s']}s) → rode `snap`")
        for k in ('src',):
            src = (s.get('props') or {}).get(k)
            if src and public_dir and not src.startswith(('http', '/')) and not (pathlib.Path(public_dir) / src).exists(): err.append(f"{s['id']}: arquivo não encontrado: {src}")
        for it in (s.get('props') or {}).get('items', []):
            src = it.get('src')
            if src and public_dir and not (pathlib.Path(public_dir) / src).exists(): err.append(f"{s['id']}: arquivo não encontrado: {src}")
    cov = covered / dur * 100 if dur else 0
    if not (50 <= cov <= 70): warn.append(f"cenas cobrem {cov:.0f}% do vídeo (alvo ~55–65%)")
    for c in plan['captions']:
        over = [s['id'] for s in sc if c['start'] < s['end'] - 1e-6 and c['end'] > s['start'] + 1e-6]
        if over: warn.append(f"{c['id']}: legenda cai por cima da(s) cena(s) {', '.join(over)} — no estilo, a legenda cinematográfica fica nos trechos de ROSTO")
        n = sum(len(l['text'].split()) for l in c['lines'])
        if n > 5: err.append(f"{c['id']}: legenda com {n} palavras (máx. 5)")
        big = [l for l in c['lines'] if l['kind'] != 'small']
        if not (1 <= len(big) <= 3): warn.append(f"{c['id']}: use 1–3 palavras-chave grandes (tem {len(big)})")
        if words:
            nearest = min(words, key=lambda w: abs(w['s'] - c['start']))
            if abs(nearest['s'] - c['start']) > 0.25: warn.append(f"{c['id']}: legenda não começa perto de uma palavra falada")
    if m.get('bruto') and public_dir and not (pathlib.Path(public_dir) / m['bruto']).exists(): err.append(f"bruto não encontrado: {m['bruto']}")
    first = min([s['start'] for s in sc] + [dur])
    print(f"cenas: {len(sc)} · cobertura {cov:.0f}% · legendas: {len(plan['captions'])} · 1ª cena em {first:.1f}s")
    for w in warn: print('  ⚠', w)
    for e in err: print('  ✘', e)
    print('OK' if not err else f'{len(err)} erro(s)')
    return not err

def snap(plan, words, path):
    starts = [w['s'] for w in words]
    def nearest(t): return min(starts, key=lambda x: abs(x - t))
    ch = 0
    for s in plan['scenes']:
        n = nearest(s['start']); old = s['start']
        if abs(n - old) <= 0.3 and n != old:
            s['start'] = round(n, 3); ch += 1
            for x in plan.get('sfx', []):          # o som acompanha o início da cena
                if abs(x['at'] - old) < 0.011: x['at'] = s['start']
    for c in plan['captions']:
        n = nearest(c['start'])
        if abs(n - c['start']) <= 0.3 and n != c['start']: c['start'] = round(n, 3); ch += 1
    pathlib.Path(path).write_text(json.dumps(plan, ensure_ascii=False, indent=1), encoding='utf-8')
    print(f'{ch} início(s) alinhado(s) ao começo de palavra em {path}')

def markdown(plan, words):
    m, th = plan['meta'], plan.get('theme', {})
    L = [f"# Plano de edição — {m.get('cliente', 'projeto')}", '',
         f"**Formato:** {m['width']}×{m['height']} · {m['fps']} fps · {m['duration']:.1f}s  ",
         f"**Paleta:** " + ' · '.join(f"{k} `{v}`" for k, v in th.items() if k in ('bg', 'text', 'accent', 'support')), '',
         '## Cenas', '', '| # | Tempo | O que é falado | Tipo de cena | Detalhe | Som |', '|---|---|---|---|---|---|']
    sfx = plan.get('sfx', [])
    for i, s in enumerate(sorted(plan['scenes'], key=lambda s: s['start']), 1):
        fala = words_in(words, s['start'], s['end']) if words else s.get('note', '')
        pr = s.get('props', {}); det = pr.get('src') or pr.get('text') or pr.get('label') or pr.get('title') or ', '.join(n['label'] for n in pr.get('nodes', [])) or ', '.join(it.get('year', '') for it in pr.get('items', [])) or ''
        sx = ', '.join(x['file'] for x in sfx if s['start'] <= x['at'] < s['end']) or '—'
        L.append(f"| {i} | {s['start']:.1f}–{s['end']:.1f}s | {fala or s.get('note','')} | {s['type']} (`{s['id']}`) | {det} | {sx} |")
    L += ['', '## Legendas', '', '| # | Tempo | Texto (pequeno / **grande**) |', '|---|---|---|']
    for i, c in enumerate(plan['captions'], 1):
        L.append(f"| {i} | {c['start']:.1f}–{c['end']:.1f}s | " + ' / '.join(f"**{l['text']}**" if l['kind'] != 'small' else l['text'] for l in c['lines']) + ' |')
    L += ['', '## Notas', '- Cortes sempre no início de uma palavra.', '- Cada volta ao rosto tem leve zoom (efeito multicâmera).', '- **Revise aqui**: mudar no papel é a etapa mais barata.']
    return '\n'.join(L) + '\n'

if __name__ == '__main__':
    ap = argparse.ArgumentParser(); sp = ap.add_subparsers(dest='cmd', required=True)
    v = sp.add_parser('validate'); v.add_argument('plan'); v.add_argument('--words'); v.add_argument('--public-dir')
    s = sp.add_parser('snap'); s.add_argument('plan'); s.add_argument('words')
    m = sp.add_parser('markdown'); m.add_argument('plan'); m.add_argument('--words'); m.add_argument('-o', default='PLANO_DE_EDICAO.md')
    a = ap.parse_args()
    plan = load(a.plan)
    words = load(a.words)['words'] if getattr(a, 'words', None) else None
    if a.cmd == 'validate': sys.exit(0 if validate(plan, words, a.public_dir) else 1)
    if a.cmd == 'snap': snap(plan, words, a.plan)
    if a.cmd == 'markdown': pathlib.Path(a.o).write_text(markdown(plan, words), encoding='utf-8'); print('OK:', a.o)
