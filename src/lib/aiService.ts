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
      throw new Error(`OpenAI API error: ${response.statusText}`);
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
        messages: request.messages,
        temperature: request.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
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

    // Convert messages to Gemini format
    const contents = request.messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

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
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.candidates[0].content.parts[0].text,
      model: request.model,
      usage: data.usageMetadata,
    };
  }

  async generateResponse(modelId: string, messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>): Promise<AIResponse> {
    const request: AIRequest = {
      model: this.getModelName(modelId),
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    };

    try {
      if (modelId.startsWith('gpt-') || modelId.startsWith('o3-')) {
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
      'gpt-4.1': 'gpt-4-turbo-preview',
      'gpt-4o': 'gpt-4o',
      'o3-mini': 'o1-mini',
    };

    return modelMap[modelId] || modelId;
  }

  isConfigured(modelId: string): boolean {
    if (modelId.startsWith('gpt-') || modelId.startsWith('o3-')) {
      return !!this.openaiApiKey;
    } else if (modelId.startsWith('claude-')) {
      return !!this.anthropicApiKey;
    } else if (modelId.startsWith('gemini-')) {
      return !!this.googleApiKey;
    }
    return false;
  }
}

export const aiService = new AIService();