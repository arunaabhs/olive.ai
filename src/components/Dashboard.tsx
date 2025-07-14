import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './Sidebar';
import CodeEditor from './CodeEditor';
import ProjectHeader from './ProjectHeader';
import CopilotSidebar from './CopilotSidebar';
import Terminal from './Terminal';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  projectId?: string;
  collaborators?: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ projectId: propProjectId, collaborators = [] }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotWidth, setCopilotWidth] = useState(320);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [terminalMinimized, setTerminalMinimized] = useState(false);
  const [currentCode, setCurrentCode] = useState('');
  const [activeTab, setActiveTab] = useState('sample.txt');
  const [openTabs, setOpenTabs] = useState(['sample.txt']);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isResizing, setIsResizing] = useState<'sidebar' | 'copilot' | null>(null);
  const [userFiles, setUserFiles] = useState<string[]>(['sample.txt']);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [currentFolder, setCurrentFolder] = useState('My Project');
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    'sample.txt': `Welcome to Olive Code Editor!

This is a sample text file to get you started.

You can:
- Create new files and folders
- Write code in multiple languages
- Use the AI-powered copilot for assistance
- Collaborate with others in real-time

Start by creating a new file or editing this one!

Happy coding! 🚀`
  });
  
  const editorRef = useRef<any>(null);
  const { user } = useAuth();

  // Generate project ID based on environment and user
  const generateProjectId = () => {
    if (propProjectId) return propProjectId;
    
    // Check if in WebContainer environment
    const isWebContainer = window.location.hostname.includes('webcontainer') || 
                          window.location.hostname.includes('stackblitz') ||
                          window.location.hostname.includes('bolt.new');
    
    if (isWebContainer) {
      // In WebContainer, use a session-based ID
      const sessionId = sessionStorage.getItem('olive-session-id') || 
                       `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('olive-session-id', sessionId);
      return sessionId;
    }
    
    // For regular environments, use user-based ID
    return user?.id ? `user-${user.id}` : `guest-${Date.now()}`;
  };

  const projectId = generateProjectId();

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
    setShowNewFileModal(true);
  };

  const handleFileSelect = (fileName: string) => {
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName]);
    }
    setActiveTab(fileName);
    
    // Update editor content when switching files
    if (editorRef.current && fileContents[fileName]) {
      editorRef.current.setValue(fileContents[fileName]);
    }
  };

  const handleFileCreated = (fileName: string, template?: string) => {
    // Store the file content
    if (template) {
      setFileContents(prev => ({
        ...prev,
        [fileName]: template
      }));
    }
    
    // Add to user files list
    if (!userFiles.includes(fileName)) {
      setUserFiles([...userFiles, fileName]);
    }
    
    // Open the file in a new tab
    if (!openTabs.includes(fileName)) {
      setOpenTabs([...openTabs, fileName]);
    }
    setActiveTab(fileName);
    
    // Set the content in the editor
    if (editorRef.current && template) {
      editorRef.current.setValue(template);
    }
  };

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
    // Save the content for the active file
    setFileContents(prev => ({
      ...prev,
      [activeTab]: code
    }));
  };

  // Set up global function for folder creation
  useEffect(() => {
    (window as any).createNewFolder = () => {
      // This will be handled by the sidebar component
      setShowNewFileModal(false); // Close file modal if open
      // The sidebar will handle showing the folder input
    };
  }, []);

  // Load file content when switching tabs
  useEffect(() => {
    if (editorRef.current && fileContents[activeTab]) {
      editorRef.current.setValue(fileContents[activeTab]);
    }
  }, [activeTab]);

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
  const handleMouseDown = (type: 'sidebar' | 'copilot') => (e: React.MouseEvent) => {
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
    }
  };

  const handleMouseUp = () => {
    setIsResizing(null);
  };

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
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
            projectId={projectId}
            collaborators={collaborators}
            openTabs={openTabs}
            onFileSelect={handleFileSelect}
            currentFolder={currentFolder}
            onFolderChange={setCurrentFolder}
            onFileCreated={handleFileCreated}
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
          projectId={projectId}
          collaborators={collaborators}
          onNewFile={handleNewFile}
        />
        
        <div className="flex-1 flex min-h-0">
          {/* Code Editor */}
          <div className={`flex-1 min-w-0 ${themeClasses.surface}`}>
            <CodeEditor 
              ref={editorRef}
              onCodeChange={handleCodeChange}
              activeFile={activeTab}
              onRunCode={handleRunCode}
              isDarkMode={isDarkMode}
              projectId={projectId}
              collaborators={collaborators}
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
      </div>

      {/* Floating Terminal Window */}
      <Terminal
        isOpen={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onToggleSize={() => setTerminalMinimized(!terminalMinimized)}
        isMinimized={terminalMinimized}
        onRunCode={handleRunCode}
        isDarkMode={isDarkMode}
      />

      {/* New File Modal */}
      <NewFileModal
        isOpen={showNewFileModal}
        onClose={() => setShowNewFileModal(false)}
        onCreateFile={handleFileCreated}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default Dashboard;