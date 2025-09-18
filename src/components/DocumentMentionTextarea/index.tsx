import { useState, useRef, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { FileText, Shield, AlertCircle } from "lucide-react";
import type { DocumentMentionTextareaProps, SupportiveDocument } from "./types";
import { MENTION_REGEX } from "./constants";
import { styles } from "./styles";

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
  onDocumentClick,
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

  const handleMentionClick = (mentionText: string) => {
    const documentName = mentionText.replace('@', '');
    if (onDocumentClick) onDocumentClick(documentName);
    if (textareaRef.current) textareaRef.current.focus();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "policy":
        return <Shield style={{ width: 12, height: 12, color: '#3b82f6' }} />;
      case "procedure":
        return <FileText style={{ width: 12, height: 12, color: '#10b981' }} />;
      case "standard":
        return <AlertCircle style={{ width: 12, height: 12, color: '#8b5cf6' }} />;
      case "guideline":
        return <FileText style={{ width: 12, height: 12, color: '#f59e0b' }} />;
      case "report":
        return <FileText style={{ width: 12, height: 12, color: '#ef4444' }} />;
      case "evidence":
        return <FileText style={{ width: 12, height: 12, color: '#6b7280' }} />;
      case "certificate":
        return <Shield style={{ width: 12, height: 12, color: '#10b981' }} />;
      default:
        return <FileText style={{ width: 12, height: 12, color: '#9ca3af' }} />;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    onChange(newValue);
    
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const charBeforeAt = lastAtIndex > 0 ? textBeforeCursor[lastAtIndex - 1] : ' ';
      const isValidMention = charBeforeAt === ' ' || charBeforeAt === '\n' || lastAtIndex === 0;
      
      if (isValidMention) {
        const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
        if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
          setSearchTerm(textAfterAt.toLowerCase());
          setMentionStart(lastAtIndex);
          const filtered = documents.filter(doc =>
            doc.name.toLowerCase().includes(textAfterAt.toLowerCase()) ||
            doc.type.toLowerCase().includes(textAfterAt.toLowerCase())
          ).slice(0, 8);
          setFilteredDocuments(filtered);
          setSelectedIndex(-1);
          setMentionPosition({ x: 0, y: -200 });
          setShowDocuments(true);
          return;
        }
      }
    }
    setShowDocuments(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showDocuments) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => prev === -1 ? 0 : prev < filteredDocuments.length - 1 ? prev + 1 : 0);
          return;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev === -1 ? filteredDocuments.length - 1 : prev > 0 ? prev - 1 : filteredDocuments.length - 1);
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
    if (onKeyDown) onKeyDown(e);
  };

  const insertDocument = (document: SupportiveDocument) => {
    if (mentionStart === -1) return;
    const beforeMention = value.substring(0, mentionStart);
    const afterMention = value.substring(textareaRef.current?.selectionStart || value.length);
    const documentMention = `@${document.name}`;
    const newValue = beforeMention + documentMention + ' ' + afterMention;
    onChange(newValue);
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

  const parseTextWithMentions = (text: string) => {
    if (!text) return [] as Array<{type: 'text'|'mention'; content: string}>;
    const parts: Array<{type: 'text'|'mention'; content: string}> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const mentionRegex = new RegExp(MENTION_REGEX.source, MENTION_REGEX.flags);
    while ((match = mentionRegex.exec(text)) !== null) {
      if (match.index > lastIndex) parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
      parts.push({ type: 'mention', content: match[0] });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) parts.push({ type: 'text', content: text.slice(lastIndex) });
    return parts;
  };

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

  useEffect(() => {
    if (showDocuments && dropdownRef.current && selectedIndex >= 0) {
      const list = dropdownRef.current.querySelector('[data-doc-list]') as HTMLElement | null;
      if (list) {
        const selectedElement = list.children[selectedIndex] as HTMLElement;
        if (selectedElement) selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex, showDocuments]);

  return (
    <div style={styles.container} className={className}>
      <div 
        ref={overlayRef}
        style={styles.overlay}
      >
        {value && parseTextWithMentions(value).map((part, index) => (
          <span
            key={index}
            style={part.type === 'mention' ? styles.mention : styles.text}
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
        placeholder={placeholder}
        disabled={disabled}
        style={{ width: '70%', minWidth: '70%', color: 'inherit', fontSize: 14, lineHeight: 1.5 }}
      />
      
      {showDocuments && filteredDocuments.length > 0 && (
        <Card 
          ref={dropdownRef as any}
          style={{ ...styles.dropdown, left: mentionPosition.x, top: mentionPosition.y }}
        >
          <div style={{ padding: 8 }}>
            <div style={styles.dropdownHeader}>
              Available Documents {searchTerm && `(${filteredDocuments.length} matches)`}
            </div>
            <div style={styles.list} data-doc-list>
              {filteredDocuments.map((document, index) => (
                <div
                  key={document.id}
                  style={styles.listItem(index === selectedIndex)}
                  onClick={() => insertDocument(document)}
                >
                  <div>
                    {getTypeIcon(document.type)}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 14, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {document.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div style={styles.footer}>
              Use ↑↓ to navigate, Enter to select, Esc to close
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
