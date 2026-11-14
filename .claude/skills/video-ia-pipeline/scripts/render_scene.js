#!/usr/bin/env node
// Renderiza uma cena HTML determinística em MP4 (frame a frame, sem depender de tempo real).
// Uso: node render_scene.js <cena.html> <saida.mp4|.mov> [--dur 10] [--fps 30] [--w 1080] [--h 1920] [--audio arquivo.wav|mp3] [--alpha]
// --alpha: fundo transparente (saida .mov ProRes 4444) para sobrepor com ffmpeg/compose.py sobre o vídeo do orador.
// A página PRECISA expor window.seek(t) (t em segundos) que posiciona TODAS as animações naquele instante.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const [html, out] = args;
if (!html || !out) { console.error('Uso: render_scene.js cena.html saida.mp4 [--dur N --fps N --w N --h N --audio f]'); process.exit(1); }
const opt = (k, d) => { const i = args.indexOf('--' + k); return i > -1 ? args[i + 1] : d; };
const dur = parseFloat(opt('dur', 10)), fps = parseInt(opt('fps', 30)), W = parseInt(opt('w', 1080)), H = parseInt(opt('h', 1920));
const audio = opt('audio', null);
const alpha = args.includes('--alpha');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(html));
  if (alpha) await page.addStyleTag({ content: 'html,body,#stage{background:transparent!important}' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  const hasSeek = await page.evaluate(() => typeof window.seek === 'function');
  if (!hasSeek) { console.error('ERRO: a cena não define window.seek(t).'); process.exit(2); }
  const ff = ['-y', '-f', 'image2pipe', '-framerate', String(fps), '-vcodec', alpha ? 'png' : 'mjpeg', '-i', '-'];
  if (audio) ff.push('-i', audio);
  if (alpha) ff.push('-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le');
  else ff.push('-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'medium');
  if (audio) ff.push('-c:a', 'aac', '-b:a', '192k', '-shortest');
  if (!alpha) ff.push('-movflags', '+faststart');
  ff.push(out);
  const enc = spawn('ffmpeg', ff, { stdio: ['pipe', 'inherit', 'inherit'] });
  const total = Math.round(dur * fps);
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.seek(t), i / fps);
    const buf = alpha ? await page.screenshot({ type: 'png', omitBackground: true }) : await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
  }
  enc.stdin.end();
  await new Promise(r => enc.on('close', r));
  await browser.close();
  console.log(`OK: ${out} (${total} frames, ${dur}s @ ${fps}fps, ${W}x${H})`);
})();
