<script>
  import LessonScreen from './lib/LessonScreen.svelte';

  // Placeholder content; real lessons come from a later issue.
  const topic = 'Breaking a task into steps';
  const steps = [
    'Fill the kettle with water and switch it on.',
    'Put a tea bag in a cup and pour in the hot water.',
    'Wait a few minutes, take the tea bag out, then add milk if you like.',
  ];
</script>

<main>
  <LessonScreen {topic} {steps} />
</main>

<style>
  main { max-width: 36rem; margin: 0 auto; padding: 1.5rem 1rem; }
</style>
