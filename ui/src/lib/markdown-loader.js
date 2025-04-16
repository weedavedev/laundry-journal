// $lib/markdown-loader.js
import { marked } from 'marked';
import yaml from 'js-yaml';

export async function getAllMarkdownFiles() {
  console.log('Starting markdown file discovery');

  try {
    // Step 1: Fetch the list of markdown files from the index.json
    const response = await fetch('/content/index.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch content index: ${response.status} ${response.statusText}`);
    }
    
    // This loads the file list from our pre-generated index.json
    const files = await response.json();
    
    const processedFiles = [];
    
    // Step 2: Process each markdown file
    for (const filePath of files) {
      if (!filePath.endsWith('.md')) continue;
      
      try {
        // Fetch the file content
        const contentResponse = await fetch(`/content/${filePath}`);
        if (!contentResponse.ok) continue;
        
        const markdown = await contentResponse.text();
        
        // Parse frontmatter
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)/;
        const match = markdown.match(frontmatterRegex);
        
        let frontmatter = {};
        let content = markdown;

        if (match) {
          try {
            frontmatter = yaml.load(match[1]) || {};
            content = match[2].trim();
          } catch (yamlError) {
            console.error('Error parsing frontmatter:', yamlError);
          }
        }

        const slug = filePath.replace(/\.md$/, '');
        
        // Process tags for filtering
        const tags = frontmatter.tags || [];
        const category = frontmatter.category || 'uncategorized';
        
        // Generate a table of contents if needed
        let toc = [];
        if (content) {
          // Extract headings for TOC (basic implementation)
          const headingRegex = /^(#{2,4})\s+(.+)$/gm;
          let match;
          while ((match = headingRegex.exec(content)) !== null) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text.toLowerCase().replace(/[^\w]+/g, '-');
            toc.push({ level, text, id });
          }
        }

        const processedFile = {
          slug,
          path: `/content/${filePath}`,
          title: frontmatter.title || slug,
          date: frontmatter.date,
          updated: frontmatter.updated,
          tags,
          category,
          toc,
          content,
          html: marked.parse(content),
        };

        console.log(`Processed file: ${filePath}`);
        processedFiles.push(processedFile);
      } catch (error) {
        console.error('Error processing markdown file:', filePath, error);
      }
    }

    // Sort files by date (newest first)
    processedFiles.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });

    console.log('Total markdown files processed:', processedFiles.length);
    return processedFiles;
  } catch (error) {
    console.error('Error reading content directory:', error);
    return [];
  }
}

// Helper function to get a single markdown file by slug
export async function getMarkdownBySlug(slug) {
  const files = await getAllMarkdownFiles();
  return files.find(file => file.slug === slug);
}

// Helper function to get all unique tags
export async function getAllTags() {
  const files = await getAllMarkdownFiles();
  const tags = new Set();
  
  files.forEach(file => {
    if (file.tags && Array.isArray(file.tags)) {
      file.tags.forEach(tag => tags.add(tag));
    }
  });
  
  return Array.from(tags).sort();
}

// Helper function to get all categories
export async function getAllCategories() {
  const files = await getAllMarkdownFiles();
  const categories = new Set();
  
  files.forEach(file => {
    if (file.category) {
      categories.add(file.category);
    }
  });
  
  return Array.from(categories).sort();
}
