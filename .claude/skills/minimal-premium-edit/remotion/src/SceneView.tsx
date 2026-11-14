import React from 'react';
import {Theme} from './theme';
import {SceneSpec} from './plan';
import {BRollText, BRollTextProps} from './scenes/BRollText';
import {Painting, PaintingProps} from './scenes/Painting';
import {LineText, LineTextProps} from './scenes/LineText';
import {TimelinePaper, TimelinePaperProps} from './scenes/TimelinePaper';
import {CenterText, CenterTextProps} from './scenes/CenterText';
import {CenterIllustration, CenterIllustrationProps} from './scenes/CenterIllustration';
import {SideIllustration, SideIllustrationProps} from './scenes/SideIllustration';
import {ObjectHighlight, ObjectHighlightProps} from './scenes/ObjectHighlight';
import {Chart, ChartProps} from './scenes/Chart';

/** Escolhe o componente pela `type` da cena do plano. */
export const SceneView: React.FC<{scene: SceneSpec; theme: Theme}> = ({scene, theme}) => {
  const dur = scene.end - scene.start;
  const p = {...(scene.props as object), dur, theme} as never;
  switch (scene.type) {
    case 'broll_text': return <BRollText {...(p as BRollTextProps & {theme: Theme})} />;
    case 'painting': return <Painting {...(p as PaintingProps & {theme: Theme})} />;
    case 'line_text': return <LineText {...(p as LineTextProps & {theme: Theme})} />;
    case 'timeline': return <TimelinePaper {...(p as TimelinePaperProps & {theme: Theme})} />;
    case 'center_text': return <CenterText {...(p as CenterTextProps & {theme: Theme})} />;
    case 'center_illustration': return <CenterIllustration {...(p as CenterIllustrationProps & {theme: Theme})} />;
    case 'side_illustration': return <SideIllustration {...(p as SideIllustrationProps & {theme: Theme})} />;
    case 'object_highlight': return <ObjectHighlight {...(p as ObjectHighlightProps & {theme: Theme})} />;
    case 'chart': return <Chart {...(p as ChartProps & {theme: Theme})} />;
    default: return null;
  }
};
