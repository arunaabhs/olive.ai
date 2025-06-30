import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Globe, Share, ArrowLeft, UserPlus, Settings, AlertCircle, RefreshCw } from 'lucide-react';
import Dashboard from './Dashboard';
import { useAuth } from '../contexts/AuthContext';

const ProjectRoom: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(true);
  const [projectInfo, setProjectInfo] = useState<any>(null);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [showWelcome, setShowWelcome] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWebContainer, setIsWebContainer] = useState(false);

  useEffect(() => {
    // Check if running in WebContainer environment
    const isWebContainerEnv = window.location.hostname.includes('webcontainer') || 
                              window.location.hostname.includes('stackblitz') ||
                              window.location.hostname.includes('bolt.new');
    setIsWebContainer(isWebContainerEnv);

    if (!projectId) {
      navigate('/dashboard');
      return;
    }

    // Handle WebContainer environment differently
    if (isWebContainerEnv) {
      handleWebContainerProject();
    } else {
      joinProject();
    }
  }, [projectId, navigate, user]);

  const handleWebContainerProject = async () => {
    setIsJoining(true);
    setError(null);
    
    try {
      // In WebContainer, create a local project session
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProjectInfo({
        id: projectId,
        name: `Collaborative Project ${projectId?.slice(-8)}`,
        owner: user?.email?.split('@')[0] || 'Project Owner',
        createdAt: new Date(),
        isPublic: true,
        isWebContainer: true
      });

      // Create mock collaborators for demo
      setCollaborators([
        {
          id: '1',
          name: user?.email?.split('@')[0] || 'You',
          email: user?.email || 'you@example.com',
          isOwner: true,
          isOnline: true,
          cursor: { line: 0, column: 0 },
          color: '#3B82F6'
        },
        {
          id: '2',
          name: 'Demo Collaborator',
          email: 'collaborator@example.com',
          isOwner: false,
          isOnline: true,
          cursor: { line: 5, column: 12 },
          color: '#10B981'
        }
      ]);

      setIsJoining(false);
      setTimeout(() => setShowWelcome(false), 2000);
      
    } catch (err) {
      console.error('Error creating WebContainer project:', err);
      setError('Failed to create project session in WebContainer environment');
      setIsJoining(false);
    }
  };

  const joinProject = async () => {
    setIsJoining(true);
    setError(null);
    
    try {
      // Simulate API call to join project
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock project data
      setProjectInfo({
        id: projectId,
        name: `Collaborative Project ${projectId?.slice(-8)}`,
        owner: 'Project Owner',
        createdAt: new Date(),
        isPublic: true
      });

      // Mock collaborators
      setCollaborators([
        {
          id: '1',
          name: user?.email?.split('@')[0] || 'You',
          email: user?.email || 'guest@example.com',
          isOwner: false,
          isOnline: true,
          cursor: { line: 0, column: 0 },
          color: '#3B82F6'
        },
        {
          id: '2',
          name: 'Collaborator',
          email: 'friend@example.com',
          isOwner: true,
          isOnline: Math.random() > 0.3,
          cursor: { line: 5, column: 12 },
          color: '#10B981'
        }
      ]);

      setIsJoining(false);
      setTimeout(() => setShowWelcome(false), 3000);
      
    } catch (err) {
      console.error('Error joining project:', err);
      setError('Failed to join project. The project may not exist or may be private.');
      setIsJoining(false);
    }
  };

  const handleShareProject = () => {
    if (isWebContainer) {
      // In WebContainer, show a different sharing approach
      const currentUrl = window.location.href;
      navigator.clipboard.writeText(currentUrl).then(() => {
        alert('Current URL copied! Note: WebContainer links are temporary and only work in this session.');
      }).catch(() => {
        alert(`WebContainer URL: ${currentUrl}\n\nNote: This link is temporary and only works in this session.`);
      });
    } else {
      const shareUrl = `${window.location.origin}/project/${projectId}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Project link copied to clipboard!');
      }).catch(() => {
        alert(`Share this project: ${shareUrl}`);
      });
    }
  };

  const handleLeaveProject = () => {
    navigate('/dashboard');
  };

  const handleRetry = () => {
    setError(null);
    if (isWebContainer) {
      handleWebContainerProject();
    } else {
      joinProject();
    }
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-light text-gray-800 mb-4">
            Could not find project
          </h1>
          
          <p className="text-gray-600 font-light mb-6">
            {error}
          </p>

          {isWebContainer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">WebContainer Environment Detected</h3>
              <p className="text-sm text-blue-700">
                You're running in a WebContainer environment. Project sharing works differently here:
              </p>
              <ul className="text-sm text-blue-700 mt-2 text-left">
                <li>• Links are temporary and session-specific</li>
                <li>• Real-time collaboration works within the same session</li>
                <li>• For production deployment, use a regular hosting service</li>
              </ul>
            </div>
          )}
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleRetry}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-light transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            
            <button
              onClick={handleLeaveProject}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full font-light transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Project ID: {projectId}</p>
            {isWebContainer && (
              <p className="mt-1">Environment: WebContainer (Development)</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isJoining) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Globe className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-light text-gray-800 mb-4">
            {isWebContainer ? 'Creating Project Session' : 'Joining Project Room'}
          </h2>
          
          <p className="text-gray-600 font-light mb-6">
            {isWebContainer 
              ? 'Setting up collaborative workspace in WebContainer...'
              : 'Connecting to collaborative workspace...'
            }
          </p>
          
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <p className="text-sm text-gray-500 mt-4 font-light">
            Project ID: {projectId}
          </p>
          {isWebContainer && (
            <p className="text-xs text-blue-600 mt-2">
              WebContainer Environment
            </p>
          )}
        </div>
      </div>
    );
  }

  if (showWelcome && projectInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-light text-gray-800 mb-4">
            Welcome to {projectInfo.name}
          </h1>
          
          <p className="text-gray-600 font-light mb-8">
            {isWebContainer 
              ? 'You\'ve successfully created a collaborative workspace in WebContainer. Start coding together!'
              : 'You\'ve successfully joined the collaborative workspace. Start coding together in real-time!'
            }
          </p>

          {isWebContainer && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-blue-800 mb-2">WebContainer Mode</h3>
              <p className="text-sm text-blue-700">
                Running in development environment. Collaboration features are simulated for demo purposes.
              </p>
            </div>
          )}
          
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 mb-8">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Active Collaborators</h3>
            <div className="space-y-3">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: collaborator.color }}
                    >
                      {collaborator.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{collaborator.name}</p>
                      <p className="text-xs text-gray-500">{collaborator.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {collaborator.isOwner && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Owner</span>
                    )}
                    <div className={`w-2 h-2 rounded-full ${collaborator.isOnline ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handleShareProject}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-light transition-all duration-200"
            >
              <Share className="w-4 h-4" />
              <span>{isWebContainer ? 'Copy URL' : 'Share Project'}</span>
            </button>
            
            <button
              onClick={() => setShowWelcome(false)}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-light transition-all duration-200"
            >
              <span>Start Coding</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render the main dashboard with project context
  return (
    <div className="h-screen flex flex-col">
      {/* Collaboration Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5" />
            <span className="font-medium">{projectInfo?.name}</span>
            {isWebContainer && (
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">WebContainer</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">{collaborators.filter(c => c.isOnline).length} online</span>
          </div>
          
          <div className="flex items-center -space-x-2">
            {collaborators.slice(0, 3).map((collaborator) => (
              <div
                key={collaborator.id}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                style={{ backgroundColor: collaborator.color }}
                title={`${collaborator.name} ${collaborator.isOnline ? '(online)' : '(offline)'}`}
              >
                {collaborator.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {collaborators.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
                +{collaborators.length - 3}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShareProject}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all duration-200"
          >
            <Share className="w-4 h-4" />
            <span className="text-sm">{isWebContainer ? 'Copy URL' : 'Share'}</span>
          </button>
          
          <button
            onClick={handleLeaveProject}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Leave</span>
          </button>
        </div>
      </div>
      
      {/* Dashboard with project context */}
      <div className="flex-1">
        <Dashboard projectId={projectId} collaborators={collaborators} />
      </div>
    </div>
  );
};

export default ProjectRoom;