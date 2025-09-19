import { User, Bot, CheckCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import "./styles.css";

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
    <div className={`human-insights-indicator ${className}`}>
      <span className="human-insights-badge">
        <User className="human-insights-user" />
        Human Insights
      </span>
      <div className="human-insights-details">
        <CheckCircle className="human-insights-check" />
        <span>Enhanced by {userName || 'Risk Analyst'}</span>
        {timestamp && (
          <span>• {new Date(timestamp).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}