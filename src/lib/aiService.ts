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
  private deepseekApiKey: string;
  private llamaApiKey: string;
  private googleApiKey: string;
  private siteUrl: string;
  private siteName: string;

  constructor() {
    this.deepseekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
    this.llamaApiKey = import.meta.env.VITE_LLAMA_API_KEY || '';
    this.googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
    this.siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
    this.siteName = import.meta.env.VITE_SITE_NAME || 'Olive Code Editor';
  }

  async callLlama(request: AIRequest): Promise<AIResponse> {
    if (!this.llamaApiKey) {
      throw new Error('Llama API key not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.llamaApiKey}`,
        'HTTP-Referer': this.siteUrl,
        'X-Title': this.siteName,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-maverick:free',
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Llama API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      model: data.model,
      usage: data.usage,
    };
  }

  async callDeepSeek(request: AIRequest): Promise<AIResponse> {
    if (!this.deepseekApiKey) {
      throw new Error('DeepSeek API key not configured');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.deepseekApiKey}`,
        'HTTP-Referer': this.siteUrl,
        'X-Title': this.siteName,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528',
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API error: ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
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
      if (modelId === 'llama-4-maverick') {
        return await this.callLlama(request);
      } else if (modelId === 'deepseek') {
        return await this.callDeepSeek(request);
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
      'llama-4-maverick': 'meta-llama/llama-4-maverick:free',
      'gemini-2.0-flash': 'gemini-2.0-flash-exp',
      'deepseek': 'deepseek/deepseek-r1-0528',
    };

    return modelMap[modelId] || modelId;
  }

  isConfigured(modelId: string): boolean {
    if (modelId === 'llama-4-maverick') {
      return !!this.llamaApiKey;
    } else if (modelId === 'deepseek') {
      return !!this.deepseekApiKey;
    } else if (modelId.startsWith('gemini-')) {
      return !!this.googleApiKey;
    }
    return false;
  }

  getConfigurationStatus(): Record<string, boolean> {
    return {
      llama: !!this.llamaApiKey,
      deepseek: !!this.deepseekApiKey,
      google: !!this.googleApiKey,
    };
  }
}

export const aiService = new AIService();