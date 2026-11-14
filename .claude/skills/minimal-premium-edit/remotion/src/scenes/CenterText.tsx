import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Theme} from '../theme';
import {prog, outp} from '../anim';
import {Grain, PaperGrid, useT} from './common';

export type CenterTextProps = {text: string; tone?: 'paper' | 'accent'; dur: number};

/** 6 · Texto central. Fundo papel ou na cor da paleta, texturizado, aspas grandes, a frase-tese no meio. */
export const CenterText: React.FC<CenterTextProps & {theme: Theme}> = ({text, tone = 'paper', dur, theme}) => {
  const {t} = useT();
  const onAccent = tone === 'accent';
  const fg = onAccent ? '#FFFFFF' : theme.text;
  const words = text.split(' ');
  return (
    <AbsoluteFill style={{opacity: outp(t, dur, 0.35)}}>
      {onAccent ? <AbsoluteFill style={{background: theme.accent}} /> : <PaperGrid bg={theme.bg} line="rgba(20,20,20,.05)" size={90} />}
      <Grain opacity={onAccent ? 0.28 : 0.2} />
      <div style={{position: 'absolute', left: 90, top: 520, fontFamily: theme.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 420, lineHeight: 0.8, color: fg, opacity: 0.22 * prog(t, 0, 0.6)}}>“</div>
      <AbsoluteFill style={{justifyContent: 'center', padding: '0 110px'}}>
        <div style={{fontFamily: theme.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 108, lineHeight: 1.12, color: fg, textAlign: 'center'}}>
          {words.map((w, i) => {
            const p = prog(t, 0.2 + i * 0.12, 0.5);
            return <span key={i} style={{display: 'inline-block', marginRight: 22, opacity: p, transform: `translateY(${(1 - p) * 22}px)`}}>{w}</span>;
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
