<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  
  // Get data from the loader
  export let data;
  
  $: {
    console.log('Page data in component:', data);
    if (data.markdown) {
      console.log('Markdown title:', data.markdown.title);
      console.log('Markdown HTML length:', data.markdown.html?.length || 0);
    } else {
      console.log('No markdown data received in component!');
    }
  }
  
  // Extract markdown from data (this was the key issue - using markdownFile instead of markdown)
  $: markdown = data.markdown;
  
  let isLoading = false;
  let darkMode = false;
  let error = null;
  
  // Extract slug from route params
  $: slug = $page.params.slug;
  
  onMount(() => {
    try {
      // Check for dark mode preference
      if (typeof window !== 'undefined') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedPreference = localStorage.getItem('darkMode');
        darkMode = storedPreference === 'true' || (storedPreference === null && prefersDark);
        
        // Apply dark mode if needed
        if (darkMode) {
          document.body.classList.add('dark');
        }
      }
    } catch (err) {
      console.error('Error initializing UI:', err);
    }
  });
  
  function toggleDarkMode() {
    darkMode = !darkMode;
    
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      
      localStorage.setItem('darkMode', darkMode);
    }
  }
</script>

<svelte:head>
  <title>{markdown?.title || 'Entry'} | Learning Journal</title>
</svelte:head>

<div class="app-container {darkMode ? 'dark' : ''}">
  <header>
    <div class="header-content">
      <div class="header-left">
        <a href="{base}/" class="back-link">← Back to List</a>
        <h1>Learning Journal</h1>
      </div>
      <button class="theme-toggle" on:click={toggleDarkMode}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  </header>

  <main>
    {#if isLoading}
      <div class="loading">Loading entry...</div>
    {:else if error}
      <div class="error">
        <h2>Error</h2>
        <p>{error}</p>
        <a href="{base}/" class="button">Return to Home</a>
      </div>
    {:else if markdown}
      <article class="markdown-entry">
        <div class="entry-header">
          <h1>{markdown.title}</h1>
          
          <div class="entry-metadata">
            {#if markdown.date}
              <div class="metadata-item">
                <span class="label">Created:</span>
                <span class="value">{new Date(markdown.date).toLocaleDateString()}</span>
              </div>
            {/if}
            
            {#if markdown.updated}
              <div class="metadata-item">
                <span class="label">Updated:</span>
                <span class="value">{new Date(markdown.updated).toLocaleDateString()}</span>
              </div>
            {/if}
            
            {#if markdown.category}
              <div class="metadata-item">
                <span class="label">Category:</span>
                <span class="value category">{markdown.category}</span>
              </div>
            {/if}
          </div>
          
          {#if markdown.tags && markdown.tags.length > 0}
            <div class="entry-tags">
              {#each markdown.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          {/if}
        </div>
        
        {#if markdown.toc && markdown.toc.length > 0}
          <div class="table-of-contents">
            <h2>Table of Contents</h2>
            <ul>
              {#each markdown.toc as item}
                <li class="toc-level-{item.level - 1}">
                  <a href="#{item.id}">{item.text}</a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
        
        <div class="entry-content markdown-body">
          {@html markdown.html}
        </div>
      </article>
    {:else}
      <div class="error">
        <h2>Entry Not Found</h2>
        <p>The requested entry "{slug}" could not be found.</p>
        <a href="{base}/" class="button">Return to Home</a>
      </div>
    {/if}
  </main>

  <footer>
    <p>Learning Journal - Your personal knowledge management system</p>
  </footer>
</div>
