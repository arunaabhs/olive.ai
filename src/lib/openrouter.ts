interface OpenRouterMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
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
  private apiKey: string;
  private baseUrl: string;
  private siteUrl: string;
  private siteName: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    this.baseUrl = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
    this.siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
    this.siteName = import.meta.env.VITE_SITE_NAME || 'Olive Code Editor';
    
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured. Please check your environment variables.');
    }
  }

  async generateResponse(prompt: string, model: string = 'deepseek/deepseek-r1-0528:free', context?: string): Promise<string> {
    try {
      const messages: OpenRouterMessage[] = [];
      
      // Add system context if provided
      if (context) {
        messages.push({
          role: 'system',
          content: `You are an AI coding assistant. Here's the current code context:\n\n${context}`
        });
      }
      
      // Add user message
      messages.push({
        role: 'user',
        content: prompt
      });

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
          'Authorization': `Bearer ${this.apiKey}`,
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

  async generateCodeExplanation(code: string, language: string): Promise<string> {
    const prompt = `Please explain this ${language} code in detail:

\`\`\`${language}
${code}
\`\`\`

Provide a clear explanation of:
1. What the code does
2. Key concepts and patterns used
3. Any potential improvements or best practices
4. How it fits into a larger application context`;

    return this.generateDeepSeekResponse(prompt, code);
  }

  async generateCodeSuggestions(code: string, language: string, userQuery: string): Promise<string> {
    const prompt = `I'm working with this ${language} code and have a question: ${userQuery}

Please provide helpful suggestions, improvements, or answers related to this code.`;

    return this.generateDeepSeekResponse(prompt, code);
  }

  async debugCode(code: string, language: string, errorMessage?: string): Promise<string> {
    const prompt = `Help me debug this ${language} code:

${errorMessage ? `Error message: ${errorMessage}` : 'Please identify potential issues and suggest fixes.'}

Please provide:
1. Identified issues
2. Suggested fixes
3. Best practices to prevent similar issues`;

    return this.generateDeepSeekResponse(prompt, code);
  }
}

export const openRouterAPI = new OpenRouterAPI();