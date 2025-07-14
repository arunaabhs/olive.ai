# 🌿 Olive Code Editor

A modern, browser-based collaborative code editor with AI assistance, real-time collaboration, and professional development tools. Built with React, TypeScript, and powered by Monaco Editor.

![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

---

## ✨ Features

### 🚀 Code Editing
- Monaco-powered editor with IntelliSense, syntax highlighting, and error detection
- Multi-language support: JavaScript, TypeScript, Python, HTML, CSS, JSON, Markdown
- Auto-complete, bracket matching, code folding, multi-cursor editing
- Tabbed file management and global find/replace

### 🤖 AI-Powered Copilot
- Code explanation, debugging, and optimization suggestions
- Context-aware assistant with live responses
- Multiple models supported: **Gemini 2.0**, **DeepSeek R1**, **Mistral 7B**

### 👥 Real-time Collaboration
- Multi-user editing powered by Y.js and WebSockets
- Real-time cursors, synced file changes, and persistent sessions
- Shareable project URLs, permission management, and live presence tracking

### 💻 Integrated Terminal
- Built-in terminal for JavaScript, Python, HTML and more
- Support for multiple sessions and command history
- Basic file system commands and package managers (npm, pip, yarn)

### 🔐 Authentication
- Supabase-backed email/password login
- Persistent sessions, password reset, and user profiles

---

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Monaco Editor
- **Collaboration**: Y.js, WebSockets, IndexedDB
- **AI Integration**: Gemini API, DeepSeek, Mistral (via OpenRouter)
- **Backend**: Supabase, PostgreSQL, Row Level Security
- **Dev Tools**: ESLint, PostCSS, Autoprefixer

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- (Optional) AI API keys

### Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/yourusername/olive-code-editor.git
   cd olive-code-editor
