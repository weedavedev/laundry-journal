import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // Use the static adapter for GitHub Pages
    adapter: adapter({
      // GitHub Pages deployment specific settings
      pages: 'build',
      assets: 'build',
      fallback: 'index.html',
      precompress: false
    }),
    
    // If your GitHub Pages site is hosted at a subdirectory (e.g., username.github.io/learning-journal)
    // uncomment and set this:
    // paths: {
    //   base: '/learning-journal'
    // }
  }
};

export default config;
