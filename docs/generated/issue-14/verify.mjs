// Usage: node docs/generated/issue-14/verify.mjs   (from the repo root, after npm ci)
// 1. Runs every code sample in the lessons with real python3 and node, and checks the lesson
//    tells the truth about its output. 2. Clicks through every lesson in Chromium at phone width,
//    in both languages, and saves screenshots next to this file.
import { execFileSync, execSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { LESSONS, pick } from '../../../src/lessons/index.js';

const require = createRequire('/tmp/pwtool/');
const { chromium } = require('playwright-core');
const out = new URL('.', import.meta.url).pathname;
let failures = 0;
const check = (ok, what) => { console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`); if (!ok) failures++; };

function runCode(lines, language) {
  const src = lines.join('\n') + '\n';
  const cmd = language === 'python' ? ['python3', ['-c', src]] : ['node', ['-e', src]];
  return execFileSync(...cmd).toString().trimEnd().split('\n').filter((l) => l !== '');
}

console.log('--- Code samples, run for real ---');
for (const lesson of LESSONS) {
  for (const [n, screen] of lesson.screens.entries()) {
    for (const language of ['python', 'javascript']) {
      const where = `${lesson.id} screen ${n + 1} (${language})`;
      const code = screen.code && pick(screen.code, language);
      if (screen.type === 'trace') {
        const expected = screen.steps.at(-1).output;
        const got = runCode(code, language);
        check(JSON.stringify(got) === JSON.stringify(expected), `${where}: final output ${JSON.stringify(got)}`);
      }
      if (screen.type === 'slider') {
        for (const value of [screen.min, 25, 26, screen.max]) {
          const got = runCode(code.map((l) => l.replace('{value}', String(value))), language);
          const claimed = screen.run(value).output;
          check(JSON.stringify(got) === JSON.stringify(claimed), `${where} at ${value}: ${JSON.stringify(got)}`);
        }
      }
      if (screen.type === 'choice' && code) {
        const got = runCode(code, language);
        const answer = screen.options[screen.answer];
        // A numeric answer to "how many times" counts lines; otherwise it is the shown text.
        const matches = lesson.id === 'loops' ? String(got.length) === answer : got.join('\n') === answer;
        check(matches, `${where}: answer "${answer}" vs output ${JSON.stringify(got)}`);
      }
    }
  }
}
// The if/else question has no code of its own; it refers back to the slider at 25.
const slider = LESSONS.find((l) => l.id === 'if-else').screens.find((s) => s.type === 'slider');
for (const language of ['python', 'javascript']) {
  const got = runCode(pick(slider.code, language).map((l) => l.replace('{value}', '25')), language);
  check(got[0] === 'Bring a jumper', `if-else question at 25 (${language}): ${JSON.stringify(got)}`);
}

console.log('--- Click through in Chromium, 390px wide ---');
execSync('npm run build', { stdio: 'ignore' });
const server = spawn('node_modules/.bin/vite', ['preview', '--port', '4319', '--strictPort'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 2500));
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
try {
  for (const language of ['Python', 'JavaScript']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    // 404s are logged by URL instead; the browser's own /favicon.ico guess is not ours.
    page.on('console', (m) => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(m.text()); });
    page.on('response', (r) => { if (r.status() >= 400 && !r.url().endsWith('/favicon.ico')) errors.push(`${r.status()} ${r.url()}`); });
    await page.goto('http://localhost:4319/');
    const titles = await page.locator('ul button').allInnerTexts();
    check(titles.length === LESSONS.length, `picker lists ${titles.length} lessons`);
    for (const lesson of LESSONS) {
      await page.getByRole('button', { name: lesson.title }).click();
      let presses = 0;
      let shot = 0;
      while (presses < 50) {
        if (await page.locator('fieldset.language').isVisible()) await page.getByLabel(language, { exact: true }).check();
        const slider = page.locator('#slider');
        if (await slider.isVisible()) {
          await slider.fill('30');
          const hot = await page.locator('pre.output').innerText();
          await slider.fill('25');
          const mild = await page.locator('pre.output').innerText();
          check(hot === 'Wear shorts' && mild === 'Bring a jumper', `${lesson.id} slider (${language}): 30 -> "${hot}", 25 -> "${mild}"`);
        }
        const options = page.locator('button.option');
        if (await options.count()) {
          await options.first().click();
          const note = await page.locator('p.note').innerText();
          check(/Right\.|Not quite\./.test(note), `${lesson.id} choice (${language}) gives feedback`);
        }
        // One screenshot per lesson screen (its last code step), not per press.
        const label = await page.locator('section > button:last-child').innerText();
        if (lesson.id !== 'steps' && label !== 'Run next line') {
          await page.screenshot({ path: `${out}${lesson.id}-${language.toLowerCase()}-${++shot}.png`, fullPage: true });
        }
        if (label === 'Start again') break;
        await page.locator('section > button:last-child').click();
        presses++;
      }
      const expectedPresses = lesson.screens.reduce((sum, s) => sum + (s.type === 'trace' ? s.steps.length : 1), 0) - 1;
      check(presses === expectedPresses, `${lesson.id} (${language}): reached the end after ${presses} presses (expected ${expectedPresses})`);
      await page.getByRole('button', { name: 'All lessons' }).click();
    }
    check(errors.length === 0, `no page errors (${language})${errors.length ? ': ' + errors.join(' | ') : ''}`);
    await page.close();
  }
  // The language choice is saved like the other settings.
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:4319/');
  await page.evaluate(() => localStorage.setItem('ajs-settings-v1', JSON.stringify({ language: 'javascript' })));
  await page.reload();
  await page.getByRole('button', { name: 'Variables: named boxes' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  const firstLine = await page.locator('.code .line').first().innerText();
  check(firstLine.includes('let score = 5;'), `saved language shows JavaScript after reload: "${firstLine.trim()}"`);
} finally {
  await browser.close();
  server.kill();
}
console.log(failures ? `\n${failures} check(s) FAILED` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
