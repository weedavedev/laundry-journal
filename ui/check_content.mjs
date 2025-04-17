// check-dirs.mjs
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Current working directory:", process.cwd());
console.log("Script directory:", __dirname);

// Function to list directories
function listFiles(dir) {
  console.log(`\nContents of ${dir}:`);
  try {
    if (!fs.existsSync(dir)) {
      console.log(`  Directory doesn't exist!`);
      return;
    }
    
    const items = fs.readdirSync(dir);
    if (items.length === 0) {
      console.log('  (empty directory)');
      return;
    }
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      try {
        const stats = fs.statSync(itemPath);
        const type = stats.isDirectory() ? 'dir' : 'file';
        console.log(`  ${item} (${type})`);
        
        // If it's a symlink, show where it points to
        if (fs.lstatSync(itemPath).isSymbolicLink()) {
          const linkTarget = fs.readlinkSync(itemPath);
          console.log(`    → symlink to: ${linkTarget}`);
        }
      } catch (err) {
        console.log(`  ${item} (error: ${err.message})`);
      }
    });
  } catch (err) {
    console.error(`Error reading ${dir}:`, err.message);
  }
}

// Check various directories
listFiles('./content');
listFiles('../content');  
listFiles('./static/content');

// List top-level directories for reference
console.log('\nTop-level directories in current folder:');
try {
  const items = fs.readdirSync('.');
  items.forEach(item => {
    try {
      if (fs.statSync(item).isDirectory()) {
        console.log(`  ${item}/`);
      }
    } catch (err) {}
  });
} catch (err) {
  console.error("Error:", err.message);
}
