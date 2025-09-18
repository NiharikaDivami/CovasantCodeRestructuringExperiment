export interface Citation {
  documentName: string;
  page: number;
  paragraph: number;
  highlightText: string;
}

export interface InlayDocumentCitationProps {
  citation: Citation | null;
  onClose: () => void;
  searchQuery?: string;
  onMapToTextArea?: (selectedText: string) => void;
}
