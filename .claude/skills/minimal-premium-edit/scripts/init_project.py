#!/usr/bin/env python3
"""ETAPA 0 · Cria a pasta-modelo "Editor Minimal" (estrutura do guia).
Uso: init_project.py "<destino>/Editor Minimal" [--cliente NOME]"""
import argparse, pathlib
p = argparse.ArgumentParser(); p.add_argument('dest'); p.add_argument('--cliente')
a = p.parse_args()
root = pathlib.Path(a.dest)
dirs = ['referencias', 'board', 'brutos', 'projeto/assets', 'projeto/sfx', 'projeto/musicas', 'renders', 'skill']
if a.cliente: dirs.append(f'projeto/{a.cliente}')
notes = {
 'referencias': '5 a 10 reels que você admira (mesmo estilo/criador). Baixe e coloque aqui: arquivo local funciona melhor que link.',
 'board': 'board_estilo.html + frames de cada técnica (gerado pelo agente).',
 'brutos': 'O vídeo cru. Vertical, bem iluminado, áudio limpo, SEM legenda queimada. Nomes legíveis: Cliente_tema_v1.mp4',
 'projeto/assets': 'b-rolls, fotos, ilustrações (ex.: JRV_desfile_jeans_pexels123.mp4)',
 'projeto/sfx': 'efeitos sonoros (opcional)',
 'projeto/musicas': 'trilhas com licença (opcional)',
 'renders': 'MP4 final + pasta do projeto de Premiere',
 'skill': 'O agente empacotado: veja .claude/skills/minimal-premium-edit (regras, scripts e modelo Remotion).',
}
for d in dirs:
    path = root / d; path.mkdir(parents=True, exist_ok=True)
    (path / 'LEIAME.txt').write_text(notes.get(d, 'Arquivos do cliente: transcrição, plano de edição, arquivos de build.') + '\n', encoding='utf-8')
print(f'Pasta criada: {root.resolve()}')
for d in dirs: print('  ', d + '/')
