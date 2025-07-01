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
    setEditorState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        const content = prev.history[newIndex];
        if (editorRef.current) {
          editorRef.current.setValue(content);
        }
        return {
          ...prev,
          content,
          historyIndex: newIndex
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setEditorState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        const content = prev.history[newIndex];
        if (editorRef.current) {
          editorRef.current.setValue(content);
        }
        return {
          ...prev,
          content,
          historyIndex: newIndex
        };
      }
      return prev;
    });
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
      const selection = editorRef.current.getSelection();
      const selectedText = editorRef.current.getModel().getValueInRange(selection);
      navigator.clipboard.writeText(selectedText);
      editorRef.current.executeEdits('cut', [{
        range: selection,
        text: ''
      }]);
      addToHistory(editorRef.current.getValue());
    }
  }, [addToHistory]);

  const copy = useCallback(() => {
    if (editorRef.current) {
      const selection = editorRef.current.getSelection();
      const selectedText = editorRef.current.getModel().getValueInRange(selection);
      navigator.clipboard.writeText(selectedText);
    }
  }, []);

  const paste = useCallback(async () => {
    if (editorRef.current) {
      try {
        const text = await navigator.clipboard.readText();
        const selection = editorRef.current.getSelection();
        editorRef.current.executeEdits('paste', [{
          range: selection,
          text: text
        }]);
        addToHistory(editorRef.current.getValue());
      } catch (err) {
        console.error('Failed to paste:', err);
      }
    }
  }, [addToHistory]);

  const selectAll = useCallback(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      const fullRange = model.getFullModelRange();
      editorRef.current.setSelection(fullRange);
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