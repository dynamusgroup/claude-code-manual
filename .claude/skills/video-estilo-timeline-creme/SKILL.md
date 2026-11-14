---
name: video-estilo-timeline-creme
description: Estilo de vídeo vertical "explainer animado creme + terracota com linha do tempo" (referência C4, ~78 s) — 100% motion, sem orador em tela: fundo creme, linha vertical terracota com avatar ilustrado descendo, pills numeradas ("01 Uma pasta"), frase central com palavras-chave em pill terracota que "acendem" conforme a locução, cartões brancos com sombra suave, pastas/ícones 3D, camadas isométricas. Use para tutoriais passo a passo, "como funciona", processos e vídeos de método.
---

# Estilo C4 — Timeline creme (explainer animado)

**Ideia:** a locução conduz uma **linha do tempo vertical**; a cada passo, um cartão ilustrado mostra o conceito. O avatar ilustrado do autor "desce" pela linha. Calmo, limpo, premium.

## Cores medidas no vídeo
| Papel | Hex |
|---|---|
| Fundo creme | `#E8E1D5` (gradiente sutil → `#EFE8E1`) |
| Terracota/coral (linha, pills, destaques) | `#D96D54` |
| Pill suave / realce | `#F6D3C8` · `#FBD4C9` |
| Cartão | `#FBF8F3`, sombra `0 18px 50px rgba(60,40,20,.14)` |
| Texto | `#1B1A18` · palavras ainda não ditas `#A39B90` |

## Anatomia (estrutura repetível a cada 4–8 s)
1. **Linha-guia:** traço vertical terracota 4 px em x≈54, altura total; **avatar circular** (ilustração vetorial em linha preta do rosto, borda 3 px terracota) ancorado na linha, sobe/desce entre passos.
2. **Pill de passo** à direita do avatar: terracota `#D96D54`, texto branco 28 px bold, numerada: `01 · Uma pasta`, `02 · O estúdio`, `03 · Seu gosto`, `04 · A frase`, `05 · Grava e solta`, `06 · O Claude edita`, `07 · O ajuste`.
3. **Frase-título** (topo, centralizada, y≈150): Manrope/Syne 800 ~70 px. **Palavras já ditas** em `#1B1A18`, **palavra-chave** em **pill terracota** (texto branco), **palavras futuras** em cinza `#A39B90`, que escurecem quando a locução chega. Ex.: "Depois, cria uma **pasta**" → "os seus **arquivos**".
4. **Cartão de demonstração** (centro, 860 px): conteúdo muda por passo:
   - *pasta*: 3 ícones de pasta terracota 3D (Vídeos · Imagens · Áudios) dentro de cartão "Claude enxerga" + barra escura com campo "Local · Edição Vídeo Claude ✓";
   - *estúdio*: ícone-estrela central com "?" orbitando (ferramentas); depois lista "Instalar na mão" com linhas e carimbo "Sobe aqui";
   - *seu gosto*: **mural de polaroids** com pinos terracota (3–5 vídeos de referência);
   - *a frase*: cartão de **diff** — linha vermelha riscada "~~cópia~~" e verde "+ se inspira" (`Se inspira neles, não copia.`);
   - *grava e solta*: janela com `REC 00:47`, avatar, pasta "Vídeos brutos";
   - *motion*: **camadas isométricas** empilhadas (rotateX 60° rotateZ −35°) com um traço de trajetória terracota;
   - *o ajuste*: "O TÍTULO" no mock de celular + player de áudio (ponto de gravação + waveform).
5. Marca d'água @handle (ícone + texto) 40 % opaco, canto esquerdo.

## Movimento
- Cartões: `up` 60 px + fade, 0,45 s, curva `out cubic`; elementos internos escalonados 80–120 ms.
- Camadas isométricas: separam-se (translateZ) enquanto a locução cita cada tipo.
- Pill-chave "acende": cor de fundo transparente→terracota em 0,18 s com micro-`scale 1.06`.
- Troca de passo: avatar desliza 0,5 s (`easeInOut`), cartão antigo sai com `wipe` para a esquerda.

## Receita
1. Locução limpa (voz do usuário ou TTS autorizado) → `cut_silence.py` → transcrição palavra-a-palavra.
2. Plano: uma tabela **passo → frase → cartão → tempo**. Máx. 7–8 passos por 60–80 s.
3. Cena HTML **completa** (sem orador) com `window.seek(t)`: tema creme (padrão do `scene-template.html`), `.spine`, `.pill`, `.headline`, `.hl`, `.card`.
4. Para destaque palavra-a-palavra: gere `<span data-in="t_palavra">` para cada palavra da frase (cinza→escuro) e `.hl` na palavra-chave.
5. `render_scene.js cena.html out.mp4 --dur D --audio locucao.wav`.
6. Ilustrações (pastas, polaroids, camadas): SVG inline ou PNGs com transparência; avatar = **ilustração do próprio usuário** (não reutilize o rosto de terceiros).

## Checklist
- [ ] linha + avatar em todos os quadros · [ ] 1 pill numerada por passo · [ ] palavra-chave em pill, futuras em cinza · [ ] cartões com sombra suave, sem bordas pesadas · [ ] terracota é o **único** acento · [ ] nada de texto menor que 24 px.
