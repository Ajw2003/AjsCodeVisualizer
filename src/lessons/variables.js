export const variables = {
  id: 'variables',
  title: 'Variables: named boxes',
  screens: [
    { type: 'text', text: 'A variable is a named box that holds a value. You give it a name so you can use the value later.' },
    {
      type: 'trace',
      intro: 'Press "Run next line" to run the code one line at a time. Watch the box.',
      code: {
        python: ['score = 5', 'score = score + 1', 'print(score)'],
        javascript: ['let score = 5;', 'score = score + 1;', 'console.log(score);'],
      },
      steps: [
        { line: null, vars: {}, output: [], note: 'Nothing has run yet, so there are no boxes.' },
        { line: 0, vars: { score: 5 }, output: [], note: 'This line makes a box called score and puts 5 in it.' },
        {
          line: 1,
          vars: { score: 6 },
          output: [],
          note: 'The right side is worked out first: score is 5, and 5 + 1 is 6. Then 6 replaces what was in the box.',
        },
        { line: 2, vars: { score: 6 }, output: ['6'], note: 'This shows what is in the box right now: 6.' },
      ],
    },
    {
      type: 'choice',
      question: 'What does this code show?',
      code: {
        python: ['a = 3', 'b = a', 'a = 10', 'print(b)'],
        javascript: ['let a = 3;', 'let b = a;', 'a = 10;', 'console.log(b);'],
      },
      options: ['3', '10', '13'],
      answer: 0,
      explain: 'b was given a copy of the value 3. Putting 10 in a later does not change what is in b.',
    },
    { type: 'text', text: 'Recap: a variable is a name for a value. Giving it a new value replaces the old one.' },
  ],
};
