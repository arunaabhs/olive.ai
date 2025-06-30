import React, { useState } from 'react';
import { Play, Square, RotateCcw, Share, X, Plus, MoreHorizontal, ArrowRight, Terminal, Zap, Code, FileText, Settings, Sun, Moon, ChevronDown, Sparkles, Users, Globe, Copy, Check, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
  const [linkCopied, setLinkCopied] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const { user } = useAuth();

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

  const handleShareProject = async () => {
    const shareUrl = `${window.location.origin}/project/${projectId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const handleInviteCollaborator = () => {
    const shareUrl = `${window.location.origin}/project/${projectId}`;
    const message = `Join my coding session on Olive! Click here to collaborate: ${shareUrl}`;
    
    // Try to open email client
    const emailSubject = encodeURIComponent('Join my Olive coding session');
    const emailBody = encodeURIComponent(message);
    window.open(`mailto:?subject=${emailSubject}&body=${emailBody}`);
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

  const onlineCollaborators = collaborators.filter(c => c.isOnline);

  return (
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
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>New Text File</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+N</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>New File...</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Alt+Windows+N</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>New Window</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+N</span>
                    </div>
                    <hr className={`my-2 ${themeClasses.border}`} />
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Open File...</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+O</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Open Folder...</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+K Ctrl+O</span>
                    </div>
                    <hr className={`my-2 ${themeClasses.border}`} />
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Save</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+S</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Save As...</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+S</span>
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
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Undo</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Z</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Redo</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Y</span>
                    </div>
                    <hr className={`my-2 ${themeClasses.border}`} />
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Cut</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+X</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Copy</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+C</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Paste</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+V</span>
                    </div>
                    <hr className={`my-2 ${themeClasses.border}`} />
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Find</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+F</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Replace</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+H</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Collaboration Menu */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('collaboration')}
                className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors flex items-center space-x-1`}
              >
                <span>Collaboration</span>
                <ChevronDown className="w-3 h-3" />
                {onlineCollaborators.length > 0 && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
              </button>
              {activeDropdown === 'collaboration' && (
                <div className={`absolute top-full left-0 mt-1 w-96 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50`}>
                  <div className="py-2">
                    {/* Room Information */}
                    <div className="px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-blue-500" />
                          <div>
                            <p className={`text-sm font-medium ${themeClasses.text}`}>Project Room</p>
                            <p className={`text-xs ${themeClasses.textSecondary}`}>ID: {projectId}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {connectionStatus === 'connected' ? (
                            <Wifi className="w-4 h-4 text-green-500" />
                          ) : (
                            <WifiOff className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-xs ${
                            connectionStatus === 'connected' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Quick Share */}
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={`${window.location.origin}/project/${projectId}`}
                          readOnly
                          className={`flex-1 text-xs px-2 py-1 border rounded ${themeClasses.surface} ${themeClasses.border}`}
                        />
                        <button
                          onClick={handleShareProject}
                          className="flex items-center space-x-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          {linkCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{linkCopied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Active Collaborators */}
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-xs font-medium ${themeClasses.text}`}>
                          Active Collaborators ({onlineCollaborators.length})
                        </p>
                        <button
                          onClick={handleInviteCollaborator}
                          className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700"
                        >
                          <UserPlus className="w-3 h-3" />
                          <span>Invite</span>
                        </button>
                      </div>
                      
                      {onlineCollaborators.length > 0 ? (
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {onlineCollaborators.map((collaborator, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                  style={{ backgroundColor: collaborator.color }}
                                >
                                  {collaborator.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className={`text-xs ${themeClasses.text} font-medium`}>{collaborator.name}</p>
                                  <p className={`text-xs ${themeClasses.textSecondary}`}>{collaborator.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                {collaborator.isOwner && (
                                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Owner</span>
                                )}
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className={`text-xs ${themeClasses.textSecondary} italic`}>
                          No other collaborators online. Share the link to invite others!
                        </p>
                      )}
                    </div>
                    
                    {/* Collaboration Actions */}
                    <div className="px-4 py-2">
                      <div 
                        className={`px-3 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3 rounded`}
                        onClick={handleShareProject}
                      >
                        <Share className="w-4 h-4 text-green-600" />
                        <span className={themeClasses.text}>Share Project Link</span>
                      </div>
                      <div 
                        className={`px-3 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3 rounded`}
                        onClick={handleInviteCollaborator}
                      >
                        <UserPlus className="w-4 h-4 text-blue-600" />
                        <span className={themeClasses.text}>Invite via Email</span>
                      </div>
                      <div className={`px-3 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center space-x-3 rounded`}>
                        <Settings className="w-4 h-4 text-gray-600" />
                        <span className={themeClasses.text}>Room Settings</span>
                      </div>
                    </div>
                    
                    {/* Current User Info */}
                    <div className="px-4 py-2 border-t border-gray-200">
                      <p className={`text-xs ${themeClasses.textSecondary} mb-2`}>Signed in as:</p>
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {user?.email?.charAt(0).toUpperCase() || 'G'}
                        </div>
                        <span className={`text-sm ${themeClasses.text}`}>
                          {user?.email?.split('@')[0] || 'Guest'}
                        </span>
                      </div>
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
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Command Palette...</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+P</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer`}>
                      <span className={themeClasses.text}>Open View...</span>
                    </div>
                    <hr className={`my-2 ${themeClasses.border}`} />
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Explorer</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+E</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Search</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+F</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Source Control</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+G</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Extensions</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+X</span>
                    </div>
                    <hr className={`my-2 ${themeClasses.border}`} />
                    <div 
                      className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                      onClick={onToggleTerminal}
                    >
                      <span className={themeClasses.text}>Terminal</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+`</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Run Menu - Contains the execution controls */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('run')}
                className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors flex items-center space-x-1`}
              >
                <span>Run</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'run' && (
                <div className={`absolute top-full left-0 mt-1 w-64 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50`}>
                  <div className="py-2">
                    <div 
                      className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                      onClick={handleRunClick}
                    >
                      <div className="flex items-center space-x-3">
                        <Play className="w-4 h-4 text-green-600" />
                        <span className={themeClasses.text}>Start Debugging</span>
                      </div>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>F5</span>
                    </div>
                    <div 
                      className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}
                      onClick={handleRunClick}
                    >
                      <div className="flex items-center space-x-3">
                        <Play className="w-4 h-4 text-green-600" />
                        <span className={themeClasses.text}>Run Without Debugging</span>
                      </div>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+F5</span>
                    </div>
                    <hr className={`my-2 ${themeClasses.border}`} />
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <div className="flex items-center space-x-3">
                        <Square className="w-4 h-4 text-red-600" />
                        <span className={themeClasses.text}>Stop Debugging</span>
                      </div>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Shift+F5</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <div className="flex items-center space-x-3">
                        <RotateCcw className="w-4 h-4 text-blue-600" />
                        <span className={themeClasses.text}>Restart Debugging</span>
                      </div>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+Shift+F5</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <span className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors`}>Help</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Enhanced Project Info */}
          <div className={`px-3 py-1 ${themeClasses.surface} rounded-full text-xs ${themeClasses.textSecondary} flex items-center space-x-2`}>
            <Globe className="w-3 h-3" />
            <span>Project: {projectId.split('-')[0]}...</span>
            {onlineCollaborators.length > 0 && (
              <>
                <div className="w-px h-3 bg-gray-300"></div>
                <Users className="w-3 h-3" />
                <span>{onlineCollaborators.length} online</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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

          {/* Enhanced Share Button */}
          <button 
            onClick={handleShareProject}
            className={`flex items-center space-x-2 ${themeClasses.surface} ${themeClasses.surfaceHover} ${themeClasses.textSecondary} border ${themeClasses.border} px-3 py-2 rounded-full transition-all duration-200 text-sm font-light`}
          >
            {linkCopied ? <Check className="w-3 h-3 text-green-600" /> : <Share className="w-3 h-3" />}
            <span>{linkCopied ? 'Copied!' : 'Share'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Settings */}
          <button className={`p-2 ${themeClasses.textSecondary} ${themeClasses.surfaceHover} rounded-full transition-all duration-200`} title="Settings">
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
  );
};

export default ProjectHeader;