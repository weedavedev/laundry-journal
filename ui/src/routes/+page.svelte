<script>
  export let data;
</script>

<div class="container">
  <h1>Learning Journal</h1>
  
  {#if data.markdownFiles && data.markdownFiles.length > 0}
    {#each data.markdownFiles as file}
      <div class="markdown-card">
        <h2>{file.title}</h2>
        
        {#if file.date}
          <div class="metadata">
            <span>Created: {file.date}</span>
            {#if file.updated}
              <span>Updated: {file.updated}</span>
            {/if}
          </div>
        {/if}
        
        {#if file.tags && file.tags.length > 0}
          <div class="tags">
            {#each file.tags as tag}
              <span class="tag">{tag}</span>
            {/each}
          </div>
        {/if}
        
        <div class="markdown-content">
          <!-- Render the processed HTML now that we have it working -->
          {@html file.html}
        </div>
      </div>
    {/each}
  {:else}
    <p>No markdown files found.</p>
  {/if}
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  }
  
  .markdown-card {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  
  h1 {
    font-size: 28px;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 22px;
    margin-top: 0;
    margin-bottom: 10px;
    color: #24292e;
  }
  
  .metadata {
    margin: 10px 0;
    color: #586069;
    font-size: 14px;
  }
  
  .metadata span {
    margin-right: 15px;
  }
  
  .tags {
    margin: 10px 0;
  }
  
  .tag {
    display: inline-block;
    padding: 2px 8px;
    margin-right: 5px;
    background: #f1f8ff;
    color: #0366d6;
    border-radius: 12px;
    font-size: 12px;
  }
  
  .markdown-content {
    margin-top: 15px;
  }
  
  /* Styling for markdown content */
  :global(.markdown-content h1) {
    font-size: 24px;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
    margin-top: 24px;
    margin-bottom: 16px;
  }
  
  :global(.markdown-content h2) {
    font-size: 20px;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
    margin-top: 24px;
    margin-bottom: 16px;
  }
  
  :global(.markdown-content h3) {
    font-size: 18px;
    margin-top: 24px;
    margin-bottom: 16px;
  }
  
  :global(.markdown-content p) {
    margin-top: 0;
    margin-bottom: 16px;
    line-height: 1.5;
  }
  
  :global(.markdown-content code) {
    background-color: rgba(27,31,35,0.05);
    border-radius: 3px;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    font-size: 85%;
    padding: 0.2em 0.4em;
  }
  
  :global(.markdown-content pre) {
    background-color: #f6f8fa;
    border-radius: 3px;
    font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
    font-size: 85%;
    line-height: 1.45;
    overflow: auto;
    padding: 16px;
    margin-top: 0;
    margin-bottom: 16px;
  }
</style>
