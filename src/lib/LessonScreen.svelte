<script>
  let { topic, steps } = $props();
  let index = $state(0);

  const total = $derived(steps.length);
  const last = $derived(index === total - 1);

  function advance() {
    index = last ? 0 : index + 1;
  }
</script>

<section>
  <h1>{topic}</h1>

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

  <!-- aria-live so screen readers announce the new step after the button press. -->
  <p class="idea" aria-live="polite">{steps[index]}</p>

  <button type="button" onclick={advance}>{last ? 'Start again' : 'Next'}</button>
</section>

<style>
  h1 { font-size: 1.5rem; margin: 0 0 1.5rem; }
  .progress-text { margin: 0 0 0.5rem; color: var(--muted); }
  .track { height: 0.75rem; background: var(--track); border-radius: 0.375rem; overflow: hidden; }
  .fill { height: 100%; background: var(--accent); }
  .idea { font-size: 1.5rem; margin: 2.5rem 0; min-height: 8rem; }
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
  button:focus-visible { outline: 3px solid var(--fg); outline-offset: 3px; }
</style>
