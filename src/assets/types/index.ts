// Asset-related types and interfaces
// This file defines TypeScript types for asset management

// Test script status type (for icon consistency)
export type TestScriptStatus = "COQ Requested" | "COQ Responded" | "Action Item Issued" | "Action Item Responded" | "Approved";

// Persona type (for icon consistency)  
export type PersonaType = "analyst" | "vendor" | "manager";

// Risk levels
export type RiskLevel = "Low" | "Medium" | "Critical";

// Icon size variants
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl";

// Icon size mapping
export const ICON_SIZES: Record<IconSize, number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32
} as const;

// Image dimension types
export interface ImageDimensions {
  width: number;
  height: number;
}

// Asset configuration interface
export interface AssetConfig {
  src: string;
  alt: string;
  dimensions?: ImageDimensions;
  lazy?: boolean;
  placeholder?: string;
}

// Icon component props interface
export interface IconProps {
  className?: string;
  size?: number | IconSize;
  color?: string;
  'aria-label'?: string;
}

// Custom icon component props
export interface CustomIconProps extends IconProps {
  isActive?: boolean;
  variant?: 'default' | 'outline' | 'filled';
}

// Logo variant configuration
export interface LogoVariantConfig {
  width: number;
  height: number;
  showText: boolean;
}

// Asset loading states
export type AssetLoadingState = 'idle' | 'loading' | 'loaded' | 'error';

// Asset cache interface
export interface AssetCache {
  [key: string]: {
    url: string;
    loadingState: AssetLoadingState;
    timestamp: number;
  };
}