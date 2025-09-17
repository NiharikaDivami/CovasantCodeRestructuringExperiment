import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { RefreshCw, User, Bot, Info, CheckCircle, AlertTriangle, Loader2, FileText, History, GitCompare, Download, Eye, Clock, Save, Check, Edit3, ArrowLeft, Calendar, Users } from "lucide-react";
import { toast } from "sonner@2.0.3";

import ActivityLog from "./ActivityLog";
import RepopulateConfirmationDialog from "./RepopulateConfirmationDialog";
import LoadingOverlay from "./LoadingOverlay";

interface TranscriptDetailViewProps {
  scriptId: string;
  onBack: () => void;
  onBackToDashboard?: () => void;
  onScriptUpdate?: (scriptId: string, updates: any) => void;
  scriptTitle?: string;
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

interface VersionHistoryEntry {
  id: string;
  version: string;
  timestamp: string;
  user: string;
  type: "ai-generation" | "human-edit" | "repopulation" | "approval";
  changes: string;
  aiContent?: string;
  humanContent?: string;
  confidence?: number;
}

export default function TranscriptDetailView({ 
  scriptId, 
  onBack, 
  onBackToDashboard, 
  onScriptUpdate, 
  scriptTitle
}: TranscriptDetailViewProps) {
  const [isRepopulating, setIsRepopulating] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [humanInsights, setHumanInsights] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [isEditingAI, setIsEditingAI] = useState(false);
  const [showRepopulateConfirmation, setShowRepopulateConfirmation] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showVersionComparison, setShowVersionComparison] = useState(false);
  const [compareVersion1, setCompareVersion1] = useState("");
  const [compareVersion2, setCompareVersion2] = useState("");

  // Sample script data
  const getScriptData = (id: string) => {
    const scripts: Record<string, any> = {
      "ts-1": {
        title: "TS-324472",
        confidence: 92,
        confidenceStatus: "finished",
        thirdPartyRequirement: "Supplier's management must define, enforce, and maintain an information security policy based on industry-recognized security standards and be published and communicated to all employees and relevant external parties.",
        testScript: "Information Protection Policy Review. AI to scan the \"Information Protection Policy\" to ensure it aligns with an industry-recognized framework."
      },
      "ts-2": {
        title: "TS-324473",
        confidence: 84,
        previousConfidence: 67,
        confidenceStatus: "repopulated",
        thirdPartyRequirement: "Supplier must provide evidence of an automated, 24/7 continuous monitoring system.",
        testScript: "AI to analyze the \"Security Incident Log\" and relevant sections of the \"AWS SOC2 Type II Report\" for evidence of automated monitoring."
      },
      "ts-3": {
        title: "TS-324474",
        confidence: 58,
        confidenceStatus: "in-progress",
        thirdPartyRequirement: "Supplier must demonstrate a tested and effective Incident Response Plan and provide evidence of a tabletop exercise.",
        testScript: "AI to review the \"Incident Response Policy\" and \"Tabletop Exercise Document\" for evidence of a recent tabletop exercise."
      },
      "ts-4": {
        title: "TS-324475",
        confidence: 0,
        confidenceStatus: "not-started",
        thirdPartyRequirement: "Vendor must have a formal security policy for the use of removable media.",
        testScript: "AI to locate a \"Removable Media Policy\" and analyze it for specific controls and procedures related to data handling."
      },
      "ts-5": {
        title: "TS-324476",
        confidence: 78,
        confidenceStatus: "finished",
        thirdPartyRequirement: "Vendor must have a formal vendor assessment process to manage third-party risk.",
        testScript: "AI to review the vendor's \"Vendor Risk Management Policy\" and associated documentation."
      },
      "ts-6": {
        title: "TS-324477",
        confidence: 89,
        confidenceStatus: "finished",
        thirdPartyRequirement: "Vendor must maintain a documented and tested Business Continuity Plan (BCP).",
        testScript: "AI to analyze the \"Business Continuity Plan\" and any related testing reports."
      }
    };
    return scripts[id] || scripts["ts-1"];
  };

  const scriptData = getScriptData(scriptId);

  // Initial AI analysis based on script
  const getInitialAIAnalysis = (scriptId: string) => {
    const analysisMap: Record<string, string> = {
      "ts-1": `Based on my analysis of the Information Protection Policy document, the policy framework adequately addresses key security controls with comprehensive coverage of access management and incident response procedures.

**Key Findings:**
• Policy document contains 47 control statements aligned with ISO 27001 framework
• Clear ownership assignments for information security roles and responsibilities  
• Comprehensive coverage of data classification, handling, and protection requirements
• Well-defined incident response and business continuity procedures
• Regular review cycle established with annual updates and quarterly assessments

**Areas Requiring Attention:**
• Employee training records show 23% completion rate for Q4 security awareness training
• Policy version control could be enhanced with automated distribution tracking
• Some technical control specifications lack implementation details

**Recommendation:**
The policy meets industry standards and regulatory requirements. Focus on improving training completion rates and enhancing technical control specifications for full compliance.`,

      "ts-2": `Analysis of the Security Incident Log and AWS SOC2 Type II Report reveals strong evidence of automated, continuous monitoring capabilities.

**Key Findings:**
• 24/7 Security Operations Center with automated alert generation confirmed
• Real-time monitoring covers network traffic, system access, and data flows
• AWS SOC2 report validates continuous monitoring controls as effectively designed and operating
• Automated incident detection with average response time of 12 minutes
• Integration between SIEM, cloud monitoring, and security tools demonstrated

**Areas Requiring Attention:**
• Log retention period varies across systems (30-90 days) - standardization needed
• Some false positive rates could be optimized through tuning
• Quarterly monitoring effectiveness reviews could be more comprehensive

**Recommendation:**
The automated monitoring system meets requirements with strong operational evidence. Consider standardizing log retention policies and implementing advanced analytics to reduce false positives.`,

      "ts-3": `Review of the Incident Response Policy and related documentation identifies significant gaps in testing and validation evidence.

**Key Findings:**
• Incident Response Policy document is comprehensive and well-structured
• Clear escalation procedures and stakeholder communication plans defined
• Integration with business continuity and disaster recovery processes established
• Documented roles and responsibilities for incident response team members

**Critical Gaps Identified:**
• No evidence of tabletop exercises conducted in the past 12 months
• Missing documentation for incident response team training completion
• Communication templates exist but lack approval workflow documentation
• No evidence of lessons learned integration from previous incidents

**Recommendation:**
While the policy framework is solid, immediate action is required to conduct tabletop exercises and validate response capabilities. Schedule quarterly tabletop exercises and implement comprehensive training refresh for all team members.`
    };
    
    return analysisMap[scriptId] || analysisMap["ts-3"];
  };

  // Supporting evidence data
  const getEvidenceList = (scriptId: string): Evidence[] => {
    const evidenceMap: Record<string, Evidence[]> = {
      "ts-1": [
        {
          id: "ev-1",
          name: "Information Protection Policy v3.2.pdf",
          type: "policy",
          status: "available",
          uploadDate: "2024-12-15",
          size: "2.4 MB",
          relevanceScore: 95
        },
        {
          id: "ev-2",
          name: "Security Awareness Training Records Q4.xlsx",
          type: "document",
          status: "available",
          uploadDate: "2024-12-20",
          size: "856 KB",
          relevanceScore: 78
        },
        {
          id: "ev-3",
          name: "Policy Review Committee Meeting Minutes.pdf",
          type: "document",
          status: "available",
          uploadDate: "2024-11-30",
          size: "1.2 MB",
          relevanceScore: 65
        }
      ],
      "ts-2": [
        {
          id: "ev-4",
          name: "Security Incident Log 2024.csv",
          type: "log",
          status: "available",
          uploadDate: "2025-01-01",
          size: "3.2 MB",
          relevanceScore: 92
        },
        {
          id: "ev-5",
          name: "AWS SOC2 Type II Report.pdf",
          type: "report",
          status: "available",
          uploadDate: "2024-10-15",
          size: "4.8 MB",
          relevanceScore: 88
        },
        {
          id: "ev-6",
          name: "SIEM Configuration Documentation.pdf",
          type: "document",
          status: "available",
          uploadDate: "2024-09-20",
          size: "1.8 MB",
          relevanceScore: 72
        }
      ],
      "ts-3": [
        {
          id: "ev-7",
          name: "Incident Response Policy v2.1.pdf",
          type: "policy",
          status: "available",
          uploadDate: "2024-08-15",
          size: "1.9 MB",
          relevanceScore: 95
        },
        {
          id: "ev-8",
          name: "Tabletop Exercise Documentation",
          type: "document",
          status: "missing",
          relevanceScore: 90
        },
        {
          id: "ev-9",
          name: "Communication Templates.docx",
          type: "document",
          status: "under-review",
          uploadDate: "2024-12-01",
          size: "245 KB",
          relevanceScore: 68
        }
      ]
    };
    
    return evidenceMap[scriptId] || evidenceMap["ts-3"];
  };

  // Version history data
  const getVersionHistory = (scriptId: string): VersionHistoryEntry[] => {
    return [
      {
        id: "v1",
        version: "v1.0",
        timestamp: "2025-01-01 16:45:00",
        user: "Risk Pilot AI",
        type: "ai-generation",
        changes: "Initial analysis generated based on available documentation",
        aiContent: "Initial analysis with basic findings...",
        confidence: 32
      },
      {
        id: "v2",
        version: "v2.0",
        timestamp: "2025-01-02 08:45:00",
        user: "Jacob Corman",
        type: "human-edit",
        changes: "Added context about quarterly review processes and implementation verification",
        humanContent: "Found additional evidence in shared drive that confirms quarterly reviews are conducted..."
      },
      {
        id: "v3",
        version: "v3.0",
        timestamp: "2025-01-02 09:15:00",
        user: "Risk Pilot AI",
        type: "repopulation",
        changes: "Repopulated analysis incorporating human insights and additional evidence",
        aiContent: getInitialAIAnalysis(scriptId),
        confidence: scriptData.confidence
      }
    ];
  };

  // Initialize AI analysis
  useState(() => {
    setAiAnalysis(getInitialAIAnalysis(scriptId));
  });

  const getConfidenceColor = (conf: number) => {
    if (conf >= 85) return "text-green-600";
    if (conf >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "policy": return <FileText className="h-4 w-4 text-blue-600" />;
      case "document": return <FileText className="h-4 w-4 text-green-600" />;
      case "log": return <FileText className="h-4 w-4 text-orange-600" />;
      case "certificate": return <FileText className="h-4 w-4 text-purple-600" />;
      case "report": return <FileText className="h-4 w-4 text-indigo-600" />;
      default: return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEvidenceStatusColor = (status: string) => {
    switch (status) {
      case "available": return "text-green-600";
      case "missing": return "text-red-600";
      case "under-review": return "text-amber-600";
      default: return "text-gray-600";
    }
  };

  const handleSaveAIAnalysis = () => {
    setIsEditingAI(false);
    toast("AI Analysis updated successfully");
  };

  const handleRepopulate = () => {
    if (humanInsights.trim()) {
      setShowRepopulateConfirmation(true);
    } else {
      performRepopulation();
    }
  };

  const performRepopulation = async () => {
    setIsRepopulating(true);
    
    setTimeout(() => {
      setIsRepopulating(false);
      
      const newConfidence = Math.min(95, scriptData.confidence + (humanInsights.trim() ? 20 : 15));
      
      // Update AI analysis with human insights incorporated
      const enhancedAnalysis = getInitialAIAnalysis(scriptId) + 
        (humanInsights.trim() ? `\n\n**Human Expert Validation:**\n"${humanInsights}"\n- *Provided by Jacob Corman on ${new Date().toLocaleDateString()}*` : "");
      
      setAiAnalysis(enhancedAnalysis);
      
      const toastMessage = humanInsights.trim() 
        ? `Repopulated with Human Insights: Confidence ↑ ${scriptData.confidence}% → ${newConfidence}%`
        : `Repopulated: Confidence ↑ ${scriptData.confidence}% → ${newConfidence}%`;
      
      toast(toastMessage);
      
      if (onScriptUpdate) {
        onScriptUpdate(scriptId, {
          confidence: newConfidence,
          confidenceStatus: "repopulated",
          humanInsightsSummary: humanInsights.trim() || undefined,
          previousConfidence: scriptData.confidence
        });
      }
      
      setShowRepopulateConfirmation(false);
      setHumanInsights("");
    }, 2000);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    
    setTimeout(() => {
      setIsApproving(false);
      
      // Copy AI analysis to human insights field (approval process)
      setHumanInsights(`APPROVED: ${aiAnalysis}`);
      
      toast("Test Script Approved - Analysis finalized and locked");
      
      if (onScriptUpdate) {
        onScriptUpdate(scriptId, {
          confidenceStatus: "approved",
          humanInsightsSummary: `APPROVED: ${aiAnalysis}`,
          approvedBy: "Jacob Corman",
          approvalDate: new Date().toISOString()
        });
      }
    }, 1500);
  };

  const handleEvidenceClick = (evidence: Evidence) => {
    if (evidence.status === "available") {
      toast(`Opening: ${evidence.name}`);
    } else if (evidence.status === "missing") {
      toast(`Document not found: ${evidence.name}`);
    } else {
      toast(`Document under review: ${evidence.name}`);
    }
  };

  const evidenceList = getEvidenceList(scriptId);
  const versionHistory = getVersionHistory(scriptId);

  return (
    <div className="h-full flex">
      {/* Main Content - Left Side */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="pl-10 pr-6 py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onBack}
                    className="p-2 -ml-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h1 className="text-2xl font-bold text-gray-900">{scriptTitle || scriptData.title}</h1>
                </div>
                <p className="text-sm text-gray-600 max-w-4xl">
                  {scriptData.thirdPartyRequirement}
                </p>
              </div>
              
              {/* Confidence Display */}
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Confidence Score</div>
                <div className="flex items-center space-x-2">
                  <span className={`text-2xl font-bold ${getConfidenceColor(scriptData.confidence)}`}>
                    {scriptData.confidence}%
                  </span>
                  {scriptData.confidenceStatus === "repopulated" && scriptData.previousConfidence && (
                    <span className="text-sm text-gray-500">
                      ↑ from {scriptData.previousConfidence}%
                    </span>
                  )}
                </div>
                {scriptData.confidenceStatus === "repopulated" && (
                  <Badge variant="outline" className="text-xs mt-1">
                    Repopulated
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            
            {/* Test Script Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span>Test Script Description</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{scriptData.testScript}</p>
              </CardContent>
            </Card>

            {/* AI Analysis Section */}
            <Card>
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">AI Analysis</div>
                      <div className="text-sm text-blue-600 font-normal">Generated by Risk Pilot AI • Editable</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isEditingAI ? (
                      <Button onClick={handleSaveAIAnalysis} size="sm" className="flex items-center space-x-2">
                        <Save className="h-4 w-4" />
                        <span>Save</span>
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditingAI(true)}
                        className="flex items-center space-x-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </Button>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditingAI ? (
                  <Textarea
                    value={aiAnalysis}
                    onChange={(e) => setAiAnalysis(e.target.value)}
                    className="min-h-64 font-mono text-sm resize-none"
                    placeholder="AI analysis content..."
                  />
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans">
                      {aiAnalysis}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Human Insights Section */}
            <Card>
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">Add Final Conclusions</div>
                    <div className="text-sm text-gray-600 font-normal">Professional judgment and additional context</div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Professional Analysis
                    </label>
                    <Textarea
                      value={humanInsights}
                      onChange={(e) => setHumanInsights(e.target.value)}
                      placeholder="Add your professional insights, observations, corrections, or additional context to enhance the AI analysis. This input will be used to repopulate and improve the AI's assessment..."
                      className="min-h-32 resize-none"
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      Saving insights here will trigger the AI to repopulate its analysis with your input incorporated.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supporting Evidence Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span>Supporting Evidence</span>
                  <Badge variant="outline" className="ml-2">{evidenceList.length} documents</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {evidenceList.map((evidence) => (
                    <div key={evidence.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        {getEvidenceIcon(evidence.type)}
                        <div>
                          <div className="font-medium text-gray-900">{evidence.name}</div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="capitalize">{evidence.type}</span>
                            {evidence.size && <span>{evidence.size}</span>}
                            {evidence.uploadDate && <span>Uploaded {evidence.uploadDate}</span>}
                            <span className={getEvidenceStatusColor(evidence.status)}>
                              {evidence.status === "available" ? "Available" : 
                               evidence.status === "missing" ? "Missing" : "Under Review"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {evidence.relevanceScore}% relevance
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEvidenceClick(evidence)}
                          disabled={evidence.status !== "available"}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between p-6 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleRepopulate}
                  disabled={isRepopulating}
                  className="flex items-center space-x-2"
                >
                  {isRepopulating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Repopulating...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      <span>
                        {humanInsights.trim() ? "Repopulate with Insights" : "Repopulate Analysis"}
                      </span>
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowVersionHistory(true)}
                  className="flex items-center space-x-2"
                >
                  <History className="h-4 w-4" />
                  <span>Version History</span>
                </Button>
              </div>

              <Button
                onClick={handleApprove}
                disabled={isApproving}
                className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
              >
                {isApproving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Approve Test Script</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Panel */}
      <div className="w-80 border-l border-gray-200 bg-white">
        <ActivityLog activities={[
          {
            id: "act-1",
            type: "ai-populated" as const,
            message: `Risk Pilot completed analysis for ${scriptTitle || scriptData.title}`,
            timestamp: "2 hours ago",
            confidence: scriptData.confidence
          },
          {
            id: "act-2",
            type: "human-insight" as const,
            message: "Analyst reviewing test script details",
            timestamp: "1 hour ago"
          }
        ]} />
      </div>

      {/* Loading Overlay */}
      {isRepopulating && <LoadingOverlay />}

      {/* Version History Sheet */}
      <Sheet open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <SheetContent className="w-[600px] sm:w-[800px]">
          <SheetHeader>
            <SheetTitle>Version History</SheetTitle>
            <SheetDescription>
              Track all changes and updates to this test script analysis
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">{versionHistory.length} versions</div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowVersionComparison(true)}
                className="flex items-center space-x-2"
              >
                <GitCompare className="h-4 w-4" />
                <span>Compare Versions</span>
              </Button>
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {versionHistory.map((version, index) => (
                  <div key={version.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={index === 0 ? "default" : "outline"}>
                            {version.version}
                          </Badge>
                          {index === 0 && <Badge variant="outline" className="text-green-600">Current</Badge>}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(version.timestamp).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{version.user}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {version.type.replace("-", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{version.changes}</p>
                    {version.confidence && (
                      <div className="text-xs text-gray-500">
                        Confidence: {version.confidence}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Repopulate Confirmation Dialog */}
      <RepopulateConfirmationDialog
        isOpen={showRepopulateConfirmation}
        onClose={() => setShowRepopulateConfirmation(false)}
        onConfirm={performRepopulation}
        currentConfidence={scriptData.confidence}
        hasHumanInsights={humanInsights.trim() !== ""}
      />
    </div>
  );
}