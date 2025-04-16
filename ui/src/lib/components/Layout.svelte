<script>
  import { onMount } from 'svelte';
  export let title = 'Learning Journal';
  
  let darkMode = false;
  
  onMount(() => {
    // Check for user preference
    darkMode = localStorage.getItem('darkMode') === 'true' || 
               window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark', darkMode);
  });
  
  function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }
</script>

<svelte:head>
  <title>{title} | Learning Journal</title>
</svelte:head>

<div class="layout">
  <header>
    <div class="container">
      <a href="/" class="logo">Learning Journal</a>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/categories">Categories</a></li>
          <li><a href="/tags">Tags</a></li>
        </ul>
      </nav>
      <button class="theme-toggle" on:click={toggleDarkMode}>
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  </header>
  
  <main>
    <div class="container">
      <slot />
    </div>
  </main>
  
  <footer>
    <div class="container">
      <p>© {new Date().getFullYear()} Learning Journal</p>
    </div>
  </footer>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  header {
    background-color: var(--color-header-bg);
    color: var(--color-header-text);
    padding: 1rem 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-header-text);
    text-decoration: none;
  }
  
  nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 1rem;
  }
  
  nav a {
    color: var(--color-header-text);
    text-decoration: none;
  }
  
  main {
    flex: 1;
    padding: 2rem 0;
  }
  
  footer {
    background-color: var(--color-canvas-subtle);
    padding: 1rem 0;
    border-top: 1px solid var(--color-border-default);
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .theme-toggle {
    background: none;
    border: none;
    color: var(--color-header-text);
    font-size: 1.2rem;
    cursor: pointer;
  }
  
  @media (max-width: 768px) {
    header .container {
      flex-direction: column;
      gap: 1rem;
    }
    
    nav ul {
      margin-top: 1rem;
    }
  }
</style>
