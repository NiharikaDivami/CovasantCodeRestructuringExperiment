import { useState, useMemo, useCallback } from "react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import NavigationHeader from "./components/NavigationHeader/NavigationHeader";
import DashboardView from "./components/DashboardView/DashboardView";
import CERDetailView from "./components/CERDetailView/CERDetailView";
import ConversationalTranscriptDetailView from "./components/ConversationalTranscriptDetailView";
import VendorDashboardView from "./components/VendorDashboardView/index";
import ManagerDashboardView from "./components/ManagerDashboardView/ManagerDashboardView";
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay";
import CERDetailViewUpdated from "./components/CERDetailViewUpdated";

type ViewState =
  | { type: "dashboard" }
  | { type: "cer-detail"; cerId: string }
  | {
    type: "transcript-detail";
    scriptId: string;
    fromCerId: string;
  }
  | { type: "vendor-dashboard" }
  | { type: "manager-dashboard" };

type PersonaType = "analyst" | "vendor" | "manager";

type Notification = {
  id: string;
  type:
  | "vendor_submission"
  | "action_item_created"
  | "upload_needs_review"
  | "reupload_requested"
  | "additional_document_requested";
  message: string;
  timestamp: string;
  testScriptId: string;
  vendorName?: string;
  submissionType?: "COQ Responded" | "Action Item Responded";
  cerId?: string;
  isRead: boolean;
  needsApproval?: boolean;
  documentName?: string;
  reuploadReason?: string;
  additionalDocumentRequirement?: string;
};

type TestScriptStatus =
  | "COQ Requested"
  | "COQ Responded"
  | "Action Item Issued"
  | "Action Item Responded"
  | "Approved";

type SharedTestScript = {
  id: string;
  testScriptId: string;
  thirdPartyRequirements: string;
  testScript: string;
  dueDate?: string;
  coqRequest?: string;
  analystComment?: string;
  supportingEvidence?: string;
  status: TestScriptStatus;
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
  reuploadState?:
  | "awaiting_upload"
  | "needs_review"
  | "approved";
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
  finalConclusion?: string;
};

export default function App() {
  const [currentPersona, setCurrentPersona] =
    useState<PersonaType>("analyst");
  const [currentView, setCurrentView] = useState<ViewState>({
    type: "dashboard",
  });
  const [scriptUpdates, setScriptUpdates] = useState<
    Record<string, any>
  >({});
  const [selectedCERs, setSelectedCERs] = useState<string[]>(
    [],
  );
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentCompletedCERs, setAgentCompletedCERs] = useState<
    Set<string>
  >(new Set());
  const [loadingCERs, setLoadingCERs] = useState<Set<string>>(
    new Set(),
  );
  const [approvedVersions, setApprovedVersions] = useState<
    Record<
      string,
      {
        version: string;
        timestamp: string;
        scriptId: string;
        cerId: string;
        approvedData?: any;
      }
    >
  >({});
  const [versionHistory, setVersionHistory] = useState<
    Record<string, any[]>
  >({});
  const [notifications, setNotifications] = useState<
    Notification[]
  >([]);
  const [uploadStates, setUploadStates] = useState<
    Record<
      string,
      "awaiting_upload" | "needs_review" | "approved"
    >
  >({});
  const [processedTestScripts, setProcessedTestScripts] =
    useState<Record<string, Set<string>>>({});
  const [sharedTestScripts, setSharedTestScripts] = useState<
    SharedTestScript[]
  >(() => [
    // Sarah Chen vendor - existing test scripts that are also in analyst flow (COQ Responded with upload history)
    {
      id: "1",
      testScriptId: "TS-324472", // Exists in analyst dashboard
      thirdPartyRequirements:
        "Expense reporting process must include manager approval for expenses over $500 with proper documentation and business justification.",
      testScript:
        "Verify expense reports contain manager signatures, receipt attachments, and business justification for all expenses exceeding $500 threshold.",
      dueDate: "2024-09-15",
      coqRequest:
        "Provide expense reports with manager signatures, receipt attachments, and business justification for expenses exceeding $500.",
      status: "COQ Responded",
      type: "COQ",
      description:
        "Documentation provided for expense reporting process including samples of expense reports with manager approvals, receipt attachments, and business justification for all expenses over $500.",
      uploadHistory: [
        {
          filename: "expense-report-samples.pdf",
          uploadDate: "2024-08-28",
          status: "Under Review",
        },
        {
          filename: "manager-approval-matrix.pdf",
          uploadDate: "2024-08-28",
          status: "Under Review",
        },
      ],
      cerId: "CER-10234",
      vendorName: "Amazon Web Services",
    },
    {
      id: "2",
      testScriptId: "TS-324473", // Exists in analyst dashboard
      thirdPartyRequirements:
        "All purchase orders require dual authorization for amounts exceeding $1,000 and must be approved by department heads.",
      testScript:
        "Review purchase order approval process to ensure dual signatures exist for orders over $1,000 and verify department head approval authority.",
      dueDate: "2024-09-18",
      coqRequest:
        "Provide purchase orders with dual authorization signatures and department head approvals for transactions exceeding $1,000.",
      status: "COQ Responded",
      type: "COQ",
      description:
        "Documentation provided for purchase order approval process including samples with dual authorization signatures and department head approvals for transactions exceeding $1,000.",
      uploadHistory: [
        {
          filename: "purchase-order-samples.pdf",
          uploadDate: "2024-09-01",
          status: "Under Review",
        },
        {
          filename: "dual-auth-process.pdf",
          uploadDate: "2024-09-01",
          status: "Under Review",
        },
      ],
      cerId: "CER-10234",
      vendorName: "Amazon Web Services",
    },
    {
      id: "3",
      testScriptId: "TS-324474", // Exists in analyst dashboard
      thirdPartyRequirements:
        "Invoice processing requires three-way matching (invoice, purchase order, receipt) and approval by authorized personnel.",
      testScript:
        "Test three-way matching process by selecting sample invoices and verifying matching to purchase orders and receipts with proper approvals.",
      dueDate: "2024-09-25",
      coqRequest:
        "Provide invoice processing documentation including three-way matching procedures and approval workflows.",
      status: "COQ Responded",
      type: "COQ",
      description:
        "Invoice processing documentation provided including three-way matching procedures and approval workflows with sample invoices showing proper matching to purchase orders and receipts.",
      uploadHistory: [
        {
          filename: "invoice-matching-procedures.pdf",
          uploadDate: "2024-09-03",
          status: "Under Review",
        },
        {
          filename: "approval-workflows.pdf",
          uploadDate: "2024-09-03",
          status: "Under Review",
        },
      ],
      cerId: "CER-10234",
      vendorName: "Amazon Web Services",
    },
    // Sarah Chen vendor - same series but not existing in analyst dashboard (COQ Requested)
    {
      id: "4",
      testScriptId: "TS-324478", // Same series but not in analyst
      thirdPartyRequirements:
        "Travel expense controls require pre-approval for business trips exceeding $1,000 with detailed itinerary and business justification.",
      testScript:
        "Test travel expense controls including pre-approval workflows, itinerary validation, and business justification review processes.",
      dueDate: "2024-10-05",
      coqRequest:
        "Provide travel expense pre-approval documentation, detailed itineraries, and business justification for trips exceeding $1,000.",
      status: "COQ Requested",
      type: "COQ",
      description:
        "Please provide comprehensive documentation of travel expense controls including pre-approval workflows and business justification processes.",
      cerId: "CER-10234",
      vendorName: "Amazon Web Services",
    },
    {
      id: "5",
      testScriptId: "TS-324479", // Same series but not in analyst
      thirdPartyRequirements:
        "Credit card reconciliation requires monthly statements with supporting receipts and management review of all corporate card transactions.",
      testScript:
        "Review credit card reconciliation process including monthly statement verification, receipt matching, and management oversight procedures.",
      dueDate: "2024-10-08",
      coqRequest:
        "Provide credit card reconciliation documentation, monthly statements with matched receipts, and management review records.",
      status: "COQ Requested",
      type: "COQ",
      description:
        "Please provide documentation of credit card reconciliation controls including monthly statement processing and management oversight.",
      cerId: "CER-10234",
      vendorName: "Amazon Web Services",
    },
    {
      id: "6",
      testScriptId: "TS-324480", // Same series but not in analyst
      thirdPartyRequirements:
        "Vendor payment controls require three-way matching with purchase orders, invoices, and receiving reports before payment authorization.",
      testScript:
        "Test vendor payment controls including three-way matching procedures and payment authorization workflows.",
      dueDate: "2024-10-10",
      coqRequest:
        "Provide vendor payment documentation including three-way matching evidence and payment authorization records.",
      status: "COQ Requested",
      type: "COQ",
      description:
        "Please provide comprehensive documentation of vendor payment controls including three-way matching and authorization procedures.",
      cerId: "CER-10234",
      vendorName: "Amazon Web Services",
    },
    // Same series test script with Approved status and complete data
    {
      id: "7",
      testScriptId: "TS-324481", // Same series but different number
      thirdPartyRequirements:
        "Information security awareness training must be completed annually by all employees with tracking and certification documentation.",
      testScript:
        "Verify information security awareness training completion rates, review training materials, and validate certification tracking processes.",
      dueDate: "2024-08-15",
      coqRequest:
        "Provide security awareness training records, completion certificates, and annual training schedule documentation.",
      status: "Approved",
      type: "COQ",
      description:
        "Information security awareness training program documentation including completion tracking, certification records, and annual training schedules.",
      uploadHistory: [
        {
          filename: "security-training-completion-2024.pdf",
          uploadDate: "2024-08-10",
          status: "Approved",
        },
        {
          filename: "training-certificates.pdf",
          uploadDate: "2024-08-10",
          status: "Approved",
        },
        {
          filename: "annual-training-schedule.pdf",
          uploadDate: "2024-08-10",
          status: "Approved",
        },
      ],
      analystComment:
        "All required documentation provided. Training program meets compliance requirements with comprehensive tracking and certification processes.",
      supportingEvidence:
        "Complete training records with 100% completion rate, valid certificates, and well-structured annual training schedule.",
      cerId: "CER-10234",
      vendorName: "Amazon Web Services",
    },
  ]);

  const handleBackToDashboard = useCallback(() => {
    // Return to appropriate dashboard based on current persona
    if (currentPersona === "vendor") {
      setCurrentView({ type: "vendor-dashboard" });
    } else if (currentPersona === "manager") {
      setCurrentView({ type: "manager-dashboard" });
    } else {
      setCurrentView({ type: "dashboard" });
    }
  }, [currentPersona]);

  // Get script data for breadcrumb context - now using CER-specific IDs
  const getScriptTitle = useCallback(
    (scriptId: string) => {
      // Get the current CER context
      const currentCerId =
        currentView.type === "transcript-detail"
          ? currentView.fromCerId
          : currentView.type === "cer-detail"
            ? currentView.cerId
            : "";

      // CER-specific test script mappings - each CER has unique test script IDs
      // Only includes test scripts that exist in analyst dashboard (Action Items and Approved)
      const scriptMap: Record<
        string,
        Record<string, string>
      > = {
        "CER-10234": {
          "ts-1": "TS-324472", // COQ - only in analyst
          "ts-2": "TS-324473", // Action Item - shared
          "ts-3": "TS-324474", // Action Item - shared
          "ts-4": "TS-324475",
          "ts-5": "TS-324476",
          "ts-6": "TS-324477",
        },
        "CER-10567": {
          "ts-1": "TS-325001",
          "ts-2": "TS-325002", // Approved - shared
          "ts-3": "TS-325003",
          "ts-4": "TS-325004",
          "ts-5": "TS-325005",
          "ts-6": "TS-325006",
        },
        "CER-10892": {
          "ts-1": "TS-326001", // COQ - only in analyst
          "ts-2": "TS-326002",
          "ts-3": "TS-326003",
          "ts-4": "TS-326004",
          "ts-5": "TS-326005",
          "ts-6": "TS-326006",
        },
        "CER-11001": {
          "ts-1": "TS-327001", // Action Item - shared
          "ts-2": "TS-327002",
        },
        "CER-11234": {
          "ts-1": "TS-328001",
          "ts-2": "TS-328002",
        },
        "CER-11567": {
          "ts-1": "TS-329001",
          "ts-2": "TS-329002",
        },
        "CER-11892": {
          "ts-1": "TS-330001",
          "ts-2": "TS-330002",
        },
        "CER-12001": {
          "ts-1": "TS-331001",
          "ts-2": "TS-331002",
        },
        "CER-12234": {
          "ts-1": "TS-332001",
          "ts-2": "TS-332002",
        },
        "CER-12567": {
          "ts-1": "TS-333001",
          "ts-2": "TS-333002",
        },
        "CER-10901": {
          "ts-1": "TS-340001",
          "ts-2": "TS-340002",
        },
        "CER-10923": {
          "ts-1": "TS-341001",
          "ts-2": "TS-341002",
        },
        "CER-10956": {
          "ts-1": "TS-342001",
          "ts-2": "TS-342002",
        },
        "CER-11089": {
          "ts-1": "TS-343001",
          "ts-2": "TS-343002",
        },
        "CER-11156": {
          "ts-1": "TS-344001",
          "ts-2": "TS-344002",
        },
        "CER-11203": {
          "ts-1": "TS-345001",
          "ts-2": "TS-345002",
        },
        "CER-11278": {
          "ts-1": "TS-346001",
          "ts-2": "TS-346002",
        },
        "CER-11324": {
          "ts-1": "TS-347001",
          "ts-2": "TS-347002",
        },
      };

      return (
        scriptMap[currentCerId]?.[scriptId] || "TS-UNKNOWN"
      );
    },
    [currentView],
  );

  const getBreadcrumbs = useMemo(() => {
    switch (currentView.type) {
      case "dashboard":
        return [];
      case "vendor-dashboard":
        return [];
      case "manager-dashboard":
        return [];
      case "cer-detail":
        return [
          {
            label: "Dashboard",
            onClick: handleBackToDashboard,
          },
          { label: currentView.cerId },
        ];
      case "transcript-detail":
        return [
          {
            label: "Dashboard",
            onClick: handleBackToDashboard,
          },
          {
            label: currentView.fromCerId,
            onClick: () =>
              setCurrentView({
                type: "cer-detail",
                cerId: currentView.fromCerId,
              }),
          },
          { label: getScriptTitle(currentView.scriptId) },
        ];
      default:
        return [];
    }
  }, [currentView, handleBackToDashboard, getScriptTitle]);

  const handlePersonaChange = useCallback(
    (persona: PersonaType) => {
      setCurrentPersona(persona);
      // Switch to appropriate dashboard based on persona
      if (persona === "vendor") {
        setCurrentView({ type: "vendor-dashboard" });
      } else if (persona === "manager") {
        setCurrentView({ type: "manager-dashboard" });
      } else {
        setCurrentView({ type: "dashboard" });
      }
    },
    [],
  );

  const handleOpenCER = useCallback((cerId: string) => {
    setCurrentView({ type: "cer-detail", cerId });
  }, []);

  const handleOpenScript = useCallback(
    (
      scriptId: string,
      fromCerId?: string,
      notificationId?: string,
    ) => {
      // Get the current CER ID for context, with fallback logic
      let contextCerId = fromCerId;
      if (!contextCerId) {
        if (currentView.type === "cer-detail") {
          contextCerId = currentView.cerId;
        } else if (currentView.type === "transcript-detail") {
          contextCerId = currentView.fromCerId;
        } else if (notificationId) {
          // Try to find CER ID from notification context if available
          const notification = notifications.find(
            (n) => n.id === notificationId,
          );
          if (notification && notification.cerId) {
            contextCerId = notification.cerId;
          } else {
            contextCerId = "CER-10567"; // fallback
          }
        } else {
          contextCerId = "CER-10567"; // fallback
        }
      }
      setCurrentView({
        type: "transcript-detail",
        scriptId,
        fromCerId: contextCerId,
      });
    },
    [currentView, notifications],
  );

  // Helper function to map actual test script ID back to internal script ID
  const getInternalScriptId = useCallback(
    (actualTestScriptId: string, cerId: string): string => {
      // Reverse mapping from actual test script IDs to internal script IDs
      // Only maps test script IDs that exist in the analyst dashboard (Action Items and Approved)
      const reverseScriptMap: Record<
        string,
        Record<string, string>
      > = {
        "CER-10234": {
          "TS-324473": "ts-2", // Action Item
          "TS-324474": "ts-3", // Action Item
          "TS-324475": "ts-4",
          "TS-324476": "ts-5",
          "TS-324477": "ts-6",
        },
        "CER-10567": {
          "TS-325001": "ts-1",
          "TS-325002": "ts-2", // Approved
          "TS-325003": "ts-3",
          "TS-325004": "ts-4",
          "TS-325005": "ts-5",
          "TS-325006": "ts-6",
        },
        "CER-10892": {
          "TS-326002": "ts-2",
          "TS-326003": "ts-3",
          "TS-326004": "ts-4",
          "TS-326005": "ts-5",
          "TS-326006": "ts-6",
        },
        "CER-11001": {
          "TS-327001": "ts-1", // Action Item
          "TS-327002": "ts-2",
        },
        "CER-11234": {
          "TS-328001": "ts-1",
          "TS-328002": "ts-2",
        },
        "CER-11567": {
          "TS-329001": "ts-1",
          "TS-329002": "ts-2",
        },
        "CER-11892": {
          "TS-330001": "ts-1",
          "TS-330002": "ts-2",
        },
        "CER-12001": {
          "TS-331001": "ts-1",
          "TS-331002": "ts-2",
        },
        "CER-12234": {
          "TS-332001": "ts-1",
          "TS-332002": "ts-2",
        },
        "CER-12567": {
          "TS-333001": "ts-1",
          "TS-333002": "ts-2",
        },
        "CER-10901": {
          "TS-340001": "ts-1",
          "TS-340002": "ts-2",
        },
        "CER-10923": {
          "TS-341001": "ts-1",
          "TS-341002": "ts-2",
        },
        "CER-10956": {
          "TS-342001": "ts-1",
          "TS-342002": "ts-2",
        },
        "CER-11089": {
          "TS-343001": "ts-1",
          "TS-343002": "ts-2",
        },
        "CER-11156": {
          "TS-344001": "ts-1",
          "TS-344002": "ts-2",
        },
        "CER-11203": {
          "TS-345001": "ts-1",
          "TS-345002": "ts-2",
        },
        "CER-11278": {
          "TS-346001": "ts-1",
          "TS-346002": "ts-2",
        },
        "CER-11324": {
          "TS-347001": "ts-1",
          "TS-347002": "ts-2",
        },
      };

      return (
        reverseScriptMap[cerId]?.[actualTestScriptId] || "ts-1"
      ); // fallback
    },
    [],
  );

  const handleMarkNotificationAsRead = useCallback(
    (notificationId: string) => {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification,
        ),
      );
    },
    [],
  );

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      // Mark notification as read
      handleMarkNotificationAsRead(notification.id);

      if (notification.type === "vendor_submission") {
        // Switch to analyst persona and navigate directly to test script details
        setCurrentPersona("analyst");
        if (notification.cerId && notification.testScriptId) {
          // Get the internal script ID for navigation
          const internalScriptId = getInternalScriptId(
            notification.testScriptId,
            notification.cerId,
          );
          // Navigate directly to transcript-detail view with the correct test script
          setCurrentView({
            type: "transcript-detail",
            scriptId: internalScriptId,
            fromCerId: notification.cerId,
          });
        } else {
          setCurrentView({ type: "dashboard" });
        }
      } else if (notification.type === "action_item_created") {
        // Switch to vendor persona and go to vendor dashboard
        setCurrentPersona("vendor");
        setCurrentView({ type: "vendor-dashboard" });
      } else if (notification.type === "upload_needs_review") {
        // For upload review notifications, navigate directly to test script analysis
        setCurrentPersona("analyst");
        if (notification.cerId && notification.testScriptId) {
          // Get the internal script ID for navigation
          const internalScriptId = getInternalScriptId(
            notification.testScriptId,
            notification.cerId,
          );
          // Navigate directly to transcript-detail view with the correct test script
          setCurrentView({
            type: "transcript-detail",
            scriptId: internalScriptId,
            fromCerId: notification.cerId,
          });
        } else {
          setCurrentView({ type: "dashboard" });
        }
      } else if (
        notification.type === "reupload_requested" ||
        notification.type === "additional_document_requested"
      ) {
        // Switch to vendor persona and go to vendor dashboard
        setCurrentPersona("vendor");
        setCurrentView({ type: "vendor-dashboard" });
      }
    },
    [handleMarkNotificationAsRead, getInternalScriptId],
  );

  const handleBackToCERDetail = () => {
    if (currentView.type === "transcript-detail") {
      setCurrentView({
        type: "cer-detail",
        cerId: currentView.fromCerId,
      });
    }
  };

  // Get CER data for breadcrumb context
  const getCERTitle = useCallback((cerId: string) => {
    const cerMap: Record<string, string> = {
      "CER-10234": "Amazon Web Services",
      "CER-10567": "Microsoft Azure",
      "CER-10892": "Google Cloud Platform",
      "CER-11001": "Oracle Corporation",
      "CER-11234": "Salesforce Inc",
      "CER-11567": "IBM Cloud",
      "CER-11892": "Snowflake Inc",
      "CER-12001": "ServiceNow",
      "CER-12234": "SAP SE",
      "CER-12567": "Workday Inc",
      "CER-10901": "Adobe Systems",
      "CER-10923": "Atlassian Corp",
      "CER-10956": "Zoom Video",
      "CER-11089": "Slack Technologies",
      "CER-11156": "Box Inc",
      "CER-11203": "HubSpot Inc",
      "CER-11278": "Dropbox Inc",
      "CER-11324": "Zendesk Inc",
    };
    return cerMap[cerId] || "Unknown Vendor";
  }, []);

  const handleScriptUpdate = useCallback(
    (scriptId: string, updates: any) => {
      setScriptUpdates((prev) => ({
        ...prev,
        [scriptId]: {
          ...prev[scriptId],
          ...updates,
          // Preserve version history if it exists
          versionHistory: prev[scriptId]?.versionHistory || [],
        },
      }));
    },
    [],
  );

  // Handle version updates when repopulating
  const handleVersionUpdate = (
    version: string,
    analysisData: any,
  ) => {
    if (currentView.type === "transcript-detail") {
      const versionHistoryKey = `${currentView.fromCerId}_${currentView.scriptId}`;
      setVersionHistory((prev) => {
        const existingHistory = prev[versionHistoryKey] || [];
        const newVersionEntry = {
          version: version,
          timestamp: new Date().toISOString(),
          analysisData: analysisData,
          status: "generated",
          // Preserve human insight if it exists
          humanInsight: analysisData.humanInsight || null,
        };

        // Add to history if this version isn't already there
        const versionExists = existingHistory.some(
          (entry) => entry.version === version,
        );
        if (!versionExists) {
          return {
            ...prev,
            [versionHistoryKey]: [
              ...existingHistory,
              newVersionEntry,
            ],
          };
        }
        return prev;
      });
    }
  };

  const handleApproveAndNavigate = (
    approvedVersion: string,
    analysisData: any,
  ) => {
    // Capture the approved version information with complete analysis data
    if (currentView.type === "transcript-detail") {
      const approvalKey = `${currentView.fromCerId}_${currentView.scriptId}`;

      // Store approved version
      setApprovedVersions((prev) => ({
        ...prev,
        [approvalKey]: {
          version: approvedVersion,
          timestamp: new Date().toISOString(),
          scriptId: currentView.scriptId,
          cerId: currentView.fromCerId,
          approvedData: analysisData, // Store the complete analysis data
        },
      }));

      // Store in version history for future access
      const versionHistoryKey = `${currentView.fromCerId}_${currentView.scriptId}`;
      setVersionHistory((prev) => {
        const existingHistory = prev[versionHistoryKey] || [];
        const newVersionEntry = {
          version: approvedVersion,
          timestamp: new Date().toISOString(),
          analysisData: analysisData,
          status: "approved",
          // Preserve human insight if it exists
          humanInsight: analysisData.humanInsight || null,
        };

        // Add to history if this version isn't already there
        const versionExists = existingHistory.some(
          (entry) => entry.version === approvedVersion,
        );
        if (!versionExists) {
          return {
            ...prev,
            [versionHistoryKey]: [
              ...existingHistory,
              newVersionEntry,
            ],
          };
        }
        return prev;
      });

      // Navigate back to CER detail view (listing screen)
      setCurrentView({
        type: "cer-detail",
        cerId: currentView.fromCerId,
      });
    }
  };

  const handleRunAgent = async () => {
    if (selectedCERs.length === 0) return;

    setIsAgentRunning(true);
    setLoadingCERs(new Set(selectedCERs));

    // Simulate agent processing for each selected CER
    setTimeout(() => {
      handleAgentComplete();
    }, 3000); // 3 second delay to simulate processing
  };

  // New function to handle running agent for individual CER
  const handleRunAgentForCER = async (
    cerId: string,
    selectedScripts?: string[],
  ) => {
    setIsAgentRunning(true);
    setLoadingCERs(new Set([cerId]));

    // Log the selected scripts for debugging/future use
    if (selectedScripts && selectedScripts.length > 0) {
      console.log(
        `Running agent on CER ${cerId} for selected scripts:`,
        selectedScripts,
      );
    } else {
      console.log(`Running agent on entire CER ${cerId}`);
    }

    // Simulate agent processing for the specific CER
    setTimeout(() => {
      handleAgentCompleteForCER(cerId, selectedScripts);
    }, 3000); // 3 second delay to simulate processing
  };

  const handleAgentComplete = () => {
    // Mark selected CERs as completed by agent
    setAgentCompletedCERs((prev) => {
      const newSet = new Set(prev);
      selectedCERs.forEach((cerId) => newSet.add(cerId));
      return newSet;
    });

    // Reset states
    setIsAgentRunning(false);
    setLoadingCERs(new Set());
    setSelectedCERs([]); // Clear selection after completion

    // Stay on current view (dashboard)

    // Show green success toast
    toast("Agent run complete successfully", {
      className:
        "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
      style: {
        backgroundColor: "#dcfce7",
        borderColor: "#22c55e",
        color: "#166534",
      },
    });
  };

  // Helper function to get all test script IDs for a given CER
  const getCERTestScriptIds = useCallback(
    (cerId: string): string[] => {
      // This should match the test script structure in CERDetailView
      const scriptCountByCER: Record<string, number> = {
        "CER-10234": 6, // ts-1 to ts-6 (now includes all 6 test scripts)
        "CER-10567": 2, // ts-1 to ts-2
        "CER-10892": 2, // ts-1 to ts-2
        "CER-11001": 2, // ts-1, ts-2
        "CER-11234": 2, // ts-1, ts-2
        "CER-11567": 2, // ts-1, ts-2
        "CER-11892": 2, // ts-1, ts-2
        "CER-12001": 2, // ts-1, ts-2
        "CER-12234": 2, // ts-1, ts-2
        "CER-12567": 2, // ts-1, ts-2
        "CER-10901": 2, // ts-1, ts-2
        "CER-10923": 2, // ts-1, ts-2
        "CER-10956": 2, // ts-1, ts-2
        "CER-11089": 2, // ts-1, ts-2
        "CER-11156": 2, // ts-1, ts-2
        "CER-11203": 2, // ts-1, ts-2
        "CER-11278": 2, // ts-1, ts-2
        "CER-11324": 2, // ts-1, ts-2
      };

      const scriptCount = scriptCountByCER[cerId] || 2;
      return Array.from(
        { length: scriptCount },
        (_, index) => `ts-${index + 1}`,
      );
    },
    [],
  );

  const handleAgentCompleteForCER = (
    cerId: string,
    selectedScripts?: string[],
  ) => {
    // Mark specific CER as completed by agent
    setAgentCompletedCERs((prev) => {
      const newSet = new Set(prev);
      newSet.add(cerId);
      return newSet;
    });

    // Update processedTestScripts to track which specific test scripts have been processed
    setProcessedTestScripts((prev) => {
      const newProcessedScripts = { ...prev };

      if (selectedScripts && selectedScripts.length > 0) {
        // Only mark the selected test scripts as processed
        if (!newProcessedScripts[cerId]) {
          newProcessedScripts[cerId] = new Set();
        }
        selectedScripts.forEach((scriptId) => {
          newProcessedScripts[cerId].add(scriptId);
        });
      } else {
        // If no specific scripts selected, mark all test scripts for this CER as processed
        // Get all test script IDs for this CER
        const allTestScriptIds = getCERTestScriptIds(cerId);
        newProcessedScripts[cerId] = new Set(allTestScriptIds);
      }

      return newProcessedScripts;
    });

    // Reset states
    setIsAgentRunning(false);
    setLoadingCERs(new Set());
    setSelectedCERs([]); // Clear selection after completion

    // Stay on current view (dashboard)

    // Show green success toast
    toast("Agent run complete successfully", {
      className:
        "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
      style: {
        backgroundColor: "#dcfce7",
        borderColor: "#22c55e",
        color: "#166534",
      },
    });
  };

  const handleCERSelection = useCallback((cerIds: string[]) => {
    setSelectedCERs(cerIds);
  }, []);

  const updateTestScriptStatus = (
    testScriptId: string,
    newStatus: TestScriptStatus,
    uploadHistory?: Array<{
      filename: string;
      uploadDate: string;
      status: string;
    }>,
  ) => {
    setSharedTestScripts((prev) =>
      prev.map((script) => {
        if (script.testScriptId === testScriptId) {
          return {
            ...script,
            status: newStatus,
            ...(uploadHistory && {
              uploadHistory: [
                ...(script.uploadHistory || []),
                ...uploadHistory,
              ],
            }),
          };
        }
        return script;
      }),
    );
  };

  const handleVendorSubmission = (
    testScriptId: string,
    submissionType: "COQ Responded" | "Action Item Responded",
    vendorName: string,
  ) => {
    // Update the shared test script status
    updateTestScriptStatus(testScriptId, submissionType);

    // Find the test script to get the CER ID for the notification
    const testScript = sharedTestScripts.find(
      (script) => script.testScriptId === testScriptId,
    );

    // Check if this is an action item submission that needs approval
    const currentUploadState = uploadStates[testScriptId];

    if (
      submissionType === "Action Item Responded" &&
      currentUploadState === "awaiting_upload"
    ) {
      // This is a document upload in response to an action item - needs review
      setUploadStates((prev) => ({
        ...prev,
        [testScriptId]: "needs_review",
      }));

      setSharedTestScripts((prev) =>
        prev.map((script) => {
          if (script.testScriptId === testScriptId) {
            return {
              ...script,
              reuploadState: "needs_review",
              uploadPendingApproval: true,
            };
          }
          return script;
        }),
      );

      // Create "needs review" notification
      const newNotification: Notification = {
        id: `notification-${Date.now()}-${Math.random()}`,
        type: "upload_needs_review",
        message: `Document upload from ${vendorName} needs review`,
        timestamp: new Date().toISOString(),
        testScriptId,
        vendorName,
        submissionType,
        cerId: testScript?.cerId,
        isRead: false,
        needsApproval: true,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Show toast notification for immediate feedback
      toast(`Document upload from ${vendorName} needs review`, {
        className:
          "border-blue-500 bg-blue-100 text-blue-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#dbeafe",
          borderColor: "#3b82f6",
          color: "#1e40af",
        },
      });
    } else {
      // Regular submission notification
      const newNotification: Notification = {
        id: `notification-${Date.now()}-${Math.random()}`,
        type: "vendor_submission",
        message: `New ${submissionType === "COQ Responded" ? "COQ" : "Action Item"} submission from ${vendorName}`,
        timestamp: new Date().toISOString(),
        testScriptId,
        vendorName,
        submissionType,
        cerId: testScript?.cerId,
        isRead: false,
      };

      setNotifications((prev) => [newNotification, ...prev]);

      // Show toast notification for immediate feedback
      toast(
        `New ${submissionType === "COQ Responded" ? "COQ" : "Action Item"} submission from ${vendorName}`,
        {
          className:
            "border-blue-500 bg-blue-100 text-blue-800 font-medium shadow-lg",
          style: {
            backgroundColor: "#dbeafe",
            borderColor: "#3b82f6",
            color: "#1e40af",
          },
        },
      );
    }
  };

  const handleActionItemCreated = (
    testScriptId: string,
    cerId: string,
    vendorName: string,
  ) => {
    // Convert the test script from COQ to Action Item in vendor dashboard
    setSharedTestScripts((prev) =>
      prev.map((script) => {
        if (script.testScriptId === testScriptId) {
          return {
            ...script,
            status: "Action Item Issued",
            type: "Action Item",
            // Add analyst comment and supporting evidence for action items
            analystComment: `Action item created for ${testScriptId}. Please provide additional documentation as requested.`,
            supportingEvidence:
              "Additional documentation required",
            reuploadState: "awaiting_upload",
          };
        }
        return script;
      }),
    );

    // Set upload state to awaiting_upload for this test script
    setUploadStates((prev) => ({
      ...prev,
      [testScriptId]: "awaiting_upload",
    }));

    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random()}`,
      type: "action_item_created",
      message: `Action item created for ${testScriptId}`,
      timestamp: new Date().toISOString(),
      testScriptId,
      cerId,
      vendorName,
      isRead: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast notification for immediate feedback
    toast(`Action item created for ${testScriptId}`, {
      className:
        "border-amber-500 bg-amber-100 text-amber-800 font-medium shadow-lg",
      style: {
        backgroundColor: "#fef3c7",
        borderColor: "#f59e0b",
        color: "#92400e",
      },
    });
  };

  const handleApproveUpload = (testScriptId: string) => {
    // Update upload state to approved
    setUploadStates((prev) => ({
      ...prev,
      [testScriptId]: "approved",
    }));

    // Update shared test script
    setSharedTestScripts((prev) =>
      prev.map((script) => {
        if (script.testScriptId === testScriptId) {
          return {
            ...script,
            reuploadState: "approved",
            uploadPendingApproval: false,
          };
        }
        return script;
      }),
    );

    // Remove any pending approval notifications for this test script
    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          !(
            notification.testScriptId === testScriptId &&
            notification.type === "upload_needs_review"
          ),
      ),
    );

    // Show success toast
    toast(`Upload approved for ${testScriptId}`, {
      className:
        "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
      style: {
        backgroundColor: "#dcfce7",
        borderColor: "#22c55e",
        color: "#166534",
      },
    });
  };

  const handleRequestReupload = (
    testScriptId: string,
    cerId: string,
    documentName: string,
    reason: string,
    analystNotes?: string,
  ) => {
    const requestId = `reupload-${Date.now()}-${Math.random()}`;

    // Combine reason and analyst notes for the analyst comment
    const combinedAnalystComment = analystNotes
      ? `${reason}: ${analystNotes}`
      : reason;

    // Update shared test script with reupload request
    setSharedTestScripts((prev) =>
      prev.map((script) => {
        if (script.testScriptId === testScriptId) {
          const updatedReuploadRequests = [
            ...(script.reuploadRequests || []),
            {
              id: requestId,
              documentName,
              reason: combinedAnalystComment, // Use combined comment
              requestedDate: new Date().toISOString(),
              status: "awaiting_upload" as const,
            },
          ];

          return {
            ...script,
            status: "Action Item Issued", // Always set to Action Item Issued when re-upload is requested
            type: "Action Item",
            reuploadState: "awaiting_upload",
            reuploadRequests: updatedReuploadRequests,
            analystComment: combinedAnalystComment, // Use combined reason and notes as analyst comment
            supportingEvidence: `Re-upload requested for: ${documentName}`, // Show which document is requested in supporting evidence
          };
        }
        return script;
      }),
    );

    // Set upload state to awaiting_upload for this test script
    setUploadStates((prev) => ({
      ...prev,
      [testScriptId]: "awaiting_upload",
    }));

    // If this test script was previously approved, remove it from approved versions since re-upload is now required
    // This ensures the analyst can approve again after vendor provides new documentation
    const approvalKey = `${cerId}_${getInternalScriptId(testScriptId, cerId)}`;
    setApprovedVersions((prev) => {
      const newApprovedVersions = { ...prev };
      if (newApprovedVersions[approvalKey]) {
        delete newApprovedVersions[approvalKey];
      }
      return newApprovedVersions;
    });

    // Find vendor name from test script
    const testScript = sharedTestScripts.find(
      (script) => script.testScriptId === testScriptId,
    );
    const vendorName =
      testScript?.vendorName || "Unknown Vendor";

    // Create notification for vendor
    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random()}`,
      type: "reupload_requested",
      message: `Re-upload requested for ${documentName} in ${testScriptId}`,
      timestamp: new Date().toISOString(),
      testScriptId,
      cerId,
      vendorName,
      isRead: false,
      documentName,
      reuploadReason: combinedAnalystComment,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast notification
    toast(`Re-upload request sent for ${documentName}`, {
      className:
        "border-amber-500 bg-amber-100 text-amber-800 font-medium shadow-lg",
      style: {
        backgroundColor: "#fef3c7",
        borderColor: "#f59e0b",
        color: "#92400e",
      },
    });
  };

  const handleRequestAdditionalDocument = (
    testScriptId: string,
    cerId: string,
    requirement: string,
    analystNotes: string,
  ) => {
    const requestId = `additional-doc-${Date.now()}-${Math.random()}`;

    // Update shared test script with additional document request
    setSharedTestScripts((prev) =>
      prev.map((script) => {
        if (script.testScriptId === testScriptId) {
          const updatedAdditionalDocRequests = [
            ...(script.additionalDocumentRequests || []),
            {
              id: requestId,
              requirement,
              analystNotes,
              requestedDate: new Date().toISOString(),
              status: "awaiting_upload" as const,
            },
          ];

          return {
            ...script,
            status: "Action Item Issued", // Always set to Action Item Issued when additional document is requested
            type: "Action Item",
            additionalDocumentRequests:
              updatedAdditionalDocRequests,
            analystComment: analystNotes,
            supportingEvidence: `Asked for additional documents: ${analystNotes}`,
          };
        }
        return script;
      }),
    );

    // Set upload state to awaiting_upload for this test script
    setUploadStates((prev) => ({
      ...prev,
      [testScriptId]: "awaiting_upload",
    }));

    // If this test script was previously approved, remove it from approved versions since additional documentation is now required
    const approvalKey = `${cerId}_${getInternalScriptId(testScriptId, cerId)}`;
    setApprovedVersions((prev) => {
      const newApprovedVersions = { ...prev };
      if (newApprovedVersions[approvalKey]) {
        delete newApprovedVersions[approvalKey];
      }
      return newApprovedVersions;
    });

    // Find vendor name from test script
    const testScript = sharedTestScripts.find(
      (script) => script.testScriptId === testScriptId,
    );
    const vendorName =
      testScript?.vendorName || "Unknown Vendor";

    // Create notification for vendor
    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random()}`,
      type: "additional_document_requested",
      message: `Additional document requested for ${testScriptId}`,
      timestamp: new Date().toISOString(),
      testScriptId,
      cerId,
      vendorName,
      isRead: false,
      additionalDocumentRequirement: requirement,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast notification
    toast(
      `Additional document request sent for ${testScriptId}`,
      {
        className:
          "border-amber-500 bg-amber-100 text-amber-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#fef3c7",
          borderColor: "#f59e0b",
          color: "#92400e",
        },
      },
    );
  };

  const handleApproveReupload = (
    testScriptId: string,
    documentName: string,
  ) => {
    // Update shared test script reupload request status to approved and reset states
    setSharedTestScripts((prev) =>
      prev.map((script) => {
        if (script.testScriptId === testScriptId) {
          // Remove the approved reupload request to reset the state
          const updatedReuploadRequests = (
            script.reuploadRequests || []
          ).filter(
            (request) =>
              !(
                request.documentName === documentName &&
                request.status === "needs_review"
              ),
          );

          return {
            ...script,
            reuploadState: undefined, // Reset reupload state
            uploadPendingApproval: false,
            reuploadRequests: updatedReuploadRequests,
            // Reset back to original state if no more reupload requests
            status:
              updatedReuploadRequests.length === 0
                ? "COQ Responded"
                : script.status,
            type:
              updatedReuploadRequests.length === 0
                ? "COQ"
                : script.type,
          };
        }
        return script;
      }),
    );

    // Reset upload state
    setUploadStates((prev) => {
      const newStates = { ...prev };
      delete newStates[testScriptId]; // Remove the upload state completely
      return newStates;
    });

    // Remove any pending approval notifications for this test script and document
    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          !(
            notification.testScriptId === testScriptId &&
            notification.type === "upload_needs_review" &&
            notification.documentName === documentName
          ),
      ),
    );

    // Show success toast
    toast(
      `Document "${documentName}" approved for ${testScriptId}`,
      {
        className:
          "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#dcfce7",
          borderColor: "#22c55e",
          color: "#166534",
        },
      },
    );
  };

  const handleAdditionalDocumentSubmission = (
    testScriptId: string,
  ) => {
    // Find the test script to get the CER ID and vendor name
    const testScript = sharedTestScripts.find(
      (script) => script.testScriptId === testScriptId,
    );

    // Update shared test script additional document request status to needs_review AND change overall status to "Action Item Responded"
    setSharedTestScripts((prev) =>
      prev.map((script) => {
        if (script.testScriptId === testScriptId) {
          const updatedAdditionalDocRequests = (
            script.additionalDocumentRequests || []
          ).map((request) =>
            request.status === "awaiting_upload"
              ? { ...request, status: "needs_review" as const }
              : request,
          );

          return {
            ...script,
            status: "Action Item Responded", // Update main status when vendor responds
            additionalDocumentRequests:
              updatedAdditionalDocRequests,
          };
        }
        return script;
      }),
    );

    // Update upload state to needs_review
    setUploadStates((prev) => ({
      ...prev,
      [testScriptId]: "needs_review",
    }));

    // Create "needs review" notification for analyst
    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random()}`,
      type: "upload_needs_review",
      message: `Additional document uploaded for ${testScriptId} needs review`,
      timestamp: new Date().toISOString(),
      testScriptId,
      vendorName: testScript?.vendorName,
      cerId: testScript?.cerId,
      isRead: false,
      needsApproval: true,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast notification
    toast(
      `Additional document uploaded successfully for ${testScriptId}`,
      {
        className:
          "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#dcfce7",
          borderColor: "#22c55e",
          color: "#166534",
        },
      },
    );
  };

  const handleReuploadSubmission = (
    testScriptId: string,
    documentName: string,
  ) => {
    // Find the test script to get the CER ID and vendor name
    const testScript = sharedTestScripts.find(
      (script) => script.testScriptId === testScriptId,
    );

    // Update shared test script reupload request status to needs_review AND change overall status to "Action Item Responded"
    setSharedTestScripts((prev) =>
      prev.map((script) => {
        if (script.testScriptId === testScriptId) {
          const updatedReuploadRequests = (
            script.reuploadRequests || []
          ).map((request) =>
            request.documentName === documentName &&
              request.status === "awaiting_upload"
              ? { ...request, status: "needs_review" as const }
              : request,
          );

          return {
            ...script,
            status: "Action Item Responded", // Update main status when vendor responds
            reuploadState: "needs_review",
            uploadPendingApproval: true,
            reuploadRequests: updatedReuploadRequests,
          };
        }
        return script;
      }),
    );

    // Update upload state to needs_review
    setUploadStates((prev) => ({
      ...prev,
      [testScriptId]: "needs_review",
    }));

    // Create "needs review" notification for analyst
    const newNotification: Notification = {
      id: `notification-${Date.now()}-${Math.random()}`,
      type: "upload_needs_review",
      message: `Re-uploaded document "${documentName}" needs review for ${testScriptId}`,
      timestamp: new Date().toISOString(),
      testScriptId,
      vendorName: testScript?.vendorName,
      cerId: testScript?.cerId,
      isRead: false,
      needsApproval: true,
      documentName,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast notification
    toast(
      `Document re-uploaded successfully for ${testScriptId}`,
      {
        className:
          "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#dcfce7",
          borderColor: "#22c55e",
          color: "#166534",
        },
      },
    );
  };

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const renderCurrentView = () => {
    switch (currentView.type) {
      case "dashboard":
        return (
          <DashboardView
            onOpenCER={handleOpenCER}
            selectedCERs={selectedCERs}
            onCERSelection={handleCERSelection}
            isAgentRunning={isAgentRunning}
            onRunAgent={handleRunAgent}
            agentCompletedCERs={agentCompletedCERs}
            loadingCERs={loadingCERs}
            processedTestScripts={processedTestScripts}
            getCERTestScriptIds={getCERTestScriptIds}
          />
        );
      case "vendor-dashboard":
        return (
          <VendorDashboardView
            onVendorSubmission={handleVendorSubmission}
            sharedTestScripts={sharedTestScripts}
            onTestScriptStatusUpdate={updateTestScriptStatus}
            approvedVersions={approvedVersions}
            onReuploadSubmission={handleReuploadSubmission}
            onAdditionalDocumentSubmission={
              handleAdditionalDocumentSubmission
            }
          />
        );
      case "manager-dashboard":
        return <ManagerDashboardView />;
      case "cer-detail":
        return (
          <CERDetailView
            cerId={currentView.cerId}
            onBack={handleBackToDashboard}
            onOpenScript={handleOpenScript}
            scriptUpdates={scriptUpdates}
            hasAgentRun={agentCompletedCERs.has(
              currentView.cerId,
            )}
            approvedVersions={approvedVersions}
            onRunAgent={handleRunAgentForCER}
            isAgentRunning={isAgentRunning}
            isLoadingThisCER={loadingCERs.has(
              currentView.cerId,
            )}
            sharedTestScripts={sharedTestScripts}
            processedTestScripts={
              processedTestScripts[currentView.cerId] ||
              new Set()
            }
          />
        );
      case "transcript-detail":
        return (
          <ConversationalTranscriptDetailView
            scriptId={currentView.scriptId}
            onBack={handleBackToCERDetail}
            onBackToDashboard={handleBackToDashboard}
            onScriptUpdate={handleScriptUpdate}
            onApproveAndNavigate={handleApproveAndNavigate}
            onVersionUpdate={handleVersionUpdate}
            scriptTitle={getScriptTitle(currentView.scriptId)}
            scriptUpdates={scriptUpdates[currentView.scriptId]}
            parentCerId={currentView.fromCerId}
            versionHistory={
              versionHistory[
              `${currentView.fromCerId}_${currentView.scriptId}`
              ] || []
            }
            onActionItemCreated={handleActionItemCreated}
            onRequestReupload={handleRequestReupload}
            onRequestAdditionalDocument={
              handleRequestAdditionalDocument
            }
            onApproveReupload={handleApproveReupload}
            sharedTestScripts={sharedTestScripts}
            uploadStates={uploadStates}
            approvedVersions={approvedVersions}
          />
        );

      default:
        return (
          <DashboardView
            onOpenCER={handleOpenCER}
            selectedCERs={selectedCERs}
            onCERSelection={handleCERSelection}
            isAgentRunning={isAgentRunning}
            onRunAgent={handleRunAgent}
            agentCompletedCERs={agentCompletedCERs}
            loadingCERs={loadingCERs}
            processedTestScripts={processedTestScripts}
            getCERTestScriptIds={getCERTestScriptIds}
          />
        );
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      <NavigationHeader
        breadcrumbs={getBreadcrumbs}
        currentPersona={currentPersona}
        onPersonaChange={handlePersonaChange}
        notifications={notifications}
        unreadNotificationCount={unreadNotificationCount}
        onNotificationClick={handleNotificationClick}
        onMarkNotificationAsRead={handleMarkNotificationAsRead}
      />
      <div className="flex-1 overflow-auto">
        {renderCurrentView()}
      </div>
      <LoadingOverlay
        isVisible={isAgentRunning}
        message={`VCM Agent processing ${loadingCERs.size} CER${loadingCERs.size !== 1 ? 's' : ''}...`}
      />
      <Toaster position="top-right" />
    </div>
  );
}