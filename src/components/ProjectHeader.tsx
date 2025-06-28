import React, { useState } from 'react';
import { Play, Square, RotateCcw, Share, X, Plus, MoreHorizontal, ArrowRight, Terminal, Zap, Code, FileText, Settings, Sun, Moon, ChevronDown, Sparkles } from 'lucide-react';

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
  isDarkMode
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

            {/* Selection Menu */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('selection')}
                className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors flex items-center space-x-1`}
              >
                <span>Selection</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'selection' && (
                <div className={`absolute top-full left-0 mt-1 w-80 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50`}>
                  <div className="py-2">
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Select All</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+A</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Expand Selection</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Shift+Alt+RightArrow</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Shrink Selection</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Shift+Alt+LeftArrow</span>
                    </div>
                    <hr className={`my-2 ${themeClasses.border}`} />
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Copy Line Up</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Shift+Alt+UpArrow</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Copy Line Down</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Shift+Alt+DownArrow</span>
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

            {/* Go Menu */}
            <div className="relative">
              <button
                onClick={() => handleDropdownClick('go')}
                className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors flex items-center space-x-1`}
              >
                <span>Go</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {activeDropdown === 'go' && (
                <div className={`absolute top-full left-0 mt-1 w-80 ${themeClasses.dropdown} border rounded-lg shadow-lg z-50`}>
                  <div className="py-2">
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Back</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Alt+LeftArrow</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Forward</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Alt+RightArrow</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Last Edit Location</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+K Ctrl+Q</span>
                    </div>
                    <hr className={`my-2 ${themeClasses.border}`} />
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Go to File...</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+P</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Go to Symbol in Workspace...</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+T</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer flex items-center justify-between`}>
                      <span className={themeClasses.text}>Go to Line/Column...</span>
                      <span className={`text-xs ${themeClasses.textSecondary}`}>Ctrl+G</span>
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
                    <hr className={`my-2 ${themeClasses.border}`} />
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer`}>
                      <span className={themeClasses.text}>Open Configurations</span>
                    </div>
                    <div className={`px-4 py-2 ${themeClasses.surfaceHover} cursor-pointer`}>
                      <span className={themeClasses.text}>Add Configuration...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <span className={`${themeClasses.textSecondary} hover:${themeClasses.text} cursor-pointer font-light transition-colors`}>Help</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
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

          {/* Copilot Toggle - Changed to Sparkles icon for elegance */}
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

          {/* Share Button */}
          <button className={`flex items-center space-x-2 ${themeClasses.surface} ${themeClasses.surfaceHover} ${themeClasses.textSecondary} border ${themeClasses.border} px-3 py-2 rounded-full transition-all duration-200 text-sm font-light`}>
            <Share className="w-3 h-3" />
            <span>Share</span>
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