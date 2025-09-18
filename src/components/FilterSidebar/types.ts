export interface FilterSidebarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  vendorFilter: string;
  setVendorFilter: (vendor: string) => void;
  riskFilter: string;
  setRiskFilter: (risk: string) => void;
  confidenceFilter: string;
  setConfidenceFilter: (confidence: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}
