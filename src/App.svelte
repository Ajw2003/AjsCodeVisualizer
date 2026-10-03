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
    <SettingsScreen onback={() => (view = 'lesson')} />
  {/if}
</main>

<style>
  main { overflow-wrap: anywhere; max-width: 36rem; margin: 0 auto; padding: 1.5rem 1rem; }
</style>
