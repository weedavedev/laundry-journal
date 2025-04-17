import { getAllMarkdownFiles } from '$lib/components/markdown-loader.js';

export async function load() {
  try {
    console.log('Loading markdown files...');
    
    // Add a slight delay to help with potential race conditions
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const markdownFiles = await getAllMarkdownFiles();
    
    console.log(`Loaded ${markdownFiles.length} markdown files`);
    
    if (markdownFiles.length === 0) {
      console.warn('No markdown files were found');
    } else {
      // Log the titles of the loaded files for debugging
      console.log('Loaded files:', markdownFiles.map(f => f.title));
    }
    
    return {
      markdownFiles
    };
  } catch (err) {
    console.error('Error loading markdown files:', err);
    
    // Return an empty array instead of throwing an error
    return {
      markdownFiles: [],
      error: err.message
    };
  }
}
