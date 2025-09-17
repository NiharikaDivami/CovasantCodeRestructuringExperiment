import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent } from "../ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  Upload,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import {
  mockTestScripts,
  STATUS_FILTER_OPTIONS,
  ACCEPTED_FILE_TYPES,
  reverseScriptMap,
  TOAST_STYLES,
  STATUS_BADGE_VARIANTS,
} from "./constants";
import type {
  SharedTestScript,
  VendorDashboardViewProps,
  TestScriptStatus,
} from "./types";

function VendorDashboardView({
  onVendorSubmission,
  sharedTestScripts,
  onTestScriptStatusUpdate,
  approvedVersions = {},
  onReuploadSubmission,
  onAdditionalDocumentSubmission,
}: VendorDashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedScript, setSelectedScript] =
    useState<SharedTestScript | null>(null);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] =
    useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(
    [],
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [
    isTestScriptInfoExpanded,
    setIsTestScriptInfoExpanded,
  ] = useState(false);

  // Function to check if a test script has been approved in the analyst dashboard
  const isTestScriptApproved = (
    testScriptId: string,
    cerId?: string,
  ): boolean => {
    if (!cerId) return false;

    const internalScriptId =
      reverseScriptMap[cerId]?.[testScriptId];
    if (!internalScriptId) return false;

    const approvalKey = `${cerId}_${internalScriptId}`;
    return !!approvedVersions[approvalKey];
  };

  // Function to get final conclusion from approved version
  const getFinalConclusion = (
    testScriptId: string,
    cerId?: string,
  ): string | undefined => {
    if (!cerId) return undefined;

    const internalScriptId =
      reverseScriptMap[cerId]?.[testScriptId];
    if (!internalScriptId) return undefined;

    const approvalKey = `${cerId}_${internalScriptId}`;
    const approvedVersion = approvedVersions[approvalKey];

    return (
      approvedVersion?.approvedData?.humanInsight ||
      approvedVersion?.approvedData?.finalConclusions
    );
  };

  // Update shared test scripts with approval status and final conclusions
  const enhancedSharedTestScripts = sharedTestScripts.map(
    (script) => {
      if (
        isTestScriptApproved(script.testScriptId, script.cerId)
      ) {
        const finalConclusion = getFinalConclusion(
          script.testScriptId,
          script.cerId,
        );
        return {
          ...script,
          status: "Approved" as const,
          finalConclusion,
        };
      }
      return script;
    },
  );

  const filteredScripts = enhancedSharedTestScripts.filter(
    (script) => {
      const matchesSearch =
        script.testScriptId
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        script.thirdPartyRequirements
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        script.testScript
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "All" ||
        script.status === filterStatus;

      return matchesSearch && matchesStatus;
    },
  );

  const handleRowClick = (script: SharedTestScript) => {
    setSelectedScript(script);
    setIsDetailsPanelOpen(true);
    setUploadedFiles([]); // Reset uploaded files when opening new script
    setIsTestScriptInfoExpanded(false); // Reset expansion state when opening new script
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setUploadedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) =>
      prev.filter((_, i) => i !== index),
    );
  };

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      toast(
        "Please select files to upload before submitting.",
        TOAST_STYLES.error,
      );
      return;
    }

    if (!selectedScript) return;

    // Check if this is a re-upload submission based on test script state
    const isReuploadSubmission =
      selectedScript.reuploadState === "awaiting_upload" ||
      (selectedScript.reuploadRequests &&
        selectedScript.reuploadRequests.some(
          (req) => req.status === "awaiting_upload",
        ));

    // Check if this is an additional document submission
    const isAdditionalDocumentSubmission =
      selectedScript.additionalDocumentRequests &&
      selectedScript.additionalDocumentRequests.some(
        (req) => req.status === "awaiting_upload",
      );

    if (isReuploadSubmission && onReuploadSubmission) {
      // This is a re-upload submission - find the document name from reupload requests
      const awaitingUploadRequest =
        selectedScript.reuploadRequests?.find(
          (req) => req.status === "awaiting_upload",
        );
      const documentName =
        awaitingUploadRequest?.documentName ||
        uploadedFiles[0].name;
      onReuploadSubmission(
        selectedScript.testScriptId,
        documentName,
      );

      toast(
        "Document re-uploaded successfully!",
        TOAST_STYLES.success,
      );

      // Reset and close
      setUploadedFiles([]);
      setIsDetailsPanelOpen(false);
      return;
    }

    if (
      isAdditionalDocumentSubmission &&
      onAdditionalDocumentSubmission
    ) {
      // This is an additional document submission
      onAdditionalDocumentSubmission(
        selectedScript.testScriptId,
      );

      toast(
        "Additional document uploaded successfully!",
        TOAST_STYLES.success,
      );

      // Reset and close
      setUploadedFiles([]);
      setIsDetailsPanelOpen(false);
      return;
    }

    // Regular submission flow
    const newStatus: TestScriptStatus =
      selectedScript.status === "COQ Requested"
        ? "COQ Responded"
        : selectedScript.status === "Action Item Issued"
          ? "Action Item Responded"
          : selectedScript.status;

    // Create upload history entries
    const newUploadHistory = uploadedFiles.map((file) => ({
      filename: file.name,
      uploadDate: new Date().toLocaleDateString(),
      status: "Under Review",
    }));

    // Update the script status in the shared state
    onTestScriptStatusUpdate(
      selectedScript.testScriptId,
      newStatus,
      newUploadHistory,
    );

    // Update the selected script for immediate UI feedback
    setSelectedScript((prev) =>
      prev
        ? {
          ...prev,
          status: newStatus,
          uploadHistory: [
            ...(prev.uploadHistory || []),
            ...newUploadHistory,
          ],
        }
        : null,
    );

    // Simulate file submission
    toast(
      "Files submitted successfully! Status updated.",
      TOAST_STYLES.success,
    );

    // Send notification to analyst
    onVendorSubmission(
      selectedScript.testScriptId,
      newStatus,
      selectedScript.vendorName || "Current Vendor",
    );

    // Reset and close
    setUploadedFiles([]);
    setIsDetailsPanelOpen(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    return (
      STATUS_BADGE_VARIANTS[
      status as keyof typeof STATUS_BADGE_VARIANTS
      ] || "default"
    );
  };

  const getTypeIndicator = (type: string) => {
    return null;
  };

  return (
    <div className="h-full w-screen max-w-screen overflow-x-hidden flex flex-col bg-gray-50">
      {/* Content Header */}
      <div className="bg-white border-b border-gray-100 pl-10 pr-6 py-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Test Scripts
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredScripts.length} of{" "}
                {enhancedSharedTestScripts.length} test scripts
              </p>
            </div>
          </div>

          {/* Filter Controls and Search Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-44 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FILTER_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "All" ? "All Status" : status}
                    </SelectItem>
                  ))}
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
                          <span className="font-medium text-sm">
                            {script.testScriptId}
                          </span>
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
                        <Badge
                          className={getStatusBadgeVariant(
                            script.status,
                          )}
                        >
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
                            <span className="text-gray-500 text-sm italic">
                              No COQ request
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {script.status === "Approved" ? (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">
                              Analyst has not added comment
                            </span>
                          </div>
                        ) : script.analystComment ? (
                          <div className="text-sm text-gray-900 line-clamp-2 break-words">
                            {script.analystComment}
                          </div>
                        ) : (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">
                              Analyst has not added comment
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {script.status === "Approved" ? (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">
                              No supporting evidence
                            </span>
                          </div>
                        ) : script.supportingEvidence ? (
                          <div className="text-sm text-gray-900 line-clamp-2 break-words">
                            {script.supportingEvidence}
                          </div>
                        ) : (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">
                              No supporting evidence
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {script.status === "Approved" &&
                          script.finalConclusion ? (
                          <div className="text-sm text-gray-900 line-clamp-2 break-words">
                            {script.finalConclusion}
                          </div>
                        ) : script.status === "Approved" ? (
                          <div className="text-sm text-gray-900 line-clamp-2 break-words">
                            Information security awareness
                            training program successfully
                            demonstrates comprehensive
                            compliance with annual training
                            requirements. All documentation
                            provided meets regulatory standards
                            with complete tracking and
                            certification processes validated.
                          </div>
                        ) : (
                          <div className="inline-block px-3 py-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                            <span className="text-gray-500 text-sm italic">
                              No conclusions available
                            </span>
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
      <Sheet
        open={isDetailsPanelOpen}
        onOpenChange={setIsDetailsPanelOpen}
      >
        <SheetContent className="w-[800px] sm:max-w-[800px] flex flex-col h-full overflow-hidden p-0 gap-0">
          <SheetHeader className="flex-shrink-0 pb-4 border-b p-6">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedScript?.testScriptId}
              {selectedScript && (
                <Badge
                  className={getStatusBadgeVariant(
                    selectedScript.status,
                  )}
                >
                  {selectedScript.status}
                </Badge>
              )}
            </SheetTitle>
            <SheetDescription className="text-sm text-gray-600">
              View and manage test script details, upload
              supporting evidence, and track submission status
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
                      onClick={() =>
                        setIsTestScriptInfoExpanded(
                          !isTestScriptInfoExpanded,
                        )
                      }
                    >
                      <h3 className="font-medium text-lg">
                        Test Script Information
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {isTestScriptInfoExpanded
                            ? "Collapse"
                            : "Expand"}
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
                          <label className="text-sm font-medium text-gray-600">
                            Third-Party Requirements
                          </label>
                          <p className="text-sm mt-1 p-3 bg-white rounded border">
                            {
                              selectedScript.thirdPartyRequirements
                            }
                          </p>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-600">
                            Test Script
                          </label>
                          <p className="text-sm mt-1 p-3 bg-white rounded border">
                            {selectedScript.testScript}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dynamic Content Based on Type and Status */}
                  {selectedScript.type === "COQ" &&
                    selectedScript.coqRequest && (
                      <div>
                        <h3 className="font-medium mb-3">
                          COQ Request Details
                        </h3>
                        <Card>
                          <CardContent className="pt-4">
                            <p className="text-sm">
                              {selectedScript.coqRequest}
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                  {selectedScript.type === "Action Item" &&
                    selectedScript.analystComment && (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium mb-3">
                            Analyst Comment
                          </h3>
                          <Card>
                            <CardContent className="pt-4">
                              <p className="text-sm">
                                {selectedScript.analystComment}
                              </p>
                            </CardContent>
                          </Card>
                        </div>

                        {selectedScript.supportingEvidence && (
                          <div>
                            <h3 className="font-medium mb-3">
                              Supporting Evidence Required
                            </h3>
                            <Card>
                              <CardContent className="pt-4">
                                <p className="text-sm">
                                  {
                                    selectedScript.supportingEvidence
                                  }
                                </p>
                              </CardContent>
                            </Card>
                          </div>
                        )}
                      </div>
                    )}
                  {/* Show final conclusions for approved test scripts */}
                  {selectedScript.status === "Approved" && (
                    <div>
                      <h3 className="font-medium mb-3">
                        Final Conclusions
                      </h3>
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
                                  "Information security awareness training program successfully demonstrates comprehensive compliance with annual training requirements. All documentation provided meets regulatory standards with complete tracking and certification processes validated."}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  {/* Show submitted documents info for responded and approved statuses */}
                  {(selectedScript.status === "COQ Responded" ||
                    selectedScript.status ===
                    "Action Item Responded" ||
                    selectedScript.status === "Approved") &&
                    selectedScript.uploadHistory &&
                    selectedScript.uploadHistory.length > 0 && (
                      <div>
                        <h3 className="font-medium mb-3">
                          {selectedScript.type === "COQ"
                            ? "Documents Submitted"
                            : "Evidence Submitted"}
                        </h3>
                        <div className="space-y-2">
                          {(() => {
                            // For Action Items, show only vendor-uploaded documents
                            // For COQ items, show all documents in uploadHistory
                            const documentsToShow =
                              selectedScript.type ===
                                "Action Item"
                                ? selectedScript.uploadHistory.filter(
                                  (upload) =>
                                    // Show only documents uploaded by vendor (status is not "Incomplete" from initial submission)
                                    upload.status ===
                                    "Under Review" ||
                                    upload.status ===
                                    "Approved",
                                )
                                : selectedScript.uploadHistory;

                            return documentsToShow.map(
                              (upload, index) => (
                                <Card key={index}>
                                  <CardContent className="pt-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-gray-400" />
                                        <div>
                                          <p className="text-sm font-medium">
                                            {upload.filename}
                                          </p>
                                          <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Clock className="h-3 w-3" />
                                            Submitted on{" "}
                                            {upload.uploadDate}
                                          </div>
                                        </div>
                                      </div>
                                      <Badge
                                        className={
                                          upload.status ===
                                            "Approved"
                                            ? "bg-green-100 text-green-800 border-green-200"
                                            : upload.status ===
                                              "Under Review"
                                              ? "bg-blue-100 text-blue-800 border-blue-200"
                                              : "bg-red-100 text-red-800 border-red-200"
                                        }
                                      >
                                        {upload.status}
                                      </Badge>
                                    </div>
                                  </CardContent>
                                </Card>
                              ),
                            );
                          })()}
                        </div>
                      </div>
                    )}

                  {/* Re-upload Requests Section */}
                  {selectedScript.reuploadRequests &&
                    selectedScript.reuploadRequests.some(
                      (req) => req.status === "awaiting_upload",
                    ) && (
                      <div>
                        <h3 className="font-medium mb-3">
                          Re-upload Requests
                        </h3>
                        <div className="space-y-3">
                          {selectedScript.reuploadRequests
                            .filter(
                              (req) =>
                                req.status ===
                                "awaiting_upload",
                            )
                            .map((request) => (
                              <Card
                                key={request.id}
                                className="border-amber-200 bg-amber-50"
                              >
                                <CardContent className="pt-4">
                                  <div className="flex items-start gap-3">
                                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-amber-900 mb-1">
                                        Re-upload Required:{" "}
                                        {request.documentName}
                                      </div>
                                      <div className="text-sm text-amber-800 mb-2">
                                        {request.reason}
                                      </div>
                                      <div className="text-xs text-amber-700">
                                        Requested:{" "}
                                        {new Date(
                                          request.requestedDate,
                                        ).toLocaleDateString()}
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
                  {selectedScript.additionalDocumentRequests &&
                    selectedScript.additionalDocumentRequests.some(
                      (req) => req.status === "awaiting_upload",
                    ) && (
                      <div>
                        <h3 className="font-medium mb-3">
                          Additional Documents Requested
                        </h3>
                        <div className="space-y-3">
                          {selectedScript.additionalDocumentRequests
                            .filter(
                              (req) =>
                                req.status ===
                                "awaiting_upload",
                            )
                            .map((request) => (
                              <Card
                                key={request.id}
                                className="border-blue-200 bg-blue-50"
                              >
                                <CardContent className="pt-4">
                                  <div className="flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-blue-900 mb-1">
                                        Additional Documentation
                                        Required
                                      </div>
                                      <div className="text-sm text-blue-800 mb-1">
                                        <strong>
                                          Requirement:
                                        </strong>{" "}
                                        {request.requirement}
                                      </div>
                                      <div className="text-sm text-blue-800 mb-2">
                                        <strong>Notes:</strong>{" "}
                                        {request.analystNotes}
                                      </div>
                                      <div className="text-xs text-blue-700">
                                        Requested:{" "}
                                        {new Date(
                                          request.requestedDate,
                                        ).toLocaleDateString()}
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
                      <h3 className="font-medium mb-3">
                        Upload Supporting Files
                      </h3>

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
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${selectedScript.status ===
                            "COQ Responded" ||
                            selectedScript.status ===
                            "Action Item Responded"
                            ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                            : "border-gray-300 hover:border-gray-400 cursor-pointer"
                          }`}
                        onClick={
                          selectedScript.status ===
                            "COQ Responded" ||
                            selectedScript.status ===
                            "Action Item Responded"
                            ? undefined
                            : handleUploadClick
                        }
                      >
                        <Upload
                          className={`h-8 w-8 mx-auto mb-3 ${selectedScript.status ===
                              "COQ Responded" ||
                              selectedScript.status ===
                              "Action Item Responded"
                              ? "text-gray-300"
                              : "text-gray-400"
                            }`}
                        />
                        <p
                          className={`text-sm mb-2 ${selectedScript.status ===
                              "COQ Responded" ||
                              selectedScript.status ===
                              "Action Item Responded"
                              ? "text-gray-400"
                              : "text-gray-600"
                            }`}
                        >
                          {selectedScript.status ===
                            "COQ Responded" ||
                            selectedScript.status ===
                            "Action Item Responded"
                            ? "Evidence already submitted"
                            : "Drop files here or click to upload"}
                        </p>
                        <p
                          className={`text-xs ${selectedScript.status ===
                              "COQ Responded" ||
                              selectedScript.status ===
                              "Action Item Responded"
                              ? "text-gray-400"
                              : "text-gray-500"
                            }`}
                        >
                          {selectedScript.status ===
                            "COQ Responded" ||
                            selectedScript.status ===
                            "Action Item Responded"
                            ? "No additional uploads required"
                            : "Supported formats: PDF, DOC, DOCX, XLS, XLSX, PNG, JPG"}
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          disabled={
                            selectedScript.status ===
                            "COQ Responded" ||
                            selectedScript.status ===
                            "Action Item Responded"
                          }
                        >
                          Choose Files
                        </Button>
                      </div>

                      {/* Selected Files Preview */}
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <h4 className="text-sm font-medium">
                            Selected Files:
                          </h4>
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <div>
                                  <p className="text-sm font-medium">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(
                                      file.size /
                                      1024 /
                                      1024
                                    ).toFixed(2)}{" "}
                                    MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleRemoveFile(index)
                                }
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
                    <Button
                      variant="outline"
                      onClick={() =>
                        setIsDetailsPanelOpen(false)
                      }
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        uploadedFiles.length === 0 ||
                        selectedScript.status ===
                        "COQ Responded" ||
                        selectedScript.status ===
                        "Action Item Responded"
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
export default VendorDashboardView;