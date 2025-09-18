import type { AnalysisData } from "./types";

export const ANALYSIS_MAP: Record<string, AnalysisData> = {
  "CER-10234": {
    sourceDocuments: [
      "SOC 2 Report 2025, page 29",
      "Vendor Security Policy, section 4.3",
      "Information Security Framework, appendix B",
    ],
    reasoningSteps: [
      "Extracted control requirement from CER documentation",
      "Matched evidence from SOC 2 Type II report",
      "Cross-referenced with vendor security policies",
      "Verified compliance disposition as Satisfactory",
      "Validated control effectiveness through audit findings",
    ],
    generatedInsight:
      "Vendor maintains an effective information protection program with SOC 2 alignment and comprehensive security controls implementation.",
    confidenceScore: 92,
    riskLevel: 'High',
  },
  "CER-10567": {
    sourceDocuments: [
      "SOC 2 Report 2024, page 15-18",
      "Risk Assessment Framework, section 2.1",
      "Control Testing Results, Q4 2024",
    ],
    reasoningSteps: [
      "Analyzed control framework alignment",
      "Evaluated historical performance data",
      "Assessed risk mitigation strategies",
      "Incorporated recent audit findings",
      "Updated confidence based on new evidence",
    ],
    generatedInsight:
      "Control environment demonstrates strong design effectiveness with automated monitoring systems in place for key controls.",
    confidenceScore: 81,
    riskLevel: 'High',
  },
  "CER-10892": {
    sourceDocuments: [
      "Incident Response Policy, v2.1",
      "Training Records, Q3-Q4 2024",
      "Security Incident Log, partial",
    ],
    reasoningSteps: [
      "Reviewed incident response procedures",
      "Analyzed training completion rates",
      "Identified gaps in documentation",
      "Assessed control implementation maturity",
      "Flagged missing evidence requirements",
    ],
    generatedInsight:
      "Incident response framework exists but requires enhancement in testing documentation and stakeholder communication procedures.",
    confidenceScore: 58,
    riskLevel: 'Medium',
  },
  "CER-10901": {
    sourceDocuments: [
      "Vendor Management Policy, v3.2",
      "Third-party Risk Assessment, 2024",
      "Compliance Monitoring Reports",
    ],
    reasoningSteps: [
      "Reviewed vendor risk assessment methodology",
      "Validated third-party compliance documentation",
      "Analyzed ongoing monitoring procedures",
      "Evaluated control implementation effectiveness",
      "Confirmed satisfactory risk posture",
    ],
    generatedInsight:
      "Third-party vendor demonstrates adequate compliance with established risk management frameworks and ongoing monitoring protocols.",
    confidenceScore: 85,
    riskLevel: 'Low',
  },
  "CER-10923": {
    sourceDocuments: [
      "Access Control Policy, v2.8",
      "User Access Reviews, Q4 2024",
      "Identity Management Audit Report",
    ],
    reasoningSteps: [
      "Evaluated access control framework design",
      "Reviewed user access review completeness",
      "Analyzed role-based access controls",
      "Assessed privileged access management",
      "Identified moderate implementation gaps",
    ],
    generatedInsight:
      "Access control framework shows good design principles but requires improvements in periodic review processes and documentation consistency.",
    confidenceScore: 73,
    riskLevel: 'Medium',
  },
  "CER-10956": {
    sourceDocuments: [
      "Data Classification Policy, v1.9",
      "Information Handling Procedures",
      "Data Loss Prevention Configuration",
    ],
    reasoningSteps: [
      "Analyzed data classification methodology",
      "Reviewed information handling controls",
      "Evaluated data loss prevention measures",
      "Assessed encryption implementation",
      "Validated control effectiveness",
    ],
    generatedInsight:
      "Data protection controls are well-implemented with comprehensive classification schemes and effective technical safeguards in place.",
    confidenceScore: 84,
    riskLevel: 'Low',
  },
  "CER-11001": {
    sourceDocuments: [
      "Cybersecurity Framework Assessment",
      "Threat Intelligence Report, 2024",
      "Security Operations Center Logs",
    ],
    reasoningSteps: [
      "Reviewed cybersecurity framework maturity",
      "Analyzed threat detection capabilities",
      "Evaluated incident response readiness",
      "Assessed security monitoring coverage",
      "Identified critical security gaps",
    ],
    generatedInsight:
      "Cybersecurity program shows significant gaps in threat detection and response capabilities, requiring immediate attention and resource allocation.",
    confidenceScore: 67,
    riskLevel: 'High',
  },
  "CER-11089": {
    sourceDocuments: [
      "Business Continuity Plan, v4.1",
      "Disaster Recovery Testing Results",
      "Risk Assessment Documentation",
    ],
    reasoningSteps: [
      "Evaluated business continuity planning",
      "Reviewed disaster recovery testing procedures",
      "Analyzed recovery time objectives",
      "Assessed backup and restoration processes",
      "Validated operational resilience measures",
    ],
    generatedInsight:
      "Business continuity framework demonstrates solid foundation with regular testing, though some recovery procedures need refinement for optimal effectiveness.",
    confidenceScore: 88,
    riskLevel: 'Medium',
  },
  "CER-11156": {
    sourceDocuments: [
      "Network Security Architecture Review",
      "Penetration Testing Report, 2024",
      "Firewall Configuration Assessment",
    ],
    reasoningSteps: [
      "Analyzed network security architecture",
      "Reviewed penetration testing findings",
      "Evaluated firewall rule effectiveness",
      "Assessed network segmentation controls",
      "Identified high-risk vulnerabilities",
    ],
    generatedInsight:
      "Network security controls exhibit critical vulnerabilities requiring immediate remediation, particularly in perimeter defense and internal segmentation.",
    confidenceScore: 76,
    riskLevel: 'High',
  },
  "CER-11203": {
    sourceDocuments: [
      "Cloud Security Configuration Guide",
      "Infrastructure Compliance Report",
      "Security Baseline Assessment",
    ],
    reasoningSteps: [
      "Reviewed cloud security configurations",
      "Validated infrastructure compliance status",
      "Analyzed security baseline adherence",
      "Evaluated automated security controls",
      "Confirmed strong security posture",
    ],
    generatedInsight:
      "Cloud infrastructure demonstrates excellent security configuration management with automated controls and strong compliance adherence across all environments.",
    confidenceScore: 91,
    riskLevel: 'Low',
  },
  "CER-11278": {
    sourceDocuments: [
      "Application Security Assessment",
      "Code Review Results, Q4 2024",
      "Vulnerability Management Report",
    ],
    reasoningSteps: [
      "Conducted application security review",
      "Analyzed secure coding practices",
      "Evaluated vulnerability management process",
      "Assessed security testing integration",
      "Identified moderate security concerns",
    ],
    generatedInsight:
      "Application security practices show reasonable implementation with established processes, but require enhanced security testing and vulnerability remediation procedures.",
    confidenceScore: 79,
    riskLevel: 'Medium',
  },
  "CER-11324": {
    sourceDocuments: [
      "Privacy Impact Assessment",
      "Data Governance Framework",
      "Regulatory Compliance Audit",
    ],
    reasoningSteps: [
      "Reviewed privacy protection measures",
      "Analyzed data governance implementation",
      "Evaluated regulatory compliance status",
      "Assessed data subject rights procedures",
      "Identified significant compliance gaps",
    ],
    generatedInsight:
      "Data privacy and governance framework shows substantial deficiencies in compliance monitoring and data subject rights implementation, requiring urgent remediation.",
    confidenceScore: 45,
    riskLevel: 'High',
  },
};
