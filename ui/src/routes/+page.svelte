
<script>
  export let data;

  $: {
    console.log('Page data:', data);
  }
</script>

<div class="markdown-container">
  {#if data.markdownFiles && data.markdownFiles.length > 0}
    <div class="file-list">
      <h2>Learning Journal</h2>
      {#each data.markdownFiles as file}
        <article class="markdown-item">
          <h2 class="file-title">{file.title || file.slug}</h2>
          
          <!-- Display metadata if available -->
          {#if file.date}
            <div class="metadata">
              <span class="date">Created: {file.date}</span>
              {#if file.updated}
                <span class="updated">Updated: {file.updated}</span>
              {/if}
            </div>
          {/if}
          
          <!-- Display tags if available -->
          {#if file.tags && file.tags.length > 0}
            <div class="tags">
              {#each file.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          {/if}
          
          <!-- Display the markdown content -->
          <div class="content markdown-body">
            {@html file.html}
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div class="empty-state">
      <h2>No markdown files found</h2>
      <p>Make sure your content directory contains markdown files.</p>
    </div>
  {/if}
</div>

<style>
  .markdown-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  }
  
  .file-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
  
  .markdown-item {
    margin-bottom: 2rem;
    padding: 1.5rem;
    border: 1px solid #e1e4e8;
    border-radius: 8px;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }
  
  .file-title {
    margin-top: 0;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eaecef;
    font-size: 1.75rem;
    color: #24292e;
  }
  
  .metadata {
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: #586069;
  }
  
  .date, .updated {
    margin-right: 1rem;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .tag {
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    background-color: #f1f8ff;
    color: #0366d6;
    font-size: 0.75rem;
  }
  
  .content {
    font-size: 16px;
    line-height: 1.5;
  }
  
  .empty-state {
    text-align: center;
    padding: 2rem;
    background-color: #f6f8fa;
    border-radius: 8px;
    color: #586069;
  }
  
  /* GitHub-like markdown rendering */
  :global(.markdown-body h1) {
    font-size: 2em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  
  :global(.markdown-body h2) {
    font-size: 1.5em;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
  }
  
  :global(.markdown-body h3) {
    font-size: 1.25em;
  }
  
  :global(.markdown-body pre) {
    padding: 16px;
    overflow: auto;
    background-color: #f6f8fa;
    border-radius: 6px;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    font-size: 85%;
  }
  
  :global(.markdown-body code) {
    padding: 0.2em 0.4em;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    font-size: 85%;
  }
  
  :global(.markdown-body blockquote) {
    margin-left: 0;
    padding-left: 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }
  
  :global(.markdown-body table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }
  
  :global(.markdown-body table th, .markdown-body table td) {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }
  
  :global(.markdown-body table tr) {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
  }
  
  :global(.markdown-body table tr:nth-child(2n)) {
    background-color: #f6f8fa;
  }
</style>
