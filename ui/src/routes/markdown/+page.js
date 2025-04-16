import { getAllMarkdownFiles } from '$lib/markdown-loader.js';

export async function load() {
  try {
    const markdownFiles = await getAllMarkdownFiles();
    
    console.log('🚀 Page load - Markdown files:', markdownFiles.length);
    console.log('🔍 First file details:', markdownFiles[0]);

    // Explicitly stringify and parse to ensure full serialization
    return {
      markdownFiles: JSON.parse(JSON.stringify(markdownFiles))
    };
  } catch (err) {
    console.error('❌ Error in page load:', err);
    return {
      markdownFiles: []
    };
  }
}
