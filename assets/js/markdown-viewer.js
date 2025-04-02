// Check for dark mode preference
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDarkMode) {
  document.body.classList.add('dark');
}

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', function() {
  document.body.classList.toggle('dark');
});

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const filePath = urlParams.get('file');

// Function to fetch and render a markdown file
async function fetchAndRenderMarkdown(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const text = await response.text();
    
    // Parse frontmatter
    let content = text;
    let frontmatter = null;
    
    if (text.startsWith('---')) {
      const endOfFrontmatter = text.indexOf('---', 3);
      if (endOfFrontmatter !== -1) {
        try {
          const frontmatterText = text.substring(3, endOfFrontmatter).trim();
          frontmatter = jsyaml.load(frontmatterText);
          content = text.substring(endOfFrontmatter + 3).trim();
        } catch (e) {
          console.error('Error parsing frontmatter:', e);
        }
      }
    }
    
    // Display tags if available
    if (frontmatter && frontmatter.tags) {
      const tagsContainer = document.getElementById('tag-container');
      const tagsElement = document.getElementById('tags');
      tagsContainer.style.display = 'block';
      tagsElement.innerHTML = '';
      
      if (Array.isArray(frontmatter.tags)) {
        frontmatter.tags.forEach(tag => {
          const tagEl = document.createElement('span');
          tagEl.className = 'tag';
          tagEl.textContent = tag;
          tagsElement.appendChild(tagEl);
        });
      }
    }
    
    // Set page title
    if (frontmatter && frontmatter.title) {
      document.title = frontmatter.title + ' - Learning Journal';
    } else {
      document.title = filePath + ' - Learning Journal';
    }
    
    // Render markdown content
    const renderer = new marked.Renderer();
    
    // Custom heading renderer to generate IDs for TOC
    renderer.heading = function(text, level, raw, slugger) {
      const id = raw.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${level} id="${id}">${text}</h${level}>`;
    };
    
    // Set marked options
    marked.setOptions({
      renderer: renderer,
      highlight: function(code, language) {
        return code;
      },
      gfm: true,
      breaks: false,
      pedantic: false,
      smartLists: true,
      smartypants: false
    });
    
    // Render the content
    const renderedHtml = marked.parse(content);
    document.getElementById('content').innerHTML = DOMPurify.sanitize(renderedHtml);
    
    // Generate table of contents
    generateTableOfContents();
  } catch (error) {
    console.error('Error fetching or rendering markdown:', error);
    document.getElementById('content').innerHTML = `<p>Error loading ${filePath}: ${error.message}</p>`;
  }
}

// Generate table of contents from headings
function generateTableOfContents() {
  const headings = document.querySelectorAll('#content h2, #content h3, #content h4');
  if (headings.length > 0) {
    const tocContainer = document.getElementById('toc-container');
    const tocElement = document.getElementById('toc');
    tocContainer.style.display = 'block';
    tocElement.innerHTML = '';
    
    const toc = document.createElement('ul');
    let currentLevel = 2;
    let currentList = toc;
    let parentLists = [toc];
    
    headings.forEach(heading => {
      const level = parseInt(heading.tagName.substring(1));
      const id = heading.id;
      const text = heading.textContent;
      
      // Create list item with link to heading
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = text;
      listItem.appendChild(link);
      
      // Adjust nesting based on heading level
      if (level > currentLevel) {
        // Create a new nested list
        const nestedList = document.createElement('ul');
        parentLists[parentLists.length - 1].lastChild.appendChild(nestedList);
        parentLists.push(nestedList);
        currentList = nestedList;
        currentLevel = level;
      } else if (level < currentLevel) {
        // Move up to parent list
        const levelsUp = currentLevel - level;
        for (let i = 0; i < levelsUp; i++) {
          parentLists.pop();
        }
        currentList = parentLists[parentLists.length - 1];
        currentLevel = level;
      }
      
      currentList.appendChild(listItem);
    });
    
    tocElement.appendChild(toc);
  }
}

// Fetch and display list of markdown files
async function fetchFileList() {
  try {
    const response = await fetch('/files');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const files = await response.json();
    const fileList = document.getElementById('files');
    
    files.forEach(file => {
      if (file.endsWith('.md')) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `?file=${file}`;
        link.textContent = file;
        listItem.appendChild(link);
        fileList.appendChild(listItem);
      }
    });
  } catch (error) {
    console.error('Error fetching file list:', error);
    document.getElementById('files').innerHTML = `<li>Error loading file list: ${error.message}</li>`;
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  fetchFileList();
  
  if (filePath) {
    fetchAndRenderMarkdown(filePath);
  } else {
    document.getElementById('content').innerHTML = '<p>Select a markdown file from the list.</p>';
  }
});
