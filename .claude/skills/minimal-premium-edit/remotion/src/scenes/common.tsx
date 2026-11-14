import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, useCurrentFrame, useVideoConfig} from 'remotion';
import {media} from '../anim';

export const useT = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {t: frame / fps, frame, fps};
};

/** Vinheta + grão (animado de 2 em 2 quadros, determinístico). */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.18}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 12;
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width="100%" height="100%">
        <filter id={`g${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#g${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill
    style={{background: `radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,${strength}) 100%)`, pointerEvents: 'none'}}
  />
);

/** Fundo de papel com grade fina. */
export const PaperGrid: React.FC<{bg: string; line: string; size?: number}> = ({bg, line, size = 54}) => (
  <AbsoluteFill
    style={{
      backgroundColor: bg,
      backgroundImage: `linear-gradient(${line} 1px, transparent 1px), linear-gradient(90deg, ${line} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
    }}
  />
);

/** Foto/vídeo ou, sem arquivo, um bloco de cor neutro (placeholder visível, nunca quebra o render). */
export const MediaOrBlock: React.FC<{
  src?: string;
  style?: React.CSSProperties;
  block?: string;
  video?: boolean;
  label?: string;
}> = ({src, style, block = '#BDB6A6', video, label}) => {
  if (!src) {
    return (
      <div style={{background: block, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(0,0,0,.35)', font: '600 28px Inter, sans-serif', letterSpacing: '.12em', textTransform: 'uppercase', ...style}}>
        {label || 'imagem'}
      </div>
    );
  }
  const isVideo = video ?? /\.(mp4|mov|webm|m4v)$/i.test(src);
  return isVideo ? (
    <OffthreadVideo src={media(src)} muted style={{objectFit: 'cover', ...style}} />
  ) : (
    <Img src={media(src)} style={{objectFit: 'cover', ...style}} />
  );
};
