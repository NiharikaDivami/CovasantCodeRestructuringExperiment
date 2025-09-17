import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { RefreshCw, User, Bot } from "lucide-react";

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
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <span>Create New Version with Human Insights</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            A new version will be created that incorporates your human insights into the AI analysis.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="space-y-4">
          <div>
            <span className="text-sm text-gray-700">This will:</span>
            <ul className="text-sm space-y-1 ml-4 mt-2 text-gray-600">
              <li>• Create a new version with updated confidence scoring</li>
              <li>• Incorporate your insights into the AI reasoning process</li>
              <li>• Update the activity log with the repopulation event</li>
              <li>• Show human insights in the test script table</li>
            </ul>
          </div>
          
          {humanInsights && (
            <div className="p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Human Insights to be incorporated:</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-3">
                "{humanInsights}"
              </p>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-sm text-blue-600">
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Creating Version...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Create New Version
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}