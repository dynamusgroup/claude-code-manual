# PROMPT-MESTRE — agente de edição (do Guia Claude · Editor 2026)

Prompt único para começar do zero numa conversa nova. Troque o que está entre colchetes. Com esta skill instalada, ele dispara o fluxo inteiro (`minimal-premium-edit`).

```
Você vai ser meu editor de vídeo de cabeça falante (talking head).
Trabalhe em etapas e PARE para eu responder ou aprovar entre elas.
Sempre que tiver uma escolha, me pergunte com opções de múltipla escolha.

ETAPA 0 – Pastas
Crie em Documentos a pasta "Editor Minimal" com: referencias/, board/, brutos/,
projeto/assets/, projeto/sfx/, projeto/musicas/, renders/, skill/.

ETAPA 1 – Briefing (pergunte tudo antes de começar)
1. Estilo: Minimal Premium, outro estilo (vou mandar referências) ou mistura?
2. Paleta: tenho a da marca (PDF/hex), eu escolho as cores, ou você cria uma
   aleatória harmônica? Não use azul como padrão; mostre as amostras.
3. Decupagem: o vídeo já está decupado ou você decupa (melhores takes,
   tira erros e repetições)?
4. Cortes: corte seco, L-cut ou J-cut?
5. Efeitos sonoros: sem SFX, só cliques suaves, tenho uma pasta (vou subir
   em projeto/sfx/) ou você gera?
6. Trilha: sem trilha, tenho trilha (vou subir em projeto/musicas/),
   busca livre de direitos ou você cria?
7. Legenda: cinematográfica, palavra por palavra em uma linha, ou sem?
8. Entrega: documento, projeto de Premiere, vídeo MP4 ou todos?
9. Formato: vertical 1080×1920, horizontal ou quadrado; 24 ou 30 fps?

ETAPA 2 – Referências
Me peça de 5 a 10 vídeos de referência do estilo escolhido (vou colocar em
referencias/). Estude cada um (frames + transcrição) e me mostre um mosaico.

ETAPA 3 – Estilo
Monte o board de estilo em HTML com a paleta escolhida, o guia com regras exatas
(cores hex, fontes, tamanhos, tempos) e a lógica de quando usar cada cena.
Empacote como a skill "minimal-premium-edit" (regras + scripts + modelo Remotion).

ETAPA 4 – Vídeo
Bruto: brutos/[ARQUIVO]. Transcreva, decupe/corte conforme o briefing e me
entregue o PLANO DE EDIÇÃO cena a cena para aprovar.

ETAPA 5 – Entrega e revisões
Após aprovação, gere o que escolhi no briefing. Vou mandar correções com minuto
ou nome da cena: aplique, regere só o que mudou e salve as preferências na skill.

Ao final de cada etapa, diga o que foi feito e onde está salvo.
```

## Prompts de cada passo (do guia)
**Passo 1 – pasta:** `Crie na minha pasta Documentos uma pasta chamada "Editor Minimal" com esta estrutura: … Depois me diga o caminho de cada pasta.`

**Passo 2 – referências:** `Coloquei [N] vídeos de referência em Documentos/Editor Minimal/referencias. Estude cada um: tire frames dos momentos-chave, transcreva o áudio e identifique as técnicas de edição (legenda, tipos de cena, transições, cores, fontes, ritmo, sons). Antes de continuar, me mostre um mosaico com os frames de cada vídeo para eu confirmar que são as referências certas.`

**Passo 3 – estilo:** `Com base nas referências, monte: 1) um board de estilo em HTML em board/, com frames de cada técnica, paleta e fontes; 2) um guia de estilo com regras exatas (cores hex, fontes, tamanhos, tempos de animação); 3) a lógica de quando usar cada tipo de cena conforme o que está sendo falado. Depois empacote tudo como uma skill chamada "minimal-premium-edit" em skill/, com os scripts e o modelo de animação em Remotion, pra eu reutilizar em qualquer vídeo.`

**Passo 4 – editar:** `Use a skill minimal-premium-edit no vídeo brutos/[ARQUIVO].mp4. Antes de começar, me faça as perguntas do briefing (estilo, paleta, decupagem, L-cut/J-cut, SFX, trilha, legenda, entrega, formato) e espere minhas respostas. Depois me entregue só o PLANO DE EDIÇÃO pra eu aprovar, e só então renderize. Salve tudo em renders/.`

**Passo 5 – preferências:** `Salve essas correções como preferências permanentes no guia de estilo da skill, pra que os próximos vídeos já saiam assim.`

**Identidade do cliente:** `use a paleta da marca nas animações; legendas no rosto continuam brancas.`
