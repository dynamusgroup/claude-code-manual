#!/usr/bin/env python3
"""ETAPA 3 · Board de estilo (board/board_estilo.html): paleta, fontes, as 10 técnicas com frames reais, ritmo e regras.
É o equivalente ao board de Figma do tutorial. Gere os frames antes:
  node remotion/scripts/render_stills.mjs --out board/frames --frame 84 --props board/tema.json     (tema.json = {"theme": {...}})
Uso: make_board.py <pasta_board> [--theme tema.json] [--cliente NOME]"""
import argparse, json, pathlib, html
ap = argparse.ArgumentParser(); ap.add_argument('board'); ap.add_argument('--theme'); ap.add_argument('--cliente', default='')
a = ap.parse_args(); b = pathlib.Path(a.board)
th = {'bg': '#F4F1EA', 'text': '#141414', 'accent': '#B8923F', 'support': '#1F4D3A'}
if a.theme:
    t = json.load(open(a.theme)); th.update(t.get('theme', t))
T = [('p01-legenda-cinematografica', '1 · Legenda cinematográfica', 'Frase curta (≤5 palavras): 1–3 palavras-chave grandes — serifada itálica para emoção, sem serifa negrito para fatos e números; o resto pequeno, colado acima e abaixo. Cada parte entra quando é falada; sai com desfoque.'),
     ('p02-broll-texto', '2 · B-roll + texto', 'Um clipe por ideia, mostrando literalmente o que é dito, 1,5–5 s; levemente dessaturado, vinheta, grão, zoom lento.'),
     ('p03-pintura', '3 · Pintura', 'Pintura ou foto antiga com efeito de tinta a óleo; a câmera desliza de lado.'),
     ('p04-linha-texto', '4 · Linha + texto', 'Uma linha na cor de destaque, com brilho, liga 2–4 conceitos falados em sequência; a câmera viaja pela linha.'),
     ('p05-linha-do-tempo', '5 · Linha do tempo', 'Fundo papel com grade, fotos estilo polaroid subindo sobre a linha, anos embaixo. Para datas e fases.'),
     ('p06-texto-central', '6 · Texto central', 'Fundo papel (ou na cor da paleta), texturizado, aspas grandes, a frase-tese no meio.'),
     ('p07-ilustracao-central', '7 · Ilustração central', 'Pessoa recortada e transformada em ilustração em tinta (cor de destaque), anéis em volta.'),
     ('p08-ilustracao-lateral', '8 · Ilustração lateral', 'Ilustração de um lado, texto do outro. Para contraste.'),
     ('p09-destaque-objeto', '9 · Destaque de objeto', 'Foto tipo polaroid e um círculo de pincel (irregular) em volta do detalhe: rosto, etiqueta, logo.'),
     ('p10-grafico', '10 · Gráfico', 'Fundo escuro, grade fina, bolinha brilhante na cor de destaque percorrendo os dados.')]
LOGICA = [('Datas, fases, "em 1998…"', 'Linha do tempo (5)'), ('Números, percentuais, crescimento', 'Gráfico (10)'), ('Objeto/lugar/etiqueta citado', 'Destaque de objeto (9) ou B-roll (2)'),
          ('Ideia concreta que dá para filmar', 'B-roll + texto (2)'), ('Causa → efeito, 2–4 conceitos', 'Linha + texto (4)'), ('Frase-tese, conclusão', 'Texto central (6) ou no rosto com aspas'),
          ('Contexto histórico, "antigamente"', 'Pintura (3)'), ('Pessoa / especialista citado', 'Ilustração central (7)'), ('Antes × depois, contraste', 'Ilustração lateral (8)'), ('Emoção, 1–3 palavras-chave', 'Legenda cinematográfica (1)')]
RITMO = ['Primeiros 2–3 s: rosto e legenda (conexão). Depois do gancho, a primeira cena.', 'Cenas cobrem ~55–65% do vídeo; nunca o mesmo tipo duas vezes seguidas.',
         'Toda volta ao rosto tem leve zoom (cara de multicâmera).', 'Cortes sempre no início de uma palavra.', 'Uma única cor de destaque; legendas no rosto continuam brancas.',
         'Entradas de 0,45–0,55 s, 24 fps, movimento suave. Legenda nunca acima de 30% da altura.', 'Sem whoosh/impacto: só "cliques" baixinhos quando um elemento aparece (se o briefing pedir SFX).']
cards = ''
for id_, tit, desc in T:
    img = b / 'frames' / f'{id_}.png'
    src = f'frames/{id_}.png' if img.exists() else ''
    cards += f'<figure><div class="ph">{"<img src=%s>" % src if src else "<span>renderize os frames</span>"}</div><figcaption><h3>{html.escape(tit)}</h3><p>{html.escape(desc)}</p></figcaption></figure>'
sw = ''.join(f'<div class="sw"><i style="background:{v}"></i><b>{n}</b><code>{v}</code></div>' for n, v in (('Fundo', th['bg']), ('Texto', th['text']), ('Destaque', th['accent']), ('Apoio', th['support'])))
mos = '<section><h2>Referências estudadas</h2><img class="mos" src="mosaico_referencias.jpg"></section>' if (b / 'mosaico_referencias.jpg').exists() else ''
doc = f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Board de estilo — Minimal Premium</title><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Playfair+Display:ital,wght@1,400;1,700&display=swap" rel="stylesheet">
<style>:root{{--bg:{th['bg']};--tx:{th['text']};--ac:{th['accent']};--su:{th['support']}}}
body{{margin:0;background:var(--bg);color:var(--tx);font:16px/1.6 Inter,system-ui,sans-serif}}main{{max-width:1180px;margin:auto;padding:56px 24px 90px}}
h1,h2,h3{{font-family:"Playfair Display",Georgia,serif;font-style:italic}}h1{{font-size:clamp(40px,6vw,72px);line-height:1.02;margin:6px 0 10px}}
.k{{font:700 12px Inter;letter-spacing:.16em;text-transform:uppercase;color:var(--ac)}}h2{{font-size:34px;margin:56px 0 18px;color:var(--su)}}
.sws{{display:flex;gap:14px;flex-wrap:wrap}}.sw{{display:grid;gap:4px;font-size:13px}}.sw i{{width:150px;height:84px;border-radius:12px;border:1px solid #0002}}
.grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:22px}}figure{{margin:0}}.ph{{aspect-ratio:9/16;border-radius:14px;overflow:hidden;background:#0001;border:1px solid #0002}}
.ph img{{width:100%;height:100%;object-fit:cover;display:block}}.ph span{{display:grid;place-items:center;height:100%;color:#0007;font-size:13px}}
figcaption h3{{font-size:21px;margin:12px 0 4px}}figcaption p{{margin:0;font-size:13.5px;color:#0009}}table{{border-collapse:collapse;width:100%}}td,th{{text-align:left;padding:10px 12px;border-bottom:1px solid #0002;font-size:14.5px}}th{{color:var(--su)}}
ul{{padding-left:20px}}li{{margin:6px 0}}.mos{{width:100%;border-radius:12px}}.fonts{{display:grid;grid-template-columns:1fr 1fr;gap:18px}}.fonts>div{{padding:22px;border:1px solid #0002;border-radius:14px}}
@media(max-width:640px){{.fonts{{grid-template-columns:1fr}}}}</style></head><body><main>
<div class="k">Board de estilo · {html.escape(a.cliente or 'Minimal Premium')}</div><h1>Minimal Premium</h1>
<p>Muito espaço em branco, tipografia de revista, <b>uma única cor de destaque</b> e movimento suave.</p>
<h2>Paleta</h2><div class="sws">{sw}</div>
<h2>Tipografia</h2><div class="fonts"><div><div class="k">Emoção · serifada itálica</div><p style="font:italic 700 54px/1.05 'Playfair Display',serif;margin:8px 0">cuidado</p><code>Playfair Display Italic 700</code></div><div><div class="k">Fatos e números · sem serifa negrito</div><p style="font:800 46px/1.05 Inter,sans-serif;margin:8px 0">100% · 3 PASSOS</p><code>Inter 800 / 600</code></div></div>
<h2>As 10 técnicas</h2><div class="grid">{cards}</div>
<h2>Lógica de posicionamento — o que é falado → que cena entra</h2><table><tr><th>Quando a fala traz…</th><th>Entra…</th></tr>{''.join(f"<tr><td>{html.escape(x)}</td><td>{html.escape(y)}</td></tr>" for x, y in LOGICA)}</table>
<h2>Ritmo e regras</h2><ul>{''.join(f"<li>{html.escape(r)}</li>" for r in RITMO)}</ul>{mos}</main></body></html>'''
(b / 'board_estilo.html').write_text(doc, encoding='utf-8'); print('OK:', b / 'board_estilo.html')
