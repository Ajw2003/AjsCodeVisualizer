// Lesson format. A lesson is { id, title, screens }. Each screen is one idea:
//   { type: 'text', text }
//   { type: 'trace', intro, code, steps: [{ line, vars, output, note }] }
//       line: index into code (null = nothing run yet); vars: { name: value }; output: lines shown so far.
//   { type: 'slider', intro, name, min, max, start, code, run(value) => { lines, output, note } }
//       code lines may contain {value}; lines: indexes that run for that value.
//   { type: 'choice', question, code?, options, answer, explain }
// Any field may instead be { python, javascript } when the two languages differ; see pick().
import { steps } from './steps.js';
import { variables } from './variables.js';
import { ifElse } from './if-else.js';
import { loops } from './loops.js';

export const LESSONS = [steps, variables, ifElse, loops];

/** Returns the value for one language when a field is written per language, else the field itself. */
export function pick(field, language) {
  return field && typeof field === 'object' && 'python' in field && 'javascript' in field ? field[language] : field;
}
