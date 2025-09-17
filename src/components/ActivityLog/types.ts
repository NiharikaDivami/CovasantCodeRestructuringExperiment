export interface ActivityLogProps {
  activities: {
    id: string;
    type: "ai-populated" | "human-insight" | "repopulated";
    message: string;
    timestamp: string;
    confidence?: number;
    previousConfidence?: number;
  }[];
  onClose?: () => void;
  onExpandedChange?: (isExpanded: boolean) => void;
}

export interface Activity {
  id: string;
  type: "ai-populated" | "human-insight" | "repopulated";
  message: string;
  timestamp: string;
  confidence?: number;
  previousConfidence?: number;
}