// Verification for issue 10. Usage: node verify.mjs [distDir]. Needs playwright-core in /tmp/pwtool.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const { chromium } = createRequire('/tmp/pwtool/')('playwright-core');
const DIST = path.resolve(process.argv[2] ?? 'dist');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  let p = path.join(DIST, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, 'index.html');
  if (!fs.existsSync(p)) { res.writeHead(404).end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] ?? 'application/octet-stream' }).end(fs.readFileSync(p));
});
await new Promise((r) => server.listen(0, r));
const SITE = `http://localhost:${server.address().port}/`;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const fresh = async (stub) => {
  const ctx = await browser.newContext({ viewport: { width: 384, height: 832 }, isMobile: true, hasTouch: true, serviceWorkers: 'block' });
  if (stub) await ctx.addInitScript(stub);
  const page = await ctx.newPage();
  const logs = [], errors = [];
  page.on('console', (m) => logs.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => errors.push(String(e)));
  return { ctx, page, logs, errors };
};
const stubOf = (body) => `Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: { getVoices: () => { ${body} }, addEventListener() {}, cancel() {}, speak() {} } });`;
const dup = stubOf(`const v = { name: 'Google English', lang: 'en-GB', voiceURI: 'Google English', localService: false }; return [v, { ...v }];`);
const throwing = stubOf(`const bad = { name: 'Bad', lang: 'en', localService: false, get voiceURI() { if (window.__armed) throw new Error('boom voiceURI'); return 'bad'; } }; return [bad];`);
let failed = 0;
const check = async (name, fn) => {
  try { await fn(); console.log(`PASS ${name}`); } catch (e) { failed++; console.log(`FAIL ${name}: ${String(e.message).split('\n')[0]}`); }
};

await check('a) duplicate voiceURI: Settings opens, one Google English option', async () => {
  const { ctx, page } = await fresh(dup);
  await page.goto(SITE);
  await page.getByRole('button', { name: 'Settings' }).tap();
  await page.getByRole('button', { name: 'Back to lesson' }).waitFor({ state: 'visible', timeout: 3000 });
  assert.equal(await page.locator('select option', { hasText: 'Google English' }).count(), 1);
  await ctx.close();
});

await check('b) render error inside boundary: message, working Back, no uncaught error', async () => {
  const { ctx, page, logs, errors } = await fresh(throwing);
  await page.goto(SITE);
  // Arm after startup so the load-time dedupe succeeds and the throw happens while Settings renders.
  await page.evaluate(() => { window.__armed = true; });
  await page.getByRole('button', { name: 'Settings' }).tap();
  await page.getByText('Settings could not open.').waitFor({ state: 'visible', timeout: 3000 });
  assert.ok(await page.getByText(/boom voiceURI/).first().isVisible(), 'error text shown');
  assert.ok(logs.some((l) => l.startsWith('error:')), 'console.error logged');
  await page.getByRole('button', { name: 'Back to lesson' }).tap();
  await page.getByRole('button', { name: 'Settings' }).waitFor({ state: 'visible', timeout: 3000 });
  assert.equal(await page.getByText('Settings could not open.').count(), 0);
  assert.deepEqual(errors, []);
  await ctx.close();
});

await check('c) normal path: OpenDyslexic sets body font-family', async () => {
  const { ctx, page } = await fresh(null);
  await page.goto(SITE);
  await page.getByRole('button', { name: 'Settings' }).tap();
  await page.getByRole('radio', { name: 'OpenDyslexic' }).check();
  const ff = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  assert.match(ff, /OpenDyslexic/);
  await ctx.close();
});

await browser.close();
server.close();
console.log(failed ? `${failed} check(s) FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
