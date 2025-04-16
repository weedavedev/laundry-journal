import { error } from '@sveltejs/kit';
import { getAllMarkdownFiles } from '$lib/markdown-loader.js';

export async function load() {
  try {
    const markdownFiles = await getAllMarkdownFiles();
    
    console.log('Markdown files loaded:', markdownFiles);

    return {
      markdownFiles
    };
  } catch (err) {
    console.error('Error in page load:', err);
    return {
      markdownFiles: []
    };
  }
}
