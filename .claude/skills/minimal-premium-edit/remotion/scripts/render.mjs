#!/usr/bin/env node
// Renderiza o vídeo final e/ou as peças para o Premiere, empacotando o Remotion UMA vez.
//   node scripts/render.mjs edit     --plan plano.json --public-dir <projeto/> --out video.mp4 [--scale 0.5]
//   node scripts/render.mjs scenes   --plan plano.json --public-dir <projeto/> --out-dir cenas/  [--only id1,id2]   (MP4 por cena)
//   node scripts/render.mjs captions --plan plano.json --public-dir <projeto/> --out-dir legendas/ [--only id1]      (MOV ProRes 4444 com transparência)
//   node scripts/render.mjs words    --plan plano.json --public-dir <projeto/> --out palavra_a_palavra.mov [--chroma] (uma linha, palavra por palavra)
// Chrome do sistema: export REMOTION_BROWSER=/caminho/chrome
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2];
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > -1 ? process.argv[i + 1] : d; };
const flag = (k) => process.argv.includes('--' + k);
const planPath = arg('plan');
if (!mode || !planPath) { console.error('Uso: render.mjs <edit|scenes|captions|words> --plan plano.json --public-dir <pasta> ...'); process.exit(1); }
const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
const publicDir = arg('public-dir') ? path.resolve(arg('public-dir')) : undefined;
const scale = Number(arg('scale', 1));
const browserExecutable = process.env.REMOTION_BROWSER || undefined;
const chromeMode = browserExecutable ? 'chrome-for-testing' : undefined;
const concurrency = Number(process.env.REMOTION_CONCURRENCY || 2);
const only = arg('only') ? arg('only').split(',') : null;

const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir});
let last = -1;
const progress = (label) => ({renderedFrames}) => { const s = Math.floor(renderedFrames / 24); if (s !== last && s % 5 === 0) { last = s; process.stdout.write(`\r${label}: ${renderedFrames} quadros`); } };

async function go(id, props, out, opts = {}) {
  const composition = await selectComposition({serveUrl, id, inputProps: props, browserExecutable, chromeMode});
  fs.mkdirSync(path.dirname(out), {recursive: true});
  await renderMedia({composition, serveUrl, inputProps: props, outputLocation: out, scale, concurrency, browserExecutable, chromeMode,
    onProgress: progress(path.basename(out)), ...opts});
  console.log(`\nOK ${out}`);
}
const h264 = {codec: 'h264', crf: 18, audioCodec: 'aac'};
const alpha = {codec: 'prores', proResProfile: '4444', pixelFormat: 'yuva444p10le', imageFormat: 'png'};

if (mode === 'edit') await go('Edit', {plan}, path.resolve(arg('out', 'video.mp4')), h264);
if (mode === 'scenes') for (const s of plan.scenes) if (!only || only.includes(s.id)) await go('SceneOnly', {plan, sceneId: s.id}, path.join(path.resolve(arg('out-dir', 'cenas')), `${s.id}.mp4`), {...h264, muted: true});
if (mode === 'captions') for (const c of plan.captions) if (!only || only.includes(c.id)) await go('CaptionOnly', {plan, captionId: c.id}, path.join(path.resolve(arg('out-dir', 'legendas')), `${c.id}.mov`), {...alpha, muted: true});
if (mode === 'words') await go('WordsOnly', {plan, chromaGreen: flag('chroma')}, path.resolve(arg('out', 'palavra_a_palavra.mov')), flag('chroma') ? {...h264, muted: true} : {...alpha, muted: true});
