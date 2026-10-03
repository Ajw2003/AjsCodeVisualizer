# Project state (tier 3)

**Headline: about 5%.** As of 2026-10-03 the repository holds a Svelte + Vite app that shows one
placeholder lesson screen (issue #3, `src/lib/LessonScreen.svelte`). It is installable and works
offline (issue #4, `vite.config.js`): in headless Chromium, served from a sub-path like GitHub
Pages, it reported no installability errors and still showed the lesson after a reload with the
network off. A deploy workflow (issue #5, `.github/workflows/deploy-pages.yml`) publishes it to
GitHub Pages on every push to `main`. Its first run (run 37150789202, after PR #8 merged) finished
with `success`. The live site has not been opened from here (the cloud proxy blocks github.io);
the owner checks it on their Android phone.

| Milestone | Weight | Status |
|---|---|---|
| M1 Foundations | 10% | In progress — #3, #4, #5 built and deployed (PR #8); phone check by owner pending; #6 settings to do |
| M2 First lesson: breaking a task into steps | 25% | Not started |
| M3 Python in the app + source registry | 20% | Not started |
| M4 The fundamentals | 30% | Not started — concept list proposed, owner to confirm |
| M5 Build it and prove it works | 10% | Not started |
| M6 Release | 5% | Not started — acceptance has a TODO (who the outside testers are) |

## The one thing that is not what it looks like

M4's concept list reads like a settled curriculum. It is a proposal written on 2026-10-03 and has
not been confirmed by the owner.

## Cross-cutting issues that belong to no milestone

- Accessibility runs through every milestone. M1 builds the settings; every later lesson must
  honour them, and nothing yet checks that automatically.
- Offline install size: Pyodide adds several megabytes. Not measured yet (M3).
- The owner works from a phone only for now, so every check is run in the cloud and on the
  deployed GitHub Pages site, not on a local machine. See
  [`../example-environment.md`](../example-environment.md).
