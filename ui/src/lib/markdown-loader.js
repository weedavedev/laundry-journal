import { marked } from 'marked';
import yaml from 'js-yaml';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getAllMarkdownFiles() {
  console.log('Current module directory:', __dirname);
  console.log('Current working directory:', process.cwd());

  // Construct an absolute path to the content directory
  const contentPath = path.resolve(__dirname, '../../../content');
  console.log('Constructed content path:', contentPath);

  try {
    // Use Node.js fs to read directory contents
    const fs = await import('fs/promises');
    const files = await fs.readdir(contentPath);
    
    console.log('Files in content directory:', files);

    const markdownFiles = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async (filename) => {
          const filePath = path.join(contentPath, filename);
          console.log('Processing file:', filePath);

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
              slug,
              path: filePath,
              title: frontmatter.title || slug,
              content,
              html: marked.parse(content),
              ...frontmatter
            };
          } catch (error) {
            console.error(`Error reading file ${filename}:`, error);
            return null;
          }
        })
    );

    // Filter out any null entries
    return markdownFiles.filter(file => file !== null);
  } catch (error) {
    console.error('Error reading content directory:', error);
    return [];
  }
}

export async function getMarkdownBySlug(slug) {
  const files = await getAllMarkdownFiles();
  return files.find(file => file.slug === slug);
}
