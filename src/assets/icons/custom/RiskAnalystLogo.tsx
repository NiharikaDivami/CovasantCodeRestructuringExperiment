import React from 'react';

interface RiskAnalystLogoProps {
  className?: string;
  width?: number;
  height?: number;
}

const RiskAnalystLogo: React.FC<RiskAnalystLogoProps> = ({ 
  className = "", 
  width = 32, 
  height = 32 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Modern shield-like design representing security and analysis */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#374151" />
        </linearGradient>
      </defs>
      
      {/* Main shield shape */}
      <path
        d="M16 2L6 6V12.5C6 19.8 10.3 26.7 16 28C21.7 26.7 26 19.8 26 12.5V6L16 2Z"
        fill="url(#logoGradient)"
        stroke="currentColor"
        strokeWidth="1"
      />
      
      {/* Inner analysis chart elements */}
      <rect x="10" y="14" width="2" height="8" fill="currentColor" opacity="0.7" />
      <rect x="13" y="11" width="2" height="11" fill="currentColor" opacity="0.8" />
      <rect x="16" y="9" width="2" height="13" fill="currentColor" opacity="0.9" />
      <rect x="19" y="12" width="2" height="10" fill="currentColor" opacity="0.8" />
      
      {/* Checkmark for approval/completion */}
      <path
        d="M12 15L14.5 17.5L20 12"
        stroke="#22c55e"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default RiskAnalystLogo;