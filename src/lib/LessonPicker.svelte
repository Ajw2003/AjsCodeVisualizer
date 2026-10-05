<script>
  let { lessons, onpick, onsettings } = $props();
</script>

<section>
  <header>
    <h1>Lessons</h1>
    <button type="button" class="secondary" onclick={onsettings}>Settings</button>
  </header>
  <ul>
    {#each lessons as lesson, i (lesson.id)}
      <li>
        <button type="button" onclick={() => onpick(lesson)}>
          <span class="number">{i + 1}</span>{lesson.title}
        </button>
      </li>
    {/each}
  </ul>
</section>

<style>
  header { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 1rem; margin: 0 0 1.5rem; }
  h1 { font-size: 1.5rem; margin: 0; }
  ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.75rem; }
  button {
    display: flex;
    align-items: center;
    gap: 1rem;
    width: 100%;
    min-height: 4rem;
    padding: 0.5rem 1rem;
    font: inherit;
    font-weight: 600;
    text-align: left;
    color: var(--fg);
    background: transparent;
    border: 2px solid var(--accent);
    border-radius: 0.75rem;
    cursor: pointer;
  }
  button.secondary { width: auto; min-height: 2.75rem; }
  button:focus-visible { outline: 3px solid var(--fg); outline-offset: 3px; }
  .number {
    flex: none;
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    color: var(--accent-fg);
    background: var(--accent);
  }
</style>
