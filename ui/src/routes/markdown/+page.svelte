<script>
  export let data;
</script>

{#if data.markdownFiles.length}
  {#each data.markdownFiles as file}
    <article>
      <h2>{file.title}</h2>
      {@html file.html}
    </article>
  {/each}
{:else}
  <p>No markdown files found.</p>
{/if}
