# Accessibility settings (tier 4)

**What it owns:** how the app looks and moves for each learner — calm mode, reading font, text
size, spacing, and read-aloud — and keeping those choices on the device. Built in issue #6.

## How it works

- **One store:** `src/lib/settings.svelte.js` holds the settings as Svelte state. `load()` reads
  localStorage key `ajs-settings-v1`; `validate()` checks each field on its own, so one bad value
  falls back to its default without losing the rest. Failures log a `console.warn` naming the key.
- **Applied as CSS variables:** `applySettings()` sets `data-calm`, `data-font` and the
  variables `--font-family`, `--text-scale`, `--letter-spacing`, `--word-spacing` and
  `--line-height` on `<html>`. `src/app.css` reads them. Components never read settings for styling.
- **No flash on start:** `src/main.js` calls `applySettings()` before mounting the app.
- **Calm mode:** `calm: null` means "not chosen", and then the device's reduced-motion setting
  decides. When on, `src/app.css` turns off every transition and animation with `!important`.
- **Fonts:** Atkinson Hyperlegible and OpenDyslexic come from `@fontsource` packages (latin, weights
  400 and 700 only). `vite.config.js` precaches `woff2` so they work offline: 270,368 bytes total.
- **Read-aloud:** `src/lib/speech.svelte.js` wraps the browser's `speechSynthesis`. Local voices are
  listed first and labelled "(works offline)". With no `speechSynthesis`, the read button is hidden.

## Where to start when it breaks

| Symptom | Look at |
|---|---|
| A setting does nothing | `applySettings()` and the matching variable in `src/app.css` |
| Settings lost on reload | the `console.warn` from `load()`/`save()`; private browsing blocks storage |
| Font wrong offline | `globPatterns` in `vite.config.js` and the font imports in `src/main.js` |
| Nothing is read aloud | `speechSupported` and the device's installed voices |

## Checked

`docs/generated/issue-6/verify.mjs` (needs `npx vite preview --port 4173` running and
playwright-core at `/tmp/pwtool`) asserts persistence, calm-mode defaults, corrupt-storage
recovery, read-aloud with a stubbed voice, and fonts offline. Last run 2026-10-03:
`ALL ASSERTIONS PASSED`. Real device voices were not tested from the cloud.
