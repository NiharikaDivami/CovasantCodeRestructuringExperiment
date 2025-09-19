// Types for time series data
export interface VendorCERMapping {
    testScriptCount: number;
    riskLevel: string;
    // Add other properties as needed
}



export const logos = ["🟠", "🔷", "🔴", "🔶", "☁️", "🔵", "❄️", "🟢", "🔵", "🟡", "🔴", "🔷", "🔵", "🟣", "🔷", "🔵", "❄️", "🟢", "🟡", "🔴"];

export function getTimeSeriesData(
    vendorCERMapping: VendorCERMapping[],
    riskLevelFilter: string
) {
    const totalCERs = vendorCERMapping.length;
    const totalTestScripts = vendorCERMapping.reduce((sum, mapping) => sum + mapping.testScriptCount, 0);

    // Filter data based on risk level
    const filteredCERs = riskLevelFilter === "all" ? vendorCERMapping :
        vendorCERMapping.filter(mapping => mapping.riskLevel.toLowerCase() === riskLevelFilter.toLowerCase());

    const filteredCERCount = filteredCERs.length;
    const filteredTestScripts = filteredCERs.reduce((sum, mapping) => sum + mapping.testScriptCount, 0);

    // Adjust effectiveness based on risk level - with more dramatic variations
    const getEffectivenessAdjustment = () => {
        switch (riskLevelFilter) {
            case "critical": return { current: -12, previous: -18 };
            case "high": return { current: -8, previous: -12 };
            case "medium": return { current: 0, previous: 0 };
            case "low": return { current: +6, previous: +4 };
            default: return { current: 0, previous: 0 };
        }
    };

    const adjustment = getEffectivenessAdjustment();

    return {
        lastYear: [
            {
                period: "Q1 2025",
                current: 91 + adjustment.current,
                previous: 78 + adjustment.previous,
                month: "Q1",
                quarter: "Q1",
                cersEvaluated: Math.floor(filteredCERCount * 0.4),
                testScriptsExecuted: Math.floor(filteredTestScripts * 0.45),
                avgClosureTime: 12,
                avgActionItems: 3,
                actionItemsResolved: 87,
                riskReductionRate: 70,
                complianceAdherence: 83,
                historicalCersEvaluated: 6,
                historicalTestScriptsExecuted: Math.floor(totalTestScripts * 0.4),
                historicalAvgClosureTime: 15,
                historicalAvgActionItems: 4,
                historicalActionItemsResolved: 81,
                historicalRiskReductionRate: 64,
                historicalComplianceAdherence: 78
            },
            {
                period: "Q2 2025",
                current: 94 + adjustment.current,
                previous: 82 + adjustment.previous,
                month: "Q2",
                quarter: "Q2",
                cersEvaluated: Math.floor(totalCERs * 0.45),
                testScriptsExecuted: Math.floor(totalTestScripts * 0.5),
                avgClosureTime: 11,
                avgActionItems: 3,
                actionItemsResolved: 89,
                riskReductionRate: 73,
                complianceAdherence: 85,
                historicalCersEvaluated: 7,
                historicalTestScriptsExecuted: Math.floor(totalTestScripts * 0.42),
                historicalAvgClosureTime: 14,
                historicalAvgActionItems: 4,
                historicalActionItemsResolved: 83,
                historicalRiskReductionRate: 66,
                historicalComplianceAdherence: 80
            },
            {
                period: "Q3 2025",
                current: 96 + adjustment.current,
                previous: 85 + adjustment.previous,
                month: "Q3",
                quarter: "Q3",
                cersEvaluated: Math.floor(totalCERs * 0.5),
                testScriptsExecuted: Math.floor(totalTestScripts * 0.55),
                avgClosureTime: 10,
                avgActionItems: 3,
                actionItemsResolved: 91,
                riskReductionRate: 75,
                complianceAdherence: 87,
                historicalCersEvaluated: 8,
                historicalTestScriptsExecuted: Math.floor(totalTestScripts * 0.44),
                historicalAvgClosureTime: 13,
                historicalAvgActionItems: 4,
                historicalActionItemsResolved: 85,
                historicalRiskReductionRate: 68,
                historicalComplianceAdherence: 82
            },
            {
                period: "Q4 2025",
                current: 98 + adjustment.current,
                previous: 88 + adjustment.previous,
                month: "Q4",
                quarter: "Q4",
                cersEvaluated: Math.floor(totalCERs * 0.55),
                testScriptsExecuted: Math.floor(totalTestScripts * 0.6),
                avgClosureTime: 9,
                avgActionItems: 3,
                actionItemsResolved: 93,
                riskReductionRate: 77,
                complianceAdherence: 89,
                historicalCersEvaluated: 8,
                historicalTestScriptsExecuted: Math.floor(totalTestScripts * 0.46),
                historicalAvgClosureTime: 12,
                historicalAvgActionItems: 3,
                historicalActionItemsResolved: 87,
                historicalRiskReductionRate: 70,
                historicalComplianceAdherence: 84
            }
        ],
        last3Years: [
            {
                period: "Q1 2025",
                current: 91 + adjustment.current,
                previous: 78 + adjustment.previous,
                month: "Q1",
                quarter: "Q1",
                cersEvaluated: Math.floor(totalCERs * 0.4),
                testScriptsExecuted: Math.floor(totalTestScripts * 0.45),
                avgClosureTime: 12,
                avgActionItems: 3,
                actionItemsResolved: 87,
                riskReductionRate: 70,
                complianceAdherence: 83,
                historicalCersEvaluated: 6,
                historicalTestScriptsExecuted: Math.floor(totalTestScripts * 0.4),
                historicalAvgClosureTime: 15,
                historicalAvgActionItems: 4,
                historicalActionItemsResolved: 81,
                historicalRiskReductionRate: 64,
                historicalComplianceAdherence: 78
            },
            {
                period: "Q2 2025",
                current: 94 + adjustment.current,
                previous: 82 + adjustment.previous,
                month: "Q2",
                quarter: "Q2",
                cersEvaluated: Math.floor(totalCERs * 0.45),
                testScriptsExecuted: Math.floor(totalTestScripts * 0.5),
                avgClosureTime: 11,
                avgActionItems: 3,
                actionItemsResolved: 89,
                riskReductionRate: 73,
                complianceAdherence: 85,
                historicalCersEvaluated: 7,
                historicalTestScriptsExecuted: Math.floor(totalTestScripts * 0.42),
                historicalAvgClosureTime: 14,
                historicalAvgActionItems: 4,
                historicalActionItemsResolved: 83,
                historicalRiskReductionRate: 66,
                historicalComplianceAdherence: 80
            },
            {
                period: "Q3 2025",
                current: 96 + adjustment.current,
                previous: 85 + adjustment.previous,
                month: "Q3",
                quarter: "Q3",
                cersEvaluated: Math.floor(totalCERs * 0.5),
                testScriptsExecuted: Math.floor(totalTestScripts * 0.55),
                avgClosureTime: 10,
                avgActionItems: 3,
                actionItemsResolved: 91,
                riskReductionRate: 75,
                complianceAdherence: 87,
                historicalCersEvaluated: 8,
                historicalTestScriptsExecuted: Math.floor(totalTestScripts * 0.44),
                historicalAvgClosureTime: 13,
                historicalAvgActionItems: 4,
                historicalActionItemsResolved: 85,
                historicalRiskReductionRate: 68,
                historicalComplianceAdherence: 82
            },
            {
                period: "Q4 2025",
                current: 98 + adjustment.current,
                previous: 88 + adjustment.previous,
                month: "Q4",
                quarter: "Q4",
                cersEvaluated: Math.floor(totalCERs * 0.55),
                testScriptsExecuted: Math.floor(totalTestScripts * 0.6),
                avgClosureTime: 9,
                avgActionItems: 3,
                actionItemsResolved: 93,
                riskReductionRate: 77,
                complianceAdherence: 89,
                historicalCersEvaluated: 8,
                historicalTestScriptsExecuted: Math.floor(totalTestScripts * 0.46),
                historicalAvgClosureTime: 12,
                historicalAvgActionItems: 3,
                historicalActionItemsResolved: 87,
                historicalRiskReductionRate: 70,
                historicalComplianceAdherence: 84
            }
        ]
    };
}

export const filterMultipliers = {
    critical: {
        counts: [1.5, 1.4, 1.3, 1.2],
        times: [1.3, 1.2, 1.4, 1.1],
        colors: ["#7c3aed", "#2563eb", "#dc2626", "#059669"]
    },
    high: {
        counts: [1.2, 1.2, 1.1, 1.0],
        times: [1.1, 1.1, 1.2, 1.0],
        colors: ["#8b5cf6", "#3b82f6", "#f59e0b", "#10b981"]
    },
    medium: {
        counts: [1.0, 1.0, 1.0, 1.0],
        times: [1.0, 1.0, 1.0, 1.0],
        colors: ["#8b5cf6", "#3b82f6", "#f59e0b", "#10b981"]
    },
    low: {
        counts: [0.6, 0.7, 0.8, 0.9],
        times: [0.7, 0.8, 0.7, 0.9],
        colors: ["#a78bfa", "#60a5fa", "#fbbf24", "#34d399"]
    }
};
export const vendorCERMapping = [
    // Jacob Corman's 12 CERs (matches analyst flow exactly)
    { cerId: "CER-10234", vendor: "Amazon Web Services", analyst: "Jacob Corman", testScriptCount: 6, riskLevel: "Critical" },
    { cerId: "CER-10567", vendor: "Microsoft Azure", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Critical" },
    { cerId: "CER-10892", vendor: "Google Cloud Platform", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Medium" },
    { cerId: "CER-10901", vendor: "Adobe Systems", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Low" },
    { cerId: "CER-10923", vendor: "Atlassian Corp", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Medium" },
    { cerId: "CER-10956", vendor: "Zoom Video", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Low" },
    { cerId: "CER-11001", vendor: "Oracle Corporation", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Critical" },
    { cerId: "CER-11089", vendor: "Slack Technologies", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Medium" },
    { cerId: "CER-11156", vendor: "Box Inc", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Critical" },
    { cerId: "CER-11203", vendor: "HubSpot Inc", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Low" },
    { cerId: "CER-11278", vendor: "Dropbox Inc", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Medium" },
    { cerId: "CER-11324", vendor: "Zendesk Inc", analyst: "Jacob Corman", testScriptCount: 2, riskLevel: "Critical" },

    // Remaining 8 CERs distributed among 7 other analysts (uneven distribution)
    { cerId: "CER-11567", vendor: "IBM Cloud", analyst: "Emily Rodriguez", testScriptCount: 2, riskLevel: "Medium" },
    { cerId: "CER-11892", vendor: "Snowflake Inc", analyst: "Emily Rodriguez", testScriptCount: 2, riskLevel: "High" },
    { cerId: "CER-12001", vendor: "ServiceNow", analyst: "Emily Rodriguez", testScriptCount: 2, riskLevel: "Medium" },

    { cerId: "CER-12234", vendor: "SAP SE", analyst: "Sarah Williams", testScriptCount: 2, riskLevel: "Low" },
    { cerId: "CER-12567", vendor: "Workday Inc", analyst: "Sarah Williams", testScriptCount: 2, riskLevel: "Medium" },

    { cerId: "CER-13001", vendor: "MongoDB Inc", analyst: "Daniel Kim", testScriptCount: 3, riskLevel: "Medium" },

    { cerId: "CER-13234", vendor: "Databricks Inc", analyst: "Alex Chen", testScriptCount: 2, riskLevel: "High" },

    { cerId: "CER-13567", vendor: "Twilio Inc", analyst: "Maria Gonzalez", testScriptCount: 2, riskLevel: "Medium" }
];

