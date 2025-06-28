import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import CodeEditor from './CodeEditor';
import ProjectHeader from './ProjectHeader';
import CopilotSidebar from './CopilotSidebar';
import Terminal from './Terminal';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Reduced from 320 (20% reduction)
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotWidth, setCopilotWidth] = useState(320);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(384);
  const [currentCode, setCurrentCode] = useState('');
  const [activeTab, setActiveTab] = useState('hello.js');
  const [openTabs, setOpenTabs] = useState(['hello.js', 'example.py', 'sample.html']);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isResizing, setIsResizing] = useState<'sidebar' | 'copilot' | 'terminal' | null>(null);
  
  const editorRef = useRef<any>(null);

  const handleGetCurrentCode = () => {
    if (editorRef.current) {
      return editorRef.current.getValue() || '';
    }
    return currentCode;
  };

  const handleCloseTab = (tabName: string) => {
    const newTabs = openTabs.filter(tab => tab !== tabName);
    setOpenTabs(newTabs);
    if (activeTab === tabName && newTabs.length > 0) {
      setActiveTab(newTabs[0]);
    }
  };

  const handleNewFile = () => {
    const fileName = `untitled-${Date.now()}.js`;
    setOpenTabs([...openTabs, fileName]);
    setActiveTab(fileName);
  };

  const handleRunCode = (code: string, language: string) => {
    if (!terminalOpen) {
      setTerminalOpen(true);
    }
    
    if (terminalMinimized) {
      setTerminalMinimized(false);
    }
    
    setTimeout(() => {
      if ((window as any).terminalExecuteCode) {
        (window as any).terminalExecuteCode(code, language);
      }
    }, 100);
  };

  const handleRunFromEditor = () => {
    const code = handleGetCurrentCode();
    const language = activeTab.endsWith('.py') ? 'python' : 
                    activeTab.endsWith('.html') ? 'html' :
                    activeTab.endsWith('.css') ? 'css' :
                    activeTab.endsWith('.ts') || activeTab.endsWith('.tsx') ? 'typescript' :
                    'javascript';
    
    handleRunCode(code, language);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Mouse handlers for resizing
  const handleMouseDown = (type: 'sidebar' | 'copilot' | 'terminal') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(type);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    if (isResizing === 'sidebar') {
      const newWidth = Math.max(200, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);
    } else if (isResizing === 'copilot') {
      const newWidth = Math.max(280, Math.min(600, window.innerWidth - e.clientX));
      setCopilotWidth(newWidth);
    } else if (isResizing === 'terminal') {
      const newHeight = Math.max(200, Math.min(600, window.innerHeight - e.clientY));
      setTerminalHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(null);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isResizing === 'terminal' ? 'ns-resize' : 'ew-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing]);

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-900',
    border: 'border-gray-700',
    text: 'text-gray-100',
    surface: 'bg-gray-800',
    surfaceHover: 'hover:bg-gray-700'
  } : {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-800',
    surface: 'bg-white',
    surfaceHover: 'hover:bg-gray-100'
  };

  return (
    <div className={`h-screen flex ${themeClasses.bg}`}>
      {/* Sidebar with resize handle */}
      <div className="flex flex-shrink-0">
        <div 
          className={`${themeClasses.surface} ${themeClasses.border} border-r`}
          style={{ width: sidebarCollapsed ? '64px' : `${sidebarWidth}px` }}
        >
          <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onNewFile={handleNewFile}
            isDarkMode={isDarkMode}
          />
        </div>
        
        {/* Sidebar resize handle */}
        {!sidebarCollapsed && (
          <div
            className={`w-1 cursor-ew-resize ${themeClasses.border} border-r hover:bg-blue-500 transition-colors`}
            onMouseDown={handleMouseDown('sidebar')}
          />
        )}
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ProjectHeader 
          onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
          copilotOpen={copilotOpen}
          onToggleTerminal={() => setTerminalOpen(!terminalOpen)}
          terminalOpen={terminalOpen}
          activeTab={activeTab}
          openTabs={openTabs}
          onTabChange={setActiveTab}
          onTabClose={handleCloseTab}
          onRunCode={handleRunFromEditor}
          onToggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
        
        <div className="flex-1 flex min-h-0">
          {/* Code Editor */}
          <div className={`flex-1 min-w-0 ${themeClasses.surface}`}>
            <CodeEditor 
              ref={editorRef}
              onCodeChange={setCurrentCode}
              activeFile={activeTab}
              onRunCode={handleRunCode}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Copilot Sidebar with resize handle */}
          {copilotOpen && (
            <div className="flex flex-shrink-0">
              {/* Copilot resize handle */}
              <div
                className={`w-1 cursor-ew-resize ${themeClasses.border} border-l hover:bg-blue-500 transition-colors`}
                onMouseDown={handleMouseDown('copilot')}
              />
              
              <div style={{ width: `${copilotWidth}px` }}>
                <CopilotSidebar 
                  isOpen={copilotOpen}
                  onClose={() => setCopilotOpen(false)}
                  currentCode={handleGetCurrentCode()}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Terminal with resize handle */}
        {terminalOpen && (
          <div className="flex flex-col flex-shrink-0">
            {/* Terminal resize handle */}
            <div
              className={`h-1 cursor-ns-resize ${themeClasses.border} border-t hover:bg-blue-500 transition-colors`}
              onMouseDown={handleMouseDown('terminal')}
            />
            
            <div 
              className={`flex-shrink-0 border-t ${themeClasses.border}`}
              style={{ height: terminalMinimized ? '48px' : `${terminalHeight}px` }}
            >
              <Terminal
                isOpen={terminalOpen}
                onClose={() => setTerminalOpen(false)}
                onToggleSize={() => setTerminalMinimized(!terminalMinimized)}
                isMinimized={terminalMinimized}
                onRunCode={handleRunCode}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;