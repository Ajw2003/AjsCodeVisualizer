# Lesson format and renderer (tier 4)

Built for issue #14 (children #15 to #18). A lesson is a plain JavaScript object in
`src/lessons/`, listed in `LESSONS` (`src/lessons/index.js`). The picker
(`src/lib/LessonPicker.svelte`) lists them; `src/lib/LessonScreen.svelte` shows one screen at a
time.

## Screen types

| Type | What the learner sees | Fields |
|---|---|---|
| `text` | One sentence or two | `text` |
| `trace` | Code with the running line marked ▶, the variables as labelled boxes, the output so far, and a note. "Run next line" steps through. | `intro`, `code`, `steps[]` of `{ line, vars, output, note }` |
| `slider` | A slider for one value; the lines that run are marked ✓, skipped ones – and muted | `intro`, `name`, `min`, `max`, `start`, `code` (with `{value}`), `run(value)` returning `{ lines, output, note }` |
| `choice` | A question, optional code, answer buttons, and an explanation once one is tapped | `question`, `code?`, `options`, `answer`, `explain` |

`code` is `{ python: [...lines], javascript: [...lines] }`. Any other field can also be written
that way when the two languages differ (for example the loop counter, which is 4 in JavaScript
when the loop ends but 3 in Python); `pick(field, language)` resolves it.

## How the steps are produced

Steps are written by hand, not computed by running the code, so lessons work offline before the
Python runner (M3) exists. The risk is a step that lies about what the code does. To catch that,
`docs/generated/issue-14/verify.mjs` runs every code sample with real `python3` and `node` and
compares the output to what the lesson claims, then clicks through every lesson in Chromium at
390px in both languages.

## Accessibility

- Read aloud reads the current note or question (and the explanation once answered), never the
  code.
- The running line is marked with a symbol as well as colour; skipped lines use the muted text
  colour, not transparency, so they keep text contrast.
- Code is always monospace whatever reading font is chosen, and long lines wrap with a hanging
  indent instead of scrolling sideways.
- Calm mode already switches off all motion globally (`src/app.css`).
