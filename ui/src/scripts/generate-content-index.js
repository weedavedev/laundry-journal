// scripts/generate-content-index.js
import fs from 'fs';
import path from 'path';

// Path to your content directory
const contentDir = path.resolve('./content');
// Path to output in static directory (will be used by GitHub Pages)
const outputDir = path.resolve('./static/content');

function generateContentIndex() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Read all files in the content directory
    const files = fs.readdirSync(contentDir)
      .filter(file => file.endsWith('.md'));
    
    // Write the index.json file
    fs.writeFileSync(
      path.join(outputDir, 'index.json'),
      JSON.stringify(files, null, 2)
    );
    
    console.log(`Generated content index with ${files.length} files`);
  } catch (error) {
    console.error('Error generating content index:', error);
  }
}

// Run the generation
generateContentIndex();
