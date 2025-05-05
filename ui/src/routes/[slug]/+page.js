import { getMarkdownBySlug } from '$lib/components/markdown-loader';
import { error } from '@sveltejs/kit';

export async function load({ params }) {

  const { slug } = params;
	console.log("atttempting to load", slug);
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
