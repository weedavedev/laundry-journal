import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  assetsInclude: ['**/*.md'], // Add this line to include markdown files
  server: {
    fs: {
      // Allow serving files from one directory up
      allow: ['..']
    }
  }
});
