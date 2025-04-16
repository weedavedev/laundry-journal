<script>
  import Layout from '$lib/components/Layout.svelte';
  
  export let data;
  $: ({ recentFiles, tags, categories } = data);
</script>

<Layout title="Home">
  <section class="hero">
    <h1>Learning Journal</h1>
    <p class="lead">
      A personal knowledge management system that functions as both a searchable 
      resource and a chronological blog of things I've learned.
    </p>
  </section>
  
  <section class="recent-entries">
    <h2>Recent Entries</h2>
    {#if recentFiles && recentFiles.length > 0}
      <ul class="entry-list">
        {#each recentFiles as file}
          <li>
            <a href="/{file.slug}">
              <h3>{file.title}</h3>
              <div class="meta">
                {#if file.date}
                  <span class="date">{new Date(file.date).toLocaleDateString()}</span>
                {/if}
                {#if file.category}
                  <span class="category">{file.category}</span>
                {/if}
              </div>
              {#if file.tags && file.tags.length > 0}
                <div class="tags">
                  {#each file.tags as tag}
                    <span class="tag">{tag}</span>
                  {/each}
                </div>
              {/if}
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p>No entries yet. Start adding markdown files to your content directory!</p>
    {/if}
  </section>
  
  <div class="stats-container">
    <section class="categories">
      <h2>Categories</h2>
      {#if categories && categories.length > 0}
        <ul class="category-list">
          {#each categories as category}
            <li>
              <a href="/category/{category}">{category}</a>
            </li>
          {/each}
        </ul>
      {:else}
        <p>No categories yet.</p>
      {/if}
    </section>
    
    <section class="tags-section">
      <h2>Tags</h2>
      {#if tags && tags.length > 0}
        <div class="tag-cloud">
          {#each tags as tag}
            <a href="/tag/{tag}" class="tag">{tag}</a>
          {/each}
        </div>
      {:else}
        <p>No tags yet.</p>
      {/if}
    </section>
  </div>
</Layout>

<style>
  .hero {
    text-align: center;
    margin-bottom: 2rem;
    padding: 2rem 0;
    border-bottom: 1px solid var(--color-border-muted);
  }
  
  .hero h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  .lead {
    font-size: 1.2rem;
    color: var(--color-fg-muted);
    line-height: 1.6;
  }
  
  .recent-entries {
    margin-bottom: 2rem;
  }
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border-muted);
  }
  
  .entry-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .entry-list li {
    margin-bottom: 1.5rem;
  }
  
  .entry-list a {
    display: block;
    padding: 1rem;
    background-color: var(--color-canvas-subtle);
    border-radius: 8px;
    border: 1px solid var(--color-border-default);
    text-decoration: none;
    color: var(--color-fg-default);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .entry-list a:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
  
  .entry-list h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--color-accent-fg);
  }
  
  .meta {
    display: flex;
    font-size: 0.9rem;
    color: var(--color-fg-muted);
    margin-bottom: 0.5rem;
  }
  
  .date {
    margin-right: 1rem;
  }
  
  .category {
    font-style: italic;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  
  .tag {
    background-color: var(--color-neutral-muted);
    color: var(--color-fg-default);
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    text-decoration: none;
  }
  
  .stats-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
  
  .category-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .category-list li {
    margin-bottom: 0.5rem;
  }
  
  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  @media (max-width: 768px) {
    .stats-container {
      grid-template-columns: 1fr;
    }
  }
</style>
