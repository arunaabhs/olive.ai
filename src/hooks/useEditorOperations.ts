import { useState, useCallback, useRef } from 'react';

export interface EditorState {
  content: string;
  selection: { start: number; end: number } | null;
  history: string[];
  historyIndex: number;
  searchTerm: string;
  replaceTerm: string;
  isSearchOpen: boolean;
  isReplaceOpen: boolean;
}

export const useEditorOperations = () => {
  const [editorState, setEditorState] = useState<EditorState>({
    content: '',
    selection: null,
    history: [''],
    historyIndex: 0,
    searchTerm: '',
    replaceTerm: '',
    isSearchOpen: false,
    isReplaceOpen: false
  });

  const editorRef = useRef<any>(null);

  const setEditorRef = useCallback((ref: any) => {
    editorRef.current = ref;
  }, []);

  const undo = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'undo');
    }
  }, []);

  const redo = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'redo');
    }
  }, []);

  const addToHistory = useCallback((content: string) => {
    setEditorState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(content);
      return {
        ...prev,
        content,
        history: newHistory,
        historyIndex: newHistory.length - 1
      };
    });
  }, []);

  const cut = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('cut');
    }
  }, [addToHistory]);

  const copy = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand('copy');
    }
  }, []);

  const paste = useCallback(async () => {
    if (editorRef.current) {
      editorRef.current.focus();
      editorRef.current.trigger('keyboard', 'editor.action.clipboardPasteAction');
    }
  }, [addToHistory]);

  const selectAll = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.selectAll');
    }
  }, []);

  const openSearch = useCallback(() => {
    setEditorState(prev => ({ ...prev, isSearchOpen: true }));
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'actions.find');
    }
  }, []);

  const openReplace = useCallback(() => {
    setEditorState(prev => ({ ...prev, isReplaceOpen: true }));
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.startFindReplaceAction');
    }
  }, []);

  const goToLine = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.gotoLine');
    }
  }, []);

  const formatDocument = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.formatDocument');
    }
  }, []);

  const toggleComment = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.trigger('keyboard', 'editor.action.commentLine');
    }
  }, []);

  return {
    editorState,
    setEditorRef,
    undo,
    redo,
    addToHistory,
    cut,
    copy,
    paste,
    selectAll,
    openSearch,
    openReplace,
    goToLine,
    formatDocument,
    toggleComment
  };
};