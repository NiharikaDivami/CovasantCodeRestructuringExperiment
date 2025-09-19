import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";
import { ArrowLeft, Grid3X3, Table as TableIcon, ExternalLink, ChevronUp, ChevronDown, X, Info, Bot, User, RefreshCw, Search, Clock } from "lucide-react";
import TestScriptCard from "../TestScriptCard/TestScriptCard";
import ConfidenceBadge from "../ConfidenceBadge";
import ActivityLog from "../ActivityLog";
import AgentLoaderView from "../AgentLoaderView";
import { CERDetailViewUpdatedProps, TestScriptUpdated, VendorData } from "./types";
import {
  VIEW_MODES,
  SORT_OPTIONS,
  SORT_ORDERS,
  FILTER_OPTIONS,
  CONFIDENCE_THRESHOLDS,
  RISK_LEVELS,
  VENDOR_DATA_MAP
} from "./constants";
import "./styles.css";

export default function CERDetailViewUpdated({ cerId, onBack, onOpenScript, scriptUpdates = {}, hasAgentRun = false, approvedVersions = {}, onRunAgent, isAgentRunning, isLoadingThisCER, sharedTestScripts = [], processedTestScripts = new Set() }: CERDetailViewUpdatedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dispositionFilter, setDispositionFilter] = useState("all");
  const [confidenceFilter, setConfidenceFilter] = useState("all");

  const [viewMode, setViewMode] = useState<"grid" | "table">("table");
  const [sortBy, setSortBy] = useState<"title" | "disposition" | "confidence">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // State for collapsible activity log
  const [isActivityLogExpanded, setIsActivityLogExpanded] = useState(true);

  // State for selected test scripts
  const [selectedTestScripts, setSelectedTestScripts] = useState<string[]>([]);

  // Generate test script data based on current CER - enhanced version with placeholders
  const generateTestScriptData = (): TestScriptUpdated[] => {
    // CER-specific test script mappings with unique IDs per CER
    const scriptDataByCER: Record<string, Array<any>> = {
      "CER-10234": [
        {
          id: "ts-1",
          title: "TS-324472",
          name: "Review Expense Report Controls",
          control: "CTRL-00234-EXP",
          controlName: "Expense Report Validation",
          risk: "medium",
          status: "finished",
          confidence: 87,
          disposition: "Satisfactory",
          confidenceStatus: "finished",
          thirdPartyRequirements: "Expense reporting process must include manager approval for expenses over $500 with proper documentation and business justification.",
          testScripts: "Verify expense reports contain manager signatures, receipt attachments, and business justification for all expenses exceeding $500 threshold.",
          aiInsightsSummary: "Control operates effectively with consistent manager approval process and adequate documentation requirements for expense validation.",
          humanInsightsSummary: "",
          description: "The expense reporting process requires manager approval for expenses over $500 and proper documentation for all business-related expenditures.",
          expectedEvidence: "Expense reports with manager signatures, receipt attachments, and business justification for expenses exceeding $500."
        },
        {
          id: "ts-2",
          title: "TS-324473",
          name: "Verify Purchase Order Authorization",
          control: "CTRL-00234-PUR",
          controlName: "Purchase Order Controls",
          risk: "high",
          status: "finished",
          confidence: 92,
          disposition: "Satisfactory",
          confidenceStatus: "finished",
          thirdPartyRequirements: "All purchase orders require dual authorization for amounts exceeding $1,000 and must be approved by department heads.",
          testScripts: "Review purchase order approval process to ensure dual signatures exist for orders over $1,000 and verify department head approval authority.",
          aiInsightsSummary: "Strong segregation of duties maintained with effective dual authorization controls for high-value purchase orders.",
          humanInsightsSummary: "",
          description: "All purchase orders require dual authorization for amounts exceeding $1,000 and must be approved by department heads.",
          expectedEvidence: "Purchase orders with dual signatures, department head approvals, and vendor verification for orders over $1,000."
        },
        {
          id: "ts-3",
          title: "TS-324474",
          name: "Test Invoice Processing Controls",
          control: "CTRL-00234-INV",
          controlName: "Invoice Verification Process",
          risk: "medium",
          status: "finished",
          confidence: 79,
          disposition: "Partially Satisfactory",
          confidenceStatus: "finished",
          thirdPartyRequirements: "Invoice processing requires three-way matching (invoice, purchase order, receipt) and approval by authorized personnel.",
          testScripts: "Test three-way matching process by selecting sample invoices and verifying matching to purchase orders and receipts with proper approvals.",
          aiInsightsSummary: "Three-way matching process generally effective but some exceptions noted in automated matching system validation.",
          humanInsightsSummary: "",
          description: "Invoice processing requires three-way matching (invoice, purchase order, receipt) and approval by authorized personnel.",
          expectedEvidence: "Invoices with matching purchase orders and receipts, authorized approver signatures, and payment processing documentation."
        },
        {
          id: "ts-4",
          title: "TS-324475",
          name: "Review Travel Expense Controls",
          control: "CTRL-00234-TRV",
          controlName: "Travel Expense Validation",
          risk: "low",
          status: "finished",
          confidence: 85,
          disposition: "Satisfactory",
          confidenceStatus: "finished",
          thirdPartyRequirements: "Travel expense controls require pre-approval for business trips exceeding $1,000 with detailed itinerary and business justification.",
          testScripts: "Test travel expense controls including pre-approval workflows, itinerary validation, and business justification review processes.",
          aiInsightsSummary: "Travel expense controls operate effectively with comprehensive pre-approval process and adequate documentation requirements.",
          humanInsightsSummary: "",
          description: "Travel expense controls require pre-approval for business trips exceeding $1,000 with detailed itinerary and business justification.",
          expectedEvidence: "Travel expense pre-approval documentation, detailed itineraries, and business justification for trips exceeding $1,000."
        },
        {
          id: "ts-5",
          title: "TS-324476",
          name: "Test Credit Card Reconciliation",
          control: "CTRL-00234-CCR",
          controlName: "Credit Card Reconciliation Process",
          risk: "medium",
          status: "finished",
          confidence: 88,
          disposition: "Satisfactory",
          confidenceStatus: "finished",
          thirdPartyRequirements: "Credit card reconciliation requires monthly statements with supporting receipts and management review of all corporate card transactions.",
          testScripts: "Review credit card reconciliation process including monthly statement verification, receipt matching, and management oversight procedures.",
          aiInsightsSummary: "Credit card reconciliation controls are well-implemented with consistent monthly reviews and proper receipt matching procedures.",
          humanInsightsSummary: "",
          description: "Credit card reconciliation requires monthly statements with supporting receipts and management review of all corporate card transactions.",
          expectedEvidence: "Credit card reconciliation documentation, monthly statements with matched receipts, and management review records."
        },
        {
          id: "ts-6",
          title: "TS-324477",
          name: "Review Vendor Payment Controls",
          control: "CTRL-00234-VEN",
          controlName: "Vendor Payment Authorization",
          risk: "high",
          status: "finished",
          confidence: 90,
          disposition: "Satisfactory",
          confidenceStatus: "finished",
          thirdPartyRequirements: "Vendor payment controls require three-way matching with purchase orders, invoices, and receiving reports before payment authorization.",
          testScripts: "Test vendor payment controls including three-way matching procedures and payment authorization workflows.",
          aiInsightsSummary: "Vendor payment controls demonstrate strong segregation of duties with effective three-way matching and proper authorization workflows.",
          humanInsightsSummary: "",
          description: "Vendor payment controls require three-way matching with purchase orders, invoices, and receiving reports before payment authorization.",
          expectedEvidence: "Vendor payment documentation including three-way matching evidence and payment authorization records."
        }
      ],
      "CER-10567": [
        {
          id: "ts-1",
          title: "TS-325001",
          name: "Review Revenue Recognition Controls",
          control: "CTRL-00567-REV",
          controlName: "Revenue Recognition Process",
          risk: "high",
          status: "finished",
          confidence: 91,
          disposition: "Satisfactory",
          confidenceStatus: "finished",
          thirdPartyRequirements: "Revenue recognition follows GAAP principles with quarterly review by senior accounting staff and external auditor validation.",
          testScripts: "Test revenue recognition methodology against GAAP standards and verify quarterly senior accounting review and external auditor validation.",
          aiInsightsSummary: "Revenue recognition controls align with GAAP requirements and include appropriate review and validation procedures.",
          humanInsightsSummary: "",
          description: "Revenue recognition follows GAAP principles with quarterly review by senior accounting staff and external auditor validation.",
          expectedEvidence: "Revenue recognition journals, quarterly review documentation, and external auditor confirmations."
        },
        {
          id: "ts-2",
          title: "TS-325002",
          name: "Test Contract Management Controls",
          control: "CTRL-00567-CON",
          controlName: "Contract Approval Process",
          risk: "medium",
          status: "finished",
          confidence: 76,
          disposition: "Partially Satisfactory",
          confidenceStatus: "finished",
          thirdPartyRequirements: "All contracts require legal review and C-level approval for agreements exceeding $100,000 or multi-year commitments.",
          testScripts: "Review contract approval workflow to ensure legal review and C-level approval for contracts over $100,000 or multi-year terms.",
          aiInsightsSummary: "Contract approval process generally effective but some gaps identified in legal review documentation for smaller agreements.",
          humanInsightsSummary: "",
          description: "All contracts require legal review and C-level approval for agreements exceeding $100,000 or multi-year commitments.",
          expectedEvidence: "Contracts with legal review stamps, C-level signatures, and contract registry maintenance records."
        }
      ],
      "CER-10892": [
        {
          id: "ts-1",
          title: "TS-326001",
          name: "Review IT Security Controls",
          control: "CTRL-00892-SEC",
          controlName: "Information Security Framework",
          risk: "high",
          status: "finished",
          confidence: 86,
          disposition: "Satisfactory",
          confidenceStatus: "finished",
          thirdPartyRequirements: "Multi-factor authentication required for all financial systems with quarterly security assessments and incident response procedures.",
          testScripts: "Verify MFA implementation across financial systems, review quarterly security assessment procedures, and test incident response protocols.",
          aiInsightsSummary: "Strong information security controls with comprehensive MFA deployment and effective incident response capabilities.",
          humanInsightsSummary: "",
          description: "Multi-factor authentication required for all financial systems with quarterly security assessments and incident response procedures.",
          expectedEvidence: "MFA implementation logs, quarterly security assessment reports, and incident response documentation."
        },
        {
          id: "ts-2",
          title: "TS-326002",
          name: "Test Data Backup Controls",
          control: "CTRL-00892-BAK",
          controlName: "Data Backup and Recovery",
          risk: "medium",
          status: "finished",
          confidence: 81,
          disposition: "Satisfactory",
          confidenceStatus: "finished",
          thirdPartyRequirements: "Daily automated backups with monthly recovery testing and offsite storage verification for critical financial data.",
          testScripts: "Test daily backup automation, verify monthly recovery testing procedures, and confirm offsite storage validation processes.",
          aiInsightsSummary: "Data backup and recovery controls are well-established with regular testing and appropriate offsite storage verification.",
          humanInsightsSummary: "",
          description: "Daily automated backups with monthly recovery testing and offsite storage verification for critical financial data.",
          expectedEvidence: "Backup completion logs, monthly recovery test results, and offsite storage confirmation records."
        }
      ]
    };

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

  const testScripts = generateTestScriptData();

  // Get vendor data for the CER
  const getVendorData = (id: string): VendorData => {
    return VENDOR_DATA_MAP[id as keyof typeof VENDOR_DATA_MAP] || {
      vendor: "Unknown",
      riskLevel: "Medium",
      confidence: 50,
      status: "not-started"
    };
  };

  const vendorData = getVendorData(cerId);

  // Filter and sort test scripts (same logic as original)
  const filteredAndSortedTestScripts = testScripts
    .filter(script => {
      const matchesSearch = searchQuery === "" ||
        script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        script.control.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDisposition = dispositionFilter === "all" || script.disposition === dispositionFilter;
      const matchesConfidence = confidenceFilter === "all" ||
        (script.confidence !== null && (
          (confidenceFilter === "high" && script.confidence >= CONFIDENCE_THRESHOLDS.HIGH) ||
          (confidenceFilter === "medium" && script.confidence >= CONFIDENCE_THRESHOLDS.MEDIUM && script.confidence < CONFIDENCE_THRESHOLDS.HIGH) ||
          (confidenceFilter === "low" && script.confidence < CONFIDENCE_THRESHOLDS.MEDIUM)
        ));

      return matchesSearch && matchesDisposition && matchesConfidence;
    })
    .sort((a, b) => {
      let compareValue = 0;

      if (sortBy === "title") {
        compareValue = a.title.localeCompare(b.title);
      } else if (sortBy === "disposition") {
        const aDisp = a.disposition || "Unknown";
        const bDisp = b.disposition || "Unknown";
        compareValue = aDisp.localeCompare(bDisp);
      } else if (sortBy === "confidence") {
        const aConf = a.confidence || 0;
        const bConf = b.confidence || 0;
        compareValue = aConf - bConf;
      }

      return sortOrder === "asc" ? compareValue : -compareValue;
    });

  // Handle test script selection (same as original)
  const handleTestScriptSelection = (scriptId: string, checked: boolean) => {
    if (checked) {
      setSelectedTestScripts(prev => [...prev, scriptId]);
    } else {
      setSelectedTestScripts(prev => prev.filter(id => id !== scriptId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTestScripts(filteredAndSortedTestScripts.map(script => script.id));
    } else {
      setSelectedTestScripts([]);
    }
  };

  const handleRunSelectedAgent = () => {
    if (onRunAgent && selectedTestScripts.length > 0) {
      onRunAgent(cerId, selectedTestScripts);
    }
  };

  // Render placeholder for unprocessed data
  const renderPlaceholder = (width: string = "100%") => (
    <div className="unprocessed-placeholder" style={{ width }} />
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedTestScripts.map((script) => (
        <div key={script.id} className={`test-script-card-updated ${processedTestScripts.has(script.id) ? 'processed' : 'unprocessed'}`}>
          <TestScriptCard
            script={script}
            onClick={() => onOpenScript(script.id)}
            scriptUpdates={scriptUpdates[script.id]}
            hasAgentRun={processedTestScripts.has(script.id)}
            approvedVersions={approvedVersions}
            cerId={cerId}
          />
        </div>
      ))}
    </div>
  );

  const renderTableView = () => (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto cer-detail-scroll">
        <table className="w-full border-collapse min-w-[900px]">
          <thead className="border-b bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="text-left px-4 py-3 w-12">
                <Checkbox
                  checked={selectedTestScripts.length === filteredAndSortedTestScripts.length && filteredAndSortedTestScripts.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                Test Script ID
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Control Name
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[140px]">
                Disposition
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Confidence
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                Risk Level
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAndSortedTestScripts.map((script) => (
              <tr
                key={script.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onOpenScript(script.id)}
              >
                <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedTestScripts.includes(script.id)}
                    onCheckedChange={(checked) => handleTestScriptSelection(script.id, checked as boolean)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">{script.title}</span>
                    {processedTestScripts.has(script.id) && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Bot className="h-4 w-4 text-blue-600" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Agent has analyzed this test script</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-gray-900 font-medium">{script.controlName}</div>
                  <div className="text-gray-500 text-sm">{script.control}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {script.disposition ? (
                    <Badge variant={
                      script.disposition === "Satisfactory" ? "default" :
                        script.disposition === "Partially Satisfactory" ? "secondary" :
                          script.disposition === "Not Satisfactory" ? "destructive" : "outline"
                    }>
                      {script.disposition}
                    </Badge>
                  ) : (
                    renderPlaceholder("80px")
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {script.confidence !== null ? (
                    <div className="confidence-indicator-updated">
                      <ConfidenceBadge
                        confidence={script.confidence}
                        status={script.confidenceStatus}
                        tooltip={script.tooltip}
                      />
                    </div>
                  ) : (
                    renderPlaceholder("60px")
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={
                    script.risk === "high" ? "text-red-600 font-medium" :
                      script.risk === "medium" ? "text-amber-600 font-medium" :
                        "text-green-600 font-medium"
                  }>
                    {script.risk.charAt(0).toUpperCase() + script.risk.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenScript(script.id);
                          }}
                          className="p-1.5 hover:bg-gray-100"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Open Test Script Details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isLoadingThisCER) {
    return <AgentLoaderView />;
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 pl-10 pr-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{cerId} - {vendorData.vendor}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Showing {filteredAndSortedTestScripts.length} of {testScripts.length} test scripts
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {selectedTestScripts.length > 0 && (
              <Button
                onClick={handleRunSelectedAgent}
                disabled={isAgentRunning}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isAgentRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running Agent...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    Run Agent ({selectedTestScripts.length})
                  </>
                )}
              </Button>
            )}

            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === VIEW_MODES.GRID ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(VIEW_MODES.GRID)}
                className="px-3 py-1.5 h-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === VIEW_MODES.TABLE ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode(VIEW_MODES.TABLE)}
                className="px-3 py-1.5 h-8"
              >
                <TableIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select value={dispositionFilter} onValueChange={setDispositionFilter}>
              <SelectTrigger className="w-48 h-9 text-sm">
                <SelectValue placeholder="All Dispositions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dispositions</SelectItem>
                <SelectItem value="Satisfactory">Satisfactory</SelectItem>
                <SelectItem value="Partially Satisfactory">Partially Satisfactory</SelectItem>
                <SelectItem value="Not Satisfactory">Not Satisfactory</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
              </SelectContent>
            </Select>

            <Select value={confidenceFilter} onValueChange={setConfidenceFilter}>
              <SelectTrigger className="w-40 h-9 text-sm">
                <SelectValue placeholder="All Confidence" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Confidence</SelectItem>
                <SelectItem value="high">High (≥85%)</SelectItem>
                <SelectItem value="medium">Medium (60-84%)</SelectItem>
                <SelectItem value="low">Low (<60%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Bar */}
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search test scripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-9 text-sm bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full pl-10 pr-6 py-6 space-y-6">
          {/* Enhanced Vendor Info Card */}
          <div className="vendor-info-card">
            <h2>Vendor: {vendorData.vendor}</h2>
            <div className="flex items-center space-x-4 text-sm opacity-90">
              <span>Risk Level: {vendorData.riskLevel}</span>
              <span>•</span>
              <span>Confidence: {vendorData.confidence}%</span>
              {vendorData.previousConfidence && (
                <>
                  <span>•</span>
                  <span>Previous: {vendorData.previousConfidence}%</span>
                </>
              )}
            </div>
          </div>

          {/* Activity Log Section */}
          <Card className="bg-white">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setIsActivityLogExpanded(!isActivityLogExpanded)}
            >
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">Recent Activity</h3>
              </div>
              {isActivityLogExpanded ?
                <ChevronUp className="h-4 w-4 text-gray-600" /> :
                <ChevronDown className="h-4 w-4 text-gray-600" />
              }
            </div>
            {isActivityLogExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <ActivityLog cerId={cerId} />
              </div>
            )}
          </Card>

          {/* Test Scripts */}
          {filteredAndSortedTestScripts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No test scripts found</div>
              <div className="text-gray-500 text-sm">Try adjusting your search or filter criteria</div>
            </div>
          ) : (
            <div className="progressive-reveal">
              {viewMode === VIEW_MODES.GRID ? renderGridView() : renderTableView()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}