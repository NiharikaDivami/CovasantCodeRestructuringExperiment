// Logo assets for the Risk Analyst Dashboard
// This file manages all logo-related assets and configurations

// Logo configuration for different contexts
export const LOGO_CONFIG = {
  primary: {
    name: "Risk Analyst Dashboard",
    tagline: "Powered by VCM Agent",
    colors: {
      primary: "#1f2937",
      secondary: "#6b7280",
      accent: "#3b82f6"
    }
  },
  
  // Different logo variants for different contexts
  variants: {
    header: {
      width: 32,
      height: 32,
      showText: true
    },
    sidebar: {
      width: 24,
      height: 24,
      showText: false
    },
    loading: {
      width: 48,
      height: 48,
      showText: true
    },
    email: {
      width: 100,
      height: 40,
      showText: true
    }
  }
} as const;

// Company/organization logos (placeholder URLs)
export const COMPANY_LOGOS = {
  // Main organization logo
  primaryLogo: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=200&h=80&fit=crop",
  
  // Partner/vendor company logos
  techFlowSolutions: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=120&h=60&fit=crop",
  dataSecureInc: "https://images.unsplash.com/photo-1549924231-f129b911e443?w=120&h=60&fit=crop",
  cloudNetSystems: "https://images.unsplash.com/photo-1549924231-f129b911e444?w=120&h=60&fit=crop",
  infoGuardTech: "https://images.unsplash.com/photo-1549924231-f129b911e445?w=120&h=60&fit=crop",
  secureLinkCorp: "https://images.unsplash.com/photo-1549924231-f129b911e446?w=120&h=60&fit=crop",
  cyberShieldSolutions: "https://images.unsplash.com/photo-1549924231-f129b911e447?w=120&h=60&fit=crop",
} as const;

// Technology and tool logos
export const TECH_LOGOS = {
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=60&h=60&fit=crop",
  security: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=60&h=60&fit=crop",
  analytics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=60&h=60&fit=crop",
  compliance: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=60&h=60&fit=crop",
} as const;

// Badge and certification logos
export const BADGE_LOGOS = {
  iso27001: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=80&h=80&fit=crop",
  sox: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=80&h=80&fit=crop",
  gdpr: "https://images.unsplash.com/photo-1563013544-824ae1b704d4?w=80&h=80&fit=crop",
  hipaa: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=80&h=80&fit=crop",
} as const;

// Export types
export type CompanyLogoKey = keyof typeof COMPANY_LOGOS;
export type TechLogoKey = keyof typeof TECH_LOGOS;
export type BadgeLogoKey = keyof typeof BADGE_LOGOS;
export type LogoVariant = keyof typeof LOGO_CONFIG.variants;