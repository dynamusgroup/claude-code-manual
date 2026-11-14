import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Theme} from '../theme';
import {prog, outp, rng} from '../anim';
import {Grain, MediaOrBlock, PaperGrid, useT} from './common';

export type ObjectHighlightProps = {src?: string; target?: {x: number; y: number; r: number}; label?: string; dur: number};

/** 9 · Destaque de objeto. Foto tipo polaroid e um círculo de pincel (irregular, nunca elipse perfeita)
 *  em volta do detalhe (rosto, etiqueta, logo). `target` em % da foto. */
export const ObjectHighlight: React.FC<ObjectHighlightProps & {theme: Theme}> = ({src, target = {x: 55, y: 40, r: 20}, label, dur, theme}) => {
  const {t} = useT();
  const pp = prog(t, 0.05, 0.6);
  const draw = prog(t, 0.7, 0.8);
  const W = 760, H = 900; // área da foto
  const cx = (target.x / 100) * W, cy = (target.y / 100) * H, r = (target.r / 100) * W;
  const rnd = rng(11);
  // laço de pincel: ~1,15 volta, raio oscilando, com pequena abertura — traço de mão
  const pts: string[] = [];
  const steps = 46;
  for (let i = 0; i <= steps; i++) {
    const a = -1.2 + (i / steps) * Math.PI * 2 * 1.12;
    const rr = r * (1 + 0.07 * Math.sin(a * 2.3) + (rnd() - 0.5) * 0.06) + i * 0.35;
    pts.push(`${(i === 0 ? 'M' : 'L')} ${(cx + rr * 1.08 * Math.cos(a)).toFixed(1)} ${(cy + rr * 0.92 * Math.sin(a)).toFixed(1)}`);
  }
  return (
    <AbsoluteFill style={{opacity: outp(t, dur, 0.35)}}>
      <PaperGrid bg={theme.bg} line="rgba(20,20,20,.06)" size={90} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: -30}}>
        <div style={{transform: `rotate(-2.2deg) translateY(${(1 - pp) * 70}px)`, opacity: pp, padding: '26px 26px 120px', background: '#FCFBF7', boxShadow: '0 30px 70px rgba(0,0,0,.28)', position: 'relative'}}>
          <MediaOrBlock src={src} label={label || 'foto'} style={{width: W, height: H}} />
          <svg width={W} height={H} style={{position: 'absolute', left: 26, top: 26, overflow: 'visible'}}>
            <path d={pts.join(' ')} fill="none" stroke={theme.accent} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} opacity={0.92} />
          </svg>
          {label && <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, textAlign: 'center', fontFamily: theme.serif, fontStyle: 'italic', fontSize: 52, color: theme.text, opacity: interpolate(t, [0.9, 1.4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>{label}</div>}
        </div>
      </AbsoluteFill>
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
