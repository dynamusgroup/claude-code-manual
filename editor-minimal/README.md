# Editor Minimal — pasta-modelo

Estrutura do **Guia Claude · Editor 2026 (Minimal Premium)**. O agente (skill `minimal-premium-edit`) trabalha aqui.

```
editor-minimal/
├─ referencias/   ← 5 a 10 reels que você admira (mesmo estilo/criador). Arquivo local, não link.
├─ board/         ← board_estilo.html + frames (gerado)
├─ brutos/        ← seu vídeo cru: vertical, bem iluminado, áudio limpo, SEM legenda queimada
├─ projeto/       ← <cliente>/ (transcrição, plano, cut.mp4) · assets/ · sfx/ · musicas/
├─ renders/       ← MP4 final + pasta do projeto de Premiere
└─ skill/         ← aponta para .claude/skills/minimal-premium-edit
```

## Começar
1. `bash .claude/skills/minimal-premium-edit/scripts/setup.sh` (instala Remotion, Whisper, checa ffmpeg/Chrome).
2. Coloque as referências em `referencias/` e o bruto em `brutos/`.
3. No Claude Code, cole o **PROMPT-MESTRE**: `.claude/skills/minimal-premium-edit/references/prompt-mestre.md`.
4. O agente pergunta o briefing, estuda as referências, entrega o **plano de edição** e **só renderiza depois do seu "ok"**.

Nomeie tudo de forma legível: `Cliente_tema_v1.mp4`, `JRV_desfile_jeans_pexels123.mp4`.
