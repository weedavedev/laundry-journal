# Learning Journal

A personal knowledge management system that functions as both a searchable resource and a chronological blog of things I've learned.

## Overview

This repository serves as my digital learning journal - a place to document and organize everything I learn in my technical journey. It combines the benefits of:

1. **Knowledge Base**: A structured, searchable collection of technical notes
2. **Learning Blog**: A chronological record of my learning path
3. **Version History**: Git tracking showing how my understanding evolves

## How It Works

### Structure

```
.
├── assets/               # Static assets for the viewer
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── markdown-viewer.html  # Main HTML template
├── content/              # Markdown files containing knowledge
│   ├── TEMPLATE.md       # Template for new entries
│   └── *.md              # Individual topic files
├── markdown-server.go    # Go web server for viewing content
├── markdown-server.sh    # Shell script to run the server
└── README.md             # This file
```

### Dual Purpose

1. **Resource**: The content directory contains standalone markdown files organized by topic. Each file follows a consistent template with:
   - Frontmatter metadata (title, date, tags)
   - Table of contents
   - Structured content with examples, notes, and code snippets

2. **Blog**: Commit messages serve as blog entries, documenting when and what I learned. The message format is:
   ```
   [CATEGORY] Title | #tag1 #tag2
   
   More detailed description of what was learned
   ```

### Usage

#### Adding New Content

1. Copy `content/TEMPLATE.md` to create a new file
2. Fill in the template with new knowledge
3. Commit with a descriptive message using the format above
4. Push to keep the remote repository updated

#### Viewing Content

Run the markdown viewer server:
```bash
./markdown-server.sh
```

This starts a local server with:
- A list of all markdown files
- Full-text search
- Tag-based filtering
- Responsive design with dark mode support

Then open your browser to http://localhost:8000

## Features

- **GitHub-style Markdown**: Content is rendered in a familiar GitHub style
- **Tag System**: Content can be filtered by tags
- **Auto-generated TOC**: Table of contents created from markdown headings
- **Dark Mode**: Toggle between light and dark themes
- **Error Detection**: Warnings for markdown formatting issues
- **Version History**: Complete history of changes preserved with Git

## Implementation

The viewer is built with:
- **Go**: Simple and fast HTTP server
- **JavaScript**: Browser-side rendering of markdown with Marked.js
- **CSS**: GitHub-inspired styling
- **HTML**: Responsive and accessible design

## Markdown Guidelines

To ensure proper rendering and consistent formatting:

1. **Avoid square brackets in headings** - Use plain text for section headers
2. **Add spacing after code blocks** - Include a blank line after each code block
3. **Use standard frontmatter format**:
   ```
   ---
   title: Topic Name
   date: YYYY-MM-DD
   updated: YYYY-MM-DD
   tags: [tag1, tag2, tag3]
   category: category-name
   ---
   ```
4. **Follow the template structure** - Maintain consistent heading levels and formatting

## Future Plans

- SvelteKit frontend for improved browsing experience
- Full-text search capabilities
- Spaced repetition system for revisiting important concepts
- Visualization of learning journey and connections between topics
- GitHub Pages integration for public sharing
- Mobile app with offline capabilities

## Getting Started

If you're forking or cloning this repository:

1. Ensure Go is installed on your system
2. Clone the repository
3. Run `./markdown-server.sh` to start the server
4. Begin adding your own content to the `content/` directory

---

*This learning journal is inspired by the "second brain" concept and aims to transform how I document and recall technical knowledge.*
