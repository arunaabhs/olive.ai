import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Play, Users, Eye, EyeOff } from 'lucide-react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

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
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [wsProvider, setWsProvider] = useState<WebsocketProvider | null>(null);
  const [binding, setBinding] = useState<MonacoBinding | null>(null);
  const [isCollaborationEnabled, setIsCollaborationEnabled] = useState(true);
  const [collaboratorCursors, setCollaboratorCursors] = useState<any[]>([]);

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
      case 'txt':
        return 'plaintext';
      default:
        return 'javascript';
    }
  };

  const getDefaultCode = (fileName: string): string => {
    const language = getLanguageFromFile(fileName);
    
    switch (language) {
      case 'javascript':
        return `// New JavaScript file
console.log("Hello from ${fileName}!");`;
        
      case 'python':
        return `# New Python file
print(f"Hello from {fileName}!")`;
        
      case 'html':

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
        
      case 'txt':
        if (fileName === 'sample.txt') {
          return `Welcome to Olive Code Editor!

This is a sample text file to get you started.

You can:
- Create new files and folders
- Write code in multiple languages
- Use the AI-powered copilot for assistance
- Collaborate with others in real-time

Start by creating a new file or editing this one!

Happy coding! 🚀`;
        }
        return `This is a new text file.

Start writing your content here...`;
        
      default:
        return `// New ${language} file\n// Start coding here...`;
    }
  };

  // Initialize collaboration when editor is ready
  useEffect(() => {
    if (editorRef.current && monacoRef.current && isCollaborationEnabled) {
      // Clean up previous collaboration setup
      if (binding) {
        binding.destroy();
      }
      if (wsProvider) {
        wsProvider.destroy();
      }
      if (ydoc) {
        ydoc.destroy();
      }

      // Create new Y.js document for this project and file
      const newYdoc = new Y.Doc();
      
      // Create WebSocket provider for real-time collaboration
      // Using a more robust WebSocket configuration
      const roomId = `olive-${projectId}-${activeFile}`;
      const newWsProvider = new WebsocketProvider(
        'wss://y-websocket-server.herokuapp.com', // Alternative public server
        roomId,
        newYdoc,
        {
          connect: true,
          // Add connection parameters for better reliability
          params: {
            room: roomId,
            user: 'olive-user',
            timestamp: Date.now().toString()
          }
        }
      );

      // Fallback to local-only mode if WebSocket fails
      newWsProvider.on('status', ({ status }: { status: string }) => {
        console.log('WebSocket status:', status);
        if (status === 'disconnected') {
          console.warn('WebSocket disconnected, running in local-only mode');
        }
      });

      // Get the shared text type
      const ytext = newYdoc.getText('monaco');

      // Create Monaco binding for real-time collaboration
      const newBinding = new MonacoBinding(
        ytext,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        newWsProvider.awareness
      );

      // Set up awareness for showing collaborator cursors
      newWsProvider.awareness.setLocalStateField('user', {
        name: collaborators.find(c => c.email === 'you@example.com')?.name || 'You',
        color: collaborators.find(c => c.email === 'you@example.com')?.color || '#3B82F6'
      });

      // Listen for awareness changes (other users' cursors)
      newWsProvider.awareness.on('change', () => {
        const states = Array.from(newWsProvider.awareness.getStates().values());
        setCollaboratorCursors(states.filter(state => state.user));
      });

      setYdoc(newYdoc);
      setWsProvider(newWsProvider);
      setBinding(newBinding);

      // Cleanup function
      return () => {
        newBinding.destroy();
        newWsProvider.destroy();
        newYdoc.destroy();
      };
    }
  }, [editorRef.current, monacoRef.current, projectId, activeFile, isCollaborationEnabled]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Set default content if editor is empty
    const currentValue = editor.getValue();
    if (!currentValue.trim()) {
      const defaultCode = getDefaultCode(activeFile);
      editor.setValue(defaultCode);
      onCodeChange(defaultCode);
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
    });

    // Focus the editor
    editor.focus();
  };

  const handleRunCode = () => {
    if (onRunCode && editorRef.current) {
      const code = editorRef.current.getValue();
      const language = getLanguageFromFile(activeFile);
      onRunCode(code, language);
    }
  };

  const toggleCollaboration = () => {
    setIsCollaborationEnabled(!isCollaborationEnabled);
    
    if (isCollaborationEnabled) {
      // Disable collaboration
      if (binding) binding.destroy();
      if (wsProvider) wsProvider.destroy();
      if (ydoc) ydoc.destroy();
      setBinding(null);
      setWsProvider(null);
      setYdoc(null);
      setCollaboratorCursors([]);
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
          
          {/* Collaboration Status */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCollaboration}
              className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-all duration-200 ${
                isCollaborationEnabled
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isCollaborationEnabled ? 'Disable Collaboration' : 'Enable Collaboration'}
            >
              {isCollaborationEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>{isCollaborationEnabled ? 'Live' : 'Solo'}</span>
            </button>
            
            {isCollaborationEnabled && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3 text-blue-500" />
                <span className="text-xs text-blue-600 font-medium">
                  {collaboratorCursors.length} online
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Collaborator Avatars */}
          {isCollaborationEnabled && collaborators.length > 0 && (
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

      {/* Collaboration Status Bar */}
      {isCollaborationEnabled && (
        <div className={`px-4 py-2 border-t text-xs ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700 text-gray-400' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>🌐 Collaborative Mode Active</span>
              <span>Room: olive-{projectId}-{activeFile}</span>
              {wsProvider && (
                <span className={wsProvider.wsconnected ? 'text-green-600' : 'text-red-600'}>
                  {wsProvider.wsconnected ? '● Connected' : '● Disconnected'}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span>Press Ctrl+Enter to run code</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;