#!/usr/bin/env node

/**
 * SvelteKit Workspace Opener for Neovim (ESM Version)
 * 
 * A utility to open all relevant files for a SvelteKit project in Neovim.
 * Compatible with ES modules (type: "module" in package.json).
 * 
 * Usage in package.json:
 * {
 *   "scripts": {
 *     "workspace": "node svelte-workspace-nvim.js",
 *   }
 * }
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Get the current file and directory name when using ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Always use Neovim
  editor: 'nvim',
  
  // Important files to open
  importantFiles: [
    // Core SvelteKit files
    'src/app.html',
    'src/app.css',
    'src/app.d.ts',
    'svelte.config.js',
    'package.json',
    
    // Route files
    'src/routes/+layout.svelte',
    'src/routes/+page.svelte',
    'src/routes/+page.js',
    'src/routes/markdown/+page.svelte',
    'src/routes/markdown/+page.js',
    'src/routes/[slug]/+page.svelte',
    'src/routes/[slug]/+page.js',
    
    // Components and utilities
    'src/lib/components/Layout.svelte',
    'src/lib/components/md_tester.svelte',
    'src/lib/components/TestComponent.svelte',
    'src/lib/markdown-loader.js',
    'src/lib/index.ts',
    'src/scripts/generate-content-index.js'
  ]
};

// Check which files exist
const existingFiles = CONFIG.importantFiles.filter(file => fs.existsSync(file));

if (existingFiles.length === 0) {
  console.log('No matching files found.');
  process.exit(0);
}

// Format files for Neovim
console.log(`Opening ${existingFiles.length} files with nvim...`);

// With Neovim, we have several options:

// OPTION 1: Open Neovim with the first file, then :badd the rest
// This is generally the best approach for terminal-based editors
const firstFile = existingFiles[0];
const remainingFiles = existingFiles.slice(1);

// Create a temporary vimrc file to load all files into buffers
const tempVimrcPath = path.join(process.cwd(), '.temp_nvimrc');
const vimCommands = [
  // Start with empty buffer settings (optional)
  'set hidden',
  'set switchbuf=useopen',
  
  // Add each additional file as a buffer
  ...remainingFiles.map(file => `badd ${file}`),
  
  // Optional: Set up key mappings for buffer navigation
  'nnoremap <F2> :buffers<CR>:buffer<Space>',
  'nnoremap <F3> :bnext<CR>',
  'nnoremap <F4> :bprev<CR>',
  
  // Message to show user help
  'echo "Use F2 to list buffers, F3/F4 to navigate between files"'
];

// Write the temporary vimrc
fs.writeFileSync(tempVimrcPath, vimCommands.join('\n'), 'utf8');

// Launch Neovim with the temporary config
try {
  const nvimArgs = ['-u', tempVimrcPath, firstFile];
  const nvimProcess = spawn(CONFIG.editor, nvimArgs, { 
    stdio: 'inherit',
    detached: false
  });
  
  // Clean up the temporary file when Neovim exits
  nvimProcess.on('exit', () => {
    try {
      fs.unlinkSync(tempVimrcPath);
    } catch (err) {
      // Ignore errors when deleting the temp file
    }
  });
  
  // Handle the case where the process fails to start
  nvimProcess.on('error', (err) => {
    console.error(`Failed to start Neovim: ${err.message}`);
    try {
      fs.unlinkSync(tempVimrcPath);
    } catch (cleanupErr) {
      // Ignore errors when deleting the temp file
    }
    process.exit(1);
  });
  
} catch (error) {
  console.error(`Error launching Neovim: ${error.message}`);
  try {
    fs.unlinkSync(tempVimrcPath);
  } catch (cleanupErr) {
    // Ignore errors when deleting the temp file
  }
  process.exit(1);
}
