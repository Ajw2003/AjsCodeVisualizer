# Today — 2026-10-03 (tier 5)

**A documentation day.** Working from issue #1.

## Done

- Read issue #1 and the repository (a one-line README, nothing else).
- Scaffolded the six documentation tiers.
- Asked the owner the questions that shape the project; recorded the answers in
  `6-decisions/Decisions.md` and turned the roadmap from a draft into milestones with acceptance
  criteria.
- Opened GitHub issues for M1: #2 (parent) and #3–#6 (one per step).
- Added the i-have-adhd skill as a project skill (`.claude/skills/i-have-adhd/`), after the plugin
  route failed to reach new sessions. Opened for merge as PR #7.
- Issue #3: Svelte + Vite app with one placeholder lesson screen (3 tea-making steps, a "Next"
  button, a progress bar). Build passes; screenshots at 390px (light) and 360px (dark) are in
  `generated/issue-3/`.
- Issue #4: installable and offline via `vite-plugin-pwa` (14 files precached, 42.78 KiB).
  Offline reload passed in headless Chromium; screenshot in `generated/issue-4/`.
- Issue #5: GitHub Actions workflow that builds and publishes to GitHub Pages on push to `main`.
  Action inputs checked against each action's `action.yml` at the pinned major version; the
  workflow itself first runs after merge.
- PR #8 merged; the first Pages deploy run finished with `success`.
- Owner confirmed: the live app installs and works offline on their Samsung Galaxy S26.
- Closed #3, #4, #5 (owner asked).
- Issue #6: settings screen (calm mode, Atkinson Hyperlegible / OpenDyslexic, size, spacing,
  read-aloud). Fonts add 270,368 bytes to the offline download. All checks in
  `generated/issue-6/verify.mjs` passed.

- Owner's phone check of #6 found three bugs; opened #10, #11, #12 and fixed them. Each fix's
  test was shown failing on the old code first, then passing.

## Deliberately not done

- M4's concept order is proposed, not confirmed.

## Surfaced, not today's job

- Licensing when quoting docs.python.org: linking is fine; quoting needs checking in M3.
- Who the first outside testers are (M6).

## Next, in order

1. Owner reviews the roadmap and confirms or reorders the M4 concept list.
2. Owner merges the bug-fix PR, then on the S26: Settings opens, read-aloud reads one step,
   and a later deploy shows up after switching away from the app and back.
