// Fix for Vite's import.meta.glob
import yaml from 'js-yaml';
import { marked } from 'marked';

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true
});

export async function getAllMarkdownFiles() {
  console.log('Starting markdown file discovery');

  try {
    // Now using the recommended approach for Vite's import.meta.glob
    // Moving files from static to src/content as suggested by Vite
    const markdownFiles = import.meta.glob('/src/content/*.md', { 
      query: '?raw',
      import: 'default',
      eager: true 
    });
    
    console.log('Markdown files found:', Object.keys(markdownFiles));

    const files = [];

    for (const path in markdownFiles) {
      try {
        const content = markdownFiles[path];
        // Extract the filename from the path
        const filename = path.split('/').pop();
        const slug = filename.replace(/\.md$/, '');
        
        // Parse frontmatter
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)/;
        const match = content.match(frontmatterRegex);
        
        let frontmatter = {};
        let markdownContent = content;
        
        if (match) {
          try {
            frontmatter = yaml.load(match[1]) || {};
            markdownContent = match[2].trim();
          } catch (error) {
            console.error('Error parsing frontmatter:', error);
          }
        }
        
        // Generate HTML from markdown content
        const html = marked.parse(markdownContent);
        
        files.push({
          slug,
          path,
          filename,
          title: frontmatter.title || slug,
          date: frontmatter.date,
          updated: frontmatter.updated,
          tags: frontmatter.tags || [],
          category: frontmatter.category,
          content: markdownContent,
          html
        });
      } catch (error) {
        console.error('Error processing markdown file:', path, error);
      }
    }

    console.log('Total markdown files processed:', files.length);
    return files;
  } catch (error) {
    console.error('Error in getAllMarkdownFiles:', error);
    return [];
  }
}

export async function getMarkdownBySlug(slug) {
  const files = await getAllMarkdownFiles();
  return files.find(file => file.slug === slug);
}
