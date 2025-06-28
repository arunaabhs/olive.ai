import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minimize2, Maximize2, Play, Square, Zap, Code, FileText } from 'lucide-react';

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
  const [environmentVars, setEnvironmentVars] = useState<Record<string, string>>({
    NODE_ENV: 'development',
    PATH: '/usr/local/bin:/usr/bin:/bin',
    OLIVE_VERSION: '2.0.0',
    USER: 'developer'
  });
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-800',
    border: 'border-gray-600',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    surface: 'bg-gray-700',
    surfaceHover: 'hover:bg-gray-600',
    headerBg: 'bg-gray-750',
    input: 'bg-transparent text-gray-100'
  } : {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    surface: 'bg-gray-50',
    surfaceHover: 'hover:bg-white/60',
    headerBg: 'bg-gray-50',
    input: 'bg-transparent text-gray-800'
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

  const addProcess = (name: string, language: string): string => {
    const processId = Date.now().toString();
    const newProcess: ProcessInfo = {
      id: processId,
      name,
      language,
      status: 'running',
      startTime: new Date(),
      output: []
    };
    setRunningProcesses(prev => [...prev, newProcess]);
    return processId;
  };

  const updateProcess = (processId: string, status: ProcessInfo['status'], output?: string) => {
    setRunningProcesses(prev => prev.map(p => {
      if (p.id === processId) {
        const updatedProcess = { ...p, status };
        if (output) {
          updatedProcess.output.push(output);
        }
        return updatedProcess;
      }
      return p;
    }));
  };

  const removeProcess = (processId: string) => {
    setRunningProcesses(prev => prev.filter(p => p.id !== processId));
  };

  const executeCode = async (code: string, language: string) => {
    const processId = addProcess(`${language}-execution`, language);
    addLine(`🚀 Starting ${language} execution...`, 'info');
    
    try {
      if (language === 'javascript' || language === 'typescript') {
        await executeJavaScript(code, processId);
      } else if (language === 'python') {
        await executePython(code, processId);
      } else if (language === 'html') {
        await executeHTML(code, processId);
      } else if (language === 'css') {
        await executeCSS(code, processId);
      } else if (language === 'cpp') {
        await executeCPP(code, processId);
      } else if (language === 'java') {
        await executeJava(code, processId);
      } else if (language === 'php') {
        await executePHP(code, processId);
      } else if (language === 'ruby') {
        await executeRuby(code, processId);
      } else if (language === 'go') {
        await executeGo(code, processId);
      } else if (language === 'rust') {
        await executeRust(code, processId);
      } else if (language === 'sql') {
        await executeSQL(code, processId);
      } else {
        addLine(`📝 ${language.charAt(0).toUpperCase() + language.slice(1)} syntax validation passed`, 'success');
        addLine(`💡 Full execution requires appropriate runtime environment`, 'info');
        updateProcess(processId, 'completed');
      }
      
      addLine(`✅ Execution completed successfully`, 'success');
      
    } catch (error) {
      addLine(`❌ Execution failed: ${error}`, 'error');
      updateProcess(processId, 'error');
    } finally {
      setTimeout(() => removeProcess(processId), 3000);
    }
  };

  const executeJavaScript = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Initializing JavaScript runtime...');
    
    try {
      const originalConsole = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const outputs: { type: string; content: string }[] = [];
      
      console.log = (...args) => {
        const content = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        outputs.push({ type: 'log', content });
      };
      
      console.error = (...args) => {
        const content = args.map(arg => String(arg)).join(' ');
        outputs.push({ type: 'error', content });
      };
      
      console.warn = (...args) => {
        const content = args.map(arg => String(arg)).join(' ');
        outputs.push({ type: 'warn', content });
      };
      
      const setTimeout = (fn: Function, delay: number) => {
        return window.setTimeout(fn, delay);
      };
      
      const fetch = window.fetch;
      
      const result = eval(`
        (async function() {
          ${code}
        })()
      `);
      
      if (result instanceof Promise) {
        await result;
      }
      
      console.log = originalConsole;
      console.error = originalError;
      console.warn = originalWarn;
      
      if (outputs.length > 0) {
        outputs.forEach(output => {
          if (output.type === 'error') {
            addLine(`❌ ${output.content}`, 'error');
          } else if (output.type === 'warn') {
            addLine(`⚠️  ${output.content}`, 'warning');
          } else {
            addLine(output.content, 'output');
          }
        });
      } else {
        addLine('Code executed successfully (no output)', 'info');
      }
      
      updateProcess(processId, 'completed');
      
    } catch (error) {
      addLine(`❌ JavaScript Error: ${error}`, 'error');
      updateProcess(processId, 'error');
    }
  };

  const executePython = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Starting Python interpreter...');
    addLine('🐍 Python interpreter started', 'info');
    
    const lines = code.split('\n').filter(line => line.trim());
    let variables: Record<string, any> = {};
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        continue;
      }
      
      if (trimmedLine.startsWith('print(')) {
        const match = trimmedLine.match(/print\((.*)\)/);
        if (match) {
          let content = match[1];
          if (content.startsWith('f"') || content.startsWith("f'")) {
            content = content.slice(2, -1);
            content = content.replace(/\{([^}]+)\}/g, (_, varName) => {
              return variables[varName] || `{${varName}}`;
            });
          } else {
            content = content.replace(/^["']|["']$/g, '');
          }
          addLine(content, 'output');
        }
      } else if (trimmedLine.includes(' = ')) {
        const [varName, varValue] = trimmedLine.split(' = ');
        variables[varName.trim()] = varValue.trim();
        addLine(`Variable assigned: ${varName.trim()}`, 'info');
      } else if (trimmedLine.startsWith('def ')) {
        const funcName = trimmedLine.match(/def\s+(\w+)/)?.[1];
        addLine(`Function defined: ${funcName}`, 'info');
      } else if (trimmedLine.startsWith('class ')) {
        const className = trimmedLine.match(/class\s+(\w+)/)?.[1];
        addLine(`Class defined: ${className}`, 'info');
      } else if (trimmedLine.startsWith('for ')) {
        addLine('Executing for loop...', 'info');
      } else if (trimmedLine.startsWith('if ')) {
        addLine('Evaluating condition...', 'info');
      } else if (trimmedLine.startsWith('import ') || trimmedLine.startsWith('from ')) {
        addLine(`Importing module: ${trimmedLine}`, 'info');
      } else if (trimmedLine) {
        addLine(`Executing: ${trimmedLine}`, 'info');
      }
    }
    
    addLine('✅ Python execution completed', 'success');
    updateProcess(processId, 'completed');
  };

  const executeHTML = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Parsing HTML document...');
    addLine('🌐 HTML document analysis:', 'info');
    
    const titleMatch = code.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
      addLine(`📄 Title: ${titleMatch[1]}`, 'output');
    }
    
    const headings = code.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi);
    if (headings) {
      addLine(`📝 Found ${headings.length} heading(s)`, 'output');
      headings.forEach((heading, i) => {
        const text = heading.replace(/<[^>]*>/g, '');
        addLine(`  H${i + 1}: ${text}`, 'output');
      });
    }
    
    const scripts = code.match(/<script[^>]*>(.*?)<\/script>/gis);
    if (scripts) {
      addLine(`⚡ Found ${scripts.length} script block(s)`, 'output');
      for (const script of scripts) {
        const jsCode = script.replace(/<script[^>]*>|<\/script>/gi, '');
        if (jsCode.trim()) {
          addLine('Executing embedded JavaScript...', 'info');
          try {
            eval(jsCode);
          } catch (error) {
            addLine(`Script error: ${error}`, 'error');
          }
        }
      }
    }
    
    const styles = code.match(/<style[^>]*>(.*?)<\/style>/gis);
    if (styles) {
      addLine(`🎨 Found ${styles.length} style block(s)`, 'output');
    }
    
    addLine('💡 HTML would be rendered in browser environment', 'info');
    updateProcess(processId, 'completed');
  };

  const executeCSS = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Parsing CSS styles...');
    addLine('🎨 CSS stylesheet analysis:', 'info');
    
    const rules = code.match(/[^{}]+\{[^{}]*\}/g);
    if (rules) {
      addLine(`📐 Found ${rules.length} CSS rule(s)`, 'output');
      
      rules.forEach((rule, i) => {
        const selector = rule.split('{')[0].trim();
        const properties = rule.split('{')[1].split('}')[0].split(';').filter(p => p.trim());
        addLine(`  Rule ${i + 1}: ${selector} (${properties.length} properties)`, 'output');
      });
    }
    
    if (code.includes('@keyframes')) {
      const animations = code.match(/@keyframes\s+[\w-]+/g);
      if (animations) {
        addLine(`🎬 Found ${animations.length} animation(s)`, 'output');
      }
    }
    
    if (code.includes('@media')) {
      const mediaQueries = code.match(/@media[^{]+/g);
      if (mediaQueries) {
        addLine(`📱 Found ${mediaQueries.length} media query/queries`, 'output');
      }
    }
    
    addLine('💡 CSS would be applied to HTML elements', 'info');
    updateProcess(processId, 'completed');
  };

  const executeCPP = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Compiling C++ code...');
    addLine('🔧 C++ code analysis:', 'info');
    
    if (code.includes('int main')) {
      addLine('✅ Main function found', 'output');
    }
    
    const includes = code.match(/#include\s*<[^>]+>/g);
    if (includes) {
      addLine(`📚 Found ${includes.length} include(s):`, 'output');
      includes.forEach(inc => addLine(`  ${inc}`, 'output'));
    }
    
    const couts = code.match(/cout\s*<<[^;]+;/g);
    if (couts) {
      addLine('📤 Output statements found:', 'output');
      couts.forEach(cout => {
        const output = cout.replace(/cout\s*<<\s*/, '').replace(/;$/, '').replace(/"/g, '');
        addLine(`  ${output}`, 'output');
      });
    }
    
    addLine('💡 Full compilation requires C++ compiler (g++, clang++)', 'info');
    updateProcess(processId, 'completed');
  };

  const executeJava = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Compiling Java code...');
    addLine('☕ Java code analysis:', 'info');
    
    const classMatch = code.match(/class\s+(\w+)/);
    if (classMatch) {
      addLine(`📦 Class found: ${classMatch[1]}`, 'output');
    }
    
    if (code.includes('public static void main')) {
      addLine('✅ Main method found', 'output');
    }
    
    const prints = code.match(/System\.out\.println\([^)]+\)/g);
    if (prints) {
      addLine('📤 Output statements found:', 'output');
      prints.forEach(print => {
        const output = print.replace(/System\.out\.println\(/, '').replace(/\)$/, '').replace(/"/g, '');
        addLine(`  ${output}`, 'output');
      });
    }
    
    addLine('💡 Full compilation requires Java compiler (javac)', 'info');
    updateProcess(processId, 'completed');
  };

  const executePHP = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Executing PHP code...');
    addLine('🐘 PHP code analysis:', 'info');
    
    const echos = code.match(/echo\s+[^;]+;/g);
    if (echos) {
      addLine('📤 Output statements found:', 'output');
      echos.forEach(echo => {
        const output = echo.replace(/echo\s+/, '').replace(/;$/, '').replace(/['"]/g, '');
        addLine(`  ${output}`, 'output');
      });
    }
    
    const variables = code.match(/\$\w+/g);
    if (variables) {
      const uniqueVars = [...new Set(variables)];
      addLine(`📊 Variables found: ${uniqueVars.join(', ')}`, 'output');
    }
    
    addLine('💡 Full execution requires PHP interpreter', 'info');
    updateProcess(processId, 'completed');
  };

  const executeRuby = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Executing Ruby code...');
    addLine('💎 Ruby code analysis:', 'info');
    
    const puts = code.match(/puts\s+[^\n]+/g);
    if (puts) {
      addLine('📤 Output statements found:', 'output');
      puts.forEach(put => {
        const output = put.replace(/puts\s+/, '').replace(/['"]/g, '');
        addLine(`  ${output}`, 'output');
      });
    }
    
    addLine('💡 Full execution requires Ruby interpreter', 'info');
    updateProcess(processId, 'completed');
  };

  const executeGo = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Compiling Go code...');
    addLine('🐹 Go code analysis:', 'info');
    
    if (code.includes('func main()')) {
      addLine('✅ Main function found', 'output');
    }
    
    const prints = code.match(/fmt\.Println\([^)]+\)/g);
    if (prints) {
      addLine('📤 Output statements found:', 'output');
      prints.forEach(print => {
        const output = print.replace(/fmt\.Println\(/, '').replace(/\)$/, '').replace(/"/g, '');
        addLine(`  ${output}`, 'output');
      });
    }
    
    addLine('💡 Full compilation requires Go compiler', 'info');
    updateProcess(processId, 'completed');
  };

  const executeRust = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Compiling Rust code...');
    addLine('🦀 Rust code analysis:', 'info');
    
    if (code.includes('fn main()')) {
      addLine('✅ Main function found', 'output');
    }
    
    const prints = code.match(/println!\([^)]+\)/g);
    if (prints) {
      addLine('📤 Output statements found:', 'output');
      prints.forEach(print => {
        const output = print.replace(/println!\(/, '').replace(/\)$/, '').replace(/"/g, '');
        addLine(`  ${output}`, 'output');
      });
    }
    
    addLine('💡 Full compilation requires Rust compiler (rustc)', 'info');
    updateProcess(processId, 'completed');
  };

  const executeSQL = async (code: string, processId: string) => {
    updateProcess(processId, 'running', 'Parsing SQL statements...');
    addLine('🗃️  SQL query analysis:', 'info');
    
    const statements = code.split(';').filter(s => s.trim());
    
    statements.forEach((statement, i) => {
      const trimmed = statement.trim().toUpperCase();
      
      if (trimmed.startsWith('SELECT')) {
        addLine(`📊 Query ${i + 1}: SELECT statement`, 'output');
      } else if (trimmed.startsWith('INSERT')) {
        addLine(`➕ Query ${i + 1}: INSERT statement`, 'output');
      } else if (trimmed.startsWith('UPDATE')) {
        addLine(`✏️  Query ${i + 1}: UPDATE statement`, 'output');
      } else if (trimmed.startsWith('DELETE')) {
        addLine(`🗑️  Query ${i + 1}: DELETE statement`, 'output');
      } else if (trimmed.startsWith('CREATE')) {
        addLine(`🏗️  Query ${i + 1}: CREATE statement`, 'output');
      } else if (trimmed.startsWith('DROP')) {
        addLine(`💥 Query ${i + 1}: DROP statement`, 'output');
      }
    });
    
    addLine('💡 Full execution requires database connection', 'info');
    updateProcess(processId, 'completed');
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
        addLine('🔧 Development Tools:', 'info');
        addLine('  git <command>  - Git version control', 'output');
        addLine('  docker <cmd>   - Docker container management', 'output');
        addLine('  curl <url>     - HTTP client', 'output');
        addLine('  grep <pattern> - Search text patterns', 'output');
        addLine('', 'output');
        addLine('⚙️  System Commands:', 'info');
        addLine('  ps             - List running processes', 'output');
        addLine('  kill <pid>     - Terminate process', 'output');
        addLine('  env            - Show environment variables', 'output');
        addLine('  export VAR=val - Set environment variable', 'output');
        addLine('  clear          - Clear terminal', 'output');
        addLine('  exit           - Exit terminal', 'output');
        addLine('', 'output');
        addLine('💡 Pro Tips:', 'info');
        addLine('  • Press Ctrl+Enter in editor to run code', 'output');
        addLine('  • Use Tab for command completion', 'output');
        addLine('  • Use ↑/↓ arrows for command history', 'output');
        addLine('  • Use Ctrl+C to interrupt running processes', 'output');
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
        addLine('  🔧 algorithms.cpp', 'output');
        addLine('  🤖 machine-learning.py', 'output');
        addLine('  🌐 web-components.html', 'output');
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
      } else if (cmd.startsWith('echo ')) {
        const text = command.slice(5);
        addLine(text, 'output');
      } else if (cmd === 'date') {
        addLine(new Date().toString(), 'output');
      } else if (cmd === 'whoami') {
        addLine('developer', 'output');
      } else if (cmd === 'ps') {
        addLine('📊 Running Processes:', 'info');
        if (runningProcesses.length === 0) {
          addLine('No active processes', 'output');
        } else {
          runningProcesses.forEach(process => {
            const duration = Date.now() - process.startTime.getTime();
            addLine(`PID: ${process.id} | ${process.name} | ${process.status} | ${duration}ms`, 'output');
          });
        }
      } else if (cmd.startsWith('kill ')) {
        const pid = args[1];
        const process = runningProcesses.find(p => p.id === pid);
        if (process) {
          removeProcess(pid);
          addLine(`🛑 Terminated process ${pid} (${process.name})`, 'success');
        } else {
          addLine(`❌ Process ${pid} not found`, 'error');
        }
      } else if (cmd === 'env') {
        addLine('🌍 Environment Variables:', 'info');
        Object.entries(environmentVars).forEach(([key, value]) => {
          addLine(`${key}=${value}`, 'output');
        });
      } else if (cmd.startsWith('export ')) {
        const envVar = command.slice(7);
        const [key, value] = envVar.split('=');
        if (key && value) {
          setEnvironmentVars(prev => ({ ...prev, [key]: value }));
          addLine(`✅ Set ${key}=${value}`, 'success');
        } else {
          addLine('❌ Invalid syntax. Use: export VAR=value', 'error');
        }
      } else if (cmd.startsWith('cat ')) {
        const filename = args[1];
        addLine(`📖 Reading ${filename}...`, 'info');
        addLine('// File contents would appear here in a real file system', 'output');
        addLine('// This is a simulated environment', 'output');
      } else if (cmd.startsWith('touch ')) {
        const filename = args[1];
        addLine(`📄 Created file: ${filename}`, 'success');
      } else if (cmd.startsWith('mkdir ')) {
        const dirname = args[1];
        addLine(`📂 Created directory: ${dirname}`, 'success');
      } else if (cmd.startsWith('run ')) {
        const filename = args[1];
        if (filename) {
          addLine(`🚀 Executing ${filename}...`, 'info');
          const language = filename.endsWith('.py') ? 'python' : 
                          filename.endsWith('.js') ? 'javascript' :
                          filename.endsWith('.html') ? 'html' :
                          filename.endsWith('.cpp') ? 'cpp' :
                          filename.endsWith('.java') ? 'java' : 'javascript';
          
          setTimeout(() => {
            addLine(`✅ ${filename} executed successfully`, 'success');
          }, 1000);
        } else {
          addLine('❌ Please specify a file to run', 'error');
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
        } else if (npmArgs.includes('test')) {
          addLine('🧪 Running test suite...', 'info');
          setTimeout(() => {
            addLine('✅ All tests passed', 'success');
            addLine('📊 Coverage: 87.3%', 'info');
            addLine('⏱️  Time: 2.847s', 'info');
          }, 2200);
        } else {
          addLine(`✅ npm ${npmArgs} completed`, 'success');
        }
      } else if (cmd.startsWith('yarn ')) {
        const yarnArgs = command.slice(5);
        addLine(`🧶 Running: yarn ${yarnArgs}`, 'info');
        setTimeout(() => {
          addLine('✅ Yarn command completed', 'success');
        }, 1500);
      } else if (cmd.startsWith('pip ')) {
        const pipArgs = command.slice(4);
        addLine(`🐍 Running: pip ${pipArgs}`, 'info');
        setTimeout(() => {
          addLine('✅ Python package operation completed', 'success');
        }, 1800);
      } else if (cmd.startsWith('node ')) {
        const filename = args[1];
        addLine(`🟢 Running Node.js: ${filename}`, 'info');
        setTimeout(() => {
          addLine('Hello from Node.js!', 'output');
          addLine('✅ Process completed with exit code 0', 'success');
        }, 1000);
      } else if (cmd.startsWith('python ')) {
        const filename = args[1];
        addLine(`🐍 Running Python: ${filename}`, 'info');
        setTimeout(() => {
          addLine('Hello from Python!', 'output');
          addLine('✅ Process completed successfully', 'success');
        }, 1200);
      } else if (cmd.startsWith('java ')) {
        const filename = args[1];
        addLine(`☕ Compiling and running Java: ${filename}`, 'info');
        setTimeout(() => {
          addLine('javac compilation successful', 'info');
          addLine('Hello from Java!', 'output');
          addLine('✅ Java application completed', 'success');
        }, 1800);
      } else if (cmd.startsWith('gcc ') || cmd.startsWith('g++ ')) {
        const filename = args[1];
        addLine(`🔧 Compiling C/C++: ${filename}`, 'info');
        setTimeout(() => {
          addLine('Compilation successful', 'info');
          addLine('Executable created: a.out', 'success');
        }, 1500);
      } else if (cmd.startsWith('git ')) {
        const gitArgs = command.slice(4);
        addLine(`📝 Running: git ${gitArgs}`, 'info');
        
        if (gitArgs.includes('status')) {
          setTimeout(() => {
            addLine('On branch main', 'output');
            addLine('Your branch is up to date with \'origin/main\'.', 'output');
            addLine('', 'output');
            addLine('Changes not staged for commit:', 'warning');
            addLine('  modified:   src/components/CodeEditor.tsx', 'output');
            addLine('  modified:   src/components/Terminal.tsx', 'output');
            addLine('', 'output');
            addLine('no changes added to commit (use "git add" to stage)', 'info');
          }, 800);
        } else if (gitArgs.includes('add')) {
          setTimeout(() => {
            addLine('✅ Changes staged for commit', 'success');
          }, 600);
        } else if (gitArgs.includes('commit')) {
          setTimeout(() => {
            addLine('[main 7a8b9c2] Enhanced terminal functionality', 'success');
            addLine('2 files changed, 847 insertions(+), 23 deletions(-)', 'info');
          }, 1000);
        } else if (gitArgs.includes('push')) {
          setTimeout(() => {
            addLine('Enumerating objects: 12, done.', 'info');
            addLine('Counting objects: 100% (12/12), done.', 'info');
            addLine('✅ Successfully pushed to origin/main', 'success');
          }, 1500);
        } else {
          setTimeout(() => {
            addLine('✅ Git command completed', 'success');
          }, 800);
        }
      } else if (cmd.startsWith('docker ')) {
        const dockerArgs = command.slice(7);
        addLine(`🐳 Running: docker ${dockerArgs}`, 'info');
        setTimeout(() => {
          addLine('✅ Docker command completed', 'success');
        }, 1200);
      } else if (cmd.startsWith('curl ')) {
        const url = args[1];
        addLine(`🌐 Making HTTP request to: ${url}`, 'info');
        setTimeout(() => {
          addLine('HTTP/1.1 200 OK', 'success');
          addLine('Content-Type: application/json', 'info');
          addLine('{"status": "success", "message": "API response"}', 'output');
        }, 1500);
      } else if (cmd.startsWith('grep ')) {
        const pattern = args[1];
        addLine(`🔍 Searching for pattern: ${pattern}`, 'info');
        setTimeout(() => {
          addLine('src/components/Terminal.tsx:42:  const pattern = "example";', 'output');
          addLine('src/components/CodeEditor.tsx:156:  // Pattern matching', 'output');
          addLine('✅ Search completed', 'success');
        }, 800);
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
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const commands = [
        'help', 'clear', 'ls', 'dir', 'pwd', 'cd', 'cat', 'touch', 'mkdir',
        'run', 'npm', 'yarn', 'pip', 'node', 'python', 'java', 'gcc', 'g++',
        'git', 'docker', 'curl', 'grep', 'ps', 'kill', 'env', 'export',
        'echo', 'date', 'whoami', 'exit'
      ];
      const matches = commands.filter(cmd => cmd.startsWith(currentCommand.toLowerCase()));
      if (matches.length === 1) {
        setCurrentCommand(matches[0] + ' ');
      } else if (matches.length > 1) {
        addLine(`Available completions: ${matches.join(', ')}`, 'info');
      }
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      if (runningProcesses.length > 0) {
        const activeProcess = runningProcesses[runningProcesses.length - 1];
        removeProcess(activeProcess.id);
        addLine(`^C`, 'command');
        addLine(`🛑 Process ${activeProcess.name} interrupted`, 'warning');
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
      (window as any).terminalExecuteCode = executeCode;
    }
  }, [onRunCode]);

  if (!isOpen) return null;

  return (
    <div className={`border rounded-xl flex flex-col transition-all duration-200 shadow-lg ${
      isMinimized ? 'h-12' : ''
    } ${themeClasses.bg} ${themeClasses.border}`}>
      {/* Terminal Header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b rounded-t-xl ${themeClasses.headerBg} ${themeClasses.border}`}>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex items-center space-x-2">
            <TerminalIcon className={`w-4 h-4 ${themeClasses.textSecondary}`} />
            <span className={`text-sm ${themeClasses.text} font-medium`}>Olive Terminal Pro</span>
            {runningProcesses.length > 0 && (
              <div className="flex items-center space-x-2 ml-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">
                  {runningProcesses.length} process{runningProcesses.length > 1 ? 'es' : ''} running
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {runningProcesses.length > 0 && (
            <button
              onClick={() => {
                runningProcesses.forEach(p => removeProcess(p.id));
                addLine('🛑 All processes terminated', 'warning');
              }}
              className="p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200"
              title="Stop All Processes"
            >
              <Square className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onToggleSize}
            className={`p-1.5 ${themeClasses.surfaceHover} rounded-lg transition-all duration-200`}
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
            className={`p-1.5 ${themeClasses.surfaceHover} rounded-lg transition-all duration-200`}
            title="Close"
          >
            <X className={`w-4 h-4 ${themeClasses.textSecondary}`} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      {!isMinimized && (
        <>
          <div
            ref={terminalRef}
            className={`flex-1 overflow-y-auto p-4 font-mono text-sm ${themeClasses.bg}`}
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
              />
              {(isExecuting || runningProcesses.length > 0) && (
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </div>
          </div>

          {/* Enhanced Status Bar */}
          <div className={`px-4 py-2 text-xs ${themeClasses.textSecondary} border-t rounded-b-xl ${themeClasses.headerBg} ${themeClasses.border}`}>
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
                <span className={themeClasses.textSecondary}>Tab to complete</span>
                <span className={themeClasses.textSecondary}>↑/↓ for history</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Terminal;