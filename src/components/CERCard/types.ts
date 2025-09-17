export interface CER {
  id: string;
  vendor: string;
  riskLevel: "Critical" | "Medium" | "Low";
  status: "Active" | "Completed";
  confidenceStatus: "not-started" | "in-progress" | "finished" | "repopulated";
  confidence?: number;
  previousConfidence?: number;
  tooltip?: string;
}

export interface CERCardProps {
  cer: CER;
  onOpenCER: (id: string) => void;
  onOpenAnalysis: (id: string) => void;
  hasAgentRun?: boolean;
  isLoading?: boolean;
}