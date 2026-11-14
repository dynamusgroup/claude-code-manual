# Briefing — as perguntas antes de editar
Cada resposta muda o que o agente entrega; responder no começo evita retrabalho (e uso). Faça com `AskUserQuestion` (múltipla escolha), 4 perguntas por rodada, na ordem abaixo.

| Tema | Pergunta | Opções |
|---|---|---|
| Estilo | Quer o Minimal Premium ou outro estilo? | Minimal Premium · outro estilo (manda referências) · mistura |
| Paleta de cores | Quais cores usar nas animações? | Paleta da marca (manda PDF ou hex) · eu escolho 3–4 cores · **cria uma aleatória** harmônica |
| Decupagem | O vídeo já está decupado? | Já decupado (só cortar silêncios) · **decupa pra mim** (escolhe os melhores takes, tira erros e repetições) |
| Tipo de corte | Quer L-cut / J-cut? | Corte seco · L-cut (o áudio continua sobre a próxima imagem) · J-cut (o áudio da próxima cena entra antes) |
| Efeitos sonoros | Quer SFX? Tem pasta de SFX? | Sem SFX · só cliques suaves · tenho pasta (sobe em `projeto/sfx/`) · **gera pra mim** |
| Trilha | Tem trilha? Quer que eu crie ou procure? | Sem trilha (coloco depois) · tenho trilha (`projeto/musicas/`) · busca livre de direitos · **cria uma trilha** |
| Legenda | Que legenda? | Cinematográfica (palavra-chave grande) · uma linha, palavra por palavra · sem legenda |
| Entrega | O que quer receber? | Documento (plano) · projeto de Premiere · vídeo final MP4 · todos |
| Formato | Formato e fps? | Vertical 1080×1920 (padrão) · horizontal · quadrado · 24 ou 30 fps |

**Paleta aleatória:** sorteie uma harmônica (1 fundo, 1 texto, 1 destaque, 1 de apoio) com `scripts/palette.py`, mostre as amostras no board e **só siga depois do "ok"**.
**Trilha e SFX "criados":** o agente gera sons simples por código (`gen_sfx.py`: cliques, ticks, ambiências, beds minimalistas). Para trilha com cara profissional, o melhor é subir a sua ou buscar em banco livre de direitos.
**Mapeamento para o plano:** Decupagem → etapa 2 · L/J-cut → `cut` · SFX → `plan.sfx` · Trilha → `plan.music` · Legenda → `captions` / `options.wordByWord` · Entrega → o que renderizar/exportar · Formato → `meta`.
