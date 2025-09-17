import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Bot, User, FileText, Send, Loader2, RefreshCw, CheckCircle, ChevronDown, ChevronUp, Info, X, Search, Clock } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner@2.0.3";
import ClickableCitations from "./ClickableCitations";
import SupportiveDocumentsPanel from "./SupportiveDocumentsPanel";
import DocumentMentionTextarea from "./DocumentMentionTextarea";
import InlayDocumentCitation from "./InlayDocumentCitation";
import ActivityLog from "./ActivityLog/ActivityLog";

interface ConversationalTranscriptDetailViewProps {
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
  approvedVersions?: Record<string, { version: string; timestamp: string; scriptId: string; cerId: string; approvedData?: any }>;
}

interface Evidence {
  id: string;
  name: string;
  type: "policy" | "document" | "log" | "certificate" | "report";
  status: "available" | "missing" | "under-review";
  uploadDate?: string;
  size?: string;
  relevanceScore: number;
}

interface ChatMessage {
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
  
  // Citation panel state
  const [selectedCitation, setSelectedCitation] = useState<{documentName: string; page: number; paragraph: number; highlightText: string} | null>(null);
  const [isCitationPanelOpen, setIsCitationPanelOpen] = useState(false);
  const [isSupportiveDocumentsOpen, setIsSupportiveDocumentsOpen] = useState(true);
  const [isSupportiveDocumentsExpanded, setIsSupportiveDocumentsExpanded] = useState(true);
  const [isActivityLogExpanded, setIsActivityLogExpanded] = useState(true);
  const [shouldOpenSupportiveDocsCollapsed, setShouldOpenSupportiveDocsCollapsed] = useState(false);
  const [citationSearchQuery, setCitationSearchQuery] = useState("");
  
  // Check if current version has been approved by analyst
  const isCurrentVersionApproved = () => {
    if (!parentCerId || !scriptId || !approvedVersions) return false;
    const approvalKey = `${parentCerId}_${scriptId}`;
    const approvedVersion = approvedVersions[approvalKey];
    return approvedVersion && approvedVersion.version === currentVersion;
  };
  
  // Handle mapping selected text to input area
  const handleMapToTextArea = (selectedText: string) => {
    // Append the selected text to the existing input message with proper formatting
    const formattedText = `"${selectedText}"`;
    setInputMessage(prev => prev ? `${prev}\n\n${formattedText}` : formattedText);
    
    // Show success toast
    toast("Text added to AI input", {
      className: "border-blue-500 bg-blue-100 text-blue-800 font-medium shadow-lg",
      style: {
        backgroundColor: "#dbeafe",
        borderColor: "#3b82f6",
        color: "#1e40af",
      },
    });
    
    // Keep citation panel open and focus input area
    setTimeout(() => {
      const textArea = document.querySelector('textarea[placeholder*="Add your analysis"]') as HTMLTextAreaElement;
      if (textArea) {
        textArea.focus();
        // Position cursor at the end of the text
        const textLength = textArea.value.length;
        textArea.setSelectionRange(textLength, textLength);
        textArea.scrollTop = textArea.scrollHeight; // Scroll to bottom of textarea
      }
    }, 100);
  };

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollToBottom) {
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
      setScrollToBottom(false);
    }
  }, [scrollToBottom, messages]);

  // Generate enhanced AI analysis content with citations
  const getAIAnalysisContent = (scriptId: string) => {
    // Enhanced AI analysis with inline citations
    const analysisContent = {
      "ts-1": {
        title: "VCM Agent Analysis for Expense Report Controls",
        reasoningSteps: [
          "1. **Control Design Assessment**: Evaluated the expense reporting process against industry standards and regulatory requirements. The control requires manager approval for expenses over $500, which aligns with standard segregation of duties principles [SOC2 Report 2025, pg 8, para 3].",
          "2. **Evidence Review**: Analyzed available documentation including expense reports, approval workflows, and policy documentation. Found comprehensive evidence supporting control effectiveness with proper data classification standards [IPSRA Risk Scorecard, pg 12, para 2].",
          "3. **Testing Validation**: Reviewed sample transactions to verify control execution. All tested transactions showed proper approvals and documentation as outlined in supplemental materials [SOC2 Report 2025, pg 15, para 1].",
          "4. **Risk Assessment**: Evaluated residual risk considering control design and operational effectiveness. Risk is appropriately mitigated through dual authorization requirements."
        ],
        sourceDocuments: ["Expense Policy v2.1", "Manager Approval Matrix", "Sample Expense Reports (Q4 2024)"],
        generatedInsight: "The expense reporting control is well-designed and consistently executed. The $500 threshold appropriately balances operational efficiency with risk management. Regular monitoring of this control continues to demonstrate effectiveness in preventing unauthorized expenses and ensuring proper documentation with appropriate data classification standards [IPSRA Risk Scorecard, pg 12, para 2]. Additional validation is provided through comprehensive supplemental materials [SOC2 Report 2025, pg 15, para 1].",
        confidence: 92,
        disposition: "Effective"
      },
      "ts-2": {
        title: "VCM Agent Analysis for Purchase Order Controls", 
        reasoningSteps: [
          "1. **Control Framework Analysis**: Assessed dual authorization requirements for purchase orders exceeding $1,000. This threshold and approval structure provides strong preventive controls [SOC2 Report 2025, pg 8, para 3].",
          "2. **Authority Matrix Review**: Verified that department heads have appropriate authority levels and segregation from procurement functions. Authority delegation is properly documented [IPSRA Risk Scorecard, pg 5, para 4].",
          "3. **Process Testing**: Sampled purchase orders across different amounts and departments. All transactions showed proper dual signatures and department head approvals [SOC2 Report 2025, pg 12, para 1].",
          "4. **Exception Analysis**: Identified minimal exceptions, all properly documented with appropriate management override justification."
        ],
        sourceDocuments: ["Purchase Order Policy", "Authority Matrix", "PO Sample Testing Results"],
        generatedInsight: "Purchase order controls demonstrate robust design and consistent operation. The dual authorization requirement effectively prevents unauthorized procurement activities. Department head involvement ensures appropriate business justification for purchases [SOC2 Report 2025, pg 8, para 3]. Regular monitoring confirms ongoing control effectiveness.",
        confidence: 94,
        disposition: "Effective"
      }
    };

    return analysisContent[scriptId as keyof typeof analysisContent] || {
      title: "VCM Agent Analysis",
      reasoningSteps: [
        "1. **Initial Assessment**: Comprehensive review of control design and implementation [SOC2 Report 2025, pg 8, para 3].",
        "2. **Evidence Analysis**: Evaluation of supporting documentation and evidence quality.",
        "3. **Risk Evaluation**: Assessment of control effectiveness in mitigating identified risks.",
        "4. **Conclusion**: Final determination of control adequacy and recommendations."
      ],
      sourceDocuments: ["Control Documentation", "Evidence Package", "Risk Assessment"],
      generatedInsight: "Control analysis completed with comprehensive evidence review. Further testing may be required to fully assess operational effectiveness [SOC2 Report 2025, pg 8, para 3].",
      confidence: 85,
      disposition: "Requires Review"
    };
  };

  // Mock supportive documents data
  const getSupportiveDocuments = (scriptId: string) => {
    const baseDocuments = [
      {
        id: "doc-1",
        name: "SOC 2 Type II Report 2025",
        type: "report" as const,
        status: "available" as const,
        relevanceScore: 95,
        lastUpdated: "2 weeks ago",
        owner: "External Auditor",
        size: "2.4 MB",
        description: "Comprehensive SOC 2 audit report covering security, availability, and confidentiality controls"
      },
      {
        id: "doc-2", 
        name: "IPSRA Risk Scorecard",
        type: "evidence" as const,
        status: "available" as const,
        relevanceScore: 88,
        lastUpdated: "1 week ago",
        owner: "Risk Team",
        size: "856 KB",
        description: "Internal risk assessment scorecard with control effectiveness ratings"
      },
      {
        id: "doc-3",
        name: "Expense Management Policy v2.1",
        type: "policy" as const,
        status: "available" as const,
        relevanceScore: 92,
        lastUpdated: "3 weeks ago", 
        owner: "Finance Team",
        size: "1.2 MB",
        description: "Updated policy document outlining expense approval workflows and thresholds"
      },
      {
        id: "doc-4",
        name: "Purchase Order Authority Matrix",
        type: "procedure" as const,
        status: "available" as const,
        relevanceScore: 85,
        lastUpdated: "1 month ago",
        owner: "Procurement Team", 
        size: "420 KB",
        description: "Authorization levels and approval requirements for purchase orders"
      },
      {
        id: "doc-5",
        name: "Control Testing Results Q4 2024",
        type: "evidence" as const,
        status: "under-review" as const,
        relevanceScore: 78,
        lastUpdated: "3 days ago",
        owner: "Internal Audit",
        size: "3.1 MB",
        description: "Quarterly control testing results with sample analyses and exceptions"
      },
      {
        id: "doc-6",
        name: "ISO 27001 Certificate",
        type: "certificate" as const,
        status: "available" as const,
        relevanceScore: 72,
        lastUpdated: "6 months ago",
        owner: "Compliance Team",
        size: "125 KB",
        description: "Current ISO 27001 certification for information security management"
      }
    ];

    // Return script-specific subset for different test scripts
    if (scriptId === "ts-1") {
      return baseDocuments.slice(0, 4); // Expense-related documents
    } else if (scriptId === "ts-2") {
      return [baseDocuments[0], baseDocuments[1], baseDocuments[3], baseDocuments[4], baseDocuments[5]]; // Purchase order related
    } else {
      return baseDocuments; // All documents for other scripts
    }
  };

  // Initialize messages with enhanced AI analysis and load version history
  useEffect(() => {
    let allMessages: ChatMessage[] = [];
    
    // Check if version history contains v1 to avoid duplicates
    const hasV1InHistory = versionHistory && versionHistory.some(v => v.version === 'v1');
    
    // Only create the original v1 analysis if it's not already in version history
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
          disposition: aiAnalysis.disposition
        },
        isLatest: versionHistory.length === 0 // Only latest if no version history
      };
      
      allMessages = [originalMessage];
    }
    
    // If there's version history, reconstruct the complete conversation timeline
    if (versionHistory && versionHistory.length > 0) {
      // Sort version history by timestamp to maintain chronological order
      const sortedHistory = [...versionHistory].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      sortedHistory.forEach((version, index) => {
        // Add human insight message if it exists (this would be the analyst's input before repopulation)
        if (version.humanInsight) {
          const humanMessage: ChatMessage = {
            id: `human-insight-${version.version}`,
            type: "human",
            author: "Jacob Corman",
            timestamp: new Date(version.timestamp).toLocaleString(),
            content: {
              text: version.humanInsight
            }
          };
          allMessages.push(humanMessage);
        }
        
        // Add AI analysis message
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
            disposition: version.analysisData?.content?.disposition
          },
          isLatest: index === sortedHistory.length - 1 // Latest version is the last one in history
        };
        allMessages.push(aiMessage);
      });
      
      setHasVersionHistory(true);
      
      // Set current version to the latest approved version if available
      const approvedVersions = sortedHistory.filter(v => v.status === 'approved');
      if (approvedVersions.length > 0) {
        const latestApproved = approvedVersions[approvedVersions.length - 1];
        
        // Check if there are any versions after the latest approved version (indicating repopulation after approval)
        const latestApprovedIndex = sortedHistory.findIndex(v => v.version === latestApproved.version && v.status === 'approved');
        const hasVersionsAfterApproved = latestApprovedIndex < sortedHistory.length - 1;
        
        if (hasVersionsAfterApproved) {
          // If there are repopulated versions after approval, set current version to the latest one
          const latestVersion = sortedHistory[sortedHistory.length - 1];
          setCurrentVersion(latestVersion.version);
          setHasRepopulatedAfterApproval(true);
          setIsApproved(false); // Reset approval status since there's a new version
        } else {
          // No repopulation after approval, use the approved version
          setCurrentVersion(latestApproved.version);
          setIsApproved(true);
          setHasRepopulatedAfterApproval(false);
        }
      } else {
        // Set to latest version if no approved versions
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

    const userInput = inputMessage; // Store input before clearing
    setIsProcessing(true);
    
    // Add human message
    const humanMessage: ChatMessage = {
      id: `human-${Date.now()}`,
      type: "human",
      author: "Jacob Corman",
      timestamp: "Now",
      content: {
        text: inputMessage
      }
    };

    setMessages(prev => [...prev, humanMessage]);
    setInputMessage("");
    setScrollToBottom(true); // Trigger auto-scroll

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "ai", 
        author: "VCM Agent",
        timestamp: "Now",
        content: {
          text: `Thank you for your input. I understand your concern about "${userInput}". Based on the available evidence [SOC2 Report 2025, pg 8, para 3], I can provide additional analysis to address this point. Would you like me to elaborate on any specific aspect of the control assessment?`
        }
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
      setScrollToBottom(true); // Trigger auto-scroll for AI response
    }, 2000);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    
    setTimeout(() => {
      setIsApproved(true);
      setHasRepopulatedAfterApproval(false); // Reset repopulation flag after approval
      setIsApproving(false);
      
      // Show success toast
      toast("Analysis approved successfully", {
        className: "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#dcfce7",
          borderColor: "#22c55e", 
          color: "#166534",
        },
      });

      // Navigate back after approval with complete analysis data
      if (onApproveAndNavigate) {
        // Find the latest AI analysis message with the current version
        const latestAnalysis = messages.find(msg => 
          msg.type === "ai" && 
          msg.version === currentVersion && 
          msg.content.title
        );
        
        setTimeout(() => {
          onApproveAndNavigate(currentVersion, latestAnalysis);
        }, 1000);
      }
    }, 1500);
  };

  const handleRepopulate = () => {
    // Store the human insight text to pass to version history
    const humanInsightText = inputMessage.trim();
    
    // If there's input text, add it as a human message first
    if (humanInsightText) {
      const humanMessage: ChatMessage = {
        id: `human-repopulate-${Date.now()}`,
        type: "human",
        author: "Jacob Corman",
        timestamp: "Now",
        content: {
          text: humanInsightText
        }
      };
      
      // Add human message immediately and clear input
      setMessages(prev => [...prev, humanMessage]);
      setInputMessage(""); // Clear the input after adding to chat
      setScrollToBottom(true); // Trigger auto-scroll for human message
      
      // Add a shorter delay to ensure human message is visible before starting repopulation
      setTimeout(() => {
        setIsRepopulating(true);
        
        // Add another delay for the AI analysis generation
        setTimeout(() => {
          // Get next version number - check all existing versions to determine the next one using the latest state
          setMessages(currentMessages => {
            const allVersionNumbers = currentMessages
              .filter(msg => msg.type === "ai" && msg.version)
              .map(msg => parseInt(msg.version!.slice(1)))
              .filter(num => !isNaN(num));
          
            const nextVersionNum = allVersionNumbers.length > 0 ? Math.max(...allVersionNumbers) + 1 : 2;
            const nextVersionNumber = `v${nextVersionNum}`;
            setCurrentVersion(nextVersionNumber);

            // Simulate updated analysis
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
                  "4. **Final Validation**: Comprehensive review confirming enhanced control effectiveness."
                ],
                sourceDocuments: ["Updated Policy Documentation", "Extended Sample Testing", "Recent Audit Reports"],
                generatedInsight: "Updated analysis confirms robust control design with enhanced operational effectiveness. Recent improvements in documentation and monitoring strengthen overall control environment [SOC2 Report 2025, pg 8, para 3]. Confidence level increased based on additional evidence validation.",
                confidence: 96
              },
              isLatest: true
            };

            // Mark all previous messages as not latest and add new AI response
            const updatedMessages = currentMessages.map(msg => ({ ...msg, isLatest: false }));
            const finalMessages = [...updatedMessages, updatedMessage];
            
            // Notify parent about the new version, including the human insight
            if (onVersionUpdate) {
              // Create a custom version update that includes the human insight
              const versionUpdateWithInsight = {
                ...updatedMessage,
                humanInsight: humanInsightText // Add the human insight to preserve it
              };
              onVersionUpdate(nextVersionNumber, versionUpdateWithInsight);
            }
            
            // Set repopulation flag to true after repopulating
            setHasRepopulatedAfterApproval(true);
            
            return finalMessages;
          });
          
          // Now we have version history since we have multiple AI analysis messages
          setHasVersionHistory(true);
          setIsRepopulating(false);
          setScrollToBottom(true); // Trigger auto-scroll for AI response
          
          toast("Analysis updated with latest information", {
            className: "border-blue-500 bg-blue-100 text-blue-800 font-medium shadow-lg",
            style: {
              backgroundColor: "#dbeafe",
              borderColor: "#3b82f6",
              color: "#1e40af",
            },
          });
        }, 2500); // AI analysis generation delay
      }, 500); // Short delay to ensure human message is rendered
    } else {
      // If no input text, just start repopulation process
      setIsRepopulating(true);
      
      setTimeout(() => {
        // Get next version number - check all existing versions to determine the next one using the latest state
        setMessages(currentMessages => {
          const allVersionNumbers = currentMessages
            .filter(msg => msg.type === "ai" && msg.version)
            .map(msg => parseInt(msg.version!.slice(1)))
            .filter(num => !isNaN(num));
          
          const nextVersionNum = allVersionNumbers.length > 0 ? Math.max(...allVersionNumbers) + 1 : 2;
          const nextVersionNumber = `v${nextVersionNum}`;
          setCurrentVersion(nextVersionNumber);

          // Simulate updated analysis
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
                "4. **Final Validation**: Comprehensive review confirming enhanced control effectiveness."
              ],
              sourceDocuments: ["Updated Policy Documentation", "Extended Sample Testing", "Recent Audit Reports"],
              generatedInsight: "Updated analysis confirms robust control design with enhanced operational effectiveness. Recent improvements in documentation and monitoring strengthen overall control environment [SOC2 Report 2025, pg 8, para 3]. Confidence level increased based on additional evidence validation.",
              confidence: 96
            },
            isLatest: true
          };

          // Mark all previous messages as not latest and add new AI response
          const updatedMessages = currentMessages.map(msg => ({ ...msg, isLatest: false }));
          const finalMessages = [...updatedMessages, updatedMessage];
          
          // Notify parent about the new version (no human insight in this case)
          if (onVersionUpdate) {
            onVersionUpdate(nextVersionNumber, updatedMessage);
          }
          
          // Set repopulation flag to true after repopulating
          setHasRepopulatedAfterApproval(true);
          
          return finalMessages;
        });
        
        // Now we have version history since we have multiple AI analysis messages
        setHasVersionHistory(true);
        setIsRepopulating(false);
        setScrollToBottom(true); // Trigger auto-scroll for AI response
        
        toast("Analysis updated with latest information", {
          className: "border-blue-500 bg-blue-100 text-blue-800 font-medium shadow-lg",
          style: {
            backgroundColor: "#dbeafe",
            borderColor: "#3b82f6",
            color: "#1e40af",
          },
        });
      }, 2500);
    }
  };

  // Handle citation clicks from inline citations
  const handleCitationClick = (documentName: string, page: number, paragraph: number) => {
    // Map document names and pages to specific highlight text
    const getCitationHighlight = (docName: string, pageNum: number, paraNum: number) => {
      const citationKey = `${docName}-p${pageNum}-para${paraNum}`;
      
      const citationMap: Record<string, string> = {
        // SOC2 Report citations
        "SOC2 Report 2025-p8-para3": "encryption for data at rest using AES-256",
        "SOC2 Security Report 2025-p8-para3": "encryption for data at rest using AES-256",
        "SOC2 Report 2025-p15-para1": "Supplemental materials include",
        "SOC2 Security Report 2025-p15-para1": "Supplemental materials include",
        
        // IPSRA Risk Scorecard citations
        "IPSRA Risk Scorecard-p12-para2": "Data classification categories include",
        
        // Fallback patterns
        "SOC2 Report 2025": "encryption for data at rest using AES-256",
        "SOC2 Security Report 2025": "encryption for data at rest using AES-256",
        "IPSRA Risk Scorecard": "Data classification categories include",
        "Coupa Vendor Profile": "vendor risk evaluation criteria"
      };

      return citationMap[citationKey] || citationMap[docName] || "";
    };

    const citation = {
      documentName,
      page,
      paragraph,
      highlightText: getCitationHighlight(documentName, page, paragraph)
    };

    setSelectedCitation(citation);
    setIsSupportiveDocumentsOpen(false); // Close supportive documents
    setIsCitationPanelOpen(true); // Open citation panel as inlay
  };

  // Handle closing citation panel
  const handleCloseCitationPanel = () => {
    setIsCitationPanelOpen(false);
    setSelectedCitation(null);
    setIsSupportiveDocumentsOpen(true); // Reopen supportive documents
  };

  // Handle request re-upload from documents panel
  const handleRequestReupload = (data: any) => {
    // This would normally be sent to backend API
    console.log('Re-upload request:', data);
    
    // Use the new onRequestReupload handler if available
    if (onRequestReupload && scriptTitle && parentCerId) {
      onRequestReupload(scriptTitle, parentCerId, data.documentName, data.reason, data.analystNotes);
    } else if (onActionItemCreated && scriptTitle && parentCerId) {
      // Fallback to old action item creation logic
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
          "CER-12567": "Kevin O'Brien"
        };
        return cerToVendorMap[cerId] || "Unknown Vendor";
      };
      
      const vendorName = getCERVendorName(parentCerId);
      onActionItemCreated(scriptTitle, parentCerId, vendorName);
    }
  };

  // Handle approve re-upload from documents panel
  const handleApproveReupload = (documentName: string) => {
    if (!scriptTitle) return;
    
    // Call the parent's approval handler if available
    if (onApproveReupload) {
      onApproveReupload(scriptTitle, documentName);
    } else {
      // Fallback: show success feedback
      toast(`Document "${documentName}" approved successfully`, {
        className: "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#dcfce7",
          borderColor: "#22c55e",
          color: "#166534",
        },
      });
    }
  };

  // Handle request additional document from documents panel
  const handleRequestAdditionalDocument = (data: any) => {
    if (!scriptTitle || !parentCerId) return;
    
    // Call the parent's additional document request handler
    if (onRequestAdditionalDocument) {
      onRequestAdditionalDocument(
        scriptTitle, 
        parentCerId, 
        data.thirdPartyRequirement, 
        data.analystNotes
      );
    } else {
      // Fallback: show success feedback
      toast("Additional document request submitted successfully", {
        className: "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#dcfce7",
          borderColor: "#22c55e",
          color: "#166534",
        },
      });
    }
    
    // Add activity log entry (would normally be handled by parent component)
    // For now, just show success message since the modal already handles the toast
  };

  // Get third party requirement for current script
  const getThirdPartyRequirement = (scriptId: string) => {
    const requirementMap: Record<string, string> = {
      "ts-1": "Expense reporting process must include manager approval for expenses over $500 with proper documentation and business justification.",
      "ts-2": "All purchase orders require dual authorization for amounts exceeding $1,000 and must be approved by department heads.",
      // Add more script requirements as needed
    };
    
    return requirementMap[scriptId] || "Third party requirement information not available for this test script.";
  };

  // Get activity log data for current script
  const getActivityLogData = (scriptId: string) => {
    const baseActivities = [
      {
        id: "activity-1",
        type: "ai-populated" as const,
        message: "AI analysis generated for test script validation",
        timestamp: "2 hours ago",
        confidence: 92
      },
      {
        id: "activity-2", 
        type: "human-insight" as const,
        message: "Jacob Corman added insights about control design",
        timestamp: "1 hour ago"
      },
      {
        id: "activity-3",
        type: "repopulated" as const,
        message: "AI analysis updated with additional evidence",
        timestamp: "45 minutes ago",
        confidence: 96,
        previousConfidence: 92
      },
      {
        id: "activity-4",
        type: "human-insight" as const,
        message: "Analyst requested additional documentation",
        timestamp: "30 minutes ago"
      },
      {
        id: "activity-5",
        type: "ai-populated" as const,
        message: "New evidence incorporated into analysis",
        timestamp: "15 minutes ago",
        confidence: 94
      }
    ];

    // Return script-specific activities
    if (scriptId === "ts-1") {
      return baseActivities.slice(0, 3); // Expense-related activities
    } else if (scriptId === "ts-2") {
      return baseActivities; // All activities for purchase order
    } else {
      return baseActivities.slice(0, 4); // Default activities for other scripts
    }
  };

  // Custom citation component that uses our local handler
  const CustomClickableCitations = ({ text, className = "" }: { text: string; className?: string }) => {
    // Regular expression to match citation patterns like [SOC2 Report 2025, pg 8, para 3]
    const citationRegex = /\[([^,]+),\s*pg\s*(\d+),\s*para\s*(\d+)\]/g;

    const renderTextWithCitations = (text: string) => {
      const parts = [];
      let lastIndex = 0;
      let match;

      // Reset regex lastIndex
      citationRegex.lastIndex = 0;

      while ((match = citationRegex.exec(text)) !== null) {
        // Add text before citation
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }

        // Add clickable citation
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

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts.length > 0 ? parts : [text];
    };

    return (
      <div className={className}>
        {renderTextWithCitations(text)}
      </div>
    );
  };

  const renderCurrentView = () => {
    return (
      <div className="h-full flex flex-col bg-gray-50 relative">
        {/* Header - UNCHANGED */}
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
                      {messages.filter(msg => msg.type === "ai" && msg.version).length} versions available
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Activity Log Icon */}
              <Button
                variant={isActivityLogOpen ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-2 h-9 px-3"
                title="Activity Log"
                onClick={() => {
                  setIsActivityLogOpen(!isActivityLogOpen);
                  if (!isActivityLogOpen) {
                    // Close supportive documents when opening activity log
                    setIsSupportiveDocumentsOpen(false);
                  } else {
                    // Reopen supportive documents when closing activity log
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

        {/* Middle Section - Side by Side Inlay View */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Risk Pilot Agent Section - Width adjusts based on citation panel, activity log, and supportive documents panel */}
          <div 
            className={`flex flex-col ${isCitationPanelOpen ? 'border-r' : ''} transition-all duration-300`}
            style={{
              width: isCitationPanelOpen 
                ? '50%' 
                : (isActivityLogOpen || isSupportiveDocumentsOpen)
                  ? isActivityLogOpen
                    ? isActivityLogExpanded
                      ? 'calc(100% - 360px)' // VCM Agent: reduce width to give more space to text area with expanded activity log panel
                      : 'calc(100% - 104px)'  // VCM Agent: reduce width to give more space to text area with collapsed activity log panel
                    : isSupportiveDocumentsExpanded 
                      ? 'calc(100% - 360px)' // VCM Agent: reduce width to give more space to text area with expanded supportive documents panel
                      : 'calc(100% - 104px)'  // VCM Agent: reduce width to give more space to text area with collapsed supportive documents panel
                  : '60%' // VCM Agent: reduce default width from 100% to 60% to give more space to text area
            }}
          >


            
            {/* Risk Pilot Messages */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4 pb-0">
                  {messages.map((message, index) => {
                    // Check if this is the start of a new AI analysis version
                    const isNewAnalysisVersion = message.type === "ai" && message.version && message.content.title &&
                      (index === 0 || messages[index - 1].type === "human" || 
                       (messages[index - 1].type === "ai" && messages[index - 1].version !== message.version));
                    
                    return (
                      <div key={message.id}>
                        {/* Version separator for new AI analysis versions (except the first one) */}
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
                          {/* Avatar */}
                          <div className="flex-shrink-0">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              message.type === "ai" ? "bg-blue-100" : "bg-gray-100"
                            }`}>
                              {message.type === "ai" ? (
                                <Bot className="h-3 w-3 text-blue-600" />
                              ) : (
                                <User className="h-3 w-3 text-gray-600" />
                              )}
                            </div>
                          </div>

                          {/* Message Content */}
                          <div className={`flex-1 ${message.type === "human" ? "max-w-lg" : ""}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{message.author}</span>
                              <span className="text-xs text-gray-500">{message.timestamp}</span>


                            </div>

                            {/* AI Analysis Card */}
                            {message.type === "ai" && message.content.title ? (
                              <Card className="shadow-sm">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">{message.content.title}</CardTitle>
                                  <div className="flex items-center gap-2">
                                    {message.content.confidence && (
                                      <Badge variant="outline" className={`text-xs ${
                                        message.content.confidence >= 85 ? 'bg-green-50 text-green-700 border-green-200' :
                                        message.content.confidence >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                        'bg-red-50 text-red-700 border-red-200'
                                      }`}>
                                        {message.content.confidence}% Confidence
                                      </Badge>
                                    )}

                                  </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {/* AI Reasoning Steps */}
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

                                  {/* Generated Insight */}
                                  {message.content.generatedInsight && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">Analysis Summary</h4>
                                      <div className="text-sm text-gray-700 leading-relaxed">
                                        <CustomClickableCitations text={message.content.generatedInsight} />
                                      </div>
                                    </div>
                                  )}

                                  {/* Source Documents */}
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
                              // Human message or AI text response
                              <div className={`${
                                message.type === "human" 
                                  ? "bg-gray-100 text-gray-900 rounded-lg p-3 ml-auto"
                                  : "text-gray-700"
                              }`}>
                                <CustomClickableCitations text={message.content.text || ""} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Loading states */}
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

          {/* Document Citation Section - 50% when citation is open */}
          {isCitationPanelOpen && selectedCitation ? (
            <div className="w-1/2 flex flex-col bg-white transition-all duration-300 fixed top-39 bottom-0 right-0 z-50 border-l border-t">
              {/* Citation Header */}
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

              {/* Citation Content */}
              <div className="flex-1 overflow-hidden min-h-0">
                <InlayDocumentCitation
                  citation={selectedCitation}
                  onClose={handleCloseCitationPanel}
                  searchQuery={citationSearchQuery}
                  onMapToTextArea={handleMapToTextArea}
                />
              </div>
            </div>
          ) : (
            /* Activity Log or Supportive Documents Section - Only the space it needs (when no citation is open) */
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
                      // Reset the flag after the panel has been rendered
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

        {/* Footer - Input Area */}
        <div 
          className="bg-white border-t p-3 flex-shrink-0 transition-all duration-300"
          style={{
            width: isCitationPanelOpen 
              ? '50%' 
              : (isActivityLogOpen || isSupportiveDocumentsOpen)
                ? isActivityLogOpen
                  ? isActivityLogExpanded
                    ? 'calc(100% - 319px)' // Text area: attach to expanded activity log panel
                    : 'calc(100% - 63px)'  // Text area: attach to collapsed activity log panel
                  : isSupportiveDocumentsExpanded 
                    ? 'calc(100% - 320px)' // Text area: attach to expanded supportive documents panel
                    : 'calc(100% - 64px)'  // Text area: attach to collapsed supportive documents panel
                : '100%',
            marginRight: isCitationPanelOpen 
              ? '0' 
              : (isActivityLogOpen || isSupportiveDocumentsOpen)
                ? isActivityLogOpen
                  ? isActivityLogExpanded
                    ? '319px' // Text area: extend right margin to attach to expanded activity log panel
                    : '63px'  // Text area: extend right margin to attach to collapsed activity log panel
                  : isSupportiveDocumentsExpanded 
                    ? '320px' // Text area: extend right margin to attach to expanded supportive documents panel
                    : '64px'  // Text area: extend right margin to attach to collapsed supportive documents panel
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