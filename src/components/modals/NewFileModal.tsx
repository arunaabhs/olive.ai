import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

interface NewFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (fileName: string, template?: string) => void;
  onFileCreated?: (fileName: string, template?: string) => void;
  isDarkMode?: boolean;
}

const NewFileModal: React.FC<NewFileModalProps> = ({ isOpen, onClose, onCreateFile, onFileCreated, isDarkMode = false }) => {
  const [fileName, setFileName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-900',
    surface: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    input: 'bg-gray-700 border-gray-600 text-gray-100',
    dropdown: 'bg-gray-800 border-gray-600'
  } : {
    bg: 'bg-white',
    surface: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    input: 'bg-white border-gray-300 text-gray-900',
    dropdown: 'bg-white border-gray-200'
  };

  const templates = [
    {
      id: 'text',
      name: 'Text File',
      extension: '.txt',
      icon: '📝',
      template: `This is a new text file.

Start writing your content here...
`
    },
    {
      id: 'javascript',
      name: 'JavaScript File',
      extension: '.js',
      icon: '📄',
      template: `// New JavaScript file
console.log('Hello, World!');

// Your code here...
`
    },
    {
      id: 'typescript',
      name: 'TypeScript File',
      extension: '.ts',
      icon: '🔷',
      template: `// New TypeScript file
interface Example {
  message: string;
}

const example: Example = {
  message: 'Hello, TypeScript!'
};

console.log(example.message);
`
    },
    {
      id: 'react',
      name: 'React Component',
      extension: '.tsx',
      icon: '⚛️',
      template: `import React from 'react';

interface Props {
  // Define your props here
}

const NewComponent: React.FC<Props> = () => {
  return (
    <div>
      <h1>New Component</h1>
      <p>Your component content here...</p>
    </div>
  );
};

export default NewComponent;
`
    },
    {
      id: 'python',
      name: 'Python File',
      extension: '.py',
      icon: '🐍',
      template: `#!/usr/bin/env python3
"""
New Python file
"""

def main():
    print("Hello, Python!")
    # Your code here...

if __name__ == "__main__":
    main()
`
    },
    {
      id: 'html',
      name: 'HTML File',
      extension: '.html',
      icon: '🌐',
      template: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New HTML File</title>
</head>
<body>
    <h1>Hello, HTML!</h1>
    <p>Your content here...</p>
</body>
</html>
`
    },
    {
      id: 'java',
      name: 'Java File',
      extension: '.java',
      icon: '☕',
      template: `public class NewFile {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
        // Your code here...
    }
}
`
    },
    {
      id: 'c',
      name: 'C File',
      extension: '.c',
      icon: '⚙️',
      template: `#include <stdio.h>

int main() {
    printf("Hello, C!\\n");
    // Your code here...
    return 0;
}
`
    },
    {
      id: 'cpp',
      name: 'C++ File',
      extension: '.cpp',
      icon: '⚡',
      template: `#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    // Your code here...
    return 0;
}
`
    },
    {
      id: 'php',
      name: 'PHP File',
      extension: '.php',
      icon: '🐘',
      template: `<?php

echo "Hello, PHP!";
// Your code here...

?>
`
    },
    {
      id: 'csharp',
      name: 'C# File',
      extension: '.cs',
      icon: '🔷',
      template: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, C#!");
        // Your code here...
    }
}
`
    },
    {
      id: 'markdown',
      name: 'Markdown File',
      extension: '.md',
      icon: '📖',
      template: `# New Markdown File

## Introduction

This is a new markdown file. You can write documentation, notes, or any text content here.

### Features

- **Bold text**
- *Italic text*
- \`Code snippets\`
- [Links](https://example.com)

### Code Example

\`\`\`javascript
console.log('Hello from markdown!');
\`\`\`

---

*Happy writing!*
`
    }
  ];

  const handleCreate = () => {
    if (!fileName.trim()) return;

    const template = templates.find(t => t.id === selectedTemplate);
    const finalFileName = fileName.includes('.') ? fileName : fileName + (template?.extension || '.js');
    
    onCreateFile(finalFileName, template?.template || '');
    
    if (onFileCreated) {
      onFileCreated(finalFileName, template?.template || '');
    }
    
    setFileName('');
    setSelectedTemplate(null);
    setShowTemplateDropdown(false);
    onClose();
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template && !fileName.includes('.')) {
      // Only update filename if it doesn't already have an extension
      setFileName(fileName.replace(/\.[^/.]+$/, '') + template.extension);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.bg} rounded-2xl shadow-xl w-full max-w-md border ${themeClasses.border}`}>
        <div className={`flex items-center justify-between p-4 border-b ${themeClasses.border}`}>
          <h2 className={`text-lg font-medium ${themeClasses.text}`}>New File</h2>
          <button
            onClick={onClose}
            className={`p-1.5 hover:bg-gray-600/20 rounded-lg transition-colors ${themeClasses.textSecondary}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-1.5`}>
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name..."
              className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreate();
                }
              }}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-1.5`}>
              File Type
            </label>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className={`w-full px-3 py-2 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between text-sm`}
              >
                <div className="flex items-center space-x-2">
                  {selectedTemplate && (
                    <span className="text-sm">
                      {templates.find(t => t.id === selectedTemplate)?.icon}
                    </span>
                  )}
                  <span className={selectedTemplate ? themeClasses.text : themeClasses.textSecondary}>
                    {selectedTemplate 
                      ? templates.find(t => t.id === selectedTemplate)?.name 
                      : 'Select type...'
                    }
                  </span>
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showTemplateDropdown && (
                <div className={`absolute top-full left-0 right-0 mt-1 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto`}>
                  {templates.map((template) => {
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => {
                          handleTemplateSelect(template.id);
                          setShowTemplateDropdown(false);
                        }}
                        className={`w-full p-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2.5 ${
                          selectedTemplate === template.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <span className="text-sm">{template.icon}</span>
                        <div>
                          <div className={`text-sm font-medium ${themeClasses.text}`}>{template.name}</div>
                          <div className={`text-xs ${themeClasses.textSecondary}`}>{template.extension}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 pt-2">
            <button
              onClick={onClose}
              className={`px-3 py-1.5 rounded-lg border ${themeClasses.border} ${themeClasses.textSecondary} hover:bg-gray-600/10 transition-colors text-sm`}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!fileName.trim()}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Create File
            </button>
          </div>
        </div>
        
        {/* Click outside to close dropdown */}
        {showTemplateDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowTemplateDropdown(false)}
          />
        )}
      </div>
    </div>
  );
};

export default NewFileModal;