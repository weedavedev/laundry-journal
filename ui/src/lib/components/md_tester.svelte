<script>
  import { onMount } from 'svelte';
  import { getAllMarkdownFiles } from '$lib/markdown-loader';

  let markdownFiles = [];

  onMount(async () => {
    markdownFiles = await getAllMarkdownFiles();
    console.log('Loaded Markdown Files:', markdownFiles);
  });
</script>

{#each markdownFiles as file}
  <div>
    <h2>{file.title}</h2>
    {@html file.html}
  </div>
{/each}
