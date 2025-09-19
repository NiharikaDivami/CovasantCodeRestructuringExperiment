export interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}
export type PersonaType = "analyst" | "vendor" | "manager";



export type Notification = {
  id: string;
  type: "vendor_submission" | "action_item_created" | "upload_needs_review" | "reupload_requested";
  message: string;
  timestamp: string;
  testScriptId: string;
  vendorName?: string;
  submissionType?: "COQ Responded" | "Action Item Responded";
  cerId?: string;
  isRead: boolean;
  needsApproval?: boolean;
  documentName?: string;
  reuploadReason?: string;
};

export interface NavigationHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  currentPersona?: PersonaType;
  onPersonaChange?: (persona: PersonaType) => void;
  notifications?: Notification[];
  unreadNotificationCount?: number;
  onNotificationClick?: (notification: Notification) => void;
  onMarkNotificationAsRead?: (notificationId: string) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}