// Image assets barrel export file
// This file centralizes all image imports for easy management

// Placeholder image URLs for development
export const PLACEHOLDER_IMAGES = {
  // User avatars and profile pictures
  userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  analystAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  vendorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
  managerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
  
  // Company and vendor logos (placeholder)
  companyLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=50&fit=crop",
  vendorLogo1: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=150&h=75&fit=crop",
  vendorLogo2: "https://images.unsplash.com/photo-1549924231-f129b911e443?w=150&h=75&fit=crop",
  
  // Dashboard illustrations
  dashboardHero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
  analyticsChart: "https://images.unsplash.com/photo-1551288049-bebda4e38f72?w=600&h=300&fit=crop",
  dataVisualization: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
  
  // Document and file type icons
  pdfDocument: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=100&h=100&fit=crop",
  excelDocument: "https://images.unsplash.com/photo-1586953208450-b95a79798f09?w=100&h=100&fit=crop",
  wordDocument: "https://images.unsplash.com/photo-1586953208451-b95a79798f10?w=100&h=100&fit=crop",
  
  // Empty states and placeholders
  emptyState: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=400&h=300&fit=crop",
  noData: "https://images.unsplash.com/photo-1584824486516-112e4181ff6c?w=300&h=200&fit=crop",
  loading: "https://images.unsplash.com/photo-1584824486518-112e4181ff6d?w=200&h=200&fit=crop",
  
  // Background patterns and textures
  subtlePattern: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&h=800&fit=crop&opacity=10",
  geometricBg: "https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=1200&h=800&fit=crop&opacity=5",
} as const;

// Risk level indicator images
export const RISK_LEVEL_IMAGES = {
  low: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
  medium: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop", 
  critical: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop",
} as const;

// Status indicator images
export const STATUS_IMAGES = {
  approved: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=30&h=30&fit=crop",
  pending: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=30&h=30&fit=crop",
  rejected: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=30&h=30&fit=crop",
  inReview: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=30&h=30&fit=crop",
} as const;

// Export types for TypeScript
export type PlaceholderImageKey = keyof typeof PLACEHOLDER_IMAGES;
export type RiskLevelImageKey = keyof typeof RISK_LEVEL_IMAGES;
export type StatusImageKey = keyof typeof STATUS_IMAGES;