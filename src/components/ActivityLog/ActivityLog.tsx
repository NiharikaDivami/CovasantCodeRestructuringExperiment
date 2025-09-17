import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Clock, X } from "lucide-react";
import type { ActivityLogProps } from "./types";
import { getActivityIcon, getActivityIconColor } from "./constants";
import "./styles.css";

export default function ActivityLog({ activities, onClose, onExpandedChange }: ActivityLogProps) {
  const renderIcon = (type: string) => {
    const IconComponent = getActivityIcon(type);
    const colorClass = getActivityIconColor(type);
    return <IconComponent className={`h-4 w-4 ${colorClass}`} />;
  };

  return (
    <div className="activity-log-container">
      {/* Collapsible Header */}
      <div className="activity-log-header">
        <div className="activity-log-header-title">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3>Activity Log</h3>
        </div>
        
        {/* Close button */}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="activity-log-close-button"
            title="Close activity log"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Content */}
      <div className="activity-log-content">
        <div className="activity-log-scroll-area">
          <ScrollArea className="h-full relative">
            <div className="activity-log-items">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-log-item">
                  <div className="activity-log-item-icon">
                    {renderIcon(activity.type)}
                  </div>
                  <div className="activity-log-item-content">
                    <p className="activity-log-item-message">{activity.message}</p>
                    {activity.confidence && (
                      <div className="activity-log-item-badge">
                        {activity.previousConfidence ? (
                          <Badge variant="outline" className="text-xs">
                            Confidence: {activity.previousConfidence}% → {activity.confidence}%
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Confidence: {activity.confidence}%
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="activity-log-item-timestamp">
                      <Clock className="activity-log-item-timestamp-icon" />
                      {activity.timestamp}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}