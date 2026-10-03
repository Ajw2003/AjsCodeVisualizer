# Systems index (tier 4)

**No system is built yet.** The repository holds only a README and these docs (as of 2026-10-03,
commit `620d564`). There is no code for a system document to describe, so none has been written.
Writing "how it works" for code that does not exist would be guessing, and a guess here gets cited
as fact later.

## Candidate systems (from issue #1, not yet decided)

These are the parts issue #1 implies. Each becomes a system document here once it exists in code
and passes the test "if this is wrong, does the product stop working?"

| Candidate | What it would own | Source in issue #1 |
|---|---|---|
| Source registry | The vetted list of official, trustworthy documentation sources per language, and how lessons cite them | "compile a database of known trustworthy and reliable sources" |
| Concept model | A language-agnostic description of a concept (variable, function, class, loop, a design pattern) that every visual is drawn from | "language-agnostic code visualiser" |
| Visualisation pipeline | Turning a concept (or a piece of code) into an interactive, step-through visual | "pipeline to create visual and interactive representations" |
| App shell | The installable offline web app (PWA): install, offline cache, navigation, saved progress | "installable PWA web app" |

Which of these are real systems, and whether the pipeline reads real code or hand-authored lesson
data, depends on the open questions in [`../2-roadmap/Roadmap.md`](../2-roadmap/Roadmap.md).

## Considered and left out

None yet.
