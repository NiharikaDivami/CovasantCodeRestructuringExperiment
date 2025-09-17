// Illustration assets for empty states, onboarding, and visual elements
// This file manages all illustration-related assets

// Empty state illustrations
export const EMPTY_STATE_ILLUSTRATIONS = {
  // Dashboard empty states
  noCERs: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=300&h=200&fit=crop",
  noTestScripts: "https://images.unsplash.com/photo-1584824486516-112e4181ff6c?w=300&h=200&fit=crop", 
  noNotifications: "https://images.unsplash.com/photo-1584824486518-112e4181ff6d?w=300&h=200&fit=crop",
  noData: "https://images.unsplash.com/photo-1584824486520-112e4181ff6e?w=300&h=200&fit=crop",
  
  // Vendor specific empty states
  noDocuments: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=250&h=180&fit=crop",
  noUploads: "https://images.unsplash.com/photo-1586953208450-b95a79798f09?w=250&h=180&fit=crop",
  noSubmissions: "https://images.unsplash.com/photo-1586953208451-b95a79798f10?w=250&h=180&fit=crop",
  
  // Manager specific empty states  
  noVendors: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=280&h=200&fit=crop",
  noReports: "https://images.unsplash.com/photo-1560472355-536de3962603?w=280&h=200&fit=crop",
  noPipeline: "https://images.unsplash.com/photo-1560472355-a9a6c3163c1d?w=280&h=200&fit=crop",
} as const;

// Process and workflow illustrations
export const PROCESS_ILLUSTRATIONS = {
  // Agent workflow
  agentAnalysis: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
  agentProcessing: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop",
  agentComplete: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
  
  // Document workflow
  documentReview: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=350&h=220&fit=crop",
  documentApproval: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=350&h=220&fit=crop",
  documentRejection: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=350&h=220&fit=crop",
  
  // Compliance workflow
  riskAssessment: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=380&h=240&fit=crop",
  complianceCheck: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=380&h=240&fit=crop",
  auditTrail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=380&h=240&fit=crop",
} as const;

// Success and error state illustrations
export const FEEDBACK_ILLUSTRATIONS = {
  // Success states
  uploadSuccess: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=150&fit=crop",
  approvalSuccess: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop",
  taskComplete: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=150&fit=crop",
  
  // Warning states
  attentionRequired: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=150&fit=crop",
  reviewNeeded: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=150&fit=crop",
  actionRequired: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop",
  
  // Error states
  uploadError: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=150&fit=crop",
  processingError: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=150&fit=crop",
  connectionError: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop",
} as const;

// Onboarding and help illustrations
export const ONBOARDING_ILLUSTRATIONS = {
  welcome: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
  gettingStarted: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
  tutorial: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop",
  helpCenter: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
  support: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop",
} as const;

// Background patterns and decorative elements
export const BACKGROUND_PATTERNS = {
  subtle: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&h=800&fit=crop&opacity=5",
  geometric: "https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=1200&h=800&fit=crop&opacity=10",
  dots: "https://images.unsplash.com/photo-1557682260-96773eb01377?w=1200&h=800&fit=crop&opacity=8",
  lines: "https://images.unsplash.com/photo-1557682257-2f9c37a3a5f3?w=1200&h=800&fit=crop&opacity=6",
} as const;

// Export types
export type EmptyStateKey = keyof typeof EMPTY_STATE_ILLUSTRATIONS;
export type ProcessIllustrationKey = keyof typeof PROCESS_ILLUSTRATIONS;
export type FeedbackIllustrationKey = keyof typeof FEEDBACK_ILLUSTRATIONS;
export type OnboardingIllustrationKey = keyof typeof ONBOARDING_ILLUSTRATIONS;
export type BackgroundPatternKey = keyof typeof BACKGROUND_PATTERNS;