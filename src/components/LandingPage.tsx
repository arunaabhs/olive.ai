import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, User, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import Logo from './Logo';

const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  
  const { user, signOut, isLoading } = useAuth();

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleAccountClick = async () => {
    if (user) {
      await signOut();
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogoClick = () => {
    // Already on home page, just scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0f7f0' }}>
        <div className="text-center">
          <Logo size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f7f0' }}>
      {/* Navigation */}
      <nav className="px-8 py-6 flex items-center justify-between max-w-7xl mx-auto">
        <button 
          onClick={handleLogoClick}
          className="flex items-center space-x-3 group"
        >
          <Logo size="md" clickable onClick={handleLogoClick} />
          <span className="text-2xl font-light text-gray-800 group-hover:text-gray-900 transition-colors">
            Olive
          </span>
        </button>
        <div className="flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-gray-800 font-light transition-colors">
            About
          </a>
          <Link
            to="/dashboard"
            className="text-gray-600 hover:text-gray-800 font-light transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={handleAccountClick}
            className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-700 border border-gray-200/50 px-4 py-2 rounded-full font-light transition-all duration-200"
          >
            {user ? (
              <>
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden sm:inline">{user.email}</span>
                <LogOut className="w-4 h-4" />
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span>Account</span>
              </>
            )}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-8 py-20 max-w-6xl mx-auto text-center">
        {/* Backed by text */}
        <div className="mb-16">
          <p className="text-gray-500 text-sm font-light">
            Powered by <span className="font-medium">Supabase</span>
          </p>
        </div>

        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-6xl md:text-7xl font-extralight text-gray-800 mb-8 leading-tight tracking-tight">
            Code with elegance in any<br />browser.
          </h1>
          
          <p className="text-xl font-light text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            No downloads. No installations. Development rethought from the ground up for<br />the modern web.
          </p>

          {/* Email Input and Authentication Options */}
          <div className="max-w-4xl mx-auto">
            {/* Primary Action Row */}
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="flex-1 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200/50 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300/50 focus:border-gray-300 font-light shadow-sm transition-all"
                />
              </div>
              <Link
                to="/dashboard"
                className="bg-white/60 backdrop-blur-sm hover:bg-white/80 text-gray-700 border border-gray-200/50 px-8 py-4 rounded-full font-light transition-all duration-200 flex items-center space-x-2 whitespace-nowrap shadow-sm"
              >
                <span>Start Coding</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Authentication Options */}
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-1 text-gray-500 text-sm font-light">
                <span>Already have an account?</span>
              </div>
              
              <button 
                onClick={() => handleAuthClick('signin')}
                className="flex items-center space-x-2 bg-white/40 backdrop-blur-sm hover:bg-white/60 text-gray-700 border border-gray-200/30 px-6 py-3 rounded-full font-light transition-all duration-200 shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>

              <div className="w-px h-6 bg-gray-300"></div>

              <button 
                onClick={() => handleAuthClick('signup')}
                className="flex items-center space-x-2 bg-green-600/10 backdrop-blur-sm hover:bg-green-600/20 text-green-700 border border-green-200/50 px-6 py-3 rounded-full font-light transition-all duration-200 shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>

              <div className="flex items-center space-x-1 text-gray-500 text-sm font-light">
                <span>New to Olive?</span>
              </div>
            </div>

            {/* Alternative Quick Access */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <p className="text-gray-500 text-sm font-light mb-4">
                Or continue without an account
              </p>
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 font-light transition-colors underline decoration-dotted underline-offset-4"
              >
                <span>Try Olive Editor</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* User Status */}
            {user && (
              <div className="mt-8 p-4 bg-green-50/60 backdrop-blur-sm rounded-xl border border-green-200/50">
                <p className="text-green-700 font-light">
                  ✅ Signed in as <strong>{user.email}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-32">
          <p className="text-gray-400 text-sm font-light">Scroll to explore</p>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
};

export default LandingPage;