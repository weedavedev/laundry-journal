<script>
  import Layout from '$lib/components/Layout.svelte';
  
  export let data;
  $: ({ markdown } = data);
</script>

<Layout title={markdown.title}>
  <div class="content-wrapper">
    <header class="article-header">
      <h1>{markdown.title}</h1>
      
      <div class="meta">
        {#if markdown.date}
          <div class="date">
            <span>Created:</span> {new Date(markdown.date).toLocaleDateString()}
          </div>
        {/if}
        
        {#if markdown.updated && markdown.updated !== markdown.date}
          <div class="updated">
            <span>Updated:</span> {new Date(markdown.updated).toLocaleDateString()}
          </div>
        {/if}
        
        {#if markdown.category}
          <div class="category">
            <span>Category:</span> 
            <a href="/category/{markdown.category}">{markdown.category}</a>
          </div>
        {/if}
      </div>
      
      {#if markdown.tags && markdown.tags.length > 0}
        <div class="tags">
          {#each markdown.tags as tag}
            <a href="/tag/{tag}" class="tag">{tag}</a>
          {/each}
        </div>
      {/if}
    </header>
    
    <div class="markdown-body">
      {@html markdown.html}
    </div>
  </div>
</Layout>

<style>
  .content-wrapper {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .article-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border-muted);
  }
  
  .article-header h1 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 2.5rem;
  }
  
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    color: var(--color-fg-muted);
  }
  
  .meta span {
    font-weight: 600;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .tag {
    background-color: var(--color-neutral-muted);
    color: var(--color-fg-default);
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
    border-radius: 4px;
    text-decoration: none;
  }
  
  .markdown-body {
    font-size: 1.1rem;
    line-height: 1.7;
  }
</style>
