import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { ChevronDown, ChevronRight, RefreshCw, History, FileText, Download, Eye, GitCompare, RotateCcw, User, Clock, Activity, Bot, Info, Archive, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

import ActivityLog from "./ActivityLog";

interface TranscriptDetailViewProps {
  scriptId: string;
  onBack: () => void;
  onBackToDashboard?: () => void;
  onScriptUpdate?: (scriptId: string, updates: any) => void;
  scriptTitle?: string;
}

interface AIStep {
  id: string;
  step: string;
  description: string;
  confidence: number;
}

interface AIVersion {
  id: string;
  version: string;
  timestamp: string;
  confidence: number;
  changes: string;
  humanInsights?: string;
  label: string;
  aiSteps: AIStep[];
  aiOutput: string;
  evidencesUsed: string[];
  humanInput?: {
    user: string;
    timestamp: string;
    content: string;
  };
}

interface Evidence {
  id: string;
  name: string;
  type: "document" | "policy" | "log" | "certificate";
  status: "available" | "missing" | "under-review";
  uploadDate?: string;
  size?: string;
  relevanceScore: number;
}

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  type: "analysis" | "review" | "evidence" | "system";
}

export default function TranscriptDetailView({ 
  scriptId, 
  onBack, 
  onBackToDashboard, 
  onScriptUpdate, 
  scriptTitle
}: TranscriptDetailViewProps) {
  const [isRepopulating, setIsRepopulating] = useState(false);
  const [humanInsights, setHumanInsights] = useState("");
  
  // Modal states
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showVersionSwitchDialog, setShowVersionSwitchDialog] = useState(false);
  
  // Version comparison state
  const [selectedVersion, setSelectedVersion] = useState("v3");
  const [compareVersion1, setCompareVersion1] = useState("v3");
  const [compareVersion2, setCompareVersion2] = useState("v2");
  const [versionToSwitchTo, setVersionToSwitchTo] = useState<string | null>(null);
  
  // Sample script data - now using IDs instead of names
  const getScriptData = (id: string) => {
    const scripts: Record<string, any> = {
      "ts-1": {
        title: "TS-324472",
        status: "Completed",
        confidence: 92,
        confidenceStatus: "finished"
      },
      "ts-2": {
        title: "TS-324473",
        status: "Active",
        confidence: 84,
        previousConfidence: 67,
        confidenceStatus: "repopulated"
      },
      "ts-3": {
        title: "TS-324474",
        status: "Active",
        confidence: 58,
        confidenceStatus: "in-progress"
      }
    };
    return scripts[id] || scripts["ts-1"];
  };

  const scriptData = getScriptData(scriptId);

  // Sample AI reasoning steps
  const aiSteps: AIStep[] = [
    {
      id: "step-1",
      step: "Document Analysis",
      description: "Analyzed incident response policy document and identified key components including escalation procedures, communication plans, and recovery protocols.",
      confidence: 75
    },
    {
      id: "step-2", 
      step: "Control Framework Mapping",
      description: "Mapped identified controls to NIST framework requirements and assessed alignment with industry best practices for incident response.",
      confidence: 68
    },
    {
      id: "step-3",
      step: "Evidence Validation",
      description: "Cross-referenced policy documentation with training records and recent incident logs to validate implementation effectiveness.",
      confidence: 45
    },
    {
      id: "step-4",
      step: "Gap Analysis",
      description: "Identified gaps in testing documentation and stakeholder communication procedures that impact overall control effectiveness.",
      confidence: 52
    },
    {
      id: "step-5",
      step: "Risk Assessment",
      description: "Evaluated potential impact of identified gaps on business continuity and regulatory compliance requirements.",
      confidence: 58
    }
  ];

  // AI Insights Summary - matches CER table data
  const getAIInsightsSummary = (scriptId: string) => {
    const summaryMap: Record<string, string> = {
      "ts-1": "Policy framework adequately addresses key security controls with comprehensive coverage of access management and incident response procedures.",
      "ts-2": "Control environment demonstrates strong design effectiveness with automated monitoring systems in place for key controls.", 
      "ts-3": "Incident response plan exists but lacks testing documentation and stakeholder communication procedures need enhancement.",
      "ts-4": "Assessment pending - awaiting policy documentation and implementation evidence.",
      "ts-5": "Vendor assessment process follows industry standards with regular reviews and documented risk ratings for all critical vendors.",
      "ts-6": "Comprehensive BCP with regular testing, clear recovery objectives, and stakeholder communication plans well-defined."
    };
    
    return summaryMap[scriptId] || summaryMap["ts-3"];
  };

  const getAIOutput = (scriptId: string) => {
    const summary = getAIInsightsSummary(scriptId);
    
    // Get script-specific detailed analysis
    const detailedAnalysisMap: Record<string, any> = {
      "ts-1": {
        strengths: [
          "Comprehensive access management framework with role-based permissions",
          "Well-documented incident response procedures with clear escalation paths",
          "Regular policy reviews and updates aligned with industry standards"
        ],
        improvements: [
          "Enhanced monitoring of privileged access activities",
          "Automated policy compliance checking",
          "Integration with security awareness training programs"
        ],
        recommendations: [
          "Implement automated access reviews on a quarterly basis",
          "Enhance incident response testing with realistic scenarios",
          "Develop policy exception tracking and approval workflows"
        ]
      },
      "ts-2": {
        strengths: [
          "Automated monitoring systems with real-time alerting",
          "Well-designed control framework with clear ownership",
          "Regular effectiveness testing and validation procedures"
        ],
        improvements: [
          "Enhanced reporting capabilities for management oversight",
          "Integration between monitoring tools for comprehensive coverage",
          "Streamlined remediation workflows for identified issues"
        ],
        recommendations: [
          "Implement dashboard for real-time control effectiveness visualization",
          "Develop automated remediation for common control failures",
          "Enhance documentation of control testing procedures"
        ]
      },
      "ts-3": {
        strengths: [
          "Well-structured incident response policy document with clear escalation procedures",
          "Defined roles and responsibilities across IT and business stakeholders",
          "Integration with business continuity planning processes"
        ],
        improvements: [
          "Testing documentation is incomplete - no evidence of tabletop exercises in the past 12 months",
          "Communication procedures lack specific timelines and approval workflows",
          "Training records show gaps in stakeholder awareness of updated procedures"
        ],
        recommendations: [
          "Conduct quarterly tabletop exercises and document results",
          "Implement formal communication templates with defined approval chains",
          "Schedule comprehensive training refresh for all incident response team members"
        ]
      }
    };

    const analysis = detailedAnalysisMap[scriptId] || detailedAnalysisMap["ts-3"];
    
    return `Based on comprehensive analysis of the control framework, the following assessment has been completed:

**AI Analysis Summary:**
${summary}

**Detailed Findings:**

**Strengths Identified:**
${analysis.strengths.map((item: string) => `- ${item}`).join('\n')}

**Areas for Improvement:**
${analysis.improvements.map((item: string) => `- ${item}`).join('\n')}

**Recommendations:**
${analysis.recommendations.map((item: string, index: number) => `${index + 1}. ${item}`).join('\n')}

**Overall Assessment:** ${scriptId === "ts-1" ? "The access management and incident response framework demonstrates strong effectiveness with comprehensive coverage of key security controls." : scriptId === "ts-2" ? "The control environment shows strong design effectiveness with automated systems providing good coverage of critical business processes." : "The incident response preparedness framework demonstrates moderate effectiveness but requires enhancement in testing and training components to achieve optimal control maturity."}`;
  };

  // Sample evidences
  const evidences: Evidence[] = [
    {
      id: "ev-1",
      name: "Incident Response Policy v2.1.pdf",
      type: "policy",
      status: "available",
      uploadDate: "2024-12-15",
      size: "2.4 MB",
      relevanceScore: 95
    },
    {
      id: "ev-2",
      name: "Q4 Training Records.xlsx",
      type: "document",
      status: "available",
      uploadDate: "2024-12-20",
      size: "856 KB",
      relevanceScore: 78
    },
    {
      id: "ev-3",
      name: "Security Incident Log 2024.csv",
      type: "log",
      status: "available",
      uploadDate: "2025-01-01",
      size: "1.2 MB",
      relevanceScore: 82
    },
    {
      id: "ev-4",
      name: "Tabletop Exercise Documentation",
      type: "document",
      status: "missing",
      relevanceScore: 90
    },
    {
      id: "ev-5",
      name: "Communication Templates.docx",
      type: "document",
      status: "under-review",
      uploadDate: "2025-01-02",
      size: "245 KB",
      relevanceScore: 65
    }
  ];

  // Sample AI version history
  const aiVersionHistory: AIVersion[] = [
    {
      id: "v3",
      version: "v3.0",
      timestamp: "2025-01-02 14:30:00",
      confidence: 58,
      label: "With Human Input",
      changes: "Current version - Updated based on human insights about quarterly review processes",
      humanInsights: "Verified implementation matches documented procedures. Minor gap in quarterly review frequency.",
      aiSteps: aiSteps,
      aiOutput: getAIOutput(scriptId),
      evidencesUsed: ["Incident Response Policy v2.1.pdf", "Q4 Training Records.xlsx", "Security Incident Log 2024.csv"],
      humanInput: {
        user: "Arjun Nair",
        timestamp: "2025-01-02 14:15:00",
        content: "Added context about quarterly review frequency and verified implementation procedures match documentation."
      }
    },
    {
      id: "v2", 
      version: "v2.1",
      timestamp: "2025-01-02 09:15:00",
      confidence: 45,
      label: "Repopulated",
      changes: "Repopulated after additional evidence review",
      aiSteps: [],
      aiOutput: "Previous analysis with limited evidence base",
      evidencesUsed: ["Incident Response Policy v2.1.pdf"],
      humanInput: {
        user: "Arjun Nair",
        timestamp: "2025-01-02 08:45:00",
        content: "Found missing training logs in shared drive."
      }
    },
    {
      id: "v1",
      version: "v1.0", 
      timestamp: "2025-01-01 16:45:00",
      confidence: 32,
      label: "Initial Draft",
      changes: "Initial analysis based on provided documentation set",
      aiSteps: [],
      aiOutput: "Initial analysis with minimal documentation",
      evidencesUsed: ["Incident Response Policy v2.1.pdf"]
    }
  ];

  // Sample activity log
  const activityLog: ActivityLogEntry[] = [
    {
      id: "log-1",
      timestamp: "2025-01-02 14:30:00",
      user: "Arjun Nair",
      action: "Added Human Insights",
      details: "Added context about quarterly review frequency and implementation verification",
      type: "review"
    },
    {
      id: "log-2",
      timestamp: "2025-01-02 09:15:00",
      user: "Risk Pilot AI",
      action: "Repopulated Analysis",
      details: "Confidence increased from 45% to 58% after incorporating additional evidence",
      type: "analysis"
    },
    {
      id: "log-3",
      timestamp: "2025-01-02 08:45:00",
      user: "Arjun Nair",
      action: "Evidence Located",
      details: "Found Q4 Training Records.xlsx in shared drive under different naming convention",
      type: "evidence"
    },
    {
      id: "log-4",
      timestamp: "2025-01-01 16:45:00",
      user: "Risk Pilot AI",
      action: "Initial Analysis Complete",
      details: "Generated initial assessment with 32% confidence based on available documentation",
      type: "analysis"
    }
  ];

  const getConfidenceColor = (conf: number) => {
    if (conf >= 85) return "text-green-600";
    if (conf >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const handleRepopulate = async () => {
    setIsRepopulating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsRepopulating(false);
      toast("Repopulated: Confidence ↑ 58% → 73%");
      
      // Update parent component
      if (onScriptUpdate) {
        onScriptUpdate(scriptId, {
          confidence: 73,
          status: "repopulated",
          humanInsights: humanInsights
        });
      }
    }, 2000);
  };

  const getEvidenceIcon = (type: string) => {
    switch (type) {
      case "policy": return <FileText className="h-4 w-4 text-blue-600" />;
      case "document": return <FileText className="h-4 w-4 text-green-600" />;
      case "log": return <FileText className="h-4 w-4 text-orange-600" />;
      case "certificate": return <FileText className="h-4 w-4 text-purple-600" />;
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

  const getCurrentVersionData = () => {
    return aiVersionHistory.find(v => v.id === selectedVersion) || aiVersionHistory[0];
  };

  const handleVersionSwitch = (versionId: string) => {
    if (versionId === selectedVersion) {
      toast("Already viewing this version");
      return;
    }
    setVersionToSwitchTo(versionId);
    setShowVersionSwitchDialog(true);
  };

  const confirmVersionSwitch = () => {
    if (versionToSwitchTo) {
      const targetVersion = aiVersionHistory.find(v => v.id === versionToSwitchTo);
      setSelectedVersion(versionToSwitchTo);
      setShowVersionSwitchDialog(false);
      setShowVersionsModal(false);
      setVersionToSwitchTo(null);
      toast(`Switched to ${targetVersion?.version} - ${targetVersion?.label}`);
    }
  };

  const cancelVersionSwitch = () => {
    setShowVersionSwitchDialog(false);
    setVersionToSwitchTo(null);
  };

  return (
    <div className="h-full flex">
      {/* Main Content - Left Side */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Hero Section with Prominent Confidence */}
        <div>
          <div className="pl-10 pr-6 py-8">
            {/* Main Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{scriptTitle || scriptData.title}</h1>
                  <Badge variant={scriptData.status === "Active" ? "default" : "secondary"}>
                    {scriptData.status}
                  </Badge>
                </div>
                
                {/* CTA Buttons */}
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEvidenceModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <Archive className="h-4 w-4" />
                    <span>Supporting Evidence</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowVersionsModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <Layers className="h-4 w-4" />
                    <span>Versions</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowCompareModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <GitCompare className="h-4 w-4" />
                    <span>Compare Versions</span>
                  </Button>
                </div>
              </div>
              
              {/* Prominent Confidence Display */}
              <div className="text-right">
                <div className="mb-1 flex items-center justify-end space-x-2">
                  <span className="text-sm text-gray-600">Current Confidence</span>
                  <span className={`text-4xl font-bold ${getConfidenceColor(getCurrentVersionData().confidence)}`}>
                    {getCurrentVersionData().confidence}%
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="left" className="max-w-xs">
                        <div className="text-xs">
                          <p className="font-medium mb-1">Test Script Confidence Score:</p>
                          <p>• Based on evidence completeness and quality</p>
                          <p>• AI assessment of control effectiveness</p>
                          <p>• Validated against regulatory requirements</p>
                          <p>• Updated when new evidence is added</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {scriptData.confidenceStatus === "repopulated" && scriptData.previousConfidence && (
                  <div className="text-sm text-gray-500 mb-3">
                    ↑ from {scriptData.previousConfidence}%
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* Main Analysis Area - Scrollable */}
        <div className="flex-1 overflow-auto pl-10 pr-6 py-6 min-h-0 bg-white border-t border-gray-200">
          <div className="space-y-6">
            {/* AI Reasoning Flow - Simplified */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CardTitle>AI Reasoning Flow</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center space-x-1 cursor-help">
                          <Badge className={`${
                            getCurrentVersionData().confidence >= 60 ? 'bg-green-100 text-green-800' :
                            getCurrentVersionData().confidence >= 40 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            Overall Confidence: {getCurrentVersionData().confidence}%
                          </Badge>
                          <Info className="h-3 w-3 text-gray-400" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <div className="text-xs">
                          <p className="font-medium mb-1">AI Reasoning Confidence:</p>
                          <p>• Aggregated confidence across all analysis steps</p>
                          <p>• Reflects quality of available evidence</p>
                          <p>• Considers completeness of documentation</p>
                          <p>• Updates with human insights and new evidence</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                {/* Simple flow line */}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Document Analysis</span>
                  </div>
                  <div className="w-8 h-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Framework Mapping</span>
                  </div>
                  <div className="w-8 h-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Evidence Validation</span>
                  </div>
                  <div className="w-8 h-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Gap Analysis</span>
                  </div>
                  <div className="w-8 h-px bg-gray-300"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Risk Assessment</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights Summary - matches CER table */}
            <Card>
              <CardHeader>
                <CardTitle>AI Insights Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-5">
                  {getAIInsightsSummary(scriptId)}
                </p>
              </CardContent>
            </Card>

            {/* AI Analysis Output - Detailed */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed AI Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-sm">
                  <pre className="whitespace-pre-wrap font-sans">{getAIOutput(scriptId)}</pre>
                </div>
              </CardContent>
            </Card>

            {/* Human Insights */}
            <Card>
              <CardHeader>
                <CardTitle>Add Human Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Add your insights, observations, or additional context to improve the AI analysis..."
                  value={humanInsights}
                  onChange={(e) => setHumanInsights(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleRepopulate} disabled={!humanInsights.trim()}>
                  Submit Insights & Repopulate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Activity Log Panel - Right Side */}
      <ActivityLog activities={activityLog.map(activity => ({
        id: activity.id,
        type: activity.type === "analysis" ? "ai-populated" as const : 
              activity.type === "review" ? "human-insight" as const : 
              activity.type === "evidence" ? "human-insight" as const : 
              "ai-populated" as const,
        message: `${activity.action}: ${activity.details}`,
        timestamp: activity.timestamp,
        confidence: activity.type === "analysis" ? getCurrentVersionData().confidence : undefined
      }))} />

      {/* Supporting Evidence Modal */}
      <Dialog open={showEvidenceModal} onOpenChange={setShowEvidenceModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Supporting Evidence</DialogTitle>
            <DialogDescription>
              View and manage all evidence files related to this test script analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {evidences.map((evidence) => (
              <div key={evidence.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    {getEvidenceIcon(evidence.type)}
                    <span className="text-sm font-medium truncate">{evidence.name}</span>
                  </div>
                  <div className="flex space-x-1 flex-shrink-0">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className={getEvidenceStatusColor(evidence.status)}>
                    {evidence.status}
                  </span>
                  <span className="text-gray-500">
                    Relevance: {evidence.relevanceScore}%
                  </span>
                </div>
                {evidence.size && evidence.uploadDate && (
                  <div className="text-xs text-gray-500">
                    {evidence.size} • Uploaded {new Date(evidence.uploadDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Versions Modal */}
      <Dialog open={showVersionsModal} onOpenChange={setShowVersionsModal}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Analysis Version History</DialogTitle>
            <DialogDescription>
              View the evolution of AI analysis for this test script. Click any version to view its details or compare with other versions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {aiVersionHistory.map((version) => (
              <div
                key={version.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedVersion === version.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleVersionSwitch(version.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{version.version}</span>
                      <Badge variant="outline">{version.label}</Badge>
                      {selectedVersion === version.id && (
                        <Badge variant="default">Current</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {new Date(version.timestamp).toLocaleDateString()} {new Date(version.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                    <Badge className={`${
                      version.confidence >= 85 ? 'bg-green-100 text-green-800' :
                      version.confidence >= 60 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {version.confidence}%
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{version.changes}</p>
                {version.humanInput && (
                  <div className="border-l-4 border-blue-200 pl-3 bg-blue-50 p-2 rounded">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-3 w-3 text-blue-600" />
                      <span className="text-xs font-medium text-blue-800">{version.humanInput.user}</span>
                      <span className="text-xs text-blue-600">
                        {new Date(version.humanInput.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs text-blue-700">{version.humanInput.content}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Compare Versions Right Panel */}
      <Sheet open={showCompareModal} onOpenChange={setShowCompareModal}>
        <SheetContent 
          side="right" 
          className="p-0 flex flex-col"
          style={{ width: '60vw', maxWidth: '60vw' }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="border-b p-6 bg-white shrink-0">
              <SheetHeader>
                <SheetTitle className="text-xl">Compare Analysis Versions</SheetTitle>
                <SheetDescription className="text-sm mt-1">
                  Compare two AI analysis versions side-by-side to see changes in confidence, evidence, and human input.
                </SheetDescription>
              </SheetHeader>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Version Selection Controls */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Version 1</label>
                  <Select value={compareVersion1} onValueChange={setCompareVersion1}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiVersionHistory.map((version) => (
                        <SelectItem key={version.id} value={version.id}>
                          {version.version} - {version.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Version 2</label>
                  <Select value={compareVersion2} onValueChange={setCompareVersion2}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {aiVersionHistory.map((version) => (
                        <SelectItem key={version.id} value={version.id}>
                          {version.version} - {version.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Detailed Comparison View */}
              <div className="grid grid-cols-2 gap-4">
                {[compareVersion1, compareVersion2].map((versionId, index) => {
                  const version = aiVersionHistory.find(v => v.id === versionId);
                  if (!version) return null;

                  return (
                    <div key={`${versionId}-${index}`} className="border rounded-lg shadow-sm">
                      {/* Version Header */}
                      <div className="border-b p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-sm">{version.version} - {version.label}</h3>
                          <Badge className={`text-xs px-2 py-1 ${
                            version.confidence >= 85 ? 'bg-green-100 text-green-800' :
                            version.confidence >= 60 ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {version.confidence}%
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(version.timestamp).toLocaleDateString()} {new Date(version.timestamp).toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{version.changes}</div>
                      </div>

                      {/* Version Content */}
                      <div className="p-3 space-y-3">
                        {/* Evidence Used */}
                        <div>
                          <h4 className="font-medium text-xs text-gray-800 mb-1">Evidence Used</h4>
                          <div className="space-y-1">
                            {version.evidencesUsed.map((evidence, evidenceIndex) => (
                              <div key={evidenceIndex} className="text-xs text-gray-600 flex items-center space-x-1">
                                <FileText className="h-3 w-3" />
                                <span className="truncate">{evidence}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* AI Output Preview */}
                        <div>
                          <h4 className="font-medium text-xs text-gray-800 mb-1">Analysis Output</h4>
                          <div className="text-xs text-gray-600 line-clamp-3">
                            {version.aiOutput.substring(0, 150)}...
                          </div>
                        </div>

                        {/* Human Input */}
                        {version.humanInput && (
                          <div>
                            <h4 className="font-medium text-xs text-gray-800 mb-1">Human Input</h4>
                            <div className="border-l-2 border-blue-200 pl-2 bg-blue-50 p-2 rounded text-xs">
                              <div className="flex items-center space-x-1 mb-1">
                                <User className="h-3 w-3 text-blue-600" />
                                <span className="font-medium text-blue-800">{version.humanInput.user}</span>
                              </div>
                              <p className="text-blue-700">{version.humanInput.content}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Version Switch Confirmation Dialog */}
      <AlertDialog open={showVersionSwitchDialog} onOpenChange={setShowVersionSwitchDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Switch Analysis Version</AlertDialogTitle>
            <AlertDialogDescription>
              {versionToSwitchTo && (
                <>
                  Are you sure you want to switch to {aiVersionHistory.find(v => v.id === versionToSwitchTo)?.version} - {aiVersionHistory.find(v => v.id === versionToSwitchTo)?.label}?
                  This will change the displayed analysis and confidence score.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelVersionSwitch}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmVersionSwitch}>Switch Version</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}