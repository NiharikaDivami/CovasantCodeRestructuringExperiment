import { X } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import type { DocumentCitationModalProps } from "./types";
import { styles } from "./styles";

export default function DocumentCitationModal({ isOpen, onClose, citation }: DocumentCitationModalProps) {
  if (!citation) return null;
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent style={styles.sheetContent as any}>
        <SheetHeader style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <SheetTitle style={{ fontSize: 18 }}>Document Citation</SheetTitle>
              <SheetDescription style={{ fontSize: 14, color: '#4b5563', marginTop: 4 }}>
                View the source document and highlighted citation text
              </SheetDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X style={{ width: 16, height: 16 }} />
            </Button>
          </div>
        </SheetHeader>
        <div style={{ display: 'flex', minHeight: 0, height: 'calc(100vh - 100px)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <ScrollArea className="flex-1">
              <div style={{ padding: 24 }}>
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 24, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, fontSize: 14 }}>
                    {citation.highlightText || 'Page content not available'}
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
