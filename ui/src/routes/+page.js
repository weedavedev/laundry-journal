import { getAllMarkdownFiles, getAllTags, getAllCategories } from '$lib/utils/markdown-loader';

export async function load() {
  const files = await getAllMarkdownFiles();
  const tags = await getAllTags();
  const categories = await getAllCategories();
  
  // Sort files by date (newest first)
  const sortedFiles = [...files].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  
  return {
    files: sortedFiles,
    tags,
    categories,
    recentFiles: sortedFiles.slice(0, 5) // Get 5 most recent files
  };
}
