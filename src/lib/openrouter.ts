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
  private deepSeekApiKey: string;
  private mistralApiKey: string;
  private baseUrl: string;
  private siteUrl: string;
  private siteName: string;

  constructor() {
    this.deepSeekApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    this.mistralApiKey = import.meta.env.VITE_MISTRAL_API_KEY;
    this.baseUrl = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
    this.siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
    this.siteName = import.meta.env.VITE_SITE_NAME || 'Olive Code Editor';
    
    if (!this.deepSeekApiKey) {
      throw new Error('DeepSeek API key is not configured. Please check your VITE_OPENROUTER_API_KEY environment variable.');
    }
    
    if (!this.mistralApiKey) {
      throw new Error('Mistral API key is not configured. Please check your VITE_MISTRAL_API_KEY environment variable.');
    }
  }

  private getApiKey(model: string): string {
    if (model.includes('mistral')) {
      return this.mistralApiKey;
    }
    return this.deepSeekApiKey;
  }

  async generateResponse(prompt: string, model: string = 'deepseek/deepseek-r1-0528:free', context?: string): Promise<string> {
    try {
      const messages: OpenRouterMessage[] = [];
      
      // Add system context if provided
      if (context) {
        messages.push({
          role: 'system',
          content: `You are an AI coding assistant helping with code analysis, debugging, and improvements. Here's the current code context:\n\n${context}`
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

      const apiKey = this.getApiKey(model);

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
        const modelName = model.includes('mistral') ? 'Mistral' : 'DeepSeek';
        throw new Error(`${modelName} API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
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

  // DeepSeek R1 specific methods
  async generateDeepSeekResponse(prompt: string, context?: string): Promise<string> {
    return this.generateResponse(prompt, 'deepseek/deepseek-r1-0528:free', context);
  }

  // Mistral 7B specific methods
  async generateMistralResponse(prompt: string, context?: string): Promise<string> {
    return this.generateResponse(prompt, 'mistralai/mistral-7b-instruct:free', context);
  }

  async generateMistralCodeSuggestions(code: string, language: string, userQuery: string): Promise<string> {
    const prompt = `I'm working with this ${language} code and have a question: ${userQuery}

Please analyze the code and provide:
1. Direct answer to the user's question
2. Code improvements or optimizations if applicable
3. Best practices recommendations
4. Any potential issues or bugs you notice

Please be specific and provide actionable suggestions.`;

    return this.generateMistralResponse(prompt, code);
  }

  async generateMistralCodeExplanation(code: string, language: string): Promise<string> {
    const prompt = `Please explain this ${language} code in detail:

\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive explanation including:
1. What the code does (main functionality)
2. Key concepts and patterns used
3. How different parts work together
4. Any notable design decisions
5. Potential improvements or best practices
6. How it fits into a larger application context`;

    return this.generateMistralResponse(prompt, code);
  }

  // General code-related methods that work with any model
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

  async generateCodeSuggestions(code: string, language: string, userQuery: string): Promise<string> {
    const prompt = `I'm working with this ${language} code and have a question: ${userQuery}

Please analyze the code and provide helpful suggestions, improvements, or answers related to this code.`;

    return this.generateDeepSeekResponse(prompt, code);
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
}

export const openRouterAPI = new OpenRouterAPI();