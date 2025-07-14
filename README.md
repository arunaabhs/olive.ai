# 🌿 Olive Code Editor

A modern, browser-based collaborative code editor with AI assistance, real-time collaboration, and professional development tools. Built with React, TypeScript, and powered by Monaco Editor.

![Olive Code Editor](https://img.shields.io/badge/version-2.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)

## ✨ Features

### 🚀 **Core Editor**
- **Monaco Editor Integration**: Full-featured code editor with IntelliSense, syntax highlighting, and error detection
- **Multi-language Support**: JavaScript, TypeScript, Python, HTML, CSS, JSON, Markdown, and more
- **Advanced Editing**: Auto-completion, bracket matching, code folding, and multi-cursor editing
- **File Management**: Create, open, save, and manage multiple files with tabbed interface
- **Search & Replace**: Powerful find/replace with regex support and global search

### 🤖 **AI-Powered Copilot**
- **Multiple AI Models**: 
  - Gemini 2.0 Flash (Google)
  - DeepSeek R1 (Advanced reasoning)
  - Mistral 7B (Efficient processing)
- **Code Assistance**: Code explanation, debugging, optimization suggestions
- **Context-Aware**: Understands your current code and provides relevant suggestions
- **Interactive Chat**: Natural language interaction with AI assistants

### 👥 **Real-time Collaboration**
- **Live Collaboration**: Multiple users can edit simultaneously with Y.js
- **WebSocket Integration**: Real-time synchronization across all connected users
- **Collaborative Cursors**: See where other users are editing in real-time
- **Project Sharing**: Share projects via unique URLs
- **User Management**: Invite collaborators and manage permissions
- **Session Management**: Persistent collaboration sessions

### 💻 **Advanced Terminal**
- **Integrated Terminal**: Full-featured terminal with command execution
- **Code Execution**: Run JavaScript, Python, HTML, and other languages
- **Multiple Sessions**: Support for multiple terminal instances
- **Command History**: Navigate through previous commands
- **File Operations**: Built-in file system commands (ls, cd, mkdir, etc.)
- **Package Management**: npm, pip, and yarn command support

### 🔐 **Authentication & Security**
- **Supabase Authentication**: Secure email/password authentication
- **Session Management**: Persistent login sessions
- **Password Reset**: Email-based password recovery
- **User Profiles**: Personalized user experience

## 🛠️ Technology Stack

### **Frontend**
- **React 18.3.1** - Modern React with hooks and concurrent features
- **TypeScript 5.5.3** - Type-safe development
- **Vite 5.4.2** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **Monaco Editor** - VS Code's editor in the browser
- **Lucide React** - Beautiful, customizable icons

### **Real-time Collaboration**
- **Y.js 13.6.27** - Conflict-free replicated data types (CRDTs)
- **y-monaco 0.1.6** - Monaco Editor binding for Y.js
- **y-websocket 2.1.0** - WebSocket provider for Y.js
- **y-indexeddb 9.0.12** - IndexedDB persistence for Y.js
- **PartySocket 1.1.4** - Enhanced WebSocket connections

### **AI Integration**
- **Gemini API** - Google's advanced language model
- **DeepSeek R1** - Advanced reasoning capabilities
- **Mistral 7B** - Efficient language processing

### **Backend Services**
- **Supabase** - Backend-as-a-Service platform
- **Real-time subscriptions** - Live data synchronization
- **Row Level Security** - Fine-grained access control

### **Development Tools**
- **ESLint** - Code linting and quality checks
- **PostCSS** - CSS processing and optimization
- **Autoprefixer** - Automatic CSS vendor prefixes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for authentication and database)
- AI API keys (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/olive-code-editor.git
   cd olive-code-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI API Keys (Optional)
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key
   VITE_MISTRAL_API_KEY=your_mistral_api_key
   
   # Application URLs
   VITE_SITE_URL=http://localhost:5173
   VITE_SITE_NAME=Olive Code Editor
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Supabase Setup

1. **Create a new Supabase project** at [supabase.com](https://supabase.com)

2. **Configure Authentication**
   - Enable email authentication
   - Disable email confirmation for development
   - Set up redirect URLs

3. **Database Schema**
   The application uses Supabase's built-in auth system. Additional tables can be created as needed for project data.

4. **Environment Variables**
   - Copy your project URL and anon key from Supabase dashboard
   - Add them to your `.env` file

### AI API Configuration

#### Gemini API (Google)
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to `.env` as `VITE_GEMINI_API_KEY`

#### OpenRouter API (DeepSeek)
1. Sign up at [OpenRouter](https://openrouter.ai)
2. Generate an API key
3. Add to `.env` as `VITE_OPENROUTER_API_KEY`

#### Mistral API
1. Create account at [Mistral AI](https://mistral.ai)
2. Generate API key
3. Add to `.env` as `VITE_MISTRAL_API_KEY`

## 📖 Usage Guide

### Collaboration Features

1. **Starting a Collaboration Session**
   - Click "Collaboration" → "Share Project Link"
   - Share the generated URL with team members
   - See real-time cursors and edits

2. **Managing Collaborators**
   - View active collaborators in the sidebar
   - Invite users via email
   - Manage permissions and access

3. **Project Sharing**
   - Generate shareable project URLs
   - Export project data
   - Start live share sessions

### AI Assistant Usage

1. **Activating Copilot**
   - Click the sparkle icon or press `Ctrl+Shift+A`
   - Choose your preferred AI model

2. **Getting Code Help**
   - Ask questions about your code
   - Request explanations and optimizations
   - Get debugging assistance

3. **AI Models**
   - **Gemini 2.0 Flash**: Fast, general-purpose assistance
   - **DeepSeek R1**: Advanced reasoning and complex problems
   - **Mistral 7B**: Efficient processing for quick responses

### Terminal Usage

1. **Opening Terminal**
   - Click "View" → "Toggle Terminal" or press `Ctrl+`
   - Multiple terminal sessions supported

2. **Available Commands**
   ```bash
   # File operations
   ls, dir          # List files
   cd <directory>   # Change directory
   mkdir <name>     # Create directory
   touch <file>     # Create file
   
   # Package management
   npm install      # Install dependencies
   npm run dev      # Start development server
   pip install      # Python packages
   
   # System commands
   ps               # List processes
   env              # Environment variables
   clear            # Clear terminal
   help             # Show all commands
   ```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor** - Microsoft's excellent code editor
- **Y.js** - Conflict-free collaborative editing
- **Supabase** - Backend-as-a-Service platform
- **Tailwind CSS** - Utility-first CSS framework
- **React Team** - Amazing frontend framework
- **Vite** - Fast build tool and development server

## 📞 Support

- **Documentation**: [docs.olive-editor.com](https://docs.olive-editor.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/olive-code-editor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/olive-code-editor/discussions)
- **Email**: support@olive-editor.com

---

<div align="center">
  <p>Built with ❤️ by the Olive team</p>
  <p>
    <a href="https://olive-editor.com">Website</a> •
    <a href="https://docs.olive-editor.com">Documentation</a> •
    <a href="https://github.com/yourusername/olive-code-editor">GitHub</a>
  </p>
</div>
