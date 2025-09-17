import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface Citation {
  documentName: string;
  page: number;
  paragraph: number;
  highlightText: string;
}

interface DocumentCitationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  citation: Citation | null;
}

export default function DocumentCitationPanel({ isOpen, onClose, citation }: DocumentCitationPanelProps) {
  const [selectedPage, setSelectedPage] = useState<number>(8);

  // Mock document data - SOC2 Security Report 2025
  const documentPages = [
    { pageNumber: 7, title: "Security Framework Overview" },
    { pageNumber: 8, title: "Data Encryption Standards", isHighlighted: true },
    { pageNumber: 9, title: "Access Control Implementation" }
  ];

  const pageContent = {
    7: `SOC 2 Security Report 2025 - Page 7

SECURITY FRAMEWORK OVERVIEW

The organization has implemented a comprehensive security framework based on industry best practices and regulatory requirements. This framework encompasses multiple layers of security controls designed to protect sensitive data and ensure business continuity.

Key components of the security framework include:
• Physical security controls
• Network security architecture  
• Data classification and handling procedures
• Identity and access management
• Incident response procedures

The security framework is reviewed annually and updated as needed to address emerging threats and changing business requirements.`,
    8: `SOC 2 Security Report 2025 - Page 8

DATA ENCRYPTION STANDARDS

The organization maintains robust data protection through comprehensive encryption protocols. All sensitive data is protected using industry-standard encryption methodologies.

Data at Rest Protection:
Vendor has implemented encryption for data at rest using AES-256. All database systems, file storage, and backup media utilize this encryption standard to ensure data confidentiality. The encryption keys are managed through a centralized key management system with appropriate access controls and rotation schedules.

Audit logs indicate compliance with policy as of March 2025. Regular monitoring and testing procedures verify the effectiveness of encryption implementations across all systems.

Data in Transit Protection:
All data transmissions utilize TLS 1.3 or higher encryption protocols. Network communications between systems and external connections are secured using approved cryptographic standards.`,
    9: `SOC 2 Security Report 2025 - Page 9

ACCESS CONTROL IMPLEMENTATION

The organization has implemented comprehensive access control measures to ensure appropriate user permissions and prevent unauthorized access to sensitive systems and data.

Role-Based Access Control (RBAC):
User access rights are assigned based on job responsibilities and principle of least privilege. Regular access reviews are conducted quarterly to ensure permissions remain appropriate.

Multi-Factor Authentication:
All users accessing critical systems must utilize multi-factor authentication, including hardware tokens or mobile app-based authentication methods.`
  };

  const getHighlightedContent = (content: string, highlightText: string) => {
    if (!highlightText || selectedPage !== 8) return content;
    
    const parts = content.split(new RegExp(`(${highlightText})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === highlightText.toLowerCase() ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : 
        part
    );
  };

  if (!citation) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[1200px] max-w-[95vw] p-0 gap-0 sm:max-w-[95vw]">
        <SheetHeader className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-lg">Document Citation</SheetTitle>
              <SheetDescription className="text-sm text-gray-600 mt-1">
                View the source document and highlighted citation text
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex flex-1 min-h-0 h-[calc(100vh-100px)]">
          {/* Left Panel - Document Navigation */}
          <div className="w-72 border-r bg-gray-50 flex flex-col flex-shrink-0">
            <div className="p-4 border-b bg-white">
              <h3 className="text-sm font-medium">Document Navigation</h3>
              <p className="text-xs text-gray-600 mt-1">{citation.documentName}</p>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-3">
                {documentPages.map((page) => (
                  <button
                    key={page.pageNumber}
                    onClick={() => setSelectedPage(page.pageNumber)}
                    className={`w-full text-left p-3 rounded-lg mb-2 border transition-all text-sm ${
                      selectedPage === page.pageNumber
                        ? 'bg-primary text-primary-foreground border-primary'
                        : page.isHighlighted
                        ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">Page {page.pageNumber}</div>
                    <div className="text-xs opacity-75 mt-1">{page.title}</div>
                    {page.isHighlighted && selectedPage !== page.pageNumber && (
                      <div className="text-xs text-yellow-700 mt-1 font-medium">📍 Citation found</div>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Document Preview */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Document Metadata */}
            <div className="px-6 py-3 border-b bg-gray-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium">{citation.documentName}</h4>
                  <p className="text-sm text-gray-600">
                    Page {selectedPage} {selectedPage === citation.page && `• Paragraph ${citation.paragraph}`}
                  </p>
                </div>
                {selectedPage === citation.page && (
                  <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Citation highlighted
                  </div>
                )}
              </div>
            </div>

            {/* Document Content */}
            <ScrollArea className="flex-1">
              <div className="p-6">
                <div className="bg-white border rounded-lg p-6 shadow-sm">
                  <div className="whitespace-pre-wrap leading-relaxed text-sm">
                    {getHighlightedContent(
                      pageContent[selectedPage as keyof typeof pageContent] || "Page content not available",
                      selectedPage === citation.page ? citation.highlightText : ""
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}