import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Theme} from '../theme';
import {prog} from '../anim';
import {useT} from './common';

export type Word = {text: string; start: number; end: number};
export type WordByWordProps = {words: Word[]; dur: number; chromaGreen?: boolean};

/** Extra · Legenda em UMA linha, palavra por palavra (abaixo do queixo). `chromaGreen` = fundo verde para recortar no Premiere. */
export const WordByWord: React.FC<WordByWordProps & {theme: Theme}> = ({words, theme, chromaGreen}) => {
  const {t} = useT();
  // grupo atual = palavras entre pausas de ≥0,45 s ou limite de 6 palavras
  const groups: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    const chars = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    if (cur.length && (cur.length >= 6 || chars > 24 || w.start - cur[cur.length - 1].end > 0.45)) {
      groups.push(cur);
      cur = [];
    }
    cur.push(w);
    if (i === words.length - 1) groups.push(cur);
  });
  const g = groups.find((gr) => t >= gr[0].start - 0.05 && t < gr[gr.length - 1].end + 0.25);
  return (
    <AbsoluteFill style={{background: chromaGreen ? '#00B140' : 'transparent', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 520}}>
      {g && (
        <div style={{display: 'flex', gap: 18, flexWrap: 'nowrap', whiteSpace: 'nowrap', fontFamily: theme.sans, fontWeight: 800,
          // cabe sempre na largura segura (≈ 86% da tela): reduz a fonte conforme o nº de caracteres do grupo
          fontSize: Math.min(78, Math.floor(930 / (Math.max(8, g.reduce((n, x) => n + x.text.length + 1, 0)) * 0.6))), color: theme.captionColor, textShadow: '0 3px 22px rgba(0,0,0,.6)'}}>
          {g.map((w, i) => {
            const p = prog(t, w.start, 0.2);
            return (
              <span key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>
                {w.text}
              </span>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
