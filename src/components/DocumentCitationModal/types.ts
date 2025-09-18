export interface Citation {
  documentName: string;
  page: number;
  paragraph: number;
  highlightText: string;
}

export interface DocumentCitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  citation: Citation | null;
}
