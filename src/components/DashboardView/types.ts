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

export type Notification = {
  id: string;
  type: "vendor_submission" | "action_item_created" | "upload_needs_review";
  message: string;
  timestamp: string;
  testScriptId: string;
  vendorName?: string;
  submissionType?: "COQ Responded" | "Action Item Responded";
  cerId?: string;
  isRead: boolean;
  needsApproval?: boolean;
};

export interface SharedTestScript {
  id: string;
  testScriptId: string;
  thirdPartyRequirements: string;
  testScript: string;
  dueDate?: string;
  coqRequest?: string;
  analystComment?: string;
  supportingEvidence?: string;
  status: "COQ Requested" | "COQ Responded" | "Action Item Issued" | "Action Item Responded" | "Approved";
  type: "COQ" | "Action Item";
  description?: string;
  uploadHistory?: Array<{
    filename: string;
    uploadDate: string;
    status: string;
  }>;
  cerId?: string;
  vendorName?: string;
  uploadPendingApproval?: boolean;
  reuploadState?: "awaiting_upload" | "needs_review" | "approved";
}

export interface DashboardViewProps {
  onOpenCER: (id: string) => void;
  selectedCERs: string[];
  onCERSelection: (cerIds: string[]) => void;
  isAgentRunning: boolean;
  onRunAgent: () => void;
  agentCompletedCERs: Set<string>;
  loadingCERs: Set<string>;
  processedTestScripts: Record<string, Set<string>>;
  getCERTestScriptIds: (cerId: string) => string[];
}