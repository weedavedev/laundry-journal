#!/bin/bash
# Script to build and run the Go Markdown server

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "Go is not installed. Please install Go first."
    echo "Visit https://golang.org/doc/install for installation instructions."
    exit 1
fi

# Default port
PORT=8000

# Check if a port was provided as an argument
if [ $# -eq 1 ]; then
  PORT=$1
fi

# Check if markdown-server.go exists
if [ ! -f "markdown-server.go" ]; then
  echo "Error: markdown-server.go is missing."
  echo "This file should be in the same directory as this script."
  exit 1
fi

# Check for required directory structure
REQUIRED_DIRS=("content" "assets" "assets/css" "assets/js")
MISSING_DIRS=()

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$dir" ]; then
    MISSING_DIRS+=("$dir")
  fi
done

# Create missing directories if needed
if [ ${#MISSING_DIRS[@]} -ne 0 ]; then
  echo "Creating missing directories:"
  for dir in "${MISSING_DIRS[@]}"; do
    echo "  - $dir"
    mkdir -p "$dir"
  done
fi

# Check for required files
REQUIRED_FILES=(
  "assets/markdown-viewer.html"
  "assets/css/markdown-viewer.css"
  "assets/js/markdown-viewer.js"
)
MISSING_FILES=()

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    MISSING_FILES+=("$file")
  fi
done

# Warn about missing files
if [ ${#MISSING_FILES[@]} -ne 0 ]; then
  echo "Warning: The following required files are missing:"
  for file in "${MISSING_FILES[@]}"; do
    echo "  - $file"
  done
  echo "Please ensure these files are in place before running the server."
fi

# Build the Go server
echo "Building the Go Markdown server..."
go build -o markdown-viewer markdown-server.go

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "Failed to build the Go server. Please check for errors."
    exit 1
fi

# Run the server
echo "Starting the Markdown viewer server on port $PORT..."
echo "Open your browser to http://localhost:$PORT"
echo "Press Ctrl+C to stop the server"
./markdown-viewer -port=$PORT
