// ========================================
// Type Definitions for VendorDashboardView
// ========================================

// Base interface for TestScript
export interface TestScript {
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
}

// Upload history item interface
export interface UploadHistoryItem {
  filename: string;
  uploadDate: string;
  status: string;
}

// Reupload request interface
export interface ReuploadRequest {
  id: string;
  documentName: string;
  reason: string;
  requestedDate: string;
  status: "awaiting_upload" | "needs_review" | "approved";
}

// Additional document request interface
export interface AdditionalDocumentRequest {
  id: string;
  requirement: string;
  analystNotes: string;
  requestedDate: string;
  status: "awaiting_upload" | "needs_review" | "approved";
}

// Test script status type
export type TestScriptStatus = "COQ Requested" | "COQ Responded" | "Action Item Issued" | "Action Item Responded" | "Approved";

// Test script type
export type TestScriptType = "COQ" | "Action Item";

// Reupload state type
export type ReuploadState = "awaiting_upload" | "needs_review" | "approved";

// Extended interface for SharedTestScript used in VendorDashboardView
export interface SharedTestScript {
  id: string;
  testScriptId: string;
  thirdPartyRequirements: string;
  testScript: string;
  dueDate?: string;
  coqRequest?: string;
  analystComment?: string;
  supportingEvidence?: string;
  status: TestScriptStatus;
  type: TestScriptType;
  description?: string;
  uploadHistory?: UploadHistoryItem[];
  cerId?: string;
  vendorName?: string;
  reuploadState?: ReuploadState;
  uploadPendingApproval?: boolean;
  reuploadRequests?: ReuploadRequest[];
  additionalDocumentRequests?: AdditionalDocumentRequest[];
  finalConclusion?: string;
}

// Approved version interface
export interface ApprovedVersion {
  version: string;
  timestamp: string;
  scriptId: string;
  cerId: string;
  approvedData?: any;
}

// Props interface for VendorDashboardView component
export interface VendorDashboardViewProps {
  onVendorSubmission: (testScriptId: string, submissionType: "COQ Responded" | "Action Item Responded", vendorName: string) => void;
  sharedTestScripts: SharedTestScript[];
  onTestScriptStatusUpdate: (testScriptId: string, newStatus: TestScriptStatus, uploadHistory?: UploadHistoryItem[]) => void;
  approvedVersions?: Record<string, ApprovedVersion>;
  onReuploadSubmission?: (testScriptId: string, documentName: string) => void;
  onAdditionalDocumentSubmission?: (testScriptId: string) => void;
}

// Submission type for vendor submissions
export type VendorSubmissionType = "COQ Responded" | "Action Item Responded";

// Filter status type for dropdown options
export type FilterStatus = "All" | TestScriptStatus;

// Toast style configuration interface
export interface ToastStyleConfig {
  className: string;
  style?: {
    backgroundColor?: string;
    borderColor?: string;
    color?: string;
  };
}

// Toast styles interface
export interface ToastStyles {
  error: ToastStyleConfig;
  success: ToastStyleConfig;
}

// Status badge variants mapping interface
export interface StatusBadgeVariants {
  "Approved": string;
  "COQ Responded": string;
  "Action Item Responded": string;
  "Action Item Issued": string;
  "COQ Requested": string;
}

// Reverse script mapping interface
export interface ReverseScriptMapping {
  [cerId: string]: {
    [testScriptId: string]: string;
  };
}