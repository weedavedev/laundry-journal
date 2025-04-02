package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// Configuration options
var (
	port = flag.Int("port", 8000, "Port to serve on")
)

// walkMarkdownFiles walks the file tree and collects markdown files
func walkMarkdownFiles() ([]string, error) {
	var files []string

	// Walk the content directory specifically for Markdown files
	err := filepath.Walk("content", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		
		// Skip hidden directories and files (starting with .)
		if strings.HasPrefix(filepath.Base(path), ".") && info.IsDir() {
			return filepath.SkipDir
		}
		if strings.HasPrefix(filepath.Base(path), ".") {
			return nil
		}

		// Collect only markdown files
		if !info.IsDir() && strings.HasSuffix(path, ".md") {
			// Convert Windows paths to web paths if needed
			webPath := strings.ReplaceAll(path, "\\", "/")
			files = append(files, webPath)
		}
		return nil
	})

	return files, err
}

// filesHandler handles requests for the list of markdown files
func filesHandler(w http.ResponseWriter, r *http.Request) {
	files, err := walkMarkdownFiles()
	if err != nil {
		http.Error(w, "Error reading files", http.StatusInternalServerError)
		log.Printf("Error reading files: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(files)
}

// indexHandler serves the HTML viewer
func indexHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" && r.URL.Path != "/index.html" {
		http.NotFound(w, r)
		return
	}

	content, err := ioutil.ReadFile("assets/markdown-viewer.html")
	if err != nil {
		http.Error(w, "Markdown viewer HTML not found in assets directory", http.StatusInternalServerError)
		log.Printf("Error reading assets/markdown-viewer.html: %v", err)
		return
	}

	w.Header().Set("Content-Type", "text/html")
	w.Write(content)
}

// checkRequiredDirs verifies all necessary directories and files exist
func checkRequiredDirs() error {
	// Check for content directory
	if _, err := os.Stat("content"); os.IsNotExist(err) {
		return fmt.Errorf("content directory not found")
	}
	
	// Check for assets directory
	if _, err := os.Stat("assets"); os.IsNotExist(err) {
		return fmt.Errorf("assets directory not found")
	}
	
	// Check for assets/css directory
	if _, err := os.Stat("assets/css"); os.IsNotExist(err) {
		return fmt.Errorf("assets/css directory not found")
	}
	
	// Check for assets/js directory
	if _, err := os.Stat("assets/js"); os.IsNotExist(err) {
		return fmt.Errorf("assets/js directory not found")
	}
	
	// Check for HTML file
	if _, err := os.Stat("assets/markdown-viewer.html"); os.IsNotExist(err) {
		return fmt.Errorf("assets/markdown-viewer.html not found")
	}
	
	// Check for CSS file
	if _, err := os.Stat("assets/css/markdown-viewer.css"); os.IsNotExist(err) {
		return fmt.Errorf("assets/css/markdown-viewer.css not found")
	}
	
	// Check for JS file
	if _, err := os.Stat("assets/js/markdown-viewer.js"); os.IsNotExist(err) {
		return fmt.Errorf("assets/js/markdown-viewer.js not found")
	}
	
	return nil
}

func main() {
	flag.Parse()

	// Check if required directories exist
	if err := checkRequiredDirs(); err != nil {
		log.Fatalf("Error: %v", err)
	}

	// Set up handlers
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/files", filesHandler)
	
	// Serve markdown files from content directory
	http.Handle("/content/", http.StripPrefix("/content/", http.FileServer(http.Dir("content"))))
	
	// Serve CSS files from assets/css
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("assets/css"))))
	
	// Serve JS files from assets/js
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("assets/js"))))
	
	// Serve the entire assets directory
	http.Handle("/assets/", http.StripPrefix("/assets/", http.FileServer(http.Dir("assets"))))
	
	// Start server
	addr := fmt.Sprintf(":%d", *port)
	log.Printf("Starting Markdown server at http://localhost%s/", addr)
	log.Printf("Press Ctrl+C to stop the server")
	log.Fatal(http.ListenAndServe(addr, nil))
}
