<script>
  export let data;
  export let form;
  export let errors;

  $: {
    console.log('Page data:', data);
    console.log('Page errors:', errors);
  }
</script>

{#if errors}
  <div class="error-container">
    <h2>Error Loading Content</h2>
    <p>{errors.message}</p>
    {#if errors.details}
      <pre>{errors.details}</pre>
    {/if}
  </div>
{:else if data.markdownFiles && data.markdownFiles.length > 0}
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

  .error-container {
    background-color: #ffeeee;
    border: 1px solid red;
    color: red;
    padding: 1rem;
    margin: 1rem;
    border-radius: 8px;
  }
</style>
