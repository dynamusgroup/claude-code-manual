import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import './fonts';
import {Plan, secToFrames} from './plan';
import {mergeTheme} from './theme';
import {media} from './anim';
import {SceneView} from './SceneView';
import {CinematicCaption} from './scenes/CinematicCaption';
import {WordByWord} from './scenes/WordByWord';

/** Zoom leve a cada volta ao rosto (efeito multicâmera): alterna 1.00 ↔ 1.06. */
const useFaceScale = (plan: Plan) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (plan.options?.faceZoom === false) return 1;
  const t = frame / fps;
  const returns = [...plan.scenes].sort((a, b) => a.start - b.start).map((s) => s.end);
  let prev = 1, cur = 1, at = -10;
  returns.forEach((r, i) => {
    if (r <= t) { prev = cur; cur = i % 2 === 0 ? 1.06 : 1.0; at = r; }
  });
  return interpolate(t, [at, at + 0.5], [prev, cur], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

export const Edit: React.FC<{plan: Plan}> = ({plan}) => {
  const {fps} = plan.meta;
  const theme = mergeTheme(plan.theme);
  const scale = useFaceScale(plan);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {/* 1 · rosto + voz (sempre tocando por baixo das cenas) */}
      <AbsoluteFill style={{transform: `scale(${scale})`}}>
        <OffthreadVideo src={media(plan.meta.bruto)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>

      {/* 2 · cenas (cobrem ~55–65% do vídeo; nunca o mesmo tipo duas vezes seguidas) */}
      {plan.scenes.map((s) => (
        <Sequence key={s.id} from={secToFrames(s.start, fps)} durationInFrames={Math.max(1, secToFrames(s.end - s.start, fps))} name={s.id}>
          <SceneView scene={s} theme={theme} />
        </Sequence>
      ))}

      {/* 3 · legendas */}
      {plan.captions.map((c) => (
        <Sequence key={c.id} from={secToFrames(c.start, fps)} durationInFrames={Math.max(1, secToFrames(c.end - c.start, fps))} name={c.id}>
          <CinematicCaption lines={c.lines} dur={c.end - c.start} theme={theme} />
        </Sequence>
      ))}
      {plan.options?.wordByWord && plan.words && <WordByWord words={plan.words} dur={plan.meta.duration} theme={theme} />}

      {/* 4 · sons (só se o briefing pedir: cliques suaves quando um elemento aparece) */}
      {(plan.sfx || []).map((s, i) => (
        <Sequence key={i} from={secToFrames(s.at, fps)} name={`sfx-${i}`}>
          <Audio src={media(s.file)} volume={s.volume ?? 0.5} />
        </Sequence>
      ))}
      {plan.music && <Audio src={media(plan.music.file)} volume={plan.music.volume ?? 0.15} />}
    </AbsoluteFill>
  );
};

/** Exportação: UMA cena isolada (vira clipe da faixa V2 no Premiere). */
export const SceneOnly: React.FC<{plan: Plan; sceneId: string}> = ({plan, sceneId}) => {
  const scene = plan.scenes.find((s) => s.id === sceneId);
  if (!scene) return null;
  return <SceneView scene={scene} theme={mergeTheme(plan.theme)} />;
};

/** Exportação: UMA legenda com fundo transparente (faixa V3). */
export const CaptionOnly: React.FC<{plan: Plan; captionId: string}> = ({plan, captionId}) => {
  const c = plan.captions.find((x) => x.id === captionId);
  if (!c) return null;
  return <CinematicCaption lines={c.lines} dur={c.end - c.start} theme={mergeTheme(plan.theme)} />;
};

/** Exportação: legenda palavra por palavra do vídeo inteiro (transparente ou fundo verde). */
export const WordsOnly: React.FC<{plan: Plan; chromaGreen?: boolean}> = ({plan, chromaGreen}) => (
  <WordByWord words={plan.words || []} dur={plan.meta.duration} theme={mergeTheme(plan.theme)} chromaGreen={chromaGreen} />
);
