import React, { useState, useRef } from 'react';
import Sidebar from './Sidebar';
import CodeEditor from './CodeEditor';
import ProjectHeader from './ProjectHeader';
import CopilotSidebar from './CopilotSidebar';
import Terminal from './Terminal';

const Dashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [activeTab, setActiveTab] = useState('hello.js');
  const [openTabs, setOpenTabs] = useState(['hello.js', 'example.py', 'sample.html']);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
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
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-80'} flex-shrink-0 ${themeClasses.surface} ${themeClasses.border} border-r`}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNewFile={handleNewFile}
          isDarkMode={isDarkMode}
        />
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

          {/* Copilot Sidebar - Fixed width when open */}
          {copilotOpen && (
            <CopilotSidebar 
              isOpen={copilotOpen}
              onClose={() => setCopilotOpen(false)}
              currentCode={handleGetCurrentCode()}
              isDarkMode={isDarkMode}
            />
          )}
        </div>
        
        {/* Terminal */}
        {terminalOpen && (
          <div className={`${terminalMinimized ? 'h-12' : 'h-96'} flex-shrink-0 border-t ${themeClasses.border}`}>
            <Terminal
              isOpen={terminalOpen}
              onClose={() => setTerminalOpen(false)}
              onToggleSize={() => setTerminalMinimized(!terminalMinimized)}
              isMinimized={terminalMinimized}
              onRunCode={handleRunCode}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;