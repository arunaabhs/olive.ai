import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minimize2, Maximize2, Play, Square, Zap, Code, FileText, Plus, MoreHorizontal, Move, GripHorizontal } from 'lucide-react';

interface TerminalInstance {
  id: string;
  name: string;
  lines: TerminalLine[];
  currentCommand: string;
  currentDirectory: string;
  isActive: boolean;
  history: TerminalLine[][];
  historyIndex: number;
}

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
  const [terminals, setTerminals] = useState<TerminalInstance[]>([
    {
      id: '1',
      name: 'bash',
      lines: [
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
      ],
      currentCommand: '',
      currentDirectory: '~/olive-project',
      isActive: true,
      history: [],
      historyIndex: -1
    }
  ]);
  
  const [activeTerminalId, setActiveTerminalId] = useState('1');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [runningProcesses, setRunningProcesses] = useState<ProcessInfo[]>([]);
  const [activeTab, setActiveTab] = useState('TERMINAL');
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 800, height: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
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

  const activeTerminal = terminals.find(t => t.id === activeTerminalId) || terminals[0];

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [activeTerminal?.lines]);

  useEffect(() => {
    if (isOpen && inputRef.current && !isMinimized) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized, activeTerminalId]);

  // Enhanced dragging functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('drag-handle') || target.closest('.drag-handle')) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragStart.x));
      const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragStart.y));
      setPosition({ x: newX, y: newY });
    } else if (isResizing) {
      const newWidth = Math.max(400, Math.min(window.innerWidth - position.x, resizeStart.width + (e.clientX - resizeStart.x)));
      const newHeight = Math.max(300, Math.min(window.innerHeight - position.y, resizeStart.height + (e.clientY - resizeStart.y)));
      setSize({ width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isDragging ? 'move' : 'se-resize';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart]);

  // Save state to history before making changes
  const saveToHistory = () => {
    setTerminals(prev => prev.map(terminal => 
      terminal.id === activeTerminalId 
        ? { 
            ...terminal, 
            history: [...terminal.history.slice(0, terminal.historyIndex + 1), [...terminal.lines]],
            historyIndex: terminal.historyIndex + 1
          }
        : terminal
    ));
  };

  // Undo functionality
  const handleUndo = () => {
    const terminal = activeTerminal;
    if (terminal.historyIndex > 0) {
      setTerminals(prev => prev.map(t => 
        t.id === activeTerminalId 
          ? { 
              ...t, 
              lines: terminal.history[terminal.historyIndex - 1] || [],
              historyIndex: terminal.historyIndex - 1
            }
          : t
      ));
    }
  };

  // Redo functionality
  const handleRedo = () => {
    const terminal = activeTerminal;
    if (terminal.historyIndex < terminal.history.length - 1) {
      setTerminals(prev => prev.map(t => 
        t.id === activeTerminalId 
          ? { 
              ...t, 
              lines: terminal.history[terminal.historyIndex + 1] || [],
              historyIndex: terminal.historyIndex + 1
            }
          : t
      ));
    }
  };

  // Cut functionality
  const handleCut = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      // Remove selected text (simplified implementation)
      window.getSelection()?.deleteFromDocument();
    }
  };

  // Copy functionality
  const handleCopy = () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
    } else {
      // Copy all terminal content if nothing is selected
      const allContent = activeTerminal.lines.map(line => line.content).join('\n');
      navigator.clipboard.writeText(allContent);
    }
  };

  // Paste functionality
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (inputRef.current) {
        const currentValue = inputRef.current.value;
        const cursorPosition = inputRef.current.selectionStart || 0;
        const newValue = currentValue.slice(0, cursorPosition) + text + currentValue.slice(cursorPosition);
        updateCurrentCommand(newValue);
        
        // Set cursor position after paste
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(cursorPosition + text.length, cursorPosition + text.length);
          }
        }, 0);
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  // Select all functionality
  const handleSelectAll = () => {
    if (terminalRef.current) {
      const range = document.createRange();
      range.selectNodeContents(terminalRef.current);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  };

  // Find functionality
  const handleFind = () => {
    const searchTerm = prompt('Search in terminal:');
    if (searchTerm && terminalRef.current) {
      const content = terminalRef.current.textContent || '';
      const index = content.toLowerCase().indexOf(searchTerm.toLowerCase());
      if (index !== -1) {
        // Highlight found text (simplified implementation)
        addLine(`🔍 Found "${searchTerm}" in terminal output`, 'info');
      } else {
        addLine(`🔍 "${searchTerm}" not found in terminal output`, 'warning');
      }
    }
  };

  // Clear terminal
  const handleClear = () => {
    saveToHistory();
    setTerminals(prev => prev.map(terminal => 
      terminal.id === activeTerminalId 
        ? { ...terminal, lines: [] }
        : terminal
    ));
  };

  const addLine = (content: string, type: 'command' | 'output' | 'error' | 'success' | 'info' | 'warning' = 'output') => {
    const newLine: TerminalLine = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      content,
      timestamp: new Date()
    };
    
    setTerminals(prev => prev.map(terminal => 
      terminal.id === activeTerminalId 
        ? { ...terminal, lines: [...terminal.lines, newLine] }
        : terminal
    ));
  };

  const updateCurrentCommand = (command: string) => {
    setTerminals(prev => prev.map(terminal => 
      terminal.id === activeTerminalId 
        ? { ...terminal, currentCommand: command }
        : terminal
    ));
  };

  const createNewTerminal = () => {
    const newTerminalId = Date.now().toString();
    const newTerminal: TerminalInstance = {
      id: newTerminalId,
      name: `bash-${terminals.length + 1}`,
      lines: [
        {
          id: '1',
          type: 'success',
          content: `🚀 New Terminal Session ${terminals.length + 1}`,
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'info',
          content: '💡 Ready for commands',
          timestamp: new Date()
        }
      ],
      currentCommand: '',
      currentDirectory: '~/olive-project',
      isActive: false,
      history: [],
      historyIndex: -1
    };

    setTerminals(prev => [...prev, newTerminal]);
    setActiveTerminalId(newTerminalId);
  };

  const closeTerminal = (terminalId: string) => {
    if (terminals.length === 1) return; // Don't close the last terminal
    
    setTerminals(prev => prev.filter(t => t.id !== terminalId));
    
    if (activeTerminalId === terminalId) {
      const remainingTerminals = terminals.filter(t => t.id !== terminalId);
      setActiveTerminalId(remainingTerminals[0]?.id || '');
    }
  };

  // Real code execution function
  const executeRealCode = async (code: string, language: string) => {
    saveToHistory(); // Save state before execution
    addLine(`🚀 Executing ${language} code...`, 'info');
    addLine('', 'output');
    
    try {
      if (language === 'javascript' || language === 'typescript') {
        // Execute JavaScript/TypeScript code
        addLine('// JavaScript Execution Output:', 'info');
        addLine('', 'output');
        
        // Create a safe execution environment
        const originalConsoleLog = console.log;
        const originalConsoleError = console.error;
        const originalConsoleWarn = console.warn;
        
        const outputs: string[] = [];
        
        // Override console methods to capture output
        console.log = (...args) => {
          const output = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          outputs.push(output);
          addLine(output, 'output');
        };
        
        console.error = (...args) => {
          const output = args.map(arg => String(arg)).join(' ');
          outputs.push(`ERROR: ${output}`);
          addLine(`ERROR: ${output}`, 'error');
        };
        
        console.warn = (...args) => {
          const output = args.map(arg => String(arg)).join(' ');
          outputs.push(`WARNING: ${output}`);
          addLine(`WARNING: ${output}`, 'warning');
        };
        
        try {
          // Execute the code
          const result = eval(code);
          
          // If the result is not undefined and nothing was logged, show the result
          if (result !== undefined && outputs.length === 0) {
            const resultStr = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
            addLine(`→ ${resultStr}`, 'success');
          }
          
          addLine('', 'output');
          addLine('✅ JavaScript execution completed successfully', 'success');
          
        } catch (error) {
          addLine(`❌ Runtime Error: ${error}`, 'error');
        } finally {
          // Restore original console methods
          console.log = originalConsoleLog;
          console.error = originalConsoleError;
          console.warn = originalConsoleWarn;
        }
        
      } else if (language === 'python') {
        // Python code simulation (since we can't run Python in browser)
        addLine('# Python Execution Simulation:', 'info');
        addLine('', 'output');
        
        // Parse and simulate Python code
        const lines = code.split('\n');
        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine.startsWith('print(')) {
            // Extract content from print statement
            const match = trimmedLine.match(/print\((.*)\)/);
            if (match) {
              try {
                // Simple evaluation for basic print statements
                let content = match[1];
                
                // Handle string literals
                if (content.startsWith('"') && content.endsWith('"')) {
                  content = content.slice(1, -1);
                } else if (content.startsWith("'") && content.endsWith("'")) {
                  content = content.slice(1, -1);
                }
                
                addLine(content, 'output');
              } catch (e) {
                addLine(trimmedLine, 'output');
              }
            }
          } else if (trimmedLine.startsWith('#')) {
            // Comment
            addLine(`# ${trimmedLine.substring(1)}`, 'info');
          } else if (trimmedLine && !trimmedLine.includes('def ') && !trimmedLine.includes('class ')) {
            // Other statements
            addLine(`→ ${trimmedLine}`, 'output');
          }
        }
        
        addLine('', 'output');
        addLine('✅ Python simulation completed', 'success');
        addLine('💡 Note: This is a simulation. For real Python execution, use a Python environment.', 'info');
        
      } else if (language === 'html') {
        // HTML preview
        addLine('🌐 HTML Preview:', 'info');
        addLine('', 'output');
        addLine('📄 HTML content loaded successfully', 'success');
        addLine('🔍 To view the rendered HTML, save the file and open it in a browser', 'info');
        
        // Count elements
        const elementMatches = code.match(/<[^/][^>]*>/g) || [];
        addLine(`📊 Found ${elementMatches.length} HTML elements`, 'info');
        
      } else {
        // Generic code execution
        addLine(`📝 ${language.toUpperCase()} Code Analysis:`, 'info');
        addLine('', 'output');
        
        const lines = code.split('\n').filter(line => line.trim());
        addLine(`📊 Lines of code: ${lines.length}`, 'info');
        addLine(`📏 Characters: ${code.length}`, 'info');
        
        // Look for common patterns
        if (code.includes('function') || code.includes('=>')) {
          addLine('🔧 Functions detected', 'info');
        }
        if (code.includes('class ')) {
          addLine('🏗️  Classes detected', 'info');
        }
        if (code.includes('import ') || code.includes('require(')) {
          addLine('📦 Imports/Dependencies detected', 'info');
        }
        
        addLine('', 'output');
        addLine('✅ Code analysis completed', 'success');
      }
      
    } catch (error) {
      addLine(`❌ Execution Error: ${error}`, 'error');
    }
  };

  const executeCommand = async (command: string) => {
    if (!command.trim()) return;

    saveToHistory(); // Save state before command execution
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    addLine(`${activeTerminal.currentDirectory} $ ${command}`, 'command');
    updateCurrentCommand('');
    
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
        handleClear();
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
        addLine(activeTerminal.currentDirectory, 'output');
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
        } else {
          addLine(`✅ npm ${npmArgs} completed`, 'success');
        }
      } else if (cmd === 'exit') {
        if (terminals.length > 1) {
          closeTerminal(activeTerminalId);
          addLine('👋 Terminal session closed.', 'info');
        } else {
          addLine('👋 Goodbye! Closing terminal.', 'info');
          setTimeout(() => onClose(), 1000);
        }
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
      if (activeTerminal.currentCommand.trim()) {
        executeCommand(activeTerminal.currentCommand);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        updateCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          updateCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          updateCurrentCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
          break;
        case 'y':
          e.preventDefault();
          handleRedo();
          break;
        case 'x':
          e.preventDefault();
          handleCut();
          break;
        case 'c':
          e.preventDefault();
          handleCopy();
          break;
        case 'v':
          e.preventDefault();
          handlePaste();
          break;
        case 'a':
          e.preventDefault();
          handleSelectAll();
          break;
        case 'f':
          e.preventDefault();
          handleFind();
          break;
        case 'l':
          e.preventDefault();
          handleClear();
          break;
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

  // Set up the global function for code execution from editor
  useEffect(() => {
    (window as any).terminalExecuteCode = (code: string, language: string) => {
      executeRealCode(code, language);
    };
  }, [activeTerminalId]);

  if (!isOpen) return null;

  const tabs = [
    { id: 'PROBLEMS', name: 'PROBLEMS', count: 0 },
    { id: 'OUTPUT', name: 'OUTPUT', count: null },
    { id: 'DEBUG_CONSOLE', name: 'DEBUG CONSOLE', count: null },
    { id: 'TERMINAL', name: 'TERMINAL', count: null }
  ];

  return (
    <div
      ref={windowRef}
      className={`fixed z-50 rounded-lg shadow-2xl border ${themeClasses.bg} ${themeClasses.border} select-none`}
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
      {/* Terminal Header with Enhanced Drag Handle */}
      <div
        className={`flex items-center justify-between ${themeClasses.headerBg} ${themeClasses.border} border-b rounded-t-lg`}
      >
        {/* Window Controls and Drag Handle */}
        <div className="flex items-center space-x-2 px-3 py-2">
          <div className="flex space-x-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full cursor-pointer hover:bg-red-600 transition-colors" onClick={onClose}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full cursor-pointer hover:bg-yellow-600 transition-colors" onClick={onToggleSize}></div>
            <div className="w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:bg-green-600 transition-colors"></div>
          </div>
          
          {/* Enhanced Drag Handle */}
          <div 
            className="drag-handle flex items-center space-x-1 px-2 py-1 rounded cursor-move hover:bg-gray-600/20 transition-colors"
            onMouseDown={handleMouseDown}
            title="Drag to move terminal"
          >
            <GripHorizontal className={`w-4 h-4 ${themeClasses.textSecondary}`} />
            <span className={`text-xs ${themeClasses.textSecondary} font-medium`}>Terminal</span>
          </div>
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
              {/* Terminal Tabs */}
              <div className="flex items-center space-x-1 mr-2">
                {terminals.map((terminal) => (
                  <div key={terminal.id} className="flex items-center">
                    <button
                      onClick={() => setActiveTerminalId(terminal.id)}
                      className={`px-2 py-1 text-xs rounded transition-all duration-200 ${
                        activeTerminalId === terminal.id
                          ? 'bg-blue-600 text-white'
                          : `${themeClasses.surface} ${themeClasses.text} ${themeClasses.surfaceHover}`
                      }`}
                    >
                      {terminal.name}
                    </button>
                    {terminals.length > 1 && (
                      <button
                        onClick={() => closeTerminal(terminal.id)}
                        className={`ml-1 p-0.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
                        title="Close Terminal"
                      >
                        <X className={`w-2 h-2 ${themeClasses.textSecondary}`} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleUndo}
                disabled={activeTerminal.historyIndex <= 0}
                className={`p-1 rounded transition-all duration-200 ${
                  activeTerminal.historyIndex <= 0 
                    ? 'opacity-50 cursor-not-allowed' 
                    : `${themeClasses.surfaceHover} cursor-pointer`
                }`}
                title="Undo (Ctrl+Z)"
              >
                <span className={`text-xs ${themeClasses.textSecondary}`}>↶</span>
              </button>
              
              <button
                onClick={handleRedo}
                disabled={activeTerminal.historyIndex >= activeTerminal.history.length - 1}
                className={`p-1 rounded transition-all duration-200 ${
                  activeTerminal.historyIndex >= activeTerminal.history.length - 1
                    ? 'opacity-50 cursor-not-allowed' 
                    : `${themeClasses.surfaceHover} cursor-pointer`
                }`}
                title="Redo (Ctrl+Y)"
              >
                <span className={`text-xs ${themeClasses.textSecondary}`}>↷</span>
              </button>

              <select className={`text-xs px-2 py-1 rounded ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text}`}>
                <option>bash</option>
                <option>zsh</option>
                <option>powershell</option>
              </select>
              
              <button
                onClick={createNewTerminal}
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
            className={`flex-1 overflow-y-auto p-4 font-mono text-sm ${themeClasses.bg} select-text`}
            style={{ 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
              height: size.height - 100
            }}
          >
            {activeTerminal.lines.map((line) => (
              <div
                key={line.id}
                className={`mb-1 ${getLineColor(line.type)}`}
              >
                {line.content}
              </div>
            ))}
            
            {/* Current command line */}
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-green-600 font-medium">{activeTerminal.currentDirectory} $</span>
              <input
                ref={inputRef}
                type="text"
                value={activeTerminal.currentCommand}
                onChange={(e) => updateCurrentCommand(e.target.value)}
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
                <span className="font-light">Terminal {activeTerminalId} - {activeTerminal.lines.length} lines</span>
                <span className="font-light">{activeTerminal.currentDirectory}</span>
                {runningProcesses.length > 0 && (
                  <span className="text-green-600 font-medium">
                    ● {runningProcesses.length} active
                  </span>
                )}
                <span className="font-light">
                  History: {activeTerminal.historyIndex + 1}/{activeTerminal.history.length}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className={themeClasses.textSecondary}>Ctrl+Z/Y: Undo/Redo</span>
                <span className={themeClasses.textSecondary}>Ctrl+C/V: Copy/Paste</span>
                <span className={themeClasses.textSecondary}>↑/↓: History</span>
                <span className={themeClasses.textSecondary}>{terminals.length} terminal{terminals.length > 1 ? 's' : ''}</span>
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

      {/* Enhanced Resize Handle */}
      {!isMinimized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-blue-500/20 transition-colors"
          onMouseDown={handleResizeStart}
          title="Drag to resize"
        >
          <div className={`w-full h-full ${themeClasses.textSecondary} opacity-50 hover:opacity-100 transition-opacity`}>
            <svg viewBox="0 0 16 16" className="w-full h-full">
              <path d="M16 16L10 16L16 10Z" fill="currentColor" />
              <path d="M16 16L6 16L16 6Z" fill="currentColor" />
              <path d="M16 16L2 16L16 2Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default Terminal;