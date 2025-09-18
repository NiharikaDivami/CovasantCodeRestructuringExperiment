export interface VCMAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  cerId: string;
}

export type RiskLevel = 'High' | 'Medium' | 'Low';

export interface AnalysisData {
  sourceDocuments: string[];
  reasoningSteps: string[];
  generatedInsight: string;
  confidenceScore: number;
  riskLevel: RiskLevel;
}
