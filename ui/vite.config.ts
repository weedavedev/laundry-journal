import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  
  // Include markdown files as assets
  assetsInclude: ['**/*.md'],
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['marked', 'js-yaml']
  },
  
  // Server options for development
  server: {
    fs: {
      // Allow serving files from one level up (where content directory might be)
      allow: ['..', './static/content']
    }
  },
  
  // Build options for production
  build: {
    // Copy files from static directory (including our symlinked or generated content)
    outDir: 'build'
  }
});
