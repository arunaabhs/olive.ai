import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minimize2, Maximize2, Play, Square, Zap, Code, FileText, Plus, MoreHorizontal, Move } from 'lucide-react';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleSize: () => void;
  isMinimized: boolean;
  onRunCode?: (code: string, language: string) => void;
  isDarkMode?: boolean;
}

interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info' | 'warning';
  content: string;
  timestamp: Date;
}

interface ProcessInfo {
  id: string;
  name: string;
  language: string;
  status: 'running' | 'completed' | 'error';
  startTime: Date;
  output: string[];
}

const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose, onToggleSize, isMinimized, onRunCode, isDarkMode = false }) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '1',
      type: 'success',
      content: '🚀 Welcome to Olive Terminal Pro v2.0.0',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'info',
      content: '💡 Advanced code execution environment ready',
      timestamp: new Date()
    },
    {
      id: '3',
      type: 'info',
      content: '⌨️  Type "help" for commands or press Ctrl+Enter in editor to run code',
      timestamp: new Date()
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('~/olive-project');
  const [runningProcesses, setRunningProcesses] = useState<ProcessInfo[]>([]);
  const [activeTab, setActiveTab] = useState('TERMINAL');
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 800, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [environmentVars, setEnvironmentVars] = useState<Record<string, string>>({
    NODE_ENV: 'development',
    PATH: '/usr/local/bin:/usr/bin:/bin',
    OLIVE_VERSION: '2.0.0',
    USER: 'developer'
  });
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-900',
    border: 'border-gray-700',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    surface: 'bg-gray-800',
    surfaceHover: 'hover:bg-gray-700',
    headerBg: 'bg-gray-800',
    input: 'bg-transparent text-gray-100',
    tabActive: 'bg-gray-700 text-gray-100 border-b-2 border-orange-500',
    tabInactive: 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
  } : {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    surface: 'bg-gray-50',
    surfaceHover: 'hover:bg-white/60',
    headerBg: 'bg-gray-50',
    input: 'bg-transparent text-gray-800',
    tabActive: 'bg-white text-gray-800 border-b-2 border-orange-500',
    tabInactive: 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    if (isOpen && inputRef.current && !isMinimized) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, isResizing, dragStart]);

  const addLine = (content: string, type: 'command' | 'output' | 'error' | 'success' | 'info' | 'warning' = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: new Date()
    };
    setLines(prev => [...prev, newLine]);
  };

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    addLine(`${currentDirectory} $ ${command}`, 'command');
    
    setIsExecuting(true);

    try {
      const cmd = command.trim().toLowerCase();
      const args = command.trim().split(' ');
      
      if (cmd === 'help') {
        addLine('📚 Olive Terminal Pro - Available Commands:', 'info');
        addLine('', 'output');
        addLine('📁 File Operations:', 'info');
        addLine('  ls, dir        - List files and directories', 'output');
        addLine('  pwd            - Print working directory', 'output');
        addLine('  cd <dir>       - Change directory', 'output');
        addLine('  cat <file>     - Display file contents', 'output');
        addLine('  touch <file>   - Create new file', 'output');
        addLine('  mkdir <dir>    - Create directory', 'output');
        addLine('', 'output');
        addLine('🚀 Code Execution:', 'info');
        addLine('  run <file>     - Execute code file', 'output');
        addLine('  node <file>    - Run with Node.js', 'output');
        addLine('  python <file>  - Run with Python', 'output');
        addLine('  java <file>    - Compile and run Java', 'output');
        addLine('  gcc <file>     - Compile C/C++', 'output');
        addLine('', 'output');
        addLine('📦 Package Management:', 'info');
        addLine('  npm <command>  - Node package manager', 'output');
        addLine('  pip <command>  - Python package installer', 'output');
        addLine('  yarn <command> - Yarn package manager', 'output');
        addLine('', 'output');
        addLine('⚙️  System Commands:', 'info');
        addLine('  ps             - List running processes', 'output');
        addLine('  kill <pid>     - Terminate process', 'output');
        addLine('  env            - Show environment variables', 'output');
        addLine('  export VAR=val - Set environment variable', 'output');
        addLine('  clear          - Clear terminal', 'output');
        addLine('  exit           - Exit terminal', 'output');
      } else if (cmd === 'clear') {
        setLines([]);
      } else if (cmd === 'ls' || cmd === 'dir') {
        addLine('📁 Project Structure:', 'info');
        addLine('  📂 src/', 'output');
        addLine('    📂 components/', 'output');
        addLine('    📂 contexts/', 'output');
        addLine('    📂 lib/', 'output');
        addLine('    📄 App.tsx', 'output');
        addLine('    📄 main.tsx', 'output');
        addLine('    🎨 index.css', 'output');
        addLine('  📂 public/', 'output');
        addLine('    🖼️  vite.svg', 'output');
        addLine('  📂 functions/', 'output');
        addLine('  📄 package.json', 'output');
        addLine('  📄 vite.config.ts', 'output');
        addLine('  📄 tsconfig.json', 'output');
        addLine('  📖 README.md', 'output');
        addLine('  📄 hello.js', 'output');
        addLine('  🐍 example.py', 'output');
        addLine('  🌐 sample.html', 'output');
      } else if (cmd === 'pwd') {
        addLine(currentDirectory, 'output');
      } else if (cmd.startsWith('cd ')) {
        const dir = args[1];
        if (dir === '..') {
          setCurrentDirectory('~');
          addLine('📂 Changed to parent directory', 'success');
        } else if (dir === '~' || dir === '') {
          setCurrentDirectory('~/olive-project');
          addLine('🏠 Changed to home directory', 'success');
        } else {
          setCurrentDirectory(`~/olive-project/${dir}`);
          addLine(`📂 Changed directory to ${dir}`, 'success');
        }
      } else if (cmd.startsWith('npm ')) {
        const npmArgs = command.slice(4);
        addLine(`📦 Running: npm ${npmArgs}`, 'info');
        
        if (npmArgs.includes('install') || npmArgs.includes('i')) {
          addLine('📥 Installing dependencies...', 'info');
          setTimeout(() => {
            addLine('✅ Dependencies installed successfully', 'success');
            addLine('📊 Updated package-lock.json', 'info');
            addLine('🔍 Audit: found 0 vulnerabilities', 'success');
          }, 2000);
        } else if (npmArgs.includes('run dev')) {
          addLine('🚀 Starting development server...', 'info');
          setTimeout(() => {
            addLine('✅ Server running on http://localhost:5173', 'success');
            addLine('🌐 Ready to accept connections', 'info');
            addLine('📊 Bundle size: 2.3MB', 'info');
          }, 2500);
        } else if (npmArgs.includes('run build')) {
          addLine('🏗️  Building for production...', 'info');
          setTimeout(() => {
            addLine('✅ Build completed successfully', 'success');
            addLine('📁 Output: dist/', 'info');
            addLine('📊 Bundle size optimized: 847KB', 'success');
            addLine('🗜️  Gzipped: 234KB', 'success');
          }, 3000);
        } else {
          addLine(`✅ npm ${npmArgs} completed`, 'success');
        }
      } else if (cmd === 'exit') {
        addLine('👋 Goodbye! Terminal session ended.', 'info');
        setTimeout(() => onClose(), 1000);
      } else {
        addLine(`❌ Command '${command}' not found`, 'error');
        addLine('💡 Type "help" for available commands', 'info');
      }
    } catch (error) {
      addLine(`❌ Error: ${error}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (currentCommand.trim()) {
        executeCommand(currentCommand);
        setCurrentCommand('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  const getLineColor = (type: string) => {
    switch (type) {
      case 'command':
        return 'text-green-600 font-medium';
      case 'error':
        return 'text-red-500';
      case 'success':
        return 'text-green-600';
      case 'info':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return isDarkMode ? 'text-gray-300' : 'text-gray-700';
    }
  };

  useEffect(() => {
    if (onRunCode) {
      (window as any).terminalExecuteCode = (code: string, language: string) => {
        addLine(`🚀 Executing ${language} code...`, 'info');
        addLine('', 'output');
        addLine('// Code execution simulation', 'output');
        addLine(`console.log("Running ${language} code...");`, 'output');
        addLine('', 'output');
        addLine('✅ Code executed successfully', 'success');
      };
    }
  }, [onRunCode]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'PROBLEMS', name: 'PROBLEMS', count: 0 },
    { id: 'OUTPUT', name: 'OUTPUT', count: null },
    { id: 'DEBUG_CONSOLE', name: 'DEBUG CONSOLE', count: null },
    { id: 'TERMINAL', name: 'TERMINAL', count: null }
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" />
      
      {/* Floating Terminal Window */}
      <div
        ref={windowRef}
        className={`fixed z-50 rounded-lg shadow-2xl border ${themeClasses.bg} ${themeClasses.border}`}
        style={{
          left: position.x,
          top: position.y,
          width: isMinimized ? 300 : size.width,
          height: isMinimized ? 60 : size.height,
          minWidth: 400,
          minHeight: 300,
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
      >
        {/* Terminal Header with Tabs */}
        <div
          className={`flex items-center justify-between ${themeClasses.headerBg} ${themeClasses.border} border-b rounded-t-lg cursor-move drag-handle`}
          onMouseDown={handleMouseDown}
        >
          {/* Window Controls */}
          <div className="flex items-center space-x-2 px-3 py-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer hover:bg-red-600" onClick={onClose}></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-600" onClick={onToggleSize}></div>
              <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:bg-green-600"></div>
            </div>
            <Move className={`w-4 h-4 ${themeClasses.textSecondary} ml-2`} />
          </div>

          {/* Tabs */}
          {!isMinimized && (
            <div className="flex items-center flex-1 justify-center">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    activeTab === tab.id 
                      ? themeClasses.tabActive
                      : themeClasses.tabInactive
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span>{tab.name}</span>
                    {tab.count !== null && (
                      <span className={`px-1 py-0.5 text-xs rounded-full ${
                        isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Terminal Actions */}
          <div className="flex items-center space-x-1 px-2">
            {!isMinimized && activeTab === 'TERMINAL' && (
              <>
                <select className={`text-xs px-2 py-1 rounded ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text}`}>
                  <option>bash</option>
                  <option>zsh</option>
                  <option>powershell</option>
                </select>
                
                <button
                  className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
                  title="New Terminal"
                >
                  <Plus className={`w-3 h-3 ${themeClasses.textSecondary}`} />
                </button>
                
                <button
                  className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
                  title="Split Terminal"
                >
                  <Code className={`w-3 h-3 ${themeClasses.textSecondary}`} />
                </button>
              </>
            )}
            
            <button
              onClick={onToggleSize}
              className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
              title={isMinimized ? "Maximize" : "Minimize"}
            >
              {isMinimized ? (
                <Maximize2 className={`w-3 h-3 ${themeClasses.textSecondary}`} />
              ) : (
                <Minimize2 className={`w-3 h-3 ${themeClasses.textSecondary}`} />
              )}
            </button>
            
            <button
              onClick={onClose}
              className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
              title="Close Terminal"
            >
              <X className={`w-3 h-3 ${themeClasses.textSecondary}`} />
            </button>
          </div>
        </div>

        {/* Terminal Content */}
        {!isMinimized && activeTab === 'TERMINAL' && (
          <div className="flex-1 flex flex-col">
            <div
              ref={terminalRef}
              className={`flex-1 overflow-y-auto p-4 font-mono text-sm ${themeClasses.bg}`}
              style={{ 
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                height: size.height - 100
              }}
            >
              {lines.map((line) => (
                <div
                  key={line.id}
                  className={`mb-1 ${getLineColor(line.type)}`}
                >
                  {line.content}
                </div>
              ))}
              
              {/* Current command line */}
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-green-600 font-medium">{currentDirectory} $</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`flex-1 outline-none font-mono ${themeClasses.input}`}
                  disabled={isExecuting}
                  placeholder={isExecuting ? "Executing..." : "Type a command..."}
                  style={{ backgroundColor: 'transparent' }}
                />
                {isExecuting && (
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Status Bar */}
            <div className={`px-4 py-2 text-xs ${themeClasses.textSecondary} border-t rounded-b-lg ${themeClasses.headerBg} ${themeClasses.border}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-light">Ready - {lines.length} lines</span>
                  <span className="font-light">{currentDirectory}</span>
                  {runningProcesses.length > 0 && (
                    <span className="text-green-600 font-medium">
                      ● {runningProcesses.length} active
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className={themeClasses.textSecondary}>Ctrl+C to interrupt</span>
                  <span className={themeClasses.textSecondary}>↑/↓ for history</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other Tab Contents */}
        {!isMinimized && activeTab !== 'TERMINAL' && (
          <div className={`flex-1 flex items-center justify-center p-8 ${themeClasses.bg} rounded-b-lg`}>
            <div className="text-center">
              <div className={`text-4xl mb-4 ${themeClasses.textSecondary}`}>
                {activeTab === 'PROBLEMS' && '⚠️'}
                {activeTab === 'OUTPUT' && '📄'}
                {activeTab === 'DEBUG_CONSOLE' && '🐛'}
              </div>
              <p className={`${themeClasses.textSecondary} text-sm`}>
                {activeTab === 'PROBLEMS' && 'No problems detected'}
                {activeTab === 'OUTPUT' && 'No output available'}
                {activeTab === 'DEBUG_CONSOLE' && 'Debug console is ready'}
              </p>
            </div>
          </div>
        )}

        {/* Resize Handle */}
        {!isMinimized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizing(true);
              setDragStart({
                x: e.clientX - size.width,
                y: e.clientY - size.height
              });
            }}
          >
            <div className={`w-full h-full ${themeClasses.textSecondary} opacity-50`}>
              <svg viewBox="0 0 16 16" className="w-full h-full">
                <path d="M16 16L10 16L16 10Z" fill="currentColor" />
                <path d="M16 16L6 16L16 6Z" fill="currentColor" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Terminal;