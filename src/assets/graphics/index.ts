// Graphics and visual elements for the Risk Analyst Dashboard
// This file manages charts, diagrams, and visual data representations

// Chart and graph assets
export const CHART_GRAPHICS = {
  // Dashboard charts
  riskTrendChart: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop",
  complianceChart: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
  statusDistribution: "https://images.unsplash.com/photo-1551288049-bebda4e38f72?w=400&h=250&fit=crop",
  
  // Performance metrics
  kpiDashboard: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=350&fit=crop",
  progressChart: "https://images.unsplash.com/photo-1551288049-bebda4e38f73?w=450&h=280&fit=crop",
  timelineChart: "https://images.unsplash.com/photo-1551288049-bebda4e38f74?w=550&h=320&fit=crop",
  
  // Vendor analytics
  vendorPerformance: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=480&h=300&fit=crop",
  riskHeatmap: "https://images.unsplash.com/photo-1551288049-bebda4e38f75?w=520&h=340&fit=crop",
  complianceMatrix: "https://images.unsplash.com/photo-1460925895917-afdab827c52g?w=500&h=320&fit=crop",
} as const;

// Diagram and flowchart assets
export const DIAGRAM_GRAPHICS = {
  // Process flows
  cerWorkflow: "https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=600&h=300&fit=crop",
  agentWorkflow: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
  approvalProcess: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=580&h=320&fit=crop",
  
  // System architecture
  systemOverview: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=700&h=400&fit=crop",
  dataFlow: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=650&h=380&fit=crop",
  integrationMap: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=620&h=360&fit=crop",
  
  // Risk framework diagrams
  riskMatrix: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=400&fit=crop",
  controlFramework: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=500&h=350&fit=crop",
  complianceFramework: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=480&h=340&fit=crop",
} as const;

// Icon sets and visual elements
export const ICON_GRAPHICS = {
  // File type icons (vector graphics)
  pdfIcon: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=64&h=64&fit=crop",
  excelIcon: "https://images.unsplash.com/photo-1586953208450-b95a79798f09?w=64&h=64&fit=crop",
  wordIcon: "https://images.unsplash.com/photo-1586953208451-b95a79798f10?w=64&h=64&fit=crop",
  powerpointIcon: "https://images.unsplash.com/photo-1586953208452-b95a79798f11?w=64&h=64&fit=crop",
  
  // Status indicators
  successIcon: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop",
  warningIcon: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop",
  errorIcon: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
  infoIcon: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop",
  
  // Activity icons
  uploadIcon: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=40&h=40&fit=crop",
  downloadIcon: "https://images.unsplash.com/photo-1586953208450-b95a79798f09?w=40&h=40&fit=crop",
  reviewIcon: "https://images.unsplash.com/photo-1586953208451-b95a79798f10?w=40&h=40&fit=crop",
  approveIcon: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
} as const;

// Banner and header graphics
export const BANNER_GRAPHICS = {
  dashboardHeader: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=200&fit=crop",
  vendorHeader: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&h=200&fit=crop",
  managerHeader: "https://images.unsplash.com/photo-1560472355-536de3962603?w=1200&h=200&fit=crop",
  analystHeader: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=200&fit=crop",
  
  // Feature banners
  agentBanner: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=150&fit=crop",
  complianceBanner: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=150&fit=crop",
  securityBanner: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=150&fit=crop",
  analyticsBanner: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=150&fit=crop",
} as const;

// Export types
export type ChartGraphicKey = keyof typeof CHART_GRAPHICS;
export type DiagramGraphicKey = keyof typeof DIAGRAM_GRAPHICS;
export type IconGraphicKey = keyof typeof ICON_GRAPHICS;
export type BannerGraphicKey = keyof typeof BANNER_GRAPHICS;