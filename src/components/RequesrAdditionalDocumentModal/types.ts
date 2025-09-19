export interface RequestAdditionalDocumentModalProps {
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