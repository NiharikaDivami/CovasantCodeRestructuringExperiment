export interface Citation {
  documentName: string;
  page: number;
  paragraph: number;
  highlightText: string;
}

export interface DocumentCitationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  citation: Citation | null;
  allCitations?: Citation[];
  currentCitationIndex?: number;
}
