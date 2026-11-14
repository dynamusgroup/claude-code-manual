import React from 'react';
import {Composition, Folder} from 'remotion';
import './fonts';
import {Edit, SceneOnly, CaptionOnly, WordsOnly} from './Edit';
import {Plan} from './plan';
import {DEMOS, DEMO_DURATION} from './demos';
import {defaultTheme} from './theme';

const demoPlan: Plan = {
  meta: {fps: 24, width: 1080, height: 1920, duration: 6, bruto: 'demo/cut.mp4'},
  scenes: [{id: 'S01', type: 'center_text', start: 2, end: 5, props: {text: 'Constância vence intensidade'}}],
  captions: [{id: 'L01', start: 0.3, end: 1.9, lines: [{text: 'em poucas', kind: 'small', at: 0.1}, {text: 'palavras', kind: 'serif', at: 0.5}]}],
};

const dims = (plan: Plan) => ({width: plan.meta.width, height: plan.meta.height, fps: plan.meta.fps});
const frames = (s: number, fps: number) => Math.max(1, Math.round(s * fps));

export const Root: React.FC = () => (
  <>
    {/* Render principal: lê o plano aprovado. remotion render src/index.ts Edit out.mp4 --props=plano.json */}
    <Composition
      id="Edit"
      component={Edit}
      width={1080} height={1920} fps={24} durationInFrames={24 * 6}
      defaultProps={{plan: demoPlan}}
      calculateMetadata={({props}) => ({...dims(props.plan), durationInFrames: frames(props.plan.meta.duration, props.plan.meta.fps)})}
    />

    {/* Exportação para Premiere: peças isoladas */}
    <Folder name="Exportacao">
      <Composition
        id="SceneOnly" component={SceneOnly}
        width={1080} height={1920} fps={24} durationInFrames={24 * 3}
        defaultProps={{plan: demoPlan, sceneId: 'S01'}}
        calculateMetadata={({props}) => {
          const s = props.plan.scenes.find((x) => x.id === props.sceneId)!;
          return {...dims(props.plan), durationInFrames: frames(s.end - s.start, props.plan.meta.fps)};
        }}
      />
      <Composition
        id="CaptionOnly" component={CaptionOnly}
        width={1080} height={1920} fps={24} durationInFrames={48}
        defaultProps={{plan: demoPlan, captionId: 'L01'}}
        calculateMetadata={({props}) => {
          const c = props.plan.captions.find((x) => x.id === props.captionId)!;
          return {...dims(props.plan), durationInFrames: frames(c.end - c.start, props.plan.meta.fps)};
        }}
      />
      <Composition
        id="WordsOnly" component={WordsOnly}
        width={1080} height={1920} fps={24} durationInFrames={24 * 6}
        defaultProps={{plan: demoPlan, chromaGreen: false}}
        calculateMetadata={({props}) => ({...dims(props.plan), durationInFrames: frames(props.plan.meta.duration, props.plan.meta.fps)})}
      />
    </Folder>

    {/* As 10 técnicas (alimentam o board de estilo) */}
    <Folder name="Board">
      {DEMOS.map((d) => (
        <Composition key={d.id} id={d.id} component={d.Comp} defaultProps={{theme: defaultTheme}} width={1080} height={1920} fps={24} durationInFrames={Math.round(DEMO_DURATION * 24)} />
      ))}
    </Folder>
  </>
);
