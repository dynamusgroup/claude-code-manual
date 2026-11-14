import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Theme} from '../theme';
import {prog, outp} from '../anim';
import {Grain, MediaOrBlock, Vignette, useT} from './common';

export type BRollTextProps = {src?: string; label?: string; text?: string; dur: number};

/** 2 · B-roll + texto. Um clipe por ideia (1,5–5 s) mostrando literalmente o que é dito:
 *  levemente dessaturado, vinheta, grão e zoom lento. */
export const BRollText: React.FC<BRollTextProps & {theme: Theme}> = ({src, label, text, dur, theme}) => {
  const {t} = useT();
  const zoom = interpolate(t, [0, dur], [1.0, 1.09]);
  const a = prog(t, 0.25, 0.5) * outp(t, dur, 0.35);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`, filter: 'saturate(0.72) contrast(1.06) brightness(0.96)'}}>
        <MediaOrBlock src={src} label={label || 'b-roll'} block="#6E6A60" style={{width: '100%', height: '100%'}} />
      </AbsoluteFill>
      <Vignette strength={0.6} />
      <Grain opacity={0.2} />
      {text && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 430}}>
          <div style={{opacity: a, transform: `translateY(${(1 - a) * 20}px)`, color: '#fff', fontFamily: theme.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 92, textShadow: '0 4px 30px rgba(0,0,0,.6)', textAlign: 'center', padding: '0 80px'}}>
            {text}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
