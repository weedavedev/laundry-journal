import { marked } from 'marked';
import yaml from 'js-yaml';

export async function getAllMarkdownFiles() {
  console.log('🚀 Starting markdown file discovery');
  console.time('markdownLoadTime');

  try {
    const fs = await import('node:fs/promises');
    
    const contentPath = new URL('../../../content', import.meta.url).pathname;
    console.log('📂 Content directory:', contentPath);

    const files = await fs.readdir(contentPath);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    console.log(`📋 Found ${mdFiles.length} markdown files`);

    const markdownFiles = await Promise.all(
      mdFiles.map(async (filename) => {
        const filePath = new URL(`../../../content/${filename}`, import.meta.url).pathname;
        
        try {
          const fileContent = await fs.readFile(filePath, 'utf8');
          
          // Basic frontmatter parsing
          const frontmatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
          
          const frontmatter = frontmatterMatch 
            ? yaml.load(frontmatterMatch[1]) || {} 
            : {};
          
          const content = frontmatterMatch 
            ? frontmatterMatch[2].trim() 
            : fileContent;

          const slug = filename.replace(/\.md$/, '');

          return {
            // Explicitly include all properties
            slug,
            filename,
            path: filePath,
            title: frontmatter.title || slug,
            content: content,
            html: marked.parse(content),
            frontmatter: frontmatter,
            tags: frontmatter.tags || [],
            category: frontmatter.category || 'Uncategorized'
          };
        } catch (error) {
          console.error(`❌ Error processing ${filename}:`, error.message);
          return null;
        }
      })
    );

    // Filter out any null entries
    const validFiles = markdownFiles.filter(file => file !== null);
    
    console.log('📊 Processed markdown files:', 
      validFiles.map(file => ({
        slug: file.slug,
        title: file.title
      }))
    );
    
    console.timeEnd('markdownLoadTime');
    return validFiles;
  } catch (error) {
    console.error('❌ Error discovering markdown files:', error.message);
    return [];
  }
}

export async function getMarkdownBySlug(slug) {
  const files = await getAllMarkdownFiles();
  return files.find(file => file.slug === slug);
}
