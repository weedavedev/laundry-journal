import { error } from '@sveltejs/kit';
import { getAllMarkdownFiles } from '$lib/markdown-loader.js';

export async function load() {
  try {
    // Add a slight delay to see if it helps with race condition
    await new Promise(resolve => setTimeout(resolve, 100));

    const markdownFiles = await getAllMarkdownFiles();
    
    console.log('Markdown files loaded:', markdownFiles);

    return {
      markdownFiles
    };
  } catch (err) {
    console.error('Error in page load:', err);
    
    // Return an empty array instead of throwing an error
    return {
      markdownFiles: []
    };
  }
}
