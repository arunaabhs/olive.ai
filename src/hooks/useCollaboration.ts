import { useState, useCallback, useEffect } from 'react';

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  color: string;
  isOnline: boolean;
  cursor?: { line: number; column: number };
  isOwner?: boolean;
}

export interface CollaborationSettings {
  isEnabled: boolean;
  allowAnonymous: boolean;
  maxCollaborators: number;
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canShare: boolean;
  };
}

export const useCollaboration = (projectId: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [settings, setSettings] = useState<CollaborationSettings>({
    isEnabled: true,
    allowAnonymous: true,
    maxCollaborators: 10,
    permissions: {
      canEdit: true,
      canComment: true,
      canShare: true
    }
  });
  const [isConnected, setIsConnected] = useState(false);

  const shareProject = useCallback(() => {
    const shareUrl = `${window.location.origin}/project/${projectId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      // Show success notification
      console.log('Project link copied to clipboard');
    }).catch(() => {
      // Fallback: show the URL in a prompt
      prompt('Copy this link to share your project:', shareUrl);
    });
  }, [projectId]);

  const inviteCollaborator = useCallback((email: string, permissions?: Partial<CollaborationSettings['permissions']>) => {
    // In a real implementation, this would send an invitation email
    console.log(`Inviting ${email} to collaborate on project ${projectId}`);
    
    // Simulate adding a new collaborator
    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      isOnline: false,
      isOwner: false
    };
    
    setCollaborators(prev => [...prev, newCollaborator]);
  }, [projectId]);

  const removeCollaborator = useCallback((collaboratorId: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
  }, []);

  const updateCollaboratorPermissions = useCallback((collaboratorId: string, permissions: Partial<CollaborationSettings['permissions']>) => {
    // In a real implementation, this would update permissions on the server
    console.log(`Updating permissions for collaborator ${collaboratorId}:`, permissions);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<CollaborationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const exportProject = useCallback(() => {
    // Create a downloadable project archive
    const projectData = {
      id: projectId,
      collaborators,
      settings,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `olive-project-${projectId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [projectId, collaborators, settings]);

  const startLiveShare = useCallback(() => {
    setIsConnected(true);
    console.log('Starting live share session...');
    // In a real implementation, this would establish WebSocket connections
  }, []);

  const stopLiveShare = useCallback(() => {
    setIsConnected(false);
    console.log('Stopping live share session...');
  }, []);

  // Simulate real-time collaborator updates
  useEffect(() => {
    if (settings.isEnabled) {
      const interval = setInterval(() => {
        setCollaborators(prev => prev.map(collaborator => ({
          ...collaborator,
          isOnline: Math.random() > 0.3, // Randomly simulate online/offline status
          cursor: {
            line: Math.floor(Math.random() * 50),
            column: Math.floor(Math.random() * 80)
          }
        })));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [settings.isEnabled]);

  return {
    collaborators,
    settings,
    isConnected,
    shareProject,
    inviteCollaborator,
    removeCollaborator,
    updateCollaboratorPermissions,
    updateSettings,
    exportProject,
    startLiveShare,
    stopLiveShare
  };
};