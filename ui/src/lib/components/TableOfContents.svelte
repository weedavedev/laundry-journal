<script>
  import { base } from '$app/paths';

  export let files = [];
  
  // Group files by category
  $: filesByCategory = files.reduce((acc, file) => {
    const category = file.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(file);
    return acc;
  }, {});
  
  // Sort categories
  $: sortedCategories = Object.keys(filesByCategory).sort((a, b) => {
    if (a === 'Uncategorized') return 1;
    if (b === 'Uncategorized') return -1;
    return a.localeCompare(b);
  });
</script>

<div class="table-of-contents">
  <h2>Contents</h2>
  
  {#each sortedCategories as category}
    <div class="category">
      <h3>{category}</h3>
      <ul>
        {#each filesByCategory[category] as file}
          <li>
            <a href="{base}/{file.slug}">{file.title || file.slug}</a>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>

<style>
  .table-of-contents {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    margin-top: 0;
    font-size: 1.5rem;
    color: #333;
    border-bottom: 2px solid #ddd;
    padding-bottom: 0.5rem;
  }
  
  h3 {
    margin: 1rem 0 0.5rem;
    font-size: 1.2rem;
    color: #555;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0.5rem;
    margin: 0.5rem 0;
  }
  
  li {
    margin: 0.25rem 0;
  }
  
  a {
    color: #0066cc;
    text-decoration: none;
    display: inline-block;
    padding: 0.25rem 0;
    transition: color 0.2s;
  }
  
  a:hover {
    color: #004499;
    text-decoration: underline;
  }
  
  .category {
    margin-bottom: 1rem;
  }
  
  /* Dark mode support */
  @media (prefers-color-scheme: dark) {
    .table-of-contents {
      background-color: #252525;
      color: #e0e0e0;
    }
    
    h2 {
      color: #e0e0e0;
      border-bottom-color: #444;
    }
    
    h3 {
      color: #ccc;
    }
    
    a {
      color: #8cb4ff;
    }
    
    a:hover {
      color: #aaccff;
    }
  }
</style>
