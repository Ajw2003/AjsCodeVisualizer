<script>
  import { settings, update, resetSettings, calmOn, FONTS, LETTER, LINE } from './settings.svelte.js';
  import { speech, speechSupported } from './speech.svelte.js';

  let { onback } = $props();

  const calm = $derived(settings.calm === null ? calmOn() : settings.calm);
  const voiceLabel = (v) => `${v.name} (${v.lang})${v.localService ? ' (works offline)' : ''}`;
</script>

<section>
  <header>
    <h1>Settings</h1>
    <button type="button" class="secondary" onclick={onback}>Back</button>
  </header>

  <fieldset>
    <legend>Motion</legend>
    <label class="check">
      <input
        type="checkbox"
        checked={calm}
        onchange={(e) => update({ calm: e.currentTarget.checked })}
      />
      Calm mode (no movement or fading)
    </label>
  </fieldset>

  <fieldset>
    <legend>Font</legend>
    {#each Object.entries(FONTS) as [id, f] (id)}
      <label class="check" style="font-family: {f.family}">
        <input type="radio" name="font" value={id} checked={settings.font === id} onchange={() => update({ font: id })} />
        {f.label}
      </label>
    {/each}
  </fieldset>

  <fieldset>
    <legend>Text size</legend>
    <label for="size">Size: {settings.size}%</label>
    <input
      id="size"
      type="range"
      min="100"
      max="200"
      step="10"
      value={settings.size}
      oninput={(e) => update({ size: Number(e.currentTarget.value) })}
    />
  </fieldset>

  <fieldset>
    <legend>Letter and word spacing</legend>
    {#each LETTER as o, i (o.label)}
      <label class="check">
        <input type="radio" name="letter" checked={settings.letter === i} onchange={() => update({ letter: i })} />
        {o.label}
      </label>
    {/each}
  </fieldset>

  <fieldset>
    <legend>Line spacing</legend>
    {#each LINE as o, i (o.label)}
      <label class="check">
        <input type="radio" name="line" checked={settings.line === i} onchange={() => update({ line: i })} />
        {o.label}
      </label>
    {/each}
  </fieldset>

  <fieldset>
    <legend>Read aloud</legend>
    {#if speechSupported}
      <label for="voice">Voice</label>
      <select id="voice" value={settings.voice} onchange={(e) => update({ voice: e.currentTarget.value })}>
        <option value="">Default voice</option>
        {#each speech.voices as v (v.voiceURI)}
          <option value={v.voiceURI}>{voiceLabel(v)}</option>
        {/each}
      </select>
      <label for="rate">Speed: {settings.rate}x</label>
      <input
        id="rate"
        type="range"
        min="0.75"
        max="1.5"
        step="0.05"
        value={settings.rate}
        oninput={(e) => update({ rate: Number(e.currentTarget.value) })}
      />
    {:else}
      <p>This browser has no built-in voices, so reading aloud is not available.</p>
    {/if}
  </fieldset>

  <button type="button" class="secondary reset" onclick={resetSettings}>Reset to defaults</button>
</section>

<style>
  header { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 1rem; margin: 0 0 1.5rem; }
  h1 { font-size: 1.5rem; margin: 0; }
  fieldset { margin: 0 0 1.5rem; padding: 0.75rem 1rem 1rem; border: 2px solid var(--track); border-radius: 0.75rem; }
  legend { font-weight: 700; padding: 0 0.5rem; }
  label { display: block; }
  .check { display: flex; align-items: center; gap: 0.75rem; min-height: 2.75rem; cursor: pointer; }
  input[type='checkbox'], input[type='radio'] { width: 1.5rem; height: 1.5rem; flex: none; accent-color: var(--accent); }
  input[type='range'] { display: block; width: 100%; min-height: 2.75rem; accent-color: var(--accent); }
  select {
    display: block; width: 100%; min-height: 2.75rem; margin: 0 0 1rem;
    font: inherit; color: var(--fg); background: var(--bg); border: 2px solid var(--accent); border-radius: 0.5rem;
  }
  p { margin: 0; }
  button {
    font: inherit;
    font-weight: 600;
    min-height: 2.75rem;
    padding: 0 1rem;
    color: var(--fg);
    background: transparent;
    border: 2px solid var(--accent);
    border-radius: 0.75rem;
    cursor: pointer;
  }
  .reset { width: 100%; }
  :global(input:focus-visible), :global(select:focus-visible), button:focus-visible {
    outline: 3px solid var(--fg);
    outline-offset: 3px;
  }
</style>
