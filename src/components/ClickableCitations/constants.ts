// Citation pattern regex
export const CITATION_REGEX = /\[([^,]+),\s*pg\s*(\d+),\s*para\s*(\d+)\]/g;

// Maximum number of matches to prevent infinite loops
export const MAX_CITATION_MATCHES = 50;

// Citation highlight map for different documents
export const CITATION_HIGHLIGHT_MAP: Record<string, string> = {
  // SOC2 Report citations
  "SOC2 Report 2025-p8-para3": "encryption for data at rest using AES-256",
  "SOC2 Security Report 2025-p8-para3": "encryption for data at rest using AES-256",
  "SOC2 Report 2025-p15-para1": "Supplemental materials include",
  "SOC2 Security Report 2025-p15-para1": "Supplemental materials include",
  
  // IPSRA Risk Scorecard citations
  "IPSRA Risk Scorecard-p12-para2": "Data classification categories include",
  
  // Fallback patterns
  "SOC2 Report 2025": "encryption for data at rest using AES-256",
  "SOC2 Security Report 2025": "encryption for data at rest using AES-256",
  "IPSRA Risk Scorecard": "Data classification categories include",
  "Coupa Vendor Profile": "vendor risk evaluation criteria"
};

// CSS classes for citation styling
export const CITATION_STYLES = {
  BUTTON: "inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors cursor-pointer font-medium border border-blue-200 hover:border-blue-300",
  DOCUMENT_NAME: "text-sm font-medium",
  PAGE_INFO: "text-xs text-gray-600",
  CITATION_BADGE: "text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200"
};