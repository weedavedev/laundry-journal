import { getAllMarkdownFiles } from '$lib/markdown-loader.js';

export async function load() {
  try {
    const markdownFiles = await getAllMarkdownFiles();
    return { markdownFiles };
  } catch (error) {
    console.error('Failed to load markdown files:', error);
    return { markdownFiles: [] };
  }
}
