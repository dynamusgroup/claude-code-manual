#!/usr/bin/env python3
"""ETAPA 4.1 · Transcrição palavra a palavra com o tempo de cada palavra (Whisper local).
Uso: py.sh transcribe.py video.mp4 saida_dir [--model small|medium|large-v3] [--lang pt]
Saídas: transcricao.json (words/segments), transcricao.txt, legenda.srt e SUSPEITAS (palavras de baixa confiança
para você conferir — Whisper erra nomes e palavras raras)."""
import argparse, json, subprocess, pathlib
import numpy as np
from faster_whisper import WhisperModel

p = argparse.ArgumentParser(); p.add_argument('video'); p.add_argument('out')
p.add_argument('--model', default='small'); p.add_argument('--lang', default='pt')
p.add_argument('--vocab', default='', help='nomes/termos raros separados por vírgula (ajuda o modelo)')
a = p.parse_args()
out = pathlib.Path(a.out); out.mkdir(parents=True, exist_ok=True)
raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', a.video, '-vn', '-ac', '1', '-ar', '16000', '-f', 'f32le', '-'])
audio = np.frombuffer(raw, dtype=np.float32)
model = WhisperModel(a.model, device='cpu', compute_type='int8')
segs, info = model.transcribe(audio, language=a.lang, word_timestamps=True, beam_size=5,
                              initial_prompt=(a.vocab or None), condition_on_previous_text=False)
words, segments = [], []
for s in segs:
    segments.append({'s': round(s.start, 2), 'e': round(s.end, 2), 't': s.text.strip()})
    for w in s.words:
        words.append({'w': w.word.strip(), 's': round(w.start, 3), 'e': round(w.end, 3), 'p': round(w.probability, 2)})
dur = len(audio) / 16000
(out / 'transcricao.json').write_text(json.dumps({'language': info.language, 'duration': round(dur, 2), 'words': words, 'segments': segments}, ensure_ascii=False, indent=1), encoding='utf-8')
(out / 'transcricao.txt').write_text('\n'.join(f"[{s['s']:6.2f}-{s['e']:6.2f}] {s['t']}" for s in segments) + '\n', encoding='utf-8')
def ts(t):
    return f"{int(t//3600):02d}:{int(t%3600//60):02d}:{int(t%60):02d},{int(round((t%1)*1000)):03d}"
with open(out / 'legenda.srt', 'w', encoding='utf-8') as f:
    for i, s in enumerate(segments, 1): f.write(f"{i}\n{ts(s['s'])} --> {ts(s['e'])}\n{s['t']}\n\n")
sus = [w for w in words if w['p'] < 0.5]
print(f"OK: {len(words)} palavras, {dur:.1f}s, idioma={info.language}")
if sus: print('SUSPEITAS (confira antes do render):', ', '.join(f"{w['w']}@{w['s']}s({w['p']})" for w in sus[:25]))
