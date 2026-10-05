# Systems index (tier 4)

**Built systems:** [Accessibility settings](AccessibilitySettings.md) (issue #6),
[App updates](AppUpdates.md) (issue #12) and [Lesson format and renderer](LessonFormat.md)
(issue #14, example lessons; on a branch awaiting merge as of 2026-10-05).
Writing "how it works" for code that does not exist would be guessing, and a guess here gets cited
as fact later.

## Planned systems (shape decided 2026-10-03, none built)

Each becomes a system document here once it exists in code and passes the test "if this is
wrong, does the product stop working?" Decisions behind them: [`../6-decisions/Decisions.md`](../6-decisions/Decisions.md).

| Planned system | What it will own | Milestone |
|---|---|---|
| App shell | Install, offline cache (service worker), navigation, accessibility settings saved on the device | M1 |
| Lesson format and renderer | Built as a draft: see [LessonFormat.md](LessonFormat.md) | M2 |
| Python runner | Running learner code offline with Pyodide, and explaining errors in plain English | M3 |
| Source registry | The list of official documentation pages lessons cite (Python: docs.python.org only) | M3 |
| Progress checks | Running a learner's program against expected results, step by step | M5 |

## Considered and left out

- **Code reader** (parse code the learner pastes in and visualise it) — deferred: needs a
  parser per language. Lessons are hand-authored instead.
- **Server or database** — none: the app is static and stores progress on the device.
