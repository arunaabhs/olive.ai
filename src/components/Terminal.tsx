import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minimize2, Maximize2, Play, Square, Zap, Code, FileText, Plus, MoreHorizontal } from 'lucide-react';

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
      content: 'PS C:\\Users\\KIIT\\react-weather-app>',
      timestamp: new Date()
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('C:\\Users\\KIIT\\react-weather-app');
  const [runningProcesses, setRunningProcesses] = useState<ProcessInfo[]>([]);
  const [activeTab, setActiveTab] = useState('TERMINAL');
  const [environmentVars, setEnvironmentVars] = useState<Record<string, string>>({
    NODE_ENV: 'development',
    PATH: '/usr/local/bin:/usr/bin:/bin',
    OLIVE_VERSION: '2.0.0',
    USER: 'developer'
  });
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

    addLine(`PS ${currentDirectory}> ${command}`, 'command');
    
    setIsExecuting(true);

    try {
      const cmd = command.trim().toLowerCase();
      const args = command.trim().split(' ');
      
      if (cmd === 'help') {
        addLine('Available commands:', 'info');
        addLine('  dir, ls        - List directory contents', 'output');
        addLine('  cd <path>      - Change directory', 'output');
        addLine('  npm <command>  - Node package manager', 'output');
        addLine('  clear          - Clear terminal', 'output');
        addLine('  exit           - Close terminal', 'output');
      } else if (cmd === 'clear') {
        setLines([{
          id: '1',
          type: 'success',
          content: `PS ${currentDirectory}>`,
          timestamp: new Date()
        }]);
      } else if (cmd === 'dir' || cmd === 'ls') {
        addLine('Directory of ' + currentDirectory, 'info');
        addLine('', 'output');
        addLine('Mode                 LastWriteTime         Length Name', 'output');
        addLine('----                 -------------         ------ ----', 'output');
        addLine('d-----        28/06/2025     22:15                node_modules', 'output');
        addLine('d-----        28/06/2025     22:15                public', 'output');
        addLine('d-----        28/06/2025     22:15                src', 'output');
        addLine('-a----        28/06/2025     22:15           1234 package.json', 'output');
        addLine('-a----        28/06/2025     22:15           5678 package-lock.json', 'output');
        addLine('-a----        28/06/2025     22:15            890 README.md', 'output');
        addLine('-a----        28/06/2025     22:15            456 vite.config.ts', 'output');
      } else if (cmd.startsWith('cd ')) {
        const path = args.slice(1).join(' ');
        if (path === '..') {
          const parts = currentDirectory.split('\\');
          parts.pop();
          setCurrentDirectory(parts.join('\\') || 'C:');
        } else {
          setCurrentDirectory(currentDirectory + '\\' + path);
        }
        addLine(`Changed directory to ${currentDirectory}`, 'success');
      } else if (cmd.startsWith('npm ')) {
        const npmArgs = command.slice(4);
        addLine(`Running: npm ${npmArgs}`, 'info');
        
        if (npmArgs.includes('start') || npmArgs.includes('dev')) {
          addLine('> react-weather-app@0.1.0 start', 'output');
          addLine('> react-scripts start', 'output');
          addLine('', 'output');
          addLine('Starting the development server...', 'info');
          setTimeout(() => {
            addLine('Compiled successfully!', 'success');
            addLine('', 'output');
            addLine('You can now view react-weather-app in the browser.', 'success');
            addLine('', 'output');
            addLine('  Local:            http://localhost:3000', 'info');
            addLine('  On Your Network:  http://192.168.1.100:3000', 'info');
            addLine('', 'output');
            addLine('Note that the development build is not optimized.', 'warning');
            addLine('To create a production build, use npm run build.', 'warning');
          }, 2000);
        } else if (npmArgs.includes('install')) {
          addLine('Installing dependencies...', 'info');
          setTimeout(() => {
            addLine('added 1234 packages from 567 contributors and audited 8901 packages in 45.678s', 'success');
            addLine('found 0 vulnerabilities', 'success');
          }, 1500);
        } else if (npmArgs.includes('build')) {
          addLine('> react-weather-app@0.1.0 build', 'output');
          addLine('> react-scripts build', 'output');
          addLine('', 'output');
          addLine('Creating an optimized production build...', 'info');
          setTimeout(() => {
            addLine('Compiled successfully.', 'success');
            addLine('', 'output');
            addLine('File sizes after gzip:', 'info');
            addLine('', 'output');
            addLine('  41.2 KB  build\\static\\js\\2.chunk.js', 'output');
            addLine('  2.8 KB   build\\static\\js\\main.chunk.js', 'output');
            addLine('  1.4 KB   build\\static\\js\\runtime-main.js', 'output');
            addLine('  547 B    build\\static\\css\\main.css', 'output');
            addLine('', 'output');
            addLine('The project was built successfully.', 'success');
          }, 3000);
        } else {
          addLine(`npm command completed: ${npmArgs}`, 'success');
        }
      } else if (cmd === 'exit') {
        addLine('Terminal session ended.', 'info');
        setTimeout(() => onClose(), 500);
      } else {
        addLine(`'${command}' is not recognized as an internal or external command,`, 'error');
        addLine('operable program or batch file.', 'error');
      }
    } catch (error) {
      addLine(`Error: ${error}`, 'error');
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
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'error':
        return 'text-red-500';
      case 'success':
        return isDarkMode ? 'text-green-400' : 'text-green-600';
      case 'info':
        return isDarkMode ? 'text-blue-400' : 'text-blue-600';
      case 'warning':
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return isDarkMode ? 'text-gray-300' : 'text-gray-700';
    }
  };

  useEffect(() => {
    if (onRunCode) {
      (window as any).terminalExecuteCode = (code: string, language: string) => {
        addLine(`Running ${language} code...`, 'info');
        setTimeout(() => {
          addLine('Code executed successfully', 'success');
        }, 1000);
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
    <div className={`flex flex-col transition-all duration-200 ${themeClasses.bg} ${themeClasses.border} border-t`}>
      {/* Terminal Header with Tabs */}
      <div className={`flex items-center justify-between ${themeClasses.headerBg} ${themeClasses.border} border-b`}>
        {/* Tabs */}
        <div className="flex items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-medium transition-all duration-200 ${
                activeTab === tab.id 
                  ? themeClasses.tabActive
                  : themeClasses.tabInactive
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{tab.name}</span>
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                    isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Terminal Actions */}
        <div className="flex items-center space-x-1 px-2">
          {activeTab === 'TERMINAL' && (
            <>
              <select className={`text-xs px-2 py-1 rounded ${themeClasses.surface} ${themeClasses.border} ${themeClasses.text}`}>
                <option>powershell</option>
                <option>cmd</option>
                <option>bash</option>
              </select>
              
              <button
                className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
                title="New Terminal"
              >
                <Plus className={`w-3 h-3 ${themeClasses.textSecondary}`} />
              </button>
              
              <button
                className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
                title="Split Terminal"
              >
                <Code className={`w-3 h-3 ${themeClasses.textSecondary}`} />
              </button>
              
              <button
                className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
                title="Kill Terminal"
              >
                <Square className={`w-3 h-3 ${themeClasses.textSecondary}`} />
              </button>
              
              <button
                className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
                title="More Actions"
              >
                <MoreHorizontal className={`w-3 h-3 ${themeClasses.textSecondary}`} />
              </button>
            </>
          )}
          
          <button
            onClick={onToggleSize}
            className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
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
            className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
            title="Close Panel"
          >
            <X className={`w-3 h-3 ${themeClasses.textSecondary}`} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      {!isMinimized && activeTab === 'TERMINAL' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div
            ref={terminalRef}
            className={`flex-1 overflow-y-auto p-3 font-mono text-sm ${themeClasses.bg}`}
            style={{ backgroundColor: isDarkMode ? '#1e1e1e' : '#ffffff' }}
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
            <div className="flex items-center space-x-1 mt-1">
              <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>PS {currentDirectory}{'>'}</span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`flex-1 outline-none font-mono ${themeClasses.input}`}
                disabled={isExecuting}
                placeholder=""
                style={{ backgroundColor: 'transparent' }}
              />
              {isExecuting && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Other Tab Contents */}
      {!isMinimized && activeTab !== 'TERMINAL' && (
        <div className={`flex-1 flex items-center justify-center p-8 ${themeClasses.bg}`}>
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
    </div>
  );
};

export default Terminal;