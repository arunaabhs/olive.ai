import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, Users, Eye, EyeOff, Wifi, WifiOff } from 'lucide-react';

interface CodeEditorProps {
  onCodeChange: (code: string) => void;
  activeFile: string;
  onRunCode?: (code: string, language: string) => void;
  isDarkMode?: boolean;
  projectId?: string;
  collaborators?: any[];
}

interface CodeEditorRef {
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
}

interface CollaborationState {
  isEnabled: boolean;
  isConnected: boolean;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
  collaborators: any[];
  lastSync: Date | null;
}

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({
  onCodeChange,
  activeFile,
  onRunCode,
  isDarkMode = false,
  projectId = 'default-project',
  collaborators = []
}, ref) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [collaborationState, setCollaborationState] = useState<CollaborationState>({
    isEnabled: true,
    isConnected: false,
    connectionStatus: 'disconnected',
    collaborators: [],
    lastSync: null
  });
  const [editorContent, setEditorContent] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const syncTimeoutRef = useRef<NodeJS.Timeout>();

  useImperativeHandle(ref, () => ({
    getValue: () => {
      return editorRef.current?.getValue() || '';
    },
    setValue: (value: string) => {
      if (editorRef.current) {
        editorRef.current.setValue(value);
      }
    },
    focus: () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    }
  }));

  const getLanguageFromFile = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'cpp':
      case 'c':
        return 'cpp';
      case 'java':
        return 'java';
      case 'php':
        return 'php';
      case 'rb':
        return 'ruby';
      case 'go':
        return 'go';
      case 'rs':
        return 'rust';
      case 'sql':
        return 'sql';
      default:
        return 'javascript';
    }
  };

  const getDefaultCode = (fileName: string): string => {
    const language = getLanguageFromFile(fileName);
    
    switch (language) {
      case 'javascript':
        if (fileName === 'hello.js') {
          return `// Welcome to Olive Code Editor!
// This is a collaborative coding environment

console.log("Hello, World!");

// Try some interactive examples:
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
console.log("Doubled numbers:", doubled);

// Function example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10):", fibonacci(10));

// Modern JavaScript features
const asyncExample = async () => {
  const data = await Promise.resolve("Async data loaded!");
  console.log(data);
};

asyncExample();`;
        }
        return `// New JavaScript file
console.log("Hello from ${fileName}!");`;
        
      case 'python':
        if (fileName === 'example.py') {
          return `# Welcome to Python in Olive!
# Collaborative Python coding made easy

print("Hello, Python World!")

# List comprehension example
numbers = [1, 2, 3, 4, 5]
squared = [x**2 for x in numbers]
print(f"Squared numbers: {squared}")

# Function example
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(f"Factorial of 5: {factorial(5)}")

# Class example
class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

calc = Calculator()
result = calc.add(10, 5)
print(f"Calculator result: {result}")
print(f"History: {calc.history}")`;
        }
        return `# New Python file
print(f"Hello from {fileName}!")`;
        
      case 'html':
        if (fileName === 'sample.html') {
          return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Olive Collaborative HTML</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        .feature {
            margin: 20px 0;
            padding: 15px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            border-left: 4px solid #4CAF50;
        }
        button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        button:hover {
            background: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 Welcome to Olive Collaborative Editor</h1>
        
        <div class="feature">
            <h3>🚀 Real-time Collaboration</h3>
            <p>Code together with your team in real-time. See changes instantly as others type!</p>
        </div>
        
        <div class="feature">
            <h3>💻 Multi-language Support</h3>
            <p>Write JavaScript, Python, HTML, CSS, and more with syntax highlighting and IntelliSense.</p>
        </div>
        
        <div class="feature">
            <h3>🤖 AI-Powered Assistant</h3>
            <p>Get help from our AI copilot for code suggestions, debugging, and explanations.</p>
        </div>
        
        <div class="feature">
            <h3>⚡ Instant Execution</h3>
            <p>Run your code instantly in the integrated terminal and see results immediately.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button onclick="showAlert()">Try Interactive Demo</button>
        </div>
    </div>

    <script>
        function showAlert() {
            alert('🎉 Welcome to collaborative coding! This HTML file is being edited in real-time.');
            
            // Add some dynamic content
            const container = document.querySelector('.container');
            const newFeature = document.createElement('div');
            newFeature.className = 'feature';
            newFeature.innerHTML = \`
                <h3>✨ Dynamic Content Added!</h3>
                <p>This content was added dynamically when you clicked the button. Time: \${new Date().toLocaleTimeString()}</p>
            \`;
            container.appendChild(newFeature);
        }
        
        // Add some interactive behavior
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🌟 Olive HTML Demo loaded successfully!');
            
            // Animate features on load
            const features = document.querySelectorAll('.feature');
            features.forEach((feature, index) => {
                feature.style.opacity = '0';
                feature.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    feature.style.transition = 'all 0.6s ease';
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateY(0)';
                }, index * 200);
            });
        });
    </script>
</body>
</html>`;
        }
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New HTML File</title>
</head>
<body>
    <h1>Hello from ${fileName}!</h1>
</body>
</html>`;
        
      default:
        return `// New ${language} file\n// Start coding here...`;
    }
  };

  // Improved collaboration system using localStorage and periodic sync
  const initializeCollaboration = () => {
    if (!collaborationState.isEnabled) return;

    setCollaborationState(prev => ({
      ...prev,
      connectionStatus: 'connecting'
    }));

    // Simulate connection process
    setTimeout(() => {
      setCollaborationState(prev => ({
        ...prev,
        isConnected: true,
        connectionStatus: 'connected',
        lastSync: new Date()
      }));

      // Start periodic sync
      startPeriodicSync();
    }, 1000);
  };

  const startPeriodicSync = () => {
    if (syncTimeoutRef.current) {
      clearInterval(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setInterval(() => {
      if (collaborationState.isEnabled && collaborationState.isConnected) {
        syncWithCollaborators();
      }
    }, 2000); // Sync every 2 seconds
  };

  const syncWithCollaborators = () => {
    try {
      const roomKey = `olive-room-${projectId}`;
      const fileKey = `${roomKey}-${activeFile}`;
      
      // Get current content
      const currentContent = editorRef.current?.getValue() || '';
      
      // Store current content
      const collaborationData = {
        content: currentContent,
        lastModified: Date.now(),
        user: 'current-user',
        file: activeFile
      };
      
      localStorage.setItem(fileKey, JSON.stringify(collaborationData));
      
      // Simulate receiving updates from other users
      const storedData = localStorage.getItem(fileKey);
      if (storedData) {
        const data = JSON.parse(storedData);
        setCollaborationState(prev => ({
          ...prev,
          lastSync: new Date()
        }));
      }
    } catch (error) {
      console.error('Sync error:', error);
      setCollaborationState(prev => ({
        ...prev,
        connectionStatus: 'error'
      }));
    }
  };

  const toggleCollaboration = () => {
    const newState = !collaborationState.isEnabled;
    
    setCollaborationState(prev => ({
      ...prev,
      isEnabled: newState,
      isConnected: false,
      connectionStatus: newState ? 'connecting' : 'disconnected'
    }));

    if (newState) {
      initializeCollaboration();
    } else {
      if (syncTimeoutRef.current) {
        clearInterval(syncTimeoutRef.current);
      }
    }
  };

  // Initialize collaboration when component mounts
  useEffect(() => {
    if (collaborationState.isEnabled && !isInitialized) {
      initializeCollaboration();
      setIsInitialized(true);
    }

    return () => {
      if (syncTimeoutRef.current) {
        clearInterval(syncTimeoutRef.current);
      }
    };
  }, [collaborationState.isEnabled, isInitialized]);

  // Handle file changes
  useEffect(() => {
    if (editorRef.current && isInitialized) {
      // Load content for the active file
      const savedContent = editorContent[activeFile];
      if (savedContent) {
        editorRef.current.setValue(savedContent);
      } else {
        const defaultContent = getDefaultCode(activeFile);
        editorRef.current.setValue(defaultContent);
        setEditorContent(prev => ({
          ...prev,
          [activeFile]: defaultContent
        }));
      }
    }
  }, [activeFile, isInitialized]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Set default content if editor is empty
    const currentValue = editor.getValue();
    if (!currentValue.trim()) {
      const defaultCode = getDefaultCode(activeFile);
      editor.setValue(defaultCode);
      onCodeChange(defaultCode);
      setEditorContent(prev => ({
        ...prev,
        [activeFile]: defaultCode
      }));
    }

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 22,
      fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
      fontLigatures: true,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      formatOnPaste: true,
      formatOnType: true,
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRunCode) {
        const code = editor.getValue();
        const language = getLanguageFromFile(activeFile);
        onRunCode(code, language);
      }
    });

    // Listen for content changes
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      onCodeChange(code);
      
      // Update local content store
      setEditorContent(prev => ({
        ...prev,
        [activeFile]: code
      }));
    });

    // Focus the editor
    editor.focus();
    setIsInitialized(true);
  };

  const handleRunCode = () => {
    if (onRunCode && editorRef.current) {
      const code = editorRef.current.getValue();
      const language = getLanguageFromFile(activeFile);
      onRunCode(code, language);
    }
  };

  const getConnectionStatusIcon = () => {
    switch (collaborationState.connectionStatus) {
      case 'connected':
        return <Wifi className="w-3 h-3 text-green-500" />;
      case 'connecting':
        return <Wifi className="w-3 h-3 text-yellow-500 animate-pulse" />;
      case 'error':
        return <WifiOff className="w-3 h-3 text-red-500" />;
      default:
        return <WifiOff className="w-3 h-3 text-gray-500" />;
    }
  };

  const getConnectionStatusText = () => {
    switch (collaborationState.connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Connection Error';
      default:
        return 'Disconnected';
    }
  };

  const language = getLanguageFromFile(activeFile);

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {activeFile}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${
              isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
            }`}>
              {language}
            </span>
          </div>
          
          {/* Enhanced Collaboration Status */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCollaboration}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-all duration-200 ${
                collaborationState.isEnabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={collaborationState.isEnabled ? 'Disable Collaboration' : 'Enable Collaboration'}
            >
              {collaborationState.isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>{collaborationState.isEnabled ? 'Live' : 'Solo'}</span>
            </button>
            
            {collaborationState.isEnabled && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {getConnectionStatusIcon()}
                  <span className={`text-xs ${
                    collaborationState.connectionStatus === 'connected' ? 'text-green-600' :
                    collaborationState.connectionStatus === 'connecting' ? 'text-yellow-600' :
                    collaborationState.connectionStatus === 'error' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {getConnectionStatusText()}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-blue-500" />
                  <span className="text-xs text-blue-600 font-medium">
                    {collaborators.length + 1} user{collaborators.length !== 0 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Collaborator Avatars */}
          {collaborationState.isEnabled && collaborators.length > 0 && (
            <div className="flex items-center -space-x-1">
              {collaborators.slice(0, 3).map((collaborator, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: collaborator.color }}
                  title={collaborator.name}
                >
                  {collaborator.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {collaborators.length > 3 && (
                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-white text-xs font-medium">
                  +{collaborators.length - 3}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleRunCode}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-all duration-200"
            title="Run Code (Ctrl+Enter)"
          >
            <Play className="w-3 h-3" />
            <span>Run</span>
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme={isDarkMode ? 'vs-dark' : 'vs-light'}
          onMount={handleEditorDidMount}
          options={{
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: 'line',
            automaticLayout: true,
            glyphMargin: true,
            folding: true,
            lineNumbers: 'on',
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: 'all',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
              verticalHasArrows: false,
              horizontalHasArrows: false,
            },
          }}
        />
      </div>

      {/* Enhanced Collaboration Status Bar */}
      {collaborationState.isEnabled && (
        <div className={`px-4 py-2 border-t text-xs ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-400' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>🌐 Collaborative Mode Active</span>
              <span>Room: {projectId}</span>
              <span>File: {activeFile}</span>
              <div className="flex items-center space-x-1">
                {getConnectionStatusIcon()}
                <span className={
                  collaborationState.connectionStatus === 'connected' ? 'text-green-600' :
                  collaborationState.connectionStatus === 'connecting' ? 'text-yellow-600' :
                  collaborationState.connectionStatus === 'error' ? 'text-red-600' :
                  'text-gray-600'
                }>
                  {getConnectionStatusText()}
                </span>
              </div>
              {collaborationState.lastSync && (
                <span>Last sync: {collaborationState.lastSync.toLocaleTimeString()}</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span>Press Ctrl+Enter to run code</span>
              <span>•</span>
              <span>Share room link to collaborate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;