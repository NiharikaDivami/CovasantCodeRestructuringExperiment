// Same constants as CERDetailView
export const VIEW_MODES = {
  GRID: 'grid' as const,
  TABLE: 'table' as const,
};

export const SORT_OPTIONS = {
  TITLE: 'title' as const,
  DISPOSITION: 'disposition' as const,
  CONFIDENCE: 'confidence' as const,
};

export const SORT_ORDERS = {
  ASC: 'asc' as const,
  DESC: 'desc' as const,
};

export const FILTER_OPTIONS = {
  ALL: 'all' as const,
  SATISFACTORY: 'Satisfactory' as const,
  NOT_SATISFACTORY: 'Not Satisfactory' as const,
  PARTIALLY_SATISFACTORY: 'Partially Satisfactory' as const,
  UNDER_REVIEW: 'Under Review' as const,
};

export const CONFIDENCE_THRESHOLDS = {
  HIGH: 85,
  MEDIUM: 60,
  LOW: 0,
};

export const RISK_LEVELS = {
  HIGH: 'high' as const,
  MEDIUM: 'medium' as const,
  LOW: 'low' as const,
};

// Additional constants for updated version
export const VENDOR_DATA_MAP = {
  "CER-10234": {
    vendor: "Sarah Chen",
    riskLevel: "High",
    confidence: 92,
    status: "finished"
  },
  "CER-10567": {
    vendor: "Marcus Rodriguez", 
    riskLevel: "High",
    confidence: 81,
    previousConfidence: 45,
    status: "repopulated"
  },
  "CER-10892": {
    vendor: "Jennifer Liu",
    riskLevel: "Medium", 
    confidence: 58,
    status: "in-progress"
  }
} as const;