<script>
  /** @type {import('./$types').PageData} */
  export let data;

  $: {
    console.log('Page data:', data);
  }
</script>

{#if data.markdownFiles && data.markdownFiles.length > 0}
  <div class="markdown-list">
    {#each data.markdownFiles as file}
      <article class="markdown-item">
        <h2>{file.title || file.slug}</h2>
        {@html file.html}
      </article>
    {/each}
  </div>
{:else}
  <p>No markdown files found.</p>
{/if}

<style>
  .markdown-list {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
  }

  .markdown-item {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
  }
</style>
