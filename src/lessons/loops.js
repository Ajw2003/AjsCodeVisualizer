export const loops = {
  id: 'loops',
  title: 'Loops: doing it again',
  screens: [
    { type: 'text', text: 'A loop runs the same lines again and again, so you do not have to write them out each time.' },
    {
      type: 'trace',
      intro: 'Press "Run next line" and watch count go up and the output grow.',
      code: {
        python: ['for count in range(1, 4):', '    print("Lap", count)', 'print("Done")'],
        javascript: ['for (let count = 1; count <= 3; count++) {', '  console.log("Lap", count);', '}', 'console.log("Done");'],
      },
      steps: [
        {
          line: 0,
          vars: { count: 1 },
          output: [],
          note: {
            python: 'range(1, 4) counts 1, 2, 3. It stops before 4. count starts at 1.',
            javascript: 'count starts at 1. The loop keeps going while count <= 3 is true.',
          },
        },
        { line: 1, vars: { count: 1 }, output: ['Lap 1'], note: 'The inside of the loop runs. It shows Lap 1.' },
        { line: 0, vars: { count: 2 }, output: ['Lap 1'], note: 'Back to the top. count goes up to 2, so the loop goes round again.' },
        { line: 1, vars: { count: 2 }, output: ['Lap 1', 'Lap 2'], note: 'The same line runs again, now with count as 2.' },
        { line: 0, vars: { count: 3 }, output: ['Lap 1', 'Lap 2'], note: 'Back to the top. count goes up to 3. One more time round.' },
        { line: 1, vars: { count: 3 }, output: ['Lap 1', 'Lap 2', 'Lap 3'], note: 'It shows Lap 3.' },
        {
          line: 0,
          vars: { count: { python: 3, javascript: 4 } },
          output: ['Lap 1', 'Lap 2', 'Lap 3'],
          note: {
            python: 'range(1, 4) has no numbers left after 3, so the loop stops.',
            javascript: 'count goes up to 4. Is 4 <= 3? No, false, so the loop stops.',
          },
        },
        {
          line: { python: 2, javascript: 3 },
          vars: { python: { count: 3 }, javascript: {} },
          output: ['Lap 1', 'Lap 2', 'Lap 3', 'Done'],
          note: {
            python: 'The line after the loop runs once, after the loop has finished.',
            javascript: 'The line after the loop runs once. count was made by the loop, so its box is gone now.',
          },
        },
      ],
    },
    {
      type: 'choice',
      question: 'How many times does this show "Lap"?',
      code: {
        python: ['for count in range(1, 6):', '    print("Lap", count)'],
        javascript: ['for (let count = 1; count <= 5; count++) {', '  console.log("Lap", count);', '}'],
      },
      options: ['4', '5', '6'],
      answer: 1,
      explain: {
        python: 'range(1, 6) counts 1, 2, 3, 4, 5. It stops before 6, so that is 5 laps.',
        javascript: 'count goes 1, 2, 3, 4, 5. At 6, count <= 5 is false and the loop stops: 5 laps.',
      },
    },
    { type: 'text', text: 'Recap: a loop repeats the lines inside it. Something, like a counter, decides when it stops.' },
  ],
};
