import os
from datetime import datetime

def combine_mern_project(project_path, output_file):
    """
    Combines essential MERN stack files into a single text file.
    
    Args:
        project_path (str): Path to the MERN project root directory
        output_file (str): Path where the combined text file will be saved
    """
    
    # Define essential MERN files and patterns
    essential_patterns = {
        # Backend (Node/Express)
        'server.js',
        'app.js',
        'index.js',
        'package.json',
        'routes',
        'controllers',
        'models',
        'middleware',
        'config',
        
        # Frontend (React)
        'src/App.js',
        'src/App.jsx',
        'src/index.js',
        'src/index.jsx',
        'src/components',
        'src/pages',
        
        'src/services',
        'src/utils',
        
        # MongoDB
        'database.js',
        'db.js',
        '.env'  # For database connection strings
    }
    
    # Files/folders to always exclude
    exclude_dirs = {
        'node_modules',
        'build',
        'dist',
        '.git',
        'public'
    }
    
    def should_include_file(filepath):
        # Check if file or directory should be included
        relative_path = os.path.relpath(filepath, project_path)
        
        # Exclude directories we don't want
        if any(excluded in relative_path for excluded in exclude_dirs):
            return False
            
        # Check if the path matches any of our essential patterns
        return any(
            pattern in relative_path.replace('\\', '/') 
            for pattern in essential_patterns
        )
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        # Write header
        outfile.write(f"Essential MERN Stack Files\n")
        outfile.write(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        outfile.write("=" * 80 + "\n\n")
        
        # Walk through project directory
        for root, dirs, files in os.walk(project_path):
            # Remove excluded directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for filename in sorted(files):
                filepath = os.path.join(root, filename)
                if should_include_file(filepath):
                    relative_path = os.path.relpath(filepath, project_path)
                    
                    try:
                        with open(filepath, 'r', encoding='utf-8') as infile:
                            content = infile.read()
                            
                            # Write file header
                            outfile.write(f"File: {relative_path}\n")
                            outfile.write("-" * 80 + "\n\n")
                            
                            # Write file content
                            outfile.write(content)
                            outfile.write("\n\n" + "=" * 80 + "\n\n")
                    except Exception as e:
                        outfile.write(f"Error reading {relative_path}: {str(e)}\n\n")

if __name__ == "__main__":
    # Get current directory as default project path
    default_project_path = os.getcwd()
    
    # Get user input for paths
    project_path = input(f"Enter project path (press Enter for current directory '{default_project_path}'): ").strip()
    if not project_path:
        project_path = default_project_path
    
    output_file = input("Enter output file path (press Enter for 'mern_essential_files.txt'): ").strip()
    if not output_file:
        output_file = "mern_essential_files.txt"
    
    # Run the combiner
    try:
        combine_mern_project(project_path, output_file)
        print(f"\nEssential MERN files combined into {output_file}")
    except Exception as e:
        print(f"\nError: {str(e)}")