import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Theme} from '../theme';
import {prog} from '../anim';
import {useT} from './common';

export type CapLine = {text: string; kind: 'small' | 'serif' | 'sans'; at: number};
export type CinematicCaptionProps = {lines: CapLine[]; dur: number};

/**
 * 1 · Legenda cinematográfica. Frase curta (≤5 palavras): 1–3 palavras-chave grandes
 * (serifada itálica = emoção · sem serifa negrito = fatos e números), o resto pequeno,
 * colado acima e abaixo. Cada parte entra quando é falada; sai com desfoque.
 * Bloco limitado a 30% da altura da tela.
 */
export const CinematicCaption: React.FC<CinematicCaptionProps & {theme: Theme}> = ({lines, dur, theme}) => {
  const {t} = useT();
  const exit = interpolate(t, [dur - 0.35, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const base: React.CSSProperties = {color: theme.captionColor, textAlign: 'center', lineHeight: 1.02, textShadow: '0 4px 28px rgba(0,0,0,.55)'};
  const styleFor = (k: CapLine['kind']): React.CSSProperties =>
    k === 'serif'
      ? {...base, fontFamily: theme.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 168, letterSpacing: '-0.02em'}
      : k === 'sans'
        ? {...base, fontFamily: theme.sans, fontWeight: 800, fontSize: 138, letterSpacing: '-0.03em', textTransform: 'uppercase'}
        : {...base, fontFamily: theme.sans, fontWeight: 600, fontSize: 46, letterSpacing: '0.14em', textTransform: 'uppercase'};
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', top: '50%', height: '30%', gap: 4, filter: `blur(${exit * 14}px)`, opacity: 1 - exit}}>
      {lines.map((l, i) => {
        const p = prog(t, l.at, 0.5);
        return (
          <div key={i} style={{...styleFor(l.kind), opacity: p, transform: `translateY(${(1 - p) * 26}px)`, filter: `blur(${(1 - p) * 10}px)`}}>
            {l.text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
