import { useState, useCallback } from 'react';

export interface FileItem {
  id: string;
  name: string;
  content: string;
  language: string;
  isModified: boolean;
  lastModified: Date;
}

export const useFileOperations = () => {
  const [files, setFiles] = useState<FileItem[]>([
    {
      id: '1',
      name: 'hello.js',
      content: `// Welcome to Olive Code Editor!
console.log("Hello, World!");`,
      language: 'javascript',
      isModified: false,
      lastModified: new Date()
    }
  ]);
  
  const [activeFileId, setActiveFileId] = useState<string>('1');

  const createNewFile = useCallback((name?: string, content?: string) => {
    const timestamp = Date.now();
    const fileName = name || `untitled-${timestamp}.js`;
    const newFile: FileItem = {
      id: timestamp.toString(),
      name: fileName,
      content: content || `// New file: ${fileName}\n`,
      language: getLanguageFromFileName(fileName),
      isModified: false,
      lastModified: new Date()
    };
    
    setFiles(prev => [...prev, newFile]);
    setActiveFileId(newFile.id);
    return newFile;
  }, []);

  const openFile = useCallback((file: File) => {
    return new Promise<FileItem>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newFile = createNewFile(file.name, content);
        resolve(newFile);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, [createNewFile]);

  const saveFile = useCallback((fileId: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, content, isModified: false, lastModified: new Date() }
        : file
    ));
  }, []);

  const saveFileAs = useCallback((fileId: string, newName: string, content: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { 
            ...file, 
            name: newName, 
            content, 
            language: getLanguageFromFileName(newName),
            isModified: false, 
            lastModified: new Date() 
          }
        : file
    ));
  }, []);

  const closeFile = useCallback((fileId: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(file => file.id !== fileId);
      if (activeFileId === fileId && newFiles.length > 0) {
        setActiveFileId(newFiles[0].id);
      }
      return newFiles;
    });
  }, [activeFileId]);

  const markFileAsModified = useCallback((fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, isModified: true } : file
    ));
  }, []);

  const getActiveFile = useCallback(() => {
    return files.find(file => file.id === activeFileId);
  }, [files, activeFileId]);

  return {
    files,
    activeFileId,
    setActiveFileId,
    createNewFile,
    openFile,
    saveFile,
    saveFileAs,
    closeFile,
    markFileAsModified,
    getActiveFile
  };
};

const getLanguageFromFileName = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'py':
      return 'python';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return 'javascript';
  }
};