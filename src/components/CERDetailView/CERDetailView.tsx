import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";
import { Grid3X3, Table as TableIcon, ExternalLink, ChevronUp, ChevronDown, X, Info, Bot, RefreshCw, Search } from "lucide-react";
import TestScriptCard from "../TestScriptCard/TestScriptCard";
import { vendorMap, scriptDataByCER, scriptMap } from './constants'


interface CERDetailViewProps {
  cerId: string;
  onBack?: () => void;
  onOpenScript: (scriptId: string) => void;
  scriptUpdates?: Record<string, any>;
  hasAgentRun?: boolean;
  approvedVersions?: Record<string, { version: string; timestamp: string; scriptId: string; cerId: string; approvedData?: any }>;
  onRunAgent?: (cerId: string, selectedScripts?: string[]) => void;
  isAgentRunning?: boolean;
  isLoadingThisCER?: boolean;
  sharedTestScripts?: Array<{
    id: string;
    testScriptId: string;
    status: "COQ Requested" | "COQ Responded" | "Action Item Issued" | "Action Item Responded" | "Approved";
    type: "COQ" | "Action Item";
    cerId?: string;
    vendorName?: string;
  }>;
  processedTestScripts?: Set<string>;
}

export default function CERDetailView({ cerId, onOpenScript, scriptUpdates = {}, hasAgentRun = false, approvedVersions = {}, onRunAgent, isAgentRunning, isLoadingThisCER, sharedTestScripts = [], processedTestScripts = new Set() }: CERDetailViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dispositionFilter, setDispositionFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");

  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [sortBy, setSortBy] = useState<"title" | "disposition" | "confidence">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // // State for collapsible activity log
  // const [isActivityLogExpanded, setIsActivityLogExpanded] = useState(true);

  // State for selected test scripts
  const [selectedTestScripts, setSelectedTestScripts] = useState<string[]>([]);

  // Generate test script data based on current CER - each CER has unique test script IDs
  const generateTestScriptData = () => {
    // CER-specific test script mappings with unique IDs per CER

    const baseScripts = scriptDataByCER[cerId] || [];

    // Show data only for test scripts that have been processed by the agent
    return baseScripts.map(script => {
      const hasBeenProcessed = processedTestScripts.has(script.id);

      if (!hasBeenProcessed) {
        return {
          ...script,
          disposition: null,  // Will show placeholder
          confidence: null,   // Will show placeholder
          confidenceStatus: "not-started",
          aiInsightsSummary: null, // Will show placeholder
          humanInsightsSummary: null  // Will show placeholder for final conclusion
        };
      }

      return script;
    });
  };

  // Sample vendor data based on CER ID
  const getVendorData = (id: string) => {
    return vendorMap[id] || {
      vendor: "Unknown Vendor",
      riskLevel: "Medium",
      confidence: 75,
      status: "finished"
    };
  };

  const vendorData = getVendorData(cerId);
  const testScripts = generateTestScriptData();

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "High":
        return "bg-red-500 text-white";
      case "Medium":
        return "bg-amber-500 text-white";
      case "Low":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // const getConfidenceColor = (conf: number) => {
  //   if (conf >= 85) return "text-green-600";
  //   if (conf >= 60) return "text-amber-600";
  //   return "text-red-600";
  // };

  // Filter and sort test scripts
  const filteredAndSortedScripts = testScripts
    .filter(script => {
      const matchesSearch = searchQuery === "" ||
        script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.thirdPartyRequirements.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.testScripts.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.aiInsightsSummary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDisposition = dispositionFilter === "all" || script.disposition === dispositionFilter;
      const matchesConfidence = confidenceFilter === "all" ||
        (confidenceFilter === "high" && script.confidence && script.confidence >= 85) ||
        (confidenceFilter === "medium" && script.confidence && script.confidence >= 60 && script.confidence < 85) ||
        (confidenceFilter === "low" && script.confidence && script.confidence < 60);

      return matchesSearch && matchesDisposition && matchesConfidence;
    })
    .sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "disposition":
          const dispositionOrder = { "Satisfactory": 4, "Partially Satisfactory": 3, "Not Satisfactory": 2, "Under Review": 1 };
          aValue = dispositionOrder[a.disposition as keyof typeof dispositionOrder];
          bValue = dispositionOrder[b.disposition as keyof typeof dispositionOrder];
          break;
        case "confidence":
          aValue = a.confidence || 0;
          bValue = b.confidence || 0;
          break;

        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  const handleSort = (column: "title" | "disposition" | "confidence") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setDispositionFilter("all");
    setConfidenceFilter("all");
  };

  const hasActiveFilters = searchQuery !== "" || dispositionFilter !== "all" || confidenceFilter !== "all";

  // Checkbox selection handlers
  const handleTestScriptSelection = (scriptId: string, isSelected: boolean) => {
    setSelectedTestScripts(prev => {
      if (isSelected) {
        return [...prev, scriptId];
      } else {
        return prev.filter(id => id !== scriptId);
      }
    });
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allScriptIds = filteredAndSortedScripts.map(script => script.id);
      setSelectedTestScripts(allScriptIds);
    } else {
      setSelectedTestScripts([]);
    }
  };

  const handleRunAgentForSelectedScripts = () => {
    if (onRunAgent) {
      if (selectedTestScripts.length > 0) {
        // Run the agent with selected scripts context
        onRunAgent(cerId, selectedTestScripts);
        // Clear selection after running
        setSelectedTestScripts([]);
      } else {
        // No scripts selected, run on entire CER
        onRunAgent(cerId);
      }
    }
  };

  const isAllSelected = filteredAndSortedScripts.length > 0 && selectedTestScripts.length === filteredAndSortedScripts.length;
  // const isPartiallySelected = selectedTestScripts.length > 0 && selectedTestScripts.length < filteredAndSortedScripts.length;

  const getDispositionColor = (disposition: string) => {
    switch (disposition) {
      case "Satisfactory":
        return "bg-green-100 text-green-800";
      case "Partially Satisfactory":
        return "bg-amber-100 text-amber-800";
      case "Not Satisfactory":
        return "bg-red-100 text-red-800";
      case "Under Review":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get approved version for a script
  const getApprovedVersion = (scriptId: string) => {
    const approvalKey = `${cerId}_${scriptId}`;
    return approvedVersions[approvalKey] || null;
  };

  // Helper function to get actual test script ID from internal script ID
  const getActualTestScriptId = (scriptId: string) => {
    const currentCerId = cerId;

    // Map internal script IDs to actual test script IDs for this CER

    return scriptMap[currentCerId]?.[scriptId];
  };

  // Helper function to determine evidence status
  const getEvidenceStatus = (scriptId: string) => {
    // Get the current CER context and find the corresponding test script ID
    const currentCerId = cerId;
    const actualTestScriptId = scriptMap[currentCerId]?.[scriptId];

    // If this specific test script hasn't been processed by the agent, show not analyzed
    if (!processedTestScripts.has(scriptId)) {
      return {
        status: "not-analyzed",
        label: "Not Analyzed",
        emoji: "⬜",
        badgeColor: "bg-gray-100 text-gray-700 border-gray-200"
      };
    }

    // Check if there's a corresponding shared test script and get its status
    const sharedScript = actualTestScriptId ?
      sharedTestScripts.find(script => script.testScriptId === actualTestScriptId && script.cerId === currentCerId) : null;

    // Check if this script has been approved
    const approvalKey = `${cerId}_${scriptId}`;
    const isApproved = approvedVersions[approvalKey];

    if (isApproved) {
      return {
        status: "approved",
        label: "Approved",
        emoji: "✅",
        badgeColor: "bg-green-100 text-green-700 border-green-200"
      };
    }

    if (sharedScript) {
      // If there's a shared script, determine status based on its current state
      switch (sharedScript.status) {
        case "Action Item Issued":
          return {
            status: "evidence-requested",
            label: "Evidence Requested",
            emoji: "📋",
            badgeColor: "bg-amber-100 text-amber-700 border-amber-200"
          };
        case "Action Item Responded":
          return {
            status: "evidence-re-uploaded",
            label: "Evidence Re-uploaded",
            emoji: "📤",
            badgeColor: "bg-green-100 text-green-700 border-green-200"
          };
        default:
          // For COQ statuses, show evidence analysed (initial state after agent run)
          return {
            status: "evidence-analysed",
            label: "Evidence Analysed",
            emoji: "📊",
            badgeColor: "bg-blue-100 text-blue-700 border-blue-200"
          };
      }
    }

    // Default state after agent runs (no shared script found = evidence analysed)
    return {
      status: "evidence-analysed",
      label: "Evidence Analysed",
      emoji: "📊",
      badgeColor: "bg-blue-100 text-blue-700 border-blue-200"
    };
  };

  const renderTableView = () => (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-max">
          <thead>
            <tr className="border-b border-gray-200">
              {/* Fixed columns */}
              <th className="text-left py-3 px-6 font-medium text-sm w-12 min-w-12 bg-gray-50 sticky left-0 z-20 border-r border-gray-200">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked: any) => handleSelectAll(checked as boolean)}
                />
              </th>
              <th className="text-left py-3 px-6 font-medium text-sm w-32 min-w-32 bg-gray-50 sticky left-12 z-20 border-r border-gray-200">
                <div
                  className="cursor-pointer hover:bg-gray-100 select-none p-1 rounded flex items-center space-x-1"
                  onClick={() => handleSort("title")}
                >
                  <span>Test Script ID</span>
                  {sortBy === "title" && (
                    sortOrder === "asc" ?
                      <ChevronUp className="h-3 w-3" /> :
                      <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </th>

              {/* Scrollable columns */}
              <th className="text-left py-3 px-6 font-medium text-sm w-80 min-w-80 bg-gray-50">
                Third Party Requirements
              </th>
              <th className="text-left py-3 px-6 font-medium text-sm w-80 min-w-80 bg-gray-50">
                Test Scripts
              </th>
              <th className="text-left py-3 px-6 font-medium text-sm w-36 min-w-36 bg-gray-50">
                <div
                  className="cursor-pointer hover:bg-gray-100 select-none p-1 rounded flex items-center space-x-1"
                  onClick={() => handleSort("disposition")}
                >
                  <span>Disposition</span>
                  {sortBy === "disposition" && (
                    sortOrder === "asc" ?
                      <ChevronUp className="h-3 w-3" /> :
                      <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="text-left py-3 px-6 font-medium text-sm w-40 min-w-40 bg-gray-50">
                Evidence Status
              </th>
              <th className="text-left py-3 px-6 font-medium text-sm w-80 min-w-80 bg-gray-50">
                AI Insights Summary
              </th>
              <th className="text-left py-3 px-6 font-medium text-sm w-32 min-w-32 bg-gray-50">
                <div
                  className="cursor-pointer hover:bg-gray-100 select-none p-1 rounded flex items-center space-x-1"
                  onClick={() => handleSort("confidence")}
                >
                  <span>Confidence</span>
                  {sortBy === "confidence" && (
                    sortOrder === "asc" ?
                      <ChevronUp className="h-3 w-3" /> :
                      <ChevronDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="text-left py-3 px-6 font-medium text-sm w-64 min-w-64 bg-gray-50">
                Final Conclusion
              </th>
              <th className="text-left py-3 px-6 font-medium text-sm w-20 min-w-20 bg-gray-50">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedScripts.map((script) => {
              const updatedScript = scriptUpdates[script.id] ? {
                ...script,
                ...scriptUpdates[script.id]
              } : script;

              return (
                <tr key={script.id} className="border-b border-gray-100 align-top">
                  {/* Fixed columns */}
                  <td className="py-4 px-6 w-12 min-w-12 bg-white sticky left-0 z-10 border-r border-gray-200">
                    <Checkbox
                      checked={selectedTestScripts.includes(script.id)}
                      onCheckedChange={(checked: any) => handleTestScriptSelection(script.id, checked as boolean)}
                    />
                  </td>
                  <td className="py-4 px-6 w-32 min-w-32 bg-white sticky left-12 z-10 border-r border-gray-200">
                    <div className="font-medium text-sm">{updatedScript.title}</div>
                  </td>

                  {/* Scrollable columns */}
                  <td className="py-4 px-6 w-80 min-w-80">
                    <p className="text-sm text-gray-700 leading-5">
                      {updatedScript.thirdPartyRequirements}
                    </p>
                  </td>
                  <td className="py-4 px-6 w-80 min-w-80">
                    <p className="text-sm text-gray-700 leading-5">
                      {updatedScript.testScripts}
                    </p>
                  </td>
                  <td className="py-4 px-6 w-36 min-w-36">
                    {processedTestScripts.has(script.id) && updatedScript.disposition ? (
                      <Badge className={`${getDispositionColor(updatedScript.disposition)} text-xs whitespace-nowrap`}>
                        {updatedScript.disposition}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        {processedTestScripts.has(script.id) ? "-" : "Run agent to generate - Disposition"}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 w-40 min-w-40">
                    {(() => {
                      const evidenceStatus = getEvidenceStatus(updatedScript.id);
                      const actualTestScriptId = getActualTestScriptId(updatedScript.id);
                      const sharedScript = sharedTestScripts.find(script =>
                        script.testScriptId === actualTestScriptId && script.cerId === cerId
                      );

                      // Check if there are multiple reupload requests for this test script
                      const reuploadRequests = sharedScript?.reuploadRequests || [];
                      const hasMultipleRequests = reuploadRequests.length > 1;

                      return (
                        <div className="flex items-center gap-2">
                          <Badge className={`${evidenceStatus.badgeColor} text-xs whitespace-nowrap`}>
                            {evidenceStatus.label}
                          </Badge>
                          {hasMultipleRequests && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-gray-100"
                                    onClick={() => onOpenScript(updatedScript.id)}
                                  >
                                    <Info className="h-3 w-3 text-blue-600" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View all document statuses ({reuploadRequests.length} documents)</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      );
                    })()}
                  </td>
                  <td className="py-4 px-6 w-80 min-w-80">
                    <div>
                      {processedTestScripts.has(script.id) && updatedScript.aiInsightsSummary ? (
                        <div className="flex items-start">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 leading-5 break-words overflow-hidden">
                              {updatedScript.aiInsightsSummary}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center space-x-2 mb-1">
                            <Bot className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400 italic">No AI analysis available</span>
                          </div>
                          <div className="text-xs text-gray-400">Run Agent to generate insights</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 w-32 min-w-32">
                    {processedTestScripts.has(script.id) && updatedScript.confidence ? (
                      <span className="text-sm font-medium text-gray-900">{updatedScript.confidence}%</span>
                    ) : (
                      <span className="text-sm text-gray-400 italic">
                        {processedTestScripts.has(script.id) ? "-" : "Run agent to generate - Confidence"}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 w-64 min-w-64">
                    <div className="flex items-start">
                      <div className="flex-1 min-w-0">
                        {(() => {
                          const approvedVersion = getApprovedVersion(updatedScript.id);

                          if (approvedVersion && approvedVersion.approvedData) {
                            // Show approved version with analysis content
                            return (
                              <div
                                className="cursor-pointer hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors"
                                onClick={() => onOpenScript(updatedScript.id)}
                              >
                                <Badge className="bg-green-100 text-green-800 border-green-300 text-xs mb-2">
                                  Approved {approvedVersion.version}
                                </Badge>
                                <div className="text-xs text-gray-500 mb-2">
                                  {new Date(approvedVersion.timestamp).toLocaleDateString()} {new Date(approvedVersion.timestamp).toLocaleTimeString()}
                                </div>
                                {/* Display key insights from approved analysis */}
                                {approvedVersion.approvedData.content?.generatedInsight && (
                                  <div className="text-sm text-gray-700 leading-5 break-words overflow-hidden line-clamp-3">
                                    {approvedVersion.approvedData.content.generatedInsight.replace(/\[.*?\]/g, '')}
                                  </div>
                                )}
                                <div className="text-xs text-gray-400 mt-1">
                                  Click to view all versions
                                </div>
                              </div>
                            );
                          } else if (approvedVersion) {
                            // Fallback for legacy approved versions without data
                            return (
                              <div
                                className="cursor-pointer hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors"
                                onClick={() => onOpenScript(updatedScript.id)}
                              >
                                <Badge className="bg-green-100 text-green-800 border-green-300 text-xs mb-2">
                                  Approved {approvedVersion.version}
                                </Badge>
                                <div className="text-xs text-gray-500">
                                  {new Date(approvedVersion.timestamp).toLocaleDateString()} {new Date(approvedVersion.timestamp).toLocaleTimeString()}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
                                  Click to view all versions
                                </div>
                              </div>
                            );
                          } else if (processedTestScripts.has(script.id) && updatedScript.humanInsightsSummary) {
                            // Show human insights if available
                            return (
                              <div
                                className="cursor-pointer hover:bg-gray-50 rounded-md p-2 -m-2 transition-colors"
                                onClick={() => onOpenScript(updatedScript.id)}
                              >
                                <p className="text-sm text-gray-700 leading-5 break-words overflow-hidden">
                                  {updatedScript.humanInsightsSummary}
                                </p>
                              </div>
                            );
                          } else if (processedTestScripts.has(script.id)) {
                            // Show placeholder for adding conclusions
                            return (
                              <div
                                className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                onClick={() => onOpenScript(updatedScript.id)}
                              >
                                <span className="text-sm text-gray-400 italic">
                                  No conclusions available
                                </span>
                                <div className="text-xs text-gray-400 mt-1">
                                  Click to add final conclusions
                                </div>
                              </div>
                            );
                          } else {
                            // Agent hasn't run on this specific test script yet
                            return (
                              <div className="p-3 text-center border border-dashed border-gray-300 rounded">
                                <span className="text-sm text-gray-400 italic">
                                  No conclusions available
                                </span>
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 w-20 min-w-20">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => processedTestScripts.has(script.id) ? onOpenScript(updatedScript.id) : undefined}
                      className={`p-1.5 ${!processedTestScripts.has(script.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!processedTestScripts.has(script.id)}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredAndSortedScripts.map((script) => {
        const updatedScript = scriptUpdates[script.id] ? {
          ...script,
          ...scriptUpdates[script.id]
        } : script;

        return (
          <TestScriptCard
            key={script.id}
            testScript={updatedScript}
            onOpenScript={onOpenScript}
            hasAgentRun={processedTestScripts.has(script.id)}
          />
        );
      })}
    </div>
  );



  return (
    <div className="h-full">
      {/* Main Content - Full Width */}
      <div className="h-full bg-gray-50 flex flex-col">
        {/* Hero Section with Prominent Confidence */}
        <div>
          <div className="pl-10 pr-6 py-8">
            {/* Main Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{cerId}</h1>
                  <Badge className={getRiskLevelColor(vendorData.riskLevel)}>
                    {vendorData.riskLevel} Risk
                  </Badge>
                </div>
                <p className="text-xl text-gray-700 mb-1">{vendorData.vendor}</p>

              </div>

              {/* Run Agent Button - Always Available */}
              <div className="text-right">
                {onRunAgent && (
                  <div className="text-right">
                    <Button
                      onClick={handleRunAgentForSelectedScripts}
                      disabled={isAgentRunning || isLoadingThisCER}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base"
                    >
                      {isLoadingThisCER ? (
                        <>
                          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Bot className="h-5 w-5 mr-2" />
                          {selectedTestScripts.length > 0
                            ? `Run Agent on Selected (${selectedTestScripts.length})`
                            : "Run Agent"
                          }
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>



        {/* Test Scripts Section - Scrollable */}
        <div className="flex-1 overflow-auto pl-10 pr-6 py-6 min-h-0 bg-white border-t border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">Test Scripts</h2>
              <p className="text-gray-600">
                {filteredAndSortedScripts.length} of {testScripts.length} test scripts
                {selectedTestScripts.length > 0 && (
                  <span className="ml-2 text-blue-600">
                    · {selectedTestScripts.length} selected
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center flex-wrap gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search test scripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex items-center space-x-3">
                <Select value={dispositionFilter} onValueChange={setDispositionFilter} disabled={!hasAgentRun}>
                  <SelectTrigger className="w-40 h-9 text-sm">
                    <SelectValue placeholder="Disposition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dispositions</SelectItem>
                    <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                    <SelectItem value="Partially Satisfactory">Partially Satisfactory</SelectItem>
                    <SelectItem value="Not Satisfactory">Not Satisfactory</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={confidenceFilter}
                  onValueChange={setConfidenceFilter}
                  disabled={!hasAgentRun}
                >
                  <SelectTrigger className={`w-40 h-9 text-sm ${!hasAgentRun ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <SelectValue placeholder="Confidence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Confidence</SelectItem>
                    <SelectItem value="high">High (≥85%)</SelectItem>
                    <SelectItem value="medium">Medium (60-84%)</SelectItem>
                    <SelectItem value="low">Low (Under 60%)</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllFilters}
                    className="px-3 py-1.5 text-gray-600 hover:text-gray-800 h-9"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3 py-1.5"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="px-3 py-1.5"
                >
                  <TableIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full">
            {viewMode === "grid" ? renderGridView() : renderTableView()}
          </div>
        </div>
      </div>

    </div>
  );
}