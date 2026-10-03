<script>
  import { speech, speechSupported, readAloud, stopReading } from './speech.svelte.js';

  let { topic, steps, onsettings } = $props();
  let index = $state(0);

  const total = $derived(steps.length);
  const last = $derived(index === total - 1);

  function advance() {
    index = last ? 0 : index + 1;
    // Old speech would describe a step that is no longer on screen.
    if (speech.speaking) stopReading();
  }

  function toggleReading() {
    if (speech.speaking) stopReading();
    else readAloud(`${topic}. Step ${index + 1} of ${total}. ${steps[index]}`);
  }
</script>

<section>
  <header>
    <h1>{topic}</h1>
    <button type="button" class="secondary" onclick={onsettings}>Settings</button>
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

  <!-- aria-live so screen readers announce the new step after the button press.
       The keyed span only restarts the fade; the live paragraph itself stays put. -->
  <p class="idea" aria-live="polite">{#key index}<span class="fade">{steps[index]}</span>{/key}</p>

  {#if speechSupported}
    <button type="button" class="secondary read" onclick={toggleReading}>
      {speech.speaking ? 'Stop reading' : 'Read this screen'}
    </button>
  {/if}
  <button type="button" onclick={advance}>{last ? 'Start again' : 'Next'}</button>
</section>

<style>
  header { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 1rem; margin: 0 0 1.5rem; }
  h1 { font-size: 1.5rem; margin: 0; }
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
