import React, { useState, useEffect } from 'react';
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

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId?: string;
  icon?: string;
  expanded?: boolean;
  children?: FileItem[];
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNewFile: () => void;
  isDarkMode?: boolean;
  projectId?: string;
  collaborators?: any[];
  openTabs?: string[];
  onFileSelect?: (fileName: string) => void;
  showNewFileInput?: boolean;
  onNewFileInputChange?: (show: boolean) => void;
  currentFolder?: string;
  onFolderChange?: (folderName: string) => void;
  onFileCreated?: (fileName: string, template?: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  collapsed, 
  onToggle, 
  onNewFile, 
  isDarkMode = false, 
  projectId = 'default-project',
  collaborators = [],
  openTabs = [],
  onFileSelect,
  showNewFileInput: externalShowNewFileInput = false,
  onNewFileInputChange,
  currentFolder = 'My Project',
  onFolderChange,
  onFileCreated
}) => {
  const [explorerExpanded, setExplorerExpanded] = useState(true);
  const [openEditorsExpanded, setOpenEditorsExpanded] = useState(true);
  const [internalShowNewFileInput, setInternalShowNewFileInput] = useState(false);
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [isEditingProjectName, setIsEditingProjectName] = useState(false);
  const [editingProjectName, setEditingProjectName] = useState('');
  const [userFiles, setUserFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'sample.txt',
      type: 'file',
      icon: '📝'
    }
  ]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [activeFileInFolder, setActiveFileInFolder] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { user } = useAuth();

  // Use external state if provided, otherwise use internal state
  const showNewFileInput = externalShowNewFileInput || internalShowNewFileInput;
  const setShowNewFileInput = onNewFileInputChange || setInternalShowNewFileInput;

  // Auto-expand explorer when new file input is shown
  useEffect(() => {
    if (showNewFileInput || showNewFolderInput) {
      setExplorerExpanded(true);
    }
  }, [showNewFileInput, showNewFolderInput]);

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
    accent: 'text-blue-400',
    input: 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
  } : {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    surface: 'bg-gray-50',
    surfaceHover: 'hover:bg-white/40',
    accent: 'text-green-600',
    input: 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
  };

  const getFileIcon = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return '📄';
      case 'ts':
      case 'tsx':
        return '⚛️';
      case 'py':
        return '🐍';
      case 'html':
        return '🌐';
      case 'css':
        return '🎨';
      case 'json':
        return '📦';
      case 'md':
        return '📖';
      case 'txt':
        return '📝';
      case 'java':
        return '☕';
      case 'cpp':
      case 'c':
        return '⚙️';
      case 'php':
        return '🐘';
      case 'rb':
        return '💎';
      case 'go':
        return '🐹';
      case 'rs':
        return '🦀';
      case 'sql':
        return '🗃️';
      default:
        return '📄';
    }
  };

  const handleCreateNewFile = (parentId?: string) => {
    setShowNewFileInput(true);
    setNewFileName('');
    setActiveFileInFolder(parentId || null);
    setExplorerExpanded(true);
  };

  const handleCreateNewFolder = () => {
    setShowNewFolderInput(true);
    setNewFolderName('');
    setExplorerExpanded(true);
  };

  const handleNewFileSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newFileName.trim()) {
        createNewFile(newFileName.trim(), activeFileInFolder);
        setShowNewFileInput(false);
        setNewFileName('');
        setActiveFileInFolder(null);
      }
    } else if (e.key === 'Escape') {
      setShowNewFileInput(false);
      setNewFileName('');
      setActiveFileInFolder(null);
    }
  };

  const handleNewFolderSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (newFolderName.trim()) {
        createNewFolder(newFolderName.trim());
        setShowNewFolderInput(false);
        setNewFolderName('');
      }
    } else if (e.key === 'Escape') {
      setShowNewFolderInput(false);
      setNewFolderName('');
    }
  };

  const handleProjectNameEdit = () => {
    setIsEditingProjectName(true);
    setEditingProjectName(currentFolder);
  };

  const handleProjectNameSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editingProjectName.trim()) {
        if (onFolderChange) {
          onFolderChange(editingProjectName.trim());
        }
      }
      setIsEditingProjectName(false);
      setEditingProjectName('');
    } else if (e.key === 'Escape') {
      setIsEditingProjectName(false);
      setEditingProjectName('');
    }
  };

  const createNewFile = (fileName: string, parentId?: string) => {
    // Get file extension to determine template
    const extension = fileName.split('.').pop()?.toLowerCase();
    let template = '';
    
    switch (extension) {
      case 'js':
        template = `// ${fileName}\nconsole.log('Hello from ${fileName}!');`;
        break;
      case 'ts':
        template = `// ${fileName}\ninterface Example {\n  message: string;\n}\n\nconst example: Example = {\n  message: 'Hello from ${fileName}!'\n};\n\nconsole.log(example.message);`;
        break;
      case 'tsx':
        template = `import React from 'react';\n\ninterface Props {\n  // Define your props here\n}\n\nconst ${fileName.replace('.tsx', '')}: React.FC<Props> = () => {\n  return (\n    <div>\n      <h1>${fileName}</h1>\n    </div>\n  );\n};\n\nexport default ${fileName.replace('.tsx', '')};`;
        break;
      case 'py':
        template = `# ${fileName}\nprint("Hello from ${fileName}!")`;
        break;
      case 'html':
        template = `<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>${fileName}</title>\n</head>\n<body>\n    <h1>Hello from ${fileName}!</h1>\n</body>\n</html>`;
        break;
      case 'css':
        template = `/* ${fileName} */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}`;
        break;
      case 'json':
        template = `{\n  "name": "${fileName.replace('.json', '')}",\n  "version": "1.0.0"\n}`;
        break;
      default:
        template = `// ${fileName}\n// Your code here...`;
    }
    
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: fileName,
      type: 'file',
      icon: getFileIcon(fileName),
      parentId: parentId
    };
    
    if (parentId) {
      // Add file to specific folder
      setUserFiles(prev => prev.map(item => {
        if (item.id === parentId && item.type === 'folder') {
          return {
            ...item,
            children: [...(item.children || []), newFile]
          };
        }
        return item;
      }));
      // Expand the parent folder
      setExpandedFolders(prev => new Set([...prev, parentId]));
    } else {
      // Add file to root
      setUserFiles(prev => [...prev, newFile]);
    }
    
    // Select the new file if callback is provided
    if (onFileSelect) {
      onFileSelect(fileName);
    }
    
    if (onFileCreated) {
      onFileCreated(fileName, template);
    }
  };

  const createNewFolder = (folderName: string) => {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: folderName,
      type: 'folder',
      expanded: false,
      children: []
    };
    
    setUserFiles(prev => [...prev, newFolder]);
    
    // Create a default file in the new folder
    const defaultFileName = 'index.js';
    const defaultFile: FileItem = {
      id: (Date.now() + 1).toString(),
      name: defaultFileName,
      type: 'file',
      icon: getFileIcon(defaultFileName),
      parentId: newFolder.id
    };
    
    // Add the default file to the folder
    setUserFiles(prev => prev.map(item => 
      item.id === newFolder.id 
        ? { ...item, children: [defaultFile] }
        : item
    ));
    
    // Auto-expand the new folder
    setExpandedFolders(prev => new Set([...prev, newFolder.id]));
    
    // Select the default file and notify parent
    if (onFileSelect) {
      onFileSelect(defaultFileName);
    }
    
    if (onFileCreated) {
      onFileCreated(defaultFileName, `// ${defaultFileName}\nconsole.log('Hello from ${defaultFileName}!');`);
    }
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      toggleFolder(file.id);
    } else {
      if (onFileSelect) {
        onFileSelect(file.name);
      }
    }
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map((item) => (
      <div key={item.id}>
        <div 
          className={`flex items-center py-1.5 px-2 ${themeClasses.surfaceHover} cursor-pointer text-xs transition-all duration-200 rounded mx-1 group ${
            openTabs.includes(item.name) ? 'bg-blue-100 dark:bg-blue-900/30' : ''
          }`}
          style={{ paddingLeft: `${8 + level * 12}px` }}
          onClick={() => handleFileClick(item)}
        >
          {item.type === 'folder' ? (
            <>
              <button 
                className={`mr-1.5 p-0.5 ${themeClasses.surfaceHover} rounded transition-colors`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(item.id);
                }}
              >
                {expandedFolders.has(item.id) ? (
                  <ChevronDown className={`w-2.5 h-2.5 ${themeClasses.textSecondary}`} />
                ) : (
                  <ChevronRight className={`w-2.5 h-2.5 ${themeClasses.textSecondary}`} />
                )}
              </button>
              {expandedFolders.has(item.id) ? (
                <FolderOpen className={`w-3 h-3 ${themeClasses.accent} mr-2`} />
              ) : (
                <Folder className={`w-3 h-3 ${themeClasses.accent} mr-2`} />
              )}
              <span className={`${themeClasses.text} font-light flex-1`}>{item.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateNewFile(item.id);
                }}
                className={`opacity-0 group-hover:opacity-100 p-0.5 ${themeClasses.surfaceHover} rounded transition-all duration-200 ml-1`}
                title="Add file to folder"
              >
                <Plus className={`w-2.5 h-2.5 ${themeClasses.textSecondary}`} />
              </button>
            </>
          ) : (
            <>
              <div className="w-3 mr-1.5"></div>
              <span className="mr-2 text-xs">{item.icon}</span>
              <span className={`${themeClasses.textSecondary} font-light flex-1`}>{item.name}</span>
              {openTabs.includes(item.name) && (
                <div className="w-2 h-2 bg-blue-500 rounded-full ml-1"></div>
              )}
            </>
          )}
        </div>
        {item.type === 'folder' && expandedFolders.has(item.id) && item.children && (
          <div>
            {/* Show new file input inside folder if active */}
            {showNewFileInput && activeFileInFolder === item.id && (
              <div style={{ paddingLeft: `${20 + level * 12}px` }} className="px-2 py-1">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={handleNewFileSubmit}
                  placeholder="Enter file name..."
                  className={`w-full px-2 py-1 text-xs rounded border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  autoFocus
                />
              </div>
            )}
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
      <div className={`p-3 border-b flex items-center justify-between ${themeClasses.border} flex-shrink-0`}>
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
      <div className={`px-3 py-2 border-b ${themeClasses.border} ${themeClasses.surface} flex-shrink-0`}>
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
        <div className={`border-b ${themeClasses.border} flex-shrink-0`}>
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
      {openTabs.length > 0 && (
        <div className={`border-b ${themeClasses.border} flex-shrink-0`}>
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
              {openTabs.length}
            </span>
          </div>
          {openEditorsExpanded && (
            <div className="pb-3">
              {openTabs.map((tabName, index) => (
                <div key={index} className={`flex items-center justify-between px-4 py-1.5 ${themeClasses.surfaceHover} cursor-pointer group transition-all duration-200 rounded mx-1`}>
                  <div className="flex items-center">
                    <span className="mr-2 text-xs">{getFileIcon(tabName)}</span>
                    <span className={`text-xs ${themeClasses.text} font-light`}>{tabName}</span>
                  </div>
                  <button className={`opacity-0 group-hover:opacity-100 p-0.5 ${themeClasses.surfaceHover} rounded transition-all duration-200`}>
                    <X className={`w-2.5 h-2.5 ${themeClasses.textSecondary}`} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* File Explorer */}
      <div className="flex-1 overflow-y-auto">
        <div className={`border-b ${themeClasses.border}`}>
          <div 
            className={`flex items-center justify-between p-3 ${themeClasses.surfaceHover} cursor-pointer transition-all duration-200`}
          >
            <div className="flex items-center">
              <button
                onClick={() => setExplorerExpanded(!explorerExpanded)}
                className="flex items-center"
              >
                {explorerExpanded ? (
                  <ChevronDown className={`w-3 h-3 ${themeClasses.textSecondary} mr-1.5`} />
                ) : (
                  <ChevronRight className={`w-3 h-3 ${themeClasses.textSecondary} mr-1.5`} />
                )}
              </button>
              {isEditingProjectName ? (
                <input
                  type="text"
                  value={editingProjectName}
                  onChange={(e) => setEditingProjectName(e.target.value)}
                  onKeyDown={handleProjectNameSubmit}
                  onBlur={() => {
                    setIsEditingProjectName(false);
                    setEditingProjectName('');
                  }}
                  className={`text-xs font-medium uppercase tracking-wider bg-transparent border-none outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 ${themeClasses.text}`}
                  autoFocus
                />
              ) : (
                <button
                  onClick={handleProjectNameEdit}
                  className={`text-xs font-medium ${themeClasses.textSecondary} uppercase tracking-wider hover:${themeClasses.text} transition-colors`}
                  title="Click to rename project"
                >
                  {currentFolder}
                </button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${themeClasses.textSecondary} ${themeClasses.surface} px-1.5 py-0.5 rounded-full`}>
                {userFiles.length}
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
            {/* New File Input (root level) */}
            {showNewFileInput && !activeFileInFolder && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={handleNewFileSubmit}
                  placeholder="Enter file name..."
                  className={`w-full px-2 py-1 text-xs rounded border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  autoFocus
                />
                <div className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                  Press Enter to create, Esc to cancel
                </div>
              </div>
            )}

            {/* New Folder Input */}
            {showNewFolderInput && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={handleNewFolderSubmit}
                  placeholder="Enter folder name..."
                  className={`w-full px-2 py-1 text-xs rounded border ${themeClasses.input} ${themeClasses.border} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  autoFocus
                />
                <div className={`text-xs ${themeClasses.textSecondary} mt-1`}>
                  Press Enter to create folder, Esc to cancel
                </div>
              </div>
            )}
            
            {/* User Files */}
            {userFiles.length > 0 ? (
              renderFileTree(userFiles)
            ) : (
              <div className="px-4 py-8 text-center">
                <FileText className={`w-8 h-8 ${themeClasses.textSecondary} mx-auto mb-2 opacity-50`} />
                <p className={`text-xs ${themeClasses.textSecondary} mb-2`}>No files yet</p>
                <button
                  onClick={() => handleCreateNewFile()}
                  className={`text-xs ${themeClasses.accent} hover:underline`}
                >
                  Create your first file
                </button>
              </div>
            )}
          </div>
        )}
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