export interface SharedTestScript {
  id: string;
  testScriptId: string;
  status: string;
  type: string;
  reuploadState?: "awaiting_upload" | "needs_review" | "approved";
  reuploadRequests?: Array<{
    id: string;
    documentName: string;
    reason: string;
    requestedDate: string;
    status: "awaiting_upload" | "needs_review" | "approved";
  }>;
  additionalDocumentRequests?: Array<{
    id: string;
    requirement: string;
    analystNotes: string;
    requestedDate: string;
    status: "awaiting_upload" | "needs_review" | "approved";
  }>;
  cerId?: string;
  vendorName?: string;
}

export interface ApprovedVersionEntry {
  version: string;
  timestamp: string;
  scriptId: string;
  cerId: string;
  approvedData?: any;
}

export interface ConversationalTranscriptDetailViewProps {
  scriptId: string;
  onBack: () => void;
  onBackToDashboard?: () => void;
  onScriptUpdate?: (scriptId: string, updates: any) => void;
  onApproveAndNavigate?: (approvedVersion: string, analysisData?: any) => void;
  onVersionUpdate?: (version: string, analysisData: any) => void;
  scriptTitle?: string;
  scriptUpdates?: any;
  parentCerId?: string;
  versionHistory?: any[];
  onActionItemCreated?: (testScriptId: string, cerId: string, vendorName: string) => void;
  onRequestReupload?: (testScriptId: string, cerId: string, documentName: string, reason: string, analystNotes?: string) => void;
  onRequestAdditionalDocument?: (testScriptId: string, cerId: string, requirement: string, analystNotes: string) => void;
  onApproveReupload?: (testScriptId: string, documentName: string) => void;
  sharedTestScripts?: Array<SharedTestScript>;
  uploadStates?: Record<string, "awaiting_upload" | "needs_review" | "approved">;
  approvedVersions?: Record<string, ApprovedVersionEntry>;
}

export interface Evidence {
  id: string;
  name: string;
  type: "policy" | "document" | "log" | "certificate" | "report" | "evidence" | "procedure";
  status: "available" | "missing" | "under-review";
  uploadDate?: string;
  size?: string;
  relevanceScore: number;
}

export interface ChatMessage {
  id: string;
  type: "ai" | "human";
  author: string;
  timestamp: string;
  version?: string;
  content: {
    title?: string;
    reasoningSteps?: string[];
    sourceDocuments?: string[];
    generatedInsight?: string;
    confidence?: number;
    disposition?: string;
    text?: string;
  };
  isLatest?: boolean;
  isFinalConclusion?: boolean;
}
