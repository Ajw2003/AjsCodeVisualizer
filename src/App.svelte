<script>
  import LessonScreen from './lib/LessonScreen.svelte';
  import SettingsScreen from './lib/SettingsScreen.svelte';

  // Placeholder content; real lessons come from a later issue.
  const topic = 'Breaking a task into steps';
  const steps = [
    'Fill the kettle with water and switch it on.',
    'Put a tea bag in a cup and pour in the hot water.',
    'Wait a few minutes, take the tea bag out, then add milk if you like.',
  ];

  let view = $state('lesson');
</script>

<main>
  <!-- Lesson is hidden, not unmounted, so the learner keeps their place after visiting settings. -->
  <div hidden={view !== 'lesson'}>
    <LessonScreen {topic} {steps} onsettings={() => (view = 'settings')} />
  </div>
  {#if view === 'settings'}
    <svelte:boundary onerror={(e) => console.error('Settings failed to render.', e)}>
      <SettingsScreen onback={() => (view = 'lesson')} />
      {#snippet failed(error, reset)}
        <section role="alert">
          <p>Settings could not open.</p>
          <p>{error?.message ?? String(error)}</p>
          <button type="button" onclick={() => { reset(); view = 'lesson'; }}>Back to lesson</button>
        </section>
      {/snippet}
    </svelte:boundary>
  {/if}
</main>

<style>
  main { overflow-wrap: anywhere; max-width: 36rem; margin: 0 auto; padding: 1.5rem 1rem; }
</style>
