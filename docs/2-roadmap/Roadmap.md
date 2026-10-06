# Roadmap (tier 2)

Defines what 0–100% means. Scope comes from issue #1; the shaping choices were made by the owner
on 2026-10-03 and are recorded in [`../6-decisions/Decisions.md`](../6-decisions/Decisions.md).
A milestone is done when its **Acceptance** has actually been checked, not when the code exists.

## What the finished product is

A free, installable, fully offline web app (PWA) that teaches programming fundamentals to complete
beginners who learn by seeing — written with ADHD and other learning differences in mind. Every
concept is shown first as a language-neutral, step-through visual, then in Python, with each
claim linked to the official Python documentation. Learners break a task into small steps, write
real Python that runs in the browser, and prove it works. The aim is that they can then direct an
AI agent well and fix things when they break.

Fixed constraints: free to use and host, no paid upkeep, open-source tools, no server.

Progress is rewarded in a way that only ever adds: picking up where you left off, a finish screen
per lesson, real counts (programs run, errors fixed) instead of XP, skills earned by proof, a
"days learned" count instead of a resetting streak, and a course map. No leaderboards, lives,
timers or streak resets. Progress lives on the device only. Full plan:
[`../plans/gamification.md`](../plans/gamification.md).

## Milestones

### M1 — Foundations (10%)

**Is:** the empty app exists, installs, and works offline.
**Contains:** Svelte + Vite project; PWA manifest and service worker (`vite-plugin-pwa`); deploy
to GitHub Pages via GitHub Actions; the accessibility settings shell (calm mode, reduced motion,
dyslexia-friendly text, read-aloud) with settings saved on the device; one placeholder lesson
screen.
**Acceptance:** opened from the GitHub Pages URL on a phone, the app installs to the home screen,
then opens and shows the placeholder lesson with the network switched off. Each accessibility
setting visibly changes the placeholder screen and survives a restart.

### M2 — Concept model and first lesson: breaking a task into steps (25%)

**Is:** one concept taught end to end, built on a format every later lesson reuses.
**Contains:** the hand-authored, language-neutral lesson format (one idea per screen); a renderer
that turns it into a step-through visual; the first lesson, "breaking a task into steps", taught
with no code at all. Gamification starts here: every lesson file has a fixed `id`; progress is
saved on the device (localStorage key `ajs-progress-v1`, checked field by field on load); the app
reopens on the lesson and screen you left; each lesson ends on a finish screen; a "Celebrations"
setting (Off, Quiet by default, Lively), which calm mode holds at Quiet.
**Acceptance:** a complete beginner can work through the lesson one screen at a time, read aloud
works on every screen, calm mode removes all motion, and the lesson file contains no
Python-specific content (checked by reading it). Closed mid-lesson and reopened offline, the app
opens on the same screen; with calm mode on, the finish screen has no motion.

### M3 — Python runs in the app, and the source registry (20%)

**Is:** learners write real Python and the app cites official docs.
**Contains:** Pyodide (Python in the browser) cached for offline use; a small code box that runs
the learner's code and shows output and errors in plain English; the source registry, limited to
official Python documentation (docs.python.org); lessons link each claim to a registry entry;
counts of programs run and errors fixed; the skills "First program ran" and "Fixed your first
error".
**Acceptance:** with the network off, a learner runs `print("hello")` and sees the output; a
deliberate error shows a plain-English explanation; every registry entry resolves to a page on
docs.python.org. Running `print("hello")` offline earns "First program ran" once, and it survives
a restart.

### M4 — The fundamentals (30%)

**Is:** enough concepts to build something small.
**Contains (proposed order — owner to confirm):** breaking tasks into steps (M2), sequence
(code runs top to bottom), variables and values, types, input and output, if/else decisions,
loops, functions, lists and dictionaries, reading errors and debugging, classes and objects,
splitting code into files (modules). Also: the course map (every concept as a stop, finished
ones ticked, the next one highlighted); one skill per concept; the "days learned" count.
**Acceptance:** each concept has a visual lesson, a Python example that runs offline, and at least
one official-docs citation. Each concept's skill appears on the map after its lesson is finished
and its example run.

### M5 — Build it and prove it works (10%)

**Is:** the learner plans and builds a small program, and the app checks it.
**Contains:** a guided project that starts with breaking the task into steps, then builds each
step; automatic checks that run the learner's code against expected results. Each passing check
ticks its step on screen; finishing earns "Built and proved it".
**Acceptance:** a learner who has done M4 completes the guided project, and the checks report
pass/fail per step. A step's tick appears only when its check passes.

### M6 — Release (5%)

**Is:** public and usable by strangers.
**Contains:** an accessibility review against WCAG 2.2 AA; a short "how to install" page; first
outside testers; save and load a progress backup file (the only way to move progress to a new
phone without a server). The accessibility review covers finish screens and the map.
**Acceptance:** a backup saved on one phone and loaded on another restores the same map.
TODO — who the first outside testers are is not yet decided.

## Later, not in 0–100%

- More languages (JavaScript next is the natural candidate; it runs in the browser natively).
- Reading code the learner pastes in and visualising it (needs a parser per language).
- Design patterns and conventions beyond the fundamentals.
