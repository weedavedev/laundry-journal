import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  // Optional: add explicit file inclusion
  optimizeDeps: {
    include: ['../content/**/*.md']
  }
});
