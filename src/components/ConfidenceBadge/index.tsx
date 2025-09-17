import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { TrendingUp, Info } from "lucide-react";
import type { ConfidenceBadgeProps } from "./types";
import { CONFIDENCE_THRESHOLDS, TOOLTIP_CONTENTS } from "./constants";
import "./styles.css";

export default function ConfidenceBadge({ status, confidence, previousConfidence, tooltip }: ConfidenceBadgeProps) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= CONFIDENCE_THRESHOLDS.high) return "bg-green-500 text-white";
    if (conf >= CONFIDENCE_THRESHOLDS.medium) return "bg-amber-500 text-white";
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
                  <p className="font-medium mb-1">{TOOLTIP_CONTENTS.notStarted.title}</p>
                  {TOOLTIP_CONTENTS.notStarted.lines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
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
                  <p className="font-medium mb-1">{TOOLTIP_CONTENTS.inProgress.title}</p>
                  <p>• {tooltip || TOOLTIP_CONTENTS.inProgress.defaultFirstLine}</p>
                  {TOOLTIP_CONTENTS.inProgress.lines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
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
                  <p className="font-medium mb-1">{TOOLTIP_CONTENTS.finished.title}</p>
                  {TOOLTIP_CONTENTS.finished.lines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
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
                  <p className="font-medium mb-1">{TOOLTIP_CONTENTS.repopulated.title}</p>
                  {TOOLTIP_CONTENTS.repopulated.lines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
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
