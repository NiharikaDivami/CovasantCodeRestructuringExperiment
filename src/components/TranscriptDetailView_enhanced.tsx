import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { ChevronDown, ChevronRight, RefreshCw, History, FileText, Download, Eye, GitCompare, RotateCcw, User, Clock, Activity, Bot, Info, Archive, Layers, Search, CheckCircle, AlertTriangle, ExternalLink, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner@2.0.3";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

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

export default function TranscriptDetailView({ 
  scriptId, 
  onBack, 
  onBackToDashboard, 
  onScriptUpdate, 
  scriptTitle
}: TranscriptDetailViewProps) {
  const [isRepopulating, setIsRepopulating] = useState(false);
  const [humanInsights, setHumanInsights] = useState("");
  const [showRepopulateConfirmation, setShowRepopulateConfirmation] = useState(false);

  // Sample script data
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

  const getAIAnalysisDetails = (scriptId: string) => {
    const detailMap: Record<string, any> = {
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

    return detailMap[scriptId] || detailMap["ts-3"];
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 85) return "text-green-600";
    if (conf >= 60) return "text-amber-600";
    return "text-red-600";
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

  const aiAnalysisDetails = getAIAnalysisDetails(scriptId);

  return (
    <div className="h-full flex">
      {/* Main Content - Left Side */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Hero Section */}
        <div>
          <div className="pl-10 pr-6 py-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{scriptTitle || scriptData.title}</h1>
                  <Badge variant={scriptData.status === "Active" ? "default" : "secondary"}>
                    {scriptData.status}
                  </Badge>
                </div>
              </div>
              
              {/* Confidence Display */}
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Test Script Confidence</div>
                <div className="flex items-center space-x-2">
                  <span className={`text-3xl font-bold ${getConfidenceColor(scriptData.confidence)}`}>
                    {scriptData.confidence}%
                  </span>
                  {scriptData.confidenceStatus === "repopulated" && scriptData.previousConfidence && (
                    <span className="text-sm text-gray-500">
                      ↑ from {scriptData.previousConfidence}%
                    </span>
                  )}
                </div>
                {scriptData.confidenceStatus === "repopulated" && (
                  <div className="mt-1">
                    <Badge variant="outline" className="text-xs">
                      Repopulated
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="max-w-6xl mx-auto px-10 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* AI Analysis Section */}
              <Card className="h-fit">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">AI Analysis</div>
                      <div className="text-sm text-blue-600 font-normal">Generated by Risk Pilot AI</div>
                    </div>
                    {scriptData.confidenceStatus === "repopulated" && (
                      <div className="ml-auto">
                        <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center space-x-1">
                          <RefreshCw className="h-3 w-3" />
                          <span>Updated</span>
                        </div>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* AI Summary */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {getAIInsightsSummary(scriptId)}
                      </p>
                    </div>

                    {/* Strengths */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Strengths Identified</span>
                      </h4>
                      <ul className="space-y-2">
                        {aiAnalysisDetails.strengths.map((strength: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Areas for Improvement */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>Areas for Improvement</span>
                      </h4>
                      <ul className="space-y-2">
                        {aiAnalysisDetails.improvements.map((improvement: string, index: number) => (
                          <li key={index} className="flex items-start space-x-2 text-sm">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span>Recommendations</span>
                      </h4>
                      <ol className="space-y-2">
                        {aiAnalysisDetails.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start space-x-3 text-sm">
                            <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-700">{rec}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Human Insights Section */}
              <Card className="h-fit">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-gray-900">Add Human Insights</div>
                      <div className="text-sm text-gray-600 font-normal">Professional judgment and context</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Input Area */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Professional Analysis
                      </label>
                      <Textarea
                        value={humanInsights}
                        onChange={(e) => setHumanInsights(e.target.value)}
                        placeholder="Add your professional insights, observations, or corrections to enhance the AI analysis. Your input will improve accuracy and provide valuable context..."
                        className="min-h-32 resize-none"
                      />
                      <div className="mt-2 text-xs text-gray-500">
                        Your insights will be incorporated into the analysis and reflected in the main table view.
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <Button
                        onClick={handleRepopulate}
                        disabled={isRepopulating}
                        className="flex items-center space-x-2"
                      >
                        {isRepopulating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Updating Analysis...</span>
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
                      
                      {humanInsights.trim() && (
                        <Button
                          variant="outline"
                          onClick={() => setHumanInsights("")}
                          className="text-gray-600"
                        >
                          Clear
                        </Button>
                      )}
                    </div>

                    {/* Benefits of Adding Insights */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center space-x-2">
                        <Info className="h-4 w-4" />
                        <span>Why Add Human Insights?</span>
                      </h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Improve AI confidence scores with professional context</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Add real-world observations not captured in documentation</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Provide institutional knowledge and historical context</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Flag concerns or validate AI findings based on experience</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
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