<script>
  import { base } from '$app/paths';  // Add this import
  
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
            <!-- ^^^^^^^ Add base path here -->
          </li>
        {/each}
      </ul>
    </div>
  {/each}
</div>

