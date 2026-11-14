#!/usr/bin/env python3
"""Gera sons simples POR CÓDIGO (cliques, ticks, pops suaves, ambiência, cama musical minimalista).
Para trilha com cara profissional: suba a sua em projeto/musicas/ ou use banco livre de direitos.
Uso: gen_sfx.py <pasta_saida> [--which click,tick,pop,tap,air,bed]"""
import argparse, pathlib, wave
import numpy as np
SR = 44100
p = argparse.ArgumentParser(); p.add_argument('out'); p.add_argument('--which', default='click,tick,pop,tap,air,bed')
a = p.parse_args(); out = pathlib.Path(a.out); out.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)

def env(n, atk=0.002, dec=0.06):
    t = np.arange(n) / SR
    return np.minimum(t / atk, 1) * np.exp(-t / dec)

def save(name, x, gain=0.5):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    with wave.open(str(out / f'{name}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype('<i2').tobytes())
    print('ok', name)

def click():  # clique baixinho: ruído filtrado + tom curtíssimo
    n = int(SR * 0.09); t = np.arange(n) / SR
    noise = rng.standard_normal(n); noise = np.convolve(noise, np.ones(6) / 6, mode='same')
    return (noise * env(n, 0.0008, 0.012) * 0.7 + np.sin(2 * np.pi * 1800 * t) * env(n, 0.0005, 0.02) * 0.4)
def tick():
    n = int(SR * 0.05); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 2600 * t) * env(n, 0.0004, 0.008)
def pop():  # pop macio descendente
    n = int(SR * 0.16); t = np.arange(n) / SR
    f = 520 * np.exp(-t * 9) + 140
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.004, 0.05)
def tap():
    n = int(SR * 0.12); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 220 * t) + 0.5 * np.sin(2 * np.pi * 440 * t)) * env(n, 0.001, 0.03)
def air():    # ambiência suave 6 s
    n = SR * 6; x = rng.standard_normal(n)
    for _ in range(3): x = np.convolve(x, np.ones(40) / 40, mode='same')
    t = np.arange(n) / SR
    return x * (0.5 + 0.5 * np.sin(2 * np.pi * 0.15 * t)) * np.minimum(t / 1.5, 1) * np.minimum((6 - t) / 1.5, 1)
def bed():    # cama musical minimalista 12 s: acorde Am9 suave
    n = SR * 12; t = np.arange(n) / SR
    notes = [110.0, 164.81, 220.0, 261.63, 329.63]
    x = sum(np.sin(2 * np.pi * f * t + i) * (0.5 / (i + 1)) for i, f in enumerate(notes))
    x *= (0.75 + 0.25 * np.sin(2 * np.pi * 0.2 * t)) * np.minimum(t / 2, 1) * np.minimum((12 - t) / 3, 1)
    return x
G = {'click': (click, 0.35), 'tick': (tick, 0.3), 'pop': (pop, 0.35), 'tap': (tap, 0.35), 'air': (air, 0.2), 'bed': (bed, 0.25)}
for k in a.which.split(','):
    f, g = G[k.strip()]; save(k.strip(), f(), g)
