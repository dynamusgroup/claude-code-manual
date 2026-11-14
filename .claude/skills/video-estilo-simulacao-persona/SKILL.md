---
name: video-estilo-simulacao-persona
description: Estilo de vídeo vertical "simulação de persona" (referência C1, ~60 s) — o orador aparece em cartão arredondado na metade inferior, com o fundo trocado por cenários de profissões (advogado, médico, educador físico, professor, geógrafo) e props 3D/ilustrações no terço superior sobre fundo claro, selo "Simulação com IA", cartões inclinados no abertura e CTA "Comente GUIA". Use para provar versatilidade de edição, mostrar "o que a IA faz" por nicho ou explicar um conceito com exemplos visuais por profissão.
---

# Estilo C1 — Simulação de persona

**Ideia:** o mesmo orador "vira" várias profissões. A cada frase muda o cenário atrás dele e surgem objetos 3D que ilustram a fala. Prova de poder de edição **e** didática em um só vídeo.

## Anatomia (observada nos quadros do vídeo de referência)
| Tempo | Bloco | O que aparece |
|---|---|---|
| 0–3 s | **Abertura/hook** | Orador em **tela cheia** (fundo escuro com luz roxa/magenta). Rótulo branco arredondado no topo com o título ("Claude Editando ☠"). Fileira de **5 cartões tipo polaroid inclinados** (±4°) com miniaturas das personas e legenda manuscrita embaixo. Pergunta falada: "Muita gente me pergunta…" |
| 3–40 s | **Ciclo de personas** (≈6–8 s cada) | Canvas **creme claro**. Terço superior: props 3D ilustrativos que **entram um a um** com a fala. Dois terços inferiores: orador em **cartão arredondado** com o **cenário trocado** por IA. |
| 40–48 s | **Variante full-bleed** | Cena de lousa verde (`~#22403a`, grade sutil): objeto 3D (canhão + trajetória pontilhada + fórmulas) ocupando a tela; o orador entra em cartão pequeno. |
| 48–55 s | **Volta ao escuro** | Orador em tela cheia + cartão com "Claude **ou** ChatGPT" (pills com ponto coral) e mockup de timeline "Máquina de edição". |
| 55–60 s | **CTA** | Cápsula escura "Comente **GUIA**" + mockup de DM (anexo "Guia"). Fundo desfocado escurecido. |

### Exemplos de props por persona (copie a lógica)
advogado → balança + livro de leis, escritório com abajur verde · médico → estetoscópio + ECG + cartão "Prontuário 12/8 · 72 bpm · 36,5 °C", consultório branco · educador físico → kettlebell/halter + torso muscular com barra "FORÇA", academia · professor de física → canhão + parábola pontilhada + `F = m·a`, `v = Δs/Δt` na lousa · geógrafo → globo em corte com legendas "Crosta 5–70 km / Manto até ~2.900 km".

## Especificação visual
- **Canvas**: 1080×1920. Superior (0–36 %): fundo creme `#EFE9E0` com sombra suave; inferior: cartão do orador **x 72, y ≈ 780, 936×1000, raio 48–56**, sombra `0 18px 50px rgba(0,0,0,.18)`.
- **Selo de transparência** no topo (y≈70): pill cinza-claro `rgba(0,0,0,.06)`, 22 px, ícone ⓘ: **"Simulação com IA · {Nome} não é {profissão}"**. Obrigatório (ver Ética em `video-ia-pipeline`).
- **Legenda**: Manrope 800 ~58 px, branca com contorno `#101010` 6 px (ou pill escura translúcida sobre lousa), centralizada na base do cartão; **1 palavra-chave** em coral `#D96D54`.
- **Marca d'água** do @ do usuário: ícone Instagram + handle, canto esquerdo médio, 28 px, 70 % opaco.
- **Cartões do hook**: 5 × (180×230), rotação alternada −5°/+3°/−2°/+4°/−3°, borda branca 8 px, legenda caligráfica; entram em cascata (60 ms de intervalo, `back-out`).
- **Cápsula CTA**: fundo `#17141B`, borda 1 px `#ffffff22`, texto "Comente" branco + palavra-chave em tom de acento com glow.

## Como construir (receita)
1. Grave/receba o orador; `cut_silence.py`.
2. **Troca de cenário**: segmentação do orador (`rembg`/MediaPipe selfie segmentation, ou Magnific `video_remove_background`) + fundo gerado/estático por profissão. Mantenha a iluminação coerente (aplique leve color match).
3. **Props 3D**: gere imagens PNG com fundo transparente (Magnific `images_generate` + `images_remove_background`, ou Higgsfield) em estilo "3D clay/render macio", mesma paleta; **uma imagem por ideia**.
4. Camada HTML (`scene-template.html`, tema creme, sem spine): props entram com `pop`/`up` a cada ~0,8 s, alinhados ao tempo da palavra correspondente.
5. `compose.py orador.mp4 out.mp4 --bg "#EFE9E0" --card 72,780,936,1000 --radius 52 --layer camada.mov --ass leg.ass`.
6. Revisão: rosto nunca coberto por prop; contraste da legenda; selo presente em **todos** os cenários simulados.

## Checklist
- [ ] Hook nos 2 s com pergunta ou promessa · [ ] 4–6 personas, ≈6 s cada · [ ] 1 prop novo a cada 1–2 s · [ ] selo "Simulação com IA" · [ ] CTA final com palavra-chave de comentário.
