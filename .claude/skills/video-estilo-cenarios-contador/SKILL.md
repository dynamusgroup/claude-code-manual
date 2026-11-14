---
name: video-estilo-cenarios-contador
description: Estilo de vídeo vertical "o vídeo que se edita sozinho" (referência C3, ~59 s) — orador em tela cheia, pill branca no topo com contador "Claude • editando 03/12", comandos falados que disparam edições ao vivo (zoom/punch-in, objeto em close, partículas de neve, troca de fundo para praia/espaço, volta ao estúdio) e abertura com título gigante condensado "eu NÃO EDITEI esse VÍDEO". Use para demonstrações de edição por IA, provas de conceito e vídeos de impacto/prova.
---

# Estilo C3 — Contador de edições + troca de cenário

**Ideia:** o orador *comanda* a IA em voz alta e o vídeo muda na hora. O contador no topo prova que cada mudança foi um comando. Humor + prova.

## Anatomia
1. **Abertura (0–3 s):** orador em tela cheia, **título gigante** empilhado à esquerda: "eu" (pequeno) / **NÃO** (coral `#D96D54`, ~330 px) / **EDITEI** (branco, ~330 px) / "esse" / **VÍDEO**. Fonte condensada extra-bold (Anton/Oswald). Entra com `up` e some rápido.
2. **Contador:** pill branca `#FFFFFF`, raio total, topo (y≈90): ícone coral + **"Claude"** (bold) + "• editando" (cinza) + **`NN/12`** em coral. Incrementa a cada edição (00→12). Sombra suave.
3. **Comandos:** sub-pill abaixo do contador ("comando 03 · **volta ao normal**", "comando 09 · volta pro **estúdio**"), 22 px, entra com `pop`.
4. **Edições mostradas** (uma por comando, 3–5 s cada):
   - punch-in / zoom no rosto (crop animado 100→125 %), corte para plano fechado;
   - **objeto em close** (ex.: mão com relógio vindo para a câmera) — recorte do braço sobre o orador;
   - **partículas** (neve) + fundo noturno/estrelado;
   - **troca de fundo** por cenário (praia ao pôr do sol com palmeira) — recorte do orador sem tela verde;
   - correção de cor / "volta ao normal" (reset do grade);
5. **Fecho (55–59 s):** lockup da marca (logo do **usuário**) sobre o orador escurecido + mockup de DM "Guia" (CTA "Comente GUIA").

## Especificação visual
- Orador **tela cheia** (`compose.py --card 0,0,1080,1920 --radius 0`), look **cinematográfico**: luz de contorno roxa/magenta (grade: sombras `#1A0F2E`, realce quente na pele), leve vinheta.
- **Legenda** pequena e discreta (Manrope 800 ~50 px, branca, contorno escuro), terço inferior, 1 palavra em coral; **nunca** sobre a boca.
- Cores: coral `#D96D54`, branco `#FFFFFF`, fundo escuro `#0B0A0E`.

## Receitas das edições (ffmpeg/HTML)
| Edição | Como |
|---|---|
| Punch-in (testado) | `scale=w='trunc(iw*(1+0.25*min(t/0.4,1))/2)*2':h='trunc(ih*(1+0.25*min(t/0.4,1))/2)*2':eval=frame,crop=1080:1920:(iw-1080)/2:(ih-1920)/2*0.7` — zoom 100→125 % em 0,4 s. **Não use** `crop` com `t` em `w/h`: essas expressões são avaliadas uma única vez e o zoom fica parado. Para aplicar só num trecho, corte o trecho (`trim`), aplique e reconcatene. |
| Partículas | camada HTML `--alpha` com 120 círculos brancos (blur 2 px) caindo, velocidades e tamanhos aleatórios **com seed fixo** |
| Troca de fundo | segmentar orador (`rembg` por frame, ou Magnific `video_remove_background`) → compor sobre imagem/vídeo de fundo; suavizar borda (`gblur` 1 px na máscara) |
| Glitch (testado) | `rgbashift=rh=8:bh=-8:enable='between(t,A,A+0.12)',noise=alls=18:allf=t:enable='between(t,A,A+0.12)'` |
| Grade roxo (testado) | `eq=contrast=1.08:saturation=1.1,colorbalance=bs=.08:bm=.05:rh=.04` + vinheta `vignette=PI/5` |
| Contador | camada HTML com `data-in` por comando; número = `String(n).padStart(2,'0') + '/12'` |

## Checklist
- [ ] Contador sincronizado com cada edição (nunca adianta) · [ ] volta ao normal no fim · [ ] 8–12 edições · [ ] recorte sem "halo" na borda · [ ] fala = comando (o texto falado é o que muda a tela) · [ ] CTA final.
