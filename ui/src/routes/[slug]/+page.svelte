<script>
  import { base } from '$app/paths';  // Add this import
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getMarkdownBySlug } from '$lib/components/markdown-loader.js';
  
  // Rest of your script remains the same
</script>

<div class="app-container {darkMode ? 'dark' : ''}">
  <header>
    <div class="header-content">
      <div class="header-left">
        <a href="{base}/" class="back-link">← Back to List</a>
        <!-- Add base path ^^^^^ -->
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
        <!-- Add base path ^^^^^ -->
      </div>
    {:else if markdownFile}
      <!-- Rest of your component remains the same -->
    {/if}
  </main>
</div>
