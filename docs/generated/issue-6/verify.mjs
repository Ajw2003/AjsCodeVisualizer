// Verification for issue 6. Needs `vite preview --port 4173` running and playwright-core in /tmp/pwtool.
import { createRequire } from 'node:module';
import assert from 'node:assert/strict';
const { chromium } = createRequire('/tmp/pwtool/')('playwright-core');
const SITE = 'http://localhost:4173/';
const OUT = new globalThis.URL('./', import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctxOpts = { viewport: { width: 390, height: 844 } };
const fresh = async (extra = {}) => {
  const ctx = await browser.newContext({ ...ctxOpts, ...extra });
  const page = await ctx.newPage();
  const logs = [], errors = [];
  page.on('console', (m) => logs.push(`${m.type()}: ${m.text()}`));
  page.on('pageerror', (e) => errors.push(String(e)));
  return { ctx, page, logs, errors };
};
const openSettings = (page) => page.getByRole('button', { name: 'Settings' }).click();
const stepFont = (page) => page.locator('.idea').evaluate((e) => getComputedStyle(e).fontFamily);

// a) screenshots, b) persistence
{
  const { ctx, page } = await fresh();
  await page.goto(SITE);
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + 'lesson-default.png' });
  await openSettings(page);
  await page.screenshot({ path: OUT + 'settings-screen.png', fullPage: true });
  await page.getByRole('radio', { name: 'OpenDyslexic' }).check();
  await page.locator('#size').fill('150');
  await page.getByRole('radio', { name: 'Wider' }).check();
  await page.getByRole('radio', { name: 'Loose' }).check();
  await page.getByRole('button', { name: 'Back to lesson' }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  console.log('overflow px at 150% OpenDyslexic wider:', await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  await page.screenshot({ path: OUT + 'lesson-opendyslexic-large.png', fullPage: true });
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  const ff = await stepFont(page);
  const fs = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
  console.log('b) after reload font-family:', ff, '| root font-size:', fs);
  assert.match(ff, /OpenDyslexic/);
  assert.equal(fs, '24px');
  console.log('b) localStorage:', await page.evaluate(() => localStorage.getItem('ajs-settings-v1')));
  await openSettings(page);
  await page.getByRole('radio', { name: 'Atkinson Hyperlegible' }).check();
  await page.locator('#size').fill('100');
  await page.locator('input[name=letter]').first().check();
  await page.locator('input[name=line]').first().check();
  await page.getByRole('button', { name: 'Back to lesson' }).click();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await page.screenshot({ path: OUT + 'lesson-atkinson.png' });
  await ctx.close();
}
{
  const { ctx, page } = await fresh({ colorScheme: 'dark' });
  await page.goto(SITE);
  await openSettings(page);
  await page.screenshot({ path: OUT + 'settings-dark.png', fullPage: true });
  // Radios/checkboxes are 24px but sit inside >=44px labels, so measure the label rows too.
  const small = await page.evaluate(() =>
    [...document.querySelectorAll('select,button,input[type=range],label.check')]
      .map((e) => [e.tagName + (e.id ? '#' + e.id : ''), e.getBoundingClientRect()])
      .filter(([, r]) => r.height < 44).map(([n, r]) => `${n} ${r.width}x${r.height}`));
  console.log('touch targets under 44px high:', JSON.stringify(small));
  console.log('horizontal overflow px at 390:', await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  await page.setViewportSize({ width: 360, height: 740 });
  console.log('horizontal overflow px at 360:', await page.evaluate(() => document.documentElement.scrollWidth - innerWidth));
  await ctx.close();
}

// c) calm mode
{
  const { ctx, page } = await fresh({ reducedMotion: 'reduce' });
  await page.goto(SITE);
  const calm = await page.evaluate(() => document.documentElement.dataset.calm);
  console.log('c) reduce + empty storage data-calm =', calm);
  assert.equal(calm, 'true');
  await ctx.close();
}
{
  const { ctx, page } = await fresh({ reducedMotion: 'no-preference' });
  await page.goto(SITE);
  const dur = () => page.locator('.fill').evaluate((e) => getComputedStyle(e).transitionDuration);
  const before = await dur();
  console.log('c) no-preference data-calm =', await page.evaluate(() => document.documentElement.dataset.calm), '| fill transition-duration =', before);
  assert.equal(before, '0.3s');
  await openSettings(page);
  await page.getByRole('checkbox', { name: /Calm mode/ }).check();
  await page.getByRole('button', { name: 'Back to lesson' }).click();
  const after = await dur();
  console.log('c) calm toggled on: fill transition-duration =', after);
  assert.equal(after, '0s');
  await ctx.close();
}

// d) corrupt storage
{
  const { ctx, page, logs, errors } = await fresh();
  await page.addInitScript(() => localStorage.setItem('ajs-settings-v1', 'not json'));
  await page.goto(SITE);
  await page.getByText('Step 1 of 3').first().waitFor();
  const warns = logs.filter((l) => l.startsWith('warning'));
  console.log('d) renders Step 1 of 3; warnings:', JSON.stringify(warns), '| page errors:', JSON.stringify(errors));
  assert.ok(warns.some((w) => w.includes('ajs-settings-v1')));
  await ctx.close();
}

// e) read aloud with a stub, and with speechSynthesis missing
{
  const { ctx, page } = await fresh();
  await page.addInitScript(() => {
    window.__spoken = [];
    window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      getVoices: () => [
        { name: 'Cloud Voice', lang: 'en-US', voiceURI: 'cloud', localService: false },
        { name: 'Local Voice', lang: 'en-GB', voiceURI: 'local', localService: true },
      ],
      addEventListener() {}, cancel() {},
      speak(u) { window.__spoken.push(u.text); },
    } });
  });
  await page.goto(SITE);
  await page.getByRole('button', { name: 'Read this screen' }).click();
  console.log('e) spoken:', JSON.stringify(await page.evaluate(() => window.__spoken)));
  console.log('e) button now reads:', await page.locator('button.read').innerText());
  await openSettings(page);
  console.log('e) voice options:', JSON.stringify(await page.locator('#voice option').allInnerTexts()));
  await ctx.close();
}
{
  const { ctx, page, errors } = await fresh();
  await page.addInitScript(() => Object.defineProperty(window, 'speechSynthesis', { value: undefined, configurable: true }));
  await page.goto(SITE);
  console.log('e) no speechSynthesis: read button count =', await page.getByRole('button', { name: /Read this screen/ }).count());
  await openSettings(page);
  console.log('e) settings text:', await page.getByText(/no built-in voices/).innerText(), '| page errors:', JSON.stringify(errors));
  assert.equal(errors.length, 0);
  await ctx.close();
}

// f) offline
{
  const { ctx, page } = await fresh();
  await page.goto(SITE);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForTimeout(1500);
  await openSettings(page);
  await page.getByRole('radio', { name: 'OpenDyslexic' }).check();
  await page.locator('#size').fill('150');
  await page.reload();
  await page.waitForTimeout(500);
  await ctx.setOffline(true);
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  console.log('f) offline: font-family', await stepFont(page), '| root font-size', await page.evaluate(() => getComputedStyle(document.documentElement).fontSize));
  console.log('f) offline: document.fonts.check OpenDyslexic =', await page.evaluate(() => document.fonts.check("1em 'OpenDyslexic'")),
    '| loaded faces:', JSON.stringify(await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.weight))));
  await ctx.close();
}
await browser.close();
console.log('ALL ASSERTIONS PASSED');
