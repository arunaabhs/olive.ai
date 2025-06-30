interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

interface OpenRouterResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenRouterAPI {
  private deepSeekApiKey: string;
  private llamaApiKey: string;
  private baseUrl: string;
  private siteUrl: string;
  private siteName: string;

  constructor() {
    // DeepSeek API key
    this.deepSeekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || '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';
    
    // Llama API key
    this.llamaApiKey = import.meta.env.VITE_LLAMA_API_KEY || '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';
    
    this.baseUrl = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
    this.siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
    this.siteName = import.meta.env.VITE_SITE_NAME || 'Olive Code Editor';
    
    if (!this.deepSeekApiKey && !this.llamaApiKey) {
      throw new Error('OpenRouter API keys are not configured. Please check your environment variables.');
    }
  }

  private getApiKeyForModel(model: string): string {
    if (model.includes('llama')) {
      return this.llamaApiKey;
    } else if (model.includes('deepseek')) {
      return this.deepSeekApiKey;
    }
    // Default to DeepSeek key for backward compatibility
    return this.deepSeekApiKey;
  }

  async generateResponse(prompt: string, model: string = 'deepseek/deepseek-r1-0528:free', context?: string, imageUrl?: string): Promise<string> {
    try {
      const apiKey = this.getApiKeyForModel(model);
      
      if (!apiKey) {
        throw new Error(`API key not configured for model: ${model}`);
      }

      const messages: OpenRouterMessage[] = [];
      
      // Add system context if provided
      if (context) {
        messages.push({
          role: 'system',
          content: `You are an AI coding assistant. Here's the current code context:\n\n${context}`
        });
      }
      
      // Add user message with optional image support
      if (imageUrl && model.includes('llama')) {
        // Llama 4 Maverick supports vision
        messages.push({
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        });
      } else {
        // Text-only message
        messages.push({
          role: 'user',
          content: prompt
        });
      }

      const requestBody: OpenRouterRequest = {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': this.siteUrl,
          'X-Title': this.siteName,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data: OpenRouterResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated from OpenRouter API');
      }

      const choice = data.choices[0];
      if (!choice.message || !choice.message.content) {
        throw new Error('Invalid response format from OpenRouter API');
      }

      return choice.message.content;
    } catch (error) {
      console.error('OpenRouter API Error:', error);
      throw error;
    }
  }

  async generateDeepSeekResponse(prompt: string, context?: string): Promise<string> {
    return this.generateResponse(prompt, 'deepseek/deepseek-r1-0528:free', context);
  }

  async generateLlamaResponse(prompt: string, context?: string, imageUrl?: string): Promise<string> {
    return this.generateResponse(prompt, 'meta-llama/llama-4-maverick:free', context, imageUrl);
  }

  async generateCodeExplanation(code: string, language: string, model: string = 'deepseek/deepseek-r1-0528:free'): Promise<string> {
    const prompt = `Please explain this ${language} code in detail:

\`\`\`${language}
${code}
\`\`\`

Provide a clear explanation of:
1. What the code does
2. Key concepts and patterns used
3. Any potential improvements or best practices
4. How it fits into a larger application context`;

    return this.generateResponse(prompt, model, code);
  }

  async generateCodeSuggestions(code: string, language: string, userQuery: string, model: string = 'deepseek/deepseek-r1-0528:free'): Promise<string> {
    const prompt = `I'm working with this ${language} code and have a question: ${userQuery}

Please provide helpful suggestions, improvements, or answers related to this code.`;

    return this.generateResponse(prompt, model, code);
  }

  async debugCode(code: string, language: string, errorMessage?: string, model: string = 'deepseek/deepseek-r1-0528:free'): Promise<string> {
    const prompt = `Help me debug this ${language} code:

${errorMessage ? `Error message: ${errorMessage}` : 'Please identify potential issues and suggest fixes.'}

Please provide:
1. Identified issues
2. Suggested fixes
3. Best practices to prevent similar issues`;

    return this.generateResponse(prompt, model, code);
  }

  async analyzeImage(imageUrl: string, prompt: string = "What is in this image?"): Promise<string> {
    return this.generateLlamaResponse(prompt, undefined, imageUrl);
  }
}

export const openRouterAPI = new OpenRouterAPI();