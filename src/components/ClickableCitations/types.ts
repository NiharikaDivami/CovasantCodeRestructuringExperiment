export interface Citation {
  documentName: string;
  page: number;
  paragraph: number;
  highlightText: string;
}

export interface ClickableCitationsProps {
  text: string;
  className?: string;
}