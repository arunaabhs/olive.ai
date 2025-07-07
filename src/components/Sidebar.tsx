import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
  Plus,
  MoreHorizontal,
  FileText,
  Settings,
  X,
  Home,
  Search,
  GitBranch,
  Package,
  Terminal,
  Code,
  Database,
  Users,
  Globe
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNewFile: () => void;
  isDarkMode?: boolean;
  projectId?: string;
  collaborators?: any[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  onToggle, 
  onNewFile, 
  isDarkMode = false, 
  projectId = 'default-project',
  collaborators = []
}) => {
  const [explorerExpanded, setExplorerExpanded] = useState(true);
  const [srcExpanded, setSrcExpanded] = useState(true);
  const [publicExpanded, setPublicExpanded] = useState(false);
  const [functionsExpanded, setFunctionsExpanded] = useState(false);
  const [openEditorsExpanded, setOpenEditorsExpanded] = useState(true);
  const [showNewFileInput, setShowNewFileInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogoClick = () => {
    navigate('/');
  };

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-800',
    border: 'border-gray-600',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    surface: 'bg-gray-700',
    surfaceHover: 'hover:bg-gray-600',
    accent: 'text-blue-400'
  } : {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    surface: 'bg-gray-50',
    surfaceHover: 'hover:bg-white/40',
    accent: 'text-green-600'
  };

  const fileStructure = [
    {
      name: 'node_modules',
      type: 'folder',
      expanded: false,
      children: [],
      icon: '📦'
    },
    {
      name: 'public',
      type: 'folder',
      expanded: publicExpanded,
      children: [
        { name: 'vite.svg', type: 'file', icon: '🖼️' },
        { name: 'favicon.ico', type: 'file', icon: '🖼️' },
        { name: '_redirects', type: 'file', icon: '🔀' }
      ],
      icon: '📁'
    },
    {
      name: 'src',
      type: 'folder',
      expanded: srcExpanded,
      children: [
        { 
          name: 'components', 
          type: 'folder', 
          children: [
            { name: 'App.tsx', type: 'file', icon: '⚛️' },
            { name: 'Dashboard.tsx', type: 'file', icon: '⚛️' },
            { name: 'LandingPage.tsx', type: 'file', icon: '⚛️' },
            { name: 'ProjectRoom.tsx', type: 'file', icon: '⚛️' },
            { name: 'CodeEditor.tsx', type: 'file', icon: '⚛️' },
            { name: 'Terminal.tsx', type: 'file', icon: '⚛️' },
            { name: 'Sidebar.tsx', type: 'file', icon: '⚛️' },
            { name: 'ProjectHeader.tsx', type: 'file', icon: '⚛️' },
            { name: 'CopilotSidebar.tsx', type: 'file', icon: '⚛️' },
            { name: 'AuthModal.tsx', type: 'file', icon: '⚛️' },
            { name: 'Logo.tsx', type: 'file', icon: '⚛️' }
          ],
          icon: '📂'
        },
        { 
          name: 'contexts', 
          type: 'folder', 
          children: [
            { name: 'AuthContext.tsx', type: 'file', icon: '⚛️' }
          ],
          icon: '📂'
        },
        { 
          name: 'lib', 
          type: 'folder', 
          children: [
            { name: 'supabase.ts', type: 'file', icon: '🗃️' },
            { name: 'gemini.ts', type: 'file', icon: '🤖' },
            { name: 'openrouter.ts', type: 'file', icon: '🤖' }
          ],
          icon: '📂'
        },
        { name: 'App.css', type: 'file', icon: '🎨' },
        { name: 'App.tsx', type: 'file', icon: '⚛️' },
        { name: 'index.css', type: 'file', icon: '🎨' },
        { name: 'main.tsx', type: 'file', icon: '⚛️' },
        { name: 'vite-env.d.ts', type: 'file', icon: '📝' }
      ],
      icon: '📂'
    },
    {
      name: 'functions',
      type: 'folder',
      expanded: functionsExpanded,
      children: [
        { name: 'auth.js', type: 'file', icon: '🔐' },
        { name: 'copilot.js', type: 'file', icon: '🤖' }
      ],
      icon: '⚙️'
    },
    { name: '.env', type: 'file', icon: '🔧' },
    { name: '.gitignore', type: 'file', icon: '📄' },
    { name: 'eslint.config.js', type: 'file', icon: '⚙️' },
    { name: 'hello.js', type: 'file', icon: '📄' },
    { name: 'example.py', type: 'file', icon: '🐍' },
    { name: 'sample.html', type: 'file', icon: '🌐' },
    { name: 'advanced.js', type: 'file', icon: '🚀' },
    { name: 'data-structures.py', type: 'file', icon: '📊' },
    { name: 'web-components.html', type: 'file', icon: '🌐' },
    { name: 'algorithms.cpp', type: 'file', icon: '⚙️' },
    { name: 'machine-learning.py', type: 'file', icon: '🤖' },
    { name: 'index.html', type: 'file', icon: '🌐' },
    { name: 'package-lock.json', type: 'file', icon: '📦' },
    { name: 'package.json', type: 'file', icon: '📦' },
    { name: 'postcss.config.js', type: 'file', icon: '⚙️' },
    { name: 'README.md', type: 'file', icon: '📖' },
    { name: 'tailwind.config.js', type: 'file', icon: '⚙️' },
    { name: 'tsconfig.app.json', type: 'file', icon: '⚙️' },
    { name: 'tsconfig.json', type: 'file', icon: '⚙️' },
    { name: 'tsconfig.node.json', type: 'file', icon: '⚙️' },
    { name: 'vite.config.ts', type: 'file', icon: '⚙️' }
  ];

  const openEditors = [
    { name: 'hello.js', closable: false, icon: '📄' },
    { name: 'example.py', closable: false, icon: '🐍' },
    { name: 'sample.html', closable: false, icon: '🌐' },
    { name: 'advanced.js', closable: true, icon: '🚀' },
    { name: 'data-structures.py', closable: true, icon: '📊' },
    { name: 'web-components.html', closable: true, icon: '🌐' }
  ];

  const handleCreateNewFile = () => {
    setShowNewFileInput(true);
    setNewFileName('');
  };

  const handleNewFileSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newFileName.trim()) {
        onNewFile(); // This will trigger the new file modal
        setShowNewFileInput(false);
        setNewFileName('');
      }
    } else if (e.key === 'Escape') {
      setShowNewFileInput(false);
      setNewFileName('');
    }
  };

  const handleNewFileBlur = () => {
    if (newFileName.trim()) {
      onNewFile(); // This will trigger the new file modal
    }
    setShowNewFileInput(false);
    setNewFileName('');
  };

  const renderFileTree = (items: any[], level = 0) => {
    return items.map((item, index) => (
      <div key={index}>
        <div 
          className={`flex items-center py-1.5 px-2 ${themeClasses.surfaceHover} cursor-pointer text-xs transition-all duration-200 rounded mx-1 ${
            level > 0 ? `ml-${level * 3}` : ''
          }`}
          style={{ paddingLeft: `${8 + level * 12}px` }}
        >
          {item.type === 'folder' ? (
            <>
              <button 
                className={`mr-1.5 p-0.5 ${themeClasses.surfaceHover} rounded transition-colors`}
                onClick={() => {
                  if (item.name === 'src') setSrcExpanded(!srcExpanded);
                  if (item.name === 'public') setPublicExpanded(!publicExpanded);
                  if (item.name === 'functions') setFunctionsExpanded(!functionsExpanded);
                }}
              >
                {item.expanded ? (
                  <ChevronDown className={`w-2.5 h-2.5 ${themeClasses.textSecondary}`} />
                ) : (
                  <ChevronRight className={`w-2.5 h-2.5 ${themeClasses.textSecondary}`} />
                )}
              </button>
              {item.expanded ? (
                <FolderOpen className={`w-3 h-3 ${themeClasses.accent} mr-2`} />
              ) : (
                <Folder className={`w-3 h-3 ${themeClasses.accent} mr-2`} />
              )}
              <span className={`${themeClasses.text} font-light`}>{item.name}</span>
            </>
          ) : (
            <>
              <div className="w-3 mr-1.5"></div>
              <span className="mr-2 text-xs">{item.icon}</span>
              <span className={`${themeClasses.textSecondary} font-light`}>{item.name}</span>
            </>
          )}
        </div>
        {item.type === 'folder' && item.expanded && item.children && (
          <div>
            {renderFileTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  if (collapsed) {
    return (
      <div className={`w-16 border-r flex flex-col ${themeClasses.bg} ${themeClasses.border}`}>
        <div className={`p-2 border-b ${themeClasses.border}`}>
          <button
            onClick={onToggle}
            className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200 w-full`}
          >
            <File className={`w-4 h-4 ${themeClasses.textSecondary}`} />
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center py-3 space-y-2">
          <Logo 
            size="sm" 
            clickable 
            onClick={handleLogoClick}
            className="hover:scale-110 transition-transform duration-200"
            variant={isDarkMode ? 'white' : 'default'}
          />
          <button className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`} title="Search">
            <Search className={`w-4 h-4 ${themeClasses.textSecondary}`} />
          </button>
          <button className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`} title="Git">
            <GitBranch className={`w-4 h-4 ${themeClasses.textSecondary}`} />
          </button>
          <button className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`} title="Extensions">
            <Package className={`w-4 h-4 ${themeClasses.textSecondary}`} />
          </button>
          <button className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`} title="Terminal">
            <Terminal className={`w-4 h-4 ${themeClasses.textSecondary}`} />
          </button>
          <button className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`} title="Collaboration">
            <Users className={`w-4 h-4 ${themeClasses.textSecondary}`} />
          </button>
          <button className={`p-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`} title="Settings">
            <Settings className={`w-4 h-4 ${themeClasses.textSecondary}`} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${themeClasses.bg}`}>
      {/* Header */}
      <div className={`p-3 border-b flex items-center justify-between ${themeClasses.border}`}>
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-2 group"
        >
          <Logo 
            size="sm" 
            clickable 
            onClick={handleLogoClick}
            variant={isDarkMode ? 'white' : 'default'}
          />
          <span className={`text-sm font-light ${themeClasses.text} group-hover:${themeClasses.textSecondary} transition-colors`}>
            Explorer
          </span>
        </button>
        <div className="flex items-center space-x-1">
          <button 
            onClick={onNewFile}
            className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
            title="New File"
          >
            <Plus className={`w-3 h-3 ${themeClasses.textSecondary}`} />
          </button>
          <button className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`} title="More Actions">
            <MoreHorizontal className={`w-3 h-3 ${themeClasses.textSecondary}`} />
          </button>
          <button
            onClick={onToggle}
            className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
            title="Collapse Sidebar"
          >
            <X className={`w-3 h-3 ${themeClasses.textSecondary}`} />
          </button>
        </div>
      </div>

      {/* Project Info */}
      <div className={`px-3 py-2 border-b ${themeClasses.border} ${themeClasses.surface}`}>
        <div className="flex items-center space-x-2">
          <Globe className={`w-3 h-3 ${themeClasses.accent}`} />
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium ${themeClasses.text} truncate`}>
              {user ? `${user.email?.split('@')[0]}'s Project` : 'Guest Project'}
            </p>
            <p className={`text-xs ${themeClasses.textSecondary} truncate`}>
              ID: {projectId}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Collaboration Active"></div>
            <Users className={`w-3 h-3 ${themeClasses.textSecondary}`} title="Collaborative Project" />
          </div>
        </div>
      </div>

      {/* Collaborators Section */}
      {collaborators.length > 0 && (
        <div className={`border-b ${themeClasses.border}`}>
          <div className={`flex items-center justify-between p-3 ${themeClasses.surfaceHover} cursor-pointer transition-all duration-200`}>
            <div className="flex items-center">
              <Users className={`w-3 h-3 ${themeClasses.textSecondary} mr-1.5`} />
              <span className={`text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>
                Collaborators
              </span>
            </div>
            <span className={`text-xs ${themeClasses.textSecondary} ${themeClasses.surface} px-1.5 py-0.5 rounded-full`}>
              {collaborators.filter(c => c.isOnline).length}/{collaborators.length}
            </span>
          </div>
          <div className="pb-3">
            {collaborators.map((collaborator, index) => (
              <div key={index} className={`flex items-center justify-between px-4 py-1.5 ${themeClasses.surfaceHover} cursor-pointer group transition-all duration-200 rounded mx-1`}>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    style={{ backgroundColor: collaborator.color }}
                  >
                    {collaborator.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className={`text-xs ${themeClasses.text} font-light`}>{collaborator.name}</p>
                    <p className={`text-xs ${themeClasses.textSecondary}`}>{collaborator.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {collaborator.isOwner && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Owner</span>
                  )}
                  <div className={`w-2 h-2 rounded-full ${collaborator.isOnline ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Open Editors */}
      <div className={`border-b ${themeClasses.border}`}>
        <div 
          className={`flex items-center justify-between p-3 ${themeClasses.surfaceHover} cursor-pointer transition-all duration-200`}
          onClick={() => setOpenEditorsExpanded(!openEditorsExpanded)}
        >
          <div className="flex items-center">
            {openEditorsExpanded ? (
              <ChevronDown className={`w-3 h-3 ${themeClasses.textSecondary} mr-1.5`} />
            ) : (
              <ChevronRight className={`w-3 h-3 ${themeClasses.textSecondary} mr-1.5`} />
            )}
            <span className={`text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>
              Open Editors
            </span>
          </div>
          <span className={`text-xs ${themeClasses.textSecondary} ${themeClasses.surface} px-1.5 py-0.5 rounded-full`}>
            {openEditors.length}
          </span>
        </div>
        {openEditorsExpanded && (
          <div className="pb-3">
            {openEditors.map((editor, index) => (
              <div key={index} className={`flex items-center justify-between px-4 py-1.5 ${themeClasses.surfaceHover} cursor-pointer group transition-all duration-200 rounded mx-1`}>
                <div className="flex items-center">
                  <span className="mr-2 text-xs">{editor.icon}</span>
                  <span className={`text-xs ${themeClasses.text} font-light`}>{editor.name}</span>
                </div>
                {editor.closable && (
                  <button className={`opacity-0 group-hover:opacity-100 p-0.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}>
                    <X className={`w-2.5 h-2.5 ${themeClasses.textSecondary}`} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* File Explorer */}
      <div className="flex-1 overflow-y-auto">
        <div className={`border-b ${themeClasses.border}`}>
          <div 
            className={`flex items-center justify-between p-3 ${themeClasses.surfaceHover} cursor-pointer transition-all duration-200`}
            onClick={() => setExplorerExpanded(!explorerExpanded)}
          >
            <div className="flex items-center">
              {explorerExpanded ? (
                <ChevronDown className={`w-3 h-3 ${themeClasses.textSecondary} mr-1.5`} />
              ) : (
                <ChevronRight className={`w-3 h-3 ${themeClasses.textSecondary} mr-1.5`} />
              )}
              <span className={`text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider`}>
                Files
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${themeClasses.textSecondary} ${themeClasses.surface} px-1.5 py-0.5 rounded-full`}>
                {fileStructure.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateNewFile();
                }}
                className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
                title="New File"
              >
                <Plus className={`w-3 h-3 ${themeClasses.textSecondary}`} />
              </button>
            </div>
          </div>
        </div>
        
        {explorerExpanded && (
          <div className="pb-4">
            {/* New File Input */}
            {showNewFileInput && (
              <div className="px-4 py-2">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={handleNewFileSubmit}
                  onBlur={handleNewFileBlur}
                  placeholder="Enter file name..."
                  className={`w-full px-2 py-1 text-xs rounded border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  autoFocus
                />
                <div className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                  Press Enter to create, Esc to cancel
                </div>
              </div>
            )}
            
            {/* File Tree */}
            {renderFileTree(fileStructure)}
          </div>
        )}
      </div>

      {/* Sidebar Actions */}
      <div className={`border-t p-3 space-y-1.5 ${themeClasses.border} flex-shrink-0`}>
        <button className={`flex items-center w-full px-3 py-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200 text-xs font-light`}>
          <Search className={`w-3 h-3 ${themeClasses.textSecondary} mr-2`} />
          <span className={themeClasses.text}>Search Files</span>
        </button>
        
        <button className={`flex items-center w-full px-3 py-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200 text-xs font-light`}>
          <GitBranch className={`w-3 h-3 ${themeClasses.textSecondary} mr-2`} />
          <span className={themeClasses.text}>Source Control</span>
        </button>
        
        <button className={`flex items-center w-full px-3 py-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200 text-xs font-light`}>
          <Users className={`w-3 h-3 ${themeClasses.textSecondary} mr-2`} />
          <span className={themeClasses.text}>Collaboration</span>
        </button>
        
        <button className={`flex items-center w-full px-3 py-1.5 ${themeClasses.surfaceHover} rounded transition-all duration-200 text-xs font-light`}>
          <Package className={`w-3 h-3 ${themeClasses.textSecondary} mr-2`} />
          <span className={themeClasses.text}>Extensions</span>
        </button>
      </div>

      {/* Bottom Actions */}
      <div className={`border-t p-3 ${themeClasses.border} flex-shrink-0`}>
        <button
          onClick={handleLogoClick}
          className={`flex items-center px-3 py-2 ${themeClasses.surfaceHover} rounded-full transition-all duration-200 text-xs font-light w-full`}
        >
          <Home className={`w-3 h-3 ${themeClasses.textSecondary} mr-2`} />
          <span className={themeClasses.text}>Back to Home</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;