import { CER } from "./types";

// Helper function to find CER ID for a given test script ID
export const findCERForTestScript = (testScriptId: string): string => {
  // Map test script IDs to their respective CERs
  const testScriptToCERMap: Record<string, string> = {
    // CER-10234 test scripts
    "TS-324472": "CER-10234",
    "TS-324473": "CER-10234", 
    "TS-324474": "CER-10234",
    "TS-324475": "CER-10234",
    "TS-324476": "CER-10234",
    "TS-324477": "CER-10234",
    // CER-10567 test scripts
    "TS-325001": "CER-10567",
    "TS-325002": "CER-10567", 
    "TS-325003": "CER-10567",
    "TS-325004": "CER-10567",
    "TS-325005": "CER-10567",
    "TS-325006": "CER-10567",
    // CER-10892 test scripts
    "TS-326001": "CER-10892",
    "TS-326002": "CER-10892", 
    "TS-326003": "CER-10892",
    "TS-326004": "CER-10892",
    "TS-326005": "CER-10892",
    "TS-326006": "CER-10892",
    // Add more mappings as needed...
    "TS-327001": "CER-11001",
    "TS-327002": "CER-11001",
    "TS-328001": "CER-11234",
    "TS-328002": "CER-11234"
  };
  
  return testScriptToCERMap[testScriptId] || "CER-10567"; // fallback CER
};

// Sample CER data
export const getCERs = (): CER[] => {
  const baseCers: CER[] = [
    {
      id: "CER-10234",
      vendor: "Amazon Web Services",
      riskLevel: "Critical",
      status: "Completed",
      confidenceStatus: "finished",
      confidence: 92
    },
    {
      id: "CER-10567",
      vendor: "Microsoft Azure",
      riskLevel: "Critical",
      status: "Active",
      confidenceStatus: "repopulated",
      confidence: 81,
      previousConfidence: 45
    },
    {
      id: "CER-10892",
      vendor: "Google Cloud Platform",
      riskLevel: "Medium",
      status: "Active",
      confidenceStatus: "in-progress",
      confidence: 58,
      tooltip: "Partial evidence, missing docs"
    },
    {
      id: "CER-10901",
      vendor: "Adobe Systems",
      riskLevel: "Low",
      status: "Active",
      confidenceStatus: "not-started"
    },
    {
      id: "CER-10923",
      vendor: "Atlassian Corp",
      riskLevel: "Medium",
      status: "Completed",
      confidenceStatus: "finished",
      confidence: 73
    },
    {
      id: "CER-10956",
      vendor: "Zoom Video",
      riskLevel: "Low",
      status: "Active",
      confidenceStatus: "finished",
      confidence: 84
    },
    {
      id: "CER-11001",
      vendor: "Oracle Corporation",
      riskLevel: "Critical",
      status: "Active",
      confidenceStatus: "in-progress",
      confidence: 67
    },
    {
      id: "CER-11089",
      vendor: "Slack Technologies",
      riskLevel: "Medium",
      status: "Completed",
      confidenceStatus: "finished",
      confidence: 88
    },
    {
      id: "CER-11156",
      vendor: "Box Inc",
      riskLevel: "Critical",
      status: "Active",
      confidenceStatus: "finished",
      confidence: 76
    },
    {
      id: "CER-11203",
      vendor: "HubSpot Inc",
      riskLevel: "Low",
      status: "Active",
      confidenceStatus: "in-progress",
      confidence: 91
    },
    {
      id: "CER-11278",
      vendor: "Dropbox Inc",
      riskLevel: "Medium",
      status: "Completed",
      confidenceStatus: "finished",
      confidence: 79
    },
    {
      id: "CER-11324",
      vendor: "Zendesk Inc",
      riskLevel: "Critical",
      status: "Active",
      confidenceStatus: "not-started"
    }
  ];

  return baseCers;
};

// Get risk level text color (not badge)
export const getRiskLevelTextColor = (level: string) => {
  switch (level) {
    case "Critical":
      return "text-red-600";
    case "Medium":
      return "text-amber-600";
    case "Low":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
};

// Get confidence badge color
export const getConfidenceBadgeColor = (confidence?: number) => {
  if (!confidence) return "bg-gray-100 text-gray-700";
  if (confidence >= 85) return "bg-green-100 text-green-800";
  if (confidence >= 60) return "bg-amber-100 text-amber-800";
  return "bg-red-100 text-red-800";
};