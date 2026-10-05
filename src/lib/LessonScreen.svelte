<script>
  import { speech, speechSupported, readAloud, stopReading } from './speech.svelte.js';
  import { settings, update, LANGUAGES } from './settings.svelte.js';
  import { pick } from '../lessons/index.js';
  import CodeView from './CodeView.svelte';

  let { lesson, onsettings, onlessons } = $props();
  let index = $state(0);
  // Per-screen state, reset whenever the screen changes.
  let traceStep = $state(0);
  let sliderValue = $state(0);
  let chosen = $state(null);

  const screens = $derived(lesson.screens);
  const total = $derived(screens.length);
  const last = $derived(index === total - 1);
  const screen = $derived(screens[index]);
  const lang = $derived(settings.language);
  const code = $derived(screen.code ? pick(screen.code, lang) : null);

  const step = $derived(screen.type === 'trace' ? screen.steps[traceStep] : null);
  const vars = $derived(step ? pick(step.vars, lang) : {});
  const traceDone = $derived(screen.type !== 'trace' || traceStep === screen.steps.length - 1);
  const result = $derived(screen.type === 'slider' ? screen.run(sliderValue) : null);
  const sliderCode = $derived(
    screen.type === 'slider' ? code.map((line) => line.replace('{value}', String(sliderValue))) : null,
  );

  // What read-aloud says: only the idea currently on screen, never the code itself.
  const spoken = $derived.by(() => {
    if (screen.type === 'text') return screen.text;
    if (screen.type === 'trace') return pick(step.note, lang);
    if (screen.type === 'slider') return pick(result.note, lang);
    const answer = chosen === null ? '' : ` ${chosen === screen.answer ? 'Right.' : 'Not quite.'} ${pick(screen.explain, lang)}`;
    return pick(screen.question, lang) + answer;
  });

  function showScreen(i) {
    index = i;
    traceStep = 0;
    chosen = null;
    if (screens[i].type === 'slider') sliderValue = screens[i].start;
    // Old speech would describe something that is no longer on screen.
    if (speech.speaking) stopReading();
  }

  function advance() {
    if (!traceDone) {
      traceStep += 1;
      if (speech.speaking) stopReading();
      return;
    }
    showScreen(last ? 0 : index + 1);
  }

  function toggleReading() {
    if (speech.speaking) stopReading();
    else readAloud(spoken);
  }
</script>

<section>
  <header>
    <h1>{lesson.title}</h1>
    <div class="actions">
      <button type="button" class="secondary" onclick={onlessons}>All lessons</button>
      <button type="button" class="secondary" onclick={onsettings}>Settings</button>
    </div>
  </header>

  <p class="progress-text">Step {index + 1} of {total}</p>
  <!-- Bar reinforces the text above; the text carries the meaning. -->
  <div
    class="track"
    role="progressbar"
    aria-label="Lesson progress"
    aria-valuemin="1"
    aria-valuemax={total}
    aria-valuenow={index + 1}
    aria-valuetext="Step {index + 1} of {total}"
  >
    <div class="fill" style="width: {((index + 1) / total) * 100}%"></div>
  </div>

  {#if code}
    <fieldset class="language">
      <legend>Show the code in</legend>
      {#each Object.entries(LANGUAGES) as [id, label] (id)}
        <label>
          <input type="radio" name="language" value={id} checked={lang === id} onchange={() => update({ language: id })} />
          {label}
        </label>
      {/each}
    </fieldset>
  {/if}

  {#if screen.type === 'text'}
    <!-- aria-live so screen readers announce the new step after the button press.
         The keyed span only restarts the fade; the live paragraph itself stays put. -->
    <p class="idea" aria-live="polite">{#key index}<span class="fade">{screen.text}</span>{/key}</p>
  {:else if screen.type === 'trace'}
    <p class="intro">{screen.intro}</p>
    <CodeView lines={code} current={pick(step.line, lang)} />
    <div class="state">
      <div>
        <h2>Boxes</h2>
        {#if Object.keys(vars).length === 0}
          <p class="empty">No boxes right now</p>
        {:else}
          <dl class="boxes">
            {#each Object.entries(vars) as [name, value] (name)}
              <div class="box"><dt>{name}</dt><dd>{pick(value, lang)}</dd></div>
            {/each}
          </dl>
        {/if}
      </div>
      <div>
        <h2>Output</h2>
        <pre class="output">{step.output.join('\n') || ' '}</pre>
      </div>
    </div>
    <p class="note" aria-live="polite">{pick(step.note, lang)}</p>
    <p class="progress-text">Code step {traceStep + 1} of {screen.steps.length}</p>
  {:else if screen.type === 'slider'}
    <p class="intro">{screen.intro}</p>
    <label class="slider-label" for="slider">{screen.name}: <strong>{sliderValue}</strong></label>
    <input id="slider" type="range" min={screen.min} max={screen.max} bind:value={sliderValue} />
    <CodeView lines={sliderCode} ran={result.lines} faded={sliderCode.map((_, i) => i).filter((i) => !result.lines.includes(i))} />
    <h2>Output</h2>
    <pre class="output">{result.output.join('\n')}</pre>
    <p class="note" aria-live="polite">{pick(result.note, lang)}</p>
  {:else if screen.type === 'choice'}
    <p class="intro">{pick(screen.question, lang)}</p>
    {#if code}<CodeView lines={code} />{/if}
    <div class="options">
      {#each screen.options as option, i (i)}
        <button
          type="button"
          class="secondary option"
          class:right={chosen !== null && i === screen.answer}
          class:wrong={chosen === i && i !== screen.answer}
          aria-pressed={chosen === i}
          onclick={() => (chosen = i)}
        >{option}{chosen !== null && i === screen.answer ? ' ✓' : chosen === i ? ' ✗' : ''}</button>
      {/each}
    </div>
    <p class="note" aria-live="polite">
      {#if chosen !== null}
        <strong>{chosen === screen.answer ? 'Right.' : 'Not quite.'}</strong> {pick(screen.explain, lang)}
      {/if}
    </p>
  {/if}

  {#if speechSupported}
    <button type="button" class="secondary read" onclick={toggleReading}>
      {speech.speaking ? 'Stop reading' : 'Read this step'}
    </button>
  {/if}
  <button type="button" onclick={advance}>{!traceDone ? 'Run next line' : last ? 'Start again' : 'Next'}</button>
</section>

<style>
  header { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 1rem; margin: 0 0 1.5rem; }
  h1 { font-size: 1.5rem; margin: 0; }
  h2 { font-size: 1rem; margin: 0 0 0.5rem; color: var(--muted); }
  .actions { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .intro, .note { margin: 1.5rem 0 1rem; }
  .note { min-height: 3em; }
  .language { display: flex; flex-wrap: wrap; gap: 1rem; margin: 1.5rem 0 0; border: 0; padding: 0; }
  .language legend { padding: 0; margin-bottom: 0.25rem; color: var(--muted); }
  .language label { display: flex; align-items: center; gap: 0.4rem; min-height: 2.75rem; }
  .language input { width: 1.25rem; height: 1.25rem; }
  .state { display: grid; grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr)); gap: 1rem; }
  .boxes { display: flex; flex-wrap: wrap; gap: 0.75rem; margin: 0; }
  .box { border: 3px solid var(--accent); border-radius: 0.5rem; min-width: 5rem; text-align: center; }
  .box dt { padding: 0.1rem 0.5rem; background: var(--accent); color: var(--accent-fg); font-weight: 600; }
  .box dd { margin: 0; padding: 0.5rem; font-size: 1.5rem; font-weight: 700; }
  .empty { margin: 0; color: var(--muted); }
  .output {
    margin: 0;
    padding: 0.5rem 0.75rem;
    min-height: 2.5rem;
    border: 2px dashed var(--muted);
    border-radius: 0.5rem;
    font-family: ui-monospace, 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 1rem;
    white-space: pre-wrap;
  }
  .slider-label { display: block; margin-bottom: 0.5rem; }
  input[type='range'] { width: 100%; min-height: 2.75rem; margin-bottom: 1rem; }
  .options { display: grid; gap: 0.75rem; }
  button.option { width: 100%; min-height: 3.5rem; }
  button.option.right { border-color: #1b7f3b; border-width: 4px; }
  button.option.wrong { border-style: dashed; }
  .progress-text { margin: 0 0 0.5rem; color: var(--muted); }
  .track { height: 0.75rem; background: var(--track); border-radius: 0.375rem; overflow: hidden; }
  /* The one gentle effect; calm mode switches it off globally in app.css. */
  .fill { height: 100%; background: var(--accent); transition: width 300ms ease; }
  .idea { font-size: 1.5rem; margin: 2.5rem 0; min-height: 8rem; }
  .fade { animation: fade-in 200ms ease; }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  button {
    display: block;
    width: 100%;
    min-height: 4rem;
    font: inherit;
    font-weight: 600;
    color: var(--accent-fg);
    background: var(--accent);
    border: 0;
    border-radius: 0.75rem;
    cursor: pointer;
  }
  button.secondary {
    width: auto;
    min-height: 2.75rem;
    padding: 0 1rem;
    color: var(--fg);
    background: transparent;
    border: 2px solid var(--accent);
  }
  button.read { width: 100%; min-height: 3.5rem; margin-bottom: 1rem; }
  button:focus-visible { outline: 3px solid var(--fg); outline-offset: 3px; }
</style>
