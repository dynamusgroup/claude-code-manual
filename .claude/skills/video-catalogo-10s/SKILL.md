---
name: video-catalogo-10s
description: Catálogo de 10 técnicas de edição por IA em clipes verticais de até 10 s (montagem 3D camada por camada, motion explicativo, tutorial 3D, bruto→editado, perspectiva 3D de 5 camadas, recorte de fundo sem tela verde, 3D explicativo em camadas, inserção de imagens no ritmo, ícones animados, lettering) mais 5 skills de acabamento (estilo/cor, ritmo com glitch, legendas, movimento carrossel 3D, composição com moldura brilhante). Use quando o usuário pedir uma técnica específica, "um clipe de 10 segundos" ou uma variação de anúncio.
---

# Catálogo "Do comando para a tela" — clipes de até 10 s

Formato de cada exemplo no site: **vídeo vertical ≤ 10 s, sem áudio, com título de 2 linhas e uma categoria**. Para criar variações de anúncio (Versão B/C/D) mude **hook (primeiros 2 s), cor, título ou técnica**, nunca tudo de uma vez.

| # | Técnica | Título de referência | Como fazer |
|---|---|---|---|
| 1 | **Montagem em 3D** | "Camada por camada" | HTML com `transform-style:preserve-3d`; 4–6 `div` empilhados em `translateZ(0,40,80…px)`, `rotateX(58°) rotateZ(-32°)`; cada camada entra 0,3 s depois da anterior |
| 2 | **Motion explicativo** | "A fala vira interface" | cada frase vira um componente de UI (botão, chat, lista) animado por `seek(t)`; ver `video-estilo-ui-dark-motion` |
| 3 | **Tutorial em 3D** | "Do pedido ao vídeo" | passo a passo em camadas 3D com pills numeradas; ver `video-estilo-timeline-creme` |
| 4 | **Bruto → editado** | "Do bruto ao editado" | *split* em cortina: metade esquerda gravação crua, direita editada; linha de varredura animada (`wipe`) |
| 5 | **Perspectiva 3D** | "5 camadas em 3D" | 5 planos (fundo, orador recortado, 2 elementos, texto) com `perspective:1200px` e *parallax* (cada camada move X em ritmos diferentes) |
| 6 | **Recorte de fundo** | "Sem tela verde" | `rembg`/MediaPipe por frame ou Magnific `video_remove_background`; suavizar máscara; fundo novo |
| 7 | **3D explicativo** | "Sala em camadas 3D" | ambiente em camadas (piso, paredes, objetos) com câmera orbitando 15° |
| 8 | **Inserção de imagens** | "Imagens no ritmo certo" | B-roll/imagens entram **no tempo da palavra** (±80 ms) por 0,8–1,4 s, `pop` + leve zoom; fonte de imagem: pasta `imagens/` ou geradas |
| 9 | **Ícones animados** | "Ícones que seguem a fala" | 1 ícone SVG por substantivo-chave, entra com `pop`, some com `fade`; tamanho 160–220 px, mesma família visual |
| 10 | **Lettering** | "A palavra vira a cena" | a palavra-chave ocupa a tela em tipografia gigante, depois se transforma em objeto/cena (clip-path + máscara) |

## Acabamento (as 5 "skills" mostradas no site: Estilo · Ritmo · Legendas · Movimento · Composição)
| Skill | Descrição no site | Receita |
|---|---|---|
| **Estilo** | cor tratada, clima roxo | `eq=contrast=1.08:saturation=1.1,colorbalance=bs=.08:bm=.05:rh=.04,vignette=PI/5`; paleta `#c7a7ff / #9759ff / #0b0716` |
| **Ritmo** | glitch no tempo da fala | `rgbashift=rh=8:bh=-8,noise=alls=18:allf=t` só em `enable='between(t,A,A+0.12)'`, A = início de cada frase |
| **Legendas** | palavra-chave em destaque | `make_captions.py --kw` |
| **Movimento** | carrossel 3D dos meus vídeos | 5–7 cartões 9:16 em círculo (`rotateY(i*360/n) translateZ(420px)`), a cena gira 360° em 8 s |
| **Composição** | moldura com brilho | cartão arredondado + `compose.py --glow "#9759ff"` |

## Regras de ouro dos clipes de 10 s
1. Uma ideia por clipe. 2. Hook visual em ≤ 1 s. 3. Texto ≤ 6 palavras na tela. 4. Final "limpo" nos últimos 2 s (espaço para preço/botão). 5. Renderize em `--dur 10 --fps 30` e confira o quadro 0, 3, 6 e 9,5.
