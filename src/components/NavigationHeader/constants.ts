// Constants for NavigationHeader

export const DEFAULT_PERSONA = {
    id: "default",
    name: "Default Persona",
};

export const NOTIFICATION_TYPES = {
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
};
// Mock alert data for manager - matching the design image
export const activeAlerts = [
    {
        id: "alert-001",
        category: "CER Issues",
        title: "CER-10234 exceeded 30-day deadline",
        severity: "HIGH",
        timestamp: "2 hours ago",
        cerId: "CER-10234",
        recommendedActions: [
            "Escalate to senior analyst for immediate review",
            "Contact vendor for expedited completion",
            "Review resource allocation for future CERs"
        ]
    },
    {
        id: "alert-002",
        category: "AI Analysis Accuracy",
        title: "TS-324472 confidence below 60% threshold",
        severity: "MEDIUM",
        timestamp: "4 hours ago",
        testScriptId: "TS-324472",
        recommendedActions: [
            "Manually review AI analysis for accuracy",
            "Request additional vendor documentation",
            "Consider human analyst override"
        ]
    },
    {
        id: "alert-003",
        category: "Vendor Effectiveness",
        title: "Amazon Web Services - 3 overdue submissions affecting timeline",
        severity: "HIGH",
        timestamp: "6 hours ago",
        vendorName: "Amazon Web Services",
        recommendedActions: [
            "Schedule urgent vendor communication",
            "Review submission deadlines and capacity",
            "Implement additional monitoring measures"
        ]
    },
    {
        id: "alert-004",
        category: "Test Script Problems",
        title: "TS-324473 failed validation checks - requires review",
        severity: "MEDIUM",
        timestamp: "5 hours ago",
        testScriptId: "TS-324473",
        recommendedActions: [
            "Conduct detailed validation review",
            "Update test script criteria if needed",
            "Provide vendor guidance on requirements"
        ]
    }
];
