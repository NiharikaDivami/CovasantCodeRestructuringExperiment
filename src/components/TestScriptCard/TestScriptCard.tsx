import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import ConfidenceBadge from "../ConfidenceBadge";
import { ExternalLink, CheckCircle, XCircle, AlertCircle, Clock, Bot, User, RefreshCw } from "lucide-react";
import "./styles.css";

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
    <Card className="testscript-card">
      <CardContent className="testscript-card-content">
        <div>
          {/* Header */}
          <div className="testscript-header">
            <div className="flex-1">
              <h3 className="testscript-title">{testScript.title}</h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => hasAgentRun ? onOpenScript(testScript.id) : undefined}
              className={!hasAgentRun ? 'testscript-open-btn disabled' : 'testscript-open-btn'}
              disabled={!hasAgentRun}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>

          {/* Confidence Score - Only show when agent has run */}
          {hasAgentRun && (
            <div className="testscript-section">
              <ConfidenceBadge
                status={testScript.confidenceStatus}
                confidence={testScript.confidence}
                previousConfidence={testScript.previousConfidence}
                tooltip={testScript.tooltip}
              />
              <div style={{ textAlign: 'right' }}>
                <p className="testscript-confidence-label">
                  Confidence
                </p>
                {testScript.confidence ? (
                  <span className="testscript-confidence-value">{testScript.confidence}%</span>
                ) : (
                  <span className="testscript-confidence-value empty">-</span>
                )}
              </div>
            </div>
          )}

          {/* Third Party Requirements and Test Scripts */}
          {(testScript.thirdPartyRequirements || testScript.testScripts) && (
            <div>
              {testScript.thirdPartyRequirements && (
                <div>
                  <p className="testscript-meta">
                    Third Party Requirements
                  </p>
                  <p className="testscript-meta-value">
                    {testScript.thirdPartyRequirements}
                  </p>
                </div>
              )}

              {testScript.testScripts && (
                <div>
                  <p className="testscript-meta">
                    Test Scripts
                  </p>
                  <p className="testscript-meta-value">
                    {testScript.testScripts}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* AI/Human Insights Summary */}
          <div>
            {/* AI Insights */}
            <div>
              {hasAgentRun && testScript.aiInsightsSummary ? (
                <div className="testscript-ai-row">
                  <div className="testscript-ai-icon">
                    <Bot className="h-3 w-3 text-blue-600" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <p className="testscript-ai-label">
                        AI Analysis
                      </p>
                      {testScript.confidenceStatus === "repopulated" && (
                        <div className="testscript-ai-updated">
                          <RefreshCw className="h-2.5 w-2.5" />
                          <span>Updated</span>
                        </div>
                      )}
                    </div>
                    <p className="testscript-ai-summary">
                      {testScript.aiInsightsSummary}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="testscript-ai-empty">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Bot className="h-4 w-4 text-gray-400" />
                    <span className="testscript-ai-empty-label">No AI analysis available</span>
                  </div>
                  <div className="testscript-ai-empty-meta">Run Agent to generate insights</div>
                </div>
              )}
            </div>

            {/* Human Insights */}
            <div className="testscript-human-row">
              <div className="testscript-human-icon">
                <User className="h-3 w-3 text-gray-600" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p className="testscript-human-label">
                  Final Conclusions
                </p>
                {hasAgentRun && testScript.humanInsightsSummary ? (
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={() => onOpenScript(testScript.id)}
                  >
                    <p className="testscript-human-summary">
                      {testScript.humanInsightsSummary}
                    </p>
                  </div>
                ) : (
                  <div
                    className={hasAgentRun ? 'testscript-human-empty cursor-pointer' : 'testscript-human-empty'}
                    onClick={() => hasAgentRun ? onOpenScript(testScript.id) : undefined}
                  >
                    <span className="testscript-human-empty-label">
                      No conclusions available
                    </span>
                    {hasAgentRun && (
                      <div className="testscript-human-empty-meta">
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