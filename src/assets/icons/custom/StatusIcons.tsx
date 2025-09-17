import React from 'react';
import { TestScriptStatus } from '../../types';

interface StatusIconProps {
  status: TestScriptStatus;
  className?: string;
  size?: number;
}

export const StatusIcon: React.FC<StatusIconProps> = ({ 
  status, 
  className = "", 
  size = 16 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "COQ Requested":
        return <COQRequestedIcon size={size} className={className} />;
      case "COQ Responded":
        return <COQRespondedIcon size={size} className={className} />;
      case "Action Item Issued":
        return <ActionItemIssuedIcon size={size} className={className} />;
      case "Action Item Responded":
        return <ActionItemRespondedIcon size={size} className={className} />;
      case "Approved":
        return <ApprovedIcon size={size} className={className} />;
      default:
        return <DefaultStatusIcon size={size} className={className} />;
    }
  };

  return getStatusIcon();
};

// Individual status icon components
export const COQRequestedIcon: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1"/>
    <path d="M6 8L7 9L10 6" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const COQRespondedIcon: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/>
    <path d="M5 8H11M8 5L11 8L8 11" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ActionItemIssuedIcon: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6" fill="#fee2e2" stroke="#ef4444" strokeWidth="1"/>
    <path d="M8 4V8M8 10H8.01" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ActionItemRespondedIcon: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6" fill="#f3e8ff" stroke="#8b5cf6" strokeWidth="1"/>
    <path d="M11 5L8 8L6 6" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ApprovedIcon: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6" fill="#dcfce7" stroke="#22c55e" strokeWidth="1"/>
    <path d="M5 8L7 10L11 6" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DefaultStatusIcon: React.FC<{ size: number; className: string }> = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="6" fill="#f3f4f6" stroke="#6b7280" strokeWidth="1"/>
    <circle cx="8" cy="8" r="2" fill="#6b7280"/>
  </svg>
);