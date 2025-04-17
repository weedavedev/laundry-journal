<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getMarkdownBySlug } from '$lib/components/markdown-loader.js';

  let markdownFile = null;
  let isLoading = true;
  let darkMode = false;
  let error = null;
  
  // Extract slug from route params
  $: slug = $page.params.slug;

  onMount(async () => {
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
      
      // Load markdown file by slug
      markdownFile = await getMarkdownBySlug(slug);
      
      if (!markdownFile) {
        error = `Entry "${slug}" not found`;
      }
    } catch (err) {
      console.error('Error loading markdown entry:', err);
      error = 'Failed to load entry';
    } finally {
      isLoading = false;
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
  <title>{markdownFile?.title || 'Entry'} | Learning Journal</title>
</svelte:head>

<div class="app-container {darkMode ? 'dark' : ''}">
  <header>
    <div class="header-content">
      <div class="header-left">
        <a href="/" class="back-link">← Back to List</a>
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
        <a href="/" class="button">Return to Home</a>
      </div>
    {:else if markdownFile}
      <article class="markdown-entry">
        <div class="entry-header">
          <h1>{markdownFile.title}</h1>
          
          <div class="entry-metadata">
            {#if markdownFile.date}
              <div class="metadata-item">
                <span class="label">Created:</span>
                <span class="value">{new Date(markdownFile.date).toLocaleDateString()}</span>
              </div>
            {/if}
            
            {#if markdownFile.updated}
              <div class="metadata-item">
                <span class="label">Updated:</span>
                <span class="value">{new Date(markdownFile.updated).toLocaleDateString()}</span>
              </div>
            {/if}
            
            {#if markdownFile.category}
              <div class="metadata-item">
                <span class="label">Category:</span>
                <span class="value category">{markdownFile.category}</span>
              </div>
            {/if}
          </div>
          
          {#if markdownFile.tags && markdownFile.tags.length > 0}
            <div class="entry-tags">
              {#each markdownFile.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          {/if}
        </div>
        
        {#if markdownFile.toc && markdownFile.toc.length > 0}
          <div class="table-of-contents">
            <h2>Table of Contents</h2>
            <ul>
              {#each markdownFile.toc as item}
                <li class="toc-level-{item.level - 1}">
                  <a href="#{item.id}">{item.text}</a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
        
        <div class="entry-content markdown-body">
          {@html markdownFile.html}
        </div>
      </article>
    {/if}
  </main>

  <footer>
    <p>Learning Journal - Your personal knowledge management system</p>
  </footer>
</div>

<style>
  /* Base styles */
  :global(:root) {
    --color-bg: #ffffff;
    --color-text: #24292f;
    --color-heading: #000000;
    --color-border: #d0d7de;
    --color-accent: #0969da;
    --color-accent-hover: #0552a5;
    --color-bg-subtle: #f6f8fa;
    --color-metadata: #57606a;
    --color-link: #0969da;
    --color-code-bg: #f6f8fa;
    --color-blockquote: #57606a;
  }

  :global(body.dark) {
    --color-bg: #0d1117;
    --color-text: #c9d1d9;
    --color-heading: #ffffff;
    --color-border: #30363d;
    --color-accent: #58a6ff;
    --color-accent-hover: #79b8ff;
    --color-bg-subtle: #161b22;
    --color-metadata: #8b949e;
    --color-link: #58a6ff;
    --color-code-bg: #161b22;
    --color-blockquote: #8b949e;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    background-color: var(--color-bg);
    color: var(--color-text);
  }

  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Header */
  header {
    background-color: var(--color-accent);
    color: white;
    padding: 1rem;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .back-link {
    color: white;
    text-decoration: none;
    font-size: 0.875rem;
  }

  .back-link:hover {
    text-decoration: underline;
  }

  header h1 {
    margin: 0;
    font-size: 1.75rem;
  }

  .theme-toggle {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.5);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .theme-toggle:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  /* Main content */
  main {
    flex: 1;
    max-width: 1000px;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
  }

  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    font-style: italic;
    color: var(--color-metadata);
  }

  .error {
    text-align: center;
    padding: 2rem;
    background-color: var(--color-bg-subtle);
    border-radius: 8px;
    max-width: 600px;
    margin: 0 auto;
  }

  .button {
    display: inline-block;
    background-color: var(--color-accent);
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    margin-top: 1rem;
  }

  .button:hover {
    background-color: var(--color-accent-hover);
  }

  /* Markdown entry */
  .markdown-entry {
    background-color: var(--color-bg);
    border-radius: 8px;
    overflow: hidden;
  }

  .entry-header {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--color-border);
  }

  .entry-header h1 {
    font-size: 2.25rem;
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--color-heading);
  }

  .entry-metadata {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    color: var(--color-metadata);
  }

  .metadata-item {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  .label {
    font-weight: 500;
  }

  .entry-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    background-color: var(--color-bg-subtle);
    border-radius: 12px;
    padding: 0.25rem 0.75rem;
    font-size: 0.75rem;
  }

  /* Table of contents */
  .table-of-contents {
    background-color: var(--color-bg-subtle);
    border-radius: 8px;
    padding: 1rem 1.5rem;
    margin-bottom: 2rem;
  }

  .table-of-contents h2 {
    font-size: 1.25rem;
    margin-top: 0;
    margin-bottom: 0.75rem;
  }

  .table-of-contents ul {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
  }

  .table-of-contents li {
    margin-bottom: 0.25rem;
  }

  .table-of-contents a {
    color: var(--color-link);
    text-decoration: none;
  }

  .table-of-contents a:hover {
    text-decoration: underline;
  }

  .toc-level-1 {
    padding-left: 0;
  }

  .toc-level-2 {
    padding-left: 1rem;
  }

  .toc-level-3 {
    padding-left: 2rem;
  }

  /* Markdown content styling */
  .entry-content {
    font-size: 1rem;
    line-height: 1.6;
  }

  :global(.markdown-body h1) {
    font-size: 2rem;
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--color-border);
    margin-top: 1.5em;
    margin-bottom: 1em;
  }

  :global(.markdown-body h2) {
    font-size: 1.5rem;
    padding-bottom: 0.3em;
    border-bottom: 1px solid var(--color-border);
    margin-top: 1.5em;
    margin-bottom: 1em;
  }

  :global(.markdown-body h3) {
    font-size: 1.25rem;
    margin-top: 1.5em;
    margin-bottom: 1em;
  }

  :global(.markdown-body h4) {
    font-size: 1rem;
    margin-top: 1.5em;
    margin-bottom: 1em;
  }

  :global(.markdown-body p) {
    margin-top: 0;
    margin-bottom: 1em;
  }

  :global(.markdown-body a) {
    color: var(--color-link);
    text-decoration: none;
  }

  :global(.markdown-body a:hover) {
    text-decoration: underline;
  }

  :global(.markdown-body code) {
    font-family: monospace;
    background-color: var(--color-code-bg);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 0.85em;
  }

  :global(.markdown-body pre) {
    background-color: var(--color-code-bg);
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1em 0;
  }

  :global(.markdown-body pre code) {
    background-color: transparent;
    padding: 0;
    font-size: 0.9em;
    color: var(--color-text);
  }

  :global(.markdown-body blockquote) {
    padding: 0 1em;
    border-left: 4px solid var(--color-border);
    color: var(--color-blockquote);
    margin: 1em 0;
  }

  :global(.markdown-body ul),
  :global(.markdown-body ol) {
    padding-left: 2em;
    margin: 1em 0;
  }

  :global(.markdown-body table) {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
  }

  :global(.markdown-body table th),
  :global(.markdown-body table td) {
    padding: 6px 13px;
    border: 1px solid var(--color-border);
  }

  :global(.markdown-body table tr:nth-child(2n)) {
    background-color: var(--color-bg-subtle);
  }

  /* Footer */
  footer {
    text-align: center;
    padding: 1.5rem;
    background-color: var(--color-bg-subtle);
    border-top: 1px solid var(--color-border);
    color: var(--color-metadata);
    font-size: 0.875rem;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .entry-header h1 {
      font-size: 1.75rem;
    }

    .entry-metadata {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
