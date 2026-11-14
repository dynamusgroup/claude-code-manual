import React from 'react';
import {AbsoluteFill} from 'remotion';
import './fonts';
import {Theme} from './theme';
import {CinematicCaption} from './scenes/CinematicCaption';
import {BRollText} from './scenes/BRollText';
import {Painting} from './scenes/Painting';
import {LineText} from './scenes/LineText';
import {TimelinePaper} from './scenes/TimelinePaper';
import {CenterText} from './scenes/CenterText';
import {CenterIllustration} from './scenes/CenterIllustration';
import {SideIllustration} from './scenes/SideIllustration';
import {ObjectHighlight} from './scenes/ObjectHighlight';
import {Chart} from './scenes/Chart';

const D = 4.5;

/** Catálogo das 10 técnicas do Minimal Premium com dados de exemplo (alimenta o board_estilo.html). */
export const DEMOS: {id: string; titulo: string; quando: string; Comp: React.FC<{theme: Theme}>}[] = [
  {id: 'p01-legenda-cinematografica', titulo: '1 · Legenda cinematográfica', quando: 'Frase curta com 1–3 palavras-chave: conexão com o rosto.',
    Comp: ({theme: T}) => (
      <AbsoluteFill style={{background: 'linear-gradient(160deg,#3a3a3a,#111)'}}>
        <CinematicCaption dur={D} theme={T} lines={[{text: 'a ciência do', kind: 'small', at: 0.3}, {text: 'cuidado', kind: 'serif', at: 0.8}, {text: 'em 3 passos', kind: 'small', at: 1.4}]} />
      </AbsoluteFill>
    )},
  {id: 'p02-broll-texto', titulo: '2 · B-roll + texto', quando: 'Um clipe por ideia mostrando literalmente o que é dito (1,5–5 s).',
    Comp: ({theme: T}) => <BRollText dur={D} theme={T} label="b-roll: laboratório" text="onde tudo começa" />},
  {id: 'p03-pintura', titulo: '3 · Pintura', quando: 'Contexto histórico: pintura/foto antiga, tinta a óleo, câmera de lado.',
    Comp: ({theme: T}) => <Painting dur={D} theme={T} caption="século XIX" />},
  {id: 'p04-linha-texto', titulo: '4 · Linha + texto', quando: 'Liga 2–4 conceitos falados em sequência (causa → efeito).',
    Comp: ({theme: T}) => <LineText dur={D} theme={T} nodes={[{label: 'sono', at: 0.5}, {label: 'hormônios', at: 1.7}, {label: 'energia', at: 2.9}]} />},
  {id: 'p05-linha-do-tempo', titulo: '5 · Linha do tempo', quando: 'Datas e fases: polaroids sobre a linha, anos embaixo.',
    Comp: ({theme: T}) => <TimelinePaper dur={D} theme={T} items={[{year: '1998', caption: 'início', at: 0.5}, {year: '2008', caption: 'virada', at: 1.4}, {year: '2024', caption: 'hoje', at: 2.3}]} />},
  {id: 'p06-texto-central', titulo: '6 · Texto central', quando: 'A frase-tese em destaque, com aspas grandes.',
    Comp: ({theme: T}) => <CenterText dur={D} theme={T} text="Constância vence intensidade" />},
  {id: 'p07-ilustracao-central', titulo: '7 · Ilustração central', quando: 'Pessoa em tinta (cor de destaque) com anéis em volta.',
    Comp: ({theme: T}) => <CenterIllustration dur={D} theme={T} caption="o especialista" />},
  {id: 'p08-ilustracao-lateral', titulo: '8 · Ilustração lateral', quando: 'Contraste: ilustração de um lado, texto do outro.',
    Comp: ({theme: T}) => <SideIllustration dur={D} theme={T} side="left" text="antes era assim, hoje é diferente" />},
  {id: 'p09-destaque-objeto', titulo: '9 · Destaque de objeto', quando: 'Polaroid + círculo de pincel em volta do detalhe.',
    Comp: ({theme: T}) => <ObjectHighlight dur={D} theme={T} label="olhe este detalhe" target={{x: 58, y: 38, r: 20}} />},
  {id: 'p10-grafico', titulo: '10 · Gráfico', quando: 'Números: fundo escuro, grade fina e bolinha brilhante percorrendo os dados.',
    Comp: ({theme: T}) => <Chart dur={D} theme={T} title="crescimento" data={[12, 18, 15, 28, 41, 63]} labels={['2019', '20', '21', '22', '23', '24']} unit="%" />},
];
export const DEMO_DURATION = D;
