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
