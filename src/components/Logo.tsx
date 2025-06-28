import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'white' | 'dark';
  className?: string;
  onClick?: () => void;
  clickable?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'default', 
  className = '', 
  onClick,
  clickable = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const getColors = () => {
    switch (variant) {
      case 'white':
        return {
          bg: 'bg-white/10 backdrop-blur-sm',
          hover: 'hover:bg-white/20',
          shadow: ''
        };
      case 'dark':
        return {
          bg: 'bg-gray-900',
          hover: 'hover:bg-gray-800',
          shadow: 'shadow-lg shadow-gray-900/25'
        };
      default:
        return {
          bg: 'bg-transparent',
          hover: 'hover:scale-105',
          shadow: ''
        };
    }
  };

  const colors = getColors();
  const Component = clickable ? 'button' : 'div';

  const svgSize = size === 'sm' ? 24 : size === 'md' ? 32 : size === 'lg' ? 48 : 64;

  return (
    <Component
      onClick={onClick}
      className={`${sizeClasses[size]} ${colors.bg} rounded-full flex items-center justify-center transition-all duration-300 ${colors.shadow} ${
        clickable ? `cursor-pointer ${colors.hover} transform` : ''
      } ${className}`}
      {...(clickable && { type: 'button' })}
    >
      {/* Olive.ai Logo - Circular design with gradient and cut-out */}
      <svg 
        width={svgSize} 
        height={svgSize} 
        viewBox="0 0 100 100" 
        fill="none"
      >
        <defs>
          {/* Green gradient matching the reference image */}
          <linearGradient id="oliveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="30%" stopColor="#16a34a" />
            <stop offset="70%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>
          
          {/* Radial gradient for depth */}
          <radialGradient id="oliveRadial" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#166534" />
          </radialGradient>
        </defs>
        
        {/* Main circular shape with cut-out */}
        <path
          d="M50 10 
             A40 40 0 1 1 50 90
             A40 40 0 1 1 50 10
             M50 25
             A25 25 0 1 0 50 75
             A25 25 0 1 0 50 25"
          fill="url(#oliveRadial)"
          fillRule="evenodd"
        />
        
        {/* Additional depth with subtle shadow effect */}
        <path
          d="M50 12 
             A38 38 0 0 1 85 47
             A38 38 0 0 1 50 85
             A38 38 0 0 1 50 12
             M50 27
             A23 23 0 0 0 50 73
             A23 23 0 0 0 50 27"
          fill="url(#oliveGradient)"
          fillRule="evenodd"
          opacity="0.9"
        />
        
        {/* Highlight for 3D effect */}
        <ellipse
          cx="42"
          cy="35"
          rx="8"
          ry="12"
          fill="rgba(255,255,255,0.15)"
          transform="rotate(-25 42 35)"
        />
      </svg>
    </Component>
  );
};

export default Logo;