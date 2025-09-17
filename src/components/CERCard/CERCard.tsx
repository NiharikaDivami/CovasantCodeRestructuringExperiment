import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ExternalLink, Activity, Loader2 } from "lucide-react";
import type { CERCardProps } from "./types";
import { getRiskLevelColor } from "./constants";
import "./styles.css";

export default function CERCard({ cer, onOpenCER, onOpenAnalysis, hasAgentRun, isLoading }: CERCardProps) {
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on action buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    onOpenCER(cer.id);
  };

  const handleAnalyticsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenAnalysis(cer.id);
  };

  return (
    <Card className={`cer-card-container ${isLoading ? 'relative' : ''}`}>
      {isLoading && (
        <div className="cer-card-loading-overlay">
          <div className="cer-card-loading-content">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="cer-card-loading-text">Running Agent...</span>
          </div>
        </div>
      )}
      <CardContent className="cer-card-content" onClick={handleCardClick}>
        <div className="cer-card-content-inner">
          {/* Header */}
          <div className="cer-card-header">
            <div className="cer-card-header-content">
              <h3 className="cer-card-id">{cer.id}</h3>
              <p className="cer-card-vendor">{cer.vendor}</p>
            </div>
            <div className="cer-card-badges">
              <Badge className={getRiskLevelColor(cer.riskLevel)}>
                {cer.riskLevel}
              </Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="cer-card-actions">
            <div className="cer-card-action-buttons">
              <Button
                variant="outline"
                size="sm"
                onClick={(e:any) => {
                  e.stopPropagation();
                  onOpenCER(cer.id);
                }}
                className="cer-card-open-button"
                disabled={isLoading}
              >
                <ExternalLink className="h-3 w-3" />
                <span>Open CER</span>
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleAnalyticsClick}
                      disabled={isLoading}
                      className="cer-card-analytics-button"
                    >
                      <Activity className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Risk Pilot Analysis</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {hasAgentRun && (
              <Badge variant="outline" className="cer-card-agent-badge">
                Run by Agent
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}