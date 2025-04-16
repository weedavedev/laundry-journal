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
    // Log the full error details
    console.error('Detailed error:', {
      message: err.message,
      name: err.name,
      stack: err.stack,
      // Include any additional error properties
      ...err
    });

    // Throw a more informative error
    throw error(500, {
      message: 'Failed to load markdown files',
      details: err.message
    });
  }
}
