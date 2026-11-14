# Guia de estilo — Minimal Premium
Visual dos reels do Dr. Arthur Brooks (referência do guia): **muito espaço em branco, tipografia de revista, uma única cor de destaque e movimento suave.** A cor de destaque **não é obrigatória** (no original é azul): o agente pergunta a paleta antes de começar.

## Os 10 princípios → componente Remotion (`remotion/src/scenes/`)
| # | Princípio | Como funciona | Tipo no plano |
|---|---|---|---|
| 1 | **Legenda cinematográfica** | Frase curta (≤5 palavras). 1–3 palavras-chave grandes (**serifada itálica = emoção; sem serifa negrito = fatos e números**); o resto pequeno, colado acima e abaixo. Cada parte aparece quando é falada, com desfoque saindo. | `captions[]` (`CinematicCaption`) |
| 2 | **B-roll + texto** | Um clipe por ideia, literal ao que é dito, 1,5–5 s; levemente dessaturado, vinheta, grão, zoom lento. | `broll_text` |
| 3 | **Pintura** | Pintura/foto antiga com efeito de tinta a óleo; câmera desliza de lado. | `painting` |
| 4 | **Linha + texto** | Linha na cor de destaque, com brilho, liga 2–4 conceitos falados em sequência; câmera viaja pela linha. | `line_text` |
| 5 | **Linha do tempo** | Fundo papel com grade, polaroids subindo sobre a linha, anos embaixo. Datas e fases. | `timeline` |
| 6 | **Texto central** | Fundo papel ou na cor da paleta, texturizado, aspas grandes, frase-tese no meio. | `center_text` |
| 7 | **Ilustração central** | Pessoa recortada → ilustração em tinta (cor de destaque), anéis em volta. | `center_illustration` |
| 8 | **Ilustração lateral** | Ilustração de um lado, texto do outro. Contraste. | `side_illustration` |
| 9 | **Destaque de objeto** | Foto tipo polaroid + círculo de pincel em volta do detalhe (rosto, etiqueta, logo). | `object_highlight` |
| 10 | **Gráfico** | Fundo escuro, grade fina, bolinha brilhante na cor de destaque percorrendo os dados. | `chart` |

## Ritmo da edição
- **Primeiros 2–3 s: rosto e legenda** (conexão). Depois do gancho, a primeira cena.
- Cenas cobrem **~55–65%** do vídeo, **nunca o mesmo tipo duas vezes seguidas**.
- **Toda volta ao rosto tem leve zoom** (cara de multicâmera) — o `Edit` alterna 1.00 ↔ 1.06.
- **Cortes sempre no início de uma palavra** (`plan_tools.py snap`).

## Números exatos (padrões do modelo; ajuste no plano/tema)
| Item | Valor |
|---|---|
| Tela / fps | 1080×1920 · **24 fps** (30 opcional) |
| Entradas | **0,45–0,55 s**, curva `cubic-bezier(.16,1,.3,1)` (chegada longa e suave) |
| Legenda | bloco **≤ 30% da altura**; pequeno 46 px Inter 600 caixa-alta tracking .14em · serifa 168 px Playfair Display 700 itálico · sem serifa 138 px Inter 800 caixa-alta · **branca** no rosto, sombra suave |
| Saída da legenda | desfoque 14 px + fade em 0,35 s |
| B-roll | `saturate .72`, `contrast 1.06`, vinheta .6, grão .2, zoom 1.00→1.09 |
| Linha/gráfico | fundo `#0F0F0F`, brilho (blur 9–14 px) na cor de destaque |
| Papel | `theme.bg` + grade fina `rgba(20,20,20,.05–.07)` 54–90 px |
| Paleta-exemplo | fundo creme `#F4F1EA` · texto `#141414` · destaque dourado champagne `#B8923F` · apoio verde `#1F4D3A` (carvão/dourado/creme) |
| Loudness | **−14 LUFS** (medido nas 4 referências do usuário): `ffmpeg -i in -af loudnorm=I=-14:TP=-1.5:LRA=11 out` |

## Preferências aprendidas (viram regra — ver `preferencias.md`)
24 fps e animações mais suaves (0,45–0,55 s) · legenda com espaçamento curto, linha pequena colada na palavra grande, **nada acima de 30% da altura** · **sem trilha e sem som de transição** (whoosh, impacto), só "cliques" baixinhos quando um elemento aparece · círculo de destaque como **pincelada irregular, nunca elipse perfeita** · **nenhum "frame vazando"** entre cenas; o b-roll entra no começo da frase · frase-tese pode ficar **no rosto** (aspas + legenda especial) em vez de tela cheia.

## Identidade do cliente
Com paleta própria: "use a paleta da marca nas animações; legendas no rosto continuam brancas" → salve como **tema** (`plan.theme`; ex.: carvão, dourado champagne, creme).
