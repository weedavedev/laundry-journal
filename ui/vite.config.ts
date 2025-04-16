import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Add this to include markdown files
  assetsInclude: ['**/*.md'],
  // Optional: add markdown handling
  optimizeDeps: {
    include: ['marked', 'js-yaml']
  }
});
