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
