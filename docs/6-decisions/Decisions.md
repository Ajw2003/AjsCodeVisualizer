# Decisions log (tier 6)

Dated, append-only. Newest entry at the top. An entry is never rewritten; a later entry that
replaces it flips its `Status` line to `Superseded` with a pointer.

## 2026-10-05 — Example lessons show code in Python and JavaScript

**Context.** The project's setup card asked for example lessons for foundational concepts "in a
few languages". The 2026-10-03 shape decision said Python only, others later, with JavaScript as
the natural next one.

**Decision.** The owner chose Python + JavaScript (2026-10-05, decision card in the project
thread). Each code screen has a Python / JavaScript switch, saved on the device with the other
settings. The visual (boxes, highlighted lines, output) is shared; a lesson field can differ per
language where the languages genuinely differ (`src/lessons/index.js`, `pick()`).

**Why.** JavaScript runs in the browser natively, and seeing one idea in two languages shows it
is not tied to either. Offered alternatives were Python only, or adding a plain-English version
too. Running learner code (M3) is still Python first; this decision covers showing code.

**Status.** Standing. Supersedes the "First language: Python only" bullet of
[2026-10-03 — Project shape](#2026-10-03--project-shape-what-for-whom-built-with-what) for
lesson code shown on screen.

## 2026-10-03 — Reading fonts: Atkinson Hyperlegible and OpenDyslexic

**Context.** Issue #6 asks for a dyslexia-friendly font choice. Every bundled font adds to the
offline download.

**Decision.** The owner chose: device default, Atkinson Hyperlegible, and OpenDyslexic, from the
`@fontsource` packages (OFL-1.1), latin subset, weights 400 and 700. Measured cost: 270,368 bytes
of woff2 (OpenDyslexic about 236 kB of that).

**Why.** Atkinson is small and built for legibility; OpenDyslexic is the font many dyslexic
readers ask for by name. Offered alternatives were Atkinson only, or device fonts only.

**Status.** Standing.

## 2026-10-03 — Ship i-have-adhd as a project skill instead of a plugin

**Context.** The owner reported that `/i-have-adhd` did not appear in a new session. Cause found:
new sessions start from `main`, and `main` held only `README.md` (`git ls-tree origin/main`,
checked 2026-10-03). The plugin setting existed only on branch `claude/bold-ride-pnxpvx`.

**Decision.** The skill file is now committed directly, as `.claude/skills/i-have-adhd/SKILL.md`
(an unmodified copy of ayghri/i-have-adhd `skills/i-have-adhd/SKILL.md` at commit `839872f`),
with its MIT `LICENSE` beside it. The plugin entry in `.claude/settings.json` was removed and
that file deleted. The skill reaches new sessions only once this branch is merged into `main`.

**Why.** A project skill is read straight from the repository; a plugin also has to be
downloaded from its marketplace when the session starts, which is one more thing that can fail
in a fresh cloud container. Keeping both would leave two copies to drift apart. Cost: upstream
updates are no longer automatic. To update, re-copy the file from the upstream repo.

**Status.** Standing.

## 2026-10-03 — Install the i-have-adhd Claude Code plugin, project-wide

**Context.** The owner asked to install the `i-have-adhd` plugin (ayghri/i-have-adhd, v0.3.0,
commit `839872f`), following that repo's `AGENTS.md`, which points to the Claude Code route in
its `INSTALL.md`.

**Decision.** Installed at **project** scope: `.claude/settings.json` enables
`i-have-adhd@i-have-adhd` and declares its GitHub marketplace. It is on-demand: type
`/i-have-adhd` to turn it on, and "stop adhd mode" to turn it off. Always-on (the
`~/.claude/.i-have-adhd-always` flag) was not turned on.

**Why.** The owner works from a phone only, so the cloud container is their environment.
User-scope settings live in the container and are lost when it is reclaimed; project settings
are committed and travel with the repository. Before installing, the plugin's only hook
(`hooks/always-on.mjs`) was read: it checks for the opt-in flag file and prints the skill text.
It makes no network calls and writes no files.

**Status.** Superseded by [2026-10-03 — Ship i-have-adhd as a project skill instead of a plugin](#2026-10-03--ship-i-have-adhd-as-a-project-skill-instead-of-a-plugin) on 2026-10-03.

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
