import { useState, useCallback } from 'react';

export interface ViewState {
  sidebarVisible: boolean;
  terminalVisible: boolean;
  copilotVisible: boolean;
  miniMapVisible: boolean;
  lineNumbersVisible: boolean;
  wordWrapEnabled: boolean;
  zenModeEnabled: boolean;
  fullScreenEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  tabSize: number;
}

export const useViewOperations = () => {
  const [viewState, setViewState] = useState<ViewState>({
    sidebarVisible: true,
    terminalVisible: false,
    copilotVisible: false,
    miniMapVisible: true,
    lineNumbersVisible: true,
    wordWrapEnabled: true,
    zenModeEnabled: false,
    fullScreenEnabled: false,
    theme: 'light',
    fontSize: 14,
    tabSize: 2
  });

  const toggleSidebar = useCallback(() => {
    setViewState(prev => ({ ...prev, sidebarVisible: !prev.sidebarVisible }));
  }, []);

  const toggleTerminal = useCallback(() => {
    setViewState(prev => ({ ...prev, terminalVisible: !prev.terminalVisible }));
  }, []);

  const toggleCopilot = useCallback(() => {
    setViewState(prev => ({ ...prev, copilotVisible: !prev.copilotVisible }));
  }, []);

  const toggleMiniMap = useCallback(() => {
    setViewState(prev => ({ ...prev, miniMapVisible: !prev.miniMapVisible }));
  }, []);

  const toggleLineNumbers = useCallback(() => {
    setViewState(prev => ({ ...prev, lineNumbersVisible: !prev.lineNumbersVisible }));
  }, []);

  const toggleWordWrap = useCallback(() => {
    setViewState(prev => ({ ...prev, wordWrapEnabled: !prev.wordWrapEnabled }));
  }, []);

  const toggleZenMode = useCallback(() => {
    setViewState(prev => ({ 
      ...prev, 
      zenModeEnabled: !prev.zenModeEnabled,
      sidebarVisible: prev.zenModeEnabled, // Show sidebar when exiting zen mode
      terminalVisible: false // Hide terminal in zen mode
    }));
  }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setViewState(prev => ({ ...prev, fullScreenEnabled: true }));
    } else {
      document.exitFullscreen();
      setViewState(prev => ({ ...prev, fullScreenEnabled: false }));
    }
  }, []);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'auto') => {
    setViewState(prev => ({ ...prev, theme }));
  }, []);

  const increaseFontSize = useCallback(() => {
    setViewState(prev => ({ ...prev, fontSize: Math.min(prev.fontSize + 1, 24) }));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setViewState(prev => ({ ...prev, fontSize: Math.max(prev.fontSize - 1, 8) }));
  }, []);

  const resetFontSize = useCallback(() => {
    setViewState(prev => ({ ...prev, fontSize: 14 }));
  }, []);

  const setTabSize = useCallback((size: number) => {
    setViewState(prev => ({ ...prev, tabSize: Math.max(1, Math.min(size, 8)) }));
  }, []);

  const openCommandPalette = useCallback(() => {
    // In a real implementation, this would open a command palette modal
    console.log('Opening command palette...');
  }, []);

  const openSettings = useCallback(() => {
    // In a real implementation, this would open settings modal
    console.log('Opening settings...');
  }, []);

  const resetLayout = useCallback(() => {
    setViewState(prev => ({
      ...prev,
      sidebarVisible: true,
      terminalVisible: false,
      copilotVisible: false,
      zenModeEnabled: false,
      fullScreenEnabled: false
    }));
  }, []);

  return {
    viewState,
    toggleSidebar,
    toggleTerminal,
    toggleCopilot,
    toggleMiniMap,
    toggleLineNumbers,
    toggleWordWrap,
    toggleZenMode,
    toggleFullScreen,
    setTheme,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    setTabSize,
    openCommandPalette,
    openSettings,
    resetLayout
  };
};