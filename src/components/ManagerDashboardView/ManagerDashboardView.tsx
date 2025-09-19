import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { filterMultipliers, vendorCERMapping, getTimeSeriesData,logos  } from "./constants";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Cell } from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpDown,
  Activity,
  Users,
  Brain,
  Target,
  BarChart3,
  Eye,
  ChevronRight,
  ArrowUp,
  ExternalLink,
  Search,
  // AlertTriangle,
  // Calendar,
  // Shield,
  // Plus,
  // MoreHorizontal,
  // Clock,
  // PieChart,
  // Filter,
  // ArrowLeft,
  // FileText,
  // CheckCircle,
  // XCircle,
  // CircleDot,
  // Timer,
  // Zap,
  // AlertCircle,
  // TrendingUpIcon,
  // Construction,
  // UserCheck
} from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
// import { ScrollArea } from "./ui/scroll-area";
// import { Progress } from "./ui/progress";

interface ManagerDashboardViewProps {
  onNavigateToVendor?: () => void;
  onViewChange?: (view: string) => void;
  currentView?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}



export default function ManagerDashboardView({
  // onNavigateToVendor, 
  onViewChange,
  currentView: externalCurrentView,
  searchQuery: externalSearchQuery = "",
  onSearchChange
}: ManagerDashboardViewProps) {
  const [timePeriod, _setTimePeriod] = useState("last3Years");
  const [vendorViewMode, setVendorViewMode] = useState<"table" | "chart">("table");
  const [analystViewMode, setAnalystViewMode] = useState<"table" | "chart">("table");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "vendor-analysis" | "analyst-analysis">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [vendorSortType, setVendorSortType] = useState<"top5" | "low5">("top5");
  const [analystSortType, setAnalystSortType] = useState<"top5" | "low5">("top5");
  const [riskLevelFilter, setRiskLevelFilter] = useState("all");
  const [pipelineRiskFilter, setPipelineRiskFilter] = useState("all");

  // Use external state if provided
  const activeCurrentView = externalCurrentView || currentView;
  const activeSearchQuery = externalSearchQuery || searchQuery;
  const handleSearchChange = onSearchChange || setSearchQuery;
  const handleViewChange = (view: "dashboard" | "vendor-analysis" | "analyst-analysis") => {
    // Clear search when returning to main dashboard
    if (view === "dashboard") {
      handleSearchChange("");
    }

    if (onViewChange) {
      onViewChange(view);
    } else {
      setCurrentView(view);
    }
  };
  // const _scrollAreaRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target && target.scrollTop > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    let scrollViewport: Element | null = null;
    let cleanup: (() => void) | undefined;

    const setupScrollListener = () => {
      // Find the scroll viewport - ScrollArea creates a viewport element
      scrollViewport = document.querySelector('[data-radix-scroll-area-viewport]');

      if (scrollViewport) {
        scrollViewport.addEventListener('scroll', handleScroll);
        cleanup = () => scrollViewport?.removeEventListener('scroll', handleScroll);
      }
    };

    // Simple setup with a single delay
    const timeoutId = setTimeout(setupScrollListener, 100);

    return () => {
      cleanup?.();
      clearTimeout(timeoutId);
    };
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    const viewport = document.querySelector('[data-radix-scroll-area-viewport]');

    if (viewport) {
      viewport.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  // Enhanced KPI Data with detailed metrics - calculated from actual data
  const kpiData = (() => {
    const totalCERs = vendorCERMapping.length;
    const totalTestScripts = vendorCERMapping.reduce((sum, mapping) => sum + mapping.testScriptCount, 0);
    // const totalAnalysts = 8; // Exact count from our analyst mapping

    // Calculate actual metrics from vendor data
    const criticalCERS = vendorCERMapping.filter(v => v.riskLevel === "Critical").length;
    const highCERS = vendorCERMapping.filter(v => v.riskLevel === "High").length;
    const mediumCERS = vendorCERMapping.filter(v => v.riskLevel === "Medium").length;
    const lowCERS = vendorCERMapping.filter(v => v.riskLevel === "Low").length;

    return [
      {
        title: "CER's Overview",
        value: totalCERs.toString(),
        subValue: "Active CERs",
        trend: "+15%",
        isPositive: true,
        icon: <Activity className="h-6 w-6" />,
        color: "blue",
        description: "Total Control Effectiveness Reviews in progress",
        details: [
          { label: "Critical Risk", value: criticalCERS.toString(), color: "text-red-600" },
          { label: "High Risk", value: highCERS.toString(), color: "text-orange-600" },
          { label: "Medium Risk", value: mediumCERS.toString(), color: "text-amber-600" },
          { label: "Low Risk", value: lowCERS.toString(), color: "text-green-600" },
          { label: "Total Test Scripts", value: totalTestScripts.toString(), color: "text-gray-600" }
        ]
      },
      {
        title: "Vendor Response Optimization",
        value: "92%",
        subValue: "Response Rate",
        trend: "+8%",
        isPositive: true,
        icon: <TrendingUp className="h-6 w-6" />,
        color: "green",
        description: "Average vendor response time and quality optimization",
        details: [
          { label: "Avg Response Time", value: "2.8 days", color: "text-green-600" },
          { label: "Quality Score", value: "4.6/5", color: "text-green-600" },
          { label: "First Pass Rate", value: "85%", color: "text-blue-600" },
          { label: "Doc Acceptance", value: "88%", color: "text-green-600" }
        ]
      },
      {
        title: "Resource Utilization",
        value: "89%",
        subValue: "Efficiency Rate",
        trend: "+7%",
        isPositive: true,
        icon: <Target className="h-6 w-6" />,
        color: "purple",
        description: "Analyst workload distribution and resource allocation",
        details: [
          { label: "Active Analysts", value: "5", color: "text-purple-600" },
          { label: "Response Time", value: "4.2 hrs", color: "text-purple-600" },
          { label: "Jacob Corman", value: "12 CERs", color: "text-blue-600" },
          { label: "Other Analysts", value: "8 CERs", color: "text-purple-600" }
        ]
      }
    ];
  })();

  // Time series data for practice effectiveness - 4 quarters only
  // Updated with actual data from vendorCERMapping for consistency
  const timeSeriesData = getTimeSeriesData(vendorCERMapping, riskLevelFilter);

  // Enhanced Vendor Performance Data with 20 vendors - matches exact CER mapping
  const vendorPerformanceData = vendorCERMapping.map((mapping, index) => {
    // Generate consistent performance metrics based on risk level
    const getPerformanceByRisk = (riskLevel: string) => {
      switch (riskLevel) {
        case "Critical":
          return { compliance: 85 + Math.floor(Math.random() * 10), docAccept: 80 + Math.floor(Math.random() * 15), responseTime: "3.5", closureTime: "4.2" };
        case "High":
          return { compliance: 88 + Math.floor(Math.random() * 8), docAccept: 85 + Math.floor(Math.random() * 10), responseTime: "3.2", closureTime: "3.8" };
        case "Medium":
          return { compliance: 90 + Math.floor(Math.random() * 6), docAccept: 88 + Math.floor(Math.random() * 8), responseTime: "2.8", closureTime: "3.2" };
        case "Low":
          return { compliance: 93 + Math.floor(Math.random() * 5), docAccept: 90 + Math.floor(Math.random() * 8), responseTime: "2.2", closureTime: "2.8" };
        default:
          return { compliance: 90, docAccept: 85, responseTime: "3.0", closureTime: "3.5" };
      }
    };

    const performance = getPerformanceByRisk(mapping.riskLevel);

    return {
      id: index + 1,
      name: mapping.vendor,
      logo: logos[index % logos.length],
      complianceAdherence: performance.compliance,
      actionItemClosureTime: `${performance.closureTime} days`,
      documentAcceptanceRate: performance.docAccept,
      riskRating: mapping.riskLevel,
      responseTime: `${performance.responseTime} days`,
      cerCount: 1, // Each vendor has exactly one CER
      cerId: mapping.cerId,
      analyst: mapping.analyst,
      testScriptCount: mapping.testScriptCount
    };
  });

  // Create top 5 and low 5 vendor data based on sorting type
  const getTopVendorData = () => {
    const sortedData = [...vendorPerformanceData].sort((a, b) => {
      // Create composite performance score for sorting
      const scoreA = (a.complianceAdherence + a.documentAcceptanceRate) / 2 - parseFloat(a.responseTime) * 5;
      const scoreB = (b.complianceAdherence + b.documentAcceptanceRate) / 2 - parseFloat(b.responseTime) * 5;

      if (vendorSortType === "top5") {
        return scoreB - scoreA; // Higher scores first (better performance)
      } else {
        return scoreA - scoreB; // Lower scores first (degrading performance)
      }
    });

    return sortedData.slice(0, 5);
  };

  const topVendorData = getTopVendorData();

  // Vendor bar chart data - each metric with all vendors
  const vendorBarChartData = [
    {
      metric: "Compliance",
      ...topVendorData.reduce((acc, vendor, _index) => {
        acc[vendor.name.split(' ')[0]] = vendor.complianceAdherence;
        return acc;
      }, {} as Record<string, number>)
    },
    {
      metric: "Doc Acceptance",
      ...topVendorData.reduce((acc, vendor, _index) => {
        acc[vendor.name.split(' ')[0]] = vendor.documentAcceptanceRate;
        return acc;
      }, {} as Record<string, number>)
    },
    {
      metric: "Response Time",
      ...topVendorData.reduce((acc, vendor, _index) => {
        acc[vendor.name.split(' ')[0]] = 100 - parseFloat(vendor.responseTime) * 20; // Convert to performance score
        return acc;
      }, {} as Record<string, number>)
    },
    {
      metric: "Action Closure",
      ...topVendorData.reduce((acc, vendor, _index) => {
        acc[vendor.name.split(' ')[0]] = 100 - parseFloat(vendor.actionItemClosureTime) * 15; // Convert to performance score
        return acc;
      }, {} as Record<string, number>)
    },
    {
      metric: "Risk Score",
      ...topVendorData.reduce((acc, vendor, _index) => {
        acc[vendor.name.split(' ')[0]] = vendor.riskRating === 'Low' ? 95 : vendor.riskRating === 'Medium' ? 75 : 55;
        return acc;
      }, {} as Record<string, number>)
    }
  ];

  // Enhanced Analyst Performance Data - matches exact CER distribution
  const analystPerformanceData = (() => {
    // Calculate actual CER assignments from vendorCERMapping
    const analystAssignments = vendorCERMapping.reduce((acc, mapping) => {
      if (!acc[mapping.analyst]) {
        acc[mapping.analyst] = {
          cers: [],
          totalTestScripts: 0
        };
      }
      acc[mapping.analyst].cers.push(mapping.cerId);
      acc[mapping.analyst].totalTestScripts += mapping.testScriptCount;
      return acc;
    }, {} as Record<string, { cers: string[], totalTestScripts: number }>);

    return [
      {
        id: 1,
        name: "Jacob Corman",
        role: `${analystAssignments["Jacob Corman"]?.cers.length || 0} CERs Assigned`,
        testScriptCount: analystAssignments["Jacob Corman"]?.totalTestScripts || 0,
        cersReviewed: analystAssignments["Jacob Corman"]?.cers.length || 0,
        reviewingTime: "2.1 days",
        responseTimeToVendor: "5.1 hrs",
        bottleneckProactiveness: "High",
        reworkRate: 5,
        effectiveness: 94,
        assignedCERs: analystAssignments["Jacob Corman"]?.cers || []
      },
      {
        id: 2,
        name: "Emily Rodriguez",
        role: `${analystAssignments["Emily Rodriguez"]?.cers.length || 0} CERs Assigned`,
        testScriptCount: analystAssignments["Emily Rodriguez"]?.totalTestScripts || 0,
        cersReviewed: analystAssignments["Emily Rodriguez"]?.cers.length || 0,
        reviewingTime: "1.8 days",
        responseTimeToVendor: "4.2 hrs",
        bottleneckProactiveness: "High",
        reworkRate: 3,
        effectiveness: 97,
        assignedCERs: analystAssignments["Emily Rodriguez"]?.cers || []
      },
      {
        id: 3,
        name: "Sarah Williams",
        role: `${analystAssignments["Sarah Williams"]?.cers.length || 0} CERs Assigned`,
        testScriptCount: analystAssignments["Sarah Williams"]?.totalTestScripts || 0,
        cersReviewed: analystAssignments["Sarah Williams"]?.cers.length || 0,
        reviewingTime: "2.3 days",
        responseTimeToVendor: "6.3 hrs",
        bottleneckProactiveness: "Medium",
        reworkRate: 7,
        effectiveness: 92,
        assignedCERs: analystAssignments["Sarah Williams"]?.cers || []
      },
      {
        id: 4,
        name: "Daniel Kim",
        role: `${analystAssignments["Daniel Kim"]?.cers.length || 0} CERs Assigned`,
        testScriptCount: analystAssignments["Daniel Kim"]?.totalTestScripts || 0,
        cersReviewed: analystAssignments["Daniel Kim"]?.cers.length || 0,
        reviewingTime: "2.7 days",
        responseTimeToVendor: "7.8 hrs",
        bottleneckProactiveness: "Medium",
        reworkRate: 9,
        effectiveness: 89,
        assignedCERs: analystAssignments["Daniel Kim"]?.cers || []
      },
      {
        id: 5,
        name: "Alex Chen",
        role: `${analystAssignments["Alex Chen"]?.cers.length || 0} CERs Assigned`,
        testScriptCount: analystAssignments["Alex Chen"]?.totalTestScripts || 0,
        cersReviewed: analystAssignments["Alex Chen"]?.cers.length || 0,
        reviewingTime: "3.1 days",
        responseTimeToVendor: "9.2 hrs",
        bottleneckProactiveness: "Low",
        reworkRate: 12,
        effectiveness: 85,
        assignedCERs: analystAssignments["Alex Chen"]?.cers || []
      },
      {
        id: 6,
        name: "Maria Gonzalez",
        role: `${analystAssignments["Maria Gonzalez"]?.cers.length || 0} CERs Assigned`,
        testScriptCount: analystAssignments["Maria Gonzalez"]?.totalTestScripts || 0,
        cersReviewed: analystAssignments["Maria Gonzalez"]?.cers.length || 0,
        reviewingTime: "2.9 days",
        responseTimeToVendor: "8.1 hrs",
        bottleneckProactiveness: "Medium",
        reworkRate: 8,
        effectiveness: 87,
        assignedCERs: analystAssignments["Maria Gonzalez"]?.cers || []
      },
      {
        id: 7,
        name: "David Thompson",
        role: `${analystAssignments["David Thompson"]?.cers.length || 0} CERs Assigned`,
        testScriptCount: analystAssignments["David Thompson"]?.totalTestScripts || 0,
        cersReviewed: analystAssignments["David Thompson"]?.cers.length || 0,
        reviewingTime: "2.0 days",
        responseTimeToVendor: "4.8 hrs",
        bottleneckProactiveness: "High",
        reworkRate: 4,
        effectiveness: 95,
        assignedCERs: analystAssignments["David Thompson"]?.cers || []
      },
      {
        id: 8,
        name: "Lisa Park",
        role: `${analystAssignments["Lisa Park"]?.cers.length || 0} CERs Assigned`,
        testScriptCount: analystAssignments["Lisa Park"]?.totalTestScripts || 0,
        cersReviewed: analystAssignments["Lisa Park"]?.cers.length || 0,
        reviewingTime: "2.5 days",
        responseTimeToVendor: "7.2 hrs",
        bottleneckProactiveness: "Medium",
        reworkRate: 6,
        effectiveness: 90,
        assignedCERs: analystAssignments["Lisa Park"]?.cers || []
      }
    ];
  })();

  // Create top 5 and low 5 analyst data based on sorting type - filter out 0 CERs
  const getTopAnalystData = () => {
    // Filter out analysts with 0 CERs assigned
    const filteredData = analystPerformanceData.filter(analyst => analyst.cersReviewed > 0);

    const sortedData = [...filteredData].sort((a, b) => {
      // Create composite effectiveness score for sorting
      const scoreA = a.effectiveness - a.reworkRate - parseFloat(a.reviewingTime) * 2;
      const scoreB = b.effectiveness - b.reworkRate - parseFloat(b.reviewingTime) * 2;

      if (analystSortType === "top5") {
        return scoreB - scoreA; // Higher scores first (better performance)
      } else {
        return scoreA - scoreB; // Lower scores first (degrading performance)
      }
    });

    return sortedData.slice(0, 5);
  };

  const topAnalystData = getTopAnalystData();

  // Analyst bar chart data - each metric with all analysts
  const analystBarChartData = [
    {
      metric: "CER Count",
      ...topAnalystData.reduce((acc, analyst, _index) => {
        acc[analyst.name.split(' ')[0]] = analyst.cersReviewed * 10; // Scale for visualization
        return acc;
      }, {} as Record<string, number>)
    },
    {
      metric: "Test Scripts",
      ...topAnalystData.reduce((acc, analyst, _index) => {
        acc[analyst.name.split(' ')[0]] = analyst.testScriptCount;
        return acc;
      }, {} as Record<string, number>)
    },
    {
      metric: "Review Speed",
      ...topAnalystData.reduce((acc, analyst, _index) => {
        acc[analyst.name.split(' ')[0]] = 100 - parseFloat(analyst.reviewingTime) * 30; // Convert to performance score
        return acc;
      }, {} as Record<string, number>)
    },
    {
      metric: "Response Speed",
      ...topAnalystData.reduce((acc, analyst, _index) => {
        acc[analyst.name.split(' ')[0]] = 100 - parseFloat(analyst.responseTimeToVendor) * 5; // Convert to performance score
        return acc;
      }, {} as Record<string, number>)
    },
    {
      metric: "Effectiveness",
      ...topAnalystData.reduce((acc, analyst, _index) => {
        acc[analyst.name.split(' ')[0]] = analyst.effectiveness;
        return acc;
      }, {} as Record<string, number>)
    }
  ];

  const currentTimeSeriesData = timeSeriesData[timePeriod as keyof typeof timeSeriesData] || timeSeriesData.last3Years;

  // CER Pipeline Distribution Data with enhanced interactive filtering and visual variations
  const pipelineData = (() => {
    // Adjust pipeline data based on risk level filter with updated stages
    const basePipelineData = [
      {
        stage: "Agent Analysis\\nPending",
        count: 18,
        avgTime: "0.8 days",
        delayReasons: ["High processing queue", "Complex document review"],
        color: "#8b5cf6",
        percentage: 35
      },
      {
        stage: "Analyst Review\\nPending",
        count: 15,
        avgTime: "1.5 days",
        delayReasons: ["Analyst workload", "Additional evidence required"],
        color: "#3b82f6",
        percentage: 29
      },
      {
        stage: "Action Item Closure\\nPending",
        count: 12,
        avgTime: "2.1 days",
        delayReasons: ["Vendor response delays", "Document clarification needed"],
        color: "#f59e0b",
        percentage: 23
      },
      {
        stage: "Final Approval\\nPending",
        count: 7,
        avgTime: "0.5 days",
        delayReasons: ["Manager availability", "Risk escalation review"],
        color: "#10b981",
        percentage: 13
      }
    ];

    // Apply enhanced filter variations based on pipeline-specific risk level filter
    if (pipelineRiskFilter === "all") {
      return basePipelineData;
    }
    const multipliers = filterMultipliers[pipelineRiskFilter as keyof typeof filterMultipliers] || filterMultipliers.medium;

    return basePipelineData.map((item, index) => ({
      ...item,
      count: Math.round(item.count * multipliers.counts[index]),
      avgTime: `${(parseFloat(item.avgTime) * multipliers.times[index]).toFixed(1)} days`,
      color: multipliers.colors[index]
    }));
  })();

  // CER data for vendor analysis table - exact mapping from vendorCERMapping
  const _vendorCERData = vendorPerformanceData.map((vendor) => ({
    id: vendor.cerId,
    vendor: vendor.name,
    riskLevel: vendor.riskRating,
    testScriptCount: vendor.testScriptCount, // Exact count from mapping
    logo: vendor.logo,
    analyst: vendor.analyst
  }));

  // const getRiskLevelTextColor = (riskLevel: string) => {
  //   switch (riskLevel) {
  //     case "Critical":
  //       return "text-red-600";
  //     case "High":
  //       return "text-red-600";
  //     case "Medium":
  //       return "text-amber-600";
  //     case "Low":
  //       return "text-green-600";
  //     default:
  //       return "text-gray-600";
  //   }
  // };

  // Render vendor analysis view
  const renderVendorAnalysisView = () => (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between min-w-0 max-w-none">
          <div className="flex items-center justify-between min-w-0 max-w-none w-full">
            <div className="flex items-center space-x-3">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center space-x-2 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView("dashboard")}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1"
                >
                  Manager Dashboard
                </Button>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 font-medium">All Vendors Analysis</span>
              </nav>

            </div>
            {/* Search */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search vendors..."
                  value={activeSearchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full max-w-none">
          <div className="p-4 lg:p-6 space-y-6 w-full">

            {/* CER Listing Table Section */}
            <Card className="bg-white border border-gray-200 w-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base lg:text-lg font-medium text-gray-900">Vendor CER Listing</CardTitle>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">Complete listing of all vendor Control Effectiveness Reviews</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px]">
                      <thead className="border-b bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="font-medium text-gray-900 px-3 py-3 text-left text-sm min-w-[200px]">
                            Vendor
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[120px]">
                            Compliance %
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[120px]">
                            Action Closure
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[120px]">
                            Doc Accept %
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[80px]">
                            Risk
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[120px]">
                            Response Time
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[80px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {vendorPerformanceData.map((vendor) => (
                          <tr
                            key={vendor.id}
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-3 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-6 h-6 bg-white rounded border text-sm">
                                  <span>{vendor.logo}</span>
                                </div>
                                <div className="flex flex-col">
                                  <div className="text-gray-700 font-medium text-sm">{vendor.name}</div>
                                  <div className="text-xs text-gray-500">{vendor.cerId}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="font-semibold text-gray-900 text-sm">{vendor.complianceAdherence}%</span>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="text-gray-900 text-sm">{vendor.actionItemClosureTime}</span>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="font-semibold text-gray-900 text-sm">{vendor.documentAcceptanceRate}%</span>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <Badge
                                variant={vendor.riskRating === "Low" ? "default" : vendor.riskRating === "Medium" ? "secondary" : "destructive"}
                                className={`text-sm px-2 py-1 ${vendor.riskRating === "Low" ? "bg-green-100 text-green-800 border-green-200" :
                                  vendor.riskRating === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                    "bg-red-100 text-red-800 border-red-200"
                                  }`}
                              >
                                {vendor.riskRating}
                              </Badge>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="text-gray-900 text-sm">{vendor.responseTime}</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1.5 hover:bg-gray-100"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Padding */}
            <div className="h-12"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render analyst analysis view
  const renderAnalystAnalysisView = () => (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between min-w-0 max-w-none">
          <div className="flex items-center justify-between min-w-0 max-w-none w-full">
            <div className="flex items-center space-x-3">
              {/* Breadcrumb Navigation */}
              <nav className="flex items-center space-x-2 text-sm">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewChange("dashboard")}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1"
                >
                  Manager Dashboard
                </Button>
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-900 font-medium">All Analysts Analysis</span>
              </nav>

            </div>
            {/* Search */}
            <div className="flex items-center space-x-3 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search analysts..."
                  value={activeSearchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full max-w-none">
          <div className="p-4 lg:p-6 space-y-6 w-full">

            {/* Analyst Performance Table Section */}
            <Card className="bg-white border border-gray-200 w-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-base lg:text-lg font-medium text-gray-900">Analyst Performance Analysis</CardTitle>
                <p className="text-xs lg:text-sm text-gray-600 mt-1">Complete analysis of all analyst performance metrics and workload distribution</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[900px]">
                      <thead className="border-b bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="font-medium text-gray-900 px-3 py-3 text-left text-sm min-w-[180px]">
                            Analyst
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[120px]">
                            CERs Assigned
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[120px]">
                            Review Time
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[120px]">
                            Response Time
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[120px]">
                            Flagging Proactiveness
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[100px]">
                            Rework Rate
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[120px]">
                            Effectiveness
                          </th>
                          <th className="font-medium text-gray-900 px-3 py-3 text-center text-sm min-w-[80px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {analystPerformanceData.map((analyst) => (
                          <tr
                            key={analyst.id}
                            className="cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-3 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full text-sm font-medium text-emerald-700">
                                  {analyst.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex flex-col">
                                  <div className="text-gray-700 font-medium text-sm">{analyst.name}</div>
                                  <div className="text-xs text-gray-500">{analyst.testScriptCount} test scripts</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="font-semibold text-gray-900 text-sm">{analyst.cersReviewed}</span>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="text-gray-900 text-sm">{analyst.reviewingTime}</span>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="text-gray-900 text-sm">{analyst.responseTimeToVendor}</span>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <Badge
                                variant={analyst.bottleneckProactiveness === "High" ? "default" : analyst.bottleneckProactiveness === "Medium" ? "secondary" : "destructive"}
                                className={`text-sm px-2 py-1 ${analyst.bottleneckProactiveness === "High" ? "bg-green-100 text-green-800 border-green-200" :
                                  analyst.bottleneckProactiveness === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                    "bg-gray-100 text-gray-800 border-gray-200"
                                  }`}
                              >
                                {analyst.bottleneckProactiveness}
                              </Badge>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="text-gray-900 text-sm">{analyst.reworkRate}%</span>
                            </td>
                            <td className="px-3 py-4 text-center">
                              <span className="font-semibold text-gray-900 text-sm">{analyst.effectiveness}%</span>
                            </td>
                            <td className="px-3 py-4 whitespace-nowrap">
                              <div className="flex items-center justify-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1.5 hover:bg-gray-100"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Padding */}
            <div className="h-12"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (activeCurrentView === "vendor-analysis") {
    return renderVendorAnalysisView();
  }

  if (activeCurrentView === "analyst-analysis") {
    return renderAnalystAnalysisView();
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between min-w-0 max-w-none">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-medium text-gray-900">Hi Michael Torres</h1>
            <p className="text-sm text-gray-600 mt-1">Here you can oversight the Risk Operations Dashboard</p>
          </div>

        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="min-h-full max-w-none">
          <div className="p-4 lg:p-6 space-y-6 w-full">
            {/* Enhanced KPI Cards - Modern Dashboard Style */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 w-full">
              {kpiData.map((kpi, index) => (
                <Card key={index} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 min-w-0">
                  <CardContent className="p-4 lg:p-6">
                    {/* Modern Header with Circular Progress */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`relative h-12 w-12 lg:h-14 lg:w-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${kpi.color === "blue" ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-200" :
                          kpi.color === "green" ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-green-200" :
                            "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-purple-200"
                          } shadow-lg`}>
                          {kpi.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs lg:text-sm font-semibold text-gray-900 truncate mb-1">{kpi.title}</h3>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-xl lg:text-2xl font-bold text-gray-900 truncate">{kpi.value}</span>
                            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${kpi.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                              {kpi.isPositive ? (
                                <TrendingUp className="h-3 w-3" />
                              ) : (
                                <TrendingDown className="h-3 w-3" />
                              )}
                              <span>{kpi.trend}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visual Metrics with Progress Bars */}
                    <div className="space-y-3">
                      {kpi.details.slice(0, 2).map((detail, detailIndex) => {
                        // Special handling for Quality Score (4.6/5) to show correct progress
                        let progressValue;
                        if (detail.value.includes('/')) {
                          const [numerator, denominator] = detail.value.split('/');
                          progressValue = (parseFloat(numerator) / parseFloat(denominator)) * 100;
                        } else {
                          progressValue = parseInt(detail.value.replace(/\D/g, '')) || 75;
                        }

                        return (
                          <div key={detailIndex} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-gray-700 truncate">{detail.label}</span>
                              <span className={`text-xs font-bold ${detail.color}`}>{detail.value}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all duration-500 ${kpi.color === "blue" ? "bg-gradient-to-r from-blue-400 to-blue-600" :
                                  kpi.color === "green" ? "bg-gradient-to-r from-green-400 to-green-600" :
                                    "bg-gradient-to-r from-purple-400 to-purple-600"
                                  }`}
                                style={{ width: `${Math.min(progressValue, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Analytics Section with Practice Effectiveness and CER Pipeline - Equal Width */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
              {/* Practice Effectiveness Analysis - 50% Width */}
              <div className="lg:col-span-1">
                <Card className="bg-white border border-gray-200 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-base lg:text-lg font-medium text-gray-900">CER Practice Effectiveness Analysis</CardTitle>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                            <p className="text-xs lg:text-sm text-gray-600">
                              <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-1 rounded">Current vs Last 3 Years</span>
                            </p>
                          </div>
                          {/* Risk Level Filter */}
                          <Select value={riskLevelFilter} onValueChange={setRiskLevelFilter}>
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue placeholder="Risk Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Levels</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Chart */}
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={currentTimeSeriesData} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="quarter"
                              tick={{ fontSize: 10 }}
                              stroke="#6b7280"
                              label={{ value: 'Time Period', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fontSize: '10px' } }}
                            />
                            <YAxis
                              tick={{ fontSize: 10 }}
                              stroke="#6b7280"
                              domain={['dataMin - 5', 'dataMax + 5']}
                              label={{ value: 'Effectiveness %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '10px' } }}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '2px solid #3b82f6',
                                borderRadius: '12px',
                                fontSize: '12px',
                                minWidth: '350px',
                                padding: '16px',
                                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)',
                                position: 'relative'
                              }}
                              cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                              wrapperStyle={{
                                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                              }}
                              content={({ active, payload, label, labelFormatter, coordinate }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white border-2 border-blue-500 rounded-xl p-4 shadow-xl min-w-[350px] relative">
                                      {/* Tooltip pointer/chevron - positioned towards the data point */}
                                      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-l-2 border-b-2 border-blue-500 rotate-45"></div>

                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                                          <div className="font-semibold text-blue-700">
                                            Quarter: {data.quarter}
                                          </div>
                                          <div className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                            Effectiveness: {data.current}%
                                          </div>
                                        </div>

                                        <div className="space-y-2">
                                          <div>
                                            <div className="text-sm font-semibold text-gray-900 mb-3">Current vs Last 3 Years Cumulative</div>
                                            <div className="grid grid-cols-1 gap-1.5 text-xs">
                                              <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                                <span>CERs Evaluated: </span>
                                                <span className="font-medium ml-1">{data.cersEvaluated}/{data.historicalCersEvaluated}</span>
                                              </div>
                                              <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                                <span>Test Scripts Executed: </span>
                                                <span className="font-medium ml-1">{data.testScriptsExecuted}/{data.historicalTestScriptsExecuted}</span>
                                              </div>
                                              <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                                <span>Avg Closure Time: </span>
                                                <span className="font-medium ml-1">{data.avgClosureTime}/{data.historicalAvgClosureTime} days</span>
                                              </div>
                                              <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                                <span>Avg Action Items per CER: </span>
                                                <span className="font-medium ml-1">{data.avgActionItems}/{data.historicalAvgActionItems}</span>
                                              </div>
                                              <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                                <span>Action Items Resolved: </span>
                                                <span className="font-medium ml-1">{data.actionItemsResolved}%/{data.historicalActionItemsResolved}%</span>
                                              </div>
                                              <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                                <span>Risk Reduction Rate: </span>
                                                <span className="font-medium ml-1">{data.riskReductionRate}%/{data.historicalRiskReductionRate}%</span>
                                              </div>
                                              <div className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                                                <span>Compliance Adherence: </span>
                                                <span className="font-medium ml-1">{data.complianceAdherence}%/{data.historicalComplianceAdherence}%</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                              formatter={null}

                            />
                            <Line
                              type="monotone"
                              dataKey="current"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
                              name="Current"
                            />
                            <Line
                              type="monotone"
                              dataKey="previous"
                              stroke="#94a3b8"
                              strokeWidth={1}
                              strokeDasharray="4 4"
                              dot={{ fill: '#94a3b8', strokeWidth: 2, r: 2 }}
                              name="Previous"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Key Insight */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Brain className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Key Insight</span>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold text-blue-900">
                              {riskLevelFilter === "critical" ? "-12%" :
                                riskLevelFilter === "high" ? "-5%" :
                                  riskLevelFilter === "low" ? "+33%" : "+25%"}
                            </div>
                            <div className="flex items-center space-x-1 justify-end">
                              {(riskLevelFilter === "critical" || riskLevelFilter === "high") ? (
                                <TrendingDown className="h-3 w-3 text-red-600" />
                              ) : (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              )}
                              <span className={`text-xs ${(riskLevelFilter === "critical" || riskLevelFilter === "high") ? "text-red-700" : "text-green-700"
                                }`}>
                                {riskLevelFilter === "critical" ? "Critical challenges" :
                                  riskLevelFilter === "high" ? "Needs attention" :
                                    riskLevelFilter === "low" ? "Excellent progress" : "Strong improvement"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-blue-800">
                          {riskLevelFilter === "critical" ? "Critical risk CERs face significant challenges with 12% lower effectiveness and extended closure times." :
                            riskLevelFilter === "high" ? "High risk CERs show reduced effectiveness requiring focused attention and resource allocation." :
                              riskLevelFilter === "low" ? "Low risk CERs demonstrate exceptional performance with 33% faster processing and higher compliance rates." :
                                "CER effectiveness has improved significantly with 33% faster closure times and 11% higher compliance adherence compared to historical averages."}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CER Pipeline Distribution - Bar Chart - 50% Width */}
              <div className="lg:col-span-1">
                <Card className="bg-white border border-gray-200 h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base lg:text-lg font-medium text-gray-900">CER Pipeline Distribution</CardTitle>
                        <p className="text-xs lg:text-sm text-gray-600 mt-1">Test Scripts/CERs processing stages</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select value={pipelineRiskFilter} onValueChange={setPipelineRiskFilter}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="All Levels" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Bar Chart - Enhanced height to match analysis card */}
                      <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={pipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="stage"
                              tick={{ fontSize: 10, fill: '#6b7280' }}
                              angle={-45}
                              textAnchor="end"
                              height={60}
                              interval={0}
                            />
                            <YAxis
                              tick={{ fontSize: 10, fill: '#6b7280' }}
                              label={{ value: 'Count', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '10px' } }}
                            />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: 'white',
                                border: '2px solid #6366f1',
                                borderRadius: '12px',
                                fontSize: '12px',
                                minWidth: '280px',
                                padding: '16px',
                                boxShadow: '0 10px 25px rgba(99, 102, 241, 0.15)'
                              }}
                              cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-white border-2 border-indigo-500 rounded-xl p-4 shadow-xl min-w-[280px]">
                                      <div className="space-y-3">
                                        <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                                          <div className="font-semibold text-indigo-700 text-sm">{data.stage.replace('\\n', ' ')}</div>
                                          <div className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-medium">
                                            {data.count} items
                                          </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                          <div>
                                            <div className="text-gray-600">Avg Time:</div>
                                            <div className="font-medium text-gray-900">{data.avgTime}</div>
                                          </div>
                                          <div>
                                            <div className="text-gray-600">Risk Filter:</div>
                                            <div className="font-medium text-gray-900">{pipelineRiskFilter === 'all' ? 'All Levels' : pipelineRiskFilter.charAt(0).toUpperCase() + pipelineRiskFilter.slice(1)}</div>
                                          </div>
                                        </div>

                                        <div className="pt-2 border-t border-indigo-100">
                                          <div className="text-xs text-gray-600 font-medium mb-2">Common Delays:</div>
                                          <div className="space-y-1">
                                            {data.delayReasons.map((reason: any, idx: any) => (
                                              <div key={idx} className="flex items-start space-x-2 text-xs text-gray-700">
                                                <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                                                <span>{reason}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                              {pipelineData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Compact Bottleneck Analysis Section */}
            <Card className="bg-white border border-gray-200 w-full">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base lg:text-lg font-medium text-gray-900">Bottleneck Analysis</CardTitle>
                    <p className="text-xs lg:text-sm text-gray-600 mt-0.5">Critical issues affecting CER processing efficiency</p>
                  </div>
                  <Badge variant="outline" className="text-xs text-blue-700 bg-blue-50 border-blue-200">
                    4 Active Issues
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-2">
                  {[
                    {
                      issue: "Agent Processing Queue Bottleneck",
                      impact: "Critical",
                      accountable: "Technical Team",
                      recommendation: "Scale processing infrastructure during peak periods",
                      description: "High volume periods causing analysis delays",
                      priority: 1,
                      eta: "2 weeks"
                    },
                    {
                      issue: "Evidence Review Complexity",
                      impact: "High",
                      accountable: "Daniel Kim",
                      recommendation: "Create evidence submission templates and guidelines",
                      description: "Complex evidence submissions requiring extended review periods",
                      priority: 2,
                      eta: "3 weeks"
                    },
                    {
                      issue: "Vendor Document Quality Standards",
                      impact: "High",
                      accountable: "Sarah Williams",
                      recommendation: "Implement pre-submission document quality checklist",
                      description: "Poor document quality requiring multiple re-submissions",
                      priority: 3,
                      eta: "1 week"
                    },
                    {
                      issue: "Analyst Workload Distribution",
                      impact: "Medium",
                      accountable: "Jacob Corman",
                      recommendation: "Redistribute CERs based on complexity and analyst expertise",
                      description: "Uneven workload distribution affecting response times",
                      priority: 4,
                      eta: "4 weeks"
                    }
                  ].map((bottleneck, index) => (
                    <div key={index} className={`bg-white border-r-0 border-l-4 border-t border-b border-gray-200 rounded-lg p-2.5 hover:shadow-lg transition-all duration-300 ${bottleneck.impact === "Critical"
                      ? "border-l-red-500 hover:bg-red-50/30"
                      : bottleneck.impact === "High"
                        ? "border-l-orange-500 hover:bg-orange-50/30"
                        : "border-l-blue-500 hover:bg-blue-50/30"
                      }`}>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                            <span className="text-xs font-semibold text-gray-700">{bottleneck.priority}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5 mb-1">
                              <h5 className="font-semibold text-gray-900 text-sm leading-tight">{bottleneck.issue}</h5>
                              <Badge
                                variant="outline"
                                className={`text-xs px-1.5 py-0.5 flex-shrink-0 font-medium ${bottleneck.impact === "Critical"
                                  ? "border-red-300 text-red-700 bg-red-50" :
                                  bottleneck.impact === "High"
                                    ? "border-orange-300 text-orange-700 bg-orange-50" :
                                    "border-blue-300 text-blue-700 bg-blue-50"
                                  }`}
                              >
                                {bottleneck.impact}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mb-2">{bottleneck.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-gray-600">
                            <Users className="h-3 w-3 mr-1 flex-shrink-0 text-gray-500" />
                            <span className="font-medium text-gray-700">SAP SE</span>
                          </div>
                          <div className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${bottleneck.eta === "1 week" || bottleneck.eta === "2 weeks"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : bottleneck.eta === "3 weeks" || bottleneck.eta === "4 weeks"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}>
                            ETA: {bottleneck.eta}
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-md border border-gray-200 p-2">
                          <div className="text-xs text-gray-700 mb-0.5 font-medium">Recommended Action:</div>
                          <div className="text-xs text-gray-800 leading-relaxed">
                            {bottleneck.recommendation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Summaries Section */}
            <div className="space-y-8">
              {/* Vendor Performance Summary */}
              <Card className="bg-white border border-gray-200 w-full">
                <CardHeader className="pb-3">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-base lg:text-lg font-medium text-gray-900">Vendor Quality & Productivity Analysis</CardTitle>
                        <Badge
                          variant="secondary"
                          className={`text-xs cursor-pointer transition-colors ${vendorSortType === "top5" ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"}`}
                          onClick={() => setVendorSortType(vendorSortType === "top5" ? "low5" : "top5")}
                        >
                          <ArrowUpDown className="h-3 w-3 mr-1" />
                          {vendorSortType === "top5" ? "Top 5 Performers" : "Low 5 Performers"}
                        </Badge>
                      </div>
                      <p className="text-xs lg:text-sm text-gray-600 mt-1">Vendor compliance and response metrics</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={vendorViewMode === "chart" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setVendorViewMode(vendorViewMode === "chart" ? "table" : "chart")}
                          className="text-xs px-3"
                        >
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Chart View
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-2"
                        onClick={() => handleViewChange("vendor-analysis")}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {vendorViewMode === "table" ? (
                    <div className="w-full border rounded-lg">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow className="bg-gray-50 border-b">
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-left text-sm">Vendor</TableHead>
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-center text-sm">Compliance %</TableHead>
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-center text-sm">Action Closure</TableHead>
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-center text-sm">Doc Accept %</TableHead>
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-center text-sm">Risk</TableHead>
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-center text-sm">Response Time</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topVendorData.map((vendor) => (
                            <TableRow key={vendor.id} className="hover:bg-gray-50 border-b">
                              <TableCell className="px-1 py-2">
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center justify-center w-6 h-6 bg-white rounded border text-sm">
                                    <span>{vendor.logo}</span>
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-medium text-gray-900 text-sm truncate">{vendor.name}</div>
                                    <div className="text-xs text-gray-500">{vendor.cerId}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-center">
                                <span className="font-semibold text-gray-900 text-sm">{vendor.complianceAdherence}%</span>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-center">
                                <span className="text-gray-900 text-sm">{vendor.actionItemClosureTime}</span>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-center">
                                <span className="font-semibold text-gray-900 text-sm">{vendor.documentAcceptanceRate}%</span>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-center">
                                <Badge
                                  variant={vendor.riskRating === "Low" ? "default" : vendor.riskRating === "Medium" ? "secondary" : "destructive"}
                                  className={`text-sm px-2 py-1 ${vendor.riskRating === "Low" ? "bg-green-100 text-green-800 border-green-200" :
                                    vendor.riskRating === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                      "bg-red-100 text-red-800 border-red-200"
                                    }`}
                                >
                                  {vendor.riskRating}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-center">
                                <span className="text-gray-900 text-sm">{vendor.responseTime}</span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    /* Bar Chart View */
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={vendorBarChartData} margin={{ top: 40, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="metric"
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                          />
                          <YAxis
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                            label={{ value: 'Score %', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '10px' } }}
                          />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '2px solid #3b82f6',
                              borderRadius: '12px',
                              fontSize: '12px',
                              minWidth: '280px',
                              padding: '16px',
                              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.15)'
                            }}
                            cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                          />
                          {topVendorData.map((vendor, index) => (
                            <Bar
                              key={vendor.name}
                              dataKey={vendor.name.split(' ')[0]}
                              fill={`hsl(${index * 72}, 70%, 50%)`}
                              name={vendor.name}
                              radius={[1, 1, 0, 0]}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Analyst Performance Summary */}
              <Card className="bg-white border border-gray-200 w-full">
                <CardHeader className="pb-3">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-base lg:text-lg font-medium text-gray-900">Analyst Workload & Output Analysis</CardTitle>
                        <Badge
                          variant="secondary"
                          className={`text-xs cursor-pointer transition-colors ${analystSortType === "top5" ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" : "bg-red-100 text-red-800 border-red-200 hover:bg-red-200"}`}
                          onClick={() => setAnalystSortType(analystSortType === "top5" ? "low5" : "top5")}
                        >
                          <ArrowUpDown className="h-3 w-3 mr-1" />
                          {analystSortType === "top5" ? "Top 5 Performers" : "Low 5 Performers"}
                        </Badge>
                      </div>
                      <p className="text-xs lg:text-sm text-gray-600 mt-1">Individual analyst productivity and quality metrics</p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={analystViewMode === "chart" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAnalystViewMode(analystViewMode === "chart" ? "table" : "chart")}
                          className="text-xs px-3"
                        >
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Chart View
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs px-2"
                        onClick={() => handleViewChange("analyst-analysis")}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View All
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {analystViewMode === "table" ? (
                    <div className="w-full border rounded-lg">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow className="bg-gray-50 border-b">
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-left text-sm">Analyst</TableHead>
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-center text-sm">Test Scripts/CERs</TableHead>
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-center text-sm">Avg Review Time</TableHead>
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-center text-sm">Response Time</TableHead>
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-center text-sm">Flagging Proactiveness</TableHead>
                            <TableHead className="font-medium text-gray-900 px-1 py-2 text-center text-sm">Rework Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {topAnalystData.map((analyst) => (
                            <TableRow key={analyst.id} className="hover:bg-gray-50 border-b">
                              <TableCell className="px-1 py-2">
                                <div className="flex items-center space-x-2">
                                  <div className="min-w-0">
                                    <div className="font-medium text-gray-900 text-sm truncate">{analyst.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{analyst.role}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-center">
                                <span className="font-semibold text-gray-900 text-sm">{analyst.testScriptCount}/{analyst.cersReviewed}</span>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-center">
                                <span className="text-gray-900 text-sm">{analyst.reviewingTime}</span>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-center">
                                <span className="text-gray-900 text-sm">{analyst.responseTimeToVendor}</span>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-center">
                                <Badge
                                  variant={analyst.bottleneckProactiveness === "High" ? "default" : analyst.bottleneckProactiveness === "Medium" ? "secondary" : "outline"}
                                  className={`text-sm px-2 py-1 ${analyst.bottleneckProactiveness === "High" ? "bg-green-100 text-green-800 border-green-200" :
                                    analyst.bottleneckProactiveness === "Medium" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                      "bg-gray-100 text-gray-800 border-gray-200"
                                    }`}
                                >
                                  {analyst.bottleneckProactiveness}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-1 py-2 text-center">
                                <span className="font-semibold text-gray-900 text-sm">{analyst.reworkRate}%</span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    /* Bar Chart View */
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analystBarChartData} margin={{ top: 40, right: 30, left: 20, bottom: 60 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="metric"
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                          />
                          <YAxis
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                            label={{ value: 'Score', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fontSize: '10px' } }}
                          />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '2px solid #10b981',
                              borderRadius: '12px',
                              fontSize: '12px',
                              minWidth: '280px',
                              padding: '16px',
                              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)'
                            }}
                            cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                          />
                          {topAnalystData.map((analyst, index) => (
                            <Bar
                              key={analyst.name}
                              dataKey={analyst.name.split(' ')[0]}
                              fill={`hsl(${index * 60}, 70%, 50%)`}
                              name={analyst.name}
                              radius={[1, 1, 0, 0]}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            
            {/* Bottom Padding */}
            <div className="h-12"></div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button - Enhanced visibility */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 h-12 w-12 rounded-full shadow-xl bg-primary text-primary-foreground hover:bg-primary/90 z-50 transition-all duration-300 ease-in-out transform hover:scale-110 border-2 border-white"
          size="sm"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}