import {Easing, interpolate, staticFile} from 'remotion';

/** Chegada longa e suave (entradas de 0,45–0,55 s, preferência do guia). */
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IO = Easing.bezier(0.45, 0, 0.55, 1);

const clampOpts = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 a partir do instante `at` (s) durante `dur` (s). */
export const prog = (t: number, at: number, dur = 0.5) =>
  interpolate(t, [at, at + dur], [0, 1], {...clampOpts, easing: OUT});

/** 1→0 terminando em `end` (s). */
export const outp = (t: number, end: number, dur = 0.4) =>
  interpolate(t, [end - dur, end], [1, 0], {...clampOpts, easing: Easing.in(Easing.cubic)});

/** Gerador pseudo-aleatório determinístico (render sempre idêntico). */
export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
};

/** Caminho de mídia: URL/absoluto passam direto; relativo vem da pasta pública (--public-dir). */
export const media = (src: string) => (/^(https?:|data:|\/)/.test(src) ? src : staticFile(src));
