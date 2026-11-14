---
name: video-ia-pipeline
description: Cria e edita vídeos verticais 9:16 (Reels/Shorts/TikTok/anúncios) com IA a partir de uma gravação bruta ou de um roteiro, no estilo "Máquina de Edição IA" (edição por comando em português, motion explicativo, legendas com palavra-chave em destaque). Use quando o usuário pedir para editar, legendar, cortar silêncios, criar motion/animação, montar vídeo de anúncio ou "fazer um vídeo igual ao do site/estilos de referência". Orquestra as skills de estilo video-estilo-* e o catálogo video-catalogo-10s.
---

# Pipeline de vídeo com IA (método 4 passos)

Você é o editor de vídeo. O usuário **dirige em português**; você executa. Nunca peça que ele abra um editor.

## Os 4 passos (método do site de referência)
1. **Prepare** — organize a pasta de trabalho (ver abaixo) e leia o briefing.
2. **Peça** — o usuário diz o que quer na tela. Traduza em um *plano de cenas* (tabela: tempo · fala · o que aparece · animação).
3. **Revise** — renderize, extraia quadros (`ffmpeg -ss T -frames:v 1`) e **olhe** (Read na imagem) antes de entregar. Corrija o que estiver errado.
4. **Reutilize** — gere variações (Versão B/C/D: outro hook, outra cor, outro estilo) e guarde o que funcionou em `estilo.md`.

## Pasta-modelo
```
projeto/
├─ gravacoes/   # vídeo bruto (.mov/.mp4)
├─ imagens/     # logos, produtos, fotos
├─ audios/      # trilha, locução, SFX
├─ briefing.md  # público, oferta, tom, CTA (peça ao usuário se faltar; 5 linhas bastam)
├─ estilo.md    # estilo escolhido + ajustes aprendidos
└─ saida/       # renders finais + variações
```

## Escolha do estilo (pergunte só se for ambíguo)
| Pedido / situação | Skill |
|---|---|
| Explicar algo com "simulações" de profissões/cenários, cartões 3D sobre o orador | `video-estilo-simulacao-persona` |
| Tutorial de ferramenta, passo a passo, mockup de interface em fundo escuro, título condensado | `video-estilo-ui-dark-motion` |
| Demonstrar o poder da edição: contador de edições, troca de cenário, zoom, partículas | `video-estilo-cenarios-contador` |
| Explainer 100% animado, sem orador em tela, creme + terracota, linha do tempo | `video-estilo-timeline-creme` |
| Clipes curtos de até 10 s com uma técnica específica (3D, lettering, recorte…) | `video-catalogo-10s` |
| Landing page / slides / peças com o visual do site | `design-system-edicaomia` |

## Especificação técnica (padrão)
- **1080×1920, 30 fps, H.264 yuv420p**, áudio AAC. Clipes de demonstração: **≤ 10 s**, sem áudio.
- **Zonas seguras**: topo 250 px e base 380 px livres (UI do Reels/Shorts). Margens laterais 72 px.
- **Legenda queimada** no terço inferior (y≈66%), 2–3 palavras por bloco, **uma palavra-chave por bloco em destaque** na cor de acento.
- **Ritmo**: mudança visual a cada 1,5–3 s; hook nos 2 primeiros segundos; CTA no final ("Comente GUIA").
- Fale/escreva em **pt-BR**.

## Ferramentas prontas (testadas) — `scripts/`
| Script | Para quê |
|---|---|
| `cut_silence.py in.mp4 out.mp4 [--db -32 --min 0.35 --pad 0.08]` | corta silêncios mantendo A/V sincronizados; gera `out.mp4.map.json` (mapa de tempo original→editado) |
| `make_captions.py palavras.json leg.ass --kw "a,b" [--hl "#D96D54"]` | legenda ASS com pop de entrada e palavras-chave coloridas (`--from-whisper` aceita JSON do Whisper) |
| `render_scene.js cena.html out.mp4 --dur 10 [--alpha]` | renderiza uma cena HTML determinística (`window.seek(t)`) em MP4, ou `.mov` transparente com `--alpha` |
| `compose.py orador.mp4 out.mp4 --bg "#151314" --card x,y,w,h --radius 56 --layer camada.mov --ass leg.ass --glow "#D96D54"` | orador em cartão arredondado + camada HTML + legenda |
| `examples/demo-timeline-creme.html` | cena pronta no estilo C4 (7 s) — `node scripts/render_scene.js examples/demo-timeline-creme.html demo.mp4 --dur 7` |
| `templates/scene-template.html` | ponto de partida: motor de animação (`fade/up/pop/wipe/type/tint`), 3 temas (`theme-dark`, `theme-site`, padrão creme), zonas seguras |

Dependências: `ffmpeg`, `node` + `playwright` (Chromium). Transcrição com palavra-a-palavra: `pip install faster-whisper` (ou `openai-whisper` com `--word_timestamps True`); converta para `[{"w","s","e"}]`. Sem Whisper, peça o roteiro ao usuário e distribua os tempos manualmente, avisando que o alinhamento é aproximado.

## Receita padrão (gravação → vídeo editado)
1. `ffprobe` na gravação. 2. `cut_silence.py`. 3. Transcrever (palavras+tempos) **sobre o vídeo já cortado**. 4. Escrever o plano de cenas. 5. Construir a camada animada (HTML → `--alpha`). 6. `compose.py` com legenda. 7. Extrair 6–8 quadros, **conferir** (texto cortado? legenda sobre o rosto? sombra da UI?). 8. Entregar com `SendUserFile` e propor 2 variações.

## Fidelidade e ética
- Reproduza **linguagem visual e técnica**, não a marca: logos, nome, foto e voz de terceiros ficam de fora. Use a marca/rosto **do usuário**.
- Cenas que simulam profissões ou pessoas devem trazer um selo de transparência (ex.: "Simulação com IA · [Nome] não é advogado"), como nos vídeos de referência.
- Mídia sintética (voz clonada, rosto gerado) só com autorização explícita da pessoa retratada.
- Antes de gastar créditos em geradores externos (Magnific: `video_*`, `audio_*`; Higgsfield), cote (`simulate_cost`) e peça confirmação.

## Armadilhas comuns
- Legenda por cima do rosto ou da UI da rede social → respeite as zonas seguras.
- Texto com acento cortado em fonte condensada → `line-height ≥ 1.08`.
- Animação por CSS em tempo real não é capturável → use sempre `window.seek(t)`.
- Elogiar o resultado sem ter olhado os quadros → sempre extraia e leia pelo menos 4 quadros.
