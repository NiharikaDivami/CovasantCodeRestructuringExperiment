import React from 'react';
import { PersonaType } from '../../types';

interface PersonaIconProps {
  persona: PersonaType;
  className?: string;
  size?: number;
  isActive?: boolean;
}

export const PersonaIcon: React.FC<PersonaIconProps> = ({ 
  persona, 
  className = "", 
  size = 20,
  isActive = false
}) => {
  const getPersonaIcon = () => {
    switch (persona) {
      case "analyst":
        return <AnalystIcon size={size} className={className} isActive={isActive} />;
      case "vendor":
        return <VendorIcon size={size} className={className} isActive={isActive} />;
      case "manager":
        return <ManagerIcon size={size} className={className} isActive={isActive} />;
    }
  };

  return getPersonaIcon();
};

// Individual persona icon components
export const AnalystIcon: React.FC<{ size: number; className: string; isActive: boolean }> = ({ 
  size, 
  className, 
  isActive 
}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
    <defs>
      <linearGradient id="analystGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isActive ? "#3b82f6" : "#6b7280"} />
        <stop offset="100%" stopColor={isActive ? "#1d4ed8" : "#4b5563"} />
      </linearGradient>
    </defs>
    
    {/* Analyst with magnifying glass/analysis symbol */}
    <circle cx="10" cy="6" r="3" fill="url(#analystGradient)" />
    <path 
      d="M4 18C4 14.69 6.69 12 10 12S16 14.69 16 18" 
      stroke="url(#analystGradient)" 
      strokeWidth="2" 
      fill="none"
    />
    
    {/* Analysis/magnifying glass overlay */}
    <circle cx="13" cy="7" r="2" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="14.5 8.5L16 10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const VendorIcon: React.FC<{ size: number; className: string; isActive: boolean }> = ({ 
  size, 
  className, 
  isActive 
}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
    <defs>
      <linearGradient id="vendorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isActive ? "#10b981" : "#6b7280"} />
        <stop offset="100%" stopColor={isActive ? "#059669" : "#4b5563"} />
      </linearGradient>
    </defs>
    
    {/* Vendor with briefcase/business symbol */}
    <circle cx="10" cy="6" r="3" fill="url(#vendorGradient)" />
    <path 
      d="M4 18C4 14.69 6.69 12 10 12S16 14.69 16 18" 
      stroke="url(#vendorGradient)" 
      strokeWidth="2" 
      fill="none"
    />
    
    {/* Briefcase overlay */}
    <rect x="12" y="5" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="13 5V4.5C13 4.22 13.22 4 13.5 4H14.5C14.78 4 15 4.22 15 4.5V5" 
          stroke="currentColor" strokeWidth="1" fill="none" />
  </svg>
);

export const ManagerIcon: React.FC<{ size: number; className: string; isActive: boolean }> = ({ 
  size, 
  className, 
  isActive 
}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
    <defs>
      <linearGradient id="managerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={isActive ? "#8b5cf6" : "#6b7280"} />
        <stop offset="100%" stopColor={isActive ? "#7c3aed" : "#4b5563"} />
      </linearGradient>
    </defs>
    
    {/* Manager with crown/leadership symbol */}
    <circle cx="10" cy="6" r="3" fill="url(#managerGradient)" />
    <path 
      d="M4 18C4 14.69 6.69 12 10 12S16 14.69 16 18" 
      stroke="url(#managerGradient)" 
      strokeWidth="2" 
      fill="none"
    />
    
    {/* Crown overlay */}
    <path 
      d="M7 3L8 5L10 3L12 5L13 3L12 7H8L7 3Z" 
      stroke="currentColor" 
      strokeWidth="1" 
      fill="none"
    />
  </svg>
);