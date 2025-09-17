import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import ConfidenceBadge from "./ConfidenceBadge";
import { ExternalLink, CheckCircle, XCircle, AlertCircle, Clock, Bot, User, RefreshCw } from "lucide-react";

interface TestScriptCardProps {
  testScript: {
    id: string;
    title: string;
    disposition: "Satisfactory" | "Not Satisfactory" | "Partially Satisfactory" | "Under Review";
    confidenceStatus: "not-started" | "in-progress" | "finished" | "repopulated";
    confidence?: number;
    previousConfidence?: number;
    aiInsightsSummary: string;
    humanInsightsSummary: string;
    tooltip?: string;
    thirdPartyRequirements?: string;
    testScripts?: string;
    approvalState?: {
      status: "pending" | "approved" | "rejected" | "changes-requested";
      reviewedBy?: string;
      reviewDate?: string;
    };
  };
  onOpenScript: (id: string) => void;
  hasAgentRun?: boolean;
}

export default function TestScriptCard({ testScript, onOpenScript, hasAgentRun = false }: TestScriptCardProps) {
  const getDispositionColor = (disposition: string) => {
    switch (disposition) {
      case "Satisfactory":
        return "bg-green-100 text-green-800";
      case "Partially Satisfactory":
        return "bg-amber-100 text-amber-800";
      case "Not Satisfactory":
        return "bg-red-100 text-red-800";
      case "Under Review":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getApprovalIcon = (status?: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "changes-requested":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getApprovalBadge = (status?: string) => {
    if (!status) return null;
    
    const configs = {
      "approved": { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
      "rejected": { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
      "changes-requested": { bg: "bg-amber-100", text: "text-amber-800", label: "Changes Requested" },
      "pending": { bg: "bg-blue-100", text: "text-blue-800", label: "Pending Review" }
    };
    
    const config = configs[status as keyof typeof configs];
    if (!config) return null;
    
    return (
      <Badge className={`${config.bg} ${config.text} flex items-center space-x-1`}>
        {getApprovalIcon(status)}
        <span>{config.label}</span>
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{testScript.title}</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => hasAgentRun ? onOpenScript(testScript.id) : undefined}
              className={!hasAgentRun ? 'opacity-50 cursor-not-allowed' : ''}
              disabled={!hasAgentRun}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>

          {/* Confidence Score - Only show when agent has run */}
          {hasAgentRun && (
            <div className="flex items-center justify-between">
              <ConfidenceBadge
                status={testScript.confidenceStatus}
                confidence={testScript.confidence}
                previousConfidence={testScript.previousConfidence}
                tooltip={testScript.tooltip}
              />
              <div className="text-right">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Confidence
                </p>
                {testScript.confidence ? (
                  <span className="text-sm font-medium text-gray-900">{testScript.confidence}%</span>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </div>
            </div>
          )}

          {/* Third Party Requirements and Test Scripts */}
          {(testScript.thirdPartyRequirements || testScript.testScripts) && (
            <div className="space-y-2">
              {testScript.thirdPartyRequirements && (
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Third Party Requirements
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {testScript.thirdPartyRequirements}
                  </p>
                </div>
              )}
              
              {testScript.testScripts && (
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                    Test Scripts
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {testScript.testScripts}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AI/Human Insights Summary */}
          <div className="space-y-3">
            {/* AI Insights */}
            <div className="relative">
              {hasAgentRun && testScript.aiInsightsSummary ? (
                <div className="flex items-start space-x-2">
                  <div className="flex-shrink-0 w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Bot className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">
                        AI Analysis
                      </p>
                      {testScript.confidenceStatus === "repopulated" && (
                        <div className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full flex items-center space-x-1">
                          <RefreshCw className="h-2.5 w-2.5" />
                          <span>Updated</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {testScript.aiInsightsSummary}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-1">
                    <Bot className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-400 italic">No AI analysis available</span>
                  </div>
                  <div className="text-xs text-gray-400">Run Agent to generate insights</div>
                </div>
              )}
            </div>
            
            {/* Human Insights */}
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center mt-0.5">
                <User className="h-3 w-3 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                  Final Conclusions
                </p>
                {hasAgentRun && testScript.humanInsightsSummary ? (
                  <div 
                    className="cursor-pointer hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors"
                    onClick={() => onOpenScript(testScript.id)}
                  >
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {testScript.humanInsightsSummary}
                    </p>
                  </div>
                ) : (
                  <div 
                    className={`border-2 border-dashed border-gray-200 rounded-lg p-2 text-center ${hasAgentRun ? 'cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors' : ''}`}
                    onClick={() => hasAgentRun ? onOpenScript(testScript.id) : undefined}
                  >
                    <span className="text-xs text-gray-400 italic">
                      No conclusions available
                    </span>
                    {hasAgentRun && (
                      <div className="text-xs text-gray-400 mt-1">
                        Click to add final conclusions
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}