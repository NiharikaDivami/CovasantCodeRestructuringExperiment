export interface SupportiveDocument {
  id: string;
  name: string;
  type: "policy" | "procedure" | "standard" | "guideline" | "report" | "evidence" | "certificate";
  status: "available" | "pending" | "expired" | "under-review";
  relevanceScore: number;
  lastUpdated: string;
  owner: string;
  size?: string;
  description?: string;
}

export interface DocumentMentionTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  disabled?: boolean;
  documents: SupportiveDocument[];
  className?: string;
  onDocumentClick?: (documentName: string) => void;
}
