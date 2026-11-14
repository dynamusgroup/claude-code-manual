---
name: video-estilo-ui-dark-motion
description: Estilo de vídeo vertical "tutorial em UI escura" (referência C2, ~63 s) — fundo quase preto, título condensado em caixa-alta com a segunda palavra em coral, kicker em caixa-alta espaçada, mockups animados de interface (chat, conectores, lista de arquivos, trilhas de áudio) no topo e o orador em cartão arredondado com brilho na parte inferior. Use para tutoriais de ferramentas, passo a passo ("PASSO 1"), demonstração de integrações e vídeos de venda de curso/produto digital.
---

# Estilo C2 — UI escura + título condensado

**Ideia:** cada frase do orador ganha um "painel de prova" no topo: a interface real (recriada) que mostra o que ele está dizendo. Fundo escuro mantém o foco; coral guia o olho.

## Anatomia (do vídeo de referência)
- **Hook (0–6 s):** diagrama animado — ícone central coral (asterisco/estrela de 8 pontas) dentro de um quadrado arredondado, ligado por linhas curvas a duas "versões" (A/B) do criativo e a uma trilha de áudio → "tudo na mesma conversa".
- **Corpo (6–55 s):** blocos de **3–6 s**. Cada bloco = *kicker* + **título condensado** + **painel de UI** que se anima (digitando, clicando, rolando) + fala legendada embaixo do painel.
- **Sequências típicas:** "O MEU CURSO" (mock do produto) → "PEDE ANÚNCIO NOVO" (lista de gravações `gravacao_05.mov` com data) → "CLAUDE + ELEVENLABS" (tela de conectores com "Desvincular", permissões) → "PASSO 1" (Meus · Descobrir · "+ Adicionar") → "ZERO BRIEFING" → "LENDO A PÁGINA" (chat lendo uma URL, linha "Lendo uma página" com spinner) → "4 TRILHAS" (4 players de áudio, o 2º tocando) → "MÚSICA LIBERADA PRA USO COMERCIAL" → "COMENTE LABS" + DM.
- **Fechamento:** repete o diagrama do hook (loop) + CTA de comentário.

## Especificação visual
| Elemento | Valor |
|---|---|
| Fundo | `#0E0C10` → `#151314` com leve vinheta; opcional aura coral 10 % no canto |
| **Kicker** | Manrope 700, **30 px**, caixa-alta, tracking `.22em`, `#8E8795`, centralizado, y≈90 |
| **Título** | fonte condensada bold (**Oswald 700 / Anton / Bebas Neue**), **~118 px**, caixa-alta, `line-height 1.05`; 1ª parte `#F4EFE9`, **2ª palavra `#DE6A4C`** (coral). Máx. 2–3 palavras. |
| **Painel de UI** | cartão `#17141B`, raio 28, borda 1 px `#ffffff1f`, sombra profunda; interior com tipografia da ferramenta real recriada (não use capturas com dados pessoais) |
| **Borda de destaque** | contorno coral 2 px com glow `0 0 30px #D96D5455` no elemento "ativo" |
| **Orador** | cartão `x72, y≈780, 936×1000`, raio 56, `--glow "#D96D54"` |
| **Legenda** | Manrope 800 ~56 px branca, contorno escuro; palavra-chave em coral; logo abaixo do painel, sobre o topo do cartão |
| Marca d'água | ícone Instagram + @handle, canto esquerdo, 26 px, 60 % |

## Movimento
- Título: entra com `up` + leve blur→nítido (0,35 s); sai com fade antes do próximo bloco.
- UI: *typewriter* para texto de chat (~28 cps), cursor piscando; clique = anel que expande + `scale .96`; lista = itens entram com 80 ms de atraso.
- Transição entre blocos: corte seco no tempo da frase (sem fade longo) + "whoosh" curto (SFX −18 dB).

## Receita
1. `cut_silence.py` → transcrever → dividir a fala em blocos de ideia (plano de cenas com **título + painel** por bloco).
2. Para cada bloco, uma `<section>` na cena HTML (`theme-dark`), cada uma com `data-in/data-out`; **uma** cena longa com `window.seek(t)` cobre o vídeo inteiro.
3. `render_scene.js cena.html camada.mov --dur D --alpha`.
4. `compose.py orador.mp4 out.mp4 --bg "#151314" --layer camada.mov --ass leg.ass --glow "#D96D54"`.
5. Música: trilha instrumental −22 dB sob a voz (`amix`/`sidechaincompress`), liberada para uso comercial.

## Receita TESTADA com orador falando (Lane01, 910×512 → 9:16)
Exemplo completo: [`examples/lane01_c2.html`](examples/lane01_c2.html) (kicker + título + 4 painéis + legenda, tudo dirigido pelos tempos das palavras em `WORDS`/`KICK`/`TITLE`/`PAN`).
1. **Fontes locais** (Chromium só carrega a tela se a fonte existir): `npm i @fontsource/oswald @fontsource/manrope` e copie `oswald-latin-700-normal.woff2` e `manrope-latin-{700,800}-normal.woff2` para `fonts/` ao lado do HTML. Oswald 700 = título condensado.
2. **Cartão do orador** 936×1000 já no tamanho final (evita reescala ruim). De fonte horizontal 512p: janela de **420×449** centrada no rosto → ampliação ≈2,2× (bem mais nítida que 9:16 em tela cheia, 3,75×). `crop=420:449:X:0,scale=936:1000:flags=lanczos,unsharp=5:5:0.6:5:5:0.0,noise=alls=6:allf=t,fps=30`; copie o áudio já normalizado (−14 LUFS).
3. **Fundo** com aura coral: PNG 1080×1920 (`#151314` + elipse `#DE6A4C` a ~18% desfocada no canto superior direito) via `compose.py --bg bg.png`.
4. **Camada** `node ../video-ia-pipeline/scripts/render_scene.js cena.html camada.mov --dur D --fps 30 --alpha` (ProRes 4444, ~150 MB/11 s).
5. `compose.py card.mp4 out.mp4 --bg bg.png --card 72,780,936,1000 --radius 56 --layer camada.mov --glow "#DE6A4C"`.
6. **SFX** discretos (`pop.wav`, volume 0,22) nas trocas de painel: `adelay` + `amix=normalize=0` + `alimiter=limit=0.89:level=0` — **`level=0` é obrigatório**: o auto-level padrão do `alimiter` reamplifica o áudio (subiu de −13,8 para −12,8 LUFS).
**Armadilhas vistas na prática:** (a) palavra-chave coral ilegível sobre pele/blusa/fundo rosa → **pílula escura translúcida** atrás da legenda; (b) `-loop 1` de imagem de fundo vira 25 fps → `compose.py` agora força `-framerate 30`; (c) título de 3 palavras estoura 936 px → `fitTitle()` reduz a fonte até caber; (d) painel só com texto repetindo a fala é fraco: dê a cada ideia um **objeto de UI** (chat digitando as palavras faladas, "?" pulsando, quarto à noite, post com curtidas subindo).

## Checklist
- [ ] 1 título + 1 painel por ideia · [ ] máx. 3 palavras no título · [ ] coral só em 1 palavra por tela · [ ] nenhum dado real/sensível nos mockups · [ ] "PASSO N" numerado quando for tutorial · [ ] CTA final.
