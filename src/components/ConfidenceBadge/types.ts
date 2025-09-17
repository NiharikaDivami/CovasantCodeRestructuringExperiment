export interface ConfidenceBadgeProps {
  status: "not-started" | "in-progress" | "finished" | "repopulated";
  confidence?: number;
  previousConfidence?: number;
  tooltip?: string;
}
