#!/usr/bin/env python3
"""Monta o layout "orador em cartão arredondado" sobre fundo sólido/imagem, com camada HTML (alpha) e legenda ASS.
Uso: compose.py orador.mp4 saida.mp4 [--bg "#151314"|imagem.jpg] [--card x,y,w,h] [--radius 56]
                [--layer camada.mov] [--ass legenda.ass] [--glow "#D96D54"] [--dur N]
Padrões: tela 1080x1920; cartão 936x1000 em (72,780) — layout dos vídeos C1/C2 (topo livre para a animação).
Use --card 0,0,1080,1920 --radius 0 para orador em tela cheia (layout C3).
"""
import argparse, subprocess, os
p = argparse.ArgumentParser(); p.add_argument('src'); p.add_argument('out')
p.add_argument('--bg', default='#151314'); p.add_argument('--card', default='72,780,936,1000'); p.add_argument('--radius', type=int, default=56)
p.add_argument('--layer'); p.add_argument('--ass'); p.add_argument('--glow'); p.add_argument('--dur', type=float)
a = p.parse_args()
x, y, w, h = [int(v) for v in a.card.split(',')]; r = a.radius
inputs = ['-i', a.src]
if os.path.exists(a.bg): inputs += ['-loop', '1', '-framerate', '30', '-i', a.bg]; bg = '[1:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1[bg]'
else: inputs += ['-f', 'lavfi', '-i', f'color=c={a.bg.replace("#","0x")}:s=1080x1920:r=30']; bg = '[1:v]setsar=1[bg]'
n = 2
if a.layer: inputs += ['-i', a.layer]; layer_idx = n; n += 1
# máscara de cantos arredondados gerada por expressão (sem arquivos extras)
mask = (f"color=c=white:s={w}x{h},format=gray,geq=lum='if(gt(abs(X-{w}/2)-({w}/2-{r}),0)*gt(abs(Y-{h}/2)-({h}/2-{r}),0)*"
        f"gt(hypot(abs(X-{w}/2)-({w}/2-{r}),abs(Y-{h}/2)-({h}/2-{r})),{r}),0,255)'") if r > 0 else f"color=c=white:s={w}x{h},format=gray"
glow_on = bool(a.glow and r > 0)
fc = [bg,
      f"[0:v]scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h},setsar=1,format=yuva420p[sp]",
      f"{mask},split=2[m1][m2]" if glow_on else f"{mask}[m1]", "[sp][m1]alphamerge[card]"]
last = '[bg]'
if glow_on:  # brilho suave atrás do cartão (cor de acento)
    fc += [f"color=c={a.glow.replace('#','0x')}:s={w}x{h},format=yuva420p[g0]", "[g0][m2]alphamerge,gblur=sigma=40[g1]",
           f"{last}[g1]overlay={x}:{y}[bgg]"]; last = '[bgg]'
fc += [f"{last}[card]overlay={x}:{y}:shortest=1[c1]"]; last = '[c1]'
if a.layer: fc += [f"{last}[{layer_idx}:v]overlay=0:0:format=auto[c2]"]; last = '[c2]'
if a.ass: fc += [f"{last}ass={a.ass}[c3]"]; last = '[c3]'
cmd = ['ffmpeg', '-y', '-v', 'error'] + inputs + ['-filter_complex', ';'.join(fc), '-map', last, '-map', '0:a?', '-c:v', 'libx264', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-shortest']
if a.dur: cmd += ['-t', str(a.dur)]
subprocess.check_call(cmd + [a.out]); print('OK:', a.out)
