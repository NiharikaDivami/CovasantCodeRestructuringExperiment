import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Bot, User, FileText, Send, Loader2, RefreshCw, CheckCircle, ChevronDown, ChevronUp, Info, X, Search, Clock } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { toast } from "sonner@2.0.3";
import ClickableCitations from "../ClickableCitations";
import SupportiveDocumentsPanel from "../SupportiveDocumentsPanel/SupportiveDocumentsPanel.tsx";
import DocumentMentionTextarea from "../DocumentMentionTextarea/index";
import InlayDocumentCitation from "../../components/InlayDocumentCitation/index.tsx";
import ActivityLog from "../ActivityLog/ActivityLog";
import type { ConversationalTranscriptDetailViewProps, ChatMessage } from "./types";
import { CITATION_REGEX, CITATION_MAP, ANALYSIS_CONTENT, DEFAULT_ANALYSIS, BASE_DOCUMENTS, BASE_ACTIVITIES, REQUIREMENT_MAP } from "./constants";
import "./styles.css";

export default function ConversationalTranscriptDetailView({
  scriptId,
  onBack,
  onBackToDashboard,
  onScriptUpdate,
  onApproveAndNavigate,
  onVersionUpdate,
  scriptTitle,
  scriptUpdates,
  parentCerId,
  versionHistory = [],
  onActionItemCreated,
  onRequestReupload,
  onRequestAdditionalDocument,
  sharedTestScripts = [],
  uploadStates = {},
  approvedVersions = {}
}: ConversationalTranscriptDetailViewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  const [isRepopulating, setIsRepopulating] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [hasRepopulatedAfterApproval, setHasRepopulatedAfterApproval] = useState(false);
  const [isDialogueBoxFocused, setIsDialogueBoxFocused] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [hasVersionHistory, setHasVersionHistory] = useState(false);
  const [isAIReasoningExpanded, setIsAIReasoningExpanded] = useState(false);
  const [currentVersion, setCurrentVersion] = useState("v1");
  const [allVersions, setAllVersions] = useState<ChatMessage[]>([]);

  const getAIAnalysisContent = (sid: string) => ANALYSIS_CONTENT[sid] || DEFAULT_ANALYSIS;

  const getSupportiveDocuments = (sid: string) => {
    if (sid === "ts-1") {
      return BASE_DOCUMENTS.slice(0, 4);
    } else if (sid === "ts-2") {
      return [BASE_DOCUMENTS[0], BASE_DOCUMENTS[1], BASE_DOCUMENTS[3], BASE_DOCUMENTS[4], BASE_DOCUMENTS[5]];
    } else {
      return BASE_DOCUMENTS;
    }
  };

  useEffect(() => {
    if (scrollToBottom) {
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        (scrollArea as HTMLElement).scrollTop = (scrollArea as HTMLElement).scrollHeight;
      }
      setScrollToBottom(false);
    }
  }, [scrollToBottom, messages]);

  useEffect(() => {
    let allMessages: ChatMessage[] = [];
    const hasV1InHistory = versionHistory && versionHistory.some((v: any) => v.version === 'v1');
    if (!hasV1InHistory) {
      const aiAnalysis = getAIAnalysisContent(scriptId);
      const originalMessage: ChatMessage = {
        id: "ai-analysis-1",
        type: "ai",
        author: "VCM Agent",
        timestamp: "2 hours ago",
        version: "v1",
        content: {
          title: `${aiAnalysis.title} (v1)`,
          reasoningSteps: aiAnalysis.reasoningSteps,
          sourceDocuments: aiAnalysis.sourceDocuments,
          generatedInsight: aiAnalysis.generatedInsight,
          confidence: aiAnalysis.confidence,
          disposition: aiAnalysis.disposition,
        },
        isLatest: versionHistory.length === 0,
      };

      allMessages = [originalMessage];
    }

    if (versionHistory && versionHistory.length > 0) {
      const sortedHistory = [...versionHistory].sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      sortedHistory.forEach((version: any, index: number) => {
        if (version.humanInsight) {
          const humanMessage: ChatMessage = {
            id: `human-insight-${version.version}`,
            type: "human",
            author: "Jacob Corman",
            timestamp: new Date(version.timestamp).toLocaleString(),
            content: { text: version.humanInsight },
          };
          allMessages.push(humanMessage);
        }

        const aiMessage: ChatMessage = {
          id: `ai-version-${version.version}`,
          type: "ai",
          author: "VCM Agent",
          timestamp: new Date(version.timestamp).toLocaleString(),
          version: version.version,
          content: {
            title: version.analysisData?.content?.title || `VCM Agent Analysis (Updated ${version.version})`,
            reasoningSteps: version.analysisData?.content?.reasoningSteps || [],
            sourceDocuments: version.analysisData?.content?.sourceDocuments || [],
            generatedInsight: version.analysisData?.content?.generatedInsight || "",
            confidence: version.analysisData?.content?.confidence,
            disposition: version.analysisData?.content?.disposition,
          },
          isLatest: index === sortedHistory.length - 1,
        };
        allMessages.push(aiMessage);
      });

      setHasVersionHistory(true);

      const approved = sortedHistory.filter((v: any) => v.status === 'approved');
      if (approved.length > 0) {
        const latestApproved = approved[approved.length - 1];
        const latestApprovedIndex = sortedHistory.findIndex((v: any) => v.version === latestApproved.version && v.status === 'approved');
        const hasVersionsAfterApproved = latestApprovedIndex < sortedHistory.length - 1;

        if (hasVersionsAfterApproved) {
          const latestVersion = sortedHistory[sortedHistory.length - 1];
          setCurrentVersion(latestVersion.version);
          setHasRepopulatedAfterApproval(true);
          setIsApproved(false);
        } else {
          setCurrentVersion(latestApproved.version);
          setIsApproved(true);
          setHasRepopulatedAfterApproval(false);
        }
      } else {
        const latestVersion = sortedHistory[sortedHistory.length - 1];
        setCurrentVersion(latestVersion.version);
        setHasRepopulatedAfterApproval(false);
      }
    }

    setMessages(allMessages);
    setAllVersions(allMessages);
  }, [scriptId, versionHistory]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userInput = inputMessage;
    setIsProcessing(true);

    const humanMessage: ChatMessage = {
      id: `human-${Date.now()}`,
      type: "human",
      author: "Jacob Corman",
      timestamp: "Now",
      content: { text: inputMessage },
    };

    setMessages((prev) => [...prev, humanMessage]);
    setInputMessage("");
    setScrollToBottom(true);

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        author: "VCM Agent",
        timestamp: "Now",
        content: {
          text: `Thank you for your input. I understand your concern about "${userInput}". Based on the available evidence [SOC2 Report 2025, pg 8, para 3], I can provide additional analysis to address this point. Would you like me to elaborate on any specific aspect of the control assessment?`,
        },
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);
      setScrollToBottom(true);
    }, 2000);
  };

  const handleApprove = async () => {
    setIsApproving(true);

    setTimeout(() => {
      setIsApproved(true);
      setHasRepopulatedAfterApproval(false);
      setIsApproving(false);

      toast("Analysis approved successfully", {
        className: "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
        style: { backgroundColor: "#dcfce7", borderColor: "#22c55e", color: "#166534" },
      });

      if (onApproveAndNavigate) {
        const latestAnalysis = messages.find((msg) => msg.type === "ai" && msg.version === currentVersion && msg.content.title);
        setTimeout(() => {
          onApproveAndNavigate(currentVersion, latestAnalysis);
        }, 1000);
      }
    }, 1500);
  };

  const handleRepopulate = () => {
    const humanInsightText = inputMessage.trim();

    if (humanInsightText) {
      const humanMessage: ChatMessage = {
        id: `human-repopulate-${Date.now()}`,
        type: "human",
        author: "Jacob Corman",
        timestamp: "Now",
        content: { text: humanInsightText },
      };

      setMessages((prev) => [...prev, humanMessage]);
      setInputMessage("");
      setScrollToBottom(true);

      setTimeout(() => {
        setIsRepopulating(true);

        setTimeout(() => {
          setMessages((currentMessages) => {
            const allVersionNumbers = currentMessages
              .filter((msg) => msg.type === "ai" && msg.version)
              .map((msg) => parseInt((msg.version as string).slice(1)))
              .filter((num) => !isNaN(num));

            const nextVersionNum = allVersionNumbers.length > 0 ? Math.max(...allVersionNumbers) + 1 : 2;
            const nextVersionNumber = `v${nextVersionNum}`;
            setCurrentVersion(nextVersionNumber);

            const updatedMessage: ChatMessage = {
              id: `ai-repopulated-${Date.now()}`,
              type: "ai",
              author: "VCM Agent",
              timestamp: "Now",
              version: nextVersionNumber,
              content: {
                title: `VCM Agent Analysis (Updated ${nextVersionNumber})`,
                reasoningSteps: [
                  "1. **Enhanced Control Review**: Updated analysis incorporating additional evidence and recent policy changes [SOC2 Report 2025, pg 8, para 3].",
                  "2. **Expanded Testing**: Additional sample testing performed to validate control consistency across extended period.",
                  "3. **Risk Re-assessment**: Updated risk evaluation considering current business environment and control modifications.",
                  "4. **Final Validation**: Comprehensive review confirming enhanced control effectiveness.",
                ],
                sourceDocuments: ["Updated Policy Documentation", "Extended Sample Testing", "Recent Audit Reports"],
                generatedInsight:
                  "Updated analysis confirms robust control design with enhanced operational effectiveness. Recent improvements in documentation and monitoring strengthen overall control environment [SOC2 Report 2025, pg 8, para 3]. Confidence level increased based on additional evidence validation.",
                confidence: 96,
              },
              isLatest: true,
            };

            const updatedMessages = currentMessages.map((msg) => ({ ...msg, isLatest: false }));
            const finalMessages = [...updatedMessages, updatedMessage];

            if (onVersionUpdate) {
              const versionUpdateWithInsight: any = { ...updatedMessage, humanInsight: humanInsightText };
              onVersionUpdate(nextVersionNumber, versionUpdateWithInsight);
            }

            setHasRepopulatedAfterApproval(true);
            return finalMessages;
          });

          setHasVersionHistory(true);
          setIsRepopulating(false);
          setScrollToBottom(true);

          toast("Analysis updated with latest information", {
            className: "border-blue-500 bg-blue-100 text-blue-800 font-medium shadow-lg",
            style: { backgroundColor: "#dbeafe", borderColor: "#3b82f6", color: "#1e40af" },
          });
        }, 2500);
      }, 500);
    } else {
      setIsRepopulating(true);

      setTimeout(() => {
        setMessages((currentMessages) => {
          const allVersionNumbers = currentMessages
            .filter((msg) => msg.type === "ai" && msg.version)
            .map((msg) => parseInt((msg.version as string).slice(1)))
            .filter((num) => !isNaN(num));

          const nextVersionNum = allVersionNumbers.length > 0 ? Math.max(...allVersionNumbers) + 1 : 2;
          const nextVersionNumber = `v${nextVersionNum}`;
          setCurrentVersion(nextVersionNumber);

          const updatedMessage: ChatMessage = {
            id: `ai-repopulated-${Date.now()}`,
            type: "ai",
            author: "VCM Agent",
            timestamp: "Now",
            version: nextVersionNumber,
            content: {
              title: `VCM Agent Analysis (Updated ${nextVersionNumber})`,
              reasoningSteps: [
                "1. **Enhanced Control Review**: Updated analysis incorporating additional evidence and recent policy changes [SOC2 Report 2025, pg 8, para 3].",
                "2. **Expanded Testing**: Additional sample testing performed to validate control consistency across extended period.",
                "3. **Risk Re-assessment**: Updated risk evaluation considering current business environment and control modifications.",
                "4. **Final Validation**: Comprehensive review confirming enhanced control effectiveness.",
              ],
              sourceDocuments: ["Updated Policy Documentation", "Extended Sample Testing", "Recent Audit Reports"],
              generatedInsight:
                "Updated analysis confirms robust control design with enhanced operational effectiveness. Recent improvements in documentation and monitoring strengthen overall control environment [SOC2 Report 2025, pg 8, para 3]. Confidence level increased based on additional evidence validation.",
              confidence: 96,
            },
            isLatest: true,
          };

          const updatedMessages = currentMessages.map((msg) => ({ ...msg, isLatest: false }));
          const finalMessages = [...updatedMessages, updatedMessage];

          if (onVersionUpdate) {
            onVersionUpdate(nextVersionNumber, updatedMessage);
          }

          setHasRepopulatedAfterApproval(true);
          return finalMessages;
        });

        setHasVersionHistory(true);
        setIsRepopulating(false);
        setScrollToBottom(true);

        toast("Analysis updated with latest information", {
          className: "border-blue-500 bg-blue-100 text-blue-800 font-medium shadow-lg",
          style: { backgroundColor: "#dbeafe", borderColor: "#3b82f6", color: "#1e40af" },
        });
      }, 2500);
    }
  };

  const isCurrentVersionApproved = () => {
    if (!parentCerId || !scriptId || !approvedVersions) return false;
    const approvalKey = `${parentCerId}_${scriptId}`;
    const approvedVersion = (approvedVersions as any)[approvalKey];
    return approvedVersion && approvedVersion.version === currentVersion;
  };

  const handleCitationClick = (documentName: string, page: number, paragraph: number) => {
    const citationKey = `${documentName}-p${page}-para${paragraph}`;
    const highlightText = (CITATION_MAP as any)[citationKey] || (CITATION_MAP as any)[documentName] || "";

    const citation = { documentName, page, paragraph, highlightText };
    setSelectedCitation(citation);
    setIsSupportiveDocumentsOpen(false);
    setIsCitationPanelOpen(true);
  };

  const handleCloseCitationPanel = () => {
    setIsCitationPanelOpen(false);
    setSelectedCitation(null);
    setIsSupportiveDocumentsOpen(true);
  };

  const handleRequestReupload = (data: any) => {
    console.log('Re-upload request:', data);
    if (onRequestReupload && scriptTitle && parentCerId) {
      onRequestReupload(scriptTitle, parentCerId, data.documentName, data.reason, data.analystNotes);
    } else if (onActionItemCreated && scriptTitle && parentCerId) {
      const getCERVendorName = (cerId: string) => {
        const cerToVendorMap: Record<string, string> = {
          "CER-10234": "Sarah Chen",
          "CER-10567": "Marcus Rodriguez",
          "CER-10892": "Jennifer Liu",
          "CER-11001": "David Park",
          "CER-11234": "Amanda Foster",
          "CER-11567": "Roberto Silva",
          "CER-11892": "Michelle Wong",
          "CER-12001": "Thomas Anderson",
          "CER-12234": "Lisa Thompson",
          "CER-12567": "Kevin O'Brien",
        };
        return cerToVendorMap[cerId] || "Unknown Vendor";
      };

      const vendorName = getCERVendorName(parentCerId);
      onActionItemCreated(scriptTitle, parentCerId, vendorName);
    }
  };

  const handleApproveReupload = (documentName: string) => {
    if (!scriptTitle) return;
    if (onApproveReupload) {
      onApproveReupload(scriptTitle, documentName);
    } else {
      toast(`Document "${documentName}" approved successfully`, {
        className: "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
        style: { backgroundColor: "#dcfce7", borderColor: "#22c55e", color: "#166534" },
      });
    }
  };

  const handleRequestAdditionalDocument = (data: any) => {
    if (!scriptTitle || !parentCerId) return;
    if (onRequestAdditionalDocument) {
      onRequestAdditionalDocument(scriptTitle, parentCerId, data.thirdPartyRequirement, data.analystNotes);
    } else {
      toast("Additional document request submitted successfully", {
        className: "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
        style: { backgroundColor: "#dcfce7", borderColor: "#22c55e", color: "#166534" },
      });
    }
  };

  const getThirdPartyRequirement = (sid: string) => REQUIREMENT_MAP[sid] || "Third party requirement information not available for this test script.";

  const getActivityLogData = (sid: string) => {
    if (sid === "ts-1") {
      return BASE_ACTIVITIES.slice(0, 3);
    } else if (sid === "ts-2") {
      return BASE_ACTIVITIES;
    } else {
      return BASE_ACTIVITIES.slice(0, 4);
    }
  };

  const [selectedCitation, setSelectedCitation] = useState<{ documentName: string; page: number; paragraph: number; highlightText: string } | null>(null);
  const [isCitationPanelOpen, setIsCitationPanelOpen] = useState(false);
  const [isSupportiveDocumentsOpen, setIsSupportiveDocumentsOpen] = useState(true);
  const [isSupportiveDocumentsExpanded, setIsSupportiveDocumentsExpanded] = useState(true);
  const [isActivityLogExpanded, setIsActivityLogExpanded] = useState(true);
  const [shouldOpenSupportiveDocsCollapsed, setShouldOpenSupportiveDocsCollapsed] = useState(false);
  const [citationSearchQuery, setCitationSearchQuery] = useState("");

  const CustomClickableCitations = ({ text, className = "" }: { text: string; className?: string }) => {
    const renderTextWithCitations = (t: string) => {
      const parts: any[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      CITATION_REGEX.lastIndex = 0;
      while ((match = CITATION_REGEX.exec(t)) !== null) {
        if (match.index > lastIndex) parts.push(t.substring(lastIndex, match.index));
        const [fullMatch, documentName, pageStr, paragraphStr] = match;
        const page = parseInt(pageStr);
        const paragraph = parseInt(paragraphStr);
        parts.push(
          <button
            key={`citation-${match.index}`}
            onClick={() => handleCitationClick(documentName.trim(), page, paragraph)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-1 py-0.5 rounded transition-colors cursor-pointer font-medium underline decoration-dotted underline-offset-2"
            title={`Click to view ${documentName.trim()}, page ${page}, paragraph ${paragraph}`}
          >
            {fullMatch}
          </button>
        );
        lastIndex = match.index + fullMatch.length;
      }
      if (lastIndex < t.length) parts.push(t.substring(lastIndex));
      return parts.length > 0 ? parts : [t];
    };
    return <div className={className}>{renderTextWithCitations(text)}</div>;
  };

  const renderCurrentView = () => {
    return (
      <div className="h-full flex flex-col bg-gray-50 relative">
        <div className="bg-white border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-lg font-medium">Test Script Analysis</h2>
                <div className="flex items-center gap-3">
                  <p className="text-sm text-gray-600">{scriptTitle}</p>
                  {hasVersionHistory && (
                    <Badge variant="outline" className="text-xs">
                      <Info className="h-3 w-3 mr-1" />
                      {messages.filter((msg) => msg.type === "ai" && msg.version).length} versions available
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant={isActivityLogOpen ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2 h-9 px-3"
                title="Activity Log"
                onClick={() => {
                  setIsActivityLogOpen(!isActivityLogOpen);
                  if (!isActivityLogOpen) {
                    setIsSupportiveDocumentsOpen(false);
                  } else {
                    setIsSupportiveDocumentsOpen(true);
                  }
                }}
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </Button>

              {(!isCurrentVersionApproved() || hasRepopulatedAfterApproval) && (
                <>
                  <Button
                    onClick={handleApprove}
                    disabled={isApproving || isDialogueBoxFocused || (isCurrentVersionApproved() && !hasRepopulatedAfterApproval)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isApproving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    {isApproving ? "Approving..." : `Approve ${currentVersion}`}
                  </Button>
                </>
              )}

              {isCurrentVersionApproved() && !hasRepopulatedAfterApproval && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approved
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden min-h-0">
          <div
            className={`${isCitationPanelOpen ? 'border-r' : ''} transition-all duration-300 flex flex-col`}
            style={{
              width: isCitationPanelOpen
                ? '50%'
                : (isActivityLogOpen || isSupportiveDocumentsOpen)
                  ? isActivityLogOpen
                    ? isActivityLogExpanded
                      ? 'calc(100% - 360px)'
                      : 'calc(100% - 104px)'
                    : isSupportiveDocumentsExpanded
                      ? 'calc(100% - 360px)'
                      : 'calc(100% - 104px)'
                  : '60%'
            }}
          >
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4 pb-0">
                  {messages.map((message, index) => {
                    const isNewAnalysisVersion = message.type === "ai" && message.version && message.content.title &&
                      (index === 0 || messages[index - 1].type === "human" || (messages[index - 1].type === "ai" && messages[index - 1].version !== message.version));

                    return (
                      <div key={message.id}>
                        {isNewAnalysisVersion && index > 0 && (
                          <div className="flex items-center gap-2 py-2 mb-3">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                              Updated to {message.version}
                            </Badge>
                            <div className="flex-1 h-px bg-gray-200"></div>
                          </div>
                        )}

                        <div className={`flex gap-3 ${message.type === "human" ? "flex-row-reverse" : ""}`}>
                          <div className="flex-shrink-0">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${message.type === "ai" ? "bg-blue-100" : "bg-gray-100"}`}>
                              {message.type === "ai" ? (
                                <Bot className="h-3 w-3 text-blue-600" />
                              ) : (
                                <User className="h-3 w-3 text-gray-600" />
                              )}
                            </div>
                          </div>

                          <div className={`flex-1 ${message.type === "human" ? "max-w-lg" : ""}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{message.author}</span>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>
                            </div>

                            {message.type === "ai" && message.content.title ? (
                              <Card className="shadow-sm">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">{message.content.title}</CardTitle>
                                  <div className="flex items-center gap-2">
                                    {message.content.confidence && (
                                      <Badge variant="outline" className={`text-xs ${message.content.confidence >= 85 ? 'bg-green-50 text-green-700 border-green-200' : message.content.confidence >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        {message.content.confidence}% Confidence
                                      </Badge>
                                    )}
                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {message.content.reasoningSteps && message.content.reasoningSteps.length > 0 && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-sm font-medium">AI Reasoning</h4>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => setIsAIReasoningExpanded(!isAIReasoningExpanded)}
                                          className="h-auto p-1 text-gray-500 hover:text-gray-700"
                                        >
                                          {isAIReasoningExpanded ? (
                                            <ChevronUp className="h-3 w-3" />
                                          ) : (
                                            <ChevronDown className="h-3 w-3" />
                                          )}
                                        </Button>
                                      </div>
                                      {isAIReasoningExpanded && (
                                        <div className="space-y-2 text-sm">
                                          {message.content.reasoningSteps.map((step, stepIndex) => (
                                            <div key={stepIndex} className="pl-3 border-l-2 border-blue-100">
                                              <CustomClickableCitations text={step} />
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {message.content.generatedInsight && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">Analysis Summary</h4>
                                      <div className="text-sm text-gray-700 leading-relaxed">
                                        <CustomClickableCitations text={message.content.generatedInsight} />
                                      </div>
                                    </div>
                                  )}

                                  {message.content.sourceDocuments && message.content.sourceDocuments.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">Source Documents</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {message.content.sourceDocuments.map((doc, docIndex) => (
                                          <Badge key={docIndex} variant="outline" className="text-xs">
                                            <FileText className="h-3 w-3 mr-1" />
                                            {doc}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ) : (
                              <div className={`${message.type === "human" ? "bg-gray-100 text-gray-900 rounded-lg p-3 ml-auto" : "text-gray-700"}`}>
                                <CustomClickableCitations text={message.content.text || ""} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {isProcessing && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-100">
                          <Bot className="h-3 w-3 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">VCM Agent</span>
                          <span className="text-xs text-gray-500">typing...</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isRepopulating && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-blue-100">
                          <Bot className="h-3 w-3 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">VCM Agent</span>
                          <span className="text-xs text-gray-500">regenerating analysis...</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-600">Incorporating latest evidence and insights</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {isCitationPanelOpen && selectedCitation ? (
            <div className="w-1/2 flex flex-col bg-white transition-all duration-300 fixed top-39 bottom-0 right-0 z-50 border-l border-t">
              <div className="bg-gray-50 border-b px-4 py-2 flex-shrink-0 min-h-[60px] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-800">Document Citation</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search in document"
                      value={citationSearchQuery}
                      onChange={(e) => setCitationSearchQuery(e.target.value)}
                      className="pl-9 pr-8 h-9 w-56 text-sm"
                    />
                    {citationSearchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCitationSearchQuery("")}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-200 rounded-full"
                        title="Clear search"
                      >
                        <X className="h-3 w-3 text-gray-500" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCloseCitationPanel}
                    className="h-8 w-8 p-0 hover:bg-gray-200 flex-shrink-0"
                    title="Close citation view"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden min-h-0">
                <InlayDocumentCitation
                  citation={selectedCitation}
                  onClose={handleCloseCitationPanel}
                  searchQuery={citationSearchQuery}
                  onMapToTextArea={(selectedText: string) => {
                    const formattedText = `"${selectedText}"`;
                    setInputMessage((prev) => (prev ? `${prev}\n\n${formattedText}` : formattedText));
                    toast("Text added to AI input", {
                      className: "border-blue-500 bg-blue-100 text-blue-800 font-medium shadow-lg",
                      style: { backgroundColor: "#dbeafe", borderColor: "#3b82f6", color: "#1e40af" },
                    });
                    setTimeout(() => {
                      const textArea = document.querySelector('textarea[placeholder*="Add your analysis"]') as HTMLTextAreaElement;
                      if (textArea) {
                        textArea.focus();
                        const textLength = textArea.value.length;
                        textArea.setSelectionRange(textLength, textLength);
                        textArea.scrollTop = textArea.scrollHeight;
                      }
                    }, 100);
                  }}
                />
              </div>
            </div>
          ) : (
            (isActivityLogOpen || isSupportiveDocumentsOpen) && (
              <div className="flex-shrink-0 transition-all duration-300">
                {isActivityLogOpen ? (
                  <ActivityLog
                    activities={getActivityLogData(scriptId)}
                    onClose={() => {
                      setIsActivityLogOpen(false);
                      setShouldOpenSupportiveDocsCollapsed(true);
                      setIsSupportiveDocumentsOpen(true);
                    }}
                    onExpandedChange={setIsActivityLogExpanded}
                  />
                ) : (
                  <SupportiveDocumentsPanel
                    isOpen={isSupportiveDocumentsOpen}
                    onClose={() => setIsSupportiveDocumentsOpen(false)}
                    documents={getSupportiveDocuments(scriptId)}
                    isCollapsible={true}
                    onExpandedChange={(expanded) => {
                      setIsSupportiveDocumentsExpanded(expanded);
                      if (shouldOpenSupportiveDocsCollapsed) {
                        setShouldOpenSupportiveDocsCollapsed(false);
                      }
                    }}
                    scriptId={scriptTitle}
                    thirdPartyRequirement={getThirdPartyRequirement(scriptId)}
                    onRequestReupload={handleRequestReupload}
                    onRequestAdditionalDocument={handleRequestAdditionalDocument}
                    onApproveReupload={handleApproveReupload}
                    initialExpanded={!shouldOpenSupportiveDocsCollapsed}
                    sharedTestScripts={sharedTestScripts}
                    uploadStates={uploadStates}
                    parentCerId={parentCerId}
                  />
                )}
              </div>
            )
          )}
        </div>

        <div
          className="bg-white border-t p-3 flex-shrink-0 transition-all duration-300"
          style={{
            width: isCitationPanelOpen
              ? '50%'
              : (isActivityLogOpen || isSupportiveDocumentsOpen)
                ? isActivityLogOpen
                  ? isActivityLogExpanded
                    ? 'calc(100% - 319px)'
                    : 'calc(100% - 63px)'
                  : isSupportiveDocumentsExpanded
                    ? 'calc(100% - 320px)'
                    : 'calc(100% - 64px)'
                : '100%',
            marginRight: isCitationPanelOpen
              ? '0'
              : (isActivityLogOpen || isSupportiveDocumentsOpen)
                ? isActivityLogOpen
                  ? isActivityLogExpanded
                    ? '319px'
                    : '63px'
                  : isSupportiveDocumentsExpanded
                    ? '320px'
                    : '64px'
                : '0'
          }}
        >
          <div className="flex gap-3 items-start">
            <div className="flex-1 mb-3">
              <DocumentMentionTextarea
                value={inputMessage}
                onChange={setInputMessage}
                onFocus={() => setIsDialogueBoxFocused(true)}
                onBlur={() => setIsDialogueBoxFocused(false)}
                placeholder="Add your analysis, insights, or questions..."
                documents={getSupportiveDocuments(scriptId)}
                className="min-h-[70px]"
              />
            </div>
            <div className="flex flex-col flex-shrink-0 min-w-fit">
              <Button
                onClick={handleRepopulate}
                disabled={isRepopulating}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <RefreshCw className="h-4 w-4" />
                Repopulate
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderCurrentView();
}
