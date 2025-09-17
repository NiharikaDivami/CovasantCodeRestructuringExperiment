import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Search } from "lucide-react";

interface FilterSidebarProps {
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

export default function FilterSidebar({
  searchQuery,
  setSearchQuery,
  vendorFilter,
  setVendorFilter,
  riskFilter,
  setRiskFilter,
  confidenceFilter,
  setConfidenceFilter,
  statusFilter,
  setStatusFilter
}: FilterSidebarProps) {
  return (
    <div className="w-80 bg-white border-r p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search CERs</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Search by vendor, CER ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Vendor Filter */}
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor</Label>
            <Select value={vendorFilter} onValueChange={setVendorFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vendors</SelectItem>
                <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                <SelectItem value="Globex Inc.">Globex Inc.</SelectItem>
                <SelectItem value="Initech Solutions">Initech Solutions</SelectItem>
                <SelectItem value="Umbrella Systems">Umbrella Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk Level Filter */}
          <div className="space-y-2">
            <Label htmlFor="risk">Risk Level</Label>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Confidence Filter */}
          <div className="space-y-2">
            <Label htmlFor="confidence">Confidence</Label>
            <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Confidence Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence Levels</SelectItem>
                <SelectItem value="high">High (≥85%)</SelectItem>
                <SelectItem value="medium">Medium (60-84%)</SelectItem>
                <SelectItem value="low">Low (&lt;60%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="finished">Finished</SelectItem>
                <SelectItem value="unfinished">Unfinished</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}