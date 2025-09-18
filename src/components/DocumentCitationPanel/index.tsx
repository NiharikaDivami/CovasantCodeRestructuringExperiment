import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { styles } from "./styles";
import type { Citation, DocumentCitationPanelProps } from "./types";
import { SOC2_PAGES, IPSRA_PAGES } from "./constants";

export default function DocumentCitationPanel({ 
  isOpen, onClose, citation, allCitations = [], currentCitationIndex = 0 
}: DocumentCitationPanelProps) {
  const citationRef = useRef<HTMLElement>(null);
  const [currentPage, setCurrentPage] = useState(8);
  const [citationIndex, setCitationIndex] = useState(currentCitationIndex);

  useEffect(() => {
    if (isOpen && citation) {
      setCurrentPage(citation.page);
      setCitationIndex(currentCitationIndex);
    }
  }, [isOpen, citation?.page, citation?.documentName, currentCitationIndex]);

  useEffect(() => {
    if (isOpen && citation && citationRef.current) {
      const timer = setTimeout(() => {
        citationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, citation?.page, citation?.highlightText, currentPage]);

  const getDocumentPages = () => {
    if (citation?.documentName === "IPSRA Risk Scorecard") return IPSRA_PAGES;
    return SOC2_PAGES;
  };

  const documentPages = getDocumentPages();
  const documentMetadata = {
    title: citation?.documentName || "SOC 2 Security Report 2025",
    totalPages: Object.keys(documentPages).length,
  };

  const handlePageClick = (pageNumber: number) => setCurrentPage(pageNumber);

  const getHighlightedContent = (content: string, highlightText: string) => {
    if (!highlightText || currentPage !== (citation?.page || 0) || !content) return content;
    try {
      const escaped = highlightText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const parts = content.split(new RegExp(`(${escaped})`, 'gi'));
      return parts.map((part, index) => (
        part.toLowerCase() === highlightText.toLowerCase() ? (
          <mark key={`h-${index}`} ref={index === 0 ? citationRef : null} style={styles.highlighted as any}>
            {part}
          </mark>
        ) : (
          part
        )
      ));
    } catch {
      return content;
    }
  };

  if (!citation && allCitations.length === 0) return null;
  const displayCitation = citation || allCitations[citationIndex] || null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent style={styles.sheetContent}>
        <SheetHeader style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <div>
            <SheetTitle style={{ fontSize: 16 }}>Document Citation</SheetTitle>
            <SheetDescription style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>
              View the source document and highlighted citation text
            </SheetDescription>
          </div>
        </SheetHeader>
        
        <div style={styles.container}>
          <div style={styles.leftPanel}>
            <div style={styles.leftHeader}>
              <h3 style={{ fontSize: 14, fontWeight: 500, margin: 0 }}>Document Information</h3>
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{displayCitation?.documentName}</p>
            </div>
            <ScrollArea className="flex-1">
              <div style={{ padding: 16 }}>
                {Object.keys(documentPages).map((pageKey) => {
                  const page = Number(pageKey);
                  const isCurrent = page === currentPage;
                  const isCitationPage = page === (displayCitation?.page || 0);
                  return (
                    <div
                      key={page}
                      onClick={() => handlePageClick(page)}
                      style={{
                        padding: 12,
                        borderRadius: 8,
                        border: '1px solid',
                        borderColor: isCurrent ? '#93c5fd' : isCitationPage ? '#d1d5db' : '#e5e7eb',
                        backgroundColor: isCurrent ? '#eff6ff' : isCitationPage ? '#f9fafb' : '#ffffff',
                        cursor: 'pointer',
                        marginBottom: 8,
                        fontSize: 14,
                      }}
                    >
                      <div style={{ fontWeight: 500 }}>Page {page}</div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div style={styles.rightPanel}>
            <div style={styles.docHeader}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{displayCitation?.documentName}</h4>
                  <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
                    Page {currentPage} of {documentMetadata.totalPages}
                  </p>
                </div>
              </div>
            </div>

            <div style={styles.contentWrapper}>
              <ScrollArea className="h-full">
                <div style={{ padding: 24 }}>
                  <div style={styles.pageCard}>
                    <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #e5e7eb' }}>
                      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 500, color: '#111827' }}>
                        Page {currentPage}
                      </h2>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 14 }}>
                      {getHighlightedContent(documentPages[currentPage] || 'Page content not available.', displayCitation?.highlightText || '')}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
