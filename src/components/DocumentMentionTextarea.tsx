import { useState, useRef, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { FileText, Shield, AlertCircle } from "lucide-react";

interface SupportiveDocument {
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

interface DocumentMentionTextareaProps {
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

export default function DocumentMentionTextarea({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder,
  disabled,
  documents,
  className,
  onDocumentClick
}: DocumentMentionTextareaProps) {
  const [showDocuments, setShowDocuments] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ x: 0, y: 0 });
  const [filteredDocuments, setFilteredDocuments] = useState<SupportiveDocument[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [mentionStart, setMentionStart] = useState(-1);
  const [searchTerm, setSearchTerm] = useState("");
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Handle document mention click
  const handleMentionClick = (mentionText: string) => {
    // Extract document name (remove @ symbol)
    const documentName = mentionText.replace('@', '');
    
    // Call the optional callback if provided
    if (onDocumentClick) {
      onDocumentClick(documentName);
    }
    
    // Prevent textarea from losing focus
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "policy":
        return <Shield className="h-3 w-3 text-blue-500" />;
      case "procedure":
        return <FileText className="h-3 w-3 text-green-500" />;
      case "standard":
        return <AlertCircle className="h-3 w-3 text-purple-500" />;
      case "guideline":
        return <FileText className="h-3 w-3 text-amber-500" />;
      case "report":
        return <FileText className="h-3 w-3 text-red-500" />;
      case "evidence":
        return <FileText className="h-3 w-3 text-gray-500" />;
      case "certificate":
        return <Shield className="h-3 w-3 text-emerald-500" />;
      default:
        return <FileText className="h-3 w-3 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-50 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "expired":
        return "bg-red-50 text-red-700 border-red-200";
      case "under-review":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // Handle text input and detect '@' mentions
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    onChange(newValue);
    
    // Check for '@' symbol
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      // Check if '@' is at the start or preceded by whitespace
      const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : ' ';
      const isValidMention = charBeforeAt === ' ' || charBeforeAt === '\n' || lastAtIndex === 0;
      
      if (isValidMention) {
        const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
        
        // Check if there's whitespace after '@', which would end the mention
        if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
          setSearchTerm(textAfterAt.toLowerCase());
          setMentionStart(lastAtIndex);
          
          // Filter documents based on search term
          const filtered = documents.filter(doc =>
            doc.name.toLowerCase().includes(textAfterAt.toLowerCase()) ||
            doc.type.toLowerCase().includes(textAfterAt.toLowerCase())
          ).slice(0, 8); // Limit to 8 results
          
          setFilteredDocuments(filtered);
          setSelectedIndex(-1);
          
          // Calculate position for dropdown
          if (textareaRef.current) {
            const textarea = textareaRef.current;
            
            // Position dropdown above the textarea
            setMentionPosition({
              x: 0, // Align with left edge of textarea
              y: -200 // Position above textarea (200px up from top edge)
            });
          }
          
          setShowDocuments(true);
          return;
        }
      }
    }
    
    // Hide dropdown if '@' conditions not met
    setShowDocuments(false);
  };

  // Handle keyboard navigation in document dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showDocuments) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev === -1 ? 0 : prev < filteredDocuments.length - 1 ? prev + 1 : 0
          );
          return;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev === -1 ? filteredDocuments.length - 1 : prev > 0 ? prev - 1 : filteredDocuments.length - 1
          );
          return;
        case 'Enter':
          if (selectedIndex >= 0 && filteredDocuments[selectedIndex]) {
            e.preventDefault();
            insertDocument(filteredDocuments[selectedIndex]);
            return;
          }
          break;
        case 'Escape':
          e.preventDefault();
          setShowDocuments(false);
          return;
      }
    }
    
    // Call the parent's onKeyDown if no document dropdown handling
    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // Insert selected document into text
  const insertDocument = (document: SupportiveDocument) => {
    if (mentionStart === -1) return;
    
    const beforeMention = value.substring(0, mentionStart);
    const afterMention = value.substring(textareaRef.current?.selectionStart || value.length);
    const documentMention = `@${document.name}`;
    
    const newValue = beforeMention + documentMention + ' ' + afterMention;
    onChange(newValue);
    
    // Position cursor after the mention
    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = mentionStart + documentMention.length + 1;
        textareaRef.current.setSelectionRange(newPosition, newPosition);
        textareaRef.current.focus();
      }
    }, 0);
    
    setShowDocuments(false);
    setMentionStart(-1);
  };

  // Parse text to identify document mentions
  const parseTextWithMentions = (text: string) => {
    if (!text) return [];
    
    const parts = [];
    let lastIndex = 0;
    
    // Find all @mentions in the text - more robust pattern
    const mentionRegex = /@([^\s@]+(?:\s+[^\s@]+)*?)(?=\s|$|@)/g;
    let match;
    
    while ((match = mentionRegex.exec(text)) !== null) {
      // Add text before mention
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }
      
      // Add the mention
      parts.push({
        type: 'mention',
        content: match[0]
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }
    
    return parts;
  };

  // Sync scroll between textarea and overlay
  const handleScroll = () => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        setShowDocuments(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (showDocuments && dropdownRef.current && selectedIndex >= 0) {
      const documentsList = dropdownRef.current.querySelector('.max-h-48.overflow-y-auto.space-y-1');
      if (documentsList) {
        const selectedElement = documentsList.children[selectedIndex] as HTMLElement;
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'nearest' });
        }
      }
    }
  }, [selectedIndex, showDocuments]);

  return (
    <div className="relative w-full">
      {/* Background container for proper styling alignment */}
      <div className="relative">
        {/* Styled overlay for highlighting mentions */}
        <div 
          ref={overlayRef}
          className="absolute inset-0 overflow-hidden whitespace-pre-wrap break-words p-3 z-10"
          style={{
            fontSize: '14px',
            fontFamily: 'inherit',
            lineHeight: '1.5',
            wordWrap: 'break-word',
            minHeight: '80px',
            pointerEvents: 'none'
          }}
        >
          {value && parseTextWithMentions(value).map((part, index) => (
            <span
              key={index}
              className={part.type === 'mention' 
                ? 'text-blue-600 cursor-pointer underline hover:text-blue-800 transition-colors font-normal' 
                : ''
              }
              style={part.type === 'mention' ? { 
                color: '#1d4ed8',
                fontSize: '14px',
                pointerEvents: 'auto',
                textDecoration: 'underline',
                fontWeight: 'normal'
              } : { 
                color: 'transparent',
                fontSize: '14px',
                pointerEvents: 'none'
              }}
              onClick={part.type === 'mention' ? () => handleMentionClick(part.content) : undefined}
            >
              {part.content}
            </span>
          ))}
        </div>

        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          onScroll={handleScroll}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full min-w-0 flex-shrink-0 relative z-20 bg-white border border-gray-200 rounded-md focus:border-gray-300 focus:ring-1 focus:ring-gray-200 transition-colors ${className || ''}`}
          style={{ 
            width: '70%', 
            minWidth: '70%',
            color: 'inherit',
            fontSize: '14px',
            lineHeight: '1.5'
          }}
        />
      </div>
      
      {/* Document Mention Dropdown */}
      {showDocuments && filteredDocuments.length > 0 && (
        <Card 
          ref={dropdownRef}
          className="absolute z-50 w-64 max-h-64 overflow-hidden shadow-lg border-gray-200"
          style={{
            left: `${mentionPosition.x}px`,
            top: `${mentionPosition.y}px`
          }}
        >
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">
              Available Documents {searchTerm && `(${filteredDocuments.length} matches)`}
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {filteredDocuments.map((document, index) => (
                <div
                  key={document.id}
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${
                    index === selectedIndex 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => insertDocument(document)}
                >
                  <div className="flex-shrink-0">
                    {getTypeIcon(document.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {document.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-400 mt-2 px-2 border-t pt-2">
              Use ↑↓ to navigate, Enter to select, Esc to close
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}