interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
    index: number;
  }>;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
  }>;
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

export class GeminiAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = import.meta.env.VITE_GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    if (!this.apiKey) {
      throw new Error('Gemini API key is not configured. Please check your environment variables.');
    }
  }

  async generateResponse(prompt: string, context?: string): Promise<string> {
    try {
      const requestBody: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: context ? `Context: ${context}\n\nUser Question: ${prompt}` : prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated from Gemini API');
      }

      const candidate = data.candidates[0];
      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('Invalid response format from Gemini API');
      }

      return candidate.content.parts[0].text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
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

    return this.generateResponse(prompt);
  }

  async generateCodeSuggestions(code: string, language: string, userQuery: string): Promise<string> {
    const prompt = `I'm working with this ${language} code:

\`\`\`${language}
${code}
\`\`\`

User question: ${userQuery}

Please provide helpful suggestions, improvements, or answers related to this code.`;

    return this.generateResponse(prompt);
  }

  async debugCode(code: string, language: string, errorMessage?: string): Promise<string> {
    const prompt = `Help me debug this ${language} code:

\`\`\`${language}
${code}
\`\`\`

${errorMessage ? `Error message: ${errorMessage}` : 'Please identify potential issues and suggest fixes.'}

Please provide:
1. Identified issues
2. Suggested fixes
3. Best practices to prevent similar issues`;

    return this.generateResponse(prompt);
  }
}

export const geminiAPI = new GeminiAPI();