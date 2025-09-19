import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import "./styles.css";

interface RequestReuploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  testScriptId?: string;
  documentName?: string;
  onSubmit?: (data: {
    testScriptId: string;
    documentName: string;
    reason: string;
    analystNotes: string;
    overrideExisting: boolean;
  }) => void;
}

export default function RequestReuploadModal({
  isOpen,
  onClose,
  testScriptId = "",
  documentName = "",
  onSubmit
}: RequestReuploadModalProps) {
  const [reason, setReason] = useState("");
  const [analystNotes, setAnalystNotes] = useState("");
  const [overrideExisting, setOverrideExisting] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast("Please select a reason for the re-upload request", {
        className: "border-red-500 bg-red-100 text-red-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#fef2f2",
          borderColor: "#ef4444",
          color: "#991b1b",
        },
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit({
          testScriptId,
          documentName,
          reason,
          analystNotes,
          overrideExisting
        });
      }

      // Reset form
      setReason("");
      setAnalystNotes("");
      setOverrideExisting(true);
      setIsSubmitting(false);

      // Show success toast
      toast("Re-upload request submitted successfully", {
        className: "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
        style: {
          backgroundColor: "#dcfce7",
          borderColor: "#22c55e",
          color: "#166534",
        },
      });

      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setReason("");
    setAnalystNotes("");
    setOverrideExisting(true);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="request-modal-content">
        <DialogHeader>
          <DialogTitle>Request Document Re-upload</DialogTitle>
          <DialogDescription>
            Request the vendor to re-upload a document with updated or corrected information.
          </DialogDescription>
        </DialogHeader>

        <div className="request-modal-fields">
          <div>
            <Label htmlFor="test-script-id" className="request-modal-label">Test Script ID</Label>
            <Input
              id="test-script-id"
              value={testScriptId}
              disabled
              className="request-modal-input"
            />
          </div>

          <div>
            <Label htmlFor="document-name" className="request-modal-label">Document Name</Label>
            <Input
              id="document-name"
              value={documentName}
              disabled
              className="request-modal-input"
            />
          </div>

          <div>
            <Label htmlFor="reason" className="request-modal-label">Reason *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="request-modal-select">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="incorrect">Incorrect</SelectItem>
                <SelectItem value="clarification">Clarification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="analyst-notes" className="request-modal-label">Analyst Notes</Label>
            <Textarea
              id="analyst-notes"
              placeholder="Provide additional details about why the document needs to be re-uploaded..."
              value={analystNotes}
              onChange={(e) => setAnalystNotes(e.target.value)}
              rows={4}
              className="request-modal-textarea"
            />
          </div>

          <div className="request-modal-checkbox-row">
            <Checkbox
              id="override-existing"
              checked={overrideExisting}
              onCheckedChange={(checked: any) => setOverrideExisting(checked === true)}
            />
            <Label
              htmlFor="override-existing"
              className="request-modal-checkbox-label"
            >
              Override the existing document
            </Label>
          </div>
        </div>

        <DialogFooter className="request-modal-footer">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}