import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Theme} from '../theme';
import {prog, outp} from '../anim';
import {useT} from './common';

export type ChartProps = {title?: string; data: number[]; labels?: string[]; unit?: string; dur: number};

/** 10 · Gráfico. Fundo escuro, grade fina, bolinha brilhante na cor de destaque percorrendo os dados. */
export const Chart: React.FC<ChartProps & {theme: Theme}> = ({title, data, labels = [], unit = '', dur, theme}) => {
  const {t} = useT();
  const x0 = 120, x1 = 960, y0 = 1230, y1 = 640;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => [x0 + (i * (x1 - x0)) / Math.max(1, data.length - 1), y0 - ((v - min) / Math.max(1e-9, max - min)) * (y0 - y1)]);
  const total = Math.max(1, dur - 1.0);
  const k = interpolate(t, [0.5, 0.5 + total * 0.8], [0, pts.length - 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const i0 = Math.min(pts.length - 2, Math.floor(k)), f = k - i0;
  const dot = [pts[i0][0] + (pts[i0 + 1][0] - pts[i0][0]) * f, pts[i0][1] + (pts[i0 + 1][1] - pts[i0][1]) * f];
  const trail = [...pts.slice(0, i0 + 1), dot].map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  const val = data[i0] + (data[i0 + 1] - data[i0]) * f;
  return (
    <AbsoluteFill style={{background: theme.dark, opacity: outp(t, dur, 0.35)}}>
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="dotglow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="14" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {Array.from({length: 11}).map((_, i) => <line key={`h${i}`} x1={x0} x2={x1} y1={y1 + (i * (y0 - y1)) / 10} y2={y1 + (i * (y0 - y1)) / 10} stroke="rgba(255,255,255,.07)" />)}
        {Array.from({length: Math.max(2, data.length)}).map((_, i) => <line key={`v${i}`} y1={y1} y2={y0} x1={x0 + (i * (x1 - x0)) / Math.max(1, data.length - 1)} x2={x0 + (i * (x1 - x0)) / Math.max(1, data.length - 1)} stroke="rgba(255,255,255,.07)" />)}
        <path d={trail} fill="none" stroke={theme.accent} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={dot[0]} cy={dot[1]} r={15} fill={theme.accent} filter="url(#dotglow)" />
        {labels.map((l, i) => <text key={i} x={pts[i]?.[0]} y={y0 + 56} textAnchor="middle" fill="rgba(255,255,255,.55)" style={{font: `600 30px ${theme.sans}`}}>{l}</text>)}
      </svg>
      {title && <div style={{position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,.6)', font: `600 34px ${theme.sans}`, letterSpacing: '.18em', textTransform: 'uppercase', opacity: prog(t, 0.1)}}>{title}</div>}
      <div style={{position: 'absolute', top: 540, left: 0, right: 0, textAlign: 'center', color: '#F4F1EA', fontFamily: theme.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 118}}>{Math.round(val * 10) / 10}{unit}</div>
    </AbsoluteFill>
  );
};
