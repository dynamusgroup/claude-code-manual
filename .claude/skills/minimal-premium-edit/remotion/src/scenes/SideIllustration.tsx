import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Theme} from '../theme';
import {prog, outp} from '../anim';
import {Grain, PaperGrid, useT} from './common';
import {InkFigure} from './Ink';

export type SideIllustrationProps = {src?: string; text: string; side?: 'left' | 'right'; dur: number};

/** 8 · Ilustração lateral. Ilustração de um lado, texto do outro (contraste). */
export const SideIllustration: React.FC<SideIllustrationProps & {theme: Theme}> = ({src, text, side = 'left', dur, theme}) => {
  const {t} = useT();
  const pi = prog(t, 0.1, 0.65);
  const pt = prog(t, 0.45, 0.6);
  const left = side === 'left';
  return (
    <AbsoluteFill style={{opacity: outp(t, dur, 0.35)}}>
      <PaperGrid bg={theme.bg} line="rgba(20,20,20,.05)" size={90} />
      <div style={{position: 'absolute', top: 470, [left ? 'left' : 'right']: -120, opacity: pi, transform: `translateX(${(left ? -1 : 1) * (1 - pi) * 90}px)`}}>
        <InkFigure src={src} color={theme.accent} id="ink8" size={640} />
      </div>
      <div style={{position: 'absolute', top: 760, [left ? 'right' : 'left']: 80, width: 440, opacity: pt, transform: `translateY(${(1 - pt) * 24}px)`, textAlign: left ? 'left' : 'right'}}>
        <div style={{width: 70, height: 5, background: theme.accent, marginBottom: 26, marginLeft: left ? 0 : 'auto'}} />
        <div style={{fontFamily: theme.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 76, lineHeight: 1.1, color: theme.text}}>{text}</div>
      </div>
      <Grain opacity={0.14} />
    </AbsoluteFill>
  );
};
