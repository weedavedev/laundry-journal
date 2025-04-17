<script>
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  export let data;

  $: {
    console.log('Page data:', data);
  }
</script>

<div class="container">
  <!-- Table of Contents component at the top -->
  <TableOfContents files={data.markdownFiles || []} />

  <!-- Main content area -->
  {#if data.markdownFiles && data.markdownFiles.length > 0}
    <div class="markdown-list">
      {#each data.markdownFiles as file}
        <article class="markdown-item" id={file.slug}>
          <h2>{file.title || file.slug}</h2>
          <div class="metadata">
            {#if file.date}
              <span class="date">Created: {new Date(file.date).toLocaleDateString()}</span>
            {/if}
            {#if file.updated && file.updated !== file.date}
              <span class="date">Updated: {new Date(file.updated).toLocaleDateString()}</span>
            {/if}
            {#if file.tags && file.tags.length > 0}
              <div class="tags">
                {#each file.tags as tag}
                  <span class="tag">{tag}</span>
                {/each}
              </div>
            {/if}
          </div>
          <div class="content">
            {@html file.html}
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <p>No markdown files found.</p>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }

  .markdown-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .markdown-item {
    padding: 1.5rem;
    border: 1px solid #eee;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  h2 {
    margin-top: 0;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }

  .metadata {
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  .date {
    margin-right: 1rem;
  }

  .tags {
    margin-top: 0.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    background-color: #f0f0f0;
    border-radius: 15px;
    padding: 0.2rem 0.8rem;
    font-size: 0.8rem;
    color: #555;
  }

  .content {
    line-height: 1.6;
  }

  /* Responsive layout */
  @media (min-width: 768px) {
    .markdown-list {
      grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
    }
  }

  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .markdown-item {
      background-color: #252525;
      border-color: #333;
      color: #e0e0e0;
    }

    h2 {
      color: #e0e0e0;
      border-bottom-color: #444;
    }

    .metadata {
      color: #aaa;
    }

    .tag {
      background-color: #333;
      color: #ccc;
    }
  }
</style>
