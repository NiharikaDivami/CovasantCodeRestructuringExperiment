import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Bot, User, FileText, Send, Loader2, RefreshCw, CheckCircle, ChevronDown, ChevronUp, Info } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner@2.0.3";
import ClickableCitations from "./ClickableCitations";

interface ConversationalTranscriptDetailViewProps {
  scriptId: string;
  onBack: () => void;
  onBackToDashboard?: () => void;
  onScriptUpdate?: (scriptId: string, updates: any) => void;
  onApproveAndNavigate?: () => void;
  scriptTitle?: string;
  scriptUpdates?: any;
  parentCerId?: string;
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
  scriptTitle,
  scriptUpdates,
  parentCerId
}: ConversationalTranscriptDetailViewProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [scrollToBottom, setScrollToBottom] = useState(false);

  const [isRepopulating, setIsRepopulating] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [isDialogueBoxFocused, setIsDialogueBoxFocused] = useState(false);
  const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
  const [hasVersionHistory, setHasVersionHistory] = useState(false);
  const [isAIReasoningExpanded, setIsAIReasoningExpanded] = useState(false);

  // Generate enhanced AI analysis content with citations
  const getAIAnalysisContent = (scriptId: string) => {
    // Enhanced AI analysis with inline citations
    const analysisContent = {
      "ts-1": {
        title: "Risk Pilot Agent Analysis for Expense Report Controls (v1)",
        reasoningSteps: [
          "1. **Control Design Assessment**: Evaluated the expense reporting process against industry standards and regulatory requirements. The control requires manager approval for expenses over $500, which aligns with standard segregation of duties principles [SOC2 Report 2025, pg 8, para 3].",
          "2. **Evidence Review**: Analyzed available documentation including expense reports, approval workflows, and policy documentation. Found comprehensive evidence supporting control effectiveness [IPSRA Risk Scorecard, pg 12, para 2].",
          "3. **Testing Validation**: Reviewed sample transactions to verify control execution. All tested transactions showed proper approvals and documentation [SOC2 Report 2025, pg 15, para 1].",
          "4. **Risk Assessment**: Evaluated residual risk considering control design and operational effectiveness. Risk is appropriately mitigated through dual authorization requirements."
        ],
        sourceDocuments: ["Expense Policy v2.1", "Manager Approval Matrix", "Sample Expense Reports (Q4 2024)"],
        generatedInsight: "The expense reporting control is well-designed and consistently executed. The $500 threshold appropriately balances operational efficiency with risk management. Regular monitoring of this control continues to demonstrate effectiveness in preventing unauthorized expenses and ensuring proper documentation [SOC2 Report 2025, pg 8, para 3].",
        confidence: 92
      },
      "ts-2": {
        title: "Risk Pilot Agent Analysis for Purchase Order Controls (v1)", 
        reasoningSteps: [
          "1. **Control Framework Analysis**: Assessed dual authorization requirements for purchase orders exceeding $1,000. This threshold and approval structure provides strong preventive controls [SOC2 Report 2025, pg 8, para 3].",
          "2. **Authority Matrix Review**: Verified that department heads have appropriate authority levels and segregation from procurement functions. Authority delegation is properly documented [IPSRA Risk Scorecard, pg 5, para 4].",
          "3. **Process Testing**: Sampled purchase orders across different amounts and departments. All transactions showed proper dual signatures and department head approvals [SOC2 Report 2025, pg 12, para 1].",
          "4. **Exception Analysis**: Identified minimal exceptions, all properly documented with appropriate management override justification."
        ],
        sourceDocuments: ["Purchase Order Policy", "Authority Matrix", "PO Sample Testing Results"],
        generatedInsight: "Purchase order controls demonstrate robust design and consistent operation. The dual authorization requirement effectively prevents unauthorized procurement activities. Department head involvement ensures appropriate business justification for purchases [SOC2 Report 2025, pg 8, para 3]. Regular monitoring confirms ongoing control effectiveness.",
        confidence: 94
      }
    };

    return analysisContent[scriptId as keyof typeof analysisContent] || {
      title: "Risk Pilot Agent Analysis",
      reasoningSteps: [
        "1. **Initial Assessment**: Comprehensive review of control design and implementation [SOC2 Report 2025, pg 8, para 3].",
        "2. **Evidence Analysis**: Evaluation of supporting documentation and evidence quality.",
        "3. **Risk Evaluation**: Assessment of control effectiveness in mitigating identified risks.",
        "4. **Conclusion**: Final determination of control adequacy and recommendations."
      ],
      sourceDocuments: ["Control Documentation", "Evidence Package", "Risk Assessment"],
      generatedInsight: "Control analysis completed with comprehensive evidence review. Further testing may be required to fully assess operational effectiveness [SOC2 Report 2025, pg 8, para 3].",
      confidence: 85
    };
  };

  // Initialize messages with enhanced AI analysis
  useEffect(() => {
    const aiAnalysis = getAIAnalysisContent(scriptId);
    
    const initialMessage: ChatMessage = {
      id: "ai-analysis-1",
      type: "ai",
      author: "Risk Pilot Agent",
      timestamp: "2 hours ago",
      version: "v1",
      content: {
        title: aiAnalysis.title,
        reasoningSteps: aiAnalysis.reasoningSteps,
        sourceDocuments: aiAnalysis.sourceDocuments,
        generatedInsight: aiAnalysis.generatedInsight,
        confidence: aiAnalysis.confidence
      },
      isLatest: true
    };

    setMessages([initialMessage]);
  }, [scriptId]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

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

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: "ai", 
        author: "Risk Pilot Agent",
        timestamp: "Now",
        content: {
          text: `Thank you for your input. I understand your concern about "${inputMessage}". Based on the available evidence [SOC2 Report 2025, pg 8, para 3], I can provide additional analysis to address this point. Would you like me to elaborate on any specific aspect of the control assessment?`
        }
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    
    setTimeout(() => {
      setIsApproved(true);
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

      // Navigate back after approval
      if (onApproveAndNavigate) {
        setTimeout(() => {
          onApproveAndNavigate();
        }, 1000);
      }
    }, 1500);
  };

  const handleRepopulate = () => {
    setIsRepopulating(true);
    
    setTimeout(() => {
      // Simulate updated analysis
      const updatedMessage: ChatMessage = {
        id: `ai-repopulated-${Date.now()}`,
        type: "ai",
        author: "Risk Pilot Agent", 
        timestamp: "Now",
        version: "v2",
        content: {
          title: "Risk Pilot Agent Analysis (Updated v2)",
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

      setMessages(prev => [...prev, updatedMessage]);
      setIsRepopulating(false);
      
      toast("Analysis updated with latest information", {
        className: "border-blue-500 bg-blue-100 text-blue-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#dbeafe",
          borderColor: "#3b82f6",
          color: "#1e40af",
        },
      });
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900">
              ← Back to Test Scripts
            </Button>
            <div>
              <h2 className="text-lg font-medium">Test Script Analysis</h2>
              <p className="text-sm text-gray-600">{scriptTitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isApproved && (
              <>
                <Button
                  variant="outline"
                  onClick={handleRepopulate}
                  disabled={isRepopulating}
                  className="flex items-center gap-2"
                >
                  {isRepopulating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isRepopulating ? "Updating..." : "Repopulate"}
                </Button>
                
                <Button
                  onClick={handleApprove}
                  disabled={isApproving}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isApproving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {isApproving ? "Approving..." : "Approve & Continue"}
                </Button>
              </>
            )}
            
            {isApproved && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Approved
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.type === "human" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === "ai"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {message.type === "ai" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Message Content */}
                <div className={`flex-1 max-w-4xl ${message.type === "human" ? "text-right" : ""}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{message.author}</span>
                    <span className="text-xs text-gray-500">{message.timestamp}</span>
                    {message.version && (
                      <Badge variant="outline" className="text-xs">
                        {message.version}
                      </Badge>
                    )}
                  </div>

                  <div
                    className={`rounded-lg p-4 ${
                      message.type === "ai"
                        ? "bg-white border shadow-sm"
                        : "bg-blue-50 border border-blue-200"
                    }`}
                  >
                    {/* AI Message with structured content */}
                    {message.type === "ai" && message.content.title && (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">{message.content.title}</h4>
                          {message.content.confidence && (
                            <Badge
                              variant="secondary"
                              className={`${
                                message.content.confidence >= 85
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : message.content.confidence >= 60
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : "bg-red-100 text-red-800 border-red-300"
                              }`}
                            >
                              {message.content.confidence}% Confidence
                            </Badge>
                          )}
                        </div>

                        {/* AI Reasoning Steps with Citations */}
                        {message.content.reasoningSteps && (
                          <div>
                            <h5 className="font-medium text-sm text-gray-700 mb-2">Analysis Steps:</h5>
                            <div className="space-y-3">
                              {message.content.reasoningSteps.map((step, index) => (
                                <div key={index} className="text-sm text-gray-600">
                                  <ClickableCitations text={step} />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Source Documents */}
                        {message.content.sourceDocuments && (
                          <div>
                            <h5 className="font-medium text-sm text-gray-700 mb-2">Source Documents:</h5>
                            <div className="flex flex-wrap gap-2">
                              {message.content.sourceDocuments.map((doc, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Generated Insight with Citations */}
                        {message.content.generatedInsight && (
                          <div>
                            <h5 className="font-medium text-sm text-gray-700 mb-2">Key Insights:</h5>
                            <div className="text-sm text-gray-600">
                              <ClickableCitations text={message.content.generatedInsight} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Simple text message with Citations */}
                    {message.content.text && (
                      <div className="text-sm">
                        <ClickableCitations text={message.content.text} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Input Section */}
      {!isApproved && (
        <div className="bg-white border-t p-4">
          <div className="flex gap-3">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about this analysis or provide additional context..."
              className="flex-1 min-h-[80px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isProcessing || !inputMessage.trim()}
              className="self-end"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      )}
    </div>
  );
}