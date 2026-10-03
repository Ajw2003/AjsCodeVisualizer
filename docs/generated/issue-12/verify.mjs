// Usage: node verify.mjs <unfixed-ref> [fixed-ref=HEAD]
// Builds app versions A and B (B differs only in <title>) for both refs in /tmp/issue12,
// serves them with GitHub-Pages-like `Cache-Control: max-age=600`, and checks that a page
// which was hidden then shown picks up B with no reload by the test.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire('/tmp/pwtool/');
const { chromium } = require('playwright-core');

const repo = execSync('git rev-parse --show-toplevel').toString().trim();
const unfixedRef = process.argv[2];
const fixedRef = process.argv[3] ?? 'HEAD';
if (!unfixedRef) { console.error('need <unfixed-ref>'); process.exit(2); }
const work = '/tmp/issue12';
const PREFIX = '/AjsCodeVisualizer/';
const TITLE_A = "AJ's Code Visualizer";
const TITLE_B = 'VERSION-B Code Visualizer';

function build(ref, label, version) {
  const dir = `${work}/${label}-${version}`;
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  execSync(`git -C ${repo} archive ${ref} | tar -x -C ${dir}`);
  fs.symlinkSync(`${repo}/node_modules`, `${dir}/node_modules`);
  if (version === 'B') {
    const f = `${dir}/index.html`;
    fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(TITLE_A, TITLE_B));
  }
  const out = execSync('npm run build', { cwd: dir }).toString();
  console.log(`[build ${label}-${version}] ${out.split('\n').find((l) => l.startsWith('precache'))}`);
  return `${dir}/dist`;
}

const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webmanifest': 'application/manifest+json', '.woff2': 'font/woff2', '.woff': 'font/woff' };
let root = null; // mutable so the test can swap builds
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (!url.pathname.startsWith(PREFIX)) { res.writeHead(404).end(); return; }
  let rel = url.pathname.slice(PREFIX.length) || 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.join(root, rel);
  if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404, { 'Cache-Control': 'max-age=600' }).end(); return; }
  res.writeHead(200, { 'Content-Type': mime[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'max-age=600' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}${PREFIX}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function scenario(label, dirA, dirB) {
  console.log(`\n=== ${label} ===`);
  root = dirA;
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') console.log(`  [page ${m.type()}] ${m.text()}`); });
  await page.goto(base);
  await page.evaluate(() => navigator.serviceWorker.ready);
  // First load is uncontrolled until the worker claims; reload here is setup, before the swap.
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 5000 }).catch(() => page.reload());
  await page.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
  await page.evaluate(() => {
    window.__vis = [document.visibilityState];
    document.addEventListener('visibilitychange', () => window.__vis.push(document.visibilityState));
  });
  console.log(`  title before swap: ${await page.title()}`);

  root = dirB; // "deploy" version B
  // Neither headless nor Xvfb-headed Chromium ever flips visibilityState (tried second page +
  // bringToFront and Browser.setWindowBounds minimized, both modes: always "visible", no event).
  // So hide/resume is SYNTHETIC: override visibilityState and dispatch the same visibilitychange
  // event the browser fires on Android resume. It exercises our handler, not Chromium's lifecycle.
  const setVis = (state) => page.evaluate((s) => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => s });
    document.dispatchEvent(new Event('visibilitychange'));
  }, state);
  await setVis('hidden');
  await sleep(500);
  const hiddenState = await page.evaluate(() => document.visibilityState);
  await setVis('visible');

  const deadline = Date.now() + 15000;
  let title = await page.title();
  while (title !== TITLE_B && Date.now() < deadline) { await sleep(500); title = await page.title().catch(() => title); }
  const vis = await page.evaluate(() => window.__vis).catch(() => 'lost (page reloaded itself)');
  console.log(`  visibilityState after synthetic hide: ${hiddenState}`);
  console.log(`  visibilityState transitions seen by page: ${JSON.stringify(vis)}`);
  console.log(`  title after resume (<=15s, no test reload): ${title}`);
  await browser.close();
  return title === TITLE_B;
}

const unfixed = [build(unfixedRef, 'unfixed', 'A'), build(unfixedRef, 'unfixed', 'B')];
const fixed = [build(fixedRef, 'fixed', 'A'), build(fixedRef, 'fixed', 'B')];
const unfixedOk = await scenario('UNFIXED (expect stays on A)', ...unfixed);
const fixedOk = await scenario('FIXED (expect B)', ...fixed);
server.close();
console.log(`\nunfixed updated: ${unfixedOk} (expected false); fixed updated: ${fixedOk} (expected true)`);
process.exit(!unfixedOk && fixedOk ? 0 : 1);
