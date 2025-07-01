import React, { useState, useRef } from 'react';
import { Play, Square, RotateCcw, Share, X, Plus, MoreHorizontal, ArrowRight, Terminal, Zap, Code, FileText, Settings, Sun, Moon, ChevronDown, Sparkles, Users, Globe, File, FolderOpen, Save, Search, Copy, Paste, Scissors, RotateCw, Maximize, Minimize, Eye, EyeOff, Type, Palette, Keyboard, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFileOperations } from '../hooks/useFileOperations';
import { useEditorOperations } from '../hooks/useEditorOperations';
import { useCollaboration } from '../hooks/useCollaboration';
import { useViewOperations } from '../hooks/useViewOperations';
import NewFileModal from './modals/NewFileModal';
import SettingsModal from './modals/SettingsModal';

interface ProjectHeaderProps {
  onToggleCopilot: () => void;
  copilotOpen: boolean;
  onToggleTerminal: () => void;
  terminalOpen: boolean;
  activeTab: string;
  openTabs: string[];
  onTabChange: (tab: string) => void;
  onTabClose: (tab: string) => void;
  onRunCode?: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  projectId?: string;
  collaborators?: any[];
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ 
  onToggleCopilot, 
  copilotOpen, 
  onToggleTerminal, 
  terminalOpen,
  activeTab,
  openTabs,
  onTabChange,
  onTabClose,
  onRunCode,
  onToggleDarkMode,
  isDarkMode,
  projectId = 'default-project',
  collaborators = []
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Use our custom hooks
  const { createNewFile, openFile, saveFile, saveFileAs, getActiveFile } = useFileOperations();
  const { undo, redo, cut, copy, paste, selectAll, openSearch, openReplace, goToLine, formatDocument, toggleComment } = useEditorOperations();
  const { shareProject, inviteCollaborator, exportProject, startLiveShare, stopLiveShare } = useCollaboration(projectId);
  const { 
    viewState, 
    toggleSidebar, 
    toggleMiniMap, 
    toggleLineNumbers, 
    toggleWordWrap, 
    toggleZenMode, 
    toggleFullScreen,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    setTabSize,
    openCommandPalette,
    openSettings,
    resetLayout
  } = useViewOperations();

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) return '⚛️';
    if (fileName.endsWith('.ts') || fileName.endsWith('.js')) return '📄';
    if (fileName.endsWith('.css')) return '🎨';
    if (fileName.endsWith('.html')) return '🌐';
    if (fileName.endsWith('.json')) return '📦';
    if (fileName.endsWith('.md')) return '📖';
    if (fileName.endsWith('.py')) return '🐍';
    if (fileName.endsWith('.java')) return '☕';
    if (fileName.endsWith('.cpp') || fileName.endsWith('.c')) return '⚙️';
    if (fileName.endsWith('.php')) return '🐘';
    if (fileName.endsWith('.rb')) return '💎';
    if (fileName.endsWith('.go')) return '🐹';
    if (fileName.endsWith('.rs')) return '🦀';
    if (fileName.endsWith('.sql')) return '🗃️';
    if (fileName.endsWith('.txt')) return '📝';
    return '📄';
  };

  const handleRunClick = () => {
    if (!terminalOpen) {
      onToggleTerminal();
    }
    
    if (onRunCode) {
      onRunCode();
    }
    setActiveDropdown(null);
  };

  const handleDropdownClick = (menu: string) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const handleNewFile = () => {
    setShowNewFileModal(true);
    setActiveDropdown(null);
  };

  const handleOpenFile = () => {
    fileInputRef.current?.click();
    setActiveDropdown(null);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await openFile(file);
      } catch (error) {
        console.error('Failed to open file:', error);
      }
    }
  };

  const handleSave = () => {
    const activeFile = getActiveFile();
    if (activeFile) {
      // In a real implementation, get content from editor
      saveFile(activeFile.id, activeFile.content);
    }
    setActiveDropdown(null);
  };

  const handleSaveAs = () => {
    const activeFile = getActiveFile();
    if (activeFile) {
      const newName = prompt('Enter new file name:', activeFile.name);
      if (newName) {
        saveFileAs(activeFile.id, newName, activeFile.content);
      }
    }
    setActiveDropdown(null);
  };

  const handleInviteCollaborator = () => {
    const email = prompt('Enter collaborator email:');
    if (email) {
      inviteCollaborator(email);
    }
    setActiveDropdown(null);
  };

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-800',
    border: 'border-gray-600',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    surface: 'bg-gray-700',
    surfaceHover: 'hover:bg-gray-600',
    menuBg: 'bg-gray-750',
    tabActive: 'bg-gray-700 text-gray-100 border-t-blue-500',
    tabInactive: 'text-gray-400 hover:text-gray-200 hover:bg-gray-700',
    dropdown: 'bg-gray-800 border-gray-600'
  } : {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    surface: 'bg-gray-50',
    surfaceHover: 'hover:bg-gray-100',
    menuBg: 'bg-gray-50',
    tabActive: 'bg-white text-gray-800 border-t-green-600',
    tabInactive: 'text-gray-600 hover:text-gray-800 hover:bg-white/60',
    dropdown: 'bg-white border-gray-200'
  };

  return (
    <>
      <div className={`border-b flex flex-col ${themeClasses.bg} ${themeClasses.border} relative`}>
        {/* Menu Bar */}
        <div className={`px-6 py-3 flex items-center justify-between text-sm border-b ${themeClasses.menuBg} ${themeClasses.border}`}>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {/* File Menu */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownClick('file')}
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors flex items-center space-x-1`}
                >
                  <span>File</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {activeDropdown === 'file' && (
                  <div className={`absolute top-full left-0 mt-1 w-64 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50`}>
                    <div className="py-2">
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={handleNewFile}
                      >
                        <div className="flex items-center space-x-3">
                          <File className="w-4 h-4" />
                          <span className={themeClasses.text}>New File</span>
                        </div>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+N</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={handleOpenFile}
                      >
                        <div className="flex items-center space-x-3">
                          <FolderOpen className="w-4 h-4" />
                          <span className={themeClasses.text}>Open File...</span>
                        </div>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+O</span>
                      </div>
                      <hr className={`my-2 ${themeClasses.border}`} />
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={handleSave}
                      >
                        <div className="flex items-center space-x-3">
                          <Save className="w-4 h-4" />
                          <span className={themeClasses.text}>Save</span>
                        </div>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+S</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={handleSaveAs}
                      >
                        <div className="flex items-center space-x-3">
                          <Save className="w-4 h-4" />
                          <span className={themeClasses.text}>Save As...</span>
                        </div>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+S</span>
                      </div>
                      <hr className={`my-2 ${themeClasses.border}`} />
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={exportProject}
                      >
                        <Share className="w-4 h-4" />
                        <span className={themeClasses.text}>Export Project</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Menu */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownClick('edit')}
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors flex items-center space-x-1`}
                >
                  <span>Edit</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {activeDropdown === 'edit' && (
                  <div className={`absolute top-full left-0 mt-1 w-64 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50`}>
                    <div className="py-2">
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={undo}
                      >
                        <div className="flex items-center space-x-3">
                          <RotateCcw className="w-4 h-4" />
                          <span className={themeClasses.text}>Undo</span>
                        </div>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Z</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={redo}
                      >
                        <div className="flex items-center space-x-3">
                          <RotateCw className="w-4 h-4" />
                          <span className={themeClasses.text}>Redo</span>
                        </div>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Y</span>
                      </div>
                      <hr className={`my-2 ${themeClasses.border}`} />
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={cut}
                      >
                        <div className="flex items-center space-x-3">
                          <Scissors className="w-4 h-4" />
                          <span className={themeClasses.text}>Cut</span>
                        </div>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+X</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={copy}
                      >
                        <div className="flex items-center space-x-3">
                          <Copy className="w-4 h-4" />
                          <span className={themeClasses.text}>Copy</span>
                        </div>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+C</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={paste}
                      >
                        <div className="flex items-center space-x-3">
                          <Paste className="w-4 h-4" />
                          <span className={themeClasses.text}>Paste</span>
                        </div>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+V</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={selectAll}
                      >
                        <span className={themeClasses.text}>Select All</span>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+A</span>
                      </div>
                      <hr className={`my-2 ${themeClasses.border}`} />
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={openSearch}
                      >
                        <div className="flex items-center space-x-3">
                          <Search className="w-4 h-4" />
                          <span className={themeClasses.text}>Find</span>
                        </div>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+F</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={openReplace}
                      >
                        <span className={themeClasses.text}>Replace</span>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+H</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={goToLine}
                      >
                        <span className={themeClasses.text}>Go to Line</span>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+G</span>
                      </div>
                      <hr className={`my-2 ${themeClasses.border}`} />
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={formatDocument}
                      >
                        <Code className="w-4 h-4" />
                        <span className={themeClasses.text}>Format Document</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={toggleComment}
                      >
                        <span className={themeClasses.text}>Toggle Comment</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Collaboration Menu */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownClick('collaboration')}
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors flex items-center space-x-1`}
                >
                  <span>Collaboration</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {activeDropdown === 'collaboration' && (
                  <div className={`absolute top-full left-0 mt-1 w-80 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50`}>
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className={`text-sm font-medium ${themeClasses.text}`}>Project Room</p>
                            <p className={`text-xs ${themeClasses.textSecondary}`}>ID: {projectId}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Active Collaborators */}
                      {collaborators.length > 0 && (
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className={`text-xs font-medium ${themeClasses.text} mb-2`}>Active Collaborators ({collaborators.filter(c => c.isOnline).length})</p>
                          <div className="space-y-1">
                            {collaborators.filter(c => c.isOnline).map((collaborator, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div 
                                  className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                  style={{ backgroundColor: collaborator.color }}
                                >
                                  {collaborator.name.charAt(0).toUpperCase()}
                                </div>
                                <span className={`text-xs ${themeClasses.text}`}>{collaborator.name}</span>
                                {collaborator.isOwner && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded">Owner</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={shareProject}
                      >
                        <Share className="w-4 h-4 text-green-600" />
                        <span className={themeClasses.text}>Share Project Link</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={handleInviteCollaborator}
                      >
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className={themeClasses.text}>Invite Collaborator</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={startLiveShare}
                      >
                        <Zap className="w-4 h-4 text-yellow-600" />
                        <span className={themeClasses.text}>Start Live Share</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={exportProject}
                      >
                        <Settings className="w-4 h-4 text-gray-600" />
                        <span className={themeClasses.text}>Export Project</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* View Menu */}
              <div className="relative">
                <button
                  onClick={() => handleDropdownClick('view')}
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors flex items-center space-x-1`}
                >
                  <span>View</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {activeDropdown === 'view' && (
                  <div className={`absolute top-full left-0 mt-1 w-64 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50`}>
                    <div className="py-2">
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={openCommandPalette}
                      >
                        <span className={themeClasses.text}>Command Palette...</span>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+P</span>
                      </div>
                      <hr className={`my-2 ${themeClasses.border}`} />
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={toggleSidebar}
                      >
                        <span className={themeClasses.text}>Toggle Sidebar</span>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+B</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={onToggleTerminal}
                      >
                        <span className={themeClasses.text}>Toggle Terminal</span>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+`</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={onToggleCopilot}
                      >
                        <span className={themeClasses.text}>Toggle Copilot</span>
                        <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+A</span>
                      </div>
                      <hr className={`my-2 ${themeClasses.border}`} />
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                        onClick={toggleMiniMap}
                      >
                        <div className="flex items-center space-x-3">
                          {viewState.miniMapVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          <span className={themeClasses.text}>Minimap</span>
                        </div>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={toggleLineNumbers}
                      >
                        {viewState.lineNumbersVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        <span className={themeClasses.text}>Line Numbers</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={toggleWordWrap}
                      >
                        <span className={themeClasses.text}>Word Wrap</span>
                      </div>
                      <hr className={`my-2 ${themeClasses.border}`} />
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={toggleZenMode}
                      >
                        <Minimize className="w-4 h-4" />
                        <span className={themeClasses.text}>Zen Mode</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={toggleFullScreen}
                      >
                        <Maximize className="w-4 h-4" />
                        <span className={themeClasses.text}>Full Screen</span>
                      </div>
                      <hr className={`my-2 ${themeClasses.border}`} />
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={increaseFontSize}
                      >
                        <Type className="w-4 h-4" />
                        <span className={themeClasses.text}>Zoom In</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={decreaseFontSize}
                      >
                        <Type className="w-4 h-4" />
                        <span className={themeClasses.text}>Zoom Out</span>
                      </div>
                      <div 
                        className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}
                        onClick={resetFontSize}
                      >
                        <span className={themeClasses.text}>Reset Zoom</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => handleDropdownClick('help')}
                  className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors flex items-center space-x-1`}
                >
                  <span>Help</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {activeDropdown === 'help' && (
                  <div className={`absolute top-full left-0 mt-1 w-64 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50`}>
                    <div className="py-2">
                      <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}>
                        <HelpCircle className="w-4 h-4" />
                        <span className={themeClasses.text}>Documentation</span>
                      </div>
                      <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}>
                        <Keyboard className="w-4 h-4" />
                        <span className={themeClasses.text}>Keyboard Shortcuts</span>
                      </div>
                      <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3`}>
                        <span className={themeClasses.text}>About Olive</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Project Info */}
            <div className={`px-3 py-1 ${themeClasses.surface} rounded-full text-xs ${themeClasses.textSecondary} flex items-center space-x-2`}>
              <Globe className="w-3 h-3" />
              <span>Project: {projectId.split('-')[0]}...</span>
              {collaborators.length > 0 && (
                <>
                  <div className="w-px h-3 bg-gray-300"></div>
                  <Users className="w-3 h-3" />
                  <span>{collaborators.filter(c => c.isOnline).length} online</span>
                </>
              )}
            </div>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className={`p-2 rounded-full transition-all duration-200 ${
                isDarkMode 
                  ? 'bg-yellow-500 text-yellow-900 shadow-lg' 
                  : 'bg-gray-800 text-yellow-400 shadow-lg'
              }`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Terminal Toggle */}
            <button
              onClick={onToggleTerminal}
              className={`p-2 rounded-full transition-all duration-200 ${
                terminalOpen 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : `${themeClasses.textSecondary} ${themeClasses.surfaceHover}`
              }`}
              title="Toggle Terminal"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* Copilot Toggle */}
            <button
              onClick={onToggleCopilot}
              className={`p-2 rounded-full transition-all duration-200 ${
                copilotOpen 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/25' 
                  : `${themeClasses.textSecondary} ${themeClasses.surfaceHover}`
              }`}
              title="Toggle olive.ai Assistant"
            >
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Settings Button */}
            <button 
              onClick={() => setShowSettingsModal(true)}
              className={`p-2 ${themeClasses.textSecondary} ${themeClasses.surfaceHover} rounded-full transition-all duration-200`} 
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className={`flex items-center overflow-x-auto ${themeClasses.menuBg}`}>
          {openTabs.map((tab, index) => (
            <div
              key={index}
              className={`flex items-center px-6 py-3 border-r cursor-pointer group min-w-0 transition-all duration-200 ${
                activeTab === tab 
                  ? `${themeClasses.tabActive} border-t-2 shadow-sm` 
                  : themeClasses.tabInactive
              }`}
              style={{ borderColor: isDarkMode ? '#4b5563' : '#e5e7eb' }}
              onClick={() => onTabChange(tab)}
            >
              <span className="mr-3 text-sm">{getFileIcon(tab)}</span>
              <span className="text-sm font-light truncate">{tab}</span>
              {openTabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose(tab);
                  }}
                  className={`ml-3 opacity-0 group-hover:opacity-100 p-1 ${themeClasses.surfaceHover} rounded-full transition-all duration-200`}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
          
          {/* Add Tab Button */}
          <button 
            onClick={handleNewFile}
            className={`p-3 ${themeClasses.textSecondary} ${themeClasses.surfaceHover} transition-all duration-200`}
            title="New Tab"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Tab Actions */}
          <div className="ml-auto flex items-center space-x-2 px-4">
            <button className={`p-1.5 ${themeClasses.textSecondary} ${themeClasses.surfaceHover} rounded transition-all duration-200`} title="More Actions">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dropdown Overlay */}
        {activeDropdown && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        accept=".js,.ts,.jsx,.tsx,.html,.css,.json,.md,.py,.java,.cpp,.c,.php,.rb,.go,.rs,.sql,.txt"
      />

      {/* Modals */}
      <NewFileModal
        isOpen={showNewFileModal}
        onClose={() => setShowNewFileModal(false)}
        onCreateFile={(name, template) => createNewFile(name, template)}
        isDarkMode={isDarkMode}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={onToggleDarkMode}
        fontSize={viewState.fontSize}
        onFontSizeChange={increaseFontSize}
        tabSize={viewState.tabSize}
        onTabSizeChange={setTabSize}
      />
    </>
  );
};

export default ProjectHeader;