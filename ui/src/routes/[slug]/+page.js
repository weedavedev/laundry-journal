import { getMarkdownBySlug } from '$lib/utils/markdown-loader';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
  const { slug } = params;
  const markdown = await getMarkdownBySlug(slug);
  
  if (!markdown) {
    throw error(404, {
      message: `Not found: ${slug}`
    });
  }
  
  return {
    markdown
  };
}
