import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, X, Brain, Copy, Check, ChevronDown, Paperclip, Mic } from 'lucide-react';
import { geminiAPI } from '../lib/gemini';

interface CopilotSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentCode: string;
  isDarkMode?: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  model?: string;
}

interface AIModel {
  id: string;
  name: string;
  provider: string;
  speed: string;
  description: string;
}

const CopilotSidebar: React.FC<CopilotSidebarProps> = ({ isOpen, onClose, currentCode, isDarkMode = false }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const aiModels: AIModel[] = [
    {
      id: 'gemini-2.0-flash',
      name: 'Gemini 2.0 Flash',
      provider: 'Google',
      speed: '3x',
      description: 'Fast and efficient for general tasks'
    },
    {
      id: 'deepseek-l1',
      name: 'DeepSeek L1',
      provider: 'DeepSeek',
      speed: '2x',
      description: 'Advanced reasoning and code generation'
    },
    {
      id: 'llama-3.3',
      name: 'Llama 3.3',
      provider: 'Meta',
      speed: '1x',
      description: 'Large language model for complex tasks'
    }
  ];

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-900',
    border: 'border-gray-700',
    text: 'text-gray-100',
    textSecondary: 'text-gray-400',
    surface: 'bg-gray-800',
    surfaceHover: 'hover:bg-gray-700',
    input: 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500',
    userMessage: 'bg-blue-600 text-white',
    assistantMessage: 'bg-gray-800 text-gray-100 border-gray-700',
    scrollbar: 'scrollbar-thumb-gray-600 scrollbar-track-gray-800',
    dropdown: 'bg-gray-800 border-gray-600'
  } : {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    surface: 'bg-gray-50',
    surfaceHover: 'hover:bg-gray-100',
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    userMessage: 'bg-blue-600 text-white',
    assistantMessage: 'bg-white text-gray-900 border-gray-200',
    scrollbar: 'scrollbar-thumb-gray-300 scrollbar-track-gray-100',
    dropdown: 'bg-white border-gray-200'
  };

  // Don't render anything if not open
  if (!isOpen) {
    return null;
  }

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);
    setShowWelcome(false);
    setApiError(null);

    try {
      let responseContent = '';

      if (selectedModel === 'gemini-2.0-flash') {
        // Use real Gemini API
        try {
          if (currentCode && currentCode.trim()) {
            // If there's code context, use it
            responseContent = await geminiAPI.generateCodeSuggestions(
              currentCode,
              'javascript', // You might want to detect language from file extension
              userMessage.content
            );
          } else {
            // General query without code context
            responseContent = await geminiAPI.generateResponse(userMessage.content);
          }
        } catch (error) {
          console.error('Gemini API Error:', error);
          setApiError(error instanceof Error ? error.message : 'Failed to connect to Gemini API');
          responseContent = `❌ **Gemini API Error**: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\nPlease check your API key configuration or try again later.`;
        }
      } else {
        // Mock responses for other models (DeepSeek and Llama)
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        responseContent = generateMockResponse(userMessage.content, currentCode, selectedModel);
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        model: selectedModel
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI request failed:', err);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ **Error**: Failed to get response from ${selectedModel}. Please try again.`,
        timestamp: new Date(),
        model: selectedModel
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (userQuery: string, code: string, model: string): string => {
    const selectedModelInfo = aiModels.find(m => m.id === model);
    const modelName = selectedModelInfo?.name || 'AI Assistant';
    
    const query = userQuery.toLowerCase();
    
    if (query.includes('explain') || query.includes('what does')) {
      return `I'm **${modelName}**, and I can help explain this code. Based on the current context, I can see you're working with a React application. The code structure follows modern React patterns with TypeScript integration.\n\n*Note: This is a simulated response. Real ${modelName} integration coming soon!*\n\nWould you like me to explain any specific part in more detail?`;
    }
    
    if (query.includes('optimize') || query.includes('improve')) {
      return `As **${modelName}**, here are my optimization suggestions:\n\n**Performance**: Consider using React.memo() for components that don't need frequent re-renders\n\n**Code Structure**: Extract custom hooks for reusable logic\n\n**TypeScript**: Add more specific type definitions\n\n*Note: This is a simulated response. Real ${modelName} integration coming soon!*\n\nWould you like me to elaborate on any of these suggestions?`;
    }
    
    if (query.includes('bug') || query.includes('error') || query.includes('fix')) {
      return `I'm **${modelName}** and I can help debug this issue. Common problems I notice:\n\n• **State Management**: Ensure state updates are properly handled\n• **Dependencies**: Check if all dependencies are correctly listed\n• **Type Safety**: Verify TypeScript types match expected values\n\n*Note: This is a simulated response. Real ${modelName} integration coming soon!*\n\nCan you share the specific error message you're seeing?`;
    }
    
    return `Hello! I'm **${modelName}**. I understand you're asking about "${userQuery}". I'm here to help with:\n\n• **Code Explanation**: Breaking down complex logic\n• **Debugging**: Finding and fixing issues\n• **Optimization**: Improving performance and structure\n• **Best Practices**: Following modern development standards\n\n*Note: This is a simulated response. Real ${modelName} integration coming soon!*\n\nCould you provide more specific details about what you'd like assistance with?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.startsWith('```')) {
        return null;
      }
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.substring(2)}
          </li>
        );
      }
      if (line.startsWith('**') && line.includes('**:')) {
        const parts = line.split('**');
        return (
          <p key={index} className="font-semibold mb-2">
            <strong>{parts[1]}</strong>: {parts[2]}
          </p>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-semibold mb-2">
            {line.slice(2, -2)}
          </p>
        );
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return (
        <p key={index} className="mb-2">
          {line}
        </p>
      );
    });
  };

  const selectedModelInfo = aiModels.find(m => m.id === selectedModel);

  return (
    <div className={`h-full flex flex-col ${themeClasses.bg} ${themeClasses.border} border-l`}>
      {/* Header */}
      <div className={`px-3 py-2 border-b flex items-center justify-between ${themeClasses.border} flex-shrink-0`}>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <Brain className="w-3 h-3 text-white" />
            </div>
            <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse ${
              selectedModel === 'gemini-2.0-flash' && !apiError ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
          </div>
          <div>
            <h3 className={`font-semibold ${themeClasses.text} text-xs`}>Ask Copilot</h3>
            <p className={`text-xs ${themeClasses.textSecondary}`}>
              {selectedModel === 'gemini-2.0-flash' && !apiError ? 'AI-powered assistant' : 'Simulated responses'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
          title="Close Copilot"
        >
          <X className={`w-3 h-3 ${themeClasses.textSecondary}`} />
        </button>
      </div>

      {/* API Error Banner */}
      {apiError && (
        <div className="px-3 py-2 bg-red-50 border-b border-red-200">
          <p className="text-xs text-red-700">
            ⚠️ Gemini API Error: {apiError}
          </p>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Welcome Screen */}
        {showWelcome && messages.length === 0 && (
          <div className={`flex-1 flex flex-col items-center justify-center p-4 text-center ${themeClasses.bg}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-4">
              <Brain className="w-6 h-6 text-white" />
            </div>
            
            <h2 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>Ask Copilot</h2>
            
            <p className={`text-xs ${themeClasses.textSecondary} mb-4 leading-relaxed max-w-xs`}>
              {selectedModel === 'gemini-2.0-flash' 
                ? 'Powered by Google Gemini 2.0 Flash. Real AI responses enabled!'
                : 'Copilot is powered by AI, so mistakes are possible. Review output carefully before use.'
              }
            </p>
          </div>
        )}

        {/* Messages Container */}
        {!showWelcome && (
          <div className={`flex-1 overflow-y-auto px-3 py-3 space-y-3 ${themeClasses.scrollbar} scrollbar-thin`}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 ${
                    message.type === 'user'
                      ? themeClasses.userMessage
                      : `${themeClasses.assistantMessage} border`
                  } shadow-sm`}
                >
                  {message.type === 'assistant' && (
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${themeClasses.textSecondary}`}>
                          {selectedModelInfo?.name || 'AI Assistant'}
                        </span>
                        {message.model === 'gemini-2.0-flash' && !apiError && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                            Live
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className={`p-0.5 ${themeClasses.surfaceHover} rounded transition-colors`}
                        title="Copy message"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="w-2.5 h-2.5 text-green-500" />
                        ) : (
                          <Copy className={`w-2.5 h-2.5 ${themeClasses.textSecondary}`} />
                        )}
                      </button>
                    </div>
                  )}
                  
                  <div className="text-xs leading-relaxed">
                    {message.content.includes('```') ? (
                      <div className="space-y-1">
                        {message.content.split('```').map((part, index) => {
                          if (index % 2 === 1) {
                            return (
                              <pre
                                key={index}
                                className={`${themeClasses.surface} p-2 rounded text-xs font-mono overflow-x-auto border ${themeClasses.border}`}
                              >
                                <code>{part.trim()}</code>
                              </pre>
                            );
                          } else {
                            return (
                              <div key={index} className="space-y-1">
                                {formatContent(part)}
                              </div>
                            );
                          }
                        })}
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {formatContent(message.content)}
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-xs ${themeClasses.textSecondary} mt-1 opacity-70`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className={`${themeClasses.assistantMessage} border rounded-xl px-3 py-2 shadow-sm`}>
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                    <span className={`text-xs ${themeClasses.textSecondary}`}>
                      {selectedModelInfo?.name || 'AI'} is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area - Compact Design */}
        <div className={`border-t ${themeClasses.border} p-3 flex-shrink-0 ${themeClasses.bg}`}>
          {/* Add Context Button */}
          <div className="mb-2">
            <button className={`flex items-center space-x-1.5 px-2 py-1 text-xs border rounded transition-all duration-200 ${themeClasses.input} ${themeClasses.border} ${themeClasses.surfaceHover}`}>
              <Paperclip className="w-2.5 h-2.5" />
              <span>Add Context...</span>
            </button>
          </div>

          {/* AI Agent Selector - Moved above prompt bar */}
          <div className="mb-2">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className={`w-full flex items-center justify-between px-2 py-1.5 text-xs border rounded transition-all duration-200 ${themeClasses.input} ${themeClasses.border} ${themeClasses.surfaceHover}`}
              >
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${themeClasses.text}`}>{selectedModelInfo?.name || 'Gemini 2.0 Flash'}</span>
                  {selectedModel === 'gemini-2.0-flash' && !apiError && (
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                      Live
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showModelDropdown && (
                <div className={`absolute bottom-full left-0 mb-1 w-full border rounded-lg shadow-lg z-50 ${themeClasses.dropdown} ${themeClasses.border}`}>
                  <div className="p-2">
                    <h3 className={`text-xs font-medium ${themeClasses.text} mb-2 text-center`}>Copilot Models</h3>
                    
                    <div className="space-y-0.5">
                      {aiModels.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model.id);
                            setShowModelDropdown(false);
                            setApiError(null); // Clear any previous errors
                          }}
                          className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded transition-all duration-200 ${
                            selectedModel === model.id
                              ? 'bg-blue-600 text-white'
                              : `${themeClasses.surfaceHover} ${themeClasses.text}`
                          }`}
                        >
                          <div className="flex items-center space-x-1.5">
                            {selectedModel === model.id && (
                              <Check className="w-2.5 h-2.5" />
                            )}
                            <div className="text-left">
                              <div className="font-medium">{model.name}</div>
                              <div className={`text-xs ${selectedModel === model.id ? 'text-blue-100' : themeClasses.textSecondary}`}>
                                {model.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-xs ${selectedModel === model.id ? 'text-blue-100' : themeClasses.textSecondary}`}>
                              {model.speed}
                            </span>
                            {model.id === 'gemini-2.0-flash' && (
                              <span className="text-xs text-green-500">Live</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600">
                      <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        Manage Models...
                      </button>
                      <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                        Add Premium Models
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Input Bar */}
          <div className={`flex items-center space-x-1.5 border rounded-lg p-1.5 ${themeClasses.border} ${themeClasses.surface}`}>
            {/* Input Field */}
            <input
              ref={textareaRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Copilot..."
              className={`flex-1 bg-transparent text-xs focus:outline-none ${themeClasses.text}`}
              disabled={isLoading}
            />

            {/* Action Buttons */}
            <div className="flex items-center space-x-0.5">
              <button
                className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
                title="Voice input"
              >
                <Mic className={`w-3 h-3 ${themeClasses.textSecondary}`} />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={!query.trim() || isLoading}
                className={`p-1 ${themeClasses.surfaceHover} rounded transition-all duration-200`}
                title="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Send className={`w-3 h-3 ${themeClasses.textSecondary}`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopilotSidebar;