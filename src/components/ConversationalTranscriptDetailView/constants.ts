import type { Evidence } from "./types";

export const CITATION_REGEX = /\[([^,]+),\s*pg\s*(\d+),\s*para\s*(\d+)\]/g;

export const CITATION_MAP: Record<string, string> = {
  "SOC2 Report 2025-p8-para3": "encryption for data at rest using AES-256",
  "SOC2 Security Report 2025-p8-para3": "encryption for data at rest using AES-256",
  "SOC2 Report 2025-p15-para1": "Supplemental materials include",
  "SOC2 Security Report 2025-p15-para1": "Supplemental materials include",
  "IPSRA Risk Scorecard-p12-para2": "Data classification categories include",
  "SOC2 Report 2025": "encryption for data at rest using AES-256",
  "SOC2 Security Report 2025": "encryption for data at rest using AES-256",
  "IPSRA Risk Scorecard": "Data classification categories include",
  "Coupa Vendor Profile": "vendor risk evaluation criteria",
};

export const ANALYSIS_CONTENT: Record<string, any> = {
  "ts-1": {
    title: "VCM Agent Analysis for Expense Report Controls",
    reasoningSteps: [
      "1. **Control Design Assessment**: Evaluated the expense reporting process against industry standards and regulatory requirements. The control requires manager approval for expenses over $500, which aligns with standard segregation of duties principles [SOC2 Report 2025, pg 8, para 3].",
      "2. **Evidence Review**: Analyzed available documentation including expense reports, approval workflows, and policy documentation. Found comprehensive evidence supporting control effectiveness with proper data classification standards [IPSRA Risk Scorecard, pg 12, para 2].",
      "3. **Testing Validation**: Reviewed sample transactions to verify control execution. All tested transactions showed proper approvals and documentation as outlined in supplemental materials [SOC2 Report 2025, pg 15, para 1].",
      "4. **Risk Assessment**: Evaluated residual risk considering control design and operational effectiveness. Risk is appropriately mitigated through dual authorization requirements.",
    ],
    sourceDocuments: [
      "Expense Policy v2.1",
      "Manager Approval Matrix",
      "Sample Expense Reports (Q4 2024)",
    ],
    generatedInsight:
      "The expense reporting control is well-designed and consistently executed. The $500 threshold appropriately balances operational efficiency with risk management. Regular monitoring of this control continues to demonstrate effectiveness in preventing unauthorized expenses and ensuring proper documentation with appropriate data classification standards [IPSRA Risk Scorecard, pg 12, para 2]. Additional validation is provided through comprehensive supplemental materials [SOC2 Report 2025, pg 15, para 1].",
    confidence: 92,
    disposition: "Effective",
  },
  "ts-2": {
    title: "VCM Agent Analysis for Purchase Order Controls",
    reasoningSteps: [
      "1. **Control Framework Analysis**: Assessed dual authorization requirements for purchase orders exceeding $1,000. This threshold and approval structure provides strong preventive controls [SOC2 Report 2025, pg 8, para 3].",
      "2. **Authority Matrix Review**: Verified that department heads have appropriate authority levels and segregation from procurement functions. Authority delegation is properly documented [IPSRA Risk Scorecard, pg 5, para 4].",
      "3. **Process Testing**: Sampled purchase orders across different amounts and departments. All transactions showed proper dual signatures and department head approvals [SOC2 Report 2025, pg 12, para 1].",
      "4. **Exception Analysis**: Identified minimal exceptions, all properly documented with appropriate management override justification.",
    ],
    sourceDocuments: ["Purchase Order Policy", "Authority Matrix", "PO Sample Testing Results"],
    generatedInsight:
      "Purchase order controls demonstrate robust design and consistent operation. The dual authorization requirement effectively prevents unauthorized procurement activities. Department head involvement ensures appropriate business justification for purchases [SOC2 Report 2025, pg 8, para 3]. Regular monitoring confirms ongoing control effectiveness.",
    confidence: 94,
    disposition: "Effective",
  },
};

export const DEFAULT_ANALYSIS = {
  title: "VCM Agent Analysis",
  reasoningSteps: [
    "1. **Initial Assessment**: Comprehensive review of control design and implementation [SOC2 Report 2025, pg 8, para 3].",
    "2. **Evidence Analysis**: Evaluation of supporting documentation and evidence quality.",
    "3. **Risk Evaluation**: Assessment of control effectiveness in mitigating identified risks.",
    "4. **Conclusion**: Final determination of control adequacy and recommendations.",
  ],
  sourceDocuments: ["Control Documentation", "Evidence Package", "Risk Assessment"],
  generatedInsight:
    "Control analysis completed with comprehensive evidence review. Further testing may be required to fully assess operational effectiveness [SOC2 Report 2025, pg 8, para 3].",
  confidence: 85,
  disposition: "Requires Review",
};

export const BASE_DOCUMENTS: Array<{
  id: string;
  name: string;
  type: Evidence["type"];
  status: Evidence["status"];
  relevanceScore: number;
  lastUpdated: string;
  owner: string;
  size: string;
  description: string;
}> = [
  {
    id: "doc-1",
    name: "SOC 2 Type II Report 2025",
    type: "report",
    status: "available",
    relevanceScore: 95,
    lastUpdated: "2 weeks ago",
    owner: "External Auditor",
    size: "2.4 MB",
    description:
      "Comprehensive SOC 2 audit report covering security, availability, and confidentiality controls",
  },
  {
    id: "doc-2",
    name: "IPSRA Risk Scorecard",
    type: "evidence",
    status: "available",
    relevanceScore: 88,
    lastUpdated: "1 week ago",
    owner: "Risk Team",
    size: "856 KB",
    description:
      "Internal risk assessment scorecard with control effectiveness ratings",
  },
  {
    id: "doc-3",
    name: "Expense Management Policy v2.1",
    type: "policy",
    status: "available",
    relevanceScore: 92,
    lastUpdated: "3 weeks ago",
    owner: "Finance Team",
    size: "1.2 MB",
    description:
      "Updated policy document outlining expense approval workflows and thresholds",
  },
  {
    id: "doc-4",
    name: "Purchase Order Authority Matrix",
    type: "procedure",
    status: "available",
    relevanceScore: 85,
    lastUpdated: "1 month ago",
    owner: "Procurement Team",
    size: "420 KB",
    description:
      "Authorization levels and approval requirements for purchase orders",
  },
  {
    id: "doc-5",
    name: "Control Testing Results Q4 2024",
    type: "evidence",
    status: "under-review",
    relevanceScore: 78,
    lastUpdated: "3 days ago",
    owner: "Internal Audit",
    size: "3.1 MB",
    description:
      "Quarterly control testing results with sample analyses and exceptions",
  },
  {
    id: "doc-6",
    name: "ISO 27001 Certificate",
    type: "certificate",
    status: "available",
    relevanceScore: 72,
    lastUpdated: "6 months ago",
    owner: "Compliance Team",
    size: "125 KB",
    description:
      "Current ISO 27001 certification for information security management",
  },
];

export const BASE_ACTIVITIES = [
  {
    id: "activity-1",
    type: "ai-populated" as const,
    message: "AI analysis generated for test script validation",
    timestamp: "2 hours ago",
    confidence: 92,
  },
  {
    id: "activity-2",
    type: "human-insight" as const,
    message: "Jacob Corman added insights about control design",
    timestamp: "1 hour ago",
  },
  {
    id: "activity-3",
    type: "repopulated" as const,
    message: "AI analysis updated with additional evidence",
    timestamp: "45 minutes ago",
    confidence: 96,
    previousConfidence: 92,
  },
  {
    id: "activity-4",
    type: "human-insight" as const,
    message: "Analyst requested additional documentation",
    timestamp: "30 minutes ago",
  },
  {
    id: "activity-5",
    type: "ai-populated" as const,
    message: "New evidence incorporated into analysis",
    timestamp: "15 minutes ago",
    confidence: 94,
  },
];

export const REQUIREMENT_MAP: Record<string, string> = {
  "ts-1":
    "Expense reporting process must include manager approval for expenses over $500 with proper documentation and business justification.",
  "ts-2":
    "All purchase orders require dual authorization for amounts exceeding $1,000 and must be approved by department heads.",
};
