import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent } from "./ui/card";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Upload, FileText, Calendar, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Filter, Search } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface TestScript {
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

const mockTestScripts: TestScript[] = [
  {
    id: "1",
    testScriptId: "TS-324472",
    thirdPartyRequirements: "Expense reporting process must include manager approval for expenses over $500 with proper documentation and business justification.",
    testScript: "Verify expense reports contain manager signatures, receipt attachments, and business justification for all expenses exceeding $500 threshold.",
    dueDate: "2024-09-15",
    coqRequest: "Provide expense reports with manager signatures, receipt attachments, and business justification for expenses exceeding $500.",
    status: "COQ Requested",
    type: "COQ",
    description: "Please provide comprehensive documentation demonstrating your expense reporting process, including samples of expense reports with manager approvals, receipt attachments, and business justification for all expenses over $500."
  },
  {
    id: "2",
    testScriptId: "TS-324473",
    thirdPartyRequirements: "All purchase orders require dual authorization for amounts exceeding $1,000 and must be approved by department heads.",
    testScript: "Review purchase order approval process to ensure dual signatures exist for orders over $1,000 and verify department head approval authority.",
    dueDate: "2024-09-18",
    coqRequest: "Provide purchase orders with dual authorization signatures and department head approvals for transactions exceeding $1,000.",
    analystComment: "Analysis indicates the purchase order control framework requires dual authorization for amounts exceeding $1,000, which aligns with SOC 2 compliance requirements. However, current evidence shows inconsistent application of dual signature requirements. The control design is sound but operational effectiveness is compromised by missing department head approvals in 3 of 8 sampled transactions. Risk mitigation requires immediate corrective action to ensure consistent dual authorization compliance across all purchase order transactions.",
    supportingEvidence: "Purchase orders with dual signatures required",
    status: "Action Item Issued",
    type: "Action Item",
    description: "The purchase order documentation provided lacks clear evidence of dual authorization. Please upload current purchase orders showing both required signatures and department head approvals for orders over $1,000.",
    uploadHistory: [
      { filename: "purchase-orders-q3.pdf", uploadDate: "2024-08-15", status: "Incomplete" },
      { filename: "authorization-matrix.pdf", uploadDate: "2024-08-15", status: "Under Review" }
    ]
  },
  {
    id: "3",
    testScriptId: "TS-324474",
    thirdPartyRequirements: "Invoice processing requires three-way matching (invoice, purchase order, receipt) and approval by authorized personnel.",
    testScript: "Test three-way matching process by selecting sample invoices and verifying matching to purchase orders and receipts with proper approvals.",
    dueDate: "2024-09-20",
    coqRequest: "Demonstrate three-way matching process with sample invoices, purchase orders, and receipts showing authorized approvals.",
    status: "COQ Requested",
    type: "COQ",
    description: "Please provide evidence of your three-way matching process including sample invoices with corresponding purchase orders and receipts, along with authorized personnel approvals."
  },
  {
    id: "4",
    testScriptId: "TS-325001",
    thirdPartyRequirements: "Revenue recognition follows GAAP principles with quarterly review by senior accounting staff and external auditor validation.",
    testScript: "Test revenue recognition methodology against GAAP standards and verify quarterly senior accounting review and external auditor validation.",
    coqRequest: "Provide revenue recognition documentation with quarterly senior accounting staff reviews and external auditor validation reports.",
    analystComment: "Revenue recognition control analysis confirms adherence to GAAP principles with quarterly review processes in place. Testing revealed the control design appropriately incorporates senior accounting staff oversight and external auditor validation requirements. However, operational effectiveness testing identified missing signatures from senior accounting staff on 2 of 4 quarterly reviews examined. While the underlying GAAP methodology is sound and external auditor validation procedures are properly documented, the incomplete signature trail represents a compliance gap that requires immediate attention to ensure continuous adherence to established review protocols.",
    supportingEvidence: "Complete quarterly review documentation needed",
    status: "Action Item Responded",
    type: "Action Item",
    description: "The revenue recognition documentation is missing key quarterly review signatures from senior accounting staff. Please provide complete documentation including external auditor validation.",
    uploadHistory: [
      { filename: "revenue-recognition-q2.pdf", uploadDate: "2024-09-01", status: "Under Review" }
    ]
  },
  {
    id: "5",
    testScriptId: "TS-325002",
    thirdPartyRequirements: "All contracts require legal review and C-level approval for agreements exceeding $100,000 or multi-year commitments.",
    testScript: "Review contract approval workflow to ensure legal review and C-level approval for contracts over $100,000 or multi-year terms.",
    status: "Approved",
    type: "COQ",
    coqRequest: "Provide contracts with legal review stamps, C-level signatures, and contract registry maintenance records.",
    description: "Approved - All contract approval documentation has been verified and meets compliance requirements including proper legal review and C-level approvals.",
    uploadHistory: [
      { filename: "contract-approvals-2024.pdf", uploadDate: "2024-08-20", status: "Approved" },
      { filename: "legal-review-stamps.pdf", uploadDate: "2024-08-20", status: "Approved" }
    ]
  },
  {
    id: "6",
    testScriptId: "TS-326001",
    thirdPartyRequirements: "Multi-factor authentication required for all financial systems with quarterly security assessments and incident response procedures.",
    testScript: "Verify MFA implementation across financial systems, review quarterly security assessment procedures, and test incident response protocols.",
    coqRequest: "Provide MFA implementation logs, quarterly security assessment reports, and incident response documentation.",
    analystComment: "Multi-factor authentication control evaluation confirms comprehensive implementation across all financial systems with robust security protocols. The MFA framework demonstrates strong design incorporating industry-standard authentication factors including token-based verification and biometric controls. Quarterly security assessment procedures are well-documented and consistently executed, showing effective monitoring and continuous improvement processes. Incident response protocols are properly established with clear escalation procedures and stakeholder notification requirements. Testing validates operational effectiveness with 99.2% successful authentication rates and zero security incidents in the past 12 months. The control environment effectively mitigates unauthorized access risks and maintains compliance with financial system security requirements.",
    status: "COQ Responded",
    type: "COQ",
    description: "Please provide comprehensive documentation of MFA implementation across all financial systems, quarterly security assessments, and incident response procedures.",
    uploadHistory: [
      { filename: "mfa-implementation-logs.pdf", uploadDate: "2024-08-28", status: "Under Review" },
      { filename: "quarterly-security-assessment.pdf", uploadDate: "2024-08-28", status: "Under Review" }
    ]
  },
  {
    id: "7",
    testScriptId: "TS-326002",
    thirdPartyRequirements: "Daily automated backups with monthly recovery testing and offsite storage verification for critical financial data.",
    testScript: "Test daily backup automation, verify monthly recovery testing procedures, and confirm offsite storage validation processes.",
    dueDate: "2024-09-30",
    coqRequest: "Provide backup completion logs, monthly recovery test results, and offsite storage confirmation records.",
    status: "COQ Requested",
    type: "COQ",
    description: "Please provide documentation of daily backup automation, monthly recovery testing results, and offsite storage verification for critical financial data."
  },
  {
    id: "8",
    testScriptId: "TS-327001",
    thirdPartyRequirements: "All API endpoints require authentication and authorization with rate limiting and input validation controls.",
    testScript: "Test API authentication mechanisms, verify authorization controls, and validate rate limiting and input sanitization procedures.",
    dueDate: "2024-09-22",
    coqRequest: "Provide API security configuration documentation including authentication mechanisms, authorization controls, rate limiting parameters, and input validation specifications.",
    analystComment: "API security control framework analysis demonstrates strong authentication and authorization mechanisms are implemented across all endpoints. The control design effectively incorporates industry-standard security protocols including OAuth 2.0 authentication and role-based authorization controls. However, comprehensive testing revealed missing rate limiting configuration documentation and incomplete input validation specifications. While authentication controls are operating effectively, the absence of detailed rate limiting parameters and input sanitization procedures creates potential security vulnerabilities. Risk assessment indicates moderate exposure requiring immediate documentation and configuration updates to ensure complete API security coverage.",
    supportingEvidence: "Complete API security documentation needed",
    status: "Action Item Issued",
    type: "Action Item",
    description: "The API security documentation needs to include comprehensive rate limiting configurations and input validation controls with technical specifications.",
    uploadHistory: [
      { filename: "api-security-config.json", uploadDate: "2024-08-25", status: "Incomplete" }
    ]
  },
  {
    id: "9",
    testScriptId: "TS-327002",
    thirdPartyRequirements: "Cloud infrastructure requires encryption at rest and in transit with proper network segmentation and monitoring.",
    testScript: "Verify encryption implementations, test network segmentation rules, and review cloud monitoring configurations.",
    dueDate: "2024-10-05",
    coqRequest: "Provide encryption certificates, network configuration files, and cloud monitoring dashboard reports.",
    status: "COQ Requested",
    type: "COQ",
    description: "Please provide current encryption certificates, network segmentation configurations, and cloud monitoring dashboard reports demonstrating comprehensive security controls."
  },
  {
    id: "10",
    testScriptId: "TS-328001",
    thirdPartyRequirements: "All sensitive data must be encrypted using AES-256 encryption with proper key management and rotation procedures.",
    testScript: "Verify encryption algorithm implementations, test key management procedures, and validate encryption key rotation schedules.",
    status: "Approved",
    type: "COQ",
    coqRequest: "Provide encryption implementation reports, key management logs, and rotation schedule documentation.",
    description: "Approved - Data encryption controls meet industry standards with effective key management and automated rotation processes verified.",
    uploadHistory: [
      { filename: "encryption-implementation-report.pdf", uploadDate: "2024-08-30", status: "Approved" },
      { filename: "key-management-logs.pdf", uploadDate: "2024-08-30", status: "Approved" }
    ]
  },
  {
    id: "11",
    testScriptId: "TS-328002",
    thirdPartyRequirements: "Database systems require role-based access controls with audit logging and regular security updates.",
    testScript: "Review database user roles and permissions, verify audit logging functionality, and confirm security patch management.",
    coqRequest: "Provide database access logs, user permission matrices, and security update installation records.",
    analystComment: "Database security control assessment demonstrates comprehensive role-based access control implementation with effective segregation of duties and appropriate user permission matrices. The control framework properly restricts database access based on business function requirements and maintains detailed audit logging for all database activities. Security patch management procedures are well-established with regular update cycles and thorough testing protocols before implementation. Analysis of provided documentation confirms consistent application of security controls with comprehensive logging capturing all user activities, permission changes, and system modifications. The database security environment effectively mitigates unauthorized access risks and maintains compliance with data protection requirements through continuous monitoring and regular security updates.",
    status: "COQ Responded",
    type: "COQ",
    description: "Please provide comprehensive database security documentation including role-based access controls, audit logging functionality, and security patch management records.",
    uploadHistory: [
      { filename: "database-access-logs.pdf", uploadDate: "2024-09-02", status: "Under Review" },
      { filename: "user-permission-matrices.xlsx", uploadDate: "2024-09-02", status: "Under Review" }
    ]
  },
  {
    id: "12",
    testScriptId: "TS-329001",
    thirdPartyRequirements: "Data synchronization between systems requires conflict resolution mechanisms and integrity verification.",
    testScript: "Test synchronization conflict resolution, verify data integrity checks, and validate error handling procedures.",
    coqRequest: "Provide data synchronization documentation including conflict resolution mechanisms, integrity verification procedures, and error handling workflows.",
    analystComment: "Data synchronization control assessment reveals a well-architected framework for managing inter-system data consistency with appropriate conflict resolution mechanisms. The control design incorporates industry best practices for data integrity verification and automated error detection. Testing demonstrates effective operational implementation of synchronization protocols with successful conflict resolution in 95% of test scenarios. However, documentation gaps exist in detailed conflict resolution procedures and error handling workflows. While the underlying technical implementation is sound and data integrity controls are functioning effectively, comprehensive procedural documentation is required to ensure consistent operational execution and compliance with data governance requirements.",
    supportingEvidence: "Updated conflict resolution procedures required",
    status: "Action Item Responded",
    type: "Action Item",
    description: "Please provide detailed conflict resolution procedures and error handling documentation for data synchronization between systems.",
    uploadHistory: [
      { filename: "sync-conflict-resolution.pdf", uploadDate: "2024-09-05", status: "Under Review" }
    ]
  }
];



interface SharedTestScript {
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
}

interface VendorDashboardViewProps {
  onVendorSubmission: (testScriptId: string, submissionType: "COQ Responded" | "Action Item Responded", vendorName: string) => void;
  sharedTestScripts: SharedTestScript[];
  onTestScriptStatusUpdate: (testScriptId: string, newStatus: "COQ Requested" | "COQ Responded" | "Action Item Issued" | "Action Item Responded" | "Approved", uploadHistory?: Array<{ filename: string; uploadDate: string; status: string; }>) => void;
  approvedVersions?: Record<string, { version: string; timestamp: string; scriptId: string; cerId: string; approvedData?: any }>;
  onReuploadSubmission?: (testScriptId: string, documentName: string) => void;
  onAdditionalDocumentSubmission?: (testScriptId: string) => void;
}

export default function VendorDashboardView({ onVendorSubmission, sharedTestScripts, onTestScriptStatusUpdate, approvedVersions = {}, onReuploadSubmission, onAdditionalDocumentSubmission }: VendorDashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedScript, setSelectedScript] = useState<SharedTestScript | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isTestScriptInfoExpanded, setIsTestScriptInfoExpanded] = useState(false);

  // Function to check if a test script has been approved in the analyst dashboard
  const isTestScriptApproved = (testScriptId: string, cerId?: string): boolean => {
    if (!cerId) return false;

    // Map test script IDs to internal script IDs for the specific CER
    const reverseScriptMap: Record<string, Record<string, string>> = {
      "CER-10234": {
        "TS-324472": "ts-1",
        "TS-324473": "ts-2",
        "TS-324474": "ts-3",
        "TS-324475": "ts-4",
        "TS-324476": "ts-5",
        "TS-324477": "ts-6"
      },
      "CER-10567": {
        "TS-325001": "ts-1",
        "TS-325002": "ts-2",
        "TS-325003": "ts-3",
        "TS-325004": "ts-4",
        "TS-325005": "ts-5",
        "TS-325006": "ts-6"
      },
      "CER-10892": {
        "TS-326001": "ts-1",
        "TS-326002": "ts-2",
        "TS-326003": "ts-3",
        "TS-326004": "ts-4",
        "TS-326005": "ts-5",
        "TS-326006": "ts-6"
      },
      "CER-11001": {
        "TS-327001": "ts-1",
        "TS-327002": "ts-2"
      },
      "CER-11234": {
        "TS-328001": "ts-1",
        "TS-328002": "ts-2"
      },
      "CER-11567": {
        "TS-329001": "ts-1",
        "TS-329002": "ts-2"
      },
      "CER-11892": {
        "TS-330001": "ts-1",
        "TS-330002": "ts-2"
      },
      "CER-12001": {
        "TS-331001": "ts-1",
        "TS-331002": "ts-2"
      },
      "CER-12234": {
        "TS-332001": "ts-1",
        "TS-332002": "ts-2"
      },
      "CER-12567": {
        "TS-333001": "ts-1",
        "TS-333002": "ts-2"
      },
      "CER-10901": {
        "TS-340001": "ts-1",
        "TS-340002": "ts-2"
      },
      "CER-10923": {
        "TS-341001": "ts-1",
        "TS-341002": "ts-2"
      },
      "CER-10956": {
        "TS-342001": "ts-1",
        "TS-342002": "ts-2"
      },
      "CER-11089": {
        "TS-343001": "ts-1",
        "TS-343002": "ts-2"
      },
      "CER-11156": {
        "TS-344001": "ts-1",
        "TS-344002": "ts-2"
      },
      "CER-11203": {
        "TS-345001": "ts-1",
        "TS-345002": "ts-2"
      },
      "CER-11278": {
        "TS-346001": "ts-1",
        "TS-346002": "ts-2"
      },
      "CER-11324": {
        "TS-347001": "ts-1",
        "TS-347002": "ts-2"
      }
    };

    const internalScriptId = reverseScriptMap[cerId]?.[testScriptId];
    if (!internalScriptId) return false;

    const approvalKey = `${cerId}_${internalScriptId}`;
    return !!approvedVersions[approvalKey];
  };

  // Function to get final conclusion from approved version
  const getFinalConclusion = (testScriptId: string, cerId?: string): string | undefined => {
    if (!cerId) return undefined;

    const reverseScriptMap: Record<string, Record<string, string>> = {
      "CER-10234": {
        "TS-324472": "ts-1",
        "TS-324473": "ts-2",
        "TS-324474": "ts-3",
        "TS-324475": "ts-4",
        "TS-324476": "ts-5",
        "TS-324477": "ts-6"
      },
      "CER-10567": {
        "TS-325001": "ts-1",
        "TS-325002": "ts-2",
        "TS-325003": "ts-3",
        "TS-325004": "ts-4",
        "TS-325005": "ts-5",
        "TS-325006": "ts-6"
      },
      "CER-10892": {
        "TS-326001": "ts-1",
        "TS-326002": "ts-2",
        "TS-326003": "ts-3",
        "TS-326004": "ts-4",
        "TS-326005": "ts-5",
        "TS-326006": "ts-6"
      },
      "CER-11001": {
        "TS-327001": "ts-1",
        "TS-327002": "ts-2"
      },
      "CER-11234": {
        "TS-328001": "ts-1",
        "TS-328002": "ts-2"
      },
      "CER-11567": {
        "TS-329001": "ts-1",
        "TS-329002": "ts-2"
      },
      "CER-11892": {
        "TS-330001": "ts-1",
        "TS-330002": "ts-2"
      },
      "CER-12001": {
        "TS-331001": "ts-1",
        "TS-331002": "ts-2"
      },
      "CER-12234": {
        "TS-332001": "ts-1",
        "TS-332002": "ts-2"
      },
      "CER-12567": {
        "TS-333001": "ts-1",
        "TS-333002": "ts-2"
      },
      "CER-10901": {
        "TS-340001": "ts-1",
        "TS-340002": "ts-2"
      },
      "CER-10923": {
        "TS-341001": "ts-1",
        "TS-341002": "ts-2"
      },
      "CER-10956": {
        "TS-342001": "ts-1",
        "TS-342002": "ts-2"
      },
      "CER-11089": {
        "TS-343001": "ts-1",
        "TS-343002": "ts-2"
      },
      "CER-11156": {
        "TS-344001": "ts-1",
        "TS-344002": "ts-2"
      },
      "CER-11203": {
        "TS-345001": "ts-1",
        "TS-345002": "ts-2"
      },
      "CER-11278": {
        "TS-346001": "ts-1",
        "TS-346002": "ts-2"
      },
      "CER-11324": {
        "TS-347001": "ts-1",
        "TS-347002": "ts-2"
      }
    };

    const internalScriptId = reverseScriptMap[cerId]?.[testScriptId];
    if (!internalScriptId) return undefined;

    const approvalKey = `${cerId}_${internalScriptId}`;
    const approvedVersion = approvedVersions[approvalKey];

    return approvedVersion?.approvedData?.humanInsight || approvedVersion?.approvedData?.finalConclusions;
  };

  // Update shared test scripts with approval status and final conclusions
  const enhancedSharedTestScripts = sharedTestScripts.map(script => {
    if (isTestScriptApproved(script.testScriptId, script.cerId)) {
      const finalConclusion = getFinalConclusion(script.testScriptId, script.cerId);
      return {
        ...script,
        status: "Approved" as const,
        finalConclusion
      };
    }
    return script;
  });

  const filteredScripts = enhancedSharedTestScripts.filter(script => {
    const matchesSearch = script.testScriptId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.thirdPartyRequirements.toLowerCase().includes(searchTerm.toLowerCase()) ||
      script.testScript.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || script.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleRowClick = (script: SharedTestScript) => {
    setSelectedScript(script);
    setIsDetailsPanelOpen(true);
    setUploadedFiles([]); // Reset uploaded files when opening new script
    setIsTestScriptInfoExpanded(false); // Reset expansion state when opening new script
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      toast("Please select files to upload before submitting.", {
        className: "border-red-500 bg-red-100 text-red-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#fef2f2",
          borderColor: "#ef4444",
          color: "#991b1b",
        },
      });
      return;
    }

    if (!selectedScript) return;

    // Check if this is a re-upload submission based on test script state
    const isReuploadSubmission = selectedScript.reuploadState === "awaiting_upload" ||
      (selectedScript.reuploadRequests &&
        selectedScript.reuploadRequests.some(req => req.status === "awaiting_upload"));

    // Check if this is an additional document submission
    const isAdditionalDocumentSubmission = selectedScript.additionalDocumentRequests &&
      selectedScript.additionalDocumentRequests.some(req => req.status === "awaiting_upload");

    if (isReuploadSubmission && onReuploadSubmission) {
      // This is a re-upload submission - find the document name from reupload requests
      const awaitingUploadRequest = selectedScript.reuploadRequests?.find(req => req.status === "awaiting_upload");
      const documentName = awaitingUploadRequest?.documentName || uploadedFiles[0].name;
      onReuploadSubmission(selectedScript.testScriptId, documentName);

      toast("Document re-uploaded successfully!", {
        className: "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
      });

      // Reset and close
      setUploadedFiles([]);
      setIsDetailsPanelOpen(false);
      return;
    }

    if (isAdditionalDocumentSubmission && onAdditionalDocumentSubmission) {
      // This is an additional document submission
      onAdditionalDocumentSubmission(selectedScript.testScriptId);

      toast("Additional document uploaded successfully!", {
        className: "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
      });

      // Reset and close
      setUploadedFiles([]);
      setIsDetailsPanelOpen(false);
      return;
    }

    // Regular submission flow
    const newStatus: SharedTestScript["status"] = selectedScript.status === "COQ Requested"
      ? "COQ Responded"
      : selectedScript.status === "Action Item Issued"
        ? "Action Item Responded"
        : selectedScript.status;

    // Create upload history entries
    const newUploadHistory = uploadedFiles.map(file => ({
      filename: file.name,
      uploadDate: new Date().toLocaleDateString(),
      status: "Under Review"
    }));

    // Update the script status in the shared state
    onTestScriptStatusUpdate(selectedScript.testScriptId, newStatus, newUploadHistory);

    // Update the selected script for immediate UI feedback
    setSelectedScript(prev => prev ? {
      ...prev,
      status: newStatus,
      uploadHistory: [
        ...(prev.uploadHistory || []),
        ...newUploadHistory
      ]
    } : null);

    // Simulate file submission
    toast("Files submitted successfully! Status updated.", {
      className: "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
    });

    // Send notification to analyst
    onVendorSubmission(selectedScript.testScriptId, newStatus, selectedScript.vendorName || "Current Vendor");

    // Reset and close
    setUploadedFiles([]);
    setIsDetailsPanelOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "default bg-green-100 text-green-800 border-green-200";
      case "COQ Responded":
        return "default bg-blue-100 text-blue-800 border-blue-200";
      case "Action Item Responded":
        return "default bg-blue-100 text-blue-800 border-blue-200";
      case "Action Item Issued":
        return "default bg-amber-100 text-amber-800 border-amber-200";
      case "COQ Requested":
        return "default bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "default";
    }
  };

  const getTypeIndicator = (type: string) => {
    return null;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 w-full">
      {/* Content Header */}
      <div className="bg-white border-b border-gray-100 pl-10 pr-6 py-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Test Scripts</h1>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredScripts.length} of {enhancedSharedTestScripts.length} test scripts
              </p>
            </div>
          </div>

          {/* Filter Controls and Search Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-44 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="COQ Requested">COQ Requested</SelectItem>
                  <SelectItem value="COQ Responded">COQ Responded</SelectItem>
                  <SelectItem value="Action Item Issued">Action Item Issued</SelectItem>
                  <SelectItem value="Action Item Responded">Action Item Responded</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Bar - Right side */}
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search test scripts, requirements, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="min-h-full pl-10 pr-6 py-6">
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[1400px]">
                <thead className="border-b bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px] bg-gray-50 sticky left-0 z-20 border-r border-gray-200">
                      Test Script ID
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                      Third-Party Requirements
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                      Test Script
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                      Status
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                      COQ Request
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                      Analyst Comment
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                      Supporting Evidence
                    </th>
                    <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                      Final Conclusion
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredScripts.map((script) => (
                    <tr
                      key={script.id}
                      onClick={() => handleRowClick(script)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-200"
                    >
                      <td className="px-3 py-4 whitespace-nowrap min-w-[140px] bg-white sticky left-0 z-10 border-r border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{script.testScriptId}</span>
                          {getTypeIndicator(script.type)}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2 break-words">
                          {script.thirdPartyRequirements}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-900 line-clamp-2 break-words">
                          {script.testScript}
                        </div>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        <Badge className={getStatusBadgeVariant(script.status)}>
                          {script.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-4">
                        {script.coqRequest ? (
                          <div className="text-sm text-gray-900 line-clamp-2 break-words">
                            {script.coqRequest}
                          </div>
                        ) : (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">No COQ request</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {script.status === "Approved" ? (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">Analyst has not added comment</span>
                          </div>
                        ) : script.analystComment ? (
                          <div className="text-sm text-gray-900 line-clamp-2 break-words">
                            {script.analystComment}
                          </div>
                        ) : (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">Analyst has not added comment</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {script.status === "Approved" ? (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">No supporting evidence</span>
                          </div>
                        ) : script.supportingEvidence ? (
                          <div className="text-sm text-gray-900 line-clamp-2 break-words">
                            {script.supportingEvidence}
                          </div>
                        ) : (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">No supporting evidence</span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {script.status === "Approved" && script.finalConclusion ? (
                          <div className="text-sm text-gray-900 line-clamp-2 break-words">
                            {script.finalConclusion}
                          </div>
                        ) : script.status === "Approved" ? (
                          <div className="text-sm text-gray-900 line-clamp-2 break-words">
                            Information security awareness training program successfully demonstrates comprehensive compliance with annual training requirements. All documentation provided meets regulatory standards with complete tracking and certification processes validated.
                          </div>
                        ) : (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">No conclusions available</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Details Panel */}
      <Sheet open={isDetailsPanelOpen} onOpenChange={setIsDetailsPanelOpen} >
        <SheetContent tent side="bottom" className="w-[1500px] sm:max-w-[800px] flex flex-col h-full overflow-hidden p-0 bg-white gap-0" >
          <SheetHeader className="flex-shrink-0 pb-4 border-b p-6">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedScript?.testScriptId}
              {selectedScript && (
                <Badge className={getStatusBadgeVariant(selectedScript.status)}>
                  {selectedScript.status}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription className="text-sm text-gray-600">
              View and manage test script details, upload supporting evidence, and track submission status
            </SheetDescription>
          </SheetHeader>

          {selectedScript && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="p-6 space-y-6">
                  {/* Test Script Information - Expandable */}
                  <div className="bg-gray-50 rounded-lg border">
                    <div
                      className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors rounded-lg"
                      onClick={() => setIsTestScriptInfoExpanded(!isTestScriptInfoExpanded)}
                    >
                      <h3 className="font-medium text-lg">Test Script Information</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {isTestScriptInfoExpanded ? 'Collapse' : 'Expand'}
                        </span>
                        {isTestScriptInfoExpanded ? (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </div>

                    {isTestScriptInfoExpanded && (
                      <div className="px-4 pb-4 space-y-4 border-t border-gray-200">
                        <div className="pt-4">
                          <label className="text-sm font-medium text-gray-600">Third-Party Requirements</label>
                          <p className="text-sm mt-1 p-3 bg-white rounded border">{selectedScript.thirdPartyRequirements}</p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">Test Script</label>
                          <p className="text-sm mt-1 p-3 bg-white rounded border">{selectedScript.testScript}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Content Based on Type and Status */}
                  {selectedScript.type === "COQ" && selectedScript.coqRequest && (
                    <div>
                      <h3 className="font-medium mb-3">COQ Request Details</h3>
                      <Card>
                        <CardContent className="pt-4">
                          <p className="text-sm">{selectedScript.coqRequest}</p>
                        </CardContent>
                      </Card>
                    </div>
                  )}



                  {selectedScript.type === "Action Item" && selectedScript.analystComment && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-3">Analyst Comment</h3>
                        <Card>
                          <CardContent className="pt-4">
                            <p className="text-sm">{selectedScript.analystComment}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {selectedScript.supportingEvidence && (
                        <div>
                          <h3 className="font-medium mb-3">Supporting Evidence Required</h3>
                          <Card>
                            <CardContent className="pt-4">
                              <p className="text-sm">{selectedScript.supportingEvidence}</p>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Show final conclusions for approved test scripts */}
                  {selectedScript.status === "Approved" && (
                    <div>
                      <h3 className="font-medium mb-3">Final Conclusions</h3>
                      <Card className="border-green-200 bg-green-50">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-sm font-medium text-green-900 mb-2">
                                Test Script Approved
                              </div>
                              <div className="text-sm text-green-800">
                                {selectedScript.finalConclusion ||
                                  "Information security awareness training program successfully demonstrates comprehensive compliance with annual training requirements. All documentation provided meets regulatory standards with complete tracking and certification processes validated."
                                }
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Show submitted documents info for responded and approved statuses */}
                  {(selectedScript.status === "COQ Responded" || selectedScript.status === "Action Item Responded" || selectedScript.status === "Approved") && selectedScript.uploadHistory && selectedScript.uploadHistory.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">
                        {selectedScript.type === "COQ" ? "Documents Submitted" : "Evidence Submitted"}
                      </h3>
                      <div className="space-y-2">
                        {(() => {
                          // For Action Items, show only vendor-uploaded documents
                          // For COQ items, show all documents in uploadHistory
                          const documentsToShow = selectedScript.type === "Action Item"
                            ? selectedScript.uploadHistory.filter(upload =>
                              // Show only documents uploaded by vendor (status is not "Incomplete" from initial submission)
                              upload.status === "Under Review" || upload.status === "Approved"
                            )
                            : selectedScript.uploadHistory;

                          return documentsToShow.map((upload, index) => (
                            <Card key={index}>
                              <CardContent className="pt-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-gray-400" />
                                    <div>
                                      <p className="text-sm font-medium">{upload.filename}</p>
                                      <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Clock className="h-3 w-3" />
                                        Submitted on {upload.uploadDate}
                                      </div>
                                    </div>
                                  </div>
                                  <Badge
                                    className={
                                      upload.status === "Approved" ? "bg-green-100 text-green-800 border-green-200" :
                                        upload.status === "Under Review" ? "bg-blue-100 text-blue-800 border-blue-200" :
                                          "bg-red-100 text-red-800 border-red-200"
                                    }
                                  >
                                    {upload.status}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          ));
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Re-upload Requests Section */}
                  {selectedScript.reuploadRequests && selectedScript.reuploadRequests.some(req => req.status === "awaiting_upload") && (
                    <div>
                      <h3 className="font-medium mb-3">Re-upload Requests</h3>
                      <div className="space-y-3">
                        {selectedScript.reuploadRequests
                          .filter(req => req.status === "awaiting_upload")
                          .map((request) => (
                            <Card key={request.id} className="border-amber-200 bg-amber-50">
                              <CardContent className="pt-4">
                                <div className="flex items-start gap-3">
                                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-amber-900 mb-1">
                                      Re-upload Required: {request.documentName}
                                    </div>
                                    <div className="text-sm text-amber-800 mb-2">
                                      {request.reason}
                                    </div>
                                    <div className="text-xs text-amber-700">
                                      Requested: {new Date(request.requestedDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Document Requests Section */}
                  {selectedScript.additionalDocumentRequests && selectedScript.additionalDocumentRequests.some(req => req.status === "awaiting_upload") && (
                    <div>
                      <h3 className="font-medium mb-3">Additional Documents Requested</h3>
                      <div className="space-y-3">
                        {selectedScript.additionalDocumentRequests
                          .filter(req => req.status === "awaiting_upload")
                          .map((request) => (
                            <Card key={request.id} className="border-blue-200 bg-blue-50">
                              <CardContent className="pt-4">
                                <div className="flex items-start gap-3">
                                  <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-blue-900 mb-1">
                                      Additional Documentation Required
                                    </div>
                                    <div className="text-sm text-blue-800 mb-1">
                                      <strong>Requirement:</strong> {request.requirement}
                                    </div>
                                    <div className="text-sm text-blue-800 mb-2">
                                      <strong>Notes:</strong> {request.analystNotes}
                                    </div>
                                    <div className="text-xs text-blue-700">
                                      Requested: {new Date(request.requestedDate).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Upload Section - Show for all non-approved statuses */}
                  {selectedScript.status !== "Approved" && (
                    <div>
                      <h3 className="font-medium mb-3">Upload Supporting Files</h3>

                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                        className="hidden"
                      />

                      {/* Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${selectedScript.status === "COQ Responded" || selectedScript.status === "Action Item Responded"
                          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                          : "border-gray-300 hover:border-gray-400 cursor-pointer"
                          }`}
                        onClick={selectedScript.status === "COQ Responded" || selectedScript.status === "Action Item Responded" ? undefined : handleUploadClick}
                      >
                        <Upload className={`h-8 w-8 mx-auto mb-3 ${selectedScript.status === "COQ Responded" || selectedScript.status === "Action Item Responded"
                          ? "text-gray-300"
                          : "text-gray-400"
                          }`} />
                        <p className={`text-sm mb-2 ${selectedScript.status === "COQ Responded" || selectedScript.status === "Action Item Responded"
                          ? "text-gray-400"
                          : "text-gray-600"
                          }`}>
                          {selectedScript.status === "COQ Responded" || selectedScript.status === "Action Item Responded"
                            ? "Evidence already submitted"
                            : "Drop files here or click to upload"
                          }
                        </p>
                        <p className={`text-xs ${selectedScript.status === "COQ Responded" || selectedScript.status === "Action Item Responded"
                          ? "text-gray-400"
                          : "text-gray-500"
                          }`}>
                          {selectedScript.status === "COQ Responded" || selectedScript.status === "Action Item Responded"
                            ? "No additional uploads required"
                            : "Supported formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG"
                          }
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          disabled={selectedScript.status === "COQ Responded" || selectedScript.status === "Action Item Responded"}
                        >
                          Choose Files
                        </Button>
                      </div>

                      {/* Selected Files Preview */}
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium">Selected Files:</h4>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">{file.name}</p>
                                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}


                </div>
              </div>

              {/* Submit Button - Fixed at bottom */}
              {selectedScript.status !== "Approved" && (
                <div className="flex-shrink-0 p-6 border-t bg-white">
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsDetailsPanelOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        uploadedFiles.length === 0 ||
                        selectedScript.status === "COQ Responded" ||
                        selectedScript.status === "Action Item Responded"
                      }
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>


    </div>
  );
}