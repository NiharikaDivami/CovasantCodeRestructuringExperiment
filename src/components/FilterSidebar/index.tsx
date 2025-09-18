import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Search } from "lucide-react";
import type { FilterSidebarProps } from "./types";
import { styles } from "./styles";

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
  setStatusFilter,
}: FilterSidebarProps) {
  return (
    <div style={styles.container}>
      <Card>
        <CardHeader style={styles.cardHeader}>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={styles.section}>
            <Label htmlFor="search" style={styles.label}>Search CERs</Label>
            <div style={styles.searchWrapper}>
              <Search style={styles.searchIcon} />
              <Input
                id="search"
                placeholder="Search by vendor, CER ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          <div style={styles.section}>
            <Label htmlFor="vendor" style={styles.label}>Vendor</Label>
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

          <div style={styles.section}>
            <Label htmlFor="risk" style={styles.label}>Risk Level</Label>
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

          <div style={styles.section}>
            <Label htmlFor="confidence" style={styles.label}>Confidence</Label>
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

          <div style={styles.section}>
            <Label htmlFor="status" style={styles.label}>Status</Label>
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
