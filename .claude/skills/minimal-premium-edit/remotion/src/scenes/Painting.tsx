import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {Theme} from '../theme';
import {prog, outp} from '../anim';
import {Grain, MediaOrBlock, Vignette, useT} from './common';

export type PaintingProps = {src?: string; caption?: string; dur: number};

/** 3 · Pintura/foto antiga com efeito de tinta a óleo; a câmera desliza de lado. */
export const Painting: React.FC<PaintingProps & {theme: Theme}> = ({src, caption, dur, theme}) => {
  const {t} = useT();
  const x = interpolate(t, [0, dur], [-4, 4]);
  const a = prog(t, 0.3, 0.5) * outp(t, dur, 0.35);
  return (
    <AbsoluteFill style={{background: '#1a1712'}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id="oil">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.03" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="1.4" result="b" />
          <feColorMatrix in="b" type="matrix" values="1.05 0.1 0 0 0  0.05 0.95 0 0 0  0 0.05 0.8 0 0  0 0 0 1 0" />
        </filter>
      </svg>
      <AbsoluteFill style={{transform: `translateX(${x}%) scale(1.2)`, filter: 'url(#oil) sepia(0.35) contrast(1.08)'}}>
        <MediaOrBlock src={src} label={caption || 'pintura'} block="#8A7A5B" style={{width: '100%', height: '100%'}} />
      </AbsoluteFill>
      <Vignette strength={0.65} />
      <Grain opacity={0.22} />
      {caption && (
        <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 430}}>
          <div style={{opacity: a, color: '#F3EBD8', fontFamily: theme.serif, fontStyle: 'italic', fontSize: 70, textShadow: '0 3px 24px rgba(0,0,0,.7)'}}>{caption}</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
