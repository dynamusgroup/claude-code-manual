import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Theme} from '../theme';
import {prog, outp} from '../anim';
import {Grain, MediaOrBlock, PaperGrid, useT} from './common';

export type TimelineItem = {year: string; caption?: string; src?: string; at: number};
export type TimelinePaperProps = {items: TimelineItem[]; dur: number};

/** 5 · Linha do tempo. Fundo papel com grade, fotos estilo polaroid subindo sobre a linha, anos embaixo. */
export const TimelinePaper: React.FC<TimelinePaperProps & {theme: Theme}> = ({items, dur, theme}) => {
  const {t} = useT();
  const n = items.length;
  const lineY = 1010;
  const lineP = prog(t, 0.05, 0.8);
  return (
    <AbsoluteFill style={{opacity: outp(t, dur, 0.35)}}>
      <PaperGrid bg={theme.bg} line="rgba(20,20,20,.07)" />
      <div style={{position: 'absolute', left: 60, top: lineY, height: 6, width: 960 * lineP, background: theme.text}} />
      {items.map((it, i) => {
        const cx = n === 1 ? 540 : 190 + (i * (1080 - 380)) / (n - 1);
        const p = prog(t, it.at, 0.55);
        const rot = (i % 2 ? 1 : -1) * 3.5;
        return (
          <React.Fragment key={i}>
            <div style={{position: 'absolute', left: cx - 160, top: lineY - 470 + (1 - p) * 220, width: 320, padding: '16px 16px 62px', background: '#FBFAF6', boxShadow: '0 22px 50px rgba(0,0,0,.22)', transform: `rotate(${rot}deg)`, opacity: p}}>
              <MediaOrBlock src={it.src} label={it.caption || 'foto'} style={{width: 288, height: 340}} />
              {it.caption && <div style={{position: 'absolute', left: 0, right: 0, bottom: 16, textAlign: 'center', fontFamily: theme.serif, fontStyle: 'italic', fontSize: 28, color: theme.text}}>{it.caption}</div>}
            </div>
            <div style={{position: 'absolute', left: cx - 10, top: lineY - 7, width: 20, height: 20, borderRadius: 20, background: theme.accent, opacity: p}} />
            <div style={{position: 'absolute', left: cx - 150, width: 300, top: lineY + 46, textAlign: 'center', fontFamily: theme.sans, fontWeight: 800, fontSize: 74, color: theme.text, opacity: p}}>{it.year}</div>
          </React.Fragment>
        );
      })}
      <Grain opacity={0.12} />
    </AbsoluteFill>
  );
};
