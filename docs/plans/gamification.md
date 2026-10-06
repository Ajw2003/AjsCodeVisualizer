# Gamification plan (accepted 2026-10-05)

The owner accepted this as written on 2026-10-05, with the recommended answer to all three
choices at the bottom. The milestone pieces are folded into
[`../2-roadmap/Roadmap.md`](../2-roadmap/Roadmap.md); the choice is logged in
[`../6-decisions/Decisions.md`](../6-decisions/Decisions.md).

## What I checked

- No XP, streaks, badges, rewards or points exist in `src/` or `docs/` (searched 2026-10-05,
  `main` at `e6a8671`).
- The roadmap's fixed constraints: free, offline after install, no server
  (`docs/2-roadmap/Roadmap.md`, "What the finished product is").
- Settings already save on the device: `src/lib/settings.svelte.js` stores them in localStorage
  key `ajs-settings-v1` and checks each field on load so one bad value can't wipe the rest.
  Progress can copy that exact pattern.
- The lesson screen already shows "Step N of M" and a progress bar
  (`src/lib/LessonScreen.svelte`), but forgets where you were on reload.

## The rule behind every choice

Reward showing up and finishing small things. Never punish stopping.

ADHD brains get a lot from visible, quick wins, and are hurt by anything that turns a missed day
into a loss. So every mechanic below only ever adds. Nothing resets, expires, counts down or
compares you to anyone.

## The mechanics

1. **Pick up where you left off.** The app remembers the lesson and screen you were on and opens
   there with "Welcome back. You were on step 4 of Loops." This is the single biggest win for an
   ADHD learner: restarting is the hardest part, so the app makes it one tap.
2. **A finish screen for every lesson.** A short recap ("You split making tea into 3 steps"), one
   line saying what's next, and a tick added to the map. Read aloud reads it like any other screen.
3. **Real counts instead of XP.** Show things that actually happened: lessons finished, programs
   you ran, errors you fixed. A made-up points number means nothing to a beginner and invites
   grinding; "You've fixed 12 errors" is true and builds confidence.
4. **Skills earned (badges), tied to proof.** One per concept, earned by finishing its lesson and
   running its example, plus a few milestones: "First program ran", "Fixed your first error",
   "Planned before coding", "Built and proved it". Fixing an error is celebrated on purpose, so
   mistakes feel like progress.
5. **A gentle "days learned" count instead of a streak.** "You learned on 3 days this week" and a
   running total. It never drops to zero and never says you broke anything. No daily nagging.
6. **A map of the course.** One screen showing every concept as a stop on a path, with finished
   ones ticked and the next one highlighted. It shows how far you've come and what one thing is
   next.
7. **A "Celebrations" setting.** Off, Quiet (default: a tick and a short line of text) or Lively
   (a small animation). Calm mode forces Quiet whatever this says, so it never adds motion.

### Deliberately left out

| Left out | Why |
|---|---|
| Streaks that reset | Losing a streak is a common reason ADHD learners quit an app for good. |
| Leaderboards | They need a server, and comparing yourself to strangers hurts beginners. |
| Hearts or lives | Punishes the mistakes the course wants you to make and learn from. |
| Timers and countdowns | Adds pressure; time blindness makes them stressful, not motivating. |
| Random rewards or loot boxes | Built to be compulsive, not to help you learn. |
| Push reminders | Need a server to send them; nagging also works against calm mode. |

## Where it slots into M2 to M6

No new milestone and no change to the percentage weights. Each piece lands where the thing it
rewards first exists.

| Milestone | Adds | Acceptance gains |
|---|---|---|
| **M2** First lesson | Progress store; pick up where you left off; finish screen; "Celebrations" setting; every lesson file gets a fixed `id` | Close the app mid-lesson, reopen it offline: it opens on the same screen. Calm mode shows no motion on the finish screen. |
| **M3** Python runs | Counts for programs run and errors fixed; "First program ran" and "Fixed your first error" | Running `print("hello")` offline earns "First program ran" once, and it survives a restart. |
| **M4** Fundamentals | The course map; one skill per concept; "days learned" count | Each concept's skill appears on the map after its lesson is finished and its example run. |
| **M5** Build it | Each passing check ticks a step on screen; "Built and proved it" | A step's tick appears only when its check passes. |
| **M6** Release | Save and load a backup file of your progress; the WCAG 2.2 AA review covers finish screens and the map | A backup saved on one phone, loaded on another, restores the same map. |

## How progress is saved on the device

- **Where:** localStorage, a new key `ajs-progress-v1`, beside the settings key. No server, no
  account. The whole record is a few kilobytes even after the full course.
- **Shape:**

  ```json
  {
    "lessons": { "steps-tea": { "screen": 3, "finishedOn": "2026-10-05" } },
    "skills": { "first-run": "2026-10-06" },
    "counts": { "runs": 14, "errorsFixed": 5 },
    "days": ["2026-10-05", "2026-10-06"]
  }
  ```

- **Checked on load, field by field,** exactly like `validate()` in `settings.svelte.js`: an
  unknown lesson id or a corrupt value is dropped on its own and logs a warning, the rest is kept.
- **Kept safe from clean-up:** the app asks the browser to keep its storage
  (`navigator.storage.persist()`), so the phone is less likely to clear it when space runs low.
  If the browser says no, the app still works; it just shows the backup option sooner.
- **Backup (M6):** "Save my progress" downloads a small `.json` file; "Load progress" reads one
  back through the same checks. This is the only way to move progress to a new phone without a
  server, and it covers clearing the browser's data.
- **Reset:** "Reset progress" in Settings, with a confirm step, separate from resetting settings.

## Choices made

The owner took the recommended answer for each on 2026-10-05.

1. **Streaks:** gentle "days learned" count (recommended), classic streak, or none at all.
2. **Points:** real counts, no XP (recommended), or add an XP number as well.
3. **When it starts:** with M2 (recommended, because "pick up where you left off" needs the
   lesson format to have ids from day one), or held until after M4.
