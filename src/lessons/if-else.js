export const ifElse = {
  id: 'if-else',
  title: 'If and else: making a choice',
  screens: [
    {
      type: 'text',
      text: 'Code can make a choice. An if asks a question that is either true or false, and runs different lines for each answer.',
    },
    {
      type: 'slider',
      intro: 'Move the slider to change the temperature. The lines that run are marked; the skipped lines fade.',
      name: 'temperature',
      min: 0,
      max: 40,
      start: 18,
      code: {
        python: ['temperature = {value}', 'if temperature > 25:', '    print("Wear shorts")', 'else:', '    print("Bring a jumper")'],
        javascript: [
          'let temperature = {value};',
          'if (temperature > 25) {',
          '  console.log("Wear shorts");',
          '} else {',
          '  console.log("Bring a jumper");',
          '}',
        ],
      },
      run(value) {
        const isHot = value > 25;
        return {
          lines: isHot ? [0, 1, 2] : [0, 1, 3, 4],
          output: [isHot ? 'Wear shorts' : 'Bring a jumper'],
          note: isHot
            ? `Is ${value} more than 25? Yes, true. So the if part runs and the else part is skipped.`
            : `Is ${value} more than 25? No, false. So the if part is skipped and the else part runs.`,
        };
      },
    },
    {
      type: 'choice',
      question: 'If the temperature is exactly 25, what is shown? You can check with the slider on the last screen.',
      options: ['Wear shorts', 'Bring a jumper'],
      answer: 1,
      explain: '25 is not more than 25, so "temperature > 25" is false and the else part runs.',
    },
    { type: 'text', text: 'Recap: if checks something true or false. True runs the if part; false runs the else part. Never both.' },
  ],
};
