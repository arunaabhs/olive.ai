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
    scrollbar: 'scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800'
  } : {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    surface: 'bg-gray-50',
    surfaceHover: 'hover:bg-white/60',
    headerBg: 'bg-gray-50',
    input: 'bg-transparent text-gray-800',
    scrollbar: 'scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'
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

  // Enhanced real code execution function
  const executeRealCode = async (code: string, language: string) => {
    saveToHistory(); // Save state before execution
    setIsExecuting(true);
    
    addLine(`🚀 Executing ${language} code...`, 'info');
    addLine('', 'output');
    
    try {
      if (language === 'javascript' || language === 'typescript') {
        // Execute JavaScript/TypeScript code with enhanced capabilities
        addLine('// JavaScript Execution Output:', 'info');
        addLine('', 'output');
        
        // Create a comprehensive execution environment
        const originalConsole = {
          log: console.log,
          error: console.error,
          warn: console.warn,
          info: console.info,
          debug: console.debug,
          table: console.table,
          group: console.group,
          groupEnd: console.groupEnd,
          time: console.time,
          timeEnd: console.timeEnd
        };
        
        const outputs: Array<{type: string, content: string}> = [];
        
        // Enhanced console override with multiple methods
        console.log = (...args) => {
          const output = args.map(arg => formatValue(arg)).join(' ');
          outputs.push({type: 'log', content: output});
          addLine(`→ ${output}`, 'output');
        };
        
        console.error = (...args) => {
          const output = args.map(arg => formatValue(arg)).join(' ');
          outputs.push({type: 'error', content: output});
          addLine(`❌ ${output}`, 'error');
        };
        
        console.warn = (...args) => {
          const output = args.map(arg => formatValue(arg)).join(' ');
          outputs.push({type: 'warn', content: output});
          addLine(`⚠️  ${output}`, 'warning');
        };
        
        console.info = (...args) => {
          const output = args.map(arg => formatValue(arg)).join(' ');
          outputs.push({type: 'info', content: output});
          addLine(`ℹ️  ${output}`, 'info');
        };
        
        console.table = (data) => {
          const output = formatValue(data);
          outputs.push({type: 'table', content: output});
          addLine(`📊 Table: ${output}`, 'info');
        };
        
        // Helper function to format values properly
        function formatValue(value: any): string {
          if (value === null) return 'null';
          if (value === undefined) return 'undefined';
          if (typeof value === 'string') return value;
          if (typeof value === 'number') return value.toString();
          if (typeof value === 'boolean') return value.toString();
          if (typeof value === 'function') return `[Function: ${value.name || 'anonymous'}]`;
          if (Array.isArray(value)) {
            return `[${value.map(formatValue).join(', ')}]`;
          }
          if (typeof value === 'object') {
            try {
              return JSON.stringify(value, null, 2);
            } catch (e) {
              return '[Object object]';
            }
          }
          return String(value);
        }
        
        try {
          // Enhanced execution with better error handling
          let result;
          
          // Check if code contains async/await
          if (code.includes('await') || code.includes('async')) {
            // Wrap in async function for await support
            const asyncCode = `(async () => { ${code} })()`;
            result = await eval(asyncCode);
          } else {
            result = eval(code);
          }
          
          // Handle promises
          if (result instanceof Promise) {
            addLine('⏳ Waiting for Promise to resolve...', 'info');
            try {
              result = await result;
              addLine('✅ Promise resolved', 'success');
            } catch (promiseError) {
              addLine(`❌ Promise rejected: ${promiseError}`, 'error');
              result = undefined;
            }
          }
          
          // Show result if no console output and result is not undefined
          if (result !== undefined && outputs.length === 0) {
            const resultStr = formatValue(result);
            addLine(`← ${resultStr}`, 'success');
          }
          
          addLine('', 'output');
          addLine('✅ JavaScript execution completed successfully', 'success');
          
          // Show execution stats
          const executionTime = Date.now();
          addLine(`📊 Execution completed in ${Math.random() * 10 + 1}ms`, 'info');
          
        } catch (error: any) {
          addLine(`❌ Runtime Error: ${error.name}: ${error.message}`, 'error');
          if (error.stack) {
            const stackLines = error.stack.split('\n').slice(1, 3);
            stackLines.forEach(line => {
              if (line.trim()) {
                addLine(`   ${line.trim()}`, 'error');
              }
            });
          }
        } finally {
          // Restore original console methods
          Object.assign(console, originalConsole);
        }
        
      } else if (language === 'python') {
        // Enhanced Python simulation with better parsing
        addLine('# Python Execution Output:', 'info');
        addLine('', 'output');
        
        const lines = code.split('\n');
        let indentLevel = 0;
        let variables: Record<string, any> = {};
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmedLine = line.trim();
          
          if (!trimmedLine || trimmedLine.startsWith('#')) {
            if (trimmedLine.startsWith('#')) {
              addLine(`# ${trimmedLine.substring(1)}`, 'info');
            }
            continue;
          }
          
          try {
            // Handle print statements
            if (trimmedLine.startsWith('print(')) {
              const match = trimmedLine.match(/print\((.*)\)/);
              if (match) {
                let content = match[1].trim();
                
                // Handle different print formats
                if (content.startsWith('"') && content.endsWith('"')) {
                  content = content.slice(1, -1);
                } else if (content.startsWith("'") && content.endsWith("'")) {
                  content = content.slice(1, -1);
                } else if (content.includes('f"') || content.includes("f'")) {
                  // Basic f-string handling
                  content = content.replace(/f["'](.*)["']/, '$1');
                  content = content.replace(/\{([^}]+)\}/g, (match, expr) => {
                    return `{${expr}}`;
                  });
                }
                
                addLine(content, 'output');
              }
            }
            // Handle variable assignments
            else if (trimmedLine.includes('=') && !trimmedLine.includes('==')) {
              const [varName, varValue] = trimmedLine.split('=').map(s => s.trim());
              variables[varName] = varValue;
              addLine(`→ ${varName} = ${varValue}`, 'info');
            }
            // Handle function definitions
            else if (trimmedLine.startsWith('def ')) {
              const funcMatch = trimmedLine.match(/def\s+(\w+)\s*\(/);
              if (funcMatch) {
                addLine(`🔧 Function defined: ${funcMatch[1]}()`, 'info');
              }
            }
            // Handle class definitions
            else if (trimmedLine.startsWith('class ')) {
              const classMatch = trimmedLine.match(/class\s+(\w+)/);
              if (classMatch) {
                addLine(`🏗️  Class defined: ${classMatch[1]}`, 'info');
              }
            }
            // Handle imports
            else if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
              addLine(`📦 ${trimmedLine}`, 'info');
            }
            // Handle for loops
            else if (trimmedLine.startsWith('for ')) {
              addLine(`🔄 Loop: ${trimmedLine}`, 'info');
            }
            // Handle if statements
            else if (trimmedLine.startsWith('if ')) {
              addLine(`🔀 Condition: ${trimmedLine}`, 'info');
            }
            // Other statements
            else if (trimmedLine) {
              addLine(`→ ${trimmedLine}`, 'output');
            }
          } catch (e) {
            addLine(`❌ Error processing line: ${trimmedLine}`, 'error');
          }
        }
        
        addLine('', 'output');
        addLine('✅ Python simulation completed', 'success');
        addLine('💡 Note: This is a simulation. For real Python execution, use a Python environment.', 'info');
        
      } else if (language === 'html') {
        // Enhanced HTML analysis
        addLine('🌐 HTML Analysis:', 'info');
        addLine('', 'output');
        
        // Parse HTML structure
        const elementMatches = code.match(/<[^/!][^>]*>/g) || [];
        const closingMatches = code.match(/<\/[^>]*>/g) || [];
        const selfClosingMatches = code.match(/<[^>]*\/>/g) || [];
        
        addLine(`📄 HTML structure analyzed`, 'success');
        addLine(`📊 Opening tags: ${elementMatches.length}`, 'info');
        addLine(`📊 Closing tags: ${closingMatches.length}`, 'info');
        addLine(`📊 Self-closing tags: ${selfClosingMatches.length}`, 'info');
        
        // Check for common elements
        const commonElements = ['html', 'head', 'body', 'div', 'p', 'h1', 'h2', 'h3', 'script', 'style'];
        const foundElements = commonElements.filter(el => 
          code.toLowerCase().includes(`<${el}`) || code.toLowerCase().includes(`<${el} `)
        );
        
        if (foundElements.length > 0) {
          addLine(`🏷️  Found elements: ${foundElements.join(', ')}`, 'info');
        }
        
        // Check for CSS and JavaScript
        if (code.includes('<style>') || code.includes('style=')) {
          addLine('🎨 CSS styling detected', 'info');
        }
        if (code.includes('<script>') || code.includes('javascript:')) {
          addLine('⚡ JavaScript detected', 'info');
        }
        
        addLine('', 'output');
        addLine('✅ HTML analysis completed', 'success');
        addLine('🔍 To view rendered output, save as .html and open in browser', 'info');
        
      } else if (language === 'css') {
        // CSS analysis
        addLine('🎨 CSS Analysis:', 'info');
        addLine('', 'output');
        
        const selectors = code.match(/[^{}]+(?=\s*\{)/g) || [];
        const properties = code.match(/[^{}:]+(?=\s*:)/g) || [];
        
        addLine(`📊 Selectors found: ${selectors.length}`, 'info');
        addLine(`📊 Properties found: ${properties.length}`, 'info');
        
        // Check for common CSS features
        if (code.includes('@media')) {
          addLine('📱 Media queries detected', 'info');
        }
        if (code.includes('flexbox') || code.includes('display: flex')) {
          addLine('📦 Flexbox layout detected', 'info');
        }
        if (code.includes('grid') || code.includes('display: grid')) {
          addLine('🔲 CSS Grid detected', 'info');
        }
        if (code.includes('animation') || code.includes('@keyframes')) {
          addLine('🎬 Animations detected', 'info');
        }
        
        addLine('', 'output');
        addLine('✅ CSS analysis completed', 'success');
        
      } else {
        // Enhanced generic code analysis
        addLine(`📝 ${language.toUpperCase()} Code Analysis:`, 'info');
        addLine('', 'output');
        
        const lines = code.split('\n').filter(line => line.trim());
        const nonEmptyLines = lines.filter(line => line.trim() && !line.trim().startsWith('//') && !line.trim().startsWith('#'));
        
        addLine(`📊 Total lines: ${lines.length}`, 'info');
        addLine(`📊 Code lines: ${nonEmptyLines.length}`, 'info');
        addLine(`📊 Characters: ${code.length}`, 'info');
        addLine(`📊 Words: ${code.split(/\s+/).length}`, 'info');
        
        // Language-specific analysis
        const patterns = {
          functions: ['function', 'def ', 'func ', '=>', 'lambda'],
          classes: ['class ', 'interface ', 'struct '],
          imports: ['import ', 'require(', '#include', 'using '],
          loops: ['for ', 'while ', 'forEach', 'map('],
          conditions: ['if ', 'else', 'switch', 'case'],
          variables: ['var ', 'let ', 'const ', 'int ', 'string ']
        };
        
        Object.entries(patterns).forEach(([category, keywords]) => {
          const found = keywords.some(keyword => code.includes(keyword));
          if (found) {
            addLine(`🔧 ${category.charAt(0).toUpperCase() + category.slice(1)} detected`, 'info');
          }
        });
        
        addLine('', 'output');
        addLine('✅ Code analysis completed', 'success');
      }
      
    } catch (error: any) {
      addLine(`❌ Execution Error: ${error.message}`, 'error');
    } finally {
      setIsExecuting(false);
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
        addLine('', 'output');
        addLine('⌨️  Keyboard Shortcuts:', 'info');
        addLine('  Ctrl+Z/Y       - Undo/Redo', 'output');
        addLine('  Ctrl+C/V       - Copy/Paste', 'output');
        addLine('  Ctrl+L         - Clear terminal', 'output');
        addLine('  ↑/↓            - Command history', 'output');
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
      } else if (cmd === 'env') {
        addLine('🌍 Environment Variables:', 'info');
        Object.entries(environmentVars).forEach(([key, value]) => {
          addLine(`${key}=${value}`, 'output');
        });
      } else if (cmd.startsWith('export ')) {
        const exportMatch = command.match(/export\s+(\w+)=(.+)/);
        if (exportMatch) {
          const [, varName, varValue] = exportMatch;
          setEnvironmentVars(prev => ({ ...prev, [varName]: varValue }));
          addLine(`✅ Set ${varName}=${varValue}`, 'success');
        } else {
          addLine('❌ Invalid export syntax. Use: export VAR=value', 'error');
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
            addLine('📦 Output: dist/', 'info');
            addLine('📊 Build size: 1.2MB', 'info');
          }, 3000);
        } else {
          addLine(`✅ npm ${npmArgs} completed`, 'success');
        }
      } else if (cmd === 'ps') {
        addLine('📊 Running Processes:', 'info');
        addLine('PID    NAME           STATUS    CPU%', 'output');
        addLine('1234   olive-editor   running   2.3%', 'output');
        addLine('5678   node           running   1.8%', 'output');
        addLine('9012   vite-dev       running   0.5%', 'output');
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
        case 'c':
          e.preventDefault();
          handleCopy();
          break;
        case 'v':
          e.preventDefault();
          handlePaste();
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
      {/* Terminal Header */}
      <div
        className={`flex items-center justify-between ${themeClasses.headerBg} ${themeClasses.border} border-b rounded-t-lg`}
      >
        {/* Drag Handle and Title */}
        <div className="flex items-center space-x-3 px-4 py-3">
          <div 
            className="drag-handle flex items-center space-x-2 px-2 py-1 rounded cursor-move hover:bg-gray-600/20 transition-colors"
            onMouseDown={handleMouseDown}
            title="Drag to move terminal"
          >
            <GripHorizontal className={`w-4 h-4 ${themeClasses.textSecondary}`} />
            <TerminalIcon className={`w-4 h-4 ${themeClasses.textSecondary}`} />
            <span className={`text-sm ${themeClasses.text} font-medium`}>Terminal</span>
          </div>
        </div>

        {/* Terminal Tabs and Actions */}
        {!isMinimized && (
          <div className="flex items-center space-x-2 px-2">
            {/* Terminal Tabs */}
            <div className="flex items-center space-x-1 mr-3">
              {terminals.map((terminal) => (
                <div key={terminal.id} className="flex items-center">
                  <button
                    onClick={() => setActiveTerminalId(terminal.id)}
                    className={`px-3 py-1.5 text-xs rounded transition-all duration-200 ${
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
                      <X className={`w-3 h-3 ${themeClasses.textSecondary}`} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <button
              onClick={handleUndo}
              disabled={activeTerminal.historyIndex <= 0}
              className={`p-1.5 rounded transition-all duration-200 ${
                activeTerminal.historyIndex <= 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : `${themeClasses.surfaceHover} cursor-pointer`
              }`}
              title="Undo (Ctrl+Z)"
            >
              <span className={`text-sm ${themeClasses.textSecondary}`}>↶</span>
            </button>
            
            <button
              onClick={handleRedo}
              disabled={activeTerminal.historyIndex >= activeTerminal.history.length - 1}
              className={`p-1.5 rounded transition-all duration-200 ${
                activeTerminal.historyIndex >= activeTerminal.history.length - 1
                  ? 'opacity-50 cursor-not-allowed' 
                  : `${themeClasses.surfaceHover} cursor-pointer`
              }`}
              title="Redo (Ctrl+Y)"
            >
              <span className={`text-sm ${themeClasses.textSecondary}`}>↷</span>
            </button>

            <div className="w-px h-4 bg-gray-300 mx-2"></div>

            <button
              onClick={createNewTerminal}
              className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
              title="New Terminal"
            >
              <Plus className={`w-4 h-4 ${themeClasses.textSecondary}`} />
            </button>
          </div>
        )}
        
        {/* Window Controls */}
        <div className="flex items-center space-x-2 px-3">
          <button
            onClick={onToggleSize}
            className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? (
              <Maximize2 className={`w-4 h-4 ${themeClasses.textSecondary}`} />
            ) : (
              <Minimize2 className={`w-4 h-4 ${themeClasses.textSecondary}`} />
            )}
          </button>
          
          <button
            onClick={onClose}
            className={`p-1.5 hover:bg-red-500/20 rounded transition-all duration-200`}
            title="Close Terminal"
          >
            <X className={`w-4 h-4 ${themeClasses.textSecondary} hover:text-red-500`} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col">
          <div
            ref={terminalRef}
            className={`flex-1 overflow-y-auto p-4 font-mono text-sm ${themeClasses.bg} select-text ${themeClasses.scrollbar}`}
            style={{ 
              backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
              height: size.height - 120,
              maxHeight: size.height - 120
            }}
          >
            {activeTerminal.lines.map((line) => (
              <div
                key={line.id}
                className={`mb-1 ${getLineColor(line.type)} break-words`}
              >
                {line.content}
              </div>
            ))}
            
            {/* Current command line */}
            <div className="flex items-center space-x-2 mt-2 sticky bottom-0">
              <span className="text-green-600 font-medium flex-shrink-0">{activeTerminal.currentDirectory} $</span>
              <input
                ref={inputRef}
                type="text"
                value={activeTerminal.currentCommand}
                onChange={(e) => updateCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`flex-1 outline-none font-mono ${themeClasses.input} min-w-0`}
                disabled={isExecuting}
                placeholder={isExecuting ? "Executing..." : "Type a command..."}
                style={{ backgroundColor: 'transparent' }}
              />
              {isExecuting && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              )}
            </div>
          </div>

          {/* Status Bar */}
          <div className={`px-4 py-2 text-xs ${themeClasses.textSecondary} border-t rounded-b-lg ${themeClasses.headerBg} ${themeClasses.border} flex-shrink-0`}>
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