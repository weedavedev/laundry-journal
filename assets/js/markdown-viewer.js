// Check for dark mode preference
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDarkMode) {
  document.body.classList.add('dark');
}

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click', function() {
  document.body.classList.toggle('dark');
  
  // Save preference to localStorage
  const isDarkMode = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDarkMode);
});

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const filePath = urlParams.get('file');

// Function to fetch and render a markdown file
async function fetchAndRenderMarkdown(filePath) {
  try {
    console.log("Fetching file:", filePath);
    const response = await fetch(filePath);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    console.log("File content length:", text.length);
    
    if (!text || text.trim() === '') {
      document.getElementById('content').innerHTML = `<p>The file "${filePath}" is empty.</p>`;
      return;
    }
    
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
          showMarkdownError("Error parsing frontmatter", e, content);
          return;
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
    
    // Try to parse the markdown with error collection
    const errors = [];
    const renderedHtml = safeMarkdownParse(content, errors);
    
    // If we have errors, show them in an error banner
    if (errors.length > 0) {
      showErrorBanner(errors);
    }
    
    // Display the rendered HTML
    document.getElementById('content').innerHTML = DOMPurify.sanitize(renderedHtml);
    
    // Generate table of contents
    generateTableOfContents();
  } catch (error) {
    console.error('Error fetching or rendering markdown:', error);
    showMarkdownError("Error loading markdown", error, "");
  }
}

// Display a banner with markdown errors
function showErrorBanner(errors) {
  // Create error banner if it doesn't exist
  let errorBanner = document.getElementById('markdown-errors');
  if (!errorBanner) {
    errorBanner = document.createElement('div');
    errorBanner.id = 'markdown-errors';
    errorBanner.className = 'error-banner';
    errorBanner.innerHTML = `
      <div class="error-header">
        <h3>⚠️ Markdown formatting issues detected</h3>
        <button id="toggle-errors">Show Details</button>
      </div>
      <div class="error-details" style="display: none;"></div>
    `;
    
    // Insert after header
    const header = document.querySelector('.header');
    header.parentNode.insertBefore(errorBanner, header.nextSibling);
    
    // Add toggle functionality
    document.getElementById('toggle-errors').addEventListener('click', function() {
      const details = document.querySelector('.error-details');
      const isHidden = details.style.display === 'none';
      details.style.display = isHidden ? 'block' : 'none';
      this.textContent = isHidden ? 'Hide Details' : 'Show Details';
    });
  }
  
  // Update error details
  const errorDetails = errorBanner.querySelector('.error-details');
  errorDetails.innerHTML = `
    <p>The following issues were found in your markdown:</p>
    <ul>
      ${errors.map(err => `<li>${escapeHtml(err.message)}</li>`).join('')}
    </ul>
    <p>These issues have been handled automatically, but you may want to fix them in your source file.</p>
  `;
}

// Show a full error with the markdown content
function showMarkdownError(title, error, markdownContent) {
  const contentElement = document.getElementById('content');
  contentElement.innerHTML = `
    <div class="error-display">
      <h2>${escapeHtml(title)}</h2>
      <p class="error-message">${escapeHtml(error.message || "Unknown error")}</p>
      ${markdownContent ? `
        <div class="error-source">
          <h3>Markdown Source:</h3>
          <pre>${escapeHtml(markdownContent)}</pre>
        </div>
      ` : ''}
    </div>
  `;
}

// Safe markdown parsing function with specific fixes for your issues
function safeMarkdownParse(markdown, errorsArray = []) {
  try {
    // Create a custom renderer
    const renderer = new marked.Renderer();
    
    // Fix the heading renderer to handle object issues
    renderer.heading = function(text, level, raw) {
      // Fix for [object Object] issues - convert objects to strings properly
      if (typeof text === 'object') {
        console.log('Found object in heading text:', text);
        text = JSON.stringify(text) || 'Heading';
      }
      
      if (typeof raw === 'object') {
        console.log('Found object in heading raw:', raw);
        raw = JSON.stringify(raw) || 'heading';
      }
      
      // Ensure raw is a string
      if (!raw || typeof raw !== 'string') {
        raw = String(text || '').trim();
        errorsArray.push(new Error('Undefined or non-string heading text encountered'));
      }
      
      // Generate an ID - safely
      let id = '';
      try {
        // Avoid toLowerCase issues by ensuring raw is a string
        id = raw.toString().toLowerCase().replace(/[\s\W-]+/g, '-');
      } catch (e) {
        console.error('Error creating heading ID:', e);
        id = 'heading-' + Math.random().toString(36).substring(2, 10);
        errorsArray.push(new Error('Error creating heading ID: ' + e.message));
      }
      
      return `<h${level} id="${id}">${text}</h${level}>`;
    };
    
    // Override list methods too, as they can cause similar issues
    renderer.listitem = function(text) {
      if (typeof text === 'object') {
        text = JSON.stringify(text) || '';
      }
      return `<li>${text}</li>`;
    };
    
    // Fix code blocks
    renderer.code = function(code, language) {
      if (typeof code === 'object') {
        code = JSON.stringify(code, null, 2) || '';
      }
      return `<pre><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
    };
    
    // Fix paragraphs
    renderer.paragraph = function(text) {
      if (typeof text === 'object') {
        text = JSON.stringify(text) || '';
      }
      return `<p>${text}</p>`;
    };
    
    // Set marked options with much higher safety
    marked.setOptions({
      renderer: renderer,
      headerIds: true,
      gfm: true,
      breaks: false,
      pedantic: false,
      smartLists: true,
      smartypants: false,
      mangle: false, // Disable mangling to avoid ID issues
      silent: true   // Don't throw fatal errors
    });
    
    // Pre-process markdown to catch common issues
    const preprocessed = markdown
      // Replace any [object Object] literals that might be in the text
      .replace(/\[object Object\]/g, '_Object_');
    
    return marked.parse(preprocessed);
  } catch (e) {
    console.error("Fatal error in markdown parsing:", e);
    errorsArray.push(e);
    
    // Fallback to basic escaping
    return `<p>Error parsing markdown. Displaying raw content:</p>
            <pre>${escapeHtml(markdown)}</pre>`;
  }
}
// Helper function to escape HTML
function escapeHtml(text) {
  if (text === undefined || text === null) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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
      const id = heading.id || '';
      const text = heading.textContent || '';
      
      // Create list item with link to heading
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = id ? `#${id}` : '#';
      link.textContent = text;
      listItem.appendChild(link);
      
      // Adjust nesting based on heading level
      if (level > currentLevel) {
        // Create a new nested list
        const nestedList = document.createElement('ul');
        if (parentLists[parentLists.length - 1].lastChild) {
          parentLists[parentLists.length - 1].lastChild.appendChild(nestedList);
          parentLists.push(nestedList);
          currentList = nestedList;
          currentLevel = level;
        }
      } else if (level < currentLevel) {
        // Move up to parent list
        const levelsUp = currentLevel - level;
        for (let i = 0; i < levelsUp && parentLists.length > 1; i++) {
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
    
    if (files.length === 0) {
      fileList.innerHTML = '<li>No markdown files found.</li>';
      return;
    }
    
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
  // Load dark mode preference from localStorage
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    document.body.classList.add('dark');
  } else if (savedDarkMode === 'false') {
    document.body.classList.remove('dark');
  }
  
  // Fetch file list
  fetchFileList();
  
  // Render markdown if file is specified
  if (filePath) {
    fetchAndRenderMarkdown(filePath);
  } else {
    document.getElementById('content').innerHTML = '<p>Select a markdown file from the list.</p>';
  }
});
