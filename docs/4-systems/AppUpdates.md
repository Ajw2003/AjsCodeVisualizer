# App updates (tier 4)

**What it owns:** getting a newly deployed version onto an installed app without the learner
reloading by hand. Built in issue #12.

## How it works

- `src/lib/app-updates.js` registers the service worker itself (`virtual:pwa-register`;
  `injectRegister: false` in `vite.config.js`).
- It checks for a new version when the app becomes visible again and every 5 minutes while
  visible. An installed Android app resumed from the background never navigates, so the browser's
  own on-navigation check never ran; that was the bug.
- Each check fetches `sw.js` with `cache: 'no-store'` first, because GitHub Pages serves files with
  `Cache-Control: max-age=600` (the "10 minutes"), then calls `registration.update()`.
- `skipWaiting` and `clientsClaim` are set explicitly in `vite.config.js`: the plugin only implies
  them for `injectRegister` auto/null. With `registerType: 'autoUpdate'` the page then reloads onto
  the new version. Settings survive (localStorage); the lesson goes back to step 1.
- Offline, checks are skipped. Every failure is a `console.warn`.

## Where to start when it breaks

| Symptom | Look at |
|---|---|
| Old version keeps showing | `Update check failed` / `Update check skipped` warnings in the console |
| New version waits and never shows | `skipWaiting` / `clientsClaim` in `vite.config.js` |

## Checked

`docs/generated/issue-12/verify.mjs <unfixed-ref>` builds two versions, serves them with
`max-age=600`, hides and shows the page, and checks the new version appears. Last run 2026-10-03:
`unfixed updated: false (expected false); fixed updated: true (expected true)`. The hide/show is
simulated, because headless Chromium never changes `visibilityState`; real Android resume is
checked by the owner.
