import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import { Play, Save, Download, Upload, Users, Wifi, WifiOff } from 'lucide-react';

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
  activeFile?: string;
  onRunCode?: (code: string, language: string) => void;
  isDarkMode?: boolean;
}

interface CodeEditorRef {
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
}

// Shared Yjs document per project
const ydoc = new Y.Doc();
const ytext = ydoc.getText('monaco');

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ 
  onCodeChange, 
  activeFile = 'hello.js', 
  onRunCode,
  isDarkMode = false 
}, ref) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const persistenceRef = useRef<IndexeddbPersistence | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);
  const [collaborationEnabled, setCollaborationEnabled] = useState(true);

  // File content mapping
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    'hello.js': `// Welcome to Olive Code Editor with Real-time Collaboration!
console.log("Hello, World!");

// This editor now supports:
// ✨ Real-time collaborative editing with Yjs
// 🔄 Automatic synchronization across sessions
// 💾 Local persistence with IndexedDB
// 🌐 WebSocket-based collaboration

function greetUser(name) {
  return \`Hello, \${name}! Welcome to collaborative coding!\`;
}

const message = greetUser("Developer");
console.log(message);

// Try editing this code - changes will be synced in real-time!
// Multiple users can edit simultaneously with conflict resolution.`,
    
    'example.py': `# Python Example with Collaborative Editing
import asyncio
import json

# Real-time collaboration powered by Yjs
print("Welcome to collaborative Python coding!")

class CollaborativeEditor:
    def __init__(self, project_id):
        self.project_id = project_id
        self.users = []
        
    async def sync_changes(self, change):
        """Sync changes across all connected users"""
        print(f"Syncing change: {change}")
        # Yjs handles the actual synchronization
        
    def add_user(self, user_id):
        self.users.append(user_id)
        print(f"User {user_id} joined the session")
        
def fibonacci(n):
    """Generate Fibonacci sequence collaboratively"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")

# Edit this code and see real-time updates!`,
    
    'sample.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Collaborative Web Development</title>
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
        
        .collaboration-status {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            padding: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
        }
        
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #4ade80;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .feature-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 20px;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="collaboration-status">
            <div class="status-indicator"></div>
            <span>Real-time Collaboration Active</span>
        </div>
        
        <h1>🚀 Olive Code Editor</h1>
        
        <p>Experience the future of collaborative coding with real-time synchronization powered by Yjs!</p>
        
        <div class="feature-grid">
            <div class="feature-card">
                <h3>⚡ Real-time Sync</h3>
                <p>Changes appear instantly across all connected sessions with conflict-free resolution.</p>
            </div>
            
            <div class="feature-card">
                <h3>💾 Persistent Storage</h3>
                <p>Your work is automatically saved locally and synced when you reconnect.</p>
            </div>
            
            <div class="feature-card">
                <h3>👥 Multi-user Support</h3>
                <p>Multiple developers can edit the same file simultaneously without conflicts.</p>
            </div>
            
            <div class="feature-card">
                <h3>🔄 Offline Support</h3>
                <p>Continue working offline and sync changes when connection is restored.</p>
            </div>
        </div>
        
        <script>
            // Collaborative editing demo
            console.log("Collaborative HTML editing is now active!");
            
            // Simulate real-time updates
            setInterval(() => {
                const timestamp = new Date().toLocaleTimeString();
                console.log(\`Collaboration heartbeat: \${timestamp}\`);
            }, 5000);
            
            // Try editing this HTML and see changes sync in real-time!
        </script>
    </div>
</body>
</html>`
  });

  const getLanguageFromFile = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
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

  const setupCollaboration = (editor: any, monaco: Monaco) => {
    if (!collaborationEnabled) return;

    try {
      // Clean up existing connections
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (persistenceRef.current) {
        persistenceRef.current.destroy();
      }

      // Set up IndexedDB persistence for offline support
      persistenceRef.current = new IndexeddbPersistence('olive-editor', ydoc);
      
      // Set up WebSocket provider for real-time collaboration
      // Using a demo WebSocket server - in production, you'd use your own
      const wsUrl = import.meta.env.VITE_COLLABORATION_WS_URL || 'wss://demos.yjs.dev';
      providerRef.current = new WebsocketProvider(wsUrl, 'olive-editor-room', ydoc);
      
      // Set up Monaco binding
      bindingRef.current = new MonacoBinding(
        ytext,
        editor.getModel(),
        new Set([editor]),
        providerRef.current.awareness
      );

      // Handle connection status
      providerRef.current.on('status', (event: any) => {
        setIsConnected(event.status === 'connected');
      });

      // Handle awareness (connected users)
      providerRef.current.awareness.on('change', () => {
        const states = providerRef.current?.awareness.getStates();
        setConnectedUsers(states ? states.size : 0);
      });

      // Set user info for awareness
      providerRef.current.awareness.setLocalStateField('user', {
        name: `User-${Math.floor(Math.random() * 1000)}`,
        color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
        timestamp: Date.now()
      });

      console.log('✅ Collaborative editing initialized');
    } catch (error) {
      console.error('❌ Failed to setup collaboration:', error);
      setCollaborationEnabled(false);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure Monaco Editor
    monaco.editor.defineTheme('olive-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
      ],
      colors: {
        'editor.background': '#1a1a1a',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2a2a2a',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
      }
    });

    monaco.editor.defineTheme('olive-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'function', foreground: '795E26' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#f0f0f0',
        'editor.selectionBackground': '#ADD6FF',
        'editor.inactiveSelectionBackground': '#E5EBF1',
      }
    });

    // Set theme
    monaco.editor.setTheme(isDarkMode ? 'olive-dark' : 'olive-light');

    // Set initial content
    const initialContent = fileContents[activeFile] || '// Start coding...';
    editor.setValue(initialContent);

    // Setup collaboration
    setupCollaboration(editor, monaco);

    // Handle content changes
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      if (onCodeChange) {
        onCodeChange(value);
      }
      
      // Update file contents
      setFileContents(prev => ({
        ...prev,
        [activeFile]: value
      }));
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log('💾 Auto-save triggered');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRunCode) {
        const code = editor.getValue();
        const language = getLanguageFromFile(activeFile);
        onRunCode(code, language);
      }
    });
  };

  // Update editor content when active file changes
  useEffect(() => {
    if (editorRef.current) {
      const content = fileContents[activeFile] || '// Start coding...';
      const currentContent = editorRef.current.getValue();
      
      if (currentContent !== content) {
        editorRef.current.setValue(content);
      }
    }
  }, [activeFile]);

  // Update theme when dark mode changes
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(isDarkMode ? 'olive-dark' : 'olive-light');
    }
  }, [isDarkMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (persistenceRef.current) {
        persistenceRef.current.destroy();
      }
    };
  }, []);

  // Expose editor methods via ref
  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue() || '',
    setValue: (value: string) => editorRef.current?.setValue(value),
    focus: () => editorRef.current?.focus()
  }));

  const handleRunCode = () => {
    if (editorRef.current && onRunCode) {
      const code = editorRef.current.getValue();
      const language = getLanguageFromFile(activeFile);
      onRunCode(code, language);
    }
  };

  const handleSaveFile = () => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeFile;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const toggleCollaboration = () => {
    setCollaborationEnabled(!collaborationEnabled);
    if (editorRef.current && monacoRef.current) {
      if (!collaborationEnabled) {
        setupCollaboration(editorRef.current, monacoRef.current);
      } else {
        // Cleanup collaboration
        if (bindingRef.current) {
          bindingRef.current.destroy();
          bindingRef.current = null;
        }
        if (providerRef.current) {
          providerRef.current.destroy();
          providerRef.current = null;
        }
        setIsConnected(false);
        setConnectedUsers(0);
      }
    }
  };

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-900',
    border: 'border-gray-700',
    text: 'text-gray-100',
    textSecondary: 'text-gray-400',
    surface: 'bg-gray-800',
    surfaceHover: 'hover:bg-gray-700'
  } : {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    surface: 'bg-gray-50',
    surfaceHover: 'hover:bg-gray-100'
  };

  return (
    <div className={`h-full flex flex-col ${themeClasses.bg}`}>
      {/* Editor Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${themeClasses.border} ${themeClasses.surface}`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunCode}
            className={`flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm font-medium`}
            title="Run Code (Ctrl+Enter)"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
          
          <button
            onClick={handleSaveFile}
            className={`flex items-center space-x-2 px-3 py-1.5 ${themeClasses.surface} ${themeClasses.surfaceHover} ${themeClasses.text} border ${themeClasses.border} rounded-lg transition-all duration-200 text-sm font-medium`}
            title="Save File (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>

        {/* Collaboration Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCollaboration}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                collaborationEnabled
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : `${themeClasses.surface} ${themeClasses.surfaceHover} ${themeClasses.text} border ${themeClasses.border}`
              }`}
              title={collaborationEnabled ? 'Disable Collaboration' : 'Enable Collaboration'}
            >
              {collaborationEnabled ? (
                <>
                  <Users className="w-4 h-4" />
                  <span>Collaborative</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Solo</span>
                </>
              )}
            </button>

            {collaborationEnabled && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {isConnected ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs ${themeClasses.textSecondary}`}>
                    {isConnected ? 'Connected' : 'Offline'}
                  </span>
                </div>
                
                {connectedUsers > 0 && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className={`text-xs ${themeClasses.textSecondary}`}>
                      {connectedUsers} user{connectedUsers !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`text-xs ${themeClasses.textSecondary}`}>
            {getLanguageFromFile(activeFile).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguageFromFile(activeFile)}
          theme={isDarkMode ? 'olive-dark' : 'olive-light'}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: true },
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            unfoldOnClickAfterEndOfLine: false,
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            glyphMargin: true,
            fixedOverflowWidgets: true,
            overviewRulerLanes: 3,
            overviewRulerBorder: false,
            rulers: [80, 120],
            bracketPairColorization: {
              enabled: true
            },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showFunctions: true,
              showConstructors: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showStructs: true,
              showInterfaces: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showColors: true,
              showFiles: true,
              showReferences: true,
              showFolders: true,
              showTypeParameters: true,
              showUsers: true,
              showIssues: true
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            },
            parameterHints: {
              enabled: true,
              cycle: true
            },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoSurround: 'languageDefined',
            formatOnPaste: true,
            formatOnType: true
          }}
        />
      </div>

      {/* Status Bar */}
      <div className={`px-4 py-2 border-t ${themeClasses.border} ${themeClasses.surface} flex items-center justify-between text-xs ${themeClasses.textSecondary}`}>
        <div className="flex items-center space-x-4">
          <span>Line 1, Column 1</span>
          <span>UTF-8</span>
          <span>{getLanguageFromFile(activeFile)}</span>
          {collaborationEnabled && (
            <span className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              <span>Yjs {isConnected ? 'Connected' : 'Offline'}</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Spaces: 2</span>
          <span>Auto Save: On</span>
          {collaborationEnabled && connectedUsers > 0 && (
            <span>{connectedUsers} collaborator{connectedUsers !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;