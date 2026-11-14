# plano.json — o plano de edição que dirige o render
Exemplo completo: [`../examples/plano_exemplo.json`](../examples/plano_exemplo.json). Tempos em **segundos no vídeo JÁ CORTADO** (`cut.mp4`). Caminhos de mídia **relativos à `--public-dir`** (a pasta `projeto/`).

```jsonc
{
  "meta": {"fps": 24, "width": 1080, "height": 1920, "duration": 20.0, "bruto": "cliente/cut.mp4", "cliente": "Cliente"},
  "theme": {"bg": "#F4F1EA", "text": "#141414", "accent": "#B8923F", "support": "#1F4D3A"},   // opcional: serif, sans, dark, paper, captionColor
  "scenes": [ {"id": "C001_texto", "type": "center_text", "start": 2.6, "end": 5.6, "props": {...}, "note": "frase falada"} ],
  "captions": [ {"id": "L001_palavra", "start": 0.3, "end": 2.3,
                 "lines": [{"text": "editar", "kind": "small", "at": 0.1}, {"text": "100%", "kind": "sans", "at": 0.5}]} ],
  "words": [{"text": "Muita", "start": 0.0, "end": 0.3}],                  // só para legenda palavra por palavra
  "sfx": [{"at": 2.6, "file": "sfx/click.wav", "volume": 0.3}],
  "music": {"file": "musicas/trilha.mp3", "volume": 0.15},
  "options": {"faceZoom": true, "wordByWord": false}
}
```
`id` = **nome do clipe** exportado (`C001_…`, `L001_…`): mantenha estável, é como o Premiere reconecta ao regerar uma cena.

## `props` por tipo
| `type` | props |
|---|---|
| `broll_text` | `src?` (mp4/jpg), `label?`, `text?` |
| `painting` | `src?`, `caption?` |
| `line_text` | `nodes: [{label, at}]` (2–4; `at` = s relativos ao início da cena) |
| `timeline` | `items: [{year, caption?, src?, at}]` (2–4) |
| `center_text` | `text`, `tone?: "paper"\|"accent"` |
| `center_illustration` | `src?` (PNG recortado ideal), `caption?` |
| `side_illustration` | `src?`, `text`, `side?: "left"\|"right"` |
| `object_highlight` | `src?`, `target?: {x, y, r}` (em % da foto), `label?` |
| `chart` | `title?`, `data: number[]`, `labels?: string[]`, `unit?` |
Legenda cinematográfica: `kind` = `small` (≤ pequeno) · `serif` (emoção) · `sans` (fatos/números); `at` relativo ao início da legenda.
Sem `src`, a cena mostra um **placeholder visível** (nunca quebra o render): confira antes de entregar.

## Ferramentas
```bash
python3 scripts/plan_tools.py snap     plano.json transcricao.json            # inícios → começo de palavra (SFX acompanha)
python3 scripts/plan_tools.py validate plano.json --words transcricao.json --public-dir projeto
python3 scripts/plan_tools.py markdown plano.json --words transcricao.json -o PLANO_DE_EDICAO.md
```
`validate` falha (✘) em: cena <2 s do início, mesmo tipo seguido, sobreposição, fim após o vídeo, legenda >5 palavras, arquivo ausente. Avisa (⚠) sobre: cobertura fora de 50–70%, b-roll fora de 1,5–5 s, início fora de palavra, legenda por cima de cena.
