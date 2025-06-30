// AI Service for handling different AI providers
interface AIResponse {
  content: string;
  model: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface AIRequest {
  model: string;
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

class AIService {
  private openaiApiKey: string;
  private anthropicApiKey: string;
  private googleApiKey: string;

  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
    this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
  }

  async callOpenAI(request: AIRequest): Promise<AIResponse> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
    };
  }

  async callAnthropic(request: AIRequest): Promise<AIResponse> {
    if (!this.anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Filter out system messages and convert them to the first user message
    const systemMessage = request.messages.find(msg => msg.role === 'system');
    const otherMessages = request.messages.filter(msg => msg.role !== 'system');
    
    // If there's a system message, prepend it to the first user message
    if (systemMessage && otherMessages.length > 0 && otherMessages[0].role === 'user') {
      otherMessages[0] = {
        ...otherMessages[0],
        content: `${systemMessage.content}\n\n${otherMessages[0].content}`
      };
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': this.anthropicApiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.max_tokens || 1000,
        messages: otherMessages,
        temperature: request.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Anthropic API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      model: data.model,
      usage: data.usage,
    };
  }

  async callGemini(request: AIRequest): Promise<AIResponse> {
    if (!this.googleApiKey) {
      throw new Error('Google API key not configured');
    }

    try {
      // Convert messages to Gemini format
      // Gemini doesn't support system messages in the same way, so we'll include system context in the first user message
      const systemMessage = request.messages.find(msg => msg.role === 'system');
      const conversationMessages = request.messages.filter(msg => msg.role !== 'system');
      
      const contents = conversationMessages.map((msg, index) => {
        let content = msg.content;
        
        // Add system context to the first user message
        if (index === 0 && msg.role === 'user' && systemMessage) {
          content = `${systemMessage.content}\n\nUser: ${content}`;
        }
        
        return {
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: content }],
        };
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${this.googleApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: request.temperature || 0.7,
              maxOutputTokens: request.max_tokens || 1000,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Gemini API returned no content. This might be due to safety filters.');
      }

      return {
        content: data.candidates[0].content.parts[0].text,
        model: request.model,
        usage: data.usageMetadata,
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }

  async generateResponse(modelId: string, messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<AIResponse> {
    const request: AIRequest = {
      model: this.getModelName(modelId),
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    };

    try {
      if (modelId === 'chatgpt') {
        return await this.callOpenAI(request);
      } else if (modelId.startsWith('claude-')) {
        return await this.callAnthropic(request);
      } else if (modelId.startsWith('gemini-')) {
        return await this.callGemini(request);
      } else {
        throw new Error(`Unsupported model: ${modelId}`);
      }
    } catch (error) {
      console.error('AI API Error:', error);
      throw error;
    }
  }

  private getModelName(modelId: string): string {
    const modelMap: Record<string, string> = {
      'claude-sonnet-3.5': 'claude-3-5-sonnet-20241022',
      'gemini-2.0-flash': 'gemini-2.0-flash-exp',
      'chatgpt': 'gpt-4o-mini',
    };

    return modelMap[modelId] || modelId;
  }

  isConfigured(modelId: string): boolean {
    if (modelId === 'chatgpt') {
      return !!this.openaiApiKey;
    } else if (modelId.startsWith('claude-')) {
      return !!this.anthropicApiKey;
    } else if (modelId.startsWith('gemini-')) {
      return !!this.googleApiKey;
    }
    return false;
  }

  getConfigurationStatus(): Record<string, boolean> {
    return {
      openai: !!this.openaiApiKey,
      anthropic: !!this.anthropicApiKey,
      google: !!this.googleApiKey,
    };
  }
}

export const aiService = new AIService();