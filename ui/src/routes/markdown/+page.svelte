<script>
  /** @type {import('./$types').PageData} */
  export let data;

  // Comprehensive logging
  $: {
    console.log('🧩 Full data object:', data);
    console.log('📄 Markdown files:', data?.markdownFiles);
    console.log('📏 Number of files:', data?.markdownFiles?.length);
  }
</script>

{#if data?.markdownFiles?.length}
  <div class="markdown-list">
    {#each data.markdownFiles as file}
      <article class="markdown-item">
        <h2>{file.title || file.slug}</h2>
        {@html file.html}
      </article>
    {/each}
  </div>
{:else}
  <div class="no-files-warning">
    <p>No markdown files found.</p>
    <details>
      <summary>Debug Information</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  </div>
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

  .no-files-warning {
    background-color: #f8d7da;
    color: #721c24;
    padding: 1rem;
    margin: 1rem;
    border-radius: 8px;
  }
</style>
