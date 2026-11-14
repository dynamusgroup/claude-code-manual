import React from 'react';
import {MediaOrBlock} from './common';

/**
 * Filtro "tinta": luminância → limiar duro (escuro = tinta) → cor de destaque,
 * respeitando o alfa original (PNG recortado) e com borda levemente irregular.
 */
export const InkDefs: React.FC<{id: string; color: string}> = ({id, color}) => (
  <svg width="0" height="0" style={{position: 'absolute'}}>
    <filter id={id} colorInterpolationFilters="sRGB" x="-5%" y="-5%" width="110%" height="110%">
      {/* 1. cinza */}
      <feColorMatrix in="SourceGraphic" type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0" result="gray" />
      {/* 2. escuro (<0,5) vira 1, claro vira 0 */}
      <feComponentTransfer in="gray" result="thr">
        <feFuncR type="discrete" tableValues="1 0" />
      </feComponentTransfer>
      {/* 3. alfa = canal R do limiar */}
      <feColorMatrix in="thr" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" result="inkAlpha" />
      {/* 4. cor sólida dentro da tinta */}
      <feFlood floodColor={color} result="c" />
      <feComposite in="c" in2="inkAlpha" operator="in" result="inked" />
      {/* 5. mantém o recorte do PNG (alfa original) */}
      <feComposite in="inked" in2="SourceAlpha" operator="in" result="cut" />
      {/* 6. borda de pincel irregular */}
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="t" />
      <feDisplacementMap in="cut" in2="t" scale="7" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
);

/** Pessoa em tinta: foto/PNG recortado (com filtro) ou, sem arquivo, um busto genérico já em tinta. */
export const InkFigure: React.FC<{src?: string; color: string; id: string; size?: number}> = ({src, color, id, size = 760}) => (
  <div style={{width: size, height: size * 1.25, position: 'relative'}}>
    {src ? (
      <>
        <InkDefs id={id} color={color} />
        <MediaOrBlock src={src} style={{width: '100%', height: '100%', filter: `url(#${id})`}} />
      </>
    ) : (
      <svg viewBox="0 0 400 500" width="100%" height="100%">
        <defs>
          <filter id={`${id}-b`} x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="5" result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale="9" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <g filter={`url(#${id}-b)`} fill={color}>
          <circle cx="200" cy="165" r="92" />
          <path d="M28 500 C38 340 118 296 200 296 C282 296 362 340 372 500 Z" />
        </g>
      </svg>
    )}
  </div>
);
