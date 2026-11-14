import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Theme} from '../theme';
import {prog, outp} from '../anim';
import {Grain, useT} from './common';

export type LineTextProps = {nodes: {label: string; at: number}[]; dur: number};

/** 4 · Linha + texto. Uma linha na cor de destaque, com brilho, liga 2–4 conceitos falados
 *  em sequência; a câmera viaja pela linha. */
export const LineText: React.FC<LineTextProps & {theme: Theme}> = ({nodes, dur, theme}) => {
  const {t} = useT();
  const W = 1080, H = 1920;
  const n = Math.max(2, nodes.length);
  const worldW = W * (0.7 + 0.55 * (n - 1)); // mundo mais largo que a tela
  const xs = nodes.map((_, i) => W * 0.5 + (i * (worldW - W)) / Math.max(1, n - 1));
  const ys = nodes.map((_, i) => H * 0.5 + (i % 2 === 0 ? -140 : 140));
  // caminho suave por curvas de Bézier
  let d = `M ${xs[0] - 340} ${ys[0]}`;
  d += ` L ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < n; i++) {
    const mx = (xs[i - 1] + xs[i]) / 2;
    d += ` C ${mx} ${ys[i - 1]}, ${mx} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  d += ` L ${xs[n - 1] + 340} ${ys[n - 1]}`;
  const lastAt = nodes[n - 1]?.at ?? dur * 0.7;
  const draw = interpolate(t, [0.1, Math.max(lastAt + 0.2, 0.8)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // câmera acompanha o nó ativo
  const camX = interpolate(t, nodes.map((nd) => nd.at), xs.map((x) => W / 2 - x), {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const fade = outp(t, dur, 0.4);
  return (
    <AbsoluteFill style={{background: theme.dark, opacity: fade}}>
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="9" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g transform={`translate(${camX} 0)`}>
          <path d={d} fill="none" stroke={theme.accent} strokeWidth={6} strokeLinecap="round" filter="url(#glow)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
          {nodes.map((nd, i) => {
            const p = prog(t, nd.at, 0.5);
            return (
              <g key={i} opacity={p}>
                <circle cx={xs[i]} cy={ys[i]} r={16 + (1 - p) * 14} fill={theme.accent} filter="url(#glow)" />
                <text x={xs[i]} y={ys[i] + (i % 2 === 0 ? -64 : 96)} textAnchor="middle" fill="#F4F1EA" style={{font: `italic 700 86px ${theme.serif}`}}>
                  {nd.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
