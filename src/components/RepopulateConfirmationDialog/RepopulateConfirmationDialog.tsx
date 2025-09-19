import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { RefreshCw, User, Bot } from "lucide-react";
import "./styles.css";

interface RepopulateConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  humanInsights: string;
}

export default function RepopulateConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  humanInsights
}: RepopulateConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="repopulate-dialog-content">
        <AlertDialogHeader>
          <AlertDialogTitle className="repopulate-title">
            <RefreshCw className="repopulate-title-icon" />
            <span>Create New Version with Human Insights</span>
          </AlertDialogTitle>
          <AlertDialogDescription className="repopulate-description">
            A new version will be created that incorporates your human insights into the AI analysis.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.95rem', color: '#374151' }}>This will:</span>
            <ul className="repopulate-list">
              <li>• Create a new version with updated confidence scoring</li>
              <li>• Incorporate your insights into the AI reasoning process</li>
              <li>• Update the activity log with the repopulation event</li>
              <li>• Show human insights in the test script table</li>
            </ul>
          </div>

          {humanInsights && (
            <div className="repopulate-insights">
              <div className="repopulate-insights-header">
                <User className="repopulate-insights-icon" />
                <span className="repopulate-insights-label">Human Insights to be incorporated:</span>
              </div>
              <p className="repopulate-insights-text">"{humanInsights}"</p>
            </div>
          )}

          <div className="repopulate-ai-row">
            <Bot className="h-4 w-4" />
            <span>AI analysis will be re-executed with enhanced context</span>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="repopulate-action"
          >
            {isLoading ? (
              <>
                <RefreshCw className="repopulate-action-icon repopulate-action-spin" />
                Creating Version...
              </>
            ) : (
              <>
                <RefreshCw className="repopulate-action-icon" />
                Create New Version
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}