<script>
  // ran: lines that run (marked ▶ for the current one, ✓ for a path); faded: lines that are skipped.
  let { lines, current = null, ran = [], faded = [] } = $props();

  const marker = (i) => (i === current ? '▶' : ran.includes(i) ? '✓' : faded.includes(i) ? '–' : '');
</script>

<!-- The markers are text, not only colour, so the running line is clear in every theme. -->
<pre class="code"><code>{#each lines as line, i (i)}<span
      class="line"
      class:current={i === current}
      class:ran={ran.includes(i)}
      class:faded={faded.includes(i)}
    ><span class="mark" aria-hidden="true">{marker(i)}</span>{line}</span>{/each}</code></pre>

<style>
  .code {
    margin: 0 0 1rem;
    padding: 0.75rem 0;
    overflow-x: auto;
    background: var(--track);
    border-radius: 0.75rem;
    /* Code stays monospace whatever reading font is chosen: indentation carries meaning. */
    font-family: ui-monospace, 'Cascadia Mono', Menlo, Consolas, monospace;
    font-size: 1rem;
    line-height: 1.6;
  }
  .line {
    display: block;
    /* Long lines wrap on phones; the hanging indent keeps a wrapped line under its own code. */
    padding: 0 0.75rem 0 3.25rem;
    text-indent: -1.75rem;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .mark { display: inline-block; width: 1.75rem; margin-left: -1.5rem; text-indent: 0; text-align: center; color: var(--accent); }
  .current, .ran { font-weight: 700; }
  .current { background: var(--bg); outline: 2px solid var(--accent); outline-offset: -2px; }
  /* Muted colour, not opacity, so skipped lines still meet text contrast. */
  .faded { color: var(--muted); }
</style>
