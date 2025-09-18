export type RiskLevel = "Critical" | "High" | "Medium" | "Low";

export interface VendorCERMapEntry {
  cerId: string;
  vendor: string;
  analyst: string;
  testScriptCount: number;
  riskLevel: RiskLevel;
}

export interface ManagerDashboardViewProps {
  onNavigateToVendor?: () => void;
  onViewChange?: (view: string) => void;
  currentView?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}
