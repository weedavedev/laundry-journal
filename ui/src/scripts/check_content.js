// Checking content directory structure
console.log("Current working directory:", process.cwd());

const fs = require('fs');
const path = require('path');

// Function to list directories recursively
function listDirectoryContents(dir, indent = 0) {
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stats = fs.statSync(itemPath);
      
      const indentStr = '  '.repeat(indent);
      
      if (stats.isDirectory()) {
        console.log(`${indentStr}📁 ${item}/`);
        listDirectoryContents(itemPath, indent + 1);
      } else {
        // Get file size in KB
        const fileSizeKB = (stats.size / 1024).toFixed(2);
        
        // For markdown files, check if they have frontmatter
        let extraInfo = '';
        if (item.endsWith('.md')) {
          try {
            const content = fs.readFileSync(itemPath, 'utf8');
            const hasFrontmatter = content.startsWith('---');
            extraInfo = hasFrontmatter ? ' (has frontmatter)' : ' (no frontmatter)';
          } catch (err) {
            extraInfo = ' (error reading file)';
          }
        }
        
        console.log(`${indentStr}📄 ${item} (${fileSizeKB} KB)${extraInfo}`);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
}

// First check the direct content directory
console.log("\n===== CHECKING ./content DIRECTORY =====");
try {
  const contentExists = fs.existsSync('./content');
  if (contentExists) {
    listDirectoryContents('./content');
  } else {
    console.log("./content directory doesn't exist!");
  }
} catch (error) {
  console.error("Error:", error.message);
}

// Check for content directory in parent folder
console.log("\n===== CHECKING ../content DIRECTORY =====");
try {
  const parentContentExists = fs.existsSync('../content');
  if (parentContentExists) {
    listDirectoryContents('../content');
  } else {
    console.log("../content directory doesn't exist!");
  }
} catch (error) {
  console.error("Error:", error.message);
}

// Check static/content directory
console.log("\n===== CHECKING ./static/content DIRECTORY =====");
try {
  const staticContentExists = fs.existsSync('./static/content');
  if (staticContentExists) {
    listDirectoryContents('./static/content');
  } else {
    console.log("./static/content directory doesn't exist!");
  }
} catch (error) {
  console.error("Error:", error.message);
}

// List all directories in current folder to help orientate
console.log("\n===== LISTING ALL TOP-LEVEL DIRECTORIES =====");
try {
  const items = fs.readdirSync('.');
  items.forEach(item => {
    try {
      const stats = fs.statSync(item);
      if (stats.isDirectory()) {
        console.log(`📁 ${item}/`);
      }
    } catch (error) {
      console.error(`Error checking ${item}:`, error.message);
    }
  });
} catch (error) {
  console.error("Error listing current directory:", error.message);
}
