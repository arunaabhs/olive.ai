import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import { Play, Save, Download, Upload, Users, Wifi, WifiOff, Eye, UserCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface CodeEditorProps {
  onCodeChange?: (code: string) => void;
  activeFile?: string;
  onRunCode?: (code: string, language: string) => void;
  isDarkMode?: boolean;
  projectId?: string;
}

interface CodeEditorRef {
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
}

interface CollaboratorInfo {
  id: string;
  name: string;
  email: string;
  color: string;
  cursor?: {
    line: number;
    column: number;
  };
  selection?: {
    startLine: number;
    startColumn: number;
    endLine: number;
    endColumn: number;
  };
  lastSeen: number;
}

// Enhanced Yjs document management with better project isolation
const projectDocs = new Map<string, Y.Doc>();
const projectProviders = new Map<string, WebsocketProvider>();
const projectPersistence = new Map<string, IndexeddbPersistence>();

const getProjectDoc = (projectId: string) => {
  if (!projectDocs.has(projectId)) {
    const ydoc = new Y.Doc();
    projectDocs.set(projectId, ydoc);
  }
  return projectDocs.get(projectId)!;
};

const getProjectProvider = (projectId: string, ydoc: Y.Doc) => {
  const providerId = `${projectId}-provider`;
  if (!projectProviders.has(providerId)) {
    // Enhanced WebSocket provider with better configuration
    const wsProvider = new WebsocketProvider(
      import.meta.env.VITE_COLLABORATION_WS_URL || 'wss://demos.yjs.dev',
      `olive-project-${projectId}`, // Unique project room
      ydoc,
      {
        connect: true,
        awareness: {
          timeout: 30000,
        },
        maxBackoffTime: 2500,
        disableBc: false,
        params: {
          // Add authentication if needed
          auth: 'olive-editor',
          version: '2.0.0'
        }
      }
    );
    projectProviders.set(providerId, wsProvider);
  }
  return projectProviders.get(providerId)!;
};

const getProjectPersistence = (projectId: string, ydoc: Y.Doc) => {
  const persistenceId = `${projectId}-persistence`;
  if (!projectPersistence.has(persistenceId)) {
    const persistence = new IndexeddbPersistence(`olive-editor-${projectId}`, ydoc);
    projectPersistence.set(persistenceId, persistence);
  }
  return projectPersistence.get(persistenceId)!;
};

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(({ 
  onCodeChange, 
  activeFile = 'hello.js', 
  onRunCode,
  isDarkMode = false,
  projectId = 'default-project'
}, ref) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const persistenceRef = useRef<IndexeddbPersistence | null>(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [collaborators, setCollaborators] = useState<Map<string, CollaboratorInfo>>(new Map());
  const [collaborationEnabled, setCollaborationEnabled] = useState(true);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  const { user } = useAuth();

  // Get project-specific Yjs document and text
  const ydoc = getProjectDoc(projectId);
  const ytext = ydoc.getText(`file-${activeFile}`);

  // File content mapping per project with enhanced default content
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    'hello.js': `// Welcome to Olive Code Editor with Enhanced Real-time Collaboration!
console.log("Hello, World!");

// This editor now supports:
// ✨ Real-time collaborative editing with Yjs
// 🔄 Automatic synchronization across sessions
// 💾 Local persistence with IndexedDB
// 🌐 WebSocket-based collaboration with custom server support
// 👥 Enhanced user awareness with cursors and selections
// 🏠 Project-specific rooms with better isolation
// 🔐 Authentication integration with Supabase
// 📊 Connection status monitoring
// 🎯 Conflict-free collaborative editing

function greetCollaborators(users) {
  return \`Welcome to collaborative coding with \${users.length} active users!\`;
}

// Enhanced collaboration features:
const collaborationFeatures = {
  realTimeSync: true,
  userAwareness: true,
  conflictResolution: true,
  offlineSupport: true,
  projectIsolation: true,
  authenticationIntegration: true
};

console.log("Collaboration features:", collaborationFeatures);

// Try editing this code - changes will be synced in real-time!
// Multiple users can edit simultaneously with advanced conflict resolution.
// Your changes are automatically saved locally and synced when you reconnect.`,
    
    'example.py': `# Enhanced Python Example with Advanced Collaborative Editing
import asyncio
import json
from datetime import datetime

# Real-time collaboration powered by Yjs with enhanced features
print("Welcome to advanced collaborative Python coding!")

class EnhancedCollaborativeEditor:
    def __init__(self, project_id, user_info):
        self.project_id = project_id
        self.user_info = user_info
        self.collaborators = {}
        self.connection_status = "connecting"
        self.sync_enabled = True
        
    async def initialize_collaboration(self):
        """Initialize enhanced collaboration features"""
        print(f"Initializing collaboration for project: {self.project_id}")
        
        # Set up Yjs document
        self.ydoc = self.create_yjs_document()
        
        # Set up WebSocket provider with custom configuration
        self.ws_provider = self.create_websocket_provider()
        
        # Set up IndexedDB persistence
        self.persistence = self.create_persistence_layer()
        
        # Set up user awareness
        self.setup_user_awareness()
        
        print("✅ Enhanced collaboration initialized successfully!")
        
    def create_yjs_document(self):
        """Create and configure Yjs document"""
        # This would be the actual Yjs document in a real implementation
        return {
            'id': f"olive-project-{self.project_id}",
            'created_at': datetime.now(),
            'collaboration_enabled': True
        }
        
    def create_websocket_provider(self):
        """Create WebSocket provider with enhanced configuration"""
        config = {
            'url': 'wss://demos.yjs.dev',  # Can be changed to custom server
            'room': f"olive-project-{self.project_id}",
            'auth': True,
            'reconnect': True,
            'max_backoff': 2500
        }
        print(f"WebSocket provider configured: {config}")
        return config
        
    def create_persistence_layer(self):
        """Set up IndexedDB persistence for offline support"""
        persistence_config = {
            'database': f"olive-editor-{self.project_id}",
            'auto_sync': True,
            'conflict_resolution': 'last_write_wins'
        }
        print(f"Persistence layer configured: {persistence_config}")
        return persistence_config
        
    def setup_user_awareness(self):
        """Configure user awareness for cursor and selection tracking"""
        awareness_config = {
            'user_id': self.user_info['id'],
            'user_name': self.user_info['name'],
            'user_color': self.generate_user_color(),
            'cursor_tracking': True,
            'selection_tracking': True,
            'presence_timeout': 30000
        }
        print(f"User awareness configured: {awareness_config}")
        
    def generate_user_color(self):
        """Generate a unique color for the user"""
        colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
        user_hash = hash(self.user_info['id']) % len(colors)
        return colors[user_hash]
        
    async def sync_changes(self, change):
        """Enhanced change synchronization with conflict resolution"""
        if not self.sync_enabled:
            return
            
        print(f"Syncing change from {self.user_info['name']}: {change}")
        
        # Apply operational transformation for conflict resolution
        resolved_change = self.resolve_conflicts(change)
        
        # Broadcast to all connected users
        await self.broadcast_change(resolved_change)
        
        # Save to persistence layer
        await self.save_to_persistence(resolved_change)
        
    def resolve_conflicts(self, change):
        """Advanced conflict resolution using operational transformation"""
        # This would implement actual OT algorithms in a real system
        return {
            'original': change,
            'resolved': True,
            'timestamp': datetime.now(),
            'user': self.user_info['id']
        }
        
    async def broadcast_change(self, change):
        """Broadcast change to all collaborators"""
        for collaborator_id, collaborator in self.collaborators.items():
            if collaborator_id != self.user_info['id']:
                print(f"Broadcasting to {collaborator['name']}: {change}")
                
    async def save_to_persistence(self, change):
        """Save change to local persistence"""
        print(f"Saving to IndexedDB: {change}")
        
    def add_collaborator(self, user_info):
        """Add a new collaborator with enhanced tracking"""
        self.collaborators[user_info['id']] = {
            **user_info,
            'joined_at': datetime.now(),
            'last_seen': datetime.now(),
            'cursor_position': None,
            'selection_range': None,
            'is_active': True
        }
        print(f"User {user_info['name']} joined the collaborative session")
        
    def update_user_cursor(self, user_id, cursor_position):
        """Update user cursor position for awareness"""
        if user_id in self.collaborators:
            self.collaborators[user_id]['cursor_position'] = cursor_position
            self.collaborators[user_id]['last_seen'] = datetime.now()
            
    def update_user_selection(self, user_id, selection_range):
        """Update user selection for awareness"""
        if user_id in self.collaborators:
            self.collaborators[user_id]['selection_range'] = selection_range
            self.collaborators[user_id]['last_seen'] = datetime.now()
            
    def show_collaboration_stats(self):
        """Display collaboration statistics"""
        active_users = len([u for u in self.collaborators.values() if u['is_active']])
        print(f"📊 Collaboration Stats:")
        print(f"   Active users: {active_users}")
        print(f"   Project ID: {self.project_id}")
        print(f"   Connection: {self.connection_status}")
        print(f"   Sync enabled: {self.sync_enabled}")

# Example usage of enhanced collaborative editor
async def main():
    user_info = {
        'id': 'user-123',
        'name': 'Python Developer',
        'email': 'dev@example.com'
    }
    
    editor = EnhancedCollaborativeEditor('python-project-1', user_info)
    await editor.initialize_collaboration()
    
    # Simulate collaboration
    editor.add_collaborator({
        'id': 'user-456',
        'name': 'Alice',
        'email': 'alice@example.com'
    })
    
    editor.show_collaboration_stats()

# Run the enhanced collaboration demo
if __name__ == "__main__":
    print("🚀 Starting Enhanced Collaborative Python Editor")
    # asyncio.run(main())  # Uncomment to run async demo
    
# Edit this code and see real-time updates with enhanced user awareness!
# The collaboration system now supports advanced conflict resolution and offline editing.`,
    
    'sample.html': `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enhanced Collaborative Web Development</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            min-height: 100vh;
        }
        
        .container {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .collaboration-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .collaboration-status {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .status-indicator {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #4ade80;
            animation: pulse 2s infinite;
            box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
        }
        
        .user-avatars {
            display: flex;
            gap: 8px;
        }
        
        .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            position: relative;
            transition: transform 0.3s ease;
        }
        
        .user-avatar:hover {
            transform: scale(1.1);
        }
        
        .user-avatar::after {
            content: '';
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background: #4ade80;
            border-radius: 50%;
            border: 2px solid white;
        }
        
        .connection-info {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 5px;
        }
        
        .project-id {
            font-family: 'Courier New', monospace;
            background: rgba(0, 0, 0, 0.3);
            padding: 5px 10px;
            border-radius: 8px;
            font-size: 12px;
        }
        
        @keyframes pulse {
            0%, 100% { 
                opacity: 1; 
                transform: scale(1);
            }
            50% { 
                opacity: 0.7; 
                transform: scale(1.1);
            }
        }
        
        h1 {
            text-align: center;
            margin-bottom: 30px;
            font-size: 3em;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            background: linear-gradient(45deg, #fff, #f0f0f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 25px;
            margin-top: 40px;
        }
        
        .feature-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 25px;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transition: left 0.5s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
        
        .feature-card:hover::before {
            left: 100%;
        }
        
        .feature-icon {
            font-size: 2.5em;
            margin-bottom: 15px;
            display: block;
        }
        
        .feature-title {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #fff;
        }
        
        .feature-description {
            line-height: 1.6;
            opacity: 0.9;
        }
        
        .collaboration-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 40px;
            padding: 20px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 15px;
        }
        
        .metric {
            text-align: center;
            padding: 15px;
        }
        
        .metric-value {
            font-size: 2em;
            font-weight: bold;
            color: #4ade80;
            display: block;
        }
        
        .metric-label {
            font-size: 0.9em;
            opacity: 0.8;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="collaboration-header">
            <div class="collaboration-status">
                <div class="status-indicator"></div>
                <div>
                    <h3 style="margin: 0; font-size: 1.2em;">Enhanced Real-time Collaboration Active</h3>
                    <p style="margin: 5px 0 0 0; opacity: 0.8; font-size: 0.9em;">Powered by Yjs with advanced features</p>
                </div>
            </div>
            
            <div class="connection-info">
                <div class="user-avatars" id="userAvatars">
                    <!-- User avatars will be populated by JavaScript -->
                </div>
                <div class="project-id" id="projectId">Project: olive-enhanced-123</div>
            </div>
        </div>
        
        <h1>🚀 Olive Code Editor</h1>
        
        <p style="text-align: center; font-size: 1.2em; margin-bottom: 40px; opacity: 0.9;">
            Experience the future of collaborative coding with enhanced real-time synchronization, 
            advanced user awareness, and project-specific rooms with enterprise-grade features!
        </p>
        
        <div class="feature-grid">
            <div class="feature-card">
                <span class="feature-icon">⚡</span>
                <h3 class="feature-title">Enhanced Real-time Sync</h3>
                <p class="feature-description">
                    Changes appear instantly across all connected sessions with advanced conflict-free resolution 
                    using operational transformation and Yjs CRDT technology.
                </p>
            </div>
            
            <div class="feature-card">
                <span class="feature-icon">👥</span>
                <h3 class="feature-title">Advanced User Awareness</h3>
                <p class="feature-description">
                    See other users' cursors, selections, and real-time presence indicators with enhanced 
                    user profiles and activity tracking.
                </p>
            </div>
            
            <div class="feature-card">
                <span class="feature-icon">🏠</span>
                <h3 class="feature-title">Project Isolation</h3>
                <p class="feature-description">
                    Each project has its own secure collaboration space with isolated document sharing 
                    and enhanced privacy controls.
                </p>
            </div>
            
            <div class="feature-card">
                <span class="feature-icon">🔐</span>
                <h3 class="feature-title">Authenticated Collaboration</h3>
                <p class="feature-description">
                    Deep integration with Supabase authentication shows real user names, profiles, 
                    and maintains secure access control.
                </p>
            </div>
            
            <div class="feature-card">
                <span class="feature-icon">💾</span>
                <h3 class="feature-title">Enhanced Persistence</h3>
                <p class="feature-description">
                    Your work is automatically saved locally with IndexedDB and synced when you reconnect, 
                    with conflict resolution and version history.
                </p>
            </div>
            
            <div class="feature-card">
                <span class="feature-icon">🔄</span>
                <h3 class="feature-title">Advanced Offline Support</h3>
                <p class="feature-description">
                    Continue working offline with full functionality and automatic synchronization 
                    when connection is restored, with smart conflict resolution.
                </p>
            </div>
            
            <div class="feature-card">
                <span class="feature-icon">🌐</span>
                <h3 class="feature-title">Custom Server Support</h3>
                <p class="feature-description">
                    Configurable WebSocket servers with custom authentication, room management, 
                    and enterprise-grade scaling capabilities.
                </p>
            </div>
            
            <div class="feature-card">
                <span class="feature-icon">📊</span>
                <h3 class="feature-title">Collaboration Analytics</h3>
                <p class="feature-description">
                    Real-time metrics on user activity, edit frequency, collaboration patterns, 
                    and project health with detailed insights.
                </p>
            </div>
        </div>
        
        <div class="collaboration-metrics">
            <div class="metric">
                <span class="metric-value" id="activeUsers">3</span>
                <div class="metric-label">Active Users</div>
            </div>
            <div class="metric">
                <span class="metric-value" id="syncedChanges">1,247</span>
                <div class="metric-label">Synced Changes</div>
            </div>
            <div class="metric">
                <span class="metric-value" id="uptime">99.9%</span>
                <div class="metric-label">Uptime</div>
            </div>
            <div class="metric">
                <span class="metric-value" id="latency">12ms</span>
                <div class="metric-label">Avg Latency</div>
            </div>
        </div>
        
        <script>
            // Enhanced collaborative editing demo with real-time features
            console.log("Enhanced collaborative HTML editing with advanced user awareness is now active!");
            
            // Simulate enhanced user avatars with more realistic data
            const users = [
                { name: 'Alice Chen', color: '#ff6b6b', role: 'Frontend Dev', active: true },
                { name: 'Bob Smith', color: '#4ecdc4', role: 'Backend Dev', active: true },
                { name: 'Charlie Kim', color: '#45b7d1', role: 'Full Stack', active: false },
                { name: 'Diana Lopez', color: '#96ceb4', role: 'UI/UX Designer', active: true },
                { name: 'Ethan Wang', color: '#feca57', role: 'DevOps', active: true }
            ];
            
            const avatarsContainer = document.getElementById('userAvatars');
            users.filter(user => user.active).forEach(user => {
                const avatar = document.createElement('div');
                avatar.className = 'user-avatar';
                avatar.style.backgroundColor = user.color;
                avatar.textContent = user.name.split(' ').map(n => n[0]).join('');
                avatar.title = \`\${user.name} (\${user.role}) - Online\`;
                avatarsContainer.appendChild(avatar);
            });
            
            // Enhanced real-time collaboration simulation
            let changeCount = 1247;
            let activeUserCount = users.filter(u => u.active).length;
            
            function updateMetrics() {
                // Simulate real-time metrics updates
                changeCount += Math.floor(Math.random() * 5) + 1;
                document.getElementById('syncedChanges').textContent = changeCount.toLocaleString();
                
                // Simulate latency fluctuation
                const latency = Math.floor(Math.random() * 20) + 8;
                document.getElementById('latency').textContent = \`\${latency}ms\`;
                
                // Update active users occasionally
                if (Math.random() < 0.1) {
                    activeUserCount = Math.max(1, activeUserCount + (Math.random() < 0.5 ? -1 : 1));
                    document.getElementById('activeUsers').textContent = activeUserCount;
                }
            }
            
            // Simulate real-time collaboration heartbeat
            setInterval(() => {
                const timestamp = new Date().toLocaleTimeString();
                console.log(\`Enhanced collaboration heartbeat: \${timestamp}\`);
                updateMetrics();
            }, 3000);
            
            // Simulate Yjs document updates
            function simulateYjsUpdates() {
                console.log("Yjs document synchronized");
                console.log("WebSocket provider status: connected");
                console.log("IndexedDB persistence: active");
                console.log("User awareness: tracking cursors and selections");
            }
            
            // Initialize enhanced collaboration features
            simulateYjsUpdates();
            
            // Try editing this HTML and see changes sync in real-time with enhanced user awareness!
            // The collaboration system now supports advanced conflict resolution and enterprise features.
        </script>
    </div>
</body>
</html>`
  });

  const getLanguageFromFile = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'py':
        return 'python';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'cpp':
      case 'c':
        return 'cpp';
      case 'java':
        return 'java';
      case 'php':
        return 'php';
      case 'rb':
        return 'ruby';
      case 'go':
        return 'go';
      case 'rs':
        return 'rust';
      case 'sql':
        return 'sql';
      default:
        return 'javascript';
    }
  };

  const generateUserColor = (userId: string): string => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#10ac84', '#ee5a24', '#0abde3', '#3867d6', '#8854d0'
    ];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const setupEnhancedCollaboration = (editor: any, monaco: Monaco) => {
    if (!collaborationEnabled) return;

    try {
      // Clean up existing connections
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (persistenceRef.current) {
        persistenceRef.current.destroy();
      }

      // Set up enhanced IndexedDB persistence for offline support (project-specific)
      persistenceRef.current = getProjectPersistence(projectId, ydoc);
      
      // Set up enhanced WebSocket provider for real-time collaboration (project-specific room)
      providerRef.current = getProjectProvider(projectId, ydoc);
      
      // Enhanced connection status monitoring
      setConnectionStatus('connecting');
      
      // Set up Monaco binding with enhanced configuration
      bindingRef.current = new MonacoBinding(
        ytext,
        editor.getModel(),
        new Set([editor]),
        providerRef.current.awareness
      );

      // Enhanced connection status handling
      providerRef.current.on('status', (event: any) => {
        console.log('🔗 WebSocket status changed:', event.status);
        setIsConnected(event.status === 'connected');
        setConnectionStatus(event.status === 'connected' ? 'connected' : 'disconnected');
      });

      // Enhanced connection event handling
      providerRef.current.on('connection-close', () => {
        console.log('🔌 WebSocket connection closed');
        setConnectionStatus('disconnected');
      });

      providerRef.current.on('connection-error', (error: any) => {
        console.error('❌ WebSocket connection error:', error);
        setConnectionStatus('disconnected');
      });

      // Set enhanced user info for awareness (using Supabase auth data)
      const userInfo = {
        name: user?.email?.split('@')[0] || `Guest-${Math.floor(Math.random() * 1000)}`,
        email: user?.email || 'guest@example.com',
        color: generateUserColor(user?.id || 'guest'),
        id: user?.id || `guest-${Date.now()}`,
        avatar: user?.email?.charAt(0).toUpperCase() || 'G',
        role: user?.user_metadata?.role || 'Developer',
        joinedAt: new Date().toISOString(),
        isAuthenticated: !!user
      };

      providerRef.current.awareness.setLocalStateField('user', userInfo);

      // Enhanced awareness changes handling (other users joining/leaving, cursor movements)
      providerRef.current.awareness.on('change', () => {
        const states = providerRef.current?.awareness.getStates();
        if (states) {
          const newCollaborators = new Map<string, CollaboratorInfo>();
          
          states.forEach((state, clientId) => {
            if (state.user && clientId !== providerRef.current?.awareness.clientID) {
              const collaborator: CollaboratorInfo = {
                id: state.user.id,
                name: state.user.name,
                email: state.user.email,
                color: state.user.color,
                lastSeen: Date.now()
              };

              // Add enhanced cursor and selection info if available
              if (state.cursor) {
                collaborator.cursor = state.cursor;
              }
              if (state.selection) {
                collaborator.selection = state.selection;
              }

              newCollaborators.set(clientId.toString(), collaborator);
            }
          });
          
          setCollaborators(newCollaborators);
          console.log(`👥 Collaborators updated: ${newCollaborators.size} active users`);
        }
      });

      // Enhanced cursor position tracking for awareness
      editor.onDidChangeCursorPosition((e: any) => {
        if (providerRef.current) {
          providerRef.current.awareness.setLocalStateField('cursor', {
            line: e.position.lineNumber,
            column: e.position.column,
            timestamp: Date.now()
          });
        }
      });

      // Enhanced selection tracking for awareness
      editor.onDidChangeCursorSelection((e: any) => {
        if (providerRef.current) {
          providerRef.current.awareness.setLocalStateField('selection', {
            startLine: e.selection.startLineNumber,
            startColumn: e.selection.startColumn,
            endLine: e.selection.endLineNumber,
            endColumn: e.selection.endColumn,
            timestamp: Date.now()
          });
        }
      });

      // Enhanced document change tracking
      ydoc.on('update', (update: Uint8Array) => {
        console.log('📝 Document updated, size:', update.length, 'bytes');
      });

      console.log(`✅ Enhanced collaborative editing initialized for project: ${projectId}`);
      console.log(`🌐 WebSocket URL: ${import.meta.env.VITE_COLLABORATION_WS_URL || 'wss://demos.yjs.dev'}`);
      console.log(`🏠 Room: olive-project-${projectId}`);
      console.log(`💾 Persistence: olive-editor-${projectId}`);
      
    } catch (error) {
      console.error('❌ Failed to setup enhanced collaboration:', error);
      setCollaborationEnabled(false);
      setConnectionStatus('disconnected');
    }
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Configure enhanced Monaco Editor themes
    monaco.editor.defineTheme('olive-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'variable', foreground: '9CDCFE' },
        { token: 'type', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': '#1a1a1a',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#2a2a2a',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41',
        'editorCursor.foreground': '#ffffff',
        'editorWhitespace.foreground': '#404040',
      }
    });

    monaco.editor.defineTheme('olive-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '008000', fontStyle: 'italic' },
        { token: 'keyword', foreground: '0000FF' },
        { token: 'string', foreground: 'A31515' },
        { token: 'number', foreground: '098658' },
        { token: 'function', foreground: '795E26' },
        { token: 'variable', foreground: '001080' },
        { token: 'type', foreground: '267f99' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#000000',
        'editor.lineHighlightBackground': '#f0f0f0',
        'editor.selectionBackground': '#ADD6FF',
        'editor.inactiveSelectionBackground': '#E5EBF1',
        'editorCursor.foreground': '#000000',
        'editorWhitespace.foreground': '#d0d0d0',
      }
    });

    // Set theme
    monaco.editor.setTheme(isDarkMode ? 'olive-dark' : 'olive-light');

    // Set initial content
    const initialContent = fileContents[activeFile] || '// Start coding...';
    editor.setValue(initialContent);

    // Setup enhanced collaboration
    setupEnhancedCollaboration(editor, monaco);

    // Handle content changes with enhanced tracking
    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      if (onCodeChange) {
        onCodeChange(value);
      }
      
      // Update file contents
      setFileContents(prev => ({
        ...prev,
        [activeFile]: value
      }));
    });

    // Add enhanced keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log('💾 Auto-save triggered');
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRunCode) {
        const code = editor.getValue();
        const language = getLanguageFromFile(activeFile);
        onRunCode(code, language);
      }
    });

    // Enhanced collaboration shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyC, () => {
      setShowCollaborators(!showCollaborators);
    });
  };

  // Update editor content when active file changes with enhanced handling
  useEffect(() => {
    if (editorRef.current && collaborationEnabled) {
      // Get new ytext for the active file
      const newYtext = ydoc.getText(`file-${activeFile}`);
      
      // Destroy existing binding
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      
      // Create new binding for the active file
      if (providerRef.current && monacoRef.current) {
        bindingRef.current = new MonacoBinding(
          newYtext,
          editorRef.current.getModel(),
          new Set([editorRef.current]),
          providerRef.current.awareness
        );
      }
      
      // Set content if not collaborative or if ytext is empty
      const content = fileContents[activeFile] || '// Start coding...';
      if (newYtext.length === 0) {
        newYtext.insert(0, content);
      }
    } else if (editorRef.current) {
      // Non-collaborative mode
      const content = fileContents[activeFile] || '// Start coding...';
      const currentContent = editorRef.current.getValue();
      
      if (currentContent !== content) {
        editorRef.current.setValue(content);
      }
    }
  }, [activeFile, collaborationEnabled]);

  // Update theme when dark mode changes
  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(isDarkMode ? 'olive-dark' : 'olive-light');
    }
  }, [isDarkMode]);

  // Enhanced cleanup on unmount
  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (persistenceRef.current) {
        persistenceRef.current.destroy();
      }
    };
  }, []);

  // Expose enhanced editor methods via ref
  useImperativeHandle(ref, () => ({
    getValue: () => editorRef.current?.getValue() || '',
    setValue: (value: string) => editorRef.current?.setValue(value),
    focus: () => editorRef.current?.focus()
  }));

  const handleRunCode = () => {
    if (editorRef.current && onRunCode) {
      const code = editorRef.current.getValue();
      const language = getLanguageFromFile(activeFile);
      onRunCode(code, language);
    }
  };

  const handleSaveFile = () => {
    if (editorRef.current) {
      const content = editorRef.current.getValue();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = activeFile;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const toggleCollaboration = () => {
    setCollaborationEnabled(!collaborationEnabled);
    if (editorRef.current && monacoRef.current) {
      if (!collaborationEnabled) {
        setupEnhancedCollaboration(editorRef.current, monacoRef.current);
      } else {
        // Cleanup collaboration
        if (bindingRef.current) {
          bindingRef.current.destroy();
          bindingRef.current = null;
        }
        if (providerRef.current) {
          providerRef.current.destroy();
          providerRef.current = null;
        }
        setIsConnected(false);
        setCollaborators(new Map());
        setConnectionStatus('disconnected');
      }
    }
  };

  const themeClasses = isDarkMode ? {
    bg: 'bg-gray-900',
    border: 'border-gray-700',
    text: 'text-gray-100',
    textSecondary: 'text-gray-400',
    surface: 'bg-gray-800',
    surfaceHover: 'hover:bg-gray-700'
  } : {
    bg: 'bg-white',
    border: 'border-gray-200',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600',
    surface: 'bg-gray-50',
    surfaceHover: 'hover:bg-gray-100'
  };

  const collaboratorArray = Array.from(collaborators.values());

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'disconnected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Connected';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`h-full flex flex-col ${themeClasses.bg}`}>
      {/* Enhanced Editor Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${themeClasses.border} ${themeClasses.surface}`}>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRunCode}
            className={`flex items-center space-x-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 text-sm font-medium`}
            title="Run Code (Ctrl+Enter)"
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
          
          <button
            onClick={handleSaveFile}
            className={`flex items-center space-x-2 px-3 py-1.5 ${themeClasses.surface} ${themeClasses.surfaceHover} ${themeClasses.text} border ${themeClasses.border} rounded-lg transition-all duration-200 text-sm font-medium`}
            title="Save File (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>

        {/* Enhanced Collaboration Status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleCollaboration}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200 text-sm font-medium ${
                collaborationEnabled
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : `${themeClasses.surface} ${themeClasses.surfaceHover} ${themeClasses.text} border ${themeClasses.border}`
              }`}
              title={collaborationEnabled ? 'Disable Collaboration' : 'Enable Collaboration'}
            >
              {collaborationEnabled ? (
                <>
                  <Users className="w-4 h-4" />
                  <span>Collaborative</span>
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Solo</span>
                </>
              )}
            </button>

            {collaborationEnabled && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1">
                  {connectionStatus === 'connected' ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                  ) : connectionStatus === 'connecting' ? (
                    <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-xs ${getConnectionStatusColor()}`}>
                    {getConnectionStatusText()}
                  </span>
                </div>
                
                {collaboratorArray.length > 0 && (
                  <div className="relative">
                    <button
                      onClick={() => setShowCollaborators(!showCollaborators)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded ${themeClasses.surface} ${themeClasses.surfaceHover} transition-all duration-200`}
                      title="Show Collaborators (Ctrl+Shift+C)"
                    >
                      <div className="flex -space-x-1">
                        {collaboratorArray.slice(0, 3).map((collaborator, index) => (
                          <div
                            key={collaborator.id}
                            className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                            style={{ backgroundColor: collaborator.color, zIndex: 10 - index }}
                            title={collaborator.name}
                          >
                            {collaborator.name.charAt(0).toUpperCase()}
                          </div>
                        ))}
                        {collaboratorArray.length > 3 && (
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-xs font-medium text-white">
                            +{collaboratorArray.length - 3}
                          </div>
                        )}
                      </div>
                      <Eye className="w-3 h-3" />
                    </button>

                    {/* Enhanced Collaborators Dropdown */}
                    {showCollaborators && (
                      <div className={`absolute top-full right-0 mt-2 w-80 ${themeClasses.surface} border ${themeClasses.border} rounded-lg shadow-lg z-50`}>
                        <div className="p-4">
                          <h3 className={`text-sm font-medium ${themeClasses.text} mb-3`}>
                            Active Collaborators ({collaboratorArray.length})
                          </h3>
                          <div className="space-y-3">
                            {collaboratorArray.map((collaborator) => (
                              <div key={collaborator.id} className="flex items-center space-x-3">
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white relative"
                                  style={{ backgroundColor: collaborator.color }}
                                >
                                  {collaborator.name.charAt(0).toUpperCase()}
                                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-medium ${themeClasses.text} truncate`}>
                                    {collaborator.name}
                                  </p>
                                  <p className={`text-xs ${themeClasses.textSecondary} truncate`}>
                                    {collaborator.email}
                                  </p>
                                  {collaborator.cursor && (
                                    <p className={`text-xs ${themeClasses.textSecondary}`}>
                                      Line {collaborator.cursor.line}, Col {collaborator.cursor.column}
                                    </p>
                                  )}
                                </div>
                                <UserCheck className="w-4 h-4 text-green-500" />
                              </div>
                            ))}
                          </div>
                          
                          {/* Enhanced collaboration info */}
                          <div className={`mt-4 pt-3 border-t ${themeClasses.border}`}>
                            <div className="flex items-center justify-between text-xs">
                              <span className={themeClasses.textSecondary}>Project: {projectId}</span>
                              <span className={`${getConnectionStatusColor()}`}>
                                {getConnectionStatusText()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={`text-xs ${themeClasses.textSecondary} flex items-center space-x-2`}>
            <span>{getLanguageFromFile(activeFile).toUpperCase()}</span>
            {collaborationEnabled && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                Room: {projectId}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={getLanguageFromFile(activeFile)}
          theme={isDarkMode ? 'olive-dark' : 'olive-light'}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
            fontLigatures: true,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: true },
            wordWrap: 'on',
            tabSize: 2,
            insertSpaces: true,
            detectIndentation: true,
            folding: true,
            foldingStrategy: 'indentation',
            showFoldingControls: 'always',
            unfoldOnClickAfterEndOfLine: false,
            contextmenu: true,
            mouseWheelZoom: true,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: true,
            renderLineHighlight: 'all',
            selectOnLineNumbers: true,
            glyphMargin: true,
            fixedOverflowWidgets: true,
            overviewRulerLanes: 3,
            overviewRulerBorder: false,
            rulers: [80, 120],
            bracketPairColorization: {
              enabled: true
            },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            suggest: {
              showKeywords: true,
              showSnippets: true,
              showFunctions: true,
              showConstructors: true,
              showFields: true,
              showVariables: true,
              showClasses: true,
              showStructs: true,
              showInterfaces: true,
              showModules: true,
              showProperties: true,
              showEvents: true,
              showOperators: true,
              showUnits: true,
              showValues: true,
              showConstants: true,
              showEnums: true,
              showEnumMembers: true,
              showColors: true,
              showFiles: true,
              showReferences: true,
              showFolders: true,
              showTypeParameters: true,
              showUsers: true,
              showIssues: true
            },
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false
            },
            parameterHints: {
              enabled: true,
              cycle: true
            },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoSurround: 'languageDefined',
            formatOnPaste: true,
            formatOnType: true,
            // Enhanced collaboration features
            renderValidationDecorations: 'on',
            scrollbar: {
              useShadows: false,
              verticalHasArrows: true,
              horizontalHasArrows: true,
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 17,
              horizontalScrollbarSize: 17
            }
          }}
        />
      </div>

      {/* Enhanced Status Bar */}
      <div className={`px-4 py-2 border-t ${themeClasses.border} ${themeClasses.surface} flex items-center justify-between text-xs ${themeClasses.textSecondary}`}>
        <div className="flex items-center space-x-4">
          <span>Line 1, Column 1</span>
          <span>UTF-8</span>
          <span>{getLanguageFromFile(activeFile)}</span>
          {collaborationEnabled && (
            <span className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400' : 
                connectionStatus === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <span>Yjs {getConnectionStatusText()}</span>
            </span>
          )}
          {user && (
            <span className="flex items-center space-x-1">
              <UserCheck className="w-3 h-3" />
              <span>{user.email?.split('@')[0]}</span>
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <span>Spaces: 2</span>
          <span>Auto Save: On</span>
          {collaborationEnabled && collaboratorArray.length > 0 && (
            <span>{collaboratorArray.length} collaborator{collaboratorArray.length !== 1 ? 's' : ''}</span>
          )}
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
            Room: {projectId}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
            Enhanced Yjs
          </span>
        </div>
      </div>

      {/* Click outside to close collaborators dropdown */}
      {showCollaborators && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowCollaborators(false)}
        />
      )}
    </div>
  );
});

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;