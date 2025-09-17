import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { TrendingUp, Info } from "lucide-react";

interface ConfidenceBadgeProps {
  status: "not-started" | "in-progress" | "finished" | "repopulated";
  confidence?: number;
  previousConfidence?: number;
  tooltip?: string;
}

export default function ConfidenceBadge({ status, confidence, previousConfidence, tooltip }: ConfidenceBadgeProps) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 85) return "bg-green-500 text-white";
    if (conf >= 60) return "bg-amber-500 text-white";
    return "bg-red-500 text-white";
  };

  const renderBadge = () => {
    switch (status) {
      case "not-started":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 cursor-help hover:opacity-80 transition-opacity">
                  <Badge variant="secondary" className="bg-gray-200 text-gray-600">
                    — Pending
                  </Badge>
                  <Info className="h-3 w-3 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="text-xs">
                  <p className="font-medium mb-1">Pending Analysis:</p>
                  <p>• Awaiting AI agent processing</p>
                  <p>• No confidence score available yet</p>
                  <p>• Run agent to begin assessment</p>
                  <p>• Evidence collection not started</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      
      case "in-progress":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 cursor-help hover:opacity-80 transition-opacity">
                  <Badge className="bg-amber-500 text-white">
                    In Progress
                  </Badge>
                  <Info className="h-3 w-3 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="text-xs">
                  <p className="font-medium mb-1">Preliminary Assessment:</p>
                  <p>• {tooltip || "Partial evidence, missing docs"}</p>
                  <p>• Analysis in progress</p>
                  <p>• Score may change with additional evidence</p>
                  <p>• Awaiting complete documentation</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      
      case "finished":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 cursor-help hover:opacity-80 transition-opacity">
                  <Badge className="bg-green-500 text-white">
                    Finished
                  </Badge>
                  <Info className="h-3 w-3 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="text-xs">
                  <p className="font-medium mb-1">Analysis Complete</p>
                  <p>• Based on evidence completeness and quality</p>
                  <p>• AI assessment of control effectiveness</p>
                  <p>• Validated against regulatory requirements</p>
                  <p>• Analysis completed and verified</p>
                  <p>• Final assessment available in detailed view</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      
      case "repopulated":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="space-y-1 cursor-help hover:opacity-80 transition-opacity">
                  <div className="flex items-center space-x-1">
                    <Badge className="bg-green-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Repopulated
                    </Badge>
                    <Info className="h-3 w-3 text-gray-400" />
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">
                      Updated Analysis
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="text-xs">
                  <p className="font-medium mb-1">Analysis Updated</p>
                  <p>• AI re-analyzed with additional evidence</p>
                  <p>• Human insights and conclusions incorporated</p>
                  <p>• Updated assessment with improved data</p>
                  <p>• Enhanced accuracy and reliability</p>
                  <p>• Latest analysis available in detailed view</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      
      default:
        return null;
    }
  };

  return renderBadge();
}