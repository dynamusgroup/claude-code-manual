---
name: design-system-edicaomia
description: Aplica o design e estilo do site de referência (tema roxo escuro editorial, títulos Syne com palavra em destaque, Manrope no corpo, botões com gradiente roxo e brilho, pills/chips, cartões de 24px, FAQ em acordeão) em landing pages, páginas de venda, slides e peças gráficas. Use quando o usuário disser "quero o design/estilo do site", "página igual ao site" ou pedir página de vendas/landing com esse visual.
---

# Design system "roxo editorial" (extraído do CSS real do site)

**Fonte da análise:** HTML e CSS públicos da página (`style.css` + `visual.css` — a segunda sobrescreve a primeira, que era verde-limão). Tokens completos em [`tokens.css`](tokens.css) — **importe esse arquivo em vez de redigitar valores**.

## Identidade
| Item | Valor |
|---|---|
| Fundo | `#0b0716` + aura radial roxa `#3a196151` no canto superior direito |
| Superfície | `#120c22` · bordas `#ffffff20` · raio 24 px (botões 12 px, chips 6 px) |
| Texto | `#f5f0ff` · secundário `#b4a9c6` |
| Acento | `#9759ff` (marca) · `#c7a7ff` (destaques) · `#d3b4ff` (palavra em `<em>`) |
| Botão | gradiente `#9c5af3→#733acd`, brilho `0 6px 35px #8839e933` + luz interna superior; hover sobe 3 px |
| Títulos | **Syne 800**, tracking `-.065em`, `line-height 1.07`; a palavra de destaque em `<em>` (Syne 700, `#d3b4ff`) seguida de um ponto roxo |
| Corpo | **Manrope** 400/600/700, 15–16 px, `line-height 1.7–1.8` |
| Eyebrow | 10 px, caixa-alta, tracking `.15em`, `#b68bea`, precedido de "live-dot" brilhante |
| Marca/ícone | quadrado com gradiente `#eddbff→#9153f1`, cantos `12 12 4 12` |

## Padrões de seção (ordem que funciona)
1. **Hero** em 2 colunas: texto à esquerda (eyebrow → H1 com `<em>` → copy de 455 px → CTA → chips de compatibilidade), demonstração animada à direita com perspectiva 3D (`perspective:1200px`).
2. **Carrossel de estilos** ("até 10 segundos cada"): cartões de vídeo vertical, hover = prévia, clique = palco.
3. **Método em 4 passos** numerados (Prepare · Peça · Revise · Reutilize) com linha superior fina.
4. **Para quem é**: 3 colunas com número `01/02/03`, título curto, parágrafo.
5. **Currículo/FAQ** em `<details>` com "+" que gira 45° ao abrir.
6. **Oferta**: preço riscado → preço grande, lista com ✓, garantia, CTA largo. Repita o CTA em cada bloco.
7. **Rodapé** com razão social e aviso legal.

## Copy (tom do site)
Direto, coloquial, promessa forte e contraste em trio: "Você imagina. Você dirige. A IA edita." Títulos curtos com a 2ª metade em destaque. CTA com seta: "Quero editar com IA ↗". Microtexto de segurança sob o botão ("Garantia de 7 dias").

## Acessibilidade e performance (o site faz, mantenha)
Link "Pular para o conteúdo", `:focus-visible` com contorno, `prefers-reduced-motion` desliga animações, fontes com `font-display:swap`, imagens WebP, CTA com `min-height` ≥ 59 px.

## Como usar
1. `<link>`/`@import` de `tokens.css`. 2. Monte a página seguindo a ordem acima. 3. Responda em pt-BR. 4. Renderize com Playwright (viewport 390 e 1280) e **olhe** os screenshots antes de entregar. 5. Troque nome, marca e preços pelos **do usuário**: não copie logo, textos nem fotos do site de referência.

## Para vídeo no mesmo visual
Use `templates/scene-template.html` do `video-ia-pipeline` com `<body class="theme-site">` (mesmas cores). Vídeo com fundo roxo: aura radial no canto, título Syne 800, botão/pill com o gradiente acima.
