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
- **Real AI Integration**: Live API connections with actual AI responses
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

### 🎨 **Professional UI/UX**
- **VS Code-Inspired Interface**: Familiar menu system and layout
- **Dark/Light Themes**: Toggle between themes with smooth transitions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Customizable Layout**: Resizable panels and configurable workspace
- **Keyboard Shortcuts**: Full keyboard navigation and shortcuts
- **Zen Mode**: Distraction-free coding environment

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
- **OpenRouter API** - Access to multiple AI models
- **DeepSeek R1** - Advanced reasoning capabilities
- **Mistral 7B** - Efficient language processing

### **Backend Services**
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Robust relational database
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

### Basic Editor Usage

1. **Creating Files**
   - Click "File" → "New File" or use `Ctrl+N`
   - Choose from templates (JavaScript, TypeScript, React, Python, etc.)
   - Start coding with full IntelliSense support

2. **File Operations**
   - **Save**: `Ctrl+S`
   - **Save As**: `Ctrl+Shift+S`
   - **Open**: `Ctrl+O`
   - **Find**: `Ctrl+F`
   - **Replace**: `Ctrl+H`

3. **Code Execution**
   - Click the "Run" button or press `Ctrl+Enter`
   - View output in the integrated terminal
   - Supports JavaScript, Python, HTML, and more

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

## 🎯 Menu System Reference

### File Menu
- **New File** (`Ctrl+N`) - Create new file with templates
- **Open File** (`Ctrl+O`) - Open existing files
- **Save** (`Ctrl+S`) - Save current file
- **Save As** (`Ctrl+Shift+S`) - Save with new name
- **Export Project** - Download project archive

### Edit Menu
- **Undo** (`Ctrl+Z`) - Undo last action
- **Redo** (`Ctrl+Y`) - Redo last undone action
- **Cut** (`Ctrl+X`) - Cut selected text
- **Copy** (`Ctrl+C`) - Copy selected text
- **Paste** (`Ctrl+V`) - Paste from clipboard
- **Select All** (`Ctrl+A`) - Select all text
- **Find** (`Ctrl+F`) - Search in file
- **Replace** (`Ctrl+H`) - Find and replace
- **Go to Line** (`Ctrl+G`) - Jump to specific line
- **Format Document** - Auto-format code
- **Toggle Comment** - Comment/uncomment lines

### View Menu
- **Command Palette** (`Ctrl+Shift+P`) - Quick command access
- **Toggle Sidebar** (`Ctrl+B`) - Show/hide file explorer
- **Toggle Terminal** (`Ctrl+``) - Show/hide terminal
- **Toggle Copilot** (`Ctrl+Shift+A`) - Show/hide AI assistant
- **Minimap** - Toggle code minimap
- **Line Numbers** - Show/hide line numbers
- **Word Wrap** - Enable/disable word wrapping
- **Zen Mode** - Distraction-free editing
- **Full Screen** - Full screen mode
- **Zoom In/Out** - Adjust font size

### Collaboration Menu
- **Share Project Link** - Generate shareable URL
- **Invite Collaborator** - Send email invitations
- **Start Live Share** - Begin real-time session
- **Export Project** - Download project data
- **Manage Collaborators** - User permissions

## 🏗️ Architecture

### Component Structure
```
src/
├── components/           # React components
│   ├── modals/          # Modal dialogs
│   ├── AuthModal.tsx    # Authentication
│   ├── CodeEditor.tsx   # Main editor
│   ├── CopilotSidebar.tsx # AI assistant
│   ├── Dashboard.tsx    # Main workspace
│   ├── LandingPage.tsx  # Home page
│   ├── Logo.tsx         # Brand logo
│   ├── ProjectHeader.tsx # Menu system
│   ├── ProjectRoom.tsx  # Collaboration
│   ├── Sidebar.tsx      # File explorer
│   └── Terminal.tsx     # Integrated terminal
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state
├── hooks/               # Custom React hooks
│   ├── useFileOperations.ts    # File management
│   ├── useEditorOperations.ts  # Editor actions
│   ├── useCollaboration.ts     # Real-time features
│   └── useViewOperations.ts    # UI state
├── lib/                 # External integrations
│   ├── supabase.ts      # Database client
│   ├── gemini.ts        # Google AI
│   └── openrouter.ts    # Multi-model AI
└── main.tsx             # Application entry
```

### State Management
- **React Context**: Authentication and global state
- **Custom Hooks**: Feature-specific state management
- **Y.js**: Collaborative state synchronization
- **Supabase**: Server-side state persistence

### Real-time Architecture
- **Y.js CRDTs**: Conflict-free collaborative editing
- **WebSocket Providers**: Real-time communication
- **IndexedDB**: Local persistence and offline support
- **Awareness**: User presence and cursor tracking

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard
5. Deploy automatically on git push

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GEMINI_API_KEY` (optional)
- `VITE_OPENROUTER_API_KEY` (optional)
- `VITE_MISTRAL_API_KEY` (optional)

## 🔍 API Reference

### Custom Hooks

#### `useFileOperations`
```typescript
const {
  files,              // Array of open files
  activeFileId,       // Currently active file ID
  createNewFile,      // Create new file
  openFile,           // Open existing file
  saveFile,           // Save file content
  saveFileAs,         // Save with new name
  closeFile,          // Close file
  getActiveFile       // Get current file
} = useFileOperations();
```

#### `useEditorOperations`
```typescript
const {
  undo,               // Undo last action
  redo,               // Redo action
  cut,                // Cut selection
  copy,               // Copy selection
  paste,              // Paste content
  selectAll,          // Select all text
  openSearch,         // Open search dialog
  formatDocument      // Format code
} = useEditorOperations();
```

#### `useCollaboration`
```typescript
const {
  collaborators,      // Active collaborators
  shareProject,       // Generate share link
  inviteCollaborator, // Send invitation
  exportProject,      // Export project data
  startLiveShare      // Begin live session
} = useCollaboration(projectId);
```

### AI Integration

#### Gemini API
```typescript
import { geminiAPI } from './lib/gemini';

// Generate code explanation
const explanation = await geminiAPI.generateCodeExplanation(code, 'javascript');

// Get code suggestions
const suggestions = await geminiAPI.generateCodeSuggestions(code, 'javascript', query);

// Debug code
const debugInfo = await geminiAPI.debugCode(code, 'javascript', errorMessage);
```

#### OpenRouter API
```typescript
import { openRouterAPI } from './lib/openrouter';

// DeepSeek R1 response
const response = await openRouterAPI.generateDeepSeekResponse(prompt);

// Mistral 7B response
const response = await openRouterAPI.generateMistralResponse(prompt);
```

## 🐛 Troubleshooting

### Common Issues

#### **WebSocket Connection Failed**
- Check if you're behind a corporate firewall
- Try using a different WebSocket provider URL
- Ensure your browser supports WebSockets

#### **AI API Not Working**
- Verify API keys are correctly set in `.env`
- Check API key permissions and quotas
- Ensure network connectivity to AI services

#### **Supabase Authentication Issues**
- Verify Supabase URL and anon key
- Check if email confirmation is disabled for development
- Ensure redirect URLs are configured correctly

#### **Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run lint`
- Verify all environment variables are set

### Performance Optimization

1. **Large Files**: Use virtual scrolling for large files
2. **Memory Usage**: Close unused tabs and clear terminal history
3. **Network**: Use WebSocket compression for better performance
4. **Collaboration**: Limit concurrent collaborators for better performance

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper TypeScript types
4. **Add tests** for new functionality
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- **TypeScript**: Use strict typing for all new code
- **Components**: Follow React functional component patterns
- **Hooks**: Create custom hooks for reusable logic
- **Styling**: Use Tailwind CSS classes consistently
- **Testing**: Add unit tests for new features
- **Documentation**: Update README for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor** - Microsoft's excellent code editor
- **Y.js** - Conflict-free collaborative editing
- **Supabase** - Backend-as-a-Service platform
- **Tailwind CSS** - Utility-first CSS framework
- **React Team** - Amazing frontend framework
- **Vite** - Fast build tool and development server

## 🗺️ Roadmap

### Version 2.1 (Q2 2024)
- [ ] Git integration with version control
- [ ] Plugin system for extensions
- [ ] Advanced debugging tools
- [ ] Code review and commenting
- [ ] Project templates and scaffolding

### Version 2.2 (Q3 2024)
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync
- [ ] Advanced AI code generation
- [ ] Team workspaces
- [ ] Performance analytics

### Version 3.0 (Q4 2024)
- [ ] Self-hosted deployment option
- [ ] Enterprise features
- [ ] Advanced security controls
- [ ] Custom AI model integration
- [ ] Marketplace for extensions

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