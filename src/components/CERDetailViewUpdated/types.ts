// Same types as CERDetailView but with some additional properties for updated version
export interface CERDetailViewUpdatedProps {
  cerId: string;
  onBack: () => void;
  onOpenScript: (scriptId: string) => void;
  scriptUpdates?: Record<string, any>;
  hasAgentRun?: boolean;
  approvedVersions?: Record<string, { version: string; timestamp: string; scriptId: string; cerId: string; approvedData?: any }>;
  onRunAgent?: (cerId: string, selectedScripts?: string[]) => void;
  isAgentRunning?: boolean;
  isLoadingThisCER?: boolean;
  sharedTestScripts?: Array<{
    id: string;
    testScriptId: string;
    status: "COQ Requested" | "COQ Responded" | "Action Item Issued" | "Action Item Responded" | "Approved";
    type: "COQ" | "Action Item";
    cerId?: string;
    vendorName?: string;
  }>;
  processedTestScripts?: Set<string>;
}

export interface TestScriptUpdated {
  id: string;
  title: string;
  name: string;
  control: string;
  controlName: string;
  risk: "medium" | "high" | "low";
  status: "finished";
  confidence: number | null; // Allow null for unprocessed scripts
  disposition: "Satisfactory" | "Not Satisfactory" | "Partially Satisfactory" | "Under Review" | null;
  confidenceStatus: "not-started" | "in-progress" | "finished" | "repopulated";
  thirdPartyRequirements: string;
  testScripts: string;
  aiInsightsSummary: string | null; // Allow null for unprocessed scripts
  humanInsightsSummary: string | null; // Allow null for unprocessed scripts
  tooltip?: string;
  description: string;
  expectedEvidence: string;
}

export interface VendorData {
  vendor: string;
  riskLevel: string;
  confidence: number;
  previousConfidence?: number;
  status: string;
}