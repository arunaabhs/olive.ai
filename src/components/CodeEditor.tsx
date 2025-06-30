import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import { Play, Save, Download, Upload, Users, Wifi, WifiOff, Eye, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
  activeFile?: string;
  onRunCode?: (code: string, language: string) => void;
  isDarkMode?: boolean;
  projectId?: string;
}

interface CodeEditorRef {
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
}

interface CollaboratorInfo {
  id: string;
  name: string;
  email: string;
  color: string;
  cursor?: {
    line: number;
    column: number;
  };
  selection?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
  lastSeen: number;
}

// Create project-specific Yjs documents
const projectDocs = new Map<string, Y.Doc>();
const getProjectDoc = (projectId: string) => {
  if (!projectDocs.has(projectId)) {
    projectDocs.set(projectId, new Y.Doc());
  }
  return projectDocs.get(projectId)!;
};

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ 
  onCodeChange, 
  activeFile = 'hello.js', 
  onRunCode,
  isDarkMode = false,
  projectId = 'default-project'
}, ref) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const persistenceRef = useRef<IndexeddbPersistence | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<Map<string, CollaboratorInfo>>(new Map());
  const [collaborationEnabled, setCollaborationEnabled] = useState(true);
  const [showCollaborators, setShowCollaborators] = useState(false);

  const { user } = useAuth();

  // Get project-specific document and text
  const ydoc = getProjectDoc(projectId);
  const ytext = ydoc.getText(`file-${activeFile}`);

  // File content mapping per project
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    'hello.js': `// Welcome to Olive Code Editor with Real-time Collaboration!
console.log("Hello, World!");

// This editor now supports:
// ✨ Real-time collaborative editing with Yjs
// 🔄 Automatic synchronization across sessions
// 💾 Local persistence with IndexedDB
// 🌐 WebSocket-based collaboration
// 👥 User awareness with cursors and selections
// 🏠 Project-specific rooms

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
    def __init__(self, project_id, user_info):
        self.project_id = project_id
        self.user_info = user_info
        self.collaborators = {}
        
    async def sync_changes(self, change):
        """Sync changes across all connected users"""
        print(f"Syncing change from {self.user_info['name']}: {change}")
        # Yjs handles the actual synchronization
        
    def add_collaborator(self, user_info):
        self.collaborators[user_info['id']] = user_info
        print(f"User {user_info['name']} joined the session")
        
    def show_user_cursors(self):
        """Display cursor positions of all collaborators"""
        for user_id, user in self.collaborators.items():
            if 'cursor' in user:
                print(f"{user['name']} is at line {user['cursor']['line']}")

def fibonacci(n):
    """Generate Fibonacci sequence collaboratively"""
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Test the function
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")

# Edit this code and see real-time updates with user awareness!`,
    
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
        
        .user-avatars {
            display: flex;
            gap: 5px;
            margin-left: auto;
        }
        
        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            border: 2px solid rgba(255, 255, 255, 0.3);
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
            <div class="user-avatars" id="userAvatars">
                <!-- User avatars will be populated by JavaScript -->
            </div>
        </div>
        
        <h1>🚀 Olive Code Editor</h1>
        
        <p>Experience the future of collaborative coding with real-time synchronization, user awareness, and project-specific rooms!</p>
        
        <div class="feature-grid">
            <div class="feature-card">
                <h3>⚡ Real-time Sync</h3>
                <p>Changes appear instantly across all connected sessions with conflict-free resolution.</p>
            </div>
            
            <div class="feature-card">
                <h3>👥 User Awareness</h3>
                <p>See other users' cursors, selections, and real-time presence indicators.</p>
            </div>
            
            <div class="feature-card">
                <h3>🏠 Project Rooms</h3>
                <p>Each project has its own collaboration space with isolated document sharing.</p>
            </div>
            
            <div class="feature-card">
                <h3>🔐 Authenticated Users</h3>
                <p>Integration with Supabase auth shows real user names and profiles.</p>
            </div>
            
            <div class="feature-card">
                <h3>💾 Persistent Storage</h3>
                <p>Your work is automatically saved locally and synced when you reconnect.</p>
            </div>
            
            <div class="feature-card">
                <h3>🔄 Offline Support</h3>
                <p>Continue working offline and sync changes when connection is restored.</p>
            </div>
        </div>
        
        <script>
            // Collaborative editing demo with user awareness
            console.log("Collaborative HTML editing with user awareness is now active!");
            
            // Simulate user avatars
            const users = [
                { name: 'Alice', color: '#ff6b6b' },
                { name: 'Bob', color: '#4ecdc4' },
                { name: 'Charlie', color: '#45b7d1' }
            ];
            
            const avatarsContainer = document.getElementById('userAvatars');
            users.forEach(user => {
                const avatar = document.createElement('div');
                avatar.className = 'user-avatar';
                avatar.style.backgroundColor = user.color;
                avatar.textContent = user.name.charAt(0);
                avatar.title = user.name;
                avatarsContainer.appendChild(avatar);
            });
            
            // Simulate real-time updates
            setInterval(() => {
                const timestamp = new Date().toLocaleTimeString();
                console.log(\`Collaboration heartbeat: \${timestamp}\`);
            }, 5000);
            
            // Try editing this HTML and see changes sync in real-time with user awareness!
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

  const generateUserColor = (userId: string): string => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#10ac84', '#ee5a24', '#0abde3', '#3867d6', '#8854d0'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
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

      // Set up IndexedDB persistence for offline support (project-specific)
      persistenceRef.current = new IndexeddbPersistence(`olive-editor-${projectId}`, ydoc);
      
      // Set up WebSocket provider for real-time collaboration (project-specific room)
      const wsUrl = import.meta.env.VITE_COLLABORATION_WS_URL || 'wss://demos.yjs.dev';
      const roomName = `olive-project-${projectId}`;
      providerRef.current = new WebsocketProvider(wsUrl, roomName, ydoc);
      
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

      // Set user info for awareness (using Supabase auth data)
      const userInfo = {
        name: user?.email?.split('@')[0] || `Guest-${Math.floor(Math.random() * 1000)}`,
        email: user?.email || 'guest@example.com',
        color: generateUserColor(user?.id || 'guest'),
        id: user?.id || `guest-${Date.now()}`,
        avatar: user?.email?.charAt(0).toUpperCase() || 'G'
      };

      providerRef.current.awareness.setLocalStateField('user', userInfo);

      // Handle awareness changes (other users joining/leaving, cursor movements)
      providerRef.current.awareness.on('change', () => {
        const states = providerRef.current?.awareness.getStates();
        if (states) {
          const newCollaborators = new Map<string, CollaboratorInfo>();
          
          states.forEach((state, clientId) => {
            if (state.user && clientId !== providerRef.current?.awareness.clientID) {
              const collaborator: CollaboratorInfo = {
                id: state.user.id,
                name: state.user.name,
                email: state.user.email,
                color: state.user.color,
                lastSeen: Date.now()
              };

              // Add cursor and selection info if available
              if (state.cursor) {
                collaborator.cursor = state.cursor;
              }
              if (state.selection) {
                collaborator.selection = state.selection;
              }

              newCollaborators.set(clientId.toString(), collaborator);
            }
          });
          
          setCollaborators(newCollaborators);
        }
      });

      // Track cursor position for awareness
      editor.onDidChangeCursorPosition((e: any) => {
        if (providerRef.current) {
          providerRef.current.awareness.setLocalStateField('cursor', {
            line: e.position.lineNumber,
            column: e.position.column
          });
        }
      });

      // Track selection for awareness
      editor.onDidChangeCursorSelection((e: any) => {
        if (providerRef.current) {
          providerRef.current.awareness.setLocalStateField('selection', {
            startLine: e.selection.startLineNumber,
            startColumn: e.selection.startColumn,
            endLine: e.selection.endLineNumber,
            endColumn: e.selection.endColumn
          });
        }
      });

      console.log(`✅ Collaborative editing initialized for project: ${projectId}`);
    } catch (error) {
      console.error('❌ Failed to setup collaboration:', error);
      setCollaborationEnabled(false);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure Monaco Editor themes
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
    if (editorRef.current && collaborationEnabled) {
      // Get new ytext for the active file
      const newYtext = ydoc.getText(`file-${activeFile}`);
      
      // Destroy existing binding
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      
      // Create new binding for the active file
      if (providerRef.current && monacoRef.current) {
        bindingRef.current = new MonacoBinding(
          newYtext,
          editorRef.current.getModel(),
          new Set([editorRef.current]),
          providerRef.current.awareness
        );
      }
      
      // Set content if not collaborative or if ytext is empty
      const content = fileContents[activeFile] || '// Start coding...';
      if (newYtext.length === 0) {
        newYtext.insert(0, content);
      }
    } else if (editorRef.current) {
      // Non-collaborative mode
      const content = fileContents[activeFile] || '// Start coding...';
      const currentContent = editorRef.current.getValue();
      
      if (currentContent !== content) {
        editorRef.current.setValue(content);
      }
    }
  }, [activeFile, collaborationEnabled]);

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
        setCollaborators(new Map());
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

  const collaboratorArray = Array.from(collaborators.values());

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
                
                {collaboratorArray.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowCollaborators(!showCollaborators)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded ${themeClasses.surface} ${themeClasses.surfaceHover} transition-all duration-200`}
                      title="Show Collaborators"
                    >
                      <div className="flex -space-x-1">
                        {collaboratorArray.slice(0, 3).map((collaborator, index) => (
                          <div
                            key={collaborator.id}
                            className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                            style={{ backgroundColor: collaborator.color, zIndex: 10 - index }}
                            title={collaborator.name}
                          >
                            {collaborator.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {collaboratorArray.length > 3 && (
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-xs font-medium text-white">
                            +{collaboratorArray.length - 3}
                          </div>
                        )}
                      </div>
                      <Eye className="w-3 h-3" />
                    </button>

                    {/* Collaborators Dropdown */}
                    {showCollaborators && (
                      <div className={`absolute top-full right-0 mt-2 w-64 ${themeClasses.surface} border ${themeClasses.border} rounded-lg shadow-lg z-50`}>
                        <div className="p-3">
                          <h3 className={`text-sm font-medium ${themeClasses.text} mb-2`}>
                            Active Collaborators ({collaboratorArray.length})
                          </h3>
                          <div className="space-y-2">
                            {collaboratorArray.map((collaborator) => (
                              <div key={collaborator.id} className="flex items-center space-x-2">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
                                  style={{ backgroundColor: collaborator.color }}
                                >
                                  {collaborator.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${themeClasses.text} truncate`}>
                                    {collaborator.name}
                                  </p>
                                  <p className={`text-xs ${themeClasses.textSecondary} truncate`}>
                                    {collaborator.email}
                                  </p>
                                  {collaborator.cursor && (
                                    <p className={`text-xs ${themeClasses.textSecondary}`}>
                                      Line {collaborator.cursor.line}, Col {collaborator.cursor.column}
                                    </p>
                                  )}
                                </div>
                                <UserCheck className="w-4 h-4 text-green-500" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`text-xs ${themeClasses.textSecondary} flex items-center space-x-2`}>
            <span>{getLanguageFromFile(activeFile).toUpperCase()}</span>
            {collaborationEnabled && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Project: {projectId}
              </span>
            )}
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
          {user && (
            <span className="flex items-center space-x-1">
              <UserCheck className="w-3 h-3" />
              <span>{user.email?.split('@')[0]}</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Spaces: 2</span>
          <span>Auto Save: On</span>
          {collaborationEnabled && collaboratorArray.length > 0 && (
            <span>{collaboratorArray.length} collaborator{collaboratorArray.length !== 1 ? 's' : ''}</span>
          )}
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            Room: {projectId}
          </span>
        </div>
      </div>

      {/* Click outside to close collaborators dropdown */}
      {showCollaborators && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCollaborators(false)}
        />
      )}
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;