import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Theme} from '../theme';
import {prog, outp} from '../anim';
import {Grain, PaperGrid, useT} from './common';
import {InkFigure} from './Ink';

export type CenterIllustrationProps = {src?: string; caption?: string; dur: number};

/** 7 · Ilustração central. Pessoa recortada e transformada em ilustração em tinta (cor de destaque), anéis em volta. */
export const CenterIllustration: React.FC<CenterIllustrationProps & {theme: Theme}> = ({src, caption, dur, theme}) => {
  const {t} = useT();
  const p = prog(t, 0.15, 0.7);
  return (
    <AbsoluteFill style={{opacity: outp(t, dur, 0.35)}}>
      <PaperGrid bg={theme.bg} line="rgba(20,20,20,.05)" size={90} />
      <svg width="1080" height="1920" style={{position: 'absolute', inset: 0}}>
        {[300, 440, 590].map((r, i) => {
          const rp = prog(t, 0.1 + i * 0.18, 0.7);
          return <circle key={i} cx={540} cy={900} r={r * rp} fill="none" stroke={theme.accent} strokeWidth={3 - i * 0.6} opacity={0.75 - i * 0.18} />;
        })}
      </svg>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: -40}}>
        <div style={{opacity: p, transform: `scale(${0.94 + 0.06 * p})`}}>
          <InkFigure src={src} color={theme.accent} id="ink7" />
        </div>
      </AbsoluteFill>
      {caption && <div style={{position: 'absolute', bottom: 430, left: 0, right: 0, textAlign: 'center', fontFamily: theme.serif, fontStyle: 'italic', fontSize: 70, color: theme.text, opacity: prog(t, 0.6, 0.5)}}>{caption}</div>}
      <Grain opacity={0.14} />
    </AbsoluteFill>
  );
};
