import React, { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { toast } from "sonner@2.0.3";
import { Grid3X3, List, Search, Filter, ExternalLink, Activity, Check, Play, Loader2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import RiskPilotAnalysisModal from "../RiskPilotAnalysisModal";
import CERCard from "../CERCard/CERCard";
import { DashboardViewProps } from "./types";
import { 
  findCERForTestScript, 
  getCERs, 
  getRiskLevelTextColor, 
  getConfidenceBadgeColor 
} from "./constants";
import "./styles.css";

export default function DashboardView({ onOpenCER, selectedCERs, onCERSelection, isAgentRunning, onRunAgent, agentCompletedCERs, loadingCERs, processedTestScripts, getCERTestScriptIds }: DashboardViewProps) {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  // Modal state
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [selectedCerId, setSelectedCerId] = useState("");
  
  const cers = getCERs();

  // Handler functions
  const handleOpenAnalysis = (cerId: string) => {
    setSelectedCerId(cerId);
    setIsAnalysisModalOpen(true);
  };

  // Filter CERs based on current filters
  const filteredCERs = cers.filter(cer => {
    const matchesSearch = searchQuery === "" || 
      cer.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cer.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVendor = vendorFilter === "all" || cer.vendor === vendorFilter;
    const matchesRisk = riskFilter === "all" || cer.riskLevel === riskFilter;

    return matchesSearch && matchesVendor && matchesRisk;
  });

  // Get unique vendors for filter dropdown
  const uniqueVendors = Array.from(new Set(cers.map(cer => cer.vendor)));

  const handleCardClick = (e: React.MouseEvent, cerId: string) => {
    // Prevent card click when clicking on action buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }
    onOpenCER(cerId);
  };

  const handleAnalyticsClick = (e: React.MouseEvent, cerId: string) => {
    e.stopPropagation();
    handleOpenAnalysis(cerId);
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {filteredCERs.map((cer) => (
        <CERCard 
          key={cer.id} 
          cer={cer}
          onOpenCER={onOpenCER}
          onOpenAnalysis={handleOpenAnalysis}
          hasAgentRun={agentCompletedCERs.has(cer.id)}
          isLoading={loadingCERs.has(cer.id)}
        />
      ))}
    </div>
  );

  // Helper function to get test script progress for each CER
  const getTestScriptProgress = (cerId: string): { total: number; run: number; pending: number } => {
    // Use the centralized getCERTestScriptIds function to ensure consistency
    const testScriptIds = getCERTestScriptIds(cerId);
    const total = testScriptIds.length;
    const processedScripts = processedTestScripts[cerId] || new Set();
    const run = processedScripts.size;
    const pending = total - run;
    
    return { total, run, pending };
  };

  const renderListView = () => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto dashboard-table-scroll">
        <table className="w-full border-collapse min-w-[1300px]">
          <thead className="border-b bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                CER ID
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                Vendor
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Risk Level
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Test Scripts
              </th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredCERs.map((cer) => (
              <tr
                key={cer.id}
                className={`cursor-pointer hover:bg-gray-50 transition-colors ${loadingCERs.has(cer.id) ? 'relative' : ''}`}
                onClick={(e) => handleCardClick(e, cer.id)}
              >
                {loadingCERs.has(cer.id) && (
                  <td className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10" colSpan={5}>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm font-medium">Running Agent...</span>
                    </div>
                  </td>
                )}
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="font-bold text-gray-900">{cer.id}</div>
                  </div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="text-gray-700">{cer.vendor}</div>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <span className={`font-medium ${getRiskLevelTextColor(cer.riskLevel)}`}>
                    {cer.riskLevel}
                  </span>
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  {(() => {
                    const progress = getTestScriptProgress(cer.id);
                    return (
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900 font-medium">{progress.total}</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-green-600 font-medium">{progress.run} run</span>
                        <span className="text-gray-500">|</span>
                        <span className="text-amber-600 font-medium">{progress.pending} pending</span>
                      </div>
                    );
                  })()}
                </td>
                <td className="px-3 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => handleAnalyticsClick(e, cer.id)}
                      className="text-xs px-3 py-1.5 h-7 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                    >
                      <Activity className="h-3 w-3 mr-1.5" />
                      View Risk Analysis
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenCER(cer.id);
                            }}
                            className="p-1.5 hover:bg-gray-100"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open CER Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Content Header */}
      <div className="bg-white border-b border-gray-100 pl-10 pr-6 py-4">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Control Effectiveness Reviews</h1>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredCERs.length} of {cers.length} CERs
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3 py-1.5 h-8"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3 py-1.5 h-8"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Controls and Search Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={vendorFilter} onValueChange={setVendorFilter}>
                <SelectTrigger className="w-48 h-9 text-sm">
                  <SelectValue placeholder="All Vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vendors</SelectItem>
                  {uniqueVendors.map(vendor => (
                    <SelectItem key={vendor} value={vendor}>{vendor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-40 h-9 text-sm">
                  <SelectValue placeholder="All Risk Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risk Levels</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Bar - Right side */}
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search CERs by ID or vendor name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="min-h-full pl-8 pr-4 py-6">
          {filteredCERs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No CERs found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search or filter criteria</div>
            </div>
          ) : (
            viewMode === "grid" ? renderGridView() : renderListView()
          )}
        </div>
      </div>

      {/* Risk Pilot Analysis Modal */}
      <RiskPilotAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={() => setIsAnalysisModalOpen(false)}
        cerId={selectedCerId}
      />
    </div>
  );
}