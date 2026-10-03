# Decisions log (tier 6)

Dated, append-only. Newest entry at the top. An entry is never rewritten; a later entry that
replaces it flips its `Status` line to `Superseded` with a pointer.

## 2026-10-03 — Project shape: what, for whom, built with what

**Context.** Issue #1 asked to decide the project's shape. The owner answered a set of questions
in the session that scaffolded these docs.

**Decision.**
- **Audience:** complete beginners first (never written code).
- **Lessons:** hand-authored in a language-neutral format. The app does not read pasted code yet.
- **Running code:** yes, in the browser. Python via Pyodide.
- **First language:** Python only. Others later.
- **First lesson:** breaking a task into steps — before any syntax.
- **Stack:** Svelte + Vite, PWA via `vite-plugin-pwa`.
- **Hosting:** GitHub Pages, deployed by GitHub Actions.
- **Offline:** fully offline after install, including the Python runner.
- **Trusted sources:** official language documentation only (for Python, docs.python.org).
- **Accessibility from the first version:** one idea per screen, calm/reduced-motion mode,
  dyslexia-friendly text controls, read-aloud with the browser's built-in voices.

**Why.** Hand-authored lessons and one language keep the first version small and reliable;
reading arbitrary code needs a parser per language and was rejected for now. Svelte was chosen
over React (heavier bundles) and plain JS (more hand-work as it grows); small bundles matter
because Pyodide adds several megabytes to the offline install (exact size unmeasured; to be
measured in M3). GitHub Pages over Codeberg
Pages for its built-in deploy from this repository. "Official docs only" over adding standards
bodies or community sources because it needs no review process. Starting with decomposition
follows issue #1's emphasis on breaking tasks into smaller steps. Every tool named is open source
and free.

**Status.** Standing.

## 2026-10-03 — Use the six-tier documentation layout

**Context.** Issue #1 asks to initialise the repository and decide the project's shape. The
repository was empty apart from a README.

**Decision.** Documentation lives in `docs/` in six tiers (landing, roadmap, state, systems,
today, decisions), with `plans/`, `archive/` and `generated/` alongside.

**Why.** It is the owner's standing house rule for every project. No alternative was weighed.

**Status.** Standing.
