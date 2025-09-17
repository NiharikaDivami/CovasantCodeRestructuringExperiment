import React from 'react';

interface VCMAgentIconProps {
  className?: string;
  width?: number;
  height?: number;
  isActive?: boolean;
}

const VCMAgentIcon: React.FC<VCMAgentIconProps> = ({ 
  className = "", 
  width = 24, 
  height = 24,
  isActive = false
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* AI/Agent brain representation */}
      <defs>
        <linearGradient id="agentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isActive ? "#3b82f6" : "#6b7280"} />
          <stop offset="100%" stopColor={isActive ? "#1d4ed8" : "#4b5563"} />
        </linearGradient>
      </defs>
      
      {/* Main brain/processor shape */}
      <path
        d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 18.1 8.9 19 10 19H14C15.1 19 16 18.1 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z"
        fill="url(#agentGradient)"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      
      {/* Processing nodes/circuits */}
      <circle cx="10" cy="8" r="1" fill="white" opacity="0.8" />
      <circle cx="14" cy="8" r="1" fill="white" opacity="0.8" />
      <circle cx="12" cy="11" r="1" fill="white" opacity="0.8" />
      
      {/* Connection lines */}
      <path
        d="M10 8L12 11L14 8"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />
      
      {/* Activity indicator when active */}
      {isActive && (
        <>
          <circle cx="12" cy="20" r="2" fill="#3b82f6" opacity="0.6">
            <animate attributeName="r" values="1;3;1" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="12" cy="20" r="1" fill="#3b82f6" />
        </>
      )}
    </svg>
  );
};

export default VCMAgentIcon;