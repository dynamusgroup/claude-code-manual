import {Theme} from './theme';
import {CapLine} from './scenes/CinematicCaption';
import {Word} from './scenes/WordByWord';

export type SceneType =
  | 'broll_text' | 'painting' | 'line_text' | 'timeline' | 'center_text'
  | 'center_illustration' | 'side_illustration' | 'object_highlight' | 'chart';

export type SceneSpec = {
  id: string;            // ex.: "C001_broll"  (nome do clipe exportado)
  type: SceneType;
  start: number;         // s, no vídeo JÁ CORTADO (cut.mp4)
  end: number;
  props: Record<string, unknown>;
  note?: string;         // ideia/frase falada — vai para o plano de edição em texto
};

export type CaptionSpec = {id: string; start: number; end: number; lines: CapLine[]};

export type SfxSpec = {at: number; file: string; volume?: number};

export type Plan = {
  meta: {
    fps: number;         // 24 ou 30
    width: number;       // 1080
    height: number;      // 1920
    duration: number;    // s
    bruto: string;       // caminho relativo a --public-dir (ex.: "cliente/cut.mp4")
    cliente?: string;
  };
  theme?: Partial<Theme>;
  scenes: SceneSpec[];
  captions: CaptionSpec[];
  words?: Word[];
  options?: {faceZoom?: boolean; wordByWord?: boolean};
  sfx?: SfxSpec[];
  music?: {file: string; volume?: number};
};

export const secToFrames = (s: number, fps: number) => Math.round(s * fps);
