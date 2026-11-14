#!/usr/bin/env python3
"""B-rolls e fotos de banco GRATUITO (Pexels/Pixabay). Seja específico: "desfile de luxo com calça jeans".
Precisa de chave de API gratuita:  export PEXELS_API_KEY=...   e/ou   export PIXABAY_API_KEY=...
Uso: stock_search.py "descrição" --dest projeto/assets [--kind video|photo] [--n 2] [--orient portrait] [--prefix JRV]
Os arquivos são nomeados  <prefixo>_<descricao>_<fonte><id>.mp4  (padrão legível do guia).
Direitos: Pexels/Pixabay permitem uso comercial, mas desfile de grife real, marcas e pessoas reconhecíveis podem ter direito autoral/imagem."""
import argparse, json, os, pathlib, re, sys, urllib.parse, urllib.request
ap = argparse.ArgumentParser(); ap.add_argument('query'); ap.add_argument('--dest', required=True); ap.add_argument('--kind', default='video')
ap.add_argument('--n', type=int, default=2); ap.add_argument('--orient', default='portrait'); ap.add_argument('--prefix', default='stock')
a = ap.parse_args(); dest = pathlib.Path(a.dest); dest.mkdir(parents=True, exist_ok=True)
slug = re.sub(r'[^a-z0-9]+', '-', a.query.lower()).strip('-')[:40]
pex, pix = os.environ.get('PEXELS_API_KEY'), os.environ.get('PIXABAY_API_KEY')
if not (pex or pix): sys.exit('Defina PEXELS_API_KEY e/ou PIXABAY_API_KEY (chaves gratuitas em pexels.com/api e pixabay.com/api/docs).')
def get(url, headers=None): return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=headers or {'User-Agent': 'minimal-premium-edit'}), timeout=30))
def save(url, name):
    t = dest / name; urllib.request.urlretrieve(url, t); print('baixado', t); return t
got = 0
if pex and got < a.n:
    q = urllib.parse.urlencode({'query': a.query, 'orientation': a.orient, 'per_page': a.n})
    if a.kind == 'video':
        for v in get(f'https://api.pexels.com/videos/search?{q}', {'Authorization': pex}).get('videos', [])[:a.n]:
            f = sorted([x for x in v['video_files'] if x['file_type'] == 'video/mp4' and x['height'] >= x['width']], key=lambda x: -x['height'])
            if f: save(f[0]['link'], f"{a.prefix}_{slug}_pexels{v['id']}.mp4"); got += 1
    else:
        for p in get(f'https://api.pexels.com/v1/search?{q}', {'Authorization': pex}).get('photos', [])[:a.n]:
            save(p['src']['large2x'], f"{a.prefix}_{slug}_pexels{p['id']}.jpg"); got += 1
if pix and got < a.n:
    q = urllib.parse.urlencode({'key': pix, 'q': a.query, 'per_page': max(3, a.n), 'orientation': 'vertical' if a.orient == 'portrait' else 'horizontal'})
    if a.kind == 'video':
        for v in get(f'https://pixabay.com/api/videos/?{q}').get('hits', [])[:a.n - got]:
            save(v['videos']['large']['url'] or v['videos']['medium']['url'], f"{a.prefix}_{slug}_pixabay{v['id']}.mp4"); got += 1
    else:
        for p in get(f'https://pixabay.com/api/?{q}').get('hits', [])[:a.n - got]:
            save(p['largeImageURL'], f"{a.prefix}_{slug}_pixabay{p['id']}.jpg"); got += 1
print(f'{got} arquivo(s). Confira licença/direitos antes de publicar.')
