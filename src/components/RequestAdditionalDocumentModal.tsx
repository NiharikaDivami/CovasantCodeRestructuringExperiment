import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";

interface RequestAdditionalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  testScriptId?: string;
  thirdPartyRequirement?: string;
  onSubmit?: (data: {
    testScriptId: string;
    thirdPartyRequirement: string;
    analystNotes: string;
  }) => void;
}

export default function RequestAdditionalDocumentModal({
  isOpen,
  onClose,
  testScriptId = "",
  thirdPartyRequirement = "",
  onSubmit,
}: RequestAdditionalDocumentModalProps) {
  const [analystNotes, setAnalystNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!analystNotes.trim()) {
      toast(
        "Please provide analyst notes describing what additional evidence is needed",
        {
          className:
            "border-red-500 bg-red-100 text-red-800 font-medium shadow-lg",
          style: {
            backgroundColor: "#fef2f2",
            borderColor: "#ef4444",
            color: "#991b1b",
          },
        },
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit({
          testScriptId,
          thirdPartyRequirement,
          analystNotes,
        });
      }

      // Reset form
      setAnalystNotes("");
      setIsSubmitting(false);

      // Show success toast
      toast(
        "Additional document request submitted successfully",
        {
          className:
            "border-green-500 bg-green-100 text-green-800 font-medium shadow-lg",
          style: {
            backgroundColor: "#dcfce7",
            borderColor: "#22c55e",
            color: "#166534",
          },
        },
      );

      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setAnalystNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Request Additional Document</DialogTitle>
          <DialogDescription>
            Request additional evidence or documentation from
            the vendor to support this test script.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="test-script-id">
              Test Script ID
            </Label>
            <Input
              id="test-script-id"
              value={testScriptId}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="third-party-requirement">
              Third Party Requirement
            </Label>
            <Textarea
              id="third-party-requirement"
              value={thirdPartyRequirement}
              disabled
              className="bg-gray-50 resize-none"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="analyst-notes">
              Analyst Notes *
            </Label>
            <Textarea
              id="analyst-notes"
              placeholder="Describe what additional evidence or documentation is needed to support this test script..."
              value={analystNotes}
              onChange={(e) => setAnalystNotes(e.target.value)}
              rows={6}
              className="resize-none mt-3"
            />
          </div>
        </div>

        <DialogFooter>
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