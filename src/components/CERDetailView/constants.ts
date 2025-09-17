export const scriptDataByCER: Record<string, Array<any>> = {
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
      risk: "medium",
      status: "finished",
      confidence: 84,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Travel expense controls require pre-approval for business trips exceeding $1,000 with detailed itinerary and business justification.",
      testScripts: "Test travel expense controls including pre-approval workflows, itinerary validation, and business justification review processes.",
      aiInsightsSummary: "Travel expense controls operate effectively with comprehensive pre-approval process and adequate justification requirements.",
      humanInsightsSummary: "",
      description: "Travel expense controls require pre-approval for business trips exceeding $1,000 with detailed itinerary and business justification.",
      expectedEvidence: "Travel expense pre-approval documentation, detailed itineraries, and business justification for trips exceeding $1,000."
    },
    {
      id: "ts-5",
      title: "TS-324476",
      name: "Test Credit Card Reconciliation Controls",
      control: "CTRL-00234-CC",
      controlName: "Credit Card Reconciliation Process",
      risk: "medium",
      status: "finished",
      confidence: 81,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Credit card reconciliation requires monthly statements with supporting receipts and management review of all corporate card transactions.",
      testScripts: "Review credit card reconciliation process including monthly statement verification, receipt matching, and management oversight procedures.",
      aiInsightsSummary: "Credit card reconciliation controls are well-established with regular monthly reviews and appropriate receipt matching procedures.",
      humanInsightsSummary: "",
      description: "Credit card reconciliation requires monthly statements with supporting receipts and management review of all corporate card transactions.",
      expectedEvidence: "Credit card reconciliation documentation, monthly statements with matched receipts, and management review records."
    },
    {
      id: "ts-6",
      title: "TS-324477",
      name: "Verify Vendor Payment Controls",
      control: "CTRL-00234-VEN",
      controlName: "Vendor Payment Authorization",
      risk: "high",
      status: "finished",
      confidence: 89,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Vendor payment controls require three-way matching with purchase orders, invoices, and receiving reports before payment authorization.",
      testScripts: "Test vendor payment controls including three-way matching procedures and payment authorization workflows.",
      aiInsightsSummary: "Vendor payment controls are robust with effective three-way matching and appropriate authorization procedures in place.",
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
  ],
  "CER-11001": [
    {
      id: "ts-1",
      title: "TS-327001",
      name: "Review API Security Controls",
      control: "CTRL-11001-API",
      controlName: "API Security Framework",
      risk: "high",
      status: "finished",
      confidence: 89,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "All API endpoints require authentication and authorization with rate limiting and input validation controls.",
      testScripts: "Test API authentication mechanisms, verify authorization controls, and validate rate limiting and input sanitization procedures.",
      aiInsightsSummary: "API security controls are well-implemented with comprehensive authentication and robust rate limiting mechanisms.",
      humanInsightsSummary: "",
      description: "API security framework ensures secure communication between systems with proper authentication and authorization.",
      expectedEvidence: "API security logs, authentication tokens, rate limiting configurations, and input validation test results."
    },
    {
      id: "ts-2",
      title: "TS-327002",
      name: "Test Cloud Infrastructure Controls",
      control: "CTRL-11001-CLOUD",
      controlName: "Cloud Infrastructure Security",
      risk: "medium",
      status: "finished",
      confidence: 84,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Cloud infrastructure requires encryption at rest and in transit with proper network segmentation and monitoring.",
      testScripts: "Verify encryption implementations, test network segmentation rules, and review cloud monitoring configurations.",
      aiInsightsSummary: "Cloud infrastructure security is properly configured with effective encryption and monitoring controls in place.",
      humanInsightsSummary: "",
      description: "Cloud infrastructure security controls protect data and applications in cloud environments.",
      expectedEvidence: "Encryption certificates, network configuration files, and cloud monitoring dashboard reports."
    }
  ],
  "CER-11234": [
    {
      id: "ts-1",
      title: "TS-328001",
      name: "Review Data Encryption Standards",
      control: "CTRL-11234-ENC",
      controlName: "Data Encryption Controls",
      risk: "high",
      status: "finished",
      confidence: 92,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "All sensitive data must be encrypted using AES-256 encryption with proper key management and rotation procedures.",
      testScripts: "Verify encryption algorithm implementations, test key management procedures, and validate encryption key rotation schedules.",
      aiInsightsSummary: "Data encryption controls meet industry standards with effective key management and automated rotation processes.",
      humanInsightsSummary: "",
      description: "Comprehensive data encryption standards protect sensitive information throughout its lifecycle.",
      expectedEvidence: "Encryption implementation reports, key management logs, and rotation schedule documentation."
    },
    {
      id: "ts-2",
      title: "TS-328002",
      name: "Test Database Security Controls",
      control: "CTRL-11234-DB",
      controlName: "Database Security Framework",
      risk: "medium",
      status: "finished",
      confidence: 87,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Database systems require role-based access controls with audit logging and regular security updates.",
      testScripts: "Review database user roles and permissions, verify audit logging functionality, and confirm security patch management.",
      aiInsightsSummary: "Database security controls are comprehensive with proper access management and effective audit logging mechanisms.",
      humanInsightsSummary: "",
      description: "Database security framework ensures data integrity and access control for all database systems.",
      expectedEvidence: "Database access logs, user permission matrices, and security update installation records."
    }
  ],
  "CER-11567": [
    {
      id: "ts-1",
      title: "TS-329001",
      name: "Review Synchronization Protocols",
      control: "CTRL-11567-SYNC",
      controlName: "Data Synchronization Controls",
      risk: "medium",
      status: "finished",
      confidence: 81,
      disposition: "Partially Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Data synchronization between systems requires conflict resolution mechanisms and integrity verification.",
      testScripts: "Test synchronization conflict resolution, verify data integrity checks, and validate error handling procedures.",
      aiInsightsSummary: "Synchronization controls generally effective but some improvements needed in conflict resolution documentation.",
      humanInsightsSummary: "",
      description: "Data synchronization protocols ensure consistency across distributed systems and platforms.",
      expectedEvidence: "Synchronization logs, conflict resolution reports, and data integrity verification results."
    },
    {
      id: "ts-2",
      title: "TS-329002",
      name: "Test Real-time Monitoring Systems",
      control: "CTRL-11567-MON",
      controlName: "Real-time Monitoring Framework",
      risk: "high",
      status: "finished",
      confidence: 88,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Real-time monitoring systems must provide alerting capabilities with defined response procedures and escalation paths.",
      testScripts: "Test monitoring alert configurations, verify response time requirements, and validate escalation procedures.",
      aiInsightsSummary: "Real-time monitoring systems are well-configured with effective alerting and appropriate response procedures.",
      humanInsightsSummary: "",
      description: "Comprehensive real-time monitoring ensures system availability and performance optimization.",
      expectedEvidence: "Monitoring dashboard reports, alert configuration files, and incident response logs."
    }
  ],
  "CER-10901": [
    {
      id: "ts-1",
      title: "TS-340001",
      name: "Review Identity Management Controls",
      control: "CTRL-10901-ID",
      controlName: "Identity Management Framework",
      risk: "medium",
      status: "finished",
      confidence: 82,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Identity management systems require multi-factor authentication and regular access reviews with automated provisioning.",
      testScripts: "Verify identity management system implementation, test MFA requirements, and validate automated provisioning processes.",
      aiInsightsSummary: "Identity management controls are effective with proper authentication and automated provisioning capabilities.",
      humanInsightsSummary: "",
      description: "Identity management framework ensures secure user authentication and access control across all systems.",
      expectedEvidence: "Identity management system logs, MFA configuration reports, and access provisioning documentation."
    },
    {
      id: "ts-2",
      title: "TS-340002",
      name: "Test Vulnerability Assessment Controls",
      control: "CTRL-10901-VUL",
      controlName: "Vulnerability Assessment Process",
      risk: "high",
      status: "finished",
      confidence: 88,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Regular vulnerability assessments with quarterly scans and timely remediation of critical findings.",
      testScripts: "Review vulnerability assessment procedures, verify quarterly scanning schedules, and validate remediation timelines.",
      aiInsightsSummary: "Vulnerability assessment processes are comprehensive with regular scanning and effective remediation procedures.",
      humanInsightsSummary: "",
      description: "Systematic vulnerability assessment ensures proactive identification and remediation of security weaknesses.",
      expectedEvidence: "Vulnerability scan reports, remediation tracking logs, and quarterly assessment summaries."
    }
  ],
  "CER-10923": [
    {
      id: "ts-1",
      title: "TS-341001",
      name: "Review Asset Management Controls",
      control: "CTRL-10923-AST",
      controlName: "Asset Management Framework",
      risk: "medium",
      status: "finished",
      confidence: 79,
      disposition: "Partially Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Asset inventory management with automated discovery and lifecycle tracking for all IT assets.",
      testScripts: "Verify asset inventory accuracy, test automated discovery processes, and validate lifecycle management procedures.",
      aiInsightsSummary: "Asset management controls are generally effective but some improvements needed in automated discovery accuracy.",
      humanInsightsSummary: "",
      description: "Comprehensive asset management ensures accurate inventory and lifecycle control of all IT resources.",
      expectedEvidence: "Asset inventory reports, automated discovery logs, and lifecycle management documentation."
    },
    {
      id: "ts-2",
      title: "TS-341002",
      name: "Test Configuration Management Controls",
      control: "CTRL-10923-CFG",
      controlName: "Configuration Management Process",
      risk: "high",
      status: "finished",
      confidence: 85,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Configuration management with version control and change tracking for all system configurations.",
      testScripts: "Review configuration management procedures, verify version control implementation, and validate change tracking processes.",
      aiInsightsSummary: "Configuration management controls are robust with effective version control and comprehensive change tracking.",
      humanInsightsSummary: "",
      description: "Systematic configuration management ensures consistent and controlled system configurations across environments.",
      expectedEvidence: "Configuration baselines, version control logs, and change management documentation."
    }
  ],
  "CER-10956": [
    {
      id: "ts-1",
      title: "TS-342001",
      name: "Review Patch Management Controls",
      control: "CTRL-10956-PATCH",
      controlName: "Patch Management Process",
      risk: "high",
      status: "finished",
      confidence: 91,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Patch management with automated deployment and testing procedures for critical security updates.",
      testScripts: "Verify patch management procedures, test automated deployment systems, and validate testing protocols.",
      aiInsightsSummary: "Patch management controls are excellent with automated deployment and comprehensive testing procedures.",
      humanInsightsSummary: "",
      description: "Systematic patch management ensures timely deployment of security updates with proper testing protocols.",
      expectedEvidence: "Patch deployment logs, testing results, and update scheduling documentation."
    },
    {
      id: "ts-2",
      title: "TS-342002",
      name: "Test Monitoring System Controls",
      control: "CTRL-10956-MON",
      controlName: "System Monitoring Framework",
      risk: "medium",
      status: "finished",
      confidence: 83,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Continuous system monitoring with alerting and automated response capabilities for security events.",
      testScripts: "Review monitoring system configuration, test alerting mechanisms, and validate automated response procedures.",
      aiInsightsSummary: "System monitoring controls are effective with comprehensive alerting and appropriate automated response capabilities.",
      humanInsightsSummary: "",
      description: "Continuous monitoring ensures proactive detection and response to system security events and anomalies.",
      expectedEvidence: "Monitoring system logs, alert configuration files, and automated response documentation."
    }
  ],
  "CER-11089": [
    {
      id: "ts-1",
      title: "TS-343001",
      name: "Review Data Loss Prevention Controls",
      control: "CTRL-11089-DLP",
      controlName: "Data Loss Prevention Framework",
      risk: "high",
      status: "finished",
      confidence: 87,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Data loss prevention with content inspection and policy enforcement across all data transmission channels.",
      testScripts: "Verify DLP policy configuration, test content inspection accuracy, and validate enforcement mechanisms.",
      aiInsightsSummary: "Data loss prevention controls are robust with effective content inspection and comprehensive policy enforcement.",
      humanInsightsSummary: "",
      description: "Comprehensive data loss prevention protects sensitive data across all transmission and storage channels.",
      expectedEvidence: "DLP policy documents, inspection logs, and enforcement activity reports."
    },
    {
      id: "ts-2",
      title: "TS-343002",
      name: "Test Data Classification Controls",
      control: "CTRL-11089-CLASS",
      controlName: "Data Classification Process",
      risk: "medium",
      status: "finished",
      confidence: 84,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Data classification with automated tagging and handling procedures for different sensitivity levels.",
      testScripts: "Review data classification procedures, test automated tagging systems, and validate handling protocols.",
      aiInsightsSummary: "Data classification controls are effective with proper automated tagging and appropriate handling procedures.",
      humanInsightsSummary: "",
      description: "Systematic data classification ensures appropriate protection and handling based on sensitivity levels.",
      expectedEvidence: "Data classification policies, automated tagging logs, and handling procedure documentation."
    }
  ],
  "CER-11156": [
    {
      id: "ts-1",
      title: "TS-344001",
      name: "Review Encryption Key Management Controls",
      control: "CTRL-11156-KEY",
      controlName: "Encryption Key Management",
      risk: "high",
      status: "finished",
      confidence: 93,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Encryption key management with secure generation, storage, and rotation procedures for all cryptographic keys.",
      testScripts: "Verify key generation procedures, test secure storage mechanisms, and validate rotation schedules.",
      aiInsightsSummary: "Encryption key management controls are excellent with secure procedures and automated rotation capabilities.",
      humanInsightsSummary: "",
      description: "Comprehensive key management ensures secure generation, storage, and rotation of all encryption keys.",
      expectedEvidence: "Key management policies, generation logs, storage audit trails, and rotation schedules."
    },
    {
      id: "ts-2",
      title: "TS-344002",
      name: "Test Security Operations Center Controls",
      control: "CTRL-11156-SOC",
      controlName: "Security Operations Center",
      risk: "high",
      status: "finished",
      confidence: 89,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Security operations center with 24/7 monitoring and incident response capabilities.",
      testScripts: "Review SOC procedures, test monitoring capabilities, and validate incident response times.",
      aiInsightsSummary: "Security operations center controls are robust with comprehensive monitoring and effective incident response.",
      humanInsightsSummary: "",
      description: "24/7 security operations center provides continuous monitoring and rapid incident response capabilities.",
      expectedEvidence: "SOC operational procedures, monitoring logs, and incident response documentation."
    }
  ],
  "CER-11203": [
    {
      id: "ts-1",
      title: "TS-345001",
      name: "Review Cloud Security Controls",
      control: "CTRL-11203-CLOUD",
      controlName: "Cloud Security Framework",
      risk: "medium",
      status: "finished",
      confidence: 86,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Cloud security with proper configuration management and continuous compliance monitoring.",
      testScripts: "Verify cloud security configurations, test compliance monitoring tools, and validate security baselines.",
      aiInsightsSummary: "Cloud security controls are effective with proper configuration management and continuous monitoring.",
      humanInsightsSummary: "",
      description: "Comprehensive cloud security ensures proper configuration and continuous compliance across cloud environments.",
      expectedEvidence: "Cloud security configurations, compliance monitoring reports, and security baseline documentation."
    },
    {
      id: "ts-2",
      title: "TS-345002",
      name: "Test Container Security Controls",
      control: "CTRL-11203-CONT",
      controlName: "Container Security Framework",
      risk: "high",
      status: "finished",
      confidence: 82,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Container security with image scanning and runtime protection for containerized applications.",
      testScripts: "Review container security policies, test image scanning procedures, and validate runtime protection mechanisms.",
      aiInsightsSummary: "Container security controls are adequate with effective image scanning and runtime protection capabilities.",
      humanInsightsSummary: "",
      description: "Container security framework protects containerized applications through scanning and runtime monitoring.",
      expectedEvidence: "Container security policies, image scan results, and runtime protection logs."
    }
  ],
  "CER-11278": [
    {
      id: "ts-1",
      title: "TS-346001",
      name: "Review Threat Intelligence Controls",
      control: "CTRL-11278-THREAT",
      controlName: "Threat Intelligence Framework",
      risk: "medium",
      status: "finished",
      confidence: 80,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Threat intelligence with automated feeds and integration into security monitoring systems.",
      testScripts: "Verify threat intelligence feed integration, test automated processing, and validate monitoring system integration.",
      aiInsightsSummary: "Threat intelligence controls are effective with proper feed integration and automated processing capabilities.",
      humanInsightsSummary: "",
      description: "Threat intelligence framework provides automated threat data integration for enhanced security monitoring.",
      expectedEvidence: "Threat intelligence feed configurations, processing logs, and integration documentation."
    },
    {
      id: "ts-2",
      title: "TS-346002",
      name: "Test Security Awareness Training Controls",
      control: "CTRL-11278-TRAIN",
      controlName: "Security Awareness Training",
      risk: "low",
      status: "finished",
      confidence: 77,
      disposition: "Partially Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Security awareness training with regular updates and testing procedures for all personnel.",
      testScripts: "Review training program content, verify update procedures, and validate testing mechanisms.",
      aiInsightsSummary: "Security awareness training controls are generally adequate but improvements needed in testing effectiveness.",
      humanInsightsSummary: "",
      description: "Security awareness training ensures all personnel understand current security threats and procedures.",
      expectedEvidence: "Training program documentation, completion records, and testing results."
    }
  ],
  "CER-11324": [
    {
      id: "ts-1",
      title: "TS-347001",
      name: "Review Incident Response Controls",
      control: "CTRL-11324-IR",
      controlName: "Incident Response Framework",
      risk: "high",
      status: "finished",
      confidence: 91,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Incident response with defined procedures and regular testing for all types of security incidents.",
      testScripts: "Review incident response procedures, test response capabilities, and validate communication protocols.",
      aiInsightsSummary: "Incident response controls are excellent with comprehensive procedures and effective testing protocols.",
      humanInsightsSummary: "",
      description: "Comprehensive incident response framework ensures effective handling of all security incidents.",
      expectedEvidence: "Incident response procedures, test results, and communication protocol documentation."
    },
    {
      id: "ts-2",
      title: "TS-347002",
      name: "Test Forensic Investigation Controls",
      control: "CTRL-11324-FORENSIC",
      controlName: "Digital Forensics Framework",
      risk: "medium",
      status: "finished",
      confidence: 85,
      disposition: "Satisfactory",
      confidenceStatus: "finished",
      thirdPartyRequirements: "Digital forensics capabilities with proper evidence preservation and investigation procedures.",
      testScripts: "Review forensic procedures, test evidence preservation methods, and validate investigation capabilities.",
      aiInsightsSummary: "Digital forensics controls are robust with proper evidence handling and investigation procedures.",
      humanInsightsSummary: "",
      description: "Digital forensics framework supports incident investigation through proper evidence preservation and analysis.",
      expectedEvidence: "Forensic procedures, evidence handling logs, and investigation documentation."
    }
  ]
};

export const scriptMap: Record<string, Record<string, string>> = {
  "CER-10234": {
    "ts-1": "TS-324472",
    "ts-2": "TS-324473",
    "ts-3": "TS-324474",
    "ts-4": "TS-324475",
    "ts-5": "TS-324476",
    "ts-6": "TS-324477"
  },
  "CER-10567": {
    "ts-1": "TS-325001",
    "ts-2": "TS-325002",
    "ts-3": "TS-325003",
    "ts-4": "TS-325004",
    "ts-5": "TS-325005",
    "ts-6": "TS-325006"
  },
  "CER-10892": {
    "ts-1": "TS-326001",
    "ts-2": "TS-326002",
    "ts-3": "TS-326003",
    "ts-4": "TS-326004",
    "ts-5": "TS-326005",
    "ts-6": "TS-326006"
  },
  "CER-11001": {
    "ts-1": "TS-327001",
    "ts-2": "TS-327002"
  },
  "CER-11234": {
    "ts-1": "TS-328001",
    "ts-2": "TS-328002"
  },
  "CER-11567": {
    "ts-1": "TS-329001",
    "ts-2": "TS-329002"
  },
  "CER-11892": {
    "ts-1": "TS-330001",
    "ts-2": "TS-330002"
  },
  "CER-12001": {
    "ts-1": "TS-331001",
    "ts-2": "TS-331002"
  },
  "CER-12234": {
    "ts-1": "TS-332001",
    "ts-2": "TS-332002"
  },
  "CER-12567": {
    "ts-1": "TS-333001",
    "ts-2": "TS-333002"
  },
  "CER-10901": {
    "ts-1": "TS-340001",
    "ts-2": "TS-340002"
  },
  "CER-10923": {
    "ts-1": "TS-341001",
    "ts-2": "TS-341002"
  },
  "CER-10956": {
    "ts-1": "TS-342001",
    "ts-2": "TS-342002"
  },
  "CER-11089": {
    "ts-1": "TS-343001",
    "ts-2": "TS-343002"
  },
  "CER-11156": {
    "ts-1": "TS-344001",
    "ts-2": "TS-344002"
  },
  "CER-11203": {
    "ts-1": "TS-345001",
    "ts-2": "TS-345002"
  },
  "CER-11278": {
    "ts-1": "TS-346001",
    "ts-2": "TS-346002"
  },
  "CER-11324": {
    "ts-1": "TS-347001",
    "ts-2": "TS-347002"
  }
};

export const vendorMap: Record<string, any> = {
  "CER-10234": {
    vendor: "Amazon Web Services",
    riskLevel: "High",
    confidence: 92,
    status: "finished"
  },
  "CER-10567": {
    vendor: "Microsoft Azure",
    riskLevel: "High",
    confidence: 81,
    previousConfidence: 45,
    status: "repopulated"
  },
  "CER-10892": {
    vendor: "Google Cloud Platform",
    riskLevel: "Medium",
    confidence: 58,
    status: "in-progress"
  },
  "CER-11001": {
    vendor: "Oracle Corporation",
    riskLevel: "Medium",
    confidence: 86,
    status: "finished"
  },
  "CER-11234": {
    vendor: "Salesforce Inc",
    riskLevel: "High",
    confidence: 89,
    status: "finished"
  },
  "CER-11567": {
    vendor: "IBM Cloud",
    riskLevel: "Medium",
    confidence: 84,
    status: "finished"
  },
  "CER-10901": {
    vendor: "Adobe Systems",
    riskLevel: "Low",
    confidence: 85,
    status: "finished"
  },
  "CER-10923": {
    vendor: "Atlassian Corp",
    riskLevel: "Medium",
    confidence: 82,
    status: "finished"
  },
  "CER-10956": {
    vendor: "Zoom Video",
    riskLevel: "Low",
    confidence: 87,
    status: "finished"
  },
  "CER-11089": {
    vendor: "Slack Technologies",
    riskLevel: "Medium",
    confidence: 85,
    status: "finished"
  },
  "CER-11156": {
    vendor: "Box Inc",
    riskLevel: "High",
    confidence: 91,
    status: "finished"
  },
  "CER-11203": {
    vendor: "HubSpot Inc",
    riskLevel: "Low",
    confidence: 84,
    status: "finished"
  },
  "CER-11278": {
    vendor: "Dropbox Inc",
    riskLevel: "Medium",
    confidence: 78,
    status: "finished"
  },
  "CER-11324": {
    vendor: "Zendesk Inc",
    riskLevel: "High",
    confidence: 88,
    status: "finished"
  }
};
