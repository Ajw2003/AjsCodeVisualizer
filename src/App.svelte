<script>
  import LessonScreen from './lib/LessonScreen.svelte';
  import SettingsScreen from './lib/SettingsScreen.svelte';
  import LessonPicker from './lib/LessonPicker.svelte';
  import { LESSONS } from './lessons/index.js';

  let view = $state('picker');
  let lesson = $state(null);
  // Settings returns to whichever screen opened it.
  let before = $state('picker');

  function openSettings() {
    before = view;
    view = 'settings';
  }
</script>

<main>
  {#if view === 'picker'}
    <LessonPicker lessons={LESSONS} onpick={(l) => { lesson = l; view = 'lesson'; }} onsettings={openSettings} />
  {/if}
  <!-- Lesson is hidden, not unmounted, so the learner keeps their place after visiting settings. -->
  {#if lesson}
    <div hidden={view !== 'lesson'}>
      {#key lesson}
        <LessonScreen {lesson} onsettings={openSettings} onlessons={() => (view = 'picker')} />
      {/key}
    </div>
  {/if}
  {#if view === 'settings'}
    <svelte:boundary onerror={(e) => console.error('Settings failed to render.', e)}>
      <SettingsScreen onback={() => (view = before)} />
      {#snippet failed(error, reset)}
        <section role="alert">
          <p>Settings could not open.</p>
          <p>{error?.message ?? String(error)}</p>
          <button type="button" onclick={() => { reset(); view = before; }}>Back</button>
        </section>
      {/snippet}
    </svelte:boundary>
  {/if}
</main>

<style>
  main { overflow-wrap: anywhere; max-width: 36rem; margin: 0 auto; padding: 1.5rem 1rem; }
</style>
