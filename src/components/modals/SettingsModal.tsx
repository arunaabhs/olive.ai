import React, { useState } from 'react';
import { X, Monitor, Sun, Moon, Type, Code, Palette, Keyboard, Save } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  tabSize: number;
  onTabSizeChange: (size: number) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode,
  fontSize,
  onFontSizeChange,
  tabSize,
  onTabSizeChange
}) => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [settings, setSettings] = useState({
    autoSave: true,
    wordWrap: true,
    miniMap: true,
    lineNumbers: true,
    bracketMatching: true,
    autoComplete: true,
    formatOnSave: true,
    formatOnPaste: true
  });

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-900',
    surface: 'bg-gray-800',
    border: 'border-gray-700',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    input: 'bg-gray-700 border-gray-600 text-gray-100'
  } : {
    bg: 'bg-white',
    surface: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    input: 'bg-white border-gray-300 text-gray-900'
  };

  const tabs = [
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'editor', name: 'Editor', icon: Code },
    { id: 'keyboard', name: 'Keyboard', icon: Keyboard }
  ];

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${themeClasses.bg} rounded-xl shadow-2xl w-full max-w-4xl h-[600px] border ${themeClasses.border} flex`}>
        {/* Sidebar */}
        <div className={`w-64 ${themeClasses.surface} rounded-l-xl border-r ${themeClasses.border} p-4`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${themeClasses.text}`}>Settings</h2>
            <button
              onClick={onClose}
              className={`p-2 hover:bg-gray-600/20 rounded-lg transition-colors ${themeClasses.textSecondary}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : `${themeClasses.textSecondary} hover:bg-gray-600/10`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Appearance</h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-3`}>
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => {/* Set light theme */}}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        !isDarkMode ? 'border-blue-500 bg-blue-50' : `${themeClasses.border} ${themeClasses.surface}`
                      }`}
                    >
                      <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                      <div className={`text-sm font-medium ${themeClasses.text}`}>Light</div>
                    </button>
                    <button
                      onClick={onToggleDarkMode}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isDarkMode ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : `${themeClasses.border} ${themeClasses.surface}`
                      }`}
                    >
                      <Moon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                      <div className={`text-sm font-medium ${themeClasses.text}`}>Dark</div>
                    </button>
                    <button
                      className={`p-4 rounded-lg border-2 transition-all ${themeClasses.border} ${themeClasses.surface}`}
                    >
                      <Monitor className="w-6 h-6 mx-auto mb-2 text-gray-500" />
                      <div className={`text-sm font-medium ${themeClasses.text}`}>Auto</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="24"
                    value={fontSize}
                    onChange={(e) => onFontSizeChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10px</span>
                    <span>24px</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'editor' && (
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Editor</h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Tab Size: {tabSize} spaces
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={tabSize}
                    onChange={(e) => onTabSizeChange(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1</span>
                    <span>8</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {Object.entries(settings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className={`text-sm ${themeClasses.text} capitalize`}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <button
                        onClick={() => handleSettingChange(key, !value)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keyboard' && (
            <div className="space-y-6">
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>Keyboard Shortcuts</h3>
              
              <div className="space-y-3">
                {[
                  { action: 'New File', shortcut: 'Ctrl+N' },
                  { action: 'Open File', shortcut: 'Ctrl+O' },
                  { action: 'Save', shortcut: 'Ctrl+S' },
                  { action: 'Save As', shortcut: 'Ctrl+Shift+S' },
                  { action: 'Find', shortcut: 'Ctrl+F' },
                  { action: 'Replace', shortcut: 'Ctrl+H' },
                  { action: 'Go to Line', shortcut: 'Ctrl+G' },
                  { action: 'Command Palette', shortcut: 'Ctrl+Shift+P' },
                  { action: 'Toggle Terminal', shortcut: 'Ctrl+`' },
                  { action: 'Toggle Sidebar', shortcut: 'Ctrl+B' },
                  { action: 'Format Document', shortcut: 'Shift+Alt+F' },
                  { action: 'Comment Line', shortcut: 'Ctrl+/' }
                ].map((item, index) => (
                  <div key={index} className={`flex items-center justify-between py-2 px-3 rounded-lg ${themeClasses.surface}`}>
                    <span className={`text-sm ${themeClasses.text}`}>{item.action}</span>
                    <kbd className={`px-2 py-1 text-xs font-mono ${themeClasses.surface} border ${themeClasses.border} rounded`}>
                      {item.shortcut}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg border ${themeClasses.border} ${themeClasses.textSecondary} hover:bg-gray-600/10 transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;