import { User, Bot, CheckCircle } from "lucide-react";
import { Badge } from "./ui/badge";

interface HumanInsightsIndicatorProps {
  hasHumanInsights: boolean;
  userName?: string;
  timestamp?: string;
  className?: string;
}

export default function HumanInsightsIndicator({ 
  hasHumanInsights, 
  userName, 
  timestamp,
  className = ""
}: HumanInsightsIndicatorProps) {
  if (!hasHumanInsights) return null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
        <User className="h-3 w-3 mr-1" />
        Human Insights
      </Badge>
      <div className="flex items-center space-x-1 text-xs text-gray-500">
        <CheckCircle className="h-3 w-3 text-green-600" />
        <span>Enhanced by {userName || 'Risk Analyst'}</span>
        {timestamp && (
          <span>• {new Date(timestamp).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}