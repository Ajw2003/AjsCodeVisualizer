# Roadmap (tier 2)

**Status of this document: draft, not agreed.** The milestones below are drawn from issue #1
only. Their scope and acceptance criteria wait on the open questions at the bottom. Until those
are answered, no percentage here is a commitment.

## What the finished product is (from issue #1)

A free, installable web app that teaches programming fundamentals to people who learn best by
seeing — written with ADHD and other learning differences in mind. It shows *how* and *why* a
concept works with interactive, step-through visuals that are not tied to one language, then
shows the same idea in real languages, citing trusted official documentation. The learner breaks
a task into small steps, builds something, and proves it works. The aim is that they can then
direct an AI agent well and fix things when they break.

Constraints stated in the issue: free to use and to host, no paid upkeep, no reliance on flaky
infrastructure or companies the owner does not trust.

## Milestones (draft)

### M1 — Foundations (10%)

**Is:** the project's shape is decided and the empty app runs.
**Contains:** the decisions log entries for stack, hosting and scope; a repository skeleton; an
installable "hello" PWA that opens offline.
**Acceptance:** TODO — proposed: the app installs on a phone and a desktop browser and opens with
the network switched off. Needs your answer to questions 1–3.

### M2 — Concept model and first visual (25%)

**Is:** one fundamental concept taught end to end.
**Contains:** the language-agnostic concept format; one concept (proposed: variables) shown as an
interactive visual, step by step.
**Acceptance:** TODO — needs the first-concept and audience answers (questions 4–6).

### M3 — Trusted source registry (15%)

**Is:** the vetted list of official documentation sources, and lessons that cite it.
**Contains:** the source list for the first languages; a rule for what counts as trustworthy.
**Acceptance:** TODO — needs questions 7–8.

### M4 — Concept set for the fundamentals (25%)

**Is:** enough concepts to build something small.
**Contains:** TODO — the list of fundamentals, in teaching order.
**Acceptance:** TODO.

### M5 — Build-and-prove project path (15%)

**Is:** the learner breaks a task into steps, builds it, and proves it works.
**Contains:** TODO — depends on whether code runs inside the app (question 9).
**Acceptance:** TODO.

### M6 — Release (10%)

**Is:** public, free, installable.
**Contains:** hosting, accessibility review, first users.
**Acceptance:** TODO.

## Open questions

Being asked in the session that wrote this draft (2026-10-03). Answers land in
[`../6-decisions/Decisions.md`](../6-decisions/Decisions.md) and then reshape this file.

1. Tech stack for the app.
2. Hosting.
3. Must it work fully offline?
4. Who the first learner is.
5. First concept to teach.
6. Visual style and accessibility priorities.
7. Which languages first.
8. What counts as a trustworthy source.
9. Does real code run in the app, or are lessons hand-authored?
