# Project state (tier 3)

**Headline: 0%.** As of 2026-10-03 the repository holds a one-line `README.md` and this
documentation. No code. The roadmap's shape is decided (see
[`../6-decisions/Decisions.md`](../6-decisions/Decisions.md)); building has not started.

| Milestone | Weight | Status |
|---|---|---|
| M1 Foundations | 10% | Not started — issues #2 to #6 opened, ready to build |
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
