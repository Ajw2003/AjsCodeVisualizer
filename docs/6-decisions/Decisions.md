# Decisions log (tier 6)

Dated, append-only. Newest entry at the top. An entry is never rewritten; a later entry that
replaces it flips its `Status` line to `Superseded` with a pointer.

## 2026-10-03 — Use the six-tier documentation layout

**Context.** Issue #1 asks to initialise the repository and decide the project's shape. The
repository was empty apart from a README.

**Decision.** Documentation lives in `docs/` in six tiers (landing, roadmap, state, systems,
today, decisions), with `plans/`, `archive/` and `generated/` alongside.

**Why.** It is the owner's standing house rule for every project. No alternative was weighed.

**Status.** Standing.
