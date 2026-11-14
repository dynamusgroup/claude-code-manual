---
name: minimal-premium-edit
description: Agente de edição de vídeos de cabeça falante (talking head) no estilo "Minimal Premium" — aprende o estilo a partir de referências, faz briefing, transcreve, corta silêncios, entrega PLANO DE EDIÇÃO para aprovação e só então renderiza em Remotion (MP4 vertical 1080×1920) e/ou exporta projeto de Premiere (XML com cenas, legendas transparentes e SFX). Use quando o usuário pedir "editar meu vídeo", "montar o editor minimal", "estilo Minimal Premium", "plano de edição", "projeto de Premiere", "legenda palavra por palavra" ou colar o PROMPT-MESTRE do Guia Claude Editor 2026.
---

# Minimal Premium — seu editor dentro do Claude

Implementa o **Guia Claude · Editor 2026 (Minimal Premium)**. Um agente que estuda as edições que o usuário admira, vira **regras de estilo** e as aplica em qualquer vídeo de cabeça falante.

**Fluxo:** Referências → board de estilo → bruto → transcrição + corte → **plano de edição (APROVAÇÃO)** → render / projeto Premiere → revisões em lote → preferências salvas.

## Regras de conduta (do prompt-mestre)
1. **Trabalhe em etapas e PARE** para o usuário responder ou aprovar entre elas.
2. **Sempre que houver escolha, pergunte com múltipla escolha** (use `AskUserQuestion`, até 4 perguntas por vez).
3. **Nunca renderize antes do plano aprovado.** Mudar no papel é a etapa mais barata.
4. Ao fim de cada etapa diga **o que foi feito e onde está salvo**.
5. Revisões chegam em **lote numerado**: aplique tudo, regenere **só o que mudou** (mesmo nome de arquivo) e **salve a preferência** em `references/preferencias.md`.
6. Só use imagens, músicas e vídeos **com licença** ou do próprio cliente. Não baixe música protegida. Instagram/YouTube/alguns bancos bloqueiam download automático: peça para o usuário baixar e colocar na pasta.

## Estrutura de pastas ("Editor Minimal")
Crie com `python3 scripts/init_project.py "<destino>/Editor Minimal" --cliente NOME`:
```
Editor Minimal/
├─ referencias/   5–10 reels que o usuário admira (mesmo estilo/criador)
├─ board/         board_estilo.html + frames de cada técnica
├─ brutos/        vídeo cru  (Cliente_tema_v1.mp4 — nomes legíveis)
├─ projeto/
│  ├─ <cliente>/  transcrição, plano.json, PLANO_DE_EDICAO.md, cut.mp4
│  ├─ assets/     b-rolls, fotos, ilustrações
│  ├─ sfx/  musicas/
├─ renders/       MP4 final + pasta do projeto de Premiere
└─ skill/         aponta para esta skill
```
**Instalação das dependências:** `bash scripts/setup.sh` (ffmpeg, node, Remotion 4.0.543 + fontes, Whisper local, Chrome). Defina `REMOTION_BROWSER` se o Chrome do sistema for usado.

## Etapa 1 — Briefing (pergunte tudo antes de começar)
Veja [references/briefing.md](references/briefing.md): **estilo · paleta · decupagem · L-cut/J-cut · SFX · trilha · legenda · entrega · formato/fps**. Sem paleta? `scripts/palette.py` sorteia uma harmônica (**não azul por padrão**), mostre as amostras e só siga com o "ok". Cliente com marca: `palette.py --brand "#bg,#texto,#destaque,#apoio"`; legendas no rosto continuam brancas.

## Etapa 2 — Referências
Peça 5–10 vídeos em `referencias/`. Rode `scripts/py.sh scripts/learn_references.py referencias board` → frames-chave, **mosaico** (`board/mosaico_referencias.jpg`), cortes/min, plano médio e loudness. **Mostre o mosaico e espere confirmação**: se o agente olhou os vídeos errados, descobre-se em 10 s. Referências boas: sofisticadas (animações, legendas diferentes, b-roll, gráficos), do mesmo criador; evite as que só têm legenda simples.
Além dos frames, **leia a transcrição e olhe os quadros** para registrar: tipos de cena, cores, fontes, ritmo, sons.

## Etapa 3 — Ensinar o estilo
Gere (1) o **board** (`render_stills.mjs` → `make_board.py`), (2) o **guia de estilo** com regras exatas (hex, fontes, tamanhos, tempos) em [references/estilo-minimal-premium.md](references/estilo-minimal-premium.md) e (3) a **lógica de posicionamento** em [references/logica-cenas.md](references/logica-cenas.md). Estilo que não seja o Minimal Premium: aprenda das referências e **escreva novas cenas** em `remotion/src/scenes/` (siga o padrão dos componentes existentes).

## Etapa 4 — Editar um vídeo (bruto em `brutos/`)
| # | Etapa | Como |
|---|---|---|
| 0 | Briefing | Etapa 1 |
| 1 | Transcrição | `scripts/py.sh scripts/transcribe.py <bruto> projeto/<cliente> --vocab "nomes,termos"` — palavra a palavra; confira as **SUSPEITAS** (Whisper erra nomes) |
| 2 | Decupagem e corte | se pedido: escolha melhores takes, tire erros/repetições; `scripts/cut_silence.py` → `cut.mp4`; transcreva o `cut.mp4` de novo (tempos finais) |
| 3 | **Plano de edição** | monte `plano.json` ([references/plano-json.md](references/plano-json.md)) → `plan_tools.py snap` → `validate` → `markdown` → **entregue `PLANO_DE_EDICAO.md` e espere aprovação** |
| 4 | Assets | b-roll/fotos: `stock_search.py` (Pexels/Pixabay) ou arquivos do usuário; ilustrações em tinta e efeito pintura já são geradas pelas cenas |
| 5 | Montagem | cada animação "gruda" no tempo exato da palavra falada (Remotion) |
| 6 | Render / export | `remotion/scripts/render.mjs` (ver abaixo) |

Quando o briefing pedir SFX/trilha "criados": `scripts/gen_sfx.py` (sons simples por código). Trilha com cara profissional: o usuário sobe a dele ou use banco livre de direitos.

### Comandos de render (a partir de `remotion/`)
```bash
export REMOTION_BROWSER=/caminho/chrome REMOTION_CONCURRENCY=4
node scripts/render.mjs edit     --plan P/plano.json --public-dir "Editor Minimal/projeto" --out renders/Cliente_v1.mp4
node scripts/render.mjs scenes   --plan ... --public-dir ... --out-dir renders/premiere_cliente/cenas      # 1 MP4 por cena (V2)
node scripts/render.mjs captions --plan ... --public-dir ... --out-dir renders/premiere_cliente/legendas   # MOV ProRes 4444 transparente (V3)
node scripts/render.mjs words    --plan ... --public-dir ... --out renders/palavra.mov [--chroma]           # uma linha, palavra por palavra (fundo verde com --chroma)
python3 scripts/export_premiere.py plano.json --bruto cut.mp4 --cenas ... --legendas ... --sfx-dir ... -o renders/premiere_cliente/PROJETO_PREMIERE.xml
python3 scripts/package_project.py renders/premiere_cliente/PROJETO_PREMIERE.xml <pasta_para_outro_editor>
```
Use `--scale 0.5` para **prévia rápida** (4× mais veloz). Antes de entregar, **extraia quadros e olhe** (`ffmpeg -ss T -frames:v 1`).

**Projeto de Premiere** (`Arquivo › Importar` o XML): V1 = bruto cortado · V2 = cenas · V3 = legendas (MOV com transparência: dá para mover/escalar/retimar, não editar o texto) · A1 = voz · A2 = SFX. Para trocar uma cena, regere **só aquele clipe com o mesmo nome**.

## Etapa 5 — Revisões que funcionam
Veja [references/revisoes-e-custos.md](references/revisoes-e-custos.md): diga o minuto · diga a cena (nome do clipe) · diga o porquê (vira regra) · **uma lista por vez**.

## Extras que o agente faz
Legenda palavra por palavra (`render.mjs words`, vídeo com fundo verde ou MOV transparente) · comentários na tela (prints → verde, vertical, 7 s, desfoque/zoom, nomes e fotos borrados) · b-roll de banco gratuito (seja específico) · trilhas parecidas e livres de direitos · empacotar para outro editor.

## Fonte horizontal ou de baixa resolução → 9:16
Antes do briefing, rode `ffprobe`: se o bruto for **horizontal** (ex.: 910×512), 9:16 exige recompor. Mostre ao usuário o MESMO quadro em 3 enquadramentos e deixe escolher:
- **A · Recorte no rosto** (padrão do estilo, permite cenas em tela cheia). Janela 9:16 = `altura × 9/16` de largura; centralize no rosto e **confira 4–5 instantes** (cabeça nunca cortada). Ampliar muito amacia a imagem (512p → 1920p = 3,75×): compense com `scale=…:flags=lanczos,unsharp=5:5:0.7:5:5:0.0,noise=alls=7:allf=t`.
- **B · Cartão horizontal em fundo creme** (nítido, 1,19×, rosto pequeno) · **C · cartão com fundo desfocado**.
Receita testada do `cut.mp4` (recorte + 30 fps igual à fonte + áudio a −14 LUFS):
```bash
ffmpeg -ss INI -to FIM -i bruto.mp4 -vf "crop=288:512:X:0,scale=1080:1920:flags=lanczos,unsharp=5:5:0.7:5:5:0.0,noise=alls=7:allf=t,fps=30,format=yuv420p" \
  -af "highpass=f=70,afftdn=nr=8:nf=-45,loudnorm=I=-14:TP=-1.5:LRA=9" -c:v libx264 -crf 14 -c:a aac -b:a 192k cut.mp4
```
Mantenha o **fps da fonte** (30) no `plan.meta.fps` para não gerar trepidação. Áudio de gravação baixa (≈ −25 LUFS) sobe ~11 dB: o `afftdn` segura o chiado.

## Tomadas repetidas (decupagem)
Quando a mesma fala aparece 2×, compare por **palavra** (`transcricao.json`): pausas/travadas (>0,8 s), confiança (`p`) e tom final (pergunta × afirmação). Escolha a mais fluida e **diga o porquê** ao usuário; corte pelo início da fala (−0,15 s) e segure ~0,5 s no fim.

## Ritmo em gancho curto (≈10 s)
Priorize o rosto: 2 cenas de tipos diferentes bastam (cobertura ~50%). Cena de texto central: passe `props.times` (tempo falado de cada palavra, relativo à cena) para as palavras entrarem **no ritmo da fala**. Cena de linha: os nós usam o tempo da palavra e a linha chega em cada nó no mesmo instante; **não comece a cena muito antes do 1º nó** (tela vazia). Sem b-roll/foto do usuário não use cenas com placeholder.

## Limitações (seja transparente com o usuário)
- O XML segue o padrão FCP7/xmeml e foi **validado estruturalmente**; abra no Premiere para confirmar a reconexão de mídia no seu computador.
- A transcrição pode errar palavras raras e nomes: confira o plano antes do render.
- Render: em teste com 4 CPUs, prévia a 540×960 rodou a ~8–10 quadros/s; em 1080×1920 espere perto de 2–3 quadros/s (o guia cita ~1 quadro/s em máquinas mais fracas). Vídeo de 2–3 min: dezenas de minutos.
- A detecção automática de cortes das referências subestima vídeos com muita animação sobreposta; leia os mosaicos.
- Sem GPU não há recorte de pessoa (matting) de qualidade: use PNG já recortado para a Ilustração central/lateral.
