import { marked } from 'marked';
import yaml from 'js-yaml';

export async function getAllMarkdownFiles() {
  console.log('Starting markdown file discovery');

  try {
    // Use Vite's import.meta.glob to dynamically import markdown files
    const markdownModules = import.meta.glob('../../../content/**/*.md');
    console.log('Markdown modules found:', Object.keys(markdownModules));

    const files = [];

    for (const path in markdownModules) {
      try {
        const module = await markdownModules[path]();
        
        // Extract filename and create slug
        const filename = path.split('/').pop();
        const slug = filename.replace(/\.md$/, '');
        
        // Basic frontmatter parsing
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)/;
        const match = module.default.match(frontmatterRegex);
        
        let frontmatter = {};
        let content = module.default;

        if (match) {
          try {
            frontmatter = yaml.load(match[1]) || {};
            content = match[2].trim();
          } catch (yamlError) {
            console.error('Error parsing frontmatter:', yamlError);
          }
        }

        const processedFile = {
          slug,
          path,
          title: frontmatter.title || slug,
          content,
          html: marked.parse(content),
          ...frontmatter
        };

        console.log(`Processed file: ${filename}`, processedFile);
        files.push(processedFile);
      } catch (error) {
        console.error('Error processing markdown file:', path, error);
      }
    }

    console.log('Total markdown files processed:', files.length);
    return files;
  } catch (error) {
    console.error('Error reading content directory:', error);
    return [];
  }
}

export async function getMarkdownBySlug(slug) {
  const files = await getAllMarkdownFiles();
  return files.find(file => file.slug === slug);
}
