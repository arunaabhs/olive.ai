import React, { useState } from 'react';
import { X, File, FileText, Code, Database, Image, Settings, ChevronDown } from 'lucide-react';

interface NewFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFile: (name: string, template?: string) => void;
  onFileCreated?: (fileName: string) => void;
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
    input: 'bg-gray-700 border-gray-600 text-gray-100'
  } : {
    bg: 'bg-white',
    surface: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    input: 'bg-white border-gray-300 text-gray-900'
  };

  const templates = [
    {
      id: 'text',
      name: 'Text File',
      extension: '.txt',
      icon: FileText,
      template: `This is a new text file.

Start writing your content here...
`
    },
    {
      id: 'javascript',
      name: 'JavaScript File',
      extension: '.js',
      icon: Code,
      template: `// New JavaScript file
console.log('Hello, World!');

// Your code here...
`
    },
    {
      id: 'typescript',
      name: 'TypeScript File',
      extension: '.ts',
      icon: Code,
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
      icon: Code,
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
      icon: Code,
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
      icon: FileText,
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
      id: 'css',
      name: 'CSS File',
      extension: '.css',
      icon: FileText,
      template: `/* New CSS file */

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 20px;
  line-height: 1.6;
}

/* Your styles here... */
`
    },
    {
      id: 'json',
      name: 'JSON File',
      extension: '.json',
      icon: Database,
      template: `{
  "name": "new-file",
  "version": "1.0.0",
  "description": "A new JSON file"
}
`
    },
    {
      id: 'markdown',
      name: 'Markdown File',
      extension: '.md',
      icon: FileText,
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
    
    onCreateFile(finalFileName, template?.template);
    
    // Notify parent component about the new file
    if (onFileCreated) {
      onFileCreated(finalFileName);
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.bg} rounded-xl shadow-2xl w-full max-w-2xl border ${themeClasses.border}`}>
        <div className={`flex items-center justify-between p-6 border-b ${themeClasses.border}`}>
          <h2 className={`text-xl font-semibold ${themeClasses.text}`}>Create New File</h2>
          <button
            onClick={onClose}
            className={`p-2 hover:bg-gray-600/20 rounded-lg transition-colors ${themeClasses.textSecondary}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              File Name
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name..."
              className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreate();
                }
              }}
            />
          </div>

          <div className="mb-6">
            <label className={`block text-sm font-medium ${themeClasses.text} mb-3`}>
              File Type
            </label>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTemplateDropdown(!showTemplateDropdown)}
                className={`w-full px-4 py-3 rounded-lg border ${themeClasses.input} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between`}
              >
                <span className={selectedTemplate ? themeClasses.text : themeClasses.textSecondary}>
                  {selectedTemplate 
                    ? templates.find(t => t.id === selectedTemplate)?.name 
                    : 'Select file type...'
                  }
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showTemplateDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showTemplateDropdown && (
                <div className={`absolute top-full left-0 right-0 mt-1 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto`}>
                  {templates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => {
                          handleTemplateSelect(template.id);
                          setShowTemplateDropdown(false);
                        }}
                        className={`w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center space-x-3 ${
                          selectedTemplate === template.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${selectedTemplate === template.id ? 'text-blue-600' : themeClasses.textSecondary}`} />
                        <div>
                          <div className={`font-medium ${themeClasses.text}`}>{template.name}</div>
                          <div className={`text-sm ${themeClasses.textSecondary}`}>{template.extension}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {selectedTemplate && (
              <div className={`mt-3 p-3 rounded-lg ${themeClasses.surface} border ${themeClasses.border}`}>
                <div className={`text-sm ${themeClasses.text} font-medium mb-1`}>
                  {templates.find(t => t.id === selectedTemplate)?.name}
                </div>
                <div className={`text-xs ${themeClasses.textSecondary}`}>
                  Creates a {templates.find(t => t.id === selectedTemplate)?.extension} file with starter template
                </div>
              </div>
            )}
          </div>

          {/* Preview of selected template */}
          {selectedTemplate && (
            <div className="mb-6">
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Template Preview
              </label>
              <div className={`p-3 rounded-lg ${themeClasses.surface} border ${themeClasses.border} max-h-32 overflow-y-auto`}>
                <pre className={`text-xs ${themeClasses.textSecondary} font-mono whitespace-pre-wrap`}>
                  {templates.find(t => t.id === selectedTemplate)?.template.slice(0, 200)}
                  {(templates.find(t => t.id === selectedTemplate)?.template.length || 0) > 200 ? '...' : ''}
                </pre>
              </div>
            </div>
          )}

          {/* Legacy grid view - hidden but kept for reference */}
          <div className="hidden">
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : `${themeClasses.border} hover:border-blue-300 ${themeClasses.surface}`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${selectedTemplate === template.id ? 'text-blue-600' : themeClasses.textSecondary}`} />
                      <div>
                        <div className={`font-medium ${themeClasses.text}`}>{template.name}</div>
                        <div className={`text-sm ${themeClasses.textSecondary}`}>{template.extension}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.textSecondary} hover:bg-gray-600/10 transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!fileName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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