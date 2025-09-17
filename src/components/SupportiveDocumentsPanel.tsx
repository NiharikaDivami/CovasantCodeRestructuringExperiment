import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { FileText, Download, ExternalLink, Shield, AlertCircle, Calendar, User, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import RequestReuploadModal from "./RequestReuploadModal";
import RequestAdditionalDocumentModal from "./RequestAdditionalDocumentModal";

interface SupportiveDocument {
  id: string;
  name: string;
  type: "policy" | "procedure" | "standard" | "guideline" | "report" | "evidence" | "certificate";
  status: "available" | "pending" | "expired" | "under-review";
  relevanceScore: number;
  lastUpdated: string;
  owner: string;
  size?: string;
  description?: string;
}

interface SupportiveDocumentsPanelProps {
  documents: SupportiveDocument[];
  scriptId?: string;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsible?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
  thirdPartyRequirement?: string;
  onRequestReupload?: (data: any) => void;
  onRequestAdditionalDocument?: (data: any) => void;
  onApproveReupload?: (documentName: string) => void;
  initialExpanded?: boolean;
  sharedTestScripts?: Array<{
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
  }>;
  uploadStates?: Record<string, "awaiting_upload" | "needs_review" | "approved">;
  parentCerId?: string;
}

export default function SupportiveDocumentsPanel({ 
  documents, 
  scriptId, 
  isOpen, 
  onClose, 
  isCollapsible, 
  onExpandedChange,
  thirdPartyRequirement = "",
  onRequestReupload,
  onRequestAdditionalDocument,
  onApproveReupload,
  initialExpanded = true,
  sharedTestScripts = [],
  uploadStates = {},
  parentCerId
}: SupportiveDocumentsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [isReuploadModalOpen, setIsReuploadModalOpen] = useState(false);
  const [isAdditionalDocModalOpen, setIsAdditionalDocModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<SupportiveDocument | null>(null);

  // Notify parent of initial state
  useEffect(() => {
    if (onExpandedChange) {
      onExpandedChange(isExpanded);
    }
  }, []); // Only run on mount

  // Notify parent when expanded state changes
  const handleExpandToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onExpandedChange) {
      onExpandedChange(newExpandedState);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "policy":
        return <Shield className="h-4 w-4 text-blue-500" />;
      case "procedure":
        return <FileText className="h-4 w-4 text-green-500" />;
      case "standard":
        return <AlertCircle className="h-4 w-4 text-purple-500" />;
      case "guideline":
        return <FileText className="h-4 w-4 text-amber-500" />;
      case "report":
        return <FileText className="h-4 w-4 text-red-500" />;
      case "evidence":
        return <FileText className="h-4 w-4 text-gray-500" />;
      case "certificate":
        return <Shield className="h-4 w-4 text-emerald-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Available</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case "expired":
        return <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Expired</Badge>;
      case "under-review":
        return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">Under Review</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>;
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const handleRequestReupload = (document: SupportiveDocument) => {
    setSelectedDocument(document);
    setIsReuploadModalOpen(true);
  };

  const handleRequestAdditionalDocument = () => {
    setIsAdditionalDocModalOpen(true);
  };

  const handleReuploadSubmit = (data: any) => {
    if (onRequestReupload) {
      // Pass the data including both reason and analyst notes
      onRequestReupload({
        testScriptId: data.testScriptId,
        documentName: data.documentName,
        reason: data.reason,
        analystNotes: data.analystNotes
      });
    }
  };

  const handleAdditionalDocSubmit = (data: any) => {
    if (onRequestAdditionalDocument) {
      onRequestAdditionalDocument(data);
    }
  };

  // Get the current upload state for this test script
  const getCurrentUploadState = () => {
    if (!scriptId) return undefined;
    return uploadStates[scriptId];
  };

  // Get re-upload requests for this test script
  const getReuploadRequests = () => {
    if (!scriptId || !sharedTestScripts.length) return [];
    
    const testScript = sharedTestScripts.find(script => script.testScriptId === scriptId);
    return testScript?.reuploadRequests || [];
  };

  // Get additional document requests for this test script
  const getAdditionalDocumentRequests = () => {
    if (!scriptId || !sharedTestScripts.length) return [];
    
    const testScript = sharedTestScripts.find(script => script.testScriptId === scriptId);
    return testScript?.additionalDocumentRequests || [];
  };

  // Check if a document has an active re-upload request (not approved or completed)
  const hasActiveReuploadRequest = (documentName: string) => {
    const reuploadRequests = getReuploadRequests();
    return reuploadRequests.some(request => 
      request.documentName === documentName && 
      (request.status === "awaiting_upload" || request.status === "needs_review")
    );
  };

  // Get the status of a re-upload request for a document
  const getReuploadRequestStatus = (documentName: string) => {
    const reuploadRequests = getReuploadRequests();
    const request = reuploadRequests.find(request => request.documentName === documentName);
    return request?.status;
  };

  // Handle approve re-upload
  const handleApproveReuploadLocal = (documentName: string) => {
    // Call the parent's approval handler if available
    if (onApproveReupload) {
      onApproveReupload(documentName);
    } else {
      console.log(`Approving re-upload for ${documentName}`);
    }
  };

  return (
    <>
      <div 
        className={`bg-white transition-all duration-300 ease-in-out flex flex-col ${isExpanded ? 'w-80' : 'w-16'} absolute top-20 bottom-0 right-0 overflow-hidden border-l border-t border-gray-200`}
      >
        {/* Collapsible Header */}
        <div 
          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50 border-b flex-shrink-0"
          onClick={handleExpandToggle}
        >
          {isExpanded ? (
            <>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-600" />
                <div>
                  <h3 className="text-lg font-semibold">Supportive Documents</h3>
                  <p className="text-sm text-gray-600">
                    {documents.length} documents available
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ChevronLeft className="h-5 w-5 text-gray-900" />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <FileText className="h-5 w-5 text-gray-900 hover:text-gray-700 transition-colors cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Supportive Documents</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        
        {/* Collapsible Content */}
        <div className={`${isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-opacity duration-300 ease-in-out flex-1 overflow-hidden`}>
          <div className="px-4 relative z-10 h-full">
            <ScrollArea className="h-full relative">
              <div className="space-y-4 relative py-4">
                {/* Request Additional Document Button */}
                <div className="pb-4 border-b">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2 h-9"
                    onClick={handleRequestAdditionalDocument}
                  >
                    <Upload className="h-4 w-4" />
                    Request Additional Document
                  </Button>
                </div>

                {/* Additional Document Requests Section */}
                {getAdditionalDocumentRequests().length > 0 && (
                  <div className="pb-4 border-b">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">
                        Additional Documents
                      </h4>
                      {getAdditionalDocumentRequests().map((request) => (
                        <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <FileText className="h-4 w-4 text-blue-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                  {request.status === "needs_review" || request.status === "approved" 
                                    ? request.requirement || request.analystNotes
                                    : request.analystNotes}
                                  {(request.status === "needs_review" || request.status === "approved") && (
                                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300 ml-2">
                                      Uploaded
                                    </Badge>
                                  )}
                                </h4>
                                <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-6 w-6 p-0 hover:bg-gray-100"
                                          disabled={request.status === "awaiting_upload"}
                                        >
                                          <Download className="h-3 w-3 text-gray-600" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Download</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-6 w-6 p-0 hover:bg-gray-100"
                                          disabled={request.status === "awaiting_upload"}
                                        >
                                          <ExternalLink className="h-3 w-3 text-gray-600" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>View</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                              
                              {request.status !== "awaiting_upload" && (
                                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                  Additional document requested by analyst for compliance review
                                </p>
                              )}
                              
                              <div className="space-y-2">
                                <div className="flex items-center text-xs text-gray-500">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>Requested {new Date(request.requestedDate).toLocaleDateString()}</span>
                                </div>
                                
                                <div className="flex items-center text-xs text-gray-500">
                                  <User className="h-3 w-3 mr-1" />
                                  <span>Analyst Request</span>
                                </div>
                                
                                {request.status !== "awaiting_upload" && (
                                  <div className="text-xs text-gray-500">
                                    Type: Additional Document
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-3">
                                {request.status === "approved" ? (
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="h-8 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium w-full"
                                    onClick={() => handleRequestAdditionalDocument()}
                                  >
                                    Request Re-upload
                                  </Button>
                                ) : request.status === "needs_review" ? (
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="h-8 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium w-full"
                                    onClick={() => handleRequestAdditionalDocument()}
                                  >
                                    Re-upload
                                  </Button>
                                ) : (
                                  <div className="bg-amber-50 border border-amber-200 rounded-md p-2 text-center">
                                    <span className="text-xs text-amber-700 font-medium">Upload Awaiting</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                
                {documents.map((document) => {
                  // Check if this document has been re-uploaded
                  const reuploadRequestStatus = getReuploadRequestStatus(document.name);
                  const hasBeenReuploaded = reuploadRequestStatus === "needs_review" || reuploadRequestStatus === "approved";
                  const testScript = sharedTestScripts.find(script => script.testScriptId === scriptId);
                  const hasVendorReuploaded = testScript?.status === "Action Item Responded";
                  
                  return (
                  <div key={document.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(document.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                            {document.name}
                            {(hasBeenReuploaded || hasVendorReuploaded) && (
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-300 ml-2">
                                Re-uploaded
                              </Badge>
                            )}
                          </h4>
                          <div className="ml-2 flex-shrink-0 flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 hover:bg-gray-100"
                                    disabled={document.status !== "available"}
                                  >
                                    <Download className="h-3 w-3 text-gray-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Download</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 hover:bg-gray-100"
                                    disabled={document.status !== "available"}
                                  >
                                    <ExternalLink className="h-3 w-3 text-gray-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        
                        {document.description && (
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                            {document.description}
                          </p>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>Updated {document.lastUpdated}</span>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <User className="h-3 w-3 mr-1" />
                            <span>{document.owner}</span>
                          </div>
                          
                          {document.size && (
                            <div className="text-xs text-gray-500">
                              Size: {document.size}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3">
                          {(() => {
                            const reuploadRequestStatus = getReuploadRequestStatus(document.name);
                            const currentUploadState = getCurrentUploadState();
                            
                            // Check if vendor has re-uploaded (Action Item Responded status)
                            const testScript = sharedTestScripts.find(script => script.testScriptId === scriptId);
                            const hasVendorReuploaded = testScript?.status === "Action Item Responded";
                            
                            // If there's an active re-upload request for this document
                            if (hasActiveReuploadRequest(document.name)) {
                              if (reuploadRequestStatus === "awaiting_upload") {
                                return (
                                  <div className="bg-amber-50 border border-amber-200 rounded-md p-2 text-center">
                                    <span className="text-xs text-amber-700 font-medium">Upload Awaiting</span>
                                  </div>
                                );
                              } else if (reuploadRequestStatus === "needs_review") {
                                // After vendor uploads, show request re-upload button again
                                return (
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="h-8 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium w-full"
                                    onClick={() => handleRequestReupload(document)}
                                  >
                                    Request Re-upload
                                  </Button>
                                );
                              }
                            }
                            
                            // If vendor has re-uploaded but no specific reupload request, show request button again
                            if (hasVendorReuploaded) {
                              return (
                                <Button 
                                  variant="default" 
                                  size="sm" 
                                  className="h-8 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium w-full"
                                  onClick={() => handleRequestReupload(document)}
                                >
                                  Request Re-upload
                                </Button>
                              );
                            }
                            
                            // Default request re-upload button
                            return (
                              <Button 
                                variant="default" 
                                size="sm" 
                                className="h-8 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium w-full"
                                onClick={() => handleRequestReupload(document)}
                              >
                                Request Re-upload
                              </Button>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RequestReuploadModal
        isOpen={isReuploadModalOpen}
        onClose={() => {
          setIsReuploadModalOpen(false);
          setSelectedDocument(null);
        }}
        testScriptId={scriptId}
        documentName={selectedDocument?.name}
        onSubmit={handleReuploadSubmit}
      />

      <RequestAdditionalDocumentModal
        isOpen={isAdditionalDocModalOpen}
        onClose={() => setIsAdditionalDocModalOpen(false)}
        testScriptId={scriptId}
        thirdPartyRequirement={thirdPartyRequirement}
        onSubmit={handleAdditionalDocSubmit}
      />
    </>
  );
}