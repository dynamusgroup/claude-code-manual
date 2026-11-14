#!/usr/bin/env node
// Renderiza quadros (PNG) de várias composições empacotando o projeto UMA vez.
// Uso: node scripts/render_stills.mjs --out ../../board/frames [--ids a,b,c|all-demos] [--frame 80] [--props plano.json]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {createRequire} from 'node:module';
import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > -1 ? process.argv[i + 1] : d; };
const out = path.resolve(arg('out', 'stills'));
const frame = Number(arg('frame', 80));
const idsArg = arg('ids', 'all-demos');
const propsFile = arg('props', null);
const publicDir = arg('public-dir', null);
const inputProps = propsFile ? JSON.parse(fs.readFileSync(propsFile, 'utf8')) : {};
const browserExecutable = process.env.REMOTION_BROWSER || undefined;

fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.join(root, 'src/index.ts'), publicDir: publicDir ? path.resolve(publicDir) : undefined});
let ids = idsArg.split(',');
if (idsArg === 'all-demos') {
  const comps = await (await import('@remotion/renderer')).getCompositions(serveUrl, {browserExecutable, chromeMode: browserExecutable ? 'chrome-for-testing' : undefined});
  ids = comps.map((c) => c.id).filter((i) => /^p\d\d-/.test(i));
}
for (const id of ids) {
  const composition = await selectComposition({serveUrl, id, inputProps, browserExecutable, chromeMode: browserExecutable ? 'chrome-for-testing' : undefined});
  const f = Math.min(frame, composition.durationInFrames - 1);
  await renderStill({composition, serveUrl, inputProps, frame: f, output: path.join(out, `${id}.png`), browserExecutable, chromeMode: browserExecutable ? 'chrome-for-testing' : undefined});
  console.log('ok', id, 'frame', f);
}
