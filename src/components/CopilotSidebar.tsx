import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, X, Brain, Copy, Check } from 'lucide-react';

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
}

const CopilotSidebar: React.FC<CopilotSidebarProps> = ({ isOpen, onClose, currentCode, isDarkMode = false }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m Olive.AI, your intelligent coding assistant. I can help you with code explanations, debugging, optimizations, and much more. What would you like to work on today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showDappierWidget, setShowDappierWidget] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-900',
    border: 'border-gray-700',
    text: 'text-gray-100',
    textSecondary: 'text-gray-400',
    surface: 'bg-gray-800',
    surfaceHover: 'hover:bg-gray-700',
    input: 'bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-500',
    userMessage: 'bg-emerald-600 text-white',
    assistantMessage: 'bg-gray-800 text-gray-100 border-gray-700',
    scrollbar: 'scrollbar-thumb-gray-600 scrollbar-track-gray-800'
  } : {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    surface: 'bg-gray-50',
    surfaceHover: 'hover:bg-gray-100',
    input: 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
    userMessage: 'bg-emerald-600 text-white',
    assistantMessage: 'bg-white text-gray-900 border-gray-200',
    scrollbar: 'scrollbar-thumb-gray-300 scrollbar-track-gray-100'
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

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [query]);

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

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateMockResponse(userMessage.content, currentCode),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI request failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (userQuery: string, code: string): string => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('explain') || query.includes('what does')) {
      return `I can see you're asking about code explanation. Based on the current code context, here's what I can tell you:\n\n\`\`\`javascript\n// This appears to be a React component\n// with modern hooks and TypeScript\n\`\`\`\n\nThe code structure follows React best practices with proper component composition and state management. Would you like me to explain any specific part in more detail?`;
    }
    
    if (query.includes('optimize') || query.includes('improve')) {
      return `Here are some optimization suggestions for your code:\n\n1. **Performance**: Consider using React.memo() for components that don't need frequent re-renders\n2. **Code Structure**: Extract custom hooks for reusable logic\n3. **TypeScript**: Add more specific type definitions\n\n\`\`\`typescript\n// Example optimization\nconst MemoizedComponent = React.memo(YourComponent);\n\`\`\`\n\nWould you like me to elaborate on any of these suggestions?`;
    }
    
    if (query.includes('bug') || query.includes('error') || query.includes('fix')) {
      return `I can help you debug this issue. Common problems I notice:\n\n• **State Management**: Ensure state updates are properly handled\n• **Dependencies**: Check if all dependencies are correctly listed\n• **Type Safety**: Verify TypeScript types match expected values\n\nCan you share the specific error message you're seeing?`;
    }
    
    return `I understand you're asking about "${userQuery}". I'm here to help with:\n\n• **Code Explanation**: Breaking down complex logic\n• **Debugging**: Finding and fixing issues\n• **Optimization**: Improving performance and structure\n• **Best Practices**: Following modern development standards\n\nCould you provide more specific details about what you'd like assistance with?`;
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

  return (
    <div className={`w-80 h-full flex flex-col ${themeClasses.bg} ${themeClasses.border} border-l`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b flex items-center justify-between ${themeClasses.border} flex-shrink-0`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className={`font-semibold ${themeClasses.text} text-sm`}>olive.ai</h3>
            <p className={`text-xs ${themeClasses.textSecondary}`}>Intelligent Coding Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowDappierWidget(!showDappierWidget)}
            className={`px-3 py-1.5 text-xs rounded-full transition-all duration-200 ${
              showDappierWidget 
                ? 'bg-emerald-600 text-white' 
                : `${themeClasses.surface} ${themeClasses.surfaceHover} ${themeClasses.textSecondary}`
            }`}
            title="Toggle Advanced AI"
          >
            {showDappierWidget ? 'Basic' : 'Advanced'}
          </button>
          <button
            onClick={onClose}
            className={`p-1.5 ${themeClasses.surfaceHover} rounded-lg transition-all duration-200`}
            title="Close olive.ai"
          >
            <X className={`w-4 h-4 ${themeClasses.textSecondary}`} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {showDappierWidget ? (
          /* Dappier AI Widget */
          <div className="flex-1 p-4">
            <div className={`h-full rounded-lg border ${themeClasses.border} ${themeClasses.surface} overflow-hidden`}>
              <div id="dappier-ask-ai-widget" className="h-full">
                <dappier-ask-ai-widget 
                  widgetId="wd_01jysrskrhf4mv60et0mzk11wd" 
                />
              </div>
            </div>
          </div>
        ) : (
          /* Original Chat Interface */
          <>
            {/* Messages Container */}
            <div className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 ${themeClasses.scrollbar} scrollbar-thin`}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? themeClasses.userMessage
                        : `${themeClasses.assistantMessage} border`
                    } shadow-sm`}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-medium ${themeClasses.textSecondary}`}>
                          olive.ai
                        </span>
                        <button
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className={`p-1 ${themeClasses.surfaceHover} rounded transition-colors`}
                          title="Copy message"
                        >
                          {copiedMessageId === message.id ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <Copy className={`w-3 h-3 ${themeClasses.textSecondary}`} />
                          )}
                        </button>
                      </div>
                    )}
                    
                    <div className="text-sm leading-relaxed">
                      {message.content.includes('```') ? (
                        <div className="space-y-2">
                          {message.content.split('```').map((part, index) => {
                            if (index % 2 === 1) {
                              return (
                                <pre
                                  key={index}
                                  className={`${themeClasses.surface} p-3 rounded-lg text-xs font-mono overflow-x-auto border ${themeClasses.border}`}
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
                    
                    <div className={`text-xs ${themeClasses.textSecondary} mt-2 opacity-70`}>
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
                  <div className={`${themeClasses.assistantMessage} border rounded-2xl px-4 py-3 shadow-sm`}>
                    <div className="flex items-center space-x-3">
                      <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
                      <span className={`text-sm ${themeClasses.textSecondary}`}>
                        olive.ai is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Search Bar at Bottom */}
            <div className={`border-t ${themeClasses.border} p-4 flex-shrink-0`}>
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <textarea
                    ref={textareaRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask olive.ai anything about your code..."
                    className={`w-full resize-none border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 transition-all duration-200 ${themeClasses.input}`}
                    rows={1}
                    disabled={isLoading}
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                  />
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!query.trim() || isLoading}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl flex-shrink-0"
                  title="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CopilotSidebar;