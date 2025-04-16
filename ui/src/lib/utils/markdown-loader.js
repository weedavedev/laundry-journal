import { browser } from '$app/environment';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import yaml from 'js-yaml';

// Enhanced interface for markdown files
export interface MarkdownFile {
  slug: string;
  path: string;
  content: string;
  html: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  [key: string]: any; // Allow additional frontmatter fields
}

// Configuration for production and development
const BASE_URL = browser 
  ? '' // In the browser, use relative URLs
  : 'http://localhost:8000'; // Server-side, use absolute URLs

// Caching mechanism to improve performance
const markdownCache = new Map<string, MarkdownFile>();

/**
 * Fetch content from the server with improved error handling
 */
async function fetchContent(path: string): Promise<string> {
  try {
    const response = await fetch(`${BASE_URL}${path}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    throw error;
  }
}

/**
 * Parse markdown content and extract frontmatter
 */
function parseMarkdown(content: string): { frontmatter: Record<string, any>, markdown: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {
      frontmatter: {},
      markdown: content
    };
  }
  
  try {
    const frontmatter = yaml.load(match[1]) || {};
    const markdown = match[2].trim();
    
    return { frontmatter, markdown };
  } catch (e) {
    console.error('Error parsing frontmatter:', e);
    return {
      frontmatter: {},
      markdown: content
    };
  }
}

/**
 * Render markdown to HTML with sanitization and custom processing
 */
function renderMarkdown(markdown: string): string {
  try {
    // Configure marked with custom rendering options
    const renderer = new marked.Renderer();
    
    // Custom link rendering to open external links in new tab
    renderer.link = (href, title, text) => {
      const isExternal = href && !href.startsWith('/') && !href.startsWith('#');
      return isExternal
        ? `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`
        : `<a href="${href}" title="${title || ''}">${text}</a>`;
    };

    // Set custom renderer
    marked.setOptions({
      renderer: renderer,
      highlight: function(code, lang) {
        // Optional: Add syntax highlighting if using a library like highlight.js
        return code;
      }
    });

    const html = marked.parse(markdown);
    
    // If in browser, sanitize the HTML
    return browser ? DOMPurify.sanitize(html) : html;
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return `<p class="error">Error rendering markdown: ${error.message}</p>`;
  }
}

/**
 * Get all markdown files with advanced processing and caching
 */
export async function getAllMarkdownFiles(): Promise<MarkdownFile[]> {
  // If we've already fetched and cached all files, return the cached version
  if (markdownCache.size > 0) {
    return Array.from(markdownCache.values());
  }

  try {
    // Fetch the list of files from the API
    const response = await fetch(`${BASE_URL}/../content`);
    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.status}`);
    }
    
    const fileList: string[] = await response.json();
    const files: MarkdownFile[] = [];
    
    // Process each file
    for (const filePath of fileList) {
      try {
        const content = await fetchContent(`/${filePath}`);
        const { frontmatter, markdown } = parseMarkdown(content);
        
        // Create slug from filename (remove .md extension and path)
        const filename = filePath.split('/').pop()!;
        const slug = filename.replace(/\.md$/, '');
        
        // Prepare file object with enhanced processing
        const processedFile: MarkdownFile = {
          slug,
          path: filePath,
          content: markdown,
          html: renderMarkdown(markdown),
          ...frontmatter,
          // Set defaults and perform additional processing
          title: frontmatter.title || slug,
          date: frontmatter.date 
            ? new Date(frontmatter.date).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0],
          tags: Array.isArray(frontmatter.tags) 
            ? frontmatter.tags.map(tag => tag.trim()).filter(Boolean)
            : [],
          category: frontmatter.category?.trim() || 'Uncategorized',
          // Optional: Add word count or reading time
          wordCount: markdown.split(/\s+/).length,
          readingTime: Math.ceil(markdown.split(/\s+/).length / 200) // Assuming 200 words per minute
        };

        // Cache the processed file
        markdownCache.set(slug, processedFile);
        files.push(processedFile);
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
      }
    }
    
    // Sort files by date (most recent first)
    return files.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching markdown files:', error);
    return [];
  }
}

/**
 * Get a specific markdown file by slug with caching
 */
export async function getMarkdownBySlug(slug: string): Promise<MarkdownFile | undefined> {
  // Check if the file is already in cache
  if (markdownCache.has(slug)) {
    return markdownCache.get(slug);
  }

  const files = await getAllMarkdownFiles();
  return files.find(file => file.slug === slug);
}

/**
 * Get all unique tags from all markdown files
 */
export async function getAllTags(): Promise<string[]> {
  const files = await getAllMarkdownFiles();
  const tagSet = new Set<string>();
  
  files.forEach(file => {
    if (file.tags && Array.isArray(file.tags)) {
      file.tags.forEach(tag => tagSet.add(tag.trim()));
    }
  });
  
  return Array.from(tagSet).sort();
}

/**
 * Get all categories from all markdown files
 */
export async function getAllCategories(): Promise<string[]> {
  const files = await getAllMarkdownFiles();
  const categorySet = new Set<string>();
  
  files.forEach(file => {
    if (file.category) {
      categorySet.add(file.category.trim());
    }
  });
  
  return Array.from(categorySet).sort();
}

/**
 * Filter markdown files by tag
 */
export async function getMarkdownByTag(tag: string): Promise<MarkdownFile[]> {
  const files = await getAllMarkdownFiles();
  return files.filter(file => 
    file.tags && file.tags.includes(tag.trim())
  );
}

/**
 * Filter markdown files by category
 */
export async function getMarkdownByCategory(category: string): Promise<MarkdownFile[]> {
  const files = await getAllMarkdownFiles();
  return files.filter(file => 
    file.category.trim() === category.trim()
  );
}
