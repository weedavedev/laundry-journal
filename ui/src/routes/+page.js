import { getAllMarkdownFiles } from '$lib/components/markdown-loader.js';

export const ssr = false; // Disable server-side rendering for this route

export async function load() {
  try {
    console.log('Loading markdown files...');
    const markdownFiles = await getAllMarkdownFiles();
    
    console.log(`Loaded ${markdownFiles.length} markdown files`);
    
    return {
      markdownFiles
    };
  } catch (err) {
    console.error('Error loading markdown files:', err);
    
    return {
      markdownFiles: [],
      error: err.message
    };
  }
}
