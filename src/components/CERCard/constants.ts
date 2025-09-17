export const getRiskLevelColor = (level: string): string => {
  switch (level) {
    case "Critical":
      return "bg-red-500 text-white";
    case "Medium":
      return "bg-amber-500 text-white";
    case "Low":
      return "bg-green-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export const RISK_LEVELS = {
  CRITICAL: "Critical",
  MEDIUM: "Medium", 
  LOW: "Low"
} as const;

export const STATUS_TYPES = {
  ACTIVE: "Active",
  COMPLETED: "Completed"
} as const;

export const CONFIDENCE_STATUS = {
  NOT_STARTED: "not-started",
  IN_PROGRESS: "in-progress", 
  FINISHED: "finished",
  REPOPULATED: "repopulated"
} as const;