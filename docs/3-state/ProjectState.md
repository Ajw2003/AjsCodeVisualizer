# Project state (tier 3)

**Headline: about 10% (M1 built).** As of 2026-10-03 the repository holds a Svelte + Vite app that shows one
placeholder lesson screen (issue #3, `src/lib/LessonScreen.svelte`). It is installable and works
offline (issue #4, `vite.config.js`): in headless Chromium, served from a sub-path like GitHub
Pages, it reported no installability errors and still showed the lesson after a reload with the
network off. A deploy workflow (issue #5, `.github/workflows/deploy-pages.yml`) publishes it to
GitHub Pages on every push to `main`. Its first run (run 37150789202, after PR #8 merged) finished
with `success`. The owner confirmed on 2026-10-03 that the live site installs and works offline on
their Samsung Galaxy S26 (Android), and shows the lesson in a desktop browser. Accessibility
settings (issue #6) pass `docs/generated/issue-6/verify.mjs` and were deployed (PR #9, run
37152045069, `success`); on the owner's S26, Settings did nothing
(fixed in #10), read-aloud read the whole page (fixed in #11), and updates took 10+ minutes
(fixed in #12); those fixes merged in PR #13.

On 2026-10-05 a draft (issue #14) added a lesson picker, a lesson format with step-through code,
and three example lessons (variables, if/else, loops) shown in Python or JavaScript. Every code
sample's output was checked against real `python3` and `node`, and every lesson clicked through
in Chromium (`docs/generated/issue-14/verify-output.txt`). It is not merged or phone-checked yet.

| Milestone | Weight | Status |
|---|---|---|
| M1 Foundations | 10% | In progress — #3–#5 deployed and phone-checked; #6 deployed; bugs #10–#12 fixed, awaiting merge and phone check |
| M2 First lesson: breaking a task into steps | 25% | Lesson format drafted in #14 (not merged); the steps lesson itself not started |
| M3 Python in the app + source registry | 20% | Not started |
| M4 The fundamentals | 30% | Example lessons for variables, if/else, loops drafted in #14 (no Python runner or doc citations yet) |
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
