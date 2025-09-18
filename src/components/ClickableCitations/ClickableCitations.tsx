import { useState } from "react";
import DocumentCitationPanel from "../DocumentCitationPanel/index";
import { Citation, ClickableCitationsProps } from "./types";
import { 
  CITATION_REGEX, 
  MAX_CITATION_MATCHES, 
  CITATION_HIGHLIGHT_MAP, 
  CITATION_STYLES 
} from "./constants";
import "./styles.css";

export default function ClickableCitations({ text, className = "" }: ClickableCitationsProps) {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allDocumentCitations, setAllDocumentCitations] = useState<Citation[]>([]);
  const [currentCitationIndex, setCurrentCitationIndex] = useState(0);

  // Extract all citations from text and group by document
  const getAllCitationsFromText = () => {
    const citations: Citation[] = [];
    const regex = new RegExp(CITATION_REGEX.source, CITATION_REGEX.flags);
    let match;
    let matchCount = 0;
    
    // Reset regex lastIndex
    regex.lastIndex = 0;
    
    try {
      while ((match = regex.exec(text)) !== null && matchCount < MAX_CITATION_MATCHES) {
        matchCount++;
        const [, documentName, pageStr, paragraphStr] = match;
        const page = parseInt(pageStr);
        const paragraph = parseInt(paragraphStr);
        
        // Validate parsed numbers
        if (isNaN(page) || isNaN(paragraph)) continue;
        
        const citation: Citation = {
          documentName: documentName.trim(),
          page,
          paragraph,
          highlightText: getCitationHighlight(documentName.trim(), page, paragraph)
        };
        
        citations.push(citation);
      }
    } catch (error) {
      console.warn('Error parsing citations:', error);
    }
    
    return citations;
  };

  const getCitationHighlight = (docName: string, pageNum: number, paraNum: number) => {
    const citationKey = `${docName}-p${pageNum}-para${paraNum}`;
    return CITATION_HIGHLIGHT_MAP[citationKey] || CITATION_HIGHLIGHT_MAP[docName] || "";
  };

  const handleCitationClick = (documentName: string, page: number, paragraph: number) => {
    try {
      const citation: Citation = {
        documentName,
        page,
        paragraph,
        highlightText: getCitationHighlight(documentName, page, paragraph)
      };

      // Get all citations for this document
      const allCitations = getAllCitationsFromText();
      const documentCitations = allCitations.filter(c => 
        c.documentName === documentName && 
        c.page && c.paragraph // Ensure valid citations only
      );
      
      // Find the index of the clicked citation
      const clickedIndex = documentCitations.findIndex(c => 
        c.page === page && c.paragraph === paragraph
      );

      setSelectedCitation(citation);
      setAllDocumentCitations(documentCitations);
      setCurrentCitationIndex(Math.max(clickedIndex, 0)); // Ensure non-negative index
      setIsModalOpen(true);
    } catch (error) {
      console.warn('Error handling citation click:', error);
    }
  };

  const renderTextWithCitations = (text: string) => {
    const parts = [];
    let lastIndex = 0;
    let match;
    let matchCount = 0;

    // Create a new regex instance to avoid global state issues
    const regex = new RegExp(CITATION_REGEX.source, CITATION_REGEX.flags);

    try {
      while ((match = regex.exec(text)) !== null && matchCount < MAX_CITATION_MATCHES) {
        matchCount++;
        
        // Add text before citation
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }

        // Add clickable citation
        const [fullMatch, documentName, pageStr, paragraphStr] = match;
        const page = parseInt(pageStr);
        const paragraph = parseInt(paragraphStr);

        // Validate parsed numbers
        if (isNaN(page) || isNaN(paragraph)) {
          lastIndex = match.index + fullMatch.length;
          continue;
        }

        parts.push(
          <button
            key={`citation-${match.index}-${matchCount}`}
            onClick={() => handleCitationClick(documentName.trim(), page, paragraph)}
            className={`${CITATION_STYLES.BUTTON} citation-button`}
            title={`Click to view ${documentName.trim()}, page ${page}, paragraph ${paragraph}`}
          >
            <span className={`${CITATION_STYLES.DOCUMENT_NAME} citation-document-name`}>
              {documentName.trim()}
            </span>
            <span className={`${CITATION_STYLES.PAGE_INFO} citation-page-info`}>
              Page {page}, Paragraph {paragraph}
            </span>
            <span className={`${CITATION_STYLES.CITATION_BADGE} citation-badge`}>
              Citation
            </span>
          </button>
        );

        lastIndex = match.index + fullMatch.length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
    } catch (error) {
      console.warn('Error rendering citations:', error);
      return [text]; // Fallback to original text
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <>
      <div className={className}>
        {renderTextWithCitations(text)}
      </div>
      
      <DocumentCitationPanel
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        citation={selectedCitation}
        allCitations={allDocumentCitations}
        currentCitationIndex={currentCitationIndex}
      />
    </>
  );
}
